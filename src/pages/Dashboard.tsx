
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus } from "lucide-react";
import { DaysRemainingIndicator } from "@/components/DaysRemainingIndicator";

export default function Dashboard() {
  const { 
    getCustomerDetails, 
    getActiveSubscriptions, 
    getExpiringSubscriptions, 
    getExpiredSubscriptions 
  } = useSubscriptionStore();
  
  const customers = getCustomerDetails();
  
  // Get counts
  const activeCount = getActiveSubscriptions();
  const expiringCount = getExpiringSubscriptions();
  const expiredCount = getExpiredSubscriptions();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/customers/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/plans/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Assinaturas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-active">
              {activeCount}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Assinaturas Próximas ao Vencimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-warning">
              {expiringCount}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Assinaturas Vencidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-expired">
              {expiredCount}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes Recentes</CardTitle>
          <CardDescription>
            Visão geral dos últimos clientes e status de suas assinaturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Cliente</th>
                  <th className="text-left py-3 px-4">Plano</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Tempo Restante</th>
                </tr>
              </thead>
              <tbody>
                {customers.slice(0, 5).map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Link to={`/customers/${customer.id}`} className="hover:underline font-medium">
                        {customer.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{customer.plan.name}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="py-3 px-4">
                      <DaysRemainingIndicator days={customer.daysRemaining} />
                    </td>
                  </tr>
                ))}
                
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-muted-foreground">
                      Nenhum cliente cadastrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {customers.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link to="/customers">Ver todos os clientes</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
