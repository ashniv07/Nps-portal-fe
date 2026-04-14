import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Mail, Pencil, Check, X } from 'lucide-react'
import { CPrimeLogo } from '../common/CPrimeLogo'

export function EmailPreviewModal({ isOpen, onClose, client, surveyType = 'nps' }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editSubject, setEditSubject] = useState('')
  const [editGreeting, setEditGreeting] = useState('')
  const [editBody, setEditBody] = useState('')

  if (!client) return null

  const defaultSubject = `We'd love your feedback, ${client.name.split(' ')[0]}!`
  const defaultGreeting = `Hi ${client.name.split(' ')[0]}, how are we doing?`
  const defaultBody = `Thank you for being a valued client at ${client.company}. We're always looking to improve our service, and your feedback means everything to us.`

  const subject = editSubject || defaultSubject
  const greeting = editGreeting || defaultGreeting
  const body = editBody || defaultBody

  const handleEdit = () => {
    setEditSubject(subject)
    setEditGreeting(greeting)
    setEditBody(body)
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleClose = () => {
    setIsEditing(false)
    setEditSubject('')
    setEditGreeting('')
    setEditBody('')
    onClose()
  }

  const isCsat = surveyType === 'csat'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Email Preview" size="lg">
      <div className="space-y-4">
        {/* Meta */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm font-body">
          <div className="flex gap-3">
            <span className="text-gray-400 w-14 shrink-0">To:</span>
            <span className="text-gray-700 font-medium">{client.name} &lt;{client.email}&gt;</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-gray-400 w-14 shrink-0">Subject:</span>
            {isEditing ? (
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
              />
            ) : (
              <span className="text-gray-700">{subject}</span>
            )}
          </div>
        </div>

        {/* Email body */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Header bar */}
          <div className="h-2 bg-gradient-neon" />

          {/* Edit / Save bar */}
          <div className="flex items-center justify-end px-5 pt-3 gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 text-xs font-body font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Check size={13} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 text-xs font-body text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <X size={13} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 text-xs font-body font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Pencil size={13} /> Edit Email
              </button>
            )}
          </div>

          <div className="px-6 pb-6 pt-3 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-gray-200 rounded-[2px]">
                <CPrimeLogo size="sm" showText={false} link={false} />
              </div>
              <div>
                <p className="font-display font-semibold text-gray-600">CPRIME</p>
                <p className="text-xs text-gray-400 font-body">Customer Feedback</p>
              </div>
            </div>

            <div>
              {isEditing ? (
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 font-display text-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white mb-2"
                  value={editGreeting}
                  onChange={(e) => setEditGreeting(e.target.value)}
                />
              ) : (
                <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                  {greeting}
                </h2>
              )}

              {isEditing ? (
                <textarea
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 bg-white resize-none"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600 font-body leading-relaxed">
                  {body}
                </p>
              )}
            </div>

            {/* Single question based on survey type */}
            {isCsat ? (
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-sm font-body font-semibold text-gray-800 mb-3">
                  Overall, how satisfied are you with our service?
                </p>
                <div className="flex gap-4">
                  {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
                    <button key={i} className="flex flex-col items-center gap-1.5 group">
                      <span className="text-3xl group-hover:scale-125 transition-transform">{emoji}</span>
                      <span className="text-xs text-gray-400 font-body">{i + 1}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-[11px] text-gray-400 font-body">Very dissatisfied</span>
                  <span className="text-[11px] text-gray-400 font-body">Very satisfied</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-sm font-body font-semibold text-gray-800 mb-4">
                  How likely are you to recommend us to a friend or colleague?
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-sm font-bold font-body transition-colors ${
                        i >= 9 ? 'border-teal text-teal' : i >= 7 ? 'border-neon/80 text-yellow-700' : 'border-rose-200 text-rose-400'
                      }`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[11px] text-gray-400 font-body">Not likely</span>
                  <span className="text-[11px] text-gray-400 font-body">Extremely likely</span>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-body font-medium text-gray-600 mb-2">
                Any additional comments?
              </p>
              <div className="w-full h-20 border border-gray-200 rounded-xl bg-white" />
            </div>

            <div className="pt-2">
              <div className="inline-block px-8 py-3 bg-gradient-neon rounded-xl text-black font-semibold font-body text-sm shadow-neon cursor-default">
                Submit Feedback
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-body text-center pt-2 border-t border-gray-100">
              You received this email because you are a client of CPRIME Analytics.<br />
              <span className="underline cursor-pointer">Unsubscribe</span> · <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="primary" icon={<Mail size={16} />} className="flex-1 justify-center">
            Send Now
          </Button>
          <Button variant="secondary" onClick={handleClose} className="flex-1 justify-center">
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  )
}
