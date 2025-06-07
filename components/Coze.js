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
  const toKen = siteConfig('COZE_BOT_Token')

  const loadCoze = async () => {
    await loadExternalResource(cozeSrc)
    const CozeWebSDK = window?.CozeWebSDK
    if (CozeWebSDK) {
      const cozeClient = new CozeWebSDK.WebChatClient({
        config: {
          bot_id: botId
        },
        componentProps: {
          title: title
        },
        auth: {
        type: 'token',
        token: toKen,
        onRefreshToken: function () {
          return toKen
        }
      }
      })
      console.log('coze', cozeClient)
    }
  }

  useEffect(() => {
    if (!botId) {
      return
    }
    loadCoze()
  }, [])
  return <></>
}
