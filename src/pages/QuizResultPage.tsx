import clsx from 'clsx'
import { Navigate, useParams } from 'react-router'
import { useQuizContext } from '@/context'

const QuizResultPage = () => {
  const { id } = useParams()
  const { result, attempt } = useQuizContext()

  if (!result) return <Navigate to={`/quiz/${id}`} replace />

  const total = attempt?.quiz.questions.length ?? result.details.length
  const percentage = Math.round((result.score / total) * 100)
  const feedback =
    percentage >= 80 ? 'Excellent work!' : percentage >= 50 ? 'Nice effort.' : 'Keep practicing!'

  return (
    <div className="pb-24">
      <div className="bg-white border border-slate-200 rounded-xl shadow-card p-10 text-center mb-8">
        <div className="font-extrabold text-6xl leading-none tracking-tight tabular-nums">
          {result.score}
          <span className="text-slate-400 font-bold"> / {total}</span>
        </div>
        <div className="text-slate-500 font-medium text-base mt-2">
          {percentage}% correct — {feedback}
        </div>
      </div>

      <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
        Question breakdown
      </div>
      <div className="flex flex-col gap-3">
        {result.details.map((d, i) => (
          <div
            key={d.questionId}
            className={clsx(
              'flex items-center justify-between px-5 py-4 rounded-lg text-sm font-medium border gap-4',
              d.correct
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'
            )}
          >
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-semibold">Question {i + 1}</span>
              {!d.correct && d.expected !== undefined && (
                <span className="text-xs opacity-85 font-normal">
                  Expected: <code className="font-mono font-semibold">{d.expected}</code>
                </span>
              )}
            </div>
            <span className="font-bold text-xs whitespace-nowrap">
              {d.correct ? '✓ Correct' : '✗ Incorrect'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizResultPage
