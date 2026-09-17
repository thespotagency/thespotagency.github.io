function openVideo(id,type){
  var lb=document.getElementById('videoLightbox');
  var frame=document.getElementById('lightboxFrame');
  var inner=document.getElementById('lightboxInner');
  if(type==='shorts'){frame.style.width='360px';frame.style.height='640px';inner.style.width='360px'}
  else{frame.style.width='90vw';frame.style.maxWidth='900px';frame.style.height='506px';inner.style.width=''}
  frame.src='https://www.youtube.com/embed/'+id+'?autoplay=1';
  lb.style.display='flex';document.body.style.overflow='hidden';
}
function closeLightbox(e){
  if(e&&e.target!==document.getElementById('videoLightbox'))return;
  document.getElementById('videoLightbox').style.display='none';
  document.getElementById('lightboxFrame').src='';
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    document.getElementById('videoLightbox').style.display='none';
    document.getElementById('lightboxFrame').src='';
    document.body.style.overflow='';
  }
});

(function(){
  var c=document.getElementById('shader-canvas');if(!c)return;
  var gl=c.getContext('webgl',{alpha:true,premultipliedAlpha:true})||c.getContext('experimental-webgl',{alpha:true,premultipliedAlpha:true});if(!gl)return;
  var vS='attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}';
  var fS='precision highp float;uniform vec2 resolution;uniform float time;void main(void){vec2 uv=(gl_FragCoord.xy*2.0-resolution.xy)/min(resolution.x,resolution.y);float t=time*0.05;float lw=0.002;float intensity=0.0;for(int i=0;i<5;i++){float fi=float(i);float ring=lw*fi*fi/abs(fract(t+fi*0.01)*5.0-length(uv)+mod(uv.x+uv.y,0.2));intensity+=ring;}float rad=length(uv);vec3 teal=vec3(0.05,0.85,0.80);vec3 white=vec3(1.00,1.00,1.00);vec3 tang=vec3(1.00,0.35,0.05);vec3 ramp=mix(teal,white,smoothstep(0.0,0.42,rad));ramp=mix(ramp,tang,smoothstep(0.42,1.05,rad));vec3 color=ramp*intensity;color+=vec3(pow(intensity,3.0))*0.14;float vig=1.0-smoothstep(0.55,1.35,rad);color*=vig;float alpha=clamp(intensity*vig,0.0,1.0);gl_FragColor=vec4(color*alpha,alpha);}';
  function mk(t,s){var sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);return sh}
  var p=gl.createProgram();gl.attachShader(p,mk(gl.VERTEX_SHADER,vS));gl.attachShader(p,mk(gl.FRAGMENT_SHADER,fS));gl.linkProgram(p);gl.useProgram(p);
  var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  var pos=gl.getAttribLocation(p,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  var uR=gl.getUniformLocation(p,'resolution'),uT=gl.getUniformLocation(p,'time'),time=0;
  function resize(){var h=c.parentElement;c.width=h.clientWidth*(window.devicePixelRatio||1);c.height=h.clientHeight*(window.devicePixelRatio||1);c.style.width=h.clientWidth+'px';c.style.height=h.clientHeight+'px';gl.viewport(0,0,c.width,c.height);gl.uniform2f(uR,c.width,c.height)}
  window.addEventListener('resize',resize);resize();
  function render(){time+=0.05;gl.uniform1f(uT,time);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(render)}
  render();
})();

var hamburger=document.getElementById('hamburger');
var mobileMenu=document.getElementById('mobileMenu');
hamburger.addEventListener('click',function(){
  var open=mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
});
function closeMobileMenu(){
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow='';
}

window.addEventListener('scroll',function(){
  var nav=document.getElementById('navbar');
  nav.classList.toggle('scrolled',window.scrollY>50);
});

var rio=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');rio.unobserve(e.target)}});
},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(function(el){rio.observe(el)});

document.querySelectorAll('.lg-card').forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

window.addEventListener('scroll',function(){
  var sy=window.scrollY;
  var o1=document.querySelector('.orb-1'),o2=document.querySelector('.orb-2');
  if(o1)o1.style.transform='translateY('+(sy*0.15)+'px)';
  if(o2)o2.style.transform='translateY('+(-sy*0.1)+'px)';
},{passive:true});

function animCounter(el,opts){
  var inc=opts.target/(opts.dur/(1000/60)),cur=0;
  var t=setInterval(function(){
    cur+=inc;if(cur>=opts.target){cur=opts.target;clearInterval(t)}
    el.textContent=opts.pre+(opts.fl?cur.toFixed(1):Math.floor(cur))+opts.suf;
  },1000/60);
}
var cio=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(!e.isIntersecting)return;
    var el=e.target.querySelector('.metric-num');
    if(!el||el.dataset.animated)return;
    el.dataset.animated='1';
    var txt=el.textContent.trim(),nums=txt.match(/[\d.]+/g)||[];
    if(nums.length!==1){cio.unobserve(e.target);return}
    var n=nums[0],idx=txt.indexOf(n);
    animCounter(el,{target:parseFloat(n),pre:txt.slice(0,idx),suf:txt.slice(idx+n.length),fl:n.indexOf('.')!==-1,dur:1200});
    cio.unobserve(e.target);
  });
},{threshold:0.5});
document.querySelectorAll('.metric-item').forEach(function(el){cio.observe(el)});

