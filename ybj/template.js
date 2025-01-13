import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CDN_PREFIX, SUPPORTED_LANG } from './constant'

dayjs.extend(relativeTime)

const SWITCHER = (text, open, className = '') => `
<span class="opt-desc">${text}</span>
<label class="opt-switcher ${className}">
  <input type="checkbox" ${open ? 'checked' : ''}>
  <span class="slider round"></span>
</label>
`
const FOOTER = ({ lang, isEdit, updateAt, pw, mode, share }) => `
    <div class="footer" >
        ${isEdit ? `
            <div class="opt">
                ${SWITCHER('MK', mode === 'md', 'opt-mode')}
                ${SWITCHER(SUPPORTED_LANG[lang].share, share, 'opt-share')}
				<button class="opt-button opt-pw">${pw ? SUPPORTED_LANG[lang].changePW : SUPPORTED_LANG[lang].setPW}</button>
				        <a class="xbj" title="点击建立随机新笔记" target="_blank" href="https://bj.2536629.xyz" rel="noreferrer">
            ${updateAt ? `<span class="last-modified">${SUPPORTED_LANG[lang].lastModified} ${dayjs.unix(updateAt).fromNow()}</span>` : ''}
        </a>
            </div>
        ` : ''}
    </div>
`
const MODAL = lang => `
<div class="modal share-modal">
    <div class="modal-mask"></div>
    <div class="modal-content">
        <span class="close-btn">x</span>
        <div class="modal-body">
            <input type="text" readonly value="" />
            <button class="opt-button">${SUPPORTED_LANG[lang].copy}</button>
        </div>
    </div>
</div>
`
const HTML = ({ lang, title, content, ext = {}, tips, isEdit, showPwPrompt }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} — IE**</title>
				<link href="${CDN_PREFIX}/css/app.css" rel="stylesheet" media="screen" />
</head>
<body>
    <div class="note-container">
        <div class="stack">
            <div class="layer_1">
                       ${tips ? `<div class="tips">${tips}</div>` : ''}
                        <textarea id="contents" class="contents ${isEdit ? '' : 'hide'}" spellcheck="true" placeholder="${SUPPORTED_LANG[lang].emptyPH}">${content}</textarea>
                        ${(isEdit && ext.mode === 'md') ? '<div class="divide-line"></div>' : ''}
                        ${tips || (isEdit && ext.mode !== 'md') ? '' : `<div id="preview-${ext.mode || 'plain'}" class="contents"></div>`}
            </div>
        </div>				
    </div>
    <div id="loading"></div>
    ${MODAL(lang)}
    ${FOOTER({ ...ext, isEdit, lang })}
    ${(ext.mode === 'md' || ext.share) ? `<script src="${CDN_PREFIX}/js/purify.min.js"></script>` : ''}
    ${ext.mode === 'md' ? `<script src="${CDN_PREFIX}/js/marked.min.js"></script>` : ''}
    <script src="${CDN_PREFIX}/js/clip.js"></script>
    <script src="${CDN_PREFIX}/js/app.js"></script>
    ${showPwPrompt ? '<script>passwdPrompt()</script>' : ''}
</body>
</html>
`

export const Edit = data => HTML({ isEdit: true, ...data })
export const Share = data => HTML(data)
export const NeedPasswd = data => HTML({ tips: SUPPORTED_LANG[data.lang].tipEncrypt, showPwPrompt: true, ...data })
export const Page404 = data => HTML({ tips: SUPPORTED_LANG[data.lang].tip404, ...data })
