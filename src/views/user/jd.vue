<script setup lang="ts">
import { getJdBindList, getJdQrcode } from "@/api/jd";
import { onMounted, ref } from "vue";
import { ElMessageBox } from "element-plus";
import defaultJdAvatar from "@/assets/jingdong.jpg";
import { message } from "@/utils/message";

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
// 京东二维码参数
const jdQrcodeInfo = ref({});

// 京东扫码摸态框
const jdLoginVisible = ref(false);
// 二维码是否过期
const jdQrcodeDisable = ref(false);
// 数据加载
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

// 获取京东授权二维码
const getJdQrcodeData = async () => {
  // 显示Dialog
  jdLoginVisible.value = true;
  try {
    jdQrcodeInfo.value = await getJdQrcode();
  } catch (e) {
    message("获取授权二维码失败", { type: "error" });
    // 关闭弹窗
    jdLoginVisible.value = false;
  }
};

// 删除账号
const deleteAccountHandle = account => {
  ElMessageBox.confirm(account ? `确认删除[${account.pin}]吗？` : "", "提示", {
    type: "warning"
  })
    .then(() => {
      message("删除成功", { type: "success" });
    })
    .catch(() => {});
};

// 页面加载，拉取已绑定数据列表
onMounted(() => {
  getJdBindListData();
});
</script>

<template>
  <div class="main">
    <div class="w-full flex justify-between mb-4">
      <el-button @click="getJdQrcodeData"> 绑定新账号 </el-button>
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
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
              <template #header>
                <div style="display: flex; align-items: center">
                  <el-badge
                    :value="account.isPlus ? 'PLUS' : ''"
                    class="item"
                    type="warning"
                  >
                    <el-avatar
                      :size="50"
                      :src="account.avatar ? account.avatar : defaultJdAvatar"
                    />
                  </el-badge>
                  <el-button-group style="margin-left: 30%">
                    <el-button
                      text
                      type="primary"
                      size="small"
                      :disabled="account.expired"
                      @click="getJdQrcodeData"
                      >刷新</el-button
                    >
                    <el-button
                      text
                      type="danger"
                      size="small"
                      @click="deleteAccountHandle(account)"
                      >删除</el-button
                    >
                  </el-button-group>
                </div>
              </template>
              <el-descriptions column="1" style="padding: 10px" size="small">
                <el-descriptions-item label="账号">
                  {{ account.pin }}
                </el-descriptions-item>
                <el-descriptions-item label="昵称">
                  {{ account.nickname }}
                </el-descriptions-item>
                <el-descriptions-item label="等级">
                  {{ account.level }}
                </el-descriptions-item>
                <el-descriptions-item label="最近更新">
                  {{ account.lastUpdate }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </div>

    <el-dialog v-model="jdLoginVisible" title="请使用京东APP扫码" width="30%">
      <ReQrcode :text="jdQrcodeInfo.qrUrl" :disabled="jdQrcodeDisable" />
    </el-dialog>
  </div>
</template>

<style>
.image {
  display: block;
  width: 100%;
}
</style>
