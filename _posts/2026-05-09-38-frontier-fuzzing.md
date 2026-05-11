---
layout: post
title: 프론티어_퍼징
date: 2026-05-09
desc: "퍼징(Fuzzing) 개념 정리 - Mutation-based, Generation-based, AFL++, Syzkaller, Jackalope"
keywords: "fuzzing, AFL++, Syzkaller, Jackalope, mutation, generation, coverage, 퍼징"
categories: [TechnicalDocument]
tags: [퍼징, 프론티어]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/38](https://sanghole.tistory.com/38)

사실 퍼징에 관련해서는  <https://sanghole.tistory.com/13> 에서 한번 정리를 한 적이 있지만.퍼징 프로젝트를 하고 다시 한번 정리를 하고 싶어 미션을 선택하게 되었다.

### Fuzzing.

일단 퍼징이란?

퍼징은 프로그램에 정상/비정상/랜덤/변형된 입력을 대량으로~ 아주 많이~ 넣어보면서 버그를 "자동"으로 찾는 테스트  기법이다.

그러니까 딸-깍 해서 대충(대충 아님) 이거 입력 다 넣어! 해서 어 크래시가 터졌네? 개꿀~ 하는 느낌.

 타겟을 예로 들면 이미지 파서, PDF 파서, 네트워크 서버, 커널 시스템 콜, REST API 등등. 진짜 여러 개가 가능하다.

또한 퍼징의 종류로도 아주 여러 개가 있다.

## 입력 생성 방식 기준.

일단 뭐 입력 생성 방식 기준으로는

## Mutation-based fuzzing  - 기존 샘플 파일을 조금씩 변형 하는 것.

예시를 들면 AFL++, Honggfuzz 등이 있다.

AFL++은 대표적인 퍼저로써 음.. .....

```
if (input[0] == 'P') {
  if (input[1] == 'N') {
    if (input[2] == 'G') {
      crash();
    }
  }
}
```

뭐 이런 함수? 코드가 있다고 하면

입력을 막 넣고 끝나는게 아니라, 이 입력이 프로그램 내부에서 새로운 경로를 열었는지를 본다.

공식 문서도-> AFL의 기본 흐름을 특수 컴파일로 instrumentaion을 넣고, 입력 corpus를 준비하고, 입력을 랜덤 변형하면서 target binary가 새로운 path를 처리했는지평가한다.

- Instrumentation: 프로그램 안에 “어떤 코드 경로가 실행됐는지” 기록하는 추적 코드를 심는 것
- Corpus: 퍼저가 변형에 사용할 초기 입력 파일들의 모음
- Target binary: AFL++가 실제로 실행하면서 테스트하는 대상 프로그램 파일

같은 느낌.

뭐 예시를 들어보면

Instrumentation

```
if (x > 10) {
  foo();
} else {
  bar();
}
```

  여기서 foo랑 bar을 들어갈 때,

```
record_edge("main -> if");

if (x > 10) {
  record_edge("if -> foo");
  foo();
} else {
  record_edge("if -> bar");
  bar();
}
```

이렇게 record를 찍어놓는 것. 그러면 이제 정확히 어떤 코드에 어떻게 들어가면 어디로 들어가는지를 알 수 있따.

AFL의 전체 흐름은

1. 타깃 프로그램 선정

2. AFL++ 컴파일러로 빌드

3. seed corpus를 준비

4. afl-cmin으로 corpus 정리.

5. afl-tmin으로 seed 최소화

6. afl-fuzz 실행

7. crahses/hangs 분석

8. 재현 및 디버

일단 뭐 1번은 어디에 퍼징을 할지 결정을 하는 거고..

2번은 coverage를 추적하기 위해서 instrumentation을 넣는 것 이고 AFL++가 코드 경로를 볼 수 있따.

3번은 처음에 이제 어떻게 시작할지 기본 입력을 제공한다..

4번은 비슷한 coverage를 내는 중복 seed를 제거 함으로써 이제 퍼징 속도!! 업!!

5번은 입력을 작게 작게 해서 불필요한 데이터를 제거한다. 근데 너무 줄이면 의미 구조가 삭제됨..

6번ㅇ느 이제 실제로 퍼징을 한다..

뭐 대충 요런 느낌?

### Generation-based fuzzing.

Domato, RESTler 등등.. 이 있다. 이거는 문법/스펙을 기반으로 처음부터 입력을 생성.

이거는 뭐 기존 입력을 조금씩 변형하는 것은 아니고.. 파일 포맷, API 등등.. 그럴듯한 입력을 새로새로 만들어낸다~~

GPT가 만들어준 표를 기반..

구분Mutation-based fuzzingGeneration-based fuzzing

|  |  |  |
| --- | --- | --- |
| 방식 | 기존 seed 입력을 바꿈 | 문법/스펙 기반으로 새 입력 생성 |
| 예시 | AFL++, libFuzzer | Domato, RESTler, Echidna |
| 장점 | 빠르고 범용적임 | 유효한 입력을 만들기 쉬움 |
| 단점 | 복잡한 문법을 맞추기 어려움 | 문법/스펙 작성이 필요함 |
| 어울리는 대상 | 파일 파서, CLI 프로그램, 라이브러리 | 브라우저 DOM, REST API, 스마트컨트랙트 |

그래서 이게 왜 기존 seed 입력이랑 다르고,ㅡ 왜 필요한데?

예시를 들어보자..

JSON 파서를 퍼징한다고 하면 원래 랜덤 입력은 대부분 ..

진짜 랜덤으로 박아서 @@@%%%AAAA\x00\xff 뭐 이런 값을 넣어서 JSON 문법에 맞지 않아서 초반에 터질 수도 있다~..

그래서 프로그램이 실제로 처리할만한 구조를 가진 입력을 만들어서 fit하게 터친다. 뭔가 이런 느낌?

뭐 장단점만 꼽고 넘어가면

**장점**\
문법/스펙을 기반으로 입력을 만들기 때문에 JSON, API, HTML, 스마트컨트랙트처럼 구조가 복잡한 대상에 강하다.\
무작위 입력보다 유효한 입력을 많이 생성해서 깊은 로직까지 도달하기 쉽다.

**단점**\
좋은 문법, 스펙, property를 사람이 미리 정의해야 해서 준비 비용이 크다.\
스펙에 없는 동작이나 예상 밖의 입력 변형은 잘 탐색하지 못할 수 있다.

## 피드백 기준

종류설명대표 도구

|  |  |  |
| --- | --- | --- |
| Black-box fuzzing | 내부 코드/커버리지 없이 입력만 던짐 | Radamsa, 일부 Jackalope 사용 |
| Grey-box fuzzing | 커버리지 같은 일부 피드백 사용 | AFL++, libFuzzer, Honggfuzz |
| White-box fuzzing | symbolic execution, constraint solving 등 내부 분석 적극 사용 | SAGE류, 일부 하이브리드 퍼저 |

뭐.. 각자를 사용하는 이유는..

종류사용하는 이유

|  |  |
| --- | --- |
| Black-box fuzzing | 소스코드가 없거나 내부 구조를 모를 때도 바로 테스트할 수 있기 때문 |
| Grey-box fuzzing | 커버리지 피드백을 활용해서 단순 랜덤보다 훨씬 효율적으로 버그를 찾을 수 있기 때문 |
| White-box fuzzing | 복잡한 조건문이나 깊은 실행 경로처럼 랜덤 입력으로는 도달하기 어려운 부분을 분석해서 뚫기 위해 사용 |

정도..만?

뭐.. 그래서? 어떤 퍼징 오픈소스?? 플랫폼?? 엔진이 있는데??

---

뭐.. 리눅스 쪽에는 syzkaller라는 오픈소스 퍼저가 있다.

### Syzkaller.

리눅스 커널/Os 커널을 대상으로 하는 대표적인 오픈소스 커널 퍼저.

사람이 계속 개입하지 않아도 알아서 커버리지 피드백을 기반으로 커널 입력을 자동 생성 변형하는 퍼저이다. Linux라고 해도 Windows까지 지원 대상!

뭐 간단하게 설명을 해보자면

리눅스 함수들을 보면

```
open()
read()
write()
ioctl()
mmap()
socket()
mount()
setsockopt()
```

이렇게 되어 있는데

```
open("/dev/...", ...)
ioctl(fd, ...)
mmap(...)
write(fd, ...)
close(fd)
```

이런 느낌으로 이제 여러 syscall들을 조합해서 자동 생성하는 것 이다.

커널에서는

```
kernel panic
use-after-free
out-of-bounds access
deadlock
WARNING
KASAN report
general protection fault
```

이런 친구들의 버그?? 뭐.. 취약점?? crash들이 있는데. 이런 커널 버그를 찾는 자동 딸-깍 도구 이다.

|  |  |
| --- | --- |
| Kernel fuzzer | 일반 애플리케이션이 아니라 OS 커널을 대상으로 퍼징함 |
| Coverage-guided | 새로운 커널 코드 경로를 실행한 입력을 더 중요하게 저장하고 변형함 |
| Unsupervised | 사람이 매번 입력을 설계하지 않아도 자동으로 입력 생성, 실행, 저장, 재시도함 |
| System call 기반 | 파일 하나를 변형하는 방식이 아니라 syscall sequence를 생성함 |
| VM 기반 실행 | 커널이 crash 나도 호스트가 아니라 VM을 재시작하며 계속 퍼징 가능 |
| Crash 자동 저장 | 발견한 crash를 로그, 리포트, 재현 입력 형태로 저장함 |

뭐.. 이런 특징들이 있다고 한다!

### Jackalope.

windows 바이너리 퍼징.. 오픈소스 coverage-guided binary fuzeer이다.

Google.에서 만든 ..

일반적인 AFL++는 소스코드가 있으면 컴파일 단계에서 instrumentation을 넣는다..

```
소스코드 → AFL++ 컴파일러로 빌드 → coverage 추적 → fuzzing
```

그런데 Windows 상용 프로그램이나 닫힌 소스 프로그램은 보통 소스코드가 없음!!!!!!!!

```
프로그램.exe만 있음
소스코드 없음
다시 컴파일 불가
```

Jackalope는 이런 상황에서 실행 파일을 직접 관찰하면서 퍼징할 수 있게 해준다.

```
seed 입력 준비
→ Jackalope가 입력 변형
→ target.exe 실행
→ TinyInst로 coverage 수집
→ 새 경로 발견 시 corpus 저장
→ crash 발생 시 crash 저장
```

즉, Jackalope는 소스코드 없이 Windows/macOS/Linux/Android 바이너리를 퍼징하기 위한 도구라고 보면 된다.

근데 굳이 windows에서 바이너리 퍼징을 해야하나? 싶긴한데.

windows환경에서는 .exe, .dll 형태의 닫힌소스 프로그램들이 많다.

그래서 이런 프로그램은 소스코드를 구하기 어렵기 때문에 AFL++처럼 컴파일 기반 instumentation을 넣기 어렵돠.

gpt가 만들어준 동작 흐름

```
┌────────────────────┐
│ Seed corpus 준비   │
│ 정상 입력 파일들    │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Jackalope Mutator  │
│ 입력 변형           │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Target Binary 실행 │
│ 예: viewer.exe @@  │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ TinyInst Instrument│
│ coverage 수집      │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ 새 coverage 확인   │
│ crash/hang 확인    │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ corpus/crash 저장  │
└────────────────────┘
```

이 친구는 seed corpus에서 입력 하나를 골라서 바이트 단위로 변형..

뭐 예를 들면 특정 바이트를 바꾸거나, 삭제, 삽입, 여러 입력을 섞는 식의 퍼징을 수행한다고 한다.

---

### 계측.

일단 AFL 중심으로 계측을 설명해보자.

AFL++는 소스코드가 있으면 래퍼 컴파일러로 프로그램을 다시 빌드하면서 분기 지점에 커버리지 추적 코드를 삽입한다.

AFL++의 LLVM mode는 컴파일러 내부를이용한 compiler-level-instrumentaion을 사용한다.

compiler-level-instrumentaion : 말 그대로 컴파일러가 코드를 기계어로 바꾸는 과정 중간에 계측 코드를 삽입하는 방식.

예시)

