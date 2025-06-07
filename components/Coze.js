import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Coze-AI机器人
 * @returns
 */
export default function Coze() {

  const loadCoze = async () => {
    await loadExternalResource(https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js)
    const CozeWebSDK = window?.CozeWebSDK
    if (CozeWebSDK) {
      const cozeClient = new CozeWebSDK.WebChatClient({
      config: {
        bot_id: '7512812008770388002',
      },
      componentProps: {
        title: 'Coze',
      },
      auth: {
        type: 'token',
        token: 'pat_4V2lzc4gCi6OccCOWRbxMlWCeecrXVTvwqXidTsuTF7TRA0RZguG9wis11qE3Gv9',
        onRefreshToken: function () {
          return 'pat_4V2lzc4gCi6OccCOWRbxMlWCeecrXVTvwqXidTsuTF7TRA0RZguG9wis11qE3Gv9'
      }
      })
      console.log('coze', cozeClient)
    }
  }

  useEffect(() => {
    loadCoze()
  }, [])
  return <></>
}
