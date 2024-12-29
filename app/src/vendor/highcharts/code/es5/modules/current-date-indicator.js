!/**
 * Highcharts Gantt JS v11.4.7 (2024-08-14)
 *
 * CurrentDateIndicator
 *
 * (c) 2010-2024 Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */function(t){"object"==typeof module&&module.exports?(t.default=t,module.exports=t):"function"==typeof define&&define.amd?define("highcharts/modules/current-date-indicator",["highcharts"],function(e){return t(e),t.Highcharts=e,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(t){"use strict";var e=t?t._modules:{};function n(e,n,o,a){e.hasOwnProperty(n)||(e[n]=a.apply(null,o),"function"==typeof CustomEvent&&t.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:n,module:e[n]}})))}n(e,"Extensions/CurrentDateIndication.js",[e["Core/Globals.js"],e["Core/Utilities.js"]],function(t,e){var n=t.composed,o=e.addEvent,a=e.merge,i=e.pushUnique,r=e.wrap,s={color:"#ccd3ff",width:2,label:{format:"%a, %b %d %Y, %H:%M",formatter:function(t,e){return this.axis.chart.time.dateFormat(e||"",t)},rotation:0,style:{fontSize:"0.7em"}}};function c(){var t=this.options,e=t.currentDateIndicator;if(e){var n="object"==typeof e?a(s,e):a(s);n.value=Date.now(),n.className="highcharts-current-date-indicator",t.plotLines||(t.plotLines=[]),t.plotLines.push(n)}}function l(){this.label&&this.label.attr({text:this.getLabelText(this.options.label)})}function u(t,e){var n=this.options;return n&&n.className&&-1!==n.className.indexOf("highcharts-current-date-indicator")&&n.label&&"function"==typeof n.label.formatter?(n.value=Date.now(),n.label.formatter.call(this,n.value,n.label.format)):t.call(this,e)}return{compose:function(t,e){i(n,"CurrentDateIndication")&&(o(t,"afterSetOptions",c),o(e,"render",l),r(e.prototype,"getLabelText",u))}}}),n(e,"masters/modules/current-date-indicator.src.js",[e["Core/Globals.js"],e["Extensions/CurrentDateIndication.js"]],function(t,e){return e.compose(t.Axis,t.PlotLineOrBand),t})});