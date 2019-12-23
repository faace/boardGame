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
        d0: cc.Label,
        d1: cc.Label,
        d2: cc.Label,
        d3: cc.Label,
        d4: cc.Label,
        d5: cc.Label,
        d6: cc.Label,
        d7: cc.Label,
        d8: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.l = ['carrot\n', 'carrot\n', 'carrot\n', 'lettuce\n', 'lettuce\n', 'lettuce\n', 'tomato\n', 'tomato\n', 'tomato\n'];
        for (let i = 0; i < this.l.length; i++) {
            this.addClick(this['d' + i].node);
        }
    },

    dice() {
        var l = this.l;
        for (let i = 0; i < l.length; i++) {
            this['d' + i].string = l[i] + Math.ceil(Math.random() * 6);
            this['d' + i].node.active = true;
        }
    },
    reset() {
        var l = this.l;
        for (let i = 0; i < l.length; i++) {
            this['d' + i].node.active = false;
        }
    },
    addClick(node) {
        if (!node.getComponent(cc.Button)) node.addComponent(cc.Button);
        node.off('click');
        node.on('click', () => {
            node.active = false;
        });
    },
    // update (dt) {},
});
