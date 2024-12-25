const express = require('express');
const Student = require('../../Model/Student');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const upload = multer({ dest: '/tmp' });

router.post('/student', upload.single('file'), async (req, res) => {

    // Check if user is authorized
    const authToken = req.header('authToken');
    if (!authToken) {
        return res.status(401).json({ message: 'Access denied!', success: false });
    }

    // Verify the token
    let payload;
    try {
        payload = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', success: false });
    }

    // Check if file is uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded', success: false });
    }

    const filePath = req.file.path;
    const results = [];

    try {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    // Filter out empty objects
                    const validResults = results.filter(
                        (item) => Object.keys(item).length > 0
                    );

                    console.log(results);
                    await Student.insertMany(results);
                    res.json({ message: 'Data successfully imported', success: true });
                } catch (error) {
                    res.status(500).json({ message: 'Error importing data', error, success: false });
                } finally {
                    fs.unlinkSync(filePath);
                }
            });
    } catch (error) {
        res.status(500).json({ message: 'Error reading file', error, success: false });
    }
});

module.exports = router;
