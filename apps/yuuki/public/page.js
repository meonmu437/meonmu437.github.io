import {campusSites,innObjects,roomObjects,worldArtworks,campusRoadNodes,campusRoadEdges,seungminLines} from './exploration-data.js';
document.documentElement.dataset.theme='dark';
const inventoryDialog=document.getElementById('inventory-dialog');
const characterDialog=document.getElementById('character-dialog');
const campaignOverlay=document.getElementById('campaign-overlay');
const familyDialog=document.getElementById('family-dialog');
const saveDialog=document.getElementById('save-dialog');
const pageNames={save:'세이브',campus:'캠페인 맵',inventory:'인벤토리',sheet:'캐릭터 시트',inn:'판타지 연구회 여관',rest:'휴식 지점',family:'원거리 통신',continue:'짝사랑의 던전'};
const held=new Set();
let target=null;
const player={x:95,y:235};
const world=document.getElementById('world-map');
const sprite=document.getElementById('world-player');
const nodes=[{id:'save',x:95,y:235,page:'save',name:'세이브 지점'},{id:'campus',x:215,y:235,page:'campus',name:'한국대학교'},{id:'rest',x:360,y:140,page:'rest',name:'유우키의 방'},{id:'family',x:505,y:140,page:'family',name:'원거리 통신'},{id:'continue',x:505,y:235,page:'continue',name:'짝사랑의 던전'}];
nodes.push(...worldArtworks.map(art=>({id:art.id,x:art.x,y:art.y,page:art.id,name:art.title})));
const edges={save:['surf-rabbit'],'surf-rabbit':['save','campus'],campus:['surf-rabbit','bread-otter'],'bread-otter':['campus','rest'],rest:['bread-otter','courier-tiger'],'courier-tiger':['rest','family'],family:['courier-tiger','off-duty-duck'],'off-duty-duck':['family','continue'],continue:['off-duty-duck']};
let atNode='save',journey=null,started=false;
let statueGreeting=null;
const greetedStatues=new Set();
let activeScene='world',innParent='campus',restParent='world',selectedExplore=null,npcConversation=null;
const explorationActors={rest:{x:504,y:264,path:[],stopId:'exit',destination:null},campus:{x:320,y:278,path:[],stopId:'gate',destination:null},inn:{x:328,y:248,path:[],stopId:'exit',destination:null}};
const campusEventState={lastAt:-Infinity,steps:0};
let campusEffectTimer=0,campusEventLocked=false,animalEncounter=null;
let stairEffectTimer=0,stairEventLocked=false;
const exploreDialogue=document.getElementById('exploration-dialogue');
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
function nearest(){return nodes.reduce((best,p)=>Math.hypot(p.x-player.x,p.y-player.y)<Math.hypot(best.x-player.x,best.y-player.y)?p:best,nodes[0]);}
function drawPlayer(){sprite.setAttribute('transform',`translate(${player.x-12} ${player.y-31})`);sprite.dataset.x=player.x.toFixed(2);sprite.dataset.y=player.y.toFixed(2);sprite.dataset.node=atNode;}
function showLocation(){const node=nodes.find(n=>n.id===atNode);if(activeScene==='world')document.getElementById('game-location').textContent=node.name;document.querySelectorAll('.map-node[data-node]').forEach(el=>{if(el.dataset.node===atNode)el.setAttribute('aria-current','location');else el.removeAttribute('aria-current');});}
function stopMoving(){if(statueGreeting){statueGreeting=null;closeWorldArtwork();clearStatueCallMarks();}held.clear();target=null;if(journey){const node=nearest();atNode=node.id;player.x=node.x;player.y=node.y;journey=null;drawPlayer();showLocation();}}
function openPage(id){
 if(campusInputLocked())return;
 const art=worldArtworks.find(art=>art.id===id);if(art){greetedStatues.add(art.id);stopMoving();document.querySelector('.battle-hud').hidden=true;document.querySelector('.hud-quest').hidden=true;exploreDialogue.hidden=false;showArtworkInfo(art,'gallery-close');return;}
 if(id==='campus'||id==='inn'||id==='rest'){stopMoving();enterScene(id,'world');return;}
 if(id==='continue'){stopMoving();campaignOverlay.hidden=false;document.querySelector('[data-dungeon-item][aria-pressed="true"]').focus({preventScroll:true});return;}
 if(id==='family'){stopMoving();if(!familyDialog.open)familyDialog.showModal();return;}
 if(id==='save'){stopMoving();renderSave();saveDialog.hidden=false;document.querySelector('[data-save-record][aria-pressed="true"]').focus({preventScroll:true});return;}
 if(id==='sheet'){stopMoving();if(!characterDialog.open)characterDialog.showModal();return;}
 if(id==='inventory'){stopMoving();if(!inventoryDialog.open)inventoryDialog.showModal();return;}

}
document.querySelectorAll('[data-open-screen]').forEach(button=>{
 button.addEventListener('click',()=>openPage(button.dataset.openScreen));
 if(button.tagName.toLowerCase()==='g')button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();openPage(button.dataset.openScreen);}});
});
const imageDialog=document.getElementById('image-dialog'),image=document.getElementById('large-image');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{image.src=button.dataset.image;image.alt=button.dataset.alt;document.getElementById('image-title').textContent=button.dataset.alt||'이미지 확대';imageDialog.showModal();}));
document.getElementById('close-image').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('close',()=>image.removeAttribute('src'));
imageDialog.addEventListener('click',event=>{if(event.target===imageDialog){const r=imageDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)imageDialog.close();}});
// The title is a separate screen; Enter and the single Continue button enter the world.
function startGame(){if(started)return;started=true;document.getElementById('title-screen').hidden=true;document.getElementById('play-screen').hidden=false;document.querySelector('.game-console').dataset.started='true';enterScene('world');}
document.getElementById('start-game').addEventListener('click',startGame);
document.getElementById('return-title').addEventListener('click',()=>{stopMoving();enterScene('world');started=false;document.getElementById('title-screen').hidden=false;document.getElementById('play-screen').hidden=true;document.querySelector('.game-console').dataset.started='false';document.getElementById('start-game').focus({preventScroll:true});});
function route(from,to){const queue=[[from]],seen=new Set([from]);while(queue.length){const path=queue.shift(),last=path.at(-1);if(last===to)return path;for(const id of edges[last])if(!seen.has(id)){seen.add(id);queue.push([...path,id]);}}return [];}
function travel(id,openAtEnd=false){if(campusInputLocked()||!started||journey||statueGreeting||!edges[id])return;if(id===atNode){if(openAtEnd)openPage(id);return;}if(activeScene==='world')closeWorldArtwork();const stops=route(atNode,id),path=[];for(let i=1;i<stops.length;i++){if((stops[i-1]==='campus'&&stops[i]==='bread-otter')||(stops[i-1]==='bread-otter'&&stops[i]==='campus'))path.push({x:215,y:140});path.push(nodes.find(node=>node.id===stops[i]));}journey={path,openAtEnd,destination:id};}
function inspect(){if(!journey)openPage(atNode);}
world.setAttribute('tabindex','0');
document.querySelectorAll('.map-node[data-node]').forEach(node=>{node.addEventListener('click',()=>travel(node.dataset.node,true));node.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();travel(node.dataset.node,true);}});});
const vectors={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
window.addEventListener('keydown',event=>{
 if(!campaignOverlay.hidden||familyDialog.open||imageDialog.open||inventoryDialog.open||characterDialog.open||!saveDialog.hidden||document.getElementById('skill-dialog').open||event.ctrlKey||event.metaKey||event.altKey||document.querySelector('#jl-site-switch-trigger[aria-expanded="true"]'))return;
 if(!started){if(event.key==='Enter'){event.preventDefault();startGame();}return;}
 if(statueGreeting){if(event.key==='Enter'&&!event.target.closest('button,a')){event.preventDefault();performExploreAction();}else if(vectors[event.key]||event.key==='Escape'){event.preventDefault();}return;}
 if(vectors[event.key]&&event.repeat){event.preventDefault();return;}
 if(activeScene!=='world'){handleExploreKey(event);return;}
 if(vectors[event.key]){event.preventDefault();if(journey)return;const here=nodes.find(n=>n.id===atNode),[vx,vy]=vectors[event.key];const choices=edges[atNode].map(id=>nodes.find(n=>n.id===id)).map(n=>({n,score:((n.x-here.x)*vx+(n.y-here.y)*vy)/Math.hypot(n.x-here.x,n.y-here.y)})).filter(c=>c.score>.3).sort((a,b)=>b.score-a.score);if(choices[0])travel(choices[0].n.id);}
 else if(event.key==='Enter'&&!event.target.closest('button,a')){event.preventDefault();inspect();}
});
let previous=0;
function tick(time){const dt=Math.min((time-previous)/1000,.04);previous=time;updateExploration(dt);if(started&&activeScene==='world'&&journey&&!statueGreeting&&campaignOverlay.hidden&&!familyDialog.open&&!imageDialog.open&&!inventoryDialog.open&&!characterDialog.open&&saveDialog.hidden&&!document.getElementById('skill-dialog').open&&!document.hidden){const next=journey.path[0],dx=next.x-player.x,dy=next.y-player.y,d=Math.hypot(dx,dy),step=170*dt;if(d<=step){player.x=next.x;player.y=next.y;if(next.id)atNode=next.id;journey.path.shift();const greeted=next.id&&!(journey.openAtEnd&&journey.destination===next.id)&&greetPassingStatue(next.id);if(!greeted&&!journey.path.length){const open=journey.openAtEnd;journey=null;showLocation();if(open)openPage(atNode);}}else{player.x+=dx/d*step;player.y+=dy/d*step;}drawPlayer();}requestAnimationFrame(tick);}
drawPlayer();requestAnimationFrame(tick);
const skillData=[['낯가림 Lv.MAX','첫 문장을 몇 번씩 연습하다가, 말을 걸 타이밍을 놓친다.'],['완벽주의','남들 눈에는 같은 것도 서너 번 다시 만든다. 건네지 못한 작은 동물만 늘어난다.'],['덕질 모드','좋아하는 이야기가 나오면 말이 길어진다. 혼자 떠들었다는 사실은 뒤늦게 깨닫는다.'],['자존감과 자존심은 별개','웬만한 일은 양보해도, 공들인 작업을 가볍게 여기는 말에는 물러서지 않는다.']];
const skillDialog=document.getElementById('skill-dialog');
document.querySelectorAll('[data-skill-index]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.skillIndex),[name,text]=skillData[index];document.getElementById('skill-name').textContent=name;document.getElementById('skill-text').textContent=text;document.getElementById('skill-card-index').textContent=String(index+1).padStart(2,'0');document.querySelectorAll('[data-card-icon]').forEach(icon=>icon.hidden=Number(icon.dataset.cardIcon)!==index);stopMoving();if(!skillDialog.open)skillDialog.showModal();}));
document.getElementById('close-skill').addEventListener('click',()=>skillDialog.close());
skillDialog.addEventListener('click',event=>{if(event.target===skillDialog){const r=skillDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)skillDialog.close();}});
// Save only this small game's navigation state in this browser.
const saveKey='yuki-rpg-save-v2';
function readSave(){try{const value=JSON.parse(localStorage.getItem(saveKey)||'null');if(value?.version!==2||!Number.isFinite(value.x)||!Number.isFinite(value.y)||!Number.isFinite(value.time))return null;return value;}catch{return null;}}
function renderSave(){const value=readSave();document.getElementById('load-progress').disabled=!value;document.getElementById('save-slot-detail').textContent=value?new Date(value.time).toLocaleString('ko-KR')+' 저장':'저장된 탐색 위치 없음';}
document.getElementById('save-progress').addEventListener('click',()=>{try{localStorage.setItem(saveKey,JSON.stringify({version:2,x:player.x,y:player.y,scene:activeScene,sceneX:explorationActors[activeScene]?.x,sceneY:explorationActors[activeScene]?.y,time:Date.now()}));renderSave();document.getElementById('save-feedback').textContent='세이브 완료. 아직 못 건넨 마음도, 그대로.';}catch{document.getElementById('save-feedback').textContent='이 브라우저에서는 저장할 수 없습니다.';}});
document.getElementById('load-progress').addEventListener('click',()=>{const value=readSave();if(!value)return;stopMoving();player.x=clamp(value.x,0,640);player.y=clamp(value.y,0,300);const node=nearest();atNode=node.id;player.x=node.x;player.y=node.y;drawPlayer();showLocation();closeSaveWindow();enterScene(['campus','inn','rest'].includes(value.scene)?value.scene:'world');if(activeScene!=='world'&&Number.isFinite(value.sceneX)&&Number.isFinite(value.sceneY)){const actor=explorationActors[activeScene];if(activeScene==='campus'){const key=nearestCampusRoad(value.sceneX,value.sceneY);actor.x=campusRoadNodes[key].x;actor.y=campusRoadNodes[key].y;actor.stopId=campusSites.some(o=>o.id===key)?key:'';}else{const restored=nearestFreeCell(activeScene,value.sceneX,value.sceneY);actor.x=restored.x*16+8;actor.y=restored.y*16+8;}drawExplorationPlayer(activeScene);}});
renderSave();

document.getElementById('close-inventory').addEventListener('click',()=>inventoryDialog.close());
inventoryDialog.addEventListener('click',event=>{if(event.target===inventoryDialog){const r=inventoryDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)inventoryDialog.close();}});

