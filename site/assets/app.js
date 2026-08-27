// Toda a interatividade da aula. Nenhum texto de interface mora aqui:
// cada pagina define window.STR antes de carregar este arquivo.
const S = window.STR;
const T = (tpl, v) => tpl.replace(/\{(\w+)\}/g, (_, k) => v[k]);

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const NS="http://www.w3.org/2000/svg";
const el=(t,a={},parent)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(parent)parent.appendChild(e);return e};
const fmt=n=>n.toLocaleString(S.locale);
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const gauss=()=>{let u=0,v=0;while(!u)u=rnd();while(!v)v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const C={coral:"#FF6B57",teal:"#1BA39C",ink:"#17203A",grey:"#B9C0D8",line:"#C9D1E4"};

// nav highlight
const links=$$("nav.map a[href^='#']");
$$("section.block").forEach(s=>new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle("on",l.getAttribute("href")==="#"+s.id))})},{rootMargin:"-30% 0px -60% 0px"}).observe(s));

// 1: rule tester
$("#ruleBtn").onclick=()=>{
  const r=$("#rule").value.toLowerCase(), o=$("#ruleOut");
  if(!r.trim()){o.textContent=S.ruleEmpty;o.className="out";return}
  const hit=S.ruleTests.find(t=>r.includes(t[0]));
  o.className="out bad";
  o.textContent=hit?hit[1]:S.ruleNoHit;
};

// 2: learn cards
$$("#learnCards .card").forEach(c=>c.onclick=()=>{if(!c.classList.contains("right")&&!c.classList.contains("wrong"))c.classList.toggle("sel")});
$("#learnBtn").onclick=()=>{let ok=true;$$("#learnCards .card").forEach(c=>{const want=c.dataset.ok==="1",got=c.classList.contains("sel");c.classList.remove("sel");c.classList.add(want===got?"right":"wrong");if(want!==got)ok=false});
  const o=$("#learnOut");o.className="out "+(ok?"ok":"bad");o.textContent=ok?S.learnOk:S.learnBad;};

// fruit data shared by blocks 3, 6, 7
let fruits=[];
function makeFruits(){fruits=[];for(let i=0;i<30;i++){fruits.push({x:150+gauss()*22,y:0.62+gauss()*0.09,c:1});fruits.push({x:205+gauss()*24,y:0.40+gauss()*0.10,c:0})}
  fruits.forEach(f=>{f.x=Math.max(90,Math.min(280,f.x));f.y=Math.max(0.1,Math.min(0.9,f.y))})}
makeFruits();
const P={x0:80,x1:290,y0:0.05,y1:0.95};
const sx=(x,W,pad)=>pad+(x-P.x0)/(P.x1-P.x0)*(W-2*pad), sy=(y,H,pad)=>H-pad-(y-P.y0)/(P.y1-P.y0)*(H-2*pad);
function axes(svg,W,H,pad,xl,yl){el("line",{x1:pad,y1:H-pad,x2:W-pad,y2:H-pad,stroke:C.line,"stroke-width":2},svg);el("line",{x1:pad,y1:pad,x2:pad,y2:H-pad,stroke:C.line,"stroke-width":2},svg);
  el("text",{x:W/2,y:H-8,"font-size":13,"text-anchor":"middle",fill:"#4A5472"},svg).textContent=xl;
  el("text",{x:14,y:H/2,"font-size":13,"text-anchor":"middle",fill:"#4A5472",transform:`rotate(-90 14 ${H/2})`},svg).textContent=yl}
const fcol=f=>f.c?C.teal:C.coral;

// 3: labels toggle
function drawLabels(){const svg=$("#svgLabels"),W=640,H=380,pad=44;svg.innerHTML="";axes(svg,W,H,pad,S.axWeight,S.axSweet);
  const on=$("#lblToggle").checked;fruits.forEach(f=>el("circle",{cx:sx(f.x,W,pad),cy:sy(f.y,H,pad),r:7,fill:on?fcol(f):C.grey,stroke:"#fff","stroke-width":1.5},svg));
  $("#lblLegend").style.visibility=on?"visible":"hidden"}
$("#lblToggle").onchange=drawLabels;drawLabels();

