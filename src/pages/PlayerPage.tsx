import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import QuestionCard from '../components/QuestionCard'
import QuizStart, { QuizStartError } from '../components/QuizStart'
import { useQuiz, useStartAttempt, useSaveAnswer, useSubmitAttempt } from '../queries'
import type { Attempt } from '../types'

const PlayerPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const quizId = Number(id)

  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startError, setStartError] = useState<string | null>(null)

  const {
    data: quiz,
    isLoading: quizLoading,
    isError: quisError,
    refetch: refetchQuiz,
  } = useQuiz(quizId)
  const startAttempt = useStartAttempt()
  const saveAnswer = useSaveAnswer()
  const submitAttempt = useSubmitAttempt()

  const questions = attempt?.quiz.questions ?? []
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const currentAnswer = (answers[currentQuestion?.id as number] ?? '').trim()
  const invalidId = !id || isNaN(quizId)
  const handleClickHome = () => navigate('/play')

  const handleChangeAnswer = (value: string) =>
    setAnswers((prev: Record<number, string>) => ({ ...prev, [currentQuestion?.id ?? 0]: value }))

  const handleStart = async () => {
    setStartError(null)
    try {
      const result = await startAttempt.mutateAsync(quizId)
      setAttempt(result)
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? e.response?.data?.error
        : 'Failed to start quiz. Make sure the quiz is published.'
      setStartError(msg)
    }
  }

  const handleNext = async () => {
    if (!attempt || !currentQuestion) return
    await saveAnswer.mutateAsync({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value: answers[currentQuestion.id] ?? '',
    })
    setCurrentIndex(currentIndex + 1)
  }

  const handleBack = () => setCurrentIndex(currentIndex - 1)

  const handleSubmit = async () => {
    if (!attempt || !currentQuestion) return
    await saveAnswer.mutateAsync({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value: answers[currentQuestion.id] ?? '',
    })
    const result = await submitAttempt.mutateAsync(attempt.id)
    navigate(`/quiz/${quizId}/results`, { state: { result, total: questions.length } })
  }

  return (
    <div className="max-w-170 mx-auto px-6 pt-10">
      <button
        onClick={handleClickHome}
        className="text-slate-500 text-sm font-medium mb-5 hover:text-slate-900 duration-120"
      >
        ← Home
      </button>

      {invalidId && (
        <QuizStartError title="Invalid quiz URL" message="Please check the link and try again." />
      )}

      {!invalidId && !attempt && (
        <QuizStart
          quizId={quizId}
          quiz={quiz}
          quizLoading={quizLoading}
          quizError={quisError}
          startError={startError}
          isPending={startAttempt.isPending}
          onStart={handleStart}
          onRetry={refetchQuiz}
        />
      )}

      {!invalidId && attempt && (
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
          <div className="flex items-center justify-between gap-3 mt-6">
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
                {submitAttempt.isPending ? 'Submitting…' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PlayerPage
