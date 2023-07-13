<script setup lang="ts">
import { onMounted, ref, unref } from "vue";
import wechatRobotQrcode from "@/assets/qrcode/wechat.jpg";
import qqRobotQrcode from "@/assets/qrcode/qq.jpg";
import { TabPaneName } from "element-plus";
import {
  bindingNotifyPre,
  checkBindingNotify,
  getBindingAccounts,
  pageNotifyLog
} from "@/api/notify";
import { message } from "@/utils/message";

defineOptions({
  name: "推送记录"
});

// 推送渠道绑定模态框
const bindingNotifyChannelVisible = ref(false);
// 预请求参数
const bindingParam = ref({
  type: "wechat" // 默认绑定微信
});
// 绑定代码
const bindingCode = ref("");
const qrcode = ref(wechatRobotQrcode);
// 已绑定账号，QQ是QQ号，微信是微信昵称
const bindedAccount = ref("");

// 延迟任务Id
let checkId: ReturnType<typeof setTimeout>;

// 已绑定账号列表
const bindAccounts = ref([]);
// 推送记录
const pushedHistory = ref([]);

// 获取已绑定账号列表
const getBindAccountsHandle = async () => {
  try {
    bindAccounts.value = await getBindingAccounts();
  } catch (e) {
    console.log("查询绑定推送渠道失败", e);
  }
};

// 获取推送记录
const getPushedHistoryHandle = async () => {
  try {
    const response = await pageNotifyLog({
      current: 1,
      size: 10,
      userId: "mine"
    });
    pushedHistory.value = response.records;
  } catch (e) {
    console.log("查询推送记录失败", e);
  }
};

// 修改绑定渠道
const changeChannelHandle = (name: TabPaneName) => {
  switch (name) {
    case "wechat":
      console.log("是微信");
      qrcode.value = unref(wechatRobotQrcode);
      break;
    case "qq":
      qrcode.value = unref(qqRobotQrcode);
      break;
  }
};

// 绑定推送渠道
const bindNotifyChannelHandle = async () => {
  // 显示模态框
  bindingNotifyChannelVisible.value = unref(true);
  // 获取绑定code
  try {
    const code = await bindingNotifyPre(bindingParam.value);
    if (code === "") {
      message("预请求失败", { type: "error" });
      bindingNotifyChannelVisible.value = unref(false);
      return;
    }
    console.log("获取到的Code: ", code);
    bindingCode.value = unref(code);
    // 检查是否绑定成功
    await checkBindNotifyChannelHandle();
  } catch (e) {
    console.log(e);
    bindingNotifyChannelVisible.value = unref(false);
  }
};

// 检查绑定状态
const checkBindNotifyChannelHandle = async () => {
  const result = await checkBindingNotify(unref(bindingCode));
  if (result) {
    console.log("绑定成功", result);
    bindedAccount.value = unref(
      result.nickname ? result.nickname : result.account
    );
  } else {
    checkId = setTimeout(() => checkBindNotifyChannelHandle(), 1000);
  }
};

// 清理绑定暂存内容
const clearBindingData = (done: () => void) => {
  // 取消检查扫码结果任务
  clearTimeout(checkId);
  // 设置code为空
  bindingCode.value = unref("");
  // 设置预绑定参数为默认值
  bindingParam.value = unref({ type: "wechat" });
  // 关闭模态框
  done();
};

// 翻译channel
const translateChannelHandle = (key: string) => {
  const km = {
    wechat: "微信",
    qq: "QQ"
  };
  return km[key];
};

// 页面加载
onMounted(() => {
  getBindAccountsHandle();
  getPushedHistoryHandle();
});
</script>

<template>
  <div class="main">
    <div class="w-full flex justify-between mb-4">
      <el-button @click="bindNotifyChannelHandle" type="primary">
        绑定新推送渠道
      </el-button>
    </div>
    <!-- 正文 -->
    <div style="padding: 10px">
      <div class="notify-account">
        <el-card
          v-for="acc in bindAccounts"
          shadow="always"
          :key="acc.id"
          class="notify-account-card"
        >
          <div class="notify-account-card-content">
            <el-text>渠道:</el-text>
            <el-text>{{ translateChannelHandle(acc.channel) }}</el-text>
          </div>
          <div class="notify-account-card-content">
            <el-text>账号:</el-text>
            <el-text>{{ acc.param }}</el-text>
          </div>
          <div class="notify-account-card-content">
            <el-text>操作:</el-text>
            <el-button size="small" text type="danger">删除</el-button>
          </div>
        </el-card>
      </div>

      <el-divider />

      <el-timeline style="margin-top: 20px">
        <el-timeline-item
          v-for="data in pushedHistory"
          :key="data.id"
          :timestamp="data.createdAt"
          placement="top"
          type="primary"
          :hollow="true"
        >
          <el-card>
            <el-descriptions :column="1" style="padding: 10px" size="small">
              <el-descriptions-item label="账号">
                {{ data.pin }}
              </el-descriptions-item>
              <el-descriptions-item label="昵称" v-if="data.jdNickname">
                {{ data.jdNickname }}
              </el-descriptions-item>
              <el-descriptions-item label="任务">
                {{ data.title }}
              </el-descriptions-item>
              <el-descriptions-item label="内容">
                {{ data.content }}
              </el-descriptions-item>
              <el-descriptions-item label="状态" v-if="data.status">
                <el-tag
                  v-for="(value, key, index) in data.status"
                  size="small"
                  :type="value ? 'success' : 'danger'"
                  style="margin-right: 10px"
                  :key="data.id + '-' + index"
                >
                  {{ translateChannelHandle(key) }}：
                  {{ value ? "成功" : "失败" }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-dialog
      v-model="bindingNotifyChannelVisible"
      title="绑定推送渠道"
      width="30%"
      align-center
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="clearBindingData"
    >
      <div style="text-align: center">
        <el-tabs v-model="bindingParam.type" @tab-change="changeChannelHandle">
          <el-tab-pane
            label="微信"
            name="wechat"
            :disabled="bindedAccount !== ''"
          />
          <el-tab-pane label="QQ" name="qq" :disabled="bindedAccount !== ''" />
        </el-tabs>

        <el-image
          v-if="!bindedAccount"
          style="width: 50%; height: 50%"
          :src="qrcode"
        />
        <div>
          <el-text v-if="bindedAccount" size="large">
            绑定成功，绑定账号:
            <el-text size="large" type="danger">
              {{ bindedAccount }}
            </el-text>
          </el-text>
          <el-text v-else>
            请使用
            <el-text type="danger">
              {{ bindingParam.type === "wechat" ? "微信" : "QQ" }}
            </el-text>
            扫描并添加为好友，添加好友时填写验证信息为:
            <el-text type="danger">
              {{ bindingCode }}
            </el-text>
            ，否则无法绑定
          </el-text>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
/* 时间线显示内容支持换行符 */
.el-descriptions__cell {
  display: inline-flex;
  white-space: pre-line;
}

.notify-account {
  display: flex;
}

.notify-account-card {
  width: 15%;
  margin-right: 10px;
}

.notify-account-card-content span {
  padding-right: 20px;
}
</style>
