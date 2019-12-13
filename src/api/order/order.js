import {get, post, postJson} from '@/api/request'

let orderApi = {

    pageQuery(params, success) {
        postJson('/api/v1/order/pageQuery', params, success)
    },

    queryOrderDetail(orderId, success) {
        let params = {
            orderId: orderId
        }
        get('/api/v1/order/queryOrderDetail', params, success)
    },

    onClock(params, success) {
        postJson('/api/v1/order/onClock', params, success)
    },

    outClock(params, success) {
        postJson('/api/v1/order/outClock', params, success)
    },

    cancelOrder(orderId, success) {
        let params = {
            orderId: orderId
        }
        post('/api/v1/order/cancelOrder', params, success)
    },

    editOrder(order, success) {
        postJson('/api/v1/order/editOrder', order, success)
    },

    getPayTypeList(success) {
        get('/api/v1/payType/getList', {}, success)
    },

    cashOrder(order, success) {
        postJson('/api/v1/order/cashOrder', order, success)
    },
    
    isvConsume(params, success) {
        postJson('/api/v1/appoint/isvConsume', params, success)
    }
}

export default orderApi
