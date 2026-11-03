import React,{useState,useEffect,useRef} from 'react';
const h=React.createElement;
import {QUIZ} from './content.js';
/* ---------- helpers ---------- */
export function go(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"})}
export const deep=o=>JSON.parse(JSON.stringify(o));
export function merge(a,b){if(Array.isArray(a)&&Array.isArray(b))return b.map((x,i)=>a[i]!==undefined&&typeof x==="object"&&x!==null?merge(a[i],x):x);
 if(a&&b&&typeof a==="object"&&typeof b==="object"&&!Array.isArray(a)){const o={...a};for(const k in b)o[k]=k in a?merge(a[k],b[k]):b[k];return o}return b===undefined?a:b}
export function setPath(obj,path,val){const o=deep(obj);let c=o;for(let i=0;i<path.length-1;i++)c=c[path[i]];c[path[path.length-1]]=val;return o}
export async function sha256(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
export const reduced=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
export const fine=()=>matchMedia("(hover: hover) and (pointer: fine)").matches;
export const nav=path=>{location.hash="#/"+path.replace(/^\/+/,"")};
export function useReveal(opts){const ref=useRef(null);const [on,setOn]=useState(false);
 useEffect(()=>{const el=ref.current;if(!el)return;const ob=new IntersectionObserver(es=>{if(es[0].isIntersecting){setOn(true);ob.disconnect()}},opts||{threshold:.2});ob.observe(el);return()=>ob.disconnect()},[]);return [ref,on]}
export function Reveal({as="div",className="",children,...rest}){const [ref,on]=useReveal();return h(as,{ref,className:"rv"+(on?" in":"")+(className?" "+className:""),...rest},children)}

/* brand logo (vector version of the client's logo; colours come from --logo-* in styles.css) */
export function Logo(){return h("svg",{className:"brand",viewBox:"0 0 200 74",role:"img","aria-label":"Solutions India, Business Reimagined"},
 h("text",{x:100,y:31,textAnchor:"middle",className:"lg-n lg-big",textLength:186,lengthAdjust:"spacingAndGlyphs"},"SOLUTIONS"),
 h("rect",{x:7,y:42,width:56,height:2.6,rx:1.3,className:"lg-o"}),
 h("text",{x:100,y:50,textAnchor:"middle",className:"lg-o lg-mid",textLength:58,lengthAdjust:"spacing"},"INDIA"),
 h("rect",{x:137,y:42,width:56,height:2.6,rx:1.3,className:"lg-g"}),
 h("text",{x:100,y:69,textAnchor:"middle",className:"lg-n lg-small",textLength:132,lengthAdjust:"spacingAndGlyphs"},"Business Reimagined"))}

/* 9 magnetic button */
export function Magnet({className,onClick,children}){const ref=useRef(null);
 const move=e=>{if(reduced()||!fine())return;const r=ref.current.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;ref.current.style.transform=`translate(${x*10}px,${y*10}px)`};
 const leave=()=>{ref.current.style.transform=""};
 return h("button",{ref,className:"btn "+(className||""),onClick,onMouseMove:move,onMouseLeave:leave},children)}

/* 15 particles + 2 parallax */
function Particles(){const ref=useRef(null);
 useEffect(()=>{const cv=ref.current,ctx=cv.getContext("2d");let w,hh,raf,pts=[],m={x:-1e4,y:-1e4};
  const size=()=>{w=cv.width=cv.offsetWidth;hh=cv.height=cv.offsetHeight;const n=Math.min(70,Math.floor(w/16));pts=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*hh,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3}))};
  size();const ro=new ResizeObserver(size);ro.observe(cv);
  const onm=e=>{const r=cv.getBoundingClientRect();m={x:e.clientX-r.left,y:e.clientY-r.top}};const off=()=>{m={x:-1e4,y:-1e4}};
  cv.parentElement.addEventListener("mousemove",onm);cv.parentElement.addEventListener("mouseleave",off);
  const draw=()=>{ctx.clearRect(0,0,w,hh);const ac=getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()||"#ea7a03";
   for(const p of pts){const dx=m.x-p.x,dy=m.y-p.y,d=Math.hypot(dx,dy);if(d<160){p.vx+=dx/d*.02;p.vy+=dy/d*.02}p.vx*=.98;p.vy*=.98;p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>hh)p.vy*=-1}
   ctx.lineWidth=1;for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<110){ctx.strokeStyle="rgba(255,255,255,"+(0.12*(1-d/110))+")";ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
   ctx.fillStyle=ac;for(const p of pts){ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,7);ctx.fill()}ctx.globalAlpha=1;
   if(!reduced())raf=requestAnimationFrame(draw)};draw();
  return()=>{cancelAnimationFrame(raf);ro.disconnect();cv.parentElement.removeEventListener("mousemove",onm);cv.parentElement.removeEventListener("mouseleave",off)}},[]);
 return h("canvas",{ref,"aria-hidden":true})}
