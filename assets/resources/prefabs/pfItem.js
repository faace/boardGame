cc.Class({
    extends: cc.Component,

    properties: {

        txt: cc.Label,
        btnDel: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(parm) {
        this.txt.string = parm.txt;
        this.delCb = parm.delCb;
        this.game = parm.game;
        ge.addClick(this.btnDel, () => {
            this.delCb && this.delCb(this);
        });

        ge.addClick(this.node, () => {
            ge.openLayer(this.game);
        });
    },

});
