import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Users, TrendingUp, Star, CheckCircle2, Search, ChevronRight, ShieldCheck } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";

interface Props {
  navigate: (screen: string) => void;
}

const statsCards = [
  { label: "Total Vendors", value: "1,248", change: "+34 this week", icon: Users, color: "bg-blue-50 border-blue-100", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { label: "Active Vendors", value: "987", change: "79% active rate", icon: CheckCircle2, color: "bg-green-50 border-green-100", iconBg: "bg-green-100", iconColor: "text-green-600" },
  { label: "Avg Credit Score", value: "674", change: "+12 vs last month", icon: Star, color: "bg-purple-50 border-purple-100", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  { label: "Loan Eligible", value: "456", change: "36.5% of vendors", icon: TrendingUp, color: "bg-amber-50 border-amber-100", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
];

const scoreDistribution = [
  { range: "300–499", count: 89, color: "#DC2626" },
  { range: "500–649", count: 234, color: "#F59E0B" },
  { range: "650–749", count: 567, color: "#2563EB" },
  { range: "750–900", count: 358, color: "#16A34A" },
];

const categoryData = [
  { name: "Grocery", vendors: 342, color: "#2563EB" },
  { name: "Vegetables", vendors: 289, color: "#16A34A" },
  { name: "FMCG", vendors: 198, color: "#F59E0B" },
  { name: "Clothing", vendors: 145, color: "#9333EA" },
  { name: "Others", vendors: 274, color: "#64748B" },
];

const recentVendors = [
  { name: "Ravi Kumar", business: "Ravi Kirana", score: 742, eligible: true, status: "Active" },
  { name: "Sunita Patel", business: "Sunita Vegetables", score: 681, eligible: true, status: "Active" },
  { name: "Mohammed Ali", business: "Ali Electronics", score: 534, eligible: false, status: "Active" },
  { name: "Kavya Nair", business: "Kavya Silk Store", score: 758, eligible: true, status: "Active" },
  { name: "Ramesh Yadav", business: "Ramesh Pharmacy", score: 612, eligible: false, status: "Inactive" },
];

const PIE_COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#9333EA", "#64748B"];

export function AdminDashboardScreen({ navigate }: Props) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "vendors">("overview");

  const filtered = recentVendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.business.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Admin Header */}
      <div className="bg-slate-800 px-4 pt-3 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-slate-300" />
            <span className="text-slate-300" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
              ADMIN PANEL
            </span>
          </div>
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full" style={{ fontSize: "0.65rem", fontWeight: 700 }}>
            ● Live
          </span>
        </div>
        <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
          VendorScore Admin
        </h2>
        <p className="text-slate-400" style={{ fontSize: "0.72rem" }}>
          June 13, 2026 · Loan Officer View
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-card border-b border-border px-4 pt-2">
        {(["overview", "vendors"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
            style={{ fontSize: "0.85rem", fontWeight: 700 }}
          >
            {tab === "overview" ? "📊 Overview" : "👥 Vendors"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {activeTab === "overview" ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2">
              {statsCards.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className={`${s.color} border rounded-2xl p-3`}>
                    <div className={`w-8 h-8 ${s.iconBg} rounded-xl flex items-center justify-center mb-2`}>
                      <Icon size={16} className={s.iconColor} />
                    </div>
                    <p className="text-foreground" style={{ fontSize: "1.2rem", fontWeight: 800 }}>{s.value}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.65rem", fontWeight: 600 }}>{s.label}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.62rem", marginTop: "0.2rem" }}>{s.change}</p>
                  </div>
                );
              })}
            </div>

            {/* Credit Score Distribution */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Credit Score Distribution</p>
              <ResponsiveContainer width="100%" height={110}>
                <BarChart data={scoreDistribution} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="range" tick={{ fontSize: 9, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Vendors">
                    {scoreDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Pie */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Vendors by Category</p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={100}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={40} dataKey="vendors" strokeWidth={0}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5">
                  {categoryData.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{c.name}</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, marginLeft: "auto" }}>{c.vendors}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alert Summary */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-3">
              <p className="text-red-700" style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>⚠️ Requires Attention</p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-red-600" style={{ fontSize: "0.75rem" }}>Vendors with score &lt; 500</span>
                  <span className="text-red-700" style={{ fontSize: "0.8rem", fontWeight: 700 }}>89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-600" style={{ fontSize: "0.75rem" }}>Inactive &gt; 30 days</span>
                  <span className="text-red-700" style={{ fontSize: "0.8rem", fontWeight: 700 }}>261</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-600" style={{ fontSize: "0.75rem" }}>KYC incomplete</span>
                  <span className="text-red-700" style={{ fontSize: "0.8rem", fontWeight: 700 }}>432</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors..."
                className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl outline-none focus:border-primary"
                style={{ fontSize: "0.9rem" }}
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-2">
              {["All", "Eligible", "High Score", "Inactive"].map((f) => (
                <button
                  key={f}
                  className="px-3 py-1 rounded-full bg-muted text-muted-foreground"
                  style={{ fontSize: "0.72rem", fontWeight: 600 }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Vendor List */}
            <div className="flex flex-col gap-2">
              {filtered.map((v) => (
                <div key={v.name} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <span style={{ fontSize: "1.1rem" }}>
                      {v.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "0.85rem", fontWeight: 600 }} className="truncate">{v.name}</p>
                    <p className="text-muted-foreground truncate" style={{ fontSize: "0.7rem" }}>{v.business}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={v.eligible ? "text-green-600" : "text-muted-foreground"}
                        style={{ fontSize: "0.65rem", fontWeight: 600 }}
                      >
                        {v.eligible ? "✓ Loan Eligible" : "○ Not Eligible"}
                      </span>
                      <span
                        className={v.status === "Active" ? "text-green-600" : "text-red-500"}
                        style={{ fontSize: "0.65rem" }}
                      >
                        · {v.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 800,
                        color: v.score >= 750 ? "#16A34A" : v.score >= 650 ? "#2563EB" : v.score >= 500 ? "#F59E0B" : "#DC2626",
                      }}
                    >
                      {v.score}
                    </span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Annotation */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
            📋 ANNOTATION: Admin panel for Loan Officers and NGO representatives.
            Role-based access via Frappe permissions. Bulk actions: send reminder, export, approve KYC.
            Frappe doctype: Admin Vendor Analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
