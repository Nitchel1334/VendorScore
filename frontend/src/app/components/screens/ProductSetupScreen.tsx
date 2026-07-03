import { useState, useEffect } from "react";
import { Plus, ArrowRight, Save, X } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";
import { getProducts, applyProductTemplate, createProduct } from "../../lib/api";

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

const TEMPLATES = [
  "Vegetable Vendor",
  "Fruit Vendor",
  "Tea Stall",
  "General Store",
  "Pharmacy"
];

export function ProductSetupScreen({ navigate }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("General");
  const [icon, setIcon] = useState("📦");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) { setLoading(false); return; }
    const { data } = await getProducts(token);
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  const handleApplyTemplate = async (template: string) => {
    setApplying(true);
    const token = localStorage.getItem("authToken");
    if (!token) return;
    await applyProductTemplate(token, template);
    await loadProducts();
    setApplying(false);
    setShowTemplates(false);
  };

  const handleAddProduct = async () => {
    if (!name || !price) return;
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await createProduct(token, {
        name,
        price: parseFloat(price),
        category,
        icon
      });
      if (res.data) {
        setProducts(prev => [...prev, res.data as Product]);
        setName("");
        setPrice("");
        setIcon("📦");
        setCategory("General");
        setSaveSuccess(true);
        setTimeout(() => { setSaveSuccess(false); setShowForm(false); }, 1000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Product Catalog"
        subtitle={`${products.length} item${products.length !== 1 ? "s" : ""}`}
        onBack={() => navigate("dashboard")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Add Product Form */}
        {showForm ? (
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-foreground">New Product</h4>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground p-1 hover:bg-muted rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Icon</label>
                <input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="📦"
                  className="w-full px-2 py-3 bg-background border border-border rounded-xl text-center text-xl focus:border-primary outline-none"
                />
              </div>
              <div className="col-span-3">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Product Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tomato"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Vegetables"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleAddProduct}
              disabled={isSubmitting || !name || !price}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all ${
                saveSuccess ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
              }`}
            >
              {saveSuccess ? "✅ Saved!" : isSubmitting ? "Saving..." : <><Save size={16} /> Save Product</>}
            </button>
          </div>
        ) : (
          /* Header row when not in form */
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-foreground">Your Products</h3>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-sm text-primary font-semibold bg-primary/10 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Plus size={15} /> Add Product
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 && !showForm ? (
          /* Empty state — clean, no auto templates */
          <div className="flex flex-col gap-4">
            <div className="text-center py-12 px-6 bg-card rounded-2xl border border-dashed border-border">
              <div className="text-5xl mb-3">📦</div>
              <h3 className="text-lg font-bold text-foreground">No Products Yet</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-5 leading-relaxed">
                Add the products you sell. Once added, you can record sales quickly using <strong>Quick Sale</strong>.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20"
              >
                <Plus size={16} /> Add Your First Product
              </button>
            </div>

            {/* Optional template section — collapsed by default */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <span>🗂️ Get started with a business template</span>
                <ArrowRight size={15} className={`transition-transform duration-200 ${showTemplates ? "rotate-90" : ""}`} />
              </button>
              {showTemplates && (
                <div className="px-4 pb-4 pt-3 flex flex-col gap-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    Selecting a template will add common products for that business type. You can always edit or delete them.
                  </p>
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl}
                      onClick={() => handleApplyTemplate(tmpl)}
                      disabled={applying}
                      className="flex items-center justify-between p-3 bg-background border border-border rounded-xl hover:border-primary transition-colors disabled:opacity-50 text-left"
                    >
                      <span className="font-medium text-sm text-foreground">{tmpl}</span>
                      {applying ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      ) : (
                        <ArrowRight size={15} className="text-muted-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : !showForm ? (
          /* Products grid */
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center shadow-sm group hover:border-primary transition-colors"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {p.icon || "📦"}
                </div>
                <div className="font-semibold text-foreground truncate w-full text-sm">{p.name}</div>
                <div className="text-primary font-bold mt-1">₹{Number(p.price).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate w-full">{p.category}</div>
              </div>
            ))}
            {/* Inline add more button */}
            <button
              onClick={() => setShowForm(true)}
              className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center text-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus size={20} className="text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary">Add Product</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
