
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        let Icon = Info;
        
        if (variant === "destructive") {
          Icon = XCircle;
        } else if (variant === "success") {
          Icon = CheckCircle;
        } else if (variant === "warning") {
          Icon = AlertCircle;
        }
        
        return (
          <Toast key={id} {...props} className="shadow-lg">
            <div className="grid gap-1 items-center grid-cols-[auto_1fr] px-1">
              {variant && (
                <div className="mr-2">
                  <Icon className={`h-5 w-5 ${
                    variant === "destructive" ? "text-destructive" : 
                    variant === "success" ? "text-green-500" :
                    variant === "warning" ? "text-yellow-500" : "text-blue-500"
                  }`} />
                </div>
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
