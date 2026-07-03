/* eslint-disable */
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Mic, PlusCircle, BarChart2, Star, ChevronRight, ArrowUpRight, ArrowDownLeft, Zap, ShoppingCart, Package, User } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getCurrentVendor, VendorProfile, getTransactions, getInsights } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import { commonTranslations } from "../../lib/translations";

interface Props {
  navigate: (screen: string) => void;
}

export function DashboardScreen({ navigate }: Props) {
  const { language } = useLanguage();
  const t = commonTranslations[language];

  const quickActions = [
    { id: "voice-transaction", label: "Voice Entry", icon: Mic, color: "bg-red-500", fg: "text-white" },
    { id: "manual-transaction", label: t.addTransaction, icon: PlusCircle, color: "bg-primary", fg: "text-primary-foreground" },
    { id: "product-setup", label: "Products", icon: Package, color: "bg-pink-500", fg: "text-white" },
    { id: "quick-sale", label: "Quick Sale", icon: Zap, color: "bg-amber-500", fg: "text-white" },
  ];

  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [statsData, setStatsData] = useState({
    todaysSales: 0,
    monthlySales: 0,
    monthlyPurchases: 0,
    expenses: 0,
    netCashFlow: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("login");
      return;
    }

    getCurrentVendor(token).then((response) => {
      if (response.status === 401) {
        // Token is truly invalid/expired — clear and send to login
        localStorage.removeItem("authToken");
        navigate("login");
        return;
      }
      if (response.data) setVendor(response.data);
    });

    getTransactions(token).then((response) => {
      if (response.data) {
        const txList = response.data as any[];
        setTransactions(txList);

        // Calculate stats using date strings (YYYY-MM-DD)
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthStartStr = monthStart.toISOString().split("T")[0];

        let tSales = 0;
        let mSales = 0;
        let mExpenses = 0;
        let mPurchases = 0;

        txList.forEach((tx: any) => {
          const txDate = tx.transaction_date || "";
          const amount = Number(tx.amount) || 0;
          if (tx.type === "Sale") {
            if (txDate === todayStr) tSales += amount;
            if (txDate >= monthStartStr) mSales += amount;
          } else if (tx.type === "Expense") {
            if (txDate >= monthStartStr) mExpenses += amount;
          } else if (tx.type === "Purchase") {
            if (txDate >= monthStartStr) mPurchases += amount;
          }
        });

        setStatsData({
          todaysSales: tSales,
          monthlySales: mSales,
          monthlyPurchases: mPurchases,
          expenses: mExpenses,
          netCashFlow: mSales - mPurchases - mExpenses,
        });
      }
    });

    getInsights(token).then((response) => {
      if (response.data) setInsights(response.data as any[]);
    });
  }, []);

  const stats = [
    { label: t.todaysSales, value: `₹${statsData.todaysSales.toLocaleString()}`, change: "--", up: true, color: "bg-green-50 border-green-100", valueColor: "text-green-700", fullWidth: false },
    { label: t.monthlySales, value: `₹${statsData.monthlySales.toLocaleString()}`, change: "--", up: true, color: "bg-blue-50 border-blue-100", valueColor: "text-blue-700", fullWidth: false },
    { label: t.monthlyPurchases, value: `₹${(statsData.monthlyPurchases || 0).toLocaleString()}`, change: "--", up: false, color: "bg-orange-50 border-orange-100", valueColor: "text-orange-700", fullWidth: false },
    { label: t.expenses, value: `₹${statsData.expenses.toLocaleString()}`, change: "--", up: false, color: "bg-red-50 border-red-100", valueColor: "text-red-700", fullWidth: false },
    { label: t.netCashFlow, value: `₹${statsData.netCashFlow.toLocaleString()}`, change: "--", up: statsData.netCashFlow >= 0, color: "bg-purple-50 border-purple-100", valueColor: "text-purple-700", fullWidth: true },
  ];

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="bg-primary px-5 pt-3 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/70" style={{ fontSize: "0.8rem" }}>
              Good morning 👋
            </p>
            <h2 className="text-primary-foreground" style={{ fontWeight: 800, fontSize: "1.2rem" }}>
              {vendor?.vendor_name || "Vendor"}
            </h2>
            <p className="text-primary-foreground/60" style={{ fontSize: "0.72rem" }}>
              {vendor ? `${vendor.business_name} · ${vendor.address}` : "Loading your business profile..."}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center relative"
              onClick={() => navigate("profile")}
            >
              <User size={18} className="text-primary-foreground" />
            </button>
            <button
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center relative"
              onClick={() => {}}
            >
              <span className="text-primary-foreground">🔔</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        </div>

        {/* Credit Score + Loan badge */}
        <div
          className="bg-white/15 rounded-2xl p-3 flex items-center justify-between cursor-pointer"
          onClick={() => navigate("credit-score")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Star size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-primary-foreground/70" style={{ fontSize: "0.7rem" }}>{t.creditScore}</p>
              <p className="text-primary-foreground" style={{ fontSize: "1.2rem", fontWeight: 800 }}>—</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-primary-foreground/70" style={{ fontSize: "0.7rem" }}>{t.loanEligibility}</p>
              <p className="text-green-300" style={{ fontSize: "0.9rem", fontWeight: 700 }}>{t.eligible}</p>
            </div>
            <ChevronRight size={16} className="text-primary-foreground/60" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className={`${s.color} border rounded-2xl p-3 ${s.fullWidth ? 'col-span-2' : ''}`}>
              <p className="text-muted-foreground" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                {s.label}
              </p>
              <p className={`${s.valueColor} mt-1`} style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {s.value}
              </p>
              {s.label === t.netCashFlow && (
                <p className="text-muted-foreground mt-0.5 leading-tight" style={{ fontSize: "0.55rem", fontStyle: "italic" }}>
                  *Simplified cash-based estimate (Sales - Purchases - Expenses).
                </p>
              )}
              <div className="flex items-center gap-1 mt-0.5">
                {s.up ? (
                  <TrendingUp size={11} className="text-green-600" />
                ) : (
                  <TrendingDown size={11} className="text-red-500" />
                )}
                <span className={s.up ? "text-green-600" : "text-red-500"} style={{ fontSize: "0.68rem", fontWeight: 700 }}>
                  {s.change} {t.thisMonth}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>{t.quickActions}</p>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => navigate(a.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-2xl ${a.color} flex items-center justify-center shadow-md`}>
                    <Icon size={20} className={a.fg} />
                  </div>
                  <span className="text-muted-foreground text-center leading-tight" style={{ fontSize: "0.65rem", fontWeight: 600 }}>
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Chart - Recent Sales */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Weekly Sales Trend</p>
          <div className="h-40 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactions
                  .filter(t => t.type === "Sale")
                  .reduce((acc: any[], t: any) => {
                    const date = t.transaction_date;
                    const existing = acc.find(a => a.date === date);
                    if (existing) existing.amount += t.amount;
                    else acc.push({ date, amount: t.amount });
                    return acc;
                  }, [])
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(-7)
              }>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 10}} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {weekday: 'short'})} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  formatter={(value) => [`₹${Number(value ?? 0)}`, 'Sales']}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Strip */}
        {insights.length > 0 && (
          <div
            className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-3 flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("insights")}
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-indigo-800 dark:text-indigo-300" style={{ fontSize: "0.75rem", fontWeight: 700 }}>{insights[0].title}</p>
              <p className="text-indigo-600 dark:text-indigo-400 truncate" style={{ fontSize: "0.7rem" }}>
                {insights[0].body}
              </p>
            </div>
            <ChevronRight size={14} className="text-indigo-400 shrink-0" />
          </div>
        )}

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: "0.8rem", fontWeight: 700 }}>{t.recentTransactions}</p>
            <button onClick={() => navigate("transaction-history")} className="text-primary" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {t.viewAll} →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {transactions.slice(0, 5).map((tx, i) => {
              const up = tx.type === "Sale";
              const name = tx.customer_name || tx.category || tx.type;
              return (
                <div key={i} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${up ? "bg-green-50" : "bg-red-50"}`}>
                    {up ? (
                      <ArrowUpRight size={16} className="text-green-600" />
                    ) : (
                      <ArrowDownLeft size={16} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      {name}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                      {tx.payment_mode} · {tx.transaction_date}
                    </p>
                  </div>
                  <span
                    className={up ? "text-green-600" : "text-red-500"}
                    style={{ fontSize: "0.9rem", fontWeight: 700 }}
                  >
                    {up ? "+" : "-"}₹{tx.amount}
                  </span>
                </div>
              );
            })}
            {transactions.length === 0 && (
              <p className="text-muted-foreground text-center py-4" style={{ fontSize: "0.85rem" }}>
                No recent transactions.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
