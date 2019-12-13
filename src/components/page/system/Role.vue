<template>
    <div class="juese">
        <div class="juese-title">
             <div class="fr"><el-button type="danger" @click="dialogAddVisible=true">添加角色</el-button></div>
            <h3>角色管理</h3>
        </div>
        <div>
            <div>
                <span>部门</span>
                <el-select class="flex-8" v-model="params.deptId" @change="deptIdChange()">
                    <el-option
                    v-for="item in searchDeptList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>角色名称</span>
                <el-input placeholder="请输入角色名称" v-model="params.search" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="clickSearch"></el-button>
                </el-input>
            </div>
        </div>

        <!-- 表格数据 -->
        <div class="tableData">
            <el-table
                :data="items"
                element-loading-text="拼命加载中"
                v-loading="showData"
                style="width: 100%">
                <el-table-column
                    label="角色名称">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="部门名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.deptName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="角色编号">
                    <template slot-scope="scope">
                        <span>{{ scope.row.roleNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.gmtCreated}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status == 1 ? '已启用' : '关闭'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>
                        <el-button @click="setRolePower(scope.row.id)" type="text" size="small">设置权限</el-button>    
                        <el-button @click="changeStatus(scope.row.id, scope.row.status)" type="text" size="small">{{scope.row.status == 1 ? '关闭' : '启用'}}</el-button>
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

        <!-- 弹出框-角色信息 -->
        <el-dialog title="角色信息" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <div>
                <div>
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">所属部门</span>
                    <el-select style="width:150px" v-model="curRole.deptId" placeholder="选择部门" class="handle-select mr10">
                        <el-option
                        v-for="item in deptList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">角色名称</span>
                    <el-input style="width: 30%" v-model="curRole.name" placeholder="请输入角色名称"></el-input>
                </div>
                <div class="mt10">
                    <span style="width: 12%; display: inline-block; text-align: right" class="mr10">角色编号</span>
                    <el-input style="width: 30%" v-model="curRole.roleNo" placeholder="请输入角色编号"></el-input>
                </div>
                <!-- 描述 -->
                <div class="mt10" style="display: flex">
                    <span style="width: 14%; display: inline-block; text-align: right" class="mr10">角色描述</span>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="如需描述，请输入"
                        v-model="curRole.remark">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="warning" @click="save">保存</el-button>
            </span>
        </el-dialog>

        <!-- 弹出框-角色权限 -->
        <el-dialog title="角色权限" :visible.sync="dialogRoleVisible" :close-on-click-modal="false">
            <div>
                <!-- 菜单状态 -->
                <el-menu
                    :default-active="menuStatusIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#ccc"
                    text-color="#fff"
                    active-text-color="#f63">
                    <el-menu-item index="1">菜单权限</el-menu-item>
                    <!-- <el-menu-item index="2">数据权限</el-menu-item> -->
                    <el-menu-item index="2">操作权限</el-menu-item>
                </el-menu>
                <!-- 菜单状态-tab1 -->
                <div v-show="menuStatusIndex==='1'">
                    <el-transfer
                    v-model="hasMenuList"
                    :data="menuList"
                    :titles="['未有权限', '已有权限']"
                    :button-texts="['到左边', '到右边']"
                    @change="setRoleMenu"
                    ></el-transfer>
                    <!-- <div style="overflow:hidden; padding:20px 20px 0 0">
                        <el-button class="fr" type="warning">确定选择</el-button>
                    </div> -->
                </div>
                
                <!-- 菜单状态-tab3 -->
                <div v-show="menuStatusIndex==='2'">
                    <el-transfer
                    v-model="hasPrivilegeList"
                    :data="privilegeList"
                    :titles="['已有权限', '未有权限']"
                    :button-texts="['到左边', '到右边']"
                    @change="setRolePrivilege"
                    ></el-transfer>
                    <!-- <div style="overflow:hidden; padding:20px 20px 0 0">
                        <el-button class="fr" type="warning">确定选择</el-button>
                    </div> -->
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import dialog from "@/common/dialog";
import show from "@/common/show";
import roleApi from "@/api/role";
import dept from "@/api/dept";
import utils from '@/common/utils'

export default {
  data() {
    const generateData1 = _ => {
      // 穿梭框数据
      const data1 = [];
      for (let i = 1; i <= 5; i++) {
        data1.push({
          key: i,
          label: `备选项 ${i}`
        });
      }
      return data1;
    };
    
    const generateData2 = _ => {
      // 穿梭框数据
      const data2 = [];
      for (let i = 1; i <= 15; i++) {
        data2.push({
          key: i,
          label: `备选项 ${i}`
        });
      }
      return data2;
    };
    return {
      //查询参数
      params: {
        page: 1,
        pageSize: 10,
        totalSize: 10,
        deptId: null,
        search: ""
      },

      //部门信息
      deptList: [],

      searchDeptList: [],

      curRole: {
        name: "",
        deptId: null,
        roleNo: "",
        remark: ""
      },

      showData: true,
      items: [],

      dialogAddVisible: false, // 弹出层-添加角色

      dialogRoleVisible: false, // 弹出层-角色权限

      menuStatusIndex: "1", // 弹出层-角色权限-菜单状态-默认下标
      roleId: 0, // 设置角色权限默认下标
      menuList: [], // 弹出层-穿梭框数据-tab1
      hasMenuList: [], // 弹出层-穿梭框数据-默认右边数据-tab1
      data2: generateData2(), // 弹出层-穿梭框数据-tab2
      value2: [1, 4], // 弹出层-穿梭框数据-默认右边数据-tab2
      privilegeList: [],
      hasPrivilegeList:[]
    };
  },

  mounted() {
    this.queryDept();
    this.pageQuery();
  },

  methods: {
    queryDept: function() {
      const self = this;
      dept.queryByEmp(function(list) {
        self.searchDeptList.push({
          value: null,
          label: "全部"
        });

        for (const dept of list) {
          self.deptList.push({
            value: dept.id,
            label: dept.name
          });

          self.searchDeptList.push({
            value: dept.id,
            label: dept.name
          });
        }
      });
    },

    /**
     * 改变部门
     */
    deptIdChange() {
      // console.info(this.params.deptId)
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
     * 分页查询
     */
    pageQuery: function() {
      this.showData = true;
      const self = this;
      roleApi.pageQuery(this.params, function(data) {
        self.params.totalSize = data.totalSize;
        self.params.page = data.page;
        self.items = data.list;
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
     * 保存添加角色
     */
    save: function() {
      const self = this;

      if (self.curRole.id) {
        roleApi.update(self.curRole, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.curRole = self.defaultRole();
        });
      } else {
        roleApi.insert(self.curRole, function(data) {
          self.dialogAddVisible = false;
          self.pageQuery();
          self.curRole = self.defaultRole();
        });
      }
    },

    defaultRole: function() {
      return {
        page: 1,
        pageSize: 10,
        totalSize: 0,
        deptId: null,
        search: ""
      };
    },

    handleClick(row) {
      console.log(row);
      this.curRole = utils.deepCopy(row);
      this.dialogAddVisible = true;
    },

    /**
     * 改变角色状态
     */
    changeStatus (id, status) {
        let self = this
        console.info(status)
        dialog.confirm(() => {
            if (status == 2) {
                roleApi.openStatus(id, function(data) {
                    self.dialogVipVisible = false;

                    show.success("操作成功");
                    self.pageQuery();
                })
            } else {
                roleApi.closeStatus(id, function(data) {
                    self.dialogVipVisible = false;

                    show.success("操作成功");
                    self.pageQuery();
                })
            }
        })
    },

    setRolePower(id) {
        this.dialogRoleVisible = true
        this.fetchRoleMenu(id)
        this.fetchRolePrivilege(id)
    },

    /**
     * 
     * 查询菜单权限
     */
    fetchRoleMenu (id) {
        var self = this
        this.roleId = id
        roleApi.getRoleMenu(self.roleId, (data) => {
            const list = []
            data.menuList.forEach(item => {
                list.push({
                    key: item.id,
                    label: item.name
                })
            })
            self.menuList = list
            const ids = []
            data.hasMenuList.forEach(item => ids.push(item.id))
            self.hasMenuList = ids
        })
    },

    fetchRolePrivilege(id) {
        let self = this
        self.hasPrivilegeList = []
        self.privilegeList = []
        roleApi.getRolePrivilege(id, (data) => {
            let list = []
            data.privilegeList.forEach(item => {
                list.push({
                    key: item.id,
                    label: item.name
                })
            })
            self.privilegeList = list
            let ids = []
            data.hasPrivilegeList.forEach(item => ids.push(item.id))
            self.hasPrivilegeList = ids
        })
    },

    /**
     * 菜单状态切换
     */
    handleSelect(key, keyPath) {
      this.menuStatusIndex = key;
      // console.log(key, keyPath)
      console.log(key);
    },

    /**
     * 设置角色菜单权限-穿梭框-tab1
     */
    setRoleMenu(value, direction, movedKeys) {
        console.info(this.roleId, value)
        console.log(value, direction, movedKeys);
        // this.emp = utils.deepCopy(row);
        roleApi.setRoleMenu(this.roleId, value, (data) => {
            show.success('操作成功')
        })
    },

    /**
     * 穿梭框-tab2
     */
    setRolePrivilege(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
      roleApi.setRolePrivilege(this.roleId, value, (data) => {
          show.success('操作成功')
      })
    }

  }
};
</script>

<style lang="less" scoped>
.juese {
  .juese-title {
    h3 {
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 18px;
    }
  }
  > div:nth-of-type(2) {
    margin-top: 20px;
    display: flex;
    > div {
      display: flex;
      align-items: center;
      margin-right: 40px;
      span {
        display: inline-block;
        width: 80px;
        text-align: right;
        margin-right: 10px;
      }
    }
  }
}
// 穿梭框
.el-transfer {
  padding-top: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
