var version = "2.1.3-0";

const CARD_NAME = "Meteogram Card";
const METEOGRAM_CARD_STARTUP_TIME = new Date();
const DIAGNOSTICS_DEFAULT = version.includes("beta");

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=globalThis,e$4=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$5=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$5.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$4=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$4)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$3,defineProperty:e$3,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$4,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$3(t,s),b={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$3(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$4(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$2=t$2.trustedTypes,s$1=i$2?i$2.createPolicy("lit-html",{createHTML:t=>t}):void 0,e$2="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$3="?"+h,n$1=`<${o$3}>`,r$2=document,l=()=>r$2.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r$2.createTreeWalker(r$2,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n$1:d>=0?(o.push(a),s.slice(0,d)+e$2+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e$2)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$2?i$2.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$3)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r$2.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r$2).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r$2,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r$2.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t$2.litHtmlPolyfillSupport;j?.(N,R),(t$2.litHtmlVersions??=[]).push("3.3.1");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$1 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return T}};i$1._$litElement$=true,i$1["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$1});const o$2=s.litElementPolyfillSupport;o$2?.({LitElement:i$1});(s.litElementVersions??=[]).push("4.2.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{ void 0!==o?o.addInitializer((()=>{customElements.define(t,e);})):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o$1={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o$1,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

var enLocale = {
	"ui.card.meteogram.attribution": "Data from",
	"ui.card.meteogram.status.cached": "cached",
	"ui.card.meteogram.status.success": "success",
	"ui.card.meteogram.status.failed": "failed",
	"ui.card.meteogram.status_panel": "Status Panel",
	"ui.card.meteogram.status.expires_at": "Expires At",
	"ui.card.meteogram.status.last_render": "Last Render",
	"ui.card.meteogram.status.last_fingerprint_miss": "Last Fingerprint Miss",
	"ui.card.meteogram.status.last_data_fetch": "Last Data Fetch",
	"ui.card.meteogram.status.last_cached": "Last cached",
	"ui.card.meteogram.status.api_success": "API Success",
	"ui.card.meteogram.error": "Weather data not available",
	"ui.card.meteogram.attributes.temperature": "Temperature",
	"ui.card.meteogram.attributes.air_pressure": "Pressure",
	"ui.card.meteogram.attributes.precipitation": "Rain",
	"ui.card.meteogram.attributes.snow": "Snow",
	"ui.card.meteogram.attributes.cloud_coverage": "Cloud Cover",
	"ui.card.meteogram.attributes.weather_icons": "Show Weather Icons",
	"ui.card.meteogram.attributes.wind": "Show Wind",
	"ui.card.meteogram.attributes.dense_icons": "Dense Weather Icons (every hour)",
	"ui.card.meteogram.attributes.fill_container": "Fill Container",
	"ui.editor.meteogram.title": "Meteogram Card Settings",
	"ui.editor.meteogram.title_label": "Title",
	"ui.editor.meteogram.location_info": "Location coordinates will be used to fetch weather data directly from Met.no API.",
	"ui.editor.meteogram.using_ha_location": "Using Home Assistant's location by default.",
	"ui.editor.meteogram.latitude": "Latitude",
	"ui.editor.meteogram.longitude": "Longitude",
	"ui.editor.meteogram.default": "Default",
	"ui.editor.meteogram.leave_empty": "Leave empty to use Home Assistant's configured location",
	"ui.editor.meteogram.display_options": "Display Options",
	"ui.editor.meteogram.meteogram_length": "Meteogram Length",
	"ui.editor.meteogram.hours_8": "8 hours",
	"ui.editor.meteogram.hours_12": "12 hours",
	"ui.editor.meteogram.hours_24": "24 hours",
	"ui.editor.meteogram.hours_48": "48 hours",
	"ui.editor.meteogram.hours_54": "54 hours",
	"ui.editor.meteogram.hours_max": "Max available",
	"ui.editor.meteogram.choose_hours": "Choose how many hours to show in the meteogram",
	"ui.editor.meteogram.attributes.cloud_coverage": "Show Cloud Cover",
	"ui.editor.meteogram.attributes.air_pressure": "Show Pressure",
	"ui.editor.meteogram.attributes.precipitation": "Show Rain",
	"ui.editor.meteogram.attributes.weather_icons": "Show Weather Icons",
	"ui.editor.meteogram.attributes.wind": "Show Wind",
	"ui.editor.meteogram.attributes.dense_icons": "Dense Weather Icons (every hour)",
	"ui.editor.meteogram.attributes.fill_container": "Fill Container"
};

var nbLocale = {
	"ui.card.meteogram.attribution": "Data fra",
	"ui.card.meteogram.status.cached": "bufret",
	"ui.card.meteogram.status.success": "suksess",
	"ui.card.meteogram.status.failed": "feilet",
	"ui.card.meteogram.status_panel": "Statuspanel",
	"ui.card.meteogram.status.expires_at": "Utløper",
	"ui.card.meteogram.status.last_render": "Sist tegnet",
	"ui.card.meteogram.status.last_fingerprint_miss": "Siste fingerprint-miss",
	"ui.card.meteogram.status.last_data_fetch": "Siste datainnhenting",
	"ui.card.meteogram.status.last_cached": "Sist bufret",
	"ui.card.meteogram.status.api_success": "API-suksess",
	"ui.card.meteogram.error": "Værdata ikke tilgjengelig",
	"ui.card.meteogram.attributes.temperature": "Temperatur",
	"ui.card.meteogram.attributes.air_pressure": "Lufttrykk",
	"ui.card.meteogram.attributes.precipitation": "Regn",
	"ui.card.meteogram.attributes.snow": "Snø",
	"ui.card.meteogram.attributes.cloud_coverage": "Skydekke",
	"ui.card.meteogram.attributes.weather_icons": "Vis værikoner",
	"ui.card.meteogram.attributes.wind": "Vis vind",
	"ui.card.meteogram.attributes.dense_icons": "Tette værikoner (hver time)",
	"ui.card.meteogram.attributes.fill_container": "Fyll beholder",
	"ui.editor.meteogram.title": "Meteogram-kortinnstillinger",
	"ui.editor.meteogram.title_label": "Tittel",
	"ui.editor.meteogram.location_info": "Lokasjonskoordinater brukes for å hente værdata direkte fra Met.no API.",
	"ui.editor.meteogram.using_ha_location": "Bruker Home Assistants lokasjon som standard.",
	"ui.editor.meteogram.latitude": "Breddegrad",
	"ui.editor.meteogram.longitude": "Lengdegrad",
	"ui.editor.meteogram.default": "Standard",
	"ui.editor.meteogram.leave_empty": "La stå tomt for å bruke Home Assistants konfigurerte lokasjon",
	"ui.editor.meteogram.display_options": "Visningsvalg",
	"ui.editor.meteogram.meteogram_length": "Meteogramlengde",
	"ui.editor.meteogram.hours_8": "8 timer",
	"ui.editor.meteogram.hours_12": "12 timer",
	"ui.editor.meteogram.hours_24": "24 timer",
	"ui.editor.meteogram.hours_48": "48 timer",
	"ui.editor.meteogram.hours_54": "54 timer",
	"ui.editor.meteogram.hours_max": "Maks tilgjengelig",
	"ui.editor.meteogram.choose_hours": "Velg hvor mange timer som skal vises i meteogrammet",
	"ui.editor.meteogram.attributes.cloud_coverage": "Vis skydekke",
	"ui.editor.meteogram.attributes.air_pressure": "Vis lufttrykk",
	"ui.editor.meteogram.attributes.precipitation": "Vis regn",
	"ui.editor.meteogram.attributes.weather_icons": "Vis værikoner",
	"ui.editor.meteogram.attributes.wind": "Vis vind",
	"ui.editor.meteogram.attributes.dense_icons": "Tette værikoner (hver time)",
	"ui.editor.meteogram.attributes.fill_container": "Fyll beholder"
};

var esLocale = {
	"ui.card.meteogram.attribution": "Datos de",
	"ui.card.meteogram.status.cached": "en caché",
	"ui.card.meteogram.status.success": "éxito",
	"ui.card.meteogram.status.failed": "fallido",
	"ui.card.meteogram.status_panel": "Panel de estado",
	"ui.card.meteogram.status.expires_at": "Expira en",
	"ui.card.meteogram.status.last_render": "Última representación",
	"ui.card.meteogram.status.last_fingerprint_miss": "Última huella fallida",
	"ui.card.meteogram.status.last_data_fetch": "Última obtención de datos",
	"ui.card.meteogram.status.last_cached": "Último en caché",
	"ui.card.meteogram.status.api_success": "Éxito de la API",
	"ui.card.meteogram.error": "Datos meteorológicos no disponibles",
	"ui.card.meteogram.attributes.temperature": "Temperatura",
	"ui.card.meteogram.attributes.air_pressure": "Presión",
	"ui.card.meteogram.attributes.precipitation": "Lluvia",
	"ui.card.meteogram.attributes.snow": "Nieve",
	"ui.card.meteogram.attributes.cloud_coverage": "Cobertura de nubes",
	"ui.card.meteogram.attributes.weather_icons": "Mostrar iconos meteorológicos",
	"ui.card.meteogram.attributes.wind": "Mostrar viento",
	"ui.card.meteogram.attributes.dense_icons": "Iconos meteorológicos densos (cada hora)",
	"ui.card.meteogram.attributes.fill_container": "Rellenar el contenedor",
	"ui.editor.meteogram.title": "Configuración de la tarjeta Meteograma",
	"ui.editor.meteogram.title_label": "Título",
	"ui.editor.meteogram.location_info": "Las coordenadas se utilizarán para obtener datos meteorológicos directamente de la API de Met.no.",
	"ui.editor.meteogram.using_ha_location": "Usando la ubicación de Home Assistant por defecto.",
	"ui.editor.meteogram.latitude": "Latitud",
	"ui.editor.meteogram.longitude": "Longitud",
	"ui.editor.meteogram.default": "Predeterminado",
	"ui.editor.meteogram.leave_empty": "Dejar vacío para usar la ubicación configurada en Home Assistant",
	"ui.editor.meteogram.display_options": "Opciones de visualización",
	"ui.editor.meteogram.meteogram_length": "Duración del meteograma",
	"ui.editor.meteogram.hours_8": "8 horas",
	"ui.editor.meteogram.hours_12": "12 horas",
	"ui.editor.meteogram.hours_24": "24 horas",
	"ui.editor.meteogram.hours_48": "48 horas",
	"ui.editor.meteogram.hours_54": "54 horas",
	"ui.editor.meteogram.hours_max": "Máximo disponible",
	"ui.editor.meteogram.choose_hours": "Elija cuántas horas mostrar en el meteograma",
	"ui.editor.meteogram.attributes.cloud_coverage": "Mostrar cobertura de nubes",
	"ui.editor.meteogram.attributes.air_pressure": "Mostrar presión",
	"ui.editor.meteogram.attributes.precipitation": "Mostrar lluvia",
	"ui.editor.meteogram.attributes.weather_icons": "Mostrar iconos meteorológicos",
	"ui.editor.meteogram.attributes.wind": "Mostrar viento",
	"ui.editor.meteogram.attributes.dense_icons": "Iconos meteorológicos densos (cada hora)",
	"ui.editor.meteogram.attributes.fill_container": "Rellenar el contenedor"
};

var itLocale = {
	"ui.card.meteogram.attribution": "Dati da",
	"ui.card.meteogram.status.cached": "memorizzato",
	"ui.card.meteogram.status.success": "successo",
	"ui.card.meteogram.status.failed": "fallito",
	"ui.card.meteogram.status_panel": "Pannello di stato",
	"ui.card.meteogram.status.expires_at": "Scade il",
	"ui.card.meteogram.status.last_render": "Ultima visualizzazione",
	"ui.card.meteogram.status.last_fingerprint_miss": "Ultima impronta mancante",
	"ui.card.meteogram.status.last_data_fetch": "Ultimo recupero dati",
	"ui.card.meteogram.status.last_cached": "Ultimo memorizzato",
	"ui.card.meteogram.status.api_success": "Successo API",
	"ui.card.meteogram.error": "Dati meteorologici non disponibili",
	"ui.card.meteogram.attributes.temperature": "Temperatura",
	"ui.card.meteogram.attributes.air_pressure": "Pressione",
	"ui.card.meteogram.attributes.precipitation": "Pioggia",
	"ui.card.meteogram.attributes.snow": "Neve",
	"ui.card.meteogram.attributes.cloud_coverage": "Copertura nuvolosa",
	"ui.card.meteogram.attributes.weather_icons": "Mostra icone meteo",
	"ui.card.meteogram.attributes.wind": "Mostra vento",
	"ui.card.meteogram.attributes.dense_icons": "Icone meteo dense (ogni ora)",
	"ui.card.meteogram.attributes.fill_container": "Riempi contenitore",
	"ui.editor.meteogram.title": "Impostazioni della scheda Meteogramma",
	"ui.editor.meteogram.title_label": "Titolo",
	"ui.editor.meteogram.location_info": "Le coordinate verranno utilizzate per ottenere i dati meteorologici direttamente dall'API Met.no.",
	"ui.editor.meteogram.using_ha_location": "Utilizzo della posizione di Home Assistant come predefinita.",
	"ui.editor.meteogram.latitude": "Latitudine",
	"ui.editor.meteogram.longitude": "Longitudine",
	"ui.editor.meteogram.default": "Predefinito",
	"ui.editor.meteogram.leave_empty": "Lascia vuoto per usare la posizione configurata in Home Assistant",
	"ui.editor.meteogram.display_options": "Opzioni di visualizzazione",
	"ui.editor.meteogram.meteogram_length": "Durata meteogramma",
	"ui.editor.meteogram.hours_8": "8 ore",
	"ui.editor.meteogram.hours_12": "12 ore",
	"ui.editor.meteogram.hours_24": "24 ore",
	"ui.editor.meteogram.hours_48": "48 ore",
	"ui.editor.meteogram.hours_54": "54 ore",
	"ui.editor.meteogram.hours_max": "Massimo disponibile",
	"ui.editor.meteogram.choose_hours": "Scegli quante ore mostrare nel meteogramma",
	"ui.editor.meteogram.attributes.cloud_coverage": "Mostra copertura nuvolosa",
	"ui.editor.meteogram.attributes.air_pressure": "Mostra pressione",
	"ui.editor.meteogram.attributes.precipitation": "Mostra pioggia",
	"ui.editor.meteogram.attributes.weather_icons": "Mostra icone meteo",
	"ui.editor.meteogram.attributes.wind": "Mostra vento",
	"ui.editor.meteogram.attributes.dense_icons": "Icone meteo dense (ogni ora)",
	"ui.editor.meteogram.attributes.fill_container": "Riempi contenitore"
};

var deLocale = {
	"ui.card.meteogram.attribution": "Daten von",
	"ui.card.meteogram.status.cached": "zwischengespeichert",
	"ui.card.meteogram.status.success": "Erfolg",
	"ui.card.meteogram.status.failed": "Fehler",
	"ui.card.meteogram.status_panel": "Statuspanel",
	"ui.card.meteogram.status.expires_at": "Ablaufdatum",
	"ui.card.meteogram.status.last_render": "Letzte Darstellung",
	"ui.card.meteogram.status.last_fingerprint_miss": "Letzter Fingerabdruck-Fehler",
	"ui.card.meteogram.status.last_data_fetch": "Letzter Datenabruf",
	"ui.card.meteogram.status.last_cached": "Zuletzt zwischengespeichert",
	"ui.card.meteogram.status.api_success": "API-Erfolg",
	"ui.card.meteogram.error": "Wetterdaten nicht verfügbar",
	"ui.card.meteogram.attributes.temperature": "Temperatur",
	"ui.card.meteogram.attributes.air_pressure": "Luftdruck",
	"ui.card.meteogram.attributes.precipitation": "Regen",
	"ui.card.meteogram.attributes.snow": "Schnee",
	"ui.card.meteogram.attributes.cloud_coverage": "Wolkenbedeckung",
	"ui.card.meteogram.attributes.weather_icons": "Wetter-Symbole anzeigen",
	"ui.card.meteogram.attributes.wind": "Wind anzeigen",
	"ui.card.meteogram.attributes.dense_icons": "Dichte Wettersymbole (jede Stunde)",
	"ui.card.meteogram.attributes.fill_container": "Container ausfüllen",
	"ui.editor.meteogram.title": "Meteogramm-Karteneinstellungen",
	"ui.editor.meteogram.title_label": "Titel",
	"ui.editor.meteogram.location_info": "Die Koordinaten werden verwendet, um Wetterdaten direkt von der Met.no API abzurufen.",
	"ui.editor.meteogram.using_ha_location": "Standardmäßig wird der Standort von Home Assistant verwendet.",
	"ui.editor.meteogram.latitude": "Breitengrad",
	"ui.editor.meteogram.longitude": "Längengrad",
	"ui.editor.meteogram.default": "Standard",
	"ui.editor.meteogram.leave_empty": "Leer lassen, um die konfigurierte Position von Home Assistant zu verwenden",
	"ui.editor.meteogram.display_options": "Anzeigeoptionen",
	"ui.editor.meteogram.meteogram_length": "Meteogramm-Länge",
	"ui.editor.meteogram.hours_8": "8 Stunden",
	"ui.editor.meteogram.hours_12": "12 Stunden",
	"ui.editor.meteogram.hours_24": "24 Stunden",
	"ui.editor.meteogram.hours_48": "48 Stunden",
	"ui.editor.meteogram.hours_54": "54 Stunden",
	"ui.editor.meteogram.hours_max": "Maximal verfügbar",
	"ui.editor.meteogram.choose_hours": "Wählen Sie, wie viele Stunden im Meteogramm angezeigt werden sollen",
	"ui.editor.meteogram.attributes.cloud_coverage": "Wolkenbedeckung anzeigen",
	"ui.editor.meteogram.attributes.air_pressure": "Luftdruck anzeigen",
	"ui.editor.meteogram.attributes.precipitation": "Regen anzeigen",
	"ui.editor.meteogram.attributes.weather_icons": "Wetter-Symbole anzeigen",
	"ui.editor.meteogram.attributes.wind": "Wind anzeigen",
	"ui.editor.meteogram.attributes.dense_icons": "Dichte Wettersymbole (jede Stunde)",
	"ui.editor.meteogram.attributes.fill_container": "Container ausfüllen"
};

var frLocale = {
	"ui.card.meteogram.attribution": "Données de",
	"ui.card.meteogram.status.cached": "mis en cache",
	"ui.card.meteogram.status.success": "succès",
	"ui.card.meteogram.status.failed": "échec",
	"ui.card.meteogram.status_panel": "Panneau d'état",
	"ui.card.meteogram.status.expires_at": "Expire à",
	"ui.card.meteogram.status.last_render": "Dernier rendu",
	"ui.card.meteogram.status.last_fingerprint_miss": "Dernière empreinte manquée",
	"ui.card.meteogram.status.last_data_fetch": "Dernière récupération de données",
	"ui.card.meteogram.status.last_cached": "Dernière mise en cache",
	"ui.card.meteogram.status.api_success": "Succès API",
	"ui.card.meteogram.error": "Données météo non disponibles",
	"ui.card.meteogram.attributes.temperature": "Température",
	"ui.card.meteogram.attributes.air_pressure": "Pression",
	"ui.card.meteogram.attributes.precipitation": "Pluie",
	"ui.card.meteogram.attributes.snow": "Neige",
	"ui.card.meteogram.attributes.cloud_coverage": "Couverture nuageuse",
	"ui.card.meteogram.attributes.weather_icons": "Afficher les icônes météo",
	"ui.card.meteogram.attributes.wind": "Afficher le vent",
	"ui.card.meteogram.attributes.dense_icons": "Icônes météo denses (chaque heure)",
	"ui.card.meteogram.attributes.fill_container": "Remplir le conteneur",
	"ui.editor.meteogram.title": "Paramètres de la carte Météogramme",
	"ui.editor.meteogram.title_label": "Titre",
	"ui.editor.meteogram.location_info": "Les coordonnées seront utilisées pour obtenir les données météo directement depuis l'API Met.no.",
	"ui.editor.meteogram.using_ha_location": "Utilisation de la localisation Home Assistant par défaut.",
	"ui.editor.meteogram.latitude": "Latitude",
	"ui.editor.meteogram.longitude": "Longitude",
	"ui.editor.meteogram.default": "Défaut",
	"ui.editor.meteogram.leave_empty": "Laisser vide pour utiliser la localisation configurée dans Home Assistant",
	"ui.editor.meteogram.display_options": "Options d'affichage",
	"ui.editor.meteogram.meteogram_length": "Durée du météogramme",
	"ui.editor.meteogram.hours_8": "8 heures",
	"ui.editor.meteogram.hours_12": "12 heures",
	"ui.editor.meteogram.hours_24": "24 heures",
	"ui.editor.meteogram.hours_48": "48 heures",
	"ui.editor.meteogram.hours_54": "54 heures",
	"ui.editor.meteogram.hours_max": "Maximum disponible",
	"ui.editor.meteogram.choose_hours": "Choisissez combien d'heures afficher dans le météogramme",
	"ui.editor.meteogram.attributes.cloud_coverage": "Afficher la couverture nuageuse",
	"ui.editor.meteogram.attributes.air_pressure": "Afficher la pression",
	"ui.editor.meteogram.attributes.precipitation": "Afficher la pluie",
	"ui.editor.meteogram.attributes.weather_icons": "Afficher les icônes météo",
	"ui.editor.meteogram.attributes.wind": "Afficher le vent",
	"ui.editor.meteogram.attributes.dense_icons": "Icônes météo denses (chaque heure)",
	"ui.editor.meteogram.attributes.fill_container": "Remplir le conteneur"
};

// Array of supported locales and their language codes
const locales = [
    { code: "en", data: enLocale },
    { code: "nb", data: nbLocale },
    { code: "es", data: esLocale },
    { code: "it", data: itLocale },
    { code: "de", data: deLocale },
    { code: "fr", data: frLocale },
];
function trnslt(hass, key, fallback) {
    var _a;
    // Try hass.localize (used by HA frontend)
    if (hass && typeof hass.localize === "function") {
        const result = hass.localize(key);
        if (result && result !== key)
            return result;
    }
    // Try hass.resources (used by HA backend)
    if (hass && hass.resources && typeof hass.resources === "object") {
        const lang = hass.language || "en";
        const res = (_a = hass.resources[lang]) === null || _a === void 0 ? void 0 : _a[key];
        if (res)
            return res;
    }
    // Try local translation files
    const lang = (hass && hass.language) ? hass.language : "en";
    // Find the best matching locale by prefix
    const localeObj = locales.find(l => lang.toLowerCase().startsWith(l.code)) ||
        locales[0]; // Default to English if not found
    const localRes = localeObj.data[key];
    if (localRes)
        return localRes;
    // Return fallback if provided, otherwise the key
    return fallback !== undefined ? fallback : key;
}

let MeteogramCardEditor = class MeteogramCardEditor extends i$1 {
    constructor() {
        super(...arguments);
        this._config = {};
        this._initialized = false;
        this._elements = new Map();
    }
    setConfig(config) {
        this._config = config || {};
        if (this._initialized) {
            this._updateValues();
        }
        else {
            this._initialize();
        }
    }
    get config() {
        return this._config;
    }
    connectedCallback() {
        if (!this._initialized) {
            this._initialize();
        }
    }
    _initialize() {
        this.render();
        this._initialized = true;
        setTimeout(() => this._updateValues(), 0); // Wait for DOM to be ready
    }
    // Update only the values, not the entire DOM
    _updateValues() {
        var _a, _b, _c, _d;
        if (!this._initialized)
            return;
        // Helper to update only if value changed
        const setValue = (el, value, prop = 'value') => {
            if (!el)
                return;
            if (el[prop] !== value)
                el[prop] = value;
        };
        setValue(this._elements.get('title'), this._config.title || '');
        setValue(this._elements.get('latitude'), this._config.latitude !== undefined
            ? String(this._config.latitude)
            : (((_b = (_a = this.hass) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.latitude) !== undefined ? String(this.hass.config.latitude) : ''));
        setValue(this._elements.get('longitude'), this._config.longitude !== undefined
            ? String(this._config.longitude)
            : (((_d = (_c = this.hass) === null || _c === void 0 ? void 0 : _c.config) === null || _d === void 0 ? void 0 : _d.longitude) !== undefined ? String(this.hass.config.longitude) : ''));
        setValue(this._elements.get('show_cloud_cover'), this._config.show_cloud_cover !== undefined ? this._config.show_cloud_cover : true, 'checked');
        setValue(this._elements.get('show_pressure'), this._config.show_pressure !== undefined ? this._config.show_pressure : true, 'checked');
        setValue(this._elements.get('show_rain'), this._config.show_rain !== undefined ? this._config.show_rain : true, 'checked');
        setValue(this._elements.get('show_weather_icons'), this._config.show_weather_icons !== undefined ? this._config.show_weather_icons : true, 'checked');
        setValue(this._elements.get('show_wind'), this._config.show_wind !== undefined ? this._config.show_wind : true, 'checked');
        setValue(this._elements.get('dense_weather_icons'), this._config.dense_weather_icons !== undefined ? this._config.dense_weather_icons : true, 'checked');
        setValue(this._elements.get('meteogram_hours'), this._config.meteogram_hours || '48h');
        setValue(this._elements.get('diagnostics'), this._config.diagnostics !== undefined ? this._config.diagnostics : DIAGNOSTICS_DEFAULT, 'checked');
        setValue(this._elements.get('entity_id'), this._config.entity_id || '');
        setValue(this._elements.get('focussed'), this._config.focussed !== undefined ? this._config.focussed : false, 'checked');
    }
    render() {
        var _a, _b, _c, _d, _e;
        const hass = this.hass;
        const config = this._config;
        // Wait for both hass and config to be set before rendering
        if (!hass || !config) {
            this.innerHTML = '<ha-card><div style="padding:16px;">Loading Home Assistant context...</div></ha-card>';
            setTimeout(() => this.render(), 300); // Retry every 300ms until both are set
            return;
        }
        // Get default coordinates from Home Assistant config if available
        const defaultLat = (_b = (_a = hass === null || hass === void 0 ? void 0 : hass.config) === null || _a === void 0 ? void 0 : _a.latitude) !== null && _b !== void 0 ? _b : '';
        const defaultLon = (_d = (_c = hass === null || hass === void 0 ? void 0 : hass.config) === null || _c === void 0 ? void 0 : _c.longitude) !== null && _d !== void 0 ? _d : '';
        // Get current toggle values or default to true
        const showCloudCover = this._config.show_cloud_cover !== undefined ? this._config.show_cloud_cover : true;
        const showPressure = this._config.show_pressure !== undefined ? this._config.show_pressure : true;
        const showRain = this._config.show_rain !== undefined ? this._config.show_rain : true;
        const showWeatherIcons = this._config.show_weather_icons !== undefined ? this._config.show_weather_icons : true;
        const showWind = this._config.show_wind !== undefined ? this._config.show_wind : true;
        const denseWeatherIcons = this._config.dense_weather_icons !== undefined ? this._config.dense_weather_icons : true;
        const meteogramHours = this._config.meteogram_hours || "48h";
        const diagnostics = this._config.diagnostics !== undefined ? this._config.diagnostics : DIAGNOSTICS_DEFAULT;
        const focussed = this._config.focussed !== undefined ? this._config.focussed : false;
        const div = document.createElement('div');
        // Get all weather entities from hass
        const weatherEntities = hass && hass.states
            ? Object.keys(hass.states).filter(eid => eid.startsWith('weather.'))
            : [];
        // Add "none" option at the top
        const selectedEntity = (_e = this._config.entity_id) !== null && _e !== void 0 ? _e : (weatherEntities.length > 0 ? weatherEntities[0] : '');
        const isWeatherEntitySelected = !!(selectedEntity && selectedEntity !== 'none');
        div.innerHTML = `
  <style>
    ha-card {
      padding: 16px;
    }
    .values {
      padding-left: 16px;
      margin: 8px 0;
    }
    .row {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
    }
    ha-textfield {
      width: 100%;
    }
    .side-by-side {
      display: flex;
      gap: 12px;
    }
    .side-by-side > * {
      flex: 1;
    }
    h3 {
      font-size: 18px;
      color: var(--primary-text-color);
      font-weight: 500;
      margin-bottom: 12px;
      margin-top: 0;
    }
    .help-text {
      color: var(--secondary-text-color);
      font-size: 0.875rem;
      margin-top: 4px;
    }
    .info-text {
      color: var(--primary-text-color);
      opacity: 0.8;
      font-size: 0.9rem;
      font-style: italic;
      margin: 4px 0 16px 0;
    }
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .toggle-label {
      flex-grow: 1;
    }
    .toggle-section {
      margin-top: 16px;
      border-top: 1px solid var(--divider-color);
      padding-top: 16px;
    }
  </style>
  <ha-card>
    <h3>${(hass === null || hass === void 0 ? void 0 : hass.localize) ? hass.localize("ui.editor.meteogram.title") : "Meteogram Card Settings"}</h3>
    <div class="values">
      <div class="row">
        <ha-textfield
          label="${(hass === null || hass === void 0 ? void 0 : hass.localize) ? hass.localize("ui.editor.meteogram.title_label") : "Title"}"
          id="title-input"
          .value="${this._config.title || ''}"
        ></ha-textfield>
      </div>
      <p class="help-text">${trnslt(hass, "ui.editor.meteogram.title_description", "Card title (optional, shown at the top of the card)")}</p>

      <div class="row">
        <label for="weather-entity-select" style="margin-right:8px;">${trnslt(hass, "ui.editor.meteogram.weather_entity", "Weather Entity")}</label>
        <select id="weather-entity-select">
          <option value="none" ${!isWeatherEntitySelected ? "selected" : ""}>None</option>
          ${weatherEntities.map(eid => `<option value="${eid}" ${selectedEntity === eid ? "selected" : ""}>${eid}</option>`).join('')}
        </select>
      </div>
      <p class="help-text">${trnslt(hass, "ui.editor.meteogram.choose_weather_entity", "Choose a weather entity for Home Assistant integration, or select 'None' to use coordinates.")}</p>

      <div class="info-text">
        ${(hass === null || hass === void 0 ? void 0 : hass.localize) ? hass.localize("ui.editor.meteogram.location_info") : "Location coordinates will be used to fetch weather data directly from Met.no API."}
        ${defaultLat ? trnslt(hass, "ui.editor.meteogram.using_ha_location", "Using Home Assistant's location by default.") : ""}
      </div>

      <div class="side-by-side">
        <ha-textfield
          label="${trnslt(hass, "ui.editor.meteogram.latitude", "Latitude")}"
          id="latitude-input"
          type="number"
          step="any"
          .value="${this._config.latitude !== undefined ? this._config.latitude : defaultLat}"
          placeholder="${defaultLat ? `${trnslt(hass, "ui.editor.meteogram.default", "Default")}: ${defaultLat}` : ""}"
          ${isWeatherEntitySelected ? "disabled" : ""}
        ></ha-textfield>

        <ha-textfield
          label="${trnslt(hass, "ui.editor.meteogram.longitude", "Longitude")}"
          id="longitude-input"
          type="number"
          step="any"
          .value="${this._config.longitude !== undefined ? this._config.longitude : defaultLon}"
          placeholder="${defaultLon ? `${trnslt(hass, "ui.editor.meteogram.default", "Default")}: ${defaultLon}` : ""}"
          ${isWeatherEntitySelected ? "disabled" : ""}
        ></ha-textfield>
      </div>
      <p class="help-text">${trnslt(hass, "ui.editor.meteogram.leave_empty", "Leave empty to use Home Assistant's configured location")}</p>

      <div class="toggle-section">
        <h3>${trnslt(hass, "ui.editor.meteogram.display_options", "Display Options")}</h3>

        <div class="toggle-row">
          <div class="toggle-label">${trnslt(hass, "ui.editor.meteogram.attributes.cloud_coverage", "Show Cloud Cover")}</div>
          <ha-switch
            id="show-cloud-cover"
            .checked="${showCloudCover}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">${trnslt(hass, "ui.editor.meteogram.attributes.air_pressure", "Show Pressure")}</div>
          <ha-switch
            id="show-pressure"
            .checked="${showPressure}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">${trnslt(hass, "ui.editor.meteogram.attributes.precipitation", "Show Rain")}</div>
          <ha-switch
            id="show-rain"
            .checked="${showRain}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">${trnslt(hass, "ui.editor.meteogram.attributes.weather_icons", "Show Weather Icons")}</div>
          <ha-switch
            id="show-weather-icons"
            .checked="${showWeatherIcons}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">${trnslt(hass, "ui.editor.meteogram.attributes.wind", "Show Wind")}</div>
          <ha-switch
            id="show-wind"
            .checked="${showWind}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">${trnslt(hass, "ui.editor.meteogram.attributes.dense_icons", "Dense Weather Icons (every hour)")}</div>
          <ha-switch
            id="dense-weather-icons"
            .checked="${denseWeatherIcons}"
          ></ha-switch>
        </div>
      
        <div class="toggle-row">
          <div class="toggle-label">${trnslt(hass, "ui.editor.meteogram.attributes.focussed", "Focussed Mode (minimal chart)")}</div>
          <ha-switch
            id="focussed"
            .checked="${focussed}"
          ></ha-switch>
        </div>
      </div>

      <div class="row">
        <label for="meteogram-hours-select" style="margin-right:8px;">${trnslt(hass, "ui.editor.meteogram.meteogram_length", "Meteogram Length")}</label>
        <select id="meteogram-hours-select">
          <option value="8h" ${meteogramHours === "8h" ? "selected" : ""}>${trnslt(hass, "ui.editor.meteogram.hours_8", "8 hours")}</option>
          <option value="12h" ${meteogramHours === "12h" ? "selected" : ""}>${trnslt(hass, "ui.editor.meteogram.hours_12", "12 hours")}</option>
          <option value="24h" ${meteogramHours === "24h" ? "selected" : ""}>${trnslt(hass, "ui.editor.meteogram.hours_24", "24 hours")}</option>
          <option value="48h" ${meteogramHours === "48h" ? "selected" : ""}>${trnslt(hass, "ui.editor.meteogram.hours_48", "48 hours")}</option>
          <option value="54h" ${meteogramHours === "54h" ? "selected" : ""}>${trnslt(hass, "ui.editor.meteogram.hours_54", "54 hours")}</option>
          <option value="max" ${meteogramHours === "max" ? "selected" : ""}>${trnslt(hass, "ui.editor.meteogram.hours_max", "Max available")}</option>
        </select>
      </div>
      <p class="help-text">${trnslt(hass, "ui.editor.meteogram.choose_hours", "Choose how many hours to show in the meteogram")}</p>
      <div class="toggle-section"></div>
        <div class="toggle-row">
          <div class="toggle-label">Diagnostics (debug logging)</div>
          <ha-switch
            id="diagnostics"
            .checked="${diagnostics}"
          ></ha-switch>
        </div>
      </div>
    </div>
  </ha-card>
`;
        // Clear previous content
        this.innerHTML = '';
        // Append new content
        this.appendChild(div);
        // Set up event listeners after DOM is updated
        setTimeout(() => {
            // Get and store references to all input elements with proper type casting
            const titleInput = this.querySelector('#title-input');
            if (titleInput) {
                titleInput.configValue = 'title';
                titleInput.addEventListener('input', this._valueChanged.bind(this));
                this._elements.set('title', titleInput);
            }
            const latInput = this.querySelector('#latitude-input');
            if (latInput) {
                latInput.configValue = 'latitude';
                latInput.addEventListener('input', this._valueChanged.bind(this));
                this._elements.set('latitude', latInput);
            }
            const lonInput = this.querySelector('#longitude-input');
            if (lonInput) {
                lonInput.configValue = 'longitude';
                lonInput.addEventListener('input', this._valueChanged.bind(this));
                this._elements.set('longitude', lonInput);
            }
            // Set up toggle switches
            const cloudCoverSwitch = this.querySelector('#show-cloud-cover');
            if (cloudCoverSwitch) {
                cloudCoverSwitch.configValue = 'show_cloud_cover';
                cloudCoverSwitch.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('show_cloud_cover', cloudCoverSwitch);
            }
            const pressureSwitch = this.querySelector('#show-pressure');
            if (pressureSwitch) {
                pressureSwitch.configValue = 'show_pressure';
                pressureSwitch.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('show_pressure', pressureSwitch);
            }
            const rainSwitch = this.querySelector('#show-rain');
            if (rainSwitch) {
                rainSwitch.configValue = 'show_rain';
                rainSwitch.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('show_rain', rainSwitch);
            }
            const weatherIconsSwitch = this.querySelector('#show-weather-icons');
            if (weatherIconsSwitch) {
                weatherIconsSwitch.configValue = 'show_weather_icons';
                weatherIconsSwitch.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('show_weather_icons', weatherIconsSwitch);
            }
            const windSwitch = this.querySelector('#show-wind');
            if (windSwitch) {
                windSwitch.configValue = 'show_wind';
                windSwitch.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('show_wind', windSwitch);
            }
            const denseWeatherIconsSwitch = this.querySelector('#dense-weather-icons');
            if (denseWeatherIconsSwitch) {
                denseWeatherIconsSwitch.configValue = 'dense_weather_icons';
                denseWeatherIconsSwitch.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('dense_weather_icons', denseWeatherIconsSwitch);
            }
            const meteogramHoursSelect = this.querySelector('#meteogram-hours-select');
            if (meteogramHoursSelect) {
                meteogramHoursSelect.configValue = 'meteogram_hours';
                meteogramHoursSelect.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('meteogram_hours', meteogramHoursSelect);
            }
            const diagnosticsSwitch = this.querySelector('#diagnostics');
            if (diagnosticsSwitch) {
                diagnosticsSwitch.configValue = 'diagnostics';
                diagnosticsSwitch.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('diagnostics', diagnosticsSwitch);
            }
            const weatherEntitySelect = this.querySelector('#weather-entity-select');
            if (weatherEntitySelect) {
                weatherEntitySelect.configValue = 'entity_id';
                weatherEntitySelect.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('entity_id', weatherEntitySelect);
            }
            const focussedSwitch = this.querySelector('#focussed');
            if (focussedSwitch) {
                focussedSwitch.configValue = 'focussed';
                focussedSwitch.addEventListener('change', this._valueChanged.bind(this));
                this._elements.set('focussed', focussedSwitch);
            }
            // Disable/enable lat/lon fields based on weather entity selection
            if (latInput)
                latInput.disabled = isWeatherEntitySelected;
            if (lonInput)
                lonInput.disabled = isWeatherEntitySelected;
            // Update values after setting up elements and listeners
            this._updateValues();
        }, 0);
    }
    // Add the missing _valueChanged method
    _valueChanged(ev) {
        var _a;
        const target = ev.target;
        if (!this._config || !target || !target.configValue)
            return;
        let newValue = target.value;
        // List of boolean config fields
        const boolFields = [
            'show_cloud_cover', 'show_pressure', 'show_rain', 'show_weather_icons',
            'show_wind', 'dense_weather_icons', /* 'fill_container', */ 'diagnostics',
            'focussed'
        ];
        // Handle different input types
        if (target.tagName === 'HA-SWITCH') {
            newValue = target.checked;
        }
        else if (target.type === 'number') {
            if (newValue === '') {
                newValue = undefined;
            }
            else {
                const numValue = parseFloat((_a = newValue === null || newValue === void 0 ? void 0 : newValue.toString()) !== null && _a !== void 0 ? _a : '');
                if (!isNaN(numValue)) {
                    newValue = numValue;
                }
            }
        }
        else if (newValue === '') {
            // For boolean fields, set undefined instead of empty string
            if (boolFields.includes(target.configValue)) {
                newValue = undefined;
            }
            else {
                newValue = undefined;
            }
        }
        // Ensure boolean config fields never receive an empty string ("")
        if (boolFields.includes(target.configValue)) {
            if (newValue === "") {
                newValue = undefined;
            }
            else if (typeof newValue !== "boolean" && typeof newValue !== "undefined") {
                newValue = Boolean(newValue);
            }
        }
        // Special handling for weather entity selection
        if (target.configValue === 'entity_id') {
            if (newValue === 'none') {
                newValue = undefined;
            }
            setTimeout(() => {
                const latInput = this.querySelector('#latitude-input');
                const lonInput = this.querySelector('#longitude-input');
                const isWeatherEntitySelected = !!(newValue && newValue !== 'none');
                if (latInput)
                    latInput.disabled = isWeatherEntitySelected;
                if (lonInput)
                    lonInput.disabled = isWeatherEntitySelected;
            }, 0);
        }
        // TS18048: Ensure newValue is not undefined for boolean fields
        const configValue = boolFields.includes(target.configValue)
            ? (typeof newValue === "undefined" ? undefined : !!newValue)
            : newValue;
        this._config = {
            ...this._config,
            [target.configValue]: configValue
        };
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: { config: this._config }
        }));
    }
};
__decorate([
    n({ type: Object })
], MeteogramCardEditor.prototype, "_config", void 0);
__decorate([
    n({ type: Object })
], MeteogramCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], MeteogramCardEditor.prototype, "_initialized", void 0);
MeteogramCardEditor = __decorate([
    t$1('meteogram-card-editor')
], MeteogramCardEditor);

