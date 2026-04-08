/**
 * GitHub Action / Node script to fetch latest Facebook Page posts
 * and write a static JSON file for GitHub Pages.
 *
 * Required GitHub repository secrets:
 * - FB_PAGE_ID
 * - FB_PAGE_ACCESS_TOKEN
 *
 * Optional env vars:
 * - FB_POST_LIMIT (default 5)
 * - OUT_FILE (default ./fb-posts.json)
 */

const fs = require('fs');
const path = require('path');

const PAGE_ID = process.env.FB_PAGE_ID;
const ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const LIMIT = Number(process.env.FB_POST_LIMIT || 5);
const OUT_FILE = process.env.OUT_FILE || path.join(process.cwd(), 'fb-posts.json');

if (!PAGE_ID || !ACCESS_TOKEN) {
  console.error('Missing FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN environment variables.');
  process.exit(1);
}

async function graphRequest(url) {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) {
    console.error('Graph API error:', JSON.stringify(json, null, 2));
    process.exit(1);
  }
  return json;
}

function pickBestImage(post) {
  if (post.full_picture) return post.full_picture;

  const media = post.attachments?.data?.[0]?.media;
  if (media?.image?.src) return media.image.src;

  const subattachments = post.attachments?.data?.[0]?.subattachments?.data || [];
  for (const item of subattachments) {
    const src = item?.media?.image?.src;
    if (src) return src;
  }

  return '';
}

function isVideo(post) {
  const type = post.attachments?.data?.[0]?.media_type || '';
  return String(type).toLowerCase().includes('video');
}

function getVideoEmbedUrl(post) {
  const source = post.attachments?.data?.[0]?.media?.source;
  return source || '';
}

async function run() {
  const fields = [
    'message',
    'story',
    'created_time',
    'permalink_url',
    'full_picture',
    'attachments{media,media_type,subattachments}'
  ].join(',');

  const url = new URL(`https://graph.facebook.com/v25.0/${PAGE_ID}/posts`);
  url.searchParams.set('limit', String(LIMIT));
  url.searchParams.set('fields', fields);
  url.searchParams.set('access_token', ACCESS_TOKEN);

  const result = await graphRequest(url.toString());

  const cleaned = {
    fetched_at: new Date().toISOString(),
    data: (result.data || []).map((post) => ({
      id: post.id,
      message: post.message || '',
      story: post.story || '',
      created_time: post.created_time || '',
      permalink_url: post.permalink_url || '',
      image: pickBestImage(post),
      is_video: isVideo(post),
      video_embed_url: getVideoEmbedUrl(post)
    }))
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(cleaned, null, 2));
  console.log(`Wrote ${cleaned.data.length} posts to ${OUT_FILE}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
