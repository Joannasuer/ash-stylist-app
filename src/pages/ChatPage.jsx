// src/pages/ChatPage.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Moon, Sun, Plus, Trash2, Edit3, X, Copy, Check, RefreshCw, Sparkles, ChevronRight, BookOpen, Paperclip } from 'lucide-react';

const injectFonts = () => {
  if (document.getElementById('ash-gf')) return;
  const l = document.createElement('link');
  l.id = 'ash-gf'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';
  document.head.appendChild(l);
};

const ASH_LOGO  = '/ash-logo.png';
const HUSH_LOGO = '/hush-logo.png';
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";
const STORAGE_KEY = 'ash_convos_v4';

const PRODUCTS = [
  { id:'hush-001', name:'Midnight Silk Dress',  price:'180', cat:'Dress',      img:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&fit=crop', link:'https://timeforhush.com/products/midnight-silk-dress',    desc:'Black silk, open back. The dress that ends conversations.' },
  { id:'hush-002', name:'Executive Blazer',      price:'250', cat:'Outerwear',  img:'https://images.unsplash.com/photo-1548624149-f32144679638?w=400&fit=crop', link:'https://timeforhush.com/products/executive-blazer',       desc:'Oversized, sharp shoulders. Power dressing redefined.' },
  { id:'hush-003', name:'Viper Leather Pants',   price:'300', cat:'Bottoms',    img:'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&fit=crop', link:'https://timeforhush.com/products/viper-leather-pants',    desc:'High waisted, vegan leather. Built for people who arrive.' },
  { id:'hush-004', name:'Raw Edge Denim',        price:'220', cat:'Denim',      img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&fit=crop', link:'https://timeforhush.com/products/raw-edge-denim',         desc:'Japanese selvage. Straight leg. The only denim you need.' },
  { id:'hush-005', name:'Sculpt Athleisure Set', price:'195', cat:'Athleisure', img:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&fit=crop', link:'https://timeforhush.com/products/sculpt-athleisure-set', desc:'Technical fabric. Body-sculpting silhouette.' },
];

const QUICK = [
  "Style me for dinner tonight — make it dangerous",
  "Power meeting tomorrow. Dress me.",
  "Sketch it — cinematic weekend look",
  "Best HUSH denim for my body type",
  "Full luxe athleisure set",
  "What should I wear this weekend?",
];

async function askAsh(message, profile, history) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, userProfile: profile, products: PRODUCTS, history }),
  });
  if (!res.ok) throw new Error();
  return res.json();
}

const T = {
  light: { bg:'#F8F7F4', sb:'#EFECE8', surf:'#FFF', bdr:'#E2DED8', txt:'#1A1714', mid:'#6B6560', fnt:'#A09890', acc:'#C41E1E', accBg:'rgba(196,30,30,0.08)', uBg:'#1A1714', uFg:'#F8F7F4', shd:'0 1px 12px rgba(0,0,0,0.07)', shadowPop:'0 8px 32px rgba(0,0,0,0.14)', inp:'#FFF', avBg:'#111' },
  dark:  { bg:'#0C0B0A', sb:'#070605', surf:'#141210', bdr:'#252220', txt:'#EDE9E3', mid:'#8A847C', fnt:'#5A5550', acc:'#E8352A', accBg:'rgba(232,53,42,0.1)', uBg:'#EDE9E3', uFg:'#0C0B0A', shd:'0 1px 12px rgba(0,0,0,0.5)', shadowPop:'0 8px 32px rgba(0,0,0,0.7)', inp:'#141210', avBg:'#000' },
};

