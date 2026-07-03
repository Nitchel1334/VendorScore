import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import { Zap, TrendingUp, TrendingDown, Package, Sun } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";

interface Props {
  navigate: (screen: string) => void;
}

const monthlySales = [
  { month: "Jan", sales: 58000, expenses: 9200 },
  { month: "Feb", sales: 61000, expenses: 8800 },
  { month: "Mar", sales: 68000, expenses: 10500 },
  { month: "Apr", sales: 72000, expenses: 11200 },
  { month: "May", sales: 78000, expenses: 12000 },
  { month: "Jun", sales: 85400, expenses: 12800 },
];

const weekdayData = [
  { day: "Mon", sales: 9800 },
  { day: "Tue", sales: 11200 },
  { day: "Wed", sales: 10600 },
  { day: "Thu", sales: 12400 },
  { day: "Fri", sales: 13800 },
  { day: "Sat", sales: 19600 },
  { day: "Sun", sales: 8000 },
];

const categoryBreakdown = [
  { name: "Vegetables", value: 34 },
  { name: "Grocery", value: 28 },
  { name: "FMCG", value: 22 },
  { name: "Others", value: 16 },
];

const aiRecommendations = [
  {
    icon: "📈",
    title: "Increase Stock on Fridays",
    body: "Saturday sales are 40% above average. Stocking up by Friday evening could prevent stockouts.",
    type: "opportunity",
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-700",
    badge: "Opportunity",
  },
  {
    icon: "💡",
    title: "Switch to Digital Payments",
    body: "Vendors with 70%+ digital transactions score 80+ on credit. You're at 58%. Add UPI QR to boost score.",
    type: "tip",
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    badge: "Score Tip",
  },
  {
    icon: "⚠️",
    title: "Expense Spike Detected",
    body: "Your June expenses are 6.7% higher than May. Review if this is seasonal or a recurring cost.",
    type: "alert",
    color: "bg-yellow-50 border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-700",
    badge: "Alert",
  },
  {
    icon: "🎯",
    title: "Top Performing Category",
    body: "Vegetables contribute 34% of revenue. Consider expanding variety or adding value-added products.",
    type: "insight",
    color: "bg-purple-50 border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
    badge: "Insight",
  },
];

export function VendorInsightsScreen({ navigate }: Props) {
  const growthPct = (((85400 - 78000) / 78000) * 100).toFixed(1);

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Vendor Insights"
        subtitle="AI-powered analytics"
        onBack={() => navigate("dashboard")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Growth Summary Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-3 text-center">
            <TrendingUp size={16} className="text-green-600 mx-auto mb-1" />
            <p className="text-green-700" style={{ fontSize: "1rem", fontWeight: 800 }}>+{growthPct}%</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.65rem" }}>MoM Sales</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
            <Package size={16} className="text-blue-600 mx-auto mb-1" />
            <p className="text-blue-700" style={{ fontSize: "1rem", fontWeight: 800 }}>340</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.65rem" }}>Transactions</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 text-center">
            <Sun size={16} className="text-purple-600 mx-auto mb-1" />
            <p className="text-purple-700" style={{ fontSize: "1rem", fontWeight: 800 }}>Sat</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.65rem" }}>Peak Day</p>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Monthly Sales vs Expenses</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={monthlySales} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }}
                formatter={(v: number) => `₹${v.toLocaleString()}`}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="sales" fill="#2563EB" radius={[3, 3, 0, 0]} name="Sales" />
              <Bar dataKey="expenses" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Growth Trend */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p style={{ fontSize: "0.8rem", fontWeight: 700 }}>Sales Growth Trend</p>
            <span className="flex items-center gap-1 text-green-600" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
              <TrendingUp size={11} />
              +47% in 6 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={monthlySales}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }}
                formatter={(v: number) => `₹${v.toLocaleString()}`}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#salesGrad)"
                dot={{ fill: "#2563EB", r: 2.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Day Analysis */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Sales by Day of Week</p>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={weekdayData} barSize={16}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v: number) => `₹${v.toLocaleString()}`}
              />
              <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                {weekdayData.map((entry, i) => (
                  <Cell key={i} fill={entry.day === "Sat" ? "#2563EB" : "#C7D2FE"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-muted-foreground mt-1" style={{ fontSize: "0.7rem" }}>
            Saturday is your best day — 40% above weekly average
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Revenue by Category</p>
          <div className="flex flex-col gap-2">
            {categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-muted-foreground" style={{ fontSize: "0.8rem", minWidth: 70 }}>{c.name}</span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${c.value}%`, opacity: 0.7 + (c.value / 100) * 0.3 }}
                  />
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, minWidth: 30 }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={15} className="text-primary" />
            <p style={{ fontSize: "0.8rem", fontWeight: 700 }}>AI Recommendations</p>
          </div>
          <div className="flex flex-col gap-3">
            {aiRecommendations.map((r, i) => (
              <div key={i} className={`${r.color} border rounded-2xl p-3.5`}>
                <div className="flex items-start gap-3">
                  <span style={{ fontSize: "1.2rem" }}>{r.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>{r.title}</p>
                      <span className={`px-2 py-0.5 rounded-full ${r.badgeColor}`} style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: "0.75rem", lineHeight: 1.4 }}>{r.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Annotation */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
            📋 ANNOTATION: AI insights generated by LLM (GPT-4o/Llama) weekly using aggregated
            transaction data. No PII sent to external models. Insights stored in Frappe:
            Vendor AI Insights doctype. Cached for 7 days.
          </p>
        </div>
      </div>
    </div>
  );
}
