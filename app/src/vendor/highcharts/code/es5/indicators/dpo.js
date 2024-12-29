!/**
 * Highstock JS v11.4.7 (2024-08-14)
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2024 Wojciech Chmiel
 *
 * License: www.highcharts.com/license
 */function(t){"object"==typeof module&&module.exports?(t.default=t,module.exports=t):"function"==typeof define&&define.amd?define("highcharts/indicators/dpo",["highcharts","highcharts/modules/stock"],function(e){return t(e),t.Highcharts=e,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(t){"use strict";var e=t?t._modules:{};function o(e,o,r,n){e.hasOwnProperty(o)||(e[o]=n.apply(null,r),"function"==typeof CustomEvent&&t.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:o,module:e[o]}})))}o(e,"Stock/Indicators/DPO/DPOIndicator.js",[e["Core/Series/SeriesRegistry.js"],e["Core/Utilities.js"]],function(t,e){var o,r=this&&this.__extends||(o=function(t,e){return(o=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}),n=t.seriesTypes.sma,i=e.extend,s=e.merge,a=e.correctFloat,u=e.pick;function c(t,e,o,r,n){var i=u(e[o][r],e[o]);return n?a(t-i):a(t+i)}var p=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e.prototype.getValues=function(t,e){var o,r,n,i,s,a=e.period,p=e.index,f=Math.floor(a/2+1),l=a+f,d=t.xData||[],h=t.yData||[],y=h.length,g=[],m=[],v=[],O=0;if(!(d.length<=l)){for(i=0;i<a-1;i++)O=c(O,h,i,p);for(s=0;s<=y-l;s++)r=s+a-1,n=s+l-1,O=c(O,h,r,p),o=u(h[n][p],h[n])-O/a,O=c(O,h,s,p,!0),g.push([d[n],o]),m.push(d[n]),v.push(o);return{values:g,xData:m,yData:v}}},e.defaultOptions=s(n.defaultOptions,{params:{index:0,period:21}}),e}(n);return i(p.prototype,{nameBase:"DPO"}),t.registerSeriesType("dpo",p),p}),o(e,"masters/indicators/dpo.src.js",[e["Core/Globals.js"]],function(t){return t})});