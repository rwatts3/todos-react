var require = meteorInstall({"imports":{"api":{"lists":{"server":{"publications.js":["meteor/meteor","../lists.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/lists/server/publications.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Lists;module.import('../lists.js',{"Lists":function(v){Lists=v}});/* eslint-disable prefer-arrow-callback */
                                                                                                                      //
                                                                                                                      // 3
                                                                                                                      //
                                                                                                                      // 5
                                                                                                                      //
Meteor.publish('lists.public', function listsPublic() {                                                               // 7
  return Lists.find({                                                                                                 // 8
    userId: { $exists: false }                                                                                        // 9
  }, {                                                                                                                // 8
    fields: Lists.publicFields                                                                                        // 11
  });                                                                                                                 // 10
});                                                                                                                   // 13
                                                                                                                      //
Meteor.publish('lists.private', function listsPrivate() {                                                             // 15
  if (!this.userId) {                                                                                                 // 16
    return this.ready();                                                                                              // 17
  }                                                                                                                   // 18
                                                                                                                      //
  return Lists.find({                                                                                                 // 20
    userId: this.userId                                                                                               // 21
  }, {                                                                                                                // 20
    fields: Lists.publicFields                                                                                        // 23
  });                                                                                                                 // 22
});                                                                                                                   // 25
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"lists.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","meteor/mongo","meteor/aldeed:simple-schema","meteor/factory","../todos/todos.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/lists/lists.js                                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({Lists:function(){return Lists}});var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});var SimpleSchema;module.import('meteor/aldeed:simple-schema',{"SimpleSchema":function(v){SimpleSchema=v}});var Factory;module.import('meteor/factory',{"Factory":function(v){Factory=v}});var Todos;module.import('../todos/todos.js',{"Todos":function(v){Todos=v}});
                                                                                                                      //
                                                                                                                      //
                                                                                                                      // 1
                                                                                                                      // 2
                                                                                                                      // 3
                                                                                                                      // 4
                                                                                                                      //
var ListsCollection = function (_Mongo$Collection) {                                                                  //
  _inherits(ListsCollection, _Mongo$Collection);                                                                      //
                                                                                                                      //
  function ListsCollection() {                                                                                        //
    _classCallCheck(this, ListsCollection);                                                                           //
                                                                                                                      //
    return _possibleConstructorReturn(this, _Mongo$Collection.apply(this, arguments));                                //
  }                                                                                                                   //
                                                                                                                      //
  ListsCollection.prototype.insert = function insert(list, callback) {                                                //
    var ourList = list;                                                                                               // 8
    if (!ourList.name) {                                                                                              // 9
      var nextLetter = 'A';                                                                                           // 10
      ourList.name = 'List ' + nextLetter;                                                                            // 11
                                                                                                                      //
      while (!!this.findOne({ name: ourList.name })) {                                                                // 13
        // not going to be too smart here, can go past Z                                                              //
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);                                               // 15
        ourList.name = 'List ' + nextLetter;                                                                          // 16
      }                                                                                                               // 17
    }                                                                                                                 // 18
                                                                                                                      //
    return _Mongo$Collection.prototype.insert.call(this, ourList, callback);                                          // 20
  };                                                                                                                  // 21
                                                                                                                      //
  ListsCollection.prototype.remove = function remove(selector, callback) {                                            //
    Todos.remove({ listId: selector });                                                                               // 23
    return _Mongo$Collection.prototype.remove.call(this, selector, callback);                                         // 24
  };                                                                                                                  // 25
                                                                                                                      //
  return ListsCollection;                                                                                             //
}(Mongo.Collection);                                                                                                  //
                                                                                                                      //
var Lists = new ListsCollection('Lists');                                                                             // 28
                                                                                                                      //
// Deny all client-side updates since we will be using methods to manage this collection                              //
Lists.deny({                                                                                                          // 31
  insert: function insert() {                                                                                         // 32
    return true;                                                                                                      // 32
  },                                                                                                                  // 32
  update: function update() {                                                                                         // 33
    return true;                                                                                                      // 33
  },                                                                                                                  // 33
  remove: function remove() {                                                                                         // 34
    return true;                                                                                                      // 34
  }                                                                                                                   // 34
});                                                                                                                   // 31
                                                                                                                      //
Lists.schema = new SimpleSchema({                                                                                     // 37
  name: { type: String },                                                                                             // 38
  incompleteCount: { type: Number, defaultValue: 0 },                                                                 // 39
  userId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true }                                              // 40
});                                                                                                                   // 37
                                                                                                                      //
Lists.attachSchema(Lists.schema);                                                                                     // 43
                                                                                                                      //
// This represents the keys from Lists objects that should be published                                               //
// to the client. If we add secret properties to List objects, don't list                                             //
// them here to keep them private to the server.                                                                      //
Lists.publicFields = {                                                                                                // 48
  name: 1,                                                                                                            // 49
  incompleteCount: 1,                                                                                                 // 50
  userId: 1                                                                                                           // 51
};                                                                                                                    // 48
                                                                                                                      //
Factory.define('list', Lists, {});                                                                                    // 54
                                                                                                                      //
Lists.helpers({                                                                                                       // 56
  // A list is considered to be private if it has a userId set                                                        //
                                                                                                                      //
  isPrivate: function isPrivate() {                                                                                   // 58
    return !!this.userId;                                                                                             // 59
  },                                                                                                                  // 60
  isLastPublicList: function isLastPublicList() {                                                                     // 61
    var publicListCount = Lists.find({ userId: { $exists: false } }).count();                                         // 62
    return !this.isPrivate() && publicListCount === 1;                                                                // 63
  },                                                                                                                  // 64
  editableBy: function editableBy(userId) {                                                                           // 65
    if (!this.userId) {                                                                                               // 66
      return true;                                                                                                    // 67
    }                                                                                                                 // 68
                                                                                                                      //
    return this.userId === userId;                                                                                    // 70
  },                                                                                                                  // 71
  todos: function todos() {                                                                                           // 72
    return Todos.find({ listId: this._id }, { sort: { createdAt: -1 } });                                             // 73
  }                                                                                                                   // 74
});                                                                                                                   // 56
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"methods.js":["meteor/meteor","meteor/mdg:validated-method","meteor/aldeed:simple-schema","meteor/ddp-rate-limiter","meteor/underscore","./lists.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/lists/methods.js                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({insert:function(){return insert},makePrivate:function(){return makePrivate},makePublic:function(){return makePublic},updateName:function(){return updateName},remove:function(){return remove}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var ValidatedMethod;module.import('meteor/mdg:validated-method',{"ValidatedMethod":function(v){ValidatedMethod=v}});var SimpleSchema;module.import('meteor/aldeed:simple-schema',{"SimpleSchema":function(v){SimpleSchema=v}});var DDPRateLimiter;module.import('meteor/ddp-rate-limiter',{"DDPRateLimiter":function(v){DDPRateLimiter=v}});var _;module.import('meteor/underscore',{"_":function(v){_=v}});var Lists;module.import('./lists.js',{"Lists":function(v){Lists=v}});
                                                                                                                      // 2
                                                                                                                      // 3
                                                                                                                      // 4
                                                                                                                      // 5
                                                                                                                      //
                                                                                                                      // 7
                                                                                                                      //
var LIST_ID_ONLY = new SimpleSchema({                                                                                 // 9
  listId: { type: String }                                                                                            // 10
}).validator();                                                                                                       // 9
                                                                                                                      //
var insert = new ValidatedMethod({                                                                                    // 13
  name: 'lists.insert',                                                                                               // 14
  validate: new SimpleSchema({}).validator(),                                                                         // 15
  run: function run() {                                                                                               // 16
    return Lists.insert({});                                                                                          // 17
  }                                                                                                                   // 18
});                                                                                                                   // 13
                                                                                                                      //
var makePrivate = new ValidatedMethod({                                                                               // 21
  name: 'lists.makePrivate',                                                                                          // 22
  validate: LIST_ID_ONLY,                                                                                             // 23
  run: function run(_ref) {                                                                                           // 24
    var listId = _ref.listId;                                                                                         // 24
                                                                                                                      //
    if (!this.userId) {                                                                                               // 25
      throw new Meteor.Error('lists.makePrivate.notLoggedIn', 'Must be logged in to make private lists.');            // 26
    }                                                                                                                 // 28
                                                                                                                      //
    var list = Lists.findOne(listId);                                                                                 // 30
                                                                                                                      //
    if (list.isLastPublicList()) {                                                                                    // 32
      throw new Meteor.Error('lists.makePrivate.lastPublicList', 'Cannot make the last public list private.');        // 33
    }                                                                                                                 // 35
                                                                                                                      //
    Lists.update(listId, {                                                                                            // 37
      $set: { userId: this.userId }                                                                                   // 38
    });                                                                                                               // 37
  }                                                                                                                   // 40
});                                                                                                                   // 21
                                                                                                                      //
var makePublic = new ValidatedMethod({                                                                                // 43
  name: 'lists.makePublic',                                                                                           // 44
  validate: LIST_ID_ONLY,                                                                                             // 45
  run: function run(_ref2) {                                                                                          // 46
    var listId = _ref2.listId;                                                                                        // 46
                                                                                                                      //
    if (!this.userId) {                                                                                               // 47
      throw new Meteor.Error('lists.makePublic.notLoggedIn', 'Must be logged in.');                                   // 48
    }                                                                                                                 // 50
                                                                                                                      //
    var list = Lists.findOne(listId);                                                                                 // 52
                                                                                                                      //
    if (!list.editableBy(this.userId)) {                                                                              // 54
      throw new Meteor.Error('lists.makePublic.accessDenied', 'You don\'t have permission to edit this list.');       // 55
    }                                                                                                                 // 57
                                                                                                                      //
    // XXX:40 the security check above is not atomic, so in theory a race condition could                             //
    // result in exposing private data                                                                                //
    Lists.update(listId, {                                                                                            // 61
      $unset: { userId: true }                                                                                        // 62
    });                                                                                                               // 61
  }                                                                                                                   // 64
});                                                                                                                   // 43
                                                                                                                      //
var updateName = new ValidatedMethod({                                                                                // 67
  name: 'lists.updateName',                                                                                           // 68
  validate: new SimpleSchema({                                                                                        // 69
    listId: { type: String },                                                                                         // 70
    newName: { type: String }                                                                                         // 71
  }).validator(),                                                                                                     // 69
  run: function run(_ref3) {                                                                                          // 73
    var listId = _ref3.listId;                                                                                        // 73
    var newName = _ref3.newName;                                                                                      // 73
                                                                                                                      //
    var list = Lists.findOne(listId);                                                                                 // 74
                                                                                                                      //
    if (!list.editableBy(this.userId)) {                                                                              // 76
      throw new Meteor.Error('lists.updateName.accessDenied', 'You don\'t have permission to edit this list.');       // 77
    }                                                                                                                 // 79
                                                                                                                      //
    // XXX:50 the security check above is not atomic, so in theory a race condition could                             //
    // result in exposing private data                                                                                //
                                                                                                                      //
    Lists.update(listId, {                                                                                            // 84
      $set: { name: newName }                                                                                         // 85
    });                                                                                                               // 84
  }                                                                                                                   // 87
});                                                                                                                   // 67
                                                                                                                      //
var remove = new ValidatedMethod({                                                                                    // 90
  name: 'lists.remove',                                                                                               // 91
  validate: LIST_ID_ONLY,                                                                                             // 92
  run: function run(_ref4) {                                                                                          // 93
    var listId = _ref4.listId;                                                                                        // 93
                                                                                                                      //
    var list = Lists.findOne(listId);                                                                                 // 94
                                                                                                                      //
    if (!list.editableBy(this.userId)) {                                                                              // 96
      throw new Meteor.Error('lists.remove.accessDenied', 'You don\'t have permission to remove this list.');         // 97
    }                                                                                                                 // 99
                                                                                                                      //
    // XXX:60 the security check above is not atomic, so in theory a race condition could                             //
    // result in exposing private data                                                                                //
                                                                                                                      //
    if (list.isLastPublicList()) {                                                                                    // 104
      throw new Meteor.Error('lists.remove.lastPublicList', 'Cannot delete the last public list.');                   // 105
    }                                                                                                                 // 107
                                                                                                                      //
    Lists.remove(listId);                                                                                             // 109
  }                                                                                                                   // 110
});                                                                                                                   // 90
                                                                                                                      //
// Get list of all method names on Lists                                                                              //
var LISTS_METHODS = _.pluck([insert, makePublic, makePrivate, updateName, remove], 'name');                           // 114
                                                                                                                      //
if (Meteor.isServer) {                                                                                                // 122
  // Only allow 5 list operations per connection per second                                                           //
  DDPRateLimiter.addRule({                                                                                            // 124
    name: function name(_name) {                                                                                      // 125
      return _.contains(LISTS_METHODS, _name);                                                                        // 126
    },                                                                                                                // 127
                                                                                                                      //
                                                                                                                      //
    // Rate limit per connection ID                                                                                   //
    connectionId: function connectionId() {                                                                           // 130
      return true;                                                                                                    // 130
    }                                                                                                                 // 130
  }, 5, 1000);                                                                                                        // 124
}                                                                                                                     // 132
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"todos":{"server":{"publications.js":["meteor/meteor","meteor/aldeed:simple-schema","../todos.js","../../lists/lists.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/todos/server/publications.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var SimpleSchema;module.import('meteor/aldeed:simple-schema',{"SimpleSchema":function(v){SimpleSchema=v}});var Todos;module.import('../todos.js',{"Todos":function(v){Todos=v}});var Lists;module.import('../../lists/lists.js',{"Lists":function(v){Lists=v}});/* eslint-disable prefer-arrow-callback */
                                                                                                                      //
                                                                                                                      // 3
                                                                                                                      // 4
                                                                                                                      //
                                                                                                                      // 6
                                                                                                                      // 7
                                                                                                                      //
Meteor.publishComposite('todos.inList', function todosInList(listId) {                                                // 9
  new SimpleSchema({                                                                                                  // 10
    listId: { type: String }                                                                                          // 11
  }).validate({ listId: listId });                                                                                    // 10
                                                                                                                      //
  var userId = this.userId;                                                                                           // 14
                                                                                                                      //
  return {                                                                                                            // 16
    find: function find() {                                                                                           // 17
      var query = {                                                                                                   // 18
        _id: listId,                                                                                                  // 19
        $or: [{ userId: { $exists: false } }, { userId: userId }]                                                     // 20
      };                                                                                                              // 18
                                                                                                                      //
      // We only need the _id field in this query, since it's only                                                    //
      // used to drive the child queries to get the todos                                                             //
      var options = {                                                                                                 // 25
        fields: { _id: 1 }                                                                                            // 26
      };                                                                                                              // 25
                                                                                                                      //
      return Lists.find(query, options);                                                                              // 29
    },                                                                                                                // 30
                                                                                                                      //
                                                                                                                      //
    children: [{                                                                                                      // 32
      find: function find(list) {                                                                                     // 33
        return Todos.find({ listId: list._id }, { fields: Todos.publicFields });                                      // 34
      }                                                                                                               // 35
    }]                                                                                                                // 32
  };                                                                                                                  // 16
});                                                                                                                   // 38
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"incompleteCountDenormalizer.js":["meteor/underscore","meteor/check","./todos.js","../lists/lists.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/todos/incompleteCountDenormalizer.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _;module.import('meteor/underscore',{"_":function(v){_=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});var Todos;module.import('./todos.js',{"Todos":function(v){Todos=v}});var Lists;module.import('../lists/lists.js',{"Lists":function(v){Lists=v}});
                                                                                                                      // 2
                                                                                                                      //
                                                                                                                      // 4
                                                                                                                      // 5
                                                                                                                      //
var incompleteCountDenormalizer = {                                                                                   // 7
  _updateList: function _updateList(listId) {                                                                         // 8
    // Recalculate the correct incomplete count direct from MongoDB                                                   //
    var incompleteCount = Todos.find({                                                                                // 10
      listId: listId,                                                                                                 // 11
      checked: false                                                                                                  // 12
    }).count();                                                                                                       // 10
                                                                                                                      //
    Lists.update(listId, { $set: { incompleteCount: incompleteCount } });                                             // 15
  },                                                                                                                  // 16
  afterInsertTodo: function afterInsertTodo(todo) {                                                                   // 17
    this._updateList(todo.listId);                                                                                    // 18
  },                                                                                                                  // 19
  afterUpdateTodo: function afterUpdateTodo(selector, modifier) {                                                     // 20
    var _this = this;                                                                                                 // 20
                                                                                                                      //
    // We only support very limited operations on todos                                                               //
    check(modifier, { $set: Object });                                                                                // 22
                                                                                                                      //
    // We can only deal with $set modifiers, but that's all we do in this app                                         //
    if (_.has(modifier.$set, 'checked')) {                                                                            // 25
      Todos.find(selector, { fields: { listId: 1 } }).forEach(function (todo) {                                       // 26
        _this._updateList(todo.listId);                                                                               // 27
      });                                                                                                             // 28
    }                                                                                                                 // 29
  },                                                                                                                  // 30
                                                                                                                      //
  // Here we need to take the list of todos being removed, selected *before* the update                               //
  // because otherwise we can't figure out the relevant list id(s) (if the todo has been deleted)                     //
  afterRemoveTodos: function afterRemoveTodos(todos) {                                                                // 33
    var _this2 = this;                                                                                                // 33
                                                                                                                      //
    todos.forEach(function (todo) {                                                                                   // 34
      return _this2._updateList(todo.listId);                                                                         // 34
    });                                                                                                               // 34
  }                                                                                                                   // 35
};                                                                                                                    // 7
                                                                                                                      //
module.export("default",exports.default=(incompleteCountDenormalizer));                                               // 38
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"methods.js":["meteor/meteor","meteor/underscore","meteor/mdg:validated-method","meteor/aldeed:simple-schema","meteor/ddp-rate-limiter","./todos.js","../lists/lists.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/todos/methods.js                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({insert:function(){return insert},setCheckedStatus:function(){return setCheckedStatus},updateText:function(){return updateText},remove:function(){return remove}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var _;module.import('meteor/underscore',{"_":function(v){_=v}});var ValidatedMethod;module.import('meteor/mdg:validated-method',{"ValidatedMethod":function(v){ValidatedMethod=v}});var SimpleSchema;module.import('meteor/aldeed:simple-schema',{"SimpleSchema":function(v){SimpleSchema=v}});var DDPRateLimiter;module.import('meteor/ddp-rate-limiter',{"DDPRateLimiter":function(v){DDPRateLimiter=v}});var Todos;module.import('./todos.js',{"Todos":function(v){Todos=v}});var Lists;module.import('../lists/lists.js',{"Lists":function(v){Lists=v}});
                                                                                                                      // 2
                                                                                                                      // 3
                                                                                                                      // 4
                                                                                                                      // 5
                                                                                                                      //
                                                                                                                      // 7
                                                                                                                      // 8
                                                                                                                      //
var insert = new ValidatedMethod({                                                                                    // 10
  name: 'todos.insert',                                                                                               // 11
  validate: new SimpleSchema({                                                                                        // 12
    listId: { type: String },                                                                                         // 13
    text: { type: String }                                                                                            // 14
  }).validator(),                                                                                                     // 12
  run: function run(_ref) {                                                                                           // 16
    var listId = _ref.listId;                                                                                         // 16
    var text = _ref.text;                                                                                             // 16
                                                                                                                      //
    var list = Lists.findOne(listId);                                                                                 // 17
                                                                                                                      //
    if (list.isPrivate() && list.userId !== this.userId) {                                                            // 19
      throw new Meteor.Error('todos.insert.accessDenied', 'Cannot add todos to a private list that is not yours');    // 20
    }                                                                                                                 // 22
                                                                                                                      //
    var todo = {                                                                                                      // 24
      listId: listId,                                                                                                 // 25
      text: text,                                                                                                     // 26
      checked: false,                                                                                                 // 27
      createdAt: new Date()                                                                                           // 28
    };                                                                                                                // 24
                                                                                                                      //
    Todos.insert(todo);                                                                                               // 31
  }                                                                                                                   // 32
});                                                                                                                   // 10
                                                                                                                      //
var setCheckedStatus = new ValidatedMethod({                                                                          // 35
  name: 'todos.makeChecked',                                                                                          // 36
  validate: new SimpleSchema({                                                                                        // 37
    todoId: { type: String },                                                                                         // 38
    newCheckedStatus: { type: Boolean }                                                                               // 39
  }).validator(),                                                                                                     // 37
  run: function run(_ref2) {                                                                                          // 41
    var todoId = _ref2.todoId;                                                                                        // 41
    var newCheckedStatus = _ref2.newCheckedStatus;                                                                    // 41
                                                                                                                      //
    var todo = Todos.findOne(todoId);                                                                                 // 42
                                                                                                                      //
    if (todo.checked === newCheckedStatus) {                                                                          // 44
      // The status is already what we want, let's not do any extra work                                              //
      return;                                                                                                         // 46
    }                                                                                                                 // 47
                                                                                                                      //
    if (!todo.editableBy(this.userId)) {                                                                              // 49
      throw new Meteor.Error('todos.setCheckedStatus.accessDenied', 'Cannot edit checked status in a private list that is not yours');
    }                                                                                                                 // 52
                                                                                                                      //
    Todos.update(todoId, { $set: {                                                                                    // 54
        checked: newCheckedStatus                                                                                     // 55
      } });                                                                                                           // 54
  }                                                                                                                   // 57
});                                                                                                                   // 35
                                                                                                                      //
var updateText = new ValidatedMethod({                                                                                // 60
  name: 'todos.updateText',                                                                                           // 61
  validate: new SimpleSchema({                                                                                        // 62
    todoId: { type: String },                                                                                         // 63
    newText: { type: String }                                                                                         // 64
  }).validator(),                                                                                                     // 62
  run: function run(_ref3) {                                                                                          // 66
    var todoId = _ref3.todoId;                                                                                        // 66
    var newText = _ref3.newText;                                                                                      // 66
                                                                                                                      //
    // This is complex auth stuff - perhaps denormalizing a userId onto todos                                         //
    // would be correct here?                                                                                         //
    var todo = Todos.findOne(todoId);                                                                                 // 69
                                                                                                                      //
    if (!todo.editableBy(this.userId)) {                                                                              // 71
      throw new Meteor.Error('todos.updateText.accessDenied', 'Cannot edit todos in a private list that is not yours');
    }                                                                                                                 // 74
                                                                                                                      //
    Todos.update(todoId, {                                                                                            // 76
      $set: { text: newText }                                                                                         // 77
    });                                                                                                               // 76
  }                                                                                                                   // 79
});                                                                                                                   // 60
                                                                                                                      //
var remove = new ValidatedMethod({                                                                                    // 82
  name: 'todos.remove',                                                                                               // 83
  validate: new SimpleSchema({                                                                                        // 84
    todoId: { type: String }                                                                                          // 85
  }).validator(),                                                                                                     // 84
  run: function run(_ref4) {                                                                                          // 87
    var todoId = _ref4.todoId;                                                                                        // 87
                                                                                                                      //
    var todo = Todos.findOne(todoId);                                                                                 // 88
                                                                                                                      //
    if (!todo.editableBy(this.userId)) {                                                                              // 90
      throw new Meteor.Error('todos.remove.accessDenied', 'Cannot remove todos in a private list that is not yours');
    }                                                                                                                 // 93
                                                                                                                      //
    Todos.remove(todoId);                                                                                             // 95
  }                                                                                                                   // 96
});                                                                                                                   // 82
                                                                                                                      //
// Get list of all method names on Todos                                                                              //
var TODOS_METHODS = _.pluck([insert, setCheckedStatus, updateText, remove], 'name');                                  // 100
                                                                                                                      //
if (Meteor.isServer) {                                                                                                // 107
  // Only allow 5 todos operations per connection per second                                                          //
  DDPRateLimiter.addRule({                                                                                            // 109
    name: function name(_name) {                                                                                      // 110
      return _.contains(TODOS_METHODS, _name);                                                                        // 111
    },                                                                                                                // 112
                                                                                                                      //
                                                                                                                      //
    // Rate limit per connection ID                                                                                   //
    connectionId: function connectionId() {                                                                           // 115
      return true;                                                                                                    // 115
    }                                                                                                                 // 115
  }, 5, 1000);                                                                                                        // 109
}                                                                                                                     // 117
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"todos.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","meteor/mongo","meteor/factory","faker","./incompleteCountDenormalizer.js","meteor/aldeed:simple-schema","../lists/lists.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/todos/todos.js                                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({Todos:function(){return Todos}});var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});var Factory;module.import('meteor/factory',{"Factory":function(v){Factory=v}});var faker;module.import('faker',{"default":function(v){faker=v}});var incompleteCountDenormalizer;module.import('./incompleteCountDenormalizer.js',{"default":function(v){incompleteCountDenormalizer=v}});var SimpleSchema;module.import('meteor/aldeed:simple-schema',{"SimpleSchema":function(v){SimpleSchema=v}});var Lists;module.import('../lists/lists.js',{"Lists":function(v){Lists=v}});
                                                                                                                      //
                                                                                                                      //
                                                                                                                      // 1
                                                                                                                      // 2
                                                                                                                      // 3
                                                                                                                      //
                                                                                                                      // 5
                                                                                                                      // 6
                                                                                                                      // 7
                                                                                                                      //
var TodosCollection = function (_Mongo$Collection) {                                                                  //
  _inherits(TodosCollection, _Mongo$Collection);                                                                      //
                                                                                                                      //
  function TodosCollection() {                                                                                        //
    _classCallCheck(this, TodosCollection);                                                                           //
                                                                                                                      //
    return _possibleConstructorReturn(this, _Mongo$Collection.apply(this, arguments));                                //
  }                                                                                                                   //
                                                                                                                      //
  TodosCollection.prototype.insert = function insert(doc, callback) {                                                 //
    var ourDoc = doc;                                                                                                 // 11
    ourDoc.createdAt = ourDoc.createdAt || new Date();                                                                // 12
    var result = _Mongo$Collection.prototype.insert.call(this, ourDoc, callback);                                     // 13
    incompleteCountDenormalizer.afterInsertTodo(ourDoc);                                                              // 14
    return result;                                                                                                    // 15
  };                                                                                                                  // 16
                                                                                                                      //
  TodosCollection.prototype.update = function update(selector, modifier) {                                            //
    var result = _Mongo$Collection.prototype.update.call(this, selector, modifier);                                   // 18
    incompleteCountDenormalizer.afterUpdateTodo(selector, modifier);                                                  // 19
    return result;                                                                                                    // 20
  };                                                                                                                  // 21
                                                                                                                      //
  TodosCollection.prototype.remove = function remove(selector) {                                                      //
    var todos = this.find(selector).fetch();                                                                          // 23
    var result = _Mongo$Collection.prototype.remove.call(this, selector);                                             // 24
    incompleteCountDenormalizer.afterRemoveTodos(todos);                                                              // 25
    return result;                                                                                                    // 26
  };                                                                                                                  // 27
                                                                                                                      //
  return TodosCollection;                                                                                             //
}(Mongo.Collection);                                                                                                  //
                                                                                                                      //
var Todos = new TodosCollection('Todos');                                                                             // 30
                                                                                                                      //
// Deny all client-side updates since we will be using methods to manage this collection                              //
Todos.deny({                                                                                                          // 33
  insert: function insert() {                                                                                         // 34
    return true;                                                                                                      // 34
  },                                                                                                                  // 34
  update: function update() {                                                                                         // 35
    return true;                                                                                                      // 35
  },                                                                                                                  // 35
  remove: function remove() {                                                                                         // 36
    return true;                                                                                                      // 36
  }                                                                                                                   // 36
});                                                                                                                   // 33
                                                                                                                      //
Todos.schema = new SimpleSchema({                                                                                     // 39
  listId: {                                                                                                           // 40
    type: String,                                                                                                     // 41
    regEx: SimpleSchema.RegEx.Id,                                                                                     // 42
    denyUpdate: true                                                                                                  // 43
  },                                                                                                                  // 40
  text: {                                                                                                             // 45
    type: String,                                                                                                     // 46
    max: 100                                                                                                          // 47
  },                                                                                                                  // 45
  createdAt: {                                                                                                        // 49
    type: Date,                                                                                                       // 50
    denyUpdate: true                                                                                                  // 51
  },                                                                                                                  // 49
  checked: {                                                                                                          // 53
    type: Boolean,                                                                                                    // 54
    defaultValue: false                                                                                               // 55
  }                                                                                                                   // 53
});                                                                                                                   // 39
                                                                                                                      //
Todos.attachSchema(Todos.schema);                                                                                     // 59
                                                                                                                      //
// This represents the keys from Lists objects that should be published                                               //
// to the client. If we add secret properties to List objects, don't list                                             //
// them here to keep them private to the server.                                                                      //
Todos.publicFields = {                                                                                                // 64
  listId: 1,                                                                                                          // 65
  text: 1,                                                                                                            // 66
  createdAt: 1,                                                                                                       // 67
  checked: 1                                                                                                          // 68
};                                                                                                                    // 64
                                                                                                                      //
// TODO:30 This factory has a name - do we have a code style for this?                                                //
//   - usually I've used the singular, sometimes you have more than one though, like                                  //
//   'todo', 'emptyTodo', 'checkedTodo'                                                                               //
Factory.define('todo', Todos, {                                                                                       // 74
  listId: function listId() {                                                                                         // 75
    return Factory.get('list');                                                                                       // 75
  },                                                                                                                  // 75
  text: function text() {                                                                                             // 76
    return faker.lorem.sentence();                                                                                    // 76
  },                                                                                                                  // 76
  createdAt: function createdAt() {                                                                                   // 77
    return new Date();                                                                                                // 77
  }                                                                                                                   // 77
});                                                                                                                   // 74
                                                                                                                      //
Todos.helpers({                                                                                                       // 80
  list: function list() {                                                                                             // 81
    return Lists.findOne(this.listId);                                                                                // 82
  },                                                                                                                  // 83
  editableBy: function editableBy(userId) {                                                                           // 84
    return this.list().editableBy(userId);                                                                            // 85
  }                                                                                                                   // 86
});                                                                                                                   // 80
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"startup":{"server":{"fixtures.js":["meteor/meteor","../../api/lists/lists.js","../../api/todos/todos.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/fixtures.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Lists;module.import('../../api/lists/lists.js',{"Lists":function(v){Lists=v}});var Todos;module.import('../../api/todos/todos.js',{"Todos":function(v){Todos=v}});
                                                                                                                      // 2
                                                                                                                      // 3
                                                                                                                      //
// if the database is empty on server start, create some sample data.                                                 //
Meteor.startup(function () {                                                                                          // 6
  if (Lists.find().count() === 0) {                                                                                   // 7
    (function () {                                                                                                    // 7
      var data = [{                                                                                                   // 8
        name: 'Meteor Principles',                                                                                    // 10
        items: ['Data on the Wire', 'One Language', 'Database Everywhere', 'Latency Compensation', 'Full Stack Reactivity', 'Embrace the Ecosystem', 'Simplicity Equals Productivity']
      }, {                                                                                                            // 9
        name: 'Languages',                                                                                            // 22
        items: ['Lisp', 'C', 'C++', 'Python', 'Ruby', 'JavaScript', 'Scala', 'Erlang', '6502 Assembly']               // 23
      }, {                                                                                                            // 21
        name: 'Favorite Scientists',                                                                                  // 36
        items: ['Ada Lovelace', 'Grace Hopper', 'Marie Curie', 'Carl Friedrich Gauss', 'Nikola Tesla', 'Claude Shannon']
      }];                                                                                                             // 35
                                                                                                                      //
      var timestamp = new Date().getTime();                                                                           // 48
                                                                                                                      //
      data.forEach(function (list) {                                                                                  // 50
        var listId = Lists.insert({                                                                                   // 51
          name: list.name,                                                                                            // 52
          incompleteCount: list.items.length                                                                          // 53
        });                                                                                                           // 51
                                                                                                                      //
        list.items.forEach(function (text) {                                                                          // 56
          Todos.insert({                                                                                              // 57
            listId: listId,                                                                                           // 58
            text: text,                                                                                               // 59
            createdAt: new Date(timestamp)                                                                            // 60
          });                                                                                                         // 57
                                                                                                                      //
          timestamp += 1; // ensure unique timestamp.                                                                 // 63
        });                                                                                                           // 64
      });                                                                                                             // 65
    })();                                                                                                             // 7
  }                                                                                                                   // 66
});                                                                                                                   // 67
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"index.js":["./fixtures.js","./reset-password-email.js","./security.js","./register-api.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/index.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.import('./fixtures.js');module.import('./reset-password-email.js');module.import('./security.js');module.import('./register-api.js');// This defines a starting set of data to be loaded if the app is loaded with an empty db.
                                                                                                                      // 2
                                                                                                                      //
// This file configures the Accounts package to define the UI of the reset password email.                            //
                                                                                                                      // 5
                                                                                                                      //
// Set up some rate limiting and other important security settings.                                                   //
                                                                                                                      // 8
                                                                                                                      //
// This defines all the collections, publications and methods that the application provides                           //
// as an API to the client.                                                                                           //
                                                                                                                      // 12
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"register-api.js":["../../api/lists/methods.js","../../api/lists/server/publications.js","../../api/todos/methods.js","../../api/todos/server/publications.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/register-api.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.import('../../api/lists/methods.js');module.import('../../api/lists/server/publications.js');module.import('../../api/todos/methods.js');module.import('../../api/todos/server/publications.js');
                                                                                                                      // 2
                                                                                                                      // 3
                                                                                                                      // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"reset-password-email.js":["meteor/accounts-base",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/reset-password-email.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Accounts;module.import('meteor/accounts-base',{"Accounts":function(v){Accounts=v}});                              // 1
                                                                                                                      //
Accounts.emailTemplates.siteName = 'Meteor Guide Todos Example';                                                      // 4
Accounts.emailTemplates.from = 'Meteor Todos Accounts <accounts@example.com>';                                        // 5
                                                                                                                      //
Accounts.emailTemplates.resetPassword = {                                                                             // 7
  subject: function subject() {                                                                                       // 8
    return 'Reset your password on Meteor Todos';                                                                     // 9
  },                                                                                                                  // 10
  text: function text(user, url) {                                                                                    // 11
    return 'Hello!\n\nClick the link below to reset your password on Meteor Todos.\n\n' + url + '\n\nIf you didn\'t request this email, please ignore it.\n\nThanks,\nThe Meteor Todos team\n';
  }                                                                                                                   // 23
};                                                                                                                    // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"security.js":["meteor/meteor","meteor/ddp-rate-limiter","meteor/underscore",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/security.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var DDPRateLimiter;module.import('meteor/ddp-rate-limiter',{"DDPRateLimiter":function(v){DDPRateLimiter=v}});var _;module.import('meteor/underscore',{"_":function(v){_=v}});
                                                                                                                      // 2
                                                                                                                      // 3
                                                                                                                      //
// Don't let people write arbitrary data to their 'profile' field from the client                                     //
Meteor.users.deny({                                                                                                   // 6
  update: function update() {                                                                                         // 7
    return true;                                                                                                      // 8
  }                                                                                                                   // 9
});                                                                                                                   // 6
                                                                                                                      //
// Get a list of all accounts methods by running `Meteor.server.method_handlers` in meteor shell                      //
var AUTH_METHODS = ['login', 'logout', 'logoutOtherClients', 'getNewToken', 'removeOtherTokens', 'configureLoginService', 'changePassword', 'forgotPassword', 'resetPassword', 'verifyEmail', 'createUser', 'ATRemoveService', 'ATCreateUserServer', 'ATResendVerificationEmail'];
                                                                                                                      //
if (Meteor.isServer) {                                                                                                // 30
  // Only allow 2 login attempts per connection per 5 seconds                                                         //
  DDPRateLimiter.addRule({                                                                                            // 32
    name: function name(_name) {                                                                                      // 33
      return _.contains(AUTH_METHODS, _name);                                                                         // 34
    },                                                                                                                // 35
                                                                                                                      //
                                                                                                                      //
    // Rate limit per connection ID                                                                                   //
    connectionId: function connectionId() {                                                                           // 38
      return true;                                                                                                    // 38
    }                                                                                                                 // 38
  }, 2, 5000);                                                                                                        // 32
}                                                                                                                     // 40
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}},"i18n":{"en.i18n.json":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// i18n/en.i18n.json                                                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,
    package_name = "project",
    namespace = "project";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","preloaded_langs":[],"cdn_path":null});
TAPi18n.languages_names["en"] = ["English","English"];
// integrate the fallback language translations 
translations = {};
translations[namespace] = {"lists":{"makePrivate":{"notLoggedIn":"Must be logged in to make private lists.","lastPublicList":"Cannot make the last public list private."},"makePublic":{"notLoggedIn":"Must be logged in.","accessDenied":"You don't have permission to edit this list."},"updateName":{"accessDenied":"You don't have permission to edit this list."},"remove":{"accessDenied":"'You don't have permission to remove this list.'","lastPublicList":"Cannot delete the last public list."}},"todos":{"insert":{"accessDenied":"Cannot add todos to a private list that is not yours"},"setCheckedStatus":{"accessDenied":"Cannot edit todos in a private list that is not yours"},"updateText":{"accessDenied":"Cannot edit todos in a private list that is not yours"},"remove":{"accessDenied":"Cannot remove todos in a private list that is not yours"}}};
TAPi18n._loadLangFileObject("en", translations);
TAPi18n._registerServerTranslator("en", namespace);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"main.js":["/imports/startup/server",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/main.js                                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.import('/imports/startup/server');                                                                             // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".jsx"]});
require("./i18n/en.i18n.json");
require("./server/main.js");
//# sourceMappingURL=app.js.map
