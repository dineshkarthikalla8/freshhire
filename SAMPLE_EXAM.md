---
title: "Aptitude Mock Test - Session 1"
examId: tcs-mock-1
company: TCS
description: "Example quiz file for FreshHire import. Use YAML frontmatter `questions` array for structured parsing."
duration_minutes: 60
passing_score: 75
shuffle_questions: false
---

This file uses a YAML frontmatter schema. Parsers should read the `questions` array and import each question object.

questions:
	- id: q1
		type: single
		points: 4
		time_limit_seconds: 60
		difficulty: Easy
		tags: [general-knowledge]
		text: "What is the capital of India?"
		options:
			- label: A
				text: "Mumbai"
			- label: B
				text: "Delhi"
			- label: C
				text: "Chennai"
			- label: D
				text: "Kolkata"
		correct: B
		explanation: "Delhi is the capital of India and serves as the seat of the Indian government."

	- id: q2
		type: single
		points: 3
		time_limit_seconds: 45
		difficulty: Easy
		tags: [arithmetic]
		text: "5 + 7 = ?"
		options:
			- label: A
				text: "10"
			- label: B
				text: "11"
			- label: C
				text: "12"
			- label: D
				text: "13"
		correct: C
		explanation: "Simple arithmetic: 5 + 7 = 12."

	- id: q3
		type: single
		points: 4
		time_limit_seconds: 60
		difficulty: Easy
		tags: [speed-distance]
		text: "If a train travels at 60 km/h for 2 hours, how far does it travel?"
		options:
			- label: A
				text: "60 km"
			- label: B
				text: "90 km"
			- label: C
				text: "120 km"
			- label: D
				text: "150 km"
		correct: C
		explanation: "Distance = Speed × Time = 60 × 2 = 120 km."

	- id: q4
		type: single
		points: 4
		time_limit_seconds: 45
		difficulty: Medium
		tags: [series]
		text: "What is the next number in the series: 2, 4, 8, 16, ?"
		options:
			- label: A
				text: "24"
			- label: B
				text: "28"
			- label: C
				text: "32"
			- label: D
				text: "36"
		correct: C
		explanation: "Each number is double the previous. 16 × 2 = 32."

	- id: q5
		type: single
		points: 5
		time_limit_seconds: 60
		difficulty: Medium
		tags: [percentages]
		text: "A man buys a book for Rs. 100 and sells it for Rs. 150. What is his profit percentage?"
		options:
			- label: A
				text: "25%"
			- label: B
				text: "40%"
			- label: C
				text: "50%"
			- label: D
				text: "75%"
		correct: C
		explanation: "Profit = 150 - 100 = 50. Profit % = (50/100) × 100 = 50%."


---
Parser / Usage Notes

- Format: YAML frontmatter at the top of the file; `questions` is an array of objects.
- Question object fields (recommended):
	- `id` (string, unique)
	- `type` (string) — one of `single`, `multiple`, `short`, `numeric`, `code`
	- `text` (string) — question prompt (Markdown allowed)
	- `options` (array) — for `single`/`multiple`, each option has `label` and `text`
	- `correct` — for `single`: option label (e.g. `B`); for `multiple`: array of labels (e.g. `[A, C]`); for `short`/`numeric`: string/number
	- `explanation` (string) — optional explanation shown after answer
	- `points` (number) — score weight
	- `time_limit_seconds` (number) — optional per-question timer
	- `difficulty` (string) — e.g. Easy/Medium/Hard
	- `tags` (array of strings)

Example parsing summary (JavaScript): read YAML frontmatter, parse `questions`, then render per `type`.

Advantages of this schema:
- Fully structured for reliable parsing and import.
- Supports metadata (timing, scoring, tags).
- Allows Markdown in `text` and `explanation` for rich content.

If you prefer a simpler line-based format (no YAML), say so and I can provide that variant and a small parser function.
