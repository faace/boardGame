/**
* 事件管理类
* 1. 事件的监听绑定与删除
* 2. 事件本身的：
*      优先级: 约大优先级越高
*      派发方式: 立即发送，延迟发送
* 3. 事件的传递：支持拦截，支持一次性
*
* @module core
* @class EventManager
* @constructor
*/

var EventManager = function () {
    // this.__instanceId = cc.ClassManager.getNewInstanceId();
    // this.scheduler = cc.director.getScheduler();
    this.events = {};
    this.targets = []; // 用于监听所有消息的
    this.list = []; // 用于被动分发消息
};
/**
 * 添加监听对象来监听所有消息
 * @method onAll
 * @param {Object} listener - 监听该消息的对象。监听所有消息
 * @param {Number} [priority] 监听级别，0最小，越大越高
 * @param {Number} [once] 处理多少次，默认为一直响应，1为一次，2为2次，以此类推
* @returns {EventManager} 返回自己
 */
EventManager.prototype.onAny = function (listener, priority, once) { // 添加一个监听对象；priority越小级别越低，默认0；
    // ge.log('onAny', this, listener);
    if (!listener) return this;
    var targets = this.targets;
    for (var i = 0; i < targets.length; i++) {
        if (listener == targets[i]) return this;
    }
    targets.push({
        listener: listener,
        pri: parseInt(priority || 0), // 越小级别越低
        once: once || -1 // 默认是一直响应，1表示1次，2表示2次
    });
    targets.sort(function (a, b) { return a.pri - b.pri }); // pri小的会放在数组最前面
    return this;
};
/**
 *  删除某个监听所有消息的对象
 * @method offAny
 * @param {Object} listener 监听该消息的对象。对象必须实现对应消息的处理函数（on消息名）。或者实现处理任何消息的函数（onAnyMsg）
 * @returns {EventManager} 返回自己
 */
EventManager.prototype.offAny = function (listener) { // 删除某个监听对象的某个消息
    // ge.log('offAny', this, listener);
    if (!listener) return this;
    var targets = this.targets;
    for (var i = 0; i < targets.length; i++) {
        if (listener == targets[i].listener) {
            targets.splice(i, 1);
            return this;
        }
    }
    return this;
};
/**
 * 添加监听消息以及监听对象
 * @method on
 * @param {String} eventName 需要监听的消息名，第一个字母必须大写
 * @param {Object} listener - 监听该消息的对象。
 * - 对象必须实现对应消息的处理函数（on消息名）；或者实现处理任何消息的函数（onAnyMsg）
 * - 回调函数如果返回true表示拦截了该消息，那么消息就不在向下发送
 * @param {Number} [priority] 监听级别，0最小，越大越高
 * @param {Number} [once] 处理多少次，默认为一直响应，1为一次，2为2次，以此类推
* @returns {EventManager} 返回自己
 */
EventManager.prototype.on = function (eventName, listener, priority, once) { // 添加一个监听对象；priority越小级别越低，默认0；
    if (!eventName) return this;
    var firstChar = eventName.slice(0, 1);
    if (firstChar != firstChar.toUpperCase()) throw '[First char of the string must be upper case]';
    if (typeof listener != 'function') {
        if (!listener || !(listener['on' + eventName] || listener['onAnyMsg'])) throw '[No on' + eventName + ' or onAnyMsg handler of the listener]';
    }
    //
    if (!this.events[eventName]) this.events[eventName] = [];
    var eventListeners = this.events[eventName];
    eventListeners.push({
        listener: listener,
        pri: parseInt(priority || 0), // 越小级别越低
        once: once || -1 // 默认是一直响应，1表示1次，2表示2次
    });
    eventListeners.sort(function (a, b) { return a.pri - b.pri }); // pri小的会放在数组最前面
    return this;
};

EventManager.prototype.ons = function (eventNames, listener, priority, once) { // 添加一个监听对象；priority越小级别越低，默认0；
    if (Array.isArray(eventNames)) {
        for (var i = 0, len = eventNames.length; i < len; i++) {
            this.on(eventNames[i], listener, priority, once);
        }
    }
    return this;
};

/**
 *  删除某个监听对象的某个消息
 * @method off
 * @param {String} eventName 需要监听的消息名
 * @param {Object} listener 监听该消息的对象。对象必须实现对应消息的处理函数（on消息名）。或者实现处理任何消息的函数（onAnyMsg）
* @returns {EventManager} 返回自己
 */
EventManager.prototype.off = function (eventName, listener) { // 删除某个监听对象的某个消息
    var eventListeners = this.events[eventName];
    if (eventListeners) {
        for (var i = 0, len = eventListeners.length; i < len; i++) {
            if (eventListeners[i].listener == listener) {
                eventListeners.splice(i, 1);
                return this;
            }
        }
    }
    return this;
};

/**
 *  删除某个消息的所有监听对象
 * @method offAll
 * @param {String} eventName 需要监听的消息名
* @returns {EventManager} 返回自己
 */
EventManager.prototype.offAll = function (eventName) { // 删除某个消息的所有监听对象
    if (this.events[eventName]) {
        delete this.events[eventName];
    }
    return this;
};

