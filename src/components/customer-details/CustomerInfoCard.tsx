
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Mail, Phone, CheckCircle, XCircle } from "lucide-react";

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
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-t-4 border-t-primary">
      <CardHeader className="bg-gradient-to-r from-muted/50 to-background pb-3">
        <CardTitle>Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="rounded-md bg-muted/30 p-3 flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium">{email}</p>
          </div>
        </div>
        
        {phone && (
          <div className="rounded-md bg-muted/30 p-3 flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Telefone</p>
              <p className="font-medium">{phone}</p>
            </div>
          </div>
        )}
        
        <div className="rounded-md bg-muted/30 p-3 flex items-center gap-2">
          {status === 'active' ? (
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
          )}
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className={`font-medium ${status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
              {status === 'active' ? 'Ativo' : 'Inativo'}
            </p>
          </div>
        </div>
        
        <div className="pt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" asChild className="sm:flex-1 group">
            <Link to={`/customers/${id}/edit`} className="w-full">
              <Edit className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Editar
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            className="sm:flex-1 group"
            onClick={onDeleteClick}
          >
            <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
