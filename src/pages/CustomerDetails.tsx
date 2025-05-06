
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { DaysRemainingIndicator } from "@/components/DaysRemainingIndicator";
import { Edit, Trash2, RefreshCw, ArrowLeft, MessageCircle } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerById, deleteCustomer, renewSubscription, plans } = useSubscriptionStore();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  if (!id) {
    navigate("/customers");
    return null;
  }

  const customer = getCustomerById(id);

  if (!customer) {
    navigate("/customers");
    return null;
  }

  const handleDelete = () => {
    deleteCustomer(id);
    navigate("/customers");
  };

  const handleRenew = () => {
    renewSubscription(id, selectedPlanId || undefined);
    setIsRenewDialogOpen(false);
  };

  const openRenewDialog = () => {
    setSelectedPlanId(customer.plan.id);
    setIsRenewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const startDate = new Date(customer.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + customer.plan.duration);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link to="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{customer.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{customer.email}</p>
            </div>
            
            {customer.phone && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p>{customer.phone}</p>
                </div>
                
                {customer.status === "warning" && customer.phone && (
                  <WhatsAppButton 
                    phoneNumber={customer.phone} 
                    customerName={customer.name} 
                    planName={customer.plan.name}
                    daysRemaining={customer.daysRemaining}
                  />
                )}
              </div>
            )}
            
            <div className="pt-2 flex space-x-2">
              <Button variant="outline" asChild className="flex-1">
                <Link to={`/customers/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Information */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Assinatura</CardTitle>
            <CardDescription>Status atual e detalhes do plano</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <StatusBadge status={customer.status} />
              <DaysRemainingIndicator days={customer.daysRemaining} />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Plano Atual</p>
              <p className="font-bold">{customer.plan.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Preço</p>
              <p>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(customer.plan.price)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Data Início</p>
                <p>{formatDate(customer.startDate)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Data Término</p>
                <p>{formatDate(endDate.toISOString())}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button onClick={openRenewDialog} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Renovar Assinatura
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Renew Subscription Dialog */}
      <AlertDialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Renovar Assinatura</AlertDialogTitle>
            <AlertDialogDescription>
              Escolha o plano para renovação. A nova data de início será hoje.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Select
              value={selectedPlanId}
              onValueChange={setSelectedPlanId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(plan.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRenew}>Renovar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
