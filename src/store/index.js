import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import menu from './menu'
import power from './power'
import login from './login'

export default new vuex.Store({
    state:{
        show:false,
        menu: menu,
        power: power,
        login: login,
        keyPage: new Date().getTime()
    },

    mutations: {

        increment(state, brandList) {
            console.log('increment')

            console.log(state)

            state.power.brandList = brandList
        },

        loginInfo(state, loginInfo) {
            state.login.user = loginInfo
        }
    }
})
