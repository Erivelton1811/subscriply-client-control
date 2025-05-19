
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  phone: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  planId: z.string().optional(),
  startDate: z.date().optional()
});

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCustomer, updateCustomer, customers, addSubscriptionToCustomer } = useSubscriptionStore();
  const { plans } = useSubscriptionStore();
  const currentUser = useAuthStore((state) => state.user);
  
  // Filtrar planos pelo usuário atual
  const userPlans = plans.filter(plan => 
    plan.userId === currentUser?.username
  );
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "active" as "active" | "inactive",
      planId: undefined,
      startDate: new Date() // Data atual como padrão
    }
  });

  // Carregar dados do cliente se estivermos em modo de edição
  useEffect(() => {
    if (id) {
      const customer = customers.find(c => c.id === id && c.userId === currentUser?.username);
      if (customer) {
        const subscription = customer.subscriptions[0];
        form.reset({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          status: customer.status,
          planId: subscription?.planId,
          startDate: subscription ? new Date(subscription.startDate) : undefined
        });
      } else {
        // Se não encontrar o cliente, redirecionar para a lista
        toast.error("Cliente não encontrado ou não pertence a este usuário");
        navigate("/customers");
      }
    }
  }, [id, customers, form, navigate, currentUser]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      toast.error("Usuário não autenticado");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (id) {
        // Modo de edição
        updateCustomer(id, {
          ...data,
        });
        toast.success("Cliente atualizado com sucesso");
      } else {
        // Modo de criação
        // Verificando se o email já existe para este usuário
        const emailExists = customers.some(c => 
          c.email === data.email && 
          c.userId === currentUser.username
        );
        
        if (emailExists) {
          toast.error("Já existe um cliente com este email para este usuário");
          setIsSubmitting(false);
          return;
        }
        
        // Criando o cliente
        const newCustomerId = addCustomer({
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          subscriptions: [],
          userId: currentUser.username
        });
        
        // Se um plano foi selecionado, adicioná-lo ao cliente com a data escolhida
        if (data.planId) {
          // Formatar a data para ISO string
          const startDate = data.startDate ? data.startDate.toISOString() : undefined;
          addSubscriptionToCustomer(newCustomerId, data.planId, startDate);
        }
        
        toast.success("Cliente criado com sucesso");
      }
      
      // Atualizar cache do React Query
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      
      // Redirecionar para a lista de clientes
      navigate("/customers");
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast.error(`Erro ao salvar cliente: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificar se o usuário está logado
  if (!currentUser) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Acesso Restrito</CardTitle>
          <CardDescription>
            Você precisa estar logado para acessar esta página.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/login")}>Fazer Login</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{id ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
          <CardDescription>
            {id ? "Atualize os dados do cliente." : "Preencha os dados para criar um novo cliente."}
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="cliente@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator className="my-2" />
              
              <FormField
                control={form.control}
                name="planId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano (opcional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userPlans.length > 0 ? (
                          userPlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - R$ {plan.price.toFixed(2)}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-plans" disabled>
                            Nenhum plano disponível
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo de data de início - visível apenas quando um plano é selecionado */}
              {form.watch("planId") && (
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/customers")}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : id ? "Atualizar" : "Criar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
