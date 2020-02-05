cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Node,
        btnReset: cc.Node,

        left: [cc.Node],
        used: [cc.Node],
        one: cc.Node,
        two: cc.Node,

        round: cc.Label,

        diceIt: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;


        ge.addClick(this.btnReset, () => {
            this.hideNode(true);
        }, true);

        ge.addClick(this.btnClose, () => {
            this.node.destroy();
        }, true);
        ge.addClick(this.node, () => { });


        this.initData();
        this.hideNode(true);


        ge.addClick(this.diceIt, () => {
            if (this.leftNum < 1) return this.hideNode();


            if (this.oneJs.node.active) {
                this.usedJs[this.usedNum].node.active = true;
                this.usedJs[this.usedNum].roll2(this.oneJs.idx);
                this.oneJs.node.active = false;
                this.usedNum++;
            }
            if (this.leftNum > 0) {
                this.leftJs[this.leftNum - 1].node.active = false;
                this.oneJs.node.active = true;
                this.oneJs.roll2();
                this.leftNum--;
            }

            if (this.twoJs.node.active) {
                this.usedJs[this.usedNum].node.active = true;
                this.usedJs[this.usedNum].roll2(this.twoJs.idx);
                this.twoJs.node.active = false;
                this.usedNum++;
            }
            if (this.leftNum > 0) {
                this.leftJs[this.leftNum - 1].node.active = false;
                this.twoJs.node.active = true;
                this.twoJs.roll2();
                this.leftNum--;
            }
        }, true);





    },

    initData() {
        this.leftJs = [];
        this.left.forEach(one => {
            let node = cc.instantiate(ge.pfDice2);
            node.parent = one;
            let nodeJs = ge.getJs(node);
            nodeJs.init({ list: [{ txt: '?' }] });
            this.leftJs.push(nodeJs);
        });

        this.usedJs = [];
        this.used.forEach(one => {
            let node = cc.instantiate(ge.pfDice2);
            node.parent = one;
            let nodeJs = ge.getJs(node);
            nodeJs.init();
            this.usedJs.push(nodeJs);
            ge.addClick(node, this.clickUsed.bind(this), true);
        });

        let node = cc.instantiate(ge.pfDice2);
        node.parent = this.one;
        this.oneJs = ge.getJs(node);
        this.oneJs.init();
        ge.addClick(this.oneJs.node, () => {
            this.oneJs.roll();
        });

        node = cc.instantiate(ge.pfDice2);
        node.parent = this.two;
        this.twoJs = ge.getJs(node);
        this.twoJs.init();
        ge.addClick(this.twoJs.node, () => {
            this.twoJs.roll();
        });
    },

    clickUsed() {
        this.usedJs[--this.usedNum].node.active = false;
        this.leftJs[this.leftNum++].node.active = true;
    },


    hideNode(isReset) {
        this.leftJs.forEach(one => {
            one.node.active = true;
            one.roll2();
        });
        this.usedJs.forEach(one => { one.node.active = false; });
        this.oneJs.node.active = false;
        this.twoJs.node.active = false;
        if (isReset) this.num = 0;
        else this.num++;
        this.leftNum = 6;
        this.usedNum = 0;
        this.updateRound();
    },
    updateRound() {
        this.round.string = 'Round ' + (this.num + 1);
    }
    // update (dt) {},
});
