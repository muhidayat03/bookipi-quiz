interface Props {
  prompt: string
}

const PromptDisplay = ({ prompt }: Props) => {
  const parts: React.ReactNode[] = []
  const regex = /(`{3,})[^\n]*\n?([\s\S]*?)\1/g
  let last = 0
  let match

  while ((match = regex.exec(prompt)) !== null) {
    if (match.index > last)
      parts.push(<span key={last}>{prompt.slice(last, match.index)}</span>)
    parts.push(
      <pre key={match.index} className="font-mono text-sm leading-relaxed bg-slate-900 text-slate-200 rounded-lg px-4 py-4 overflow-x-auto mt-3 mb-3 whitespace-pre">
        {match[2]}
      </pre>
    )
    last = match.index + match[0].length
  }

  if (last < prompt.length) parts.push(<span key={last}>{prompt.slice(last)}</span>)

  return <>{parts}</>
}

export default PromptDisplay
