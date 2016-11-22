import { widget as Widget } from '$:/core/modules/widgets/widget.js';

function thread(value, functions){
  return functions.reduce((value, f) => f.bind(this)(value), value)
}

class TemplatedWidget extends Widget {

  threadMethods(value, methods){
    return thread.bind(this)(value, methods.map(m => this[m]))
  }

  parse(string){
    let parser = this.wiki.parseText("text/vnd.tiddlywiki", string, {parseAsInline: true})
    return parser ? parser.tree : []
  }

  execute() {
    if (!$tw.browser) { return }
    this.computeAttributes()
    this.threadMethods(this.attributes, [
      'template',
      'parse',
      'makeChildWidgets' ])
  }

  template(){
    return ''
  }

}

export { TemplatedWidget as SJTemplatedWidget }
