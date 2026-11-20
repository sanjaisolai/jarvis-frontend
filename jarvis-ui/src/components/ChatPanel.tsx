import { jarvisSocket } from '../services/jarvisSocket'

interface ChatPanelProps {
  response: string
  isThinking: boolean
}

function ChatPanel({ response, isThinking }: ChatPanelProps) {
  return (
    <div className="absolute bottom-32 right-8 w-[420px] rounded-2xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl">
      <div className="mb-3 max-h-[250px] overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-white">
        {response || <span className="text-slate-500">Ask Jarvis something...</span>}
        {isThinking && <span className="ml-1 animate-pulse text-cyan-400">▌</span>}
      </div>
      <input
        autoFocus
        placeholder="Ask Jarvis..."
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
        onKeyDown={(event) => {
          if (event.key !== 'Enter') {
            return
          }

          const input = event.currentTarget
          const content = input.value.trim()

          if (!content) {
            return
          }

          jarvisSocket.sendMessage(content)
          input.value = ''
        }}
      />
    </div>
  )
}

export default ChatPanel