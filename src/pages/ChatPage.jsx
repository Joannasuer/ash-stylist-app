// src/pages/ChatPage.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, Trash2, Edit3, X, Copy, Check, RefreshCw, Sparkles, ChevronRight, Paperclip, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';

const injectFonts = () => {
  if (document.getElementById('ash-gf')) return;
  const l = document.createElement('link');
  l.id = 'ash-gf'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap';
  document.head.appendChild(l);
};

const ASH_LOGO = '/ash-logo.png';
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";
const STORAGE_KEY = 'ash_convos_v5';

const PRODUCTS = [
  { id:'hush-001', name:'Midnight Silk Dress',  price:'180', cat:'Dress',      img:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&fit=crop', link:'https://timeforhush.com/products/midnight-silk-dress',    desc:'Black silk, open back. The dress that ends conversations.' },
  { id:'hush-002', name:'Executive Blazer',      price:'250', cat:'Outerwear',  img:'https://images.unsplash.com/photo-1548624149-f32144679638?w=400&fit=crop', link:'https://timeforhush.com/products/executive-blazer',       desc:'Oversized, sharp shoulders. Power dressing redefined.' },
  { id:'hush-003', name:'Viper Leather Pants',   price:'300', cat:'Bottoms',    img:'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&fit=crop', link:'https://timeforhush.com/products/viper-leather-pants',    desc:'High waisted, vegan leather. Built for people who arrive.' },
  { id:'hush-004', name:'Raw Edge Denim',        price:'220', cat:'Denim',      img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&fit=crop', link:'https://timeforhush.com/products/raw-edge-denim',         desc:'Japanese selvage. Straight leg. The only denim you need.' },
  { id:'hush-005', name:'Sculpt Athleisure Set', price:'195', cat:'Athleisure', img:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&fit=crop', link:'https://timeforhush.com/products/sculpt-athleisure-set', desc:'Technical fabric. Sculpting silhouette.' },
];

const QUICK = [
  'Style me for dinner tonight — make it dangerous',
  'Power meeting tomorrow. Dress me.',
  'Sketch it — cinematic look',
  'Best denim for my body type',
  'Full luxe athleisure set',
  'What to wear this weekend?',
];

async function askAsh(msg, profile, history) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: msg, userProfile: profile, products: PRODUCTS, history }),
  });
  if (!res.ok) throw new Error('Ash unavailable');
  return res.json();
}

const C = {
  bg:'#FAFAF8', surf:'#FFFFFF', sb:'#F2EFE9',
  bdr:'#E5E1DB', txt:'#1A1714', mid:'#6B6560', fnt:'#A09890',
  acc:'#C41E1E', accBg:'rgba(196,30,30,0.07)',
  uBg:'#1A1714', uFg:'#FAFAF8',
  shd:'0 1px 10px rgba(0,0,0,0.06)',
};

const CSS = `
  @keyframes msgUp  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideL { from{transform:translateX(-110%)} to{transform:translateX(0)} }
  @keyframes slideR { from{transform:translateX(110%)}  to{transform:translateX(0)} }
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes vPulse { 0%{filter:brightness(1) drop-shadow(0 0 0px #C41E1E);transform:scale(1)} 35%{filter:brightness(1.6) drop-shadow(0 0 12px #C41E1E);transform:scale(1.12)} 70%{filter:brightness(0.8) drop-shadow(0 0 2px #C41E1E);transform:scale(0.94)} 100%{filter:brightness(1) drop-shadow(0 0 0px #C41E1E);transform:scale(1)} }
  @keyframes vFloat { 0%,100%{opacity:0.4;transform:translateY(0)} 50%{opacity:1;transform:translateY(-1px)} }
  .ash-up   { animation: msgUp  .28s cubic-bezier(.16,1,.3,1) forwards; }
  .ash-fade { animation: fadeIn .22s ease forwards; }
  .ash-sl   { animation: slideL .32s cubic-bezier(.16,1,.3,1) forwards; }
  .ash-sr   { animation: slideR .32s cubic-bezier(.16,1,.3,1) forwards; }
  .ash-cur  { display:inline-block;width:2px;height:.85em;background:#C41E1E;margin-left:1px;vertical-align:text-bottom;animation:blink 1s step-end infinite; }
  .ash-vp   { animation: vPulse 1.8s ease-in-out infinite; transform-origin: center; }
  .ash-vt   { animation: vFloat 1.8s ease-in-out infinite; }
  .ash-sc::-webkit-scrollbar       { width: 4px; }
  .ash-sc::-webkit-scrollbar-track { background: transparent; }
  .ash-sc::-webkit-scrollbar-thumb { border-radius: 4px; background: #D5D0C8; }
  .ash-hov .ash-hv              { opacity: 0; transition: opacity .15s; }
  .ash-hov:hover .ash-hv        { opacity: 1; }
  .ash-ib { transition:all .15s; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; background:none; padding:0; }
  .ash-ib:hover  { transform: scale(1.08); }
  .ash-ib:active { transform: scale(.95); }
  .ash-ci { cursor:pointer; transition: background .15s; }
  .ash-ch { cursor:pointer; transition: all .15s; }
  .ash-ch:hover { transform: translateY(-1px); }
  .ash-pc { transition: all .2s; }
  .ash-pc:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
`;

