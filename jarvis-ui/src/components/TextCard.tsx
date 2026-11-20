interface Props {
  text?: string
}


function TextCard({
  text = '',
}: Props) {

  return (
    <div
      className="
        h-full
        w-full
        overflow-auto
        rounded-b-2xl
        bg-slate-900
        p-4
        text-sm
        text-white
      "
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  )
}



export default TextCard