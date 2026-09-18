/**
 * @file useAdminDashboard.js
 * @description Hook managing admin dashboard statistics, activity feed, and disputes.
 */
import { useState, useCallback } from "react";
import { useAsyncState } from "./useAsyncState";
import * as adminService from "../services/adminService";

export function useAdminDashboard() {
  const {
    data,
    isLoading,
    isError,
    isEmpty,
    error,
    refetch
  } = useAsyncState(adminService.getAdminDashboardData, []);

  const [disputes, setDisputes] = useState([]);
  const [isResolving, setIsResolving] = useState(false);

  const stats = data?.stats || [];
  const recentActivities = data?.recentActivities || [];
  const activeDisputes = disputes.length > 0 ? disputes : (data?.disputes || []);

  const handleResolveDispute = useCallback(async (disputeId) => {
    setIsResolving(true);
    try {
      await adminService.resolveDispute(disputeId);
      setDisputes((prev) => prev.filter((d) => d.id !== disputeId));
    } catch (err) {
      console.error("Error resolving dispute:", err);
    } finally {
      setIsResolving(false);
    }
  }, []);

  const handleExportReport = useCallback(() => {
    // Client-side export simulation / dispatch
    const reportData = JSON.stringify({ stats, recentActivities, disputes: activeDisputes }, null, 2);
    const blob = new Blob([reportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SkillBridge-Admin-Report-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [stats, recentActivities, activeDisputes]);

  return {
    stats,
    recentActivities,
    disputes: activeDisputes,
    isLoading,
    isError,
    isEmpty,
    error,
    isResolving,
    refetch,
    resolveDispute: handleResolveDispute,
    exportReport: handleExportReport
  };
}

export default useAdminDashboard;
