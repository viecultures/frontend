import { useTranslation } from 'react-i18next';
import type { QuizQuestionItem } from '../../services/readerApiService';

export interface QuestionAnswer { value: string; checked?: boolean }
interface PracticeQuestionsProps {
  questions: QuizQuestionItem[];
  index: number;
  onChangeIndex: (index: number) => void;
  answers: Record<string, QuestionAnswer>;
  onAnswer: (id: string, answer: QuestionAnswer) => void;
  onTryDictation: () => void;
}

export function PracticeQuestions({ questions, index, onChangeIndex, answers, onAnswer, onTryDictation }: PracticeQuestionsProps) {
  const { t } = useTranslation('reader');
  const question = questions[index];
  if (!question) return <section className="rp-activity" aria-label={t('questions_tab.activity_aria', 'Questions activity')}>
    <h2>{t('questions_tab.keep_exploring_title', 'Keep exploring the story')}</h2>
    <p>{t('questions_tab.no_questions_desc', 'No questions are available for this article yet. Practise listening with its transcript instead.')}</p>
    <button type="button" className="rp-primary" onClick={onTryDictation}>{t('questions_tab.try_dictation', 'Try dictation')}</button>
  </section>;
  const id = question.id || String(index);
  const answer = answers[id] || { value: '' };
  const correct = answer.value === question.correctKey;
  const completed = questions.filter((q, i) => answers[q.id || String(i)]?.checked).length;
  return <section className="rp-activity" aria-label={t('questions_tab.activity_aria', 'Questions activity')}>
    <h2>{t('questions_tab.check_understanding', 'Check your understanding')}</h2>
    <p>{t('questions_tab.checked_progress', { completed, total: questions.length, defaultValue: `${completed} of ${questions.length} checked` })}</p>
    <progress aria-label={t('questions_tab.progress_aria', 'Questions checked')} value={completed} max={questions.length} />
    <fieldset className="rp-question">
      <legend>
        <small>{t('questions_tab.question_legend', { current: index + 1, total: questions.length, defaultValue: `Question ${index + 1} of ${questions.length}` })}</small>
        {question.question}
      </legend>
      {question.options.map(option => <label key={option.key} className="rp-option" data-selected={answer.value === option.key}>
        <input type="radio" name={`practice-${id}`} value={option.key} checked={answer.value === option.key} onChange={() => onAnswer(id, { value: option.key })} />
        <span><strong>{option.key}.</strong> {option.text}</span>
      </label>)}
    </fieldset>
    <button type="button" className="rp-primary" disabled={!answer.value} onClick={() => onAnswer(id, { ...answer, checked: true })}>{t('questions_tab.check_answer', 'Check answer')}</button>
    {answer.checked && <div className={`rp-feedback ${correct ? 'rp-correct' : ''}`} role="status">
      <strong>{correct ? t('questions_tab.correct_feedback', 'Correct. Well done!') : t('questions_tab.incorrect_feedback', { key: question.correctKey, defaultValue: `The correct answer is ${question.correctKey}.` })}</strong>
      {question.explanation && <p>{question.explanation}</p>}
    </div>}
    <div className="rp-navigation">
      <button type="button" disabled={index === 0} onClick={() => onChangeIndex(index - 1)}>{t('questions_tab.previous_question', 'Previous question')}</button>
      <button type="button" disabled={index === questions.length - 1} onClick={() => onChangeIndex(index + 1)}>{t('questions_tab.next_question', 'Next question')}</button>
    </div>
  </section>;
}
