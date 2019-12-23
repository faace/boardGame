
cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrame: [cc.SpriteFrame],
        sprite: cc.Sprite,
        txt: cc.Label,
        outline: cc.LabelOutline,
        shadow: cc.LabelShadow
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(parm) { // id, isSel, cb
        this.id = parm.id;
        this.txt.string = parm.name;
        this.setSel(parm.isSel);
        this.cb = parm.cb;
        this.cb && ge.addClick(this.node, () => {
            this.cb(this.id);
        });


    },

    setSel(isSel) {
        this.isSel = isSel;
        if (isSel) {
            this.sprite.spriteFrame = this.spriteFrame[1];
            this.txt.node.color = cc.color(255, 255, 215);
            this.outline.active = true;
            this.shadow.active = false;
        } else {
            this.sprite.spriteFrame = this.spriteFrame[0];
            this.txt.node.color = cc.color(100, 59, 36);
            this.outline.active = false;
            this.shadow.active = true;
        }
    },
});
