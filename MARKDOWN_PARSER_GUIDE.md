# Markdown Exam Parser Guide

## How to Use the Markdown Exam Parser

### 1. **Create a `.md` file with the strict template format**

The parser expects this exact structure:

```
---
examId: tcs-mock-1
company: TCS
title: Aptitude Mock Test - Session 1
duration: 60
passingScore: 75
---

## Question

Question: What is the capital of India?

A. Mumbai
B. Delhi
C. Chennai
D. Kolkata

Answer: B
Difficulty: Easy
Explanation: Delhi is the capital of India and serves as the seat of the Indian government.

---

## Question

Question: 5 + 7 = ?

A. 10
B. 11
C. 12
D. 13

Answer: C
Difficulty: Easy
Explanation: 5 + 7 = 12.
```

### 2. **Template Requirements**

#### Frontmatter (YAML block between `---`)
- **examId**: Unique identifier (e.g., `tcs-mock-1`)
- **company**: Company name (e.g., `TCS`, `Infosys`, `Wipro`)
- **title**: Exam title (e.g., `Aptitude Mock Test - Session 1`)
- **duration**: Duration in minutes (number)
- **passingScore**: Passing percentage (0-100)

#### Question Format
Each question must have:
- **Question**: The question text (after `Question:`)
- **Options**: Exactly 4 options labeled A, B, C, D
- **Answer**: Single letter (A, B, C, or D)
- **Difficulty**: One of `Easy`, `Medium`, or `Hard`
- **Explanation**: Answer explanation

Questions are separated by `---` on its own line.

### 3. **Steps in Admin Panel**

1. Go to **Admin** → **Company Exams** tab
2. Click the **"Import from Markdown"** section
3. Paste your `.md` file content
4. Click **"Parse Markdown"**
5. Review the preview (shows metadata and question count)
6. Click **"Load & Edit"** to populate the form
7. Make any additional edits if needed
8. Click **"Save Exam"**

### 4. **What Gets Parsed**

The parser extracts:
- ✓ Exam metadata (ID, company, title, duration, passing score)
- ✓ All questions with options
- ✓ Correct answers (A-D format)
- ✓ Difficulty levels
- ✓ Explanations

### 5. **Error Handling**

If parsing fails, you'll see an error message. Common issues:

| Issue | Fix |
|-------|-----|
| "Invalid markdown format" | Make sure YAML is between `---` markers |
| "Missing required field" | Check frontmatter has examId, company, title, duration, passingScore |
| "No questions found" | Ensure questions are separated by `---` |
| "missing options" | Each question needs A, B, C, D options |
| "Answer must be A, B, C, or D" | Correct Answer field must be single letter |

### 6. **Example Workflows**

#### From PDF Placement Paper
1. Extract questions from PDF/placement paper
2. Format in markdown template
3. Paste in admin panel
4. Parse and save

#### Batch Import
1. Create one `.md` file per company
2. Parse each into admin panel
3. Save to create multiple exams quickly

#### Student Testing
1. Students navigate to Company Exams
2. Select exam and start
3. Timer counts down
4. Submit and see results
5. Review answers with explanations

## Sample Markdown File

See `SAMPLE_EXAM.md` in the project root for a working example with 5 questions.

---

**Built for FreshHire** - Streamline placement preparation with strict markdown parsing.
