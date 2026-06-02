import clsx from 'clsx'
import type { Question } from '@/types'
import QuestionForm, { type QuestionFormValues } from './QuestionForm'
import PromptDisplay from './PromptDisplay'

interface Props {
  questions: Question[]
  onDelete: (id: number) => void
  onEdit: (id: number, values: QuestionFormValues) => Promise<void>
  isEditing?: boolean
  editingId: number | null
  onEditingIdChange: (id: number | null) => void
}

const QuestionList = ({ questions, onDelete, onEdit, isEditing, editingId, onEditingIdChange }: Props) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 px-6 text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white">
        <div className="text-3xl mb-2">📝</div>
        <div className="font-semibold text-slate-900 mb-1">No questions yet</div>
        <div className="text-sm">Add your first question using the form below.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, i) => (
        <div
          key={q.id}
          className={clsx(
            'bg-white border border-slate-200 rounded-xl shadow-card px-5 py-5',
            editingId === q.id && 'border-blue-600 shadow-focus'
          )}
        >
          {editingId === q.id ? (
            <>
              <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mb-4">
                Editing question {i + 1}
              </div>
              <QuestionForm
                key={q.id}
                defaultValues={{
                  type: q.type as 'mcq' | 'short',
                  prompt: q.prompt,
                  options: q.options?.map((o) => ({ value: o })) ?? [
                    { value: '' },
                    { value: '' },
                    { value: '' },
                    { value: '' },
                  ],
                  correctAnswerIndex: q.type === 'mcq' ? String(q.correctAnswer) : undefined,
                  correctAnswerText: q.type === 'short' ? String(q.correctAnswer ?? '') : undefined,
                }}
                onSubmit={async (values) => {
                  await onEdit(q.id, values)
                  onEditingIdChange(null)
                }}
                onCancel={() => onEditingIdChange(null)}
                isLoading={isEditing}
                submitLabel="Save changes"
              />
            </>
          ) : (
            <div className="flex items-start gap-3">
              <span className="font-mono text-slate-400 text-[13px] font-semibold pt-1 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <span
                  className={clsx(
                    'text-[10.5px] font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1 uppercase tracking-wider',
                    q.type === 'short' ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'
                  )}
                >
                  {q.type === 'mcq' ? 'Multiple choice' : 'Short answer'}
                </span>
                <div className="font-semibold text-[15.5px] leading-snug mt-6">
                  <PromptDisplay prompt={q.prompt} />
                </div>
                {q.type === 'mcq' && q.options && (
                  <ul className="list-none mt-6 p-0 flex flex-col gap-2">
                    {q.options.map((o, oi) => (
                      <li
                        key={oi}
                        className={clsx(
                          'flex items-center gap-2 text-sm px-3 py-2 rounded-lg',
                          oi === q.correctAnswer
                            ? 'bg-green-50 text-green-800 font-semibold'
                            : 'bg-slate-50 text-slate-500'
                        )}
                      >
                        <span
                          className={clsx(
                            'w-4 h-4 rounded-full border-2 border-current shrink-0',
                            oi === q.correctAnswer ? 'opacity-100' : 'opacity-35'
                          )}
                        />
                        {o}
                        {oi === q.correctAnswer ? ' ✓' : ''}
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === 'short' && (
                  <div className="mt-6 text-sm text-slate-500">
                    Accepted answer:{' '}
                    <b className="font-mono font-semibold bg-green-50 text-green-800 px-2 py-px rounded">
                      {String(q.correctAnswer)}
                    </b>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 cursor-pointer grid place-items-center text-sm duration-120 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                  onClick={() => onEditingIdChange(q.id)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-red-700 cursor-pointer grid place-items-center text-sm duration-120 hover:bg-red-50 hover:text-red-800 hover:border-red-200"
                  onClick={() => onDelete(q.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default QuestionList
