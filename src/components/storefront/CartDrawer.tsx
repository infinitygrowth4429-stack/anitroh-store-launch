import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartDrawer() {
  const { items, open, setOpen, remove, setQty, total } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl tracking-tight">Your Bag</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
            <div className="font-serif text-2xl text-foreground mb-2">Your bag is empty</div>
            <p className="text-sm mb-6">Begin curating your edit.</p>
            <button onClick={() => setOpen(false)} className="bg-primary text-primary-foreground px-6 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-gold hover:text-primary transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border/60">
              {items.map((it) => (
                <div key={it.product.id + it.size + it.color} className="flex gap-4 py-5">
                  <Link to={`/product/${it.product.id}`} onClick={() => setOpen(false)} className="w-20 h-24 bg-secondary shrink-0 overflow-hidden">
                    <img src={it.product.image} alt={it.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <Link to={`/product/${it.product.id}`} onClick={() => setOpen(false)} className="font-serif text-[15px] leading-snug hover:text-gold transition-colors">
                        {it.product.name}
                      </Link>
                      <button onClick={() => remove(it.product.id)} className="text-muted-foreground hover:text-foreground -mt-1" aria-label="Remove">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {it.size && <>Size {it.size} · </>}{it.color}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button onClick={() => setQty(it.product.id, it.qty - 1)} className="p-2 hover:bg-secondary"><Minus className="w-3 h-3" /></button>
                        <span className="px-3 text-sm">{it.qty}</span>
                        <button onClick={() => setQty(it.product.id, it.qty + 1)} className="p-2 hover:bg-secondary"><Plus className="w-3 h-3" /></button>
                      </div>
                      <div className="text-sm font-medium">${(it.product.price * it.qty).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</div>
              <button className="w-full bg-primary text-primary-foreground py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-gold hover:text-primary transition-colors">
                Checkout
              </button>
              <button onClick={() => setOpen(false)} className="w-full text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground py-2">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
