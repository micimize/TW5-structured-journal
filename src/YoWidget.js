import yo from 'yo-yo'
import { widget as Widget } from '$:/core/modules/widgets/widget.js';

export function displayTemplateErrors(fn){
  return (...args) => {
    try {
      return fn(...args)
    } catch(err) {
      return yo`<span>${err.toString()}</span>`
    }
  }
}

// By default YoTemplateWidgets can update their own state
// but have no way to talk to the outside world
export default class YoTemplateWidget extends Widget {

  state = {}
  childMap = {}

  parse(string){
    let parser = this.wiki.parseText("text/vnd.tiddlywiki", string, {parseAsInline: true})
    return parser ? parser.tree : []
  }

  wikiText(string){
    let parseTreeNodes = this.parse(string).map(this.makeChildWidget)
    this.childMap[string] = parseTreeNodes
  }

  update(state = {}, meta){
    Object.assign(this.state, state)
    yo.update(this.domNode, this.renderTemplate())
  }

  refresh(changedTiddlers){
    if(Object.keys(this.computeAttributes()).length){
    }
  }

  refreshSelf(){
    this.update()
  }

  renderTemplate(){
    return this.safeTemplate({
      update: this.update.bind(this),
      ...this.attributes,
      ...this.state
    })
  }

  setState(){
    if (!Object.keys(this.state).length){
      this.state = Object.assign({}, this.attributes)
    }
  }

  execute() {
    if (!$tw.browser) { return }
    this.computeAttributes()
    this.setState()
    if (!this.domNode){
      this.domNode = this.renderTemplate()
    } else {
      yo.update(this.domNode, this.renderTemplate())
    }
  }

  render(parent, nextSibling) {
    if (!$tw.browser) { return }
    super.render(parent, nextSibling)
    this.domNodes.push(this.domNode)
		parent.insertBefore(this.domNode, nextSibling);
  }

  template(){
    return yo`<span></span>`
  }

  safeTemplate(...args){
    try {
      return this.template(...args)
    } catch(err) {
      console.error(err)
      return yo`<span>${err.toString()}</span>`
    }
  }

}

