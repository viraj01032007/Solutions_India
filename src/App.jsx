import React,{useState,useEffect,useRef} from 'react';
const h=React.createElement;
import {DEFAULT} from './content.js';
import {merge,Site} from './site.jsx';
import {Login,Admin} from './admin.jsx';
import {getDb,getUser} from './store.js';
/* ---------- root ---------- */
export default function App(){
 const [content,setContent]=useState(DEFAULT);const [db,setDb]=useState(null);const [uid,setUid]=useState(null);const [owner,setOwner]=useState(false);
 const route=()=>location.hash.replace(/^#\/?/,"").replace(/\/+$/,"");const [view,setView]=useState(route());const [authed,setAuthed]=useState(false);
 useEffect(()=>{const f=()=>setView(route());addEventListener("hashchange",f);return()=>removeEventListener("hashchange",f)},[]);
 useEffect(()=>{const bar=document.getElementById("prog");const f=()=>{const d=document.documentElement;const p=d.scrollHeight>innerHeight?scrollY/(d.scrollHeight-innerHeight):0;bar.style.transform="scaleX("+p+")"};f();addEventListener("scroll",f,{passive:true});return()=>removeEventListener("scroll",f)},[view]);
 useEffect(()=>{let un=null;(async()=>{const d=getDb();const u=getUser();
  if(u){setUid(await u.id());setOwner(await u.isOwner())}
  if(!d)return;setDb(d);un=d.doc("content/site").onSnapshot(s=>{if(s.exists)setContent(merge(DEFAULT,s.data()))},()=>{})})();return()=>un&&un()},[]);
 useEffect(()=>{scrollTo(0,0)},[view]);
 if(view==="admin")return authed?h(Admin,{content,db,isOwner:owner}):h("div",{className:"wrap admin page"},h("p",{className:"eyebrow"},"Solutions India"),h("h1",null,"Admin sign-in"),h(Login,{auth:content.auth,onOk:()=>setAuthed(true)}));
 return h(Site,{c:content,db,uid,route:view})}
