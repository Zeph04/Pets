import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/Spinner'
import { Cat, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'

export function RegisterPage() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()

  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await authRegister(data)
      toast.success(`Welcome to PawsHome, ${user.name}!`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const valErrors = err?.response?.data?.errors
      if (valErrors) {
        Object.entries(valErrors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] })
        })
      } else {
        toast.error(err?.response?.data?.message ?? 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <Cat className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-display font-bold text-xl">PawsHome</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white">Create your account</h1>
          <p className="text-neutral-400 text-sm mt-1">Join our community of cat lovers</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="register-form">
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="label text-neutral-300">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Must be at least 2 characters' } })}
                  className={`input bg-neutral-950 border-neutral-700 text-white placeholder-neutral-600 pl-10 ${errors.name ? 'input-error' : ''}`}
                  placeholder="Jane Smith"
                />
              </div>
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label text-neutral-300">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                  })}
                  className={`input bg-neutral-950 border-neutral-700 text-white placeholder-neutral-600 pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="label text-neutral-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                  })}
                  className={`input bg-neutral-950 border-neutral-700 text-white placeholder-neutral-600 pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="At least 8 characters"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="reg-confirm" className="label text-neutral-300">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="reg-confirm"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password_confirmation', {
                    required: 'Please confirm your password',
                    validate: v => v === watch('password') || 'Passwords do not match',
                  })}
                  className={`input bg-neutral-950 border-neutral-700 text-white placeholder-neutral-600 pl-10 ${errors.password_confirmation ? 'input-error' : ''}`}
                  placeholder="Repeat your password"
                />
              </div>
              {errors.password_confirmation && <p className="error-text">{errors.password_confirmation.message}</p>}
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