(function(){
  var track=document.getElementById('ssTrack');
  var frame=document.getElementById('ssFrame');
  var dotsWrap=document.getElementById('ssDots');
  var counter=document.getElementById('ssCounter');
  if(!track)return;
  var slides=track.querySelectorAll('.ss-slide');
  var total=slides.length;
  var cur=0,timer=null,AUTO=4500;
  for(var d=0;d<total;d++){
    var btn=document.createElement('button');
    btn.className='ss-dot'+(d===0?' active':'');
    btn.setAttribute('aria-label','Go to slide '+(d+1));
    (function(idx){btn.addEventListener('click',function(){go(idx);reset()})})(d);
    dotsWrap.appendChild(btn);
  }
  var dots=dotsWrap.querySelectorAll('.ss-dot');
  function updateUI(){
    dots.forEach(function(d,i){d.classList.toggle('active',i===cur)});
    counter.textContent=(cur+1)+' / '+total;
    track.style.transform='translateX(-'+(cur*100)+'%)';
  }
  function go(n){cur=(n+total)%total;updateUI()}
  function next(){go(cur+1)}
  function prev(){go(cur-1)}
  function start(){timer=setInterval(next,AUTO)}
  function stop(){clearInterval(timer)}
  function reset(){stop();start()}
  document.getElementById('ssNext').addEventListener('click',function(){next();reset()});
  document.getElementById('ssPrev').addEventListener('click',function(){prev();reset()});
  frame.addEventListener('mouseenter',stop);
  frame.addEventListener('mouseleave',start);
  var touchStartX=null,touchStartY=null,locked=false;
  frame.addEventListener('touchstart',function(e){touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;locked=false;stop();},{passive:true});
  frame.addEventListener('touchmove',function(e){
    if(touchStartX===null)return;
    var dx=e.touches[0].clientX-touchStartX;
    var dy=e.touches[0].clientY-touchStartY;
    if(!locked){if(Math.abs(dy)>Math.abs(dx)){touchStartX=null;return}locked=true;}
    e.preventDefault();
    var offset=cur*100-(dx/frame.offsetWidth*100);
    track.style.transition='none';track.style.transform='translateX(-'+offset+'%)';
  },{passive:false});
  frame.addEventListener('touchend',function(e){
    if(touchStartX===null){start();return}
    var dx=e.changedTouches[0].clientX-touchStartX;
    track.style.transition='';
    if(Math.abs(dx)>50){dx<0?next():prev()}else{updateUI()}
    touchStartX=null;locked=false;reset();
  },{passive:true});
  var mouseStartX=null,mouseDragged=false;
  track.addEventListener('mousedown',function(e){mouseStartX=e.clientX;mouseDragged=false;track.style.cursor='grabbing';stop();});
  window.addEventListener('mousemove',function(e){
    if(mouseStartX===null)return;
    var dx=e.clientX-mouseStartX;
    if(Math.abs(dx)>5)mouseDragged=true;
    var offset=cur*100-(dx/frame.offsetWidth*100);
    track.style.transition='none';track.style.transform='translateX(-'+offset+'%)';
  });
  window.addEventListener('mouseup',function(e){
    if(mouseStartX===null)return;
    var dx=e.clientX-mouseStartX;
    track.style.transition='';track.style.cursor='';
    if(mouseDragged&&Math.abs(dx)>60){dx<0?next():prev()}else{updateUI()}
    mouseStartX=null;mouseDragged=false;reset();
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){prev();reset()}
    if(e.key==='ArrowRight'){next();reset()}
  });
  updateUI();
  start();
})();

document.querySelectorAll('select').forEach(function(s){
  s.addEventListener('change',function(){s.classList.add('selected')});
});

(function(){
  var tabs=document.querySelectorAll('.filter-tab');
  var cards=document.querySelectorAll('.static-card');
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      tabs.forEach(function(t){t.classList.remove('active')});
      tab.classList.add('active');
      var f=tab.getAttribute('data-filter');
      cards.forEach(function(card){
        if(f==='all'||card.getAttribute('data-client')===f){
          card.classList.remove('hidden');
        }else{
          card.classList.add('hidden');
        }
      });
    });
  });
})();


// Tally embed loader
var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}

// Theme toggle button handler
(function(){
  var btn=document.getElementById('themeToggle');
  if(!btn)return;
  btn.addEventListener('click',function(){
    var isLight=document.documentElement.getAttribute('data-theme')==='light';
    if(isLight){
      document.documentElement.removeAttribute('data-theme');
      try{localStorage.setItem('spot_theme','dark');}catch(e){}
    }else{
      document.documentElement.setAttribute('data-theme','light');
      try{localStorage.setItem('spot_theme','light');}catch(e){}
    }
  });
})();