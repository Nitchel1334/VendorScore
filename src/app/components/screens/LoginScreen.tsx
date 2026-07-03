import { useState } from "react";
import { ChevronDown, Shield, Smartphone } from "lucide-react";

interface Props {
  navigate: (screen: string) => void;
}

const languages = ["EN", "हि", "తె", "த", "ಕ", "മ"];
const languageNames: Record<string, string> = {
  EN: "English",
  "हि": "Hindi",
  "తె": "Telugu",
  "த": "Tamil",
  "ಕ": "Kannada",
  "മ": "Malayalam",
};

export function LoginScreen({ navigate }: Props) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("EN");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Language Selector */}
      <div className="flex justify-end px-4 pt-3 pb-1 relative">
        <button
          onClick={() => setShowLangDropdown(!showLangDropdown)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-card"
          style={{ fontSize: "0.8rem", fontWeight: 600 }}
        >
          <span>{language}</span>
          <ChevronDown size={13} />
        </button>
        {showLangDropdown && (
          <div className="absolute top-12 right-4 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setShowLangDropdown(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-secondary text-left transition-colors"
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
      <div className="flex flex-col items-center px-6 pt-6 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
          <Shield size={32} className="text-primary-foreground" />
        </div>
        <h1 className="text-center" style={{ fontWeight: 800, fontSize: "1.6rem", lineHeight: 1.2 }}>
          VendorScore
        </h1>
        <p className="text-muted-foreground text-center mt-1.5" style={{ fontSize: "0.9rem" }}>
          Track. Score. Grow.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap justify-center">
          {["Small Vendors", "Shop Owners", "Street Vendors"].map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-8">
        {step === "phone" ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-foreground mb-1.5 block" style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-card border border-border rounded-xl" style={{ minWidth: 60 }}>
                  <Smartphone size={14} className="text-muted-foreground mr-1" />
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98XXXXXXXX"
                  className="flex-1 px-4 py-3.5 bg-card border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  style={{ fontSize: "1rem", letterSpacing: "0.08em" }}
                />
              </div>
              <p className="text-muted-foreground mt-1" style={{ fontSize: "0.72rem" }}>
                We'll send a 6-digit OTP to verify your number
              </p>
            </div>

            <button
              onClick={() => phone.length === 10 && setStep("otp")}
              className={`w-full py-4 rounded-2xl transition-all ${
                phone.length === 10
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90"
                  : "bg-muted text-muted-foreground"
              }`}
              style={{ fontWeight: 700, fontSize: "1rem" }}
            >
              Send OTP
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={() => navigate("registration")}
              className="w-full py-4 rounded-2xl border-2 border-primary text-primary transition-colors hover:bg-secondary"
              style={{ fontWeight: 700, fontSize: "1rem" }}
            >
              New Vendor? Register
            </button>

            {/* Annotation */}
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                📋 ANNOTATION: OTP sent via SMS. Voice OTP available for low-literacy users.
                Supports regional language UI based on selection above.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-center mb-2">
              <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
                OTP sent to <strong>+91 {phone}</strong>
              </p>
            </div>

            <div>
              <label className="text-foreground mb-2 block" style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                Enter 6-digit OTP
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 text-center bg-card border-2 border-border rounded-xl outline-none focus:border-primary transition-colors"
                    style={{ fontSize: "1.4rem", fontWeight: 700 }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("dashboard")}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              style={{ fontWeight: 700, fontSize: "1rem" }}
            >
              Verify & Continue
            </button>

            <button
              onClick={() => setStep("phone")}
              className="text-primary text-center"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              ← Change Number
            </button>

            <div className="flex items-center justify-between mt-1 px-1">
              <span className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>
                Resend OTP in 28s
              </span>
              <button className="text-primary" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Resend via Call
              </button>
            </div>

            {/* Annotation */}
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                📋 ANNOTATION: OTP auto-read from SMS using Android SMS Listener API.
                Voice call fallback for feature phones.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-4 text-center">
        <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  );
}
