const API_BASE = 'http://localhost:5000';
const qInput = document.getElementById('q');
const typeSelect = document.getElementById('type');
const searchBtn = document.getElementById('searchBtn');
const resultsEl = document.getElementById('results');
const paginationEl = document.getElementById('pagination');
const modalRoot = document.getElementById('modalRoot');

let state = { q:'', type:'', page:1, totalPages:0, totalResults:0 };

function buildUrlSearch(q, type, page){
    const params = new URLSearchParams();
    // even if q is empty string, include it — server treats empty q as no filtering
    params.set('q', q ?? '');
    if(type) params.set('type', type);
    params.set('page', page);
    return `${API_BASE}/api/search?${params.toString()}`;
}
function buildUrlDetails(id){
    return `${API_BASE}/api/details?id=${encodeURIComponent(id)}`;
}

function safeField(obj, ...keys) {
    for (const k of keys) {
        if (obj && (k in obj) && obj[k] !== null && obj[k] !== undefined) return obj[k];
    }
    return undefined;
}

function renderResults(list){
    resultsEl.innerHTML = '';
    if(!list || list.length === 0){
        resultsEl.innerHTML = `<p class="small-muted">No results</p>`;
        return;
    }
    for(const item of list){
        const poster = safeField(item, 'Poster', 'poster') || 'N/A';
        const type = safeField(item, 'Type', 'type') || 'unknown';
        const title = safeField(item, 'Title', 'title') || '—';
        const year = safeField(item, 'Year', 'year') || '—';
        const imdbID = safeField(item, 'imdbID', 'imdbid') || '';

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      <div class="poster">
        ${poster !== 'N/A' ? `<img src="${poster}" alt="${title} poster">` : `<div class="small-muted">No poster</div>`}
      </div>
      <div class="meta">
        <div class="small-muted">${type}</div>
        <div class="title">${title}</div>
        <div class="year">${year}</div>
        <button class="details-btn" data-id="${imdbID}">Details</button>
      </div>
    `;
        resultsEl.appendChild(card);
    }
}

function renderPagination(){
    paginationEl.innerHTML = '';
    if(state.totalPages <= 1) return;
    const createBtn = (text, page, active=false, disabled=false)=>{
        const btn = document.createElement('button');
        btn.textContent = text;
        if(active) btn.classList.add('active');
        if(disabled) btn.disabled = true;
        btn.dataset.page = page;
        return btn;
    };
    const prev = createBtn('<<', Math.max(1, state.page-1), false, state.page===1);
    paginationEl.appendChild(prev);
    const maxButtons = 7;
    let start = Math.max(1, state.page - Math.floor(maxButtons/2));
    let end = Math.min(state.totalPages, start + maxButtons - 1);
    if(end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
    for(let p = start; p <= end; p++){
        const btn = createBtn(p, p, p===state.page);
        paginationEl.appendChild(btn);
    }
    const next = createBtn('>>', Math.min(state.totalPages, state.page+1), false, state.page===state.totalPages);
    paginationEl.appendChild(next);
}

async function doSearch(q = '', type = '', page=1){
    resultsEl.innerHTML = `<p class="small-muted">Loading...</p>`;
    try{
        const url = buildUrlSearch(q.trim(), type, page);
        const res = await fetch(url);
        const data = await res.json();
        if(data.Response === "False"){
            state.totalResults = 0;
            state.totalPages = 0;
            renderResults([]);
            paginationEl.innerHTML = `<p class="small-muted">${data.Error}</p>`;
            return;
        }
        state.q = q;
        state.type = type;
        state.page = page;
        state.totalResults = parseInt(data.totalResults || '0', 10);
        // if server returns totalPages number, trust it as well
        state.totalPages = Math.ceil(state.totalResults / 10) || (data.totalPages || 1);
        renderResults(data.Search || []);
        renderPagination();
    }catch(err){
        console.error('Search error:', err);
        resultsEl.innerHTML = `<p class="small-muted">Error: ${err.message}</p>`;
        paginationEl.innerHTML = '';
    }
}

async function showDetails(imdbID){
    modalRoot.innerHTML = '';
    modalRoot.setAttribute('aria-hidden', 'false');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="left">
        <div class="poster" id="modalPoster">Loading poster...</div>
      </div>
      <div class="right">
        <button class="close-btn" id="closeModal" aria-label="Close modal">Close</button>
        <div id="modalContent">Loading...</div>
      </div>
    </div>
  `;
    modalRoot.appendChild(backdrop);
    modalRoot.classList.remove('hidden');

    document.getElementById('closeModal').addEventListener('click', ()=> closeModal());
    backdrop.addEventListener('click', (ev)=> { if(ev.target === backdrop) closeModal(); });

    try{
        const res = await fetch(buildUrlDetails(imdbID));
        const data = await res.json();

        const poster = safeField(data, 'Poster', 'poster') || 'N/A';
        const title = safeField(data, 'Title', 'title') || '—';

        document.getElementById('modalPoster').innerHTML =
            poster !== 'N/A' ? `<img src="${poster}" alt="${title} poster">` : `<div class="small-muted">No poster</div>`;

        document.getElementById('modalContent').innerHTML = `
      <h3>${title}</h3>
      <p class="small-muted">Released: ${safeField(data, 'Released') || '—'}</p>
      <p><strong>Genre:</strong> ${safeField(data, 'Genre') || '—'}</p>
      <p><strong>Country:</strong> ${safeField(data, 'Country') || '—'}</p>
      <p><strong>Director:</strong> ${safeField(data, 'Director') || '—'}</p>
      <p><strong>Writer:</strong> ${safeField(data, 'Writer') || '—'}</p>
      <p><strong>Actors:</strong> ${safeField(data, 'Actors') || '—'}</p>
      <p><strong>Awards:</strong> ${safeField(data, 'Awards') || '—'}</p>
      <p><strong>Plot:</strong> ${safeField(data, 'Plot') || '—'}</p>
      <p><strong>IMDb Rating:</strong> ${safeField(data, 'imdbRating') || '—'}</p>
    `;
    }catch(err){
        console.error('Details error:', err);
        document.getElementById('modalContent').innerHTML = `<p class="small-muted">Error: ${err.message}</p>`;
    }

    function closeModal(){
        modalRoot.classList.add('hidden');
        modalRoot.innerHTML = '';
        modalRoot.setAttribute('aria-hidden', 'true');
    }
}

searchBtn.addEventListener('click', ()=> {
    const q = qInput.value;
    const type = typeSelect.value;
    doSearch(q, type, 1);
});
qInput.addEventListener('keydown', (e)=> { if(e.key === 'Enter'){ searchBtn.click(); } });

paginationEl.addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const page = Number(btn.dataset.page);
    if(page && page !== state.page){
        doSearch(state.q, state.type, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

resultsEl.addEventListener('click', (e)=>{
    const btn = e.target.closest('.details-btn');
    if(!btn) return;
    const id = btn.dataset.id;
    if(id) showDetails(id);
});

let typingTimer;
qInput.addEventListener('input', ()=>{
    clearTimeout(typingTimer);
    typingTimer = setTimeout(()=> {
        doSearch(qInput.value.trim(), typeSelect.value, 1);
    }, 600);
});

document.addEventListener('DOMContentLoaded', () => {
    doSearch('', '', 1);
});
