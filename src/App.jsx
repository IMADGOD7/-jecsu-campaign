import { useState, useEffect, useRef, useCallback } from "react";

const G = (a) => `rgba(196,155,80,${a})`;
const ease = "cubic-bezier(0.16,1,0.3,1)";

const candidates = [
  { id:1,  name:"Anupam Saikia",          position:"Debating & Symposium Secretary-1", hostel:"H4", tag:"DEBATING & SYMPOSIUM-1",         semester:"4th Semester", dept:"Electrical Engineering",         message:"Choose Leadership That Listens",              alt:false },
  { id:2,  name:"Pranay Konwar",          position:"General Sports Secretary-1",       hostel:"H4", tag:"GENERAL SPORTS SECRETARY-1",     semester:"6th Semester", dept:"Electrical Engineering",         message:"Better facilities, Brighter sporting future", alt:true  },
  { id:3,  name:"Bibhuti Bhushan Tamuli", position:"General Secretary",              hostel:"H7", tag:"GENERAL SECRETARY",            semester:"6th Semester", dept:"Mechanical Engineering",         message:"Together we rise, Together we lead",          alt:false },
  { id:4,  name:"Darsan Protim Baruah",   position:"Assistant General Secretary-1",    hostel:"H5", tag:"ASSISTANT GENERAL SECRETARY-1",  semester:"6th Semester", dept:"Electrical Engineering",         message:"Dedicated to Serve, Ready to Lead.",          alt:true  },
  { id:5,  name:"Jitumoni Chekanidhara",  position:"Cultural Secretary-1",             hostel:"H3", tag:"CULTURAL SECRETARY-1",           semester:"6th Semester", dept:"Computer Science & Engineering", message:"Rise together, Lead through culture",         alt:false },
  { id:6,  name:"Shobhitya Raj Borah",    position:"Technical & Hobby Centre Sec-1",  hostel:"H5", tag:"TECHNICAL & HOBBY CENTRE-1",     semester:"6th Semester", dept:"Mechanical Engineering",         message:"Build. Innovate. Lead",                       alt:true  },
  { id:7,  name:"Debanga Raj Saikia",     position:"Major Games Secretary-1",          hostel:"H8", tag:"MAJOR GAMES SECRETARY-1",        semester:"6th Semester", dept:"Mechanical Engineering",         message:"More opportunities, Better tournaments",      alt:false },
  { id:8,  name:"Goonjan Deori",          position:"Minor Games Secretary-1",          hostel:"H3", tag:"MINOR GAMES SECRETARY-1",        semester:"6th Semester", dept:"Mechanical Engineering",         message:"Lead with Spirit, Win with Unity",            alt:true  },
  { id:9,  name:"Debanga Raj Munda",      position:"Gymnasium Secretary-1",            hostel:"H8", tag:"GYMNASIUM SECRETARY-1",          semester:"6th Semester", dept:"Mechanical Engineering",         message:"For every student, For every Athlete",        alt:false },
  { id:10, name:"Aghya Bhuyan",           position:"Social Service & Welfare Sec-1",  hostel:"H9", tag:"SOCIAL SERVICE & WELFARE-1",     semester:"4th Semester", dept:"Civil Engineering",              message:"Lead with care, Serve with purpose",          alt:true  },
  { id:11, name:"Pritismita Devi",        position:"Literary & Magazine Secretary-1",  hostel:"H9", tag:"LITERARY & MAGAZINE-1",          semester:"4th Semester", dept:"Civil Engineering",              message:"শৈৰ্যশীলৰ পৰা বহুমুখীত্বলৈ, JEC ক'লে যায় সাহিত্যৰ অসমীয় বিন্দুলৈ", alt:false },
  { id:12, name:"Shruti Deka",            position:"Girls' Common Room Secretary-1",   hostel:"H9", tag:"GIRLS COMMON ROOM-1",            semester:"6th Semester", dept:"Civil Engineering",              message:"A welcoming space to be felt safe, comfortable and valued", alt:true },
  { id:13, name:"Gunjan Gogoi",           position:"Boys' Common Room Secretary-1",    hostel:"H7", tag:"BOYS COMMON ROOM-1",             semester:"6th Semester", dept:"Computer Science & Engineering", message:"For every student, everyday",                 alt:false },
];

