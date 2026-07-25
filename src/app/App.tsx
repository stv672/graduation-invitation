import { useState, useEffect } from "react";

const ACHIEVEMENTS = [
  { id: 1, icon: "🎓", title: "Scholar Supreme", desc: "Completed 5 years of academic quests", xp: 5000, unlocked: true },
  { id: 2, icon: "📜", title: "Thesis Conqueror", desc: "Defeated the final boss: the dissertation", xp: 3500, unlocked: true },
  { id: 3, icon: "⚔️", title: "All-Nighter Survivor", desc: "Endured 100+ hours of study marathons", xp: 2000, unlocked: true },
  { id: 4, icon: "🏆", title: "Academic Legend", desc: "Barely survived all subjects...", xp: 4200, unlocked: true },
];

const QUESTS = [
  { label: "Complete freshman year", done: true },
  { label: "Declare major: Information Technology", done: true },
  { label: "Survive programming fundamentals", done: true },
  { label: "Secure internship at a tech company", done: true },
  { label: "Submit senior thesis", done: true },
  { label: "Walk across the graduation stage", done: false },
];

const STATS = [
  { label: "STR", value: 87, color: "#ff6b6b" },
  { label: "INT", value: 98, color: "#00e5ff" },
  { label: "DEX", value: 74, color: "#a855f7" },
  { label: "WIS", value: 91, color: "#ffd700" },
  { label: "CHA", value: 82, color: "#22c55e" },
];

// CÁCH 1: Đường dẫn Google Calendar EventEdit chuẩn mới
function getGoogleCalendarUrl() {
  const title = encodeURIComponent("The Grand Graduation Ceremony - Duy Le");
  const details = encodeURIComponent("Graduation Ceremony of Duy Le - Bachelor of Information Technology.");
  const location = encodeURIComponent("Van Lang University, 69/68 Dang Thuy Tram, An Nhon, HCMC");
  
  // Ngày 06/08/2026: 07:00 AM - 12:00 PM (giờ Việt Nam UTC+7 -> UTC: 20260806T000000Z/20260806T050000Z)
  const startDate = "20260806T000000Z"; 
  const endDate = "20260806T050000Z";

  // Dùng cấu trúc /r/eventedit của Google Calendar
  return `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
}

// CÁCH 2 (Dự phòng): Tải file .ics
function downloadIcsFile() {
  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Graduation Ceremony//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
SUMMARY:The Grand Graduation Ceremony - Duy Le
DESCRIPTION:Graduation Ceremony of Duy Le - Bachelor of Information Technology.
LOCATION:Van Lang University\\, 69/68 Dang Thuy Tram\\, An Nhon\\, HCMC
DTSTART:20260806T000000Z
DTEND:20260806T050000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent.trim()], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Graduation_Ceremony_DuyLe.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function PixelBorder({ children, className = "", color = "#00e5ff" }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        boxShadow: `0 0 0 2px ${color}, 0 0 0 4px #080818, 0 0 0 6px ${color}33`,
        imageRendering: "pixelated",
      }}
    >
      {children}
    </div>
  );
}

function XPBar({ value, max, color = "#ffd700", label }: { value: number; max: number; color?: string; label?: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{label}</span>
          <span className="font-mono text-xs" style={{ color }}>{value.toLocaleString()} / {max.toLocaleString()} XP</span>
        </div>
      )}
      <div className="h-4 bg-secondary relative overflow-hidden" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}>
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold"
          style={{ color: "#080818", mixBlendMode: "difference", filter: "invert(1)" }}
        >
          {pct}%
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs w-8 font-bold" style={{ color }}>{label}</span>
      <div className="flex-1 h-3 bg-secondary relative overflow-hidden">
        <div
          className="h-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}66, ${color})`,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      </div>
      <span className="font-mono text-xs text-muted-foreground w-6 text-right">{value}</span>
    </div>
  );
}

function BlinkingCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return <span style={{ opacity: visible ? 1 : 0, color: "#00e5ff" }}>█</span>;
}

