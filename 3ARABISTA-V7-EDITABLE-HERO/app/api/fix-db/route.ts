
import { NextResponse } from 'next/server'; import { sql } from '@vercel/postgres';
export async function GET(){
  try{
    await sql`CREATE TABLE IF NOT EXISTS hero_settings (id SERIAL PRIMARY KEY, title_ar TEXT, title_en TEXT, subtitle_ar TEXT, subtitle_en TEXT, badge_ar TEXT, badge_en TEXT, images TEXT[], cta1_ar TEXT, cta1_en TEXT, cta1_link TEXT, cta2_ar TEXT, cta2_en TEXT, cta2_link TEXT);`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS weight TEXT;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS desc_ar TEXT;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS desc_en TEXT;`;
    await sql`ALTER TABLE home_sections ADD COLUMN IF NOT EXISTS images TEXT[];`;
    await sql`ALTER TABLE custom_tabs ADD COLUMN IF NOT EXISTS icon TEXT;`;
    const h=await sql`SELECT id FROM hero_settings LIMIT 1`;
    if(h.rows.length===0){ await sql`INSERT INTO hero_settings (title_ar,title_en,subtitle_ar,subtitle_en,badge_ar,badge_en,images,cta1_ar,cta1_en,cta1_link,cta2_ar,cta2_en,cta2_link) VALUES ('عربيتسا','3ARABISTA','نكهة أصيلة، تحضير عصري. كل رشفة تحكي قصة.','Authentic flavor','قهوة مختصة بروح عربية','Specialty',ARRAY['/logo.png'],'تصفح المتجر','Browse','products','قصتنا','Story','about')`; }
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({ok:false,error:e.message},{status:500}); }
}