const db = {
  load: () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } },
  save: (d) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} },
};

function useStream() {
  const [text, setText] = useState('');
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  const stream = useCallback((full, done) => {
    setText(''); setRunning(true); let i = 0;
    const tick = () => {
      i = Math.min(i + Math.floor(Math.random() * 3) + 1, full.length);
      setText(full.slice(0, i));
      if (i < full.length) ref.current = setTimeout(tick, 11 + Math.random() * 9);
      else { setRunning(false); done?.(); }
    };
    ref.current = setTimeout(tick, 60);
  }, []);
  const stop = () => { clearTimeout(ref.current); setRunning(false); };
  return { text, running, stream, stop };
}

function MD({ text }) {
  if (!text) return null;
  const lines = text.split('\n'); const out = []; let i = 0;
  const fmt = s => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('**') && l.endsWith('**') && !l.slice(2,-2).includes('**')) {
      out.push(<div key={i} style={{fontFamily:serif,fontWeight:600,fontSize:17,color:C.txt,margin:'10px 0 4px'}}>{l.slice(2,-2)}</div>);
    } else if (l.startsWith('- ') || l.startsWith('* ')) {
      const its = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) { its.push(lines[i].slice(2)); i++; }
      out.push(<ul key={'u'+i} style={{listStyle:'none',padding:0,margin:'5px 0'}}>{its.map((it,j)=><li key={j} style={{display:'flex',gap:7,margin:'4px 0',fontFamily:sans,fontSize:14,lineHeight:1.7,color:C.txt}}><span style={{color:C.acc,flexShrink:0,fontSize:10,marginTop:4}}>✦</span><span dangerouslySetInnerHTML={{__html:fmt(it)}}/></li>)}</ul>);
      continue;
    } else if (l.trim() === '---') {
      out.push(<hr key={i} style={{border:'none',borderTop:`1px solid ${C.bdr}`,margin:'10px 0'}}/>);
    } else if (l.trim() === '') {
      if (i > 0 && lines[i-1].trim()) out.push(<div key={i} style={{height:4}}/>);
    } else {
      out.push(<p key={i} style={{margin:'2px 0',fontFamily:sans,fontSize:14,lineHeight:1.78,color:C.txt}} dangerouslySetInnerHTML={{__html:fmt(l)}}/>);
    }
    i++;
  }
  return <div>{out}</div>;
}

