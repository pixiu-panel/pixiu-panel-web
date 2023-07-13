// 接口返回数据基础包装
export type BaseResult<T> = {
  code: number;
  data: T;
  message: string;
  errMsg: string;
};

// 分页数据基础包装
export type BasePageResult<T> = {
  current: number;
  size: number;
  total: number;
  totalPage: number;
  records: T;
};
