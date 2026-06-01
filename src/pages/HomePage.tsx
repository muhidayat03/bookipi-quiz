import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { QuizCard } from '../components'
import { useQuizzes } from '../queries'

const HomePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const tab = location.pathname === '/build' ? 'build' : 'quiz'

  const [quizId, setQuizId] = useState('')
  const [idError, setIdError] = useState('')

  const { data: quizzes, isLoading, error } = useQuizzes()

  const published = quizzes?.filter((quiz) => quiz.isPublished) ?? []

  const handleTakeQuiz = () => {
    const v = quizId.trim()
    if (!/^\d+$/.test(v) || parseInt(v, 10) <= 0) {
      setIdError('Enter a valid quiz ID (a positive number).')
      return
    }
    setIdError('')
    navigate(`/quiz/${v}`)
  }

  return (
    <div className="max-w-170 mx-auto px-6 pt-10 pb-24">
      <div className="flex items-center justify-between mb-7">
        <Link
          to="/quiz"
          className="flex items-center gap-3 font-bold text-lg tracking-tight no-underline text-slate-900"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            B
          </span>
          Bookipi Quiz
        </Link>
        <div className="inline-flex bg-slate-100 border border-slate-200 rounded-[10px] p-1 gap-1">
          <Link
            to="/quiz"
            className={`px-5 py-2 rounded-[7px] font-semibold text-sm cursor-pointer no-underline duration-120 ${tab === 'quiz' ? 'bg-white text-slate-900 shadow-tab' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Player
          </Link>
          <Link
            to="/build"
            className={`px-5 py-2 rounded-[7px] font-semibold text-sm cursor-pointer no-underline duration-120 ${tab === 'build' ? 'bg-white text-slate-900 shadow-tab' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Builder
          </Link>
        </div>
      </div>

      {tab === 'quiz' ? (
        <>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Play a quiz</h1>
          <p className="text-slate-500 mb-7 text-sm">
            Got a quiz ID? Drop it in. Or browse public quizzes below.
          </p>

          <div className="bg-white border border-slate-200 rounded-xl shadow-card p-6 mb-8">
            <label htmlFor="quiz-id" className="font-semibold text-sm block mb-2">Quiz ID</label>
            <div className="flex gap-3">
              <input
                id="quiz-id"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 123"
                value={quizId}
                onChange={(e) => {
                  setQuizId(e.target.value)
                  setIdError('')
                }}
                className={`w-full px-3 py-3 border rounded-lg text-base focus:outline-none focus:border-blue-600 focus:shadow-focus duration-120 ${idError ? 'border-red-500' : 'border-slate-200'}`}
              />
              <button
                onClick={handleTakeQuiz}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg whitespace-nowrap duration-120"
              >
                Take Quiz
              </button>
            </div>
            {idError && <p className="text-red-600 text-xs font-medium mt-2">{idError}</p>}
          </div>

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
            Public quizzes
          </div>
          {isLoading && (
            <div className="flex flex-col gap-3">
              <QuizCard.Loading />
              <QuizCard.Loading />
              <QuizCard.Loading />
            </div>
          )}
          {error && <p className="text-red-600 text-sm">Failed to load quizzes.</p>}
          {!isLoading && !error && published.length === 0 && (
            <div className="text-center px-6 py-12 text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-semibold text-slate-900 mb-1">No quizzes yet</div>
              <div className="text-sm">Create your first quiz on the Builder tab to get started.</div>
            </div>
          )}
          {published.length > 0 && (
            <div className="flex flex-col gap-3">
              {published.map((q) => (
                <QuizCard
                  key={q.id}
                  quiz={q}
                  action={
                    <button
                      onClick={() => navigate(`/quiz/${q.id}`)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg duration-120"
                    >
                      Play →
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4 mb-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Your quizzes</h1>
              <p className="text-slate-500 mb-7 text-sm">Create and manage your quizzes.</p>
            </div>
            <Link
              to="/builder"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg no-underline duration-120 shrink-0"
            >
              + Create Quiz
            </Link>
          </div>
          {isLoading && (
            <div className="flex flex-col gap-3">
              <QuizCard.Loading />
              <QuizCard.Loading />
              <QuizCard.Loading />
            </div>
          )}
          {error && <p className="text-red-600 text-sm">Failed to load quizzes.</p>}
          {!isLoading && !error && quizzes?.length === 0 && (
            <div className="text-center px-6 py-12 text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white">
              <div className="text-3xl mb-2">✏️</div>
              <div className="font-semibold text-slate-900 mb-1">No quizzes yet</div>
              <div className="text-sm">Create your first quiz to see it here.</div>
              <Link
                to="/builder"
                className="inline-block mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg no-underline duration-120"
              >
                + Create Quiz
              </Link>
            </div>
          )}
          {quizzes && quizzes.length > 0 && (
            <div className="flex flex-col gap-3">
              {quizzes.map((q) => (
                <QuizCard
                  key={q.id}
                  quiz={q}
                  action={
                    <Link
                      to={`/builder/${q.id}`}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-900 text-sm font-semibold rounded-lg no-underline duration-120"
                    >
                      Edit
                    </Link>
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HomePage
