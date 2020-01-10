cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Node,
        btnInit1: cc.Node,
        btnInit2: cc.Node,
        btnInit3: cc.Node,
        btnInit4: cc.Node,

        p1dices: [cc.Node],
        p2dices: [cc.Node],
        p3dices: [cc.Node],
        p4dices: [cc.Node],

        diceIt: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},



    start() {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;

        this.list = [];

        this.isFirst = true;

        ge.addClick(this.diceIt, () => {
            if (this.isFirst) {
                this.list.forEach(one => {
                    if (one.node.opacity == 255) {
                        one.rollAction();
                    }
                });
            } else {
                this.list.forEach(one => {
                    if (one.node.opacity == 255) {
                        one.rollAction();
                    }
                });
            }
        }, true);

        ge.addClick(this.btnInit1, () => {
            this.diceInit(this.p1dices);
        })
        ge.addClick(this.btnInit2, () => {
            this.diceInit(this.p2dices);
        })
        ge.addClick(this.btnInit3, () => {
            this.diceInit(this.p3dices);
        })
        ge.addClick(this.btnInit4, () => {
            this.diceInit(this.p4dices);
        })

        ge.addClick(this.btnClose, () => {
            this.node.destroy();
        }, true);
        ge.addClick(this.node, () => { });
    },
    diceInit(dice) {
        this.list = [];
        let length = dice.length;
        for (let i = 0; i < length; i++) {
            let pfDice = cc.instantiate(ge.pfDice);
            pfDice.parent = dice[i];
            let pfDiceJs = ge.getJs(pfDice)
            pfDiceJs.init({
                bgColor: cc.color(201, 221, 221),
            });
            this.list.push(pfDiceJs);
        }
        for (let j = 0; j < dice.length; j++) {
            ge.addClick(this.list[j].node, () => {
                this.list[j].node.opacity = this.list[j].node.opacity == 255 ? 128 : 255;
            });
        }
    },
    // update (dt) {},
});
