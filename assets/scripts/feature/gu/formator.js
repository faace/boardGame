module.exports = function () {
    // 这些是一些通用的，特殊的直接写在最下面
    let parseInt36 = function (val) { // 取出
        return parseInt(val, 36);
    };
    let stringifyInt36 = function (val) { // 存入，得到的结果用于保存到文件
        return val.toString(36);
    };

    let parseStr = function (val) { // 取出
        return val;
    };
    let stringifyStr = function (val) { // 存入，得到的结果用于保存到文件
        return val;
    };

    let parseIntProtect = function (val) {
        return val + '_' + (val * 13) + '_' + (val * 117) + '_' + (val * 3119)
    };
    let stringifyIntProtect = function (val) {
        val = val.split('_'); // : '0_0_0_0', // 1倍，13倍，113倍，3119倍
        if (val[0] * 13 != val[1]) return 0;
        if (val[0] * 117 != val[2]) return 0;
        if (val[0] * 3119 != val[3]) return 0;
        return val[0].toString(36);
    };

    return {
        version: {
            tag: 'V',
            parse: parseInt36,
            stringify: stringifyInt36
        },
        lastTs: {
            tag: 'L',
            parse: parseInt36,
            stringify: stringifyInt36
        },
        uid: {
            tag: 'U',
            parse: parseStr,
            stringify: stringifyStr
        },
        name: {
            tag: 'N',
            parse: parseStr,
            stringify: stringifyStr
        },
        img: {
            tag: 'I',
            parse: parseStr,
            stringify: stringifyStr
        },
        coin: {
            tag: 'C',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },
        gem: {
            tag: 'G',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },
        rating: {
            tag: 'R',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },

        strength: {
            tag: 'S',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },
        accuracy: {
            tag: 'A',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },
        luck: {
            tag: 'L',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },

        fireHit: {
            tag: 'F',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },
        freeze: {
            tag: 'f',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },
        acidHit: {
            tag: 'A',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },
        key: {
            tag: 'K',
            parse: parseIntProtect,
            stringify: stringifyIntProtect
        },

        today: {
            tag: 'T',
            parse: parseStr,
            stringify: stringifyStr
        },

        bag: {
            tag: 'B',
            parse: function (val) {
                let list = val.split('&');
                let bag = [];
                for (let i = 0; i < list.length; i++) {
                    let oneBag = [];
                    let one = list[i].split('#');
                    for (let j = 0; j < one.length; j++) {
                        let item = one[j].split('|');
                        oneBag.push({
                            id: parseInt36(item),
                            num: parseInt36(item)
                        });
                    }

                    bag.push(oneBag);
                }
                return bag;
            },
            stringify: function (bag) {
                let list = [];
                for (let i = 0; i < bag.length; i++) {
                    let oneBag = bag[i];
                    let item = [];
                    for (let j = 0; j < oneBag.length; j++) {
                        let one = oneBag[j];
                        item.push(one.id.toString(36) + '|' + one.num.toS(36));
                    }
                    list.push(item.join('#'));
                }
                return list.join('&');
            },
        },
        axes: {
            tag: 'X',
            parse: function (val) {
                let list = val.split('&');
                let obtains = [];
                let ads = {};
                let axes = {
                    obtains: obtains,
                    selected: parseInt36(list[1]),
                    ads: ads
                };
                let obtainsItems = list[0].split('|');
                for (let i = 0; i < obtainsItems.length; i++) {
                    obtains.push(parseInt36(obtainsItems[i]));
                }

                let adsItems = list[2].split('|');
                for (let i = 0; i < adsItems.length; i++) {
                    let one = adsItems[i].split('_');
                    ads[parseInt36(one[0])] = parseInt36(one[1]);
                }
                return axes;
            },
            stringify: function (val) {
                let axes = [];

                let obtains = [];
                for (let i = 0; i < val.botains.length; i++) obtains.push(val.botains[i].toString(36));
                axes.push(obtains.join('|'));

                axes.push(val.selected.toString(36));

                let ads = [];
                for (let key in val.ads) {
                    ads.push(key.toString(36) + '_' + val.ads.key.toString(36));
                }

                axes.push(ads.join('|'));

                return axes.join('#')
            },
        },
        lanterns: {
            tag: 'l',
            parse: function (val) {
                let list = val.split('&');
                let obtains = [];
                let lanterns = {
                    obtains: obtains,
                    selected: parseInt36(list[1])
                };
                let obtainsItems = list[0].split('|');
                for (let i = 0; i < obtainsItems.length; i++) {
                    obtains.push(parseInt36(obtainsItems[i]));
                }
                return lanterns;
            },
            stringify: function (val) {
                let lanterns = [];

                let obtains = [];
                for (let i = 0; i < val.botains.length; i++) obtains.push(val.botains[i].toString(36));
                lanterns.push(obtains.join('|'));

                lanterns.push(val.selected.toString(36));


                return lanterns.join('#')
            },
        },
        chests: {
            tag: 'c',
            parse: function (val) {
                let list = val.split('&');

                let chests = [];
                for (let i = 0; i < list.length; i++) {
                    let one = list[i];
                    if (one != '') {
                        let item = one.split('|')
                        chests.push({
                            type: parseInt36(item[0]),
                            lv: parseInt36(item[1]),
                            leftTs: parseInt36(item[2])
                        });
                    } else chests.push({});
                }
                return chests;
            },
            stringify: function (val) {
                let chests = [];

                for (let i = 0; i < val.length; i++) {
                    let one = val[i];
                    if (one.type) {
                        chests.push(one.type.toString(36) + '|' + one.lv.toString(36) + '|' + one.leftTs.toString(36));
                    } else chests.push('');
                }
                return chests.join('|')
            },
        }
    }
};