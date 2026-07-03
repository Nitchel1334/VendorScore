import { useState, useEffect } from "react";
import { Mic, MicOff, RotateCcw, Check, Edit3, X } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";

interface Props {
  navigate: (screen: string) => void;
}

type RecordState = "idle" | "recording" | "processing" | "detected" | "confirmed";

const detectedTransaction = {
  type: "Sale",
  amount: "₹1,200",
  paymentMode: "UPI",
  customer: "Ravi from Gandhi Bazaar",
  rawText: '"Ravi ne baarah sau UPI se diye vegetables ke liye"',
};

const langHints = ["हिंदी", "తెలుగు", "தமிழ்", "ಕನ್ನಡ", "മലയാളം", "English"];

export function VoiceTransactionScreen({ navigate }: Props) {
  const [state, setState] = useState<RecordState>("idle");
  const [timer, setTimer] = useState(0);
  const [selectedLang, setSelectedLang] = useState("हिंदी");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state === "recording") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleMicPress = () => {
    if (state === "idle") {
      setState("recording");
      setTimer(0);
    } else if (state === "recording") {
      setState("processing");
      setTimeout(() => {
        setState("detected");
        setShowPopup(true);
      }, 1800);
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col min-h-full bg-background relative">
      <ScreenHeader
        title="Voice Entry"
        subtitle="Speak your transaction"
        onBack={() => navigate("dashboard")}
      />

      <div className="flex-1 flex flex-col items-center px-6 py-4 gap-4">
        {/* Language Selector */}
        <div className="w-full">
          <p className="text-muted-foreground mb-2 text-center" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
            Select Language
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {langHints.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLang(l)}
                className={`px-3 py-1.5 rounded-full border transition-colors ${
                  selectedLang === l
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground"
                }`}
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {state === "idle" && (
          <div className="text-center px-4">
            <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
              Tap the mic and say something like:
            </p>
            <p className="text-foreground mt-2 bg-secondary px-4 py-2 rounded-xl" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
              "Priya ko 1200 rupees ka vegetables becha UPI se"
            </p>
          </div>
        )}

        {/* Mic Button Area */}
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Ripple rings */}
          <div className="relative flex items-center justify-center">
            {state === "recording" && (
              <>
                <div className="absolute w-40 h-40 rounded-full border-2 border-primary/20 animate-ping" />
                <div className="absolute w-32 h-32 rounded-full border-2 border-primary/30 animate-pulse" />
              </>
            )}
            {state === "processing" && (
              <>
                <div className="absolute w-40 h-40 rounded-full border-2 border-accent/20 animate-spin" style={{ animationDuration: "3s" }} />
                <div className="absolute w-32 h-32 rounded-full border-2 border-accent/40 animate-pulse" />
              </>
            )}
            <button
              onClick={handleMicPress}
              disabled={state === "processing" || state === "detected"}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
                state === "recording"
                  ? "bg-red-500 shadow-red-200"
                  : state === "processing"
                  ? "bg-accent shadow-amber-200"
                  : state === "detected"
                  ? "bg-green-500 shadow-green-200"
                  : "bg-primary shadow-primary/30"
              }`}
            >
              {state === "processing" ? (
                <span style={{ fontSize: "2rem" }}>⚙️</span>
              ) : state === "detected" ? (
                <Check size={36} className="text-white" />
              ) : state === "recording" ? (
                <MicOff size={36} className="text-white" />
              ) : (
                <Mic size={36} className="text-white" />
              )}
            </button>
          </div>

          {/* Status text */}
          <div className="text-center">
            {state === "idle" && (
              <p style={{ fontSize: "1rem", fontWeight: 700 }}>Tap to Record</p>
            )}
            {state === "recording" && (
              <>
                <div className="flex items-center gap-2 justify-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-red-500" style={{ fontSize: "1rem", fontWeight: 700 }}>Recording...</p>
                </div>
                <p className="text-muted-foreground" style={{ fontSize: "1.2rem", fontWeight: 600, fontFamily: "monospace" }}>
                  {formatTime(timer)}
                </p>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.75rem" }}>Tap again to stop</p>
              </>
            )}
            {state === "processing" && (
              <p className="text-accent" style={{ fontSize: "1rem", fontWeight: 700 }}>Processing via IndicWhisper...</p>
            )}
            {state === "detected" && (
              <p className="text-green-600" style={{ fontSize: "1rem", fontWeight: 700 }}>Transaction Detected ✓</p>
            )}
          </div>
        </div>

        {/* Speech-to-text output */}
        {(state === "detected" || state === "recording") && (
          <div className="w-full">
            <p className="text-muted-foreground mb-1" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              Speech-to-text Output
            </p>
            <div className="bg-card border border-border rounded-2xl p-4 min-h-16">
              <p className="text-foreground" style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                {state === "detected"
                  ? detectedTransaction.rawText
                  : "Listening..."}
              </p>
              {state === "detected" && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full" style={{ fontSize: "0.7rem", fontWeight: 600 }}>Sale</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full" style={{ fontSize: "0.7rem", fontWeight: 600 }}>₹1,200</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full" style={{ fontSize: "0.7rem", fontWeight: 600 }}>UPI</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Re-record and Reset */}
        {(state === "detected") && (
          <div className="flex gap-3 w-full">
            <button
              onClick={() => { setState("idle"); setTimer(0); setShowPopup(false); }}
              className="flex-1 py-3 rounded-2xl border border-border text-muted-foreground flex items-center justify-center gap-2"
              style={{ fontWeight: 600, fontSize: "0.9rem" }}
            >
              <RotateCcw size={16} />
              Re-record
            </button>
          </div>
        )}

        {/* Annotation */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl w-full">
          <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
            📋 ANNOTATION: Voice processed via IndicWhisper ASR. Supports 5 Indian languages.
            NLP extracts: amount, type, payment mode. Works offline with cached model.
          </p>
        </div>
      </div>

      {/* Transaction Detected Popup */}
      {showPopup && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-20">
          <div className="bg-card rounded-t-3xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontWeight: 800, fontSize: "1.1rem" }}>Transaction Detected</h3>
              <button onClick={() => setShowPopup(false)}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: "Type", value: detectedTransaction.type, color: "text-green-600" },
                { label: "Amount", value: detectedTransaction.amount, color: "text-foreground" },
                { label: "Payment Mode", value: detectedTransaction.paymentMode, color: "text-blue-600" },
                { label: "Customer", value: detectedTransaction.customer, color: "text-muted-foreground" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>{row.label}</span>
                  <span className={`${row.color}`} style={{ fontSize: "0.9rem", fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowPopup(false); navigate("manual-transaction"); }}
                className="flex-1 py-3.5 rounded-2xl border border-border flex items-center justify-center gap-2 text-foreground"
                style={{ fontWeight: 600, fontSize: "0.9rem" }}
              >
                <Edit3 size={16} />
                Edit
              </button>
              <button
                onClick={() => { setShowPopup(false); setState("confirmed"); setTimeout(() => navigate("dashboard"), 1500); }}
                className="py-3.5 px-6 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                style={{ fontWeight: 700, fontSize: "0.9rem", flexGrow: 2 }}
              >
                <Check size={16} />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {state === "confirmed" && (
        <div className="absolute inset-0 bg-green-50 flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <span style={{ fontSize: "2.5rem" }}>✅</span>
          </div>
          <p style={{ fontWeight: 800, fontSize: "1.2rem" }}>Saved!</p>
        </div>
      )}
    </div>
  );
}
