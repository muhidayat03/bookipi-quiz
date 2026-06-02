import { useNavigate, useParams } from 'react-router'
import { ErrorCard } from '@/components'
import { getApiError } from '@/utils'
import { useQuiz, useStartAttempt } from '@/queries'
import { useQuizContext } from '@/context'

const QuizDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const quizId = Number(id)

  const { setAttempt } = useQuizContext()

  const {
    data: quiz,
    isLoading: quizLoading,
    isError: quizError,
    error: quizErrorData,
    refetch: refetchQuiz,
  } = useQuiz(quizId)

  const quizErrorMsg = getApiError(quizErrorData, 'Failed to load quiz.')
  const startAttempt = useStartAttempt()

  const invalidId = !id || isNaN(quizId)
  const startError = startAttempt.isError
    ? getApiError(startAttempt.error, 'Failed to start quiz.')
    : null

  const handleStart = async () => {
    const result = await startAttempt.mutateAsync(quizId).catch(() => null)
    if (!result) return
    setAttempt(result)
    navigate(`/quiz/${quizId}/play`)
  }

  if (invalidId)
    return <ErrorCard title="Invalid quiz URL" message="Please check the link and try again." />

  if (quizError)
    return <ErrorCard title="Error loading quiz" message={quizErrorMsg} onRetry={refetchQuiz} />

  if (quizLoading)
    return (
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
        onClick={handleStart}
        disabled={startAttempt.isPending || !quiz?.questions?.length}
        className="px-7 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg duration-120"
      >
        {startAttempt.isPending ? 'Starting…' : 'Start Quiz'}
      </button>
    </div>
  )
}

export default QuizDetailPage
