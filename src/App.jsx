import{useState,useEffect,useCallback}from"react";
import{createClient}from"@supabase/supabase-js";
const SUPABASE_URL="https://joyetabwblbothefyzzu.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveWV0YWJ3Ymxib3RoZWZ5enp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzM5MzksImV4cCI6MjA5MzMwOTkzOX0.SfgEGpdjfdWwOEIS8ccxH3eRdJAgo23CA797-9V7Puk";
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const fmt=n=>"£"+(Math.round(parseFloat(n||0)*100)/100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");
const r2=n=>Math.round(parseFloat(n||0)*100)/100;
const pct=(a,b)=>b>0?Math.round((a/b)*100):0;
const today=()=>new Date().toISOString().slice(0,10);
const getSaleDate=i=>i.sold_at||null;
const dowKey=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const TRADING_ALLOWANCE=1000;
const PERSONAL_ALLOWANCE=12570;
const C={bg:"#0C0F1D",card:"#131929",card2:"#1a2238",border:"rgba(255,255,255,0.07)",border2:"rgba(255,255,255,0.13)",accent:"#6366F1",accentL:"rgba(99,102,241,0.12)",accentB:"rgba(99,102,241,0.3)",gold:"#F59E0B",goldL:"rgba(245,158,11,0.12)",green:"#10B981",greenL:"rgba(16,185,129,0.12)",red:"#EF4444",redL:"rgba(239,68,68,0.1)",purple:"#8B5CF6",blue:"#3B82F6",teal:"#14B8A6",text:"#F1F5F9",text2:"rgba(255,255,255,0.5)",text3:"rgba(255,255,255,0.28)"};
const DI={width:"100%",padding:"11px 14px",border:`1.5px solid ${C.border2}`,borderRadius:10,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",background:"rgba(255,255,255,0.05)",color:C.text,transition:"border-color 0.15s"};
const LS={fontSize:11,fontWeight:700,color:C.text3,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:"0.08em"};
const GR=`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',system-ui,sans-serif;background:#0C0F1D;color:#F1F5F9;min-height:100vh}input:focus,select:focus{border-color:#6366F1!important;outline:none;background:rgba(255,255,255,0.07)!important}input::placeholder{color:rgba(255,255,255,0.28)}select option{background:#1e2a3a;color:#F1F5F9}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes slideIn{from{transform:translateX(-240px)}to{transform:translateX(0)}}@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}.fade{animation:fadeUp 0.2s ease forwards}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:11px 14px;white-space:nowrap}tbody tr:hover{background:rgba(99,102,241,0.04);cursor:pointer}@media(max-width:768px){.desk{display:none!important}}@media(min-width:769px){.mob{display:none!important}}`;
const Spin=()=><div style={{display:"flex",justifyContent:"center",padding:"60px 0"}}><div style={{width:26,height:26,border:`2px solid ${C.accentL}`,borderTop:`2px solid ${C.accent}`,borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/></div>;
const Card=({ch,style={}})=><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px",...style}}>{ch}</div>;
const Divider=()=><div style={{height:1,background:C.border,margin:"12px 0"}}/>;
const Btn=({ch,onClick,variant="primary",disabled=false,full=false,small=false,style={}})=>{
  const base={border:"none",borderRadius:9,padding:small?"7px 14px":"11px 20px",fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",opacity:disabled?0.5:1,transition:"opacity 0.15s",width:full?"100%":"auto",...style};
  const v={primary:{...base,background:C.accent,color:"#fff"},ghost:{...base,background:"rgba(255,255,255,0.06)",color:C.text2,border:`1px solid ${C.border}`},danger:{...base,background:C.redL,color:C.red,border:"1px solid rgba(239,68,68,0.25)"},success:{...base,background:C.greenL,color:C.green,border:"1px solid rgba(16,185,129,0.25)"}};
  return<button onClick={onClick} disabled={disabled} style={v[variant]||v.primary}>{ch}</button>;
};
const Msg=({ok,ch})=><div style={{background:ok?C.greenL:C.redL,border:`1px solid ${ok?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.25)"}`,borderRadius:10,padding:"10px 14px",fontSize:13,marginTop:8,color:ok?C.green:C.red}}>{ch}</div>;
const AlertBox=({type="info",ch,onClose})=>{
  const t={info:{bg:C.accentL,bd:C.accentB,c:C.accent,ic:"ℹ️"},warning:{bg:C.goldL,bd:"rgba(245,158,11,0.3)",c:C.gold,ic:"⚠️"},danger:{bg:C.redL,bd:"rgba(239,68,68,0.25)",c:C.red,ic:"🚨"},success:{bg:C.greenL,bd:"rgba(16,185,129,0.25)",c:C.green,ic:"✅"}};
  const s=t[type]||t.info;
  return<div style={{background:s.bg,border:`1px solid ${s.bd}`,borderRadius:10,padding:"11px 14px",display:"flex",alignItems:"flex-start",gap:10,animation:"slideDown 0.2s ease",marginBottom:8}}>
    <span style={{flexShrink:0}}>{s.ic}</span><span style={{fontSize:13,color:s.c,flex:1,lineHeight:1.5}}>{ch}</span>
    {onClose&&<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:s.c,fontSize:16,padding:0,lineHeight:1,flexShrink:0}}>×</button>}
  </div>;
};
const Modal=({title,onClose,ch})=><><div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:299,backdropFilter:"blur(4px)"}}/>
  <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"92%",maxWidth:440,background:C.card,border:`1px solid ${C.border2}`,borderRadius:18,padding:"26px 22px",zIndex:300,maxHeight:"88vh",overflowY:"auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <h2 style={{fontSize:17,fontWeight:700,color:C.text}}>{title}</h2>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.text2,fontSize:22,lineHeight:1}}>×</button>
    </div>{ch}
  </div></>;
const PageHdr=({title,sub,action})=><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
  <div>{sub&&<div style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:6}}>{sub}</div>}<h1 style={{fontSize:"clamp(20px,3vw,28px)",fontWeight:800,color:C.text,letterSpacing:"-0.02em"}}>{title}</h1></div>{action}
