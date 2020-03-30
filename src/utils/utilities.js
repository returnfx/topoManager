
  /**
  * Common namepaces constants in alpha order
  * @enum {string}
  * @type {PlainObject}
  * @memberof module:namespaces
  */
 var NS = {
  HTML: 'http://www.w3.org/1999/xhtml',
  MATH: 'http://www.w3.org/1998/Math/MathML',
  SE: 'http://svg-edit.googlecode.com',
  SVG: 'http://www.w3.org/2000/svg',
  XLINK: 'http://www.w3.org/1999/xlink',
  XML: 'http://www.w3.org/XML/1998/namespace',
  XMLNS: 'http://www.w3.org/2000/xmlns/' // see http://www.w3.org/TR/REC-xml-names/#xmlReserved
};
var svg = document.createElementNS(NS.SVG, 'svg');
var svg$1 = document.createElementNS(NS.SVG, 'svg');
var NEAR_ZERO = 1e-14;
var $$2 = jqPluginSVG(jQuery);
function jqPluginSVG ($) {
  var proxied = $.fn.attr,
      svgns = 'http://www.w3.org/2000/svg';
  /**
  * @typedef {PlainObject.<string, string|Float>} module:jQueryAttr.Attributes
  */
  /**
  * @function external:jQuery.fn.attr
  * @param {string|string[]|PlainObject.<string, string>} key
  * @param {string} value
  * @returns {external:jQuery|module:jQueryAttr.Attributes}
  */
  $.fn.attr = function (key, value) {
    var len = this.length;
    if (!len) {
      return proxied.apply(this, arguments);
    }
    for (var i = 0; i < len; ++i) {
      var elem = this[i];
      // set/get SVG attribute
      if (elem.namespaceURI === svgns) {
        // Setting attribute
        if (value !== undefined) {
          elem.setAttribute(key, value);
        } else if (Array.isArray(key)) {
          // Getting attributes from array
          var obj = {};
          var j = key.length;

          while (j--) {
            var aname = key[j];
            var attr = elem.getAttribute(aname);
            // This returns a number when appropriate
            if (attr || attr === '0') {
              attr = isNaN(attr) ? attr : attr - 0;
            }
            obj[aname] = attr;
          }
          return obj;
        }
        if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
          // Setting attributes from object
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Object.entries(key)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _ref = _step.value;

              var _ref2 = slicedToArray(_ref, 2);

              var name = _ref2[0];
              var val = _ref2[1];

              elem.setAttribute(name, val);
            }
            // Getting attribute
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          var _attr = elem.getAttribute(key);
          if (_attr || _attr === '0') {
            _attr = isNaN(_attr) ? _attr : _attr - 0;
          }
          return _attr;
        }
      } else {
        return proxied.apply(this, arguments);
      }
    }
    return this;
  };
  return $;
}


var supportsPathBBox_ = function () {
  var svgcontent = document.createElementNS(NS.SVG, 'svg');
  document.documentElement.append(svgcontent);
  var path = document.createElementNS(NS.SVG, 'path');
  path.setAttribute('d', 'M0,0 C0,0 10,10 10,0');
  svgcontent.append(path);
  var bbox = path.getBBox();
  svgcontent.remove();
  return bbox.height > 4 && bbox.height < 5;
}();

/**
* @function module:browser.supportsPathBBox
* @returns {boolean}
*/
function supportsPathBBox() {
  return supportsPathBBox_;
};

