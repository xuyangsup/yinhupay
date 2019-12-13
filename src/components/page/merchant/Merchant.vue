<template>
    <div class="shangjiaguanli">
        <div class="shangjiaguanli-title">
            <h3>商家管理</h3>
        </div>
        <div>

            <span>{{curMerchant.name}}</span>
            <span>注册时间：{{curMerchant.registerTime}}</span>
            <span>营业执照编号：{{curMerchant.businessLicenseNo}}</span>
            <el-button @click="clickAddBrand" type="text" class="fr mr10">添加品牌</el-button>
            <el-button @click="dialogEditBusinessVisible=true" type="text" class="fr mr10">编辑商户</el-button>
        </div>
        <!-- 品牌 -->
        <div>
            <ul>
                <li @click="handleClickBrand(item)" :class="{active : brandId === item.id}" v-for="(item, index) in brandList" :key="item.id">
                    <h3>{{item.name}}</h3>
                    <el-button type="text" @click="clickEditBrand(item)">编辑</el-button>
                    <el-button type="text">{{ item.status == 1 ? '已开启' : '已关闭' }}</el-button>
                    <el-button @click="clickAddShop(item)" type="text">添加门店</el-button>
                </li>
            </ul>
        </div>
        <!-- 门店数据 -->
        <div class="storeDataInfo">
            <el-row :gutter="10">
                <el-col :span="4">
                    <ul class="storeData">
                        <li :class="{active : shopId === item.id}" @click="handleClickStore(item)" v-for="(item, index) in shopList" :key="item.id">
                            <el-button type="text">{{item.name}}</el-button>
                        </li>
                    </ul>
                </el-col>
                <el-col :span="20">
                    <el-tabs v-model="activeName" @tab-click="handleClickTab" style="border-left: 1px solid #f2f2f2;padding:0 20px;min-height: 500px">
                        <!-- 基本信息 -->
                        <el-tab-pane label="基本信息" name="first" v-if="selectShop">
                            <div style="margin-left:20px"><el-button type="danger" @click="handleClickcurShop(selectShop)">编辑门店</el-button></div>
                            <p>{{ selectShop.name }}</p><br>
                            <p>地址：{{ selectShop.address }}</p><br>
                            <p>注册时间：{{ selectShop.registerTime }}</p><br>
                            <p>营业时间：{{ selectShop.openTime }}</p><br>
                            <p>客服电话：{{ selectShop.tel }}</p><br>
                            <p>联系人：{{ selectShop.contact }}</p><br>
                            <div style="display: flex;height:150px;">
                                <span>门店地图：</span>
                                
                                <img width="150px"  :src="IMAGE_URL+selectShop.addressImage" alt="">
                            </div><br>
                        </el-tab-pane>
                        <!-- 房间 -->
                        <el-tab-pane label="房间信息" name="second">
                            <div style="margin-left:20px"><el-button type="danger" @click="addRoom">添加房间</el-button></div>
                            <div class="mt10" style="border: 1px solid #f2f2f2; margin:20px">
                                <el-table
                                    :data="roomList"
                                    style="width: 100%">
                                    <el-table-column
                                        label="房间名称 "
                                        width="240">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.name }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="床位数量">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.bedCount }}</span>
                                        </template>
                                    </el-table-column>
                                    <!--<el-table-column-->
                                        <!--label="床位信息">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<div v-for="(item, index) in scope.row.bedInfoList" :key="index">-->
                                                <!--<span>{{item.name}}</span>-->
                                                <!--<el-button type="text" size="small">修改</el-button>-->
                                                <!--<el-button type="text" size="small" class="mr10">{{item.status ? '开启' : '关闭'}}</el-button>-->
                                            <!--</div>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <el-table-column
                                        label="房间状态">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.status == 1 ? '正常' : '非正常'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="操作"
                                        width="280">
                                        <template slot-scope="scope">
                                            <el-button type="text"  @click="handleClickroom(scope.row)" size="small" class="mr10">修改</el-button>
                                            <!--<el-switch-->
                                                <!--v-model="scope.row.isOnline"-->
                                                <!--active-text="启用"-->
                                                <!--inactive-text="关闭"-->
                                                <!--active-color="#13ce66"-->
                                                <!--inactive-color="#ccc"-->
                                                <!--@change="changeRuleStatus(scope.row, scope.$index)">-->
                                            <!--</el-switch>-->
                                            <!--<el-button type="text" size="small">添加床位</el-button>-->
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <!-- 服务项目 -->
                        <el-tab-pane label="服务项目" name="third">
                            <div style="margin-left:20px">
                                <el-button type="danger" @click="clickAddShopProductButton">新增项目</el-button>
                            </div>
                            <div class="mt10" style="border-left: 1px solid #f2f2f2;border-right: 1px solid #f2f2f2; margin:20px">
                                <!-- 服务项目-菜单状态 -->
                                <el-menu
                                    :default-active="selectChannelId"
                                    class="el-menu-demo"
                                    mode="horizontal"
                                    @select="handleSelect"
                                    background-color="#ccc"
                                    text-color="#fff"
                                    active-text-color="#f63">
                                    <el-menu-item :index="item.id + ''" v-for="(item, index) in channelList" :key="item.id">{{item.name}}</el-menu-item>
                                </el-menu>
                                <!-- 服务项目-表格 -->
                                <el-table
                                    :data="shopProductList"
                                    style="width: 100%">
                                    <el-table-column
                                        label="项目内容"
                                        width="300">
                                        <template slot-scope="scope">
                                            <div class="activityInfo">
                                                <div class="activityImg">
                                                    <img :src="IMAGE_URL+scope.row.imageUrl" alt="" height="50px" width="50px">
                                                </div>
                                                <div>
                                                    <span>{{ scope.row.name }}</span><br>
                                                </div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="原价/售价">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.originalPrice}}/{{scope.row.sellPrice}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="项目状态">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.status == 1 ?  '在售' : '停售'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="计价方式">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.saleType}}</span>
                                        </template>
                                    </el-table-column>
                                    <!--<el-table-column-->
                                        <!--label="分时计价">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{scope.row.valuationType}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column-->
                                        <!--label="提成方式">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{scope.row.timeOfUse}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <el-table-column
                                        label="操作"
                                        width="180">
                                        <template slot-scope="scope">
                                            <!--<el-button type="text" size="small">详情</el-button>-->
                                            <el-button type="text" size="small" @click="changeShopProduct(scope.row)">修改</el-button>
                                            <el-button type="text" size="small" @click="deleteShopProduct(scope.row)">删除</el-button>
                                            <!--<el-button type="text" size="small">发布</el-button>-->
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <!-- 门店详情 -->
                        <el-tab-pane label="门店详情" name="fourth">
                            {{sotreDetail}}
                        </el-tab-pane>
                        <!-- 门店图片 
                        <el-tab-pane label="门店图片" name="fifth">
                            {{sotreImg}}
                        </el-tab-pane>-->
                    </el-tabs>
                </el-col>
            </el-row>
        </div>

        <!-- 弹出框-编辑商家 -->
        <el-dialog title="编辑商家" :visible.sync="dialogEditBusinessVisible" :close-on-click-modal="false">
            <!-- 编辑商家-菜单状态 -->
            <el-menu
                :default-active="dialog_menuStatusIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="dialog_handleSelect"
                background-color="#ccc"
                text-color="#fff"
                active-text-color="#f63">
                <el-menu-item index="1">商家信息</el-menu-item>
                <el-menu-item index="2">微信账户</el-menu-item>
            </el-menu>
            <!-- 商家信息 -->
            <div v-show="dialog_menuStatusIndex==='1'">
                <div class="mt10">
                    <span style="width: 10%;display: inline-block; text-align: right" class="mr10">商家名称</span>
                    <el-input style="width: 50%" v-model="dialog_businessName" placeholder="请输入商家名称"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 10%;display: inline-block; text-align: right" class="mr10">办公地址</span>
                    <el-input style="width: 50%" v-model="dialog_businessAddress" placeholder="请输入办公地址"></el-input>
                </div>
                <div class="mt10" style="display:flex">
                    <div>
                        <span style="width: 32%;display: inline-block; text-align: right" class="mr10">微信程序账号</span>
                        <el-input style="width: 60%" v-model="dialog_businessWx" placeholder="请输入微信程序账号"></el-input>
                    </div>
                     <div>
                        <span style="width: 30%; display: inline-block; text-align: right" class="mr10">账号密码</span>
                        <el-input style="width: 60%" v-model="dialog_businessPsw" placeholder="请输入账号密码" type="password"></el-input>
                    </div>
                </div>
                <div class="mt10" style="display:flex">
                    <div>
                        <span style="width: 38%;display: inline-block; text-align: right;" class="mr10">联系人</span>
                        <el-input style="width: 50%" v-model="dialog_businessEmergency" placeholder="请输入联系人"></el-input>
                    </div>
                     <div>
                        <span style="width: 40%; display: inline-block; text-align: right;margin-left:12px" class="mr10">联系方式</span>
                        <el-input style="width: 50%" v-model="dialog_businessEmergencyPhone" placeholder="请输入联系方式"></el-input>
                    </div>
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 10%; display: inline-block; text-align: right;margin-right:22px">营业执照</span>
                    <el-upload
                        ref="activityUpload"
                        class="avatar-uploader"
                        action="/api/v1/image/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="dialog_imageUrl" :src="dialog_imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 10%; display: inline-block; text-align: right" class="mr10">商家简介</span>
                    <el-input
                        style="width: 77%"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="请输入商家简介"
                        v-model="remarkTxt">
                    </el-input>
                </div>
                <!-- 待续 -->
            </div>
            <!-- 微信账户 -->
            <div v-show="dialog_menuStatusIndex==='2'">
                <div class="mt10">
                    <span style="width: 26%;display: inline-block; text-align: right" class="mr10">应用ID(appId)</span>
                    <el-input style="width: 50%" v-model="dialog_wx_appId" placeholder="请输入应用ID(appId)"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 26%;display: inline-block; text-align: right" class="mr10">商户号(partnerid)</span>
                    <el-input style="width: 50%" v-model="dialog_wx_partnerId" placeholder="请输入商户号(partnerid)"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 26%;display: inline-block; text-align: right" class="mr10">预支付交易会话ID(prepayid)</span>
                    <el-input style="width: 50%" v-model="dialog_wx_prepayId" placeholder="请输入预支付交易会话ID(prepayid)"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 26%;display: inline-block; text-align: right" class="mr10">扩展字段(package)</span>
                    <el-input style="width: 50%" v-model="dialog_wx_package" placeholder="请输入扩展字段(package)"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 26%;display: inline-block; text-align: right" class="mr10">商家前缀</span>
                    <el-input style="width: 50%" v-model="dialog_wx_prefix" placeholder="请输入商家前缀"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogEditBusinessVisible = false">取 消</el-button>
                <el-button type="warning" @click="dialogEditBusinessVisible = false">确定选择</el-button>
            </span>
        </el-dialog>

        <!-- 弹出框-添加/编辑品牌 -->
        <el-dialog :title="curBrand.id ? '编辑品牌' : '添加品牌' " :visible.sync="dialogEditBrandVisible" :close-on-click-modal="false">
            <div>
                <div class="mt10">
                    <span style="width: 10%;display: inline-block; text-align: right" class="mr10">品牌名称</span>
                    <el-input style="width: 50%" v-model="curBrand.name" placeholder="请输入品牌名称"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 10%;display: inline-block; text-align: right" class="mr10">办公地址</span>
                    <el-input style="width: 50%" v-model="curBrand.address" placeholder="请输入办公地址"></el-input>
                </div>
                <div class="mt10" style="display:flex">
                    <div>
                        <span style="width: 38%;display: inline-block; text-align: right;" class="mr10">联系人</span>
                        <el-input style="width: 50%" v-model="curBrand.contact" placeholder="请输入联系人"></el-input>
                    </div>
                     <div>
                        <span style="width: 40%; display: inline-block; text-align: right;margin-left:12px" class="mr10">联系方式</span>
                        <el-input style="width: 50%" v-model="curBrand.contactMobile" placeholder="请输入联系方式"></el-input>
                    </div>
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 12%;display: inline-block; text-align: right" class="mr10">品牌标签</span>
                    <div class="brandRemark">
                        <ul>
                            <li :class="{active : item.select}"
                            @click="item.select = !item.select"
                            v-for="(item, index) in brandLabelList"
                            :key="index">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 12%; display: inline-block; text-align: right;margin-right:22px">品牌Logo</span>
                    <el-upload
                        ref="activityUpload"
                        class="avatar-uploader"
                        action="/api/v1/image/upload"
                        :show-file-list="false"
                        :on-success="handleBrandLogoUpload">
                        <img v-if="curBrand.logo" :src="IMAGE_URL + curBrand.logo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 12%; display: inline-block; text-align: right;margin-right:22px">营业执照</span>
                    <el-upload
                        ref="activityUpload"
                        class="avatar-uploader"
                        action="/api/v1/image/upload"
                        :show-file-list="false"
                        :on-success="handleBrandLicenceUpload">
                        <img v-if="curBrand.businessLicence" :src="IMAGE_URL + curBrand.businessLicence" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="mt10" style="display:flex">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">品牌介绍</span>
                    <el-input
                        style="width: 77%"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="请输入品牌介绍"
                        v-model="curBrand.remark">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogEditBrandVisible = false">取 消</el-button>
                <el-button type="warning" @click="clickSaveBrand">保存</el-button>
            </span>
        </el-dialog>

        <!-- 弹出框-添加/编辑门店 -->
        <el-dialog :title=" curShop.id ? '编辑门店' : '添加门店' " :visible.sync="dialogEditStoreVisible" :close-on-click-modal="false">
            <div>
                <div class="flex-layout">
                    <span class="mr10">门店名称</span>
                    <el-input style="width: 50%" v-model="curShop.name" placeholder="请输入门店名称"></el-input>
                </div>
                <div class="mt10 flex-layout">
                    <div class="flex-layout">
                        <span class="mr10">所属城市</span>
                        <el-select style="width: 62%" v-model="cityCode" placeholder="请选择所属城市">
                            <el-option
                            v-for="item in cityList"
                            :key="item.regionCode"
                            :label="item.name"
                            :value="item.regionCode">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="flex-layout">
                        <span class="mr10">县/区</span>
                        <el-select style="width: 62%" v-model="xianCode" placeholder="请选择城市区域">
                            <el-option
                                v-for="item in xianList"
                                :key="item.regionCode"
                                :label="item.name"
                                :value="item.regionCode">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="flex-layout">
                        <span class="mr10">城市区域</span>
                        <el-select style="width: 62%" v-model="regionCode" placeholder="请选择城市区域">
                            <el-option
                            v-for="item in regionList"
                            :key="item.regionCode"
                            :label="item.name"
                            :value="item.regionCode">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="mt10 flex-layout">
                    <span class="mr10">详细地址</span>
                    <el-input style="width: 50%" v-model="curShop.address" placeholder="请输入详细地址"></el-input>
                </div>
                <div class="mt10 flex-layout">
                    <div>
                        <span style="width: 24%;display: inline-block; text-align: right;" class="mr10">联系人</span>
                        <el-input style="width: 54%" v-model="curShop.contact" placeholder="请输入联系人"></el-input>
                    </div>
                     <div>
                        <span style="width: 24%; display: inline-block; text-align: right;margin-left:12px" class="mr10">联系方式</span>
                        <el-input style="width: 54%" v-model="curShop.contactMobile" placeholder="请输入联系方式"></el-input>
                    </div>
                </div>
                <div class="mt10 flex-layout">
                    <div style="display:flex;margin-right:30px">
                        <span style="flex:1; text-align: right;margin-right:20px;margin-left:25px">头图</span>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/v1/image/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessStore"
                            :before-upload="beforeAvatarUploadStore">
                            <img v-if="curShop.topImage" :src="IMAGE_URL + curShop.topImage" class="avatar">
                            <!-- <img v-if="dialog_store_imageUrl" :src="dialog_store_imageUrl" class="avatar"> -->
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <div class="flex-layout">
                        <span style="width: 24%; text-align: right;margin-right:20px">门店地图</span>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/v1/image/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessStoreMap"
                            :before-upload="beforeAvatarUploadStoreMap">
                             <img v-if="curShop.addressImage" :src="IMAGE_URL + curShop.addressImage" class="avatar">
                            <!-- <img v-if="dialog_storeMap_imageUrl" :src="dialog_storeMap_imageUrl" class="avatar"> -->
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </div>
                <div class="mt10 flex-layout">
                    <span style=" text-align: right" class="mr10">门店标签</span>
                    <div class="storeRemark">
                        <ul>
                            <li :class="{active : item.status}"
                            @click="item.status=!item.status"
                            v-for="(item, index) in dialog_storeRemarkList"
                            :key="index">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="mt10 flex-layout">
                    <span class="mr10">门店星级</span>
                    <el-select v-model="dialog_select_storeStar" placeholder="请选择" style="width:20%">
                        <el-option
                        v-for="item in dialog_storeStarList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="mt10 flex-layout">
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">经度</span>
                        <el-input style="width: 66%" v-model="curShop.lng" placeholder="请输入经度"></el-input>
                    </div>
                    <div>
                        <span style="width: 24%; display: inline-block; text-align: right" class="mr10">纬度</span>
                        <el-input style="width: 66%" v-model="curShop.lat" placeholder="请输入纬度"></el-input>
                    </div>
                </div>
                <div class="mt10  flex-layout">
                    <span style="text-align: right" class="mr10">营业时间</span>
                    <el-time-picker
                        is-range
                        v-model="dialog_store_openTime"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                    </el-time-picker>
                </div>
                <!-- 延长时间 -->
                <div class="mt10 flex-layout">
                    <span style="text-align: right" class="mr10">延长时间</span>
                    <el-checkbox style="flex:1" v-model="dialog_store_preDelay">
                        <span>前推</span>
                        <el-input style="width:18%;margin:0 10px" v-model="dialog_store_preDelayNum"></el-input>
                        <el-select style="width:26%" v-model="dialog_store_select_preDelayTime">
                            <el-option
                            v-for="item in dialog_store_preDelayTimeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-checkbox>
                    <el-checkbox style="flex:1" v-model="dialog_store_nextDelay">
                        <span>后推</span>
                        <el-input style="width:18%;margin:0 10px" v-model="dialog_store_nextDelayNum"></el-input>
                        <el-select style="width:26%" v-model="dialog_store_select_nextDelayTime">
                            <el-option
                            v-for="item in dialog_store_nextDelayTimeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-checkbox>
                </div>
                <div class="mt10 flex-layout">
                    <span class="mr10">客服电话</span>
                    <el-input style="width: 50%" v-model="dialog_store_brandName" placeholder="请输入客服电话"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogEditStoreVisible = false">取 消</el-button>
                <el-button type="warning" @click="clickSaveShop">保存</el-button>
            </span>
        </el-dialog>


        <!-- 弹出框-添加/编辑房间 -->
        <el-dialog :title=" curRoom.id ? '编辑房间' : '添加房间' " :visible.sync="dialogEditRoomVisible" :close-on-click-modal="false">
            <div>
                <div class="flex-layout">
                    <span class="mr10">房间名称</span>
                    <el-input style="width: 50%" v-model="curRoom.name" placeholder="请输入房间名称"></el-input>
                </div>
                <!-- <div class="mt10 flex-layout">
                    <span class="mr10">床位编号(可不填)</span>
                    <el-input style="width: 50%" v-model="curRoom.bedNo" placeholder="请输入床位编号"></el-input>
                </div> -->
                <div class="mt10 flex-layout">
                    <span class="mr10">床位个数</span>
                    <el-input style="width: 50%" v-model="curRoom.bedCount" placeholder="请输入床位个数"></el-input>
                </div>
                <div class="mt10 flex-layout">
                    <div style="display:flex;margin-right:30px">
                        <span style="flex:1; text-align: right;margin-right:20px;margin-left:25px">床位分布图</span>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/v1/image/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessStoreroom"
                            :before-upload="beforeAvatarUploadStore">
                            
                            <img v-if="curRoom.image" :src="IMAGE_URL +curRoom.image" class="avatar">
                            <!-- <img v-if="dialog_store_imageUrl" :src="dialog_store_imageUrl" class="avatar"> -->
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogEditRoomVisible = false">取 消</el-button>
                <el-button type="warning" @click="clickSaveRoom">保存</el-button>
            </span>
        </el-dialog>

        <!-- 弹出框-添加/服务项目 -->
        <el-dialog title="添加服务项目" :visible.sync="dialogServerItemVisible" :close-on-click-modal="false">
            <div>
                <!-- 项目类别 -->
                <div class="mt10 flex-layout">
                    <span class="mr10">品牌项目</span>
                    <el-select v-model="curServerItem.brandProductId" placeholder="请选择项目类别" style="width: 50%">
                        <el-option
                            v-for="item in brandProductList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="flex-layout" style="margin-top: 10px">
                    <span class="mr10">项目名称</span>
                    <el-input style="width: 50%" v-model="curServerItem.name" placeholder="请输入项目名称"></el-input>
                </div>
                <!-- 属性没改 -->
                <div class="mt10 flex-layout">
                    <span style="margin-right:20px;">添加头图</span>
                    <el-upload
                        class="avatar-uploader"
                        action="/api/v1/image/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccessStorecurimg"
                        :before-upload="beforeAvatarUploadStore">
                        
                         <img v-if="curServerItem.imageUrl" :src="IMAGE_URL + curServerItem.imageUrl" class="avatar">
                        <!-- <img v-if="dialog_store_imageUrl" :src="dialog_store_imageUrl" class="avatar"> -->
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    
                </div>
                <div class="mt10 flex-layout">
                    <span style=" text-align: right" class="mr10">项目标签</span>
                    <div class="storeRemark">
                        <ul>
                            <li :class="{active : item.select}"
                            @click="item.select = !item.select"
                            v-for="(item, index) in productLabelList"
                            :key="index">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="mt10">
                    <span style="" class="mr10">项目原价</span>
                    <el-input style="width: 24%" v-model="curServerItem.lastPrice" placeholder="请输入原价"></el-input>
                    <span>元</span>
                </div>
                <div class="mt10">
                    <span style="" class="mr10">标准售价</span>
                    <el-input style="width: 24%" v-model="curServerItem.price" placeholder="请输入标准售价"></el-input>
                    <span>元</span>
                </div>
                <div class="mt10 flex-layout">
                    <span style=" text-align: right" class="mr10">所属平台</span>
                    <div class="storeRemark">
                        <ul>
                            <li :class="{active : dialog_serverItemPlatIdx == item.id}"
                            @click="dialog_serverItemPlatIdx = item.id"
                            v-for="(item, index) in channelList"
                            :key="item.id">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="mt10">
                    <span class="mr10">售价方式</span>
                    <el-radio-group v-model="curServerItem.saleStyleIdx" @change="changeSaleStyle">
                        <el-radio :label="1">标准售价</el-radio>
                        <el-radio :label="2">周期售价</el-radio>
                        <el-radio :label="3">分时售价</el-radio>
                    </el-radio-group>
                </div>
                <!-- 分时售价 -->
                <div class="mt10" style="margin-left: 70px;" v-show="curServerItem.saleStyleIdx==3">
                    <div style="margin-bottom: 20px;">
                        <el-date-picker
                        v-model="curServerItem.saleTime"
                        @change="changeServiceItemSaleTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <el-tabs v-model="saleDateListTime" style="border: 1px solid #f2f2f2;padding: 0 20px;">
                        <el-tab-pane v-for="(item, index) in dateList"
                            :key="index"
                            :label="item.date"
                            :name="item.date"
                        >
                        <div class="flex-layout" style="margin-bottom:5px" v-for="(content, index) in item.saleList" :key="index">
                            <el-time-select
                                class="mr10"
                                style="width:115px"
                                placeholder="起始时间"
                                v-model="content.startTime"
                                :picker-options="{
                                start: '11:00',
                                step: '00:15',
                                end: '23:00'
                                }">
                            </el-time-select>
                            <el-time-select
                                class="mr10"
                                style="width:115px"
                                placeholder="结束时间"
                                v-model="content.endTime"
                                :picker-options="{
                                start: '11:0',
                                step: '00:15',
                                end: '23:00',
                                minTime: content.startTime
                                }">
                            </el-time-select>
                            <el-input style="width:80px;margin-right:10px" v-model="content.sellPrice" placeholder="请输入"></el-input>
                            <span class="mr10">元</span>
                            <i class="el-icon-remove-outline" @click="removeTime(item, index)"></i>
                        </div>
                        <i class="el-icon-circle-plus-outline" @click="addTime(item)"></i>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <!-- 周期售价 -->
                <div class="mt10" style="margin-left: 70px;" v-show="curServerItem.saleStyleIdx==2">
                    <el-tabs v-model="saleDayListTime" style="border: 1px solid #f2f2f2;padding: 0 20px;">
                        <el-tab-pane v-for="(item, index) in dayList"
                            :key="index"
                            :label="item.date"
                            :name="item.date"
                        >
                        <div class="flex-layout" style="margin-bottom:5px" v-for="(content, index) in item.shareList" :key="index">
                            <el-time-select
                                class="mr10"
                                style="width:115px"
                                placeholder="起始时间"
                                v-model="content.startTime"
                                :picker-options="{
                                start: '11:00',
                                step: '00:15',
                                end: '23:00'
                                }">
                            </el-time-select>
                            <el-time-select
                                class="mr10"
                                style="width:115px"
                                placeholder="结束时间"
                                v-model="content.endTime"
                                :picker-options="{
                                start: '11:00',
                                step: '00:15',
                                end: '23:00',
                                minTime: content.startTime
                                }">
                            </el-time-select>
                            <el-input style="width:80px;margin-right:10px" v-model="content.sellPrice" placeholder="请输入"></el-input>
                            <span class="mr10">元</span>
                            <i class="el-icon-remove-outline" @click="removeShare(item, index)"></i>
                        </div>
                        <i class="el-icon-circle-plus-outline" @click="addShare(item)"></i>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <!-- 提成方式 -->
                <div class="mt10" style="display:flex">
                    <div class="mr10" style="margin-top:16px">提成方式</div>
                    <div>
                        <div style="margin-top: 10px" v-for="mechLevel in mechLevelList">
                            {{mechLevel.name}}：
                            <el-select v-model="mechLevel.bonusType" placeholder="请选择" style="width:110px">
                                <el-option
                                v-for="item in mechCashStyleList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            轮排:
                            <el-input style="width: 12%" v-model="mechLevel.lunPaiBonus" ></el-input>

                            点钟:
                            <el-input style="width: 12%" v-model="mechLevel.dianClockBonus" ></el-input>

                            加钟:
                            <el-input style="width: 12%" v-model="mechLevel.helpClockBonus" ></el-input>

                            帮钟:
                            <el-input style="width: 12%" v-model="mechLevel.addClockBonus" ></el-input>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogServerItemVisible = false">取 消</el-button>
                <el-button type="warning" @click="addShopProduct">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import brandApi from "@/api/brand";
    import merchantApi from "@/api/merchant";
    import utils from "@/common/utils";
    import shopApi from "@/api/shop";
    import roomApi from "@/api/room";
    import dialog from "@/common/dialog";
    import show from "@/common/show";
    import shopProductApi from "@/api/product/shopProduct";
    import brandProdcutApi from "@/api/product/brandProduct";
    import labelApi from "@/api/label";
    import {OSS_URL} from "@/api/constant";
    import appointApi from "@/api/appoint";
    import mechApi from "@/api/mech/mech";
    import moment from "moment";
    import cityApi from '@/api/city'

    export default {
        data() {
            return {
                IMAGE_URL: OSS_URL,
                curMerchant: {
                    name: "", registerTime: "", businessLicenseNo: ""
                },

                curBrand: {
                    name: "", address: "", contact: "", contactMobile: "", businessLicence: "", remark: "", logo: ""
                },

                curShop: {
                    name: "",
                    brandId: null,
                    cityId: null,
                    regionId: null,
                    districtCode:null,
                    address: "",
                    contact: "",
                    contactMobile: "",
                    lng: null,
                    lat: null,
                    tel: "",
                    topImage: ""
                },

                curRoom: {
                    name: "", bedCount: 0, bedNo: "", image: ""
                },

                // 添加服务项目
                curServerItem: {
                    name: "", saleStyleIdx: 1, saleTime: "", lastPrice: "", // 原价
                    price: "" // 标准价
                    ,imageUrl:""
                },

                curShopProduct: {},

                brandList: [],

                //门店列表
                shopList: [],

                //选中的品牌
                brandId: null,

                selectBrand: null,

                shopId: null,

                selectShop: null,

                roomList: [],

                dialogEditRoomVisible: false,

                channelList: [],

                selectChannelId: null,

                shopProductList: [],

                dialogEditProductVisible: false,

                selectBrandProductId: null,

                dialogSelectChannelId: null,

                brandProductList: [],

                brandLabelList: [],

                mechLevelList: [],

                productLabelList: [],

                business: "上海考拉时光集团有限公司", // 商户

                activeName: "first", // tab-默认下标
                storeRoom: "房间", // 房间
                storeItem: "服务项目", // 服务项目
                sotreDetail: "门店详情", // 门店详情
                sotreImg: "门店图片", // 门店图片
                menuStatusIndex: "1", // 服务项目-菜单状态-默认下标
                serverItemData: [],

                dialogEditBusinessVisible: false, // 弹出层-编辑商户
                dialog_menuStatusIndex: "1", // 弹出层-编辑商户-菜单状态-默认下标
                dialog_businessName: "", // 弹出层-编辑商户-商家名称
                dialog_businessAddress: "", // 弹出层-编辑商户-办公地址
                dialog_businessWx: "", // 弹出层-编辑商户-微信程序账号
                dialog_businessPsw: "", // 弹出层-编辑商户-账号密码
                dialog_businessEmergency: "", // 弹出层-编辑商户-联系人
                dialog_businessEmergencyPhone: "", // 弹出层-编辑商户-联系方式
                dialog_imageUrl: "", // 弹出层-编辑商户-营业执照
                remarkTxt: "", // 弹出层-编辑商户-商家简介
                dialog_wx_appId: "", // 弹出层-编辑商户-应用ID
                dialog_wx_partnerId: "", // 弹出层-编辑商户-商户号
                dialog_wx_prepayId: "", // 弹出层-编辑商户-预支付交易会话ID
                dialog_wx_package: "", // 弹出层-编辑商户-扩展字段
                dialog_wx_prefix: "", // 弹出层-编辑商户-商家前缀

                dialogEditBrandVisible: false, // 弹出层-添加/编辑品牌
                dialog_brandName: "", // 弹出层-编辑品牌-商家名称
                dialog_brandAddress: "", // 弹出层-编辑品牌-办公地址
                dialog_brandEmergency: "", // 弹出层-编辑品牌-联系人
                dialog_brandEmergencyPhone: "", // 弹出层-编辑品牌-联系方式
                dialog_brand_imageUrl: "", // 弹出层-编辑品牌-营业执照

                dialogEditStoreVisible: false, // 弹出层-添加/编辑门店
                dialog_store_brandName: "", // 弹出层-添加/编辑门店-品牌
                dialog_select_store_city: "", // 弹出层-添加/编辑门店-所属城市(默认)
                dialog_select_store_cityArea: "", // 弹出层-添加/编辑门店-城市区域(默认)
                dialog_store_address: "", // 弹出层-添加/编辑门店-详细地址
                dialog_store_Emergency: "", // 弹出层-添加/编辑门店-联系人
                dialog_store_EmergencyPhone: "", // 弹出层-添加/编辑门店-联系人方式
                dialog_store_imageUrl: "", // 弹出层-添加/编辑门店-头图
                dialog_storeMap_imageUrl: "", // 弹出层-添加/编辑门店-门店地图
                dialog_storeRemarkList: [// 弹出层-编辑品牌-门店标签
                    {name: "足浴", status: false}, {name: "精油", status: false}, {name: "spa", status: false}],
                dialog_select_storeStar: "", // 弹出层-添加/编辑门店-门店星级
                dialog_storeStarList: [{value: "1", label: "1"}, {value: "2", label: "2"}],
                dialog_storeLongitude: "", // 弹出层-添加/编辑门店-门店经度
                dialog_storeLatitude: "", // 弹出层-添加/编辑门店-门店维度
                dialog_store_openTime: [// 弹出层-添加/编辑门店-门店营业时间
                    new Date(2018, 7, 19, 11), new Date(2016, 9, 10, 23)],
                dialog_store_preDelay: false, // 弹出层-添加/编辑门店-门店延长时间-向前(是否选中)
                dialog_store_preDelayNum: 0,
                dialog_store_select_preDelayTime: "分",
                dialog_store_preDelayTimeList: [{value: "分", label: "分"}, {value: "时", label: "时"}],

                dialog_store_nextDelay: false, // 弹出层-添加/编辑门店-门店延长时间-向后(是否选中)
                dialog_store_nextDelayNum: 0,
                dialog_store_select_nextDelayTime: "分",
                dialog_store_nextDelayTimeList: [{value: "分", label: "分"}, {value: "时", label: "时"}],

                dialogServerItemVisible: false, // 弹出层-服务项目

                dialog_serverItemPlatIdx: 0, // 弹出层-服务项目-所属平台-默认下标
                dateList: [// 弹出层-服务项目-分时售价
                ],
                saleDateListTime: "", // 弹出层-服务项目-分时售价-下标
                // 周期售价
                dayList: [// 弹出层-服务项目-周期售价
                    {
                        week: 1, date: "周一", shareList: []
                    }, {
                        week: 2, date: "周二", shareList: []
                    }, {
                        week: 3, date: "周三", shareList: []
                    }, {
                        week: 4, date: "周四", shareList: []
                    }, {
                        week: 5, date: "周五", shareList: []
                    }, {
                        week: 6, date: "周六", shareList: []
                    }, {
                        week: 7, date: "周日", shareList: []
                    }],
                saleDayListTime: "周一", // 弹出层-服务项目-周期售价-下标
                mechCashStyleList: [// 普通技师提成方式
                    {value: 2, label: "百分比例"}, {value: 1, label: "固定金额"}],

                cityList: [],

                regionList: [],

                cityCode: null,

                regionCode: null,

                districtCode:null,

                xianList: [],

                xianCode: null
            };
        },

        mounted() {
            this.init();

        },

        watch: {
            //监听品牌Id变化
            brandId: function (val) {
                if (val) {
                    //查询品牌项目
                    let self = this;
                    brandProdcutApi.queryByBrand(this.brandId, data => {
                        self.brandProductList = data;
                    });
                } else {
                    //品牌Id为nul
                }
            },
 
            cityCode(newCode, oldCode) {

                let self = this
                cityApi.parentRegion(newCode, (data) => {

                    self.xianList = data

                    if (data.length > 0) {
                        if(self.curShop !=null){
                             
                            console.log("区县==",self.curShop.districtCode);
                              for(var o=0;o<data.length;o++){
                             var citycode=data[o].regionCode
                             console.log("regionCode==",data[o].regionCode);
                             if(citycode == self.curShop.districtCode) {
                                  console.log("111111111111111==", null);
                                 console.log("区县11111==", data[o].regionCode);
                               self.xianCode = data[o].regionCode
                             }    
                        }
                        }else{
                           self.xianCode = data[0].regionCode
                        }
                        
                    }
                })
            },


            xianCode(newCode, oldCode) {

                let self = this
                cityApi.parentRegion(newCode, (data) => {

                    self.regionList = data

                    if (data.length > 0) {
                        
                        if(self.curShop !=null){
                            console.log(self.curShop.regionCode);
                              for(var o=0;o<data.length;o++){
                             var citycode=data[o].regionCode
                             console.log("区域==",data[o].regionCode);
                             if(citycode == self.curShop.regionCode) {
                                console.log("22222222222222==", null);
                                console.log("区域22222==", data[o].regionCode);
                               self.regionCode = data[o].regionCode
                             }    
                        }
                        }else{
                           self.regionCode = data[0].regionCode
                        }
                    }

                })
            },


            //监听门店Id变化
            shopId: function (shopId) {
                const self = this;
                if (shopId) {
                    //查询房间
                    this.queryRoomByShop(shopId);

                    const params = {
                        shopId: this.shopId, sourceId: this.selectChannelId
                    };
                    shopProductApi.query(params, data => {
                        data.forEach(item => {
                            if (item.saleType == 1) {
                                item.saleType = "标准售价";
                            } else if (item.saleType == 2) {
                                item.saleType = "周期售价";
                            } else if (item.saleType == 3) {
                                item.saleType = "分时售价";
                            }
                        });
                        self.shopProductList = data;
                    });
                } else {
                    //门店id 为 null

                    self.shopProductList = [];
                    self.roomList = [];
                }
            },

            //监听渠道Id变化
            selectChannelId: function (val) {
                this.selectChannelId = val;
                const self = this;

                if (this.shopId) {
                    const params = {
                        shopId: this.shopId, sourceId: val
                    };
                    shopProductApi.query(params, data => {
                        data.forEach(item => {
                            if (item.saleType == 1) {
                                item.saleType = "标准售价";
                            } else if (item.saleType == 2) {
                                item.saleType = "周期售价";
                            } else if (item.saleType == 3) {
                                item.saleType = "分时售价";
                            }
                        });
                        self.shopProductList = data;
                    });
                }
            }
        },

        methods: {
            init: function () {
                this.queryBrand();
                this.queryMerchant();
                this.queryCity();
                this.querySource();

                //添加原型
                Date.prototype.addDays = function (days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                };
            },
//111111111
            changeShopProduct(product) {
                this.queryShopProductDetail(product.id);
            },


            deleteShopProduct(product) {

                let self = this
                dialog.confirm(() => {

                    let params = {
                        id: product.id
                    }
                    shopProductApi.deleteShopProduct(params, (data) => {

                        const params = {
                            shopId: self.shopId, sourceId: self.selectChannelId
                        };
                        shopProductApi.query(params, data => {
                            data.forEach(item => {
                                if (item.saleType == 1) {
                                    item.saleType = "标准售价";
                                } else if (item.saleType == 2) {
                                    item.saleType = "周期售价";
                                } else if (item.saleType == 3) {
                                    item.saleType = "分时售价";
                                }
                            });
                            self.shopProductList = data;
                        });
                    })
                })
            },

            queryShopProductDetail(shopProductId) {
                let self = this;
                shopProductApi.queryShopProductDetail(shopProductId, product => {
                    self.curServerItem.id = product.id;
                    self.curServerItem.brandProductId = product.brandProductId;
                    self.curServerItem.name = product.name;

                    product.labelIds.forEach(lableId => {
                        self.productLabelList.forEach(lable => {
                            if (lable.id == lableId) {
                                lable.select = true;
                            }
                        });
                    });
                    self.curServerItem.lastPrice = product.originalPrice;
                    self.curServerItem.price = product.sellPrice;
                    self.dialog_serverItemPlatIdx = product.sourceId;
                    self.curServerItem.saleStyleIdx = product.saleType;

                    let params = {
                        label_type: 3
                    };
                    labelApi.queryList(params, data => {
                        self.productLabelList = data;
                    });
                    mechApi.queryMechLevel(data => {
                        data.forEach(mechLevel => {
                            product.mechLevelList.forEach(level => {
                                if (mechLevel.id == level.id) {
                                    mechLevel.bonus = level.bonus;
                                    mechLevel.bonusType = level.bonusType;
                                }
                            });
                        });
                        self.mechLevelList = product.mechLevelList;
                    });

                    self.dialogServerItemVisible = true;
                });
            },

            addRoom() {
                if (this.shopId) {
                    this.curRoom.name=null;
                    this.curRoom.bedCount=null;
                    this.curRoom.bedNo=null;
                    this.curRoom.image=null;
                     
                    this.dialogEditRoomVisible = true;

                } else {
                    show.error("未指定门店");
                }
            },

            handleClickroom(row) {
                console.log(row);

                this.curRoom = utils.deepCopy(row);

                this.dialogEditRoomVisible = true;
            },

            changeServiceItemSaleTime(item) {
                let dayList = this.getDateRange(item[0], item[1]);

                let timeList = [];
                dayList.forEach(day => {
                    timeList.push({
                        date: moment(day).format("MM.DD"), day: moment(day).format("YYYY-MM-DD"), saleList: []
                    });
                });

                if (timeList.length > 0) {
                    this.saleDateListTime = timeList[0].date;
                }
                console.log(timeList);
                this.dateList = timeList;
            }, getDateRange(startDate, endDate) {
                var dateArray = new Array();
                var currentDate = startDate;
                while (currentDate <= endDate) {
                    dateArray.push(new Date(currentDate));
                    currentDate = currentDate.addDays(1);
                }
                return dateArray;
            },

            addShare(item) {
                item.shareList.push({startTime: "", endTime: "", sellPrice: 0});
            },

            removeShare(item, index) {
                item.shareList.splice(index, 1);
            },

            removeTime(item, index) {
                item.saleList.splice(index, 1);
            },

            addTime(item) {
                console.log(item);
                item.saleList.push({
                    startTime: "", endTime: "", sellPrice: 0
                });
            },

            queryBrand: function () {
                const self = this;
                brandApi.queryByEmp(function (data) {
                    self.brandList = data;
                    if (data && data.length > 0) {
                        const brand = data[0];
                        self.brandId = brand.id;
                        self.queryShopByBrand(brand.id);
                    }
                });
            },

            queryMerchant: function () {
                const self = this;
                merchantApi.getByEmp(function (data) {
                    self.curMerchant = data;
                });
            },

            queryCity: function () {
            },

            querySource() {
                let self = this;
                appointApi.querySource(data => {
                    self.channelList = data;

                    if (data.length > 0) {
                        self.selectChannelId = data[0].id + "";
                    }
                });
            },

            //查询门店
            queryShopByBrand: function (brandId) {
                const self = this;
                shopApi.queryByBrand(brandId, function (data) {
                    self.shopList = data;
                    if (data && data.length) {
                        self.selectShop = utils.deepCopy(data[0]);
                        self.shopId = data[0].id;
                    } else {
                        self.selectShop = null;
                        self.shopId = null;
                    }
                });
            },

            //查询房间
            queryRoomByShop: function (shopId) {
                const self = this;
                roomApi.queryByShop(shopId, data => {
                    self.roomList = data;
                    if (data && data.length > 0) {
                    } else {
                    }
                });
            },

            addShopProduct() {
                let self = this;
                dialog.confirm(() => {
                    let product = {};
                    product.brandProductId = self.curServerItem.brandProductId;
                    product.name = self.curServerItem.name;

                    let lableIds = [];
                    this.productLabelList.forEach(item => {
                        lableIds.push(item.id);
                    });
                    product.lableIds = lableIds;

                    product.originalPrice = self.curServerItem.lastPrice;
                    product.sellPrice = self.curServerItem.price;

                    product.sourceId = self.dialog_serverItemPlatIdx;

                    product.saleType = self.curServerItem.saleStyleIdx;

                    product.dayList = self.dayList;
                   
                    product.mechLevelList = self.mechLevelList;
                    product.shopId = self.shopId;

                    product.timeList = self.dateList;
                    product.imageUrl= this.curServerItem.imageUrl;
                    if (self.curServerItem.id) {
                        product.id = self.curServerItem.id;
                        //更新
                        shopProductApi.update(product, data => {
                            self.dialogServerItemVisible = false;
                            show.success("更新成功");
                        });
                    } else {
                        //新增

                        shopProductApi.insert(product, data => {
                            self.dialogServerItemVisible = false;

                            show.success("添加成功");
                        });
                    }
                });
            },

            /**
             * 点击品牌
             */
            handleClickBrand(brand) {
                this.selectBrand = brand;
                this.brandId = brand.id;
                this.queryShopByBrand(brand.id);
            },

            clickEditBrand: function (item) {
                this.dialogEditBrandVisible = true;
                this.curBrand = utils.deepCopy(item);
            },

            clickAddShop: function (item) {
                this.resetEmptyShop();
                const self = this;
                self.curShop.brandId = item.id;
                self.dialogEditStoreVisible = true;

                //查询城市
                cityApi.parentRegion('000000', (data) => {

                    self.cityList = data

                    if (data.length > 0) {
                        self.cityCode = data[0].regionCode
                    }
                })


            },

            clickAddShopProductButton: function () {
                if (!this.shopId) {
                    show.error("门店未选择");
                    return;
                }

                let self = this;
                self.curServerItem.id = null;
                self.dialogServerItemVisible = true;

                let params = {
                    label_type: 3
                };

                labelApi.queryList(params, data => {
                    self.productLabelList = data;
                });
                mechApi.queryMechLevel(data => {
                    self.mechLevelList = data;
                });
            },

            resetEmptyShop: function () {
                this.curShop = {
                    name: "",
                    brandId: null,
                    cityId: null,
                    regionId: null,
                    address: "",
                    contact: "",
                    contactMobile: "",
                    lng: null,
                    lat: null,
                    tel: "",
                    topImage: ""
                };
            },

            /**
             * 门店基本数据-tab
             */
            handleClickTab(tab, event) {
                console.log(tab, event);
            },

            /**
             * 点击门店
             */
            handleClickStore(shop) {
                this.shopId = shop.id;
                this.selectShop = shop;
            }, /**
             * 点击编辑门店111111111111
             */
            handleClickcurShop(shop) {
                this.shopId = shop.id;
                this.curShop = shop;
                 console.log("编辑门店", null);
                 if(shop.cityCode == null){
                     this.curShop.cityCode = null
                        this.curShop.regionCode = null
                         this.curShop.districtCode = null
                 }else{
                     this.curShop.cityCode = shop.cityCode
                        this.curShop.regionCode = shop.regionCode
                         this.curShop.districtCode = shop.districtCode
                 }
                this.dialogEditStoreVisible = true;
                //查询城市
                let self = this;
                cityApi.parentRegion('000000', (data) => {

                    self.cityList = data

                    if (data.length > 0) {
                        for(var o=0;o<data.length;o++){
                             var citycode=data[o].regionCode
                             if(citycode == shop.cityCode) {
                                 console.log("城市==", data[o].regionCode);
                               self.cityCode = data[o].regionCode;
                              // self.handgetquxianbycity(self.cityCode);
                             }    
                        }
                       
                    }
                })
                
 
            },
            // handgetquxianbycity(newCode){
            //      let self = this
            //     cityApi.parentRegion(newCode, (data) => {

            //         self.xianList = data

            //         if (data.length > 0) {
            //             if(self.curShop !=null){
                             
            //                 console.log("handgetquxianbycity 区县==",self.curShop.districtCode);
            //                   for(var o=0;o<data.length;o++){
            //                  var citycode=data[o].regionCode
            //                  console.log("handgetquxianbycity regionCode==",data[o].regionCode);
            //                  if(citycode == self.curShop.districtCode) {
            //                       console.log("handgetquxianbycity 111111111111111==", null);
            //                      console.log("handgetquxianbycity 区县11111==", data[o].regionCode);
            //                    self.xianCode = data[o].regionCode
            //                    self.handgetquxianbycity(self.xianCode);
            //                  }    
            //             }
            //             }else{
            //                self.xianCode = data[0].regionCode
            //                self.handgetquxianbycity(self.xianCode);
            //             }
                        
            //         }
            //     })
            // },
            // handlequerybyquxian(newCode){
            //      let self = this
            //     cityApi.parentRegion(newCode, (data) => {

            //         self.regionList = data

            //         if (data.length > 0) {
                        
            //             if(self.curShop !=null){
            //                 console.log(self.curShop.regionCode);
            //                   for(var o=0;o<data.length;o++){
            //                  var citycode=data[o].regionCode
            //                  console.log("区域==",data[o].regionCode);
            //                  if(citycode == self.curShop.regionCode) {
            //                     console.log("22222222222222==", null);
            //                     console.log("区域22222==", data[o].regionCode);
            //                    self.regionCode = data[o].regionCode
            //                  }    
            //             }
            //             }else{
            //                self.regionCode = data[0].regionCode
            //             }
            //         }

            //     })
            // },
            clickAddBrand: function () {
                this.resetBrandEmpty();
                this.dialogEditBrandVisible = true;

                let params = {
                    label_type: 1
                };
                let self = this;
                labelApi.queryList(params, data => {
                    self.brandLabelList = data;
                });
            },

            resetBrandEmpty: function () {
                this.curBrand = {
                    name: "", address: "", contact: "", contactMobile: "", contactLicence: "", remark: ""
                };
            },

            clickSaveBrand: function () {
                const self = this;
                dialog.confirm(() => {
                    if (self.curBrand.id) {
                        brandApi.update(self.curBrand, function (data) {
                            self.dialogEditBrandVisible = false;
                            show.success("操作成功");
                            self.queryBrand();
                            
                        });
                    } else {
                        let labelIds = [];
                        self.brandLabelList.forEach(label => {
                            labelIds.push(label.id);
                        });
                        self.curBrand.labelIds = labelIds;
                        brandApi.insert(self.curBrand, function (data) {
                            self.dialogEditBrandVisible = false;
                            show.success("操作成功");
                            self.queryBrand();
                            //self.init();
                        });
                    }
                });
            },

            clickSaveShop: function () {
                const self = this;

                dialog.confirm(() => {
                    if (self.curShop.id) {
                        self.curShop.gmtCreated=null;
                        self.curShop.gmtModified=null;
                         self.curShop.registerTime=null;
                          self.curShop.cityCode = self.cityCode//城市
                        self.curShop.regionCode = self.regionCode//区域
                         self.curShop.districtCode = self.xianCode//市县
                        shopApi.update(self.curShop, function (data) {
                            self.dialogEditStoreVisible = false;
                            show.success("操作成功");
                            self.queryShopByBrand(self.brandId);
                           
                           
                        });
                    } else {
                           console.log(self.xianCode + "县市=====>");
                        self.curShop.cityCode = self.cityCode
                        self.curShop.regionCode = self.regionCode
                         self.curShop.districtCode = self.xianCode
                        shopApi.insert(self.curShop, function (data) {
                            self.dialogEditStoreVisible = false;
                            show.success("操作成功");
                            self.queryShopByBrand(self.brandId);
                        });
                    }
                });
            },
/**
 * 门店保存
 */
            clickSaveRoom: function () {
                const self = this;
                dialog.confirm(() => {
                    if (self.curRoom.id) {
                        self.curRoom.gmtCreated=null;
                        self.curRoom.gmtModified=null;
                        
                        roomApi.update(self.curRoom, () => {
                            self.dialogEditRoomVisible = false;
                            show.success("操作成功");
                            self.curRoom.image=null;
                           self.queryRoomByShop(self.selectShop.id);
                            
                        });
                    } else {
                        console.log(self.curShop);
                        self.curRoom.brandId = self.selectShop.brandId;
                        self.curRoom.shopId = self.selectShop.id;
                        roomApi.insert(self.curRoom, () => {
                            self.dialogEditRoomVisible = false;
                            show.success("操作成功");
                            self.curRoom.image=null;
                            self.queryRoomByShop(self.selectShop.id);
                        });
                    }
                });
            },

            clickSaveShopProduct: function () {
                const self = this;
            },

            clickSuccessShopProduct: function (show) {
                console.log(show + "=====>");
                this.dialogEditProductVisible = show;

                const params = {
                    shopId: this.shopId, channelId: this.selectChannelId
                };
                const self = this;
                shopProductApi.query(params, data => {
                    data.forEach(item => {
                        if (item.saleType == 1) {
                            item.saleType = "标准售价";
                        } else if (item.saleType == 2) {
                            item.saleType = "周期售价";
                        } else if (item.saleType == 3) {
                            item.saleType = "分时售价";
                        }
                    });
                    self.shopProductList = data;
                });
            },

            clickCancelShopProduct: function () {
                this.dialogEditProductVisible = false;
            },

            /**
             * 改变售价方式
             */
            changeSaleStyle(val) {
                console.info(val);
            },

            /*
                     * 改变规则状态
                     */
            changeRuleStatus(data, idx) {
                console.info(data, idx);
                // if (data.status) {
                //     this.$message({
                //         message: '恭喜你，该规则已上线！',
                //         type: 'success'
                //     });
                // } else {
                //     this.$message({
                //         message: '注意，该规则已下线！',
                //         type: 'warning'
                //     });
                // }
            },

            /**
             * 服务项目-菜单状态切换
             */
            handleSelect(key, keyPath) {
                this.selectChannelId = key;
            },

            /**
             * 弹出层-编辑商户-菜单状态切换
             */
            dialog_handleSelect(key, keyPath) {
                this.dialog_menuStatusIndex = key;
                // console.log(key, keyPath)
                console.log(key);
            },

            /*
                     * 弹出层-图片-上传-商家
                     */
            handleAvatarSuccess(res, file) {
                this.dialog_imageUrl = URL.createObjectURL(file.raw);
                console.log(this.dialog_imageUrl);
                 
            },

            beforeAvatarUpload(file) {
                const isJPG = file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error("上传头像图片只能是 JPG 格式!");
                }
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                }
                return isJPG && isLt2M;
            },

            /*
                     * 弹出层-图片-上传-品牌
                     */
            handleAvatarSuccessBrand(res, file) {
                this.dialog_imageUrl = URL.createObjectURL(file.raw);
            },

            handleBrandLogoUpload(res, file) 
            {
                console.log(res);

                if (res.code == 0) {
                    this.curBrand.logo = res.data.filePath;
                }

                console.log(this.curBrand);
            },

            handleBrandLicenceUpload(res, file) {
                console.log(res);

                if (res.code == 0) {
                    this.curBrand.businessLicence = res.data.filePath;
                }

                console.log(this.curBrand);
            },

            beforeAvatarUploadBrand(file) {
                const isJPG = file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error("上传头像图片只能是 JPG 格式!");
                }
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                }
                return isJPG && isLt2M;
            },

            /*
                     * 弹出层-图片-上传-编辑门店-头图
                     */
            handleAvatarSuccessStore(res, file) {
                 
               // this.dialog_store_imageUrl = URL.createObjectURL(file.raw);
                 this.curShop.topImage = res.data.filePath;
                  
            },
             /*
                     * 弹出层-图片-上传-编辑房间-头图
                     */
            handleAvatarSuccessStoreroom(res, file) {
                 
               // this.dialog_store_imageUrl = URL.createObjectURL(file.raw);
                 this.curRoom.image = res.data.filePath;
                  
            },
             /*
                     * 弹出层-图片-上传-编辑服务项目-头图
                     */
            handleAvatarSuccessStorecurimg(res, file) {
                 
               // this.dialog_store_imageUrl = URL.createObjectURL(file.raw);
                 this.curServerItem.imageUrl = res.data.filePath;
                  
            },
            

            beforeAvatarUploadStore(file) {
                const isJPG = file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error("上传头像图片只能是 JPG 格式!");
                }
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                }
                return isJPG && isLt2M;
            },

            /*
                     * 弹出层-图片-上传-编辑门店-门店地图
                     */
            handleAvatarSuccessStoreMap(res, file) {
                this.dialog_storeMap_imageUrl = URL.createObjectURL(file.raw);
                 
                this.curShop.addressImage = res.data.filePath;
            },

            beforeAvatarUploadStoreMap(file) {
                const isJPG = file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error("上传头像图片只能是 JPG 格式!");
                }
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                }
                return isJPG && isLt2M;
            }
        }
    };
