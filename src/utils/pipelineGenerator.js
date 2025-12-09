// Pipeline Generator Utility
// Automatically generates realistic pipelines when new apps/sources are connected

/**
 * Generates a realistic pipeline configuration based on the connected app
 * @param {string} appId - The ID of the connected app (e.g., 'zoho', 'odoo', 'googlesheets')
 * @param {string} appName - The display name of the app
 * @param {object} config - Additional configuration for the pipeline
 * @returns {object} Pipeline configuration with nodes and edges
 */
export function generatePipelineForApp(appId, appName, config = {}) {
  const timestamp = new Date().toISOString();
  const pipelineId = `pipeline-${appId}-${Date.now()}`;

  // Define pipeline templates based on app type
  const pipelineTemplates = {
    zoho: {
      name: `${appName} Lead Sync & Enrichment`,
      description: `Syncs new leads from ${appName}, filters for qualified prospects, enriches data, and notifies your team.`,
      status: 'running',
      nodes: [
        { 
          id: '1', 
          type: 'default', 
          position: { x: 100, y: 200 }, 
          data: { label: `${appName}: New Leads`, nodeKind: 'api' } 
        },
        { 
          id: '2', 
          type: 'default', 
          position: { x: 350, y: 200 }, 
          data: { label: 'Filter: Status=Open', nodeKind: 'filter' } 
        },
        { 
          id: '3', 
          type: 'default', 
          position: { x: 600, y: 200 }, 
          data: { label: 'Enrich: Data Lookup', nodeKind: 'lookup' } 
        },
        { 
          id: '4', 
          type: 'default', 
          position: { x: 850, y: 100 }, 
          data: { label: 'Slack: Notify Sales', nodeKind: 'notification' } 
        },
        { 
          id: '5', 
          type: 'default', 
          position: { x: 850, y: 300 }, 
          data: { label: `${appName}: Update Lead`, nodeKind: 'api' } 
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
        { id: 'e3-5', source: '3', target: '5', animated: true },
      ]
    },
    
    odoo: {
      name: `${appName} Order Processing`,
      description: `Real-time order processing flow: Checks inventory levels for new orders, auto-generates invoices if in stock, or triggers procurement alerts.`,
      status: 'running',
      nodes: [
        { 
          id: '1', 
          type: 'default', 
          position: { x: 100, y: 250 }, 
          data: { label: `${appName}: New Order`, nodeKind: 'api' } 
        },
        { 
          id: '2', 
          type: 'default', 
          position: { x: 350, y: 250 }, 
          data: { label: 'Check Inventory', nodeKind: 'conditional' } 
        },
        { 
          id: '3', 
          type: 'default', 
          position: { x: 600, y: 150 }, 
          data: { label: `${appName}: Create Invoice`, nodeKind: 'api' } 
        },
        { 
          id: '4', 
          type: 'default', 
          position: { x: 850, y: 150 }, 
          data: { label: 'Email: Warehouse', nodeKind: 'email' } 
        },
        { 
          id: '5', 
          type: 'default', 
          position: { x: 600, y: 350 }, 
          data: { label: 'Email: Procurement', nodeKind: 'email' } 
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', label: 'In Stock', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
        { id: 'e2-5', source: '2', target: '5', label: 'Out of Stock', animated: true },
      ]
    },
    
    googlesheets: {
      name: `${appName} to Data Warehouse ETL`,
      description: `Daily sync of data from ${appName}. Validates schema, aggregates metrics, and loads into your data warehouse for analytics.`,
      status: 'idle',
      nodes: [
        { 
          id: '1', 
          type: 'default', 
          position: { x: 100, y: 200 }, 
          data: { label: `${appName}: Sales Data`, nodeKind: 'api' } 
        },
        { 
          id: '2', 
          type: 'default', 
          position: { x: 350, y: 200 }, 
          data: { label: 'Validate Schema', nodeKind: 'filter' } 
        },
        { 
          id: '3', 
          type: 'default', 
          position: { x: 600, y: 200 }, 
          data: { label: 'Aggregate Metrics', nodeKind: 'aggregate' } 
        },
        { 
          id: '4', 
          type: 'default', 
          position: { x: 850, y: 200 }, 
          data: { label: 'BigQuery: Upload', nodeKind: 'bigquery' } 
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
      ]
    },
    
    urbanpiper: {
      name: `${appName} Order Aggregation`,
      description: `Aggregates orders from multiple food delivery platforms via ${appName}, normalizes data, and syncs to your POS system.`,
      status: 'running',
      nodes: [
        { 
          id: '1', 
          type: 'default', 
          position: { x: 100, y: 200 }, 
          data: { label: `${appName}: New Orders`, nodeKind: 'api' } 
        },
        { 
          id: '2', 
          type: 'default', 
          position: { x: 350, y: 200 }, 
          data: { label: 'Normalize Data', nodeKind: 'select' } 
        },
        { 
          id: '3', 
          type: 'default', 
          position: { x: 600, y: 100 }, 
          data: { label: 'POS: Sync Order', nodeKind: 'api' } 
        },
        { 
          id: '4', 
          type: 'default', 
          position: { x: 600, y: 300 }, 
          data: { label: 'Analytics: Log', nodeKind: 'warehouse' } 
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e2-4', source: '2', target: '4', animated: true },
      ]
    },
    
    api: {
      name: `${appName} API Data Pipeline`,
      description: `Fetches data from ${appName} API, validates and transforms it, then loads into your data warehouse for analysis.`,
      status: 'running',
      nodes: [
        { 
          id: '1', 
          type: 'default', 
          position: { x: 100, y: 200 }, 
          data: { label: `${appName}: Fetch Data`, nodeKind: 'api' } 
        },
        { 
          id: '2', 
          type: 'default', 
          position: { x: 350, y: 200 }, 
          data: { label: 'Validate Response', nodeKind: 'filter' } 
        },
        { 
          id: '3', 
          type: 'default', 
          position: { x: 600, y: 200 }, 
          data: { label: 'Transform Fields', nodeKind: 'select' } 
        },
        { 
          id: '4', 
          type: 'default', 
          position: { x: 850, y: 200 }, 
          data: { label: 'Load to Warehouse', nodeKind: 'warehouse' } 
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
      ]
    },
    
    excel: {
      name: `${appName} Excel Processing`,
      description: `Processes uploaded Excel file from ${appName}, cleanses and validates data, then updates your database records.`,
      status: 'idle',
      nodes: [
        { 
          id: '1', 
          type: 'default', 
          position: { x: 100, y: 200 }, 
          data: { label: `${appName}: Excel Upload`, nodeKind: 's3' } 
        },
        { 
          id: '2', 
          type: 'default', 
          position: { x: 350, y: 200 }, 
          data: { label: 'Parse & Clean', nodeKind: 'select' } 
        },
        { 
          id: '3', 
          type: 'default', 
          position: { x: 600, y: 200 }, 
          data: { label: 'Validate Data', nodeKind: 'filter' } 
        },
        { 
          id: '4', 
          type: 'default', 
          position: { x: 850, y: 200 }, 
          data: { label: 'Update Database', nodeKind: 'mysql' } 
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
      ]
    },
    
    // Default template for unknown apps
    default: {
      name: `${appName} Data Integration`,
      description: `Automated data pipeline for ${appName}. Fetches data, transforms it, and loads into your destination systems.`,
      status: 'idle',
      nodes: [
        { 
          id: '1', 
          type: 'default', 
          position: { x: 100, y: 200 }, 
          data: { label: `${appName}: Fetch Data`, nodeKind: 'api' } 
        },
        { 
          id: '2', 
          type: 'default', 
          position: { x: 350, y: 200 }, 
          data: { label: 'Transform Data', nodeKind: 'select' } 
        },
        { 
          id: '3', 
          type: 'default', 
          position: { x: 600, y: 200 }, 
          data: { label: 'Validate & Clean', nodeKind: 'filter' } 
        },
        { 
          id: '4', 
          type: 'default', 
          position: { x: 850, y: 200 }, 
          data: { label: 'Load to Database', nodeKind: 'mysql' } 
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
      ]
    }
  };

  // Get the appropriate template or use default
  const template = pipelineTemplates[appId] || pipelineTemplates.default;

  // Create the pipeline object
  const pipeline = {
    id: pipelineId,
    name: template.name,
    description: template.description,
    status: template.status,
    createdAt: timestamp,
    updatedAt: timestamp,
    appId: appId,
    appName: appName,
  };

  // Create the graph object
  const graph = {
    nodes: template.nodes,
    edges: template.edges,
  };

  return { pipeline, graph };
}

/**
 * Saves a generated pipeline to localStorage
 * @param {object} pipeline - The pipeline configuration
 * @param {object} graph - The pipeline graph (nodes and edges)
 */
export function savePipelineToStorage(pipeline, graph) {
  try {
    // Get existing workflows
    const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    
    // Check if pipeline already exists
    const existingIndex = workflows.findIndex(w => w.id === pipeline.id);
    
    if (existingIndex >= 0) {
      // Update existing pipeline
      workflows[existingIndex] = { ...workflows[existingIndex], ...pipeline };
    } else {
      // Add new pipeline
      workflows.push(pipeline);
    }
    
    // Save workflows
    localStorage.setItem('workflows', JSON.stringify(workflows));
    
    // Get existing graphs
    const graphs = JSON.parse(localStorage.getItem('workflowGraphs') || '{}');
    
    // Save graph
    graphs[pipeline.id] = graph;
    localStorage.setItem('workflowGraphs', JSON.stringify(graphs));
    
    return true;
  } catch (error) {
    console.error('Error saving pipeline to storage:', error);
    return false;
  }
}

/**
 * Generates and saves a pipeline when an app is connected
 * @param {string} appId - The ID of the connected app
 * @param {string} appName - The display name of the app
 * @param {object} config - Additional configuration
 * @returns {object} The generated pipeline and graph
 */
export function createPipelineForConnectedApp(appId, appName, config = {}) {
  const { pipeline, graph } = generatePipelineForApp(appId, appName, config);
  const saved = savePipelineToStorage(pipeline, graph);
  
  if (saved) {
    console.log(`✅ Pipeline created for ${appName}:`, pipeline.name);
    return { pipeline, graph, success: true };
  } else {
    console.error(`❌ Failed to create pipeline for ${appName}`);
    return { pipeline: null, graph: null, success: false };
  }
}
