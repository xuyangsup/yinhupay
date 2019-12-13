<template>
    <div class="index">
        <h3>404</h3>
        
    </div>
</template>

<script>
    export default {
        data: function(){
            return {}
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
            margin-right: 40px;
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
</style>