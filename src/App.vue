<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view />
    <vue-progress-bar></vue-progress-bar>
    <audio muted id="myaudio" style="display: none"></audio>
  </div>
</template>

<script>
    import brandApi from '@/api/brand'
    import menuApi from '@/api/menu/menu'

    export default {
        name: 'App',
        mounted() {
            const store = this.$store
            brandApi.queryByEmp((data) => {
                console.log('============')
                store.commit('increment', data)
            })
        }
    }
</script>

<style>
    @import "./assets/css/main.css";
    @import "./assets/css/common.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>