</div>;
const Input=({label,req,...p})=><div><label style={LS}>{label}{req&&<span style={{color:C.red}}> *</span>}</label><input style={DI} {...p}/></div>;
const Sel=({label,req,ch,...p})=><div><label style={LS}>{label}{req&&<span style={{color:C.red}}> *</span>}</label><select style={{...DI,cursor:"pointer",paddingRight:30,appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='rgba(255,255,255,0.35)' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"}} {...p}>{ch}</select></div>;
const StatCard=({icon,label,value,sub,color=C.accent,onClick})=><div onClick={onClick} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px",position:"relative",overflow:"hidden",cursor:onClick?"pointer":"default"}}>
  <div style={{position:"absolute",top:-10,right:-10,width:56,height:56,background:`${color}10`,borderRadius:"50%"}}/>
  <div style={{fontSize:20,marginBottom:8}}>{icon}</div>
  <div style={{fontSize:"clamp(16px,2.5vw,24px)",fontWeight:800,color,lineHeight:1,marginBottom:4}}>{value}</div>
  <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",lineHeight:1.3}}>{label}</div>
  {sub&&<div style={{fontSize:11,color:C.text2,marginTop:4}}>{sub}</div>}
</div>;
const BarChart=({data,color=C.accent,h=90})=>{
  const max=Math.max(...data.map(d=>d.v),1);
  return<div style={{display:"flex",alignItems:"flex-end",gap:3,height:h,overflowX:"auto",paddingBottom:6}}>
    {data.map((d,i)=>{const ht=Math.max((d.v/max)*(h-18),d.v>0?3:0);return<div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:24,flex:1}}>
      {d.v>0&&<div style={{fontSize:8,color:C.text3,whiteSpace:"nowrap"}}>{d.fmt||d.v}</div>}
      <div style={{width:"100%",borderRadius:"3px 3px 0 0",height:`${ht}px`,background:d.hi?color:`${color}44`,transition:"height 0.4s"}}/>
      <div style={{fontSize:8,color:d.hi?color:C.text3,fontWeight:d.hi?700:400,whiteSpace:"nowrap"}}>{d.l}</div>
    </div>;})}
  </div>;
};
const HBar=({label,value,max,color=C.accent,display})=><div style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0"}}>
  <div style={{fontSize:12,color:C.text2,minWidth:44,textAlign:"right"}}>{label}</div>
  <div style={{flex:1,height:7,background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${max>0?Math.min((value/max)*100,100):0}%`,background:`linear-gradient(90deg,${color}66,${color})`,borderRadius:4,transition:"width 0.5s"}}/>
  </div>
  <div style={{fontSize:12,fontWeight:700,color,minWidth:64,textAlign:"right"}}>{display||value}</div>
</div>;
function useAlerts(inv,exp,bizId){
  const[alerts,setAlerts]=useState([]);
  useEffect(()=>{
    if(!bizId)return;const now=new Date();const list=[];
    const yr=now.getMonth()>=3?now.getFullYear():now.getFullYear()-1;
    const taxEnd=new Date(`${yr+1}-04-05`);const daysLeft=Math.ceil((taxEnd-now)/86400000);
    if(daysLeft>0&&daysLeft<=60)list.push({id:"taxend",type:"warning",msg:`Tax year ends in ${daysLeft} days (5 April ${yr+1}). Make sure your records are complete.`});
    const txStart=new Date(`${yr}-04-06`);
    const revenue=inv.filter(i=>i.sold&&getSaleDate(i)&&new Date(getSaleDate(i))>=txStart).reduce((s,i)=>s+(i.sold_price||i.price),0);
    if(revenue>PERSONAL_ALLOWANCE)list.push({id:"selfemploy",type:"danger",msg:`Trading income this tax year is ${fmt(revenue)} — above the £${PERSONAL_ALLOWANCE.toLocaleString()} personal allowance. You must register for Self Assessment with HMRC.`});
    else if(revenue>TRADING_ALLOWANCE)list.push({id:"trading",type:"warning",msg:`Trading income is ${fmt(revenue)}. You have exceeded the £1,000 trading allowance — track expenses carefully.`});
    exp.filter(e=>e.due_date).forEach(e=>{
      const days=Math.ceil((new Date(e.due_date)-now)/86400000);
      if(days>=0&&days<=14)list.push({id:`bill-${e.id}`,type:days<=3?"danger":"warning",msg:`Bill due ${days===0?"today":days===1?"tomorrow":`in ${days} days`}: "${e.description}" — ${fmt(e.amount)}`});
    });
    setAlerts(list);
  },[inv,exp,bizId]);
  return[alerts,id=>setAlerts(a=>a.filter(x=>x.id!==id))];
}
const NAV=[
  {id:"dashboard",icon:"⊞",label:"Dashboard",group:"MAIN"},
  {id:"quick",icon:"⚡",label:"Quick Sale",group:"MAIN"},
  {id:"inventory",icon:"📦",label:"Inventory",group:"STOCK"},
  {id:"add",icon:"➕",label:"Add Stock",group:"STOCK"},
  {id:"edit",icon:"✏️",label:"Edit Stock",group:"STOCK"},
  {id:"comp",icon:"🔎",label:"Comp & Pricing",group:"TOOLS"},
  {id:"expenses",icon:"🧾",label:"Expenses",group:"TOOLS"},
  {id:"calendar",icon:"📅",label:"Calendar",group:"TOOLS"},
  {id:"analytics",icon:"📊",label:"Analytics",group:"INSIGHTS"},
  {id:"tax",icon:"💷",label:"Tax Summary",group:"INSIGHTS"},
  {id:"targets",icon:"🎯",label:"Targets",group:"INSIGHTS"},
  {id:"settings",icon:"⚙️",label:"Settings",group:"BOTTOM"},
];
export default function App(){
  const[sess,setSess]=useState(null);const[boot,setBoot]=useState(true);const[screen,setScreen]=useState("land");
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{setSess(data.session);if(data.session)setScreen("app");setBoot(false);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>{setSess(s);if(s)setScreen("app");else setScreen("land");});
    return()=>subscription.unsubscribe();
  },[]);
  if(boot)return<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:C.bg}}><Spin/></div>;
  return<><style>{GR}</style>
    {screen==="app"&&sess?<Shell onOut={()=>{supabase.auth.signOut();setScreen("land");}}/>:
     screen==="login"?<Auth mode="login" onBack={()=>setScreen("land")} onSwitch={()=>setScreen("signup")}/>:
     screen==="signup"?<Auth mode="signup" onBack={()=>setScreen("land")} onSwitch={()=>setScreen("login")}/>:
     <Landing onLogin={()=>setScreen("login")} onSignup={()=>setScreen("signup")}/>}
  </>;
}
function Landing({onLogin,onSignup}){
  const IMG="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=85";
  const features=[{icon:"📦",t:"Inventory Tracking",d:"Track every item from purchase to final sale with full cost and profit visibility"},{icon:"📊",t:"Business Analytics",d:"Real-time dashboards with revenue, profit, sell-through rate and trend analysis"},{icon:"🏢",t:"Multi-Business",d:"Run multiple reselling operations from one account — switch in seconds"},{icon:"💷",t:"Tax Intelligence",d:"Auto tax year tracking, HMRC threshold alerts, and one-click CSV export"},{icon:"🔔",t:"Smart Alerts",d:"Bills, tax deadlines, and allowance warnings before they become problems"},{icon:"🔎",t:"Comp & Pricing",d:"Instant eBay, Vinted and Depop search links to price accurately every time"}];
  return<div style={{minHeight:"100vh",background:C.bg}}>
    <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`url(${IMG})`,backgroundSize:"cover",backgroundPosition:"center",filter:"brightness(0.18)"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(12,15,29,0.2) 0%,rgba(12,15,29,0.75) 65%,rgba(12,15,29,1) 100%)"}}/>
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"0 24px",width:"100%",maxWidth:680}}>
        <div style={{display:"inline-block",background:C.accentL,border:`1px solid ${C.accentB}`,borderRadius:20,padding:"4px 16px",fontSize:11,fontWeight:700,color:C.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:24}}>Reseller Management Platform</div>
        <h1 style={{fontSize:"clamp(56px,11vw,108px)",fontWeight:900,color:C.text,letterSpacing:"-0.04em",lineHeight:0.88,marginBottom:18}}>SELLR<span style={{color:C.accent}}>BASE</span></h1>
        <p style={{fontSize:"clamp(15px,2vw,19px)",color:"rgba(255,255,255,0.55)",marginBottom:44,lineHeight:1.65,fontWeight:300}}>The complete platform for serious resellers.<br/>Track stock, know your profit, scale your business.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn ch="Get Started Free" onClick={onSignup} style={{padding:"14px 44px",fontSize:15,borderRadius:12}}/>
          <Btn ch="Sign In" onClick={onLogin} variant="ghost" style={{padding:"14px 32px",fontSize:15,borderRadius:12}}/>
        </div>
      </div>
      <div style={{position:"absolute",bottom:36,zIndex:1,display:"flex",gap:48,flexWrap:"wrap",justifyContent:"center",padding:"0 24px"}}>
        {[["Multi-Business","One account, multiple ops"],["Tax Alerts","HMRC threshold monitoring"],["Live Analytics","Real-time dashboards"]].map(([t,d])=><div key={t} style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{t}</div><div style={{fontSize:11,color:C.text3,marginTop:2}}>{d}</div></div>)}
      </div>
    </div>
    <div style={{padding:"72px 24px",maxWidth:960,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <h2 style={{fontSize:"clamp(22px,3.5vw,32px)",fontWeight:800,color:C.text,marginBottom:10}}>Everything your reselling business needs</h2>
        <p style={{fontSize:14,color:C.text2,maxWidth:460,margin:"0 auto",lineHeight:1.6}}>From your first listing to scaling across multiple businesses.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
        {features.map(f=><div key={f.t} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"22px 18px"}}><div style={{fontSize:26,marginBottom:12}}>{f.icon}</div><div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:6}}>{f.t}</div><div style={{fontSize:13,color:C.text2,lineHeight:1.6}}>{f.d}</div></div>)}
      </div>
    </div>
    <div style={{background:C.card,borderTop:`1px solid ${C.border}`,padding:"56px 24px",textAlign:"center"}}>
      <h2 style={{fontSize:"clamp(18px,3vw,26px)",fontWeight:800,color:C.text,marginBottom:10}}>Ready to take control of your reselling business?</h2>
      <p style={{fontSize:13,color:C.text2,marginBottom:24}}>Free to start. No credit card required.</p>
      <Btn ch="Get Started Free" onClick={onSignup} style={{padding:"14px 44px",fontSize:15,borderRadius:12}}/>
    </div>
  </div>;
}
function Auth({mode,onBack,onSwitch}){
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[name,setName]=useState("");
  const[busy,setBusy]=useState(false);const[err,setErr]=useState(null);const[done,setDone]=useState(false);
  const go=async()=>{
    setBusy(true);setErr(null);
    if(mode==="signup"){
      if(!name.trim()){setErr("Please enter your name.");setBusy(false);return;}
      const{error}=await supabase.auth.signUp({email,password:pass,options:{data:{full_name:name}}});
      if(error)setErr(error.message);else{await supabase.auth.signInWithPassword({email,password:pass});}
    }else{
      const{error}=await supabase.auth.signInWithPassword({email,password:pass});
      if(error)setErr("Invalid email or password.");
    }
    setBusy(false);
  };
  return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,backgroundImage:"url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1800&q=85)",backgroundSize:"cover",backgroundPosition:"center",filter:"brightness(0.15)"}}/>
    <div style={{position:"absolute",inset:0,background:"rgba(12,15,29,0.82)"}}/>
    <button onClick={onBack} style={{position:"absolute",top:20,left:20,zIndex:10,background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer",color:C.text2,fontFamily:"inherit"}}>← Back</button>
    <div style={{position:"relative",width:"100%",maxWidth:400,zIndex:1}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <h1 style={{fontSize:32,fontWeight:900,color:C.text,letterSpacing:"-0.03em"}}>SELLR<span style={{color:C.accent}}>BASE</span></h1>
        <p style={{fontSize:13,color:C.text2,marginTop:6}}>{mode==="login"?"Welcome back":"Create your free account"}</p>
      </div>
      <Card ch={<div style={{display:"flex",flexDirection:"column",gap:14}}>
          {mode==="signup"&&<Input label="Your Name" req placeholder="e.g. Tyler" value={name} onChange={e=>setName(e.target.value)}/>}
          <Input label="Email" req type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
          <Input label="Password" req type="password" placeholder={mode==="signup"?"Min 6 characters":"Password"} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
          {err&&<Msg ch={err}/>}
          <Btn ch={busy?mode==="login"?"Signing in…":"Creating…":mode==="login"?"Sign In":"Create Account"} onClick={go} disabled={busy||!email||!pass} full/>
          <div style={{textAlign:"center",fontSize:13,color:C.text2}}>
            {mode==="login"?"No account? ":"Have one? "}<button onClick={onSwitch} style={{background:"none",border:"none",cursor:"pointer",color:C.accent,fontWeight:600,fontFamily:"inherit",fontSize:13}}>{mode==="login"?"Sign up free":"Sign in"}</button>
          </div>
        </div>}/>
    </div>
  </div>;
}
function CreateBizForm({onDone,onOut,compact=false}){
  const[name,setName]=useState("");const[desc,setDesc]=useState("");const[busy,setBusy]=useState(false);const[err,setErr]=useState(null);
  const save=async()=>{
    if(!name.trim())return;setBusy(true);
    const{data:{user}}=await supabase.auth.getUser();
    const{error}=await supabase.from("businesses").insert([{name:name.trim(),description:desc.trim()||null,user_id:user.id,colour:C.accent}]);
    if(error)setErr(error.message);else{setName("");setDesc("");onDone();}
    setBusy(false);
  };
  return<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <Input label="Business Name" req placeholder="e.g. Tyler's Reselling" value={name} onChange={e=>setName(e.target.value)}/>
    {!compact&&<Input label="Description (optional)" placeholder="e.g. eBay & Vinted clothing" value={desc} onChange={e=>setDesc(e.target.value)}/>}
    {err&&<Msg ch={err}/>}
    <div style={{display:"flex",gap:10}}>
      <Btn ch={busy?"Creating…":"Create Business"} onClick={save} disabled={busy||!name.trim()} full/>
      {onOut&&<Btn ch="Sign Out" onClick={onOut} variant="ghost"/>}
    </div>
  </div>;
}
function Shell({onOut}){
  const[page,setPage]=useState("dashboard");const[bizList,setBizList]=useState([]);const[biz,setBiz]=useState(null);
  const[inv,setInv]=useState([]);const[exp,setExp]=useState([]);const[cal,setCal]=useState([]);const[tgts,setTgts]=useState([]);
  const[loading,setLoading]=useState(true);const[sideOpen,setSideOpen]=useState(false);const[showBizSwitcher,setShowBizSwitcher]=useState(false);
  const[editSku,setEditSku]=useState("");
  const[addForm,setAddForm]=useState({sku:"",title:"",cost:"",price:"",note:"",platform:"eBay",category:"Clothing",location:""});
  const[expForm,setExpForm]=useState({date:"",amount:"",description:"",category:"Stock",due_date:"",recurring:false});
  const[alerts,dismissAlert]=useAlerts(inv,exp,biz?.id);
  const loadBiz=useCallback(async()=>{
    const{data}=await supabase.from("businesses").select("*").order("created_at");
    if(data){setBizList(data);setBiz(b=>b?data.find(d=>d.id===b.id)||data[0]||null:data[0]||null);}
  },[]);
  const loadData=useCallback(async(id)=>{
    if(!id)return;setLoading(true);
    const[a,b,c,d]=await Promise.all([
      supabase.from("inventory").select("*").eq("business_id",id).order("created_at",{ascending:false}),
      supabase.from("expenses").select("*").eq("business_id",id).order("date",{ascending:false}),
      supabase.from("calendar_entries").select("*").eq("business_id",id),
      supabase.from("targets").select("*").eq("business_id",id),
    ]);
    setInv(a.data||[]);setExp(b.data||[]);setCal(c.data||[]);setTgts(d.data||[]);setLoading(false);
  },[]);
  useEffect(()=>{loadBiz();},[loadBiz]);
  useEffect(()=>{if(biz)loadData(biz.id);},[biz,loadData]);
  const reload=()=>{if(biz)loadData(biz.id);};
  const nav=p=>{setPage(p);setSideOpen(false);};
  const navEdit=sku=>{setEditSku(sku);nav("edit");};
  if(!loading&&!biz)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{textAlign:"center",maxWidth:440}}>
      <div style={{fontSize:48,marginBottom:16}}>🏢</div>
      <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:8}}>Create your first business</h2>
      <p style={{fontSize:13,color:C.text2,marginBottom:28,lineHeight:1.6}}>Set up a business to start tracking inventory, sales and expenses.</p>
      <CreateBizForm onDone={loadBiz} onOut={onOut}/>
    </div>
  </div>;
  const groups=["MAIN","STOCK","TOOLS","INSIGHTS"];
  const SidebarContent=()=><div style={{width:230,background:C.card,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0}}>
    <div style={{padding:"20px 16px 16px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{fontSize:18,fontWeight:900,color:C.text,letterSpacing:"-0.02em",marginBottom:12}}>SELLR<span style={{color:C.accent}}>BASE</span></div>
      <button onClick={()=>setShowBizSwitcher(true)} style={{width:"100%",background:C.card2,border:`1px solid ${C.border2}`,borderRadius:9,padding:"9px 12px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <div style={{overflow:"hidden"}}><div style={{fontSize:12,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{biz?.name||"Select"}</div><div style={{fontSize:10,color:C.text3,marginTop:1}}>{bizList.length} business{bizList.length!==1?"es":""}</div></div>
        <span style={{color:C.text3,fontSize:12,flexShrink:0}}>⇅</span>
      </button>
    </div>
    <nav style={{flex:1,padding:"8px 10px",overflowY:"auto"}}>
      {groups.map(g=>{const items=NAV.filter(n=>n.group===g);if(!items.length)return null;return<div key={g} style={{marginBottom:4}}>
        {g!=="MAIN"&&<div style={{fontSize:9,fontWeight:700,color:C.text3,letterSpacing:"0.12em",padding:"8px 10px 3px",textTransform:"uppercase"}}>{g}</div>}
        {items.map(item=>{const active=page===item.id;return<button key={item.id} onClick={()=>nav(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:9,background:active?C.accentL:"transparent",border:active?`1px solid ${C.accentB}`:"1px solid transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:1,transition:"all 0.12s"}}>
          <span style={{fontSize:15,width:18,textAlign:"center",flexShrink:0}}>{item.icon}</span>
          <span style={{fontSize:13,fontWeight:active?700:400,color:active?C.accent:C.text2}}>{item.label}</span>
        </button>;})}
      </div>;})}
    </nav>
    <div style={{padding:"10px 10px 16px",borderTop:`1px solid ${C.border}`}}>
      <button onClick={()=>nav("settings")} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:9,background:page==="settings"?C.accentL:"transparent",border:page==="settings"?`1px solid ${C.accentB}`:"1px solid transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:1}}>
        <span style={{fontSize:15,width:18,textAlign:"center"}}>⚙️</span><span style={{fontSize:13,fontWeight:page==="settings"?700:400,color:page==="settings"?C.accent:C.text2}}>Settings</span>
      </button>
      <button onClick={onOut} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:9,background:"transparent",border:"1px solid transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
        <span style={{fontSize:15,width:18,textAlign:"center"}}>→</span><span style={{fontSize:13,color:C.text3}}>Sign Out</span>
      </button>
    </div>
  </div>;
  const pp={inv,exp,cal,tgts,biz,reload,navEdit,addForm,setAddForm,expForm,setExpForm,editSku};
  return<div style={{display:"flex",minHeight:"100vh",background:C.bg}}>
    <div className="desk"><SidebarContent/></div>
    {sideOpen&&<><div onClick={()=>setSideOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:299,backdropFilter:"blur(4px)"}}/>
      <div style={{position:"fixed",top:0,left:0,zIndex:300,height:"100vh",animation:"slideIn 0.2s ease"}}><SidebarContent/></div></>}
    <div style={{flex:1,overflowY:"auto",minWidth:0}}>
      <div className="mob" style={{position:"sticky",top:0,zIndex:100,background:"rgba(12,15,29,0.95)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 16px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>setSideOpen(true)} style={{background:"none",border:"none",cursor:"pointer",color:C.text2,fontSize:20,lineHeight:1,fontFamily:"inherit"}}>☰</button>
        <span style={{fontSize:15,fontWeight:900,color:C.text}}>SELLR<span style={{color:C.accent}}>BASE</span></span>
        <div style={{width:28}}/>
      </div>
      {alerts.length>0&&<div style={{padding:"12px 24px 0"}}>{alerts.map(a=><AlertBox key={a.id} type={a.type} ch={a.msg} onClose={()=>dismissAlert(a.id)}/>)}</div>}
      <div style={{padding:"28px 24px",maxWidth:980,margin:"0 auto"}} className="fade" key={page}>
        {loading&&page!=="settings"?<Spin/>:<>
          {page==="dashboard"&&<Dashboard {...pp}/>}
          {page==="quick"&&<QuickSale {...pp}/>}
          {page==="inventory"&&<Inventory {...pp}/>}
          {page==="add"&&<AddStock {...pp}/>}
          {page==="edit"&&<EditStock {...pp}/>}
          {page==="comp"&&<CompPricing/>}
          {page==="expenses"&&<Expenses {...pp}/>}
          {page==="calendar"&&<Calendar {...pp}/>}
          {page==="analytics"&&<Analytics {...pp}/>}
          {page==="tax"&&<TaxSummary {...pp}/>}
          {page==="targets"&&<Targets {...pp}/>}
          {page==="settings"&&<Settings biz={biz} bizList={bizList} onBizChange={b=>{setBiz(b);setShowBizSwitcher(false);}} onBizCreated={loadBiz} onBizDeleted={()=>{loadBiz();setBiz(null);}} onOut={onOut}/>}
        </>}
      </div>
    </div>
    {showBizSwitcher&&<Modal title="Switch Business" onClose={()=>setShowBizSwitcher(false)} ch={
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {bizList.map(b=><button key={b.id} onClick={()=>{setBiz(b);setShowBizSwitcher(false);}} style={{background:biz?.id===b.id?C.accentL:C.card2,border:`1px solid ${biz?.id===b.id?C.accentB:C.border}`,borderRadius:10,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:b.colour||C.accent,flexShrink:0}}/>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:biz?.id===b.id?C.accent:C.text}}>{b.name}</div>{b.description&&<div style={{fontSize:11,color:C.text3,marginTop:2}}>{b.description}</div>}</div>
          {biz?.id===b.id&&<span style={{fontSize:12,color:C.accent}}>✓</span>}
        </button>)}
        <Divider/>
        <CreateBizForm onDone={()=>{loadBiz();setShowBizSwitcher(false);}} compact/>
      </div>
    }/>}
  </div>;
}
function Dashboard({inv,exp,tgts,biz,navEdit}){
  const[period,setPeriod]=useState("month");
  const PERIODS=[{id:"today",l:"Today"},{id:"week",l:"This Week"},{id:"month",l:"This Month"},{id:"year",l:"This Year"},{id:"all",l:"All Time"}];
  const now=new Date();
  const getStart=p=>{
    if(p==="today")return new Date(now.getFullYear(),now.getMonth(),now.getDate());
    if(p==="week"){const d=new Date(now);d.setDate(d.getDate()-((d.getDay()+6)%7));d.setHours(0,0,0,0);return d;}
    if(p==="month")return new Date(now.getFullYear(),now.getMonth(),1);
    if(p==="year")return new Date(now.getFullYear(),0,1);
    return new Date(0);
  };
  const start=getStart(period);
  const soldAll=inv.filter(i=>i.sold);
  const soldP=period==="all"?soldAll:soldAll.filter(i=>getSaleDate(i)&&new Date(getSaleDate(i))>=start);
  const expsP=period==="all"?exp:exp.filter(e=>e.date&&new Date(e.date)>=start);
  const revenue=r2(soldP.reduce((s,i)=>s+(i.sold_price||i.price),0));
  const costs=r2(soldP.filter(i=>i.cost!=null).reduce((s,i)=>s+i.cost,0));
  const expTotal=r2(expsP.reduce((s,e)=>s+e.amount,0));
  const grossProfit=r2(revenue-costs);
  const netProfit=r2(grossProfit-expTotal);
  const avgSale=soldP.length?r2(revenue/soldP.length):0;
  const listed=inv.filter(i=>!i.sold);
  const withDates=soldP.filter(i=>i.sold_at&&i.created_at);
  const avgDays=withDates.length?Math.round(withDates.reduce((s,i)=>s+Math.max(0,Math.floor((new Date(i.sold_at)-new Date(i.created_at))/86400000)),0)/withDates.length):null;
  const byDow={};soldP.forEach(i=>{if(!getSaleDate(i))return;const k=dowKey[new Date(getSaleDate(i)).getDay()];byDow[k]=(byDow[k]||0)+(i.sold_price||i.price);});
  const bestDow=Object.entries(byDow).sort((a,b)=>b[1]-a[1])[0];
  const biggest=soldP.length?soldP.reduce((b,i)=>(i.sold_price||i.price)>(b.sold_price||b.price)?i:b,soldP[0]):null;
  const roi=costs>0?Math.round((grossProfit/costs)*100):null;
  const str=inv.length>0?pct(soldAll.length,inv.length):0;
  const byPlatform={};soldP.forEach(i=>{const p=i.platform||"Other";byPlatform[p]=(byPlatform[p]||0)+(i.sold_price||i.price);});
  const platMax=Math.max(...Object.values(byPlatform),1);
  const mn=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const chartData=[];
  if(period==="today")chartData.push({l:"Today",v:revenue,hi:true,fmt:fmt(revenue)});
  else if(period==="week"){for(let i=6;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);const ds=d.toISOString().slice(0,10);const v=soldP.filter(x=>getSaleDate(x)===ds).reduce((s,x)=>s+(x.sold_price||x.price),0);chartData.push({l:dowKey[d.getDay()],v:r2(v),hi:i===0,fmt:fmt(r2(v))});}}
  else if(period==="month"){const days=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();for(let i=1;i<=days;i++){const ds=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;const v=soldP.filter(x=>getSaleDate(x)===ds).reduce((s,x)=>s+(x.sold_price||x.price),0);chartData.push({l:String(i),v:r2(v),hi:i===now.getDate(),fmt:v>0?fmt(r2(v)):""});}}
  else if(period==="year"){for(let m=0;m<=now.getMonth();m++){const v=soldP.filter(x=>getSaleDate(x)&&new Date(getSaleDate(x)).getMonth()===m).reduce((s,x)=>s+(x.sold_price||x.price),0);chartData.push({l:mn[m],v:r2(v),hi:m===now.getMonth(),fmt:fmt(r2(v))});}}
  const recent=soldAll.filter(i=>getSaleDate(i)).sort((a,b)=>new Date(getSaleDate(b))-new Date(getSaleDate(a))).slice(0,5);
  const monthTarget=tgts.find(t=>t.period==="monthly");
  const monthRev=r2(soldAll.filter(i=>getSaleDate(i)&&new Date(getSaleDate(i))>=new Date(now.getFullYear(),now.getMonth(),1)).reduce((s,i)=>s+(i.sold_price||i.price),0));
  return<div>
    <PageHdr title={biz?.name||"Dashboard"} sub="SELLRBASE DASHBOARD"/>
    <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
      {PERIODS.map(p=><button key={p.id} onClick={()=>setPeriod(p.id)} style={{padding:"7px 16px",borderRadius:20,border:`1.5px solid ${period===p.id?C.accent:C.border2}`,background:period===p.id?C.accentL:"transparent",color:period===p.id?C.accent:C.text2,fontWeight:period===p.id?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{p.l}</button>)}
    </div>
    <div style={{textAlign:"center",padding:"24px 20px",background:`linear-gradient(135deg,${C.accentL} 0%,transparent 100%)`,border:`1px solid ${C.accentB}`,borderRadius:18,marginBottom:20}}>
      <div style={{fontSize:11,color:C.text3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Revenue — {PERIODS.find(p=>p.id===period)?.l||""}</div>
      <div style={{fontSize:"clamp(36px,6vw,64px)",fontWeight:900,color:C.accent,letterSpacing:"-0.03em",lineHeight:1}}>{fmt(revenue)}</div>
      {netProfit!==0&&<div style={{fontSize:13,color:netProfit>=0?C.green:C.red,marginTop:8,fontWeight:600}}>{netProfit>=0?"▲":"▼"} {fmt(Math.abs(netProfit))} net profit</div>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
      <StatCard icon="📦" label="Items Sold" value={soldP.length} color={C.purple}/>
      <StatCard icon="💹" label="Gross Profit" value={fmt(grossProfit)} color={C.green}/>
      <StatCard icon="🏷️" label="In Stock" value={listed.length} color={C.gold}/>
      <StatCard icon="💰" label="Stock Value" value={fmt(listed.reduce((s,i)=>s+i.price,0))} color={C.teal}/>
      <StatCard icon="📈" label="Avg Sale" value={fmt(avgSale)} color={C.blue}/>
      <StatCard icon="🧾" label="Expenses" value={fmt(expTotal)} color={C.red}/>
      <StatCard icon="🏆" label="Biggest Sale" value={biggest?fmt(biggest.sold_price||biggest.price):"—"} color={C.gold}/>
      <StatCard icon="⏱️" label="Avg Days to Sell" value={avgDays!=null?`${avgDays}D`:"—"} color={C.purple}/>
      {roi!=null&&<StatCard icon="📊" label="ROI" value={`${roi}%`} color={roi>=0?C.green:C.red}/>}
      <StatCard icon="🔄" label="Sell-Through" value={`${str}%`} color={C.teal}/>
    </div>
    {monthTarget&&monthTarget.target_revenue&&<Card ch={<>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:700,color:C.text2,textTransform:"uppercase",letterSpacing:"0.07em"}}>Monthly Target</span>
        <span style={{fontSize:13,fontWeight:700,color:C.accent}}>{fmt(monthRev)} / {fmt(monthTarget.target_revenue)}</span>
      </div>
      <div style={{height:8,background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${Math.min(pct(monthRev,monthTarget.target_revenue),100)}%`,background:`linear-gradient(90deg,${C.accent}88,${C.accent})`,borderRadius:4,transition:"width 0.5s"}}/>
      </div>
      <div style={{fontSize:11,color:C.text3,marginTop:5}}>{pct(monthRev,monthTarget.target_revenue)}% of monthly target</div>
    </>} style={{marginBottom:20}}/>}
    {chartData.length>0&&period!=="all"&&<Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Revenue Chart</div><BarChart data={chartData} color={C.accent} h={100}/></>} style={{marginBottom:20}}/>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
      {Object.keys(byPlatform).length>0&&<Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>By Platform</div>{Object.entries(byPlatform).sort((a,b)=>b[1]-a[1]).map(([p,v])=><HBar key={p} label={p} value={v} max={platMax} color={C.accent} display={fmt(v)}/>)}</>}/>}
      <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Key Insights</div>
        {[{l:"Best day of week",v:bestDow?`${bestDow[0]} (${fmt(r2(bestDow[1]))})`:"—",hi:true},{l:"Net after expenses",v:fmt(netProfit),hi:true},{l:"ROI",v:roi!=null?`${roi}%`:"—"},{l:"Sell-through",v:`${str}%`}].map(s=><div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:12,color:C.text2}}>{s.l}</span><span style={{fontSize:13,fontWeight:700,color:s.hi?C.accent:C.text}}>{s.v}</span>
        </div>)}
      </>}/>
    </div>
    {recent.length>0&&<Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Recent Sales</div>
      {recent.map(i=><div key={i.id} onClick={()=>navEdit(i.sku)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
        <div><div style={{fontSize:13,fontWeight:600,color:C.text,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.title}</div><div style={{fontSize:11,color:C.text3,marginTop:2}}>{i.sku} · {getSaleDate(i)} · {i.platform||"—"}</div></div>
        <div style={{textAlign:"right",marginLeft:12,flexShrink:0}}><div style={{fontSize:14,fontWeight:700,color:C.green}}>{fmt(i.sold_price||i.price)}</div>{i.cost&&<div style={{fontSize:11,color:C.text3}}>cost {fmt(i.cost)}</div>}</div>
      </div>)}
    </>}/>}
  </div>;
}
function QuickSale({inv,biz,reload}){
  const[q,setQ]=useState("");const[found,setFound]=useState(null);const[nf,setNf]=useState(false);
  const[soldFor,setSoldFor]=useState("");const[atList,setAtList]=useState(true);const[soldAt,setSoldAt]=useState(today());
  const[busy,setBusy]=useState(false);const[ok,setOk]=useState(false);const[err,setErr]=useState(null);
  const search=async()=>{setNf(false);setFound(null);setOk(false);setErr(null);const{data}=await supabase.from("inventory").select("*").eq("business_id",biz.id).ilike("sku",q.trim()).single();if(!data)setNf(true);else{setFound(data);setSoldFor(String(data.price));setAtList(true);}};
  const save=async()=>{
    if(!found)return;if(!atList&&(!soldFor||parseFloat(soldFor)<=0)){setErr("Enter the sold price.");return;}
    setBusy(true);setErr(null);
    const sp=atList?r2(found.price):r2(parseFloat(soldFor));
    const{error}=await supabase.from("inventory").update({sold:true,sold_at:soldAt,sold_price:sp}).eq("id",found.id);
    if(error)setErr(error.message);else{setOk(true);setFound(null);setQ("");reload();}
    setBusy(false);
  };
  return<div style={{maxWidth:480,margin:"0 auto"}}>
    <PageHdr title="Quick Sale" sub="MARK AS SOLD"/>
    <Card ch={<div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:10}}>
        <input style={{...DI,flex:1}} placeholder="Enter SKU…" value={q} onChange={e=>{setQ(e.target.value);setNf(false);setOk(false);}} onKeyDown={e=>e.key==="Enter"&&search()}/>
        <Btn ch="Find" onClick={search} disabled={!q.trim()}/>
      </div>
      {nf&&<Msg ch={`No item found: "${q}"`}/>}{ok&&<Msg ok ch="✅ Marked as sold!"/>}
    </div>}/>
    {found&&<Card ch={<div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:C.goldL,color:C.gold}}>{found.sku}</span><div style={{fontSize:16,fontWeight:700,color:C.text,marginTop:8}}>{found.title}</div>{found.cost&&<div style={{fontSize:12,color:C.text3,marginTop:3}}>Cost: {fmt(found.cost)}</div>}</div>
        <span style={{fontSize:14,fontWeight:700,color:C.accent}}>{fmt(found.price)}</span>
      </div>
      <Divider/>
      <Input label="Date Sold" type="date" value={soldAt} onChange={e=>setSoldAt(e.target.value)}/>
      <div onClick={()=>{setAtList(!atList);setSoldFor(String(found.price));}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:C.accentL,borderRadius:10,border:`1px solid ${atList?C.accentB:C.border}`,cursor:"pointer"}}>
        <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${atList?C.accent:C.text3}`,background:atList?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{atList&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}</div>
        <span style={{fontSize:13,color:atList?C.accent:C.text2}}>Sold at list price ({fmt(found.price)})</span>
      </div>
      {!atList&&<Input label="Actual Sold Price (£) *" req type="number" placeholder="0.00" value={soldFor===String(found.price)?"":soldFor} onChange={e=>setSoldFor(e.target.value)}/>}
      {err&&<Msg ch={err}/>}
      <Btn ch={busy?"Saving…":"Mark as Sold ✓"} onClick={save} disabled={busy} full/>
    </div>} style={{marginTop:16}}/>}
  </div>;
}
function Inventory({inv,reload,navEdit}){
  const[search,setSearch]=useState("");const[status,setStatus]=useState("all");const[sort,setSort]=useState("date_desc");const[platform,setPlatform]=useState("all");
  const listed=inv.filter(i=>!i.sold);const sold=inv.filter(i=>i.sold);
  const platforms=[...new Set(inv.map(i=>i.platform).filter(Boolean))];
  const filtered=inv.filter(i=>{
    const ms=!search||(i.sku||"").toLowerCase().includes(search.toLowerCase())||(i.title||"").toLowerCase().includes(search.toLowerCase());
    const mx=status==="all"||(status==="listed"&&!i.sold)||(status==="sold"&&i.sold);
    const mp=platform==="all"||i.platform===platform;
    return ms&&mx&&mp;
  }).sort((a,b)=>{
    if(sort==="date_desc")return new Date(b.created_at)-new Date(a.created_at);
    if(sort==="date_asc")return new Date(a.created_at)-new Date(b.created_at);
    if(sort==="price_desc")return b.price-a.price;if(sort==="price_asc")return a.price-b.price;
    if(sort==="sold_desc")return(b.sold_at?new Date(b.sold_at):new Date(0))-(a.sold_at?new Date(a.sold_at):new Date(0));
    if(sort==="profit_desc"){const ap=a.cost?r2((a.sold_price||a.price)-a.cost):0;const bp=b.cost?r2((b.sold_price||b.price)-b.cost):0;return bp-ap;}
    return 0;
  });
  const sel={...DI,width:"auto",cursor:"pointer",paddingRight:30,appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='rgba(255,255,255,0.35)' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"};
  const daysListed=item=>{if(!item.created_at)return"—";const end=item.sold&&item.sold_at?new Date(item.sold_at):new Date();return Math.max(0,Math.floor((end-new Date(item.created_at))/86400000))+"D";};
  return<div>
    <PageHdr title="Inventory" sub="STOCK MANAGEMENT"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
      <StatCard icon="📦" label="Listed" value={listed.length} color={C.gold}/>
      <StatCard icon="✅" label="Sold" value={sold.length} color={C.green}/>
      <StatCard icon="💰" label="Stock Value" value={fmt(listed.reduce((s,i)=>s+i.price,0))} color={C.blue}/>
      <StatCard icon="💹" label="Cost in Stock" value={fmt(listed.filter(i=>i.cost).reduce((s,i)=>s+i.cost,0))} color={C.purple}/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
      <input style={{...DI,flex:1,minWidth:160}} placeholder="Search SKU or title…" value={search} onChange={e=>setSearch(e.target.value)}/>
      <select style={sel} value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All Status</option><option value="listed">Listed</option><option value="sold">Sold</option></select>
      <select style={sel} value={sort} onChange={e=>setSort(e.target.value)}><option value="date_desc">Listed: Newest</option><option value="date_asc">Listed: Oldest</option><option value="price_desc">Price ↓</option><option value="price_asc">Price ↑</option><option value="sold_desc">Sold: Recent</option><option value="profit_desc">Profit ↓</option></select>
      {platforms.length>0&&<select style={sel} value={platform} onChange={e=>setPlatform(e.target.value)}><option value="all">All Platforms</option>{platforms.map(p=><option key={p}>{p}</option>)}</select>}
    </div>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{overflowX:"auto"}}>
        <table>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`,background:C.card2}}>
            {["SKU","Title","Cost","Price","Profit","Status","Platform","Listed","Sold","Days"].map(h=><th key={h} style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={10} style={{padding:40,textAlign:"center",color:C.text3}}>No items found.</td></tr>}
            {filtered.map(item=>{const profit=item.cost!=null?r2((item.sold_price||item.price)-item.cost):null;return<tr key={item.id} onClick={()=>navEdit(item.sku)} style={{borderBottom:`1px solid ${C.border}`}}>
              <td><span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:C.goldL,color:C.gold}}>{item.sku}</span></td>
              <td style={{color:C.text,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis"}}>{item.title}</td>
              <td style={{color:C.text2}}>{item.cost!=null?fmt(item.cost):"—"}</td>
              <td style={{color:C.text,fontWeight:600}}>{fmt(item.price)}</td>
              <td style={{fontWeight:700,color:profit==null?C.text3:profit>=0?C.green:C.red}}>{profit!=null?fmt(profit):"—"}</td>
              <td><span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:item.sold?C.greenL:C.goldL,color:item.sold?C.green:C.gold}}>{item.sold?"SOLD":"LISTED"}</span></td>
              <td style={{color:C.text2,fontSize:12}}>{item.platform||"—"}</td>
              <td style={{color:C.text3,fontSize:12}}>{item.created_at?new Date(item.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"—"}</td>
              <td style={{color:item.sold_at?C.green:C.text3,fontSize:12}}>{item.sold_at?new Date(item.sold_at).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"—"}</td>
              <td style={{color:C.accent,fontSize:12,fontWeight:700}}>{daysListed(item)}</td>
            </tr>;})}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
}
function AddStock({biz,reload,addForm,setAddForm}){
  const[busy,setBusy]=useState(false);const[ok,setOk]=useState(false);const[err,setErr]=useState(null);
  const f=k=>e=>setAddForm(p=>({...p,[k]:e.target.value}));
  const CATS=["Clothing","Footwear","Electronics","Collectibles","Books","Homeware","Toys","Jewellery","Art","Vintage","Other"];
  const PLATS=["eBay","Vinted","Depop","Poshmark","Facebook","Instagram","Etsy","Other"];
  const save=async()=>{
    if(!addForm.sku||!addForm.title||!addForm.price)return;setBusy(true);setErr(null);
    const{error}=await supabase.from("inventory").insert([{business_id:biz.id,sku:addForm.sku.trim().toUpperCase(),title:addForm.title.trim(),cost:addForm.cost?r2(parseFloat(addForm.cost)):null,price:r2(parseFloat(addForm.price)),note:addForm.note.trim()||null,platform:addForm.platform||"eBay",category:addForm.category||"Other",location:addForm.location.trim()||null,sold:false}]);
    if(error)setErr(error.message);else{setAddForm({sku:"",title:"",cost:"",price:"",note:"",platform:"eBay",category:"Clothing",location:""});setOk(true);setTimeout(()=>setOk(false),3000);reload();}
    setBusy(false);
  };
  return<div style={{maxWidth:560,margin:"0 auto"}}>
    <PageHdr title="Add Stock" sub="INVENTORY"/>
    <Card ch={<div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="SKU / Reference" req placeholder="e.g. VTG-001" value={addForm.sku} onChange={f("sku")}/>
        <Sel label="Platform" ch={PLATS.map(p=><option key={p}>{p}</option>)} value={addForm.platform} onChange={f("platform")}/>
      </div>
      <Input label="Item Title" req placeholder="e.g. Vintage Carhartt Chore Coat" value={addForm.title} onChange={f("title")}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="Cost Price (£)" type="number" placeholder="12.00" value={addForm.cost} onChange={f("cost")}/>
        <Input label="Listing Price (£)" req type="number" placeholder="45.00" value={addForm.price} onChange={f("price")}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Sel label="Category" ch={CATS.map(c=><option key={c}>{c}</option>)} value={addForm.category} onChange={f("category")}/>
        <Input label="Storage Location" placeholder="e.g. Box 3" value={addForm.location} onChange={f("location")}/>
      </div>
      <Input label="Notes" placeholder="e.g. Size M, minor fading" value={addForm.note} onChange={f("note")}/>
      {err&&<Msg ch={err}/>}{ok&&<Msg ok ch="✅ Added to inventory!"/>}
      <Btn ch={busy?"Saving…":"Add to Inventory"} onClick={save} disabled={busy||!addForm.sku||!addForm.title||!addForm.price} full/>
    </div>}/>
  </div>;
}
function EditStock({biz,reload,editSku}){
  const[q,setQ]=useState(editSku||"");const[found,setFound]=useState(null);const[nf,setNf]=useState(false);
  const[ed,setEd]=useState(null);const[busy,setBusy]=useState(false);const[ok,setOk]=useState(false);const[err,setErr]=useState(null);
  const PLATS=["eBay","Vinted","Depop","Poshmark","Facebook","Instagram","Etsy","Other"];
  const CATS=["Clothing","Footwear","Electronics","Collectibles","Books","Homeware","Toys","Jewellery","Art","Vintage","Other"];
  useEffect(()=>{if(editSku)doSearch(editSku);},[]);
  const doSearch=async(sku)=>{
    const s=(sku||q).trim();if(!s)return;setNf(false);setFound(null);setOk(false);setErr(null);
    const{data}=await supabase.from("inventory").select("*").eq("business_id",biz.id).ilike("sku",s).single();
    if(!data)setNf(true);else{setFound(data);setEd({price:data.price,note:data.note||"",sold:data.sold,sold_at:data.sold_at||today(),atList:!data.sold_price||data.sold_price===data.price,soldFor:String(data.sold_price||data.price),platform:data.platform||"eBay",category:data.category||"Clothing",location:data.location||""});}
  };
  const canSave=()=>{if(!ed)return false;if(ed.sold){if(ed.atList)return true;return ed.soldFor&&parseFloat(ed.soldFor)>0;}return true;};
  const save=async()=>{
    if(!canSave())return;setBusy(true);setErr(null);
    const sp=ed.sold?(ed.atList?r2(parseFloat(ed.price)):r2(parseFloat(ed.soldFor))):null;
    const updates={price:r2(parseFloat(ed.price)),note:ed.note||null,sold:ed.sold,platform:ed.platform,category:ed.category,location:ed.location||null};
    if(ed.sold){updates.sold_at=ed.sold_at;updates.sold_price=sp;}
    const{error}=await supabase.from("inventory").update(updates).eq("id",found.id);
    if(error)setErr(error.message);else{setOk(true);setTimeout(()=>setOk(false),2500);reload();setFound(p=>({...p,...updates}));}
    setBusy(false);
  };
  const del=async()=>{if(!found||!window.confirm("Delete permanently?"))return;await supabase.from("inventory").delete().eq("id",found.id);setFound(null);setEd(null);setQ("");reload();};
  return<div style={{maxWidth:560,margin:"0 auto"}}>
    <PageHdr title="Edit Stock" sub="INVENTORY"/>
    <Card ch={<div style={{display:"flex",gap:10}}>
      <input style={{...DI,flex:1}} placeholder="Enter SKU…" value={q} onChange={e=>{setQ(e.target.value);setNf(false);}} onKeyDown={e=>e.key==="Enter"&&doSearch()}/>
      <Btn ch="Search" onClick={()=>doSearch()} disabled={!q.trim()}/>
    </div>} style={{marginBottom:14}}/>
    {nf&&<Msg ch={`No item found: "${q}"`}/>}
    {found&&ed&&<Card ch={<div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:C.goldL,color:C.gold}}>{found.sku}</span><div style={{fontSize:17,fontWeight:700,color:C.text,marginTop:8}}>{found.title}</div>{found.cost&&<div style={{fontSize:12,color:C.text3,marginTop:3}}>Cost: {fmt(found.cost)}</div>}</div>
        <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:ed.sold?C.greenL:C.goldL,color:ed.sold?C.green:C.gold}}>{ed.sold?"SOLD":"LISTED"}</span>
      </div>
      <Divider/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="Listing Price (£)" type="number" value={ed.price} onChange={e=>setEd(p=>({...p,price:e.target.value,soldFor:p.atList?e.target.value:p.soldFor}))}/>
        <Sel label="Platform" ch={PLATS.map(p=><option key={p}>{p}</option>)} value={ed.platform} onChange={e=>setEd(p=>({...p,platform:e.target.value}))}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Sel label="Category" ch={CATS.map(c=><option key={c}>{c}</option>)} value={ed.category} onChange={e=>setEd(p=>({...p,category:e.target.value}))}/>
        <Input label="Location" placeholder="e.g. Box 3" value={ed.location} onChange={e=>setEd(p=>({...p,location:e.target.value}))}/>
      </div>
      <Input label="Notes" value={ed.note} onChange={e=>setEd(p=>({...p,note:e.target.value}))}/>
      <div onClick={()=>setEd(p=>({...p,sold:!p.sold}))} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:ed.sold?C.greenL:C.card2,borderRadius:10,border:`1px solid ${ed.sold?"rgba(16,185,129,0.3)":C.border}`,cursor:"pointer"}}>
        <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${ed.sold?C.green:C.text3}`,background:ed.sold?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ed.sold&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}</div>
        <span style={{fontSize:13,color:ed.sold?C.green:C.text2,fontWeight:ed.sold?600:400}}>Mark as Sold</span>
      </div>
      {ed.sold&&<>
        <Input label="Date Sold" type="date" value={ed.sold_at} onChange={e=>setEd(p=>({...p,sold_at:e.target.value}))}/>
        <div onClick={()=>setEd(p=>({...p,atList:!p.atList,soldFor:!p.atList?p.price:p.soldFor}))} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:C.accentL,borderRadius:10,border:`1px solid ${ed.atList?C.accentB:C.border}`,cursor:"pointer"}}>
          <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${ed.atList?C.accent:C.text3}`,background:ed.atList?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ed.atList&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}</div>
          <span style={{fontSize:13,color:ed.atList?C.accent:C.text2}}>Sold at list price ({fmt(ed.price)})</span>
        </div>
        {!ed.atList&&<Input label="Actual Sold Price (£) *" req type="number" placeholder="0.00" value={ed.soldFor===ed.price?"":ed.soldFor} onChange={e=>setEd(p=>({...p,soldFor:e.target.value}))}/>}
      </>}
      {err&&<Msg ch={err}/>}{ok&&<Msg ok ch="✅ Changes saved!"/>}
      <div style={{display:"flex",gap:10}}><Btn ch={busy?"Saving…":"Save Changes"} onClick={save} disabled={!canSave()||busy} full/><Btn ch="Delete" onClick={del} variant="danger"/></div>
    </div>}/>}
  </div>;
}
function CompPricing(){
  const[brand,setBrand]=useState("");const[type,setType]=useState("");const[colour,setColour]=useState("");const[size,setSize]=useState("");
  const[links,setLinks]=useState(null);const[prices,setPrices]=useState(Array(8).fill(""));const[result,setResult]=useState(null);
  const q=[brand,type,colour,size].filter(Boolean).join(" ").trim();
  const goComp=()=>{if(!q)return;const enc=encodeURIComponent(q);setLinks({ebayS:`https://www.ebay.co.uk/sch/i.html?_nkw=${enc}&LH_Sold=1&LH_Complete=1`,ebayA:`https://www.ebay.co.uk/sch/i.html?_nkw=${enc}`,vinted:`https://www.vinted.co.uk/catalog?search_text=${enc}`,depop:`https://www.depop.com/search/?q=${enc}`});};
  const vals=prices.map(v=>parseFloat(v)).filter(v=>!isNaN(v)&&v>0);
  const goCalc=()=>{if(!vals.length)return;const avg=vals.reduce((a,b)=>a+b,0)/vals.length;setResult({avg:Math.floor(avg)+0.99,higher:Math.floor(avg*1.12)+0.99,quick:Math.floor(avg*0.83)+0.99,max:Math.max(...vals),count:vals.length});};
  return<div>
    <PageHdr title="Comp & Pricing" sub="TOOLS"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card ch={<div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Comp Checker</div>
        <Input label="Brand" req placeholder="e.g. Carhartt" value={brand} onChange={e=>setBrand(e.target.value)}/>
        <Input label="Item Type" req placeholder="e.g. Chore Coat" value={type} onChange={e=>setType(e.target.value)}/>
        <Input label="Colour" placeholder="e.g. Black" value={colour} onChange={e=>setColour(e.target.value)}/>
        <Input label="Size" placeholder="e.g. M" value={size} onChange={e=>setSize(e.target.value)}/>
        <div style={{display:"flex",gap:8}}><Btn ch="Search" onClick={goComp} disabled={!q} full/><Btn ch="Clear" onClick={()=>{setBrand("");setType("");setColour("");setSize("");setLinks(null);}} variant="ghost"/></div>
        {links&&<div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
          {[["🛒","eBay Sold",links.ebayS],["🏷️","eBay Active",links.ebayA],["👗","Vinted",links.vinted],["🛍️","Depop",links.depop]].map(([ic,l,h])=>(
            <a key={l} href={h} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.accentL,border:`1px solid ${C.accentB}`,borderRadius:10,textDecoration:"none",color:C.accent,fontWeight:600,fontSize:13}}>
              <span>{ic}</span><span style={{flex:1}}>{l}</span><span>↗</span>
            </a>
          ))}
        </div>}
      </div>}/>
      <Card ch={<div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Price Calculator</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {prices.map((v,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{fontSize:10,color:C.text3,width:16,flexShrink:0}}>#{i+1}</span>
            <div style={{position:"relative",flex:1}}>
              <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.text3,fontSize:12,pointerEvents:"none"}}>£</span>
              <input style={{...DI,paddingLeft:20,fontSize:13}} type="number" placeholder="0.00" value={v} onChange={e=>{const n=[...prices];n[i]=e.target.value;setPrices(n);setResult(null);}}/>
            </div>
          </div>)}
        </div>
        <div style={{display:"flex",gap:8}}><Btn ch="Calculate" onClick={goCalc} disabled={vals.length===0} full/><Btn ch="Clear" onClick={()=>{setPrices(Array(8).fill(""));setResult(null);}} variant="ghost"/></div>
        {result&&<>
          <div style={{textAlign:"center",padding:"16px",background:C.accentL,border:`1px solid ${C.accentB}`,borderRadius:12}}>
            <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Average ({result.count} comps)</div>
            <div style={{fontSize:32,fontWeight:900,color:C.accent}}>£{result.avg.toFixed(2)}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[["Higher",result.higher,C.green],["Quick Sale",result.quick,C.gold],["Max",result.max,C.purple]].map(([l,v,c])=>(
              <div key={l} style={{padding:"12px 8px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,textAlign:"center"}}>
                <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{l}</div>
                <div style={{fontSize:16,fontWeight:800,color:c}}>£{typeof v==="number"?v.toFixed(2):"—"}</div>
              </div>
            ))}
          </div>
        </>}
      </div>}/>
    </div>
  </div>;
}
function Expenses({biz,exp,reload,expForm,setExpForm}){
  const[busy,setBusy]=useState(false);const[ok,setOk]=useState(false);const[err,setErr]=useState(null);
  const[filterCat,setFilterCat]=useState("all");const[sortE,setSortE]=useState("date_desc");
  const CATS=["Stock","Packaging","Postage","Platform Fees","Software","Storage","Marketing","Equipment","Transport","Other"];
  const f=k=>e=>setExpForm(p=>({...p,[k]:e.target.value}));
  const save=async()=>{
    if(!expForm.date||!expForm.amount||!expForm.description)return;setBusy(true);setErr(null);
    const{error}=await supabase.from("expenses").insert([{business_id:biz.id,date:expForm.date,amount:r2(parseFloat(expForm.amount)),description:expForm.description,category:expForm.category||"Other",due_date:expForm.due_date||null,recurring:expForm.recurring}]);
    if(error)setErr(error.message);else{setExpForm({date:"",amount:"",description:"",category:"Stock",due_date:"",recurring:false});setOk(true);setTimeout(()=>setOk(false),2500);reload();}
    setBusy(false);
  };
  const sel={...DI,width:"auto",cursor:"pointer",paddingRight:30,appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='rgba(255,255,255,0.35)' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"};
  const filtered=exp.filter(e=>filterCat==="all"||e.category===filterCat).sort((a,b)=>sortE==="date_desc"?new Date(b.date)-new Date(a.date):sortE==="date_asc"?new Date(a.date)-new Date(b.date):sortE==="amt_desc"?b.amount-a.amount:a.amount-b.amount);
  const total=r2(filtered.reduce((s,e)=>s+e.amount,0));
  const byCat={};filtered.forEach(e=>{byCat[e.category||"Other"]=(byCat[e.category||"Other"]||0)+e.amount;});
  const catMax=Math.max(...Object.values(byCat),1);
  return<div>
    <PageHdr title="Expenses" sub="FINANCIALS"/>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:20}}>
      <Card ch={<div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Add Expense</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Input label="Date" req type="date" value={expForm.date} onChange={f("date")}/>
          <Input label="Amount (£)" req type="number" placeholder="0.00" value={expForm.amount} onChange={f("amount")}/>
        </div>
        <Input label="Description" req placeholder="e.g. Royal Mail packaging" value={expForm.description} onChange={f("description")}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Sel label="Category" ch={CATS.map(c=><option key={c}>{c}</option>)} value={expForm.category} onChange={f("category")}/>
          <Input label="Due Date (optional)" type="date" value={expForm.due_date} onChange={f("due_date")}/>
        </div>
        <div onClick={()=>setExpForm(p=>({...p,recurring:!p.recurring}))} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"6px 0"}}>
          <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${expForm.recurring?C.accent:C.text3}`,background:expForm.recurring?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{expForm.recurring&&<span style={{color:"#fff",fontSize:10,fontWeight:700}}>✓</span>}</div>
          <span style={{fontSize:13,color:C.text2}}>Recurring expense</span>
        </div>
        {err&&<Msg ch={err}/>}{ok&&<Msg ok ch="✅ Expense logged!"/>}
        <Btn ch={busy?"Saving…":"Add Expense"} onClick={save} disabled={busy||!expForm.date||!expForm.amount||!expForm.description} full/>
      </div>}/>
      <Card ch={<>
        <div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>By Category</div>
        {Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([c,v])=><HBar key={c} label={c.length>8?c.slice(0,8)+"…":c} value={v} max={catMax} color={C.accent} display={fmt(v)}/>)}
        <Divider/><div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700}}><span style={{color:C.text2}}>Total</span><span style={{color:C.red}}>{fmt(total)}</span></div>
      </>}/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
      <select style={sel} value={filterCat} onChange={e=>setFilterCat(e.target.value)}><option value="all">All Categories</option>{CATS.map(c=><option key={c}>{c}</option>)}</select>
      <select style={sel} value={sortE} onChange={e=>setSortE(e.target.value)}><option value="date_desc">Newest First</option><option value="date_asc">Oldest First</option><option value="amt_desc">Amount ↓</option><option value="amt_asc">Amount ↑</option></select>
    </div>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{overflowX:"auto"}}>
        <table>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`,background:C.card2}}>{["Date","Description","Category","Due","Amount"].map(h=><th key={h} style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em"}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={5} style={{padding:40,textAlign:"center",color:C.text3}}>No expenses yet.</td></tr>}
            {filtered.map((e,i)=><tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
              <td style={{color:C.text2,fontSize:12}}>{new Date(e.date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"2-digit"})}</td>
              <td style={{color:C.text}}>{e.description}</td>
              <td><span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:C.accentL,color:C.accent}}>{e.category||"Other"}</span></td>
              <td style={{color:e.due_date&&new Date(e.due_date)<new Date()?C.red:C.text3,fontSize:12}}>{e.due_date||"—"}</td>
              <td style={{fontWeight:700,color:C.red}}>{fmt(e.amount)}</td>
            </tr>)}
          </tbody>
          <tfoot><tr style={{borderTop:`1px solid ${C.border}`,background:C.card2}}>
            <td colSpan={4} style={{color:C.text3,fontSize:12}}>{filtered.length} expenses</td>
            <td style={{fontWeight:700,color:C.red}}>{fmt(total)}</td>
          </tr></tfoot>
        </table>
      </div>
    </div>
  </div>;
}
function Calendar({inv,cal,biz,reload}){
  const[cur,setCur]=useState(new Date());const[popup,setPopup]=useState(null);const[expand,setExpand]=useState(null);
  const[newText,setNewText]=useState("");const[newType,setNewType]=useState("note");const[saving,setSaving]=useState(false);
  const yr=cur.getFullYear(),mo=cur.getMonth();
  const firstDay=new Date(yr,mo,1).getDay();const dim=new Date(yr,mo+1,0).getDate();
  const todayStr=today();
  const listedMap={},soldMap={},noteMap={},targetMap={};
  inv.forEach(i=>{
    if(i.created_at){const d=i.created_at.slice(0,10);if(!listedMap[d])listedMap[d]=[];listedMap[d].push(i);}
    if(i.sold&&i.sold_at){const d=i.sold_at;if(!soldMap[d])soldMap[d]=[];soldMap[d].push(i);}
  });
  cal.forEach(e=>{
    if(e.type==="note"){if(!noteMap[e.date])noteMap[e.date]=[];noteMap[e.date].push(e);}
    if(e.type==="target"){if(!targetMap[e.date])targetMap[e.date]=[];targetMap[e.date].push(e);}
  });
  const save=async()=>{
    if(!newText.trim()||!popup)return;setSaving(true);
    await supabase.from("calendar_entries").insert([{business_id:biz.id,date:popup,text:newText.trim(),type:newType}]);
    setNewText("");setPopup(null);reload();setSaving(false);
  };
  const cells=[];for(let i=0;i<(firstDay===0?6:firstDay-1);i++)cells.push(null);for(let d=1;d<=dim;d++)cells.push(d);
  const TC={note:{bg:"rgba(59,130,246,0.15)",c:C.blue},target:{bg:"rgba(239,68,68,0.15)",c:C.red},listed:{bg:C.goldL,c:C.gold},sold:{bg:C.greenL,c:C.green}};
  return<div>
    <PageHdr title="Calendar" sub="TOOLS"/>
    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
      {[["listed","Listed",C.gold],["sold","Sold",C.green],["note","Notes",C.blue],["target","Targets",C.red]].map(([t,l,c])=>(
        <div key={t} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 12px",background:TC[t].bg,borderRadius:20,border:`1px solid ${c}30`}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:c,display:"inline-block"}}/><span style={{fontSize:12,color:c,fontWeight:600}}>{l}</span>
        </div>
      ))}
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
      <Btn ch="←" onClick={()=>setCur(new Date(yr,mo-1,1))} variant="ghost" small/>
      <span style={{fontSize:17,fontWeight:700,color:C.text}}>{cur.toLocaleString("en-GB",{month:"long",year:"numeric"})}</span>
      <Btn ch="→" onClick={()=>setCur(new Date(yr,mo+1,1))} variant="ghost" small/>
    </div>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${C.border}`}}>
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><div key={d} style={{padding:"10px 4px",textAlign:"center",fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
        {cells.map((day,i)=>{
          if(!day)return<div key={i} style={{minHeight:90,borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}/>;
          const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isToday=ds===todayStr;const isPast=ds<todayStr;
          const listed=listedMap[ds]||[];const sold=soldMap[ds]||[];const notes=noteMap[ds]||[];const targets=targetMap[ds]||[];
          return<div key={i} style={{minHeight:90,padding:"6px 5px",borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,background:isToday?C.accentL:"transparent",cursor:"pointer",position:"relative"}} onClick={()=>setPopup(ds)}>
            <div style={{fontSize:12,fontWeight:isToday?800:400,color:isToday?C.accent:C.text2,marginBottom:3}}>{day}</div>
            <div style={{display:"flex",flexDirection:"column",gap:2}} onClick={e=>e.stopPropagation()}>
              {listed.length>0&&<div onClick={e=>{e.stopPropagation();setExpand(expand===ds+"-l"?null:ds+"-l");}} style={{fontSize:9,padding:"2px 5px",borderRadius:4,background:TC.listed.bg,color:TC.listed.c,fontWeight:700,cursor:"pointer"}}>Listed ({listed.length})</div>}
              {sold.length>0&&<div onClick={e=>{e.stopPropagation();setExpand(expand===ds+"-s"?null:ds+"-s");}} style={{fontSize:9,padding:"2px 5px",borderRadius:4,background:TC.sold.bg,color:TC.sold.c,fontWeight:700,cursor:"pointer"}}>Sold ({sold.length})</div>}
              {notes.slice(0,1).map((n,j)=><div key={j} style={{fontSize:9,padding:"2px 5px",borderRadius:4,background:TC.note.bg,color:TC.note.c,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.text}</div>)}
              {targets.map((t,j)=><div key={j} style={{fontSize:9,padding:"2px 5px",borderRadius:4,background:TC.target.bg,color:TC.target.c,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isPast?"❌":"🎯"} {t.text}</div>)}
            </div>
          </div>;
        })}
      </div>
    </div>
    {expand&&(()=>{const isList=expand.endsWith("-l");const ds=expand.slice(0,-2);const items=isList?(listedMap[ds]||[]):(soldMap[ds]||[]);
      return<Modal title={`${isList?"Listed":"Sold"} on ${new Date(ds+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`} onClose={()=>setExpand(null)} ch={
        <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:300,overflowY:"auto"}}>
          {items.map((item,i)=><div key={i} style={{padding:"10px 12px",background:C.card2,borderRadius:10}}>
            <div style={{fontSize:12,fontWeight:700,color:C.gold}}>{item.sku}</div>
            <div style={{fontSize:11,color:C.text2,marginTop:2}}>{item.title}</div>
            {(item.sold_price||item.price)&&<div style={{fontSize:11,color:C.green,marginTop:2}}>{fmt(item.sold_price||item.price)}</div>}
          </div>)}
          <Btn ch="Close" onClick={()=>setExpand(null)} variant="ghost" full/>
        </div>
      }/>;
    })()}
    {popup&&<Modal title={new Date(popup+"T12:00:00").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})} onClose={()=>setPopup(null)} ch={
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",gap:8}}>
          {["note","target"].map(t=><button key={t} onClick={()=>setNewType(t)} style={{flex:1,padding:"9px",borderRadius:9,border:`1.5px solid ${newType===t?C.accent:C.border}`,background:newType===t?C.accentL:"transparent",color:newType===t?C.accent:C.text2,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:newType===t?700:400,textTransform:"capitalize"}}>Add {t}</button>)}
        </div>
        <input style={DI} placeholder={newType==="note"?"e.g. Photo shoot day":"e.g. Hit 50 sales"} value={newText} onChange={e=>setNewText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} autoFocus/>
        <div style={{display:"flex",gap:8}}><Btn ch={saving?"Saving…":"Save"} onClick={save} disabled={!newText.trim()||saving} full/><Btn ch="Cancel" onClick={()=>setPopup(null)} variant="ghost"/></div>
      </div>
    }/>}
  </div>;
}
function Analytics({inv,exp}){
  const[view,setView]=useState("overview");const now=new Date();
  const soldAll=inv.filter(i=>i.sold&&getSaleDate(i));
  const mn=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const totalRev=r2(soldAll.reduce((s,i)=>s+(i.sold_price||i.price),0));
  const totalCost=r2(soldAll.filter(i=>i.cost).reduce((s,i)=>s+i.cost,0));
  const totalExp=r2(exp.reduce((s,e)=>s+e.amount,0));
  const totalProfit=r2(totalRev-totalCost-totalExp);
  const monthlyData=[];
  for(let i=11;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const v=soldAll.filter(x=>getSaleDate(x)&&new Date(getSaleDate(x)).getFullYear()===d.getFullYear()&&new Date(getSaleDate(x)).getMonth()===d.getMonth()).reduce((s,x)=>s+(x.sold_price||x.price),0);monthlyData.push({l:mn[d.getMonth()],v:r2(v),hi:i===0,fmt:fmt(r2(v))});}
  const byCat={};soldAll.forEach(i=>{const c=i.category||"Other";byCat[c]=(byCat[c]||0)+(i.sold_price||i.price);});
  const catMax=Math.max(...Object.values(byCat),1);
  const byPlat={};soldAll.forEach(i=>{const p=i.platform||"Other";byPlat[p]=(byPlat[p]||0)+(i.sold_price||i.price);});
  const platMax=Math.max(...Object.values(byPlat),1);
  const byDow={};soldAll.forEach(i=>{const k=dowKey[new Date(getSaleDate(i)).getDay()];byDow[k]=(byDow[k]||0)+(i.sold_price||i.price);});
  const dowMax=Math.max(...Object.values(byDow),1);
  const byMonth={};soldAll.forEach(i=>{const k=getSaleDate(i).slice(0,7);byMonth[k]=(byMonth[k]||0)+(i.sold_price||i.price);});
  const bestMonth=Object.entries(byMonth).sort((a,b)=>b[1]-a[1])[0];
  const withDates=inv.filter(i=>i.sold&&i.sold_at&&i.created_at);
  const avgDays=withDates.length?Math.round(withDates.reduce((s,i)=>s+Math.max(0,Math.floor((new Date(i.sold_at)-new Date(i.created_at))/86400000)),0)/withDates.length):null;
  const topItems=[...soldAll].filter(i=>i.cost!=null).sort((a,b)=>((b.sold_price||b.price)-b.cost)-((a.sold_price||a.price)-a.cost)).slice(0,5);
  return<div>
    <PageHdr title="Analytics" sub="INSIGHTS"/>
    <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
      {[["overview","Overview"],["platforms","Platforms"],["categories","Categories"],["trends","Trends"]].map(([id,l])=>(
        <button key={id} onClick={()=>setView(id)} style={{padding:"7px 16px",borderRadius:20,border:`1.5px solid ${view===id?C.accent:C.border2}`,background:view===id?C.accentL:"transparent",color:view===id?C.accent:C.text2,fontWeight:view===id?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
      ))}
    </div>
    {view==="overview"&&<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
        <StatCard icon="💰" label="Total Revenue" value={fmt(totalRev)} color={C.accent}/>
        <StatCard icon="💹" label="Total Profit" value={fmt(totalProfit)} color={C.green}/>
        <StatCard icon="📦" label="Items Sold" value={soldAll.length} color={C.purple}/>
        <StatCard icon="📈" label="Avg Sale" value={soldAll.length?fmt(r2(totalRev/soldAll.length)):"—"} color={C.blue}/>
        <StatCard icon="⏱️" label="Avg Days to Sell" value={avgDays!=null?`${avgDays}D`:"—"} color={C.gold}/>
        <StatCard icon="🔄" label="Sell-Through" value={`${pct(soldAll.length,inv.length)}%`} color={C.teal}/>
      </div>
      <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Revenue — Last 12 Months</div><BarChart data={monthlyData} color={C.accent} h={110}/></>} style={{marginBottom:16}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Key Stats</div>
          {[{l:"Best month",v:bestMonth?`${bestMonth[0]} (${fmt(bestMonth[1])})`:"—",hi:true},{l:"Avg days to sell",v:avgDays!=null?`${avgDays} days`:"—"},{l:"Total expenses",v:fmt(totalExp)},{l:"Net profit",v:fmt(totalProfit),hi:true}].map(s=><div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:12,color:C.text2}}>{s.l}</span><span style={{fontSize:13,fontWeight:700,color:s.hi?C.accent:C.text}}>{s.v}</span></div>)}
        </>}/>
        <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Day of Week</div>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><HBar key={d} label={d} value={byDow[d]||0} max={dowMax} color={C.purple} display={fmt(byDow[d]||0)}/>)}
        </>}/>
      </div>
    </>}
    {view==="platforms"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Revenue by Platform</div>{Object.entries(byPlat).sort((a,b)=>b[1]-a[1]).map(([p,v])=><HBar key={p} label={p} value={v} max={platMax} color={C.accent} display={fmt(v)}/>)}</>}/>
      <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Platform Stats</div>
        {Object.entries(byPlat).sort((a,b)=>b[1]-a[1]).map(([p,v])=>{const count=soldAll.filter(i=>i.platform===p).length;return<div key={p} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:12,color:C.text2}}>{p}</span><span style={{fontSize:12,color:C.text}}>{count} sales · {fmt(r2(v/count))} avg</span></div>;})}
      </>}/>
    </div>}
    {view==="categories"&&<Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Revenue by Category</div>{Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([c,v])=><HBar key={c} label={c} value={v} max={catMax} color={C.teal} display={fmt(v)}/>)}</>}/>}
    {view==="trends"&&<>
      <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Revenue Trend (12 months)</div><BarChart data={monthlyData} color={C.accent} h={120}/></>} style={{marginBottom:16}}/>
      {topItems.length>0&&<Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Top Items by Profit</div>
        {topItems.map((i,idx)=><div key={i.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:12,color:C.text3,width:16,textAlign:"right"}}>{idx+1}.</span>
          <div style={{flex:1,overflow:"hidden"}}><div style={{fontSize:13,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.title}</div><div style={{fontSize:11,color:C.text3}}>{i.sku} · {i.platform||"—"}</div></div>
          <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:13,fontWeight:700,color:C.green}}>{fmt(r2((i.sold_price||i.price)-i.cost))}</div><div style={{fontSize:11,color:C.text3}}>profit</div></div>
        </div>)}
      </>}/>}
    </>}
  </div>;
}
function TaxSummary({inv,exp}){
  const[yr,setYr]=useState("2025/26");
  const YEARS=["2024/25","2025/26","2026/27","2027/28","2028/29"];
  const y1=parseInt(yr.split("/")[0]);
  const start=new Date(`${y1}-04-06`);const end=new Date(`${y1+1}-04-05T23:59:59`);
  const yrSales=inv.filter(i=>i.sold&&getSaleDate(i)).filter(i=>{const d=new Date(getSaleDate(i));return d>=start&&d<=end;});
  const yrExp=exp.filter(e=>{const d=new Date(e.date);return d>=start&&d<=end;});
  const totalSales=r2(yrSales.reduce((s,i)=>s+(i.sold_price||i.price),0));
  const totalCosts=r2(yrSales.filter(i=>i.cost).reduce((s,i)=>s+i.cost,0));
  const totalExp=r2(yrExp.reduce((s,e)=>s+e.amount,0));
  const grossProfit=r2(totalSales-totalCosts);
  const netProfit=r2(grossProfit-totalExp);
  const taxableIncome=Math.max(0,netProfit-TRADING_ALLOWANCE);
  const basicTax=taxableIncome>PERSONAL_ALLOWANCE?r2(Math.min(taxableIncome-PERSONAL_ALLOWANCE,50270-PERSONAL_ALLOWANCE)*0.20):0;
  const higherTax=taxableIncome>50270?r2((taxableIncome-50270)*0.40):0;
  const ni=taxableIncome>12570?r2((Math.min(taxableIncome,50270)-12570)*0.09):0;
  const totalTax=r2(basicTax+higherTax+ni);
  const MN=["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
  const periods=MN.map((l,i)=>{
    const [mm,yy]=i<9?[i+4,y1]:[i-8,y1+1];
    const s=new Date(`${yy}-${String(mm).padStart(2,"0")}-01`);
    const e=new Date(yy,mm,0,23,59,59);
    return{l,s,e};
  });
  const exportCSV=()=>{
    const rows=[["Type","Date","Description","Amount","Category"]];
    yrSales.forEach(s=>rows.push(["Sale",getSaleDate(s),s.title||"Sale",s.sold_price||s.price,""]));
    yrExp.forEach(e=>rows.push(["Expense",e.date,e.description,e.amount,e.category||""]));
    const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download=`vaultr_tax_${yr.replace("/","_")}.csv`;a.click();
  };
  return<div>
    <AlertBox type="warning" ch="This is an organisational tool only — not financial or tax advice. Consult a qualified professional."/>
    <PageHdr title="Tax Summary" sub="INSIGHTS" action={<Btn ch="Export CSV" onClick={exportCSV} variant="ghost"/>}/>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
      {YEARS.map(y=><button key={y} onClick={()=>setYr(y)} style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${yr===y?C.accent:C.border2}`,background:yr===y?C.accentL:"transparent",color:yr===y?C.accent:C.text2,fontWeight:yr===y?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{y}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
      <StatCard icon="💰" label="Gross Sales" value={fmt(totalSales)} color={C.blue}/>
      <StatCard icon="📦" label="Cost of Goods" value={fmt(totalCosts)} color={C.gold}/>
      <StatCard icon="💹" label="Gross Profit" value={fmt(grossProfit)} color={C.green}/>
      <StatCard icon="🧾" label="Expenses" value={fmt(totalExp)} color={C.red}/>
      <StatCard icon="✅" label="Net Profit" value={fmt(netProfit)} color={netProfit>=0?C.green:C.red}/>
      <StatCard icon="🏛️" label="Est. Tax+NI" value={fmt(totalTax)} sub="Estimate only" color={C.purple}/>
    </div>
    <Card ch={<>
      <div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Tax Breakdown</div>
      {[{l:"Net profit",v:fmt(netProfit)},{l:"Less trading allowance",v:`- ${fmt(TRADING_ALLOWANCE)}`},{l:"Taxable income",v:fmt(taxableIncome),hi:true},{l:"Income tax (20% basic rate)",v:fmt(basicTax)},{l:"Income tax (40% higher rate)",v:fmt(higherTax)},{l:"Class 4 NI (9%)",v:fmt(ni)},{l:"Total estimated liability",v:fmt(totalTax),hi:true}].map(s=><div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:12,color:C.text2}}>{s.l}</span><span style={{fontSize:13,fontWeight:700,color:s.hi?C.accent:C.text}}>{s.v}</span></div>)}
    </>} style={{marginBottom:20}}/>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{overflowX:"auto"}}>
        <table>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`,background:C.card2}}>{["Period","Sales","Expenses","Net"].map(h=><th key={h} style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em"}}>{h}</th>)}</tr></thead>
          <tbody>{periods.map(p=>{
            const ps=r2(yrSales.filter(s=>{const d=new Date(getSaleDate(s));return d>=p.s&&d<=p.e;}).reduce((s,i)=>s+(i.sold_price||i.price),0));
            const pe=r2(yrExp.filter(e=>{const d=new Date(e.date);return d>=p.s&&d<=p.e;}).reduce((s,e)=>s+e.amount,0));
            const net=r2(ps-pe);
            return<tr key={p.l} style={{borderBottom:`1px solid ${C.border}`}}>
              <td style={{color:C.text2}}>{p.l}</td>
              <td style={{color:ps>0?C.green:C.text3,fontWeight:ps>0?700:400}}>{ps>0?fmt(ps):"—"}</td>
              <td style={{color:pe>0?C.red:C.text3,fontWeight:pe>0?700:400}}>{pe>0?fmt(pe):"—"}</td>
              <td style={{color:net>=0?C.green:C.red,fontWeight:700}}>{ps>0||pe>0?fmt(net):"—"}</td>
            </tr>;
          })}</tbody>
          <tfoot><tr style={{borderTop:`1px solid ${C.border}`,background:C.card2}}>
            <td style={{color:C.text2,fontWeight:700}}>Total</td>
            <td style={{color:C.green,fontWeight:700}}>{fmt(totalSales)}</td>
            <td style={{color:C.red,fontWeight:700}}>{fmt(totalExp)}</td>
            <td style={{color:netProfit>=0?C.green:C.red,fontWeight:700}}>{fmt(netProfit)}</td>
          </tr></tfoot>
        </table>
      </div>
    </div>
  </div>;
}
function Targets({inv,exp,tgts,biz,reload}){
  const[showAdd,setShowAdd]=useState(false);const[label,setLabel]=useState("");const[targetRev,setTargetRev]=useState("");const[targetItems,setTargetItems]=useState("");const[period,setPeriod]=useState("monthly");const[busy,setBusy]=useState(false);
  const now=new Date();
  const monthStart=new Date(now.getFullYear(),now.getMonth(),1);
  const yearStart=new Date(now.getFullYear(),0,1);
  const soldAll=inv.filter(i=>i.sold&&getSaleDate(i));
  const monthSales=soldAll.filter(i=>new Date(getSaleDate(i))>=monthStart);
  const yearSales=soldAll.filter(i=>new Date(getSaleDate(i))>=yearStart);
  const monthRev=r2(monthSales.reduce((s,i)=>s+(i.sold_price||i.price),0));
  const yearRev=r2(yearSales.reduce((s,i)=>s+(i.sold_price||i.price),0));
  const save=async()=>{
    if(!label.trim())return;setBusy(true);
    await supabase.from("targets").insert([{business_id:biz.id,label:label.trim(),target_revenue:targetRev?r2(parseFloat(targetRev)):null,target_items:targetItems?parseInt(targetItems):null,period}]);
    setLabel("");setTargetRev("");setTargetItems("");setShowAdd(false);reload();setBusy(false);
  };
  const del=async id=>{await supabase.from("targets").delete().eq("id",id);reload();};
  const getProgress=t=>{
    const sales=t.period==="monthly"?monthSales:yearSales;
    const rev=r2(sales.reduce((s,i)=>s+(i.sold_price||i.price),0));
    const items=sales.length;
    return{rev,items,revPct:t.target_revenue?pct(rev,t.target_revenue):null,itemsPct:t.target_items?pct(items,t.target_items):null};
  };
  return<div>
    <PageHdr title="Targets" sub="INSIGHTS" action={<Btn ch="+ Add Target" onClick={()=>setShowAdd(true)}/>}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
      <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>This Month</div><div style={{fontSize:28,fontWeight:900,color:C.accent,marginBottom:4}}>{fmt(monthRev)}</div><div style={{fontSize:12,color:C.text2}}>{monthSales.length} items sold</div></>}/>
      <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>This Year</div><div style={{fontSize:28,fontWeight:900,color:C.accent,marginBottom:4}}>{fmt(yearRev)}</div><div style={{fontSize:12,color:C.text2}}>{yearSales.length} items sold</div></>}/>
    </div>
    {tgts.length===0&&!showAdd&&<Card ch={<div style={{textAlign:"center",padding:"32px 0",color:C.text3}}>No targets set yet. Add your first target to track progress.</div>}/>}
    {tgts.map(t=>{const{rev,items,revPct,itemsPct}=getProgress(t);return<Card key={t.id} ch={<>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div><div style={{fontSize:15,fontWeight:700,color:C.text}}>{t.label}</div><div style={{fontSize:11,color:C.text3,marginTop:3,textTransform:"capitalize"}}>{t.period}</div></div>
        <Btn ch="×" onClick={()=>del(t.id)} variant="ghost" small/>
      </div>
      {t.target_revenue&&<div style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span style={{color:C.text2}}>Revenue</span><span style={{color:C.text,fontWeight:600}}>{fmt(rev)} / {fmt(t.target_revenue)} ({revPct}%)</span></div>
        <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(revPct,100)}%`,background:`linear-gradient(90deg,${C.accent}88,${C.accent})`,borderRadius:4,transition:"width 0.5s"}}/></div>
      </div>}
      {t.target_items&&<div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span style={{color:C.text2}}>Items</span><span style={{color:C.text,fontWeight:600}}>{items} / {t.target_items} ({itemsPct}%)</span></div>
        <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(itemsPct,100)}%`,background:`linear-gradient(90deg,${C.purple}88,${C.purple})`,borderRadius:4,transition:"width 0.5s"}}/></div>
      </div>}
    </>} style={{marginBottom:12}}/>;})}
    {showAdd&&<Modal title="New Target" onClose={()=>setShowAdd(false)} ch={
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Input label="Target Name" req placeholder="e.g. Q2 Revenue Goal" value={label} onChange={e=>setLabel(e.target.value)}/>
        <Sel label="Period" ch={[["monthly","Monthly"],["yearly","Yearly"]].map(([v,l])=><option key={v} value={v}>{l}</option>)} value={period} onChange={e=>setPeriod(e.target.value)}/>
        <Input label="Revenue Target (£)" type="number" placeholder="e.g. 2000" value={targetRev} onChange={e=>setTargetRev(e.target.value)}/>
        <Input label="Items Target" type="number" placeholder="e.g. 50" value={targetItems} onChange={e=>setTargetItems(e.target.value)}/>
        <div style={{display:"flex",gap:8}}><Btn ch={busy?"Saving…":"Create"} onClick={save} disabled={busy||!label.trim()} full/><Btn ch="Cancel" onClick={()=>setShowAdd(false)} variant="ghost"/></div>
      </div>
    }/>}
  </div>;
}
function Settings({biz,bizList,onBizChange,onBizCreated,onBizDeleted,onOut}){
  const[tab,setTab]=useState("businesses");const[editBiz,setEditBiz]=useState(null);const[bizName,setBizName]=useState("");const[bizDesc,setBizDesc]=useState("");const[busy,setBusy]=useState(false);const[user,setUser]=useState(null);
  useEffect(()=>{supabase.auth.getUser().then(({data})=>setUser(data.user));},[]);
  const saveEdit=async()=>{
    if(!editBiz||!bizName.trim())return;setBusy(true);
    await supabase.from("businesses").update({name:bizName.trim(),description:bizDesc.trim()||null}).eq("id",editBiz.id);
    onBizCreated();setEditBiz(null);setBusy(false);
  };
  const delBiz=async b=>{
    if(!window.confirm(`Delete "${b.name}" and all its data permanently?`))return;
    await supabase.from("businesses").delete().eq("id",b.id);onBizDeleted();
  };
  return<div>
    <PageHdr title="Settings" sub="ACCOUNT"/>
    <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
      {[["businesses","Businesses"],["account","Account"]].map(([id,l])=>(
        <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 16px",borderRadius:20,border:`1.5px solid ${tab===id?C.accent:C.border2}`,background:tab===id?C.accentL:"transparent",color:tab===id?C.accent:C.text2,fontWeight:tab===id?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
      ))}
    </div>
    {tab==="businesses"&&<>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
        {bizList.map(b=><Card key={b.id} ch={<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:b.colour||C.accent,flexShrink:0}}/>
            <div><div style={{fontSize:14,fontWeight:600,color:biz?.id===b.id?C.accent:C.text}}>{b.name}{biz?.id===b.id&&<span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:C.accentL,color:C.accent,marginLeft:8}}>Active</span>}</div>{b.description&&<div style={{fontSize:11,color:C.text3,marginTop:2}}>{b.description}</div>}</div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <Btn ch="Switch" onClick={()=>onBizChange(b)} variant="ghost" small/>
            <Btn ch="Edit" onClick={()=>{setEditBiz(b);setBizName(b.name);setBizDesc(b.description||"");}} variant="ghost" small/>
            <Btn ch="Delete" onClick={()=>delBiz(b)} variant="danger" small/>
          </div>
        </div>}/>)}
      </div>
      <Card ch={<><div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Add New Business</div><CreateBizForm onDone={onBizCreated}/></>}/>
    </>}
    {tab==="account"&&<Card ch={<>
      <div style={{fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Account Details</div>
      <div style={{display:"flex",flexDirection:"column",gap:0,marginBottom:20}}>
        {[["Email",user?.email||"—"],["Name",user?.user_metadata?.full_name||"—"],["Businesses",bizList.length]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:13,color:C.text2}}>{l}</span><span style={{fontSize:13,color:C.text}}>{v}</span></div>)}
      </div>
      <Btn ch="Sign Out" onClick={onOut} variant="danger" full/>
    </>}/>}
    {editBiz&&<Modal title={`Edit: ${editBiz.name}`} onClose={()=>setEditBiz(null)} ch={
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Input label="Business Name" req value={bizName} onChange={e=>setBizName(e.target.value)}/>
        <Input label="Description" value={bizDesc} onChange={e=>setBizDesc(e.target.value)}/>
        <div style={{display:"flex",gap:8}}><Btn ch={busy?"Saving…":"Save"} onClick={saveEdit} disabled={busy||!bizName.trim()} full/><Btn ch="Cancel" onClick={()=>setEditBiz(null)} variant="ghost"/></div>
      </div>
    }/>}
  </div>;
}
