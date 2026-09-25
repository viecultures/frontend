export interface StudyTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface UserHomeMetrics {
  streakDays: number;
  completedLessonsCount: number;
  masteredVocabCount: number;
  reflectionsSharedCount: number;
}

export const INITIAL_STUDY_TASKS: StudyTask[] = [
  { id: 'task1', label: 'Trang phòng học cá nhân (Home Dashboard)', completed: true },
  { id: 'task2', label: 'Bản đồ di sản Việt Nam 5 vùng miền', completed: true },
  { id: 'task3', label: 'Nền phòng học đổi theo buổi (Sáng / Trưa / Tối)', completed: true },
  { id: 'task4', label: 'Ôn 10 từ vựng Spaced Repetition hôm nay', completed: false },
  { id: 'task5', label: 'Đọc bài đọc cặp đoạn "Dong Ho Woodcut Paintings"', completed: false },
];

export const INITIAL_USER_METRICS: UserHomeMetrics = {
  streakDays: 5,
  completedLessonsCount: 14,
  masteredVocabCount: 86,
  reflectionsSharedCount: 3,
};