document.getElementById('close-character').addEventListener('click',()=>characterDialog.close());
characterDialog.addEventListener('click',event=>{if(event.target===characterDialog){const r=characterDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)characterDialog.close();}});

document.getElementById('close-save').addEventListener('click',()=>closeSaveWindow());


const questToggle=document.getElementById('quest-toggle');
questToggle.addEventListener('click',()=>{const expanded=questToggle.getAttribute('aria-expanded')!=='true';questToggle.setAttribute('aria-expanded',String(expanded));document.getElementById('quest-content').hidden=!expanded;questToggle.querySelector('span').textContent=expanded?'−':'＋';});

// Campus and clubroom are scenes inside the game screen, not document tabs.
function sceneObjects(scene){return scene==='campus'?campusSites:scene==='rest'?roomObjects:innObjects;}
function sayExplore(name,text,action,npc=false){
 document.querySelector('.game-console').removeAttribute('data-artwork-info');
 if(!npc)npcConversation=null;
 document.querySelector('.game-console').toggleAttribute('data-npc-dialogue',npc);
 document.getElementById('explore-speaker').textContent=name;document.getElementById('explore-text').textContent=text;document.getElementById('explore-text').lang='ko';
 const button=document.getElementById('explore-action');button.hidden=!action;button.dataset.action=action||'';
 const labels={inn:'여관으로 들어가기',campus:'캠퍼스로 나가기',rest:'유우키의 방으로 들어가기',world:'바깥으로 나가기','world-map':'월드 맵으로 돌아가기','gallery-close':'계속 모험하기','statue-continue':'계속 모험하기','statue-inspect':'살펴볼까?','npc-talk':'동아리 회장 승민이 형이다! 말을 걸어볼까?','npc-next':'계속','npc-finish':'대화 마치기'};
 document.getElementById('explore-action-label').textContent=labels[action]||'';
 document.querySelector('.exploration-prompt>.explore-caret').hidden=!!action;
}
function performExploreAction(){if(campusInputLocked())return;const action=document.getElementById('explore-action').dataset.action;if(action==='statue-inspect')inspectCallingStatue();else if(action==='statue-continue')resumeStatueJourney();else if(action==='gallery-close')closeWorldArtwork();else if(action==='world-map')enterScene('world');else if(action==='inn')enterScene('inn','campus');else if(action==='campus')enterScene('campus');else if(action==='rest')enterScene('rest',activeScene);else if(action==='world')enterScene(restParent);else if(action==='npc-talk'){npcConversation={id:'seungmin',index:0};showNpcLine();}else if(action==='npc-next'&&npcConversation){npcConversation.index++;showNpcLine();}else if(action==='npc-finish')finishNpcConversation();}
function showNpcLine(){const index=npcConversation.index;sayExplore('유승민',seungminLines[index],index===seungminLines.length-1?'npc-finish':'npc-next',true);}
function finishNpcConversation(){npcConversation=null;sayExplore('유승민','승민은 다시 룰북으로 시선을 내렸다. 주사위가 손끝에서 또르르 굴렀다.');}
function enterScene(scene,parent='world'){
 if(campusInputLocked())return;
 if(!['world','campus','inn','rest'].includes(scene))return;
 npcConversation=null;document.querySelector('.game-console').removeAttribute('data-npc-dialogue');
 if(scene==='rest')restParent=parent==='campus'?'campus':'world';
 if(scene==='inn')innParent=parent==='campus'?'campus':'world';
 clearCampusEffect();clearStairEffect();
 for(const actor of Object.values(explorationActors)){actor.path=[];actor.destination=null;}
 activeScene=scene;selectedExplore=null;
 document.querySelector('.game-console').dataset.scene=scene;
 document.querySelectorAll('.map-scene').forEach(map=>map.hidden=map.dataset.scene!==scene);
 document.querySelector('.battle-hud').hidden=scene!=='world';exploreDialogue.hidden=scene==='world';document.querySelector('.hud-quest').hidden=scene!=='world';
 const back=document.getElementById('return-scene');back.hidden=scene==='world';back.textContent=(scene==='inn'&&innParent==='campus'||scene==='rest'&&restParent==='campus')?'캠퍼스':'월드맵';

 document.querySelectorAll('[data-inspect]').forEach(el=>el.removeAttribute('aria-current'));
 if(scene==='world'){showLocation();world.focus({preventScroll:true});return;}
 document.getElementById('game-location').textContent=scene==='campus'?'한국대학교':scene==='rest'?'유우키의 방':'여관 · 학관 3F';
 if(scene==='campus')sayExplore('한국대학교','한국대학교다! 낮은 언덕 위의 모험이 시작된다. 건물을 눌러 조사해 보자.');
 else if(scene==='rest')sayExplore('유우키의 방','후문에서 5분, 704호 복층 원룸이다! 좀 쉬다갈까?');
 else sayExplore('판타지 연구회 여관','학생회관 3층, 여관에 들어왔다! 좋아하는 이야기는 끝까지 들어 주는 곳. 사물을 눌러 살펴보자.');
 if(scene==='rest'){const actor=explorationActors.rest,cell=nearestFreeCell(scene,actor.x,actor.y);actor.x=cell.x*16+8;actor.y=cell.y*16+8;}
 drawExplorationPlayer(scene);document.getElementById(scene+'-map').focus({preventScroll:true});
}
document.getElementById('return-scene').addEventListener('click',()=>enterScene(activeScene==='inn'?innParent:activeScene==='rest'?restParent:'world'));
document.getElementById('explore-action').addEventListener('click',performExploreAction);
function inspectScene(scene,id){if(campusInputLocked()||activeScene!==scene)return;const object=sceneObjects(scene).find(o=>o.id===id);if(!object)return;if(object.kind==='npc')npcConversation={id:object.id,index:-1};selectedExplore=object;document.querySelectorAll('[data-inspect]').forEach(el=>{if(el.dataset.owner===scene&&el.dataset.inspect===id)el.setAttribute('aria-current','location');else el.removeAttribute('aria-current');});sayExplore(object.name,object.text,object.action,object.kind==='npc');walkExploreTo(scene,object.x+object.w/2,object.y+object.h+13,id);}
document.querySelectorAll('[data-inspect]').forEach(el=>{el.addEventListener('click',()=>inspectScene(el.dataset.owner,el.dataset.inspect));el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();if(event.repeat)return;if(selectedExplore?.id===el.dataset.inspect&&activeScene===el.dataset.owner&&!document.getElementById('explore-action').hidden)performExploreAction();else inspectScene(el.dataset.owner,el.dataset.inspect);}});});
// Walk on a 16px tile grid. Furniture and building footprints block the route.
function cellFree(scene,x,y){if(x<0||x>=40||y<0||y>=20)return false;const px=x*16+8,py=y*16+8;if(scene==='rest'&&(px<24||px>616||py<80||py>294||(px>=78&&px<=318&&py>=243)||(px===392&&py<104)))return false;if(scene==='inn'&&(px<24||px>616||py<96||py>294))return false;for(const object of sceneObjects(scene)){const solid=scene==='campus'?['building','sports','stage','medical'].includes(object.kind):object.kind!=='door';if(solid&&px>=object.x-3&&px<=object.x+object.w+3&&py>=object.y-(scene==='campus'?10:2)&&py<=object.y+object.h+3)return false;}if(scene==='inn'&&py>=198&&py<=223&&((px>=166&&px<=198)||(px>=413&&px<=445)||(px>=216&&px<=242)||(px>=255&&px<=281)||(px>=317&&px<=343)||(px>=355&&px<=381)))return false;return true;}
function nearestFreeCell(scene,px,py){let best={x:20,y:15},distance=Infinity;for(let y=0;y<20;y++)for(let x=0;x<40;x++)if(cellFree(scene,x,y)){const d=Math.abs(x*16+8-px)+Math.abs(y*16+8-py);if(d<distance){distance=d;best={x,y};}}return best;}
function walkExploreTo(scene,px,py,id){const actor=explorationActors[scene];actor.destination=id;actor.tripMoved=false;if(scene==='campus'){walkCampusTo(id);return;}const start=nearestFreeCell(scene,actor.x,actor.y),end=nearestFreeCell(scene,px,py);const first=start.y*40+start.x,last=end.y*40+end.x,previous=new Int16Array(800).fill(-1),queue=[first];previous[first]=first;for(let i=0;i<queue.length&&previous[last]===-1;i++){const cell=queue[i],x=cell%40,y=Math.floor(cell/40);for(const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]]){const nx=x+dx,ny=y+dy,n=ny*40+nx;if(cellFree(scene,nx,ny)&&(scene!=='rest'||roomStepAllowed(x,y,nx,ny))&&previous[n]===-1){previous[n]=cell;queue.push(n);}}}if(previous[last]===-1){actor.path=[];actor.destination=null;return;}const path=[];for(let n=last;;n=previous[n]){path.push({x:(n%40)*16+8,y:Math.floor(n/40)*16+8});if(n===first)break;}actor.path=path.reverse();actor.tripMoved=Math.hypot(actor.x-px,actor.y-py)>20;}
function drawExplorationPlayer(scene){const actor=explorationActors[scene],element=document.getElementById(scene+'-player');element.setAttribute('transform',`translate(${actor.x-12} ${actor.y-31})`);element.dataset.x=actor.x.toFixed(1);element.dataset.y=actor.y.toFixed(1);element.dataset.stop=actor.stopId||'';element.dataset.destination=actor.destination||'';}
function updateExploration(dt){if((campusInputLocked()&&animalEncounter?.phase!=='fleeing')||!started||activeScene==='world'||document.hidden||!campaignOverlay.hidden||!saveDialog.hidden||document.querySelector('dialog[open]'))return;const actor=explorationActors[activeScene];if(!actor.path.length)return;const next=actor.path[0],dx=next.x-actor.x,dy=next.y-actor.y,d=Math.hypot(dx,dy),step=(animalEncounter?.phase==='fleeing'?320:180)*dt;if(d<=step){actor.x=next.x;actor.y=next.y;actor.path.shift();if(activeScene==='rest'&&d>0&&actor.x===392&&actor.y===104&&Math.random()<.35){showStairEvent();drawExplorationPlayer(activeScene);return;}if(!actor.path.length&&animalEncounter?.phase==='fleeing')finishAnimalFlight();else if(!actor.path.length&&actor.destination)arriveExplore(activeScene);}else{actor.x+=dx/d*step;actor.y+=dy/d*step;}drawExplorationPlayer(activeScene);}
function handleExploreKey(event){if(campusInputLocked())return;if(npcConversation&&npcConversation.index>=0){if(event.key==='Escape'){event.preventDefault();finishNpcConversation();return;}if(vectors[event.key]){event.preventDefault();return;}}if((event.key==='Enter'||event.key===' ')&&!event.target.closest('button,a')&&!document.getElementById('explore-action').hidden){event.preventDefault();if(!event.repeat)performExploreAction();return;}const actor=explorationActors[activeScene];if(event.key==='Escape'){event.preventDefault();enterScene(activeScene==='inn'?innParent:activeScene==='rest'?restParent:'world');return;}if(vectors[event.key]){event.preventDefault();if(actor.path.length||event.repeat)return;const [vx,vy]=vectors[event.key];const choices=sceneObjects(activeScene).filter(o=>o.id!==actor.stopId).map(object=>{const point=stopPoint(activeScene,object),dx=point.x-actor.x,dy=point.y-actor.y,distance=Math.hypot(dx,dy),dot=distance?(dx*vx+dy*vy)/distance:0;return {object,distance,dot,score:distance/Math.max(.1,dot*dot)};}).filter(c=>c.distance>8&&c.dot>.45).sort((a,b)=>a.score-b.score);if(choices[0])inspectScene(activeScene,choices[0].object.id);}else if(event.key==='Enter'&&!event.target.closest('button,a')){event.preventDefault();const object=sceneObjects(activeScene).find(o=>o.id===actor.stopId)||sceneObjects(activeScene)[0];inspectScene(activeScene,object.id);}}
function stopPoint(scene,object){if(scene==='campus')return campusRoadNodes[object.id];const cell=nearestFreeCell(scene,object.x+object.w/2,object.y+object.h+13);return {x:cell.x*16+8,y:cell.y*16+8};}
function nearestCampusRoad(x,y){return Object.keys(campusRoadNodes).reduce((best,key)=>Math.hypot(campusRoadNodes[key].x-x,campusRoadNodes[key].y-y)<Math.hypot(campusRoadNodes[best].x-x,campusRoadNodes[best].y-y)?key:best);}
function walkCampusTo(id){const actor=explorationActors.campus,start=nearestCampusRoad(actor.x,actor.y),queue=[[start]],seen=new Set([start]);let route=[];for(let i=0;i<queue.length;i++){const path=queue[i],last=path.at(-1);if(last===id){route=path;break;}for(const [a,b] of campusRoadEdges){const next=a===last?b:b===last?a:null;if(next&&!seen.has(next)){seen.add(next);queue.push([...path,next]);}}}if(!route.length){actor.destination=null;return;}actor.path=route.map(key=>({...campusRoadNodes[key]}));actor.tripMoved=actor.stopId!==id&&Math.hypot(actor.x-campusRoadNodes[id].x,actor.y-campusRoadNodes[id].y)>20;drawExplorationPlayer('campus');}
function arriveExplore(scene){const actor=explorationActors[scene],object=sceneObjects(scene).find(o=>o.id===actor.destination),moved=actor.tripMoved;actor.stopId=actor.destination;actor.destination=null;if(!object)return;if(object.kind==='npc')return;sayExplore(object.name,object.text,object.action);if(scene==='campus'&&moved)maybeCampusEvent();}
function clearCampusEffect(){animalEncounter=null;document.getElementById('animal-event-choices').hidden=true;document.getElementById('campus-player').classList.remove('hero-fleeing');document.querySelector('.game-console').removeAttribute('data-animal-phase');campusEventLocked=false;clearTimeout(campusEffectTimer);document.getElementById('campus-effects').replaceChildren();document.querySelector('.console-screen').classList.remove('hiccup-shake');delete document.querySelector('.game-console').dataset.campusEvent;}
function maybeCampusEvent(){campusEventState.steps++;const now=Date.now();if(now-campusEventState.lastAt<3000)return;if(campusEventState.steps<5&&Math.random()>=.4)return;campusEventState.lastAt=now;campusEventState.steps=0;const kind=Math.random()<.5?'trap':'hiccup';clearCampusEffect();campusEventLocked=true;document.querySelector('.game-console').dataset.campusEvent=kind;if(kind==='trap'){animalEncounter={phase:'effect'};document.querySelector('.game-console').dataset.animalPhase='effect';sayExplore('⚠️ 이벤트 트랩 발동!','길목에 손톱만 한 동물들이 출현했다!\n자세히 보니 어쩐지 하나같이 user를 닮았다.');const layer=document.getElementById('campus-effects');for(let i=0;i<11;i++){const heart=document.createElementNS('http://www.w3.org/2000/svg','svg');heart.setAttribute('viewBox','0 0 16 16');heart.setAttribute('class','campus-pixel-heart');heart.style.left=[9,22,38,53,71,87,16,34,62,79,48][i]+'%';heart.style.top=[17,45,22,52,20,40,70,64,72,64,10][i]+'%';heart.style.setProperty('--heart-delay',i*55+'ms');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M2 2h4v2h4V2h4v2h2v6h-2v2h-2v2h-2v2H6v-2H4v-2H2v-2H0V4h2Z');path.setAttribute('fill',i%2?'#e8a4a7':'#d78391');const shine=document.createElementNS('http://www.w3.org/2000/svg','path');shine.setAttribute('d','M2 4h3v2H2z');shine.setAttribute('fill','#ffe3c1');heart.append(path,shine);layer.append(heart);}}else{sayExplore('상태 이상 · 긴장성 딸꾹질','긴장 수치가 너무 높다!\n말을 꺼내려던 순간, 딸꾹! 문장이 잠시 중단되었다.');document.querySelector('.console-screen').classList.add('hiccup-shake');}campusEffectTimer=setTimeout(kind==='trap'?showAnimalChoices:clearCampusEffect,2300);}

function campusInputLocked(){return (activeScene==='campus'&&campusEventLocked)||(activeScene==='rest'&&stairEventLocked);}
// Ignore inputs during the effect; do not queue them for after it ends.
window.addEventListener('keydown',event=>{
 if(!campusInputLocked()||event.ctrlKey||event.metaKey||event.altKey)return;
 if(activeScene==='campus'&&['choice','result'].includes(animalEncounter?.phase)){
  const buttons=[...document.querySelectorAll('#animal-event-choices button')].filter(b=>!b.hidden&&!b.disabled);
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Enter',' '].includes(event.key)){
   event.preventDefault();event.stopImmediatePropagation();if(event.repeat)return;
   const index=buttons.indexOf(document.activeElement);
   if(event.key==='Enter'||event.key===' ')buttons[Math.max(0,index)]?.click();
   else{const reverse=event.key==='ArrowLeft'||event.key==='ArrowUp'||(event.key==='Tab'&&event.shiftKey);buttons[(Math.max(0,index)+(reverse?-1:1)+buttons.length)%buttons.length]?.focus({preventScroll:true});}
   return;
  }
 }
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter',' ','Escape'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();}
},true);
document.addEventListener('click',event=>{
 if(!campusInputLocked()||!(event.target instanceof Element)||!event.target.closest('.game-console'))return;
 const choice=event.target.closest('[data-animal-choice]');
 if(activeScene==='campus'&&['choice','result'].includes(animalEncounter?.phase)&&choice&&!choice.disabled&&!choice.hidden)return;
 event.preventDefault();event.stopImmediatePropagation();
},true);

document.getElementById('close-family').addEventListener('click',()=>familyDialog.close());
document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-contact]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelectorAll('[data-contact-panel]').forEach(panel=>panel.hidden=panel.dataset.contactPanel!==button.dataset.contact);
}));
familyDialog.addEventListener('click',event=>{if(event.target===familyDialog){const r=familyDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)familyDialog.close();}});

