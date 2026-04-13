// src/components/VIPModal.jsx
// The FIT ID gatekeeper — collects style data and saves to Supabase

import { useState, useContext } from 'react';
import { X, ChevronRight, Lock, Sparkles } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const STEPS = ['account', 'measurements', 'style', 'done'];

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SKIN_TONES = ['Porcelain', 'Fair', 'Light', 'Medium', 'Tan', 'Deep', 'Rich'];

const STYLE_DNA_OPTIONS = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'glam', label: 'Glam' },
  { id: 'street', label: 'Street' },
  { id: 'avant', label: 'Avant-Garde' },
  { id: 'power', label: 'Power' },
  { id: 'romantic', label: 'Romantic' },
  { id: 'athletic', label: 'Athletic' },
  { id: 'boho', label: 'Boho' },
];

export default function VIPModal({ onClose }) {
  const { user, setUserProfile, setIsVIP } = useContext(AppContext);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    // Account
    email: user?.email || '',
    full_name: user?.user_metadata?.full_name || '',
    password: '',
    // Measurements
    height_cm: '',
    body_type: '',
    // Style
    zodiac: '',
    skin_tone: '',
    style_dna: [],
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleStyleDNA = (id) => {
    setForm((f) => ({
      ...f,
      style_dna: f.style_dna.includes(id)
        ? f.style_dna.filter((x) => x !== id)
        : [...f.style_dna, id],
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      let userId = user?.id;

      // Step 1: Create or sign in Supabase user if not already authenticated
      if (!userId) {
        if (!form.email || !form.password) {
          setError('Email and password are required.');
          setLoading(false);
          return;
        }

        // Try sign-up first
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.full_name } },
        });

        if (signUpError && signUpError.message.includes('already registered')) {
          // User exists — sign them in
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
          });
          if (signInError) {
            setError('Wrong password. Try again.');
            setLoading(false);
            return;
          }
          userId = signInData.user.id;
        } else if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        } else {
          userId = signUpData.user?.id;
        }
      }

      // Step 2: Upsert the FIT ID profile in Supabase
      const profileData = {
        id: userId,
        full_name: form.full_name,
        height_cm: form.height_cm ? parseInt(form.height_cm) : null,
        body_type: form.body_type || null,
        zodiac: form.zodiac || null,
        skin_tone: form.skin_tone || null,
        style_dna: form.style_dna,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (upsertError) {
        console.error('Profile upsert error:', upsertError);
        // Don't block — VIP status still granted
      }

      // Update app context
      setUserProfile(profileData);
      setIsVIP(true);
      nextStep(); // Go to done step
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = STEPS[step];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock size={14} className="text-red-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                FIT ID
              </span>
            </div>
            <h2 className="text-lg font-bold">
              {currentStep === 'account' && 'Create Your Profile'}
              {currentStep === 'measurements' && 'Your Measurements'}
              {currentStep === 'style' && 'Your Style DNA'}
              {currentStep === 'done' && "You're In, Darling"}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Progress */}
        {currentStep !== 'done' && (
          <div className="flex gap-1 px-6 py-3 bg-gray-50">
            {['account', 'measurements', 'style'].map((s, i) => (
              <div
                key={s}
                className={`h-0.5 flex-1 rounded-full transition-colors ${
                  STEPS.indexOf(s) <= step ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Step Content */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* ── STEP: ACCOUNT ── */}
          {currentStep === 'account' && (
            <>
              <p className="text-xs text-gray-500">
                Ash remembers you between sessions when you have a profile. One time only.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => update('full_name', e.target.value)}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                {!user && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Password</label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => update('password', e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={nextStep}
                disabled={!form.full_name || (!user && (!form.email || form.password.length < 6))}
                className="w-full bg-black text-white py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* ── STEP: MEASUREMENTS ── */}
          {currentStep === 'measurements' && (
            <>
              <p className="text-xs text-gray-500">
                Ash uses this to recommend the exact cut for your frame. Be honest — she can handle it.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={form.height_cm}
                    onChange={(e) => update('height_cm', e.target.value)}
                    placeholder="e.g. 168"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Body Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Petite', 'Straight', 'Curvy', 'Athletic', 'Tall', 'Plus'].map((bt) => (
                      <button
                        key={bt}
                        onClick={() => update('body_type', bt)}
                        className={`py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                          form.body_type === bt
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {bt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={nextStep}
                className="w-full bg-black text-white py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* ── STEP: STYLE ── */}
          {currentStep === 'style' && (
            <>
              <p className="text-xs text-gray-500">
                This is your style fingerprint. Ash reads it before every recommendation.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Zodiac</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ZODIAC_SIGNS.map((z) => (
                      <button
                        key={z}
                        onClick={() => update('zodiac', z)}
                        className={`py-1.5 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                          form.zodiac === z
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Skin Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {SKIN_TONES.map((st) => (
                      <button
                        key={st}
                        onClick={() => update('skin_tone', st)}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-full border transition-all ${
                          form.skin_tone === st
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">
                    Style DNA <span className="text-gray-400 normal-case font-normal">(pick all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLE_DNA_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => toggleStyleDNA(s.id)}
                        className={`py-2.5 text-xs font-bold uppercase rounded-xl border transition-all ${
                          form.style_dna.includes(s.id)
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Saving...' : <><Sparkles size={14} /> Activate My FIT ID</>}
              </button>
            </>
          )}

          {/* ── STEP: DONE ── */}
          {currentStep === 'done' && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✦</div>
              <h3 className="text-xl font-bold mb-2">FIT ID Activated</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                {form.full_name
                  ? `${form.full_name.split(' ')[0]}, Ash now knows exactly how to dress you.`
                  : "Ash now knows exactly how to dress you."}
                {' '}Every recommendation from here is built for your body, your energy, your life.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-black text-white py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
              >
                Talk to Ash →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
