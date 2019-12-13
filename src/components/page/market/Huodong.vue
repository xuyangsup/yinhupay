<template>
    <div class="huodong">
        <div class="huodong-title">
            <div class="fr">
                <el-button @click="dialogAcRuleVisible = true" type="danger">添加规则</el-button>
            </div>
            <h3>活动策略</h3>
        </div>
        <!-- 时间分类 -->
        <div class="select-time">
            <span>时间分类：</span>
            <ul>
                <li :class="{active : timeTypeIdx === index}"
                v-for="(item, index) in timeType"
                :key="index" @click="clickTimeType(index)">
                    <el-button type="text">{{item.type}}</el-button>
                </li>
            </ul>
            <div v-show="timeTypeIdx === 5">
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
        <!-- 活动类型 -->
        <div>
            <span>活动类型：</span>
            <ul>
                <li :class="{active : activityIdx === index}"
                v-for="(item, index) in activityType"
                :key="index" @click="clickactivityType(index)">
                    <el-button type="text">{{item.type}}</el-button>
                </li>
            </ul>
        </div>
        <!-- 规则查询 -->
        <div>
            <span>规则查询：</span>
            <el-input style="width:300px" placeholder="输入规则名称\关键字" v-model="ruleSearch">
                <el-button slot="append" icon="el-icon-search" @click="pageQuery()"></el-button>
            </el-input>
        </div>
        <!-- 活动表格数据 -->
        <div class="tableData">
            <el-table
                :data="ruleData"
                style="width: 100%">
                <el-table-column
                    label="规则名称"
                    width="300">
                    <template slot-scope="scope">
                        <div class="activityInfo">
                            <div class="activityImg">
                                <img :src="scope.row.src" alt="">
                            </div>
                            <div>
                                <span>{{ scope.row.name }}</span><br>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.gmtCreated }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="规则类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="规则描述">
                    <template slot-scope="scope">
                        <span>{{scope.row.content}}---------{{scope.row.status}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">详情</el-button>
                        <el-switch
                            v-model="scope.row.status"
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

        <!-- 弹出框-添加活动规则 -->
        <el-dialog title="活动规则" :visible.sync="dialogAcRuleVisible">
            <div class="dialog-content">
                <!-- 规则名称 -->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">活动标题</span>
                    <el-input style="width: 50%" v-model="activity.name"></el-input>
                </div>
                <!-- 优惠类型 -->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">优惠类型</span>
                    <ul>
                        <li :class="{active : preferentialTypeIdx === index}"
                        v-for="(item,index) in preferentialTypeList"
                        :key="index" @click="clickPreferentialType(index)">
                            <el-button size="mini" plain>{{item.name}}</el-button>
                        </li>
                    </ul>
                </div>
                <!-- 消费金额 -->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">消费金额</span>
                    <el-input style="width: 10%" v-model="activity.originalPrice"></el-input>
                    <span>元</span>
                </div>
                <!-- 优惠金额 -->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">优惠金额</span>
                    <el-input style="width: 10%" v-model="activity.lowestPrice"></el-input>
                    <!-- <span class="mr10">{{ discountmoneyType === '1' ? '元' : '%' }}</span>
                    <template>
                        <el-radio v-model="discountmoneyType" label="1">固定金额</el-radio>
                        <el-radio v-model="discountmoneyType" label="2">百分比</el-radio>
                    </template> -->
                </div>
                <!-- 有效期 -->
                <div class="mt10" style="min-height: 32px;display: flex;align-items: center;">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">有效期</span>
                    <!-- <span style="display: inline-block;" class="mr10">
                        <el-radio v-model="validityDateType" label="1">与活动同步</el-radio>
                        <el-radio v-model="validityDateType" label="2">自定义</el-radio>
                    </span> -->
                    <el-date-picker
                        v-model="selectTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                       >
                    </el-date-picker>
                </div>
                <!-- 规则描述 -->
                <div class="mt10" style="display: flex">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">规则描述</span>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="如需描述，请输入"
                        v-model="activity.content">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAcRuleVisible = false">取 消</el-button>
                <el-button type="warning"  @click="save">确定选择</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import huodongApi from "@/api/huodong";
import moment from "moment";
import utils from "@/common/utils";
import { OSS_URL } from "@/api/constant";
import show from "@/common/show";
export default {
  data() {
    return {
      timeTypeIdx: 0, // 时间分类默认下标
      timeType: [
        // 时间分类
        { type: "不限" },
        { type: "今天" },
        { type: "昨天" },
        { type: "本月" },
        { type: "上月" },
        { type: "自定义" }
      ],
      pickerOptions: {
        // 时间选择
        shortcuts: [
          {
            text: "最近一个月",
            onClick(picker) {  
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      selectTime: "", // 默认选中时间-输出数组 
      activityIdx: 0, // 默认活动类型下标
      activityType: [
        { type: "不限" },
        { type: "砍价" },
        { type: "拼团" },
        { type: "老带新" },
        { type: "优惠券" },
        { type: "新用户专享" }
      ],
     
      ruleSearch: "", // 规则查询
      params: {
        // id: 0,
        selectType: 0,
        name: null,
        type: null,
        originalPrice: null,
        lowestPrice: null,
        stock: null,
        soldStock: null,
        remainStock: null,
        startTime: null,
        endTime: null,
        page: 0,
        pageSize: 10,
        totalSize: 10
      },
      activity: {
         
        name: null,
        type: null,
        originalPrice: null,
        lowestPrice: null,
        stock: null,
        soldStock: null,
        remainStock: null,
        startTime: null,
        endTime: null,
        selectTime:null,
        content:null,
        status:0
         
      },

      ruleData: [
        {
          // 规则数据
          activityName: "新用户注册专享1",
          orderId: 10440170922312,
          starTime: "2016-05-02",
          type: "新用户",
          detail: "优惠描述描",
          isOnline: true
        },
        {
          activityName: "新用户注册专享2",
          orderId: 10440170922312,
          starTime: "2016-05-02",
          type: "砍价",
          detail: "优惠描述描",
          isOnline: false
        }
      ],
      dialogAcRuleVisible: false, // 弹出层
      activityName: "", // 弹出层-活动名称
      preferentialTypeList: [
        // 弹出层-优惠类型
       
        { name: "砍价" },
        { name: "拼团" },
        { name: "老带新" },
        { name: "优惠券" },
        { name: "新用户专享" }
      ],
      preferentialTypeIdx: 0, // 弹出层-优惠类型-index
      monetary: "", // 弹出层-消费金额
      discountmoney: "", // 弹出层-优惠金额
      discountmoneyType: "1", // 弹出层-优惠金额-类型
      validityDateType: "1", // 弹出层-有效期-类型
      validityDateDefine: "", // 弹出层-有效期-自定义日期
      remarkTxt: "" // 弹出层-规则描述
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    selectTime(newVal, oldVal) {
      console.log(newVal);
      this.pageQuery();
    }
  },
  methods: {
    /*
         * 规则详情
         */
    handleClick(row) {
      console.log(row);

      this.activ = utils.deepCopy(row);
      
      this.activity.name = this.activ.name;
     
     
     //this.activity.preferentialTypeIdx = this.activ.type;
      
      this.activity.content = this.activ.content;
      this.activity.id = this.activ.id;
      this.activity.originalPrice = this.activ.originalPrice;
      this.activity.lowestPrice = this.activ.lowestPrice;
     this.selectTime = this.activ.startTime;
      this.dialogAcRuleVisible = true;
      this.preferentialTypeIdx =parseInt(this.activ.type)-1;
     this.activity.status = this.activ.status;
      this.selectTime=[this.activ.startTime, this.activ.endTime];
    },
    pageQuery() {
      const self = this;
      this.params.selectType = this.timeTypeIdx;
      if(this.ruleSearch == ''){
        
         this.params.name=null;
      }else{
        this.params.name=this.ruleSearch;
      }
       
     if(this.timeTypeIdx == '5'){
        if (this.selectTime) {
        this.params.startTime =moment(this.selectTime[0], 'YYYY-MM-DD HH:mm:ss').valueOf();
         
        // moment(this.selectTime[0]).format("YYYY-MM-DD");

        this.params.endTime = moment(this.selectTime[1], 'YYYY-MM-DD HH:mm:ss').valueOf();
        //moment(this.selectTime[1]).format("YYYY-MM-DD");
      }
     }else{
         
        this.params.startTime = null;

        this.params.endTime = null;
       
     }
    
      huodongApi.pageQueryRule(self.params, data => {
        for (var t = 0; t < data.list.length; t++) {
          data.list[t].gmtCreated = moment(data.list[t].gmtCreated).format(
            "YYYY-MM-DD HH:mm"
          );

          if (data.list[t].type == "1") {
            data.list[t].type1 = "砍价";
          } else if (data.list[t].type == "2") {
            data.list[t].type1 = "拼团";
          } else if (data.list[t].type == "3") {
            data.list[t].type1 = "老带新";
          } else if (data.list[t].type == "4") {
            data.list[t].type1 = "优惠券";
          } else if (data.list[t].type == "5") {
            data.list[t].type1 = "新用户专享";
          }
          if(data.list[t].status ==0){
              data.list[t].status=false;
          }else{
             data.list[t].status=true;
          }
         // data.list[t].status=0;
        }
        self.ruleData = data.list;
        self.params.page = data.page;

        self.params.totalSize = data.totalSize;
      });
    },
    //查询活动
    queryhuodong() {
      this.pageQuery();
    },
    init() {
      this.queryhuodong();
    },
    /**
     * 分页页码change
     */
    handleCurrentChange(currentPage) {
      this.params.page = currentPage;
      this.pageQuery();
    },
    clickTimeType(index) {
      this.timeTypeIdx = index;

      if (index != 5) {
        this.pageQuery();
      }
    },
    clickactivityType(index) {
      if(index == 0){
        this.params.type = null;
      }else{
        this.params.type = index;
      }
      
       this.activityIdx=index;
       this.pageQuery();
    },
    save: function() {
      const self = this;
        
      if (self.activity.id) {
      
        if(self.activity.status == true){
             show.error("请先下线活动");
              
             self.dialogAcRuleVisible = false;
             return false;

        }else{
          self.activity.status=0;
        }
      
         this.activity.type=this.preferentialTypeIdx+1;
        self.activity.startTime= moment(this.selectTime[0], 'YYYY-MM-DD HH:mm:ss').valueOf();
         self.activity.endTime= moment(this.selectTime[1], 'YYYY-MM-DD HH:mm:ss').valueOf();
        huodongApi.updateRule(self.activity, function(data) {
          self.dialogAcRuleVisible = false;
            show.success("更新成功");
          self.pageQuery();
        });
      } else {
        // self.notice.content = this.content.replace(/\"/g, "'");
        
        if(this.selectTime== ''){
           
           show.success('有效期不能为空');
          return false;
        }
         self.activity.type = this.preferentialTypeIdx;
        self.activity.startTime= moment(this.selectTime[0], 'YYYY-MM-DD HH:mm:ss').valueOf();
         self.activity.endTime= moment(this.selectTime[1], 'YYYY-MM-DD HH:mm:ss').valueOf();
         self.activity.selectTime=null;
        huodongApi.insertRule(self.activity, function(data) {
          self.dialogAcRuleVisible = false;
          self.pageQuery();
          // self.notice = self.defaultwechant();
        });
      }
    },
    /*
         * 改变规则状态
         */
    changeRuleStatus(data, idx) {
      console.info(data, idx);
      this.activ = utils.deepCopy(data);
       
      if(this.activ.status){
          this.activity.status=1;
      }else{
        this.activity.status=0;
      }
      this.activity.name = this.activ.name;
     
     
     //this.activity.preferentialTypeIdx = this.activ.type;
      
      this.activity.content = this.activ.content;
      this.activity.id = this.activ.id;
      this.activity.originalPrice = this.activ.originalPrice;
      this.activity.lowestPrice = this.activ.lowestPrice;
       this.activity.startTime=this.activ.startTime;
       this.activity.endTime=this.activ.endTime;
       this.activity.type=this.activ.type;
    huodongApi.updateRule(this.activity, function(data) {
          
        });
    
      if (data.status) {
        this.$message({
          message: "恭喜你，该规则已上线！",
          type: "success"
        });
      } else {
        this.$message({
          message: "注意，该规则已下线！",
          type: "warning"
        });
      }
    },
    /*
         * 弹出层-优惠类型-点击
         */
    clickPreferentialType(index) {
      this.preferentialTypeIdx = index;
      
      this.activity.type = index+1;
      
    }
  }
};
</script>

<style lang="less" scoped>
.huodong {
  .huodong-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  // 选择时间
  .select-time {
    margin: 20px 0 10px;
    display: flex;
    align-items: center;
    ul {
      // flex: 1;
      li {
        float: left;
        button {
          color: #333;
          padding: 10px 5px;
          margin: 0 5px;
        }
      }
      li.active {
        button {
          color: #f63;
        }
      }
    }
  }
  // 活动类型
  > div:nth-of-type(3) {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    ul {
     // flex: 1;
      li {
        float: left;
        button {
          color: #333;
          padding: 10px 5px;
          margin: 0 5px;
        }
      }
      li.active {
        button {
          color: #f63;
        }
      }
    }
  }
  // 表格
  .tableData {
    margin-top: 30px;
    border: 1px solid #f2f2f2;
    border-bottom: 1px solid transparent;
  }
  // 分页
  .pagination {
    text-align: center;
    padding: 20px 0;
  }

  // 弹出层
  .dialog-content {
    > div:nth-of-type(2) {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      > ul {
        // flex: 1;
        margin-left: 5px;
        overflow: hidden;
        li {
          margin-top: 10px;
          margin-right: 10px;
          float: left;
        }
        li.active button {
          border: 1px solid #409eff;
        }
      }
    }
  }
}
</style>