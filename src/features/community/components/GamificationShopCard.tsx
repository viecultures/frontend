import { ShoppingBag, Coins, Headphones, Palette, Medal, Sparkles, Check } from "lucide-react";

interface GamificationShopCardProps {
  userCoins: number;
  onRedeem: (itemName: string, cost: number) => void;
}

const SHOP_ITEMS = [
  {
    id: "ai-audio",
    name: "Giọng Đọc AI Premium",
    cost: 300,
    icon: Headphones,
    desc: "Mở khóa giọng đọc bản ngữ chuẩn Anh - Mỹ cho toàn bộ bài học di sản.",
    tag: "Âm Thanh",
  },
  {
    id: "vintage-theme",
    name: "Giao Diện Giấy Dó Vintage",
    cost: 400,
    icon: Palette,
    desc: "Theme giấy Dó ngà hoàng gia sang trọng cho giao diện Reader.",
    tag: "Giao Diện",
  },
  {
    id: "badge-scribe",
    name: "Huy Hiệu 'Cây Bút Di Sản'",
    cost: 200,
    icon: Medal,
    desc: "Huy hiệu đặc biệt hiển thị trên trang Profile và góc bài viết cảm nhận.",
    tag: "Danh Hiệu",
  },
];

export function GamificationShopCard({
  userCoins,
  onRedeem,
}: GamificationShopCardProps) {
  return (
    <div
      id="gamification-shop"
      className="p-6 rounded-3xl bg-surface border border-line space-y-5 shadow-sm"
    >
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <h3 className="font-serif text-base font-bold text-heritage-green flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-antique-gold" />
          <span>Cửa Hàng Xu & Đổi Quà</span>
        </h3>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <Coins className="w-3.5 h-3.5 text-antique-gold" />
          <span>Ví: {userCoins} Xu</span>
        </span>
      </div>

      <div className="space-y-4">
        {SHOP_ITEMS.map((item) => {
          const IconComp = item.icon;
          const canAfford = userCoins >= item.cost;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-rice-paper/60 border border-line space-y-2 hover:bg-rice-paper transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-heritage-green text-antique-gold flex items-center justify-center border border-antique-gold/30 shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-heritage-green">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-antique-rich font-semibold uppercase">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRedeem(item.name, item.cost)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer focus-ring ${
                    canAfford
                      ? "bg-heritage-green text-warm-ivory hover:bg-heritage-dark shadow-sm"
                      : "bg-surface text-text-secondary border border-line hover:bg-mist-cloud"
                  }`}
                >
                  <Coins className="w-3 h-3 text-antique-gold" />
                  <span>{item.cost} Xu</span>
                </button>
              </div>

              <p className="text-[11px] text-text-secondary leading-relaxed pl-10">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