// Avatar — transparent background so logo looks natural
function Av({ isAsh, pulse }) {
  if (isAsh) return (
    <div style={{width:32,height:32,borderRadius:'50%',background:'transparent',border:`1px solid ${C.bdr}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <img src={ASH_LOGO} className={pulse?'ash-vp':''} style={{width:28,height:28,objectFit:'contain'}} alt="Ash"/>
    </div>
  );
  return (
    <div style={{width:32,height:32,borderRadius:'50%',background:C.uBg,border:`1px solid ${C.bdr}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <span style={{fontFamily:sans,fontSize:11,fontWeight:600,color:C.uFg}}>U</span>
    </div>
  );
}

function Thinking() {
  return (
    <div className="ash-up" style={{display:'flex',gap:12,marginBottom:22,maxWidth:760,marginLeft:'auto',marginRight:'auto'}}>
      <div style={{marginTop:18,flexShrink:0}}><Av isAsh pulse/></div>
      <div>
        <div style={{fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.14em',color:C.fnt,marginBottom:5}}>Ash</div>
        <div style={{display:'flex',alignItems:'center',gap:12,background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:'4px 16px 16px 16px',padding:'12px 18px',boxShadow:C.shd}}>
          <img src={ASH_LOGO} className="ash-vp" style={{width:22,height:22,objectFit:'contain',flexShrink:0}} alt=""/>
          <span className="ash-vt" style={{fontFamily:serif,fontStyle:'italic',fontSize:15,color:C.fnt,letterSpacing:'.04em'}}>Styling your look…</span>
        </div>
      </div>
    </div>
  );
}

function PCard({ p }) {
  return (
    <a href={p.link} target="_blank" rel="noreferrer" className="ash-pc"
      style={{display:'block',textDecoration:'none',background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,overflow:'hidden',marginBottom:10,boxShadow:C.shd}}>
      <div style={{position:'relative'}}>
        <img src={p.img} alt={p.name} style={{width:'100%',height:130,objectFit:'cover',display:'block'}}/>
        <div style={{position:'absolute',top:7,right:7,background:C.acc,color:'#fff',fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',padding:'2px 7px',borderRadius:20,fontFamily:sans}}>{p.cat}</div>
      </div>
      <div style={{padding:'10px 12px 12px'}}>
        <div style={{fontFamily:serif,fontWeight:600,fontSize:14,color:C.txt,marginBottom:2,lineHeight:1.2}}>{p.name}</div>
        <div style={{fontFamily:sans,fontSize:11,color:C.fnt,marginBottom:8,lineHeight:1.5}}>{p.desc}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontFamily:sans,fontWeight:600,fontSize:13,color:C.acc}}>${p.price}</span>
          <span style={{fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',color:C.mid,display:'flex',alignItems:'center',gap:2}}>Shop<ChevronRight size={10}/></span>
        </div>
      </div>
    </a>
  );
}

function Lookbook({ look, onClose }) {
  const items = look?.itemIds ? look.itemIds.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean) : PRODUCTS;
  return (
    <>
      <div className="ash-fade" onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.28)',zIndex:200,backdropFilter:'blur(3px)'}}/>
      <div className="ash-sr ash-sc" style={{position:'fixed',top:0,right:0,bottom:0,width:296,background:C.sb,borderLeft:`1px solid ${C.bdr}`,zIndex:201,overflowY:'auto',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'14px 16px',borderBottom:`1px solid ${C.bdr}`,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:C.sb}}>
          <div>
            <div style={{fontFamily:serif,fontWeight:600,fontSize:16,color:C.txt}}>{look?.title||'HUSH Collection'}</div>
            {look?.explanation&&<div style={{fontFamily:sans,fontStyle:'italic',fontSize:11,color:C.mid,marginTop:2}}>{look.explanation}</div>}
          </div>
          <button className="ash-ib" onClick={onClose} style={{color:C.fnt,width:26,height:26,borderRadius:6}}><X size={14}/></button>
        </div>
        <div style={{padding:12}}>{items.map(p=><PCard key={p.id} p={p}/>)}</div>
      </div>
    </>
  );
}

function Sidebar({ convos, active, onSel, onNew, onDel, onRen, onClose }) {
  const [eid, setEid] = useState(null);
  const [etxt, setEtxt] = useState('');
  return (
    <>
      <div className="ash-fade" onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.18)',zIndex:98}}/>
      <div className="ash-sl ash-sc" style={{position:'fixed',top:0,left:0,bottom:0,width:252,background:C.sb,borderRight:`1px solid ${C.bdr}`,zIndex:99,display:'flex',flexDirection:'column',boxShadow:'4px 0 20px rgba(0,0,0,0.08)'}}>
        <div style={{padding:'13px 14px',borderBottom:`1px solid ${C.bdr}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <img src={ASH_LOGO} style={{width:22,height:22,objectFit:'contain'}} alt="ASH"/>
            <span style={{fontFamily:serif,fontWeight:600,fontSize:14,color:C.acc,letterSpacing:'.15em'}}>ASH ×</span>
          </div>
          <div style={{display:'flex',gap:5}}>
            <button className="ash-ib" onClick={onNew} style={{background:C.accBg,border:`1px solid ${C.acc}40`,borderRadius:7,width:26,height:26,color:C.acc}}><Plus size={13}/></button>
            <button className="ash-ib" onClick={onClose} style={{width:26,height:26,borderRadius:7,color:C.fnt}}><X size={13}/></button>
          </div>
        </div>
        <div style={{padding:'5px 7px 3px',fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.14em',color:C.fnt,flexShrink:0}}>Conversations</div>
        <div className="ash-sc" style={{flex:1,overflowY:'auto',padding:'2px 5px 8px'}}>
          {convos.length===0&&<div style={{padding:'18px 10px',textAlign:'center',fontFamily:sans,fontSize:13,color:C.fnt,lineHeight:1.7}}>Your conversations<br/>with Ash appear here.</div>}
          {convos.map(c=>(
            <div key={c.id} className="ash-ci ash-hov" onClick={()=>{onSel(c.id);onClose();}}
              style={{borderRadius:9,padding:'8px 9px',marginBottom:2,background:c.id===active?C.accBg:'transparent',border:`1px solid ${c.id===active?C.acc+'40':'transparent'}`}}>
              {eid===c.id
                ?<input value={etxt} onChange={e=>setEtxt(e.target.value)} onBlur={()=>{if(etxt.trim())onRen(c.id,etxt.trim());setEid(null);}} onKeyDown={e=>{if(e.key==='Enter'){if(etxt.trim())onRen(c.id,etxt.trim());setEid(null);}if(e.key==='Escape')setEid(null);}} onClick={e=>e.stopPropagation()} autoFocus style={{width:'100%',background:'none',border:`1px solid ${C.acc}`,borderRadius:4,padding:'2px 5px',fontFamily:sans,fontSize:13,color:C.txt,outline:'none'}}/>
                :<>
                  <div style={{fontFamily:sans,fontSize:13,fontWeight:500,color:C.txt,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',lineHeight:1.3}}>{c.title}</div>
                  <div style={{fontFamily:sans,fontSize:11,color:C.fnt,marginTop:2}}>{c.date}</div>
                  <div className="ash-hv" style={{display:'flex',gap:2,marginTop:3}}>
                    <button onClick={e=>{e.stopPropagation();setEid(c.id);setEtxt(c.title);}} className="ash-ib" style={{width:18,height:18,borderRadius:3,color:C.fnt}}><Edit3 size={9}/></button>
                    <button onClick={e=>{e.stopPropagation();onDel(c.id);}} className="ash-ib" style={{width:18,height:18,borderRadius:3,color:C.fnt}}><Trash2 size={9}/></button>
                  </div>
                </>}
            </div>
          ))}
        </div>
        <div style={{padding:'8px 12px',borderTop:`1px solid ${C.bdr}`,fontFamily:sans,fontSize:10,color:C.fnt,textAlign:'center',letterSpacing:'.07em',flexShrink:0}}>ASH × HUSH — Styled by AI</div>
      </div>
    </>
  );
}

function Message({ msg, onRegen, onLook, isLast, streamText, isStreaming }) {
  const [copied, setCopied] = useState(false);
  const isAsh = msg.role === 'assistant';
  const content = isStreaming ? streamText : msg.content;
  const copy = () => { navigator.clipboard?.writeText(content||''); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <div className="ash-up ash-hov" style={{display:'flex',gap:12,marginBottom:24,maxWidth:760,marginLeft:'auto',marginRight:'auto',flexDirection:isAsh?'row':'row-reverse'}}>
      <div style={{flexShrink:0,marginTop:18}}><Av isAsh={isAsh}/></div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.14em',color:C.fnt,marginBottom:5}}>{isAsh?'Ash':'You'}</div>
        {msg.imgUrl&&<img src={msg.imgUrl} alt="" style={{maxWidth:240,maxHeight:160,borderRadius:10,marginBottom:8,objectFit:'cover',border:`1px solid ${C.bdr}`,display:'block'}}/>}
        <div>
          {isAsh?<><MD text={content}/>{isStreaming&&isLast&&<span className="ash-cur"/>}</>:<p style={{margin:0,fontFamily:sans,fontSize:14,lineHeight:1.78,color:C.txt}}>{content}</p>}
        </div>
        {isAsh&&msg.look&&!isStreaming&&(
          <button onClick={()=>onLook(msg.look)} className="ash-ch"
            style={{marginTop:10,display:'inline-flex',alignItems:'center',gap:6,background:C.accBg,border:`1px solid ${C.acc}40`,borderRadius:24,padding:'6px 13px',fontFamily:sans,fontSize:11,fontWeight:600,color:C.acc,textTransform:'uppercase',letterSpacing:'.08em',cursor:'pointer'}}>
            <Sparkles size={11}/> View Look: {msg.look.title}
          </button>
        )}
        {!isStreaming&&(
          <div className="ash-hv" style={{display:'flex',gap:3,marginTop:6}}>
            <button className="ash-ib" onClick={copy} style={{width:26,height:26,borderRadius:6,color:copied?'#22c55e':C.fnt}}>{copied?<Check size={12}/>:<Copy size={12}/>}</button>
            {isAsh&&isLast&&<button className="ash-ib" onClick={onRegen} style={{width:26,height:26,borderRadius:6,color:C.fnt}}><RefreshCw size={12}/></button>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  useEffect(() => { injectFonts(); }, []);

  // Use the existing app FIT ID modal — no duplicate
  const { setShowSizeModal } = useApp();

  // THE KEY FIX: measure the actual header height and set exact height
  const outerRef = useRef(null);
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header');
      const headerH = header ? header.offsetHeight : 0;
      if (outerRef.current) {
        outerRef.current.style.height = `${window.innerHeight - headerH}px`;
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const INIT = { role:'assistant', content:"Darling, I'm Ash. Let's make you look dangerous. What's the occasion?", id:'init' };
  const [convos, setConvos] = useState(() => db.load());
  const [activeId, setActiveId] = useState(null);
  const [msgs, setMsgs] = useState([INIT]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [sbOpen, setSbOpen] = useState(false);
  const [lookbook, setLookbook] = useState(null);
  const [imgPrev, setImgPrev] = useState(null);
  const [streamId, setStreamId] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const { text:stxt, running:srun, stream, stop } = useStream();

  useEffect(() => { db.save(convos); }, [convos]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, stxt]);

  const save = useCallback((m, id) => {
    const sid = id || activeId;
    const first = m.find(x => x.role==='user');
    if (!first) return sid;
    const title = first.content.slice(0,48)+(first.content.length>48?'…':'');
    const date = new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    setConvos(p => {
      if (p.find(c=>c.id===sid)) return p.map(c=>c.id===sid?{...c,title,date,messages:m}:c);
      return [{id:sid,title,date,messages:m},...p];
    });
    return sid;
  }, [activeId]);

  const hist = () => msgs.filter(m=>m.id!=='init').slice(-12).map(m=>({role:m.role,content:m.content}));

  const send = async (text, img) => {
    const msg = (text||input).trim();
    if ((!msg&&!img)||loading) return;
    setInput(''); setImgPrev(null);
    const sid = activeId||String(Date.now());
    if (!activeId) setActiveId(sid);
    const um = {role:'user',content:msg,imgUrl:img||null,id:String(Date.now())};
    const next = [...msgs,um];
    setMsgs(next); setLoading(true);
    const pid = 'p'+Date.now();
    setMsgs(p=>[...p,{role:'assistant',content:'',id:pid,isPend:true}]);
    try {
      const r = await askAsh(msg, profile, hist());
      const aid = 'a'+Date.now();
      setStreamId(aid); setLoading(false);
      setMsgs(p=>p.filter(m=>m.id!==pid).concat({role:'assistant',content:r.text,look:r.suggestedLook,id:aid}));
      stream(r.text, () => {
        setStreamId(null);
        const fin = [...next,{role:'assistant',content:r.text,look:r.suggestedLook,id:aid}];
        setMsgs(fin); save(fin,sid);
      });
    } catch {
      setMsgs(p=>p.filter(m=>m.id!==pid).concat({role:'assistant',content:"Something interrupted me. Try again.",id:String(Date.now())}));
      setLoading(false);
    }
  };

  const regen = async () => { const lu=[...msgs].reverse().find(m=>m.role==='user'); if(!lu||loading)return; setMsgs(p=>{const last=p.filter(m=>m.role==='assistant').at(-1);return last?p.filter(m=>m.id!==last.id):p;}); await send(lu.content); };
  const newChat = () => { save(msgs); setActiveId(null); setMsgs([INIT]); setInput(''); stop(); setStreamId(null); };
  const loadConvo = id => { const c=convos.find(x=>x.id===id); if(c){save(msgs);setActiveId(id);setMsgs(c.messages);} };
  const delConvo = id => { setConvos(p=>p.filter(c=>c.id!==id)); if(id===activeId)newChat(); };
  const renConvo = (id,title) => setConvos(p=>p.map(c=>c.id===id?{...c,title}:c));
  const handleFile = e => { const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setImgPrev(ev.target.result); r.readAsDataURL(f); };
  const lastAshI = [...msgs].reduceRight((a,m,i)=>a===-1&&m.role==='assistant'?i:a,-1);
  const isWelcome = msgs.length<=1;
  const display = msgs.map(m=>m.id===streamId?{...m,content:stxt,isStreaming:true}:m);

  return (
    <div ref={outerRef} style={{display:'flex',flexDirection:'column',overflow:'hidden',background:C.bg,width:'100%'}}>
      <style>{CSS}</style>

      {/* Minimal chat toolbar — history + new chat + collection. No duplicate of existing nav. */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 14px',borderBottom:`1px solid ${C.bdr}`,background:C.surf,flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <button className="ash-ib" onClick={()=>setSbOpen(true)} title="Chat history"
            style={{width:30,height:30,borderRadius:8,color:C.mid,background:C.bg,border:`1px solid ${C.bdr}`}}>
            <Menu size={14}/>
          </button>
          <button className="ash-ib" onClick={newChat} title="New conversation"
            style={{width:30,height:30,borderRadius:8,color:C.acc,background:C.accBg,border:`1px solid ${C.acc}40`}}>
            <Plus size={14}/>
          </button>
        </div>
        <span style={{fontFamily:sans,fontSize:11,color:C.fnt,letterSpacing:'.06em'}}>
          {profile ? <span style={{color:C.acc,fontWeight:600}}>✦ {profile.name?.split(' ')[0]} — FIT ID Active</span> : 'Ask Ash anything'}
        </span>
        <button onClick={()=>setLookbook('all')}
          style={{display:'flex',alignItems:'center',gap:4,background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:20,padding:'5px 12px',cursor:'pointer',fontFamily:sans,fontSize:11,fontWeight:500,color:C.mid}}>
          View Collection
        </button>
      </div>

      {/* Messages — flex:1 + minHeight:0 is the key to locking input at bottom */}
      <div className="ash-sc" style={{flex:1,minHeight:0,overflowY:'auto',padding:'24px 18px 8px'}}>
        {isWelcome&&(
          <div className="ash-fade" style={{textAlign:'center',marginBottom:40}}>
            {/* Transparent background — logo shows cleanly */}
            <div style={{width:72,height:72,borderRadius:'50%',background:'transparent',border:`1px solid ${C.bdr}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <img src={ASH_LOGO} style={{width:52,height:52,objectFit:'contain'}} alt="ASH"/>
            </div>
            <div style={{fontFamily:serif,fontWeight:300,fontSize:36,color:C.txt,letterSpacing:'.02em',lineHeight:1.2,marginBottom:8}}>Style starts here.</div>
            <div style={{fontFamily:sans,fontSize:14,color:C.fnt,lineHeight:1.7,maxWidth:340,margin:'0 auto'}}>Ask Ash anything — outfits, occasions, body types, trends.<br/>She knows exactly what works.</div>
          </div>
        )}
        {display.map((m,i)=>m.isPend?<Thinking key={m.id}/>:<Message key={m.id} msg={m} onRegen={regen} onLook={setLookbook} isLast={i===lastAshI} streamText={stxt} isStreaming={m.id===streamId&&srun}/>)}
        <div ref={bottomRef}/>
      </div>

      {/* Quick prompts */}
      {isWelcome&&(
        <div style={{padding:'0 18px 12px',display:'flex',flexWrap:'wrap',gap:7,maxWidth:760,margin:'0 auto',width:'100%',boxSizing:'border-box',flexShrink:0}}>
          {QUICK.map(q=><button key={q} onClick={()=>send(q)} className="ash-ch" style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:24,padding:'7px 15px',fontFamily:sans,fontSize:12,fontWeight:500,color:C.mid,boxShadow:C.shd,cursor:'pointer'}}>{q}</button>)}
        </div>
      )}

      {/* Image preview */}
      {imgPrev&&(
        <div style={{padding:'0 18px 7px',maxWidth:760,margin:'0 auto',width:'100%',boxSizing:'border-box',flexShrink:0}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:10,padding:7}}>
            <img src={imgPrev} alt="" style={{width:40,height:40,objectFit:'cover',borderRadius:7}}/>
            <span style={{fontFamily:sans,fontSize:12,color:C.mid}}>Image ready</span>
            <button className="ash-ib" onClick={()=>setImgPrev(null)} style={{color:C.fnt,width:18,height:18}}><X size={12}/></button>
          </div>
        </div>
      )}

      {/* Input bar — flexShrink:0 keeps it always at the bottom */}
      <div style={{padding:'9px 16px 13px',borderTop:`1px solid ${C.bdr}`,background:C.surf,flexShrink:0}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <div style={{display:'flex',gap:7,alignItems:'center',background:C.bg,border:`1.5px solid ${C.bdr}`,borderRadius:20,padding:'9px 10px 9px 14px',boxShadow:C.shd}}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>
            <button className="ash-ib" onClick={()=>fileRef.current?.click()} style={{width:28,height:28,borderRadius:7,color:C.fnt,flexShrink:0}}><Paperclip size={14}/></button>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter')send(input,imgPrev);}}
              placeholder="Ask Ash anything about your style…"
              style={{flex:1,background:'transparent',border:'none',fontFamily:sans,fontSize:14,color:C.txt,outline:'none',caretColor:C.acc,minWidth:0}}
            />
            {loading
              ?<button className="ash-ib" onClick={stop} style={{width:34,height:34,borderRadius:10,background:C.accBg,color:C.acc,flexShrink:0}}><X size={14}/></button>
              :<button className="ash-ib" onClick={()=>send(input,imgPrev)} disabled={!input.trim()&&!imgPrev}
                  style={{width:34,height:34,borderRadius:10,background:(input.trim()||imgPrev)?C.acc:C.bdr,color:(input.trim()||imgPrev)?'#fff':C.fnt,flexShrink:0}}>
                  <Send size={14}/>
                </button>
            }
          </div>
          <div style={{textAlign:'center',marginTop:6,fontFamily:sans,fontSize:10,color:C.fnt,letterSpacing:'.07em'}}>Ash may make mistakes — always try on before you buy.</div>
        </div>
      </div>

      {/* Overlays */}
      {sbOpen&&<Sidebar convos={convos} active={activeId} onSel={loadConvo} onNew={()=>{newChat();setSbOpen(false);}} onDel={delConvo} onRen={renConvo} onClose={()=>setSbOpen(false)}/>}
      {lookbook&&<Lookbook look={lookbook==='all'?null:lookbook} onClose={()=>setLookbook(null)}/>}
    </div>
  );
}
