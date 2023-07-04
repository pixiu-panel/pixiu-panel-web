import { http } from "@/utils/http";

type MenuNode = {
  /*路径*/
  path: string;
  /*名称*/
  name: string;
  /*元数据*/
  meta: {
    /*名称*/
    title: string;
    /*图标*/
    icon: string;
    /*排序*/
    rank: number;
    /*角色列表*/
    roles: Array<string>;
    /*按钮列表*/
    auths: Array<string>;
    /*是否显示父级*/
    showParent: boolean;
  };
};

export const getAsyncRoutes = () => {
  return http.request<Array<MenuNode>>("get", "/admin/v1/menu");
};
