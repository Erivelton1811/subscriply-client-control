
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";

export default function PlanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plans, addPlan, updatePlan, getPlanById } = useSubscriptionStore();
  const currentUser = useAuthStore(state => state.user);
  
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    resalePrice: 0,
    duration: 30,
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    resalePrice: "",
    duration: "",
    description: "",
  });

  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (id) {
      const plan = getPlanById(id);
      if (plan) {
        setFormData({
          name: plan.name,
          price: plan.price,
          resalePrice: plan.resalePrice || 0,
          duration: plan.duration,
          description: plan.description,
        });
      }
    }
  }, [id, getPlanById]);

  useEffect(() => {
    // Calculate profit whenever price or resalePrice changes
    const calculatedProfit = formData.price - formData.resalePrice;
    setProfit(calculatedProfit > 0 ? calculatedProfit : 0);
  }, [formData.price, formData.resalePrice]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { 
      name: "", 
      price: "", 
      resalePrice: "", 
      duration: "", 
      description: "" 
    };

    if (!formData.name.trim()) {
      newErrors.name = "Nome do plano é obrigatório";
      valid = false;
    }

    if (formData.price <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
      valid = false;
    }

    if (formData.resalePrice < 0) {
      newErrors.resalePrice = "Preço de revenda não pode ser negativo";
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
    
    if (!currentUser) {
      // Handle case when user is not logged in
      return;
    }
    
    if (id) {
      updatePlan(id, formData);
    } else {
      // Add userId to the form data when creating a new plan
      const planWithUserId = {
        ...formData,
        userId: currentUser.username
      };
      addPlan(planWithUserId);
    }
    
    navigate("/plans");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "price" || name === "duration" || name === "resalePrice") {
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
              <Label htmlFor="resalePrice">Preço de Revenda (R$)</Label>
              <Input
                id="resalePrice"
                name="resalePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.resalePrice}
                onChange={handleChange}
              />
              {errors.resalePrice && (
                <p className="text-sm text-destructive">{errors.resalePrice}</p>
              )}
            </div>

            <div className="p-4 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Lucro por Plano:</span>
                <span className="text-xl font-bold text-green-600">
                  R$ {profit.toFixed(2)}
                </span>
              </div>
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
