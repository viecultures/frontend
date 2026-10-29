import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { StudyTask } from '../lib/studyRoomStorage';

export type TaskItem = StudyTask;
interface HomeWidgetsGridProps {
  tasks: StudyTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (label: string) => void;
}

export function HomeWidgetsGrid({ tasks, onToggleTask, onAddTask }: HomeWidgetsGridProps) {
  const { t } = useTranslation('home');
  const [newTaskText, setNewTaskText] = useState('');
  const completed = tasks.filter(task => task.completed).length;

  return <section className="home-room-plan home-room-panel" aria-labelledby="home-plan-title">
    <div className="home-room-section-heading">
      <div>
        <p className="home-room-eyebrow">{t('study_plan.eyebrow', 'ONE SMALL STEP')}</p>
        <h2 id="home-plan-title">{t('study_plan.title', 'Your study plan')}</h2>
      </div>
      {tasks.length > 0 && <span className="home-room-task-count">{completed}/{tasks.length}</span>}
    </div>
    {tasks.length ? <ul className="home-room-tasks">{tasks.map(task => <li key={task.id}>
      <label>
        <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} />
        <span className={task.completed ? 'home-room-task-done' : ''}>{task.label}</span>
        {task.completed && <Check size={14} aria-hidden="true" />}
      </label>
    </li>)}</ul> : <p>{t('study_plan.empty_desc', 'Keep a little intention for today. Add a story to read or a few words to practise.')}</p>}
    <form className="home-room-task-form" onSubmit={event => {
      event.preventDefault();
      if (!newTaskText.trim()) return;
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }}>
      <input
        type="text"
        value={newTaskText}
        onChange={event => setNewTaskText(event.target.value)}
        maxLength={180}
        placeholder={t('study_plan.input_placeholder', 'Add a small goal…')}
        aria-label={t('study_plan.input_aria', 'New study goal')}
      />
      <button type="submit" className="home-room-icon" disabled={!newTaskText.trim()} aria-label={t('study_plan.btn_add_aria', 'Add study goal')}>
        <Plus size={18} />
      </button>
    </form>
    <p className="home-room-footnote">{t('study_plan.footnote', 'Your plan stays saved in this browser.')}</p>
  </section>;
}
