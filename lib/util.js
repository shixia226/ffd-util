export default {
    isFunction(func) {
        return Object.prototype.toString.call(func) === '[object Function]';
    },
    isString(str) {
        return Object.prototype.toString.call(str) === '[object String]';
    },
    isArray(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    },
    isNull(obj) {
        return obj === null || obj === undefined;
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
        var args = [].slice.call(arguments, 2);
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