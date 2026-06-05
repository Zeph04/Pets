import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute, AdminRoute, GuestRoute } from '@/routes/guards'

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

// Public pages
import { HomePage } from '@/pages/public/HomePage'
import { CatsPage } from '@/pages/public/CatsPage'
import { CatDetailPage } from '@/pages/public/CatDetailPage'
import { AboutPage } from '@/pages/public/AboutPage'
import { AdoptionFormPage } from '@/pages/public/AdoptionFormPage'

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'

// Dashboard pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { MyApplicationsPage } from '@/pages/dashboard/MyApplicationsPage'
import { ProfilePage } from '@/pages/dashboard/ProfilePage'

// Admin pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminCatsPage } from '@/pages/admin/AdminCatsPage'
import { AdminAdoptionsPage } from '@/pages/admin/AdminAdoptionsPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="cats" element={<CatsPage />} />
          <Route path="cats/:id" element={<CatDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="adopt/:petId" element={
            <ProtectedRoute><AdoptionFormPage /></ProtectedRoute>
          } />
        </Route>

        {/* ── Auth ── */}
        <Route path="login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* ── Dashboard ── */}
        <Route path="dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="applications" element={<MyApplicationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* ── Admin ── */}
        <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="cats" element={<AdminCatsPage />} />
          <Route path="adoptions" element={<AdminAdoptionsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        {/* ── 404 fallback ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white gap-4">
      <span className="text-8xl">🐱</span>
      <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
      <p className="text-neutral-400">This page wandered off like a cat…</p>
      <a href="/" className="btn-primary mt-2">Go Home</a>
    </div>
  )
}
