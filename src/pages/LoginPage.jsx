import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff, BarChart2, Lightbulb, Users } from 'lucide-react'
import { CPrimeLogo } from '../components/common/CPrimeLogo'

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.08 + i * 0.06, duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  }),
}

const ROLES = [
  { id: 'admin',      label: 'Admin' },
  { id: 'leadership', label: 'Leadership' },
]

const features = [
  { icon: BarChart2, color: 'bg-neon',     title: 'Real-time Analytics',  body: 'Monitor NPS & CSAT trends live as they happen across all clients.' },
  { icon: Lightbulb, color: 'bg-lemon',   title: 'Actionable Insights',   body: 'Detailed segmentation to identify exactly where to improve.' },
  { icon: Users,     color: 'bg-orange-1', title: 'Team Collaboration',   body: 'Share reports and act on feedback across departments.' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole]                 = useState('admin')
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) { setError('Please complete all required fields.'); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('cprime_role', role)
      setLoading(false)
      navigate('/dashboard')
    }, 900)
  }

  return (
    /* Root: full viewport, side-by-side on lg+ */
    <div className="min-h-screen w-full flex flex-col lg:flex-row">

      {/* ── LEFT PANEL ── hidden below lg ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 shrink-0 relative overflow-hidden
                      bg-gradient-to-br from-turquoise-1 via-turquoise-2 to-turquoise-1
                      flex-col justify-between px-10 xl:px-16 py-12 xl:py-16">

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full gap-10">

          {/* Title */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-neon font-body mb-3">
              CPRIME PULSE SURVEY
            </p>
            <h2 className="font-display font-bold text-white text-3xl xl:text-5xl leading-[1.15]">
              Turn Feedback<br />Into Growth.
            </h2>
            <p className="text-white/70 font-body text-sm xl:text-base mt-4 leading-relaxed max-w-xs">
              Measure, understand, and act on what your clients really think — in one unified platform.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-5 xl:gap-7 flex-1 justify-center">
            {features.map(({ icon: Icon, color, title, body }) => (
              <div key={title} className="flex gap-3 xl:gap-4 items-start">
                <div className={`w-8 h-8 xl:w-10 xl:h-10 rounded-xl ${color} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={15} className="text-black" />
                </div>
                <div>
                  <h3 className="text-sm xl:text-base font-semibold text-white font-body mb-0.5">{title}</h3>
                  <p className="text-white/60 text-xs xl:text-sm font-body leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="pt-6 border-t border-white/20 flex gap-8 xl:gap-12">
            <div>
              <p className="text-3xl xl:text-4xl font-bold text-neon font-display">500+</p>
              <p className="text-xs xl:text-sm text-white/60 font-body mt-1">Companies using CPRIME</p>
            </div>
            <div>
              <p className="text-3xl xl:text-4xl font-bold text-lemon font-display">2M+</p>
              <p className="text-xs xl:text-sm text-white/60 font-body mt-1">Surveys analyzed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── full screen on mobile, 55%/50% on desktop ─ */}
      <div className="flex-1 flex flex-col bg-white min-h-screen lg:min-h-0">

        {/* Top bar: logo */}
        <div className="flex items-center justify-between px-6 sm:px-10 pt-6 sm:pt-8 shrink-0">
          {/* Mobile brand name */}
          <span className="lg:hidden font-display font-bold text-gray-900 text-lg tracking-tight">CPRIME</span>
          <div className="ml-auto">
            <CPrimeLogo />
          </div>
        </div>

        {/* Form area — grows to fill, centres content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-[360px]">

            {/* Heading */}
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="show" className="mb-7">
              <h1 className="font-display font-bold text-gray-900 text-3xl sm:text-4xl leading-tight mb-2">
                Welcome back
              </h1>
              <p className="text-gray-400 font-body text-sm sm:text-base">
                Sign in to access your dashboard
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Role toggle */}
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="show">
                <label className="text-[11px] text-gray-500 uppercase tracking-wider block mb-2 font-semibold font-body">
                  Sign in as
                </label>
                <div className="flex bg-gray-100 rounded-[2px] p-1.5 gap-1.5 border border-gray-200">
                  {ROLES.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setRole(id)}
                      className={`flex-1 py-2.5 rounded-[2px] text-sm font-semibold font-body transition-all duration-200 ${
                        role === id ? 'bg-gray-800 text-neon shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Email */}
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="show">
                <label className="text-[11px] text-gray-500 uppercase tracking-wider block mb-2 font-semibold font-body">
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    className="w-full h-11 pl-10 pr-4 rounded-[2px] border border-gray-200 text-sm bg-white
                               focus:outline-none focus:ring-2 focus:ring-neon/40 focus:border-neon/60
                               transition-all placeholder:text-gray-300 font-body"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="show">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold font-body">
                    Password
                  </label>
                  <span className="text-xs text-turquoise-2 cursor-pointer hover:text-turquoise-1 transition-colors font-semibold font-body">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    className="w-full h-11 pl-10 pr-11 rounded-[2px] border border-gray-200 text-sm bg-white
                               focus:outline-none focus:ring-2 focus:ring-neon/40 focus:border-neon/60
                               transition-all placeholder:text-gray-300 font-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-rose-500 font-semibold font-body -mt-1"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="show" className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 sm:h-14 flex items-center justify-center gap-2.5 rounded-[2px]
                             bg-neon text-black text-sm font-semibold font-body
                             hover:bg-yellow-300 active:scale-[0.98] transition-all duration-150
                             disabled:opacity-60 disabled:cursor-not-allowed
                             uppercase tracking-[0.18em]"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in as {ROLES.find((r) => r.id === role)?.label}
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Mobile: feature pills (shown instead of left panel) */}
            <div className="lg:hidden mt-8 pt-6 border-t border-gray-100">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-body font-semibold mb-3">
                Why CPRIME
              </p>
              <div className="flex flex-col gap-3">
                {features.map(({ icon: Icon, color, title }) => (
                  <div key={title} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                      <Icon size={13} className="text-black" />
                    </div>
                    <span className="text-sm font-body text-gray-600 font-medium">{title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
