const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini SDK lazily inside the routes 
// to ensure process.env.GEMINI_API_KEY is read correctly.
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]+/g, '').trim() : '';
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

router.post('/generate-questions', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    const { targetCompany, targetRole } = req.body;
    let resumeText = '';

    if (req.file) {
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text;
    } else {
      resumeText = req.body.resumeText || 'No resume provided.';
    }

    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]+/g, '').trim() : '';

    if (!apiKey) {
      // Mock mode fallback if no API key is provided
      console.log('No GEMINI_API_KEY found, returning mock data.');
      return res.json({
        questions: [
          `Mock Q: How would you design a system for ${targetCompany}?`,
          `Mock Q: What are your strengths for the ${targetRole} role?`,
          `Mock Q: Explain a complex project from your resume.`
        ]
      });
    }

    const prompt = `You are an expert technical interviewer for ${targetCompany} hiring for the role of ${targetRole}. 
Given the following resume text from a candidate, generate exactly 3 challenging interview questions. 
Return ONLY the questions formatted as a JSON array of strings. Do not include markdown formatting or the \`\`\`json block, just return the raw JSON array representing the strings.
Resume Text:
${resumeText.substring(0, 3000)}`;

    const ai = getAI();
    if (!ai) {
      throw new Error("AI could not be initialized");
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const output = response.text.trim();
    let questions;
    try {
      questions = JSON.parse(output);
    } catch (e) {
      // Fallback if AI didn't return perfect JSON
      questions = output.split('\n').filter(q => q.trim().length > 0).slice(0, 3);
    }

    res.json({ questions });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

router.post('/evaluate', authenticateToken, async (req, res) => {
  try {
    const { targetCompany, targetRole, qaPairs } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]+/g, '').trim() : '';

    if (!apiKey) {
      return res.json({
        score: 75,
        strengths: "Good basic understanding.",
        improvements: "Need to provide more concrete examples.",
        roadmap: [
          { title: "Day 1-2: Core Concepts", desc: "Revise technical fundamentals." },
          { title: "Day 3-5: Problem Solving", desc: "Practice coding questions." },
          { title: "Day 6-7: HR Prep", desc: "Prepare behavioral answers." }
        ]
      });
    }

    const prompt = `You are evaluating a candidate for ${targetCompany} as a ${targetRole}. 
Here are the questions and the candidate's answers:
${JSON.stringify(qaPairs)}

Provide an evaluation in EXACTLY the following JSON format without any markdown wrappers or text:
{
  "score": <number between 0-100>,
  "strengths": "<short paragraph>",
  "improvements": "<short paragraph>",
  "roadmap": [
    { "title": "Day 1-2: ...", "desc": "..." },
    { "title": "Day 3-5: ...", "desc": "..." },
    { "title": "Day 6-7: ...", "desc": "..." }
  ]
}`;

    const ai = getAI();
    if (!ai) {
      throw new Error("AI could not be initialized");
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const output = response.text.trim();
    const evaluation = JSON.parse(output);

    res.json(evaluation);
  } catch (error) {
    console.error('AI Evaluation Error:', error);
    res.status(500).json({ error: 'Failed to evaluate answers' });
  }
});

module.exports = router;
