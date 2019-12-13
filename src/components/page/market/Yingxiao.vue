<template>
    <div class="yingxiao">
        <div class="yingxiao-title">
            <div class="fr">
                <el-button @click="openactiv()" type="danger">添加活动</el-button>
            </div>
            <h3>营销活动</h3>
        </div>
        <div class="yingxiao-container">
            <div>
                <span>品牌</span>
                <el-select v-model="select_brand" placeholder="选择品牌" class="handle-select mr10">
                    <el-option
                    v-for="item in brandList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <ul>
                <li :class="{active : storeIndex ===  item.id}"
                v-for="(item,index) in storeList"
                :key="index" @click="clickStore( item.id)">
                    <el-button size="mini" plain>{{item.name}}</el-button>
                </li>
            </ul>
        </div>
        <!-- 时间分类 -->
        <div class="select-time">
            <span>时间分类：</span>
            <ul>
                <li :class="{active : timeTypeIdx === index}"
                v-for="(item, index) in timeType"
                :key="index" @click="clickTimeType(index)">
                    <el-button type="text">{{item.type}}</el-button>
                </li>
            </ul>
            <div v-show="timeTypeIdx === 5">
                <el-date-picker
                v-model="selectTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                >
                </el-date-picker>
            </div>
        </div>
        <!-- 活动类型 -->
        <div>
            <span>活动类型：</span>
            <ul>
                <li :class="{active : activityIdx === index}"
                v-for="(item, index) in activityType"
                :key="index" @click="clickactivityType(index)">
                    <el-button type="text">{{item.type}}</el-button>
                </li>
            </ul>
        </div>
        <!-- 活动查询 -->
        <div>
            <span>活动查询：</span>
            <el-input style="width:300px" placeholder="输入活动名称\关键字" v-model="activitySearch">
                <el-button slot="append" icon="el-icon-search" @click="pageQuery()"></el-button>
            </el-input>
        </div>
        <!-- 活动表格数据 -->
        <div>
            <el-table
                :data="activityData"
                style="width: 100%">
                <el-table-column
                    label="活动信息"
                    width="300">
                    <template slot-scope="scope">
                        <div class="activityInfo">
                            <div class="activityImg">
                                <img :src="IMAGE_URL+scope.row.image" width="90px" height="90px" alt="">
                            </div>
                            <div>
                                <span>{{ scope.row.title }}</span><br>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="活动时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.startTime }}</span>
                        至
                        <span>{{ scope.row.endTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="活动类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="发布状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                        <el-button @click="handleClickEdit(scope.row)" type="text" size="small">修改</el-button>
                        <el-button @click="handleClickpublish(scope.row)"  type="text" size="small">发布</el-button>
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

        <!-- 弹出框-添加活动 -->
        <el-dialog title="优惠活动" :visible.sync="dialogActivityVisible">
            <!-- 添加活动 -->
            <div class="basic_info">
                <el-menu
                    :default-active="orderStatusIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#ccc"
                    text-color="#fff"
                    active-text-color="#f63">
                    <el-menu-item index="0">基本信息</el-menu-item>
                    <el-menu-item index="1">活动详情</el-menu-item>
                    <el-menu-item index="2">设置规则</el-menu-item>
                    <el-menu-item index="3">活动图片</el-menu-item>
                </el-menu>
                <!-- tab1-基本信息 -->
                <div v-show="orderStatusIndex === '0'">
                    <!-- 活动标题 -->
                    <!-- 活动类型 -->
        <div>
            <span style="width: 12%; display: inline-block; text-align: right" class="mr10">活动类型：</span>
             <el-select v-model="activitytype" placeholder="选择类型" class="handle-select mr10">
                    
                    <el-option
                    v-for="item in dialogActivityType"
                    :key="item.value"
                    :label="item.type"
                    :value="item.value">
                    </el-option>
                </el-select>
        </div>
                    <div class="mt10">
                        <span style="width: 12%; display: inline-block; text-align: right" class="mr10">活动标题</span>
                        <el-input style="width: 50%" v-model="activityParams.title"></el-input>
                    </div>
                    <!-- 活动副标题 -->
                    <div class="mt10">
                        <span style="width: 12%; display: inline-block; text-align: right" class="mr10">活动副标题</span>
                        <el-input style="width: 50%" v-model="activityParams.subtitle"></el-input>
                    </div>
                    <!-- 活动头图 -->
                    <div class="mt10 flex-item">
                        <span style="width: 12%; display: inline-block; text-align: right" class="mr10">头图</span>
                        <el-upload
                        ref="activityUpload"
                        class="avatar-uploader"
                        action="/api/v1/image/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="activityParams.image" :src="IMAGE_URL + activityParams.image" class="avatar">
                         
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <!-- 品牌单选 -->
                    <div class="mt10">
                        <span style="width: 12%; display: inline-block; text-align: right" class="mr10">选择品牌</span>
                        
                        <el-select v-model="ac_select_brand" placeholder="选择品牌" class="handle-select mr10">
                    
                    <el-option
                    v-for="item in ac_selectbrand_List"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                    </div>
                    <!-- 选择门店 -->
                    <div class="mt10 select_store">
                        <span style="width: 12%; display: inline-block; text-align: right" class="mr10">选择门店</span>
                        <el-button icon="el-icon-plus" size="mini" @click="queryShopByBrandid(null)"></el-button>
                        <ul>
                            <li v-for="(item, index) in ac_select_storeList" :key="index">
                                <span>{{item.name}}</span>
                                <el-button icon="el-icon-close" size="mini" @click="deleteByBrandid(item.name)"></el-button>
                            </li>
                        </ul>
                         
                    </div>
                    
                    <!-- 服务项目 -->
                    <div class="mt10 select_item">
                        <span style="width: 12%; display: inline-block; text-align: right" class="mr10">服务项目</span>
                        <el-button icon="el-icon-plus" size="mini" @click="dialogopen()"></el-button>
                        <ul>
                            <li v-for="(item, index) in ac_select_itemList" :key="index">
                                <span>{{item.name}}</span>
                                <el-button icon="el-icon-close" size="mini" @click="deleteByprodect(item.name)"></el-button>
                            </li>
                        </ul>
                       
                    </div>
                    <!-- 活动时间 -->
                    <div class="mt10 select_item">
                        <span style="width: 12%; display: inline-block; text-align: right" class="mr10">活动时间</span>
                        <el-date-picker
                        v-model="ac_selectTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <!-- tab2-活动详情 -->
                <div v-show="orderStatusIndex === '1'">
                    <quill-editor ref="myTextEditor" v-model="activityParams1.content"
                        :content="content"
                        :options="editorOption"
                        @change="onEditorChange($event)"
                        >
                    </quill-editor> 
                     <!-- <quill-editor  ref="myTextEditor" v-model="notice.content" ></quill-editor> style="display:none"-->
                     
                    <el-upload 
                        ref="uniqueId" 
                        id="uniqueId"
                        class="avatar-uploader1"
                         action="/api/v1/image/upload"
                        :show-file-list="false"
                        :before-upload='newEditorbeforeupload'  
                         :on-success='newEditorSuccess'>
                    </el-upload>
                </div>
                <!-- tab3-设置规则 -->
                <div v-show="orderStatusIndex === '2'" class="setRule">
                    <!-- 活动类型 
                    <div>
                        <span>活动类型：</span>
                        <ul>
                            <li :class="{active : dialogActivityIdx === index}"
                            v-for="(item, index) in dialogActivityType"
                            :key="index" @click="dialogActivityIdx = index">
                                <el-button type="text">{{item.type}}</el-button>
                            </li>
                        </ul>
                    </div>-->
                    <div></div>
                    <!-- 选择优惠规则 -->
                    <div>
                        <span>选择优惠规则：</span>
                        <el-select v-model="select_rule" placeholder="选择优惠规则" class="handle-select mr10">
                            <el-option  
                            v-for="item in ruleList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <!-- 是否与其它活动同享 
                    <div class="mt10">
                        <span style="display: inline-block; text-align: right" class="mr10">是否与其它活动同享：</span>
                        <el-radio-group v-model="ac_select_share">
                            <el-radio :label="index" v-for="(item, index) in ac_select_shareList" :key="index">{{item.value}}</el-radio>
                        </el-radio-group>
                    </div>-->
                    <!-- 选择活动 
                    <div class="mt10 select_ac">
                        <span style="width: 12%; display: inline-block; text-align: right" class="mr10">选择活动：</span>
                        <el-button icon="el-icon-plus" size="mini"></el-button>
                        <ul>
                            <li v-for="(item, index) in ac_select_acList" :key="index">
                                <span>{{item.name}}</span>
                                <el-button icon="el-icon-close" size="mini"></el-button>
                            </li>
                        </ul>
                    </div>-->
                </div>
                <!-- tab4-活动图片 -->
                <div v-show="orderStatusIndex === '3'" style="padding-top: 10px">
                    <el-upload
                    ref="upload"
                    action="/api/v1/image/upload"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleAvatarSuccesslist"
                   >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogImgVisible">
                        <img width="100%" src="https://kaola-image.oss-cn-shanghai.aliyuncs.com/1540109151239.jpg" alt="">
                        </el-dialog>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogActivityVisible = false">取 消</el-button>
                <el-button type="warning" @click="submit">确定选择</el-button>
            </span>
        </el-dialog>


         <!-- 选择门店-弹框 -->
        <el-dialog title="选择门店" :visible.sync="dialogSelectShop" :close-on-click-modal="false"  >
            <div>
                
                   <ul class="selectSome">
                      <li :class="{active: item.select}"
                          v-for="item in selectShopList"
                          :key="item.id"
                          @click="chooseShop(item)">
                          <el-button size="mini" >{{item.name}}</el-button>
                      </li>
                    </ul> 
                 
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogSelectShop = false">取 消</el-button>
                <el-button type="warning" @click="dialogSelectShop = false">确定选择</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { quillRedefine } from "vue-quill-editor-upload";
import yingxiaoApi from "@/api/yingxiao";
import moment from "moment";
import utils from "@/common/utils";
import { OSS_URL } from "@/api/constant";
import brandApi from "@/api/brand";
import shopApi from "@/api/shop";
import dialog from "@/common/dialog";
import show from "@/common/show";
import huodongApi from "@/api/huodong";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"] // remove formatting button
];

export default {
  data() {
    return {
      select_brand: "", // 默认选择品牌
      shopList: [],
      brandList: [],
      selectshop: [],
      selectruletypeIdx:0,
      brandProductIdList: [],
      selectproduct: [],
      shopIdList: [],
      IMAGE_URL: OSS_URL,
      storeList: [],
      selectuploadimg: [],
      storeIndex: 0, // 默认门店下标
      timeTypeIdx: 0, // 时间分类默认下标
      timeType: [
        // 时间分类
        { type: "不限" },
        { type: "今天" },
        { type: "昨天" },
        { type: "本月" },
        { type: "上月" },
        { type: "自定义" }
      ],
      pickerOptions: {
        // 时间选择
        shortcuts: [
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      selectTime: "", // 默认选中时间
      activityType: [
        { value: "1", type: "砍价" },
        { value: "2", type: "拼团" },
        { value: "3", type: "老带新" },
        { value: "4", type: "优惠券" },
        { value: "5", type: "新用户" },
        { value: "6", type: "满减" }
      ],
      activityIdx: 0, // 默认活动类型下标
      activitySearch: "", // 活动查询内容
      activityData: [
        {
          // 订单数据
          src: "static/img/activity.png",
          activityName: "活动名称活动名称1",
          orderId: 10440170922312,
          starTime: "2016-05-02",
          endTime: "2016-05-03",
          type: "砍价",
          status: "已发布/未发布"
        },
        {
          src: "static/img/activity.png",
          activityName: "活动名称活动名称2",
          orderId: 10440170922312,
          starTime: "2016-05-02",
          endTime: "2016-05-03",
          type: "砍价",
          status: "已发布/未发布"
        }
      ],
      dialogActivityVisible: false, // 弹出层-添加活动
      orderStatusIndex: "0", // 弹出层-tab默认下标-tab1
      activityTitle: "", // 弹出层-活动标题-tab1
      activityTitleElse: "", // 弹出层-活动副标题-tab1
      imageUrl: "", // 弹出层-活动头图地址-tab1
      ac_select_brand: "", // 弹出层-品牌选择-tab1
      activitytype: "",
      ac_select_storeList: [],
      ac_select_itemList: [],
      ac_selectbrand_List: [],
      ac_selectTime: "", // 弹出层-活动时间-tab1
      content: "", // 弹出层-活动详情-编辑器默认内容-tab2
      editorOption: {
        // 弹出层-添加公告-编辑器配置项
        // something config
        placeholder: "Hello World",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector(".avatar-uploader1 input").click();
                } else {
                  // this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      dialogActivityType: [
        // 弹出层-设置规则-活动类型-tab3
        { value: "1", type: "砍价" },
        { value: "2", type: "拼团" },
        { value: "3", type: "老带新" },
        { value: "4", type: "优惠券" },
        { value: "5", type: "新用户" },
        { value: "6", type: "满减" }
      ],
      //查询参数
      params: {
        selectType: 0,
        search: null,
        type: null,
        startTime: null,
        endTime: null,
        brandId: null,
        shopId: null,
        page: 1,
        pageSize: 10,
        totalSize: 10
      },
      paramsrule: {
        // id: 0,
        selectType: 0,
        name: null,
        type: null,
        originalPrice: null,
        lowestPrice: null,
        stock: null,
        soldStock: null,
        remainStock: null,
        startTime: null,
        endTime: null,
        page: 0,
        pageSize: 100,
        totalSize: 100,
        status:1
      },
      activityParams: {
        brandId: null,
        title: null,
        image: null,
        subtitle: null,
        shopIdList: [],
        brandProductIdList: [],
        startTime: null,
        endTime: null,
        type: null
      }, //1111111111
      activityParams1: {
        activityId: null,
        content: null,
        ruleId:null,
        page: 1,
        pageSize: 100
      },
      globactivityId:null,
      dialogActivityIdx: 0, // 弹出层-设置规则-活动类型下标-tab3
      select_rule: "请选择规则", // 弹出层-设置规则-优惠规则-tab3
      ruleList: [],
      ac_select_share: 0, // 弹出层-设置规则-是否与其它活动同享-tab3
      ac_select_shareList: [
        // 弹出层-设置规则-是否与其它活动同享-tab3
        { value: "是", label: "是" },
        { value: "否", label: "否" }
      ],
      ac_select_acList: [
        // 弹出层-设置规则-活动-tab3
        { name: "活动1" },
        { name: "活动2" }
      ],
      dialogImageUrl: "", // 弹出层-活动图片-地址-tab4
      dialogImgVisible: false, // 弹出层-活动图片-tab4

      dialogSelectShop: false, // 弹出框-选择门店
      selectShopList: [
        { name: "门店1", id: 0, select: false },
        { name: "门店2", id: 1, select: false }
      ]
    };
  },
  components: {
    quillEditor
  },
  mounted() {
    this.init();
  },
  watch: {
    select_brand: function(val) {
      this.select_brand = val;

      this.queryShopByBrand(val);
    },

    storeIndex: function(newVal) {
      this.storeIndex = newVal;
      this.pageQuery();
    },
    selectTime(newVal, oldVal) {
      console.log(newVal);
      this.pageQuery();
    },
    ac_selectTime(newVal, oldVal) {
        
    },
    ac_select_brand: function(val) {
      this.ac_select_brand = val;
      this.params.brandId = val;

      // this.queryShopByBrandid(val);
    },
    select_rule:function(val){
        this.activityParams1.ruleId=val;

    }
  },
  methods: {
    /*
         * 点击门店列表 
         */
    clickStore(index) {
      console.info(index);
      this.storeIndex = index;
      this.queryyingxiao();
    },

    pageQuery() {
      const self = this;
      this.params.selectType = this.timeTypeIdx;
      if (this.activitySearch == "") {
        this.params.search = null;
      } else {
        this.params.search = this.activitySearch;
      }

      if (this.timeTypeIdx == "5") {
        if (this.selectTime) {
          this.params.startTime = moment(
            this.selectTime[0],
            "YYYY-MM-DD HH:mm:ss"
          ).valueOf();

          this.params.endTime = moment(
            this.selectTime[1],
            "YYYY-MM-DD HH:mm:ss"
          ).valueOf();
        }
      } else {
        this.params.startTime = null;

        this.params.endTime = null;
      }

      //门店ID
      self.params.brandId = this.select_brand;
      //品牌ID
      self.params.shopId = this.storeIndex;
      yingxiaoApi.pageQueryActivity(self.params, data => {
        for (var t = 0; t < data.list.length; t++) {
          data.list[t].startTime = moment(data.list[t].startTime).format(
            "YYYY-MM-DD"
          );
          data.list[t].endTime = moment(data.list[t].endTime).format(
            "YYYY-MM-DD"
          );
          if (data.list[t].status == "Y") {
            data.list[t].status = "已发布";
          } else {
            data.list[t].status = "未发布";
          }
          if (data.list[t].type == "1") {
            data.list[t].type1 = "砍价";
          } else if (data.list[t].type == "2") {
            data.list[t].type1 = "拼团";
          } else if (data.list[t].type == "3") {
            data.list[t].type1 = "老带新";
          } else if (data.list[t].type == "4") {
            data.list[t].type1 = "优惠券";
          } else if (data.list[t].type == "5") {
            data.list[t].type1 = "新用户专享";
          }
        }

        self.activityData = data.list;
        self.params.page = data.page;

        self.params.totalSize = data.totalSize;
      });
    },
    /**
     * 分页页码change
     */
    handleCurrentChange(currentPage) {
      this.params.page = currentPage;
      this.pageQuery();
    },
    //查询品牌
    queryBrand() {
      const self = this;
      brandApi.queryByEmp(data => {
        self.brandList = data;
        self.ac_selectbrand_List = data;
        if (data && data.length > 0) {
          self.select_brand = data[0].id;
          self.ac_select_brand = data[0].id;
        }
      });
    },
    changeUpload(){
      let upload_list_li = document.getElementsByClassName('el-upload-list');
      upload_list_li.push("<li tabindex='0' class='el-upload-list__item is-success'><img src='blob:http://localhost:8088/a31d0e8e-3c82-488d-8f8d-a86ba7d308aa' alt='' class='el-upload-list__item-thumbnail'><a class='el-upload-list__item-name'><i class='el-icon-document'></i>QQ截图20160622232507.jpg"+" </a><label class='el-upload-list__item-status-label'><i class='el-icon-upload-success el-icon-check'></i></label><i class='el-icon-close'></i><i class='el-icon-close-tip'>按 delete 键可删除</i><!----><span class='el-upload-list__item-actions'><span class='el-upload-list__item-preview'><i class='el-icon-zoom-in'></i></span><span class='el-upload-list__item-delete'><i class='el-icon-delete'></i></span></span></li>");
      // for (let i = 0; i < upload_list_li.length; i++) {
                             
      //                       let li_a = upload_list_li[i].children[0];
      //                       let imgElement = document.createElement("img");
      //                       imgElement.setAttribute('src', fileList[i].url);
      //                       imgElement.setAttribute('style', "max-width:50%;padding-left:25%");
      //                       if (li_a.lastElementChild.nodeName !== 'IMG') {
      //                           li_a.appendChild(imgElement);
      //                       }
 
      // }
    },
    //添加活动
    openactiv() {
      this.dialogActivityVisible = true;
      this.activityParams.brandId = null;
      this.activityParams.title = null;
      this.activityParams.image = null;
      this.activityParams.subtitle = null;
      this.activityParams.shopIdList = [];
      this.activityParams.brandProductIdList = [];
      this.activityParams.startTime = null;
      this.activityParams.endTime = null;
      
      this.activityParams.id=null;
      this.activityParams.activityId=null;
      this.activitytype = "1";
      this.queryrule();
    },

    //修改活动
    handleClickEdit(row) {
      const self = this;
      this.activityParams = utils.deepCopy(row);
    
      this.ac_selectTime = [
        this.activityParams.startTime,
        this.activityParams.endTime
      ];
      this.activitytype = this.activityParams.type;
      this.ac_select_brand = this.activityParams.brandId;
      this.dialogActivityVisible = true;
      //查询已有门店
     //  self.activityParams1.activityId=self.globactivityId; 
     
    
      this.activityParams1.activityId = this.activityParams.id;
       
      this.globactivityId=this.activityParams.id;
       
      var allmendian = []; //所有门店
      var allselect = []; //选择门店
      shopApi.queryByBrand(this.ac_select_brand, function(data) {
        allmendian = data;
      }); //查询所有门店
      yingxiaoApi.queryActivityShopByActivityId(this.activityParams1, function(
        data1
      ) {
        for (var m = 0; m < allmendian.length; m++) {
          //根据查询所有门店-过滤门店信息
          var e1 = allmendian[m];
          for (var t = 0; t < data1.length; t++) {
            var e = data1[t];
            if (e1.id == e.shopId) {
              //如果相等就保留
              e1.select = true;
            }
          }
        }
        for (var u = 0; u < allmendian.length; u++) {
          //根据查询所有门店-过滤门店信息
          var e1 = allmendian[u];
          if (e1.select != true) {
            allmendian.splice(u, 1);
          }
        }

        self.ac_select_storeList = allmendian;
        self.selectshop = self.ac_select_storeList;
         
      });
      //查询已有服务项目
      this.activityParams1.id=null;
      this.activityParams1.activityId = this.activityParams.id;
      yingxiaoApi.queryActivityProductByActivityId(
        this.activityParams1,
        function(data) {
          for (var e = 0; e < data.length; e++) {
            // ac_select_itemList
            data[e].id = data[e].productId;
            data[e].name = data[e].productName;
          }
          self.ac_select_itemList = data;
          self.selectproduct = self.ac_select_itemList; 
        }
      );
      self.activityParams1.content=self.activityParams.content;
      this.queryrule();
     // this.changeUpload()
     this.queryByactivetylistimg();
    },

    dialogopen() {
      // this.dialogPubVisible=true;
      const self = this;

      var mdid = self.ac_select_brand;
      for (var e = 0; e < self.selectshop.length; e++) {
        mdid += ":" + self.selectshop[e].id;
      }

      yingxiaoApi.queryProduct(mdid, function(data) {
        self.selectproduct = data;
        self.ac_select_itemList = self.selectproduct;
      });
    },
    //主页面查询shop
    queryShopByBrand(select_brand) {
      const self = this;
      shopApi.queryByBrand(select_brand, function(data) {
        self.storeList = data;
        if (data && data.length) {
          self.storeIndex = data[0].id;
        } else {
          self.storeIndex = null;
        }
      });
    },
    //弹出层选择
    queryShopByBrandid(sbrand) {
      const self = this;

      //  this.dialogSelectShop = true

      if (sbrand == null) {
        sbrand = this.ac_select_brand;
      }
      shopApi.queryByBrand(sbrand, function(data) {
        self.ac_select_storeList = data;
        self.selectshop = self.ac_select_storeList;
        alert(self.selectshop.length);
        if (data && data.length) {
          self.storeIndex = data[0].id;
        } else {
          self.storeIndex = null;
        }
      });
    },
    //门店点击删除时更新
    deleteByBrandid(itemid) {
      const self = this;

      //self.selectshop.splice(itemid,1);
      for (var e = 0; e < self.selectshop.length; e++) {
        if (self.selectshop[e].name == itemid) {
          self.selectshop.splice(e, 1);
        }
      }
      
    },
    //服务项目点击删除时更新
    deleteByprodect(itemid) {
      const self = this;

      for (var e = 0; e < self.selectproduct.length; e++) {
        if (self.selectproduct[e].name == itemid) {
          self.selectproduct.splice(e, 1);
        }
      }
      self.ac_select_itemList = self.selectproduct;
      
    },
    //时间分类查询
    clickTimeType(index) {
      this.timeTypeIdx = index;
      if (index != 5) {
        this.pageQuery();
      }
    },
     //查询活动规则
     queryrule(){
        
       
      //查询所有的活动规则
       huodongApi.pageQueryRule(this.paramsrule, data => {
        //  alert(data.length);
         this.ruleList=data.list
          
      });
      if(this.activityParams1.activityId != null){
      //根据活动ID查询已有的活动规则
        yingxiaoApi.getActivityRuleByActivityId(this.activityParams1, data1 => {
        var isok=false;
        if(data1 != null){
            this.select_rule=data1.rulesId;
        }else{
           this.select_rule=this.ruleList[0].id;
        }
      });
      }
     },
    //活动类型查询
    clickactivityType(index) {
      if (index == 0) {
        this.params.type = null;
      } else {
        this.params.type = index;
      }

      this.activityIdx = index;
      this.pageQuery();
    },

    //查询品牌
    queryyingxiao() {
      this.pageQuery();
    },
    init() {
      this.queryBrand();
      this.queryyingxiao();
    },
    /*
         * 表格-活动详情
         */
    handleClick(row) {
      console.log(row);
    },
    /**
     * 弹出层-添加活动-tab
     */
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
      this.orderStatusIndex = key;
      // alert('key='+key);
      console.log(key);
    },
    /*
         * 弹出层-活动图片-上传
         */
    handleAvatarSuccess(res, file) {
      if (res.code == 0) {
        this.activityParams.image = res.data.filePath;
      }
    },
    /*
         * 弹出层-活动图片-上传
         */
    handleAvatarSuccesslist(res, file) {
       const self = this;
      if (res.code == 0) {
          self.activityParams1.imagePath = res.data.filePath;
          self.activityParams1.activityId =self.activityParams1.id
          if(self.activityParams1.activityId == null){
            self.activityParams1.activityId =this.globactivityId
             self.activityParams1.id =this.globactivityId
          }
          yingxiaoApi.addActivityImage(self.activityParams1, function(data) {
          show.success("操作成功");
           self.selectuploadimg.push(data,res.data.filePath);
           
          
        });
      }
    },
    queryByactivetylistimg(){
          const self = this;
            yingxiaoApi.queryActivityImagesByActivityId(self.activityParams1, function(data) {
              console.log(data);
 
        });
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
         * 弹出层-门店图片列表-删除
         */
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    /*
         * 弹出层-门店图片列表-查看
         */
    handlePictureCardPreview(file) {
      console.info(file);
       
      this.dialogImageUrl = file.url;
      this.dialogImgVisible = true;
    },
    /*
         * 弹出层-确定选择-清空一些参数
         */
    submit() {
      const self = this;
      this.imageUrl = ""; // 清空活动头图上传的图片
      if(self.activityParams1.activityId ==null){
        self.activityParams1.activityId=this.globactivityId; 
      }
       
     if(this.orderStatusIndex==1){
           self.activityParams1.id=self.activityParams.id;
           yingxiaoApi.updateActivity(self.activityParams1, function(data) {
          show.success("操作成功");
           
          self.activityParams.id = data;
          
        });
      }else if(this.orderStatusIndex==2){
            if(self.activityParams1.activityId ==null){
              show.error("请先保存基本信息获取编号");
              
              return false;
            }
           yingxiaoApi.updateActivityRule(self.activityParams1, function(data) {
          show.success("操作成功");
           
          self.activityParams.id = data;
          
        });
      }else if(this.orderStatusIndex==0){

      
      // this.dialogActivityVisible = false; // 弹出层-关闭
      
      // console.info(this.ac_selectTime[0].getTime(), this.ac_selectTime[1].getTime())
      // this.$refs.upload.clearFiles() // 清空上传的图片
     
      self.activityParams.shopIdList =null;
      self.activityParams.brandProductIdList =null;
      self.shopIdList=[];
      self.brandProductIdList=[];
      for (var shop1 = 0; shop1 < self.selectshop.length; shop1++) {
        self.shopIdList.push(self.selectshop[shop1].id);
      }
      self.activityParams.shopIdList = self.shopIdList;
      
      for (var product = 0; product < self.selectproduct.length; product++) {
        self.brandProductIdList.push(self.selectproduct[product].id);
      }
       
      self.activityParams.brandProductIdList = self.brandProductIdList;
      
      self.activityParams.type = this.activitytype;
      self.activityParams.brandId = this.ac_select_brand; //弹出层品牌赋值
       
      self.activityParams.startTime = moment(this.ac_selectTime[0],
        "YYYY-MM-DD HH:mm:ss"
      ).valueOf();
      self.activityParams.endTime = moment(
        this.ac_selectTime[1],
        "YYYY-MM-DD HH:mm:ss"
      ).valueOf();

      if (self.activityParams.id) {
         
        self.activityParams.activityId=self.activityParams.id;
        yingxiaoApi.updateBaseActivity(self.activityParams, function(data) {
          alert('操作成功，请继续修改！');
        });
      } else {
        yingxiaoApi.insertActivity(self.activityParams, function(data) {
           alert('新增成功，请继续修改！');
           self.activityParams.id=data;
           self.activityParams.activityId=data;
           self.globactivityId=data;
           
        });
      }
      }
    },
    /*
         * 弹出层-活动详情-编辑器编辑
         */
    onEditorChange({ editor, html, text }) {
      this.content = html;
      console.info(html);
    },
    newEditorbeforeupload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      if (isJPG && isLt2M) this.imageLoading = true;
      return isJPG && isLt2M;
    },

    //上传图片回调
    newEditorSuccess(response, file) {
      
      if (response.code === 0) {
        this.addImgRange = this.$refs.myTextEditor.quill.getSelection();
         
        let quill = this.$refs.myTextEditor.quill;
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(
          length,
          "image",
          this.IMAGE_URL + response.data.filePath
        );
        // 调整光标到最后
        quill.setSelection(length + 1);
      }
    },

    // 门店选择
    chooseShop(shop) {
      shop.select = !shop.select;
    }
  }
};
</script>

<style lang="less" scoped>
.yingxiao {
  .yingxiao-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  .yingxiao-container {
    padding: 10px 0 0 20px;
    > div:nth-of-type(1) {
      padding-left: 40px;
      position: relative;
      span {
        position: absolute;
        left: 0;
        top: 5px;
      }
    }
    > ul {
      padding-left: 40px;
      overflow: hidden;
      li {
        margin-top: 10px;
        margin-right: 10px;
        float: left;
      }
      li.active button {
        border: 1px solid #409eff;
      }
    }
  }
  // 选择时间
  .select-time {
    margin: 20px 0 10px;
    display: flex;
    align-items: center;
    ul {
      // flex: 1;
      li {
        float: left;
        button {
          color: #333;
          padding: 10px 5px;
          margin: 0 5px;
        }
      }
      li.active {
        button {
          color: #f63;
        }
      }
    }
  }
  // 活动类型
  > div:nth-of-type(4) {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    ul {
      flex: 1;
      li {
        float: left;
        button {
          color: #333;
          padding: 10px 5px;
          margin: 0 5px;
        }
      }
      li.active {
        button {
          color: #f63;
        }
      }
    }
  }
  // 活动表格数据
  > div:nth-of-type(6) {
    margin-top: 20px;
    border: 1px solid #f2f2f2;
    border-bottom: 1px solid transparent;
    .activityInfo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .activityImg {
        width: 138px;
      }
    }
  }
  // 分页
  .pagination {
    text-align: center;
    padding: 20px 0;
  }
  // 弹出层
  .basic_info {
    // tab1-基本信息
    .flex-item {
      display: flex;
      align-items: center;
    }
    .select_store,
    .select_item,
    .select_ac {
      ul {
        overflow: hidden;
        margin-left: 14%;
        li {
          float: left;
          position: relative;
          border: 1px solid #ccc;
          padding: 6px 15px;
          margin: 10px 10px 0 0;
          button {
            position: absolute;
            right: 0;
            top: 0;
            width: 14px;
            height: 14px;
            padding: 0;
            border-left: 1px solid #ccc;
            border-right: 0 none;
            border-top: 0 none;
            border-bottom: 1px solid #ccc;
          }
        }
      }
    }
    // tab3-设置规则
    .setRule {
      > div:nth-of-type(1) {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        ul {
          flex: 1;
          li {
            float: left;
            button {
              color: #333;
              padding: 10px 5px;
              margin: 0 5px;
            }
          }
          li.active {
            button {
              color: #f63;
            }
          }
        }
      }
      > div:nth-of-type(2) {
        span {
          margin-right: 10px;
        }
      }
    }
  }
}

// 活动类型
.el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
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

.selectSome {
  li {
    float: left;
    margin-right: 10px;
    button {
      color: #606266;
      border: 1px solid #dcdfe6;
    }
  }
  li.active button {
    border: 1px solid #409eff;
    color: #409eff;
  }
  // 活动头图
  .avatar-uploader1 .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader1 .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader1-icon {
    font-size: 28px;
    color: #8c939d;
    width: 89px;
    height: 89px;
    line-height: 89px;
    text-align: center;
  }
}
</style>