</script>

<style lang="less" scoped>
.shangjiaguanli {
  .shangjiaguanli-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  > div:nth-of-type(2) {
    // margin-top: 20px;
    > span:nth-of-type(1) {
      font-size: 20px;
      margin-right: 20px;
    }
    > span:nth-of-type(2),
    > span:nth-of-type(3) {
      font-size: 16px;
      margin-right: 10px;
    }
    > button {
      font-size: 16px;
    }
  }
  > div:nth-of-type(3) {
    overflow: hidden;
    margin-top: 20px;
    ul {
      li {
        width: 200px;
        height: 120px;
        float: left;
        margin-top: 20px;
        margin-right: 20px;
        border: 1px solid #ccc;
        text-align: center;
        h3 {
          padding: 26px 0;
          font-size: 16px;
        }
        button {
          margin: 0;
        }
        button:nth-of-type(2) {
          margin: 0 10px;
        }
      }
      li.active {
        border: 1px solid #f63;
      }
    }
  }
  // 门店数据信息
  .storeDataInfo {
    margin-top: 30px;
    border: 1px solid #f2f2f2;
    .storeData {
      padding-top: 20px;
      text-align: center;
      li {
        padding: 0;
        cursor: pointer;
        button {
          color: #555;
          font-size: 14px;
        }
      }
      li.active {
        button {
          color: #f63;
        }
      }
    }
    .activityInfo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .activityImg {
        width: 138px;
      }
    }
  }
  // 弹出层-添加品牌/门店标签
  .brandRemark,
  .storeRemark {
    ul {
      margin-left: 10px;
      li {
        float: left;
        padding: 4px 10px;
        border: 1px solid #ccc;
        margin-right: 15px;
        border-radius: 4px;
        cursor: pointer;
      }
      li.active {
        border: 1px solid #f63;
        color: #f63;
      }
    }
  }
  // flex布局
  .flex-layout {
    display: flex;
    align-items: center;
  }
}

// 活动头图
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 89px;
  height: 89px;
  line-height: 89px;
  text-align: center;
}
.avatar {
  width: 89px;
  height: 89px;
  display: block;
}
</style>
