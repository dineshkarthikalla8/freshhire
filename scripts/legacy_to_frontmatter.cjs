#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const infile = process.argv[2] || path.join(__dirname, '..', 'tcs-nqt-2026-full-mock-legacy.md');
const outfile = process.argv[3] || path.join(__dirname, '..', 'tcs-nqt-2026-full-mock-converted.md');

function parseFrontmatterBlock(block) {
  const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l.length);
  const obj = {};
  for (const line of lines) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (m) {
      const key = m[1].trim();
      const val = m[2].trim();
      obj[key] = val;
    }
  }
  return obj;
}

function quote(s) {
  if (s == null) return '""';
  return JSON.stringify(String(s));
}

function toYaml(obj) {
  // simple YAML generator for our limited structure
  let out = '';
  out += `---\n`;
  if (obj.examId) out += `examId: ${obj.examId}\n`;
  if (obj.company) out += `company: ${quote(obj.company)}\n`;
  if (obj.title) out += `title: ${quote(obj.title)}\n`;
  if (obj.description) out += `description: ${quote(obj.description)}\n`;
  if (obj.duration) out += `duration: ${obj.duration}\n`;
  if (obj.passingScore) out += `passingScore: ${obj.passingScore}\n`;
  out += `---\n\n`;
  out += `questions:\n`;
  for (const q of obj.questions) {
    out += `  - id: ${q.id}\n`;
    out += `    section: ${quote(q.section)}\n`;
    out += `    number: ${q.number}\n`;
    out += `    type: ${q.type || 'single'}\n`;
    out += `    points: ${q.points || 1}\n`;
    out += `    difficulty: ${quote(q.difficulty)}\n`;
    out += `    text: ${quote(q.text)}\n`;
    out += `    options:\n`;
    for (const opt of q.options) {
      out += `      - label: ${opt.label}\n`;
      out += `        text: ${quote(opt.text)}\n`;
    }
    out += `    correct: ${q.correct}\n`;
    out += `    explanation: ${quote(q.explanation || '')}\n\n`;
  }
  return out;
}

function parseLegacy(content) {
  // extract frontmatter (first --- ... ---)
  const fmMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
  let meta = {};
  let body = content;
  if (fmMatch) {
    meta = parseFrontmatterBlock(fmMatch[1]);
    body = content.slice(fmMatch[0].length).trim();
  }

  const blocks = body.split(/\n---\n/);
  const questions = [];
  let qIndex = 1;
  for (const block of blocks) {
    const txt = block.trim();
    if (!txt) continue;
    // Only handle question blocks starting with '## Question' or containing 'Question:'
    if (!/Question:/i.test(txt)) continue;
    // get question text
    const qMatch = txt.match(/Question:\s*([^\n]+)/i);
    const qText = qMatch ? qMatch[1].trim() : '';
    // find options
    const optionLines = [];
    const lines = txt.split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^([A-D])\.\s*(.+)$/);
      if (m) optionLines.push({label: m[1], text: m[2].trim()});
    }
    // If options not found, try to find lines that start with a letter+dot without leading spaces
    if (optionLines.length === 0) {
      for (const line of lines) {
        const m2 = line.match(/^[A-D]\.\s*.+/);
        if (m2) {
          const m = line.match(/^([A-D])\.\s*(.+)$/);
          optionLines.push({label: m[1], text: m[2].trim()});
        }
      }
    }
    // answer
    const aMatch = txt.match(/Answer:\s*([A-D])/i);
    const answer = aMatch ? aMatch[1].toUpperCase() : '';
    const dMatch = txt.match(/Difficulty:\s*([^\n]+)/i);
    const difficulty = dMatch ? dMatch[1].trim() : '';
    const eMatch = txt.match(/Explanation:\s*([\s\S]*)/i);
    const explanation = eMatch ? eMatch[1].trim() : '';

    const q = {
      id: `${meta.examId || 'exam'}-${String(qIndex)}`,
      section: (meta.section || 'Aptitude'),
      number: qIndex,
      type: 'single',
      points: 1,
      difficulty: difficulty,
      text: qText,
      options: optionLines,
      correct: answer,
      explanation: explanation
    };
    questions.push(q);
    qIndex++;
  }

  return Object.assign({}, meta, {questions});
}

try {
  const content = fs.readFileSync(infile, 'utf8');
  const parsed = parseLegacy(content);
  const yaml = toYaml(parsed);
  fs.writeFileSync(outfile, yaml, 'utf8');
  console.log('Converted', infile, '→', outfile);
  console.log('Questions parsed:', parsed.questions.length);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
