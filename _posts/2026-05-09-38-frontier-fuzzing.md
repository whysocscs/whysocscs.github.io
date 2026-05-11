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

<h2 data-end="516" data-start="495" data-ke-size="size26">퍼저는 크래시를 어떻게 판단할까?</h2>
<p data-end="539" data-start="518" data-ke-size="size16">자.. 그러면 퍼저가 입력을 막 넣다가</p>
<p data-end="552" data-start="541" data-ke-size="size16">어? 이거 크래시네?</p>
<p data-end="568" data-start="554" data-ke-size="size16">이거를 어떻게 아는 걸까?</p>
<p data-end="580" data-start="570" data-ke-size="size16">생각보다 단순하다.</p>
<p data-end="660" data-start="582" data-ke-size="size16">퍼저는 target program을 실행한 다음에, 그 프로그램이 정상적으로 끝났는지, 아니면 비정상적으로 죽었는지를 본다.</p>
<p data-end="685" data-start="662" data-ke-size="size16">예를 들어 일반 프로그램을 퍼징한다고 하면</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="fortran"><code>입력 생성
    &darr;
target program 실행
    &darr;
종료 상태 확인
    &darr;
정상 종료 / crash / hang 판단</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div>&nbsp;</div>
</div>
</div>
</div>
<p data-end="783" data-start="775" data-ke-size="size16">이런 느낌이다.</p>
<p data-end="815" data-start="785" data-ke-size="size16">프로그램이 그냥 정상적으로 끝나면 일반 실행으로 본다.</p>
<p data-end="902" data-start="817" data-ke-size="size16">근데 입력을 넣었더니 프로그램이 갑자기 SIGSEGV, SIGABRT, SIGBUS, SIGILL, SIGFPE 같은 시그널로 죽으면?</p>
<p data-end="917" data-start="904" data-ke-size="size16">그건 이제 퍼저 입장에서 아 이 입력은 프로그램을 비정상 종료시키는구나? 하면서 확인할 수 있게 된다.</p>
<p data-end="979" data-start="959" data-ke-size="size16">&nbsp;</p>
<p data-end="986" data-start="981" data-ke-size="size16">예를 들면</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="properties"><code>SIGSEGV &rarr; 잘못된 메모리 접근
SIGABRT &rarr; abort() 호출
SIGFPE  &rarr; 0으로 나누기 같은 산술 오류
SIGILL  &rarr; 잘못된 명령어 실행</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div>&nbsp;</div>
</div>
</div>
</div>
<p data-end="1099" data-start="1091" data-ke-size="size16">뭐 이런 느낌.</p>
<p data-end="1169" data-start="1101" data-ke-size="size16">그러니까 AFL++ 같은 퍼저가 이건 use-after-free다! 이런 식으로 처음부터 정확히 분석하는 것은 아니다.</p>
<p data-end="1174" data-start="1171" data-ke-size="size16">일단은</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="erlang"><code>이 입력을 넣었더니 target binary가 죽었다.
&rarr; crash input으로 저장.</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div>&nbsp;</div>
</div>
</div>
</div>
<p data-end="1251" data-start="1240" data-ke-size="size16">이렇게 보는 것이다.</p>
<p data-end="1297" data-start="1253" data-ke-size="size16">그리고 ASan, UBSan 같은 sanitizer를 같이 쓰면 더 잘 잡힌다.</p>
<p data-end="1359" data-start="1299" data-ke-size="size16">예를 들어 버퍼 오버플로우나 use-after-free 같은 버그는 그냥 실행하면 바로 안 죽을 수도 있다.</p>
<p data-end="1423" data-start="1361" data-ke-size="size16">근데 ASan을 켜고 빌드하면 이런 메모리 오류가 발생했을 때 ASan이 잡아내고 프로그램을 강제로 종료시킨다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="arduino"><code>heap-buffer-overflow 발생
    &darr;
ASan이 감지
    &darr;
프로그램 abort
    &darr;
