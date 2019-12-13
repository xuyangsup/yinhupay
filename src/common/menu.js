import Index from '@/components/page/Index.vue' // 控制台
import Appoint from '@/components/page/appoint/appoint.vue' // 预约中心
import OpenOrder from '@/components/page/order/open-order.vue' // 订单开单
import Order from '@/components/page/order/order.vue' // 订单管理

//报表中心
import YingYe from '@/components/page/forms/YingYe.vue' // 报表中心-营业汇总
import Jishi from '@/components/page/forms/Jishi.vue' // 报表中心-技师业绩
import chuzhi from '@/components/page/forms/chuzhi.vue' // 报表中心-储值统计
import chuzhiInfo from '@/components/page/forms/chuzhiInfo.vue' // 报表中心-储值明细
import memberCharge from '@/components/page/market/MemberCharge.vue' //营销管理-储值套餐
import JishiYeJiDetail from '@/components/page/forms/JishiYeJiDetail.vue' //技师业绩详情'
import JishiProduct from '@/components/page/forms/JishiProduct.vue'//技师鈡数
//营销
import YingXiao from '@/components/page/market/Yingxiao.vue' // 营销管理-营销活动
import HuoDong from '@/components/page/market/Huodong.vue' // 营销管理-活动策略

//会员
import Member from '@/components/page/member/Member.vue' // 会员中心
import MemberDetail from '@/components/page/member/MemberDetail.vue' // 会员详情

import Wechant from '@/components/page/wechant/Wechant.vue' // 微信

import Merchant from '@/components/page/merchant/Merchant.vue' // 商家管理-商家管理
import Brand from '@/components/page/merchant/Brand.vue' // 商家管理-品牌项目
import HelpClock from '@/components/page/merchant/HelpClock.vue' // 商家管理-帮钟管理

//人事管理
import Dept from '@/components/page/staff/dept.vue' // 人事管理-部门管理
import Emp from '@/components/page/staff/emp.vue' // 人事管理-员工管理
import Mech from '@/components/page/staff/mech.vue' // 人事管理-技师管理
import Notice from '@/components/page/staff/notice.vue' // 人事管理-公告管理

import Params from '@/components/page/system/Params.vue' // 系统管理-参数管理
import Role from '@/components/page/system/Role.vue' // 系统管理-角色管理
import Power from '@/components/page/system/Power.vue' // 系统管理-权限管理
import City from '@/components/page/system/City.vue' // 系统管理-城市管理
import Region from '@/components/page/system/Region.vue' // 系统管理-城市区域
import Project from '@/components/page/system/Project.vue' // 系统管理-项目分类
import Channel from '@/components/page/system/Channel.vue' // 系统管理-渠道管理
import PayType from '@/components/page/system/PayType.vue' // 系统管理-收银方式
import Source from '@/components/page/system/Source.vue' // 系统管理-会员来源
import MechLevel from '@/components/page/system/MechLevel.vue' // 系统管理-技师等级
import Label from '@/components/page/system/Label.vue' // 系统管理-标签管理

import Message from '@/components/page/message/Message.vue' // 消息中心
import Log from '@/components/page/data/Log.vue' // 数据监测

import OrderDetail from '@/components/page/order/order-detail.vue'
import OrderEdit from '@/components/page/order/order-edit.vue'
import OrderCash from '@/components/page/order/order-cash.vue'

// 路由
export const menu = [
    {
        title: '首页',
        path: '/index',
        page: Index
    },
    {
        title: '营业汇总',
        path: '/yingye',
        page: YingYe
    },
    {
        title: '预约',
        path: '/appoint',
        page: Appoint
    },
    {
        title: '订单开单',
        path: '/open-order',
        page: OpenOrder
    },
    {
        title: '订单管理',
        path: '/order',
        page: Order
    },
    {
        title: '技师业绩',
        path: '/jishi',
        page: Jishi
    },
    {
        title: '技师业绩详情',
        path: '/JishiYeJiDetail',
        page: JishiYeJiDetail
    },
    {
        title: '技师鈡数',
        path: '/JishiProduct',
        page: JishiProduct
    },
    {
        title: '储值统计',
        path: '/chuzhi',
        page: chuzhi
    },
    {
        title: '储值套餐',
        path: '/memberCharge',
        page: memberCharge
    },
    {
        path: '/chuzhiinfo',
        page: chuzhiInfo,
        title: '会员详情'
    },
    {
        title: '营销活动',
        path: '/yingxiao',
        page: YingXiao
    },
    {
        title: '活动策略',
        path: '/huodong',
        page: HuoDong
    },
    {
        title: '会员中心',
        path: '/member',
        page: Member
    },
    {
        path: '/memberDetail',
        page: MemberDetail,
        title: '会员详情'
    },
    {
        path: '/order-detail',
        page: OrderDetail,
        title: '订单详情'
    },
    {
        path: '/order-edit',
        page: OrderEdit,
        title: '修改订单'
    },
    {
        path: '/order-cash',
        page: OrderCash,
        title: '订单收银'
    },
    {
        title: '微信小程序',
        path: '/wechant',
        page: Wechant
    },
    {
        title: '商家管理',
        path: '/merchant',
        page: Merchant
    },
    {
        title: '品牌项目',
        path: '/brand',
        page: Brand
    },
    {
        title: '帮钟管理',
        path: '/helpClock',
        page: HelpClock
    },
    {
        title: '部门管理',
        path: '/dept',
        page: Dept
    },
     {
        title: '员工管理',
        path: '/emp',
        page: Emp
    },
    {
        title: '技师管理',
        path: '/mech',
        page: Mech
    },
    {
        title: '公告管理',
        path: '/notice',
        page: Notice
    },
    {
        title: '参数管理',
        path: '/params',
        page: Params
    },
    {
        title: '角色管理',
        path: '/role',
        page: Role
    },
    {
        title: '权限管理',
        path: '/power',
        page: Power
    },
    {
        title: '城市管理',
        path: '/city',
        page: City
    },
    {
        title: '城市区域',
        path: '/region',
        page: Region
    },
    {
        title: '项目分类',
        path: '/project',
        page: Project
    },
    {
        title: '渠道管理',
        path: '/channel',
        page: Channel
    },
    {
        title: '收银方式',
        path: '/payType',
        page: PayType
    },
    {
        title: '会员来源',
        path: '/source',
        page: Source
    },
    {
        title: '技师等级',
        path: '/mechLevel',
        page: MechLevel
    },
    {
        title: '标签管理',
        path: '/label',
        page: Label
    }
]
