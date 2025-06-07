import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Coze-AI机器人
 * @returns
 */
export default function Coze() {
  const cozeSrc = siteConfig('COZE_SRC_URL')
  const title = siteConfig('COZE_TITLE')
  const botId = siteConfig('COZE_BOT_ID')
  const token = siteConfig('COZE_BOT_Token') // 修复变量名

  const loadCoze = async () => {
    try {
      await loadExternalResource(cozeSrc)
      
      // 确保SDK已完全加载
      if (window?.CozeWebSDK?.WebChatClient) {
        const cozeClient = new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: botId
          },
          componentProps: {
            title: title
          },
          auth: {
            type: 'token',
            token: token, // 使用正确的变量名
            onRefreshToken: function () {
              return token // 使用正确的变量名
            }
          }
        })
        console.log('coze客户端初始化成功', cozeClient)
      } else {
        console.error('CozeWebSDK加载失败')
      }
    } catch (error) {
      console.error('加载扣子SDK失败:', error)
    }
  }

  useEffect(() => {
    // 检查必要的配置是否存在
    if (!botId || !token || !cozeSrc) {
      console.warn('扣子配置不完整:', { botId, token: token ? '已设置' : '未设置', cozeSrc })
      return
    }
    
    loadCoze()
  }, [botId, token, cozeSrc, title]) // 完善依赖数组

  return <></>
}
