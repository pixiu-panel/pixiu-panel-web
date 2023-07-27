<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { genInvitationCode, getInvitationCodeList } from "@/api/invitation";

defineOptions({
  name: "邀请注册"
});

// 查询邀请码列表参数
const codePageParam = reactive({
  current: 1, // 页码
  size: 10 // 页数量
});

// 邀请码列表数据
const codeData = reactive({
  total: 0, // 总数据量
  totalPage: 0, // 总页码
  records: [] // 数据列表
});

// 生成邀请码函数
const genCodeHandle = async () => {
  // 接口调用
  genInvitationCode().then(() => {
    // 修改为第一页
    codePageParam.current = 1;
    // 刷新一下列表
    getListHandle();
  });
};

// 获取邀请码列表
const getListHandle = async () => {
  try {
    const response = await getInvitationCodeList({
      current: codePageParam.current,
      size: codePageParam.size,
      userId: "mine"
    });
    codeData.total = response.total;
    codeData.totalPage = response.totalPage;
    codeData.records = response.records;
  } catch (e) {
    console.log("查询邀请码数据失败", e);
  }
};

// 复制邀请链接
const copyInvitationLink = (code: string) => {
  return location.protocol + "//" + location.host + "/#/register?code=" + code;
};

// 挂载组件时获取数据列表
onMounted(() => {
  getListHandle();
});
</script>

<template>
  <div class="main">
    <div class="w-full flex justify-between mb-4">
      <el-button @click="genCodeHandle" type="primary"> 生成邀请码 </el-button>
    </div>

    <div>
      <el-table :data="codeData.records" style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column prop="createdAt" label="生成时间" />
        <el-table-column prop="code" label="邀请码" />
        <el-table-column label="邀请链接">
          <template #default="scope">
            <el-tag v-if="scope.row.inviteeId" type="danger">已使用</el-tag>
            <el-button
              link
              v-else
              type="primary"
              v-copy:click="copyInvitationLink(scope.row.code)"
            >
              点击复制
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="邀请用户信息">
          <el-table-column prop="inviteeTime" label="邀请时间" />
          <el-table-column prop="inviteeUsername" label="账号" />
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        background
        :disabled="codeData.total === 0"
        v-model:current-page="codePageParam.current"
        v-model:page-size="codePageParam.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        :total="codeData.total"
        @size-change="getListHandle"
        @current-change="getListHandle"
      />
    </div>
  </div>
</template>
