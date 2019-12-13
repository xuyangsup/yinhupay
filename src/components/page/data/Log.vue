<template>
    <div class="shujujiance">
        <div class="shujujiance-title">
            <h3>数据监控</h3>
        </div>
        <!-- 时间分类 -->
        <div class="select-time">
            <span>时间分类：</span>
            <ul>
                <li :class="{active : timeTypeIdx === index}"
                v-for="(item, index) in timeType"
                :key="index" @click="timeTypeIdx = index">
                    <el-button type="text">{{item.type}}</el-button>
                </li>
            </ul>
            <div v-show="timeTypeIdx === 4">
                <el-date-picker
                v-model="selectTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                >
                </el-date-picker>
            </div>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="itemData"
                style="width: 100%">
                <el-table-column
                    label="操作内容">
                    <template slot-scope="scope">
                        <span>{{ scope.row.content }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.date}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作人">
                    <template slot-scope="scope">
                        <span>{{scope.row.operater}}</span>
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

        <!-- 不知道干什么的！先注释！ -->
        <div class="storeDataInfo" v-show="false">
            <el-row :gutter="10">
                <el-col :span="4">
                    <ul class="storeData">
                        <li :class="{active : storeDataAcIdx === index}" @click="handleClickStore(index)" v-for="(item, index) in storeData" :key="item.name">
                            <el-button type="text">{{item.name}}</el-button>
                        </li>
                    </ul>
                </el-col>
                <el-col :span="20">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="基本信息" name="first">
                            {{storeBasicInfo}}
                        </el-tab-pane>
                        <el-tab-pane label="房间" name="second">
                            {{storeRoom}}
                        </el-tab-pane>
                        <el-tab-pane label="服务项目" name="third">
                            {{storeItem}}
                        </el-tab-pane>
                        <el-tab-pane label="门店图片" name="fourth">
                            {{sotreImg}}
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            timeTypeIdx: 0, // 时间分类默认下标
            timeType: [ // 时间分类
                {type: '今天'},
                {type: '昨天'},
                {type: '本月'},
                {type: '上月'},
                {type: '自定义'}
            ],
            pickerOptions: { // 时间选择
                shortcuts: [{
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            selectTime: '', // 默认选中时间
            itemData: [{ // 表格数据
                content: '进行订单100898209的修改，修改内容：123',
                date: '2018-06-26 11:23:09',
                operater: 'xuyang'
            }, {
                content: '进行订单100898209的修改，修改内容：123',
                date: '2018-06-26 11:23:09',
                operater: 'xuyang'
            }],

            storeData: [ // 门店数据
                {name: '天山店1'},
                {name: '天山店2'},
                {name: '天山店3'},
                {name: '天山店4'},
                {name: '天山店5'}
            ],
            storeDataAcIdx: 0, // 门店数据-默认下标
            activeName: 'first', // tab-默认下标
            storeBasicInfo: '基本信息', // 基本信息
            storeRoom: '房间', // 房间
            storeItem: '服务项目', // 服务项目
            sotreImg: '门店图片', // 门店图片
        }
    },
    methods: {
        /**
         * 点击门店
         */
        handleClickStore (index) {
            this.storeDataAcIdx = index
            this.activeName = 'first'
            // 略
        },
        handleClick(tab, event) {
            console.log(tab, event)
        }
    }
}
</script>

<style lang="less" scoped>
    .shujujiance{
        .shujujiance-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
        >div:nth-of-type(2){
            display: flex;
            margin-top: 20px;
        }
        // 选择时间
        .select-time{
            margin: 20px 0 10px;
            display: flex;
            align-items: center;
            ul{
                // flex: 1;
                li{
                    float: left;
                    button{
                        color: #333;
                        padding: 10px 5px;
                        margin: 0 5px;
                    }
                }
                li.active{
                    button{
                        color: #f63;
                    }
                }
            }
        }
        .storeDataInfo{
            border: 1px solid #f2f2f2;
            .storeData{
                padding-top: 20px;
                border-right: 1px solid #f2f2f2;
                text-align: center;
                li{
                    padding: 5px 0;
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
        }
    }
</style>