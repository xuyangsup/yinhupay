<template>
    <div class="dingdankaidan">
        <div class="dingdankaidan-title">
            <h3>订单开单</h3>
        </div>
        <div class="yuyue-container">
            <div>
                <span>品牌</span>
                <el-select v-model="brandId" placeholder="选择品牌" class="handle-select mr10">
                    <el-option
                    v-for="item in brandList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <ul>
                <li :class="{active : shopId === item.id}"
                v-for="(item,index) in shopList"
                :key="index" @click="clickStore(item.id)">
                    <el-button size="mini" plain>{{item.name}}</el-button>
                </li>
            </ul>
            <div>
                <!-- 用户信息 -->
                <el-row type="flex">
                    <el-col :span="6">
                        <span>预约人</span>
                        <el-input v-model="user.name" placeholder="请输入用户名" style="width: 60%;margin-left: 10px;"></el-input>
                    </el-col>
                    <el-col :span="3" style="display: flex">
                        <el-radio v-model="user.sex" label="F" border size="mini">女</el-radio>
                        <el-radio v-model="user.sex" label="M" border size="mini">男</el-radio>
                    </el-col>
                    <el-col :span="7" style="margin-left: 50px;">
                        <span>联系电话</span>
                        <el-autocomplete
                            class="inline-input"
                            v-model="userPhone"
                            :fetch-suggestions="searchByMobile"
                            :trigger-on-focus="false"
                            placeholder="请输入联系电话"
                            style="width: 60%;margin-left: 10px;"
                            @select="handleSelectMobile"></el-autocomplete>
                    </el-col>
                </el-row>
                <!-- 日期与时间 -->
                <el-row type="flex" style="margin-top: 20px;">
                    <el-col :span="6">
                        <span style="margin-right: 10px;">到店日期</span>
                        <el-date-picker
                        v-model="arrivalStoreDate"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions1"
                        :clearable="false">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="6">
                        <span style="margin-right: 10px;">到店时间</span>
                        <el-time-select
                        v-model="arrivalStoreTime"
                        :picker-options="arrivalStoreTimeObj"
                        placeholder="选择时间"
                        :clearable="false">
                        </el-time-select>
                    </el-col>
                </el-row>
                <!-- 预约人数、订单来源、客户来源 -->
                <el-row type="flex" style="margin-top: 20px;">
                    <el-col :span="6">
                        <span style="margin-right: 10px;">预约人数</span>
                        <el-input-number v-model="orderNum"  :min="1" :max="10" label="预约人数"></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <span style="margin-right: 10px;">订单来源</span>
                        <el-select v-model="select_order_from" placeholder="选择订单来源" class="handle-select mr10">
                            <el-option
                            v-for="item in sourceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span style="margin-right: 10px;">客户来源</span>
                        <el-select v-model="select_user_from" placeholder="选择客户来源" class="handle-select mr10">
                            <el-option
                            v-for="item in sourceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
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
                    <div class="orderInfo" v-for="(guest, index) in guestList">
                        <div class="guestInfo">
                            <i class="el-icon-remove-outline" @click="removeGuest(guest, index)"></i>
                            <span>预约人{{index + 1}}</span>
                            <el-button type="info" size="mini" v-for="guest in guest.roomList" :key="item.id">{{item.name}}</el-button>
                            <el-button type="warning" size="mini" @click="addGuestProduct(guest)">+ 项目</el-button>
                            <el-button type="warning" size="mini" @click="addGuestRoom(guest)">+ 房间</el-button>
                        </div>
                        <div class="productInfo" v-for="product in guest.productList">
                            <i class="el-icon-remove-outline" @click="removeProduct(product, guest)"></i>
                            <span>{{product.name}} <i>￥{{product.sellPrice}}</i></span>
                            <el-button type="success" size="mini" @click="clickAddMech(product)">+ 技师</el-button>
                            <el-button type="primary" size="mini" @click="clickAddHelp(product)">+ 帮钟</el-button>

                            <div class="mechInfo" v-for="mech in product.mechList">
                                <i class="el-icon-remove-outline" @click="removeMech(mech, product)"></i>
                                <span>{{mech.name}}({{mech.mechNo}})</span>
                                <el-select style="width:20%;margin-left:10px;" v-model="mech.clockType" @change="changeClockType(mech, product)" placeholder="选择排钟" class="handle-select mr10">
                                    <el-option
                                        v-for="item in clockTypeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <span style="margin-left: 15px">业绩：<el-input style="width: 8%;margin-right: 10px" v-model="mech.sale" type="number"></el-input>元</span>
                                <span style="margin-left: 15px">提成：<el-input style="width: 8%;margin-right: 10px" v-model="mech.money" type="number"></el-input>元</span>
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
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="如需备注，请输入"
                v-model="remarkTxt">
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
                        width="100">
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
                        width="100">
                            <template slot-scope="scope">
                                <span class="f63">￥{{ scope.row.sellPrice }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量">
                            <template slot-scope="scope">
                                <!-- <el-button size="mini"@click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
                                <el-input-number size="mini" v-model="scope.row.num" :min="0" :max="10"></el-input-number>
                                <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
                        <template v-if="!mech.avatar">
                            <img v-if="mech.sex == 'M'" src="../../../assets/user_man.png" alt="">
                            <img v-if="mech.sex == 'F'" src="../../../assets/user_woman.png" alt="">
                        </template>
                        <template v-else>
                            <img v-if="mech.sex == 'F'" :src="mech.avatar" alt="">
                        </template>
                        <div>
                            <span>{{mech.name}}({{mech.mechNo}})</span>
                            <el-rate
                            v-model="mech.starLevel"
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
    import mechApi from '@/api/mech/mech'
    import indexApi from '@/api/index'
    import productApi from '@/api/product/product'


    let nowDay = moment().format('YYYY-MM-DD');

    export default {
        data() {
            return {
                brandData: [],
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
                arrivalStoreDate: nowDay, // 到店日期
                arrivalStoreTime: '11:00', // 到店时间
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
                this.guestList.forEach(guest => {
                    guest.productList.forEach(product => {
                        totalFee += product.sellPrice
                    })
                })
                return totalFee
            }
        },
        watch: {
            brandId(newVal, oldVal) {
                // this.queryShopByBrand(newVal)

                let self = this
                let shopList = []
                self.brandData.forEach(brand => {
                    if (brand.id == newVal) {
                        brand.shopList.forEach(shop => {
                            shopList.push(shop)
                        })
                    }
                })

                if(shopList.length > 0) {
                    let shop = shopList[0]
                    self.shopId = shop.id
                }
                self.shopList = shopList
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
                const self = this
                this.channelList.forEach((item) => {
                    if (item.id === newVal) {
                        self.productList = item.shopProducts
                    }
                })
            },
            arrivalStoreDate(newVal, oldVal) {
                console.log(newVal)
                if (newVal) {
                    let self = this
                    appointApi.times(newVal, (data) => {
                        self.arrivalStoreTime = data
                        self.arrivalStoreTimeObj = { // 到店可预约时间段
                            start: data,
                            step: '00:15',
                            end: '23:00'
                        }
                    })
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
                const self = this
                // this.queryBrand()
                appointApi.querySource((data) => {
                    self.sourceList = data
                })

                let nowDay = moment().format('YYYY-MM-DD');

                appointApi.times(nowDay, (data) => {
                    self.arrivalStoreTime = data
                    self.arrivalStoreTimeObj = { // 到店可预约时间段
                        start: data,
                        step: '00:15',
                        end: '23:00'
                    }
                })

                //查询门店权限
                indexApi.getEmpShops((data) => {

                    self.brandData = data.brandList
                    let shopList = []

                    let list = []
                    data.brandList.forEach(brand => {
                        list.push(brand)

                        brand.shopList.forEach(shop => {
                            shopList.push(shop)
                        })
                    })
                    self.brandList = list
                    self.shopList = shopList

                    if (list.length > 0) {
                        self.brandId = list[0].id
                    }

                    if (shopList.length > 0) {
                        self.shopId = shopList[0].id
                    }
                })
            },
            searchHelpMech() {
                this.helpParams.page = 1
                this.queryHelpMechs()
            },
            searchByMobile(queryString, cb) {
                const self = this
                appointApi.searchMobile(queryString, (data) => {
                    data.forEach((item) => {
                        item.value = item.name + item.mobile
                    })
                    if (data && data.length > 0) {
                        self.user = data[0]
                        self.select_user_from = self.user.sourceId
                    } else {
                        self.user = {}
                        self.select_user_from = null
                    }
                    cb(data)
                })
            },
            handleSelectMobile(item) {
                const self = this
                self.user = item
                self.userPhone = item.mobile;
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
                console.log(val)
                this.selectMechList = val;
            },
            sureClickHelpMech() {
                console.info(this.selectMechList)

                const self = this
                if (self.selProduct) {
                    self.selectMechList.forEach(mech => {
                        mech.clockType = 3
                        mech.sale = self.selProduct.sellPrice

                        //查询技师提成
                        productApi.queryMechProductMoney(mech.id, self.selProduct.id,mech.clockType, (data) => {
                            mech.money = data
                            self.selProduct.mechList.push(mech)

                        })
                    })
                }
                this.dialogClockVisible = false
                console.log(this.selProduct)
            },
            
            //添加项目
            clickAddProduct() {
                this.selGuest = null
                this.fetchShopProduct()
            },
            
            //查询门店项目
            fetchShopProduct() {
                const self = this
                self.dialogItemVisible = true
                let bookTime = self.arrivalStoreDate + ' ' + self.arrivalStoreTime
                appointApi.products(this.shopId, bookTime, (data) => {
                    data.forEach(item => {
                        item.shopProducts.forEach(product => {
                            product.num = 0
                        })
                    })

                    self.channelList = data
                    if (data && data.length > 0) {
                        self.productList = data[0].shopProducts
                        self.itemDataFromAcIdx = data[0].id
                    }
                })
            },
            fetchShopRoom() {
              const self = this
              appointApi.fetchRooms(this.shopId, (data) => {
                  data.forEach(item => {
                      var flag = false
                      self.selGuest.roomList.forEach(room => {
                          if (item.id == room.id) {
                              flag = true
                          }
                      })
                      item.isSelect = flag
                  })
                  self.roomList = data
              })
            },
            clickAddMech(product) {
                this.dialogMechVisible = true
                const self = this
                self.selProduct = product
                appointApi.fetchMech(this.shopId, (data) => {
                    data.forEach((item) => item.isSelect = false)
                    self.mechList = data
                })
            },
            clickAddHelp(product) {
                this.dialogClockVisible = true
                this.selProduct = product
                const self = this
                let params = {
                    shopId: this.shopId
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
                const self = this
                if (this.selGuest) {
                    this.productList.forEach(product => {
                        if (product.num > 0) {
                            var num = product.num
                            product.mechList = []
                            while(num--){
                                self.selGuest.productList.push(utils.deepCopy(product))
                            }
                        }
                    })
                } else {
                    this.productList.forEach(product => {
                        if (product.num > 0) {
                            var num = product.num
                            product.mechList = []
                            while(num--){
                                self.guestList.forEach(guest => {
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
                const self = this
                if (self.selProduct) {
                    self.mechList.forEach(mech => {
                        if (mech.isSelect) {
                            mech.clockType = 1
                            mech.sale = self.selProduct.sellPrice

                            //查询技师提成
                            productApi.queryMechProductMoney(mech.id, self.selProduct.id,mech.clockType, (data) => {

                                //因为返回过来的是分,处理成元
                                mech.money = data
                                self.selProduct.mechList.push(mech)

                            })
                        }
                    })
                }
                console.log(this.selProduct)
                this.dialogMechVisible = false
            },
            removeMech(mech, product) {
                product.mechList.splice(product.mechList.findIndex(item => item.id === mech.id), 1)
            },

            clickSureShopRoom() {
                const self = this
                if (self.selGuest) {
                    const list = []
                    self.roomList.forEach(item => {
                        if (item.isSelect) {
                            list.push(item)
                        }
                    })
                    self.selGuest.roomList = list
                }
                self.dialogRoomVisible = false
            },

            /**
             * 
             * 提交订单
             */
            saveAppoint() {
                let self = this
                dialog.confirm(() => {
                    let order = {}
                    self.user.mobile = this.userPhone
                    order.user = self.user
                    self.guestList.forEach((item, index) => item.name = '预约人' + (index + 1) )
                    order.guestList = self.guestList
                    order.shopId = self.shopId
                    order.orderSourceId = self.select_order_from
                    order.userSourceId = self.select_user_from
                    order.bookTime = self.arrivalStoreDate + ' ' + self.arrivalStoreTime
                    order.remark = self.remarkTxt
                    appointApi.saveAppoint(order, (data) => {
                        dialog.message('订单预约成功', () => {
                            self.$store.state.keyPage = new Date().getTime()
                        })
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
                productApi.queryMechProductMoney(mech.id, product.id,mech.clockType, (data) => {
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
            height: 300px;
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
                    width: 130px;
                    height: 130px;
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
