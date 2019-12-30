cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Node,
        btnReset: cc.Node,
        diceIt: cc.Node,
        dices: [cc.Node],
        pictures: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.width = cc.winSize.width;              //初始的页面的大小
        this.node.height = cc.winSize.height;

        this.list = [];
        for (let i = 0; i < 4; i++) {
            for (; i < 2; i++) {
                let pfDice = cc.instantiate(ge.pfDice);
                pfDice.parent = this.dices[i];
                let pfDiceJs = ge.getJs(pfDice);
                pfDiceJs.init({
                    bgColor: cc.color(201, 221, 221),
                    list: [
                        { sf: this.pictures[0] },
                        { sf: this.pictures[1] },
                        { sf: this.pictures[2] },
                        { sf: this.pictures[3] },
                        { sf: this.pictures[4] },
                        { sf: this.pictures[5] },
                    ]
                });
                this.list.push(pfDiceJs);
            }
            for (; i < 4; i++) {
                let pfDice = cc.instantiate(ge.pfDice);
                pfDice.parent = this.dices[i];
                let pfDiceJs = ge.getJs(pfDice);
                pfDiceJs.init({
                    bgColor: cc.color(201, 221, 221),
                    list: [
                        { sf: this.pictures[6] },
                        { sf: this.pictures[7] },
                        { sf: this.pictures[8] },
                        { sf: this.pictures[9] },
                        { sf: this.pictures[10] },
                        { sf: this.pictures[11] },
                    ]
                });
                this.list.push(pfDiceJs);
            }
        }

        ge.addClick(this.diceIt, () => {
            if (this.isHide) {
                this.hideNode(true);
                this.list.forEach(one => {
                    one.rollAction2();
                });
                return;
            }
            this.list.forEach(one => {
                one.rollAction();
            });
        }, true);

        ge.addClick(this.btnReset, () => {
            this.hideNode(false);
        }, true);

        ge.addClick(this.btnClose, () => {
            this.node.destroy();
        }, true);
        ge.addClick(this.node, () => { });


        this.hideNode(false);
    },

    hideNode(active) {
        this.isHide = !active;
        this.list.forEach(one => {
            one.node.active = active;
        });
    },

    // update (dt) {},
});