function useParallax(){useEffect(()=>{if(reduced())return;const els=[...document.querySelectorAll("[data-px]")];const f=()=>{const y=scrollY;els.forEach(el=>{el.style.transform=`translateY(${y*el.dataset.px}px)`})};addEventListener("scroll",f,{passive:true});return()=>removeEventListener("scroll",f)},[])}

/* 11 text reveal + 12 rotating + 13 gradient text */
function Headline({lead,words,tail}){const [i,setI]=useState(0);const [swap,setSwap]=useState(false);
 useEffect(()=>{if(words.length<2)return;const t=setInterval(()=>{setI(x=>(x+1)%words.length);setSwap(true);setTimeout(()=>setSwap(false),600)},3200);return()=>clearInterval(t)},[words.length]);
 const ws=lead.split(" ");
 return h("h1",null,ws.map((w,k)=>h("span",{className:"w",key:k},h("span",{style:{animationDelay:k*90+"ms"}},w)," ")),
  h("span",{className:"w"},h("span",{style:{animationDelay:ws.length*90+"ms"}},h("span",{className:"rot"+(swap?" swap":""),key:i},words[i]||"")))," ",
  tail.split(" ").map((w,k)=>h("span",{className:"w",key:"t"+k},h("span",{style:{animationDelay:(ws.length+1+k)*90+"ms"}},w)," ")))}

