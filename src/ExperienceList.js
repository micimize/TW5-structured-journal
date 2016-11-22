import { SJTemplatedWidget } from '$:/plugins/micimize/structured-journal/TemplatedWidget.js';

class ExperienceList extends SJTemplatedWidget  {

  listTitle(){
    return this.attributes.listTiddler || `${$tw.getVariable("currentTiddler")}: Experience List`
  }

  prefix(){
    return `${this.getVariable("currentTiddler")}: Experience `
  }

  template(){
    let { date } = this.attributes
    return `
      <ol class="experience-list">
        <$list filter="[prefix[${this.prefix()}]]">
          <li><$SJExperience tiddler="${this.getVariable("currentTiddler")}" interval={{!!interval}}></$SJExperience></li>
        </$list>
        <li class="new"><$SJExperience isTransient=true tiddler="${this.getVariable("currentTiddler")}" interval="${date}"></$SJExperience></li>
      </ol>
    `
  }

}

export { ExperienceList as SJExperienceList }
