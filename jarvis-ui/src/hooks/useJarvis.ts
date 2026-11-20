import { useEffect, useState } from 'react'

import {
  enableClickThrough,
  disableClickThrough,
} from '../services/window'

import {
  registerJarvisHotkey,
  unregisterJarvisHotkey,
} from '../services/hotkey'

import {
  jarvisSocket,
} from '../services/jarvisSocket'

import type {
  UIComponent,
} from '../types/ui'


export function useJarvis() {

  const [
    active,
    setActive,
  ] = useState(false)


  const [
    response,
    setResponse,
  ] = useState('')


  const [
    isThinking,
    setIsThinking,
  ] = useState(false)


  const [
    uiComponents,
    setUiComponents,
  ] = useState<UIComponent[]>([])


  // --------------------------------
  // WebSocket
  // --------------------------------

  useEffect(() => {

    jarvisSocket.connect()


    const unsubscribe =
      jarvisSocket.onMessage(
        (message) => {

          switch (message.type) {

            // ------------------------
            // Chat
            // ------------------------

            case 'chat.start':

              setResponse('')

              setIsThinking(true)

              break


            case 'chat.chunk':

              setResponse(
                previous =>
                  previous +
                  message.content
              )

              break


            case 'chat.end':

              setIsThinking(false)

              break


            case 'chat.error':

              setIsThinking(false)

              setResponse(
                `Error: ${message.error}`
              )

              break


            // ------------------------
            // UI CREATE
            // ------------------------

            case 'ui.create':
              setUiComponents(
                previous => [

                  ...previous,

                  message.component,

                ]
              )

              break


            // ------------------------
            // UI UPDATE
            // ------------------------

            case 'ui.update':
              setUiComponents(
                previous =>
                  previous.map(
                    component => {

                      if (
                        component.id !==
                        message.component.id
                      ) {

                        return component

                      }


                      return message.component

                    }
                  )
              )

              break


            // ------------------------
            // UI REMOVE
            // ------------------------

            case 'ui.remove':

              setUiComponents(
                previous =>
                  previous.filter(
                    component =>
                      component.id !==
                      message.id
                  )
              )

              break


            // ------------------------
            // UI CLEAR
            // ------------------------

            case 'ui.clear':

              setUiComponents([])

              break

          }

        }
      )


    return () => {

      unsubscribe()

      jarvisSocket.disconnect()

    }

  }, [])


  // --------------------------------
  // Global Hotkey
  // --------------------------------

  useEffect(() => {

    const setupHotkey =
      async () => {

        try {

          await registerJarvisHotkey(
            () => {

              setActive(
                previous =>
                  !previous
              )

            }
          )

        } catch (error) {

          console.error(
            'Failed to register Jarvis hotkey:',
            error
          )

        }

      }


    void setupHotkey()


    return () => {

      void unregisterJarvisHotkey()

    }

  }, [])


  // --------------------------------
  // Click Through
  // --------------------------------

  useEffect(() => {

    const updateClickThrough =
      async () => {

        try {

          if (active) {

            await disableClickThrough()

          } else {

            await enableClickThrough()

          }

        } catch (error) {

          console.error(
            'Failed to update click-through:',
            error
          )

        }

      }


    void updateClickThrough()

  }, [active])


  return {

    active,

    setActive,

    response,

    isThinking,

    uiComponents,

    setUiComponents,

  }

}