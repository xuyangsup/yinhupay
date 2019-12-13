<template>
    <div>
        <!-- 弹出框-添加/编辑 门店项目 -->
        <el-dialog :title=" product.id ? '编辑项目' : '添加项目' " :visible.sync="show" :close-on-click-modal="false">
            <div>
                <!-- 项目类别 -->
                <div class="mt10 flex-layout">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">品牌项目</span>
                    <el-select v-model="product.brandProductId" placeholder="请选择项目类别" style="width: 30%">
                        <el-option
                            v-for="item in brandProductList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>

                <!-- 项目渠道-->
                <div class="mt10 flex-layout">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">销售渠道</span>
                    <el-select v-model="product.channelId" placeholder="请选择销售渠道" style="width: 30%">
                        <el-option
                            v-for="item in channelList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>

                <!-- 头图 -->
                <div class="mt10 flex-layout">
                    <div style="display:flex;margin-right:30px">
                        <span style="flex:1; text-align: right;margin-right:20px;margin-left:25px">头图</span>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/v1/image/upload"
                            :show-file-list="false"
                            :on-success="successUpload"
                            :before-upload="beforeUpload">
                            <img v-if="product.imageUrl" :src="IMAGE_URL + product.imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </div>

                <!-- 名称 -->
                <div class="mt10 flex-layout">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">项目名称</span>
                    <el-input style="width: 50%" v-model="product.name" placeholder="请输入项目名称"></el-input>
                </div>

                <div class="mt10 flex-layout">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">时长</span>
                    <el-input style="width: 50%" v-model="product.duration" placeholder="请输入时长"></el-input>
                </div>

                <div class="mt10 flex-layout">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">原价</span>
                    <el-input style="width: 50%" v-model="product.originalPrice" placeholder="请输入原价"></el-input>
                </div>


                <div class="mt10 flex-layout">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">售价</span>
                    <el-input style="width: 50%" v-model="product.sellPrice" placeholder="请输入售价"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clickCancel">取 消</el-button>
                <el-button type="warning" @click="clickSave">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import shopProductApi from '@/api/product/shopProduct'
    import brandProdcutApi from '@/api/product/brandProduct'
    import {OSS_URL} from '@/api/constant'
    import show from '@/common/show'
    import dialog from '@/common/dialog'

    export default {

        props: ['brandId', 'shopId', 'visible', 'callback'],

        data() {
            return {

                IMAGE_URL: OSS_URL,

                show: this.visible,

                product: {
                    brandProductId: null,
                    channelId: null,
                    imageUrl: '',
                    duration: 0,
                    name: '',
                    originalPrice: null,
                    sellPrice: null
                },

                brandProductList: [],

                channelList: [],
            }
        },


        mounted() {
            this.init()
        },

        watch: {

            visible: function (val) {
                console.log(val)
                this.show = val
            },

            show: function (val) {
                this.callback(val)
            },


            brandId: function (val) {
                this.queryBrandProduct(val)
                this.queryChannelByBrand(val)
            },

            shopId: function (val) {
                if (val) {

                }
            }
        },


        methods: {
            init() {

            },

            clickSave() {
                const self = this
                dialog.confirm(() => {
                    if (self.product.id) {
                        shopProductApi.update(self.product, (data) => {
                            show.success('操作成功')
                            self.show = false
                            self.callback(false)
                        })
                    } else {
                        self.product.brandId = self.brandId
                        self.product.shopId = self.shopId
                        shopProductApi.insert(self.product, (data) => {
                            show.success('操作成功')
                            self.show = false
                            self.callback(false)
                        })
                    }
                })
            },

            clickCancel() {
                if (this.cancel) {
                    this.cancel()
                }
            },

            queryBrandProduct: function(brandId) {
                const self = this
                brandProdcutApi.queryByBrand(brandId, (data) => {
                    self.brandProductList = data
                })
            },

            queryChannelByBrand: function(brandId) {
                const self = this
                // channelApi.queryByBrand(brandId, (data) => {
                //     self.channelList = data
                // })
            },


            successUpload(res, file) {
                if (res.code == 0) {
                    this.product.imageUrl = res.data.filePath;
                }
            },

            beforeUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
        }
    }
</script>
