import { useState, useEffect, useRef, useCallback } from "react";

const POINTS_START = 100;
const POINTS_PER_READ = 20;
const LS_USERS = "jb_users";
const LS_GAMES = "jb_games";
const LS_SESSION = "jb_session";

const BGS = [
  { id:"bg1", name:"สวนดอกไม้", emoji:"🌸", color:"linear-gradient(135deg,#ffd6e7,#ffecf5)" },
  { id:"bg2", name:"โรงเรียน",  emoji:"🏫", color:"linear-gradient(135deg,#d6eaff,#eef6ff)" },
  { id:"bg3", name:"ร้านกาแฟ", emoji:"☕", color:"linear-gradient(135deg,#ffe8cc,#fff5e6)" },
  { id:"bg4", name:"ชายหาด",   emoji:"🏖️", color:"linear-gradient(135deg,#c8f0ff,#e0f8ff)" },
  { id:"bg5", name:"สวนสาธารณะ",emoji:"🌳",color:"linear-gradient(135deg,#d4f5d4,#ecfcec)" },
  { id:"bg6", name:"กลางคืน",  emoji:"🌙", color:"linear-gradient(135deg,#2d1b69,#11092e)", dark:true },
  { id:"bg7", name:"ห้องนอน",  emoji:"🛏️", color:"linear-gradient(135deg,#ffe4f0,#ffd6ea)" },
  { id:"bg8", name:"สนามกีฬา", emoji:"🏟️", color:"linear-gradient(135deg,#e8f5e8,#d0efd0)" },
];
const CHARS = [
  {id:"c1",name:"มิน",emoji:"👩‍🦰"},{id:"c2",name:"แนน",emoji:"👩‍🦱"},
  {id:"c3",name:"เจน",emoji:"👩‍🦳"},{id:"c4",name:"บีม",emoji:"🧑‍🦱"},
  {id:"c5",name:"โฟล์ค",emoji:"👱"},{id:"c6",name:"ดิว",emoji:"🧑‍🦲"},
  {id:"c7",name:"ใหม่",emoji:"👧"},{id:"c8",name:"เก่ง",emoji:"🧑"},
];
const MOODS=[{id:"happy",label:"😊 ยิ้ม"},{id:"shock",label:"😳 ตกใจ"},{id:"love",label:"😍 หลงรัก"},{id:"neutral",label:"😒 เฉย"},{id:"sad",label:"😢 เศร้า"},{id:"fun",label:"😄 สนุก"},{id:"angry",label:"😠 โกรธ"},{id:"shy",label:"🥺 อาย"}];
const GENRE_TAGS=["โรแมนติก","ตลก","ซึ้ง","แอคชั่น","ลึกลับ","แฟนตาซี","สยองขวัญ","ชีวิตชีวิต"];
const TONE_TAGS=["อบอุ่น","เร้าใจ","สดใส","มืดหม่น","ตลกขำ","น้ำเน่า","แซ่บ","18+"];
const BUILTIN_MG=[
  {id:"balloon",name:"ป่าโป่ง",icon:"🎈",desc:"คลิกลูกโป่งให้แตก 7/10 ลูก"},
  {id:"shoot",name:"ยิงเป้า",icon:"🎯",desc:"คลิกเป้าให้ได้ 5 ใน 10 วินาที"},
  {id:"memory",name:"จับคู่ไพ่",icon:"🃏",desc:"จำและจับคู่ภาพให้ครบ"},
  {id:"tapheart",name:"แตะหัวใจ",icon:"❤️",desc:"แตะหัวใจให้ได้ 8 ดวง"},
  {id:"wordguess",name:"ทายคำ",icon:"💬",desc:"ทายคำความรัก"},
  {id:"quiz",name:"ควิซความรัก",icon:"💘",desc:"ตอบคำถามความรัก 3 ข้อ"},
];
const STICKERS=[
  {emoji:"🌸",l:"ซากุระ"},{emoji:"⭐",l:"ดาว"},{emoji:"❤️",l:"หัวใจ"},
  {emoji:"🌙",l:"จันทร์"},{emoji:"🌈",l:"รุ้ง"},{emoji:"💫",l:"แสงวาว"},
  {emoji:"🎀",l:"โบว์"},{emoji:"🌷",l:"ทิวลิป"},{emoji:"🦋",l:"ผีเสื้อ"},
  {emoji:"☁️",l:"เมฆ"},{emoji:"🍓",l:"สตรอว์เบอร์รี"},{emoji:"🎵",l:"โน้ตเพลง"},
  {emoji:"✨",l:"ประกาย"},{emoji:"🔥",l:"ไฟ"},{emoji:"💎",l:"เพชร"},
];
const REL_LEVELS=[
  {min:0,max:19,label:"คนแปลกหน้า",color:"#94a3b8",emoji:"😶"},
  {min:20,max:49,label:"รู้จักกัน",color:"#60a5fa",emoji:"😊"},
  {min:50,max:79,label:"เพื่อนสนิท",color:"#a78bfa",emoji:"😄"},
  {min:80,max:99,label:"ชอบกัน",color:"#f472b6",emoji:"🥰"},
  {min:100,max:9999,label:"คู่รัก 💑",color:"#ff6b9d",emoji:"💑"},
];

const gid=()=>Math.random().toString(36).slice(2,9);
const lsGet=(k,fb)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
const getRL=pts=>REL_LEVELS.find(l=>pts>=l.min&&pts<=l.max)||REL_LEVELS[0];

// ── ระบบเติมเงิน ──────────────────────────────────────────────────────────────
const ADMIN_EMAIL  = "longlenniyai@gmail.com";
const ADMIN_USER   = "fanas";
const ADMIN_PASS   = "topmimex1234";
const BANK_KBANK   = "184-3-50232-2";
const WALLET_NUM   = "081-327-1371";

const TOPUP_PACKAGES = [
  { baht:20,  points:120,  bonus:0 },
  { baht:50,  points:320,  bonus:20 },
  { baht:100, points:700,  bonus:100 },
  { baht:200, points:1500, bonus:300 },
  { baht:300, points:2400, bonus:600 },
  { baht:500, points:4200, bonus:700 },
  { baht:700, points:6000, bonus:1000 },
  { baht:1000,points:8800, bonus:1800 },
  { baht:1200,points:11000,bonus:2600 },
];

const MEMBER_PLAN = {
  baht:100, bonusFirst:200, dailyPoints:50, label:"สมาชิกรายเดือน",
};

const LS_TOPUP_REQUESTS = "jb_topup_requests";

// ── EmailJS config — ส่งจาก longlenniyai@gmail.com ───────────────────────────
// วิธีตั้งค่า (ทำครั้งเดียว):
// 1. ไป https://www.emailjs.com → Sign Up ฟรี
// 2. Email Services → Add Service → Gmail → เชื่อมต่อ longlenniyai@gmail.com → Copy "Service ID"
// 3. Email Templates → Create Template → ใส่:
//      To:      {{to_email}}
//      Subject: รหัส OTP จีบเลย!
//      Body:    รหัส OTP ของคุณคือ: {{otp_code}} (หมดอายุใน 2 นาที)
//    → Save → Copy "Template ID"
// 4. Account → General → Copy "Public Key"
// 5. แทนค่าใน 3 บรรทัดด้านล่าง แล้ว save โค้ดใหม่
const EMAILJS_SERVICE_ID  = "service_jibluy";   // ← วางค่า Service ID ที่นี่
const EMAILJS_TEMPLATE_ID = "template_otp";     // ← วางค่า Template ID ที่นี่
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";  // ← วางค่า Public Key ที่นี่
// โหลด EmailJS SDK
const loadEmailJS = () => new Promise((res,rej)=>{
  if(window.emailjs){res();return;}
  const s=document.createElement("script");
  s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  s.onload=()=>{window.emailjs.init(EMAILJS_PUBLIC_KEY);res();}
  s.onerror=rej;
  document.head.appendChild(s);
});

const sendOTPEmail = async(toEmail, otp)=>{
  await loadEmailJS();
  return window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: toEmail,
    otp_code: otp,
    app_name:  "จีบเลย!",
    from_name: "ทีมงานจีบเลย",
  });
};

