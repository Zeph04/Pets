import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '@/api/axios'
import { Spinner } from '@/components/ui/Spinner'
import { User, Mail, Phone, MapPin, Lock, Camera, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const { user, login } = useAuth()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState('profile')

  // Profile form
  const {
    register: regProfile,
    handleSubmit: hsProfile,
    formState: { errors: profileErrors, isDirty },
  } = useForm({
    defaultValues: {
      name:    user?.name ?? '',
      phone:   user?.phone ?? '',
      address: user?.address ?? '',
    },
  })

  // Password form
  const {
    register: regPass,
    handleSubmit: hsPass,
    reset: resetPass,
    watch,
    formState: { errors: passErrors },
  } = useForm()

  const profileMutation = useMutation({
    mutationFn: (data) => api.patch('/user/profile', data),
    onSuccess:  () => toast.success('Profile updated!'),
    onError:    () => toast.error('Failed to update profile.'),
  })

  const passMutation = useMutation({
    mutationFn: (data) => api.patch('/user/password', data),
    onSuccess:  () => {
      toast.success('Password changed! Please log in again.')
      resetPass()
    },
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Failed to change password.'
      toast.error(msg)
    },
  })

  const avatarMutation = useMutation({
    mutationFn: (file) => {
      const fd = new FormData()
      fd.append('avatar', file)
      return api.post('/user/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    onSuccess: () => toast.success('Avatar updated!'),
    onError:   () => toast.error('Failed to upload avatar.'),
  })

  const tabs = [
    { id: 'profile',  label: 'Profile Info', icon: User },
    { id: 'password', label: 'Password',     icon: Lock },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white">My Profile</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage your account details.</p>
      </div>

      {/* Avatar section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="relative">
          <img
            src={user?.avatar_url}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-500/30"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-brand-500 border-2 border-neutral-900 flex items-center justify-center cursor-pointer hover:bg-brand-600 transition-colors"
          >
            {avatarMutation.isPending ? <Spinner size="xs" /> : <Camera className="w-3.5 h-3.5 text-white" />}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) avatarMutation.mutate(file)
            }}
          />
        </div>
        <div>
          <p className="text-white font-semibold text-lg">{user?.name}</p>
          <p className="text-neutral-400 text-sm">{user?.email}</p>
          <div className="mt-1.5 flex gap-2">
            {user?.roles?.map(role => (
              <span key={role} className="badge-admin capitalize">{role}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-brand-500 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <form
          onSubmit={hsProfile(data => profileMutation.mutate(data))}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5"
        >
          <div>
            <label className="label text-neutral-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="profile-name"
                {...regProfile('name', { required: 'Name is required' })}
                className={`input bg-neutral-950 border-neutral-700 text-white pl-10 ${profileErrors.name ? 'input-error' : ''}`}
                placeholder="Your name"
              />
            </div>
            {profileErrors.name && <p className="error-text">{profileErrors.name.message}</p>}
          </div>

          <div>
            <label className="label text-neutral-300">Email <span className="text-neutral-500">(read-only)</span></label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={user?.email ?? ''}
                disabled
                className="input bg-neutral-950 border-neutral-700 text-neutral-500 pl-10 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="label text-neutral-300">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="profile-phone"
                {...regProfile('phone')}
                className="input bg-neutral-950 border-neutral-700 text-white pl-10"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="label text-neutral-300">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
              <textarea
                id="profile-address"
                {...regProfile('address')}
                rows={2}
                className="input bg-neutral-950 border-neutral-700 text-white pl-10 resize-none"
                placeholder="Your address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={profileMutation.isPending || !isDirty}
            className="btn-primary w-full justify-center"
            id="save-profile"
          >
            {profileMutation.isPending ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
            {profileMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Password tab */}
      {activeTab === 'password' && (
        <form
          onSubmit={hsPass(data => passMutation.mutate(data))}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5"
        >
          <div>
            <label className="label text-neutral-300">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="current-password"
                type="password"
                {...regPass('current_password', { required: 'Current password is required' })}
                className={`input bg-neutral-950 border-neutral-700 text-white pl-10 ${passErrors.current_password ? 'input-error' : ''}`}
                placeholder="Enter current password"
              />
            </div>
            {passErrors.current_password && <p className="error-text">{passErrors.current_password.message}</p>}
          </div>

          <div>
            <label className="label text-neutral-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="new-password"
                type="password"
                {...regPass('password', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                })}
                className={`input bg-neutral-950 border-neutral-700 text-white pl-10 ${passErrors.password ? 'input-error' : ''}`}
                placeholder="New password"
              />
            </div>
            {passErrors.password && <p className="error-text">{passErrors.password.message}</p>}
          </div>

          <div>
            <label className="label text-neutral-300">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="confirm-new-password"
                type="password"
                {...regPass('password_confirmation', {
                  required: 'Please confirm new password',
                  validate: v => v === watch('password') || 'Passwords do not match',
                })}
                className={`input bg-neutral-950 border-neutral-700 text-white pl-10 ${passErrors.password_confirmation ? 'input-error' : ''}`}
                placeholder="Confirm new password"
              />
            </div>
            {passErrors.password_confirmation && <p className="error-text">{passErrors.password_confirmation.message}</p>}
          </div>

          <button
            type="submit"
            disabled={passMutation.isPending}
            id="change-password"
            className="btn-primary w-full justify-center"
          >
            {passMutation.isPending ? <Spinner size="sm" /> : <Lock className="w-4 h-4" />}
            {passMutation.isPending ? 'Changing Password…' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  )
}
