<template>
    <div class="chengshi">
        <div class="chengshi-title">
             <div class="fr"><el-button type="danger" @click="dialogAddVisible=true">添加城市</el-button></div>
            <h3>城市管理</h3>
        </div>
        <div class="mt20">
            <span class="mr10">城市名称</span>
            <el-input style="width:300px" placeholder="请输入城市名称" v-model="cityName" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="itemData"
                style="width: 100%">
                <el-table-column
                    label="城市名称"
                    width="180">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="城市编号">
                    <template slot-scope="scope">
                        <span>{{ scope.row.cityNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.gmtCreated }}</span>
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
                        <el-button @click="changeStatus(scope.row, scope.$index)" type="text" size="small">关闭/启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="prev, pager, next"
                :page-size="pagesize"
                :total="total">
            </el-pagination>
        </div>

        <!-- 弹出框-城市信息 -->
        <el-dialog title="权限信息" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div>
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">城市名称</span>
                    <el-input style="width: 30%" v-model="dialog_city" placeholder="请输入城市名称"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">城市编号</span>
                    <el-input style="width: 30%" v-model="dialog_cityId" placeholder="请输入城市编号"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">经度</span>
                    <el-input style="width: 30%" v-model="dialog_longitude" placeholder="请输入经度"></el-input>
                </div>
                <div class="mt10">   
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">纬度</span>
                    <el-input style="width: 30%" v-model="dialog_latitude" placeholder="请输入纬度"></el-input>
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
                <el-button type="warning" @click="dialogAddVisible = false">确定选择</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            cityName: '', // 角色名称
            itemData: [
                // { // 表格数据
                //     city: '上海市',
                //     cityId: '0368',
                //     date: '2018-06-26  11:23:09',
                //     isOnline: true
                // }, {
                //     city: '上海市',
                //     cityId: '0369',
                //     date: '2018-06-26  11:23:09',
                //     isOnline: true
                // }
            ],
            total: 0, //默认数据总数
            currentPage: 1, // 默认开始页面
            pagesize: 10, // 每页的数据条数
            dialogAddVisible: false, // 弹出层-添加城市
            dialog_city: '', // 弹出层-城市名称
            dialog_cityId: '', // 弹出层-城市编号
            dialog_longitude: '', // 弹出层-经度
            dialog_latitude: '', // 弹出层-维度
            remarkTxt: '', // 弹出层-城市描述
        }
    },
    mounted () {
        this.getCityData(this.currentPage)
    },
    methods: {
        /**
         * 获取城市数据
         */
        getCityData (currentPage) {
            var that = this
            this.$axios.post('/api/v1/city/queryCity', {
                page: currentPage
            })
            .then(function (res) {
                console.log(res)
                that.itemData = res.data.data.list
                that.total = res.data.data.totalSize
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        handleClick(row) {
            console.log(row);
        },
        /*
         * 改变状态
         */
        changeStatus (data, idx) {
            console.info(data, idx)
            this.$confirm('此操作将改变其状态, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                data.status = !data.status
                if (data.status) {
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
            }).catch(() => {})
        },
        /**
         * 分页处理
         */
        handleSizeChange(val) {
            this.pagesize = val;
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            console.info(this.currentPage, currentPage)
            this.getCityData(this.currentPage)
        },
    }
}
</script>

<style lang="less" scoped>
    .chengshi{
        .chengshi-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
    }
</style>