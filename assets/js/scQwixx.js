// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        txt: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    // },

    dice() {
        var l = ['白：', '白：', '红：', '黄：', '绿：', '蓝：'];
        var list = [];

        for (let i = 0; i < 6; i++) {
            list.push(l[i] + Math.ceil(Math.random() * 6));
        }
        this.txt.string = list.join('\n');
    },
    reset() {
        var l = ['白：', '白：', '红：', '黄：', '绿：', '蓝：'];
        var list = [];

        for (let i = 0; i < 6; i++) {
            list.push(l[i]);
        }
        this.txt.string = list.join('\n');
    }
    // update (dt) {},
});
