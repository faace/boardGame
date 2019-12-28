var config = {
    name: '纸笔桌游',
    enName: 'board game',
    mode: 1, // 1: product, 2:debug
    version: '0.0.1', // 当前版本
    net: {
        hostUrl: "http://fzxy.palmpk.com:14000/getHost",   // 正式服
        timeout: 8000, // 8s
        checkUrl: '/api/checkUpdate', // 检查是否有更新，顺序确定哪个服务器可用
    },
    plugins: {
        socketIO: true,
        http: true,
        location: false, // 需要定位
        sound: false, // 音乐
        vibrate: true,
        setting: {
            music: false, // 音乐
            effect: false, // 有效
            voice: false, // 语音
            mute: false, // 静音
            vibrate: false, // 震动
        }
    },
    startScene: 'scUpdate'

    // startScene: 'scPhysics'

    // showFPS: true,
};

module.exports = config;