// Helper to detect client name from user agent
function getClientName() {
    const ua = navigator.userAgent;
    if (/Home Assistant/.test(ua))
        return "HA Companion";
    if (/Edg/.test(ua))
        return "Edge";
    if (/Chrome/.test(ua))
        return "Chrome";
    if (/Android/.test(ua))
        return "Android";
    if (/iPhone|iPad|iPod/.test(ua))
        return "iOS";
    if (/Firefox/.test(ua))
        return "Firefox";
    return "Unknown";
}

class WeatherAPI {
    constructor(lat, lon) {
        this.lastError = null;
        this.lastStatusCode = null;
        this._forecastData = null;
        this._expiresAt = null;
        this._fetchPromise = null;
        this._lastFetchTime = null; // Track last fetch timestamp
        this.lat = lat;
        this.lon = lon;
    }
    // Getter for forecastData: checks expiry and refreshes if needed
    async getForecastData() {
        console.debug(`[weather-api] getForecastData called for lat=${this.lat}, lon=${this.lon}`);
        // If no data loaded, try to load from cache first
        if (!this._forecastData) {
            this.loadCacheFromStorage();
        }
        // If cache is valid, return it
        if (this._forecastData && this._expiresAt && Date.now() < this._expiresAt) {
            return this._forecastData;
        }
        // Only one fetch at a time, and throttle to 1 per 60 seconds
        const now = Date.now();
        if (this._lastFetchTime &&
            now - this._lastFetchTime < 60000 &&
            this._fetchPromise) {
            await this._fetchPromise;
            return this._forecastData;
        }
        if (!this._fetchPromise) {
            this._fetchPromise = this._fetchWeatherDataFromAPI();
        }
        try {
            await this._fetchPromise;
        }
        finally {
            this._fetchPromise = null;
        }
        return this._forecastData;
    }
    get expiresAt() {
        return this._expiresAt;
    }
    getDiagnosticText() {
        var _a;
        let diag = `<br><b>API Error</b><br>`;
        if (this.lastError instanceof Error) {
            diag += `Error: <code>${this.lastError.message}</code><br>`;
        }
        else if (this.lastError !== undefined && this.lastError !== null) {
            diag += `Error: <code>${String(this.lastError)}</code><br>`;
        }
        diag += `Status: <code>${(_a = this.lastStatusCode) !== null && _a !== void 0 ? _a : ""}</code><br>`;
        diag += `Card version: <code>${version}</code><br>`;
        diag += `Client type: <code>${navigator.userAgent}</code><br>`;
        return diag;
    }
    // Helper to encode cache key as base64 of str(lat)+str(lon)
    static encodeCacheKey(lat, lon) {
        const keyStr = String(lat) + String(lon);
        return btoa(keyStr);
    }
    // Save forecast data to localStorage
    saveCacheToStorage() {
        if (!this._forecastData || !this._expiresAt)
            return;
        const key = WeatherAPI.encodeCacheKey(Number(this.lat.toFixed(4)), Number(this.lon.toFixed(4)));
        let cacheObj = {};
        const cacheStr = localStorage.getItem('metno-weather-cache');
        if (cacheStr) {
            try {
                cacheObj = JSON.parse(cacheStr);
            }
            catch {
                cacheObj = {};
            }
        }
        if (!cacheObj["forecast-data"])
            cacheObj["forecast-data"] = {};
        cacheObj["forecast-data"][key] = {
            expiresAt: this._expiresAt,
            data: this._forecastData
        };
        localStorage.setItem('metno-weather-cache', JSON.stringify(cacheObj));
    }
    // Load forecast data from localStorage
    loadCacheFromStorage() {
        var _a;
        const key = WeatherAPI.encodeCacheKey(Number(this.lat.toFixed(4)), Number(this.lon.toFixed(4)));
        const cacheStr = localStorage.getItem('metno-weather-cache');
        if (cacheStr) {
            let cacheObj = {};
            try {
                cacheObj = JSON.parse(cacheStr);
            }
            catch {
                cacheObj = {};
            }
            const entry = (_a = cacheObj["forecast-data"]) === null || _a === void 0 ? void 0 : _a[key];
            if (entry && entry.expiresAt && entry.data) {
                this._expiresAt = entry.expiresAt;
                // Restore Date objects in time array
                if (Array.isArray(entry.data.time)) {
                    entry.data.time = entry.data.time.map((t) => typeof t === "string" ? new Date(t) : t);
                }
                this._forecastData = entry.data;
            }
            else {
                this._expiresAt = null;
                this._forecastData = null;
            }
        }
    }
    // Make fetchWeatherDataFromAPI private and update usages
    async _fetchWeatherDataFromAPI() {
        // Throttle: if last fetch was less than 60s ago, skip fetch
        const now = Date.now();
        if (this._lastFetchTime && now - this._lastFetchTime < 60000) {
            // Already fetched recently, skip
            return;
        }
        this._lastFetchTime = now;
        const lat = this.lat;
        const lon = this.lon;
        let forecastUrl = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
        let dedicatedForecastUrl = `https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
        let urlToUse = forecastUrl;
        let headers = {};
        this.lastStatusCode = null;
        this.lastError = null;
        try {
            headers = {
                'Origin': window.location.origin,
                'Accept': 'application/json'
            };
            urlToUse = window.location.origin.includes("ui.nabu.casa")
                ? dedicatedForecastUrl
                : forecastUrl;
            // log impending call to fetch
            console.debug(`[weather-api] Fetching weather data from ${urlToUse} with Origin ${headers['Origin']}`);
            WeatherAPI.METEOGRAM_CARD_API_CALL_COUNT++;
            const response = await fetch(urlToUse, { headers, mode: 'cors' });
            this.lastStatusCode = response.status;
            const expiresHeader = response.headers.get("Expires");
            let expires = null;
            if (expiresHeader) {
                const expiresDate = new Date(expiresHeader);
                if (!isNaN(expiresDate.getTime())) {
                    expires = expiresDate;
                }
            }
            if (this.lastStatusCode === 429) {
                const nextTry = expires ? expires.toLocaleTimeString() : "later";
                throw new Error(`Weather API throttling: Too many requests. Please wait until ${nextTry} before retrying.`);
            }
            if (this.lastStatusCode === 304) {
                throw new Error("API returned 304 but no cached data is available.");
            }
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Weather API returned ${response.status}: ${response.statusText}\n${errorText}`);
            }
            const jsonData = await response.json();
            WeatherAPI.METEOGRAM_CARD_API_SUCCESS_COUNT++;
            // Parse and store forecast data
            this.assignMeteogramDataFromRaw(jsonData);
            this._expiresAt = expires ? expires.getTime() : null;
            this.saveCacheToStorage();
        }
        catch (error) {
            this.lastError = error;
            const diag = this.getDiagnosticText() +
                `API URL: <code>${urlToUse}</code><br>` +
                `Origin header: <code>${headers['Origin']}</code><br>`;
            throw new Error(`<br>Failed to get weather data: ${error.message}\n<br>Check your network connection, browser console, and API accessibility.\n\n${diag}`);
        }
    }
    // assignMeteogramDataFromRaw now only sets _forecastData
    assignMeteogramDataFromRaw(rawData) {
        try {
            if (!rawData || !rawData.properties || !Array.isArray(rawData.properties.timeseries)) {
                throw new Error("Invalid raw data format from weather API");
            }
            const timeseries = rawData.properties.timeseries;
            const filtered = timeseries.filter((item) => {
                const time = new Date(item.time);
                return time.getMinutes() === 0;
            });
            const result = {
                time: [],
                temperature: [],
                rain: [],
                rainMin: [],
                rainMax: [],
                snow: [],
                cloudCover: [],
                windSpeed: [],
                windDirection: [],
                symbolCode: [],
                pressure: []
            };
            result.fetchTimestamp = new Date().toISOString();
            filtered.forEach((item) => {
                var _a, _b, _c, _d, _e;
                const time = new Date(item.time);
                const instant = item.data.instant.details;
                const next1h = (_a = item.data.next_1_hours) === null || _a === void 0 ? void 0 : _a.details;
                const next6h = (_b = item.data.next_6_hours) === null || _b === void 0 ? void 0 : _b.details;
                const next6hSummary = (_c = item.data.next_6_hours) === null || _c === void 0 ? void 0 : _c.summary;
                result.time.push(time);
                result.temperature.push(instant.air_temperature);
                result.cloudCover.push(instant.cloud_area_fraction);
                result.windSpeed.push(instant.wind_speed);
                result.windDirection.push(instant.wind_from_direction);
                result.pressure.push(instant.air_pressure_at_sea_level);
                if (next1h) {
                    const rainAmountMax = next1h.precipitation_amount_max !== undefined ?
                        next1h.precipitation_amount_max :
                        (next1h.precipitation_amount !== undefined ? next1h.precipitation_amount : 0);
                    const rainAmountMin = next1h.precipitation_amount_min !== undefined ?
                        next1h.precipitation_amount_min :
                        (next1h.precipitation_amount !== undefined ? next1h.precipitation_amount : 0);
                    result.rainMin.push(rainAmountMin);
                    result.rainMax.push(rainAmountMax);
                    result.rain.push(next1h.precipitation_amount !== undefined ? next1h.precipitation_amount : 0);
                    result.snow.push(0);
                    if ((_e = (_d = item.data.next_1_hours) === null || _d === void 0 ? void 0 : _d.summary) === null || _e === void 0 ? void 0 : _e.symbol_code) {
                        result.symbolCode.push(item.data.next_1_hours.summary.symbol_code);
                    }
                    else {
                        result.symbolCode.push('');
                    }
                }
                else if (next6h) {
                    // Use next_6_hours data if next_1_hours is missing
                    // Distribute 6h precipitation over 6 hours (average per hour)
                    const rain6h = next6h.precipitation_amount !== undefined ? next6h.precipitation_amount : 0;
                    const rainPerHour = rain6h / 6;
                    result.rain.push(rainPerHour);
                    result.rainMin.push(rainPerHour);
                    result.rainMax.push(rainPerHour);
                    result.snow.push(0);
                    if (next6hSummary === null || next6hSummary === void 0 ? void 0 : next6hSummary.symbol_code) {
                        result.symbolCode.push(next6hSummary.symbol_code);
                    }
                    else {
                        result.symbolCode.push('');
                    }
                }
                else {
                    // No precipitation data available
                    result.rain.push(0);
                    result.rainMin.push(0);
                    result.rainMax.push(0);
                    result.snow.push(0);
                    result.symbolCode.push('');
                }
            });
            this._forecastData = result;
        }
        catch (err) {
            throw new Error("Failed to parse weather data: " + (err instanceof Error ? err.message : String(err)));
        }
    }
}
WeatherAPI.METEOGRAM_CARD_API_CALL_COUNT = 0;
WeatherAPI.METEOGRAM_CARD_API_SUCCESS_COUNT = 0;