var getPathBBox = function getPathBBox(path$$1) {
  var seglist = path$$1.pathSegList;
  var tot = seglist.numberOfItems;

  var bounds = [[], []];
  var start = seglist.getItem(0);
  var P0 = [start.x, start.y];

  for (var i = 0; i < tot; i++) {
    var seg = seglist.getItem(i);

    if (seg.x === undefined) {
      continue;
    }

    // Add actual points to limits
    bounds[0].push(P0[0]);
    bounds[1].push(P0[1]);

    if (seg.x1) {
      (function () {
        var P1 = [seg.x1, seg.y1],
            P2 = [seg.x2, seg.y2],
            P3 = [seg.x, seg.y];

        var _loop = function _loop(j) {
          var calc = function calc(t) {
            return Math.pow(1 - t, 3) * P0[j] + 3 * Math.pow(1 - t, 2) * t * P1[j] + 3 * (1 - t) * Math.pow(t, 2) * P2[j] + Math.pow(t, 3) * P3[j];
          };

          var b = 6 * P0[j] - 12 * P1[j] + 6 * P2[j];
          var a = -3 * P0[j] + 9 * P1[j] - 9 * P2[j] + 3 * P3[j];
          var c = 3 * P1[j] - 3 * P0[j];

          if (a === 0) {
            if (b === 0) {
              return 'continue';
            }
            var t = -c / b;
            if (t > 0 && t < 1) {
              bounds[j].push(calc(t));
            }
            return 'continue';
          }
          var b2ac = Math.pow(b, 2) - 4 * c * a;
          if (b2ac < 0) {
            return 'continue';
          }
          var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
          if (t1 > 0 && t1 < 1) {
            bounds[j].push(calc(t1));
          }
          var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
          if (t2 > 0 && t2 < 1) {
            bounds[j].push(calc(t2));
          }
        };

        for (var j = 0; j < 2; j++) {
          var _ret2 = _loop(j);

          if (_ret2 === 'continue') continue;
        }
        P0 = P3;
      })();
    } else {
      bounds[0].push(seg.x);
      bounds[1].push(seg.y);
    }
  }

  var x = Math.min.apply(null, bounds[0]);
  var w = Math.max.apply(null, bounds[0]) - x;
  var y = Math.min.apply(null, bounds[1]);
  var h = Math.max.apply(null, bounds[1]) - y;
  return {
    x: x,
    y: y,
    width: w,
    height: h
  };
};

  // Support for correct bbox sizing on groups with horizontal/vertical lines
  var supportsHVLineContainerBBox_ = function () {
    var svgcontent = document.createElementNS(NS.SVG, 'svg');
    document.documentElement.append(svgcontent);
    var path = document.createElementNS(NS.SVG, 'path');
    path.setAttribute('d', 'M0,0 10,0');
    var path2 = document.createElementNS(NS.SVG, 'path');
    path2.setAttribute('d', 'M5,0 15,0');
    var g = document.createElementNS(NS.SVG, 'g');
    g.append(path, path2);
    svgcontent.append(g);
    var bbox = g.getBBox();
    svgcontent.remove();
    // Webkit gives 0, FF gives 10, Opera (correctly) gives 15
    return bbox.width === 15;
  }();

function supportsHVLineContainerBBox() {
  return supportsHVLineContainerBBox_;
};



/**
  * Get the given/selected element's bounding box object, checking for
  * horizontal/vertical lines (see issue 717)
  * Note that performance is currently terrible, so some way to improve would
  * be great.
  * @param {Element} selected - Container or `<use>` DOM element
  * @returns {DOMRect} Bounding box object
  */
 function groupBBFix(selected) {
  if (supportsHVLineContainerBBox()) {
    try {
      return selected.getBBox();
    } catch (e) {}
  }
  var ref = $$2.data(selected, 'ref');
  var matched = null;
  var ret = void 0,
      copy = void 0;

  if (ref) {
    copy = $$2(ref).children().clone().attr('visibility', 'hidden');
    $$2(svgroot_).append(copy);
    matched = copy.filter('line, path');
  } else {
    matched = $$2(selected).find('line, path');
  }

  var issue = false;
  if (matched.length) {
    matched.each(function () {
      var bb = this.getBBox();
      if (!bb.width || !bb.height) {
        issue = true;
      }
    });
    if (issue) {
      var elems = ref ? copy : $$2(selected).children();
      ret = getStrokedBBox(elems);
    } else {
      ret = selected.getBBox();
    }
  } else {
    ret = selected.getBBox();
  }
  if (ref) {
    copy.remove();
  }
  return ret;
}

function getTransformList(elem) {
  if (!supportsNativeTransformLists()) {
    var id = elem.id || 'temp';
    var t = listMap_[id];
    if (!t || id === 'temp') {
      listMap_[id] = new SVGTransformList(elem);
      listMap_[id]._init();
      t = listMap_[id];
    }
    return t;
  }
  if (elem.transform) {
    return elem.transform.baseVal;
  }
  if (elem.gradientTransform) {
    return elem.gradientTransform.baseVal;
  }
  if (elem.patternTransform) {
    return elem.patternTransform.baseVal;
  }

  return null;
};

