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
  return <section className="rp-activity" aria-label="Dictation activity">
    <h2>Write what you hear</h2>
    <p>Listen to the selected passage, then write it from memory. The transcript stays hidden until you check or reveal it.</p>
    <progress aria-label="Dictation passages matched" value={completed} max={total} />
    <small>{completed} of {total} passages matched</small>
    <form onSubmit={event => { event.preventDefault(); if (answer.text.trim()) onAnswer({ ...answer, result: checkDictation(segment.text, answer.text) }); }}>
      <label className="rp-field-label" htmlFor="practice-dictation-answer">Your transcription</label>
      <textarea id="practice-dictation-answer" rows={7} maxLength={Math.max(4000, segment.text.length * 2)} autoComplete="off" spellCheck={false} placeholder="Type the passage you hear…" value={answer.text} onChange={event => onAnswer({ ...answer, text: event.target.value, result: undefined })} />
      <button type="submit" className="rp-primary" disabled={!answer.text.trim()}>Check transcription</button>
    </form>
    <div className="rp-inline-actions">
      <button type="button" onClick={onListen}>Listen again</button>
      <button type="button" onClick={() => onAnswer({ ...answer, revealed: !answer.revealed })}>{answer.revealed ? 'Hide answer' : 'Reveal answer'}</button>
    </div>
    {answer.result && <div className={`rp-feedback ${answer.result.correct ? 'rp-correct' : ''}`} role="status">
      <strong>{answer.result.correct ? 'Your transcription matches.' : `Word match: ${answer.result.accuracy}%`}</strong>
      <p>Capitalisation and punctuation are ignored.</p>
    </div>}
    {(answer.revealed || answer.result) && <div className="rp-expected"><h3>Expected text</h3><p>{segment.text}</p></div>}
    {(answer.text || answer.result || answer.revealed) && <button type="button" className="rp-text-button" onClick={() => onAnswer({ text: '' })}>Try again</button>}
  </section>;
}