const CSS = `
  @keyframes msgUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes vascPulse { 0%{transform:scale(1);filter:brightness(1) drop-shadow(0 0 0px #C41E1E)} 25%{transform:scale(1.1);filter:brightness(1.4) drop-shadow(0 0 10px #C41E1E)} 50%{transform:scale(0.95);filter:brightness(0.85) drop-shadow(0 0 2px #C41E1E)} 75%{transform:scale(1.08);filter:brightness(1.25) drop-shadow(0 0 7px #C41E1E)} 100%{transform:scale(1);filter:brightness(1) drop-shadow(0 0 0px #C41E1E)} }
  @keyframes textFloat { 0%,100%{opacity:0.35;transform:translateY(0)} 50%{opacity:1;transform:translateY(-2px)} }
  .aup   { animation: msgUp .3s cubic-bezier(.16,1,.3,1) forwards; }
  .afade { animation: fadeIn .2s ease forwards; }
  .cur   { display:inline-block;width:2px;height:.88em;background:currentColor;margin-left:1px;vertical-align:text-bottom;animation:blink 1s step-end infinite; }
  .vasc  { animation: vascPulse 1.8s ease-in-out infinite; transform-origin:center; }
  .vtxt  { animation: textFloat 1.8s ease-in-out infinite; }
  .sc::-webkit-scrollbar{width:4px} .sc::-webkit-scrollbar-track{background:transparent} .sc::-webkit-scrollbar-thumb{border-radius:4px;background:#C8C3BA}
  .hhov .hv{opacity:0;transition:opacity .15s} .hhov:hover .hv{opacity:1}
  .ib{transition:all .15s;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;background:none;padding:0}
  .ib:hover{transform:scale(1.08)} .ib:active{transform:scale(.95)}
  .ci{transition:background .15s;cursor:pointer}
  .ch{transition:all .15s;cursor:pointer} .ch:hover{transform:translateY(-1px)}
  .pc{transition:all .2s} .pc:hover{transform:translateY(-3px)}
`;

const db = { load:()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');}catch{return[];}}, save:(d)=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}catch{}} };

function useStream() {
  const [text,setText]=useState('');const [running,setRunning]=useState(false);const ref=useRef(null);
  const stream=useCallback((full,done)=>{setText('');setRunning(true);let i=0;const tick=()=>{i=Math.min(i+Math.floor(Math.random()*3)+1,full.length);setText(full.slice(0,i));if(i<full.length){ref.current=setTimeout(tick,11+Math.random()*9);}else{setRunning(false);done?.();}};ref.current=setTimeout(tick,60);},[]);
  const stop=()=>{clearTimeout(ref.current);setRunning(false);};
  return{text,running,stream,stop};
}

function MD({text,t}){
  if(!text)return null;
  const lines=text.split('\n');const out=[];let i=0;
  const fmt=s=>s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`(.+?)`/g,'<code style="background:rgba(128,128,128,0.12);padding:1px 5px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>');
  while(i<lines.length){const l=lines[i];
    if(l.startsWith('### ')){out.push(<div key={i} style={{fontFamily:serif,fontWeight:600,fontSize:17,color:t.txt,margin:'12px 0 5px'}}>{l.slice(4)}</div>);}
    else if(l.startsWith('**')&&l.endsWith('**')&&!l.slice(2,-2).includes('**')){out.push(<div key={i} style={{fontFamily:serif,fontWeight:600,fontSize:18,color:t.txt,margin:'10px 0 5px'}}>{l.slice(2,-2)}</div>);}
    else if(l.startsWith('- ')||l.startsWith('* ')){const items=[];while(i<lines.length&&(lines[i].startsWith('- ')||lines[i].startsWith('* '))){items.push(lines[i].slice(2));i++;}out.push(<ul key={'ul'+i} style={{listStyle:'none',padding:0,margin:'6px 0'}}>{items.map((it,j)=><li key={j} style={{display:'flex',gap:8,margin:'5px 0',fontFamily:sans,fontSize:14,lineHeight:1.72,color:t.txt}}><span style={{color:t.acc,flexShrink:0,marginTop:3,fontSize:10}}>✦</span><span dangerouslySetInnerHTML={{__html:fmt(it)}}/></li>)}</ul>);continue;}
    else if(l.trim()==='---'){out.push(<hr key={i} style={{border:'none',borderTop:`1px solid ${t.bdr}`,margin:'12px 0'}}/>);}
    else if(l.trim()===''){if(i>0&&lines[i-1].trim()!=='')out.push(<div key={i} style={{height:5}}/>);}
    else{out.push(<p key={i} style={{margin:'3px 0',fontFamily:sans,fontSize:14,lineHeight:1.78,color:t.txt}} dangerouslySetInnerHTML={{__html:fmt(l)}}/>);}
    i++;}
  return <div>{out}</div>;
}

