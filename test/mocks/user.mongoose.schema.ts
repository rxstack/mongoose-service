import { Schema } from 'mongoose';
import {User} from './user';

const uuid = require('uuid/v4');

export const userMongooseSchema = new Schema<User>({
  _id: { type: String, default: uuid },
  username: { type: String, unique: true, required: true},
  password: { type: String, required: true},
  roles: [{ type: String, required: true}],
}, {_id: false, versionKey: false });