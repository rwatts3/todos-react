(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var PublicationCollector;

var require = meteorInstall({"node_modules":{"meteor":{"publication-collector":{"publication-collector.js":["babel-runtime/helpers/toConsumableArray",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/publication-collector/publication-collector.js                                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var _toConsumableArray;module.import("babel-runtime/helpers/toConsumableArray",{"default":function(v){_toConsumableArray=v}});
/* global PublicationCollector:true */                                                                        //
                                                                                                              //
var EventEmitter = Npm.require("events").EventEmitter;                                                        // 3
                                                                                                              //
// This file describes something like Subscription in                                                         //
// meteor/meteor/packages/ddp/livedata_server.js, but instead of sending                                      //
// over a socket it just collects data                                                                        //
PublicationCollector = function PublicationCollector() {                                                      // 8
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];                      // 8
                                                                                                              //
  // Object where the keys are collection names, and then the keys are _ids                                   //
  this.responseData = {};                                                                                     // 10
                                                                                                              //
  this.userId = options.userId;                                                                               // 12
};                                                                                                            // 13
                                                                                                              //
// So that we can listen to ready event in a reasonable way                                                   //
Meteor._inherits(PublicationCollector, EventEmitter);                                                         // 16
                                                                                                              //
_.extend(PublicationCollector.prototype, {                                                                    // 18
  collect: function collect(name) {                                                                           // 19
    var _this = this;                                                                                         // 19
                                                                                                              //
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];                                                                       // 19
    }                                                                                                         // 19
                                                                                                              //
    if (_.isFunction(args[args.length - 1])) {                                                                // 20
      this.on('ready', args.pop());                                                                           // 21
    }                                                                                                         // 22
                                                                                                              //
    var handler = Meteor.server.publish_handlers[name];                                                       // 24
    var result = handler.call.apply(handler, [this].concat(_toConsumableArray(args)));                        // 25
                                                                                                              //
    // TODO:20 -- we should check that result has _publishCursor? What does _runHandler do?                   //
    if (result) {                                                                                             // 28
      // array-ize                                                                                            //
      [].concat(result).forEach(function (cur) {                                                              // 30
        return cur._publishCursor(_this);                                                                     // 30
      });                                                                                                     // 30
      this.ready();                                                                                           // 31
    }                                                                                                         // 32
  },                                                                                                          // 33
  added: function added(collection, id, fields) {                                                             // 34
    check(collection, String);                                                                                // 35
    check(id, String);                                                                                        // 36
                                                                                                              //
    this._ensureCollectionInRes(collection);                                                                  // 38
                                                                                                              //
    // Make sure to ignore the _id in fields                                                                  //
    var addedDocument = _.extend({ _id: id }, _.omit(fields, "_id"));                                         // 41
    this.responseData[collection][id] = addedDocument;                                                        // 42
  },                                                                                                          // 43
  changed: function changed(collection, id, fields) {                                                         // 44
    check(collection, String);                                                                                // 45
    check(id, String);                                                                                        // 46
                                                                                                              //
    this._ensureCollectionInRes(collection);                                                                  // 48
                                                                                                              //
    var existingDocument = this.responseData[collection][id];                                                 // 50
    var fieldsNoId = _.omit(fields, "_id");                                                                   // 51
    _.extend(existingDocument, fieldsNoId);                                                                   // 52
                                                                                                              //
    // Delete all keys that were undefined in fields (except _id)                                             //
    _.forEach(fields, function (value, key) {                                                                 // 55
      if (value === undefined) {                                                                              // 56
        delete existingDocument[key];                                                                         // 57
      }                                                                                                       // 58
    });                                                                                                       // 59
  },                                                                                                          // 60
  removed: function removed(collection, id) {                                                                 // 61
    check(collection, String);                                                                                // 62
    check(id, String);                                                                                        // 63
                                                                                                              //
    this._ensureCollectionInRes(collection);                                                                  // 65
                                                                                                              //
    delete this.responseData[collection][id];                                                                 // 67
                                                                                                              //
    if (_.isEmpty(this.responseData[collection])) {                                                           // 69
      delete this.responseData[collection];                                                                   // 70
    }                                                                                                         // 71
  },                                                                                                          // 72
  ready: function ready() {                                                                                   // 73
    this.emit('ready', this._generateResponse());                                                             // 74
  },                                                                                                          // 75
  onStop: function onStop() {                                                                                 // 76
    // no-op in HTTP                                                                                          //
  },                                                                                                          // 78
  error: function error(_error) {                                                                             // 79
    throw _error;                                                                                             // 80
  },                                                                                                          // 81
  _ensureCollectionInRes: function _ensureCollectionInRes(collection) {                                       // 82
    this.responseData[collection] = this.responseData[collection] || {};                                      // 83
  },                                                                                                          // 84
  _generateResponse: function _generateResponse() {                                                           // 85
    var output = {};                                                                                          // 86
                                                                                                              //
    _.forEach(this.responseData, function (documents, collectionName) {                                       // 88
      output[collectionName] = _.values(documents);                                                           // 89
    });                                                                                                       // 90
                                                                                                              //
    return output;                                                                                            // 92
  }                                                                                                           // 93
});                                                                                                           // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/publication-collector/publication-collector.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['publication-collector'] = {}, {
  PublicationCollector: PublicationCollector
});

})();

//# sourceMappingURL=publication-collector.js.map
