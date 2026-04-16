import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Mail, Pencil, Check, X } from 'lucide-react'
import { CPrimeLogo } from '../common/CPrimeLogo'

// Per-template editable state hook
function useTemplateState(defaultSubject, defaultGreeting, defaultBody) {
  const [subject,  setSubject]  = useState(defaultSubject)
  const [greeting, setGreeting] = useState(defaultGreeting)
  const [body,     setBody]     = useState(defaultBody)
  const [editing,  setEditing]  = useState(false)

  const [draftSubject,  setDraftSubject]  = useState('')
  const [draftGreeting, setDraftGreeting] = useState('')
  const [draftBody,     setDraftBody]     = useState('')

  function startEdit() {
    setDraftSubject(subject)
    setDraftGreeting(greeting)
    setDraftBody(body)
    setEditing(true)
  }
  function save() {
    setSubject(draftSubject)
    setGreeting(draftGreeting)
    setBody(draftBody)
    setEditing(false)
  }
  function cancel() { setEditing(false) }

  return {
    subject, greeting, body, editing,
    draft: { subject: draftSubject, greeting: draftGreeting, body: draftBody },
    setDraft: { subject: setDraftSubject, greeting: setDraftGreeting, body: setDraftBody },
    startEdit, save, cancel,
  }
}

