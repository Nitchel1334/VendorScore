import { useState } from "react";
import { Search, Download, ArrowUpRight, ArrowDownLeft, ChevronDown, Filter } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";

interface Props {
  navigate: (screen: string) => void;
}

const allTxns = [
  { id: 1, type: "Sale", name: "Priya Sharma", amount: 1200, mode: "UPI", date: "2026-06-12", category: "Vegetables", note: "" },
  { id: 2, type: "Purchase", name: "Vegetable Supplier", amount: 450, mode: "Cash", date: "2026-06-12", category: "Stock", note: "Weekly stock" },
  { id: 3, type: "Sale", name: "Mohan Reddy", amount: 2800, mode: "Card", date: "2026-06-11", category: "Grocery", note: "" },
  { id: 4, type: "Sale", name: "Anita Krishnan", amount: 780, mode: "UPI", date: "2026-06-11", category: "FMCG", note: "" },
  { id: 5, type: "Expense", name: "Shop Rent", amount: 5000, mode: "Bank Transfer", date: "2026-06-10", category: "Rent", note: "Monthly rent" },
  { id: 6, type: "Sale", name: "Sunita Patel", amount: 340, mode: "Cash", date: "2026-06-10", category: "Vegetables", note: "" },
  { id: 7, type: "Purchase", name: "FMCG Distributor", amount: 8500, mode: "Cheque", date: "2026-06-09", category: "Stock", note: "Bulk order" },
  { id: 8, type: "Sale", name: "Ramesh Kumar", amount: 1500, mode: "UPI", date: "2026-06-09", category: "Grocery", note: "" },
  { id: 9, type: "Expense", name: "Electricity Bill", amount: 1200, mode: "UPI", date: "2026-06-08", category: "Electricity", note: "" },
  { id: 10, type: "Sale", name: "Kavya Nair", amount: 640, mode: "Cash", date: "2026-06-08", category: "FMCG", note: "" },
];

const filters = ["All", "Sale", "Purchase", "Expense"];
const dateFilters = ["All Time", "Today", "This Week", "This Month"];

export function TransactionHistoryScreen({ navigate }: Props) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("This Week");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const filtered = allTxns.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalIn = filtered.filter((t) => t.type === "Sale").reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter((t) => t.type !== "Sale").reduce((s, t) => s + t.amount, 0);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Transaction Ledger"
        subtitle={`${filtered.length} transactions`}
        onBack={() => navigate("dashboard")}
        rightAction="more"
      />

      <div className="px-4 py-3 bg-card border-b border-border flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl outline-none focus:border-primary"
            style={{ fontSize: "0.9rem" }}
          />
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 flex-1 overflow-x-auto pb-0.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`shrink-0 px-3 py-1 rounded-full transition-colors ${
                  typeFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative shrink-0">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground"
              style={{ fontSize: "0.75rem", fontWeight: 600 }}
            >
              <Filter size={12} />
              {dateFilter}
              <ChevronDown size={11} />
            </button>
            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden w-36">
                {dateFilters.map((df) => (
                  <button
                    key={df}
                    onClick={() => { setDateFilter(df); setShowDateDropdown(false); }}
                    className="w-full px-3 py-2.5 text-left hover:bg-secondary transition-colors"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {df}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex px-4 py-2 bg-card border-b border-border gap-3">
        <div className="flex-1 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.65rem", fontWeight: 600 }}>TOTAL IN</p>
          <p className="text-green-600" style={{ fontSize: "0.95rem", fontWeight: 800 }}>+₹{totalIn.toLocaleString()}</p>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.65rem", fontWeight: 600 }}>TOTAL OUT</p>
          <p className="text-red-500" style={{ fontSize: "0.95rem", fontWeight: 800 }}>-₹{totalOut.toLocaleString()}</p>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.65rem", fontWeight: 600 }}>NET</p>
          <p className={totalIn - totalOut >= 0 ? "text-green-600" : "text-red-500"} style={{ fontSize: "0.95rem", fontWeight: 800 }}>
            ₹{(totalIn - totalOut).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span style={{ fontSize: "2.5rem" }}>📭</span>
            <p className="text-muted-foreground" style={{ fontSize: "0.9rem" }}>No transactions found</p>
          </div>
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  t.type === "Sale" ? "bg-green-50" : t.type === "Purchase" ? "bg-blue-50" : "bg-red-50"
                }`}
              >
                {t.type === "Sale" ? (
                  <ArrowUpRight size={18} className="text-green-600" />
                ) : (
                  <ArrowDownLeft size={18} className={t.type === "Purchase" ? "text-blue-600" : "text-red-500"} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-foreground truncate" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    {t.name}
                  </p>
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded-full ${
                      t.type === "Sale" ? "bg-green-100 text-green-700" : t.type === "Purchase" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                    }`}
                    style={{ fontSize: "0.6rem", fontWeight: 700 }}
                  >
                    {t.type}
                  </span>
                </div>
                <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                  {t.category} · {t.mode} · {formatDate(t.date)}
                </p>
              </div>
              <span
                className={t.type === "Sale" ? "text-green-600 shrink-0" : "text-red-500 shrink-0"}
                style={{ fontSize: "0.9rem", fontWeight: 700 }}
              >
                {t.type === "Sale" ? "+" : "-"}₹{t.amount.toLocaleString()}
              </span>
            </div>
          ))
        )}

        {/* Export Button */}
        <button className="w-full py-3 rounded-2xl border border-border flex items-center justify-center gap-2 text-primary mt-2">
          <Download size={16} />
          <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Export Transactions</span>
        </button>

        {/* Annotation */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mt-2">
          <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
            📋 ANNOTATION: Export supports PDF and Excel. Search is client-side for offline use.
            Infinite scroll with pagination (50 records/page). Server-side date filtering.
          </p>
        </div>
      </div>
    </div>
  );
}
