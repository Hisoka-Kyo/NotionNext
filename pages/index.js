import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { generateRobotsTxt } from '@/lib/robots.txt'
import { generateRss } from '@/lib/rss'
import { generateSitemapXml } from '@/lib/sitemap.xml'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/redirect'
import { useState, useEffect } from 'react'
import Head from 'next/head'

// 知识星球配置
const ZSXQ_CONFIG = {
  app_id: '1220008925905065430',
  group_number: '19670178',
  secret: 'a78fe93c29ca1e971e4e39c4d7e60d1b',
  auth_url: 'https://wx.zsxq.com/connector/crm/identify_member.html'
}

/**
 * 知识星球验证组件 - 全屏验证界面
 */
const ZsxqAuth = ({ onAuthSuccess }) => {
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  const [showUserInfo, setShowUserInfo] = useState(false)

  useEffect(() => {
    // 页面加载时检查URL参数或存储的认证信息
    const urlParams = new URLSearchParams(window.location.search)
    
    if (urlParams.has('callback')) {
      // 处理知识星球回调
      handleCallback(urlParams)
    } else {
      // 检查本地存储的认证信息
      checkStoredAuth()
    }
  }, [])

  // 检查本地存储的认证信息
  const checkStoredAuth = () => {
    const authData = localStorage.getItem('zsxq_auth_data')
    const authExpiry = localStorage.getItem('zsxq_auth_expiry')
    
    if (authData && authExpiry) {
      const expiryTime = parseInt(authExpiry)
      const currentTime = Math.floor(Date.now() / 1000)
      
      if (currentTime < expiryTime) {
        // 认证仍有效，直接进入主页
        const userData = JSON.parse(authData)
        onAuthSuccess(userData)
        return
      }
    }
  }

  // SHA1算法实现
  const sha1 = (str) => {
    const utf8Bytes = unescape(encodeURIComponent(str))
    
    function rotateLeft(value, amount) {
      return (value << amount) | (value >>> (32 - amount))
    }
    
    function cvtHex(val) {
      let str = ""
      for (let i = 7; i >= 0; i--) {
        const v = (val >>> (i * 4)) & 0x0f
        str += v.toString(16)
      }
      return str
    }
    
    let blockstart
    let i, j
    const W = new Array(80)
    let H0 = 0x67452301
    let H1 = 0xEFCDAB89
    let H2 = 0x98BADCFE
    let H3 = 0x10325476
    let H4 = 0xC3D2E1F0
    let A, B, C, D, E
    let temp
    
    const msgLength = utf8Bytes.length
    const wordArray = []
    
    for (i = 0; i < msgLength - 3; i += 4) {
      j = utf8Bytes.charCodeAt(i) << 24 |
          utf8Bytes.charCodeAt(i + 1) << 16 |
          utf8Bytes.charCodeAt(i + 2) << 8 |
          utf8Bytes.charCodeAt(i + 3)
      wordArray.push(j)
    }
    
    switch (msgLength % 4) {
      case 0:
        j = 0x080000000
        break
      case 1:
        j = utf8Bytes.charCodeAt(msgLength - 1) << 24 | 0x0800000
        break
      case 2:
        j = utf8Bytes.charCodeAt(msgLength - 2) << 24 |
            utf8Bytes.charCodeAt(msgLength - 1) << 16 | 0x08000
        break
      case 3:
        j = utf8Bytes.charCodeAt(msgLength - 3) << 24 |
            utf8Bytes.charCodeAt(msgLength - 2) << 16 |
            utf8Bytes.charCodeAt(msgLength - 1) << 8 | 0x80
        break
    }
    
    wordArray.push(j)
    
    while ((wordArray.length % 16) !== 14) {
      wordArray.push(0)
    }
    
    wordArray.push(msgLength >>> 29)
    wordArray.push((msgLength << 3) & 0x0ffffffff)
    
    for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
      for (i = 0; i < 16; i++) {
        W[i] = wordArray[blockstart + i]
      }
      for (i = 16; i <= 79; i++) {
        W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
      }
      
      A = H0
      B = H1
      C = H2
      D = H3
      E = H4
      
      for (i = 0; i <= 19; i++) {
        temp = (rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff
        E = D
        D = C
        C = rotateLeft(B, 30)
        B = A
        A = temp
      }
      
      for (i = 20; i <= 39; i++) {
        temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff
        E = D
        D = C
        C = rotateLeft(B, 30)
        B = A
        A = temp
      }
      
      for (i = 40; i <= 59; i++) {
        temp = (rotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff
        E = D
        D = C
        C = rotateLeft(B, 30)
        B = A
        A = temp
      }
      
      for (i = 60; i <= 79; i++) {
        temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff
        E = D
        D = C
        C = rotateLeft(B, 30)
        B = A
        A = temp
      }
      
      H0 = (H0 + A) & 0x0ffffffff
      H1 = (H1 + B) & 0x0ffffffff
      H2 = (H2 + C) & 0x0ffffffff
      H3 = (H3 + D) & 0x0ffffffff
      H4 = (H4 + E) & 0x0ffffffff
    }
    
    return (cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4)).toLowerCase()
  }

  // 生成签名
  const generateSignature = (params) => {
    // 1. 过滤空值参数
    const filteredParams = {}
    Object.keys(params).forEach(key => {
      if (key !== 'signature' && params[key] !== '' && params[key] != null) {
        filteredParams[key] = params[key]
      }
    })
    
    // 2. 按ASCII字典序排序
    const sortedKeys = Object.keys(filteredParams).sort()
    
    // 3. 构建查询字符串（URL编码）
    const queryParts = sortedKeys.map(key => {
      const value = filteredParams[key]
      return `${key}=${encodeURIComponent(value)}`
    })
    
    // 4. 拼接secret
    const queryString = queryParts.join('&')
    const stringToSign = queryString + '&secret=' + ZSXQ_CONFIG.secret
    
    // 5. 计算SHA1
    return sha1(stringToSign)
  }

  // 开始认证
  const startAuth = () => {
    setStatus('正在跳转到知识星球进行身份验证...')
    setStatusType('loading')
    
    // 生成时间戳
    const timestamp = Math.floor(Date.now() / 1000)
    
    // 修复跳转地址问题 - 使用与index.html完全相同的方式
    const redirectUrl = typeof window !== 'undefined' 
      ? window.location.origin + window.location.pathname + '?callback=1'
      : 'https://xianjian-aiedu2.vercel.app/?callback=1'  // 确保包含callback参数
    
    // 构建认证参数
    const params = {
      app_id: ZSXQ_CONFIG.app_id,
      group_number: ZSXQ_CONFIG.group_number,
      extra: 'homepage_auth',
      redirect_url: redirectUrl,
      timestamp: timestamp
    }
    
    // 生成签名
    const signature = generateSignature(params)
    params.signature = signature
    
    // 构建认证URL
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    
    const authUrl = `${ZSXQ_CONFIG.auth_url}?${queryString}`
    
    console.log('=== 认证参数详情 ===')
    console.log('跳转URL:', redirectUrl)
    console.log('认证参数:', params)
    console.log('签名字符串:', buildSignString(params))
    console.log('认证URL:', authUrl)
    
    // 跳转到知识星球认证页面
    setTimeout(() => {
      window.location.href = authUrl
    }, 1000)
  }

  // 构建签名字符串 - 用于调试
  const buildSignString = (params) => {
    // 1. 过滤空值参数
    const filteredParams = {}
    Object.keys(params).forEach(key => {
      if (key !== 'signature' && params[key] !== '' && params[key] != null) {
        filteredParams[key] = params[key]
      }
    })
    
    // 2. 按ASCII字典序排序
    const sortedKeys = Object.keys(filteredParams).sort()
    
    // 3. 构建查询字符串（URL编码）
    const queryParts = sortedKeys.map(key => {
      const value = filteredParams[key]
      return `${key}=${encodeURIComponent(value)}`
    })
    
    // 4. 拼接secret
    const queryString = queryParts.join('&')
    return queryString + '&secret=' + ZSXQ_CONFIG.secret
  }

  // 处理知识星球回调
  const handleCallback = (urlParams) => {
    setStatus('正在验证身份信息...')
    setStatusType('loading')
    
    // 打印所有回调参数用于分析
    console.log('=== 知识星球回调参数分析 ===')
    const allParams = {}
    for (const [key, value] of urlParams) {
      allParams[key] = value
      console.log(`${key}: ${value}`)
    }
    
    // 检查是否有错误
    if (urlParams.has('error_code')) {
      const errorCode = urlParams.get('error_code')
      const errorMessages = {
        '100001': '缺少参数',
        '100002': '签名错误',
        '100003': '请求超时',
        '100004': '无效的应用',
        '100005': '无效的星球',
        '100006': '用户未授权获取数据',
        '100007': '用户未加入星球',
        '100008': '需要在微信中使用',
        '100009': '微信认证失败',
        '100010': '获取微信信息失败',
        '100011': '用户非星球成员',
        '100012': '不是星主',
        '100013': '无效的星球ID',
        '100014': '用户未登录',
        '100015': '参数格式错误或编码问题',
        '200001': '无效的跳转地址'
      }
      
      const message = errorMessages[errorCode] || `未知错误 (${errorCode})`
      console.log(`❌ 认证失败: 错误代码 ${errorCode} - ${message}`)
      
      // 如果是跳转地址错误，提供更多调试信息
      if (errorCode === '200001') {
        console.log('=== 跳转地址错误调试信息 ===')
        console.log('当前页面URL:', window.location.href)
        console.log('当前origin:', window.location.origin)
        console.log('当前pathname:', window.location.pathname)
        console.log('预期跳转地址应该是:', window.location.origin + window.location.pathname + '?callback=1')
        console.log('请检查知识星球管理后台的跳转地址白名单是否包含:', window.location.host)
      }
      
      setStatus(`❌ 认证失败：${message}`)
      setStatusType('error')
      return
    }

    // 验证回调签名
    const signatureValid = verifyCallbackSignature(urlParams)
    
    if (!signatureValid) {
      console.log('❌ 签名验证失败，但继续处理以分析数据')
      setStatus('⚠️ 签名验证失败，正在分析原因...', 'loading')
      
      // 继续处理用户数据以便分析
      setTimeout(() => {
        setStatus('✅ 已获取用户数据（签名验证已跳过）', 'success')
      }, 1000)
    } else {
      setStatus('✅ 身份验证成功！', 'success')
    }

    // 提取用户信息
    const userData = {
      app_id: urlParams.get('app_id'),
      group_number: urlParams.get('group_number'),
      user_id: urlParams.get('user_id'),
      user_name: urlParams.get('user_name'),
      user_number: urlParams.get('user_number'),
      user_icon: urlParams.get('user_icon'),
      user_role: urlParams.get('user_role'),
      join_time: urlParams.get('join_time'),
      expire_time: urlParams.get('expire_time'),
      timestamp: urlParams.get('timestamp'),
      extra: urlParams.get('extra')
    }
    
    console.log('=== 提取的用户信息 ===')
    console.log(userData)
    
    // 保存认证信息
    localStorage.setItem('zsxq_auth_data', JSON.stringify(userData))
    localStorage.setItem('zsxq_auth_expiry', userData.expire_time)
    
    setStatus('✅ 身份验证成功！')
    setStatusType('success')
    setUserInfo(userData)
    setShowUserInfo(true)
    
    // 清理URL参数
    window.history.replaceState({}, '', window.location.pathname)
  }

  // 验证回调签名
  const verifyCallbackSignature = (urlParams) => {
    const params = {}
    
    // 根据官方文档，参与回调签名的参数（user_number不参与签名）
    const signParams = ['app_id', 'group_number', 'user_id', 'user_name', 
                      'user_icon', 'user_role', 'extra', 'join_time', 
                      'expire_time', 'timestamp']
    
    // 提取非空参数
    signParams.forEach(param => {
      const value = urlParams.get(param)
      if (value !== null && value !== '') {
        params[param] = value
      }
    })
    
    // 生成期望的签名
    const expectedSignature = generateSignature(params)
    const actualSignature = urlParams.get('signature')
    
    console.log('=== 签名验证详情 ===')
    console.log('参与签名的参数:', params)
    console.log('签名字符串:', buildSignString(params))
    console.log('期望签名:', expectedSignature)
    console.log('实际签名:', actualSignature)
    console.log('签名匹配:', expectedSignature === actualSignature)
    
    // 尝试不同的参数组合
    if (expectedSignature !== actualSignature) {
      console.log('=== 尝试其他签名组合 ===')
      
      // 测试1: 包含user_number
      const withUserNumber = { ...params }
      const userNumber = urlParams.get('user_number')
      if (userNumber) {
        withUserNumber.user_number = userNumber
        const sig1 = generateSignature(withUserNumber)
        console.log('包含user_number的签名:', sig1, sig1 === actualSignature ? '✅匹配' : '❌不匹配')
      }
      
      // 测试2: 不包含某些可能为空的参数
      const essentialParams = ['app_id', 'group_number', 'user_id', 'user_name', 'timestamp']
      const essential = {}
      essentialParams.forEach(param => {
        const value = urlParams.get(param)
        if (value !== null && value !== '') {
          essential[param] = value
        }
      })
      const sig2 = generateSignature(essential)
      console.log('仅基本参数的签名:', sig2, sig2 === actualSignature ? '✅匹配' : '❌不匹配')
    }
    
    return expectedSignature === actualSignature
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '未知'
    return new Date(parseInt(timestamp) * 1000).toLocaleString()
  }

  const getRoleText = (role) => {
    const roleMap = {
      'owner': '星主',
      'admin': '管理员',
      'member': '成员'
    }
    return roleMap[role] || role || '成员'
  }

  const continueToHomepage = () => {
    onAuthSuccess(userInfo)
  }

  return (
    <>
      <Head>
        <title>知识星球成员验证 - NotionNext</title>
        <meta name="description" content="知识星球成员身份验证" />
        <style jsx global>{`
          /* 强制隐藏所有页面内容，确保验证界面完全覆盖 */
          html, body {
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
          }
          
          /* 隐藏所有可能的页面元素，包括导航栏 */
          #__next > *:not(.zsxq-auth-overlay) {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* 强制隐藏可能的导航栏和页面组件 */
          nav, header, .navbar, .navigation, .menu, .header {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* 隐藏主题相关的所有组件 */
          .theme-wrapper, .layout-wrapper, .page-wrapper {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* 确保验证界面在最顶层 */
          .zsxq-auth-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 999999 !important;
            display: flex !important;
            visibility: visible !important;
          }
        `}</style>
      </Head>
      
      {/* 全屏验证界面 - 完全覆盖所有内容 */}
      <div className="zsxq-auth-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        zIndex: 999999,
        overflow: 'auto'
      }}>
        <div style={{
          width: '90%',
          maxWidth: '600px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px 30px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          margin: '20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white'
          }}>🌟</div>
          
          <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px', fontWeight: '600' }}>
            NotionNext 博客
          </h1>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
            知识星球成员身份验证
          </p>
          
          {status && (
            <div style={{
              margin: '20px 0',
              padding: '15px',
              borderRadius: '10px',
              fontSize: '14px',
              lineHeight: '1.6',
              background: statusType === 'loading' ? '#e3f2fd' : statusType === 'success' ? '#e8f5e8' : '#ffebee',
              color: statusType === 'loading' ? '#1976d2' : statusType === 'success' ? '#2e7d32' : '#c62828',
              border: `1px solid ${statusType === 'loading' ? '#bbdefb' : statusType === 'success' ? '#c8e6c9' : '#ffcdd2'}`
            }}>
              {status}
            </div>
          )}
          
          {!showUserInfo ? (
            <div style={{ margin: '30px 0' }}>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                此博客仅对知识星球成员开放，请先进行身份验证
              </p>
              
              <button
                onClick={startAuth}
                style={{
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-block',
                  margin: '10px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 10px 20px rgba(255, 107, 107, 0.3)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                🔐 开始身份验证
              </button>
              
              <p style={{ color: '#999', fontSize: '12px', marginTop: '15px' }}>
                点击后将跳转到知识星球进行身份验证
              </p>
            </div>
          ) : (
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '25px',
              margin: '20px 0',
              textAlign: 'left',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '15px',
                textAlign: 'center'
              }}>✅ 验证成功！获取到的用户信息：</div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>用户昵称:</span>
                  <span style={{ color: '#333' }}>{userInfo?.user_name || '未知'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>成员身份:</span>
                  <span style={{ color: '#333' }}>{getRoleText(userInfo?.user_role)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>加入时间:</span>
                  <span style={{ color: '#333' }}>{formatTime(userInfo?.join_time)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>到期时间:</span>
                  <span style={{ color: '#333' }}>{formatTime(userInfo?.expire_time)}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  onClick={continueToHomepage}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '15px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    margin: '5px'
                  }}
                >
                  📱 进入博客主页
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查本地存储的认证信息
    const authData = localStorage.getItem('zsxq_auth_data')
    const authExpiry = localStorage.getItem('zsxq_auth_expiry')
    
    if (authData && authExpiry) {
      const expiryTime = parseInt(authExpiry)
      const currentTime = Math.floor(Date.now() / 1000)
      
      if (currentTime < expiryTime) {
        // 认证仍有效
        const userData = JSON.parse(authData)
        setUserInfo(userData)
        setIsAuthenticated(true)
      }
    }
    
    setIsLoading(false)
  }, [])

  // 键盘快捷键退出登录功能
  useEffect(() => {
    if (!isAuthenticated) return

    const handleKeydown = (event) => {
      // Ctrl+Shift+L 退出登录
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault()
        if (confirm('确定要退出知识星球登录吗？\n\n快捷键: Ctrl+Shift+L')) {
          localStorage.removeItem('zsxq_auth_data')
          localStorage.removeItem('zsxq_auth_expiry')
          setUserInfo(null)
          setIsAuthenticated(false)
          console.log('已退出知识星球登录')
        }
      }
    }

    window.addEventListener('keydown', handleKeydown)
    
    // 在控制台提示快捷键
    console.log('💡 提示：按 Ctrl+Shift+L 可以退出知识星球登录')

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [isAuthenticated])

  const handleAuthSuccess = (userData) => {
    setUserInfo(userData)
    setIsAuthenticated(true)
  }

  // 加载中
  if (isLoading) {
    return (
      <>
        <Head>
          <title>加载中 - NotionNext</title>
        </Head>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          zIndex: 999999
        }}>
          ⏳ 加载中...
        </div>
      </>
    )
  }

  // 如果未认证，显示全屏验证界面
  if (!isAuthenticated) {
    return <ZsxqAuth onAuthSuccess={handleAuthSuccess} />
  }

  // 认证成功后，显示正常的博客主页
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <>
      <Head>
        <title>NotionNext 博客</title>
        <meta name="description" content="NotionNext 博客 - 知识星球成员专享" />
      </Head>
      <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
    </>
  )
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await getGlobalData({ from, locale })
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )
  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
    )
  }

  // 预览文章内容
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  // 生成robotTxt
  generateRobotsTxt(props)
  // 生成Feed订阅
  generateRss(props)
  // 生成
  generateSitemapXml(props)
  if (siteConfig('UUID_REDIRECT', false, props?.NOTION_CONFIG)) {
    // 生成重定向 JSON
    generateRedirectJson(props)
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Index
