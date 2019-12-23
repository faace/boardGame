// 这个类主要用来处理消息机制，以及对象池
module.exports = cc.Class({
    extends: cc.Component,
    onLoad: function () {
        this.EM = ge.EM;
        this.myEventList = [];
        this.scName = cc.director.getScene().name;
        let parm = ge._parm;
        ge._parm = undefined;
        this.onInit && this.onInit(parm);
    },

    // 增加对象池的功能
    // 继承了ge.Component后，可以直接调用this.createNodePool(预制体变量，将要放到哪个节点上)来创建对象池
    // 例如：nodePool = this.createNodePool(pfXx, content);
    // 通过调用nodePool.get()获取一个实例
    // 通过调用nodePool.clear()清除实例中的所有预制体
    createNodePool: function (tpl, target) { // 需要生成的预制体， 预计需要放到那个节点
        this.nodePoolList = this.nodePoolList || [];
        let np = new ge.PM(tpl, target)
        this.nodePoolList.push(np);
        return np;
        // return {
        //     get: function (tt) {
        //         if (np.size() == 0) np.put(cc.instantiate(prefab));
        //         let one = np.get();
        //         if (tt) one.parent = tt;
        //         else if (target) one.parent = target;
        //         return one;
        //     },
        //     put: function (item) { // 单独放一个元素回来
        //         np.put(item);
        //     },
        //     clear: function (tt) { // tt可选，如果没填，就用插件时的节点
        //         let children = (tt || target).children;
        //         for (let i = children.length - 1; i >= 0; i--) np.put(children[i]);
        //     }
        // }

    },

    onDestroy: function () {
        this.removeAllEvent();
        if (this.nodePoolList) {
            while (this.nodePoolList.length > 0) {
                this.nodePoolList[0].destroy()
                this.nodePoolList.splice(0, 1);
            }
        }

        this.onRemove && this.onRemove();
    },

    removeAllEvent: function () {
        let one;
        for (let i = 0, len = this.myEventList.length; i < len; i++) { // 自动删除所有监听消息
            one = this.myEventList[i];
            this.EM.off(one.eventName, one.target);
        }
        this.myEventList.length = 0;

        this.EM.offAny(this);
    },
    on: function (eventName, target, priority) { // 监听消息
        target = target || this;
        let one;
        for (let i = 0, len = this.myEventList.length; i < len; i++) {
            one = this.myEventList[i];
            if (one.target == target && one.eventName == eventName) return this; // 重复了
        }
        this.myEventList.push({ target: target, eventName: eventName });
        this.EM.on(eventName, target, priority); // 注册监听消息
        return this;
    },
    ons: function (eventNames, target, priority) {
        if (arguments.length > 0) {
            let len;
            if (!Array.isArray(eventNames)) { // 表示分开写了
                eventNames = arguments;
                priority = arguments[arguments.length - 1];
                if (typeof priority == 'number') {
                    target = arguments[arguments.length - 2];
                    if (typeof target == 'object') {
                        len = arguments.length - 2;
                    } else {
                        target = null;
                        len = arguments.length - 1;
                    }
                } else if (typeof priority == 'object') {
                    len = arguments.length - 1;
                    target = priority;
                    priority = 0;
                } else {
                    len = arguments.length;
                    priority = 0;
                    target = null;
                }
            } else {
                len = eventNames.length;
                if (typeof target == 'number') {
                    priority = target;
                    target = null;
                }
            }

            for (let i = 0; i < len; i++) {
                this.on(eventNames[i], target, priority);
            }
        }
        return this;
    },
    off: function (eventName, target) { // 注销监听消息
        target = target || this;
        let one;
        for (let i = 0, len = this.myEventList.length; i < len; i++) {
            one = this.myEventList[i];
            if (one.target == target && one.eventName == eventName) {
                this.EM.off(eventName, target);
                this.myEventList.splice(i, 1);
                return this; // 重复了
            }
        }
        return this;
    },
    offs: function (eventNames, target) {
        for (let i = 0, len = eventNames.length; i < len; i++) {
            this.off(eventNames[i], target);
        }
        return this;
    },
    onAny: function (priority, once) {
        this.EM.onAny(this, priority, once);
    },
    offAny: function () {
        this.EM.offAny(this);
    },
    post: function (name, data, interval, afterFrames, cb) {
        let event, defaultData = { errCode: 0 };
        if (typeof name == 'string') { // 如果是分开的
            event = { name: name, data: data || defaultData };
            this.EM.post(event, interval, afterFrames, cb);
        } else { // name就是一个整体的event
            name.data = name.data || defaultData;
            this.EM.post(name, data, interval);
        }
    }

});
