import React from 'react';
import { Keyboard } from 'lucide-react';
import type { TokenizedSentence, StaticToken } from '../../lib/dictationTokenizer';
import type { RevealSource } from '../../hooks/useLetterRevealDictation';

interface LetterTileGridProps {
  tokenized: TokenizedSentence;
  cursorIndex: number;
  openedMap: Record<number, RevealSource>;
  isShaking: boolean;
  isAnswerRevealed: boolean;
  onZoneClick: () => void;
}

export const LetterTileGrid: React.FC<LetterTileGridProps> = ({
  tokenized,
  cursorIndex,
  openedMap,
  isShaking,
  isAnswerRevealed,
  onZoneClick,
}) => {
  const renderTokenTile = (token: StaticToken) => {
    // Punctuation token
    if (token.isPunctuation) {
      return (
        <span key={token.id} className="vc-dictation-tile punctuation">
          {token.rawChar}
        </span>
      );
    }

    // Space token (should rarely appear inside word, but just in case)
    if (token.isSpace) {
      return null;
    }

    const isCursor = cursorIndex === token.tokenIndex && !isAnswerRevealed;
    const revealSource = openedMap[token.tokenIndex];

    let tileClass = 'vc-dictation-tile';
    let content: React.ReactNode = null;

    if (isAnswerRevealed) {
      if (revealSource === 'typed') {
        tileClass += ' matched';
      } else if (revealSource === 'hinted') {
        tileClass += ' hinted';
      } else {
        tileClass += ' revealed-untyped';
      }
      content = token.rawChar;
    } else if (revealSource === 'typed') {
      tileClass += ' matched';
      content = token.rawChar;
    } else if (revealSource === 'hinted') {
      tileClass += ' hinted';
      content = token.rawChar;
    } else if (isCursor) {
      tileClass += ' active';
      if (isShaking) {
        tileClass += ' shake';
      }
      content = null;
    } else {
      // Upcoming
      tileClass += ' upcoming';
      content = '·';
    }

    return (
      <span key={token.id} className={tileClass}>
        {content}
      </span>
    );
  };

  return (
    <div
      className="vc-dictation-interactive-zone"
      onClick={onZoneClick}
      role="region"
      aria-label="Khu vực gõ chữ"
    >
      <div className="vc-dictation-tile-grid">
        {tokenized.words.map((word) => (
          <div key={word.wordIndex} className="vc-dictation-word-cluster">
            {word.tokens.map(renderTokenTile)}
          </div>
        ))}
      </div>

      <div className="vc-dictation-type-hint">
        <Keyboard size={14} />
        <span>Click here and start typing</span>
      </div>
    </div>
  );
};
