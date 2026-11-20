import type {
  UIComponent,
} from '../types/ui'


export type JarvisMessage =
  | {
      type: 'chat.start'
      id: string
    }

  | {
      type: 'chat.chunk'
      id: string
      content: string
    }

  | {
      type: 'chat.end'
      id: string
    }

  | {
      type: 'chat.error'
      id?: string
      error: string
    }

  | {
      type: 'ui.create'
      component: UIComponent
    }

  | {
      type: 'ui.update'
      component: UIComponent
    }

  | {
      type: 'ui.remove'
      id: string
    }

  | {
      type: 'ui.clear'
    }

type MessageHandler = (message: JarvisMessage) => void

class JarvisSocket {
  private socket: WebSocket | null = null
  private handlers: MessageHandler[] = []

  connect() {
  console.log('🔌 Connecting to Jarvis...')

  this.socket = new WebSocket(
    'ws://127.0.0.1:8765'
  )

  this.socket.onopen = () => {
    console.log('🟢 WebSocket OPEN')
  }

  this.socket.onclose = (event) => {
    console.log(
      '🔴 WebSocket CLOSED',
      event.code,
      event.reason
    )

    this.socket = null
  }

  this.socket.onerror = (error) => {
    console.error(
      '❌ WebSocket ERROR:',
      error
    )
  }

  this.socket.onmessage = (event) => {
    console.log(
      '📥 Received from Jarvis:',
      event.data
    )
    
    try {
      const message =
        JSON.parse(event.data)

      this.handlers.forEach(
        handler => handler(message)
      )

    } catch (error) {
      console.error(
        'Failed to parse message:',
        error
      )
    }
  }
}

  sendMessage(content: string) {
  console.log('Attempting to send:', content)

  console.log(
    'Socket:',
    this.socket
  )

  console.log(
    'Socket state:',
    this.socket?.readyState
  )

  console.log(
    'OPEN constant:',
    WebSocket.OPEN
  )

  if (
    !this.socket ||
    this.socket.readyState !== WebSocket.OPEN
  ) {
    console.error(
      '❌ WebSocket is NOT open'
    )

    return
  }

  const message = {
    type: 'chat.message',
    id: crypto.randomUUID(),
    content,
  }

  console.log(
    '📤 Sending:',
    message
  )

  this.socket.send(
    JSON.stringify(message)
  )

  console.log(
    '✅ Message sent'
  )
}

  onMessage(handler: MessageHandler) {
    this.handlers.push(handler)

    return () => {
      this.handlers =
        this.handlers.filter(
          (existingHandler) =>
            existingHandler !== handler
        )
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}

export const jarvisSocket =
  new JarvisSocket()