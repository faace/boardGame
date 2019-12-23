
let processFuncs = {
    defaultFunc: function (name = 'default', data) {
        let reData = {};
        reData[name] = data;
        return reData;
    },

    // 模板一：只特殊处理一次
    xxxx1: function (data) {
        var newData = {};
        return { 'xxxx1': newData }; // 返回的属性名就是 json文件名
    },
    // 模板二：需要对数据进行多次处理
    xxxx2: function (data) {
        let data1 = ge.deepCopy(data); // 注意： 如果会修改data内的数据，请先备份
        let parseForgeMsg = function (data) {
            var newData = {};
            return newData;
        };
        let data2 = ge.deepCopy(data); // 注意： 如果修改了data内的数据，请先备份
        let parseForgeMsg1 = function (data) {
            var newData = {};
            return newData;
        };

        let reData = { // 返回的属性名就是 json文件名
            'xxxx2': parseForgeMsg(data1),
            'xxxx2xxx': parseForgeMsg1(data2)
        };
        return reData;
    },

    id2Attr: function (data) {
        var newData = {}, name = {};
        for (var i in data) {
            newData[i] = data[i].attr;
            name[i] = data[i].cnName;
        }
        // var newData1 = {};
        // for (var i in data) {
        //     newData1[i] = data[i].name
        // }

        // var newData2 = {};
        // for (var i in data) {
        //     newData2[data[i].attr] = data[i].name
        // }
        return { 'id2Attr': newData, 'id2Name': name };
    },
    items: function (data) {
        var newData = {};
        for (var i in data) {
            newData[data[i].enName] = i
        }

        return { 'items': data, 'items2Id': newData };
    },
    recipes: function (data, allData) {
        let items2Id = allData.items2Id;
        let types = {};
        let tasks = {};
        for (var i in data) {
            let one = data[i];
            let oneType = types[one.type];

            if (!oneType) oneType = types[one.type] = [];
            oneType.push(i);

            one.output = parseInt(items2Id[one.enName]);
            if (one.recipe) {
                let recipe = one.recipe.split('+');
                let r = [];
                for (let i = 0; i < recipe.length; i++) {
                    let one = recipe[i].split('*');
                    if (!items2Id[one[0]]) console.log(one[0]);
                    r.push(items2Id[one[0]] + '_' + one[1]);
                }
                one.recipe = r.join('&');
            }

            if (one.time) {
                let time = one.time.split('.');
                let t = [0, 0, 0, 0]
                for (let i = 0; i < time.length - 1; i++) {
                    let tt = time[i];
                    if (tt.indexOf('d') > 0) t[0] = tt.replace('d', '');
                    if (tt.indexOf('h') > 0) t[1] = tt.replace('h', '');
                    if (tt.indexOf('min') > 0) t[2] = tt.replace('min', '');
                    if (tt.indexOf('sec') > 0) t[3] = tt.replace('sec', '');
                }
                one.time = t[0] * 86400 + t[1] * 3600 + t[2] * 60 + t[3] * 1;
            }

            if (one.type < 7) {
                let from = one.recipe.split('&')[0].split('_')[0];
                tasks[from] = one.output;
            }
        }

        return { 'recipes': data, 'recipesTypes': types, 'recipesTasks': tasks };
    },
    axes: function (data, allData) {
        let items2Id = allData.items2Id;
        let newData = {};
        for (var i in data) {
            let one = data[i];
            if (!newData[one.type]) newData[one.type] = {};
            newData[one.type][i] = one;
            if (one.craft) {
                let craft = one.craft.split('+');
                let r = [];
                for (let i = 0; i < craft.length; i++) {
                    let one = craft[i].split('*');
                    if (!items2Id[one[0]]) console.log(one[0]);
                    r.push(items2Id[one[0]] + '_' + one[1]);
                }
                one.craft = r.join('&');
            }
            if (one.purchase) one.purchase = parseInt(one.purchase);
            if (one.ad) one.ad = parseInt(one.ad);
            if (one.type) one.type = parseInt(one.type);
            if (one.openTier) one.openTier = parseInt(one.openTier);
            if (one.damage) one.damage = parseInt(one.damage);
            if (one.stengthNeeded) one.stengthNeeded = parseInt(one.stengthNeeded);
            if (one.coinsNeeded) one.coinsNeeded = parseInt(one.coinsNeeded);
        }

        return { 'axes': newData };
    },
    mines: function (data) {
        let newData = {};
        for (let i in data) {
            let one = [];
            let d = data[i];
            for (let j in d) one.push(d[j]);
            newData[i] = one;
        }

        // // check
        // for (let i in newData) {
        //     let one = newData[i];
        //     let min = one[0];
        //     for (let j = 1; j < one.length; j++) {
        //         if (min >= one[j]) throw 'err:' + i + ',' + min;
        //         min = one[j];
        //     }
        // }
        return { 'mines': newData };
    },
    attrs: function (data, allData) {
        let items2Id = allData.items2Id;
        let newData = {};

        for (let i in data) {
            let d = data[i];
            if (!newData[d.type]) newData[d.type] = [];
            let one = newData[d.type];
            let spend;
            if (!d.spend) {
                spend = undefined;
            } else if (isNaN(d.spend)) {
                let s = d.spend.split('*');
                if (!items2Id[s[0]]) console.log(s[0]);
                spend = items2Id[s[0]] + '_' + s[1];
            } else spend = '1_' + d.spend;

            one.push({
                lv: d.lv,
                spend: spend,
                // next: d.next,
                val: d.val
            })

        }
        return { 'attrs': newData };
    },
    skills: function (data, allData) {
        let items2Id = allData.items2Id;
        let newData = {};

        for (let i in data) {
            let d = data[i];
            if (!newData[d.type]) newData[d.type] = [];
            let one = newData[d.type];
            let spend;
            if (!d.spend) {
                spend = undefined;
            } else if (isNaN(d.spend)) {
                let s = d.spend.split('*');
                if (!isNaN(s[0])) { // 关卡
                    spend = 's' + s[0] + '_' + s[1];
                } else {
                    if (!items2Id[s[0]]) console.log(s[0]);
                    spend = items2Id[s[0]] + '_' + s[1];
                }
            } else spend = '1_' + d.spend;

            one.push({
                lv: d.lv,
                spend: spend,
                damage: d.damage,
                cd: d.cd,
                fire: d.fire,
                duration: d.duration
            })

        }
        return { 'skills': newData };
    },
    tasks: function (data) {
        let newData = [];
        let map = {};
        let rate = 0;
        for (let i in data) {
            let d = data[i];

            rate += d.rate;
            newData.push({
                id: d.theId,
                rate: rate,
                title: d.title,
                text: d.text,
                num: d.num,
                reward: d.reward,
            });
            map[d.name] = d.theId;
        }
        return { 'tasks': newData, 'tasksMap': map };
    },
};

module.exports.process = function (fileName, data, allData) {
    let name = fileName.replace('.xlsx', '');
    name = name.split('_')[0];
    let func = processFuncs[name];
    if (typeof func == 'function') {
        return func(data, allData);
    } else {
        return processFuncs.defaultFunc(name, data);
    }
};