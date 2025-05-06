
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

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plans, customers, addCustomer, updateCustomer, getCustomerById } =
    useSubscriptionStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    planId: "",
    status: "active" as "active" | "inactive",
    startDate: new Date().toISOString(),
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    planId: "",
  });

  useEffect(() => {
    if (id) {
      const customer = customers.find(c => c.id === id);
      if (customer) {
        setFormData({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          planId: customer.planId,
          status: customer.status || "active",
          startDate: customer.startDate,
        });
      }
    } else if (plans.length > 0) {
      // Default to first plan for new customers
      setFormData(prev => ({ ...prev, planId: plans[0].id }));
    }
  }, [id, customers, plans]);

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

    if (!formData.planId) {
      newErrors.planId = "Plano é obrigatório";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (id) {
      updateCustomer(id, formData);
    } else {
      addCustomer(formData);
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

  const handlePlanChange = (value: string) => {
    setFormData({
      ...formData,
      planId: value,
    });
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setFormData({
      ...formData,
      status: value,
    });
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

            <div className="space-y-2">
              <Label htmlFor="planId">Plano *</Label>
              <Select
                value={formData.planId}
                onValueChange={handlePlanChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - R$ {plan.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.planId && (
                <p className="text-sm text-destructive">{errors.planId}</p>
              )}
              {plans.length === 0 && (
                <p className="text-sm text-destructive">
                  Você precisa criar pelo menos um plano primeiro.
                </p>
              )}
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
