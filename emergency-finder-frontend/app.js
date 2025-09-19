// Data in localStorage
const storageKey = 'emergencyFinderData';
let data = JSON.parse(localStorage.getItem(storageKey)) || {providers:[], requests:[]};

function saveData(){localStorage.setItem(storageKey, JSON.stringify(data));}

// Add provider
document.getElementById('addForm').addEventListener('submit',e=>{
  e.preventDefault();
  const provider={
    id:Date.now(),
    type:document.getElementById('entryType').value,
    name:document.getElementById('name').value,
    contact:document.getElementById('contact').value,
    item:document.getElementById('item').value,
    city:document.getElementById('city').value,
    notes:document.getElementById('notes').value
  };
  data.providers.push(provider); saveData(); alert('Added successfully');
  e.target.reset();
});

// Add request
document.getElementById('requestForm').addEventListener('submit',e=>{
  e.preventDefault();
  const req={
    id:Date.now(),
    name:document.getElementById('reqName').value,
    contact:document.getElementById('reqContact').value,
    item:document.getElementById('reqItem').value,
    city:document.getElementById('reqCity').value,
    notes:document.getElementById('reqNotes').value
  };
  data.requests.push(req); saveData(); renderRequests(); e.target.reset();
});

function renderRequests(){
  const list=document.getElementById('requestList'); list.innerHTML='';
  data.requests.forEach(r=>{
    const div=document.createElement('div'); div.className='entry';
    div.textContent=`${r.name} (${r.contact}) needs ${r.item} in ${r.city}`;
    list.appendChild(div);
  });
}
renderRequests();

// Search
document.getElementById('searchForm').addEventListener('submit',e=>{
  e.preventDefault();
  const type=document.getElementById('filterType').value;
  const query=document.getElementById('filterQuery').value.toLowerCase();
  const city=document.getElementById('filterCity').value.toLowerCase();
  const res=document.getElementById('results'); res.innerHTML='';
  const matches=data.providers.filter(p=>(type==='all'||p.type===type)&&
    (p.item.toLowerCase().includes(query)||p.name.toLowerCase().includes(query))&&
    p.city.toLowerCase().includes(city));
  if(matches.length===0){res.textContent='No matches found.';return;}
  matches.forEach(p=>{
    const div=document.createElement('div');div.className='entry';
    div.textContent=`${p.type.toUpperCase()}: ${p.name} (${p.contact}) - ${p.item} in ${p.city}`;
    res.appendChild(div);
  });
});

// Export JSON
document.getElementById('exportJson').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(data)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='data.json';a.click();
});

// Export CSV (providers only for demo)
document.getElementById('exportCsv').addEventListener('click',()=>{
  let csv='Type,Name,Contact,Item,City,Notes\n';
  data.providers.forEach(p=>{csv+=`${p.type},${p.name},${p.contact},${p.item},${p.city},${p.notes}\n`;});
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='providers.csv';a.click();
});

// Import
document.getElementById('importFile').addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{data=JSON.parse(reader.result);saveData();renderRequests();alert('Imported');}
    catch(err){alert('Invalid file');}
  };
  reader.readAsText(file);
});
