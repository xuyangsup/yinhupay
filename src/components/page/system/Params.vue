<template>
    <div class="canshu">
        <div class="canshu-title">
            <h3>参数管理</h3>
        </div>
        <div style="margin-top:20px">
            <!-- 菜单状态 -->
            <el-menu
                :default-active="menuStatusIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#ccc"
                text-color="#fff"
                active-text-color="#f63">
                <el-menu-item index="1">系统参数</el-menu-item>
                <el-menu-item index="2">品牌参数</el-menu-item>
                <el-menu-item index="3">门店参数</el-menu-item>
            </el-menu>
        </div>
        <div v-show="menuStatusIndex==='1'">
            tab1
        </div>
        <div v-show="menuStatusIndex==='2'">
            tab2
        </div>
        <div v-show="menuStatusIndex==='3'">
            tab3
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            menuStatusIndex: '1', // 菜单状态-默认下标
        }
    },
    methods: {
        /**
         * 菜单状态切换
         */
        handleSelect(key, keyPath) {
            this.menuStatusIndex = key
            // console.log(key, keyPath)
            console.log(key)
        },
    }
}
</script>

<style lang="less" scoped>
    .canshu{
        .canshu-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
    }
</style>