```
if (x == 10) {
    crash();
}
```

원래 코드가 이렇게 되어 있으면.

```
trace_edge(id);   // 이 경로를 지났다는 기록

if (x == 10) {
    trace_edge(id2);
    crash();
}
```

 이렇게 설정해 놓는다. 뭐 실제로는 저렇게 함수 느낌으로는 안 들어갈 수도 있고.. AFL++가 공유 메모리 bitmap에 이 경로를 실행했다!!가 삽입되는 구조.

자..

AFL의 핵심 피드백에서는 어떤 코드 블록을 실행했는가가 아니라? 어느 블록에서 어느 블록으로 이동했는가를 본다.

참 이게 무슨 말이냐 하면

```
cur_location = <COMPILE_TIME_RANDOM>;
shared_mem[cur_location ^ prev_location]++;
prev_location = cur_location >> 1;
```

이런 코드 블록들을 이용해서, edge coverage와 대략적인 branch hit count를 수집한다고 설명한다.

cur\_location => 현재 실행된 지점의 ID.

prev\_location은 직전에 실행된 지점의 ID

그러면 cur\_location ^ prev\_location을 이용하면 직전 지점에서 현재 지점으로 이동한 경로를 활용하여 shared memory bitmap에 기록할 수 있다.

뭐 한국어로 풀어쓰면

