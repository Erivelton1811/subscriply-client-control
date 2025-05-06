
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSubscriptionStore } from "@/store/subscriptionStore";

// Import our new components
import { CustomerHeader } from "@/components/customer-details/CustomerHeader";
import { CustomerInfoCard } from "@/components/customer-details/CustomerInfoCard";
import { SubscriptionCard } from "@/components/customer-details/SubscriptionCard";
import { DeleteCustomerDialog } from "@/components/customer-details/DeleteCustomerDialog";
import { RenewSubscriptionDialog } from "@/components/customer-details/RenewSubscriptionDialog";

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
      <CustomerHeader customerName={customer.name} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information Card */}
        <CustomerInfoCard 
          id={id}
          email={customer.email}
          phone={customer.phone}
          name={customer.name}
          planName={customer.plan.name}
          status={customer.status}
          daysRemaining={customer.daysRemaining}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
        />

        {/* Subscription Information Card */}
        <SubscriptionCard 
          status={customer.status}
          daysRemaining={customer.daysRemaining}
          planName={customer.plan.name}
          planPrice={customer.plan.price}
          startDate={formatDate(customer.startDate)}
          endDate={formatDate(endDate.toISOString())}
          onRenewClick={openRenewDialog}
        />
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
      />
    </div>
  );
}
