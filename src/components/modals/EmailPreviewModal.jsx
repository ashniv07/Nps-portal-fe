import { Mail } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { CPrimeLogo } from '../common/CPrimeLogo'

export function EmailPreviewModal({ isOpen, onClose, client, surveyType = 'nps' }) {
  const firstName  = client?.name.split(' ')[0] ?? ''
  const company    = client?.company ?? ''
  const isNps = surveyType === 'nps'

  const subject = isNps 
    ? `We'd love your feedback, ${firstName}!`
    : `Share your satisfaction, ${firstName}!`

  const greeting = isNps
    ? `Hi ${firstName}, how are we doing?`
    : `Hi ${firstName}, how satisfied are you?`

  const body = isNps
    ? `Thank you for being a valued client at ${company}. We're always looking to improve our service, and your feedback means everything to us.`
    : `We value your opinion at ${company}. A quick rating from you helps us maintain the quality you deserve.`

  if (!client) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Preview" size="lg">
      <div className="space-y-4">
        {/* To / Subject */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm font-body">
          <div className="flex gap-3">
            <span className="text-gray-400 w-14 shrink-0">To:</span>
            <span className="text-gray-700 font-medium truncate">{client.name} &lt;{client.email}&gt;</span>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-gray-400 w-14 shrink-0">Subject:</span>
            <span className="text-gray-700">{subject}</span>
          </div>
        </div>

        {/* Email Preview */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          {/* Accent bar */}
          <div className="h-1.5 bg-gradient-neon" />

          <div className="px-6 py-6 space-y-4">
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
            <h2 className="font-display text-xl font-semibold text-gray-900">{greeting}</h2>

            {/* Body */}
            <p className="text-sm text-gray-600 font-body leading-relaxed">{body}</p>

            {/* Magic Link Button */}
            <div className="my-6">
              <div className={`inline-block px-6 py-2.5 rounded-xl text-white font-semibold font-body text-sm shadow-lg ${
                isNps ? 'bg-teal hover:opacity-90' : 'bg-amber-500 hover:opacity-90'
              } transition-opacity cursor-default`}>
                Take {isNps ? 'NPS' : 'CSAT'} Survey
              </div>
              <p className="text-xs text-gray-400 font-body mt-2">
                This link expires in 30 days
              </p>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-400 font-body text-center pt-4 border-t border-gray-100">
              You received this email because you are a client of CPRIME Analytics.{' '}
              <span className="underline cursor-pointer">Unsubscribe</span> · <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="primary" icon={<Mail size={16} />} className="flex-1 justify-center">
            Send Email
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1 justify-center">
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  )
}
