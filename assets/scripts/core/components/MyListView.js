var idx = 0;
var getUpdateHandle = function (name) {
    let one = cc.Class({
        extends: cc.Component,
        name: name,
        properties: {

        },
        init(parm) {
            this.ts = parm.ts;
            this.num = parm.num;
            this.cb = parm.cb;
            this.idx = 0;
        },
        update: function (dt) {
            if (this.idx < this.num) {
                // ge.log(idx);
                let ts = Date.now() + this.ts;
                while (Date.now() < ts && this.idx < this.num) {
                    this.cb(this.idx++);
                }
            }
        },
    });
    return one;
}

class MyListView {
    constructor(parm) {
        this.scrollview = parm.scrollview;
        this.content = parm.content;
        this.itemTpl = parm.itemTpl;
        this.itemTpl.active = false;
        this.itemWidth = this.itemTpl.width;
        this.itemHeight = this.itemTpl.height;
        this.itemAnchorX = this.itemTpl.anchorX;
        this.itemAnchorY = this.itemTpl.anchorY;
        this.dir = parm.direction || 'Vertical';
        this.width = parm.width || this.scrollview.node.width;
        this.height = parm.height || this.scrollview.node.height;
        this.gapX = parm.gapX || 0;
        this.gapY = parm.gapY || 0;
        this.row = parm.row || 1;
        this.col = parm.col || 1;
        if (parm.setItemsCb) this.setItemsCb = parm.setItemsCb;


        this.contentWidth = (this.itemWidth + this.gapX) * this.col;
        this.startX = - this.contentWidth * 0.5 + this.itemWidth * 0.5 + this.gapX * 0.5;
        this.startY = - this.itemHeight * 0.5;

        let name = 'CC_LV_UPDATE_' + (idx++);
        this.pm = new ge.PM(parm.itemTpl, parm.content);
        this.scrollview.node.addComponent(getUpdateHandle(name));
        this.updateHandleJs = this.scrollview.node.getComponent(name);

    }
    setItemsCb(item, data, idx) {
        let itemJs = ge.getJs(item);
        if (itemJs && itemJs.init) itemJs.init(data);
    }
    setItems(datas) {
        this.pm.recycle(); // 回收所有的对象

        let lines = Math.ceil(datas.length / this.col);
        this.content.height = lines * (this.itemHeight + this.gapY);

        this.updateHandleJs.init({
            ts: 30, // 最多占用300毫秒
            num: datas.length,
            cb: (idx) => { // 插件
                let item = this.pm.get();
                item.active = true;
                let data = datas[idx];

                if (this.setItemsCb) this.setItemsCb(item, data, idx);

                let x = idx % this.col;
                let y = Math.floor(idx / this.col);

                item.x = this.startX + x * this.itemWidth + x * this.gapX;
                item.y = this.startY - y * this.itemHeight - y * this.gapY;
            }
        });
    }
    getItems() {
        return this.content.getChildren();
    }
    addItems(datas) {
        let count = this.content.getChildrenCount();
        let lines = Math.ceil((count + datas.length) / this.col);
        this.content.height = lines * (this.itemHeight + this.gapY);

        this.updateHandleJs.init({
            ts: 30, // 最多占用300毫秒
            num: datas.length,
            cb: (idx) => { // 插件
                let item = this.pm.get();
                item.active = true;
                let data = datas[idx];

                if (this.setItemsCb) this.setItemsCb(item, data, idx);

                let x = (count + idx) % this.col;
                let y = Math.floor((count + idx) / this.col);

                item.x = this.startX + x * this.itemWidth + x * this.gapX;
                item.y = this.startY - y * this.itemHeight - y * this.gapY;
            }
        });
    }
    delItems(datas) {
        if (!Array.isArray(datas)) datas = [datas];
        datas.forEach((one) => {
            this.pm.put(one);
        });
        this.restructItems();
    }
    cleanItems() {
        let children = this.getItems();
        for (let i = children.length - 1; i > -1; i--) {
            this.pm.put(children[i]);
        }
    }
    restructItems() { // 重新调整布局
        if (this.dir == 'Vertical') {
            let children = this.content.getChildren();
            let lines = Math.ceil(children.length / this.col);
            this.content.height = lines * (this.itemHeight + this.gapY);


            // let x = 0, y = 0;
            for (let idx = 0; idx < children.length; idx++) {
                let child = children[idx];
                let x = idx % this.col;
                let y = math.floor(idx / this.col);

                child.x = this.startX + x * this.itemWidth + x * this.gapX;
                child.y = this.startY - y * this.itemHeight - y * this.gapY;
            }

        }
    }
};
module.exports = MyListView;