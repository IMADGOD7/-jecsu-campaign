import { useState, useEffect, useRef, useCallback } from "react";

const G  = (a) => `rgba(196,155,80,${a})`;
const GS = "#c49b50";
const ease = "cubic-bezier(0.16,1,0.3,1)";

const candidates = [
  { id:1,  name:"Anupam Saikia",          position:"Debating & Symposium Secretary", hostel:"H4", tag:"DEBATING & SYMPOSIUM",        semester:"4th Semester", dept:"Electrical Engineering",         message:"Choose Leadership That Listens"                       },
  { id:2,  name:"Pranay Konwar",          position:"General Sports Secretary",        hostel:"H4", tag:"GENERAL SPORTS SECRETARY",    semester:"6th Semester", dept:"Electrical Engineering",         message:"Better facilities, Brighter sporting future"          },
  { id:3,  name:"Bibhuti Bhushan Tamuli", position:"General Secretary",               hostel:"H7", tag:"GENERAL SECRETARY",           semester:"6th Semester", dept:"Mechanical Engineering",         message:"Together we rise, Together we lead"                   },
  { id:4,  name:"Darsan Protim Baruah",   position:"Asst. General Secretary",         hostel:"H5", tag:"ASSISTANT GENERAL SECRETARY", semester:"6th Semester", dept:"Electrical Engineering",         message:"Dedicated to Serve, Ready to Lead."                   },
  { id:5,  name:"Jitumoni Chekanidhara",  position:"Cultural Secretary",              hostel:"H3", tag:"CULTURAL SECRETARY",          semester:"6th Semester", dept:"Computer Science & Engineering", message:"Rise together, Lead through culture"                  },
  { id:6,  name:"Shobhitya Raj Borah",    position:"Technical & Hobby Centre Sec.",   hostel:"H5", tag:"TECHNICAL & HOBBY CENTRE",    semester:"6th Semester", dept:"Mechanical Engineering",         message:"Build. Innovate. Lead"                                },
  { id:7,  name:"Debanga Raj Saikia",     position:"Major Games Secretary",           hostel:"H8", tag:"MAJOR GAMES SECRETARY",       semester:"6th Semester", dept:"Mechanical Engineering",         message:"More opportunities, Better tournaments"               },
  { id:8,  name:"Goonjan Deori",          position:"Minor Games Secretary",           hostel:"H3", tag:"MINOR GAMES SECRETARY",       semester:"6th Semester", dept:"Mechanical Engineering",         message:"Lead with Spirit, Win with Unity"                     },
  { id:9,  name:"Debanga Raj Munda",      position:"Gymnasium Secretary",             hostel:"H8", tag:"GYMNASIUM SECRETARY",         semester:"6th Semester", dept:"Mechanical Engineering",         message:"For every student, For every Athlete"                 },
  { id:10, name:"Aghya Bhuyan",           position:"Social Service & Welfare Sec.",   hostel:"H9", tag:"SOCIAL SERVICE & WELFARE",    semester:"4th Semester", dept:"Civil Engineering",              message:"Lead with care, Serve with purpose"                   },
  { id:11, name:"Pritismita Devi",        position:"Literary & Magazine Secretary",   hostel:"H9", tag:"LITERARY & MAGAZINE",         semester:"4th Semester", dept:"Civil Engineering",              message:"শৈৰ্যশীলৰ পৰা বহুমুখীত্বলৈ"                           },
  { id:12, name:"Shruti Deka",            position:"Girls' Common Room Secretary",    hostel:"H9", tag:"GIRLS COMMON ROOM",           semester:"6th Semester", dept:"Civil Engineering",              message:"A welcoming space — safe, comfortable and valued"     },
  { id:13, name:"Gunjan Gogoi",           position:"Boys' Common Room Secretary",     hostel:"H7", tag:"BOYS COMMON ROOM",            semester:"6th Semester", dept:"Computer Science & Engineering", message:"For every student, everyday"                          },
];

