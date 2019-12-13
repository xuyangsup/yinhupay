<template>
    <div class="jishuguanli">
        <div class="jishuguanli-title">
            <div class="fr"><el-button type="danger" @click="dialogAddVisible=true">添加技师</el-button></div>
            <h3>技师管理</h3>
        </div>
        <div class="jishuguanli-container">
            <div>
                <span>品牌</span>
                <el-select v-model="brandId" placeholder="选择品牌" class="handle-select mr10">
                    <el-option
                    v-for="item in brandList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <ul>
                <li :class="{active : shopId === item.id}"
                v-for="(item,index) in shopList"
                :key="item.id" @click="clickStore(item.id)">
                    <el-button size="mini" plain>{{item.name}}</el-button>
                </li>
            </ul>
        </div>
        <div class="mt20">
            <span class="mr10">技师名称</span>
            <el-input style="width:20%" placeholder="请输入技师名称/关键字" v-model="params.search" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                v-loading="dataLoading"
                :data="mechList"
                style="width: 100%">
                <el-table-column
                    label="员工名称(工号)"
                    width="180">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.row.name }}({{scope.row.mechNo}})</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="所属门店(品牌)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.shopName }}({{scope.row.brandName}})</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="联系方式">
                    <template slot-scope="scope">
                        <span>{{ scope.row.mobile }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="在职状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status == 1 ? '在职' : '离职'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="入职时间/离职时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.entryTime}} / {{scope.row.leaveTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="260">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>  
                        <el-button @click="handleClickDimission(scope.row)" type="text" size="small">办理离职</el-button>
                        <el-button @click="handleClickChangeStore(scope.row)" type="text" size="small">办理转店</el-button>
                        <el-button @click="handleClickSignIn(scope.row)" type="text" size="small">签到信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                background
                @current-change="handleCurrentChange"
                layout="prev, pager, next"
                :page-size="params.pageSize"
                :total="params.totalSize">
            </el-pagination>
        </div>

        <!-- 弹出框-技师信息 -->
        <el-dialog title="技师信息" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div class="flex-layout">
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">员工名称</span>
                        <el-input style="width: 66%" v-model="mech.name" placeholder="请输入员工名称"></el-input>
                    </div>
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">员工编号</span>
                        <el-input style="width: 66%" v-model="mech.mechNo" placeholder="请输入员工编号"></el-input>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 25%; display: inline-block; text-align: right" class="mr10">所属门店</span>
                        <el-select style="width: 62%" v-model="mech.shopId" placeholder="请选择所属门店">
                            <el-option
                            v-for="item in shopList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span style="width: 25%; display: inline-block; text-align: right" class="mr10">技师等级</span>
                        <el-select style="width: 62%" v-model="mech.levelId" placeholder="请选择技师等级">
                            <el-option
                            v-for="item in mechLevelList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 26%; display: inline-block; text-align: right" class="mr10">联系方式</span>
                        <el-input style="width: 65%" v-model="mech.mobile" placeholder="请输入联系方式"></el-input>
                    </div>
                    <div>
                        <span style="width: 29%; display: inline-block; text-align: right" class="mr10">出生日期</span>
                        <el-date-picker
                            style="width: 59%"
                            v-model="mech.birthday"
                            type="date"
                            placeholder="选择出生日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div style="display:flex;">
                        <span style="width: 24%; display: inline-block; text-align: right;margin-right:22px">员工头像</span>
                        <el-upload
                            ref="activityUpload"
                            class="avatar-uploader"
                            action="/api/v1/image/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="mech.avatar" style="width:80px;height:80px" :src="IMAGE_URL + mech.avatar" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <div>
                        <div>
                            <span style="width: 25%; display: inline-block; text-align: right" class="mr10">技师性别</span>
                            <el-select style="width: 62%" v-model="mech.sex" placeholder="请选择技师性别">
                                <el-option
                                    v-for="item in sexList"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <span style="width: 29%; display: inline-block; text-align: right" class="mr10">紧急联系人</span>
                            <el-input style="width: 60%" v-model="mech.contact" placeholder="请输入紧急联系人"></el-input>
                        </div>
                        <div class="mt10">
                            <span style="width: 29%; display: inline-block; text-align: right" class="mr10">联系人电话</span>
                            <el-input style="width: 60%" v-model="mech.contactMobile" placeholder="请输入联系人电话"></el-input>
                        </div>
                        <div class="mt10">
                            <span style="width: 30%; display: inline-block; text-align: right" class="mr10">与联系人关系</span>
                            <el-input style="width: 60%" v-model="mech.contactLink" placeholder="请输入与联系人关系"></el-input>
                        </div>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 26%; display: inline-block; text-align: right" class="mr10">在职状态</span>
                        <el-select style="width: 62%" v-model="mech.status" placeholder="请选择在职状态">
                            <el-option
                            v-for="item in dialog_entryStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span style="width: 29%; display: inline-block; text-align: right" class="mr10">入职时间</span>
                        <el-date-picker
                            style="width: 59%"
                            v-model="mech.entryTime"
                            type="date"
                            placeholder="选择入职时间">
                        </el-date-picker>
                    </div>
                </div>
                <div class="mt10">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">籍贯地址</span>
                    <el-input style="width: 76%" v-model="mech.nativeAddress" placeholder="请输入籍贯地址"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">现在住址</span>
                    <el-input style="width: 76%" v-model="mech.address" placeholder="请输入现在住址"></el-input>
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">员工简介</span>
                    <el-input
                        style="width: 77%"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="请输入员工简介"
                        v-model="mech.remark">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="warning" @click="clickAddMech">保存</el-button>
            </span>
        </el-dialog>

        <!-- 弹出框-办理技师离职 -->
        <el-dialog title="办理技师离职" :visible.sync="dialogDimissionVisible" :close-on-click-modal="false">
            <div>
                <div class="flex-layout">
                    <div>
                        <span style="width: 26%; display: inline-block; text-align: right" class="mr10">技师名称</span>
                        <el-input style="width: 66%" v-model="mech.name" disabled></el-input>
                    </div>
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">技师工号</span>
                        <el-input style="width: 66%" v-model="mech.mechNo" disabled></el-input>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 25%; display: inline-block; text-align: right" class="mr10">技师等级</span>
                        <el-select style="width: 62%" v-model="mech.levelId" disabled  placeholder="请选择技师等级">
                            <el-option
                            v-for="item in mechLevelList"
                            :key="item.id"
                            
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span style="width: 29%; display: inline-block; text-align: right" class="mr10">出生日期</span>
                        <el-date-picker
                            style="width: 60%"
                            disabled
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="mech.birthday"
                            type="date"
                            placeholder="选择出生日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 26%; display: inline-block; text-align: right" class="mr10">联系方式</span>
                        <el-input style="width: 66%" v-model="mech.mobile" disabled></el-input>
                    </div>
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">在职状态</span>
                        <el-input style="width: 66%" v-model="mech.status == 1 ? '在职' : '离职'" disabled></el-input>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 28%; display: inline-block; text-align: right" class="mr10">紧急联系人</span>
                        <el-input style="width: 61%" v-model="mech.contact" disabled></el-input>
                    </div>
                    <div>
                        <span style="width: 27%; display: inline-block; text-align: right" class="mr10">联系人电话</span>
                        <el-input style="width: 61%" v-model="mech.contactMobile" disabled></el-input>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 30%; display: inline-block; text-align: right" class="mr10">与联系人关系</span>
                        <el-input style="width: 57%" v-model="mech.contactLink" disabled></el-input>
                    </div>
                    <!-- <div>
                        <span style="width: 29%; display: inline-block; text-align: right" class="mr10">离职时间</span>
                        <el-date-picker
                            style="width: 57%"
                            type="date"
                            v-model="mech.leaveTime"
                            placeholder="选择离职日期">
                        </el-date-picker>
                    </div> -->
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 17%; display: inline-block; text-align: right" class="mr10">在职评价</span>
                    <el-input
                        style="width: 73%"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="请输入员工在职评价"
                        v-model="mech.jobJudge">
                    </el-input>
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 17%; display: inline-block; text-align: right" class="mr10">离职原因</span>
                    <el-input
                        style="width: 73%"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="请输入员工离职原因"
                        v-model="mech.leaveReason">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDimissionVisible = false">取 消</el-button>
                <el-button type="warning" @click="leave()">确定选择</el-button>
            </span>
        </el-dialog>

        <!-- 弹出框-办理技师转店 -->
        <el-dialog title="办理技师转店" :visible.sync="dialogChangeStoreVisible" :close-on-click-modal="false">
            <div>
                <div>
                    <h3 class="c63">转店纪录：</h3>
                    <p style="padding-left: 6%">1. 2018年6月10日   由aaa店转往bbbb店  转店原因：公司调整转店</p>
                    <p style="padding-left: 6%">2. 2018年6月10日   由aaa店转往bbbb店  转店原因：公司调整转店</p>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">技师名称</span>
                        <el-input style="width: 66%" v-model="mech.name" disabled></el-input>
                    </div>
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">技师工号</span>
                        <el-input style="width: 66%" v-model="mech.mechNo" disabled></el-input>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">技师等级</span>
                        <el-input style="width: 66%" v-model="mech.level" disabled></el-input>
                    </div>
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">联系方式</span>
                        <el-input style="width: 66%" v-model="mech.mobile" disabled></el-input>
                    </div>
                </div>
                <div class="flex-layout mt10">
                    <div>
                        <span style="width: 25%; display: inline-block; text-align: right" class="mr10">所属门店</span>
                        <el-select style="width: 63%" disabled v-model="mech.shopId" placeholder="请选择所属门店">
                            <el-option
                            v-for="item in shopList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <div>
                            <span style="width: 25%; display: inline-block; text-align: right" class="mr10">转往品牌</span>
                            <el-select style="width: 63%" v-model="shiftBrandId" placeholder="请选择转往品牌">
                                <el-option
                                    v-for="item in brandList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="margin-top: 10px">
                            <span style="width: 25%; display: inline-block; text-align: right" class="mr10">转往门店</span>
                            <el-select style="width: 63%" v-model="shiftShopId" placeholder="请选择转往门店">
                                <el-option
                                    v-for="item in shiftShopList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="mt10">
                    <span style="width: 17%; display: inline-block; text-align: right" class="mr10">转店时间</span>
                    <el-date-picker
                        style="width: 26%"
                        v-model="shiftTime"
                        type="date"
                        placeholder="选择转店时间">
                    </el-date-picker>
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 17%; display: inline-block; text-align: right" class="mr10">转店原因</span>
                    <el-input
                        style="width: 69%"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="请输入技师转店原因"
                        v-model="shiftReason">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelShiftShop">取 消</el-button>
                <el-button type="warning" @click="shiftShop">确定</el-button>
            </span>
        </el-dialog>

        <!-- 弹出框-签到/签退记录 -->
        <el-dialog title="签到/签退记录" :visible.sync="dialogSignInVisible" :close-on-click-modal="false">
            <div>
                <el-button class="fr" type="danger" @click="handleClickSignInNopar()">查询记录</el-button>
                <div>
                    <span class="mr10">查询时间</span>
                    <el-date-picker
                        style="width: 26%"
                        v-model="dialog_changeStore_leavedate"
                        type="date"
                        placeholder="选择转店时间">
                    </el-date-picker>
                </div>
            </div>
            <div class="mt20">
                <el-card shadow="never">
                    <div slot="header"><span>签到签出纪录</span></div>
                    <div v-for="(item, index) in dialog_signIn_item" :key="index" class="mt10">
                        <span>{{item.signTime}}</span>
                        <span style="margin: 0 20px">{{mech.name}}</span>
                        <span>在</span><span style="font-size: 14px;color:red;">{{mech.shopName}}</span><span>进行签到操作</span>
                    </div>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogSignInVisible = false">取 消</el-button> -->
                <el-button type="warning" @click="dialogSignInVisible = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import brandApi from '@/api/brand'
    import shopApi from '@/api/shop'
    import mechApi from '@/api/mech/mech'
    import dialog from '@/common/dialog'
    import show from '@/common/show'
    import {OSS_URL} from '@/api/constant'
    import utils from '@/common/utils'
    import moment from "moment";
    import indexApi from '@/api/index';

    export default {
        data() {
            return {

                IMAGE_URL: OSS_URL,

                dataLoading: true,

                params: {
                    page: 1,
                    pageSize: 10,
                    totalSize: 0,
                    shopId: null,
                    search: ''
                },

                brandId: null,

                brandList: [],

                shopId: null,

                shopList: [],

                mechList: [],

                mech: {
                    sex: null,
                    levelId: null
                },

                sexList: [
                    {
                        code: 'F',
                        name: '女'
                    },
                    {
                        code: 'M',
                        name: '男'
                    }
                ],

                shiftShopList: [],
                shiftBrandId: null,
                shiftShopId: null,
                shiftReason: '',
                shiftTime: null,

                mechLevelList: [],

                storeIndex: 0, // 默认门店下标
                mechName: '', // 技师关键字
                mech: {
                    name: '',
                    idCard: '',
                    deptId: null,
                    mobile: '',
                    avatar: '',
                    empNo: '',
                    jobId: '',
                    birthday: '',
                    contact: '',
                    contactMobile: '',
                    contactLink: '',
                    entryTime: '',
                    leaveTime: '',
                    status: null,
                    nativeAddress: '',
                    address: '',
                    remark: '',
                    jobJudge: '',
                    leaveReason: ''
                }, //列表
                leavedto:{
                    leaveReason:'',
                    jobJudge:'',
                    id:''
                },
                signlistpar:{
                    
                signTime:null,//哪一天的签到记录
                id:null, //技师ID
                shopId:null //门店ID
 
                },
                dialogAddVisible: false, // 弹出层-添加技师
                dialog_staffName: '', // 弹出层-员工信息-员工名称
                dialog_staffNum: '', // 弹出层-员工信息-员工编号
                dialog_select_store: '', // 弹出层-员工信息-所属门店-默认选择
                dialog_select_job: '', // 弹出层-员工信息-技师等级-默认选择

                dialog_contact: '', // 弹出层-员工信息-联系方式
                dialog_birthday: '', // 弹出层-员工信息-出生日期
                dialog_imageUrl: '', // 弹出层-员工信息-员工头像
                dialog_emergency: '', // 弹出层-员工信息-紧急联系人
                dialog_emergencyPhone: '', // 弹出层-员工信息-联系人电话
                dialog_emergencyRelation: '', // 弹出层-员工信息-与联系人关系
                dialog_select_entryStatus: '在职', // 弹出层-员工信息-员工职位-默认选择
                dialog_entryStatusList: [{ // 弹出层-员工信息-在职状态
                    value: 1, label: '在职'
                }, {
                    value: 2, label: '离职'
                }],
                dialog_entryDate: '', // 弹出层-员工信息-入职时间
                dialog_native_address: '', // 弹出层-员工信息-籍贯地址
                dialog_address: '', // 弹出层-员工信息-现在住址
                remarkTxt: '', // 弹出层-员工信息-员工简介

                dialogDimissionVisible: false, // 弹出层-办理员工离职
                dialog_dimission_mechName: '刘玉强', // 弹出层-办理员工离职-技师名称
                dialog_dimission_mechNum: '10002', // 弹出层-办理员工离职-技师工号
                dialog_dimission_mechLevel: '软件工程师', // 弹出层-办理员工离职-技师等级
                dialog_dimission_birthday: '2016-07-02', // 弹出层-办理员工离职-出生日期
                dialog_dimission_contact: '15920091809', // 弹出层-办理员工离职-联系方式
                dialog_dimission_entryStatus: '离职', // 弹出层-办理员工离职-在职状态
                dialog_dimission_emergency: '李慧娟', // 弹出层-办理员工离职-紧急联系人
                dialog_dimission_emergencyPhone: '18609082309', // 弹出层-办理员工离职-联系人电话
                dialog_dimission_emergencyRelation: '母子', // 弹出层-办理员工离职-与联系人关系
                dialog_dimission_leavedate: '2016-07-02', // 弹出层-办理员工离职-离职时间
                dimission_remarkTxt: '', // 弹出层-办理员工离职-在职评价
                dimission_reason: '', // 弹出层-办理员工离职-离职原因

                dialogChangeStoreVisible: false, // 弹出层-办理技师转店
                dialog_changeStore_mechName: '刘玉强', // 弹出层-办理技师转店-技师名称
                dialog_changeStore_mechNum: '10002', // 弹出层-办理技师转店-技师工号
                dialog_changeStore_mechLevel: '普通', // 弹出层-办理技师转店-技师等级
                dialog_changeStore_contact: '15920091809', // 弹出层-办理技师转店-联系方式
                dialog_changeStore_select_store: '天山店', // 弹出层-办理技师转店-所属门店-默认选择
                dialog_changeStore_selectGoTo_store: '', // 弹出层-办理技师转店-转换门店-默认选择
                dialog_changeStore_storeList: [{ // 弹出层-办理技师转店-门店
                    value: '天山店', label: '天山店'
                }, {
                    value: '天山店2', label: '天山店2'
                }],
                dialog_changeStore_leavedate: '', // 弹出层-办理技师转店-转店时间
                changeStore_reason: '', // 弹出层-办理技师转店-转店原因

                dialogSignInVisible: false, // 弹出层-签到/签退记录
                dialog_signIn_item: [{
                    time: '2018-06-19 10:54:23', mechName: '娟娟', log: '在门店进行签到操作'
                }, {
                    time: '2018-06-19 10:54:24', mechName: '娟娟2', log: '在门店进行签到操作2'
                },]
            }
        },

        created() {
            // 选择默认当前时间
            this.dialog_dimission_leavedate = new Date().getTime()
            this.dialog_changeStore_leavedate = new Date().getTime()
        },

        mounted() {
            this.init()
        },

        watch: {
            brandId: function (val) {
                this.shiftBrandId = val;
                if (val) {
                    var _this = this;
                    this.brandList.forEach(brand => {
                        if (brand.id == val) {
                            _this.shopList = brand.shopList;
                            if (_this.shopList && _this.shopList.length > 0) {
                                _this.shopId = _this.shopList[0].id;
                            }
                        }
                    })
                }
            },
            shopId: function (val) {
                this.params.shopId = val
                this.pageQuery()
            },

            shiftBrandId: function (val) {
                const _this = this
                shopApi.queryByBrand(val, (data) => {
                    _this.shiftShopList = data
                    if (data && data.length) {
                        _this.shiftShopId = data[0].id
                    } else {
                        _this.shiftShopId = null
                    }
                })
            }

        },
        methods: {
            init() {
                this.queryBrand()
                this.queryMechLevel()
            },
            queryBrand() {
                const self = this
                indexApi.getEmpShops((data) => {
                    var brandList = data.brandList;
                    self.brandList = brandList;
                    if (brandList && brandList.length > 0) {
                        self.brandId = brandList[0].id
                    }
                })
            },
            queryMechLevel() {
                let self = this
                mechApi.queryMechLevel((data) => {
                    self.mechLevelList = data
                })
            },
            pageQuery: function () {
                const _this = this
                this.dataLoading = true
                mechApi.pageQuery(_this.params, (data) => {
                    _this.params.totalSize = data.totalSize
                    _this.mechList = data.list

                    _this.dataLoading = false
                })
            },


            clickStore(shopId) {
                this.shopId = shopId
            },

            handleClick(row) {
                let self = this
                let mech = utils.deepCopy(row)
                self.dialogAddVisible = true
                self.mech = mech
                console.log(row);
            },

        /**
         * 离职
         */
            handleClickDimission(row) {
                console.log(row)
                let self = this
                  
                var mech2 = utils.deepCopy(row)
                mech2.birthday=moment(mech2.birthday).format("YYYY-MM-DD" );
                console.log(self.mech.mechNo)
                self.mech=mech2
                console.log(self.mech.mobile)
                this.dialogDimissionVisible = true
            },


            handleAvatarSuccess(res, file) {
                 
               //this.dialog_imageUrl = URL.createObjectURL(file.raw);
               // console.log(this.dialog_imageUrl);
                this.mech.avatar = res.data.filePath;
            },

            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },


            handleClickChangeStore(row) {
                console.log(row)
                const _this = this
                _this.mech = utils.deepCopy(row)
                this.dialogChangeStoreVisible = true
            },

//签到
            handleClickSignInNopar() {
                
                
                  
                const _this = this
                 _this.signlistpar.id=_this.mech.id;
                 console.log( '_this.mech.id=='+_this.mech.id)
                  const start = moment(_this.dialog_changeStore_leavedate).format("YYYY-MM-DD");
                 _this.signlistpar.signTime=_this.dialog_changeStore_leavedate;
                 console.log( '_this.dialog_changeStore_leavedate=='+start)
                 _this.signlistpar.shopId=_this.mech.shopId;
                 // _this.mech = utils.deepCopy(row)
                 mechApi.SignList(_this.signlistpar, (data) => {
                     
                      console.log( 'data.size=='+data.length)
                    for(var i=0;i<data.length;i++){
                         
                       // console.log('0000==='+moment(data[i].signTime).format("YYYY-MM-DD HH:mm:ss"))
                        data[i].signTime=moment(data[i].signTime).format("YYYY-MM-DD HH:mm:ss");

                    }
                    console.log(data)
                    this.dialog_signIn_item=data;
                    //mechName、shopname、time
                })
                this.dialogSignInVisible = true
            },
             //签到查询
            handleClickSignIn(row) {
                const _this = this
                 const start = moment(_this.dialog_changeStore_leavedate).format("YYYY-MM-DD");
                 console.log("查询日期===="+moment(_this.dialog_changeStore_leavedate).format("YYYY-MM-DD"))
                
                
                 
                 _this.signlistpar.signTime=start.valueOf();
                
                  _this.mech = utils.deepCopy(row)
                 mechApi.SignList(_this.signlistpar, (data) => {
                      console.log( _this.mech)
                      console.log( 'data.size=='+data.length)
                    for(var i=0;i<data.length;i++){
                         
                       // console.log('0000==='+moment(data[i].signTime).format("YYYY-MM-DD HH:mm:ss"))
                        data[i].signTime=moment(data[i].signTime).format("YYYY-MM-DD HH:mm:ss");

                    }
                    console.log(data)
                    this.dialog_signIn_item=data;
                    //mechName、shopname、time
                })
                this.dialogSignInVisible = true
            },
            clickAddMech() {
                const  _this = this
                _this.mech.brandId = _this.brandId
                dialog.confirm(() => {

                    if (!_this.mech.id) {

                        //新增技师
                        mechApi.insert(_this.mech, (data) =>{
                            _this.dialogAddVisible = false
                            show.success('操作成功')
                        })
                    } else {

                        //更新技师
                        mechApi.update(_this.mech, (data) =>{
                            _this.dialogAddVisible = false
                            show.success('操作成功')
                        })

                    }

                })
            },

            //点击下一页
            handleCurrentChange: function(curPage) {
                const self = this
                self.params.page = curPage
                self.pageQuery()
            },
            /**
             *
             * 办理离职
             */
            leave() {
                const self = this;
                self.leavedto.id=this.mech.id
                 self.leavedto.jobJudge=this.mech.jobJudge
                 
                  self.leavedto.leaveReason=this.mech.leaveReason
                mechApi.leave(self.leavedto, function (data) {
                    self.dialogDimissionVisible = false
                    
                    
                });
                self.pageQuery();
            }, //修改员工信息
            shiftShop: function () {
                const _this = this
                const params = {
                    mechId: _this.mech.id,
                    shiftBrandId: _this.shiftBrandId,
                    shiftShopId: _this.shiftShopId,
                    reason: _this.shiftReason,
                    shiftTime: _this.shiftTime
                }

                dialog.confirm(() => {
                    mechApi.shiftShop(params, (data) => {
                        show.success('操作成功')
                        _this.dialogChangeStoreVisible = false
                        _this.pageQuery()
                    })
                })
            },

            cancelShiftShop: function () {
                dialogChangeStoreVisible = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .jishuguanli{
        .jishuguanli-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
        .jishuguanli-container{
            padding: 10px 0 0 20px;
            >div:nth-of-type(1){
                padding-left: 50px;
                position: relative;
                span{
                    position: absolute;
                    left: 10px;
                    top: 5px;
                }
            }
            >ul{
                padding-left: 50px;
                overflow: hidden;
                li{
                    margin-top: 10px;
                    margin-right: 10px;
                    float: left;
                }
                li.active button{
                    border: 1px solid #409EFF;
                }
            }
        }
        .flex-layout{
            display: flex;
            justify-content: space-around;
        }
    }
</style>
