
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import CustomerForm from "./pages/CustomerForm";
import CustomerDetails from "./pages/CustomerDetails";
import Plans from "./pages/Plans";
import PlanForm from "./pages/PlanForm";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import { useAuthStore } from "./store/authStore";

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Index /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Customers Routes */}
          <Route path="/customers" element={
            <ProtectedRoute>
              <Layout><Customers /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/customers/new" element={
            <ProtectedRoute>
              <Layout><CustomerForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/customers/:id" element={
            <ProtectedRoute>
              <Layout><CustomerDetails /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/customers/:id/edit" element={
            <ProtectedRoute>
              <Layout><CustomerForm /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Plans Routes */}
          <Route path="/plans" element={
            <ProtectedRoute>
              <Layout><Plans /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/plans/new" element={
            <ProtectedRoute>
              <Layout><PlanForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/plans/:id/edit" element={
            <ProtectedRoute>
              <Layout><PlanForm /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Reports Route */}
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout><Reports /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin Panel */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout><AdminPanel /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
