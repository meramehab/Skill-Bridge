/**
 * @file useCVAnalysis.js
 * @description Hook managing CV file upload, drag-and-drop state, AI analysis trigger, and results rendering.
 */
import { useState, useCallback, useRef } from "react";
import { aiService } from "../services/aiService";

export function useCVAnalysis() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback((event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  const getLevelColor = useCallback((level) => {
    const colors = {
      Beginner: "text-gray-500",
      Intermediate: "text-yellow-500",
      Advanced: "text-blue-500",
      Expert: "text-purple-500"
    };
    return colors[level] || "text-gray-500";
  }, []);

  const analyzeCV = useCallback(async () => {
    if (!selectedFile) return;

    setError(null);
    setResults(null);
    setIsLoading(true);

    try {
      const response = await aiService.analyzeCV(selectedFile);
      setResults({
        score: response.score || 75,
        level: response.level || "متقدم",
        skills: response.skills || [
          { name: "React.js", level: "Advanced", score: 85 },
          { name: "Vue.js", level: "Intermediate", score: 70 },
          { name: "JavaScript", level: "Advanced", score: 80 },
          { name: "Python", level: "Intermediate", score: 65 }
        ],
        missingSkills: response.missingSkills || ["Node.js", "TypeScript", "GraphQL"],
        recommendations: response.recommendations || [
          "تعلم Node.js لتصبح Full-Stack Developer",
          "أضف مشاريع عملية إلى بروفايلك",
          "شارك في مشاريع مفتوحة المصدر"
        ]
      });
    } catch (err) {
      setError("حدث خطأ أثناء تحليل السيرة الذاتية. حاول مرة أخرى.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  return {
    fileInputRef,
    selectedFile,
    isDragging,
    isLoading,
    results,
    error,
    handleFileUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    clearFile,
    analyzeCV,
    formatFileSize,
    getLevelColor,
    setError
  };
}

export default useCVAnalysis;
