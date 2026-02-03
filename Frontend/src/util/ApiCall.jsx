import { toast } from "react-toastify";
import axios from "axios";
import API_URL from "../config/api";

const ApiCall = async (url, method, navigate, setUser, data) => {
  console.log("******** Inside ApiCall function ********");

  if (method === "GET") {
    try {
      const response = await axios.get(API_URL + url, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      setUser(null);
      if (error.response.status === 401) {
        toast.error("You are not authorized to access this page. Please login first.");
        navigate("/login");
      } else if (error.response.status === 404) {
        toast.error("The requested resource was not found.");
        navigate("/");
      } else if (error.response.status === 500) {
        toast.error("Server Error. Please try again later.");
        navigate("/");
      } else {
        toast.error("An error occurred. Please try again later.");
        navigate("/");
      }
    }
  } else if (method === "POST") {
    try {
      const response = await axios.post(API_URL + url, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      setUser(null);
      if (error.response.status === 401) {
        toast.error("You are not authorized to access this page. Please login first.");
        navigate("/login");
      } else if (error.response.status === 404) {
        toast.error("The requested resource was not found.");
        navigate("/");
      } else if (error.response.status === 500) {
        toast.error("Server Error. Please try again later.");
        navigate("/");
      } else {
        toast.error("An error occurred. Please try again later.");
        navigate("/");
      }
    }
  }
};

export default ApiCall;
