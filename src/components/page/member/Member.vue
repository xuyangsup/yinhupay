<template>
  <div class="huiyuan">
    <div class="huiyuan-title">
      <!-- <el-button  class="fr" @click="dialogVipVisible = true" type="danger">添加会员</el-button> -->
      <h3>会员中心</h3>
    </div>
    <!-- 品牌门店 -->
    <div>
      <div class="mr10">
        <span class="mr10">品牌</span>
        <el-select v-model="brandId" placeholder="选择品牌">
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div>
        <span class="mr10">门店</span>
        <el-select v-model="shopId" placeholder="选择门店">
          <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
    </div>
    <!-- 时间分类 -->
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
    </div>
    <!-- 会员查询 -->
    <div>
      <span class="mr10">会员查询</span>
      <el-input style="width:300px" placeholder="输入会员名\电话\会员号" v-model="vipSearch">
        <el-button slot="append" icon="el-icon-search" @click="searchVip"></el-button>
      </el-input>
      <el-button
        type="text"
        class="fr"
        v-if="isShowMoreSearch===false"
        @click="isShowMoreSearch=true"
      >
        更多筛选
        <i class="el-icon-arrow-down"></i>
      </el-button>
      <el-button type="text" class="fr" v-else @click="isShowMoreSearch=false">
        收起
        <i class="el-icon-arrow-up"></i>
      </el-button>
    </div>
    <!-- 更多筛选 -->
    <div v-show="isShowMoreSearch">
      <!-- 时间分类 -->
      <div>
        <span class="mr10">时间分类</span>
        <ul>
          <li
            :class="{active : timeTypeListIdx === index}"
            v-for="(item, index) in timeTypeList"
            :key="index"
            @click="timeTypeListIdx = index"
          >
            <el-button type="text">{{item.type}}</el-button>
          </li>
        </ul>
        <div v-show="timeTypeListIdx === 5" style="width: 10%">
          <el-input style="width: 40%;margin-right: 10px" v-model="timeTypeListInput"></el-input>
          <span>天</span>
        </div>
      </div>
      <!-- 到店频次 -->
      <div>
        <span class="mr10">到店频次</span>
        <ul>
          <li
            :class="{active : goStoreTypeListIdx === index}"
            v-for="(item, index) in goStoreTypeList"
            :key="index"
            @click="goStoreTypeListIdx = index"
          >
            <el-button type="text">{{item.type}}</el-button>
          </li>
        </ul>
        <div v-show="goStoreTypeListIdx === 4" style="width: 10%">
          <el-input style="width: 40%;margin-right: 10px" v-model="goStoreTypeListInput"></el-input>
          <span>天</span>
        </div>
      </div>
      <!-- 客户来源 -->
      <div>
        <span class="mr10">客户来源</span>
        <ul>
          <li
            :class="{active : originTypeListIdx === index}"
            v-for="(item, index) in originTypeList"
            :key="index"
            @click="originTypeListIdx = index"
          >
            <el-button type="text">{{item.type}}</el-button>
          </li>
        </ul>
      </div>
    </div>
    <!-- 表格数据 -->
    <div class="tableData">
      <el-table
        v-loading="dataLoading"
        element-loading-text="拼命加载中"
        :data="vipData"
        style="width: 100%"
      >
        <el-table-column label="会员信息" width="180">
          <template slot-scope="scope">
            <div class="userInfo">
              <div>
                <span style="fontSize: 16px; color: #f63">{{ scope.row.name }}</span>
                <br />
                <span>{{ scope.row.mobile }}</span>
                <br />
                <span>会员号：{{ scope.row.userNo }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="注册时间">
          <template slot-scope="scope">
            <span>{{ scope.row.registerTime }}</span>
            <br />
          </template>
        </el-table-column>
        <el-table-column label="会员余额">
          <template slot-scope="scope">
            <span>{{ scope.row.balance }}</span>
            <br />
          </template>
        </el-table-column>
        <el-table-column label="累计消费">
          <template slot-scope="scope">
            <span>累计：￥{{ scope.row.totalConsume }}</span>
            <br />
            <span>总计到店：{{ scope.row.totalConsumerTimes }}次</span>
            <span>本月：{{ scope.row.thisMonthConsumerTimes }}次</span>
          </template>
        </el-table-column>
        <el-table-column label="上次消费">
          <template slot-scope="scope">
            <span>{{ scope.row.lastConsumeDate }}</span>
            <br />
            <span>消费：￥{{ scope.row.lastConsume }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="memberCharge(scope.row)" type="text" size="small">会员充值</el-button>
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
        :total="params.totalSize"
      ></el-pagination>
    </div>

    <!-- 弹出框-添加会员 -->
    <el-dialog title="添加会员" :visible.sync="dialogVipVisible">
      <!-- 添加会员 -->
      <div>
        <el-row type="flex">
          <el-col :span="8">
            <span>&nbsp;&nbsp;&nbsp;预约人</span>
            <el-input
              v-model="member.name"
              placeholder="请输入用户名"
              style="width: 60%;margin-left: 10px;"
            ></el-input>
          </el-col>
          <el-col :span="5">
            <el-radio v-model="member.sex" label="F" border size="mini">女</el-radio>
            <el-radio v-model="member.sex" label="M" border size="mini">男</el-radio>
          </el-col>
          <el-col :span="8">
            <span>联系电话</span>
            <el-input
              v-model="member.mobile"
              placeholder="请输入联系电话"
              style="width: 60%;margin-left: 10px;"
            ></el-input>
          </el-col>
        </el-row>
        <el-row type="flex" class="mt10">
          <el-col :span="8">
            <span>&nbsp;&nbsp;&nbsp;会员号</span>
            <el-input
              v-model="member.userNo"
              placeholder="请输入会员号"
              style="width: 60%;margin-left: 10px;"
            ></el-input>
          </el-col>
          <el-col :span="6" :offset="2">
            <span>生日</span>
            <el-date-picker
              style="width: 70%;margin-left: 10px;"
              v-model="member.birthday"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row class="mt10">
          <el-col :span="9">
            <span class="mr10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;品牌</span>
            <el-select class="flex-8" v-model="dialog_brandId" placeholder="选择品牌">
              <el-option
                v-for="item in dialog_brandList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8" :offset="1">
            <span class="mr10">门店</span>
            <el-select class="flex-8" v-model="dialog_shopId" placeholder="选择门店">
              <el-option
                v-for="item in dialog_shopList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="mt10">
          <el-col :span="20">
            <span class="mr10">订单来源</span>
            <el-select v-model="select_order_from" placeholder="选择订单来源" class="handle-select mr10">
              <el-option
                v-for="item in orderFromList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVipVisible = false">取 消</el-button>
        <el-button type="warning" @click="clickAddMember">确定选择</el-button>
      </span>
    </el-dialog>

    <!-- 会员充值 -->
    <el-dialog title="会员充值" :visible.sync="dialogChargeVisiable">
      <el-select v-model="packageId" placeholder="请选择">
        <el-option
          v-for="item in chargePackageList"
          :key="item.id"
          :label="item.packageName"
          :value="item.id"
        ></el-option>
      </el-select>
      <p style="margin-top: 20px;margin-bottom: 20px">支付方式: </p>
      <el-select v-model="chargePayType" placeholder="请选择">
        <el-option
          v-for="item in chargePayTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.payType"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChargeVisiable = false">取 消</el-button>
        <el-button type="warning" @click="goChargeAmount">确定选择</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dialog from "@/common/dialog";
import show from "@/common/show";
import brandApi from "@/api/brand";
import shopApi from "@/api/shop";
import memberApi from "@/api/member";
import { OSS_URL } from "@/api/constant";
import indexApi from "@/api/index";
export default {
  data() {
    return {
      brandId: null, // 默认选择品牌
      brandList: [],
      shopId: null, // 默认选择门店
      shopList: [],
      timeTypeIdx: 0, // 时间分类默认下标
      IMAGE_URL: OSS_URL,
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
      vipSearch: "", // 会员查询
      isShowMoreSearch: false, // 是否展示更多筛选
      timeTypeList: [
        // 更多筛选-时间分类
        { type: "全部" },
        { type: "一月未到店" },
        { type: "两月未到店" },
        { type: "三月未到店" },
        { type: "半年未到店" },
        { type: "自定义天" }
      ],
      timeTypeListIdx: 0, // 更多筛选-时间分类下标
      timeTypeListInput: "", // 更多筛选-时间分类-自定义天
      goStoreTypeList: [
        // 更多筛选-到店频次
        { type: "全部" },
        { type: "1次以内/月" },
        { type: "2次以内/月" },
        { type: "3次以上/月" },
        { type: "自定义天" }
      ],
      goStoreTypeListIdx: 0, // 更多筛选-到店频次下标
      goStoreTypeListInput: "", // 更多筛选-到店频次-自定义天
      originTypeList: [
        // 更多筛选-客户来源
        { type: "全部" },
        { type: "大众点评" },
        { type: "口碑网" },
        { type: "平台" },
        { type: "散客" },
        { type: "线下营销" },
        { type: "线上营销" }
      ],
      originTypeListIdx: 0, // 更多筛选-客户来源下标
      dataLoading: true, // loading
      vipData: [],
      params: {
        // 分页参数
        page: 1,
        pageSize: 10,
        search: ""
      },
      dialogVipVisible: false, // 弹出层-添加会员
      member: {
        name: "", // 弹出层-输入框用户名
        sex: "F", // 弹出层-单选框性别，0女1男
        mobile: "", // 弹出层-输入框用户手机
        userNo: "", // 弹出层-会员号
        birthday: "", // 弹出层-会员生日
        sourceId: 1 // 来源
      },
      dialog_brandId: null, // 弹出框-选择品牌
      dialog_brandList: [],
      dialog_shopId: null, // 弹出框-选择门店
      dialog_shopList: [],
      select_order_from: "大众点评", // 弹出框-订单来源
      orderFromList: [
        // 弹出框-订单来源数据
        { name: "微信" },
        { name: "口碑" },
        { name: "大众点评" }
      ],
      dialogChargeVisiable: false,
      selectUser: null,
      chargePackageList: [],
      packageId: null,
      chargePayTypeList: [
        {
          id: 1,
          payType: 'WEIXIN',
          name: '微信'
        },
        {
          id: 2,
          payType: 'ZHIFUBAO',
          name: '支付宝'
        },
        {
          id: 3,
          payType: 'YINGHANGKA',
          name: '银行卡'
        },
        {
          id: 4,
          payType: 'POS',
          name: 'POS'
        }
      ],
      chargePayType: null
    };
  },
  mounted() {
    this.init(); // 数据初始化
  },
  watch: {
    brandId: function(val) {
      if (val) {
        var _this = this;
        _this.brandList.forEach(brand => {
          if (brand.id == val) {
            _this.shopList = brand.shopList;
            _this.shopId = _this.shopList[0].id;
          }
        });
      }
    },
    shopId: function(val) {
      this.pageQuery();
    },
    dialog_brandId: function(val) {
      this.queryDialogShopByBrand(val);
    }
  },
  methods: {
    init() {
      var _this = this;
      indexApi.getEmpShops(resp => {
        _this.brandList = resp.brandList;
        _this.dialog_brandList = resp.brandList;
        if (_this.brandList && _this.brandList.length > 0) {
          _this.brandId = _this.brandList[0].id;
          _this.dialog_brandId = _this.brandList[0].id;
        }
      });
    },
    queryDialogShopByBrand: function(brandId) {
      const self = this;
      shopApi.queryByBrand(brandId, data => {
        self.dialog_shopList = data;
        if (data && data.length) {
          self.dialog_shopId = data[0].id;
        } else {
          self.dialog_shopList = [];
          self.dialog_shopId = null;
        }
      });
    },
    getDefaulMember: function() {
      this.member.brandId = null;
      this.member.shopId = null;
      return {
        name: "", // 弹出层-输入框用户名
        sex: "F", // 弹出层-单选框性别，0女1男
        mobile: "", // 弹出层-输入框用户手机
        userNo: "", // 弹出层-会员号
        birthday: "", // 弹出层-会员生日
        sourceId: 1 // 来源
      };
    },
    clickAddMember: function() {
      const self = this;
      this.member.brandId = this.dialog_brandId;
      this.member.shopId = this.dialog_shopId;
      dialog.confirm(() => {
        memberApi.addMember(self.member, function(data) {
          self.dialogVipVisible = false;
          self.member = self.getDefaulMember();
          self.init();
          show.success("操作成功");
          self.pageQuery();
        });
      });
    },
    pageQuery: function() {
      const self = this;
      this.params.brandId = this.brandId;
      this.params.shopId = this.shopId;
      this.params.search = this.vipSearch;
      memberApi.pageQuery(this.params, function(data) {
        console.info(data);
        self.params.totalSize = data.totalSize;
        self.params.page = data.page;
        self.vipData = data.list;
        self.dataLoading = false; // loading隐藏
      });
    },
    handleCurrentChange(currentPage) {
      this.params.page = currentPage;
      this.pageQuery();
    },
    handleClick(row) {
      console.log(row);
      let self = this;
      this.selectUser = row;
      this.$router.push({
        path: "/memberDetail",
        query: {
          memberid: row.id
        }
      });
    },
    searchVip() {
      this.params.page = 1;
      this.pageQuery();
    },
    memberCharge(row) {
      this.selectUser = row;
      this.dialogChargeVisiable = true;
      var _this = this;
      this.packageId = null;
      this.chargePayType = null;
      _this.chargePackageList = [];
      memberApi.queryChargePackage((data) => {
        _this.chargePackageList = data;
      })
    },
    goChargeAmount() {
      var _this = this;
      var params = {
        id: this.selectUser.id,
        packageId: this.packageId,
        payType: this.chargePayType
      };
      dialog.confirm(() => {
        memberApi.chargeAmount(params, data => {
          show.success('充值成功');
          _this.dialogChargeVisiable = false;
          _this.pageQuery();
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.huiyuan {
  .huiyuan-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  > div:nth-of-type(2) {
    display: flex;
    margin-top: 20px;
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
  // 更多筛选
  > div:nth-of-type(5) {
    margin-top: 10px;
    > div:nth-of-type(1),
    > div:nth-of-type(2),
    > div:nth-of-type(3) {
      margin-bottom: 3px;
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
  }
  // 表格
  .tableData {
    margin-top: 20px;
    border: 1px solid #f2f2f2;
    border-bottom: 1px solid transparent;
    .userInfo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .userImg {
        width: 50px;
      }
    }
  }
}
</style>
