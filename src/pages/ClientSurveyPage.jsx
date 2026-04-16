import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Star, ThumbsUp, ThumbsDown, CheckCircle2, LogOut, ArrowRight } from 'lucide-react'
import { CPrimeLogo } from '../components/common/CPrimeLogo'

const surveyQuestions = [
  {
    id: 1,
    type: 'nps',
    question: 'How likely are you to recommend our product to a friend or colleague?',
    subtitle: 'On a scale of 0 to 10',
  },
  {
    id: 2,
    type: 'text',
    question: 'What is the main reason for your score?',
    placeholder: 'Share your thoughts...',
  }, 
  {
    id: 3,
    type: 'csat',
    question: 'How satisfied are you with our customer service?',
    subtitle: 'Rate your experience',
  },
  {
    id: 4,
    type: 'text',
    question: 'What could we improve?',
    placeholder: 'Any suggestions...',
  },
]

function Message({ message, isBot }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isBot
            ? 'bg-gray-100 text-gray-900 rounded-bl-none'
            : 'bg-neon text-black rounded-br-none'
        }`}
      >
        <p className="text-sm font-body leading-relaxed">{message}</p>
      </div>
    </motion.div>
  )
}

function NPSRating({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-1 flex-wrap"
    >
      {Array.from({ length: 11 }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-150 ${
            value === i
              ? 'bg-neon text-black shadow-lg scale-110'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      ))}
    </motion.div>
  )
}

function CSATRating({ value, onChange }) {
  const ratings = [
    { value: 1, icon: ThumbsDown, label: 'Unsatisfied', color: 'text-red-500' },
    { value: 2, icon: ThumbsDown, label: 'Dissatisfied', color: 'text-orange-500' },
    { value: 3, icon: Star, label: 'Neutral', color: 'text-yellow-500' },
    { value: 4, icon: ThumbsUp, label: 'Satisfied', color: 'text-blue-500' },
    { value: 5, icon: ThumbsUp, label: 'Very Satisfied', color: 'text-emerald-500' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      {ratings.map(({ value: v, icon: Icon, label, color }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-150 ${
            value === v
              ? 'bg-neon/20 border-neon'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <Icon size={20} className={color} />
          <span className="text-sm font-body font-medium">{label}</span>
        </button>
      ))}
    </motion.div>
  )
}

export default function ClientSurveyPage() {
  const [surveyStarted, setSurveyStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [messages, setMessages] = useState([])
  const [answers, setAnswers] = useState({})
  const [textInput, setTextInput] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const messagesEndRef = useRef(null)

  function startSurvey() {
    setSurveyStarted(true)
    setMessages([
      {
        text: "Hello! 👋 Thanks for taking the time to share your feedback with us. Your insights help us improve. Let's get started!",
        isBot: true,
      },
      {
        text: surveyQuestions[0].question,
        isBot: true,
      },
    ])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const currentQuestion = surveyQuestions[currentQuestionIndex]

  function handleAnswer(answer) {
    const newAnswers = { ...answers, [currentQuestion.id]: answer }
    setAnswers(newAnswers)

    let responseText = ''
    if (currentQuestion.type === 'nps') {
      if (answer >= 9) {
        responseText = `Great! ${answer}/10 – That's wonderful to hear! 🎉`
      } else if (answer >= 7) {
        responseText = `Good score – ${answer}/10. We appreciate your support!`
      } else {
        responseText = `Thanks for your honesty – ${answer}/10. We'll work on improving.`
      }
    } else if (currentQuestion.type === 'csat') {
      const labels = {
        1: 'Unsatisfied',
        2: 'Dissatisfied',
        3: 'Neutral',
        4: 'Satisfied',
        5: 'Very Satisfied',
      }
      responseText = `Thank you for rating us ${labels[answer]}! 😊`
    } else {
      responseText = `Got it: "${answer}". That's helpful feedback!`
    }

    setMessages((prev) => [...prev, { text: responseText, isBot: true }])

    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setMessages((prev) => [
          ...prev,
          {
            text: surveyQuestions[currentQuestionIndex + 1].question,
            isBot: true,
          },
        ])
        setTextInput('')
      }, 1200)
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: '🎉 Thank you so much for completing the survey! Your feedback is valuable to us. Have a great day!',
            isBot: true,
          },
        ])
        setIsCompleted(true)
      }, 1200)
    }
  }

  function handleTextSubmit(e) {
    e.preventDefault()
    if (!textInput.trim()) return

    setMessages((prev) => [...prev, { text: textInput, isBot: false }])
    handleAnswer(textInput)
  }

  function handleLogout() {
    localStorage.removeItem('cprime_role')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <CPrimeLogo size="sm" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-body text-gray-600 hover:text-gray-900 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      {/* Survey Intro Screen */}
      {!surveyStarted ? (
        <div className="flex-1 flex items-center justify-center px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 space-y-6"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon to-yellow-300 flex items-center justify-center mx-auto">
              <Star size={32} className="text-gray-900" />
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 font-display">
                Your Feedback Matters
              </h1>
              <p className="text-sm text-gray-600 font-body">
                Help us serve you better by sharing your experience
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-neon flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-900">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">4 Quick Questions</p>
                  <p className="text-xs text-gray-600">Takes about 2-3 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-neon flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-900">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Easy & Interactive</p>
                  <p className="text-xs text-gray-600">Chat-based format with ratings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-neon flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-900">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Confidential</p>
                  <p className="text-xs text-gray-600">Your responses are private</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={startSurvey}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon to-yellow-300 text-gray-900 text-sm font-bold hover:shadow-lg active:scale-[0.98] transition-all duration-150 uppercase tracking-wider font-body"
            >
              Start Survey
              <ArrowRight size={18} />
            </button>

            {/* Skip Link */}
            <button
              onClick={handleLogout}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors font-body"
            >
              Skip for now
            </button>
          </motion.div>
        </div>
      ) : (
        <>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-4">
          <AnimatePresence mode="wait">
            {messages.map((message, idx) => (
              <Message key={idx} message={message.text} isBot={message.isBot} />
            ))}
          </AnimatePresence>

          {/* Question Rendering Area */}
          {!isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 md:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
              {currentQuestion.type === 'nps' && (
                <NPSRating
                  value={answers[currentQuestion.id]}
                  onChange={(val) => handleAnswer(val)}
                />
              )}

              {currentQuestion.type === 'csat' && (
                <CSATRating
                  value={answers[currentQuestion.id]}
                  onChange={(val) => handleAnswer(val)}
                />
              )}

              {currentQuestion.type === 'text' && (
                <form onSubmit={handleTextSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-neon/40 focus:border-neon transition-all placeholder:text-gray-400 font-body text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neon text-black text-sm font-semibold hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-body"
                  >
                    Continue
                    <Send size={16} />
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {/* Completion Screen */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-8 md:p-12 bg-gradient-to-br from-neon/20 to-yellow-200/20 rounded-2xl border-2 border-neon text-center space-y-4"
            >
              <CheckCircle2 size={48} className="text-neon mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900 font-display">
                Survey Complete!
              </h2>
              <p className="text-gray-600 font-body">
                Your responses have been recorded and will help us serve you better.
              </p>
              <button
                onClick={handleLogout}
                className="mx-auto block px-6 py-2 rounded-lg bg-neon text-black font-semibold hover:brightness-95 transition-all font-body text-sm"
              >
                Close & Logout
              </button>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="px-4 md:px-8 py-4 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-body text-gray-500">
                Question {currentQuestionIndex + 1} of {surveyQuestions.length}
              </p>
              <p className="text-xs font-body font-semibold text-neon">
                {Math.round(((currentQuestionIndex + 1) / surveyQuestions.length) * 100)}%
              </p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestionIndex + 1) / surveyQuestions.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-neon to-yellow-300"
              />
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  )
}
