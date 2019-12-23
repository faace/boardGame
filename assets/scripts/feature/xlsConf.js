module.exports = {
    getList: function () {
        return [
            // ======= -Name-List-Begin-
           'items','items2Id','id2Attr','id2Name','skills','attrs','mines','recipes','recipesTypes','recipesTasks','axes','tasks','tasksMap','tiers'
            // ======= -Name-List-End-
        ]
    },
    init: function (xlsConfigs) {
        xlsConfigs.parse1 = function (txt) {
            let rc = [];
            if (txt) {
                let list = txt.split('&');
                // 1_2000&4_300 =>[[1, 2000],[4,3000]]
                for (let i = 0; i < list.length; i++) {
                    rc.push(list[i].split('_'));
                    rc[i][1] = parseInt(rc[i][1]);
                }
            }
            return rc;
        };
        xlsConfigs.parse2 = function (txt) {
            let rc = {};
            if (txt) {
                let list = txt.split('&');
                // 1_2000&4_300 =>{1: 2000,4: 3000}
                for (let i = 0; i < list.length; i++) {
                    let one = list[i].split('_');
                    rc[one[0]] = parseInt(one[1]);
                }
            }
            return rc;
        };
    }
};