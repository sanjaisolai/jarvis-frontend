import { getCurrentWindow } from '@tauri-apps/api/window'
import { isTauri } from '@tauri-apps/api/core'

const jarvisWindow = getCurrentWindow()

export async function setClickThrough(
  enabled: boolean
) {
  if (!isTauri()) return

  try {
    await jarvisWindow.setIgnoreCursorEvents(enabled)
  } catch (error) {
    console.error('Failed to set click-through mode:', error)
  }
}

export async function enableClickThrough() {
  await setClickThrough(true)
}

export async function disableClickThrough() {
  await setClickThrough(false)
}