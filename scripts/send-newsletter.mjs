// NutriLive 주간 레터 자동 발송 — MailerLite API
// 실행: MAILERLITE_API_KEY=... node scripts/send-newsletter.mjs
// 발송 대상 파일: newsletter/latest.html (제목은 <title>에서 추출)
// 멱등성: 같은 내용(해시)으로 만든 캠페인이 이미 있으면 발송하지 않는다.

import { readFileSync } from 'fs';
import { createHash } from 'crypto';

const KEY = (process.env.MAILERLITE_API_KEY || '').trim(); // 붙여넣기 시 섞인 공백·줄바꿈 방어
if (!KEY) { console.error('MAILERLITE_API_KEY 시크릿이 없습니다.'); process.exit(1); }
console.log(`토큰 감지: 길이 ${KEY.length}자, 앞 6자 ${KEY.slice(0, 6)}…`);

const API = 'https://connect.mailerlite.com/api';
const FROM_EMAIL = process.env.NEWSLETTER_FROM || 'haru7821@gmail.com';
const FROM_NAME = 'NutriLive';
const GROUP_NAME = 'NutriLive 주간 레터';

async function ml(path, method = 'GET', body) {
  const res = await fetch(API + path, {
    method,
    headers: {
      'Authorization': 'Bearer ' + KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
  return json;
}

// 1) 레터 본문
let html;
try { html = readFileSync('newsletter/latest.html', 'utf8'); }
catch { console.log('newsletter/latest.html 없음 — 이번 주 발송 없음, 정상 종료.'); process.exit(0); }
const subject = (html.match(/<title>([^<]+)<\/title>/) || [])[1]?.trim()
  || 'NutriLive 주간 레터';
const hash = createHash('sha256').update(html).digest('hex').slice(0, 10);
const campaignName = `weekly-${hash}`;

// 2) 멱등성 — 같은 해시의 캠페인이 있으면 스킵
const existing = await ml('/campaigns?filter[status]=sent&limit=100').catch(() => null);
const drafts = await ml('/campaigns?filter[status]=draft&limit=100').catch(() => null);
for (const list of [existing, drafts]) {
  if (list?.data?.some(c => c.name === campaignName)) {
    console.log(`캠페인 ${campaignName} 이미 존재 — 중복 발송 방지, 종료.`);
    process.exit(0);
  }
}

// 3) 구독자 그룹 확보 (없으면 생성)
const groups = await ml('/groups?limit=100');
let group = groups.data.find(g => g.name === GROUP_NAME);
if (!group) {
  group = (await ml('/groups', 'POST', { name: GROUP_NAME })).data;
  console.log('그룹 생성:', GROUP_NAME);
}
const active = group.active_count ?? 0;
console.log(`그룹 「${GROUP_NAME}」 활성 구독자: ${active}명`);
if (active === 0) {
  console.log('구독자가 없어 발송을 건너뜁니다 (정상 종료).');
  process.exit(0);
}

// 4) 캠페인 생성 → 즉시 발송
const campaign = await ml('/campaigns', 'POST', {
  name: campaignName,
  type: 'regular',
  groups: [group.id],
  emails: [{
    subject,
    from_name: FROM_NAME,
    from: FROM_EMAIL,
    content: html
  }]
});
const id = campaign.data.id;
await ml(`/campaigns/${id}/schedule`, 'POST', { delivery: 'instant' });
console.log(`발송 완료 — 「${subject}」 → ${active}명 (campaign ${id})`);
