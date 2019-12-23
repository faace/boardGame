var tinyPng = require('./tinyPng');
var fs = require('fs');


var hanle = function (list, static, progress, callback) {
    times = list.length * 3; // 每个最多尝试3次

    // var static = {
    //     fromSize: 0,
    //     toSize: 0,
    //     num: 0,
    // };
    let tinyOne = function (cb) {
        if (times-- < 1) {
            for (let i = 0; i < list.length; i++) static.all.push(list[i]);
            // console.log('还有以下图片没有处理', JSON.stringify(list, null, 2));

            console.log('异常结束');
            cb();
            return;
        }
        if (list.length < 1) {
            console.log('结束');
            cb();
            return;
        }
        // console.log('正在处理：' + list.length);

        let one = list.pop();
        let theFile = {
            contents: fs.readFileSync(one)
        };

        tinyPng.tiny(theFile, (err, data) => {
            if (err) {
                console.log(err);
                list.unshift(one);
            } else {
                static.fromSize += data.result.fromSize;
                static.toSize += data.result.toSize;
                static.num++;
                progress();
                fs.writeFileSync(one, new Buffer(data.result.body));
            }
            tinyOne(cb);
            // console.log(err, data);
        })
    };


    tinyOne(callback);
};
var afterAllCallback = function (num, cb) {
    var count = 0;
    return function () {
        if (++count >= num) {
            if (cb) {
                cb();
                cb = null;
            }
        }
    };
};
module.exports.run = function (num, all, cb) {
    console.log('一共有' + all.length + '个图片需要压缩，分' + num + '个线程');
    var static = { fromSize: 0, toSize: 0, all: [], ts: Date.now() };
    num = num || 1;
    let len = all.length;
    let eachNum = Math.ceil(all.length / num);
    let calllback = afterAllCallback(num, () => {
        static.ts = Date.now() - static.ts;
        cb(static)
    });
    let progress = function () {
        console.log('处理完：' + len--);
    };
    for (let i = 0; i < num; i++) {
        let list = [];
        for (let i = 0; i < eachNum && all.length; i++) {
            list.push(all.pop());
        }
        hanle(list, static, progress, calllback);
    }

};