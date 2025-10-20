import axios from "axios";

import { getCookie } from "../utils/cookie";
import { addHeaderToAxiosConfig } from "../utils/add-header-to-axios-config";

// At start set the headers of authorization and group id.
const { Authorization } = getCookie(["Authorization"]);
addHeaderToAxiosConfig("Authorization", Authorization);

// Set the base url for calling API's
// Here we check if we want to set dynamic url depending upon the domain name or if we want to connect to specific URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

console.log("axios.defaults.baseURL", axios.defaults.baseURL);