var supportsNativeSVGTransformLists_ = function () {
  var rect = document.createElementNS(NS.SVG, 'rect');
  var rxform = rect.transform.baseVal;
  var t1 = svg.createSVGTransform();
  rxform.appendItem(t1);
  var r1 = rxform.getItem(0);
  // Todo: Do frame-independent instance checking
  return r1 instanceof SVGTransform && t1 instanceof SVGTransform && r1.type === t1.type && r1.angle === t1.angle && r1.matrix.a === t1.matrix.a && r1.matrix.b === t1.matrix.b && r1.matrix.c === t1.matrix.c && r1.matrix.d === t1.matrix.d && r1.matrix.e === t1.matrix.e && r1.matrix.f === t1.matrix.f;
}();

function supportsNativeTransformLists() {
  return supportsNativeSVGTransformLists_;
};

function getRotationAngleFromTransformList(tlist, toRad) {
  if (!tlist) {
    return 0;
  } // <svg> elements have no tlist
  var N = tlist.numberOfItems;
  for (var i = 0; i < N; ++i) {
    var xform = tlist.getItem(i);
    if (xform.type === 4) {
      return toRad ? xform.angle * Math.PI / 180.0 : xform.angle;
    }
  }
  return 0.0;
};


function hasMatrixTransform(tlist) {
  if (!tlist) {
    return false;
  }
  var num = tlist.numberOfItems;
  while (num--) {
    var xform = tlist.getItem(num);
    if (xform.type === 1 && !isIdentity(xform.matrix)) {
      return true;
    }
  }
  return false;
};

function isIdentity(m) {
  return m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1 && m.e === 0 && m.f === 0;
};


function bBoxCanBeOptimizedOverNativeGetBBox(angle, hasMatrixTransform$$1) {
  var angleModulo90 = angle % 90;
  var closeTo90 = angleModulo90 < -89.99 || angleModulo90 > 89.99;
  var closeTo0 = angleModulo90 > -0.001 && angleModulo90 < 0.001;
  return hasMatrixTransform$$1 || !(closeTo0 || closeTo90);
}

