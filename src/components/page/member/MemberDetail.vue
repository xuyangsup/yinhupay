<template>
    <div class="huiyuanxiangqing">
        <div class="huiyuanxiangqing-title">
            <h3>会员详情</h3>
        </div>
        <div>
            <div>
                <div>
                    <div><img src="static/img/user.png" alt=""></div>
                    <div>
                        <span>{{memberdetail.name}}</span><span><img src="static/img/man.png" alt=""></span><br>
                        <span>{{memberdetail.mobile}}</span><br>
                        <span>会员号：{{memberdetail.userNo}}</span>
                    </div>
                </div>
                <span class="c63 mr10">力度大</span>
            </div>
            <div></div>
            <div>
                <span>注册时间：{{memberdetail.registerTime}}</span><br>
                <span>所属品牌：{{memberdetail.brandName}}</span><br>
                <span>消费总次数：{{memberdetail.totalConsumerTimes}}次  本月消费次数：{{memberdetail.thisMonthConsumerTimes}}次</span><br>
                <span>消费总金额：{{memberdetail.totalConsume}}元</span><br>
                <span>消费频次：2次/周</span><br>
            </div>
        </div>
        <div class="mt10">
            <span class="mr10">消费记录：</span>
            <el-radio v-model="costRecord" label="1"  @change="costRecordClick('1')" border>本月</el-radio>
            <el-radio v-model="costRecord" label="2"  @change="costRecordClick('2')" border>历史</el-radio>
        </div>
        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="orderData"
                style="width: 100%">
                <el-table-column
                    label="会员信息"
                    width="180">
                    <template slot-scope="scope">
                        <div>
                            <span>订单号：{{ scope.row.orderNo }}</span><br>
                            <span style="fontSize: 16px; color: #f63">来源：{{ scope.row.sourceName }}</span><br>
                            <span>预约时间：{{ scope.row.bookTime }}</span><br>
                            <span>人数：{{ scope.row.orderNum }}人</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="项目详情">
                    <template slot-scope="scope">
                        <div v-for="(productMechsDto, index) in scope.row.productMechsDto" :key="index">
                            <p>{{productMechsDto.profuctName}}</p>
                            <span>{{productMechsDto.mechs}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="消费金额">
                    <template slot-scope="scope">
                        <span>总消费：￥{{ scope.row.totalConsume }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="支付方式">
                    <template slot-scope="scope">
                        <span>支付方式：￥{{ scope.row.payType }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="params.currentPage"
                layout="prev, pager, next"
                :page-size="params.pageSize"
                :total="params.totalSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import memberApi from "@/api/member";
export default {
  data() {
    return {
      costRecord: "1", // 消费记录
      orderdto:[],
      orderData: [],
      memberdetail: {
            brandName:null,
            shopId:null,
            userNo:null,
            name:null,
            nickName:null,
            loginName:null,
            sex:null,
            avatar:null,
            address:null,
            birthday:null,
            registerTime:null,
            mobile:null,
            password:null,
            openId:null,
            totalConsume:null,
            totalConsumerTimes:null,
            thisMonthConsumerTimes:null,
            lastConsumeDate:null,
            lastConsume:null
      },
       //查询参数
      params: {
        page: 1,
        pageSize: 4,
        totalSize: 10,
        userId:null,
        type: null,
        currentPage:1
        
      }


    };
  },

  mounted() {
    this.init();
  },
  methods: {
    
    init() {
      const _this = this;
    //  alert(this.$route.query.memberid);
      memberApi.queryOrderDetail(this.$route.query.memberid, data => {
        _this.memberdetail = data;
      });
      this.pageQuery();
    },
    /*
         * 表格-会员详情
         */
        handleClick(row) {
            console.log(row);
             console.log(row.orderId);
             
            let self = this
                this.$router.push({
                    path: '/order-detail',
                    query: {
                        orderId: row.orderId
                    }
                })
        },
    costRecordClick(indeid) {
      const self = this;
     self.costRecord=indeid;
      this.pageQuery()
    },
     /**
     * 分页页码change
     */
    handleSizeChange(val) {
        this.params.pagesize = val;
        alert('22');
//        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
         const self = this;
        self.params.currentPage = val;
        var orderData12 = this.orderdto.slice((self.params.currentPage-1)*self.params.pageSize,self.params.currentPage*self.params.pageSize);
         
        self.orderData = orderData12;
          console.log(orderData12);
      },
    /**
     * 查询订单信息
     */
     pageQuery() {
      const self = this;
     // self.params.cityCode = self.cityCode;
       self.params.userId=this.$route.query.memberid;
       self.params.type=self.costRecord;
       memberApi.queryOrderInfoDetail(self.params, data => {       
         if(data==null){
            this.$message({
          message: "暂无数据",
          type: "success"
        });
         }else{
           self.orderdto=data;
            if(data.length>self.params.pageSize){
             var orderData12 = data.slice((self.params.currentPage-1)*self.params.pageSize,self.params.currentPage*self.params.pageSize);
               console.log(orderData12);
               self.orderData = orderData12;
          }else{
            var orderData121 = data.slice((self.params.currentPage-1)*self.params.pagesize,data.length);
             console.log(data);
             self.orderData = orderData121;
          }
          
         }      
      });
    }
  }
};
</script>

<style lang="less" scoped>
.huiyuanxiangqing {
  .huiyuanxiangqing-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  > div:nth-of-type(2) {
    height: 160px;
    display: flex;
    align-items: center;
    > div:nth-of-type(1) {
      width: 200px;
      > div:nth-of-type(1) {
        display: flex;
        justify-content: space-between;
        > div:nth-of-type(2) {
          > span:nth-of-type(2) {
            display: inline-block;
            margin-left: 4px;
            width: 16px;
            height: 15.5px;
            img {
              height: 100%;
            }
          }
        }
      }
    }
    > div:nth-of-type(2) {
      width: 1px;
      height: 120px;
      margin: 0 40px;
      background: #ccc;
    }
    > div:nth-of-type(3) {
      span {
        font-weight: bold;
      }
    }
  }
  .tableData {
    margin-top: 20px;
    border: 1px solid #f2f2f2;
    border-bottom: 1px solid transparent;
  }
}
</style>