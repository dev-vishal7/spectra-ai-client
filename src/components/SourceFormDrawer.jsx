import { useEffect, useState } from "react";
import { X, Plus, Trash2, Tag, Upload, File, Zap, Check } from "lucide-react";
import axios from "axios";

const SOURCE_TYPES = ["MQTT", "Modbus TCP", "RS485", "Excel Upload", "API"];

const SourceFormDrawer = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [source, setSource] = useState({
    name: "",
    protocol: "MQTT",
    config: {},
    apiConfig: {},
  });

  const [topics, setTopics] = useState([""]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [apiHeaders, setApiHeaders] = useState([{ key: "", value: "" }]);
  const [testingAPI, setTestingAPI] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (initialData) {
      setSource(initialData);

      if (initialData.config.topic) {
        const topicArray = Array.isArray(initialData.config.topic)
          ? initialData.config.topic
          : [initialData.config.topic];
        setTopics(topicArray);
      }

      if (initialData.config.tags) {
        setTags(initialData.config.tags);
      }

      if (initialData.protocol === "Excel Upload" && initialData.fileInfo) {
        setFilePreview(initialData.fileInfo);
      }

      if (initialData.protocol === "API" && initialData.apiConfig) {
        if (initialData.apiConfig.headers) {
          const headerArray = Object.entries(initialData.apiConfig.headers).map(
            ([key, value]) => ({ key, value })
          );
          setApiHeaders(
            headerArray.length > 0 ? headerArray : [{ key: "", value: "" }]
          );
        }
      }
    } else {
      setSource({ name: "", protocol: "MQTT", config: {}, apiConfig: {} });
      setTopics([""]);
      setTags([]);
      setSelectedFile(null);
      setFilePreview(null);
      setApiHeaders([{ key: "", value: "" }]);
      setTestResult(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setSource((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "protocol") {
      setSelectedFile(null);
      setFilePreview(null);
      setTestResult(null);
    }
  };

  const handleConfigChange = (key, value) => {
    setSource((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const handleApiConfigChange = (key, value) => {
    setSource((prev) => ({
      ...prev,
      apiConfig: {
        ...prev.apiConfig,
        [key]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview({
        originalName: file.name,
        fileSize: file.size,
      });
    }
  };

  const addHeader = () => {
    setApiHeaders([...apiHeaders, { key: "", value: "" }]);
  };

  const removeHeader = (index) => {
    if (apiHeaders.length > 1) {
      setApiHeaders(apiHeaders.filter((_, i) => i !== index));
    }
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...apiHeaders];
    newHeaders[index][field] = value;
    setApiHeaders(newHeaders);
  };

  const testAPIConnection = async () => {
    setTestingAPI(true);
    setTestResult(null);

    try {
      const headers = {};
      apiHeaders.forEach((h) => {
        if (h.key && h.value) headers[h.key] = h.value;
      });

      const testConfig = {
        url: source.apiConfig.url,
        method: source.apiConfig.method || "GET",
        headers,
        auth: source.apiConfig.auth || { type: "none" },
        dataPath: source.apiConfig.dataPath,
      };

      if (source.apiConfig.method === "POST" && source.apiConfig.body) {
        try {
          testConfig.body = JSON.parse(source.apiConfig.body);
        } catch (err) {
          setTestResult({ success: false, error: "Invalid JSON body" });
          setTestingAPI(false);
          return;
        }
      }

      const response = await axios.post("/sources/test-api", {
        apiConfig: testConfig,
      });
      setTestResult(response.data);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.response?.data?.error || error.message,
      });
    } finally {
      setTestingAPI(false);
    }
  };

  const addTopic = () => {
    setTopics([...topics, ""]);
  };

  const removeTopic = (index) => {
    if (topics.length > 1) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const updateTopic = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // const renderProtocolFields = () => {
  //   switch (source.protocol) {
  //     case "Excel Upload":
  //       return (
  //         <div className="space-y-4">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-400 mb-2">
  //               Upload Excel File <span className="text-red-400">*</span>
  //             </label>

  //             {!filePreview ? (
  //               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition">
  //                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
  //                   <Upload className="w-10 h-10 mb-3 text-gray-400" />
  //                   <p className="mb-2 text-sm text-gray-400">
  //                     <span className="font-semibold">Click to upload</span> or
  //                     drag and drop
  //                   </p>
  //                   <p className="text-xs text-gray-500">
  //                     Excel files (.xlsx, .xls) or CSV (MAX. 10MB)
  //                   </p>
  //                 </div>
  //                 <input
  //                   type="file"
  //                   className="hidden"
  //                   accept=".xlsx,.xls,.csv"
  //                   onChange={handleFileChange}
  //                   disabled={!!initialData}
  //                 />
  //               </label>
  //             ) : (
  //               <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg border border-gray-600">
  //                 <File className="w-8 h-8 text-blue-400" />
  //                 <div className="flex-1">
  //                   <p className="text-sm font-medium text-white">
  //                     {filePreview.originalName}
  //                   </p>
  //                   <p className="text-xs text-gray-400">
  //                     {(filePreview.fileSize / 1024).toFixed(2)} KB
  //                   </p>
  //                   {filePreview.rowCount && (
  //                     <p className="text-xs text-blue-400 mt-1">
  //                       {filePreview.rowCount} rows × {filePreview.columnCount}{" "}
  //                       columns
  //                     </p>
  //                   )}
  //                 </div>
  //                 {!initialData && (
  //                   <button
  //                     type="button"
  //                     onClick={() => {
  //                       setSelectedFile(null);
  //                       setFilePreview(null);
  //                     }}
  //                     className="text-red-400 hover:text-red-300"
  //                   >
  //                     <X size={20} />
  //                   </button>
  //                 )}
  //               </div>
  //             )}

  //             {initialData && (
  //               <p className="mt-2 text-xs text-yellow-400">
  //                 ℹ️ File cannot be changed after creation. Create a new source
  //                 to upload a different file.
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //       );

  //     case "MQTT":
  //       return (
  //         <>
  //           <Input
  //             label="Broker URL"
  //             placeholder="broker.hivemq.com or 192.168.1.100"
  //             value={source.config.brokerUrl || ""}
  //             onChange={(e) => handleConfigChange("brokerUrl", e.target.value)}
  //           />

  //           <Input
  //             label="Port"
  //             type="number"
  //             placeholder="1883 (default)"
  //             value={source.config.port || ""}
  //             onChange={(e) => handleConfigChange("port", e.target.value)}
  //           />

  //           <div>
  //             <div className="flex justify-between items-center mb-2">
  //               <label className="block text-sm font-medium text-gray-400">
  //                 Topics
  //               </label>
  //               <button
  //                 type="button"
  //                 onClick={addTopic}
  //                 className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
  //               >
  //                 <Plus size={14} /> Add Topic
  //               </button>
  //             </div>

  //             {topics.map((topic, index) => (
  //               <div key={index} className="flex gap-2 mb-2">
  //                 <input
  //                   type="text"
  //                   placeholder="sensors/temperature"
  //                   value={topic}
  //                   onChange={(e) => updateTopic(index, e.target.value)}
  //                   className="flex-1 bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //                 />
  //                 {topics.length > 1 && (
  //                   <button
  //                     type="button"
  //                     onClick={() => removeTopic(index)}
  //                     className="px-3 py-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition"
  //                   >
  //                     <Trash2 size={18} />
  //                   </button>
  //                 )}
  //               </div>
  //             ))}
  //           </div>

  //           <div className="grid grid-cols-2 gap-3">
  //             <Input
  //               label="Username (optional)"
  //               value={source.config.username || ""}
  //               onChange={(e) => handleConfigChange("username", e.target.value)}
  //             />

  //             <Input
  //               label="Password (optional)"
  //               type="password"
  //               value={source.config.password || ""}
  //               onChange={(e) => handleConfigChange("password", e.target.value)}
  //             />
  //           </div>

  //           <div className="grid grid-cols-2 gap-3">
  //             <div>
  //               <label className="block text-sm font-medium text-gray-400 mb-1">
  //                 QoS
  //               </label>
  //               <select
  //                 value={source.config.qos || 0}
  //                 onChange={(e) =>
  //                   handleConfigChange("qos", parseInt(e.target.value))
  //                 }
  //                 className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               >
  //                 <option value={0}>0 - At most once</option>
  //                 <option value={1}>1 - At least once</option>
  //                 <option value={2}>2 - Exactly once</option>
  //               </select>
  //             </div>

  //             <Input
  //               label="Client ID (optional)"
  //               placeholder="Auto-generated"
  //               value={source.config.clientId || ""}
  //               onChange={(e) => handleConfigChange("clientId", e.target.value)}
  //             />
  //           </div>
  //         </>
  //       );

  //     case "Modbus TCP":
  //       return (
  //         <>
  //           <Input
  //             label="IP Address"
  //             placeholder="192.168.1.100"
  //             value={source.config.ip || ""}
  //             onChange={(e) => handleConfigChange("ip", e.target.value)}
  //           />

  //           <div className="grid grid-cols-2 gap-3">
  //             <Input
  //               label="Port"
  //               type="number"
  //               placeholder="502 (default)"
  //               value={source.config.port || "502"}
  //               onChange={(e) => handleConfigChange("port", e.target.value)}
  //             />

  //             <Input
  //               label="Unit ID"
  //               type="number"
  //               placeholder="1"
  //               value={source.config.unitId || ""}
  //               onChange={(e) => handleConfigChange("unitId", e.target.value)}
  //             />
  //           </div>

  //           <div className="grid grid-cols-2 gap-3">
  //             <Input
  //               label="Start Register"
  //               type="number"
  //               placeholder="0"
  //               value={source.config.startRegister || ""}
  //               onChange={(e) =>
  //                 handleConfigChange("startRegister", e.target.value)
  //               }
  //             />

  //             <Input
  //               label="Register Count"
  //               type="number"
  //               placeholder="10"
  //               value={source.config.registerCount || ""}
  //               onChange={(e) =>
  //                 handleConfigChange("registerCount", e.target.value)
  //               }
  //             />
  //           </div>

  //           <Input
  //             label="Polling Interval (ms)"
  //             type="number"
  //             placeholder="1000"
  //             value={source.config.pollingInterval || "1000"}
  //             onChange={(e) =>
  //               handleConfigChange("pollingInterval", e.target.value)
  //             }
  //           />
  //         </>
  //       );

  //     case "RS485":
  //       return (
  //         <>
  //           <Input
  //             label="Serial Port"
  //             placeholder="/dev/ttyUSB0 or COM3"
  //             value={source.config.serialPort || ""}
  //             onChange={(e) => handleConfigChange("serialPort", e.target.value)}
  //           />

  //           <div className="grid grid-cols-2 gap-3">
  //             <Input
  //               label="Baud Rate"
  //               type="number"
  //               placeholder="9600"
  //               value={source.config.baudRate || "9600"}
  //               onChange={(e) => handleConfigChange("baudRate", e.target.value)}
  //             />

  //             <Input
  //               label="Data Bits"
  //               type="number"
  //               placeholder="8"
  //               value={source.config.dataBits || "8"}
  //               onChange={(e) => handleConfigChange("dataBits", e.target.value)}
  //             />
  //           </div>

  //           <div className="grid grid-cols-2 gap-3">
  //             <div>
  //               <label className="block text-sm font-medium text-gray-400 mb-1">
  //                 Parity
  //               </label>
  //               <select
  //                 value={source.config.parity || "none"}
  //                 onChange={(e) => handleConfigChange("parity", e.target.value)}
  //                 className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               >
  //                 <option value="none">None</option>
  //                 <option value="even">Even</option>
  //                 <option value="odd">Odd</option>
  //               </select>
  //             </div>

  //             <Input
  //               label="Stop Bits"
  //               type="number"
  //               placeholder="1"
  //               value={source.config.stopBits || "1"}
  //               onChange={(e) => handleConfigChange("stopBits", e.target.value)}
  //             />
  //           </div>

  //           <Input
  //             label="Unit ID"
  //             type="number"
  //             placeholder="1"
  //             value={source.config.unitId || ""}
  //             onChange={(e) => handleConfigChange("unitId", e.target.value)}
  //           />
  //         </>
  //       );

  //     default:
  //       return null;
  //   }
  // };

  const renderProtocolFields = () => {
    // defensive defaults so we don't crash if some nested objects are undefined
    const apiConfig = source?.apiConfig || {};
    const mqttConfig = source?.config || {};
    const modbusConfig = source?.config || {};
    const rs485Config = source?.config || {};

    switch (source?.protocol) {
      case "API": {
        // pollingInterval is in ms in your state; show seconds to user
        const pollingSeconds =
          typeof apiConfig.pollingInterval === "number"
            ? Math.floor(apiConfig.pollingInterval / 1000)
            : 120;

        return (
          <div className="space-y-4">
            <Input
              label="API URL"
              placeholder="https://api.example.com/data"
              value={apiConfig.url || ""}
              onChange={(e) => handleApiConfigChange("url", e.target.value)}
              required
            />

            <div className="py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <select
                value={apiConfig.method || "GET"}
                onChange={(e) =>
                  handleApiConfigChange("method", e.target.value)
                }
                className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>

            <Input
              label="Polling Interval (seconds)"
              type="number"
              placeholder="120"
              value={pollingSeconds}
              onChange={(e) =>
                handleApiConfigChange(
                  "pollingInterval",
                  Number(e.target.value || 0) * 1000
                )
              }
            />

            {apiConfig.method === "POST" && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Request Body (JSON)
                </label>
                <textarea
                  placeholder='{"key": "value"}'
                  value={apiConfig.body || ""}
                  onChange={(e) =>
                    handleApiConfigChange("body", e.target.value)
                  }
                  rows={4}
                  className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-400">
                  Headers (Optional)
                </label>
                <button
                  type="button"
                  onClick={addHeader}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Header
                </button>
              </div>

              {(apiHeaders || []).map((header = {}, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Header name"
                    value={header.key || ""}
                    onChange={(e) => updateHeader(index, "key", e.target.value)}
                    className="flex-1 bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={header.value || ""}
                    onChange={(e) =>
                      updateHeader(index, "value", e.target.value)
                    }
                    className="flex-1 bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {(apiHeaders || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHeader(index)}
                      className="px-3 py-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Authentication
              </label>
              <select
                value={apiConfig.auth?.type || "none"}
                onChange={(e) =>
                  handleApiConfigChange("auth", {
                    ...(apiConfig.auth || {}),
                    type: e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="apiKey">API Key</option>
              </select>
            </div>

            {apiConfig.auth?.type === "bearer" && (
              <Input
                label="Bearer Token"
                type="password"
                placeholder="Enter token"
                value={apiConfig.auth?.token || ""}
                onChange={(e) =>
                  handleApiConfigChange("auth", {
                    ...(apiConfig.auth || {}),
                    token: e.target.value,
                  })
                }
              />
            )}

            {apiConfig.auth?.type === "basic" && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Username"
                  value={apiConfig.auth?.username || ""}
                  onChange={(e) =>
                    handleApiConfigChange("auth", {
                      ...(apiConfig.auth || {}),
                      username: e.target.value,
                    })
                  }
                />
                <Input
                  label="Password"
                  type="password"
                  value={apiConfig.auth?.password || ""}
                  onChange={(e) =>
                    handleApiConfigChange("auth", {
                      ...(apiConfig.auth || {}),
                      password: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {apiConfig.auth?.type === "apiKey" && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Header Name"
                  placeholder="X-API-Key"
                  value={apiConfig.auth?.apiKeyHeader || ""}
                  onChange={(e) =>
                    handleApiConfigChange("auth", {
                      ...(apiConfig.auth || {}),
                      apiKeyHeader: e.target.value,
                    })
                  }
                />
                <Input
                  label="API Key"
                  type="password"
                  value={apiConfig.auth?.apiKey || ""}
                  onChange={(e) =>
                    handleApiConfigChange("auth", {
                      ...(apiConfig.auth || {}),
                      apiKey: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Data Path (JSONPath - Optional)
              </label>
              <input
                type="text"
                placeholder="$.data.items or leave empty for root"
                value={apiConfig.dataPath || ""}
                onChange={(e) =>
                  handleApiConfigChange("dataPath", e.target.value)
                }
                className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Extract nested data from response (e.g., $.data.readings)
              </p>
            </div>

            <Input
              label="Unique Key Field (Optional)"
              placeholder="id or timestamp"
              value={apiConfig.uniqueKey || ""}
              onChange={(e) =>
                handleApiConfigChange("uniqueKey", e.target.value)
              }
            />
            <p className="text-xs text-gray-500 -mt-2">
              Field name to detect duplicates (e.g., "id", "timestamp")
            </p>

            <button
              type="button"
              onClick={testAPIConnection}
              disabled={!apiConfig.url || testingAPI}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-md flex items-center justify-center gap-2 font-medium transition"
            >
              {testingAPI ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Test Connection
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`p-4 rounded-md ${
                  testResult.success
                    ? "bg-green-600/20 border border-green-600"
                    : "bg-red-600/20 border border-red-600"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {testResult.success ? (
                    <>
                      <Check className="text-green-400" size={20} />
                      <span className="font-medium text-green-400">
                        Connection Successful
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="text-red-400" size={20} />
                      <span className="font-medium text-red-400">
                        Connection Failed
                      </span>
                    </>
                  )}
                </div>

                {testResult.success ? (
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>Status: {testResult.status}</p>
                    <p>Data Type: {testResult.dataType}</p>
                    {testResult.recordCount && (
                      <p>Records Found: {testResult.recordCount}</p>
                    )}
                    {testResult.sampleData && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                          View Sample Data
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(testResult.sampleData, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-300">{testResult.error}</p>
                )}
              </div>
            )}
          </div>
        );
      }

      case "Excel Upload": {
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Upload Excel File <span className="text-red-400">*</span>
              </label>

              {!filePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Excel files (.xlsx, .xls) or CSV (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    disabled={!!initialData}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <File className="w-8 h-8 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {filePreview.originalName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(filePreview.fileSize / 1024).toFixed(2)} KB
                    </p>
                    {filePreview.rowCount && (
                      <p className="text-xs text-blue-400 mt-1">
                        {filePreview.rowCount} rows × {filePreview.columnCount}{" "}
                        columns
                      </p>
                    )}
                  </div>
                  {!initialData && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}

              {initialData && (
                <p className="mt-2 text-xs text-yellow-400">
                  ℹ️ File cannot be changed after creation. Create a new source
                  to upload a different file.
                </p>
              )}
            </div>
          </div>
        );
      }

      case "MQTT": {
        return (
          <>
            <Input
              label="Broker URL"
              placeholder="broker.hivemq.com or 192.168.1.100"
              value={mqttConfig.brokerUrl || ""}
              onChange={(e) => handleConfigChange("brokerUrl", e.target.value)}
            />

            <Input
              label="Port"
              type="number"
              placeholder="1883 (default)"
              value={mqttConfig.port || ""}
              onChange={(e) => handleConfigChange("port", e.target.value)}
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-400">
                  Topics
                </label>
                <button
                  type="button"
                  onClick={addTopic}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Topic
                </button>
              </div>

              {(topics || []).map((topic, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="sensors/temperature"
                    value={topic || ""}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    className="flex-1 bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {(topics || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="px-3 py-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Username (optional)"
                value={mqttConfig.username || ""}
                onChange={(e) => handleConfigChange("username", e.target.value)}
              />

              <Input
                label="Password (optional)"
                type="password"
                value={mqttConfig.password || ""}
                onChange={(e) => handleConfigChange("password", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  QoS
                </label>
                <select
                  value={mqttConfig.qos ?? 0}
                  onChange={(e) =>
                    handleConfigChange("qos", Number(e.target.value))
                  }
                  className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>0 - At most once</option>
                  <option value={1}>1 - At least once</option>
                  <option value={2}>2 - Exactly once</option>
                </select>
              </div>

              <Input
                label="Client ID (optional)"
                placeholder="Auto-generated"
                value={mqttConfig.clientId || ""}
                onChange={(e) => handleConfigChange("clientId", e.target.value)}
              />
            </div>
          </>
        );
      }

      case "Modbus TCP": {
        return (
          <>
            <Input
              label="IP Address"
              placeholder="192.168.1.100"
              value={modbusConfig.ip || ""}
              onChange={(e) => handleConfigChange("ip", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Port"
                type="number"
                placeholder="502 (default)"
                value={modbusConfig.port || "502"}
                onChange={(e) => handleConfigChange("port", e.target.value)}
              />

              <Input
                label="Unit ID"
                type="number"
                placeholder="1"
                value={modbusConfig.unitId || ""}
                onChange={(e) => handleConfigChange("unitId", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Register"
                type="number"
                placeholder="0"
                value={modbusConfig.startRegister || ""}
                onChange={(e) =>
                  handleConfigChange("startRegister", e.target.value)
                }
              />

              <Input
                label="Register Count"
                type="number"
                placeholder="10"
                value={modbusConfig.registerCount || ""}
                onChange={(e) =>
                  handleConfigChange("registerCount", e.target.value)
                }
              />
            </div>

            <Input
              label="Polling Interval (ms)"
              type="number"
              placeholder="1000"
              value={modbusConfig.pollingInterval || "1000"}
              onChange={(e) =>
                handleConfigChange("pollingInterval", e.target.value)
              }
            />
          </>
        );
      }

      case "RS485": {
        return (
          <>
            <Input
              label="Serial Port"
              placeholder="/dev/ttyUSB0 or COM3"
              value={rs485Config.serialPort || ""}
              onChange={(e) => handleConfigChange("serialPort", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Baud Rate"
                type="number"
                placeholder="9600"
                value={rs485Config.baudRate || "9600"}
                onChange={(e) => handleConfigChange("baudRate", e.target.value)}
              />

              <Input
                label="Data Bits"
                type="number"
                placeholder="8"
                value={rs485Config.dataBits || "8"}
                onChange={(e) => handleConfigChange("dataBits", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Parity
                </label>
                <select
                  value={rs485Config.parity || "none"}
                  onChange={(e) => handleConfigChange("parity", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="even">Even</option>
                  <option value="odd">Odd</option>
                </select>
              </div>

              <Input
                label="Stop Bits"
                type="number"
                placeholder="1"
                value={rs485Config.stopBits || "1"}
                onChange={(e) => handleConfigChange("stopBits", e.target.value)}
              />
            </div>

            <Input
              label="Unit ID"
              type="number"
              placeholder="1"
              value={rs485Config.unitId || ""}
              onChange={(e) => handleConfigChange("unitId", e.target.value)}
            />
          </>
        );
      }

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    if (!source.name || !source.protocol) {
      alert("Please fill in all required fields");
      return;
    }

    if (source.protocol === "Excel Upload") {
      if (!selectedFile && !initialData) {
        alert("Please upload an Excel file");
        return;
      }
    } else if (source.protocol === "MQTT") {
      const validTopics = topics.filter((t) => t.trim() !== "");
      if (validTopics.length === 0) {
        alert("Please add at least one topic");
        return;
      }
      source.config.topic = validTopics;
    }

    if (tags.length > 0) {
      source.config.tags = tags;
    }

    onSave(source, selectedFile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[550px] bg-[#1E293B] text-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {initialData ? "Edit" : "Create"} Source
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition p-1"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <Input
              label="Source Name"
              placeholder="e.g., Factory Temperature Sensors"
              value={source.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Protocol <span className="text-red-400">*</span>
              </label>
              <select
                value={source.protocol}
                onChange={(e) => {
                  handleChange("protocol", e.target.value);
                  setSource((prev) => ({ ...prev, config: {} }));
                  setTopics([""]);
                }}
                disabled={!!initialData}
                className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {SOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {initialData && (
                <p className="mt-1 text-xs text-gray-500">
                  Protocol cannot be changed after creation
                </p>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                {source.protocol} Configuration
              </h3>
              {renderProtocolFields()}
            </div>

            <div className="border-t border-gray-700 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Tag size={16} />
                Metadata (For AI Context)
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Help AI understand your data better by adding context
              </p>

              <Input
                label="Location"
                placeholder="e.g., Factory Floor A, Room 101"
                value={source.config.location || ""}
                onChange={(e) => handleConfigChange("location", e.target.value)}
              />

              <Input
                label="Equipment"
                placeholder="e.g., Motor 1, Pump A"
                value={source.config.equipment || ""}
                onChange={(e) =>
                  handleConfigChange("equipment", e.target.value)
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe what this source monitors..."
                  value={source.config.description || ""}
                  onChange={(e) =>
                    handleConfigChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a tag (e.g., temperature, critical)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-300"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-md bg-zinc-700 hover:bg-zinc-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 transition font-medium shadow-lg"
            >
              {initialData ? "Update" : "Create"} Source
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Input = ({
  label,
  value,
  type = "text",
  placeholder,
  onChange,
  required,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-500"
    />
  </div>
);

export default SourceFormDrawer;
