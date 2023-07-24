import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

// 密码校验器
const passwordValidator = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!REGEXP_PWD.test(value)) {
    callback(new Error("密码格式应为8-18位数字、字母、符号的任意两种组合"));
  } else {
    callback();
  }
};

/** 登录校验 */
const loginRules = reactive(<FormRules>{
  password: [{ validator: passwordValidator, trigger: "blur" }]
});

/** 修改密码校验 */
const changePasswordRules = reactive(<FormRules>{
  oldPassword: [{ validator: passwordValidator, trigger: "blur" }],
  newPassword: [{ validator: passwordValidator, trigger: "blur" }],
  confirmPassword: [{ validator: passwordValidator, trigger: "blur" }]
});

export { loginRules, changePasswordRules };
