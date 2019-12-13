<template>
    <div class="quyu">
        <div class="quyu-title">
             <div class="fr"><el-button type="danger" @click="dialogAddVisible=true">添加区域</el-button></div>
            <h3>城市区域</h3>
        </div>
        <div>
            <div>
                <span>所属城市</span>
                <el-select class="flex-8" v-model="select_region">
                    <el-option
                    v-for="item in regionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>区域名称</span>
                <el-input placeholder="请输入区域名称" v-model="regionName" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="itemData"
                style="width: 100%">
                <el-table-column
                    label="区域名称(编号)"
                    width="180">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.row.region }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="所属区域">
                    <template slot-scope="scope">
                        <span>{{ scope.row.regionBlog }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="所属城市">
                    <template slot-scope="scope">
                        <span>{{ scope.row.city }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.date}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.isOnline ? '已启用' : '关闭'}}</span>
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
                layout="prev, pager, next"
                :total="1000">
            </el-pagination>
        </div>

        <!-- 弹出框-城市区域 -->
        <el-dialog title="权限信息" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div>
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">区域名称</span>
                    <el-input style="width: 30%" v-model="dialog_regionName" placeholder="请输入区域名称"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">区域编号</span>
                    <el-input style="width: 30%" v-model="dialog_regionId" placeholder="请输入区域编号"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">所属城市</span>
                    <el-select class="flex-8" v-model="dialog_select_region">
                        <el-option
                        v-for="item in dialog_regionList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">所属城市</span>
                    <el-select class="flex-8" v-model="dialog_select_regionBlog">
                        <el-option
                        v-for="item in dialog_regionBlogList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
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
            select_region: '全部', // 默认选择城市
            regionList: [{
                value: '全部',
                label: '全部'
            }, {
                value: '上海市',
                label: '上海市'
            }, {
                value: '北京市',
                label: '北京市'
            }],
            regionName: '', // 城市名称
            itemData: [{ // 表格数据
                region: '长宁区(1001)',
                regionBlog: '长宁区',
                city: '上海市',
                date: '2018-06-26  11:23:09',
                isOnline: true
            }, {
                region: '长宁区(1001)',
                regionBlog: '长宁区',
                city: '上海市',
                date: '2018-06-26  11:23:09',
                isOnline: true
            }],
            dialogAddVisible: false, // 弹出层-添加城市
            dialog_regionName: '', // 弹出层-城市名称
            dialog_regionId: '', // 弹出层-城市编号
            dialog_select_region: '', // 弹出层-所属城市
            dialog_regionList: [{
                value: '上海市',
                label: '上海市'
            }, {
                value: '北京市',
                label: '北京市'
            }],
            dialog_select_regionBlog: '', // 弹出层-所属区域
            dialog_regionBlogList: [{
                value: '长宁区',
                label: '长宁区'
            }, {
                value: '徐汇区',
                label: '徐汇区'
            }],
            dialog_longitude: '', // 弹出层-经度
            dialog_latitude: '', // 弹出层-维度
            remarkTxt: '', // 弹出层-城市描述
        }
    },
    methods: {
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
                data.isOnline = !data.isOnline
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
            }).catch(() => {})
        },
        /**
         * 弹出层-权限类型选择
         */
        handleCheckedregionsChange (val) {
            console.info(val)
        }
    }
}
</script>

<style lang="less" scoped>
    .quyu{
        .quyu-title{
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