import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore"; // Importamos o authStore

type SubscriptionFormItem = {
  planId: string;
  startDate: Date;
};

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plans, customers, addCustomer, updateCustomer, getCustomerById } =
    useSubscriptionStore();
  const { user } = useAuthStore(); // Obtemos o usuário atual

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive",
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionFormItem[]>([
    { planId: plans.length > 0 ? plans[0].id : "", startDate: new Date() }
  ]);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    planId: "",
  });

  useEffect(() => {
    if (id) {
      const customer = getCustomerById(id);
      if (customer) {
        setFormData({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          status: customer.status,
        });

        // Set subscriptions with correct dates
        setSubscriptions(
          customer.subscriptions.map(sub => ({
            planId: sub.plan.id,
            startDate: new Date(sub.startDate)
          }))
        );
      }
    } else if (plans.length > 0 && subscriptions.length === 1 && !subscriptions[0].planId) {
      // Default to first plan for new customers
      setSubscriptions([{ planId: plans[0].id, startDate: new Date() }]);
    }
  }, [id, customers, plans, getCustomerById]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", planId: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
      valid = false;
    }

    if (subscriptions.length === 0 || subscriptions.some(sub => !sub.planId)) {
      newErrors.planId = "Pelo menos um plano é obrigatório";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Format subscriptions for the store
    const formattedSubscriptions = subscriptions.map(sub => ({
      id: Math.random().toString(36).substring(2, 11),
      planId: sub.planId,
      startDate: sub.startDate.toISOString()
    }));

    // Verificar se o usuário está logado
    if (!user) {
      console.error("Usuário não está logado");
      return;
    }

    if (id) {
      updateCustomer(id, {
        ...formData,
        subscriptions: formattedSubscriptions
      });
    } else {
      addCustomer({
        ...formData,
        subscriptions: formattedSubscriptions,
        userId: user.username // Adicionar userId do usuário logado
      });
    }

    navigate("/customers");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const handlePlanChange = (value: string, index: number) => {
    const updatedSubscriptions = [...subscriptions];
    updatedSubscriptions[index].planId = value;
    setSubscriptions(updatedSubscriptions);
  };

  const handleDateSelect = (date: Date | undefined, index: number) => {
    if (date) {
      const updatedSubscriptions = [...subscriptions];
      updatedSubscriptions[index].startDate = date;
      setSubscriptions(updatedSubscriptions);
    }
  };

  const addSubscription = () => {
    setSubscriptions([...subscriptions, { planId: "", startDate: new Date() }]);
  };

  const removeSubscription = (index: number) => {
    if (subscriptions.length > 1) {
      setSubscriptions(subscriptions.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {id ? "Editar Cliente" : "Novo Cliente"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(DDD) XXXXX-XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleStatusChange(value as "active" | "inactive")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Planos *</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addSubscription}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Plano
                </Button>
              </div>
              
              {errors.planId && (
                <p className="text-sm text-destructive">{errors.planId}</p>
              )}
              
              {plans.length === 0 && (
                <p className="text-sm text-destructive">
                  Você precisa criar pelo menos um plano primeiro.
                </p>
              )}
              
              <div className="space-y-4">
                {subscriptions.map((subscription, index) => (
                  <div key={index} className="border p-4 rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Plano {index + 1}</h4>
                      {subscriptions.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeSubscription(index)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Plano</Label>
                      <Select
                        value={subscription.planId}
                        onValueChange={(value) => handlePlanChange(value, index)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(plan.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Data de Início</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {subscription.startDate ? (
                              format(subscription.startDate, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione a data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={subscription.startDate}
                            onSelect={(date) => handleDateSelect(date, index)}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/customers")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={plans.length === 0}>
                {id ? "Salvar" : "Adicionar"} Cliente
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