function closeCampaign(){campaignOverlay.hidden=true;document.getElementById('world-map').focus({preventScroll:true});}
document.getElementById('close-campaign').addEventListener('click',closeCampaign);
window.addEventListener('keydown',event=>{if(campaignOverlay.hidden)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();const items=[...campaignOverlay.querySelectorAll('[data-dungeon-item]')],index=items.findIndex(b=>b.getAttribute('aria-pressed')==='true'),next=(index+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+items.length)%items.length;selectDungeonItem(items[next]);items[next].focus({preventScroll:true});return;}if(event.key==='Escape'){event.preventDefault();closeCampaign();}else if(event.key==='Tab'){const links=[...campaignOverlay.querySelectorAll('button:not(:disabled),a[href]')].filter(el=>el.getClientRects().length);const first=links[0],last=links.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});

// The loft boundary is crossed only at the top of the visible staircase.
function roomStepAllowed(x,y,nx,ny){
 const a={x:x*16+8,y:y*16+8},b={x:nx*16+8,y:ny*16+8};
 const loft=p=>p.x>=408&&p.y<=184;
 const stair=p=>p.x===392&&p.y>=104&&p.y<=184;
 const top=(a.x===392&&b.x===408||a.x===408&&b.x===392)&&a.y===104&&b.y===104;
 if(loft(a)!==loft(b))return top;
 if(stair(a)!==stair(b)){
  if(top)return true;
  const s=stair(a)?a:b,g=stair(a)?b:a;
  return s.y===184&&(g.y===200&&g.x===392||g.y===184&&g.x===376);
 }
 return true;
}
function clearStairEffect(){clearTimeout(stairEffectTimer);stairEventLocked=false;document.querySelector('.console-screen').classList.remove('hiccup-shake');delete document.querySelector('.game-console').dataset.stairEvent;}
function showStairEvent(){
 stairEventLocked=true;document.querySelector('.game-console').dataset.stairEvent='cushion';
 sayExplore('천장 충돌 회피!','천장에 머리를 부딪힐 뻔했다! 직접 붙여 둔 쿠션 덕분에 살았다. 피해량: 0.');
 document.querySelector('.console-screen').classList.add('hiccup-shake');
 stairEffectTimer=setTimeout(()=>{
  clearStairEffect();const actor=explorationActors.rest;
  if(activeScene==='rest'&&!actor.path.length&&actor.destination)arriveExplore('rest');
 },2300);
}

