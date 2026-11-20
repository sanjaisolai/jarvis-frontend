interface Article {
  title: string
  description?: string
  url?: string
  image?: string
}


interface Props {
  title?: string
  articles?: Article[]
}


function NewsCard({
  title = 'News',
  articles = [],
}: Props) {

  return (
    <div
      className="
        flex
        h-full
        w-full
        flex-col
        overflow-hidden
        bg-slate-950
        p-4
        text-white
      "
    >

      {/* Header */}

      <h2
        className="
          mb-3
          shrink-0
          text-lg
          font-semibold
        "
      >
        {title}
      </h2>


      {/* Scrollable content */}

      <div
        className="
          min-h-0
          flex-1
          space-y-3
          overflow-y-auto
          pr-1
        "
      >

        {articles.map(
          (article, index) => (

            <div
              key={index}
              className="
                rounded-xl
                bg-slate-900
                p-4
                transition
                hover:bg-slate-800
              "
            >

              <h3
                className="
                  font-medium
                  text-white
                "
              >
                {article.title}
              </h3>


              {article.description && (

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-400
                  "
                >
                  {article.description}
                </p>

              )}

            </div>

          )
        )}

      </div>

    </div>
  )
}


export default NewsCard