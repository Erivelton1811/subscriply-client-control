
import { useState } from "react";
import { SystemSettings } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SystemSettingsForm() {
  const { settings, updateSettings } = useAuthStore();
  const [formData, setFormData] = useState<SystemSettings>({...settings});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success("Configurações atualizadas com sucesso!");
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div>
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="allowUserRegistration"
              checked={formData.allowUserRegistration}
              onCheckedChange={(checked) => handleSwitchChange('allowUserRegistration', checked)}
            />
            <Label htmlFor="allowUserRegistration">Permitir registro de novos usuários</Label>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <div>
            <Label htmlFor="notificationEmail">Email para Notificações</Label>
            <Input
              id="notificationEmail"
              name="notificationEmail"
              type="email"
              value={formData.notificationEmail}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="enableEmailNotifications"
              checked={formData.enableEmailNotifications}
              onCheckedChange={(checked) => handleSwitchChange('enableEmailNotifications', checked)}
            />
            <Label htmlFor="enableEmailNotifications">Ativar notificações por e-mail</Label>
          </div>
          
          <div>
            <Label htmlFor="subscriptionWarningDays">Dias de aviso antes do vencimento</Label>
            <Input
              id="subscriptionWarningDays"
              name="subscriptionWarningDays"
              type="number"
              min={1}
              max={30}
              value={formData.subscriptionWarningDays}
              onChange={handleNumberChange}
              className="mt-1"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <div>
            <Label htmlFor="theme">Tema do Sistema</Label>
            <Select 
              value={formData.theme} 
              onValueChange={(value) => handleSelectChange('theme', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione um tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema (automático)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button type="submit" className="w-full">Salvar Configurações</Button>
    </form>
  );
}
