
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
import { Plan } from "@/types";

interface RenewSubscriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  plans: Plan[];
  selectedPlanId: string;
  onPlanChange: (planId: string) => void;
  daysRemaining: number;
}

export function RenewSubscriptionDialog({ 
  isOpen, 
  onOpenChange, 
  onConfirm,
  plans,
  selectedPlanId,
  onPlanChange,
  daysRemaining
}: RenewSubscriptionDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Renovar Assinatura</AlertDialogTitle>
          <AlertDialogDescription>
            Escolha o plano para renovação.
            {daysRemaining > 0 ? (
              <p className="mt-2 font-medium text-amber-600">
                O cliente ainda possui {daysRemaining} dias restantes. Esses dias serão acumulados com o novo período.
              </p>
            ) : (
              <p className="mt-2">A nova data de início será hoje.</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Select
            value={selectedPlanId}
            onValueChange={onPlanChange}
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
          <AlertDialogAction onClick={onConfirm}>Renovar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