/* 1 stats */
const easeOut=p=>1-Math.pow(1-p,4);
function Stat({value,suffix,title,label,start,delay}){
 const [n,setN]=useState(0);const [suf,setSuf]=useState(false);
 useEffect(()=>{if(!start)return;if(reduced()){setN(value);setSuf(true);return}
  let raf;const dur=1800;const t0=performance.now()+delay;
  const tick=t=>{const p=Math.min(1,Math.max(0,(t-t0)/dur));setN(Math.round(value*easeOut(p)));if(p<1)raf=requestAnimationFrame(tick);else setSuf(true)};
  raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[start,value,delay]);
 return h("div",{className:"stat",style:{transitionDelay:delay+"ms"}},
  h("div",{className:"num","aria-label":value+suffix+" "+title},n,suffix&&h("span",{className:"suf"+(suf?" show":"")},suffix)),
  h("p",{className:"lbl",style:{transitionDelay:(delay+350)+"ms"}},h("b",null,title),label))}
function Stats({items}){const [ref,start]=useReveal({threshold:.35});
 return h("section",{className:"stats"+(start?" in":""),ref,"aria-label":"Key statistics"},h("div",{className:"wrap grid"},
  items.map((s,k)=>h(Stat,{key:k,value:Number(s.value)||0,suffix:s.suffix||"",title:s.title||"",label:s.label||"",start,delay:k*160}))))}

/* 17 marquee */
function Marquee({items}){const list=[...items,...items];return h("div",{className:"marquee","aria-hidden":true},h("div",{className:"track"},list.map((t,k)=>h("span",{key:k},t))))}

/* 21 before/after */
function BeforeAfter({c}){
 return h("div",{className:"ba2"},
  h("div",{className:"bcard before"},h("span",{className:"tag"},"Before"),h("h3",null,c.beforeTitle),h("ul",null,c.before.map((t,k)=>h("li",{key:k,style:{"--i":k}},t)))),
  h("div",{className:"barrow","aria-hidden":true},h("span",null,"→")),
  h("div",{className:"bcard after"},h("span",{className:"tag"},"After"),h("h3",null,c.afterTitle),h("ul",null,c.after.map((t,k)=>h("li",{key:k,style:{"--i":k}},t)))))}

/* 3 sticky story + 18 timeline */
function Story({c}){const ref=useRef(null);const [prog,setProg]=useState(0);const [cur,setCur]=useState(0);
 useEffect(()=>{const el=ref.current;const f=()=>{const r=el.getBoundingClientRect();const p=Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height));setProg(p);setCur(Math.min(c.steps.length-1,Math.floor(p*c.steps.length)))};f();addEventListener("scroll",f,{passive:true});return()=>removeEventListener("scroll",f)},[c.steps.length]);
 return h("section",{className:"wrap",id:"how"},h("hr",{className:"rule"}),
  h("div",{className:"story"},
   h("div",{className:"pin"},h("div",{className:"spanel"},
    h("p",{className:"eyebrow"},"Step "+(cur+1)+" of "+c.steps.length),
    h("div",{className:"bignum",key:"n"+cur},String(cur+1).padStart(2,"0")),
    h("h3",{key:"t"+cur,className:"stitle"},(c.steps[cur]||{}).title),
    h("div",{className:"sbar"},h("i",{style:{width:Math.round(prog*100)+"%"}})),
    h("div",{className:"sdots"},c.steps.map((_,k)=>h("span",{key:k,className:k<=cur?"on":""}))))),
   h("div",{className:"tl",ref},h("div",{className:"line",style:{"--h":Math.round(prog*100)+"%"}}),
    c.steps.map((s,k)=>h("div",{key:k,className:"tstep"+(k<=cur?" in":"")},h("span",{className:"k"},"Step "+(k+1)),h("h3",null,s.title),h("p",null,s.text))))))}

/* 22 tabs + 5 tilt + 7 gradient border */
function Tilt({className,onClick,children,...rest}){const ref=useRef(null);
 const move=e=>{if(reduced()||!fine())return;const r=ref.current.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ref.current.style.transform=`rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(6px)`};
 const leave=()=>{ref.current.style.transform=""};
 return h("button",{ref,className,onClick,onMouseMove:move,onMouseLeave:leave,...rest},children)}
function Programs({c,bare}){const [i,setI]=useState(0);const p=c.programs[i];
 return h(Reveal,{as:"section",id:"programs",className:"wrap"+(bare?" bare":"")},
  !bare&&h("hr",{className:"rule"}),!bare&&h("p",{className:"eyebrow",style:{marginTop:14}},"Our three programs"),
  !bare&&h("h2",null,c.programsIntro.heading),!bare&&h("p",{className:"lede"},c.programsIntro.text),
  h("div",{className:"tabs",role:"tablist"},c.programs.map((x,k)=>h(Tilt,{key:x.id,role:"tab","aria-selected":k===i,className:"tab"+(k===i?" on":""),onClick:()=>setI(k)},h("span",{className:"n"},x.n),h("b",null,x.name)))),
  h("div",{className:"gb"},h("div",{className:"panel",role:"tabpanel"},h("div",{className:"inner",key:i},
   h("h3",null,p.name),h("p",{className:"tag"},p.tag),h("p",{className:"intro"},p.intro),
   h("p",{className:"eyebrow",style:{marginTop:24}},"Key areas of focus"),
   h("ul",{className:"focus"},p.focus.map((f,k)=>h("li",{key:k},f))),
   h("div",{className:"two"},h("div",null,h("b",null,"Our approach"),p.approach),h("div",null,h("b",null,"Intended outcome"),p.outcome)),
   p.note&&h("p",{className:"note"},p.note)))))}

