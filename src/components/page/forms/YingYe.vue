<template>
  <div class="yingye">
    <div class="yingye-title">
      <h3>营业汇总</h3>
    </div>
    <div class="yingye-container">
      <div>
        <span>品牌</span>
        <el-select v-model="brandId" placeholder="选择品牌" class="handle-select mr10">
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <ul>
        <li
          :class="{active : shopId === item.id}"
          v-for="(item,index) in shopList"
          :key="index"
          @click="clickStore(item.id)"
        >
          <el-button size="mini" plain>{{item.name}}</el-button>
        </li>
      </ul>
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
          :clearable="false"
        ></el-date-picker>
      </div>
      <!-- <div>
        <span slot="footer" class="dialog-footer" style="margin-left: 10px">
          <el-button type="danger" @click="queryData">查询</el-button>
        </span>
      </div> -->
      <div class="fr" style="right: 20px; top: 70px; z-index: 100; position: absolute;">
        <span>导出报表：</span>
        <el-button type="text" @click="exportBusiness">营业额汇总</el-button>
      </div>
    </div>
    <!-- 五大板块 -->
    <el-row :gutter="20" class="mgb20 mt20">
      <el-col :span="5">
        <el-card :class="{active:showDataIdx===5}" shadow="hover" :body-style="{padding: '0px'}">
          <div @click="clickDayYeji()" class="grid-content grid-con-0">
            <i class="el-icon-star-off grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">¥{{mainData.sellAmount}}</div>
              <div>总营业额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card :class="{active:showDataIdx===0}" shadow="hover" :body-style="{padding: '0px'}">
          <div @click="showDataIdx=0" class="grid-content grid-con-1">
            <i class="el-icon-view grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">¥{{mainData.laoDongYeJi}}</div>
              <div>劳动业绩</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card :class="{active:showDataIdx===1}" shadow="hover" :body-style="{padding: '0px'}">
          <div @click="pageQueryyeji()" class="grid-content grid-con-2">
            <i class="el-icon-message grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">业绩排行</div>
              <div>门店业绩排行</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card :class="{active:showDataIdx===2}" shadow="hover" :body-style="{padding: '0px'}">
          <div @click="pageQueryOrderAndGuest()" class="grid-content grid-con-3">
            <i class="el-icon-goods grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{mainData.orderCount}}/{{mainData.guestCount}}</div>
              <div>客数/客次</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card :class="{active:showDataIdx===3}" shadow="hover" :body-style="{padding: '0px'}">
          <div @click="pageQuerycountNewUser()" class="grid-content grid-con-4">
            <i class="el-icon-star-on grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{mainData.newMemberCount}}</div>
              <div>新增会员</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 劳动业绩 -->
    <div v-show="showDataIdx===0">
      <!-- 支付方式 -->
      <div>
        <i class="el-icon-menu mr10"></i>
        <span class="mr10">支付方式</span>
        <ul class="data-origin">
          <li v-for="(item, index) in payTypeList" :key="index">{{item.name}}：¥ {{item.payAmount}}</li>
        </ul>
      </div>
      <div>
        <i class="el-icon-menu mr10"></i>
        <span class="mr10">充值金额</span>
        <ul class="data-origin">
          <li>¥{{mainData.chuzhiCharge}}</li>
        </ul>
      </div>
      <!-- 渠道来源 -->
      <div>
        <i class="el-icon-menu mr10"></i>
        <span class="mr10">渠道来源</span>
        <ul class="data-origin">
          <li v-for="(item, index) in sourceList" :key="index">{{item.name}}：¥ {{item.payAmount}}</li>
        </ul>
      </div>
      <!-- 业绩走势 -->
      <div>
        <i class="el-icon-menu mr10"></i>
        <span class="mr10">业绩走势</span>
        <div id="myChartPerformanceTrend" :style="{width: '100%', height: '300px'}"></div>
      </div>
    </div>
    <!-- 门店业绩排行 -->
    <div v-show="showDataIdx===1" class="mgb20">
      <!-- 表格数据 -->
      <div class="tableData">
        <el-table :data="itemData" style="width: 100%">
          <el-table-column label="门店排名" width="120" type="index"></el-table-column>
          <el-table-column label="门店名称">
            <template slot-scope="scope">
              <span>{{ scope.row.shopName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="门店业绩">
            <template slot-scope="scope">
              <span>￥{{ scope.row.shopPerformance }}</span>
            </template>
          </el-table-column>
          <el-table-column label="客数">
            <template slot-scope="scope">
              <span>总数：{{ scope.row.countOrder }}</span>
              <br>
            </template>
          </el-table-column>
          <el-table-column label="客次">
            <template slot-scope="scope">
              <span>{{ scope.row.countGuest }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <!-- <div class="pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
      </div>-->
    </div>
    <!-- 次数/客数 -->
    <div v-show="showDataIdx===2">
      <i class="el-icon-menu mr10"></i>
      <span class="mr10">次数/客数</span>
      <div id="myChartNumAndCustomer" :style="{width: '100%', height: '400px'}"></div>
    </div>
    <!-- 新增会员 -->
    <div v-show="showDataIdx===3">
      <i class="el-icon-menu mr10"></i>
      <span class="mr10">新会员</span>
      <div id="myChartNewAndOldCustomer" :style="{width: '100%', height: '400px'}"></div>
    </div>
    <!-- 总营业额 -->
    <div v-show="showDataIdx === 5">
      <!-- 表格数据 -->
      <div class="tableData">
        <el-table :data="daySellList" style="width: 100%">
          <el-table-column label="日期" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.day }}</span>
            </template>
          </el-table-column>
          <el-table-column label="POS">
            <template slot-scope="scope">
              <span>{{ scope.row.posMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="预定">
            <template slot-scope="scope">
              <span>{{ scope.row.yudingMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="团购">
            <template slot-scope="scope">
              <span>{{ scope.row.tuanGouMoney }}</span>
              <br>
            </template>
          </el-table-column>
          <el-table-column label="口碑">
            <template slot-scope="scope">
              <span>{{ scope.row.kouBeiMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="微信">
            <template slot-scope="scope">
              <span>{{ scope.row.weiXinMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="银行卡">
            <template slot-scope="scope">
              <span>{{ scope.row.yinhangkaMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="其它">
            <template slot-scope="scope">
              <span>{{ scope.row.otherMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="减免">
            <template slot-scope="scope">
              <span>{{ scope.row.jianMianMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="储值支付">
            <template slot-scope="scope">
              <span>{{ scope.row.chuZhiMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="储值充值">
            <template slot-scope="scope">
              <span>{{ scope.row.chuZhiCharge }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合计">
            <template slot-scope="scope">
              <span>{{ scope.row.totalMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="应收总金额">
            <template slot-scope="scope">
              <span>{{ scope.row.yingShouMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="劳动业绩">
            <template slot-scope="scope">
              <span>{{ scope.row.laoDongYeji }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 导出报表 -->
    <!-- <div class="export">
            <span>导出报表：</span>
            <el-button type="text" @click="exportBusiness">营业额明细</el-button>
    </div>-->
  </div>
</template>

<script>
import indexApi from "@/api/index";
import dataApi from "@/api/data";
import yingyeApi from "@/api/yingye";

export default {
  data() {
    return {
      params: {
        brandIds: [],
        shopIds: [],
        dateType: 1,
        startTime: null,
        endTime: null,
        brandId: null,
        shopId: null,
        selectType: 1
      },
      brandData: [],
      brandId: null, // 默认选择品牌
      brandList: [],
      shopList: [],
      shopId: null, // 默认门店下标
      mainData: {},
      chuzhiData: {},
      timeTypeIdx: 0, // 时间分类默认下标
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
      selectTime: "", // 默认选中时间
      showDataIdx: 0, // 四大板块-默认选中-总营业额
      payTypeList: [],
      daySellList: [],
      sourceList: [],
      itemData: []
    };
  },
  mounted() {
    if (this.showDataIdx == 0) {
      this.querythis();
    }
    if (this.showDataIdx == 1) {
      this.pageQueryyeji();
    }
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
      
    },
    shopId(newVal, oldVal) {
      this.queryData();
    },
    timeTypeIdx(newVal, oldVal) {
      this.params.dateType = newVal + 1;
      this.params.selectType = newVal + 1;
      if (this.params.dateType < 5) {
        this.params.startTime = null;
        this.params.endTime = null;
      }
      if (this.params.dateType == 5) {
        return;
      }
      this.queryData();
    },
    selectTime(newTime, oldTime) {
      let start = newTime[0];
      let end = newTime[1];
      this.params.startTime = start.getTime();
      this.params.endTime = end.getTime();
      this.queryData();
    }
  },
  methods: {
    clickStore(shopId) {
      this.shopId = shopId;
    },

    refreshShop() {
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
      }
    },
    querythis() {
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
      });
    },
    queryData() {
      this.refreshShop();
      this.queryMain();
      this.queryPayTypeData();
      this.querySourceData();
      this.queryDaySale();
      this.queryDayYeji();
    },

    queryMain() {
      let self = this;
      dataApi.queryMain(self.params, data => {
        self.mainData = data;
      });
      this.queryaddhuiyuan();
    },

    queryaddhuiyuan() {
      let self = this;

      self.params.selectType = self.params.dateType;
      dataApi.queryaddhuiyuan(self.params, data1 => {
        self.mainData.newMemberCount = data1;
      });
    },
    queryAllchuzhi() {
      let self = this;
      self.queryData();
    },

    queryPayTypeData() {
      let self = this;
      dataApi.queryPayTypeData(self.params, data => {
        self.payTypeList = data.payTypeList;
      });
    },

    querySourceData() {
      let self = this;
      dataApi.querySourceData(self.params, data => {
        self.sourceList = data.sourceList;
      });
    },

    queryDaySale() {
      let self = this;
      dataApi.queryDaySale(self.params, data => {
        self.performanceTrend(data.dayList, data.daySaleList);
      });
    },

    queryDayYeji() {
      const self = this;
      this.params.selectType = this.params.dateType;

      self.params.brandId = this.brandId;
      yingyeApi.queryDayYeji(self.params, data => {
        self.daySellList = data;
      });
    },
    

    /**
     * 业绩排行
     */
    pageQueryyeji() {
      const self = this;
      this.showDataIdx = 1;
      this.params.selectType = this.params.dateType;

      self.params.brandId = this.brandId;
      yingyeApi.pageQueryyingye(self.params, data => {
        self.itemData = data;
        self.params.page = data.page;
        self.params.totalSize = data.totalSize;
      });
    },

    clickDayYeji() {
      const self = this;
      this.showDataIdx = 5;
      this.params.selectType = this.params.dateType;

      self.params.brandId = this.brandId;
      yingyeApi.queryDayYeji(self.params, data => {
        self.daySellList = data;
      });
    },

    /**
     * 新增会员统计
     */
    pageQuerycountNewUser() {
      const self = this;
      this.showDataIdx = 3;
      self.params.brandId = this.brandId;
      self.params.shopId = this.shopId;
      self.params.selectType = 9;
      yingyeApi.pageQuerycountNewUser(self.params, data => {
        this.newAndOldCustomer(data); // 新老会员
      });
      this.queryaddhuiyuan();
    },

    /**
     * 新增客数客次
     */
    pageQueryOrderAndGuest() {
      const self = this;
      this.showDataIdx = 2;
      //品牌ID 3333333
      self.params.brandId = this.brandId;
      self.params.shopId = this.shopId;
      yingyeApi.pageQueryOrderAndGuest(self.params, data => {
        this.numAndCustomer(data); // 次数和客数
      });
    },

    /**
     *
     * 导出营业额明细报表
     * */
    exportBusiness() {
      let self = this;
      dataApi.exportBusiness(self.params, data => {
        console.log(data);
        window.location.href = data.fullPath;
      });
    },

    /**
     * 业绩走势
     */
    performanceTrend(dayList, saleList) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("myChartPerformanceTrend")
      );
      // 绘制图表
      myChart.setOption({
        // title: { text: '' },
        tooltip: { trigger: "axis" },
        xAxis: {
          data: dayList
          // axisLabel: { // x轴旋转
          //     interval: 0,
          //     rotate: 40
          // }
        },
        yAxis: { type: "value" },
        series: [
          {
            // name: '业绩',
            type: "line",
            // color: '#f63', // 背影颜色#f63
            data: saleList
          }
        ]
      });
    },
    /**
     * 其它业绩分析
     
    otherPerformanceTrend() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("myChartOtherPerformanceTrend")
      );
      // 绘制图表
      myChart.setOption({
        // title: { text: '' },
        tooltip: {},
        xAxis: {
          data: [
            "男客业绩",
            "女客业绩",
            "会员业绩",
            "散客业绩",
            "点钟业绩",
            "轮牌业绩",
            "帮钟业绩"
          ]
        },
        yAxis: {},
        series: [
          {
            name: "业绩",
            type: "bar",
            // color: '#f63', // 背影颜色#f63
            data: [180, 3306, 3320, 266, 528, 2958, 1000]
          }
        ]
      });
    },*/
    /**
     * 次数和客数
     */
    numAndCustomer(data) {
      var myChartNumAndCustomer = document.getElementById(
        "myChartNumAndCustomer"
      );
      //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
      myChartNumAndCustomer.style.width = window.innerWidth - 240 + "px"; // 减去右边菜单宽度

      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(myChartNumAndCustomer);
      // 绘制图表
      myChart.setOption({
        // title: { text: '' },
        color: ["#9FE1ED", "#8F949A"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["次数", "客数"]
        },
        tooltip: {},
        xAxis: {
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ]
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "次数",
            type: "bar",
            barGap: 0,
            // label: {                     //---图形上的文本标签
            //     show:false,
            //     position:'insideTop',   //---相对位置
            //     rotate:0,               //---旋转角度
            //     color:'#eee',
            // },
            data: data.guestCount
          },
          {
            name: "客数",
            type: "bar",
            // label: {                     //---图形上的文本标签
            //     show:false,
            //     position:'insideTop',   //---相对位置
            //     rotate:0,               //---旋转角度
            //     color:'#eee',
            // },
            data: data.orderCount
          }
        ]
      });
    },
    /**
     * 新会员和老会员
     */
    newAndOldCustomer(data) {
      var myChartNewAndOldCustomer = document.getElementById(
        "myChartNewAndOldCustomer"
      );
      //   var newdata=[];
      //   for(var e=0;e<data.length;e++){
      //       var t=data[e].value;
      //       alert(e);
      //   }
      //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
      myChartNewAndOldCustomer.style.width = window.innerWidth - 240 + "px"; // 减去右边菜单宽度

      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(myChartNewAndOldCustomer);
      // 绘制图表
      myChart.setOption({
        // title: { text: '' },
        color: ["#9FE1ED", "#8F949A"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["新会员"]
        },
        tooltip: {},
        xAxis: {
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ]
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "新会员",
            type: "bar",
            barGap: 0,
            // label: {                     //---图形上的文本标签
            //     show:false,
            //     position:'insideTop',   //---相对位置
            //     rotate:0,               //---旋转角度
            //     color:'#eee',
            // },
            data: data
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
.yingye {
  .yingye-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  .yingye-container {
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
    padding: 5px 0;
    margin: 20px 0 10px;
    overflow: hidden;
    display: flex;
    // display: flex;
    // align-items: center;
    > span {
      position: relative;
      top: 5px;
      float: left;
    }
    ul {
      // flex: 1;
      float: left;
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
  // 总营业额-门店业绩-次数/客数-新增会员
  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
    .grid-con-icon {
      font-size: 50px;
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      color: #fff;
    }
    .grid-cont-right {
      flex: 1;
      text-align: center;
      font-size: 12px;
      color: #999;
      .grid-num {
        font-size: 30px;
        font-weight: bold;
      }
    }
  }
  // 总营业额-门店业绩-次数/客数-新增会员
  .grid-con-0 {
    .grid-con-icon {
      background: #e61050;
    }
    .grid-num {
      color: #e61050;
    }
  }
  .grid-con-1 {
    .grid-con-icon {
      background: rgb(230, 162, 60);
    }
    .grid-num {
      color: rgb(230, 162, 60);
    }
  }
  .grid-con-2 {
    .grid-con-icon {
      background: rgb(242, 94, 67);
    }
    .grid-num {
      color: rgb(242, 94, 67);
      font-size: 20px !important;
    }
  }
  .grid-con-3 {
    .grid-con-icon {
      background: rgb(45, 140, 240);
    }
    .grid-num {
      color: rgb(45, 140, 240);
    }
  }
  .grid-con-4 {
    .grid-con-icon {
      background: rgb(100, 213, 114);
    }
    .grid-num {
      color: rgb(100, 213, 114);
    }
  }

  .data-origin {
    overflow: hidden;
    margin: 10px 0 10px 20px;
    padding: 10px 10px;
    border: 1px solid #f2f2f2;
    li {
      float: left;
      margin-right: 20px;
    }
  }
  // 导出报表
  .export {
    border: 1px solid #f5d4b3;
    background: #fffcf5;
    padding: 10px 15px;
    margin-bottom: 20px;
  }
}

.el-card {
  cursor: pointer;
}
.el-card.active {
  border: 1px solid #f63;
}
</style>
