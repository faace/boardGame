cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        circle: cc.Node,
        text: cc.Label,
        arrow: cc.Node,
        mask1: cc.Node,
        mask2: cc.Node,
        mask3: cc.Node,
        mask4: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let clickCb = () => {
            if (this.isClickClose) this.node.destroy();
        }
        this.mask1.on('click', clickCb);
        this.mask2.on('click', clickCb);
        this.mask3.on('click', clickCb);
        this.mask4.on('click', clickCb);
        if (this.isClickClose) this.mask.on('touchstart', clickCb);
    },

    init(parm) {
        let winSize = cc.winSize;
        this.node.x = parm.x;
        this.node.y = parm.y;
        this.mask.width = this.circle.width = parm.width;
        this.mask.height = this.circle.height = parm.height;

        this.mask1.x = - this.mask.width * 0.5;
        this.mask1.y = - this.mask.height * 0.5;
        this.mask1.width = winSize.width * 0.5 + this.node.x - this.mask.width * 0.5;
        this.mask1.height = winSize.height * 0.5 - this.node.y + this.mask.height * 0.5;

        this.mask2.x = - this.mask.width * 0.5;
        this.mask2.y = this.mask.height * 0.5;
        this.mask2.width = winSize.width * 0.5 - this.node.x + this.mask.width * 0.5;
        this.mask2.height = winSize.height * 0.5 - this.node.y - this.mask.height * 0.5;

        this.mask3.x = this.mask.width * 0.5;
        this.mask3.y = this.mask.height * 0.5;
        this.mask3.width = winSize.width * 0.5 - this.node.x - this.mask.width * 0.5;
        this.mask3.height = winSize.height * 0.5 + this.node.y + this.mask.height * 0.5;

        this.mask4.x = this.mask.width * 0.5;
        this.mask4.y = - this.mask.height * 0.5;
        this.mask4.width = winSize.width * 0.5 + this.node.x + this.mask.width * 0.5;
        this.mask4.height = winSize.height * 0.5 + this.node.y - this.mask.height * 0.5;


        this.isClickClose = parm.isClickClose;

        // 设置手指和文字的位置
        let dx = 0; // -1, 0, 1
        if (parm.x < - winSize.width * 0.167) dx = -1;
        if (parm.x > winSize.width * 0.167) dx = 1;

        let dy = 0; // -1, 0, 1
        if (parm.y < - winSize.height * 0.167) dy = -1;
        if (parm.y > winSize.height * 0.167) dy = 1;

        this.text.string = parm.text;
        this.text.node.width = winSize.width * 0.3;
        let textNode = this.text.node;

        let mx = 0, my = 0;
        if (dx < 0) { // 箭头都向左
            this.arrow.x = this.mask.width * 0.5 + this.arrow.width + 20;
            this.arrow.y = 0;
            mx = -20;
            textNode.anchorX = 0;
            textNode.anchory = 0.5;
            textNode.x = this.arrow.x + this.arrow.width;
            textNode.y = 0;
        } else if (dx > 0) { // 箭头都向右
            this.arrow.rotation = 180;
            this.arrow.x = - this.mask.width * 0.5 - this.arrow.width - 20;
            this.arrow.y = 0;
            mx = 20;
            textNode.anchorX = 1;
            textNode.anchory = 0.5;
            textNode.x = this.arrow.x - this.arrow.width;
            textNode.y = 0;
        } else if (dy > 0) { // 中间最上面
            this.arrow.rotation = 90;
            this.arrow.y = - this.mask.height * 0.5 - this.arrow.height - 20;
            this.arrow.x = 0;
            my = 20;
            textNode.anchorX = 0.5;
            textNode.anchory = 1;
            textNode.y = this.arrow.y - this.arrow.height - 20;
            textNode.x = 0;
        } else { // 中间下面两个
            this.arrow.rotation = -90;
            this.arrow.y = this.mask.height * 0.5 + this.arrow.height + 20;
            this.arrow.x = 0;
            my = -20;
            textNode.anchorX = 0.5;
            textNode.anchory = 0;
            textNode.y = this.arrow.y + this.arrow.height + 20;
            textNode.x = 0;
        }


        let action = cc.repeatForever(cc.sequence(cc.moveBy(1, mx, my), cc.moveBy(1, -mx, -my)));
        this.arrow.stopAllActions();
        this.arrow.runAction(action);
    },

    // update (dt) {},
});