function closeWorldArtwork(){if(activeScene!=='world')return;exploreDialogue.hidden=true;document.querySelector('.battle-hud').hidden=false;document.querySelector('.hud-quest').hidden=false;}

function setAnimalButtons(phase){
 const choices=document.getElementById('animal-event-choices');choices.hidden=false;
 choices.querySelectorAll('button').forEach(button=>{const done=button.dataset.animalChoice==='continue';button.hidden=phase==='choice'?done:!done;button.disabled=false;});
 document.getElementById('explore-action').hidden=true;document.querySelector('.exploration-prompt>.explore-caret').hidden=true;
 choices.querySelector('button:not([hidden])')?.focus({preventScroll:true});
}
function showAnimalChoices(){
 if(activeScene!=='campus'||!animalEncounter)return;
 document.getElementById('campus-effects').replaceChildren();animalEncounter.phase='choice';document.querySelector('.game-console').dataset.animalPhase='choice';setAnimalButtons('choice');
}
function finishAnimalFlight(){
 const actor=explorationActors.campus;actor.stopId=campusSites.some(o=>o.id===animalEncounter.targetKey)?animalEncounter.targetKey:'';actor.destination=null;
 document.getElementById('campus-player').classList.remove('hero-fleeing');animalEncounter.phase='result';document.querySelector('.game-console').dataset.animalPhase='result';setAnimalButtons('result');
}
function chooseAnimalEvent(choice){
 if(activeScene!=='campus'||!animalEncounter)return;
 if(choice==='continue'&&animalEncounter.phase==='result'){
  clearCampusEffect();document.querySelector('.exploration-prompt>.explore-caret').hidden=false;document.getElementById('campus-map').focus({preventScroll:true});return;
 }
 if(animalEncounter.phase!=='choice'||!['look','ignore'].includes(choice))return;
 document.getElementById('animal-event-choices').hidden=true;
 if(choice==='ignore'){
  animalEncounter.phase='result';document.querySelector('.game-console').dataset.animalPhase='result';
  sayExplore('유우키','「……でも、見てほしかったな。」\n(……그래도, 봐줬으면 좋았을 텐데.)');document.getElementById('explore-text').lang='ja';setAnimalButtons('result');return;
 }
 animalEncounter.phase='fleeing';document.querySelector('.game-console').dataset.animalPhase='fleeing';
 sayExplore('용사가 도망쳤다!','작품을 자세히 들여다보자, 용사가 새빨개져 도망쳤다! 도주 판정: 대성공.');
 const actor=explorationActors.campus;let key=nearestCampusRoad(actor.x,actor.y),distance=0;const seen=new Set([key]),path=[];
 while(distance<100){
  const next=campusRoadEdges.flatMap(([a,b])=>a===key?[b]:b===key?[a]:[]).find(id=>!seen.has(id));if(!next)break;
  distance+=Math.hypot(campusRoadNodes[next].x-campusRoadNodes[key].x,campusRoadNodes[next].y-campusRoadNodes[key].y);path.push({...campusRoadNodes[next]});seen.add(next);key=next;
 }
 actor.path=path;actor.destination=null;animalEncounter.targetKey=key;document.getElementById('campus-player').classList.add('hero-fleeing');
 if(!path.length)finishAnimalFlight();
}
document.querySelectorAll('[data-animal-choice]').forEach(button=>button.addEventListener('click',()=>chooseAnimalEvent(button.dataset.animalChoice)));

