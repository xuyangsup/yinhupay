<template>
  <div class="jishi">
    <div class="jishi-title">
      <h3>储值统计</h3>
    </div>
    <div class="select-time">
      <span class="mr10">手机号查询</span>
      <el-input style="width:300px" placeholder="输入会员电话" v-model="vipSearch">
        <el-button slot="append" icon="el-icon-search" @click="searchVip"></el-button>
      </el-input>
    </div>
    <div class="select-time">
      <span>时间分类：</span>
      <ul>
        <li
          :class="{active : timeTypeIdx === index}"
          v-for="(item, index) in timeType"
          :key="index"
          @click="timeTypeIdx = index"
        >
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
        ></el-date-picker>
      </div>
      <div>
        <span slot="footer" class="dialog-footer" style="margin-left: 10px">
          <el-button type="danger" @click="pageQuery">查询</el-button>
        </span>
      </div>
      <div class="export" style="right: 20px; top: 70px; z-index: 100; position: absolute;">
        <span>导出报表：</span>
        <el-button type="text" @click="exportChuZhi">储值统计</el-button>
      </div>
    </div>
    <div>
      <span>总充值金额：{{totalRealPayAmount}}</span>
      <span style="padding-left:20px;">总赠送金额：{{totalDonationAmount}}</span>
      <span style="padding-left:20px;">总余额：{{totalBalance}}</span>
    </div>
    <!-- 表格数据 -->
    <div class="tableData">
      <el-table :data="mechData" style="width: 100%">
        <el-table-column label="姓名" width="80">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.memberDTO.userNickName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="卡号">
          <template slot-scope="scope">
            <span>{{ scope.row.memberDTO.userNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.memberDTO.userMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="充值金额">
          <template slot-scope="scope">
            <span>{{ scope.row.memberDTO.realPayAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="赠送金额">
          <template slot-scope="scope">
            <span>￥{{ scope.row.memberDTO.donationAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额">
          <template slot-scope="scope">
            <span>￥{{ scope.row.memberDTO.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
            <!-- <el-button type="text" size="small">更多</el-button> -->
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
        :total="params.totalSize"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import indexApi from "@/api/index";
import mechApi from "@/api/mech/mech";
import chuzhiApi from "@/api/chuzhi";
import moment from "moment";

export default {
  data() {
    return {
      brandData: [],
      brandId: null, // 默认选择品牌
      brandList: [],
      shopList: [],
      shopId: null, // 默认门店下标
      timeTypeIdx: 0, // 时间分类默认下标
      params: {
        selectType: 1,
        userNo: null,
        userMobile: null,
        userNo: null /** 会员编号 **/,
        userId: null /** 会员Id **/,
        pageNum: 1,
        page: 1,
        pageSize: 10,
        totalSize: 0
      },
      totalRealPayAmount: 0,
      totalDonationAmount: 0,
      totalBalance: 0,
      mechData: [],
      vipSearch: "",
      timeType: [
        // 时间分类
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
      selectTime: "" // 默认选中时间
    };
  },
  mounted() {
    let self = this;
    self.pageQuery();
  },
  watch: {
    brandId(newVal, oldVal) {
      let self = this;
      self.shopId = 0;
      if (newVal == 0) {
        let shopList = [];
        shopList.push({
          id: 0,
          name: "全部"
        });

        self.brandData.forEach(brand => {
          brand.shopList.forEach(shop => {
            shopList.push(shop);
          });
        });
        self.shopList = shopList;
      } else {
        let shopList = [];
        shopList.push({
          id: 0,
          name: "全部"
        });
        self.brandData.forEach(brand => {
          if (brand.id == newVal) {
            brand.shopList.forEach(shop => {
              shopList.push(shop);
            });
          }
        });
        self.shopList = shopList;
      }
      this.refreshParams();
      this.pageQuery();
    },
    shopId(newId, oldId) {
      this.pageQuery();
    },
    timeTypeIdx() {
      let self = this;
      if (self.timeTypeIdx + 1 != 5) {
        this.pageQuery();
      }
    },
    selectTime(newVal, oldVal) {
      console.log(newVal);
      this.pageQuery();
    }
  },
  methods: {
    clickStore(shopId) {
      this.shopId = shopId;
    },
    exportChuZhi() {
      let self = this;
      chuzhiApi.exportMemberRecharge(self.params, data => {
        window.location.href = data.fullPath;
      });
    },
    refreshParams() {
      let self = this;
      self.params.selectType = self.timeTypeIdx + 1;
      if (self.params.selectType == "5") {
        if (this.selectTime) {
          self.params.startTime = moment(
            this.selectTime[0],
            "YYYY-MM-DD HH:mm:ss"
          ).valueOf();

          self.params.endTime = moment(
            this.selectTime[1],
            "YYYY-MM-DD HH:mm:ss"
          ).valueOf();
        }
      } else {
        self.params.startTime = null;
        self.params.endTime = null;
      }
    },
    pageQuery() {
      this.refreshParams();
      let self = this;
      this.params.userMobile = this.vipSearch;
      chuzhiApi.pageQuery(this.params, data => {
        self.params.totalSize = data.pageData.totalSize;
        data.pageData.list.forEach(
          item =>
            (item.memberDTO.gmtModified = moment(
              item.memberDTO.gmtModified
            ).format("YYYY-MM-DD HH:mm"))
        );

        self.mechData = data.pageData.list;
        self.totalRealPayAmount = data.totalRealPayAmount;
        self.totalDonationAmount = data.totalDonationAmount;
        self.totalBalance = data.totalBalance;
      });
    },
    handleClick(row) {
      let self = this;
      this.$router.push({
        path: "/chuzhiinfo",
        query: {
          memberid: row.memberDTO.userId
        }
      });
    },
    handleCurrentChange: function(curPage) {
      const self = this;
      self.params.page = curPage;
      self.pageQuery();
    },
    searchVip() {
      this.params.page = 1;
      this.pageQuery();
    }
  }
};
</script>

<style lang="less" scoped>
.jishi {
  .jishi-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  .jishi-container {
    padding: 10px 0 0 20px;
    > div:nth-of-type(1) {
      padding-left: 40px;
      position: relative;
      span {
        position: absolute;
        left: 0;
        top: 5px;
      }
    }
    > ul {
      padding-left: 40px;
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
  // 表格
  .tableData {
    margin-top: 20px;
    border: 1px solid #f2f2f2;
    border-bottom: 1px solid transparent;
  }
}
</style>
