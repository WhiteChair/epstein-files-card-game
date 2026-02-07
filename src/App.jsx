import { useState, useEffect, useCallback, useRef } from "react";

const DISCLAIMER = `⚠️ DISCLAIMER: This game uses publicly reported data from the Epstein Files released by the U.S. Department of Justice (Jan 2026) and prior court document unsealing (Jan 2024). Mention counts are based on reporting by PBS, CNN, CBS, NBC, AP, and the Epstein Index methodology. Appearance in these documents does NOT imply criminal conduct or wrongdoing. No individual listed has been charged with a crime connected to the Epstein investigation. This is an educational/trivia game only.`;

const TRIVIA_QUESTIONS = [
  {
    id: 1,
    question: "Who took the most flights on Epstein's private jet (the 'Lolita Express')?",
    options: ["Donald Trump", "Bill Clinton", "Prince Andrew", "Alan Dershowitz"],
    correct: 1,
    explanation: "Bill Clinton appeared on flight logs at least 26–27 times according to records obtained in 2016, flying to destinations across Asia, Africa, and Europe. His office claims he took only 4 trips. Ghislaine Maxwell (not listed) flew the most overall as Epstein's close associate.",
    source: "Flight logs filed with FAA; Fox News, Business Insider, DocumentCloud archives",
    emoji: "✈️",
  },
  {
    id: 2,
    question: "Who is documented as visiting Epstein's Little St. James island most frequently?",
    options: ["Bill Clinton", "Prince Andrew", "Ghislaine Maxwell", "Bill Gates"],
    correct: 2,
    explanation: "Ghislaine Maxwell was a near-permanent fixture on Little St. James as Epstein's close associate and convicted accomplice. Former staff reported Prince Andrew visited multiple times, and Ehud Barak visited 'multiple times from 2014-2015,' but Maxwell's presence was virtually constant.",
    source: "Wikipedia (Little Saint James); court testimony; victim statements; WIRED 2024 data investigation",
    emoji: "🏝️",
  },
  {
    id: 3,
    question: "How many times does the word 'pizza' appear in the DOJ Epstein Files released Jan 2026?",
    options: ["About 50 times", "About 200 times", "About 859 times", "About 3,000 times"],
    correct: 2,
    explanation: "The word 'pizza' appears approximately 859–911 times across the 3.5 million pages. Many appear in ordinary email contexts (meal planning, social events), though some exchanges raised questions due to unusual phrasing. Authorities stress no evidence links these to the debunked 'Pizzagate' conspiracy.",
    source: "UNILAD, LADbible, Breaking Points, Sunday Guardian (Feb 2026); DOJ Epstein Library",
    emoji: "🍕",
  },
  {
    id: 4,
    question: "How is Davos / the World Economic Forum connected to the Epstein files?",
    options: [
      "Epstein spoke at Davos in 2018",
      "WEF CEO Børge Brende had dinners & emails with Epstein",
      "Klaus Schwab visited Epstein's island",
      "Davos is not mentioned at all"
    ],
    correct: 1,
    explanation: "WEF President & CEO Børge Brende attended at least 3 business dinners with Epstein in 2018–2019, and exchanged emails and texts. The WEF launched an independent investigation into Brende in Feb 2026. Brende was mentioned 60+ times in the files. Epstein called Brende a 'good friend' in a 2018 email to Larry Summers.",
    source: "The Hill, Reuters, Al Jazeera, Bloomberg, Swissinfo (Feb 2026)",
    emoji: "🏔️",
  },
  {
    id: 5,
    question: "Which countries did Epstein travel to most frequently based on flight logs and passport records?",
    options: [
      "UK, France, US Virgin Islands",
      "Japan, China, Australia",
      "Brazil, Argentina, Mexico",
      "Russia, India, South Africa"
    ],
    correct: 0,
    explanation: "Flight logs show heavy travel between NYC (Teterboro), Palm Beach, US Virgin Islands (Little St. James), Paris/France, and London/UK. Passport records also show trips to Israel, Africa (multiple nations), Germany, Belgium, Norway, Russia, and planned trips to Afghanistan and Kazakhstan. His main circuit was NYC → Palm Beach → USVI → Paris → London.",
    source: "ABC News (passport records Jan 2024); flight logs; Fox News; Lolita Express Wikipedia",
    emoji: "🌍",
  },
  {
    id: 6,
    question: "Which financial institution had the longest and most costly relationship with Epstein?",
    options: ["Goldman Sachs", "JPMorgan Chase", "Deutsche Bank", "Bank of America"],
    correct: 1,
    explanation: "JPMorgan Chase banked Epstein for 15 years (1998–2013), processing over $1 billion in transactions across 134 accounts. They paid a $290M settlement to victims. Deutsche Bank took over from 2013–2018, opening 40+ accounts and paying $75M in settlements plus $150M in regulatory fines. Bank of America handled hundreds of millions but filed only 2 delayed SARs.",
    source: "CNBC, CNN, NPR, Fortune, Compliance Week; House Judiciary Committee (Rep. Raskin letters)",
    emoji: "🏦",
  },
];

const PEOPLE = [
  { name: "Ghislaine Maxwell", mentions: 5000, category: "Inner Circle", desc: "Epstein's confidant, convicted of sex trafficking, serving 20 years", tier: "S" },
  { name: "Donald Trump", mentions: 3000, category: "Politics", desc: "U.S. President — thousands of references across files, mostly news clippings & gossip", tier: "S" },
  { name: "Bill Clinton", mentions: 1500, category: "Politics", desc: "Former U.S. President — flew on Epstein's jet, photos at NYC residence", tier: "S" },
  { name: "Andrew Mountbatten-Windsor", mentions: 900, category: "Royalty", desc: "Formerly Prince Andrew — several hundred direct references, emails, photos", tier: "A" },
  { name: "Steve Tisch", mentions: 400, category: "Business", desc: "NY Giants co-owner — 400+ mentions, emails about connecting with women", tier: "A" },
  { name: "Steve Bannon", mentions: 350, category: "Politics", desc: "Former Trump adviser — frequent text exchanges, gossip about Trump", tier: "A" },
  { name: "Ehud Barak", mentions: 300, category: "Politics", desc: "Former Israeli PM — frequent contact, stayed at Epstein's NY residence", tier: "A" },
  { name: "Larry Summers", mentions: 250, category: "Academia", desc: "Former Treasury Secretary & Harvard President — many dinners, named in will", tier: "A" },
  { name: "Peter Attia", mentions: 200, category: "Celebrity", desc: "Anti-aging influencer — hundreds of emails, acknowledged friendship", tier: "B" },
  { name: "Bill Gates", mentions: 180, category: "Tech", desc: "Microsoft co-founder — extensive documented relationship, draft letters about him", tier: "B" },
  { name: "Woody Allen", mentions: 150, category: "Entertainment", desc: "Filmmaker — photos at estates, dinner invites, Caribbean trips", tier: "B" },
  { name: "Sarah Ferguson", mentions: 120, category: "Royalty", desc: "Duchess of York — Epstein paid her debts, sought his media advice", tier: "B" },
  { name: "Jean-Luc Brunel", mentions: 110, category: "Inner Circle", desc: "Model scout — accused of abuse, died by suicide in 2022 while under investigation", tier: "B" },
  { name: "Alan Dershowitz", mentions: 100, category: "Legal", desc: "Harvard Law professor — named in court documents, denied accusations", tier: "B" },
  { name: "Casey Wasserman", mentions: 80, category: "Business", desc: "2028 LA Olympics president — flirty emails with Maxwell", tier: "B" },
  { name: "Elon Musk", mentions: 70, category: "Tech", desc: "Tesla/SpaceX CEO — emails about island visits, Caribbean Christmas invites", tier: "C" },
  { name: "Richard Branson", mentions: 60, category: "Business", desc: "Virgin Group founder — emails referencing 'harem', advised on reputation", tier: "C" },
  { name: "Howard Lutnick", mentions: 55, category: "Politics", desc: "U.S. Commerce Secretary — visited island with family", tier: "C" },
  { name: "Sergey Brin", mentions: 50, category: "Tech", desc: "Google co-founder — planned meetings at townhouse, accused of island visit", tier: "C" },
  { name: "Noam Chomsky", mentions: 40, category: "Academia", desc: "MIT linguist — photographed on Epstein's aircraft, regular meetings", tier: "C" },
  { name: "Naomi Campbell", mentions: 35, category: "Celebrity", desc: "Supermodel — appears in contact lists", tier: "C" },
  { name: "Harvey Weinstein", mentions: 30, category: "Entertainment", desc: "Former film producer (imprisoned) — referenced in documents", tier: "C" },
  { name: "Mick Jagger", mentions: 28, category: "Celebrity", desc: "Rolling Stones frontman — appears in photos and contact lists", tier: "C" },
  { name: "Deepak Chopra", mentions: 25, category: "Celebrity", desc: "Wellness guru — email exchanges arranging dinners", tier: "D" },
  { name: "Martha Stewart", mentions: 22, category: "Celebrity", desc: "TV personality — tried to get Epstein's cell number, dinner invites", tier: "D" },
  { name: "Katie Couric", mentions: 20, category: "Media", desc: "Journalist — praised Epstein's 'ROCKIN' lasagna' at dinner party", tier: "D" },
  { name: "David Blaine", mentions: 18, category: "Entertainment", desc: "Illusionist — photographed performing for Epstein", tier: "D" },
  { name: "Brett Ratner", mentions: 16, category: "Entertainment", desc: "Film director — photos on couch with Epstein", tier: "D" },
  { name: "Josh Harris", mentions: 15, category: "Business", desc: "Commanders/76ers owner — attended breakfast with Gates at Epstein's estate", tier: "D" },
  { name: "Chris Tucker", mentions: 12, category: "Entertainment", desc: "Actor/comedian — flight logs", tier: "D" },
  { name: "David Copperfield", mentions: 12, category: "Entertainment", desc: "Magician — referenced in documents", tier: "D" },
  { name: "Narendra Modi", mentions: 10, category: "Politics", desc: "Indian PM — referenced in email about 2017 Israel visit", tier: "D" },
  { name: "Dr. Mehmet Oz", mentions: 8, category: "Celebrity", desc: "TV doctor / HHS official — Epstein paid for his travel in 2004", tier: "E" },
  { name: "Reid Hoffman", mentions: 8, category: "Tech", desc: "LinkedIn founder — referenced in emails with Musk", tier: "E" },
  { name: "Ralph Fiennes", mentions: 6, category: "Entertainment", desc: "Actor — appears in contact records", tier: "E" },
  { name: "Courtney Love", mentions: 5, category: "Celebrity", desc: "Musician/actress — referenced in files", tier: "E" },
  { name: "Stephen Hawking", mentions: 5, category: "Academia", desc: "Physicist (deceased) — referenced regarding sponsored conference", tier: "E" },
  { name: "Michael Jackson", mentions: 4, category: "Entertainment", desc: "Singer (deceased) — mentioned in passing in court documents", tier: "E" },
  { name: "Al Gore", mentions: 4, category: "Politics", desc: "Former U.S. Vice President — listed in documents", tier: "E" },
  { name: "Bill Richardson", mentions: 4, category: "Politics", desc: "Former NM Governor (deceased) — mentioned in court documents", tier: "E" },
  { name: "Russell Wilson", mentions: 3, category: "Sports", desc: "NFL quarterback — considered buying Epstein's jet", tier: "E" },
  { name: "Jeff Bezos", mentions: 2, category: "Tech", desc: "Amazon founder — mentioned at Maxwell after-party with Clinton", tier: "F" },
  { name: "Miroslav Lajčák", mentions: 2, category: "Politics", desc: "Former UN General Assembly president — resigned after file release", tier: "F" },
  { name: "Thomas Pritzker", mentions: 2, category: "Business", desc: "Hyatt Hotels chairman — emails coordinating visits", tier: "F" },
  { name: "Leonardo DiCaprio", mentions: 1, category: "Entertainment", desc: "Actor — Epstein asked Chopra if DiCaprio would want dinner", tier: "F" },
];

