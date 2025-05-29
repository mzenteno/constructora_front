import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import "./index.css";
import { AppRouter } from "@routes/AppRouter";
import { I18nProvider } from "@store/I18nContext";
import { AuthProvider } from "@store/AuthContext";
import "./assets/vendors/js/vendor.bundle.base.js";
import "./assets/js/hoverable-collapse.js";
import "./assets/js/off-canvas.js";
import "./assets/js/misc.js";

createRoot(document.getElementById("root")).render(
  <I18nProvider>
    <I18nextProvider i18n={i18n}>
      <I18nProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </I18nProvider>
    </I18nextProvider>
  </I18nProvider>
);
