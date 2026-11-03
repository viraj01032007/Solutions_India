// Storage layer. This version keeps everything in the browser's localStorage,
// so admin edits and enquiries are visible only on the device where they were made.
// To go live across devices, replace these two functions with a backend
// (Firebase/Supabase/your API) that offers the same small surface:
//   db.doc(path).get()/set(data)/onSnapshot(cb)   db.collection(path).onSnapshot(cb)
//   user.id() -> Promise<string>   user.isOwner() -> Promise<boolean>
const KEY="solutions-india:";
const listeners=new Set();
const read=p=>{try{const v=localStorage.getItem(KEY+p);return v?JSON.parse(v):null}catch{return null}};
const write=(p,v)=>{try{localStorage.setItem(KEY+p,JSON.stringify(v))}catch{}listeners.forEach(f=>f(p))};
const snap=(p,data)=>({id:p.split("/").pop(),exists:data!==null,data:()=>data??undefined,metadata:{fromCache:false,hasPendingWrites:false}});
function doc(p){return{
 async get(){return snap(p,read(p))},
 async set(data){write(p,data)},
 async delete(){localStorage.removeItem(KEY+p);listeners.forEach(f=>f(p))},
 onSnapshot(next){const f=q=>{if(q===p)next(snap(p,read(p)))};listeners.add(f);next(snap(p,read(p)));return()=>listeners.delete(f)}}}
function collection(c){
 const docs=()=>Object.keys(localStorage).filter(k=>k.startsWith(KEY+c+"/")).map(k=>{const p=k.slice(KEY.length);return snap(p,read(p))});
 return{doc:id=>doc(c+"/"+(id||Math.random().toString(36).slice(2))),
  onSnapshot(next){const emit=()=>{const d=docs();next({docs:d,size:d.length,empty:!d.length})};const f=q=>{if(q.startsWith(c+"/"))emit()};listeners.add(f);emit();return()=>listeners.delete(f)}}}
export function getDb(){return{doc,collection}}
export function getUser(){let id=read("uid");if(!id){id="u_"+Math.random().toString(36).slice(2,12);write("uid",id)}return{id:async()=>id,isOwner:async()=>true}}
