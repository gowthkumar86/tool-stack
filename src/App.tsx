import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import AppProviders from "@/AppProviders";
import AppRoutes from "@/AppRoutes";

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    <Analytics />
  </AppProviders>
);

export default App;
