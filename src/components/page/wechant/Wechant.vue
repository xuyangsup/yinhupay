<template>
    <div class="weixin">
        <div class="weixin-title">
            <div class="fr"><el-button type="danger" @click="handleAddClick();">新 增</el-button></div>
            <h3>微信小程序</h3>
        </div>
        <div class="weixin-container">
           <!--  <div>
                <span>品牌</span>
                <el-select v-model="selectBrandId" placeholder="选择品牌" class="handle-select mr10">
                    <el-option
                    v-for="item in brandData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                
            </div>
            <ul>
                <li :class="{active : storeIndex === index}"
                v-for="(item,index) in storeList"
                :key="index" @click="clickStore(index)">
                    <el-button size="mini" plain>{{item.storeName}}</el-button>
                </li>
            </ul> -->
        </div>
        <div style="margin-top:20px">
            <span class="mr10" style="display:inline-block;width:60px;text-align:right">所属终端</span>
            <el-select style="width:100px" v-model="params.terminal" @change="terminalChange()" placeholder="所属终端" class="handle-select mr10">
                <el-option
                v-for="item in terminalList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div style="margin-top:20px">
            <span class="mr10" style="display:inline-block;width:60px;text-align:right">城市</span>
            <el-select style="width:100px" v-model="params.cityCode" @change="cityChange()" placeholder="城市" class="handle-select mr10">
                <el-option
                v-for="item in locationList"  
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div style="margin-top:20px">
            <!-- 菜单状态 -->
            <el-menu
                :default-active="menuStatusIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#ccc"
                text-color="#fff"
                active-text-color="#f63">
                <el-menu-item index="1">轮播广告</el-menu-item>
                <el-menu-item index="2">内部菜单</el-menu-item>
                <el-menu-item index="3">内部营销</el-menu-item>
            </el-menu>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <!-- 轮播广告 -->
            <el-table
                v-show="menuStatusIndex==='1'"
                :data="itemData"
                style="width: 100%">
                <el-table-column
                    label="标题"
                    width="240">
                    <template slot-scope="scope">
                        <div class="flex-item">
                            <div>
                                <img :src="IMAGE_URL+scope.row.image" alt="">
                            </div>
                            <div>
                                <span>{{ scope.row.name }}</span><br>
                                <!-- <span>{{ scope.row.subTitle }}</span> -->
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="链接地址">
                    <template slot-scope="scope">
                        <span>{{ scope.row.action }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="排序值">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sort }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.isOnline ? '已启用' : '关闭'}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>
                        <!-- <el-switch
                            v-model="scope.row.isOnline"
                            active-text="启用"
                            inactive-text="关闭"
                            active-color="#13ce66"
                            inactive-color="#ccc"
                            @change="changeRuleStatus(scope.row, scope.$index)">
                        </el-switch> -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- 内部菜单 -->
            <el-table
                v-show="menuStatusIndex==='2'"
                :data="itemData2"
                style="width: 100%">
                <el-table-column
                    label="内容"
                    width="240">
                    <template slot-scope="scope">
                        <div class="flex-item">
                            <div>
                                <img :src="IMAGE_URL+scope.row.image" alt="">
                            </div>
                            <div>
                                <span>{{ scope.row.name }}</span><br>
                                <!-- <span>{{ scope.row.subTitle }}</span> -->
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="链接地址">
                    <template slot-scope="scope">
                        <span>{{ scope.row.action }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="排序值">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sort }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.isOnline ? '已启用' : '关闭'}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>
                        <!-- <el-switch
                            v-model="scope.row.isOnline"
                            active-text="启用"
                            inactive-text="关闭"
                            active-color="#13ce66"
                            inactive-color="#ccc"
                            @change="changeRuleStatus(scope.row, scope.$index)">
                        </el-switch> -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- 内部营销 -->
            <el-table
                v-show="menuStatusIndex==='3'"
                :data="itemData3"
                style="width: 100%">
                <el-table-column
                    label="内容"
                    width="240">
                    <template slot-scope="scope">
                        <div class="flex-item">
                            <div>
                                 <img :src="IMAGE_URL+scope.row.image" alt="">
                            </div>
                            <div>
                                <span>{{ scope.row.name }}</span><br>
                                <!-- <span>{{ scope.row.subTitle }}</span> -->
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="链接地址">
                    <template slot-scope="scope">
                        <span>{{ scope.row.action }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="排序值">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sort }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.isOnline ? '已启用' : '关闭'}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>
                        <!-- <el-switch
                            v-model="scope.row.isOnline"
                            active-text="启用"
                            inactive-text="关闭"
                            active-color="#13ce66"
                            inactive-color="#ccc"
                            @change="changeRuleStatus(scope.row, scope.$index)">
                        </el-switch> -->
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

        <!-- 弹出框-新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div>
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">城市</span>
                    <el-select style="width:100px" v-model="wechant.cityCode" placeholder="选择城市" class="handle-select mr10">
                        <el-option
                        v-for="item in cityList"
                        :key="item.regionCode"
                        :label="item.name"
                        :value="item.regionCode">
                        </el-option>
                    </el-select>
                </div>
                 
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">标题</span>
                    <el-input style="width: 50%" v-model="wechant.name" placeholder="请输入标题名称"></el-input>
                </div>
                <!-- <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">副标题</span>
                    <el-input style="width: 50%" v-model="dialog_subTitle" placeholder="请输入副标题名称"></el-input>
                </div> -->
                <!-- 头图 -->
                <div class="mt10" style="display: flex;align-items: center;">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">头图</span>
                    <el-upload
                        ref="activityUpload"
                        class="avatar-uploader"
                         action="/api/v1/image/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                   
                        <img v-if="wechant.image" :src="IMAGE_URL + wechant.image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">终端</span>
                    <el-select style="width:100px" v-model="wechant.terminal" placeholder="所属终端" class="handle-select mr10">
                        <el-option
                        v-for="item in dialog_terminalList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">链接地址</span>
                    <el-input style="width: 50%" v-model="wechant.action" placeholder="请输入链接地址"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">排序值</span>
                    <el-input style="width: 80px" v-model="wechant.sort"></el-input>
                </div>
                <!-- 描述 -->
                <div class="mt10" style="display: flex">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">描述</span>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="如需描述，请输入"
                        v-model="wechant.remark">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="warning" @click="save">确定选择</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import brandApi from "@/api/brand";
