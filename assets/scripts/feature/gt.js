module.exports.init = () => {
    // 初始化所有数据
    window.gt = {
        afterAllCallback: function (num, cb) { // 如果有多个回调，设置后，就会在所有回调完再调用最后的一个回调
            var count = 0;
            return function () {
                if (++count >= num) {
                    if (cb) {
                        cb();
                        cb = null;
                    }
                }
            };
        },
        forEach: function (list, cb, finishedCb) {
            let i = -1;
            if (!Array.isArray(list)) {
                ge.log('需要优化');
            }
            let next = function () {
                i++;
                if (list.length <= i) return finishedCb();
                setTimeout(() => {
                    cb(list[i], i, next);
                }, 0);
            }
            next();
        },
        randIt: function (list) {
            return list[Math.floor(Math.random() * list.length)];
        }
    };

};

// tm.getString = function (text, width, fSize) {
//     var last = '…';
//     var currWidth = 0,
//         i = 0,
//         len = text.length;
//     while (i < len && currWidth < width) {
//         if (text.charCodeAt(i) < 256) currWidth += (fSize >> 1);
//         else currWidth += fSize;
//         i++;
//     }
//     if (i == len && currWidth < width) return text;
//     // 已经超长了
//     currWidth = 0;
//     i = 0;
//     len = text.length;
//     width -= fSize;
//     while (currWidth < width) {
//         if (text.charCodeAt(i) < 256) currWidth += (fSize >> 1);
//         else currWidth += fSize;
//         i++;
//     }
//     return text.substr(0, i - 1) + last;
// };

// tm.randomInt = function (minNum, maxNum) {
//     switch (arguments.length) {
//         case 1:
//             return parseInt(Math.random() * minNum + 1, 10);
//             break;
//         case 2:
//             return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
//             break;
//         default:
//             return 0;
//             break;
//     }
// };
