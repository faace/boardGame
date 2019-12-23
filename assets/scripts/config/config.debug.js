module.exports.append = function (targetConfig) {
    let config = {
        mode: 2, // 1: product, 2:debug,2的时候不经过host判断
        net: {
            host: "http://localhost:4070"
        },
        // startScene: 'scFight'
    };

    let copy = function (from, to) {
        for (var i in from) {
            if (typeof from[i] == 'object') {
                to[i] = to[i] || {};
                copy(from[i], to[i]);
            } else to[i] = from[i];
        }
    };

    copy(config || {}, targetConfig)
};