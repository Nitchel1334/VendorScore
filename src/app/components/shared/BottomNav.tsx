import { Home, List, PlusCircle, BarChart2, UserCircle } from "lucide-react";

interface Props {
  currentScreen: string;
  navigate: (screen: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "transaction-history", label: "Ledger", icon: List },
  { id: "manual-transaction", label: "Add", icon: PlusCircle, center: true },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "credit-score", label: "Score", icon: UserCircle },
];

export function BottomNav({ currentScreen, navigate }: Props) {
  return (
    <div className="bg-card border-t border-border flex items-center justify-around px-2 py-1 shrink-0 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          currentScreen === tab.id ||
          (tab.id === "dashboard" && currentScreen === "dashboard") ||
          (tab.id === "credit-score" &&
            (currentScreen === "credit-score" || currentScreen === "loan-eligibility"));

        if (tab.center) {
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className="flex flex-col items-center justify-center -mt-5"
              style={{ minWidth: 56 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Icon size={22} className="text-primary-foreground" />
              </div>
              <span
                className="text-muted-foreground mt-0.5"
                style={{ fontSize: "0.625rem", fontWeight: 600 }}
              >
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className="flex flex-col items-center justify-center py-1 gap-0.5 flex-1"
          >
            <Icon
              size={20}
              className={isActive ? "text-primary" : "text-muted-foreground"}
            />
            <span
              className={isActive ? "text-primary" : "text-muted-foreground"}
              style={{ fontSize: "0.625rem", fontWeight: isActive ? 700 : 500 }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
