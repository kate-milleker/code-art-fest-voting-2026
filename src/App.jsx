import { useState, useEffect } from "react";
import Papa from "papaparse"; 

const ACCENTS = [["#FF6B9D","#FF8FAB"],["#FFD166","#FFC233"],["#06D6A0","#00C49A"],["#118AB2","#0EA5E9"],["#EF476F","#F472B6"],["#F78C6B","#FB923C"],["#83C5BE","#6DBAB0"],["#FFB4A2","#FFA08A"],["#B5838D","#C9727F"],["#6D6875","#8B7E8B"]];
const getAccent = (id) => ACCENTS[(parseInt(id.replace(/\D/g,""))-1) % ACCENTS.length];

const FONT = "'Poppins', Helvetica, Arial, Lucida, sans-serif";
const PURPLE = "#5B278E";

function PlaceholderArt({ entry, size = 160, onImageClick }) {
  const [imgError, setImgError] = useState(false);
  
  // Look for the image in the CSV first. If it's empty, automatically look in the public/artworks folder!
  const imageSrc = `/assets/images/${entry.image}` || `/artworks/${entry.id}.jpg`;

  if (!imgError) {
    return (
      <div 
        style={{ position:"relative", cursor:"pointer", width:size, height:size, flexShrink:0, borderRadius:14, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }} 
        onClick={() => onImageClick && onImageClick({ ...entry, image: imageSrc })}
      >
        <img 
          src={imageSrc} 
          alt={`Artwork by ${entry.name}`}
          onError={() => setImgError(true)} // If the image isn't in the folder, switch to the gradient!
          style={{ width:"100%", height:"100%", objectFit:"cover", transition: "transform 0.2s ease" }} 
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        />
        <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:14, border:"1px solid rgba(255,255,255,0.2)" }}>
          &#x26F6;
        </div>
      </div>
    );
  }

  // Fallback Gradient Generation
  const [c1, c2] = getAccent(entry.id);
  const seed = entry.id.charCodeAt(1)*17 + entry.id.charCodeAt(0)*31;
  return (
    <div style={{ width:size, height:size, borderRadius:14, flexShrink:0, background:`linear-gradient(${seed%360}deg,${c1},${c2})`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.12, background:`radial-gradient(circle at ${30+seed%40}% ${30+seed%40}%, white 0%, transparent 60%)` }}/>
      <div style={{ fontSize:size*0.13, color:"white", textAlign:"center", padding:14, fontWeight:700, textShadow:"0 2px 6px rgba(0,0,0,0.3)", lineHeight:1.3, position:"relative", zIndex:1, fontFamily:FONT }}>{entry.title}</div>
      <div style={{ position:"absolute", top:6, left:10, fontSize:size*0.1, color:"rgba(255,255,255,0.25)", fontFamily:"monospace" }}>{"{"}</div>
      <div style={{ position:"absolute", bottom:6, right:10, fontSize:size*0.1, color:"rgba(255,255,255,0.25)", fontFamily:"monospace" }}>{"}"}</div>
    </div>
  );
}

