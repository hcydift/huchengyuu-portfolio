const ASSETS = 'assets/';
const projects = [
  {id:'leafwell',number:'01',name:'LEAFWELL',title:'Transpiration-based Water Collection',type:'Product · Sustainable Design',description:'A portable water collection concept for semi-arid regions, exploring plant transpiration, condensation and a modular collection structure.',count:8,pages:['Overview','Context & inspiration','User research & transpiration','Collection experiments','Design development','Prototype & monitoring','Product details','Scenarios & use'],nodes:['1:456','1:280','1:473','1:769','1:713','1:10628','1:219','1:254']},
  {id:'tracescape',number:'02',name:'TRACE SCAPE',title:'Crime Scene Capture & VR Review',type:'Product · VR & System Design',description:'An integrated concept combining folding drones, a portable equipment case and immersive VR review to support digital crime scene investigation.',count:10,pages:['Overview','Background & inspiration','Interviews & product analysis','Technology & system workflow','Form development','Drone structure','Equipment & system details','VR review','Interface design','System reflection'],nodes:['1:1201','1:1221','1:1354','1:2173','1:1611','1:1713','1:1814','1:1838','1:1877','1:11483']},
  {id:'island',number:'03',name:'Island of Discovery',title:'A Hybrid Exploration Board Game',type:'Service · Interaction Design',description:'A hybrid board game that connects campus exploration, task cards and a shared digital board, encouraging young children to create, cooperate and discover the physical world.',count:8,pages:['Overview','Background research','User research & workshop','Stakeholders & concepts','Gameplay & storyboard','Card system','Devices & interface','Playtesting & reflection'],nodes:['1:1338','1:2274','1:2528','1:2880','1:11811','1:3373','1:11142','1:3776']},
  {id:'portrait',number:'04',name:'Fragmented Portrait',title:'An Installation on Digital Identity',type:'Installation · Interaction · Creative Coding',description:'An interactive installation that captures and fragments body and facial information to reconstruct digital portraits, making the accumulation of personal data visible.',count:6,pages:['Overview','Inspiration & visual power','User research','Theoretical research','TouchDesigner & camera prototypes','Final exhibition'],nodes:['1:3893','1:3906','1:3953','1:5231','1:10751','1:10613']}
];
const archives = [
  {id:'tulip',number:'A01',name:'Tulip',title:'Kitchen Utensils & CMF',description:'An exploration of botanical forms, everyday kitchen tools and coordinated color palettes.',file:'archive-01.webp',node:'1:11050'},
  {id:'cloud-hub',number:'A02',name:'Cloud Hub',title:'Autonomous Delivery Service System',description:'A delivery system connecting a central hub, drones, delivery robots and reusable food boxes.',file:'archive-02.webp',node:'1:10944'},
  {id:'characters',number:'A03',name:'Objects & Identities',title:'Luma Bin · DADA · Lucky Suichuan',description:'A collection of product concepts, mascot design and collaborative tourism branding.',file:'archive-03.webp',node:'1:10983'},
  {id:'form-structure',number:'A04',name:'Form & Structure',title:'Furniture & Model Explorations',description:'Further explorations in furniture structure, physical modeling and form development.',file:'archive-04.webp',node:'1:11025'}
];
const profile = {id:'profile',number:'INFO',name:'Chengyu Hu',title:'Full Profile',description:'Education, project experience, recognition and professional skills, as presented in the portfolio.',file:'about-board.webp',node:'1:1091'};
const allProjects = [...projects,...archives,profile];
const dialog = document.querySelector('#case-dialog');
const scrollArea = document.querySelector('#case-scroll');
const stack = document.querySelector('#board-stack');
const pageIndex = document.querySelector('#page-index');
const indexToggle = document.querySelector('#board-index-toggle');
const zoomDialog = document.querySelector('#zoom-dialog');
const zoomImage = document.querySelector('#zoom-image');
let currentProject = null;
let lastFocus = null;
let zoom = 1;
let zoomBoard = null;
let scrollTick = false;