function closeSaveWindow(){saveDialog.hidden=true;document.querySelector('.game-save-button').focus({preventScroll:true});}
function selectSaveRecord(button){
 document.querySelectorAll('[data-save-record]').forEach(row=>row.setAttribute('aria-pressed',String(row===button)));
 document.getElementById('save-record-description').textContent=button.dataset.saveDescription;
}
document.querySelectorAll('[data-save-record]').forEach(button=>button.addEventListener('click',()=>selectSaveRecord(button)));
saveDialog.addEventListener('click',event=>{if(event.target===saveDialog)closeSaveWindow();});
window.addEventListener('keydown',event=>{
 if(saveDialog.hidden)return;
 if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeSaveWindow();return;}
 const rows=[...saveDialog.querySelectorAll('[data-save-record]')];
 if(['ArrowUp','ArrowDown'].includes(event.key)){
  event.preventDefault();event.stopImmediatePropagation();const index=rows.findIndex(row=>row.getAttribute('aria-pressed')==='true'),next=(index+(event.key==='ArrowUp'?-1:1)+rows.length)%rows.length;
  selectSaveRecord(rows[next]);rows[next].focus({preventScroll:true});return;
 }
 if(event.key==='Tab'){
  const buttons=[...saveDialog.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
},true);

function clearStatueCallMarks(){document.querySelectorAll('.world-artwork.statue-calling').forEach(el=>el.classList.remove('statue-calling'));}
function greetPassingStatue(id){
 const art=worldArtworks.find(art=>art.id===id);if(!art||greetedStatues.has(id))return false;
 greetedStatues.add(id);statueGreeting={id};clearStatueCallMarks();document.querySelector(`.world-artwork[data-node="${id}"]`)?.classList.add('statue-calling');
 document.querySelector('.battle-hud').hidden=true;document.querySelector('.hud-quest').hidden=true;exploreDialogue.hidden=false;
 sayExplore(art.title,'「'+art.greeting+'」','statue-inspect');document.getElementById('explore-action-label').textContent=art.caller+((art.caller.charCodeAt(art.caller.length-1)-0xac00)%28?'이':'가')+' 말을 걸었다! 살펴볼까?';showLocation();return true;
}
function resumeStatueJourney(){
 if(!statueGreeting)return;statueGreeting=null;clearStatueCallMarks();closeWorldArtwork();
 if(journey&&!journey.path.length){const open=journey.openAtEnd;journey=null;showLocation();if(open)openPage(atNode);}
 world.focus({preventScroll:true});
}

function inspectCallingStatue(){
 if(!statueGreeting)return;const art=worldArtworks.find(art=>art.id===statueGreeting.id);if(!art)return;
 statueGreeting.inspected=true;clearStatueCallMarks();showArtworkInfo(art,'statue-continue');
}

function showArtworkInfo(art,action){
 sayExplore('《'+art.title+'》',art.text,action);
 document.querySelector('.game-console').setAttribute('data-artwork-info','');
 const facts=document.createElement('span');facts.className='artwork-facts';
 const credit=document.createElement('span');credit.textContent='제작자: '+art.maker+' · 제작 시기: '+art.created;
 const materials=document.createElement('span');materials.textContent='재료: '+art.materials;
 facts.append(credit,materials);document.getElementById('explore-text').append(facts);
}

function selectDungeonItem(button){
 campaignOverlay.querySelectorAll('[data-dungeon-item]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 campaignOverlay.querySelector('.dungeon-item-window').dataset.itemTheme=button.dataset.dungeonItem;
 document.getElementById('dungeon-selected-name').textContent=button.dataset.itemName;document.getElementById('dungeon-selected-description').textContent=button.dataset.itemDescription;
 const available=button.dataset.dungeonItem==='univers';document.getElementById('dungeon-enter').hidden=!available;document.getElementById('dungeon-locked').hidden=available;
}
document.querySelectorAll('[data-dungeon-item]').forEach(button=>button.addEventListener('click',()=>selectDungeonItem(button)));
