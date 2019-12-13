<template>
    <div class="biaoqianguanli">
        <div class="biaoqianguanli-title">
             <div class="fr"><el-button type="danger" @click="addLabel">添加标签</el-button></div>
            <h3>标签管理</h3>
        </div>
        <div>
            <div>
                <span>标签类型</span>
                <el-select class="flex-8" v-model="select_mark">
                    <el-option
                    v-for="item in markList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>标签名称</span>
                <el-input placeholder="请输入标签名称" v-model="markName" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="clickSearch"></el-button>
                </el-input>
            </div>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                v-loading="dataLoading"
                :data="itemData"
                style="width: 100%">
                <el-table-column
                    label="序号"
                    width="100">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.$index + 1 }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="标签名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="标签类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.label_type|filterLabelType }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.gmtCreated}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status ? '已启用' : '关闭'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>  
                        <el-button @click="changeStatus(scope.row)" type="text" size="small">{{scope.row.status ? '关闭' : '启用'}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="params.pageSize"
                :total="params.totalSize">
            </el-pagination>
        </div>

        <!-- 弹出框-标签 -->
        <el-dialog title="标签信息" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div>
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">标签名称</span>
                    <el-input style="width: 30%" v-model="dialog_markName" placeholder="请输入标签名称"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">标签类型</span>
                    <el-select class="flex-8" v-model="dialog_select_mark">
                        <el-option
                        v-for="item in dialog_markList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <!-- 描述 -->
                <div class="mt10" style="display: flex">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">描述</span>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="如需描述，请输入"
                        v-model="remarkTxt">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="warning" @click="save">确定选择</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import labelApi from '@/api/label'
import utils from '@/common/utils'
import dialog from '@/common/dialog'
import show from '@/common/show'
export default {
    data () {
        return {
            markName: '', // 标签名称
            select_mark: '品牌', // 默认选择品牌
            markList: [ {
                value: '品牌',
                label: '品牌'
            }, {
                value: '门店',
                label: '门店'
            }, {
                value: '项目',
                label: '项目'
            }, {
                value: '会员',
                label: '会员'
            }],
            dataLoading: true, // loading
            itemData: [],
            params: { // 分页参数
                page: 1,
                pageSize: 10
            },
            dialogAddVisible: false, // 弹出层-添加标签
            dialog_markName: '', // 弹出层-标签名称
            dialog_select_mark: '品牌', // 弹出层-标签类型
            dialog_markList: [ {
                value: '品牌',
                label: '品牌'
            }, {
                value: '门店',
                label: '门店'
            }, {
                value: '项目',
                label: '项目'
            }, {
                value: '会员',
                label: '会员'
            }],
            remarkTxt: '', // 弹出层-标签描述
        }
    },
    mounted() {
        this.pageQuery()
    },
    watch: {
        select_mark: function () {
            this.pageQuery()
        }
    },
    filters: {
        /**
         * 过滤表格标签类型
         */
        filterLabelType (val) {

            if (val === 1) {
                return '品牌'
            } else if (val === 2) {
                return '门店'
            } else if (val === 3) {
                return '项目'
            } else {
                return '会员'
            }
        }
    },
    methods: {
        /*
         * 
         * 分页查询
         */
        pageQuery () {

            const self = this
            this.params.name = this.markName
            this.params.label_type = this.labelType(this.select_mark)
            labelApi.pageQuery(this.params, function (data) {
                console.info(data)
                self.params.totalSize = data.totalSize
                self.itemData = data.list
                self.dataLoading = false // loading隐藏
            })
        },

        /**
         * 分页页码change
         */
        handleCurrentChange(currentPage) {
            this.params.page = currentPage;
            this.pageQuery();
        },

        /**
         * 模糊查询
         */
        clickSearch () {
            this.pageQuery()
        },

        /*
         * 改变状态
         */
        changeStatus (row) {
            const self = this
            console.info(row.status)
            let params = {
                id: row.id,
                status: row.status ? 0 : 1
            }
            dialog.confirm(() => {
                labelApi.updateLabel(params, (id) => {
                    show.success('操作成功')
                    self.pageQuery()
                })
            })
        },

        /**
         * 标签类型
         */
        labelType (val) {
            if (val === '品牌') {
                return 1
            } else if (val === '门店') {
                return 2
            } else if (val === '项目') {
                return 3
            } else {
                return 4
            }
        },
        /**
         * 过滤表格标签类型
         */
        filterLabel (val) {

            if (val === 1) {
                return '品牌'
            } else if (val === 2) {
                return '门店'
            } else if (val === 3) {
                return '项目'
            } else {
                return '会员'
            }
        },

        /**
         * 增加标签
         */
        addLabel () {
            this.dialog_markName = ''
            this.dialog_select_mark = '品牌'
            this.remarkTxt = ''
            this.dialogAddVisible = true
        },

        /**
         * 修改标签
         */
        handleClick(row) {
            console.log(row);
            const data = utils.deepCopy(row)

            this.dialog_markName = data.name
            this.dialog_select_mark = this.filterLabel(data.label_type)
            this.remarkTxt = data.remark
            this.id = data.id // 增加一个id来判断修改或增加
            this.dialogAddVisible = true
        },

        /**
         * 保存-更改状态
         */
        save () {
            const self = this
            let params = {
                name: this.dialog_markName,
                label_type: this.labelType(this.dialog_select_mark),
                remark: this.remarkTxt
            }
            console.info(this.id)
            if (this.id) {
                dialog.confirm(() => {
                    params.id = self.id
                    labelApi.updateLabel(params, (id) => {
                        self.dialogAddVisible = false
                        show.success('操作成功')
                        self.pageQuery()
                    })
                })
            } else {
                dialog.confirm(() => {
                    labelApi.addLabel(params, (id) => {
                        self.dialogAddVisible = false
                        show.success('操作成功')
                        self.pageQuery()
                    })
                })
            }
            console.info(params)
        }
    }
}
</script>

<style lang="less" scoped>
    .biaoqianguanli{
        .biaoqianguanli-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
        >div:nth-of-type(2){
            margin-top: 20px;
            display: flex;
            >div{
                display: flex;
                align-items: center;
                margin-right: 40px;
                span{
                    display: inline-block;
                    width: 80px;
                    text-align: right;
                    margin-right: 10px;
                }
            }
        }
    }
</style>