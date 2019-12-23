cc.Class({
    extends: ge.Component,

    properties: {
        txt: cc.Label,
    },

    onInit() {
        this.txt.string = '开始初始化.';
        setTimeout(() => {
            this.txt.string = '开始初始化..';
            this.initPrefabs((err) => {
                if (err) return ge.alert('初始化失败，请保持网络顺畅。');
                this.txt.string = '开始初始化...';
                gu.start(() => {
                    this.txt.string = '开始初始化....';
                    let sceneName = 'scMain';
                    cc.director.preloadScene(sceneName, (completedCount, totalCount, item) => {
                        // console.log(completedCount + '/' + totalCount);
                    }, (err) => {
                        ge.loadScene(sceneName);
                    });

                });
            });
        }, 50);
    },

    initPrefabs: function (cb) {
        cc.loader.loadRes('prefabs/pfDice', cc.Prefab, (err, prefab) => {
            if (prefab && prefab._uuid) {
                ge.pfDice = prefab;

                cc.loader.loadRes('prefabs/pfItem', cc.Prefab, (err, prefab) => {
                    if (prefab && prefab._uuid) {
                        ge.pfItem = prefab;
                        cb(false);
                    } else cb(true);
                });

            } else cb(true);
        });

    }
});
