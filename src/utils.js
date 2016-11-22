
export function keyValue(obj){
  let key = Object.keys(obj)[0]
  let value = obj[key]
  return { key, value }
}

