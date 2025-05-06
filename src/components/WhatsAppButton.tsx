
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface WhatsAppButtonProps {
  phoneNumber: string;
  customerName: string;
  planName: string;
  daysRemaining: number;
}

export function WhatsAppButton({ phoneNumber, customerName, planName, daysRemaining }: WhatsAppButtonProps) {
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
  
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-green-500 hover:bg-green-600 text-white border-0"
          onClick={() => window.open(whatsappUrl, "_blank")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Enviar mensagem no WhatsApp</p>
      </TooltipContent>
    </Tooltip>
  );
}
