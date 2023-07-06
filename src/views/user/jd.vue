<script setup lang="ts">
import {
  checkJdQrcode,
  deleteJdAccount,
  getJdBindList,
  getJdQrcode,
  JdQrcodeResult
} from "@/api/jd";
import { onMounted, ref, unref } from "vue";
import { ElMessageBox } from "element-plus";
import defaultJdAvatar from "@/assets/jingdong.jpg";
import { message } from "@/utils/message";
import ReQrcode from "@/components/ReQrcode";

defineOptions({
  name: "京东账号"
});

// 已绑定账号列表
const accountList = ref([]);
// 京东二维码参数
const jdQrcodeUrl = ref("");
const jdQrcodeCookie = ref("");
let checkId: ReturnType<typeof setTimeout>;

// 京东扫码摸态框
const jdLoginVisible = ref(false);
// 二维码是否过期
const jdQrcodeDisable = ref(false);
// 数据加载
const dataLoading = ref(true);

// 清空京东扫码的数据
const clearQrcodeData = (done: () => void) => {
  // 取消检查扫码结果任务
  clearTimeout(checkId);
  // 清理二维码链接
  jdQrcodeUrl.value = unref("");
  // 清理是否过期
  jdQrcodeDisable.value = unref(false);
  // 清理 cookie
  jdQrcodeCookie.value = unref("");
  done();
};

// 查询数据
const getJdBindListData = async () => {
  dataLoading.value = true;
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
    const result = await getJdQrcode();
    const { qrUrl, cookie, timeout } = result as JdQrcodeResult;
    jdQrcodeUrl.value = unref(qrUrl);
    jdQrcodeCookie.value = unref(cookie);
    jdQrcodeDisable.value = false;
    // 开始检查扫码结果
    await checkJdQrcodeScan();
    setTimeout(() => {
      clearTimeout(checkId);
      jdQrcodeDisable.value = true;
    }, (timeout - 2) * 1000); // 提前2秒钟结束
  } catch (e) {
    message("获取授权二维码失败", { type: "error" });
    // 关闭弹窗
    jdLoginVisible.value = false;
  }
};

// 检查扫码结果
const scanMessage = ref("");
const checkJdQrcodeScan = async () => {
  const result = await checkJdQrcode(unref(jdQrcodeCookie));
  if (result && result !== "") {
    scanMessage.value = unref(result);
    if (result !== "绑定成功") {
      checkId = setTimeout(() => checkJdQrcodeScan(), 500);
    } else {
      // 绑定成功了
      message(result, { type: "success" });
    }
  } else {
    checkId = setTimeout(() => checkJdQrcodeScan(), 500);
  }
};

// 删除账号
const deleteAccountHandle = account => {
  ElMessageBox.confirm(account ? `确认删除[${account.pin}]吗？` : "", "提示", {
    type: "warning"
  })
    .then(async () => {
      await deleteJdAccount(account.id);
      message("删除成功", { type: "success" });
      // 刷新一下列表
      getJdBindListData();
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
      <el-button @click="getJdQrcodeData" type="primary">
        绑定新账号
      </el-button>
    </div>

    <div v-loading="dataLoading">
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
            style="margin-bottom: 20px"
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
                  <div style="margin-left: 25%; display: inline-grid">
                    <el-text truncated>昵称: {{ account.remark }}</el-text>
                    <el-button-group style="margin-top: 5px; margin-left: -3px">
                      <el-button
                        link
                        type="warning"
                        :disabled="account.expired"
                        @click="getJdQrcodeData"
                      >
                        刷新
                      </el-button>
                      <el-button
                        link
                        type="danger"
                        @click="deleteAccountHandle(account)"
                      >
                        删除
                      </el-button>
                    </el-button-group>
                  </div>
                </div>
              </template>
              <el-descriptions :column="1" style="padding: 10px" size="small">
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

    <el-dialog
      v-model="jdLoginVisible"
      title="请使用京东APP扫码"
      width="30%"
      center
      align-center
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="clearQrcodeData"
    >
      <div style="text-align: center">
        <ReQrcode
          :text="jdQrcodeUrl"
          :disabled="jdQrcodeDisable"
          @disabled-click="getJdQrcodeData"
        />
        <div>
          <el-text v-if="jdQrcodeDisable" type="danger">
            二维码已过期，请重新获取
          </el-text>
          <el-text v-else type="warning">
            {{ scanMessage }}
          </el-text>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.image {
  display: block;
  width: 100%;
}
</style>
