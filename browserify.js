var fs = require("fs-extra");
var path = require("path");
var mkdirp = require("mkdirp");

var browserify = require("browserify");
var watchify = require("watchify");

var files = JSON.parse(fs.readFileSync("./tiddlywiki.files", "utf8"))

var targetRoot = "../../wiki/plugins/structured-journal/"
var target = targetRoot + "files/"
var prefix = "structured-journal-"

mkdirp.sync(target)
fs.copySync('./tiddlywiki.files', target + 'tiddlywiki.files')

function copyToTarget(file){
  fs.copySync('./' + file, targetRoot + file, {
    filter: function(fileName){
      return !path.basename(fileName).startsWith('.')
    }})
}

['plugin.info', 'README.md', 'styles'].map(copyToTarget)

function standaloneName(fileName){
  return prefix + fileName.split('.')[0].toLowerCase()
}

function browserifyFromTiddlerDefinition(definition){
  var fileName = definition.file
  console.log('watching ' + fileName)
  return browserify({
    entries: ["./src/" + fileName],
    standalone: standaloneName(fileName),
    cache: {},
    packageCache: {},
  })
  //.plugin(watchify, {poll: 100})
    .on('update', function (ids) { console.log('updated ' + fileName) })
    .on('log', function (bytes) { console.log(bytes + ' by ' + fileName) })
    .on('error', function(err){
      console.log(err.message);
      this.emit('end');
    })
    .transform("babelify", { presets: ["es2015", "stage-0"]})
  //.transform({ sourcemap: false }, 'uglifyify')
    .external('$:/core/modules/widgets/widget.js')
    .external('$:/core/modules/widgets/edit-text.js')
    .external('$:/plugins/micimize/structured-journal/TemplatedWidget.js')
    .bundle()
    .pipe(fs.createWriteStream(target + fileName))
}

files.tiddlers.map(browserifyFromTiddlerDefinition)
