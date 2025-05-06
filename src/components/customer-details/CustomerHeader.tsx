
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CustomerHeaderProps {
  customerName: string;
}

export function CustomerHeader({ customerName }: CustomerHeaderProps) {
  return (
    <div className="flex items-center">
      <Button variant="ghost" asChild className="mr-4">
        <Link to="/customers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <h1 className="text-3xl font-bold">{customerName}</h1>
    </div>
  );
}
