import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'


/**
 * Coze-AI机器人 - 使用官方安装代码
 * @returns
 */
export default function Coze() {
  const title = siteConfig('COZE_TITLE') || 'Coze'
  const botId = siteConfig('COZE_BOT_ID')
  const token = siteConfig('COZE_BOT_Token')

  useEffect(() => {
    // 检查必要配置
    if (!botId || !token) {
      console.warn('扣子配置不完整，请检查 COZE_BOT_ID 和 COZE_BOT_Token')
      return
    }

    // 动态加载扣子SDK
    const loadCozeSDK = () => {
      // 检查是否已经加载过SDK
      if (window.CozeWebSDK) {
        initializeCoze()
        return
      }

      // 创建script标签加载SDK
      const script = document.createElement('script')
      script.src = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js'
      script.onload = () => {
        console.log('扣子SDK加载成功')
        initializeCoze()
      }
      script.onerror = () => {
        console.error('扣子SDK加载失败')
      }
      document.head.appendChild(script)
    }

    // 初始化扣子客户端 - 直接使用官方代码结构
    const initializeCoze = () => {
      try {
        new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: botId,
          },
          componentProps: {
            title: title,
          },
          auth: {
            type: 'token',
            token: token,
            onRefreshToken: function () {
              return token
            }
          }
        })
        console.log('扣子客户端初始化成功')
      } catch (error) {
        console.error('扣子客户端初始化失败:', error)
      }
    }

    loadCozeSDK()
  }, [botId, token, title])

  return <></>
}
