import { http } from "@/utils/http";

/** 绑定推送渠道配置 */
export type SystemNotifyConfigResult = {
  /** 微信 */
  wechat: {
    // 是否启用
    enable: boolean;
    // 二维码解码后的内容
    qrcode: string;
  };
  /** QQ */
  qq: {
    // 是否启用
    enable: boolean;
    // 二维码解码后的内容
    qrcode: string;
  };
};

/** 获取推送渠道配置 */
export const getNotifyConfig = () => {
  return http.request<SystemNotifyConfigResult>(
    "get",
    "/admin/v1/system/notify"
  );
};
