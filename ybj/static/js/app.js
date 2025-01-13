
const DEFAULT_LANG = 'en'
const SUPPORTED_LANG = {
    'en': {
        err: 'Error',
        pepw: 'Please enter password.',
        pwcnbe: 'Password is empty!',
        enpw: 'Enter a new password(Keeping it empty will remove the current password)',
        pwss: 'Password set successfully.',
        pwrs: 'Password removed successfully.',
        cpys: 'Copied!',
								submit: 'Submit',  // 添加 submit 键
        cancel: 'Cancel',  // 添加 cancel 键
								
    },
    'zh': {
        err: '出错了',
        pepw: '请输入密码',
        pwcnbe: '密码不能为空！',
        enpw: '输入新密码',
        pwss: '密码设置成功！',
        pwrs: '密码清除成功！',
        cpys: '已复制',
							 submit: '提交',  // 添加 submit 键
        cancel: '取消',  // 添加 cancel 键							
    }
}

const getI18n = key => {
    const userLang = (navigator.language || navigator.userLanguage || DEFAULT_LANG).split('-')[0]
    const targetLang = Object.keys(SUPPORTED_LANG).find(l => l === userLang) || DEFAULT_LANG
    return SUPPORTED_LANG[targetLang][key]
}

const errHandle = (err) => {
    alert(`${getI18n('err')}: ${err}`)
}

const throttle = (func, delay) => {
    let tid = null

    return (...arg) => {
        if (tid) return;

        tid = setTimeout(() => {
            func(...arg)
            tid = null
        }, delay)
    }
}

