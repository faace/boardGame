module.exports = function () {
    let myHttp = require('myHttp');
    return {
        is: function (type) {
            return type == 'apk';
        },
        ad: {
            // bannerAd: true,
            // rewardAd: true,
            init: function () { // 判断是否支持两种广告，先默认都支持

            },
            bannerShow: function () {
                let parm = '0&true';
                if (typeof jsb == 'undefined') return;
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Utils", "js2Android", "(Ljava/lang/String;)Ljava/lang/String;", parm);
            },
            bannerHide: function () {
                let parm = '0&false';
                if (typeof jsb == 'undefined') return;
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Utils", "js2Android", "(Ljava/lang/String;)Ljava/lang/String;", parm);
            },
            rewardAvailable: function () {
                let parm = '1&2';
                if (typeof jsb == 'undefined') return true;
                try {
                    let rc = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Utils", "js2Android", "(Ljava/lang/String;)Ljava/lang/String;", parm) || '';
                    return rc.split('&')[2] == 1;
                } catch (e) { }
                return false;
            },
            rewardShow: function (type) {
                let parm = '1&1';
                if (typeof jsb == 'undefined') return;
                this.rewardAdType = type;
                let rc = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Utils", "js2Android", "(Ljava/lang/String;)Ljava/lang/String;", parm);
                return rc.split('&')[2] == 1;
            },
            rewardCb: function (rc) {
                ge.EM.post({ name: 'RewardCb', data: { rewarded: rc.split('&')[1] == 1, type: this.rewardAdType } });
            }
        },
        http: {
            realGet: function (url, cb, responseType, times) {
                myHttp.sendHttpGet(url, (err, data) => {
                    if (err) {
                        if (--times < 0) return cb(err);
                        return this.realGet(url, cb, responseType, times);
                    }
                    cb(err, data);
                }, responseType)
            },
            realPost: function (url, data, cb, responseType, times) {
                myHttp.sendHttpPost(url, data, (err, rsp) => {
                    if (err) {
                        if (--times < 0) return cb(err);
                        return this.realPost(url, data, cb, responseType, times);
                    }
                    cb(err, rsp);
                }, responseType)
            },
            get: function (url, cb, responseType) {
                return this.realGet(url, cb, responseType || 'json', 3);
            },
            post: function (url, data, cb, responseType) {
                return this.realPost(url, data, cb, responseType || 'json', 3);
            }
        },
        fs: {
            load: function (fileName) {
                try {
                    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Utils", "readInternal", "(Ljava/lang/String;)Ljava/lang/String;", fileName);
                } catch (error) {
                    ge.log(error)
                }
            },
            save: function (fileName, data) {
                if (typeof data != 'string') data = JSON.stringify(data);
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Utils", "writeInternal", "(Ljava/lang/String;Ljava/lang/String;)V", fileName, data);
            },
        },
        restartAcitivity: function () {
            if (typeof jsb == 'undefined') return;
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Utils", "restartAcitivity", "()V");
        },
        getSdkVersion: function () {
            if (typeof jsb == 'undefined') return '1.7.0';
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Utils", "getVerName", "()Ljava/lang/String;") + '.0';
        }
    };
};