import type { Quiz } from '../types'

interface Props {
  quizId: number
  quiz?: Quiz
  quizLoading: boolean
  quizError: boolean
  startError: string | null
  isPending: boolean
  onStart: () => void
  onRetry: () => void
}

const QuizStartLoading = () => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-card p-10 text-center">
    <div className="animate-pulse">
      <div className="h-7 bg-slate-200 rounded w-48 mx-auto mb-3" />
      <div className="h-4 bg-slate-200 rounded w-64 mx-auto mb-6" />
      <div className="my-6">
        <div className="h-7 bg-slate-200 rounded w-10 mx-auto mb-1" />
        <div className="h-3 bg-slate-200 rounded w-20 mx-auto" />
      </div>
      <div className="h-11 bg-slate-200 rounded-lg w-32 mx-auto" />
    </div>
  </div>
)

export const QuizStartError = ({ title, message, onRetry }: { title: string; message: string; onRetry?: () => void }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-card p-10 text-center">
    <div className="text-red-500 font-semibold mb-2">{title}</div>
    <p className="text-slate-500 text-sm mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg duration-120"
      >
        Retry
      </button>
    )}
  </div>
)

const QuizStart = ({
  quizId,
  quiz,
  quizLoading,
  quizError,
  startError,
  isPending,
  onStart,
  onRetry,
}: Props) => {
  if (quizLoading) return <QuizStartLoading />
  if (quizError) return <QuizStartError title="Quiz not found" message="Please check the ID and try again." onRetry={onRetry} />

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-10 text-center">
        <h2 className="text-xl font-bold mb-2">{quiz?.title ?? `Quiz #${quizId}`}</h2>
        {quiz?.description && <p className="text-slate-500 text-sm mb-4">{quiz.description}</p>}
        <div className="my-6">
          <div className="font-bold text-xl">{quiz?.questions?.length ?? '—'}</div>
          <div className="text-slate-500 text-xs uppercase tracking-wider">Questions</div>
        </div>
        {startError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm mb-4 text-left">
            {startError}
          </div>
        )}
        <button
          onClick={onStart}
          disabled={isPending}
          className="px-7 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg duration-120"
        >
          {isPending ? 'Starting…' : 'Start Quiz'}
        </button>
    </div>
  )
}

export default QuizStart
