<script setup lang="ts">
import { getJdBindList } from "@/api/jd";
import { onMounted, ref } from "vue";

defineOptions({
  name: "京东账号"
});

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

// 已绑定账号列表
const accountList = ref([]);

// 加载
const formDialogVisible = ref(false);
const dataLoading = ref(true);

// 查询数据
const getJdBindListData = async () => {
  try {
    accountList.value = await getJdBindList();
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};

// 删除账号
// const handleDeleteItem = account => {
//   ElMessageBox.confirm(account ? `确认删除[${account.pin}]吗？` : "", "提示", {
//     type: "warning"
//   })
//     .then(() => {
//       message("删除成功", { type: "success" });
//     })
//     .catch(() => {});
// };
// 修改账号
// const handleManageProduct = product => {
//   formDialogVisible.value = true;
//   nextTick(() => {
//     formData.value = { ...product, status: product?.isSetup ? "1" : "0" };
//   });
// };
// 默认头像
const defaultAvatar =
  "https://img10.360buyimg.com/img/jfs/t1/192028/25/33459/5661/63fc2af2F1f6ae1b6/d0e4fdc2f126cbf5.png";

// 页面加载，拉取已绑定数据列表
onMounted(() => {
  getJdBindListData();
});
</script>

<template>
  <div class="main">
    <div class="w-full flex justify-between mb-4">
      <el-button @click="formDialogVisible = true"> 绑定新账号 </el-button>
    </div>

    <div
      v-loading="dataLoading"
      :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <el-empty description="暂无数据" v-show="accountList.length === 0" />
      <template v-if="accountList.length > 0">
        <el-row :gutter="16">
          <el-col
            v-for="account in accountList"
            :key="account.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <el-card :body-style="{ padding: '0px' }">
              <img
                :src="account.avatar ? account.avatar : defaultAvatar"
                class="image"
                :alt="account.username"
              />
              <div style="padding: 14px">
                <span>{{ account.pin }}</span>
                <div class="bottom">
                  <time class="time">{{ account.remark }}</time>
                  <el-button text class="button">操作</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </div>
  </div>
</template>

<style>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 13px;
  line-height: 12px;
}

.button {
  min-height: auto;
  padding: 0;
}

.image {
  display: block;
  width: 100%;
}
</style>
