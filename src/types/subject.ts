/** 科目类型：normal 普通练习科目 / real 真题整卷科目 */
export type SubjectKind = 'normal' | 'real';

/** 科目配置 */
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  enabled: boolean;
  order: number;
  /** 显式声明科目类型，真题科目不再依赖 id 命名约定 */
  kind: SubjectKind;
}
