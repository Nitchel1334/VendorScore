"use client";
import { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { BottomNav } from "./components/shared/BottomNav";
import { LoginScreen } from "./components/screens/LoginScreen";
import { RegistrationScreen } from "./components/screens/RegistrationScreen";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { ManualTransactionScreen } from "./components/screens/ManualTransactionScreen";
import { VoiceTransactionScreen } from "./components/screens/VoiceTransactionScreen";
import { TransactionHistoryScreen } from "./components/screens/TransactionHistoryScreen";
import { CreditScoreScreen } from "./components/screens/CreditScoreScreen";
import { LoanEligibilityScreen } from "./components/screens/LoanEligibilityScreen";
import { ReportsScreen } from "./components/screens/ReportsScreen";
import { VendorInsightsScreen } from "./components/screens/VendorInsightsScreen";
import { AdminDashboardScreen } from "./components/screens/AdminDashboardScreen";
import { ProductSetupScreen } from "./components/screens/ProductSetupScreen";
import { QuickSaleScreen } from "./components/screens/QuickSaleScreen";
import { VendorProfileScreen } from "./components/screens/VendorProfileScreen";

type Screen =
  | "login"
  | "registration"
  | "dashboard"
  | "manual-transaction"
  | "voice-transaction"
  | "transaction-history"
  | "credit-score"
  | "loan-eligibility"
  | "reports"
  | "insights"
  | "admin"
  | "product-setup"
  | "quick-sale"
  | "profile";

const screenMeta: Record<Screen, { showNav: boolean }> = {
  login:               { showNav: false },
  registration:        { showNav: false },
  dashboard:           { showNav: true  },
  "manual-transaction":{ showNav: false },
  "voice-transaction": { showNav: false },
  "transaction-history":{ showNav: true  },
  "credit-score":      { showNav: true  },
  "loan-eligibility":  { showNav: false },
  reports:             { showNav: true  },
  insights:            { showNav: false },
  admin:               { showNav: false }, // Admins might not need the vendor bottom nav
  "product-setup":     { showNav: false },
  "quick-sale":        { showNav: false },
  profile:             { showNav: false },
};

function renderScreen(screen: Screen, navigate: (s: string) => void) {
  const props = { navigate };
  switch (screen) {
    case "login":                return <LoginScreen {...props} />;
    case "registration":         return <RegistrationScreen {...props} />;
    case "dashboard":            return <DashboardScreen {...props} />;
    case "manual-transaction":   return <ManualTransactionScreen {...props} />;
    case "voice-transaction":    return <VoiceTransactionScreen {...props} />;
    case "transaction-history":  return <TransactionHistoryScreen {...props} />;
    case "credit-score":         return <CreditScoreScreen {...props} />;
    case "loan-eligibility":     return <LoanEligibilityScreen {...props} />;
    case "reports":              return <ReportsScreen {...props} />;
    case "insights":             return <VendorInsightsScreen {...props} />;
    case "admin":                return <AdminDashboardScreen {...props} />;
    case "product-setup":        return <ProductSetupScreen {...props} />;
    case "quick-sale":           return <QuickSaleScreen {...props} />;
    case "profile":              return <VendorProfileScreen {...props} />;
    default:                     return <DashboardScreen {...props} />;
  }
}

export default function App() {
  const [current, setCurrent] = useState<Screen>("login");
  const meta = screenMeta[current];

  const navigate = (s: string) => {
    if (s in screenMeta) setCurrent(s as Screen);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    if (token) {
      if (role === "admin") {
        setCurrent("admin");
      } else {
        setCurrent("dashboard");
      }
    }
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background flex flex-col sm:max-w-md sm:mx-auto sm:border-x sm:border-border sm:shadow-2xl">
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {renderScreen(current, navigate)}
        </div>
        {meta?.showNav && (
          <BottomNav currentScreen={current} navigate={navigate} />
        )}
      </div>
    </LanguageProvider>
  );
}
