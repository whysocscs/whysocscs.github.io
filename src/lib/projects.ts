export interface PortfolioProject {
  slug: string;
  title: string;
  period: string;
  status: string;
  role: string;
  summary: string;
  overview?: string[];
  contributions: string[];
  achievements?: string[];
  stack: string[];
  result: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'slime',
    title: 'SLiMe',
    period: '2025.08 - 2025.12',
    status: 'Completed',
    role: 'Development team / testbed, packet analysis, dashboard UI',
    summary:
      '산업 프로토콜 대상 SLM 기반 공격 탐지 시스템. OT/ICS 환경의 네트워크 트래픽을 ML/DL로 탐지하고, SLM 기반 XAI 보고서로 위협의 의미와 대응 근거를 설명하는 보안 관제 프로젝트다.',
    overview: [
      'SLiMe는 Modbus, XGT FEnet, S7comm 등 산업 프로토콜 트래픽을 분석해 OT 환경의 이상 행위를 탐지하는 BoB 14기 팀 프로젝트다. 기존 OT 보안 솔루션이 시그니처, 룰, 통계적 임계값 중심으로 이상 여부를 알려주는 데 그치는 문제를 줄이고, 운영자가 이해할 수 있는 분석 근거까지 제공하는 것을 목표로 했다.',
      '시스템은 분석 단계, 시뮬레이션 단계, 운영 단계로 나뉜다. 분석 단계에서는 트래픽을 저장하고 프로토콜 구조를 분석해 파서를 개발한다. 시뮬레이션 단계에서는 SLM이 정상 패턴을 분석하고 라벨을 생성해 ML/DL 학습 데이터로 연결한다. 운영 단계에서는 실시간 트래픽을 수신해 ML/DL이 이상 탐지를 수행하고, 탐지 결과를 SLM 기반 XAI 분석으로 넘겨 보고서를 생성한다.',
      '검증 시나리오는 단순 장애 유발보다 정상 제어 명령처럼 보이는 의미론적 공격에 초점을 맞췄다. 예를 들어 KISA 스마트보안 리빙랩 음료 공정 테스트베드에서는 내부망 침투, PLC 로직 변조, HMI를 통한 정상 제어 명령 위장, 공정 방해 및 은폐 흐름을 MITRE ATT&CK for ICS 관점으로 구성했다.',
    ],
    contributions: [
      '기존 OT 보안 솔루션 9종을 조사해 베이스라인 학습, 임계값 기반 이상 탐지, 알림 중심 관제의 한계를 정리하고, SLiMe가 SLM을 통해 공격 의도와 대응 근거를 설명한다는 차별점을 도출했다.',
      'CIC/Modbus 계열 데이터와 KISA 스마트보안 리빙랩 트래픽을 확인하며 Modbus/TCP 패킷 구조, function code, query/response 흐름, 공격 패킷 특성을 분석했다.',
      'Modbus/TCP packet parser 코드를 작성하고, 학습 데이터로 사용할 필드와 프로토콜별 처리 지점을 정리했다.',
      'Docker 기반 가상 테스트베드 구축을 실험했다. OpenPLC, SCADA-LTS, pymodbus, SMOD를 사용해 PLC 연결, coil read/write, 상태 토글, 공격성 write 명령 전송을 검증했다.',
      '개발팀에서 시스템 인프라 및 테스트베드 구축 역할을 맡았고, 후반부에는 대시보드 프론트엔드 UI/UX 구현 담당으로 React/Vite 기반 관제 화면 구조를 학습하고 구현 흐름을 정리했다.',
      'DL 기반 이상 탐지 흐름에서 window sliding, 중첩 윈도우 문제, SLM이 생성한 패턴 데이터와 DL 학습 데이터 연결 방식, XAI 입력에 필요한 feature/context/evidence 구조를 정리했다.',
    ],
    achievements: [
      '공동저자 논문: 최은지, 김혜민, 남보현, 류기현, 이상호, 전도현, 강대명, 김관영, 노용훈, "변전소 운영자용 위협 모델: Modbus 기반 기만·물리조작 시나리오," 2025년 한국정보보호학회 동계학술대회, 2025.',
      '2025 대한민국 물산업 혁신창업 대전 우수상, 2025.12.',
    ],
    stack: [
      'OT/ICS Security',
      'Modbus/TCP',
      'XGT FEnet',
      'S7comm',
      'Docker',
      'OpenPLC',
      'SCADA-LTS',
      'pymodbus',
      'SMOD',
      'React',
      'Vite',
      'Elasticsearch',
      'Redis',
      'ML/DL',
      'LSTM-AE',
      'SLM',
      'XAI',
    ],
    result:
      'BoB 글들을 돌아보면 이 프로젝트의 핵심 성과는 단순히 데모를 만든 것이 아니라, OT 보안 문제를 실제 데이터와 시스템 흐름으로 쪼개서 이해한 경험이었다. 팀빌딩 이후 주제를 여러 번 재검토했고, 1차 발표 전에는 아키텍처를 다시 잡으면서 SLM이 어디에서 의미 있는 역할을 해야 하는지 정리했다. 이후 CIC Dataset과 Modbus/TCP 패킷을 분석하며 TID, function code, register, request/response 시간, 502 포트 ACK 처리처럼 탐지 성능에 직접 영향을 주는 필드를 확인했다. 특히 2차 발표 직전에는 전처리 데이터와 SLM 쪽 데이터가 맞지 않는 문제를 추적하다가 TCP ACK가 Modbus 패킷처럼 잡히는 파서 문제를 발견했고, 이 경험을 통해 AI 모델보다 앞단의 파싱과 데이터 검증이 훨씬 중요하다는 점을 체감했다. 발표와 공모전 IR 피칭을 거치면서는 같은 기술이라도 보안 담당자, 개발자, 심사위원에게 다르게 설명해야 한다는 점을 배웠고, 프로젝트 막판에는 ML/DL 결과, SLM 분석, 대시보드 연동이 맞물릴 때 생기는 일정과 통합 리스크까지 경험했다.',
  },
  {
    slug: 'syzdirect',
    title: 'SyzDirect',
    period: '2026.01 - Present',
    status: 'Ongoing',
    role: 'Research / implementation',
    summary:
      'Linux kernel fuzzing에서 목표 코드 지점까지 더 빠르게 도달하기 위한 directed greybox fuzzing 연구 프로젝트. syzkaller와 directed fuzzing 논문을 기반으로 실험 방향을 잡고 있다.',
    contributions: [
      'SyzDirect 논문과 Linux kernel fuzzing 관련 자료를 읽고 핵심 아이디어를 정리했다.',
      'syzkaller의 일반적인 fuzzing 흐름과 directed fuzzing의 차이를 비교했다.',
      '목표 경로, seed selection, coverage feedback을 기준으로 실험 구조를 설계했다.',
      'AFL 계열 fuzzing 구조를 함께 분석하며 baseline과 metric을 정리하고 있다.',
    ],
    stack: ['Linux Kernel', 'Fuzzing', 'Syzkaller', 'AFL', 'Directed Greybox Fuzzing'],
    result:
      '현재 연구와 구현을 병행 중. 다음 단계는 재현 가능한 실험 환경과 baseline 측정 기준을 명확히 정리하는 것이다.',
  },
  {
    slug: 'honeypot-telemetry',
    title: 'Honeypot Telemetry',
    period: '2026 - Present',
    status: 'Ongoing',
    role: 'Security research / system design',
    summary:
      '공격자를 유인하고 행위를 관찰해 위협 인텔리전스로 정리하는 deception-oriented telemetry 프로젝트. 로그 수집, 공격자 fingerprint, 패킷 분석을 중심으로 설계하고 있다.',
    contributions: [
      '수집해야 할 이벤트와 로그 구조를 기준으로 관찰 지점을 정리했다.',
      '공격자 행위를 분류하기 위한 fingerprint와 telemetry 항목을 설계했다.',
      'CTF, 패킷 분석, IDS/IPS 학습 기록을 실제 탐지 관점으로 연결했다.',
      '향후 운영 기록과 샘플 로그를 남길 수 있도록 구조를 정리하고 있다.',
    ],
    stack: ['Honeypot', 'Network Security', 'Telemetry', 'Threat Intelligence', 'IDS/IPS'],
    result:
      '설계와 실험을 진행 중. 이후 공개 가능한 architecture diagram, sample log, 분석 기준을 추가할 계획.',
  },
];

export function getProjectBySlug(slug: string) {
  return PORTFOLIO_PROJECTS.find((project) => project.slug === slug);
}

export function getProjectPath(project: PortfolioProject) {
  return `/projects/${project.slug}`;
}
