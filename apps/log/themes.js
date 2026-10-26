// 카드 장식은 Canvas에 직접 그려 미리보기와 저장 이미지에 함께 반영한다.
const cardThemes = {
 plain:{label:'무늬 없는 기본 카드',heading:'"Noto Sans KR",sans-serif'},
 julian:{label:'무지개 테이프의 영화 자막 카드',heading:'Georgia,serif'},
 jude:{label:'벨윅 호텔 투숙객 리뷰',heading:'Georgia,serif'},
 seungmin:{label:'개발자의 터미널',heading:'monospace'},
 willow:{label:'레인폴 대학교 학생 기록',heading:'"Noto Sans KR",sans-serif'},
 '1997':{label:'미대생의 연필 스케치북',heading:'"Noto Serif KR",serif'},
 '2004':{label:'윈도우 2000 메모장',heading:'"Noto Sans KR",sans-serif'},
 hanminwoo:{label:'푸른 포인트의 영화 슬레이트',heading:'"Noto Serif KR",serif'},
 colorground:{label:'무지개 애니메이션 스티커',heading:'"Noto Sans KR",sans-serif'},
 nighthighway:{label:'밤의 로드트립 여행 기록',heading:'monospace'},
 anemoi:{label:'빅토리아풍 편지지',heading:'"Noto Serif KR",serif'},
 yunhaesi:{label:'낮의 바다와 별이 박힌 밤하늘',heading:'"Noto Serif KR",serif'}
};
const lightAccents={julian:'#315e95',jude:'#80602f',seungmin:'#238b57',willow:'#2c6147','1997':'#87516c','2004':'#587a99',hanminwoo:'#426f83',colorground:'#b33659',nighthighway:'#996321',anemoi:'#677755',yunhaesi:'#3e7b91'};
const darkAccents={julian:'#8bbcff',jude:'#d5b67b',seungmin:'#2dd280',willow:'#d5ba75','1997':'#e3abc6','2004':'#a2c9e6',hanminwoo:'#8bacbd',colorground:'#ed9db7',nighthighway:'#dfae62',anemoi:'#c2c99e',yunhaesi:'#9fcbd9'};
function themePalette(p,mode){
 const dark=mode==='dark';
 if(p.theme==='plain'){
  const luminance=hex=>hex.slice(1).match(/../g).map(value=>{const c=parseInt(value,16)/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;}).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
  const bg=luminance(p.paper),contrast=color=>{const l=luminance(color);return (Math.max(bg,l)+.05)/(Math.min(bg,l)+.05);};
  const point=['#194575','#abd4ff'].sort((a,b)=>contrast(b)-contrast(a))[0],ink=['#343943','#e1e6ef'].sort((a,b)=>contrast(b)-contrast(a))[0];
  return {...p,mode,ink,accent:point,decoration:point};
 }
 if(p.theme==='yunhaesi')return {...p,mode,paper:dark?'#151e35':'#f2fbfc',ink:dark?'#d0d9e9':'#42616d',accent:dark?'#e3d4a4':'#28778b',decoration:dark?'#c6d6ef':'#6eafbd'};
 if(p.theme==='anemoi')return {...p,mode,paper:dark?'#29252b':'#fbf5e8',ink:dark?'#d9cfc5':'#655447',accent:dark?'#dfc29b':'#8a614d',decoration:dark?'#c4a275':'#a68858'};
 if(p.theme==='nighthighway')return {...p,mode,paper:dark?'#19232b':'#f8f3e7',ink:dark?'#d5d9db':'#4e5758',accent:dark?'#efc781':'#8d5930',decoration:dark?'#efc781':'#ac753f'};
 if(p.theme==='colorground')return {...p,mode,paper:dark?'#202b43':'#fffdf5',ink:dark?'#e0e5ed':'#49506b',accent:dark?'#ffb8ce':'#cb4b79',decoration:dark?'#ffcf66':'#e4a52b'};
 if(p.theme==='hanminwoo'&&!dark)return {...p,mode,paper:'#ffffff',ink:'#534d43',accent:lightAccents.hanminwoo,decoration:lightAccents.hanminwoo};
 if(p.theme==='2004')return {...p,mode,paper:dark?'#202328':'#ffffff',ink:dark?'#d8dde4':'#35383d',accent:dark?'#a4bde6':'#0a246a',decoration:dark?'#a4bde6':'#0a246a'};
 if(p.theme==='1997')return {...p,mode,paper:dark?'#292824':'#faf6eb',ink:dark?'#d7d0c2':'#514b43',accent:dark?'#d9bc80':'#79613e',decoration:dark?'#d9bc80':'#79613e'};
 return {...p,mode,paper:dark?({julian:'#14151a',seungmin:'#0d1117',jude:'#182321',hanminwoo:'#18232b',nighthighway:'#181e23'}[p.theme]||'#1c2527'):({julian:'#ffffff',seungmin:'#ffffff',jude:'#f3ead6',hanminwoo:'#edf4f5',nighthighway:'#f0e7d4'}[p.theme]||p.paper),ink:p.theme==='seungmin'?(dark?'#c9d1d9':'#24292f'):(dark?'#c7ccd0':'#534d43'),accent:(dark?darkAccents:lightAccents)[p.theme],decoration:p.theme==='julian'?(dark?'#8bbcff':'#315e95'):(dark?darkAccents:lightAccents)[p.theme]};
}
function drawCardTheme(ctx,p,height,bodyTop,accent,showHeader=true){
 const w=1080,h=height;
 ctx.save();if(p.theme!=='julian'&&!(p.theme==='plain'&&p.shadow)){ctx.fillStyle=p.paper;ctx.fillRect(0,0,w,h);}
 const line=(x,y,x2,y2,color,width=1)=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
 const rect=(x,y,rw,rh,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,rw,rh);};
 const frame=(inset,color,width=1)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.strokeRect(inset,inset,w-inset*2,h-inset*2);};
 const dot=(x,y,r,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();};
 const rainbow=['#c86d76','#d99762','#e6c75c','#83a685','#719cb4','#ad8dac'];
 switch(p.theme){
 case 'plain':
  if(p.shadow){
   ctx.fillStyle=p.shadow;ctx.beginPath();ctx.roundRect(35,39,1010,h-63,17);ctx.fill();
   ctx.fillStyle=p.paper;ctx.beginPath();ctx.roundRect(20,20,1010,h-63,17);ctx.fill();
  }
  break;
 case 'julian':
  ctx.fillStyle=p.decoration;ctx.beginPath();ctx.roundRect(35,39,1010,h-63,17);ctx.fill();
  ctx.fillStyle=p.paper;ctx.beginPath();ctx.roundRect(20,20,1010,h-63,17);ctx.fill();
  break;
 case 'jude':
  {
   const dark=p.mode==='dark',surface=dark?'#202b2d':'#ffffff',muted=dark?'#b4c4c8':'#627978',gold=dark?'#d5b67b':'#967134';
   rect(0,0,w,h,surface);ctx.textBaseline='middle';
   if(showHeader){
    ctx.fillStyle=gold;ctx.beginPath();ctx.roundRect(90,96,56,44,7);ctx.fill();ctx.textAlign='center';ctx.fillStyle=dark?'#192125':'#ffffff';ctx.font='600 20px "Noto Sans KR"';ctx.fillText('5.0',118,118);
    for(let i=0;i<5;i++){const x=171+i*24,y=110;ctx.fillStyle=gold;ctx.beginPath();for(let j=0;j<10;j++){const a=-Math.PI/2+j*Math.PI/5,r=j%2?4.5:10;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;j?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();}
    ctx.fillStyle=muted;ctx.textAlign='right';ctx.font='400 17px "Noto Sans KR"';ctx.fillText('THE BELLWICK HOTEL / REVIEWS',990,118);
   }
  }
  break;
 case 'seungmin':
  {
   const dark=p.mode==='dark',bar=dark?'#161b22':'#f6f8fa',border=dark?'#30363d':'#d0d7de',muted=dark?'#8b949e':'#57606a';
   rect(0,0,w,77,bar);line(0,77,w,77,border);
   ['#f85149','#d29922','#3fb950'].forEach((c,i)=>dot(48+i*22,49,6,c));
   if(showHeader){ctx.fillStyle=muted;ctx.textBaseline='middle';ctx.font='400 19px monospace';ctx.textAlign='center';ctx.fillText('~/seungmin / excerpt.txt',540,49);}
  }
  break;
 case 'willow':
  {
   const dark=p.mode==='dark',green=dark?'#adcbb7':'#24553d',gold='#c3a154',border=dark?'#405147':'#d4d9cd',band=dark?'#24382e':'#edf1e8',muted=dark?'#b2c1b7':'#657369';
   rect(0,0,w,7,'#24553d');
   if(showHeader){
    dot(115,61,26,band);ctx.strokeStyle=gold;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(115,61,26,0,Math.PI*2);ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=green;ctx.font='700 22px Georgia,serif';ctx.fillText('RU',115,61);
    ctx.textAlign='left';ctx.font='600 24px "Noto Sans KR",sans-serif';ctx.fillText('RAINFALL UNIVERSITY',158,48);
    ctx.fillStyle=muted;ctx.font='400 17px "Noto Sans KR",sans-serif';ctx.fillText('myRainfall  /  학생 기록',158,78);
    ctx.textAlign='right';ctx.fillStyle=green;ctx.font='600 20px "Noto Sans KR",sans-serif';ctx.fillText('학적 조회',990,48);
    ctx.fillStyle=muted;ctx.font='400 16px "Noto Sans KR",sans-serif';ctx.fillText('Computer Science · Year 02',990,78);
   }
   if(showHeader)line(90,111,990,111,border);
   rect(90,bodyTop-38,900,26,band);
   rect(90,bodyTop-38,4,26,gold);
  }
  break;
 case '1997':
  {
   const dark=p.mode==='dark';
   for(let y=48;y<h-24;y+=72){
    dot(31,y,9,dark?'#49453b':'#d6cdbb');
    dot(31,y+1,6.5,dark?'#141310':'#9d9483');
    ctx.beginPath();ctx.strokeStyle=dark?'#b2a68a55':'#fff9ec';ctx.lineWidth=1.5;ctx.arc(31,y,9,0,Math.PI);ctx.stroke();
   }
   for(let i=0;i<1800;i++){
    const x=12+(i*193%1056),y=12+(i*127%Math.max(1,h-24));
    rect(x,y,1+(i%3),1,dark?'#ffffff07':'#655a4210');
   }
   line(72,h-12,1060,h-12,dark?'#514c40':'#d9d0bc');
   line(77,h-8,1055,h-8,dark?'#39372f':'#e8e0ce');
  }
  break;
 case '2004':
  {
   const face='#d4d0c8';
   const contentTop=103;
   rect(16,16,1048,h-32,face);rect(27,contentTop,1026,h-contentTop-27,p.paper);
   line(16,16,1064,16,'#ffffff',3);line(16,16,16,h-16,'#ffffff',3);
   line(1064,16,1064,h-16,'#404040',3);line(16,h-16,1064,h-16,'#404040',3);
   line(26,contentTop-1,1053,contentTop-1,'#808080',2);line(26,contentTop-1,26,h-27,'#808080',2);
   const bar=ctx.createLinearGradient(25,0,1055,0);bar.addColorStop(0,'#0a246a');bar.addColorStop(.5,'#26468f');bar.addColorStop(1,'#5a86c4');rect(25,25,1030,40,bar);
   ctx.fillStyle='#ffffff';ctx.textBaseline='middle';ctx.textAlign='left';ctx.font='600 20px "Noto Sans KR",sans-serif';ctx.fillText('메모장',43,45);
   for(let i=0;i<3;i++){
    const x=947+i*34;rect(x,32,28,26,face);line(x,32,x+28,32,'#fff',2);line(x,32,x,58,'#fff',2);line(x+28,32,x+28,58,'#404040',2);line(x,58,x+28,58,'#404040',2);
    if(i===0)line(x+7,51,x+20,51,'#202020',2);
    else if(i===1){ctx.strokeStyle='#202020';ctx.lineWidth=2;ctx.strokeRect(x+7,39,14,12);line(x+7,41,x+21,41,'#202020',2);}
    else{line(x+8,39,x+20,51,'#202020',2);line(x+20,39,x+8,51,'#202020',2);}
   }
   ctx.fillStyle='#202020';ctx.textBaseline='middle';ctx.textAlign='left';ctx.font='400 18px "Noto Sans KR",sans-serif';ctx.fillText('파일(F)     편집(E)     서식(O)     보기(V)     도움말(H)',43,84);
  }
  break;
 case 'hanminwoo':
  {
   const dark=p.mode==='dark';
   ctx.save();ctx.beginPath();ctx.rect(0,0,w,54);ctx.clip();
   rect(0,0,w,54,'#263039');
   for(let x=-24;x<1140;x+=94){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+47,0);ctx.lineTo(x+2,54);ctx.lineTo(x-45,54);ctx.closePath();ctx.fillStyle='#e2e6e5';ctx.fill();}
   ctx.restore();line(0,54,w,54,dark?'#070d11':'#82969f',2);
   for(const x of [43,1037]){dot(x,38,4,'#77858a');line(x-2,38,x+2,38,'#27333b');}
  }
  break;
 case 'colorground':
  {
   const colors=['#ff8da5','#ffb879','#f6d66d','#9bcfa1','#8dc9eb','#bca5e5'];
   const star=(x,y,r,color,angle=0)=>{
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.beginPath();
    for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.48:r;i?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}
    ctx.closePath();ctx.lineJoin='round';ctx.strokeStyle='#ffffff';ctx.lineWidth=7;ctx.stroke();ctx.fillStyle=color;ctx.fill();ctx.restore();
   };
   colors.forEach((c,i)=>{const x=i*180;rect(x,0,180,16,c);ctx.beginPath();ctx.ellipse(x+90,16,90,17,0,0,Math.PI);ctx.fillStyle=c;ctx.fill();});
   if(showHeader){
    star(1034,92,20,'#ffd34e',.2);
   }
   star(39,h-100,18,'#f45b60',-.25);star(1037,h-46,21,'#509bed',.2);
   for(let i=0;i<10;i++){const x=i%2?1049:30,y=155+i*47;if(y<h-135)dot(x,y,3,colors[i%6]);}
  }
  break;
 case 'nighthighway':
  {
   const dark=p.mode==='dark';
   if(showHeader){
    ctx.save();ctx.translate(90,34);ctx.rotate(-.018);
    ctx.fillStyle=dark?'#0d1719':'#c8c5b7';ctx.beginPath();ctx.roundRect(3,5,548,88,7);ctx.fill();
    ctx.fillStyle='#315c4f';ctx.beginPath();ctx.roundRect(0,0,548,88,7);ctx.fill();
    ctx.strokeStyle='#e5e5cb';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(6,6,536,76,4);ctx.stroke();
    ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#d9dfbd';ctx.font='500 13px "Noto Sans KR",sans-serif';ctx.fillText('AFTER DARK  /  ON THE ROAD',22,24);
    ctx.fillStyle='#faf7e8';ctx.font='700 35px "Noto Sans KR",sans-serif';ctx.fillText('NIGHT HIGHWAY',20,57);
    line(478,49,513,49,'#faf7e8',3);line(500,36,513,49,'#faf7e8',3);line(500,62,513,49,'#faf7e8',3);
    dot(13,12,2,'#a9b7a1');dot(535,76,2,'#a9b7a1');ctx.restore();
    ctx.save();ctx.translate(778,76);ctx.rotate(.065);
    ctx.beginPath();
    for(let i=0;i<8;i++){const angle=Math.PI/8+i*Math.PI/4,x=Math.cos(angle)*43,y=Math.sin(angle)*43;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    ctx.closePath();ctx.fillStyle='#bf443c';ctx.strokeStyle='#fff3df';ctx.lineWidth=6;ctx.stroke();ctx.fill();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff8ed';ctx.font='700 24px "Noto Sans KR",sans-serif';ctx.fillText('STOP',0,0);ctx.restore();
    ctx.save();ctx.translate(932,77);ctx.rotate(.13);
    ctx.beginPath();ctx.moveTo(0,-40);ctx.lineTo(40,0);ctx.lineTo(0,40);ctx.lineTo(-40,0);ctx.closePath();ctx.strokeStyle='#f7edd7';ctx.lineWidth=7;ctx.stroke();ctx.fillStyle='#dfb354';ctx.fill();ctx.strokeStyle='#54452e';ctx.lineWidth=1.5;ctx.stroke();
    ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(-7,19);ctx.lineTo(-7,9);ctx.bezierCurveTo(-7,-3,9,1,9,-12);ctx.lineTo(9,-20);ctx.stroke();ctx.beginPath();ctx.moveTo(2,-13);ctx.lineTo(9,-20);ctx.lineTo(16,-13);ctx.stroke();ctx.restore();
   }
   rect(0,h-49,w,49,dark?'#11191f':'#485357');
   line(0,h-45,w,h-45,'#f2ebd1',1.5);line(0,h-5,w,h-5,'#f2ebd1',1.5);
   ctx.save();ctx.setLineDash([37,25]);line(0,h-25,w,h-25,'#e7bd69',3);ctx.restore();
  }
  break;
 case 'anemoi':
  {
   const dark=p.mode==='dark',gold=p.decoration;
   for(let i=0;i<1700;i++)rect(12+(i*173%1056),12+(i*131%Math.max(1,h-24)),1+(i%2),1,dark?'#f3deba08':'#826a4010');
   const flourish=(x,y,sx,sy)=>{
    ctx.save();ctx.translate(x,y);ctx.scale(sx,sy);ctx.strokeStyle=gold;ctx.lineWidth=1;ctx.globalAlpha=.7;
    ctx.beginPath();ctx.moveTo(0,80);ctx.bezierCurveTo(3,30,6,6,80,0);ctx.moveTo(0,57);ctx.bezierCurveTo(34,55,38,8,17,10);ctx.bezierCurveTo(0,12,11,37,25,23);ctx.moveTo(24,1);ctx.bezierCurveTo(42,29,67,24,61,11);ctx.bezierCurveTo(56,0,44,9,51,15);ctx.stroke();
    ctx.beginPath();ctx.ellipse(7,47,3,8,-.5,0,Math.PI*2);ctx.ellipse(40,7,3,8,-.9,0,Math.PI*2);ctx.fillStyle=gold;ctx.fill();dot(1,1,2,gold);ctx.restore();
   };
   flourish(36,31,1,1);flourish(1044,31,-1,1);flourish(36,h-30,1,-1);flourish(1044,h-30,-1,-1);
  }
  break;
 case 'yunhaesi':
  {
   const dark=p.mode==='dark';
   if(dark){
    for(let row=0;row*72<h-16;row++)for(let side=0;side<2;side++){
     const i=row*2+side,x=side?1024+(row*19%38):16+(row*23%38),y=16+row*72+(side?27:0);
     if(y>h-12)continue;
     ctx.save();ctx.globalAlpha=.3+(i%5)*.14;dot(x,y,i%7===0?1.8:.9,i%3?'#d4e3ff':'#eddaa3');ctx.restore();
    }
    for(let i=0;i<24;i++){
     const x=15+(i*173%1050),y=i%2? h-12-(i*7%30):12+(i*11%30);
     ctx.save();ctx.globalAlpha=.3+(i%5)*.14;dot(x,y,i%7===0?1.8:.9,i%3?'#d4e3ff':'#eddaa3');ctx.restore();
    }
    for(const [x,y,r] of [[46,94,5],[1034,148,4],[1013,h-44,5],[159,29,3]]){
     line(x-r,y,x+r,y,'#dce6ff',1);line(x,y-r,x,y+r,'#dce6ff',1);dot(x,y,1.4,'#fff0c5');
    }
   }else{
    for(let i=0;i<3;i++){
     const y=h-48+i*15;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(180,y-24,360,y+18,540,y);ctx.bezierCurveTo(720,y-20,900,y+17,w,y-3);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=['#d7eef0','#b6dde3','#8fc5d1'][i];ctx.fill();
    }
    for(let i=0;i<8;i++){const x=61+i*137,y=h-27+(i%3)*5;line(x,y,x+15,y,'#f4fcfc',1.5);}
    if(showHeader){
     ctx.strokeStyle='#88b5c2';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(905,35);ctx.quadraticCurveTo(918,23,930,35);ctx.quadraticCurveTo(942,23,955,35);ctx.moveTo(969,48);ctx.quadraticCurveTo(979,39,989,48);ctx.quadraticCurveTo(999,39,1009,48);ctx.stroke();
    }
   }
  }
  break;
 }
 if(p.theme==='plain'&&p.divider&&p.divider!=='none'){
  const theme=p.divider.startsWith('yunhaesi-')?'yunhaesi':p.divider,mode=p.divider.startsWith('yunhaesi-')?p.divider.slice(9):p.mode;
  const palette=themePalette({...p,theme},mode);
  drawCardDivider(ctx,{...palette,paper:p.paper,dividerPaper:p.paper},bodyTop,palette.accent);
 }else drawCardDivider(ctx,p,bodyTop,accent);
 ctx.restore();
}
function drawCardDivider(ctx,p,bodyTop,accent){
 ctx.save();
 const line=(x,y,x2,y2,color,width=1)=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
 const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
 const dot=(x,y,r,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();};
 if(p.theme==='julian'){
  const rainbow=['#c86d76','#d99762','#e6c75c','#83a685','#719cb4','#ad8dac'];
  ctx.save();ctx.translate(90,bodyTop-29);ctx.rotate(-.004);
  ctx.beginPath();ctx.moveTo(3,0);ctx.lineTo(896,0);ctx.lineTo(900,4);ctx.lineTo(896,8);ctx.lineTo(899,13);ctx.lineTo(1,13);ctx.lineTo(4,9);ctx.lineTo(0,5);ctx.closePath();ctx.clip();
  rainbow.forEach((color,i)=>rect(i*150,0,151,14,color));
  for(let x=0;x<900;x+=9)line(x,0,x+5,13,'#fff2');
  line(0,4,900,4,'#fff2');line(0,10,900,10,'#14151a22');ctx.restore();
 }else if(p.theme==='jude'){
  const dark=p.mode==='dark',y=bodyTop-34;
  ctx.save();
  ctx.fillStyle=dark?'#9e9275':'#e5d5b3';ctx.fillRect(90,y+2,900,23);
  ctx.fillStyle=dark?'#c4b590':'#f3e7cb';ctx.fillRect(90,y,900,23);
  line(90,y+4,990,y+4,dark?'#88795c88':'#bca77d66');
  line(90,y+19,990,y+19,dark?'#88795c88':'#bca77d66');
  for(let x=101;x<990;x+=24){dot(x,y+11.5,3,p.dividerPaper||(dark?'#202b2d':'#ffffff'));}
  ctx.restore();
 }else if(p.theme==='seungmin'){
  ctx.save();ctx.globalAlpha=.65;ctx.fillStyle=p.decoration;ctx.font='400 22px monospace';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('//',90,bodyTop-25);
  line(131,bodyTop-25,990,bodyTop-25,p.decoration);ctx.restore();
 }else if(p.theme==='hanminwoo'){
  const y=bodyTop-27,rule=p.mode==='dark'?'#a7b8c188':'#50636d88';
  rect(90,y-3,24,6,p.decoration);line(127,y,990,y,rule,1.5);line(90,y+6,990,y+6,rule);
 }else if(p.theme==='2004'){
  const dark=p.mode==='dark',y=bodyTop-28;
  rect(90,y,900,6,dark?'#30363e':'#d4d0c8');
  line(90,y,990,y,dark?'#101316':'#808080',2);
  line(90,y,90,y+6,dark?'#101316':'#808080',2);
  line(90,y+6,990,y+6,dark?'#525b66':'#ffffff',2);
  line(990,y,990,y+6,dark?'#525b66':'#ffffff',2);
 }else if(p.theme==='yunhaesi'){
  const y=bodyTop-25;
  ctx.save();ctx.strokeStyle=p.decoration;ctx.globalAlpha=.65;ctx.lineWidth=1;
  if(p.mode==='dark'){
   line(90,y,518,y,p.decoration);line(562,y,990,y,p.decoration);
   ctx.beginPath();ctx.moveTo(540,y-6);ctx.lineTo(542,y-2);ctx.lineTo(546,y);ctx.lineTo(542,y+2);ctx.lineTo(540,y+6);ctx.lineTo(538,y+2);ctx.lineTo(534,y);ctx.lineTo(538,y-2);ctx.closePath();ctx.fillStyle=p.accent;ctx.fill();
  }else{
   ctx.beginPath();ctx.moveTo(90,y);for(let x=90;x<=990;x+=5)ctx.lineTo(x,y+Math.sin((x-90)/26)*2.5);ctx.stroke();
  }
  ctx.restore();
 }else if(p.theme==='anemoi'){
  const y=bodyTop-25,gold=p.decoration;
  ctx.save();ctx.globalAlpha=.7;line(90,y,477,y,gold);line(603,y,990,y,gold);
  ctx.strokeStyle=gold;ctx.lineWidth=1;ctx.beginPath();
  ctx.moveTo(477,y);ctx.bezierCurveTo(505,y-14,522,y+15,540,y);ctx.bezierCurveTo(558,y-15,575,y+14,603,y);
  ctx.moveTo(496,y+5);ctx.bezierCurveTo(516,y+19,527,y-14,540,y);ctx.bezierCurveTo(553,y+14,564,y-19,584,y-5);ctx.stroke();
  ctx.translate(540,y);ctx.rotate(Math.PI/4);ctx.strokeRect(-3.5,-3.5,7,7);ctx.restore();
 }else if(p.theme==='nighthighway'){
  const y=bodyTop-25;
  ctx.save();ctx.setLineDash([5,7]);line(102,y,976,y,p.decoration,1.5);ctx.restore();
  for(const x of [95,985]){dot(x,y,5,p.decoration);dot(x,y,2,p.paper);}
 }else if(p.theme==='colorground'){
  const colors=['#ff8da5','#ffb879','#f6d66d','#9bcfa1','#8dc9eb','#bca5e5'],y=bodyTop-25;
  ctx.save();ctx.lineCap='round';
  colors.forEach((c,i)=>{ctx.strokeStyle=c;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(94+i*150,y);ctx.bezierCurveTo(130+i*150,y-7,200+i*150,y+7,236+i*150,y);ctx.stroke();});
  ctx.restore();
 }else if(p.theme==='1997'){
  const y=bodyTop-25,ink=p.mode==='dark'?'#c7beaa':'#686154';
  ctx.save();ctx.lineCap='round';
  for(let i=0;i<4;i++){
   ctx.globalAlpha=.4-i*.065;ctx.strokeStyle=ink;ctx.lineWidth=1.1;
   ctx.beginPath();ctx.moveTo(90+i*3,y+i*.8);
   for(let x=96;x<=990-i*3;x+=6)ctx.lineTo(x,y+Math.sin(x*.047+i)*.6+Math.sin(x*.13+i)*.35+i*.8);
   ctx.stroke();
  }
  ctx.restore();
 }else if(p.theme!=='julian'&&p.theme!=='plain'){ctx.globalAlpha=.4;line(90,bodyTop-25,990,bodyTop-25,accent);}ctx.restore();
}
