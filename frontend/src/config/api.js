export const API_URL = import.meta.env.VITE_API_URL;

if(!API_URL) {
    console.log("VITE_API_URL is not defined");
}