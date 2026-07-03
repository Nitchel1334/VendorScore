/* eslint-disable */
import { useEffect, useState } from "react";
import { ChevronDown, CheckCircle2, Store, MapPin, User, CreditCard, Smartphone } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";
import { registerVendor } from "../../lib/api";

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
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    phone: "",
    vendorName: "",
    businessName: "",
    category: "",
  });

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    const pendingPhone = localStorage.getItem("pendingRegistrationPhone");
    if (pendingPhone) update("phone", pendingPhone);
  }, []);

  const businessInfoComplete = Boolean(
    form.phone.length === 10 &&
    form.vendorName.trim() &&
    form.businessName.trim()
  );

  const handleRegister = async () => {
    setSubmitting(true);
    setErrorMsg("");

    try {
      const response = await registerVendor({
        phone: form.phone,
        vendor_name: form.vendorName.trim(),
        business_name: form.businessName.trim(),
        category: form.category || "Other",
      });

      if (!response.data) {
        setErrorMsg(response.error || "Registration failed");
        return;
      }

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userRole", "vendor");
      localStorage.removeItem("pendingRegistrationPhone");
      navigate("dashboard");
    } catch {
      setErrorMsg("Could not connect to the backend");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Create Account"
        subtitle="Register your business"
        onBack={() => navigate("login")}
      />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
            {/* Phone Number */}
            <div>
              <label className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                <Smartphone size={13} className="text-primary" />
                Mobile Number
              </label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98XXXXXXXX"
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl outline-none focus:border-primary transition-colors"
              />
            </div>

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
                Business Category (Optional)
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

            <button
              onClick={handleRegister}
              disabled={!businessInfoComplete || submitting}
              className={`w-full py-4 rounded-2xl mt-2 ${
                businessInfoComplete && !submitting
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}
              style={{ fontWeight: 700, fontSize: "1rem" }}
            >
              {submitting ? "Registering..." : "Submit & Register"}
            </button>

            {errorMsg && (
              <p className="text-red-600 text-center" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                {errorMsg}
              </p>
            )}
          </div>
      </div>
    </div>
  );
}
