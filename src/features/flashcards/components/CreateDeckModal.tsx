import { X } from "lucide-react";

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  customDeckName: string;
  onChangeDeckName: (name: string) => void;
  onCreateDeck: () => void;
}

export function CreateDeckModal({
  isOpen,
  onClose,
  customDeckName,
  onChangeDeckName,
  onCreateDeck,
}: CreateDeckModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="font-serif text-lg font-bold text-[#1E4B43]">
            Tạo Bộ Từ Vựng Mới
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-[#6E7E79]">
            Tên bộ từ vựng cá nhân:
          </label>
          <input
            type="text"
            value={customDeckName}
            onChange={(e) => onChangeDeckName(e.target.value)}
            placeholder="Ví dụ: Từ vựng Ôn thi IELTS 7.0..."
            className="w-full px-4 py-2.5 rounded-2xl bg-[#F6EEDC]/60 border border-[rgba(30,75,67,0.2)] text-xs text-[#1E4B43] font-bold focus:outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E7E79] hover:bg-gray-100 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onCreateDeck}
            className="px-5 py-2 rounded-xl bg-[#059669] text-white text-xs font-bold hover:bg-[#047857] cursor-pointer"
          >
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  );
}
