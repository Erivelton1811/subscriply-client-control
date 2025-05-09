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
  EyeOff,
  FileSpreadsheet,
  FileText,
  Download,
  Share2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const handleExportReport = () => {
    toast.success("Relatório exportado com sucesso!");
  };

  const handleShareReport = () => {
    toast.success("Link do relatório copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-primary" />
            <h1 className="text-3xl font-bold">Relatórios</h1>
          </div>
          <p className="text-muted-foreground">Análises e métricas sobre clientes e receitas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" className="flex items-center" onClick={handleShareReport}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="customize" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Personalizar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-2">
          {isReportVisible("monthly-profit") && (
            <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 pb-3">
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Lucro Mensal Esperado
                </CardTitle>
                <CardDescription>
                  Estimativa de lucro mensal baseada nas assinaturas ativas
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-4xl font-bold text-green-600">
                  R$ {monthlyProfit.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          )}
          
          {isReportVisible("yearly-profit") && (
            <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 pb-3">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Lucro Anual Esperado
                </CardTitle>
                <CardDescription>
                  Estimativa de lucro anual baseada nas assinaturas ativas
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-4xl font-bold text-blue-600">
                  R$ {yearlyProfit.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          )}
          
          {isReportVisible("avg-subscription-value") && (
            <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 pb-3">
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
                  Valor Médio de Assinatura
                </CardTitle>
                <CardDescription>
                  Média do valor das assinaturas ativas
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-4xl font-bold text-purple-600">
                  R$ {avgSubscriptionValue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          )}
          
          {isReportVisible("expiring-subscriptions") && (
            <Card className="overflow-hidden border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 pb-3">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-amber-600" />
                  Assinaturas Próximas do Vencimento
                </CardTitle>
                <CardDescription>
                  Clientes com assinaturas que vencem nos próximos 5 dias
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-4xl font-bold text-amber-600">
                  {expiringCount}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-6 mt-2">
          {isReportVisible("profit-per-plan") && (
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all">
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
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all">
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
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all">
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
        
        <TabsContent value="customize" className="space-y-4 mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Personalizar Relatórios
              </CardTitle>
              <CardDescription>
                Escolha quais relatórios deseja exibir na sua dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="flex items-center justify-between border-b pb-3 hover:bg-muted/20 p-2 rounded-md transition-colors">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {report.id === "monthly-profit" && <TrendingUp className="mr-2 h-4 w-4 text-green-600" />}
                        {report.id === "yearly-profit" && <Calendar className="mr-2 h-4 w-4 text-blue-600" />}
                        {report.id === "avg-subscription-value" && <BarChart3 className="mr-2 h-4 w-4 text-purple-600" />}
                        {report.id === "expiring-subscriptions" && <Clock className="mr-2 h-4 w-4 text-amber-600" />}
                        {report.id === "profit-per-plan" && <PieChart className="mr-2 h-4 w-4 text-indigo-600" />}
                        {report.id === "renewal-rate" && <Activity className="mr-2 h-4 w-4 text-pink-600" />}
                        {report.id === "customer-retention" && <Users className="mr-2 h-4 w-4 text-cyan-600" />}
                        {report.title}
                      </h3>
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
