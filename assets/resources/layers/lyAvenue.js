cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Node,
        btnReset: cc.Node,

        scrollView: cc.ScrollView,
        content: cc.Node,

        diceIt: cc.Node,

        spPath: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;

        setTimeout(() => {
            let pfDice = cc.instantiate(ge.pfDice);
            this.list = ge.listView({
                scrollview: this.scrollView,
                content: this.content,
                itemTpl: pfDice,
                gapY: 10,
                gapX: 14,
                col: Math.floor(this.scrollView.node.width / (pfDice.width + 14)),
                setItemsCb: this.setItemsCb.bind(this),
            });
        }, 300);
        this.reset(items, true);

        ge.addClick(this.diceIt, () => {

        }, true);

        ge.addClick(this.btnReset, () => {
            this.reset();
        }, true);
        ge.addClick(this.btnClose, () => {
            this.node.destroy();
        }, true);
        ge.addClick(this.node, () => { });
    },
    reset() {
        this.list.cleanItems();

        let buildingBgColor = cc.color(1, 1, 1);
        let buildingList = [
            { bgColor: pathBgColor, txt: 'A' },
            { bgColor: pathBgColor, txt: 'B' },
            { bgColor: pathBgColor, txt: 'C' },
            { bgColor: pathBgColor, txt: 'D' },
            { bgColor: pathBgColor, txt: 'E' },
            { bgColor: pathBgColor, txt: 'F' }
        ];

        let pathBgColor1 = cc.color(2, 2, 2);
        let pathBgColor2 = cc.color(2, 2, 2);

        let pathList = [];
        for (let i = 0; i < 24; i++) {
            pathList.push({
                bgColor: (i % 2 == 0) ? pathBgColor1 : pathBgColor2,
                sp: this.spPath[Math.floor(i / 4)]
            });
        }

        // 打乱
    },
    setItemsCb(item, data, idx) {

    }
    // update (dt) {},
});
