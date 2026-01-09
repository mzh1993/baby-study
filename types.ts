
export interface WordItem {
  id: string;
  text: string;
  pinyin?: string;
  category: string;
}

export interface SongItem {
  id: string;
  title: string;
  content: string[];
}

export interface ProgressData {
  masteredWords: string[]; // 已掌握
  learningWords: string[]; // 正在学
  readSongs: string[]; // 已读儿歌
  lastPlayed: string; // 最后游玩日期
  dailyGoalProgress: number; // 今日学习数量
  lastStudyDate: string; // YYYY-MM-DD
  wrongCounts: Record<string, number>; // 错题计数：字ID -> 错误次数
}

export type AppMode = 'HOME' | 'FLASHCARDS' | 'SONGS' | 'STATS' | 'LEARNING' | 'EXAM_SELECT' | 'EXAM_WORDS' | 'EXAM_SONGS';
