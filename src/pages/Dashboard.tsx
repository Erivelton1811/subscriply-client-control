import { useCustomers } from "@/hooks/use-customers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const customers = useCustomers();

  // Get customers with active plans
  const activeCustomers = customers.filter((customer) => 
    customer.status === 'active' && customer.subscriptions.some(sub => sub.status === 'active')
  );

  // Get customers with expiring plans (warning status)
  const expiringCustomers = customers.filter((customer) =>
    customer.subscriptions.some(sub => sub.status === 'warning')
  );

  // Get total revenue
  const totalRevenue = customers.reduce((sum, customer) => {
    const customerRevenue = customer.subscriptions.reduce((subSum, sub) => 
      subSum + sub.plan.price, 0);
    return sum + customerRevenue;
  }, 0);

  // Get total resale revenue (if applicable)
  const totalResaleRevenue = customers.reduce((sum, customer) => {
    const customerResaleRevenue = customer.subscriptions.reduce((subSum, sub) => 
      subSum + (sub.plan.resalePrice || sub.plan.price), 0);
    return sum + customerResaleRevenue;
  }, 0);

  // Calculate profit margin
  const profitMargin = totalResaleRevenue - totalRevenue;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clientes Ativos</CardTitle>
            <CardDescription>Número de clientes com planos ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planos Expirando</CardTitle>
            <CardDescription>Clientes com planos próximos do vencimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringCustomers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
            <CardDescription>Receita gerada por todos os planos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Margem de Lucro</CardTitle>
            <CardDescription>Lucro total (receita de revenda - receita original)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {profitMargin.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Clientes com Planos Expirando</h2>
        <Separator />
        {expiringCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {expiringCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle>{customer.name}</CardTitle>
                  <CardDescription>{customer.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  {customer.subscriptions.map((sub) => (
                    <div key={sub.id} className="mb-2">
                      <Badge variant="warning" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {sub.plan.name} - {sub.daysRemaining} dias restantes
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mt-4">Nenhum cliente com planos expirando.</p>
        )}
      </div>
    </div>
  );
}
