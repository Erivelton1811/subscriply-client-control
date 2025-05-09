
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
import { Trash2 } from "lucide-react";

interface DeleteCustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  customerName?: string;
}

export function DeleteCustomerDialog({ 
  isOpen, 
  onOpenChange, 
  onConfirm,
  customerName
}: DeleteCustomerDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="py-2">
            {customerName ? (
              <>
                Tem certeza que deseja excluir o cliente <span className="font-semibold">{customerName}</span>? 
                <br />Esta ação não pode ser desfeita.
              </>
            ) : (
              <>
                Tem certeza que deseja excluir este cliente? 
                <br />Esta ação não pode ser desfeita.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
