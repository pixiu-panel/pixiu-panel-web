import { http } from "@/utils/http";

export type BindingNotifyParam = {
  /** 绑定类型 */
  type: string;
};

/** 检查绑定推送账号返回值 */
export type CheckBindingNotifyResult = {
  /** 账号 */
  account: string;
  /** 昵称 */
  nickname: string;
};

/* 绑定推送通道预请求 */
export const bindingNotifyPre = (data: BindingNotifyParam) => {
  return http.request<string>("post", "/admin/v1/notify", { data });
};

/* 检查绑定推送通道是否成功 */
export const checkBindingNotify = (codeStr: string) => {
  return http.request<CheckBindingNotifyResult>(
    "get",
    "/admin/v1/notify/check",
    { params: { code: codeStr } }
  );
};