const FILTERS = ["ALL","H3","H4","H5","H7","H8","H9"];

/* ── HOOKS ── */
function useScrollY() {
  const [y,setY]=useState(0);
  useEffect(()=>{
    const h=()=>setY(window.scrollY);
    window.addEventListener("scroll",h,{passive:true});
    return()=>window.removeEventListener("scroll",h);
  },[]);
  return y;
}

function useInView(thresh=0.1) {
  const ref=useRef(null);
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:thresh});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return [ref,vis];
}

function useMounted() {
  const [m,setM]=useState(false);
  useEffect(()=>setM(true),[]);
  return m;
}

function AnimIn({children,delay=0,y=20,style={}}) {
  const m=useMounted();
  return <div style={{opacity:m?1:0,transform:m?"translateY(0)":`translateY(${y}px)`,transition:`opacity 1.1s ${ease} ${delay}s,transform 1.1s ${ease} ${delay}s`,...style}}>{children}</div>;
}

/* ── GOLD BUTTON ── */
function GoldButton({children,onClick,small=false}) {
  const [h,setH]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{fontFamily:"Inter,sans-serif",fontSize:small?"11px":"12px",letterSpacing:"0.2em",textTransform:"uppercase",color:h?"#fff":"rgba(255,255,255,0.8)",background:h?G(0.07):"transparent",border:`1px solid ${h?G(0.75):G(0.3)}`,padding:small?"11px 26px":"14px 40px",borderRadius:"2px",cursor:"pointer",transition:"all 0.3s ease",display:"inline-flex",alignItems:"center",gap:"10px"}}
    >
      {children}
      <span style={{fontSize:"14px",opacity:0.55,transform:h?"translateX(3px)":"translateX(0)",transition:"transform 0.3s ease"}}>→</span>
    </button>
  );
}

/* ── NAVBAR ── */
function Navbar({scrollY,heroRef,candidatesRef}) {
  const scrolled=scrollY>40;
  const scrollTo=(ref)=>{ref?.current?.scrollIntoView({behavior:"smooth",block:"start"});};
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"0 clamp(1rem,4vw,2rem)",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(8,8,10,0.92)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"0.5px solid rgba(255,255,255,0.05)":"none",transition:"all 0.5s ease"}}>
      <button onClick={()=>scrollTo(heroRef)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:"15px",letterSpacing:"0.18em",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",padding:0}}>JECSU</button>
      <div style={{display:"flex",gap:"clamp(1.2rem,4vw,2.5rem)"}}>
        {[["Home",heroRef],["Candidates",candidatesRef]].map(([label,ref])=>(
          <button key={label} onClick={()=>scrollTo(ref)}
            style={{fontFamily:"Inter,sans-serif",fontSize:"13px",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",background:"none",border:"none",cursor:"pointer",padding:0,transition:"color 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.color="#fff"}
            onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}
          >{label}</button>
        ))}
      </div>
    </nav>
  );
}

/* ── HERO BACKGROUND ── */
function GridBg() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#07070a 0%,#0c0b0f 40%,#0a080d 100%)"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.028) 1px,transparent 1px)",backgroundSize:"72px 72px"}}/>
      <div style={{position:"absolute",top:"-10%",left:"50%",transform:"translateX(-50%)",width:"800px",height:"500px",background:`radial-gradient(ellipse,${G(0.07)} 0%,transparent 70%)`}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 90% 80% at 50% 50%,transparent 40%,rgba(0,0,0,0.55) 100%)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"200px",background:"linear-gradient(transparent,#08080b)"}}/>
    </div>
  );
}

