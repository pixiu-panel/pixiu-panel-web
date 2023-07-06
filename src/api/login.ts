import { http } from "@/utils/http";

export type LoginResult = {
  /** 用户名 */
  username: string;
  /** 当前登陆用户的角色 */
  roles: Array<string>;
  /** `token` */
  accessToken: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: Date;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<LoginResult>(
    "post",
    "/admin/v1/login",
    { data },
    {
      auth: {
        username: "admin",
        password: "kycgfS4sBjx2rPVD"
      }
    }
  );
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<LoginResult>(
    "post",
    "/admin/v1/login/refresh",
    {
      data
    },
    {
      auth: {
        username: "admin",
        password: "kycgfS4sBjx2rPVD"
      }
    }
  );
};