function getExtraAttributesForConvertToPath(elem) {
  var attrs = {};
  // TODO: make this list global so that we can properly maintain it
  // TODO: what about @transform, @clip-rule, @fill-rule, etc?
  $$2.each(['marker-start', 'marker-end', 'marker-mid', 'filter', 'clip-path'], function () {
    var a = elem.getAttribute(this);
    if (a) {
      attrs[this] = a;
    }
  });
  return attrs;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

function getPathDFromSegments(pathSegments) {
  var d = '';

  $$2.each(pathSegments, function (j, _ref2) {
    var _ref3 = slicedToArray(_ref2, 2),
        singleChar = _ref3[0],
        pts = _ref3[1];

    d += singleChar;
    for (var i = 0; i < pts.length; i += 2) {
      d += pts[i] + ',' + pts[i + 1] + ' ';
    }
  });

  return d;
};

function getPathDFromElement(elem) {
  // Possibly the cubed root of 6, but 1.81 works best
  var num = 1.81;
  var d = void 0,
      a = void 0,
      rx = void 0,
      ry = void 0;
  switch (elem.tagName) {
    case 'ellipse':
    case 'circle':
      a = $$2(elem).attr(['rx', 'ry', 'cx', 'cy']);
      var _a = a,
          cx = _a.cx,
          cy = _a.cy;
      var _a2 = a;
      rx = _a2.rx;
      ry = _a2.ry;

      if (elem.tagName === 'circle') {
        rx = ry = $$2(elem).attr('r');
      }

      d = getPathDFromSegments([['M', [cx - rx, cy]], ['C', [cx - rx, cy - ry / num, cx - rx / num, cy - ry, cx, cy - ry]], ['C', [cx + rx / num, cy - ry, cx + rx, cy - ry / num, cx + rx, cy]], ['C', [cx + rx, cy + ry / num, cx + rx / num, cy + ry, cx, cy + ry]], ['C', [cx - rx / num, cy + ry, cx - rx, cy + ry / num, cx - rx, cy]], ['Z', []]]);
      break;
    case 'path':
      d = elem.getAttribute('d');
      break;
    case 'line':
      a = $$2(elem).attr(['x1', 'y1', 'x2', 'y2']);
      d = 'M' + a.x1 + ',' + a.y1 + 'L' + a.x2 + ',' + a.y2;
      break;
    case 'polyline':
      d = 'M' + elem.getAttribute('points');
      break;
    case 'polygon':
      d = 'M' + elem.getAttribute('points') + ' Z';
      break;
    case 'rect':
      var r = $$2(elem).attr(['rx', 'ry']);
      rx = r.rx;
      ry = r.ry;

      var _b = elem.getBBox();
      var x = _b.x,
          y = _b.y,
          w = _b.width,
          h = _b.height;

      num = 4 - num; // Why? Because!

      if (!rx && !ry) {
        // Regular rect
        d = getPathDFromSegments([['M', [x, y]], ['L', [x + w, y]], ['L', [x + w, y + h]], ['L', [x, y + h]], ['L', [x, y]], ['Z', []]]);
      } else {
        d = getPathDFromSegments([['M', [x, y + ry]], ['C', [x, y + ry / num, x + rx / num, y, x + rx, y]], ['L', [x + w - rx, y]], ['C', [x + w - rx / num, y, x + w, y + ry / num, x + w, y + ry]], ['L', [x + w, y + h - ry]], ['C', [x + w, y + h - ry / num, x + w - rx / num, y + h, x + w - rx, y + h]], ['L', [x + rx, y + h]], ['C', [x + rx / num, y + h, x, y + h - ry / num, x, y + h - ry]], ['L', [x, y + ry]], ['Z', []]]);
      }
      break;
    default:
      break;
  }

  return d;
};

function getBBoxOfElementAsPath(elem, addSVGElementFromJson, pathActions$$1) {
  var path$$1 = addSVGElementFromJson({
    element: 'path',
    attr: getExtraAttributesForConvertToPath(elem)
  });

  var eltrans = elem.getAttribute('transform');
  if (eltrans) {
    path$$1.setAttribute('transform', eltrans);
  }

  var parent = elem.parentNode;
  if (elem.nextSibling) {
    elem.before(path$$1);
  } else {
    parent.append(path$$1);
  }

  var d = getPathDFromElement(elem);
  if (d) {
    path$$1.setAttribute('d', d);
  } else {
    path$$1.remove();
  }

  // Get the correct BBox of the new path, then discard it
  pathActions$$1.resetOrientation(path$$1);
  var bb = false;
  try {
    bb = path$$1.getBBox();
  } catch (e) {
    // Firefox fails
  }
  path$$1.remove();
  return bb;
};

function matrixMultiply() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var m = args.reduceRight(function (prev, m1) {
    return m1.multiply(prev);
  });

  if (Math.abs(m.a) < NEAR_ZERO) {
    m.a = 0;
  }
  if (Math.abs(m.b) < NEAR_ZERO) {
    m.b = 0;
  }
  if (Math.abs(m.c) < NEAR_ZERO) {
    m.c = 0;
  }
  if (Math.abs(m.d) < NEAR_ZERO) {
    m.d = 0;
  }
  if (Math.abs(m.e) < NEAR_ZERO) {
    m.e = 0;
  }
  if (Math.abs(m.f) < NEAR_ZERO) {
    m.f = 0;
  }

  return m;
};

function transformListToTransform(tlist, min, max) {
  if (tlist == null) {
    // Or should tlist = null have been prevented before this?
    return svg$1.createSVGTransformFromMatrix(svg$1.createSVGMatrix());
  }
  min = min || 0;
  max = max || tlist.numberOfItems - 1;
  min = parseInt(min, 10);
  max = parseInt(max, 10);
  if (min > max) {
    var temp = max;max = min;min = temp;
  }
  var m = svg$1.createSVGMatrix();
  for (var i = min; i <= max; ++i) {
    // if our indices are out of range, just use a harmless identity matrix
    var mtom = i >= 0 && i < tlist.numberOfItems ? tlist.getItem(i).matrix : svg$1.createSVGMatrix();
    m = matrixMultiply(m, mtom);
  }
  return svg$1.createSVGTransformFromMatrix(m);
};

function transformPoint(x, y, m) {
  return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f };
};

