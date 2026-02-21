import pearl from './pearl.json'
import ascent from './ascent.json'
import bind from './bind.json'
import haven from './haven.json'
import icebox from './icebox.json'
import split from './split.json'
import breeze from './breeze.json'
import fracture from './fracture.json'
import lotus from './lotus.json'
import sunset from './sunset.json'
import corrode from './corrode.json'

export const defaultCalloutsByMap = {
  pearl,
  ascent,
  bind,
  haven,
  icebox,
  split,
  breeze,
  fracture,
  lotus,
  sunset,
  corrode,
}

export function getDefaultCallouts(mapId) {
  return defaultCalloutsByMap[mapId] ?? []
}
