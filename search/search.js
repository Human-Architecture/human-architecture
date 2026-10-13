(()=>{
  const pages=[
    {title:'Makahiya × Human Architecture',url:'/kooperationen/performance/makahiya/',category:'Partnership proposal',description:'A tailored proposal for Makahiya Fitness: three weekly integration sessions that complement HYROX, strength training and coaching.',terms:'makahiya sri lanka hyrox fitness hotel performance partnership recovery mobility breath'},
    {title:'Performance & movement partnerships',url:'/kooperationen/performance/',category:'Partnerships',description:'A considered collaboration for gyms, strength spaces, HYROX communities, studios and retreat hosts.',terms:'performance movement hyrox crossfit gym strength coach trainer partnership collaboration'},
    {title:'BODY LANGUAGE workshop',url:'/body-language/en/',category:'Workshop',description:'A 90–120 minute group workshop for body awareness, meaningful reflection and a clearer personal focus.',terms:'body language workshop körper sprache group training awareness fitness'},
    {title:'Host BODY LANGUAGE',url:'/body-language/en/partners/',category:'Partnerships',description:'Information for studios, trainers and hosts considering a BODY LANGUAGE workshop for their community.',terms:'host workshop studio trainer partner partnership body language'},
    {title:'Book BODY LANGUAGE',url:'/body-language/book/',category:'Booking',description:'Register for the BODY LANGUAGE workshop and choose your payment route.',terms:'book booking anmeldung workshop payment clever fit amberg kümmersbruck'},
    {title:'Upcoming events',url:'/events/',category:'Events',description:'See confirmed upcoming Human Architecture workshops and how to reserve a place.',terms:'events upcoming next workshop termine veranstaltungen body language clever fit 28 november'},
    {title:'The Codex',url:'/codex/',category:'Human Architecture',description:'Explore Human Architecture readings, orientation and the current sky.',terms:'codex reading astrology current sky personal pattern'},
    {title:'Current Sky',url:'/codex/current-sky/',category:'Codex',description:'An orientation to the current astrological sky and its wider context.',terms:'current sky astrology transits codex'},
    {title:'Personal Human Architecture sessions',url:'/sessions/',category:'Sessions',description:'Explore individual sessions and body-oriented work in a personally agreed setting.',terms:'sessions private personal bodywork recovery individual appointment'},
    {title:'International corporate programmes',url:'/organizations/international/',category:'Organisations',description:'Human Architecture programmes for international organisations and teams.',terms:'international corporate organisation team leadership programme'},
    {title:'Human Architecture',url:'/',category:'Start here',description:'An introduction to Human Architecture and its three connected domains.',terms:'human architecture start introduction about'},
    {title:'Contact Human Architecture',url:'/#contact',category:'Contact',description:'Start a conversation about a programme, a partnership or a personal enquiry.',terms:'contact email enquiry collaboration conversation'}
  ];
  const input=document.querySelector('#search-input'),form=document.querySelector('#site-search'),results=document.querySelector('#search-results'),status=document.querySelector('#search-status');
  const normalize=value=>value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  function render(raw){
    const query=normalize(raw); results.replaceChildren();
    if(!query){status.textContent='Choose a topic above or enter a search.';return;}
    const words=query.split(/\s+/).filter(Boolean);
    const matches=pages.map(page=>{const haystack=normalize([page.title,page.category,page.description,page.terms].join(' '));const score=words.reduce((total,word)=>total+(haystack.includes(word)?1:0),0);return{page,score};}).filter(item=>item.score).sort((a,b)=>b.score-a.score||a.page.title.localeCompare(b.page.title));
    status.textContent=matches.length===1?'1 relevant page found.':`${matches.length} relevant pages found.`;
    if(!matches.length){const message=document.createElement('div');message.className='search-empty';message.innerHTML='No exact match yet. Try a broader word such as <strong>workshop</strong>, <strong>partnership</strong>, <strong>sessions</strong> or <strong>Codex</strong>—or <a href="mailto:hello@human-architecture.info?subject=Website%20search%20help">ask us directly</a>.';results.append(message);return;}
    matches.forEach(({page})=>{const card=document.createElement('a');card.className='search-card';card.href=page.url;card.innerHTML=`<small>${page.category}</small><h2>${page.title}</h2><p>${page.description}</p>`;results.append(card);});
  }
  const initial=new URLSearchParams(location.search).get('q')||'';input.value=initial;render(initial);
  form.addEventListener('submit',event=>{event.preventDefault();const value=input.value.trim();history.replaceState(null,'',value?`?q=${encodeURIComponent(value)}`:location.pathname);render(value);});
  document.querySelectorAll('[data-search]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.search;form.requestSubmit();input.focus();}));
})();
