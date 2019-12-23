let threadNum = 1; // 两个线程，不容易出错
let target = 'wechatgame'; // 微信
// let target = 'web-mobile'; // 普通网页和轻应用
let all = [];
let targetPath = ''; // 可手动修改目录

// 这里可以手动修改all begin


/*
all = [
......
];
*/

// 这里可以手动修改all end


var thread = require('./thread');
var sp = require('./scanPath');
var path = require('path');

if (all.length < 1) {
    if (targetPath) {
        sp.scan(targetPath, '.png', (file) => all.push(file));
        sp.scan(targetPath, '.jpg', (file) => all.push(file));
    } else {
        // 'G:\\cocoscreator\\colorSwitch\\build\\wechatgame'
        sp.scan(path.join(__dirname, '../../build/' + target + '/res/raw-assets'), '.png', (file) => all.push(file));
        sp.scan(path.join(__dirname, '../../build/' + target + '/res/raw-assets'), '.jpg', (file) => all.push(file));
    }
}
console.log('正在处理：' + path.join(__dirname, '../../build/' + target));
thread.run(threadNum, all, (static) => {
    var formatByte = function (i) {
        let txt = ('' + i).split('');
        for (let i = txt.length - 1, j = 1; i > 0; i-- , j++) {
            if (j % 3 == 0) txt.splice(i, 0, ',');
        }
        return txt.join('');
    };
    console.log('统计信息：（大小来源于tinypng，不一定准确）');
    console.log('  fromsize:', formatByte(static.fromSize));
    console.log('  toSize:', formatByte(static.toSize));
    console.log('  ts:', formatByte(static.ts) + 'ms');
    if (static.all.length) {
        console.log('以下文件没下载：');
        console.log('');
        console.log('');
        console.log('all = ' + JSON.stringify(static.all, null, 2) + ';');
        console.log('');
        console.log('');
    }
})