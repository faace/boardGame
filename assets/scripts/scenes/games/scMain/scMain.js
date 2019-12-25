cc.Class({
    extends: ge.Component,

    properties: {
        scrollView: cc.ScrollView,
        content: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onInit() {
        this.list = ge.listView({
            scrollview: this.scrollView,
            content: this.content,
            itemTpl: cc.instantiate(ge.pfItem),
            gapY: 10,
            gapX: 14,
            col: Math.floor(this.scrollView.node.width / (180 + 14)),
        });

        let items = [
            {
                txt: '30\nRails',
                game: 'ly30Rails',
                delCb: this.delItem.bind(this)
            },
            {
                txt: '30\nRails XL',
                game: 'ly30RailsXl',
                delCb: this.delItem.bind(this)
            },
            {
                txt: 'Avenue',
                game: 'lyAvenue',
                delCb: this.delItem.bind(this)
            }
        ];

        this.list.setItems(items, true);



        // ge.openLayer('ly30RailsXl');
    },
    delItem(targetJs) {
        this.list.delItems(targetJs.node);
    },
    // initInside() {
    //     ge.addClick(this.insideBag, () => {
    //         ge.openLayer('lyBag');
    //     });

    // },
});
