<template>
    <div class="dingdankaidan">
        <div class="dingdankaidan-title">
            <h3>订单详情</h3>
        </div>
        <div v-if="order">
            <el-card class="box-card mt20">
                <div slot="header" class="clearfix">
                    <span>订单状态((已完成)</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                <div>
                    <span>订单编号：{{order.orderNo}}</span><br>
                    <span>预约人：{{order.user.name}} {{order.user.mobile}}</span><br>
                    <span>门店：{{order.shop.name}}({{order.brand.name}})</span><br>
                    <span>预约时间：{{order.bookTime}}</span><br>
                    <span>订单来源：点评预订</span><br>
                    <span>预约人数：{{order.orderNum}}人</span><br>
                    <span>用户备注：{{order.userRemark}}</span>
                </div>
            </el-card>
            <el-card class="box-card" style="margin-top: 10px;">
                <div slot="header" class="clearfix">
                    <span>客次信息</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                <div>
                    <div v-for="guest in order.guestList" :key="guest.id" style="border-bottom: 1px solid #f2f2f2;padding: 3px 0;">
                        <div>
                            <span>姓名：{{guest.name}} </span>
                                <div>房间信息：
                                <span class="mr20" v-for="rooml in guest.roomList" title="房间">
                                &nbsp;&nbsp;&nbsp;&nbsp;{{rooml.name}}
                            </span>
                                
                                </div>
                        </div>
                        <div >服务信息：
                            <span class="mr20" v-for="product in guest.productList">
                                {{product.productName}} &nbsp;&nbsp;&nbsp;&nbsp;￥{{product.productPrice}}
                            </span>
                            <p class="mr20 pl20" v-for="mech in guest.mechList">
                                <span class="mr20">{{mech.name}}({{mech.mechNo}}) </span>
                                <span>业绩：{{mech.sale}}元&nbsp;&nbsp;&nbsp;&nbsp;提成{{mech.money}}元</span>
                            </p>
                        </div>
                    </div>
                </div>
            </el-card>
            <div class="total">
                <span>总计: ￥{{order.totalFee}}</span>
                <span>减免: ￥{{order.discount}}</span>
                <span>实收: ￥{{order.shiShou}}({{order.payType}})</span>
                <span>未收银: ￥{{order.notPay}}</span>
            </div>
            <div class="total">
                <span>收银方式: 
                    <li  
                v-for="(item,index) in order.orderPayList"
                :key="index" >
                    <el-button size="mini" plain>{{item.payTypeName}}:{{item.payAmount}}</el-button>
                </li>
                </span>
                 
            </div>
        </div>
    </div>
</template>

<script>
    import orderApi from '@/api/order/order'
    import moment from 'moment'

    export default {
        data() {
            return {
                order: null
            }
        },
        mounted() {
            let self = this
            orderApi.queryOrderDetail(this.$route.query.orderId, (data) => {
                data.bookTime = moment(data.bookTime).format('YYYY-MM-DD HH:mm')
                self.order = data
            })
        },
        computed: {

        },
        watch: {

        },
        methods: {

        }
    }
</script>

<style lang="less" scoped>
    .dingdankaidan{
        .dingdankaidan-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
        .pl20{
            padding-left: 20px
        }
        .mr20{
            margin-right: 20px
        }
        .total{
            margin-top: 20px;
            padding: 10px 20px;
            border: 1px solid #f2f2f2;
            color: #f63;
            font-size: 20px;
            span{
                margin-right: 10px
            }
        }
    }
</style>
