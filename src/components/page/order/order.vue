<template>
    <div class="dingdanguanli">
        <div class="dingdanguanli-title">
            <!--<div class="fr"><el-button type="danger">即时开单</el-button></div>-->
            <h3>订单管理</h3>
        </div>
        <div class="dingdanguanli-container">
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
                <li :class="{active : shopId === item.id}"
                v-for="(item,index) in shopList"
                :key="index" @click="clickStore(item.id)">
                    <el-button size="mini" plain>{{item.name}}</el-button>
                </li>
            </ul>
        </div>
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
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                >
                </el-date-picker>
            </div>
        </div>
        <div class="select-user">
            <span>用户分类：</span>
            <ul>
                <li :class="{active : userTypeIdx === index}"
                v-for="(item, index) in userType"
                :key="index" @click="clickUserType(index)">
                    <el-button type="text">{{item.type}}</el-button>
                </li>
            </ul>
            
        </div>
        <!-- 订单状态 -->
        <el-menu
            :default-active="orderStatusIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#ccc"
            text-color="#fff"
            active-text-color="#f63">
            <el-menu-item index="ALL">全部</el-menu-item>
            <el-menu-item index="NOT_ARRIVAL">待服务</el-menu-item>
            <el-menu-item index="WILL_OUT_DATE">服务中</el-menu-item>
            <el-menu-item index="FINISHED">已完成</el-menu-item>
            <el-menu-item index="CANCEL">已取消</el-menu-item>
            <el-menu-item index="REFUNDED">已退款</el-menu-item>
        </el-menu>
        <div>
           
            <el-input placeholder="输入手机号\会员名" v-model="params.search">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <!-- 订单数据 -->
        <div>
            <el-table
                v-loading="loading"
                :data="orderList"
                style="width: 100%">
                <el-table-column
                    label="会员信息"
                    width="180">
                    <template slot-scope="scope">
                        <div class="userInfo">
                            <div class="userImg">
                                <!-- <img :src="scope.row.user.avatar ? OSS_URL + scope.row.user.avatar : '1539416629626.jpg'" alt=""> -->
                                <img :src=" OSS_URL + '1539416629626.jpg'" alt=""> 
                            </div>
                            <div>
                                <span style="fontSize: 16px; color: #f63">{{ scope.row.user.name }}</span><br>
                                <span>{{ scope.row.user.mobile }}</span><br>
                                <span>会员号：{{ scope.row.user.userNo }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单号">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orderNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="预约时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.bookTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="下单时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.gmtCreated }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单内容" width="180">
                    <template slot-scope="scope">
                        <div v-for="(item, index) in scope.row.products" :key="index">
                            <p>{{item.name}}</p>
                            <span>{{item.mech}}</span>
                            <span>{{item.methods}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="服务技师"  >
                    <template slot-scope="scope">
                        <div v-for="(item, index) in scope.row.orderGuestProductMechList" :key="index">
                            <p>{{item.mechName}}</p>
                            
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="排钟方式">
                    <template slot-scope="scope">
                        <div v-for="(item, index) in scope.row.orderGuestProductMechList" :key="index">
                            <p>{{item.clockName}}</p>
                             
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="提成">
                    <template slot-scope="scope">
                        <div v-for="(item, index) in scope.row.orderGuestProductMechList" :key="index">
                            <p>{{item.money}}</p>
                             
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                    <!--label="客次">-->
                    <!--<template slot-scope="scope">-->
                        <!--<span>{{ scope.row.userNum }}</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column
                    label="收银方式" width="100">
                    <template slot-scope="scope">
                        <div v-for="(item, index) in scope.row.orderPayList" :key="index">
                            <span>{{item.payTypeName}}:</span>
                            <span>{{item.payAmount}}</span>
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                    <!--label="应收金额">-->
                    <!--<template slot-scope="scope">-->
                        <!--<span>{{ scope.row.total }}</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column
                    label="订单状态" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                background
                @current-change="handlePage"
                layout="prev, pager, next"
                :page-size="params.pageSize"
                :total="params.totalSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import brandApi from "@/api/brand";
import utils from "@/common/utils";
import shopApi from "@/api/shop";
import orderApi from "@/api/order/order";
import moment from "moment";
import { OSS_URL } from "@/api/constant";
import indexApi from '@/api/index';

export default {
  data() {
    return {
      OSS_URL: OSS_URL,
      loading: true,
      brandId: null,
      brandList: [],
      shopId: null,
      shopList: [],
      params: {
        page: 1,
        pageSize: 10,
        search: "",
        status: ""
      },
      orderList: [],
      select_brand: "考拉时光1", // 默认选择品牌
      storeIndex: 0, // 默认门店下标
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
      userTypeIdx: 0, // 时间分类默认下标
      userType: [
        // 时间分类
        { type: "全部" },
        { type: "储值用户" },
        { type: "普通用户" }
       
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
      orderStatusIndex: "ALL", // 订单状态-默认下标
      orderSearch: "" // 订单查询内容
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    brandId: function(val) {
      if (val) {
        var _this = this;
        this.brandList.forEach(brand => {
          if (brand.id == val) {
            _this.shopList = brand.shopList;
            if (_this.shopList && _this.shopList.length > 0) {
              _this.shopId = _this.shopList[0].id;
            }
          }
        })
      }
    },
    shopId: function(newVal, oldVal) {
      if (newVal) {
        this.pageQuery();
      } else {
        this.orderList = [];
        this.params.totalSize = 0;
      }
    },
    selectTime(newVal, oldVal) {
      console.log(newVal);
      this.pageQuery();
    }
  },

  methods: {
    init() {
      this.queryBrand();
    },
    pageQuery() {
      let self = this;
      this.loading = true;
      this.params.shopId = self.shopId;
      this.params.dateType = this.timeTypeIdx;
      this.params.userType=this.userTypeIdx;
      if (this.selectTime) {
        this.params.startTime = this.selectTime[0];
        this.params.endTime = this.selectTime[1];
      }
      orderApi.pageQuery(this.params, data => {
        data.list.forEach(
          item =>
            (item.bookTime = moment(item.bookTime).format("YYYY-MM-DD HH:mm"))
        );
        self.orderList = data.list;
        self.params.totalSize = data.totalSize;
        self.loading = false;
      });
    },
    queryBrand() {
      const self = this;
      indexApi.getEmpShops(data => {
        var brandList = data.brandList;
        self.brandList = brandList;
        if (brandList && brandList.length > 0) {
          self.brandId = brandList[0].id;
        }
      });
    },
    clickStore(shopId) {
      this.params.page = 1;
      this.shopId = shopId;
    },
    handleSelect(key, keyPath) {
      if (key == "ALL") {
        this.params.status = null;
      } else {
        this.params.status = key;
      }
      this.params.page = 1;
      this.pageQuery();
    },
    handleClick(row) {
      console.log(row);
      let self = this;
      this.$router.push({
        path: "/order-detail",
        query: {
          orderId: row.id
        }
      });
    },
    handleEdit(row) {
      let self = this;
      this.$router.push({
        path: "/order-edit",
        query: {
          orderId: row.id
        }
      });
    },
    handlePage(page) {
      this.params.page = page;
      this.pageQuery();
    },
    search() {
      this.params.page = 1;
      this.pageQuery();
    },
    handleTime(value) {
      console.log(value);
    },
    clickTimeType(index) {
      this.timeTypeIdx = index;
      if (index != 5) {
        this.pageQuery();
      }
    },
    clickUserType(index) {
      
      this.userTypeIdx = index;
      
        this.pageQuery();
     
    }
  }
};
</script>

<style lang="less" scoped>
.dingdanguanli {
  .dingdanguanli-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  .dingdanguanli-container {
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
   .select-user {
    margin: 0px 0 10px;
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
  > div:nth-of-type(4) {
    width: 300px;
    padding: 20px 0;
  }
  // 订单信息
  > div:nth-of-type(5) {
    border: 1px solid #f2f2f2;
    border-bottom: 1px solid transparent;
    .userInfo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .userImg {
        width: 50px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }
    }
  }
  // 分页
  .pagination {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