import { OSS_URL } from "@/api/constant";
import wechantApi from "@/api/wechat";
import utils from '@/common/utils'
import cityApi from '@/api/city'

export default {
  data() {
    return {
      selectBrandId: null, // 默认选择品牌
      IMAGE_URL: OSS_URL,
      brandData: [],
      thisselect: 1,
      // storeList: [
      //     {storeName: '天山店1'},
      //     {storeName: '天山店2'},
      //     {storeName: '天山店3'},
      //     {storeName: '天山店4'},
      // ],
      storeIndex: 0, // 默认门店下标
      timeTypeIdx: 0, // 时间分类默认下标
      /*timeType: [ // 时间分类
                {type: '今天'},
                {type: '昨天'},
                {type: '本月'},
                {type: '上月'},
                {type: '自定义'}
            ],
            pickerOptions: { // 时间选择
                shortcuts: [{
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },*/
      terminal: "全部", // 默认选择终端
      terminalList: [
        {
          value: "1",
          label: "c端"
        },
        {
          value: "2",
          label: "技师端"
        }
      ],
      cityCode: "全部", // 默认选择终端
      locationList: [
        {
          // 所属终端
          value: "021",
          label: "上海"
        },
        {
          value: "2",
          label: "北京"
        }
      ],
      menuStatusIndex: "1", // 菜单状态-默认下标
      itemData: [],
      itemData2: [],
      itemData3: [],
      dialogAddVisible: false, // 弹出层-新增
      //dialog_select_location: "上海", // 弹出层-默认选择终端
      dialog_locationList: [
        {
          // 弹出层-所属终端
          value: "021",
          label: "上海"
        },
        {
          value: "010",
          label: "北京"
        }
      ],
      dialog_title: "", // 弹出层-标题
      dialog_subTitle: "", // 弹出层-副标题
      image: "", // 弹出层-头图地址
      dialog_select_terminal: "全部", // 弹出层-默认选择终端
      dialog_terminalList: [
        {
          // 弹出层-所属终端
          value: null,
          label: "全部"
        },
        {
          value: "1",
          label: "c端"
        },
        {
          value: "2",
          label: "技师端"
        }
      ],
      dialog_select_type: "轮播广告", // 弹出层-默认选择类型
      dialog_typeList: [
        {
          // 弹出层-所属类型
          value: "1",
          label: "轮播广告"
        },
        {
          value: "2",
          label: "内部菜单"
        },
        {
          value: "3",
          label: "内部营销"
        }
      ],
      wechant: {
        cityCode: null,
        image: null,
        action: null,
        terminal: null,
        remark: null,
        sort: null,
        name:null
      },
        //查询参数
      params: {
        page: 1,
        pageSize: 10,
        totalSize: 10,
        cityCode:null,
        terminal: null
      },
 
      dialog_url: "", // 弹出层-链接地址
      dialog_sort: "1", // 弹出层-排序值
      dialog_remarkTxt: "", // 弹出层-描述

        cityList: [],

        regionList: []
    };
  },

  mounted() {
    this.init();
  },


  watch: {
    selectBrandId: function(val) {
      this.pageQuery();
    }
  },
  methods: {
    /*
         * 点击门店列表 
         */
    init() {
      //  this.queryBrand()
      this.pageQuery();

      //查询城市

        let self = this
        cityApi.parentRegion('000000', (data) => {

            self.cityList = data
        })


    },
    clickStore(index) {
      console.info(index);

      this.storeIndex = index;
    },
    /**
     * 改变城市
     */
    cityChange() {
       console.info(this.params.cityCode)
       if(this.params.cityCode=='全部'){
        
           this.params.cityCode=null;
       }
      this.pageQuery();
    },
    /**
     * 改变城市
     */
    terminalChange() {
       console.info(this.params.terminal)
       if(this.params.terminal=='全部'){
         
           this.params.terminal=null;
       }
      this.pageQuery();
    },
    
    //查询品牌
    queryBrand() {
      const self = this;

      brandApi.queryByEmp(data => {
        for (const brand of data) {
          self.brandData.push({
            value: brand.id,
            label: brand.name
          });
        }

        if (data && data.length > 0) {
          self.selectBrandId = data[0].id;

          //查询
          self.pageQuery();
        }
      });
    },
    pageQuery() {
      const self = this;
      this.dataLoading = true;
     
     // self.params.cityCode = self.cityCode;
      if(this.menuStatusIndex=='1'){
            wechantApi.pageQueryBanner(self.params, data => {
        self.itemData = data.list;
        self.params.page = data.page;
        self.dataLoading = false;
        self.params.totalSize = data.totalSize;
      });

      }else if(this.menuStatusIndex=='2'){
             wechantApi.pageQueryicon(self.params, data => {
        self.itemData2 = data.list;
        self.params.page = data.page;
        self.dataLoading = false;
        self.params.totalSize = data.totalSize;
      });
      }else if(this.menuStatusIndex=='3'){
             wechantApi.pageQueryevent(self.params, data => {
        self.itemData3 = data.list;
        self.params.page = data.page;
        self.dataLoading = false;
        self.params.totalSize = data.totalSize;
      });
      }
    
    },
    /**
     * 分页页码change
     */
    handleCurrentChange(currentPage) {
      this.params.page = currentPage;
      this.pageQuery();
    },
    /**
     * save
     */
    defaultwechant: function() {
      return {
        page: 1,
        pageSize: 10,
        totalSize: 0,
        terminal:null,
        cityCode:null
      };
    },
    
    
    save: function() {
      const self = this;
        if(this.menuStatusIndex=='1'){
      if (self.wechant.id) {
         
        wechantApi.updatebanner(self.wechant, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.wechant = self.defaultwechant();
        });
      } else {
        wechantApi.insertbanner(self.wechant, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.wechant = self.defaultwechant();
        });
      }
        }else if(this.menuStatusIndex=='2'){
             if (self.wechant.id) {
          
        wechantApi.updateicon(self.wechant, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.wechant = self.defaultwechant();
        });
      } else {
        wechantApi.inserticon(self.wechant, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.wechant = self.defaultwechant();
        });
      }
        }else if(this.menuStatusIndex=='3'){
             if (self.wechant.id) {
          
        wechantApi.updateevent(self.wechant, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.wechant = self.defaultwechant();
        });
      } else {
        wechantApi.insertevent(self.wechant, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.wechant = self.defaultwechant();
        });
      }
        }
    },
    /**
     * 菜单状态切换
     */
    handleSelect(key, keyPath) {
        const self = this;
      // console.log(key, keyPath)
      console.log(key);
      this.menuStatusIndex = key;
      self.pageQuery();
      
    },
    /**
     * 修改
     */
    handleClick(row) {
      console.log(row);
        
      this.wechant = utils.deepCopy(row);
    
      this.dialogAddVisible = true;
      
    },
    /**
     * 修改
     */
    handleAddClick() {
     
        
      this.wechant.image = null;
    
      this.dialogAddVisible = true;
      
    },
    /*
         * 改变规则状态
         */
    changeRuleStatus(data, idx) {
      console.info(data, idx);
      if (data.isOnline) {
        this.$message({
          message: "恭喜你，该规则已上线！",
          type: "success"
        });
      } else {
        this.$message({
          message: "注意，该规则已下线！",
          type: "warning"
        });
      }
    },
    /*
         * 弹出层-图片-上传
         */
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);

      if (res.code == 0) {
        this.wechant.image = res.data.filePath;
      }
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
    }
  }
};
</script>

<style lang="less" scoped>
.weixin {
  .weixin-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  .weixin-container {
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
}

.flex-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:nth-of-type(1) {
    width: 92px;
    img {
      width: 100%;
    }
  }
}
</style>
