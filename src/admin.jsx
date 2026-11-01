import React,{useState,useEffect,useRef} from 'react';
const h=React.createElement;
import {LABELS} from './content.js';
import {deep,setPath,sha256} from './site.jsx';
/* ---------- admin ---------- */
export function Login({auth,onOk}){
 const [stage,setStage]=useState(1);const [err,setErr]=useState("");const [busy,setBusy]=useState(false);
 const sub=async e=>{e.preventDefault();setBusy(true);setErr("");const v=String(new FormData(e.target).get("v")).trim();
  if(stage===1){if(await sha256(v)===auth.passwordHash)setStage(2);else setErr("Wrong password.")}
  else{if(await sha256(v)===auth.pinHash)onOk();else setErr("Wrong PIN.")}
  setBusy(false)};
 return h("form",{className:"login",onSubmit:sub},
  h("p",{className:"eyebrow"},"Step "+stage+" of 2"),
  h("label",{htmlFor:"v"},stage===1?"Password":"Security PIN"),
  h("input",{id:"v",name:"v",type:"password",inputMode:stage===1?"text":"numeric",autoComplete:stage===1?"current-password":"one-time-code",className:stage===2?"otp":"",required:true,autoFocus:true,key:stage}),
  h("button",{className:"btn",disabled:busy},stage===1?"Continue":"Open admin"),
  err&&h("p",{className:"err"},err),
  h("button",{type:"button",className:"btn outline",onClick:()=>{location.hash="#/"}},"Back to site"))}
function Fields({obj,path,onChange}){
 const out=[];
 for(const k in obj){const v=obj[k],p=[...path,k],id="f_"+p.join("_"),label=p.length===1?LABELS[k]||k:k;
  if(Array.isArray(v)&&v.every(x=>typeof x==="string"))out.push(h("div",{className:"fld",key:id},h("label",{htmlFor:id},k+" (one per line)"),h("textarea",{id,rows:Math.min(10,v.length+1),value:v.join("\n"),onChange:e=>onChange(p,e.target.value.split("\n"))})));
  else if(v&&typeof v==="object")out.push(h("div",{className:"fgrp",key:id},h("p",{className:"eyebrow"},Array.isArray(obj)?(v.name||v.title||v.label||"#"+(Number(k)+1)):label),h(Fields,{obj:v,path:p,onChange})));
  else if(typeof v==="number")out.push(h("div",{className:"fld",key:id},h("label",{htmlFor:id},k),h("input",{id,type:"number",value:v,onChange:e=>onChange(p,Number(e.target.value))})));
  else{const long=String(v).length>70;out.push(h("div",{className:"fld",key:id},h("label",{htmlFor:id},k),long?h("textarea",{id,rows:3,value:v,onChange:e=>onChange(p,e.target.value)}):h("input",{id,value:v,onChange:e=>onChange(p,e.target.value)})))}}
 return h(React.Fragment,null,out)}
export function Admin({content,db,isOwner}){
 const [draft,setDraft]=useState(()=>deep(content));const [dirty,setDirty]=useState(false);const [msg,setMsg]=useState("");
 const [enq,setEnq]=useState(null);const [pw,setPw]=useState("");const [pin,setPin]=useState("");
 useEffect(()=>{if(!db)return;const un=db.collection("enquiries").onSnapshot(s=>{const rows=[];s.docs.forEach(d=>(d.data().items||[]).forEach(it=>rows.push({...it,from:d.id})));rows.sort((a,b)=>b.at.localeCompare(a.at));setEnq(rows)},()=>setEnq([]));
  const t=setTimeout(()=>setEnq(e=>e===null?[]:e),10000);return()=>{un();clearTimeout(t)}},[db]);
 const change=(p,v)=>{setDraft(d=>setPath(d,p,v));setDirty(true)};
 const addTesti=()=>change(["testimonials","items"],[...draft.testimonials.items,{quote:"",name:"",role:""}]);
 const save=async()=>{if(!db){setMsg("Not connected to the store.");return}let d=draft;
  if(pw)d=setPath(d,["auth","passwordHash"],await sha256(pw));
  if(pin)d=setPath(d,["auth","pinHash"],await sha256(pin));
  try{await db.doc("content/site").set(d);setDirty(false);setPw("");setPin("");setMsg("Saved. The site now shows these words and numbers.")}
  catch(e){setMsg("Save refused. Only the artifact owner can change the site; sign in as the owner.")}};
 const {auth,...editable}=draft;
 return h("div",{className:"wrap admin page"},
  h("p",{className:"eyebrow"},"Solutions India"),h("h1",null,"Admin panel"),
  !isOwner&&h("p",{className:"err",style:{marginTop:8}},"You are signed in but not as the site owner, so saves will be refused."),
  h("div",{className:"acols"},
   h("div",{className:"abox"},h("h2",null,"Enquiries ",enq&&h("span",{className:"pill"},enq.length)),
    enq===null?h("p",{style:{color:"var(--muted)"}},"Loading…"):enq.length===0?h("p",{style:{color:"var(--muted)"}},"No enquiries yet."):
    enq.map((e,k)=>h("div",{className:"enq",key:k},h("b",null,e.name),h("small",null,new Date(e.at).toLocaleString("en-IN")+" · "+(e.business||"—")+" · "+e.program),h("p",null,e.message||"(no message)")))),
   h("div",null,h("div",{className:"abox"},h("h2",null,"Words and numbers"),h(Fields,{obj:editable,path:[],onChange:change}),
     h("button",{className:"btn outline",type:"button",onClick:addTesti,style:{marginTop:4}},"+ Add testimonial"),
     h("div",{className:"fgrp"},h("p",{className:"eyebrow"},"Admin login"),
      h("div",{className:"fld"},h("label",{htmlFor:"npw"},"New password (leave blank to keep)"),h("input",{id:"npw",type:"password",value:pw,onChange:e=>{setPw(e.target.value);setDirty(true)}})),
      h("div",{className:"fld"},h("label",{htmlFor:"npin"},"New security PIN (leave blank to keep)"),h("input",{id:"npin",type:"password",inputMode:"numeric",value:pin,onChange:e=>{setPin(e.target.value);setDirty(true)}})))),
    h("div",{className:"save"},h("button",{className:"btn",onClick:save,disabled:!dirty},"Save changes"),
     h("button",{className:"btn outline",onClick:()=>{setDraft(deep(content));setDirty(false);setMsg("")}},"Discard"),
     h("button",{className:"btn outline",onClick:()=>{location.hash="#/"}},"View site"),msg&&h("span",{style:{fontSize:".9rem"}},msg)))))}
