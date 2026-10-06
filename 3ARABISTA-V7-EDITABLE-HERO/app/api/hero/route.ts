
import { NextResponse } from 'next/server'; import { sql } from '@vercel/postgres'; import { initDB } from '@/lib/db';
export async function GET(){ try{ await initDB(); const r=await sql`SELECT * FROM hero_settings LIMIT 1`; return NextResponse.json(r.rows[0]||{}); }catch(e:any){ return NextResponse.json({}); } }
export async function POST(req:Request){
  try{
    await initDB(); const b=await req.json();
    const ex=await sql`SELECT id FROM hero_settings LIMIT 1`;
    if(ex.rows.length===0){
      const ins=await sql`INSERT INTO hero_settings (title_ar,title_en,subtitle_ar,subtitle_en,badge_ar,badge_en,images,cta1_ar,cta1_en,cta1_link,cta2_ar,cta2_en,cta2_link) VALUES (${b.title_ar||''},${b.title_en||''},${b.subtitle_ar||''},${b.subtitle_en||''},${b.badge_ar||''},${b.badge_en||''},${b.images||[]},${b.cta1_ar||''},${b.cta1_en||''},${b.cta1_link||'products'},${b.cta2_ar||''},${b.cta2_en||''},${b.cta2_link||'about'}) RETURNING *`;
      return NextResponse.json(ins.rows[0]);
    } else {
      const upd=await sql`UPDATE hero_settings SET title_ar=${b.title_ar}, title_en=${b.title_en}, subtitle_ar=${b.subtitle_ar}, subtitle_en=${b.subtitle_en}, badge_ar=${b.badge_ar}, badge_en=${b.badge_en}, images=${b.images||[]}, cta1_ar=${b.cta1_ar}, cta1_en=${b.cta1_en}, cta1_link=${b.cta1_link}, cta2_ar=${b.cta2_ar}, cta2_en=${b.cta2_en}, cta2_link=${b.cta2_link} WHERE id=${ex.rows[0].id} RETURNING *`;
      return NextResponse.json(upd.rows[0]);
    }
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); }
}
