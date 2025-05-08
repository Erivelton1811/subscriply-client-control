
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useCustomerById } from "@/hooks/use-customers"; // Importamos o novo hook

// Import our new components
import { CustomerHeader } from "@/components/customer-details/CustomerHeader";
import { CustomerInfoCard } from "@/components/customer-details/CustomerInfoCard";
import { SubscriptionCard } from "@/components/customer-details/SubscriptionCard";
import { DeleteCustomerDialog } from "@/components/customer-details/DeleteCustomerDialog";
import { RenewSubscriptionDialog } from "@/components/customer-details/RenewSubscriptionDialog";

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deleteCustomer, renewSubscription, plans, removeSubscription } = useSubscriptionStore();
  const { customer, isLoading } = useCustomerById(id); // Usamos o novo hook
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState("");

  if (!id) {
    navigate("/customers");
    return null;
  }

  // Verifica se está carregando ou se o cliente não existe
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>;
  }

  if (!customer) {
    navigate("/customers");
    return null;
  }

  const handleDelete = () => {
    deleteCustomer(id);
    navigate("/customers");
  };

  const handleRenew = () => {
    renewSubscription(id, selectedSubscriptionId, selectedPlanId || undefined);
    setIsRenewDialogOpen(false);
  };

  const openRenewDialog = (subscriptionId: string, planId: string) => {
    setSelectedSubscriptionId(subscriptionId);
    setSelectedPlanId(planId);
    setIsRenewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getEndDate = (startDate: string, duration: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    return formatDate(end.toISOString());
  };

  return (
    <div className="space-y-6">
      <CustomerHeader customerName={customer.name} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information Card */}
        <CustomerInfoCard 
          id={id}
          email={customer.email}
          phone={customer.phone}
          name={customer.name}
          status={customer.status}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
        />

        {/* Subscriptions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Assinaturas</h2>
          
          {customer.subscriptions.length === 0 ? (
            <p className="text-muted-foreground">Este cliente não possui assinaturas.</p>
          ) : (
            customer.subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscriptionId={subscription.id}
                status={subscription.status}
                daysRemaining={subscription.daysRemaining}
                planName={subscription.plan.name}
                planPrice={subscription.plan.price}
                startDate={formatDate(subscription.startDate)}
                endDate={getEndDate(subscription.startDate, subscription.plan.duration)}
                onRenewClick={() => openRenewDialog(subscription.id, subscription.plan.id)}
                onRemoveClick={() => removeSubscription(id, subscription.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteCustomerDialog 
        isOpen={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      {/* Renew Subscription Dialog */}
      <RenewSubscriptionDialog 
        isOpen={isRenewDialogOpen}
        onOpenChange={setIsRenewDialogOpen}
        onConfirm={handleRenew}
        plans={plans}
        selectedPlanId={selectedPlanId}
        onPlanChange={setSelectedPlanId}
        daysRemaining={customer.subscriptions.find(sub => sub.id === selectedSubscriptionId)?.daysRemaining || 0}
      />
    </div>
  );
}
