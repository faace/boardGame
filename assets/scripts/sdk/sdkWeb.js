module.exports = function () {
    let myHttp = require('myHttp');
    return {
        is: function (type) {
            return type == 'web';
        },
        ad: {
            init: function () { // 判断是否支持两种广告，先默认都支持

            },
            bannerShow: function () {
                ge.log('bannerShow');
            },
            bannerHide: function () {
                ge.log('bannerHide');
            },
            rewardAvailable: function () {
                // return false;
                // if (Math.random() < 0.3) return false;
                return true;

            },
            rewardShow: function (type, cb) {
                this.rewardAdType = type;
                let res = {
                    isEnded: true
                };
                this.cb = cb;
                this.rewardCb(res);
            },
            rewardCb: function (res) {
                if (res && res.isEnded || res === undefined) {
                    if (this.cb) {
                        this.cb({ rewarded: true, type: this.rewardAdType });
                        this.cb = null;
                    } else ge.EM.post({ name: 'RewardCb', data: { rewarded: true, type: this.rewardAdType } });
                }
                this.rewardAvailable(); // 重新准备新的
            }
        },
        http: {

            get: function (url, cb, responseType) {
                return myHttp.sendHttp(url, cb, responseType || 'json', 3);
            },
            post: function (url, data, cb, responseType) {
                return myHttp.sendHttp(url, cb, responseType || 'json', 3, data);
            }
        },
        fs: {
            load: function (fileName) {
                return localStorage[fileName];
            },
            save: function (fileName, data) {
                if (typeof data != 'string') data = JSON.stringify(data);
                localStorage[fileName] = data;
            },
        },
        restartAcitivity: function () { // 重启游戏？？？
            cc.director.game.reload();
        },
        getSdkVersion: function () { // 获取版本号
            return ge.config.version;
        }
    };
};