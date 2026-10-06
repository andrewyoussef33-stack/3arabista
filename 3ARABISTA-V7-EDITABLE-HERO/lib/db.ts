
import { sql } from '@vercel/postgres';
export async function initDB(){
  await sql`CREATE TABLE IF NOT EXISTS settings (id SERIAL PRIMARY KEY, password_hash TEXT DEFAULT '2026');`;
  await sql`CREATE TABLE IF NOT EXISTS about_data (id SERIAL PRIMARY KEY, story_ar TEXT, story_en TEXT, mission_ar TEXT, mission_en TEXT, vision_ar TEXT, vision_en TEXT, gallery TEXT[], timeline JSONB);`;
  await sql`CREATE TABLE IF NOT EXISTS home_sections (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), type TEXT, title_ar TEXT, title_en TEXT, text_ar TEXT, text_en TEXT, image_url TEXT, images TEXT[], bg_color TEXT DEFAULT '#FFFFFF', order_index INT DEFAULT 0);`;
  await sql`CREATE TABLE IF NOT EXISTS hero_settings (id SERIAL PRIMARY KEY, title_ar TEXT, title_en TEXT, subtitle_ar TEXT, subtitle_en TEXT, badge_ar TEXT, badge_en TEXT, images TEXT[], cta1_ar TEXT, cta1_en TEXT, cta1_link TEXT, cta2_ar TEXT, cta2_en TEXT, cta2_link TEXT);`;
  await sql`CREATE TABLE IF NOT EXISTS products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name_ar TEXT, name_en TEXT, desc_ar TEXT, desc_en TEXT, price TEXT, category TEXT, image_url TEXT, is_top BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW());`;
  await sql`CREATE TABLE IF NOT EXISTS contact_methods (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), type TEXT, label_ar TEXT, label_en TEXT, value TEXT);`;
  await sql`CREATE TABLE IF NOT EXISTS custom_tabs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE, title_ar TEXT, title_en TEXT, icon TEXT);`;
  await sql`CREATE TABLE IF NOT EXISTS messages (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, email TEXT, phone TEXT, message TEXT, created_at TIMESTAMPTZ DEFAULT NOW());`;
  
  // Migrations
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS weight TEXT;`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false;`;
  await sql`ALTER TABLE home_sections ADD COLUMN IF NOT EXISTS images TEXT[];`;
  await sql`ALTER TABLE hero_settings ADD COLUMN IF NOT EXISTS images TEXT[];`;
  
  const s=await sql`SELECT id FROM settings LIMIT 1`; if(s.rows.length===0) await sql`INSERT INTO settings (password_hash) VALUES ('2026')`;
  const h=await sql`SELECT id FROM hero_settings LIMIT 1`; if(h.rows.length===0) await sql`INSERT INTO hero_settings (title_ar,title_en,subtitle_ar,subtitle_en,badge_ar,badge_en,images,cta1_ar,cta1_en,cta1_link,cta2_ar,cta2_en,cta2_link) VALUES ('عربيتسا','3ARABISTA','نكهة أصيلة، تحضير عصري. كل رشفة تحكي قصة.','Authentic flavor, modern brew. Every sip tells a story.','قهوة مختصة بروح عربية','Specialty coffee with Arab soul',ARRAY['/logo.png'],'تصفح المتجر','Browse Shop','products','قصتنا','Our Story','about')`;
}
