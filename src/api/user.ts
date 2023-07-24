import { http } from "@/utils/http";

/*** 修改密码参数 */
export type ChangePasswordParam = {
  /** 旧密码 */
  oldPassword: string;
  /** 新密码 */
  newPassword: string;
  /** 确认新密码 */
  confirmPassword?: string;
};

// 修改密码
export const changePassword = (data: ChangePasswordParam) => {
  return http.request<object>("post", "/admin/v1/user/password", { data });
};
