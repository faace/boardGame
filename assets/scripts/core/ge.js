module.exports = function (config) {
    let EMC = require("EventManager");
    window.ge = { // 全局唯一变量，一些常用的函数，和工具都放在合理
        config: config,

        log: console.log.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),

        md5: require("md5"),
        EM: new EMC(),
        JSZip: window.JSZip, // 字符串压缩工具

        mixins: function (from, to) {
            for (let i in from) {
                if (!from.hasOwnProperty(i)) continue;
                if (Array.isArray(from[i])) {
                    if (!to[i]) to[i] = [];
                    this.mixins(from[i], to[i]);
                } else if (typeof from[i] == 'object' && from[i] != null) {
                    if (!to[i]) to[i] = {};
                    this.mixins(from[i], to[i]);
                } else to[i] = from[i]
            }

        },
        deepCopy: function (from) {
            switch (typeof from) {
                case 'object':
                    if (from == null) return from;
                    var to;
                    if (Array.isArray(from)) {
                        to = [];
                        for (var i = 0; i < from.length; i++) {
                            if (typeof from[i] != 'function') to.push(ge.deepCopy(from[i]));
                        }
                    } else {
                        to = {};
                        for (var i in from) {
                            if (typeof from[i] != 'function') to[i] = ge.deepCopy(from[i]);
                        }
                    }
                    return to;
                case 'function': break;
                default: return from;
            }
            return undefined;
        },
    };
    require("gt").init();
    require('UIManager').init(); // UI工具类
    require('sdk').init(); // 加载sdk ge.sdk
    require('gd').init(); // 全局数据
    require('gu').init(); // 用户数据

    ge.sysTs = Date.now();

    setTimeout(() => {
        cc.debug.setDisplayStats(false);
    }, 1000);




    // ge.show = function () {
    //     let items = ge.xls.items;
    //     let recipes = ge.xls.recipes;
    //     for (let i in items) {
    //         let oneItems = items[i];
    //         let txt = i + '\t' + oneItems.cnName;
    //         for (let j in recipes) {
    //             let r = recipes[j]
    //             if (r.type == 7) continue;
    //             if (r.output == i) { // 可以合成
    //                 let recipe = r.recipe.split('&');
    //                 let list = [];
    //                 recipe.forEach(one => {
    //                     let o = one.split('_');
    //                     list.push(items[o[0]].cnName + '*' + o[1]);
    //                 });
    //                 txt += '\t' + list.join('+');
    //             }
    //         }
    //         ge.log(txt);
    //     }
    // };
    ge.show2 = function () {
        let items = ge.xls.items;
        let axes = ge.xls.axes;
        for (let i in axes[1]) {
            let oneAxe = axes[1][i];
            let txt = i + '\t' + oneAxe.cnName;
            if (oneAxe.craft) {
                let recipe = oneAxe.craft.split('&');
                let list = [];
                recipe.forEach(one => {
                    let o = one.split('_');
                    list.push(items[o[0]].cnName + '*' + o[1]);
                });
                txt += '\t' + list.join('+');
            }
            ge.log(txt);
        }
        for (let i in axes[2]) {
            let oneAxe = axes[2][i];
            let txt = i + '\t' + oneAxe.cnName;
            if (oneAxe.craft) {
                let recipe = oneAxe.craft.split('&');
                let list = [];
                recipe.forEach(one => {
                    let o = one.split('_');
                    list.push(items[o[0]].cnName + '*' + o[1]);
                });
                txt += '\t' + list.join('+');
            }
            ge.log(txt);
        }
    }


};