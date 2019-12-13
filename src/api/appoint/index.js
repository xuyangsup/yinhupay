import {get, post, postJson} from '../request'

const appointApi = {
    products(shopId,bookTime, success) {

        const params = {
            shopId: shopId,
            bookTime: bookTime
        }
        post('/api/v1/appoint/products', params, success)
    },
    times(day, success) {
        const params = {
            day: day
        }
        get('/api/v1/appoint/times', params, success)
    },
    fetchMech(shopId, success) {

        const params = {
            shopId: shopId
        }
        get('/api/v1/appoint/mechs', params, success)
    },
    fetchRooms(shopId, success) {

        const params = {
            shopId: shopId
        }
        get('/api/v1/appoint/rooms', params, success)
    },
    searchMobile(mobile, success) {

        const params = {
            mobile: mobile
        }
        get('/api/v1/user/searchByMobile', params, success)
    },
    querySource(success) {
        get('/api/v1/source', {}, success)
    },
    saveAppoint(params, success) {
        postJson('/api/v1/appoint/saveAppoint', params, success)
    },
    queryAppointMechView(params, success) {
        get('/api/v1/order/queryAppointMechView', params, success)
    },
    queryAppointRoomView(params, success) {
        get('/api/v1/order/queryAppointRoomView', params, success)
    }
}

export default appointApi
