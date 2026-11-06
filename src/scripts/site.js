import { createIcons, Users, MessageCircle, Handshake, Camera, CalendarDays, Building2, Phone, CircleCheck, BriefcaseBusiness, Search, SlidersHorizontal, Info, Calculator, HardHat, Megaphone, FilePenLine, ChartNoAxesCombined, Scale, Monitor, Mail, MapPin, ShieldCheck, BookOpen, FileText, ListChecks, UserRoundCheck, UserRound } from "lucide";
import memberRoster from "../data/members.json";
import leadership from "../data/leadership.json";
const icons = { Users, MessageCircle, Handshake, Camera, CalendarDays, Building2, Phone, CircleCheck, BriefcaseBusiness, Search, SlidersHorizontal, Info, Calculator, HardHat, Megaphone, FilePenLine, ChartNoAxesCombined, Scale, Monitor, Mail, MapPin, ShieldCheck, BookOpen, FileText, ListChecks, UserRoundCheck, UserRound };

(function(){
'use strict';
const root=document.getElementById('bni-memel-complete');
if(!root)return;
const byId=id=>root.querySelector('#'+id);
const pages=['home','about','members','profile','visit','membership','stories','story','contact','privacy'];
const members = memberRoster;
const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[character]);
const normalize = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("lt-LT").trim();
const memberCategory = member => member.category || member.role;
const memberPhoto = member => member.photo ? base + member.photo.replace(/^\/+/, "") + (member.photoVersion ? '?v=' + encodeURIComponent(member.photoVersion) : '') : null;
const storyTitles=['Aštuntasis BNI Memel gimtadienis','Pirmas apsilankymas verslo klube: nario patirtis','Skirtingų sričių specialistų bendradarbiavimas'];
const storySubtitles=['Šventė, žmonės ir pažintys','Ką narys sužinojo apsilankęs?','Kokių kompetencijų reikėjo projektui?'];
const storyIntros=['Oficialiame BNI Memel LinkedIn įraše klubas pasidalijo aštuntojo gimtadienio akimirkomis: renginio sale, dalyviais ir šventiniu tortu.','Kokią mintį, pažintį ar naują požiūrį galima parsinešti iš susitikimo? Šioje vietoje galėtų atsirasti tikro nario patirtis.','Kaip skirtingų sričių specialistai atranda bendrą projektą? Šioje vietoje galėtų būti papasakotas patvirtintas bendradarbiavimo atvejis.'];
let current='home',selectedMember=members[0],selectedStory=0;
function iconRefresh() {
  createIcons({ icons, attrs: { width: 28, height: 28, 'aria-hidden': 'true' } });
}
function resolveMember(id) {
  return members.find(member => member.id === id) || (/^\d+$/.test(String(id)) ? members[Number(id)] : null) || members[0];
}
function portrait(member, profile = false) {
  const photo = memberPhoto(member);
  return photo
    ? '<img class="' + (profile ? 'm-profile-photo' : 'm-member-photo') + '" src="' + escapeHTML(photo) + '" alt="' + escapeHTML(member.name) + '" width="' + (member.photoWidth || 878) + '" height="' + (member.photoHeight || 878) + '" loading="lazy" decoding="async">'
    : '<div class="m-member-no-photo"><span class="m-icon"><i data-lucide="user-round" aria-hidden="true"></i></span><span>Nuotrauka nepateikta</span></div>';
}
function updateProfile(id) {
  selectedMember = resolveMember(id);
  if (!selectedMember) return;
  const member = selectedMember;
  byId('memel-profile-name').textContent = member.name;
  byId('memel-profile-company').textContent = member.company;
  byId('memel-profile-category').textContent = memberCategory(member);
  byId('memel-profile-role').textContent = member.role;
  byId('memel-profile-description').textContent = member.description || 'Oficialiame BNI profilyje nurodyta veiklos sritis: ' + member.role + '.';
  byId('memel-profile-portrait').innerHTML = portrait(member, true);
  byId('memel-profile-source').href = member.sourceUrl;
  iconRefresh();
}
function updateStory(index){selectedStory=Number.isInteger(index)&&storyTitles[index]?index:0;byId('memel-story-title').textContent=storyTitles[selectedStory];byId('memel-story-subtitle').textContent=storySubtitles[selectedStory];byId('memel-story-intro').textContent=storyIntros[selectedStory];const real=selectedStory===0;byId('memel-story-context-title').textContent=real?'Iš klubo archyvo':'Apie temos pavyzdį';byId('memel-story-context-copy').textContent=real?'Istorinės renginio nuotraukos, paskelbtos oficialioje klubo LinkedIn paskyroje.':'Redakcinė idėja būsimam tikro nario pasakojimui. Tai nėra įvykusio atvejo aprašymas.';byId('memel-story-crumb').textContent=real?'Klubo archyvas':'Pavyzdinė tema';byId('memel-story-note').textContent=real?'Istorinės akimirkos iš oficialios BNI Memel LinkedIn paskyros.':'Redakcinis pavyzdys: tai nėra įvykusių įvykių ar realių rezultatų aprašymas.';byId('memel-story-gallery').hidden=!real;byId('memel-story-placeholder').hidden=real;byId('memel-story-second-title').textContent=real?'Nuotraukos iš klubo archyvo':'Bendradarbiavimo eiga ir rezultatas';byId('memel-story-second-copy').textContent=real?'Šis puslapis pristato istorines renginio nuotraukas. Dabartinis susitikimų laikas, vieta ir klubo komanda pateikiami tik juos patvirtinus.':'Publikuodami istoriją, čia pateiksime patvirtintą nario pasakojimą apie poreikį, pažintį ir bendradarbiavimą.';byId('memel-story-source-copy').innerHTML=real?'<a href="https://www.linkedin.com/posts/bni-memel_bnimemel-verslosinergija-bni-activity-7303046610643566592-b_ga" target="_blank" rel="noopener noreferrer">Originalus BNI Memel LinkedIn įrašas</a>':'Pasiekimus ir citatas pagrįsime su dalyviais suderintais faktais.';}
function showPage(page,fromUser){current=pages.includes(page)?page:'home';root.querySelectorAll('[data-view]').forEach(view=>{view.hidden=view.dataset.view!==current;});root.querySelectorAll('.m-nav [data-page]').forEach(button=>{if(button.dataset.page===current||(current==='profile'&&button.dataset.page==='members')||(current==='story'&&button.dataset.page==='stories'))button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});root.querySelector('.m-nav').classList.remove('m-expanded');root.querySelector('.m-menu').setAttribute('aria-expanded','false');if(fromUser){root.scrollIntoView({block:'start',behavior:'auto'});}}
function card(member) {
  return '<article class="m-member"><div class="m-member-art">' + portrait(member) + '</div><div class="m-member-body"><h3>' + escapeHTML(member.name) + '</h3><p class="m-small">' + escapeHTML(member.company) + '</p><p>' + escapeHTML(member.role) + '</p><button class="m-textlink cursor-interaction" data-member="' + escapeHTML(member.id) + '" aria-label="Peržiūrėti profilį: ' + escapeHTML(member.name) + '">Nario profilis</button></div></article>';
}
function leadershipCard(leader) {
  const member = members.find(member => member.id === leader.memberId);
  if (!member) return '';
  return '<article class="m-leader"><div class="m-leader-art">' + portrait(member) + '</div><div class="m-leader-body"><h3>' + escapeHTML(member.name) + '</h3><p class="m-leader-position">' + escapeHTML(leader.position) + '</p><p class="m-small">' + escapeHTML(member.company) + '</p><button class="m-textlink cursor-interaction" data-member="' + escapeHTML(member.id) + '" aria-label="Peržiūrėti profilį: ' + escapeHTML(member.name) + '">Nario profilis</button></div></article>';
}
root.querySelectorAll('[data-leadership]').forEach(container => {
  container.innerHTML = leadership.members.map(leadershipCard).join('');
});
function renderMembers() {
  const term = normalize(byId('memel-search').value);
  const category = byId('memel-category').value;
  const filtered = members.filter(member => (category === 'all' || memberCategory(member) === category) && normalize([member.name, member.company, member.category, member.role].join(' ')).includes(term));
  byId('memel-result-count').textContent = 'Rodoma narių: ' + filtered.length + ' iš ' + members.length;
  byId('memel-member-list').innerHTML = filtered.length ? filtered.map(card).join('') : '<div class="m-empty"><h3>Atitinkančių narių nerasta.</h3><p>Pabandykite kitą frazę arba pasirinkite visas veiklos sritis.</p><button class="m-action m-action-secondary cursor-interaction" id="memel-clear-search">Išvalyti paiešką</button></div>';
  iconRefresh();
}
const categories = [...new Set(members.map(memberCategory))].sort((a, b) => a.localeCompare(b, 'lt-LT'));
byId('memel-category').innerHTML = '<option value="all">Visos sritys</option>' + categories.map(category => '<option value="' + escapeHTML(category) + '">' + escapeHTML(category) + '</option>').join('');
byId('memel-home-members').innerHTML = members.slice(0, 3).map(card).join('');
renderMembers();updateProfile(members[0]?.id);updateStory(0);
root.addEventListener('click',event=>{const target=event.target.closest('button');if(!target||!root.contains(target))return;if(target.dataset.page){navigate(target.dataset.page);return;}if(target.dataset.member!==undefined){navigate('profile',target.dataset.member);return;}if(target.dataset.story!==undefined){navigate('story',Number(target.dataset.story));return;}if(target.classList.contains('m-menu')){const expanded=target.getAttribute('aria-expanded')==='true';target.setAttribute('aria-expanded',String(!expanded));root.querySelector('.m-nav').classList.toggle('m-expanded',!expanded);}if(target.id==='memel-clear-search'){byId('memel-search').value='';byId('memel-category').value='all';renderMembers();byId('memel-search').focus();}if(target.id==='memel-reset-visit')resetForm('visit');if(target.id==='memel-reset-contact')resetForm('contact');});
byId('memel-search').addEventListener('input',renderMembers);byId('memel-category').addEventListener('change',renderMembers);
function resetForm(type){byId('memel-'+type+'-form').reset();byId('memel-'+type+'-form-content').hidden=false;byId('memel-'+type+'-success').hidden=true;}
['visit','contact'].forEach(type=>{byId('memel-'+type+'-form').addEventListener('submit',event=>{event.preventDefault();if(!event.target.reportValidity())return;byId('memel-'+type+'-form-content').hidden=true;byId('memel-'+type+'-success').hidden=false;event.target.reset();});});
// Fragment routes keep every view, member profile and story shareable on static hosting.
const pageTitles = {
  home: 'BNI Memel – verslo klubas Klaipėdoje', about: 'Apie BNI Memel klubą',
  members: 'BNI Memel narių katalogas', profile: 'BNI Memel nario profilis',
  visit: 'Apsilankykite BNI Memel susitikime', membership: 'Narystė BNI Memel klube',
  stories: 'BNI Memel žmonės ir istorijos', story: 'BNI Memel istorija',
  contact: 'BNI Memel kontaktai', privacy: 'Privatumo informacija'
};
function navigate(page, index) {
  const route = '#' + page + (index !== undefined ? '/' + encodeURIComponent(index) : '');
  if (window.location.hash === route) renderRoute(true);
  else window.location.hash = route;
}
function renderRoute(fromUser) {
  const [page = 'home', index] = window.location.hash.slice(1).split('/');
  const route = pages.includes(page) ? page : 'home';
  if (route === 'profile') {
    let memberId = index;
    try { memberId = decodeURIComponent(index || ''); } catch { /* Invalid fragments fall back to the first member. */ }
    updateProfile(memberId);
  }
  if (route === 'story') updateStory(Number(index));
  showPage(route, fromUser);
  document.title = (route === 'profile' && selectedMember ? selectedMember.name + ' · BNI Memel' : pageTitles[route]) + ' · Svetainės peržiūra';
  if (fromUser) {
    const heading = root.querySelector('[data-view="' + route + '"] h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }
}
window.addEventListener('hashchange', () => renderRoute(true));
renderRoute(false);
iconRefresh();
})();
