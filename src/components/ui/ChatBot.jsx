import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react'

const WELCOME = "Hi! I'm your CPRIME AI Assistant. Ask me about NPS scores, survey campaigns, client insights, or open issues."

const FAQS = ["What's our NPS?", "Any at-risk clients?", "Open issues?"]

const KB = [
  { kw: ['nps','score','promoter','detractor','pts'],
    reply: "Your NPS is 72 — Excellent, top 15% in the industry. You gained +8 pts this quarter. Breakdown: 58% Promoters · 28% Passives · 14% Detractors." },
  { kw: ['csat','satisfaction','star','rating'],
    reply: "CSAT is 4.3/5 with 86% of clients rating 4–5 stars — up +3% vs last quarter. Primary drivers: platform usability and analytics quality." },
  { kw: ['survey','send','campaign','schedule'],
    reply: "1,847 surveys sent · 69.5% response rate (above 50% industry avg). Latest active campaign: April 2024 Wave. Q1 2024 Campaign completed with 71 NPS." },
  { kw: ['client','account','risk','churn','at-risk'],
    reply: "312 active clients. At-risk: Global Bank Ltd (onboarding friction) and Retail Plus (billing confusion). Top promoters: TechCorp Solutions, Creative Studio, Pacific CX Group." },
  { kw: ['action','issue','tracker','open','pending','task'],
    reply: "Issue Tracker: 2 Open · 2 In Progress · 2 Resolved. Top priority: 'Schedule onboarding review with Global Bank Ltd' — High, due Apr 1." },
  { kw: ['history','past','q1','q4','year','yoy'],
    reply: "YoY improvement: +13 pts NPS since Q4 2023. Best quarter: Q4 2024 at NPS 72. Q1 2024 Campaign: NPS 71, 81% response rate." },
  { kw: ['india','uk','australia','ukraine','region','map'],
    reply: "Top regions by NPS: Australia (Pacific CX Group, NPS 9.0), USA (TechCorp 9.0), India (Tata CX 8.5), UK (Global Bank Ltd, improving +8 YoY)." },
]

function getReply(msg) {
  const lower = msg.toLowerCase()
  for (const { kw, reply } of KB) {
    if (kw.some(k => lower.includes(k))) return reply
  }
  return "I can help with NPS analytics, CSAT, survey campaigns, client insights, and issue tracking. Try asking about your NPS score or at-risk clients!"
}

export function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [msgs, setMsgs]       = useState([{ id: 1, from: 'bot', text: WELCOME }])
  const [input, setInput]     = useState('')
  const [thinking, setThink]  = useState(false)
  const bottomRef             = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, thinking])

  const send = (text) => {
    const t = text.trim()
    if (!t) return
    setMsgs(p => [...p, { id: Date.now(), from: 'user', text: t }])
    setInput('')
    setThink(true)
    setTimeout(() => {
      setMsgs(p => [...p, { id: Date.now() + 1, from: 'bot', text: getReply(t) }])
      setThink(false)
    }, 600 + Math.random() * 500)
  }

  const showFaqs = msgs.length === 1

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            style={{ height: 480 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neon/20 flex items-center justify-center">
                  <Sparkles size={14} className="text-neon" />
                </div>
                <div>
                  <p className="text-sm font-display font-semibold text-white leading-none">CPRIME AI</p>
                  <p className="text-[10px] text-emerald-400 font-body mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {msgs.map(m => (
                <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {m.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={11} className="text-gray-500" />
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm font-body leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-gray-900 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {thinking && (
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Bot size={11} className="text-gray-500" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.13, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            {showFaqs && (
              <div className="px-4 pb-2 flex gap-1.5 flex-wrap shrink-0">
                {FAQS.map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-body hover:bg-neon/10 hover:border-neon/30 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 flex gap-2 shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
                placeholder="Ask about NPS, surveys, clients..."
                className="flex-1 text-sm font-body border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/50 bg-gray-50 transition-all"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || thinking}
                className="w-8 h-8 rounded-xl bg-gray-900 text-neon flex items-center justify-center hover:bg-gray-800 disabled:opacity-40 transition-colors shrink-0 self-center"
              >
                <Send size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <div className="relative">
        <motion.button
          onClick={() => setOpen(p => !p)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors ${
            open ? 'bg-gray-700' : 'bg-gray-900'
          }`}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x"
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.14 }}
              >
                <X size={21} className="text-white" />
              </motion.span>
            ) : (
              <motion.span key="chat"
                initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.14 }}
              >
                <MessageCircle size={21} className="text-neon" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Pulse ring when closed */}
        {!open && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-neon flex items-center justify-center"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[8px] font-bold text-black">AI</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
