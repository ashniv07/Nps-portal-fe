import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Copy, Palette, Pencil, Check, X } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

// ─── Template Editor ──────────────────────────────────────────────────────────
function TemplateEditor({ type, template, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(template)

  function startEdit() {
    setDraft(template)
    setEditing(true)
  }

  function save() {
    onUpdate(draft)
    setEditing(false)
  }

  function cancel() {
    setEditing(false)
  }

  const isNps = type === 'nps'

  return (
    <Card hover={false}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNps ? 'bg-teal/15' : 'bg-amber-100'}`}>
              <Palette size={14} className={isNps ? 'text-teal' : 'text-amber-700'} />
            </div>
            <div>
              <h2 className="font-display font-semibold text-gray-900">{isNps ? 'NPS' : 'CSAT'} Survey Template</h2>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                Customize the survey page clients see when they click the magic link
              </p>
            </div>
          </div>
          {!editing && (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 text-xs font-body font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Pencil size={13} /> Edit
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="border-t border-gray-50">
        {editing ? (
          <div className="space-y-4 pt-4">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold font-body text-gray-600 uppercase tracking-wider mb-2 block">
                Survey Title
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold font-body text-gray-600 uppercase tracking-wider mb-2 block">
                Description
              </label>
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white resize-none"
              />
            </div>

            {/* Intro Message */}
            <div>
              <label className="text-xs font-semibold font-body text-gray-600 uppercase tracking-wider mb-2 block">
                Intro Message
              </label>
              <textarea
                rows={2}
                value={draft.introMessage}
                onChange={(e) => setDraft({ ...draft, introMessage: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white resize-none"
              />
            </div>

            {/* Thank You Message */}
            <div>
              <label className="text-xs font-semibold font-body text-gray-600 uppercase tracking-wider mb-2 block">
                Thank You Message
              </label>
              <textarea
                rows={2}
                value={draft.thankYouMessage}
                onChange={(e) => setDraft({ ...draft, thankYouMessage: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white resize-none"
              />
            </div>

            {/* Button Color */}
            <div>
              <label className="text-xs font-semibold font-body text-gray-600 uppercase tracking-wider mb-2 block">
                Button Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={draft.buttonColor}
                  onChange={(e) => setDraft({ ...draft, buttonColor: e.target.value })}
                  className="w-14 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <code className="text-xs font-mono text-gray-600 bg-gray-50 px-3 py-1.5 rounded">{draft.buttonColor}</code>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={save}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-body font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2.5 rounded-lg transition-colors"
              >
                <Check size={13} /> Save Template
              </button>
              <button
                onClick={cancel}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-body text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-lg transition-colors"
              >
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 space-y-3">
            <div>
              <p className="text-[10px] font-semibold font-body text-gray-400 uppercase tracking-wider mb-1">Title</p>
              <p className="text-sm font-body text-gray-700">{template.title}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold font-body text-gray-400 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm font-body text-gray-600 leading-relaxed">{template.description}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold font-body text-gray-400 uppercase tracking-wider mb-1">Intro Message</p>
              <p className="text-sm font-body text-gray-600 leading-relaxed">{template.introMessage}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold font-body text-gray-400 uppercase tracking-wider mb-1">Thank You Message</p>
              <p className="text-sm font-body text-gray-600 leading-relaxed">{template.thankYouMessage}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold font-body text-gray-400 uppercase tracking-wider mb-2">Button Color</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border-2 border-gray-200" style={{ backgroundColor: template.buttonColor }} />
                <code className="text-xs font-mono text-gray-600 bg-gray-50 px-3 py-1 rounded">{template.buttonColor}</code>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Preview Pane ───────────────────────────────────────────────────────────
function TemplatePreview({ type, template }) {
  const isNps = type === 'nps'

  return (
    <Card hover={false}>
      <CardHeader>
        <h2 className="font-display font-semibold text-gray-900">Preview</h2>
        <p className="text-xs text-gray-400 font-body mt-0.5">
          This is how clients will see your survey
        </p>
      </CardHeader>

      <CardContent className="border-t border-gray-50">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 min-h-96 flex flex-col items-center justify-center text-center">
          <div className="max-w-md w-full space-y-4">
            <h1 className="font-display text-2xl font-bold text-gray-900">{template.title}</h1>
            <p className="text-sm text-gray-600 font-body leading-relaxed">{template.description}</p>
            
            <div className="bg-white rounded-xl p-6 space-y-3 text-left my-6">
              <p className="text-sm font-body text-gray-700 leading-relaxed">{template.introMessage}</p>
              
              {isNps ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold font-body text-gray-600 mb-3">How likely are you to recommend us?</p>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {Array.from({ length: 11 }, (_, i) => (
                      <div key={i} className="w-7 h-7 rounded-lg border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold font-body text-gray-600 mb-3">Overall, how satisfied are you?</p>
                  <div className="flex gap-2 justify-center">
                    {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
                      <button key={i} className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-xs text-gray-400 font-body">{i + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              style={{ backgroundColor: template.buttonColor }}
              className="w-full py-2.5 rounded-lg text-white font-semibold font-body text-sm transition-opacity hover:opacity-90"
            >
              Submit
            </button>

            <p className="text-xs text-gray-500 font-body mt-4">{template.thankYouMessage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main TemplatesTab ───────────────────────────────────────────────────────
export function TemplatesTab() {
  const [filterMode, setFilterMode] = useState('nps')
  const isCsat = filterMode === 'csat'

  const [npsTemplate, setNpsTemplate] = useState({
    title: 'How are we doing?',
    description: 'Your feedback helps us improve our services and better serve you.',
    introMessage: 'We value your opinion. Take 2 minutes to share your experience.',
    thankYouMessage: 'Thank you for your feedback! Your response has been recorded.',
    buttonColor: '#CDDE33',
  })

  const [csatTemplate, setCsatTemplate] = useState({
    title: 'Share your satisfaction',
    description: 'Help us understand how satisfied you are with our service.',
    introMessage: 'A quick rating helps us maintain the quality you deserve.',
    thankYouMessage: 'We appreciate your feedback and will use it to improve.',
    buttonColor: '#14B8A6',
  })

  const currentTemplate = isCsat ? csatTemplate : npsTemplate

  function handleUpdate(updated) {
    if (isCsat) {
      setCsatTemplate(updated)
    } else {
      setNpsTemplate(updated)
    }
  }

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        
        {/* ── Header with Filter ──────────────────────────────────── */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-semibold text-gray-900 text-lg">Survey Templates</h1>
              <p className="text-xs text-gray-400 font-body mt-1">
                Customize the survey page templates for NPS and CSAT
              </p>
            </div>

            {/* NPS/CSAT Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilterMode('nps')}
                className={`px-4 py-2 rounded-md text-xs font-semibold font-body transition-all ${
                  filterMode === 'nps'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                NPS
              </button>
              <button
                onClick={() => setFilterMode('csat')}
                className={`px-4 py-2 rounded-md text-xs font-semibold font-body transition-all ${
                  filterMode === 'csat'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                CSAT
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Template Grid ──────────────────────────────────────── */}
        <motion.div variants={item}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <TemplateEditor
              type={filterMode}
              template={currentTemplate}
              onUpdate={handleUpdate}
            />

            {/* Preview */}
            <TemplatePreview
              type={filterMode}
              template={currentTemplate}
            />
          </div>
        </motion.div>

      </motion.div>
    </>
  )
}
