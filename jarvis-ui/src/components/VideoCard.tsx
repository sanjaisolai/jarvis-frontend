interface Props {
  title?: string
  url?: string
}


function VideoCard({
  title = 'Video',
  url,
}: Props) {

  return (
    <div
      className="
        flex
        h-full
        w-full
        flex-col
        overflow-hidden
        bg-black
      "
    >

      {/* Video title */}

      <div
        className="
          flex
          h-9
          shrink-0
          items-center
          border-b
          border-slate-800
          bg-slate-900
          px-3
          text-sm
          font-medium
          text-white
        "
      >
        {title}
      </div>


      {/* Video */}

      <div
        className="
          min-h-0
          flex-1
          bg-black
        "
      >

        {url && (

          <iframe
            src={url}
            title={title}
            className="
              h-full
              w-full
              border-0
            "
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
              web-share
            "
            allowFullScreen
          />

        )}

      </div>

    </div>
  )
}


export default VideoCard