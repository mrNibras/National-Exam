import { cn } from "@/lib/utils";

const StatCard = ({ title, value, subtitle, icon: Icon, trend, className }) => {
  return (
    <div className={cn("bg-card rounded-xl p-5 shadow-card border border-border transition-all duration-200 hover:shadow-elevated", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-heading font-bold mt-1 text-card-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <p className={cn("text-xs font-medium mt-1", trend >= 0 ? "text-success" : "text-destructive")}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;