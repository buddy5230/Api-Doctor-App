const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchemaVac = new Schema(
  {
    iduser: {
      type: String,
    },
    hospital: {
      type: String,
    },
    numvac: {
      type: Number,
    },
    vac: {
      type: String,
    },
    daypoint: {
      type: String,
    },
    timepoint: {
      type: String,
    },
    symtomps: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { versionKey: false, collection: 'vaccines' }
);

module.exports = mongoose.model('vaccines', userSchemaVac);