/* 4 sectors + 8 zoom */
function Sectors({c}){return h(Reveal,{as:"section",className:"wrap",id:"sectors"},h("p",{className:"hint","aria-hidden":true},"Swipe to see all sectors"),h("div",{className:"hscroll"},c.items.map((s,k)=>h("div",{className:"sector",key:k},h("div",{className:"art"},h("i"),h("b",null,s.name)),h("p",null,s.text)))))}

/* 10 stacked cards */
function Glance({c}){return h("section",{className:"wrap"},h("hr",{className:"rule"}),h("h2",{style:{marginTop:14}},c.glance.heading),
 h("div",{className:"stack"},c.programs.map((p,k)=>h("div",{className:"scard",key:p.id,style:{"--i":k}},h("span",{className:"k"},p.n+" · "+p.short),h("h3",null,p.name),h("p",null,h("b",null,"Best when: "),p.best),h("p",null,p.outcome)))),h("div",{className:"stack-spacer"}))}

function Finder({c}){
 const [step,setStep]=useState(0);const [score,setScore]=useState({bt:0,coo:0,sp:0});
 const pick=id=>{setScore(s=>({...s,[id]:s[id]+1}));setStep(step+1)};
 const reset=()=>{setStep(0);setScore({bt:0,coo:0,sp:0})};
 let body;
 if(step<QUIZ.length){const q=QUIZ[step];
  body=[h("p",{className:"step",key:"s"},"Question "+(step+1)+" of "+QUIZ.length),h("p",{className:"q",key:"q"},q.q),
   h("div",{className:"opts",key:"o"},q.a.map(([t,id])=>h("button",{key:t,className:"opt",onClick:()=>pick(id)},t)))];
 }else{const win=Object.keys(score).sort((a,b)=>score[b]-score[a])[0];const p=c.programs.find(x=>x.id===win)||c.programs[0];
  body=[h("div",{className:"result",key:"r"},h("p",{className:"step"},"Suggested starting point"),h("h3",null,p.name),h("p",null,p.tag),h("p",null,p.outcome)),
   h("div",{className:"cta",key:"c"},h(Magnet,{onClick:()=>nav("contact")},"Talk to "+c.contact.name.split(" ")[0]),h("button",{className:"btn ghost",onClick:reset},"Start again"))]}
 return h("section",{className:"finder",id:"finder"},h("div",{className:"wrap"},
  h("p",{className:"eyebrow"},"How to choose the right program"),h("h2",null,c.finder.heading),
  h("p",{className:"lede",style:{color:"inherit",opacity:.85}},c.finder.text),h("div",{className:"box"},body)))}

/* 20 expandable */
function Engagements({c}){return h(Reveal,{as:"section",className:"wrap",id:"work"},h("hr",{className:"rule"}),h("p",{className:"eyebrow",style:{marginTop:14}},"In practice"),h("h2",null,c.heading),h("p",{className:"lede"},c.text),
 h("div",{className:"acc"},c.items.map((e,k)=>h("details",{key:k},h("summary",null,e.title),h("div",{className:"body"},h("div",null,h("b",null,"Situation"),e.situation),h("div",null,h("b",null,"What we did"),e.work),h("div",null,h("b",null,"Result"),e.result))))))}

/* 23 testimonials */
function Testimonials({c}){const [i,setI]=useState(0);const n=c.items.length;
 useEffect(()=>{if(n<2||reduced())return;const t=setInterval(()=>setI(x=>(x+1)%n),4500);return()=>clearInterval(t)},[n]);
 if(!n)return null;
 return h("section",{className:"testi"},h("div",{className:"wrap"},h("hr",{className:"rule"}),h("h2",{style:{marginTop:14}},c.heading),
  h("div",{className:"slide"},c.items.map((t,k)=>h("blockquote",{key:k,className:"quote"+(k===i?" on":""),style:{margin:0}},h("p",null,"“"+t.quote+"”"),h("small",null,t.name+(t.role?", "+t.role:""))))),
  n>1&&h("div",{className:"dots"},c.items.map((_,k)=>h("button",{key:k,className:k===i?"on":"","aria-label":"Testimonial "+(k+1),onClick:()=>setI(k)})))))}

