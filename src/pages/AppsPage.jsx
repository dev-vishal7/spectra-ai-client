import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppCard from "../components/integrations/AppCard";
import ConnectModal from "../components/integrations/ConnectModal";
import { useIntegration } from "../hooks/useIntegration";

const APPS_CONFIG = [
  {
    id: "odoo",
    name: "Odoo ERP",
    description:
      "Connect your Odoo ERP to sync products, inventory, and orders in real-time. Supports Odoo 14+.",
    logo: "https://lowendbox.com/wp-content/uploads/2022/09/odoo_logo_1200.png",  // Odoo logo URL alternative
  },
  {
    id: "urbanpiper",
    name: "UrbanPiper POS",
    description:
      "Seamlessly integrate with UrbanPiper to manage orders from Zomato, Swiggy, and UberEats directly.",
    logo: "https://avatars.githubusercontent.com/u/83900836?s=280&v=4", // Alternative UrbanPiper logo
  },
  {
    id: "googlesheets",
    name: "Google Sheets",
    description:
      "Sync your data to Google Sheets for easy reporting and analysis. Automatically updates rows.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Sheets_logo_%282014-2020%29.svg/1200px-Google_Sheets_logo_%282014-2020%29.svg.png",
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    description:
      "Connect Zoho CRM to sync Leads, Contacts, and Deals. Select your data center region for secure access.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/ZOHO_logo_2023.svg/2560px-ZOHO_logo_2023.svg.png",
  },
];

const AppsPage = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState(APPS_CONFIG);
  const { initIntegration, fetchStatus, loading } = useIntegration();
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadStatuses = async () => {
      const updatedApps = await Promise.all(
        APPS_CONFIG.map(async (app) => {
          const status = await fetchStatus(app.id);
          return {
            ...app,
            connected:
              status?.status === "active" || status?.status === "connected",
            status: status?.status,
          };
        })
      );
      setApps(updatedApps);
    };

    loadStatuses();
  }, [fetchStatus]);

  const handleConnectClick = (appId) => {
    const app = apps.find((a) => a.id === appId);
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleConnectSubmit = async (appId, config) => {
    const result = await initIntegration(appId, config);
    // If initIntegration returns true (success) and no redirect happened (credential auth)
    // We should navigate to configure page
    // Note: initIntegration in hook handles redirect if oauthUrl is present.
    // We need to know if we should navigate manually.
    // Let's modify hook to return the response or status.
    
    // Actually, hook returns nothing but handles redirect.
    // If it was credential auth (Odoo), it might just succeed.
    // We can check if we are still here.
    
    if (result && !result.oauthUrl) {
       setIsModalOpen(false);
       navigate(`/apps/${appId}/configure`);
    }
  };

  const handleViewStatus = (appId) => {
    navigate(`/apps/${appId}/status`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
        <p className="text-gray-400">
          Connect your favorite tools to sync data automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            onConnect={handleConnectClick}
            onViewStatus={handleViewStatus}
          />
        ))}
      </div>

      <ConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        app={selectedApp}
        onConnect={handleConnectSubmit}
        loading={selectedApp ? loading[selectedApp.id] : false}
      />
    </div>
  );
};

export default AppsPage;
