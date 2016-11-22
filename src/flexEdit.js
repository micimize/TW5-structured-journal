import yo from 'yo-yo'
import YoWidget, { displayTemplateErrors } from './YoWidget'
import { keyValue } from './utils'

let containerStyle = `min-width: 10em; display: inline-block; width: auto; font-size: 1em; position: relative;`
let inputStyle = `width: 100%; font-size: 1em; position: absolute;`
let rulerStyle = `font-size: 1em; visibility: hidden; white-space: pre;`

export default function flexEdit({text, onchange}) {
  return yo`
  <span class="flex-edit" style="${containerStyle}">
    <input type="text" style="${inputStyle}" value="${text}" onkeypress=${onchange} onkeyup=${onchange} >
    <span style="${rulerStyle}">${text}—</span>
  </span>
  `
}

export function controlledEditableField({ update, ...rest }) {
  let { key, value } = keyValue(rest)
  return update ? flexEdit({
    text: value,
    onchange({ target: { value: newValue } }){
      update({ [key]: newValue }) 
    }
  }) : value
}