const FILTERS = ["ALL","H3","H4","H5","H7","H8","H9"];

/* ── HOOKS ── */
function useScrollY(){
  const [y,setY]=useState(0);
  useEffect(()=>{const h=()=>setY(window.scrollY);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  return y;
}
function useInView(thresh=0.08){
  const ref=useRef(null);
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:thresh});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return [ref,vis];
}
function useMounted(){const[m,setM]=useState(false);useEffect(()=>setM(true),[]);return m;}
function AnimIn({children,delay=0,y=20,style={}}){
  const m=useMounted();
  return <div style={{opacity:m?1:0,transform:m?"translateY(0)":`translateY(${y}px)`,transition:`opacity 1.1s ${ease} ${delay}s,transform 1.1s ${ease} ${delay}s`,...style}}>{children}</div>;
}

/* ── NAVBAR ── */
function Navbar({scrollY,heroRef,candidatesRef}){
  const scrolled=scrollY>40;
  const go=(ref)=>ref?.current?.scrollIntoView({behavior:"smooth",block:"start"});
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:"64px",padding:"0 clamp(1rem,4vw,2rem)",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(8,8,10,0.93)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"0.5px solid rgba(255,255,255,0.05)":"none",transition:"all 0.5s ease"}}>
      <button onClick={()=>go(heroRef)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:"15px",letterSpacing:"0.18em",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",padding:0}}>JECSU</button>
      <div style={{display:"flex",gap:"2rem"}}>
        {[["Home",heroRef],["Candidates",candidatesRef]].map(([l,r])=>(
          <button key={l} onClick={()=>go(r)} style={{fontFamily:"Inter,sans-serif",fontSize:"12px",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",background:"none",border:"none",cursor:"pointer",padding:0,transition:"color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>{l}</button>
        ))}
      </div>
    </nav>
  );
}

/* ── HERO ── */
function HeroSection({heroRef,candidatesRef}){
  const go=()=>candidatesRef?.current?.scrollIntoView({behavior:"smooth",block:"start"});
  return(
    <section ref={heroRef} style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#07070a"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",backgroundSize:"72px 72px"}}/>
      <div style={{position:"absolute",top:"-10%",left:"50%",transform:"translateX(-50%)",width:"800px",height:"500px",background:`radial-gradient(ellipse,${G(0.08)} 0%,transparent 65%)`}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 90% 80% at 50% 50%,transparent 40%,rgba(0,0,0,0.6) 100%)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"200px",background:"linear-gradient(transparent,#08080b)"}}/>
      <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"100px clamp(1rem,5vw,2rem) 80px",maxWidth:"900px",width:"100%"}}>
        <AnimIn delay={0.1} y={12}>
          <div style={{width:"64px",height:"64px",borderRadius:"50%",border:`1px solid ${G(0.3)}`,display:"flex",alignItems:"center",justifyContent:"center",background:G(0.06),marginBottom:"2rem"}}>
            <svg width="34" height="34" viewBox="0 0 38 38" fill="none"><path d="M19 4L34 13V25L19 34L4 25V13L19 4Z" stroke={G(0.7)} strokeWidth="1" fill="none"/><path d="M19 10L28 16V22L19 28L10 22V16L19 10Z" stroke={G(0.4)} strokeWidth="0.75" fill={G(0.05)}/><circle cx="19" cy="19" r="3" fill={G(0.6)}/></svg>
          </div>
        </AnimIn>
        <AnimIn delay={0.3} y={0}><h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(60px,14vw,148px)",fontWeight:"400",letterSpacing:"0.18em",color:"#fff",margin:"0 0 0.05em",textTransform:"uppercase",lineHeight:1}}>JECSU</h1></AnimIn>
        <AnimIn delay={0.5} y={14}><div style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(18px,5vw,40px)",fontWeight:"300",letterSpacing:"0.55em",color:G(0.85),marginBottom:"2.5rem"}}>2026</div></AnimIn>
        <AnimIn delay={0.65}><div style={{width:"40px",height:"1px",background:`linear-gradient(90deg,transparent,${G(0.5)},transparent)`,marginBottom:"2rem"}}/></AnimIn>
        <AnimIn delay={0.8} y={10}><div style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(10px,1.6vw,13px)",letterSpacing:"0.35em",color:"rgba(255,255,255,0.22)",textTransform:"uppercase",marginBottom:"3rem"}}>JORHAT ENGINEERING COLLEGE · HOSTEL LOBBY</div></AnimIn>
        <AnimIn delay={1} y={10}>
          <button onClick={go}
            onMouseEnter={e=>{e.currentTarget.style.background=G(0.1);e.currentTarget.style.borderColor=G(0.8);e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=G(0.35);e.currentTarget.style.color="rgba(255,255,255,0.8)";}}
            style={{fontFamily:"Inter,sans-serif",fontSize:"12px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.8)",background:"transparent",border:`1px solid ${G(0.35)}`,padding:"14px 44px",cursor:"pointer",transition:"all 0.3s ease",display:"inline-flex",alignItems:"center",gap:"12px"}}>
            Meet The Candidates <span style={{opacity:0.5}}>→</span>
          </button>
        </AnimIn>
        <AnimIn delay={1.5}><div style={{width:"1px",height:"40px",background:`linear-gradient(${G(0.5)},transparent)`,margin:"5rem auto 0"}}/></AnimIn>
      </div>
    </section>
  );
}

