import { ElMessage } from 'element-plus'
import { MessageOptions } from 'element-plus/lib/components'

let ind = 0

// 对ElMessage 进行二次封装
const message = (opts?: MessageOptions) => {
  return (options: MessageOptions) => {
    const defaultOptions: MessageOptions = { duration: 2000 }
    let timer: number | null = null
    ind++
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
      close() // 关闭模型实例
      onClose && onClose() // 调用传入的函数
    }

    const { close } = ElMessage(totalOptions)
    timer = setTimeout(handleClose, duration) as unknown as number
    const messageInstance = document.getElementById(`message_${ind}`)
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
        close()
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
