<script setup lang="ts">
import { onMounted, ref, unref } from "vue";
import wechatRobotQrcode from "@/assets/qrcode/wechat.jpg";
import qqRobotQrcode from "@/assets/qrcode/qq.jpg";
import { TabPaneName } from "element-plus";
import { bindingNotifyPre, checkBindingNotify } from "@/api/notify";
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
const getBindAccountsHandle = () => {
  bindAccounts.value = unref([
    { id: "xxxxxx", channel: "wechat", account: "jingang1101766085", status: 1 }
  ]);
};

// 获取推送记录
const getPushedHistoryHandle = () => {
  pushedHistory.value = unref([
    {
      id: "xxx",
      title: "东东农场日常任务",
      content:
        "【京东账号4】jd_KWoyhLgWqNZv\n" +
        "【水果名称】清洁袋5大卷\n" +
        "【已兑换水果】7次\n" +
        "【助力您的好友】_送命或寻欢,七夕篱漠,蒋伟明222\n" +
        "【今日共浇水】10次\n" +
        "【剩余 水滴】109g💧\n" +
        "【水果🍉进度】20.33%，已浇水122次,还需478次\n" +
        "【预测】47天之后(2023-08-25日)可兑换水果🍉",
      status: { wechat: true, qq: false },
      createdAt: "2023-07-12 10:52:04"
    },
    {
      id: "yyyy",
      title: "东东农场日常任务",
      content:
        "【京东账号4】jd_KWoyhLgWqNZv\n" +
        "【水果名称】清洁袋5大卷\n" +
        "【已兑换水果】7次\n" +
        "【助力您的好友】_送命或寻欢,七夕篱漠,蒋伟明222\n" +
        "【今日共浇水】10次\n" +
        "【剩余 水滴】109g💧\n" +
        "【水果🍉进度】20.33%，已浇水122次,还需478次\n" +
        "【预测】47天之后(2023-08-25日)可兑换水果🍉",
      status: { wechat: true, qq: true },
      createdAt: "2023-07-11 10:52:04"
    }
  ]);
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
    <div>
      <el-row>
        <el-col :span="5">
          <el-card
            shadow="always"
            :key="acc.id"
            v-for="acc in bindAccounts"
            style="margin-right: 50px"
          >
            <template #header>
              <div class="account-card-header">
                <span>{{ translateChannelHandle(acc.channel) }}</span>
                <el-button text type="danger">删除</el-button>
              </div>
            </template>
            <div>账号: {{ acc.account }}</div>
          </el-card>
        </el-col>
        <el-col :span="19">
          <el-timeline>
            <el-timeline-item
              v-for="(data, index) in pushedHistory"
              :key="index"
              :timestamp="data.createdAt"
              placement="top"
              type="primary"
              :hollow="true"
            >
              <el-card>
                <el-descriptions :column="1" style="padding: 10px" size="small">
                  <el-descriptions-item label="任务">
                    {{ data.title }}
                  </el-descriptions-item>
                  <el-descriptions-item label="内容">
                    {{ data.content }}
                  </el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tag
                      size="small"
                      :type="value ? 'success' : 'danger'"
                      style="margin-right: 10px"
                      :key="data.id + '-' + idx"
                      v-for="(value, key, idx) in data.status"
                    >
                      {{ translateChannelHandle(key) }}：
                      {{ value ? "成功" : "失败" }}
                    </el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
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
  white-space: pre-line;
}

.account-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
