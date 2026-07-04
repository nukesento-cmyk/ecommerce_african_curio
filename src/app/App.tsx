import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";

// ─── Image URLs ────────────────────────────────────────────────────────────────
// Using placeholder images - replace with local imports when you have the files
const IMAGES = {
  // Background/atmosphere
  savanna: "https://images.unsplash.com/photo-1728042107033-76b13feac547?w=1920&h=1080&fit=crop&auto=format",
  
  // ART AND CRAFTS - focusing on the objects, not people
  maasaiWoman: "https://images.stockcake.com/public/6/2/3/62376b2d-26b9-4c71-b3fc-d7fcf2982c13_large/joyful-colorful-portrait-stockcake.jpg",
  beadedNecklace: "https://images.stockcake.com/public/9/e/2/9e2b8c04-6cf7-4fb6-9d1f-4932c78dbb95_large/traditional-beadwork-motion-stockcake.jpg",
  maasaiFull: "https://images.stockcake.com/public/c/a/c/caccf3af-f470-4482-bd49-48b21e92d3ff/traditional-beaded-attire-stockcake.jpg",
  
  // Other craft objects
  baskets: "https://images.unsplash.com/photo-1723578297503-78642a524074?w=800&h=700&fit=crop&auto=format",
  basketsMarket: "https://images.unsplash.com/photo-1596626417050-39c7f6ddd2c9?w=700&h=900&fit=crop&auto=format",
  woodenStatue: "https://images.unsplash.com/photo-1696586904897-aa8590c88f92?w=700&h=1000&fit=crop&auto=format",
  tribalMask: "https://images.unsplash.com/photo-1770036245296-40b7c9413387?w=700&h=900&fit=crop&auto=format",
  woodenStool: "https://images.unsplash.com/photo-1770750738020-d094ad48a1f2?w=700&h=900&fit=crop&auto=format",
  
  // Boutique showing the art objects
  boutique: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400&h=800&fit=crop&auto=format",
  
  // Atmosphere
  sunset: "https://images.unsplash.com/photo-1779925771426-3958e5b48f07?w=1920&h=1080&fit=crop&auto=format",
};

