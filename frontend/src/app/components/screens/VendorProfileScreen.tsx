import { useState, useEffect } from "react";
import { User, Store, Smartphone, MapPin, LogOut } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";
import { getCurrentVendor, VendorProfile } from "../../lib/api";

interface Props {
  navigate: (screen: string) => void;
}

export function VendorProfileScreen({ navigate }: Props) {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("login");
        return;
      }
      const resp = await getCurrentVendor(token);
      if (resp.data) {
        setVendor(resp.data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("login");
  };

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="My Profile"
        subtitle="Manage your account"
        onBack={() => navigate("dashboard")}
      />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading profile...
          </div>
        ) : vendor ? (
          <div className="flex flex-col gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User size={40} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold">{vendor.vendor_name}</h2>
              <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                <Store size={14} />
                {vendor.business_name}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-foreground">Business Details</h3>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-secondary p-2 rounded-lg text-muted-foreground">
                  <Smartphone size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Mobile Number</p>
                  <p className="font-medium">{vendor.phone}</p>
                </div>
              </div>

              <div className="w-full h-px bg-border/60" />

              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-secondary p-2 rounded-lg text-muted-foreground">
                  <Store size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Category</p>
                  <p className="font-medium">{vendor.category}</p>
                </div>
              </div>

              <div className="w-full h-px bg-border/60" />

              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-secondary p-2 rounded-lg text-muted-foreground">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Address</p>
                  <p className="font-medium">{vendor.address}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-4 mt-2 bg-red-500/10 text-red-600 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={18} />
              Logout from App
            </button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-10">
            Could not load profile.
          </div>
        )}
      </div>
    </div>
  );
}
