<template>
    <div class="jishi">
        <div class="jishi-title">
            <h3>技师业绩明细</h3>
        </div>
        <div class="jishi-container">
            <div>
                <span>品牌</span>
                <el-select v-model="brandId" placeholder="选择品牌" class="handle-select mr10">
                    <el-option
                    v-for="item in brandList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <ul>
                <li :class="{active : shopId === shop.id}"
                v-for="(shop,index) in shopList"
                :key="index" @click="clickStore(shop.id)">
                    <el-button size="mini" plain>{{shop.name}}</el-button>
                </li>
            </ul>
        </div>
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
            <div>
              <span slot="footer" class="dialog-footer" style="margin-left: 10px">
                <el-button type="danger" @click="pageQuery">查询</el-button>
              </span>
            </div>
            <br>
            <div class="export" style="right: 20px; top: 70px; z-index: 100; position: absolute;">
            <!-- <span>导出报表：</span>
            <el-button type="text" @click="exportMechSale">员工业绩</el-button>
            <el-button type="text" @click="exportMechSign">员工考勤</el-button> -->
        </div>
            
        </div>
        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="dataList"
                style="width: 100%">
                <el-table-column
                    label="员工工号"
                    >
                    <template slot-scope="scope">
                        <span>{{ scope.row.mechNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="员工姓名">
                    <template slot-scope="scope">
                        <span>{{ scope.row.mechName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="日期">
                    <template slot-scope="scope">
                        <span>{{ scope.row.day }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="开单时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.openOrderTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="买单时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.cashOrderTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="系统单号">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orderNo }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="房间编号">
                    <template slot-scope="scope">
                        <span>{{ scope.row.roomNo }}</span>
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="项目">
                    <template slot-scope="scope">
                        <span>{{ scope.row.productName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="支付">
                    <template slot-scope="scope">
                        <span>{{ scope.row.cashMoney }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.clockType }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="数量">
                    <template slot-scope="scope">
                        <span>{{ scope.row.number }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="实收金额">
                    <template slot-scope="scope">
                        <span>{{ scope.row.shiShou }}</span>
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="业绩">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sale }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="提成">
                    <template slot-scope="scope">
                        <span>{{ scope.row.money }}</span>
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
    </div>
</template>

<script>
import indexApi from "@/api/index";
import mechApi from "@/api/mech/mech";
import moment from "moment";
import dataApi from "@/api/data";

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
        dateType: 1,
        brandIds: [],
        shopIds: [],
        page: 1,
        pageSize: 10,
        totalSize: 0
      },
      dataList: [],
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
    let self = this;
    indexApi.getEmpShops(data => {
      self.brandData = data.brandList;
      let shopList = [];
      shopList.push({
        id: 0,
        name: "全部"
      });

      let list = [];
      list.push({
        id: 0,
        name: "全部"
      });
      data.brandList.forEach(brand => {
        list.push(brand);

        brand.shopList.forEach(shop => {
          shopList.push(shop);
        });
      });
      self.brandList = list;
      self.shopList = shopList;

      if (list.length > 0) {
        self.brandId = list[0].id;
      }

      if (shopList.length > 0) {
        self.shopId = shopList[0].id;
      }
      self.pageQuery();
    });
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
    /*
             * 点击门店列表
             */
    clickStore(shopId) {
      this.shopId = shopId;
    },

    refreshParams() {
      let self = this;
      if (this.brandId == 0 && this.shopId == 0) {
        let brandIds = [];
        let shopIds = [];
        self.brandData.forEach(brand => {
          brandIds.push(brand.id);
          brand.shopList.forEach(shop => {
            shopIds.push(shop.id);
          });
        });
        self.params.brandIds = brandIds;
        self.params.shopIds = shopIds;
      } else if (this.brandId > 0 && this.shopId == 0) {
        let brandIds = [];
        brandIds.push(this.brandId);

        let shopIds = [];
        self.brandData.forEach(brand => {
          if (brand.id == self.brandId) {
            brand.shopList.forEach(shop => {
              shopIds.push(shop.id);
            });
          }
        });
        self.params.brandIds = brandIds;
        self.params.shopIds = shopIds;
      } else if (this.brandId == 0 && this.shopId > 0) {
        let brandIds = [];
        let shopIds = [];
        self.brandData.forEach(brand => {
          brand.shopList.forEach(shop => {
            if (shop.id == self.shopId) {
              shopIds.push(shop.id);
              brandIds.push(shop.brandId);
            }
          });
        });
        self.params.brandIds = brandIds;
        self.params.shopIds = shopIds;
      } else if (this.brandId > 0 && this.shopId > 0) {
        let brandIds = [];
        let shopIds = [];
        brandIds.push(this.brandId);
        shopIds.push(this.shopId);

        self.params.brandIds = brandIds;
        self.params.shopIds = shopIds;
      }

      //时间
      self.params.dateType = self.timeTypeIdx + 1;
      if (self.params.dateType == "5") {
        if (this.selectTime) {
          console.log(this.selectTime)
          self.params.startTime = moment(this.selectTime[0]).format("YYYY-MM-DD");
          self.params.endTime = moment(this.selectTime[1]).format("YYYY-MM-DD");
        }
      } else {
        self.params.startTime = null;
        self.params.endTime = null;
      }
      self.params.statusList=['FINISHED'];
    },

    pageQuery() {
      this.refreshParams();
      let self = this;
      this.queryJishiYejiDetail();
    },

    //点击下一页
    handleCurrentChange: function(curPage) {
      const self = this;
      self.params.page = curPage;
      self.pageQuery();
    },
    /**
     *
     * 导出员工业绩
     * */
    exportMechSale() {
      let self = this;
      dataApi.exportMechSale(self.params, data => {
        console.log(data);
        window.location.href = data.fullPath;
      });
    },

    queryJishiYejiDetail() {
      let self = this;
      mechApi.queryMechYejiDetail(self.params, data => {
        self.dataList = data.list;
        self.params.totalSize = data.totalSize;
      })
    },
    /**
     *
     * 导出员工考勤
     * */
    exportMechSign() {
      let self = this;
      dataApi.exportMechSign(self.params, data => {
        console.log(data);
        window.location.href = data.fullPath;
      });
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
