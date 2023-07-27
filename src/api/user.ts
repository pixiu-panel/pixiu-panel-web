import { http } from "@/utils/http";
import { BasePageResult } from "@/utils/http/base";

/*** 修改密码参数 */
export type ChangePasswordParam = {
  /** 旧密码 */
  oldPassword: string;
  /** 新密码 */
  newPassword: string;
  /** 确认新密码 */
  confirmPassword?: string;
};

// 分页查询用户列表参数
export type PageUserParam = {
  // 页码
  current: number;
  // 页数量
  size: number;
};

// 分页查询用户返回列表数据
export type PageUserResult = {
  id: string; // Id
  username: string; // 用户名
  email: string; // 邮箱
  isVerified: boolean; // 是否验证邮箱
  role: string; // 角色
  createdAt: Date; // 注册时间
  lastLoginAt?: Date; // 最后登录时间
  lastLoginIp?: string; // 最后登录IP
  bindJdCount: number; // 京东账号数
  bindNotifyCount: number; // 通知渠道数
};

// 修改密码
export const changePassword = (data: ChangePasswordParam) => {
  return http.request<object>("post", "/admin/v1/user/password", { data });
};

// 分页查询用户列表
export const pageUser = (params: PageUserParam) => {
  return http.request<BasePageResult<PageUserResult>>(
    "get",
    "/admin/v1/user/page",
    { params }
  );
};

// 删除用户
export const deleteUser = (id: string) => {
  return http.request<object>("delete", "/admin/v1/user/" + id);
};
