interface JarvisOrbProps {
  active: boolean
  onDeactivate: () => void
}

function JarvisOrb({ active, onDeactivate }: JarvisOrbProps) {
  return (
    <div className="absolute bottom-12 right-8">
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={onDeactivate}
          className={`flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950/95 transition-all duration-300 ${active ? 'shadow-[0_0_50px_rgba(0,191,255,0.8)]' : 'shadow-[0_0_30px_rgba(0,191,255,0.5)]'}`}
        >
          <div className={`h-6 w-6 rounded-full bg-cyan-400 transition-all duration-300 ${active ? 'scale-125' : ''}`} />
        </button>
        <span className="mt-2 select-none text-[14px] tracking-[4px] text-white font-bold">
          {active ? 'LISTENING' : 'JARVIS'}
        </span>
      </div>
    </div>
  )
}

export default JarvisOrb