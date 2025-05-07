
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

interface CustomerInfoCardProps {
  id: string;
  email: string;
  phone?: string;
  name: string;
  status: 'active' | 'inactive';
  onDeleteClick: () => void;
}

export function CustomerInfoCard({ 
  id, 
  email, 
  phone, 
  name, 
  status, 
  onDeleteClick 
}: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p>{email}</p>
        </div>
        
        {phone && (
          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p>{phone}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className={status === 'active' ? 'text-green-600' : 'text-gray-500'}>
            {status === 'active' ? 'Ativo' : 'Inativo'}
          </p>
        </div>
        
        <div className="pt-2 flex space-x-2">
          <Button variant="outline" asChild className="flex-1">
            <Link to={`/customers/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={onDeleteClick}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
