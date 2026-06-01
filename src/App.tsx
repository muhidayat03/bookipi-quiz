import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router'
import {
  HomePage,
  BuilderPage,
  QuizDetailPage,
  QuizPlayerPage,
  QuizResultPage,
  NotFoundPage,
} from '@/pages'
import { QuizProvider } from '@/context'

const QuizLayout = () => {
  const navigate = useNavigate()
  return (
    <QuizProvider>
      <div className="max-w-170 mx-auto px-6 pt-10">
        <button
          onClick={() => navigate('/play')}
          className="text-slate-500 text-sm font-medium mb-5 hover:text-slate-900 duration-120"
        >
          ← Home
        </button>
        <Outlet />
      </div>
    </QuizProvider>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/play" replace />} />
        <Route path="/play" element={<HomePage />} />
        <Route path="/build" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route element={<QuizLayout />}>
          <Route path="/quiz/:id" element={<QuizDetailPage />} />
          <Route path="/quiz/:id/play" element={<QuizPlayerPage />} />
          <Route path="/quiz/:id/results" element={<QuizResultPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
