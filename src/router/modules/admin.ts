export default {
  path: "/admin",
  redirect: "/admin/user",
  meta: {
    icon: "briefcase",
    title: "系统管理",
    // showLink: true,
    rank: 9
  },
  children: [
    {
      path: "/admin/user",
      name: "用户管理",
      component: () => import("@/views/admin/user.vue"),
      meta: {
        title: "用户管理"
      }
    },
    {
      path: "/admin/ql",
      name: "青龙",
      component: () => import("@/views/admin/ql.vue"),
      meta: {
        title: "青龙"
      }
    }
  ]
} as RouteConfigsTable;
