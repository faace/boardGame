/**
 * 使用全局函数ge.alert(parm);来打开对话框，其中parm的详细参数如下
 * // 所有参数
 * parm = {
 *     zIndex: 0, // 可选
 *     title: '标题提示', // 可选
 *     content: "测试\n测试\n测试", // 必须
 *     enableClose: true, // 可选 是否显示右上角关闭按钮，默认显示
 *     autoRemove:1.5, // 多少秒自动删除
 *     ok: { // 可选 是否显示ok按钮，如果没有这个参数就不显示
 *         text: '确定',
 *         cb: function () { }, //  需要返回true才表示不自动关闭，如果回调返回是true，则表示不关闭窗口
 *     },
 *     cancel: { // 可选 是否显示cancel按钮，如果没有这个参数就不显示，如果回调返回是true，则表示不关闭窗口
 *         text: '取消',
 *         cb: function () { }
 *     },
 *     closeCB: function () {}
 * }
 * // 简约写法0，直接参数法
 * ge.alert('提醒内容')
 * ge.alert('提醒内容', okObj);
 * ge.alert('提醒内容', okObj, cancelObj);
 * 
 * // 简约写法1，没有回调
 * ge.alert({
 *     title: '标题提示', // 可选
 *     content: '提醒内容', // 必须
 *     ok: '确定' // 如果不需要修改确定的名字，可以这样：ok: {}
 * });
 * // 简约写法2，有回调
 * ge.alert({
 *     content: '提醒内容', // 必须
 *     ok: { // 可选 是否显示ok按钮，如果没有这个参数就不显示
 *         text: '确定',
 *         cb: function () { }, //  需要返回true才表示不自动关闭
 *     },
 * });
 */

/**
 * 通用对话框的实现方式
 *
 * @module core
 * @class pfAlert
 * @extends {ge.Component}
 * @constructor
 */
cc.Class({
    extends: cc.Component,
    properties: {
        title: cc.Label,
        close: cc.Node,
        content: cc.Label, // 内容
        btns: cc.Node,
        btn: cc.Node,
        btnTxt: cc.Label,
        btnTxtColor: [cc.Color],
        btnSpriteFrame: [cc.SpriteFrame]

    },

    init: function (parm) {
        // 设置标题
        if (typeof parm.title != 'undefined') this.title.string = '' + parm.title;

        // 设置关闭按钮
        if (typeof parm.enableClose == 'undefined' || parm.enableClose) {
            ge.addClick(this.close, () => { this.closeMe(); });
        } else this.close.active = false;

        // 设置内容
        this.content.string = parm.content;

        // 设置按钮
        if (parm.ok || parm.cancel) {
            let btns = [];
            if (parm.cancel) btns.push(this.createButton('取消', parm.cancel, 0));
            if (parm.ok) btns.push(this.createButton('确定', parm.ok, 1));

            if (btns.length == 2) { // 只有两个的时候才会调整一下位置
                btns[0].x = this.btns.width * -0.25;
                btns[1].x = this.btns.width * 0.25
            }
        } else { // 如果没有按钮，就整体移动一点
            if (parm.title) this.content.node.y -= 23;
        }

        if (parm.autoRemove) {
            setTimeout(() => {
                this.closeMe()
            }, parm.autoRemove * 1000);
        }
        // let dialog = ge.getDialog(dlParm);
        // dialog.parent = this.node;
    },

    closeMe() {
        this.node.destroy();
    },

    createButton(text, parm, idx) {
        let cb = (typeof parm == 'function') ? parm : (parm.cb || null);
        this.btnTxt.string = (typeof parm == 'string') ? parm : parm.text || text;
        if (this.btnTxtColor[idx]) this.btnTxt.node.color = this.btnTxtColor[idx];


        let one = cc.instantiate(this.btn);
        one.parent = this.btns;
        one.active = true;
        if (this.btnSpriteFrame[idx]) one.getComponent(cc.Sprite).spriteFrame = this.btnSpriteFrame[sfIdx]; // 如果有设置背景图
        ge.addClick(one, () => {
            let rc = cb && cb();
            if (!rc) this.closeMe();
        });
        return one;

    }
});