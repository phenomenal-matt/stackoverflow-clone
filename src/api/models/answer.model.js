const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const answerSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    question: { type: Schema.Types.ObjectId, ref: 'Question' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Answer', answerSchema);
