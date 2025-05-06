
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type StatusType = 'active' | 'expired' | 'warning';

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
    
    const message = encodeURIComponent(
      `Olá ${customerName}, notamos que seu plano ${planName} está próximo do vencimento (restam ${daysRemaining} dias). ` +
      `Gostaríamos de oferecer uma renovação para que você continue aproveitando nossos serviços sem interrupções. ` +
      `Podemos conversar sobre as opções disponíveis?`
    );
    
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };
  
  const showWhatsApp = showWhatsAppButton && status === "warning" && phoneNumber;
  
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="white"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-circle"
              >
                <path d="M12 1a11 11 0 0 0-11 11c0 1.9.5 3.8 1.3 5.4l-1.2 3.6 3.7-1.2A11 11 0 0 0 23 12 11 11 0 0 0 12 1Z"></path>
                <path d="M8 9h2"></path>
                <path d="M14 9h2"></path>
                <path d="M8 13h8"></path>
              </svg>
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
