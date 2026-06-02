import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  ErrorCard,
  QuizForm,
  QuestionForm,
  QuestionList,
  type QuizFormValues,
  type QuestionFormValues,
} from '@/components'
import {
  useQuiz,
  useCreateQuiz,
  useUpdateQuiz,
  useAddQuestion,
} from '@/queries'
import { getApiError } from '@/utils'

const QuizBuilderPage = () => {
  const { id } = useParams()
  const quizId = id ? Number(id) : 0
  const navigate = useNavigate()
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)

  const { data: quiz, isLoading, error } = useQuiz(quizId)
  const createQuiz = useCreateQuiz()
  const updateQuiz = useUpdateQuiz(quizId)
  const addQuestion = useAddQuestion(quizId)

  const quizFormError = getApiError(createQuiz.error, 'Failed to save quiz.') || getApiError(updateQuiz.error, 'Failed to save quiz.')
  const addQuestionError = getApiError(addQuestion.error, 'Failed to add question.')

  const handleQuizSubmit = async (values: QuizFormValues) => {
    if (quizId) {
      await updateQuiz.mutateAsync({ ...values, isPublished: true })
    } else {
      const created = await createQuiz.mutateAsync({ ...values, isPublished: true })
      navigate(`/builder/${created.id}`)
    }
  }

  const handleAddQuestion = async (values: QuestionFormValues) => {
    if (values.type === 'mcq') {
      await addQuestion.mutateAsync({
        type: 'mcq',
        prompt: values.prompt,
        options: values.options.map((o) => o.value),
        correctAnswer: Number(values.correctAnswerIndex!),
      })
    } else {
      await addQuestion.mutateAsync({
        type: 'short',
        prompt: values.prompt,
        correctAnswer: values.correctAnswerText!,
      })
    }
  }


  if (quizId > 0 && error)
    return <ErrorCard title="Failed to load quiz" message="Check your connection and try again." />

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-1">
        {quizId ? 'Edit quiz' : 'Create quiz'}
      </h1>
      <p className="text-slate-500 mb-7 text-sm">
        {quizId
          ? 'Update the details, then manage questions below.'
          : "Start with the basics. You'll add questions after saving."}
      </p>

      {quizId > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm flex-wrap mb-5">
          <span>Quiz ID</span>
          <span className="font-mono font-bold bg-white border border-blue-200 rounded-md px-2 py-px">
            {quizId}
          </span>
          <button
            className="ml-auto px-3 py-2 border border-slate-200 bg-white text-slate-900 text-[13px] font-semibold rounded-lg duration-120 hover:bg-slate-50 hover:border-slate-300"
            onClick={() => navigator.clipboard?.writeText(String(quizId))}
          >
            Copy
          </button>
        </div>
      )}

      <QuizForm
        key={quiz?.id ?? 'new'}
        isLoading={quizId > 0 && isLoading}
        defaultValues={quiz ? { title: quiz.title, description: quiz.description } : undefined}
        onSubmit={handleQuizSubmit}
        isSubmitting={createQuiz.isPending || updateQuiz.isPending}
        error={quizFormError}
      />

      {quizId > 0 && !isLoading && (
        <>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest my-7">
            Questions ({quiz?.questions?.length ?? 0})
          </div>
          <QuestionList
            questions={quiz?.questions ?? []}
            quizId={quizId}
            editingQuestionId={editingQuestionId}
            setEditingQuestionId={setEditingQuestionId}
          />

          {!editingQuestionId && (
            <>
              <hr className="border-0 border-t border-slate-200 mt-7" />
              <div className="bg-white border border-slate-200 rounded-xl shadow-card p-5.5 mt-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                  Add a question
                </div>
                <QuestionForm
                  onSubmit={handleAddQuestion}
                  isLoading={addQuestion.isPending}
                  error={addQuestionError}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default QuizBuilderPage