// 4: as mesmas 4 entradas alimentam as duas saidas (regressao e classificacao)
const HOOD_MULT=[0.8,1.0,1.3];            // quanto o bairro multiplica o preco
let hood=1;
const feats=()=>({area:+$("#ftArea").value,rooms:+$("#ftRooms").value,year:+$("#ftYear").value,hood});
const priceOf=f=>Math.round((130+2.6*f.area+22*f.rooms+0.9*(f.year-1970))*HOOD_MULT[f.hood]);
// vende rapido: imovel novo, menor, com 2 ou 3 quartos, em bairro central
const signalsOf=f=>[f.year>=2000,f.area<=90,f.rooms===2||f.rooms===3,f.hood===1].filter(Boolean).length;
function drawFeats(){const f=feats(),p=priceOf(f);
  $("#vArea").textContent=T(S.areaTick,{v:f.area});$("#vRooms").textContent=f.rooms;$("#vYear").textContent=f.year;
  $("#priceTxt").textContent=T(S.priceLabel,{v:p});
  const t=Math.max(0,Math.min(1,(p-200)/700));
  $("#priceKnob").setAttribute("transform",`translate(${t*240-130} 0)`);
  const n=signalsOf(f),yes=n>=3;
  [["#binA",yes],["#binB",!yes]].forEach(([sel,on])=>{const g=$(sel);
    g.querySelector("rect").setAttribute("stroke-width",on?6:3);g.style.opacity=on?1:.3});
  $("#sellOut").innerHTML=T(S.sellOut,{n,answer:`<strong>${yes?S.sellYes:S.sellNo}</strong>`})}
["#ftArea","#ftRooms","#ftYear"].forEach(sel=>$(sel).oninput=drawFeats);
$$("#ftHood button").forEach((b,i)=>b.onclick=()=>{hood=i;$$("#ftHood button").forEach((x,j)=>x.setAttribute("aria-pressed",i===j));drawFeats()});
drawFeats();
const QZ=S.quiz;
let qdone=0,qright=0;
QZ.forEach(([t,a])=>{const row=document.createElement("div");row.className="row";row.innerHTML=`<span>${t}</span><button class="ghost small">${S.quizC}</button><button class="ghost small">${S.quizR}</button>`;
  const [b1,b2]=row.querySelectorAll("button");const pick=g=>{if(row.dataset.done)return;row.dataset.done=1;qdone++;const ok=g===a;if(ok)qright++;row.classList.add(ok?"right":"wrong");b1.disabled=b2.disabled=true;
    if(!ok)row.querySelector("span").textContent+=T(S.quizAnswer,{a:a==="C"?S.quizC:S.quizR});
    if(qdone===QZ.length){const o=$("#quizOut");o.className="out "+(qright===QZ.length?"ok":"");o.textContent=T(S.quizScore,{right:qright,total:QZ.length})+(qright===QZ.length?S.quizPerfect:S.quizHint)}};
  b1.onclick=()=>pick("C");b2.onclick=()=>pick("R");$("#quiz").appendChild(row)});

// 5: regression
const apts=[[45,310],[48,340],[52,360],[56,385],[60,395],[64,455],[68,440],[72,425],[75,455],[78,540],[80,520],[88,505],
  [95,560],[100,640],[105,590],[110,640],[115,720],[120,700],[128,700],[135,760],[142,795],[150,830],[160,880],[170,930]]
  .map(([a,p])=>({a,p:p+Math.round(gauss()*35)}));
