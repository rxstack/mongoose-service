import { Schema } from 'mongoose';
const uuid = require('uuid/v4');

export const taskMongooseSchema = new Schema({
  _id: {
    type: String,
    default: uuid
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false,
    required: false
  }
}, {_id: false, versionKey: false });