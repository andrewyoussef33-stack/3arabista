
import { NextResponse } from 'next/server';
export async function POST(req:Request){
  try{
    const fd=await req.formData(); const file=fd.get('file') as File;
    if(!file) return NextResponse.json({error:'no file'},{status:400});
    try{
      const { put } = await import('@vercel/blob');
      const blob=await put(`arabista/${Date.now()}-${file.name}`, file, {access:'public'});
      return NextResponse.json({url:blob.url});
    }catch(e:any){
      // fallback to base64 if blob not configured
      const buf=await file.arrayBuffer();
      const base64=Buffer.from(buf).toString('base64');
      const mime=file.type||'image/jpeg';
      const dataUrl=`data:${mime};base64,${base64}`;
      return NextResponse.json({url:dataUrl, fallback:true});
    }
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); }
}