function transformBox(l, t, w, h, m) {
  var tl = transformPoint(l, t, m),
      tr = transformPoint(l + w, t, m),
      bl = transformPoint(l, t + h, m),
      br = transformPoint(l + w, t + h, m),
      minx = Math.min(tl.x, tr.x, bl.x, br.x),
      maxx = Math.max(tl.x, tr.x, bl.x, br.x),
      miny = Math.min(tl.y, tr.y, bl.y, br.y),
      maxy = Math.max(tl.y, tr.y, bl.y, br.y);

  return {
    tl: tl,
    tr: tr,
    bl: bl,
    br: br,
    aabox: {
      x: minx,
      y: miny,
      width: maxx - minx,
      height: maxy - miny
    }
  };
};

function getBBoxWithTransform(elem, addSVGElementFromJson, pathActions$$1) {
  // TODO: Fix issue with rotated groups. Currently they work
  // fine in FF, but not in other browsers (same problem mentioned
  // in Issue 339 comment #2).

  var bb = getBBox(elem);

  if (!bb) {
    return null;
  }

  var tlist = getTransformList(elem);
  var angle = getRotationAngleFromTransformList(tlist);
  var hasMatrixXForm = hasMatrixTransform(tlist);

  if (angle || hasMatrixXForm) {
    var goodBb = false;
    if (bBoxCanBeOptimizedOverNativeGetBBox(angle, hasMatrixXForm)) {
      // Get the BBox from the raw path for these elements
      // TODO: why ellipse and not circle
      var elemNames = ['ellipse', 'path', 'line', 'polyline', 'polygon'];
      if (elemNames.includes(elem.tagName)) {
        bb = goodBb = getBBoxOfElementAsPath(elem, addSVGElementFromJson, pathActions$$1);
      } else if (elem.tagName === 'rect') {
        // Look for radius
        var rx = elem.getAttribute('rx');
        var ry = elem.getAttribute('ry');
        if (rx || ry) {
          bb = goodBb = getBBoxOfElementAsPath(elem, addSVGElementFromJson, pathActions$$1);
        }
      }
    }

    if (!goodBb) {
      var _transformListToTrans = transformListToTransform(tlist),
          matrix = _transformListToTrans.matrix;

      bb = transformBox(bb.x, bb.y, bb.width, bb.height, matrix).aabox;

      // Old technique that was exceedingly slow with large documents.
      //
      // Accurate way to get BBox of rotated element in Firefox:
      // Put element in group and get its BBox
      //
      // Must use clone else FF freaks out
      // const clone = elem.cloneNode(true);
      // const g = document.createElementNS(NS.SVG, 'g');
      // const parent = elem.parentNode;
      // parent.append(g);
      // g.append(clone);
      // const bb2 = bboxToObj(g.getBBox());
      // g.remove();
    }
  }
  return bb;
};

function getStrokeOffsetForBBox(elem) {
  var sw = elem.getAttribute('stroke-width');
  return !isNaN(sw) && elem.getAttribute('stroke') !== 'none' ? sw / 2 : 0;
}

function getStrokedBBox(elems, addSVGElementFromJson, pathActions$$1) {
  if (!elems || !elems.length) {
    return false;
  }

  var fullBb = void 0;
  $$2.each(elems, function () {
    if (fullBb) {
      return;
    }
    if (!this.parentNode) {
      return;
    }
    fullBb = getBBoxWithTransform(this, addSVGElementFromJson, pathActions$$1);
  });

  // This shouldn't ever happen...
  if (fullBb === undefined) {
    return null;
  }

  // fullBb doesn't include the stoke, so this does no good!
  // if (elems.length == 1) return fullBb;

  var maxX = fullBb.x + fullBb.width;
  var maxY = fullBb.y + fullBb.height;
  var minX = fullBb.x;
  var minY = fullBb.y;

  // If only one elem, don't call the potentially slow getBBoxWithTransform method again.
  if (elems.length === 1) {
    var offset = getStrokeOffsetForBBox(elems[0]);
    minX -= offset;
    minY -= offset;
    maxX += offset;
    maxY += offset;
  } else {
    $$2.each(elems, function (i, elem) {
      var curBb = getBBoxWithTransform(elem, addSVGElementFromJson, pathActions$$1);
      if (curBb) {
        var _offset = getStrokeOffsetForBBox(elem);
        minX = Math.min(minX, curBb.x - _offset);
        minY = Math.min(minY, curBb.y - _offset);
        // TODO: The old code had this test for max, but not min. I suspect this test should be for both min and max
        if (elem.nodeType === 1) {
          maxX = Math.max(maxX, curBb.x + curBb.width + _offset);
          maxY = Math.max(maxY, curBb.y + curBb.height + _offset);
        }
      }
    });
  }

  fullBb.x = minX;
  fullBb.y = minY;
  fullBb.width = maxX - minX;
  fullBb.height = maxY - minY;
  return fullBb;
};

