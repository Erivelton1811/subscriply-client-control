
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PlanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plans, addPlan, updatePlan, getPlanById } = useSubscriptionStore();
  
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    duration: 30,
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      const plan = getPlanById(id);
      if (plan) {
        setFormData({
          name: plan.name,
          price: plan.price,
          duration: plan.duration,
          description: plan.description,
        });
      }
    }
  }, [id, getPlanById]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", price: "", duration: "", description: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Nome do plano é obrigatório";
      valid = false;
    }

    if (formData.price <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
      valid = false;
    }

    if (formData.duration <= 0) {
      newErrors.duration = "Duração deve ser maior que zero";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (id) {
      updatePlan(id, formData);
    } else {
      addPlan(formData);
    }
    
    navigate("/plans");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "price" || name === "duration") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {id ? "Editar Plano" : "Novo Plano"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Plano *</Label>
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
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (dias) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                required
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/plans")}
              >
                Cancelar
              </Button>
              <Button type="submit">{id ? "Salvar" : "Criar"} Plano</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
