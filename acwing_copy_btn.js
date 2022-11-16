// ==UserScript==
// @name         ACWing 增加复制按钮
// @namespace    http://github.com/hatsuroku
// @version      0.0.1
// @description  给 ACWing 的样例输入增加一个复制按钮
// @author       Roku
// @match        https://www.acwing.com/problem/content/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acwing.com
// @grant        GM_log
// ==/UserScript==

(function() {
    'use strict';
    const btn = document.createElement("div");
    btn.className = "copy_btn";
    btn.innerHTML = "复制";
    const btnCss = {
        position: 'absolute',
        right: '2px',
        top: '2px',
        height: 'auto',
        background: '#37373C',
        color: '#f0f0f0',
        cursor: 'pointer',
        width: '10%',
        'text-align': 'center',
    };
    for (const k in btnCss) {
        btn.style.setProperty(k, btnCss[k]);
    }

    const inputTag = document.querySelector('pre.hljs');
    inputTag.style.setProperty('position', 'relative');
    inputTag.insertBefore(btn, inputTag.firstChild);

    btn.addEventListener('click', (e) => {
        if (navigator.clipboard) {
            const text = inputTag.lastChild.innerHTML;
            // GM_log(text);
            navigator.clipboard.writeText(text);
            e.target.innerHTML = '复制成功';
            setTimeout(() => {
                e.target.innerHTML = '复制';
            }, 1000);
        }
    });
})();