<script setup lang="ts">
import { computed, PropType } from "vue";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import { JdBindListResult } from "@/api/jd";

defineOptions({
  name: "ReCard"
});

// 默认头像
const defaultAvatar =
  "https://img10.360buyimg.com/img/jfs/t1/192028/25/33459/5661/63fc2af2F1f6ae1b6/d0e4fdc2f126cbf5.png";

const props = defineProps({
  account: {
    type: Object as PropType<JdBindListResult>
  }
});

const emit = defineEmits(["manage-account", "delete-item"]);

const handleClickManage = (account: JdBindListResult) => {
  emit("manage-account", account);
};

const handleClickDelete = (account: JdBindListResult) => {
  emit("delete-item", account);
};

const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": props.account.expired }
]);

const cardLogoClass = computed(() => [
  "list-card-item_detail--logo",
  { "list-card-item_detail--logo__disabled": props.account.expired }
]);
</script>

<template>
  <div :class="cardClass">
    <div class="list-card-item_detail bg-bg_color">
      <el-row justify="space-between">
        <div :class="cardLogoClass">
          <img
            :src="account.avatar ? account.avatar : defaultAvatar"
            :alt="account.id"
          />
        </div>
        <div class="list-card-item_detail--operation">
          <el-tag
            :color="!account.expired ? '#00a870' : '#eee'"
            effect="dark"
            class="mx-1 list-card-item_detail--operation--tag"
          >
            {{ !account.expired ? "有效" : "无效" }}
          </el-tag>
          <el-dropdown trigger="click" :disabled="account.expired">
            <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="handleClickManage(account)"
                  :disabled="account.expired"
                >
                  重新绑定
                </el-dropdown-item>
                <el-dropdown-item @click="handleClickDelete(account)">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-row>
      <p class="list-card-item_detail--name text-text_color_primary">
        {{ account.pin }}
      </p>
      <p class="list-card-item_detail--desc text-text_color_regular">
        {{ account.remark }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  &_detail {
    flex: 1;
    min-height: 140px;
    padding: 24px 32px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      font-size: 32px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 24px 0 8px;
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      display: -webkit-box;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
