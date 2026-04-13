// src/pages/ChatPage.jsx
// Full Claude-like AI stylist — streaming, markdown, persistent history,
// rename/delete convos, copy, regenerate, image upload, lookbook panel, dark/light
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Moon, Sun, Plus, Trash2, Edit3, X, Copy, Check, RefreshCw, Sparkles, ChevronRight, BookOpen, Paperclip } from 'lucide-react';

const injectFonts = () => {
  if (document.getElementById('ash-gf')) return;
  const l = document.createElement('link');
  l.id = 'ash-gf'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;0,600;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap';
  document.head.appendChild(l);
};

const ASH_LOGO = 'https://cdn.shopify.com/s/files/1/0941/4197/2795/files/ash-logo_71d5937b-3fe1-4c0b-b99f-93ed0d7b810f.svg?v=1764163271';
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";
const STORAGE_KEY = 'ash_convos_v3';

const PRODUCTS = [
  { id:'hush-001', name:'Midnight Silk Dress',    price:'180', cat:'Dress',      img:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&fit=crop', link:'https://timeforhush.com/products/midnight-silk-dress',    desc:'Black silk, open back. The dress that ends conversations.' },
  { id:'hush-002', name:'Executive Blazer',        price:'250', cat:'Outerwear',  img:'https://images.unsplash.com/photo-1548624149-f32144679638?w=400&fit=crop', link:'https://timeforhush.com/products/executive-blazer',       desc:'Oversized, sharp shoulders. Power dressing redefined.' },
  { id:'hush-003', name:'Viper Leather Pants',     price:'300', cat:'Bottoms',    img:'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&fit=crop', link:'https://timeforhush.com/products/viper-leather-pants',    desc:'High waisted, vegan leather. Built for people who arrive.' },
  { id:'hush-004', name:'Raw Edge Denim',          price:'220', cat:'Denim',      img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&fit=crop', link:'https://timeforhush.com/products/raw-edge-denim',         desc:'Japanese selvage. Straight leg. The only denim you need.' },
  { id:'hush-005', name:'Sculpt Athleisure Set',   price:'195', cat:'Athleisure', img:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&fit=crop', link:'https://timeforhush.com/products/sculpt-athleisure-set', desc:'Technical fabric. Sculpting silhouette. Studio to street.' },
];

const QUICK = [
  "Style me for dinner tonight — make it dangerous",
  "Power meeting tomorrow. Dress me.",
  "Sketch it — cinematic weekend look",
  "Best HUSH denim for my body type",
  "Full luxe athleisure set",
  "What should I wear this weekend?",
];

const T = {
  light: { bg:'#F7F6F3', sb:'#EFECE7', surf:'#FFF', bdr:'#E2DED8', bdrS:'#C8C3BA', txt:'#1A1714', mid:'#6B6560', fnt:'#A09890', acc:'#C41E1E', accBg:'rgba(196,30,30,0.08)', uBg:'#1A1714', uFg:'#F7F6F3', aBg:'#FFF', aFg:'#1A1714', shd:'0 1px 12px rgba(0,0,0,0.07)', inp:'#FFF', scr:'#C8C3BA' },
  dark:  { bg:'#0E0D0C', sb:'#080706', surf:'#161412', bdr:'#2A2622', bdrS:'#3A3530', txt:'#EDE9E3', mid:'#8A847C', fnt:'#5A5550', acc:'#E8352A', accBg:'rgba(232,53,42,0.1)', uBg:'#EDE9E3', uFg:'#0E0D0C', aBg:'#1E1B18', aFg:'#EDE9E3', shd:'0 1px 12px rgba(0,0,0,0.4)', inp:'#161412', scr:'#3A3530' },
};

const CSS = `
  @keyframes msgUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fade  { from{opacity:0} to{opacity:1} }
  @keyframes sldL  { from{transform:translateX(-100%)} to{transform:translateX(0)} }
  @keyframes sldR  { from{transform:translateX(100%)}  to{transform:translateX(0)} }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
  @keyframes dot   { 0%,100%{opacity:.3;transform:scale(.75)}50%{opacity:1;transform:scale(1)} }
  .aup{animation:msgUp .28s cubic-bezier(.16,1,.3,1) forwards}
  .afade{animation:fade .2s ease forwards}
  .asl{animation:sldL .32s cubic-bezier(.16,1,.3,1) forwards}
  .asr{animation:sldR .32s cubic-bezier(.16,1,.3,1) forwards}
  .cur{display:inline-block;width:2px;height:.9em;background:currentColor;margin-left:1px;vertical-align:text-bottom;animation:blink 1s step-end infinite}
  .d1{animation:dot 1.3s ease infinite 0ms}.d2{animation:dot 1.3s ease infinite 180ms}.d3{animation:dot 1.3s ease infinite 360ms}
  .sc::-webkit-scrollbar{width:4px}.sc::-webkit-scrollbar-track{background:transparent}.sc::-webkit-scrollbar-thumb{border-radius:4px}
  .hhov .hv{opacity:0;transition:opacity .15s}.hhov:hover .hv{opacity:1}
  .ib{transition:all .15s;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;background:none;padding:0}
  .ib:hover{transform:scale(1.08)}.ib:active{transform:scale(.95)}
  .ci{transition:background .15s;cursor:pointer}
  .ch{transition:all .15s;cursor:pointer}.ch:hover{transform:translateY(-1px);opacity:.85}
  .pc{transition:all .2s}.pc:hover{transform:translateY(-3px)}
`;

// Simple markdown parser
function MD({ text, t }) {
  if (!text) return null;
  const lines = text.split('\n');
  const out = []; let i = 0;
  const fmt = s => s
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`(.+?)`/g,`<code style="background:rgba(128,128,128,0.15);padding:1px 5px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>`);
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('### ')) { out.push(<div key={i} style={{fontFamily:serif,fontWeight:600,fontSize:17,color:t.txt,margin:'12px 0 5px'}}>{l.slice(4)}</div>); }
    else if (l.startsWith('## ')) { out.push(<div key={i} style={{fontFamily:serif,fontWeight:600,fontSize:20,color:t.txt,margin:'14px 0 6px'}}>{l.slice(3)}</div>); }
    else if (l.startsWith('# '))  { out.push(<div key={i} style={{fontFamily:serif,fontWeight:600,fontSize:24,color:t.txt,margin:'16px 0 8px'}}>{l.slice(2)}</div>); }
    else if (l.startsWith('- ')||l.startsWith('* ')) {
      const items=[]; while(i<lines.length&&(lines[i].startsWith('- ')||lines[i].startsWith('* '))){items.push(lines[i].slice(2));i++;}
      out.push(<ul key={'ul'+i} style={{margin:'6px 0',paddingLeft:0,listStyle:'none'}}>{items.map((it,j)=>(
        <li key={j} style={{display:'flex',gap:8,margin:'4px 0',fontFamily:sans,fontSize:14,lineHeight:1.7,color:t.txt}}>
          <span style={{color:t.acc,flexShrink:0,marginTop:3,fontSize:10}}>✦</span>
          <span dangerouslySetInnerHTML={{__html:fmt(it)}}/>
        </li>
      ))}</ul>); continue;
    }
    else if (/^\d+\.\s/.test(l)) {
      const items=[]; while(i<lines.length&&/^\d+\.\s/.test(lines[i])){items.push(lines[i].replace(/^\d+\.\s/,''));i++;}
      out.push(<ol key={'ol'+i} style={{margin:'6px 0',paddingLeft:20}}>{items.map((it,j)=>(
        <li key={j} style={{margin:'4px 0',fontFamily:sans,fontSize:14,lineHeight:1.7,color:t.txt,paddingLeft:4}} dangerouslySetInnerHTML={{__html:fmt(it)}}/>
      ))}</ol>); continue;
    }
    else if (l.trim()==='---') { out.push(<hr key={i} style={{border:'none',borderTop:`1px solid ${t.bdr}`,margin:'12px 0'}}/>); }
    else if (l.trim()==='') { if(i>0&&lines[i-1].trim()!=='') out.push(<div key={i} style={{height:6}}/>); }
    else { out.push(<p key={i} style={{margin:'3px 0',fontFamily:sans,fontSize:14,lineHeight:1.78,color:t.txt}} dangerouslySetInnerHTML={{__html:fmt(l)}}/>); }
    i++;
  }
  return <div>{out}</div>;
}