function Contact({c,db,uid}){
 const [copied,setCopied]=useState(false);const [state,setState]=useState({});
 const copy=()=>{navigator.clipboard.writeText(c.contact.phone.replace(/\s/g,"")).then(()=>setCopied(true)).catch(()=>{const r=document.createRange();r.selectNodeContents(document.getElementById("ph"));getSelection().removeAllRanges();getSelection().addRange(r)})};
 const submit=async e=>{e.preventDefault();const f=new FormData(e.target);
  const item={name:f.get("name"),business:f.get("biz"),program:f.get("prog"),message:f.get("msg"),at:new Date().toISOString()};
  if(!db||!uid){setState({fail:"Could not save online. Please WhatsApp or call the number alongside."});return}
  setState({busy:true});
  try{const ref=db.doc("enquiries/"+uid);const snap=await ref.get();const items=(snap.exists&&snap.data().items)||[];
   await ref.set({items:[...items,item].slice(-20),updatedAt:item.at});setState({sent:item.name})}
  catch(err){setState({fail:"Could not save online. Please WhatsApp or call the number alongside."})}};
 return h(Reveal,{as:"section",className:"wrap contact",id:"contact"},
  h("hr",{className:"rule"}),h("p",{className:"eyebrow",style:{marginTop:14}},c.contact.eyebrow),
  h("h2",null,c.contact.heading),h("p",{className:"lede"},c.contact.text),
  h("div",{className:"card"},
   h("div",{className:"cleft"},h("div",{className:"chead"},h("div",{className:"mono","aria-hidden":true},c.contact.name.charAt(0)),h("div",null,h("p",{className:"name"},c.contact.name),h("p",{style:{color:"var(--muted)"}},c.contact.title))),
    h("div",{className:"phone"},h("code",{id:"ph"},c.contact.phone),h("button",{className:"mini",onClick:copy},copied?"Copied":"Copy number"),
     h("a",{className:"mini",href:"https://wa.me/"+c.contact.whatsapp,target:"_blank",rel:"noopener"},"WhatsApp")),
    c.privacy&&h("a",{className:"mail",href:"mailto:"+c.privacy.email},c.privacy.email),
    h("div",{className:"nextsteps"},h("p",{className:"eyebrow"},"What happens next"),
     h("ol",null,["You share a few details about your business","Anuj calls you back for an initial conversation","Together you agree the right starting point"].map((t,k)=>h("li",{key:k},t)))),
    h("p",{className:"slogan"},c.contact.slogan)),
   h("div",null,state.sent?h("div",{className:"ok"},"Thanks, "+state.sent+". Your enquiry has reached "+c.contact.name+"."):
    h("form",{onSubmit:submit},
     h("label",{htmlFor:"name"},"Your name"),h("input",{id:"name",name:"name",required:true}),
     h("label",{htmlFor:"biz"},"Business and location"),h("input",{id:"biz",name:"biz"}),
     h("label",{htmlFor:"prog"},"Program of interest"),h("select",{id:"prog",name:"prog"},c.programs.map(p=>h("option",{key:p.id},p.name)),h("option",null,"Not sure yet")),
     h("label",{htmlFor:"msg"},"What's on your mind"),h("textarea",{id:"msg",name:"msg",rows:3}),
     h("button",{className:"btn",type:"submit",disabled:!!state.busy},state.busy?"Sending…":"Send enquiry"),
     state.fail&&h("p",{className:"err"},state.fail)))))}

