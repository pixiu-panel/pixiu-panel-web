<script setup lang="ts">
import { onMounted, reactive, ref, unref } from "vue";
import { message } from "@/utils/message";
import wechatRobotQrcode from "@/assets/qrcode/wechat.jpg";
import qqRobotQrcode from "@/assets/qrcode/qq.jpg";
import { TabPaneName } from "element-plus";
import {
  bindingNotifyPre,
  checkBindingNotify,
  deleteBindChannel,
  getBindingAccounts
} from "@/api/notify";
import { getNotifyConfig } from "@/api/system";
import ReQrcode from "@/components/ReQrcode";

defineOptions({
  name: "NotifyChannel"
});

// 推送渠道绑定模态框
const bindingNotifyChannelVisible = ref(false);
// 绑定代码
const bindingCode = ref("");
const qrcode = ref(wechatRobotQrcode);
// 已绑定账号，QQ是QQ号，微信是微信昵称
const bindedAccount = ref("");

// 已绑定账号列表
const bindAccounts = ref([]);

// 延迟任务Id
let checkId: ReturnType<typeof setTimeout>;

// 预请求参数
const bindingParam = reactive({
  type: "wechat" // 默认绑定微信
});

// 绑定配置
const notifyConfig = reactive({
  wechat: {
    enable: false,
    qrcode: ""
  },
  qq: {
    enable: false,
    qrcode: ""
  }
});

// 获取渠道配置
const getNotifyConfigHandle = async () => {
  try {
    const configData = await getNotifyConfig();
    Object.assign(notifyConfig, configData);
    console.log("绑定配置:", notifyConfig);
  } catch (e) {
    console.log("获取推送渠道配置失败", e);
  }
};

// 查询已绑定渠道列表
const getNotifyChannelHandle = async () => {
  try {
    bindAccounts.value = await getBindingAccounts();
  } catch (e) {
    console.log("查询绑定推送渠道失败", e);
  }
};

// 绑定推送渠道
const bindNotifyChannelHandle = async () => {
  // 判断有没有启用的推送配置
  let enableCount = 0;
  let enableChannel = "";
  Object.entries(notifyConfig).forEach(([key, value]) => {
    if (value.enable) {
      if (enableChannel === "") {
        enableChannel = key;
      }
      enableCount++;
    }
  });
  if (enableCount < 1) {
    message("没有配置推送渠道", { type: "error" });
    return;
  }
  // 设置默认推送渠道
  bindingParam.type = enableChannel;

  // 显示模态框
  bindingNotifyChannelVisible.value = unref(true);
  // 获取绑定code
  try {
    const code = await bindingNotifyPre(bindingParam);
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
  bindingParam.type = "wechat";
  // 关闭模态框
  done();
};

// 删除已绑定的推送渠道
const deleteBindChannelHandle = (id: string) => {
  deleteBindChannel(id)
    .then(() => {
      message("删除成功", { type: "success" });
    })
    .finally(() => {
      getNotifyChannelHandle();
    });
};

// 翻译channel
const translateChannelHandle = (key: string) => {
  const km = {
    wechat: "微信",
    qq: "QQ"
  };
  return km[key];
};

// 组件加载事件
onMounted(() => {
  getNotifyConfigHandle();
  getNotifyChannelHandle();
});
</script>

<template>
  <div class="">
    <el-button @click="bindNotifyChannelHandle" type="primary" link>
      绑定新推送渠道
    </el-button>

    <el-table :data="bindAccounts" style="width: 100%">
      <el-table-column label="渠道" align="center">
        <template #default="scope">
          <el-text>{{ translateChannelHandle(scope.row.channel) }}</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="param" label="账号" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="danger"
            size="small"
            @click="deleteBindChannelHandle(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
            v-if="notifyConfig.wechat.enable"
            :disabled="bindedAccount !== ''"
          >
            <ReQrcode :text="notifyConfig.wechat.qrcode" tag="img" />
          </el-tab-pane>
          <el-tab-pane
            label="QQ"
            name="qq"
            v-if="notifyConfig.qq.enable"
            :disabled="bindedAccount !== ''"
          >
            <ReQrcode :text="notifyConfig.qq.qrcode" tag="img" />
          </el-tab-pane>
        </el-tabs>
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