function EntryCard({ entry, onVote, hasVoted, isVotedFor, votingOpen, onImageClick }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: isVotedFor ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)", borderRadius:18, border: isVotedFor ? "2px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.1)", overflow:"hidden", transition:"all 0.35s ease", transform: isVotedFor ? "scale(1.01)" : "scale(1)", boxShadow: isVotedFor ? "0 8px 32px rgba(0,0,0,0.25)" : "0 2px 8px rgba(0,0,0,0.15)" }}>
      
      <div className={`card-layout ${expanded ? 'is-expanded' : ''}`}>
        <PlaceholderArt entry={entry} size={expanded ? 170 : 130} onImageClick={onImageClick} />
        
        <div className="card-content">
          <div style={{ display:"inline-block", padding:"3px 10px", borderRadius:6, background:"rgba(255,255,255,0.1)", fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:8, letterSpacing:0.5, fontFamily:FONT }}>
            Entry #{entry.id.replace(/\D/g,"")}
          </div>
          <h3 style={{ fontSize:20, fontWeight:700, color:"white", margin:"0 0 4px", lineHeight:1.25, fontFamily:FONT }}>{entry.title}</h3>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", margin:"0 0 10px", fontWeight:500, letterSpacing:0.3, fontFamily:FONT }}>
            {entry.name} · {entry.grade} Grade · {entry.county} County
          </p>
          
          <div className="qa-block">
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.6, margin:0, fontFamily:FONT, display: expanded?"block":"-webkit-box", WebkitLineClamp: expanded?"unset":3, WebkitBoxOrient:"vertical", overflow: expanded?"visible":"hidden" }}>
              {entry.description}
            </p>
          </div>

          {expanded && (
            <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:10, animation:"fadeIn 0.4s ease" }}>
              <a href={entry.link} target="_blank" rel="noopener noreferrer" className="qa-block" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"white", textDecoration:"none", marginTop:4, padding:"9px 18px", borderRadius:10, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", width:"fit-content", fontFamily:FONT }}>
                {"</>"} View Code & Artwork
              </a>
            </div>
          )}
          
          <div className="action-bar">
            <button onClick={() => setExpanded(!expanded)} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.8)", padding:"9px 18px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>
              {expanded ? "Show Less" : "Read More"}
            </button>
            {votingOpen && (
              <button onClick={() => onVote(entry.id)} disabled={hasVoted && !isVotedFor} style={{
                background: isVotedFor ? "white" : hasVoted ? "rgba(255,255,255,0.04)" : "white",
                border:"none", color: isVotedFor ? PURPLE : hasVoted ? "rgba(255,255,255,0.2)" : PURPLE,
                padding:"9px 22px", borderRadius:10, fontSize:14, fontWeight:700,
                cursor: hasVoted && !isVotedFor ? "not-allowed" : "pointer",
                opacity: hasVoted && !isVotedFor ? 0.3 : 1,
                boxShadow: isVotedFor ? "0 4px 16px rgba(255,255,255,0.25)" : hasVoted ? "none" : "0 2px 8px rgba(0,0,0,0.2)",
                transform: isVotedFor ? "scale(1.05)" : "scale(1)", transition:"all 0.3s ease", fontFamily:FONT
              }}>
                {isVotedFor ? "\u2605 Voted!" : hasVoted ? "Vote Cast" : "\u2606 Vote for This Entry"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LightboxModal({ entry, onClose }) {
  return (
    <div 
      style={{ position:"fixed", inset:0, zIndex:1100, background:"rgba(20,5,30,0.95)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fadeIn 0.3s ease", padding: 24 }}
      onClick={onClose}
    >
      <button 
        onClick={onClose} 
        style={{ position:"absolute", top:24, right:24, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", color:"white", width:44, height:44, borderRadius:"50%", fontSize:20, cursor:"pointer", zIndex: 1101, transition:"all 0.2s ease" }}
        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
      >
        &#x2715;
      </button>
      
      <img 
        src={entry.image} 
        alt={`Artwork by ${entry.name}`}
        style={{ maxWidth:"100%", maxHeight:"75vh", objectFit:"contain", borderRadius:12, boxShadow:"0 10px 40px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()} 
      />
      
      <div style={{ marginTop:24, textAlign:"center", color:"white" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize:28, fontWeight:700, margin:"0 0 6px", fontFamily:FONT }}>{entry.title}</h3>
        <p style={{ fontSize:16, color:"rgba(255,255,255,0.7)", margin:0, fontFamily:FONT }}>by {entry.name} &middot; {entry.grade} Grade</p>
      </div>
    </div>
  );
}

function AdminPanel({ votes, ENTRIES, onReset, onClose, onToggleVoting, votingOpen }) {
  const divs = ["elementary","middle","high"];
  const labels = { elementary:"Elementary (3-5)", middle:"Middle (6-8)", high:"High (9-12)" };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(40,10,60,0.92)", backdropFilter:"blur(20px)", display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn 0.3s ease", padding: 16 }}>
      <div style={{ background:"#2E1048", borderRadius:22, padding:"clamp(20px, 5vw, 32px)", maxWidth:600, width:"100%", maxHeight:"85vh", overflowY:"auto", border:"1px solid rgba(255,255,255,0.12)", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:"white", margin:0, fontFamily:FONT }}>Admin Dashboard</h2>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"white", width:36, height:36, borderRadius:10, fontSize:18, cursor:"pointer" }}>&#x2715;</button>
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap: "wrap" }}>
          <button onClick={onToggleVoting} style={{ flex:1, minWidth:140, padding:"13px 20px", borderRadius:12, background: votingOpen?"#dc2626":"#16a34a", border:"none", color:"white", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONT }}>
            {votingOpen ? "Pause Voting" : "Open Voting"}
          </button>
          <button onClick={onReset} style={{ flex:1, minWidth:140, padding:"13px 20px", borderRadius:12, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.6)", fontSize:13, cursor:"pointer", fontFamily:FONT }}>Reset All</button>
        </div>
        {divs.map(div => {
          const dv = votes[div] || {};
          const entriesForDiv = ENTRIES[div] || [];
          const sorted = entriesForDiv.map(e => ({...e, count: dv[e.id]||0})).sort((a,b) => b.count-a.count);
          const mx = Math.max(...sorted.map(s => s.count), 1);
          return (
            <div key={div} style={{ marginBottom:24 }}>
              <h3 style={{ fontSize:12, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:2, marginBottom:10, fontWeight:600, fontFamily:FONT }}>{labels[div]}</h3>
              {sorted.map((e,i) => {
                const [c1] = getAccent(e.id);
                return (
                  <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                    <span style={{ fontSize:12, color: i===0&&e.count>0?"#FFD166":"rgba(255,255,255,0.3)", width:20, textAlign:"right", fontWeight:600, fontFamily:FONT }}>{i+1}.</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", marginBottom:3, fontFamily:FONT }}>{e.name} — <span style={{ color:"rgba(255,255,255,0.5)" }}>{e.title}</span></div>
                      <div style={{ height:6, borderRadius:3, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:3, background:`linear-gradient(90deg,${c1},${c1}88)`, width:`${(e.count/mx)*100}%`, transition:"width 0.5s ease" }}/>
                      </div>
                    </div>
                    <span style={{ fontSize:14, color:"white", fontWeight:700, minWidth:28, textAlign:"right", fontFamily:FONT }}>{e.count}</span>
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

function ConfirmModal({ entry, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(40,10,60,0.9)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn 0.3s ease", padding: 16 }}>
      <div style={{ background:"#3A1857", borderRadius:22, padding:"clamp(24px, 6vw, 36px)", maxWidth:420, width:"100%", textAlign:"center", border:"1px solid rgba(255,255,255,0.15)", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>&#x1F5F3;&#xFE0F;</div>
        <h3 style={{ fontSize:22, fontWeight:700, color:"white", margin:"0 0 8px", fontFamily:FONT }}>Confirm Your Vote</h3>
        <p style={{ fontSize:15, color:"rgba(255,255,255,0.6)", marginBottom:6, fontFamily:FONT }}>You are voting for:</p>
        <p style={{ fontSize:19, fontWeight:700, color:"#FFD166", marginBottom:4, fontFamily:FONT }}>"{entry.title}"</p>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginBottom:24, fontFamily:FONT }}>by {entry.name}</p>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:24, fontStyle:"italic", fontFamily:FONT }}>You may only vote once per category.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap: "wrap" }}>
          <button onClick={onCancel} style={{ flex: 1, minWidth: 120, padding:"12px 28px", borderRadius:12, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.7)", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, minWidth: 120, padding:"12px 28px", borderRadius:12, background:"white", border:"none", color:PURPLE, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(255,255,255,0.2)", fontFamily:FONT }}>Cast Vote ★</button>
        </div>
      </div>
    </div>
  );
}

function ThankYouModal({ entry, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(40,10,60,0.9)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn 0.3s ease", padding: 16 }}>
      <div style={{ background:"#3A1857", borderRadius:22, padding:40, maxWidth:400, width:"100%", textAlign:"center", border:"1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ fontSize:64, marginBottom:12, animation:"bounceIn 0.5s ease" }}>&#x1F389;</div>
        <h3 style={{ fontSize:24, fontWeight:700, color:"white", margin:"0 0 8px", fontFamily:FONT }}>Vote Cast!</h3>
        <p style={{ fontSize:15, color:"rgba(255,255,255,0.6)", fontFamily:FONT }}>Thank you for supporting <span style={{ color:"#FFD166", fontWeight:700 }}>{entry.name}</span></p>
      </div>
    </div>
  );
}

const DIV_LABELS = {
  elementary: { label:"Elementary", grades:"Grades 3\u20135", emoji:"\uD83C\uDF31" },
  middle: { label:"Middle School", grades:"Grades 6\u20138", emoji:"\uD83C\uDF3F" },
  high: { label:"High School", grades:"Grades 9\u201312", emoji:"\uD83C\uDF33" },
};

export default function CodeYourSelfVoting() {
  const [activeDivision, setActiveDivision] = useState("elementary");
  const [votes, setVotes] = useState({ elementary:{}, middle:{}, high:{} });
  const [myVotes, setMyVotes] = useState({});
  const [confirmEntry, setConfirmEntry] = useState(null);
  const [thankYouEntry, setThankYouEntry] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [votingOpen, setVotingOpen] = useState(true);
  const [ENTRIES, setENTRIES] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [lightboxEntry, setLightboxEntry] = useState(null);

  useEffect(() => {
    try { const r = localStorage.getItem("cys-votes"); if(r) setVotes(JSON.parse(r)); } catch{}
    try { const r = localStorage.getItem("cys-myvotes"); if(r) setMyVotes(JSON.parse(r)); } catch{}
    try { const r = localStorage.getItem("cys-voting-open"); if(r) setVotingOpen(JSON.parse(r)); } catch{}
    
    Papa.parse("/entries.csv", {
      download: true,
      header: true,
      skipEmptyLines: true, 
      complete: (results) => {
        const parsedEntries = { elementary: [], middle: [], high: [] };
        results.data.forEach(row => {
          const div = row.division?.toLowerCase().trim();
          if (div && parsedEntries[div]) {
            parsedEntries[div].push(row);
          }
        });
        setENTRIES(parsedEntries);
        setLoaded(true);
      },
      error: (err) => {
        console.error("Failed to fetch CSV file", err);
        setENTRIES({ elementary: [], middle: [], high: [] }); 
        setLoaded(true);
      }
    });
  }, []);

  const saveVotes = (nv, nm) => { 
    try { 
      localStorage.setItem("cys-votes", JSON.stringify(nv)); 
      localStorage.setItem("cys-myvotes", JSON.stringify(nm)); 
    } catch{} 
  };
  
  const resetVotes = () => { 
    const e = { elementary:{}, middle:{}, high:{} }; 
    setVotes(e); 
    setMyVotes({}); 
    try { 
      localStorage.setItem("cys-votes", JSON.stringify(e)); 
      localStorage.setItem("cys-myvotes", JSON.stringify({}));
    } catch{} 
  };
  
  const toggleVoting = () => { 
    const ns = !votingOpen; 
    setVotingOpen(ns); 
    try { 
      localStorage.setItem("cys-voting-open", JSON.stringify(ns)); 
    } catch{} 
  };

  const handleVote = (id) => { if(myVotes[activeDivision]) return; setConfirmEntry(ENTRIES[activeDivision].find(e=>e.id===id)); };
  const confirmVote = () => {
    const id = confirmEntry.id;
    const nv = {...votes}; if(!nv[activeDivision]) nv[activeDivision]={};
    nv[activeDivision][id] = (nv[activeDivision][id]||0)+1;
    const nm = {...myVotes, [activeDivision]:id};
    setVotes(nv); setMyVotes(nm); saveVotes(nv,nm);
    setThankYouEntry(confirmEntry); setConfirmEntry(null);
  };
  const handleAdmin = () => { if(adminCode==="codeartvoting"){setShowAdmin(true);setAdminCode("");} };

  if(!loaded || !ENTRIES) return <div style={{minHeight:"100vh",background:PURPLE,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"rgba(255,255,255,0.5)",fontSize:14,fontFamily:FONT}}>Loading Entries...</div></div>;

  const entries = ENTRIES[activeDivision] || [];
  const divInfo = DIV_LABELS[activeDivision];

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg, #6B2FA0 0%, #5B278E 30%, #4A1D7A 70%, #3A1560 100%)", color:"white", fontFamily:FONT }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;font-family:${FONT};}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounceIn{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        ::-webkit-scrollbar{width:6px; height: 6px;}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px}

        /* Desktop Layout Classes */
        .card-layout { display: flex; gap: 20px; padding: 20px; align-items: center; flex-wrap: wrap; }
        .card-layout.is-expanded { align-items: flex-start; }
        .card-content { flex: 1; min-width: min(100%, 250px); }
        .action-bar { display: flex; gap: 10px; margin-top: 16px; align-items: center; flex-wrap: wrap; }
        .qa-block { text-align: left; }
        .nav-tabs { display: flex; gap: 8px; margin-bottom: 28px; overflow-x: auto; padding-bottom: 8px; }

        /* Mobile Layout Adjustments */
        @media (max-width: 600px) {
          .card-layout { flex-direction: column; align-items: center !important; text-align: center; }
          .action-bar { justify-content: center; }
          .nav-tabs { padding-bottom: 12px; }
        }
      `}</style>

      <header style={{ padding:"36px 24px 0", maxWidth:880, margin:"0 auto", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 18px", borderRadius:100, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", marginBottom:20 }}>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.75)", letterSpacing:1.5, textTransform:"uppercase", fontWeight:600 }}>Code/Art Fest 2026</span>
        </div>
        <h1 style={{ fontSize:"clamp(34px,7vw,52px)", fontWeight:800, lineHeight:1.1, marginBottom:10, color:"white", textShadow:"0 2px 20px rgba(0,0,0,0.3)" }}>CodeYourSelf&#x2122;</h1>
        <p style={{ fontSize:"clamp(15px,2.5vw,18px)", color:"rgba(255,255,255,0.75)", marginBottom:6, fontWeight:500, lineHeight:1.4 }}>This Is Me: My Story, My Roots</p>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:24, letterSpacing:1.5, textTransform:"uppercase", fontWeight:600 }}>South Florida Regional &middot; Final Voting Round</p>
        
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px", borderRadius:100, background: votingOpen?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)", border:`1px solid ${votingOpen?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`, marginBottom:28 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background: votingOpen?"#22c55e":"#ef4444", boxShadow:`0 0 8px ${votingOpen?"#22c55e":"#ef4444"}`, animation:"pulse 2s ease infinite" }}/>
          <span style={{ fontSize:12, fontWeight:700, letterSpacing:1.2, color: votingOpen?"#4ade80":"#f87171" }}>{votingOpen?"VOTING OPEN":"VOTING CLOSED"}</span>
        </div>
        
        {/* LIGHTBOX INSTRUCTIONS */}
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:10, fontStyle: "italic" }}>
          Tip: Click any image to view it full screen!
        </p>

      </header>

      <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px" }}>
        <nav className="nav-tabs">
          {Object.entries(DIV_LABELS).map(([key,val]) => {
            const isA = activeDivision===key, voted = !!myVotes[key];
            return (
              <button key={key} onClick={()=>setActiveDivision(key)} style={{ flex:1, minWidth:130, padding:"14px", borderRadius:14, background: isA?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.05)", border: isA?"1px solid rgba(255,255,255,0.25)":"1px solid rgba(255,255,255,0.08)", cursor:"pointer", transition:"all 0.25s ease", position:"relative", fontFamily:FONT }}>
                <div style={{ fontSize:15, fontWeight:700, color: isA?"white":"rgba(255,255,255,0.5)", marginBottom:2 }}>{val.emoji} {val.label}</div>
                <div style={{ fontSize:12, color: isA?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.3)", fontWeight:500 }}>{val.grades}</div>
                {voted && <div style={{ position:"absolute", top:7, right:10, fontSize:10, color:"#4ade80", fontWeight:700 }}>&#x2713; voted</div>}
              </button>
            );
          })}
        </nav>
      </div>

      {votingOpen && !myVotes[activeDivision] && (
        <div style={{ maxWidth:880, margin:"0 auto 20px", padding:"0 24px" }}>
          <div style={{ padding:"14px 20px", borderRadius:14, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", fontSize:14, color:"rgba(255,255,255,0.75)", display:"flex", alignItems:"center", gap:10, fontWeight:500 }}>
            <span style={{fontSize:18}}>&#x1F4A1;</span> Review all entries below, then cast your vote for your favorite in the {divInfo.label} division. You may vote once per division.
          </div>
        </div>
      )}

      <main style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 60px", display:"flex", flexDirection:"column", gap:14 }}>
        {entries.length === 0 ? (
          <div style={{ textAlign:"center", padding: "40px", color: "rgba(255,255,255,0.5)" }}>
            No entries loaded for this division yet. Check your entries.csv file!
          </div>
        ) : (
          entries.map((entry,i) => (
            <div key={entry.id} style={{ animation:`slideUp 0.35s ease ${i*0.04}s both` }}>
              <EntryCard entry={entry} onVote={handleVote} hasVoted={!!myVotes[activeDivision]} isVotedFor={myVotes[activeDivision]===entry.id} votingOpen={votingOpen} onImageClick={setLightboxEntry} />
            </div>
          ))
        )}
      </main>

      <footer style={{ maxWidth:880, margin:"0 auto", padding:"20px 24px 36px", borderTop:"1px solid rgba(255,255,255,0.08)", textAlign:"center" }}>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:8, fontWeight:500 }}>CodeYourSelf&#x2122; is part of Code/Art's mission to inspire girls in tech through creative coding.</p>
        <div style={{ display:"inline-flex", gap:8, alignItems:"center", flexWrap: "wrap", justifyContent: "center" }}>
          <input type="password" placeholder="Admin code" value={adminCode} onChange={e=>setAdminCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdmin()} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 14px", color:"rgba(255,255,255,0.6)", fontSize:12, outline:"none", width:140, fontFamily:FONT }} />
          <button onClick={handleAdmin} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 14px", color:"rgba(255,255,255,0.4)", fontSize:12, cursor:"pointer" }}>&rarr;</button>
        </div>
      </footer>

      {confirmEntry && <ConfirmModal entry={confirmEntry} onConfirm={confirmVote} onCancel={()=>setConfirmEntry(null)} />}
      {thankYouEntry && <ThankYouModal entry={thankYouEntry} onClose={()=>setThankYouEntry(null)} />}
      {showAdmin && <AdminPanel votes={votes} ENTRIES={ENTRIES} onReset={resetVotes} onClose={()=>setShowAdmin(false)} onToggleVoting={toggleVoting} votingOpen={votingOpen} />}
      {lightboxEntry && <LightboxModal entry={lightboxEntry} onClose={() => setLightboxEntry(null)} />}
    </div>
  );
}