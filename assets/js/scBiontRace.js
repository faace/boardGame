cc.Class({
    extends: cc.Component,

    properties: {
        txt: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    // },

    dice1() {
        var l = ['1：', '2：'];
        var t = ['狗', '狗', '狼', '行植物', '列植物', '九宫格植物'];
        var list = [];

        for (let i = 0; i < 1; i++) {
            list.push(l[i] + t[Math.floor(Math.random() * 6)]);
        }
        this.txt.string = list.join('\n');
    },
    dice2() {
        var l = ['1：', '2：'];
        var t = ['狗', '狗', '狼', '行植物', '列植物', '九宫格植物'];
        var list = [];

        for (let i = 0; i < 2; i++) {
            list.push(l[i] + t[Math.floor(Math.random() * 6)]);
        }
        this.txt.string = list.join('\n');
    },
    reset() {
        var l = ['1：', '2：'];
        var list = [];

        for (let i = 0; i < 2; i++) {
            list.push(l[i]);
        }
        this.txt.string = list.join('\n');
    }
    // update (dt) {},
});
