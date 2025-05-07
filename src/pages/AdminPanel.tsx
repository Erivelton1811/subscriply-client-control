
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Protect admin panel from unauthorized access
  React.useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [navigate, user]);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <CardDescription>
              Adicione novos usuários para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Atualmente, apenas o usuário administrador possui acesso. 
              A funcionalidade para adicionar mais usuários será implementada em breve.
            </p>
            <Button variant="secondary" disabled>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
            <CardDescription>
              Gerencie as configurações gerais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              As configurações do sistema serão implementadas em breve.
            </p>
            <Button variant="secondary" disabled>
              Acessar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
