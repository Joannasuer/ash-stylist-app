import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, Trash2, Edit3, X, Copy, Check, RefreshCw, Sparkles, ChevronRight, Paperclip, Menu, Moon, Sun, Mail, ChevronLeft } from 'lucide-react';

const injectFonts = () => {
  if (document.getElementById('ash-gf')) return;
  const l = document.createElement('link');
  l.id = 'ash-gf'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap';
  document.head.appendChild(l);
};

const ASH_LOGO = 'https://cdn.shopify.com/s/files/1/0941/4197/2795/files/ash-logo_71d5937b-3fe1-4c0b-b99f-93ed0d7b810f.svg?v=1764163271';
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', system-ui, sans-serif";
const STORAGE_KEY = 'ash_convos_v5';
const THEME_KEY = 'ash_theme';
const EMAIL_KEY = 'ash_member_email';
const FREE_LIMIT = 3;

const isEmbedded = (() => { try { return window.self !== window.top; } catch { return true; } })();

const PRODUCTS = [
  { id: 'hush-001', name: 'Midnight Silk Dress', price: '180', cat: 'Dress', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&fit=crop', link: 'https://timeforhush.com/products/midnight-silk-dress', desc: 'Black silk, open back. The dress that ends conversations.' },
  { id: 'hush-002', name: 'Executive Blazer', price: '250', cat: 'Outerwear', img: 'https://images.unsplash.com/photo-1548624149-f32144679638?w=400&fit=crop', link: 'https://timeforhush.com/products/executive-blazer', desc: 'Oversized, sharp shoulders. Power dressing redefined.' },
  { id: 'hush-003', name: 'Viper Leather Pants', price: '300', cat: 'Bottoms', img: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&fit=crop', link: 'https://timeforhush.com/products/viper-leather-pants', desc: 'High waisted, vegan leather. Built for people who arrive.' },
  { id: 'hush-004', name: 'Raw Edge Denim', price: '220', cat: 'Denim', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&fit=crop', link: 'https://timeforhush.com/products/raw-edge-denim', desc: 'Japanese selvage. Straight leg. The only denim you need.' },
  { id: 'hush-005', name: 'Sculpt Athleisure Set', price: '195', cat: 'Athleisure', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&fit=crop', link: 'https://timeforhush.com/products/sculpt-athleisure-set', desc: 'Technical fabric. Sculpting silhouette.' },
];

const QUICK = [
  'Style me for dinner tonight — make it dangerous',
  'Power meeting tomorrow. Dress me.',
  'Sketch it — cinematic weekend look',
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
  if (!res.ok) throw new Error();
  return res.json();
}

const THEMES = {
  day: {
    bg: '#FAFAF8', surf: '#FFFFFF', sb: '#F4F0EA',
    bdr: '#E5E1DB', txt: '#1A1714', mid: '#6B6560', fnt: '#A09890',
    acc: '#C41E1E', accBg: 'rgba(196,30,30,0.07)',
    uBg: '#1A1714', uFg: '#FAFAF8',
    shd: '0 1px 10px rgba(0,0,0,0.06)',
    toggleBg: '#E8E4DC', toggleDot: '#1A1714',
  },
  night: {
    bg: '#0C0B09', surf: '#141310', sb: '#181614',
    bdr: '#2C2820', txt: '#EDE8E0', mid: '#8A8278', fnt: '#48443E',
    acc: '#E03A3A', accBg: 'rgba(224,58,58,0.12)',
    uBg: '#EDE8E0', uFg: '#0C0B09',
    shd: '0 1px 16px rgba(0,0,0,0.5)',
    toggleBg: '#2C2820', toggleDot: '#EDE8E0',
  },
};

const makeCss = (C) => `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  @keyframes msgUp  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideR { from{transform:translateX(110%)} to{transform:translateX(0)} }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes vPulse {
    0%  {filter:brightness(1) drop-shadow(0 0 0px ${C.acc});transform:scale(1)}
    35% {filter:brightness(1.6) drop-shadow(0 0 12px ${C.acc});transform:scale(1.12)}
    70% {filter:brightness(0.8) drop-shadow(0 0 2px ${C.acc});transform:scale(0.94)}
    100%{filter:brightness(1) drop-shadow(0 0 0px ${C.acc});transform:scale(1)}
  }
  @keyframes vFloat { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes gateUp { from{opacity:0;transform:translateY(16px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }

  .a-up   { animation:msgUp .28s cubic-bezier(.16,1,.3,1) forwards }
  .a-fade { animation:fadeIn .22s ease forwards }
  .a-cur  { display:inline-block;width:2px;height:.85em;background:${C.acc};margin-left:1px;vertical-align:text-bottom;animation:blink 1s step-end infinite }
  .a-vp   { animation:vPulse 1.8s ease-in-out infinite;transform-origin:center }
  .a-vt   { animation:vFloat 1.8s ease-in-out infinite }
  .a-gate { animation:gateUp .35s cubic-bezier(.16,1,.3,1) forwards }

  .a-sc::-webkit-scrollbar       { width:3px }
  .a-sc::-webkit-scrollbar-track { background:transparent }
  .a-sc::-webkit-scrollbar-thumb { border-radius:4px;background:${C.bdr} }

  .a-hov .a-hv        { opacity:0;transition:opacity .15s }
  .a-hov:hover .a-hv  { opacity:1 }

  .a-ib { transition:all .15s;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;background:none;padding:0 }
  .a-ib:hover  { transform:scale(1.08) }
  .a-ib:active { transform:scale(.95) }
  .a-ci { cursor:pointer;transition:background .15s }
  .a-ch { cursor:pointer;transition:all .15s }
  .a-ch:hover { transform:translateY(-1px) }
  .a-pc { transition:all .2s }
  .a-pc:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.15) }
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

function MD({ text, C }) {
  if (!text) return null;
  const lines = text.split('\n'); const out = []; let i = 0;
  const fmt = s => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('**') && l.endsWith('**') && !l.slice(2, -2).includes('**')) {
      out.push(<div key={i} style={{ fontFamily: serif, fontWeight: 600, fontSize: 16, color: C.txt, margin: '10px 0 4px' }}>{l.slice(2, -2)}</div>);
    } else if (l.startsWith('- ') || l.startsWith('* ')) {
      const its = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) { its.push(lines[i].slice(2)); i++; }
      out.push(
        <ul key={'u' + i} style={{ listStyle: 'none', padding: 0, margin: '5px 0' }}>
          {its.map((it, j) => (
            <li key={j} style={{ display: 'flex', gap: 7, margin: '4px 0', fontFamily: sans, fontSize: 13, lineHeight: 1.7, color: C.txt }}>
              <span style={{ color: C.acc, flexShrink: 0, fontSize: 9, marginTop: 5 }}>✦</span>
              <span dangerouslySetInnerHTML={{ __html: fmt(it) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (l.trim() === '---') {
      out.push(<hr key={i} style={{ border: 'none', borderTop: `1px solid ${C.bdr}`, margin: '10px 0' }} />);
    } else if (l.trim() === '') {
      if (i > 0 && lines[i - 1].trim()) out.push(<div key={i} style={{ height: 4 }} />);
    } else {
      out.push(<p key={i} style={{ margin: '2px 0', fontFamily: sans, fontSize: 13, lineHeight: 1.78, color: C.txt }} dangerouslySetInnerHTML={{ __html: fmt(l) }} />);
    }
    i++;
  }
  return <div>{out}</div>;
}

function Av({ isAsh, pulse, C }) {
  if (isAsh) return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <img src={ASH_LOGO} className={pulse ? 'a-vp' : ''} style={{ width: 20, height: 20, objectFit: 'contain' }} alt="" />
    </div>
  );
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.uBg, border: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, color: C.uFg }}>U</span>
    </div>
  );
}

function ThemeToggle({ isDark, onToggle, C }) {
  return (
    <button onClick={onToggle} title={isDark ? 'Day mode' : 'Night mode'}
      style={{
        width: 42, height: 22, borderRadius: 11, background: C.toggleBg,
        border: `1px solid ${C.bdr}`, cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', padding: '0 3px',
        justifyContent: isDark ? 'flex-end' : 'flex-start', transition: 'all .3s',
      }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: C.toggleDot, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}>
        {isDark ? <Moon size={8} color={C.bg} strokeWidth={2.5} /> : <Sun size={8} color={C.surf} strokeWidth={2.5} />}
      </div>
    </button>
  );
}

function EmailGate({ onUnlock, C, isDark }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) { setErr('Enter a valid email.'); return; }
    try { localStorage.setItem(EMAIL_KEY, email); } catch {}
    setSent(true);
    setTimeout(() => onUnlock(email), 1400);
  };

  return (
    <div className="a-fade" style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: isDark ? 'rgba(12,11,9,0.93)' : 'rgba(20,18,15,0.78)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, backdropFilter: 'blur(10px)',
    }}>
      <div className="a-gate" style={{
        background: C.surf, border: `1px solid ${C.bdr}`, borderRadius: 22,
        padding: '32px 26px', maxWidth: 320, width: '100%', textAlign: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
      }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', border: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <img src={ASH_LOGO} className="a-vp" style={{ width: 34, height: 34, objectFit: 'contain' }} alt="" />
        </div>
        {sent ? (
          <>
            <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 22, color: C.txt, marginBottom: 8 }}>Welcome to ASH.</div>
            <div style={{ fontFamily: sans, fontSize: 13, color: C.fnt }}>Unlocking your full styling session…</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: serif, fontWeight: 300, fontSize: 24, color: C.txt, lineHeight: 1.2, marginBottom: 4 }}>Style is personal.</div>
            <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 15, color: C.acc, marginBottom: 16 }}>Let Ash remember you.</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.mid, lineHeight: 1.75, marginBottom: 22 }}>
              3 free looks, then unlock unlimited styling,<br />full memory & saved history — free forever.
            </div>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bg, border: `1.5px solid ${err ? C.acc : C.bdr}`, borderRadius: 12, padding: '10px 14px' }}>
                <Mail size={13} color={C.fnt} />
                <input
                  type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setErr(''); }}
                  placeholder="your@email.com" required
                  style={{ flex: 1, background: 'transparent', border: 'none', fontFamily: sans, fontSize: 14, color: C.txt, outline: 'none' }}
                />
              </div>
              {err && <div style={{ fontFamily: sans, fontSize: 11, color: C.acc, marginTop: -4 }}>{err}</div>}
              <button type="submit" style={{
                background: C.acc, color: '#fff', border: 'none', borderRadius: 12,
                padding: '12px 0', fontFamily: sans, fontSize: 12, fontWeight: 700,
                letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer',
              }}>
                Unlock ASH — Free
              </button>
            </form>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.fnt, marginTop: 14, lineHeight: 1.6 }}>
              No spam. No credit card. Just Ash, remembering you.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Thinking({ C }) {
  return (
    <div className="a-up" style={{ display: 'flex', gap: 10, marginBottom: 20, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ marginTop: 16, flexShrink: 0 }}><Av isAsh pulse C={C} /></div>
      <div>
        <div style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: C.fnt, marginBottom: 5 }}>Ash</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surf, border: `1px solid ${C.bdr}`, borderRadius: '4px 14px 14px 14px', padding: '10px 16px', boxShadow: C.shd }}>
          <img src={ASH_LOGO} className="a-vp" style={{ width: 17, height: 17, objectFit: 'contain', flexShrink: 0 }} alt="" />
          <span className="a-vt" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 14, color: C.fnt }}>Styling your look…</span>
        </div>
      </div>
    </div>
  );
}

function PCard({ p, C }) {
  return (
    <a href={p.link} target="_blank" rel="noreferrer" className="a-pc"
      style={{ display: 'block', textDecoration: 'none', background: C.surf, border: `1px solid ${C.bdr}`, borderRadius: 12, overflow: 'hidden', marginBottom: 10, boxShadow: C.shd }}>
      <div style={{ position: 'relative' }}>
        <img src={p.img} alt={p.name} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 7, right: 7, background: C.acc, color: '#fff', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', padding: '2px 7px', borderRadius: 20, fontFamily: sans }}>{p.cat}</div>
      </div>
      <div style={{ padding: '9px 12px 11px' }}>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 14, color: C.txt, marginBottom: 2 }}>{p.name}</div>
        <div style={{ fontFamily: sans, fontSize: 11, color: C.fnt, marginBottom: 7, lineHeight: 1.5 }}>{p.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 13, color: C.acc }}>${p.price}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontFamily: sans, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: C.mid }}>Shop <ChevronRight size={10} /></span>
        </div>
      </div>
    </a>
  );
}

function Lookbook({ look, onClose, C }) {
  const items = look?.itemIds ? look.itemIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) : PRODUCTS;
  return (
    <>
      <div className="a-fade" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, backdropFilter: 'blur(4px)' }} />
      <div className="a-sc" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 275, background: C.sb, borderLeft: `1px solid ${C.bdr}`, zIndex: 201, overflowY: 'auto', display: 'flex', flexDirection: 'column', animation: 'slideR .3s cubic-bezier(.16,1,.3,1) forwards' }}>
        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: C.sb }}>
          <div>
            <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 15, color: C.txt }}>{look?.title || 'HUSH Collection'}</div>
            {look?.explanation && <div style={{ fontFamily: sans, fontStyle: 'italic', fontSize: 11, color: C.mid, marginTop: 2 }}>{look.explanation}</div>}
          </div>
          <button className="a-ib" onClick={onClose} style={{ color: C.fnt, width: 26, height: 26, borderRadius: 6 }}><X size={14} /></button>
        </div>
        <div style={{ padding: 12 }}>{items.map(p => <PCard key={p.id} p={p} C={C} />)}</div>
      </div>
    </>
  );
}

function SidebarPanel({ convos, active, onSel, onNew, onDel, onRen, onClose, C }) {
  const [eid, setEid] = useState(null);
  const [etxt, setEtxt] = useState('');
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '9px 10px', borderBottom: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <img src={ASH_LOGO} style={{ width: 16, height: 16, objectFit: 'contain' }} alt="" />
          <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 12, color: C.acc, letterSpacing: '.12em' }}>ASH ×</span>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          <button className="a-ib" onClick={onNew} style={{ background: C.accBg, border: `1px solid ${C.acc}30`, borderRadius: 6, width: 22, height: 22, color: C.acc }}><Plus size={10} /></button>
          <button className="a-ib" onClick={onClose} style={{ width: 22, height: 22, borderRadius: 6, color: C.fnt }}><ChevronLeft size={12} /></button>
        </div>
      </div>
      <div style={{ padding: '4px 6px 2px', fontFamily: sans, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.16em', color: C.fnt, flexShrink: 0 }}>History</div>
      <div className="a-sc" style={{ flex: 1, overflowY: 'auto', padding: '2px 5px 8px' }}>
        {convos.length === 0 && (
          <div style={{ padding: '20px 8px', textAlign: 'center', fontFamily: sans, fontSize: 12, color: C.fnt, lineHeight: 1.7 }}>
            Your conversations<br />appear here.
          </div>
        )}
        {convos.map(c => (
          <div key={c.id} className="a-ci" onClick={() => onSel(c.id)}
            style={{ borderRadius: 8, padding: '7px 8px', marginBottom: 2, background: c.id === active ? C.accBg : 'transparent', border: `1px solid ${c.id === active ? C.acc + '35' : 'transparent'}` }}>
            {eid === c.id
              ? <input value={etxt} onChange={e => setEtxt(e.target.value)}
                  onBlur={() => { if (etxt.trim()) onRen(c.id, etxt.trim()); setEid(null); }}
                  onKeyDown={e => { if (e.key === 'Enter') { if (etxt.trim()) onRen(c.id, etxt.trim()); setEid(null); } if (e.key === 'Escape') setEid(null); }}
                  onClick={e => e.stopPropagation()} autoFocus
                  style={{ width: '100%', background: 'none', border: `1px solid ${C.acc}`, borderRadius: 4, padding: '2px 5px', fontFamily: sans, fontSize: 11, color: C.txt, outline: 'none' }} />
              : (
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 500, color: C.txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>{c.title}</div>
                    <div style={{ fontFamily: sans, fontSize: 9, color: C.fnt, marginTop: 1 }}>{c.date}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <button onClick={e => { e.stopPropagation(); setEid(c.id); setEtxt(c.title); }} className="a-ib" style={{ width: 16, height: 16, borderRadius: 3, color: C.fnt }}><Edit3 size={8} /></button>
                    <button onClick={e => { e.stopPropagation(); onDel(c.id); }} className="a-ib" style={{ width: 16, height: 16, borderRadius: 3, color: C.fnt }}><Trash2 size={8} /></button>
                  </div>
                </div>
              )
            }
          </div>
        ))}
      </div>
      <div style={{ padding: '6px 10px', borderTop: `1px solid ${C.bdr}`, fontFamily: sans, fontSize: 9, color: C.fnt, textAlign: 'center', letterSpacing: '.07em', flexShrink: 0 }}>ASH × HUSH</div>
    </div>
  );
}

function Message({ msg, onRegen, onLook, isLast, streamText, isStreaming, C }) {
  const [copied, setCopied] = useState(false);
  const isAsh = msg.role === 'assistant';
  const content = isStreaming ? streamText : msg.content;
  const copy = () => { navigator.clipboard?.writeText(content || ''); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="a-up a-hov" style={{ display: 'flex', gap: 10, marginBottom: 20, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', flexDirection: isAsh ? 'row' : 'row-reverse' }}>
      <div style={{ flexShrink: 0, marginTop: 16 }}><Av isAsh={isAsh} C={C} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: C.fnt, marginBottom: 4 }}>{isAsh ? 'Ash' : 'You'}</div>
        {msg.imgUrl && <img src={msg.imgUrl} alt="" style={{ maxWidth: 200, maxHeight: 140, borderRadius: 10, marginBottom: 7, objectFit: 'cover', border: `1px solid ${C.bdr}`, display: 'block' }} />}
        <div>
          {isAsh
            ? <><MD text={content} C={C} />{isStreaming && isLast && <span className="a-cur" />}</>
            : <p style={{ margin: 0, fontFamily: sans, fontSize: 13, lineHeight: 1.78, color: C.txt }}>{content}</p>
          }
        </div>
        {isAsh && msg.look && !isStreaming && (
          <button onClick={() => onLook(msg.look)} className="a-ch"
            style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, background: C.accBg, border: `1px solid ${C.acc}35`, borderRadius: 20, padding: '5px 11px', fontFamily: sans, fontSize: 10, fontWeight: 600, color: C.acc, textTransform: 'uppercase', letterSpacing: '.08em', cursor: 'pointer' }}>
            <Sparkles size={10} /> View Look: {msg.look.title}
          </button>
        )}
        {!isStreaming && (
          <div className="a-hv" style={{ display: 'flex', gap: 3, marginTop: 5 }}>
            <button className="a-ib" onClick={copy} style={{ width: 24, height: 24, borderRadius: 6, color: copied ? '#22c55e' : C.fnt }}>{copied ? <Check size={11} /> : <Copy size={11} />}</button>
            {isAsh && isLast && <button className="a-ib" onClick={onRegen} style={{ width: 24, height: 24, borderRadius: 6, color: C.fnt }}><RefreshCw size={11} /></button>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  useEffect(() => { injectFonts(); }, []);

  const [isDark, setIsDark] = useState(() => { try { return localStorage.getItem(THEME_KEY) === 'night'; } catch { return false; } });
  const [memberEmail, setMemberEmail] = useState(() => { try { return localStorage.getItem(EMAIL_KEY) || ''; } catch { return ''; } });
  const [showGate, setShowGate] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);

  const C = isDark ? THEMES.night : THEMES.day;
  const CSS = makeCss(C);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try { localStorage.setItem(THEME_KEY, next ? 'night' : 'day'); } catch {}
  };

  const INIT = { role: 'assistant', content: "Darling, I'm Ash. Let's make you look dangerous. What's the occasion?", id: 'init' };
  const [convos, setConvos] = useState(() => db.load());
  const [activeId, setActiveId] = useState(null);
  const [msgs, setMsgs] = useState([INIT]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile] = useState(null);
  const [sbOpen, setSbOpen] = useState(false);
  const [lookbook, setLookbook] = useState(null);
  const [imgPrev, setImgPrev] = useState(null);
  const [streamId, setStreamId] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const { text: stxt, running: srun, stream, stop } = useStream();

  useEffect(() => { db.save(convos); }, [convos]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, stxt]);

  const save = useCallback((m, id) => {
    const sid = id || activeId;
    const first = m.find(x => x.role === 'user');
    if (!first) return sid;
    const title = first.content.slice(0, 48) + (first.content.length > 48 ? '…' : '');
    const date = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    setConvos(p => {
      if (p.find(c => c.id === sid)) return p.map(c => c.id === sid ? { ...c, title, date, messages: m } : c);
      return [{ id: sid, title, date, messages: m }, ...p];
    });
    return sid;
  }, [activeId]);

  const hist = () => msgs.filter(m => m.id !== 'init').slice(-12).map(m => ({ role: m.role, content: m.content }));

  const send = async (text, img) => {
    const msg = (text || input).trim();
    if ((!msg && !img) || loading) return;
    if (!memberEmail && freeUsed >= FREE_LIMIT) { setShowGate(true); return; }
    setInput(''); setImgPrev(null);
    if (!memberEmail) setFreeUsed(p => p + 1);
    const sid = activeId || String(Date.now());
    if (!activeId) setActiveId(sid);
    const um = { role: 'user', content: msg, imgUrl: img || null, id: String(Date.now()) };
    const next = [...msgs, um];
    setMsgs(next); setLoading(true);
    const pid = 'p' + Date.now();
    setMsgs(p => [...p, { role: 'assistant', content: '', id: pid, isPend: true }]);
    try {
      const r = await askAsh(msg, profile, hist());
      const aid = 'a' + Date.now();
      setStreamId(aid); setLoading(false);
      setMsgs(p => p.filter(m => m.id !== pid).concat({ role: 'assistant', content: r.text, look: r.suggestedLook, id: aid }));
      stream(r.text, () => {
        setStreamId(null);
        const fin = [...next, { role: 'assistant', content: r.text, look: r.suggestedLook, id: aid }];
        setMsgs(fin); save(fin, sid);
      });
    } catch {
      setMsgs(p => p.filter(m => m.id !== pid).concat({ role: 'assistant', content: "Something interrupted me. Try again.", id: String(Date.now()) }));
      setLoading(false);
    }
  };

  const regen = async () => {
    const lu = [...msgs].reverse().find(m => m.role === 'user');
    if (!lu || loading) return;
    setMsgs(p => { const last = p.filter(m => m.role === 'assistant').at(-1); return last ? p.filter(m => m.id !== last.id) : p; });
    await send(lu.content);
  };

  const newChat = () => { save(msgs); setActiveId(null); setMsgs([INIT]); setInput(''); stop(); setStreamId(null); };
  const loadConvo = id => { const c = convos.find(x => x.id === id); if (c) { save(msgs); setActiveId(id); setMsgs(c.messages); } };
  const delConvo = id => { setConvos(p => p.filter(c => c.id !== id)); if (id === activeId) newChat(); };
  const renConvo = (id, title) => setConvos(p => p.map(c => c.id === id ? { ...c, title } : c));
  const handleFile = e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setImgPrev(ev.target.result); r.readAsDataURL(f); };

  const lastAshI = [...msgs].reduceRight((a, m, i) => a === -1 && m.role === 'assistant' ? i : a, -1);
  const isWelcome = msgs.length <= 1;
  const display = msgs.map(m => m.id === streamId ? { ...m, content: stxt, isStreaming: true } : m);
  const isMember = !!memberEmail;
  const freeLeft = FREE_LIMIT - freeUsed;
  const topOffset = isEmbedded ? 0 : 48;

  return (
    <div style={{ position: 'fixed', top: topOffset, left: 0, right: 0, bottom: 0, display: 'flex', background: C.bg, transition: 'background .3s' }}>
      <style>{CSS}</style>

      {/* Sidebar — inline, non-blocking, chat still usable when open */}
      <div style={{ width: sbOpen ? 205 : 0, flexShrink: 0, overflow: 'hidden', transition: 'width 0.25s cubic-bezier(.16,1,.3,1)', borderRight: `1px solid ${sbOpen ? C.bdr : 'transparent'}`, background: C.sb }}>
        <SidebarPanel convos={convos} active={activeId} onSel={loadConvo} onNew={newChat} onDel={delConvo} onRen={renConvo} onClose={() => setSbOpen(false)} C={C} />
      </div>

      {/* Main chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderBottom: `1px solid ${C.bdr}`, background: C.surf, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button className="a-ib" onClick={() => setSbOpen(v => !v)}
              style={{ width: 28, height: 28, borderRadius: 7, color: sbOpen ? C.acc : C.mid, background: sbOpen ? C.accBg : C.bg, border: `1px solid ${sbOpen ? C.acc + '35' : C.bdr}` }}>
              <Menu size={13} />
            </button>
            <button className="a-ib" onClick={newChat}
              style={{ width: 28, height: 28, borderRadius: 7, color: C.acc, background: C.accBg, border: `1px solid ${C.acc}35` }}>
              <Plus size={13} />
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {isMember
              ? <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, color: C.acc, letterSpacing: '.12em', textTransform: 'uppercase' }}>✦ ASH Member</span>
              : freeLeft > 0
                ? <span style={{ fontFamily: sans, fontSize: 9, color: C.fnt, letterSpacing: '.06em' }}>{freeLeft} free {freeLeft === 1 ? 'look' : 'looks'} left</span>
                : <button onClick={() => setShowGate(true)} style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, color: C.acc, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.08em', textTransform: 'uppercase' }}>Unlock Ash →</button>
            }
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} C={C} />
            <button onClick={() => setLookbook('all')}
              style={{ display: 'flex', alignItems: 'center', gap: 3, background: C.bg, border: `1px solid ${C.bdr}`, borderRadius: 14, padding: '4px 10px', cursor: 'pointer', fontFamily: sans, fontSize: 9, fontWeight: 600, color: C.mid, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Shop
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="a-sc" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 12px 6px' }}>
          {isWelcome && (
            <div className="a-fade" style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <img src={ASH_LOGO} style={{ width: 40, height: 40, objectFit: 'contain' }} alt="ASH" />
              </div>
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: 28, color: C.txt, letterSpacing: '.02em', lineHeight: 1.2, marginBottom: 6 }}>Style starts here.</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: C.fnt, lineHeight: 1.7, maxWidth: 280, margin: '0 auto' }}>
                Ask Ash anything — outfits, occasions,<br />body types, trends. She knows.
              </div>
            </div>
          )}
          {display.map((m, i) =>
            m.isPend
              ? <Thinking key={m.id} C={C} />
              : <Message key={m.id} msg={m} onRegen={regen} onLook={setLookbook} isLast={i === lastAshI} streamText={stxt} isStreaming={m.id === streamId && srun} C={C} />
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {isWelcome && (
          <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 5, maxWidth: 700, margin: '0 auto', width: '100%', boxSizing: 'border-box', flexShrink: 0 }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)} className="a-ch"
                style={{ background: C.surf, border: `1px solid ${C.bdr}`, borderRadius: 18, padding: '5px 12px', fontFamily: sans, fontSize: 11, fontWeight: 500, color: C.mid, boxShadow: C.shd, cursor: 'pointer' }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Image preview */}
        {imgPrev && (
          <div style={{ padding: '0 12px 5px', maxWidth: 700, margin: '0 auto', width: '100%', boxSizing: 'border-box', flexShrink: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.surf, border: `1px solid ${C.bdr}`, borderRadius: 9, padding: 6 }}>
              <img src={imgPrev} alt="" style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 6 }} />
              <span style={{ fontFamily: sans, fontSize: 11, color: C.mid }}>Image ready</span>
              <button className="a-ib" onClick={() => setImgPrev(null)} style={{ color: C.fnt, width: 16, height: 16 }}><X size={11} /></button>
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '6px 10px 10px', borderTop: `1px solid ${C.bdr}`, background: C.surf, flexShrink: 0 }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: C.bg, border: `1.5px solid ${C.bdr}`, borderRadius: 18, padding: '7px 8px 7px 12px', boxShadow: C.shd }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              <button className="a-ib" onClick={() => fileRef.current?.click()} style={{ width: 26, height: 26, borderRadius: 6, color: C.fnt, flexShrink: 0 }}><Paperclip size={13} /></button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input, imgPrev); } }}
                placeholder="Ask Ash anything about your style…"
                style={{ flex: 1, background: 'transparent', border: 'none', fontFamily: sans, fontSize: 14, color: C.txt, outline: 'none', caretColor: C.acc, minWidth: 0 }}
              />
              {loading
                ? <button className="a-ib" onClick={stop} style={{ width: 32, height: 32, borderRadius: 9, background: C.accBg, color: C.acc, flexShrink: 0 }}><X size={13} /></button>
                : <button className="a-ib" onClick={() => send(input, imgPrev)} disabled={!input.trim() && !imgPrev}
                    style={{ width: 32, height: 32, borderRadius: 9, background: (input.trim() || imgPrev) ? C.acc : C.bdr, color: (input.trim() || imgPrev) ? '#fff' : C.fnt, flexShrink: 0, transition: 'background .15s' }}>
                    <Send size={13} />
                  </button>
              }
            </div>
            <div style={{ textAlign: 'center', marginTop: 4, fontFamily: sans, fontSize: 9, color: C.fnt, letterSpacing: '.06em' }}>
              Ash may make mistakes — always try on before you buy.
            </div>
          </div>
        </div>
      </div>

      {showGate && <EmailGate isDark={isDark} C={C} onUnlock={email => { setMemberEmail(email); setShowGate(false); }} />}
      {lookbook && <Lookbook look={lookbook === 'all' ? null : lookbook} onClose={() => setLookbook(null)} C={C} />}
    </div>
  );
}
