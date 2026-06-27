export interface Review {
  id: string
  cityId: string
  author: string
  rating: number
  date: string
  content: string
}

export const reviews: Review[] = [
  {
    id: "r1", cityId: "seoul", author: "김민준", rating: 5, date: "2024-03",
    content: "카페와 코워킹 스페이스가 넘쳐나서 일하기에 최적입니다. 다만 생활비가 비싸니 예산 관리가 필요해요.",
  },
  {
    id: "r2", cityId: "seoul", author: "이서연", rating: 4, date: "2024-01",
    content: "지하철로 어디든 30분 안에 갈 수 있어서 편리해요. 미세먼지가 심한 날엔 마스크 필수입니다.",
  },
  {
    id: "r3", cityId: "gangneung", author: "박지훈", rating: 5, date: "2024-02",
    content: "바다를 보며 카페에서 일하는 게 꿈이었는데 강릉에서 이루었어요. 공기도 너무 맑아요.",
  },
  {
    id: "r4", cityId: "gangneung", author: "최유나", rating: 4, date: "2023-12",
    content: "한 달 살기로 왔는데 생각보다 코워킹 스페이스가 적어요. 그래도 분위기는 최고입니다.",
  },
  {
    id: "r5", cityId: "jeju", author: "정승우", rating: 5, date: "2024-03",
    content: "제주의 자연환경이 창의력을 높여줘요. 렌터카 없으면 이동이 불편하지만 그것만 빼면 완벽해요.",
  },
  {
    id: "r6", cityId: "jeju", author: "한소희", rating: 4, date: "2024-02",
    content: "워케이션 한 달 지내봤는데 정말 힐링됐어요. 물가가 조금 오르긴 했지만 서울보다는 저렴합니다.",
  },
  {
    id: "r7", cityId: "busan", author: "오태양", rating: 4, date: "2024-01",
    content: "서울 다음으로 인프라가 잘 갖춰진 것 같아요. 해운대 근처 카페들은 뷰가 정말 예쁩니다.",
  },
  {
    id: "r8", cityId: "busan", author: "임채원", rating: 5, date: "2023-11",
    content: "부산 사투리 사람들이 너무 친절해요. 돼지국밥 먹으면서 코딩하는 게 낙이에요.",
  },
  {
    id: "r9", cityId: "jeonju", author: "강하은", rating: 4, date: "2024-02",
    content: "한옥마을 근처 카페에서 일하면 집중이 정말 잘 돼요. 물가가 싸서 장기 체류하기 좋아요.",
  },
  {
    id: "r10", cityId: "jeonju", author: "윤도현", rating: 4, date: "2023-10",
    content: "조용하고 아름다운 도시예요. 대형 코워킹은 없지만 분위기 좋은 카페가 많습니다.",
  },
  {
    id: "r11", cityId: "gyeongju", author: "송민아", rating: 4, date: "2023-09",
    content: "역사 유적지 옆에서 일하는 특별한 경험이에요. 인터넷 속도가 조금 아쉽습니다.",
  },
  {
    id: "r12", cityId: "gyeongju", author: "백준혁", rating: 3, date: "2023-08",
    content: "힐링은 됐는데 카페 선택지가 너무 적어요. 주말 여행지로는 추천하지만 장기 체류엔 아쉽습니다.",
  },
  {
    id: "r13", cityId: "daegu", author: "신예린", rating: 4, date: "2024-01",
    content: "생각보다 카페가 많아서 놀랐어요. 여름이 너무 더운 게 단점이지만 겨울엔 살기 좋아요.",
  },
  {
    id: "r14", cityId: "daegu", author: "류성현", rating: 4, date: "2023-12",
    content: "동성로 근처 카페들이 수준급이에요. 서울보다 조용해서 집중 잘 됩니다.",
  },
  {
    id: "r15", cityId: "incheon", author: "전지우", rating: 4, date: "2024-03",
    content: "공항이 가까워서 해외 출장 자주 나가는 분들에게 완벽한 베이스예요.",
  },
  {
    id: "r16", cityId: "incheon", author: "황민서", rating: 3, date: "2024-01",
    content: "서울 접근성은 좋은데 인천 자체 인프라는 아직 부족한 느낌이에요.",
  },
  {
    id: "r17", cityId: "gwangju", author: "남기준", rating: 4, date: "2023-11",
    content: "5·18 광장 근처 카페에서 일하면 묘한 감동이 있어요. 물가도 적당하고 살기 좋습니다.",
  },
  {
    id: "r18", cityId: "gwangju", author: "안소정", rating: 4, date: "2023-10",
    content: "문화도시답게 갤러리와 카페가 잘 어우러져 있어요. 노마드 커뮤니티가 생기면 더 좋겠어요.",
  },
  {
    id: "r19", cityId: "daejeon", author: "조현우", rating: 4, date: "2024-02",
    content: "KTX로 서울, 부산 어디든 편리하게 이동해요. IT 단지 덕분에 인터넷이 빠릅니다.",
  },
  {
    id: "r20", cityId: "daejeon", author: "홍나연", rating: 3, date: "2023-12",
    content: "교통 요지라 편리하지만 도시 자체의 매력은 좀 부족한 편이에요.",
  },
  {
    id: "r21", cityId: "suwon", author: "문성진", rating: 4, date: "2024-01",
    content: "수원화성 덕분에 산책하며 기분 전환하기 좋아요. 서울 출퇴근도 가능한 거리입니다.",
  },
  {
    id: "r22", cityId: "suwon", author: "이하린", rating: 3, date: "2023-11",
    content: "경기도 특유의 베드타운 느낌이 있어요. 삼성 덕분에 인프라는 잘 갖춰져 있습니다.",
  },
  {
    id: "r23", cityId: "chuncheon", author: "서준영", rating: 4, date: "2024-02",
    content: "의암호 옆에서 일하는 경험이 정말 특별해요. 닭갈비 먹으러 왔다가 눌러앉았습니다.",
  },
  {
    id: "r24", cityId: "chuncheon", author: "김다은", rating: 4, date: "2023-09",
    content: "서울에서 1시간 거리인데 이렇게 조용할 수가 없어요. 창작 작업엔 최고의 도시입니다.",
  },
]
