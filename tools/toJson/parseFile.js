let XLSX = require('xlsx');

let parseSheet = function (sheets, filePath) {
    let columns = [], from = 0, to = 0, keys = {}, data = {};

    let initColumn = function () {
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let getTag = function (i) {
            if (i < 26) return chars.charAt(i);

            j = i % 26;
            i = Math.floor(i / 26) - 1;
            return chars.charAt(i) + chars.charAt(j);

        }
        let max = 26 * 26, tag, key, i;
        try {

            for (i = 0; i < max; i++) {
                tag = getTag(i)
                // console.log(tag);
                key = tag + 1;
                // console.log(sheets[key]);
                if (sheets[key] && sheets[key].v != 'END') {
                    if (i > 0) keys[tag] = sheets[key].v;
                    columns.push(tag);
                } else break;
            }
        } catch (error) {
            log('出错：' + filePath);
            log('列数：' + tag, key);
            console.log(error);
        }
        return !(i + 1 >= max);
    };

    let initRows = function () {
        let max = 10000, i;
        try {
            for (i = 1; i < max; i++) {
                if (!sheets['A' + i]) {
                    continue;
                    // if (from < 1) continue;
                    // else throw '中途不应该出现不应该出现空行';
                }
                if (sheets['A' + i].v == 'BEGIN') from = i + 1;
                else if (sheets['A' + i].v == 'END') {
                    to = i - 1;
                    break;
                }
            }
        } catch (error) {
            log('出错：' + filePath);
            log('行数：' + 'A' + i);
            // console.log(error);
        }
        if (from == 0) console.log("出错：未找到 “BEGIN”");
        if (to < from) console.log("出错：未找到 “END”");
        return (from > 0 && to >= from);
    }
    if (!sheets) {
        console.log('出错：' + filePath);
        console.log('没有main表')
        return false;
    }
    if (!initColumn()) return false;
    if (!initRows()) return false;

    if (sheets['A1'].v != 'LLMAP') {//解析其他表
        for (let r = from; r <= to; r++) {
            let one = {}, val;
            // if (sheets[columns[0] + r] && sheets[columns[0] + r].v && !sheets[columns[0] + r].indexOf) {
            //     console.log(sheets[columns[0] + r]);
            // }
            if (!sheets[columns[0] + r] || (typeof sheets[columns[0] + r].v == 'string' && sheets[columns[0] + r].v.indexOf('||') >= 0)) continue;
            for (let i = 1; i < columns.length; i++) {
                if (sheets[columns[i] + r]) {
                    one[keys[columns[i]]] = sheets[columns[i] + r].v
                }
            }
            data[sheets[columns[0] + r].v] = one;
        }
    } else {//解析地图表
        let map = {};
        for (let r = from; r <= to; r++) {
            let val;
            if (!sheets[columns[0] + r] || (typeof sheets[columns[0] + r].v == 'string' && sheets[columns[0] + r].v.indexOf('||') >= 0)) continue;
            val = sheets[columns[0] + r].v;
            if (typeof (val) == 'string' && val.indexOf('map_') >= 0) {
                map = data[val] = {};
                map['maxWidth'] = columns.length - 1;
                continue;
            }
            for (let i = 1; i < columns.length; i++) {
                if (sheets[columns[i] + r]) {
                    let L = keys[columns[i]], R = val;
                    map[L + '_' + R] = sheets[columns[i] + r].v;//怪物id
                }
            }
        }
    }

    return data;
};

module.exports.parse = function (filePath) {
    console.log(filePath);
    let wb = XLSX.readFile(filePath);
    if (filePath.indexOf('txt') >= 0) {
        let data = {};
        for (let i in wb.Sheets) {
            data[i] = parseIdMap(parseSheet(wb.Sheets[i], filePath), 'cn');
        }
        return data;
    } else {
        let sheets = wb.Sheets['main'];
        return parseSheet(sheets, filePath);
    }
};