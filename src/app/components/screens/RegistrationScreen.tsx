import { useState } from "react";
import { ChevronDown, CheckCircle2, Store, MapPin, User, CreditCard } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";

interface Props {
  navigate: (screen: string) => void;
}

const categories = [
  "Vegetables & Fruits",
  "Grocery & FMCG",
  "Electronics",
  "Clothing & Textiles",
  "Food & Beverages",
  "Hardware & Tools",
  "Pharmacy",
  "Stationery",
  "Other",
];

export function RegistrationScreen({ navigate }: Props) {
  const [step, setStep] = useState(1);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [form, setForm] = useState({
    vendorName: "",
    businessName: "",
    category: "",
    address: "",
    aadhaar: "",
    pan: "",
  });

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Create Account"
        subtitle="Register your business"
        onBack={() => navigate("login")}
      />

      {/* Progress Steps */}
      <div className="px-6 py-4 bg-primary/5 border-b border-border">
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  s < step ? "bg-green-500" : s === step ? "bg-primary" : "bg-muted"
                }`}
              >
                {s < step ? (
                  <CheckCircle2 size={14} className="text-white" />
                ) : (
                  <span className={`${s === step ? "text-white" : "text-muted-foreground"}`} style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    {s}
                  </span>
                )}
              </div>
              <span
                className={s === step ? "text-foreground" : "text-muted-foreground"}
                style={{ fontSize: "0.75rem", fontWeight: s === step ? 700 : 500 }}
              >
                {s === 1 ? "Business Info" : "Identity Proof"}
              </span>
              {s < 2 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {step === 1 ? (
          <div className="flex flex-col gap-4">
            {/* Vendor Name */}
            <div>
              <label className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                <User size={13} className="text-primary" />
                Vendor Name
              </label>
              <input
                value={form.vendorName}
                onChange={(e) => update("vendorName", e.target.value)}
                placeholder="e.g. Ravi Kumar"
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Business Name */}
            <div>
              <label className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                <Store size={13} className="text-primary" />
                Business Name
              </label>
              <input
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="e.g. Ravi Kirana Store"
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Business Category */}
            <div className="relative">
              <label className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                <Store size={13} className="text-primary" />
                Business Category
              </label>
              <button
                onClick={() => setShowCatDropdown(!showCatDropdown)}
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl flex items-center justify-between outline-none focus:border-primary"
              >
                <span className={form.category ? "text-foreground" : "text-muted-foreground"} style={{ fontSize: "1rem" }}>
                  {form.category || "Select category"}
                </span>
                <ChevronDown size={16} className="text-muted-foreground" />
              </button>
              {showCatDropdown && (
                <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto mt-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { update("category", cat); setShowCatDropdown(false); }}
                      className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                <MapPin size={13} className="text-primary" />
                Business Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Shop No. 14, Gandhi Bazaar, Bangalore - 560004"
                rows={3}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl outline-none focus:border-primary transition-colors resize-none"
                style={{ fontSize: "0.95rem" }}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 mt-2"
              style={{ fontWeight: 700, fontSize: "1rem" }}
            >
              Continue →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Identity documents are optional but improve your credit score eligibility significantly.
              </p>
            </div>

            {/* Aadhaar */}
            <div>
              <label className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                <CreditCard size={13} className="text-primary" />
                Aadhaar Number
                <span className="text-muted-foreground" style={{ fontWeight: 400, fontSize: "0.72rem" }}>(Optional)</span>
              </label>
              <input
                value={form.aadhaar}
                onChange={(e) => update("aadhaar", e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="XXXX XXXX XXXX"
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl outline-none focus:border-primary transition-colors"
                style={{ letterSpacing: "0.1em" }}
              />
            </div>

            {/* PAN */}
            <div>
              <label className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                <CreditCard size={13} className="text-primary" />
                PAN Number
                <span className="text-muted-foreground" style={{ fontWeight: 400, fontSize: "0.72rem" }}>(Optional)</span>
              </label>
              <input
                value={form.pan}
                onChange={(e) => update("pan", e.target.value.toUpperCase().slice(0, 10))}
                placeholder="ABCDE1234F"
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl outline-none focus:border-primary transition-colors"
                style={{ letterSpacing: "0.12em" }}
              />
            </div>

            {/* Document Scan */}
            <button className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/40 text-primary flex flex-col items-center gap-1">
              <CreditCard size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Scan Document (Optional)</span>
              <span className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>Use camera or upload image</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl border border-border text-foreground"
                style={{ fontWeight: 600 }}
              >
                ← Back
              </button>
              <button
                onClick={() => navigate("dashboard")}
                className="py-4 px-6 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                style={{ fontWeight: 700, flexGrow: 2 }}
              >
                Submit & Register
              </button>
            </div>

            {/* Annotation */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                📋 ANNOTATION: Aadhaar/PAN stored encrypted. DigiLocker integration optional.
                KYC via UIDAI API. All fields stored in Frappe doctype: Vendor Profile.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