const TIER_COLORS = {
  S: { bg: "#dc2626", glow: "rgba(220,38,38,0.4)", text: "#fff" },
  A: { bg: "#ea580c", glow: "rgba(234,88,12,0.4)", text: "#fff" },
  B: { bg: "#d97706", glow: "rgba(217,119,6,0.4)", text: "#fff" },
  C: { bg: "#65a30d", glow: "rgba(101,163,13,0.4)", text: "#fff" },
  D: { bg: "#0891b2", glow: "rgba(8,145,178,0.4)", text: "#fff" },
  E: { bg: "#7c3aed", glow: "rgba(124,58,237,0.4)", text: "#fff" },
  F: { bg: "#6b7280", glow: "rgba(107,114,128,0.4)", text: "#fff" },
};

const CATEGORY_ICONS = {
  "Inner Circle": "🕸️", Politics: "🏛️", Royalty: "👑", Business: "💼",
  Tech: "💻", Entertainment: "🎬", Celebrity: "⭐", Academia: "🎓",
  Legal: "⚖️", Media: "📺", Sports: "🏈",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Card({ person, onClick, selected, revealed, isWinner, isLoser, small }) {
  const tc = TIER_COLORS[person.tier];
  const icon = CATEGORY_ICONS[person.category] || "📄";
  return (
    <div
      onClick={onClick}
      style={{
        width: small ? 160 : 200,
        minHeight: small ? 220 : 260,
        background: selected
          ? `linear-gradient(135deg, #1a1a2e 0%, ${tc.bg}22 100%)`
          : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: selected ? `2px solid ${tc.bg}` : revealed ? (isWinner ? "2px solid #22c55e" : isLoser ? "2px solid #ef4444" : "2px solid #374151") : "2px solid #374151",
        borderRadius: 16,
        padding: small ? 12 : 16,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        boxShadow: selected ? `0 0 20px ${tc.glow}` : isWinner ? "0 0 20px rgba(34,197,94,0.4)" : isLoser ? "0 0 20px rgba(239,68,68,0.3)" : "0 4px 12px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        overflow: "hidden",
        transform: selected ? "translateY(-4px)" : "none",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "absolute", top: 8, right: 8, background: tc.bg, color: tc.text, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
        {person.tier}
      </div>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ fontSize: small ? 13 : 15, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2 }}>{person.name}</div>
      <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{person.category}</div>
      {revealed ? (
        <>
          <div style={{ fontSize: 28, fontWeight: 900, color: tc.bg, fontFamily: "'Courier New', monospace" }}>
            {person.mentions.toLocaleString()}
          </div>
          <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.3 }}>{person.desc}</div>
        </>
      ) : (
        <div style={{ fontSize: 36, color: "#374151", textAlign: "center", marginTop: 8 }}>?</div>
      )}
      {isWinner && <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: 18 }}>✅</div>}
      {isLoser && <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: 18 }}>💀</div>}
    </div>
  );
}


