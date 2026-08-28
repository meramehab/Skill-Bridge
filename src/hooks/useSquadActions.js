/**
 * @file useSquadActions.js
 * @description Hook managing squad creation (with async debounce name availability check),
 * join request applications, squad leader request moderation, and AI candidate recommendations.
 */
import { useState, useCallback, useRef } from "react";
import * as squadService from "../services/squadService";
import { validateSquadForm, validateSquadField } from "../utils/validation/squadValidators";

export function useSquadActions(squadId = null) {
  // Create Squad Form State
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    maxMembers: 5,
    neededSkills: []
  });

  const [createErrors, setCreateErrors] = useState({});
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameAvailability, setNameAvailability] = useState(null); // { isAvailable: boolean, message: string }
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Apply to Squad State
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);

  // Leader Join Requests State
  const [joinRequests, setJoinRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState(null);

  // AI Member Recommendations State
  const [aiCandidates, setAiCandidates] = useState([]);
  const [isLoadingAiCandidates, setIsLoadingAiCandidates] = useState(false);

  // Debounced Name Check Timer
  const nameCheckDebounceTimer = useRef(null);

  // Handle Create Form Input Change with Async Name Check
  const handleCreateChange = useCallback((e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));

    // Reset synchronous error on change
    setCreateErrors((prev) => {
      if (!prev[name]) return prev;
      const fieldError = validateSquadField(name, value);
      return { ...prev, [name]: fieldError };
    });

    // Async debounce check for squad name uniqueness
    if (name === "name") {
      setNameAvailability(null);
      clearTimeout(nameCheckDebounceTimer.current);

      if (value.trim().length >= 3) {
        setIsCheckingName(true);
        nameCheckDebounceTimer.current = setTimeout(async () => {
          try {
            const res = await squadService.checkSquadNameAvailability(value.trim());
            setNameAvailability(res);
            if (!res.isAvailable) {
              setCreateErrors((prev) => ({ ...prev, name: res.message }));
            }
          } catch (err) {
            // Ignore debounce check errors
          } finally {
            setIsCheckingName(false);
          }
        }, 400);
      } else {
        setIsCheckingName(false);
      }
    }
  }, []);

  // Submit Create Squad
  const handleCreateSquad = useCallback(
    async (onSuccess) => {
      const { isValid, errors } = validateSquadForm(createFormData);
      if (!isValid || (nameAvailability && !nameAvailability.isAvailable)) {
        setCreateErrors({
          ...errors,
          ...(nameAvailability && !nameAvailability.isAvailable ? { name: nameAvailability.message } : {})
        });
        return;
      }

      setIsSubmittingCreate(true);
      try {
        const newSquad = await squadService.createSquad(createFormData);
        if (onSuccess) onSuccess(newSquad);
        return newSquad;
      } catch (err) {
        setCreateErrors((prev) => ({ ...prev, general: err?.message || "فشل إنشاء الفريق." }));
        throw err;
      } finally {
        setIsSubmittingCreate(false);
      }
    },
    [createFormData, nameAvailability]
  );

  // Apply to Squad
  const handleApplyToSquad = useCallback(async (targetSquadId, message) => {
    setIsApplying(true);
    setApplyError(null);
    try {
      const res = await squadService.applyToSquad(targetSquadId, message);
      return res;
    } catch (err) {
      setApplyError(err?.message || "تعذر إرسال طلب الانضمام.");
      throw err;
    } finally {
      setIsApplying(false);
    }
  }, []);

  // Leader: Fetch Join Requests
  const fetchJoinRequests = useCallback(async (targetSquadId = squadId) => {
    if (!targetSquadId) return;
    setIsLoadingRequests(true);
    setRequestsError(null);
    try {
      const requests = await squadService.getSquadJoinRequests(targetSquadId);
      setJoinRequests(requests);
    } catch (err) {
      setRequestsError("فشل تحميل طلبات الانضمام المعلقة.");
    } finally {
      setIsLoadingRequests(false);
    }
  }, [squadId]);

  // Leader: Accept or Reject Request
  const handleModerateRequest = useCallback(async (requestId, action) => {
    try {
      await squadService.handleJoinRequest(requestId, action);
      // Remove or update locally
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      alert("فشل تحديث حالة الطلب.");
    }
  }, []);

  // AI Squad Member Recommendations
  const fetchAiRecommendations = useCallback(async (targetSquadId = squadId) => {
    if (!targetSquadId) return;
    setIsLoadingAiCandidates(true);
    try {
      const candidates = await squadService.getAiSquadRecommendations(targetSquadId);
      setAiCandidates(candidates);
    } catch (err) {
      console.warn("AI candidates fetch failed:", err);
    } finally {
      setIsLoadingAiCandidates(false);
    }
  }, [squadId]);

  return {
    createFormData,
    createErrors,
    isCheckingName,
    nameAvailability,
    isSubmittingCreate,
    isApplying,
    applyError,
    joinRequests,
    isLoadingRequests,
    requestsError,
    aiCandidates,
    isLoadingAiCandidates,
    handleCreateChange,
    handleCreateSquad,
    handleApplyToSquad,
    fetchJoinRequests,
    handleModerateRequest,
    fetchAiRecommendations
  };
}

export default useSquadActions;
