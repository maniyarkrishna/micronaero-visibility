'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EXAMPLES = [
  { label: 'Protektor® Conformal Coating', url: 'https://www.micronaero.com/products/3100-protektor-conformal-coating' },
  { label: 'Silicon Mould Release', url: 'https://www.micronaero.com/products/1100-silicon-mould-release-agent' },
  { label: 'Silicon Anti Spatter', url: 'https://www.micronaero.com/products/2100-silicon-anti-spatter' },
];

const PLATFORMS = ['🔍 Google','📺 YouTube','📸 Instagram','🔷 LinkedIn','🤖 ChatGPT','💎 Gemini','🔬 Perplexity','🛒 IndiaMART','📘 Bing','💬 Quora'];

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const router = useRouter();

  const STEPS = ['🔍 Fetching product page…', '🧠 Extracting product intelligence…', '📋 Building visibility plan…'];

  async function analyze() {
    if (!url.trim()) { setError('Please enter a product URL'); return; }
    if (!url.includes('micronaero.com')) { setError('Please enter a URL from micronaero.com'); return; }
    setError('');
    setLoading(true);
    setStep(0);

    const timer = setInterval(() => setStep(s => Math.min(s + 1, 2)), 1200);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      clearInterval(timer);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Analysis failed'); }
      const data = await res.json();
      // Store in sessionStorage, navigate to dashboard
      sessionStorage.setItem('ma_product', JSON.stringify(data.product));
      sessionStorage.setItem('ma_url', url);
      router.push('/dashboard');
    } catch (e) {
      clearInterval(timer);
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b-2 border-orange-500 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-sm">MA</div>
            <div>
              <div className="text-white font-bold text-sm">Micron Aerosols</div>
              <div className="text-slate-400 text-xs">Digital Visibility Manager</div>
            </div>
          </div>
          <div className="text-slate-400 text-xs italic hidden sm:block">Global Standards. Imagined in India.</div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        {!loading ? (
          <>
            {/* Hero */}
            <div className="text-center mb-10">
              <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
                AI-Powered Visibility Engine
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-4">
                Get Your Product Found<br />Everywhere Online
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Enter any product URL from micronaero.com and get a complete, actionable
                plan — step-by-step tasks covering every platform where buyers search.
              </p>
            </div>

            {/* Input card */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-7 max-w-2xl mx-auto shadow-md mb-8">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Paste your product page URL
              </label>
              <div className={`flex items-center gap-2 bg-slate-50 border-2 rounded-lg px-3 py-1 mb-4 transition-colors ${error ? 'border-red-400' : 'border-slate-200 focus-within:border-blue-500 focus-within:bg-white'}`}>
                <span className="text-lg">🔗</span>
                <input
                  type="url"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && analyze()}
                  placeholder="https://www.micronaero.com/products/your-product"
                  className="flex-1 bg-transparent outline-none py-2.5 text-sm text-slate-800 placeholder-slate-400"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-3">⚠️ {error}</p>}
              <button
                onClick={analyze}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-lg text-base transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 mb-4"
              >
                Analyze Product & Generate Plan →
              </button>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">Examples:</span>
                {EXAMPLES.map(ex => (
                  <button
                    key={ex.url}
                    onClick={() => { setUrl(ex.url); setError(''); }}
                    className="text-xs text-blue-600 border border-slate-200 hover:border-blue-400 hover:bg-slate-50 px-2.5 py-1 rounded-full transition-all"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {PLATFORMS.map(p => (
                <span key={p} className="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">{p}</span>
              ))}
            </div>

            {/* Feature grid */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { icon: '📋', title: '80+ Actionable Tasks', desc: 'Every task written for a complete beginner — what to click, what to type, exactly where to go.' },
                { icon: '✨', title: 'AI Content Generator', desc: 'Generate blog posts, YouTube scripts, Instagram captions, IndiaMART listings instantly.' },
                { icon: '📊', title: 'Track Your Progress', desc: 'Check off tasks as you complete them. Progress is saved automatically in your browser.' },
              ].map(f => (
                <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="font-bold text-slate-800 text-sm mb-1">{f.title}</div>
                  <div className="text-slate-500 text-xs leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Loading state */
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="w-14 h-14 border-4 border-slate-200 border-t-blue-600 rounded-full spinner" />
            <h2 className="text-xl font-bold text-slate-700">Analyzing your product…</h2>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {STEPS.map((s, i) => (
                <div key={s} className={`text-sm px-4 py-2.5 rounded-lg transition-all duration-500 ${
                  i < step ? 'text-green-600 bg-green-50' :
                  i === step ? 'text-blue-600 bg-blue-50 font-semibold' :
                  'text-slate-400'
                }`}>
                  {i < step ? '✓ ' : i === step ? '⟳ ' : '○ '}{s}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
