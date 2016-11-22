import yo from 'yo-yo'
import YoWidget, { displayTemplateErrors } from './YoWidget'
import { keyValue } from './utils'

Number.prototype.padLeft = function (n,str){
    return Array(n-String(this).length+1).join(str||'0')+this;
}

const durations = {
  MINUTE: 60000, // new Date('1970-01-01T00:01:00Z') - new Date('1970-01-01T00:00:00Z');
  HOUR: 3600000, // new Date('1970-01-01T01:00:00Z') - new Date('1970-01-01T00:00:00Z');
  DAY: 86400000, // new Date('1970-01-02T00:00:00Z') - new Date('1970-01-01T00:00:00Z');
}

function parse(interval){
  let [start, end = undefined] = interval.split('/').map(date => new Date(date))
  end = end || start
  return { start, end }
}

function format(date){
  return `${date.getHours().padLeft(2)}:${date.getMinutes().padLeft(2)}`
}

export function formatInterval(interval){
  try {
    let { start, end } = parse(interval)
    return [start, end].map(format).join(' - ')
  } catch(err) {
    return interval || 'interval undefined'
  }
}

export function precision(interval){
  if (typeof(interval) != 'string'){
    return undefined
  }
  let [ year, month, day, hour, minute ] = interval.split(/-|T|:/)
  return minute && 'MINUTE' ||
         hour   && 'HOUR'   ||
         day    && 'DAY'    ||
         month  && 'MONTH'  ||
         year   && 'YEAR'
}

function buildInterval({ start, end }){
  return { interval: [start, end].map(date => date.toISOString()).join('/') }
}

function handler({ onchange, ...time }){
  let { key, value } = keyValue(time)
  return ({ target: { value: update } }) => {
    let [hours, minutes] = update.split(':').map(i => parseInt(i))
    if(hours)
      value.setHours(hours);
    if(minutes)
      value.setMinutes(minutes);
    onchange({ [key]: value }, { changed: key })
  }
}

function editor({ update, start, end }){
  let currentStart = start
  let currentEnd = end

  function onchange({ start = currentStart, end = currentEnd }, meta){
    update(buildInterval({ start, end }), meta)
  }

  return yo`
    <div class="edit time-frame" >
      <input type="time" name="start" onchange=${handler({ start, onchange })} value=${format(start)}/>
      <span class="divider">-</span>
      <input type="time" name="end" onchange=${handler({ end, onchange })} value=${format(end)}/>
    </div>
  `
}

function passive({ start, end }){
  return yo`
    <div class="time-frame">
      <time class="start" datetime="${start.toString()}">${format(start)}</time>
      <span class="divider">-</span>
      <time class="end" datetime="${end.toString()}">${format(end)}</time>
    </div>
  `
}

const timeInterval = displayTemplateErrors(({
  interval,
  update,
  //bounds: { lower, upper },
}) => {
  let { start, end } = parse(interval)
  return update ?
    editor({ update, start, end }) :
    passive({ start, end })
})


export default timeInterval

export class SJTimeInterval extends YoWidget {
  template({ editing, update, ...state }){
    let int = timeInterval({
      update: editing ? update : undefined,
      ...state
    })
    return yo`
      <div>
        <button onclick=${e => this.update({editing: !this.state.editing})}></button>
        ${int}
      </div>
    `
  }
}
