/*
bottom: 36
tpo: 71
left: -10
right: 33
*/

export function latPct (lat) {
  return ((lat + 10) / .43 ) + '%'
}

export function lngPct (lng) {
  return (100 - ((lng - 36) / .35)) + '%'
}

export function latJuta (lat) {
  return ((lat + 10) / .43 )
}

export function lngJuta (lng) {
  return (100 - ((lng - 36) / .35))
}

export function getAngle (lat1, lng1, lat2, lng2) {
  console.log(lat1, lat2)
  console.log(lng1, lng2)
  lat1 = latJuta(lat1)
  lat2 = latJuta(lat2)
  lng1 = lngJuta(lng1)
  lng2 = lngJuta(lng2)
  console.log(lat1, lat2)
  console.log(lng1, lng2)
  
  var angle = 0
  if (lng2 < lng1) {
    angle = 180-Math.atan((lat2-lat1)/(lng2-lng1)) * 180 / Math.PI + 90
  } else if (lng1 === lng2 && lat2 < lat1)  {
    angle = 180
  } else if (lng2 > lng1) {
    angle = 360-Math.atan((lat2-lat1)/(lng2-lng1)) * 180 / Math.PI+90
  }
  console.log(angle)
  return angle
}