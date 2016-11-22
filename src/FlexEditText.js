import * as editTextMod from '$:/core/modules/widgets/edit-text.js';
const EditText = editTextMod['edit-text']


class FlexEditText extends EditText {

  adjustWidth(){
    this.ruler.innerText = this.engine.domNode.value + '—' 
    this.engine.domNode.style.width = `${this.ruler.offsetWidth}px` 
  }

  render(parent, nextSibling){
    super.render(parent, nextSibling)
    this.ruler = document.createElement('span')
    this.ruler.style.fontSize = window.getComputedStyle(this.engine.domNode, null).getPropertyValue('font-size')
    this.ruler.style.visibility = 'hidden'
    this.ruler.style.whiteSpace = 'pre'

    this.engine.domNode.style.minWidth = `${this.editSize | 10}em`
    this.engine.domNode.style.boxSizing = 'content-box'
    document.body.appendChild(this.ruler)
    this.adjustWidth()
  }

  removeChildDomNodes() {
    super.removeChildDomNodes()
    this.ruler.remove()
  }

  updateEditorDomNode(text, type){
    super.updateEditorDomNode(text, type)
    this.adjustWidth()
	}
}

export { FlexEditText as SJFlexEditText }
