import axios from "axios";

// Create a dedicated axios instance or use the global one if you have it.
// Assuming a global axios setup or relative paths if proxy is set up.
// If you have a specific base URL, set it here.

const API_BASE_URL = "/integrations"; // Adjust based on your proxy setup in vite.config.js

export const integrationService = {
  /**
   * Initialize OAuth flow for an app
   * @param {string} app - 'odoo' or 'urbanpiper'
   * @param {object} config - Additional config like tenantId, instanceUrl
   */
  initIntegration: async (app, config) => {
    const response = await axios.post(`${API_BASE_URL}/${app}/init`, config);
    return response.data; // Expected { oauthUrl }
  },

  /**
   * Get integration status
   * @param {string} app - 'odoo' or 'urbanpiper'
   */
  getIntegrationStatus: async (app) => {
    const response = await axios.get(`${API_BASE_URL}/${app}/status`);
    return response.data;
  },

  /**
   * Force re-sync
   * @param {string} app - 'odoo' or 'urbanpiper'
   */
  triggerSync: async (app) => {
    const response = await axios.post(`${API_BASE_URL}/${app}/resync`);
    return response.data;
  },

  /**
   * Disconnect integration
   * @param {string} app - 'odoo' or 'urbanpiper'
   */
  disconnectIntegration: async (app) => {
    const response = await axios.delete(`${API_BASE_URL}/${app}/disconnect`);
    return response.data;
  },

  /**
   * Get available data options for syncing
   * @param {string} app - 'odoo' or 'urbanpiper'
   */
  getDataOptions: async (app) => {
    // Mocking response for now as backend might not have this yet
    // In real implementation: const response = await axios.get(`${API_BASE_URL}/${app}/data-options`);
    // return response.data;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          options: [
            { id: "orders", label: "Sales Orders", checked: true },
            { id: "products", label: "Products & Variants", checked: true },
            { id: "customers", label: "Customers / Contacts", checked: true },
            { id: "inventory", label: "Inventory Levels", checked: false },
            { id: "invoices", label: "Invoices", checked: false },
          ]
        });
      }, 500);
    });
  },

  /**
   * Confirm integration setup with selected options
   * @param {string} app - 'odoo' or 'urbanpiper'
   * @param {object} data - { selectedOptions: [] }
   */
  confirmIntegration: async (app, data) => {
    const response = await axios.post(`${API_BASE_URL}/${app}/confirm`, data);
    return response.data
  },
};
