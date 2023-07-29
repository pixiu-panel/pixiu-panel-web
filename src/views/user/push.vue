<script setup lang="ts">
import { onMounted, reactive, ref, unref } from "vue";
import { pageNotifyLog } from "@/api/notify";
import NotifyChannel from "./components/NotifyChannel.vue";
import { message } from "@/utils/message";

defineOptions({
  name: "推送记录"
});

// 绑定推送渠道模态框
const notifyChannelVisible = ref(false);

// 推送记录
const pushedHistory = ref([]);
const pageData = reactive({
  current: 1, // 第一页
  size: 10, // 页数量
  totalPage: 0 // 总页数
});

// 获取推送记录
const getPushedHistoryHandle = async (isHotLoad: boolean) => {
  try {
    // 如果是热加载，修改一下页码
    if (isHotLoad) {
      const current = pageData.current + 1;
      if (current > pageData.totalPage) {
        message("数据已加载完毕", { type: "success" });
        return;
      }
      pageData.current = current;
    }
    // 查询数据
    const response = await pageNotifyLog({
      current: pageData.current,
      size: pageData.size,
      userId: "mine"
    });
    // 追加数据
    pushedHistory.value = pushedHistory.value.concat(response.records);
    pageData.totalPage = response.totalPage;
  } catch (e) {
    console.log("查询推送记录失败", e);
  }
};

// 显示绑定渠道管理模态框
const showNotifyChannelHandle = () => {
  // 显示模态框
  notifyChannelVisible.value = unref(true);
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
  getPushedHistoryHandle(false);
});
</script>

<template>
  <div class="main">
    <div class="w-full flex justify-between mb-4">
      <el-button @click="showNotifyChannelHandle" type="primary">
        推送渠道
      </el-button>
    </div>
    <!-- 正文 -->
    <div style="padding: 10px">
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
      v-model="notifyChannelVisible"
      title="推送渠道管理"
      width="30%"
      align-center
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <NotifyChannel />
    </el-dialog>
  </div>
</template>

<style scoped>
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
