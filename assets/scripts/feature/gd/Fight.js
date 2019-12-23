
var Fight = class {

    tier = 0; // 第几层
    sub = 0; // 第几个槽
    door = 0; // 第几小关
    isHard = 0; // 是否开启困难模式

    power = 0; // 能量
    heart = 10; // 心

    maxHp = 1000;
    hp = 1000; // 敌人的血量


    state = 0; // 0未开始，1开始，2暂停
    isVertical = false; // 是否垂直
    isForward = 1; // 1：向前，2：向后
    speed = 0; // 开始速度
    maxSpeed = 400; //  // 400~1000
    acc = 400 * 4; // 加速度

    skill = {
        fire: {
            power: 10,
            cd: 5,
            action: {


            }
        },
        freeze: {
            power: 30,
            cd: 10,
        },
        acid: {
            power: 30,
            cd: 20,
        }
    };

    constructor(parm) {
        // this.init(parm);
    }
    init(parm) {

        // door: 0,
        // isHard: gu.userInfo.tiers,
        // power: 0,
        // heart: 10,
        // hp: 100000,

        // state: 0,

        this.tierInfo = gu.userInfo.tiers.list[parm.tier][parm.sub];
        this.tier = parm.tier;
        this.sub = parm.sub;
        this.door = 0;
        this.maxDoor = 10;
        this.isHard = parm.isHard;
        this.state = 0;
        this.heart = 10;
        this.power = 0;

        this.xlsMines = ge.xls.mines[this.tier * 6 + this.sub + 1];

        // 到时根据级别来赋值
        this.speed = 0;
        this.maxSpeed = 400 + this.tier * 2 + this.sub;
        this.acc = this.maxSpeed * 4;

        this.blockNum = 8; // 最多多少个点
        this.hp = this.maxHp = this.xlsMines[this.door] || 0;
        this.isVertical = !this.isVertical;

        this.reward = this.getReward();

        let choose = gu.userInfo.axes.choose;
        let xlsAxe = ge.xls.axes[1][choose] || ge.xls.axes[2][choose];
        this.damage = xlsAxe.damage;
        ge.log('还需要加上属性增加的伤害，和镐自己可能增加的伤害')
    }

    getFightBlockType() { // 决定功能，以及颜色
        let r0 = 100, r1 = 10, r2 = 10;// 到时根据级别是赋值
        let r = Math.floor(Math.random() * (r0 + r1 + r2));
        if (r < r0) return 0;
        if (r < r0 + r1) return 1;
        return 2;
    }

    getFightBlockSize() { // 决定大小
        let r0 = 100, r1 = 5, r2 = 1;// 到时根据级别是赋值

        let r = Math.floor(Math.random() * (r0 + r1 + r2));
        if (r < r0) return 0;
        if (r < r0 + r1) return 1;
        return 2;
    }

    addPower(num) {
        this.power += num;
        if (this.power < 1) this.power = 0;
        else if (this.power > 100) this.power = 100;
        return this.power;
    }
    addHeart(num) {
        this.heart += num;
        if (this.heart < 1) this.heart = 0;
        else if (this.heart > 10) this.heart = 10;
        return this.heart;
    }
    isDead() {
        return this.heart < 1;
    }

    getDamage(isEmpty) { // 获取某次击中的伤害值
        if (isEmpty) return {
            isCrit: false,
            damage: Math.max(1, Math.floor(this.damage * 0.5))
        };
        ge.log('还需要判断是否暴击');
        return {
            isCrit: false,
            damage: this.damage
        }
    }
    addHp(num) {
        this.hp += num;
        if (this.hp < 1) this.hp = 0;
        else if (this.hp > this.maxHp) this.hp = this.maxHp;
        return this.hp;
    }
    isWin() {
        return this.hp < 1;
    }
    nextDoor() {
        this.door++;
        if (this.door < this.maxDoor) {
            this.blockNum = 8; // 最多多少个点
            this.hp = this.maxHp = this.xlsMines[this.door] || 0;
            this.isVertical = !this.isVertical;
            this.reward = this.getReward();
        }
    }
    getReward(IsOnly) { // 获取本关的奖励
        let reward = {};
        let idx = 0;
        let info = gd.tiers.getInfo(this.tier, this.sub);
        let percent = info.percent;
        let i = Math.floor(Math.random() * (percent[0] + percent[1] + percent[2]));
        ge.log('奖品概率' + i);
        if (i < percent[0]) idx = 0;
        else {
            i -= percent[0];
            if (i < percent[1]) idx = 1;
            else idx = 2;
        }
        if (IsOnly) return info.ore[idx];
        reward[info.ore[idx]] = 1;
        // 看看镐有没有其他的资源收入
        ge.log('看看镐有没有其他的资源收入');

        // 根据幸运值看看是否加倍
        ge.log('根据幸运值看看是否加倍');

        return reward;
    }
    getChest() { // 随机看看有没有宝箱
        // return {
        //     type: 2,
        //     subType: 1, // 对应的宝箱的类型

        // }
        if (Math.random() < 0.8) return; // 没有宝箱
        let chest = {
            type: (Math.random() < 0.5) ? 0 : 1 // 1:直接打开的宝箱，2需要解锁的宝箱
        };
        if (chest.type == 1) chest.subType = Math.ceil(Math.random() * 4); // 四种宝箱：1橙2红3绿4蓝
        else chest.subType = Math.ceil(Math.random() * 2); // 两种宝箱，1小2大
        return chest;

    }
};

module.exports = Fight;