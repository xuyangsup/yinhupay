<template>
    <div class="dingdankaidan" v-if="order">
        <div class="dingdankaidan-title">
            <h3>订单收银</h3>
        </div>
        <div class="yuyue-container">
            <div>
                <span>(品牌)门店</span>
                <span>({{order.brand.name}}){{order.shop.name}}</span>
                <!--<el-select v-model="brandId" placeholder="选择品牌" class="handle-select mr10">-->
                    <!--<el-option-->
                        <!--v-for="item in brandList"-->
                        <!--:key="item.id"-->
                        <!--:label="item.name"-->
                        <!--:value="item.id">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </div>
            <ul>
                <!--<li :class="{active : shopId === item.id}"-->
                    <!--v-for="(item,index) in shopList"-->
                    <!--:key="index" @click="clickStore(item.id)">-->
                    <!--<el-button size="mini" plain>{{item.name}}</el-button>-->
                <!--</li>-->
            </ul>
            <div>
                <!-- 用户信息 -->
                <el-row type="flex">
                    <el-col :span="6">
                        <span>预约人:</span>
                        <span>{{order.user.name}}</span>
                    </el-col>
                    <el-col :span="3">
                        <span>{{order.user.sex == 'F' ? '女' : '男'}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span>联系电话:</span>
                        <span>{{order.user.mobile}}</span>
                    </el-col>
                </el-row>
                <!-- 日期与时间 -->
                <el-row type="flex" style="margin-top: 20px;">
                    <el-col :span="6">
                        <span style="margin-right: 10px;">预约时间</span>
                        <span>{{order.orderTime}}</span>
                    </el-col>
                    <!--<el-col :span="6">-->
                        <!--<span style="margin-right: 10px;">到店时间</span>-->
                        <!--<span>11:00</span>-->
                    <!--</el-col>-->
                </el-row>
                <!-- 预约人数、订单来源、客户来源 -->
                <el-row type="flex" style="margin-top: 20px;">
                    <el-col :span="6">
                        <span style="margin-right: 10px;">预约人数</span>
                        <span>{{order.orderNum}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span style="margin-right: 10px;">订单来源</span>
                        <span>{{order.source ? order.source.name : ''}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span style="margin-right: 10px;">客户来源</span>
                        <span>{{order.user.source ? order.user.source.name : ''}}</span>
                    </el-col>
                </el-row>
            </div>
            <!-- 客次信息 -->
            <div>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="fontSize: 20px;">客次信息</span>
                        <el-button style="float: right" type="warning" @click="clickAddProduct" v-if="false">+ 服务项目</el-button>
                    </div>
                    <div class="orderInfo" v-for="(guest, index) in order.guestList">
                        <div class="guestInfo">
                            <i class="el-icon-remove-outline" @click="removeGuest(guest, index)" v-if="false"></i>
                            <span>{{guest.name}}</span>
                            <el-button type="info" size="mini" v-for="item in guest.roomList" :key="item.id">{{item.name}}</el-button>
                            <el-button type="warning" size="mini" @click="addGuestProduct(guest)" v-if="false">+ 项目</el-button>
                            <el-button type="warning" size="mini" @click="addGuestRoom(guest)" v-if="false">+ 房间</el-button>
                        </div>
                        <div class="productInfo" v-for="product in guest.productList">
                            <i class="el-icon-remove-outline" @click="removeProduct(product, guest)" v-if="false"></i>
                            <span>{{product.productName}} <i>￥{{product.productPrice}}</i></span>
                            <el-button type="success" size="mini" @click="clickAddMech(product)" v-if="false">+ 技师</el-button>
                            <el-button type="primary" size="mini" @click="clickAddHelp(product)" v-if="false">+ 帮钟</el-button>

                            <div class="mechInfo" v-for="mech in product.mechList">
                                <i class="el-icon-remove-outline" @click="removeMech(mech, product)" v-if="false"></i>
                                <span>{{mech.name}}({{mech.mechNo}})</span>
                                <el-select style="width:20%;margin-left:10px;" v-model="mech.clockType" placeholder="选择排钟" class="handle-select mr10">
                                    <el-option
                                        disabled
                                        v-for="item in clockTypeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <span style="margin-left: 15px">业绩：{{mech.sale}}元</span>
                                <span style="margin-left: 15px">提成：{{mech.money}}元</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>

            <!-- 收银信息 -->
            <div>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="fontSize: 20px;">收银信息</span>
                        <el-button style="float: right" type="warning" @click="clickAddCash">+ 添加收银</el-button>
                    </div>
                    <!-- <ul class="payStyle">
                        <li v-for="(item, index) in orderPay" :key="index">
                            <span class="active">{{item.name}}</span>
                            <span>{{item.price}}</span>
                        </li>
                    </ul> -->

                    <el-tag
                        class="tag"
                        size="medium"
                        v-for="(item, index) in orderPayed"
                        :key="item.name"
                        :type="item.type"
                        >
                        {{item.name}}
                        <span>{{item.price}}</span>
                    </el-tag>

                    <el-tag
                    class="tag"
                    size="medium"
                    v-for="(item, index) in orderPay"
                    :key="item.name"
                    closable
                    :type="item.type"
                    @close="handleClose(item)">
                    {{item.name}}
                    <span>{{item.price}}</span>
                    </el-tag>
                </el-card>
            </div>


            <!-- 备注信息 -->
            <div>
                <h4>备注信息</h4>
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="如需备注，请输入"
                    v-model="remarkTxt">
                </el-input>
            </div>
            <!-- 总计-提交订单 -->
            <div>
                <el-button type="warning" circle><span>总计</span><br><i>{{totalFee}}元</i></el-button>
                <el-button type="danger" size="big" @click="cashOrder">提交订单</el-button>
            </div>
        </div>

        <!-- 弹出框-收银方式 -->
        <el-dialog title="收银方式" :visible.sync="dialogCashVisible">
            <ul class="payStyle">
                <li v-for="(item, index) in payTypeList" :key="index">
                    <span :class="{active : item.status}" @click="item.status = !item.status">{{item.name}}</span>
                    <el-input
                        style="margin-left: 10px"
                        placeholder="请输入内容"
                        v-model="item.price"
                        :disabled="!item.status">
                    </el-input>
                </li>
            </ul>

            <span slot="footer" class="dialog-footer" style="color: #f63;fontSize: 20px;text-align:left">
                    <span>总计：¥{{totalFee}} </span>
                    <el-button class="ml20" type="warning" @click="sureCash">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import brandApi from '@/api/brand'
    import utils from '@/common/utils'
    import shopApi from '@/api/shop'
    import appointApi from '@/api/appoint'
    import moment from 'moment'
    import show from '@/common/show'
    import orderApi from '@/api/order/order'
    import dialog from '@/common/dialog'

    export default {
        data() {
            return {
                order: null,
                brandId: null,
                brandList: [],
                shopId: null,
                shopList: [],
                channelList: [],
                productList: [],
                mechList: [], //门店技师
                guestList: [{
                    productList: [],
                    roomList: []
                }],
                user: {
                    name: '',
                    sex: 'M',
                },
                selGuest: null,
                selProduct: null,
                sourceList: [], //来源
                clockTypeList: [
                    {
                        value: 1,
                        label: '轮排'
                    },
                    {
                        value: 2,
                        label: '点钟'
                    },
                    {
                        value: 3,
                        label: '帮鈡'
                    },
                    {
                        value: 4,
                        label: '加钟'
                    }
                ],
                minusGuestFlag: false,
                roomList: [],
                select_brand: '考拉时光1', // 默认选择品牌
                userPhone: '', // 输入框用户手机
                pickerOptions1: { // 禁用时间
                    disabledDate(time) {
                        return time.getTime() + 1 * 24 * 60 * 60 * 1000 < Date.now()
                    }
                },
                arrivalStoreDate: moment().format('YYYY-MM-DD'), // 到店日期
                arrivalStoreTime: '', // 到店时间
                arrivalStoreTimeObj: { // 到店可预约时间段
                    start: '11:00', step: '00:15', end: '23:00'
                },
                orderNum: 1, // 预约人数
                select_order_from: '大众点评', // 选择订单来源
                select_user_from: '大众点评', // 选择客户来源
                remarkTxt: '', // 备注信息
                dialogItemVisible: false, // 弹出框-服务项目
                itemDataFromAcIdx: null, // 弹出框-服务项目来源-默认下标
                dialogMechVisible: false, // 弹出框-技师
                mechData: [{name: '娟娟1', star: 4, isSelect: false}, {
                    name: '娟娟2',
                    star: 3,
                    isSelect: false
                }, {name: '娟娟3', star: 2, isSelect: false}, {name: '娟娟4', star: 1, isSelect: false},],
                dialogRoomVisible: false, // 弹出框-房间
                roomData: [{name: '宜丰房3床位', occupied: 2, unoccupied: 1, isSelect: false}, {
                    name: '宜丰房3床位',
                    occupied: 2,
                    unoccupied: 1,
                    isSelect: false
                }, {name: '宜丰房3床位', occupied: 2, unoccupied: 1, isSelect: false}, {
                    name: '宜丰房3床位',
                    occupied: 2,
                    unoccupied: 1,
                    isSelect: false
                },],
                dialogClockVisible: false, // 弹出框-帮钟
                dialog_select_brand: '考拉时光1', // 弹出框-帮钟-选择品牌
                dialog_brandList: [{
                    value: '考拉时光1', label: '考拉时光1'
                }, {
                    value: '考拉时光2', label: '考拉时光2'
                }],
                dialog_select_store: '天山店1',  // 弹出框-帮钟-选择门店
                dialogClockSearch: '', // 弹出框-帮钟-查询
                dialog_clock_mechList: [{ // 弹出框-帮钟-技师列表
                    name: '曹娟娟1', id: '12245131', store: '虹桥大厦店'
                }, {
                    name: '曹娟娟2', id: '12245131', store: '虹桥大厦店'
                }, {
                    name: '曹娟娟3', id: '12245131', store: '虹桥大厦店'
                }],
                multipleSelection: [],
                orderCashList: [ // 收银订单
                    {id: 1},
                    {id: 2}
                ],
                checkedOrders: [], // 订单收银选择订单数组

                dialogCashVisible: false, // 收银弹出框

                orderPay: [],

                orderPayed: [],

                payTypeList: [],
            }
        },
        mounted() {
            this.init()
        },
        computed: {
            totalFee() {
                var totalFee = 0
                this.order.guestList.forEach(guest => {
                    guest.productList.forEach(product => {
                        totalFee += product.productPrice
                    })
                })
                return totalFee
            }
        },
        watch: {
            brandId(newVal, oldVal) {
                this.queryShopByBrand(newVal)
            },
            shopId(newVal, oldVal) {
                //切换门店,项目重置
                this.guestList.forEach(guest => {
                    guest.productList = []
                    guest.roomList = []
                })
            },
            orderNum(newVal, oldVal) {
                console.log(this.minusGuestFlag)
                if (this.minusGuestFlag) {
                    this.minusGuestFlag = false
                    return
                }
                if (newVal > oldVal) {
                    console.log("+1")
                    this.guestList.push({
                        productList: [],
                        roomList: []
                    })
                    //加1操作
                } else {
                    //减1操作
                    console.log("-1")
                    const length = this.guestList.length
                    this.guestList.pop()
                }
            },
            itemDataFromAcIdx(newVal, oldVal) {
                const _this = this
                this.channelList.forEach((item) => {
                    if (item.id === newVal) {
                        _this.productList = item.shopProducts
                    }
                })
            }
        },
        methods: {
            init() {
                let self = this

                orderApi.queryOrderDetail(this.$route.query.orderId, (data) => {

                    data.orderTime = moment(data.bookTime).format('YYYY-MM-DD HH:mm')
                    self.order = data

                    //支付信息
                    let payList = []
                    data.orderPayList.forEach(item => {

                        payList.push({
                            name: item.payTypeName,
                            price: item.payAmount
                        })
                    })

                    self.orderPayed = payList
                })
            },
            searchByMobile(queryString, cb) {
                const _this = this
                appointApi.searchMobile(queryString, (data) => {

                    data.forEach((item) => {
                        item.value = item.mobile
                    })

                    if (data && data.length > 0) {
                        _this.user = data[0]
                    }
                    cb(data)
                })
            },
            handleSelectMobile(item) {
                const _this = this
                _this.user = item
                console.log(item);
            },
            //查询品牌
            queryBrand() {
                const self = this
                brandApi.queryByEmp((data) => {
                    self.brandList = data
                    if (data && data.length > 0) {
                        self.brandId = data[0].id
                    }
                })
            },
            queryShopByBrand: function(brandId) {
                const self = this
                shopApi.queryByBrand(brandId, function (data) {
                    self.shopList = data
                    if (data && data.length) {
                        self.shopId = data[0].id
                    } else {
                        self.shopId = null
                    }
                })
            },
            clickStore(shopId) {
                this.shopId = shopId
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }, xuyang() {
                console.info(this.multipleSelection)
            },
            success() {
                this.$message({
                    message: '恭喜你，这是一条成功消息', type: 'success'
                })
            },
            error() {
                this.$message({
                    message: '警告哦，这是一条警告消息', type: 'warning'
                })
            },
            clickAddProduct() {
                this.selGuest = null
                this.fetchShopProduct()
            },
            fetchShopProduct() {
                const _this = this
                _this.dialogItemVisible = true
                appointApi.products(this.shopId, (data) => {
                    data.forEach(item => {
                        item.shopProducts.forEach(product => {
                            product.num = 0
                        })
                    })

                    _this.channelList = data
                    if (data && data.length > 0) {
                        _this.productList = data[0].shopProducts
                    }
                })
            },
            fetchShopRoom() {
                const _this = this
                appointApi.fetchRooms(this.shopId, (data) => {
                    data.forEach(item => {
                        var flag = false
                        _this.selGuest.roomList.forEach(room => {
                            if (item.id == room.id) {
                                flag = true
                            }
                        })
                        item.isSelect = flag
                    })
                    _this.roomList = data
                })
            },
            clickAddMech(product) {
                this.dialogMechVisible = true
                const _this = this
                _this.selProduct = product
                appointApi.fetchMech(this.shopId, (data) => {
                    data.forEach((item) => item.isSelect = false)
                    _this.mechList = data
                })
            },
            clickAddHelp() {
                this.dialogClockVisible = true
            },
            removeGuest(guest, index) {
                if (index == 0) {
                    show.error('至少需要一个客次')
                    return
                }
                this.minusGuestFlag = true
                this.guestList.splice(this.guestList.findIndex(v => v == guest), 1)
                this.orderNum--
            },
            removeProduct(product, guest) {
                guest.productList.splice(guest.productList.findIndex(v => v.id === product.id), 1)
            },
            addProduct() {
                const _this = this
                if (this.selGuest) {
                    this.productList.forEach(product => {
                        if (product.num > 0) {
                            var num = product.num
                            product.mechList = []
                            while(num--){
                                _this.selGuest.productList.push(utils.deepCopy(product))
                            }
                        }
                    })
                } else {
                    this.productList.forEach(product => {
                        if (product.num > 0) {
                            var num = product.num
                            product.mechList = []
                            while(num--){
                                _this.guestList.forEach(guest => {
                                    guest.productList.push(utils.deepCopy(product))
                                })
                            }
                        }
                    })
                }
                this.dialogItemVisible = false
            },
            addGuestProduct(guest) {
                this.selGuest = guest
                this.fetchShopProduct()
            },
            addGuestRoom(guest) {
                this.dialogRoomVisible = true
                this.selGuest = guest
                this.fetchShopRoom()
            },
            chooseShopMech(mech) {
                mech.isSelect = !mech.isSelect
            },
            clickSureShopMech() {
                const _this = this
                if (_this.selProduct) {
                    const list = []
                    _this.mechList.forEach(mech => {
                        if (mech.isSelect) {
                            mech.clockType = 1
                            list.push(mech)
                        }
                    })
                    _this.selProduct.mechList = list
                }
                console.log(this.selProduct)
                this.dialogMechVisible = false
            },
            removeMech(mech, product) {
                product.mechList.splice(product.mechList.findIndex(item => item.id === mech.id), 1)
            },
            clickSureShopRoom() {
                const _this = this
                if (_this.selGuest) {
                    const list = []
                    _this.roomList.forEach(item => {
                        if (item.isSelect) {
                            list.push(item)
                        }
                    })
                    _this.selGuest.roomList = list
                }
                _this.dialogRoomVisible = false
            },
            clickAddCash() {
                this.dialogCashVisible = true
                let self = this
                orderApi.getPayTypeList((data) => {
                    let list = []
                    data.forEach(item => {
                        item.status = false
                        item.price = null
                        list.push(item)
                    })
                    self.payTypeList = list
                })
            },

            sureCash() {
                this.dialogCashVisible = false

                let self = this
                this.payTypeList.forEach(pay => {
                    if (pay.status && pay.price > 0) {
                        self.orderPay.push(utils.deepCopy(pay))
                    }
                })
            },
            handleClose(item) {
                console.info(item)
                let self = this

                let index = self.orderPay.indexOf(item)

                if (index > -1) {
                    self.orderPay.splice(index, 1)
                }

            },
            cashOrder() {
                let self = this

                let orderPayList = []
                self.orderPay.forEach(item => {
                    orderPayList.push({
                        payAmount: item.price,
                        payTypeId: item.id
                    })
                })
                self.order.orderPayList = orderPayList
                dialog.confirm(() => {
                    orderApi.cashOrder(self.order, (data) => {
                        show.success('订单收银成功')
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .dingdankaidan{
        .dingdankaidan-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
        .yuyue-container{
            padding: 10px 0 0 20px;
            >div:nth-of-type(1){
                // margin-left: 40px;
                span{
                    margin-right: 10px;
                }
            }
            >ul{
                padding-left: 40px;
                overflow: hidden;
                li{
                    margin-top: 10px;
                    margin-right: 10px;
                    float: left;
                }
                li.active button{
                    border: 1px solid #409EFF;
                }
            }
            >div:nth-of-type(2){
                margin-top: 20px;
            }
            >div:nth-of-type(3){
                margin-top: 30px;
                .orderInfo{
                    padding-top: 20px;

                    .guestInfo{
                        margin-top: 10px;
                        >i{
                            padding: 5px;
                            cursor: pointer;
                        }
                        button{
                            margin-left: 10px;
                        }
                    }
                    .productInfo{
                        margin-top: 10px;
                        >i{
                            padding: 5px;
                            cursor: pointer;
                        }
                        button{
                            margin-left: 10px;
                        }
                        margin-left: 30px;

                        .mechInfo{
                            margin-top: 10px;
                            >i{
                                padding: 5px;
                                cursor: pointer;
                            }
                            button{
                                margin-left: 10px;
                            }
                            margin-left: 30px;
                        }
                    }
                }
            }
            div:nth-of-type(4){
                margin-top: 20px;
            }
            >div:nth-of-type(5){
                margin-top: 10px;
                h4{
                    font-size: 20px;
                    padding: 10px 0;
                }
            }
            >div:nth-of-type(6){
                margin-top: 15px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span{
                    font-size: 18px;
                    i{
                        font-size: 20px;
                    }
                }
            }
        }
        // 服务项目-dialog
        .itemDataFrom{
            padding-top: 20px;
            border: 1px solid #f2f2f2;
            text-align: center;
            li{
                margin: 5px 0;
                button{
                    color: #555;
                    font-size: 14px;
                }
            }
            li.active{
                button{
                    color: #f63;
                }
            }
        }
        // 技师-dialog
        .item-card{
            height: 204px;
            overflow-y: auto;
        }
        .item-info{
            li{
                float: left;
                border: 2px solid #f2f2f2;
                margin: 0 10px 10px 0;
                width: 130px;
                text-align: center;
                img{
                    width: 100%;
                }
            }
            li.active{
                border: 2px solid #f63;
            }
        }
        // 帮钟-dialog
        .flex-layout{
            display: flex;
            align-items: center;
            span{
                flex: 2;
                margin: 0 4px 0 5px;
            }
            .flex-8{
                flex: 8;
                margin-right: 5px;
            }
        }
        .dialog_clock_mechList{
            margin-top: 20px;
            border: 1px solid #f2f2f2;
            .el-pagination{
                padding: 15px 0;
                text-align: center;
            }
        }
        .payStyle{
            overflow: hidden;
            li{
                float: left;
                display: flex;
                margin: 10px 20px 0 0;
                span{
                    min-width: 80px;
                    line-height: 32px;
                    text-align: center;
                    border: 1px solid #e4e7ed;
                    cursor: pointer;
                    color: #999;
                }
                span.active{
                    color: #ff6633;
                    border: 1px solid #ff6633;
                }
            }
        }
    }
    .tag{
        margin-right: 20px;
    }
</style>
