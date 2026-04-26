'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { generateTasks, PHASES, PLATFORM_COLORS } from '@/lib/tasks';

export default function Dashboard() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [url, setUrl] = useState('');
  const [tasks, setTasks] = useState([]);
  const [activePhase, setActivePhase] = useState(1);
  const [progress, setProgress] = useState({});
  const [expanded, setExpanded] = useState({});
  const [modal, setModal] = useState(null); // { contentType, label, content, streaming }
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  // ── Load product from sessionStorage ──────────────────────────
  useEffect(() => {
    const p = sessionStorage.getItem('ma_product');
    const u = sessionStorage.getItem('ma_url');
    if (!p) { router.push('/'); return; }
    const prod = JSON.parse(p);
    setProduct(prod);
    setUrl(u || '');
    const generatedTasks = generateTasks(prod, u || '');
    setTasks(generatedTasks);
    // Load saved progress
    const key = `ma_progress_${prod.productCode || btoa(u || '').substring(0, 8)}`;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    setProgress(saved);
  }, [router]);

  // ── Save progress ──────────────────────────────────────────────
  function saveProgress(newProgress) {
    if (!product) return;
    const key = `ma_progress_${product.productCode || btoa(url).substring(0, 8)}`;
    localStorage.setItem(key, JSON.stringify(newProgress));
  }

  function toggleComplete(taskId) {
    const next = { ...progress, [taskId]: !progress[taskId] };
    setProgress(next);
    saveProgress(next);
    showToast(next[taskId] ? '✓ Task marked complete!' : 'Task unmarked');
  }

  function toggleExpand(taskId) {
    setExpanded(e => ({ ...e, [taskId]: !e[taskId] }));
  }

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  }

  // ── Derived data ────────────────────────────────────────────────
  const phaseTasks = tasks.filter(t => t.phase === activePhase);
  const totalDone = tasks.filter(t => progress[t.id]).length;
  const totalPct = tasks.length ? Math.round((totalDone / tasks.length) * 100) : 0;

  // ── Content generator ────────────────────────────────────────────
  async function openGenerator(contentType, label) {
    setModal({ contentType, label, content: '', streaming: true });
    let fullContent = '';
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, url, contentType }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk') {
              fullContent += data.text;
              setModal(m => ({ ...m, content: fullContent, streaming: true }));
            }
            if (data.type === 'done') setModal(m => ({ ...m, streaming: false }));
            if (data.type === 'error') setModal(m => ({ ...m, streaming: false, content: `Error: ${data.error}` }));
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      setModal(m => ({ ...m, streaming: false, content: `Error: ${e.message}` }));
    }
  }

  function copyContent() {
    navigator.clipboard.writeText(modal?.content || '').then(() => showToast('✓ Copied to clipboard!'));
  }

  // ── Render helpers ────────────────────────────────────────────────
  function renderMarkdown(text) {
    return text
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
      .replace(/(<li>[\s\S]*?<\/li>)\n?(?=<li>|$)/g, '$1')
      .replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
      .replace(/\n{2,}/g, '</p><p>')
      .trim();
  }

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full spinner" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ── Header ── */}
      <header className="bg-slate-900 border-b-2 border-orange-500 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xs">MA</div>
            <div>
              <div className="text-white font-bold text-sm">Micron Aerosols</div>
              <div className="text-slate-400 text-xs">Digital Visibility Manager</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs hidden sm:block">{totalDone}/{tasks.length} tasks · {totalPct}%</span>
            <button
              onClick={() => router.push('/')}
              className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              ← New Product
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">

        {/* ── Product card ── */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 mb-5 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/[0.03] rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="relative">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              {product.series || product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mb-2 leading-tight">{product.productName}</h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-3xl">{product.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {[product.category, ...(product.industries || []).slice(0, 2), product.madeInIndia && '🇮🇳 Made in India'].filter(Boolean).map(t => (
                <span key={t} className="bg-white/10 border border-white/20 text-xs px-3 py-1 rounded-full">{t}</span>
              ))}
            </div>
            {product.primaryKeywords?.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Target Keywords</div>
                <div className="flex flex-wrap gap-1.5">
                  {[...product.primaryKeywords, ...(product.secondaryKeywords || []).slice(0, 2)].map(k => (
                    <code key={k} className="bg-white/10 text-slate-300 text-xs px-2 py-0.5 rounded">{k}</code>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Overall progress bar ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 shadow-sm">
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>Overall Progress</span>
            <span>{totalDone} of {tasks.length} tasks · {totalPct}%</span>
          </div>
          <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 to-green-500"
              style={{ width: `${totalPct}%` }}
            />
          </div>
        </div>

        {/* ── Phase tabs ── */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {PHASES.map(phase => {
            const count = tasks.filter(t => t.phase === phase.id).length;
            const done  = tasks.filter(t => t.phase === phase.id && progress[t.id]).length;
            const pct   = count ? Math.round((done / count) * 100) : 0;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                  activePhase === phase.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <span>{phase.icon}</span>
                <span className="hidden sm:inline">{phase.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${activePhase === phase.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {done}/{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Phase header ── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-700 text-sm">
            {PHASES.find(p => p.id === activePhase)?.icon} {PHASES.find(p => p.id === activePhase)?.label}
            <span className="text-slate-400 font-normal ml-2">— {phaseTasks.length} tasks</span>
          </h2>
          <span className="text-xs text-slate-400">
            {phaseTasks.filter(t => progress[t.id]).length}/{phaseTasks.length} done
          </span>
        </div>

        {/* ── Task cards ── */}
        <div className="flex flex-col gap-3">
          {phaseTasks.map(task => {
            const done = !!progress[task.id];
            const open = !!expanded[task.id];
            const platClass = PLATFORM_COLORS[task.platformKey] || 'bg-slate-100 text-slate-600';

            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border shadow-sm transition-all ${done ? 'border-green-300 bg-green-50/50' : 'border-slate-200 hover:shadow-md'}`}
              >
                {/* Task header row */}
                <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => toggleExpand(task.id)}>
                  {/* Checkbox */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleComplete(task.id); }}
                    className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all ${
                      done ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-green-400 bg-white'
                    }`}
                  >
                    {done && <span className="text-white text-xs font-bold">✓</span>}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${platClass}`}>
                        {task.platformIcon} {task.platform}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        task.difficulty === 'Beginner' ? 'bg-green-50 text-green-700' :
                        task.difficulty === 'Easy' ? 'bg-blue-50 text-blue-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>{task.difficulty}</span>
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{task.frequency}</span>
                      <span className="text-xs text-slate-400">⏱ {task.time}</span>
                    </div>
                    <div className={`font-bold text-sm mb-0.5 ${done ? 'text-green-700 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </div>
                    <div className="text-xs text-slate-500 leading-relaxed">{task.why}</div>
                  </div>

                  {/* Expand arrow */}
                  <div className="flex-shrink-0 text-slate-400 text-xs mt-1">
                    {open ? '▲' : '▼'}
                  </div>
                </div>

                {/* Expanded body */}
                {open && (
                  <div className="border-t border-slate-100">
                    {/* Steps */}
                    <div className="p-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                        Step-by-Step Instructions
                      </div>
                      <div className="flex flex-col gap-4">
                        {(task.steps || []).map((step, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              {step.title && <div className="font-semibold text-sm text-slate-800 mb-1">{step.title}</div>}
                              <div
                                className="text-sm text-slate-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: step.instruction.replace(/\n/g, '<br/>') }}
                              />
                              {step.note && (
                                <div className="mt-2 bg-yellow-50 border-l-3 border-yellow-400 pl-3 py-2 pr-2 rounded-r text-xs text-yellow-800 leading-relaxed">
                                  💡 <strong>Tip:</strong> {step.note}
                                </div>
                              )}
                              {step.warning && (
                                <div className="mt-2 bg-red-50 border-l-3 border-red-400 pl-3 py-2 pr-2 rounded-r text-xs text-red-800 leading-relaxed">
                                  ⚠️ <strong>Important:</strong> {step.warning}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer: resources + generate button */}
                    <div className="px-4 pb-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex flex-wrap gap-2">
                        {(task.resources || []).map(r => r.url !== '#' && (
                          <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-600 border border-slate-200 hover:border-blue-400 bg-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1">
                            🔗 {r.label}
                          </a>
                        ))}
                      </div>
                      {task.contentType && (
                        <button
                          onClick={() => openGenerator(task.contentType, task.generateLabel)}
                          className="bg-gradient-to-r from-purple-600 to-violet-600 hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5"
                        >
                          ✨ {task.generateLabel || 'Generate with AI'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Content Generator Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !modal.streaming && setModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{modal.label}</h3>
              {!modal.streaming && (
                <button onClick={() => setModal(null)} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 flex items-center justify-center text-sm transition-colors">✕</button>
              )}
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-5">
              {modal.streaming && !modal.content && (
                <div className="flex flex-col items-center gap-3 py-12">
                  <div className="w-10 h-10 border-3 border-slate-200 border-t-purple-600 rounded-full spinner" />
                  <p className="text-slate-500 text-sm">Claude AI is generating your content…</p>
                </div>
              )}
              {modal.content && (
                <div
                  className={`prose-content text-sm text-slate-700 leading-relaxed ${modal.streaming ? 'cursor' : ''}`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(modal.content) }}
                />
              )}
            </div>

            {/* Modal footer */}
            {!modal.streaming && modal.content && (
              <div className="p-4 border-t border-slate-100 flex gap-2 justify-end">
                <button onClick={copyContent} className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  📋 Copy All Content
                </button>
                <button onClick={() => setModal(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg transition-colors">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-lg z-50 whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
