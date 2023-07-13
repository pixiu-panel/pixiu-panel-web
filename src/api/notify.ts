import { http } from "@/utils/http";
import { BasePageResult } from "@/utils/http/base";

/*** 绑定推送渠道预请求参数 */
export type BindingNotifyParam = {
  /** 绑定类型 */
  type: string;
};

/*** 获取推送记录参数 */
export type PageNotifyLogParam = {
  /** 页码 */
  current: number;
  /** 页数量 */
  size: number;
  /** 用户Id */
  userId?: string;
};

/** 检查绑定推送账号返回值 */
export type CheckBindingNotifyResult = {
  /** 账号 */
  account: string;
  /** 昵称 */
  nickname: string;
};

/*** 已绑定推送渠道列表 */
export type BindingNotifyResult = {
  /** id */
  id: string;
  /** 渠道 */
  channel: string;
  /*** 账号 */
  account: string;
};

/*** 推送记录 */
export type NotifyLogResult = {
  /** id */
  id: string;
  /** 推送时间 */
  channel: Date;
  /*** 用户Id */
  account: string;
  /*** 京东账号 */
  pin: string;
  /*** 京东昵称 */
  jdNickname: string;
  /*** 标题 */
  title: string;
  /*** 内容 */
  content: string;
  /*** 推送状态 */
  status: object;
};

/** 绑定推送通道预请求 */
export const bindingNotifyPre = (data: BindingNotifyParam) => {
  return http.request<string>("post", "/admin/v1/notify", { data });
};

/** 检查绑定推送通道是否成功 */
export const checkBindingNotify = (codeStr: string) => {
  return http.request<CheckBindingNotifyResult>(
    "get",
    "/admin/v1/notify/check",
    { params: { code: codeStr } }
  );
};

/** 获取已绑定推送渠道 */
export const getBindingAccounts = () => {
  return http.request<Array<BindingNotifyResult>>("get", "/admin/v1/notify");
};

/** 绑定推送通道预请求 */
export const pageNotifyLog = (params: PageNotifyLogParam) => {
  return http.request<BasePageResult<Array<NotifyLogResult>>>(
    "get",
    "/admin/v1/notify/log",
    { params }
  );
};
