
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppMode, ProgressData, WordItem, SongItem } from './types.ts';
import { APP_WORDS, APP_SONGS, COLORS } from './constants.ts';
import { speakText, generateWordImage } from './services/geminiService.ts';

// --- Components ---
// (保留之前优化过的所有组件代码...)
// [由于内容较多，此处省略重复的组件代码，实际操作中请确保 App.tsx 包含完整的逻辑]

const Header: React.FC<{ title: string; onBack?: () => void }> = ({ title, onBack }) => (
  <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm p-4 flex items-center z-50">
    {onBack && (
      <button onClick={onBack} className="mr-4 text-2xl text-blue-500 active:scale-90 transition-transform">
        ⬅️
      </button>
    )}
    <h1 className="text-2xl font-bold text-center flex-grow text-pink-500 font-['ZCOOL_KuaiLe']">{title}</h1>
  </header>
);

const Footer: React.FC<{ activeMode: AppMode; setMode: (m: AppMode) => void }> = ({ activeMode, setMode }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-yellow-100 flex justify-around p-2 pb-6 z-50">
    <button onClick={() => setMode('HOME')} className={`flex flex-col items-center pt-2 transition-colors ${activeMode === 'HOME' ? 'text-pink-500' : 'text-gray-400'}`}>
      <span className="text-2xl">🏠</span>
      <span className="text-xs mt-1 font-bold">首页</span>
    </button>
    <button onClick={() => setMode('FLASHCARDS')} className={`flex flex-col items-center pt-2 transition-colors ${activeMode === 'FLASHCARDS' ? 'text-pink-500' : 'text-gray-400'}`}>
      <span className="text-2xl">🃏</span>
      <span className="text-xs mt-1 font-bold">识字</span>
    </button>
    <button onClick={() => setMode('SONGS')} className={`flex flex-col items-center pt-2 transition-colors ${activeMode === 'SONGS' ? 'text-pink-500' : 'text-gray-400'}`}>
      <span className="text-2xl">🎵</span>
      <span className="text-xs mt-1 font-bold">儿歌</span>
    </button>
    <button onClick={() => setMode('STATS')} className={`flex flex-col items-center pt-2 transition-colors ${activeMode === 'STATS' ? 'text-pink-500' : 'text-gray-400'}`}>
      <span className="text-2xl">📊</span>
      <span className="text-xs mt-1 font-bold">家长中心</span>
    </button>
  </nav>
);

const Confetti: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div key={i} className="absolute animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s`, fontSize: `${20 + Math.random() * 30}px` }}>
        {['🎉', '✨', '🎈', '🍭', '🌸'][Math.floor(Math.random() * 5)]}
      </div>
    ))}
  </div>
);

