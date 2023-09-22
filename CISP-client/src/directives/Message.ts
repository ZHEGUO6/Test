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
    delete totalOptions.onClose
    totalOptions.duration = 99999999999999

    const { close } = ElMessage(totalOptions)
    timer = setTimeout(() => {
      close()
      onClose && onClose()
    }, duration) as unknown as number
    const messageInstance = document.getElementById(`message_${ind}`)!
    messageInstance.onmouseenter = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
    messageInstance.onmouseleave = () => {
      timer = setTimeout(() => {
        close()
        onClose && onClose()
      }, duration) as unknown as number
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

export default message
