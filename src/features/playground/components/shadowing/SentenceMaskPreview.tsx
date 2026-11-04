import React from 'react';
import type { TokenizedSentence } from '../../lib/dictationTokenizer';
import type { RevealSource } from '../../hooks/useLetterRevealDictation';

interface SentenceMaskPreviewProps {
  tokenized: TokenizedSentence;
  openedMap: Record<number, RevealSource>;
  isAnswerRevealed: boolean;
}

export const SentenceMaskPreview: React.FC<SentenceMaskPreviewProps> = ({
  tokenized,
  openedMap,
  isAnswerRevealed,
}) => {
  return (
    <div className="vc-dictation-sentence-preview" aria-hidden="true">
      <div className="vc-dictation-preview-text">
        {tokenized.words.map((word) => {
          // If word has no typeable characters (e.g. only punctuation)
          if (!word.hasTypeable) {
            return (
              <span key={word.wordIndex} className="vc-dictation-preview-word">
                {word.rawWord}
              </span>
            );
          }

          // Check token states for this word
          const allTokensRevealed = isAnswerRevealed || word.tokens.every((t) => !t.isTypeable || openedMap[t.tokenIndex]);
          const someTokensRevealed = word.tokens.some((t) => t.isTypeable && openedMap[t.tokenIndex]);

          if (allTokensRevealed) {
            return (
              <span key={word.wordIndex} className="vc-dictation-preview-word">
                {word.rawWord}
              </span>
            );
          }

          if (someTokensRevealed) {
            // Render characters that are revealed, and replace unrevealed with an underscore
            return (
              <span key={word.wordIndex} className="vc-dictation-preview-word">
                {word.tokens.map((t) => {
                  if (!t.isTypeable || openedMap[t.tokenIndex]) {
                    return <span key={t.id}>{t.rawChar}</span>;
                  }
                  return (
                    <span key={t.id} className="vc-dictation-preview-unopened">
                      _
                    </span>
                  );
                })}
              </span>
            );
          }

          // Entire word is unrevealed -> render placeholder dashes matching character count
          const placeholder = word.tokens
            .map((t) => (t.isTypeable ? '_' : t.rawChar))
            .join(' ');

          return (
            <span key={word.wordIndex} className="vc-dictation-preview-unopened">
              {placeholder}
            </span>
          );
        })}
      </div>
      <div className="vc-dictation-preview-caption">
        Letters appear as you type correctly.
      </div>
    </div>
  );
};