const passwdPrompt = () => {
    // 创建自定义弹窗元素
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    const input = document.createElement('input');
    const submitBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    // 设置自定义样式
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = 9999;

    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    modalContent.style.textAlign = 'center';
				
					// 设置密码输入框的背景色和字体颜色
				input.type = 'text';  // 保持类型为 'text'
				input.style.padding = '10px';
				input.style.marginBottom = '10px';
				input.style.border = '1px solid #ccc';
				input.style.borderRadius = '5px';
				input.style.backgroundColor = 'black';  // 设置背景为黑色
				input.style.color = 'black';  // 设置字体为黑色
				input.style.textShadow = '0 0 0 #000';  // 避免文本在黑色背景下模糊

    input.style.padding = '10px';
    input.style.marginBottom = '10px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '5px';

    submitBtn.style.padding = '10px 20px';
    submitBtn.style.marginRight = '10px';
    submitBtn.style.border = 'none';
    submitBtn.style.backgroundColor = '#4CAF50';
    submitBtn.style.color = '#fff';
    submitBtn.style.cursor = 'pointer';

    cancelBtn.style.padding = '10px 20px';
    cancelBtn.style.border = 'none';
    cancelBtn.style.backgroundColor = '#f44336';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.cursor = 'pointer';

    submitBtn.innerText = getI18n('submit');
    cancelBtn.innerText = getI18n('cancel');

    // 将元素添加到页面
    modalContent.appendChild(input);
    modalContent.appendChild(submitBtn);
    modalContent.appendChild(cancelBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // 当用户点击提交时
    submitBtn.onclick = () => {
        const passwd = input.value.trim();
        if (!passwd) {
            alert(getI18n('pwcnbe'));
            return;
        }

        const path = location.pathname;
        window.fetch(`${path}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ passwd }),
        })
            .then(res => res.json())
            .then(res => {
                if (res.err !== 0) {
                    return errHandle(res.msg);
                }
                if (res.data.refresh) {
                    window.location.reload();
                }
            })
            .catch(err => errHandle(err));

        // 关闭自定义弹窗
        document.body.removeChild(modal);
    };

    // 当用户点击取消时
    cancelBtn.onclick = () => {
        document.body.removeChild(modal);
    };
};

const renderPlain = (node, text) => {
    if (node) {
        node.innerHTML = DOMPurify.sanitize(text)
    }
}

const renderMarkdown = (node, text) => {
    if (node) {
        const parseText = marked.parse(text)
        node.innerHTML = DOMPurify.sanitize(parseText)
    }
}

window.addEventListener('DOMContentLoaded', function () {
    const $textarea = document.querySelector('#contents')
    const $loading = document.querySelector('#loading')
    const $pwBtn = document.querySelector('.opt-pw')
    const $modeBtn = document.querySelector('.opt-mode > input')
    const $shareBtn = document.querySelector('.opt-share > input')
    const $previewPlain = document.querySelector('#preview-plain')
    const $previewMd = document.querySelector('#preview-md')
    const $shareModal = document.querySelector('.share-modal')
    const $closeBtn = document.querySelector('.share-modal .close-btn')
    const $copyBtn = document.querySelector('.share-modal .opt-button')
    const $shareInput = document.querySelector('.share-modal input')

    renderPlain($previewPlain, $textarea.value)
    renderMarkdown($previewMd, $textarea.value)

    if ($textarea) {
        $textarea.oninput = throttle(function () {
            renderMarkdown($previewMd, $textarea.value)

            $loading.style.display = 'inline-block'
            const data = {
                t: $textarea.value,
            }

            window.fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data),
            })
                .then(res => res.json())
                .then(res => {
                    if (res.err !== 0) {
                        errHandle(res.msg)
                    }
                })
                .catch(err => errHandle(err))
                .finally(() => {
                    $loading.style.display = 'none'
                })
        }, 1000)
    }

    if ($pwBtn) {
    $pwBtn.onclick = function () {
        // 创建自定义弹窗元素
        const modal = document.createElement('div');
        const modalContent = document.createElement('div');
        const input = document.createElement('input');
        const submitBtn = document.createElement('button');
        const cancelBtn = document.createElement('button');

        // 设置自定义样式
        modal.style.position = 'fixed';
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = 9999;

        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        modalContent.style.textAlign = 'center';
								
								// 设置密码输入框的背景色和字体颜色
        input.type = 'text';  // 保持类型为 'text'
        input.style.padding = '10px';
        input.style.marginBottom = '10px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';
        input.style.backgroundColor = 'black';  // 设置背景为黑色
        input.style.color = 'black';  // 设置字体为黑色
        input.style.textShadow = '0 0 0 #000';  // 避免文本在黑色背景下模糊

        input.style.padding = '10px';
        input.style.marginBottom = '10px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';

        submitBtn.style.padding = '10px 20px';
        submitBtn.style.marginRight = '10px';
        submitBtn.style.border = 'none';
        submitBtn.style.backgroundColor = '#4CAF50';
        submitBtn.style.color = '#fff';
        submitBtn.style.cursor = 'pointer';

        cancelBtn.style.padding = '10px 20px';
        cancelBtn.style.border = 'none';
        cancelBtn.style.backgroundColor = '#f44336';
        cancelBtn.style.color = '#fff';
        cancelBtn.style.cursor = 'pointer';

        submitBtn.innerText = getI18n('submit');
        cancelBtn.innerText = getI18n('cancel');

        // 将元素添加到页面
        modalContent.appendChild(input);
        modalContent.appendChild(submitBtn);
        modalContent.appendChild(cancelBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // 当用户点击提交时
        submitBtn.onclick = () => {
            const passwd = input.value.trim();
            if (!passwd) {
                alert(getI18n('pwcnbe'));
                return;
            }

            const path = window.location.pathname;
            window.fetch(`${path}/pw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passwd: passwd,
                }),
            })
                .then(res => res.json())
                .then(res => {
                    if (res.err !== 0) {
                        return errHandle(res.msg);
                    }
                    alert(passwd ? getI18n('pwss') : getI18n('pwrs'));
                })
                .catch(err => errHandle(err));

            // 关闭自定义弹窗
            document.body.removeChild(modal);
        };

        // 当用户点击取消时
        cancelBtn.onclick = () => {
            document.body.removeChild(modal);
        };
    };
}


    if ($modeBtn) {
        $modeBtn.onclick = function (e) {
            const isMd = e.target.checked
            const path = window.location.pathname
            window.fetch(`${path}/setting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mode: isMd ? 'md' : 'plain',
                }),
            })
                .then(res => res.json())
                .then(res => {
                    if (res.err !== 0) {
                        return errHandle(res.msg)
                    }

                    window.location.reload()
                })
                .catch(err => errHandle(err))
        }
    }

    if ($shareBtn) {
        $shareBtn.onclick = function (e) {
            const isShare = e.target.checked
            const path = window.location.pathname
            window.fetch(`${path}/setting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    share: isShare,
                }),
            })
                .then(res => res.json())
                .then(res => {
                    if (res.err !== 0) {
                        return errHandle(res.msg)
                    }

                    if (isShare) {
                        const origin = window.location.origin
                        const url = `${origin}/share/${res.data}`
                        // show modal
                        $shareInput.value = url
                        $shareModal.style.display = 'block'
                    }
                })
                .catch(err => errHandle(err))
        }
    }

    if ($shareModal) {
        $closeBtn.onclick = function () {
            $shareModal.style.display = 'none'

        }
        $copyBtn.onclick = function () {
            clipboardCopy($shareInput.value)
            const originText = $copyBtn.innerHTML
            const originColor = $copyBtn.style.background
            $copyBtn.innerHTML = getI18n('cpys')
            $copyBtn.style.background = 'orange'
            window.setTimeout(() => {
                $shareModal.style.display = 'none'
                $copyBtn.innerHTML = originText
                $copyBtn.style.background = originColor
            }, 1500)
        }
    }

})
