const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    subscribe: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
    voteCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Question', questionSchema);
