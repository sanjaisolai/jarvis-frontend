import type {
  Dispatch,
  ReactNode,
  SetStateAction,
} from 'react'

import {
  Rnd,
} from 'react-rnd'

import type {
  UIComponent,
} from '../types/ui'


interface DynamicWindowProps {
  component: UIComponent

  setComponents:
    Dispatch<SetStateAction<UIComponent[]>>

  children: ReactNode
}


function DynamicWindow({
  component,
  setComponents,
  children,
}: DynamicWindowProps) {

  const {
    id,
    layout,
  } = component


  const bringToFront = () => {
    setComponents(previous => {
      const maxZIndex = Math.max(
        ...previous.map(item => item.layout.zIndex ?? 10),
        10
      )

      return previous.map(item => {
        if (item.id !== id) {
          return item
        }

        return {
          ...item,
          layout: {
            ...item.layout,
            zIndex: maxZIndex + 1,
          },
        }
      })
    })
  }

  // --------------------------------
  // Convert preset position → x/y
  // --------------------------------

  const getPosition = () => {

    if (layout.position === 'custom') {

      return {
        x: layout.x,
        y: layout.y,
      }

    }


    const width =
      layout.width

    const height =
      layout.height


    const screenWidth =
      window.innerWidth

    const screenHeight =
      window.innerHeight


    const margin = 32


    switch (layout.position) {

      case 'top-left':

        return {
          x: margin,
          y: margin,
        }


      case 'top-center':

        return {
          x:
            (screenWidth - width) / 2,
          y: margin,
        }


      case 'top-right':

        return {
          x:
            screenWidth -
            width -
            margin,

          y: margin,
        }


      case 'center-left':

        return {
          x: margin,

          y:
            (screenHeight - height) / 2,
        }


      case 'center':

        return {
          x:
            (screenWidth - width) / 2,

          y:
            (screenHeight - height) / 2,
        }


      case 'center-right':

        return {
          x:
            screenWidth -
            width -
            margin,

          y:
            (screenHeight - height) / 2,
        }


      case 'bottom-left':

        return {
          x: margin,

          y:
            screenHeight -
            height -
            margin,
        }


      case 'bottom-center':

        return {
          x:
            (screenWidth - width) / 2,

          y:
            screenHeight -
            height -
            margin,
        }


      case 'bottom-right':

        return {
          x:
            screenWidth -
            width -
            margin,

          y:
            screenHeight -
            height -
            margin,
        }

    }
  }


  const position =
    getPosition()


  // --------------------------------
  // Update position / size
  // --------------------------------

  const updateLayout = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {

    setComponents(
      previous =>
        previous.map(item => {

          if (item.id !== id) {
            return item
          }


          return {
            ...item,

            layout: {
              position: 'custom',

              x,
              y,

              width,
              height,

              zIndex:
                item.layout.zIndex,

              visible:
                item.layout.visible,
            },
          }

        })
    )
  }


  // --------------------------------
  // Close
  // --------------------------------

  const closeWindow = () => {

    setComponents(
      previous =>
        previous.filter(
          item =>
            item.id !== id
        )
    )
  }


  return (
    <Rnd

      bounds="window"

      position={position}

      size={{
        width: layout.width,
        height: layout.height,
      }}

      minWidth={280}

      minHeight={120}

      maxWidth={
        window.innerWidth * 0.9
      }

      maxHeight={
        window.innerHeight * 0.9
      }

      dragHandleClassName="jarvis-window-header"


      onDragStop={(
        _event,
        data,
      ) => {

        updateLayout(
          data.x,
          data.y,
          layout.width,
          layout.height,
        )

      }}


      onResizeStop={(
        _event,
        _direction,
        ref,
        _delta,
        position,
      ) => {

        updateLayout(
          position.x,
          position.y,
          ref.offsetWidth,
          ref.offsetHeight,
        )

      }}


      style={{
        zIndex:
          layout.zIndex ?? 10,
      }}

      onMouseDown={bringToFront}

    >

      <div
        className="
          flex
          h-full
          w-full
          flex-col
          overflow-hidden 
          border
          border-slate-700/80
          bg-slate-950/95
          shadow-2xl
          backdrop-blur-xl
        "
      >

        {/* Header */}

        <div
          className="
            jarvis-window-header
            flex
            h-10
            shrink-0
            cursor-move
            items-center
            justify-between
            border-b
            border-slate-800
            bg-slate-900/90
            px-3
            select-none
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-medium
              text-slate-300
            "
          >

            <div
              className="
                h-2
                w-2
                rounded-full
                bg-cyan-400
              "
            />

            Jarvis

          </div>


          <button
            type="button"
            onClick={closeWindow}
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-md
              text-slate-400
              transition
              hover:bg-red-500/20
              hover:text-red-400
            "
          >
            ×
          </button>

        </div>


        {/* Content */}

        <div
          className="
            min-h-0
            flex-1
            overflow-hidden
          "
        >
          {children}
        </div>

      </div>

    </Rnd>
  )
}


export default DynamicWindow