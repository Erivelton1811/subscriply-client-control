
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import CustomerForm from "./pages/CustomerForm";
import CustomerDetails from "./pages/CustomerDetails";
import Plans from "./pages/Plans";
import PlanForm from "./pages/PlanForm";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Index /></Layout>} />
        
        {/* Customers Routes */}
        <Route path="/customers" element={<Layout><Customers /></Layout>} />
        <Route path="/customers/new" element={<Layout><CustomerForm /></Layout>} />
        <Route path="/customers/:id" element={<Layout><CustomerDetails /></Layout>} />
        <Route path="/customers/:id/edit" element={<Layout><CustomerForm /></Layout>} />
        
        {/* Plans Routes */}
        <Route path="/plans" element={<Layout><Plans /></Layout>} />
        <Route path="/plans/new" element={<Layout><PlanForm /></Layout>} />
        <Route path="/plans/:id/edit" element={<Layout><PlanForm /></Layout>} />
        
        {/* Reports Route */}
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
      <Sonner />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