function FireCanvas({ width, height }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = 2;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const spawn = () => {
      for (let i = 0; i < 4; i++) {
        particles.current.push({
          x: width * 0.15 + Math.random() * width * 0.7,
          y: height - 20 + Math.random() * 30,
          vx: (Math.random() - 0.5) * 2,
          vy: -(2 + Math.random() * 4),
          r: 10 + Math.random() * 22,
          life: 1,
          decay: 0.006 + Math.random() * 0.012,
          hue: 10 + Math.random() * 35,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      spawn();
      particles.current = particles.current.filter(p => p.life > 0);
      for (const p of particles.current) {
        p.x += p.vx + (Math.random() - 0.5) * 1.2;
        p.y += p.vy;
        p.vy *= 0.988;
        p.life -= p.decay;
        p.r *= 0.997;
        const a = Math.min(1, p.life * 1.4);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        if (p.life > 0.55) {
          g.addColorStop(0, `rgba(255,255,220,${a * 0.9})`);
          g.addColorStop(0.2, `rgba(255,${160 + p.hue},30,${a * 0.85})`);
          g.addColorStop(0.5, `rgba(255,${60 + p.hue},0,${a * 0.5})`);
          g.addColorStop(1, `rgba(200,20,0,0)`);
        } else {
          g.addColorStop(0, `rgba(255,${70 + p.hue},0,${a * 0.6})`);
          g.addColorStop(0.4, `rgba(180,30,0,${a * 0.3})`);
          g.addColorStop(1, `rgba(50,5,0,0)`);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      // Heat haze near base
      ctx.fillStyle = `rgba(255,100,0,${0.03 + Math.random() * 0.04})`;
      ctx.fillRect(width * 0.1, height * 0.7, width * 0.8, height * 0.3);

      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width, height,
        position: "absolute",
        bottom: -10,
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}
    />
  );
}

function HawkingOnFire({ show, onDone }) {
  const [visible, setVisible] = useState(false);
  const [speechIdx, setSpeechIdx] = useState(0);

  const speeches = [
    "Even black holes\nemit radiation...\nand so does your gameplay.",
    "The universe doesn't\nallow perfection.\nNeither do you.",
    "Intelligence is the\nability to adapt...\nyou should try it.",
    "Not even quantum mechanics\ncan explain this pick.",
    "I've seen singularities\nwith better judgment.",
    "Look up at the stars,\nnot at the scoreboard.",
  ];

  useEffect(() => {
    if (show) {
      setVisible(true);
      setSpeechIdx(Math.floor(Math.random() * speeches.length));
      const t = setTimeout(() => { setVisible(false); onDone?.(); }, 5500);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  const sparks = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,
    delay: Math.random() * 3,
    dur: 1 + Math.random() * 1.5,
    size: 2 + Math.random() * 4,
    drift: (Math.random() - 0.5) * 80,
  }));

  return (
    <div onClick={() => { setVisible(false); onDone?.(); }} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.93)", cursor: "pointer",
      animation: "hkFadeIn 0.4s ease",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes hkFadeIn { from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)} }
        @keyframes hkFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes hkGlow {
          0%,100%{filter:drop-shadow(0 0 8px rgba(255,80,0,0.3))}
          50%{filter:drop-shadow(0 0 30px rgba(255,50,0,0.6)) drop-shadow(0 0 60px rgba(255,120,0,0.2))}
        }
        @keyframes hkWheelSpin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes hkScreenBlink { 0%,92%,100%{opacity:1} 95%{opacity:0.2} }
        @keyframes hkCursor { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes hkHeadTilt { 0%,100%{transform:rotate(-7deg) translateY(0)} 50%{transform:rotate(-4deg) translateY(-2px)} }
        @keyframes hkTextIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hkSpark {
          0%{transform:translateY(0) translateX(0) scale(1);opacity:0}
          15%{opacity:1}
          100%{transform:translateY(-180px) translateX(var(--hkDrift)) scale(0);opacity:0}
        }
        @keyframes hkFlicker {
          0%,100%{opacity:1;color:#ff4500}
          25%{opacity:0.85;color:#ff6a00}
          50%{opacity:0.7;color:#ffaa00}
          75%{opacity:1;color:#ff2200}
        }
        @keyframes hkBubbleIn {
          0%{transform:scale(0);opacity:0}
          70%{transform:scale(1.04);opacity:1}
          100%{transform:scale(1);opacity:1}
        }
        @keyframes hkBreath { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.008)} }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {/* Character + fire container */}
        <div style={{ position: "relative", width: 320, height: 400 }}>
          <FireCanvas width={320} height={400} />

          {/* Embers */}
          {sparks.map(s => (
            <div key={s.id} style={{
              position: "absolute", bottom: 60, left: `${s.left}%`,
              width: s.size, height: s.size, borderRadius: "50%",
              background: `hsl(${18 + Math.random() * 25},100%,${55 + Math.random() * 35}%)`,
              boxShadow: `0 0 ${s.size * 3}px hsl(${20 + Math.random() * 20},100%,50%)`,
              animation: `hkSpark ${s.dur}s ease-out ${s.delay}s infinite`,
              "--hkDrift": `${s.drift}px`,
              pointerEvents: "none",
            }} />
          ))}

          {/* Character SVG */}
          <div style={{
            position: "absolute", bottom: 15, left: "50%", transform: "translateX(-50%)",
            animation: "hkFloat 3s ease-in-out infinite, hkGlow 2.5s ease infinite",
          }}>
            <svg width="260" height="320" viewBox="0 0 260 320">
              <defs>
                <linearGradient id="hkChairG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a5568"/><stop offset="100%" stopColor="#1a202c"/>
                </linearGradient>
                <linearGradient id="hkSeatG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e1e30"/><stop offset="100%" stopColor="#0d0d18"/>
                </linearGradient>
                <linearGradient id="hkSkinG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fde8c8"/><stop offset="100%" stopColor="#e8c8a0"/>
                </linearGradient>
                <linearGradient id="hkSuitG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e3a5f"/><stop offset="100%" stopColor="#142a48"/>
                </linearGradient>
                <linearGradient id="hkShirtG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e8f0ff"/><stop offset="100%" stopColor="#c0d4f0"/>
                </linearGradient>
                <radialGradient id="hkFireRef" cx="50%" cy="40%">
                  <stop offset="0%" stopColor="rgba(255,90,0,0.12)"/><stop offset="100%" stopColor="transparent"/>
                </radialGradient>
                <filter id="hkShadow"><feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/></filter>
              </defs>

              {/* ========== MOTORIZED WHEELCHAIR ========== */}
              <g filter="url(#hkShadow)">
                {/* Frame rails */}
                <rect x="48" y="168" width="124" height="7" rx="3.5" fill="url(#hkChairG)"/>
                {/* Back uprights */}
                <rect x="50" y="52" width="5" height="120" rx="2.5" fill="url(#hkChairG)"/>
                <rect x="165" y="92" width="5" height="80" rx="2.5" fill="url(#hkChairG)"/>
                {/* Headrest bracket */}
                <rect x="46" y="42" width="60" height="5" rx="2.5" fill="#4a5568"/>
                {/* Headrest cushion */}
                <rect x="48" y="30" width="56" height="18" rx="8" fill="url(#hkSeatG)" stroke="#2a2a3e" strokeWidth="1.2"/>
                {/* Side head supports */}
                <ellipse cx="50" cy="38" rx="5" ry="8" fill="#1a1a2e" stroke="#2a2a3e" strokeWidth="0.8"/>
                <ellipse cx="102" cy="38" rx="5" ry="8" fill="#1a1a2e" stroke="#2a2a3e" strokeWidth="0.8"/>
                {/* Backrest cushion */}
                <path d="M52 50 Q52 46 56 46 L96 46 Q100 46 100 50 L100 164 Q100 168 96 168 L56 168 Q52 168 52 164 Z"
                  fill="url(#hkSeatG)" stroke="#2a2a3e" strokeWidth="1"/>
                {/* Padding stitches */}
                <line x1="64" y1="52" x2="64" y2="162" stroke="#222235" strokeWidth="0.5"/>
                <line x1="76" y1="48" x2="76" y2="166" stroke="#222235" strokeWidth="0.5"/>
                <line x1="88" y1="52" x2="88" y2="162" stroke="#222235" strokeWidth="0.5"/>
                {/* Seat cushion */}
                <rect x="50" y="160" width="118" height="14" rx="5" fill="url(#hkSeatG)" stroke="#2a2a3e" strokeWidth="1"/>

                {/* Armrests */}
                <rect x="36" y="128" width="18" height="7" rx="3.5" fill="url(#hkChairG)"/>
                <rect x="166" y="128" width="18" height="7" rx="3.5" fill="url(#hkChairG)"/>
                <rect x="37" y="124" width="16" height="5" rx="2.5" fill="url(#hkSeatG)" stroke="#2a2a3e" strokeWidth="0.7"/>
                <rect x="167" y="124" width="16" height="5" rx="2.5" fill="url(#hkSeatG)" stroke="#2a2a3e" strokeWidth="0.7"/>

                {/* Joystick on right armrest */}
                <rect x="170" y="116" width="10" height="12" rx="2.5" fill="#0f172a" stroke="#334155" strokeWidth="0.8"/>
                <circle cx="175" cy="119" r="3" fill="#1e293b" stroke="#475569" strokeWidth="0.7"/>
                <circle cx="175" cy="119" r="1.2" fill="#ef4444"/>

                {/* Motor housing */}
                <rect x="62" y="174" width="96" height="10" rx="3" fill="#111520" stroke="#2a2a3e" strokeWidth="1"/>
                {/* Battery LEDs */}
                <rect x="90" y="176" width="6" height="6" rx="1" fill="#22c55e" opacity="0.7"/>
                <rect x="98" y="176" width="6" height="6" rx="1" fill="#22c55e" opacity="0.5"/>
                <rect x="106" y="176" width="6" height="6" rx="1" fill="#22c55e" opacity="0.25"/>

                {/* LEFT WHEEL */}
                <g style={{transformOrigin:"65px 228px",animation:"hkWheelSpin 2s linear infinite"}}>
                  <circle cx="65" cy="228" r="36" fill="#0a0a14" stroke="#3d4a5c" strokeWidth="6"/>
                  <circle cx="65" cy="228" r="30" fill="none" stroke="#2d3748" strokeWidth="1.5"/>
                  <circle cx="65" cy="228" r="7" fill="#5a6577" stroke="#7a8599" strokeWidth="1.5"/>
                  <circle cx="65" cy="228" r="2.5" fill="#8a96a8"/>
                  {[0,30,60,90,120,150].map(a=>(
                    <line key={a} x1={65+9*Math.cos(a*Math.PI/180)} y1={228+9*Math.sin(a*Math.PI/180)}
                      x2={65+28*Math.cos(a*Math.PI/180)} y2={228+28*Math.sin(a*Math.PI/180)}
                      stroke="#4a5568" strokeWidth="1.2"/>
                  ))}
                  {/* Tire tread */}
                  {Array.from({length:24},(_,i)=>i*15).map(a=>(
                    <line key={`tl${a}`} x1={65+32*Math.cos(a*Math.PI/180)} y1={228+32*Math.sin(a*Math.PI/180)}
                      x2={65+36*Math.cos(a*Math.PI/180)} y2={228+36*Math.sin(a*Math.PI/180)}
                      stroke="#1a1a28" strokeWidth="2"/>
                  ))}
                </g>

                {/* RIGHT WHEEL */}
                <g style={{transformOrigin:"155px 228px",animation:"hkWheelSpin 2s linear infinite"}}>
                  <circle cx="155" cy="228" r="36" fill="#0a0a14" stroke="#3d4a5c" strokeWidth="6"/>
                  <circle cx="155" cy="228" r="30" fill="none" stroke="#2d3748" strokeWidth="1.5"/>
                  <circle cx="155" cy="228" r="7" fill="#5a6577" stroke="#7a8599" strokeWidth="1.5"/>
                  <circle cx="155" cy="228" r="2.5" fill="#8a96a8"/>
                  {[0,30,60,90,120,150].map(a=>(
                    <line key={a} x1={155+9*Math.cos(a*Math.PI/180)} y1={228+9*Math.sin(a*Math.PI/180)}
                      x2={155+28*Math.cos(a*Math.PI/180)} y2={228+28*Math.sin(a*Math.PI/180)}
                      stroke="#4a5568" strokeWidth="1.2"/>
                  ))}
                  {Array.from({length:24},(_,i)=>i*15).map(a=>(
                    <line key={`tr${a}`} x1={155+32*Math.cos(a*Math.PI/180)} y1={228+32*Math.sin(a*Math.PI/180)}
                      x2={155+36*Math.cos(a*Math.PI/180)} y2={228+36*Math.sin(a*Math.PI/180)}
                      stroke="#1a1a28" strokeWidth="2"/>
                  ))}
                </g>

                {/* Front casters + forks */}
                <line x1="130" y1="178" x2="140" y2="258" stroke="#4a5568" strokeWidth="2.5"/>
                <circle cx="142" cy="262" r="9" fill="#0a0a14" stroke="#3d4a5c" strokeWidth="4"/>
                <circle cx="142" cy="262" r="2.5" fill="#5a6577"/>
                {/* Rear anti-tip */}
                <line x1="58" y1="178" x2="46" y2="252" stroke="#4a5568" strokeWidth="2"/>
                <circle cx="44" cy="256" r="5" fill="#0a0a14" stroke="#3d4a5c" strokeWidth="2.5"/>

                {/* Footrests */}
                <line x1="68" y1="175" x2="58" y2="268" stroke="#4a5568" strokeWidth="2"/>
                <line x1="152" y1="175" x2="162" y2="268" stroke="#4a5568" strokeWidth="2"/>
                <rect x="48" y="266" width="20" height="5" rx="2" fill="#4a5568"/>
                <rect x="152" y="266" width="20" height="5" rx="2" fill="#4a5568"/>
              </g>

              {/* ========== COMMUNICATION SCREEN ========== */}
              <g>
                <rect x="178" y="108" width="4" height="20" rx="2" fill="#4a5568"/>
                <rect x="170" y="86" width="48" height="32" rx="4" fill="#0a0a14" stroke="#334155" strokeWidth="1.5"/>
                <rect x="174" y="90" width="40" height="24" rx="2" fill="#050d18" style={{animation:"hkScreenBlink 10s ease infinite"}}/>
                <rect x="178" y="94" width="26" height="1.8" rx="1" fill="#00ff41" opacity="0.85"/>
                <rect x="178" y="98" width="32" height="1.8" rx="1" fill="#00ff41" opacity="0.65"/>
                <rect x="178" y="102" width="18" height="1.8" rx="1" fill="#00ff41" opacity="0.5"/>
                <rect x="178" y="106" width="28" height="1.8" rx="1" fill="#00ff41" opacity="0.7"/>
                <rect x="208" y="106" width="2.5" height="2.5" fill="#00ff41" style={{animation:"hkCursor 1s step-end infinite"}}/>
              </g>

              {/* ========== PERSON ========== */}
              <g style={{animation:"hkBreath 4s ease-in-out infinite"}}>
                {/* Legs */}
                <rect x="82" y="170" width="18" height="52" rx="5" fill="#1a2030"/>
                <rect x="120" y="170" width="18" height="52" rx="5" fill="#1a2030"/>
                {/* Shoes */}
                <ellipse cx="91" cy="224" rx="12" ry="6" fill="#0f0f18"/>
                <ellipse cx="129" cy="224" rx="12" ry="6" fill="#0f0f18"/>
                {/* Shoe highlights */}
                <ellipse cx="91" cy="222" rx="8" ry="2" fill="rgba(255,255,255,0.05)"/>
                <ellipse cx="129" cy="222" rx="8" ry="2" fill="rgba(255,255,255,0.05)"/>

                {/* Torso - dark suit with subtle structure */}
                <path d="M80 92 Q78 120 76 150 Q76 168 86 170 L134 170 Q144 168 144 150 Q142 120 140 92 Z"
                  fill="url(#hkSuitG)" stroke="#0f2035" strokeWidth="0.8"/>
                {/* Suit lapels */}
                <path d="M98 92 L110 118 L106 92" fill="#142a48" opacity="0.7"/>
                <path d="M122 92 L110 118 L114 92" fill="#142a48" opacity="0.7"/>
                {/* Shirt V visible */}
                <path d="M100 90 L110 106 L120 90" fill="url(#hkShirtG)"/>
                {/* Tie */}
                <path d="M108 102 L110 152 L112 102" fill="#7a1a1a"/>
                <path d="M107 98 L110 104 L113 98 Z" fill="#8b2020"/>
                {/* Suit button */}
                <circle cx="110" cy="130" r="2" fill="#2a3a50" stroke="#1a2a40" strokeWidth="0.5"/>

                {/* Left arm + hand */}
                <path d="M80 100 Q62 118 50 130" fill="none" stroke="#1e3a5f" strokeWidth="14" strokeLinecap="round"/>
                <path d="M80 100 Q62 118 50 130" fill="none" stroke="#142a48" strokeWidth="12" strokeLinecap="round"/>
                <ellipse cx="48" cy="130" rx="7" ry="5" fill="url(#hkSkinG)" stroke="#d8b888" strokeWidth="0.6"/>
                {/* Fingers */}
                {[-3,0,3,6].map((dx,i)=>(
                  <line key={`fl${i}`} x1={44+dx} y1="128" x2={43+dx} y2="124" stroke="#d8b888" strokeWidth="1.5" strokeLinecap="round"/>
                ))}

                {/* Right arm + hand (near joystick) */}
                <path d="M140 100 Q158 118 170 124" fill="none" stroke="#1e3a5f" strokeWidth="14" strokeLinecap="round"/>
                <path d="M140 100 Q158 118 170 124" fill="none" stroke="#142a48" strokeWidth="12" strokeLinecap="round"/>
                <ellipse cx="172" cy="122" rx="7" ry="5" fill="url(#hkSkinG)" stroke="#d8b888" strokeWidth="0.6"/>
                {/* Right fingers curling over joystick */}
                <path d="M175 119 Q177 116 176 114" fill="none" stroke="#d8b888" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M173 118 Q174 115 173 113" fill="none" stroke="#d8b888" strokeWidth="1.3" strokeLinecap="round"/>

                {/* Seatbelt */}
                <path d="M58 110 Q108 104 140 110" fill="none" stroke="#8b7355" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                <rect x="104" y="105" width="7" height="7" rx="1" fill="#6b7280" stroke="#5a6577" strokeWidth="0.5"/>

                {/* Neck */}
                <rect x="102" y="76" width="16" height="18" rx="6" fill="url(#hkSkinG)"/>
              </g>

              {/* ========== HEAD — tilted, detailed, glasses, smile ========== */}
              <g style={{transformOrigin:"110px 48px",animation:"hkHeadTilt 5s ease-in-out infinite"}}>
                {/* Head shape */}
                <ellipse cx="110" cy="44" rx="26" ry="32" fill="url(#hkSkinG)" stroke="#d0a878" strokeWidth="0.8"/>

                {/* Hair — thin, grey, receding */}
                <path d="M86 28 Q92 12 110 8 Q128 12 134 28" fill="none" stroke="#9a8a78" strokeWidth="1.8" opacity="0.7"/>
                <path d="M88 32 Q95 16 110 12 Q125 16 132 32" fill="none" stroke="#8a7a68" strokeWidth="1.2" opacity="0.5"/>
                <path d="M90 34 Q98 20 110 16 Q122 20 130 34" fill="none" stroke="#7a6a58" strokeWidth="0.8" opacity="0.35"/>
                {/* Side hair tufts */}
                <path d="M84 32 Q80 40 82 52 Q83 58 86 62" fill="none" stroke="#8a7a68" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                <path d="M136 32 Q140 40 138 52 Q137 58 134 62" fill="none" stroke="#8a7a68" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                {/* Back hair */}
                <path d="M86 30 Q82 35 82 40" fill="none" stroke="#7a6a58" strokeWidth="1.5" opacity="0.3"/>
                <path d="M134 30 Q138 35 138 40" fill="none" stroke="#7a6a58" strokeWidth="1.5" opacity="0.3"/>

                {/* Ears */}
                <ellipse cx="84" cy="46" rx="5" ry="8" fill="url(#hkSkinG)" stroke="#c8a878" strokeWidth="0.5"/>
                <path d="M82 43 Q80 46 82 49" fill="none" stroke="#c8a878" strokeWidth="0.4"/>
                <ellipse cx="136" cy="45" rx="5" ry="8" fill="url(#hkSkinG)" stroke="#c8a878" strokeWidth="0.5"/>

                {/* Forehead wrinkles */}
                <path d="M96 24 Q110 22 124 24" fill="none" stroke="#d0b090" strokeWidth="0.5" opacity="0.5"/>
                <path d="M98 27 Q110 25 122 27" fill="none" stroke="#d0b090" strokeWidth="0.4" opacity="0.4"/>

                {/* Eyebrows — bushy, expressive */}
                <path d="M94 32 Q100 28 106 31" fill="none" stroke="#6a5a48" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M114 31 Q120 28 126 32" fill="none" stroke="#6a5a48" strokeWidth="2.2" strokeLinecap="round"/>

                {/* ===== BIG THICK GLASSES ===== */}
                {/* Left lens */}
                <rect x="90" y="34" width="22" height="17" rx="8.5" fill="rgba(180,200,230,0.1)" stroke="#4a5568" strokeWidth="2.5"/>
                {/* Right lens */}
                <rect x="114" y="34" width="22" height="17" rx="8.5" fill="rgba(180,200,230,0.1)" stroke="#4a5568" strokeWidth="2.5"/>
                {/* Bridge */}
                <line x1="112" y1="42" x2="114" y2="42" stroke="#4a5568" strokeWidth="2.5"/>
                {/* Temple arms */}
                <line x1="90" y1="40" x2="84" y2="42" stroke="#4a5568" strokeWidth="2"/>
                <line x1="136" y1="40" x2="136" y2="42" stroke="#4a5568" strokeWidth="2"/>
                {/* Lens reflections */}
                <ellipse cx="98" cy="40" rx="4" ry="2.5" fill="rgba(255,255,255,0.08)" transform="rotate(-12 98 40)"/>
                <ellipse cx="122" cy="40" rx="4" ry="2.5" fill="rgba(255,255,255,0.08)" transform="rotate(-12 122 40)"/>
                {/* Fire reflection in lenses */}
                <ellipse cx="103" cy="46" rx="3" ry="2" fill="rgba(255,100,0,0.08)"/>
                <ellipse cx="127" cy="46" rx="3" ry="2" fill="rgba(255,100,0,0.08)"/>

                {/* Eyes behind lenses */}
                <ellipse cx="101" cy="43" rx="4.5" ry="3.5" fill="#f8f4f0"/>
                <ellipse cx="125" cy="43" rx="4.5" ry="3.5" fill="#f8f4f0"/>
                {/* Iris */}
                <circle cx="102" cy="43" r="2.8" fill="#4a7a9a"/>
                <circle cx="126" cy="43" r="2.8" fill="#4a7a9a"/>
                {/* Pupil */}
                <circle cx="102.5" cy="42.5" r="1.3" fill="#1a1a2e"/>
                <circle cx="126.5" cy="42.5" r="1.3" fill="#1a1a2e"/>
                {/* Eye glint */}
                <circle cx="103.5" cy="41.8" r="0.7" fill="#fff" opacity="0.9"/>
                <circle cx="127.5" cy="41.8" r="0.7" fill="#fff" opacity="0.9"/>
                {/* Crow's feet */}
                <path d="M88 40 L86 38 M88 42 L85 43 M88 44 L86 46" fill="none" stroke="#c8a878" strokeWidth="0.4" opacity="0.4"/>
                <path d="M132 40 L134 38 M132 42 L135 43 M132 44 L134 46" fill="none" stroke="#c8a878" strokeWidth="0.4" opacity="0.4"/>

                {/* Nose */}
                <path d="M110 40 Q108 48 104 52 Q108 54 116 52 Q112 48 110 40" fill="none" stroke="#c0a070" strokeWidth="0.8"/>

                {/* ===== WARM SMILE ===== */}
                <path d="M96 58 Q104 67 110 65 Q118 67 124 58" fill="none" stroke="#7a4a2a" strokeWidth="2.2" strokeLinecap="round"/>
                {/* Teeth */}
                <path d="M100 60 Q110 66 120 60" fill="#f8f0e0" opacity="0.6"/>
                {/* Upper lip */}
                <path d="M98 58 Q110 56 122 58" fill="none" stroke="#a07050" strokeWidth="0.6"/>
                {/* Smile creases */}
                <path d="M93 54 Q91 58 93 62" fill="none" stroke="#c0a070" strokeWidth="0.5" opacity="0.5"/>
                <path d="M127 53 Q129 57 127 61" fill="none" stroke="#c0a070" strokeWidth="0.5" opacity="0.5"/>
                {/* Nasolabial */}
                <path d="M100 50 Q96 55 95 60" fill="none" stroke="#c8a878" strokeWidth="0.4" opacity="0.35"/>
                <path d="M120 49 Q124 54 125 59" fill="none" stroke="#c8a878" strokeWidth="0.4" opacity="0.35"/>
                {/* Chin */}
                <path d="M104 66 Q110 72 116 66" fill="none" stroke="#d0b090" strokeWidth="0.5" opacity="0.3"/>

                {/* Fire reflection on face */}
                <ellipse cx="110" cy="46" rx="24" ry="28" fill="url(#hkFireRef)"/>
              </g>
            </svg>
          </div>
        </div>

        {/* Speech bubble */}
        <div style={{
          background: "rgba(15,23,42,0.95)", border: "1.5px solid rgba(255,69,0,0.5)",
          borderRadius: 14, padding: "12px 22px", maxWidth: 300,
          animation: "hkBubbleIn 0.6s ease 0.4s both",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent",
            borderBottom: "7px solid rgba(255,69,0,0.5)",
          }}/>
          <div style={{
            fontSize: 14, color: "#fbbf24", fontStyle: "italic",
            whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.5,
            fontFamily: "Georgia,'Times New Roman',serif",
          }}>
            {speeches[speechIdx]}
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 26, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase",
          textAlign: "center",
          background: "linear-gradient(180deg,#ff6a00,#ff0000,#ff4500)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 15px rgba(255,69,0,0.6))",
          animation: "hkTextIn 0.5s ease 0.2s both",
        }}>
          🔥 WORST PICK 🔥
        </div>
        <div style={{ fontSize: 12, color: "#64748b", animation: "hkTextIn 0.8s ease 0.6s both" }}>
          You picked the most mentioned name · tap to dismiss
        </div>
      </div>
    </div>
  );
}
function FishBucket({ show, onDone }) {
  const [visible, setVisible] = useState(false);
  const [fish, setFish] = useState([]);
  useEffect(() => {
    if (show) {
      setVisible(true);
      setFish(Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: 15 + Math.random() * 70,
        delay: Math.random() * 0.6,
        dur: 0.8 + Math.random() * 0.6,
        rot: -180 + Math.random() * 360,
        size: 22 + Math.random() * 30,
        type: ["🐟","🐠","🐡","🦈","🐟","🐠","🐟","🎣"][Math.floor(Math.random()*8)],
      })));
      const t = setTimeout(() => { setVisible(false); onDone?.(); }, 4500);
      return () => clearTimeout(t);
    }
  }, [show]);
  if (!visible) return null;
  return (
    <div onClick={() => { setVisible(false); onDone?.(); }} style={{
      position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(0,20,40,0.92)",cursor:"pointer",animation:"fishFadeIn 0.4s ease",overflow:"hidden",
    }}>
      <style>{`
        @keyframes fishFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fishFall{
          0%{transform:translateY(-120vh) rotate(0deg) scale(0.3);opacity:0}
          15%{opacity:1}
          70%{transform:translateY(10vh) rotate(var(--fRot)) scale(1);opacity:1}
          85%{transform:translateY(-5vh) rotate(calc(var(--fRot)*0.5)) scale(0.95)}
          100%{transform:translateY(8vh) rotate(var(--fRot)) scale(1);opacity:0.8}
        }
        @keyframes bucketSwing{
          0%,100%{transform:rotate(-5deg)}
          50%{transform:rotate(5deg)}
        }
        @keyframes splashUp{
          0%{transform:translateY(0) scale(1);opacity:1}
          100%{transform:translateY(-80px) scale(0.3);opacity:0}
        }
        @keyframes fishTextPop{
          0%{transform:scale(0);opacity:0}
          50%{transform:scale(1.15)}
          100%{transform:scale(1);opacity:1}
        }
      `}</style>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
        {/* Falling fish */}
        {fish.map(f=>(
          <div key={f.id} style={{
            position:"fixed",left:`${f.x}%`,top:0,fontSize:f.size,
            animation:`fishFall ${f.dur}s ease-in ${f.delay}s both`,
            "--fRot":`${f.rot}deg`,pointerEvents:"none",
          }}>{f.type}</div>
        ))}
        {/* Water splashes */}
        {Array.from({length:8}).map((_,i)=>(
          <div key={`sp${i}`} style={{
            position:"fixed",bottom:`${5+Math.random()*10}%`,left:`${10+Math.random()*80}%`,
            fontSize:18+Math.random()*14,
            animation:`splashUp 1s ease-out ${0.8+Math.random()*0.6}s both`,
            pointerEvents:"none",
          }}>💦</div>
        ))}
        {/* Bucket SVG */}
        <div style={{animation:"bucketSwing 1.5s ease-in-out infinite",marginTop:40}}>
          <svg width="180" height="200" viewBox="0 0 180 200">
            <defs>
              <linearGradient id="bucketG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B7355"/><stop offset="100%" stopColor="#5C4A32"/>
              </linearGradient>
            </defs>
            {/* Bucket body */}
            <path d="M30 60 L20 180 Q20 195 90 195 Q160 195 160 180 L150 60 Z" fill="url(#bucketG)" stroke="#4A3520" strokeWidth="2"/>
            {/* Bucket bands */}
            <path d="M25 80 Q90 85 155 80" fill="none" stroke="#3A2810" strokeWidth="3"/>
            <path d="M22 140 Q90 145 158 140" fill="none" stroke="#3A2810" strokeWidth="3"/>
            {/* Bucket rim */}
            <ellipse cx="90" cy="60" rx="62" ry="12" fill="#9A8465" stroke="#4A3520" strokeWidth="2"/>
            <ellipse cx="90" cy="58" rx="58" ry="10" fill="#6A5A42"/>
            {/* Handle */}
            <path d="M35 55 Q90 -10 145 55" fill="none" stroke="#6A5A42" strokeWidth="5" strokeLinecap="round"/>
            {/* Water inside */}
            <ellipse cx="90" cy="62" rx="54" ry="8" fill="rgba(50,140,200,0.5)"/>
            {/* Fish sticking out */}
            <text x="60" y="52" fontSize="28" transform="rotate(-20,60,52)">🐟</text>
            <text x="100" y="48" fontSize="24" transform="rotate(15,100,48)">🐠</text>
            <text x="80" y="42" fontSize="20" transform="rotate(-5,80,42)">🐡</text>
            {/* Dripping water */}
            <circle cx="50" cy="185" r="3" fill="rgba(80,180,255,0.6)"/>
            <circle cx="120" cy="190" r="2.5" fill="rgba(80,180,255,0.5)"/>
          </svg>
        </div>
        {/* Text */}
        <div style={{
          fontSize:28,fontWeight:900,letterSpacing:3,textAlign:"center",
          color:"#38bdf8",textShadow:"0 0 20px rgba(56,189,248,0.5)",
          animation:"fishTextPop 0.6s ease 0.3s both",
        }}>
          🐟 YOU ARE TOO INNOCENT 🐟
        </div>
        <div style={{fontSize:14,color:"#7dd3fc",animation:"fishTextPop 0.8s ease 0.5s both",textAlign:"center"}}>
          A bucket full of fish rains upon you!<br/>Barely in the files!
        </div>
        <div style={{fontSize:11,color:"#475569",animation:"fishTextPop 1s ease 0.8s both"}}>tap to dismiss</div>
      </div>
    </div>
  );
}

