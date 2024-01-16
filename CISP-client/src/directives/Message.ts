import { MessageProviderProps, MessageOptions, MessageReactive } from 'naive-ui'

// 对ElMessage 进行二次封装
const message = (opts?: MessageProviderProps) => {
  return (content: string, options: MessageOptions) => {
    const defaultOptions: MessageOptions = { duration: 2000 }
    let timer: number | null = null
    const totalOptions = Object.assign(defaultOptions, opts || {}, options) // 全部的配置
    const onClose = totalOptions.onClose as (type?: string) => void | undefined
    const duration = totalOptions.duration
    totalOptions.onClose = () => {
      onClose && onClose('click')
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
    totalOptions.duration = 99999999999999

    // 处理关闭模型实例事件
    const handleClose = () => {
      destroy() // 关闭模型实例
      onClose && onClose() // 调用传入的函数
    }

    const { destroy } = window.$rawMessage.create(content, totalOptions) as MessageReactive

    timer = setTimeout(handleClose, duration) as unknown as number
    const messageInstance = document.querySelector('.n-message')
    if (messageInstance) {
      messageInstance.onmouseenter = () => {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
      }
      messageInstance.onmouseleave = () => {
        timer = setTimeout(handleClose, duration) as unknown as number
      }
      messageInstance.onclick = () => {
        destroy()
        onClose && onClose('click')
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
      }
    }
  }
}

export default message