퍼저가 crash로 판단</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div>&nbsp;</div>
</div>
</div>
</div>
<p data-end="1521" data-start="1514" data-ke-size="size16">이런 식이다.</p>
<p data-end="1537" data-start="1523" data-ke-size="size16">커널 퍼징은 조금 다르다.</p>
<p data-end="1635" data-start="1539" data-ke-size="size16">syzkaller 같은 커널 퍼저는 일반 프로그램처럼 단순히 프로세스가 SIGSEGV로 죽는지만 보는 게 아니라, VM 안에서 커널을 실행해놓고 커널 로그를 계속 확인한다.</p>
<p data-end="1669" data-start="1637" data-ke-size="size16">커널 쪽에서는 이런 것들이 crash 신호가 될 수 있다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="vhdl"><code>kernel panic
KASAN report
BUG()
WARNING
general protection fault
use-after-free
out-of-bounds access
deadlock</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div>&nbsp;</div>
</div>
</div>
</div>
<p data-end="1875" data-start="1794" data-ke-size="size16">그래서 syzkaller는 syscall sequence를 실행하다가 커널 로그에서 KASAN report나 kernel panic 같은 게 뜨면 어 해당 syscall 조합이 커널을 떠뜨렸네?&nbsp;하고 crash로 저장한다.</p>
<p data-end="1964" data-start="1934" data-ke-size="size16">정리하면 퍼저가 크래시를 판단하는 기준은 대충 이렇다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="bash" data-ke-language="bash"><code>일반 프로그램 퍼징
&rarr; 프로그램 종료 코드 / signal 확인

Sanitizer 사용 시
&rarr; ASan, UBSan 등이 오류를 감지하고 abort하면 crash로 판단

커널 퍼징
&rarr; kernel panic, KASAN report, BUG, WARNING 같은 커널 로그 확인</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div>&nbsp;</div>
</div>
</div>
</div>
<p data-end="2193" data-start="2137" data-ke-size="size16">결국 퍼저는 입력을 넣고 끝나는 게 아니라, 입력을 넣은 뒤에 target이 어떻게 끝났는지를 본다.</p>
<p data-end="2275" data-start="2195" data-ke-size="size16">정상적으로 끝났으면 그냥 넘어가고, 새로운 coverage가 있으면 corpus에 저장하고, 비정상 종료가 발생하면 crash로 따로 저장한다.</p>
<p data-end="2275" data-start="2195" data-ke-size="size16">&nbsp;</p>
<h3 data-end="2275" data-start="2195" data-ke-size="size23">그러면 crash를 어떻게 재현할까?</h3>
<p data-end="128" data-start="88" data-ke-size="size16">crash가 발생했을 때, 이것을 어떻게 다시 확인할 수 있을까?</p>
<p data-end="216" data-start="130" data-ke-size="size16">퍼저가 crash를 발견하면 보통 그때 사용했던 입력 파일을 따로 저장한다.<br />이 입력을 넣었더니 프로그램이 죽었다!! 라고 남겨놓는 것.&nbsp;</p>
<p data-end="342" data-start="218" data-ke-size="size16">예를 들어 AFL++에서는 crash를 유발한 입력이 crashes/ 디렉터리에 저장된다.<br />이후 해당 입력 파일을 다시 target program에 넣어보면, 같은 지점에서 다시 crash가 나는지 확인할 수 있다.</p>
<p data-end="361" data-start="344" data-ke-size="size16">간단하게 말하면 이런 흐름이다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="fortran"><code>퍼저가 입력 생성
    &darr;
target program 실행
    &darr;
비정상 종료 발생
    &darr;
crash 입력 저장
    &darr;
저장된 입력으로 다시 실행
    &darr;
같은 crash가 재현되는지 확인</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div>&nbsp;</div>
</div>
</div>
</div>
<p data-end="610" data-start="490" data-ke-size="size16">여기서 중요한 점은 한 번 crash가 났다고 해서 바로 의미 있는 버그라고 판단하면 안 된다는 것이다.<br />환경 문제일 수도 있고, 타이밍 문제일 수도 있고, 우연히 한 번만 발생한 crash일 수도 있다.&nbsp;</p>
<p data-end="786" data-start="612" data-ke-size="size16">그래서 퍼징에서는 crash가 발생한 입력을 다시 실행해보면서, 정말 같은 문제가 반복되는지 확인한다.<br />같은 입력을 넣었을 때 계속 segmentation fault가 발생하거나, 같은 sanitizer report가 나오거나, 같은 kernel panic이 발생하면 재현 가능한 crash라고 볼 수 있다.</p>
<p data-end="855" data-start="788" data-ke-size="size16">즉, 퍼징에서 중요한 것은 단순히 crash를 많이 찾는 것이 아니라,<br />재현 가능한 crash를 찾는 것이다.</p>
<p data-end="949" data-start="857" data-ke-size="size16">또한 crash가 여러 개 저장되어 있다고 해서, 그 수만큼 버그가 있다는 뜻은 아니다.<br />같은 버그가 입력만 조금 다른 형태로 여러 번 터질 수도 있기 때문이다.</p>
<p data-end="1036" data-start="951" data-ke-size="size16">그래서 실제 분석 단계에서는 저장된 crash 입력들을 다시 실행해보고,<br />비슷한 crash는 하나로 묶고, 재현되지 않는 crash는 따로 분류한다.</p>