export default function App() {
  const [mode, setMode] = useState<AppMode>('HOME');
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem('baby_study_progress_v2');
    if (saved) return JSON.parse(saved);
    return { masteredWords: [], learningWords: [], readSongs: [], lastPlayed: '', dailyGoalProgress: 0, lastStudyDate: new Date().toISOString().split('T')[0], wrongCounts: {} };
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastStudyDate !== today) {
      setProgress(prev => ({ ...prev, lastStudyDate: today, dailyGoalProgress: 0 }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('baby_study_progress_v2', JSON.stringify(progress));
  }, [progress]);

  const triggerSuccess = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const updateWordProgress = (id: string, status: 'mastered' | 'learning' | 'wrong') => {
    setProgress(prev => {
      const mastered = new Set(prev.masteredWords);
      const learning = new Set(prev.learningWords);
      const wrongCounts = { ...prev.wrongCounts };
      let dailyInc = 0;
      if (status === 'mastered') {
        if (!mastered.has(id)) { mastered.add(id); dailyInc = 1; triggerSuccess(); }
        learning.delete(id);
      } else if (status === 'learning') {
        learning.add(id); mastered.delete(id);
      } else if (status === 'wrong') {
        wrongCounts[id] = (wrongCounts[id] || 0) + 1; learning.add(id); mastered.delete(id);
      }
      return { ...prev, masteredWords: Array.from(mastered), learningWords: Array.from(learning), wrongCounts, dailyGoalProgress: prev.dailyGoalProgress + dailyInc };
    });
  };

  const markSongAsRead = (id: string) => {
    setProgress(prev => {
      const read = new Set(prev.readSongs);
      const isNew = !read.has(id);
      if (isNew) { read.add(id); triggerSuccess(); }
      return { ...prev, readSongs: Array.from(read), dailyGoalProgress: prev.dailyGoalProgress + (isNew ? 1 : 0) };
    });
  };

  return (
    <div className="min-h-screen pb-24 pt-16 bg-[#FFFBEB] select-none transition-colors duration-500">
      {showConfetti && <Confetti />}
      {mode === 'HOME' && <HomeScreen setMode={setMode} progress={progress} />}
      {mode === 'FLASHCARDS' && <FlashcardsScreen words={APP_WORDS} progress={progress} onUpdate={updateWordProgress} onBack={() => setMode('HOME')} />}
      {mode === 'SONGS' && <SongsScreen songs={APP_SONGS} progress={progress} onRead={markSongAsRead} onBack={() => setMode('HOME')} />}
      {mode === 'STATS' && <StatsScreen progress={progress} />}
      {mode === 'EXAM_SELECT' && (
        <div className="p-6 pt-20">
          <Header title="亲子大挑战" onBack={() => setMode('HOME')} />
          <div className="space-y-6">
            <button onClick={() => setMode('EXAM_WORDS')} className="w-full bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-orange-400 flex flex-col items-center transition-transform active:scale-95">
              <span className="text-7xl mb-4">🎈</span>
              <span className="text-3xl font-bold text-orange-600">识字小标兵</span>
              <span className="text-gray-400 mt-2 font-bold">点击正确图画</span>
            </button>
            <button onClick={() => setMode('EXAM_SONGS')} className="w-full bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-pink-400 flex flex-col items-center transition-transform active:scale-95">
              <span className="text-7xl mb-4">🎤</span>
              <span className="text-3xl font-bold text-pink-600">儿歌小专家</span>
              <span className="text-gray-400 mt-2 font-bold">听音找句子</span>
            </button>
          </div>
        </div>
      )}
      {mode === 'EXAM_WORDS' && <ExamWordsScreen onBack={() => setMode('EXAM_SELECT')} words={APP_WORDS} progress={progress} onUpdate={updateWordProgress} />}
      {mode === 'EXAM_SONGS' && <ExamSongsScreen onBack={() => setMode('EXAM_SELECT')} songs={APP_SONGS} progress={progress} onRead={markSongAsRead} />}
      <Footer activeMode={mode} setMode={setMode} />
    </div>
  );
}

// ... 辅助屏幕组件 (HomeScreen, FlashcardsScreen, SongsScreen, StatsScreen, ExamWordsScreen, ExamSongsScreen)
// 此处内容省略，请保持原有的完整实现代码 ...
// 重要：确保内部导入了 ./types.ts, ./constants.ts 等。

function HomeScreen({ setMode, progress }: { setMode: (m: AppMode) => void; progress: ProgressData }) {
  const dailyGoal = 10;
  const dailyPercent = Math.min(100, (progress.dailyGoalProgress / dailyGoal) * 100);
  return (
    <div className="p-6 space-y-6">
      <Header title="宝贝趣学堂" />
      <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border-2 border-pink-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700">亲子十分钟 👨‍👩‍👧</h2>
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold">今日目标 {progress.dailyGoalProgress}/{dailyGoal}</span>
        </div>
        <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-pink-400 to-red-400 transition-all duration-1000 relative" style={{ width: `${dailyPercent}%` }}>
            {dailyPercent > 10 && <span className="absolute right-2 top-0.5 text-xs text-white font-bold">✨</span>}
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-3 text-center font-bold">{dailyPercent === 100 ? "🎉 太棒了！今日目标已达成！" : "每天陪伴十分钟，宝宝进步看得见"}</p>
      </div>
      <button onClick={() => setMode('EXAM_SELECT')} className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-orange-700 flex items-center justify-between text-white transition-all active:translate-y-1 active:border-b-4 bouncy">
        <div className="text-left">
          <h2 className="text-3xl font-bold mb-1">开始挑战 🏆</h2>
          <p className="opacity-90 font-bold">赢取今日勋章</p>
        </div>
        <span className="text-6xl">🌟</span>
      </button>
      <div className="grid grid-cols-2 gap-5">
        <button onClick={() => setMode('FLASHCARDS')} className="aspect-square bg-blue-400 rounded-[2.5rem] flex flex-col items-center justify-center text-white shadow-xl border-b-[10px] border-blue-600 active:translate-y-1 active:border-b-4 transition-all">
          <span className="text-6xl mb-3">🎈</span>
          <span className="text-2xl font-bold">快乐识字</span>
        </button>
        <button onClick={() => setMode('SONGS')} className="aspect-square bg-pink-400 rounded-[2.5rem] flex flex-col items-center justify-center text-white shadow-xl border-b-[10px] border-pink-600 active:translate-y-1 active:border-b-4 transition-all">
          <span className="text-6xl mb-3">🎵</span>
          <span className="text-2xl font-bold">儿歌大王</span>
        </button>
      </div>
    </div>
  );
}

