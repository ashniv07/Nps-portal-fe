import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { CPrimeLogo } from '../components/common/CPrimeLogo'

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.15 + i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setError('')
    setLoading(true)
    // Simulate auth - both roles go to the same dashboard for now
    setTimeout(() => {
      localStorage.setItem('cprime_role', role)
      setLoading(false)
      navigate('/dashboard')
    }, 900)
  }

  return (
    <div className="min-h-screen w-screen flex flex-col relative overflow-hidden bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center shadow-sm">
        <CPrimeLogo />
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
      {/* Left Section - Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex w-1/2 flex-col justify-center px-20 pt-24 pb-8 bg-gradient-to-br from-turquoise-1 via-turquoise-2 to-turquoise-1 relative"
      >
        {/* Ensures consistent contrast for white text across the gradient */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-6xl font-semibold text-white mb-4 font-display">
            Measure What <span className="text-neon">Matters</span>
          </h1>
          <p className="text-xl text-gray-100 leading-relaxed font-body">
            Transform customer feedback into actionable insights. CPRIME helps you track, analyze, and improve your Net Promoter Score in real-time.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-5 mt-10">
          <div className="flex gap-4 items-start">
            <div className="w-1.5 h-12 bg-neon rounded-full flex-shrink-0 mt-1"></div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1 font-body">Real-time Analytics</h3>
              <p className="text-gray-100 text-sm font-body">Monitor NPS trends as they happen with our live dashboard</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-1.5 h-12 bg-lemon rounded-full flex-shrink-0 mt-1"></div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1 font-body">Actionable Insights</h3>
              <p className="text-gray-100 text-sm font-body">Get detailed segmentation and identify improvement areas</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-1.5 h-12 bg-orange-1 rounded-full flex-shrink-0 mt-1"></div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1 font-body">Team Collaboration</h3>
              <p className="text-gray-100 text-sm font-body">Share reports and collaborate across departments</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-white/20 flex gap-16">
          <div>
            <div className="text-5xl font-bold text-neon mb-2 font-display">500+</div>
            <p className="text-sm text-gray-100 font-body">Companies using CPRIME</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-lemon mb-2 font-display">2M+</div>
            <p className="text-sm text-gray-100 font-body">Surveys analyzed</p>
          </div>
        </div>
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="w-full lg:w-1/2 flex flex-col justify-start items-center pt-6 px-8 pb-16 bg-white"
      >
        <div className="w-full max-w-sm">

            {/* Heading */}
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="show" className="mb-8">
              <h1 className="font-semibold text-gray-600 text-4xl leading-tight mb-2 font-display">
                Welcome back
              </h1>
              <p className="text-base text-gray-500 font-body">
                Sign in to access your dashboard
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Role selector */}
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="show">
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2 font-semibold font-body">
                  Sign in as
                </label>
                <div className="flex items-center bg-gray-100 rounded-[2px] p-1.5 gap-1.5 border border-gray-200">
                  {['admin', 'user'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-[2px] text-sm font-semibold capitalize transition-all duration-200 ${
                        role === r
                          ? 'bg-gray-600 text-neon shadow-sm'
                          : 'text-gray-500 hover:text-gray-600'
                      }`}
                    >
                      {r === 'admin' ? 'Admin' : 'User'}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Email */}
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="show">
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2 font-semibold font-body">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 md:h-[42px] pl-11 pr-4 rounded-[2px] border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neon/40 focus:border-turquoise-2 transition-all placeholder:text-gray-300 font-body"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="show">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold font-body">
                    Password
                  </label>
                  <span className="text-xs text-turquoise-2 cursor-pointer hover:text-turquoise-1 transition-colors font-semibold font-body">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-9 md:h-[42px] pl-11 pr-11 rounded-[2px] border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neon/40 focus:border-turquoise-2 transition-all placeholder:text-gray-300 font-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </motion.div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-magenta font-semibold font-body"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="show" className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 flex items-center justify-center gap-2.5 rounded-[2px] bg-neon text-black text-sm font-semibold hover:bg-gradient-primary active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-[0.2em] border border-neon font-body"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in as {role === 'admin' ? 'Admin' : 'User'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </motion.div>

            </form>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
