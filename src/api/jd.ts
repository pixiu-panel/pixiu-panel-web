import { http } from "@/utils/http";

// 京东账号绑定列表item数据
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
  /*是否是Plus会员*/
  isPlus: boolean;
  /*等级*/
  level: string;
  /*昵称*/
  nickname: string;
  /*是否失效*/
  expired: boolean;
  /*创建时间*/
  createdAt: Date;
  /*更新时间*/
  updatedAt: Date;
  /*最后扫码时间*/
  lastUpdate: Date;
};

// 京东授权二维码信息
export type JdQrcodeResult = {
  /*二维码图片Base64*/
  qr: string;
  /*授权链接*/
  qrUrl: string;
  /*有效期(秒)*/
  timeout: number;
  /*检查扫码状态用的cookie*/
  cookie: string;
};

/** 获取京东绑定账号列表 */
export const getJdBindList = () => {
  return http.request<Array<JdBindListResult>>("get", "/admin/v1/jd/binding");
};

/** 获取京东授权二维码 */
export const getJdQrcode = () => {
  return http.request<JdQrcodeResult>("get", "/admin/v1/jd/binding/qrcode");
};

/** 检查京东授权扫码状态 */
export const checkJdQrcode = (cookie?: string) => {
  return http.request<string>("get", "/admin/v1/jd/binding/qrcode/check", {
    params: { key: cookie }
  });
};

/** 删除京东账号 */
export const deleteJdAccount = (id?: string) => {
  return http.request<string>("delete", "/admin/v1/jd/binding", {
    params: { id }
  });
};

/** 修改京东账号备注 */
export const changeJdAccountRemark = (params?: string) => {
  return http.request<string>("post", "/admin/v1/jd/binding", {
    params
  });
};
