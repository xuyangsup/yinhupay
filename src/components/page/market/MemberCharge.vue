<template>
  <div class="yingxiao">
    <div class="yingxiao-title">
      <div class="fr">
        <el-button @click="openChargeDialog()" type="danger">添加充值套餐</el-button>
      </div>
      <h3>充值套餐</h3>
    </div>
    <div>
      <el-table :data="memberPackages" style="width: 100%">
        <el-table-column label="套餐名称" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.packageName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="充值金额">
          <template slot-scope="scope">
            <span>{{ scope.row.chargeAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="赠送金额">
          <template slot-scope="scope">
            <span>{{ scope.row.donationAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status == 1 ? '启用' : '不启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleClickEdit(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="handleClickDelete(scope.row)" type="text" size="small">删除</el-button>
            <el-button
              @click="handleStatus(scope.row)"
              type="text"
              size="small"
            >{{ scope.row.status == 1 ? '不启用' : '启用' }}</el-button>
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
        :page-size="queryParams.pageSize"
        :total="queryParams.totalSize"
      ></el-pagination>
    </div>
    <!-- 弹出框-添加活动 -->
    <el-dialog title="添加套餐" :visible.sync="dialogActivityVisible">
      <!-- 添加活动 -->
      <div class="basic_info">
        <el-menu
          :default-active="orderStatusIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#ccc"
          text-color="#fff"
          active-text-color="#f63"
        >
          <el-menu-item index="0">基本信息</el-menu-item>
        </el-menu>
        <div v-show="orderStatusIndex === '0'">
          <div class="mt10">
            <span style="width: 12%; display: inline-block; text-align: right" class="mr10">套餐名称</span>
            <el-input style="width: 50%" v-model="packageData.packageName"></el-input>
          </div>
          <div class="mt10">
            <span style="width: 12%; display: inline-block; text-align: right" class="mr10">充值金额</span>
            <el-input style="width: 50%" v-model="packageData.chargeAmount"></el-input>
          </div>
          <div class="mt10">
            <span style="width: 12%; display: inline-block; text-align: right" class="mr10">赠送金额</span>
            <el-input style="width: 50%" v-model="packageData.donationAmount"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogActivityVisible = false">取 消</el-button>
        <el-button type="warning" @click="addPackage()">确定</el-button>
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
import chuzhiApi from "@/api/chuzhi";
export default {
  data() {
    return {
      memberPackages: [],
      orderStatusIndex: "0",
      dialogActivityVisible: false,
      action: "add",
      queryParams: {
        page: 1,
        pageSize: 10,
        totalSize: 0
      },
      packageData: {
        packageName: "",
        chargeAmount: null,
        donationAmount: null,
        status: 1
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.queryParams.page = currentPage;
      this.queryPackages();
    },
    handleSelect() {},
    addPackage() {
      let self = this;
      if (this.action === "add") {
        dialog.confirm(() => {
          chuzhiApi.addPackage(self.packageData, data => {
            self.dialogActivityVisible = false;
            self.queryPackages();
          });
        });
      } else {
        dialog.confirm(() => {
          chuzhiApi.updatePackage(self.packageData, data => {
            self.dialogActivityVisible = false;
            self.queryPackages();
          });
        });
      }
    },
    handleStatus(row) {
      var status = row.status;
      var params = {
        id: row.id
      };
      if (status == 1) {
        params.status = 2;
      }
      if (status == 2) {
        params.status = 1;
      }
      const self = this;
      dialog.confirm(() => {
        chuzhiApi.updatePackage(params, data => {
          self.queryPackages();
        });
      });
    },
    openChargeDialog() {
      this.action = "add";
      this.dialogActivityVisible = true;
    },
    handleClickEdit(row) {
      var _this = this;
      this.action = "update";
      this.packageData = row;
      this.dialogActivityVisible = true;
    },
    handleClickDelete(row) {
      var _this = this;
      dialog.confirm(() => {
        var params = {
          id: row.id
        };
        chuzhiApi.deletePackage(params, data => {
          show.success("删除成功");
          _this.queryPackages();
        });
      });
    },
    init() {
      let self = this;
      chuzhiApi.queryPackages(this.queryParams, data => {
        self.queryParams.totalSize = data.totalSize;
        self.memberPackages = data.list;
      });
    },
    queryPackages() {
      let self = this;
      chuzhiApi.queryPackages(this.queryParams, data => {
        self.queryParams.totalSize = data.totalSize;
        self.memberPackages = data.list;
      });
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