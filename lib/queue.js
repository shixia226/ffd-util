let util = require("./util");

module.exports = function(config) {
    config = config || {};

    let queue = [],
        idc = 0,
        firing = false,
        fireIdx = null,
        fireLen = null;

    return {
        add(handler) {
            if (!handler) return;
            let trigger = false,
                item;
            if (util.isFunction(handler)) {
                item = { handler: handler, id: ++idc };
                trigger = parseBool(config.trigger);
            } else {
                let func = handler.handler;
                if (!util.isFunction(func)) return;
                if (handler.unique) {
                    this.remove(func, handler.context);
                }
                trigger = parseBool(handler.trigger, config.trigger);
                item = {
                    handler: func,
                    context: handler.context,
                    args: handler.args,
                    once: parseBool(handler.once, config.once),
                    single: handler.single === true,
                    id: ++idc
                };
            }
            if (util.call(config.push, this, item, handler) !== false) {
                if (!(trigger && util.call(item) === false && item.once)) {
                    queue.push(item);
                    util.call(config.change, this, queue.length);
                    return idc;
                }
            }
        },
        remove(handler, context) {
            let idx = indexOf(queue, handler, context);
            if (idx !== -1) {
                queue.splice(idx, 1);
                if (firing) {
                    fireLen--;
                    if (idx <= fireIdx) fireIdx--;
                }
                util.call(config.change, this, queue.length);
            }
        },
        clear() {
            queue.length = 0;
            util.call(config.change, this, 0);
        },
        fire(data) {
            if (firing) return;
            firing = true;
            fireIdx = 0;
            fireLen = queue.length;
            while (fireIdx < fireLen) {
                let t = queue[fireIdx];
                if (util.call(config.ready, this, t, data) !== false) {
                    if (util.call(t, this, data) === false || t.once) {
                        let idx = queue.indexOf(t);
                        if (idx !== -1) {
                            //这里需要重新indexOf查找位置，否则在callback里调用了remove后将造成删除错误
                            util.call(config.pop, this, t);
                            queue.splice(idx, 1);
                            fireLen--;
                            fireIdx--;
                        }
                    }
                    if (t.single) break;
                }
                fireIdx++;
            }
            firing = false;
            util.call(config.change, this, queue.length);
        }
    };
};

function indexOf(list, handler, context) {
    for (let i = 0, len = list.length; i < len; i++) {
        let opt = list[i];
        if (opt.id === handler) {
            return i;
        }
        if (opt.handler === handler) {
            if (
                opt.context === context ||
                context.selector === opt.context.selector
            ) {
                return i;
            }
        }
    }
    return -1;
}

function parseBool(b, db) {
    return (util.isEmpty(b) ? db : b) === true;
}