export const ROUTES=[["","Home"],["about","About us"],["how","How we work"],["programs","Programs"],["sectors","Sectors & work"],["finder","Find your program"],["contact","Contact"]];

function Hero({c}){useParallax();
 return h("div",{className:"hero",id:"top"},h(Particles),
  h("div",{className:"float a","data-px":"-0.12"}),h("div",{className:"float b","data-px":"0.18"}),h("div",{className:"float c","data-px":"-0.3"}),
  h("div",{className:"wrap hgrid"},h("div",{className:"hcopy"},h("p",{className:"eyebrow"},c.hero.eyebrow),h(Headline,{lead:c.hero.lead,words:c.hero.words,tail:c.hero.tail}),h("p",null,c.hero.text),
   h("div",{className:"cta"},h(Magnet,{onClick:()=>nav("programs")},"See the programs"),h(Magnet,{className:"ghost",onClick:()=>nav("finder")},"Which one fits me?"))),
   h(HeroVisual,{c})))}
/* desktop hero visual: an animated "organisation building up" card */
function HeroVisual({c}){const rows=["Structure & roles","Processes & SOPs","KPIs & reviews","Governance","Growth readiness"];
 return h("div",{className:"hvis","aria-hidden":true},
  h("div",{className:"hcard"},
   h("div",{className:"hhead"},h("span",{className:"dot o"}),h("span",{className:"dot w"}),h("span",{className:"dot g"}),h("b",null,"Business reimagined")),
   h("div",{className:"bars"},[38,52,46,64,72,86].map((v,k)=>h("i",{key:k,style:{"--v":v+"%","--i":k}}))),
   h("ul",{className:"meters"},rows.map((t,k)=>h("li",{key:k,style:{"--i":k}},h("span",null,t),h("em",null,h("i",null)))))),
  h("div",{className:"chip c1"},"Owner-independent"),h("div",{className:"chip c2"},"Scalable"),h("div",{className:"chip c3"},c.stats[0].value+(c.stats[0].suffix||"")+" yrs experience"))}

function PageHead({eyebrow,heading,text}){return h("div",{className:"phead"},h("div",{className:"wrap"},h("p",{className:"eyebrow"},eyebrow),h("h1",null,heading),text&&h("p",{className:"lede"},text)))}
function Next({to,label}){return h("div",{className:"wrap next"},h("button",{className:"btn",onClick:()=>nav(to)},label+" →"))}

