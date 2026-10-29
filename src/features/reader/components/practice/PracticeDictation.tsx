import { useTranslation } from 'react-i18next';
import { checkDictation, type DictationAnswer, type PracticeSegment } from '../../lib/readerPractice';

interface PracticeDictationProps {
  segment: PracticeSegment;
  answer: DictationAnswer;
  onAnswer: (answer: DictationAnswer) => void;
  onListen: () => void;
  completed: number;
  total: number;
}

export function PracticeDictation({ segment, answer, onAnswer, onListen, completed, total }: PracticeDictationProps) {
  const { t } = useTranslation('reader');
  return <section className="rp-activity" aria-label={t('dictation_tab.activity_aria', 'Dictation activity')}>
    <h2>{t('dictation_tab.title', 'Write what you hear')}</h2>
    <p>{t('dictation_tab.description', 'Listen to the selected passage, then write it from memory. The transcript stays hidden until you check or reveal it.')}</p>
    <progress aria-label={t('dictation_tab.progress_aria', 'Dictation passages matched')} value={completed} max={total} />
    <small>{t('dictation_tab.matched_progress', { completed, total, defaultValue: `${completed} of ${total} passages matched` })}</small>
    <form onSubmit={event => { event.preventDefault(); if (answer.text.trim()) onAnswer({ ...answer, result: checkDictation(segment.text, answer.text) }); }}>
      <label className="rp-field-label" htmlFor="practice-dictation-answer">{t('dictation_tab.your_transcription', 'Your transcription')}</label>
      <textarea id="practice-dictation-answer" rows={7} maxLength={Math.max(4000, segment.text.length * 2)} autoComplete="off" spellCheck={false} placeholder={t('dictation_tab.placeholder', 'Type the passage you hear…')} value={answer.text} onChange={event => onAnswer({ ...answer, text: event.target.value, result: undefined })} />
      <button type="submit" className="rp-primary" disabled={!answer.text.trim()}>{t('dictation_tab.check_transcription', 'Check transcription')}</button>
    </form>
    <div className="rp-inline-actions">
      <button type="button" onClick={onListen}>{t('dictation_tab.listen_again', 'Listen again')}</button>
      <button type="button" onClick={() => onAnswer({ ...answer, revealed: !answer.revealed })}>{answer.revealed ? t('dictation_tab.hide_answer', 'Hide answer') : t('dictation_tab.reveal_answer', 'Reveal answer')}</button>
    </div>
    {answer.result && <div className={`rp-feedback ${answer.result.correct ? 'rp-correct' : ''}`} role="status">
      <strong>{answer.result.correct ? t('dictation_tab.transcription_matches', 'Your transcription matches.') : t('dictation_tab.word_match', { percent: answer.result.accuracy, defaultValue: `Word match: ${answer.result.accuracy}%` })}</strong>
      <p>{t('dictation_tab.ignored_note', 'Capitalisation and punctuation are ignored.')}</p>
    </div>}
    {(answer.revealed || answer.result) && <div className="rp-expected"><h3>{t('dictation_tab.expected_text', 'Expected text')}</h3><p>{segment.text}</p></div>}
    {(answer.text || answer.result || answer.revealed) && <button type="button" className="rp-text-button" onClick={() => onAnswer({ text: '' })}>{t('dictation_tab.try_again', 'Try again')}</button>}
  </section>;
}
