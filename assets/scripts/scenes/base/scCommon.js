require('init');

cc.Class({
    extends: ge.Component,

    properties: {
        bg: cc.Node,
        gameName: cc.Label,
        pfPersistNode: cc.Prefab, // 常驻预制体
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let pfPersistNode = cc.instantiate(this.pfPersistNode);
        cc.game.addPersistRootNode(pfPersistNode);
        ge.getJs(pfPersistNode).init();
        this.gameName.string = ge.config.name;

        this.login();
    },
    login() {
        require('gu').init(); // 全局数据
        this.enterMain();
    },
    enterMain() {
        this.bg.runAction(cc.sequence(
            cc.fadeTo(1.0, 0),
            cc.callFunc(() => {
                ge.loadScene(ge.config.startScene);
            })
        ));
    }
    // update (dt) {},
});
