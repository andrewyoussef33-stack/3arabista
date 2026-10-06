
import { NextResponse } from 'next/server'; import { sql } from '@vercel/postgres'; import { initDB } from '@/lib/db';
export async function GET(){ try{ await initDB(); const r=await sql`SELECT * FROM custom_tabs`; return NextResponse.json(r.rows); }catch{ return NextResponse.json([]); } }
export async function POST(req:Request){
  try{
    await initDB(); const b=await req.json(); if(!b.slug) return NextResponse.json({error:'slug required'},{status:400});
    try{
      const r=await sql`INSERT INTO custom_tabs (slug,title_ar,title_en,icon) VALUES (${b.slug},${b.title_ar||''},${b.title_en||''},${b.icon||'✦'}) ON CONFLICT (slug) DO UPDATE SET title_ar=${b.title_ar}, title_en=${b.title_en}, icon=${b.icon} RETURNING *`;
      return NextResponse.json(r.rows[0]);
    }catch(e:any){
      if(e.message.includes('icon')){
        const r=await sql`INSERT INTO custom_tabs (slug,title_ar,title_en) VALUES (${b.slug},${b.title_ar||''},${b.title_en||''}) ON CONFLICT (slug) DO UPDATE SET title_ar=${b.title_ar}, title_en=${b.title_en} RETURNING *`;
        return NextResponse.json(r.rows[0]);
      }
      throw e;
    }
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); }
}
export async function DELETE(req:Request){ try{ await initDB(); const id=new URL(req.url).searchParams.get('id'); await sql`DELETE FROM custom_tabs WHERE id=${id}`; return NextResponse.json({ok:true}); }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); } }
