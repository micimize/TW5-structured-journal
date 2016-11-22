import yo from 'yo-yo'
import YoWidget from './YoWidget'
import timeInterval, { formatInterval, precision } from './timeInterval'
import { controlledEditableField as field } from './flexEdit'
import { editButton } from './buttons'

let tiddlerText = `!!{{!!experience-title}}
`
/*
function isValid({ interval }){
  return ['HOUR', 'MINUTE'].includes(precision(interval))
}

function newExperience({ interval, editing, update }){
    return yo`<div class="experience">
      ${editButton({ editing, update, passiveIcon: 'add' })}
    </div>`
}

function experience({ interval, title, editing, update }){
  return !isValid({ interval }) && !editing ?
    newExperience({ interval, editing, update }) :
    yo`
        <div class="experience">
          ${editButton({ editing, update })}
          ${timeInterval({ interval, update: editing ? update : null })}
          <span class="divider">:</span>
          ${field({ title, update: editing ? update : null })}
        </div>
      `
  }*/


class Experience extends YoWidget  {

  setState(){
    this.state = this.experienceTiddlerState() || {}
    super.setState()
  }

  tiddlerTitle({ interval } = {}){
    if (!interval){
      interval = this.state.interval || this.attributes.interval
    }
    let currentTiddler = this.attributes.tiddler || this.getVariable("currentTiddler")
    return `${currentTiddler}: Experience ${formatInterval(interval)}`
  }

  tiddlerText(){ return tiddlerText }

  isValid({ interval, ...state }){
    return ['HOUR', 'MINUTE'].includes(precision(interval))
  }

  createExperienceTiddler({
    interval,
    title = '',
    text = tiddlerText,
    tags = 'Experience',

    'experience-title': toss,
    editing,
    tiddler,
    isTransient,

    ...fields
  }){
    this.wiki.addTiddler(new $tw.Tiddler({
      ...fields,
      tags,
      text,
      interval,
      'experience-title': title,
      title: this.tiddlerTitle({ interval }),
    }))
    if(this.attributes.isTransient){
      this.state = Object.assign({}, this.attributes)
    } else {
      this.tid = this.wiki.getTiddler(this.tiddlerTitle({ interval }))
    }
    super.update({ ...this.experienceTiddlerState(), ...this.state })
  }

  experienceTiddler(){
    if(!this.tid && !this.attributes.isTransient){
      this.tid = this.wiki.getTiddler(this.tiddlerTitle())
    }
    if (!this.tid && this.isValid(this.state)){
      this.tid = this.createExperienceTiddler(this.state)
    }
    return this.tid
  }

  experienceTiddlerState(){
    if(this.experienceTiddler()){
      let { title: discard, 'experience-title': title, ...fields } = this.experienceTiddler().fields
      return { title, ...fields }
    }
    return {}
  }

  updateStateTiddler({ interval, title: newTitle, ...state } = {}){
    let { interval: oldInterval, title: oldTitle, ...fields } = this.experienceTiddlerState()

    if(interval && interval != oldInterval && this.isValid({ interval }) ){
      this.createExperienceTiddler({...fields, interval, title: newTitle})
      this.wiki.deleteTiddler(oldTitle)
    } else if(newTitle && newTitle != oldTitle ){
      this.wiki.setText(this.experienceTiddler().fields.title, 'experience-title', undefined, newTitle)
      this.tid = this.wiki.getTiddler(this.tiddlerTitle())
    }

    super.update({ ...this.experienceTiddlerState(), ...state })
  }

  update(state = {}){
    state = {...this.state, ...state}
    if(this.state.editing && (state.editing == false)){
      if(this.experienceTiddler()){
        this.updateStateTiddler(state)
      } else if (this.isValid(state)){
        this.createExperienceTiddler(state)
      }
    } else {
      super.update(state)
    }
  }

  newTemplate({ interval, editing, update }){
    return yo`<div class="experience">
      ${editButton({ editing, update, passiveIcon: 'add' })}
    </div>`
  }

  template({ interval, title, editing, update, isTransient }){
    return !this.isValid({ interval }) && !editing ?
      this.newTemplate({ interval, editing, update }) :
      yo`
        <div class="experience">
          ${editButton({ editing, update })}
          ${timeInterval({ interval, update: editing ? update : null })}
          <span class="divider">:</span>
          ${field({ title, update: editing ? update : null })}
        </div>
      `
  }
}

export { Experience as SJExperience }
