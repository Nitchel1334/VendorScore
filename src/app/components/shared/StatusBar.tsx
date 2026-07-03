import { Signal, Wifi, Battery } from "lucide-react";

export function StatusBar() {
  return (
    <div
      className="flex items-center justify-between px-5 py-2 bg-primary text-primary-foreground shrink-0"
      style={{ fontSize: "0.75rem" }}
    >
      <span style={{ fontWeight: 700 }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal size={13} />
        <Wifi size={13} />
        <Battery size={13} />
      </div>
    </div>
  );
}
