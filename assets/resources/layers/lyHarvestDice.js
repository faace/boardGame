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
            cc.color(255, 163, 0),
            cc.color(32, 158, 0),
            cc.color(206, 0, 0)
        ];
        let color = cc.color(0, 0, 0);

        this.list = [];
        for (let i = 0; i < 9; i++) {
            let pfDice = cc.instantiate(ge.pfDice);
            pfDice.parent = this.dices[i];
            let pfDiceJs = ge.getJs(pfDice)
            pfDiceJs.init({
                bgColor: bgColors[Math.floor(i / 3)],
                color: color,
            });
            this.list.push(pfDiceJs);
        }

        ge.addClick(this.diceIt, () => {
            this.list.forEach(one => {
                ge.log(one.node + (one.node.active == true ? 1 : 0));
                one.node.active = true;
                ge.log(one.node + (one.node.active == true ? 1 : 0));
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
        ge.addClick(this.list[0].node, () => { this.list[0].node.active = false }, true);
        ge.addClick(this.list[1].node, () => { this.list[1].node.active = false }, true);
        ge.addClick(this.list[2].node, () => { this.list[2].node.active = false }, true);
        ge.addClick(this.list[3].node, () => { this.list[3].node.active = false }, true);
        ge.addClick(this.list[4].node, () => { this.list[4].node.active = false }, true);
        ge.addClick(this.list[5].node, () => { this.list[5].node.active = false }, true);
        ge.addClick(this.list[6].node, () => { this.list[6].node.active = false }, true);
        ge.addClick(this.list[7].node, () => { this.list[7].node.active = false }, true);
        ge.addClick(this.list[8].node, () => { this.list[8].node.active = false }, true);
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
