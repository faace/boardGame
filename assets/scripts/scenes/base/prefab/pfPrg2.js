
cc.Class({
    extends: cc.Component,

    properties: {
        bar: cc.Node,
        btnAdd: cc.Node,
        btnDel: cc.Node,
        num: cc.Label,
        tap: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(parm) {
        this.maxLen = this.bar.width;
        this.maxNum = parm.maxNum;
        this.minNum = parm.minNum || 1;
        this.num.string = this.currNum;
        if (!this.isInit) {
            this.isInit = true;
            this.initTouch();
        }
        this.cb = parm.cb;
        this.setNum(this.maxNum);
    },
    setNum(num) {
        if (num < 1) num = 1;
        if (num > this.maxNum) num = this.maxNum;
        if (this.currNum == num) return;
        this.currNum = num;
        this.num.string = num;
        this.bar.width = num / this.maxNum * this.maxLen;
        this.tap.x = -80 + 160 * num / this.maxNum;
        this.cb && this.cb(num);
    },
    setMaxNum(num) {
        this.maxNum = num;
        this.setNum(num);
    },
    getNum() {
        return this.currNum;
    },
    initTouch() {
        ge.addClick(this.btnAdd, () => {
            this.setNum(this.currNum + 1);
        });
        ge.addClick(this.btnDel, () => {
            this.setNum(this.currNum - 1);
        });
        this.tap.on('touchstart', (event) => {
            this.x = event.getLocationX();
            this.touchNum = this.currNum;
        });
        this.tap.on('touchmove', (event) => {
            let x = event.getLocationX();
            let gap = x - this.x;
            let num = Math.floor(this.maxNum * gap / this.maxLen);
            this.setNum(this.touchNum + num);
        });
    }
    // update (dt) {},
});
