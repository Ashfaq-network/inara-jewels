import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { supabase } from '@lib/supabase'
import { motion } from 'framer-motion'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const { user, profile, isLoading: authLoading, initialize } = useAuthStore()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingRole, setCheckingRole] = useState(false)

  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      }
    }
  }, [user, profile, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      setCheckingRole(true)
      await initialize()

      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        setError('Login failed. Please try again.')
        setCheckingRole(false)
        setLoading(false)
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (profileData?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else {
        setError('Access Denied. You do not have admin privileges.')
        await supabase.auth.signOut()
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setCheckingRole(false)
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-softwhite">
        <Loader2 className="w-8 h-8 text-rosegold-500 animate-spin" />
      </div>
    )
  }

  if (user && profile && profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-softwhite px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-rose p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You do not have admin privileges to access this panel.</p>
          <a href="/" className="btn-rose">Return to Store</a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-softwhite px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-rose p-8 md:p-10 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient mb-2">
            Inara Jewels Admin
          </h1>
          <p className="text-gray-400 text-sm">Sign in to access the admin panel</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm mb-6"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-rose"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="admin@inarajewels.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-rose"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || checkingRole}
            className="btn-rose w-full"
          >
            {(loading || checkingRole) ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {checkingRole ? 'Verifying access...' : 'Signing in...'}
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
