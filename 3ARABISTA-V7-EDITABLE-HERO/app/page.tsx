
'use client';
import { useEffect, useState } from 'react';
type Lang='ar'|'en';
export default function Page(){
  const [lang,setLang]=useState<Lang>('ar'); const [mounted,setMounted]=useState(false);
  const [activeTab,setActiveTab]=useState('home'); const [sections,setSections]=useState<any[]>([]);
  const [products,setProducts]=useState<any[]>([]); const [contacts,setContacts]=useState<any[]>([]);
  const [customTabs,setCustomTabs]=useState<any[]>([]); const [messages,setMessages]=useState<any[]>([]);
  const [about,setAbout]=useState<any>({}); const [hero,setHero]=useState<any>(null);
  const [cart,setCart]=useState<any[]>([]); const [showCart,setShowCart]=useState(false); const [showComing,setShowComing]=useState(false);
  const [isAdmin,setIsAdmin]=useState(false); const [adminAuth,setAdminAuth]=useState(false);
  const [adminPass,setAdminPass]=useState(''); const [adminView,setAdminView]=useState('overview');
  const [secForm,setSecForm]=useState({type:'hero',title_ar:'',title_en:'',text_ar:'',text_en:'',image_url:'',bg_color:'#1A1207',order_index:0});
  const [prodForm,setProdForm]=useState({id:'',name_ar:'',name_en:'',desc_ar:'',desc_en:'',price:'',category:'Espresso',image_url:'',is_top:false});
  const [editingProd,setEditingProd]=useState(false);
  const [contactForm,setContactForm]=useState({type:'whatsapp',label_ar:'',label_en:'',value:''});
  const [tabForm,setTabForm]=useState({slug:'',title_ar:'',title_en:'',icon:'✦'});
  const [aboutForm,setAboutForm]=useState({story_ar:'',story_en:'',mission_ar:'',mission_en:'',vision_ar:'',vision_en:''});
  const [heroForm,setHeroForm]=useState({title_ar:'عربيتسا',title_en:'3ARABISTA',subtitle_ar:'نكهة أصيلة، تحضير عصري. كل رشفة تحكي قصة.',subtitle_en:'Authentic flavor, modern brew.',badge_ar:'قهوة مختصة بروح عربية',badge_en:'Specialty coffee',images:[] as string[],cta1_ar:'تصفح المتجر',cta1_en:'Browse Shop',cta1_link:'products',cta2_ar:'قصتنا',cta2_en:'Our Story',cta2_link:'about'});
  const [msgForm,setMsgForm]=useState({name:'',email:'',phone:'',message:''});
  const [newPwd,setNewPwd]=useState(''); const [uploading,setUploading]=useState(false); const [heroIdx,setHeroIdx]=useState(0);

  useEffect(()=>{ setMounted(true); const h=typeof window!=='undefined'?window.location.hash.replace('#',''):''; if(h==='admin') setIsAdmin(true); if(h && h!=='admin') setActiveTab(h); loadAll(); const iv=setInterval(()=>setHeroIdx(i=>i+1),4000); return ()=>clearInterval(iv); },[]);
  const loadAll=async()=>{
    try{
      await fetch('/api/init'); await fetch('/api/fix-db');
      const [s,p,c,ct,m,a,hr]=await Promise.all([
        fetch('/api/home-sections').then(r=>r.json()).catch(()=>[]),
        fetch('/api/products').then(r=>r.json()).catch(()=>[]),
        fetch('/api/contact-methods').then(r=>r.json()).catch(()=>[]),
        fetch('/api/custom-tabs').then(r=>r.json()).catch(()=>[]),
        fetch('/api/messages').then(r=>r.json()).catch(()=>[]),
        fetch('/api/about').then(r=>r.json()).catch(()=>({})),
        fetch('/api/hero').then(r=>r.json()).catch(()=>null),
      ]);
      if(Array.isArray(s)) setSections(s); if(Array.isArray(p)) setProducts(p); if(Array.isArray(c)) setContacts(c); if(Array.isArray(ct)) setCustomTabs(ct); if(Array.isArray(m)) setMessages(m); setAbout(a||{});
      if(a) setAboutForm({story_ar:a.story_ar||'',story_en:a.story_en||'',mission_ar:a.mission_ar||'',mission_en:a.mission_en||'',vision_ar:a.vision_ar||'',vision_en:a.vision_en||''});
      if(hr && hr.id){ setHero(hr); setHeroForm({title_ar:hr.title_ar||'',title_en:hr.title_en||'',subtitle_ar:hr.subtitle_ar||'',subtitle_en:hr.subtitle_en||'',badge_ar:hr.badge_ar||'',badge_en:hr.badge_en||'',images:hr.images||[],cta1_ar:hr.cta1_ar||'',cta1_en:hr.cta1_en||'',cta1_link:hr.cta1_link||'products',cta2_ar:hr.cta2_ar||'',cta2_en:hr.cta2_en||'',cta2_link:hr.cta2_link||'about'}); }
    }catch{}
  };
  const isAr=lang==='ar'; const t=(ar:string,en:string)=>isAr?ar:en;
  const handleUpload=async(file:File)=>{
    if(!file) return null; setUploading(true);
    try{
      const fd=new FormData(); fd.append('file',file);
      const r=await fetch('/api/upload',{method:'POST',body:fd}); const d=await r.json();
      if(d.url) return d.url; alert(d.error||'فشل'); return null;
    }finally{ setUploading(false); }
  };

  if(!mounted) return <div className="min-h-screen bg-[#1A1207] flex items-center justify-center text-white">Loading...</div>;

  if(isAdmin){
    if(!adminAuth){
      return <div className="min-h-screen bg-[#0f0a04] flex items-center justify-center p-4"><div className="bg-[#FFFBF5] rounded-[2rem] p-10 max-w-sm w-full"><div className="flex justify-center mb-8"><img src="/logo.png" className="h-16 w-16 rounded-full bg-black p-1"/></div><input type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder="كلمة المرور" className="w-full bg-white border border-black/10 p-4 rounded-2xl mb-4 outline-none"/><button onClick={async()=>{ const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:adminPass})}); if(r.ok) setAdminAuth(true); else alert('غير صحيحة'); }} className="w-full bg-[#1A1207] text-white py-4 rounded-full">دخول</button></div></div>;
    }
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex">
        <aside className="w-64 bg-[#1A1207] text-white p-7 hidden md:flex flex-col"><div className="flex items-center gap-3 mb-12"><img src="/logo.png" className="h-8 w-8 rounded-full bg-black"/><span className="font-bold tracking-widest text-sm">3ARABISTA</span></div>
          {[
            ['overview','نظرة عامة'],['hero','الواجهة الرئيسية'],['home','أقسام إضافية'],['products','المنتجات'],['about','من نحن'],['tabs','صفحات'],['contact','التواصل'],['messages','الرسائل'],['settings','الإعدادات'],
          ].map(([id,label])=><button key={id} onClick={()=>setAdminView(id)} className={`w-full text-right p-3.5 rounded-2xl mb-1 text-sm ${adminView===id?'bg-[#F5F1E8] text-black font-medium':'hover:bg-white/10 opacity-70'}`}>{label}</button>)}
          <button onClick={()=>{ setIsAdmin(false); setAdminAuth(false); if(typeof window!=='undefined') window.location.hash=''; }} className="mt-auto text-sm opacity-40">خروج</button>
        </aside>
        <main className="flex-1 p-5 md:p-10 overflow-auto">
          <div className="md:hidden flex gap-2 overflow-auto mb-6">{['overview','hero','home','products','about','tabs','contact','messages'].map(id=><button key={id} onClick={()=>setAdminView(id)} className={`px-4 py-2 rounded-full text-xs whitespace-nowrap ${adminView===id?'bg-black text-white':'bg-white'}`}>{id}</button>)}</div>

          {adminView==='overview' && <div><h1 className="text-3xl font-bold mb-8">نظرة عامة</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-5"><div className="bg-white p-7 rounded-[1.5rem] border"><div className="text-3xl font-bold">{products.length}</div><div className="text-sm opacity-50">منتج</div></div><div className="bg-white p-7 rounded-[1.5rem] border"><div className="text-3xl font-bold">{sections.length}</div><div className="text-sm opacity-50">قسم</div></div><div className="bg-white p-7 rounded-[1.5rem] border"><div className="text-3xl font-bold">{messages.length}</div><div className="text-sm opacity-50">رسالة</div></div><div className="bg-white p-7 rounded-[1.5rem] border"><div className="text-3xl font-bold">{customTabs.length}</div><div className="text-sm opacity-50">صفحة</div></div></div></div>}

          {adminView==='hero' && (
            <div><h2 className="text-2xl font-bold mb-6">تعديل الواجهة الرئيسية - Hero</h2>
              <div className="bg-white p-7 rounded-[1.8rem] border grid gap-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={heroForm.badge_ar} onChange={e=>setHeroForm({...heroForm,badge_ar:e.target.value})} placeholder="الشارة الصغيرة AR" className="border p-3.5 rounded-2xl bg-[#FFFBF5]"/>
                  <input value={heroForm.badge_en} onChange={e=>setHeroForm({...heroForm,badge_en:e.target.value})} placeholder="Badge EN" className="border p-3.5 rounded-2xl"/>
                  <input value={heroForm.title_ar} onChange={e=>setHeroForm({...heroForm,title_ar:e.target.value})} placeholder="العنوان الكبير AR - عربيتسا" className="border p-3.5 rounded-2xl bg-[#FFFBF5]"/>
                  <input value={heroForm.title_en} onChange={e=>setHeroForm({...heroForm,title_en:e.target.value})} placeholder="Title EN - 3ARABISTA" className="border p-3.5 rounded-2xl"/>
                  <textarea value={heroForm.subtitle_ar} onChange={e=>setHeroForm({...heroForm,subtitle_ar:e.target.value})} placeholder="الوصف AR" className="border p-3.5 rounded-2xl md:col-span-2 h-20 bg-[#FFFBF5]"/>
                  <textarea value={heroForm.subtitle_en} onChange={e=>setHeroForm({...heroForm,subtitle_en:e.target.value})} placeholder="Subtitle EN" className="border p-3.5 rounded-2xl md:col-span-2 h-20"/>
                </div>
                <div className="grid md:grid-cols-2 gap-4 border-t pt-5">
                  <div><label className="text-xs">صور الواجهة - تقدر تضيف أكتر من صورة (مالتي)</label><input type="file" multiple accept="image/*" onChange={async e=>{ if(e.target.files){ const urls=[]; for(const f of Array.from(e.target.files)){ const url=await handleUpload(f); if(url) urls.push(url); } setHeroForm(prev=>({...prev, images:[...prev.images, ...urls]})); } }} className="w-full border p-3 rounded-2xl mt-2"/>
                    <div className="flex flex-wrap gap-2 mt-3">{heroForm.images.map((img,i)=><div key={i} className="relative"><img src={img} className="w-20 h-20 rounded-xl object-cover border"/><button onClick={()=>setHeroForm({...heroForm, images:heroForm.images.filter((_,idx)=>idx!==i)})} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs">x</button></div>)}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2"><input value={heroForm.cta1_ar} onChange={e=>setHeroForm({...heroForm,cta1_ar:e.target.value})} placeholder="زر 1 AR - تصفح المتجر" className="border p-3 rounded-xl flex-1 bg-[#FFFBF5]"/><input value={heroForm.cta1_link} onChange={e=>setHeroForm({...heroForm,cta1_link:e.target.value})} placeholder="لينك" className="border p-3 rounded-xl w-24"/></div>
                    <div className="flex gap-2"><input value={heroForm.cta2_ar} onChange={e=>setHeroForm({...heroForm,cta2_ar:e.target.value})} placeholder="زر 2 AR - قصتنا" className="border p-3 rounded-xl flex-1"/><input value={heroForm.cta2_link} onChange={e=>setHeroForm({...heroForm,cta2_link:e.target.value})} placeholder="لينك" className="border p-3 rounded-xl w-24"/></div>
                    <div className="text-xs opacity-50">لينكات: products, about, contact أو أي slug لصفحة إضافية</div>
                  </div>
                </div>
                <button onClick={async()=>{ const r=await fetch('/api/hero',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(heroForm)}); if(r.ok){ alert('تم حفظ الواجهة الرئيسية'); loadAll(); } }} className="bg-black text-white py-4 rounded-full font-medium">حفظ الواجهة</button>
              </div>
            </div>
          )}

          {adminView==='products' && (
            <div><h2 className="text-2xl font-bold mb-6">المنتجات - تعديل كامل</h2>
              <div className="bg-white p-7 rounded-[1.8rem] border grid md:grid-cols-2 gap-4 mb-8">
                <input value={prodForm.name_ar} onChange={e=>setProdForm({...prodForm,name_ar:e.target.value})} placeholder="اسم المنتج *" className="border p-3.5 rounded-2xl bg-[#FFFBF5]"/>
                <input value={prodForm.name_en} onChange={e=>setProdForm({...prodForm,name_en:e.target.value})} placeholder="Name EN" className="border p-3.5 rounded-2xl"/>
                <textarea value={prodForm.desc_ar} onChange={e=>setProdForm({...prodForm,desc_ar:e.target.value})} placeholder="وصف" className="border p-3.5 rounded-2xl h-20"/>
                <textarea value={prodForm.desc_en} onChange={e=>setProdForm({...prodForm,desc_en:e.target.value})} placeholder="Description" className="border p-3.5 rounded-2xl h-20"/>
                <input value={prodForm.price} onChange={e=>setProdForm({...prodForm,price:e.target.value})} placeholder="السعر *" className="border p-3.5 rounded-2xl"/>
                <input value={prodForm.category} onChange={e=>setProdForm({...prodForm,category:e.target.value})} placeholder="التصنيف" className="border p-3.5 rounded-2xl"/>
                <div className="md:col-span-2">
                  <input type="file" accept="image/*" onChange={async e=>{ if(e.target.files?.[0]){ const url=await handleUpload(e.target.files[0]); if(url) setProdForm({...prodForm,image_url:url}); } }} className="w-full border p-3.5 rounded-2xl bg-[#FFFBF5]"/>
                  {prodForm.image_url && <img src={prodForm.image_url} className="h-28 mt-3 rounded-2xl object-cover"/>}
                  {uploading && <div className="text-xs mt-2">جاري الرفع...</div>}
                </div>
                <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={prodForm.is_top} onChange={e=>setProdForm({...prodForm,is_top:e.target.checked})}/> مميز</label>
                <div className="flex gap-2 md:col-span-2">
                  <button onClick={async()=>{
                    if(!prodForm.name_ar || !prodForm.price) return alert('الاسم والسعر مطلوب');
                    if(!prodForm.image_url) return alert('ارفع صورة');
                    if(uploading) return alert('انتظر الرفع');
                    const r=await fetch('/api/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(prodForm)});
                    const d=await r.json(); if(r.ok){ loadAll(); setProdForm({id:'',name_ar:'',name_en:'',desc_ar:'',desc_en:'',price:'',category:'Espresso',image_url:'',is_top:false}); setEditingProd(false); alert(editingProd?'تم التعديل':'تمت الإضافة'); } else alert(d.error);
                  }} className="flex-1 bg-black text-white py-4 rounded-full">{editingProd?'تعديل المنتج':'إضافة منتج'}</button>
                  {editingProd && <button onClick={()=>{ setProdForm({id:'',name_ar:'',name_en:'',desc_ar:'',desc_en:'',price:'',category:'Espresso',image_url:'',is_top:false}); setEditingProd(false); }} className="px-6 border rounded-full">إلغاء</button>}
                </div>
              </div>
              <div><h3 className="font-bold mb-4">قائمة المنتجات - تعديل / حذف</h3><div className="grid md:grid-cols-3 gap-4">{products.map((p:any)=><div key={p.id} className="bg-white p-4 rounded-2xl border"><img src={p.image_url} className="h-40 w-full object-cover rounded-xl mb-3"/><div className="font-bold text-sm">{p.name_ar}</div><div className="text-sm opacity-60">{p.price} EGP - {p.category}</div><div className="flex gap-2 mt-3"><button onClick={()=>{ setProdForm({id:p.id,name_ar:p.name_ar,name_en:p.name_en,desc_ar:p.desc_ar,desc_en:p.desc_en,price:p.price,category:p.category,image_url:p.image_url,is_top:p.is_top}); setEditingProd(true); window.scrollTo({top:0,behavior:'smooth'}); }} className="flex-1 bg-[#F5F1E8] py-2 rounded-full text-xs">تعديل</button><button onClick={async()=>{ if(confirm('حذف؟')){ await fetch(`/api/products?id=${p.id}`,{method:'DELETE'}); loadAll(); } }} className="flex-1 bg-red-50 text-red-500 py-2 rounded-full text-xs">حذف</button></div></div>)}</div></div>
            </div>
          )}

          {adminView==='home' && (
            <div><h2 className="text-xl font-bold mb-4">أقسام إضافية</h2>
              <div className="bg-white p-6 rounded-2xl border grid md:grid-cols-2 gap-3 mb-6">
                <select value={secForm.type} onChange={e=>setSecForm({...secForm,type:e.target.value})} className="border p-3 rounded-xl"><option value="split">صورة + نص</option><option value="image_only">صورة</option><option value="text_only">نص</option><option value="top_products">منتجات مميزة</option></select>
                <input type="number" value={secForm.order_index} onChange={e=>setSecForm({...secForm,order_index:parseInt(e.target.value)||0})} placeholder="ترتيب" className="border p-3 rounded-xl"/>
                <input value={secForm.title_ar} onChange={e=>setSecForm({...secForm,title_ar:e.target.value})} placeholder="عنوان" className="border p-3 rounded-xl"/>
                <input value={secForm.title_en} onChange={e=>setSecForm({...secForm,title_en:e.target.value})} placeholder="Title" className="border p-3 rounded-xl"/>
                <textarea value={secForm.text_ar} onChange={e=>setSecForm({...secForm,text_ar:e.target.value})} placeholder="نص AR" className="border p-3 rounded-xl md:col-span-2"/>
                <div className="md:col-span-2"><input type="file" accept="image/*" onChange={async e=>{ if(e.target.files?.[0]){ const url=await handleUpload(e.target.files[0]); if(url) setSecForm({...secForm,image_url:url}); } }} className="w-full border p-3 rounded-xl"/>{secForm.image_url && <img src={secForm.image_url} className="h-20 mt-2 rounded"/>}</div>
                <button onClick={async()=>{ const r=await fetch('/api/home-sections',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(secForm)}); if(r.ok) loadAll(); }} className="bg-black text-white p-3 rounded-full md:col-span-2">حفظ</button>
              </div>
              <div className="space-y-2">{sections.map((s:any)=><div key={s.id} className="bg-white p-4 rounded-xl flex justify-between"><span>{s.type} - {s.title_ar}</span><button onClick={async()=>{ await fetch(`/api/home-sections?id=${s.id}`,{method:'DELETE'}); loadAll(); }} className="text-red-400 text-sm">حذف</button></div>)}</div>
            </div>
          )}
          {adminView==='about' && <div><h2 className="text-xl font-bold mb-4">من نحن</h2><div className="bg-white p-6 rounded-2xl grid gap-3"><textarea value={aboutForm.story_ar} onChange={e=>setAboutForm({...aboutForm,story_ar:e.target.value})} placeholder="قصتنا AR" className="border p-3 rounded-xl h-24"/><textarea value={aboutForm.story_en} onChange={e=>setAboutForm({...aboutForm,story_en:e.target.value})} placeholder="Story EN" className="border p-3 rounded-xl h-24"/><button onClick={async()=>{ const r=await fetch('/api/about',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(aboutForm)}); if(r.ok) alert('تم'); }} className="bg-black text-white p-3 rounded-full">حفظ</button></div></div>}
          {adminView==='tabs' && <div><h2 className="text-xl font-bold mb-4">صفحات</h2><div className="bg-white p-6 rounded-2xl grid md:grid-cols-4 gap-3 mb-6"><input value={tabForm.slug} onChange={e=>setTabForm({...tabForm,slug:e.target.value.toLowerCase()})} placeholder="slug" className="border p-3 rounded-xl"/><input value={tabForm.title_ar} onChange={e=>setTabForm({...tabForm,title_ar:e.target.value})} placeholder="AR" className="border p-3 rounded-xl"/><input value={tabForm.title_en} onChange={e=>setTabForm({...tabForm,title_en:e.target.value})} placeholder="EN" className="border p-3 rounded-xl"/><button onClick={async()=>{ const r=await fetch('/api/custom-tabs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(tabForm)}); if(r.ok) loadAll(); }} className="bg-black text-white p-3 rounded-full">حفظ</button></div><div className="space-y-2">{customTabs.map((tb:any)=><div key={tb.id} className="bg-white p-4 rounded-xl flex justify-between"><span>{tb.slug} - {tb.title_ar}</span><button onClick={async()=>{ await fetch(`/api/custom-tabs?id=${tb.id}`,{method:'DELETE'}); loadAll(); }} className="text-red-400">حذف</button></div>)}</div></div>}
          {adminView==='contact' && <div><h2 className="text-xl font-bold mb-4">التواصل</h2><div className="bg-white p-6 rounded-2xl flex gap-3 mb-6"><select value={contactForm.type} onChange={e=>setContactForm({...contactForm,type:e.target.value})} className="border p-3 rounded-xl"><option value="whatsapp">WhatsApp</option><option value="phone">Phone</option><option value="email">Email</option></select><input value={contactForm.value} onChange={e=>setContactForm({...contactForm,value:e.target.value})} placeholder="القيمة" className="border p-3 rounded-xl flex-1"/><button onClick={async()=>{ const r=await fetch('/api/contact-methods',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(contactForm)}); if(r.ok) loadAll(); }} className="bg-black text-white px-6 rounded-full">إضافة</button></div><div className="space-y-2">{contacts.map((c:any)=><div key={c.id} className="bg-white p-4 rounded-xl flex justify-between"><span>{c.type}: {c.value}</span><button onClick={async()=>{ await fetch(`/api/contact-methods?id=${c.id}`,{method:'DELETE'}); loadAll(); }} className="text-red-400">حذف</button></div>)}</div></div>}
          {adminView==='messages' && <div><h2 className="text-xl font-bold mb-4">الرسائل</h2><div className="space-y-3">{messages.map((m:any)=><div key={m.id} className="bg-white p-5 rounded-2xl"><b>{m.name}</b><p className="bg-[#F5F1E8] p-3 rounded-xl mt-2 text-sm">{m.message}</p><button onClick={async()=>{ await fetch(`/api/messages?id=${m.id}`,{method:'DELETE'}); loadAll(); }} className="text-red-400 text-xs mt-2">حذف</button></div>)}</div></div>}
          {adminView==='settings' && <div className="bg-white p-8 rounded-2xl max-w-sm"><input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="جديد" className="w-full border p-3 rounded-xl mb-4"/><button onClick={async()=>{ const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password_hash:newPwd})}); if(r.ok) alert('تم'); }} className="w-full bg-black text-white py-3 rounded-full">حفظ</button></div>}
        </main>
      </div>
    );
  }

  return (
    <div className={isAr?'rtl':''}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Cairo:wght@400;600&display=swap'); .font-display{font-family:'Playfair Display',serif} .premium-card{transition:all .4s ease} .premium-card:hover{transform:translateY(-6px);box-shadow:0 25px 50px -12px rgba(26,18,7,.15)}`}</style>
      <header className="sticky top-0 z-50 bg-[#1A1207]/95 backdrop-blur-xl text-white px-6 md:px-12 py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-white flex items-center justify-center"><img src="/logo.png" className="h-7 w-7"/></div><span className="font-bold tracking-[0.25em] text-[13px] font-display">3ARABISTA</span></div>
        <nav className="hidden md:flex gap-8 text-[13px] opacity-80">{[['home','الرئيسية','Home'],['about','من نحن','About'],['products','المتجر','Shop'],['contact','تواصل','Contact'],...customTabs.map((tb:any)=>[tb.slug,tb.title_ar,tb.title_en])].map(([id,ar,en]:any)=><button key={id} onClick={()=>setActiveTab(id)} className={activeTab===id?'text-[#D4A574]':''}>{isAr?ar:en}</button>)}</nav>
        <div className="flex gap-3"><button onClick={()=>setLang(isAr?'en':'ar')} className="border border-white/15 px-4 py-2 rounded-full text-[11px]">{isAr?'EN':'ع'}</button><button onClick={()=>setShowCart(true)} className="bg-white text-black w-10 h-10 rounded-full relative">🛒<span className="absolute -top-1 -right-1 bg-[#D4A574] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span></button></div>
      </header>

      {activeTab==='home' && (
        <main>
          <div className="bg-[#1A1207] text-white min-h-[88vh] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574]/10 via-transparent to-transparent"></div>
            <div className="absolute top-20 right-20 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-[100px]"></div>
            <div className="px-8 md:px-20 py-12 md:py-20 grid md:grid-cols-2 gap-12 w-full relative z-10 max-w-[1600px] mx-auto">
              <div className="order-2 md:order-1">
                <div className="relative w-full h-[520px] bg-gradient-to-br from-[#2a1f0f] to-[#1A1207] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group">
                  {(hero?.images?.length ? hero.images : heroForm.images.length ? heroForm.images : ['/logo.png']).map((img:string,idx:number)=>(
                    <img key={idx} src={img} alt="hero" className={`absolute inset-0 w-full h-full object-contain p-8 transition-all duration-1000 ${idx===heroIdx%(hero?.images?.length||heroForm.images.length||1) ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} style={{objectFit: img.includes('logo')?'contain':'cover'}}/>
                  ))}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">{(hero?.images||heroForm.images||[]).length>1 && (hero?.images||heroForm.images).map((_:any,i:number)=><div key={i} className={`w-2 h-2 rounded-full transition-all ${i===heroIdx%(hero?.images?.length||1) ? 'bg-[#D4A574] w-6' : 'bg-white/30'}`}></div>)}</div>
                </div>
                <div className="hidden md:block mt-6 ml-6 bg-[#FFFBF5] text-black p-5 rounded-[1.5rem] shadow-2xl w-fit"><div className="text-2xl font-bold font-display">100%</div><div className="text-[10px] tracking-widest opacity-60">ARABICA PREMIUM</div></div>
              </div>
              <div className="order-1 md:order-2 space-y-7">
                <div className="inline-flex bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[11px] tracking-[0.2em] text-[#D4A574]">{isAr ? (hero?.badge_ar||heroForm.badge_ar) : (hero?.badge_en||heroForm.badge_en)}</div>
                <h1 className="text-6xl md:text-8xl font-bold font-display leading-[0.85]">{isAr ? (hero?.title_ar||heroForm.title_ar) : (hero?.title_en||heroForm.title_en)}<br/><span className="text-[#D4A574] font-light">{isAr ? '' : ''}</span></h1>
                <p className="opacity-60 text-lg leading-8 max-w-md">{isAr ? (hero?.subtitle_ar||heroForm.subtitle_ar) : (hero?.subtitle_en||heroForm.subtitle_en)}</p>
                <div className="flex gap-4 pt-2">
                  <button onClick={()=>setActiveTab(hero?.cta1_link||heroForm.cta1_link||'products')} className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-[#D4A574] transition-all shadow-xl">{isAr ? (hero?.cta1_ar||heroForm.cta1_ar) : (hero?.cta1_en||heroForm.cta1_en)}</button>
                  <button onClick={()=>setActiveTab(hero?.cta2_link||heroForm.cta2_link||'about')} className="border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition">{isAr ? (hero?.cta2_ar||heroForm.cta2_ar) : (hero?.cta2_en||heroForm.cta2_en)}</button>
                </div>
              </div>
            </div>
          </div>
          {sections.sort((a,b)=>a.order_index-b.order_index).map((s:any)=>{
            const isDark=s.bg_color==="#1A1207";
            return <section key={s.id} style={{background:s.bg_color||'#FFFBF5'}} className={`py-20 px-6 md:px-20 ${isDark?'text-white':''}`}><div className="max-w-6xl mx-auto">{s.type==='split' && <div className="grid md:grid-cols-2 gap-12 items-center"><img src={s.image_url} className="rounded-[2rem] h-[400px] w-full object-cover"/><div><h2 className="text-4xl font-bold font-display">{isAr?s.title_ar:s.title_en}</h2><p className="opacity-60 mt-4 leading-7">{isAr?s.text_ar:s.text_en}</p></div></div>}{s.type==='image_only' && <img src={s.image_url} className="w-full rounded-[2.5rem] max-h-[600px] object-cover"/>}{s.type==='text_only' && <div className="text-center max-w-3xl mx-auto"><h2 className="text-4xl font-bold font-display">{isAr?s.title_ar:s.title_en}</h2><p className="opacity-60 mt-4 leading-8">{isAr?s.text_ar:s.text_en}</p></div>}{s.type==='top_products' && <div><h2 className="text-4xl font-bold text-center mb-10 font-display">{isAr?s.title_ar:s.title_en}</h2><div className="grid md:grid-cols-3 gap-6">{products.filter((p:any)=>p.is_top).map((p:any)=><div key={p.id} className="premium-card bg-white rounded-2xl p-4 border"><img src={p.image_url} className="h-56 w-full object-cover rounded-xl mb-3"/><div className="font-bold text-sm">{isAr?p.name_ar:p.name_en}</div><div className="text-[#8B5A2B]">{p.price} EGP</div></div>)}</div></div>}</div></section>
          })}
        </main>
      )}

      {activeTab==='about' && <div className="px-6 md:px-20 py-20 max-w-6xl mx-auto"><h1 className="text-5xl font-bold mb-12 font-display">من نحن<span className="text-[#D4A574]">.</span></h1><div className="grid md:grid-cols-3 gap-6"><div className="bg-white p-8 rounded-[1.8rem] border"><h3 className="font-bold mb-2">قصتنا</h3><p className="opacity-60 text-sm leading-6">{isAr?about.story_ar:about.story_en}</p></div><div className="bg-[#1A1207] text-white p-8 rounded-[1.8rem]"><h3 className="font-bold mb-2">مهمتنا</h3><p className="opacity-60 text-sm">{isAr?about.mission_ar:about.mission_en}</p></div><div className="bg-[#D4A574] p-8 rounded-[1.8rem]"><h3 className="font-bold mb-2">رؤيتنا</h3><p className="opacity-70 text-sm">{isAr?about.vision_ar:about.vision_en}</p></div></div></div>}
      {(activeTab==='products' || activeTab==='order') && <div className="px-6 md:px-20 py-16 bg-[#FFFBF5]"><div className="flex justify-between items-end mb-10 max-w-7xl mx-auto"><h1 className="text-5xl font-bold font-display">المتجر<span className="text-[#D4A574]">.</span></h1><span className="opacity-40 text-sm">{products.length} منتج</span></div><div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">{products.map((p:any)=><div key={p.id} className="premium-card group bg-white rounded-[2rem] overflow-hidden border"><div className="overflow-hidden"><img src={p.image_url} className="h-80 w-full object-cover group-hover:scale-110 transition duration-700"/></div><div className="p-6"><h3 className="font-bold">{isAr?p.name_ar:p.name_en}</h3><p className="text-xs opacity-40 mt-1 line-clamp-2">{isAr?p.desc_ar:p.desc_en}</p><div className="flex justify-between items-center mt-5"><span className="font-bold">{p.price} EGP</span><button onClick={()=>{ setCart([...cart,p]); setShowCart(true); }} className="bg-black text-white w-10 h-10 rounded-full">+</button></div></div></div>)}</div></div>}
      {activeTab==='contact' && <div className="px-6 md:px-20 py-20 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto"><div><h1 className="text-5xl font-bold font-display mb-8">تواصل<span className="text-[#D4A574]">.</span></h1><div className="space-y-3">{contacts.map((c:any)=><div key={c.id} className="bg-white p-5 rounded-2xl flex gap-4 border"><div className="w-12 h-12 bg-[#F5F1E8] rounded-xl flex items-center justify-center">{c.type[0]}</div><div><div className="font-bold text-sm">{c.label_ar||c.type}</div><div className="text-sm opacity-60">{c.value}</div></div></div>)}</div></div><div className="bg-white p-8 rounded-[2rem] border"><div className="grid gap-4"><input value={msgForm.name} onChange={e=>setMsgForm({...msgForm,name:e.target.value})} placeholder="الاسم" className="bg-[#F5F1E8] p-4 rounded-2xl outline-none"/><textarea value={msgForm.message} onChange={e=>setMsgForm({...msgForm,message:e.target.value})} placeholder="رسالتك" className="bg-[#F5F1E8] p-4 rounded-2xl h-32 outline-none"/><button onClick={async()=>{ const r=await fetch('/api/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(msgForm)}); if(r.ok){ alert('تم الإرسال'); setMsgForm({name:'',email:'',phone:'',message:''}); } }} className="bg-black text-white py-4 rounded-full">إرسال</button></div></div></div>}

      {showCart && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"><div className="bg-[#FFFBF5] w-full max-w-md h-full p-8 flex flex-col"><div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">السلة ({cart.length})</h2><button onClick={()=>setShowCart(false)} className="w-10 h-10 bg-black text-white rounded-full">✕</button></div><div className="flex-1 overflow-auto space-y-3">{cart.map((it,i)=><div key={i} className="flex gap-3 bg-white p-4 rounded-2xl border"><img src={it.image_url} className="w-14 h-14 rounded-xl object-cover"/><div className="flex-1 text-sm"><div className="font-bold">{isAr?it.name_ar:it.name_en}</div><div>{it.price} EGP</div></div><button onClick={()=>setCart(cart.filter((_,idx)=>idx!==i))} className="text-red-400">✕</button></div>)}</div>{cart.length>0 && <button onClick={()=>setShowComing(true)} className="bg-black text-white py-4 rounded-full mt-4">إتمام • {cart.reduce((s,p)=>s+Number(p.price||0),0)} EGP</button>}</div></div>}
      {showComing && <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-[2rem] p-10 max-w-sm w-full text-center"><div className="text-5xl mb-4">☕</div><h2 className="text-2xl font-bold">قريباً</h2><button onClick={()=>setShowComing(false)} className="bg-black text-white w-full py-3 rounded-full mt-6">حسناً</button></div></div>}

      <footer className="bg-[#1A1207] text-white/40 p-10 mt-16 flex justify-between text-xs"><span>© 2026 3ARABISTA</span><button onClick={()=>{ setIsAdmin(true); if(typeof window!=='undefined') window.location.hash='admin'; }}>DASHBOARD</button></footer>
    </div>
  );
}
