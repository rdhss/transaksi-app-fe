import axios from "axios"; 

const axiosInstance = axios.create({
  baseURL : "https://transaksi-app-be-production.up.railway.app/",
  headers: {
    "Access-Control-Allow-Origin": "*"
  }, 
});

export default axiosInstance;