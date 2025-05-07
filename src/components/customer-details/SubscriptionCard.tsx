
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { DaysRemainingIndicator } from "@/components/DaysRemainingIndicator";
import { RefreshCw, Trash2 } from "lucide-react";

interface SubscriptionCardProps {
  subscriptionId: string;
  status: 'warning' | 'expired' | 'active';
  daysRemaining: number;
  planName: string;
  planPrice: number;
  startDate: string;
  endDate: string;
  onRenewClick: () => void;
  onRemoveClick: () => void;
}

export function SubscriptionCard({ 
  subscriptionId,
  status, 
  daysRemaining, 
  planName, 
  planPrice, 
  startDate, 
  endDate,
  onRenewClick,
  onRemoveClick
}: SubscriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{planName}</CardTitle>
            <CardDescription>Status atual e detalhes do plano</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onRemoveClick}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <StatusBadge status={status} />
          <DaysRemainingIndicator days={daysRemaining} />
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Preço</p>
          <p>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(planPrice)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Data Início</p>
            <p>{startDate}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Data Término</p>
            <p>{endDate}</p>
          </div>
        </div>
        
        <div className="pt-2">
          <Button onClick={onRenewClick} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Renovar Assinatura
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
