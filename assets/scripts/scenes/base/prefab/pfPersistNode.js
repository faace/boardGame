cc.Class({
    extends: cc.Component,

    properties: {
        alertNode: cc.Node,
        pfAlert: cc.Prefab,
        layerNode: cc.Node,
        maskBg: cc.Node,
        guideNode: cc.Node,
        pfGuide: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init() {
        let winSize = cc.winSize;
        this.node.x = winSize.width >> 1;
        this.node.y = winSize.height >> 1;
        ge.maskBg = this.maskBg;
        ge.alert = ge.alert.bind(this);
        ge.cleanAlert = ge.cleanAlert.bind(this);
        ge.openLayer = ge.openLayer.bind(this);
        ge.cleanLayer = ge.cleanLayer.bind(this);
        ge.guide = ge.guide.bind(this);

        this.updateSysTs();
    },
    updateSysTs() { // 定期更新时间
        let now = Date.now();
        setInterval(() => {
            let n = Date.now();
            ge.sysTs += (n - now);
            now = n;
        }, 1000);
    },
    // update(dt) {
    // },
});
