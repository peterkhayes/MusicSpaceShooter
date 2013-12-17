var utils = {}

utils.scaleBy = function (x) {
  return function (y) {
    return x * y
  }
}


utils.distance = function(x1, y1, x2, y2) {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
}

utils.rectInRect = function(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  return ! (r2x > r1x + r1w ||
            r2x + r2w < r1x ||
            r2y > r1y + r1h ||
            r2y + r2h < r1y)
}

utils.arcInRect = function(ax, ay, ar, rx, ry, rw, rh) {
  return ! (ax + ar <= rx || ax - ar >= rx + rw || ay + ar <= ry || ay - ar >= ry + rh)
}

utils.arcIntersectingRect = function(ax, ay, ar, rx, ry, rw, rh) {
  return ! (ax <= rx - ar ||
            ax >= rx + rw + ar ||
            ay <= ry - ar ||
            ay >= ry + rh + ar)
}

utils.pointInRect = function(px, py, rx, ry, rw, rh) {
  return px >= rx &&
    px <= rx + rw &&
    py >= ry &&
    py <= ry + rh
}

module.exports = utils