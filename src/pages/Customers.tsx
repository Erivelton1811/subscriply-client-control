
import { useState } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { DaysRemainingIndicator } from "@/components/DaysRemainingIndicator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterStatus = "all" | "active" | "warning" | "expired";

export default function Customers() {
  const { getCustomerDetails } = useSubscriptionStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const customers = getCustomerDetails();
  
  // Apply filters
  const filteredCustomers = customers.filter((customer) => {
    // Search filter
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button asChild>
          <Link to="/customers/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Todos os Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Status: {statusFilter === "all" ? "Todos" : 
                            statusFilter === "active" ? "Ativo" : 
                            statusFilter === "warning" ? "Próx. Vencimento" : "Vencido"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
                    <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="active">Ativo</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="warning">Próx. Vencimento</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="expired">Vencido</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Customer list */}
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plano</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tempo Restante</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Link to={`/customers/${customer.id}`} className="hover:underline font-medium">
                          {customer.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{customer.email}</td>
                      <td className="py-3 px-4">{customer.plan.name}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={customer.status} />
                      </td>
                      <td className="py-3 px-4">
                        <DaysRemainingIndicator days={customer.daysRemaining} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" asChild size="sm">
                          <Link to={`/customers/${customer.id}`}>Detalhes</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-muted-foreground">
                        {customers.length === 0
                          ? "Nenhum cliente cadastrado"
                          : "Nenhum cliente encontrado com os filtros atuais"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
