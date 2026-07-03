import { useState, useEffect } from "react";
import { ScreenHeader } from "../shared/ScreenHeader";
import { getProducts, createTransaction } from "../../lib/api";
import { ShoppingCart, Check, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  icon: string | null;
}

interface Props {
  navigate: (screen: string) => void;
}

export function QuickSaleScreen({ navigate }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const { data } = await getProducts(token);
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  const handleSale = async () => {
    if (!selectedProduct || !quantity || parseFloat(quantity) <= 0) return;
    setIsSubmitting(true);
    
    const token = localStorage.getItem("authToken");
    if (!token) return;
    
    try {
      const amount = selectedProduct.price * parseFloat(quantity);
      const res = await createTransaction(token, {
        type: "Sale",
        amount,
        transaction_date: new Date().toISOString().split("T")[0],
        payment_mode: "Cash", // default to Cash for quick sale, could be updated later
        category: selectedProduct.category,
        product_id: selectedProduct.id,
        quantity: parseFloat(quantity),
        notes: "Quick Sale"
      });
      
      if (res.data) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedProduct(null);
          setQuantity("1");
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-background px-6 gap-4">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="font-bold text-xl text-foreground">Sale Recorded!</h2>
        <p className="text-muted-foreground text-center text-sm">
          {quantity}x {selectedProduct?.name} for ₹{(selectedProduct?.price || 0) * parseFloat(quantity || "0")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader 
        title="Quick Sale" 
        subtitle="Tap a product to sell"
        onBack={() => navigate("dashboard")}
      />
      
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm mt-8">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold">No Products Yet</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Add products in the Product Setup screen first.
            </p>
            <button 
              onClick={() => navigate("product-setup")}
              className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold"
            >
              Go to Product Setup
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <button 
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setQuantity("1");
                }}
                className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              >
                <div className="text-4xl mb-2">{p.icon || "📦"}</div>
                <div className="font-semibold text-foreground truncate w-full">{p.name}</div>
                <div className="text-primary font-bold mt-1">₹{p.price}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sale Dialog / Bottom Sheet */}
      {selectedProduct && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-5 shadow-xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center">
                  {selectedProduct.icon || "📦"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{selectedProduct.name}</h3>
                  <p className="text-primary font-bold">₹{selectedProduct.price} / unit</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 bg-muted rounded-full text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="text-sm font-semibold text-muted-foreground block mb-2">Quantity (e.g. 1.5)</label>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(String(Math.max(0.5, parseFloat(quantity || "0") - 1)))}
                  className="w-12 h-12 rounded-xl bg-secondary text-foreground text-xl font-bold flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700"
                >-</button>
                <input 
                  type="number"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="flex-1 h-12 text-center text-xl font-bold bg-background border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                />
                <button 
                  onClick={() => setQuantity(String(parseFloat(quantity || "0") + 1))}
                  className="w-12 h-12 rounded-xl bg-secondary text-foreground text-xl font-bold flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700"
                >+</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted rounded-2xl mb-6">
              <span className="font-semibold text-muted-foreground">Total Sale</span>
              <span className="text-2xl font-bold text-foreground">
                ₹{(selectedProduct.price * parseFloat(quantity || "0")).toFixed(2)}
              </span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-3.5 rounded-xl font-bold text-muted-foreground bg-muted hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSale}
                disabled={isSubmitting || parseFloat(quantity || "0") <= 0}
                className="flex-[2] py-3.5 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50 transition-all active:scale-95"
              >
                {isSubmitting ? "Saving..." : "Confirm Sale"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
