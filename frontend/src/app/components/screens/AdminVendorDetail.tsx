/* eslint-disable */
import { useState, useEffect } from "react";
import { ArrowLeft, User, MapPin, Phone, Package, Activity, Star, Calendar, ShoppingBag } from "lucide-react";
import { getAdminVendorDetails } from "../../lib/api";

interface Props {
  vendorId: number;
  onBack: () => void;
}

export function AdminVendorDetail({ vendorId, onBack }: Props) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      try {
        const resp = await getAdminVendorDetails(token, vendorId);
        if (resp.data) setDetails(resp.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [vendorId]);

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading vendor details...</div>;
  }

  if (!details) {
    return <div className="p-6 text-center text-red-500">Failed to load vendor.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl shadow-sm">
        <button onClick={onBack} className="p-2 bg-muted rounded-full">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-foreground" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
            {details.profile.name}
          </h2>
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
            {details.profile.business} • {details.profile.category}
          </p>
        </div>
      </div>

      {/* Credit Score & Loan */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Star size={16} className="text-blue-600" />
            <span className="text-blue-900" style={{ fontWeight: 700, fontSize: "0.8rem" }}>Credit Score</span>
          </div>
          <p className="text-blue-700" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            {details.credit_score?.score || 0}
          </p>
          <p className="text-blue-600/80" style={{ fontSize: "0.7rem", marginTop: "4px" }}>
            Stability: {details.credit_score?.stability_score || 0}/100
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-green-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-green-600" />
            <span className="text-green-900" style={{ fontWeight: 700, fontSize: "0.8rem" }}>Loan Eligibility</span>
          </div>
          <p className="text-green-700" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            ₹{details.loan_eligibility?.max_eligible_amount || 0}
          </p>
          <p className="text-green-600/80" style={{ fontSize: "0.7rem", marginTop: "4px" }}>
            {details.loan_eligibility?.approval_probability || 0}% Approval
          </p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <h3 className="text-foreground mb-3" style={{ fontWeight: 700, fontSize: "0.9rem" }}>Contact Information</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: "0.8rem" }}>
            <Phone size={14} /> <span>{details.profile.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: "0.8rem" }}>
            <MapPin size={14} /> <span>{details.profile.address || "Not provided"}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: "0.8rem" }}>
            <Calendar size={14} /> <span>Joined {new Date(details.profile.joined).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      {details.insights && details.insights.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <h3 className="text-foreground mb-3" style={{ fontWeight: 700, fontSize: "0.9rem" }}>AI Insights</h3>
          <div className="flex flex-col gap-2">
            {details.insights.map((insight: any, idx: number) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-slate-800" style={{ fontSize: "0.8rem", fontWeight: 700 }}>{insight.title}</p>
                <p className="text-slate-500 mt-1" style={{ fontSize: "0.75rem" }}>{insight.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-6">
        <h3 className="text-foreground mb-3" style={{ fontWeight: 700, fontSize: "0.9rem" }}>Recent Transactions</h3>
        {details.transactions && details.transactions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {details.transactions.map((tx: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "Sale" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    <ShoppingBag size={14} />
                  </div>
                  <div>
                    <p className="text-foreground" style={{ fontSize: "0.8rem", fontWeight: 600 }}>{tx.type}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.65rem" }}>{new Date(tx.transaction_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={tx.type === "Sale" ? "text-green-600" : "text-red-600"} style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                  {tx.type === "Sale" ? "+" : "-"}₹{tx.amount}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4" style={{ fontSize: "0.8rem" }}>No recent transactions.</p>
        )}
      </div>

    </div>
  );
}
