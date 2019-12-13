<template>
  <div class="yuangong">
    <div class="yuangong-title">
      <div class="fr">
        <el-button type="danger" @click="dialogAddVisible=true">添加员工</el-button>
      </div>
      <h3>员工管理</h3>
    </div>
    <div>
      <div>
        <span>所属部门</span>
        <el-select class="flex-8" v-model="params.deptId">
          <el-option
            v-for="item in searchDeptList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <span>员工名称</span>
        <el-input placeholder="请输入员工名称" v-model="params.search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 表格数据 -->
    <div class="tableData">
      <el-table v-loading="dataLoading" :data="items" style="width: 100%">
        <el-table-column label="员工名称(工号)" width="120">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.name}}({{ scope.row.empNo }})</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职位" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.jobName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在职状态" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.status == 1 ? '在职' : '离职'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="入职时间/离职时间">
          <template slot-scope="scope">
            <span>{{scope.row.entryTime}} / {{scope.row.leaveTime}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.isOnline ? '已启用' : '关闭'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small" class="mr10">修改</el-button>
            <el-button @click="deleteEmp(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="setEmpShop(scope.row)" type="text" size="small" class="mr10">设置权限</el-button>
            <el-button
              v-if="scope.row.status == 1"
              @click="handleClickDimission(scope.row)"
              type="text"
              size="small"
            >办理离职</el-button>
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
        :total="params.totalSize"
      ></el-pagination>
    </div>

    <!-- 弹出框-员工信息 -->
    <el-dialog title="员工信息" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
      <div>
        <div class="flex-layout">
          <div>
            <span style="width: 24%; display: inline-block; text-align: right" class="mr10">员工名称</span>
            <el-input style="width: 66%" v-model="emp.name" placeholder="请输入员工名称"></el-input>
          </div>
          <div>
            <span style="width: 24%; display: inline-block; text-align: right" class="mr10">员工编号</span>
            <el-input style="width: 66%" v-model="emp.empNo" placeholder="请输入员工编号"></el-input>
          </div>
        </div>
        <div class="flex-layout mt10">
          <div>
            <span style="width: 25%; display: inline-block; text-align: right" class="mr10">所属部门</span>
            <el-select style="width: 62%" v-model="emp.deptId" placeholder="请选择所属部门信息">
              <el-option
                v-for="item in deptList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span style="width: 25%; display: inline-block; text-align: right" class="mr10">员工职位</span>
            <el-select style="width: 62%" v-model="emp.jobId" placeholder="请选择员工职位">
              <el-option
                v-for="item in jobList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="flex-layout mt10">
          <div>
            <span style="width: 26%; display: inline-block; text-align: right" class="mr10">联系方式</span>
            <el-input style="width: 65%" v-model="emp.mobile" placeholder="请输入联系方式"></el-input>
          </div>
          <div>
            <span style="width: 29%; display: inline-block; text-align: right" class="mr10">出生日期</span>
            <el-date-picker
              style="width: 59%"
              v-model="emp.birthday"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择出生日期"
            ></el-date-picker>
          </div>
        </div>
        <div class="flex-layout mt10">
          <div style="display:flex">
            <span
              style="width: 24%; display: inline-block; text-align: right;margin-right:22px"
            >员工头像</span>
            <el-upload
              ref="activityUpload"
              class="avatar-uploader"
              action="/api/v1/image/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="emp.avatar" :src="IMAGE_URL + emp.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div>
            <div>
              <span style="width: 29%; display: inline-block; text-align: right" class="mr10">身份证</span>
              <el-input style="width: 60%" v-model="emp.idCard" placeholder="请输入紧急联系人"></el-input>
            </div>
            <div>
              <span style="width: 29%; display: inline-block; text-align: right" class="mr10">紧急联系人</span>
              <el-input style="width: 60%" v-model="emp.contact" placeholder="请输入身份证"></el-input>
            </div>
            <div class="mt10">
              <span style="width: 29%; display: inline-block; text-align: right" class="mr10">联系人电话</span>
              <el-input style="width: 60%" v-model="emp.contactMobile" placeholder="请输入联系人电话"></el-input>
            </div>
            <div class="mt10">
              <span style="width: 30%; display: inline-block; text-align: right" class="mr10">与联系人关系</span>
              <el-input style="width: 60%" v-model="emp.contactLink" placeholder="请输入与联系人关系"></el-input>
            </div>
          </div>
        </div>
        <div class="flex-layout mt10">
          <div>
            <span style="width: 26%; display: inline-block; text-align: right" class="mr10">在职状态</span>
            <el-select style="width: 62%" v-model="emp.status" placeholder="请选择在职状态">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span style="width: 29%; display: inline-block; text-align: right" class="mr10">入职时间</span>
            <el-date-picker
              style="width: 59%"
              v-model="emp.entryTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择入职时间"
            ></el-date-picker>
          </div>
        </div>
        <div class="mt10">
          <span style="width: 14%; display: inline-block; text-align: right" class="mr10">籍贯地址</span>
          <el-input style="width: 76%" v-model="emp.nativeAddress" placeholder="请输入籍贯地址"></el-input>
        </div>
        <div class="mt10">
          <span style="width: 14%; display: inline-block; text-align: right" class="mr10">现在住址</span>
          <el-input style="width: 76%" v-model="emp.address" placeholder="请输入现在住址"></el-input>
        </div>
        <div class="mt10" style="display:flex">
          <span style="width: 14%; display: inline-block; text-align: right" class="mr10">员工简介</span>
          <el-input
            style="width: 77%"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            placeholder="请输入员工简介"
            v-model="emp.remark"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="warning" @click="save()">保存</el-button>
      </span>
    </el-dialog>

    <!-- 弹出框-办理员工离职 -->
    <el-dialog title="办理员工离职" :visible.sync="dialogDimissionVisible" :close-on-click-modal="false">
      <div>
        <div class="flex-layout">
          <div>
            <span style="width: 26%; display: inline-block; text-align: right" class="mr10">员工名称</span>
            <el-input style="width: 66%" v-model="emp.name" disabled></el-input>
          </div>
          <div>
            <span style="width: 24%; display: inline-block; text-align: right" class="mr10">员工编号</span>
            <el-input style="width: 66%" v-model="emp.empNo" disabled></el-input>
          </div>
        </div>
        <div class="flex-layout mt10">
          <div>
            <span style="width: 29%; display: inline-block; text-align: right" class="mr10">员工职位</span>
            <el-input style="width: 65%" v-model="emp.jobName" disabled></el-input>
          </div>
          <div>
            <span style="width: 29%; display: inline-block; text-align: right" class="mr10">出生日期</span>
            <el-date-picker
              style="width: 60%"
              disabled
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="emp.birthday"
              type="date"
              placeholder="选择离职日期"
            ></el-date-picker>
          </div>
        </div>
        <div class="flex-layout mt10">
          <div>
            <span style="width: 26%; display: inline-block; text-align: right" class="mr10">联系方式</span>
            <el-input style="width: 66%" v-model="emp.mobile" disabled></el-input>
          </div>
          <div>
            <span style="width: 24%; display: inline-block; text-align: right" class="mr10">在职状态</span>
            <el-input style="width: 66%" v-model="emp.status == 1 ? '在职' : '离职'" disabled></el-input>
          </div>
        </div>

        <div class="flex-layout mt10">
          <div>
            <span style="width: 28%; display: inline-block; text-align: right" class="mr10">紧急联系人</span>
            <el-input style="width: 61%" v-model="emp.contact" disabled></el-input>
          </div>
          <div>
            <span style="width: 27%; display: inline-block; text-align: right" class="mr10">联系人电话</span>
            <el-input style="width: 61%" v-model="emp.contactMobile" disabled></el-input>
          </div>
        </div>
        <div class="flex-layout mt10">
          <div>
            <span style="width: 30%; display: inline-block; text-align: right" class="mr10">与联系人关系</span>
            <el-input style="width: 57%" v-model="emp.contactLink" disabled></el-input>
          </div>
          <div>
            <span style="width: 29%; display: inline-block; text-align: right" class="mr10">离职时间</span>
            <el-date-picker
              style="width: 57%"
              v-model="emp.leaveTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择离职日期"
            ></el-date-picker>
          </div>
        </div>
        <div class="mt10" style="display:flex">
          <span style="width: 17%; display: inline-block; text-align: right" class="mr10">在职评价</span>
          <el-input
            style="width: 73%"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            placeholder="请输入员工在职评价"
            v-model="emp.jobJudge"
          ></el-input>
        </div>
        <div class="mt10" style="display:flex">
          <span style="width: 17%; display: inline-block; text-align: right" class="mr10">离职原因</span>
          <el-input
            style="width: 73%"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            placeholder="请输入员工离职原因"
            v-model="emp.leaveReason"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDimissionVisible = false">取 消</el-button>
        <el-button type="warning" @click="leave()">保存</el-button>
      </span>
    </el-dialog>

    <!-- 弹出框-角色权限 -->
    <el-dialog title="门店权限" :visible.sync="dialogRoleVisible" :close-on-click-modal="false">
      <div>
        <!-- 菜单状态 -->
        <el-menu
          :default-active="menuStatusIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#ccc"
          text-color="#fff"
          active-text-color="#f63"
        >
          <el-menu-item index="1">门店权限</el-menu-item>
          <el-menu-item index="2">角色权限</el-menu-item>
        </el-menu>

        <!-- 菜单状态-tab2 -->
        <div v-show="menuStatusIndex==='1'" style="padding-top:30px">
          <span class="mr10">品牌</span>
          <el-select class="flex-6" v-model="roleSelectBrandId">
            <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-transfer
            style="margin-top: 10px"
            v-model="hasShopList"
            :data="allShopList"
            :titles="['未有门店', '已有门店']"
            :button-texts="['到左边', '到右边']"
            @change="chooseEmpShop"
          ></el-transfer>
        </div>

        <!-- 菜单状态-tab3 -->
        <div v-show="menuStatusIndex==='2'">
          <el-transfer
            v-model="hasRoleList"
            :data="allRoleList"
            :titles="['未有权限', '已有权限']"
            :button-texts="['到左边', '到右边']"
            @change="chooseEmpRole"
          ></el-transfer>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import empApi from "@/api/emp";
import dept from "@/api/dept";
import jobApi from "@/api/job";
import { OSS_URL } from "@/api/constant";
import utils from "@/common/utils";
import brandApi from "@/api/brand";
import shopApi from "@/api/shop";
import show from "@/common/show";
import dialog from "@/common/dialog";
import { MessageBox } from 'element-ui';
export default {
  data() {
    return {
      IMAGE_URL: OSS_URL,
      brandList: [],
      select_department: "全部", // 默认选择部门
      deptList: [],
      searchDeptList: [], //职位列表
      jobList: [],
      params: {
        page: 1,
        pageSize: 10,
        totalSize: 9,
        deptId: null,
        search: ""
      },
      emp: {
        name: "",
        idCard: "",
        deptId: null,
        mobile: "",
        avatar: "",
        empNo: "",
        jobId: "",
        birthday: "",
        contact: "",
        contactMobile: "",
        contactLink: "",
        entryTime: "",
        leaveTime: "",
        status: null,
        nativeAddress: "",
        address: "",
        remark: "",
        jobJudge: "",
        leaveReason: ""
      }, //列表
      items: [],
      dialogAddVisible: false, // 弹出层-添加员工
      dialogDimissionVisible: false, // 弹出层-办理员工离职
      statusList: [
        {
          value: 1,
          label: "在职"
        },
        {
          value: 2,
          label: "离职"
        }
      ],
      dataLoading: true,
      dialogRoleVisible: false,
      roleSelectBrandId: null,

      allShopList: [],
      hasShopList: [],
      menuStatusIndex: "1",

      allRoleList: [],
      hasRoleList: []
    };
  },
  watch: {
    roleSelectBrandId(newVal, oldVal) {
      this.fetchEmpSetShops();
    }
  },
  mounted() {
    this.queryDept();
    this.queryJob();
    this.pageQuery();
  },
  methods: {
    queryDept() {
      const self = this;
      dept.queryByEmp(function(list) {
        self.searchDeptList.push({
          value: 0,
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
    fetchEmpSetShops() {
      const self = this;
      self.allShopList = [];
      self.hasShopList = [];

      if (self.emp) {
        empApi.getSetEmpShops(self.emp.id, self.roleSelectBrandId, data => {
          const list = [];
          data.shopLists.forEach(item => {
            list.push({
              key: item.id,
              label: item.name
            });
          });
          self.allShopList = list;
          self.hasShopList = data.hasShopLists;
        });
      }
    },
    getDefaulEmp() {
      return {
        name: "",
        idCard: "",
        deptId: 0,
        mobile: "",
        avatar: "",
        empNo: "",
        jobId: "",
        birthday: "",
        contact: "",
        contactMobile: "",
        contactLink: "",
        entryTime: "",
        status: 0,
        nativeAddress: "",
        address: "",
        remark: "",
        jobJudge: "",
        leaveReason: ""
      };
    },
    queryJob() {
      const self = this;
      jobApi.queryByEmp(function(data) {
        for (const job of data) {
          self.jobList.push({
            value: job.id,
            label: job.name
          });
        }
      });
    },
    pageQuery() {
      const self = this;
      self.dataLoading = true;
      empApi.pageQuery(this.params, function(data) {
        self.params.totalPage = data.totalPage;
        self.params.totalSize = data.totalSize;
        self.params.page = data.page;
        self.params.pageSize = data.pageSize;
        self.items = data.list;
        self.dataLoading = false;
      });
    },
    search() {
      const self = this;
      self.params.page = 1;
      self.pageQuery();
    },
    handleCurrentChange(currentPage) {
      this.params.page = currentPage;
      this.pageQuery();
    }, //添加员工
    save() {
      console.log(this.emp);
      const self = this;
      //更新
      if (this.emp.id == undefined || this.emp.id == "") {
        empApi.addEmp(this.emp, function(data) {
          self.dialogAddVisible = false;
          self.emp = self.getDefaulEmp();
          self.pageQuery();
        });
      } else {
        empApi.updateEmp(this.emp, function(data) {
          self.dialogAddVisible = false;
          self.emp = self.getDefaulEmp();
          self.pageQuery();
        });
      }
    },
    leave() {
      const self = this;

      if (thisemp.jobJudge == null) {
        show.error("员工在职评价不能为空");
        return false;
      }
      if (thisemp.leaveReason == null) {
        show.error("离职原因不能为空");
        return false;
      }
      empApi.leaveEmp(this.emp, function(data) {
        self.pageQuery();
        self.dialogDimissionVisible = false;
      });
    }, //修改员工信息
    handleClick(row) {
      console.log(row);
      this.dialogAddVisible = true;
      this.emp = utils.deepCopy(row);
    },
    deleteEmp(row) {
      var _this = this;
      MessageBox.confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          empApi.deleteEmp(row.id, () => {
              show.success('删除成功');
              _this.pageQuery();
          })
      }).catch(() => {

      });
    },
    setEmpShop(row) {
      this.emp = utils.deepCopy(row);
      this.dialogRoleVisible = true;
      const self = this;
      brandApi.queryByEmp(data => {
        self.brandList = data;

        if (data && data.length > 0) {
          self.roleSelectBrandId = data[0].id;
        }
      });

      empApi.getSetEmpRoles(this.emp.id, data => {
        let roleList = [];
        data.roleList.forEach(item => {
          roleList.push({
            key: item.id,
            label: item.name
          });
        });
        self.allRoleList = roleList;

        let hasRoleIds = [];
        data.hasRoleList.forEach(item => {
          hasRoleIds.push(item.id);
        });
        self.hasRoleList = hasRoleIds;
      });
    },
    handleClickDimission(row) {
      console.log(row);
      this.emp = row;
      this.dialogDimissionVisible = true;
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      if (res.code == 0) {
        this.emp.avatar = res.data.filePath;
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
    },
    handleSelect(key, keyPath) {
      this.menuStatusIndex = key;
      console.log(key);
    },
    chooseEmpShop(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);

      empApi.setShops(this.emp.id, this.roleSelectBrandId, value, data => {
        show.success("操作成功");
      });
    },
    chooseEmpRole(value, direction, movedKeys) {
      empApi.setEmpRoles(this.emp.id, value, data => {
        show.success("操作成功");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.yuangong {
  .yuangong-title {
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
  .flex-layout {
    display: flex;
    justify-content: space-around;
  }
}
</style>
