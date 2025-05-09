
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";

interface CustomerHeaderProps {
  customerName: string;
}

export function CustomerHeader({ customerName }: CustomerHeaderProps) {
  return (
    <div className="flex items-center space-x-2 mb-6 bg-muted/40 p-3 rounded-lg shadow-sm animate-fade-in">
      <Button variant="ghost" asChild className="mr-2">
        <Link to="/customers" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{customerName}</h1>
      </div>
    </div>
  );
}
