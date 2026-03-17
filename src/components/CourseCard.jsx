import { useNavigate } from 'react-router-dom'

export default function CourseCard({ course }) {
  const navigate = useNavigate()

  return (
    <div
      className="card cursor-pointer transition duration-200 hover:-translate-y-1 hover:border-border2"
      onClick={() => navigate(`/courses/${course._id}`)}
    >
      <h3 className="font-heading text-lg font-bold leading-tight text-text">
        {course.name}
      </h3>

      <div className="mt-4 text-sm font-semibold text-accent">Open -&gt;</div>
    </div>
  )
}