function FlashcardsScreen({ words, progress, onUpdate, onBack }: { words: WordItem[]; progress: ProgressData; onUpdate: (id: string, s: 'mastered'|'learning') => void; onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visual, setVisual] = useState<string>("✨");
  const currentWord = words[currentIndex];
  useEffect(() => {
    const loadVisual = async () => {
      const v = await generateWordImage(currentWord.text);
      setVisual(v || "✨");
      speakText(currentWord.text);
    };
    loadVisual();
  }, [currentIndex, currentWord.text]);
  const handleNext = () => setCurrentIndex(prev => (prev + 1) % words.length);
  const handlePrev = () => setCurrentIndex(prev => (prev - 1 + words.length) % words.length);
  const isMastered = progress.masteredWords.includes(currentWord.id);
  const isLearning = progress.learningWords.includes(currentWord.id);
  return (
    <div className="p-4 flex flex-col items-center">
      <Header title="识字气球" onBack={onBack} />
      <div className="w-full max-w-sm mt-8">
        <div className={`aspect-[3/4] rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 bg-white relative overflow-hidden border-8 transition-colors duration-500 ${COLORS[currentIndex % COLORS.length].replace('bg-', 'border-')}`}>
          <div className="flex-1 flex items-center justify-center w-full"><div className="text-[10rem] drop-shadow-xl animate-pulse">{visual}</div></div>
          <div className="mt-4 text-center"><h2 className="text-7xl font-bold text-gray-800 tracking-widest">{currentWord.text}</h2></div>
          <button onClick={() => speakText(currentWord.text)} className="mt-6 bg-yellow-400 p-4 rounded-full text-4xl shadow-md border-b-4 border-yellow-600 active:translate-y-1 active:border-b-0">🔊</button>
        </div>
      </div>
      <div className="mt-8 flex gap-4 w-full max-w-sm px-2">
        <button onClick={handlePrev} className="flex-1 py-4 bg-white border-b-4 border-blue-200 rounded-3xl text-blue-500 text-xl font-black active:translate-y-1 active:border-b-0 transition-all shadow-md flex items-center justify-center gap-2"><span>⬅️</span> 上一张</button>
        <button onClick={handleNext} className="flex-1 py-4 bg-white border-b-4 border-blue-200 rounded-3xl text-blue-500 text-xl font-black active:translate-y-1 active:border-b-0 transition-all shadow-md flex items-center justify-center gap-2">下一张 <span>➡️</span></button>
      </div>
      <div className="mt-6 flex gap-4 w-full max-w-sm px-2">
        <button onClick={() => { speakText("还在努力学呢"); onUpdate(currentWord.id, 'learning'); }} className={`flex-1 py-5 rounded-[2rem] text-white text-xl font-black transition-all shadow-lg border-b-8 ${isLearning ? 'bg-orange-500 border-orange-700 scale-105 ring-4 ring-orange-200' : 'bg-gray-300 border-gray-400 active:translate-y-1 active:border-b-4'}`}>学习中 🧐</button>
        <button onClick={() => { speakText("你太棒了，学会啦！"); onUpdate(currentWord.id, 'mastered'); setTimeout(handleNext, 1000); }} className={`flex-1 py-5 rounded-[2rem] text-white text-xl font-black transition-all shadow-lg border-b-8 ${isMastered ? 'bg-green-500 border-green-700 scale-105 ring-4 ring-green-200' : 'bg-green-400 border-green-600 active:translate-y-1 active:border-b-4'}`}>学会啦! 🏆</button>
      </div>
    </div>
  );
}

