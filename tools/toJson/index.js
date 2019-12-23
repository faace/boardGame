console.time('toJson');
let dataFactory = require("./dataFactory");
let parseFile = require("./parseFile");
let fs = require('fs-extra'), path = require('path');
let md5Func = require('../../assets/scripts/core/md5');
let cmd = require('child_process');


Date.prototype.format = function (fmt) { //author: meizz
    // yyyy-MM-dd hh mm ss
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

//递归删除文件夹
function deleteall(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

var srcPath = path.join(__dirname, '../../info/xlsConf');
var dstPath = path.join(__dirname, '../../info/dbConf');
var dstZipFile = path.join(__dirname, '../../assets/resources/all.myconf');
var xlsConfFile = path.join(__dirname, '../../assets/scripts/feature/xlsConf.js');
deleteall(dstPath);
fs.mkdirsSync(dstPath);
let files = fs.readdirSync(srcPath);
var xlsConfigs = [];
var allData = {};

// 一些预处理，调整顺序
let orders = ['id2Attr', 'items'];
files.sort((a, b) => {
    let idxA = orders.indexOf(a.replace('.xlsx', ''));
    let idxB = orders.indexOf(b.replace('.xlsx', ''));
    return idxB - idxA;
});

// 处理所有的xls文件，并生成到对应的位置
for (let i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.indexOf('.xlsx') < 0) continue;
    if (file.indexOf('$') >= 0) continue;

    let data = parseFile.parse(path.join(srcPath, file));

    let reData = dataFactory.process(file, data, allData); // 对拿出的数据进行 [特殊]处理
    for (let name in reData) {
        let one = reData[name];
        allData[name] = one; // 记录所有的数据
        fs.writeFileSync(path.join(dstPath, name + '.json'), JSON.stringify(one, null, 2)); // 用于平时浏览
        xlsConfigs.push(name);
    }
}

// 对xlsConfig文件处理

// 消息头
let ccData = '';
var src = fs.readFileSync(xlsConfFile, { encoding: 'utf-8' });
var idx = src.indexOf('-Name-List-Begin-');
ccData += src.substr(0, idx + '-Name-List-Begin-'.length);
src = src.substr(idx + '-Name-List-Begin-'.length);
ccData += "\n           '" + xlsConfigs.join("','") + "'\n";
idx = src.indexOf('            // ======= -Name-List-End-');
ccData += src.substr(idx);
fs.writeFileSync(xlsConfFile, ccData);// 写入文件


//将xlsx文件转化的josn文件压缩在一起
let fromPath = path.join(dstPath, './*.json');
// haozipc a -tzip all.myconf .\xlsConfigs\*.json
if (fs.existsSync(dstZipFile)) fs.unlinkSync(dstZipFile);
cmd.execFile('haozipc', ['a', '-tzip', dstZipFile, fromPath], {}, function (err, stdout, stderr) {
    if (err) return console.log(err);
    console.log('成功产生 all.myconf');


    // let md5 = md5Func(new Uint8Array(fs.readFileSync(dstZipFile)));
    // md5 = new Date().format('yyyyMMdd_hhmmss') + '_' + md5;
    // console.log(md5);
    // fs.copyFileSync(tmpFile, path.join(confPath, './' + md5 + '.myconf'));
    // console.log('all.myconf的版本号：' + md5);
    // console.log('all.myconf的热更文件在这里：' + confPath);
});


console.timeEnd('toJson');