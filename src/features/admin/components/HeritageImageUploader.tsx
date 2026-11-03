import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  X,
  ExternalLink,
  AlertCircle,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { uploadAdminImage } from '../services/storageAdminService';

export interface HeritageImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  disabled?: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];

export const HeritageImageUploader: React.FC<HeritageImageUploaderProps> = ({
  value,
  onChange,
  folder = 'general',
  label,
  helperText,
  aspectRatio = 'video',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [directUrlInput, setDirectUrlInput] = useState(value || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal directUrlInput if value changes externally
  React.useEffect(() => {
    setDirectUrlInput(value || '');
  }, [value]);

  const aspectRatioClass =
    aspectRatio === 'video'
      ? 'aspect-video w-full'
      : aspectRatio === 'square'
      ? 'aspect-square w-full'
      : 'min-h-[180px] max-h-72 w-full';

  const handleProcessFile = useCallback(
    async (file: File) => {
      if (disabled || isUploading) return;

      // 1. Validate MIME type
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setErrorMessage(
          'Định dạng tệp không hợp lệ. Chỉ chấp nhận JPG, PNG, WebP, AVIF hoặc GIF.'
        );
        return;
      }

      // 2. Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          'Kích thước ảnh vượt quá giới hạn 5MB. Vui lòng nén ảnh hoặc chọn tệp khác.'
        );
        return;
      }

      setErrorMessage(null);
      setIsUploading(true);

      try {
        const uploadedUrl = await uploadAdminImage(file, folder);
        onChange(uploadedUrl);
        setMode('upload');
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không xác định khi tải ảnh lên.';
        setErrorMessage(message);
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, isUploading, folder, onChange]
  );

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  // Paste handler (Ctrl+V / Command+V)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (disabled || isUploading) return;

    // Check for pasted file
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          handleProcessFile(file);
          return;
        }
      }
    }

    // Check for pasted URL text
    const text = e.clipboardData.getData('text').trim();
    if (/^https?:\/\//i.test(text)) {
      e.preventDefault();
      setErrorMessage(null);
      onChange(text);
      setDirectUrlInput(text);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
    // Reset file input so user can re-select the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerFileInput = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setDirectUrlInput('');
    setErrorMessage(null);
  };

  const handleApplyDirectUrl = () => {
    const trimmed = directUrlInput.trim();
    onChange(trimmed);
    setErrorMessage(null);
  };

  return (
    <div className="w-full space-y-2">
      {/* Header Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-bold text-heritage-green dark:text-warm-ivory">
            {label}
          </label>
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          {mode === 'upload' ? (
            <button
              type="button"
              onClick={() => setMode('url')}
              disabled={disabled || isUploading}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-antique-gold hover:text-antique-gold/80 hover:underline cursor-pointer disabled:opacity-50"
              aria-label="Nhập link trực tiếp"
            >
              <LinkIcon className="w-3 h-3" />
              <span>Dán URL trực tiếp</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode('upload')}
              disabled={disabled || isUploading}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-antique-gold hover:text-antique-gold/80 hover:underline cursor-pointer disabled:opacity-50"
              aria-label="Tải tệp từ thiết bị"
            >
              <UploadCloud className="w-3 h-3" />
              <span>Tải tệp từ máy</span>
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_MIME_TYPES.join(',')}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
        aria-label="Tải lên tệp hình ảnh"
      />

      {/* Direct URL Input Mode */}
      {mode === 'url' ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={directUrlInput}
              onChange={(e) => setDirectUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyDirectUrl();
                }
              }}
              placeholder="https://images.unsplash.com/... hoặc link ảnh công khai"
              disabled={disabled || isUploading}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-antique-gold/40 bg-warm-ivory/50 dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleApplyDirectUrl}
              disabled={disabled || isUploading || !directUrlInput.trim()}
              className="px-3.5 py-2.5 bg-antique-gold text-stone-900 rounded-xl text-xs font-semibold hover:bg-antique-gold/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Áp dụng
            </button>
          </div>
          {value && (
            <div className="relative rounded-xl overflow-hidden border border-antique-gold/30 bg-stone-100 dark:bg-stone-900/60 max-h-48 flex items-center justify-center">
              <img
                src={value}
                alt="Preview"
                className="max-h-48 w-full object-contain"
                onError={() =>
                  setErrorMessage('Không thể tải trước hình ảnh từ liên kết này.')
                }
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-stone-900/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                aria-label="Xóa ảnh"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Dropzone / Upload Mode */
        <div
          tabIndex={disabled ? -1 : 0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !value) {
              e.preventDefault();
              handleTriggerFileInput();
            }
          }}
          className={`relative rounded-xl border-2 transition-all duration-200 outline-none select-none ${
            isDragging
              ? 'border-antique-gold bg-antique-gold/10 ring-2 ring-antique-gold/30'
              : value
              ? 'border-antique-gold/40 bg-warm-ivory/20 dark:bg-stone-900/40'
              : 'border-dashed border-antique-gold/40 hover:border-antique-gold/80 bg-warm-ivory/40 dark:bg-stone-900/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${aspectRatioClass}`}
          onClick={() => {
            if (!value && !isUploading) {
              handleTriggerFileInput();
            }
          }}
        >
          {/* State 3: Loading */}
          {isUploading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-950/70 backdrop-blur-xs rounded-xl p-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-antique-gold mb-2" />
              <p className="text-xs font-semibold text-warm-ivory">
                Đang tải ảnh lên Cloudflare R2...
              </p>
              <p className="text-[11px] text-warm-ivory/70 mt-1">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          )}

          {/* State 4: Success / Preview */}
          {value && !isUploading ? (
            <div className="relative w-full h-full rounded-xl overflow-hidden group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() =>
                  setErrorMessage('Không thể hiển thị ảnh từ URL hiện tại.')
                }
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-900/80 text-antique-gold truncate max-w-[200px]">
                    {value}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-stone-900/80 text-warm-ivory hover:text-antique-gold transition-colors"
                      title="Mở liên kết ảnh trong tab mới"
                      aria-label="Mở liên kết ảnh"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="p-1.5 rounded-lg bg-stone-900/80 text-warm-ivory hover:text-red-400 transition-colors"
                      title="Xóa ảnh này"
                      aria-label="Xóa ảnh"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerFileInput();
                    }}
                    disabled={disabled}
                    className="px-3 py-1.5 rounded-lg bg-antique-gold text-stone-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-antique-gold/90 transition-colors shadow-md cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Thay đổi ảnh</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* State 1 & 2: Default or Dragging (Empty state) */
            !isUploading && (
              <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-antique-gold/15 flex items-center justify-center text-antique-gold mb-3 transition-transform duration-200 group-hover:scale-105">
                  {isDragging ? (
                    <ImageIcon className="w-6 h-6 animate-pulse" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>
                <p className="text-xs font-semibold text-text-body dark:text-warm-ivory">
                  {isDragging
                    ? 'Thả tệp ảnh vào đây để tải lên...'
                    : 'Kéo & thả ảnh vào đây, hoặc bấm để chọn tệp'}
                </p>
                <p className="text-[11px] text-text-muted dark:text-warm-ivory/60 mt-1">
                  Có thể dán trực tiếp (Ctrl+V) tệp ảnh hoặc URL. Hỗ trợ JPG, PNG, WebP, AVIF, GIF (tối đa 5MB).
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* State 5: Error Message container */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-600 dark:text-red-400 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              handleTriggerFileInput();
            }}
            className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline shrink-0 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Helper text if provided */}
      {helperText && !errorMessage && (
        <p className="text-[11px] text-text-muted dark:text-warm-ivory/60">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default HeritageImageUploader;
