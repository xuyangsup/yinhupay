<template>
    <div class="index">
        <h3>控制台</h3>
        <!-- <el-row type="flex" class="row-bg index-info">
            <el-col :span="8"><div class="grid-content">新增会员：<span class="c63 f30">8</span></div></el-col>
            <el-col :span="8"><div class="grid-content">总营业额：<span class="c63 f30">100000</span></div></el-col>
            <el-col :span="8"><div class="grid-content">客次/订单数：<span class="c63 f30">15/10</span></div></el-col>
        </el-row> -->
        <el-row :gutter="20" class="mgb20 mt20">
            <el-col :span="8">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-1">
                        <i class="el-icon-view grid-con-icon"></i>
                        <div class="grid-cont-right">
                            <div class="grid-num">{{indexData.memberCount}}</div>
                            <div>新增会员</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-2">
                        <i class="el-icon-message grid-con-icon"></i>
                        <div class="grid-cont-right">
                            <div class="grid-num">{{indexData.totalSales}}</div>
                            <div>总营业额</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-3">
                        <i class="el-icon-goods grid-con-icon"></i>
                        <div class="grid-cont-right">
                            <div class="grid-num">{{indexData.guestCount}}/{{indexData.orderCount}}</div>
                            <div>客次/订单数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <!-- <div class="admin-info">
                    <h4>登录人员信息</h4>
                    <div>
                        <img :src="loginUser.avatar" alt="">
                        <div>
                            <span>{{loginUser.name}}</span><br>
                            <span>{{loginUser.roleName}}</span><br>
                        </div>
                    </div>
                    <p><span>登录时间：{{loginUser.loginDate}}</span><br><span>登录地区：中国香港</span></p>
                </div> -->
                <!-- <div class="quick-operation">
                    <h4>快捷操作</h4>
                    <div class="quick-container">
                        <div>
                            <el-card shadow="hover">
                                <img src="../../assets/brand.png" alt="">
                                <span>客服交班</span>
                            </el-card>
                        </div>
                        <div @click="openAppoint">
                            <el-card shadow="hover">
                                <img src="../../assets/brand.png" alt="">
                                <span>立即预约</span>
                            </el-card>
                        </div>
                    </div>
                    <div class="quick-container quick-container2">
                        <div @click="openNowOrder">
                            <el-card shadow="hover">
                                <img src="../../assets/brand.png" alt="">
                                <span>即时开单</span>
                            </el-card>
                        </div>
                        <div>
                            <el-card shadow="hover">
                                <img src="../../assets/brand.png" alt="">
                                <span>待办事项</span>
                            </el-card>
                        </div>
                    </div>
                </div> -->
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div class="brand">
                    <h4>考拉养生集团</h4>
                    <ul>
                        <li v-for="brand in brandList">
                            <div>
                                <img :src="brand.logo" alt="">
                                <div>
                                    <span>{{brand.name}}</span><br>
                                    <span>注册于{{brand.gmtCreated}}</span><br>
                                    <span>拥有门店{{brand.shopCount}}个</span><br>
                                    <span>品牌性质 实体门店</span>
                                </div>
                            </div>
                            <p>{{brand.remark}}</p>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

  import indexApi from '../../api/index/index'

  export default {
    data: function(){
      return {
          loginUser: {

          },

          brandList: [],

          indexData: {

          }


      }
    },

    mounted() {
        this.init()
    },

    methods: {

        init() {
            const _this = this

            indexApi.getIndexData((data) => {
                _this.indexData = data
            })

            indexApi.getIndexBrand((data) => {
                _this.brandList = data
            });

            indexApi.getIndexUserInfo((data) => {
                _this.loginUser = data
            })
        },
        openAppoint() {
            this.$router.push('/open-order');
        },
        openNowOrder() {
            this.$router.push('/open-order');
        }

    }
  }

</script>

<style lang="less" scoped>
    .index{
        h3{
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }
        .index-info{
            padding: 10px 0;
            .grid-content {
                min-height: 40px;
                font-weight: bold;
            }
        }
        .brand{
            min-height: 652px;
            border: 1px solid #ccc;
            // margin-right: 40px;
            margin-top: 20px;
            h4{
                height: 36px;
                line-height: 36px;
                color: #666;
                font-size: 14px;
                padding-left: 15px;
                border-bottom: 1px solid #ccc;
            }
            ul{
                li{
                    color: #999;
                    padding: 20px 20px 10px 20px;
                    border: 1px solid #ccc;
                    margin: 15px;
                    >div{
                        font-size: 12px;
                        display: flex;
                        img{
                            width: 90px;
                            height: 61px;
                            margin: 0 40px 40px 0;
                        }
                        span:nth-of-type(1){
                            font-size: 14px;
                        }
                    }
                    p{
                        text-indent: 2em;
                        font-size: 12px;
                    }
                }
            }
        }
        .admin-info{
            color: #999;
            min-height: 100px;
            border: 1px solid #ccc;
            h4{
                height: 36px;
                line-height: 36px;
                color: #666;
                font-size: 12px;
                padding-left: 15px;
                border-bottom: 1px solid #ccc;
            }
            >div{
                color: #999;
                padding: 20px 20px 10px 20px;
                font-size: 12px;
                display: flex;
                border-bottom: 1px solid #ccc;
                img{
                    width: 90px;
                    height: 61px;
                    margin: 0 40px 40px 0;
                }
            }
            p{
                padding: 10px 20px;
                font-size: 12px;
            }
        }
        .quick-operation{
            margin-top: 20px;
            color: #999;
            min-height: 100px;
            border: 1px solid #ccc;
            h4{
                height: 36px;
                line-height: 36px;
                color: #666;
                font-size: 12px;
                padding-left: 15px;
                border-bottom: 1px solid #ccc;
            }
            .quick-container{
                display: flex;
                justify-content: space-around;
                align-items: center;
                >div{
                    cursor: pointer;
                    margin: 30px 0 0 0;
                    img{
                        width: 90px;
                        height: 61px;
                    }
                    span{
                        display: block;
                        width: 90px;
                        padding-top: 15px; 
                        text-align: center;
                        color: #FFA548;
                    }
                }
            }
            .quick-container2{
                >div{
                    margin-bottom: 30px;
                }
            }
        }
    }

    // -------------------------------------------2018-07-19-xuyang
    .grid-content{
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
        .grid-cont-right{
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
    .grid-con-1 {
        .grid-con-icon{
            background: rgb(45, 140, 240);  
        }
        .grid-num{
            color: rgb(45, 140, 240);
        }
    }
    .grid-con-2 {
        .grid-con-icon{
            background: rgb(100, 213, 114);  
        }
        .grid-num{
            color: rgb(45, 140, 240);
        }
    }
    .grid-con-3 {
        .grid-con-icon{
            background: rgb(242, 94, 67);  
        }
        .grid-num{
            color: rgb(242, 94, 67);
        }
    }
</style>
