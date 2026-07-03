/* eslint-disable */
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Users, TrendingUp, Star, CheckCircle2, Search, ShieldCheck, LogOut, FileText } from "lucide-react";
import { getAdminVendors, getAdminStats } from "../../lib/api";
import { AdminVendorDetail } from "./AdminVendorDetail";

interface Props {
  navigate: (screen: string) => void;
}

interface VendorData {
  id: number;
  name: string;
  business: string;
  phone: string;
  category: string;
  score: number;
  eligible: boolean;
  status: string;
}

const PIE_COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#9333EA", "#64748B", "#ef4444", "#06b6d4"];

export function AdminDashboardScreen({ navigate }: Props) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "vendors">("overview");
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("login");
      try {
        const [vendorsResp, statsResp] = await Promise.all([
          getAdminVendors(token),
          getAdminStats(token)
        ]);
        if (vendorsResp.data) setVendors(vendorsResp.data as any);
        if (statsResp.data) setStats(statsResp.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  if (selectedVendorId !== null) {
    return (
      <div className="flex flex-col min-h-full bg-background">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <AdminVendorDetail 
            vendorId={selectedVendorId} 
            onBack={() => setSelectedVendorId(null)} 
          />
        </div>
      </div>
    );
  }

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.business.toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic calculations
  let scoreDistribution = [
    { range: "300–499", count: 0, color: "#DC2626" },
    { range: "500–649", count: 0, color: "#F59E0B" },
    { range: "650–749", count: 0, color: "#2563EB" },
    { range: "750–900", count: 0, color: "#16A34A" },
  ];
  
  let categoryMap: Record<string, number> = {};
  
  vendors.forEach(v => {
    // Score
    if (v.score < 500) scoreDistribution[0].count++;
    else if (v.score < 650) scoreDistribution[1].count++;
    else if (v.score < 750) scoreDistribution[2].count++;
    else scoreDistribution[3].count++;
    
    // Category
    const cat = v.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categoryData = Object.keys(categoryMap).map(k => ({
    name: k,
    vendors: categoryMap[k]
  })).sort((a, b) => b.vendors - a.vendors);

  const statsCards = stats ? [
    { label: "Total Vendors", value: stats.total_vendors, icon: Users, color: "bg-blue-50 border-blue-100", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Active Vendors", value: stats.active_vendors, icon: CheckCircle2, color: "bg-green-50 border-green-100", iconBg: "bg-green-100", iconColor: "text-green-600" },
    { label: "Avg Credit Score", value: stats.average_credit_score, icon: Star, color: "bg-purple-50 border-purple-100", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
    { label: "Loan Eligible", value: stats.total_loan_eligible, icon: TrendingUp, color: "bg-amber-50 border-amber-100", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "Total Transactions", value: stats.total_transactions, icon: FileText, color: "bg-indigo-50 border-indigo-100", iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
    { label: "Total Revenue", value: `₹${stats.total_platform_revenue}`, icon: TrendingUp, color: "bg-emerald-50 border-emerald-100", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  ] : [];

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
          <button
            className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full flex items-center gap-1"
            style={{ fontSize: "0.65rem", fontWeight: 700 }}
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userRole");
              navigate("login");
            }}
          >
            <LogOut size={10} /> Logout
          </button>
        </div>
        <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
          VendorScore Admin
        </h2>
        <p className="text-slate-400" style={{ fontSize: "0.72rem" }}>
          Live Database View
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
        {loading ? (
          <div className="text-center py-6 text-muted-foreground text-sm font-medium">
            Loading live data...
          </div>
        ) : activeTab === "overview" ? (
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
              {categoryData.length > 0 ? (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={100}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={40} dataKey="vendors" strokeWidth={0}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-1.5">
                    {categoryData.slice(0,5).map((c, i) => (
                      <div key={c.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{c.name}</span>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, marginLeft: "auto" }}>{c.vendors}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No vendors yet.</p>
              )}
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

            {filtered.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm font-medium">
                No vendors found.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((v, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedVendorId(v.id)}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${v.score > 600 ? "bg-green-500" : v.score > 450 ? "bg-amber-500" : "bg-red-500"}`}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>{v.score}</span>
                      </div>
                      <div>
                        <p className="text-foreground" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                          {v.name}
                        </p>
                        <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                          {v.business} • {v.phone} • {v.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded ${v.eligible ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`} style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                        {v.eligible ? "Eligible" : "Needs Review"}
                      </span>
                      <span className={v.status === "active" ? "text-green-600 text-[10px]" : "text-red-500 text-[10px]"}>
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
