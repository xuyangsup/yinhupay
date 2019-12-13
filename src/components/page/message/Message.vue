<template>
    <div class="xiaoxizhongxin">
        <div class="xiaoxizhongxin-title">
            <h3>消息中心</h3>
        </div>
        <div class="xiaoxizhongxin-container">
            <div>
                <span>品牌</span>
                <el-select v-model="select_brand" placeholder="选择品牌" class="handle-select mr10">
                    <el-option
                    v-for="item in brandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <ul>
                <li :class="{active : storeIndex === index}"
                v-for="(item,index) in storeList"
                :key="index" @click="clickStore(index)">
                    <el-button size="mini" plain>{{item.storeName}}</el-button>
                </li>
            </ul>
        </div>
        <div class="mt20">
            <span class="mr10">消息查询</span>
            <el-input style="width:300px" placeholder="输入消息内容/关键字" v-model="newsSearch">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div class="mt20">
            <!-- 菜单状态 -->
            <el-menu
                :default-active="menuStatusIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#ccc"
                text-color="#fff"
                active-text-color="#f63">
                <el-menu-item index="1">消息设置</el-menu-item>
                <el-menu-item index="2">已接收消息</el-menu-item>
            </el-menu>
        </div>
        <div v-show="menuStatusIndex==='1'" class="mt10" style="overflow: hidden"><el-button class="fr" type="danger" @click="dialogAddVisible=true">新增设置</el-button></div>

        <!-- 表格数据-消息设置 -->
        <div class="mt10" v-if="menuStatusIndex==='1'">
            <el-table
                class="tableElse"
                :data="itemData"
                style="width: 100%">
                <el-table-column
                    label="消息内容 "
                    width="240">
                    <template slot-scope="scope">
                        <span>{{ scope.row.content }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="消息替换符">
                    <template slot-scope="scope">
                        <span>{{ scope.row.newsStr }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="消息编号">
                    <template slot-scope="scope">
                        <span>{{ scope.row.newsNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="消息类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.newsType}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>
                        <el-switch
                            v-model="scope.row.isOnline"
                            active-text="启用"
                            inactive-text="关闭"
                            active-color="#13ce66"
                            inactive-color="#ccc"
                            @change="changeRuleStatus(scope.row, scope.$index)">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </div>
        </div>
        <!-- 已接收消息 -->
        <div v-else class="received-msg">
            <div>
                <h3 class="fl">未读消息</h3>
                <ul class="fl">
                    <li v-for="(item, index) in unreadList" :key="index" @click="showMsgContent">{{ item.content }}</li>
                </ul>
            </div>
            <div>
                <h3 class="fl">已读消息</h3>
                <ul class="fl">
                    <li v-for="(item, index) in readList" :key="index" @click="showMsgContent">{{ item.content }}</li>
                </ul>
            </div>
        </div>

        <!-- 弹出框-消息设置 -->
        <el-dialog title="消息设置" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <!-- 消息内容 -->
                <div class="mt10" style="display: flex">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">消息内容</span>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="请输入消息内容"
                        v-model="dialog_newsContent">
                    </el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">消息类型</span>
                    <el-select class="flex-8" v-model="dialog_select_newsType">
                        <el-option
                        v-for="item in dialog_newsTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">替换符</span>
                    <el-input style="width: 30%" v-model="dialog_newsStr" placeholder="请输入替换符"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">消息编号</span>
                    <el-input style="width: 30%" v-model="dialog_newsNum" placeholder="请输入消息编号"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="warning" @click="dialogAddVisible = false">确定选择</el-button>
            </span>
        </el-dialog>
        
        <!-- 弹出框-消息详情 -->
        <el-dialog title="消息详情" :visible.sync="dialogMsgDetailVisible" :close-on-click-modal="false">
            <div>{{ dialog_msgContentDetail }}</div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            select_brand: '考拉时光1', // 默认选择品牌
            brandList: [{
                value: '考拉时光1',
                label: '考拉时光1'
            }, {
                value: '考拉时光2',
                label: '考拉时光2'
            }],
            storeList: [
                {storeName: '天山店1'},
                {storeName: '天山店2'},
                {storeName: '天山店3'},
                {storeName: '天山店4'},
            ],
            storeIndex: 0, // 默认门店下标
            newsSearch: '', // 消息查询
            menuStatusIndex: '1', // 菜单状态-默认下标
            itemData: [{ // 表格数据
                content: '内容内容内容内容内容内容1',
                newsStr: '###',
                newsNum: '1001',
                newsType: '短信',
                isOnline: true
            }, {
                content: '内容内容内容内容内容内容2',
                newsStr: '###',
                newsNum: '1001',
                newsType: 'web',
                isOnline: true
            }],

            dialogAddVisible: false, // 弹出层-消息设置
            dialog_newsContent: '', // 弹出层-消息设置-消息内容
            dialog_select_newsType: '', // 弹出层-默认选择消息类型
            dialog_newsTypeList: [{
                value: '短信',
                label: '短信'
            }, {
                value: 'web',
                label: 'web'
            }, {
                value: '微信',
                label: '微信'
            }],
            dialog_newsStr: '', // 弹出层-消息设置-替换符
            dialog_newsNum: '', // 弹出层-消息设置-消息编号

            unreadList: [ // 未读消息
                {content: '未读消息内容1'},
                {content: '未读消息内容2'}
            ],
            readList: [ // 已读消息
                {content: '已读消息内容1'},
                {content: '已读消息内容2'}
            ],

            dialogMsgDetailVisible: false, // 弹出层-消息详情
            dialog_msgContentDetail: '内容详情12346579'
        }
    },
    methods: {
        /**
         * 菜单状态切换
         */
        handleSelect(key, keyPath) {
            this.menuStatusIndex = key
            // console.log(key, keyPath)
            console.log(key)
        },
        handleClick(row) {
            console.log(row);
        },
        /*
         * 改变规则状态
         */
        changeRuleStatus (data, idx) {
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
         * 消息详情 
         */
        showMsgContent () {
            this.dialogMsgDetailVisible = true
        }
    }
}
</script>

<style lang="less" scoped>
    .xiaoxizhongxin{
        .xiaoxizhongxin-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
        .xiaoxizhongxin-container{
            padding: 10px 0 0 20px;
            >div:nth-of-type(1){
                padding-left: 50px;
                position: relative;
                span{
                    position: absolute;
                    left: 10px;
                    top: 5px;
                }
            }
            >ul{
                padding-left: 50px;
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
        .tableElse{
            border: 1px solid #f2f2f2;
            border-bottom: 1px solid transparent;
        }
        // 已接收消息
        .received-msg{
            border: 1px solid #ccc;
            border-top: 0 none;
            >div:nth-of-type(1),>div:nth-of-type(2){
                overflow: hidden;
                border-bottom: 1px solid #ccc;
                h3{
                    padding: 10px 20px;
                }
                ul{
                    border-left: 1px solid #ccc;
                    li{
                        padding: 0px 20px;
                        margin: 10px 0;
                        cursor: pointer;
                    }
                }
            }
            >div:nth-of-type(2){
                border-bottom: 0 none;
            }
        }
    }
</style>