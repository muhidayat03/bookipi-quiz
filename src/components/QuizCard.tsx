import type { Quiz } from '../types'

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

export default QuizCard
