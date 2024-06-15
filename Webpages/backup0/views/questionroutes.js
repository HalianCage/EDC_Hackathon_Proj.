const express = require('express');
const router = express.Router();
const Question = require('../models/Question');


// POST route to handle posting a question
router.post('/post-question', async (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.session.user || !req.session.user.username) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { question, answer } = req.body;
        const username = req.session.user.username;

        // Create a new question with initial answer if provided
        const newQuestion = new Question({
            question,
            username,
            answers: answer ? [{ answer }] : []
        });

        await newQuestion.save();
        res.redirect('/forum');
    } catch (err) {
        console.error('Error posting question:', err);
        res.status(500).json({ error: 'Failed to post question' });
    }
});

// // POST route to handle posting an answer to a question
// router.post('/post-answer/:questionId', async (req, res) => {
//     try {
//         const { questionId } = req.params;
//         const { answer } = req.body;

//         // Find the question by ID and push the new answer to the answers array
//         const question = await Question.findById(questionId);
//         if (!question) {
//             return res.status(404).json({ error: 'Question not found' });
//         }

//         question.answers.push({ answer });
//         await question.save();

//         res.json({ success: 'Answer posted successfully' });
//     } catch (err) {
//         console.error('Error posting answer:', err);
//         res.status(500).json({ error: 'Failed to post answer' });
//     }
// });

module.exports = router;
