import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    const result = await signUp(formData.email, formData.password, formData.name)
    
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
          <h1 className="text-2xl font-display font-semibold text-gray-800 mt-6">Create Account</h1>
          <p className="text-gray-500 mt-2">Join us for exclusive offers</p>
        </div>

        <form onSubmit={handleSubmit} className="card-rose p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-rose pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="input-rose pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-rosegold-200 bg-white text-rosegold-500 focus:ring-rosegold-500" />
              <span className="text-sm text-gray-500">
                I agree to the{' '}
                <Link to="/terms" className="text-rosegold-500 hover:text-rosegold-600">Terms & Conditions</Link>
                {' '}and{' '}
                <Link to="/privacy-policy" className="text-rosegold-500 hover:text-rosegold-600">Privacy Policy</Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-rose w-full mt-6 py-3"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="mt-6 text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-rosegold-500 hover:text-rosegold-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
