let MyListView = require('MyListView');
let um = {
    loadScene: function (name, parm) { // 会先调用等待窗口，之后再打开场景
        ge._parm = parm;
        return cc.director.loadScene(name);
    },
    getJs: function (node, pre) { // 获得某个节点的第一个js文件
        let comp = node._components || [];
        for (let i = 0; i < comp.length; i++) {
            let name = comp[i].name.split('<');
            if (name.length == 2) {
                if (name[1].indexOf(pre || 'pf') == 0) return comp[i];
                else if (name[1].indexOf('ly') == 0) return comp[i];
                else if (name[1].indexOf(name[0]) == 0) return comp[i];
            }
        }
        return null;
    },
    alert: function (parm) {
        if (typeof parm == 'string' || typeof parm == 'number') {
            parm = {
                content: '' + arguments[0],
                ok: arguments[1],
                cancel: arguments[2]
            }
        }

        return ge.create(this.pfAlert, this.alertNode, parm);
    },

    cleanAlert: function () {
        let children = this.alertNode.getChildren();
        let list = [];
        for (let child of children) {
            if (child.name == 'pfAlert') list.push(child);
        }
        for (let i = 0; i < list.length; i++) list[i].destroy();
    },
    waiting: function (txt) {
        return ge.alert({
            title: '',
            enableClose: false,
            content: txt,
        });
    },
    openLayer: function (name, parm, cb) {
        this.layerList = {};
        if (this.layerList[name]) {
            let layer = ge.create(this.layerList[name], this.layerNode, parm);
            cb && cb(layer);
            return;
        }

        this.loadingLayer = this.loadingLayer || [];

        //正在加载中, 不用重复启动
        if (this.loadingLayer[name]) {
            cb && cb(name + '已经在加载中!!');
            return ge.log(name + '已经在加载中!!');
        } else {
            this.loadingLayer[name] = true;
        }

        cc.loader.loadRes('layers/' + name, cc.Prefab, (err, prefab) => {
            this.loadingLayer[name] = null;
            if (prefab && prefab._uuid) {
                this.layerList[name] = prefab;
                let layer = ge.create(prefab, this.layerNode, parm);
                cb && cb(layer);
            } else cb && cb(true);
        });
    },
    cleanLayer: function () {
        this.layerNode.destroyChildren();
    },
    guide: function (parm, a, b, c, d) { // 展示一个引导界面
        if (typeof parm == 'string') { // 指定某个节点
            parm = {
                x: parm,
                y: y,
                txt: txt
            }
        } else if (!isNaN(parm)) {
            parm = {
                x: parm,
                y: a,
                txt: b,
                width: c,
                height: d
            };
        }
        let guide = cc.instantiate(this.pfGuilde);
        guide.parent = this.guideNode;
        ge.getJs(guide).init(parm);
    },
    cleanGuide: function () {
        let children = this.guideNode.getChildren();
        let list = [];
        for (let child of children) {
            list.push(child);
        }
        for (let i = 0; i < list.length; i++)list[i].destroy();
    },
    addClick: function (target, cb, isScale) {
        if (!target.getComponent(cc.Button)) {
            let btn = target.addComponent(cc.Button);
            if (isScale) btn.transition = cc.Button.Transition.SCALE;
        }
        target.off('click');
        target.on('click', cb);
        return target;
    },
    create: function (one, parent, parm) { // 创建并调用init函数
        let o = cc.instantiate(one);
        o.parent = parent;
        let js = ge.getJs(o);
        if (js && js.init) js.init(parm);
        return o;
    },
    listView: function (parm) {
        return new MyListView(parm);
    }
}
module.exports.init = function () {
    ge.Component = require('UIBaseManager');
    ge.loadScene = um.loadScene;
    ge.getJs = um.getJs;
    ge.alert = um.alert;
    ge.cleanAlert = um.cleanAlert;
    ge.waiting = um.waiting;
    ge.openLayer = um.openLayer;
    ge.cleanLayer = um.cleanLayer;
    ge.guide = um.guide;
    ge.cleanGuide = um.cleanGuide;
    ge.addClick = um.addClick;
    ge.create = um.create;

    ge.PM = require('PoolManager');
    ge.listView = um.listView;
};