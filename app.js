const header=document.querySelector('header');const menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Закрыть':'Меню'});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&header.classList.contains('open')){header.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Меню';menu.focus()}});document.addEventListener('click',event=>{if(header.classList.contains('open')&&!header.contains(event.target)){header.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Меню'}});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Меню'}));
document.querySelectorAll('[data-duration]').forEach(button=>button.addEventListener('click',()=>{const sixty=button.dataset.duration==='60';document.querySelectorAll('[data-duration]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelectorAll('.minutes').forEach(s=>s.textContent=sixty?'60':'45');document.querySelector('#plan1').textContent=sixty?'ФРИМАН СТАРТ':'ФРИМАН ЛАЙТ';document.querySelector('#plan2').textContent=sixty?'ФРИМАН ПРО':'ФРИМАН МЕДИУМ';document.querySelector('#price1').textContent=sixty?'1000':'800';document.querySelector('#price2').textContent=sixty?'1600':'1440';document.querySelector('#unit1').textContent=sixty?'250 ₪ за занятие':'200 ₪ за занятие';document.querySelector('#unit2').textContent=sixty?'200 ₪ за занятие':'180 ₪ за занятие'}));
const reviewCards=[...document.querySelectorAll('.quote-card')];
const reviewDialog=document.querySelector('#review-text');
const moreReviews=document.querySelector('.more-reviews');
let reviewType='all',showAll=false;
function renderReviews(){
 const matching=reviewCards.filter(card=>reviewType==='all'||card.dataset.category===reviewType);
 reviewCards.forEach(card=>{card.hidden=true;card.classList.remove('quote-featured');card.querySelector('.quote-watermark')?.remove()});
 matching.forEach((card,i)=>{card.hidden=!showAll&&i>=3;if(i===0){card.classList.add('quote-featured');const watermark=document.createElement('span');watermark.className='quote-watermark';watermark.setAttribute('aria-hidden','true');watermark.append(card.querySelector('.logo-mark').cloneNode(true));card.append(watermark)}});
 moreReviews.hidden=matching.length<=3;
 moreReviews.setAttribute('aria-expanded',String(showAll));
 moreReviews.textContent=showAll?'Свернуть отзывы ↑':'Показать ещё отзывы ↓';
}
document.querySelectorAll('[data-review]').forEach(button=>button.addEventListener('click',()=>{
 reviewType=button.dataset.review;showAll=false;
 document.querySelectorAll('[data-review]').forEach(tab=>{tab.classList.toggle('selected',tab===button);tab.setAttribute('aria-pressed',String(tab===button))});renderReviews();const grid=document.querySelector('#review-grid');if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){grid.classList.remove('filter-changing');requestAnimationFrame(()=>grid.classList.add('filter-changing'))}
}));
moreReviews.addEventListener('click',()=>{showAll=!showAll;renderReviews();if(!showAll)moreReviews.scrollIntoView({block:'nearest'})});
document.querySelector('#review-grid').addEventListener('click',event=>{
 const summary=event.target.closest('.quote-full summary');if(!summary)return;
 const card=summary.closest('.quote-card');const review=window.FREEMAN_REVIEWS.find(item=>item.id===card.dataset.id);if(!review)return;
 event.preventDefault();reviewDialog.querySelector('#review-text-title').textContent=review.category==='students'?'Об индивидуальных занятиях':'О подкасте «Фриман»';
 const body=reviewDialog.querySelector('.review-text-body');body.replaceChildren();
 review.text.split('\n\n').forEach(text=>{const paragraph=document.createElement('p');paragraph.textContent=text;body.append(paragraph)});
 reviewDialog.showModal();
});
reviewDialog.querySelector('.close-modal').addEventListener('click',()=>reviewDialog.close());
reviewDialog.addEventListener('click',event=>{if(event.target===reviewDialog){const bounds=reviewDialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)reviewDialog.close()}});
renderReviews();


// Motion enhances the page; all content remains readable without JavaScript.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.button').forEach(button=>{const label=document.createElement('span');label.className='button-label';while(button.firstChild)label.append(button.firstChild);button.append(label);button.addEventListener('pointerdown',event=>{if(reduceMotion.matches)return;const bounds=button.getBoundingClientRect();const ripple=document.createElement('span');ripple.className='ripple';ripple.style.left=`${event.clientX-bounds.left}px`;ripple.style.top=`${event.clientY-bounds.top}px`;button.append(ripple);ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});setTimeout(()=>ripple.remove(),900)})});
const revealItems=[...document.querySelectorAll('.reveal')];
if('IntersectionObserver' in window){
 if(!reduceMotion.matches){document.documentElement.classList.add('motion','hero-animate');document.querySelectorAll('.product-card').forEach((card,index)=>card.style.setProperty('--reveal-delay',`${index*90}ms`));const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const delay=entry.target.classList.contains('product-card')?parseInt(entry.target.style.getPropertyValue('--reveal-delay'))||0:0;setTimeout(()=>entry.target.classList.add('visible'),delay);revealObserver.unobserve(entry.target)})},{threshold:.07,rootMargin:'0px 0px -15px 0px'});revealItems.forEach(item=>revealObserver.observe(item));}
 const waveObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('running',entry.isIntersecting&&!reduceMotion.matches)),{threshold:.15});document.querySelectorAll('.wave').forEach(wave=>waveObserver.observe(wave));
}
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches){document.documentElement.classList.remove('motion','hero-animate');document.querySelectorAll('.wave').forEach(w=>w.classList.remove('running'));revealItems.forEach(el=>el.classList.add('visible'))}});
document.querySelectorAll('.product-card').forEach(card=>{card.addEventListener('pointermove',event=>{if(reduceMotion.matches||!finePointer.matches)return;const r=card.getBoundingClientRect();const x=(event.clientX-r.left)/r.width;const y=(event.clientY-r.top)/r.height;card.style.setProperty('--tilt-x',`${(0.5-y)*3}deg`);card.style.setProperty('--tilt-y',`${(x-0.5)*4}deg`);card.style.setProperty('--spot-x',`${x*100}%`);card.style.setProperty('--spot-y',`${y*100}%`)});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')})});
const progress=document.querySelector('.reading-progress');const hero=document.querySelector('.hero');const portrait=document.querySelector('.hero .portrait');const navTargets=[...document.querySelectorAll('nav a')].map(link=>({link,section:document.querySelector(link.getAttribute('href'))})).filter(item=>item.section);let ticking=false;
function updateScroll(){const y=window.scrollY;const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,y/max):0})`;header.classList.toggle('scrolled',y>25);if(!reduceMotion.matches&&finePointer.matches&&y<hero.offsetTop+hero.offsetHeight){portrait.style.transform=`translateY(${Math.min(y*.075,42)}px) scale(1.025)`}else{portrait.style.transform='none'}let active=null;navTargets.forEach(item=>{if(item.section.getBoundingClientRect().top<=window.innerHeight*.4)active=item});navTargets.forEach(item=>{item.link.classList.toggle('active',item===active);if(item===active)item.link.setAttribute('aria-current','location');else item.link.removeAttribute('aria-current')});ticking=false}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll)}},{passive:true});window.addEventListener('resize',updateScroll,{passive:true});updateScroll();
document.querySelectorAll('[data-duration]').forEach(button=>button.addEventListener('click',()=>{if(reduceMotion.matches)return;const grid=document.querySelector('.lesson-grid');grid.classList.remove('changing');requestAnimationFrame(()=>{requestAnimationFrame(()=>grid.classList.add('changing'))})}));
