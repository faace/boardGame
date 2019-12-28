cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Node,
        btnReset: cc.Node,

        scrollView: cc.ScrollView,
        content: cc.Node,

        diceIt: cc.Node,
        btnNew: cc.Node,

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
                gapY: 20,
                gapX: 14,
                col: Math.floor(this.scrollView.node.width / (pfDice.width + 14)),
                setItemsCb: this.setItemsCb.bind(this),
            });
            this.reset();
        }, 300);

        this.thePath = [this.spPath[0], this.spPath[0], this.spPath[0], this.spPath[0], this.spPath[1], this.spPath[1]];
        this.theRotation = [-180, -90, 0, 90, 90, 0];



        ge.addClick(this.diceIt, () => {
            // this.buildingList = buildingList;
            // this.pathList = pathList;
            // this.isNew = true;
            // this.goldNum = 0;
            if (this.isNew) { // 出建筑
                this.goldNum = 0;

                this.list.addItems(this.buildingList.shift());
                this.isNew = false;
            } else {
                let item = this.pathList.shift();
                this.list.addItems(item);
                if (item.isgold) {
                    if (++this.goldNum > 3) {
                        this.isNew = true;
                        this.btnNew.active = true;
                        this.diceIt.active = false;
                        ge.log(this.pathList.length);
                        if (this.buildingList.length < 2) {
                            this.btnNew.active = false;
                            this.diceIt.active = false;
                        }
                    }
                }
            }
        }, true);
        ge.addClick(this.btnNew, () => {
            this.list.cleanItems();
            this.btnNew.active = false;
            this.diceIt.active = true;
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
        this.btnNew.active = true;
        this.diceIt.active = false;
        this.list.cleanItems();

        let buildingBgColor = cc.color(135, 159, 255);
        let buildingList = [
            { bgColor: buildingBgColor, txt: 'A' },
            { bgColor: buildingBgColor, txt: 'B' },
            { bgColor: buildingBgColor, txt: 'C' },
            { bgColor: buildingBgColor, txt: 'D' },
            { bgColor: buildingBgColor, txt: 'E' },
            { bgColor: buildingBgColor, txt: 'F' }
        ];

        let pathBgColor1 = cc.color(255, 215, 0); // gold
        let pathBgColor2 = cc.color(192, 192, 192); // silver

        let pathList = [], a, b, t;
        for (let i = 0; i < 48; i++) {
            let isSilver = (i % 2 == 0);
            pathList.push({
                isgold: !isSilver,
                bgColor: !isSilver ? pathBgColor1 : pathBgColor2,
                sp: this.thePath[Math.floor(i / 8)],
                angle: this.theRotation[Math.floor(i / 8)]
            });
        }
        // pathList.length = 48;

        // 打乱
        for (let i = 0; i < 20; i++) {
            a = Math.floor(buildingList.length * Math.random());
            b = Math.floor(buildingList.length * Math.random());
            if (a != b) {
                t = buildingList[a];
                buildingList[a] = buildingList[b];
                buildingList[b] = t;
            }
        }

        for (let i = 0; i < 50; i++) {
            a = Math.floor(pathList.length * Math.random());
            b = Math.floor(pathList.length * Math.random());
            if (a != b) {
                t = pathList[a];
                pathList[a] = pathList[b];
                pathList[b] = t;
            }
        }

        this.buildingList = buildingList;
        this.pathList = pathList;
        this.isNew = true;
        this.goldNum = 0;
    },
    setItemsCb(item, data, idx) {
        let itemJs = ge.getJs(item);
        if (itemJs) {
            itemJs.init();
            itemJs.rollTo(data);
        }
    }
    // update (dt) {},
});
