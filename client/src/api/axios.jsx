import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:4080",
  headers: {
    "Content-Type": "application/json",
  },
});
