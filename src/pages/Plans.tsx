
import { useState } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Plans() {
  const { plans, deletePlan } = useSubscriptionStore();
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (planToDelete) {
      deletePlan(planToDelete);
      setPlanToDelete(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Planos</h1>
        <Button asChild>
          <Link to="/plans/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Link>
        </Button>
      </div>

      {plans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold">
                    {formatPrice(plan.price)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Duração: {plan.duration} dias
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" asChild className="flex-1">
                      <Link to={`/plans/${plan.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => setPlanToDelete(plan.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Nenhum plano cadastrado</p>
            <Button asChild>
              <Link to="/plans/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Plano
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={planToDelete !== null} onOpenChange={() => setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
