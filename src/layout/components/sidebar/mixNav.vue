<script setup lang="ts">
import extraIcon from "./extraIcon.vue";
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import ChangePassword from "../changePassword/index.vue";
import { isAllEmpty } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { ref, toRaw, watch, onMounted, nextTick, unref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getParentPaths, findRouteByPath } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import Lock from "@iconify-icons/ep/lock";

const menuRef = ref();
const defaultActive = ref(null);

const {
  route,
  device,
  logout,
  onPanel,
  resolvePath,
  username,
  userAvatar,
  getDivStyle,
  avatarsStyle
} = useNav();

function getDefaultActive(routePath) {
  const wholeMenus = usePermissionStoreHook().wholeMenus;
  /** 当前路由的父级路径 */
  const parentRoutes = getParentPaths(routePath, wholeMenus)[0];
  defaultActive.value = !isAllEmpty(route.meta?.activePath)
    ? route.meta.activePath
    : findRouteByPath(parentRoutes, wholeMenus)?.children[0]?.path;
}

onMounted(() => {
  getDefaultActive(route.path);
});

nextTick(() => {
  menuRef.value?.handleResize();
});

watch(
  () => [route.path, usePermissionStoreHook().wholeMenus],
  () => {
    getDefaultActive(route.path);
  }
);

// 修改密码
const showChangePassword = ref(false);
const changePasswordHandle = () => {
  showChangePassword.value = unref(true);
};
</script>

<template>
  <div
    v-if="device !== 'mobile'"
    class="horizontal-header"
    v-loading="usePermissionStoreHook().wholeMenus.length === 0"
  >
    <el-menu
      router
      ref="menuRef"
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="defaultActive"
    >
      <el-menu-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :index="resolvePath(route) || route.redirect"
      >
        <template #title>
          <div
            v-if="toRaw(route.meta.icon)"
            :class="['sub-menu-icon', route.meta.icon]"
          >
            <component
              :is="useRenderIcon(route.meta && toRaw(route.meta.icon))"
            />
          </div>
          <div :style="getDivStyle">
            <span class="select-none">
              {{ route.meta.title }}
            </span>
            <extraIcon :extraIcon="route.meta.extraIcon" />
          </div>
        </template>
      </el-menu-item>
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 菜单搜索 -->
      <Search />
      <!-- 通知 -->
      <Notice id="header-notice" />
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img :src="userAvatar" :style="avatarsStyle" />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="changePasswordHandle">
              <IconifyIconOffline :icon="Lock" style="margin: 5px" />
              修改密码
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span
        class="set-icon navbar-bg-hover"
        title="打开项目配置"
        @click="onPanel"
      >
        <IconifyIconOffline :icon="Setting" />
      </span>
    </div>
    <!-- 修改密码 -->
    <el-dialog v-model="showChangePassword" width="30%">
      <change-password />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