function SongsScreen({ songs, progress, onRead, onBack }: { songs: SongItem[]; progress: ProgressData; onRead: (id: string) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<SongItem | null>(null);
  if (selected) {
    return (
      <div className="p-4 bg-blue-50 min-h-screen">
        <Header title={selected.title} onBack={() => setSelected(null)} />
        <div className="mt-8 bg-white p-8 rounded-[2.5rem] shadow-xl border-t-8 border-pink-400">
          <div className="space-y-4">{selected.content.map((line, idx) => (<p key={idx} className="text-3xl text-center leading-relaxed text-gray-700 active:text-pink-500 cursor-pointer font-bold" onClick={() => speakText(line)}>{line}</p>))}</div>
          <button onClick={() => { onRead(selected.id); speakText(selected.content.join(' ')); }} className="w-full mt-10 py-6 bg-pink-500 text-white rounded-3xl text-2xl font-bold shadow-lg border-b-8 border-pink-700 active:translate-y-1 active:border-b-4 transition-all">🔊 听全文</button>
          <button onClick={() => { onRead(selected.id); setSelected(null); }} className="w-full mt-4 py-4 bg-green-400 text-white rounded-3xl text-xl font-bold shadow-lg border-b-8 border-green-600 active:translate-y-1 active:border-b-4 transition-all">完成学习 ✌️</button>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4">
      <Header title="快乐儿歌" onBack={onBack} />
      <div className="grid grid-cols-1 gap-4 mt-8">
        {songs.map((s, idx) => (
          <button key={s.id} onClick={() => setSelected(s)} className="bg-white p-6 rounded-[2rem] flex items-center justify-between shadow-md border-l-8 border-yellow-400 hover:scale-[1.02] transition-transform active:bg-yellow-50">
            <div className="flex items-center gap-4"><span className="text-4xl">{['🐱', '🐰', '🦁', '🐻', '🐨', '🐼', '🦊', '🐷'][idx % 8]}</span><span className="text-2xl font-bold text-gray-800">{s.title}</span></div>
            {progress.readSongs.includes(s.id) ? <span className="text-green-500 text-2xl font-bold">✅</span> : <span className="text-blue-500 font-bold">开始</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatsScreen({ progress }: { progress: ProgressData }) {
  const masterPercent = Math.round((progress.masteredWords.length / APP_WORDS.length) * 100);
  const hardestWords = useMemo(() => Object.entries(progress.wrongCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => APP_WORDS.find(w => w.id === id)?.text).filter(Boolean), [progress.wrongCounts]);
  return (
    <div className="p-6">
      <Header title="成就中心" />
      <div className="grid grid-cols-3 gap-2 mb-8 mt-4">
        <div className={`p-4 rounded-2xl text-center ${progress.masteredWords.length >= 1 ? 'bg-yellow-100' : 'bg-gray-100 opacity-40 grayscale'}`}><div className="text-4xl">🌱</div><p className="text-[10px] mt-1 font-black">初露锋芒</p></div>
        <div className={`p-4 rounded-2xl text-center ${progress.masteredWords.length >= 20 ? 'bg-orange-100' : 'bg-gray-100 opacity-40 grayscale'}`}><div className="text-4xl">🌟</div><p className="text-[10px] mt-1 font-black">识字达人</p></div>
        <div className={`p-4 rounded-2xl text-center ${progress.readSongs.length >= 5 ? 'bg-pink-100' : 'bg-gray-100 opacity-40 grayscale'}`}><div className="text-4xl">🎤</div><p className="text-[10px] mt-1 font-black">儿歌大王</p></div>
      </div>
      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl text-center border-4 border-purple-100 mb-6">
        <h2 className="text-xl font-bold text-purple-700 font-bold">总进度: {masterPercent}%</h2>
        <div className="w-full bg-gray-100 rounded-full h-8 mt-4 overflow-hidden shadow-inner border border-gray-50"><div className="bg-gradient-to-r from-purple-400 to-pink-500 h-full transition-all duration-1000" style={{ width: `${masterPercent}%` }} /></div>
        <div className="grid grid-cols-2 gap-4 mt-6">
           <div className="text-center"><p className="text-3xl font-black text-blue-500">{progress.masteredWords.length}</p><p className="text-xs text-gray-500 font-bold">累计识字</p></div>
           <div className="text-center"><p className="text-3xl font-black text-pink-500">{progress.readSongs.length}</p><p className="text-xs text-gray-500 font-bold">会唱儿歌</p></div>
        </div>
      </div>
      <div className="bg-[#FFF4E0] p-6 rounded-[2.5rem] shadow-md border-2 border-orange-200">
        <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2"><span>🧠</span> 宝宝难点分析</h3>
        {hardestWords.length > 0 ? (<div><p className="text-sm text-orange-600 mb-3 font-bold">以下字词答错较多，今晚可以多复习哦：</p><div className="flex flex-wrap gap-2">{hardestWords.map(word => (<span key={word} className="bg-white px-4 py-2 rounded-xl text-orange-700 font-black border border-orange-200 shadow-sm">{word}</span>))}</div></div>) : (<p className="text-sm text-orange-500 italic font-bold">宝宝表现完美，暂时没有发现难点！</p>)}
      </div>
    </div>
  );
}

function ExamWordsScreen({ words, progress, onUpdate, onBack }: { words: WordItem[]; progress: ProgressData; onUpdate: (id: string, s: 'mastered'|'learning'|'wrong') => void; onBack: () => void }) {
  const [questions, setQuestions] = useState<{target: WordItem, options: string[]}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [visual, setVisual] = useState<string>("✨");
  useEffect(() => {
    const candidates = words.sort(() => Math.random() - 0.5).slice(0, 10);
    const generated = candidates.map(target => {
      const options = [target.text, ...words.filter(w => w.id !== target.id).sort(() => Math.random() - 0.5).slice(0, 2).map(w => w.text)].sort(() => Math.random() - 0.5);
      return { target, options };
    });
    setQuestions(generated);
  }, [words]);
  useEffect(() => {
    if (questions.length > 0 && !isFinished) {
      const load = async () => { setVisual(await generateWordImage(questions[currentIndex].target.text) || "✨"); speakText(`请找出：${questions[currentIndex].target.text}`); };
      load();
    }
  }, [currentIndex, questions, isFinished]);
  const handleAnswer = (text: string) => {
    if (feedback) return;
    const isCorrect = text === questions[currentIndex].target.text;
    if (isCorrect) { setScore(s => s + 1); setFeedback('correct'); speakText("答对啦！"); onUpdate(questions[currentIndex].target.id, 'mastered'); }
    else { setFeedback('wrong'); speakText("再找找看？"); onUpdate(questions[currentIndex].target.id, 'wrong'); }
    setTimeout(() => { setFeedback(null); if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1); else setIsFinished(true); }, 1500);
  };
  if (isFinished) return (<div className="p-8 flex flex-col items-center justify-center min-h-screen bg-pink-50"><Header title="挑战结果" /><div className="bg-white p-10 rounded-[3.5rem] shadow-2xl text-center border-8 border-pink-200 w-full max-w-sm"><div className="text-8xl mb-6">🏆</div><h2 className="text-3xl font-bold mb-2">太棒了！</h2><p className="text-pink-500 text-6xl font-black mb-8">{score} / {questions.length}</p><button onClick={onBack} className="w-full py-5 bg-green-500 text-white rounded-3xl text-2xl font-bold shadow-lg border-b-8 border-green-700 active:translate-y-1">返回主页</button></div></div>);
  if (!questions[currentIndex]) return null;
  return (<div className="p-4 flex flex-col items-center"><Header title={`小标兵挑战 (${currentIndex + 1}/10)`} onBack={onBack} /><div className="w-full max-w-sm mt-8 relative"><div className={`aspect-square rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 bg-white border-8 ${feedback === 'correct' ? 'border-green-400 bg-green-50' : feedback === 'wrong' ? 'border-red-400 bg-red-50' : 'border-blue-200'}`}><div className="text-[10rem] drop-shadow-xl bouncy">{visual}</div><button onClick={() => speakText(questions[currentIndex].target.text)} className="mt-6 bg-yellow-400 p-4 rounded-full text-2xl shadow-md active:border-b-0">🔊</button></div></div><div className="mt-10 grid grid-cols-1 gap-5 w-full max-w-sm px-2">{questions[currentIndex].options.map((opt, idx) => (<button key={idx} disabled={!!feedback} onClick={() => handleAnswer(opt)} className="py-7 px-4 bg-white rounded-[2rem] text-4xl font-black text-gray-700 shadow-lg border-b-8 border-gray-100 active:translate-y-1">{opt}</button>))}</div></div>);
}

function ExamSongsScreen({ songs, progress, onRead, onBack }: { songs: SongItem[]; progress: ProgressData; onRead: (id: string) => void; onBack: () => void }) {
  const [questions, setQuestions] = useState<{song: SongItem, line: string, options: string[]}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  useEffect(() => {
    const allLines = songs.flatMap(s => s.content);
    const generated = Array.from({ length: 10 }).map(() => {
      const song = songs[Math.floor(Math.random() * songs.length)];
      const line = song.content[Math.floor(Math.random() * song.content.length)];
      const options = [line, ...allLines.filter(l => l !== line).sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5);
      return { song, line, options };
    });
    setQuestions(generated);
  }, [songs]);
  useEffect(() => { if (questions.length > 0 && !isFinished) speakText(`请听这句儿歌：${questions[currentIndex].line}`); }, [currentIndex, questions, isFinished]);
  const handleAnswer = (text: string) => {
    if (feedback) return;
    if (text === questions[currentIndex].line) { setScore(s => s + 1); setFeedback('correct'); speakText("答对了！"); onRead(questions[currentIndex].song.id); }
    else { setFeedback('wrong'); speakText("不对哦。"); }
    setTimeout(() => { setFeedback(null); if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1); else setIsFinished(true); }, 1500);
  };
  if (isFinished) return (<div className="p-8 flex flex-col items-center justify-center min-h-screen bg-blue-50"><Header title="挑战结果" /><div className="bg-white p-10 rounded-[3.5rem] shadow-2xl text-center border-8 border-blue-200 w-full max-w-sm"><div className="text-8xl mb-6">🎤</div><h2 className="text-3xl font-bold mb-2">挑战成功！</h2><p className="text-blue-500 text-6xl font-black mb-8">{score} / 10</p><button onClick={onBack} className="w-full py-5 bg-pink-500 text-white rounded-3xl text-2xl font-bold shadow-lg border-b-8 border-pink-700 active:translate-y-1">返回主页</button></div></div>);
  if (!questions[currentIndex]) return null;
  return (<div className="p-4 flex flex-col items-center"><Header title={`儿歌大挑战 (${currentIndex + 1}/10)`} onBack={onBack} /><div className="w-full max-w-sm mt-8 px-2"><div className={`p-10 bg-white rounded-[3rem] shadow-xl border-4 flex flex-col items-center ${feedback === 'correct' ? 'border-green-400 bg-green-50' : feedback === 'wrong' ? 'border-red-400 bg-red-50' : 'border-pink-200'}`}><div className="mb-6"><span className="text-6xl animate-bounce inline-block">🎧</span></div><button onClick={() => speakText(questions[currentIndex].line)} className="w-24 h-24 bg-yellow-400 rounded-full text-4xl shadow-lg border-b-8 border-yellow-600 flex items-center justify-center active:translate-y-1">🔊</button></div></div><div className="mt-10 flex flex-col gap-4 w-full max-w-sm px-4">{questions[currentIndex].options.map((opt, idx) => (<button key={idx} disabled={!!feedback} onClick={() => handleAnswer(opt)} className={`w-full py-6 px-4 bg-white rounded-[2rem] text-xl font-black shadow-lg border-b-8 transition-all ${feedback === 'correct' && opt === questions[currentIndex].line ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-200 text-gray-700'}`}>{opt}</button>))}</div></div>);
}
