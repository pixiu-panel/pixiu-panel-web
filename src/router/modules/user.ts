export default {
  path: "/user",
  redirect: "/user/jd",
  meta: {
    icon: "lollipop",
    title: "个人信息",
    // showLink: true,
    rank: 1
  },
  children: [
    {
      path: "/user/jd",
      name: "京东账号",
      component: () => import("@/views/user/jd.vue"),
      meta: {
        title: "京东账号"
      }
    },
    {
      path: "/user/push",
      name: "推送记录",
      component: () => import("@/views/user/push.vue"),
      meta: {
        title: "推送记录"
      }
    }
  ]
} as RouteConfigsTable;
