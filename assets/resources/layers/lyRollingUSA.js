cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Node,
        btnReset: cc.Node,

        dices: [cc.Node],

        diceIt: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;

        let bgColors = [
            cc.color(255, 51, 0),
            cc.color(0, 122, 255),
            cc.color(33, 175, 39),
            cc.color(247, 240, 73),
            cc.color(207, 101, 221),
            cc.color(177, 40, 195),
            cc.color(255, 255, 255)
        ];
        let color = cc.color(0, 0, 0);

        this.list = [];
        for (let i = 0; i < 7; i++) {
            let pfDice = cc.instantiate(ge.pfDice);
            pfDice.parent = this.dices[i];
            let pfDiceJs = ge.getJs(pfDice)
            pfDiceJs.init({
                bgColor: bgColors[i],
                color: color,
            });
            this.list.push(pfDiceJs);
        }

        ge.addClick(this.diceIt, () => {
            this.list.forEach(one => {
                one.node.active = true;
            }, true);
            if (this.isHide) {
                this.hideNode(true);
                this.list.forEach(one => {
                    one.rollAction2();
                });
                return;
            }
            this.list.forEach(one => {
                one.rollAction2();
            });
        }, true);

        ge.addClick(this.btnReset, () => {
            this.hideNode(false);
        }, true);

        ge.addClick(this.btnClose, () => {
            this.node.destroy();
        }, true);
        this.list.forEach(one => {
            ge.addClick(one.node, () => {
                one.node.active = !one.node.active
            })
        })
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
