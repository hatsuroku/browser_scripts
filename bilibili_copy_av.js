// ==UserScript==
// @name         复制 av 号链接
// @namespace    http://github.com/hatsuroku
// @version      0.0.1
// @description  复制 bilibili 视频的 av 号链接到剪贴板
// @author       Roku
// @match        https://www.bilibili.com/video/BV*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_log
// @run-at document-end
// ==/UserScript==

// Roku: BV 转 AV 代码摘抄自 http://www.atoolbox.net/Tool.php?Id=910

// 改写自 https://www.zhihu.com/question/381784377/answer/1099438784，并加上一些适当的处理
// 我这人虽然是写 JS 的，但是看 Python 不是问题
const table = [...'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'];
const s = [11, 10, 3, 8, 4, 6];
const xor = 177451812;
const add = 8728348608;

const av2bv = (av) => {
	let num = NaN;
	if (Object.prototype.toString.call(av) === '[object Number]') {
		num = av;
	} else if (Object.prototype.toString.call(av) === '[object String]') {
		num = parseInt(av.replace(/[^0-9]/gu, ''));
	};
	if (isNaN(num) || num <= 0) {
		// 网页版直接输出这个结果了
		return '¿你在想桃子？';
	};

	num = (num ^ xor) + add;
	let result = [...'BV1  4 1 7  '];
	let i = 0;
	while (i < 6) {
		// 这里改写差点犯了运算符优先级的坑
		// 果然 Python 也不是特别熟练
		// 说起来 ** 按照传统语法应该写成 Math.pow()，但是我个人更喜欢 ** 一些
		result[s[i]] = table[Math.floor(num / 58 ** i) % 58];
		i += 1;
	};
	return result.join('');
};

const bv2av = (bv) => {
	let str = '';
	if (bv.length === 12) {
		str = bv;
	} else if (bv.length === 10) {
		str = `BV${bv}`;
		// 根据官方 API，BV 号开头的 BV1 其实可以省略
		// 不过单独省略个 B 又不行（
	} else if (bv.length === 9) {
		str = `BV1${bv}`;
	} else {
		return '¿你在想桃子？';
	};
	if (!str.match(/[Bb][Vv][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/gu)) {
		return '¿你在想桃子？';
	};

	let result = 0;
	let i = 0;
	while (i < 6) {
		result += table.indexOf(str[s[i]]) * 58 ** i;
		i += 1;
	};
	return `av${result - add ^ xor}`;
};

function main() {
    'use strict';
	// GM_log('test if ok');
	// GM_log(location.href);
	const bvReg = new RegExp('(?<=/)BV.+?(?=/)');
	const bv = bvReg.exec(location.href)[0];
	GM_log(`find: [${bv}]`);
	GM_log(`av: [${bv2av(bv)}]`);



	let btn = document.createElement("span");
	btn.innerHTML = "复制av链接";
	btn.style.setProperty('padding-left', '20px');
	btn.style.setProperty('cursor', 'pointer');


	let shareBtn = document.querySelector("#share-btn-outer > div");
	let videoMsg = document.querySelector("#viewbox_report > div");

	videoMsg.appendChild(btn);
	// shareBtn.appendChild(btn);

	// toolBar.appendChild(btn);

	btn.addEventListener('click', (e) => {
        if (navigator.clipboard) {
            const text = `https://www.bilibili.com/video/${bv2av(bv)}`;
            GM_log(text);
            navigator.clipboard.writeText(text);
            e.target.innerHTML = '复制成功';
            setTimeout(() => {
                e.target.innerHTML = '复制 av 号链接';
            }, 1000);
        }
    });

	

};

setTimeout(main, 1000);