function FloatingPixels() {
  const pixels = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
    color: ["#ffd700", "#00e5ff", "#a855f7", "#ff6b6b"][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pixels.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `float-up ${p.duration}s ${p.delay}s infinite linear`,
            imageRendering: "pixelated",
          }}
        />
      ))}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink-badge {
          0%, 100% { box-shadow: 0 0 0 2px #ffd700, 0 0 12px #ffd70066; }
          50% { box-shadow: 0 0 0 2px #ffd700, 0 0 24px #ffd700aa, 0 0 40px #ffd70044; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .achievement-card:hover { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}

function formatSlugToName(slug: string): string {
  if (!slug) return "Player";
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function CongratulationsPopup({ onClose, recipientName }: { onClose: () => void; recipientName: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleOpenGoogleCalendar = () => {
    // Chuyển hướng trực tiếp bằng Cách 1
    window.location.href = getGoogleCalendarUrl();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0f0f2a",
          boxShadow: "0 0 0 2px #ffd700, 0 0 0 4px #080818, 0 0 0 6px #ffd70033, 0 0 60px #ffd70022",
          transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          transition: "transform 0.3s ease",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ background: "#ffd700", fontFamily: "'Press Start 2P'", fontSize: "8px" }}
        >
          <span style={{ color: "#080818" }}>◄ NEW QUEST ACCEPTED ►</span>
          <button
            onClick={handleClose}
            className="hover:opacity-70 transition-opacity cursor-pointer"
            style={{ color: "#080818", fontFamily: "'Press Start 2P'", fontSize: "10px" }}
          >
            ✖
          </button>
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          {/* Trophy icon with glow */}
          <div
            className="text-6xl mb-4 inline-block"
            style={{ animation: "blink-badge 2s ease-in-out infinite", filter: "drop-shadow(0 0 12px #ffd700)" }}
          >
            🏆
          </div>

          <div
            style={{ fontFamily: "'Press Start 2P'", fontSize: "clamp(9px, 2vw, 13px)", color: "#ffd700", lineHeight: 2 }}
            className="mb-4"
          >
            CONGRATULATIONS!
          </div>

          <div className="text-xl font-bold mb-5" style={{ color: "#ffffff" }}>
            {recipientName}!
          </div>

          <div
            className="text-base leading-relaxed mb-6 px-2"
            style={{ color: "#c8c8e0", fontFamily: "'Rajdhani', sans-serif" }}
          >
            You have been invited to the ceremony. Please be there at{" "}
            <span style={{ color: "#00e5ff", fontWeight: 700 }}>9:00 AM</span> (Doors open at{" "}
            <span style={{ color: "#00e5ff", fontWeight 700 }}>7:00 AM</span>).
          </div>

          {/* Warning box */}
          <div
            className="px-4 py-3 mb-6 font-bold text-sm tracking-wide"
            style={{
              background: "rgba(255,68,85,0.1)",
              border: "1px solid #ff4455",
              color: "#ff4455",
              fontFamily: "'Press Start 2P'",
              fontSize: "8px",
              lineHeight: 2,
              animation: "glow-pulse 1.5s ease-in-out infinite",
            }}
          >
            ⚠️ AND DON&apos;T BE LATE ⚠️
          </div>

          {/* Nút bấm Cách 1: Mở Google Calendar */}
          <button
            onClick={handleOpenGoogleCalendar}
            className="w-full px-6 py-3.5 mb-3 font-bold tracking-widest transition-all duration-150 active:scale-95 cursor-pointer block"
            style={{
              fontFamily: "'Press Start 2P'",
              fontSize: "10px",
              background: "#22c55e",
              color: "#080818",
              boxShadow: "0 0 0 2px #22c55e, 0 4px 0 #166534, 0 0 20px #22c55e44",
              letterSpacing: "0.15em",
            }}
          >
            ► SAVE TO GOOGLE CALENDAR
          </button>

          {/* Link phụ: Tải file .ics nếu muốn dùng app Lịch khác */}
          <button
            onClick={downloadIcsFile}
            className="text-xs font-mono underline opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
            style={{ color: "#00e5ff" }}
          >
            Or download .ICS file for Apple Calendar / Outlook
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [rsvpClicked, setRsvpClicked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const totalXP = ACHIEVEMENTS.reduce((s, a) => s + a.xp, 0);

  const slug = window.location.pathname.split("/").filter(Boolean).pop() ?? "";
  const guestName = formatSlugToName(slug);

  useEffect(() => {
    const t = setTimeout(() => setShowAchievements(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      {showPopup && <CongratulationsPopup onClose={() => setShowPopup(false)} recipientName={guestName} />}
      <FloatingPixels />

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
        }}
      />

      <div className="relative z-20 max-w-4xl mx-auto px-4 py-10">

        {/* ── SYSTEM ALERT HEADER ── */}
        <div className="text-center mb-8">
          <div
            className="inline-block px-4 py-1 mb-4 font-mono text-xs tracking-[0.3em] uppercase"
            style={{
              color: "#00e5ff",
              border: "1px solid #00e5ff44",
              background: "rgba(0,229,255,0.07)",
              animation: "glow-pulse 2s infinite",
            }}
          >
            ◄ SYSTEM NOTIFICATION ►
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #ffd700)" }} />
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: "clamp(10px, 2.5vw, 16px)", color: "#ffd700", lineHeight: 1.8 }}>
              ACHIEVEMENT<br />UNLOCKED
            </span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #ffd700, transparent)" }} />
          </div>
        </div>

        {/* ── MAIN INVITATION CARD ── */}
        <PixelBorder color="#ffd700" className="mb-6">
          <div className="bg-card p-8 text-center relative overflow-hidden">
            {/* Corner decorations */}
            {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-4 h-4`} style={{ borderColor: "#ffd700", borderStyle: "solid", borderWidth: i < 2 ? "2px 0 0 2px" : "0 2px 2px 0" }} />
            ))}

            <div className="mb-2 text-sm font-mono tracking-widest" style={{ color: "#8888aa" }}>
              PLAYER: DUY LE — CLASS IT16
            </div>

            <h1
              style={{
                fontFamily: "'Press Start 2P'",
                fontSize: "clamp(14px, 4vw, 28px)",
                lineHeight: 1.7,
                color: "#ffd700",
                textShadow: "0 0 20px #ffd70066, 0 0 40px #ffd70033",
              }}
            >
              LEVEL UP!
            </h1>

            <div
              className="mt-2 mb-6"
              style={{
                fontFamily: "'Press Start 2P'",
                fontSize: "clamp(6px, 1.5vw, 10px)",
                color: "#00e5ff",
                letterSpacing: "0.1em",
              }}
            >
              BACHELOR OF INFORMATION TECHNOLOGY
            </div>

            <div className="text-lg font-semibold mb-1" style={{ color: "#e8e8f0" }}>
              You have been summoned to witness
            </div>
            <div className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>
              The Grand Graduation Ceremony
            </div>

            {/* Event details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "📅 DATE", value: "August 6", sub: "Graduation Day" },
                { label: "🕐 TIME", value: "9:00 AM", sub: "Doors open 7:00 AM" },
                { label: "📍 LOCATION", value: "Van Lang University", sub: "69/68 Dang Thuy Tram, An Nhon, HCMC" },
              ].map(item => (
                <div
                  key={item.label}
                  className="p-4"
                  style={{ background: "#0a0a20", border: "1px solid rgba(0,229,255,0.2)" }}
                >
                  <div className="font-mono text-xs tracking-widest mb-1" style={{ color: "#8888aa" }}>{item.label}</div>
                  <div className="text-base font-bold">{item.value}</div>
                  <div className="text-sm" style={{ color: "#8888aa" }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* XP Progress */}
            <div className="mb-6">
              <XPBar value={14700} max={15000} color="#ffd700" label="Academic XP — Degree Progress" />
            </div>

            {/* RSVP Button */}
            <button
              onClick={() => { setRsvpClicked(true); setShowPopup(true); }}
              className="relative px-10 py-4 font-bold text-lg tracking-widest uppercase transition-all duration-150 active:scale-95 cursor-pointer"
              style={{
                fontFamily: "'Press Start 2P'",
                fontSize: "11px",
                background: rsvpClicked ? "#22c55e" : "#ffd700",
                color: "#080818",
                boxShadow: rsvpClicked
                  ? "0 0 0 2px #22c55e, 0 6px 0 #166534, 0 0 20px #22c55e66"
                  : "0 0 0 2px #ffd700, 0 6px 0 #92400e, 0 0 20px #ffd70066",
                transform: rsvpClicked ? "translateY(4px)" : "translateY(0)",
                letterSpacing: "0.2em",
              }}
            >
              {rsvpClicked ? "✓ QUEST ACCEPTED!" : "► ACCEPT QUEST"}
            </button>

            {rsvpClicked && (
              <div className="mt-3 font-mono text-xs" style={{ color: "#22c55e" }}>
                RSVP confirmed — see you on the battlefield!
              </div>
            )}
          </div>
        </PixelBorder>

        {/* ── TWO COLUMN: QUEST LOG + STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

          {/* Quest Log */}
          <PixelBorder color="#a855f7">
            <div className="bg-card p-5">
              <div
                className="font-mono text-xs tracking-[0.25em] mb-4 pb-2 uppercase flex items-center gap-2"
                style={{ color: "#a855f7", borderBottom: "1px solid rgba(168,85,247,0.3)" }}
              >
                <span>📋</span> QUEST LOG
              </div>
              <div className="space-y-2">
                {QUESTS.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span
                      className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center font-mono text-xs"
                      style={{
                        color: q.done ? "#22c55e" : "#ffd700",
                        border: `1px solid ${q.done ? "#22c55e" : "#ffd700"}`,
                        background: q.done ? "rgba(34,197,94,0.1)" : "transparent",
                      }}
                    >
                      {q.done ? "✓" : "○"}
                    </span>
                    <span style={{
                      color: q.done ? "#8888aa" : "#e8e8f0",
                      textDecoration: q.done ? "line-through" : "none",
                      textDecorationColor: "#4444aa",
                    }}>
                      {q.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(168,85,247,0.2)" }}>
                <div className="font-mono text-xs" style={{ color: "#8888aa" }}>
                  5/6 QUESTS COMPLETE <BlinkingCursor />
                </div>
              </div>
            </div>
          </PixelBorder>

          {/* Character Stats */}
          <PixelBorder color="#00e5ff">
            <div className="bg-card p-5">
              <div
                className="font-mono text-xs tracking-[0.25em] mb-4 pb-2 uppercase flex items-center gap-2"
                style={{ color: "#00e5ff", borderBottom: "1px solid rgba(0,229,255,0.3)" }}
              >
                <span>⚡</span> CHARACTER STATS
              </div>
              <div className="space-y-3 mb-4">
                {STATS.map(s => (
                  <StatBar key={s.label} {...s} />
                ))}
              </div>
              <div className="pt-3" style={{ borderTop: "1px solid rgba(0,229,255,0.2)" }}>
                <div className="flex justify-between text-xs font-mono">
                  <span style={{ color: "#8888aa" }}>CLASS</span>
                  <span style={{ color: "#ffd700" }}>PRODUCT ANALYST LVL 1</span>
                </div>
                <div className="flex justify-between text-xs font-mono mt-1">
                  <span style={{ color: "#8888aa" }}>TIME PLAYED</span>
                  <span style={{ color: "#e8e8f0" }}>1,820 DAYS</span>
                </div>
                <div className="flex justify-between text-xs font-mono mt-1">
                  <span style={{ color: "#8888aa" }}>GUILD</span>
                  <span style={{ color: "#e8e8f0" }}>VAN LANG UNIVERSITY</span>
                </div>
              </div>
            </div>
          </PixelBorder>
        </div>

        {/* ── ACHIEVEMENTS ── */}
        <PixelBorder color="#ffd700" className="mb-6">
          <div className="bg-card p-5">
            <div
              className="font-mono text-xs tracking-[0.25em] mb-5 pb-2 uppercase flex items-center justify-between"
              style={{ color: "#ffd700", borderBottom: "1px solid rgba(255,215,0,0.3)" }}
            >
              <span>🏆 ACHIEVEMENTS EARNED</span>
              <span style={{ color: "#8888aa" }}>{ACHIEVEMENTS.length}/{ACHIEVEMENTS.length} UNLOCKED</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((ach, i) => (
                <div
                  key={ach.id}
                  className="achievement-card flex items-start gap-3 p-3 cursor-default transition-all duration-200"
                  style={{
                    background: "rgba(255,215,0,0.05)",
                    border: "1px solid rgba(255,215,0,0.25)",
                    opacity: showAchievements ? 1 : 0,
                    transform: showAchievements ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`,
                  }}
                >
                  <span
                    className="text-2xl flex-shrink-0 flex items-center justify-center w-12 h-12"
                    style={{
                      animation: "blink-badge 3s ease-in-out infinite",
                      animationDelay: `${i * 0.7}s`,
                      background: "rgba(255,215,0,0.1)",
                    }}
                  >
                    {ach.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm leading-tight" style={{ color: "#ffd700" }}>{ach.title}</div>
                    <div className="text-xs mt-0.5 mb-2 leading-relaxed" style={{ color: "#8888aa" }}>{ach.desc}</div>
                    <div className="font-mono text-xs" style={{ color: "#22c55e" }}>+{ach.xp.toLocaleString()} XP</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,215,0,0.2)" }}>
              <XPBar value={totalXP} max={20000} color="#ffd700" label="Total Achievement XP" />
            </div>
          </div>
        </PixelBorder>

        {/* ── FOOTER / CLOSING ── */}
        <div className="text-center">
          <PixelBorder color="#00e5ff">
            <div className="bg-card px-8 py-6">
              <div className="font-mono text-xs tracking-widest mb-3" style={{ color: "#8888aa" }}>
                — PERSONAL MESSAGE FROM THE GUILD MASTER —
              </div>
              <p className="text-base leading-relaxed" style={{ color: "#c8c8e0" }}>
                "Keep striving, keep learning ceaselessly, and keep becoming a better person."
              </p>
              <div className="mt-4 font-bold text-sm" style={{ color: "#ffd700" }}>
                — Prof. Phong Pham, Head of Product Management
              </div>
            </div>
          </PixelBorder>

          <div className="mt-6 font-mono text-xs" style={{ color: "#333366" }}>
            GAME SAVE: GRADUATION_CEREMONY_2025.SAV • AUTO-SAVE ENABLED • MEMORY: 1,460 DAYS STORED
          </div>
          <div className="mt-1 font-mono text-xs flex items-center justify-center gap-2" style={{ color: "#333366" }}>
            <span>PRESS</span>
            <span
              className="px-2 py-0.5 text-xs"
              style={{ border: "1px solid #333366", color: "#555588" }}
            >
              RSVP
            </span>
            <span>TO CONTINUE</span>
            <BlinkingCursor />
          </div>
        </div>

      </div>
    </div>
  );
}