function TemplateEditor({ t, label, questionSlot }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Accent bar */}
      <div className="h-1.5 bg-gradient-neon" />

      {/* Edit/Save bar */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-body">{label} Template</span>
        <div className="flex gap-2">
          {t.editing ? (
            <>
              <button onClick={t.save} className="flex items-center gap-1.5 text-xs font-body font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                <Check size={13} /> Save
              </button>
              <button onClick={t.cancel} className="flex items-center gap-1.5 text-xs font-body text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                <X size={13} /> Cancel
              </button>
            </>
          ) : (
            <button onClick={t.startEdit} className="flex items-center gap-1.5 text-xs font-body font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
              <Pencil size={13} /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 space-y-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white border border-gray-200 rounded-[2px]">
            <CPrimeLogo size="sm" showText={false} link={false} />
          </div>
          <div>
            <p className="font-display font-semibold text-gray-600 text-sm">CPRIME</p>
            <p className="text-xs text-gray-400 font-body">Customer Feedback</p>
          </div>
        </div>

        {/* Greeting */}
        {t.editing ? (
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 font-display text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white"
            value={t.draft.greeting}
            onChange={(e) => t.setDraft.greeting(e.target.value)}
          />
        ) : (
          <h2 className="font-display text-xl font-semibold text-gray-900">{t.greeting}</h2>
        )}

        {/* Body */}
        {t.editing ? (
          <textarea
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-600 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white resize-none leading-relaxed"
            value={t.draft.body}
            onChange={(e) => t.setDraft.body(e.target.value)}
          />
        ) : (
          <p className="text-sm text-gray-600 font-body leading-relaxed">{t.body}</p>
        )}

        {/* Survey question (slot) */}
        {questionSlot}

        {/* Comments box */}
        <div>
          <p className="text-xs font-body font-medium text-gray-600 mb-1.5">Any additional comments?</p>
          <div className="w-full h-16 border border-gray-200 rounded-xl bg-white" />
        </div>

        {/* CTA */}
        <div>
          <div className="inline-block px-6 py-2.5 bg-gradient-neon rounded-xl text-black font-semibold font-body text-sm shadow-neon cursor-default">
            Submit Feedback
          </div>
        </div>

        <p className="text-[10px] text-gray-400 font-body text-center pt-2 border-t border-gray-100">
          You received this email because you are a client of CPRIME Analytics.{' '}
          <span className="underline cursor-pointer">Unsubscribe</span> · <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}

const NpsQuestion = () => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-sm font-body font-semibold text-gray-800 mb-3">
      How likely are you to recommend us to a friend or colleague?
    </p>
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: 11 }, (_, i) => (
        <div key={i} className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-bold font-body transition-colors ${
          i >= 9 ? 'border-teal text-teal' : i >= 7 ? 'border-neon/80 text-yellow-700' : 'border-rose-200 text-rose-400'
        }`}>{i}</div>
      ))}
    </div>
    <div className="flex justify-between mt-2">
      <span className="text-[10px] text-gray-400 font-body">Not likely</span>
      <span className="text-[10px] text-gray-400 font-body">Extremely likely</span>
    </div>
  </div>
)

const CsatQuestion = () => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-sm font-body font-semibold text-gray-800 mb-3">
      Overall, how satisfied are you with our service?
    </p>
    <div className="flex gap-3 flex-wrap">
      {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
        <button key={i} className="flex flex-col items-center gap-1 group">
          <span className="text-2xl group-hover:scale-125 transition-transform">{emoji}</span>
          <span className="text-xs text-gray-400 font-body">{i + 1}</span>
        </button>
      ))}
    </div>
    <div className="flex justify-between mt-2">
      <span className="text-[10px] text-gray-400 font-body">Very dissatisfied</span>
      <span className="text-[10px] text-gray-400 font-body">Very satisfied</span>
    </div>
  </div>
)

export function EmailPreviewModal({ isOpen, onClose, client }) {
  const [activeTab, setActiveTab] = useState('nps')

  const firstName  = client?.name.split(' ')[0] ?? ''
  const company    = client?.company ?? ''

  const nps  = useTemplateState(
    `We'd love your feedback, ${firstName}!`,
    `Hi ${firstName}, how are we doing?`,
    `Thank you for being a valued client at ${company}. We're always looking to improve our service, and your feedback means everything to us.`
  )
  const csat = useTemplateState(
    `Share your satisfaction, ${firstName}!`,
    `Hi ${firstName}, how satisfied are you?`,
    `We value your opinion at ${company}. A quick rating from you helps us maintain the quality you deserve.`
  )

  if (!client) return null

  function handleClose() {
    nps.cancel(); csat.cancel()
    onClose()
  }

  const tabs = [
    { id: 'nps',  label: 'NPS Template' },
    { id: 'csat', label: 'CSAT Template' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Email Preview" size="lg">
      <div className="space-y-4">
        {/* To / Subject (shared, shows active tab's subject) */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm font-body">
          <div className="flex gap-3">
            <span className="text-gray-400 w-14 shrink-0">To:</span>
            <span className="text-gray-700 font-medium truncate">{client.name} &lt;{client.email}&gt;</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-gray-400 w-14 shrink-0">Subject:</span>
            {activeTab === 'nps' ? (
              nps.editing ? (
                <input className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white min-w-0" value={nps.draft.subject} onChange={(e) => nps.setDraft.subject(e.target.value)} />
              ) : (
                <span className="text-gray-700 truncate">{nps.subject}</span>
              )
            ) : (
              csat.editing ? (
                <input className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white min-w-0" value={csat.draft.subject} onChange={(e) => csat.setDraft.subject(e.target.value)} />
              ) : (
                <span className="text-gray-700 truncate">{csat.subject}</span>
              )
            )}
          </div>
        </div>

        {/* Template tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-[2px] border border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm font-semibold font-body rounded-[2px] transition-all duration-200 ${
                activeTab === tab.id ? 'bg-gray-900 text-neon shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Template body */}
        {activeTab === 'nps' ? (
          <TemplateEditor t={nps} label="NPS" questionSlot={<NpsQuestion />} />
        ) : (
          <TemplateEditor t={csat} label="CSAT" questionSlot={<CsatQuestion />} />
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="primary" icon={<Mail size={16} />} className="flex-1 justify-center">
            Send {activeTab.toUpperCase()} Email
          </Button>
          <Button variant="secondary" onClick={handleClose} className="flex-1 justify-center">
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  )
}
