import { useState } from "react";
import { StatusBar } from "./components/shared/StatusBar";
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
  | "admin";

const screenMeta: Record<Screen, { label: string; emoji: string; showNav: boolean; showStatus: boolean }> = {
  login:               { label: "Login",        emoji: "🔐", showNav: false, showStatus: false },
  registration:        { label: "Register",     emoji: "📝", showNav: false, showStatus: true },
  dashboard:           { label: "Dashboard",    emoji: "🏠", showNav: true,  showStatus: true },
  "manual-transaction":{ label: "Add Txn",      emoji: "✏️", showNav: false, showStatus: true },
  "voice-transaction": { label: "Voice Entry",  emoji: "🎙️", showNav: false, showStatus: true },
  "transaction-history":{ label: "Ledger",      emoji: "📋", showNav: true,  showStatus: true },
  "credit-score":      { label: "Credit Score", emoji: "⭐", showNav: true,  showStatus: true },
  "loan-eligibility":  { label: "Loan",         emoji: "💰", showNav: false, showStatus: true },
  reports:             { label: "Reports",      emoji: "📊", showNav: true,  showStatus: true },
  insights:            { label: "Insights",     emoji: "💡", showNav: false, showStatus: true },
  admin:               { label: "Admin",        emoji: "🛡️", showNav: false, showStatus: true },
};

const screenGroups = [
  { title: "Onboarding", screens: ["login", "registration"] },
  { title: "Main", screens: ["dashboard", "transaction-history", "reports", "credit-score"] },
  { title: "Transactions", screens: ["manual-transaction", "voice-transaction"] },
  { title: "Finance", screens: ["loan-eligibility", "insights"] },
  { title: "Admin", screens: ["admin"] },
] as const;

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
    default:                     return <DashboardScreen {...props} />;
  }
}

