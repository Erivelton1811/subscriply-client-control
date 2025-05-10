
import { useState } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Tag, CalendarDays, ScrollText } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";

export default function Plans() {
  const { plans: allPlans, deletePlan } = useSubscriptionStore();
  const currentUser = useAuthStore((state) => state.user);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  // Filtrar planos pelo usuário atual
  const plans = allPlans.filter(plan => plan.userId === currentUser?.username);

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Planos</h1>
        <Button asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
          <Link to="/plans/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Link>
        </Button>
      </div>
      
      <Separator />

      {plans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-all border-t-4 border-t-primary">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-background pb-3">
                <Badge variant="outline" className="w-fit mb-2 bg-primary/10 hover:bg-primary/20 transition-colors">
                  {plan.id.substring(0, 8)}
                </Badge>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-primary" />
                  {plan.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(plan.price)}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                    Duração: {plan.duration} dias
                  </div>

                  {plan.resalePrice && plan.resalePrice > 0 && (
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300">
                        Revenda: {formatPrice(plan.resalePrice)}
                      </Badge>
                      <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300">
                        Lucro: {formatPrice(plan.resalePrice - plan.price)}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 border-t pt-4 bg-muted/20">
                <Button variant="outline" asChild className="flex-1 hover:bg-primary/10 hover:text-primary">
                  <Link to={`/plans/${plan.id}/edit`} className="flex items-center justify-center">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setPlanToDelete(plan.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <ScrollText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground">Nenhum plano cadastrado</p>
            <Button asChild className="mt-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Link to="/plans/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Plano
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={planToDelete !== null} onOpenChange={() => setPlanToDelete(null)}>
        <AlertDialogContent className="border-t-4 border-t-destructive">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
