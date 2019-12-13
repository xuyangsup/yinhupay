<template>
    <div class="quanxian">
        <div class="quanxian-title">
             <div class="fr"><el-button type="danger" @click="dialogAddVisible=true">添加权限</el-button></div>
            <h3>权限管理</h3>
        </div>
        <div>
            <div>
                <span>权限类型</span>
                <el-select class="flex-8" v-model="select_power">
                    <el-option
                    v-for="item in powerList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>权限名称</span>
                <el-input placeholder="请输入权限名称" v-model="powerName" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="items"
                style="width: 100%">
                <el-table-column
                    label="权限名称"
                    width="240">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="权限路径">
                    <template slot-scope="scope">
                        <span>{{ scope.row.path }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="权限编号">
                    <template slot-scope="scope">
                        <span>{{ scope.row.code }}</span>
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
                        <span>{{scope.row.status == 1 ? '已启用' : '关闭'}}</span>
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
                @current-change="handleCurrentChange"
                :page-size="params.pageSize"
                :total="params.totalSize">
            </el-pagination>
        </div>

        <!-- 弹出框-权限信息 -->
        <el-dialog title="权限信息" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div>
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">权限名称</span>
                    <el-input style="width: 30%" v-model="power.name" placeholder="请输入角色名称"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">权限编号</span>
                    <el-input style="width: 30%" v-model="power.code" placeholder="请输入角色名称"></el-input>
                </div>
                <!--<div class="mt10" style="display:flex">-->
                    <!--<span style="width: 12%; display: inline-block; text-align: right;margin-right:14px">权限类型</span>-->
                    <!--<el-checkbox-group -->
                        <!--v-model="checkedPowers"-->
                        <!--@change="handleCheckedPowersChange">-->
                        <!--<el-checkbox v-for="power in powers" :label="power" :key="power">{{power}}</el-checkbox>-->
                    <!--</el-checkbox-group>-->
                <!--</div>-->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">URL</span>
                    <el-input style="width: 30%" v-model="power.path" placeholder="请输入角色编号"></el-input>
                </div>
                <!-- 描述 -->
                <div class="mt10" style="display: flex">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">权限描述</span>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="如需描述，请输入"
                        v-model="power.remark">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="warning" @click="clickAddPower">确定选择</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import powerApi from '@/api/power/power'
    import dialog from '@/common/dialog'
    import show from '@/common/show'
    import utils from '@/common/utils'

    const powerOptions = ['菜单权限', '操作权限', '数据权限']
    export default {
        data() {
            return {
                params: {
                    page: 1,
                    pageSize: 10
                },
                power: {
                    name: '',
                    code: '',
                    path: '',
                    remark: ''
                },
                items: [],
                select_power: '全部', // 默认选择部门
                powerList: [{
                    value: '全部', label: '全部'
                }, {
                    value: '菜单权限', label: '菜单权限'
                }, {
                    value: '数据权限', label: '数据权限'
                }, {
                    value: '操作权限', label: '操作权限'
                }],
                powerName: '', // 角色名称
                dialogAddVisible: false, // 弹出层-添加权限
                dialog_powerName: '', // 弹出层-权限名称
                dialog_powerId: '', // 弹出层-权限编号
                checkedPowers: [], // 弹出层-选中权限类型
                powers: powerOptions, // 弹出层-权限类型
                dialog_powerUrl: '', // 弹出层-URL
                remarkTxt: '', // 弹出层-权限描述
            }
        },

        mounted() {
            this.pageQuery()
        },
        methods: {
            pageQuery() {
                const self = this
                powerApi.pageQuery(this.params, (data) => {
                    self.items = data.list
                    self.params.totalSize = data.totalSize
                })
            },
            handleClick(row) {
                console.log(row);
            },
            changeStatus(data, idx) {
                console.info(data, idx)
                this.$confirm('此操作将改变其状态, 是否继续?', '提示', {
                    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
                }).then(() => {
                    data.isOnline = !data.isOnline
                    if (data.isOnline) {
                        this.$message({
                            message: '恭喜你，该规则已上线！', type: 'success'
                        });
                    } else {
                        this.$message({
                            message: '注意，该规则已下线！', type: 'warning'
                        });
                    }
                }).catch(() => {
                })
            },
            handleCheckedPowersChange(val) {
                console.info(val)
            },
            clickAddPower() {
                const self = this
                dialog.confirm(() => {
                  powerApi.insert(self.power, (data) => {
                      show.success('操作成功')
                      self.pageQuery()
                  })
                })
            },
            handleCurrentChange(currentPage) {
                this.params.page = currentPage;
                this.pageQuery();
            },
        }
    }
</script>

<style lang="less" scoped>
    .quanxian{
        .quanxian-title{
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
