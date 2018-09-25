let util = {
    isEmpty(obj) {
        return util.isNull(obj) || this.isUndefined(obj);
    },
    /**
     * 执行函数对象
     * @param handler 函数对象
     * @param context 执行的上下文
     * 
     * 所谓函数对象就是既可以是一个函数，也可以是一个对象，该对象具有如下属性：
     * {
     *      handler: 函数，字符串（该字符串是上下文对象的方法name）
     *      context: 上下文，选填
     *      args: 参数，选填
     * }
     * 从第三个参数开始后面的参数都将作为函数对象的执行参数，且放在函数对象内的args后面
     */
    call(handler, context) {
        if (!handler) return;
        let args = [].slice.call(arguments, 2);
        if (this.isFunction(handler)) {
            return handler.apply(context, args);
        } else {
            context = handler.context || context;
            let realArgs = handler.args;
            args = (realArgs ? this.isArray(realArgs) ? realArgs : [realArgs] : []).concat(args);
            if (this.isString(handler) || this.isString(handler = handler.handler)) {
                handler = context ? context[handler] : null;
            }
            if (this.isFunction(handler)) {
                return handler.apply(context, args);
            }
        }
    }
}

let names = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Null', 'Undefined'],
    toString = Object.prototype.toString;
for (let i = 0, len = names.length; i < len; i++) {
    (function (name, util, toString) {
        let type = '[object ' + name + ']';
        util['is' + name] = function (obj) {
            return toString.call(obj) === type;
        };
    })(names[i], util, toString);
}

module.exports = util;