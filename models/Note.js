const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(moongoose);

const noteSchema = new moongoose.Schema(
  {
    user: {
      type: moongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

noteSchema.plugin(AutoIncrement, {
  inc_filed: 'ticket',
  id: 'ticketNums',
  start_seq: 500,
});

module.exports = mongoose.model('Note', noteSchema);
