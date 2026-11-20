import {
  register,
  unregister,
  type ShortcutEvent,
} from '@tauri-apps/plugin-global-shortcut'

const TOGGLE_SHORTCUT = 'CommandOrControl+Space'

export async function registerJarvisHotkey(
  callback: () => void
) {
  console.log('Registering:', TOGGLE_SHORTCUT)

  await register(
    TOGGLE_SHORTCUT,
    (event: ShortcutEvent) => {

      console.log(
        'Shortcut event:',
        event.state
      )

      if (event.state === 'Pressed') {
        console.log('HOTKEY PRESSED')
        callback()
      }
    }
  )

  console.log('Hotkey registered successfully')
}

export async function unregisterJarvisHotkey() {
  await unregister(TOGGLE_SHORTCUT)
}