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

function TemplateEditor({ t, label }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Accent bar */}
      <div className="h-1.5 bg-gradient-neon" />

      {/* Edit/Save bar */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-body">{label} Reminder</span>
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

        {/* CTA */}
        <div>
          <div className="inline-block px-6 py-2.5 bg-gradient-neon rounded-xl text-black font-semibold font-body text-sm shadow-neon cursor-default">
            Take Survey
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

export function ReminderEmailModal({ isOpen, onClose, client, surveyType = 'nps' }) {
  const firstName  = client?.name.split(' ')[0] ?? ''
  const company    = client?.company ?? ''

  const reminder = useTemplateState(
    `Don't forget to complete your feedback!`,
    `Hi ${firstName}, just a friendly reminder`,
    `We noticed you haven't completed your survey yet. Your feedback is valuable to us and takes just a few minutes. Please click below to share your thoughts about your experience with ${company}.`
  )

  if (!client) return null

  function handleClose() {
    reminder.cancel()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reminder Email" size="lg">
      <div className="space-y-4">
        {/* To / Subject (shared) */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm font-body">
          <div className="flex gap-3">
            <span className="text-gray-400 w-14 shrink-0">To:</span>
            <span className="text-gray-700 font-medium truncate">{client.name} &lt;{client.email}&gt;</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-gray-400 w-14 shrink-0">Subject:</span>
            {reminder.editing ? (
              <input className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white min-w-0" value={reminder.draft.subject} onChange={(e) => reminder.setDraft.subject(e.target.value)} />
            ) : (
              <span className="text-gray-700 truncate">{reminder.subject}</span>
            )}
          </div>
        </div>

        {/* Template body - no survey questions */}
        <TemplateEditor t={reminder} label={surveyType.toUpperCase()} />

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="primary" icon={<Mail size={16} />} className="flex-1 justify-center">
            Send Reminder
          </Button>
          <Button variant="secondary" onClick={handleClose} className="flex-1 justify-center">
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  )
}
