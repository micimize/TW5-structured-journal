import { SJTemplatedWidget } from '$:/plugins/micimize/structured-journal/TemplatedWidget.js';

class InlineEditable extends SJTemplatedWidget {

  state = { editing: false }

  done(){
    this.state.editing = false
  }

  toggleEditing(e){
    console.log(e)
    window.event = e
    this.state.editing = !this.state.editing
    this.refreshSelf()
  }

  initialise(parseTreeNode, options){
    super.initialise(parseTreeNode, options)
    this.addEventListeners([
      {type: "toggle-editing", handler: "toggleEditing"},
    ]);
  }

  button(action){
    return `
      <$button class="tc-btn-invisible">
        <$action-sendmessage $message="toggle-editing"/>
        {{$:/core/images/${action}-button}}
      </$button>
    `
  }

  titleEditing({ tiddler, index, field='text' }){
    return `
      <$SJFlexEditText tiddler="${tiddler}"
      ${ index ? `index="${index}"` : `field="${field}"`}
      focus="true" /> ${this.button('done')}
    `
  }

  titleInactive({ tiddler, field }){
    tiddler = this.wiki.getTiddler(tiddler)
    return `<span>
      ${tiddler.fields[field]} &nbsp; ${this.button('edit')}
    </span>`
  }

  title({ tiddler, field }){
    return this[this.state.editing ? 'titleEditing' : 'titleInactive']({ tiddler, field })
  }

  template({ tiddler, field = 'text' }) {
    window.ie = this
    return  this.title({ tiddler, field }) /*+ this.state.editing ? `
      <$edit tiddler="${tiddler}" ${ field && `field="${field}"` } />
      ` : ''*/
  }

}

export { InlineEditable as SJInlineEditable }
