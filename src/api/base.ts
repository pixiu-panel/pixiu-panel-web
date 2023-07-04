// 接口返回数据基础包装
export type BaseResult<T> = {
  code: number;
  data: T;
  message: string;
  errMsg: string;
};