function AshAv({size=32,t,pulse=false}){
  return <div style={{width:size,height:size,borderRadius:'50%',background:t.avBg,border:`1px solid ${t.bdr}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>
    <img src={ASH_LOGO} alt="Ash" className={pulse?'vasc':''} style={{width:size*.62,height:size*.62,objectFit:'contain'}}/>
  </div>;
}

function Thinking({t}){
  return <div className="aup" style={{display:'flex',gap:12,marginBottom:24,maxWidth:720,marginLeft:'auto',marginRight:'auto'}}>
    <div style={{marginTop:18,flexShrink:0}}><AshAv size={32} t={t} pulse={true}/></div>
    <div>
      <div style={{fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.14em',color:t.fnt,marginBottom:6}}>Ash</div>
      <div style={{display:'flex',alignItems:'center',gap:14,background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:'4px 18px 18px 18px',padding:'13px 20px',boxShadow:t.shd}}>
        <img src={ASH_LOGO} alt="" className="vasc" style={{width:26,height:26,objectFit:'contain',flexShrink:0}}/>
        <span className="vtxt" style={{fontFamily:serif,fontStyle:'italic',fontSize:15,color:t.fnt,letterSpacing:'.04em'}}>Styling your look…</span>
      </div>
    </div>
  </div>;
}

function ProductCard({p,t}){
  return <a href={p.link} target="_blank" rel="noreferrer" className="pc" style={{display:'block',textDecoration:'none',background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:14,overflow:'hidden',marginBottom:12,boxShadow:t.shd}}>
    <div style={{position:'relative'}}><img src={p.img} alt={p.name} style={{width:'100%',height:140,objectFit:'cover',display:'block'}}/><div style={{position:'absolute',top:8,right:8,background:t.acc,color:'#fff',fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',padding:'3px 8px',borderRadius:20,fontFamily:sans}}>{p.cat}</div></div>
    <div style={{padding:'11px 13px 13px'}}><div style={{fontFamily:serif,fontWeight:600,fontSize:15,color:t.txt,marginBottom:3,lineHeight:1.2}}>{p.name}</div><div style={{fontFamily:sans,fontSize:11,color:t.fnt,marginBottom:9,lineHeight:1.5}}>{p.desc}</div><div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontFamily:sans,fontWeight:600,fontSize:14,color:t.acc}}>${p.price}</span><div style={{display:'flex',alignItems:'center',gap:3,fontFamily:sans,fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',color:t.mid}}>Shop <ChevronRight size={11}/></div></div></div>
  </a>;
}

function Lookbook({look,onClose,t}){
  const items=look?.itemIds?look.itemIds.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean):PRODUCTS;
  return <>
    <div className="afade" onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',zIndex:30,backdropFilter:'blur(3px)'}}/>
    <div className="sc" style={{position:'fixed',top:0,right:0,bottom:0,width:300,background:t.sb,borderLeft:`1px solid ${t.bdr}`,zIndex:40,overflowY:'auto',display:'flex',flexDirection:'column',animation:'slideR .3s cubic-bezier(.16,1,.3,1)'}}>
      <style>{'@keyframes slideR{from{transform:translateX(100%)}to{transform:translateX(0)}}'}</style>
      <div style={{padding:'16px 18px',borderBottom:`1px solid ${t.bdr}`,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:t.sb}}>
        <div><div style={{fontFamily:serif,fontWeight:600,fontSize:17,color:t.txt}}>{look?.title||'HUSH Collection'}</div>{look?.explanation&&<div style={{fontFamily:sans,fontStyle:'italic',fontSize:11,color:t.mid,marginTop:3}}>{look.explanation}</div>}</div>
        <button className="ib" onClick={onClose} style={{color:t.fnt,width:28,height:28,borderRadius:7}}><X size={15}/></button>
      </div>
      <div style={{padding:14}}>{items.map(p=><ProductCard key={p.id} p={p} t={t}/>)}</div>
    </div>
  </>;
}

function Message({msg,t,onCopy,onRegen,onLook,isLast,streamText,isStreaming}){
  const[copied,setCopied]=useState(false);
  const isAsh=msg.role==='assistant';
  const content=isStreaming?streamText:msg.content;
  const copy=()=>{navigator.clipboard?.writeText(content||'');setCopied(true);onCopy?.();setTimeout(()=>setCopied(false),2000);};
  return <div className="aup hhov" style={{display:'flex',gap:12,marginBottom:26,maxWidth:720,marginLeft:'auto',marginRight:'auto',flexDirection:isAsh?'row':'row-reverse'}}>
    <div style={{flexShrink:0,marginTop:18}}>{isAsh?<AshAv size={32} t={t}/>:<div style={{width:32,height:32,borderRadius:'50%',background:t.uBg,border:`1px solid ${t.bdr}`,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontFamily:sans,fontSize:11,fontWeight:600,color:t.uFg}}>U</span></div>}</div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.14em',color:t.fnt,marginBottom:6}}>{isAsh?'Ash':'You'}</div>
      {msg.imgUrl&&<img src={msg.imgUrl} alt="" style={{maxWidth:260,maxHeight:180,borderRadius:12,marginBottom:10,objectFit:'cover',border:`1px solid ${t.bdr}`,display:'block'}}/>}
      <div>{isAsh?<><MD text={content} t={t}/>{isStreaming&&isLast&&<span className="cur" style={{color:t.acc}}/>}</>:<p style={{margin:0,fontFamily:sans,fontSize:14,lineHeight:1.78,color:t.txt}}>{content}</p>}</div>
      {isAsh&&msg.look&&!isStreaming&&<button onClick={()=>onLook(msg.look)} className="afade ch" style={{marginTop:12,display:'inline-flex',alignItems:'center',gap:6,background:t.accBg,border:`1px solid ${t.acc}45`,borderRadius:24,padding:'7px 14px',fontFamily:sans,fontSize:11,fontWeight:600,color:t.acc,textTransform:'uppercase',letterSpacing:'.08em',cursor:'pointer'}}><Sparkles size={12}/> View Look: {msg.look.title}</button>}
      {!isStreaming&&<div className="hv" style={{display:'flex',gap:3,marginTop:8}}><button className="ib" onClick={copy} style={{width:28,height:28,borderRadius:7,color:copied?'#22c55e':t.fnt}}>{copied?<Check size={13}/>:<Copy size={13}/>}</button>{isAsh&&isLast&&<button className="ib" onClick={onRegen} style={{width:28,height:28,borderRadius:7,color:t.fnt}}><RefreshCw size={13}/></button>}</div>}
    </div>
  </div>;
}

function Sidebar({convos,active,onSel,onNew,onDel,onRen,t}){
  const[eid,setEid]=useState(null);const[etxt,setEtxt]=useState('');
  return <div style={{width:248,background:t.sb,borderRight:`1px solid ${t.bdr}`,display:'flex',flexDirection:'column',height:'100%',flexShrink:0}}>
    <div style={{padding:'14px 16px',borderBottom:`1px solid ${t.bdr}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:26,height:26,borderRadius:'50%',background:t.avBg,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}><img src={ASH_LOGO} style={{width:16,height:16,objectFit:'contain'}} alt="ASH"/></div>
        <div><div style={{fontFamily:serif,fontWeight:600,fontSize:14,color:t.acc,letterSpacing:'.15em',lineHeight:1}}>ASH ×</div><div style={{fontFamily:sans,fontWeight:300,fontSize:9,color:t.fnt,letterSpacing:'.2em',textTransform:'uppercase'}}>AI Stylist</div></div>
      </div>
      <button className="ib" onClick={onNew} style={{background:t.accBg,border:`1px solid ${t.acc}40`,borderRadius:9,width:28,height:28,color:t.acc}}><Plus size={15}/></button>
    </div>
    <div style={{padding:'6px 8px 4px',fontFamily:sans,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.14em',color:t.fnt}}>Conversations</div>
    <div className="sc" style={{flex:1,overflowY:'auto',padding:'2px 6px 8px'}}>
      {convos.length===0&&<div style={{padding:'20px 12px',textAlign:'center',fontFamily:sans,fontSize:13,color:t.fnt,lineHeight:1.7}}>Your conversations<br/>with Ash appear here.</div>}
      {convos.map((c)=><div key={c.id} className="ci hhov" onClick={()=>onSel(c.id)} style={{borderRadius:10,padding:'9px 10px',marginBottom:2,background:c.id===active?t.accBg:'transparent',border:`1px solid ${c.id===active?t.acc+'40':'transparent'}`}}>
        {eid===c.id?<input value={etxt} onChange={e=>setEtxt(e.target.value)} onBlur={()=>{if(etxt.trim())onRen(c.id,etxt.trim());setEid(null);}} onKeyDown={e=>{if(e.key==='Enter'){if(etxt.trim())onRen(c.id,etxt.trim());setEid(null);}if(e.key==='Escape')setEid(null);}} onClick={e=>e.stopPropagation()} autoFocus style={{width:'100%',background:'none',border:`1px solid ${t.acc}`,borderRadius:5,padding:'2px 6px',fontFamily:sans,fontSize:13,color:t.txt,outline:'none'}}/>
        :<><div style={{fontFamily:sans,fontSize:13,fontWeight:500,color:t.txt,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',lineHeight:1.3}}>{c.title}</div><div style={{fontFamily:sans,fontSize:11,color:t.fnt,marginTop:2}}>{c.date}</div><div className="hv" style={{display:'flex',gap:2,marginTop:3}}><button onClick={e=>{e.stopPropagation();setEid(c.id);setEtxt(c.title);}} className="ib" style={{width:20,height:20,borderRadius:4,color:t.fnt}}><Edit3 size={10}/></button><button onClick={e=>{e.stopPropagation();onDel(c.id);}} className="ib" style={{width:20,height:20,borderRadius:4,color:t.fnt}}><Trash2 size={10}/></button></div></>}
      </div>)}
    </div>
    <div style={{padding:'10px 14px',borderTop:`1px solid ${t.bdr}`,fontFamily:sans,fontSize:10,color:t.fnt,textAlign:'center',letterSpacing:'.07em'}}>ASH × HUSH — Styled by AI</div>
  </div>;
}

export default function ChatPage(){
  useEffect(()=>{injectFonts();},[]);
  const[dark,setDark]=useState(()=>window.matchMedia?.('(prefers-color-scheme: dark)').matches||false);
  const t=T[dark?'dark':'light'];
  const INIT={role:'assistant',content:"Darling, I'm Ash. Let's make you look dangerous. What's the occasion?",id:'init'};
  const[convos,setConvos]=useState(()=>db.load());
  const[activeId,setActiveId]=useState(null);
  const[msgs,setMsgs]=useState([INIT]);
  const[input,setInput]=useState('');
  const[loading,setLoading]=useState(false);
  const[profile]=useState(null);
  const[sbOpen,setSbOpen]=useState(true);
  const[lookbook,setLookbook]=useState(null);
  const[imgPrev,setImgPrev]=useState(null);
  const[streamId,setStreamId]=useState(null);
  const bottomRef=useRef(null);const fileRef=useRef(null);
  const{text:stxt,running:srun,stream,stop}=useStream();

  useEffect(()=>{db.save(convos);},[convos]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[msgs,stxt]);

  const save=useCallback((m,id)=>{
    const sid=id||activeId;const first=m.find(x=>x.role==='user');if(!first)return sid;
    const title=first.content.slice(0,48)+(first.content.length>48?'…':'');
    const date=new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    setConvos(p=>{if(p.find(c=>c.id===sid))return p.map(c=>c.id===sid?{...c,title,date,messages:m}:c);return[{id:sid,title,date,messages:m},...p];});
    return sid;
  },[activeId]);

  const hist=()=>msgs.filter(m=>m.id!=='init').slice(-12).map(m=>({role:m.role,content:m.content}));

  const send=async(text,img)=>{
    const msg=(text||input).trim();if((!msg&&!img)||loading)return;
    setInput('');setImgPrev(null);
    const sid=activeId||String(Date.now());if(!activeId)setActiveId(sid);
    const um={role:'user',content:msg,imgUrl:img||null,id:String(Date.now())};
    const next=[...msgs,um];setMsgs(next);setLoading(true);
    const pid='p'+Date.now();
    setMsgs(p=>[...p,{role:'assistant',content:'',id:pid,isPend:true}]);
    try{
      const r=await askAsh(msg,profile,hist());
      const aid='a'+Date.now();setStreamId(aid);setLoading(false);
      setMsgs(p=>p.filter(m=>m.id!==pid).concat({role:'assistant',content:r.text,look:r.suggestedLook,id:aid,isStream:true}));
      stream(r.text,()=>{setStreamId(null);const fin=[...next,{role:'assistant',content:r.text,look:r.suggestedLook,id:aid}];setMsgs(fin);save(fin,sid);});
    }catch{
      setMsgs(p=>p.filter(m=>m.id!==pid).concat({role:'assistant',content:"Something interrupted me. Try again — I don't give up easily.",id:String(Date.now())}));
      setLoading(false);
    }
  };

  const regen=async()=>{const lu=[...msgs].reverse().find(m=>m.role==='user');if(!lu||loading)return;setMsgs(p=>{const last=p.filter(m=>m.role==='assistant').at(-1);return last?p.filter(m=>m.id!==last.id):p;});await send(lu.content);};
  const newChat=()=>{save(msgs);setActiveId(null);setMsgs([INIT]);setInput('');stop();setStreamId(null);};
  const loadConvo=(id)=>{const c=convos.find(x=>x.id===id);if(c){save(msgs);setActiveId(id);setMsgs(c.messages);}};
  const delConvo=(id)=>{setConvos(p=>p.filter(c=>c.id!==id));if(id===activeId)newChat();};
  const renConvo=(id,title)=>setConvos(p=>p.map(c=>c.id===id?{...c,title}:c));
  const handleFile=(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setImgPrev(ev.target.result);r.readAsDataURL(f);};
  const lastAshI=[...msgs].reduceRight((a,m,i)=>a===-1&&m.role==='assistant'?i:a,-1);
  const isWelcome=msgs.length<=1;
  const display=msgs.map(m=>m.id===streamId?{...m,content:stxt,isStreaming:true}:m);

  return <div style={{display:'flex',height:'100%',background:t.bg,overflow:'hidden',transition:'background .3s'}}>
    <style>{CSS}</style>
    {sbOpen&&<Sidebar convos={convos} active={activeId} onSel={loadConvo} onNew={newChat} onDel={delConvo} onRen={renConvo} t={t}/>}
    <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,height:'100%'}}>
      {/* Topbar */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 18px',borderBottom:`1px solid ${t.bdr}`,background:t.surf,flexShrink:0,boxShadow:t.shd}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button className="ib" onClick={()=>setSbOpen(s=>!s)} style={{width:34,height:34,borderRadius:9,color:t.mid}}><div style={{display:'flex',flexDirection:'column',gap:3.5}}>{[0,1,2].map(i=><div key={i} style={{width:16,height:1.5,background:t.mid,borderRadius:2}}/>)}</div></button>
          {!sbOpen&&<button className="ib" onClick={newChat} style={{background:t.accBg,border:`1px solid ${t.acc}40`,borderRadius:8,width:30,height:30,color:t.acc}}><Plus size={14}/></button>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:t.avBg,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}><img src={ASH_LOGO} style={{width:20,height:20,objectFit:'contain'}} alt="ASH"/></div>
          <div><div style={{fontFamily:serif,fontWeight:600,fontSize:16,color:t.acc,letterSpacing:'.18em',lineHeight:1}}>ASH ×</div><div style={{fontFamily:sans,fontWeight:300,fontSize:9,color:t.fnt,letterSpacing:'.2em',textTransform:'uppercase',lineHeight:1.3}}>AI Stylist</div></div>
        </div>
        <div style={{display:'flex',gap:7,alignItems:'center'}}>
          <button onClick={()=>setLookbook('all')} style={{display:'flex',alignItems:'center',gap:5,background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:20,padding:'5px 12px',cursor:'pointer',fontFamily:sans,fontSize:11,fontWeight:500,color:t.mid}}><BookOpen size={12}/> Collection</button>
          <button className="ib" onClick={()=>setDark(d=>!d)} style={{background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:20,padding:'5px 12px',width:'auto',gap:5,fontFamily:sans,fontSize:11,color:dark?t.acc:t.mid}}>{dark?<><Sun size={12} color={t.acc}/><span style={{color:t.acc}}>Day</span></>:<><Moon size={12}/><span>Night</span></>}</button>
        </div>
      </div>
      {/* Messages */}
      <div className="sc" style={{flex:1,overflowY:'auto',padding:'32px 20px 16px'}}>
        {isWelcome&&<div className="afade" style={{textAlign:'center',marginBottom:44}}>
          <div style={{width:72,height:72,borderRadius:'50%',background:t.avBg,border:`1px solid ${t.bdr}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',boxShadow:t.shadowPop,overflow:'hidden'}}><img src={ASH_LOGO} style={{width:44,height:44,objectFit:'contain'}} alt="ASH"/></div>
          <div style={{fontFamily:serif,fontWeight:300,fontSize:38,color:t.txt,letterSpacing:'.02em',lineHeight:1.2,marginBottom:10}}>Style starts here.</div>
          <div style={{fontFamily:sans,fontSize:14,color:t.fnt,lineHeight:1.7,maxWidth:360,margin:'0 auto'}}>Ask Ash anything — outfits, occasions, body types, trends.<br/>She knows exactly what works.</div>
        </div>}
        {display.map((m,i)=>m.isPend?<Thinking key={m.id} t={t}/>:<Message key={m.id} msg={m} t={t} onCopy={()=>{}} onRegen={regen} onLook={setLookbook} isLast={i===lastAshI} streamText={stxt} isStreaming={m.id===streamId&&srun}/>)}
        <div ref={bottomRef}/>
      </div>
      {/* Quick prompts */}
      {isWelcome&&<div style={{padding:'0 20px 16px',display:'flex',flexWrap:'wrap',gap:7,maxWidth:760,margin:'0 auto',width:'100%',boxSizing:'border-box'}}>{QUICK.map(q=><button key={q} onClick={()=>send(q)} className="ch" style={{background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:24,padding:'8px 16px',fontFamily:sans,fontSize:12,fontWeight:500,color:t.mid,boxShadow:'0 1px 4px rgba(0,0,0,0.05)',cursor:'pointer'}}>{q}</button>)}</div>}
      {/* Image preview */}
      {imgPrev&&<div style={{padding:'0 20px 8px',maxWidth:760,margin:'0 auto',width:'100%',boxSizing:'border-box'}}><div style={{display:'inline-flex',alignItems:'center',gap:8,background:t.surf,border:`1px solid ${t.bdr}`,borderRadius:12,padding:8}}><img src={imgPrev} alt="" style={{width:44,height:44,objectFit:'cover',borderRadius:8}}/><span style={{fontFamily:sans,fontSize:12,color:t.mid}}>Image ready to send</span><button className="ib" onClick={()=>setImgPrev(null)} style={{color:t.fnt,width:20,height:20}}><X size={13}/></button></div></div>}
      {/* Input */}
      <div style={{padding:'10px 18px 14px',borderTop:`1px solid ${t.bdr}`,background:t.surf,flexShrink:0}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <div style={{display:'flex',gap:8,alignItems:'center',background:t.inp,border:`1.5px solid ${t.bdr}`,borderRadius:20,padding:'10px 12px 10px 14px',boxShadow:t.shd}}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>
            <button className="ib" onClick={()=>fileRef.current?.click()} style={{width:30,height:30,borderRadius:8,color:t.fnt,flexShrink:0}}><Paperclip size={15}/></button>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send(input,imgPrev);}} placeholder="Ask Ash anything about your style…" style={{flex:1,background:'transparent',border:'none',fontFamily:sans,fontSize:14,color:t.txt,outline:'none',caretColor:t.acc}}/>
            {loading?<button className="ib" onClick={stop} style={{width:36,height:36,borderRadius:12,background:t.accBg,color:t.acc,flexShrink:0}}><X size={15}/></button>:<button className="ib" onClick={()=>send(input,imgPrev)} disabled={!input.trim()&&!imgPrev} style={{width:36,height:36,borderRadius:12,background:(input.trim()||imgPrev)?t.acc:t.bdr,color:(input.trim()||imgPrev)?'#fff':t.fnt,flexShrink:0}}><Send size={15}/></button>}
          </div>
          <div style={{textAlign:'center',marginTop:7,fontFamily:sans,fontSize:10,color:t.fnt,letterSpacing:'.07em'}}>Ash may make mistakes — always try on before you buy.</div>
        </div>
      </div>
    </div>
    {lookbook&&<Lookbook look={lookbook==='all'?null:lookbook} onClose={()=>setLookbook(null)} t={t}/>}
  </div>;
}