// Streaming hook
function useStream() {
  const [text,setText] = useState(''); const [running,setRunning] = useState(false); const ref = useRef(null);
  const stream = useCallback((full, done) => {
    setText(''); setRunning(true); let idx=0;
    const tick=()=>{ idx=Math.min(idx+Math.floor(Math.random()*3)+1,full.length); setText(full.slice(0,idx));
      if(idx<full.length){ref.current=setTimeout(tick,10+Math.random()*10);} else {setRunning(false);done?.();} };
    ref.current=setTimeout(tick,60);
  },[]);
  const stop=()=>{clearTimeout(ref.current);setRunning(false);};
  return {text,running,stream,stop};
}

const db = { load:()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');}catch{return[];}}, save:(d)=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}catch{}} };

// Avatar
function Av({isAsh,t}) {
  return <div style={{width:32,height:32,borderRadius:'50%',background:isAsh?t.surf:t.uBg,border:`1px solid ${t.bdr}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
    {isAsh?<img src={ASH_LOGO} style={{width:18,height:18}} alt=""/>:<span style={{fontFamily:sans,fontSize:11,fontWeight:600,color:t.uFg}}>U</span>}
  </div>;
}

// Logo
function Logo({t,size=24}) {
  return <div style={{display:'flex',alignItems:'center',gap:8}}>
    <img src={ASH_LOGO} style={{height:size,width:'auto'}} alt="ASH"/>
    <div>
      <div style={{fontFamily:serif,fontWeight:600,fontSize:size*.68,color:t.acc,letterSpacing:'.18em',lineHeight:1}}>ASH ×</div>
      <div style={{fontFamily:sans,fontWeight:300,fontSize:size*.33,color:t.fnt,letterSpacing:'.2em',textTransform:'uppercase',lineHeight:1.3}}>AI Stylist</div>
    </div>
  </div>;
}

// Product card
function PC({p,t}) {
  return <a href={p.link} target="_blank" rel="noreferrer" className="pc"
    style={{display:'block',textDecoration:'none',background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:14,overflow:'hidden',boxShadow:t.shd}}>
    <div style={{position:'relative'}}>
      <img src={p.img} alt={p.name} style={{width:'100%',height:155,objectFit:'cover',display:'block'}}/>
      <div style={{position:'absolute',top:8,right:8,background:t.acc,color:'#fff',fontFamily:sans,fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',padding:'3px 8px',borderRadius:20}}>{p.cat}</div>
    </div>
    <div style={{padding:'12px 14px 14px'}}>
      <div style={{fontFamily:serif,fontWeight:600,fontSize:15,color:t.txt,marginBottom:3,lineHeight:1.2}}>{p.name}</div>
      <div style={{fontFamily:sans,fontSize:11,color:t.fnt,marginBottom:10,lineHeight:1.5}}>{p.desc}</div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:sans,fontWeight:600,fontSize:14,color:t.acc}}>${p.price}</span>
        <div style={{display:'flex',alignItems:'center',gap:3,fontFamily:sans,fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',color:t.mid}}>Shop <ChevronRight size={11}/></div>
      </div>
    </div>
  </a>;
}

// Lookbook panel
function Lookbook({look,onClose,t}) {
  const items = look?.itemIds ? look.itemIds.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean) : PRODUCTS;
  return <>
    <div className="afade" onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',zIndex:30,backdropFilter:'blur(3px)'}}/>
    <div className="asr sc" style={{position:'fixed',top:0,right:0,bottom:0,width:310,background:t.sb,borderLeft:`1px solid ${t.bdr}`,zIndex:40,overflowY:'auto',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'16px 18px',borderBottom:`1px solid ${t.bdr}`,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:t.sb,zIndex:1}}>
        <div>
          <div style={{fontFamily:serif,fontWeight:600,fontSize:17,color:t.txt}}>{look?.title||'HUSH Collection'}</div>
          {look?.explanation&&<div style={{fontFamily:sans,fontStyle:'italic',fontSize:11,color:t.mid,marginTop:3}}>{look.explanation}</div>}
        </div>
        <button className="ib" onClick={onClose} style={{color:t.fnt,width:28,height:28,borderRadius:7}}><X size={15}/></button>
      </div>
      <div style={{padding:14,display:'flex',flexDirection:'column',gap:12}}>{items.map(p=><PC key={p.id} p={p} t={t}/>)}</div>
    </div>
  </>;
}

// Message
function Msg({msg,t,onCopy,onRegen,onLook,isLast,streamText,isStreaming}) {
  const [copied,setCopied]=useState(false);
  const isAsh=msg.role==='assistant';
  const content = isStreaming ? streamText : msg.content;
  const copy=()=>{navigator.clipboard?.writeText(content);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return (
    <div className="aup hhov" style={{display:'flex',gap:12,marginBottom:26,flexDirection:isAsh?'row':'row-reverse'}}>
      <div style={{flexShrink:0,marginTop:20}}><Av isAsh={isAsh} t={t}/></div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.14em',color:t.fnt,marginBottom:6}}>{isAsh?'Ash':'You'}</div>
        {msg.imgUrl&&<img src={msg.imgUrl} alt="" style={{maxWidth:260,maxHeight:180,borderRadius:12,marginBottom:10,objectFit:'cover',border:`1px solid ${t.bdr}`}}/>}
        <div>
          {isAsh ? <><MD text={content} t={t}/>{isStreaming&&isLast&&<span className="cur" style={{color:t.acc}}/>}</> : <p style={{margin:0,fontFamily:sans,fontSize:14,lineHeight:1.75,color:t.txt}}>{content}</p>}
        </div>
        {isAsh&&msg.look&&!isStreaming&&(
          <button onClick={()=>onLook(msg.look)} className="afade ch"
            style={{marginTop:12,display:'inline-flex',alignItems:'center',gap:6,background:t.accBg,border:`1px solid ${t.acc}45`,borderRadius:24,padding:'7px 14px',fontFamily:sans,fontSize:12,fontWeight:600,color:t.acc,textTransform:'uppercase',letterSpacing:'.08em'}}>
            <Sparkles size={12}/> View: {msg.look.title}
          </button>
        )}
        {!isStreaming&&(
          <div className="hv" style={{display:'flex',gap:2,marginTop:8}}>
            <button className="ib" onClick={copy} title="Copy" style={{width:28,height:28,borderRadius:7,color:copied?'#22c55e':t.fnt}}>{copied?<Check size={13}/>:<Copy size={13}/>}</button>
            {isAsh&&isLast&&<button className="ib" onClick={onRegen} title="Regenerate" style={{width:28,height:28,borderRadius:7,color:t.fnt}}><RefreshCw size={13}/></button>}
          </div>
        )}
      </div>
    </div>
  );
}

// Typing indicator
function Typing({t}) {
  return <div className="aup" style={{display:'flex',gap:12,marginBottom:26}}>
    <div style={{flexShrink:0,marginTop:20}}><Av isAsh t={t}/></div>
    <div>
      <div style={{fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.14em',color:t.fnt,marginBottom:6}}>Ash</div>
      <div style={{display:'flex',gap:5,padding:'13px 17px',background:t.aBg,border:`1px solid ${t.bdr}`,borderRadius:14,boxShadow:t.shd}}>
        {[1,2,3].map(i=><div key={i} className={`d${i}`} style={{width:7,height:7,borderRadius:'50%',background:t.acc}}/>)}
      </div>
    </div>
  </div>;
}

// Sidebar
function Sidebar({convos,active,onSel,onNew,onDel,onRen,onClose,mobile,t}) {
  const [eid,setEid]=useState(null); const [etxt,setEtxt]=useState('');
  return <>
    {mobile&&<div className="afade" onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:40}}/>}
    <div className={mobile?'asl':''} style={{width:256,background:t.sb,borderRight:`1px solid ${t.bdr}`,display:'flex',flexDirection:'column',height:'100%',flexShrink:0,...(mobile?{position:'fixed',top:0,left:0,bottom:0,zIndex:50}:{})}}>
      <div style={{padding:'14px 14px 12px',borderBottom:`1px solid ${t.bdr}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Logo t={t} size={20}/>
        <button className="ib" onClick={onNew} style={{background:t.accBg,border:`1px solid ${t.acc}40`,borderRadius:9,width:30,height:30,color:t.acc}}><Plus size={15}/></button>
      </div>
      <div className="sc" style={{flex:1,overflowY:'auto',padding:'8px 6px'}}>
        <div style={{fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.14em',color:t.fnt,padding:'4px 10px 8px'}}>Conversations</div>
        {convos.length===0&&<div style={{padding:'20px 12px',textAlign:'center',fontFamily:sans,fontSize:13,color:t.fnt,lineHeight:1.7}}>Start your first<br/>conversation with Ash.</div>}
        {convos.map(c=>(
          <div key={c.id} className="ci hhov" onClick={()=>onSel(c.id)}
            style={{borderRadius:10,padding:'8px 10px',marginBottom:2,background:c.id===active?t.accBg:'transparent',border:`1px solid ${c.id===active?t.acc+'40':'transparent'}`}}>
            {eid===c.id
              ? <input value={etxt} onChange={e=>setEtxt(e.target.value)} onBlur={()=>{if(etxt.trim())onRen(c.id,etxt.trim());setEid(null);}} onKeyDown={e=>{if(e.key==='Enter'){if(etxt.trim())onRen(c.id,etxt.trim());setEid(null);}if(e.key==='Escape')setEid(null);}} onClick={e=>e.stopPropagation()} autoFocus style={{width:'100%',background:'none',border:`1px solid ${t.acc}`,borderRadius:5,padding:'2px 6px',fontFamily:sans,fontSize:13,color:t.txt,outline:'none'}}/>
              : <>
                  <div style={{fontFamily:sans,fontSize:13,fontWeight:500,color:t.txt,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',lineHeight:1.3}}>{c.title}</div>
                  <div style={{fontFamily:sans,fontSize:11,color:t.fnt,marginTop:2}}>{c.date}</div>
                  <div className="hv" style={{display:'flex',gap:2,marginTop:3}}>
                    <button onClick={e=>{e.stopPropagation();setEid(c.id);setEtxt(c.title);}} className="ib" style={{width:20,height:20,borderRadius:4,color:t.fnt}}><Edit3 size={10}/></button>
                    <button onClick={e=>{e.stopPropagation();onDel(c.id);}} className="ib" style={{width:20,height:20,borderRadius:4,color:t.fnt}}><Trash2 size={10}/></button>
                  </div>
                </>
            }
          </div>
        ))}
      </div>
      <div style={{padding:'10px 14px',borderTop:`1px solid ${t.bdr}`,fontFamily:sans,fontSize:10,color:t.fnt,textAlign:'center',letterSpacing:'.07em'}}>ASH × HUSH — Styled by AI</div>
    </div>
  </>;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  useEffect(()=>{injectFonts();},[]);
  const [dark,setDark]=useState(()=>window.matchMedia?.('(prefers-color-scheme: dark)').matches||false);
  const t=T[dark?'dark':'light'];
  const INIT={role:'assistant',content:"Darling, I'm Ash. Let's make you look dangerous. What's the occasion?",id:'init'};
  const [convos,setConvos]=useState(()=>db.load());
  const [activeId,setActiveId]=useState(null);
  const [msgs,setMsgs]=useState([INIT]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const [sbOpen,setSbOpen]=useState(window.innerWidth>860);
  const [lookbook,setLookbook]=useState(null);
  const [imgPrev,setImgPrev]=useState(null);
  const [streamId,setStreamId]=useState(null);
  const bottomRef=useRef(null); const fileRef=useRef(null);
  const {text:stxt,running:srun,stream,stop}=useStream();

  useEffect(()=>{db.save(convos);},[convos]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[msgs,stxt]);

  const save=useCallback((m,id)=>{
    const sid=id||activeId; const first=m.find(x=>x.role==='user'); if(!first) return sid;
    const title=first.content.slice(0,48)+(first.content.length>48?'…':'');
    const date=new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    setConvos(p=>{if(p.find(c=>c.id===sid))return p.map(c=>c.id===sid?{...c,title,date,messages:m}:c);return [{id:sid,title,date,messages:m},...p];});
    return sid;
  },[activeId]);

  const hist=()=>msgs.filter(m=>m.id!=='init').slice(-12).map(m=>({role:m.role,content:m.content}));

  const send=async(text,img)=>{
    const msg=(text||input).trim(); if((!msg&&!img)||loading) return;
    setInput(''); setImgPrev(null);
    const sid=activeId||String(Date.now()); if(!activeId)setActiveId(sid);
    const um={role:'user',content:msg,imgUrl:img||null,id:String(Date.now())};
    const next=[...msgs,um]; setMsgs(next); setLoading(true);
    const pid='p'+Date.now();
    setMsgs(p=>[...p,{role:'assistant',content:'',id:pid,isPend:true}]);
    try {
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,products:PRODUCTS,history:hist()})});
      if(!r.ok)throw new Error();
      const data=await r.json();
      const aid='a'+Date.now();
      setStreamId(aid); setLoading(false);
      setMsgs(p=>p.filter(m=>m.id!==pid).concat({role:'assistant',content:data.text,look:data.suggestedLook,id:aid,isStream:true}));
      stream(data.text,()=>{
        setStreamId(null);
        const fin=[...next,{role:'assistant',content:data.text,look:data.suggestedLook,id:aid}];
        setMsgs(fin); save(fin,sid);
      });
    } catch {
      setMsgs(p=>p.filter(m=>m.id!==pid).concat({role:'assistant',content:"Something interrupted me. Try again — I don't give up easily.",id:String(Date.now())}));
      setLoading(false);
    }
  };

  const regen=async()=>{
    const lu=[...msgs].reverse().find(m=>m.role==='user'); if(!lu||loading)return;
    setMsgs(p=>{const i=p.map(x=>x.id).lastIndexOf(p.filter(x=>x.role==='assistant').at(-1)?.id);return i>=0?p.slice(0,i):p;});
    await send(lu.content);
  };

  const newChat=()=>{save(msgs);setActiveId(null);setMsgs([INIT]);setInput('');stop();setStreamId(null);};
  const loadConvo=(id)=>{const c=convos.find(x=>x.id===id);if(c){save(msgs);setActiveId(id);setMsgs(c.messages);}if(window.innerWidth<860)setSbOpen(false);};
  const delConvo=(id)=>{setConvos(p=>p.filter(c=>c.id!==id));if(id===activeId)newChat();};
  const renConvo=(id,title)=>setConvos(p=>p.map(c=>c.id===id?{...c,title}:c));
  const handleFile=(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setImgPrev(ev.target.result);r.readAsDataURL(f);};

  const lastAshI=[...msgs].reduceRight((a,m,i)=>a===-1&&m.role==='assistant'?i:a,-1);
  const isWelcome=msgs.length<=1;
  const display=msgs.map(m=>m.id===streamId?{...m,content:stxt,isStreaming:true}:m);

  return (
    <div style={{display:'flex',height:'100%',background:t.bg,overflow:'hidden',transition:'background .3s'}}>
      <style>{CSS}</style>

      {sbOpen&&<Sidebar convos={convos} active={activeId} onSel={loadConvo} onNew={newChat} onDel={delConvo} onRen={renConvo} onClose={()=>setSbOpen(false)} mobile={window.innerWidth<860} t={t}/>}

      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,height:'100%'}}>
        {/* Topbar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 18px',borderBottom:`1px solid ${t.bdr}`,background:t.surf,flexShrink:0,boxShadow:t.shd}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button className="ib" onClick={()=>setSbOpen(s=>!s)} style={{width:34,height:34,borderRadius:9,color:t.mid}}>
              <div style={{display:'flex',flexDirection:'column',gap:3.5}}>{[0,1,2].map(i=><div key={i} style={{width:16,height:1.5,background:t.mid,borderRadius:2}}/>)}</div>
            </button>
            {!sbOpen&&<button className="ib" onClick={newChat} style={{background:t.accBg,border:`1px solid ${t.acc}40`,borderRadius:8,width:30,height:30,color:t.acc}}><Plus size={14}/></button>}
          </div>
          <Logo t={t} size={22}/>
          <div style={{display:'flex',gap:7,alignItems:'center'}}>
            <button onClick={()=>setLookbook('all')} style={{display:'flex',alignItems:'center',gap:5,background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:20,padding:'5px 12px',cursor:'pointer',fontFamily:sans,fontSize:11,fontWeight:500,color:t.mid}}>
              <BookOpen size={12}/> Collection
            </button>
            <button className="ib" onClick={()=>setDark(d=>!d)} style={{background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:20,padding:'5px 12px',width:'auto',gap:5,fontFamily:sans,fontSize:11,color:dark?t.acc:t.mid}}>
              {dark?<><Sun size={12} color={t.acc}/><span style={{color:t.acc}}>Day</span></>:<><Moon size={12}/><span>Night</span></>}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="sc" style={{flex:1,overflowY:'auto',padding:'32px 20px 16px',maxWidth:760,width:'100%',margin:'0 auto',boxSizing:'border-box'}}>
          {isWelcome&&(
            <div className="afade" style={{textAlign:'center',marginBottom:44}}>
              <div style={{width:68,height:68,borderRadius:'50%',background:t.surf,border:`1px solid ${t.bdr}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',boxShadow:t.shd}}>
                <img src={ASH_LOGO} style={{width:40,height:40}} alt=""/>
              </div>
              <div style={{fontFamily:serif,fontWeight:300,fontSize:38,color:t.txt,letterSpacing:'.02em',lineHeight:1.2,marginBottom:10}}>Style starts here.</div>
              <div style={{fontFamily:sans,fontSize:14,color:t.fnt,lineHeight:1.7,maxWidth:360,margin:'0 auto'}}>Ask Ash anything — outfits, occasions, body types, trends.<br/>She knows exactly what works.</div>
            </div>
          )}
          {display.map((m,i)=>
            m.isPend?<Typing key={m.id} t={t}/>:
            <Msg key={m.id} msg={m} t={t} onCopy={()=>{}} onRegen={regen} onLook={setLookbook}
              isLast={i===lastAshI} streamText={stxt} isStreaming={m.id===streamId&&srun}/>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Quick prompts */}
        {isWelcome&&(
          <div style={{maxWidth:760,width:'100%',margin:'0 auto',padding:'0 20px 16px',boxSizing:'border-box'}}>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {QUICK.map(q=>(
                <button key={q} onClick={()=>send(q)} className="ch"
                  style={{background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:24,padding:'8px 16px',fontFamily:sans,fontSize:12,fontWeight:500,color:t.mid,boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image preview */}
        {imgPrev&&(
          <div style={{maxWidth:760,width:'100%',margin:'0 auto',padding:'0 20px 8px',boxSizing:'border-box'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:12,padding:8}}>
              <img src={imgPrev} alt="" style={{width:44,height:44,objectFit:'cover',borderRadius:8}}/>
              <span style={{fontFamily:sans,fontSize:12,color:t.mid}}>Image ready</span>
              <button className="ib" onClick={()=>setImgPrev(null)} style={{color:t.fnt,width:20,height:20}}><X size={13}/></button>
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{padding:'10px 18px 14px',borderTop:`1px solid ${t.bdr}`,background:t.surf,flexShrink:0}}>
          <div style={{maxWidth:760,margin:'0 auto'}}>
            <div style={{display:'flex',gap:8,alignItems:'flex-end',background:t.inp,border:`1.5px solid ${t.bdr}`,borderRadius:20,padding:'10px 12px 10px 14px',boxShadow:t.shd}}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>
              <button className="ib" onClick={()=>fileRef.current?.click()} style={{width:30,height:30,borderRadius:8,color:t.fnt,flexShrink:0}}><Paperclip size={15}/></button>
              <textarea value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input,imgPrev);}}}
                placeholder="Ask Ash anything about your style…" rows={1} className="sc"
                style={{flex:1,resize:'none',background:'transparent',border:'none',fontFamily:sans,fontSize:14,color:t.txt,lineHeight:1.7,maxHeight:120,outline:'none',caretColor:t.acc,padding:0}}
              />
              {loading
                ? <button className="ib" onClick={stop} style={{width:36,height:36,borderRadius:12,background:t.accBg,color:t.acc,flexShrink:0}}><X size={15}/></button>
                : <button className="ib" onClick={()=>send(input,imgPrev)} disabled={!input.trim()&&!imgPrev}
                    style={{width:36,height:36,borderRadius:12,background:(input.trim()||imgPrev)?t.acc:t.bdr,color:(input.trim()||imgPrev)?'#fff':t.fnt,flexShrink:0}}><Send size={15}/></button>
              }
            </div>
            <div style={{textAlign:'center',marginTop:7,fontFamily:sans,fontSize:10,color:t.fnt,letterSpacing:'.07em'}}>Ash may make mistakes — always try on before you buy.</div>
          </div>
        </div>
      </div>

      {lookbook&&<Lookbook look={lookbook==='all'?null:lookbook} onClose={()=>setLookbook(null)} t={t}/>}
    </div>
  );
}
