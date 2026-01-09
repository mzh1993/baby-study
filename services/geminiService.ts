
// Emoji mapping for all words in the constant list
const EMOJI_MAP: Record<string, string> = {
  "小鸡": "🐥", "见面": "🤝", "小象": "🐘", "小羊": "🐑", "小狗": "🐶",
  "手": "✋", "拉拉手": "🤝", "招招手": "🙋", "皮球": "🏀", "风": "💨",
  "大树": "🌳", "小": "🐜", "大": "🐘", "火把": "🔥", "尾巴": "🐒", "水": "💧",
  "青蛙": "🐸", "小河": "🌊", "鸭子": "🦆", "河马": "🦛", "乌龟": "🐢",
  "门": "🚪", "水龙头": "🚰", "幼儿园": "🏫", "泡泡": "🫧", "喷": "🚿",
  "香皂": "🧼", "干净": "✨", "毛巾": "🧣", "洗": "🛁", "车站": "🚉",
  "汽车": "🚗", "小猪": "🐷", "兔子": "🐰", "郊游": "🏕️", "月牙": "🌙",
  "响": "🔔", "门铃": "🛎️", "公园": "🎠", "下棋": "♟️", "太阳": "☀️",
  "画画": "🎨", "妈妈": "👩", "爸爸": "👨", "小猫": "🐱", "朋友": "👫",
  "土": "🪴", "仓鼠": "🐹", "洞": "🕳️", "花": "🌸", "低": "👇", "高": "👆",
  "奶奶": "👵", "长大": "🌱", "哥哥": "👦", "爷爷": "👴", "妹妹": "👧",
  "爱心": "❤️", "衣服": "👕", "头发": "💇"
};

/**
 * Uses the native browser SpeechSynthesis API for offline TTS.
 */
export function speakText(text: string) {
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis not supported");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.9; // Slightly slower for kids
  utterance.pitch = 1.2; // Slightly higher/cuter pitch
  
  window.speechSynthesis.speak(utterance);
}

/**
 * Returns a static emoji representing the word.
 * This is 100% offline and instant.
 */
export async function generateWordImage(word: string): Promise<string | null> {
  return EMOJI_MAP[word] || "✨";
}
