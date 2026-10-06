
import { NextResponse } from 'next/server'; import { sql } from '@vercel/postgres'; import { initDB } from '@/lib/db';
export async function GET(){ try{ await initDB(); const r=await sql`SELECT * FROM contact_methods`; return NextResponse.json(r.rows); }catch(e:any){ return NextResponse.json([]); } }
export async function POST(req:Request){ try{ await initDB(); const b=await req.json(); const r=await sql`INSERT INTO contact_methods (type,label_ar,label_en,value) VALUES (${b.type},${b.label_ar||''},${b.label_en||''},${b.value}) RETURNING *`; return NextResponse.json(r.rows[0]); }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); } }
export async function DELETE(req:Request){ try{ await initDB(); const id=new URL(req.url).searchParams.get('id'); await sql`DELETE FROM contact_methods WHERE id=${id}`; return NextResponse.json({ok:true}); }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); } }
