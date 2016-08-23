(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Random = Package.random.Random;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Factory;

var require = meteorInstall({"node_modules":{"meteor":{"factory":{"factory.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/factory/factory.js                                                              //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/* global Factory:true */                                                                   //
/* global LocalCollection */                                                                //
                                                                                            //
Factory = function Factory(name, collection, properties) {                                  // 4
  this.name = name;                                                                         // 5
  this.collection = collection;                                                             // 6
  this.properties = properties;                                                             // 7
  this.afterBuildCbs = [];                                                                  // 8
};                                                                                          // 9
                                                                                            //
Factory.prototype.afterBuild = function (cb) {                                              // 11
  this.afterBuildCbs.push(cb);                                                              // 12
};                                                                                          // 13
                                                                                            //
Factory.prototype.build = function (dataset, props, opts) {                                 // 15
  // favour passed in properties to defined properties                                      //
  var properties = _.extend({}, this.properties, props);                                    // 17
  var options = opts || {};                                                                 // 18
                                                                                            //
  var doc = {};                                                                             // 20
  var setProp = function setProp(subDoc, prop, value) {                                     // 21
    if (_.isFunction(value)) {                                                              // 22
      setProp(subDoc, prop, value.call(doc, dataset));                                      // 23
    } else if (value instanceof Factory) {                                                  // 24
      if (options.noRelations) {                                                            // 25
        setProp(subDoc, prop, Random.id());                                                 // 26
      } else {                                                                              // 27
        var relation = value.build(dataset);                                                // 28
        setProp(subDoc, prop, relation._id);                                                // 29
      }                                                                                     // 30
      // TODO:50 what is the correct check here?                                            //
    } else if (_.isObject(value) && !_.isDate(value) && !_.isArray(value)) {                // 32
        subDoc[prop] = subDoc[prop] || {};                                                  // 33
        walk(subDoc[prop], value); // eslint-disable-line                                   // 34
      } else if (prop !== '_id') {                                                          // 35
          var modifier = { $set: {} };                                                      // 36
          modifier.$set[prop] = value;                                                      // 37
          LocalCollection._modify(subDoc, modifier);                                        // 38
        }                                                                                   // 39
  };                                                                                        // 40
                                                                                            //
  // walk the tree and evaluate                                                             //
  function walk(subDoc, subProps) {                                                         // 43
    _.each(subProps, function (value, prop) {                                               // 44
      setProp(subDoc, prop, value);                                                         // 45
    });                                                                                     // 46
  }                                                                                         // 47
                                                                                            //
  // you can't set _id with _modify                                                         //
  if (properties._id) {                                                                     // 50
    var id = properties._id;                                                                // 51
    if (_.isFunction(id)) {                                                                 // 52
      id = id.call(doc);                                                                    // 53
    }                                                                                       // 54
    doc._id = id;                                                                           // 55
  } else {                                                                                  // 56
    doc._id = Random.id();                                                                  // 57
  }                                                                                         // 58
                                                                                            //
  walk(doc, properties);                                                                    // 60
                                                                                            //
  _.each(this.afterBuildCbs, function (callback) {                                          // 62
    callback(doc, dataset);                                                                 // 63
  });                                                                                       // 64
                                                                                            //
  dataset.addDocument(doc, this.collection);                                                // 66
  return doc;                                                                               // 67
};                                                                                          // 68
//////////////////////////////////////////////////////////////////////////////////////////////

},"dataset.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/factory/dataset.js                                                              //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/* global Factory */                                                                        //
                                                                                            //
function Dataset() {                                                                        // 3
  this.documents = {};                                                                      // 4
  this.collections = {};                                                                    // 5
}                                                                                           // 6
                                                                                            //
_.extend(Dataset.prototype, {                                                               // 8
  add: function add(nameOrFactory, properties, opts) {                                      // 9
    var options = opts || {};                                                               // 10
                                                                                            //
    var factory = void 0;                                                                   // 12
    if (_.isString(nameOrFactory)) {                                                        // 13
      factory = Factory.get(nameOrFactory);                                                 // 14
    } else {                                                                                // 15
      factory = nameOrFactory;                                                              // 16
    }                                                                                       // 17
                                                                                            //
    var doc = factory.build(this, properties, _.pick(options || {}, 'noRelations'));        // 19
    if (options && options.target) {                                                        // 20
      // We need to apply the transform from the collection as we aren't inserting anywhere
      if (factory.collection._transform) {                                                  // 22
        doc = factory.collection._transform(doc);                                           // 23
      }                                                                                     // 24
                                                                                            //
      this.targetDocId = doc._id;                                                           // 26
      this.targetDocCollection = factory.collection;                                        // 27
    }                                                                                       // 28
    return doc;                                                                             // 29
  },                                                                                        // 30
  addDocument: function addDocument(document, collection) {                                 // 32
    var collectionName = collection._name;                                                  // 33
                                                                                            //
    if (!this.documents[collectionName]) {                                                  // 35
      this.documents[collectionName] = [];                                                  // 36
      this.collections[collectionName] = collection;                                        // 37
    }                                                                                       // 38
                                                                                            //
    this.documents[collectionName].push(document);                                          // 40
  },                                                                                        // 41
  createAll: function createAll() {                                                         // 43
    var self = this;                                                                        // 44
                                                                                            //
    _.each(self.documents, function (docs, collectionName) {                                // 46
      _.each(docs, function (doc) {                                                         // 47
        self.collections[collectionName].insert(doc);                                       // 48
      });                                                                                   // 49
    });                                                                                     // 50
  },                                                                                        // 51
  get: function get(collectionName, id) {                                                   // 53
    // XXX:70 this could be a lot more efficient if we used a collection from the beginning
    var doc = _.find(this.documents[collectionName], function (d) {                         // 55
      return d._id === id;                                                                  // 55
    });                                                                                     // 55
    var transform = this.collections[collectionName]._transform;                            // 56
    if (transform) {                                                                        // 57
      return transform(doc);                                                                // 58
    }                                                                                       // 59
    return doc;                                                                             // 60
  },                                                                                        // 61
  getTargetDoc: function getTargetDoc() {                                                   // 63
    return this.get(this.targetDocCollection._name, this.targetDocId);                      // 64
  },                                                                                        // 65
  getAsCollection: function getAsCollection(collectionName) {                               // 67
    // NOTE: this should be something more featured like StubCollections.stubCollection     //
    //  as it should clone the schema etc also. Maybe it doesn't matter...                  //
    var collection = new Mongo.Collection(null, {                                           // 70
      transform: this.collections[collectionName]._transform                                // 71
    });                                                                                     // 70
                                                                                            //
    _.each(this.documents[collectionName], function (doc) {                                 // 74
      collection.insert(doc);                                                               // 75
    });                                                                                     // 76
                                                                                            //
    return collection;                                                                      // 78
  },                                                                                        // 79
  getAsCursor: function getAsCursor(collectionName) {                                       // 81
    var collection = this.getAsCollection(collectionName);                                  // 82
    return collection.find();                                                               // 83
  }                                                                                         // 84
});                                                                                         // 8
                                                                                            //
Factory.Dataset = Dataset;                                                                  // 87
//////////////////////////////////////////////////////////////////////////////////////////////

},"factory-api.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/factory/factory-api.js                                                          //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/* global Factory */                                                                        //
                                                                                            //
Factory._factories = {};                                                                    // 3
                                                                                            //
Factory.get = function (name) {                                                             // 5
  var factory = Factory._factories[name];                                                   // 6
  if (!factory) {                                                                           // 7
    throw new Meteor.Error("No factory defined named " + name);                             // 8
  }                                                                                         // 9
  return factory;                                                                           // 10
};                                                                                          // 11
                                                                                            //
Factory.define = function (name, collection, properties) {                                  // 13
  Factory._factories[name] = new Factory(name, collection, properties);                     // 14
  return Factory.get(name);                                                                 // 15
};                                                                                          // 16
                                                                                            //
Factory.create = function (name, properties) {                                              // 19
  var dataset = Factory.compile(name, properties);                                          // 20
  dataset.createAll();                                                                      // 21
  return dataset.targetDocCollection.findOne(dataset.targetDocId);                          // 22
};                                                                                          // 23
                                                                                            //
Factory.compile = function (name, properties, options) {                                    // 25
  var dataset = new Factory.Dataset();                                                      // 26
  var factory = Factory.get(name);                                                          // 27
  dataset.add(factory, properties, _.extend({ target: true }, options));                    // 28
  return dataset;                                                                           // 29
};                                                                                          // 30
                                                                                            //
Factory.build = function (name, properties) {                                               // 32
  var dataset = Factory.compile(name, properties, { noRelations: true });                   // 33
  return dataset.getTargetDoc();                                                            // 34
};                                                                                          // 35
                                                                                            //
Factory.extend = function (name, properties) {                                              // 37
  return _.extend({}, Factory.get(name).properties, properties || {});                      // 38
};                                                                                          // 39
//////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/factory/factory.js");
require("./node_modules/meteor/factory/dataset.js");
require("./node_modules/meteor/factory/factory-api.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.factory = {}, {
  Factory: Factory
});

})();

//# sourceMappingURL=factory.js.map
