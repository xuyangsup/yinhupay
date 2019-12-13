<template>
  <div class="jishi">
    <div class="jishi-title">
      <h3>储值明细</h3>
    </div>

    <!-- 表格数据 -->
    <div class="tableData">
      <el-table :data="mechData" style="width: 100%">
        <el-table-column label="姓名" width="80">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.userNickName }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
                    label="卡号">
                    <template slot-scope="scope">
                        <span>{{ scope.row.userNo}}</span>
                    </template>
        </el-table-column>-->
        <el-table-column label="客户手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.userMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="充值日期">
          <template slot-scope="scope">
            <span>{{ scope.row.gmtModified }}</span>
            <br>
          </template>
        </el-table-column>
        <!-- <el-table-column
                    label="门店">
                    <template slot-scope="scope">
                        <span>{{ scope.row.shopName }}</span><br>
                         
                    </template>
        </el-table-column>-->

        <el-table-column label="活动名称">
          <template slot-scope="scope">
            <span>{{ scope.row.packageName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="储值方式">
          <template slot-scope="scope">
            <span>{{ scope.row.payType }}</span>
          </template>
        </el-table-column>

        <el-table-column label="充值金额">
          <template slot-scope="scope">
            <span>{{ scope.row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="赠送金额">
          <template slot-scope="scope">
            <span>￥{{ scope.row.donationAmount }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
                    label="实际支付金额">
                    <template slot-scope="scope">
                        <span>￥{{ scope.row.buyerPay }}</span>
                    </template>
                </el-table-column>
        -->
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
        selectType: 0,
        userNo: null,
        userMobile: null,
        userNo: null /** 会员编号 **/,
        userId: null /** 会员Id **/,
        pageNum: 1,
        page: 1,
        pageSize: 10,
        totalSize: 0
      },
      mechData: [],
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
    this.init();
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
      console.log("区县==", self.timeTypeIdx);
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
    init() {
      const _this = this;
      _this.params.userId = this.$route.query.memberid;
      this.pageQuery();
    },
    clickStore(shopId) {
      this.shopId = shopId;
    },
    pageQuery() {
      let self = this;
      chuzhiApi.pageInfoQuery(this.params, data => {
        if (data == null) {
          this.$message({
            message: "暂无数据",
            type: "success"
          });
        } else {
          self.params.totalSize = data.totalSize;
          for (var a = 0; a < data.list.length; a++) {
            var mdtos = data.list[a]
            if (mdtos.payType == "WEIXIN") {
              mdtos.payType = "微信";
            }
          }
          data.list.forEach(
            item =>
              (item.gmtModified = moment(item.gmtModified).format(
                "YYYY-MM-DD HH:mm"
              ))
          );
          self.mechData = data.list;
        }
      });
    },
    //点击下一页
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