// padL sobra para o rotulo do eixo y; padB, para o do eixo x
const R={W:700,H:400,pad:56,padL:96,padB:70,a0:30,a1:190,p0:100,p1:1100};
const rx=a=>R.padL+(a-R.a0)/(R.a1-R.a0)*(R.W-R.pad-R.padL), ry=p=>R.H-R.padB-(p-R.p0)/(R.p1-R.p0)*(R.H-R.padB-R.pad);
const dec=n=>S.decimalComma?n.replace(".",","):n;
function drawReg(){const a=+$("#slA").value,b=+$("#slB").value,svg=$("#svgReg");svg.innerHTML="";
  // recorta a area do grafico: com a e b livres a reta pode sair muito longe
  const clip=el("clipPath",{id:"regClip"},svg);
  el("rect",{x:R.padL,y:R.pad,width:R.W-R.pad-R.padL,height:R.H-R.padB-R.pad},clip);
  el("line",{x1:R.padL,y1:R.H-R.padB,x2:R.W-R.pad,y2:R.H-R.padB,stroke:C.line,"stroke-width":2},svg);el("line",{x1:R.padL,y1:R.pad,x2:R.padL,y2:R.H-R.padB,stroke:C.line,"stroke-width":2},svg);
  [50,100,150].forEach(v=>el("text",{x:rx(v),y:R.H-R.padB+20,"font-size":12,"text-anchor":"middle",fill:"#4A5472"},svg).textContent=T(S.areaTick,{v}));
  [300,600,900].forEach(v=>el("text",{x:R.padL-8,y:ry(v)+4,"font-size":12,"text-anchor":"end",fill:"#4A5472"},svg).textContent=T(S.priceTick,{v}));
  el("text",{x:(R.padL+R.W-R.pad)/2,y:R.H-16,"font-size":13,"text-anchor":"middle",fill:"#4A5472"},svg).textContent=S.axArea;
  el("text",{x:22,y:(R.pad+R.H-R.padB)/2,"font-size":13,"text-anchor":"middle",fill:"#4A5472",transform:`rotate(-90 22 ${(R.pad+R.H-R.padB)/2})`},svg).textContent=S.axPrice;
  let err=0;apts.forEach(d=>{const pred=a*d.a+b;err+=Math.abs(pred-d.p);const y1=ry(Math.max(R.p0,Math.min(R.p1,pred)));el("line",{x1:rx(d.a),y1:ry(d.p),x2:rx(d.a),y2:y1,stroke:"#D63B3B","stroke-width":3,"stroke-opacity":.55},svg)});
  el("line",{x1:rx(R.a0),y1:ry(a*R.a0+b),x2:rx(R.a1),y2:ry(a*R.a1+b),stroke:"#7B61FF","stroke-width":4,"stroke-linecap":"round","clip-path":"url(#regClip)"},svg);
  apts.forEach(d=>el("circle",{cx:rx(d.a),cy:ry(d.p),r:7,fill:C.ink,stroke:"#fff","stroke-width":2},svg));
  $("#vA").textContent=dec(a.toFixed(1));$("#vB").textContent=b;$("#errV").textContent=T(S.errValue,{v:fmt(Math.round(err))});
  el("text",{x:R.W-R.pad,y:R.pad-14,"font-size":13,"text-anchor":"end",fill:"#7B61FF"},svg).textContent=T(S.regFormula,{a:dec(a.toFixed(1)),sign:b<0?"−":"+",b:Math.abs(b)})}
$("#slA").oninput=drawReg;$("#slB").oninput=drawReg;drawReg();
// a reta passa do ponto e volta algumas vezes antes de assentar, como uma busca
const settle=t=>1-Math.exp(-4.2*t)*Math.cos(7.5*t);
$("#fitBtn").onclick=()=>{const btn=$("#fitBtn");if(btn.disabled)return;btn.disabled=true;
  const n=apts.length,mx=apts.reduce((s,d)=>s+d.a,0)/n,my=apts.reduce((s,d)=>s+d.p,0)/n;let num=0,den=0;apts.forEach(d=>{num+=(d.a-mx)*(d.p-my);den+=(d.a-mx)**2});const A=num/den,B=my-A*mx;
  const a0=+$("#slA").value,b0=+$("#slB").value,DUR=1600,t0=performance.now();
  const step=now=>{const t=Math.min((now-t0)/DUR,1),e=t>=1?1:settle(t);
    $("#slA").value=(a0+(A-a0)*e).toFixed(2);$("#slB").value=Math.round(b0+(B-b0)*e);drawReg();
    if(t<1)requestAnimationFrame(step);else btn.disabled=false};
  requestAnimationFrame(step)};

