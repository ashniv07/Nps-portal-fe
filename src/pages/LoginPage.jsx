import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

function PulseLogo() {
  return (
    <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center shrink-0 shadow-lg">
      <svg width="28" height="22" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 10 L5.5 10 L8 3 L11.5 17 L14.5 7 L17 13 L19.5 10 L25 10"
          stroke="#CDDE33"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

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
    // Simulate auth — both roles go to the same dashboard for now
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 900)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#0d0d0d' }}
    >
      {/* Background glow blobs */}
      <div
        className="absolute top-[-180px] left-[-180px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(205,222,51,0.07) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-200px] right-[-160px] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(15,126,109,0.09) 0%, transparent 70%)' }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Login card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-md mx-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#CDDE33] to-transparent opacity-80" />

          <div className="px-10 py-10">

            {/* Brand */}
            <motion.div
              custom={0}
              variants={fieldVariants}
              initial="hidden"
              animate="show"
              className="flex items-center gap-3 mb-8"
            >
              <PulseLogo />
              <div>
                <span className="font-display font-semibold text-gray-900 text-xl leading-none block">
                  PulseScore
                </span>
                <span className="text-xs text-gray-400 font-body mt-0.5 block">Analytics Platform</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="show" className="mb-7">
              <h1 className="font-display font-semibold text-gray-900 text-3xl leading-tight">
                Welcome back
              </h1>
              <p className="text-sm text-gray-400 font-body mt-1">
                Sign in to access your dashboard
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Role selector */}
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="show">
                <label className="text-xs text-gray-400 font-body uppercase tracking-wider block mb-2">
                  Sign in as
                </label>
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                  {['admin', 'user'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-body font-semibold capitalize transition-all duration-200 ${
                        role === r
                          ? 'bg-gray-900 text-[#CDDE33] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {r === 'admin' ? 'Admin' : 'User'}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Email */}
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="show">
                <label className="text-xs text-gray-400 font-body uppercase tracking-wider block mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CDDE33]/40 focus:border-[#CDDE33]/60 transition-all placeholder:text-gray-300"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="show">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-gray-400 font-body uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-[#0F7E6D] font-body cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CDDE33]/40 focus:border-[#CDDE33]/60 transition-all placeholder:text-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </motion.div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-body"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="show" className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gray-900 text-[#CDDE33] text-sm font-body font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#CDDE33]/30 border-t-[#CDDE33] rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in as {role === 'admin' ? 'Admin' : 'User'}
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </motion.div>

            </form>
          </div>

          {/* Footer */}
          <div className="px-10 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-body text-center">
              Protected by PulseScore · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
