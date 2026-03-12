import { useState, useEffect, useCallback } from 'react';
import { useStorage, getTodayKey, getDayIndex } from './useStorage';

/* ── CONSTANTS ── */
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAYS_FULL = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const SCHEDULE = {
  Mon: { college: true, stay: 'stay' },
  Tue: { college: true, stay: 'house' },
  Wed: { college: true, stay: 'stay' },
  Thu: { college: true, stay: 'house' },
  Fri: { college: true, stay: 'stay' },
  Sat: { college: false, stay: 'stay' },
  Sun: { college: false, stay: 'home' },
};

const EVENING = [
  { time: 'Till 5:00', label: 'Rest & Recharge', icon: '😴', tag: 'rest' },
  { time: '5:00 – 6:00', label: 'Coffee Date', icon: '☕', tag: 'sweet' },
  { time: '6:00 – 7:30', label: 'Gym Together', icon: '💪', tag: 'health' },
  { time: '7:30 – 8:00', label: 'Break', icon: '🍃', tag: 'rest' },
  { time: '8:00+', label: 'Stay / Home', icon: '🏠', tag: 'home' },
  { time: '9:00 – 10:30', label: 'Study Time', icon: '📖', tag: 'study', note: 'Online: Tue & Sun' },
];

const SWEET_ACTS = [
  { id: 'coffee', label: 'Coffee Date', icon: '☕', color: '#c9956b' },
  { id: 'walk', label: 'Evening Walk', icon: '🌅', color: '#d4847a' },
  { id: 'movie', label: 'Movie Night', icon: '🎬', color: '#8b7ec8' },
  { id: 'cook', label: 'Cook Together', icon: '🍳', color: '#7eb88a' },
  { id: 'studydate', label: 'Study Date', icon: '📚', color: '#6b9ac4' },
  { id: 'surprise', label: 'Surprise!', icon: '🎁', color: '#c87ea0' },
  { id: 'icecream', label: 'Ice Cream', icon: '🍦', color: '#e8a87c' },
  { id: 'music', label: 'Music Time', icon: '🎵', color: '#7aadaf' },
];

const HABITS = [
  { id: 'gym', label: 'Gym', icon: '💪' },
  { id: 'study', label: 'Study', icon: '📖' },
  { id: 'gm', label: 'Good Morning Text', icon: '💌' },
  { id: 'gn', label: 'Goodnight Call', icon: '🌙' },
  { id: 'water', label: '8 Glasses Water', icon: '💧' },
  { id: 'nophone', label: 'No Phone Hour', icon: '📵' },
  { id: 'skincare', label: 'Skincare', icon: '✨' },
  { id: 'fruit', label: 'Eat a Fruit', icon: '🍎' },
];