/* ── POSTER CARD — the campaign poster visual, shared by list cards AND overlay ── */
function PosterCard({c, compact=false}){
  const [imgLoaded,setImgLoaded]=useState(false);
  const [imgError,setImgError]=useState(false);
  const wm=(c.tag+"  ·  ").repeat(8);

  return(
    <div style={{display:"flex",flexDirection:"column",width:"100%",height:"100%",background:"#0a0909",overflow:"hidden"}}>

      {/* ── PHOTO + OVERLAYS — aspect-ratio 3/4 so full portrait is always visible ── */}
      <div style={{position:"relative",width:"100%",aspectRatio:"3/4",overflow:"hidden",flexShrink:0}}>

        {/* photo */}
        {!imgError && (
          <img src={`/id${c.id}.jpeg`} alt={c.name}
            onLoad={()=>setImgLoaded(true)} onError={()=>setImgError(true)}
            style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",objectPosition:"center top",opacity:imgLoaded?1:0,transition:"opacity 0.6s ease"}}
          />
        )}
        {/* fallback initials */}
        {!imgLoaded && !imgError && (
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:"clamp(80px,15vw,160px)",fontWeight:"700",color:"rgba(255,255,255,0.03)",userSelect:"none"}}>
            {c.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
          </div>
        )}

        {/* vignette — lighter in middle so face stays clear */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 55%,rgba(0,0,0,0.72) 100%)"}}/>

        {/* watermark rows — pushed to edges, very subtle, won't cover the face */}
        <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:2,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"0"}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{fontFamily:"Inter,sans-serif",fontWeight:"800",fontSize:"clamp(18px,3.5vw,28px)",letterSpacing:"0.08em",color:"rgba(255,255,255,0.06)",whiteSpace:"nowrap",transform:i%2===0?"translateX(0)":"translateX(-8%)",lineHeight:1,userSelect:"none",padding:"6px 0"}}>{wm}</div>
          ))}
        </div>

        {/* top-left: hostel pill + college label */}
        <div style={{position:"absolute",top:"14px",left:"14px",zIndex:6}}>
          <div style={{display:"inline-block",background:GS,color:"#000",fontFamily:"Inter,sans-serif",fontSize:"11px",fontWeight:"800",letterSpacing:"0.16em",padding:"4px 10px",textTransform:"uppercase",marginBottom:"6px"}}>{c.hostel}</div>
          <div style={{display:"flex",alignItems:"flex-start",gap:"6px"}}>
            <div style={{width:"2px",height:"28px",background:GS,flexShrink:0,marginTop:"2px"}}/>
            <div style={{fontFamily:"Inter,sans-serif",fontSize:"9px",fontWeight:"700",letterSpacing:"0.12em",color:"rgba(255,255,255,0.85)",textTransform:"uppercase",lineHeight:1.4}}>JORHAT<br/>ENGINEERING<br/>COLLEGE</div>
          </div>
        </div>

        {/* top-right: diamond emblem */}
        <div style={{position:"absolute",top:"12px",right:"14px",zIndex:6}}>
          <svg width="34" height="34" viewBox="0 0 38 38" fill="none"><path d="M19 2L36 12V26L19 36L2 26V12L19 2Z" stroke={G(0.65)} strokeWidth="1.2" fill={G(0.07)}/><circle cx="19" cy="19" r="4" fill={G(0.7)}/></svg>
        </div>

        {/* bottom: "vote for" + NAME */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:6,padding:"16px 18px 18px"}}>
          <div style={{fontFamily:"Inter,sans-serif",fontSize:"10px",fontWeight:"500",letterSpacing:"0.32em",color:"rgba(255,255,255,0.72)",textTransform:"uppercase",marginBottom:"4px"}}>vote for</div>
          <div style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(18px,5vw,36px)",fontWeight:"800",color:"#ffffff",letterSpacing:"0.015em",lineHeight:1.05,textTransform:"uppercase",textShadow:"0 2px 18px rgba(0,0,0,0.8)"}}>{c.name}</div>
        </div>
      </div>

      {/* ── GOLD ACCENT STRIP ── */}
      <div style={{background:`linear-gradient(100deg,${G(1)},${G(0.7)})`,padding:"11px 18px",flexShrink:0}}>
        <div style={{fontFamily:"Inter,sans-serif",fontSize:"9px",fontWeight:"500",letterSpacing:"0.3em",color:"rgba(0,0,0,0.5)",textTransform:"uppercase",marginBottom:"2px"}}>as your</div>
        <div style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(12px,3.5vw,18px)",fontWeight:"800",color:"#000",letterSpacing:"0.05em",textTransform:"uppercase",lineHeight:1.1}}>{c.position}</div>
      </div>
    </div>
  );
}

