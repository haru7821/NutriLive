# NutriLive 브랜드 필름 — 60초 실사 콘티 & AI 생성 프롬프트 패키지

> 사용법: 아래 8개 숏을 Veo / Sora / Runway / Kling 등에서 생성한다.
> 숏마다 여러 테이크를 뽑아 가장 좋은 것을 고르고, 클립 파일을 CTO(Claude)에게 전달하면
> 색감 통일 → 컷 편집 → 타이포·낙관 합성(티저와 동일한 룩) → 최종 60초 필름으로 완성한다.

## 세계관 한 줄

**"싱겁게, 그러나 맛있게."** — 숫자를 아는 사람의 조용하고 정갈한 아침 식탁.
병원이 아니라 부엌, 절제가 아니라 취향으로 보이게 찍는다.

## 공통 스타일 블록 (모든 프롬프트 앞에 붙일 것)

```
Cinematic film still style, shot on 35mm film, soft morning window light,
warm ivory and cream palette with deep green and burnt orange accents,
Korean home kitchen, shallow depth of field, slow deliberate camera movement,
quiet and serene mood, muted earth tones, natural steam, no on-screen text,
no logos, photorealistic, 24fps
```

- 해상도: 1080p 이상 / 클립 길이: 5~8초 / 화면비: **16:9** (레터박스는 편집에서 입힘)
- **화면 안에 글자가 나오는 장면 금지** — AI가 만든 글자는 반드시 깨집니다. 활자는 전부 편집 단계에서 얹습니다
- 같은 부엌·같은 빛으로 보이도록 프롬프트 앞부분(공통 블록)을 절대 바꾸지 말 것
- 서비스가 시드(seed) 고정을 지원하면 같은 시드로 변주를 뽑을 것

## 숏 리스트 (8숏 × 5~8초)

### S1 — 아침의 김 (오프닝, 0:00–0:07)
- 연출: 창가 역광, 맑은 국 한 그릇에서 김이 피어오른다. 아주 느린 푸시인.
- Prompt: `[공통 블록] + extreme close-up of steam rising from a clear Korean soup bowl on a wooden table by a window, backlit morning sunlight through the steam, very slow push-in`

### S2 — 라벨을 읽는 손 (문제 제기, 0:07–0:14)
- 연출: 마트 진열대 앞, 중년의 손이 라면 봉지를 뒤집어 영양성분표를 본다. 얼굴은 프레임 밖.
- Prompt: `[공통 블록] + close-up of middle-aged hands turning over an instant noodle package to read the back label in a grocery store aisle, face out of frame, soft supermarket lighting mixed with window light, handheld subtle movement`

### S3 — 계량의 순간 (전환, 0:14–0:21)
- 연출: 계량스푼으로 간장을 «반 술만» 떠서 수평을 맞추는 매크로. 절제가 기술로 보이는 컷.
- Prompt: `[공통 블록] + macro shot of a measuring spoon leveling a small amount of soy sauce, precise and careful hand movement, dark soy sauce catching warm light, kitchen counter background bokeh`

### S4 — 데치기 (기술 ①, 0:21–0:28)
- 연출: 채소가 끓는 물에 들어가는 순간 슬로모션, 김과 물방울.
- Prompt: `[공통 블록] + slow motion of fresh spinach being blanched in a pot of boiling water, steam and tiny water droplets, tongs lifting vivid green leaves, bright natural light`

### S5 — 향의 마무리 (기술 ②, 0:28–0:35)
- 연출: 나물 위에 들기름 한 줄기, 참깨가 흩뿌려지는 매크로 슬로모션.
- Prompt: `[공통 블록] + macro slow motion of golden perilla oil being drizzled over seasoned vegetables, then sesame seeds sprinkled from fingers, glistening texture, warm highlights`

### S6 — 차림 (완성, 0:35–0:43)
- 연출: 소반/식탁에 그릇들이 하나씩 놓인다. 탑다운 또는 45도, 정갈한 구도.
- Prompt: `[공통 블록] + overhead shot of a minimal Korean table setting being completed, hands placing a clear soup bowl and small side dishes on a wooden table, balanced composition, calm rhythm`

### S7 — 식탁의 사람 (감정, 0:43–0:51)
- 연출: 창가 식탁의 중년 부부 — 옆모습/뒷모습 위주로(얼굴 정면은 AI 인물 일관성이 깨지기 쉬움). 잔잔한 대화와 미소.
- Prompt: `[공통 블록] + medium shot from behind of a middle-aged Korean couple sharing a quiet breakfast by the window, seen mostly from the side and back, gentle laughter, soft rim light, warm domestic atmosphere`

### S8 — 엔딩 카드 (0:51–1:00)
- **AI 생성 불필요.** 티저와 동일한 코드 모션(낙관 스탬프 → NutriLive 로고 → "싱겁게, 그러나 맛있게." → nutrilive.kr)을 재사용해 합성한다.

## 음악 (선택)

- 무드: 피아노 또는 가야금 미니멀, 60~70 BPM, 잔잔한 룸톤.
- 무료 소스: YouTube 오디오 라이브러리(저작자표시 불필요 트랙) 또는 Pixabay Music에서
  "calm piano minimal" 검색. 클립과 함께 전달해 주면 편집에 얹는다.

## 전달 체크리스트

- [ ] 숏별 클립 1~3테이크 (S1~S7, mp4/mov 1080p+)
- [ ] 음악 파일 1곡 (선택)
- [ ] 원하는 총 길이(기본 60초) / 자막 문구 수정 여부

전달 방법: 이 세션에 파일 업로드 → CTO가 색보정(필름룩 LUT 톤)·컷 편집·타이포 합성·최종 인코딩까지 완료.
