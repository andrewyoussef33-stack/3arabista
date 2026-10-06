
import { NextResponse } from 'next/server'; import { sql } from '@vercel/postgres'; import { initDB } from '@/lib/db';
export async function GET(){ try{ await initDB(); const r=await sql`SELECT * FROM products ORDER BY created_at DESC`; return NextResponse.json(r.rows); }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); } }
export async function POST(req:Request){
  try{
    await initDB(); const b=await req.json();
    if(!b.name_ar || !b.price) return NextResponse.json({error:'name_ar and price required'},{status:400});
    // id present = edit
    if(b.id){
      const r=await sql`UPDATE products SET name_ar=${b.name_ar}, name_en=${b.name_en||''}, desc_ar=${b.desc_ar||''}, desc_en=${b.desc_en||''}, price=${b.price}, category=${b.category||'Espresso'}, image_url=${b.image_url||''}, is_top=${b.is_top||false} WHERE id=${b.id} RETURNING *`;
      if(r.rows.length===0) return NextResponse.json({error:'not found'},{status:404});
      return NextResponse.json(r.rows[0]);
    }
    const r=await sql`INSERT INTO products (name_ar,name_en,desc_ar,desc_en,price,category,image_url,is_top) VALUES (${b.name_ar},${b.name_en||''},${b.desc_ar||''},${b.desc_en||''},${b.price},${b.category||'Espresso'},${b.image_url||''},${b.is_top||false}) RETURNING *`;
    return NextResponse.json(r.rows[0]);
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); }
}
export async function DELETE(req:Request){ try{ await initDB(); const id=new URL(req.url).searchParams.get('id'); await sql`DELETE FROM products WHERE id=${id}`; return NextResponse.json({ok:true}); }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); } }
