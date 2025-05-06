
import { useState } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Users, 
  Activity, 
  Clock,
  Eye,
  EyeOff
} from "lucide-react";

export default function Reports() {
  const { 
    reports, 
    toggleReportVisibility,
    getExpectedMonthlyProfit, 
    getExpectedYearlyProfit,
    getExpiringSubscriptions,
    getAverageSubscriptionValue,
    getCustomerDetails
  } = useSubscriptionStore();
  
  const [activeTab, setActiveTab] = useState("overview");

  // Get data for reports
  const monthlyProfit = getExpectedMonthlyProfit();
  const yearlyProfit = getExpectedYearlyProfit();
  const expiringCount = getExpiringSubscriptions();
  const avgSubscriptionValue = getAverageSubscriptionValue();
  const customerDetails = getCustomerDetails();
  
  // Filter visible reports
  const visibleReports = reports.filter(report => report.visible);
  
  // Helper function to get report visibility
  const isReportVisible = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    return report ? report.visible : false;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Relatórios</h1>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="customize">Personalizar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          {isReportVisible("monthly-profit") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Lucro Mensal Esperado
                </CardTitle>
                <CardDescription>
                  Estimativa de lucro mensal baseada nas assinaturas ativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  R$ {monthlyProfit.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          )}
          
          {isReportVisible("yearly-profit") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Lucro Anual Esperado
                </CardTitle>
                <CardDescription>
                  Estimativa de lucro anual baseada nas assinaturas ativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">
                  R$ {yearlyProfit.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          )}
          
          {isReportVisible("avg-subscription-value") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
                  Valor Médio de Assinatura
                </CardTitle>
                <CardDescription>
                  Média do valor das assinaturas ativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">
                  R$ {avgSubscriptionValue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          )}
          
          {isReportVisible("expiring-subscriptions") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-amber-600" />
                  Assinaturas Próximas do Vencimento
                </CardTitle>
                <CardDescription>
                  Clientes com assinaturas que vencem nos próximos 5 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-amber-600">
                  {expiringCount}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4 mt-6">
          {isReportVisible("profit-per-plan") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-indigo-600" />
                  Lucro por Plano
                </CardTitle>
                <CardDescription>
                  Distribuição de lucro por tipo de plano
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-16 w-16 opacity-30" />
                    <p className="mt-2">Gráfico de distribuição de lucro por plano</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isReportVisible("renewal-rate") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-pink-600" />
                  Taxa de Renovação
                </CardTitle>
                <CardDescription>
                  Porcentagem de clientes que renovam suas assinaturas
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Activity className="mx-auto h-16 w-16 opacity-30" />
                    <p className="mt-2">Gráfico de taxa de renovação ao longo do tempo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isReportVisible("customer-retention") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-cyan-600" />
                  Retenção de Clientes
                </CardTitle>
                <CardDescription>
                  Análise de retenção de clientes ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Users className="mx-auto h-16 w-16 opacity-30" />
                    <p className="mt-2">Gráfico de retenção de clientes ao longo do tempo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="customize" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalizar Relatórios</CardTitle>
              <CardDescription>
                Escolha quais relatórios deseja exibir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`toggle-${report.id}`} className="sr-only">
                        {report.visible ? "Ocultar" : "Exibir"}
                      </Label>
                      <Switch
                        id={`toggle-${report.id}`}
                        checked={report.visible}
                        onCheckedChange={() => toggleReportVisibility(report.id)}
                      />
                      {report.visible ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
