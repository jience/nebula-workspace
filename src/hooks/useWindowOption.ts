import { getCurrentWindow } from '@tauri-apps/api/window'

export const useWindowOption = () => {
  const appWindow = getCurrentWindow()

  const handleMinus = () => {
    appWindow.minimize()
  }

  const handleMaximize = async () => {
    const isMaximized = await appWindow.isMaximized()
    if (isMaximized) {
      appWindow.unmaximize()
    } else {
      appWindow.maximize()
    }
  }

  const handleClose = () => {
    appWindow.close()
  }

  return {
    handleMinus,
    handleMaximize,
    handleClose,
  }
}