interface Product {
  id: number;
  name: string;
  origin: string;
  price: string;
  material: string;
  description: string;
  image: string;
  region: "east" | "west" | "south";
  badge?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Maasai Grand Collar",
    origin: "Kenya",
    price: "$485",
    material: "Hand-strung glass beads, copper wire",
    description: "A ceremonial collar necklace hand-crafted by Maasai women in the Rift Valley. Each bead is individually selected for colour harmony and strung over three weeks. Worn at rites of passage and now brought into the modern world as wearable heritage.",
    image: IMAGES.beadedNecklace,
    region: "east",
    badge: "Artisan Edition",
  },
  {
    id: 2,
    name: "Rift Valley Shuka Wrap",
    origin: "Tanzania",
    price: "$320",
    material: "100% hand-loomed cotton",
    description: "Woven on traditional looms by Arusha artisans, this shuka carries the ancestral geometry of the Maasai highlands. The deep cardinal red is fixed with natural mordants. One-of-a-kind dimensions mean no two wraps are alike.",
    image: IMAGES.maasaiFull,
    region: "east",
  },
  {
    id: 3,
    name: "Maasai Portrait Cuff",
    origin: "Kenya",
    price: "$265",
    material: "Beadwork on brass armature",
    description: "A wide cuff bracelet echoing the colourful bead geometry worn by Maasai women during dance ceremonies. The brass armature is formed by hand and the beads are laid one row at a time.",
    image: IMAGES.maasaiWoman,
    region: "east",
  },
  {
    id: 4,
    name: "Kalahari Coil Basket",
    origin: "Botswana",
    price: "$195",
    material: "Ilala palm & natural dyes",
    description: "Tightly coiled over 80 hours by a master weaver in the Okavango Delta, this basket draws on San geometric tradition. The patterns encode seasonal stories — drought, harvest, migration.",
    image: IMAGES.baskets,
    region: "south",
  },
  {
    id: 5,
    name: "Savanna Market Tray",
    origin: "Zimbabwe",
    price: "$140",
    material: "Hand-woven sweetgrass",
    description: "Sweetgrass baskets from the Hwange region are among the oldest craft traditions in Southern Africa. This tray-form vessel is ideal as functional art — use it to display objects or hang it as wall sculpture.",
    image: IMAGES.basketsMarket,
    region: "south",
  },
  {
    id: 6,
    name: "Ndebele Guardian Mask",
    origin: "South Africa",
    price: "$850",
    material: "Kiaat hardwood, natural pigments",
    description: "Hand-carved from a single trunk of kiaat wood, this ceremonial mask is based on Ndebele warrior traditions. The artisan carves and sands for three weeks before applying mineral-based pigments ground by hand.",
    image: IMAGES.tribalMask,
    region: "south",
    badge: "Museum Grade",
  },
  {
    id: 7,
    name: "Ashanti Ancestral Figure",
    origin: "Ghana",
    price: "$1,200",
    material: "Odum wood, beeswax finish",
    description: "A seated ancestor figure in the Ashanti royal tradition, carved from sacred odum wood by a master carver in Kumasi. The form is based on a 14th-century archetype held in the Manhyia Palace collection.",
    image: IMAGES.woodenStatue,
    region: "west",
    badge: "Collector's Piece",
  },
  {
    id: 8,
    name: "Yoruba Drum Stool",
    origin: "Nigeria",
    price: "$680",
    material: "Iroko hardwood",
    description: "A carved iroko stool with a supporting figure — the traditional Yoruba form connoting prestige and ancestry. The carver from Osogbo works in a lineage spanning seven generations, each piece signed beneath.",
    image: IMAGES.woodenStool,
    region: "west",
  },
];

