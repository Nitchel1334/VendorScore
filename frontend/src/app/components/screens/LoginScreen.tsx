/* eslint-disable */
import { useState } from "react";
import { ChevronDown, Shield, Smartphone, Lock, User, ShieldCheck } from "lucide-react";
import { login, adminLogin } from "../../lib/api";
import { loginTranslations, LangKey } from "../../lib/translations";
import { useLanguage } from "../../context/LanguageContext";

interface Props {
  navigate: (screen: string) => void;
}

const languages: LangKey[] = ["EN", "हि", "తె", "த", "ಕ", "മ"];
const languageNames: Record<LangKey, string> = {
  EN: "English",
  "हि": "Hindi",
  "తె": "Telugu",
  "த": "Tamil",
  "ಕ": "Kannada",
  "മ": "Malayalam",
};

type LoginTab = "vendor" | "admin";

export function LoginScreen({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<LoginTab>("vendor");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Global language — shared across entire app
  const { language, setLanguage } = useLanguage();
  const t = loginTranslations[language];

  const handleLogin = async () => {
    if (phone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      if (activeTab === "vendor") {
        const resp = await login(phone);
        if (resp.data?.status === "success") {
          if (resp.data.registered && resp.data.token) {
            localStorage.setItem("authToken", resp.data.token);
            localStorage.setItem("userRole", "vendor");
            localStorage.removeItem("pendingRegistrationPhone");
            navigate("dashboard");
          } else {
            localStorage.setItem("pendingRegistrationPhone", phone);
            navigate("registration");
          }
        } else {
          setErrorMsg(resp.error || "Login failed");
        }
      } else {
        if (!pin) {
          setErrorMsg("Please enter your PIN");
          setIsLoading(false);
          return;
        }
        const resp = await adminLogin(phone, pin);
        if (resp.data?.status === "success" && resp.data.token) {
          localStorage.setItem("authToken", resp.data.token);
          localStorage.setItem("userRole", "admin");
          navigate("admin");
        } else {
          setErrorMsg(resp.error || "Invalid admin credentials");
        }
      }
    } catch (e) {
      setErrorMsg(t.networkError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
      
      {/* Language Selector */}
      <div className="flex justify-end px-4 pt-3 pb-1 relative z-20">
        <button
          onClick={() => setShowLangDropdown(!showLangDropdown)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border/50 bg-card/60 backdrop-blur-md shadow-sm transition-colors hover:bg-card/80"
          style={{ fontSize: "0.8rem", fontWeight: 600 }}
        >
          <span>{language}</span>
          <ChevronDown size={13} />
        </button>
        {showLangDropdown && (
          <div className="absolute top-12 right-4 bg-card/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-30 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setShowLangDropdown(false); }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 hover:bg-secondary/70 text-left transition-colors ${language === lang ? "bg-secondary" : ""}`}
                style={{ fontSize: "0.85rem" }}
              >
                <span style={{ fontWeight: 700, minWidth: 24 }}>{lang}</span>
                <span className="text-muted-foreground">{languageNames[lang]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hero section */}
      <div className="flex flex-col items-center px-6 pt-10 pb-6 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-5 shadow-xl shadow-primary/30 transform transition-transform hover:scale-105">
          <Shield size={40} className="text-primary-foreground" />
        </div>
        <h1 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70" style={{ fontWeight: 800, fontSize: "1.8rem", lineHeight: 1.2 }}>
          VendorScore
        </h1>
        <p className="text-muted-foreground text-center mt-2 max-w-[250px]" style={{ fontSize: "0.95rem", lineHeight: 1.4 }}>
          {t.tagline}
        </p>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-6 pb-8 flex flex-col relative z-10 w-full max-w-md mx-auto">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-xl shadow-black/5 p-6 mb-6">
          
          {/* Tabs */}
          <div className="flex p-1 bg-secondary/50 rounded-2xl mb-6">
            <button
              onClick={() => { setActiveTab("vendor"); setErrorMsg(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "vendor" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              <User size={16} />
              Vendor
            </button>
            <button
              onClick={() => { setActiveTab("admin"); setErrorMsg(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "admin" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              <ShieldCheck size={16} />
              Admin
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-foreground/90 mb-2 block" style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                {activeTab === "vendor" ? t.mobileNumber : "Admin Mobile Number"}
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-secondary/30 border border-border/50 rounded-xl" style={{ minWidth: 60 }}>
                  <Smartphone size={16} className="text-muted-foreground mr-1" />
                  <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98XXXXXXXX"
                  className="flex-1 px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                  style={{ fontSize: "1rem", letterSpacing: "0.08em" }}
                />
              </div>
              {activeTab === "vendor" && (
                <p className="text-muted-foreground mt-2" style={{ fontSize: "0.75rem" }}>
                  We will log you in if you are registered.
                </p>
              )}
            </div>

            {activeTab === "admin" && (
              <div>
                <label className="text-foreground/90 mb-2 block" style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                  Admin PIN
                </label>
                <div className="flex gap-2 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Lock size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 6-digit PIN"
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                    style={{ fontSize: "1rem", letterSpacing: "0.1em" }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading || phone.length !== 10 || (activeTab === "admin" && !pin)}
              className={`w-full py-4 rounded-xl mt-2 transition-all flex items-center justify-center gap-2 ${
                phone.length === 10 && (!isLoading) && (activeTab === "vendor" || pin)
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
              style={{ fontWeight: 700, fontSize: "1rem" }}
            >
              {isLoading ? "Authenticating..." : "Login securely"}
            </button>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center text-sm font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                {errorMsg}
              </div>
            )}

            {activeTab === "vendor" && (
              <>
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-border/60" />
                  <span className="text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{t.or}</span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>

                <button
                  onClick={() => {
                    if (phone) localStorage.setItem("pendingRegistrationPhone", phone);
                    navigate("registration");
                  }}
                  className="w-full py-3.5 rounded-xl border-2 border-primary/20 text-primary transition-colors hover:bg-primary/5 hover:border-primary/40"
                  style={{ fontWeight: 700, fontSize: "1rem" }}
                >
                  {t.newVendorRegister}
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-auto pb-2 z-10">
          <p className="text-muted-foreground/70 font-medium" style={{ fontSize: "0.75rem" }}>
            {t.termsText}
          </p>
        </div>
      </div>
    </div>
  );
}
