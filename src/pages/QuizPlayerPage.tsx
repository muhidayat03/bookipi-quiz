import { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router'
import { QuestionCard } from '@/components'
import { useSaveAnswer, useSubmitAttempt } from '@/queries'
import { useQuizContext } from '@/context'
import { getApiError } from '@/utils'

const QuizPlayerPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const quizId = Number(id)

  const { attempt, answers, setAnswers, setResult } = useQuizContext()
  const [currentIndex, setCurrentIndex] = useState(0)

  const saveAnswer = useSaveAnswer()
  const submitAttempt = useSubmitAttempt()

  if (!attempt) return <Navigate to={`/quiz/${id}`} replace />

  const questions = attempt.quiz.questions
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const currentAnswer = (answers[currentQuestion?.id as number] ?? '').trim()

  const handleChangeAnswer = (value: string) =>
    setAnswers({ ...answers, [currentQuestion.id]: value })
  const handleBack = () => setCurrentIndex(currentIndex - 1)

  const handleNext = async () => {
    if (!currentQuestion) return
    await saveAnswer.mutateAsync({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value: answers[currentQuestion.id] ?? '',
    })
    setCurrentIndex(currentIndex + 1)
  }

  const handleSubmit = async () => {
    if (!currentQuestion) return
    await saveAnswer.mutateAsync({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value: answers[currentQuestion.id] ?? '',
    })
    const result = await submitAttempt.mutateAsync(attempt.id)
    setResult(result)
    navigate(`/quiz/${quizId}/results`, { replace: true })
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="font-bold text-lg">{attempt.quiz.title}</div>
        <span className="text-slate-500 font-semibold text-sm tabular-nums">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden mb-6">
        <span
          className="block h-full bg-blue-600 rounded-full duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          value={answers[currentQuestion.id] ?? ''}
          onChange={handleChangeAnswer}
        />
      )}
      {(saveAnswer.isError || submitAttempt.isError) && (
        <p className="text-red-600 text-sm font-medium mt-4">
          {saveAnswer.isError
            ? getApiError(saveAnswer.error, 'Failed to save answer.')
            : getApiError(submitAttempt.error, 'Failed to submit quiz.')}
        </p>
      )}
      <div className="flex items-center justify-between gap-3 mt-4">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 text-sm font-semibold rounded-lg duration-120"
        >
          ← Previous
        </button>
        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            disabled={saveAnswer.isPending || !currentAnswer}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg duration-120"
          >
            {saveAnswer.isPending ? 'Saving…' : 'Next →'}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitAttempt.isPending || saveAnswer.isPending || !currentAnswer}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg duration-120"
          >
            {submitAttempt.isPending || saveAnswer.isPending ? 'Submitting…' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </>
  )
}

export default QuizPlayerPage
