var mongoose = require('mongoose');

var Question = require('../models/question').Question;
var request = require('request');
var ObjectId= mongoose.Types.ObjectId;

/*-------------- NEEDS ------------------ */
/*
- Create Question
- Delete Question
- Edit Question

- Fetch all questions
- Fetch question by type
- Fetch question by ID
- Fetch question by page
*/

/*
 * fetch all questions
 * @return list of questions
 */

exports.fetch_all_questions= function(req, res) {
    Question.find( {'status': 'active'}, 
        function(err, questions) {
            res.send(questions);
        });
};


/*
 * fetch question by id
 * @return question
 */

exports.fetch_question_by_id = function(req, res) {
    Question.findById(req.params.id, function(err, question) {
        if(err) {
            res.send(404);
        } else {
            res.send(question);
        }
    });
};

/*
 * fetch question by type
 * @return question
 */

exports.fetch_question_by_type = function(req, res) {
    Question.findOne({ 'question_type' :  req.params.question_type }, function(err, question) {
        if(err) {
            res.send(404);
        } else {
            res.send(question);
        }
    });
};

/*
 * fetch question by page
 * @return question
 */

exports.fetch_question_by_page = function(req, res) {
    Question.findOne({ 'question_page' :  req.params.question_page }, function(err, question) {
        if(err) {
            res.send(404);
        } else {
            res.send(question);
        }
    });
};

/*
 * fetch question by status
 * @return question
 */

exports.fetch_question_by_status = function(req, res) {
    Question.findOne({ 'question_status' :  req.params.question_status }, function(err, question) {
        if(err) {
            res.send(404);
        } else {
            res.send(question);
        }
    });
};

/*
 * Update the question in question
 */

exports.update_question = function(req, res) { 
    Question.findById(req.params.id, function(err, question) {
        question.question_page = req.body.question_page;
        question.question_type = req.body.question_type;
        question.question_status = req.body.question_status;
        question.content = req.body.content;
        question.weight = req.body.weight;

        question.save();

        if(err) {
            res.send(404);
        } else {
            res.redirect('/admin_applications');
        }
    }); 
};


/*
 * Create question
 */

exports.create_question = function(req, res) {
    var question = new Question({
        question_page: req.body.question_page,
        question_type: req.question_type,
        question_status: req.body.question_status,
        content: req.body.content,
        weight: req.body.weight
    });

    question.save(function(err, question) {
        if(err) {console.log(err);}
        else {
            res.redirect('/admin_questions');
        }
    });
};
