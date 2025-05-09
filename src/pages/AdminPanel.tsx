
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Settings, User, Eye, Edit, Trash2, Shield, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SystemSettingsForm } from "@/components/admin/SystemSettingsForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, addUser, updateUser, deleteUser, getUsers } = useAuthStore();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Form states
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [originalUsername, setOriginalUsername] = useState("");
  
  // Protect admin panel from unauthorized access
  React.useEffect(() => {
    if (!user?.isAdmin) {
      toast.error("Acesso não autorizado");
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
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setViewUserDialogOpen(true);
  };
  
  // Edit user
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setOriginalUsername(user.username);
    setNewUsername(user.username);
    setNewPassword("");
    setNewIsAdmin(user.isAdmin);
    setEditUserDialogOpen(true);
  };
  
  // Confirm delete user
  const handleConfirmDeleteUser = (user: any) => {
    setSelectedUser(user);
    setDeleteUserDialogOpen(true);
  };
  
  // Delete user
  const handleDeleteUser = () => {
    if (selectedUser) {
      const success = deleteUser(selectedUser.username);
      if (success) {
        setDeleteUserDialogOpen(false);
      }
    }
  };
  
  // Save edited user
  const handleSaveUser = () => {
    if (newUsername) {
      updateUser(originalUsername, newUsername, newPassword || undefined, newIsAdmin);
      toast.success('Usuário atualizado com sucesso!');
      setEditUserDialogOpen(false);
    } else {
      toast.error('Nome de usuário é obrigatório.');
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Gerenciar Usuários
            </CardTitle>
            <CardDescription>
              Adicione ou modifique usuários para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="default" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all" onClick={() => setAddUserDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
              
              {users.length > 0 ? (
                <div className="border rounded-md mt-4 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.username} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>
                            <Badge variant={user.isAdmin ? "default" : "secondary"} className="flex w-fit items-center gap-1">
                              {user.isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                              {user.isAdmin ? "Administrador" : "Usuário"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)} className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.username !== 'eriveltonadmin' && (
                                <Button variant="ghost" size="sm" onClick={() => handleConfirmDeleteUser(user)} className="text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground mt-4 p-4 border border-dashed rounded-md text-center">
                  Nenhum usuário cadastrado além do administrador principal.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Configurações do Sistema
            </CardTitle>
            <CardDescription>
              Gerencie as configurações gerais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all" 
              onClick={() => setSettingsDialogOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Acessar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                className="focus-visible:ring-blue-500"
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
                className="focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAdmin"
                checked={newIsAdmin}
                onCheckedChange={(checked) => setNewIsAdmin(checked === true)}
              />
              <Label htmlFor="isAdmin">É administrador?</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View User Dialog */}
      <Dialog open={viewUserDialogOpen} onOpenChange={setViewUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Nome de Usuário</p>
                  <p className="font-semibold">{selectedUser.username}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tipo</p>
                  <Badge variant={selectedUser.isAdmin ? "default" : "secondary"} className="flex w-fit items-center gap-1">
                    {selectedUser.isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
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
        <DialogContent className="sm:max-w-[425px]">
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
                  className="focus-visible:ring-amber-500"
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
                  className="focus-visible:ring-amber-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isAdmin"
                  checked={newIsAdmin}
                  onCheckedChange={(checked) => setNewIsAdmin(checked === true)}
                />
                <Label htmlFor="edit-isAdmin">É administrador?</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveUser} className="bg-amber-600 hover:bg-amber-700">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteUserDialogOpen} onOpenChange={setDeleteUserDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário "{selectedUser?.username}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteUserDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* System Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configurações do Sistema</DialogTitle>
            <DialogDescription>
              Gerencie as configurações gerais do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <SystemSettingsForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
