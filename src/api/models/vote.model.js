const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const voteSchema = new Schema(
  {
    value: {
      type: Number,
      enum: [1, -1],
      required: true
    },
    voter: { type: Schema.Types.ObjectId, ref: 'User' },
    question: { type: Schema.Types.ObjectId, ref: 'Question' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Vote', voteSchema);