class WeatherEntityAPI {
    constructor(hass, entityId, from) {
        this._forecastData = null;
        this._unsubForecast = null;
        // Instrumentation: log caller stack and arguments
        console.debug(`[WeatherEntityAPI] from ${from} Constructor called for entityId: ${entityId}`);
        this.hass = hass;
        this.entityId = entityId;
        // Subscribe to forecast updates if hass and entityId are available
        if (this.hass && this.entityId) {
            // console.debug(`[WeatherEntityAPI] from ${from} Subscribing to forecast updates for ${this.entityId}`);
            this.subscribeForecast((forecastArr) => {
                this._forecastData = this._parseForecastArray(forecastArr);
                // console.debug(`[WeatherEntityAPI] from ${from} subscribeForecast: stored ForecastData for ${this.entityId}`, this._forecastData);
                // Force chart update by dispatching a custom event
                const card = document.querySelector('meteogram-card');
                if (card && typeof card._scheduleDrawMeteogram === "function") {
                    card._scheduleDrawMeteogram("WeatherEntityAPI-forecast-update", true);
                }
            }).then(unsub => {
                this._unsubForecast = unsub;
            });
        }
    }
    _parseForecastArray(forecast) {
        const result = {
            time: [],
            temperature: [],
            rain: [],
            rainMin: [],
            rainMax: [],
            snow: [],
            cloudCover: [],
            windSpeed: [],
            windDirection: [],
            symbolCode: [],
            pressure: [],
            fetchTimestamp: new Date().toISOString()
        };
        forecast.forEach((item) => {
            var _a, _b, _c;
            result.time.push(new Date(item.datetime || item.time));
            result.temperature.push((_a = item.temperature) !== null && _a !== void 0 ? _a : null);
            result.rain.push((_b = item.precipitation) !== null && _b !== void 0 ? _b : 0);
            // Only push rainMin/rainMax if precipitation_min/max are present
            if ('precipitation_min' in item) {
                result.rainMin.push(item.precipitation_min);
            }
            if ('precipitation_max' in item) {
                result.rainMax.push(item.precipitation_max);
            }
            // Only push snow if present
            if ('snow' in item && typeof item.snow === 'number') {
                result.snow.push(item.snow);
            }
            // Only push cloudCover if present
            if ('cloud_coverage' in item && typeof item.cloud_coverage === 'number') {
                result.cloudCover.push(item.cloud_coverage);
            }
            // Only push windSpeed/windDirection if present
            if ('wind_speed' in item && typeof item.wind_speed === 'number') {
                result.windSpeed.push(item.wind_speed);
            }
            if ('wind_bearing' in item && typeof item.wind_bearing === 'number') {
                result.windDirection.push(item.wind_bearing);
            }
            result.symbolCode.push((_c = item.condition) !== null && _c !== void 0 ? _c : "");
            // Map pressure attribute for renderer compatibility
            if ('pressure' in item && typeof item.pressure === 'number') {
                result.pressure.push(item.pressure);
            }
            else if ('pressure_mbar' in item && typeof item.pressure_mbar === 'number') {
                result.pressure.push(item.pressure_mbar);
            }
            else if ('pressure_hpa' in item && typeof item.pressure_hpa === 'number') {
                result.pressure.push(item.pressure_hpa);
            }
        });
        // Store the parsed forecast in localStorage using a shared cache object
        try {
            const cacheKey = 'meteogram-card-entity-weather-cache';
            let cache = {};
            const rawCache = localStorage.getItem(cacheKey);
            if (rawCache) {
                cache = JSON.parse(rawCache);
            }
            cache[this.entityId] = result;
            localStorage.setItem(cacheKey, JSON.stringify(cache));
        }
        catch (e) {
            console.warn(`[WeatherEntityAPI] Failed to store forecast for ${this.entityId} in localStorage:`, e);
        }
        return result;
    }
    getForecast() {
        console.debug(`[WeatherEntityAPI] getForecastData called for entityId=${this.entityId}`);
        if (this._forecastData) {
            // console.debug(`[WeatherEntityAPI] Returning stored ForecastData for ${this.entityId}`, this._forecastData);
            return this._forecastData;
        }
        const entity = this.hass.states[this.entityId];
        if (!entity) {
            console.debug(`[WeatherEntityAPI] Entity not found: ${this.entityId}`);
            return null;
        }
        if (!entity.attributes) {
            console.debug(`[WeatherEntityAPI] Entity has no attributes: ${this.entityId}`);
            return null;
        }
        // console.debug(`[WeatherEntityAPI] Entity contents:`, entity);
        if (!Array.isArray(entity.attributes.forecast)) {
            console.debug(`[WeatherEntityAPI] Entity forecast attribute is not an array:`, entity.attributes.forecast);
            return null;
        }
        this._forecastData = this._parseForecastArray(entity.attributes.forecast);
        // console.debug(`[WeatherEntityAPI] getForecastData result:`, this._forecastData);
        return this._forecastData;
    }
    /**
     * Subscribe to forecast updates for the weather entity.
     * @param callback Called with the forecast array when updates arrive.
     * @returns Unsubscribe function.
     */
    subscribeForecast(callback) {
        var _a;
        console.debug(`[WeatherEntityAPI] subscribeForecast called for entityId=${this.entityId}`);
        if (!((_a = this.hass) === null || _a === void 0 ? void 0 : _a.connection)) {
            // console.debug(`[WeatherEntityAPI] subscribeForecast: hass.connection not available`);
            return Promise.resolve(() => { });
        }
        const unsubPromise = this.hass.connection.subscribeMessage((event) => {
            if (Array.isArray(event.forecast)) {
                // console.debug(`[WeatherEntityAPI] subscribeForecast: received forecast update`, event.forecast);
                callback(event.forecast);
            }
            else {
                console.debug(`[WeatherEntityAPI] subscribeForecast: event.forecast not array`, event);
            }
        }, {
            type: "weather/subscribe_forecast",
            entity_id: this.entityId,
            forecast_type: "hourly"
        });
        return unsubPromise;
    }
    /**
     * Get the latest ForecastData received from subscribeForecast.
     * If _forecastData is null, try to fill it from localStorage.
     */
    getForecastData() {
        if (this._forecastData) {
            return this._forecastData;
        }
        // Try to load from localStorage cache object
        try {
            const cacheKey = 'meteogram-card-entity-weather-cache';
            const rawCache = localStorage.getItem(cacheKey);
            if (rawCache) {
                const cache = JSON.parse(rawCache);
                const stored = cache[this.entityId];
                if (stored) {
                    // Restore Date objects in time array
                    if (Array.isArray(stored.time)) {
                        stored.time = stored.time.map((t) => typeof t === "string" ? new Date(t) : t);
                    }
                    this._forecastData = stored;
                    // console.debug(`[WeatherEntityAPI] Loaded forecast for ${this.entityId} from localStorage cache`, this._forecastData);
                    return this._forecastData;
                }
            }
        }
        catch (e) {
            console.warn(`[WeatherEntityAPI] Failed to load forecast for ${this.entityId} from localStorage cache:`, e);
        }
        return null;
    }
    /**
     * Destructor: Unsubscribe from forecast updates.
     */
    destroy(from) {
        if (this._unsubForecast) {
            try {
                this._unsubForecast();
                this._unsubForecast = null;
                // console.debug(`[WeatherEntityAPI] from ${from} Unsubscribed from forecast updates for ${this.entityId}`);
            }
            catch (err) {
                console.warn(`[WeatherEntityAPI] from ${from} Error during unsubscribe for ${this.entityId}:`, err);
            }
        }
    }
}
/**
 * Map HA weather entity 'condition' values to Met.no weather icon names.
 */
