import { useForm } from 'react-hook-form'

export interface QuizFormValues {
  title: string
  description: string
}

interface Props {
  defaultValues?: Partial<QuizFormValues>
  onSubmit: (values: QuizFormValues) => void
  isLoading?: boolean
  isSubmitting?: boolean
  error?: string
}

const QuizForm = ({ defaultValues, onSubmit, isLoading, isSubmitting, error }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormValues>({ defaultValues })

  if (isLoading) return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-5.5 animate-pulse">
      <div className="flex flex-col gap-3 mb-5">
        <div className="h-5 bg-slate-200 rounded w-10" />
        <div className="h-11 bg-slate-200 rounded-lg" />
      </div>
      <div className="flex flex-col gap-2 mb-5">
        <div className="h-5 bg-slate-200 rounded w-24" />
        <div className="h-22 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-11 bg-slate-200 rounded-lg w-27" />
    </div>
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-slate-200 rounded-xl shadow-card p-5"
    >
      <div className="flex flex-col gap-2 mb-5">
        <label htmlFor="quiz-title" className="font-semibold text-sm">
          Title <span className="text-blue-600">*</span>
        </label>
        <input
          id="quiz-title"
          type="text"
          placeholder="e.g. JavaScript Fundamentals"
          className={`w-full px-3 py-3 border rounded-lg bg-white text-slate-900 outline-none focus:border-blue-600 focus:shadow-focus duration-120 ${errors.title ? 'border-red-500' : 'border-slate-200'}`}
          {...register('title', { required: 'A title is required.' })}
        />
        {errors.title && (
          <div className="text-red-600 text-[13px] font-medium">{errors.title.message}</div>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-5">
        <label htmlFor="quiz-description" className="font-semibold text-sm">
          Description
        </label>
        <textarea
          id="quiz-description"
          placeholder="What's this quiz about?"
          className="w-full px-3 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 outline-none focus:border-blue-600 focus:shadow-focus duration-120 resize-y min-h-[88px]"
          {...register('description')}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-55 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg duration-120"
        >
          {isSubmitting ? 'Saving…' : defaultValues?.title ? 'Save Quiz' : 'Create Quiz'}
        </button>
        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      </div>
    </form>
  )
}

export default QuizForm