/**
 *  直接派发消息
 * @method dispatch
 * @param {Object} event 消息
 * @param {String} event.name 消息名
 */
EventManager.prototype.dispatch = function (event) {
    var eventName = event.name;
    var eventListeners = this.events[eventName];
    var one, eventHandler, listener, rc;
    var handleTargets = [];
    // 1. 优先处理指定事件的
    if (eventListeners) {
        for (var i = eventListeners.length - 1; i >= 0; i--) {
            one = eventListeners[i];
            eventHandler = 'on' + eventName;
            listener = one.listener;
            if (typeof listener != 'function') {
                if (!listener[eventHandler]) eventHandler = 'onAnyMsg';
                rc = listener[eventHandler] && listener[eventHandler](event); // 如果返回true，表示不再下发
                handleTargets.push(listener);
            } else {
                rc = listener(event);
            }
            if (--one.once == 0) eventListeners.splice(i, 1); // 如果只是 一次，那么就删除我
            if (rc === true) return;
        }
    }
    // 2. 在处理对象监听的
    var targets = this.targets;
    for (var i = 0; i < targets.length; i++) {
        one = targets[i];
        if (handleTargets.indexOf(one) >= 0) continue; // 已经处理过了，不需要在这里处理
        eventHandler = 'on' + eventName;
        listener = one.listener;
        if (!listener[eventHandler]) eventHandler = 'onAnyMsg';
        rc = listener[eventHandler] && listener[eventHandler](event); // 如果返回true，表示不再下发

        if (--one.once == 0) targets.splice(i, 1); // 如果只是 一次，那么就删除我
        if (rc === true) return;
    }
};

/**
 *  通过一定的条件派发消息，如果不填interval和afterFrames表示立即发送
 * @method post
 * @param {Object} event 消息
 * @param {String} event.name 消息名
 * @param {Number} [interval] 间隔多少秒才直接发送，1为1秒，0.5为0.5秒（优先处理）
 * @param {Number} [afterFrames] 间隔多少个0.1秒才发送（次要处理）
 * @param {Function} [cb] 回调函数，处理完消息后调用
 * @returns {Boolean} 是否有监听来处理该消息
 */
EventManager.prototype.post = function (event, interval, afterFrames, cb) {
    if (interval === undefined && afterFrames === undefined) { // 不填写这两个信息就是立即发送
        this.dispatch(event);
        cb && cb();
        return;
    }
    if (interval != null && interval >= 0) {
        setTimeout(() => {
            this.dispatch(event);
            cb && cb();
        }, 10);
        // this.scheduler.schedule(function () {
        //     this.dispatch(event);
        //     cb && cb();
        // }, this, parseFloat(interval), 0, 0, false);
    } else if (afterFrames != null && afterFrames >= 0) {
        setTimeout(() => {
            this.dispatch(event);
            cb && cb();
        }, 10);

        // this.scheduler.schedule(function () {
        //     if (afterFrames-- < 1) {
        //         this.scheduler.unschedule();
        //         this.dispatch(event);
        //         cb && cb();
        //     }
        // }, this, 0.1, afterFrames, 0, false);
    } else {
        this.dispatch(event);
        cb && cb();
    }
};

/**
 *  被动添加消息到缓冲
 * @method push
 * @param {Object} event 消息
 * @param {String} event.name 消息名
 * @param {Number} [interval] 间隔多少秒才直接发送，1为1秒，0.5为0.5秒（优先处理）
 * @param {Number} [afterFrames] 间隔多少个0.1秒才发送（次要处理）
 * @returns {EventManager} 返回自己
 */
EventManager.prototype.push = function (event, interval, afterFrames) {
    this.list.push({
        event: event,
        interval: interval,
        afterFrames: afterFrames
    });
    return this;
};

/**
 *  手动发送一条消息（如果有）
 * @method shift
 * @param {Function} [cb] 回调函数，处理完消息后调用
 * @returns {EventManager} 返回是否发送成功并且有监听对象处理了
 */
EventManager.prototype.shift = function (cb) {
    var one = this.list.shift();
    if (one) return this.post(one.event, one.interval, one.afterFrames, cb);
    return false;
};

/**
 *  自动出发消息发送，
 *     - 如果之前是暂停的，调用后将继续依次发送消息
 *     - 如果没有数据将停留0.3秒之后再尝试发送数据
 * @method auto
 */
EventManager.prototype.auto = function () {
    if (this.isAutoing) return; // 已经启动
    this.isAutoing = true;
    this.isPause = false; // 每次调用自动取消暂停
    var rc = this.shift(() => {
        this.isAutoing = false;
        this.isPause || this.auto();
    });
    if (!rc) { // 如果没有消息了，就停留0.3秒
        setTimeout(() => {
            this.isAutoing = false;
            this.isPause || this.auto();
        }, 10);

        // this.scheduler.schedule(() => {
        //     this.isAutoing = false;
        //     this.isPause || this.auto();
        // }, this, 0.3, 0, 0, false);
    }
};

/**
 *  暂停自动发送消息，需要重新调用auto函数来启动自动发送消息
 * @method pause
 */
EventManager.prototype.pause = function () {
    this.isPause = true;
};

module.exports = EventManager;