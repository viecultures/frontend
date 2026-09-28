import { ShoppingBag } from "lucide-react";

interface GamificationShopCardProps {
  userCoins: number;
  onRedeem: (itemName: string, cost: number) => void;
}

export function GamificationShopCard({
  userCoins,
  onRedeem,
}: GamificationShopCardProps) {
  return (
    <div
      id="gamification-shop"
      className="p-6 rounded-3xl bg-rice-paper border border-heritage-green/12 space-y-5 shadow-sm"
    >
      <div className="flex items-center justify-between pb-3 border-b border-heritage-green/10">
        <h3 className="font-serif text-base font-bold text-heritage-green flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-antique-gold" />
          Cửa Hàng Xu & Đổi Quà
        </h3>
        <span className="text-xs font-bold text-[#059669]">
          Ví: 💎 {userCoins} Xu
        </span>
      </div>

      {/* Item 1 */}
      <div className="space-y-1.5 pb-3 border-b border-heritage-green/10">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-heritage-green">
            🎧 Giọng Đọc AI Premium
          </h4>
          <button
            onClick={() => onRedeem("Giọng Đọc Premium", 300)}
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-heritage-green text-warm-ivory hover:bg-heritage-dark cursor-pointer focus-ring"
          >
            💎 300 Xu
          </button>
        </div>
        <p className="text-[11px] text-text-secondary">
          Mở khóa giọng đọc bản ngữ chuẩn Anh - Mỹ cho toàn bộ bài học.
        </p>
      </div>

      {/* Item 2 */}
      <div className="space-y-1.5 pb-3 border-b border-heritage-green/10">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-heritage-green">
            🎨 Giao Diện Paper Vintage Theme
          </h4>
          <button
            onClick={() => onRedeem("Giao Diện Paper Theme", 400)}
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-heritage-green text-warm-ivory hover:bg-heritage-dark cursor-pointer focus-ring"
          >
            💎 400 Xu
          </button>
        </div>
        <p className="text-[11px] text-text-secondary">
          Theme giấy da ngà hoài cổ sang trọng cho giao diện Reader.
        </p>
      </div>

      {/* Item 3 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-heritage-green">
            🎖️ Huy Hiệu "Cây Bút Di Sản"
          </h4>
          <button
            onClick={() => onRedeem("Huy hiệu Cây Bút Di Sản", 200)}
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-heritage-green text-warm-ivory hover:bg-heritage-dark cursor-pointer focus-ring"
          >
            💎 200 Xu
          </button>
        </div>
        <p className="text-[11px] text-text-secondary">
          Huy hiệu đặc biệt hiển thị trên trang Profile và góc bình luận.
        </p>
      </div>
    </div>
  );
}
