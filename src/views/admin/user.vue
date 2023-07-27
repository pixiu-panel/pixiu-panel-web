<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { deleteUser, pageUser } from "@/api/user";

defineOptions({
  name: "用户列表"
});

const userData = reactive({
  total: 0, // 总数据量
  totalPage: 0, // 总页码
  records: [] // 数据列表
});

// 分页查询参数
const pageParam = reactive({
  current: 1, // 页码
  size: 10 // 页数量
});

// 查询用户列表
const pageUserHandle = async () => {
  try {
    const response = await pageUser({
      current: pageParam.current,
      size: pageParam.size
    });
    userData.total = response.total;
    userData.totalPage = response.totalPage;
    userData.records = response.records;
  } catch (e) {
    console.log("查询用户列表失败", e);
  }
};

// 删除用户
const deleteUserHandle = async (id: string) => {
  try {
    await deleteUser(id);
  } catch (e) {
    console.log("删除用户失败", e);
  } finally {
    pageParam.current = 1;
    pageParam.size = 10;
    await pageUserHandle();
  }
};

// 挂载组件时获取数据列表
onMounted(() => {
  pageUserHandle();
});
</script>

<template>
  <div class="main">
    <el-table :data="userData.records" style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="isVerified" label="是否验证" width="90" />
      <el-table-column prop="role" label="角色" width="90" />
      <el-table-column prop="createdAt" label="注册时间" />
      <el-table-column label="最后登录">
        <template #default="scope">
          <el-text v-if="!scope.row.lastLoginAt">从未登录</el-text>
          <div v-else>
            <div>时间: {{ scope.row.lastLoginAt }}</div>
            <div>IP&nbsp;&nbsp;&nbsp;&nbsp;: {{ scope.row.lastLoginIp }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bindJdCount" label="京东账号数" />
      <el-table-column prop="bindNotifyCount" label="通知渠道数" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="deleteUserHandle(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px"
      background
      :disabled="userData.total === 0"
      v-model:current-page="pageParam.current"
      v-model:page-size="pageParam.size"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      :total="userData.total"
      @size-change="pageUserHandle"
      @current-change="pageUserHandle"
    />
  </div>
</template>
