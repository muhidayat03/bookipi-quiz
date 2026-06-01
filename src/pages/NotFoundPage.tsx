import { useNavigate } from 'react-router'

const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="text-slate-500">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="text-blue-600 text-sm font-medium hover:underline"
      >
        ← Back to Home
      </button>
    </div>
  )
}

export default NotFoundPage
