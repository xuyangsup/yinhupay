// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'  // 默认主题
// import _global from '../static/common.js'
// import '../static/css/theme-green/index.css';    // 浅绿色主题
// import "babel-polyfill"; // 浏览器支持es6
// 引入echarts
import echarts from 'echarts'
import store from './store'
import GoEasy from 'goeasy'
import { Notification } from 'element-ui';
import VueProgressBar from 'vue-progressbar';
import indexApi from './api/index';

var goEasy = new GoEasy({
    appkey: 'BS-81e28a55f3e042fba33cbffe312dc099',
    host: "hangzhou.goeasy.io"
});
goEasy.subscribe({
    channel: "book_order",
    onMessage: function (message) {
        console.log(message);
        var order = JSON.parse(message.content);
        indexApi.getEmpShops((data) => {
            var brandList = data.brandList;
            for (var i = 0;i < brandList.length; i++) {
                for (var j = 0;j < brandList[i].shopList.length;j++) {
                    var shop = brandList[i].shopList[j];
                    if (shop.id == order.shopId ) {
                        var audio = document.getElementById('myaudio');
                        audio.src="https://yinhu-img.oss-cn-shanghai.aliyuncs.com/u-order-play.mp3";
                        audio.play();
                        var msg = "<a href='/#/order-edit?orderId=" + order.id + "' target='_blank'>查看订单详情</a>";
                        Notification.success({
                            title: '您有新的预约订单',
                            dangerouslyUseHTMLString: true,
                            duration: 0,
                            message: msg
                        })
                    }
                }
            }
        })
    }
});
goEasy.subscribe({
    channel: "dianping_order",
    onMessage: function (message) {
        console.log(message);
        var order = JSON.parse(message.content);
        indexApi.getEmpShops((data) => {
            var brandList = data.brandList;
            for (var i = 0;i < brandList.length; i++) {
                for (var j = 0;j < brandList[i].shopList.length;j++) {
                    var shop = brandList[i].shopList[j];
                    if (shop.id == order.shopId ) {
                        var msg = "<a href='/#/order-edit?orderId=" + order.id + "' target='_blank'>查看订单详情</a>";
                        var audio = document.getElementById('myaudio');
                        audio.src="https://yinhu-img.oss-cn-shanghai.aliyuncs.com/dp-order-play.mp3";
                        audio.play();
                        Notification.success({
                            title: '您有新的点评订单',
                            dangerouslyUseHTMLString: true,
                            duration: 0,
                            message: msg
                        })
                    }
                }
            }
        })
    }
});
const options = {
    color: '#2d8cf0',
    failedColor: '#874b4b',
    thickness: '2px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
}

Vue.use(VueProgressBar, options)
Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts

// Vue.prototype._global = 
Vue.config.productionTip = false


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {

    let loginUser = JSON.parse(localStorage.getItem('loginUser'));
    // console.log(loginUser)

    if (!loginUser && to.path !== '/login') {
        //如果未登录跳转登录页面
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


/* eslint-disable no-new */
let newVue = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})

//请求拦截器
axios.interceptors.request.use(config => {
    //在发送请求之前做某事，比如说 设置loading动画显示
    newVue.$Progress.start()
    return config
}, error => {
    //请求错误时做些事
    return Promise.reject(error)
})

//响应拦截器
axios.interceptors.response.use((response) => {
    const data = response.data
    console.log(data)
    newVue.$Progress.finish()
    return response
}, error => {
    console.log(error)
    return error
})