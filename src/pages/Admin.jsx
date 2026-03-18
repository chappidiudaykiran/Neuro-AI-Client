import AdminSubjectForm from '../components/AdminSubjectForm'

export default function AdminDashboard() {
  return (
    <div className="page theme-auth border-t border-border bg-bg">
      <div className="container py-12">
        <div className="page-header text-center mb-10">
          <h1 className="page-title fade-up text-3xl font-extrabold font-heading text-text">Content Management</h1>
          <p className="page-subtitle fade-up-2 text-text2 mt-2">Add, edit, or remove curated YouTube video links for subjects</p>
        </div>
        <div className="fade-up max-w-4xl mx-auto">
          <AdminSubjectForm />
        </div>
      </div>
    </div>
  )
}
