const multer = require('multer');
const pdfParse = require('pdf-parse');

const upload = multer({ storage: multer.memoryStorage() });

function registerResumeRoutes(app) {
  app.post('/extract-text', upload.single('file'), async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: 'file_missing' });
      }

      const parsed = await pdfParse(req.file.buffer);
      const text = (parsed.text || '').replace(/\s+\n/g, '\n').trim();

      return res.json({
        text,
        pages: parsed.numpages || 0,
        info: parsed.info || {},
      });
    } catch (err) {
      console.error('extract-text error', err);
      return res.status(500).json({ error: 'extract_failed' });
    }
  });
}

module.exports = registerResumeRoutes;