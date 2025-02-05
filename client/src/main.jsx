import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/configureStore.jsx";
import { AuthProvider } from "./components/context/AuthProvider.jsx";
import { JobSaveProvider } from "./components/context/JobSaveProvider.jsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/shared/errorBoundary/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <JobSaveProvider>
          <ErrorBoundary>
            <App />
            <Toaster position="top-right" reverseOrder={false}></Toaster>
          </ErrorBoundary>
        </JobSaveProvider>
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
