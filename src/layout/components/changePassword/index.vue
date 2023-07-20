<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "@iconify-icons/ri/lock-fill";
import { FormInstance } from "element-plus";
import { message } from "@/utils/message";
import { changePasswordRules } from "@/views/login/utils/rule";
import { changePassword } from "@/api/user";

defineOptions({
  name: "ChangePassword"
});

const ruleFormRef = ref<FormInstance>();

// 修改密码入参
const changePasswordForm = reactive({
  oldPassword: "", // 旧密码
  newPassword: "", // 新密码
  confirmPassword: "" // 确认新密码
});

// 修改密码处理函数
const changePasswordHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 修改密码
      changePassword(changePasswordForm).then(() => {
        message("修改成功，请关闭对话框", { type: "success" });
      });
    } else {
      return fields;
    }
  });
};
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="changePasswordForm"
      size="large"
      :rules="changePasswordRules"
    >
      <el-form-item prop="oldPassword">
        <el-input
          clearable
          show-password
          v-model="changePasswordForm.oldPassword"
          placeholder="旧密码"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input
          clearable
          show-password
          v-model="changePasswordForm.newPassword"
          placeholder="新密码"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          clearable
          show-password
          v-model="changePasswordForm.confirmPassword"
          placeholder="确认新密码"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>

      <el-button
        class="w-full mt-4"
        size="default"
        type="primary"
        @click="changePasswordHandle(ruleFormRef)"
      >
        确定
      </el-button>
    </el-form>
  </div>
</template>