function boardsFor(project) {
  if (project.file) return [{src:ASSETS+project.file,title:project.title,width:2953,height:1316}];
  return project.pages.map((title,i)=>({src:ASSETS+project.id+'-'+String(i+1).padStart(2,'0')+'.webp',title,width:project.id==='leafwell'&&i===7?2400:2953,height:project.id==='leafwell'&&i===7?1070:1316}));
}
function createProjectCard(project) {
  const button = document.createElement('button');
  button.className = 'project-card';
  button.dataset.project = project.id;
  button.setAttribute('aria-label',project.name+' — '+project.title+'. View '+project.count+' portfolio boards.');
  const visual = project.id==='leafwell'
    ? '<div class="project-visual leaf-cover"><img src="assets/leaf-background-art.webp" alt="" loading="lazy"><img class="leaf-product" src="assets/leaf-product-art.webp" alt="LEAFWELL water collector" loading="lazy"></div>'
    : '<div class="project-visual"><img src="assets/'+({tracescape:'trace-art',island:'island-art',portrait:'hero-art'}[project.id])+'.webp" alt="'+project.name+'" loading="lazy"></div>';
  button.innerHTML=visual+'<div class="project-shade"></div><div class="project-caption"><div><div class="project-meta"><span>'+project.number+'</span><i></i><strong>'+project.name+'</strong></div><h3>'+project.title+'</h3></div><span class="view-link">VIEW →</span></div>';
  const preload=()=>{boardsFor(project).slice(0,2).forEach(board=>{const img=new Image();img.src=board.src;});};
  button.addEventListener('pointerenter',preload,{once:true});
  button.addEventListener('focus',preload,{once:true});
  return button;
}
projects.forEach(project=>document.querySelector('#projects').append(createProjectCard(project)));
archives.forEach(project=>{
  const button=document.createElement('button');
  button.className='archive-card';button.dataset.project=project.id;
  button.setAttribute('aria-label',project.name+' — '+project.title+'. View portfolio board.');
  button.innerHTML='<div class="archive-picture"><img src="'+ASSETS+project.file+'" alt="'+project.title+'" loading="lazy" width="2953" height="1316"></div><div class="archive-caption"><div><h3>'+project.name+'</h3><p>'+project.title+'</p></div><span aria-hidden="true">↗</span></div>';
  document.querySelector('#archive-grid').append(button);
});
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.project)));

function openProject(id,updateHistory=true) {
  const project=allProjects.find(p=>p.id===id);if(!project)return;
  if(!dialog.open)lastFocus=document.activeElement;
  currentProject=project;
  const boards=boardsFor(project);
  document.querySelector('#case-title').textContent=project.name;
  document.querySelector('#case-number').textContent=project.number;
  document.querySelector('#case-description').replaceChildren();
  const description=document.createElement('p');description.textContent=project.description;
  const hint=document.createElement('span');hint.textContent='CLICK A BOARD TO ZOOM ↗';
  document.querySelector('#case-description').append(description,hint);
  stack.replaceChildren();pageIndex.replaceChildren();
  boards.forEach((board,i)=>{
    const figure=document.createElement('figure');figure.className='board';figure.id='board-'+i;
    const button=document.createElement('button');button.className='board-button';
    button.setAttribute('aria-label','Enlarge '+project.name+' — page '+(i+1)+': '+board.title);
    const img=document.createElement('img');img.src=board.src;img.alt=project.name+' / '+String(i+1).padStart(2,'0')+' — '+board.title;img.width=board.width;img.height=board.height;img.decoding='async';img.loading=i===0?'eager':'lazy';
    const caption=document.createElement('figcaption');caption.textContent=String(i+1).padStart(2,'0')+' / '+boards.length+' · ENLARGE ↗';
    button.append(img);button.addEventListener('click',()=>openZoom(board,project.name+' / '+String(i+1).padStart(2,'0')+' — '+board.title));figure.append(button,caption);stack.append(figure);
    const jump=document.createElement('button');jump.innerHTML='<span>'+String(i+1).padStart(2,'0')+'</span>'+board.title;
    jump.addEventListener('click',()=>{figure.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});toggleIndex(false);});pageIndex.append(jump);
  });
  const end=document.querySelector('#case-end');end.replaceChildren();
  const close=document.createElement('button');close.textContent='← BACK TO WORKS';close.addEventListener('click',()=>closeProject());end.append(close);
  const nextProject=projects.includes(project)?projects[(projects.indexOf(project)+1)%projects.length]:archives[(archives.indexOf(project)+1+archives.length)%archives.length];
  if(nextProject){const next=document.createElement('button');next.innerHTML='NEXT PROJECT →<span class="end-title">'+nextProject.name+'</span>';next.addEventListener('click',()=>openProject(nextProject.id));end.append(next);}
  document.querySelector('#page-count').textContent='01 / '+String(boards.length).padStart(2,'0');
  toggleIndex(false);scrollArea.scrollTop=0;
  if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open');}
  if(updateHistory&&location.hash!=='#project-'+id)history.pushState({project:id},'', '#project-'+id);
  document.title=project.name+' — Chengyu Hu';
  document.querySelector('.close-case').focus({preventScroll:true});
}
function closeProject(updateHistory=true) {
  if(zoomDialog.open)zoomDialog.close();
  if(dialog.open)dialog.close();
  document.body.classList.remove('modal-open');currentProject=null;
  document.title='Chengyu Hu — Design Portfolio';
  if(updateHistory&&location.hash.startsWith('#project-'))history.replaceState(null,'',location.pathname+location.search+'#works');
  lastFocus?.focus({preventScroll:true});
}
function toggleIndex(value) {const show=value??pageIndex.hidden;pageIndex.hidden=!show;indexToggle.setAttribute('aria-expanded',String(show));}
indexToggle.addEventListener('click',()=>toggleIndex());
document.querySelector('.close-case').addEventListener('click',()=>closeProject());
dialog.addEventListener('cancel',event=>{event.preventDefault();closeProject();});
scrollArea.addEventListener('scroll',()=>{
  if(scrollTick)return;scrollTick=true;
  requestAnimationFrame(()=>{
    if(currentProject){const figures=[...stack.children];const top=scrollArea.getBoundingClientRect().top+90;let active=0;figures.forEach((figure,i)=>{if(figure.getBoundingClientRect().top<=top)active=i;});document.querySelector('#page-count').textContent=String(active+1).padStart(2,'0')+' / '+String(figures.length).padStart(2,'0');}
    scrollTick=false;
  });
},{passive:true});

