import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import IntegrationStatus from "../components/integrations/IntegrationStatus";
import { useIntegration } from "../hooks/useIntegration";

const APPS_INFO = {
  odoo: {
    name: "Odoo ERP",
    logo: "https://lowendbox.com/wp-content/uploads/2022/09/odoo_logo_1200.png",  // Odoo logo URL alternative
  },
  urbanpiper: {
    name: "UrbanPiper POS",
    logo: "https://avatars.githubusercontent.com/u/83900836?s=280&v=4", // Alternative UrbanPiper logo
  },
  googlesheets: {
    name: "Google Sheets",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Sheets_logo_%282014-2020%29.svg/1200px-Google_Sheets_logo_%282014-2020%29.svg.png",
  },
  zoho: {
    name: "Zoho CRM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/ZOHO_logo_2023.svg/2560px-ZOHO_logo_2023.svg.png",
  },
};

const IntegrationStatusPage = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const {
    statusData,
    loading,
    syncing,
    fetchStatus,
    triggerSync,
    disconnect,
  } = useIntegration();

  const appInfo = APPS_INFO[appId] ? { ...APPS_INFO[appId], id: appId } : {
    name: "Unknown App",
    logo: "",
    id: appId
  };

  useEffect(() => {
    fetchStatus(appId);
  }, [appId, fetchStatus]);

  const handleResync = () => {
    triggerSync(appId);
  };

  const handleDisconnect = () => {
    disconnect(appId, () => navigate("/apps"));
  };

  if (loading[appId] && !statusData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate("/apps")}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Integrations
      </button>

      <IntegrationStatus
        app={appInfo}
        statusData={statusData}
        onResync={handleResync}
        onDisconnect={handleDisconnect}
        syncing={syncing}
      />
    </div>
  );
};

export default IntegrationStatusPage;