// ─── Global CSS injected once ─────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes lanternSway {
    0%, 100% { transform: rotate(-3deg); }
    50%       { transform: rotate(3deg); }
  }
  @keyframes rayPulse {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 1; }
  }
  @keyframes breathe {
    0%, 100% { opacity: 0.45; }
    50%       { opacity: 1; }
  }
  @keyframes scrollLine {
    0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
    50%  { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes dustFloat {
    0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
    20%  { opacity: 1; }
    80%  { opacity: 0.6; }
    100% { transform: translateY(-120px) translateX(20px); opacity: 0; }
  }
  .fade-up { animation: fadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) both; }
  .fade-in { animation: fadeIn 0.8s ease both; }

  /* Card tilt handled by JS inline styles — these give base transitions */
  .product-card { transition: transform 0.15s ease, box-shadow 0.3s ease; }
  .product-card:hover .product-img { transform: scale(1.05); }
  .product-img { transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); }

  * { scrollbar-width: none; }
  *::-webkit-scrollbar { display: none; }
  ::selection { background: rgba(196,136,42,0.3); color: #f0e4cc; }
`;

// ─── Particle Canvas ──────────────────────────────────────────────────────────
function ParticleCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.08),
      a: Math.random() * 0.5 + 0.1,
      life: Math.random(),
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.0015;
        if (p.life <= 0 || p.y < -10) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
          p.life = Math.random();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,136,42,${p.a * p.life})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0,
        pointerEvents: "none", zIndex: 10,
        opacity: active ? 1 : 0,
        transition: "opacity 1.5s ease",
      }}
    />
  );
}

// ─── Light Rays ───────────────────────────────────────────────────────────────
function LightRays() {
  const rays = [
    { left: "15%", delay: "0s",   width: 110, angle: -8  },
    { left: "38%", delay: "1.5s", width: 75,  angle:  3  },
    { left: "62%", delay: "0.8s", width: 95,  angle: -5  },
    { left: "82%", delay: "2.2s", width: 58,  angle:  7  },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {rays.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute", top: 0, left: r.left,
            width: r.width, height: "100%",
            background: "linear-gradient(180deg,rgba(255,220,120,0.12) 0%,rgba(196,136,42,0.04) 50%,transparent 100%)",
            transform: `rotate(${r.angle}deg)`,
            transformOrigin: "top center",
            animation: `rayPulse 4s ease-in-out ${r.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Floating Lantern ─────────────────────────────────────────────────────────
function FloatingLantern({ x, delay }: { x: string; delay: string }) {
  return (
    <div style={{ position: "absolute", top: 0, left: x, pointerEvents: "none", animation: `lanternSway 4s ease-in-out ${delay} infinite` }}>
      <div style={{ width: 2, height: 56, background: "linear-gradient(to bottom,rgba(196,136,42,0.55),transparent)", margin: "0 auto" }} />
      <div style={{
        width: 28, height: 38, margin: "0 auto",
        background: "radial-gradient(ellipse at 50% 40%,rgba(255,200,80,0.4),rgba(196,136,42,0.18))",
        border: "1px solid rgba(196,136,42,0.55)",
        borderRadius: "4px 4px 8px 8px",
        boxShadow: "0 0 28px rgba(255,180,0,0.18),inset 0 0 18px rgba(255,200,80,0.1)",
      }} />
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onClick, visible }: { product: Product; onClick: () => void; visible: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ x: -y * 12, y: x * 12 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className="product-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      onClick={onClick}
      style={{
        cursor: "pointer",
        transform: visible
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(0) scale(${hovered ? 1.02 : 1})`
          : "translateY(40px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.25s ease, opacity 0.8s ease, box-shadow 0.3s ease",
        boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.5)" : "0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ overflow: "hidden", aspectRatio: "3/4", background: "#1c1208", position: "relative" }}>
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.65),transparent 55%)" }} />
        {product.badge && (
          <div style={{
            position: "absolute", top: 14, left: 14,
            padding: "4px 10px",
            background: "rgba(196,136,42,0.92)",
            color: "#0d0905",
            fontFamily: "'DM Mono',monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            {product.badge}
          </div>
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg,rgba(196,136,42,0.07) 0%,transparent 60%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />
      </div>
      <div style={{ padding: "18px 20px", background: "#1c1208" }}>
        <div style={{ marginBottom: 4, color: "#a08060", fontFamily: "'DM Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {product.origin} · {product.material.split(",")[0]}
        </div>
        <div style={{ marginBottom: 10, fontFamily: "'Playfair Display',serif", color: "#f0e4cc", fontSize: "1rem", fontWeight: 500, lineHeight: 1.35 }}>
          {product.name}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", color: "#c4882a", fontSize: "0.95rem", fontWeight: 500 }}>
            {product.price}
          </span>
          <span style={{
            fontFamily: "'DM Mono',monospace", color: "#c4882a", fontSize: "0.58rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease",
          }}>
            View →
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Product Modal ────────────────────────────────────────────────────────────
function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (product) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [product]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  if (!product) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `rgba(5,3,1,${visible ? 0.92 : 0})`,
        backdropFilter: visible ? "blur(14px)" : "none",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: 860, margin: "0 24px",
          background: "#141008",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.9) translateY(32px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {/* Image */}
          <div style={{ position: "relative", minHeight: 480, background: "#1c1208", overflow: "hidden" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,transparent,rgba(0,0,0,0.18))" }} />
            <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(196,136,42,0.15)", pointerEvents: "none" }} />
          </div>
          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 36px", background: "#141008" }}>
            <div>
              {product.badge && (
                <div style={{
                  display: "inline-block", marginBottom: 16,
                  padding: "4px 12px",
                  background: "rgba(196,136,42,0.14)", color: "#c4882a",
                  fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  border: "1px solid rgba(196,136,42,0.28)",
                }}>
                  {product.badge}
                </div>
              )}
              <div style={{ marginBottom: 6, color: "#a08060", fontFamily: "'DM Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {product.origin}
              </div>
              <div style={{ marginBottom: 4, fontFamily: "'Playfair Display',serif", color: "#f0e4cc", fontSize: "1.9rem", fontWeight: 500, lineHeight: 1.15 }}>
                {product.name}
              </div>
              <div style={{ marginBottom: 20, fontFamily: "'DM Mono',monospace", color: "#c4882a", fontSize: "1.35rem", fontWeight: 500 }}>
                {product.price}
              </div>
              <div style={{ marginBottom: 20, color: "#a08060", fontFamily: "'Jost',sans-serif", fontSize: "0.88rem", fontWeight: 300, lineHeight: 1.85 }}>
                {product.description}
              </div>
              <div style={{ paddingTop: 16, paddingBottom: 20, borderTop: "1px solid rgba(196,136,42,0.14)" }}>
                <div style={{ marginBottom: 4, color: "#a08060", fontFamily: "'DM Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Material</div>
                <div style={{ color: "#f0e4cc", fontFamily: "'Jost',sans-serif", fontSize: "0.84rem" }}>{product.material}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                style={{
                  width: "100%", padding: "15px 0", border: "none", cursor: "pointer",
                  background: "#c4882a", color: "#0d0905",
                  fontFamily: "'DM Mono',monospace", fontSize: "0.68rem",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#d4982e"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#c4882a"; }}
              >
                Add to Collection
              </button>
              <button
                onClick={onClose}
                style={{
                  width: "100%", padding: "12px 0", cursor: "pointer",
                  background: "transparent", color: "#a08060",
                  fontFamily: "'DM Mono',monospace", fontSize: "0.62rem",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  border: "1px solid rgba(196,136,42,0.2)",
                }}
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Observed fade-up wrapper ─────────────────────────────────────────────────
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
function GallerySection({
  id, title, subtitle, products, onProductClick, bgFrom, bgTo, accent,
}: {
  id: string; title: string; subtitle: string; products: Product[];
  onProductClick: (p: Product) => void; bgFrom: string; bgTo: string; accent: string;
}) {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisibleCards((s) => new Set([...s, i])), i * 120);
          obs.disconnect();
        }
      }, { threshold: 0.08 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section id={id} style={{ position: "relative", padding: "100px 24px", overflow: "hidden", background: `linear-gradient(135deg,${bgFrom} 0%,${bgTo} 100%)` }}>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{
              display: "inline-block", marginBottom: 16,
              padding: "6px 16px",
              border: `1px solid ${accent}40`,
              color: accent,
              fontFamily: "'DM Mono',monospace",
              fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase",
            }}>
              {subtitle}
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", color: "#f0e4cc", fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 400, lineHeight: 1.1 }}>
              {title}
            </div>
            <div style={{ marginTop: 20, width: 50, height: 1, background: accent, opacity: 0.45, margin: "20px auto 0" }} />
          </div>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 28 }}>
          {products.map((product, i) => (
            <div
              key={product.id}
              ref={(el) => { cardRefs.current[i] = el; }}
            >
              <ProductCard
                product={product}
                onClick={() => onProductClick(product)}
                visible={visibleCards.has(i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ position: "relative", padding: "24px 0", background: "#0d0905", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,rgba(196,136,42,0.38))" }} />
      <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
        <polygon points="40,2 55,15 40,28 25,15" stroke="#c4882a" strokeWidth="1.5" fill="rgba(196,136,42,0.07)" />
        <circle cx="40" cy="15" r="4" fill="#c4882a" opacity="0.8" />
        <circle cx="10" cy="15" r="3" fill="none" stroke="#c4882a" strokeWidth="1" opacity="0.45" />
        <circle cx="70" cy="15" r="3" fill="none" stroke="#c4882a" strokeWidth="1" opacity="0.45" />
      </svg>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left,transparent,rgba(196,136,42,0.38))" }} />
    </div>
  );
}

// ─── Interstitial quote ───────────────────────────────────────────────────────
function QuoteSection({ direction, quote, credit, accent, bgFrom, bgTo, bgImg }: {
  direction: string; quote: string; credit: string; accent: string;
  bgFrom: string; bgTo: string; bgImg?: string;
}) {
  return (
    <div style={{ position: "relative", minHeight: "45vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", overflow: "hidden", background: `linear-gradient(180deg,${bgFrom} 0%,${bgTo} 100%)` }}>
      {bgImg && (
        <img src={bgImg} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.09 }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "rgba(13,9,5,0.6)" }} />
      <FadeUp>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 640 }}>
          <div style={{ marginBottom: 14, fontFamily: "'DM Mono',monospace", color: accent, fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase" }}>
            ✦ &nbsp;{direction}&nbsp; ✦
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", color: "#f0e4cc", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 400, lineHeight: 1.25 }}
            dangerouslySetInnerHTML={{ __html: quote }} />
          <div style={{ marginTop: 16, fontFamily: "'DM Mono',monospace", color: "#a08060", fontSize: "0.62rem", letterSpacing: "0.14em" }}>
            — {credit}
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Inject global CSS once
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = GLOBAL_CSS;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;
    lenis.on("scroll", ({ scroll }: { scroll: number }) => setScrollY(scroll));
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const eastProducts  = PRODUCTS.filter((p) => p.region === "east");
  const westProducts  = PRODUCTS.filter((p) => p.region === "west");
  const southProducts = PRODUCTS.filter((p) => p.region === "south");
  const heroParallax  = Math.min(scrollY * 0.38, 180);
  const navSolid      = scrollY > 60;

  return (
    <div style={{ fontFamily: "'Jost',sans-serif" }}>

      <ParticleCanvas active={true} />

      {/* ── Hero / Foyer ─────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "linear-gradient(180deg,#0d0905 0%,#1a0e06 100%)" }}>
        <LightRays />
        {/* Boutique image — top half */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <img
            src={IMAGES.boutique}
            alt=""
            aria-hidden
            style={{
              width: "100%", height: "200%",
              objectFit: "cover", objectPosition: "top center",
              display: "block",
              transform: `translateY(${heroParallax * 0.4}px)`,
              opacity: 0.22,
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(13,9,5,0.55) 0%,rgba(13,9,5,0.3) 40%,rgba(13,9,5,0.75) 100%)" }} />
        </div>
        {/* Arch background SVG */}
        <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
          <svg viewBox="0 0 800 900" style={{ height: "100%", opacity: 0.09 }} preserveAspectRatio="xMidYMid slice">
            <ellipse cx="400" cy="900" rx="380" ry="700" fill="none" stroke="#c4882a" strokeWidth="1.5" />
            <ellipse cx="400" cy="900" rx="280" ry="580" fill="none" stroke="#c4882a" strokeWidth="0.8" />
          </svg>
        </div>
        <FloatingLantern x="18%"  delay="0s" />
        <FloatingLantern x="50%"  delay="1s" />
        <FloatingLantern x="82%"  delay="0.5s" />

        {/* Hero text */}
        <div style={{
          position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 700,
          opacity: 1,
          transform: "translateY(0)",
          transition: "opacity 1.2s ease 0.5s, transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s",
        }}>
          <div style={{
            display: "inline-block", marginBottom: 24,
            padding: "7px 20px",
            border: "1px solid rgba(196,136,42,0.3)",
            fontFamily: "'DM Mono',monospace", color: "#c4882a",
            fontSize: "0.6rem", letterSpacing: "0.34em", textTransform: "uppercase",
          }}>
            ✦ &nbsp; Welcome to Urithi &nbsp; ✦
          </div>
          <h1 style={{
            margin: "0 0 20px",
            fontFamily: "'Playfair Display',serif", color: "#f0e4cc",
            fontSize: "clamp(2.6rem,7vw,5.2rem)", fontWeight: 400,
            lineHeight: 1.06, letterSpacing: "-0.01em",
          }}>
            African Craft,<br />
            <em style={{ color: "#c4882a", fontStyle: "italic" }}>Elevated</em>
          </h1>
          <p style={{
            margin: "0 auto 44px", maxWidth: 480,
            fontFamily: "'Jost',sans-serif", color: "#a08060",
            fontSize: "0.97rem", fontWeight: 300, lineHeight: 1.95, letterSpacing: "0.02em",
          }}>
            Each piece in our collection is sourced directly from master artisans across the continent.
            Every object carries a story. Every purchase sustains a tradition.
          </p>
          <a
            href="#east"
            style={{
              display: "inline-block", padding: "14px 36px",
              border: "1px solid rgba(196,136,42,0.45)", color: "#c4882a",
              fontFamily: "'DM Mono',monospace", fontSize: "0.64rem",
              letterSpacing: "0.24em", textTransform: "uppercase", textDecoration: "none",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { const a = e.currentTarget; a.style.background = "rgba(196,136,42,0.1)"; a.style.borderColor = "rgba(196,136,42,0.9)"; }}
            onMouseLeave={(e) => { const a = e.currentTarget; a.style.background = "transparent"; a.style.borderColor = "rgba(196,136,42,0.45)"; }}
          >
            Begin Your Journey
          </a>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          opacity: 1,
          transition: "opacity 1s ease 2s",
        }}>
          <div style={{ fontFamily: "'DM Mono',monospace", color: "#a08060", fontSize: "0.53rem", letterSpacing: "0.24em", textTransform: "uppercase" }}>
            Scroll to explore
          </div>
          <div style={{ width: 1, height: 38, background: "linear-gradient(to bottom,rgba(196,136,42,0.8),transparent)", animation: "scrollLine 1.8s ease-in-out infinite" }} />
        </div>
      </section>

      <Divider />

      {/* ── East African Gallery ────────────────────────────────────────── */}
      <GallerySection
        id="east"
        title="East African Gallery"
        subtitle="Maasai · Kikuyu · Swahili Coast"
        products={eastProducts}
        onProductClick={setSelectedProduct}
        bgFrom="#100806"
        bgTo="#0d0905"
        accent="#c4882a"
      />

      {/* ── Quote — West Africa ──────────────────────────────────────────── */}
      <QuoteSection
        direction="Continuing West"
        quote="&ldquo;The art of the hands<br/><em style='color:#8b4a2b'>is the voice of the soul.&rdquo;</em>"
        credit="Akan Proverb, Ghana"
        accent="#8b4a2b"
        bgFrom="#0d0905"
        bgTo="#12080a"
        bgImg={IMAGES.sunset}
      />

      {/* ── West African Gallery ────────────────────────────────────────── */}
      <GallerySection
        id="west"
        title="West African Gallery"
        subtitle="Ashanti · Yoruba · Benin Kingdom"
        products={westProducts}
        onProductClick={setSelectedProduct}
        bgFrom="#0d0905"
        bgTo="#100a06"
        accent="#8b4a2b"
      />

      {/* ── Quote — Southern Africa ──────────────────────────────────────── */}
      <QuoteSection
        direction="Heading South"
        quote="&ldquo;Ubuntu — <em style='color:#4a7a8a'>I am</em><br/>because we are.&rdquo;"
        credit="Nguni Bantu Philosophy"
        accent="#4a7a8a"
        bgFrom="#100a06"
        bgTo="#0a0d0e"
      />

      {/* ── Southern African Gallery ─────────────────────────────────────── */}
      <GallerySection
        id="south"
        title="Southern African Gallery"
        subtitle="Ndebele · Zulu · San · Shona"
        products={southProducts}
        onProductClick={setSelectedProduct}
        bgFrom="#0d0905"
        bgTo="#0a0e10"
        accent="#4a7a8a"
      />

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "100px 24px", overflow: "hidden", background: "#080603" }}>
        {/* Boutique image — bottom half */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <img
            src={IMAGES.boutique}
            alt=""
            aria-hidden
            style={{
              width: "100%", height: "200%",
              objectFit: "cover", objectPosition: "bottom center",
              display: "block",
              position: "absolute", bottom: 0, left: 0,
              opacity: 0.2,
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(8,6,3,0.85) 0%,rgba(8,6,3,0.55) 50%,rgba(8,6,3,0.85) 100%)" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", pointerEvents: "none", opacity: 0.06 }}>
          <svg viewBox="0 0 600 400" width="100%" height="100%">
            <circle cx="300" cy="400" r="340" fill="none" stroke="#c4882a" strokeWidth="1" />
            <circle cx="300" cy="400" r="240" fill="none" stroke="#c4882a" strokeWidth="0.5" />
          </svg>
        </div>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <FadeUp>
            <div style={{
              display: "inline-block", marginBottom: 24,
              padding: "6px 16px",
              border: "1px solid rgba(196,136,42,0.28)",
              fontFamily: "'DM Mono',monospace", color: "#c4882a",
              fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase",
            }}>
              Every Purchase Preserves a Lineage
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", color: "#f0e4cc", fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 400, lineHeight: 1.15, marginBottom: 28 }}>
              Carry the continent<br /><em style={{ color: "#c4882a" }}>with you.</em>
            </div>
            <p style={{ color: "#a08060", fontFamily: "'Jost',sans-serif", fontSize: "0.94rem", fontWeight: 300, lineHeight: 1.9, marginBottom: 44, maxWidth: 500, margin: "0 auto 44px" }}>
              Urithi means heritage in Swahili. We exist to honour the artisans whose hands shape these objects and to bring the beauty of African craft into homes worldwide.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                style={{ padding: "15px 40px", border: "none", background: "#c4882a", color: "#0d0905", fontFamily: "'DM Mono',monospace", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#d4982e"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#c4882a"; }}
              >
                Shop All Collections
              </button>
              <button
                style={{ padding: "15px 40px", border: "1px solid rgba(196,136,42,0.35)", background: "transparent", color: "#c4882a", fontFamily: "'DM Mono',monospace", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "border-color 0.2s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(196,136,42,0.9)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(196,136,42,0.35)"; }}
              >
                Our Artisans
              </button>
            </div>
            <div style={{ marginTop: 80, paddingTop: 28, borderTop: "1px solid rgba(196,136,42,0.1)" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", color: "#c4882a", fontSize: "1.35rem", letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 400 }}>
                Urithi
              </div>
              <div style={{ marginTop: 8, fontFamily: "'DM Mono',monospace", color: "#3a2510", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Nairobi &nbsp;·&nbsp; Accra &nbsp;·&nbsp; Cape Town &nbsp;·&nbsp; London
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Sticky navigation ─────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 32px",
        background: navSolid ? "rgba(13,9,5,0.95)" : "transparent",
        backdropFilter: navSolid ? "blur(20px)" : "none",
        borderBottom: navSolid ? "1px solid rgba(196,136,42,0.11)" : "none",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
        animation: "fadeIn 0.8s ease 0.5s both",
      }}>
        <div style={{ fontFamily: "'Playfair Display',serif", color: "#c4882a", fontSize: "1.15rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 400 }}>
          Urithi
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {([ ["East Africa","#east"], ["West Africa","#west"], ["South Africa","#south"] ] as [string,string][]).map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{ fontFamily: "'DM Mono',monospace", color: "#a08060", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#c4882a"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#a08060"; }}
            >
              {label}
            </a>
          ))}
        </div>
        <button
          style={{ padding: "9px 22px", background: "transparent", border: "1px solid rgba(196,136,42,0.38)", color: "#c4882a", fontFamily: "'DM Mono',monospace", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", transition: "border-color 0.2s ease" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(196,136,42,0.9)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(196,136,42,0.38)"; }}
        >
          ✦ Commission
        </button>
      </nav>

      {/* ── Product Modal ─────────────────────────────────────────────────── */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}