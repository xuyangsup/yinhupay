<template>
    <div class="pinpai">
        <div class="pinpai-title">
            <div class="fr">
                <el-button @click="clickAdd" type="danger">添加项目</el-button>
            </div>
            <h3>品牌项目</h3>
        </div>
        <div class="pinpai-container">
            <div>
                <span>品牌</span>
                <el-select v-model="selectBrandId" placeholder="选择品牌" class="handle-select mr10">
                    <el-option
                    v-for="item in brandData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                v-loading="dataLoading"
                :data="items"
                style="width: 100%">
                <el-table-column
                    label="项目名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="项目头图"
                    width="200">
                    <template slot-scope="scope">
                        <div style="width: 150px">
                            <img class="itemImg" :src="scope.row.imageUrl" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="原价">
                    <template slot-scope="scope">
                        <span>{{ scope.row.originalPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="标准售价">
                    <template slot-scope="scope">
                        <span>{{scope.row.sellPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="项目分类">
                    <template slot-scope="scope">
                        <span>{{scope.row.classifyName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>
                        <el-switch
                            v-model="scope.row.isOnline"
                            active-text="上线"
                            inactive-text="下线"
                            active-color="#13ce66"
                            inactive-color="#ccc"
                            @change="changeRuleStatus(scope.row, scope.$index)">
                        </el-switch>
                    </template>
                </el-table-column>
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

        <!-- 弹出框-添加项目 -->
        <el-dialog title="项目信息" :visible.sync="dialogBrandVisible" :close-on-click-modal="false">
            <div>
                <!-- 项目名称 -->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">项目名称</span>
                    <el-input style="width: 50%" v-model="product.name" placeholder="请输入项目名称"></el-input>
                </div>
                <!-- 项目类别 -->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">项目类别</span>
                    <el-select v-model="product.classifyId" placeholder="请选择项目类别" style="width: 30%">
                        <el-option
                        v-for="item in classifyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <!-- 头图 -->
                <div class="mt10" style="display: flex;align-items: center;">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">头图</span>
                    <el-upload
                        ref="activityUpload"
                        class="avatar-uploader"
                        action="/api/v1/image/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="product.fullUrl" :src="product.fullUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">时长</span>
                    <el-input style="width: 18%" v-model="product.duration" placeholder="请输入时长"></el-input>
                    <span>分钟</span>
                </div>
                <!-- 原价 -->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">原价</span>
                    <el-input style="width: 18%" v-model="product.originalPrice" placeholder="请输入原价"></el-input>
                    <span>元</span>
                </div>
                <!-- 售价 -->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">售价</span>
                    <el-input style="width: 18%" v-model="product.sellPrice" placeholder="请输入售价"></el-input>
                    <span>元</span>
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
    import brandApi from '@/api/brand'
    import projectApi from '@/api/product/product'
    import classifyApi from '@/api/product/classify'
    import brandProdcutApi from '@/api/product/brandProduct'
    import dialog from '@/common/dialog'
    import utils from '@/common/utils'
    import {OSS_URL} from '@/api/constant'
    import show from '@/common/show'

    export default {
        data() {
            return {
                dataLoading: true,
                IMAGE_URL: OSS_URL,
                params: {
                    page: 1,
                    pageSize: 10,
                },
                brandData: [],
                selectBrandId: null, // 默认选择品牌
                classifyList: [], //项目分类
                items: [],
                product: {
                    name: '',
                    imageUrl: '',
                    fullUrl: null,
                    classifyId: null,
                    originalPrice: null,
                    duration:0,
                    sellPrice: null
                },
                dialogBrandVisible: false, // 弹出层-添加项目
            }
        },
        mounted() {
            this.init()
        },
        watch: {
            selectBrandId: function (val) {
                this.pageQuery()
            }
        },
        methods: {
            init() {
                this.queryBrand()
                this.queryClassify()
            },
            //查询品牌
            queryBrand() {
                const self = this
                brandApi.queryByEmp((data) => {
                    for (const brand of data) {
                        self.brandData.push({
                            value: brand.id,
                            label: brand.name
                        })
                    }

                    if (data && data.length > 0) {
                        self.selectBrandId = data[0].id

                        //查询
                        self.pageQuery()
                    }
                })
            },
            queryClassify() {
                const self = this
                classifyApi.queryClassify((data) => {
                    if (data) {
                        for (const item of data) {
                            self.classifyList.push({
                                value: item.id,
                                label: item.name
                            })
                        }
                    }
                })
            },
            pageQuery() {
                const self = this
                this.dataLoading = true
                self.params.brandId = self.selectBrandId
                brandProdcutApi.pageQuery(self.params, (data) => {
                    self.items = data.list
                    self.dataLoading = false
                    self.params.totalSize = data.totalSize
                })
            },
            clickAdd() {
                this.product = {
                    name: '',
                    imageUrl: '',
                    classifyId: null,
                    originalPrice: null,
                    sellPrice: null
                }

                this.dialogBrandVisible = true
            },
            /*
             * 品牌修改
             */
            handleClick(row) {
                const self = this
                self.product = utils.deepCopy(row)
                self.product.fullUrl = self.product.imageUrl;
                self.dialogBrandVisible = true
                console.log(row);
            },
            clickCancel: function() {

                this.dialogBrandVisible = false
            },
            //点击保存
            clickSave() {
                const self = this
                if (self.product.id) {
                    dialog.confirm(() => {
                        brandProdcutApi.update(self.product, (id) => {
                            self.dialogBrandVisible = false
                            show.success('操作成功')
                            self.pageQuery()
                        })
                    })
                } else {
                    dialog.confirm(() => {
                        self.product.brandId = self.selectBrandId
                        brandProdcutApi.insert(self.product, (id) => {
                            self.dialogBrandVisible = false
                            show.success('操作成功')
                            self.pageQuery()
                        })
                    })
                }
            },
            //点击下一页
            handleCurrentChange(curPage) {
                const self = this
                self.params.page = curPage
                self.pageQuery()
            },
            /*
             * 改变规则状态
             */
            changeRuleStatus(data, idx) {
                console.info(data, idx)
                if (data.isOnline) {
                    this.$message({
                        message: '恭喜你，该规则已上线！',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '注意，该规则已下线！',
                        type: 'warning'
                    });
                }
            },
            /*
             * 弹出层-图片-上传
             */
            handleAvatarSuccess(res, file) {
             
                if (res.code == 0) {
                    this.product.imageUrl = res.data.filePath;
                    this.product.fullUrl = res.data.fullPath;
                }

            },
            beforeAvatarUpload(file) {
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

<style lang="less" scoped>
    .pinpai{
        .pinpai-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
        .pinpai-container{
            padding: 10px 0 0 20px;
            >div:nth-of-type(1){
                padding-left: 40px;
                position: relative;
                span{
                    position: absolute;
                    left: 0;
                    top: 5px;
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
        }
        // 活动表格数据
        >div:nth-of-type(3){
            margin-top: 20px;
            border: 1px solid #f2f2f2;
            border-bottom: 1px solid transparent;
        }
    }

    // 项目图片
    .itemImg{
        width: 100%;
        height: auto;
    }

    // 活动头图
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 89px;
        height: 89px;
        line-height: 89px;
        text-align: center;
    }
    .avatar {
        width: 89px;
        height: 89px;
        display: block;
    }
</style>