const MOODS = [
  { emoji: '🥰', label: 'In Love' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🤗', label: 'Grateful' },
  { emoji: '😤', label: 'Annoyed' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🥺', label: 'Miss You' },
];

const DATE_IDEAS = [
  'Sunset walk together 🌅', 'Try a new cafe ☕', 'Cook dinner together 🍝',
  'Watch the stars ✨', 'Photo walk around campus 📸', 'Write letters to each other 💌',
  'Ice cream date 🍦', 'Play 20 questions 🎯', 'Movie marathon night 🎬',
  'Dance in the room 💃', 'Breakfast in bed 🥞', 'Plant something together 🌱',
  'Make a playlist for each other 🎵', 'Draw each other (badly) 🎨',
  'Read to each other 📖', 'Go for a bike ride 🚲', 'Build a blanket fort 🏰',
  'Try a new recipe 👨‍🍳', 'Karaoke night 🎤', 'Give each other massages 💆',
  'Take silly selfies 🤳', 'Cloud watching ☁️', 'Make friendship bracelets 📿',
  'Visit a bookstore 📚', 'Have a picnic 🧺',
];

const COUPLE_QUESTIONS = [
  "What's your favorite memory of us?",
  "If we could travel anywhere right now, where?",
  "What song reminds you of me?",
  "What's something new you want to try together?",
  "What made you smile today?",
  "What's your favorite thing about our routine?",
  "If we had a whole free day together, what would we do?",
  "What's a small thing I do that makes you happy?",
  "What's your dream date night?",
  "What's one thing you want us to do this month?",
  "What's the funniest moment we've had?",
  "What food should we learn to cook together?",
  "What movie should we rewatch?",
  "What's something you admire about me?",
  "What's a goal we should work on together?",
  "If we had a couple superpower, what would it be?",
  "What's the best advice we've gotten about relationships?",
  "What's your favorite outfit on me?",
  "What place feels like 'our spot'?",
  "What's a silly habit of mine you secretly love?",
  "What should our next adventure be?",
  "What's one thing you're grateful for about us?",
  "What's the most romantic thing I've done?",
  "If we opened a business together, what would it be?",
  "What's one word that describes us?",
  "What did you think when you first saw me?",
  "What's our love language?",
  "What's the best gift I've given you?",
  "What do you want our future to look like?",
  "What makes our relationship special?",
];

const TAG_COLORS = {
  rest: { bg: '#f5ede4', fg: '#a08060' },
  sweet: { bg: '#fce8e4', fg: '#c4766a' },
  health: { bg: '#e4f0e8', fg: '#5e8a6a' },
  home: { bg: '#eae4f5', fg: '#7a6a9a' },
  study: { bg: '#e4ecf5', fg: '#5a7a9e' },
};

/* ── STYLES ── */
const S = {
  app: {
    minHeight: '100vh',
    minHeight: '100dvh',
    background: 'linear-gradient(175deg, #fdf6f0 0%, #f9ede3 35%, #f0e4da 65%, #ece0d8 100%)',
    fontFamily: "'DM Sans', sans-serif",
    color: '#3d2c2c',
    maxWidth: 430,
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 90,
  },
  card: {
    background: 'rgba(255,255,255,0.72)',
    borderRadius: 20,
    padding: 16,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(200,170,150,0.12)',
    boxShadow: '0 2px 20px rgba(120,80,60,0.04)',
  },
};

/* ── COMPONENTS ── */
function Card({ children, style = {}, onClick }) {
  return <div onClick={onClick} style={{ ...S.card, ...style }}>{children}</div>;
}

function Section({ title, subtitle, children, right }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {title && (
        <div style={{ marginBottom: 12, padding: '0 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#3d2c2c', fontWeight: 400 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 11, color: '#b89a8a', marginTop: 2, fontWeight: 500, letterSpacing: 0.5 }}>{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function ProgressRing({ progress, total, size = 50, color = '#c4766a', label }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const filled = total > 0 ? (progress / total) * circ : 0;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(200,170,150,0.15)" strokeWidth={3} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circ} strokeDashoffset={circ - filled}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.22,.68,0,.98)' }} />
        <text x={size/2} y={size/2} textAnchor="middle" dy=".35em"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontSize: 13, fontWeight: 600, fill: '#3d2c2c', fontFamily: "'DM Sans'" }}>
          {progress}/{total}
        </text>
      </svg>
      {label && <div style={{ fontSize: 9, color: '#b89a8a', marginTop: 2 }}>{label}</div>}
    </div>
  );
}

function Checkbox({ checked, onChange, color = '#7eb88a' }) {
  return (
    <div onClick={onChange} style={{
      width: 22, height: 22, borderRadius: 7, flexShrink: 0, cursor: 'pointer',
      border: checked ? 'none' : '2px solid rgba(200,170,150,0.3)',
      background: checked ? `linear-gradient(135deg, ${color}, ${color}cc)` : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.3s ease', fontSize: 12, color: '#fff',
    }}>{checked ? '✓' : ''}</div>
  );
}

/* ── DATE JAR ── */
function DateJar() {
  const [idea, setIdea] = useState(null);
  const [shaking, setShaking] = useState(false);
  const shake = () => {
    setShaking(true);
    setTimeout(() => {
      setIdea(DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)]);
      setShaking(false);
    }, 600);
  };
  return (
    <Card onClick={shake} style={{ textAlign: 'center', padding: 24, cursor: 'pointer' }}>
      <div style={{ fontSize: 48, marginBottom: 8, animation: shaking ? 'rk-shake .5s ease' : 'none' }}>🏺</div>
      {idea
        ? <div style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", color: '#3d2c2c', fontStyle: 'italic', lineHeight: 1.5 }}>{idea}</div>
        : <div style={{ fontSize: 13, color: '#b89a8a' }}>Tap to pick a date idea!</div>}
      <div style={{ fontSize: 11, color: '#b89a8a', marginTop: 8 }}>Tap again to shuffle</div>
    </Card>
  );
}

/* ── DAILY QUESTION ── */
function DailyQuestion() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  const q = COUPLE_QUESTIONS[dayOfYear % COUPLE_QUESTIONS.length];
  return (
    <Card style={{
      background: 'linear-gradient(135deg, rgba(212,132,122,0.08), rgba(139,126,200,0.08))',
      textAlign: 'center', padding: 24,
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
      <div style={{ fontSize: 10, color: '#b89a8a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Today's Question</div>
      <div style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", color: '#3d2c2c', lineHeight: 1.5, fontStyle: 'italic' }}>{q}</div>
    </Card>
  );
}

/* ── MAIN APP ── */
export default function App() {
  const today = getTodayKey();
  const dayIdx = getDayIndex();
  const dayKey = DAYS[dayIdx];
  const daySchedule = SCHEDULE[dayKey];

  // Navigation
  const [tab, setTab] = useState('today');
  const [weekDay, setWeekDay] = useState(dayIdx);

  // Persisted state
  const [moods, setMoods] = useStorage('moods', {});
  const [routineChecks, setRoutineChecks] = useStorage('routine', {});
  const [sweetDone, setSweetDone] = useStorage('sweet', {});
  const [habits, setHabits] = useStorage('habits', {});
  const [notes, setNotes] = useStorage('notes', []);
  const [promises, setPromises] = useStorage('promises', [
    "Always communicate honestly",
    "Never go to bed angry",
    "Support each other's dreams",
  ]);
  const [wishlist, setWishlist] = useStorage('wishlist', []);
  const [journal, setJournal] = useStorage('journal', []);
  const [anniversary, setAnniversary] = useStorage('anniversary', '2022-07-05');
  const [moodHistory, setMoodHistory] = useStorage('moodHistory', {});
  const [streakData, setStreakData] = useStorage('streaks', {});

  // Local state
  const [noteInput, setNoteInput] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [promiseInput, setPromiseInput] = useState('');
  const [wishInput, setWishInput] = useState('');
  const [journalInput, setJournalInput] = useState('');
  const [showAnniEdit, setShowAnniEdit] = useState(!anniversary);
  const [anniInput, setAnniInput] = useState(anniversary);
  const [activeUsTab, setActiveUsTab] = useState('countdown');

  // Derived
  const todayMoods = moods[today] || {};
  const todayRoutine = routineChecks[today] || {};
  const todaySweet = sweetDone[today] || {};
  const todayHabits = habits[today] || { rinnu: {}, kanu: {} };

  const routineCount = Object.values(todayRoutine).filter(Boolean).length;
  const habitCountR = Object.values(todayHabits.rinnu || {}).filter(Boolean).length;
  const habitCountK = Object.values(todayHabits.kanu || {}).filter(Boolean).length;
  const sweetCount = Object.values(todaySweet).filter(Boolean).length;

  // Anniversary calc
  const daysCount = anniversary
    ? Math.floor((new Date() - new Date(anniversary)) / 86400000)
    : null;
  const monthsCount = daysCount !== null ? Math.floor(daysCount / 30.44) : null;

  // Next milestone
  const nextMilestone = daysCount !== null
    ? [100,200,300,365,500,730,1000].find(m => m > daysCount) || (Math.ceil(daysCount/365)*365)
    : null;
  const daysToMilestone = nextMilestone !== null ? nextMilestone - daysCount : null;

  // Streak calculator
  const calcStreak = (person) => {
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 60; i++) {
      const key = d.toISOString().slice(0, 10);
      const dayHabits = (habits[key] || {})[person] || {};
      const done = Object.values(dayHabits).filter(Boolean).length;
      if (done >= 3) { streak++; } else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  // Greeting
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: 'Good Morning', emoji: '🌅' };
    if (h < 17) return { text: 'Good Afternoon', emoji: '☀️' };
    if (h < 21) return { text: 'Good Evening', emoji: '🌆' };
    return { text: 'Good Night', emoji: '🌙' };
  };
  const greeting = getGreeting();

  // Handlers
  const setMood = (person, emoji) => {
    const updated = { ...moods, [today]: { ...todayMoods, [person]: emoji } };
    setMoods(updated);
    setMoodHistory({ ...moodHistory, [today]: { ...todayMoods, [person]: emoji } });
  };

  const toggleRoutine = (i) => {
    setRoutineChecks({ ...routineChecks, [today]: { ...todayRoutine, [i]: !todayRoutine[i] } });
  };

  const toggleSweet = (id) => {
    setSweetDone({ ...sweetDone, [today]: { ...todaySweet, [id]: !todaySweet[id] } });
  };

  const toggleHabit = (person, id) => {
    const personHabits = todayHabits[person] || {};
    setHabits({
      ...habits,
      [today]: { ...todayHabits, [person]: { ...personHabits, [id]: !personHabits[id] } }
    });
  };

  const addNote = () => {
    if (!noteInput.trim()) return;
    setNotes([{ text: noteInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: today, id: Date.now() }, ...notes]);
    setNoteInput('');
    setShowNoteForm(false);
  };

  const addPromise = () => {
    if (!promiseInput.trim()) return;
    setPromises([...promises, promiseInput]);
    setPromiseInput('');
  };

  const addWish = () => {
    if (!wishInput.trim()) return;
    setWishlist([...wishlist, { text: wishInput, id: Date.now(), done: false }]);
    setWishInput('');
  };

  const toggleWish = (id) => {
    setWishlist(wishlist.map(w => w.id === id ? { ...w, done: !w.done } : w));
  };

  const addJournal = () => {
    if (!journalInput.trim()) return;
    setJournal([{ text: journalInput, date: today, id: Date.now() }, ...journal]);
    setJournalInput('');
  };

  const saveAnniversary = () => {
    setAnniversary(anniInput);
    setShowAnniEdit(false);
  };

  // Tabs config
  const tabs = [
    { id: 'today', label: 'Today', icon: '☀️' },
    { id: 'week', label: 'Week', icon: '📅' },
    { id: 'sweet', label: 'Sweet', icon: '💕' },
    { id: 'track', label: 'Track', icon: '✨' },
    { id: 'us', label: 'Us', icon: '💑' },
  ];

  const weekSchedule = SCHEDULE[DAYS[weekDay]];

  return (
    <div style={S.app}>
      <style>{`
        @keyframes rk-heartbeat { 0%,100% { transform: scale(1); } 15% { transform: scale(1.15); } 30% { transform: scale(1); } 45% { transform: scale(1.1); } }
        @keyframes rk-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes rk-shake { 0%,100% { transform: rotate(0); } 20% { transform: rotate(-12deg); } 40% { transform: rotate(12deg); } 60% { transform: rotate(-8deg); } 80% { transform: rotate(8deg); } }
        @keyframes rk-fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rk-pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        input, textarea { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { display: none; }
        body { overscroll-behavior: none; }
      `}</style>

      {/* Decorative */}
      <div style={{ position: 'absolute', top: -80, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,132,122,0.08), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 400, left: -100, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,126,200,0.06), transparent)', pointerEvents: 'none' }} />

      {/* ─── HEADER ─── */}
      <div style={{ padding: '32px 20px 8px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#b89a8a', fontWeight: 600, marginBottom: 8 }}>
          {greeting.emoji} {greeting.text}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#8b5e5e', fontStyle: 'italic' }}>Rinnu</span>
          <span style={{ animation: 'rk-heartbeat 1.8s ease-in-out infinite', fontSize: 22, color: '#d4847a' }}>♥</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#6b5e8b', fontStyle: 'italic' }}>Kanu</span>
        </div>
        {daysCount !== null && (
          <div style={{
            marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(90deg, rgba(212,132,122,0.1), rgba(139,126,200,0.1))',
            padding: '6px 16px', borderRadius: 20, fontSize: 12, color: '#8b7060',
          }}>
            <span style={{ animation: 'rk-float 3s ease-in-out infinite' }}>💑</span>
            <span style={{ fontWeight: 500 }}>Day {daysCount} together</span>
          </div>
        )}
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{ padding: '12px 16px' }}>

        {/* ═══════ TODAY ═══════ */}
        {tab === 'today' && <>
          {/* Mood */}
          <Section title="How are we feeling?" subtitle="Tap to set today's mood">
            <Card>
              {['rinnu', 'kanu'].map((p, pi) => (
                <div key={p} style={{ marginBottom: pi === 0 ? 16 : 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: p === 'rinnu' ? '#8b5e5e' : '#6b5e8b', marginBottom: 8, textTransform: 'capitalize' }}>{p}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {MOODS.map(m => (
                      <button key={m.emoji} onClick={() => setMood(p, m.emoji)} style={{
                        width: 40, height: 40, borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: todayMoods[p] === m.emoji ? 'linear-gradient(135deg, rgba(212,132,122,0.2), rgba(139,126,200,0.2))' : 'rgba(200,170,150,0.08)',
                        transform: todayMoods[p] === m.emoji ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all .3s cubic-bezier(.22,.68,0,.98)',
                        boxShadow: todayMoods[p] === m.emoji ? '0 3px 12px rgba(212,132,122,0.15)' : 'none',
                      }}>{m.emoji}</button>
                    ))}
                  </div>
                  {todayMoods[p] && (
                    <div style={{ fontSize: 11, color: '#b89a8a', marginTop: 6, fontStyle: 'italic' }}>
                      Feeling: {MOODS.find(m => m.emoji === todayMoods[p])?.label}
                    </div>
                  )}
                </div>
              ))}
            </Card>
          </Section>

          {/* Today Schedule */}
          <Section title="Today's Schedule" subtitle={DAYS_FULL[dayIdx]}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              {[
                { name: 'Rinnu', time: '7:30 – 4:30', color: '#8b5e5e' },
                { name: 'Kanu', time: '9:00 – 4:30', color: '#6b5e8b' },
              ].map(p => (
                <Card key={p.name} style={{ flex: 1, textAlign: 'center', padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: p.color }}>{p.name}</div>
                  <div style={{ fontSize: 9, color: '#b89a8a', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>Morning</div>
                  <div style={{ fontSize: 28, margin: '4px 0' }}>{daySchedule.college ? '🎓' : '😊'}</div>
                  <div style={{ fontSize: 14, fontWeight: 300, color: p.color, fontFamily: "'Playfair Display', serif" }}>
                    {daySchedule.college ? p.time : 'Day Off!'}
                  </div>
                </Card>
              ))}
            </div>
            <Card style={{
              textAlign: 'center', padding: 14,
              background: daySchedule.stay === 'stay' ? 'linear-gradient(135deg, rgba(212,132,122,0.06), rgba(139,126,200,0.06))' : S.card.background,
            }}>
              <div style={{ fontSize: 9, color: '#b89a8a', letterSpacing: 2, textTransform: 'uppercase' }}>Tonight</div>
              <div style={{ fontSize: 30, margin: '4px 0' }}>
                {daySchedule.stay === 'stay' ? '💑' : daySchedule.stay === 'house' ? '🏡' : '🏠'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {daySchedule.stay === 'stay' ? 'Staying Together!' : daySchedule.stay === 'house' ? 'Going to House' : 'Going Home'}
              </div>
            </Card>
          </Section>

          {/* Evening Routine */}
          <Section title="Evening Routine" subtitle={`${routineCount}/${EVENING.length} done`}>
            {EVENING.map((item, i) => {
              const done = todayRoutine[i];
              const tc = TAG_COLORS[item.tag];
              return (
                <div key={i} onClick={() => toggleRoutine(i)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
                  background: done ? 'rgba(126,184,138,0.08)' : 'rgba(255,255,255,0.6)',
                  borderRadius: 16, padding: '12px 14px', cursor: 'pointer',
                  border: done ? '1px solid rgba(126,184,138,0.15)' : '1px solid rgba(200,170,150,0.08)',
                  transition: 'all .3s ease',
                }}>
                  <Checkbox checked={done} onChange={() => {}} />
                  <div style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, textDecoration: done ? 'line-through' : 'none', opacity: done ? .5 : 1, transition: 'all .3s' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#b89a8a' }}>{item.time}</div>
                    {item.note && <div style={{ fontSize: 10, color: '#8b7ec8', fontStyle: 'italic', marginTop: 1 }}>{item.note}</div>}
                  </div>
                  <div style={{ fontSize: 9, padding: '3px 8px', borderRadius: 8, background: tc.bg, color: tc.fg, fontWeight: 600, letterSpacing: .5, textTransform: 'uppercase' }}>{item.tag}</div>
                </div>
              );
            })}
          </Section>

          {/* Love Notes */}
          <Section title="Love Notes 💌">
            <Card>
              {!showNoteForm ? (
                <button onClick={() => setShowNoteForm(true)} style={{
                  width: '100%', padding: 14, border: '2px dashed rgba(200,170,150,0.25)',
                  borderRadius: 14, background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#b89a8a', fontFamily: "'DM Sans'",
                }}>+ Write a sweet note...</button>
              ) : (
                <div>
                  <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)}
                    placeholder="I love you because..."
                    style={{ width: '100%', padding: 12, border: '1px solid rgba(200,170,150,0.2)', borderRadius: 14, background: 'rgba(253,246,240,0.5)', resize: 'none', height: 80, fontSize: 13, color: '#3d2c2c', outline: 'none' }} autoFocus />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowNoteForm(false)} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', fontSize: 12, background: 'rgba(200,170,150,0.1)', color: '#8b7060', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={addNote} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', fontSize: 12, background: 'linear-gradient(135deg, #d4847a, #c4766a)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Send 💕</button>
                  </div>
                </div>
              )}
              {notes.slice(0, 5).map(n => (
                <div key={n.id} style={{ marginTop: 10, padding: 12, borderRadius: 14, background: 'linear-gradient(135deg, rgba(212,132,122,0.06), rgba(139,126,200,0.06))', fontSize: 13, color: '#5a4040', lineHeight: 1.5 }}>
                  <div>"{n.text}"</div>
                  <div style={{ fontSize: 10, color: '#b89a8a', marginTop: 4, textAlign: 'right' }}>{n.date} • {n.time}</div>
                </div>
              ))}
              {notes.length > 5 && <div style={{ textAlign: 'center', fontSize: 11, color: '#b89a8a', marginTop: 8 }}>+ {notes.length - 5} more notes</div>}
            </Card>
          </Section>
        </>}

        {/* ═══════ WEEK ═══════ */}
        {tab === 'week' && <>
          <Section title="Weekly View">
            <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
              {DAYS.map((d, i) => {
                const active = i === weekDay;
                const isWE = !SCHEDULE[d].college;
                return (
                  <button key={d} onClick={() => setWeekDay(i)} style={{
                    flex: 1, height: 54, borderRadius: 14, border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                    fontSize: 10, fontWeight: 600, transition: 'all .3s cubic-bezier(.22,.68,0,.98)',
                    background: active ? 'linear-gradient(135deg, #d4847a, #c9956b)' : 'rgba(255,255,255,0.5)',
                    color: active ? '#fff' : isWE ? '#8b7ec8' : '#5a4040',
                    transform: active ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: active ? '0 4px 16px rgba(212,132,122,0.25)' : 'none',
                  }}>
                    <span>{d}</span>
                    <span style={{ fontSize: 7, opacity: .7 }}>{SCHEDULE[d].college ? 'COLLEGE' : 'FREE'}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title={DAYS_FULL[weekDay]}>
            <Card>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { label: 'Rinnu', sub: weekSchedule.college ? '7:30 – 4:30' : 'Day Off', icon: weekSchedule.college ? '🎓' : '😊', color: '#8b5e5e' },
                  { label: 'Kanu', sub: weekSchedule.college ? '9:00 – 4:30' : 'Day Off', icon: weekSchedule.college ? '🎓' : '😊', color: '#6b5e8b' },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center', padding: 14, borderRadius: 14, background: 'rgba(200,170,150,0.06)' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#b89a8a', marginTop: 2 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{
                textAlign: 'center', padding: 16, borderRadius: 14,
                background: weekSchedule.stay === 'stay' ? 'linear-gradient(135deg, rgba(212,132,122,0.1), rgba(139,126,200,0.08))' : 'rgba(200,170,150,0.06)',
              }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>{weekSchedule.stay === 'stay' ? '💑' : weekSchedule.stay === 'house' ? '🏡' : '🏠'}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{weekSchedule.stay === 'stay' ? 'Staying Together Tonight!' : weekSchedule.stay === 'house' ? 'Going to House' : 'Going Home'}</div>
              </div>
              {(DAYS[weekDay] === 'Tue' || DAYS[weekDay] === 'Sun') && (
                <div style={{ marginTop: 12, textAlign: 'center', padding: '10px 14px', borderRadius: 12, background: 'rgba(107,154,196,0.08)', fontSize: 12, color: '#5a7a9e' }}>📚 Online Study Night (9:00 – 10:30)</div>
              )}
            </Card>
          </Section>

          {/* Table */}
          <Section title="At a Glance">
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 1fr 1fr', fontSize: 9, fontWeight: 600, color: '#b89a8a', letterSpacing: 1.5, textTransform: 'uppercase', padding: '12px 14px', borderBottom: '1px solid rgba(200,170,150,0.1)' }}>
                <span>Day</span><span style={{ textAlign: 'center' }}>College</span><span style={{ textAlign: 'center' }}>Evening</span><span style={{ textAlign: 'center' }}>Study</span>
              </div>
              {DAYS.map((d, i) => {
                const s = SCHEDULE[d];
                return (
                  <div key={d} onClick={() => setWeekDay(i)} style={{
                    display: 'grid', gridTemplateColumns: '52px 1fr 1fr 1fr', padding: '11px 14px', fontSize: 12, cursor: 'pointer',
                    background: i === weekDay ? 'rgba(212,132,122,0.04)' : 'transparent',
                    borderBottom: i < 6 ? '1px solid rgba(200,170,150,0.06)' : 'none',
                  }}>
                    <span style={{ fontWeight: 500 }}>{d}</span>
                    <span style={{ textAlign: 'center' }}>{s.college ? '✓' : '—'}</span>
                    <span style={{ textAlign: 'center' }}>{s.stay === 'stay' ? '💑' : s.stay === 'house' ? '🏡' : '🏠'}</span>
                    <span style={{ textAlign: 'center' }}>{d === 'Tue' || d === 'Sun' ? '📖' : '—'}</span>
                  </div>
                );
              })}
            </Card>
          </Section>
        </>}

        {/* ═══════ SWEET ═══════ */}
        {tab === 'sweet' && <>
          <DailyQuestion />
          <div style={{ height: 20 }} />

          <Section title="Sweet Activities" subtitle={`${sweetCount} done today`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SWEET_ACTS.map(act => {
                const done = todaySweet[act.id];
                return (
                  <Card key={act.id} onClick={() => toggleSweet(act.id)} style={{
                    textAlign: 'center', cursor: 'pointer', padding: 18,
                    border: done ? `1.5px solid ${act.color}30` : '1px solid rgba(200,170,150,0.08)',
                    background: done ? `${act.color}08` : S.card.background,
                    transition: 'all .3s ease',
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 6, filter: done ? 'none' : 'grayscale(0.3)', transition: 'all .3s' }}>{act.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: done ? act.color : '#5a4040' }}>{act.label}</div>
                    {done && <div style={{ marginTop: 6, fontSize: 9, fontWeight: 700, color: act.color, letterSpacing: 1, textTransform: 'uppercase' }}>Done! ✓</div>}
                  </Card>
                );
              })}
            </div>
          </Section>

          <Section title="Date Jar 🏺" subtitle="Tap to shake!">
            <DateJar />
          </Section>

          <Section title="Couple Stats">
            <Card style={{ background: 'linear-gradient(135deg, rgba(212,132,122,0.06), rgba(201,149,107,0.04), rgba(139,126,200,0.06))', textAlign: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { num: daysCount ?? '—', label: 'Days', emoji: '💑' },
                  { num: monthsCount ?? '—', label: 'Months', emoji: '📅' },
                  { num: sweetCount, label: 'Sweet Today', emoji: '💕' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 22 }}>{s.emoji}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#3d2c2c', fontWeight: 600 }}>{s.num}</div>
                    <div style={{ fontSize: 9, color: '#b89a8a', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </Section>
        </>}

        {/* ═══════ TRACK ═══════ */}
        {tab === 'track' && <>
          {['rinnu', 'kanu'].map(person => {
            const progress = person === 'rinnu' ? habitCountR : habitCountK;
            const personColor = person === 'rinnu' ? '#8b5e5e' : '#6b5e8b';
            const streak = calcStreak(person);
            return (
              <Section key={person} title={person.charAt(0).toUpperCase() + person.slice(1)} subtitle={streak > 0 ? `🔥 ${streak}-day streak` : 'Start your streak!'}>
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: personColor }}>{progress}/{HABITS.length} done</div>
                      <div style={{ fontSize: 11, color: '#b89a8a' }}>Keep going!</div>
                    </div>
                    <ProgressRing progress={progress} total={HABITS.length} color={personColor} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {HABITS.map(h => {
                      const done = (todayHabits[person] || {})[h.id];
                      return (
                        <div key={h.id} onClick={() => toggleHabit(person, h.id)} style={{
                          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                          borderRadius: 12, cursor: 'pointer',
                          background: done ? 'rgba(126,184,138,0.08)' : 'rgba(200,170,150,0.05)',
                          border: done ? '1px solid rgba(126,184,138,0.15)' : '1px solid transparent',
                          transition: 'all .3s ease',
                        }}>
                          <Checkbox checked={done} onChange={() => {}} />
                          <span style={{ fontSize: 14 }}>{h.icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 500, opacity: done ? .5 : 1, textDecoration: done ? 'line-through' : 'none', flex: 1 }}>{h.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </Section>
            );
          })}

          {/* Week Streak View */}
          <Section title="This Week">
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {DAYS.map((d, i) => {
                  const dateObj = new Date();
                  const diff = i - dayIdx;
                  dateObj.setDate(dateObj.getDate() + diff);
                  const dKey = dateObj.toISOString().slice(0, 10);
                  const dayHabits = habits[dKey] || {};
                  const rDone = Object.values(dayHabits.rinnu || {}).filter(Boolean).length;
                  const kDone = Object.values(dayHabits.kanu || {}).filter(Boolean).length;
                  const total = rDone + kDone;
                  const isPast = i <= dayIdx;
                  return (
                    <div key={d} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: '#b89a8a', marginBottom: 6 }}>{d}</div>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: isPast && total > 0
                          ? `rgba(126,184,138,${Math.min(0.15 + (total / 16) * 0.6, 0.75)})`
                          : 'rgba(200,170,150,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: total > 8 ? 14 : 12, color: isPast && total > 0 ? '#3d6b4a' : '#ccc',
                        fontWeight: 600,
                      }}>
                        {isPast ? (total > 8 ? '🔥' : total > 0 ? total : '·') : '·'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Section>
        </>}

        {/* ═══════ US ═══════ */}
        {tab === 'us' && <>
          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.5)', borderRadius: 12, padding: 4, overflowX: 'auto' }}>
            {[
              { id: 'countdown', label: '⏰ Days' },
              { id: 'promises', label: '🤝 Promises' },
              { id: 'wishlist', label: '⭐ Wishlist' },
              { id: 'journal', label: '📖 Journal' },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveUsTab(t.id)} style={{
                flex: 1, padding: '10px 4px', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', transition: 'all .3s', whiteSpace: 'nowrap',
                background: activeUsTab === t.id ? 'linear-gradient(135deg, #d4847a, #c9956b)' : 'transparent',
                color: activeUsTab === t.id ? '#fff' : '#b89a8a',
              }}>{t.label}</button>
            ))}
          </div>

          {/* Countdown */}
          {activeUsTab === 'countdown' && <>
            {showAnniEdit || !anniversary ? (
              <Section title="Set Your Anniversary" subtitle="When did it all begin?">
                <Card>
                  <input type="date" value={anniInput} onChange={e => setAnniInput(e.target.value)}
                    style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(200,170,150,0.2)', background: 'rgba(253,246,240,0.5)', fontSize: 14, color: '#3d2c2c', outline: 'none', marginBottom: 10 }} />
                  <button onClick={saveAnniversary} style={{
                    width: '100%', padding: 12, borderRadius: 12, border: 'none', fontSize: 13,
                    background: 'linear-gradient(135deg, #d4847a, #c4766a)', color: '#fff', cursor: 'pointer', fontWeight: 600,
                  }}>Save ♥</button>
                </Card>
              </Section>
            ) : (
              <>
                <Section title="Our Journey">
                  <Card style={{ textAlign: 'center', padding: 28, background: 'linear-gradient(135deg, rgba(212,132,122,0.08), rgba(201,149,107,0.06), rgba(139,126,200,0.08))' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>💕</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      {[
                        { num: daysCount, label: 'Days' },
                        { num: Math.floor(daysCount / 7), label: 'Weeks' },
                        { num: monthsCount, label: 'Months' },
                      ].map(s => (
                        <div key={s.label}>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#3d2c2c', fontWeight: 600 }}>{s.num}</div>
                          <div style={{ fontSize: 10, color: '#b89a8a', fontWeight: 500, letterSpacing: 1 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, fontSize: 12, color: '#8b7060' }}>Since {new Date(anniversary).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    <button onClick={() => setShowAnniEdit(true)} style={{
                      marginTop: 10, padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(200,170,150,0.2)', background: 'transparent', fontSize: 11, color: '#b89a8a', cursor: 'pointer',
                    }}>Edit date</button>
                  </Card>
                </Section>

                {nextMilestone && (
                  <Section title="Next Milestone 🎉">
                    <Card style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, color: '#d4847a' }}>{daysToMilestone}</div>
                      <div style={{ fontSize: 12, color: '#8b7060' }}>days until Day {nextMilestone}!</div>
                      <div style={{
                        marginTop: 12, height: 6, borderRadius: 3, background: 'rgba(200,170,150,0.15)', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          background: 'linear-gradient(90deg, #d4847a, #c9956b)',
                          width: `${Math.min((daysCount / nextMilestone) * 100, 100)}%`,
                          transition: 'width .6s ease',
                        }} />
                      </div>
                    </Card>
                  </Section>
                )}
              </>
            )}
          </>}

          {/* Promises */}
          {activeUsTab === 'promises' && (
            <Section title="Our Promises" subtitle="Things we promised each other">
              <Card>
                {promises.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0',
                    borderBottom: i < promises.length - 1 ? '1px solid rgba(200,170,150,0.08)' : 'none',
                  }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, rgba(212,132,122,0.1), rgba(139,126,200,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🤝</div>
                    <div style={{ fontSize: 13, color: '#3d2c2c', lineHeight: 1.4 }}>{p}</div>
                    <button onClick={() => setPromises(promises.filter((_, j) => j !== i))} style={{
                      background: 'none', border: 'none', fontSize: 14, color: '#ccc', cursor: 'pointer', padding: 4, flexShrink: 0,
                    }}>×</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <input value={promiseInput} onChange={e => setPromiseInput(e.target.value)}
                    placeholder="Add a promise..."
                    onKeyDown={e => e.key === 'Enter' && addPromise()}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(200,170,150,0.2)', background: 'rgba(253,246,240,0.5)', fontSize: 13, color: '#3d2c2c', outline: 'none' }} />
                  <button onClick={addPromise} style={{
                    padding: '10px 16px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #d4847a, #c4766a)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  }}>+</button>
                </div>
              </Card>
            </Section>
          )}

          {/* Wishlist */}
          {activeUsTab === 'wishlist' && (
            <Section title="Our Wishlist ⭐" subtitle="Things we want to do together">
              <Card>
                {wishlist.length === 0 && <div style={{ textAlign: 'center', color: '#b89a8a', fontSize: 13, padding: 16 }}>No wishes yet — add your first one!</div>}
                {wishlist.map(w => (
                  <div key={w.id} onClick={() => toggleWish(w.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', cursor: 'pointer',
                    borderBottom: '1px solid rgba(200,170,150,0.06)',
                  }}>
                    <Checkbox checked={w.done} onChange={() => {}} color="#c9956b" />
                    <span style={{ fontSize: 13, flex: 1, textDecoration: w.done ? 'line-through' : 'none', opacity: w.done ? .5 : 1 }}>{w.text}</span>
                    {w.done && <span style={{ fontSize: 11 }}>✨</span>}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <input value={wishInput} onChange={e => setWishInput(e.target.value)}
                    placeholder="Add a wish..."
                    onKeyDown={e => e.key === 'Enter' && addWish()}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(200,170,150,0.2)', background: 'rgba(253,246,240,0.5)', fontSize: 13, color: '#3d2c2c', outline: 'none' }} />
                  <button onClick={addWish} style={{
                    padding: '10px 16px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #c9956b, #b88555)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  }}>+</button>
                </div>
              </Card>
            </Section>
          )}

          {/* Journal */}
          {activeUsTab === 'journal' && (
            <Section title="Our Journal 📖" subtitle="Memories & moments">
              <Card>
                <textarea value={journalInput} onChange={e => setJournalInput(e.target.value)}
                  placeholder="Write about today..."
                  style={{ width: '100%', padding: 12, borderRadius: 14, border: '1px solid rgba(200,170,150,0.2)', background: 'rgba(253,246,240,0.5)', resize: 'none', height: 80, fontSize: 13, color: '#3d2c2c', outline: 'none', marginBottom: 10 }} />
                <button onClick={addJournal} style={{
                  width: '100%', padding: 10, borderRadius: 12, border: 'none', fontSize: 13,
                  background: 'linear-gradient(135deg, #8b7ec8, #6b5e8b)', color: '#fff', cursor: 'pointer', fontWeight: 600,
                }}>Save Memory 💜</button>
              </Card>
              {journal.map(j => (
                <Card key={j.id} style={{ marginTop: 10, background: 'rgba(255,255,255,0.5)' }}>
                  <div style={{ fontSize: 13, color: '#3d2c2c', lineHeight: 1.6 }}>{j.text}</div>
                  <div style={{ fontSize: 10, color: '#b89a8a', marginTop: 8, textAlign: 'right' }}>{j.date}</div>
                </Card>
              ))}
              {journal.length === 0 && <div style={{ textAlign: 'center', color: '#b89a8a', fontSize: 12, marginTop: 16 }}>No entries yet. Start writing your story together!</div>}
            </Section>
          )}
        </>}
      </div>

      {/* ─── BOTTOM NAV ─── */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'rgba(253,246,240,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(200,170,150,0.12)',
        display: 'flex', justifyContent: 'space-around', padding: '6px 0 max(10px, env(safe-area-inset-bottom))', zIndex: 100,
      }}>
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              border: 'none', background: 'transparent', cursor: 'pointer',
              padding: '6px 12px', borderRadius: 12, transition: 'all .3s',
            }}>
              <span style={{
                fontSize: 20,
                filter: active ? 'none' : 'grayscale(0.7) opacity(0.5)',
                transform: active ? 'scale(1.15)' : 'scale(1)',
                transition: 'all .3s cubic-bezier(.22,.68,0,.98)',
              }}>{t.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: .5, color: active ? '#d4847a' : '#b89a8a', transition: 'all .3s' }}>{t.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#d4847a', marginTop: -1 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
