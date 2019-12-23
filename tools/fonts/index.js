
const Fontmin = require('fontmin');
const fs = require('fs-extra');
const path = require('path');
const scanPath = require('./scanPath');


// 先遍历文件夹下所有文件，找到所有汉字
let w = '头号矿工镐制造室普通镐特殊镐子制造属性伤害力量金币制造'
let words = { '头': true, '号': true, '矿': true, '工': true };
w.split('').forEach((one) => { words[one] = true; });
// let srcPath = path.join(__dirname, '../../build/web-mobile'); //  "C:\\work\\idle\\CC_IDLE\\build\\web-mobile";
let srcPath = path.join(__dirname, '../../build/wechatgame'); //  "C:\\work\\idle\\CC_IDLE\\build\\web-mobile";
// let srcPath2 = path.join(__dirname, '../../info/dbConf');
console.log('遍历目录：' + srcPath);
let num = 0;
let collect = '';
let handle = (file) => {
    // console.log(file);
    let txt = fs.readFileSync(file, { encoding: 'utf-8' });
    let pos = txt.indexOf('\\u');
    while (pos >= 0) {
        txt = txt.substr(pos);
        collect += txt.substr(0, 6);
        txt = txt.substr(6);
        pos = txt.indexOf('\\u');
    }

    for (let j = 0; j < txt.length; j++) {
        if (txt.charCodeAt(j) > 256) {
            if (!words[txt[j]]) {
                num++;
                words[txt[j]] = true;
            }
        }
    }
    // console.log(words);
};

scanPath.scan(srcPath, 'project.js', handle);
scanPath.scan(srcPath, '.json', handle);
// scanPath.scan(srcPath2, '.json', handle);
if (true) {
    eval('var hanzi="' + collect + '"');
    for (let j = 0; j < hanzi.length; j++) {
        if (hanzi.charCodeAt(j) > 256) {
            if (!words[hanzi[j]]) {
                num++;
                words[hanzi[j]] = true;
            }
        }
    }

    console.log('汉字个数：' + num);

    let srcTTFFile = 'from/main.ttf'; // 字体源文件
    // let srcTTFFile = 'from/方正华隶简体.ttf'; // 字体源文件
    var destPath = '../../assets/textures/fonts/';    // 输出路径
    // let destPath = './to/';    // 输出路径
    let text = ` ★【】!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_\`abcdefghijklmnopqrstuvwxyz{|}~'`;

    for (let i in words) text += i;
    console.log(text);
    // fs.writeFileSync("fonts.txt", text);
    let fontmin = new Fontmin()     // 初始化
        .src(srcTTFFile)               // 输入配置
        .use(Fontmin.glyph({        // 字型提取插件
            text: text              // 所需文字
        }))
        // .use(Fontmin.ttf2eot())     // eot 转换插件
        // .use(Fontmin.ttf2woff())    // woff 转换插件     
        // .use(Fontmin.ttf2svg())     // svg 转换插件
        // .use(Fontmin.css())         // css 生成插件
        .dest(destPath);            // 输出配置


    fontmin.run(function (err, files, stream) { // 执行
        if (err) console.error(err); // 异常捕捉

        console.log('done'); // 成功
    });
}