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
const FROM_EMAIL = process.env.NEWSLETTER_FROM || 'cnh7821@gmail.com'; // MailerLite에서 인증된 발신 주소
const FROM_NAME = 'NutriLive';

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

// 3) 발송 대상 — 활성 구독자가 있는 모든 그룹
//    (사이트 임베드 폼이 붙는 그룹과 API로 만든 그룹이 다를 수 있으므로, 그룹명을 고정하지 않는다)
const groups = await ml('/groups?limit=100');
groups.data.forEach(g => console.log(`그룹 「${g.name}」 활성 구독자: ${g.active_count ?? 0}명`));
const targets = groups.data.filter(g => (g.active_count ?? 0) > 0);
let active = targets.reduce((n, g) => n + (g.active_count ?? 0), 0);
let sendToAll = false;
if (active === 0) {
  // 그룹 미배정 구독자 대비 — 계정 전체의 활성 구독자를 확인하고, 있으면 전체 발송으로 전환
  const subs = await ml('/subscribers?filter[status]=active&limit=100').catch(() => null);
  const total = subs?.data?.length ?? 0;
  console.log(`그룹 미배정 포함 계정 전체 활성 구독자: ${total}명`);
  if (total > 0) { active = total; sendToAll = true; }
}
if (active === 0) {
  // 사이트 폼 연동 설정용 진단 — 계정의 임베드 폼 목록을 함께 출력
  const forms = await ml('/forms/embedded?limit=25').catch(() => null);
  if (forms?.data?.length) {
    console.log('임베드 폼 목록:');
    forms.data.forEach(f => console.log(`  - "${f.name}" → form code: ${f.id}`));
  } else {
    console.log('임베드 폼 없음 — MailerLite에서 Forms → Embedded form을 하나 만들어 주세요.');
  }
  console.log('구독자가 없어 발송을 건너뜁니다 (정상 종료).');
  process.exit(0);
}

// 4) 캠페인 생성 → 즉시 발송
const campaign = await ml('/campaigns', 'POST', {
  name: campaignName,
  type: 'regular',
  ...(sendToAll ? {} : { groups: targets.map(g => g.id) }),   // 그룹 미지정 = 전체 활성 구독자에게 발송
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
