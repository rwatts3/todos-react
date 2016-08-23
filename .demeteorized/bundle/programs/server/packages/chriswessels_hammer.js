(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Random = Package.random.Random;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Hammer;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/chriswessels_hammer/packages/chriswessels_hammer.js      //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['chriswessels:hammer'] = {}, {
  Hammer: Hammer
});

})();
