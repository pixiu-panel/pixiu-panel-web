import { http } from "@/utils/http";
import { BasePageResult } from "@/utils/http/base";

export type InvitationCodeResult = {
  id: string; // Id
  createdAt: Date; // 生成时间
  updatedAt: Date; // 使用时间
  userId: string; // 生成用户Id
  code: string; // 邀请码
  inviteeId?: string; // 被邀请人Id
  inviteeUsername?: string; // 被邀请人用户名
  inviteeTime?: Date; // 邀请时间
};

// 查询列表
export const getInvitationCodeList = (params: object) => {
  return http.request<BasePageResult<InvitationCodeResult>>(
    "get",
    "/admin/v1/invitation",
    { params }
  );
};

// 生成邀请码
export const genInvitationCode = () => {
  return http.request<any>("post", "/admin/v1/invitation/new");
};