function CollegeLogo() {
  return (
    <div style={{width:"72px",height:"72px",borderRadius:"50%",border:`1px solid ${G(0.3)}`,display:"flex",alignItems:"center",justifyContent:"center",background:G(0.06),marginBottom:"2rem"}}>
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <path d="M19 4L34 13V25L19 34L4 25V13L19 4Z" stroke={G(0.7)} strokeWidth="1" fill="none"/>
        <path d="M19 10L28 16V22L19 28L10 22V16L19 10Z" stroke={G(0.4)} strokeWidth="0.75" fill={G(0.05)}/>
        <circle cx="19" cy="19" r="3" fill={G(0.6)}/>
      </svg>
    </div>
  );
}

/* ── HERO ── */
function HeroSection({heroRef,candidatesRef}) {
  const hostels=["H3","H4","H5","H7","H8","H9"];
  const scrollToCandidates=()=>candidatesRef?.current?.scrollIntoView({behavior:"smooth",block:"start"});
  return (
    <section ref={heroRef} style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <GridBg/>
      <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"100px clamp(1rem,5vw,2rem) 80px",maxWidth:"900px",margin:"0 auto",width:"100%"}}>
        <AnimIn delay={0.1} y={12}><CollegeLogo/></AnimIn>
        <AnimIn delay={0.35} y={0} style={{overflow:"hidden"}}>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(60px,14vw,148px)",fontWeight:"400",letterSpacing:"0.18em",lineHeight:"1",color:"#fff",margin:"0 0 0.1em",textTransform:"uppercase"}}>JECSU</h1>
        </AnimIn>
        <AnimIn delay={0.55} y={14}>
          <div style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(20px,5vw,42px)",fontWeight:"300",letterSpacing:"0.55em",color:G(0.85),marginBottom:"2.8rem"}}>2026</div>
        </AnimIn>
        <AnimIn delay={0.7}>
          <div style={{width:"40px",height:"1px",background:`linear-gradient(90deg,transparent,${G(0.5)},transparent)`,marginBottom:"2.2rem"}}/>
        </AnimIn>
        <AnimIn delay={0.82} y={10}>
          <div style={{display:"flex",gap:"clamp(8px,2.5vw,22px)",flexWrap:"wrap",justifyContent:"center",marginBottom:"0.85rem"}}>
            {hostels.map((h,i)=>(
              <span key={h} style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(10px,1.8vw,13px)",letterSpacing:"0.22em",color:i%2===0?"rgba(255,255,255,0.55)":G(0.6),textTransform:"uppercase"}}>{h}</span>
            ))}
          </div>
        </AnimIn>
        <AnimIn delay={0.95} y={8}>
          <div style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(9px,1.6vw,12px)",letterSpacing:"0.38em",color:"rgba(255,255,255,0.22)",textTransform:"uppercase",marginBottom:"3.5rem"}}>HOSTEL LOBBY</div>
        </AnimIn>
        <AnimIn delay={1.12} y={10}>
          <GoldButton onClick={scrollToCandidates}>Meet The Candidates</GoldButton>
        </AnimIn>
        <AnimIn delay={1.5}>
          <div style={{marginTop:"5rem"}}>
            <div style={{width:"1px",height:"40px",background:`linear-gradient(${G(0.5)},transparent)`,margin:"0 auto"}}/>
          </div>
        </AnimIn>
      </div>
    </section>
  );
}

