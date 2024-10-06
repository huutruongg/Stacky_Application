import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/configureStore.jsx";
import { AuthProvider } from "./components/context/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster></Toaster>
      </AuthProvider>
    </BrowserRouter>
    {/* <ToastContainer bodyClassName="font-primary text-sm"></ToastContainer> */}
  </Provider>
);
