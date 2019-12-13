<template>
    <div class="bumenguanli">
        <div class="bumenguanli-title">
             <div class="fr"><el-button type="danger" @click="showDialog">添加部门</el-button></div>
            <h3>部门管理</h3>
        </div>
        <div class="mt20">
            <span class="mr10">部门名称</span>
            <el-input style="width:20%" placeholder="请输入部门名称/关键字" v-model="search" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="items"
                style="width: 100%">
                <el-table-column
                    label="部门名称"
                    width="180">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.gmtCreated}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="部门状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.isOnline ? '已启用' : '关闭'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>
                        <el-button @click="changeStatus(scope.row, scope.$index)" type="text" size="small">关闭/启用</el-button>
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

        <!-- 弹出框-部门部门 -->
        <el-dialog title="权限信息" :visible.sync="visible" :close-on-click-modal="false">
            <div>
                <div>
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">部门名称</span>
                    <el-input style="width: 30%" v-model="dept.name" placeholder="请输入部门名称"></el-input>
                </div>
                <!--<div class="mt10">-->
                    <!--<span style="width: 12%; display: inline-block; text-align: right" class="mr10">所属商户</span>-->
                    <!--<el-select class="flex-8" v-model="dept.mchId">-->
                        <!--<el-option-->
                        <!--v-for="item in mchList"-->
                        <!--:key="item.value"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</div>-->
                <!-- 部门状态 -->
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">部门状态</span>
                    <el-select class="flex-8" v-model="dept.status">
                        <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="warning" @click="addDept()">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

  import dept from '@/api/dept';

  export default {
    data() {
      return {

        //分页查询参数
        params: {
          page: 1,
          pageSize: 10,
          totalPage: 0,
          totalSize: 0
        },

        //部门
        dept: {
          name: '',
          mchId: null,
          status: null
        },

        //商户列表
        mchList: [
          {
            value: 1,
            label: '考拉'
          }
        ],

        //状态
        statusList: [
          {
            value: 1,
            label: '正常'
          },
          {
            value: 2,
            label: '关闭'
          }
        ],

        //列表
        items: [],

        visible: false,

        search: ''
      }
    },

    mounted() {

      this.pageQuery();
      this.queryMchList();
    },

    methods: {


      queryMchList() {


      },


      showDialog: function() {
        this.resetEmpty();
        this.visible = true;
      },

      pageQuery() {

        const self = this;
        dept.pageQuery(this.params, function (data) {
          self.params.totalPage = data.totalPage;
          self.params.totalSize = data.totalSize;
          self.params.page = data.page;
          self.params.pageSize = data.pageSize;
          self.items = data.list;
        });

      },

      handleCurrentChange(currentPage) {
        this.params.page = currentPage;
        this.pageQuery();
      },

      addDept: function() {

        const self = this;
        if (this.dept.id) {
          dept.update(this.dept, function (res) {
            self.visible = false;
            self.pageQuery();
          });
        } else {
          dept.insert(this.dept, function (res) {
            self.visible = false;
            self.pageQuery();
          });
        }
      },


      updateDept: function() {

        const self = this;
        dept.update(this.dept, function (res) {

          self.visible = false;
        });
      },


      deleteDept: function() {

        const self = this;
        dept.delete(this.dept.id, function (res) {

          //show success dialog
        });
      },


      handleClick(row) {
        console.log(row);
        this.dept = JSON.parse(JSON.stringify(row));
        this.visible = true;
      },


      resetEmpty: function() {
        this.dept = {
          name: '',
          mchId: null,
          status: null
        };
      },

      /*
       * 改变状态
       */
      changeStatus(data, idx) {
        console.info(data, idx)
        this.$confirm('此操作将改变其状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          data.isOnline = !data.isOnline
          if (data.isOnline) {
            this.$message({
              message: '恭喜你，该规则已上线！',
              type: 'success'
            });
          } else {
            this.$message({
              message: '注意，该规则已下线！',
              type: 'warning'
            });
          }
        }).catch(() => {
        })
      },
      /**
       * 弹出层-权限类型选择
       */
      handleCheckeddepartmentsChange(val) {
        console.info(val)
      }
    }
  }
</script>

<style lang="less" scoped>
    .bumenguanli{
        .bumenguanli-title{
            h3{
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
            }
        }

    }
</style>
