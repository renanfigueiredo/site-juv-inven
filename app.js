// Ano dinâmico
document.getElementById('year')?.append(new Date().getFullYear());

// Theme toggle com persistência e melhores ícones
const themeBtn = document.getElementById('toggleTheme');
if (themeBtn) {
  // Carrega o tema salvo ou usa o padrão (escuro)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.remove('dark');
    themeBtn.textContent = '🌙';
  } else {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️';
  }
  
  themeBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Util: fetch markdown and render in modal
async function openMarkdown(path){
  const modalEl=document.getElementById('mdModal');
  const titleEl=document.getElementById('mdTitle');
  const contentEl=document.getElementById('mdContent');
  if(!modalEl||!titleEl||!contentEl)return;
  contentEl.classList.add('md-loading');
  contentEl.innerHTML='Carregando...';
  const name=path.split('/').pop().replace(/[-_]/g,' ').replace(/\.md$/,'');
  titleEl.textContent=name;
  try{
    const res=await fetch(path);
    if(!res.ok) throw new Error(res.status);
    const text=await res.text();
    contentEl.innerHTML=marked.parse(text);
  }catch(e){
    console.warn('CORS error loading:', path);
    contentEl.innerHTML=`
      <div class="alert alert-warning">
        <h6><i class="bi bi-exclamation-triangle"></i> Arquivo não pode ser carregado</h6>
        <p class="small">Por questões de segurança, o navegador bloqueia o carregamento de arquivos locais.</p>
        <p class="small mb-2"><strong>Soluções:</strong></p>
        <ol class="small">
          <li>Use os links HTML quando disponíveis</li>
          <li>Execute um servidor local: <code>python -m http.server 8000</code></li>
          <li>Ou abra diretamente: <a href="${path}" target="_blank" class="text-warning">${name}</a></li>
        </ol>
      </div>`;
  }finally{contentEl.classList.remove('md-loading');}
  const bsModal=new bootstrap.Modal(modalEl);bsModal.show();
}

// Attach click to elements with data-md
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-md]');
  if(t){e.preventDefault();openMarkdown(t.getAttribute('data-md'));}
});

// Pilares verses - expandir versículos nos cards de pilares
document.querySelectorAll('#pilares [data-ref]').forEach(card=>{
  card.addEventListener('click',()=>{
    const ref=card.getAttribute('data-ref');
    const box=card.querySelector('.verse-block');
    if(!box)return;
    if(!box.classList.contains('d-none')){box.classList.add('d-none');return;}
    box.classList.remove('d-none');
    const verse=window.Verses?.[ref]||`[${ref}] Texto (ARA) adicionar localmente.`;
    box.textContent=verse;
  });
});

// Expandir versículos clicáveis no texto
document.querySelectorAll('.verse-ref').forEach(ref => {
  ref.addEventListener('click', function() {
    const verseKey = this.getAttribute('data-ref');
    let expanded = this.parentNode.querySelector('.verse-expanded');
    
    if (expanded) {
      expanded.remove();
      return;
    }
    
    const verse = window.Verses?.[verseKey] || `[${verseKey}] Texto não encontrado.`;
    expanded = document.createElement('div');
    expanded.className = 'verse-expanded';
    expanded.textContent = verse;
    
    this.parentNode.appendChild(expanded);
  });
});