// 6: kNN playground
let novo=null;const K6={W:700,H:420,pad:48};
const knn=(pt,data,k)=>{const d=data.map(f=>({f,d:Math.hypot((f.x-pt.x)/(P.x1-P.x0),(f.y-pt.y)/(P.y1-P.y0))})).sort((u,v)=>u.d-v.d).slice(0,k);const v1=d.filter(o=>o.f.c===1).length;return{nb:d,c:v1>k/2?1:0,v1,v0:d.length-v1}};
function drawKnn(){const svg=$("#svgKnn"),{W,H,pad}=K6,k=+$("#slK").value;svg.innerHTML="";$("#vK").textContent=k;
  if($("#mapToggle").checked){const g=el("g",{"shape-rendering":"crispEdges"},svg);const nx=46,ny=28,cw=(W-2*pad)/nx,ch=(H-2*pad)/ny;for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const x=P.x0+(i+.5)/nx*(P.x1-P.x0),y=P.y0+(j+.5)/ny*(P.y1-P.y0);const r=knn({x,y},fruits,k);el("rect",{x:sx(x,W,pad)-cw/2,y:sy(y,H,pad)-ch/2,width:cw+.5,height:ch+.5,fill:r.c?C.teal:C.coral,opacity:.16},g)}}
  axes(svg,W,H,pad,S.axWeight,S.axSweet);
  if(novo){const r=knn(novo,fruits,k);r.nb.forEach(o=>el("line",{x1:sx(novo.x,W,pad),y1:sy(novo.y,H,pad),x2:sx(o.f.x,W,pad),y2:sy(o.f.y,H,pad),stroke:C.ink,"stroke-width":1.5,"stroke-dasharray":"4 3",opacity:.6},svg));
    $("#knnOut").innerHTML=T(S.voteResult,{
      vote:k===1?S.voteOne:T(S.voteMany,{k}),
      apples:`<span style="color:${C.teal}">${r.v1} ${r.v1===1?S.apple:S.applePl}</span>`,
      oranges:`<span style="color:${C.coral}">${r.v0} ${r.v0===1?S.orange:S.orangePl}</span>`,
      winner:`<strong>${r.c?S.apple:S.orange}</strong>`})}
  fruits.forEach(f=>el("circle",{cx:sx(f.x,W,pad),cy:sy(f.y,H,pad),r:7,fill:fcol(f),stroke:"#fff","stroke-width":1.5},svg));
  if(novo){el("circle",{cx:sx(novo.x,W,pad),cy:sy(novo.y,H,pad),r:11,fill:"#fff",stroke:C.ink,"stroke-width":3},svg);el("text",{x:sx(novo.x,W,pad),y:sy(novo.y,H,pad)-16,"font-size":13,"text-anchor":"middle"},svg).textContent="?"}}
$("#svgKnn").addEventListener("click",e=>{const svg=e.currentTarget,r=svg.getBoundingClientRect(),px=(e.clientX-r.left)/r.width*K6.W,py=(e.clientY-r.top)/r.height*K6.H;
  novo={x:P.x0+(px-K6.pad)/(K6.W-2*K6.pad)*(P.x1-P.x0),y:P.y0+(K6.H-K6.pad-py)/(K6.H-2*K6.pad)*(P.y1-P.y0)};drawKnn()});
$("#slK").oninput=drawKnn;$("#mapToggle").onchange=drawKnn;
$("#shuffleBtn").onclick=()=>{seed=Math.floor(Math.random()*1e6)+1;makeFruits();novo=null;drawLabels();drawKnn();drawSplit()};
drawKnn();

// 6b: ilustracao passo a passo com poucos pontos (o mecanismo, nao o playground)
const DEMO=[{x:120,y:0.70,c:1},{x:135,y:0.62,c:1},{x:150,y:0.74,c:1},{x:160,y:0.55,c:1},
            {x:205,y:0.42,c:0},{x:220,y:0.35,c:0},{x:195,y:0.30,c:0},{x:235,y:0.48,c:0}];