export default function App() {
  const [current, setCurrent] = useState<Screen>("login");
  const meta = screenMeta[current];

  const navigate = (s: string) => {
    if (s in screenMeta) setCurrent(s as Screen);
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      {/* ── Desktop Wireframe Viewer Header ─────────────── */}
      <div className="hidden sm:block bg-slate-900 text-white px-6 py-3 shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white" style={{ fontSize: "0.9rem" }}>
              🛡️
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: "0.9rem" }}>VendorScore Wireframes</p>
              <p className="text-slate-400" style={{ fontSize: "0.65rem" }}>
                AI-powered Vendor Transaction Management & Credit Assessment · 11 Screens
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-slate-400" style={{ fontSize: "0.72rem" }}>Interactive Wireframe</span>
          </div>
        </div>
      </div>

      {/* ── Screen Selector Tabs ─────────────────────────── */}
      <div className="hidden sm:block bg-slate-800 px-6 py-2 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          {screenGroups.map((group) => (
            <div key={group.title} className="flex items-center gap-1.5">
              <span className="text-slate-500 shrink-0" style={{ fontSize: "0.65rem", fontWeight: 700 }}>
                {group.title}:
              </span>
              {group.screens.map((s) => {
                const m = screenMeta[s as Screen];
                const isActive = current === s;
                return (
                  <button
                    key={s}
                    onClick={() => navigate(s)}
                    className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                    style={{ fontSize: "0.72rem", fontWeight: isActive ? 700 : 500 }}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
              <div className="w-px h-5 bg-slate-600 mx-1" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content Area ────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center sm:py-6 sm:px-4">
        <div className="flex gap-6 items-start max-w-7xl w-full justify-center">
          {/* Phone Frame */}
          <div
            className="relative shrink-0"
            style={{
              width: "100%",
              maxWidth: 393,
            }}
          >
            {/* Device Bezel (desktop only) */}
            <div className="hidden sm:block absolute -inset-3 bg-slate-800 rounded-[3rem] shadow-2xl" />
            <div className="hidden sm:block absolute -inset-2 bg-slate-700 rounded-[2.8rem]" />

            {/* Screen Container */}
            <div
              className="relative bg-card overflow-hidden sm:rounded-[2.4rem] flex flex-col"
              style={{
                height: "100vh",
                maxHeight: 852,
              }}
            >
              {/* Dynamic Island (desktop only) */}
              <div className="hidden sm:flex justify-center pt-3 pb-1 bg-card shrink-0">
                <div className="w-24 h-6 bg-slate-900 rounded-full" />
              </div>

              {/* Status Bar */}
              {meta.showStatus && <StatusBar />}
              {!meta.showStatus && (
                <div className="bg-background h-0" />
              )}

              {/* Screen Content */}
              <div className="flex-1 overflow-y-auto">
                {renderScreen(current, navigate)}
              </div>

              {/* Bottom Nav */}
              {meta.showNav && (
                <BottomNav currentScreen={current} navigate={navigate} />
              )}

              {/* Home Indicator (desktop only) */}
              <div className="hidden sm:flex justify-center py-2 bg-card shrink-0">
                <div className="w-24 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>

          {/* Sidebar — Flow Map (desktop only) */}
          <div className="hidden lg:block w-64 shrink-0 mt-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-slate-800 mb-3" style={{ fontSize: "0.8rem", fontWeight: 800 }}>
                📐 User Flow
              </p>
              <div className="flex flex-col gap-1.5">
                {[
                  { from: "login", to: "registration", label: "New user" },
                  { from: "login", to: "dashboard", label: "Returning user" },
                  { from: "registration", to: "dashboard", label: "On submit" },
                  { from: "dashboard", to: "manual-transaction", label: "Add button" },
                  { from: "dashboard", to: "voice-transaction", label: "Mic button" },
                  { from: "dashboard", to: "transaction-history", label: "View All" },
                  { from: "dashboard", to: "credit-score", label: "Score card" },
                  { from: "credit-score", to: "loan-eligibility", label: "CTA button" },
                  { from: "dashboard", to: "reports", label: "Reports tab" },
                  { from: "dashboard", to: "insights", label: "AI insights" },
                ].map((flow) => (
                  <div key={`${flow.from}-${flow.to}`} className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(flow.from)}
                      className={`px-2 py-0.5 rounded ${current === flow.from ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      style={{ fontSize: "0.65rem", fontWeight: 700 }}
                    >
                      {screenMeta[flow.from as Screen]?.label}
                    </button>
                    <span className="text-slate-400" style={{ fontSize: "0.6rem" }}>→</span>
                    <button
                      onClick={() => navigate(flow.to)}
                      className={`px-2 py-0.5 rounded ${current === flow.to ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      style={{ fontSize: "0.65rem", fontWeight: 700 }}
                    >
                      {screenMeta[flow.to as Screen]?.label}
                    </button>
                    <span className="text-slate-400" style={{ fontSize: "0.58rem" }}>{flow.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-4">
              <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "#92400E", marginBottom: "0.5rem" }}>
                🔧 Tech Stack
              </p>
              <ul className="flex flex-col gap-1.5" style={{ fontSize: "0.7rem", color: "#78350F" }}>
                <li>• <strong>Backend:</strong> Frappe Framework</li>
                <li>• <strong>Voice ASR:</strong> IndicWhisper</li>
                <li>• <strong>Credit AI:</strong> Custom ML model</li>
                <li>• <strong>NLP:</strong> LLM (GPT-4o / Llama)</li>
                <li>• <strong>Languages:</strong> EN, हि, తె, த, ಕ, മ</li>
                <li>• <strong>Export:</strong> WeasyPrint + openpyxl</li>
                <li>• <strong>SMS/OTP:</strong> Twilio / MSG91</li>
                <li>• <strong>Mobile:</strong> React PWA / Capacitor</li>
              </ul>
            </div>

            {/* Component Legend */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mt-4 shadow-sm">
              <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
                🧩 Components
              </p>
              <ul className="flex flex-col gap-1" style={{ fontSize: "0.68rem", color: "#475569" }}>
                <li>• StatusBar — mock device status</li>
                <li>• BottomNav — 5-tab navigation</li>
                <li>• ScreenHeader — back + title</li>
                <li>• ScoreGauge — SVG arc gauge</li>
                <li>• RecordButton — animated mic</li>
                <li>• TransactionCard — list item</li>
                <li>• StatCard — metric display</li>
                <li>• ReportSelector — card chooser</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom screen selector */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900 px-3 py-2 z-50">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(Object.keys(screenMeta) as Screen[]).map((s) => {
            const m = screenMeta[s];
            return (
              <button
                key={s}
                onClick={() => navigate(s)}
                className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg ${
                  current === s ? "bg-primary text-white" : "bg-slate-700 text-slate-300"
                }`}
                style={{ fontSize: "0.65rem", fontWeight: 600 }}
              >
                {m.emoji}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
