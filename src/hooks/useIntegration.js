import { useState, useCallback } from "react";
import { integrationService } from "../services/integrations/integrationService";
import toast from "react-hot-toast";

export const useIntegration = () => {
  const [loading, setLoading] = useState({});
  const [statusData, setStatusData] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const initIntegration = useCallback(async (appId, config = {}) => {
    setLoading((prev) => ({ ...prev, [appId]: true }));
    try {
      const { oauthUrl } = await integrationService.initIntegration(
        appId,
        config
      );
      if (oauthUrl) {
        window.location.href = oauthUrl;
        return { oauthUrl };
      } else {
        // Assume success if no oauthUrl (credential auth)
        return { success: true };
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to initialize integration"
      );
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, [appId]: false }));
    }
  }, []);

  const fetchStatus = useCallback(async (appId) => {
    setLoading((prev) => ({ ...prev, [appId]: true }));
    try {
      const data = await integrationService.getIntegrationStatus(appId);
      setStatusData(data);
      return data;
    } catch (error) {
      console.error(error);
      // Don't toast here as it might be used for list view where some might fail
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, [appId]: false }));
    }
  }, []);

  const triggerSync = useCallback(async (appId) => {
    setSyncing(true);
    try {
      await integrationService.triggerSync(appId);
      toast.success("Sync started successfully");
      // Refresh status after a short delay
      setTimeout(() => fetchStatus(appId), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to trigger sync");
    } finally {
      setSyncing(false);
    }
  }, [fetchStatus]);

  const disconnect = useCallback(async (appId, onSuccess) => {
    if (
      !window.confirm(
        "Are you sure you want to disconnect? This will stop all data syncing."
      )
    )
      return;

    setLoading((prev) => ({ ...prev, [appId]: true }));
    try {
      await integrationService.disconnectIntegration(appId);
      toast.success("Disconnected successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to disconnect");
    } finally {
      setLoading((prev) => ({ ...prev, [appId]: false }));
    }
  }, []);

  return {
    loading,
    syncing,
    statusData,
    initIntegration,
    fetchStatus,
    triggerSync,
    disconnect,
  };
};