const S={
  inp:{width:"100%",boxSizing:"border-box",padding:"9px 12px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",fontSize:14,fontFamily:"Sarabun,sans-serif",color:"var(--color-text-primary)"},
  pink:{background:"#ff6b9d",border:"none",color:"#fff",borderRadius:20,padding:"7px 16px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:13},
  out:(d=false)=>({background:"none",border:`0.5px solid ${d?"var(--color-border-danger)":"var(--color-border-secondary)"}`,borderRadius:20,padding:"6px 14px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:13,color:d?"var(--color-text-danger)":"var(--color-text-secondary)"}),
};

// ═══ APP ROOT ═════════════════════════════════════════════════════════════════
export default function App(){
  const [screen,setScreen]=useState("home");
  const [user,setUser]=useState(null);
  const [users,setUsers]=useState(()=>lsGet(LS_USERS,{}));
  const [games,setGames]=useState(()=>lsGet(LS_GAMES,[]));
  const [authMode,setAuthMode]=useState("login");
  const [authForm,setAuthForm]=useState({username:"",password:""});
  const [authError,setAuthError]=useState("");
  const [playing,setPlaying]=useState(null);
  const [creating,setCreating]=useState(null);
  const [notif,setNotif]=useState(null);
  const [prefModal,setPrefModal]=useState(false);
  const [prefs,setPrefs]=useState({genres:[],tones:[]});
  const [filterOn,setFilterOn]=useState(false);

  const [confirmModal,setConfirmModal]=useState(null);
  const [detailGame,  setDetailGame] =useState(null); // game to show detail screen

  useEffect(()=>{
    const s=lsGet(LS_SESSION,null);
    if(s){const u=lsGet(LS_USERS,{})[s];if(u){setUser(u);if(u.prefs)setPrefs(u.prefs);}}
  },[]);

  const notifShow=(msg,type="ok")=>{setNotif({msg,type});setTimeout(()=>setNotif(null),2800);};
  const syncUser=u=>{setUser(u);setUsers(p=>{const n={...p,[u.username]:u};lsSet(LS_USERS,n);return n;});};
  const syncGames=g=>{setGames(g);lsSet(LS_GAMES,g);};

  // ── daily member points ────────────────────────────────────────────────────
  useEffect(()=>{
    if(!user?.isMember) return;
    const today=new Date().toDateString();
    if(user.lastDailyDate===today) return;
    const pts=MEMBER_PLAN.dailyPoints;
    const updated={...user, points:(user.points||0)+pts, lastDailyDate:today};
    syncUser(updated);
    setTimeout(()=>notifShow(`💎 พอยต์สมาชิก VIP วันนี้ +${pts} พอยต์!`), 800);
  },[user?.username, user?.isMember]);

  const isAdmin=u=>u&&(u.email===ADMIN_EMAIL||u.username===ADMIN_USER);

  const doAuth=()=>{
    if(!authForm.username.trim()||!authForm.password.trim()){setAuthError("กรุณากรอกข้อมูลให้ครบ");return;}
    const all=lsGet(LS_USERS,users);

    if(authMode==="register"){
      if(all[authForm.username]){setAuthError("ชื่อนี้มีอยู่แล้ว");return;}
      const nu={
        username:authForm.username, password:authForm.password,
        email:authForm.email||"",
        displayName:authForm.username,
        points:POINTS_START, prefs:{genres:[],tones:[]},
        bio:"", avatar:null, cover:null,
        relationships:{}, totalEarned:0, createdAt:Date.now(),
        isMember:false,
      };
      syncUser(nu); lsSet(LS_SESSION,nu.username);
      notifShow(`ยินดีต้อนรับ! ได้รับ ${POINTS_START} พอยต์ฟรี 🎉`);
    } else {
      // ── admin login: สร้างบัญชีอัตโนมัติถ้ายังไม่มี ──────────────────────
      if(authForm.username===ADMIN_USER){
        if(authForm.password!==ADMIN_PASS){setAuthError("รหัสผ่าน admin ไม่ถูกต้อง");return;}
        const existing=all[ADMIN_USER];
        const adminAccount = existing || {
          username:ADMIN_USER, password:ADMIN_PASS,
          email:ADMIN_EMAIL, displayName:"Admin",
          points:99999, prefs:{genres:[],tones:[]},
          bio:"ผู้ดูแลระบบ", avatar:null, cover:null,
          relationships:{}, totalEarned:0, createdAt:Date.now(),
          isMember:true, isAdminAccount:true,
        };
        if(!existing){ const nu2={...all,[ADMIN_USER]:adminAccount}; setUsers(nu2); lsSet(LS_USERS,nu2); }
        setUser(adminAccount); lsSet(LS_SESSION,ADMIN_USER);
        notifShow("🛡️ เข้าสู่ระบบ Admin สำเร็จ!");
        setAuthError(""); setScreen("home"); return;
      }
      // ── normal user login ──────────────────────────────────────────────────
      const u=all[authForm.username];
      if(!u||u.password!==authForm.password){setAuthError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");return;}
      setUser(u); if(u.prefs)setPrefs(u.prefs); lsSet(LS_SESSION,u.username);
      notifShow(`ยินดีต้อนรับกลับมา, ${u.displayName||u.username}!`);
    }
    setAuthError(""); setScreen("home");
  };

  const doLogout=()=>{setUser(null);lsSet(LS_SESSION,null);setScreen("home");};

  const startPlay=game=>{
    if(!user){setScreen("auth");return;}
    const isOwner=game.author===user.username;
    const rel=user.relationships?.[game.id]||{relPoints:0,playCount:0};
    if(isOwner){setPlaying({game,sceneIndex:0,score:0,relPoints:rel.relPoints,isFree:true});setScreen("play");return;}
    if(user.points<POINTS_PER_READ){notifShow("พอยต์ไม่พอ! ต้องการ 20 พอยต์","err");return;}
    const ru={...user,points:user.points-POINTS_PER_READ};syncUser(ru);
    const cur=lsGet(LS_GAMES,games);const gi=cur.findIndex(g=>g.id===game.id);
    if(gi>=0){
      const g=cur[gi];const rc=(g.readerCount||0)+1;
      const oe=rc>=4?Math.floor(POINTS_PER_READ*0.9):0;
      const ng=[...cur];ng[gi]={...g,readerCount:rc,totalRevenue:(g.totalRevenue||0)+POINTS_PER_READ,ownerRevenue:(g.ownerRevenue||0)+oe};
      syncGames(ng);
      if(oe>0){
        const au=lsGet(LS_USERS,users);const ow=au[g.author];
        if(ow){const ou={...ow,points:(ow.points||0)+oe,totalEarned:(ow.totalEarned||0)+oe};
          const nu2={...au,[g.author]:ou};setUsers(nu2);lsSet(LS_USERS,nu2);
          if(user.username===g.author)setUser(ou);}
      }
      if(rc===4)notifShow("🎉 มีผู้อ่าน 4 คน! เจ้าของเริ่มรับรายได้");
      else if(rc<4)notifShow(`⏳ ผู้อ่าน ${rc}/4 คน`);
    }
    setPlaying({game,sceneIndex:0,score:0,relPoints:rel.relPoints,isFree:false});setScreen("play");
  };

  const finishPlay=(gameId,addedRel)=>{
    if(!user)return;
    const fresh=lsGet(LS_USERS,users)[user.username]||user;
    const rel=fresh.relationships?.[gameId]||{relPoints:0,playCount:0};
    const nr={relPoints:Math.min(100,rel.relPoints+addedRel),playCount:rel.playCount+1,lastPlayed:Date.now()};
    syncUser({...fresh,relationships:{...fresh.relationships,[gameId]:nr}});
  };

  const newGame=()=>{
    if(!user){setScreen("auth");return;}
    setCreating({id:gid(),title:"",description:"",tags:[],
      bg:BGS[0],bgCustom:null,character:CHARS[0],charCustom:null,
      charName:CHARS[0].name,charColor:"#ff6b9d",
      scenes:[],author:user.username,minigames:[],
      cover:{type:"gradient",c1:"#ffd6e7",c2:"#ffb3cf",text:"",textColor:"#fff",textSize:16},
      isPrivate:false, isDraft:false,
      musicUrl:"", musicAutoplay:false, musicLoop:false,
      bonusRelFinish:0, bonusRelSecret:0,
      createdAt:Date.now()});
    setScreen("create");
  };

  const editGame=g=>{setCreating({...g});setScreen("create");};

  const delGame=(id, callerUser)=>{
    const game=games.find(g=>g.id===id);
    if(!game){notifShow("ไม่พบเกมนี้","err");return;}
    const canDel = callerUser && (isAdmin(callerUser) || callerUser.username===game.author);
    if(!canDel){notifShow("คุณไม่มีสิทธิ์ลบเกมนี้","err");return;}
    setConfirmModal({
      title:"ลบเกมนี้?",
      message:`"${game.title}" จะถูกลบถาวร ไม่สามารถกู้คืนได้`,
      danger:true,
      confirmLabel:"ลบเลย",
      onConfirm:()=>{
        const n=games.filter(g=>g.id!==id);
        syncGames(n);
        notifShow("🗑️ ลบเกมแล้ว");
        setConfirmModal(null);
      }
    });
  };

  const publishGame=(game, asDraft=false)=>{
    if(!asDraft && (!game.title.trim()||game.scenes.length===0)){notifShow("ต้องมีชื่อเกม และอย่างน้อย 1 ฉาก","err");return;}
    const prev=lsGet(LS_GAMES,games);const i=prev.findIndex(g=>g.id===game.id);
    const saved={...game, isDraft:asDraft, updatedAt:Date.now()};
    let next;if(i>=0){next=[...prev];next[i]=saved;}else next=[saved,...prev];
    syncGames(next);
    notifShow(asDraft?"💾 บันทึก draft แล้ว":"🎉 เผยแพร่เกมสำเร็จ!");
    setScreen("home");
  };

  const savePref=p=>{setPrefs(p);if(user)syncUser({...user,prefs:p});setPrefModal(false);notifShow("บันทึกความชอบแล้ว ✅");};
  const updateProfile=f=>{syncUser({...user,...f});notifShow("บันทึกโปรไฟล์แล้ว ✅");};

  // ── submit topup request ───────────────────────────────────────────────────
  const submitTopup=(pkg, slipImg, isMember=false)=>{
    if(!user){notifShow("กรุณาล็อกอินก่อน","err"); return;}
    const reqId=gid();
    const newReq={id:reqId, username:user.username, pkg, slipImg, isMember, ts:Date.now(), status:"pending"};
    const reqs=lsGet(LS_TOPUP_REQUESTS,[]);
    lsSet(LS_TOPUP_REQUESTS,[newReq,...reqs]);

    // auto-approve for admin account
    if(isAdmin(user)){
      const pts = isMember ? MEMBER_PLAN.bonusFirst : ((pkg?.points||0)+(pkg?.bonus||0));
      const today=new Date().toDateString();
      const updated={
        ...user,
        points:(user.points||0)+pts,
        ...(isMember?{isMember:true, memberSince:Date.now(), lastDailyDate:today}:{})
      };
      syncUser(updated);
      lsSet(LS_TOPUP_REQUESTS,[{...newReq,status:"completed"},...reqs]);
      notifShow(`🎁 Admin auto: +${pts} พอยต์${isMember?" + VIP สมาชิก":""}`);
      return;
    }
    notifShow("📨 ส่งหลักฐานแล้ว! รอแอดมินตรวจสอบ 5-15 นาที");
  };

  // ── approve topup (called from AdminScreen) ────────────────────────────────
  const approveTopup=(req)=>{
    const all=lsGet(LS_USERS,users);
    const target=all[req.username];
    if(!target){notifShow(`ไม่พบผู้ใช้ ${req.username}`,"err");return;}
    const pts=req.isMember?MEMBER_PLAN.bonusFirst:((req.pkg?.points||0)+(req.pkg?.bonus||0));
    const today=new Date().toDateString();
    const updated={...target, points:(target.points||0)+pts,
      ...(req.isMember?{isMember:true, memberSince:Date.now(), lastDailyDate:today}:{})};
    const newAll={...all,[req.username]:updated};
    setUsers(newAll); lsSet(LS_USERS,newAll);
    if(user?.username===req.username) setUser(updated);
    const reqs=lsGet(LS_TOPUP_REQUESTS,[]);
    lsSet(LS_TOPUP_REQUESTS,reqs.map(r=>r.id===req.id?{...r,status:"completed",approvedAt:Date.now()}:r));
    notifShow(`✅ อนุมัติ +${pts} พอยต์ ให้ ${req.username}${req.isMember?" + VIP":""}`);
  };

  const rejectTopup=(req)=>{
    const reqs=lsGet(LS_TOPUP_REQUESTS,[]);
    lsSet(LS_TOPUP_REQUESTS,reqs.map(r=>r.id===req.id?{...r,status:"rejected"}:r));
    notifShow(`❌ ปฏิเสธ request ของ ${req.username}`,"err");
  };

  // ── admin give points ──────────────────────────────────────────────────────
  const adminGivePoints=(targetUsername,pts,note,giveVip=false)=>{
    const all=lsGet(LS_USERS,users);
    const target=all[targetUsername];
    if(!target){notifShow(`ไม่พบผู้ใช้ ${targetUsername}`,"err");return;}
    const today=new Date().toDateString();
    const updated={...target, points:(target.points||0)+pts,
      ...(giveVip?{isMember:true,memberSince:Date.now(),lastDailyDate:today}:{})};
    const newAll={...all,[targetUsername]:updated};
    setUsers(newAll); lsSet(LS_USERS,newAll);
    if(user?.username===targetUsername) setUser(updated);
    const reqs=lsGet(LS_TOPUP_REQUESTS,[]);
    lsSet(LS_TOPUP_REQUESTS,[{id:gid(),username:targetUsername,pts,note:note||"Admin gift",ts:Date.now(),status:"completed",isManual:true},...reqs]);
    notifShow(`✅ ให้ ${pts} พอยต์${giveVip?" + VIP":""} แก่ ${targetUsername} แล้ว`);
  };

  // games shown on home: exclude private (unless owner) and drafts (unless owner)
  const publicGames = games.filter(g=> {
    if(g.isDraft) return false; // drafts never shown publicly
    if(g.isPrivate) return user && user.username === g.author; // private = owner only
    return true;
  });

  const displayed=filterOn&&(prefs.genres.length||prefs.tones.length)
    ?publicGames.filter(g=>g.tags&&(prefs.genres.some(t=>g.tags.includes(t))||prefs.tones.some(t=>g.tags.includes(t))))
    :publicGames;

  return(
    <div style={{fontFamily:"Sarabun,sans-serif",minHeight:"100vh",background:"var(--color-background-tertiary)"}}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;700&display=swap" rel="stylesheet"/>
      {notif&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:9999,
        background:notif.type==="err"?"var(--color-background-danger)":"var(--color-background-success)",
        color:notif.type==="err"?"var(--color-text-danger)":"var(--color-text-success)",
        padding:"10px 20px",borderRadius:12,fontWeight:500,fontSize:14,whiteSpace:"nowrap",maxWidth:"90vw",
        border:`0.5px solid ${notif.type==="err"?"var(--color-border-danger)":"var(--color-border-success)"}`}}>{notif.msg}</div>}
      {prefModal&&<PrefModal cur={prefs} onSave={savePref} onClose={()=>setPrefModal(false)}/>}
      {confirmModal&&<ConfirmModal {...confirmModal} onCancel={()=>setConfirmModal(null)}/>}
      <Header user={user} onLogout={doLogout} setScreen={setScreen} onPref={()=>setPrefModal(true)}/>
      {screen==="home"    &&<HomeScreen games={displayed} allGames={games} startPlay={(g)=>{setDetailGame(g);setScreen("detail");}} newGame={newGame} user={user} setScreen={setScreen} prefs={prefs} filterOn={filterOn} setFilterOn={setFilterOn} onPref={()=>setPrefModal(true)} editGame={editGame} delGame={delGame}/>}
      {screen==="detail"  &&detailGame&&<GameDetailScreen game={detailGame} user={user} onPlay={()=>startPlay(detailGame)} onBack={()=>setScreen("home")}/>}
      {screen==="auth"    &&<AuthScreen authMode={authMode} setAuthMode={setAuthMode} authForm={authForm} setAuthForm={setAuthForm} authError={authError} setAuthError={setAuthError} doAuth={doAuth} setScreen={setScreen} users={users}/>}
      {screen==="forgot"  &&<ForgotPasswordScreen setScreen={setScreen} allUsers={users} syncAllUsers={u=>{setUsers(u);lsSet(LS_USERS,u);}} notifShow={notifShow}/>}
      {screen==="play"    &&playing&&<PlayScreen data={playing} setData={setPlaying} setScreen={setScreen} notifShow={notifShow} finishPlay={finishPlay}/>}
      {screen==="create"  &&creating&&<CreateScreen game={creating} setGame={setCreating} publish={publishGame} setScreen={setScreen} notifShow={notifShow}/>}
      {screen==="profile" &&user&&<ProfileScreen user={user} games={games} setScreen={setScreen} newGame={newGame} editGame={editGame} delGame={delGame} updateProfile={updateProfile} notifShow={notifShow} syncAllGames={syncGames}/>}
      {screen==="topup"   &&<TopupScreen user={user} setScreen={setScreen} submitTopup={submitTopup} notifShow={notifShow}/>}
      {screen==="admin"   &&user&&isAdmin(user)&&<AdminScreen allUsers={lsGet(LS_USERS,users)} requests={lsGet(LS_TOPUP_REQUESTS,[])} approveTopup={approveTopup} rejectTopup={rejectTopup} adminGivePoints={adminGivePoints} setScreen={setScreen} notifShow={notifShow}/>}
    </div>
  );
}

// ═══ HEADER ══════════════════════════════════════════════════════════════════
function Header({user,onLogout,setScreen,onPref}){
  return(
    <header style={{background:"var(--color-background-primary)",borderBottom:"0.5px solid var(--color-border-tertiary)",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,position:"sticky",top:0,zIndex:100}}>
      <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:22}}>💕</span><span style={{fontWeight:700,fontSize:18,color:"var(--color-text-primary)"}}>จีบเลย!</span>
      </button>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <button onClick={onPref} style={{background:"none",border:"0.5px solid var(--color-border-secondary)",borderRadius:20,padding:"4px 10px",cursor:"pointer",fontSize:13,color:"var(--color-text-primary)"}}>🎨</button>
        {user?(
          <>
            <button onClick={()=>setScreen("topup")} style={{background:"linear-gradient(135deg,#ff6b9d,#ff9eb5)",border:"none",color:"#fff",borderRadius:20,padding:"4px 10px",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif",display:"flex",alignItems:"center",gap:4}}>
              ⭐{user.points} <span style={{fontSize:11,opacity:0.9}}>+เติม</span>
              {user.isMember&&<span style={{background:"rgba(255,255,255,0.3)",borderRadius:10,padding:"0 5px",fontSize:10}}>💎VIP</span>}
            </button>
            <button onClick={()=>setScreen("profile")} style={{background:"none",border:"0.5px solid var(--color-border-secondary)",borderRadius:20,padding:"4px 10px",cursor:"pointer",fontSize:13,color:"var(--color-text-primary)",display:"flex",alignItems:"center",gap:5}}>
              {user.avatar?<img src={user.avatar} style={{width:20,height:20,borderRadius:"50%",objectFit:"cover"}}/>:<span>👤</span>}
              <span style={{maxWidth:70,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.displayName||user.username}</span>
            </button>
            {(user.email===ADMIN_EMAIL||user.username===ADMIN_USER)&&(
              <button onClick={()=>setScreen("admin")} style={{background:"#7c3aed",border:"none",color:"#fff",borderRadius:20,padding:"4px 10px",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif"}}>🛡️</button>
            )}
            <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"var(--color-text-tertiary)"}}>ออก</button>
          </>
        ):<button onClick={()=>setScreen("auth")} style={{...S.pink}}>เข้าสู่ระบบ</button>}
      </div>
    </header>
  );
}

// ═══ PREF MODAL ══════════════════════════════════════════════════════════════
function PrefModal({cur,onSave,onClose}){
  const [p,setP]=useState(cur);
  const toggle=(k,v)=>setP(prev=>({...prev,[k]:prev[k].includes(v)?prev[k].filter(x=>x!==v):[...prev[k],v]}));
  const Group=({label,arr,k})=>(
    <div style={{marginBottom:16}}>
      <p style={{fontSize:13,fontWeight:500,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>{label}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {arr.map(t=>{const s=p[k].includes(t);return <button key={t} onClick={()=>toggle(k,t)} style={{background:s?"#ff6b9d":"var(--color-background-secondary)",color:s?"#fff":"var(--color-text-primary)",border:`1px solid ${s?"#ff6b9d":"var(--color-border-secondary)"}`,borderRadius:20,padding:"4px 12px",cursor:"pointer",fontSize:13,fontFamily:"Sarabun,sans-serif"}}>{t}</button>;})}
      </div>
    </div>
  );
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"var(--color-background-primary)",borderRadius:20,padding:24,width:"100%",maxWidth:460,maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h3 style={{margin:0,fontSize:18}}>🎨 ความชอบของฉัน</h3>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--color-text-secondary)"}}>✕</button>
        </div>
        <Group label="ประเภทเกม" arr={GENRE_TAGS} k="genres"/>
        <Group label="โทนเรื่อง" arr={TONE_TAGS} k="tones"/>
        <button onClick={()=>onSave(p)} style={{...S.pink,width:"100%",padding:12,fontSize:15,fontWeight:700,borderRadius:12,marginTop:8}}>บันทึกความชอบ ✅</button>
      </div>
    </div>
  );
}

// ═══ GAME CARD ════════════════════════════════════════════════════════════════
function GameCard({game,startPlay,user,editGame,delGame}){
  const isOwner=user&&game.author===user.username;
  const canDel=user&&(isOwner||user.email===ADMIN_EMAIL||user.username===ADMIN_USER);
  const rc=game.readerCount||0;
  const cv=game.cover||{type:"gradient",c1:"#ffd6e7",c2:"#ffb3cf"};
  const bgS=game.bgCustom?{backgroundImage:`url(${game.bgCustom})`,backgroundSize:"cover",backgroundPosition:"center"}
    :{background:cv.type==="gradient"?`linear-gradient(135deg,${cv.c1||"#ffd6e7"},${cv.c2||"#ffb3cf"})`:(cv.solidColor||game.bg.color)};
  return(
    <div style={{background:"var(--color-background-primary)",borderRadius:16,border:"0.5px solid var(--color-border-tertiary)",overflow:"hidden",position:"relative",cursor:"pointer"}}>
      <div onClick={()=>startPlay(game)} style={{height:130,position:"relative",overflow:"hidden",...bgS}}>
        {cv.text&&<div style={{position:"absolute",top:8,left:0,right:0,textAlign:"center",fontSize:cv.textSize||14,fontWeight:700,color:cv.textColor||"#fff",textShadow:"0 1px 4px rgba(0,0,0,0.5)",padding:"0 8px",zIndex:2}}>{cv.text}</div>}
        {(game.scenes[0]?.objects||[]).sort((a,b)=>(a.zIndex||0)-(b.zIndex||0)).map(obj=>(
          <div key={obj.id} style={{position:"absolute",left:`${obj.x||0}%`,top:`${obj.y||0}%`,width:obj.w||60,height:obj.h||60,zIndex:obj.zIndex||1,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {obj.src?<img src={obj.src} style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<span style={{fontSize:Math.min(obj.w||50,obj.h||50)*0.65,lineHeight:1}}>{obj.emoji}</span>}
          </div>
        ))}
        {!game.scenes[0]?.objects?.find(o=>o.type==="character")&&(
          game.charCustom?<img src={game.charCustom} style={{position:"absolute",right:8,bottom:0,height:88,objectFit:"contain",zIndex:1}}/>
            :<span style={{position:"absolute",right:8,bottom:4,fontSize:38,zIndex:1}}>{game.character.emoji}</span>
        )}
        {!game.bgCustom&&cv.type==="gradient"&&<span style={{position:"absolute",left:10,bottom:8,fontSize:36,opacity:0.3}}>{game.bg.emoji}</span>}
        {(game.minigames?.length>0)&&<span style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.45)",color:"#fff",fontSize:10,padding:"2px 7px",borderRadius:8,zIndex:3}}>🎮</span>}
        {/* ปุ่มแก้ไข — เจ้าของเท่านั้น */}
        {isOwner&&<button onClick={e=>{e.stopPropagation();editGame(game);}} style={{position:"absolute",top:6,right:6,background:"rgba(255,107,157,0.92)",border:"none",color:"#fff",borderRadius:10,padding:"3px 9px",cursor:"pointer",fontSize:11,fontFamily:"Sarabun,sans-serif",zIndex:3}}>✏️ แก้ไข</button>}
        {/* ปุ่มลบ — เจ้าของ + admin */}
        {canDel&&<button onClick={e=>{e.stopPropagation();delGame(game.id,user);}} style={{position:"absolute",bottom:6,right:6,background:"rgba(239,68,68,0.85)",border:"none",color:"#fff",borderRadius:10,padding:"3px 9px",cursor:"pointer",fontSize:11,fontFamily:"Sarabun,sans-serif",zIndex:3}}>🗑️ ลบ</button>}
      </div>
      <div onClick={()=>startPlay(game)} style={{padding:"9px 12px 10px"}}>
        <p style={{fontWeight:600,margin:"0 0 2px",fontSize:14,color:"var(--color-text-primary)"}}>{game.title}</p>
        <p style={{fontSize:11,color:"var(--color-text-secondary)",margin:"0 0 5px"}}>โดย {game.author} · {game.scenes.length} ฉาก</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{background:"var(--color-background-info)",color:"var(--color-text-info)",fontSize:11,padding:"2px 7px",borderRadius:8}}>{isOwner?"🆓 อ่านฟรี":"⭐ 20 พอยต์"}</span>
          <span style={{fontSize:10,color:rc>=4?"#22c55e":"var(--color-text-tertiary)"}}>{rc>=4?`💰 ${rc} คน`:`👥 ${rc}/4`}</span>
        </div>
      </div>
    </div>
  );
}

// ═══ HOME SCREEN ══════════════════════════════════════════════════════════════
function HomeScreen({games,allGames,startPlay,newGame,user,setScreen,prefs,filterOn,setFilterOn,onPref,editGame,delGame}){
  const hasPref=prefs.genres.length||prefs.tones.length;
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"16px"}}>
      <div style={{textAlign:"center",padding:"16px 0 12px"}}>
        <div style={{fontSize:44}}>💕</div>
        <h1 style={{fontSize:24,fontWeight:700,margin:"6px 0 4px",color:"var(--color-text-primary)"}}>จีบเลย!</h1>
        <p style={{color:"var(--color-text-secondary)",fontSize:14,margin:0}}>เกมจีบสาว-หนุ่ม สร้างเองได้ง่ายๆ!</p>
      </div>
      {hasPref&&<div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"8px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>🎨</span>
        {[...prefs.genres,...prefs.tones].slice(0,5).map(t=><span key={t} style={{background:"#ff6b9d",color:"#fff",fontSize:11,padding:"2px 9px",borderRadius:20}}>{t}</span>)}
        <button onClick={onPref} style={{background:"none",border:"none",fontSize:12,color:"#ff6b9d",cursor:"pointer",marginLeft:"auto"}}>แก้ไข</button>
      </div>}
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        <button onClick={newGame} style={{flex:1,minWidth:140,...S.pink,borderRadius:12,padding:"13px 16px",fontSize:15,fontWeight:700}}>✏️ สร้างเกมใหม่</button>
        {!user&&<button onClick={()=>setScreen("auth")} style={{flex:1,minWidth:140,background:"none",border:"0.5px solid var(--color-border-secondary)",color:"var(--color-text-primary)",borderRadius:12,padding:"13px 16px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:14}}>สมัครรับ 100 พอยต์ฟรี ⭐</button>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <h2 style={{fontSize:15,fontWeight:500,margin:0}}>{filterOn&&hasPref?"เกมตามความชอบ":"เกมทั้งหมด"}{filterOn&&hasPref&&<span style={{fontSize:12,color:"var(--color-text-secondary)",marginLeft:6}}>({games.length}/{allGames.length})</span>}</h2>
        {hasPref&&<button onClick={()=>setFilterOn(f=>!f)} style={{background:filterOn?"#ff6b9d":"none",border:"0.5px solid var(--color-border-secondary)",color:filterOn?"#fff":"var(--color-text-secondary)",borderRadius:20,padding:"4px 12px",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif"}}>{filterOn?"🔍 กรองอยู่":"กรองตามชอบ"}</button>}
      </div>
      {games.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",background:"var(--color-background-secondary)",borderRadius:16}}>
          <div style={{fontSize:40,marginBottom:10}}>🎮</div>
          <p style={{color:"var(--color-text-secondary)",margin:"0 0 14px"}}>{filterOn&&hasPref?"ไม่มีเกมที่ตรงความชอบ":"ยังไม่มีเกม เป็นคนแรกที่สร้างเลย!"}</p>
          <button onClick={filterOn&&hasPref?()=>setFilterOn(false):newGame} style={{...S.pink,borderRadius:20,padding:"8px 20px",fontSize:14}}>{filterOn&&hasPref?"ดูทั้งหมด":"สร้างเกมแรก 🎉"}</button>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12}}>
          {games.map(g=><GameCard key={g.id} game={g} startPlay={startPlay} user={user} editGame={editGame} delGame={delGame}/>)}
        </div>
      )}
    </div>
  );
}

// ── YouTube URL → video ID ────────────────────────────────────────────────────
// ═══ AUDIO ENGINE ═════════════════════════════════════════════════════════════
// ใช้ HTML5 Audio + FileReader — ทำงานได้จริงใน browser ไม่ต้องพึ่ง YouTube

// Global audio refs (singleton)
const _audio = { bgm: null, sfx: null, voice: null };

function stopAudio(type="all"){
  const keys = type==="all" ? ["bgm","sfx","voice"] : [type];
  keys.forEach(k=>{
    if(_audio[k]){ try{_audio[k].pause();_audio[k].currentTime=0;}catch{} _audio[k]=null; }
  });
}

function playAudioSrc(src, type="bgm", loop=false, volume=0.7){
  stopAudio(type);
  if(!src) return;
  const a = new Audio(src);
  a.loop = loop;
  a.volume = volume;
  _audio[type] = a;
  a.play().catch(()=>{});
  return a;
}

// Hook สำหรับ BGM ในหน้า play
function useGameAudio(game){
  useEffect(()=>{
    if(game?.bgmSrc){ playAudioSrc(game.bgmSrc,"bgm",game.bgmLoop!==false,0.6); }
    return ()=>stopAudio("bgm");
  },[game?.id]);
}

// ── AudioUploader component ──────────────────────────────────────────────────
function AudioUploader({label,icon,value,onChange,accept="audio/*",hint=""}){
  const ref=useRef();
  const handleFile=e=>{
    const f=e.target.files[0]; if(!f) return;
    if(f.size>10*1024*1024){alert("ไฟล์ใหญ่เกิน 10MB");return;}
    const r=new FileReader();
    r.onload=ev=>onChange(ev.target.result, f.name);
    r.readAsDataURL(f);
  };
  return(
    <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"10px 12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary)"}}>{icon} {label}</span>
        {value&&<button onClick={()=>onChange(null,null)} style={{background:"none",border:"none",color:"var(--color-text-danger)",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif"}}>✕ ลบ</button>}
      </div>
      {value ? (
        <audio controls src={value} style={{width:"100%",height:32}}/>
      ) : (
        <button onClick={()=>ref.current.click()} style={{...S.pink,fontSize:12,width:"100%",borderRadius:10,padding:"8px"}}>
          📁 เลือกไฟล์เสียง
        </button>
      )}
      {hint&&<p style={{fontSize:10,color:"var(--color-text-tertiary)",margin:"4px 0 0"}}>{hint}</p>}
      <input ref={ref} type="file" accept={accept} onChange={handleFile} style={{display:"none"}}/>
    </div>
  );
}

// ── MusicBar — แถบเพลงลอยตอนเล่นเกม ────────────────────────────────────────
function MusicBar({game}){
  const [playing,setPlaying]=useState(false);
  const [vol,setVol]=useState(0.6);
  const [init,setInit]=useState(false);

  const hasBgm=!!game?.bgmSrc;
  if(!hasBgm) return null;

  const toggle=()=>{
    if(!init){ setInit(true); }
    if(playing){
      if(_audio.bgm) _audio.bgm.pause();
      setPlaying(false);
    } else {
      if(_audio.bgm){ _audio.bgm.play().catch(()=>{}); setPlaying(true); }
      else { playAudioSrc(game.bgmSrc,"bgm",game.bgmLoop!==false,vol); setPlaying(true); }
    }
  };

  const changeVol=v=>{
    setVol(v);
    if(_audio.bgm) _audio.bgm.volume=v;
  };

  // auto-start if autoplay set (needs user interaction first)
  useEffect(()=>{
    if(game?.bgmAutoplay){ setTimeout(()=>{ playAudioSrc(game.bgmSrc,"bgm",game.bgmLoop!==false,vol); setPlaying(true); },500); }
    return()=>stopAudio("bgm");
  },[]);

  return(
    <div style={{position:"fixed",bottom:16,right:16,zIndex:80,background:"var(--color-background-primary)",borderRadius:14,
      boxShadow:"0 4px 20px rgba(0,0,0,0.15)",border:"0.5px solid var(--color-border-secondary)",
      padding:"8px 12px",minWidth:180}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{fontSize:14}}>🎵</span>
        <span style={{fontSize:11,color:"var(--color-text-secondary)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {game.bgmName||"เพลงประกอบ"}
        </span>
        <button onClick={toggle} style={{background:"#ff6b9d",border:"none",color:"#fff",borderRadius:20,
          width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {playing?"⏸":"▶"}
        </button>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:10}}>🔈</span>
        <input type="range" min={0} max={1} step={0.05} value={vol} onChange={e=>changeVol(parseFloat(e.target.value))}
          style={{flex:1,accentColor:"#ff6b9d"}}/>
        <span style={{fontSize:10}}>🔊</span>
      </div>
    </div>
  );
}

// ── SfxPlayer — เล่น SFX เมื่อกดปุ่มเลือก ──────────────────────────────────
function playSfx(src){ if(src){ playAudioSrc(src,"sfx",false,0.8); } }
function playVoice(src){ if(src){ playAudioSrc(src,"voice",false,1.0); } }

// ── AudioSettingsPanel — ตั้งค่าเสียงในขั้นตอนสร้างเกม ───────────────────────
function AudioSettingsPanel({game,setGame}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>
        🎵 อัปโหลดไฟล์เสียง MP3/WAV/OGG (แนะนำไม่เกิน 10MB ต่อไฟล์)
      </p>

      {/* BGM */}
      <AudioUploader
        label="เพลงประกอบเกม (BGM)" icon="🎵"
        value={game.bgmSrc||null}
        hint="เพลงที่เล่นวนตลอดขณะเล่นเกม"
        onChange={(src,name)=>setGame({...game,bgmSrc:src,bgmName:name})}
      />
      {game.bgmSrc&&(
        <div style={{display:"flex",gap:10,paddingLeft:4}}>
          <label style={{fontSize:12,color:"var(--color-text-primary)",display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
            <input type="checkbox" checked={game.bgmAutoplay||false} onChange={e=>setGame({...game,bgmAutoplay:e.target.checked})}/>
            เล่นอัตโนมัติ
          </label>
          <label style={{fontSize:12,color:"var(--color-text-primary)",display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
            <input type="checkbox" checked={game.bgmLoop!==false} onChange={e=>setGame({...game,bgmLoop:e.target.checked})}/>
            วนซ้ำ
          </label>
        </div>
      )}

      {/* SFX เมื่อกดเลือกตัวเลือก */}
      <AudioUploader
        label="เสียงกดปุ่ม / เลือกคำตอบ" icon="🔊"
        value={game.sfxClick||null}
        hint="เสียงสั้นๆ ที่ได้ยินเมื่อผู้เล่นกดปุ่มเลือก"
        onChange={(src,name)=>setGame({...game,sfxClick:src,sfxClickName:name})}
      />

      {/* เสียงพากย์หลัก */}
      <AudioUploader
        label="เสียงพากย์ตัวละครหลัก" icon="🎙️"
        value={game.voiceMain||null}
        hint="เสียงพากย์ที่จะเล่นเมื่อตัวละครหลักพูด (เล่นทุกฉาก)"
        onChange={(src,name)=>setGame({...game,voiceMain:src,voiceMainName:name})}
      />

      {/* เสียงบรรยากาศ */}
      <AudioUploader
        label="เสียงบรรยากาศ / Ambient" icon="🌊"
        value={game.sfxAmbient||null}
        hint="เสียงพื้นหลัง เช่น เสียงฝน เสียงคาเฟ่ เสียงทะเล"
        onChange={(src,name)=>setGame({...game,sfxAmbient:src,sfxAmbientName:name})}
      />
      {game.sfxAmbient&&(
        <label style={{fontSize:12,color:"var(--color-text-primary)",display:"flex",alignItems:"center",gap:4,cursor:"pointer",paddingLeft:4}}>
          <input type="checkbox" checked={game.ambientLoop!==false} onChange={e=>setGame({...game,ambientLoop:e.target.checked})}/>
          วนซ้ำเสียงบรรยากาศ
        </label>
      )}

      <p style={{fontSize:11,color:"var(--color-text-tertiary)",margin:0,lineHeight:1.6}}>
        💡 เสียงทั้งหมดเก็บใน browser — ไม่ต้องพึ่ง YouTube หรือ server ใดๆ<br/>
        รองรับ MP3, WAV, OGG, M4A
      </p>
    </div>
  );
}

function ytVideoId(url){
  if(!url)return null;
  const patterns=[/youtu\.be\/([^?&\n]+)/,/youtube\.com\/watch\?v=([^&\n]+)/,/youtube\.com\/embed\/([^?&\n]+)/];
  for(const p of patterns){const m=url.match(p);if(m)return m[1];}
  return null;
}

// ═══ GAME DETAIL SCREEN ════════════════════════════════════════════════════════
function GameDetailScreen({game,user,onPlay,onBack}){
  const isOwner=user&&game.author===user.username;
  const cv=game.cover||{type:"gradient",c1:"#ffd6e7",c2:"#ffb3cf"};
  const bgS=game.bgCustom?{backgroundImage:`url(${game.bgCustom})`,backgroundSize:"cover",backgroundPosition:"center"}
    :{background:cv.type==="gradient"?`linear-gradient(135deg,${cv.c1},${cv.c2})`:(cv.solidColor||game.bg.color)};
  const rc=game.readerCount||0;

  // special scenes info
  const endingScenes =game.scenes.filter(s=>s.sceneType==="ending");
  const secretScenes =game.scenes.filter(s=>s.sceneType==="secret");
  const normalScenes =game.scenes.filter(s=>!s.sceneType||s.sceneType==="normal");

  const vid=ytVideoId(game.musicUrl||"");

  return(
    <div style={{maxWidth:520,margin:"0 auto",paddingBottom:32}}>
      {/* Cover banner */}
      <div style={{height:220,position:"relative",overflow:"hidden",...bgS}}>
        <button onClick={onBack} style={{position:"absolute",top:12,left:12,background:"rgba(0,0,0,0.4)",border:"none",color:"#fff",borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:13,fontFamily:"Sarabun,sans-serif",zIndex:5}}>← กลับ</button>
        {cv.text&&<div style={{position:"absolute",top:"50%",left:0,right:0,transform:"translateY(-50%)",textAlign:"center",fontSize:cv.textSize||20,fontWeight:700,color:cv.textColor||"#fff",textShadow:"0 2px 8px rgba(0,0,0,0.5)",padding:"0 16px",zIndex:2}}>{cv.text}</div>}
        {game.charCustom
          ?<img src={game.charCustom} style={{position:"absolute",right:16,bottom:0,height:"80%",objectFit:"contain",zIndex:1}}/>
          :<span style={{position:"absolute",right:20,bottom:8,fontSize:80,zIndex:1}}>{game.character.emoji}</span>
        }
        {!game.bgCustom&&<span style={{position:"absolute",left:16,bottom:10,fontSize:50,opacity:0.25}}>{game.bg.emoji}</span>}
        {/* Music badge */}
        {vid&&<div style={{position:"absolute",bottom:10,left:16,background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:20,display:"flex",alignItems:"center",gap:5}}>🎵 มีเพลงประกอบ</div>}
      </div>

      <div style={{padding:"0 16px"}}>
        {/* Title + stats */}
        <div style={{marginTop:16,marginBottom:14}}>
          <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:"var(--color-text-primary)"}}>{game.title}</h1>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>โดย <strong>{game.author}</strong> · {new Date(game.createdAt||Date.now()).toLocaleDateString("th-TH")}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {(game.tags||[]).map(t=><span key={t} style={{background:"#fff0f6",color:"#ff6b9d",fontSize:11,padding:"2px 9px",borderRadius:20,border:"0.5px solid #ffb3cf"}}>{t}</span>)}
          </div>
          {/* Stats row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {[
              {icon:"📖",label:"ฉากปกติ",val:normalScenes.length},
              {icon:"🏆",label:"ฉากจบ",val:endingScenes.length},
              {icon:"🔓",label:"ฉากลับ",val:secretScenes.length},
            ].map(s=>(
              <div key={s.label} style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"8px",textAlign:"center"}}>
                <p style={{margin:0,fontSize:16}}>{s.icon}</p>
                <p style={{margin:0,fontSize:18,fontWeight:700,color:"var(--color-text-primary)"}}>{s.val}</p>
                <p style={{margin:0,fontSize:10,color:"var(--color-text-secondary)"}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {game.description&&(
          <div style={{background:"var(--color-background-secondary)",borderRadius:14,padding:"14px 16px",marginBottom:14}}>
            <p style={{fontSize:13,fontWeight:500,margin:"0 0 6px",color:"var(--color-text-primary)"}}>📝 เรื่องย่อ</p>
            <p style={{fontSize:14,margin:0,color:"var(--color-text-secondary)",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{game.description}</p>
          </div>
        )}

        {/* Bonus info */}
        {(game.bonusRelFinish||game.bonusRelSecret)>0&&(
          <div style={{background:"#fff0f6",border:"0.5px solid #ffb3cf",borderRadius:14,padding:"12px 16px",marginBottom:14}}>
            <p style={{fontSize:13,fontWeight:600,margin:"0 0 8px",color:"#ff6b9d"}}>❤️ แต้มความรักที่จะได้รับ</p>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {game.bonusRelFinish>0&&<p style={{fontSize:13,margin:0,color:"var(--color-text-primary)"}}>📖 เล่นจบฉากปกติ: <strong style={{color:"#ff6b9d"}}>+{game.bonusRelFinish}</strong> แต้ม</p>}
              {game.bonusRelSecret>0&&<p style={{fontSize:13,margin:0,color:"var(--color-text-primary)"}}>🔓 ปลดล็อกฉากลับ: <strong style={{color:"#7c3aed"}}>+{game.bonusRelSecret}</strong> แต้ม</p>}
            </div>
          </div>
        )}

        {/* Secret scene unlock hints */}
        {secretScenes.length>0&&(
          <div style={{background:"#f5f3ff",border:"0.5px solid #c4b5fd",borderRadius:14,padding:"12px 16px",marginBottom:14}}>
            <p style={{fontSize:13,fontWeight:600,margin:"0 0 6px",color:"#7c3aed"}}>🔓 ฉากลับ ({secretScenes.length} ฉาก)</p>
            {secretScenes.map((sc,i)=>(
              <p key={i} style={{fontSize:12,margin:"0 0 3px",color:"var(--color-text-secondary)"}}>
                • ต้องการแต้มความรัก ≥ <strong>{sc.unlockRelMin||50}</strong>{sc.unlockSceneMin>0?` และผ่านฉาก ≥ ${sc.unlockSceneMin}`:""}
              </p>
            ))}
          </div>
        )}

        {/* YouTube preview */}
        {vid&&(
          <div style={{marginBottom:14}}>
            <p style={{fontSize:13,fontWeight:500,margin:"0 0 8px",color:"var(--color-text-primary)"}}>🎵 เพลงประกอบเกม</p>
            <div style={{borderRadius:12,overflow:"hidden"}}>
              <iframe width="100%" height="100" src={`https://www.youtube.com/embed/${vid}?controls=1&rel=0`} frameBorder="0" allow="encrypted-media" allowFullScreen style={{display:"block"}}/>
            </div>
          </div>
        )}

        {/* Play button */}
        <button onClick={onPlay} style={{width:"100%",...S.pink,borderRadius:16,padding:"16px",fontSize:17,fontWeight:700}}>
          {isOwner?"🎮 เล่นเกมของฉัน":rc<1?"🎮 เล่นเกม (ฟรี!)":"🎮 เล่นเกม — ⭐ 20 พอยต์"}
        </button>
        <p style={{fontSize:11,color:"var(--color-text-tertiary)",textAlign:"center",marginTop:8}}>
          {isOwner?"เจ้าของเกมอ่านฟรี":`ผู้อ่าน ${rc} คน`}
        </p>
      </div>
    </div>
  );
}

function RelBar({value,color}){
  return <div style={{height:6,borderRadius:4,background:"var(--color-border-tertiary)",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,value)}%`,background:color,borderRadius:4,transition:"width 0.4s ease"}}/></div>;
}
function AuthScreen({authMode,setAuthMode,authForm,setAuthForm,authError,setAuthError,doAuth,setScreen,users}){
  // OTP state (register only)
  const [otpStep,   setOtpStep]   = useState("form"); // "form" | "sending" | "verify" | "done"
  const [otpCode,   setOtpCode]   = useState("");      // actual OTP sent
  const [otpInput,  setOtpInput]  = useState("");      // user types this
  const [otpError,  setOtpError]  = useState("");
  const [otpTimer,  setOtpTimer]  = useState(0);
  const [emailJsErr,setEmailJsErr]= useState("");
  const timerRef = useRef();

  // countdown timer
  useEffect(()=>{
    if(otpTimer<=0){clearInterval(timerRef.current);return;}
    timerRef.current=setInterval(()=>setOtpTimer(t=>{if(t<=1){clearInterval(timerRef.current);return 0;}return t-1;}),1000);
    return()=>clearInterval(timerRef.current);
  },[otpTimer>0]);

  const genOTP=()=>String(Math.floor(100000+Math.random()*900000));

  const validateForm=()=>{
    if(!authForm.username.trim()){setAuthError("กรุณากรอกชื่อผู้ใช้");return false;}
    if(!authForm.password.trim()||authForm.password.length<6){setAuthError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");return false;}
    if(authMode==="register"){
      if(!authForm.email?.trim()||!authForm.email.includes("@")){setAuthError("กรุณากรอกอีเมลให้ถูกต้อง");return false;}
      const all=lsGet(LS_USERS,users||{});
      if(all[authForm.username]){setAuthError("ชื่อผู้ใช้นี้มีอยู่แล้ว");return false;}
    }
    setAuthError("");return true;
  };

  const handleSendOTP=async()=>{
    if(!validateForm())return;
    setOtpStep("sending");setEmailJsErr("");
    const code=genOTP();setOtpCode(code);
    try{
      await sendOTPEmail(authForm.email.trim(), code);
      setOtpStep("verify");setOtpTimer(120);
      setOtpError("");
    }catch(e){
      console.error("EmailJS error:",e);
      setEmailJsErr("ส่งอีเมลไม่สำเร็จ — กรุณาตั้งค่า EmailJS ก่อน");
      setOtpStep("form");
    }
  };

  const handleResend=async()=>{
    if(otpTimer>0)return;
    const code=genOTP();setOtpCode(code);
    try{await sendOTPEmail(authForm.email.trim(),code);setOtpTimer(120);setOtpError("");}
    catch(e){setOtpError("ส่งอีเมลซ้ำไม่สำเร็จ");}
  };

  const handleVerifyOTP=()=>{
    if(otpInput.trim()!==otpCode){setOtpError("รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่");return;}
    setOtpError("");setOtpStep("done");
    // slight delay then call doAuth
    setTimeout(()=>doAuth(),300);
  };

  const handleLogin=()=>{ if(!validateForm())return; doAuth(); };

  const resetOtp=()=>{setOtpStep("form");setOtpInput("");setOtpCode("");setOtpError("");setEmailJsErr("");};

  return(
    <div style={{maxWidth:420,margin:"40px auto",padding:"0 16px"}}>
      <div style={{background:"var(--color-background-primary)",borderRadius:20,border:"0.5px solid var(--color-border-tertiary)",padding:28}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:40}}>💕</div>
          <h2 style={{margin:"8px 0 4px",fontSize:20}}>{authMode==="login"?"เข้าสู่ระบบ":"สมัครสมาชิก"}</h2>
          {authMode==="register"&&otpStep==="form"&&<p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>รับฟรี {POINTS_START} พอยต์! ⭐ ต้องยืนยันอีเมลก่อน</p>}
        </div>

        {/* ── LOGIN ── */}
        {authMode==="login"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input placeholder="ชื่อผู้ใช้ (username)" value={authForm.username} onChange={e=>setAuthForm(p=>({...p,username:e.target.value}))} style={{...S.inp}}/>
            <div>
              <input type="password" placeholder="รหัสผ่าน" value={authForm.password} onChange={e=>setAuthForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...S.inp}}/>
              <div style={{textAlign:"right",marginTop:5}}>
                <button onClick={()=>setScreen("forgot")} style={{background:"none",border:"none",color:"#ff6b9d",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif"}}>ลืมรหัสผ่าน?</button>
              </div>
            </div>
            {authError&&<p style={{color:"var(--color-text-danger)",fontSize:13,margin:0}}>⚠️ {authError}</p>}
            <button onClick={handleLogin} style={{...S.pink,borderRadius:10,padding:12,fontSize:16,fontWeight:700,width:"100%"}}>เข้าสู่ระบบ</button>
            <button onClick={()=>{setAuthMode("register");resetOtp();setAuthError("");}} style={{background:"none",border:"none",color:"var(--color-text-secondary)",cursor:"pointer",fontSize:14,fontFamily:"Sarabun,sans-serif"}}>ยังไม่มีบัญชี? สมัครเลย</button>
            <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"var(--color-text-tertiary)",cursor:"pointer",fontSize:13,fontFamily:"Sarabun,sans-serif"}}>← กลับหน้าหลัก</button>
          </div>
        )}

        {/* ── REGISTER STEP 1: form ── */}
        {authMode==="register"&&otpStep==="form"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>ชื่อผู้ใช้ *</label>
              <input placeholder="เช่น lovely_min" value={authForm.username} onChange={e=>setAuthForm(p=>({...p,username:e.target.value}))} style={{...S.inp}}/>
            </div>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>อีเมล * (ใช้ยืนยันตัวตน)</label>
              <input type="email" placeholder="example@gmail.com" value={authForm.email||""} onChange={e=>setAuthForm(p=>({...p,email:e.target.value}))} style={{...S.inp}}/>
              <p style={{fontSize:11,color:"var(--color-text-tertiary)",margin:"4px 0 0"}}>📧 จะส่งรหัส OTP ไปยังอีเมลนี้</p>
            </div>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>รหัสผ่าน * (อย่างน้อย 6 ตัว)</label>
              <input type="password" placeholder="รหัสผ่าน" value={authForm.password} onChange={e=>setAuthForm(p=>({...p,password:e.target.value}))} style={{...S.inp}}/>
            </div>
            {authError&&<p style={{color:"var(--color-text-danger)",fontSize:13,margin:0}}>⚠️ {authError}</p>}
            {emailJsErr&&(
              <div style={{background:"#fff7ed",border:"0.5px solid #fed7aa",borderRadius:10,padding:"10px 12px",fontSize:12,color:"#c2410c"}}>
                ⚠️ {emailJsErr}<br/>
                <span style={{fontSize:11,opacity:0.8}}>ต้องตั้งค่า EmailJS Service ก่อน — ดูคู่มือด้านล่าง</span>
              </div>
            )}
            <button onClick={handleSendOTP} style={{...S.pink,borderRadius:10,padding:12,fontSize:15,fontWeight:700,width:"100%"}}>
              📧 ส่ง OTP ยืนยันอีเมล
            </button>
            <button onClick={()=>{setAuthMode("login");resetOtp();setAuthError("");}} style={{background:"none",border:"none",color:"var(--color-text-secondary)",cursor:"pointer",fontSize:14,fontFamily:"Sarabun,sans-serif"}}>มีบัญชีแล้ว? เข้าสู่ระบบ</button>
            <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"var(--color-text-tertiary)",cursor:"pointer",fontSize:13,fontFamily:"Sarabun,sans-serif"}}>← กลับหน้าหลัก</button>
          </div>
        )}

        {/* ── REGISTER STEP 2: sending ── */}
        {authMode==="register"&&otpStep==="sending"&&(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:50,marginBottom:12,animation:"spin 1s linear infinite"}}>📧</div>
            <p style={{fontSize:15,fontWeight:500,margin:"0 0 6px"}}>กำลังส่งรหัส OTP...</p>
            <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>ไปยัง {authForm.email}</p>
            <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* ── REGISTER STEP 3: verify OTP ── */}
        {authMode==="register"&&otpStep==="verify"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{textAlign:"center",marginBottom:4}}>
              <div style={{fontSize:44,marginBottom:8}}>📬</div>
              <p style={{fontSize:15,fontWeight:600,margin:"0 0 4px"}}>ตรวจสอบอีเมลของคุณ</p>
              <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>ส่งรหัส 6 หลักไปที่<br/><strong>{authForm.email}</strong></p>
            </div>

            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>กรอกรหัส OTP 6 หลัก</label>
              <input
                value={otpInput}
                onChange={e=>setOtpInput(e.target.value.replace(/\D/g,"").slice(0,6))}
                onKeyDown={e=>e.key==="Enter"&&otpInput.length===6&&handleVerifyOTP()}
                placeholder="000000"
                maxLength={6}
                style={{...S.inp, fontSize:28, textAlign:"center", letterSpacing:10, fontWeight:700, padding:"12px"}}
              />
            </div>

            {otpError&&<p style={{color:"var(--color-text-danger)",fontSize:13,margin:0,textAlign:"center"}}>⚠️ {otpError}</p>}

            <button
              onClick={handleVerifyOTP}
              disabled={otpInput.length!==6}
              style={{...S.pink,borderRadius:10,padding:13,fontSize:15,fontWeight:700,width:"100%",opacity:otpInput.length===6?1:0.5}}
            >
              ✅ ยืนยัน OTP
            </button>

            <div style={{textAlign:"center"}}>
              {otpTimer>0
                ?<p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>ส่งใหม่ได้ใน <strong style={{color:"#ff6b9d"}}>{otpTimer}s</strong></p>
                :<button onClick={handleResend} style={{background:"none",border:"none",color:"#ff6b9d",cursor:"pointer",fontSize:14,fontFamily:"Sarabun,sans-serif",fontWeight:500}}>📧 ส่ง OTP ใหม่</button>
              }
            </div>

            <button onClick={resetOtp} style={{background:"none",border:"none",color:"var(--color-text-tertiary)",cursor:"pointer",fontSize:13,fontFamily:"Sarabun,sans-serif"}}>← แก้ไขข้อมูล</button>

            {/* Setup guide */}
            <details style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"10px 12px"}}>
              <summary style={{fontSize:12,color:"var(--color-text-secondary)",cursor:"pointer",fontFamily:"Sarabun,sans-serif"}}>⚙️ วิธีตั้งค่า EmailJS (แอดมิน)</summary>
              <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:8,lineHeight:1.8}}>
                1. ไปที่ <strong>emailjs.com</strong> → สมัครฟรี<br/>
                2. Add Service → Gmail → เชื่อมต่อ <strong>longlenniyai@gmail.com</strong><br/>
                3. Create Template → ใส่ตัวแปร: <code>{"{{to_email}}"}</code> <code>{"{{otp_code}}"}</code><br/>
                4. คัดลอก Service ID, Template ID, Public Key<br/>
                5. แก้ในโค้ด: <code>EMAILJS_SERVICE_ID</code>, <code>EMAILJS_TEMPLATE_ID</code>, <code>EMAILJS_PUBLIC_KEY</code>
              </div>
            </details>
          </div>
        )}

        {/* ── REGISTER STEP 4: done ── */}
        {authMode==="register"&&otpStep==="done"&&(
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:50,marginBottom:12}}>🎉</div>
            <p style={{fontSize:16,fontWeight:700,margin:"0 0 6px"}}>ยืนยันสำเร็จ!</p>
            <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>กำลังสร้างบัญชี...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ CONFIRM MODAL ════════════════════════════════════════════════════════════
function ConfirmModal({title,message,confirmLabel="ยืนยัน",cancelLabel="ยกเลิก",danger=false,onConfirm,onCancel,extra=null}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onCancel}>
      <div style={{background:"var(--color-background-primary)",borderRadius:20,padding:24,width:"100%",maxWidth:380,boxShadow:"0 8px 40px rgba(0,0,0,0.18)"}} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:44,marginBottom:8}}>{danger?"🗑️":"❓"}</div>
          <h3 style={{margin:"0 0 8px",fontSize:18,color:"var(--color-text-primary)"}}>{title}</h3>
          <p style={{fontSize:14,color:"var(--color-text-secondary)",margin:0,lineHeight:1.6}}>{message}</p>
          {extra&&<div style={{marginTop:12}}>{extra}</div>}
        </div>
        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button onClick={onCancel} style={{flex:1,background:"none",border:"0.5px solid var(--color-border-secondary)",borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:14,color:"var(--color-text-secondary)"}}>{cancelLabel}</button>
          <button onClick={onConfirm} style={{flex:1,background:danger?"#ef4444":"#ff6b9d",border:"none",color:"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:14,fontWeight:700}}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ═══ FORGOT PASSWORD SCREEN ════════════════════════════════════════════════════
function ForgotPasswordScreen({setScreen,allUsers,syncAllUsers,notifShow}){
  const [step,setStep]=useState("email"); // "email"|"sending"|"otp"|"newpw"|"done"
  const [email,setEmail]=useState("");
  const [username,setUsername]=useState("");
  const [otp,setOtp]=useState("");
  const [otpInput,setOtpInput]=useState("");
  const [newPw,setNewPw]=useState("");
  const [newPw2,setNewPw2]=useState("");
  const [err,setErr]=useState("");
  const [timer,setTimer]=useState(0);
  const timerRef=useRef();

  useEffect(()=>{
    if(timer<=0){clearInterval(timerRef.current);return;}
    timerRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(timerRef.current);return 0;}return t-1;}),1000);
    return()=>clearInterval(timerRef.current);
  },[timer>0]);

  const genOTP=()=>String(Math.floor(100000+Math.random()*900000));

  const findUser=()=>{
    if(!email.trim()||!email.includes("@")){setErr("กรอกอีเมลให้ถูกต้อง");return;}
    const all=lsGet(LS_USERS,allUsers);
    const found=Object.values(all).find(u=>u.email===email.trim());
    if(!found){setErr("ไม่พบบัญชีที่ใช้อีเมลนี้");return;}
    setUsername(found.username);
    sendReset(found.username, email.trim());
  };

  const sendReset=async(uname, mail)=>{
    setStep("sending");setErr("");
    const code=genOTP();setOtp(code);
    try{
      await sendOTPEmail(mail, code);
      setStep("otp");setTimer(120);
    }catch(e){
      setErr("ส่งอีเมลไม่สำเร็จ กรุณาตั้งค่า EmailJS ก่อน");
      setStep("email");
    }
  };

  const verifyOTP=()=>{
    if(otpInput.trim()!==otp){setErr("รหัส OTP ไม่ถูกต้อง");return;}
    setErr("");setStep("newpw");
  };

  const saveNewPw=()=>{
    if(newPw.length<6){setErr("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");return;}
    if(newPw!==newPw2){setErr("รหัสผ่านทั้งสองช่องไม่ตรงกัน");return;}
    const all=lsGet(LS_USERS,allUsers);
    const updated={...all,[username]:{...all[username],password:newPw}};
    syncAllUsers(updated);
    setErr("");setStep("done");
    notifShow("✅ เปลี่ยนรหัสผ่านสำเร็จ!");
    setTimeout(()=>setScreen("auth"),2000);
  };

  return(
    <div style={{maxWidth:400,margin:"40px auto",padding:"0 16px"}}>
      <div style={{background:"var(--color-background-primary)",borderRadius:20,border:"0.5px solid var(--color-border-tertiary)",padding:28}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:40}}>🔑</div>
          <h2 style={{margin:"8px 0 4px",fontSize:20}}>ลืมรหัสผ่าน</h2>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>ยืนยันตัวตนผ่านอีเมลที่ลงทะเบียนไว้</p>
        </div>

        {/* Step: กรอกอีเมล */}
        {step==="email"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:5}}>อีเมลที่ใช้สมัคร</label>
              <input type="email" placeholder="example@gmail.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&findUser()} style={{...S.inp}}/>
            </div>
            {err&&<p style={{color:"var(--color-text-danger)",fontSize:13,margin:0}}>⚠️ {err}</p>}
            <button onClick={findUser} style={{...S.pink,borderRadius:10,padding:12,fontSize:15,fontWeight:700,width:"100%"}}>📧 ส่งรหัส OTP</button>
            <button onClick={()=>setScreen("auth")} style={{background:"none",border:"none",color:"var(--color-text-tertiary)",cursor:"pointer",fontSize:13,fontFamily:"Sarabun,sans-serif"}}>← กลับหน้าเข้าสู่ระบบ</button>
          </div>
        )}

        {/* Step: กำลังส่ง */}
        {step==="sending"&&(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:50,marginBottom:12}}>📧</div>
            <p style={{fontSize:15,fontWeight:500,margin:"0 0 6px"}}>กำลังส่งรหัส OTP...</p>
            <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>{email}</p>
          </div>
        )}

        {/* Step: กรอก OTP */}
        {step==="otp"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{textAlign:"center",marginBottom:4}}>
              <div style={{fontSize:44,marginBottom:8}}>📬</div>
              <p style={{fontSize:14,color:"var(--color-text-secondary)",margin:0}}>ส่งรหัส 6 หลักไปที่<br/><strong>{email}</strong></p>
            </div>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>กรอกรหัส OTP</label>
              <input value={otpInput} onChange={e=>setOtpInput(e.target.value.replace(/\D/g,"").slice(0,6))} onKeyDown={e=>e.key==="Enter"&&otpInput.length===6&&verifyOTP()} placeholder="000000" maxLength={6} style={{...S.inp,fontSize:28,textAlign:"center",letterSpacing:10,fontWeight:700,padding:"12px"}}/>
            </div>
            {err&&<p style={{color:"var(--color-text-danger)",fontSize:13,margin:0,textAlign:"center"}}>⚠️ {err}</p>}
            <button onClick={verifyOTP} disabled={otpInput.length!==6} style={{...S.pink,borderRadius:10,padding:12,fontSize:15,fontWeight:700,width:"100%",opacity:otpInput.length===6?1:0.5}}>✅ ยืนยัน OTP</button>
            <div style={{textAlign:"center"}}>
              {timer>0
                ?<p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>ส่งใหม่ได้ใน <strong style={{color:"#ff6b9d"}}>{timer}s</strong></p>
                :<button onClick={()=>sendReset(username,email)} style={{background:"none",border:"none",color:"#ff6b9d",cursor:"pointer",fontSize:14,fontFamily:"Sarabun,sans-serif"}}>📧 ส่ง OTP ใหม่</button>
              }
            </div>
          </div>
        )}

        {/* Step: ตั้งรหัสใหม่ */}
        {step==="newpw"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{textAlign:"center",marginBottom:4}}>
              <div style={{fontSize:44,marginBottom:6}}>🔐</div>
              <p style={{fontSize:14,color:"var(--color-text-secondary)",margin:0}}>สำหรับบัญชี <strong>@{username}</strong></p>
            </div>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:5}}>รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)</label>
              <input type="password" placeholder="รหัสผ่านใหม่" value={newPw} onChange={e=>setNewPw(e.target.value)} style={{...S.inp}}/>
            </div>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:5}}>ยืนยันรหัสผ่านใหม่</label>
              <input type="password" placeholder="กรอกซ้ำอีกครั้ง" value={newPw2} onChange={e=>setNewPw2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveNewPw()} style={{...S.inp}}/>
            </div>
            {err&&<p style={{color:"var(--color-text-danger)",fontSize:13,margin:0}}>⚠️ {err}</p>}
            <button onClick={saveNewPw} style={{...S.pink,borderRadius:10,padding:12,fontSize:15,fontWeight:700,width:"100%"}}>💾 บันทึกรหัสผ่านใหม่</button>
          </div>
        )}

        {/* Step: สำเร็จ */}
        {step==="done"&&(
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:56,marginBottom:12}}>✅</div>
            <p style={{fontSize:16,fontWeight:700,margin:"0 0 6px",color:"#22c55e"}}>เปลี่ยนรหัสผ่านสำเร็จ!</p>
            <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>กำลังกลับหน้าเข้าสู่ระบบ...</p>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══ CHAR EMOJI POOL ══════════════════════════════════════════════════════════
const CHAR_EMOJIS=[
  {emoji:"👩‍🦰",name:"สาวผมแดง"},{emoji:"👩‍🦱",name:"สาวผมหยัก"},{emoji:"👩‍🦳",name:"สาวผมขาว"},
  {emoji:"👧",name:"เด็กสาว"},{emoji:"👱‍♀️",name:"สาวผมทอง"},{emoji:"🧑‍🦰",name:"คนผมแดง"},
  {emoji:"🧑‍🦱",name:"คนผมหยัก"},{emoji:"👦",name:"เด็กชาย"},{emoji:"👱",name:"หนุ่มผมทอง"},
  {emoji:"🧔",name:"หนุ่มเครา"},{emoji:"👴",name:"คุณปู่"},{emoji:"👵",name:"คุณย่า"},
  {emoji:"🐱",name:"แมว"},{emoji:"🐶",name:"หมา"},{emoji:"🤖",name:"หุ่นยนต์"},
  {emoji:"👻",name:"ผี"},{emoji:"🦊",name:"สุนัขจิ้งจอก"},{emoji:"🐰",name:"กระต่าย"},
  {emoji:"🧝‍♀️",name:"เอลฟ์"},{emoji:"🧙",name:"พ่อมด"},
];

// ═══ SCENE CANVAS ═════════════════════════════════════════════════════════════
function SceneCanvas({scene,setScene,game,isPlay=false}){
  const canvasRef=useRef();
  const [selected,setSelected]=useState(null);
  const [drag,setDrag]=useState(null);
  const [panel,setPanel]=useState(null);
  const [newName,setNewName]=useState("");
  const mainCharRef=useRef(),extraCharRef=useRef(),propRef=useRef();

  const objects=scene.objects||[];
  const setObjs=os=>setScene({...scene,objects:os});
  const addObj=obj=>{
    const no={id:gid(),x:18,y:5,w:90,h:130,zIndex:objects.length+2,...obj};
    setObjs([...objects,no]);setSelected(no.id);setPanel(null);
  };
  const updObj=(id,f)=>setObjs(objects.map(o=>o.id===id?{...o,...f}:o));
  const delObj=id=>{setObjs(objects.filter(o=>o.id!==id));if(selected===id)setSelected(null);};
  const bringFwd=id=>{const mz=Math.max(0,...objects.map(o=>o.zIndex||1));updObj(id,{zIndex:mz+1});};
  const sendBk=id=>{const mz=Math.min(9999,...objects.map(o=>o.zIndex||1));updObj(id,{zIndex:Math.max(0,mz-1)});};
  const selObj=objects.find(o=>o.id===selected);

  const startDrag=(e,id,mode)=>{
    if(isPlay)return;
    e.stopPropagation();e.preventDefault();
    const obj=objects.find(o=>o.id===id);
    const rect=canvasRef.current.getBoundingClientRect();
    const t=e.touches?e.touches[0]:e;
    setSelected(id);
    setDrag({id,mode,sx:t.clientX,sy:t.clientY,ox:obj.x,oy:obj.y,ow:obj.w,oh:obj.h,rect});
  };
  const onMove=useCallback(e=>{
    if(!drag||isPlay)return;e.preventDefault();
    const t=e.touches?e.touches[0]:e;
    const dxPx=t.clientX-drag.sx,dyPx=t.clientY-drag.sy;
    if(drag.mode==="move"){
      updObj(drag.id,{x:Math.max(-5,Math.min(88,drag.ox+(dxPx/drag.rect.width)*100)),y:Math.max(-5,Math.min(85,drag.oy+(dyPx/drag.rect.height)*100))});
    } else {
      updObj(drag.id,{w:Math.max(24,drag.ow+dxPx),h:Math.max(24,drag.oh+dyPx)});
    }
  },[drag,objects]);
  const onEnd=useCallback(()=>setDrag(null),[]);
  useEffect(()=>{
    if(drag){window.addEventListener("mousemove",onMove,{passive:false});window.addEventListener("mouseup",onEnd);window.addEventListener("touchmove",onMove,{passive:false});window.addEventListener("touchend",onEnd);}
    return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onEnd);window.removeEventListener("touchmove",onMove);window.removeEventListener("touchend",onEnd);};
  },[drag]);

  const hImg=(e,type)=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{
      if(type==="main"){const ex=objects.find(o=>o.type==="mainchar");if(ex)updObj(ex.id,{src:ev.target.result});else addObj({type:"mainchar",src:ev.target.result,label:game.charName||"ตัวละครหลัก",x:48,y:0,w:110,h:180});}
      else if(type==="extra") addObj({type:"extrachar",src:ev.target.result,label:newName||"ตัวละคร",x:10,y:5,w:90,h:140});
      else addObj({type:"prop",src:ev.target.result,label:"รูปของฉัน",w:80,h:80});
      setNewName("");
    };
    r.readAsDataURL(f);
  };

  const bgStyle=game.bgCustom?{backgroundImage:`url(${game.bgCustom})`,backgroundSize:"cover",backgroundPosition:"center"}:{background:game.bg.color};
  const hasMain=objects.find(o=>o.type==="mainchar");

  return(
    <div>
      {/* CANVAS */}
      <div ref={canvasRef} onClick={isPlay?undefined:e=>{if(e.target===canvasRef.current||e.target===canvasRef.current.firstChild)setSelected(null);}}
        style={{position:"relative",height:isPlay?300:260,borderRadius:14,overflow:"hidden",userSelect:"none",...bgStyle}}>
        {/* Default main char */}
        {!hasMain&&(game.charCustom
          ?<img src={game.charCustom} style={{position:"absolute",right:"8%",bottom:0,height:"58%",objectFit:"contain",zIndex:1,pointerEvents:"none"}}/>
          :<span style={{position:"absolute",right:"8%",bottom:6,fontSize:76,zIndex:1,pointerEvents:"none"}}>{game.character.emoji}</span>
        )}
        {/* Sorted objects */}
        {[...objects].sort((a,b)=>(a.zIndex||0)-(b.zIndex||0)).map(obj=>{
          const isSel=!isPlay&&selected===obj.id;
          const flip=obj.flipX?"scaleX(-1)":"none";
          return(
            <div key={obj.id} onMouseDown={e=>startDrag(e,obj.id,"move")} onTouchStart={e=>startDrag(e,obj.id,"move")}
              style={{position:"absolute",left:`${obj.x}%`,top:`${obj.y}%`,width:obj.w,height:obj.h,
                zIndex:obj.zIndex||1,boxSizing:"border-box",touchAction:"none",
                border:isSel?"2px dashed #ff6b9d":"2px solid transparent",
                borderRadius:6,cursor:isPlay?"default":"grab",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {obj.src
                ?<img src={obj.src} style={{width:"100%",height:"100%",objectFit:"contain",pointerEvents:"none",transform:flip}}/>
                :<span style={{fontSize:Math.min(obj.w,obj.h)*0.62,lineHeight:1,pointerEvents:"none",transform:flip,display:"block"}}>{obj.emoji}</span>
              }
              {/* Name tag */}
              {!isPlay&&(obj.type==="extrachar"||obj.type==="mainchar")&&obj.label&&(
                <div style={{position:"absolute",bottom:-18,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:9,padding:"1px 7px",borderRadius:8,whiteSpace:"nowrap",pointerEvents:"none",zIndex:1}}>{obj.label}</div>
              )}
              {isSel&&(
                <>
                  <button onMouseDown={e=>{e.stopPropagation();delObj(obj.id);}} style={{position:"absolute",top:-11,right:-11,background:"#ef4444",border:"none",color:"#fff",borderRadius:"50%",width:20,height:20,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}}>✕</button>
                  <div onMouseDown={e=>startDrag(e,obj.id,"resize")} onTouchStart={e=>startDrag(e,obj.id,"resize")} style={{position:"absolute",bottom:-9,right:-9,width:20,height:20,background:"#ff6b9d",borderRadius:"50%",cursor:"se-resize",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",touchAction:"none"}}>↔</div>
                  <button onMouseDown={e=>{e.stopPropagation();updObj(obj.id,{flipX:!obj.flipX});}} style={{position:"absolute",top:-11,left:-11,background:"#7c3aed",border:"none",color:"#fff",borderRadius:"50%",width:20,height:20,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} title="กลับด้าน">⇄</button>
                </>
              )}
            </div>
          );
        })}
        {/* Dialogue preview */}
        {!isPlay&&(
          <div style={{position:"absolute",bottom:6,left:6,right:6,background:"rgba(255,255,255,0.9)",borderRadius:10,padding:"5px 10px",pointerEvents:"none",zIndex:50}}>
            <p style={{fontSize:10,color:game.charColor||"#ff6b9d",margin:"0 0 1px",fontWeight:600}}>{game.charName||game.character.name}</p>
            <p style={{fontSize:10,margin:0,color:"#333"}}>{scene.dialogue||"(บทพูดจะแสดงที่นี่)"}</p>
          </div>
        )}
      </div>

      {/* EDITOR CONTROLS */}
      {!isPlay&&(
        <div style={{marginTop:10}}>
          {/* Selected panel */}
          {selObj&&(
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"10px 12px",marginBottom:10,border:"1px solid #ff6b9d"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span>{selObj.emoji||"🖼️"}</span>
                  <input value={selObj.label||""} onChange={e=>updObj(selObj.id,{label:e.target.value})} placeholder="ชื่อ" style={{...S.inp,width:90,padding:"3px 8px",fontSize:12}}/>
                </div>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>bringFwd(selObj.id)} style={{...S.pink,fontSize:10,padding:"3px 8px"}}>⬆ หน้า</button>
                  <button onClick={()=>sendBk(selObj.id)} style={{...S.out(),fontSize:10,padding:"3px 8px",borderRadius:20}}>⬇ หลัง</button>
                  <button onClick={()=>updObj(selObj.id,{flipX:!selObj.flipX})} style={{background:"#7c3aed",border:"none",color:"#fff",borderRadius:20,padding:"3px 8px",cursor:"pointer",fontSize:10,fontFamily:"Sarabun,sans-serif"}}>⇄ กลับด้าน</button>
                  <button onClick={()=>delObj(selObj.id)} style={{...S.out(true),fontSize:10,padding:"3px 8px",borderRadius:20}}>🗑️</button>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
                {[{l:"X %",f:"x",mn:-5,mx:90},{l:"Y %",f:"y",mn:-10,mx:85},{l:"กว้าง px",f:"w",mn:20,mx:500},{l:"สูง px",f:"h",mn:20,mx:600}].map(({l,f,mn,mx})=>(
                  <div key={f}>
                    <label style={{fontSize:9,color:"var(--color-text-secondary)",display:"block",marginBottom:2}}>{l}</label>
                    <input type="number" min={mn} max={mx} value={Math.round(selObj[f])||0} onChange={e=>updObj(selObj.id,{[f]:parseFloat(e.target.value)||0})} style={{...S.inp,padding:"4px",textAlign:"center",fontSize:12}}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
            {[{id:"char",label:"👥 เพิ่มคน"},{id:"sticker",label:"🌸 Sticker"},{id:"prop",label:"🖼️ ของ/ฉาก"}].map(b=>(
              <button key={b.id} onClick={()=>setPanel(panel===b.id?null:b.id)} style={{background:panel===b.id?"#ff6b9d":"none",border:"0.5px solid #ff6b9d",color:panel===b.id?"#fff":"#ff6b9d",borderRadius:20,padding:"6px 12px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:12}}>{b.label}</button>
            ))}
            <button onClick={()=>mainCharRef.current.click()} style={{...S.pink,fontSize:12}}>📷 อัปโหลดตัวละครหลัก</button>
            <input ref={mainCharRef} type="file" accept="image/*" onChange={e=>hImg(e,"main")} style={{display:"none"}}/>
            <input ref={extraCharRef} type="file" accept="image/*" onChange={e=>hImg(e,"extra")} style={{display:"none"}}/>
            <input ref={propRef} type="file" accept="image/*" onChange={e=>hImg(e,"prop")} style={{display:"none"}}/>
          </div>

          {/* Panel: เพิ่มคน */}
          {panel==="char"&&(
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:12,marginBottom:8}}>
              <p style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary)",margin:"0 0 10px"}}>👥 เพิ่มคน / ตัวละครในฉาก</p>
              <div style={{background:"var(--color-background-primary)",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                <p style={{fontSize:11,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>อัปโหลดรูปตัวละคร (PNG ตัดพื้นดีที่สุด)</p>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="ชื่อตัวละคร" style={{...S.inp,flex:1,minWidth:80,padding:"6px 10px",fontSize:12}}/>
                  <button onClick={()=>extraCharRef.current.click()} style={{...S.pink,fontSize:12,whiteSpace:"nowrap"}}>📷 อัปโหลดรูป</button>
                </div>
              </div>
              <p style={{fontSize:11,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>หรือเลือก Emoji ตัวละคร:</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,maxHeight:200,overflowY:"auto"}}>
                {CHAR_EMOJIS.map(c=>(
                  <button key={c.emoji} onClick={()=>addObj({type:"extrachar",emoji:c.emoji,label:c.name,w:70,h:100})} title={c.name}
                    style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"7px 4px",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <span style={{fontSize:26}}>{c.emoji}</span>
                    <span style={{fontSize:9,color:"var(--color-text-secondary)",lineHeight:1}}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Panel: Stickers */}
          {panel==="sticker"&&(
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:10,marginBottom:8}}>
              <p style={{fontSize:11,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>เลือก sticker ตกแต่งฉาก</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {STICKERS.map(p=><button key={p.emoji} onClick={()=>addObj({type:"sticker",emoji:p.emoji,label:p.l,w:60,h:60})} title={p.l} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:6,cursor:"pointer",fontSize:24,lineHeight:1}}>{p.emoji}</button>)}
              </div>
            </div>
          )}

          {/* Panel: Props */}
          {panel==="prop"&&(
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:12,marginBottom:8}}>
              <p style={{fontSize:11,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>อัปโหลดรูปของ เฟอร์นิเจอร์ หรือฉากประกอบ</p>
              <button onClick={()=>propRef.current.click()} style={{...S.pink,fontSize:12}}>📁 เลือกรูปภาพ</button>
            </div>
          )}

          {/* Object list chips */}
          {objects.length>0&&(
            <div style={{marginTop:6}}>
              <p style={{fontSize:10,color:"var(--color-text-tertiary)",margin:"0 0 5px"}}>คนและของในฉาก ({objects.length}) — แตะเพื่อเลือก</p>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {objects.map(obj=>(
                  <button key={obj.id} onClick={()=>setSelected(selected===obj.id?null:obj.id)}
                    style={{background:selected===obj.id?"#ff6b9d":"var(--color-background-primary)",color:selected===obj.id?"#fff":"var(--color-text-primary)",border:`0.5px solid ${selected===obj.id?"#ff6b9d":"var(--color-border-secondary)"}`,borderRadius:20,padding:"3px 10px",cursor:"pointer",fontSize:11,fontFamily:"Sarabun,sans-serif",display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:13}}>{obj.emoji||"🖼️"}</span>
                    <span>{obj.label||obj.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p style={{fontSize:10,color:"var(--color-text-tertiary)",margin:"8px 0 0",textAlign:"center"}}>
            💡 ลากเพื่อขยับ · ↔ มุมขวาล่าง = ปรับขนาด · ⇄ มุมซ้ายบน = กลับด้าน
          </p>
        </div>
      )}
    </div>
  );
}

// ═══ COVER DESIGNER ══════════════════════════════════════════════════════════
function CoverDesigner({game,setGame}){
  const cv=game.cover||{type:"gradient",c1:"#ffd6e7",c2:"#ffb3cf",text:"",textColor:"#fff",textSize:16};
  const set=f=>setGame({...game,cover:{...cv,...f}});
  const bgRef=useRef();
  const hBg=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setGame(g=>({...g,bgCustom:ev.target.result}));r.readAsDataURL(f);};
  const previewBg=game.bgCustom?{backgroundImage:`url(${game.bgCustom})`,backgroundSize:"cover",backgroundPosition:"center"}
    :{background:cv.type==="gradient"?`linear-gradient(135deg,${cv.c1||"#ffd6e7"},${cv.c2||"#ffb3cf"})`:(cv.solidColor||"#ffd6e7")};

  return(
    <div>
      {/* Preview */}
      <div style={{height:180,borderRadius:16,overflow:"hidden",position:"relative",marginBottom:14,...previewBg}}>
        {cv.text&&<div style={{position:"absolute",top:12,left:0,right:0,textAlign:"center",fontSize:cv.textSize||16,fontWeight:700,color:cv.textColor||"#fff",textShadow:"0 2px 6px rgba(0,0,0,0.5)",padding:"0 12px",zIndex:2}}>{cv.text}</div>}
        {game.charCustom?<img src={game.charCustom} alt="" style={{position:"absolute",right:12,bottom:0,height:"72%",objectFit:"contain",zIndex:1}}/>:<span style={{position:"absolute",right:14,bottom:8,fontSize:60,zIndex:1}}>{game.character.emoji}</span>}
        {!game.bgCustom&&<span style={{position:"absolute",left:14,bottom:10,fontSize:46,opacity:0.35}}>{game.bg.emoji}</span>}
        <div style={{position:"absolute",bottom:8,left:8,background:"rgba(0,0,0,0.4)",color:"#fff",fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:8,zIndex:2}}>{game.title||"ชื่อเกม"}</div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {/* BG type */}
        <div>
          <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:8}}>พื้นหลังปก</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[{v:"gradient",l:"🌈 สีไล่ระดับ"},{v:"solid",l:"🎨 สีเดียว"},{v:"photo",l:"📷 รูปภาพ"}].map(({v,l})=>(
              <button key={v} onClick={()=>{set({type:v});if(v==="photo")bgRef.current.click();}} style={{...S.pink,background:cv.type===v?"#ff6b9d":"none",border:"1px solid #ff6b9d",color:cv.type===v?"#fff":"#ff6b9d",fontSize:12,padding:"6px 12px"}}>{l}</button>
            ))}
            {game.bgCustom&&<button onClick={()=>setGame(g=>({...g,bgCustom:null}))} style={{...S.out(true),fontSize:12,padding:"5px 10px",borderRadius:20}}>✕ ลบรูป</button>}
          </div>
          <input ref={bgRef} type="file" accept="image/*" onChange={hBg} style={{display:"none"}}/>
        </div>
        {/* Colors */}
        {cv.type==="gradient"&&<div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>สี 1</label>
          <input type="color" value={cv.c1||"#ffd6e7"} onChange={e=>set({c1:e.target.value})} style={{width:44,height:36,borderRadius:8,border:"0.5px solid var(--color-border-secondary)",cursor:"pointer"}}/>
          <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>สี 2</label>
          <input type="color" value={cv.c2||"#ffb3cf"} onChange={e=>set({c2:e.target.value})} style={{width:44,height:36,borderRadius:8,border:"0.5px solid var(--color-border-secondary)",cursor:"pointer"}}/>
        </div>}
        {cv.type==="solid"&&<div style={{display:"flex",gap:12,alignItems:"center"}}>
          <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>สี</label>
          <input type="color" value={cv.solidColor||"#ffd6e7"} onChange={e=>set({solidColor:e.target.value})} style={{width:44,height:36,borderRadius:8,border:"0.5px solid var(--color-border-secondary)",cursor:"pointer"}}/>
        </div>}
        {/* Preset colors */}
        <div>
          <label style={{fontSize:11,color:"var(--color-text-tertiary)",display:"block",marginBottom:6}}>สีสำเร็จรูป</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[["#ffd6e7","#ffb3cf"],["#d6eaff","#b5d4ff"],["#d4f5d4","#a8e8a8"],["#ffe8cc","#ffd4a0"],["#e8d4ff","#d0a8ff"],["#2d1b69","#11092e"],["#1a1a2e","#0a0a1e"],["#fff9c4","#fff176"]].map(([c1,c2],i)=>(
              <button key={i} onClick={()=>set({type:"gradient",c1,c2})} style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${c1},${c2})`,border:`2px solid ${cv.c1===c1?"#ff6b9d":"transparent"}`,cursor:"pointer"}}/>
            ))}
          </div>
        </div>
        {/* Text overlay */}
        <div>
          <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>ข้อความบนปก</label>
          <input value={cv.text||""} onChange={e=>set({text:e.target.value})} placeholder="ข้อความ (ไม่บังคับ)" style={{...S.inp,marginBottom:8}}/>
          <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <label style={{fontSize:11,color:"var(--color-text-secondary)"}}>สีข้อความ</label>
              <input type="color" value={cv.textColor||"#ffffff"} onChange={e=>set({textColor:e.target.value})} style={{width:36,height:30,borderRadius:8,border:"0.5px solid var(--color-border-secondary)",cursor:"pointer"}}/>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flex:1}}>
              <label style={{fontSize:11,color:"var(--color-text-secondary)"}}>ขนาด {cv.textSize||16}</label>
              <input type="range" min={10} max={36} value={cv.textSize||16} onChange={e=>set({textSize:parseInt(e.target.value)})} style={{flex:1}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ SCENE EDITOR (TABBED) ════════════════════════════════════════════════════
function SceneEditor({scene,setScene,saveScene,game,onCancel,notifShow}){
  const [tab,setTab]=useState("canvas");
  const allMG=[...BUILTIN_MG,...(game.minigames||[]).filter(m=>m.type==="ai")];
  const updateChoice=(i,field,val)=>{const c=[...scene.choices];c[i]={...c[i],[field]:(field==="points"||field==="relPoints")?parseInt(val)||0:val};setScene({...scene,choices:c});};
  const TABS=[{id:"canvas",l:"🎨 ฉาก"},{id:"dialogue",l:"💬 บทพูด"},{id:"mini",l:"🎮 มินิเกม"},{id:"choices",l:"🔘 ตัวเลือก"}];
  return(
    <div style={{background:"var(--color-background-primary)",border:"1.5px solid #ff6b9d",borderRadius:16,overflow:"hidden",marginBottom:14}}>
      <div style={{display:"flex",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 4px",background:tab===t.id?"#fff0f6":"none",border:"none",borderBottom:tab===t.id?"2px solid #ff6b9d":"2px solid transparent",cursor:"pointer",fontSize:11,fontFamily:"Sarabun,sans-serif",color:tab===t.id?"#ff6b9d":"var(--color-text-secondary)",fontWeight:tab===t.id?600:400}}>{t.l}</button>)}
      </div>
      <div style={{padding:14}}>
        {tab==="canvas"&&<SceneCanvas scene={scene} setScene={setScene} game={game}/>}
        {tab==="dialogue"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* ประเภทฉาก */}
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>ประเภทฉาก</label>
              <div style={{display:"flex",gap:6}}>
                {[{v:"normal",l:"📖 ปกติ",c:"var(--color-background-secondary)"},{v:"ending",l:"🏆 ฉากจบ",c:"#fef9c3"},{v:"secret",l:"🔓 ฉากลับ",c:"#f5f3ff"}].map(t=>(
                  <button key={t.v} onClick={()=>setScene({...scene,sceneType:t.v})} style={{flex:1,background:(scene.sceneType||"normal")===t.v?("#ff6b9d"):t.c,color:(scene.sceneType||"normal")===t.v?"#fff":"var(--color-text-primary)",border:`1.5px solid ${(scene.sceneType||"normal")===t.v?"#ff6b9d":"var(--color-border-secondary)"}`,borderRadius:10,padding:"8px 4px",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif",fontWeight:(scene.sceneType||"normal")===t.v?700:400}}>
                    {t.l}
                  </button>
                ))}
              </div>
              {(scene.sceneType==="secret")&&(
                <div style={{background:"#f5f3ff",borderRadius:10,padding:"8px 12px",marginTop:8}}>
                  <p style={{fontSize:11,color:"#7c3aed",margin:"0 0 6px"}}>🔓 เงื่อนไขปลดล็อกฉากลับ</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div>
                      <label style={{fontSize:10,color:"var(--color-text-secondary)",display:"block",marginBottom:3}}>แต้มความรัก ≥</label>
                      <input type="number" min="0" max="100" value={scene.unlockRelMin||50} onChange={e=>setScene({...scene,unlockRelMin:parseInt(e.target.value)||0})} style={{...S.inp,padding:"5px 8px"}}/>
                    </div>
                    <div>
                      <label style={{fontSize:10,color:"var(--color-text-secondary)",display:"block",marginBottom:3}}>เล่นไปแล้ว (ฉาก) ≥</label>
                      <input type="number" min="0" max="50" value={scene.unlockSceneMin||0} onChange={e=>setScene({...scene,unlockSceneMin:parseInt(e.target.value)||0})} style={{...S.inp,padding:"5px 8px"}}/>
                    </div>
                  </div>
                </div>
              )}
              {(scene.sceneType==="ending")&&(
                <div style={{background:"#fef9c3",borderRadius:10,padding:"8px 12px",marginTop:8}}>
                  <p style={{fontSize:11,color:"#ca8a04",margin:0}}>🏆 ฉากนี้จะขึ้นเมื่อเกมจบ — ใช้แสดงผลลัพธ์หรือ ending พิเศษ</p>
                </div>
              )}
            </div>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>อารมณ์ตัวละคร</label>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{MOODS.map(m=><button key={m.id} onClick={()=>setScene({...scene,mood:m.id})} style={{background:scene.mood===m.id?"#fff0f6":"var(--color-background-secondary)",border:`1px solid ${scene.mood===m.id?"#ff6b9d":"var(--color-border-tertiary)"}`,borderRadius:20,padding:"4px 10px",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif",color:"var(--color-text-primary)"}}>{m.label}</button>)}</div>
            </div>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>บทพูด / คำถาม *</label>
              <textarea value={scene.dialogue} onChange={e=>setScene({...scene,dialogue:e.target.value})} placeholder={`${game.charName||game.character.name} พูดว่า...`} rows={4} style={{...S.inp,resize:"vertical"}}/>
            </div>
          </div>
        )}
        {tab==="mini"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <select value={scene.minigameId||""} onChange={e=>setScene({...scene,minigameId:e.target.value||null,mgConfig:e.target.value?(scene.mgConfig||{maxPlays:0,timeLimit:0,relPointsWin:5,relPointsLose:0}):null})} style={{...S.inp}}>
              <option value="">— ไม่มีมินิเกม —</option>
              {allMG.map(m=><option key={m.id} value={m.id}>{m.icon||"🎮"} {m.name}</option>)}
            </select>
            {scene.minigameId&&<div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"12px 14px"}}>
              <p style={{fontSize:12,fontWeight:600,color:"#ff6b9d",margin:"0 0 10px"}}>⚙️ ตั้งค่ามินิเกม</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[{l:"⏱ จำกัดเวลา (วิ) 0=ไม่จำกัด",k:"timeLimit",mn:0,mx:300},{l:"🔁 เล่นได้กี่ครั้ง 0=ไม่จำกัด",k:"maxPlays",mn:0,mx:99},{l:"❤️ ชนะ +ความสัมพันธ์",k:"relPointsWin",mn:0,mx:50},{l:"💔 แพ้ ±ความสัมพันธ์",k:"relPointsLose",mn:-50,mx:50}].map(({l,k,mn,mx})=>(
                  <div key={k}><label style={{fontSize:10,color:"var(--color-text-secondary)",display:"block",marginBottom:3}}>{l}</label>
                  <input type="number" min={mn} max={mx} value={(scene.mgConfig||{})[k]||(k==="relPointsWin"?5:0)} onChange={e=>setScene({...scene,mgConfig:{...(scene.mgConfig||{}),[k]:parseInt(e.target.value)||0}})} style={{...S.inp,padding:"7px 10px"}}/></div>
                ))}
              </div>
            </div>}
          </div>
        )}
        {tab==="choices"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>ตัวเลือกคำตอบ *</label>
              {scene.choices.length<4&&<button onClick={()=>setScene({...scene,choices:[...scene.choices,{text:"",points:0,relPoints:0}]})} style={{background:"none",border:"none",color:"#ff6b9d",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif"}}>+ เพิ่ม</button>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {scene.choices.map((ch,i)=>(
                <div key={i} style={{background:"var(--color-background-secondary)",borderRadius:10,padding:10}}>
                  <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:7}}>
                    <span style={{fontSize:13,color:"var(--color-text-tertiary)",minWidth:16}}>{i+1}.</span>
                    <input value={ch.text} onChange={e=>updateChoice(i,"text",e.target.value)} placeholder={`ตัวเลือกที่ ${i+1}`} style={{...S.inp,flex:1,background:"var(--color-background-primary)"}}/>
                    {scene.choices.length>2&&<button onClick={()=>setScene({...scene,choices:scene.choices.filter((_,ci)=>ci!==i)})} style={{background:"none",border:"none",color:"var(--color-text-danger)",cursor:"pointer",fontSize:16}}>✕</button>}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                    <div><label style={{fontSize:10,color:"var(--color-text-secondary)",display:"block",marginBottom:2}}>⭐ คะแนน</label><input type="number" value={ch.points||0} onChange={e=>updateChoice(i,"points",e.target.value)} style={{...S.inp,textAlign:"center",padding:"5px 4px",background:"var(--color-background-primary)"}}/></div>
                    <div><label style={{fontSize:10,color:"var(--color-text-secondary)",display:"block",marginBottom:2}}>❤️ ความสัมพันธ์</label><input type="number" min="-20" max="20" value={ch.relPoints||0} onChange={e=>updateChoice(i,"relPoints",parseInt(e.target.value)||0)} style={{...S.inp,textAlign:"center",padding:"5px 4px",background:"var(--color-background-primary)"}}/></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button onClick={onCancel} style={{flex:1,...S.out(),padding:10,borderRadius:10}}>ยกเลิก</button>
          <button onClick={()=>{if(!scene.dialogue.trim()){notifShow("ใส่บทพูดก่อน","err");return;}if(scene.choices.some(c=>!c.text.trim())){notifShow("ใส่ตัวเลือกทุกช่อง","err");return;}saveScene(scene);}} style={{flex:2,...S.pink,padding:10,fontWeight:700,borderRadius:10}}>✅ บันทึกฉากนี้</button>
        </div>
      </div>
    </div>
  );
}

// ═══ CREATE SCREEN ════════════════════════════════════════════════════════════
function CreateScreen({game,setGame,publish,setScreen,notifShow}){
  const [step,setStep]=useState(0);
  const [editScene,setEditScene]=useState(null);
  const bgRef=useRef(),charRef=useRef();
  const isEdit=!!(game.updatedAt||game.readerCount);
  const steps=["ตั้งค่า","ฉากหลัง","ตัวละคร","ปกเกม","สร้างฉาก","มินิเกม","เผยแพร่"];

  const hImg=(e,t)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setGame(g=>t==="bg"?{...g,bgCustom:ev.target.result}:{...g,charCustom:ev.target.result});r.readAsDataURL(f);};
  const addScene=()=>setEditScene({id:gid(),dialogue:"",mood:"happy",charEmoji:game.character.emoji,objects:[],choices:[{text:"",points:10,relPoints:5},{text:"",points:0,relPoints:0}],minigameId:null,mgConfig:null});
  const saveScene=sc=>{const i=game.scenes.findIndex(s=>s.id===sc.id);let ns;if(i>=0){ns=[...game.scenes];ns[i]=sc;}else ns=[...game.scenes,sc];setGame({...game,scenes:ns});setEditScene(null);notifShow("บันทึกฉากแล้ว ✅");};
  const toggleTag=t=>{const tags=game.tags||[];setGame({...game,tags:tags.includes(t)?tags.filter(x=>x!==t):[...tags,t]});};

  const S0=(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div><label style={{fontSize:13,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>ชื่อเกม *</label><input value={game.title} onChange={e=>setGame({...game,title:e.target.value})} placeholder="เช่น: จีบมินที่สวนดอกไม้" style={{...S.inp}}/></div>
      <div><label style={{fontSize:13,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>คำอธิบาย (แสดงในหน้าแนะนำเกม)</label><textarea value={game.description} onChange={e=>setGame({...game,description:e.target.value})} placeholder="เล่าย่อๆ เกี่ยวกับเกมนี้ ตัวละคร หรือเนื้อเรื่อง..." rows={4} style={{...S.inp,resize:"vertical"}}/></div>

      {/* เพลงประกอบ YouTube */}
      <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"12px 14px"}}>
        <label style={{fontSize:13,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>🎵 เพลงประกอบเกม (YouTube)</label>
        <input value={game.musicUrl||""} onChange={e=>setGame({...game,musicUrl:e.target.value})} placeholder="วาง URL YouTube เช่น https://youtu.be/xxxx หรือ https://www.youtube.com/watch?v=xxxx" style={{...S.inp,marginBottom:8}}/>
        {game.musicUrl&&ytVideoId(game.musicUrl)&&(
          <div style={{borderRadius:10,overflow:"hidden",marginTop:6}}>
            <iframe width="100%" height="80" src={`https://www.youtube.com/embed/${ytVideoId(game.musicUrl)}?autoplay=0`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{display:"block"}}/>
          </div>
        )}
        <div style={{marginTop:8}}>
          <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>ตั้งค่าเพลง:</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <label style={{fontSize:12,color:"var(--color-text-primary)",display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
              <input type="checkbox" checked={game.musicAutoplay||false} onChange={e=>setGame({...game,musicAutoplay:e.target.checked})}/> เล่นอัตโนมัติตอนเริ่ม
            </label>
            <label style={{fontSize:12,color:"var(--color-text-primary)",display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
              <input type="checkbox" checked={game.musicLoop||false} onChange={e=>setGame({...game,musicLoop:e.target.checked})}/> วนซ้ำ
            </label>
          </div>
        </div>
        {game.musicUrl&&<button onClick={()=>setGame({...game,musicUrl:"",musicAutoplay:false,musicLoop:false})} style={{background:"none",border:"none",color:"var(--color-text-danger)",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif",marginTop:6}}>✕ ลบเพลง</button>}
      </div>

      {/* แต้มความรักเพิ่มเติม */}
      <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"12px 14px"}}>
        <label style={{fontSize:13,color:"var(--color-text-secondary)",display:"block",marginBottom:8}}>❤️ รางวัลแต้มความรักพิเศษ</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><label style={{fontSize:11,color:"var(--color-text-tertiary)",display:"block",marginBottom:4}}>เล่นจนจบ (ฉากปกติ)</label><input type="number" min="0" max="50" value={game.bonusRelFinish||0} onChange={e=>setGame({...game,bonusRelFinish:parseInt(e.target.value)||0})} style={{...S.inp,padding:"7px 10px"}}/></div>
          <div><label style={{fontSize:11,color:"var(--color-text-tertiary)",display:"block",marginBottom:4}}>จบฉากพิเศษ (ฉากลับ)</label><input type="number" min="0" max="100" value={game.bonusRelSecret||0} onChange={e=>setGame({...game,bonusRelSecret:parseInt(e.target.value)||0})} style={{...S.inp,padding:"7px 10px"}}/></div>
        </div>
      </div>

      <div>
        <label style={{fontSize:13,color:"var(--color-text-secondary)",display:"block",marginBottom:8}}>แท็กประเภทเกม</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>{GENRE_TAGS.map(t=>{const s=(game.tags||[]).includes(t);return <button key={t} onClick={()=>toggleTag(t)} style={{background:s?"#ff6b9d":"var(--color-background-secondary)",color:s?"#fff":"var(--color-text-primary)",border:`1px solid ${s?"#ff6b9d":"var(--color-border-secondary)"}`,borderRadius:20,padding:"4px 11px",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif"}}>{t}</button>;})}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{TONE_TAGS.map(t=>{const s=(game.tags||[]).includes(t);return <button key={t} onClick={()=>toggleTag(t)} style={{background:s?"#ff6b9d":"var(--color-background-secondary)",color:s?"#fff":"var(--color-text-primary)",border:`1px solid ${s?"#ff6b9d":"var(--color-border-secondary)"}`,borderRadius:20,padding:"4px 11px",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif"}}>{t}</button>;})}</div>
      </div>
    </div>
  );
  const S1=(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
        {BGS.map(bg=><button key={bg.id} onClick={()=>setGame({...game,bg,bgCustom:null})} style={{background:bg.color,border:`2px solid ${game.bg.id===bg.id&&!game.bgCustom?"#ff6b9d":"transparent"}`,borderRadius:10,padding:"12px 4px",cursor:"pointer",textAlign:"center"}}><div style={{fontSize:22}}>{bg.emoji}</div><div style={{fontSize:10,marginTop:3,color:bg.dark?"#fff":"#333",fontFamily:"Sarabun,sans-serif"}}>{bg.name}</div></button>)}
      </div>
      <div style={{border:"1.5px dashed var(--color-border-secondary)",borderRadius:12,padding:14,textAlign:"center"}}>
        {game.bgCustom?<div><img src={game.bgCustom} style={{width:"100%",maxHeight:100,objectFit:"cover",borderRadius:8,marginBottom:8}}/><button onClick={()=>setGame({...game,bgCustom:null})} style={{background:"none",border:"none",color:"var(--color-text-danger)",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:13}}>✕ ลบรูปนี้</button></div>
          :<div><p style={{fontSize:13,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>อัปโหลดฉากหลังของคุณ</p><button onClick={()=>bgRef.current.click()} style={{...S.pink}}>📁 เลือกรูปภาพ</button><input ref={bgRef} type="file" accept="image/*" onChange={e=>hImg(e,"bg")} style={{display:"none"}}/></div>}
      </div>
    </div>
  );
  const S2=(
    <div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
        <div><label style={{fontSize:13,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>ชื่อตัวละคร</label><input value={game.charName||""} onChange={e=>setGame({...game,charName:e.target.value})} placeholder="ชื่อตัวละคร" style={{...S.inp}}/></div>
        <div><label style={{fontSize:13,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>สีชื่อ</label><div style={{display:"flex",gap:8,alignItems:"center"}}><input type="color" value={game.charColor||"#ff6b9d"} onChange={e=>setGame({...game,charColor:e.target.value})} style={{width:40,height:36,borderRadius:8,border:"0.5px solid var(--color-border-secondary)",cursor:"pointer"}}/><span style={{fontSize:13,color:game.charColor||"#ff6b9d",fontWeight:700}}>{game.charName||"ตัวอย่าง"}</span></div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
        {CHARS.map(ch=><button key={ch.id} onClick={()=>setGame({...game,character:ch,charCustom:null,charName:game.charName||ch.name})} style={{background:game.character.id===ch.id&&!game.charCustom?"#fff0f6":"var(--color-background-secondary)",border:`2px solid ${game.character.id===ch.id&&!game.charCustom?"#ff6b9d":"transparent"}`,borderRadius:10,padding:"10px 4px",cursor:"pointer",textAlign:"center"}}><div style={{fontSize:30}}>{ch.emoji}</div><div style={{fontSize:11,marginTop:3,fontFamily:"Sarabun,sans-serif",color:"var(--color-text-primary)"}}>{ch.name}</div></button>)}
      </div>
      <div style={{border:"1.5px dashed var(--color-border-secondary)",borderRadius:12,padding:14,textAlign:"center"}}>
        {game.charCustom?<div><img src={game.charCustom} style={{height:90,objectFit:"contain",marginBottom:8}}/><br/><button onClick={()=>setGame({...game,charCustom:null})} style={{background:"none",border:"none",color:"var(--color-text-danger)",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:13}}>✕ ลบรูปนี้</button></div>
          :<div><p style={{fontSize:13,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>อัปโหลดรูปตัวละคร (PNG ตัดพื้นดีที่สุด)</p><button onClick={()=>charRef.current.click()} style={{...S.pink}}>📁 เลือกรูปภาพ</button><input ref={charRef} type="file" accept="image/*" onChange={e=>hImg(e,"char")} style={{display:"none"}}/></div>}
      </div>
    </div>
  );
  const S3=<CoverDesigner game={game} setGame={setGame}/>;
  const S4=(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>{game.scenes.length} ฉาก</p><button onClick={addScene} style={{...S.pink}}>+ เพิ่มฉาก</button></div>
      {editScene&&<SceneEditor scene={editScene} setScene={setEditScene} saveScene={saveScene} game={game} onCancel={()=>setEditScene(null)} notifShow={notifShow}/>}
      {game.scenes.length===0&&!editScene&&<div style={{textAlign:"center",padding:28,background:"var(--color-background-secondary)",borderRadius:14}}><div style={{fontSize:36}}>💬</div><p style={{color:"var(--color-text-secondary)",margin:"8px 0 0"}}>กด "+ เพิ่มฉาก" เพื่อสร้างบทสนทนาแรก</p></div>}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:editScene?12:0}}>
        {game.scenes.map((sc,i)=>(
          <div key={sc.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}><p style={{fontSize:11,color:"var(--color-text-secondary)",margin:"0 0 3px"}}>ฉากที่ {i+1} {sc.minigameId?"🎮":""} {sc.objects?.length?`· ${sc.objects.length} obj`:""}</p><p style={{margin:0,fontSize:13}}>{sc.dialogue.slice(0,50)}{sc.dialogue.length>50?"...":""}</p><p style={{margin:"3px 0 0",fontSize:11,color:"var(--color-text-secondary)"}}>{sc.choices.length} ตัวเลือก</p></div>
            <div style={{display:"flex",gap:8}}><button onClick={()=>setEditScene(sc)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--color-text-secondary)"}}>✏️</button><button onClick={()=>setGame({...game,scenes:game.scenes.filter(s=>s.id!==sc.id)})} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--color-text-danger)"}}>🗑️</button></div>
          </div>
        ))}
      </div>
    </div>
  );
  const S5=(
    <div>
      <p style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:12}}>เพิ่มมินิเกมในเกมของคุณ</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {BUILTIN_MG.map(mg=>{const added=(game.minigames||[]).some(m=>m.id===mg.id);return(
          <div key={mg.id} style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:24}}>{mg.icon}</span>
            <div style={{flex:1}}><p style={{margin:"0 0 2px",fontSize:14,fontWeight:500}}>{mg.name}</p><p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)"}}>{mg.desc}</p></div>
            <button onClick={()=>setGame(added?{...game,minigames:(game.minigames||[]).filter(m=>m.id!==mg.id)}:{...game,minigames:[...(game.minigames||[]),{...mg,type:"builtin"}]})} style={{background:added?"var(--color-background-danger)":"#ff6b9d",border:"none",color:added?"var(--color-text-danger)":"#fff",borderRadius:20,padding:"5px 12px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:13}}>{added?"ลบออก":"เพิ่ม"}</button>
          </div>
        );})}
      </div>
      {(game.minigames||[]).length>0&&<div><h4 style={{fontSize:13,margin:"0 0 8px"}}>มินิเกมในเกมนี้ ({game.minigames.length})</h4>{game.minigames.map(mg=><div key={mg.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--color-background-secondary)",borderRadius:10,padding:"8px 12px",marginBottom:6}}><span style={{fontSize:13}}>{mg.icon||"🎮"} {mg.name}</span><button onClick={()=>setGame({...game,minigames:(game.minigames||[]).filter(m=>m.id!==mg.id)})} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-danger)",fontSize:15}}>🗑️</button></div>)}</div>}
    </div>
  );
  const cv=game.cover||{type:"gradient",c1:"#ffd6e7",c2:"#ffb3cf"};
  const prevBg=game.bgCustom?{backgroundImage:`url(${game.bgCustom})`,backgroundSize:"cover",backgroundPosition:"center"}:{background:cv.type==="gradient"?`linear-gradient(135deg,${cv.c1},${cv.c2})`:(cv.solidColor||game.bg.color)};
  const S6=(
    <div style={{padding:"10px 0"}}>
      {/* Cover preview */}
      <div style={{borderRadius:16,height:160,overflow:"hidden",position:"relative",marginBottom:14,...prevBg}}>
        {cv.text&&<div style={{position:"absolute",top:10,left:0,right:0,textAlign:"center",fontSize:cv.textSize||16,fontWeight:700,color:cv.textColor||"#fff",textShadow:"0 2px 5px rgba(0,0,0,0.5)"}}>{cv.text}</div>}
        {!game.bgCustom&&<span style={{position:"absolute",left:14,bottom:10,fontSize:44,opacity:0.3}}>{game.bg.emoji}</span>}
        {game.charCustom?<img src={game.charCustom} style={{position:"absolute",right:14,bottom:0,height:"74%",objectFit:"contain"}}/>:<span style={{position:"absolute",right:14,bottom:8,fontSize:60}}>{game.character.emoji}</span>}
        <div style={{position:"absolute",bottom:8,left:8,background:"rgba(0,0,0,0.4)",color:"#fff",fontSize:13,fontWeight:600,padding:"3px 10px",borderRadius:8}}>{game.title||"ชื่อเกม"}</div>
      </div>
      <div style={{textAlign:"center",marginBottom:16}}>
        <h3 style={{fontSize:18,margin:"0 0 4px"}}>{game.title||"ยังไม่มีชื่อ"}</h3>
        <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>{game.scenes.length} ฉาก · {(game.minigames||[]).length} มินิเกม</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:8}}>{(game.tags||[]).map(t=><span key={t} style={{background:"#ff6b9d",color:"#fff",fontSize:11,padding:"2px 9px",borderRadius:20}}>{t}</span>)}</div>
      </div>

      {/* Privacy toggle */}
      <div style={{background:"var(--color-background-secondary)",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <p style={{fontSize:13,fontWeight:600,margin:"0 0 12px",color:"var(--color-text-primary)"}}>🔒 การมองเห็น</p>
        <div style={{display:"flex",gap:8}}>
          {[
            {v:false, icon:"🌍", label:"สาธารณะ",  desc:"ทุกคนเห็นและเล่นได้"},
            {v:true,  icon:"🔒", label:"ส่วนตัว",   desc:"มีแค่คุณที่เห็น แม้แต่ admin ก็ไม่เห็น"},
          ].map(opt=>(
            <button key={String(opt.v)} onClick={()=>setGame({...game,isPrivate:opt.v})}
              style={{flex:1,background:(game.isPrivate===opt.v)?(opt.v?"#7c3aed":"#ff6b9d"):"var(--color-background-primary)",
                color:(game.isPrivate===opt.v)?"#fff":"var(--color-text-primary)",
                border:`1.5px solid ${game.isPrivate===opt.v?(opt.v?"#7c3aed":"#ff6b9d"):"var(--color-border-secondary)"}`,
                borderRadius:12,padding:"12px 8px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:4}}>{opt.icon}</div>
              <div style={{fontSize:13,fontWeight:700}}>{opt.label}</div>
              <div style={{fontSize:10,opacity:0.8,marginTop:3}}>{opt.desc}</div>
            </button>
          ))}
        </div>
        {game.isPrivate&&(
          <div style={{background:"#f5f3ff",borderRadius:10,padding:"8px 12px",marginTop:10,fontSize:12,color:"#7c3aed"}}>
            🔒 โหมดส่วนตัว: เกมนี้จะไม่ปรากฏในหน้าหลัก เฉพาะคุณเท่านั้นที่เห็นในโปรไฟล์
          </div>
        )}
      </div>

      {isEdit&&<div style={{background:"var(--color-background-info)",color:"var(--color-text-info)",borderRadius:10,padding:"8px 14px",fontSize:12,marginBottom:12}}>📝 อัปเดตเกมที่เผยแพร่แล้ว</div>}

      {/* Action buttons */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {/* Save as draft */}
        <button onClick={()=>publish(game,true)}
          style={{width:"100%",background:"none",border:"1.5px solid var(--color-border-secondary)",color:"var(--color-text-primary)",borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:14,fontWeight:500}}>
          💾 บันทึก Draft (ยังไม่เผยแพร่)
        </button>

        {/* Publish */}
        {game.title&&game.scenes.length>0
          ?<button onClick={()=>publish(game,false)} style={{...S.pink,width:"100%",padding:14,fontSize:16,fontWeight:700,borderRadius:12}}>
            {isEdit?"🔄 อัปเดตเกม!":game.isPrivate?"🔒 บันทึกแบบส่วนตัว":"🚀 เผยแพร่เกม!"}
          </button>
          :<div style={{background:"var(--color-background-danger)",color:"var(--color-text-danger)",borderRadius:12,padding:"10px 14px",fontSize:13,textAlign:"center"}}>ต้องมีชื่อเกม และอย่างน้อย 1 ฉาก</div>
        }
      </div>
    </div>
  );
  const content=[S0,S1,S2,S3,S4,S5,S6];
  return(
    <div style={{maxWidth:640,margin:"0 auto",padding:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"var(--color-text-secondary)"}}>←</button>
        <h2 style={{margin:0,fontSize:17,flex:1}}>{isEdit?"✏️ แก้ไขเกม":"สร้างเกมใหม่"}</h2>
        <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{step+1}/{steps.length}</span>
      </div>
      <div style={{display:"flex",gap:3,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
        {steps.map((s,i)=><button key={i} onClick={()=>setStep(i)} style={{flex:1,minWidth:50,fontSize:10,padding:"5px 3px",borderRadius:8,border:"none",background:i===step?"#ff6b9d":i<step?"#ffb3cf":"var(--color-background-secondary)",color:i<=step?"#fff":"var(--color-text-secondary)",cursor:"pointer",fontFamily:"Sarabun,sans-serif",whiteSpace:"nowrap"}}>{s}</button>)}
      </div>
      {content[step]}
      <div style={{display:"flex",gap:10,marginTop:20}}>
        {step>0&&<button onClick={()=>setStep(step-1)} style={{flex:1,...S.out(),padding:11,borderRadius:12}}>← ย้อนกลับ</button>}
        {step<steps.length-1&&<button onClick={()=>setStep(step+1)} style={{flex:2,...S.pink,padding:11,fontSize:14,fontWeight:700,borderRadius:12}}>ถัดไป →</button>}
      </div>
    </div>
  );
}

// ═══ PLAY SCREEN ══════════════════════════════════════════════════════════════
function PlayScreen({data,setData,setScreen,notifShow,finishPlay}){
  const {game,sceneIndex,score} = data;
  const [relPoints,setRelPoints]=useState(data.relPoints||0);
  const [miniPlaying,setMiniPlaying]=useState(null);
  const [miniResult,setMiniResult]=useState(null);
  const [mgCount,setMgCount]=useState({});
  const [mgTimer,setMgTimer]=useState(null);
  const [ended,setEnded]=useState(false);
  const mgRef=useRef();
  const doneRef=useRef(false);

  const scene=!ended&&sceneIndex<game.scenes.length?game.scenes[sceneIndex]:null;
  const isEnd=sceneIndex>=game.scenes.length;

  useEffect(()=>{
    if(isEnd&&!doneRef.current){doneRef.current=true;finishPlay(game.id,relPoints-(data.relPoints||0));}
  },[isEnd]);

  const choose=ch=>{
    const rg=ch.relPoints||0;const nr=Math.min(100,relPoints+rg);setRelPoints(nr);setMiniResult(null);
    const next=ch.next!==undefined?ch.next:sceneIndex+1;
    setData({...data,sceneIndex:next,score:score+(ch.points||0),relPoints:nr});
  };

  const openMini=()=>{
    if(!scene?.minigameId)return;
    const mg=game.minigames?.find(m=>m.id===scene.minigameId)||BUILTIN_MG.find(m=>m.id===scene.minigameId);
    if(!mg)return;
    const cfg=scene.mgConfig||{};const maxP=cfg.maxPlays||0;const cur=mgCount[scene.id]||0;
    if(maxP>0&&cur>=maxP){notifShow(`เล่นได้สูงสุด ${maxP} ครั้ง`,"err");return;}
    setMgCount(p=>({...p,[scene.id]:cur+1}));setMiniPlaying({...mg,cfg});
    const tl=cfg.timeLimit||0;
    if(tl>0){setMgTimer(tl);mgRef.current=setInterval(()=>setMgTimer(t=>{if(t<=1){clearInterval(mgRef.current);return 0;}return t-1;}),1000);}
  };

  const finishMini=(won,pts)=>{
    clearInterval(mgRef.current);setMgTimer(null);
    const rg=won?(miniPlaying?.cfg?.relPointsWin||5):(miniPlaying?.cfg?.relPointsLose||0);
    const nr=Math.min(100,relPoints+rg);setRelPoints(nr);setMiniResult({won,pts,rg});setMiniPlaying(null);
    if(won){setData(d=>({...d,score:d.score+(pts||15),relPoints:nr}));notifShow(`🎉 ชนะ! +${pts||15} คะแนน${rg>0?` +${rg}❤️`:""}`);}
    else notifShow("😅 แพ้มินิเกม","err");
  };

  if(miniPlaying)return(
    <div style={{maxWidth:520,margin:"0 auto"}}>
      {mgTimer>0&&<div style={{textAlign:"center",padding:"10px 0",fontSize:13,color:mgTimer<=5?"#ef4444":"var(--color-text-secondary)"}}>⏳ เวลา: <strong>{mgTimer}s</strong></div>}
      <MiniGamePlay mg={miniPlaying} onFinish={finishMini}/>
    </div>
  );

  if(isEnd){
    const maxScore=game.scenes.reduce((s,sc)=>s+Math.max(...(sc.choices||[{points:0}]).map(c=>c.points||0)),0);
    const pct=maxScore>0?Math.round((score/maxScore)*100):0;
    const rl=getRL(relPoints);
    return(
      <div style={{maxWidth:460,margin:"40px auto",padding:"0 16px",textAlign:"center"}}>
        <div style={{background:"var(--color-background-primary)",borderRadius:20,border:"0.5px solid var(--color-border-tertiary)",padding:28}}>
          <div style={{fontSize:60,marginBottom:8}}>{pct>=80?"💑":pct>=50?"💕":"😅"}</div>
          <h2 style={{fontSize:22,margin:"0 0 6px"}}>จบแล้ว!</h2>
          <p style={{fontSize:15,color:"var(--color-text-secondary)",margin:"0 0 20px"}}>{pct>=80?"💑 จีบสำเร็จ!":pct>=50?"💕 เธอ/เขาชอบคุณ!":"😅 ลองใหม่อีกครั้งนะ"}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"12px 8px"}}><p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)"}}>คะแนน</p><p style={{margin:0,fontSize:26,fontWeight:700,color:"#ff6b9d"}}>{score}<span style={{fontSize:13,fontWeight:400}}>/{maxScore}</span></p></div>
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"12px 8px"}}><p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)"}}>ความสัมพันธ์</p><p style={{margin:0,fontSize:22,fontWeight:700,color:rl.color}}>{relPoints} ❤️</p></div>
          </div>
          <div style={{background:"var(--color-background-secondary)",borderRadius:14,padding:"14px 16px",marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:10}}><span style={{fontSize:28}}>{rl.emoji}</span><span style={{fontWeight:700,fontSize:16,color:rl.color}}>{rl.label}</span></div>
            <RelBar value={relPoints} color={rl.color}/>
          </div>
          <button onClick={()=>setScreen("home")} style={{...S.pink,borderRadius:12,padding:"12px 28px",fontSize:16,fontWeight:700,width:"100%"}}>กลับหน้าหลัก</button>
        </div>
      </div>
    );
  }

  const bgStyle=game.bgCustom?{backgroundImage:`url(${game.bgCustom})`,backgroundSize:"cover",backgroundPosition:"center"}:{background:game.bg.color};
  const rl=getRL(relPoints);
  const cfg=scene?.mgConfig||{};const maxP=cfg.maxPlays||0;const curP=mgCount[scene?.id]||0;const mgLocked=maxP>0&&curP>=maxP;

  return(
    <div style={{maxWidth:520,margin:"0 auto",padding:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,background:"var(--color-background-primary)",borderRadius:12,padding:"8px 14px",border:"0.5px solid var(--color-border-tertiary)"}}>
        <span style={{fontSize:16}}>{rl.emoji}</span>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:rl.color,fontWeight:600}}>{rl.label}</span><span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{relPoints}/100 ❤️</span></div>
          <RelBar value={relPoints} color={rl.color}/>
        </div>
        <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{sceneIndex+1}/{game.scenes.length}</span>
      </div>

      <div style={{borderRadius:20,overflow:"hidden",minHeight:290,display:"flex",flexDirection:"column",justifyContent:"flex-end",position:"relative",marginBottom:12,...bgStyle}}>
        {scene?.minigameId&&<button onClick={mgLocked?undefined:openMini} style={{position:"absolute",top:10,right:10,background:mgLocked?"rgba(0,0,0,0.35)":"rgba(255,107,157,0.9)",border:"none",color:"#fff",borderRadius:12,padding:"5px 12px",cursor:mgLocked?"not-allowed":"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif",zIndex:5}}>{mgLocked?`🔒 ครบ ${maxP} ครั้ง`:`🎮 มินิเกม${maxP>0?` (${curP}/${maxP})`:""}`}</button>}
        {/* Render scene using SceneCanvas in play mode */}
        <SceneCanvas scene={scene||{objects:[]}} setScene={()=>{}} game={game} isPlay={true}/>
        <div style={{background:"rgba(255,255,255,0.93)",margin:10,borderRadius:14,padding:"10px 14px",backdropFilter:"blur(4px)",zIndex:4}}>
          {scene?.mood&&<span style={{fontSize:11,marginBottom:2,display:"block"}}>{MOODS.find(m=>m.id===scene.mood)?.label||""}</span>}
          <p style={{fontSize:13,color:game.charColor||"#ff6b9d",fontWeight:600,margin:"0 0 3px"}}>{game.charName||game.character.name}</p>
          <p style={{fontSize:15,margin:0,color:"#222",lineHeight:1.7}}>{scene?.dialogue}</p>
        </div>
      </div>

      {miniResult&&<div style={{background:miniResult.won?"var(--color-background-success)":"var(--color-background-danger)",borderRadius:10,padding:"8px 14px",marginBottom:10,fontSize:13,color:miniResult.won?"var(--color-text-success)":"var(--color-text-danger)",display:"flex",justifyContent:"space-between"}}><span>{miniResult.won?`🎉 ชนะ! +${miniResult.pts} คะแนน`:"😅 แพ้มินิเกม"}</span>{miniResult.rg>0&&<span>+{miniResult.rg} ❤️</span>}</div>}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {(scene?.choices||[]).map((ch,i)=>(
          <button key={i} onClick={()=>choose(ch)} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:14,padding:"11px 16px",cursor:"pointer",textAlign:"left",fontFamily:"Sarabun,sans-serif",fontSize:15,color:"var(--color-text-primary)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>{ch.text}</span>
            {(ch.relPoints||0)!==0&&<span style={{fontSize:11,color:ch.relPoints>0?"#f472b6":"#94a3b8",whiteSpace:"nowrap",marginLeft:8}}>{ch.relPoints>0?`+${ch.relPoints}`:ch.relPoints} ❤️</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══ MINIGAMES ════════════════════════════════════════════════════════════════
function MiniGamePlay({mg,onFinish}){
  if(mg.id==="balloon")   return <MG_Balloon onFinish={onFinish}/>;
  if(mg.id==="shoot")     return <MG_Shoot onFinish={onFinish}/>;
  if(mg.id==="memory")    return <MG_Memory onFinish={onFinish}/>;
  if(mg.id==="tapheart")  return <MG_TapHeart onFinish={onFinish}/>;
  if(mg.id==="wordguess") return <MG_WordGuess onFinish={onFinish}/>;
  if(mg.id==="quiz")      return <MG_Quiz onFinish={onFinish}/>;
  return <div style={{padding:40,textAlign:"center"}}><p>🎮 {mg.name}</p><button onClick={()=>onFinish(true,10)} style={{...S.pink,borderRadius:12,padding:"10px 20px"}}>เล่นเสร็จแล้ว!</button></div>;
}
function MG_Balloon({onFinish}){
  const mk=()=>Array.from({length:10},(_,i)=>({id:i,x:8+Math.random()*76,y:5+Math.random()*68,popped:false}));
  const [balls,setBalls]=useState(mk);const [p,setP]=useState(0);const [t,setT]=useState(12);const [done,setDone]=useState(false);const [bst,setBst]=useState([]);
  const bid=useRef(0),tr=useRef();
  useEffect(()=>{tr.current=setInterval(()=>setT(v=>{if(v<=1){clearInterval(tr.current);setDone(true);return 0;}return v-1;}),1000);return()=>clearInterval(tr.current);},[]);
  useEffect(()=>{if(done)setTimeout(()=>onFinish(p>=7,p>=7?15:0),900);},[done]);
  const shoot=(id,x,y)=>{if(done)return;const aid=bid.current++;setBst(b=>[...b,{id:aid,x,y}]);setTimeout(()=>setBst(b=>b.filter(v=>v.id!==aid)),350);setBalls(b=>b.map(v=>v.id===id?{...v,popped:true}:v));const np=p+1;setP(np);if(np>=10){clearInterval(tr.current);setDone(true);}};
  const alive=balls.filter(b=>!b.popped);
  return(<div style={{maxWidth:420,margin:"16px auto",padding:"0 16px"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:700}}>🎈 ป่าโป่ง</span><div style={{display:"flex",gap:12}}><span style={{fontSize:13}}>แตก {p}/10</span><span style={{fontWeight:700,color:t<=4?"#ef4444":"inherit"}}>⏱{t}s</span></div></div>
    <div style={{position:"relative",height:260,background:"linear-gradient(180deg,#e0f4ff,#f9e8ff)",borderRadius:18,overflow:"hidden",cursor:"crosshair"}}>
      {alive.map(b=><button key={b.id} onClick={e=>{e.stopPropagation();shoot(b.id,b.x,b.y);}} style={{position:"absolute",left:`${b.x}%`,top:`${b.y}%`,transform:"translate(-50%,-50%)",background:"none",border:"none",cursor:"crosshair",fontSize:40,lineHeight:1,animation:"bf 3s ease-in-out infinite",animationDelay:`${b.id*0.3}s`}}>🎈</button>)}
      {bst.map(b=><div key={b.id} style={{position:"absolute",left:`${b.x}%`,top:`${b.y}%`,transform:"translate(-50%,-50%)",fontSize:24,animation:"pb 0.35s ease-out forwards",pointerEvents:"none"}}>💥</div>)}
      {done&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.88)",gap:6}}><span style={{fontSize:52}}>{p>=7?"🎉":"😅"}</span><p style={{margin:0,fontWeight:700,fontSize:18,color:p>=7?"#22c55e":"#ef4444"}}>{p>=7?`ยอดเยี่ยม! แตก ${p} ลูก`:`แตก ${p}/10 ลูก`}</p></div>}
    </div>
    <p style={{fontSize:12,color:"var(--color-text-secondary)",textAlign:"center",marginTop:8}}>👆 คลิกที่ลูกโป่งเพื่อปา!</p>
    <style>{`@keyframes bf{0%,100%{transform:translate(-50%,-50%) translateY(0)}50%{transform:translate(-50%,-50%) translateY(-10px)}}@keyframes pb{0%{transform:translate(-50%,-50%) scale(0.5);opacity:1}100%{transform:translate(-50%,-50%) scale(1.8);opacity:0}}`}</style>
  </div>);
}
function MG_Shoot({onFinish}){
  const mk=()=>Array.from({length:3},(_,i)=>({id:i,x:10+Math.random()*72,y:15+Math.random()*62}));
  const [s,setS]=useState(0);const [t,setT]=useState(10);const [tg,setTg]=useState(mk);const [done,setDone]=useState(false);const r=useRef();
  useEffect(()=>{r.current=setInterval(()=>{setT(v=>{if(v<=1){clearInterval(r.current);setDone(true);return 0;}return v-1;});setTg(mk());},1000);return()=>clearInterval(r.current);},[]);
  useEffect(()=>{if(done)setTimeout(()=>onFinish(s>=5,s>=5?20:0),900);},[done]);
  const hit=id=>{if(done)return;setS(v=>v+1);setTg(v=>v.filter(x=>x.id!==id));setTimeout(()=>setTg(mk()),200);};
  return(<div style={{maxWidth:400,margin:"20px auto",padding:16}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontWeight:700}}>🎯 คะแนน: {s}/5</span><span style={{color:t<=3?"#ef4444":"inherit",fontWeight:700}}>⏱{t}s</span></div>
    <div style={{position:"relative",height:240,background:"linear-gradient(135deg,#e0f0ff,#f0e8ff)",borderRadius:16,overflow:"hidden"}}>
      {!done&&tg.map(v=><button key={v.id} onClick={()=>hit(v.id)} style={{position:"absolute",left:`${v.x}%`,top:`${v.y}%`,transform:"translate(-50%,-50%)",background:"none",border:"none",fontSize:36,cursor:"pointer",transition:"left 0.3s,top 0.3s"}}>🎯</button>)}
      {done&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:8}}><span style={{fontSize:50}}>{s>=5?"🎉":"😅"}</span><p style={{fontWeight:700,margin:0,fontSize:18,color:s>=5?"#22c55e":"#ef4444"}}>{s>=5?`ยอดเยี่ยม! ${s} เป้า`:`ได้ ${s}/5`}</p></div>}
    </div>
    <p style={{fontSize:12,color:"var(--color-text-secondary)",textAlign:"center",marginTop:8}}>คลิกเป้าให้ได้ 5 ใน 10 วินาที</p>
  </div>);
}
function MG_Memory({onFinish}){
  const em=["💕","🌸","⭐","🎀","🍓","🦋"];
  const [cards,setCards]=useState(()=>[...em,...em].sort(()=>Math.random()-.5).map((e,i)=>({id:i,e,f:false,m:false})));
  const [sel,setSel]=useState([]);const [mv,setMv]=useState(0);
  const flip=id=>{const c=cards.find(v=>v.id===id);if(!c||c.f||c.m||sel.length>=2)return;const ns=[...sel,id];const nc=cards.map(v=>v.id===id?{...v,f:true}:v);setCards(nc);setSel(ns);setMv(m=>m+1);
    if(ns.length===2){const[a,b]=ns.map(s=>nc.find(v=>v.id===s));if(a.e===b.e){const mc=nc.map(v=>ns.includes(v.id)?{...v,m:true}:v);setCards(mc);setSel([]);if(mc.every(v=>v.m))setTimeout(()=>onFinish(true,18),800);}else setTimeout(()=>{setCards(p=>p.map(v=>ns.includes(v.id)?{...v,f:false}:v));setSel([]);},900);}};
  return(<div style={{maxWidth:380,margin:"20px auto",padding:16,textAlign:"center"}}>
    <h3 style={{margin:"0 0 4px"}}>🃏 จับคู่ไพ่</h3><p style={{fontSize:12,color:"var(--color-text-secondary)",margin:"0 0 12px"}}>ครั้ง: {mv}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
      {cards.map(c=><button key={c.id} onClick={()=>flip(c.id)} style={{aspectRatio:"1",borderRadius:10,border:`1.5px solid ${c.m?"#22c55e":"var(--color-border-secondary)"}`,background:c.f||c.m?"#fff0f6":"var(--color-background-secondary)",cursor:c.m||c.f?"default":"pointer",fontSize:26,display:"flex",alignItems:"center",justifyContent:"center"}}>{c.f||c.m?c.e:"❓"}</button>)}
    </div>
  </div>);
}
function MG_TapHeart({onFinish}){
  const [s,setS]=useState(0);const [t,setT]=useState(8);const [h,setH]=useState([]);const [done,setDone]=useState(false);const hid=useRef(0);
  useEffect(()=>{const sp=setInterval(()=>setH(v=>[...v,{id:hid.current++,x:5+Math.random()*80,d:Math.random()*300}]),600);const ti=setInterval(()=>setT(v=>{if(v<=1){clearInterval(sp);clearInterval(ti);setDone(true);return 0;}return v-1;}),1000);return()=>{clearInterval(sp);clearInterval(ti);};},[]);
  useEffect(()=>{if(done)setTimeout(()=>onFinish(s>=8,s>=8?12:0),900);},[done]);
  const tap=id=>{setH(v=>v.filter(x=>x.id!==id));setS(v=>v+1);};
  return(<div style={{maxWidth:360,margin:"20px auto",padding:16}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:700}}>❤️ {s} หัวใจ</span><span style={{color:t<=3?"#ef4444":"inherit",fontWeight:700}}>⏱{t}s</span></div>
    <div style={{position:"relative",height:260,background:"linear-gradient(135deg,#ffe4f0,#ffd6ea)",borderRadius:16,overflow:"hidden"}}>
      {!done&&h.map(v=><button key={v.id} onClick={()=>tap(v.id)} style={{position:"absolute",left:`${v.x}%`,bottom:-10,background:"none",border:"none",fontSize:30,cursor:"pointer",animation:`fup 3s ease-in forwards`,animationDelay:`${v.d}ms`}}>❤️</button>)}
      {done&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column"}}><span style={{fontSize:50}}>{s>=8?"💑":"💔"}</span><p style={{fontWeight:700,margin:"8px 0 0",color:s>=8?"#22c55e":"#ef4444"}}>{s>=8?`ผ่าน! ${s} หัวใจ`:`ได้ ${s}/8`}</p></div>}
    </div>
    <p style={{fontSize:12,color:"var(--color-text-secondary)",textAlign:"center",marginTop:8}}>แตะหัวใจให้ได้ 8 ดวง</p>
    <style>{`@keyframes fup{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-300px);opacity:0}}`}</style>
  </div>);
}
function MG_WordGuess({onFinish}){
  const ws=[["LOVE","ความรัก"],["HEART","หัวใจ"],["KISS","จูบ"],["DATE","เดท"],["CUTE","น่ารัก"]];
  const [[word,meaning]]=useState(()=>ws[Math.floor(Math.random()*ws.length)]);
  const [g,setG]=useState([]);const [w,setW]=useState(0);const [done,setDone]=useState(false);
  const guess=l=>{if(done||g.includes(l))return;const ng=[...g,l];setG(ng);if(!word.includes(l)){const nw=w+1;setW(nw);if(nw>=6){setDone(true);setTimeout(()=>onFinish(false,0),800);}}else{if(word.split("").every(c=>ng.includes(c))){setDone(true);setTimeout(()=>onFinish(true,16),800);}}};
  const hm=["😀","😐","😟","😨","😱","😵","💀"][w];
  return(<div style={{maxWidth:380,margin:"20px auto",padding:16,textAlign:"center"}}>
    <h3 style={{margin:"0 0 4px"}}>💬 ทายคำ</h3><p style={{fontSize:12,color:"var(--color-text-secondary)",margin:"0 0 12px"}}>คำใบ้: {meaning}</p>
    <div style={{fontSize:50,marginBottom:8}}>{hm}</div>
    <p style={{fontSize:22,letterSpacing:8,fontWeight:700,margin:"0 0 16px",color:done&&w>=6?"#ef4444":"var(--color-text-primary)"}}>{word.split("").map(c=>g.includes(c)?c:"_").join(" ")}</p>
    <p style={{fontSize:12,color:"var(--color-text-secondary)",margin:"0 0 10px"}}>ผิดอีกได้: {6-w} ครั้ง</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l=><button key={l} onClick={()=>guess(l)} disabled={g.includes(l)||done} style={{width:30,height:30,borderRadius:6,border:"1px solid var(--color-border-secondary)",background:g.includes(l)?(word.includes(l)?"#22c55e":"#ef4444"):"var(--color-background-secondary)",color:g.includes(l)?"#fff":"var(--color-text-primary)",cursor:g.includes(l)||done?"default":"pointer",fontSize:12,fontWeight:700,fontFamily:"Sarabun,sans-serif"}}>{l}</button>)}
    </div>
  </div>);
}
function MG_Quiz({onFinish}){
  const qs=[{q:"สีที่สื่อถึงความรักคือ?",opts:["🔴 แดง","🔵 น้ำเงิน","🟢 เขียว","🟡 เหลือง"],a:0},{q:"วันวาเลนไทน์ตรงกับวันที่?",opts:["13 ก.พ.","14 ก.พ.","15 ก.พ.","16 ก.พ."],a:1},{q:"ดอกไม้สัญลักษณ์ความรักคือ?",opts:["🌻 ทานตะวัน","🌷 ทิวลิป","🌹 กุหลาบ","🌼 เดซี่"],a:2}];
  const [idx,setIdx]=useState(0);const [sc,setSc]=useState(0);const [ch,setCh]=useState(null);
  const pick=i=>{if(ch!==null)return;setCh(i);const ns=sc+(i===qs[idx].a?1:0);setSc(ns);setTimeout(()=>{if(idx+1>=qs.length)onFinish(ns>=2,ns*6);else{setIdx(idx+1);setCh(null);}},900);};
  const q=qs[idx];
  return(<div style={{maxWidth:400,margin:"20px auto",padding:16}}>
    <h3 style={{margin:"0 0 4px",textAlign:"center"}}>💘 ควิซความรัก</h3>
    <p style={{fontSize:12,color:"var(--color-text-secondary)",textAlign:"center",margin:"0 0 14px"}}>ข้อ {idx+1}/3 | คะแนน: {sc}</p>
    <div style={{background:"var(--color-background-secondary)",borderRadius:14,padding:16,marginBottom:12,textAlign:"center"}}><p style={{fontSize:16,margin:0,fontWeight:500}}>{q.q}</p></div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {q.opts.map((o,i)=>{let bg="var(--color-background-primary)",bc="var(--color-border-secondary)";if(ch!==null){if(i===q.a){bg="#dcfce7";bc="#22c55e";}else if(i===ch&&ch!==q.a){bg="#fee2e2";bc="#ef4444";}}return(<button key={i} onClick={()=>pick(i)} style={{background:bg,border:`1.5px solid ${bc}`,borderRadius:12,padding:"11px 14px",cursor:ch!==null?"default":"pointer",textAlign:"left",fontFamily:"Sarabun,sans-serif",fontSize:14,color:"var(--color-text-primary)"}}>{o}</button>);})}
    </div>
  </div>);
}

// ═══ PROFILE SCREEN ══════════════════════════════════════════════════════════
function ProfileScreen({user,games,setScreen,newGame,editGame,delGame,updateProfile,notifShow,syncAllGames}){
  const myGames=games.filter(g=>g.author===user.username);
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({displayName:user.displayName||user.username,bio:user.bio||"",avatar:user.avatar||null,cover:user.cover||null});
  const avRef=useRef(),cvRef=useRef();
  const hImg=(e,f)=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>setForm(p=>({...p,[f]:ev.target.result}));r.readAsDataURL(file);};
  const save=()=>{if(!form.displayName.trim()){notifShow("ชื่อแสดงห้ามว่าง","err");return;}updateProfile(form);setEditing(false);};
  const totalEarned=user.totalEarned||0;
  const totalReaders=myGames.reduce((s,g)=>s+(g.readerCount||0),0);
  const activeG=myGames.filter(g=>(g.readerCount||0)>=4).length;
  const pendingG=myGames.filter(g=>(g.readerCount||0)<4).length;
  return(
    <div style={{maxWidth:580,margin:"0 auto",paddingBottom:40}}>
      <div style={{position:"relative",height:160,background:form.cover?`url(${form.cover}) center/cover`:"linear-gradient(135deg,#ffd6e7,#ffb3cf)",borderRadius:"0 0 20px 20px",overflow:"hidden"}}>
        {editing&&<><button onClick={()=>cvRef.current.click()} style={{position:"absolute",bottom:10,right:10,background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif"}}>📷 เปลี่ยนปก</button><input ref={cvRef} type="file" accept="image/*" onChange={e=>hImg(e,"cover")} style={{display:"none"}}/></>}
      </div>
      <div style={{padding:"0 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:-36,marginBottom:12}}>
          <div style={{position:"relative"}}>
            <div style={{width:72,height:72,borderRadius:"50%",border:"3px solid var(--color-background-primary)",overflow:"hidden",background:"#fff0f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>
              {form.avatar?<img src={form.avatar} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"👤"}
            </div>
            {editing&&<><button onClick={()=>avRef.current.click()} style={{position:"absolute",bottom:0,right:0,background:"#ff6b9d",border:"none",color:"#fff",borderRadius:"50%",width:22,height:22,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>📷</button><input ref={avRef} type="file" accept="image/*" onChange={e=>hImg(e,"avatar")} style={{display:"none"}}/></>}
          </div>
          <div style={{display:"flex",gap:8}}>
            {!editing?<button onClick={()=>setEditing(true)} style={{...S.pink}}>✏️ แก้ไขโปรไฟล์</button>
              :<><button onClick={()=>setEditing(false)} style={{...S.out(),padding:"6px 14px",borderRadius:20}}>ยกเลิก</button><button onClick={save} style={{...S.pink}}>💾 บันทึก</button></>}
          </div>
        </div>
        {editing?(
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>ชื่อที่แสดง</label><input value={form.displayName} onChange={e=>setForm(p=>({...p,displayName:e.target.value}))} style={{...S.inp}}/></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>คำแนะนำตัว</label><textarea value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} placeholder="บอกเล่าเรื่องตัวเองสักนิด..." rows={2} style={{...S.inp,resize:"vertical"}}/></div>
          </div>
        ):(
          <div style={{marginBottom:14}}>
            <h2 style={{fontSize:20,margin:"0 0 2px"}}>{user.displayName||user.username}</h2>
            <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:"0 0 4px"}}>@{user.username}</p>
            {user.bio&&<p style={{fontSize:14,color:"var(--color-text-secondary)",margin:0}}>{user.bio}</p>}
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:18}}>
          {[{l:"พอยต์คงเหลือ",v:user.points,i:"⭐"},{l:"รายได้ทั้งหมด",v:totalEarned,i:"💰",c:"#22c55e"},{l:"เกมที่สร้าง",v:myGames.length,i:"🎮"}].map(st=>(
            <div key={st.l} style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
              <p style={{margin:0,fontSize:10,color:"var(--color-text-secondary)"}}>{st.i} {st.l}</p>
              <p style={{margin:0,fontSize:20,fontWeight:700,color:st.c||"#ff6b9d"}}>{st.v}</p>
            </div>
          ))}
        </div>
        {myGames.length>0&&(
          <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:16,padding:16,marginBottom:18}}>
            <h3 style={{fontSize:14,margin:"0 0 10px"}}>💰 รายได้</h3>
            <div style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"8px 12px",marginBottom:10,fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.8}}><strong style={{color:"var(--color-text-primary)"}}>สูตร:</strong> ผู้อ่านเสีย 20 พอยต์ → เมื่อ ≥4 คน คุณได้ <strong style={{color:"#22c55e"}}>18 พอยต์/คน (90%)</strong></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[{l:"🟢 รับรายได้",v:activeG+" เกม",c:"#16a34a",bg:"#f0fdf4",bc:"#86efac"},{l:"⏳ รอครบ 4",v:pendingG+" เกม",c:"#ca8a04",bg:"#fefce8",bc:"#fde047"},{l:"👥 ผู้อ่านรวม",v:totalReaders+" คน",c:"#ff6b9d",bg:"#fff0f6",bc:"#ffb3cf"}].map(st=>(
                <div key={st.l} style={{background:st.bg,border:`0.5px solid ${st.bc}`,borderRadius:10,padding:"9px 6px",textAlign:"center"}}><p style={{margin:0,fontSize:10,color:st.c}}>{st.l}</p><p style={{margin:0,fontSize:15,fontWeight:700,color:st.c}}>{st.v}</p></div>
              ))}
            </div>
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{fontSize:15,margin:0}}>🎮 เกมของฉัน</h3>
          <button onClick={newGame} style={{...S.pink}}>+ สร้างใหม่</button>
        </div>
        {myGames.length===0?(
          <div style={{textAlign:"center",padding:32,background:"var(--color-background-secondary)",borderRadius:14}}><p style={{color:"var(--color-text-secondary)",margin:"0 0 12px"}}>ยังไม่มีเกม</p><button onClick={newGame} style={{...S.pink,borderRadius:20,padding:"8px 20px"}}>สร้างเกมแรก 🎉</button></div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {myGames.map(g=>{
              const rc=g.readerCount||0;const ea=g.ownerRevenue||0;const ac=rc>=4;
              const cv=g.cover||{type:"gradient",c1:"#ffd6e7",c2:"#ffb3cf"};
              const cbg=g.bgCustom?{backgroundImage:`url(${g.bgCustom})`,backgroundSize:"cover"}:{background:cv.type==="gradient"?`linear-gradient(135deg,${cv.c1},${cv.c2})`:(cv.solidColor||g.bg.color)};
              return(
                <div key={g.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:14,overflow:"hidden"}}>
                  <div style={{display:"flex",gap:12,padding:"12px 14px",alignItems:"center"}}>
                    <div style={{width:58,height:58,borderRadius:10,flexShrink:0,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",...cbg}}>
                      {!g.bgCustom&&<span style={{fontSize:24,opacity:0.6}}>{g.bg.emoji}</span>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                        <p style={{margin:0,fontWeight:600,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{g.title||"(ไม่มีชื่อ)"}</p>
                        {g.isDraft&&<span style={{fontSize:9,background:"#fef9c3",color:"#ca8a04",border:"0.5px solid #fde047",borderRadius:8,padding:"1px 6px",whiteSpace:"nowrap"}}>📝 Draft</span>}
                        {g.isPrivate&&!g.isDraft&&<span style={{fontSize:9,background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",borderRadius:8,padding:"1px 6px",whiteSpace:"nowrap"}}>🔒 ส่วนตัว</span>}
                      </div>
                      <p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)"}}>{g.scenes.length} ฉาก · {(g.minigames||[]).length} มินิเกม</p>
                      <div style={{display:"flex",gap:6,marginTop:4,alignItems:"center",flexWrap:"wrap"}}>
                        {!g.isDraft&&!g.isPrivate&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:ac?"#f0fdf4":"#fefce8",color:ac?"#16a34a":"#ca8a04",border:`0.5px solid ${ac?"#86efac":"#fde047"}`}}>{ac?`💰 รับรายได้`:`⏳ ${rc}/4 คน`}</span>}
                        {ea>0&&<span style={{fontSize:10,color:"#22c55e",fontWeight:600}}>+{ea} ⭐</span>}
                        {/* Quick privacy toggle */}
                        {!g.isDraft&&<button onClick={()=>{
                          const updated={...g,isPrivate:!g.isPrivate};
                          const all=lsGet(LS_GAMES,games);const idx=all.findIndex(x=>x.id===g.id);
                          if(idx>=0){const n=[...all];n[idx]=updated;syncAllGames(n);}
                        }} style={{fontSize:9,background:"none",border:`0.5px solid ${g.isPrivate?"#7c3aed":"var(--color-border-secondary)"}`,color:g.isPrivate?"#7c3aed":"var(--color-text-tertiary)",borderRadius:8,padding:"1px 7px",cursor:"pointer",fontFamily:"Sarabun,sans-serif"}}>
                          {g.isPrivate?"🔒→🌍 เปลี่ยนเป็นสาธารณะ":"🌍→🔒 เปลี่ยนเป็นส่วนตัว"}
                        </button>}
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      <button onClick={()=>editGame(g)} style={{background:"#ff6b9d",border:"none",color:"#fff",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12,fontFamily:"Sarabun,sans-serif"}}>✏️ แก้ไข</button>
                      <button onClick={()=>delGame(g.id,user)} style={{...S.out(true),borderRadius:8,padding:"4px 10px",fontSize:12}}>🗑️ ลบ</button>
                    </div>
                  </div>
                  <div style={{height:4,background:"var(--color-border-tertiary)"}}><div style={{height:"100%",width:`${Math.min(100,(rc/4)*100)}%`,background:ac?"#22c55e":"#fbbf24",transition:"width 0.3s"}}/></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ TOPUP SCREEN ════════════════════════════════════════════════════════════
function TopupScreen({user,setScreen,submitTopup,notifShow}){
  const [tab,setTab]=useState("points"); // "points" | "member"
  const [selPkg,setSelPkg]=useState(null);
  const [slip,setSlip]=useState(null);
  const [slipB64,setSlipB64]=useState(null);
  const [step,setStep]=useState(1); // 1=เลือก 2=โอน 3=แนบสลิป
  const [copied,setCopied]=useState(null);
  const slipRef=useRef();

  const copy=(txt,key)=>{navigator.clipboard?.writeText(txt).catch(()=>{});setCopied(key);setTimeout(()=>setCopied(null),2000);};

  const hSlip=e=>{
    const f=e.target.files[0];if(!f)return;
    setSlip(f);
    const r=new FileReader();r.onload=ev=>setSlipB64(ev.target.result);r.readAsDataURL(f);
  };

  const doSubmit=()=>{
    if(!user){notifShow("กรุณาล็อกอินก่อน","err");setScreen("auth");return;}
    if(!slipB64){notifShow("กรุณาแนบสลิปก่อน","err");return;}
    if(tab==="points"&&!selPkg){notifShow("กรุณาเลือกแพ็กเกจ","err");return;}
    submitTopup(tab==="member"?null:selPkg, slipB64, tab==="member");
    setSlip(null);setSlipB64(null);setSelPkg(null);setStep(1);
  };

  const curPkg = tab==="member" ? {baht:MEMBER_PLAN.baht, points:MEMBER_PLAN.bonusFirst, label:"VIP สมาชิก"} : selPkg;
  const totalPts = tab==="member" ? MEMBER_PLAN.bonusFirst : (selPkg?(selPkg.points+(selPkg.bonus||0)):0);

  return(
    <div style={{maxWidth:500,margin:"0 auto",padding:16,paddingBottom:40}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
        <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"var(--color-text-secondary)"}}>←</button>
        <h2 style={{margin:0,fontSize:20}}>💎 เติมพอยต์</h2>
        {user&&<span style={{marginLeft:"auto",background:"var(--color-background-secondary)",borderRadius:20,padding:"4px 12px",fontSize:13}}>⭐ {user?.points||0} พอยต์</span>}
      </div>

      {!user&&(
        <div style={{textAlign:"center",padding:32,background:"var(--color-background-secondary)",borderRadius:16,marginBottom:16}}>
          <p style={{fontSize:15,margin:"0 0 14px"}}>กรุณาล็อกอินก่อนเติมพอยต์</p>
          <button onClick={()=>setScreen("auth")} style={{...S.pink,borderRadius:12,padding:"10px 24px",fontSize:15}}>เข้าสู่ระบบ</button>
        </div>
      )}

      {user&&<>
        {/* Tab */}
        <div style={{display:"flex",gap:0,marginBottom:20,background:"var(--color-background-secondary)",borderRadius:12,padding:4}}>
          {[{id:"points",l:"⭐ เติมพอยต์"},{id:"member",l:"💎 สมาชิก VIP"}].map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setStep(1);setSelPkg(null);}} style={{flex:1,padding:"9px 8px",borderRadius:10,border:"none",background:tab===t.id?"var(--color-background-primary)":"none",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?"#ff6b9d":"var(--color-text-secondary)",boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>{t.l}</button>
          ))}
        </div>

        {/* Step indicator */}
        <div style={{display:"flex",gap:4,marginBottom:18}}>
          {["เลือกแพ็กเกจ","โอนเงิน","แนบสลิป"].map((s,i)=>(
            <div key={i} style={{flex:1,height:4,borderRadius:2,background:i+1<=step?"#ff6b9d":"var(--color-border-tertiary)"}}/>
          ))}
        </div>

        {/* STEP 1: เลือกแพ็กเกจ */}
        {step===1&&tab==="points"&&(
          <div>
            <p style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:14}}>เลือกจำนวนพอยต์ที่ต้องการเติม</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {TOPUP_PACKAGES.map((pkg,i)=>{
                const isSel=selPkg?.baht===pkg.baht;
                const popular=i===2;
                return(
                  <button key={pkg.baht} onClick={()=>setSelPkg(pkg)} style={{background:isSel?"#fff0f6":"var(--color-background-primary)",border:`${isSel?"2px solid #ff6b9d":"0.5px solid var(--color-border-secondary)"}`,borderRadius:14,padding:"12px 10px",cursor:"pointer",textAlign:"left",position:"relative",fontFamily:"Sarabun,sans-serif"}}>
                    {popular&&<div style={{position:"absolute",top:-8,right:10,background:"#ff6b9d",color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:20}}>ยอดนิยม</div>}
                    <p style={{margin:"0 0 3px",fontSize:18,fontWeight:700,color:"#ff6b9d"}}>{pkg.baht} บาท</p>
                    <p style={{margin:"0 0 2px",fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>⭐ {pkg.points.toLocaleString()} พอยต์</p>
                    {pkg.bonus>0&&<p style={{margin:0,fontSize:11,color:"#22c55e"}}>+โบนัส {pkg.bonus.toLocaleString()} พอยต์</p>}
                    <p style={{margin:"4px 0 0",fontSize:11,color:"var(--color-text-tertiary)"}}>รวม {(pkg.points+pkg.bonus).toLocaleString()} พอยต์</p>
                  </button>
                );
              })}
            </div>
            <button onClick={()=>{if(!selPkg){notifShow("กรุณาเลือกแพ็กเกจก่อน","err");return;}setStep(2);}} style={{...S.pink,width:"100%",padding:13,fontSize:15,fontWeight:700,borderRadius:12}}>ถัดไป → เลือกช่องทางโอน</button>
          </div>
        )}

        {step===1&&tab==="member"&&(
          <div>
            {/* Member benefits */}
            <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:18,padding:22,marginBottom:16,color:"#fff",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:8}}>💎</div>
              <h3 style={{margin:"0 0 6px",fontSize:20}}>สมาชิก VIP รายเดือน</h3>
              <p style={{margin:"0 0 16px",fontSize:14,opacity:0.9}}>100 บาท / เดือน</p>
              <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"14px 16px",textAlign:"left"}}>
                {[`🎁 รับทันที ${MEMBER_PLAN.bonusFirst} พอยต์ (ครั้งแรก)`,`📅 +${MEMBER_PLAN.dailyPoints} พอยต์ทุกวัน`,`💎 ป้าย VIP บนโปรไฟล์`,`🆓 อ่านเกมเจ้าของผลงานฟรี`].map(b=>(
                  <p key={b} style={{margin:"0 0 8px",fontSize:13}}>{b}</p>
                ))}
              </div>
            </div>
            {user.isMember&&(
              <div style={{background:"#f0fdf4",border:"0.5px solid #86efac",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#16a34a"}}>
                ✅ คุณเป็นสมาชิก VIP อยู่แล้ว! (+{MEMBER_PLAN.dailyPoints} พอยต์วันนี้ถ้ายังไม่ได้รับ)
              </div>
            )}
            <button onClick={()=>setStep(2)} style={{...S.pink,width:"100%",padding:13,fontSize:15,fontWeight:700,borderRadius:12,background:"linear-gradient(135deg,#667eea,#764ba2)",border:"none"}}>สมัครสมาชิก 100 บาท/เดือน</button>
          </div>
        )}

        {/* STEP 2: โอนเงิน */}
        {step===2&&(
          <div>
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"8px 14px",marginBottom:14,fontSize:13}}>
              {tab==="points"&&selPkg&&<span>📦 {selPkg.baht} บาท = <strong style={{color:"#ff6b9d"}}>{(selPkg.points+selPkg.bonus).toLocaleString()} พอยต์</strong></span>}
              {tab==="member"&&<span>💎 สมัครสมาชิก VIP = <strong style={{color:"#667eea"}}>100 บาท</strong></span>}
            </div>
            <p style={{fontSize:14,fontWeight:600,marginBottom:12}}>เลือกช่องทางโอนเงิน</p>

            {/* Bank */}
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:40,height:40,borderRadius:10,background:"#1a6b3a",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,flexShrink:0}}>🏦</div>
                <div><p style={{margin:0,fontWeight:700,fontSize:14}}>ธนาคารกสิกรไทย</p><p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>KBank</p></div>
              </div>
              <div style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)"}}>เลขบัญชี</p>
                  <p style={{margin:0,fontSize:18,fontWeight:700,letterSpacing:2,color:"var(--color-text-primary)"}}>{BANK_KBANK}</p>
                </div>
                <button onClick={()=>copy(BANK_KBANK.replace(/-/g,""),"bank")} style={{...S.pink,fontSize:12,padding:"6px 12px"}}>{copied==="bank"?"✅ คัดลอก":"📋 คัดลอก"}</button>
              </div>
            </div>

            {/* TrueMoney Wallet */}
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:14,padding:"14px 16px",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:40,height:40,borderRadius:10,background:"#ff6600",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,flexShrink:0}}>💳</div>
                <div><p style={{margin:0,fontWeight:700,fontSize:14}}>TrueMoney Wallet</p><p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>ทรูมันนี่วอเล็ท</p></div>
              </div>
              <div style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)"}}>เบอร์วอเล็ท</p>
                  <p style={{margin:0,fontSize:18,fontWeight:700,letterSpacing:2,color:"var(--color-text-primary)"}}>{WALLET_NUM}</p>
                </div>
                <button onClick={()=>copy("0813271371","wallet")} style={{...S.pink,fontSize:12,padding:"6px 12px"}}>{copied==="wallet"?"✅ คัดลอก":"📋 คัดลอก"}</button>
              </div>
            </div>

            <div style={{background:"#fffbeb",border:"0.5px solid #fde047",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#92400e"}}>
              ⚠️ โอนแล้วกด "ถัดไป" เพื่อแนบสลิป — ของจะเข้าหลังแอดมินตรวจสอบ (5-15 นาที)
            </div>

            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStep(1)} style={{flex:1,...S.out(),padding:12,borderRadius:12}}>← ย้อนกลับ</button>
              <button onClick={()=>setStep(3)} style={{flex:2,...S.pink,padding:12,fontSize:15,fontWeight:700,borderRadius:12}}>โอนแล้ว แนบสลิป →</button>
            </div>
          </div>
        )}

        {/* STEP 3: แนบสลิป */}
        {step===3&&(
          <div>
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:13}}>
              {tab==="points"&&selPkg&&<span>📦 {selPkg.baht} บาท → <strong style={{color:"#ff6b9d"}}>{(selPkg.points+selPkg.bonus).toLocaleString()} พอยต์</strong></span>}
              {tab==="member"&&<span>💎 สมาชิก VIP 100 บาท → <strong style={{color:"#667eea"}}>{MEMBER_PLAN.bonusFirst} พอยต์ + {MEMBER_PLAN.dailyPoints}/วัน</strong></span>}
            </div>
            <div style={{border:"2px dashed var(--color-border-secondary)",borderRadius:14,padding:20,textAlign:"center",marginBottom:16,cursor:"pointer",background:"var(--color-background-secondary)"}} onClick={()=>slipRef.current.click()}>
              {slipB64
                ?<img src={slipB64} style={{maxWidth:"100%",maxHeight:240,borderRadius:10,objectFit:"contain"}}/>
                :<div><div style={{fontSize:40,marginBottom:8}}>📎</div><p style={{fontSize:14,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>แตะเพื่ออัปโหลดสลิป</p><p style={{fontSize:12,color:"var(--color-text-tertiary)",margin:0}}>รองรับ JPG, PNG, รูปจากมือถือ</p></div>
              }
            </div>
            <input ref={slipRef} type="file" accept="image/*" onChange={hSlip} style={{display:"none"}}/>
            {slipB64&&<button onClick={()=>{setSlip(null);setSlipB64(null);}} style={{...S.out(true),width:"100%",marginBottom:12,borderRadius:12,padding:8}}>🗑️ เปลี่ยนสลิป</button>}
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStep(2)} style={{flex:1,...S.out(),padding:12,borderRadius:12}}>← ย้อนกลับ</button>
              <button onClick={doSubmit} disabled={!slipB64} style={{flex:2,...S.pink,padding:12,fontSize:15,fontWeight:700,borderRadius:12,opacity:slipB64?1:0.5}}>📨 ส่งหลักฐาน</button>
            </div>
          </div>
        )}
      </>}
    </div>
  );
}

// ═══ ADMIN SCREEN ════════════════════════════════════════════════════════════
function AdminScreen({allUsers,requests,approveTopup,rejectTopup,adminGivePoints,setScreen,notifShow}){
  const [tab,setTab]=useState("requests");
  const [giveUser,setGiveUser]=useState("");
  const [givePts,setGivePts]=useState("");
  const [giveNote,setGiveNote]=useState("");
  const [giveVip,setGiveVip]=useState(false);
  const [refresh,setRefresh]=useState(0);

  const allReqs=lsGet(LS_TOPUP_REQUESTS,[]);
  const pending=allReqs.filter(r=>r.status==="pending");
  const done=allReqs.filter(r=>r.status!=="pending").slice(0,30);

  const doApprove=(req)=>{ approveTopup(req); setRefresh(r=>r+1); };
  const doReject=(req)=>{  rejectTopup(req);  setRefresh(r=>r+1); };

  const doGive=()=>{
    const pts=parseInt(givePts);
    if(!giveUser.trim()||!pts||pts<=0){notifShow("กรอกข้อมูลให้ครบ","err");return;}
    adminGivePoints(giveUser.trim(), pts, giveNote||"Admin gift", giveVip);
    setGiveUser("");setGivePts("");setGiveNote("");setGiveVip(false);
  };

  const fmt=ts=>ts?new Date(ts).toLocaleString("th-TH",{timeZone:"Asia/Bangkok",hour12:false,month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"";

  return(
    <div style={{maxWidth:600,margin:"0 auto",padding:16,paddingBottom:40}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"var(--color-text-secondary)"}}>←</button>
        <h2 style={{margin:0,fontSize:20}}>🛡️ Admin Panel</h2>
        <span style={{marginLeft:"auto",background:"#fff0f6",color:"#ff6b9d",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:600}}>fanas</span>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
        {[
          {l:"รอตรวจ",v:pending.length,c:"#ca8a04",bg:"#fefce8"},
          {l:"ดำเนินการแล้ว",v:done.length,c:"#16a34a",bg:"#f0fdf4"},
          {l:"ผู้ใช้ทั้งหมด",v:Object.keys(allUsers).length,c:"#7c3aed",bg:"#f5f3ff"}
        ].map(s=>(
          <div key={s.l} style={{background:s.bg,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
            <p style={{margin:0,fontSize:11,color:s.c}}>{s.l}</p>
            <p style={{margin:0,fontSize:22,fontWeight:700,color:s.c}}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:16,background:"var(--color-background-secondary)",borderRadius:12,padding:4}}>
        {[{id:"requests",l:`📋 รอตรวจ (${pending.length})`},{id:"done",l:"✅ ประวัติ"},{id:"users",l:"👥 ผู้ใช้"},{id:"give",l:"🎁 ให้"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"7px 4px",borderRadius:10,border:"none",background:tab===t.id?"var(--color-background-primary)":"none",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:11,fontWeight:tab===t.id?700:400,color:tab===t.id?"#ff6b9d":"var(--color-text-secondary)"}}>{t.l}</button>
        ))}
      </div>

      {/* Pending requests */}
      {tab==="requests"&&(
        <div>
          {pending.length===0&&<div style={{textAlign:"center",padding:32,color:"var(--color-text-secondary)",background:"var(--color-background-secondary)",borderRadius:14}}>✅ ไม่มีรายการรอดำเนินการ</div>}
          {pending.map(req=>(
            <div key={req.id} style={{background:"var(--color-background-primary)",border:"1px solid #fde047",borderRadius:14,padding:14,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <p style={{margin:"0 0 2px",fontWeight:700,fontSize:15}}>👤 {req.username}</p>
                  <p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)"}}>{fmt(req.ts)}</p>
                </div>
                <div style={{textAlign:"right"}}>
                  {req.isMember
                    ?<><p style={{margin:0,fontSize:14,fontWeight:700,color:"#7c3aed"}}>💎 VIP สมาชิก</p><p style={{margin:0,fontSize:12,color:"#7c3aed"}}>100 บาท → +{MEMBER_PLAN.bonusFirst} pts</p></>
                    :<><p style={{margin:0,fontSize:14,fontWeight:700,color:"#ff6b9d"}}>{req.pkg?.baht} บาท</p><p style={{margin:0,fontSize:12,color:"#22c55e"}}>+{(req.pkg?.points||0)+(req.pkg?.bonus||0)} พอยต์</p></>
                  }
                </div>
              </div>
              {req.slipImg&&(
                <div style={{marginBottom:12}}>
                  <p style={{fontSize:11,color:"var(--color-text-secondary)",margin:"0 0 6px"}}>สลิปการโอน:</p>
                  <img src={req.slipImg} style={{width:"100%",maxHeight:220,objectFit:"contain",borderRadius:10,background:"var(--color-background-secondary)"}}/>
                </div>
              )}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>doApprove(req)} style={{flex:1,background:"#22c55e",border:"none",color:"#fff",borderRadius:10,padding:"11px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:14,fontWeight:700}}>✅ อนุมัติ</button>
                <button onClick={()=>doReject(req)} style={{flex:1,...S.out(true),borderRadius:10,padding:"10px",fontSize:14}}>❌ ปฏิเสธ</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {tab==="done"&&(
        <div>
          {done.length===0&&<div style={{textAlign:"center",padding:32,color:"var(--color-text-secondary)"}}>ยังไม่มีประวัติ</div>}
          {done.map(req=>(
            <div key={req.id} style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"9px 12px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <p style={{margin:0,fontSize:13,fontWeight:500}}>👤 {req.username}</p>
                <p style={{margin:0,fontSize:11,color:"var(--color-text-tertiary)"}}>{fmt(req.ts)}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <span style={{fontSize:12,fontWeight:600,color:req.status==="completed"?"#22c55e":"#ef4444"}}>
                  {req.status==="completed"?"✅":"❌"} {req.isMember?"VIP":req.isManual?`+${req.pts} gift`:`+${(req.pkg?.points||0)+(req.pkg?.bonus||0)} pts`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab==="users"&&(
        <div>
          {Object.values(allUsers).sort((a,b)=>(b.points||0)-(a.points||0)).map(u=>(
            <div key={u.username} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:12,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <p style={{margin:"0 0 1px",fontWeight:600,fontSize:14}}>{u.displayName||u.username} {u.isMember&&<span style={{fontSize:11,background:"#7c3aed",color:"#fff",borderRadius:10,padding:"1px 7px"}}>💎VIP</span>}</p>
                <p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)"}}>@{u.username} {u.email?`· ${u.email}`:""}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{margin:0,fontSize:15,fontWeight:700,color:"#ff6b9d"}}>⭐ {u.points||0}</p>
                <p style={{margin:0,fontSize:10,color:"var(--color-text-tertiary)"}}>รายได้ {u.totalEarned||0} pts</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Give points */}
      {tab==="give"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>🎁 ให้พอยต์หรือ gift VIP แก่ผู้ใช้ฟรี</p>
          <div>
            <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:5}}>ชื่อผู้ใช้ (username)</label>
            <input value={giveUser} onChange={e=>setGiveUser(e.target.value)} placeholder="username" style={{...S.inp}}/>
          </div>
          <div>
            <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:5}}>จำนวนพอยต์</label>
            <input type="number" min="0" value={givePts} onChange={e=>setGivePts(e.target.value)} placeholder="เช่น 200" style={{...S.inp}}/>
          </div>
          <div>
            <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:5}}>หมายเหตุ</label>
            <input value={giveNote} onChange={e=>setGiveNote(e.target.value)} placeholder="Admin gift / ทดสอบ / อื่นๆ" style={{...S.inp}}/>
          </div>
          {/* VIP toggle */}
          <button onClick={()=>setGiveVip(v=>!v)} style={{background:giveVip?"#7c3aed":"none",border:`1.5px solid #7c3aed`,color:giveVip?"#fff":"#7c3aed",borderRadius:12,padding:"10px",cursor:"pointer",fontFamily:"Sarabun,sans-serif",fontSize:14,fontWeight:600}}>
            {giveVip?"💎 จะ Gift VIP ด้วย":"💎 Gift VIP สมาชิกให้ด้วย (กดเปิด)"}
          </button>
          <button onClick={doGive} style={{...S.pink,padding:12,fontSize:15,fontWeight:700,borderRadius:12}}>🎁 ให้พอยต์{giveVip?" + VIP":""}</button>
          <div style={{background:"var(--color-background-secondary)",borderRadius:10,padding:10}}>
            <p style={{fontSize:12,color:"var(--color-text-secondary)",margin:"0 0 8px"}}>พอยต์ด่วน:</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {[100,200,500,1000,MEMBER_PLAN.bonusFirst].map(pts=>(
                <button key={pts} onClick={()=>setGivePts(String(pts))} style={{...S.out(),borderRadius:20,padding:"5px 12px",fontSize:12,background:givePts==String(pts)?"#fff0f6":"none"}}>{pts} pts</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