/* ── CANDIDATE CARD (grid list item) ── */
function CandidateCard({c,index}){
  const [ref,vis]=useInView(0.05);
  const [hov,setHov]=useState(false);
  const [open,setOpen]=useState(false);

  return(
    <>
      <div ref={ref}
        style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(28px)",transition:`opacity 0.75s ${ease} ${(index%4)*0.07}s,transform 0.75s ${ease} ${(index%4)*0.07}s`,display:"flex",flexDirection:"column",border:`0.5px solid ${hov?G(0.4):"rgba(255,255,255,0.07)"}`,cursor:"pointer",background:"#0e0d11"}}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        onClick={()=>setOpen(true)}
      >
        {/* poster area scales on hover */}
        <div style={{flex:"0 0 auto",overflow:"hidden",transform:hov?"scale(1.025)":"scale(1)",transformOrigin:"center top",transition:`transform 1.3s ${ease}`}}>
          <PosterCard c={c} compact/>
        </div>

        {/* info strip */}
        <div style={{padding:"16px 18px 18px",borderTop:`0.5px solid rgba(255,255,255,0.05)`}}>
          <h3 style={{fontFamily:"Georgia,serif",fontSize:"clamp(16px,2.5vw,21px)",fontWeight:"700",color:"#fff",marginBottom:"3px",lineHeight:1.2}}>{c.name}</h3>
          <div style={{fontFamily:"Inter,sans-serif",fontSize:"10px",fontWeight:"700",letterSpacing:"0.2em",color:GS,textTransform:"uppercase",marginBottom:"9px"}}>{c.position}</div>
          <p style={{fontFamily:"Inter,sans-serif",fontSize:"12.5px",color:"rgba(255,255,255,0.45)",lineHeight:1.65,marginBottom:"14px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{c.message}</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"0.5px solid rgba(255,255,255,0.06)",paddingTop:"11px"}}>
            <span style={{fontFamily:"Inter,sans-serif",fontSize:"10px",fontWeight:"600",letterSpacing:"0.2em",color:"rgba(255,255,255,0.24)",textTransform:"uppercase"}}>Hostel {c.hostel}</span>
            <span style={{fontFamily:"Inter,sans-serif",fontSize:"10px",fontWeight:"700",letterSpacing:"0.16em",color:hov?GS:"rgba(255,255,255,0.36)",textTransform:"uppercase",transition:"color 0.3s",display:"flex",alignItems:"center",gap:"5px"}}>
              View Profile
              <span style={{transform:hov?"translateX(3px)":"none",transition:"transform 0.3s ease",display:"inline-block"}}>→</span>
            </span>
          </div>
        </div>
      </div>

      {open && <CandidateOverlay c={c} onClose={()=>setOpen(false)}/>}
    </>
  );
}

/* ── OVERLAY — same poster, full size, with detail card below ── */
function CandidateOverlay({c,onClose}){
  const [vis,setVis]=useState(false);
  const [leaving,setLeaving]=useState(false);

  useEffect(()=>{
    const t=requestAnimationFrame(()=>setVis(true));
    const esc=(e)=>{if(e.key==="Escape")close();};
    document.addEventListener("keydown",esc);
    document.body.style.overflow="hidden";
    return()=>{cancelAnimationFrame(t);document.removeEventListener("keydown",esc);document.body.style.overflow="";};
  },[]);

  const close=useCallback(()=>{setLeaving(true);setTimeout(onClose,420);},[onClose]);
  const fd=(s)=>({opacity:vis&&!leaving?1:0,transform:vis&&!leaving?"translateY(0)":"translateY(12px)",transition:`opacity 0.55s ${ease} ${s}s,transform 0.55s ${ease} ${s}s`});

  return(
    <div style={{position:"fixed",inset:0,zIndex:500}}>
      {/* backdrop */}
      <div style={{position:"absolute",inset:0,background:"rgba(4,4,6,0.96)",backdropFilter:"blur(22px)",opacity:vis&&!leaving?1:0,transition:"opacity 0.42s ease",cursor:"pointer"}} onClick={close}/>
      {/* gold glow */}
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"600px",height:"400px",background:`radial-gradient(ellipse,${G(0.06)} 0%,transparent 65%)`,pointerEvents:"none"}}/>

      {/* close btn */}
      <button onClick={close} style={{position:"fixed",top:"16px",right:"16px",zIndex:10,background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",width:"40px",height:"40px",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",transition:"all 0.22s",...fd(0.04)}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=GS;e.currentTarget.style.color=GS;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.5)";}}
      >×</button>

      {/* scrollable content */}
      <div style={{position:"absolute",inset:0,overflow:"auto",WebkitOverflowScrolling:"touch",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"clamp(60px,7vh,88px) clamp(10px,4vw,32px) 60px"}}>
        <div style={{width:"100%",maxWidth:"500px"}}>

          {/* FULL POSTER — identical component, full (not compact) size */}
          <div style={{...fd(0.08),border:`0.5px solid ${G(0.28)}`,overflow:"hidden",boxShadow:`0 0 80px ${G(0.1)},0 0 0 0.5px ${G(0.1)}`}}>
            <PosterCard c={c} compact={false}/>
          </div>

          {/* DETAIL INFO CARD */}
          <div style={{background:"#0e0d11",border:`0.5px solid rgba(255,255,255,0.07)`,borderTop:"none",padding:"clamp(18px,4vw,32px)",...fd(0.22)}}>

            <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(22px,4vw,36px)",fontWeight:"700",color:"#fff",marginBottom:"5px",lineHeight:1.1}}>{c.name}</h2>
            <div style={{fontFamily:"Inter,sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.2em",color:GS,textTransform:"uppercase",marginBottom:"18px"}}>{c.position}</div>
            <div style={{width:"32px",height:"2px",background:GS,marginBottom:"22px"}}/>

            {/* academic grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px 22px",marginBottom:"22px"}}>
              {[{l:"Hostel",v:c.hostel},{l:"Semester",v:c.semester},{l:"Department",v:c.dept},{l:"Contesting For",v:c.position}].map(({l,v})=>(
                <div key={l}>
                  <div style={{fontFamily:"Inter,sans-serif",fontSize:"9px",fontWeight:"600",letterSpacing:"0.2em",color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:"5px"}}>{l}</div>
                  <div style={{fontFamily:"Inter,sans-serif",fontSize:"13.5px",fontWeight:"500",color:"rgba(255,255,255,0.9)",lineHeight:1.4}}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{height:"0.5px",background:"rgba(255,255,255,0.07)",marginBottom:"22px"}}/>

            {/* slogan */}
            <div style={{fontFamily:"Inter,sans-serif",fontSize:"9px",fontWeight:"700",letterSpacing:"0.24em",color:G(0.7),textTransform:"uppercase",marginBottom:"11px"}}>Campaign Slogan</div>
            <div style={{position:"relative",padding:"16px 18px",border:`0.5px solid ${G(0.18)}`,background:G(0.04)}}>
              <div style={{position:"absolute",top:"-13px",left:"11px",fontFamily:"Georgia,serif",fontSize:"40px",lineHeight:1,color:G(0.18),userSelect:"none"}}>"</div>
              <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(14px,2vw,18px)",color:"rgba(255,255,255,0.95)",lineHeight:1.7,fontStyle:"italic",position:"relative",zIndex:1}}>{c.message}</p>
            </div>

            {/* footer */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px",paddingTop:"16px",borderTop:"0.5px solid rgba(255,255,255,0.06)"}}>
              <span style={{fontFamily:"Inter,sans-serif",fontSize:"9px",fontWeight:"600",letterSpacing:"0.18em",color:"rgba(255,255,255,0.18)",textTransform:"uppercase"}}>JECSU 2026 · Election Campaign</span>
              <span style={{fontFamily:"Inter,sans-serif",fontSize:"9px",fontWeight:"700",letterSpacing:"0.18em",color:G(0.6),textTransform:"uppercase"}}>Hostel {c.hostel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── FILTER BUTTON ── */
function FilterBtn({label,active,onClick}){
  const [hov,setHov]=useState(false);
  return(
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{fontFamily:"Inter,sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.22em",textTransform:"uppercase",cursor:"pointer",padding:"9px 20px",border:`0.5px solid ${active?GS:hov?G(0.4):G(0.15)}`,color:active?"#000":hov?"#fff":"rgba(255,255,255,0.35)",background:active?GS:"transparent",transition:"all 0.25s ease",minWidth:"52px"}}
    >{label}</button>
  );
}

/* ── SECTION HEADER ── */
function CandidatesSectionHeader({candidatesRef,activeFilter,onFilterChange}){
  const [ref,vis]=useInView(0.1);
  return(
    <div ref={(el)=>{ref.current=el;if(candidatesRef)candidatesRef.current=el;}}
      style={{padding:"clamp(60px,10vw,120px) clamp(1rem,5vw,2rem) clamp(24px,4vw,44px)",textAlign:"center",position:"relative",overflow:"hidden"}}
    >
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"Georgia,serif",fontSize:"clamp(70px,13vw,170px)",color:"rgba(255,255,255,0.016)",letterSpacing:"0.12em",textTransform:"uppercase",userSelect:"none",whiteSpace:"nowrap"}}>CANDIDATES</div>
      <div style={{position:"relative",zIndex:1}}>
        <p style={{fontFamily:"Inter,sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.32em",color:G(0.7),textTransform:"uppercase",marginBottom:"1rem",opacity:vis?1:0,transition:`opacity 0.9s ${ease}`}}>Election 2026</p>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(26px,5vw,50px)",fontWeight:"400",color:"#fff",marginBottom:"1rem",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(16px)",transition:`opacity 0.9s ${ease} 0.12s,transform 0.9s ${ease} 0.12s`}}>The Candidates</h2>
        <p style={{fontFamily:"Inter,sans-serif",fontSize:"clamp(12px,1.8vw,14px)",color:"rgba(255,255,255,0.2)",letterSpacing:"0.06em",opacity:vis?1:0,transition:`opacity 0.9s ease 0.24s`}}>Thirteen voices. One lobby. One union.</p>
        <div style={{opacity:vis?1:0,transition:`opacity 0.9s ease 0.36s`}}>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"8px",marginTop:"1.8rem"}}>
            {FILTERS.map(f=><FilterBtn key={f} label={f} active={activeFilter===f} onClick={()=>onFilterChange(f)}/>)}
          </div>
        </div>
        <div style={{width:"36px",height:"1px",background:`linear-gradient(90deg,transparent,${G(0.3)},transparent)`,margin:"1.8rem auto 0",opacity:vis?1:0,transition:`opacity 0.9s ease 0.48s`}}/>
      </div>
    </div>
  );
}

