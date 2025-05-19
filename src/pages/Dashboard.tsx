
import { useCustomers } from "@/hooks/use-customers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertCircle 
} from "lucide-react";

export default function Dashboard() {
  const { customers = [], isLoading } = useCustomers();

  // Display loading state while customers are being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Carregando dados...</div>
      </div>
    );
  }

  // Garantir que customers é sempre um array
  const customersArray = Array.isArray(customers) ? customers : [];

  // Get customers with active plans
  const activeCustomers = customersArray.filter((customer) => 
    customer.status === 'active' && customer.subscriptions.some(sub => sub.status === 'active')
  );

  // Get customers with expiring plans (warning status)
  const expiringCustomers = customersArray.filter((customer) =>
    customer.subscriptions.some(sub => sub.status === 'warning')
  );

  // Get total revenue (cost price)
  const totalRevenue = customersArray.reduce((sum, customer) => {
    const customerRevenue = customer.subscriptions.reduce((subSum, sub) => 
      subSum + (sub.plan.resalePrice || 0), 0);
    return sum + customerRevenue;
  }, 0);

  // Get total resale revenue (selling price to customers)
  const totalResaleRevenue = customersArray.reduce((sum, customer) => {
    const customerResaleRevenue = customer.subscriptions.reduce((subSum, sub) => 
      subSum + sub.plan.price, 0);
    return sum + customerResaleRevenue;
  }, 0);

  // Calculate profit margin correctly: what we charge customers minus our cost
  const profitMargin = totalResaleRevenue - totalRevenue;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Badge variant="outline" className="text-sm bg-primary/10 hover:bg-primary/20">
          {new Date().toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
          })}
        </Badge>
      </div>
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Clientes Ativos
            </CardTitle>
            <CardDescription>Número de clientes com planos ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCustomers.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-500" />
              Planos Expirando
            </CardTitle>
            <CardDescription>Clientes com planos próximos do vencimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expiringCustomers.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              Receita Total
            </CardTitle>
            <CardDescription>Receita gerada por todos os planos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {totalResaleRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Margem de Lucro
            </CardTitle>
            <CardDescription>Lucro total (receita de vendas - custo de compra)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {profitMargin.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
          Clientes com Planos Expirando
        </h2>
        <Separator className="mb-4" />
        {expiringCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiringCustomers.map((customer) => (
              <Card key={customer.id} className="overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 pb-3">
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <CardDescription>{customer.email}</CardDescription>
                </CardHeader>
                <CardContent className="pt-3">
                  {customer.subscriptions.map((sub) => (
                    <div key={sub.id} className="mb-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {sub.plan.name} - {sub.daysRemaining} dias restantes
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/30">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Nenhum cliente com planos expirando.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
