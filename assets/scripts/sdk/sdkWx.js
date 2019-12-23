module.exports = function () {
    let fs = wx.getFileSystemManager();
    let basePath = wx.env.USER_DATA_PATH;
    if (basePath[basePath.length - 1] == '/') basePath = basePath.substr(0, basePath.length - 1);
    ge.log(basePath);
    return {
        is: function (type) {
            return type == 'wx';
        },
        ad: {
            // bannerAd: true,
            // rewardAd: true,
            isRewardAvailable: false, // 视频是否准备好了
            isRewardLoading: false, // 
            init: function () { // 判断是否支持两种广告，先默认都支持

                var screenHeight = wx.getSystemInfoSync().screenHeight
                var screenWidth = wx.getSystemInfoSync().screenWidth
                ge.log('create banner Ad', screenWidth, screenHeight);

                this.bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-4f876c309bd80b1d',
                    style: {
                        left: 0,
                        top: screenHeight - 100,
                        height: 100,
                        width: screenWidth
                    }
                });
                this.bannerAd && this.bannerAd.onError((res) => {
                    ge.log('err banner', res);
                });
                this.bannerAd && this.bannerAd.onLoad((res) => {
                    ge.log('load banner', res);
                });

                this.rewardAd = wx.createRewardedVideoAd({
                    adUnitId: 'adunit-2897e7efd45b56dd'
                });
                this.rewardAd && this.rewardAd.onClose(this.rewardCb.bind(this));
                this.rewardAd && this.rewardAd.onError((res) => {
                    ge.log('err reward', res);
                });
            },
            bannerShow: function () {
                this.bannerAd.show();
            },
            bannerHide: function () {
                this.bannerAd.hide();
            },
            rewardAvailable: function () {
                if (!this.rewardAd) return false;
                if (this.isRewardAvailable) return true;
                if (this.isRewardLoading) return false;
                this.isRewardLoading = true;
                this.rewardAd.load().then(() => {
                    this.isRewardLoading = false;
                    this.isRewardAvailable = true;
                }).catch((e) => {
                    ge.log(e);
                    this.isRewardLoading = false;
                });
                return false;
            },
            rewardShow: function (type, cb) {
                this.rewardAdType = type;
                this.rewardAd.show()
                this.cb = cb;
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
            realGet: function (url, cb, responseType, times) {
                wx.request({
                    url: url,
                    responseType: responseType,
                    success: (rspData) => {
                        cb(false, rspData && rspData.data);
                    },
                    fail: (err) => {
                        if (--times < 0) return cb(err);
                        return this.realGet(url, cb, responseType, times);
                    }
                });
            },
            realPost: function (url, data, cb, responseType, times) {
                wx.request({
                    url: url,
                    method: 'POST',
                    responseType: responseType,
                    data: data,
                    success: (rspData) => {
                        cb(false, rspData && rspData.data);
                    },
                    fail: (err) => {
                        if (--times < 0) return cb(err);
                        return this.realPost(url, cb, responseType, times);
                    }
                });
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
                    return fs.readFileSync(wx.env.USER_DATA_PATH + '/' + fileName, 'utf-8');
                } catch (error) {
                    ge.log(error);
                }
            },
            save: function (fileName, data) {
                if (typeof data != 'string') data = JSON.stringify(data);
                fs.writeFileSync(wx.env.USER_DATA_PATH + '/' + fileName, data, 'utf-8');

            },
            readFile: function (path, encoding) {
                try {
                    return fs.readFileSync(path, encoding);
                } catch (error) {
                    ge.log(error);
                }
                return -1;
            },
        },
        restartAcitivity: function () { // 重启游戏？？？
            // cc.director.game.reload();
        },
        getSdkVersion: function () { // 获取版本号
            return ge.config.version;
        }
    };
};