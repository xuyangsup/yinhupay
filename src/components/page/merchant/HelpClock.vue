<template>
    <div class="bangzhong">
        <div class="bangzhong-title">
            <div class="fr"><el-button type="danger" @click="addNewShopHelp">新增帮钟</el-button></div>
            <h3>帮钟管理</h3>
        </div>
        <div class="bangzhong-container">
            <div class="mr10">
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
            <div>
                <span class="mr10">门店</span>
                <el-select v-model="shopId" placeholder="选择门店" class="handle-select mr10">
                    <el-option
                    v-for="item in shopList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="items"
                style="width: 100%">
                <el-table-column
                    label="门店名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.shop.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="帮钟品牌">
                    <template slot-scope="scope">
                        <span>{{ scope.row.helpBrand.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="帮钟门店">
                    <template slot-scope="scope">
                        <span>{{ scope.row.helpShop.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status == 1 ? '启用' : '未启用'}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                    <!--label="操作"-->
                    <!--width="180">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">设置帮钟</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                background
                @current-change="handleCurrentChange"
                layout="prev, pager, next"
                :page-size="params.pageSize"
                :total="params.totalSize">
            </el-pagination>
        </div>

        <!-- 弹出框-帮钟门店 -->
        <el-dialog title="帮钟门店" :visible.sync="dialogHelpStoreVisible" :close-on-click-modal="false">
            <div>
               <span class="mr10">品牌</span>
                <el-select v-model="selectBrandId" placeholder="选择品牌">
                    <el-option
                    v-for="item in selectBrandList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div>
                <ul class="dialog-storeList">
                    <li
                        :class="{active: item.isSelect}"
                        v-for="item in selectShopList"
                        :key="item.id"
                        @click="chooseShop(item)">
                        <el-button size="mini" plain >{{item.name}}</el-button>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogHelpStoreVisible = false">取 消</el-button>
                <el-button type="warning" @click="addShopHelps">确定选择</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import brandApi from '@/api/brand'
    import utils from '@/common/utils'
    import shopApi from '@/api/shop'
    import indexApi from '@/api/index'
    import dialog from '@/common/dialog'
    import show from '@/common/show'

    export default {
        data() {
            return {

                params: {
                    page: 1,
                    pageSize: 10,
                    brandId: null,
                    shopId: null,
                    totalSize: 0
                },

                brandData: [],
                brandId: null, // 默认选择品牌
                brandList: [],
                shopList: [],
                shopId: null, // 默认门店下标

                selectBrandList: [],
                selectShopList: [],

                selectBrandId: null,

                items: [],

                dialogHelpStoreVisible: false, // 弹出层
            }
        },


        watch: {

            selectBrandId(newId, oldId) {
                let self = this

                let params = {
                    shopId: self.shopId,
                    helpBrandId: newId
                }
                shopApi.queryShopHelps(params, (data) => {

                    let shopList = []
                    self.brandData.forEach(brand => {
                        if (brand.id == newId) {
                            brand.shopList.forEach(shop => {
                                if (shop.id != self.shopId) {
                                    var flag = false
                                    data.forEach(helpShop => {
                                        if (helpShop.helpShopId == shop.id) {
                                            flag = true;
                                        }
                                    })
                                    shop.isSelect = flag
                                    shopList.push(shop)
                                }
                            })

                            self.selectShopList = shopList
                        }
                    })
                })
            },

            brandId(newId, oldId) {
                this.params.page = 1
                let shopList = []
                this.brandData.forEach(brand => {
                    if (brand.id == newId) {
                        brand.shopList.forEach(shop => {
                            shopList.push(shop)
                        })
                    }
                })

                if (shopList.length > 0) {
                    let first = shopList[0]
                    this.shopId = first.id
                }
                this.shopList = shopList

                this.queryHelpShop()
            },

            shopId(newId, oldId) {
                this.params.page = 1
                this.queryHelpShop()
            }
        },


        mounted() {
            this.init()
        },

        methods: {

            init() {

                let self = this
                indexApi.getEmpShops((data) => {

                    let shopList = []

                    let brandList = []
                    data.brandList.forEach(brand => {
                        brandList.push(brand)

                        brand.shopList.forEach(shop => shop.isSelect = false)
                    })


                    if (shopList.length > 0) {
                        let shop = shopList[0]
                        self.shopId = shop.id
                    }

                    if (brandList.length > 0) {
                        let brand = brandList[0]
                        self.brandId = brand.id

                        brand.shopList.forEach(shop => {
                            shop.isSelect = false
                            shopList.push(shop)
                        })
                    }
                    self.brandList = brandList
                    self.shopList = shopList

                    self.params.brandId = self.brandId
                    self.params.shopId = self.shopId

                    self.brandData = data.brandList
                    self.queryHelpShop()
                })
            },

            addNewShopHelp() {
                let self = this
                self.dialogHelpStoreVisible = true

                let selectBrandList = []
                this.brandData.forEach(brand => {
                    selectBrandList.push(brand)
                })
                self.selectBrandList = selectBrandList
                if (selectBrandList.length > 0) {
                    let brand = selectBrandList[0]
                    self.selectBrandId = brand.id
                }

                let params = {
                    shopId: self.shopId,
                    helpBrandId: self.selectBrandId
                }
                shopApi.queryShopHelps(params, (data) => {

                    let selectShopList = []
                    if (selectBrandList.length > 0) {
                        let brand = selectBrandList[0]
                        brand.shopList.forEach(shop => {

                            if (shop.id != self.shopId) {
                                var flag = false
                                data.forEach(helpShop => {
                                    if (helpShop.helpShopId == shop.id) {
                                        flag = true;
                                    }
                                })
                                shop.isSelect = flag
                                selectShopList.push(shop)
                            }
                        })
                    }
                    console.log(selectShopList)
                    self.selectShopList = selectShopList

                })
            },

            queryHelpShop: function() {
                const self = this
                self.params.brandId = self.brandId
                self.params.shopId = self.shopId

                shopApi.queryHelpShop(self.params, (data) => {
                    self.params.totalSize = data.totalSize
                    self.items = data.list
                })
            },

            chooseShop(shop) {
                console.log(shop)
                shop.isSelect = !shop.isSelect
            },

            addShopHelps() {

                let self = this

                dialog.confirm(() => {

                    var params = {}
                    params.shopId = self.shopId
                    params.helpBrandId = self.selectBrandId

                    let shopIds = []
                    self.selectShopList.forEach(shop => {
                        if (shop.isSelect) {
                            shopIds.push(shop.id)
                        }
                    })
                    params.helpShopIds = shopIds
                    shopApi.addShopHelps(params, (data) => {

                        show.success(data)
                        self.dialogHelpStoreVisible = false
                        self.queryHelpShop()
                    })
                })

            },


            handleCurrentChange: function(curPage) {
                this.params.page = curPage
                this.queryHelpShop()
            },


            /*
             * 品牌修改
             */
            handleClick(row) {
                console.log(row)
                this.dialogHelpStoreVisible = true
            },
        }
    }
</script>

<style lang="less" scoped>
    .bangzhong{
        .bangzhong-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
        .bangzhong-container{
            padding: 10px 0 0 20px;
            display: flex;
            >div:nth-of-type(1){
                padding-left: 40px;
                position: relative;
                span{
                    position: absolute;
                    left: 0;
                    top: 5px;
                }
            }
        }
        // 弹出层
        .dialog-storeList{
            overflow: hidden;
            padding-left: 40px;
            li{
                float: left;
                margin: 10px 10px 0 0;
                button{
                    color: #606266;
                    border: 1px solid #dcdfe6;
                }
            }
            /*li:hover button{*/
                /*border: 1px solid #409EFF;*/
                /*color: #409EFF;*/
            /*}*/
            li.active button{
                border: 1px solid #409EFF;
                color: #409EFF;
            }
        }
    }
</style>
