// let parm = {
//     list: [{ sp: xx, txt: xx, color: xx, bgColor: xx,angle:xx }],
//     bgColor: xx, // 也可以是数组
//     color: xx, // 也可以是数组
//     sp: xx, // 也可以是数组
//     txt: xx, 也可以是数组
//     angle: xx, 也可以是数组
// };

cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        img: cc.Sprite,
        txt: cc.Label,
        sf: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(parm) {
        this.initData(parm || {});
    },
    roll(parm) { // idx:指定滚到第几个，out有消失的过程，in有进来的过程,roll, 需要滚动cb有回调
        if (!parm) return this.roll1();
        let idx = parm.idx || this.getRandIdx();
        let actions = [];
        if (parm.out) actions.push(cc.fadeTo(0.5, 0));
        else actions.push(cc.fadeTo(0, 0));
        if (parm.roll) actions.push(cc.callFunc(() => { this.rollTo(idx) }));
        if (parm.in) actions.push(cc.fadeTo(0.5, 255));
        if (parm.cb) actions.push(cc.callFunc(() => { parm.cb(idx) }));
        let sequnce = cc.sequence.apply(cc, actions);
        this.node.runAction(sequnce)
    },

    roll1(idx, cb) { // 第一种滚动，有消失和进来的动画
        this.roll({ idx: idx, out: true, in: true, roll: true, cb: cb });
    },
    roll2(idx, cb) { // 第二种，没有消失，只有进来
        this.roll({ idx: idx, in: true, roll: true, cb: cb });
    },
    getRandIdx() {
        return Math.floor(this.list.length * Math.random());
    },
    rollTo(idx) {
        this.idx = idx;
        let one = this.list[idx];

        this.bg.color = one.bgColor;

        if (this.txt.node.active) {
            this.txt.node.color = one.color;
            this.txt.string = (one.txt).replace(/\^p/g, '\n'); // ^p是回车符
        } else {
            this.img.node.angle = -one.angle;
            this.img.node.color = one.color;
            this.img.spriteFrame = one.sp;
        }
        // return idx;
    },

    initData(parm) {
        this.initDefault();

        let isSp = true;
        if (parm.list) { // 指定了特殊的list，所以用特殊的list
            this.list = [];
            let bgColor = cc.color(255, 255, 255);
            let color = cc.color(0, 0, 0)
            for (let i = 0; i < parm.list.length; i++) {
                let one = parm.list[i];
                this.list.push({ sp: one.sf, txt: one.txt, color: one.color || color, bgColor: one.bgColor || bgColor, angle: one.angle || 0 });
                if (one.txt) isSp = false;
            }
        }

        if (parm.bgColor) {
            if (Array.isArray(parm.bgColor)) {
                for (let i = 0; i < parm.bgColor.length; i++) {
                    if (this.list[i]) this.list[i].bgColor = parm.bgColor[i];
                }
            } else {
                this.list.forEach(one => { one.bgColor = parm.bgColor; });
            }
        }

        if (parm.color) {
            if (Array.isArray(parm.color)) {
                for (let i = 0; i < parm.color.length; i++) {
                    if (this.list[i]) this.list[i].color = parm.color[i];
                }
            } else {
                this.list.forEach(one => { one.color = parm.color; });
            }
        }
        if (parm.angle) {
            if (Array.isArray(parm.angle)) {
                for (let i = 0; i < parm.angle.length; i++) {
                    if (this.list[i]) this.list[i].angle = parm.angle[i];
                }
            } else {
                this.list.forEach(one => { one.angle = parm.angle; });
            }
        }

        if (parm.sp) {
            isSp = true;
            if (Array.isArray(parm.sp)) {
                for (let i = 0; i < parm.sp.length; i++) {
                    if (this.list[i]) this.list[i].sp = parm.sp[i];
                }
            } else {
                this.list.forEach(one => {
                    one.sp = parm.sp;
                });
            }
        } else if (parm.txt) {
            isSp = false;
            if (Array.isArray(parm.txt)) {
                for (let i = 0; i < parm.txt.length; i++) {
                    if (this.list[i]) this.list[i].txt = parm.txt[i];
                }
            } else {
                this.list.forEach(one => { one.txt = parm.txt; });
            }
        }

        this.txt.node.active = !isSp;
        this.img.node.active = isSp;
    },

    initDefault() { // 默认的骰子
        let bgColor = cc.color(255, 255, 255);
        let color = cc.color(0, 0, 0);

        this.list = [];
        for (let i = 0; i < 6; i++) {
            this.list.push({ sp: this.sf[i], color: color, bgColor: bgColor, angle: 0 });
        }
        this.list[0].color = this.list[3].color = cc.color(255, 0, 0);

        this.txt.node.active = false;
        this.img.node.active = false;
        this.isTxt = false;
    }
});
