var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var pageSchema = new mongoose.Schema({
  title: {type:String, required: true},
  urlTitle: {type: String, required: true},
  content: {type: String, required: true},
  date: {type: Date, default: Date.now},
  status: {type: String, enum: ['open', 'closed']},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags: {type:Array}
});

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unqiue: true}
});

pageSchema.virtual('route').get(function(){
  return '/wiki/' + this.urlTitle;
});

pageSchema.statics.findByTag = function(tag){
  return this.find({ tags: {$elemMatch: { $eq: tag } }}).exec();
}

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

pageSchema.pre('validate', function(next) {
  console.log("title: ", this.title);
  
  this.urlTitle = generateUrlTitle(this.title);
  console.log("urlTitle: ", this.urlTitle);
  
  next();
})

function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

module.exports = {
  Page: Page,
  User: User
};