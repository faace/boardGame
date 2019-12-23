let PoolManager = module.exports = function (tpl, target) {
    this.np = new cc.NodePool();
    this.tpl = tpl;
    this.target = target;
};

PoolManager.prototype.get = function (tt) {
    if (this.np.size() == 0) this.np.put(cc.instantiate(this.tpl));
    let one = this.np.get();
    one.parent = tt || this.target;
    return one;
};

PoolManager.prototype.put = function (item) {
    this.np.put(item);
};

PoolManager.prototype.recycle = function (tt) { // tt可选，如果没填，就用插件时的节点
    let children = (tt || this.target).getChildren();
    for (let i = children.length - 1; i >= 0; i--) this.np.put(children[i]);
}

PoolManager.prototype.destroy = function () {
    this.np.clear();
    delete this.np;
    delete this.tpl;
    delete this.target;
}