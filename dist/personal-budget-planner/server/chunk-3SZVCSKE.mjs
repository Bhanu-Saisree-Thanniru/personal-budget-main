import './polyfills.server.mjs';
function w(e,f){var n={};for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&f.indexOf(t)<0&&(n[t]=e[t]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,t=Object.getOwnPropertySymbols(e);i<t.length;i++)f.indexOf(t[i])<0&&Object.prototype.propertyIsEnumerable.call(e,t[i])&&(n[t[i]]=e[t[i]]);return n}function v(e,f,n,t){function i(r){return r instanceof n?r:new n(function(a){a(r)})}return new(n||(n=Promise))(function(r,a){function u(c){try{s(t.next(c))}catch(p){a(p)}}function l(c){try{s(t.throw(c))}catch(p){a(p)}}function s(c){c.done?r(c.value):i(c.value).then(u,l)}s((t=t.apply(e,f||[])).next())})}function _(e){var f=typeof Symbol=="function"&&Symbol.iterator,n=f&&e[f],t=0;if(n)return n.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&t>=e.length&&(e=void 0),{value:e&&e[t++],done:!e}}};throw new TypeError(f?"Object is not iterable.":"Symbol.iterator is not defined.")}function d(e){return this instanceof d?(this.v=e,this):new d(e)}function m(e,f,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=n.apply(e,f||[]),i,r=[];return i={},a("next"),a("throw"),a("return"),i[Symbol.asyncIterator]=function(){return this},i;function a(o){t[o]&&(i[o]=function(y){return new Promise(function(h,b){r.push([o,y,h,b])>1||u(o,y)})})}function u(o,y){try{l(t[o](y))}catch(h){p(r[0][3],h)}}function l(o){o.value instanceof d?Promise.resolve(o.value.v).then(s,c):p(r[0][2],o)}function s(o){u("next",o)}function c(o){u("throw",o)}function p(o,y){o(y),r.shift(),r.length&&u(r[0][0],r[0][1])}}function g(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var f=e[Symbol.asyncIterator],n;return f?f.call(e):(e=typeof _=="function"?_(e):e[Symbol.iterator](),n={},t("next"),t("throw"),t("return"),n[Symbol.asyncIterator]=function(){return this},n);function t(r){n[r]=e[r]&&function(a){return new Promise(function(u,l){a=e[r](a),i(u,l,a.done,a.value)})}}function i(r,a,u,l){Promise.resolve(l).then(function(s){r({value:s,done:u})},a)}}export{w as a,v as b,d as c,m as d,g as e};
