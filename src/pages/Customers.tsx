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
import { Edit, Trash2, Plus } from "lucide-react";
import { Customer, CustomerWithPlanDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCustomers } from "@/hooks/use-customers";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
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

  const filteredCustomers = useMemo(() => {
    const lowerCaseSearch = search.toLowerCase();
    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(lowerCaseSearch) ||
        customer.email.toLowerCase().includes(lowerCaseSearch)
      );
    });
  }, [customers, search]);

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <Link to="/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Button>
        </Link>
      </div>

      <Input
        type="search"
        placeholder="Buscar clientes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Planos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <Link to={`/customers/${customer.id}`} className="hover:underline">
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === 'active' ? 'outline' : 'secondary'}>
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
                              sub.status === 'warning' ? 'warning' :
                              sub.status === 'expired' ? 'destructive' :
                              'default'
                            }
                            className="mr-2"
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/customers/${customer.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(customer.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