function WallStreetBull({ show, onDone }) {
  const [visible, setVisible] = useState(false);
  const quotes = [
    "The market always wins.\nSo do you... almost.",
    "Buy low, sell high.\nYou picked... medium.",
    "Not bad, not great.\nThe bull watches.",
    "A mediocre play.\nWall Street has seen worse.",
  ];
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    if (show) {
      setVisible(true);
      setQuoteIdx(Math.floor(Math.random()*quotes.length));
      const t = setTimeout(() => { setVisible(false); onDone?.(); }, 4500);
      return () => clearTimeout(t);
    }
  }, [show]);
  if (!visible) return null;
  return (
    <div onClick={() => { setVisible(false); onDone?.(); }} style={{
      position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(0,8,0,0.92)",cursor:"pointer",animation:"bullFadeIn 0.4s ease",overflow:"hidden",
    }}>
      <style>{`
        @keyframes bullFadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
        @keyframes bullBreath{0%,100%{transform:scaleY(1) translateY(0)}50%{transform:scaleY(1.01) translateY(-3px)}}
        @keyframes bullSnort{0%,70%,100%{opacity:0}75%,95%{opacity:0.7}}
        @keyframes bullGlow{0%,100%{filter:drop-shadow(0 0 10px rgba(34,197,94,0.3))}50%{filter:drop-shadow(0 0 25px rgba(34,197,94,0.6))}}
        @keyframes bullTextIn{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
        @keyframes stockTicker{from{transform:translateX(100%)}to{transform:translateX(-200%)}}
        @keyframes chartLine{from{stroke-dashoffset:800}to{stroke-dashoffset:0}}
      `}</style>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
        {/* Stock ticker bar at top */}
        <div style={{position:"fixed",top:0,left:0,right:0,height:32,background:"#0a1a0a",borderBottom:"1px solid #22c55e33",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{whiteSpace:"nowrap",animation:"stockTicker 12s linear infinite",color:"#22c55e",fontSize:12,fontFamily:"'Courier New',monospace",fontWeight:700}}>
            &nbsp;&nbsp;&nbsp;▲ EPSTEIN +999% &nbsp;&nbsp; ▼ INNOCENCE -50% &nbsp;&nbsp; ▲ SCANDAL +420% &nbsp;&nbsp; ▼ REPUTATION -100% &nbsp;&nbsp; ▲ DRAMA +777% &nbsp;&nbsp; ▼ TRUST -88% &nbsp;&nbsp; ▲ EPSTEIN +999% &nbsp;&nbsp; ▼ INNOCENCE -50%
          </div>
        </div>

        {/* Bull SVG */}
        <div style={{animation:"bullBreath 3s ease-in-out infinite, bullGlow 2.5s ease infinite",marginTop:40}}>
          <svg width="280" height="260" viewBox="0 0 280 260">
            <defs>
              <linearGradient id="bullBronze" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#cd9b1d"/><stop offset="50%" stopColor="#8B6914"/><stop offset="100%" stopColor="#aa8520"/>
              </linearGradient>
              <linearGradient id="bullDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7a5a10"/><stop offset="100%" stopColor="#4a3508"/>
              </linearGradient>
              <filter id="bullMetal">
                <feSpecularLighting surfaceScale="3" specularConstant="0.8" specularExponent="20" result="spec">
                  <fePointLight x="140" y="50" z="120"/>
                </feSpecularLighting>
                <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.3" k4="0"/>
              </filter>
            </defs>
            {/* Background chart line */}
            <polyline points="10,200 40,180 70,190 100,140 130,160 160,100 190,120 220,60 250,80 270,40"
              fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.2"
              strokeDasharray="800" style={{animation:"chartLine 3s ease both"}}/>

            {/* === CHARGING BULL BODY === */}
            <g>
              {/* Massive body */}
              <ellipse cx="150" cy="145" rx="75" ry="50" fill="url(#bullBronze)" stroke="#6a4a08" strokeWidth="1.5"/>
              {/* Muscle definition */}
              <path d="M100 120 Q120 110 130 125" fill="none" stroke="#9a7a18" strokeWidth="1.5" opacity="0.6"/>
              <path d="M160 115 Q175 108 185 120" fill="none" stroke="#9a7a18" strokeWidth="1.5" opacity="0.6"/>
              <path d="M115 150 Q140 165 165 150" fill="none" stroke="#7a5a10" strokeWidth="1" opacity="0.4"/>
              {/* Chest */}
              <ellipse cx="100" cy="140" rx="30" ry="42" fill="url(#bullBronze)" stroke="#6a4a08" strokeWidth="1"/>
              {/* Neck - thick, powerful */}
              <path d="M85 115 Q70 90 65 75 Q60 65 75 60 L95 62 Q105 70 100 90 Q98 105 95 120" fill="url(#bullBronze)" stroke="#6a4a08" strokeWidth="1"/>

              {/* HEAD */}
              <ellipse cx="68" cy="62" rx="28" ry="22" fill="url(#bullBronze)" stroke="#6a4a08" strokeWidth="1.2"/>
              {/* Snout */}
              <ellipse cx="48" cy="68" rx="16" ry="12" fill="url(#bullDark)" stroke="#5a4508" strokeWidth="1"/>
              {/* Nostrils */}
              <ellipse cx="44" cy="66" rx="3" ry="2.5" fill="#3a2505"/>
              <ellipse cx="52" cy="66" rx="3" ry="2.5" fill="#3a2505"/>
              {/* Snort steam */}
              <circle cx="38" cy="62" r="4" fill="rgba(200,200,200,0.15)" style={{animation:"bullSnort 3s ease infinite"}}/>
              <circle cx="34" cy="58" r="3" fill="rgba(200,200,200,0.1)" style={{animation:"bullSnort 3s ease 0.3s infinite"}}/>
              {/* Eyes - intense */}
              <ellipse cx="58" cy="54" rx="5" ry="4" fill="#1a0a00"/>
              <ellipse cx="78" cy="52" rx="5" ry="4" fill="#1a0a00"/>
              <circle cx="57" cy="53" r="2" fill="#8B4513"/>
              <circle cx="77" cy="51" r="2" fill="#8B4513"/>
              <circle cx="57.5" cy="52.5" r="0.8" fill="#ff6a00"/>
              <circle cx="77.5" cy="50.5" r="0.8" fill="#ff6a00"/>

              {/* HORNS - curved, metallic */}
              <path d="M55 45 Q40 20 30 10 Q28 6 32 5" fill="none" stroke="url(#bullBronze)" strokeWidth="6" strokeLinecap="round"/>
              <path d="M80 42 Q95 18 105 8 Q107 4 103 3" fill="none" stroke="url(#bullBronze)" strokeWidth="6" strokeLinecap="round"/>
              {/* Horn tips */}
              <circle cx="32" cy="5" r="3" fill="#f0d880"/>
              <circle cx="103" cy="3" r="3" fill="#f0d880"/>
              {/* Horn highlights */}
              <path d="M50 38 Q42 22 34 12" fill="none" stroke="#ddb840" strokeWidth="1.5" opacity="0.4"/>
              <path d="M82 36 Q92 20 100 10" fill="none" stroke="#ddb840" strokeWidth="1.5" opacity="0.4"/>
              {/* Ears */}
              <ellipse cx="52" cy="42" rx="6" ry="4" fill="url(#bullDark)" transform="rotate(-30,52,42)"/>
              <ellipse cx="85" cy="40" rx="6" ry="4" fill="url(#bullDark)" transform="rotate(30,85,40)"/>

              {/* FRONT LEGS - planted, powerful */}
              <rect x="82" y="175" width="16" height="55" rx="5" fill="url(#bullBronze)" stroke="#6a4a08" strokeWidth="1"/>
              <rect x="105" y="178" width="16" height="52" rx="5" fill="url(#bullBronze)" stroke="#6a4a08" strokeWidth="1"/>
              {/* Hooves front */}
              <rect x="80" y="226" width="20" height="10" rx="4" fill="#4a3508" stroke="#3a2505" strokeWidth="1"/>
              <rect x="103" y="226" width="20" height="10" rx="4" fill="#4a3508" stroke="#3a2505" strokeWidth="1"/>

              {/* BACK LEGS - coiled */}
              <rect x="175" y="172" width="18" height="58" rx="6" fill="url(#bullBronze)" stroke="#6a4a08" strokeWidth="1"/>
              <rect x="198" y="168" width="18" height="62" rx="6" fill="url(#bullBronze)" stroke="#6a4a08" strokeWidth="1"/>
              {/* Hooves back */}
              <rect x="173" y="226" width="22" height="10" rx="4" fill="#4a3508"/>
              <rect x="196" y="226" width="22" height="10" rx="4" fill="#4a3508"/>

              {/* TAIL - raised, curved */}
              <path d="M225 130 Q240 110 248 95 Q255 82 258 78" fill="none" stroke="url(#bullBronze)" strokeWidth="5" strokeLinecap="round"/>
              <path d="M258 78 Q262 72 256 68 Q250 72 254 78" fill="url(#bullDark)"/>

              {/* Pedestal base */}
              <rect x="60" y="236" width="175" height="8" rx="4" fill="#2a2a2a" stroke="#444" strokeWidth="1"/>
              <rect x="50" y="242" width="195" height="12" rx="3" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
              {/* Plaque */}
              <rect x="105" y="244" width="80" height="8" rx="2" fill="#3a3a2a" stroke="#5a5a3a" strokeWidth="0.5"/>
              <text x="145" y="250" textAnchor="middle" fontSize="5" fill="#aa9a60" fontFamily="serif" fontWeight="700">WALL STREET</text>
            </g>
          </svg>
        </div>

        {/* Quote */}
        <div style={{
          background:"rgba(10,26,10,0.9)",border:"1.5px solid rgba(34,197,94,0.4)",
          borderRadius:12,padding:"10px 20px",maxWidth:280,
          animation:"bullTextIn 0.6s ease 0.4s both",textAlign:"center",
        }}>
          <div style={{fontSize:13,color:"#4ade80",fontStyle:"italic",whiteSpace:"pre-line",lineHeight:1.5,fontFamily:"Georgia,serif"}}>
            {quotes[quoteIdx]}
          </div>
        </div>

        <div style={{
          fontSize:24,fontWeight:900,letterSpacing:3,textAlign:"center",
          color:"#22c55e",textShadow:"0 0 15px rgba(34,197,94,0.5)",
          animation:"bullTextIn 0.5s ease 0.2s both",
        }}>
          🐂 MIDDLE OF THE PACK 🐂
        </div>
        <div style={{fontSize:12,color:"#475569",animation:"bullTextIn 0.8s ease 0.6s both"}}>
          Not the worst, not the best · tap to dismiss
        </div>
      </div>
    </div>
  );
}

