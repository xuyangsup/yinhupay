<template>
    <div class="xiangmufenlei">
        <div class="xiangmufenlei-title">
             <div class="fr"><el-button type="danger" @click="dialogAddVisible=true">添加分类</el-button></div>
            <h3>项目分类</h3>
        </div>
        <div>
            <!--<div>
                <span>所属品牌</span>
                <el-select class="flex-8" v-model="select_brand">
                    <el-option
                    v-for="item in brandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>-->
            <div>
                <span>分类名称</span>
                <el-input placeholder="请输入项目分类名称" v-model="params.search"   class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="clickSearch"></el-button>
                </el-input>
            </div>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="itemData"
                style="width: 100%">
                <el-table-column
                    label="分类编号"
                    width="180">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.row.id }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="分类名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                 <el-table-column
                    label="创建时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.gmtCreated }}</span>
                    </template>
                </el-table-column>
               <!-- <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.gmtcreated}}</span>
                    </template>
                </el-table-column>-->
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.isEnable== 'Y' ? '已启用' : '关闭'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>  
                        <el-button @click="changeStatus(scope.row.id, scope.row.isEnable)" type="text" size="small">关闭/启用</el-button>
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

        <!-- 弹出框-分类分类 -->
        <el-dialog title="项目分类" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">分类编号</span>
                    <el-input style="width: 30%" v-model="curproduct.code" placeholder="请输入分类编号"></el-input>
                </div>
                <div>
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">分类名称</span>
                    <el-input style="width: 30%" v-model="curproduct.name" placeholder="请输入分类名称"></el-input>
                </div>
               <!--  
               <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">所属分类</span>
                    <el-select class="flex-8" v-model="dialog_select_classify">
                        <el-option
                        v-for="item in dialog_classifyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">二级分类</span>
                    <el-select class="flex-8" v-model="dialog_select_classifySecond">
                        <el-option
                        v-for="item in dialog_classifySecondList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">所属品牌</span>
                    <el-select class="flex-8" v-model="dialog_select_brand">
                        <el-option
                        v-for="item in dialog_brandList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <!-- 描述 
                <div class="mt10" style="display: flex">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">描述</span>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="如需描述，请输入"
                        v-model="remarkTxt">
                    </el-input>
                </div>-->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="warning"   @click="save">确定选择</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import projectApi from "@/api/product/product";
import utils from '@/common/utils'
import dialog from "@/common/dialog";
import show from "@/common/show";
import moment from "moment";
 


export default {
    data () {
         
        return {
             //查询参数
      params: {
        page: 1,
        pageSize: 10,
        totalSize: 10,        
        search: ""
      },
      curproduct: {
        name: "",
        code:""
      },
      openEnable: {
        id: "",
        isEnable:""
      },
            select_brand: '11111考拉时光1', // 默认选择品牌
            brandList: [ {
                value: '考拉时光1',
                label: '考拉时光1'
            }, {
                value: '考拉时光2',
                label: '考拉时光2'
            }],
            classifyName: '', // 分类名称
            itemData: [],
            dialogAddVisible: false, // 弹出层-添加分类
            dialog_classifyName: '', // 弹出层-分类名称
            dialog_classifyId: '', // 弹出层-分类编号
            dialog_select_classify: '', // 弹出层-所属分类
            dialog_classifyList: [{
                value: '上海市',
                label: '上海市'
            }, {
                value: '北京市',
                label: '北京市'
            }],
            dialog_select_classifySecond: '', // 弹出层-所属分类-二级分类
            dialog_classifySecondList: [{
                value: '长宁区',
                label: '长宁区'
            }, {
                value: '徐汇区',
                label: '徐汇区'
            }],
            dialog_select_brand: '', // 弹出层-默认选择品牌
            dialog_brandList: [ {
                value: '考拉时光1',
                label: '考拉时光1'
            }, {
                value: '考拉时光2',
                label: '考拉时光2'
            }],
            remarkTxt: '', // 弹出层-分类描述
        }
    },
mounted() {
    
    this.pageQuery();
  },
    methods: {
        handleClick(row) {
         
             console.log(row);
      this.curproduct = utils.deepCopy(row);
      this.dialogAddVisible = true;
        },
        /**
     * 分页查询
     */
    pageQuery: function() {
      this.showData = true;
      const self = this;
      projectApi.pageQuery(this.params, function(data) {
        self.params.totalSize = data.totalSize;
        
        self.params.page = data.page;
        console.info("8888===");
        if(data.list !=null){
            for(var i=0;i<data.list.length;i++){
                 
                  data.list[i].gmtCreated = moment(data.list[i].gmtCreated).format("YYYY-MM-DD HH:mm" );

            }
        }
        self.itemData = data.list;
        self.showData = false;
      });
    },

    /**
     * 分页页码change
     */
    handleCurrentChange(currentPage) {
      this.params.page = currentPage;
      this.pageQuery();
    },
    /**
     * 搜索
     */
    clickSearch() {
      console.info(123);
      this.pageQuery();
    },
    /**
     * 保存添加修改项目分类
     */
    save: function() {
      const self = this;
 if (self.curproduct.id) {
        projectApi.updatepro(self.curproduct, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.curproduct = self.defaultproduct();
        });
 }else{
     projectApi.insert(self.curproduct, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.curproduct = self.defaultproduct();
        });
 }
       
    },
     defaultproduct: function() {
      return {
        page: 1,
        pageSize: 10,
        totalSize: 0,
        search: ""
      };
    },
        /*
         * 改变状态
         */
        /**
     * 改变角色状态
     */
    changeStatus (id, status) {
        let self = this
        
        this.openEnable.id=id;
        dialog.confirm(() => {
            if (status == 'Y') {
                 
                this.openEnable.isEnable='N';
                
               projectApi.openEnable(this.openEnable, function(data) {
                     
                    self.pageQuery();
                })
            } else {
                 
                this.openEnable.isEnable='Y';
               projectApi.openEnable(this.openEnable, function(data) {
                    
                   self.pageQuery();
                })
                 
            }
        })
    },
        /**
         * 弹出层-权限类型选择
         */
        handleCheckedclassifysChange (val) {
            console.info(val)
        }
    }
}
</script>

<style lang="less" scoped>
    .xiangmufenlei{
        .xiangmufenlei-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }
        >div:nth-of-type(2){
            margin-top: 20px;
            display: flex;
            >div{
                display: flex;
                align-items: center;
                margin-right: 40px;
                span{
                    display: inline-block;
                    width: 80px;
                    text-align: right;
                    margin-right: 10px;
                }
            }
        }
    }
</style>