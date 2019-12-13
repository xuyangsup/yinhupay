<template>
    <div class="gonggao">
        <div class="gonggao-title">
            <div class="fr"><el-button type="danger" @click="selectadd()">添加公告</el-button></div>
            <h3>公告管理</h3>
        </div>
         <div class="gonggao-container">
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
            <!-- <ul>
                 
                <li :class="{active: item.isSelect}"
                        v-for="item in shopList"
                        :key="item.id"
                        @click="chooseShop(item)">
                        <el-button size="mini" plain >{{item.name}}</el-button>
                    </li>
            </ul> -->
        </div>
         
        <!-- 时间分类 -->
        <!-- <div class="select-time">
            <span>时间分类：</span>
            <ul>
                <li :class="{active : timeTypeIdx === index}"
                v-for="(item, index) in timeType"
                :key="index" @click="timeTypeIdx = index">
                    <el-button type="text">{{item.type}}</el-button>
                </li>
            </ul>
            <div v-show="timeTypeIdx === 4">
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
        </div> -->
        <div>
             
            <span class="mr10">公告名称</span>
            <el-input style="width:20%" placeholder="请输入公告名称/关键字" v-model="search" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="pageQuery()"></el-button>
            </el-input>
        
            </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="itemData"
                style="width: 100%">
                <el-table-column
                    label="公告标题"
                    width="180">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.row.title }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="所属品牌">
                    <template slot-scope="scope">
                        <span>{{ scope.row.brandName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.gmtCreated}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="发布时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.gmtPublisher}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="260">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>  
                        <el-button @click="handleClickpub(scope.row)" v-show="!scope.row.isAnnounce" type="text" size="small">发布</el-button>
                        <el-button @click="handleClickPreview(scope.row)" type="text" size="small">预览</el-button>
                        <el-button @click="handleClickdel(scope.row)" type="text" size="small">删除</el-button>
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

        <!-- 弹出框-公告信息 -->
        <el-dialog title="公告信息" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div style="display: flex;margin-left: 28px">
                    <div class="mr10">
                        <span class="mr10">品牌</span>
                        <el-select v-model="notice.brandId" placeholder="选择品牌">
                            <el-option
                            v-for="item in dialog_brandList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <!-- <div>
                        <span class="mr10">门店</span>
                        <el-select v-model="dialog_select_store" placeholder="选择门店">
                            <el-option
                            v-for="item in dialog_storeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div> -->
                </div>
                <div class="mt10">
                    <span class="mr10">公告标题</span>
                    <el-input style="width: 62%" v-model="notice.title" placeholder="请输入公告标题"></el-input>
                </div>
                <div class="mt20">
                      <quill-editor ref="myTextEditor" v-model="notice.content"
                        :content="content"
                        :options="editorOption"
                        @change="onEditorChange($event)"
                        >
                    </quill-editor> 
                     <!-- <quill-editor  ref="myTextEditor" v-model="notice.content" ></quill-editor> -->
                     
                    <el-upload style="display:none"
                        ref="uniqueId" 
                        id="uniqueId"
                        class="avatar-uploader"
                         action="/api/v1/image/upload"
                        :show-file-list="false"
                        :before-upload='newEditorbeforeupload'  
                         :on-success='newEditorSuccess'>
                    </el-upload>
                    
                     
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="warning" @click="save">确定选择</el-button>
            </span>
        </el-dialog>

        <!-- 弹出框-公告预览 -->
        <el-dialog title="公告预览" :visible.sync="dialogPreviewVisible" :close-on-click-modal="false"  >
            <div>
                <div class="preview">
                    <h3 >{{vtitle}}</h3>
                    <div id="divcontent"  v-html="datas">
                       {{datas}}
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogPreviewVisible = false">取 消</el-button>
                <el-button type="warning" @click="dialogPreviewVisible = false">确定选择</el-button>
            </span>
        </el-dialog>
         <!-- 弹出框-发布 -->
        <el-dialog title="公告发布" :visible.sync="dialogPubVisible" :close-on-click-modal="false"  >
            <div>
                
                   <ul class="dialog-storeList">
                      <li :class="{active: item.isSelect}"
                          v-for="item in shopList"
                          :key="item.id"
                          @click="chooseShop(item)">
                          <el-button size="mini" plain >{{item.name}}</el-button>
                      </li>
                    </ul> 
                 
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogPubVisible = false">取 消</el-button>
                <el-button type="warning" @click="goPublisher">确定选择</el-button>
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
import brandApi from "@/api/brand";
import shopApi from "@/api/shop";
import noticeApi from "@/api/notice";
import moment from "moment";
import utils from "@/common/utils";
import dialog from "@/common/dialog";
import show from "@/common/show";

import { OSS_URL } from "@/api/constant";
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
      brandId: null,
      brandList: [],
      shopList: [],
      IMAGE_URL: OSS_URL,
      storeIndex: 0, // 默认门店下标
      noticeSearch: "", // 技师关键字
      timeTypeIdx: 0, // 时间分类默认下标
      timeType: [
        // 时间分类
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
      itemData: [
        {
          // 表格数据
          noticeTitle: "公告标题",
          storeBrand: "天山店(考拉时光)",
          isAnnounce: 0, // 是否发布
          addDate: "2018-06-26", // 添加时间
          announceDate: "2018-06-26" // 发布时间
        },
        {
          noticeTitle: "公告标题",
          storeBrand: "天山店(考拉时光)",
          isAnnounce: 1, // 是否发布
          addDate: "2018-06-26", // 添加时间
          announceDate: "2018-06-26" // 发布时间
        }
      ],
      datas: "",

      dialogAddVisible: false, // 弹出层-添加公告
      dialogPubVisible: false,
      dialog_brandList: [],
      dialog_select_store: "天山店1", // 弹出框-添加公告-选择门店
      dialog_storeList: [
        { value: "天山店1", label: "天山店1" },
        { value: "天山店2", label: "天山店2" },
        { value: "天山店3", label: "天山店3" },
        { value: "天山店4", label: "天山店4" }
      ],
      dialog_noticeTitle: "", // 弹出框-添加公告-公告标题
      content: "", // 弹出层-添加公告-编辑器默认内容
      search: "",

      //查询参数
      params: {
        page: 1,
        pageSize: 10,
        totalSize: 10,
        search: null,
        brandId: null
      },
      notice: {
        brandId: null,
        title: null,
        content: null
      },
      gmtPublisherdto: {
        noticeId: null,
        shopIds: []
      },
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
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  // this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      vtitle: "",
      vcontent: "",

      dialogPreviewVisible: false // 弹出框-预览
    };
  },
  components: {
    quillEditor
  },

  mounted() {
    this.init();
  },
  //    watch: {
  //     brandId: function(val) {

  //      this.queryShopByBrand(val);
  //     }

  //   },
  methods: {
    handleClick(row) {
      console.log(row);
      this.noticebean = utils.deepCopy(row);
      this.notice.title = this.noticebean.title;
      this.notice.brandId = this.noticebean.brandId;
      this.notice.content = this.noticebean.content;
      this.notice.id = this.noticebean.id;
      this.notice.status = this.noticebean.status;
      this.dialogAddVisible = true;
    },

    /*
         * 弹出层-添加公告-编辑器编辑
         */

    onEditorChange({ editor, html, text }) {
      this.content = html;
    },

    goPublisher: function() {
      let self = this;
      alert(this.gmtPublisherdto.noticeId);
      dialog.confirm(() => {
        let pbshopIds = [];
        self.shopList.forEach(shop => {
          if (shop.isSelect) {
            pbshopIds.push(shop.id);
          }
        });

        self.gmtPublisherdto.shopIds = pbshopIds;
        noticeApi.publisherNotice(self.gmtPublisherdto, data => {
          show.success('发布成功');
          self.dialogPubVisible = false;
          self.pageQuery();
        });
      });
    },
    handleClickpub(row) {
      this.dialogPubVisible = true;
      
      this.gmtPublisherdto.noticeId = row.id;
      this.queryShopByBrand(row.brandId);
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
      alert("response.status==" + response.code);

      alert(response.data.filePath);
      alert(this.IMAGE_URL);
      if (response.code === 0) {
        this.addImgRange = this.$refs.myTextEditor.quill.getSelection();
        alert(this.addImgRange);
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

    selectadd() {
      this.dialogAddVisible = true;
      this.notice.title = null;
      this.notice.id = null;
      this.notice.content = null;
    },

    /*
         * 弹出层-预览
         */
    handleClickPreview(row) {
      console.log(row);
      alert(row.content);
      const self = this;
      self.vtitle = row.title;
      self.datas = row.content;

      this.dialogPreviewVisible = true;
    },
    /**
     * 删除操作
     */

    handleClickdel(row) {
      this.noticebean = utils.deepCopy(row);
      this.notice.title = this.noticebean.title;
      this.notice.brandId = this.noticebean.brandId;
      this.notice.content = this.noticebean.content;
      this.notice.id = this.noticebean.id;
      this.notice.status = this.noticebean.status;
      noticeApi.deletenotice(this.notice, function(data) {
         show.success('删除成功');
        
        // self.notice = self.defaultwechant();
      });
      this.pageQuery();
    },

    init() {
      this.queryBrand();
    },
    chooseShop(shop) {
      shop.isSelect = !shop.isSelect;
    },
    pageQuery() {
      const self = this;
      this.dataLoading = true;
      if (self.search == "") {
        self.params.search = null;
      } else {
        self.params.search = self.search;
      }
      self.params.brandId = self.brandId;

      noticeApi.pageQuerynotice(self.params, data => {
        for (var t = 0; t < data.list.length; t++) {
          data.list[t].gmtCreated = moment(data.list[t].gmtCreated).format(
            "YYYY-MM-DD HH:mm"
          );
          data.list[t].gmtModified = moment(data.list[t].gmtModified).format(
            "YYYY-MM-DD HH:mm"
          );
          data.list[t].gmtPublisher = moment(data.list[t].gmtPublisher).format(
            "YYYY-MM-DD HH:mm"
          );
          if (data.list[t].status == "N") {
            data.list[t].status = "未发布";
            data.list[t].gmtPublisher = null;
          } else if (data.list[t].status == "Y") {
            data.list[t].status = "已发布";
          }
        }
        this.queryShopByBrand(self.brandId);
        self.itemData = data.list;
        self.params.page = data.page;
        self.dataLoading = false;
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
        self.dialog_brandList = data;

        if (data && data.length > 0) {
          self.brandId = data[0].id;
          self.params.brandId = self.brandId;
          self.notice.brandId = data[0].id;
          this.pageQuery();
        }
      });
    },
    /**
     * 保存
     */

    save: function() {
      const self = this;

      if (self.notice.id) {
        // self.notice.content = this.content.replace(/\"/g, "'");
        // alert("self.notice.content====");
        noticeApi.updatenotice(self.notice, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
        });
      } else {
        // self.notice.content = this.content.replace(/\"/g, "'");

        noticeApi.insertnotice(self.notice, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          // self.notice = self.defaultwechant();
        });
      }
    },

    queryShopByBrand: function(brandId) {
      const self = this;
      shopApi.queryByBrand(brandId, function(data) {
        for (var a = 0; a < data.length; a++) {
          data[a].isSelect = false;
        }

        self.shopList = data;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.gonggao {
  .gonggao-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  .gonggao-container {
    padding: 10px 0 0 20px;
    > div:nth-of-type(1) {
      padding-left: 50px;
      position: relative;
      span {
        position: absolute;
        left: 10px;
        top: 5px;
      }
    }
    > ul {
      padding-left: 50px;
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
  .preview {
    padding: 0 10px;
    margin: 0 auto;
    width: 320px;
    height: 600px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow-y: auto;
    h3 {
      text-align: center;
      padding: 15px 0;
      font-size: 20px;
    }
    > div {
      text-indent: 2em;
    }
  }
  // 弹出层
  .dialog-storeList {
    overflow: hidden;
    padding-left: 40px;
    li {
      float: left;
      margin: 10px 10px 0 0;
      button {
        color: #606266;
        border: 1px solid #dcdfe6;
      }
    }
    /*li:hover button{*/
    /*border: 1px solid #409EFF;*/
    /*color: #409EFF;*/
    /*}*/
    li.active button {
      border: 1px solid #409eff;
      color: #409eff;
    }
  }
}
</style>