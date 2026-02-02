import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@cotin/biblioteca-componentes-react/theme.css";
import "@cotin/biblioteca-componentes-react/componentes.css";
import "./index.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
