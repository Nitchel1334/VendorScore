import { ArrowLeft, Bell, MoreVertical } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: "bell" | "more" | "none";
  onRightAction?: () => void;
  light?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction = "none",
  onRightAction,
  light = false,
}: Props) {
  const bg = light ? "bg-background" : "bg-primary";
  const fg = light ? "text-foreground" : "text-primary-foreground";
  const fgMuted = light ? "text-muted-foreground" : "text-primary-foreground/70";

  return (
    <div className={`${bg} px-4 py-3 flex items-center gap-3 shrink-0`}>
      {onBack && (
        <button
          onClick={onBack}
          className={`${fg} p-1 rounded-full hover:bg-white/10 transition-colors`}
          style={{ minWidth: 32, minHeight: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h2 className={`${fg} truncate`} style={{ fontSize: "1rem", fontWeight: 700 }}>
          {title}
        </h2>
        {subtitle && (
          <p className={`${fgMuted} truncate`} style={{ fontSize: "0.75rem" }}>
            {subtitle}
          </p>
        )}
      </div>
      {rightAction === "bell" && (
        <button
          onClick={onRightAction}
          className={`${fg} p-1 rounded-full hover:bg-white/10 transition-colors relative`}
          style={{ minWidth: 32, minHeight: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full" />
        </button>
      )}
      {rightAction === "more" && (
        <button
          onClick={onRightAction}
          className={`${fg} p-1 rounded-full hover:bg-white/10 transition-colors`}
          style={{ minWidth: 32, minHeight: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <MoreVertical size={20} />
        </button>
      )}
    </div>
  );
}
