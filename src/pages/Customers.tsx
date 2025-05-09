
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Plus, Search, UserPlus, Users, EyeIcon, Filter, ArrowUpDown } from "lucide-react";
import { Customer, CustomerWithPlanDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCustomers } from "@/hooks/use-customers";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const queryClient = useQueryClient();
  const deleteCustomer = useSubscriptionStore(state => state.deleteCustomer);
  
  // Use the custom hook for customers data
  const customers = useCustomers();

  const { mutate: removeCustomer, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => {
      deleteCustomer(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success('Cliente removido com sucesso!');
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setDeleteConfirmationOpen(false);
      setCustomerToDelete(null);
    },
    onError: (error: any) => {
      toast.error(`Erro ao remover cliente: ${error.message}`);
      setDeleteConfirmationOpen(false);
      setCustomerToDelete(null);
    },
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortField === "email") {
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
      } else if (sortField === "status") {
        aValue = a.status;
        bValue = b.status;
      } else if (sortField === "plans") {
        aValue = a.subscriptions.length;
        bValue = b.subscriptions.length;
      } else {
        return 0;
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [customers, sortField, sortDirection]);

  const filteredCustomers = useMemo(() => {
    const lowerCaseSearch = search.toLowerCase();
    return sortedCustomers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(lowerCaseSearch) ||
        customer.email.toLowerCase().includes(lowerCaseSearch)
      );
    });
  }, [sortedCustomers, search]);

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      removeCustomer(customerToDelete);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          </div>
          <p className="text-muted-foreground">Gerencie os clientes e suas assinaturas</p>
        </div>
        <Link to="/customers/new">
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Button>
        </Link>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-1 hidden sm:flex">
          <Filter className="h-4 w-4 mr-1" />
          Filtros
        </Button>
      </div>

      <Card className="border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nome</span>
                    {sortField === "name" && (
                      <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""} transition-transform`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {sortField === "email" && (
                      <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""} transition-transform`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === "status" && (
                      <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""} transition-transform`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort("plans")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Planos</span>
                    {sortField === "plans" && (
                      <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""} transition-transform`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <Link 
                        to={`/customers/${customer.id}`} 
                        className="hover:text-primary hover:underline transition-colors flex items-center"
                      >
                        {customer.name}
                      </Link>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === 'active' ? 'outline' : 'secondary'} className={
                        customer.status === 'active' 
                          ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300" 
                          : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                      }>
                        {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {customer.subscriptions.length > 0 ? (
                        <div className="space-y-1">
                          {customer.subscriptions.map((sub, index) => (
                            <div key={index} className="flex items-center">
                              <Badge
                                variant={
                                  sub.status === 'warning' ? 'outline' :
                                  sub.status === 'expired' ? 'destructive' :
                                  'default'
                                }
                                className={`mr-2 ${
                                  sub.status === 'warning' 
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300"
                                    : sub.status === 'expired'
                                      ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300"
                                      : "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300"
                                }`}
                              >
                                {sub.plan.name}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {sub.daysRemaining > 0 
                                  ? `${sub.daysRemaining} dias restantes` 
                                  : 'Expirado'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sem planos ativos</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 w-8 h-8 p-0"
                          asChild
                        >
                          <Link to={`/customers/${customer.id}`}>
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 w-8 h-8 p-0"
                          asChild
                        >
                          <Link to={`/customers/${customer.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 w-8 h-8 p-0"
                          onClick={() => handleDeleteClick(customer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <DialogContent className="border-t-4 border-t-destructive">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDeleteConfirmationOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