function mapHaConditionToMetnoSymbol(condition) {
    const mapping = {
        "clear-night": "clearsky_night",
        "cloudy": "cloudy",
        "fog": "fog",
        "hail": "heavyrainshowers",
        "lightning": "lightrainshowers",
        "lightning-rainy": "lightrainshowers",
        "partlycloudy": "partlycloudy_day",
        "pouring": "heavyrain",
        "rainy": "rain",
        "snowy": "snow",
        "snowy-rainy": "sleet",
        "sunny": "clearsky_day",
        "windy": "fair_day",
        "windy-variant": "fair_day",
        "exceptional": "clearsky_day"
    };
    // Default to condition itself if not mapped
    return mapping[condition] || condition;
}

var MeteogramCard_1;
let MeteogramCard$1 = MeteogramCard_1 = class MeteogramCard extends i$1 {
    constructor() {
        super();
        this.title = "";
        // Add new configuration properties with default values
        this.showCloudCover = true;
        this.showPressure = true;
        this.showRain = true;
        this.showWeatherIcons = true;
        this.showWind = true;
        this.denseWeatherIcons = true; // NEW: icon density config
        this.meteogramHours = "48h"; // Default is now 48h
        this.styles = {}; // NEW: styles override
        this.diagnostics = DIAGNOSTICS_DEFAULT; // Initialize here
        this.focussed = false; // NEW: Focussed mode
        this.chartLoaded = false;
        this.meteogramError = "";
        this.errorCount = 0;
        this.lastErrorTime = 0;
        this._drawCallIndex = 0;
        this._weatherRetryTimeout = 0;
        this._weatherRefreshTimeout = 0;
        this._chartRenderInProgress = false;
        this._pendingRender = false;
        this._lastApiSuccess = false;
        this.iconCache = new Map();
        this.iconBasePath = 'https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/';
        // Keep reference to the D3 selection to clean it up properly
        this.svg = null;
        // Track element size for resize detection
        this._resizeObserver = null;
        this._lastWidth = 0;
        this._lastHeight = 0;
        // Intersection observer for visibility detection
        this._intersectionObserver = null;
        // Mutation observer for detecting DOM changes
        this._mutationObserver = null;
        // Keep track of update cycles
        this._isInitialized = false;
        // Keep track of last rendered data to avoid unnecessary redraws
        this._lastRenderedData = null;
        // Change these from static to instance properties
        this.apiExpiresAt = null;
        this.apiLastModified = null;
        this.weatherDataPromise = null;
        // Add WeatherAPI instance as a class variable
        this._weatherApiInstance = null;
        // Add WeatherEntityAPI instance as a class variable
        this._weatherEntityApiInstance = null;
        // Add these properties for throttling
        this._redrawScheduled = false;
        this._lastDrawScheduleTime = 0;
        this._drawThrottleMs = 200;
        // Status panel properties
        this._statusExpiresAt = "";
        this._statusLastRender = "";
        this._statusLastFetch = "";
        this._statusApiSuccess = null;
        // Handle document visibility changes (browser tab switching)
        this._onVisibilityChange = () => {
            if (!document.hidden && this.isConnected) {
                this._handleVisibilityChange();
            }
        };
        // Handle Home Assistant location/page changes
        this._onLocationChanged = () => {
            // Small delay to let the DOM update
            setTimeout(() => {
                if (this.isConnected && this._isElementVisible()) {
                    this._handleVisibilityChange();
                }
            }, 100);
        };
        this.title = "";
        this.latitude = undefined;
        this.longitude = undefined;
        this.showCloudCover = true;
        this.showPressure = true;
        this.showRain = true;
        this.showWeatherIcons = true;
        this.showWind = true;
        this.denseWeatherIcons = true;
        this.meteogramHours = "48h";
        this.styles = {};
        this.diagnostics = DIAGNOSTICS_DEFAULT;
        // Initialize state properties
        this.chartLoaded = false;
        this.meteogramError = "";
        this.errorCount = 0;
        this.lastErrorTime = 0;
        this._statusExpiresAt = "";
        this._statusLastRender = "";
        this._statusLastFetch = "";
        this._statusApiSuccess = null;
    }
    // Add a method to fetch icons
    async getIconSVG(iconName) {
        // Return from cache if available
        if (this.iconCache.has(iconName)) {
            return this.iconCache.get(iconName);
        }
        try {
            // Add a console log to debug the URL
            const iconUrl = `${this.iconBasePath}${iconName}.svg`;
            // Fetch from GitHub
            const response = await fetch(iconUrl);
            if (!response.ok) {
                console.warn(`Failed to load icon: ${iconName}, status: ${response.status}`);
                return '';
            }
            const svgText = await response.text();
            // Basic validation that we got SVG content
            if (!svgText.includes('<svg') || svgText.length < 20) {
                console.warn(`Invalid SVG content for ${iconName}`);
                return '';
            }
            // Store in cache
            this.iconCache.set(iconName, svgText);
            return svgText;
        }
        catch (error) {
            console.error(`Error loading icon ${iconName}:`, error);
            return ''; // Return empty SVG on error
        }
    }
    // Helper to schedule a meteogram draw if not already scheduled
    _scheduleDrawMeteogram(source = "unknown", force = false) {
        const now = Date.now();
        this._drawCallIndex++;
        const callerId = `${source}#${this._drawCallIndex}`;
        console.debug(`[${CARD_NAME}] _scheduleDrawMeteogram called from: ${callerId}`);
        // Only skip if not forced
        if (!force && (this._redrawScheduled || (now - this._lastDrawScheduleTime < this._drawThrottleMs))) {
            console.debug(`[${CARD_NAME}] _scheduleDrawMeteogram: redraw already scheduled or throttled, skipping.`);
            return;
        }
        this._redrawScheduled = true;
        this._lastDrawScheduleTime = now;
        setTimeout(() => {
            this._redrawScheduled = false;
            this._lastDrawScheduleTime = Date.now();
            this._drawMeteogram(callerId);
        }, 50);
    }
    // Required for Home Assistant
    setConfig(config) {
        // Truncate to 4 decimals for comparison
        const configLat = config.latitude !== undefined ? parseFloat(Number(config.latitude).toFixed(4)) : undefined;
        const configLon = config.longitude !== undefined ? parseFloat(Number(config.longitude).toFixed(4)) : undefined;
        this.latitude !== undefined ? parseFloat(Number(this.latitude).toFixed(4)) : undefined;
        this.longitude !== undefined ? parseFloat(Number(this.longitude).toFixed(4)) : undefined;
        if (config.title)
            this.title = config.title;
        if (config.latitude !== undefined)
            this.latitude = configLat;
        if (config.longitude !== undefined)
            this.longitude = configLon;
        // Set the display options from config, using defaults if not specified
        this.showCloudCover = config.show_cloud_cover !== undefined ? config.show_cloud_cover : true;
        this.showPressure = config.show_pressure !== undefined ? config.show_pressure : true;
        this.showRain = config.show_rain !== undefined ? config.show_rain : true;
        this.showWeatherIcons = config.show_weather_icons !== undefined ? config.show_weather_icons : true;
        this.showWind = config.show_wind !== undefined ? config.show_wind : true;
        this.denseWeatherIcons = config.dense_weather_icons !== undefined ? config.dense_weather_icons : true;
        this.meteogramHours = config.meteogram_hours || "48h";
        // Add styles override from config
        this.styles = config.styles || {};
        // Add diagnostics option
        this.diagnostics = config.diagnostics !== undefined ? config.diagnostics : DIAGNOSTICS_DEFAULT;
        // Set entityId from config
        this.entityId = config.entity_id || undefined;
        // Ensure boolean for focussed mode
        this.focussed = !!config.focussed;
        // Track previous entityId
        const prevEntityId = this.entityId;
        const newEntityId = config.entity_id || undefined;
        const entityIdChanged = prevEntityId !== newEntityId;
        // Update entityId
        this.entityId = newEntityId;
        // Handle WeatherEntityAPI lifecycle based on entityId changes
        if (entityIdChanged) {
            if (prevEntityId != null) {
                // Was set, now changed: destroy old
                if (this._weatherEntityApiInstance) {
                    this._weatherEntityApiInstance.destroy("entityId changed");
                    this._weatherEntityApiInstance = null;
                }
            }
            if (newEntityId) {
                // now set: construct new API
                if (this.hass) {
                    console.debug(`[${CARD_NAME}] setConfig Initializing WeatherEntityAPI for entity: ${this.entityId}`, this.hass);
                    this._weatherEntityApiInstance = new WeatherEntityAPI(this.hass, newEntityId, "setConfig");
                }
            } // else remains null
        }
    }
    // Required for HA visual editor support
    static getConfigElement() {
        // Pre-initialize the editor component for faster display
        const editor = document.createElement("meteogram-card-editor");
        // Create a basic config to start with
        editor.setConfig({
            show_cloud_cover: true,
            show_pressure: true,
            show_rain: true,
            show_weather_icons: true,
            show_wind: true,
            dense_weather_icons: true,
            meteogram_hours: "48h",
            diagnostics: DIAGNOSTICS_DEFAULT // Default to DIAGNOSTICS_DEFAULT
        });
        return editor;
    }
    // Define card configuration type
    static getStubConfig() {
        return {
            title: "Weather Forecast",
            show_cloud_cover: true,
            show_pressure: true,
            show_rain: true,
            show_weather_icons: true,
            show_wind: true,
            dense_weather_icons: true,
            meteogram_hours: "48h",
            diagnostics: DIAGNOSTICS_DEFAULT // Default to DIAGNOSTICS_DEFAULT
            // Coordinates will be fetched from HA configuration
        };
    }
    // According to the boilerplate, add getCardSize for panel mode
    getCardSize() {
        return 3; // Returns a height in units of 50 pixels
    }
    // Handle initial setup - now properly setup resize observer
    connectedCallback() {
        super.connectedCallback();
        this._isInitialized = false;
        // Wait for DOM to be ready before setting up observers
        this.updateComplete.then(() => {
            this._setupResizeObserver();
            this._setupVisibilityObserver();
            this._setupMutationObserver();
            // Also handle browser tab visibility changes
            document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));
            // Handle page/panel navigation events
            window.addEventListener('location-changed', this._onLocationChanged.bind(this));
            // Handle re-entry into DOM after being removed temporarily
            if (this.isConnected) {
                if (!this.chartLoaded) {
                    this.loadD3AndDraw();
                }
                else {
                    this._scheduleDrawMeteogram("connectedCallback");
                }
            }
        });
    }
    // Clean up all event listeners
    disconnectedCallback() {
        this._teardownResizeObserver();
        this._teardownVisibilityObserver();
        this._teardownMutationObserver();
        if (this._weatherEntityApiInstance) {
            this._weatherEntityApiInstance.destroy("disconnectedCallback");
            this._weatherEntityApiInstance = null;
        }
        document.removeEventListener('visibilitychange', this._onVisibilityChange.bind(this));
        window.removeEventListener('location-changed', this._onLocationChanged.bind(this));
        this.cleanupChart();
        // Clear retry timer if present
        if (this._weatherRetryTimeout) {
            clearTimeout(this._weatherRetryTimeout);
            this._weatherRetryTimeout = null;
        }
        // Clear refresh timer if present
        if (this._weatherRefreshTimeout) {
            clearTimeout(this._weatherRefreshTimeout);
            this._weatherRefreshTimeout = null;
        }
        super.disconnectedCallback();
    }
    // Helper method to check if element is currently visible
    _isElementVisible() {
        if (!this.isConnected || !this.shadowRoot)
            return false;
        // Check if document is visible at all
        if (document.hidden)
            return false;
        const element = this.shadowRoot.host;
        if (!element)
            return false;
        // Check if element has dimensions
        if (element.offsetWidth === 0 && element.offsetHeight === 0)
            return false;
        // Check computed style
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display === 'none')
            return false;
        if (computedStyle.visibility === 'hidden')
            return false;
        // Check if element is in viewport with getBoundingClientRect
        const rect = element.getBoundingClientRect();
        if (rect.top + rect.height <= 0 ||
            rect.left + rect.width <= 0 ||
            rect.bottom >= window.innerHeight ||
            rect.right >= window.innerWidth) {
            return false;
        }
        return true;
    }
    // Set up visibility observer to detect when card becomes visible
    _setupVisibilityObserver() {
        var _a;
        if (!this._intersectionObserver) {
            this._intersectionObserver = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        this._handleVisibilityChange();
                        break;
                    }
                }
            }, {
                threshold: [0.1] // Trigger when 10% of the card is visible
            });
            // Start observing the card element itself
            if ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.host) {
                this._intersectionObserver.observe(this.shadowRoot.host);
            }
        }
    }
    // Clean up visibility observer
    _teardownVisibilityObserver() {
        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect();
            this._intersectionObserver = null;
        }
    }
    // Detect DOM changes that may affect visibility (like tab switching in HA)
    _setupMutationObserver() {
        var _a;
        if (!this._mutationObserver) {
            this._mutationObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    // Look specifically for the ha-tabs mutations that happen when switching tabs
                    if (mutation.target instanceof HTMLElement &&
                        (mutation.target.tagName === 'HA-TAB' ||
                            mutation.target.tagName === 'HA-TABS' ||
                            mutation.target.classList.contains('content') ||
                            mutation.target.hasAttribute('active'))) {
                        break;
                    }
                    // Check for display/visibility style changes
                    if (mutation.type === 'attributes' &&
                        (mutation.attributeName === 'style' ||
                            mutation.attributeName === 'class' ||
                            mutation.attributeName === 'hidden' ||
                            mutation.attributeName === 'active')) {
                        break;
                    }
                }
            });
            // Specifically observe HA-TABS elements for tab switching
            document.querySelectorAll('ha-tabs, ha-tab, ha-tab-container').forEach(tabs => {
                if (tabs) {
                    this._mutationObserver.observe(tabs, {
                        attributes: true,
                        childList: true,
                        subtree: true
                    });
                }
            });
            // Also observe the parent elements to detect when they become visible
            // Use shadowRoot.host instead of this to get the actual HTMLElement
            const element = ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.host) || null;
            if (element instanceof HTMLElement) {
                let current = element;
                while (current && current.parentElement) {
                    this._mutationObserver.observe(current.parentElement, {
                        attributes: true,
                        attributeFilter: ['style', 'class', 'hidden', 'active'],
                        childList: false,
                        subtree: false
                    });
                    current = current.parentElement;
                }
            }
            // Observe the entire dashboard for broader changes
            const dashboardEl = document.querySelector('home-assistant, ha-panel-lovelace');
            if (dashboardEl) {
                this._mutationObserver.observe(dashboardEl, {
                    childList: true,
                    subtree: true
                });
            }
        }
    }
    // Clean up mutation observer
    _teardownMutationObserver() {
        if (this._mutationObserver) {
            this._mutationObserver.disconnect();
            this._mutationObserver = null;
        }
    }
    // Central handler for visibility changes
    _handleVisibilityChange() {
        var _a;
        if (this._isElementVisible()) {
            const chartDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#chart");
            const svgExists = chartDiv === null || chartDiv === void 0 ? void 0 : chartDiv.querySelector("svg");
            const chartIsVisible = chartDiv && chartDiv.offsetWidth > 0 && chartDiv.offsetHeight > 0;
            const needsRedraw = !this.svg ||
                !chartDiv ||
                chartDiv.innerHTML === "" ||
                chartDiv.clientWidth === 0 ||
                !svgExists;
            // Guard: If chart is already rendered and visible, skip scheduling
            if (!needsRedraw && svgExists && chartIsVisible) {
                console.debug(`[${CARD_NAME}] _handleVisibilityChange: chart already rendered and visible, skipping redraw.`);
                return;
            }
            if (needsRedraw && this.chartLoaded) {
                this.cleanupChart();
                this.requestUpdate();
                this.updateComplete.then(() => this._scheduleDrawMeteogram("_handleVisibilityChange"));
            }
        }
    }
    // Set up resize observer to detect size changes
    _setupResizeObserver() {
        if (!this._resizeObserver) {
            this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
        }
        // We need to wait for the element to be in the DOM
        setTimeout(() => {
            var _a;
            const chartDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#chart");
            if (chartDiv && this._resizeObserver) {
                this._resizeObserver.observe(chartDiv);
            }
        }, 100);
    }
    // Handle resize
    _onResize(entries) {
        var _a;
        if (entries.length === 0)
            return;
        const entry = entries[0];
        // Reduce the threshold for horizontal resizing to be more responsive to width changes
        // but keep vertical threshold higher to avoid unnecessary redraws
        if (Math.abs(entry.contentRect.width - this._lastWidth) > this._lastWidth * 0.05 ||
            Math.abs(entry.contentRect.height - this._lastHeight) > this._lastHeight * 0.1) {
            this._lastWidth = entry.contentRect.width;
            this._lastHeight = entry.contentRect.height;
            // Guard: If chart is already rendered and visible, skip scheduling
            const chartDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#chart");
            const svgExists = chartDiv === null || chartDiv === void 0 ? void 0 : chartDiv.querySelector("svg");
            const chartIsVisible = chartDiv && chartDiv.offsetWidth > 0 && chartDiv.offsetHeight > 0;
            if (svgExists && chartIsVisible) {
                console.debug(`[${CARD_NAME}] _onResize: chart already rendered and visible, skipping redraw.`);
                return;
            }
            this._scheduleDrawMeteogram("_onResize");
        }
    }
    // Clean up resize observer
    _teardownResizeObserver() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
    }
    // Life cycle hooks
    firstUpdated(_) {
        // Make sure DOM is ready before initial drawing
        setTimeout(() => {
            this.loadD3AndDraw();
        }, 50);
        this._updateDarkMode(); // Ensure dark mode is set on first update
        // Call sampleFetchWeatherEntityForecast to log weather entity data
        // if (entityId && entityId !== 'none') {
        //     MeteogramCard.sampleFetchWeatherEntityForecast(this.hass, entityId as string);
        // }
    }
    updated(changedProps) {
        var _a, _b;
        // Only redraw if coordinates, hass, or relevant config options change, or it's the first render
        const needsRedraw = changedProps.has('latitude') ||
            changedProps.has('longitude') ||
            // changedProps.has('hass') ||
            changedProps.has('showCloudCover') ||
            changedProps.has('showPressure') ||
            changedProps.has('showRain') ||
            changedProps.has('showWeatherIcons') ||
            changedProps.has('showWind') ||
            changedProps.has('denseWeatherIcons') ||
            changedProps.has('meteogramHours');
        if (needsRedraw) {
            console.debug(`[${CARD_NAME}] updated(): needsRedraw because:`, {
                latitude: changedProps.has('latitude'),
                longitude: changedProps.has('longitude'),
                // hass: changedProps.has('hass'),
                showCloudCover: changedProps.has('showCloudCover'),
                showPressure: changedProps.has('showPressure'),
                showRain: changedProps.has('showRain'),
                showWeatherIcons: changedProps.has('showWeatherIcons'),
                showWind: changedProps.has('showWind'),
                denseWeatherIcons: changedProps.has('denseWeatherIcons'),
                meteogramHours: changedProps.has('meteogramHours'),
            });
        }
        if (!needsRedraw) {
            console.debug(`[${CARD_NAME}] updated(): no redraw needed or chart render in progress, skipping.`);
            return;
        }
        else {
            console.debug(`[${CARD_NAME}] updated(): scheduling redraw, chartLoaded=${this.chartLoaded}`);
        }
        if (this.chartLoaded && needsRedraw) {
            // Guard: If chart is already rendered and visible, skip scheduling
            const chartDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#chart");
            chartDiv === null || chartDiv === void 0 ? void 0 : chartDiv.querySelector("svg");
            chartDiv && chartDiv.offsetWidth > 0 && chartDiv.offsetHeight > 0;
            this._scheduleDrawMeteogram("updated");
        }
        // Track component state for better lifecycle management
        if (!this._isInitialized && this.shadowRoot) {
            this._isInitialized = true;
            // Force a redraw when added back to the DOM after being in the editor
            if (this.chartLoaded) {
                const chartDiv = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("#chart");
                if (chartDiv && chartDiv.innerHTML === "") {
                    this._scheduleDrawMeteogram("updated-forced");
                }
            }
        }
        this._updateDarkMode(); // Always check dark mode after update
    }
    // Helper to encode cache key as base64 of str(lat)+str(lon)
    static encodeCacheKey(lat, lon) {
        const keyStr = String(lat) + String(lon);
        // btoa works for ASCII; for full Unicode use a more robust encoder if needed
        return btoa(keyStr);
    }
    // Helper to get a truncated location key for caching (now uses base64)
    getLocationKey(lat, lon) {
        // Always use 4 decimals for both lat and lon
        return MeteogramCard_1.encodeCacheKey(Number(lat.toFixed(4)), Number(lon.toFixed(4)));
    }
    // Save HA location to localStorage under "meteogram-card-default-location"
    _saveDefaultLocationToStorage(latitude, longitude) {
        try {
            const locationObj = {
                latitude: parseFloat(latitude.toFixed(4)),
                longitude: parseFloat(longitude.toFixed(4))
            };
            localStorage.setItem('meteogram-card-default-location', JSON.stringify(locationObj));
        }
        catch (e) {
            console.debug(`[${CARD_NAME}] Failed to save default location to localStorage:`, e);
        }
    }
    // Load location from localStorage under "meteogram-card-default-location"
    _loadDefaultLocationFromStorage() {
        try {
            const locationStr = localStorage.getItem('meteogram-card-default-location');
            if (locationStr) {
                try {
                    const locationObj = JSON.parse(locationStr);
                    const latitude = parseFloat(Number(locationObj.latitude).toFixed(4));
                    const longitude = parseFloat(Number(locationObj.longitude).toFixed(4));
                    if (!isNaN(latitude) && !isNaN(longitude)) {
                        return { latitude, longitude };
                    }
                }
                catch {
                    // Ignore parse errors
                }
            }
            return null;
        }
        catch (e) {
            console.debug(`[${CARD_NAME}] Failed to load default location from localStorage:`, e);
            return null;
        }
    }
    // Check if we need to get location from HA
    _checkAndUpdateLocation() {
        // Try to get location from config first
        if (this.latitude !== undefined && this.longitude !== undefined) {
            this.latitude = parseFloat(Number(this.latitude).toFixed(4));
            this.longitude = parseFloat(Number(this.longitude).toFixed(4));
            // Initialize WeatherAPI instance if not already set or if lat/lon changed
            if (!this._weatherApiInstance ||
                this._weatherApiInstance.lat !== this.latitude ||
                this._weatherApiInstance.lon !== this.longitude) {
                this._weatherApiInstance = new WeatherAPI(this.latitude, this.longitude);
            }
            return;
        }
        // Try to get location from HA
        if (this.hass && (this.latitude === undefined || this.longitude === undefined)) {
            const hassConfig = this.hass.config || {};
            const hassLocation = hassConfig.latitude !== undefined && hassConfig.longitude !== undefined;
            if (hassLocation) {
                // Truncate to 4 decimals before using
                const haLat = parseFloat(Number(hassConfig.latitude).toFixed(4));
                const haLon = parseFloat(Number(hassConfig.longitude).toFixed(4));
                // Only update default-location if it is different from cached value
                const cachedDefault = this._loadDefaultLocationFromStorage();
                if (!cachedDefault ||
                    cachedDefault.latitude !== haLat ||
                    cachedDefault.longitude !== haLon) {
                    this._saveDefaultLocationToStorage(haLat, haLon);
                }
                this.latitude = haLat;
                this.longitude = haLon;
                // Initialize WeatherAPI instance if not already set or if lat/lon changed
                if (!this._weatherApiInstance ||
                    this._weatherApiInstance.lat !== this.latitude ||
                    this._weatherApiInstance.lon !== this.longitude) {
                    this._weatherApiInstance = new WeatherAPI(this.latitude, this.longitude);
                }
                console.debug(`[${CARD_NAME}] Using HA location: ${this.latitude}, ${this.longitude}`);
                return;
            }
        }
        // If we still don't have location, try to load from localStorage default-location
        if (this.latitude === undefined || this.longitude === undefined) {
            const cachedLocation = this._loadDefaultLocationFromStorage();
            if (cachedLocation) {
                this.latitude = cachedLocation.latitude;
                this.longitude = cachedLocation.longitude;
                // Initialize WeatherAPI instance if not already set or if lat/lon changed
                if (!this._weatherApiInstance ||
                    this._weatherApiInstance.lat !== this.latitude ||
                    this._weatherApiInstance.lon !== this.longitude) {
                    this._weatherApiInstance = new WeatherAPI(this.latitude, this.longitude);
                }
                console.debug(`[${CARD_NAME}] Using cached default-location: ${this.latitude}, ${this.longitude}`);
            }
            else {
                this.latitude = 51.5074;
                this.longitude = -0.1278;
                // Initialize WeatherAPI instance if not already set or if lat/lon changed
                if (!this._weatherApiInstance ||
                    this._weatherApiInstance.lat !== this.latitude ||
                    this._weatherApiInstance.lon !== this.longitude) {
                    this._weatherApiInstance = new WeatherAPI(this.latitude, this.longitude);
                }
                console.debug(`[${CARD_NAME}] Using default location: ${this.latitude}, ${this.longitude}`);
            }
        }
    }
    // Implement the missing loadD3AndDraw method
    async loadD3AndDraw() {
        var _a;
        // Check if D3 is already loaded
        if (window.d3) {
            this.chartLoaded = true;
            // Guard: If chart is already rendered and visible, skip scheduling
            const chartDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#chart");
            chartDiv === null || chartDiv === void 0 ? void 0 : chartDiv.querySelector("svg");
            chartDiv && chartDiv.offsetWidth > 0 && chartDiv.offsetHeight > 0;
            this._scheduleDrawMeteogram("loadD3AndDraw");
            return;
        }
        // Try to load D3.js dynamically
        try {
            // Create script element
            const script = document.createElement('script');
            script.src = 'https://d3js.org/d3.v7.min.js';
            script.async = true;
            // Create a promise to track when the script loads
            const loadPromise = new Promise((resolve, reject) => {
                script.onload = () => {
                    this.chartLoaded = true;
                    resolve();
                };
                script.onerror = () => {
                    reject(new Error('Failed to load D3.js library'));
                };
            });
            // Add script to document
            document.head.appendChild(script);
            // Wait for script to load
            await loadPromise;
            // Check if D3 was successfully loaded
            if (!window.d3) {
                throw new Error('D3.js not available after loading script');
            }
            // Now that D3 is loaded, draw the meteogram
            await this._scheduleDrawMeteogram("loadD3AndDraw-afterD3", true);
        }
        catch (error) {
            console.error('Error loading D3.js:', error);
            this.setError('Failed to load D3.js visualization library. Please refresh the page.');
        }
    }
    async fetchWeatherData() {
        if (this.entityId && this.entityId !== 'none' && !this._weatherEntityApiInstance) {
            if (this.hass) {
                console.debug(`[${CARD_NAME}] Initializing WeatherEntityAPI for entity: ${this.entityId}`, this._weatherEntityApiInstance);
                this._weatherEntityApiInstance = new WeatherEntityAPI(this.hass, this.entityId, "fetchWeatherData");
            }
        }
        else {
            if (this.entityId && this.entityId == 'none' && this._weatherEntityApiInstance) {
                this._weatherEntityApiInstance.destroy("fetchWeatherData");
                this._weatherEntityApiInstance = null;
            }
        }
        // If weather entity is set and not "none", use WeatherEntityAPI
        if (this.entityId && this.entityId !== 'none' && this._weatherEntityApiInstance) {
            // Always fetch fresh data from the entity, not from any cache
            const entityData = this._weatherEntityApiInstance.getForecastData();
            // Detect if entity is unavailable (null or empty time array)
            // console.debug(`[${CARD_NAME}] fetchWeatherData from entity ${this.entityId}:`, entityData);
            if (!entityData || !entityData.time || entityData.time.length === 0) {
                throw new Error(`Weather entity ${this.entityId} is unavailable. Waiting for it to become available...`);
            }
            return entityData;
        }
        // Always truncate to 4 decimals before using
        const lat = this.latitude !== undefined ? parseFloat(Number(this.latitude).toFixed(4)) : undefined;
        const lon = this.longitude !== undefined ? parseFloat(Number(this.longitude).toFixed(4)) : undefined;
        console.debug(`[${CARD_NAME}] fetchWeatherData called with lat=${lat}, lon=${lon}`);
        // Enhanced location check with better error message
        if (!lat || !lon) {
            this._checkAndUpdateLocation(); // Try harder to get location
            const checkedLat = this.latitude !== undefined ? parseFloat(Number(this.latitude).toFixed(4)) : undefined;
            const checkedLon = this.longitude !== undefined ? parseFloat(Number(this.longitude).toFixed(4)) : undefined;
            if (!checkedLat || !checkedLon) {
                throw new Error("Could not determine location. Please check your card configuration or Home Assistant settings.");
            }
        }
        // Ensure WeatherAPI instance is initialized
        if (!this._weatherApiInstance ||
            this._weatherApiInstance.lat !== lat ||
            this._weatherApiInstance.lon !== lon) {
            this._weatherApiInstance = new WeatherAPI(lat, lon);
        }
        const weatherApi = this._weatherApiInstance;
        // If a fetch is already in progress, return the same promise
        if (this.weatherDataPromise) {
            // Update _statusLastFetch with weatherApi._lastFetchTime if available
            if (this._weatherApiInstance && this._weatherApiInstance._lastFetchTime) {
                const lastFetch = this._weatherApiInstance._lastFetchTime;
                if (lastFetch) {
                    this._statusLastFetch = new Date(lastFetch).toISOString();
                }
            }
            return this.weatherDataPromise;
        }
        // Cache the promise so repeated calls during chart draw use the same one
        this.weatherDataPromise = (async () => {
            let result = null;
            try {
                // Use the new getForecastData method
                const resultMaybe = await weatherApi.getForecastData();
                if (!resultMaybe) {
                    throw new Error("No forecast data available from WeatherAPI.");
                }
                result = resultMaybe;
                this.apiExpiresAt = weatherApi.expiresAt;
                this._statusApiSuccess = true;
                this._lastApiSuccess = true;
                // Filter result by meteogramHours
                let hours = 48;
                if (this.meteogramHours === "8h")
                    hours = 8;
                else if (this.meteogramHours === "12h")
                    hours = 12;
                else if (this.meteogramHours === "24h")
                    hours = 24;
                else if (this.meteogramHours === "48h")
                    hours = 48;
                else if (this.meteogramHours === "54h")
                    hours = 54;
                else if (this.meteogramHours === "max")
                    hours = result.time.length;
                // Only keep the first N hours
                if (hours < result.time.length) {
                    Object.keys(result).forEach((key) => {
                        result[key] = result[key].slice(0, hours);
                    });
                }
                // this._scheduleDrawMeteogram();
                // Update _statusLastFetch with weatherApi._lastFetchTime if available
                if (weatherApi && weatherApi._lastFetchTime) {
                    const lastFetch = weatherApi._lastFetchTime;
                    if (lastFetch) {
                        this._statusLastFetch = new Date(lastFetch).toISOString();
                    }
                }
                return result;
            }
            catch (error) {
                this._statusApiSuccess = false;
                let diag = weatherApi.getDiagnosticText();
                this.setError(diag);
                throw new Error(`<br>Failed to get weather data: ${error.message}\n<br>Check your network connection, browser console, and API accessibility.\n\n${diag}`);
            }
            finally {
                // Do NOT clear weatherDataPromise here, so repeated calls use the same promise
                // Only clear it after chart draw is complete
            }
        })();
        return this.weatherDataPromise;
    }
    // Keep the cleanupChart method as is
    cleanupChart() {
        try {
            // Check if we have an active D3 selection
            if (this.svg && typeof this.svg.remove === 'function') {
                // Use D3's remove method to clean up properly
                this.svg.remove();
                this.svg = null;
            }
            // Also clear any chart content directly from the DOM
            if (this.shadowRoot) {
                const chartDiv = this.shadowRoot.querySelector('#chart');
                if (chartDiv) {
                    chartDiv.innerHTML = '';
                }
            }
        }
        catch (error) {
            console.warn('Error cleaning up chart:', error);
        }
    }
    async _drawMeteogram(caller = "unknown") {
        var _a, _b;
        console.debug(`[${CARD_NAME}] _drawMeteogram called from: ${caller}`);
        // Limit excessive error messages
        const now = Date.now();
        if (this.meteogramError && now - this.lastErrorTime < 60000) {
            // Don't try to redraw for at least 1 minute after an error
            this.errorCount++;
            return;
        }
        this.meteogramError = "";
        // Make sure we have a location before proceeding
        this._checkAndUpdateLocation();
        if (!this.latitude || !this.longitude) {
            this.setError("Location not available. Please check your card configuration or Home Assistant settings.");
            return;
        }
        // Wait for the render cycle to complete before accessing the DOM
        await this.updateComplete;
        // Use the _logDomState method to log diagnostic info
        this._logDomState();
        // Add a static property to limit D3 retry frequency
        const D3_RETRY_INTERVAL = 10000; // 10 seconds
        if (!MeteogramCard_1.lastD3RetryTime) {
            MeteogramCard_1.lastD3RetryTime = 0;
        }
        // Always attempt to load D3 if not present
        if (!window.d3) {
            try {
                await this.loadD3AndDraw();
                return; // loadD3AndDraw will call drawMeteogram when ready
            }
            catch (error) {
                // Only throttle error messages if repeated failures
                const now = Date.now();
                if (now - MeteogramCard_1.lastD3RetryTime < D3_RETRY_INTERVAL) {
                    // Too soon to retry loading D3, skip this attempt
                    return;
                }
                MeteogramCard_1.lastD3RetryTime = now;
                this.setError("D3.js library could not be loaded. Please refresh the page.");
                return;
            }
        }
        // Clean up any existing chart before proceeding
        this.cleanupChart();
        // Ensure we have a clean update cycle before accessing the DOM again
        await new Promise(resolve => setTimeout(resolve, 10));
        const chartDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#chart");
        if (!chartDiv) {
            console.error("Chart container not found in DOM");
            if (this.isConnected) {
                this.requestUpdate();
                await this.updateComplete;
                await new Promise(resolve => setTimeout(resolve, 50));
                const retryChartDiv = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("#chart");
                if (!retryChartDiv) {
                    console.error("Chart container still not found after retry");
                    if (this.shadowRoot) {
                        const cardContent = this.shadowRoot.querySelector('.card-content');
                        if (cardContent && this.isConnected) {
                            cardContent.innerHTML = '<div id="chart"></div>';
                            const finalAttemptChartDiv = this.shadowRoot.querySelector("#chart");
                            if (finalAttemptChartDiv) {
                                this._renderChart(finalAttemptChartDiv, "_drawMeteogram-finalAttempt");
                                return;
                            }
                        }
                    }
                    return;
                }
                this._renderChart(retryChartDiv, "_drawMeteogram-retry");
            }
            return;
        }
        // Pass only chartDiv to _renderChart (remove data argument)
        this._renderChart(chartDiv, "_drawMeteogram");
    }
    _renderChart(chartDiv, source = "unknown") {
        console.debug(`[${CARD_NAME}] _renderChart called from: ${source}`);
        // Queue logic: If already rendering, do not start another
        if (this._chartRenderInProgress) {
            console.debug(`[${CARD_NAME}] _renderChart: already in progress, skipping.`);
            return;
        }
        this._chartRenderInProgress = true;
        console.debug(`[${CARD_NAME}] _renderChart: starting render.`);
        // Responsive sizing based on parent
        const parent = chartDiv.parentElement;
        let availableWidth = parent ? parent.clientWidth : chartDiv.offsetWidth || 350;
        let availableHeight = parent ? parent.clientHeight : chartDiv.offsetHeight || 180;
        // Remove aspect ratio logic, use full container size
        let width = chartDiv.offsetWidth > 0
            ? chartDiv.offsetWidth
            : availableWidth;
        let height = chartDiv.offsetHeight > 0
            ? chartDiv.offsetHeight
            : availableHeight;
        // Clean up previous chart
        chartDiv.innerHTML = "";
        // Fetch weather data and render
        this.fetchWeatherData().then((data) => {
            // If using weather entity and it's unavailable, do not render
            if (this.entityId && this.entityId !== 'none' && this._weatherEntityApiInstance) {
                const entityData = this._weatherEntityApiInstance.getForecastData();
                if (!entityData) {
                    this.setError(`Weather entity ${this.entityId} is unavailable. Waiting for it to become available...`);
                    return;
                }
            }
            // Determine if wind data is available
            const windAvailable = this.showWind &&
                Array.isArray(data.windSpeed) &&
                data.windSpeed.length > 0 &&
                data.windSpeed.some(v => typeof v === "number");
            // Set windBand based on wind availability
            const windBandHeight = windAvailable ? 45 : 0;
            const hourLabelBand = 30;
            // --- ADJUST: Remove chartHeight cap and use full height ---
            // Store dimensions for resize detection
            this._lastWidth = availableWidth;
            this._lastHeight = availableHeight;
            this.svg = window.d3.select(chartDiv)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${width + 140} ${height}`)
                .attr("preserveAspectRatio", "none"); // Fill container, no aspect ratio
            const maxHourSpacing = 90;
            Math.min(width, Math.max(300, maxHourSpacing * (data.time.length - 1)));
            let hours = 48;
            if (this.meteogramHours === "8h")
                hours = 8;
            else if (this.meteogramHours === "12h")
                hours = 12;
            else if (this.meteogramHours === "24h")
                hours = 24;
            else if (this.meteogramHours === "48h")
                hours = 48;
            else if (this.meteogramHours === "54h")
                hours = 54;
            else if (this.meteogramHours === "max")
                hours = data.time.length;
            const sliceData = (arr) => arr.slice(0, Math.min(hours, arr.length) + 1);
            const slicedData = {
                time: sliceData(data.time),
                temperature: sliceData(data.temperature),
                rain: sliceData(data.rain),
                rainMin: sliceData(data.rainMin),
                rainMax: sliceData(data.rainMax),
                snow: sliceData(data.snow),
                cloudCover: sliceData(data.cloudCover),
                windSpeed: sliceData(data.windSpeed),
                windDirection: sliceData(data.windDirection),
                symbolCode: sliceData(data.symbolCode),
                pressure: sliceData(data.pressure)
            };
            this.renderMeteogram(this.svg, slicedData, width, height, windBandHeight, hourLabelBand);
            // Reset error tracking on success
            this.errorCount = 0;
            // Clear retry timer if successful
            if (this._weatherRetryTimeout) {
                clearTimeout(this._weatherRetryTimeout);
                this._weatherRetryTimeout = null;
            }
            this._setupResizeObserver();
            this._setupVisibilityObserver();
            this._setupMutationObserver();
        }).catch((err) => {
            // If error is due to unavailable entity, show waiting message
            if (err.message && err.message.includes("is unavailable. Waiting for it to become available")) {
                this.setError(`Weather entity ${this.entityId} is unavailable. Waiting for it to become available...`);
                // Optionally, schedule a retry after a short delay
                if (this._weatherRetryTimeout)
                    clearTimeout(this._weatherRetryTimeout);
                this._weatherRetryTimeout = window.setTimeout(() => {
                    this.meteogramError = "";
                    this._drawMeteogram("retry-entity-unavailable");
                }, 500); // Retry every 0.5 seconds
            }
            else {
                this.setError("Weather data not available, retrying in 60 seconds");
                if (this._weatherRetryTimeout)
                    clearTimeout(this._weatherRetryTimeout);
                this._weatherRetryTimeout = window.setTimeout(() => {
                    this.meteogramError = "";
                    this._drawMeteogram("retry-after-error");
                }, 60000);
            }
        }).finally(() => {
            this._chartRenderInProgress = false;
            // Assign _statusLastRender with a date string when rendering completes
            this._statusLastRender = new Date().toISOString();
            console.debug(`[${CARD_NAME}] _renderChart: finished render.`);
            // If a render was queued, run it now
            if (this._pendingRender) {
                this._pendingRender = false;
                console.debug(`[${CARD_NAME}] _renderChart: running pending render.`);
                this._drawMeteogram("pending-after-render");
            }
        });
    }
    // Add a helper to get the HA locale string for date formatting
    getHaLocale() {
        // Use hass.language if available, fallback to "en"
        return (this.hass && this.hass.language) ? this.hass.language : "en";
    }
    // Update renderMeteogram to add windBarbBand and hourLabelBand as arguments
    renderMeteogram(svg, data, width, height, windBandHeight = 0, hourLabelBand = 24) {
        const d3 = window.d3;
        const { time, temperature, rain, rainMin, rainMax, snow, cloudCover, windSpeed, windDirection, symbolCode, pressure } = data;
        const N = time.length;
        // console.debug(`[${CARD_NAME}] renderMeteogram with ${N} data points, width=${width}, height=${height}, windBandHeight=${windBandHeight}, hourLabelBand=${hourLabelBand}`);
        const tempUnit = this.getSystemTemperatureUnit();
        const temperatureConverted = temperature.map(t => this.convertTemperature(t));
        // -------------------------------------------------------------
        this.showPressure && pressure && pressure.length > 0;
        const windAvailable = this.showWind && windDirection && windSpeed.length > 0 && windDirection.length > 0;
        const cloudAvailable = this.showCloudCover && cloudCover && cloudCover.length > 0;
        const snowAvailable = this.showRain && snow && snow.length > 0;
        // -------------------------------------------------------------
        // SVG and chart parameters
        // In focussed mode, remove top margin for legends
        const margin = this.focussed
            ? { top: 20, left: 40 }
            : { top: 70, left: 70 };
        const chartHeight = this.focussed
            ? height - windBandHeight - hourLabelBand - 10
            : height - windBandHeight - hourLabelBand - 50 - 10; // Extra space for legends in non-focussed mode
        // console.debug(`[${CARD_NAME}] chartHeight calculated as: ${chartHeight}`);
        // Cap the chart width to only what's needed for the data
        const maxHourSpacing = 90;
        const chartWidth = this.focussed
            ? Math.min(width, Math.max(300, maxHourSpacing * (N - 1))) + 60
            : Math.min(width, Math.max(300, maxHourSpacing * (N - 1)));
        // Adjust dx for wider charts - ensure elements don't get too stretched or squished
        let dx = chartWidth / (N - 1);
        // X scale - for wider charts, maintain reasonable hour spacing
        const x = d3.scaleLinear()
            .domain([0, N - 1])
            .range([0, chartWidth]);
        // Adjust the actual dx to what's being used by the scale
        dx = x(1) - x(0);
        // Find day boundaries for shaded backgrounds
        const dateLabelY = margin.top - 30;
        const dayStarts = [];
        for (let i = 0; i < N; i++) {
            if (i === 0 || time[i].getDate() !== time[i - 1].getDate()) {
                dayStarts.push(i);
            }
        }
        const dayRanges = [];
        for (let i = 0; i < dayStarts.length; ++i) {
            const startIdx = dayStarts[i];
            const endIdx = (i + 1 < dayStarts.length) ? dayStarts[i + 1] : N;
            dayRanges.push({ start: startIdx, end: endIdx });
        }
        // Alternate shaded background for days
        svg.selectAll(".day-bg")
            .data(dayRanges)
            .enter()
            .append("rect")
            .attr("class", "day-bg")
            .attr("x", (d) => margin.left + x(d.start))
            .attr("y", margin.top - 42)
            // Limit width to only main chart area (do not extend to right axis)
            .attr("width", (d) => Math.min(x(Math.max(d.end - 1, d.start)) - x(d.start) + dx, chartWidth - x(d.start)))
            // Limit height to only main chart area (do not extend to lower x axis)
            .attr("height", chartHeight + 42)
            .attr("opacity", (_, i) => i % 2 === 0 ? 0.16 : 0);
        // Day boundary ticks
        svg.selectAll(".day-tic")
            .data(dayStarts)
            .enter()
            .append("line")
            .attr("class", "day-tic")
            .attr("x1", (d) => margin.left + x(d))
            .attr("x2", (d) => margin.left + x(d))
            .attr("y1", dateLabelY + 22)
            .attr("y2", dateLabelY + 42)
            .attr("stroke", "#1a237e")
            .attr("stroke-width", 3)
            .attr("opacity", 0.6);
        const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
        // Temperature Y scale, handling null values
        const tempValues = temperatureConverted.filter((t) => t !== null);
        const yTemp = d3.scaleLinear()
            .domain([Math.floor(d3.min(tempValues) - 2), Math.ceil(d3.max(tempValues) + 2)])
            .range([chartHeight, 0]);
        // Precipitation Y scale
        const yPrecip = d3.scaleLinear()
            .domain([0, Math.max(2, d3.max([...rainMax, ...rain, ...snow]) + 1)])
            .range([chartHeight, 0]); // <-- FIXED: range goes from chartHeight (bottom) to 0 (top)
        // Pressure Y scale - we'll use the right side of the chart
        // Only create if pressure is shown and at least one value is not null/undefined
        let yPressure;
        const hasPressure = this.showPressure && Array.isArray(pressure) && pressure.some(p => p !== null && typeof p === "number" && !isNaN(p));
        if (hasPressure) {
            const validPressures = pressure.filter((p) => p !== null && typeof p === "number" && !isNaN(p));
            const pressureRange = d3.extent(validPressures);
            const pressurePadding = (pressureRange[1] - pressureRange[0]) * 0.1;
            yPressure = d3.scaleLinear()
                .domain([
                Math.floor((pressureRange[0] - pressurePadding) / 5) * 5,
                Math.ceil((pressureRange[1] + pressurePadding) / 5) * 5
            ])
                .range([chartHeight, 0]);
        }
        // Add vertical gridlines
        chart.append("g")
            .attr("class", "xgrid")
            .selectAll("line")
            .data(d3.range(N))
            .enter().append("line")
            .attr("x1", (i) => x(i))
            .attr("x2", (i) => x(i))
            .attr("y1", 0)
            .attr("y2", chartHeight)
            .attr("stroke", "currentColor")
            .attr("stroke-width", 1);
        // Wind band grid lines (if wind band is enabled)
        if (windAvailable) {
            const windBandYOffset = margin.top + chartHeight;
            const windBand = svg.append('g')
                .attr('transform', `translate(${margin.left},${windBandYOffset})`);
            // const windBandHeight = windBarbBand - 10;
            // Even hour grid lines
            const twoHourIdx = [];
            for (let i = 0; i < N; i++) {
                if (time[i].getHours() % 2 === 0)
                    twoHourIdx.push(i);
            }
            windBand.selectAll(".wind-band-grid")
                .data(twoHourIdx)
                .enter()
                .append("line")
                .attr("class", "wind-band-grid")
                .attr("x1", (i) => x(i))
                .attr("x2", (i) => x(i))
                .attr("y1", 0)
                .attr("y2", windBandHeight)
                .attr("stroke", "currentColor")
                .attr("stroke-width", 1);
            // Wind band border (outline)
            windBand.append("rect")
                .attr("class", "wind-band-outline")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", chartWidth)
                .attr("height", windBandHeight)
                .attr("stroke", "currentColor")
                .attr("stroke-width", 2)
                .attr("fill", "none");
        }
        chart.selectAll(".twentyfourh-line")
            .data(dayStarts.slice(1)) // skip first, draw at each new day
            .enter()
            .append("line")
            .attr("class", "twentyfourh-line")
            .attr("x1", (d) => x(d))
            .attr("x2", (d) => x(d))
            .attr("y1", 0)
            .attr("y2", chartHeight)
            .attr("stroke", "var(--meteogram-grid-color, #b8c4d9)")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "6,5")
            .attr("opacity", 0.7);
        // Chart data rendering...
        // Cloud cover band - only if enabled
        if (cloudAvailable) {
            const bandTop = chartHeight * 0.01;
            const bandHeight = chartHeight * 0.20;
            const cloudBandPoints = [];
            // Calculate cloud cover band points (override: cloudCover from 100.0 down to 0.0 for testing)
            // const testCloudCover = Array.from({ length: cloudCover.length }, (_, i) =>
            //     100.0 - (100.0 * i) / (cloudCover.length - 1)
            // );
            // FIX: Use 1 - cloudCover[i] / 100 for the top band so higher cloud cover means more shading
            for (let i = 0; i < N; i++) {
                cloudBandPoints.push([x(i), bandTop + (bandHeight / 2) * (1 - cloudCover[i] / 100)]);
            }
            // For the bottom band, use cloudCover[i] / 100
            for (let i = N - 1; i >= 0; i--) {
                cloudBandPoints.push([x(i), bandTop + (bandHeight / 2) * (1 + cloudCover[i] / 100)]);
            }
            chart.append("path")
                .attr("class", "cloud-area")
                .attr("d", d3.line()
                .x((d) => d[0])
                .y((d) => d[1])
                .curve(d3.curveLinearClosed)(cloudBandPoints));
        }
        // Pressure axis (right side) - only if enabled and pressure data present
        if (hasPressure && yPressure) {
            chart.append("g")
                .attr("class", "pressure-axis")
                .attr("transform", `translate(${chartWidth}, 0)`)
                .call(d3.axisRight(yPressure)
                .tickFormat((d) => `${d}`));
            if (!this.focussed) {
                chart.append("text")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("transform", `translate(${chartWidth + 50},${chartHeight / 2}) rotate(90)`)
                    .text(trnslt(this.hass, "ui.card.meteogram.attributes.air_pressure", "Pressure") + " (hPa)");
                chart.append("text")
                    .attr("class", "legend legend-pressure")
                    .attr("x", 340).attr("y", -45)
                    .text(trnslt(this.hass, "ui.card.meteogram.attributes.air_pressure", "Pressure") + " (hPa)");
            }
        }
        // --- ADD: Always add temperature Y axis (left side) ---
        chart.append("g")
            .attr("class", "temperature-axis")
            .call(window.d3.axisLeft(yTemp)
            .tickFormat((d) => `${d}`));
        // --------------------------------------------------
        // --- ADD: Also add temperature Y axis for horizontal grid lines (no numbers) ---
        chart.append("g")
            .attr("class", "grid")
            .call(window.d3.axisLeft(yTemp)
            .tickSize(-chartWidth)
            .tickFormat(() => ""));
        // --------------------------------------------------
        // Top horizontal solid line (thicker, uses grid color)
        chart.append("line")
            .attr("class", "line")
            .attr("x1", 0).attr("x2", chartWidth)
            .attr("y1", 0).attr("y2", 0)
            .attr("stroke", "var(--meteogram-grid-color, #e0e0e0)")
            .attr("stroke-width", 3);
        // Bottom solid line (uses grid color)
        chart.append("line")
            .attr("class", "line")
            .attr("x1", 0).attr("x2", chartWidth)
            .attr("y1", chartHeight).attr("y2", chartHeight)
            .attr("stroke", "var(--meteogram-grid-color, #e0e0e0)");
        // Right vertical solid line (always drawn, slightly thicker)
        chart.append("line")
            .attr("class", "line")
            .attr("x1", chartWidth).attr("x2", chartWidth)
            .attr("y1", 0).attr("y2", chartHeight)
            .attr("stroke", "var(--meteogram-grid-color, #e0e0e0)")
            .attr("stroke-width", 3);
        // Left vertical solid line (always drawn, slightly thicker)
        chart.append("line")
            .attr("class", "line")
            .attr("x1", 0).attr("x2", 0)
            .attr("y1", 0).attr("y2", chartHeight)
            .attr("stroke", "var(--meteogram-grid-color, #e0e0e0)")
            .attr("stroke-width", 3);
        if (!this.focussed) {
            // Only add cloud cover legend if enabled
            if (cloudAvailable) {
                chart.append("text")
                    .attr("class", "legend legend-cloud")
                    .attr("x", 0).attr("y", -45)
                    .text(trnslt(this.hass, "ui.card.meteogram.attributes.cloud_coverage", "Cloud Cover") + ` (%)`);
            }
            // Only add snow legend if snow data is available
            if (snowAvailable) {
                chart.append("text")
                    .attr("class", "legend legend-snow")
                    .attr("x", 630).attr("y", -45)
                    .text(trnslt(this.hass, "ui.card.meteogram.attributes.snow", "Snow") + ' (mm)');
            }
            chart.append("text")
                .attr("class", "legend legend-temp")
                .attr("x", 200).attr("y", -45)
                .text(trnslt(this.hass, "ui.card.meteogram.attributes.temperature", `Temperature`) + ` (${tempUnit})`);
            chart.append("text")
                .attr("class", "legend legend-rain")
                .attr("x", 480).attr("y", -45)
                .text(trnslt(this.hass, "ui.card.meteogram.attributes.precipitation", "Rain") + ` (mm)`);
        }
        // Temperature line
        const line = d3.line()
            .defined((d) => d !== null)
            .x((_, i) => x(i))
            .y((_, i) => temperatureConverted[i] !== null ? yTemp(temperatureConverted[i]) : 0)
            .curve(d3.curveMonotoneX); // <-- Add smoothing
        chart.append("path")
            .datum(temperatureConverted)
            .attr("class", "temp-line")
            .attr("d", line)
            .attr("stroke", "currentColor");
        // Pressure line - only if enabled and pressure data present
        if (hasPressure && yPressure) {
            const pressureLine = d3.line()
                .defined((d) => d !== null && typeof d === "number" && !isNaN(d))
                .x((_, i) => x(i))
                .y((d) => yPressure(d));
            chart.append("path")
                .datum(pressure)
                .attr("class", "pressure-line")
                .attr("d", pressureLine)
                .attr("stroke", "currentColor");
        }
        // Weather icons along temperature curve - only if enabled
        if (this.showWeatherIcons) {
            const iconInterval = this.denseWeatherIcons ? 1 : 2;
            chart.selectAll(".weather-icon")
                .data(symbolCode)
                .enter()
                .append("foreignObject")
                .attr("class", "weather-icon")
                .attr("x", (_, i) => x(i) - 20)
                .attr("y", (_, i) => {
                const temp = temperatureConverted[i];
                return temp !== null ? yTemp(temp) - 40 : -999;
            })
                .attr("width", 40)
                .attr("height", 40)
                .attr("opacity", (_, i) => (temperatureConverted[i] !== null && i % iconInterval === 0) ? 1 : 0)
                .each((d, i, nodes) => {
                if (i % iconInterval !== 0)
                    return;
                const node = nodes[i];
                if (!d)
                    return;
                // Always use remapped Met.no icon names
                let iconName = d;
                if (this.entityId && this.entityId !== 'none' && this._weatherEntityApiInstance) {
                    iconName = mapHaConditionToMetnoSymbol(d);
                }
                else {
                    iconName = d
                        .replace(/^lightssleet/, 'lightsleet')
                        .replace(/^lightssnow/, 'lightsnow');
                }
                this.getIconSVG(iconName).then(svgContent => {
                    if (svgContent) {
                        const div = document.createElement('div');
                        div.style.width = '40px';
                        div.style.height = '40px';
                        div.innerHTML = svgContent;
                        node.appendChild(div);
                    }
                    else {
                        console.warn(`Failed to load icon: ${iconName}`);
                    }
                }).catch((err) => {
                    console.error(`Error loading icon ${iconName}:`, err);
                });
            });
        }
        // Rain bars with labels - only if enabled
        const barWidth = Math.min(26, dx * 0.8);
        if (this.showRain) {
            // Draw max rain bars (background, lighter blue)
            chart.selectAll(".rain-max-bar")
                .data(rainMax.slice(0, N - 1))
                .enter().append("rect")
                .attr("class", "rain-max-bar")
                .attr("x", (_, i) => x(i) + dx / 2 - barWidth / 2)
                .attr("y", (d) => {
                const h = chartHeight - yPrecip(d);
                const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                return yPrecip(0) - scaledH;
            })
                .attr("width", barWidth)
                .attr("height", (d) => {
                const h = chartHeight - yPrecip(d);
                return h < 2 && d > 0 ? 2 : h * 0.7;
            })
                .attr("fill", "currentColor");
            // Draw main rain bars (foreground, deeper blue)
            chart.selectAll(".rain-bar")
                .data(rain.slice(0, N - 1))
                .enter().append("rect")
                .attr("class", "rain-bar")
                .attr("x", (_, i) => x(i) + dx / 2 - barWidth / 2)
                .attr("y", (d) => {
                const h = chartHeight - yPrecip(d);
                const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                return yPrecip(0) - scaledH;
            })
                .attr("width", barWidth)
                .attr("height", (d) => {
                const h = chartHeight - yPrecip(d);
                return h < 2 && d > 0 ? 2 : h * 0.7;
            })
                .attr("fill", "currentColor");
            // Add main rain labels (show if rain > 0)
            chart.selectAll(".rain-label")
                .data(rain.slice(0, N - 1))
                .enter()
                .append("text")
                .attr("class", "rain-label")
                .attr("x", (_, i) => x(i) + dx / 2)
                .attr("y", (d) => {
                const h = chartHeight - yPrecip(d);
                const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                return yPrecip(0) - scaledH - 4; // 4px above the top of the bar
            })
                .text((d) => {
                if (d <= 0)
                    return "";
                return d < 1 ? d.toFixed(1) : d.toFixed(0);
            })
                .attr("opacity", (d) => d > 0 ? 1 : 0);
            // Add max rain labels (show if max > rain)
            chart.selectAll(".rain-max-label")
                .data(rainMax.slice(0, N - 1))
                .enter()
                .append("text")
                .attr("class", "rain-max-label")
                .attr("x", (_, i) => x(i) + dx / 2)
                // Remove unused 'i' from the function signature
                .attr("y", (d) => {
                const h = chartHeight - yPrecip(d);
                const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                return yPrecip(0) - scaledH - 18; // 18px above the top of the max bar
            })
                .text((d, i) => {
                if (d <= rain[i])
                    return "";
                return d < 1 ? d.toFixed(1) : d.toFixed(0);
            })
                .attr("opacity", (d, i) => (d > rain[i]) ? 1 : 0);
            if (snowAvailable) {
                chart.selectAll(".snow-bar")
                    .data(snow.slice(0, N - 1))
                    .enter().append("rect")
                    .attr("class", "snow-bar")
                    .attr("x", (_, i) => x(i) + dx / 2 - barWidth / 2)
                    .attr("y", (_, i) => {
                    const h = chartHeight - yPrecip(snow[i]);
                    const scaledH = h < 2 && snow[i] > 0 ? 2 : h * 0.7;
                    return yPrecip(0) - scaledH;
                })
                    .attr("width", barWidth)
                    .attr("height", (d) => {
                    const h = chartHeight - yPrecip(d);
                    return h < 2 && d > 0 ? 2 : h * 0.7;
                })
                    .attr("fill", "currentColor");
            }
        }
        // Wind band - only if enabled
        if (windAvailable) {
            const windBandYOffset = margin.top + chartHeight;
            const windBand = svg.append('g')
                .attr('transform', `translate(${margin.left},${windBandYOffset})`);
            // const windBandHeight = windBarbBand - 10;
            const windBarbY = windBandHeight / 2;
            windBand.append("rect")
                .attr("class", "wind-band-bg")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", chartWidth)
                .attr("height", windBandHeight);
            // Even hour grid lines
            const twoHourIdx = [];
            for (let i = 0; i < N; i++) {
                if (time[i].getHours() % 2 === 0)
                    twoHourIdx.push(i);
            }
            windBand.selectAll(".wind-band-grid")
                .data(twoHourIdx)
                .enter()
                .append("line")
                .attr("class", "wind-band-grid")
                .attr("x1", (i) => x(i))
                .attr("x2", (i) => x(i))
                .attr("y1", 0)
                .attr("y2", windBandHeight)
                .attr("stroke", "currentColor")
                .attr("stroke-width", 1);
            const dayChangeIdx = dayStarts.slice(1);
            windBand.selectAll(".twentyfourh-line-wind")
                .data(dayChangeIdx)
                .enter()
                .append("line")
                .attr("class", "twentyfourh-line-wind")
                .attr("x1", (i) => x(i))
                .attr("x2", (i) => x(i))
                .attr("y1", 0)
                .attr("y2", windBandHeight);
            // Find the even hours for grid lines first
            const evenHourIdx = [];
            for (let i = 0; i < N; i++) {
                if (time[i].getHours() % 2 === 0)
                    evenHourIdx.push(i);
            }
            // Now place wind barbs exactly in the middle between even hours
            for (let idx = 0; idx < evenHourIdx.length - 1; idx++) {
                const startIdx = evenHourIdx[idx];
                const endIdx = evenHourIdx[idx + 1];
                // Skip if the interval doesn't match our desired spacing for small screens
                if (width < 400 && idx % 2 !== 0)
                    continue;
                // Calculate the exact center between the grid lines
                const centerX = (x(startIdx) + x(endIdx)) / 2;
                // Use average data for the interval
                const dataIdx = Math.floor((startIdx + endIdx) / 2);
                const speed = windSpeed[dataIdx];
                const dir = windDirection[dataIdx];
                // Scale barb length based on screen size
                const minBarbLen = width < 400 ? 18 : 23;
                const maxBarbLen = width < 400 ? 30 : 38;
                const windLenScale = d3.scaleLinear()
                    .domain([0, Math.max(15, d3.max(windSpeed) || 20)])
                    .range([minBarbLen, maxBarbLen]);
                const barbLen = windLenScale(speed);
                // Draw the wind barb
                this.drawWindBarb(windBand, centerX, windBarbY, speed, dir, barbLen, width < 400 ? 0.7 : 0.8);
            }
            // Wind band border
            windBand.append("rect")
                .attr("class", "wind-band-outline")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", chartWidth)
                .attr("height", windBandHeight)
                .attr("stroke", "currentColor") // Match axis/grid color
                .attr("stroke-width", 1)
                .attr("fill", "none");
        }
        // Bottom hour labels - always placed below the chart area
        const hourLabelY = margin.top + chartHeight + windBandHeight + 15;
        // FIX: Place hour labels at the same x as their vertical grid line (i.e., x(i))
        svg.selectAll(".bottom-hour-label")
            .data(data.time)
            .enter()
            .append("text")
            .attr("class", "bottom-hour-label")
            .attr("x", (_, i) => margin.left + x(i))
            .attr("y", hourLabelY)
            .attr("text-anchor", "middle")
            .text((d, i) => {
            const haLocale = this.getHaLocale();
            const hour = d.toLocaleTimeString(haLocale, { hour: "2-digit", hour12: false });
            if (width < 400) {
                return i % 6 === 0 ? hour : "";
            }
            else if (width > 800) {
                return i % 2 === 0 ? hour : "";
            }
            else {
                return i % 3 === 0 ? hour : "";
            }
        });
        if (!this.focussed) {
            // Axis labels
            chart.append("text")
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", `translate(-50,${chartHeight / 2}) rotate(-90)`)
                .text(trnslt(this.hass, "ui.card.weather.attributes.temperature", `Temperature`) + ` (${tempUnit})`);
            // Date labels at top - with spacing check to prevent overlap
            svg.selectAll(".top-date-label")
                .data(dayStarts)
                .enter()
                .append("text")
                .attr("class", "top-date-label")
                .attr("x", (d, i) => {
                // Ensure last label does not go outside chart area
                const rawX = margin.left + x(d);
                if (i === dayStarts.length - 1) {
                    // Cap to chart right edge minus a small margin
                    return Math.min(rawX, margin.left + chartWidth - 80);
                }
                return rawX;
            })
                .attr("y", dateLabelY)
                .attr("text-anchor", "start")
                .attr("opacity", (d, i) => {
                // Check if there's enough space for this label
                if (i === dayStarts.length - 1)
                    return 1; // Always show the last day
                const thisLabelPos = margin.left + x(d);
                const nextLabelPos = margin.left + x(dayStarts[i + 1]);
                const minSpaceNeeded = 100; // Minimum pixels needed between labels
                // If not enough space between this and next label, hide this one
                return nextLabelPos - thisLabelPos < minSpaceNeeded ? 0 : 1;
            })
                .text((d) => {
                const dt = time[d];
                // Use HA locale for date formatting
                const haLocale = this.getHaLocale();
                return dt.toLocaleDateString(haLocale, { weekday: "short", day: "2-digit", month: "short" });
            });
        }
        // Day boundary ticks
        svg.selectAll(".day-tic")
            .data(dayStarts)
            .enter()
            .append("line")
            .attr("class", "day-tic")
            .attr("x1", (d) => margin.left + x(d))
            .attr("x2", (d) => margin.left + x(d))
            .attr("y1", dateLabelY + 22)
            .attr("y2", dateLabelY + 42)
            .attr("stroke", "#1a237e")
            .attr("stroke-width", 3)
            .attr("opacity", 0.6);
    }
    // Draw a wind barb at the given position
    drawWindBarb(g, x, y, speed, dirDeg, len, scale = 0.8) {
        const featherLong = 12;
        const featherShort = 6;
        const featherYOffset = 3;
        const barbGroup = g.append("g")
            .attr("transform", `translate(${x},${y}) rotate(${dirDeg}) scale(${scale})`);
        const y0 = -len / 2, y1 = +len / 2;
        if (speed < 2) {
            barbGroup.append("circle")
                .attr("class", "wind-barb-calm")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 4);
            return;
        }
        barbGroup.append("line")
            .attr("class", "wind-barb")
            .attr("x1", 0).attr("y1", y0)
            .attr("x2", 0).attr("y2", y1);
        barbGroup.append("circle")
            .attr("class", "wind-barb-dot")
            .attr("cx", 0)
            .attr("cy", y1)
            .attr("r", 4);
        let v = speed, wy = y0, step = 7;
        let n10 = Math.floor(v / 10);
        v -= n10 * 10;
        let n5 = Math.floor(v / 5);
        v -= n5 * 5;
        for (let i = 0; i < n10; i++, wy += step) {
            barbGroup.append("line")
                .attr("class", "wind-barb-feather")
                .attr("x1", 0).attr("y1", wy)
                .attr("x2", featherLong).attr("y2", wy + featherYOffset);
        }
        for (let i = 0; i < n5; i++, wy += step) {
            barbGroup.append("line")
                .attr("class", "wind-barb-half")
                .attr("x1", 0).attr("y1", wy)
                .attr("x2", featherShort).attr("y2", wy + featherYOffset / 1.5);
        }
    }
    // Add explicit render method to ensure chart container is created properly
    render() {
        this._updateDarkMode(); // Ensure dark mode is set before rendering
        // Build inline style string from styles property
        const styleVars = Object.entries(this.styles || {})
            .map(([k, v]) => `${k}: ${v};`)
            .join(" ");
        const successRate = WeatherAPI.METEOGRAM_CARD_API_CALL_COUNT > 0
            ? Math.round(100 * WeatherAPI.METEOGRAM_CARD_API_SUCCESS_COUNT / WeatherAPI.METEOGRAM_CARD_API_CALL_COUNT)
            : 0;
        const successTooltip = `API Success Rate: ${WeatherAPI.METEOGRAM_CARD_API_SUCCESS_COUNT}/${WeatherAPI.METEOGRAM_CARD_API_CALL_COUNT} (${successRate}%) since ${METEOGRAM_CARD_STARTUP_TIME.toISOString()}`;
        // In Focussed mode, hide title and attribution
        if (this.focussed) {
            return x `
                <ha-card style="${styleVars}">
                    <div class="card-content">
                        ${this.meteogramError
                ? x `
                                <div class="error" style="white-space:normal;"
                                     .innerHTML=${this.meteogramError}></div>`
                : x `
                                <div id="chart"></div>
                            `}
                    </div>
                </ha-card>
            `;
        }
        // Only show attribution if WeatherAPI is used (not weather entity)
        const showAttribution = !(this.entityId && this.entityId !== 'none');
        return x `
                <ha-card style="${styleVars}">
                    ${this.title ? x `
                        <div class="card-header">${this.title}</div>` : ""}
                    <div class="card-content">
                        ${showAttribution ? x `
                        <div class="attribution">
                            ${trnslt(this.hass, "ui.card.meteogram.attribution", "Data from")} <a href="https://met.no/"
                                                                                                  target="_blank"
                                                                                                  rel="noopener"
                                                                                                  style="color: inherit;">met.no</a>
                            <span
                                    style="margin-left:8px; vertical-align:middle;"
                                    title="${this._lastApiSuccess
            ? trnslt(this.hass, 'ui.card.meteogram.status.success', 'success') + ` : ${successTooltip}`
            : this._statusApiSuccess === null
                ? trnslt(this.hass, 'ui.card.meteogram.status.cached', 'cached') + ` : ${successTooltip}`
                : trnslt(this.hass, 'ui.card.meteogram.status.failed', 'failed') + ` : ${successTooltip}`}"
                            >${this._lastApiSuccess
            ? "✅"
            : this._statusApiSuccess === null
                ? "❎"
                : "❌"}</span>
                        </div>
                        ` : ""}
                        ${this.meteogramError
            ? x `
                                <div class="error" style="white-space:normal;"
                                     .innerHTML=${this.meteogramError}></div>`
            : x `
                                <div id="chart"></div>
                                ${this.diagnostics ? x `
                                    <div id="meteogram-status-panel"
                                         style="margin-top:12px; font-size:0.95em; background:#f5f5f5; border-radius:6px; padding:8px; color:#333;"
                                         xmlns="http://www.w3.org/1999/html">
                                        <b>${trnslt(this.hass, "ui.card.meteogram.status_panel", "Status Panel")}</b>
                                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
                                            <div>
                                                <span>${trnslt(this.hass, "ui.card.meteogram.status.expires_at", "Expires At")}
                                                    : ${this.apiExpiresAt ? new Date(this.apiExpiresAt).toISOString() : "unknown"}</span><br>
                                                <span>${trnslt(this.hass, "ui.card.meteogram.status.last_render", "Last Render")}
                                                    : ${this._statusLastRender || "unknown"}</span><br>
                                                <span>${trnslt(this.hass, "ui.card.meteogram.status.last_data_fetch", "Last Data Fetch")}
                                                    : ${this._statusLastFetch || "unknown"}</span>
                                            </div>
                                            <div>
                                                <span
                                                        title="${this._lastApiSuccess
                ? trnslt(this.hass, "ui.card.meteogram.status.success", "success") + ` : ${successTooltip}`
                : this._statusApiSuccess === null
                    ? trnslt(this.hass, "ui.card.meteogram.status.cached", "cached") + ` : ${successTooltip}`
                    : trnslt(this.hass, "ui.card.meteogram.status.failed", "failed") + ` : ${successTooltip}`}" >
                                                    ${trnslt(this.hass, "ui.card.meteogram.status.api_success", "API Success")}
                                                        : ${this._lastApiSuccess
                ? "✅"
                : this._statusApiSuccess === null
                    ? "❎"
                    : "❌"}
                                                </span>
                                                <br>
                                                <span>Card version: <code>${MeteogramCard_1.meteogramCardVersion}</code></span><br>
                                                <span>Client type: <code>${getClientName()}</code></span><br>
                                                <span>${successTooltip}</span>

                                            </div>
                                        </div>
                                    </div>
                                ` : ""}
                            `}
                    </div>
                </ha-card>
            `;
    }
    // Add logging method to help debug DOM structure - only used when errors occur
    _logDomState() {
        if (this.errorCount > 0) {
            console.debug('DOM state check:');
            console.debug('- shadowRoot exists:', !!this.shadowRoot);
            if (this.shadowRoot) {
                const chartDiv = this.shadowRoot.querySelector('#chart');
                console.debug('- chart div exists:', !!chartDiv);
                if (chartDiv) {
                    console.debug('- chart div size:', chartDiv.offsetWidth, 'x', chartDiv.offsetHeight);
                }
            }
            console.debug('- Is connected:', this.isConnected);
            console.debug('- Chart loaded:', this.chartLoaded);
        }
    }
    // Helper method to set errors with rate limiting
    setError(message) {
        const now = Date.now();
        // Always show full error as HTML if diagnostics is enabled
        this.meteogramError = message;
        this.lastErrorTime = now;
        this.errorCount = 1;
        console.error("Meteogram error:", message);
        // If this is a repeat of the same error, just count it
        if (message === this.meteogramError) {
            this.errorCount++;
            // Only update the UI with the error count periodically
            if (now - this.lastErrorTime > 10000) { // 10 seconds
                this.meteogramError = `${message} (occurred ${this.errorCount} times)`;
                this.lastErrorTime = now;
            }
        }
        else {
            // New error, reset counter
            this.errorCount = 1;
            this.meteogramError = message;
            this.lastErrorTime = now;
            console.error("Meteogram error:", message);
        }
    }
    // Add dark mode detection
    _updateDarkMode() {
        let isDark = false;
        // Home Assistant sets dark mode in hass.themes.darkMode
        if (this.hass && this.hass.themes && typeof this.hass.themes.darkMode === "boolean") {
            isDark = this.hass.themes.darkMode;
        }
        else {
            // Fallback: check .dark-theme on <html> or <body>
            isDark = document.documentElement.classList.contains('dark-theme') ||
                document.body.classList.contains('dark-theme');
        }
        if (isDark) {
            this.setAttribute('dark', '');
        }
        else {
            this.removeAttribute('dark');
        }
    }
    // Add a helper to get the system temperature unit from Home Assistant
    getSystemTemperatureUnit() {
        // Try to get from hass.config.unit_system.temperature
        if (this.hass && this.hass.config && this.hass.config.unit_system && this.hass.config.unit_system.temperature) {
            const unit = this.hass.config.unit_system.temperature;
            if (unit === "°F" || unit === "°C")
                return unit;
            // Some installations may use "F" or "C"
            if (unit === "F")
                return "°F";
            if (unit === "C")
                return "°C";
        }
        // Default to Celsius
        return "°C";
    }
    // Add a helper to convert Celsius to Fahrenheit if needed
    convertTemperature(tempC) {
        if (tempC === null || tempC === undefined)
            return tempC;
        const unit = this.getSystemTemperatureUnit();
        if (unit === "°F") {
            return tempC * 9 / 5 + 32;
        }
        return tempC;
    }
};
MeteogramCard$1.meteogramCardVersion = version;
MeteogramCard$1.lastD3RetryTime = 0;
MeteogramCard$1.styles = i$4 `
            :host {
                --meteogram-grid-color: #b8c4d9;
                --meteogram-grid-color-dark: #b8c4d9;
                --meteogram-temp-line-color: orange;
                --meteogram-temp-line-color-dark: orange;
                --meteogram-pressure-line-color: #90caf9;
                --meteogram-pressure-line-color-dark: #90caf9;
                --meteogram-rain-bar-color: deepskyblue;
                --meteogram-rain-bar-color-dark: deepskyblue;
                --meteogram-rain-max-bar-color: #7fdbff;
                --meteogram-rain-max-bar-color-dark: #7fdbff;
                --meteogram-rain-label-color: #0058a3;
                --meteogram-rain-label-color-dark: #a3d8ff;
                --meteogram-rain-max-label-color: #2693e6;
                --meteogram-rain-max-label-color-dark: #2693e6;
                --meteogram-cloud-color: #b0bec5;
                --meteogram-cloud-color-dark: #eceff1;
                --meteogram-wind-barb-color: #1976d2;
                --meteogram-wind-barb-color-dark: #1976d2;
                --meteogram-label-font-size: var(--mdc-typography-body2-font-size, 0.875rem);
                --meteogram-legend-font-size: var(--mdc-typography-body1-font-size, 1rem);
                --meteogram-tick-font-size: var(--mdc-typography-body2-font-size, 0.875rem);
                --meteogram-axis-label-color: #000;
                --meteogram-axis-label-color-dark: #fff;
                --meteogram-timescale-color: #ffb300;
                --meteogram-timescale-color-dark: #ffd54f;
                --meteogram-snow-bar-color: #b3e6ff;
                --meteogram-snow-bar-color-dark: #e0f7fa;
                display: block;
                box-sizing: border-box;
                height: 100%;
                width: 100%;
                max-width: 100%;
                max-height: 100%;
            }

            ha-card {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
                box-sizing: border-box;
                overflow: hidden;
                background: var(--card-background-color, #fff);
                color: var(--primary-text-color, #222);
            }

            .card-header {
                padding: 16px 16px 0 16px;
                font-size: 1.25em;
                font-weight: 500;
                line-height: 1.2;
                color: var(--primary-text-color, #222);
            }

            .card-content {
                position: relative;
                flex: 1 1 auto;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: stretch;
                padding: 0 16px 16px 16px;
                box-sizing: border-box;
                min-height: 0;
                min-width: 0;
                overflow: hidden;
            }

            #chart {
                width: 100%;
                height: 100%;
                min-height: 180px;
                box-sizing: border-box;
                overflow: hidden;
                display: flex;
                align-items: stretch;
                justify-content: stretch;
            }

            .error {
                color: var(--error-color, #b71c1c);
                padding: 16px;
            }

            .temp-line {
                stroke: var(--meteogram-temp-line-color);
                stroke-width: 3;
                fill: none;
            }

            :host([dark]) .temp-line {
                stroke: var(--meteogram-temp-line-color-dark);
            }

            .pressure-line {
                stroke: var(--meteogram-pressure-line-color);
                stroke-width: 4;
                stroke-dasharray: 3, 3;
                fill: none;
            }

            :host([dark]) .pressure-line {
                stroke: var(--meteogram-pressure-line-color-dark);
            }

            .rain-bar {
                fill: var(--meteogram-rain-bar-color);
                opacity: 0.8;
            }

            :host([dark]) .rain-bar {
                fill: var(--meteogram-rain-bar-color-dark);
            }

            .rain-max-bar {
                fill: var(--meteogram-rain-max-bar-color);
                opacity: 0.5;
            }

            :host([dark]) .rain-max-bar {
                fill: var(--meteogram-rain-max-bar-color-dark);
            }

            .rain-label {
                font: var(--meteogram-label-font-size) sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: var(--meteogram-rain-label-color);
            }

            :host([dark]) .rain-label {
                fill: var(--meteogram-rain-label-color-dark);
            }

            .rain-max-label {
                font: var(--meteogram-label-font-size) sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: var(--meteogram-rain-max-label-color);
            }

            :host([dark]) .rain-max-label {
                fill: var(--meteogram-rain-max-label-color-dark);
            }

            .legend {
                font: var(--meteogram-legend-font-size) sans-serif;
                fill: var(--primary-text-color, #222);
            }

            :host([dark]) .legend {
                fill: var(--primary-text-color, #fff);
            }

            .legend-temp {
                fill: var(--meteogram-temp-line-color);
            }

            :host([dark]) .legend-temp {
                fill: var(--meteogram-temp-line-color-dark);
            }

            .legend-pressure {
                fill: var(--meteogram-pressure-line-color);
            }

            :host([dark]) .legend-pressure {
                fill: var(--meteogram-pressure-line-color-dark);
            }

            .legend-rain {
                fill: var(--meteogram-rain-bar-color);
            }

            :host([dark]) .legend-rain {
                fill: var(--meteogram-rain-bar-color-dark);
            }

            .legend-rain-max {
                fill: var(--meteogram-rain-max-bar-color);
            }

            :host([dark]) .legend-rain-max {
                fill: var(--meteogram-rain-max-bar-color-dark);
            }

            .legend-snow {
                fill: #b3e6ff;
            }

            .legend-cloud {
                fill: var(--meteogram-cloud-color);
            }

            :host([dark]) .legend-cloud {
                fill: var(--meteogram-cloud-color-dark);
            }

            .wind-barb {
                stroke: var(--meteogram-wind-barb-color);
                stroke-width: 2;
                fill: none;
            }

            .wind-barb-feather {
                stroke: var(--meteogram-wind-barb-color);
                stroke-width: 1.4;
            }

            .wind-barb-half {
                stroke: var(--meteogram-wind-barb-color);
                stroke-width: 0.8;
            }

            .wind-barb-calm {
                stroke: var(--meteogram-wind-barb-color);
                fill: none;
            }

            .wind-barb-dot {
                fill: var(--meteogram-wind-barb-color);
            }

            :host([dark]) .wind-barb,
            :host([dark]) .wind-barb-feather,
            :host([dark]) .wind-barb-half,
            :host([dark]) .wind-barb-calm {
                stroke: var(--meteogram-wind-barb-color-dark);
            }

            :host([dark]) .wind-barb-dot {
                fill: var(--meteogram-wind-barb-color-dark);
            }

            .top-date-label {
                font: var(--meteogram-label-font-size, 16px) sans-serif;
                fill: var(--primary-text-color, #222);
                font-weight: bold;
                dominant-baseline: hanging;
            }

            .bottom-hour-label {
                font: var(--meteogram-label-font-size) sans-serif;
                fill: var(--meteogram-timescale-color);
            }

            :host([dark]) .bottom-hour-label {
                fill: var(--meteogram-timescale-color-dark);
            }

            .day-bg {
                fill: transparent !important;
                opacity: 0;
                pointer-events: none;
            }

            .wind-band-bg {
                fill: transparent;
            }

            .attribution {
                position: absolute;
                top: 12px;
                right: 24px;
                font-size: 0.85em;
                color: var(--secondary-text-color);
                text-align: right;
                z-index: 2;
                background: rgba(255, 255, 255, 0.7);
                padding: 2px 8px;
                border-radius: 6px;
                pointer-events: auto;
            }

            /* Tick text font size for axes */

            .temperature-axis .tick text,
            .pressure-axis .tick text {
                font-size: var(--meteogram-tick-font-size);
                fill: var(--primary-text-color, #222);
            }

            .cloud-area {
                fill: var(--meteogram-cloud-color);
                opacity: 0.42;
            }

            :host([dark]) .cloud-area {
                fill: var(--meteogram-cloud-color-dark);
                opacity: 0.55;
            }

            .axis-label {
                font: var(--meteogram-label-font-size, 14px) sans-serif;
                fill: var(--meteogram-axis-label-color);
            }

            :host([dark]) .axis-label {
                fill: var(--meteogram-axis-label-color-dark);
            }

            .grid line,
            .xgrid line,
            .wind-band-grid,
            .twentyfourh-line,
            .twentyfourh-line-wind,
            .day-tic,
            .temperature-axis path,
            .pressure-axis path,
            .wind-band-outline {
                stroke: var(--meteogram-grid-color);
            }

            :host([dark]) .grid line,
            :host([dark]) .xgrid line,
            :host([dark]) .wind-band-grid,
            :host([dark]) .twentyfourh-line,
            :host([dark]) .twentyfourh-line-wind,
            :host([dark]) .day-tic,
            :host([dark]) .temperature-axis path,
            :host([dark]) .pressure-axis path,
            :host([dark]) .wind-band-outline {
                stroke: var(--meteogram-grid-color-dark);
            }

            /* Tick text font size for axes */

            .temperature-axis .tick text,
            .pressure-axis .tick text {
                font-size: var(--meteogram-tick-font-size);
                fill: var(--primary-text-color, #222);
            }

            .cloud-area {
                fill: var(--meteogram-cloud-color);
                opacity: 0.42;
            }

            :host([dark]) .cloud-area {
                fill: var(--meteogram-cloud-color-dark);
                opacity: 0.55;
            }

            .axis-label {
                font: var(--meteogram-label-font-size, 14px) sans-serif;
                fill: var(--meteogram-axis-label-color);
            }

            :host([dark]) .axis-label {
                fill: var(--meteogram-axis-label-color-dark);
            }

            .grid line {
                stroke: var(--meteogram-grid-color);
            }

            .xgrid line {
                stroke: var(--meteogram-grid-color);
            }

            .wind-band-grid {
                stroke: var(--meteogram-grid-color);
                stroke-width: 1;
            }

            .twentyfourh-line, .day-tic {
                stroke: var(--meteogram-grid-color);
                stroke-width: 3;
                stroke-dasharray: 6, 5;
                opacity: 0.7;
            }

            .twentyfourh-line-wind {
                stroke: var(--meteogram-grid-color);
                stroke-width: 2.5;
                stroke-dasharray: 6, 5;
                opacity: 0.5;
            }

            :host([dark]) .grid line,
            :host([dark]) .xgrid line,
            :host([dark]) .wind-band-grid,
            :host([dark]) .twentyfourh-line,
            :host([dark]) .twentyfourh-line-wind,
            :host([dark]) .day-tic {
                stroke: var(--meteogram-grid-color-dark);
            }

            .temperature-axis path,
            .pressure-axis path {
                stroke: var(--meteogram-grid-color);
            }

            :host([dark]) .temperature-axis path,
            :host([dark]) .pressure-axis path {
                stroke: var(--meteogram-grid-color-dark);
            }

            .wind-band-outline {
                stroke: var(--meteogram-grid-color);
                stroke-width: 2;
                fill: none;
            }

            :host([dark]) .wind-band-outline {
                stroke: var(--meteogram-grid-color-dark);
            }
        `;
__decorate([
    n({ type: String })
], MeteogramCard$1.prototype, "title", void 0);
__decorate([
    n({ type: Number })
], MeteogramCard$1.prototype, "latitude", void 0);
__decorate([
    n({ type: Number })
], MeteogramCard$1.prototype, "longitude", void 0);
__decorate([
    n({ attribute: false })
], MeteogramCard$1.prototype, "hass", void 0);
__decorate([
    n({ type: Boolean })
], MeteogramCard$1.prototype, "showCloudCover", void 0);
__decorate([
    n({ type: Boolean })
], MeteogramCard$1.prototype, "showPressure", void 0);
__decorate([
    n({ type: Boolean })
], MeteogramCard$1.prototype, "showRain", void 0);
__decorate([
    n({ type: Boolean })
], MeteogramCard$1.prototype, "showWeatherIcons", void 0);
__decorate([
    n({ type: Boolean })
], MeteogramCard$1.prototype, "showWind", void 0);
__decorate([
    n({ type: Boolean })
], MeteogramCard$1.prototype, "denseWeatherIcons", void 0);
__decorate([
    n({ type: String })
], MeteogramCard$1.prototype, "meteogramHours", void 0);
__decorate([
    n({ type: Object })
], MeteogramCard$1.prototype, "styles", void 0);
__decorate([
    n({ type: Boolean })
], MeteogramCard$1.prototype, "diagnostics", void 0);
__decorate([
    n({ type: String })
], MeteogramCard$1.prototype, "entityId", void 0);
__decorate([
    n({ type: Boolean })
], MeteogramCard$1.prototype, "focussed", void 0);
__decorate([
    r()
], MeteogramCard$1.prototype, "chartLoaded", void 0);
__decorate([
    r()
], MeteogramCard$1.prototype, "meteogramError", void 0);
__decorate([
    r()
], MeteogramCard$1.prototype, "errorCount", void 0);
__decorate([
    r()
], MeteogramCard$1.prototype, "lastErrorTime", void 0);
__decorate([
    r()
], MeteogramCard$1.prototype, "_statusExpiresAt", void 0);
__decorate([
    r()
], MeteogramCard$1.prototype, "_statusLastRender", void 0);
__decorate([
    r()
], MeteogramCard$1.prototype, "_statusLastFetch", void 0);
__decorate([
    r()
], MeteogramCard$1.prototype, "_statusApiSuccess", void 0);
MeteogramCard$1 = MeteogramCard_1 = __decorate([
    t$1('meteogram-card')
], MeteogramCard$1);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={CHILD:2},e$1=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class e extends i{constructor(i){if(super(i),this.it=E,i.type!==t.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(r){if(r===E||null==r)return this._t=void 0,this.it=r;if(r===T)return r;if("string"!=typeof r)throw Error(this.constructor.directiveName+"() called with a non-string value");if(r===this.it)return this._t;this.it=r;const s=[r];return s.raw=s,this._t={_$litType$:this.constructor.resultType,strings:s,values:[]}}}e.directiveName="unsafeHTML",e.resultType=1;const o=e$1(e);

// Register for Home Assistant custom cards
window.customCards = window.customCards || [];
window.customCards.push({
    type: "troubleshoot-message-card",
    name: "Troubleshoot Message Card",
    description: "Shows a formatted troubleshooting message for iOS/iPad.",
    preview: "",
    documentationURL: ""
});
let TroubleshootMessageCard = class TroubleshootMessageCard extends i$1 {
    constructor() {
        super(...arguments);
        this.message = "troubleshoot-message-card";
        this.statusText = "Checking Met.no forecast for Bergen...";
        this.lastFetchTime = 0;
        this.statusTimer = null;
    }
    setConfig(config) {
        this.message = config.message || "No message provided.";
    }
    getCardSize() {
        return 1;
    }
    connectedCallback() {
        super.connectedCallback();
        this.appendLog("Card loaded, starting forecast check...");
        // Detect and log client type and iOS version if possible
        const clientInfo = this.getClientInfo();
        this.appendLog(`Client info: ${clientInfo}`);
        this.fetchForecast();
        this.statusTimer = window.setInterval(() => this.fetchForecast(), 30000);
    }
    // Helper to detect client type and iOS version (if iPad)
    getClientInfo() {
        const ua = navigator.userAgent || "";
        let info = ua;
        // Try to detect iPad/iOS and version
        if (/iPad|iPhone|iPod/.test(ua)) {
            // iOS version is usually in "OS 15_3_1" format
            const match = ua.match(/OS (\d+[_\d]*)/);
            if (match) {
                const iosVersion = match[1].replace(/_/g, ".");
                info = `iOS device (${ua.includes("iPad") ? "iPad" : "iPhone/iPod"}), iOS version: ${iosVersion}`;
            }
            else {
                info = `iOS device (${ua.includes("iPad") ? "iPad" : "iPhone/iPod"}), version unknown`;
            }
        }
        else if (/Macintosh/.test(ua) && 'ontouchend' in document) {
            // iPadOS 13+ reports as Macintosh with touch events
            const match = ua.match(/Version\/(\d+\.\d+)/);
            if (match) {
                info = `iPadOS device (Macintosh with touch), iPadOS version: ${match[1]}`;
            }
            else {
                info = "iPadOS device (Macintosh with touch), version unknown";
            }
        }
        else if (/Android/.test(ua)) {
            info = "Android device";
        }
        else if (/Windows/.test(ua)) {
            info = "Windows device";
        }
        else if (/Macintosh/.test(ua)) {
            info = "Mac device";
        }
        else {
            info = `Other device: ${ua}`;
        }
        return info;
    }
    disconnectedCallback() {
        if (this.statusTimer) {
            clearInterval(this.statusTimer);
            this.statusTimer = null;
        }
        super.disconnectedCallback();
    }
    appendLog(entry) {
        const timestamp = new Date().toLocaleTimeString();
        this.message += `\n[${timestamp}] ${entry}`;
        this.requestUpdate();
    }
    async fetchForecast() {
        const now = Date.now();
        if (now - this.lastFetchTime < 10000) {
            this.appendLog("Fetch skipped (rate limit: 10s)");
            return;
        }
        this.lastFetchTime = now;
        const latitude = 60.3838;
        const longitude = 5.3318;
        // --- Log the origin ---
        this.appendLog(`Detected window.location.origin: ${window.location.origin}`);
        // --- Call status endpoint first ---
        this.appendLog("Preparing to call Met.no status API...");
        let statusUrl = "https://api.met.no/weatherapi/locationforecast/2.0/status";
        let dedicatedStatusUrl = "https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/status";
        if (window.location.origin.includes("ui.nabu.casa")) {
            statusUrl = dedicatedStatusUrl;
            this.appendLog("Using dedicated Met.no status API endpoint for nabu.casa.");
        }
        else if (window.location.origin.includes("met.no")) {
            statusUrl = "/weatherapi/locationforecast/2.0/status";
            this.appendLog("Using relative status API URL due to origin.");
        }
        else {
            this.appendLog("Using public status API URL.");
        }
        let statusResult = "";
        try {
            this.appendLog(`Calling status API: ${statusUrl}`);
            const statusResp = await fetch(statusUrl, {
                headers: {
                    "Origin": window.location.origin,
                    "Accept": "application/json"
                }
            });
            this.appendLog(`Status API responded with: ${statusResp.status} ${statusResp.statusText}`);
            if (!statusResp.ok) {
                const errText = await statusResp.text();
                statusResult = `<div class="error">Status fetch failed.<br>
                    HTTP ${statusResp.status}: ${statusResp.statusText}<br>
                    ${errText ? `<pre>${errText}</pre>` : ""}</div>`;
                this.appendLog(`Status error: ${statusResp.status} ${statusResp.statusText}${errText ? " - " + errText : ""}`);
            }
            else {
                const statusData = await statusResp.json();
                statusResult = `<div class="status">
                    <b>Met.no Status Response:</b><br>
                    <pre>${JSON.stringify(statusData, null, 2).slice(0, 200)}${JSON.stringify(statusData, null, 2).length > 200 ? "..." : ""}</pre>
                    <span style="font-size:0.9em;color:#333;">Last checked: ${new Date().toLocaleString()}</span>
                </div>`;
                this.appendLog("Status API call successful.");
            }
        }
        catch (err) {
            statusResult = `<div class="error">Status fetch error:<br>
                ${(err === null || err === void 0 ? void 0 : err.message) ? err.message : err}</div>`;
            this.appendLog(`Status fetch error: ${(err === null || err === void 0 ? void 0 : err.message) ? err.message : err}`);
        }
        // --- Now call forecast endpoint ---
        this.appendLog(`Preparing to call Met.no forecast API for Bergen (lat=${latitude}, lon=${longitude})...`);
        let apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`;
        let dedicatedApiUrl = `https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`;
        if (window.location.origin.includes("ui.nabu.casa")) {
            apiUrl = dedicatedApiUrl;
            this.appendLog("Using dedicated Met.no API endpoint for nabu.casa.");
        }
        else if (window.location.origin.includes("met.no")) {
            apiUrl = `/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`;
            this.appendLog("Using relative API URL due to origin.");
        }
        else {
            this.appendLog("Using public API URL.");
        }
        let forecastResult = "";
        try {
            this.appendLog(`Calling forecast API: ${apiUrl}`);
            const resp = await fetch(apiUrl, {
                headers: {
                    "Origin": window.location.origin,
                    "Accept": "application/json"
                }
            });
            this.appendLog(`Forecast API responded with status: ${resp.status} ${resp.statusText}`);
            if (!resp.ok) {
                const errText = await resp.text();
                forecastResult = `<div class="error">Forecast fetch failed.<br>
                    HTTP ${resp.status}: ${resp.statusText}<br>
                    ${errText ? `<pre>${errText}</pre>` : ""}</div>`;
                this.appendLog(`Forecast error: ${resp.status} ${resp.statusText}${errText ? " - " + errText : ""}`);
            }
            else {
                const data = await resp.json();
                const forecastStr = JSON.stringify(data, null, 2);
                forecastResult = `<div class="status">
                    <b>Met.no Forecast Response:</b><br>
                    <pre>${forecastStr.slice(0, 200)}${forecastStr.length > 200 ? "..." : ""}</pre>
                    <span style="font-size:0.9em;color:#333;">Last checked: ${new Date().toLocaleString()}</span>
                </div>`;
                this.appendLog("Forecast API call successful, forecast data received.");
            }
        }
        catch (err) {
            forecastResult = `<div class="error">Forecast fetch error:<br>
                ${(err === null || err === void 0 ? void 0 : err.message) ? err.message : err}</div>`;
            this.appendLog(`Forecast fetch error: ${(err === null || err === void 0 ? void 0 : err.message) ? err.message : err}`);
        }
        // --- Show both status and forecast results ---
        this.statusText = `${statusResult}${forecastResult}`;
    }
    render() {
        return x `
            <ha-card>
                <div class="message">${this.message}</div>
                ${o(this.statusText)}
            </ha-card>
        `;
    }
};
TroubleshootMessageCard.styles = i$4 `
        ha-card {
            padding: 16px;
            font-size: 1.1em;
            background: #fffbe6;
            color: #333;
            border: 1px solid #ffe58f;
        }
        .message {
            white-space: pre-wrap;
            word-break: break-word;
        }
        .status {
            margin-top: 12px;
            padding: 10px;
            background: #e3f2fd;
            border-radius: 6px;
            font-size: 0.98em;
            color: #1565c0;
        }
        .error {
            color: #b71c1c;
            background: #ffebee;
            border-radius: 6px;
            padding: 10px;
            margin-top: 12px;
            font-size: 0.98em;
        }
    `;
__decorate([
    n({ type: String })
], TroubleshootMessageCard.prototype, "message", void 0);
__decorate([
    r()
], TroubleshootMessageCard.prototype, "statusText", void 0);
__decorate([
    r()
], TroubleshootMessageCard.prototype, "lastFetchTime", void 0);
TroubleshootMessageCard = __decorate([
    t$1('troubleshoot-message-card')
], TroubleshootMessageCard);

// Print version info - based on mushroom cards implementation
const printVersionInfo = () => {
    // Use the blue color from wind barbs and add weather emojis
    console.info(`%c☀️ ${CARD_NAME} ${version} ⚡️🌦️`, "color: #1976d2; font-weight: bold; background: white");
};
// Print version info on startup
printVersionInfo();
// Tell TypeScript that the class is being used
// @ts-ignore: Used by customElement decorator
window.customElements.get('meteogram-card') || customElements.define('meteogram-card', MeteogramCard);
// Home Assistant requires this for custom cards
window.customCards = window.customCards || [];
window.customCards.push({
    type: "meteogram-card",
    name: CARD_NAME,
    description: "A custom card showing a meteogram with wind barbs.",
    version: version,
    preview: "https://github.com/jm-cook/lovelace-meteogram-card/blob/main/images/meteogram-card.png",
    documentationURL: "https://github.com/jm-cook/lovelace-meteogram-card/blob/main/README.md"
});
//# sourceMappingURL=meteogram-card.js.map
