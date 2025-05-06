
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { DaysRemainingIndicator } from "@/components/DaysRemainingIndicator";
import { UserPlus, Search, X } from "lucide-react";

export default function Customers() {
  const { getCustomerDetails } = useSubscriptionStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "warning" | "expired">("all");
  
  const customers = getCustomerDetails();
  
  // Filter customers based on search term and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button asChild>
          <Link to="/customers/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpar busca</span>
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className="flex-1 sm:flex-none"
          >
            Todos
          </Button>
          <Button 
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            className="flex-1 sm:flex-none"
          >
            Ativos
          </Button>
          <Button 
            variant={statusFilter === "warning" ? "default" : "outline"}
            onClick={() => setStatusFilter("warning")}
            className="flex-1 sm:flex-none"
          >
            Vencendo
          </Button>
          <Button 
            variant={statusFilter === "expired" ? "default" : "outline"}
            onClick={() => setStatusFilter("expired")}
            className="flex-1 sm:flex-none"
          >
            Vencidos
          </Button>
        </div>
      </div>
      
      {/* Customers List */}
      <div className="border rounded-md">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4">Nome</th>
              <th className="text-left py-3 px-4 hidden sm:table-cell">Email</th>
              <th className="text-left py-3 px-4">Plano</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Tempo Restante</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <Link to={`/customers/${customer.id}`} className="hover:underline font-medium">
                      {customer.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">
                    {customer.email}
                  </td>
                  <td className="py-3 px-4">{customer.plan.name}</td>
                  <td className="py-3 px-4">
                    <StatusBadge 
                      status={customer.status} 
                      showWhatsAppButton={true}
                      phoneNumber={customer.phone}
                      customerName={customer.name}
                      planName={customer.plan.name}
                      daysRemaining={customer.daysRemaining}
                    />
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <DaysRemainingIndicator days={customer.daysRemaining} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-muted-foreground">
                  {searchTerm || statusFilter !== "all" ? (
                    "Nenhum cliente encontrado para os critérios de busca."
                  ) : (
                    "Nenhum cliente cadastrado."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
