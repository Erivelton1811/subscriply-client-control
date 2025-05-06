
import { cn } from "@/lib/utils";

type StatusType = 'active' | 'expired' | 'warning';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  active: {
    label: "Ativo",
    color: "bg-status-active text-white",
  },
  expired: {
    label: "Vencido",
    color: "bg-status-expired text-white",
  },
  warning: {
    label: "Próximo ao vencimento",
    color: "bg-status-warning text-white",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
