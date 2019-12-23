var fs = require('fs-extra');
var path = require('path');
let sp = module.exports = {
    scan: function (pp, suffix, cb) {
        let myFiles = fs.readdirSync(pp);
        for (let i in myFiles) {
            let name = myFiles[i];
            let newPp = path.join(pp, name);
            let stat = fs.lstatSync(newPp);

            if (stat.isDirectory()) {
                sp.scan(newPp, suffix, cb);
            } else {
                if (name.substr(- suffix.length) == suffix) cb(newPp);
            }
        }
    },
};

// sp.scan('G:\\cocoscreator\\colorSwitch\\build\\wechatgame', '.js', (file) => {
//     console.log(file);
// });

// sp.scan('G:\\cocoscreator\\colorSwitch\\build\\wechatgame', '.json', (file) => {
//     console.log(file);
// });