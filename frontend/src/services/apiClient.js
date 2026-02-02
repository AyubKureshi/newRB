import axios from "axios";
import { API_URL } from "../config/api";

const apiClient = axios.create({
    baseURL:API_URL, 
    // withCredentials: true, 
});

export default apiClient;