var _navigator = navigator,
userAgent = _navigator.userAgent;
var isOpera_ = !!window.opera;
var isWebkit_ = userAgent.includes('AppleWebKit');
var isGecko_ = userAgent.includes('Gecko/');
var isIE_ = userAgent.includes('MSIE');
var isChrome_ = userAgent.includes('Chrome/');
var isWindows_ = userAgent.includes('Windows');
var isMac_ = userAgent.includes('Macintosh');
var isTouch_ = 'ontouchstart' in window;
function isWebkit() {
  return isWebkit_;
};

var visElems = 'a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use';
var visElemsArr = visElems.split(',');

function getBBox(elem) {
  var selected = elem;
  if (elem.nodeType !== 1) {
    return null;
  }
  var elname = selected.nodeName;

  var ret = null;
  switch (elname) {
    case 'text':
      if (selected.textContent === '') {
        selected.textContent = 'a'; // Some character needed for the selector to use.
        ret = selected.getBBox();
        selected.textContent = '';
      } else {
        if (selected.getBBox) {
          ret = selected.getBBox();
        }
      }
      break;
    case 'path':
      if (!supportsPathBBox()) {
        ret = getPathBBox(selected);
      } else {
        if (selected.getBBox) {
          ret = selected.getBBox();
        }
      }
      break;
    case 'g':
    case 'a':
      ret = groupBBFix(selected);
      break;
    default:

      if (elname === 'use') {
        ret = groupBBFix(selected, true);
      }
      if (elname === 'use' || elname === 'foreignObject' && isWebkit()) {
        if (!ret) {
          ret = selected.getBBox();
        }
        // This is resolved in later versions of webkit, perhaps we should
        // have a featured detection for correct 'use' behavior?
        // ——————————
        if (!isWebkit()) {
          var bb = {};
          bb.width = ret.width;
          bb.height = ret.height;
          bb.x = ret.x + parseFloat(selected.getAttribute('x') || 0);
          bb.y = ret.y + parseFloat(selected.getAttribute('y') || 0);
          ret = bb;
        }
      } else if (visElemsArr.includes(elname)) {
        if (selected) {
          try {
            ret = selected.getBBox();
          } catch (err) {
            // tspan (and textPath apparently) have no `getBBox` in Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=937268
            // Re: Chrome returning bbox for containing text element, see: https://bugs.chromium.org/p/chromium/issues/detail?id=349835
            var extent = selected.getExtentOfChar(0); // pos+dimensions of the first glyph
            var width = selected.getComputedTextLength(); // width of the tspan
            ret = {
              x: extent.x,
              y: extent.y,
              width: width,
              height: extent.height
            };
          }
        } else {
          // Check if element is child of a foreignObject
          var fo = $$2(selected).closest('foreignObject');
          if (fo.length) {
            if (fo[0].getBBox) {
              ret = fo[0].getBBox();
            }
          }
        }
      }
  }
  if (ret) {
    ret = bboxToObj(ret);
  }

  // get the bounding box from the DOM (which is in that element's coordinate system)
  return ret;
};

function bboxToObj(_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height;

  return { x: x, y: y, width: width, height: height };
};

function getRotationAngle(elem, toRad) {
  var selected = elem
  // find the rotation transform (if any) and set it
  var tlist = getTransformList(selected);
  return getRotationAngleFromTransformList(tlist, toRad);
};


module.exports={
    getBBox:getBBox,
    transformBox:transformBox,
    getTransformList:getTransformList,
    transformListToTransform:transformListToTransform,
    getRotationAngle:getRotationAngle
}