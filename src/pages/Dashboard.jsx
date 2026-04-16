import { useAuth } from '../context/AuthContext'
import DashboardSection from '../components/student/DashboardSection'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="page theme-dashboard">
      <div className="container pb-16">
        <div className="page-header border-none !pb-2 mt-4">
          <h1 className="font-heading text-5xl font-extrabold tracking-tight hero-gradient-text fade-up pb-2">
            Hey, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-3 text-lg text-text2 fade-up-2 text-balance max-w-2xl leading-relaxed">
            Welcome to your workspace. The dashboard content is being restructured.
          </p>
        </div>

        <div className="mt-12">
           <DashboardSection />
        </div>
      </div>
    </div>
  )
}
