import type {
  Dispatch,
  SetStateAction,
} from 'react'

import type {
  UIComponent,
} from '../types/ui'


interface TestDynamicUIButtonProps {
  setUiComponents:
    Dispatch<SetStateAction<UIComponent[]>>
}


function TestDynamicUIButton({
  setUiComponents,
}: TestDynamicUIButtonProps) {

  const showTestComponents = () => {

    setUiComponents([

      // --------------------------------
      // 1. News - Top Right
      // --------------------------------

      {
        id: 'test-news',

        type: 'news',

        layout: {
          position: 'top-right',

          width: 360,

          height: 240,

          zIndex: 10,
        },

        props: {
          title: 'Latest AI News',

          articles: [
            {
              title:
                'OpenAI releases a new model',

              description:
                'A new AI model was announced.',
            },

            {
              title:
                'AI agents are becoming more capable',

              description:
                'Agentic systems continue to evolve.',
            },
          ],
        },
      },


      // --------------------------------
      // 2. Video - Bottom Left
      // --------------------------------

      {
        id: 'test-video',

        type: 'video',

        layout: {
          position: 'bottom-left',

          width: 420,

          height: 280,

          zIndex: 10,
        },

        props: {
          title: 'Test Video',

          // Replace this with a valid
          // video URL if you want playback.
          url: 'https://www.youtube.com/embed/a_Lec99UBP4',
        },
      },


      // --------------------------------
      // 3. Text - Custom Position
      // --------------------------------

      {
        id: 'test-text',

        type: 'text',

        layout: {
          position: 'custom',

          x: 500,

          y: 250,

          width: 320,

          height: 120,

          zIndex: 20,
        },

        props: {
          text:
            'This component uses custom positioning.',
        },
      },

    ])
  }


  return (
    <button
      type="button"
      onClick={showTestComponents}
      className="
        rounded-lg
        bg-cyan-500
        px-4
        py-2
        text-black
        transition
        hover:bg-cyan-400
      "
    >
      Test Dynamic UI
    </button>
  )
}


export default TestDynamicUIButton