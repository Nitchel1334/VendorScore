import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Calendar, ChevronDown } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";

interface Props {
  navigate: (screen: string) => void;
}

const paymentModes = ["Cash", "UPI", "Card", "Bank Transfer", "Credit/Khata", "Cheque"];
const categories = {
  Sale: ["Vegetables", "Fruits", "Grocery", "FMCG", "Other"],
  Purchase: ["Raw Material", "Inventory", "Stock Replenishment", "Other"],
  Expense: ["Rent", "Electricity", "Labour", "Transport", "Maintenance", "Other"],
};

export function ManualTransactionScreen({ navigate }: Props) {
  const [txnType, setTxnType] = useState<"Sale" | "Purchase" | "Expense">("Sale");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [payMode, setPayMode] = useState("");
  const [customer, setCustomer] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [showPayDropdown, setShowPayDropdown] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      navigate("dashboard");
    }, 1500);
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-background px-6 gap-4">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <span style={{ fontSize: "2.5rem" }}>✅</span>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: "1.3rem" }}>Transaction Saved!</h2>
        <p className="text-muted-foreground text-center" style={{ fontSize: "0.85rem" }}>
          {txnType} of ₹{amount} recorded successfully. Credit score updated.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Add Transaction"
        subtitle="Record a new transaction"
        onBack={() => navigate("dashboard")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Transaction Type Toggle */}
        <div>
          <label style={{ fontSize: "0.8rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
            Transaction Type
          </label>
          <div className="flex bg-muted rounded-2xl p-1">
            {(["Sale", "Purchase", "Expense"] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setTxnType(type); setCategory(""); }}
                className={`flex-1 py-2.5 rounded-xl transition-all ${
                  txnType === type
                    ? type === "Sale"
                      ? "bg-green-500 text-white shadow-sm"
                      : type === "Purchase"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-red-500 text-white shadow-sm"
                    : "text-muted-foreground"
                }`}
                style={{ fontSize: "0.85rem", fontWeight: 700 }}
              >
                {type === "Sale" ? "💰 " : type === "Purchase" ? "🛒 " : "💸 "}
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Amount - Large and prominent */}
        <div>
          <label style={{ fontSize: "0.8rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
            Amount
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              style={{ fontSize: "1.4rem", fontWeight: 700 }}
            >
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-10 pr-4 py-4 bg-card border-2 border-border rounded-2xl outline-none focus:border-primary transition-colors text-right"
              style={{ fontSize: "2rem", fontWeight: 800 }}
            />
          </div>
          {amount && (
            <p className="text-muted-foreground mt-1 text-right" style={{ fontSize: "0.72rem" }}>
              {txnType === "Sale" ? (
                <span className="flex items-center gap-1 justify-end text-green-600">
                  <ArrowUpRight size={12} /> Income
                </span>
              ) : (
                <span className="flex items-center gap-1 justify-end text-red-500">
                  <ArrowDownLeft size={12} /> Outgoing
                </span>
              )}
            </p>
          )}
        </div>

        {/* Date + Payment Mode */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
              Date
            </label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-8 pr-2 py-3 bg-card border border-border rounded-xl outline-none focus:border-primary"
                style={{ fontSize: "0.8rem" }}
              />
            </div>
          </div>
          <div className="relative">
            <label style={{ fontSize: "0.8rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
              Payment Mode
            </label>
            <button
              onClick={() => setShowPayDropdown(!showPayDropdown)}
              className="w-full px-3 py-3 bg-card border border-border rounded-xl flex items-center justify-between"
            >
              <span className={payMode ? "text-foreground" : "text-muted-foreground"} style={{ fontSize: "0.85rem" }}>
                {payMode || "Select"}
              </span>
              <ChevronDown size={14} />
            </button>
            {showPayDropdown && (
              <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-xl shadow-lg z-10 mt-1 overflow-hidden">
                {paymentModes.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setPayMode(m); setShowPayDropdown(false); }}
                    className="w-full px-3 py-2.5 text-left hover:bg-secondary transition-colors"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {m === "Cash" ? "💵" : m === "UPI" ? "📱" : m === "Card" ? "💳" : m === "Bank Transfer" ? "🏦" : "📒"} {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="relative">
          <label style={{ fontSize: "0.8rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
            Category
          </label>
          <button
            onClick={() => setShowCatDropdown(!showCatDropdown)}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl flex items-center justify-between"
          >
            <span className={category ? "text-foreground" : "text-muted-foreground"} style={{ fontSize: "0.9rem" }}>
              {category || "Select category"}
            </span>
            <ChevronDown size={14} />
          </button>
          {showCatDropdown && (
            <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-xl shadow-lg z-10 mt-1 overflow-hidden">
              {(categories[txnType] || []).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCategory(c); setShowCatDropdown(false); }}
                  className="w-full px-4 py-2.5 text-left hover:bg-secondary transition-colors"
                  style={{ fontSize: "0.9rem" }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Customer / Supplier Name */}
        <div>
          <label style={{ fontSize: "0.8rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
            {txnType === "Sale" ? "Customer Name" : "Supplier / Party Name"}
            <span className="text-muted-foreground" style={{ fontWeight: 400, fontSize: "0.72rem", marginLeft: "0.3rem" }}>(Optional)</span>
          </label>
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder={txnType === "Sale" ? "e.g. Priya Sharma" : "e.g. ABC Distributors"}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Notes */}
        <div>
          <label style={{ fontSize: "0.8rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
            Notes
            <span className="text-muted-foreground" style={{ fontWeight: 400, fontSize: "0.72rem", marginLeft: "0.3rem" }}>(Optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
            rows={2}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!amount || !payMode}
          className={`w-full py-4 rounded-2xl transition-all ${
            amount && payMode
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-muted text-muted-foreground"
          }`}
          style={{ fontWeight: 700, fontSize: "1rem" }}
        >
          Save Transaction
        </button>

        {/* Annotation */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
            📋 ANNOTATION: Saves to Frappe doctype: Transaction Entry. Triggers credit score
            recalculation via background job. Supports bulk entry and CSV import.
          </p>
        </div>
      </div>
    </div>
  );
}