B 블록을 실행했다! 이런게 아니라

A->B로 이동했다. OR C->B로 이동했다. 이렇게 해석을 할 수 있는 것.

이렇게 해서 어느 블록에서 어느 블록으로 이동했는지를 확인할 수 있다.

그럼 이거를 이제 왜 이야기를 했냐?

퍼징에서는 옳바른 방향으로, (크래시가 생길 것 같은 방향으로??, 뭔가 터질 것 같은 방향으로?) 무작위 값을 집어넣어야 한다.

이게 이제 AFL 기준으로는 커버리지가 늘어나는 방향으로 퍼징을 해야하는데, 그러면 그거를 어떻게 계측을 해서 어떻게 퍼징을 해야하는지 이해해야 한다.

```
입력 A 실행
→ 함수 f1 진입
→ basic block 3 실행
→ basic block 3에서 block 7로 이동
→ 새로운 경로 발견
```

AFL 기준으로는 이렇게 어떤 함수로 진행했더니 더 높은 커버리지가 나오네?? 이런 느낌으로 중간중간  어떤 경로가 실행됐는지 관찰할 수 있도록 추적 코드를 심어 놓는 것을 의미한다.

그러면 AFL은 저렇게 블록 간의 이동을 통해, 그리고 LLVM을 활용한 컴파일러를 통해 계측을 하는데, 다른 퍼징은 어떻게 할까?