function EvilGameOver({ show, onDone }) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhaseAnim] = useState(0);
  useEffect(() => {
    if (show) {
      setVisible(true);
      setPhaseAnim(0);
      const t1 = setTimeout(() => setPhaseAnim(1), 800);
      const t2 = setTimeout(() => setPhaseAnim(2), 2200);
      const t3 = setTimeout(() => { setVisible(false); onDone?.(); }, 6000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [show]);
  if (!visible) return null;
  return (
    <div onClick={() => { setVisible(false); onDone?.(); }} style={{
      position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(0,0,0,0.96)",cursor:"pointer",animation:"evilFadeIn 0.8s ease",overflow:"hidden",
    }}>
      <style>{`
        @keyframes evilFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes evilGrow{from{transform:scale(0.3);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes evilPulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 20px rgba(200,0,0,0.5))}50%{transform:scale(1.03);filter:drop-shadow(0 0 40px rgba(255,0,0,0.8))}}
        @keyframes evilFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes handReach{
          0%{transform:translateY(100vh) rotate(0deg);opacity:0}
          40%{opacity:1}
          100%{transform:translateY(0) rotate(-5deg);opacity:1}
        }
        @keyframes handReach2{
          0%{transform:translateY(100vh) rotate(0deg);opacity:0}
          40%{opacity:1}
          100%{transform:translateY(0) rotate(8deg);opacity:1}
        }
        @keyframes fingerWiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
        @keyframes evilEyeGlow{0%,100%{fill:#ff0000;opacity:0.8}50%{fill:#ff4400;opacity:1}}
        @keyframes smokeEvil{
          0%{transform:translateY(0) scale(1);opacity:0.3}
          100%{transform:translateY(-100px) scale(2);opacity:0}
        }
        @keyframes evilTextSlam{
          0%{transform:scale(3) rotate(-10deg);opacity:0}
          60%{transform:scale(0.95) rotate(1deg);opacity:1}
          100%{transform:scale(1) rotate(0deg);opacity:1}
        }
        @keyframes chainRattle{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
      `}</style>

      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20,position:"relative"}}>
        {/* Dark smoke */}
        {Array.from({length:10}).map((_,i)=>(
          <div key={i} style={{
            position:"fixed",bottom:`${-10+Math.random()*30}%`,left:`${Math.random()*100}%`,
            width:80+Math.random()*120,height:80+Math.random()*120,borderRadius:"50%",
            background:`radial-gradient(circle,rgba(40,0,0,${0.2+Math.random()*0.2}),transparent)`,
            animation:`smokeEvil ${3+Math.random()*3}s ease ${Math.random()*2}s infinite`,
            pointerEvents:"none",
          }}/>
        ))}

        {/* Reaching skeleton hands from below */}
        {phase >= 1 && (
          <>
            <div style={{position:"fixed",bottom:0,left:"8%",animation:"handReach 1.2s ease both",transformOrigin:"bottom center"}}>
              <svg width="120" height="280" viewBox="0 0 120 280" style={{animation:"fingerWiggle 2s ease infinite"}}>
                {/* Left skeleton hand */}
                <g stroke="#d4c5a0" fill="none" strokeWidth="3" strokeLinecap="round">
                  {/* Forearm bones */}
                  <line x1="55" y1="280" x2="55" y2="140"/>
                  <line x1="65" y1="280" x2="65" y2="140"/>
                  {/* Wrist */}
                  <ellipse cx="60" cy="135" rx="14" ry="8" fill="#c4b590" stroke="#a09070" strokeWidth="1.5"/>
                  {/* Palm */}
                  <path d="M46 135 Q45 110 50 100 L70 100 Q75 110 74 135" fill="#c4b590" stroke="#a09070" strokeWidth="1.5"/>
                  {/* Fingers - bony, curling */}
                  <path d="M50 100 Q48 75 44 55 Q42 45 46 40" strokeWidth="4"/>
                  <path d="M56 98 Q54 68 52 42 Q50 32 54 28" strokeWidth="4"/>
                  <path d="M63 97 Q62 65 60 38 Q58 26 62 22" strokeWidth="4"/>
                  <path d="M70 100 Q72 72 70 48 Q68 38 72 34" strokeWidth="4"/>
                  {/* Thumb */}
                  <path d="M46 125 Q32 115 28 100 Q26 92 30 88" strokeWidth="4"/>
                  {/* Knuckle dots */}
                  <circle cx="45" cy="55" r="3" fill="#b0a080"/>
                  <circle cx="53" cy="42" r="3" fill="#b0a080"/>
                  <circle cx="61" cy="38" r="3" fill="#b0a080"/>
                  <circle cx="71" cy="48" r="3" fill="#b0a080"/>
                </g>
              </svg>
            </div>
            <div style={{position:"fixed",bottom:0,right:"8%",animation:"handReach2 1.4s ease 0.2s both",transformOrigin:"bottom center"}}>
              <svg width="120" height="280" viewBox="0 0 120 280" style={{animation:"fingerWiggle 2.2s ease 0.5s infinite",transform:"scaleX(-1)"}}>
                <g stroke="#d4c5a0" fill="none" strokeWidth="3" strokeLinecap="round">
                  <line x1="55" y1="280" x2="55" y2="140"/>
                  <line x1="65" y1="280" x2="65" y2="140"/>
                  <ellipse cx="60" cy="135" rx="14" ry="8" fill="#c4b590" stroke="#a09070" strokeWidth="1.5"/>
                  <path d="M46 135 Q45 110 50 100 L70 100 Q75 110 74 135" fill="#c4b590" stroke="#a09070" strokeWidth="1.5"/>
                  <path d="M50 100 Q48 75 44 55 Q42 45 46 40" strokeWidth="4"/>
                  <path d="M56 98 Q54 68 52 42 Q50 32 54 28" strokeWidth="4"/>
                  <path d="M63 97 Q62 65 60 38 Q58 26 62 22" strokeWidth="4"/>
                  <path d="M70 100 Q72 72 70 48 Q68 38 72 34" strokeWidth="4"/>
                  <path d="M46 125 Q32 115 28 100 Q26 92 30 88" strokeWidth="4"/>
                  <circle cx="45" cy="55" r="3" fill="#b0a080"/>
                  <circle cx="53" cy="42" r="3" fill="#b0a080"/>
                  <circle cx="61" cy="38" r="3" fill="#b0a080"/>
                  <circle cx="71" cy="48" r="3" fill="#b0a080"/>
                </g>
              </svg>
            </div>
          </>
        )}

        {/* Central evil figure */}
        <div style={{animation: phase>=0 ? "evilGrow 1s ease both" : "none"}}>
          <div style={{animation:"evilPulse 2s ease infinite, evilFloat 3s ease-in-out infinite"}}>
            <svg width="200" height="220" viewBox="0 0 200 220">
              <defs>
                <radialGradient id="evilAura" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="rgba(180,0,0,0.3)"/><stop offset="100%" stopColor="transparent"/>
                </radialGradient>
              </defs>
              {/* Dark aura */}
              <circle cx="100" cy="100" r="95" fill="url(#evilAura)"/>
              {/* Hooded cloak */}
              <path d="M50 80 Q48 50 65 30 Q80 15 100 10 Q120 15 135 30 Q152 50 150 80 L155 210 Q100 220 45 210 Z"
                fill="#0a0808" stroke="#2a1515" strokeWidth="1.5"/>
              {/* Inner hood shadow */}
              <path d="M60 75 Q58 50 72 35 Q85 22 100 18 Q115 22 128 35 Q142 50 140 75 Q120 85 100 88 Q80 85 60 75"
                fill="#150808"/>
              {/* Hood folds */}
              <path d="M65 60 Q80 55 85 70" fill="none" stroke="#1a0a0a" strokeWidth="1" opacity="0.5"/>
              <path d="M135 60 Q120 55 115 70" fill="none" stroke="#1a0a0a" strokeWidth="1" opacity="0.5"/>
              {/* Face - void black with glowing eyes */}
              <ellipse cx="100" cy="62" rx="30" ry="24" fill="#080404"/>
              {/* GLOWING RED EYES */}
              <ellipse cx="86" cy="58" rx="6" ry="3.5" style={{animation:"evilEyeGlow 1.5s ease infinite"}}/>
              <ellipse cx="114" cy="58" rx="6" ry="3.5" style={{animation:"evilEyeGlow 1.5s ease 0.3s infinite"}}/>
              {/* Eye glow halos */}
              <ellipse cx="86" cy="58" rx="10" ry="6" fill="rgba(255,0,0,0.15)"/>
              <ellipse cx="114" cy="58" rx="10" ry="6" fill="rgba(255,0,0,0.15)"/>
              {/* Sinister grin */}
              <path d="M80 72 Q90 82 100 80 Q110 82 120 72" fill="none" stroke="#5a0000" strokeWidth="2" strokeLinecap="round"/>
              {/* Grin teeth hints */}
              <path d="M85 74 L87 78 M92 77 L93 81 M100 79 L100 83 M107 77 L108 81 M115 74 L113 78"
                fill="none" stroke="#3a0000" strokeWidth="1.2"/>
              {/* Cloak body wrinkles */}
              <path d="M55 100 Q70 95 75 110" fill="none" stroke="#1a0808" strokeWidth="1" opacity="0.4"/>
              <path d="M145 100 Q130 95 125 110" fill="none" stroke="#1a0808" strokeWidth="1" opacity="0.4"/>
              <path d="M60 150 Q90 145 95 160" fill="none" stroke="#1a0808" strokeWidth="0.8" opacity="0.3"/>
              {/* Skeletal hands emerging from sleeves */}
              <path d="M50 160 Q42 155 38 145 Q36 140 40 136" fill="none" stroke="#c4b590" strokeWidth="3" strokeLinecap="round"/>
              <path d="M150 160 Q158 155 162 145 Q164 140 160 136" fill="none" stroke="#c4b590" strokeWidth="3" strokeLinecap="round"/>
              {/* Chains hanging */}
              <g style={{animation:"chainRattle 1s ease infinite"}}>
                <path d="M38 138 L34 148 L40 155 L36 165" fill="none" stroke="#6b7280" strokeWidth="2.5" opacity="0.6"/>
              </g>
              <g style={{animation:"chainRattle 1.2s ease 0.3s infinite"}}>
                <path d="M162 138 L166 148 L160 155 L164 165" fill="none" stroke="#6b7280" strokeWidth="2.5" opacity="0.6"/>
              </g>
            </svg>
          </div>
        </div>

        {/* Text */}
        {phase >= 2 && (
          <>
            <div style={{
              fontSize:32,fontWeight:900,letterSpacing:5,textTransform:"uppercase",
              color:"#dc2626",textShadow:"0 0 30px rgba(220,38,38,0.8), 0 0 60px rgba(220,38,38,0.4)",
              animation:"evilTextSlam 0.6s ease both",textAlign:"center",
            }}>
              ☠️ THE EVIL HAS COME ☠️
            </div>
            <div style={{fontSize:15,color:"#991b1b",animation:"evilTextSlam 0.8s ease 0.2s both",textAlign:"center"}}>
              Your soul has been claimed...
            </div>
            <div style={{fontSize:11,color:"#475569",animation:"evilTextSlam 1s ease 0.4s both"}}>
              tap to continue to results
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TriviaScreen({ onBack }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(new Array(TRIVIA_QUESTIONS.length).fill(null));
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = TRIVIA_QUESTIONS[current];

  const pick = (idx) => {
    if (answered[current] !== null) return;
    const newAnswered = [...answered];
    newAnswered[current] = idx;
    setAnswered(newAnswered);
    setSelected(idx);
    if (idx === q.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current < TRIVIA_QUESTIONS.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const pct = Math.round((score / TRIVIA_QUESTIONS.length) * 100);
    const grade = pct >= 80 ? "🏆 Expert Investigator" : pct >= 50 ? "🔍 Decent Detective" : "📰 Casual Reader";
    return (
      <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 48 }}>{pct >= 80 ? "🏆" : pct >= 50 ? "🔍" : "📰"}</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: "#e2e8f0", margin: 0 }}>Trivia Complete!</h2>
        <div style={{ fontSize: 40, fontWeight: 900, color: pct >= 80 ? "#22c55e" : pct >= 50 ? "#eab308" : "#ef4444" }}>
          {score}/{TRIVIA_QUESTIONS.length}
        </div>
        <div style={{ fontSize: 15, color: "#94a3b8" }}>{grade}</div>
        <div style={{ width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", gap: 8 }}>
          {TRIVIA_QUESTIONS.map((tq, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: 8, padding: "8px 12px", border: `1px solid ${answered[i] === tq.correct ? "#22c55e33" : "#ef444433"}`, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 18 }}>{tq.emoji}</span>
              <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{tq.question.slice(0, 60)}...</span>
              <span style={{ fontSize: 16 }}>{answered[i] === tq.correct ? "✅" : "❌"}</span>
            </div>
          ))}
        </div>
        <button onClick={onBack} style={{ padding: "12px 32px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
          ← Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #374151", borderRadius: 8, color: "#94a3b8", padding: "6px 16px", fontSize: 12, cursor: "pointer" }}>← Back</button>
        <div style={{ fontSize: 12, color: "#64748b" }}>Question {current + 1} of {TRIVIA_QUESTIONS.length} · Score: {score}</div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, background: "#1e293b", borderRadius: 2, marginBottom: 20 }}>
        <div style={{ height: "100%", width: `${((current + 1) / TRIVIA_QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 2, transition: "width 0.3s ease" }} />
      </div>
      {/* Question */}
      <div style={{ background: "#1e293b", borderRadius: 14, padding: 24, border: "1px solid #334155", marginBottom: 16 }}>
        <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>{q.emoji}</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#e2e8f0", textAlign: "center", lineHeight: 1.5 }}>{q.question}</div>
      </div>
      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {q.options.map((opt, idx) => {
          const isAnswered = answered[current] !== null;
          const isCorrect = idx === q.correct;
          const isSelected = answered[current] === idx;
          let bg = "#0f172a";
          let border = "1px solid #334155";
          if (isAnswered) {
            if (isCorrect) { bg = "rgba(34,197,94,0.15)"; border = "1.5px solid #22c55e"; }
            else if (isSelected) { bg = "rgba(239,68,68,0.15)"; border = "1.5px solid #ef4444"; }
          } else if (selected === idx) {
            bg = "rgba(99,102,241,0.15)"; border = "1.5px solid #6366f1";
          }
          return (
            <button key={idx} onClick={() => pick(idx)} style={{
              padding: "14px 16px", borderRadius: 10, background: bg, border, color: "#e2e8f0",
              fontSize: 14, fontWeight: 600, cursor: isAnswered ? "default" : "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s ease",
            }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isAnswered && isCorrect ? "#22c55e" : isAnswered && isSelected ? "#ef4444" : "#1e293b", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                {isAnswered ? (isCorrect ? "✓" : isSelected ? "✗" : String.fromCharCode(65 + idx)) : String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {/* Explanation */}
      {answered[current] !== null && (
        <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 16, border: "1px solid #334155", marginBottom: 16, animation: "fadeIn 0.3s ease" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: answered[current] === q.correct ? "#22c55e" : "#ef4444", marginBottom: 6 }}>
            {answered[current] === q.correct ? "✅ Correct!" : `❌ Wrong — Answer: ${q.options[q.correct]}`}
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{q.explanation}</div>
          <div style={{ fontSize: 10, color: "#475569", marginTop: 8, fontStyle: "italic" }}>📎 Source: {q.source}</div>
        </div>
      )}
      {/* Next button */}
      {answered[current] !== null && (
        <button onClick={next} style={{
          width: "100%", padding: "14px", borderRadius: 10,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
          fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
        }}>
          {current < TRIVIA_QUESTIONS.length - 1 ? "Next Question →" : "See Results 🏆"}
        </button>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

function HealthBar({ hp, name, active }) {
  const pct = Math.max(0, hp) / 100;
  const color = pct > 0.6 ? "#22c55e" : pct > 0.3 ? "#eab308" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: active ? 1 : 0.5 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", minWidth: 80 }}>{name}</span>
      <div style={{ flex: 1, height: 16, background: "#1e293b", borderRadius: 8, overflow: "hidden", border: "1px solid #334155" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 8, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 30, textAlign: "right", fontFamily: "'Courier New', monospace" }}>{Math.max(0, hp)}</span>
    </div>
  );
}

export default function EpsteinFilesGame() {
  const [screen, setScreen] = useState("menu");
  const [playerCount, setPlayerCount] = useState(1);
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4"]);
  const [players, setPlayers] = useState([]);
  const [deck, setDeck] = useState([]);
  const [round, setRound] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [hands, setHands] = useState([]);
  const [selections, setSelections] = useState([]);
  const [phase, setPhase] = useState("pick");
  const [roundResult, setRoundResult] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showTrivia, setShowTrivia] = useState(false);
  const [gameLog, setGameLog] = useState([]);
  const [showHawking, setShowHawking] = useState(false);
  const [showFish, setShowFish] = useState(false);
  const [showBull, setShowBull] = useState(false);
  const [showEvil, setShowEvil] = useState(false);
  const deckRef = useRef([]);

  const startGame = () => {
    const d = shuffle(PEOPLE);
    deckRef.current = [...d];
    const p = [];
    for (let i = 0; i < playerCount; i++) {
      p.push({ name: playerNames[i] || `Player ${i + 1}`, hp: 100 });
    }
    setPlayers(p);
    setDeck(d);
    setRound(1);
    setCurrentPlayer(0);
    setSelections(new Array(playerCount).fill(null));
    setGameLog([]);
    dealHands(d, playerCount);
    setPhase("pick");
    setRoundResult(null);
    setScreen("game");
  };

  const dealHands = (currentDeck, pc) => {
    const cardsPerHand = 3;
    const needed = pc * cardsPerHand;
    let d = [...currentDeck];
    if (d.length < needed) {
      d = shuffle(PEOPLE);
      deckRef.current = [...d];
    }
    const h = [];
    for (let i = 0; i < pc; i++) {
      h.push(d.splice(0, cardsPerHand));
    }
    setHands(h);
    setDeck(d);
    deckRef.current = d;
  };

  const selectCard = (cardIdx) => {
    if (phase !== "pick") return;
    const newSel = [...selections];
    newSel[currentPlayer] = cardIdx;
    setSelections(newSel);

    if (playerCount === 1) {
      resolveSolo(hands[0][cardIdx]);
    } else {
      const nextPlayer = currentPlayer + 1;
      if (nextPlayer < playerCount) {
        setCurrentPlayer(nextPlayer);
      } else {
        resolveMulti(newSel);
      }
    }
  };

  const resolveSolo = (card) => {
    setPhase("reveal");
    const damage = Math.floor(card.mentions / 10);
    const clampedDmg = Math.min(damage, 30);
    const newPlayers = [...players];
    newPlayers[0] = { ...newPlayers[0], hp: newPlayers[0].hp - clampedDmg };
    const sorted = [...hands[0]].sort((a, b) => a.mentions - b.mentions);
    const rank = sorted.findIndex(c => c.name === card.name);
    const allSame = hands[0].every(c => c.mentions === card.mentions);
    const result = {
      cards: [card],
      damage: [clampedDmg],
      message: clampedDmg === 0
        ? `${card.name} — barely in the files! No damage taken! 🎉`
        : `${card.name} with ${card.mentions} mentions. You take ${clampedDmg} damage! 💥`,
    };
    setRoundResult(result);
    setPlayers(newPlayers);
    setGameLog(prev => [...prev, `R${round}: ${card.name} (${card.mentions}) → -${clampedDmg} HP`]);
    if (!allSame) {
      if (rank === 0) {
        setShowFish(true);
      } else if (rank === 1) {
        setShowBull(true);
      } else {
        setShowHawking(true);
      }
    }
  };

  const resolveMulti = (sels) => {
    setPhase("reveal");
    const chosen = sels.map((idx, pi) => hands[pi][idx]);
    const mentions = chosen.map(c => c.mentions);
    const sortedMentions = [...new Set(mentions)].sort((a, b) => a - b);
    const minMentions = sortedMentions[0];
    const maxMentions = sortedMentions[sortedMentions.length - 1];
    const secondMin = sortedMentions.length > 1 ? sortedMentions[1] : null;
    const newPlayers = [...players];
    const damages = [];
    const losers = chosen.map(c => c.mentions === maxMentions && maxMentions !== minMentions);
    const winners = chosen.map(c => c.mentions === minMentions);

    chosen.forEach((card, i) => {
      let dmg = 0;
      if (losers[i]) {
        dmg = Math.min(Math.floor(card.mentions / 10), 30);
      }
      damages.push(dmg);
      newPlayers[i] = { ...newPlayers[i], hp: newPlayers[i].hp - dmg };
    });

    const winnerNames = winners.map((w, i) => w ? newPlayers[i].name : null).filter(Boolean).join(", ");
    const result = {
      cards: chosen,
      damage: damages,
      winners,
      losers,
      message: minMentions === maxMentions
        ? `It's a tie! Everyone picked cards with equal mentions. No damage! 🤝`
        : `${winnerNames} wins with the fewest mentions! Losers take damage! 💀`,
    };
    setRoundResult(result);
    setPlayers(newPlayers);
    setGameLog(prev => [...prev, `R${round}: ${chosen.map((c, i) => `${newPlayers[i].name}: ${c.name}(${c.mentions})`).join(" vs ")}`]);
    if (minMentions !== maxMentions) {
      if (losers.some(l => l)) setShowHawking(true);
    }
  };

  const nextRound = () => {
    const alive = players.filter(p => p.hp > 0);
    if (playerCount === 1 && players[0].hp <= 0) {
      setShowEvil(true);
      return;
    }
    if (playerCount > 1 && alive.length <= 1) {
      setShowEvil(true);
      return;
    }
    setRound(r => r + 1);
    setCurrentPlayer(0);
    setSelections(new Array(playerCount).fill(null));
    dealHands(deckRef.current, playerCount);
    setPhase("pick");
    setRoundResult(null);
  };

  const renderMenu = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, padding: 20 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, letterSpacing: 6, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>The</div>
        <h1 style={{ fontSize: 42, fontWeight: 900, background: "linear-gradient(135deg, #dc2626, #ea580c, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, lineHeight: 1.1 }}>
          EPSTEIN FILES
        </h1>
        <div style={{ fontSize: 18, letterSpacing: 4, color: "#94a3b8", textTransform: "uppercase", marginTop: 4 }}>Card Game</div>
      </div>

      <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, maxWidth: 500, width: "100%", border: "1px solid #334155" }}>
        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
          <strong style={{ color: "#e2e8f0" }}>How to play:</strong> Each round you get 3 cards showing names from the Epstein files.
          Pick the person you think was mentioned the <strong style={{ color: "#22c55e" }}>fewest times</strong>.
          In solo mode, your card's mentions deal damage to you. In multiplayer, the player with the <strong style={{ color: "#ef4444" }}>most mentions loses HP</strong>. Survive!
        </div>
        <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
          Damage = mentions ÷ 10 (max 30 per round). Solo: survive as many rounds as possible. Multi: last one standing wins.
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {[1, 2, 3, 4].map(n => (
          <button
            key={n}
            onClick={() => setPlayerCount(n)}
            style={{
              padding: "10px 20px", borderRadius: 10, border: playerCount === n ? "2px solid #ea580c" : "2px solid #374151",
              background: playerCount === n ? "#ea580c22" : "#1e293b", color: playerCount === n ? "#ea580c" : "#94a3b8",
              fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {n === 1 ? "Solo" : `${n}P`}
          </button>
        ))}
      </div>

      {playerCount > 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 400 }}>
          {Array.from({ length: playerCount }).map((_, i) => (
            <input
              key={i}
              value={playerNames[i]}
              onChange={e => {
                const n = [...playerNames];
                n[i] = e.target.value;
                setPlayerNames(n);
              }}
              placeholder={`Player ${i + 1}`}
              style={{
                background: "#1e293b", border: "1px solid #374151", borderRadius: 8, padding: "8px 14px",
                color: "#e2e8f0", fontSize: 14, outline: "none",
              }}
            />
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={startGame} style={{ padding: "14px 40px", borderRadius: 12, background: "linear-gradient(135deg, #dc2626, #ea580c)", color: "#fff", fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", letterSpacing: 1 }}>
          ▶ START GAME
        </button>
        <button onClick={() => setShowLibrary(true)} style={{ padding: "14px 24px", borderRadius: 12, background: "#1e293b", color: "#94a3b8", fontSize: 14, fontWeight: 600, border: "1px solid #374151", cursor: "pointer" }}>
          📚 Library
        </button>
        <button onClick={() => setShowTrivia(true)} style={{ padding: "14px 24px", borderRadius: 12, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
          🧠 Trivia Quiz
        </button>
      </div>
    </div>
  );

  const renderGame = () => {
    const isRevealed = phase === "reveal";
    const currentHand = hands[currentPlayer] || [];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "#64748b" }}>Round <span style={{ color: "#ea580c", fontWeight: 800, fontSize: 18 }}>{round}</span></div>
          <div style={{ fontSize: 11, color: "#475569" }}>Cards left: {deck.length}</div>
          <button onClick={() => { setScreen("menu"); }} style={{ background: "none", border: "1px solid #374151", borderRadius: 8, color: "#64748b", padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>✕ Quit</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {players.map((p, i) => (
            <HealthBar key={i} hp={p.hp} name={p.name} active={!isRevealed && currentPlayer === i} />
          ))}
        </div>

        {!isRevealed && (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>
              {playerCount > 1 ? `${players[currentPlayer]?.name}'s turn` : "Pick your card"}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Choose who you think has the <span style={{ color: "#22c55e", fontWeight: 700 }}>fewest mentions</span></div>
            {playerCount > 1 && currentPlayer > 0 && (
              <div style={{ fontSize: 11, color: "#ea580c", marginTop: 4 }}>🙈 Don't peek at other players' screens!</div>
            )}
          </div>
        )}

        {!isRevealed ? (
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {currentHand.map((person, idx) => (
              <Card key={idx} person={person} onClick={() => selectCard(idx)} selected={selections[currentPlayer] === idx} revealed={false} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            {roundResult && (
              <div style={{ background: "#1e293b", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #334155", width: "100%", maxWidth: 600 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{roundResult.message}</div>
              </div>
            )}

            {playerCount === 1 ? (
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {hands[0].map((person, idx) => (
                  <Card
                    key={idx}
                    person={person}
                    revealed={true}
                    selected={selections[0] === idx}
                    isWinner={selections[0] === idx && person.mentions <= Math.min(...hands[0].map(c => c.mentions))}
                    isLoser={selections[0] === idx && person.mentions > Math.min(...hands[0].map(c => c.mentions))}
                  />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                {players.map((p, pi) => (
                  <div key={pi} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: roundResult?.winners?.[pi] ? "#22c55e" : roundResult?.losers?.[pi] ? "#ef4444" : "#94a3b8" }}>
                      {p.name} {roundResult?.damage?.[pi] > 0 ? `(-${roundResult.damage[pi]} HP)` : ""}
                    </div>
                    <Card
                      person={roundResult.cards[pi]}
                      revealed={true}
                      isWinner={roundResult?.winners?.[pi]}
                      isLoser={roundResult?.losers?.[pi]}
                      small
                    />
                  </div>
                ))}
              </div>
            )}

            <button onClick={nextRound} style={{ padding: "12px 36px", borderRadius: 10, background: "linear-gradient(135deg, #ea580c, #d97706)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 8 }}>
              Next Round →
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderGameOver = () => {
    const alive = players.filter(p => p.hp > 0);
    const winner = playerCount === 1 ? players[0] : (alive.length === 1 ? alive[0] : null);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: 40 }}>
        <div style={{ fontSize: 48 }}>💀</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: "#e2e8f0", margin: 0 }}>
          {playerCount === 1 ? "GAME OVER" : winner ? `${winner.name} WINS!` : "DRAW!"}
        </h2>
        <div style={{ fontSize: 15, color: "#94a3b8" }}>
          {playerCount === 1 ? `You survived ${round - 1} rounds` : `Game ended after ${round} rounds`}
        </div>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: 16, width: "100%", maxWidth: 400, border: "1px solid #334155" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>GAME LOG</div>
          <div style={{ maxHeight: 200, overflowY: "auto", fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>
            {gameLog.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
        <button onClick={() => setScreen("menu")} style={{ padding: "14px 40px", borderRadius: 12, background: "linear-gradient(135deg, #dc2626, #ea580c)", color: "#fff", fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer" }}>
          Play Again
        </button>
      </div>
    );
  };

  const renderLibrary = () => (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#e2e8f0", margin: 0 }}>📚 Epstein Files Library</h2>
        <button onClick={() => setShowLibrary(false)} style={{ background: "none", border: "1px solid #374151", borderRadius: 8, color: "#94a3b8", padding: "6px 16px", fontSize: 12, cursor: "pointer" }}>← Back</button>
      </div>
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 16 }}>
        Sorted by mention count (descending). Tier S = most mentioned, F = least. Based on DOJ releases (Jan 2026), court documents (Jan 2024), and news reporting.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280, 1fr))", gap: 8 }}>
        {[...PEOPLE].sort((a, b) => b.mentions - a.mentions).map((p, i) => {
          const tc = TIER_COLORS[p.tier];
          const icon = CATEGORY_ICONS[p.category] || "📄";
          return (
            <div key={i} style={{ background: "#1e293b", borderRadius: 10, padding: "10px 14px", border: "1px solid #334155", display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ background: tc.bg, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fff", flexShrink: 0 }}>{p.tier}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{icon} {p.name}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{p.desc}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: tc.bg, fontFamily: "'Courier New', monospace", flexShrink: 0 }}>{p.mentions.toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (showDisclaimer) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ maxWidth: 560, background: "#1e293b", borderRadius: 16, padding: 32, border: "1px solid #dc2626", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 800, margin: "0 0 16px" }}>Important Disclaimer</h2>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>{DISCLAIMER}</p>
          <button
            onClick={() => setShowDisclaimer(false)}
            style={{ marginTop: 20, padding: "12px 36px", borderRadius: 10, background: "#dc2626", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}
          >
            I Understand — Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <HawkingOnFire show={showHawking} onDone={() => setShowHawking(false)} />
      <FishBucket show={showFish} onDone={() => setShowFish(false)} />
      <WallStreetBull show={showBull} onDone={() => setShowBull(false)} />
      <EvilGameOver show={showEvil} onDone={() => { setShowEvil(false); setScreen("gameover"); }} />
      <div style={{ maxWidth: 800, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: screen === "menu" ? "center" : "flex-start" }}>
        {showTrivia ? <TriviaScreen onBack={() => setShowTrivia(false)} /> : showLibrary ? renderLibrary() : screen === "menu" ? renderMenu() : screen === "game" ? renderGame() : renderGameOver()}
      </div>
    </div>
  );
}
