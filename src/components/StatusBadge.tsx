
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare } from "lucide-react";

type StatusType = 'active' | 'expired' | 'warning' | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  phoneNumber?: string;
  customerName?: string;
  planName?: string;
  daysRemaining?: number;
  showWhatsAppButton?: boolean;
}

const statusConfig = {
  active: {
    label: "Ativo",
    color: "bg-status-active text-white",
  },
  expired: {
    label: "Vencido",
    color: "bg-status-expired text-white",
  },
  warning: {
    label: "Próximo ao vencimento",
    color: "bg-status-warning text-white",
  },
  inactive: {
    label: "Inativo",
    color: "bg-gray-500 text-white",
  },
};

export function StatusBadge({ 
  status, 
  className, 
  phoneNumber, 
  customerName, 
  planName, 
  daysRemaining,
  showWhatsAppButton = false
}: StatusBadgeProps) {
  const config = statusConfig[status];
  
  const handleWhatsAppClick = () => {
    if (!phoneNumber) return;
    
    // Remove any non-numeric characters from the phone number
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    
    // Format phone number to international format if needed
    // If it doesn't start with +, add Brazil's country code
    const formattedPhone = cleanPhone.startsWith("+") 
      ? cleanPhone 
      : `55${cleanPhone}`;
    
    let message: string;
    
    if (status === 'expired') {
      message = encodeURIComponent(
        `Olá ${customerName}, notamos que seu plano ${planName} está vencido. ` +
        `Gostaríamos de oferecer uma renovação para que você possa voltar a aproveitar nossos serviços. ` +
        `Podemos conversar sobre as opções disponíveis?`
      );
    } else {
      // Status is 'warning'
      message = encodeURIComponent(
        `Olá ${customerName}, notamos que seu plano ${planName} está próximo do vencimento (restam ${daysRemaining} dias). ` +
        `Gostaríamos de oferecer uma renovação para que você continue aproveitando nossos serviços sem interrupções. ` +
        `Podemos conversar sobre as opções disponíveis?`
      );
    }
    
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };
  
  const showWhatsApp = showWhatsAppButton && (status === "warning" || status === "expired") && phoneNumber;
  
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          config.color,
          className
        )}
      >
        {config.label}
      </span>
      
      {showWhatsApp && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-full bg-green-500 hover:bg-green-600 text-white p-1 h-5 w-5 flex items-center justify-center"
              onClick={handleWhatsAppClick}
            >
              <MessageSquare className="h-3 w-3 text-white" />
              <span className="sr-only">Enviar mensagem no WhatsApp</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enviar mensagem no WhatsApp</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
