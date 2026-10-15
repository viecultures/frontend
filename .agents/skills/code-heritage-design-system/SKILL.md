---
name: code-heritage-design-system
description: Guide for applying VieCultures' Warm Heritage editorial design tokens, serif typography, and tactile UI components.
---

# Warm Heritage Design System Guide

Establishes the visual identity, tokens, and components for VieCultures.

## Directives
1. **Color Tokens (Tailwind v4 Theme):**
   * Primary Background: `bg-warm-ivory` (`#FBF7EE` - Vietnamese Giấy Dó paper texture)
   * Secondary Background: `bg-rice-paper` (`#F6EEDC` - Card & drawer backgrounds)
   * Heritage Accent: `text-heritage-green`, `bg-heritage-green` (`#1E4B43` - Traditional temple & lacquer green)
   * Deep Forest: `bg-heritage-forest` (`#122A22` - Footer and dark accents)
   * Imperial Gold: `text-antique-gold`, `border-antique-gold` (`#D9B76A` - Highlights, badges, gold trim)
   * Crimson Accent: `text-heritage-red`, `bg-heritage-red` (`#9E2A2B` - Seals, cultural callouts)

2. **Typography Rules:**
   * Page Titles, Article Headers, and Brand: `'Playfair Display', Georgia, serif` (`font-heading`)
   * Body Copy, Bilingual Reading Paragraphs: `Inter, sans-serif` (`font-sans`), line-height relaxed (`leading-relaxed`), text size >= `text-base` for comfortable reading.
   * Cultural Annotations / Pronunciation: Italicized with subtle gold or warm gray secondary color.

3. **Tactile Card Style:**
   ```html
   <div className="bg-[#F6EEDC] border border-[#D9B76A]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
     <h2 className="font-heading text-2xl text-[#1E4B43]">Tiêu Đề Bài Đọc</h2>
     <p className="text-stone-700 mt-2 font-sans leading-relaxed">Nội dung câu chuyện di sản...</p>
   </div>
   ```
