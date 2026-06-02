import clsx from 'clsx'
import type { Question } from '@/types'
import PromptDisplay from './PromptDisplay'

interface Props {
  question: Omit<Question, 'correctAnswer'>
  value: string
  onChange: (value: string) => void
}

const QuestionCard = ({ question, value, onChange }: Props) => {
  const handleClickOption = (i: number) => () => onChange(String(i))
  const handleChangeAnswer = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-8">
      <div className="text-xl font-semibold">
        <PromptDisplay prompt={question.prompt} />
      </div>

      {question.type === 'mcq' && question.options?.length && (
        <div className="flex flex-col gap-3 mt-6">
          {question.options.map((opt, i) => {
            const selected = value === String(i)
            return (
              <label
                key={i}
                onClick={handleClickOption(i)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-4 rounded-lg border-[1.5px] cursor-pointer text-base font-medium',
                  selected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 duration-120'
                )}
              >
                <span
                  className={clsx(
                    'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center',
                    selected ? 'border-blue-600' : 'border-slate-300'
                  )}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </span>
                {opt}
              </label>
            )
          })}
        </div>
      )}

      {question.type === 'short' && (
        <input
          type="text"
          className="mt-6 w-full p-4 border border-slate-200 rounded-lg text-base font-medium focus:outline-none focus:border-blue-600 focus:shadow-focus"
          placeholder="Type your answer…"
          value={value}
          onChange={handleChangeAnswer}
          autoFocus
        />
      )}
    </div>
  )
}

export default QuestionCard
