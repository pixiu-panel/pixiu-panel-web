<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  ref,
  reactive,
  toRaw,
  onMounted,
  onBeforeUnmount,
  unref,
  watch
} from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import Opportunity from "@iconify-icons/ep/opportunity";
import { register } from "@/api/login";

defineOptions({
  name: "Login"
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
const { title } = useNav();

const isRegister = ref(false);

const ruleForm = reactive({
  username: "", // 账号
  password: "", // 密码
  invitationCode: "" // 邀请码
});

// 登录
const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password
        })
        .then(res => {
          console.log("登录返回: ", res);
          // 获取后端路由
          initRouter().then(() => {
            router.push(getTopMenu(true).path);
            message("登录成功", { type: "success" });
          });
        })
        .catch(res => {
          console.log("登录失败: ", res);
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};

// 注册
const onRegister = (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  /** await */ formEl.validate((valid, fields) => {
    if (valid) {
      register({
        username: ruleForm.username,
        password: ruleForm.password,
        invitationCode: ruleForm.invitationCode
      })
        .then(resp => {
          console.log("注册返回: ", resp);
          // 跳转登录页
          router.push("/login");
          message("注册成功", { type: "success" });
        })
        .catch(err => {
          console.log("注册失败", err);
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    if (!isRegister.value) {
      onLogin(ruleFormRef.value);
    } else {
      onRegister(ruleFormRef.value);
    }
  }
}

// 监听一下，判断是不是注册
watch(
  () => router.currentRoute.value.name,
  () => {
    // 修改是否为注册的值
    isRegister.value = unref(router.currentRoute.value.name === "Register");
    // 修改邀请码的值
    ruleForm.invitationCode = router.currentRoute.value.query.code;
  }
);

onMounted(() => {
  // 修改是否为注册的值
  isRegister.value = unref(router.currentRoute.value.name === "Register");
  // 修改邀请码的值
  ruleForm.invitationCode = router.currentRoute.value.query.code;
  // 添加回车键监听事件
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  // 去掉回车键监听事件
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  clearable
                  v-model="ruleForm.username"
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  clearable
                  show-password
                  v-model="ruleForm.password"
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item v-if="isRegister">
                <el-input
                  clearable
                  v-model="ruleForm.invitationCode"
                  placeholder="邀请码(非必填)"
                  :prefix-icon="useRenderIcon(Opportunity)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                v-if="!isRegister"
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
              <el-button
                v-else
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onRegister(ruleFormRef)"
              >
                注册
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