function openZoom(board,caption) {
  zoomBoard=board;zoom=1;zoomImage.src=board.src;zoomImage.alt=caption;document.querySelector('#zoom-caption').textContent=caption;updateZoom();zoomDialog.showModal();document.querySelector('#zoom-close').focus();
}
function updateZoom(){zoom=Math.max(1,Math.min(5,zoom));zoomImage.style.setProperty('--zoom-width',(zoom*100)+'%');document.querySelector('#zoom-reset').textContent=Math.round(zoom*100)+'%';document.querySelector('#zoom-minus').disabled=zoom<=1;document.querySelector('#zoom-plus').disabled=zoom>=5;zoomImage.style.cursor=zoom===1?'zoom-in':'zoom-out';if(zoom===1){document.querySelector('#zoom-viewport').scrollTop=0;document.querySelector('#zoom-viewport').scrollLeft=0;}}
document.querySelector('#zoom-plus').addEventListener('click',()=>{zoom+=.5;updateZoom();});
document.querySelector('#zoom-minus').addEventListener('click',()=>{zoom-=.5;updateZoom();});
document.querySelector('#zoom-reset').addEventListener('click',()=>{zoom=1;updateZoom();});
document.querySelector('#zoom-close').addEventListener('click',()=>zoomDialog.close());
zoomImage.addEventListener('click',()=>{zoom=zoom===1?2:1;updateZoom();});
zoomDialog.addEventListener('cancel',event=>{event.preventDefault();zoomDialog.close();});
document.addEventListener('keydown',event=>{
  if(zoomDialog.open&&['+','=','-','0'].includes(event.key)){event.preventDefault();zoom=event.key==='0'?1:zoom+(event.key==='-'?-.5:.5);updateZoom();}
});
function syncRoute(){const id=location.hash.startsWith('#project-')?location.hash.slice(9):null;if(id&&allProjects.some(p=>p.id===id))openProject(id,false);else if(dialog.open)closeProject(false);}
window.addEventListener('popstate',syncRoute);window.addEventListener('hashchange',syncRoute);syncRoute();
const header=document.querySelector('#header');
function updateHeader(){header.classList.toggle('visible',window.scrollY>100);}
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
document.querySelector('#copy-wechat').addEventListener('click',async()=>{
  const status=document.querySelector('#copy-status');
  try{await navigator.clipboard.writeText('HUCY4231');status.textContent='Copied';}catch{status.textContent='WeChat ID: HUCY4231';}
});