/* ── CANDIDATES GRID ── */
function CandidatesList({activeFilter}){
  const [displayed,setDisplayed]=useState(candidates);
  const [fading,setFading]=useState(false);
  useEffect(()=>{
    setFading(true);
    const t=setTimeout(()=>{
      setDisplayed(activeFilter==="ALL"?candidates:candidates.filter(c=>c.hostel===activeFilter));
      setFading(false);
    },240);
    return()=>clearTimeout(t);
  },[activeFilter]);
  return(
    <div style={{opacity:fading?0:1,transition:`opacity 0.24s ${ease}`,minHeight:"300px",padding:"0 clamp(1rem,4vw,2.5rem) clamp(48px,8vw,100px)"}}>
      {displayed.length===0
        ? <div style={{textAlign:"center",padding:"80px 2rem",fontFamily:"Inter,sans-serif",fontSize:"11px",letterSpacing:"0.22em",color:"rgba(255,255,255,0.14)",textTransform:"uppercase"}}>No candidates from this hostel</div>
        : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(300px,100%),1fr))",gap:"clamp(14px,2.5vw,24px)"}}>
            {displayed.map((c,i)=><CandidateCard key={c.id} c={c} index={i}/>)}
          </div>
      }
    </div>
  );
}

/* ── FOOTER ── */
function Footer(){
  return(
    <footer style={{background:"#050507",borderTop:"0.5px solid rgba(255,255,255,0.05)",padding:"44px clamp(1rem,5vw,2rem)",textAlign:"center"}}>
      <div style={{width:"28px",height:"1px",background:`linear-gradient(90deg,transparent,${G(0.3)},transparent)`,margin:"0 auto 18px"}}/>
      <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(13px,3vw,20px)",letterSpacing:"0.22em",color:"rgba(255,255,255,0.15)",textTransform:"uppercase",marginBottom:"6px"}}>JECSU 2026</p>
      <p style={{fontFamily:"Inter,sans-serif",fontSize:"11px",letterSpacing:"0.14em",color:"rgba(255,255,255,0.1)",textTransform:"uppercase"}}>Jorhat Engineering College Student Union</p>
    </footer>
  );
}

/* ── ROOT ── */
export default function App(){
  const scrollY=useScrollY();
  const [activeFilter,setActiveFilter]=useState("ALL");
  const heroRef=useRef(null);
  const candidatesRef=useRef(null);
  return(
    <div style={{background:"#08080b",minHeight:"100vh",WebkitFontSmoothing:"antialiased",MozOsxFontSmoothing:"grayscale"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#08080b;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#08080b;}
        ::-webkit-scrollbar-thumb{background:rgba(196,155,80,0.28);border-radius:2px;}
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