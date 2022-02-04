import { Schema } from 'mongoose';
const { v4: uuid } = require('uuid');

export const projectMongooseSchema = new Schema({
  _id: {
    type: String,
    default: uuid
  },
  title: {
    type: String,
    unique: true,
    required: true,
  }
}, {_id: false, versionKey: false });