const DNEW={x:180,y:0.52};
const DG={W:700,H:340,pad:52};
const dist=(a,b)=>Math.hypot((a.x-b.x)/(P.x1-P.x0),(a.y-b.y)/(P.y1-P.y0));
const demoRank=DEMO.map((f,i)=>({f,i,d:dist(f,DNEW)})).sort((u,v)=>u.d-v.d);
const PH=[0.10,0.58,0.76];          // onde termina cada fase da animacao
let stepK=3, stepAnim=null;
function drawSteps(pr){
  const svg=$("#svgSteps"),{W,H,pad}=DG;svg.innerHTML="";
  axes(svg,W,H,pad,S.axWeight,S.axSweet);
  const X=f=>sx(f.x,W,pad),Y=f=>sy(f.y,H,pad);
  const phase=pr<PH[0]?0:pr<PH[1]?1:pr<PH[2]?2:3;
  const nMeas=phase===0?0:phase>1?DEMO.length:Math.ceil((pr-PH[0])/(PH[1]-PH[0])*DEMO.length);
  const near=demoRank.slice(0,stepK),sel=new Set(near.map(o=>o.i));
  DEMO.forEach((f,i)=>{
    if(phase===0)return;
    if(phase===1&&i>=nMeas)return;
    const keep=sel.has(i);
    if(phase===3&&!keep)return;
    el("line",{x1:X(DNEW),y1:Y(DNEW),x2:X(f),y2:Y(f),
      stroke:phase>=2&&keep?fcol(f):C.ink,"stroke-width":phase>=2&&keep?3.5:1.5,
      "stroke-dasharray":phase>=2&&keep?"":"4 3",
      opacity:phase>=2?(keep?.95:.12):.55},svg)});
  DEMO.forEach((f,i)=>{const on=sel.has(i)&&phase>=2;
    el("circle",{cx:X(f),cy:Y(f),r:on?11:8,fill:fcol(f),stroke:"#fff","stroke-width":on?3:2,
      opacity:phase>=2&&!on?.28:1},svg)});
  if(phase>=2)near.forEach((o,r)=>el("text",{x:X(o.f),y:Y(o.f)-19,"font-size":13,"text-anchor":"middle",fill:C.ink},svg).textContent=S.rank[r]);
  el("circle",{cx:X(DNEW),cy:Y(DNEW),r:12,fill:"#fff",stroke:C.ink,"stroke-width":3},svg);
  el("text",{x:X(DNEW),y:Y(DNEW)+5,"font-size":14,"text-anchor":"middle",fill:C.ink},svg).textContent="?";
  const v1=near.filter(o=>o.f.c===1).length,v0=stepK-v1,cap=[S.step0,S.step1,S.step2,S.step3][phase];
  $("#stepOut").innerHTML=phase<3?cap:cap+" "+T(S.voteResult,{
    vote:stepK===1?S.voteOne:T(S.voteMany,{k:stepK}),
    apples:`<span style="color:${C.teal}">${v1} ${v1===1?S.apple:S.applePl}</span>`,
    oranges:`<span style="color:${C.coral}">${v0} ${v0===1?S.orange:S.orangePl}</span>`,
    winner:`<strong>${v1>v0?S.apple:S.orange}</strong>`});
}
const stopSteps=()=>{if(stepAnim){cancelAnimationFrame(stepAnim);stepAnim=null}};
$("#stepBtn").onclick=()=>{stopSteps();const DUR=5200,t0=performance.now();
  const f=now=>{const pr=Math.min((now-t0)/DUR,1);drawSteps(pr);
    stepAnim=pr<1?requestAnimationFrame(f):null};
  stepAnim=requestAnimationFrame(f)};
$$("#stepK button").forEach((b,i)=>b.onclick=()=>{stepK=[1,3,5][i];
  $$("#stepK button").forEach((x,j)=>x.setAttribute("aria-pressed",i===j));
  stopSteps();drawSteps(1)});
drawSteps(1);

// 7: train / test
function drawSplit(){const hide=+$("#slHide").value/100,k=+$("#slK2").value;$("#vHide").textContent=Math.round(hide*100)+"%";$("#vK2").textContent=k;
  const order=fruits.map((f,i)=>({f,key:((i*2654435761)>>>0)%1000})).sort((a,b)=>a.key-b.key);const nHide=Math.round(order.length*hide);
  const test=order.slice(0,nHide).map(o=>o.f),train=order.slice(nHide).map(o=>o.f);
  const acc=(set,ref)=>set.length?set.filter(f=>knn(f,ref,Math.min(k,ref.length)).c===f.c).length/set.length:null;
  const aTr=acc(train,train),aTe=acc(test,train);
  const svg=$("#svgSplit"),W=340,H=300,pad=34;svg.innerHTML="";axes(svg,W,H,pad,S.axWeight,S.axSweet);
  train.forEach(f=>el("circle",{cx:sx(f.x,W,pad),cy:sy(f.y,H,pad),r:5.5,fill:fcol(f),stroke:"#fff","stroke-width":1},svg));
  test.forEach(f=>el("circle",{cx:sx(f.x,W,pad),cy:sy(f.y,H,pad),r:5.5,fill:"#fff",stroke:fcol(f),"stroke-width":2,"stroke-dasharray":"2 2"},svg));
  const s2=$("#svgScore");s2.innerHTML="";const bars=[[S.barTrain,aTr,C.ink],[S.barTest,aTe,"#7B61FF"]];
  bars.forEach(([n,v,c],i)=>{const x=70+i*140,base=250,h=v==null?0:v*170;el("rect",{x,y:base-h,width:80,height:h,rx:8,fill:c},s2);
    el("text",{x:x+40,y:base-h-10,"font-size":20,"text-anchor":"middle",fill:c},s2).textContent=v==null?"—":Math.round(v*100)+"%";
    el("text",{x:x+40,y:base+20,"font-size":12,"text-anchor":"middle",fill:"#4A5472"},s2).textContent=n});
  el("line",{x1:40,y1:250,x2:300,y2:250,stroke:C.line,"stroke-width":2},s2);el("text",{x:170,y:22,"font-size":14,"text-anchor":"middle"},s2).textContent=S.scoreTitle;
  if(aTe==null)el("text",{x:170,y:140,"font-size":12,"text-anchor":"middle",fill:"#4A5472"},s2).textContent=S.scoreHint}
