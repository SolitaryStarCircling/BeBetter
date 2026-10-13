/**
 * 题库归一化脚本
 * 将三份源题库 JSON 转换为项目统一格式
 * 源文件：
 *   - 广东普通专升本高数题库_300题.json (纯数组)
 *   - 广东普通专升本英语题库_完整300题.json (纯数组)
 *   - 广东专升本政治题库300题.json ({ meta, questions: [...] })
 * 输出：assets/questions/{subjectId}.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SOURCES = [
  { file: '广东普通专升本高数题库_300题.json', subjectId: 'math' },
  { file: '广东普通专升本英语题库_完整300题.json', subjectId: 'english' },
  { file: '广东专升本政治题库300题.json', subjectId: 'politics' },
];

function loadQuestions(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  // 兼容纯数组和 { meta, questions } 两种结构
  if (Array.isArray(data)) return data;
  if (data.questions && Array.isArray(data.questions)) return data.questions;
  throw new Error(`无法识别的题库格式: ${filePath}`);
}

function normalizeQuestion(q, subjectId) {
  const id = `${subjectId}-${q.id}`;
  const tags = q.knowledge_point ? [q.knowledge_point] : [];
  return {
    id,
    subjectId,
    chapter: q.chapter || '',
    type: q.type || '单选',
    stem: q.stem || '',
    options: q.options || [],
    answer: q.answer || '',
    explanation: q.explanation || '',
    difficulty: typeof q.difficulty === 'number' ? q.difficulty : 2,
    tags,
  };
}

let totalOut = 0;

for (const { file, subjectId } of SOURCES) {
  const srcPath = join(ROOT, file);
  const questions = loadQuestions(srcPath);
  const normalized = questions.map((q) => normalizeQuestion(q, subjectId));

  const outDir = join(ROOT, 'assets', 'questions');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${subjectId}.json`);
  writeFileSync(outPath, JSON.stringify(normalized, null, 2), 'utf-8');

  console.log(`${subjectId}: ${normalized.length} 题 -> ${outPath}`);
  totalOut += normalized.length;
}

console.log(`\n共归一化 ${totalOut} 题，输出到 assets/questions/`);
