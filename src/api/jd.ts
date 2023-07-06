import { http } from "@/utils/http";

export type JdBindListResult = {
  /*数据Id*/
  id: string;
  /*用户Id*/
  userId: string;
  /*京东账号*/
  pin: string;
  /*头像*/
  avatar: string;
  /*备注*/
  remark: string;
  /*是否失效*/
  expired: boolean;
  /*创建时间*/
  createdAt: Date;
  /*更新时间*/
  updatedAt: Date;
  /*最后扫码时间*/
  lastUpdate: Date;
};

/** 获取京东绑定账号列表 */
export const getJdBindList = () => {
  return http.get<Array<JdBindListResult>>("/admin/v1/jd/binding");
};