$("#slHide").oninput=drawSplit;$("#slK2").oninput=drawSplit;drawSplit();

// realce de sintaxe minimo para os paineis de codigo (sem dependencia externa)
const PY_RE=/(#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(\d+\.?\d*)\b|\b(from|import|as|def|return|print|if|else|elif|for|in|while|with|class|None|True|False|and|or|not|lambda)\b/g;
const esc=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function highlight(src){let out="",last=0,m;PY_RE.lastIndex=0;
  while((m=PY_RE.exec(src))!==null){out+=esc(src.slice(last,m.index));
    const cls=m[1]?"c":m[2]?"s":m[3]?"n":"k";out+=`<span class="${cls}">${esc(m[0])}</span>`;last=PY_RE.lastIndex}
  return out+esc(src.slice(last))}
$$("pre code.py").forEach(c=>{c.innerHTML=highlight(c.textContent)});

// 8: pyodide
const PYODIDE="https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
let pyReady=null;
async function getPy(){if(pyReady)return pyReady;pyReady=(async()=>{$("#pyStatus").textContent=S.pyDownload;
  await new Promise((res,rej)=>{const s=document.createElement("script");s.src=PYODIDE+"pyodide.js";s.onload=res;s.onerror=()=>rej(new Error(S.pyNetError));document.head.appendChild(s)});
  const py=await loadPyodide({indexURL:PYODIDE});$("#pyStatus").textContent=S.pySklearn;await py.loadPackage(["scikit-learn"]);$("#pyStatus").textContent=S.pyReady;return py})();
  pyReady.catch(()=>{pyReady=null});return pyReady}
$("#runBtn").onclick=async()=>{const btn=$("#runBtn"),out=$("#pyOut");btn.disabled=true;out.textContent="";
  try{const py=await getPy();py.setStdout({batched:s=>out.textContent+=s+"\n"});py.setStderr({batched:s=>out.textContent+=s+"\n"});await py.runPythonAsync($("#py").value)}
  catch(e){out.textContent+=String(e).split("\n").slice(-3).join("\n");$("#pyStatus").textContent=S.pyCodeError}
  btn.disabled=false};

// 8b: exemplos visuais com matplotlib (so baixa quando o aluno pede)
let vizReady=null;
function getViz(){if(vizReady)return vizReady;
  vizReady=(async()=>{const py=await getPy();$("#pyStatus").textContent=S.vizDownload;
    await py.loadPackage(["matplotlib"]);$("#pyStatus").textContent=S.pyReady;return py})();
  vizReady.catch(()=>{vizReady=null});return vizReady}
const figFail=(boxId,msg)=>{$("#"+boxId).classList.remove("busy");$("#"+boxId).innerHTML=`<div class="figmsg">${msg}</div>`};
async function drawFig(boxId,imgId,code,globals){const box=$("#"+boxId);box.classList.add("busy");
  try{const py=await getViz();for(const g in globals)py.globals.set(g,globals[g]);
    const b64=await py.runPythonAsync(code);
    let img=$("#"+imgId);if(!img){box.innerHTML=`<img id="${imgId}">`;img=$("#"+imgId)}
    img.src="data:image/png;base64,"+b64;box.classList.remove("busy");return true}
  catch(e){console.warn(e);
    figFail(boxId,S.vizFail);
    $("#pyStatus").textContent=S.vizFailStatus;$("#vizBtn").disabled=false;return false}}
const drawKnnFig=()=>drawFig("figKnn","imgKnn",$("#codeKnn").textContent,{k:+$("#slKviz").value});
const drawTreeFig=()=>drawFig("figTree","imgTree",$("#codeTree").textContent,{});
$("#vizBtn").onclick=async()=>{$("#vizBtn").disabled=true;$("#vizWrap").hidden=false;$("#vizNote").textContent=S.vizLoading;
  const ok=await drawKnnFig();if(ok)await drawTreeFig();
  if(ok)$("#vizNote").textContent=S.vizDone};
let kTimer=null;
$("#slKviz").oninput=e=>{$("#vKviz").textContent=e.target.value;clearTimeout(kTimer);kTimer=setTimeout(drawKnnFig,260)};