내 생각으로는 AFL은 뭔가 리눅스에서 사용하는 느낌이 강해서, window에서 주로 사용한다는 jackalope를 예시로 들어본다.

```
입력 샘플 선택
    ↓
Mutator가 입력 변형
    ↓
변형된 입력을 target binary에 전달
    ↓
TinyInst가 지정된 모듈을 동적 계측
    ↓
basic block / edge 실행 여부 수집
    ↓
새로운 coverage면 corpus에 저장
    ↓
그 입력을 다시 우선적으로 변형
```

여기서 TinyInst가 뭐냐면 target을 실행한 뒤, coverage를 수집해주는? 그런 친구이ㅏㄷ. 사용자가 지정한 모듈만 계측하고 나머지는 네이티브로 실행할 수 있는 lightweight dynamic instrumentation library이다.

자 이제 또 무슨 소리냐면

전체를 다 보는 것이 아니라, 취약점을 찾고 싶은 핵심 모듈에만 추적 코드를 붙여서 coverage를 수집하는 방식이ㅏㄷ.

여기서 Tinylnst는 단순히 실행을 했음에 초점을 두는 것이 아니라 basic block이나 edge 단위의 실행 정보를 수집할수 있다는 점!

그래서 Tinylnst는 수집한 coverage를 바탕으로 새로운 코드 경로를 여는지 판단하고 그 해당 새로운 코드 경로의 basic block이나 edge에 도달한 입력들은 또 corpus에 저장하고~ 이후 그거를 활용해서 변형하고,. 이것에 반복.

AFL처럼 coverage-guided이지만 AFL은 컴파일 시점에 계측을 삽입하지만 이 친구는 black-box를 기반으로 하여 실행 중에 계속 동적으로 계측한다는 점에서 차별점이 있다.