/* ── PORTRAIT ── */
function Portrait({c, objPos="center 20%"}) {
  const initials=c.name.split(" ").map(w=>w[0]).join("").slice(0,3);
  const [imgLoaded,setImgLoaded]=useState(false);
  const [imgError,setImgError]=useState(false);
  return (
    <div style={{position:"relative",width:"100%",height:"100%",background:"#000",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"inherit"}}>
      {!imgError && (
        <img src={`/id${c.id}.jpeg`} alt={c.name} onLoad={()=>setImgLoaded(true)} onError={()=>setImgError(true)} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:objPos,opacity:imgLoaded?1:0,transition:"opacity 0.6s ease"}}/>
      )}
      {!imgLoaded && (
        <div style={{position:"absolute",fontFamily:"Georgia,serif",fontSize:"clamp(100px,18vw,220px)",fontWeight:"400",color:"rgba(255,255,255,0.022)",letterSpacing:"-0.04em",userSelect:"none",lineHeight:"1",top:"50%",left:"50%",transform:"translate(-50%,-50%)",whiteSpace:"nowrap"}}>{initials}</div>
      )}
      {[0,1,2,3].map(i=>(
        <div key={i} style={{position:"absolute",...(i===0?{top:"16px",left:"16px",borderTop:`1px solid ${G(0.25)}`,borderLeft:`1px solid ${G(0.25)}`}:i===1?{top:"16px",right:"16px",borderTop:`1px solid ${G(0.25)}`,borderRight:`1px solid ${G(0.25)}`}:i===2?{bottom:"16px",left:"16px",borderBottom:`1px solid ${G(0.25)}`,borderLeft:`1px solid ${G(0.25)}`}:{bottom:"16px",right:"16px",borderBottom:`1px solid ${G(0.25)}`,borderRight:`1px solid ${G(0.25)}`}),width:"22px",height:"22px"}}/>
      ))}
    </div>
  );
}

