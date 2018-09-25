let util = require("./util");
let Queue = require("./queue");

const DELAY = 226;

let id;

module.exports = new Queue({
    once: true,
    push(handler, options) {
        let delay = parseInt(options.delay, 10);
        handler.delay = isNaN(delay) ? DELAY : delay;
        handler.time = new Date().getTime();
        handler.onfinish = options.onfinish;
    },
    pop(handler) {
        util.call(handler.onfinish);
    },
    ready(handler, time) {
        return time - handler.time >= handler.delay;
    },
    change(size) {
        if (size) {
            if (!id) {
                id = setTimeout(fire, DELAY, this);
            }
        } else if (id) {
            clearTimeout(id);
            id = false;
        }
    }
});

function fire(timeout) {
    id = false;
    timeout.fire(new Date().getTime());
}
