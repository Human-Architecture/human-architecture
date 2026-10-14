(()=>{
  const corePages=[
    {title:'Makahiya × Human Architecture',url:'/kooperationen/performance/makahiya/',category:'HYROX, fitness & wellbeing partnership',description:'A tailored Human Architecture partnership proposal for Makahiya Fitness: three weekly integration sessions that complement HYROX, strength training and coaching.',terms:'makahiya sri lanka hyrox fitness wellness wellbeing hotel performance partnership recovery mobility breath'},
    {title:'Upcoming events',url:'/events/',category:'Events',description:'See confirmed upcoming Human Architecture workshops and how to reserve a place.',terms:'events upcoming next workshop termine veranstaltungen body language clever fit 28 november'},
    {title:'BODY LANGUAGE workshop',url:'/body-language/en/',category:'Workshop',description:'A 90–120 minute group workshop for body awareness, meaningful reflection and a clearer personal focus.',terms:'body language workshop körper sprache group training awareness fitness'},
    {title:'The Codex',url:'/codex/',category:'Human Architecture',description:'Explore Human Architecture readings, orientation and the current sky.',terms:'codex reading astrology current sky personal pattern'},
    {title:'Contact Human Architecture',url:'/#contact',category:'Contact',description:'Start a conversation about a programme, a partnership or a personal enquiry.',terms:'contact email enquiry collaboration conversation'}
  ];
  const input=document.querySelector('#search-input'),form=document.querySelector('#site-search'),results=document.querySelector('#search-results'),status=document.querySelector('#search-status');
  let pages=[...corePages],fullIndexReady=false;
  const normalize=value=>(value||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const pageUrl=path=>new URL(path,location.origin).pathname.replace(/index\.html$/,'').replace(/\/$/,'')||'/';
  const uniquePages=list=>Array.from(new Map(list.map(page=>[pageUrl(page.url),page])).values());
  const excerpt=(doc,description)=>description||doc.querySelector('main p, article p, p')?.textContent.replace(/\s+/g,' ').trim().slice(0,210)||'Explore this Human Architecture page.';
  async function loadFullIndex(){
    try{
      const sitemap=await fetch('/sitemap.xml',{cache:'no-cache'}).then(response=>response.ok?response.text():Promise.reject());
      const xml=new DOMParser().parseFromString(sitemap,'application/xml');
      const urls=[...xml.querySelectorAll('loc')].map(node=>node.textContent).filter(url=>new URL(url).origin===location.origin);
      const fetched=await Promise.all(urls.map(async url=>{
        try{
          const markup=await fetch(url,{cache:'no-cache'}).then(response=>response.ok?response.text():Promise.reject());
          const doc=new DOMParser().parseFromString(markup,'text/html');
          const title=(doc.querySelector('h1')?.textContent||doc.title||'Human Architecture').replace(/\s+/g,' ').trim();
          const description=doc.querySelector('meta[name="description"]')?.content||'';
          const keywords=[...doc.querySelectorAll('h1,h2,h3,a')].map(node=>node.textContent).join(' ');
          return {title,url:new URL(url).pathname,category:'Human Architecture',description:excerpt(doc,description),terms:keywords};
        }catch{return null;}
      }));
      pages=uniquePages([...corePages,...fetched.filter(Boolean)]);
      fullIndexReady=true;
      if(input.value.trim())render(input.value);
    }catch{fullIndexReady=true;}
  }
  function render(raw){
    const query=normalize(raw);results.replaceChildren();
    if(!query){status.textContent='Search by a topic, person, partnership or programme.';return;}
    const words=query.split(/\s+/).filter(Boolean);
    const matches=pages.map(page=>{
      const title=normalize(page.title), haystack=normalize([page.title,page.category,page.description,page.terms].join(' '));
      const score=words.reduce((total,word)=>total+(title.includes(word)?5:0)+(haystack.includes(word)?1:0),0);
      return {page,score};
    }).filter(item=>item.score).sort((a,b)=>b.score-a.score||a.page.title.localeCompare(b.page.title));
    const indexNote=fullIndexReady?'':' Searching the wider site…';
    status.textContent=matches.length===1?`1 relevant page found.${indexNote}`:`${matches.length} relevant pages found.${indexNote}`;
    if(!matches.length){const message=document.createElement('div');message.className='search-empty';message.innerHTML='No exact match yet. Try a broader word such as <strong>workshop</strong>, <strong>partnership</strong>, <strong>sessions</strong> or <strong>Codex</strong>—or <a href="mailto:hello@human-architecture.info?subject=Website%20search%20help">ask us directly</a>.';results.append(message);return;}
    matches.forEach(({page})=>{const card=document.createElement('a');card.className='search-card';card.href=page.url;const category=document.createElement('small'),heading=document.createElement('h2'),copy=document.createElement('p');category.textContent=page.category;heading.textContent=page.title;copy.textContent=page.description;card.append(category,heading,copy);results.append(card);});
  }
  const initial=new URLSearchParams(location.search).get('q')||'';input.value=initial;render(initial);loadFullIndex();
  form.addEventListener('submit',event=>{event.preventDefault();const value=input.value.trim();history.replaceState(null,'',value?`?q=${encodeURIComponent(value)}`:location.pathname);render(value);});
  document.querySelectorAll('[data-search]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.search;form.requestSubmit();input.focus();}));
})();
