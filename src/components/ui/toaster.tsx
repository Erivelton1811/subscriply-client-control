
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

// Add custom variants to the toast types
type ExtendedVariant = "default" | "destructive" | "success" | "warning";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        let Icon = Info;
        
        // Using our extended variant type for proper type checking
        const toastVariant = variant as ExtendedVariant;
        
        if (toastVariant === "destructive") {
          Icon = XCircle;
        } else if (toastVariant === "success") {
          Icon = CheckCircle;
        } else if (toastVariant === "warning") {
          Icon = AlertCircle;
        }
        
        return (
          <Toast key={id} {...props} className="shadow-lg border transition-all duration-200 animate-fade-in">
            <div className="grid gap-1 items-center grid-cols-[auto_1fr] px-1">
              {toastVariant && (
                <div className="mr-2">
                  <Icon className={`h-5 w-5 ${
                    toastVariant === "destructive" ? "text-destructive" : 
                    toastVariant === "success" ? "text-green-500" :
                    toastVariant === "warning" ? "text-yellow-500" : "text-blue-500"
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
