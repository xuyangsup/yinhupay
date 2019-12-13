<template>
  <div class="yuyue">
    <div class="yuyue-title">
      <div class="fr">
        <el-button @click="goAppoint" type="danger">新增预约</el-button>
      </div>
      <h3>预约中心</h3>
    </div>
    <div class="yuyue-container">
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
      <div class="yuyue-info">
        <div>
          <i @click="preDate" class="el-icon-caret-left"></i>
          <div>
            <el-date-picker :clearable="false" v-model="dateVal" type="date" placeholder="选择日期"></el-date-picker>
          </div>
          <i @click="nextDate" class="el-icon-caret-right"></i>
        </div>
        <div>
          <el-radio v-model="radio" label="1">技师纬度</el-radio>
          <el-radio v-model="radio" label="2">房间纬度</el-radio>
        </div>
      </div>
      <!-- 技师与房间维度 -->
      <div class="order-info">
        <div class="order-time fl">
          <div>
            <span>{{radio === '1' ? '技师' : '房间'}}</span>
            <span></span>
            <span>时间</span>
          </div>
          <ul>
            <li v-for="item in orderTimeList" :key="item">{{item}}</li>
          </ul>
        </div>
        <!-- 技师维度 -->
        <div class="order-mech" v-if="radio === '1'">
          <div :style="{width: parentWidth +'px'}">
            <!-- 未指定技师-技师及其订单 -->
            <div class="orderContent" v-for="(mechView, i) in appointMechList" :key="i">
              <div>
                <span>
                  {{mechView.mechDto.name}}
                  {{mechView.mechDto.mechNo == null ? '' : '('+ mechView.mechDto.mechNo +')' }}
                  {{mechView.mechDto.mechType == 2 ? '(帮钟)' : '' }}
                </span>
              </div>
              <ul>
                <li
                  @click="popOrderInfo(item, mechView.mechDto)"
                  @mouseover="notSpecifiedMechIndex = item.random"
                  @mouseout="notSpecifiedMechIndex = -1"
                  :class="[getOrderColor(item.status)]"
                  v-for="(item, index) in mechView.orderDtoList"
                  :key="index"
                  :style="{top: item.top + 'px', left: item.left+ 'px', width: item.width+ 'px', height: item.height+ 'px'}"
                >
                  <el-popover placement="top-start" trigger="hover">
                    <div
                      slot="reference"
                      style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;font-size:12px;border: 1px solid #ccc"
                      :style="{height: item.height+ 'px'}"
                    >
                      <span>
                        预约人: {{item.user.name}}
                        <br />
                        预约人数: {{item.orderNum}}
                        <br />
                        上钟时间: {{item.onClockTime}}
                        <br />
                        下钟时间: {{item.outClockTime}}
                      </span>

                      <!--<span>{{item.user.name}}</span><br>-->
                      <!--<span>{{item.skuName}}</span>-->
                    </div>
                    <div>
                      <span>预约人：{{item.user.name}} {{item.user.mobile}}</span>
                      <br />
                      <!--<span>到店时间：2018年06月14日 15::00:00</span><br>-->
                      <span>预约时间：{{item.bookDate}} {{item.bookHm}}</span>
                      <br />
                      <span>预约人数：{{item.orderNum}}人</span>
                      <br />
                      <span>订单编号：{{item.orderNo}}</span>
                      <br />
                      <span v-if="item.onClockTime">上钟时间: {{item.onClockTime}}</span>
                      <br />
                      <span v-if="item.outClockTime">下钟时间: {{item.outClockTime}}</span>
                      <br />
                      <div v-for="guest in item.guestList">
                        <span>所属客次：{{guest.name}}</span>
                        <br />
                        <div v-for="product in guest.productList">
                          <span>{{product.productName}}</span>
                          <br />
                        </div>
                      </div>
                    </div>
                  </el-popover>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 房间维度 -->
        <div class="order-room" v-else>
          <div :style="{width: parentWidth +'px'}">
            <div class="orderContent" v-for="(roomView, i) in appointRoomList" :key="i">
              <div>
                <span>
                  {{roomView.roomDto.name}}
                  <br />
                  {{roomView.roomDto.bedCount ? '(' + roomView.roomDto.bedCount + '人间)': ''}}
                </span>
              </div>
              <ul>
                <li
                  @click="popOrderInfo(item)"
                  @mouseover="orderIndex = item.random"
                  @mouseout="orderIndex = -1"
                  :class="[getOrderColor(item.status)]"
                  v-for="item in roomView.orderDtoList"
                  :key="item.id"
                  :style="{top: item.top + 'px', left: item.left+ 'px', width: item.width+ 'px', height: item.height+ 'px'}"
                >
                  <el-popover placement="top-start" trigger="hover">
                    <div
                      slot="reference"
                      style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;font-size:12px;border: 1px solid #ccc"
                      :style="{height: item.height+ 'px'}"
                    >
                      <span>预约人: {{item.user.name}}</span>
                      <br />
                      <span>手机号: {{item.user.mobile}}</span>
                      <br />
                    </div>
                    <div>
                      <span>预约人：{{item.user.name}} {{item.user.mobile}}</span>
                      <br />
                      <span>预约时间：{{item.bookDate}} {{item.bookHm}}</span>
                      <br />
                      <span>预约人数：{{item.orderNum}}人</span>
                      <br />

                      <span>订单编号：{{item.orderNo}}</span>
                      <br />
                      <div v-for="guest in item.guestList">
                        <span>所属客次：{{guest.name}}</span>
                        <br />
                        <div v-for="product in guest.productList">
                          <span>{{product.productName}}</span>
                          <br />
                        </div>
                      </div>
                    </div>
                  </el-popover>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 订单颜色 -->
      <div class="order-color">
        <ul>
          <li>
            <div class="order-bg-wdd"></div>
            <span>未到店</span>
          </li>
          <li>
            <div class="order-bg-jyq"></div>
            <span>将逾期</span>
          </li>
          <li>
            <div class="order-bg-fwz"></div>
            <span>服务中</span>
          </li>
          <li>
            <div class="order-bg-ywc"></div>
            <span>已完成</span>
          </li>
          <li>
            <div class="order-bg-yqx"></div>
            <span>已取消</span>
          </li>
        </ul>
      </div>
      <!-- 订单弹出层 -->
      <el-dialog title="操作订单" :visible.sync="dialog.orderInfo" width="56%" v-loading="true">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div>
            <span>预约人：{{dialog.data.user ? dialog.data.user.name : ''}} {{dialog.data.user ? dialog.data.user.mobile: ''}}</span>
            <br />
            <!--<span>到店时间：2018年06月14日 15:00:00</span><br>-->
            <!--<span>所属客次：预约人1</span><br>-->
            <span>预约时间：{{dialog.data.bookDate}} {{dialog.data.bookHm}}</span>
            <br />
            <span>预约人数：{{dialog.data.orderNum}}人</span>
            <br />
            <span>订单编号：{{dialog.data.orderNo}}</span>
            <br />
            <span>用户备注: {{dialog.data.userRemark}}</span>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix">
            <span>预约人信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div>
            <div
              v-for="guest in dialog.data.guestList"
              style="border-bottom: 1px solid #f2f2f2;padding: 3px 0;"
              :key="guest.id"
            >
              <span>{{guest.name}}</span>
              <br />
              <!--<span>技师：8号(巩俐尼)</span><br>-->
              <span
                v-for="product in guest.productList"
                :key="product.id"
              >项目：{{product.productName}}</span>
              <br />
            </div>
          </div>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="editOrder">修改订单</el-button>
          <el-button type="danger" @click="cancelOrder">取消订单</el-button>
          <el-button
            type="success"
            v-if="selOrder != null && selOrder.clock == 0"
            @click="onClock"
          >上钟</el-button>
          <el-button
            type="success"
            v-if="selOrder != null && selOrder.clock == 1"
            @click="outClock"
          >下钟</el-button>
          <el-button type="warning" @click="cashOrder">收&nbsp;&nbsp;银</el-button>
          <el-button type="primary" @click="popOrderDetail">订单详情</el-button>
          <el-button type="primary" @click="isvConsume">到店核销</el-button>
        </span>
      </el-dialog>
      <!-- 订单收银 -->
      <el-dialog title="订单收银" :visible.sync="dialog.orderCash" width="56%">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单状态</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div>
            <span>订单编号：201806141500556890</span>
            <br />
            <span>预约人：刘女士 18920918719</span>
            <br />
            <span>门店：天山大厦店(考拉时光)</span>
            <br />
            <span>到店时间：2018-01-19 12:08:55</span>
            <br />
            <span>订单来源：点评预订</span>
            <br />
            <span>预约人数：2人</span>
            <br />
            <span>用户备注：需要男女技师各一名</span>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix">
            <span>客次信息</span>
          </div>
          <div>
            <el-checkbox-group v-model="checkedOrders">
              <el-checkbox v-for="(order,index) in orderCashList" :label="order" :key="index">
                <div style="padding: 3px 0;">
                  <span>预约人1：柳腔房01床</span>
                  <br />
                  <span>项目：精油SPA(100分钟) ￥258</span>
                  <br />
                  <span>技师：牛慧慧(01号) 轮排</span>
                  <br />
                  <span>业绩： 258元 提成100元</span>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix">
            <span>支付方式</span>
          </div>
          <ul class="payStyle">
            <li v-for="(item, index) in orderPayStyleList" :key="index">
              <span :class="{active : item.status}" @click="item.status=!item.status">{{item.name}}</span>
              <el-input placeholder="请输入内容" v-model="item.val" :disabled="!item.status"></el-input>
            </li>
          </ul>
        </el-card>
        <span slot="footer" class="dialog-footer" style="color: #f63;fontSize: 20px;">
          <span>总计：￥554 减免：￥50 实收：￥504 未收银</span>
          <el-button type="warning">收&nbsp;&nbsp;银</el-button>
        </span>
      </el-dialog>
      <!-- 订单详情 -->
      <el-dialog title="订单详情" :visible.sync="dialog.orderInfoDetail" width="56%">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单状态((已完成)</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div>
            <span>订单编号：201806141500556890</span>
            <br />
            <span>预约人：刘女士 18920918719</span>
            <br />
            <span>门店：天山大厦店(考拉时光)</span>
            <br />
            <span>到店时间：2018-01-19 12:08:55</span>
            <br />
            <span>订单来源：点评预订</span>
            <br />
            <span>预约人数：2人</span>
            <br />
            <span>用户备注：需要男女技师各一名</span>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix">
            <span>客次信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div>
            <p style="border-bottom: 1px solid #f2f2f2;padding: 3px 0;">
              <span>预约人1：柳腔房01床</span>
              <br />
              <span>项目：精油SPA(100分钟) ￥258</span>
              <br />
              <span>技师：牛慧慧(01号) 轮排</span>
              <br />
              <span>业绩： 258元 提成100元</span>
            </p>
            <p style="border-bottom: 1px solid #f2f2f2;padding: 3px 0;">
              <span>预约人2：柳腔房02床</span>
              <br />
              <span>项目：精油SPA(100分钟) ￥258</span>
              <br />
              <span>技师：牛慧慧(01号) 轮排</span>
              <br />
              <span>业绩： 258元 提成100元</span>
            </p>
          </div>
        </el-card>
        <span
          slot="footer"
          class="dialog-footer"
          style="color: #f63;fontSize: 20px;"
        >总计：￥554 减免：￥50 实收：￥504 未收银</span>
      </el-dialog>
      <!-- 选择时间-->
      <el-dialog title="选择时间" :visible.sync="showPickClickTimeDialog" width="20%">
        <el-date-picker
          v-model="pickClockTime"
          type="datetime"
          format="HH:mm"
          :editable="false"
          :clearable="false"
          placeholder="选择日期时间">
        </el-date-picker>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showPickClickTimeDialog = false">取 消</el-button>
            <el-button type="warning" @click="surePickClockTime()">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import brandApi from "@/api/brand";
import utils from "@/common/utils";
import shopApi from "@/api/shop";
import moment from "moment";
import appointApi from "@/api/appoint";
import scheduler from "@/common/scheduler";
import orderApi from "@/api/order/order";
import dialog from "@/common/dialog";
import show from "@/common/show";
import indexApi from "@/api/index";

export default {
  data() {
    return {
      screenWidth: document.body.clientWidth,
      timeoutId: null,
      brandId: null,
      brandList: [],
      shopId: null,
      shopList: [],
      select_brand: "考拉时光1", // 默认选择品牌
      appointMechList: [],
      appointRoomList: [],
      storeIndex: 0, // 默认门店下标
      dateVal: moment().format("YYYY-MM-DD"), // 日期
      radio: "1", // 纬度-默认技师为1，房间为2
      orderTimeList: [
        // 预约订单时刻表
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
      ],
      notSpecifiedMechIndex: -1, // 默认鼠标离开为指定技师订单下标为-1
      orderIndex: -1, // 默认鼠标离开订单下标为-1
      // dialogOrderInfo: false, // 默认订单弹出层不显示
      dialog: {
        // 弹出层
        orderInfo: false, // 默认订单弹出层不显示
        orderInfoDetail: false, // 默认订单详情不显示
        data: {}, // 订单弹出层数据
        orderCash: false // 订单收银
      },
      orderCashList: [
        // 收银订单
        { id: 1 },
        { id: 2 }
      ],
      checkedOrders: [], // 订单收银选择订单数组
      input1: "",
      orderPayStyleList: [
        { name: "支付宝", status: true, val: 296 },
        { name: "POS", status: false, val: 296 },
        { name: "口碑网", status: false, val: 296 },
        { name: "微信", status: false, val: 296 },
        { name: "大众点评", status: false, val: 296 },
        { name: "减免", status: false, val: 296 }
      ],
      selMech: null,
      selOrder: null,
      parentWidth: 0,
      inClockTime: new Date(),
      showPickClickTimeDialog: false,
      pickClockTime: new Date(),
      actionClockType: 'onClock'
    };
  },
  mounted() {
    let self = this;
    this.init();
  },
  beforeDestroy() {
    clearInterval(this._cache_timeout_id_);
  },
  watch: {
    brandId: function(val) {
      if (val) {
        var _this = this;
        this.brandList.forEach(brand => {
          if (val == brand.id) {
            _this.shopList = brand.shopList;
            _this.shopId = _this.shopList[0].id;
          }
        });
      }
    },
    shopId: function(newVal, oldVal) {
      if (newVal) {
        //切换门店
        this.dateVal = moment().format("YYYY-MM-DD");
        this.queryAppointView();
      }
    },
    radio(newVal, oldVal) {
      this.queryAppointView();
    },
    dateVal(newVal, oldVal) {
      if (newVal) {
        this.queryAppointView();
      }
    }
  },
  methods: {
    init() {
      this.queryBrand();
    },
    goAppoint() {
      this.$router.push({
        path: "/open-order"
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
    queryAppointView() {
      if (!this.shopId || !this.dateVal) {
        return;
      }
      if (this.radio == "1") {
        this.queryAppointMechView();
      } else {
        this.queryAppointRoomView();
      }
    },
    queryAppointMechView() {
      let params = {
        shopId: this.shopId,
        day: moment(this.dateVal).format("YYYY-MM-DD")
      };
      let self = this;
      let eleven = moment(params.day + " " + "11:00", "YYYY-MM-DD HH:mm");
      console.log(eleven);
      var random = 0;
      appointApi.queryAppointMechView(params, data => {
        self.parentWidth = (data.appointMechViewList.length + 1) * 124;
        data.appointMechViewList.forEach(item => {
          let orders = item.orderDtoList;
          orders.forEach(item => {
            item.start_date = moment(item.bookTime).toDate();
            item.end_date = moment(item.bookTime + item.duration * 60 * 1000).toDate();
            //计算时间
            item.bookDate = moment(item.bookTime).format("YYYY-MM-DD");
            item.bookHm = moment(item.bookTime).format("HH:mm");
            //上钟时间
            if (item.onClockTime) {
              //下钟时间 = 上钟时间 + 服务时长
              if (!item.outClockTime) {
                  item.outClockTime = moment(item.onClockTime + item.duration * 60 * 1000).format("HH:mm");
              } else {
                  item.outClockTime = moment(item.outClockTime).format("HH:mm");
              }
              item.onClockTime = moment(item.onClockTime).format("HH:mm");
            }
          });

          scheduler.preRenderEvents(orders);
          orders.forEach(item => {
            let top =
              (moment(item.bookTime)
                .toDate()
                .getTime() -
                eleven.toDate().getTime()) /
              60000;

            item.top = (top * 66) / 60;
            item.height = (item.duration * 66) / 60;

            var ev_count = item._count || 1;
            var ev_sorder = item._sorder || 0;

            var width = Math.floor(122 / ev_count);
            var left = ev_sorder * width + (ev_sorder + 1);
            if (!item._inner) width = width * (ev_count - ev_sorder);

            item.width = width;
            item.left = left;

            item.random = random++;
          });
        });
        console.log(data.appointMechViewList);
        self.appointMechList = data.appointMechViewList;
      });
    },
    queryAppointRoomView() {
      let params = {
        shopId: this.shopId,
        day: moment(this.dateVal).format("YYYY-MM-DD")
      };
      let self = this;
      let eleven = moment(params.day + " " + "11:00", "YYYY-MM-DD HH:mm");
      console.log(eleven);

      var random = 0;
      appointApi.queryAppointRoomView(params, data => {
        self.parentWidth = (data.appointRoomViewList.length + 1) * 124;
        data.appointRoomViewList.forEach(item => {
          let orders = item.orderDtoList;

          orders.forEach(item => {
            item.start_date = moment(item.bookTime).toDate();
            item.end_date = moment(
              item.bookTime + item.duration * 60 * 1000
            ).toDate();

            //计算时间
            item.bookDate = moment(item.bookTime).format("YYYY-MM-DD");
            item.bookHm = moment(item.bookTime).format("HH:mm");
          });

          scheduler.preRenderEvents(orders);
          orders.forEach(item => {
            let top =
              (moment(item.bookTime)
                .toDate()
                .getTime() -
                eleven.toDate().getTime()) /
              60000;
            item.top = (top * 66) / 60;
            item.height = (item.duration * 66) / 60;

            var ev_count = item._count || 1;
            var ev_sorder = item._sorder || 0;

            var width = Math.floor(122 / ev_count);
            var left = ev_sorder * width + (ev_sorder + 1);
            if (!item._inner) width = width * (ev_count - ev_sorder);

            item.width = width;
            item.left = left;

            item.random = random++;
          });
        });
        self.appointRoomList = data.appointRoomViewList;
      });
    },
    clickStore(shopId) {
      this.shopId = shopId;
    },
    preDate() {
      let date = moment(this.dateVal, "YYYY-MM-DD").toDate();
      this.dateVal = moment(date.getTime() - 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD"
      );
      console.info("preDate=>", this.dateVal);
    },
    nextDate() {
      let date = moment(this.dateVal, "YYYY-MM-DD").toDate();
      this.dateVal = moment(date.getTime() + 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD"
      );
      console.info("preDate=>", this.dateVal);
    },
    getOrderColor(status) {
      switch (status) {
        case "NOT_ARRIVAL":
          return "order-wdd";
        case "WILL_OUT_DATE":
          return "order-jyq";
        case "SERVICING":
          return "order-fwz";
        case "FINISHED":
          return "order-ywc";
        case "CANCEL":
          return "order-yqx";
      }
    },
    popOrderInfo(item, mech) {
      let self = this;
      self.selMech = mech;
      self.selOrder = item;
      this.dialog.orderInfo = true;
      orderApi.queryOrderDetail(item.id, data => {
        //计算时间
        data.bookDate = moment(data.bookTime).format("YYYY-MM-DD");
        data.bookHm = moment(data.bookTime).format("HH:mm");
        self.dialog.data = data;
      });
    },
    onClock() {
      this.showPickClickTimeDialog = true;
      this.actionClockType = 'onClock';
    },
    surePickClockTime() {
        var _this = this;
        var params = {
            orderId: this.selOrder.id,
            mechId: this.selMech.id,
            clockTime: this.pickClockTime.getTime()
        }
        if (this.actionClockType === 'onClock') {
            orderApi.onClock(params, (data) => {
                _this.dialog.orderInfo = false;
                show.success('上鈡成功');
                _this.queryAppointView();
                _this.showPickClickTimeDialog = false;
            });
        } else {
            orderApi.outClock(params, (data) => {
                _this.dialog.orderInfo = false;
                show.success('下鈡成功');
                _this.queryAppointView();
                _this.showPickClickTimeDialog = false;
            })
        }
    },
    outClock() {
      this.showPickClickTimeDialog = true;
      this.actionClockType = 'outClock';
    },
    cancelOrder() {
      let self = this;
      dialog.confirm(() => {
        orderApi.cancelOrder(self.selOrder.id, data => {
          self.dialog.orderInfo = false;
          show.success(data);
          self.queryAppointView();
        });
      });
    },
    editOrder() {
      let self = this;
      this.$router.push({
        path: "/order-edit",
        query: {
          orderId: self.selOrder.id
        }
      });
    },
    cashOrder() {
      let self = this;
      this.$router.push({
        path: "/order-cash",
        query: {
          orderId: self.selOrder.id
        }
      });
    },
    isvConsume() {
      let _this = this;
      var params = {
        id: this.selOrder.id
      }
      dialog.confirm(() => {
        orderApi.isvConsume(params, (data) => {
          show.success('核销成功');
        })
      })
    },
    popOrderDetail() {
      let self = this;
      this.$router.push({
        path: "/order-detail",
        query: {
          orderId: self.selOrder.id
        }
      });
    }
  },
  created() {
    this.dateVal = new Date().getTime();
  }
};
</script>

<style lang="less" scoped>
.yuyue {
  .yuyue-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  .yuyue-container {
    padding: 10px 0 0 0;
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
    .yuyue-info {
      border: 1px solid #ccc;
      min-height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      > div:nth-of-type(1) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        i {
          padding: 10px;
          cursor: pointer;
        }
      }
      > div:nth-of-type(2) {
        padding-right: 40px;
      }
    }
    .order-info {
      // overflow: hidden;
      min-height: 860px;
      margin: 10px 0;
      border: 1px solid #ccc;
      position: relative;
      margin-bottom: 43px;
      // overflow-x: auto;
      .order-time {
        border-right: 1px solid #f2f2f2;
        position: absolute;
        background-color: rgb(252, 252, 252);
        > div {
          width: 160px;
          height: 80px;
          border-bottom: 1px solid #f2f2f2;
          position: absolute;
          span:nth-of-type(1) {
            position: absolute;
            right: 20%;
            top: 20%;
          }
          span:nth-of-type(2) {
            display: inline-block;
            width: 180px;
            height: 1px;
            background: #f2f2f2;
            position: absolute;
            top: 39px;
            left: -10px;
            transform: rotate(26deg);
            -ms-transform: rotate(26deg); /* IE 9 */
            -moz-transform: rotate(26deg); /* Firefox */
            -webkit-transform: rotate(26deg); /* Safari 和 Chrome */
            -o-transform: rotate(26deg); /* Opera */
          }
          span:nth-of-type(3) {
            position: absolute;
            left: 20%;
            bottom: 20%;
          }
        }
        > ul {
          overflow: hidden;
          margin-top: 80px;
          width: 160px;
          li {
            height: 65px;
            line-height: 65px;
            text-align: center;
            border-bottom: 1px solid #f2f2f2;
          }
          li:last-child {
            border-bottom: 1px solid transparent;
          }
        }
      }
      .order-mech,
      .order-room {
        margin-left: 160px;
        overflow-y: hidden;
        overflow-x: auto;
        // overflow: hidden;
        > div {
          .orderContent {
            float: left;
            width: 124px;
            min-height: 951px;
            border-right: 1px solid #f2f2f2;
            > div {
              text-align: center;
              height: 80px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-bottom: 1px solid #f2f2f2;
            }
            > ul {
              width: 100%;
              background: skyblue;
              position: relative;
              li {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                cursor: pointer;
                .hover-info {
                  padding: 10px;
                  position: absolute;
                  top: 0;
                  // left: 185px;
                  height: auto;
                  // width: 100%;
                  min-width: 180px;
                  color: #fff;
                  background: rgba(0, 0, 0, 0.7);
                }
              }
              li.order-wdd {
                // 未到店
                background: #ff6633;
              }
              li.order-jyq {
                // 将预期
                background: #ff0000;
              }
              li.order-fwz {
                // 服务中
                background: #00cc66;
              }
              li.order-ywc {
                // 已完成
                background: #00ccff;
              }
              li.order-yqx {
                // 已取消
                background: #cccccc;
              }
            }
          }
        }
      }
    }
    // 订单颜色
    .order-color {
      position: fixed;
      bottom: 0px;
      background: #fff;
      width: 100%;
      ul {
        overflow: hidden;
        border: 1px solid #f2f2f2;
        padding: 10px 20px;
        padding-left: 160px;
        li {
          float: left;
          display: flex;
          align-items: center;
          margin-right: 20px;
          > div {
            // 未到店
            background: #ccc;
            width: 20px;
            height: 20px;
            margin-right: 15px;
          }
          .order-bg-wdd {
            background: #f63;
          }
          .order-bg-jyq {
            background: #f00;
          }
          .order-bg-fwz {
            background: #0c6;
          }
          .order-bg-ywc {
            background: #0cf;
          }
          .order-bg-yqx {
            background: #ccc;
          }
        }
      }
    }
  }
}
.el-checkbox {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f2f2f2;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.payStyle {
  overflow: hidden;
  li {
    float: left;
    display: flex;
    margin: 10px 20px 0 0;
    span {
      min-width: 80px;
      line-height: 32px;
      text-align: center;
      border: 1px solid #e4e7ed;
      cursor: pointer;
      color: #999;
    }
    span.active {
      color: #ff6633;
      border: 1px solid #ff6633;
    }
  }
}
.el-card__body {
  padding: 0;
}
</style>
