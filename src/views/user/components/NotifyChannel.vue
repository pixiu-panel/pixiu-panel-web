<script setup lang="ts">
import { onMounted, ref, unref } from "vue";
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
const bindingParam = ref({
  type: "wechat" // 默认绑定微信
});

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
  bindingParam.value = unref({ type: "wechat" });
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
