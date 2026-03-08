import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardShortcutsProvider } from "./utils/KeyboardShortcutsContext";
import RouteConfig from "./RouteConfig";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <KeyboardShortcutsProvider>
            <RouteConfig />
          </KeyboardShortcutsProvider>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
