#!/usr/bin/env node
/**
 * 题库校验脚本
 *
 * 用法：node scripts/check-bank.mjs
 * 校验：
 *   1) assets/subjects.json —— 字段齐全、kind 显式声明、id 唯一
 *   2) assets/questions/{subjectId}.json —— 字段齐全、题型合法、客观题答案合法、id 唯一
 *   3) 真题科目（kind = 'real'）—— chapter 必须为 `{年份}年真题`，并输出各年题数
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SUBJECTS_PATH = fileURLToPath(new URL('../assets/subjects.json', import.meta.url));
const bankPath = (id) =>
  fileURLToPath(new URL(`../assets/questions/${id}.json`, import.meta.url));

const VALID_TYPES = ['单选', '多选', '判断', '填空', '简答', '论述', '材料', '计算', '综合'];
const AUTO_GRADE_TYPES = ['单选', '多选', '判断'];
const VALID_KINDS = ['normal', 'real'];
const CHAPTER_RE = /^(\d{4})年真题$/;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const errors = [];

const fail = (msg) => errors.push(msg);
const isBlank = (v) => v === undefined || v === null || v === '';

// ---------- 1. 科目配置 ----------
const subjects = JSON.parse(readFileSync(SUBJECTS_PATH, 'utf8'));

if (!Array.isArray(subjects)) {
  console.error('✗ assets/subjects.json 顶层必须是数组');
  process.exit(1);
}

const seenSubjectIds = new Set();

subjects.forEach((s, i) => {
  const at = `subjects.json #${i + 1} (${s && s.id ? s.id : '无 id'})`;
  if (!s || typeof s !== 'object') return fail(`${at}: 不是对象`);

  for (const field of ['id', 'name', 'icon', 'color', 'total', 'order']) {
    if (isBlank(s[field])) fail(`${at}: 缺少字段 ${field}`);
  }
  if (seenSubjectIds.has(s.id)) fail(`${at}: id 重复`);
  seenSubjectIds.add(s.id);

  // kind 必须显式声明，禁止依赖 id 命名约定推断
  if (isBlank(s.kind)) {
    fail(`${at}: 缺少字段 kind（必须显式声明为 normal 或 real）`);
  } else if (!VALID_KINDS.includes(s.kind)) {
    fail(`${at}: kind 非法（${s.kind}），只能为 normal 或 real`);
  }
});

// ---------- 2 & 3. 各科目题库 ----------
const realSubjects = subjects.filter((s) => s.kind === 'real');

for (const subject of subjects) {
  if (isBlank(subject.id)) continue;

  const path = bankPath(subject.id);
  if (!existsSync(path)) {
    fail(`科目 ${subject.id}: 找不到题库文件 assets/questions/${subject.id}.json`);
    continue;
  }

  let questions;
  try {
    questions = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    fail(`科目 ${subject.id}: 题库 JSON 解析失败 —— ${e.message}`);
    continue;
  }

  if (!Array.isArray(questions)) {
    fail(`科目 ${subject.id}: 题库顶层必须是数组`);
    continue;
  }

  const isReal = subject.kind === 'real';
  const seenIds = new Set();
  const yearCount = new Map();

  questions.forEach((q, i) => {
    const at = `${subject.id} #${i + 1} (${q && q.id ? q.id : '无 id'})`;

    if (!q || typeof q !== 'object') return fail(`${at}: 不是对象`);

    for (const field of ['id', 'subjectId', 'chapter', 'type', 'stem', 'answer']) {
      if (isBlank(q[field])) fail(`${at}: 缺少字段 ${field}`);
    }
    if (q.subjectId !== subject.id) {
      fail(`${at}: subjectId 应为 ${subject.id}，实际为 ${q.subjectId}`);
    }

    if (seenIds.has(q.id)) fail(`${at}: id 重复：${q.id}`);
    seenIds.add(q.id);

    if (q.type && !VALID_TYPES.includes(q.type)) fail(`${at}: 非法题型 ${q.type}`);

    // 真题科目强制 chapter = `{年份}年真题`
    if (isReal) {
      const matched = CHAPTER_RE.exec(q.chapter || '');
      if (!matched) {
        fail(`${at}: 真题科目 chapter 应形如 {年份}年真题，实际为 ${q.chapter}`);
      } else {
        yearCount.set(matched[1], (yearCount.get(matched[1]) || 0) + 1);
      }
    }

    if (q.options !== undefined && !Array.isArray(q.options)) {
      fail(`${at}: options 必须是数组`);
    }

    if (AUTO_GRADE_TYPES.includes(q.type)) {
      const options = q.options || [];
      if (options.length === 0) fail(`${at}: ${q.type}题缺少 options`);
      const ans = String(q.answer || '');
      if (q.type === '判断') {
        if (!['对', '错', '正确', '错误'].includes(ans)) {
          fail(`${at}: 判断题答案应为 对/错，实际为 ${ans}`);
        }
      } else if (q.type === '单选') {
        if (!LETTERS.slice(0, options.length).includes(ans)) {
          fail(`${at}: 单选答案 ${ans} 不在合法选项字母 A-${LETTERS[options.length - 1]} 内`);
        }
      } else {
        const chars = ans.split('');
        if (!chars.every((c) => LETTERS.slice(0, options.length).includes(c))) {
          fail(`${at}: 多选答案 ${ans} 含非法选项字母`);
        }
        if (new Set(chars).size !== chars.length) fail(`${at}: 多选答案 ${ans} 含重复字母`);
      }
    }
  });

  // 题量配置与实际是否一致
  if (typeof subject.total === 'number' && subject.total !== questions.length) {
    fail(
      `科目 ${subject.id}: subjects.json 的 total=${subject.total} 与题库实际题数 ${questions.length} 不一致`
    );
  }

  console.log(`\n[${subject.id}] ${subject.name}（${subject.kind}）总题数：${questions.length}`);
  if (isReal) {
    const years = Array.from(yearCount.entries()).sort((a, b) =>
      b[0].localeCompare(a[0])
    );
    for (const [year, count] of years) console.log(`  ${year} 年：${count} 题`);
    if (years.length === 0) console.log('  （无符合 {年份}年真题 的题目）');
  }
}

// ---------- 汇总 ----------
console.log(`\n真题科目：${realSubjects.length} 个`);

if (errors.length > 0) {
  console.error(`\n✗ 校验未通过，共 ${errors.length} 处问题：`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('\n✓ 校验通过');
