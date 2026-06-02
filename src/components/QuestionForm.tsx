import clsx from 'clsx'
import { useForm, useFieldArray } from 'react-hook-form'

const MCQ_DEFAULT_OPTIONS = 4
const MCQ_MAX_OPTIONS = 6

export interface QuestionFormValues {
  type: 'mcq' | 'short'
  prompt: string
  options: { value: string }[]
  correctAnswerIndex?: string
  correctAnswerText?: string
}

interface Props {
  onSubmit: (values: QuestionFormValues) => Promise<void> | void
  onCancel?: () => void
  defaultValues?: Partial<QuestionFormValues>
  isLoading?: boolean
  submitLabel?: string
  error?: string
}

const QuestionForm = ({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading,
  submitLabel,
  error,
}: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    shouldUnregister: true,
    defaultValues: defaultValues ?? {
      type: 'mcq',
      options: Array.from({ length: MCQ_DEFAULT_OPTIONS }, () => ({ value: '' })),
    },
  })

  const type = watch('type')
  const { fields, append, remove } = useFieldArray({ control, name: 'options' })

  const handleAddOption = () => append({ value: '' })

  const handleRemoveOption = (index: number) => () => {
    const current = getValues('correctAnswerIndex')
    remove(index)
    if (current === String(index)) {
      setValue('correctAnswerIndex', undefined, { shouldValidate: true })
    } else if (current !== undefined && Number(current) > index) {
      setValue('correctAnswerIndex', String(Number(current) - 1))
    }
  }

  const handleFormSubmit = async (values: QuestionFormValues) => {
    await onSubmit(values)
    if (!defaultValues)
      reset({
        type: values.type,
        prompt: '',
        options: Array.from({ length: MCQ_DEFAULT_OPTIONS }, () => ({ value: '' })),
        correctAnswerIndex: undefined,
        correctAnswerText: '',
      })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex flex-col gap-2 mb-5">
        <label className="font-semibold text-sm">Question type</label>
        <div className="flex gap-3">
          <label
            className={clsx(
              'flex flex-1 items-center gap-2 px-4 py-3 border-[1.5px] rounded-lg cursor-pointer font-medium text-sm duration-120',
              type === 'mcq'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <input
              type="radio"
              value="mcq"
              className="accent-blue-600 shrink-0"
              {...register('type')}
            />
            Multiple choice
          </label>
          <label
            className={clsx(
              'flex flex-1 items-center gap-2 px-4 py-3 border-[1.5px] rounded-lg cursor-pointer font-medium text-sm duration-120',
              type === 'short'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <input
              type="radio"
              value="short"
              className="accent-blue-600 shrink-0"
              {...register('type')}
            />
            Short answer
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-5">
        <label htmlFor="question-prompt" className="font-semibold text-sm">
          Prompt <span className="text-blue-600">*</span>
        </label>
        <textarea
          id="question-prompt"
          placeholder={`e.g. What does this log?\n\`\`\`\nconsole.log(typeof null)\n\`\`\``}
          className={`w-full px-3 py-3 border rounded-lg bg-white text-slate-900 outline-none focus:border-blue-600 focus:shadow-focus duration-120 resize-y min-h-[88px] ${errors.prompt ? 'border-red-500' : 'border-slate-200'}`}
          {...register('prompt', { required: 'A question prompt is required.' })}
        />
        {errors.prompt && (
          <div className="text-red-600 text-[13px] font-medium">{errors.prompt.message}</div>
        )}
      </div>

      {type === 'mcq' && (
        <div className="flex flex-col gap-2 mb-5">
          <label className="font-semibold text-sm">
            Options <span className="text-slate-400 text-[12.5px]">(select the correct one)</span>
          </label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="radio"
                  value={index}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: 'var(--color-blue-600)',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                  {...register('correctAnswerIndex', {
                    required: 'Select the correct answer',
                  })}
                />
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  className="w-full px-3 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 outline-none focus:border-blue-600 focus:shadow-focus duration-120"
                  {...register(`options.${index}.value`, { required: 'Option text is required' })}
                />
                {fields.length > 2 && (
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 cursor-pointer grid place-items-center text-sm duration-120 hover:bg-red-50 hover:text-red-800 hover:border-red-200"
                    onClick={handleRemoveOption(index)}
                    aria-label="Remove option"
                  >
                    ✕
                  </button>
                )}
              </div>
              {errors.options?.[index]?.value && (
                <div className="text-red-600 text-[13px] font-medium ml-7 mb-2">
                  {errors.options[index].value.message}
                </div>
              )}
            </div>
          ))}
          {errors.correctAnswerIndex && (
            <div className="text-red-600 text-[13px] font-medium">
              {errors.correctAnswerIndex.message}
            </div>
          )}
          {fields.length < MCQ_MAX_OPTIONS && (
            <button
              type="button"
              className="mt-1 px-5 py-3 border border-slate-200 bg-white text-slate-900 text-sm font-semibold rounded-lg duration-120 hover:bg-slate-50 hover:border-slate-300"
              onClick={handleAddOption}
            >
              + Add option
            </button>
          )}
        </div>
      )}

      {type === 'short' && (
        <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="correct-answer" className="font-semibold text-sm">
            Accepted answer <span className="text-slate-400 text-[12.5px]">(case-insensitive)</span>
          </label>
          <input
            id="correct-answer"
            type="text"
            placeholder="e.g. JSON.parse"
            className={`w-full px-3 py-3 border rounded-lg bg-white text-slate-900 outline-none focus:border-blue-600 focus:shadow-focus duration-120 ${errors.correctAnswerText ? 'border-red-500' : 'border-slate-200'}`}
            {...register('correctAnswerText', { required: 'Provide the accepted answer.' })}
          />
          {errors.correctAnswerText && (
            <div className="text-red-600 text-[13px] font-medium">
              {errors.correctAnswerText.message}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-55 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg duration-120"
        >
          {isLoading ? 'Saving…' : (submitLabel ?? '+ Add Question')}
        </button>
        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        {onCancel && (
          <button
            type="button"
            className="px-5 py-3 border border-slate-200 bg-white text-slate-900 text-sm font-semibold rounded-lg duration-120 hover:bg-slate-50 hover:border-slate-300"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default QuestionForm
