<template>
    <div class="dingdankaidan" v-if="order">
        <div class="dingdankaidan-title">
            <h3>订单改单</h3>
        </div>
        <div class="yuyue-container">
            <div>
                <span>品牌</span>
                <span>{{order.brand.name}}</span>
            </div>
            <ul>
                <div>
                    <span>门店</span>
                    <span>{{order.shop.name}}</span>
                </div>
            </ul>
            <div>
                <!-- 用户信息 -->
                <el-row type="flex">
                    <el-col :span="6">
                        <span>预约人:</span>
                        <span>{{order.user.name}}</span>
                    </el-col>
                    <el-col :span="3">
                        <span>性别: </span>
                        <span>{{order.user.sex == 'M' ? '男' : '女'}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span>联系电话:</span>
                        <span>{{order.user.mobile}}</span>
                    </el-col>
                </el-row>
                <!-- 日期与时间 -->
                <el-row type="flex" style="margin-top: 20px;">
                    <el-col :span="6">
                        <span style="margin-right: 10px;">到店日期:</span>
                        <el-date-picker
                        v-model="arrivalStoreDate"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions1">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="6">
                        <span style="margin-right: 10px;">到店时间:</span>
                        <el-time-select
                        v-model="arrivalStoreTime"
                        :picker-options="arrivalStoreTimeObj"
                        placeholder="选择时间">
                        </el-time-select>
                    </el-col>
                </el-row>
                <!-- 预约人数、订单来源、客户来源 -->
                <el-row type="flex" style="margin-top: 20px;">
                    <el-col :span="6">
                        <span style="margin-right: 10px;">预约人数</span>
                        <span>{{order.orderNum}}</span>
                        <!--<el-input-number v-model="order.orderNum"  :min="1" :max="10" label="预约人数"></el-input-number>-->
                    </el-col>
                    <el-col :span="6">
                        <span style="margin-right: 10px;">订单来源</span>
                        <span>{{order.source ? order.source.name : '无'}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span style="margin-right: 10px;">客户来源</span>
                        <span>{{order.user.source ? order.user.source.name : '无'}}</span>
                    </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 20px;">
                    <el-col>
                        <span>用户备注: {{order.userRemark}}</span>
                    </el-col>
                </el-row>    
            </div>
            <!-- 客次信息 -->
            <div>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="fontSize: 20px;">客次信息</span>
                        <el-button style="float: right" type="warning" @click="clickAddProduct">+ 服务项目</el-button>
                    </div>
                    <div class="orderInfo" v-for="(guest, index) in order.guestList" :key="guest.id">
                        <div class="guestInfo">
                            <i class="el-icon-remove-outline" @click="removeGuest(guest, index)"></i>
                            <span>预约人{{index + 1}}</span>
                            <el-button type="info" size="mini" v-for="item in guest.roomList" :key="item.id">{{item.name}}</el-button>
                            <el-button type="warning" size="mini" @click="addGuestProduct(guest)">+ 项目</el-button>
                            <el-button type="warning" size="mini" @click="addGuestRoom(guest)">+ 房间</el-button>
                        </div>
                        <div class="productInfo" v-for="product in guest.productList" :key="product.id">
                            <i class="el-icon-remove-outline" @click="removeProduct(product, guest)"></i>
                            <span>{{product.productName}} <i>￥{{product.productPrice}}</i></span>
                            <el-button type="success" size="mini" @click="clickAddMech(product)">+ 技师</el-button>
                            <el-button type="primary" size="mini" @click="clickAddHelp(product)">+ 帮钟</el-button>

                            <div class="mechInfo" v-for="mech in product.mechList" :key="mech.id">
                                <i class="el-icon-remove-outline" @click="removeMech(mech, product)"></i>
                                <span>{{mech.name}}({{mech.mechNo}})</span>
                                <el-select style="width:10%;margin-left:10px;" v-model="mech.clockType" @change="changeClockType(mech, product)" placeholder="选择排钟" class="handle-select mr10">
                                    <el-option
                                        v-for="item in clockTypeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <span style="margin-left: 15px">业绩：<el-input style="width: 8%;margin-right: 10px" v-model="mech.sale" ></el-input>元</span>
                                <span style="margin-left: 15px">提成：<el-input style="width: 8%;margin-right: 10px" v-model="mech.money"></el-input>元</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
            <!-- 备注信息 -->
            <div>
                <h4>备注信息</h4>
                <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="如需备注，请输入"
                v-model="order.remark">
                </el-input>
            </div>
            <!-- 总计-提交订单 -->
            <div>
                <el-button type="warning" circle><span>总计</span><br><i>{{totalFee}}元</i></el-button>
                <el-button type="danger" size="big" @click="saveAppoint">提交订单</el-button>
            </div>
        </div>
        <!-- 弹出框-服务项目 -->
        <el-dialog title="服务项目" :visible.sync="dialogItemVisible">
            <el-row :gutter="20">
                <el-col :span="4">
                    <ul class="itemDataFrom">
                        <li :class="{active : itemDataFromAcIdx === item.id}" @click="itemDataFromAcIdx = item.id" v-for="(item, index) in channelList" :key="item.id">
                            <el-button type="text">{{item.name}}</el-button>
                        </li>
                    </ul>
                </el-col>
                <el-col :span="20">
                    <el-table :data="productList">
                        <el-table-column
                        label="项目ID"
                        width="80">
                            <template slot-scope="scope">
                                <span>{{ scope.row.id }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="项目名称"
                        width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="时长"
                        width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.duration }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="价格"
                        width="80">
                            <template slot-scope="scope">
                                <span class="f63">￥{{ scope.row.sellPrice }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        label="数量"
                        width="200">
                            <template slot-scope="scope">
                                <el-input-number size="mini" v-model="scope.row.num" :min="0" :max="10"></el-input-number>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogItemVisible = false">取 消</el-button>
                <el-button type="warning" @click="addProduct">确定</el-button>
            </span>
        </el-dialog>
        <!-- 弹出框-技师 -->
        <el-dialog title="技师" :visible.sync="dialogMechVisible">
            <el-card class="item-card" shadow="hover">
                <ul class="item-info">
                    <li :class="{active : mech.isSelect}"
                    @click="chooseShopMech(mech)"
                    v-for="(mech, index) in mechList"
                    :key="index">
                        <img src="../../../assets/mech.png" alt="">
                        <div>
                            <span>{{mech.name}}({{mech.mechNo}})</span>
                            <el-rate
                            v-model="mech.level"
                            disabled
                            text-color="#ff6633">
                            </el-rate>
                        </div>
                    </li>
                </ul>
            </el-card>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogMechVisible = false">取 消</el-button>
                <el-button type="warning" @click="clickSureShopMech">确定选择</el-button>
            </span>
        </el-dialog>
        <!-- 弹出框-房间 -->
        <el-dialog title="房间" :visible.sync="dialogRoomVisible">
            <el-card class="item-card" shadow="hover">
                <ul class="item-info">
                    <li :class="{active : room.isSelect}"
                    @click="room.isSelect=!room.isSelect"
                    v-for="(room, index) in roomList"
                    :key="index">
                        <img src="../../../assets/mech.png" alt="">
                        <div>
                            <span>{{room.name}}</span>
                            <p>
                                <span style="color: #f63;">已用{{room.unoccupied}}</span>
                                未用{{room.occupied}}
                            </p>
                        </div>
                    </li>
                </ul>
            </el-card>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogRoomVisible = false">取 消</el-button>
                <el-button type="warning" @click="clickSureShopRoom">确定选择</el-button>
            </span>
        </el-dialog>
        <!-- 弹出框-帮钟 -->
        <el-dialog title="帮钟" :visible.sync="dialogClockVisible">
            <el-row>
                <el-col :span="8" class="flex-layout">
                    <span>品牌</span>
                    <el-select class="flex-8" v-model="helpBrandId" placeholder="选择品牌">
                        <el-option
                            v-for="item in helpBrandData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8" class="flex-layout">
                    <span>门店</span>
                    <el-select class="flex-8" v-model="helpShopId" placeholder="选择门店">
                        <el-option
                            v-for="item in helpShopData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <el-input placeholder="输入技师姓名\技师工号" v-model="helpParams.search" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="searchHelpMech"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <div class="dialog_clock_mechList">
                <el-table
                    :data="helpMechList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        style="width: 30%">
                    </el-table-column>
                    <el-table-column
                        label="技师姓名"
                        style="width: 30%">
                        <template slot-scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="技师工号"
                        style="width: 30%">
                        <template slot-scope="scope">{{ scope.row.mechNo }}</template>
                    </el-table-column>
                    <el-table-column
                        prop="store"
                        label="所属门店"
                        show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.shop.name }}</template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :page-size="helpParams.pageSize"
                    :total="helpParams.totalSize">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClockVisible = false">取 消</el-button>
                <el-button type="warning" @click="sureClickHelpMech">确定选择</el-button>
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
    import dialog from '@/common/dialog'
    import router from '@/router'
    import orderApi from '@/api/order/order'
    import mechApi from '@/api/mech/mech'
    import productApi from '@/api/product/product'

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
                    // disabledDate(time) {
                    //     return time.getTime() + 1 * 24 * 60 * 60 * 1000 < Date.now()
                    // }
                },
                arrivalStoreDate: moment().format('YYYY-MM-DD'), // 到店日期
                arrivalStoreTime: '', // 到店时间
                arrivalStoreTimeObj: { // 到店可预约时间段
                    start: '11:00',
                    step: '00:15',
                    end: '23:00'
                },
                orderNum: 1, // 预约人数
                select_order_from: null, // 选择订单来源
                select_user_from: null, // 选择客户来源
                remarkTxt: '', // 备注信息
                dialogItemVisible: false, // 弹出框-服务项目
                itemDataFromAcIdx: null, // 弹出框-服务项目来源-默认下标
                dialogMechVisible: false, // 弹出框-技师
                dialogRoomVisible: false, // 弹出框-房间
                dialogClockVisible: false, // 弹出框-帮钟

                helpBrandData: [],
                helpShopData: [],
                helpBrandId: null,
                helpShopId: null,
                helpParams: {
                    page: 1,
                    pageSize: 5,
                    totalSzie: 0,
                    search: ''
                },
                helpMechList: [],
                selectMechList: []

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
                    this.order.guestList.push({
                        productList: [],
                        roomList: []
                    })
                    //加1操作
                } else {
                    //减1操作
                    console.log("-1")
                    const length = this.guestList.length
                    this.order.guestList.pop()
                }
            },
            itemDataFromAcIdx(newVal, oldVal) {
                const _this = this
                this.channelList.forEach((item) => {
                    if (item.id === newVal) {
                        _this.productList = item.shopProducts
                    }
                })
            },
            arrivalStoreDate(newVal, oldVal) {
                console.log(newVal)
                if (newVal) {

                }
            },
            helpBrandId(newId, oldId) {
                let self = this
                let shopList = []
                self.helpBrandData.forEach(brand => {
                    if (newId == brand.id ) {
                        brand.shopList.forEach(shop => {
                            shopList.push(shop)
                        })
                    }
                })

                if (shopList.length > 0) {
                    let first = shopList[0]
                    self.helpShopId = first.id
                }
                self.helpShopData = shopList
            },
            helpShopId(newId, oldId) {
                this.helpParams.page = 1
                this.queryHelpMechs()
            }
        },
        methods: {
            init() {
                const _this = this
                this.queryBrand()
                appointApi.querySource((data) => {
                    _this.sourceList = data
                })

                orderApi.queryOrderDetail(this.$route.query.orderId, (data) => {
                    _this.arrivalStoreDate = moment(data.bookTime).format('YYYY-MM-DD')
                    _this.arrivalStoreTime = moment(data.bookTime).format('HH:mm')
                    _this.order = data
                })

            },

            handleSelectionChange(val) {
                console.log(val)
                this.selectMechList = val;
            },
            searchHelpMech() {
                this.helpParams.page = 1;
                this.queryHelpMechs()
            },
            sureClickHelpMech() {
                console.info(this.selectMechList)

                const self = this
                if (self.selProduct) {
                    self.selectMechList.forEach(mech => {
                        mech.clockType = 3
                        mech.sale = self.selProduct.productPrice

                        //查询技师提成
                        productApi.queryMechProductMoney(mech.id, self.selProduct.productId,mech.clockType, (data) => {
                            mech.money = data
                            self.selProduct.mechList.push(mech)

                        })
                    })
                }
                this.dialogClockVisible = false
                console.log(this.selProduct)
            },
            searchByMobile(queryString, cb) {
                const _this = this
                appointApi.searchMobile(queryString, (data) => {

                    data.forEach((item) => {
                        item.value = item.mobile
                    })

                    if (data && data.length > 0) {
                        _this.user = data[0]
                    } else {
                        _this.user = {}
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

                let bookTime = _this.arrivalStoreDate + ' ' + _this.arrivalStoreTime
                appointApi.products(this.order.shop.id,bookTime, (data) => {
                    data.forEach(item => {
                        item.shopProducts.forEach(product => {
                            product.num = 0
                        })
                    })
                    _this.channelList = data
                    if (_this.channelList.length > 0) {
                            _this.itemDataFromAcIdx = _this.channelList[0].id
                        }
                    if (data && data.length > 0) {
                        _this.productList = data[0].shopProducts;
                    }
                })
            },
            fetchShopRoom() {
              const _this = this
              appointApi.fetchRooms(this.order.shop.id, (data) => {
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

                if (!product.mechList) {
                    product.mechList = []
                }
                appointApi.fetchMech(this.order.shop.id, (data) => {
                    data.forEach(item => item.isSelect = false)
                    _this.mechList = data
                })
            },
            clickAddHelp(product) {
                this.dialogClockVisible = true
                this.selProduct = product
                const self = this
                let params = {
                    shopId: this.order.shopId
                }

                shopApi.queryHelpBrand(params, (data) => {
                    self.helpBrandData = data
                    if (data.length > 0) {
                        let firstBrand = data[0]
                        self.helpBrandId = firstBrand.id
                        let shopList = []
                        firstBrand.shopList.forEach(shop => shopList.push(shop))
                        self.helpShopData = shopList

                        if (shopList.length > 0) {
                            let firstShop = shopList[0]
                            self.helpShopId = firstShop.id
                        }
                    }

                    self.queryHelpMechs()
                })
            },
            queryHelpMechs() {
                let self = this
                this.helpParams.shopId = self.helpShopId
                mechApi.queryPage(this.helpParams, (data) => {
                    self.helpMechList = data.list
                    self.helpParams.totalSize = data.totalSize
                })
            },
            //点击下一页
            handleCurrentChange: function(curPage) {
                const self = this
                self.helpParams.page = curPage
                self.queryHelpMechs()
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
                                var newProduct = {}
                                newProduct.productName = product.name
                                newProduct.productPrice = product.sellPrice
                                newProduct.productId = product.id
                                newProduct.duration = product.duration
                                _this.selGuest.productList.push(newProduct)
                            }
                        }
                    })
                } else {
                    this.productList.forEach(product => {
                        if (product.num > 0) {
                            var num = product.num
                            product.mechList = []
                            while(num--){
                                _this.order.guestList.forEach(guest => {
                                    var newProduct = {}
                                    newProduct.productName = product.name
                                    newProduct.productPrice = product.sellPrice
                                    newProduct.productId = product.id
                                    newProduct.duration = product.duration
                                    guest.productList.push(newProduct)
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
                if (!guest.roomList) {
                    guest.roomList = []
                }
                this.fetchShopRoom()
            },
            chooseShopMech(mech) {
                mech.isSelect = !mech.isSelect
            },
            clickSureShopMech() {
                const self = this
                if (self.selProduct) {
                    self.mechList.forEach(mech => {
                        if (mech.isSelect) {
                            mech.clockType = 1
                            mech.sale = self.selProduct.productPrice

                            //查询技师提成
                            productApi.queryMechProductMoney(mech.id, self.selProduct.productId,mech.clockType, (data) => {
                                mech.money = data
                                self.selProduct.mechList.push(mech)

                            })
                        }
                    })
                }
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
            saveAppoint() {
                let self = this
                let bookTime = this.arrivalStoreDate + ' ' + this.arrivalStoreTime
                this.order.bookTime = moment(bookTime, 'YYYY-MM-DD HH:mm').toDate().getTime()
                dialog.confirm(() => {
                    orderApi.editOrder(self.order, (data) => {
                        show.success(data)
                    })
                })
            },


            /**
             *
             * 更改技师的上钟方式
             * @param mech
             * @param product
             */
            changeClockType(mech, product) {

                console.log(mech)

                console.log(product)

                //查询技师提成
                productApi.queryMechProductMoney(mech.id, product.productId,mech.clockType, (data) => {
                    mech.money = data
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
                span{
                    margin-right: 10px;
                }
            }
            >ul:nth-of-type(1) {
                span:nth-of-type(1) {
                    margin-right: 10px;
                }
            }
            >ul{
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
            >div:nth-of-type(4){
                margin-top: 10px;
                h4{
                    font-size: 20px;
                    padding: 10px 0;
                }
            }
            >div:nth-of-type(5){
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
    }
</style>
