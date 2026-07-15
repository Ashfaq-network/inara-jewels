import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn(formData.email, formData.password)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      navigate('/account')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-softwhite">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-display font-bold text-gradient">INARA</span>
          </Link>
          <h1 className="text-2xl font-display font-semibold text-gray-800 mt-6">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card-rose p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input-rose pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="input-rose pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 rounded border-rosegold-200 bg-white text-rosegold-500 focus:ring-rosegold-500" />
              <span className="text-sm text-gray-500">Remember me</span>
            </label>
            <span className="text-sm text-gray-400">
              Contact us to reset password
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-rose w-full mt-6 py-3"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-6 text-center text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-rosegold-500 hover:text-rosegold-600">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
