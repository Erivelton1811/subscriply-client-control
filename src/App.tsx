
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./components/Layout";
import { QuerySyncManager } from "./components/QuerySyncManager"; // Importamos o novo componente
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import Plans from "./pages/Plans";
import PlanForm from "./pages/PlanForm";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import CustomerForm from "./pages/CustomerForm";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { useAuthStore } from "./store/authStore";
import "./App.css";

// Configuração do cliente de consulta com refetchOnWindowFocus para atualizar dados
// quando o usuário retorna à janela do navegador
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Recarregamos os dados quando o usuário volta à janela
      staleTime: 1000 * 60 * 5, // 5 minutos de tempo de staleness
    },
  },
});

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="subscriply-theme">
        <Router>
          <Toaster />
          {/* Adicionamos o QuerySyncManager aqui para sincronização global */}
          {isAuthenticated && <QuerySyncManager />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<Reports />} />
              <Route path="plans" element={<Plans />} />
              <Route path="plans/new" element={<PlanForm />} />
              <Route path="plans/:id/edit" element={<PlanForm />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetails />} />
              <Route path="customers/new" element={<CustomerForm />} />
              <Route path="customers/:id/edit" element={<CustomerForm />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <WhatsAppButton />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
