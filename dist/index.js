const t={w:"width",x:"density"},e=t=>t.reduce((t,e)=>(t.width||0)>e.width?t:e,t[0]),r={LAZY_LOAD:"lazyload",LAZY_LOADING:"lazyloading",LAZY_LOADED:"lazyloaded"};exports.lazyBackgroundImage=function({$root:n=document.body,$element:o,srcset:l,additonalUrl:s,lazyCallback:a=(()=>{}),observerOptions:i={},bigQuality:c=!1}={}){const u="data-background-srcset",d="data-background-id";let g;const m=[];let b=0;const v=()=>{O(),window.addEventListener("resize",f)},h=()=>{w(),v()},w=()=>{g.disconnect(),window.removeEventListener("resize",f)},f=()=>{h()},O=()=>{if(!("IntersectionObserver"in window))return;g=new IntersectionObserver(y,i);const t=o||l?o?[o]:null:(()=>{const t=n.querySelectorAll(`[${u}]:not(img):not(figure)`);return null!=t&&t.length?[...t]:null})();null==t||t.forEach(t=>{const e=A(t),r=null==m?void 0:m[t.getAttribute(d)];(!r||(null==r?void 0:r.width)<e.width&&e.width<=e.biggestImageDataOject.width)&&g.observe(t)})},y=t=>{null==t||t.forEach(function(t){try{var e;const n=t.target;if(p(n,r.LAZY_LOAD),!t.isIntersecting)return Promise.resolve();const o=A(n),l=n.getAttribute(d);return l?m[l]=null==o?void 0:o.imageDataObject:(n.setAttribute(d,`${b}`),m[b]=null==o?void 0:o.imageDataObject,b++),null!=o&&null!=(e=o.imageDataObject)&&e.url?(p(n,r.LAZY_LOADING),Promise.resolve(D(n,o.imageDataObject.url)).then(function(){p(n,r.LAZY_LOADED),L(n,o.imageDataObject),g.unobserve(n)})):Promise.resolve()}catch(t){return Promise.reject(t)}})},A=r=>{var n;const o=(null==(n=r.getBoundingClientRect())?void 0:n.width)||window.innerWidth,s=l||r.getAttribute(u),a=function(e){return((t,e)=>{let r=null,n=[];for(;null!==(r=e.exec(t));)n.push(r);return n})(e,/(\S*[^,\s])(\s+([\d.]+)(x|w))?/g).map(([,e,,r,n])=>{let o=t[n];return o?{url:e,[o]:parseFloat(r)}:{url:e}})}(s);return{width:o,dataSrcset:s,imageDataObject:function(t,r,n=!1){if(!t)return;const o=t.map(t=>null==t?void 0:t.width).sort((t,e)=>t-e).filter(t=>t>r),l=e(t),s=t.map(t=>t.width===o[n&&o.length>1?1:0]?t:l.width<=r?l:void 0).filter(t=>t);return s.length>0?s[0]:null}(a,o,c),biggestImageDataOject:e(a)}},L=(t,e)=>{t.style.backgroundImage=[`url('${e.url}')`,s&&`, url('${s}')`].filter(t=>t).join("")},D=(t,e)=>new Promise(t=>{const r=document.createElement("img");r.src=e,r.onload=()=>{t()}}),p=(t,e)=>{Object.values(r).forEach(e=>{t.classList.remove(e)}),t.classList.add(e),a(e)};return{start:v,update:h,stop:w}},exports.lazyImage=function({$element:t,srcset:e,src:n,$root:o=document.body,lazyCallback:l=(()=>{}),observerOptions:s={}}={}){let a;const i=!!t||!!n||!!e,c=()=>{d()},u=()=>{a.disconnect()},d=()=>{if(!("IntersectionObserver"in window))return;a=new IntersectionObserver(g,s);const e=i?t?[t]:null:(()=>{const t=[...o.querySelectorAll("[data-srcset]")||[],...o.querySelectorAll("[data-src]")||[]];return null!=t&&t.length?t:null})();null==e||e.forEach(t=>a.observe(t))},g=t=>{t.forEach(function(t){try{const e=t.target;b(e,"lazyload");const r=function(){if(t.isIntersecting)return a.unobserve(e),b(e,"lazyloading"),Promise.resolve(m(e)).then(function(){b(e,"lazyloaded")})}();return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(t){return Promise.reject(t)}})},m=t=>new Promise(r=>{const o=n||t.getAttribute("data-src"),l=e||t.getAttribute("data-srcset"),s=document.createElement("img");o&&(s.src=o),l&&(s.srcset=l),s.onload=()=>{o&&(t.src=o),l&&(t.srcset=l),r()}}),b=(t,e)=>{Object.values(r).forEach(e=>{t.classList.remove(e)}),t.classList.add(e),l(e)};return{start:c,update:()=>{u(),c()},stop:u}},exports.lazyState=r;
//# sourceMappingURL=index.js.map
