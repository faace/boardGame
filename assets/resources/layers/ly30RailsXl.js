cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Node,
        btnReset: cc.Node,

        inside: cc.Node,
        setupDice: cc.Node,
        setupCenter: cc.Node,
        setupTxt: cc.Label,

        diceIt: cc.Node,
        bgDice: cc.Node,
        sp: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;

        let pfDice = cc.instantiate(ge.pfDice);
        pfDice.parent = this.bgDice;
        this.pfDiceJs = ge.getJs(pfDice)
        this.pfDiceJs.init();
        pfDice.x = -pfDice.width * 0.5 - 40;
        pfDice.active = false;

        let pfDice2 = cc.instantiate(ge.pfDice);
        pfDice2.parent = this.bgDice;
        this.pfDiceJs2 = ge.getJs(pfDice2)
        this.pfDiceJs2.init({
            bgColor: cc.color(201, 221, 121),
            list: [
                { sf: this.sp[0] },
                { sf: this.sp[1] },
                { sf: this.sp[2] },
                { sf: this.sp[3] },
                { sf: this.sp[4] },
                { sf: this.sp[5] },
            ]
        });
        pfDice2.x = pfDice2.width * 0.5 + 40;
        pfDice2.active = false;

        ge.addClick(this.diceIt, () => {
            if (typeof this.setupNum == 'undefined') {
                this.setupNum = 0;
                this.setupGap = this.inside.width / 6;
                this.setupX = this.inside.width * -0.5 + this.setupGap * 0.5;
            }

            if (this.setupNum > 5) { // 丢另外那个
                this.pfDiceJs.node.active = true;
                this.pfDiceJs2.node.active = true;
                if (this.setupNum == 6) {
                    this.pfDiceJs.rollAction2();
                    this.pfDiceJs2.rollAction2();
                } else {
                    this.pfDiceJs.rollAction();
                    this.pfDiceJs2.rollAction();
                }
                return;
            };
            this.setupCenter.removeAllChildren();
            this.setupTxt.string = '第' + '一二三四五六'[this.setupNum] + '个';

            let pfDice = cc.instantiate(ge.pfDice);
            pfDice.parent = this.setupCenter;
            pfDice.x = -pfDice.width * 0.5 - 20;
            let pfDiceJs = ge.getJs(pfDice);
            pfDiceJs.init();
            let idx = pfDiceJs.roll();


            let pfDice2 = cc.instantiate(ge.pfDice);
            pfDice2.parent = this.setupCenter;
            pfDice2.x = pfDice.width * 0.5 + 20;
            let pfDiceJs2 = ge.getJs(pfDice2);
            pfDiceJs2.init();
            pfDiceJs2.roll(undefined, idx); // 不能重复

            // 整理拷贝一份
            let one = cc.instantiate(this.setupDice);
            one.active = true;
            one.parent = this.inside;
            one.y = 0;
            one.x = this.setupX;
            this.setupX += this.setupGap;


            this.setupNum++;
        }, true);

        ge.addClick(this.btnReset, () => {
            this.pfDiceJs.node.active = false;
            this.pfDiceJs2.node.active = false;
            this.setupNum = 0;
            this.setupGap = this.inside.width / 6;
            this.setupX = this.inside.width * -0.5 + this.setupGap * 0.5;

            this.inside.removeAllChildren();

        }, true);

        ge.addClick(this.btnClose, () => {
            this.node.destroy();
        }, true);
        ge.addClick(this.node, () => { });
    },

    // update (dt) {},
});
