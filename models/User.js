/**
 * Created by wangxiaodong on 2017/2/13.
 */

var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);

