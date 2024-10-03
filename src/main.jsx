import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Theme } from "@radix-ui/themes";
import { GlobalStateProvider } from "./context/GlobalContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GlobalStateProvider>
            <Theme>
                <App />
            </Theme>
        </GlobalStateProvider>
    </StrictMode>
);
