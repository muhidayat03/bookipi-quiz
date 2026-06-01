interface Props {
  title: string
  message?: string
  onRetry?: () => void
}

const ErrorCard = ({ title, message, onRetry }: Props) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-card p-10 text-center">
    <div className="text-red-500 font-semibold mb-2">{title}</div>
    {message && <p className="text-slate-500 text-sm mb-6">{message}</p>}
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg duration-120"
      >
        Retry
      </button>
    )}
  </div>
)

export default ErrorCard
