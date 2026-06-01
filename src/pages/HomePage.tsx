import { useState } from 'react'
import QuestionCard from '../components/QuestionCard'

const dummyMcq = {
  id: 1,
  quizId: 1,
  type: 'mcq' as const,
  prompt: 'What is the capital of France?',
  options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
  position: 0,
}

const dummyShort = {
  id: 2,
  quizId: 1,
  type: 'short' as const,
  prompt: 'What is the largest planet in our solar system?',
  position: 1,
}

const HomePage = () => {
  const [mcqValue, setMcqValue] = useState('')
  const [shortValue, setShortValue] = useState('')

  return (
    <div className="max-w-170 mx-auto px-6 pt-10 flex flex-col gap-6">
      <QuestionCard question={dummyMcq} value={mcqValue} onChange={setMcqValue} />
      <QuestionCard question={dummyShort} value={shortValue} onChange={setShortValue} />
    </div>
  )
}

export default HomePage
