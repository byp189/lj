// static CDN
export const CDN_PREFIX = '//gcore.jsdelivr.net/gh/byp189/lj@master/ybj/static'

// server side salt
export const SALT = SCN_SALT
// server side secret
export const SECRET = SCN_SECRET

// supported language
export const SUPPORTED_LANG = {
    'en': {
        setPW: '设密',
        changePW: '修密',
        share: '分享',
        lastModified: '近修',
        copy: '复制',
        emptyPH: 'IEAB专用,,被删后果自负',
        tipEncrypt: '此笔记已经有人用且加密',
        tip404: '404，你要找的东西并不存在',
    },
    'zh': {
        setPW: '设密',
        changePW: '修密',
        share: '分享',
        lastModified: '近修',
        copy: '复制',
        emptyPH: 'IEAB专用,,被删后果自负',
        tipEncrypt: '此笔记已经有人用且加密，<a href="https://bj.2536629.xyz" target="_blank">新增新笔记</a>',
        tip404: '404，你要找的东西并不存在',
    }
}