const PAGES={
 "":({c})=>h(React.Fragment,null,h(Hero,{c}),h(Stats,{items:c.stats}),h(Marquee,{items:c.marquee}),
   h(Reveal,{as:"section",className:"wrap",id:"challenge"},h("hr",{className:"rule"}),h("p",{className:"eyebrow",style:{marginTop:14}},c.challenge.eyebrow),h("h2",null,c.challenge.heading),h("p",{className:"lede"},c.challenge.p1),h(BeforeAfter,{c:c.challenge})),
   h(Testimonials,{c:c.testimonials}),h(Next,{to:"how",label:"See how we work"})),
 how:({c})=>h(React.Fragment,null,h(PageHead,{eyebrow:c.story.eyebrow,heading:c.story.heading,text:c.story.text}),h(Story,{c:c.story}),h(Next,{to:"programs",label:"Explore the programs"})),
 programs:({c})=>h(React.Fragment,null,h(PageHead,{eyebrow:"Our three programs",heading:c.programsIntro.heading,text:c.programsIntro.text}),h(Programs,{c,bare:true}),h(Glance,{c}),h(Next,{to:"finder",label:"Which one fits me?"})),
 sectors:({c})=>h(React.Fragment,null,h(PageHead,{eyebrow:"Where we have operated",heading:c.sectors.heading}),h(Sectors,{c:c.sectors}),h(Engagements,{c:c.engagements}),h(Next,{to:"contact",label:"Talk to us"})),
 finder:({c})=>h(React.Fragment,null,h(Finder,{c}),h(Next,{to:"contact",label:"Talk to us"})),
 contact:({c,db,uid})=>h(Contact,{c,db,uid}),
 about:({c})=>h(React.Fragment,null,h(PageHead,{eyebrow:c.about.eyebrow,heading:c.about.heading}),
   h(Reveal,{as:"section",className:"wrap about"},h("hr",{className:"rule"}),
    h("div",{className:"about-grid"},
     h("div",{className:"prose"},c.about.paras.map((t,k)=>h("p",{key:k,className:k===0?"big":""},t))),
     h("aside",{className:"pillars","aria-label":"What works together"},h("p",{className:"eyebrow"},"Working together, seamlessly"),
      h("ul",null,c.about.pillars.map((t,k)=>h("li",{key:k,style:{"--i":k}},h("span",null,String(k+1).padStart(2,"0")),t)))))),
   c.about.founder&&(f=>h(Reveal,{as:"section",className:"wrap founder"},h("hr",{className:"rule"}),h("p",{className:"eyebrow",style:{marginTop:14}},f.eyebrow),
    h("div",{className:"fcard"},
     h("div",{className:"fside"},h("div",{className:"mono","aria-hidden":true},f.name.charAt(0)),h("h2",null,f.name),h("p",{className:"role"},f.role),
      h("ul",{className:"creds"},f.creds.map((t,k)=>h("li",{key:k},t)))),
     h("div",{className:"prose"},f.paras.map((t,k)=>h("p",{key:k,className:k===f.paras.length-1?"obj":""},t)),h("p",{className:"slogan"},f.slogan)))))(c.about.founder),
   h(Next,{to:"contact",label:"Talk to "+c.about.founder.name})),
 privacy:({c})=>{const p=c.privacy;return h(React.Fragment,null,h(PageHead,{eyebrow:"Solutions India",heading:p.heading,text:p.updated}),
   h("section",{className:"wrap legal"},h("article",{className:"prose"},
    p.intro.map((t,k)=>h("p",{key:"i"+k},t)),
    h("p",null,h("b",null,p.usesTitle)),h("ul",null,p.uses.map((t,k)=>h("li",{key:k},t))),
    p.rest.map((t,k)=>h("p",{key:"r"+k},t)),
    h("p",null,p.contact+" ",h("a",{href:"mailto:"+p.email},p.email),"."),
    h("p",{className:"closing"},p.closing))))}};

