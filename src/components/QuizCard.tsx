import type { Quiz } from '@/types'

interface Props {
  quiz: Quiz
  action: React.ReactNode
}

const QuizCard = ({ quiz, action }: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-6 flex justify-between items-center gap-4 transition-[box-shadow,border-color] hover:shadow-card-hover hover:border-slate-300">
      <div>
        <div className="font-semibold text-base">{quiz.title}</div>
        <div className="text-slate-500 text-sm mt-1">{quiz.description}</div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-blue-600 text-[12px] font-mono font-semibold">
            Quiz ID: {quiz.id}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">{action}</div>
    </div>
  )
}

QuizCard.Loading = () => (
  <div data-testid="quiz-card-loading" className="bg-white border border-slate-200 rounded-xl shadow-card p-6 flex justify-between items-center gap-4">
    <div className="animate-pulse flex-1">
      <div className="h-5 bg-slate-200 rounded w-40" />
      <div className="h-4 bg-slate-200 rounded w-64 mt-3" />
      <div className="h-3.5 bg-slate-200 rounded w-20 mt-3" />
    </div>
    <div className="animate-pulse shrink-0">
      <div className="h-10 bg-slate-200 rounded-lg w-21" />
    </div>
  </div>
)

export default QuizCard
