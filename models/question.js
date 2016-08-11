var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  question_page: {
    type: String
    enum: ['register', 'evaluation']
  },
  question_type: {
    type: String
    enum: ['text', 'rank']
  },
  question_status: { type: Boolean },
  content: { type: String, required: [true, 'Why is this question not set?'] },
  weight: { type: Number, required: [true, 0] }
});

var question = mongoose.model("Question", QuestionSchema);

module.exports = {
	Question : question
};
