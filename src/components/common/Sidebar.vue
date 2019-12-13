<template>
    <div class="sidebar">
        <el-menu 
            class="sidebar-el-menu" 
            :default-active="active" 
            :collapse="collapse" 
            unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs && item.subs.length > 0">
                    <el-submenu :index="item.link" :key="item.link">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="item.link" :index="subItem.link">
                            {{ subItem.name }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.link" :key="item.link">
                        <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import menuApi from '@/api/menu/menu'

    export default {
        data(){
            return {
                collapse: true,
                items: [],
                active: ''
            }
        },

        mounted() {
            const _this = this
            console.log(this.$router)
            menuApi.getEmpMenus((data) => {
                _this.items = data
                if (_this.items && _this.items.length > 0) {
                    _this.active = _this.items[0].link;
                }
            })
        },

        computed:{

        },
        created(){ // 监听子组件的collapse
            bus.$on('collapse', msg => {
                console.log(msg);
                this.collapse = msg;
            })
        }
    }
</script>

<style lang="less" scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow: scroll;
        height: 100%;
        &::-webkit-scrollbar {display:none}
        .sidebar-el-menu:not(.el-menu--collapse){
            // width: 250px;
            width: 180px;
        }
        >ul{
            height: 100%;
        }
    }
</style>
