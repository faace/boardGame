module.exports.init = function () {
    if (typeof wx == 'object') {
        ge.sdk = require('sdkWx')();
    } else if (typeof jsb == 'undefined') {
        ge.sdk = require('sdkWeb')();
    } else {
        ge.sdk = require('sdkApk')();
    }
};