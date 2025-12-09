
export const demoPipelines = [
  {
    id: "pipeline-zoho-001",
    name: "Zoho CRM Lead Sync & Enrichment",
    description: "Syncs new leads from Zoho CRM, filters for qualified prospects, enriches data via Clearbit, and notifies Sales team on Slack.",
    status: "running",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pipeline-odoo-002",
    name: "Odoo ERP Order Processing",
    description: "Real-time order processing flow: Checks inventory levels for new orders, auto-generates invoices if in stock, or triggers procurement alerts.",
    status: "running",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pipeline-sheets-003",
    name: "Google Sheets to BigQuery ETL",
    description: "Daily sync of sales data from Google Sheets. Validates schema, aggregates regional performance, and loads into BigQuery for analytics.",
    status: "idle",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pipeline-mqtt-004",
    name: "IoT Sensor Monitoring (MQTT)",
    description: "Ingests real-time sensor data via MQTT. Aggregates temperature readings, checks for critical thresholds, and triggers PagerDuty alerts.",
    status: "running",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pipeline-excel-005",
    name: "Legacy Excel Upload Processor",
    description: "Handles manual Excel file uploads. Parses proprietary format, cleanses data, and updates master records in SQL database.",
    status: "idle",
    updatedAt: new Date().toISOString(),
  }
];

export const demoGraphs = {
  "pipeline-zoho-001": {
    nodes: [
      { 
        id: "1", 
        type: "default", 
        position: { x: 100, y: 200 }, 
        data: { 
          label: "Zoho CRM: New Leads", 
          nodeKind: "api",
          url: "https://www.zohoapis.com/crm/v2/Leads",
          method: "GET",
          authType: "oauth2",
          headers: '{\n  "Authorization": "Zoho-oauthtoken ...",\n  "Content-Type": "application/json"\n}',
          pagination: "cursor"
        } 
      },
      { 
        id: "2", 
        type: "default", 
        position: { x: 350, y: 200 }, 
        data: { 
          label: "Filter: Status=Open", 
          nodeKind: "filter",
          predicate: "return row.Lead_Status === 'Open' && row.Annual_Revenue > 50000;"
        } 
      },
      { 
        id: "3", 
        type: "default", 
        position: { x: 600, y: 200 }, 
        data: { 
          label: "Enrich: Clearbit", 
          nodeKind: "lookup",
          description: "Lookup company data via domain"
        } 
      },
      { 
        id: "4", 
        type: "default", 
        position: { x: 850, y: 100 }, 
        data: { 
          label: "Slack: Notify Sales", 
          nodeKind: "notification",
          description: "Send alert to #sales-leads"
        } 
      },
      { 
        id: "5", 
        type: "default", 
        position: { x: 850, y: 300 }, 
        data: { 
          label: "Zoho: Update Lead", 
          nodeKind: "api",
          url: "https://www.zohoapis.com/crm/v2/Leads",
          method: "PUT",
          authType: "oauth2",
          body: '{\n  "id": "{{row.id}}",\n  "Lead_Status": "Contacted"\n}'
        } 
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true },
      { id: "e3-5", source: "3", target: "5", animated: true },
    ]
  },
  "pipeline-odoo-002": {
    nodes: [
      { 
        id: "1", 
        type: "default", 
        position: { x: 100, y: 250 }, 
        data: { 
          label: "Odoo: New Order", 
          nodeKind: "api",
          url: "https://odoo-instance.com/api/sale.order",
          method: "GET",
          authType: "basic",
          user: "admin",
          parameters: "domain=[('state','=','prospect')]"
        } 
      },
      { id: "2", type: "default", position: { x: 350, y: 250 }, data: { label: "Check Inventory", nodeKind: "conditional" } },
      { 
        id: "3", 
        type: "default", 
        position: { x: 600, y: 150 }, 
        data: { 
          label: "Odoo: Create Invoice", 
          nodeKind: "api",
          url: "https://odoo-instance.com/api/account.move",
          method: "POST"
        } 
      },
      { id: "4", type: "default", position: { x: 850, y: 150 }, data: { label: "Email: Warehouse", nodeKind: "email" } },
      { id: "5", type: "default", position: { x: 600, y: 350 }, data: { label: "Email: Procurement", nodeKind: "email" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", label: "In Stock", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true },
      { id: "e2-5", source: "2", target: "5", label: "Out of Stock", animated: true },
    ]
  },
  "pipeline-sheets-003": {
    nodes: [
      { 
        id: "1", 
        type: "default", 
        position: { x: 100, y: 200 }, 
        data: { 
          label: "Google Sheets: Sales", 
          nodeKind: "api", 
          url: "https://sheets.googleapis.com/v4/spreadsheets/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/values/Sheet1",
          method: "GET",
          authType: "bearer"
        } 
      },
      { id: "2", type: "default", position: { x: 350, y: 200 }, data: { label: "Validate Schema", nodeKind: "filter" } },
      { id: "3", type: "default", position: { x: 600, y: 200 }, data: { label: "Agg: Sum by Region", nodeKind: "aggregate" } },
      { 
        id: "4", 
        type: "default", 
        position: { x: 850, y: 200 }, 
        data: { 
          label: "BigQuery: Upload", 
          nodeKind: "bigquery",
          table: "analytics_prod.daily_sales",
          syncMode: "append"
        } 
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true },
    ]
  },
  "pipeline-mqtt-004": {
    nodes: [
      { 
        id: "1", 
        type: "default", 
        position: { x: 100, y: 250 }, 
        data: { 
          label: "MQTT: Sensor Stream", 
          nodeKind: "kafka", 
          servers: "mqtt.factory-net.local:1883",
          topic: "sensors/temperature/line-1",
          groupId: "monitor-service-grp"
        } 
      },
      { id: "2", type: "default", position: { x: 350, y: 250 }, data: { label: "Window Agg (1m)", nodeKind: "aggregate" } },
      { id: "3", type: "default", position: { x: 600, y: 250 }, data: { label: "Check Threshold > 80C", nodeKind: "conditional" } },
      { id: "4", type: "default", position: { x: 850, y: 150 }, data: { label: "PagerDuty: Critical", nodeKind: "notification" } },
      { 
        id: "5", 
        type: "default", 
        position: { x: 850, y: 350 }, 
        data: { 
          label: "InfluxDB: Log", 
          nodeKind: "api",
          url: "http://influxdb:8086/write?db=sensors",
          method: "POST"
        } 
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", label: "Yes", animated: true, style: { stroke: '#ef4444' } },
      { id: "e3-5", source: "3", target: "5", label: "No", animated: true },
    ]
  },
  "pipeline-excel-005": {
    nodes: [
      { 
        id: "1", 
        type: "default", 
        position: { x: 100, y: 200 }, 
        data: { 
          label: "Upload: Monthly.xlsx", 
          nodeKind: "s3",
          bucket: "finance-uploads-secure",
          path: "monthly/2024/*.xlsx",
          region: "us-east-1"
        } 
      },
      { id: "2", type: "default", position: { x: 350, y: 200 }, data: { label: "Parse & Clean", nodeKind: "select" } },
      { id: "3", type: "default", position: { x: 600, y: 200 }, data: { label: "Join: Master Records", nodeKind: "join" } },
      { 
        id: "4", 
        type: "default", 
        position: { x: 850, y: 200 }, 
        data: { 
          label: "MySQL: Update DB", 
          nodeKind: "mysql", 
          host: "db-prod.internal",
          database: "erp_core",
          user: "loader_service",
          table: "financial_records",
          syncMode: "full"
        } 
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true },
    ]
  }
};
