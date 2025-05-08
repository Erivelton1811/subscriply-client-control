
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Settings, Users, Eye, Edit } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, addUser, getUsers } = useAuthStore();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  
  // Protect admin panel from unauthorized access
  React.useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [navigate, user]);
  
  // Get all users
  const users = getUsers ? getUsers() : [];
  
  // Handle add user form submission
  const handleAddUser = () => {
    if (newUsername && newPassword) {
      addUser(newUsername, newPassword, newIsAdmin);
      toast.success('Usuário adicionado com sucesso!');
      setNewUsername("");
      setNewPassword("");
      setNewIsAdmin(false);
      setAddUserDialogOpen(false);
    } else {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
    }
  };
  
  // View user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewUserDialogOpen(true);
  };
  
  // Edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUsername(user.username);
    setNewPassword("");
    setNewIsAdmin(user.isAdmin);
    setEditUserDialogOpen(true);
  };
  
  // Save edited user
  const handleSaveUser = () => {
    if (newUsername) {
      // In a real implementation, you would update the user in the store
      toast.success('Usuário atualizado com sucesso!');
      setEditUserDialogOpen(false);
    } else {
      toast.error('Nome de usuário é obrigatório.');
    }
  };
  
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
            <div className="space-y-4">
              <Button variant="default" onClick={() => setAddUserDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
              
              {users.length > 0 ? (
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.username}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>
                            <Badge variant={user.isAdmin ? "default" : "secondary"}>
                              {user.isAdmin ? "Administrador" : "Usuário"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground mt-4">
                  Nenhum usuário cadastrado além do administrador principal.
                </p>
              )}
            </div>
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
            <Button variant="default" onClick={() => setSettingsDialogOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Acessar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar um novo usuário no sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input 
                id="username" 
                value={newUsername} 
                onChange={(e) => setNewUsername(e.target.value)} 
                placeholder="Digite o nome de usuário"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Digite a senha"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={newIsAdmin}
                onChange={(e) => setNewIsAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isAdmin">É administrador?</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddUser}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View User Dialog */}
      <Dialog open={viewUserDialogOpen} onOpenChange={setViewUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome de Usuário</p>
                  <p>{selectedUser.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                  <Badge variant={selectedUser.isAdmin ? "default" : "secondary"}>
                    {selectedUser.isAdmin ? "Administrador" : "Usuário"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUserDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário no sistema.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Nome de Usuário</Label>
                <Input 
                  id="edit-username" 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Nova Senha (deixe em branco para manter a atual)</Label>
                <Input 
                  id="edit-password" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Digite a nova senha"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isAdmin"
                  checked={newIsAdmin}
                  onChange={(e) => setNewIsAdmin(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-isAdmin">É administrador?</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveUser}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* System Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações do Sistema</DialogTitle>
            <DialogDescription>
              Gerencie as configurações gerais do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-center text-muted-foreground">
              As configurações avançadas do sistema serão implementadas em breve.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setSettingsDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

