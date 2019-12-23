cc.Class({
    extends: cc.Component,

    properties: {
        color: cc.Color,
        zIndex: -1,
        opacity: 127,
        isClickClose: false
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let one = cc.instantiate(ge.maskBg);
        one.parent = this.node;
        one.active = true;
        one.zIndex = this.zIndex;
        one.opacity = this.opacity;
        one.width = cc.winSize.width;
        one.height = cc.winSize.height;
        one.color = this.color;

        ge.addClick(one, (event) => {
            if (this.isClickClose) {
                one.parent.active = false;
                one.parent.destroy();
                one = undefined;
            }
        });
    },

    // update (dt) {},
});
