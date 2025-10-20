import axios from "axios";

function addHeaderToAxiosConfig(header, value) {
  axios.defaults.headers.common[header] = value;
}

function removeHeadersFromAxiosConfig(headers) {
  headers.forEach((header) => {
    axios.defaults.headers.common[header] = undefined;
  });
}

export { addHeaderToAxiosConfig, removeHeadersFromAxiosConfig };
