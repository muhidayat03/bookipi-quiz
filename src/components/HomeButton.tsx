import { useNavigate } from 'react-router'

interface Props {
  onNavigate?: () => void
}

const HomeButton = ({ onNavigate }: Props) => {
  const navigate = useNavigate()

  const handleClick = () => {
    onNavigate?.()
    navigate('/play')
  }

  return (
    <button
      onClick={handleClick}
      className="text-slate-500 text-sm font-medium mb-5 hover:text-slate-900 duration-120"
    >
      ← Home
    </button>
  )
}

export default HomeButton
