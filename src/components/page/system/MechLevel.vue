<template>
    <div class="jishidengji">
        <div class="jishidengji-title">
             <div class="fr"><el-button type="danger" @click="dialogAddVisible=true">添加等级</el-button></div>
            <h3>技师等级</h3>
        </div>
        <div>
            <div>
                <span>所属品牌</span>
                <el-select class="flex-8" v-model="select_brand">
                    <el-option
                    v-for="item in brandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>技师等级</span>
                <el-input placeholder="请输入技师等级" v-model="mechLevel" class="input-with-select">
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
                    label="序号"
                    width="180">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.row.sort }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="技师等级">
                    <template slot-scope="scope">
                        <span>{{ scope.row.mechLevel }}</span>
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

        <!-- 弹出框-技师 -->
        <el-dialog title="技师来源" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div>
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">等级名称</span>
                    <el-input style="width: 30%" v-model="dialog_mechLevel" placeholder="请输入等级名称"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">等级编号</span>
                    <el-input style="width: 30%" v-model="dialog_mechLevelNum" placeholder="请输入等级编号"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">所属品牌</span>
                    <el-select class="flex-8" v-model="dialog_select_brand">
                        <el-option
                        v-for="item in dialog_brandList"
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
                <el-button type="warning" @click="dialogAddVisible = false">确定选择</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            select_brand: '考拉时光1', // 默认选择品牌
            brandList: [ {
                value: '考拉时光1',
                label: '考拉时光1'
            }, {
                value: '考拉时光2',
                label: '考拉时光2'
            }],
            mechLevel: '', // 技师名称
            itemData: [{ // 表格数据
                sort: '1',
                mechLevel: '普通技师',
                date: '2018-06-26 11:23:09',
                isOnline: true
            }, {
                sort: '2',
                mechLevel: '高级技师',
                date: '2018-06-26 11:23:09',
                isOnline: true
            }],
            dialogAddVisible: false, // 弹出层-添加技师
            dialog_mechLevel: '', // 弹出层-技师名称
            dialog_mechLevelNum: '', // 弹出层-技师编号
            dialog_select_brand: '', // 弹出层-默认选择品牌
            dialog_brandList: [ {
                value: '考拉时光1',
                label: '考拉时光1'
            }, {
                value: '考拉时光2',
                label: '考拉时光2'
            }],
            remarkTxt: '', // 弹出层-技师描述
        }
    },
    methods: {
        handleClick(row) {
            console.log(row);
            this.dialogAddVisible = true
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
        handleCheckedmechsChange (val) {
            console.info(val)
        }
    }
}
</script>

<style lang="less" scoped>
    .jishidengji{
        .jishidengji-title{
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