
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  customerName: string;
  planName: string;
  daysRemaining?: number;
  status: 'warning' | 'expired';
}

export function WhatsAppButton({ phoneNumber, customerName, planName, daysRemaining, status }: WhatsAppButtonProps) {
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
          <MessageSquare className="h-4 w-4"/>
          <span className="sr-only">Enviar mensagem no WhatsApp</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Enviar mensagem no WhatsApp</p>
      </TooltipContent>
    </Tooltip>
  );
}
