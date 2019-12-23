let userInfoBase = require('userInfo'); // 把数据都单独抽取出来，这个容易处理

var guu = {
    formator: require('formator')(), // 格式化字符串
    save: function (cb) { // 只有改变时才保存
        ge.sdk.fs.save(ge.config.enName, this.stringify(this.userInfo));
        cb && cb();
    },
    load: function (cb) {
        let data = ge.sdk.fs.load(ge.config.enName);
        cb(false, data)
    },
    stringify: function (userInfo, formator) {
        return JSON.stringify(userInfo);
        let txt = '', fm;
        for (let i in formator) {
            fm = formator[i];
            if (txt) txt += '_';
            txt += fm.tag + fm.stringify(userInfo[i]);
        }
        txt = ge.md52(txt) + 'AAMD5AA' + txt;
        return txt;
    },
    parse: function (txt, formator) {
        return JSON.parse(txt); // 先最简单的
        let userInfo = {};
        let unformator = {};
        let fm;

        let txts = txt.split('AAMD5AA');
        if (ge.md52(txts[1]) != txts[0]) return;
        txt = txts[1];

        // 目前只用一次，所以临时建立一次表就可以了
        for (let i in formator) {
            unformator[formator[i].tag] = {
                tag: i,
                parse: formator[i].parse,
                stringify: formator[i].stringify
            }
        }

        let tt = txt.split('_');
        for (let i = 0; i < tt.length; i++) {
            let t = tt[i];
            fm = unformator[t[0]]
            if (!fm) continue;

            t = t.substr(1);
            userInfo[fm.tag] = fm.parse(t);
        }
        return userInfo;
    },
    start: function (cb) {
        return cb && cb();
        this.load((err, data) => { // 加载数据
            let today = new Date(ge.sysTs).format('yyyyMMdd');
            let userInfo;
            let isNewDay = false;
            if (data) {
                userInfo = this.parse(data, this.formator);
                if (userInfo) {
                    isNewDay = (userInfo.today != today)  // 不是同一天了，这里做一些初始化
                }
            }
            if (!userInfo) { // 新账号
                userInfo = ge.deepCopy(userInfoBase);
                userInfo.name = userInfo.uid;
                userInfo.img = Math.floor(18 * Math.random());
                isNewDay = true;
            }

            this.userInfo = userInfo;
            if (isNewDay) {
                userInfo.today = today;
            }
            cb(err || !data)

            setInterval(() => {
                this.save();
            }, 10005000);
        });
    },

};



module.exports.init = function () {
    window.gu = guu;
};