"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@vue/shared/dist/shared.cjs.prod.js
  var require_shared_cjs_prod = __commonJS({
    "node_modules/@vue/shared/dist/shared.cjs.prod.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function makeMap(str, expectsLowerCase) {
        const set = new Set(str.split(","));
        return expectsLowerCase ? (val) => set.has(val.toLowerCase()) : (val) => set.has(val);
      }
      var EMPTY_OBJ = {};
      var EMPTY_ARR = [];
      var NOOP2 = () => {
      };
      var NO = () => false;
      var isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
      var isModelListener = (key) => key.startsWith("onUpdate:");
      var extend = Object.assign;
      var remove = (arr, el) => {
        const i = arr.indexOf(el);
        if (i > -1) {
          arr.splice(i, 1);
        }
      };
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var hasOwn = (val, key) => hasOwnProperty.call(val, key);
      var isArray2 = Array.isArray;
      var isMap = (val) => toTypeString(val) === "[object Map]";
      var isSet = (val) => toTypeString(val) === "[object Set]";
      var isDate = (val) => toTypeString(val) === "[object Date]";
      var isRegExp = (val) => toTypeString(val) === "[object RegExp]";
      var isFunction3 = (val) => typeof val === "function";
      var isString = (val) => typeof val === "string";
      var isSymbol = (val) => typeof val === "symbol";
      var isObject2 = (val) => val !== null && typeof val === "object";
      var isPromise2 = (val) => {
        return (isObject2(val) || isFunction3(val)) && isFunction3(val.then) && isFunction3(val.catch);
      };
      var objectToString = Object.prototype.toString;
      var toTypeString = (value) => objectToString.call(value);
      var toRawType = (value) => {
        return toTypeString(value).slice(8, -1);
      };
      var isPlainObject = (val) => toTypeString(val) === "[object Object]";
      var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
      var isReservedProp = /* @__PURE__ */ makeMap(
        ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
      );
      var isBuiltInDirective = /* @__PURE__ */ makeMap(
        "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
      );
      var cacheStringFunction = (fn) => {
        const cache = /* @__PURE__ */ Object.create(null);
        return (str) => {
          const hit = cache[str];
          return hit || (cache[str] = fn(str));
        };
      };
      var camelizeRE = /-(\w)/g;
      var camelize = cacheStringFunction((str) => {
        return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
      });
      var hyphenateRE = /\B([A-Z])/g;
      var hyphenate = cacheStringFunction(
        (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
      );
      var capitalize = cacheStringFunction((str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      });
      var toHandlerKey = cacheStringFunction((str) => {
        const s = str ? `on${capitalize(str)}` : ``;
        return s;
      });
      var hasChanged2 = (value, oldValue) => !Object.is(value, oldValue);
      var invokeArrayFns = (fns, ...arg) => {
        for (let i = 0; i < fns.length; i++) {
          fns[i](...arg);
        }
      };
      var def = (obj, key, value, writable = false) => {
        Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: false,
          writable,
          value
        });
      };
      var looseToNumber = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? val : n;
      };
      var toNumber = (val) => {
        const n = isString(val) ? Number(val) : NaN;
        return isNaN(n) ? val : n;
      };
      var _globalThis;
      var getGlobalThis = () => {
        return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
      };
      var identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
      function genPropsAccessExp(name) {
        return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
      }
      var PatchFlags = {
        "TEXT": 1,
        "1": "TEXT",
        "CLASS": 2,
        "2": "CLASS",
        "STYLE": 4,
        "4": "STYLE",
        "PROPS": 8,
        "8": "PROPS",
        "FULL_PROPS": 16,
        "16": "FULL_PROPS",
        "NEED_HYDRATION": 32,
        "32": "NEED_HYDRATION",
        "STABLE_FRAGMENT": 64,
        "64": "STABLE_FRAGMENT",
        "KEYED_FRAGMENT": 128,
        "128": "KEYED_FRAGMENT",
        "UNKEYED_FRAGMENT": 256,
        "256": "UNKEYED_FRAGMENT",
        "NEED_PATCH": 512,
        "512": "NEED_PATCH",
        "DYNAMIC_SLOTS": 1024,
        "1024": "DYNAMIC_SLOTS",
        "DEV_ROOT_FRAGMENT": 2048,
        "2048": "DEV_ROOT_FRAGMENT",
        "HOISTED": -1,
        "-1": "HOISTED",
        "BAIL": -2,
        "-2": "BAIL"
      };
      var PatchFlagNames = {
        [1]: `TEXT`,
        [2]: `CLASS`,
        [4]: `STYLE`,
        [8]: `PROPS`,
        [16]: `FULL_PROPS`,
        [32]: `NEED_HYDRATION`,
        [64]: `STABLE_FRAGMENT`,
        [128]: `KEYED_FRAGMENT`,
        [256]: `UNKEYED_FRAGMENT`,
        [512]: `NEED_PATCH`,
        [1024]: `DYNAMIC_SLOTS`,
        [2048]: `DEV_ROOT_FRAGMENT`,
        [-1]: `HOISTED`,
        [-2]: `BAIL`
      };
      var ShapeFlags = {
        "ELEMENT": 1,
        "1": "ELEMENT",
        "FUNCTIONAL_COMPONENT": 2,
        "2": "FUNCTIONAL_COMPONENT",
        "STATEFUL_COMPONENT": 4,
        "4": "STATEFUL_COMPONENT",
        "TEXT_CHILDREN": 8,
        "8": "TEXT_CHILDREN",
        "ARRAY_CHILDREN": 16,
        "16": "ARRAY_CHILDREN",
        "SLOTS_CHILDREN": 32,
        "32": "SLOTS_CHILDREN",
        "TELEPORT": 64,
        "64": "TELEPORT",
        "SUSPENSE": 128,
        "128": "SUSPENSE",
        "COMPONENT_SHOULD_KEEP_ALIVE": 256,
        "256": "COMPONENT_SHOULD_KEEP_ALIVE",
        "COMPONENT_KEPT_ALIVE": 512,
        "512": "COMPONENT_KEPT_ALIVE",
        "COMPONENT": 6,
        "6": "COMPONENT"
      };
      var SlotFlags = {
        "STABLE": 1,
        "1": "STABLE",
        "DYNAMIC": 2,
        "2": "DYNAMIC",
        "FORWARDED": 3,
        "3": "FORWARDED"
      };
      var slotFlagsText = {
        [1]: "STABLE",
        [2]: "DYNAMIC",
        [3]: "FORWARDED"
      };
      var GLOBALS_ALLOWED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error";
      var isGloballyAllowed = /* @__PURE__ */ makeMap(GLOBALS_ALLOWED);
      var isGloballyWhitelisted = isGloballyAllowed;
      var range = 2;
      function generateCodeFrame(source, start = 0, end = source.length) {
        start = Math.max(0, Math.min(start, source.length));
        end = Math.max(0, Math.min(end, source.length));
        if (start > end)
          return "";
        let lines = source.split(/(\r?\n)/);
        const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
        lines = lines.filter((_, idx) => idx % 2 === 0);
        let count = 0;
        const res = [];
        for (let i = 0; i < lines.length; i++) {
          count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
          if (count >= start) {
            for (let j = i - range; j <= i + range || end > count; j++) {
              if (j < 0 || j >= lines.length)
                continue;
              const line = j + 1;
              res.push(
                `${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`
              );
              const lineLength = lines[j].length;
              const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
              if (j === i) {
                const pad = start - (count - (lineLength + newLineSeqLength));
                const length = Math.max(
                  1,
                  end > count ? lineLength - pad : end - start
                );
                res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
              } else if (j > i) {
                if (end > count) {
                  const length = Math.max(Math.min(end - count, lineLength), 1);
                  res.push(`   |  ` + "^".repeat(length));
                }
                count += lineLength + newLineSeqLength;
              }
            }
            break;
          }
        }
        return res.join("\n");
      }
      function normalizeStyle(value) {
        if (isArray2(value)) {
          const res = {};
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
            if (normalized) {
              for (const key in normalized) {
                res[key] = normalized[key];
              }
            }
          }
          return res;
        } else if (isString(value) || isObject2(value)) {
          return value;
        }
      }
      var listDelimiterRE = /;(?![^(]*\))/g;
      var propertyDelimiterRE = /:([^]+)/;
      var styleCommentRE = /\/\*[^]*?\*\//g;
      function parseStringStyle(cssText) {
        const ret = {};
        cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
          if (item) {
            const tmp = item.split(propertyDelimiterRE);
            tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
          }
        });
        return ret;
      }
      function stringifyStyle(styles) {
        let ret = "";
        if (!styles || isString(styles)) {
          return ret;
        }
        for (const key in styles) {
          const value = styles[key];
          if (isString(value) || typeof value === "number") {
            const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
            ret += `${normalizedKey}:${value};`;
          }
        }
        return ret;
      }
      function normalizeClass(value) {
        let res = "";
        if (isString(value)) {
          res = value;
        } else if (isArray2(value)) {
          for (let i = 0; i < value.length; i++) {
            const normalized = normalizeClass(value[i]);
            if (normalized) {
              res += normalized + " ";
            }
          }
        } else if (isObject2(value)) {
          for (const name in value) {
            if (value[name]) {
              res += name + " ";
            }
          }
        }
        return res.trim();
      }
      function normalizeProps(props) {
        if (!props)
          return null;
        let { class: klass, style } = props;
        if (klass && !isString(klass)) {
          props.class = normalizeClass(klass);
        }
        if (style) {
          props.style = normalizeStyle(style);
        }
        return props;
      }
      var HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
      var SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
      var MATH_TAGS = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics";
      var VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
      var isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
      var isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
      var isMathMLTag = /* @__PURE__ */ makeMap(MATH_TAGS);
      var isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
      var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
      var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
      var isBooleanAttr = /* @__PURE__ */ makeMap(
        specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`
      );
      function includeBooleanAttr(value) {
        return !!value || value === "";
      }
      var unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
      var attrValidationCache = {};
      function isSSRSafeAttrName(name) {
        if (attrValidationCache.hasOwnProperty(name)) {
          return attrValidationCache[name];
        }
        const isUnsafe = unsafeAttrCharRE.test(name);
        if (isUnsafe) {
          console.error(`unsafe attribute name: ${name}`);
        }
        return attrValidationCache[name] = !isUnsafe;
      }
      var propsToAttrMap = {
        acceptCharset: "accept-charset",
        className: "class",
        htmlFor: "for",
        httpEquiv: "http-equiv"
      };
      var isKnownHtmlAttr = /* @__PURE__ */ makeMap(
        `accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`
      );
      var isKnownSvgAttr = /* @__PURE__ */ makeMap(
        `xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xmlns:xlink,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`
      );
      function isRenderableAttrValue(value) {
        if (value == null) {
          return false;
        }
        const type = typeof value;
        return type === "string" || type === "number" || type === "boolean";
      }
      var escapeRE = /["'&<>]/;
      function escapeHtml(string) {
        const str = "" + string;
        const match = escapeRE.exec(str);
        if (!match) {
          return str;
        }
        let html = "";
        let escaped;
        let index;
        let lastIndex = 0;
        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              escaped = "&quot;";
              break;
            case 38:
              escaped = "&amp;";
              break;
            case 39:
              escaped = "&#39;";
              break;
            case 60:
              escaped = "&lt;";
              break;
            case 62:
              escaped = "&gt;";
              break;
            default:
              continue;
          }
          if (lastIndex !== index) {
            html += str.slice(lastIndex, index);
          }
          lastIndex = index + 1;
          html += escaped;
        }
        return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
      }
      var commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
      function escapeHtmlComment(src) {
        return src.replace(commentStripRE, "");
      }
      function looseCompareArrays(a, b) {
        if (a.length !== b.length)
          return false;
        let equal = true;
        for (let i = 0; equal && i < a.length; i++) {
          equal = looseEqual(a[i], b[i]);
        }
        return equal;
      }
      function looseEqual(a, b) {
        if (a === b)
          return true;
        let aValidType = isDate(a);
        let bValidType = isDate(b);
        if (aValidType || bValidType) {
          return aValidType && bValidType ? a.getTime() === b.getTime() : false;
        }
        aValidType = isSymbol(a);
        bValidType = isSymbol(b);
        if (aValidType || bValidType) {
          return a === b;
        }
        aValidType = isArray2(a);
        bValidType = isArray2(b);
        if (aValidType || bValidType) {
          return aValidType && bValidType ? looseCompareArrays(a, b) : false;
        }
        aValidType = isObject2(a);
        bValidType = isObject2(b);
        if (aValidType || bValidType) {
          if (!aValidType || !bValidType) {
            return false;
          }
          const aKeysCount = Object.keys(a).length;
          const bKeysCount = Object.keys(b).length;
          if (aKeysCount !== bKeysCount) {
            return false;
          }
          for (const key in a) {
            const aHasKey = a.hasOwnProperty(key);
            const bHasKey = b.hasOwnProperty(key);
            if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
              return false;
            }
          }
        }
        return String(a) === String(b);
      }
      function looseIndexOf(arr, val) {
        return arr.findIndex((item) => looseEqual(item, val));
      }
      var isRef2 = (val) => {
        return !!(val && val.__v_isRef === true);
      };
      var toDisplayString = (val) => {
        return isString(val) ? val : val == null ? "" : isArray2(val) || isObject2(val) && (val.toString === objectToString || !isFunction3(val.toString)) ? isRef2(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
      };
      var replacer = (_key, val) => {
        if (isRef2(val)) {
          return replacer(_key, val.value);
        } else if (isMap(val)) {
          return {
            [`Map(${val.size})`]: [...val.entries()].reduce(
              (entries, [key, val2], i) => {
                entries[stringifySymbol(key, i) + " =>"] = val2;
                return entries;
              },
              {}
            )
          };
        } else if (isSet(val)) {
          return {
            [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
          };
        } else if (isSymbol(val)) {
          return stringifySymbol(val);
        } else if (isObject2(val) && !isArray2(val) && !isPlainObject(val)) {
          return String(val);
        }
        return val;
      };
      var stringifySymbol = (v, i = "") => {
        var _a;
        return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
      };
      exports.EMPTY_ARR = EMPTY_ARR;
      exports.EMPTY_OBJ = EMPTY_OBJ;
      exports.NO = NO;
      exports.NOOP = NOOP2;
      exports.PatchFlagNames = PatchFlagNames;
      exports.PatchFlags = PatchFlags;
      exports.ShapeFlags = ShapeFlags;
      exports.SlotFlags = SlotFlags;
      exports.camelize = camelize;
      exports.capitalize = capitalize;
      exports.def = def;
      exports.escapeHtml = escapeHtml;
      exports.escapeHtmlComment = escapeHtmlComment;
      exports.extend = extend;
      exports.genPropsAccessExp = genPropsAccessExp;
      exports.generateCodeFrame = generateCodeFrame;
      exports.getGlobalThis = getGlobalThis;
      exports.hasChanged = hasChanged2;
      exports.hasOwn = hasOwn;
      exports.hyphenate = hyphenate;
      exports.includeBooleanAttr = includeBooleanAttr;
      exports.invokeArrayFns = invokeArrayFns;
      exports.isArray = isArray2;
      exports.isBooleanAttr = isBooleanAttr;
      exports.isBuiltInDirective = isBuiltInDirective;
      exports.isDate = isDate;
      exports.isFunction = isFunction3;
      exports.isGloballyAllowed = isGloballyAllowed;
      exports.isGloballyWhitelisted = isGloballyWhitelisted;
      exports.isHTMLTag = isHTMLTag;
      exports.isIntegerKey = isIntegerKey;
      exports.isKnownHtmlAttr = isKnownHtmlAttr;
      exports.isKnownSvgAttr = isKnownSvgAttr;
      exports.isMap = isMap;
      exports.isMathMLTag = isMathMLTag;
      exports.isModelListener = isModelListener;
      exports.isObject = isObject2;
      exports.isOn = isOn;
      exports.isPlainObject = isPlainObject;
      exports.isPromise = isPromise2;
      exports.isRegExp = isRegExp;
      exports.isRenderableAttrValue = isRenderableAttrValue;
      exports.isReservedProp = isReservedProp;
      exports.isSSRSafeAttrName = isSSRSafeAttrName;
      exports.isSVGTag = isSVGTag;
      exports.isSet = isSet;
      exports.isSpecialBooleanAttr = isSpecialBooleanAttr;
      exports.isString = isString;
      exports.isSymbol = isSymbol;
      exports.isVoidTag = isVoidTag;
      exports.looseEqual = looseEqual;
      exports.looseIndexOf = looseIndexOf;
      exports.looseToNumber = looseToNumber;
      exports.makeMap = makeMap;
      exports.normalizeClass = normalizeClass;
      exports.normalizeProps = normalizeProps;
      exports.normalizeStyle = normalizeStyle;
      exports.objectToString = objectToString;
      exports.parseStringStyle = parseStringStyle;
      exports.propsToAttrMap = propsToAttrMap;
      exports.remove = remove;
      exports.slotFlagsText = slotFlagsText;
      exports.stringifyStyle = stringifyStyle;
      exports.toDisplayString = toDisplayString;
      exports.toHandlerKey = toHandlerKey;
      exports.toNumber = toNumber;
      exports.toRawType = toRawType;
      exports.toTypeString = toTypeString;
    }
  });

  // node_modules/@vue/shared/dist/shared.cjs.js
  var require_shared_cjs = __commonJS({
    "node_modules/@vue/shared/dist/shared.cjs.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function makeMap(str, expectsLowerCase) {
        const set = new Set(str.split(","));
        return expectsLowerCase ? (val) => set.has(val.toLowerCase()) : (val) => set.has(val);
      }
      var EMPTY_OBJ = Object.freeze({});
      var EMPTY_ARR = Object.freeze([]);
      var NOOP2 = () => {
      };
      var NO = () => false;
      var isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
      var isModelListener = (key) => key.startsWith("onUpdate:");
      var extend = Object.assign;
      var remove = (arr, el) => {
        const i = arr.indexOf(el);
        if (i > -1) {
          arr.splice(i, 1);
        }
      };
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var hasOwn = (val, key) => hasOwnProperty.call(val, key);
      var isArray2 = Array.isArray;
      var isMap = (val) => toTypeString(val) === "[object Map]";
      var isSet = (val) => toTypeString(val) === "[object Set]";
      var isDate = (val) => toTypeString(val) === "[object Date]";
      var isRegExp = (val) => toTypeString(val) === "[object RegExp]";
      var isFunction3 = (val) => typeof val === "function";
      var isString = (val) => typeof val === "string";
      var isSymbol = (val) => typeof val === "symbol";
      var isObject2 = (val) => val !== null && typeof val === "object";
      var isPromise2 = (val) => {
        return (isObject2(val) || isFunction3(val)) && isFunction3(val.then) && isFunction3(val.catch);
      };
      var objectToString = Object.prototype.toString;
      var toTypeString = (value) => objectToString.call(value);
      var toRawType = (value) => {
        return toTypeString(value).slice(8, -1);
      };
      var isPlainObject = (val) => toTypeString(val) === "[object Object]";
      var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
      var isReservedProp = /* @__PURE__ */ makeMap(
        ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
      );
      var isBuiltInDirective = /* @__PURE__ */ makeMap(
        "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
      );
      var cacheStringFunction = (fn) => {
        const cache = /* @__PURE__ */ Object.create(null);
        return (str) => {
          const hit = cache[str];
          return hit || (cache[str] = fn(str));
        };
      };
      var camelizeRE = /-(\w)/g;
      var camelize = cacheStringFunction((str) => {
        return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
      });
      var hyphenateRE = /\B([A-Z])/g;
      var hyphenate = cacheStringFunction(
        (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
      );
      var capitalize = cacheStringFunction((str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      });
      var toHandlerKey = cacheStringFunction((str) => {
        const s = str ? `on${capitalize(str)}` : ``;
        return s;
      });
      var hasChanged2 = (value, oldValue) => !Object.is(value, oldValue);
      var invokeArrayFns = (fns, ...arg) => {
        for (let i = 0; i < fns.length; i++) {
          fns[i](...arg);
        }
      };
      var def = (obj, key, value, writable = false) => {
        Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: false,
          writable,
          value
        });
      };
      var looseToNumber = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? val : n;
      };
      var toNumber = (val) => {
        const n = isString(val) ? Number(val) : NaN;
        return isNaN(n) ? val : n;
      };
      var _globalThis;
      var getGlobalThis = () => {
        return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
      };
      var identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
      function genPropsAccessExp(name) {
        return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
      }
      var PatchFlags = {
        "TEXT": 1,
        "1": "TEXT",
        "CLASS": 2,
        "2": "CLASS",
        "STYLE": 4,
        "4": "STYLE",
        "PROPS": 8,
        "8": "PROPS",
        "FULL_PROPS": 16,
        "16": "FULL_PROPS",
        "NEED_HYDRATION": 32,
        "32": "NEED_HYDRATION",
        "STABLE_FRAGMENT": 64,
        "64": "STABLE_FRAGMENT",
        "KEYED_FRAGMENT": 128,
        "128": "KEYED_FRAGMENT",
        "UNKEYED_FRAGMENT": 256,
        "256": "UNKEYED_FRAGMENT",
        "NEED_PATCH": 512,
        "512": "NEED_PATCH",
        "DYNAMIC_SLOTS": 1024,
        "1024": "DYNAMIC_SLOTS",
        "DEV_ROOT_FRAGMENT": 2048,
        "2048": "DEV_ROOT_FRAGMENT",
        "HOISTED": -1,
        "-1": "HOISTED",
        "BAIL": -2,
        "-2": "BAIL"
      };
      var PatchFlagNames = {
        [1]: `TEXT`,
        [2]: `CLASS`,
        [4]: `STYLE`,
        [8]: `PROPS`,
        [16]: `FULL_PROPS`,
        [32]: `NEED_HYDRATION`,
        [64]: `STABLE_FRAGMENT`,
        [128]: `KEYED_FRAGMENT`,
        [256]: `UNKEYED_FRAGMENT`,
        [512]: `NEED_PATCH`,
        [1024]: `DYNAMIC_SLOTS`,
        [2048]: `DEV_ROOT_FRAGMENT`,
        [-1]: `HOISTED`,
        [-2]: `BAIL`
      };
      var ShapeFlags = {
        "ELEMENT": 1,
        "1": "ELEMENT",
        "FUNCTIONAL_COMPONENT": 2,
        "2": "FUNCTIONAL_COMPONENT",
        "STATEFUL_COMPONENT": 4,
        "4": "STATEFUL_COMPONENT",
        "TEXT_CHILDREN": 8,
        "8": "TEXT_CHILDREN",
        "ARRAY_CHILDREN": 16,
        "16": "ARRAY_CHILDREN",
        "SLOTS_CHILDREN": 32,
        "32": "SLOTS_CHILDREN",
        "TELEPORT": 64,
        "64": "TELEPORT",
        "SUSPENSE": 128,
        "128": "SUSPENSE",
        "COMPONENT_SHOULD_KEEP_ALIVE": 256,
        "256": "COMPONENT_SHOULD_KEEP_ALIVE",
        "COMPONENT_KEPT_ALIVE": 512,
        "512": "COMPONENT_KEPT_ALIVE",
        "COMPONENT": 6,
        "6": "COMPONENT"
      };
      var SlotFlags = {
        "STABLE": 1,
        "1": "STABLE",
        "DYNAMIC": 2,
        "2": "DYNAMIC",
        "FORWARDED": 3,
        "3": "FORWARDED"
      };
      var slotFlagsText = {
        [1]: "STABLE",
        [2]: "DYNAMIC",
        [3]: "FORWARDED"
      };
      var GLOBALS_ALLOWED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error";
      var isGloballyAllowed = /* @__PURE__ */ makeMap(GLOBALS_ALLOWED);
      var isGloballyWhitelisted = isGloballyAllowed;
      var range = 2;
      function generateCodeFrame(source, start = 0, end = source.length) {
        start = Math.max(0, Math.min(start, source.length));
        end = Math.max(0, Math.min(end, source.length));
        if (start > end)
          return "";
        let lines = source.split(/(\r?\n)/);
        const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
        lines = lines.filter((_, idx) => idx % 2 === 0);
        let count = 0;
        const res = [];
        for (let i = 0; i < lines.length; i++) {
          count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
          if (count >= start) {
            for (let j = i - range; j <= i + range || end > count; j++) {
              if (j < 0 || j >= lines.length)
                continue;
              const line = j + 1;
              res.push(
                `${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`
              );
              const lineLength = lines[j].length;
              const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
              if (j === i) {
                const pad = start - (count - (lineLength + newLineSeqLength));
                const length = Math.max(
                  1,
                  end > count ? lineLength - pad : end - start
                );
                res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
              } else if (j > i) {
                if (end > count) {
                  const length = Math.max(Math.min(end - count, lineLength), 1);
                  res.push(`   |  ` + "^".repeat(length));
                }
                count += lineLength + newLineSeqLength;
              }
            }
            break;
          }
        }
        return res.join("\n");
      }
      function normalizeStyle(value) {
        if (isArray2(value)) {
          const res = {};
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
            if (normalized) {
              for (const key in normalized) {
                res[key] = normalized[key];
              }
            }
          }
          return res;
        } else if (isString(value) || isObject2(value)) {
          return value;
        }
      }
      var listDelimiterRE = /;(?![^(]*\))/g;
      var propertyDelimiterRE = /:([^]+)/;
      var styleCommentRE = /\/\*[^]*?\*\//g;
      function parseStringStyle(cssText) {
        const ret = {};
        cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
          if (item) {
            const tmp = item.split(propertyDelimiterRE);
            tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
          }
        });
        return ret;
      }
      function stringifyStyle(styles) {
        let ret = "";
        if (!styles || isString(styles)) {
          return ret;
        }
        for (const key in styles) {
          const value = styles[key];
          if (isString(value) || typeof value === "number") {
            const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
            ret += `${normalizedKey}:${value};`;
          }
        }
        return ret;
      }
      function normalizeClass(value) {
        let res = "";
        if (isString(value)) {
          res = value;
        } else if (isArray2(value)) {
          for (let i = 0; i < value.length; i++) {
            const normalized = normalizeClass(value[i]);
            if (normalized) {
              res += normalized + " ";
            }
          }
        } else if (isObject2(value)) {
          for (const name in value) {
            if (value[name]) {
              res += name + " ";
            }
          }
        }
        return res.trim();
      }
      function normalizeProps(props) {
        if (!props)
          return null;
        let { class: klass, style } = props;
        if (klass && !isString(klass)) {
          props.class = normalizeClass(klass);
        }
        if (style) {
          props.style = normalizeStyle(style);
        }
        return props;
      }
      var HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
      var SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
      var MATH_TAGS = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics";
      var VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
      var isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
      var isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
      var isMathMLTag = /* @__PURE__ */ makeMap(MATH_TAGS);
      var isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
      var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
      var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
      var isBooleanAttr = /* @__PURE__ */ makeMap(
        specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`
      );
      function includeBooleanAttr(value) {
        return !!value || value === "";
      }
      var unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
      var attrValidationCache = {};
      function isSSRSafeAttrName(name) {
        if (attrValidationCache.hasOwnProperty(name)) {
          return attrValidationCache[name];
        }
        const isUnsafe = unsafeAttrCharRE.test(name);
        if (isUnsafe) {
          console.error(`unsafe attribute name: ${name}`);
        }
        return attrValidationCache[name] = !isUnsafe;
      }
      var propsToAttrMap = {
        acceptCharset: "accept-charset",
        className: "class",
        htmlFor: "for",
        httpEquiv: "http-equiv"
      };
      var isKnownHtmlAttr = /* @__PURE__ */ makeMap(
        `accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`
      );
      var isKnownSvgAttr = /* @__PURE__ */ makeMap(
        `xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xmlns:xlink,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`
      );
      function isRenderableAttrValue(value) {
        if (value == null) {
          return false;
        }
        const type = typeof value;
        return type === "string" || type === "number" || type === "boolean";
      }
      var escapeRE = /["'&<>]/;
      function escapeHtml(string) {
        const str = "" + string;
        const match = escapeRE.exec(str);
        if (!match) {
          return str;
        }
        let html = "";
        let escaped;
        let index;
        let lastIndex = 0;
        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              escaped = "&quot;";
              break;
            case 38:
              escaped = "&amp;";
              break;
            case 39:
              escaped = "&#39;";
              break;
            case 60:
              escaped = "&lt;";
              break;
            case 62:
              escaped = "&gt;";
              break;
            default:
              continue;
          }
          if (lastIndex !== index) {
            html += str.slice(lastIndex, index);
          }
          lastIndex = index + 1;
          html += escaped;
        }
        return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
      }
      var commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
      function escapeHtmlComment(src) {
        return src.replace(commentStripRE, "");
      }
      function looseCompareArrays(a, b) {
        if (a.length !== b.length)
          return false;
        let equal = true;
        for (let i = 0; equal && i < a.length; i++) {
          equal = looseEqual(a[i], b[i]);
        }
        return equal;
      }
      function looseEqual(a, b) {
        if (a === b)
          return true;
        let aValidType = isDate(a);
        let bValidType = isDate(b);
        if (aValidType || bValidType) {
          return aValidType && bValidType ? a.getTime() === b.getTime() : false;
        }
        aValidType = isSymbol(a);
        bValidType = isSymbol(b);
        if (aValidType || bValidType) {
          return a === b;
        }
        aValidType = isArray2(a);
        bValidType = isArray2(b);
        if (aValidType || bValidType) {
          return aValidType && bValidType ? looseCompareArrays(a, b) : false;
        }
        aValidType = isObject2(a);
        bValidType = isObject2(b);
        if (aValidType || bValidType) {
          if (!aValidType || !bValidType) {
            return false;
          }
          const aKeysCount = Object.keys(a).length;
          const bKeysCount = Object.keys(b).length;
          if (aKeysCount !== bKeysCount) {
            return false;
          }
          for (const key in a) {
            const aHasKey = a.hasOwnProperty(key);
            const bHasKey = b.hasOwnProperty(key);
            if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
              return false;
            }
          }
        }
        return String(a) === String(b);
      }
      function looseIndexOf(arr, val) {
        return arr.findIndex((item) => looseEqual(item, val));
      }
      var isRef2 = (val) => {
        return !!(val && val.__v_isRef === true);
      };
      var toDisplayString = (val) => {
        return isString(val) ? val : val == null ? "" : isArray2(val) || isObject2(val) && (val.toString === objectToString || !isFunction3(val.toString)) ? isRef2(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
      };
      var replacer = (_key, val) => {
        if (isRef2(val)) {
          return replacer(_key, val.value);
        } else if (isMap(val)) {
          return {
            [`Map(${val.size})`]: [...val.entries()].reduce(
              (entries, [key, val2], i) => {
                entries[stringifySymbol(key, i) + " =>"] = val2;
                return entries;
              },
              {}
            )
          };
        } else if (isSet(val)) {
          return {
            [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
          };
        } else if (isSymbol(val)) {
          return stringifySymbol(val);
        } else if (isObject2(val) && !isArray2(val) && !isPlainObject(val)) {
          return String(val);
        }
        return val;
      };
      var stringifySymbol = (v, i = "") => {
        var _a;
        return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
      };
      exports.EMPTY_ARR = EMPTY_ARR;
      exports.EMPTY_OBJ = EMPTY_OBJ;
      exports.NO = NO;
      exports.NOOP = NOOP2;
      exports.PatchFlagNames = PatchFlagNames;
      exports.PatchFlags = PatchFlags;
      exports.ShapeFlags = ShapeFlags;
      exports.SlotFlags = SlotFlags;
      exports.camelize = camelize;
      exports.capitalize = capitalize;
      exports.def = def;
      exports.escapeHtml = escapeHtml;
      exports.escapeHtmlComment = escapeHtmlComment;
      exports.extend = extend;
      exports.genPropsAccessExp = genPropsAccessExp;
      exports.generateCodeFrame = generateCodeFrame;
      exports.getGlobalThis = getGlobalThis;
      exports.hasChanged = hasChanged2;
      exports.hasOwn = hasOwn;
      exports.hyphenate = hyphenate;
      exports.includeBooleanAttr = includeBooleanAttr;
      exports.invokeArrayFns = invokeArrayFns;
      exports.isArray = isArray2;
      exports.isBooleanAttr = isBooleanAttr;
      exports.isBuiltInDirective = isBuiltInDirective;
      exports.isDate = isDate;
      exports.isFunction = isFunction3;
      exports.isGloballyAllowed = isGloballyAllowed;
      exports.isGloballyWhitelisted = isGloballyWhitelisted;
      exports.isHTMLTag = isHTMLTag;
      exports.isIntegerKey = isIntegerKey;
      exports.isKnownHtmlAttr = isKnownHtmlAttr;
      exports.isKnownSvgAttr = isKnownSvgAttr;
      exports.isMap = isMap;
      exports.isMathMLTag = isMathMLTag;
      exports.isModelListener = isModelListener;
      exports.isObject = isObject2;
      exports.isOn = isOn;
      exports.isPlainObject = isPlainObject;
      exports.isPromise = isPromise2;
      exports.isRegExp = isRegExp;
      exports.isRenderableAttrValue = isRenderableAttrValue;
      exports.isReservedProp = isReservedProp;
      exports.isSSRSafeAttrName = isSSRSafeAttrName;
      exports.isSVGTag = isSVGTag;
      exports.isSet = isSet;
      exports.isSpecialBooleanAttr = isSpecialBooleanAttr;
      exports.isString = isString;
      exports.isSymbol = isSymbol;
      exports.isVoidTag = isVoidTag;
      exports.looseEqual = looseEqual;
      exports.looseIndexOf = looseIndexOf;
      exports.looseToNumber = looseToNumber;
      exports.makeMap = makeMap;
      exports.normalizeClass = normalizeClass;
      exports.normalizeProps = normalizeProps;
      exports.normalizeStyle = normalizeStyle;
      exports.objectToString = objectToString;
      exports.parseStringStyle = parseStringStyle;
      exports.propsToAttrMap = propsToAttrMap;
      exports.remove = remove;
      exports.slotFlagsText = slotFlagsText;
      exports.stringifyStyle = stringifyStyle;
      exports.toDisplayString = toDisplayString;
      exports.toHandlerKey = toHandlerKey;
      exports.toNumber = toNumber;
      exports.toRawType = toRawType;
      exports.toTypeString = toTypeString;
    }
  });

  // node_modules/@vue/shared/index.js
  var require_shared = __commonJS({
    "node_modules/@vue/shared/index.js"(exports, module) {
      "use strict";
      if (process.env.NODE_ENV === "production") {
        module.exports = require_shared_cjs_prod();
      } else {
        module.exports = require_shared_cjs();
      }
    }
  });

  // node_modules/@vue/reactivity/dist/reactivity.cjs.prod.js
  var require_reactivity_cjs_prod = __commonJS({
    "node_modules/@vue/reactivity/dist/reactivity.cjs.prod.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var shared = require_shared();
      var activeEffectScope;
      var EffectScope = class {
        constructor(detached = false) {
          this.detached = detached;
          this._active = true;
          this.effects = [];
          this.cleanups = [];
          this.parent = activeEffectScope;
          if (!detached && activeEffectScope) {
            this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
              this
            ) - 1;
          }
        }
        get active() {
          return this._active;
        }
        run(fn) {
          if (this._active) {
            const currentEffectScope = activeEffectScope;
            try {
              activeEffectScope = this;
              return fn();
            } finally {
              activeEffectScope = currentEffectScope;
            }
          }
        }
        on() {
          activeEffectScope = this;
        }
        off() {
          activeEffectScope = this.parent;
        }
        stop(fromParent) {
          if (this._active) {
            let i, l;
            for (i = 0, l = this.effects.length; i < l; i++) {
              this.effects[i].stop();
            }
            for (i = 0, l = this.cleanups.length; i < l; i++) {
              this.cleanups[i]();
            }
            if (this.scopes) {
              for (i = 0, l = this.scopes.length; i < l; i++) {
                this.scopes[i].stop(true);
              }
            }
            if (!this.detached && this.parent && !fromParent) {
              const last = this.parent.scopes.pop();
              if (last && last !== this) {
                this.parent.scopes[this.index] = last;
                last.index = this.index;
              }
            }
            this.parent = void 0;
            this._active = false;
          }
        }
      };
      function effectScope(detached) {
        return new EffectScope(detached);
      }
      function recordEffectScope(effect2, scope = activeEffectScope) {
        if (scope && scope.active) {
          scope.effects.push(effect2);
        }
      }
      function getCurrentScope() {
        return activeEffectScope;
      }
      function onScopeDispose(fn) {
        if (activeEffectScope) {
          activeEffectScope.cleanups.push(fn);
        }
      }
      var activeEffect;
      var ReactiveEffect2 = class {
        constructor(fn, trigger2, scheduler, scope) {
          this.fn = fn;
          this.trigger = trigger2;
          this.scheduler = scheduler;
          this.active = true;
          this.deps = [];
          this._dirtyLevel = 4;
          this._trackId = 0;
          this._runnings = 0;
          this._shouldSchedule = false;
          this._depsLength = 0;
          recordEffectScope(this, scope);
        }
        get dirty() {
          if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
            this._dirtyLevel = 1;
            pauseTracking();
            for (let i = 0; i < this._depsLength; i++) {
              const dep = this.deps[i];
              if (dep.computed) {
                triggerComputed(dep.computed);
                if (this._dirtyLevel >= 4) {
                  break;
                }
              }
            }
            if (this._dirtyLevel === 1) {
              this._dirtyLevel = 0;
            }
            resetTracking();
          }
          return this._dirtyLevel >= 4;
        }
        set dirty(v) {
          this._dirtyLevel = v ? 4 : 0;
        }
        run() {
          this._dirtyLevel = 0;
          if (!this.active) {
            return this.fn();
          }
          let lastShouldTrack = shouldTrack;
          let lastEffect = activeEffect;
          try {
            shouldTrack = true;
            activeEffect = this;
            this._runnings++;
            preCleanupEffect(this);
            return this.fn();
          } finally {
            postCleanupEffect(this);
            this._runnings--;
            activeEffect = lastEffect;
            shouldTrack = lastShouldTrack;
          }
        }
        stop() {
          if (this.active) {
            preCleanupEffect(this);
            postCleanupEffect(this);
            this.onStop && this.onStop();
            this.active = false;
          }
        }
      };
      function triggerComputed(computed2) {
        return computed2.value;
      }
      function preCleanupEffect(effect2) {
        effect2._trackId++;
        effect2._depsLength = 0;
      }
      function postCleanupEffect(effect2) {
        if (effect2.deps.length > effect2._depsLength) {
          for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
            cleanupDepEffect(effect2.deps[i], effect2);
          }
          effect2.deps.length = effect2._depsLength;
        }
      }
      function cleanupDepEffect(dep, effect2) {
        const trackId = dep.get(effect2);
        if (trackId !== void 0 && effect2._trackId !== trackId) {
          dep.delete(effect2);
          if (dep.size === 0) {
            dep.cleanup();
          }
        }
      }
      function effect(fn, options) {
        if (fn.effect instanceof ReactiveEffect2) {
          fn = fn.effect.fn;
        }
        const _effect = new ReactiveEffect2(fn, shared.NOOP, () => {
          if (_effect.dirty) {
            _effect.run();
          }
        });
        if (options) {
          shared.extend(_effect, options);
          if (options.scope)
            recordEffectScope(_effect, options.scope);
        }
        if (!options || !options.lazy) {
          _effect.run();
        }
        const runner = _effect.run.bind(_effect);
        runner.effect = _effect;
        return runner;
      }
      function stop(runner) {
        runner.effect.stop();
      }
      var shouldTrack = true;
      var pauseScheduleStack = 0;
      var trackStack = [];
      function pauseTracking() {
        trackStack.push(shouldTrack);
        shouldTrack = false;
      }
      function enableTracking() {
        trackStack.push(shouldTrack);
        shouldTrack = true;
      }
      function resetTracking() {
        const last = trackStack.pop();
        shouldTrack = last === void 0 ? true : last;
      }
      function pauseScheduling() {
        pauseScheduleStack++;
      }
      function resetScheduling() {
        pauseScheduleStack--;
        while (!pauseScheduleStack && queueEffectSchedulers.length) {
          queueEffectSchedulers.shift()();
        }
      }
      function trackEffect(effect2, dep, debuggerEventExtraInfo) {
        if (dep.get(effect2) !== effect2._trackId) {
          dep.set(effect2, effect2._trackId);
          const oldDep = effect2.deps[effect2._depsLength];
          if (oldDep !== dep) {
            if (oldDep) {
              cleanupDepEffect(oldDep, effect2);
            }
            effect2.deps[effect2._depsLength++] = dep;
          } else {
            effect2._depsLength++;
          }
        }
      }
      var queueEffectSchedulers = [];
      function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
        pauseScheduling();
        for (const effect2 of dep.keys()) {
          let tracking;
          if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
            effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
            effect2._dirtyLevel = dirtyLevel;
          }
          if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
            effect2.trigger();
            if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
              effect2._shouldSchedule = false;
              if (effect2.scheduler) {
                queueEffectSchedulers.push(effect2.scheduler);
              }
            }
          }
        }
        resetScheduling();
      }
      var createDep = (cleanup, computed2) => {
        const dep = /* @__PURE__ */ new Map();
        dep.cleanup = cleanup;
        dep.computed = computed2;
        return dep;
      };
      var targetMap = /* @__PURE__ */ new WeakMap();
      var ITERATE_KEY = Symbol("");
      var MAP_KEY_ITERATE_KEY = Symbol("");
      function track(target, type, key) {
        if (shouldTrack && activeEffect) {
          let depsMap = targetMap.get(target);
          if (!depsMap) {
            targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
          }
          let dep = depsMap.get(key);
          if (!dep) {
            depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
          }
          trackEffect(
            activeEffect,
            dep
          );
        }
      }
      function trigger(target, type, key, newValue, oldValue, oldTarget) {
        const depsMap = targetMap.get(target);
        if (!depsMap) {
          return;
        }
        let deps = [];
        if (type === "clear") {
          deps = [...depsMap.values()];
        } else if (key === "length" && shared.isArray(target)) {
          const newLength = Number(newValue);
          depsMap.forEach((dep, key2) => {
            if (key2 === "length" || !shared.isSymbol(key2) && key2 >= newLength) {
              deps.push(dep);
            }
          });
        } else {
          if (key !== void 0) {
            deps.push(depsMap.get(key));
          }
          switch (type) {
            case "add":
              if (!shared.isArray(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
                if (shared.isMap(target)) {
                  deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              } else if (shared.isIntegerKey(key)) {
                deps.push(depsMap.get("length"));
              }
              break;
            case "delete":
              if (!shared.isArray(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
                if (shared.isMap(target)) {
                  deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              }
              break;
            case "set":
              if (shared.isMap(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
              }
              break;
          }
        }
        pauseScheduling();
        for (const dep of deps) {
          if (dep) {
            triggerEffects(
              dep,
              4
            );
          }
        }
        resetScheduling();
      }
      function getDepFromReactive(object, key) {
        const depsMap = targetMap.get(object);
        return depsMap && depsMap.get(key);
      }
      var isNonTrackableKeys = /* @__PURE__ */ shared.makeMap(`__proto__,__v_isRef,__isVue`);
      var builtInSymbols = new Set(
        /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(shared.isSymbol)
      );
      var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
      function createArrayInstrumentations() {
        const instrumentations = {};
        ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
          instrumentations[key] = function(...args) {
            const arr = toRaw(this);
            for (let i = 0, l = this.length; i < l; i++) {
              track(arr, "get", i + "");
            }
            const res = arr[key](...args);
            if (res === -1 || res === false) {
              return arr[key](...args.map(toRaw));
            } else {
              return res;
            }
          };
        });
        ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
          instrumentations[key] = function(...args) {
            pauseTracking();
            pauseScheduling();
            const res = toRaw(this)[key].apply(this, args);
            resetScheduling();
            resetTracking();
            return res;
          };
        });
        return instrumentations;
      }
      function hasOwnProperty(key) {
        if (!shared.isSymbol(key))
          key = String(key);
        const obj = toRaw(this);
        track(obj, "has", key);
        return obj.hasOwnProperty(key);
      }
      var BaseReactiveHandler = class {
        constructor(_isReadonly = false, _isShallow = false) {
          this._isReadonly = _isReadonly;
          this._isShallow = _isShallow;
        }
        get(target, key, receiver) {
          const isReadonly2 = this._isReadonly, isShallow22 = this._isShallow;
          if (key === "__v_isReactive") {
            return !isReadonly2;
          } else if (key === "__v_isReadonly") {
            return isReadonly2;
          } else if (key === "__v_isShallow") {
            return isShallow22;
          } else if (key === "__v_raw") {
            if (receiver === (isReadonly2 ? isShallow22 ? shallowReadonlyMap : readonlyMap : isShallow22 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
              return target;
            }
            return;
          }
          const targetIsArray = shared.isArray(target);
          if (!isReadonly2) {
            if (targetIsArray && shared.hasOwn(arrayInstrumentations, key)) {
              return Reflect.get(arrayInstrumentations, key, receiver);
            }
            if (key === "hasOwnProperty") {
              return hasOwnProperty;
            }
          }
          const res = Reflect.get(target, key, receiver);
          if (shared.isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
            return res;
          }
          if (!isReadonly2) {
            track(target, "get", key);
          }
          if (isShallow22) {
            return res;
          }
          if (isRef2(res)) {
            return targetIsArray && shared.isIntegerKey(key) ? res : res.value;
          }
          if (shared.isObject(res)) {
            return isReadonly2 ? readonly(res) : reactive(res);
          }
          return res;
        }
      };
      var MutableReactiveHandler = class extends BaseReactiveHandler {
        constructor(isShallow22 = false) {
          super(false, isShallow22);
        }
        set(target, key, value, receiver) {
          let oldValue = target[key];
          if (!this._isShallow) {
            const isOldValueReadonly = isReadonly(oldValue);
            if (!isShallow2(value) && !isReadonly(value)) {
              oldValue = toRaw(oldValue);
              value = toRaw(value);
            }
            if (!shared.isArray(target) && isRef2(oldValue) && !isRef2(value)) {
              if (isOldValueReadonly) {
                return false;
              } else {
                oldValue.value = value;
                return true;
              }
            }
          }
          const hadKey = shared.isArray(target) && shared.isIntegerKey(key) ? Number(key) < target.length : shared.hasOwn(target, key);
          const result = Reflect.set(target, key, value, receiver);
          if (target === toRaw(receiver)) {
            if (!hadKey) {
              trigger(target, "add", key, value);
            } else if (shared.hasChanged(value, oldValue)) {
              trigger(target, "set", key, value);
            }
          }
          return result;
        }
        deleteProperty(target, key) {
          const hadKey = shared.hasOwn(target, key);
          target[key];
          const result = Reflect.deleteProperty(target, key);
          if (result && hadKey) {
            trigger(target, "delete", key, void 0);
          }
          return result;
        }
        has(target, key) {
          const result = Reflect.has(target, key);
          if (!shared.isSymbol(key) || !builtInSymbols.has(key)) {
            track(target, "has", key);
          }
          return result;
        }
        ownKeys(target) {
          track(
            target,
            "iterate",
            shared.isArray(target) ? "length" : ITERATE_KEY
          );
          return Reflect.ownKeys(target);
        }
      };
      var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
        constructor(isShallow22 = false) {
          super(true, isShallow22);
        }
        set(target, key) {
          return true;
        }
        deleteProperty(target, key) {
          return true;
        }
      };
      var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
      var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
      var shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
        true
      );
      var shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
      var toShallow = (value) => value;
      var getProto = (v) => Reflect.getPrototypeOf(v);
      function get(target, key, isReadonly2 = false, isShallow22 = false) {
        target = target["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!isReadonly2) {
          if (shared.hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has: has2 } = getProto(rawTarget);
        const wrap = isShallow22 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        if (has2.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has2.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      }
      function has(key, isReadonly2 = false) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!isReadonly2) {
          if (shared.hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      }
      function size(target, isReadonly2 = false) {
        target = target["__v_raw"];
        !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
        return Reflect.get(target, "size", target);
      }
      function add(value, _isShallow = false) {
        if (!_isShallow && !isShallow2(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const proto = getProto(target);
        const hadKey = proto.has.call(target, value);
        if (!hadKey) {
          target.add(value);
          trigger(target, "add", value, value);
        }
        return this;
      }
      function set(key, value, _isShallow = false) {
        if (!_isShallow && !isShallow2(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const { has: has2, get: get2 } = getProto(target);
        let hadKey = has2.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has2.call(target, key);
        }
        const oldValue = get2.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (shared.hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
        return this;
      }
      function deleteEntry(key) {
        const target = toRaw(this);
        const { has: has2, get: get2 } = getProto(target);
        let hadKey = has2.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has2.call(target, key);
        }
        get2 ? get2.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      }
      function clear() {
        const target = toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(target, "clear", void 0, void 0);
        }
        return result;
      }
      function createForEach(isReadonly2, isShallow22) {
        return function forEach(callback, thisArg) {
          const observed = this;
          const target = observed["__v_raw"];
          const rawTarget = toRaw(target);
          const wrap = isShallow22 ? toShallow : isReadonly2 ? toReadonly : toReactive;
          !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
          return target.forEach((value, key) => {
            return callback.call(thisArg, wrap(value), wrap(key), observed);
          });
        };
      }
      function createIterableMethod(method, isReadonly2, isShallow22) {
        return function(...args) {
          const target = this["__v_raw"];
          const rawTarget = toRaw(target);
          const targetIsMap = shared.isMap(rawTarget);
          const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
          const isKeyOnly = method === "keys" && targetIsMap;
          const innerIterator = target[method](...args);
          const wrap = isShallow22 ? toShallow : isReadonly2 ? toReadonly : toReactive;
          !isReadonly2 && track(
            rawTarget,
            "iterate",
            isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
          );
          return {
            next() {
              const { value, done } = innerIterator.next();
              return done ? { value, done } : {
                value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                done
              };
            },
            [Symbol.iterator]() {
              return this;
            }
          };
        };
      }
      function createReadonlyMethod(type) {
        return function(...args) {
          return type === "delete" ? false : type === "clear" ? void 0 : this;
        };
      }
      function createInstrumentations() {
        const mutableInstrumentations2 = {
          get(key) {
            return get(this, key);
          },
          get size() {
            return size(this);
          },
          has,
          add,
          set,
          delete: deleteEntry,
          clear,
          forEach: createForEach(false, false)
        };
        const shallowInstrumentations2 = {
          get(key) {
            return get(this, key, false, true);
          },
          get size() {
            return size(this);
          },
          has,
          add(value) {
            return add.call(this, value, true);
          },
          set(key, value) {
            return set.call(this, key, value, true);
          },
          delete: deleteEntry,
          clear,
          forEach: createForEach(false, true)
        };
        const readonlyInstrumentations2 = {
          get(key) {
            return get(this, key, true);
          },
          get size() {
            return size(this, true);
          },
          has(key) {
            return has.call(this, key, true);
          },
          add: createReadonlyMethod("add"),
          set: createReadonlyMethod("set"),
          delete: createReadonlyMethod("delete"),
          clear: createReadonlyMethod("clear"),
          forEach: createForEach(true, false)
        };
        const shallowReadonlyInstrumentations2 = {
          get(key) {
            return get(this, key, true, true);
          },
          get size() {
            return size(this, true);
          },
          has(key) {
            return has.call(this, key, true);
          },
          add: createReadonlyMethod("add"),
          set: createReadonlyMethod("set"),
          delete: createReadonlyMethod("delete"),
          clear: createReadonlyMethod("clear"),
          forEach: createForEach(true, true)
        };
        const iteratorMethods = [
          "keys",
          "values",
          "entries",
          Symbol.iterator
        ];
        iteratorMethods.forEach((method) => {
          mutableInstrumentations2[method] = createIterableMethod(method, false, false);
          readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
          shallowInstrumentations2[method] = createIterableMethod(method, false, true);
          shallowReadonlyInstrumentations2[method] = createIterableMethod(
            method,
            true,
            true
          );
        });
        return [
          mutableInstrumentations2,
          readonlyInstrumentations2,
          shallowInstrumentations2,
          shallowReadonlyInstrumentations2
        ];
      }
      var [
        mutableInstrumentations,
        readonlyInstrumentations,
        shallowInstrumentations,
        shallowReadonlyInstrumentations
      ] = /* @__PURE__ */ createInstrumentations();
      function createInstrumentationGetter(isReadonly2, shallow) {
        const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
        return (target, key, receiver) => {
          if (key === "__v_isReactive") {
            return !isReadonly2;
          } else if (key === "__v_isReadonly") {
            return isReadonly2;
          } else if (key === "__v_raw") {
            return target;
          }
          return Reflect.get(
            shared.hasOwn(instrumentations, key) && key in target ? instrumentations : target,
            key,
            receiver
          );
        };
      }
      var mutableCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(false, false)
      };
      var shallowCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(false, true)
      };
      var readonlyCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(true, false)
      };
      var shallowReadonlyCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(true, true)
      };
      var reactiveMap = /* @__PURE__ */ new WeakMap();
      var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
      var readonlyMap = /* @__PURE__ */ new WeakMap();
      var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
      function targetTypeMap(rawType) {
        switch (rawType) {
          case "Object":
          case "Array":
            return 1;
          case "Map":
          case "Set":
          case "WeakMap":
          case "WeakSet":
            return 2;
          default:
            return 0;
        }
      }
      function getTargetType(value) {
        return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(shared.toRawType(value));
      }
      function reactive(target) {
        if (isReadonly(target)) {
          return target;
        }
        return createReactiveObject(
          target,
          false,
          mutableHandlers,
          mutableCollectionHandlers,
          reactiveMap
        );
      }
      function shallowReactive(target) {
        return createReactiveObject(
          target,
          false,
          shallowReactiveHandlers,
          shallowCollectionHandlers,
          shallowReactiveMap
        );
      }
      function readonly(target) {
        return createReactiveObject(
          target,
          true,
          readonlyHandlers,
          readonlyCollectionHandlers,
          readonlyMap
        );
      }
      function shallowReadonly(target) {
        return createReactiveObject(
          target,
          true,
          shallowReadonlyHandlers,
          shallowReadonlyCollectionHandlers,
          shallowReadonlyMap
        );
      }
      function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
        if (!shared.isObject(target)) {
          return target;
        }
        if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
          return target;
        }
        const existingProxy = proxyMap.get(target);
        if (existingProxy) {
          return existingProxy;
        }
        const targetType = getTargetType(target);
        if (targetType === 0) {
          return target;
        }
        const proxy = new Proxy(
          target,
          targetType === 2 ? collectionHandlers : baseHandlers
        );
        proxyMap.set(target, proxy);
        return proxy;
      }
      function isReactive2(value) {
        if (isReadonly(value)) {
          return isReactive2(value["__v_raw"]);
        }
        return !!(value && value["__v_isReactive"]);
      }
      function isReadonly(value) {
        return !!(value && value["__v_isReadonly"]);
      }
      function isShallow2(value) {
        return !!(value && value["__v_isShallow"]);
      }
      function isProxy(value) {
        return value ? !!value["__v_raw"] : false;
      }
      function toRaw(observed) {
        const raw = observed && observed["__v_raw"];
        return raw ? toRaw(raw) : observed;
      }
      function markRaw(value) {
        if (Object.isExtensible(value)) {
          shared.def(value, "__v_skip", true);
        }
        return value;
      }
      var toReactive = (value) => shared.isObject(value) ? reactive(value) : value;
      var toReadonly = (value) => shared.isObject(value) ? readonly(value) : value;
      var ComputedRefImpl = class {
        constructor(getter, _setter, isReadonly2, isSSR) {
          this.getter = getter;
          this._setter = _setter;
          this.dep = void 0;
          this.__v_isRef = true;
          this["__v_isReadonly"] = false;
          this.effect = new ReactiveEffect2(
            () => getter(this._value),
            () => triggerRefValue(
              this,
              this.effect._dirtyLevel === 2 ? 2 : 3
            )
          );
          this.effect.computed = this;
          this.effect.active = this._cacheable = !isSSR;
          this["__v_isReadonly"] = isReadonly2;
        }
        get value() {
          const self2 = toRaw(this);
          if ((!self2._cacheable || self2.effect.dirty) && shared.hasChanged(self2._value, self2._value = self2.effect.run())) {
            triggerRefValue(self2, 4);
          }
          trackRefValue(self2);
          if (self2.effect._dirtyLevel >= 2) {
            triggerRefValue(self2, 2);
          }
          return self2._value;
        }
        set value(newValue) {
          this._setter(newValue);
        }
        get _dirty() {
          return this.effect.dirty;
        }
        set _dirty(v) {
          this.effect.dirty = v;
        }
      };
      function computed(getterOrOptions, debugOptions, isSSR = false) {
        let getter;
        let setter;
        const onlyGetter = shared.isFunction(getterOrOptions);
        if (onlyGetter) {
          getter = getterOrOptions;
          setter = shared.NOOP;
        } else {
          getter = getterOrOptions.get;
          setter = getterOrOptions.set;
        }
        const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
        return cRef;
      }
      function trackRefValue(ref2) {
        var _a;
        if (shouldTrack && activeEffect) {
          ref2 = toRaw(ref2);
          trackEffect(
            activeEffect,
            (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
              () => ref2.dep = void 0,
              ref2 instanceof ComputedRefImpl ? ref2 : void 0
            )
          );
        }
      }
      function triggerRefValue(ref2, dirtyLevel = 4, newVal, oldVal) {
        ref2 = toRaw(ref2);
        const dep = ref2.dep;
        if (dep) {
          triggerEffects(
            dep,
            dirtyLevel
          );
        }
      }
      function isRef2(r) {
        return !!(r && r.__v_isRef === true);
      }
      function ref(value) {
        return createRef(value, false);
      }
      function shallowRef(value) {
        return createRef(value, true);
      }
      function createRef(rawValue, shallow) {
        if (isRef2(rawValue)) {
          return rawValue;
        }
        return new RefImpl(rawValue, shallow);
      }
      var RefImpl = class {
        constructor(value, __v_isShallow) {
          this.__v_isShallow = __v_isShallow;
          this.dep = void 0;
          this.__v_isRef = true;
          this._rawValue = __v_isShallow ? value : toRaw(value);
          this._value = __v_isShallow ? value : toReactive(value);
        }
        get value() {
          trackRefValue(this);
          return this._value;
        }
        set value(newVal) {
          const useDirectValue = this.__v_isShallow || isShallow2(newVal) || isReadonly(newVal);
          newVal = useDirectValue ? newVal : toRaw(newVal);
          if (shared.hasChanged(newVal, this._rawValue)) {
            this._rawValue;
            this._rawValue = newVal;
            this._value = useDirectValue ? newVal : toReactive(newVal);
            triggerRefValue(this, 4);
          }
        }
      };
      function triggerRef(ref2) {
        triggerRefValue(ref2, 4);
      }
      function unref(ref2) {
        return isRef2(ref2) ? ref2.value : ref2;
      }
      function toValue(source) {
        return shared.isFunction(source) ? source() : unref(source);
      }
      var shallowUnwrapHandlers = {
        get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
        set: (target, key, value, receiver) => {
          const oldValue = target[key];
          if (isRef2(oldValue) && !isRef2(value)) {
            oldValue.value = value;
            return true;
          } else {
            return Reflect.set(target, key, value, receiver);
          }
        }
      };
      function proxyRefs(objectWithRefs) {
        return isReactive2(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
      }
      var CustomRefImpl = class {
        constructor(factory) {
          this.dep = void 0;
          this.__v_isRef = true;
          const { get: get2, set: set2 } = factory(
            () => trackRefValue(this),
            () => triggerRefValue(this)
          );
          this._get = get2;
          this._set = set2;
        }
        get value() {
          return this._get();
        }
        set value(newVal) {
          this._set(newVal);
        }
      };
      function customRef(factory) {
        return new CustomRefImpl(factory);
      }
      function toRefs(object) {
        const ret = shared.isArray(object) ? new Array(object.length) : {};
        for (const key in object) {
          ret[key] = propertyToRef(object, key);
        }
        return ret;
      }
      var ObjectRefImpl = class {
        constructor(_object, _key, _defaultValue) {
          this._object = _object;
          this._key = _key;
          this._defaultValue = _defaultValue;
          this.__v_isRef = true;
        }
        get value() {
          const val = this._object[this._key];
          return val === void 0 ? this._defaultValue : val;
        }
        set value(newVal) {
          this._object[this._key] = newVal;
        }
        get dep() {
          return getDepFromReactive(toRaw(this._object), this._key);
        }
      };
      var GetterRefImpl = class {
        constructor(_getter) {
          this._getter = _getter;
          this.__v_isRef = true;
          this.__v_isReadonly = true;
        }
        get value() {
          return this._getter();
        }
      };
      function toRef(source, key, defaultValue) {
        if (isRef2(source)) {
          return source;
        } else if (shared.isFunction(source)) {
          return new GetterRefImpl(source);
        } else if (shared.isObject(source) && arguments.length > 1) {
          return propertyToRef(source, key, defaultValue);
        } else {
          return ref(source);
        }
      }
      function propertyToRef(source, key, defaultValue) {
        const val = source[key];
        return isRef2(val) ? val : new ObjectRefImpl(source, key, defaultValue);
      }
      var deferredComputed = computed;
      var TrackOpTypes = {
        "GET": "get",
        "HAS": "has",
        "ITERATE": "iterate"
      };
      var TriggerOpTypes = {
        "SET": "set",
        "ADD": "add",
        "DELETE": "delete",
        "CLEAR": "clear"
      };
      var ReactiveFlags = {
        "SKIP": "__v_skip",
        "IS_REACTIVE": "__v_isReactive",
        "IS_READONLY": "__v_isReadonly",
        "IS_SHALLOW": "__v_isShallow",
        "RAW": "__v_raw"
      };
      exports.EffectScope = EffectScope;
      exports.ITERATE_KEY = ITERATE_KEY;
      exports.ReactiveEffect = ReactiveEffect2;
      exports.ReactiveFlags = ReactiveFlags;
      exports.TrackOpTypes = TrackOpTypes;
      exports.TriggerOpTypes = TriggerOpTypes;
      exports.computed = computed;
      exports.customRef = customRef;
      exports.deferredComputed = deferredComputed;
      exports.effect = effect;
      exports.effectScope = effectScope;
      exports.enableTracking = enableTracking;
      exports.getCurrentScope = getCurrentScope;
      exports.isProxy = isProxy;
      exports.isReactive = isReactive2;
      exports.isReadonly = isReadonly;
      exports.isRef = isRef2;
      exports.isShallow = isShallow2;
      exports.markRaw = markRaw;
      exports.onScopeDispose = onScopeDispose;
      exports.pauseScheduling = pauseScheduling;
      exports.pauseTracking = pauseTracking;
      exports.proxyRefs = proxyRefs;
      exports.reactive = reactive;
      exports.readonly = readonly;
      exports.ref = ref;
      exports.resetScheduling = resetScheduling;
      exports.resetTracking = resetTracking;
      exports.shallowReactive = shallowReactive;
      exports.shallowReadonly = shallowReadonly;
      exports.shallowRef = shallowRef;
      exports.stop = stop;
      exports.toRaw = toRaw;
      exports.toRef = toRef;
      exports.toRefs = toRefs;
      exports.toValue = toValue;
      exports.track = track;
      exports.trigger = trigger;
      exports.triggerRef = triggerRef;
      exports.unref = unref;
    }
  });

  // node_modules/@vue/reactivity/dist/reactivity.cjs.js
  var require_reactivity_cjs = __commonJS({
    "node_modules/@vue/reactivity/dist/reactivity.cjs.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var shared = require_shared();
      function warn2(msg, ...args) {
        console.warn(`[Vue warn] ${msg}`, ...args);
      }
      var activeEffectScope;
      var EffectScope = class {
        constructor(detached = false) {
          this.detached = detached;
          this._active = true;
          this.effects = [];
          this.cleanups = [];
          this.parent = activeEffectScope;
          if (!detached && activeEffectScope) {
            this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
              this
            ) - 1;
          }
        }
        get active() {
          return this._active;
        }
        run(fn) {
          if (this._active) {
            const currentEffectScope = activeEffectScope;
            try {
              activeEffectScope = this;
              return fn();
            } finally {
              activeEffectScope = currentEffectScope;
            }
          } else {
            warn2(`cannot run an inactive effect scope.`);
          }
        }
        on() {
          activeEffectScope = this;
        }
        off() {
          activeEffectScope = this.parent;
        }
        stop(fromParent) {
          if (this._active) {
            let i, l;
            for (i = 0, l = this.effects.length; i < l; i++) {
              this.effects[i].stop();
            }
            for (i = 0, l = this.cleanups.length; i < l; i++) {
              this.cleanups[i]();
            }
            if (this.scopes) {
              for (i = 0, l = this.scopes.length; i < l; i++) {
                this.scopes[i].stop(true);
              }
            }
            if (!this.detached && this.parent && !fromParent) {
              const last = this.parent.scopes.pop();
              if (last && last !== this) {
                this.parent.scopes[this.index] = last;
                last.index = this.index;
              }
            }
            this.parent = void 0;
            this._active = false;
          }
        }
      };
      function effectScope(detached) {
        return new EffectScope(detached);
      }
      function recordEffectScope(effect2, scope = activeEffectScope) {
        if (scope && scope.active) {
          scope.effects.push(effect2);
        }
      }
      function getCurrentScope() {
        return activeEffectScope;
      }
      function onScopeDispose(fn) {
        if (activeEffectScope) {
          activeEffectScope.cleanups.push(fn);
        } else {
          warn2(
            `onScopeDispose() is called when there is no active effect scope to be associated with.`
          );
        }
      }
      var activeEffect;
      var ReactiveEffect2 = class {
        constructor(fn, trigger2, scheduler, scope) {
          this.fn = fn;
          this.trigger = trigger2;
          this.scheduler = scheduler;
          this.active = true;
          this.deps = [];
          this._dirtyLevel = 4;
          this._trackId = 0;
          this._runnings = 0;
          this._shouldSchedule = false;
          this._depsLength = 0;
          recordEffectScope(this, scope);
        }
        get dirty() {
          if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
            this._dirtyLevel = 1;
            pauseTracking();
            for (let i = 0; i < this._depsLength; i++) {
              const dep = this.deps[i];
              if (dep.computed) {
                triggerComputed(dep.computed);
                if (this._dirtyLevel >= 4) {
                  break;
                }
              }
            }
            if (this._dirtyLevel === 1) {
              this._dirtyLevel = 0;
            }
            resetTracking();
          }
          return this._dirtyLevel >= 4;
        }
        set dirty(v) {
          this._dirtyLevel = v ? 4 : 0;
        }
        run() {
          this._dirtyLevel = 0;
          if (!this.active) {
            return this.fn();
          }
          let lastShouldTrack = shouldTrack;
          let lastEffect = activeEffect;
          try {
            shouldTrack = true;
            activeEffect = this;
            this._runnings++;
            preCleanupEffect(this);
            return this.fn();
          } finally {
            postCleanupEffect(this);
            this._runnings--;
            activeEffect = lastEffect;
            shouldTrack = lastShouldTrack;
          }
        }
        stop() {
          if (this.active) {
            preCleanupEffect(this);
            postCleanupEffect(this);
            this.onStop && this.onStop();
            this.active = false;
          }
        }
      };
      function triggerComputed(computed2) {
        return computed2.value;
      }
      function preCleanupEffect(effect2) {
        effect2._trackId++;
        effect2._depsLength = 0;
      }
      function postCleanupEffect(effect2) {
        if (effect2.deps.length > effect2._depsLength) {
          for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
            cleanupDepEffect(effect2.deps[i], effect2);
          }
          effect2.deps.length = effect2._depsLength;
        }
      }
      function cleanupDepEffect(dep, effect2) {
        const trackId = dep.get(effect2);
        if (trackId !== void 0 && effect2._trackId !== trackId) {
          dep.delete(effect2);
          if (dep.size === 0) {
            dep.cleanup();
          }
        }
      }
      function effect(fn, options) {
        if (fn.effect instanceof ReactiveEffect2) {
          fn = fn.effect.fn;
        }
        const _effect = new ReactiveEffect2(fn, shared.NOOP, () => {
          if (_effect.dirty) {
            _effect.run();
          }
        });
        if (options) {
          shared.extend(_effect, options);
          if (options.scope)
            recordEffectScope(_effect, options.scope);
        }
        if (!options || !options.lazy) {
          _effect.run();
        }
        const runner = _effect.run.bind(_effect);
        runner.effect = _effect;
        return runner;
      }
      function stop(runner) {
        runner.effect.stop();
      }
      var shouldTrack = true;
      var pauseScheduleStack = 0;
      var trackStack = [];
      function pauseTracking() {
        trackStack.push(shouldTrack);
        shouldTrack = false;
      }
      function enableTracking() {
        trackStack.push(shouldTrack);
        shouldTrack = true;
      }
      function resetTracking() {
        const last = trackStack.pop();
        shouldTrack = last === void 0 ? true : last;
      }
      function pauseScheduling() {
        pauseScheduleStack++;
      }
      function resetScheduling() {
        pauseScheduleStack--;
        while (!pauseScheduleStack && queueEffectSchedulers.length) {
          queueEffectSchedulers.shift()();
        }
      }
      function trackEffect(effect2, dep, debuggerEventExtraInfo) {
        var _a;
        if (dep.get(effect2) !== effect2._trackId) {
          dep.set(effect2, effect2._trackId);
          const oldDep = effect2.deps[effect2._depsLength];
          if (oldDep !== dep) {
            if (oldDep) {
              cleanupDepEffect(oldDep, effect2);
            }
            effect2.deps[effect2._depsLength++] = dep;
          } else {
            effect2._depsLength++;
          }
          {
            (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, shared.extend({ effect: effect2 }, debuggerEventExtraInfo));
          }
        }
      }
      var queueEffectSchedulers = [];
      function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
        var _a;
        pauseScheduling();
        for (const effect2 of dep.keys()) {
          let tracking;
          if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
            effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
            effect2._dirtyLevel = dirtyLevel;
          }
          if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
            {
              (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, shared.extend({ effect: effect2 }, debuggerEventExtraInfo));
            }
            effect2.trigger();
            if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
              effect2._shouldSchedule = false;
              if (effect2.scheduler) {
                queueEffectSchedulers.push(effect2.scheduler);
              }
            }
          }
        }
        resetScheduling();
      }
      var createDep = (cleanup, computed2) => {
        const dep = /* @__PURE__ */ new Map();
        dep.cleanup = cleanup;
        dep.computed = computed2;
        return dep;
      };
      var targetMap = /* @__PURE__ */ new WeakMap();
      var ITERATE_KEY = Symbol("iterate");
      var MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
      function track(target, type, key) {
        if (shouldTrack && activeEffect) {
          let depsMap = targetMap.get(target);
          if (!depsMap) {
            targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
          }
          let dep = depsMap.get(key);
          if (!dep) {
            depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
          }
          trackEffect(
            activeEffect,
            dep,
            {
              target,
              type,
              key
            }
          );
        }
      }
      function trigger(target, type, key, newValue, oldValue, oldTarget) {
        const depsMap = targetMap.get(target);
        if (!depsMap) {
          return;
        }
        let deps = [];
        if (type === "clear") {
          deps = [...depsMap.values()];
        } else if (key === "length" && shared.isArray(target)) {
          const newLength = Number(newValue);
          depsMap.forEach((dep, key2) => {
            if (key2 === "length" || !shared.isSymbol(key2) && key2 >= newLength) {
              deps.push(dep);
            }
          });
        } else {
          if (key !== void 0) {
            deps.push(depsMap.get(key));
          }
          switch (type) {
            case "add":
              if (!shared.isArray(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
                if (shared.isMap(target)) {
                  deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              } else if (shared.isIntegerKey(key)) {
                deps.push(depsMap.get("length"));
              }
              break;
            case "delete":
              if (!shared.isArray(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
                if (shared.isMap(target)) {
                  deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              }
              break;
            case "set":
              if (shared.isMap(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
              }
              break;
          }
        }
        pauseScheduling();
        for (const dep of deps) {
          if (dep) {
            triggerEffects(
              dep,
              4,
              {
                target,
                type,
                key,
                newValue,
                oldValue,
                oldTarget
              }
            );
          }
        }
        resetScheduling();
      }
      function getDepFromReactive(object, key) {
        const depsMap = targetMap.get(object);
        return depsMap && depsMap.get(key);
      }
      var isNonTrackableKeys = /* @__PURE__ */ shared.makeMap(`__proto__,__v_isRef,__isVue`);
      var builtInSymbols = new Set(
        /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(shared.isSymbol)
      );
      var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
      function createArrayInstrumentations() {
        const instrumentations = {};
        ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
          instrumentations[key] = function(...args) {
            const arr = toRaw(this);
            for (let i = 0, l = this.length; i < l; i++) {
              track(arr, "get", i + "");
            }
            const res = arr[key](...args);
            if (res === -1 || res === false) {
              return arr[key](...args.map(toRaw));
            } else {
              return res;
            }
          };
        });
        ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
          instrumentations[key] = function(...args) {
            pauseTracking();
            pauseScheduling();
            const res = toRaw(this)[key].apply(this, args);
            resetScheduling();
            resetTracking();
            return res;
          };
        });
        return instrumentations;
      }
      function hasOwnProperty(key) {
        if (!shared.isSymbol(key))
          key = String(key);
        const obj = toRaw(this);
        track(obj, "has", key);
        return obj.hasOwnProperty(key);
      }
      var BaseReactiveHandler = class {
        constructor(_isReadonly = false, _isShallow = false) {
          this._isReadonly = _isReadonly;
          this._isShallow = _isShallow;
        }
        get(target, key, receiver) {
          const isReadonly2 = this._isReadonly, isShallow22 = this._isShallow;
          if (key === "__v_isReactive") {
            return !isReadonly2;
          } else if (key === "__v_isReadonly") {
            return isReadonly2;
          } else if (key === "__v_isShallow") {
            return isShallow22;
          } else if (key === "__v_raw") {
            if (receiver === (isReadonly2 ? isShallow22 ? shallowReadonlyMap : readonlyMap : isShallow22 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
              return target;
            }
            return;
          }
          const targetIsArray = shared.isArray(target);
          if (!isReadonly2) {
            if (targetIsArray && shared.hasOwn(arrayInstrumentations, key)) {
              return Reflect.get(arrayInstrumentations, key, receiver);
            }
            if (key === "hasOwnProperty") {
              return hasOwnProperty;
            }
          }
          const res = Reflect.get(target, key, receiver);
          if (shared.isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
            return res;
          }
          if (!isReadonly2) {
            track(target, "get", key);
          }
          if (isShallow22) {
            return res;
          }
          if (isRef2(res)) {
            return targetIsArray && shared.isIntegerKey(key) ? res : res.value;
          }
          if (shared.isObject(res)) {
            return isReadonly2 ? readonly(res) : reactive(res);
          }
          return res;
        }
      };
      var MutableReactiveHandler = class extends BaseReactiveHandler {
        constructor(isShallow22 = false) {
          super(false, isShallow22);
        }
        set(target, key, value, receiver) {
          let oldValue = target[key];
          if (!this._isShallow) {
            const isOldValueReadonly = isReadonly(oldValue);
            if (!isShallow2(value) && !isReadonly(value)) {
              oldValue = toRaw(oldValue);
              value = toRaw(value);
            }
            if (!shared.isArray(target) && isRef2(oldValue) && !isRef2(value)) {
              if (isOldValueReadonly) {
                return false;
              } else {
                oldValue.value = value;
                return true;
              }
            }
          }
          const hadKey = shared.isArray(target) && shared.isIntegerKey(key) ? Number(key) < target.length : shared.hasOwn(target, key);
          const result = Reflect.set(target, key, value, receiver);
          if (target === toRaw(receiver)) {
            if (!hadKey) {
              trigger(target, "add", key, value);
            } else if (shared.hasChanged(value, oldValue)) {
              trigger(target, "set", key, value, oldValue);
            }
          }
          return result;
        }
        deleteProperty(target, key) {
          const hadKey = shared.hasOwn(target, key);
          const oldValue = target[key];
          const result = Reflect.deleteProperty(target, key);
          if (result && hadKey) {
            trigger(target, "delete", key, void 0, oldValue);
          }
          return result;
        }
        has(target, key) {
          const result = Reflect.has(target, key);
          if (!shared.isSymbol(key) || !builtInSymbols.has(key)) {
            track(target, "has", key);
          }
          return result;
        }
        ownKeys(target) {
          track(
            target,
            "iterate",
            shared.isArray(target) ? "length" : ITERATE_KEY
          );
          return Reflect.ownKeys(target);
        }
      };
      var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
        constructor(isShallow22 = false) {
          super(true, isShallow22);
        }
        set(target, key) {
          {
            warn2(
              `Set operation on key "${String(key)}" failed: target is readonly.`,
              target
            );
          }
          return true;
        }
        deleteProperty(target, key) {
          {
            warn2(
              `Delete operation on key "${String(key)}" failed: target is readonly.`,
              target
            );
          }
          return true;
        }
      };
      var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
      var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
      var shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
        true
      );
      var shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
      var toShallow = (value) => value;
      var getProto = (v) => Reflect.getPrototypeOf(v);
      function get(target, key, isReadonly2 = false, isShallow22 = false) {
        target = target["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!isReadonly2) {
          if (shared.hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has: has2 } = getProto(rawTarget);
        const wrap = isShallow22 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        if (has2.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has2.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      }
      function has(key, isReadonly2 = false) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!isReadonly2) {
          if (shared.hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      }
      function size(target, isReadonly2 = false) {
        target = target["__v_raw"];
        !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
        return Reflect.get(target, "size", target);
      }
      function add(value, _isShallow = false) {
        if (!_isShallow && !isShallow2(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const proto = getProto(target);
        const hadKey = proto.has.call(target, value);
        if (!hadKey) {
          target.add(value);
          trigger(target, "add", value, value);
        }
        return this;
      }
      function set(key, value, _isShallow = false) {
        if (!_isShallow && !isShallow2(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const { has: has2, get: get2 } = getProto(target);
        let hadKey = has2.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has2.call(target, key);
        } else {
          checkIdentityKeys(target, has2, key);
        }
        const oldValue = get2.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (shared.hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
        return this;
      }
      function deleteEntry(key) {
        const target = toRaw(this);
        const { has: has2, get: get2 } = getProto(target);
        let hadKey = has2.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has2.call(target, key);
        } else {
          checkIdentityKeys(target, has2, key);
        }
        const oldValue = get2 ? get2.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0, oldValue);
        }
        return result;
      }
      function clear() {
        const target = toRaw(this);
        const hadItems = target.size !== 0;
        const oldTarget = shared.isMap(target) ? new Map(target) : new Set(target);
        const result = target.clear();
        if (hadItems) {
          trigger(target, "clear", void 0, void 0, oldTarget);
        }
        return result;
      }
      function createForEach(isReadonly2, isShallow22) {
        return function forEach(callback, thisArg) {
          const observed = this;
          const target = observed["__v_raw"];
          const rawTarget = toRaw(target);
          const wrap = isShallow22 ? toShallow : isReadonly2 ? toReadonly : toReactive;
          !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
          return target.forEach((value, key) => {
            return callback.call(thisArg, wrap(value), wrap(key), observed);
          });
        };
      }
      function createIterableMethod(method, isReadonly2, isShallow22) {
        return function(...args) {
          const target = this["__v_raw"];
          const rawTarget = toRaw(target);
          const targetIsMap = shared.isMap(rawTarget);
          const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
          const isKeyOnly = method === "keys" && targetIsMap;
          const innerIterator = target[method](...args);
          const wrap = isShallow22 ? toShallow : isReadonly2 ? toReadonly : toReactive;
          !isReadonly2 && track(
            rawTarget,
            "iterate",
            isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
          );
          return {
            next() {
              const { value, done } = innerIterator.next();
              return done ? { value, done } : {
                value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                done
              };
            },
            [Symbol.iterator]() {
              return this;
            }
          };
        };
      }
      function createReadonlyMethod(type) {
        return function(...args) {
          {
            const key = args[0] ? `on key "${args[0]}" ` : ``;
            warn2(
              `${shared.capitalize(type)} operation ${key}failed: target is readonly.`,
              toRaw(this)
            );
          }
          return type === "delete" ? false : type === "clear" ? void 0 : this;
        };
      }
      function createInstrumentations() {
        const mutableInstrumentations2 = {
          get(key) {
            return get(this, key);
          },
          get size() {
            return size(this);
          },
          has,
          add,
          set,
          delete: deleteEntry,
          clear,
          forEach: createForEach(false, false)
        };
        const shallowInstrumentations2 = {
          get(key) {
            return get(this, key, false, true);
          },
          get size() {
            return size(this);
          },
          has,
          add(value) {
            return add.call(this, value, true);
          },
          set(key, value) {
            return set.call(this, key, value, true);
          },
          delete: deleteEntry,
          clear,
          forEach: createForEach(false, true)
        };
        const readonlyInstrumentations2 = {
          get(key) {
            return get(this, key, true);
          },
          get size() {
            return size(this, true);
          },
          has(key) {
            return has.call(this, key, true);
          },
          add: createReadonlyMethod("add"),
          set: createReadonlyMethod("set"),
          delete: createReadonlyMethod("delete"),
          clear: createReadonlyMethod("clear"),
          forEach: createForEach(true, false)
        };
        const shallowReadonlyInstrumentations2 = {
          get(key) {
            return get(this, key, true, true);
          },
          get size() {
            return size(this, true);
          },
          has(key) {
            return has.call(this, key, true);
          },
          add: createReadonlyMethod("add"),
          set: createReadonlyMethod("set"),
          delete: createReadonlyMethod("delete"),
          clear: createReadonlyMethod("clear"),
          forEach: createForEach(true, true)
        };
        const iteratorMethods = [
          "keys",
          "values",
          "entries",
          Symbol.iterator
        ];
        iteratorMethods.forEach((method) => {
          mutableInstrumentations2[method] = createIterableMethod(method, false, false);
          readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
          shallowInstrumentations2[method] = createIterableMethod(method, false, true);
          shallowReadonlyInstrumentations2[method] = createIterableMethod(
            method,
            true,
            true
          );
        });
        return [
          mutableInstrumentations2,
          readonlyInstrumentations2,
          shallowInstrumentations2,
          shallowReadonlyInstrumentations2
        ];
      }
      var [
        mutableInstrumentations,
        readonlyInstrumentations,
        shallowInstrumentations,
        shallowReadonlyInstrumentations
      ] = /* @__PURE__ */ createInstrumentations();
      function createInstrumentationGetter(isReadonly2, shallow) {
        const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
        return (target, key, receiver) => {
          if (key === "__v_isReactive") {
            return !isReadonly2;
          } else if (key === "__v_isReadonly") {
            return isReadonly2;
          } else if (key === "__v_raw") {
            return target;
          }
          return Reflect.get(
            shared.hasOwn(instrumentations, key) && key in target ? instrumentations : target,
            key,
            receiver
          );
        };
      }
      var mutableCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(false, false)
      };
      var shallowCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(false, true)
      };
      var readonlyCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(true, false)
      };
      var shallowReadonlyCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(true, true)
      };
      function checkIdentityKeys(target, has2, key) {
        const rawKey = toRaw(key);
        if (rawKey !== key && has2.call(target, rawKey)) {
          const type = shared.toRawType(target);
          warn2(
            `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
          );
        }
      }
      var reactiveMap = /* @__PURE__ */ new WeakMap();
      var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
      var readonlyMap = /* @__PURE__ */ new WeakMap();
      var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
      function targetTypeMap(rawType) {
        switch (rawType) {
          case "Object":
          case "Array":
            return 1;
          case "Map":
          case "Set":
          case "WeakMap":
          case "WeakSet":
            return 2;
          default:
            return 0;
        }
      }
      function getTargetType(value) {
        return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(shared.toRawType(value));
      }
      function reactive(target) {
        if (isReadonly(target)) {
          return target;
        }
        return createReactiveObject(
          target,
          false,
          mutableHandlers,
          mutableCollectionHandlers,
          reactiveMap
        );
      }
      function shallowReactive(target) {
        return createReactiveObject(
          target,
          false,
          shallowReactiveHandlers,
          shallowCollectionHandlers,
          shallowReactiveMap
        );
      }
      function readonly(target) {
        return createReactiveObject(
          target,
          true,
          readonlyHandlers,
          readonlyCollectionHandlers,
          readonlyMap
        );
      }
      function shallowReadonly(target) {
        return createReactiveObject(
          target,
          true,
          shallowReadonlyHandlers,
          shallowReadonlyCollectionHandlers,
          shallowReadonlyMap
        );
      }
      function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
        if (!shared.isObject(target)) {
          {
            warn2(
              `value cannot be made ${isReadonly2 ? "readonly" : "reactive"}: ${String(
                target
              )}`
            );
          }
          return target;
        }
        if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
          return target;
        }
        const existingProxy = proxyMap.get(target);
        if (existingProxy) {
          return existingProxy;
        }
        const targetType = getTargetType(target);
        if (targetType === 0) {
          return target;
        }
        const proxy = new Proxy(
          target,
          targetType === 2 ? collectionHandlers : baseHandlers
        );
        proxyMap.set(target, proxy);
        return proxy;
      }
      function isReactive2(value) {
        if (isReadonly(value)) {
          return isReactive2(value["__v_raw"]);
        }
        return !!(value && value["__v_isReactive"]);
      }
      function isReadonly(value) {
        return !!(value && value["__v_isReadonly"]);
      }
      function isShallow2(value) {
        return !!(value && value["__v_isShallow"]);
      }
      function isProxy(value) {
        return value ? !!value["__v_raw"] : false;
      }
      function toRaw(observed) {
        const raw = observed && observed["__v_raw"];
        return raw ? toRaw(raw) : observed;
      }
      function markRaw(value) {
        if (Object.isExtensible(value)) {
          shared.def(value, "__v_skip", true);
        }
        return value;
      }
      var toReactive = (value) => shared.isObject(value) ? reactive(value) : value;
      var toReadonly = (value) => shared.isObject(value) ? readonly(value) : value;
      var COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
      var ComputedRefImpl = class {
        constructor(getter, _setter, isReadonly2, isSSR) {
          this.getter = getter;
          this._setter = _setter;
          this.dep = void 0;
          this.__v_isRef = true;
          this["__v_isReadonly"] = false;
          this.effect = new ReactiveEffect2(
            () => getter(this._value),
            () => triggerRefValue(
              this,
              this.effect._dirtyLevel === 2 ? 2 : 3
            )
          );
          this.effect.computed = this;
          this.effect.active = this._cacheable = !isSSR;
          this["__v_isReadonly"] = isReadonly2;
        }
        get value() {
          const self2 = toRaw(this);
          if ((!self2._cacheable || self2.effect.dirty) && shared.hasChanged(self2._value, self2._value = self2.effect.run())) {
            triggerRefValue(self2, 4);
          }
          trackRefValue(self2);
          if (self2.effect._dirtyLevel >= 2) {
            if (this._warnRecursive) {
              warn2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
            }
            triggerRefValue(self2, 2);
          }
          return self2._value;
        }
        set value(newValue) {
          this._setter(newValue);
        }
        get _dirty() {
          return this.effect.dirty;
        }
        set _dirty(v) {
          this.effect.dirty = v;
        }
      };
      function computed(getterOrOptions, debugOptions, isSSR = false) {
        let getter;
        let setter;
        const onlyGetter = shared.isFunction(getterOrOptions);
        if (onlyGetter) {
          getter = getterOrOptions;
          setter = () => {
            warn2("Write operation failed: computed value is readonly");
          };
        } else {
          getter = getterOrOptions.get;
          setter = getterOrOptions.set;
        }
        const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
        if (debugOptions && !isSSR) {
          cRef.effect.onTrack = debugOptions.onTrack;
          cRef.effect.onTrigger = debugOptions.onTrigger;
        }
        return cRef;
      }
      function trackRefValue(ref2) {
        var _a;
        if (shouldTrack && activeEffect) {
          ref2 = toRaw(ref2);
          trackEffect(
            activeEffect,
            (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
              () => ref2.dep = void 0,
              ref2 instanceof ComputedRefImpl ? ref2 : void 0
            ),
            {
              target: ref2,
              type: "get",
              key: "value"
            }
          );
        }
      }
      function triggerRefValue(ref2, dirtyLevel = 4, newVal, oldVal) {
        ref2 = toRaw(ref2);
        const dep = ref2.dep;
        if (dep) {
          triggerEffects(
            dep,
            dirtyLevel,
            {
              target: ref2,
              type: "set",
              key: "value",
              newValue: newVal,
              oldValue: oldVal
            }
          );
        }
      }
      function isRef2(r) {
        return !!(r && r.__v_isRef === true);
      }
      function ref(value) {
        return createRef(value, false);
      }
      function shallowRef(value) {
        return createRef(value, true);
      }
      function createRef(rawValue, shallow) {
        if (isRef2(rawValue)) {
          return rawValue;
        }
        return new RefImpl(rawValue, shallow);
      }
      var RefImpl = class {
        constructor(value, __v_isShallow) {
          this.__v_isShallow = __v_isShallow;
          this.dep = void 0;
          this.__v_isRef = true;
          this._rawValue = __v_isShallow ? value : toRaw(value);
          this._value = __v_isShallow ? value : toReactive(value);
        }
        get value() {
          trackRefValue(this);
          return this._value;
        }
        set value(newVal) {
          const useDirectValue = this.__v_isShallow || isShallow2(newVal) || isReadonly(newVal);
          newVal = useDirectValue ? newVal : toRaw(newVal);
          if (shared.hasChanged(newVal, this._rawValue)) {
            const oldVal = this._rawValue;
            this._rawValue = newVal;
            this._value = useDirectValue ? newVal : toReactive(newVal);
            triggerRefValue(this, 4, newVal, oldVal);
          }
        }
      };
      function triggerRef(ref2) {
        triggerRefValue(ref2, 4, ref2.value);
      }
      function unref(ref2) {
        return isRef2(ref2) ? ref2.value : ref2;
      }
      function toValue(source) {
        return shared.isFunction(source) ? source() : unref(source);
      }
      var shallowUnwrapHandlers = {
        get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
        set: (target, key, value, receiver) => {
          const oldValue = target[key];
          if (isRef2(oldValue) && !isRef2(value)) {
            oldValue.value = value;
            return true;
          } else {
            return Reflect.set(target, key, value, receiver);
          }
        }
      };
      function proxyRefs(objectWithRefs) {
        return isReactive2(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
      }
      var CustomRefImpl = class {
        constructor(factory) {
          this.dep = void 0;
          this.__v_isRef = true;
          const { get: get2, set: set2 } = factory(
            () => trackRefValue(this),
            () => triggerRefValue(this)
          );
          this._get = get2;
          this._set = set2;
        }
        get value() {
          return this._get();
        }
        set value(newVal) {
          this._set(newVal);
        }
      };
      function customRef(factory) {
        return new CustomRefImpl(factory);
      }
      function toRefs(object) {
        if (!isProxy(object)) {
          warn2(`toRefs() expects a reactive object but received a plain one.`);
        }
        const ret = shared.isArray(object) ? new Array(object.length) : {};
        for (const key in object) {
          ret[key] = propertyToRef(object, key);
        }
        return ret;
      }
      var ObjectRefImpl = class {
        constructor(_object, _key, _defaultValue) {
          this._object = _object;
          this._key = _key;
          this._defaultValue = _defaultValue;
          this.__v_isRef = true;
        }
        get value() {
          const val = this._object[this._key];
          return val === void 0 ? this._defaultValue : val;
        }
        set value(newVal) {
          this._object[this._key] = newVal;
        }
        get dep() {
          return getDepFromReactive(toRaw(this._object), this._key);
        }
      };
      var GetterRefImpl = class {
        constructor(_getter) {
          this._getter = _getter;
          this.__v_isRef = true;
          this.__v_isReadonly = true;
        }
        get value() {
          return this._getter();
        }
      };
      function toRef(source, key, defaultValue) {
        if (isRef2(source)) {
          return source;
        } else if (shared.isFunction(source)) {
          return new GetterRefImpl(source);
        } else if (shared.isObject(source) && arguments.length > 1) {
          return propertyToRef(source, key, defaultValue);
        } else {
          return ref(source);
        }
      }
      function propertyToRef(source, key, defaultValue) {
        const val = source[key];
        return isRef2(val) ? val : new ObjectRefImpl(source, key, defaultValue);
      }
      var deferredComputed = computed;
      var TrackOpTypes = {
        "GET": "get",
        "HAS": "has",
        "ITERATE": "iterate"
      };
      var TriggerOpTypes = {
        "SET": "set",
        "ADD": "add",
        "DELETE": "delete",
        "CLEAR": "clear"
      };
      var ReactiveFlags = {
        "SKIP": "__v_skip",
        "IS_REACTIVE": "__v_isReactive",
        "IS_READONLY": "__v_isReadonly",
        "IS_SHALLOW": "__v_isShallow",
        "RAW": "__v_raw"
      };
      exports.EffectScope = EffectScope;
      exports.ITERATE_KEY = ITERATE_KEY;
      exports.ReactiveEffect = ReactiveEffect2;
      exports.ReactiveFlags = ReactiveFlags;
      exports.TrackOpTypes = TrackOpTypes;
      exports.TriggerOpTypes = TriggerOpTypes;
      exports.computed = computed;
      exports.customRef = customRef;
      exports.deferredComputed = deferredComputed;
      exports.effect = effect;
      exports.effectScope = effectScope;
      exports.enableTracking = enableTracking;
      exports.getCurrentScope = getCurrentScope;
      exports.isProxy = isProxy;
      exports.isReactive = isReactive2;
      exports.isReadonly = isReadonly;
      exports.isRef = isRef2;
      exports.isShallow = isShallow2;
      exports.markRaw = markRaw;
      exports.onScopeDispose = onScopeDispose;
      exports.pauseScheduling = pauseScheduling;
      exports.pauseTracking = pauseTracking;
      exports.proxyRefs = proxyRefs;
      exports.reactive = reactive;
      exports.readonly = readonly;
      exports.ref = ref;
      exports.resetScheduling = resetScheduling;
      exports.resetTracking = resetTracking;
      exports.shallowReactive = shallowReactive;
      exports.shallowReadonly = shallowReadonly;
      exports.shallowRef = shallowRef;
      exports.stop = stop;
      exports.toRaw = toRaw;
      exports.toRef = toRef;
      exports.toRefs = toRefs;
      exports.toValue = toValue;
      exports.track = track;
      exports.trigger = trigger;
      exports.triggerRef = triggerRef;
      exports.unref = unref;
    }
  });

  // node_modules/@vue/reactivity/index.js
  var require_reactivity = __commonJS({
    "node_modules/@vue/reactivity/index.js"(exports, module) {
      "use strict";
      if (process.env.NODE_ENV === "production") {
        module.exports = require_reactivity_cjs_prod();
      } else {
        module.exports = require_reactivity_cjs();
      }
    }
  });

  // src/index.ts
  var import_reactivity = __toESM(require_reactivity());
  var import_shared2 = __toESM(require_shared());

  window.reactivity = import_reactivity;

  // src/errorHandling.ts
  var import_shared = __toESM(require_shared());
  function callWithErrorHandling(fn, type, args) {
    let res;
    try {
      res = args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, type);
    }
    return res;
  }
  function callWithAsyncErrorHandling(fn, type, args) {
    if ((0, import_shared.isFunction)(fn)) {
      const res = callWithErrorHandling(fn, type, args);
      if (res && (0, import_shared.isPromise)(res)) {
        res.catch((err) => {
          handleError(err, type);
        });
      }
      return res;
    }
    const values = [];
    for (let i = 0; i < fn.length; i++)
      values.push(callWithAsyncErrorHandling(fn[i], type, args));
    return values;
  }
  function handleError(err, type) {
    console.error(new Error(`[@vue-reactivity/watch]: ${type}`));
    console.error(err);
  }
  function warn(message) {
    console.warn(createError(message));
  }
  function createError(message) {
    return new Error(`[reactivue]: ${message}`);
  }

  // src/index.ts
  var INITIAL_WATCHER_VALUE = {};
  function watchEffect(effect, options) {
    return doWatch(effect, null, options);
  }
  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, { immediate, deep, flush } = {}) {
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if ((0, import_reactivity.isRef)(source)) {
      getter = () => source.value;
      forceTrigger = (0, import_reactivity.isShallow)(source);
    } else if ((0, import_reactivity.isReactive)(source)) {
      getter = () => source;
      deep = true;
    } else if ((0, import_shared2.isArray)(source)) {
      isMultiSource = true;
      forceTrigger = source.some(import_reactivity.isReactive);
      getter = () => source.map((s) => {
        if ((0, import_reactivity.isRef)(s))
          return s.value;
        else if ((0, import_reactivity.isReactive)(s))
          return traverse(s);
        else if ((0, import_shared2.isFunction)(s))
          return callWithErrorHandling(s, "watch getter");
        else
          return warn("invalid source");
      });
    } else if ((0, import_shared2.isFunction)(source)) {
      if (cb) {
        getter = () => callWithErrorHandling(source, "watch getter");
      } else {
        getter = () => {
          if (cleanup)
            cleanup();
          return callWithAsyncErrorHandling(
            source,
            "watch callback",
            [onCleanup]
          );
        };
      }
    } else {
      getter = import_shared2.NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    let cleanup;
    let onCleanup = (fn) => {
      cleanup = effect.onStop = () => {
        callWithErrorHandling(fn, "watch cleanup");
      };
    };
    let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
    const job = () => {
      if (!effect.active)
        return;
      if (cb) {
        const newValue = effect.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some(
          (v, i) => (0, import_shared2.hasChanged)(v, oldValue[i])
        ) : (0, import_shared2.hasChanged)(newValue, oldValue))) {
          if (cleanup)
            cleanup();
          callWithAsyncErrorHandling(cb, "watch value", [
            newValue,
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
            onCleanup
          ]);
          oldValue = newValue;
        }
      } else {
        effect.run();
      }
    };
    job.allowRecurse = !!cb;
    let scheduler;
    if (flush === "sync") {
      scheduler = job;
    } else {
      scheduler = () => {
        job();
      };
    }
    const effect = new import_reactivity.ReactiveEffect(getter, scheduler);
    if (cb) {
      if (immediate)
        job();
      else
        oldValue = effect.run();
    } else {
      effect.run();
    }
    return () => effect.stop();
  }
  function traverse(value, seen = /* @__PURE__ */ new Set()) {
    if (!(0, import_shared2.isObject)(value) || seen.has(value))
      return value;
    seen.add(value);
    if ((0, import_shared2.isArray)(value)) {
      for (let i = 0; i < value.length; i++)
        traverse(value[i], seen);
    } else if (value instanceof Map) {
      value.forEach((_, key) => {
        traverse(value.get(key), seen);
      });
    } else if (value instanceof Set) {
      value.forEach((v) => {
        traverse(v, seen);
      });
    } else {
      for (const key of Object.keys(value))
        traverse(value[key], seen);
    }
    return value;
  }

  globalThis.watchEffect = watchEffect;
  globalThis.watch = watch;
})();
/*! #__NO_SIDE_EFFECTS__ */
/**
* @vue/reactivity v3.4.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/**
* @vue/shared v3.4.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/