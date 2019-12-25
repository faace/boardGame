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
        this.roll();
    },
    rollAction(idx, noIdx) {
        this.node.runAction(cc.sequence(
            cc.fadeTo(0.5, 10),
            cc.callFunc(() => {
                this.roll(idx, noIdx)
            }),
            cc.fadeTo(0.5, 255)
        ));
    },
    rollAction2(idx, noIdx) {
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                this.roll(idx, noIdx)
            }),
            cc.fadeTo(0.5, 255)
        ));
    },
    preRoll() {
        return Math.floor(this.list.length * Math.random());
    },
    roll(theIdx, noIdx) {
        let idx;
        if (typeof theIdx == 'undefined') {
            idx = Math.floor(this.list.length * Math.random());
            while (noIdx == idx) idx = Math.floor(this.list.length * Math.random());
        } else {
            idx = theIdx;
        }

        let l = this.list[idx];
        this.bg.color = l.bgColor;

        if (l && l.txt) {
            this.txt.node.active = true;
            this.txt.node.color = l.color;
            this.txt.string = l.txt.replace(/\^p/g, '\n'); // ^p是回车符
        } else {
            this.img.node.active = true;
            this.img.spriteFrame = l && l.sp;
            this.img.node.color = l.color;
        }
        return idx;
    },
    initData(parm) {
        let bgColor = parm.bgColor || cc.color(255, 255, 255);
        let color = parm.color || cc.color(0, 0, 0);
        this.list = [];
        if (parm.list) {
            for (let i = 0; i < parm.list.length; i++) {
                this.list.push({ sp: parm.list[i].sf, color: color, bgColor: bgColor });
            }
        } else {
            for (let i = 0; i < 6; i++) {
                this.list.push({ sp: this.sf[i], color: color, bgColor: bgColor });
            }
            this.list[0].color = this.list[3].color = cc.color(255, 0, 0);
        }

        this.txt.node.active = false;
        this.img.node.active = false;
    },
    rollTo(parm) {
        this.bg.color = parm.bgColor || cc.color(255, 255, 255);

        let l = this.list[parm.idx];
        if (parm.txt || (l && l.txt)) {
            this.img.node.active = false;
            this.txt.node.active = true;
            this.txt.node.color = parm.color || cc.color(0, 0, 0);
            this.txt.string = (parm.txt || l.txt).replace(/\^p/g, '\n'); // ^p是回车符
        } else {

            this.img.node.active = true;
            this.img.node.angle = -parm.angle || 0;
            this.txt.node.active = false;
            this.img.node.color = parm.color || cc.color(0, 0, 0);
            this.img.spriteFrame = parm.sp || (l && l.sp);
        }
        // return idx;
    }
    // initDefault() { // 默认的骰子
    //     let bgColor = cc.color(255, 255, 255);
    //     let color = cc.color(0, 0, 0);

    //     this.list = [];
    //     for (let i = 0; i < 6; i++) {
    //         this.list.push({ sp: this.sf[i], color: color, bgColor: bgColor });
    //     }
    //     this.list[0].color = this.list[3].color = cc.color(255, 0, 0);

    //     this.txt.node.active = false;
    //     this.img.node.active = false;
    //     this.isTxt = false;
    // }
});