/* ── CANDIDATE PANEL ── */
function CandidatePanel({c,index}) {
  const [ref,vis]=useInView(0.06);
  const [hov,setHov]=useState(false);
  const [open,setOpen]=useState(false);
  const isAlt=index%2!==0;

  return (
    <>
      <div ref={ref}
        style={{position:"relative",minHeight:"clamp(420px,65vh,600px)",display:"flex",flexDirection:"column",...(window.innerWidth>=640?{flexDirection:isAlt?"row-reverse":"row"}:{}),overflow:"hidden",borderTop:"0.5px solid rgba(255,255,255,0.045)",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(30px)",transition:`opacity 0.9s ${ease},transform 0.9s ${ease}`}}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      >
        {/* Portrait */}
        <div style={{flex:"0 0 45%",minHeight:"clamp(260px,40vw,600px)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,transform:hov?"scale(1.04)":"scale(1)",transition:`transform 1.4s ${ease}`}}>
            <Portrait c={c}/>
          </div>
          {/* Hostel badge — larger, brighter */}
          <div style={{position:"absolute",top:"24px",left:"22px",zIndex:6,fontFamily:"Inter,sans-serif",fontSize:"12px",fontWeight:"600",letterSpacing:"0.22em",color:"rgba(255,255,255,0.9)",textTransform:"uppercase",border:`0.5px solid ${G(0.45)}`,padding:"6px 14px",background:"rgba(8,8,11,0.75)",backdropFilter:"blur(8px)"}}>{c.hostel}</div>
          <div style={{position:"absolute",bottom:"24px",right:"22px",zIndex:6,fontFamily:"Georgia,serif",fontSize:"clamp(32px,5vw,60px)",color:"rgba(255,255,255,0.04)",fontWeight:"400",lineHeight:"1",userSelect:"none"}}>0{index+1}</div>
        </div>

        {/* Content */}
        <div style={{flex:"1",position:"relative",overflow:"hidden",background:"#08080b",display:"flex",alignItems:"center"}}>
          <div style={{position:"absolute",top:"50%",left:"-2%",transform:"translateY(-50%)",fontFamily:"Georgia,serif",fontSize:"clamp(44px,7vw,100px)",fontWeight:"400",color:"rgba(255,255,255,0.025)",textTransform:"uppercase",letterSpacing:"0.05em",lineHeight:"1.05",whiteSpace:"nowrap",userSelect:"none",pointerEvents:"none"}}>
            {c.tag.split(" ").map((w,i)=><div key={i}>{w}</div>)}
          </div>
          <div style={{position:"absolute",top:"15%",bottom:"15%",left:"0",width:"1px",background:`linear-gradient(transparent,${G(0.15)},transparent)`}}/>
          <div style={{position:"relative",zIndex:2,padding:"clamp(28px,5vw,72px) clamp(24px,5vw,64px)",maxWidth:"480px",width:"100%"}}>

            {/* POSITION — was G(0.55), now G(0.85) + bigger font + bold */}
            <div style={{fontFamily:"Inter,sans-serif",fontSize:"12px",fontWeight:"600",letterSpacing:"0.26em",color:G(0.9),textTransform:"uppercase",marginBottom:"0.85rem",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(14px)",transition:`opacity 0.9s ${ease} 0.15s,transform 0.9s ${ease} 0.15s`}}>{c.position}</div>

            {/* NAME — larger clamp, brighter */}
            <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(36px,6vw,68px)",fontWeight:"700",color:"#ffffff",lineHeight:"1.05",letterSpacing:"0.01em",marginBottom:"1.2rem",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(20px)",transition:`opacity 0.9s ${ease} 0.3s,transform 0.9s ${ease} 0.3s`}}>{c.name}</h2>

            <div style={{width:"32px",height:"1px",background:`linear-gradient(90deg,${G(0.65)},transparent)`,marginBottom:"1.4rem",opacity:vis?1:0,transition:`opacity 0.8s ease 0.45s`}}/>

            {/* SEMESTER + DEPT — was rgba(255,255,255,0.3), now 0.78 + bigger font + semi-bold */}
            <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"2rem",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(10px)",transition:`opacity 0.9s ${ease} 0.5s,transform 0.9s ${ease} 0.5s`}}>
              {[c.semester,c.dept].map((val,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <span style={{width:"6px",height:"1.5px",background:G(0.6),flexShrink:0,display:"inline-block"}}/>
                  <span style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(13px,1.7vw,15px)",fontWeight:i===0?"500":"400",letterSpacing:"0.04em",color:i===0?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.72)"}}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(10px)",transition:`opacity 0.9s ${ease} 0.62s,transform 0.9s ${ease} 0.62s`}}>
              <GoldButton small onClick={()=>setOpen(true)}>View Profile</GoldButton>
            </div>
          </div>
        </div>
      </div>

      {open && <CandidateOverlay c={c} onClose={()=>setOpen(false)}/>}
    </>
  );
}

/* ── FULLSCREEN OVERLAY ── */
function CandidateOverlay({c,onClose}) {
  const [vis,setVis]=useState(false);
  const [leaving,setLeaving]=useState(false);

  useEffect(()=>{
    const t=requestAnimationFrame(()=>setVis(true));
    const esc=(e)=>{if(e.key==="Escape")close();};
    document.addEventListener("keydown",esc);
    document.body.style.overflow="hidden";
    return()=>{cancelAnimationFrame(t);document.removeEventListener("keydown",esc);document.body.style.overflow="";};
  },[]);

  const close=useCallback(()=>{
    setLeaving(true);
    setTimeout(onClose,500);
  },[onClose]);

  const d=(s)=>({
    opacity:vis&&!leaving?1:0,
    transform:vis&&!leaving?"translateY(0)":"translateY(16px)",
    transition:`opacity 0.65s ${ease} ${s}s,transform 0.65s ${ease} ${s}s`,
  });

  return (
    <div style={{position:"fixed",inset:0,zIndex:500}}>
      <div style={{position:"absolute",inset:0,background:"rgba(4,4,6,0.97)",backdropFilter:"blur(24px)",opacity:vis&&!leaving?1:0,transition:"opacity 0.5s ease",cursor:"pointer"}} onClick={close}/>
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"700px",height:"500px",background:`radial-gradient(ellipse,${G(0.055)} 0%,transparent 65%)`,pointerEvents:"none"}}/>

      <button onClick={close}
        style={{position:"fixed",top:"20px",right:"20px",zIndex:10,background:"transparent",border:"0.5px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.45)",width:"42px",height:"42px",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",transition:"all 0.25s",...d(0.05)}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=G(0.5);e.currentTarget.style.color=G(0.8);}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.45)";}}
      >×</button>

      <div style={{position:"absolute",inset:0,overflow:"auto",WebkitOverflowScrolling:"touch",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"clamp(72px,10vh,110px) clamp(12px,4vw,48px) 60px"}}>
        <div style={{width:"100%",maxWidth:"1040px",position:"relative"}}>
          <div style={{position:"absolute",top:"-40px",left:"-10px",fontFamily:"Georgia,serif",fontSize:"clamp(50px,9vw,120px)",color:"rgba(255,255,255,0.018)",textTransform:"uppercase",letterSpacing:"0.06em",lineHeight:"1.1",userSelect:"none",whiteSpace:"nowrap",pointerEvents:"none",opacity:vis&&!leaving?1:0,transition:"opacity 0.8s ease 0.1s"}}>
            {c.tag.split(" ").map((w,i)=><div key={i}>{w}</div>)}
          </div>

          {/* Card */}
          <div style={{position:"relative",display:"grid",gridTemplateColumns:"clamp(160px,35%,360px) 1fr",background:"rgba(255,255,255,0.01)",border:"0.5px solid rgba(255,255,255,0.06)",...d(0.1)}}>
            {/* Portrait */}
            <div style={{position:"relative",minHeight:"clamp(320px,50vh,540px)",overflow:"hidden"}}>
              <Portrait c={c} objPos="center top"/>
              {/* Hostel badge in overlay — larger + brighter */}
              <div style={{position:"absolute",top:"18px",left:"16px",fontFamily:"Inter,sans-serif",fontSize:"12px",fontWeight:"600",letterSpacing:"0.22em",color:"rgba(255,255,255,0.9)",textTransform:"uppercase",border:`0.5px solid ${G(0.45)}`,padding:"6px 14px",background:"rgba(8,8,11,0.8)",backdropFilter:"blur(6px)"}}>{c.hostel}</div>
            </div>

            {/* Info */}
            <div style={{padding:"clamp(24px,4vw,48px)",display:"flex",flexDirection:"column",justifyContent:"center"}}>

              {/* POSITION in overlay — brighter gold + bigger + bold */}
              <div style={{...d(0.2),fontFamily:"Inter,sans-serif",fontSize:"12px",fontWeight:"600",letterSpacing:"0.28em",color:G(0.95),textTransform:"uppercase",marginBottom:"0.7rem"}}>{c.position}</div>

              {/* NAME in overlay — pure white, bigger */}
              <div style={d(0.28)}>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(30px,5vw,52px)",fontWeight:"700",color:"#ffffff",lineHeight:"1.08",marginBottom:"1.1rem"}}>{c.name}</h2>
              </div>

              <div style={{width:"28px",height:"1px",background:G(0.5),marginBottom:"1.5rem",...d(0.35)}}/>

              {/* Academic grid — labels brighter, values much brighter */}
              <div style={{...d(0.42),marginBottom:"2rem"}}>
                <div style={{fontFamily:"Inter,sans-serif",fontSize:"11px",fontWeight:"600",letterSpacing:"0.28em",color:G(0.8),textTransform:"uppercase",marginBottom:"1rem"}}>Academic Profile</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px 20px"}}>
                  {[{l:"Hostel",v:c.hostel},{l:"Semester",v:c.semester},{l:"Department",v:c.dept},{l:"Contesting For",v:c.position}].map(({l,v})=>(
                    <div key={l}>
                      {/* Label — was rgba(255,255,255,0.2), now 0.5 */}
                      <div style={{fontFamily:"Inter,sans-serif",fontSize:"10px",fontWeight:"500",letterSpacing:"0.18em",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",marginBottom:"5px"}}>{l}</div>
                      {/* Value — was rgba(255,255,255,0.58), now 0.92 + bigger font */}
                      <div style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(12px,1.5vw,15px)",fontWeight:"500",color:"rgba(255,255,255,0.92)",lineHeight:"1.45"}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaign slogan — bigger text, higher contrast */}
              <div style={{...d(0.52)}}>
                <div style={{fontFamily:"Inter,sans-serif",fontSize:"11px",fontWeight:"600",letterSpacing:"0.28em",color:G(0.8),textTransform:"uppercase",marginBottom:"1rem"}}>Campaign Slogan</div>
                <div style={{position:"relative",padding:"1.6rem 1.5rem",border:`0.5px solid ${G(0.25)}`,background:`linear-gradient(135deg,${G(0.06)} 0%,transparent 100%)`}}>
                  <div style={{position:"absolute",top:"-16px",left:"14px",fontFamily:"Georgia,serif",fontSize:"48px",lineHeight:"1",color:G(0.25),userSelect:"none"}}>"</div>
                  {/* Slogan text — was rgba(255,255,255,0.88), now full white + bigger + better line-height */}
                  <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(15px,2.2vw,20px)",color:"rgba(255,255,255,0.97)",lineHeight:"1.7",fontStyle:"italic",letterSpacing:"0.01em",position:"relative",zIndex:1}}>{c.message}</p>
                  <div style={{marginTop:"1.1rem",width:"28px",height:"1px",background:G(0.5)}}/>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom meta */}
          <div style={{marginTop:"1.4rem",display:"flex",justifyContent:"space-between",alignItems:"center",...d(0.65)}}>
            <div style={{height:"0.5px",flex:1,background:`linear-gradient(90deg,${G(0.15)},transparent)`}}/>
            <div style={{fontFamily:"Inter,sans-serif",fontSize:"10px",letterSpacing:"0.22em",color:"rgba(255,255,255,0.18)",textTransform:"uppercase",padding:"0 16px",flexShrink:0,textAlign:"center"}}>JECSU 2026 — ELECTION CAMPAIGN</div>
            <div style={{height:"0.5px",flex:1,background:`linear-gradient(270deg,${G(0.15)},transparent)`}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── FILTER BUTTON ── */
function FilterBtn({label,active,onClick}) {
  const [hov,setHov]=useState(false);
  const lit=active||hov;
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{fontFamily:"Inter,sans-serif",fontSize:"11px",letterSpacing:"0.26em",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",padding:"10px 20px",border:`0.5px solid ${lit?G(active?0.7:0.4):G(0.16)}`,color:active?"#fff":hov?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.35)",background:active?`linear-gradient(135deg,${G(0.12)},${G(0.06)})`:hov?G(0.05):"transparent",boxShadow:active?`0 0 16px ${G(0.1)},inset 0 0 10px ${G(0.04)}`:hov?`0 0 8px ${G(0.06)}`:"none",transition:"all 0.3s ease",position:"relative",overflow:"hidden",minWidth:"52px"}}
    >
      {active&&<span style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 120%,${G(0.12)},transparent 70%)`,pointerEvents:"none"}}/>}
      {label}
    </button>
  );
}

/* ── SECTION HEADER + FILTER ── */
function CandidatesSectionHeader({candidatesRef,activeFilter,onFilterChange}) {
  const [ref,vis]=useInView(0.1);
  return (
    <div ref={(el)=>{ ref.current=el; if(candidatesRef)candidatesRef.current=el; }}
      style={{padding:"clamp(60px,10vw,130px) clamp(1rem,5vw,2rem) clamp(28px,4vw,48px)",textAlign:"center",position:"relative",overflow:"hidden"}}
    >
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"Georgia,serif",fontSize:"clamp(70px,13vw,170px)",color:"rgba(255,255,255,0.018)",letterSpacing:"0.12em",textTransform:"uppercase",userSelect:"none",whiteSpace:"nowrap"}}>CANDIDATES</div>
      <div style={{position:"relative",zIndex:1}}>
        <p style={{fontFamily:"Inter,sans-serif",fontSize:"11px",letterSpacing:"0.3em",color:G(0.6),textTransform:"uppercase",marginBottom:"1.2rem",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(16px)",transition:`opacity 0.9s ${ease},transform 0.9s ${ease}`}}>Election 2026</p>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(26px,5vw,50px)",fontWeight:"400",color:"#fff",letterSpacing:"0.02em",marginBottom:"1.1rem",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(16px)",transition:`opacity 0.9s ${ease} 0.15s,transform 0.9s ${ease} 0.15s`}}>The Candidates</h2>
        <p style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(12px,1.8vw,14px)",color:"rgba(255,255,255,0.25)",letterSpacing:"0.06em",marginBottom:"0",opacity:vis?1:0,transition:`opacity 0.9s ease 0.28s`}}>Thirteen voices. One lobby. One union.</p>
        <div style={{opacity:vis?1:0,transition:`opacity 0.9s ease 0.4s`}}>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"8px",marginTop:"2.2rem"}}>
            {FILTERS.map(f=><FilterBtn key={f} label={f} active={activeFilter===f} onClick={()=>onFilterChange(f)}/>)}
          </div>
        </div>
        <div style={{width:"36px",height:"1px",background:`linear-gradient(90deg,transparent,${G(0.3)},transparent)`,margin:"2rem auto 0",opacity:vis?1:0,transition:`opacity 0.9s ease 0.5s`}}/>
      </div>
    </div>
  );
}

/* ── CANDIDATES LIST ── */
function CandidatesList({activeFilter}) {
  const [displayed,setDisplayed]=useState(candidates);
  const [fading,setFading]=useState(false);
  useEffect(()=>{
    setFading(true);
    const t=setTimeout(()=>{
      setDisplayed(activeFilter==="ALL"?candidates:candidates.filter(c=>c.hostel===activeFilter));
      setFading(false);
    },260);
    return()=>clearTimeout(t);
  },[activeFilter]);
  return (
    <div style={{opacity:fading?0:1,transition:`opacity 0.26s ${ease}`,minHeight:"300px"}}>
      {displayed.length===0
        ? <div style={{textAlign:"center",padding:"80px 2rem",fontFamily:"Inter,sans-serif",fontSize:"11px",letterSpacing:"0.22em",color:"rgba(255,255,255,0.16)",textTransform:"uppercase"}}>No candidates from this hostel</div>
        : displayed.map((c,i)=><CandidatePanel key={c.id} c={c} index={i}/>)
      }
    </div>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{background:"#050507",borderTop:"0.5px solid rgba(255,255,255,0.05)",padding:"48px clamp(1rem,5vw,2rem)",textAlign:"center"}}>
      <div style={{width:"28px",height:"1px",background:`linear-gradient(90deg,transparent,${G(0.3)},transparent)`,margin:"0 auto 20px"}}/>
      <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(14px,3vw,22px)",letterSpacing:"0.22em",color:"rgba(255,255,255,0.18)",textTransform:"uppercase",marginBottom:"8px"}}>JECSU 2026</p>
      <p style={{fontFamily:"Inter,sans-serif",fontSize:"11px",letterSpacing:"0.15em",color:"rgba(255,255,255,0.12)",textTransform:"uppercase"}}>Jorhat Engineering College Student Union</p>
    </footer>
  );
}

/* ── ROOT ── */
export default function App() {
  const scrollY=useScrollY();
  const [activeFilter,setActiveFilter]=useState("ALL");
  const heroRef=useRef(null);
  const candidatesRef=useRef(null);
  return (
    <div style={{background:"#08080b",minHeight:"100vh",WebkitFontSmoothing:"antialiased",MozOsxFontSmoothing:"grayscale"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#08080b;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#08080b;}
        ::-webkit-scrollbar-thumb{background:rgba(196,155,80,0.25);border-radius:2px;}
        @media(max-width:640px){
          .panel-row{flex-direction:column!important;}
        }
      `}</style>
      <Navbar scrollY={scrollY} heroRef={heroRef} candidatesRef={candidatesRef}/>
      <HeroSection heroRef={heroRef} candidatesRef={candidatesRef}/>
      <section style={{background:"#08080b"}}>
        <CandidatesSectionHeader candidatesRef={candidatesRef} activeFilter={activeFilter} onFilterChange={setActiveFilter}/>
        <CandidatesList activeFilter={activeFilter}/>
      </section>
      <Footer/>
    </div>
  );
}