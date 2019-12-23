// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pfTabItem: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(parm) {
        this.isVertical = parm.isVertical; // 是否垂直

        let one = cc.instantiate(this.pfTabItem);
        this.w = one.width;
        this.h = one.height;
        let x = this.w * 0.5;
        let y = this.h * -0.5;
        this.list = [];
        parm.list.forEach((one) => {
            let p = {
                id: one.id,
                isSel: false, // 默认都是没选中
                name: one.name,
                cb: this.clickCb.bind(this),
            }
            let pfTabItem = cc.instantiate(this.pfTabItem);
            pfTabItem.parent = this.node;
            pfTabItem.x = x;
            pfTabItem.y = y;

            let pfTabItemJs = ge.getJs(pfTabItem);
            pfTabItemJs.init(p);
            this.list.push(pfTabItemJs);

            if (this.isVertical) y -= this.h;
            else x += this.w;
        });
        this.cb = parm.cb;


        this.clickCb(parm.selId);
    },

    clickCb(id) {
        this.list.forEach((one) => {
            one.setSel(one.id == id);
        });
        this.selId = id;
        this.cb && this.cb(id);
    },
    // update (dt) {},
});
