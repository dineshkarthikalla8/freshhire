/**
 * Strict Markdown Parser for Company Exams
 * Expected format with YAML frontmatter and question blocks separated by ---
 */

export type ParsedQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
};

export type ParsedExam = {
  examId: string;
  company: string;
  title: string;
  duration: number;
  passingScore: number;
  questions: ParsedQuestion[];
};

/**
 * Extract YAML frontmatter from markdown
 */
function extractFrontmatter(content: string): { metadata: Record<string, any>; body: string } {
  // Normalize line endings
  const normalized = content.replace(/\r\n/g, '\n').trim();
  
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid markdown format. Expected YAML frontmatter between --- markers.');
  }

  const metadataStr = match[1];
  const body = match[2];

  const metadata: Record<string, any> = {};
  metadataStr.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      const trimmedKey = key.trim();
      const lowerKey = trimmedKey.toLowerCase();

      if (lowerKey === 'duration' || lowerKey === 'passingscore') {
        metadata[trimmedKey] = parseInt(value, 10);
      } else if (value.toLowerCase() === 'true') {
        metadata[trimmedKey] = true;
      } else if (value.toLowerCase() === 'false') {
        metadata[trimmedKey] = false;
      } else {
        metadata[trimmedKey] = value;
      }
    }
  });

  return { metadata, body };
}

/**
 * Parse a single question block
 */
function parseQuestion(block: string): ParsedQuestion {
  let cleanBlock = block.replace(/^##\s*Question\s*\n?/m, '').trim();

  // 1. Extract Question
  const questionMatch = cleanBlock.match(/Question:\s*(.+?)(?=\n(?:A[\.\s]|\d[\.\s]|- |Answer:|Correct Answer:|$))/is);
  let question = '';
  if (questionMatch) {
    question = questionMatch[1].trim();
  } else {
    // Fallback: take everything after "Question:" until the first A., 1., or -
    const qMatch = cleanBlock.match(/Question:\s*(.+?)(?=(?:A[\.\s]|\d[\.\s]|- |Answer:|Correct Answer:|$))/is);
    question = qMatch ? qMatch[1].trim() : '';
  }

  if (!question) {
    throw new Error(`Invalid question block: missing "Question:" field.\n${cleanBlock.substring(0, 100)}`);
  }

  // 2. Extract Options Block
  const questionIndex = cleanBlock.indexOf(question);
  let afterQuestion = cleanBlock.substring(questionIndex + question.length);
  const optionsBlockMatch = afterQuestion.match(/^\s*(.+?)(?=\n(?:Answer:|Correct Answer:|Difficulty:|Explanation:|$))/is);
  let rawOptions = optionsBlockMatch ? optionsBlockMatch[1].trim() : '';

  let options: string[] = [];

  if (rawOptions) {
    // Handle merged options like "MumbaiB. DelhiC. Chennai"
    // Insert newline before [B-D]., [2-4]., or bullet points if not preceded by newline
    rawOptions = rawOptions.replace(/([^\n])([B-D][\.\s]+|[2-4][\.\s]+|- )/ig, '$1\n$2');

    const lines = rawOptions.split('\n').map(l => l.trim()).filter(Boolean);
    const optionRegex = /^(?:[A-D][\.\s]+|\d[\.\s]+|-)\s*(.*)/i;
    
    let currentOption = '';
    for (const line of lines) {
      const match = line.match(optionRegex);
      if (match) {
        if (currentOption) options.push(currentOption.trim());
        currentOption = match[1] || line.replace(/^(?:[A-D][\.\s]+|\d[\.\s]+|-)/i, '').trim();
      } else {
        if (currentOption) currentOption += ' ' + line;
        else currentOption = line;
      }
    }
    if (currentOption) options.push(currentOption.trim());
  }

  // Fallback Parsing if we don't have exactly 4 options
  if (options.length < 4 && rawOptions) {
    const spaceSplit = rawOptions.split(/\s{2,}|\t/).filter(Boolean);
    if (spaceSplit.length >= 4) {
      options = spaceSplit.map(o => o.replace(/^(?:[A-D][\.\s]+|\d[\.\s]+|-)/i, '').trim());
    }
  }
  
  // Pad or trim to exactly 4 options
  while (options.length < 4) options.push(`Option ${options.length + 1}`);
  options = options.slice(0, 4);

  // 3. Extract Answer
  const answerMatch = cleanBlock.match(/(?:Correct Answer|Answer):\s*([A-D])/i);
  let answerLetter = answerMatch?.[1]?.toUpperCase();

  if (!answerLetter || !['A', 'B', 'C', 'D'].includes(answerLetter)) {
    throw new Error(`Invalid question block: Answer must be A, B, C, or D.\n${cleanBlock.substring(0, 50)}`);
  }

  const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };
  const correctAnswer = options[letterToIndex[answerLetter as 'A' | 'B' | 'C' | 'D']];

  // 4. Extract Difficulty
  const difficultyMatch = cleanBlock.match(/Difficulty:\s*(Easy|Medium|Hard)/i);
  const difficulty = (difficultyMatch?.[1] ? (difficultyMatch[1].charAt(0).toUpperCase() + difficultyMatch[1].slice(1).toLowerCase()) : 'Easy') as 'Easy' | 'Medium' | 'Hard';

  // 5. Extract Explanation
  const explanationMatch = cleanBlock.match(/Explanation:\s*(.+?)(?=\n(?:##|---)|$)/is);
  const explanation = explanationMatch?.[1]?.trim() || '';

  return {
    question,
    options,
    correctAnswer,
    difficulty,
    explanation,
  };
}

/**
 * Main parser: convert markdown to exam object
 */
export function parseExamMarkdown(markdown: string): ParsedExam {
  const { metadata, body } = extractFrontmatter(markdown);

  // Validate required metadata
  const required = ['examId', 'company', 'title', 'duration', 'passingScore'];
  for (const field of required) {
    if (!metadata[field]) {
      throw new Error(`Missing required field in frontmatter: ${field}`);
    }
  }

  // Split questions by --- separator
  const questionBlocks = body
    .split('---')
    .map((block) => block.trim())
    .filter(Boolean);

  if (questionBlocks.length === 0) {
    throw new Error('No questions found in markdown. Expected questions separated by --- markers.');
  }

  // Parse each question
  const questions = questionBlocks.map((block, index) => {
    try {
      return parseQuestion(block);
    } catch (error) {
      throw new Error(`Error parsing question ${index + 1}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  return {
    examId: metadata.examId,
    company: metadata.company,
    title: metadata.title,
    duration: metadata.duration,
    passingScore: metadata.passingScore,
    questions,
  };
}
