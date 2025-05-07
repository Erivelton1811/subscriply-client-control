
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, LayoutDashboard, LogOut, PackageOpen, Settings, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive?: boolean;
}

function NavItem({ to, icon: Icon, children, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Link>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <nav className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="font-bold text-xl mb-6 px-4 py-2">Subscriply</div>
        <div className="space-y-1 flex-1">
          <NavItem 
            to="/" 
            icon={LayoutDashboard} 
            isActive={currentPath === "/"}
          >
            Dashboard
          </NavItem>
          <NavItem 
            to="/customers" 
            icon={Users} 
            isActive={currentPath.startsWith("/customers")}
          >
            Clientes
          </NavItem>
          <NavItem 
            to="/plans" 
            icon={PackageOpen} 
            isActive={currentPath.startsWith("/plans")}
          >
            Planos
          </NavItem>
          <NavItem 
            to="/reports" 
            icon={BarChart} 
            isActive={currentPath.startsWith("/reports")}
          >
            Relatórios
          </NavItem>
          {user?.isAdmin && (
            <NavItem 
              to="/admin" 
              icon={Settings} 
              isActive={currentPath.startsWith("/admin")}
            >
              Admin
            </NavItem>
          )}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="px-4 py-2 mb-2 text-sm text-muted-foreground">
            <span>Logado como: </span>
            <span className="font-medium text-foreground">{user?.username}</span>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
