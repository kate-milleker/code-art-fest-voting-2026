import { useState, useEffect, useRef } from "react";
import Papa from "papaparse";

const ACCENTS = [
  ["#FF6B9D","#FF8FAB"],["#FFD166","#FFC233"],["#06D6A0","#00C49A"],
  ["#118AB2","#0EA5E9"],["#EF476F","#F472B6"],["#F78C6B","#FB923C"],
  ["#83C5BE","#6DBAB0"],["#FFB4A2","#FFA08A"],["#B5838D","#C9727F"],["#6D6875","#8B7E8B"]
];
const getAccent = (id) => ACCENTS[(parseInt(id.replace(/\D/g,""))-1) % ACCENTS.length];

const FONT = "'Poppins', Helvetica, Arial, Lucida, sans-serif";
const PURPLE = "#5B278E";

// ── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(targetDateStr) {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!targetDateStr) { setTimeLeft(null); return; }
    const update = () => {
      const diff = new Date(targetDateStr) - new Date();
      if (diff <= 0) { setTimeLeft({ expired: true }); return; }
      setTimeLeft({
        expired: false,
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDateStr]);
  return timeLeft;
}

// ── Global CSS ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; font-family:${FONT}; }
  @keyframes fadeIn    { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bounceIn  { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes attractPulse {
    0%,100% { transform:scale(1);   box-shadow:0 8px 40px rgba(255,255,255,0.18); }
    50%      { transform:scale(1.04); box-shadow:0 8px 64px rgba(255,255,255,0.34); }
  }
  @keyframes floatSym  { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-18px)} }
  @keyframes attractIn { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes gradientChase { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  ::-webkit-scrollbar            { width:6px; height:6px; }
  ::-webkit-scrollbar-track      { background:transparent; }
  ::-webkit-scrollbar-thumb      { background:rgba(255,255,255,0.15); border-radius:3px; }
  input[type="datetime-local"]   { color-scheme: dark; }
`;

// ── Attract Screen ───────────────────────────────────────────────────────────
const CODE_SYMBOLS = ["||", " ", "( )", "{ }", "for", "=>", "&&", "[ ]", " ", ":", "if", "else", "//", "</>", ";"];

function AttractScreen({ onStart, votingOpen, countdown, votingClosedAt }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:2000,
      background:"linear-gradient(135deg, #7B3FAF 0%, #5B278E 45%, #3A1560 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      fontFamily:FONT, overflow:"hidden"
    }}>
      {/* Floating background symbols */}
      {CODE_SYMBOLS.map((sym, i) => (
        <div key={i} style={{
          position:"absolute",
          fontSize:`${25 + (i * 11) % 30}px`,
          color:"rgba(255,255,255,0.08)", fontFamily:"monospace", fontWeight:700,
          left:`${6 + (i * 137) % 88}%`, top:`${9 + (i * 97 + 5) % 82}%`,
          animation:`floatSym ${2.5 + (i * 0.6) % 2}s ease-in-out infinite`,
          animationDelay:`${(i * 0.35) % 1.8}s`,
          userSelect:"none", pointerEvents:"none",
        }}>{sym}</div>
      ))}

      <div style={{
        textAlign:"center", padding:"32px 24px", maxWidth:680, width:"100%",
        position:"relative", zIndex:1,
        animation:"attractIn 0.8s ease 0.1s both"
      }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"5px 18px", borderRadius:100,
          background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.22)",
          marginBottom:24
        }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.85)", letterSpacing:2.5, textTransform:"uppercase", fontWeight:600 }}>
            Code/Art Fest 2026
          </span>
        </div>

        <h1 style={{
          fontSize:"clamp(40px, 9vw, 72px)", fontWeight:800,
          lineHeight:0.95, margin:"0 0 10px",
          background:"linear-gradient(90deg, #FF3CAC, #974DF3, #2EA3F2, #974DF3, #FF3CAC)",
          backgroundSize:"300% 100%",
          WebkitBackgroundClip:"text", backgroundClip:"text",
          WebkitTextFillColor:"transparent",
          animation:"gradientChase 9s ease infinite",
          filter:"drop-shadow(0 4px 20px rgba(151,77,243,0.35))"
        }}>CodeYourSelf&#x2122;</h1>

        <p style={{
          fontSize:"clamp(16px, 3vw, 22px)", color:"rgba(255,255,255,0.65)",
          margin:"0 0 8px", fontWeight:500
        }}>This Is Me: My Story, My Roots</p>

        <p style={{
          fontSize:11, color:"rgba(255,255,255,0.35)", margin:"0 0 32px",
          letterSpacing:2, textTransform:"uppercase", fontWeight:600
        }}>South Florida Regional &middot; Final Voting Round</p>

        {/* Countdown clock */}
        {votingClosedAt && countdown && !countdown.expired && (
          <div style={{ marginBottom:36 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:2.5, textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
              Voting closes in
            </div>
            <div style={{ display:"inline-flex", gap:"clamp(8px, 2vw, 16px)", justifyContent:"center" }}>
              {[
                { val: countdown.days, label: "Days" },
                { val: countdown.hours, label: "Hours" },
                { val: countdown.minutes, label: "Min" },
                { val: countdown.seconds, label: "Sec" },
              ].map(({ val, label }) => (
                <div key={label} style={{
                  background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)",
                  borderRadius:14, padding:"clamp(10px, 2vw, 16px) clamp(12px, 2.5vw, 22px)",
                  minWidth:"clamp(54px, 10vw, 76px)", textAlign:"center",
                  backdropFilter:"blur(8px)"
                }}>
                  <div style={{
                    fontSize:"clamp(24px, 5vw, 38px)", fontWeight:800, color:"white",
                    fontFamily:"monospace", lineHeight:1, letterSpacing:1,
                    fontVariantNumeric:"tabular-nums"
                  }}>
                    {String(val).padStart(2,"0")}
                  </div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:1.5, textTransform:"uppercase", fontWeight:600, marginTop:6 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {votingClosedAt && countdown?.expired && (
          <div style={{
            marginBottom:36, padding:"10px 24px", borderRadius:100,
            background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)",
            display:"inline-block"
          }}>
            <span style={{ fontSize:13, color:"#f87171", fontWeight:700, letterSpacing:1 }}>Voting Has Ended</span>
          </div>
        )}

        {votingOpen ? (
          <button onClick={onStart} style={{
            background:"white", color:PURPLE,
            padding:"20px 56px", borderRadius:100,
            fontSize:"clamp(17px, 3vw, 21px)", fontWeight:800,
            border:"none", cursor:"pointer",
            animation:"attractPulse 2.5s ease-in-out infinite",
            fontFamily:FONT, letterSpacing:0.3,
            display:"block", margin:"0 auto"
          }}>
            Cast Your Votes!
          </button>
        ) : (
          <div style={{
            background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)",
            borderRadius:18, padding:"24px 40px", display:"inline-block"
          }}>
            <div style={{ fontSize:20, fontWeight:700, color:"#f87171", marginBottom:6 }}>Voting is Currently Closed</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.45)" }}>Please check with an event organizer</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Session Complete Screen ──────────────────────────────────────────────────
function SessionCompleteScreen({ onEnd }) {
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  useEffect(() => { const t = setTimeout(() => onEndRef.current(), 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:2000,
      background:"rgba(20,5,38,0.97)", backdropFilter:"blur(20px)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      fontFamily:FONT, textAlign:"center", padding:32,
      animation:"fadeIn 0.5s ease"
    }}>
      <div style={{ fontSize:80, marginBottom:16, animation:"bounceIn 0.6s ease" }}>&#x1F389;</div>
      <h2 style={{ fontSize:"clamp(28px, 6vw, 44px)", fontWeight:800, color:"white", margin:"0 0 14px" }}>
        All Votes Cast!
      </h2>
      <p style={{ fontSize:18, color:"rgba(255,255,255,0.55)", marginBottom:40 }}>
        Thank you for participating in the voting!
      </p>
      <p style={{ fontSize:13, color:"rgba(255,255,255,0.25)", letterSpacing:1 }}>Returning to start screen&#x2026;</p>
    </div>
  );
}

// ── Placeholder / Image ──────────────────────────────────────────────────────
function EntryImage({ entry, onClick }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = `/assets/images/${entry.image}`;

  if (!imgError) {
    return (
      <div
        style={{
          position:"relative", cursor:"pointer",
          width:"100%", paddingBottom:"100%",
          overflow:"hidden", borderRadius:"14px 14px 0 0"
        }}
        onClick={() => onClick && onClick({ ...entry, image: imageSrc })}
      >
        <img
          src={imageSrc} alt={`Artwork by ${entry.name}`}
          onError={() => setImgError(true)}
          style={{
            position:"absolute", inset:0,
            width:"100%", height:"100%", objectFit:"cover",
            transition:"transform 0.4s ease"
          }}
          onMouseOver={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
        />
        {/* Bottom gradient for legibility */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 45%)",
          pointerEvents:"none"
        }}/>
        {/* Expand icon */}
        <div style={{
          position:"absolute", bottom:10, right:10,
          background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)",
          borderRadius:"50%", width:30, height:30,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"white", fontSize:14, border:"1px solid rgba(255,255,255,0.18)",
          pointerEvents:"none"
        }}>&#x26F6;</div>
      </div>
    );
  }

  // Gradient fallback
  const [c1, c2] = getAccent(entry.id);
  const seed = entry.id.charCodeAt(1) * 17 + entry.id.charCodeAt(0) * 31;
  return (
    <div style={{
      position:"relative", width:"100%", paddingBottom:"100%",
      borderRadius:"14px 14px 0 0", overflow:"hidden",
      background:`linear-gradient(${seed % 360}deg, ${c1}, ${c2})`
    }}>
      <div style={{ position:"absolute", inset:0, opacity:0.12, background:`radial-gradient(circle at 40% 40%, white 0%, transparent 60%)` }}/>
      <div style={{ position:"absolute", top:12, left:16, fontSize:32, color:"rgba(255,255,255,0.22)", fontFamily:"monospace" }}>{"{"}</div>
      <div style={{ position:"absolute", bottom:12, right:16, fontSize:32, color:"rgba(255,255,255,0.22)", fontFamily:"monospace" }}>{"}"}</div>
    </div>
  );
}

// ── Entry Card ───────────────────────────────────────────────────────────────
function EntryCard({ entry, onVote, hasVoted, isVotedFor, votingOpen, onImageClick }) {
  const [c1] = getAccent(entry.id);
  return (
    <div style={{
      background: isVotedFor ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)",
      borderRadius:18,
      border: isVotedFor ? `2px solid ${c1}99` : "1px solid rgba(255,255,255,0.1)",
      overflow:"hidden", transition:"all 0.35s ease",
      boxShadow: isVotedFor ? `0 8px 36px ${c1}44` : "0 2px 12px rgba(0,0,0,0.2)"
    }}>
      <EntryImage entry={entry} onClick={onImageClick} />

      <div style={{ padding:"16px 18px 18px" }}>
        {/* Name + entry number */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:4 }}>
          <h3 style={{
            fontSize:"clamp(17px, 2.2vw, 21px)", fontWeight:800,
            color:"white", margin:0, lineHeight:1.2, fontFamily:FONT, flex:1
          }}>
            {entry.name}
          </h3>
          <div style={{
            display:"inline-flex", flexShrink:0, padding:"3px 9px", borderRadius:6,
            background:"rgba(255,255,255,0.07)", fontSize:10, fontWeight:600,
            color:"rgba(255,255,255,0.32)", letterSpacing:0.5, fontFamily:FONT, marginTop:3
          }}>#{entry.id.replace(/\D/g,"")}</div>
        </div>

        <p style={{
          fontSize:12, color:"rgba(255,255,255,0.42)", margin:"0 0 14px",
          fontWeight:500, letterSpacing:0.4, fontFamily:FONT
        }}>
          {entry.grade} Grade &middot; {entry.county} County
        </p>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {votingOpen && (
            <button
              onClick={() => onVote(entry.id)}
              disabled={hasVoted && !isVotedFor}
              style={{
                flex:1, minWidth:110,
                background: isVotedFor ? "white" : hasVoted ? "rgba(255,255,255,0.04)" : "white",
                border:"none",
                color: isVotedFor ? PURPLE : hasVoted ? "rgba(255,255,255,0.18)" : PURPLE,
                padding:"8px 16px", borderRadius:9, fontSize:13, fontWeight:700,
                cursor: hasVoted && !isVotedFor ? "not-allowed" : "pointer",
                opacity: hasVoted && !isVotedFor ? 0.25 : 1,
                boxShadow: isVotedFor ? "0 4px 16px rgba(255,255,255,0.22)" : hasVoted ? "none" : "0 2px 8px rgba(0,0,0,0.2)",
                transition:"all 0.3s ease", fontFamily:FONT
              }}
            >
              {isVotedFor ? "\u2605 Voted!" : hasVoted ? "Vote Cast" : "\u2606 Vote"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function LightboxModal({ entry, onClose }) {
  return (
    <div
      style={{
        position:"fixed", inset:0, zIndex:1100,
        background:"rgba(8,2,18,0.97)", backdropFilter:"blur(18px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        flexDirection:"column", animation:"fadeIn 0.3s ease", padding:24
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{
          position:"absolute", top:24, right:24,
          background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
          color:"white", width:44, height:44, borderRadius:"50%", fontSize:20,
          cursor:"pointer", zIndex:1101, transition:"all 0.2s ease"
        }}
        onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
      >&#x2715;</button>

      <img
        src={entry.image} alt={`Artwork by ${entry.name}`}
        style={{ maxWidth:"92%", maxHeight:"78vh", objectFit:"contain", borderRadius:12, boxShadow:"0 10px 60px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}
      />

      <div style={{ marginTop:20, textAlign:"center", color:"white" }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize:24, fontWeight:700, margin:"0 0 4px", fontFamily:FONT }}>{entry.name}</h3>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", margin:0, fontFamily:FONT }}>
          {entry.grade} Grade &middot; {entry.county} County
        </p>
      </div>
    </div>
  );
}

// ── Admin Panel ───────────────────────────────────────────────────────────────
function AdminPanel({ votes, ENTRIES, onReset, onClose, onToggleVoting, votingOpen, onEndSession, votingClosedAt, onSetClosedAt }) {
  const divs = ["elementary","middle","high"];
  const labels = { elementary:"Elementary (3–5)", middle:"Middle (6–8)", high:"High (9–12)" };
  const [closeInput, setCloseInput] = useState(votingClosedAt || "");

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:2500,
      background:"rgba(40,10,60,0.92)", backdropFilter:"blur(20px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      animation:"fadeIn 0.3s ease", padding:16
    }}>
      <div style={{
        background:"#2E1048", borderRadius:22, padding:"clamp(20px, 5vw, 32px)",
        maxWidth:620, width:"100%", maxHeight:"88vh", overflowY:"auto",
        border:"1px solid rgba(255,255,255,0.12)", boxShadow:"0 20px 60px rgba(0,0,0,0.5)"
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:"white", margin:0, fontFamily:FONT }}>Admin Dashboard</h2>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"white", width:36, height:36, borderRadius:10, fontSize:18, cursor:"pointer" }}>&#x2715;</button>
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
          <button onClick={onToggleVoting} style={{
            flex:1, minWidth:130, padding:"12px 16px", borderRadius:12,
            background: votingOpen ? "#dc2626" : "#16a34a",
            border:"none", color:"white", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONT
          }}>
            {votingOpen ? "Pause Voting" : "Open Voting"}
          </button>
          <button onClick={onReset} style={{
            flex:1, minWidth:130, padding:"12px 16px", borderRadius:12,
            background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)",
            color:"rgba(255,255,255,0.6)", fontSize:13, cursor:"pointer", fontFamily:FONT
          }}>
            Reset All Votes
          </button>
        </div>

        {/* Voting close time */}
        <div style={{
          background:"rgba(255,255,255,0.05)", borderRadius:14, padding:"16px 18px",
          marginBottom:24, border:"1px solid rgba(255,255,255,0.08)"
        }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:1.5, fontWeight:600, marginBottom:10, fontFamily:FONT }}>
            Voting Closes At
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input
              type="datetime-local"
              value={closeInput}
              onChange={e => setCloseInput(e.target.value)}
              style={{
                flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:9, padding:"9px 12px", color:"white", fontSize:13,
                outline:"none", fontFamily:FONT
              }}
            />
            <button
              onClick={() => onSetClosedAt(closeInput)}
              style={{
                padding:"9px 18px", borderRadius:9, background:"white", color:PURPLE,
                border:"none", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:FONT, whiteSpace:"nowrap"
              }}
            >Set</button>
          </div>
        </div>

        {/* Vote results */}
        {divs.map(div => {
          const dv = votes[div] || {};
          const entriesForDiv = ENTRIES[div] || [];
          const sorted = entriesForDiv.map(e => ({ ...e, count: dv[e.id] || 0 })).sort((a,b) => b.count - a.count);
          const mx = Math.max(...sorted.map(s => s.count), 1);
          return (
            <div key={div} style={{ marginBottom:24 }}>
              <h3 style={{ fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:2, marginBottom:10, fontWeight:600, fontFamily:FONT }}>
                {labels[div]}
              </h3>
              {sorted.map((e,i) => {
                const [c1] = getAccent(e.id);
                return (
                  <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <span style={{ fontSize:12, color: i===0 && e.count>0 ? "#FFD166" : "rgba(255,255,255,0.22)", width:20, textAlign:"right", fontWeight:600, fontFamily:FONT }}>{i+1}.</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)", marginBottom:3, fontFamily:FONT }}>{e.name}</div>
                      <div style={{ height:5, borderRadius:3, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:3, background:`linear-gradient(90deg,${c1},${c1}77)`, width:`${(e.count/mx)*100}%`, transition:"width 0.5s ease" }}/>
                      </div>
                    </div>
                    <span style={{ fontSize:14, color:"white", fontWeight:700, minWidth:24, textAlign:"right", fontFamily:FONT }}>{e.count}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ entry, onConfirm, onCancel }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:900,
      background:"rgba(40,10,60,0.9)", backdropFilter:"blur(12px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      animation:"fadeIn 0.3s ease", padding:16
    }}>
      <div style={{
        background:"#3A1857", borderRadius:22, padding:"clamp(24px, 6vw, 36px)",
        maxWidth:400, width:"100%", textAlign:"center",
        border:"1px solid rgba(255,255,255,0.15)", boxShadow:"0 20px 60px rgba(0,0,0,0.5)"
      }}>
        <div style={{ fontSize:44, marginBottom:12 }}>&#x1F5F3;&#xFE0F;</div>
        <h3 style={{ fontSize:22, fontWeight:700, color:"white", margin:"0 0 8px", fontFamily:FONT }}>Confirm Your Vote</h3>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginBottom:6, fontFamily:FONT }}>You are voting for:</p>
        <p style={{ fontSize:24, fontWeight:800, color:"#FFD166", marginBottom:4, fontFamily:FONT }}>{entry.name}</p>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.38)", marginBottom:6, fontFamily:FONT }}>{entry.grade} Grade &middot; {entry.county} County</p>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", marginBottom:24, fontStyle:"italic", fontFamily:FONT }}>You may only vote once per category.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={onCancel} style={{ flex:1, padding:"12px 20px", borderRadius:12, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.7)", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"12px 20px", borderRadius:12, background:"white", border:"none", color:PURPLE, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(255,255,255,0.2)", fontFamily:FONT }}>Cast Vote &#x2605;</button>
        </div>
      </div>
    </div>
  );
}

// ── Thank You Modal ───────────────────────────────────────────────────────────
function ThankYouModal({ entry, onClose }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => { const t = setTimeout(() => onCloseRef.current(), 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:900,
      background:"rgba(40,10,60,0.92)", backdropFilter:"blur(12px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      animation:"fadeIn 0.3s ease", padding:16
    }}>
      <div style={{
        background:"#3A1857", borderRadius:22, padding:40,
        maxWidth:380, width:"100%", textAlign:"center",
        border:"1px solid rgba(255,255,255,0.15)"
      }}>
        <div style={{ fontSize:60, marginBottom:12, animation:"bounceIn 0.5s ease" }}>&#x1F389;</div>
        <h3 style={{ fontSize:24, fontWeight:700, color:"white", margin:"0 0 8px", fontFamily:FONT }}>Vote Cast!</h3>
        <p style={{ fontSize:15, color:"rgba(255,255,255,0.6)", fontFamily:FONT }}>
          You voted for <span style={{ color:"#FFD166", fontWeight:700 }}>{entry.name}</span>
        </p>
      </div>
    </div>
  );
}

// ── Division labels ───────────────────────────────────────────────────────────
const DIV_LABELS = {
  elementary: { label:"Elementary", grades:"Grades 3\u20135", emoji:"\uD83C\uDF31" },
  middle:     { label:"Middle School", grades:"Grades 6\u20138", emoji:"\uD83C\uDF3F" },
  high:       { label:"High School",  grades:"Grades 9\u201312", emoji:"\uD83C\uDF33" },
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function CodeYourSelfVoting() {
  const [activeDivision, setActiveDivision] = useState("elementary");

  // Aggregate vote counts — persisted so admin can see totals across sessions
  const [votes, setVotes] = useState({ elementary:{}, middle:{}, high:{} });

  // Per-session votes — NOT persisted; resets each session and on page refresh
  const [myVotes, setMyVotes] = useState({});

  // Session / screen state
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Modals
  const [confirmEntry, setConfirmEntry] = useState(null);
  const [thankYouEntry, setThankYouEntry] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [lightboxEntry, setLightboxEntry] = useState(null);

  // Admin entry
  const [adminCode, setAdminCode] = useState("");
  const [adminError, setAdminError] = useState(false);

  // Settings
  const [votingOpen, setVotingOpen] = useState(true);
  const [votingClosedAt, setVotingClosedAt] = useState("");

  // Data
  const [ENTRIES, setENTRIES] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const countdown = useCountdown(votingClosedAt);

  // Auto-close voting when countdown expires
  useEffect(() => {
    if (countdown?.expired && votingOpen) {
      setVotingOpen(false);
      try { localStorage.setItem("cys-voting-open", "false"); } catch {}
    }
  }, [countdown?.expired]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load persisted settings and entries on mount
  useEffect(() => {
    try { const r = localStorage.getItem("cys-votes");       if (r) setVotes(JSON.parse(r)); } catch {}
    try { const r = localStorage.getItem("cys-voting-open"); if (r) setVotingOpen(JSON.parse(r)); } catch {}
    try { const r = localStorage.getItem("cys-close-time");  if (r) setVotingClosedAt(r); } catch {}

    Papa.parse("/entries.csv", {
      download:true, header:true, skipEmptyLines:true,
      complete: (results) => {
        const parsed = { elementary:[], middle:[], high:[] };
        results.data.forEach(row => {
          const div = row.division?.toLowerCase().trim();
          if (div && parsed[div]) parsed[div].push(row);
        });
        setENTRIES(parsed);
        setLoaded(true);
      },
      error: (err) => {
        console.error("Failed to load entries CSV", err);
        setENTRIES({ elementary:[], middle:[], high:[] });
        setLoaded(true);
      }
    });
  }, []);

  // ── Session helpers ──────────────────────────────────────────────────────
  const startSession = () => {
    setMyVotes({});
    setSessionComplete(false);
    setActiveDivision("elementary");
    setSessionActive(true);
  };

  const endSession = () => {
    setSessionActive(false);
    setSessionComplete(false);
    setMyVotes({});
    setShowAdmin(false);
  };

  // ── Vote helpers ─────────────────────────────────────────────────────────
  const saveAggregateVotes = (nv) => {
    try { localStorage.setItem("cys-votes", JSON.stringify(nv)); } catch {}
  };

  const resetVotes = () => {
    const empty = { elementary:{}, middle:{}, high:{} };
    setVotes(empty);
    setMyVotes({});
    try { localStorage.setItem("cys-votes", JSON.stringify(empty)); } catch {}
  };

  const toggleVoting = () => {
    const ns = !votingOpen;
    setVotingOpen(ns);
    try { localStorage.setItem("cys-voting-open", JSON.stringify(ns)); } catch {}
  };

  const setClosedAt = (val) => {
    setVotingClosedAt(val);
    try { localStorage.setItem("cys-close-time", val); } catch {}
  };

  const handleVote = (id) => {
    if (myVotes[activeDivision]) return;
    setConfirmEntry(ENTRIES[activeDivision].find(e => e.id === id));
  };

  const confirmVote = () => {
    const id = confirmEntry.id;
    const nv = { ...votes };
    if (!nv[activeDivision]) nv[activeDivision] = {};
    nv[activeDivision][id] = (nv[activeDivision][id] || 0) + 1;
    const nm = { ...myVotes, [activeDivision]: id };
    setVotes(nv);
    setMyVotes(nm);
    saveAggregateVotes(nv);

    const isLastVote = Object.keys(nm).length >= 3;
    setThankYouEntry({ ...confirmEntry, isLastVote });
    setConfirmEntry(null);
  };

  const handleThankYouClose = () => {
    const wasLast = thankYouEntry?.isLastVote;
    setThankYouEntry(null);
    if (wasLast) setSessionComplete(true);
  };

  const handleAdmin = () => {
    if (!adminCode) return;
    if (adminCode === "codeartvoting") {
      setShowAdmin(true);
      setAdminCode("");
      setAdminError(false);
    } else {
      setAdminError(true);
      setTimeout(() => setAdminError(false), 2000);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (!loaded || !ENTRIES) {
    return (
      <div style={{ minHeight:"100vh", background:PURPLE, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <style>{GLOBAL_CSS}</style>
        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:14, fontFamily:FONT }}>Loading Entries&#x2026;</div>
      </div>
    );
  }

  // ── Attract screen (also shown on page refresh since sessionActive is not persisted) ──
  if (!sessionActive && !sessionComplete) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <AttractScreen onStart={startSession} votingOpen={votingOpen} countdown={countdown} votingClosedAt={votingClosedAt} />
        {/* Admin access from attract screen */}
        <div style={{ position:"fixed", bottom:20, right:20, zIndex:2100, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
          {adminError && (
            <div style={{ fontSize:11, color:"#f87171", fontWeight:600, fontFamily:FONT, animation:"fadeIn 0.2s ease" }}>
              Incorrect password
            </div>
          )}
          <div style={{ display:"flex", gap:8 }}>
            <input
              type="password" placeholder="Admin" value={adminCode}
              onChange={e => { setAdminCode(e.target.value); setAdminError(false); }}
              onKeyDown={e => e.key === "Enter" && handleAdmin()}
              style={{ background:"rgba(255,255,255,0.07)", border: adminError ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"7px 12px", color:"rgba(255,255,255,0.5)", fontSize:12, outline:"none", width:100, fontFamily:FONT, transition:"border 0.2s ease" }}
            />
            <button onClick={handleAdmin} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"7px 12px", color:"rgba(255,255,255,0.38)", fontSize:12, cursor:"pointer" }}>&rarr;</button>
          </div>
        </div>
        {showAdmin && (
          <AdminPanel
            votes={votes} ENTRIES={ENTRIES}
            onReset={resetVotes} onClose={() => setShowAdmin(false)}
            onToggleVoting={toggleVoting} votingOpen={votingOpen}
            onEndSession={endSession}
            votingClosedAt={votingClosedAt} onSetClosedAt={setClosedAt}
          />
        )}
      </>
    );
  }

  // ── Session complete ─────────────────────────────────────────────────────
  if (sessionComplete) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <SessionCompleteScreen onEnd={endSession} />
      </>
    );
  }

  // ── Active voting session ────────────────────────────────────────────────
  const entries = ENTRIES[activeDivision] || [];
  const divInfo = DIV_LABELS[activeDivision];
  const totalVotesCast = Object.keys(myVotes).length;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg, #6B2FA0 0%, #5B278E 30%, #4A1D7A 70%, #3A1560 100%)", color:"white", fontFamily:FONT }}>
      <style>{GLOBAL_CSS + `
        .nav-tabs { display:flex; gap:8px; margin-bottom:20px; overflow-x:auto; padding-bottom:6px; }
        .entries-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:16px; }
        @media (max-width: 600px) { .entries-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* ── Header ── */}
      <header style={{ padding:"28px 24px 0", maxWidth:960, margin:"0 auto", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px", borderRadius:100, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", marginBottom:14 }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.75)", letterSpacing:2.5, textTransform:"uppercase", fontWeight:600 }}>Code/Art Fest 2026</span>
        </div>

        <h1 style={{ fontSize:"clamp(26px, 6vw, 42px)", fontWeight:800, lineHeight:1.1, marginBottom:4, color:"white" }}>
          CodeYourSelf&#x2122;
        </h1>
        <p style={{ fontSize:"clamp(13px, 2vw, 15px)", color:"rgba(255,255,255,0.6)", marginBottom:2, fontWeight:500 }}>
          This Is Me: My Story, My Roots
        </p>
        <p style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:18, letterSpacing:1.5, textTransform:"uppercase", fontWeight:600 }}>
          South Florida Regional &middot; Final Voting Round
        </p>

        {/* Status pills row */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:7, marginBottom:20 }}>
          {/* Voting open/closed pill */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:100,
            background: votingOpen ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
            border:`1px solid ${votingOpen ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`
          }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background: votingOpen ? "#22c55e" : "#ef4444", boxShadow:`0 0 8px ${votingOpen ? "#22c55e" : "#ef4444"}`, animation:"pulse 2s ease infinite" }}/>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color: votingOpen ? "#4ade80" : "#f87171" }}>
              {votingOpen ? "VOTING OPEN" : "VOTING CLOSED"}
            </span>
          </div>

          {/* Countdown pill */}
          {votingClosedAt && countdown && !countdown.expired && (
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:100,
              background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)"
            }}>
              <span style={{ fontSize:10, color:"rgba(255,255,255,0.38)", letterSpacing:1, textTransform:"uppercase", fontWeight:600 }}>Closes in</span>
              <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.8)", fontFamily:"monospace", letterSpacing:0.5 }}>
                {countdown.days > 0 && `${countdown.days}d `}
                {String(countdown.hours).padStart(2,"0")}:{String(countdown.minutes).padStart(2,"0")}:{String(countdown.seconds).padStart(2,"0")}
              </span>
            </div>
          )}
          {votingClosedAt && countdown?.expired && (
            <div style={{
              display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:100,
              background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.22)"
            }}>
              <span style={{ fontSize:11, color:"#f87171", fontWeight:600, letterSpacing:1 }}>Voting Ended</span>
            </div>
          )}

          {/* Session progress dots */}
          <div style={{ display:"inline-flex", gap:6, alignItems:"center" }}>
            {["elementary","middle","high"].map(div => (
              <div key={div} style={{
                width:9, height:9, borderRadius:"50%",
                background: myVotes[div] ? "#4ade80" : "rgba(255,255,255,0.2)",
                boxShadow: myVotes[div] ? "0 0 8px #4ade80" : "none",
                transition:"all 0.3s ease"
              }}/>
            ))}
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.32)", marginLeft:5, letterSpacing:0.5 }}>
              {totalVotesCast}/3 votes cast
            </span>
          </div>
        </div>
      </header>

      {/* ── Division tabs ── */}
      <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px 10px" }}>
        <nav className="nav-tabs">
          {Object.entries(DIV_LABELS).map(([key,val]) => {
            const isA = activeDivision === key, voted = !!myVotes[key];
            return (
              <button key={key} onClick={() => setActiveDivision(key)} style={{
                flex:1, minWidth:120, padding:"12px 8px", borderRadius:14,
                background: isA ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                border: isA ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                cursor:"pointer", transition:"all 0.25s ease", position:"relative", fontFamily:FONT
              }}>
                <div style={{ fontSize:14, fontWeight:700, color: isA ? "white" : "rgba(255,255,255,0.45)", marginBottom:2 }}>{val.emoji} {val.label}</div>
                <div style={{ fontSize:11, color: isA ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)", fontWeight:500 }}>{val.grades}</div>
                {voted && <div style={{ position:"absolute", top:6, right:9, fontSize:10, color:"#4ade80", fontWeight:700 }}>&#x2713; voted</div>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Hint banner ── */}
      {votingOpen && !myVotes[activeDivision] && (
        <div style={{ maxWidth:960, margin:"0 auto 14px", padding:"0 24px" }}>
          <div style={{ padding:"11px 16px", borderRadius:12, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", fontSize:13, color:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", gap:8, fontWeight:500 }}>
            <span style={{ fontSize:15 }}>&#x1F4A1;</span>
            Browse the {divInfo.label} entries and vote for your favorite. Click any image to view full screen!
          </div>
        </div>
      )}

      {/* ── Entry grid ── */}
      <main style={{ maxWidth:960, margin:"0 auto", padding:"0 24px 60px" }}>
        {entries.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 40px", color:"rgba(255,255,255,0.35)" }}>
            No entries loaded for this division.
          </div>
        ) : (
          <div className="entries-grid">
            {entries.map((entry,i) => (
              <div key={entry.id} style={{ animation:`slideUp 0.35s ease ${i*0.04}s both` }}>
                <EntryCard
                  entry={entry} onVote={handleVote}
                  hasVoted={!!myVotes[activeDivision]}
                  isVotedFor={myVotes[activeDivision] === entry.id}
                  votingOpen={votingOpen}
                  onImageClick={setLightboxEntry}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ maxWidth:960, margin:"0 auto", padding:"14px 24px 28px", borderTop:"1px solid rgba(255,255,255,0.07)", textAlign:"center" }}>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.28)", fontWeight:500 }}>
          CodeYourSelf&#x2122; is part of Code/Art&#x2019;s mission to inspire girls in tech through creative coding.
        </p>
      </footer>

      {/* ── Modals ── */}
      {confirmEntry && <ConfirmModal entry={confirmEntry} onConfirm={confirmVote} onCancel={() => setConfirmEntry(null)} />}
      {thankYouEntry && <ThankYouModal entry={thankYouEntry} onClose={handleThankYouClose} />}
      {lightboxEntry && <LightboxModal entry={lightboxEntry} onClose={() => setLightboxEntry(null)} />}
    </div>
  );
}