export function Site({c,db,uid,route}){
 const [open,setOpen]=useState(false);const [top,setTop]=useState(false);const [sc,setSc]=useState(false);const [bar,setBar]=useState(false);
 const Page=PAGES[route]||PAGES[""];
 useEffect(()=>{document.body.classList.toggle("noscroll",open);return()=>document.body.classList.remove("noscroll")},[open]);
 useEffect(()=>{const f=()=>{setTop(scrollY>600);setSc(scrollY>12);setBar(scrollY>320)};f();addEventListener("scroll",f,{passive:true});return()=>removeEventListener("scroll",f)},[]);
 useEffect(()=>{const f=e=>{if(e.key==="Escape")setOpen(false)};addEventListener("keydown",f);return()=>removeEventListener("keydown",f)},[]);
 /* staggered scroll-in for cards and list items (mobile + desktop) */
 useEffect(()=>{if(reduced()||!("IntersectionObserver" in window))return;let ob;const t=setTimeout(()=>{
  const els=[...document.querySelectorAll("main .focus li, main .scard, main .sector, main .acc details, main .creds li, main .two>div, main .stat, main .fcard .prose p, main .legal .prose>*, main .tstep h3")];
  ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");ob.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  els.forEach((el,k)=>{if(el.getBoundingClientRect().top<innerHeight*.9)return;el.classList.add("sv");ob.observe(el)})},60);
  return()=>{clearTimeout(t);ob&&ob.disconnect()}},[route]);
 const go2=r=>{setOpen(false);nav(r)};
 const links=ROUTES.map(([r,t],k)=>h("button",{key:r,className:route===r?"on":"","aria-current":route===r?"page":undefined,style:{"--i":k},onClick:()=>go2(r)},h("span",{className:"dn"},String(k+1).padStart(2,"0")),t));
 return h(React.Fragment,null,
  h("header",{className:sc?"sc":""},h("div",{className:"wrap"},h("button",{className:"logo","aria-label":"Solutions India home",onClick:()=>{setOpen(false);nav("")}},h(Logo)),
   h("nav",{className:"desk","aria-label":"Main"},links),
   h("button",{className:"burger","aria-label":open?"Close menu":"Open menu","aria-expanded":open,"aria-controls":"drawer",onClick:()=>setOpen(o=>!o)},h("span",{className:open?"x":""})))),
  h("div",{className:"scrim"+(open?" on":""),onClick:()=>setOpen(false),"aria-hidden":true}),
  h("nav",{id:"drawer",className:"drawer"+(open?" on":""),"aria-label":"Main menu","aria-hidden":!open},
   h("div",{className:"dhead"},h("span",{className:"eyebrow"},"Menu"),h("button",{className:"close","aria-label":"Close menu",onClick:()=>setOpen(false)},"✕")),
   links,h("div",{className:"dfoot"},h("p",{className:"eyebrow"},"Talk to "+c.contact.name.split(" ")[0]),
    h("div",{className:"dacts"},h("a",{className:"btn",href:"tel:"+c.contact.phone.replace(/\s/g,"")},"Call"),h("a",{className:"btn wa",href:"https://wa.me/"+c.contact.whatsapp,target:"_blank",rel:"noopener"},"WhatsApp")),
    h("code",null,c.contact.phone))),
  h("main",{className:"page",key:route},h(Page,{c,db,uid})),
  h("footer",null,h("div",{className:"wrap fgrid"},
    h("div",{className:"fbrand"},h("button",{className:"logo","aria-label":"Solutions India home",onClick:()=>nav("")},h(Logo)),h("p",null,c.contact.slogan)),
    h("div",null,h("p",{className:"fh"},"Explore"),h("ul",null,ROUTES.map(([r,t])=>h("li",{key:r},h("button",{onClick:()=>nav(r)},t))))),
    h("div",null,h("p",{className:"fh"},"Programs"),h("ul",null,c.programs.map(p=>h("li",{key:p.id},h("button",{onClick:()=>nav("programs")},p.name))))),
    h("div",null,h("p",{className:"fh"},"Get in touch"),h("ul",null,
     h("li",null,h("a",{href:"tel:"+c.contact.phone.replace(/\s/g,"")},c.contact.phone)),
     h("li",null,h("a",{href:"https://wa.me/"+c.contact.whatsapp,target:"_blank",rel:"noopener"},"WhatsApp")),
     c.privacy&&h("li",null,h("a",{href:"mailto:"+c.privacy.email},c.privacy.email))))),
   h("div",{className:"wrap fbottom"},h("span",null,c.footer.text),h("span",{className:"flinks"},h("button",{onClick:()=>nav("privacy")},"Privacy Policy"),h("button",{onClick:()=>nav("admin")},"Admin")))),
  h("div",{className:"mbar"+(bar&&!open&&route!=="contact"?" on":""),role:"region","aria-label":"Quick contact"},
   h("a",{href:"tel:"+c.contact.phone.replace(/\s/g,"")},h("i",{className:"ic call","aria-hidden":true}),"Call"),
   h("a",{href:"https://wa.me/"+c.contact.whatsapp,target:"_blank",rel:"noopener"},h("i",{className:"ic wa","aria-hidden":true}),"WhatsApp"),
   h("button",{className:"pri",onClick:()=>nav("contact")},"Enquire now")),
  h("button",{className:"totop"+(top?" on":""),"aria-label":"Back to top",onClick:()=>scrollTo({top:0,behavior:reduced()?"auto":"smooth"})},"↑"))}
