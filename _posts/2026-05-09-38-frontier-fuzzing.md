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

<div class="tt_article_useless_p_margin contents_style"><p data-ke-size="size16">사실 퍼징에 관련해서는&nbsp; <a href="https://sanghole.tistory.com/13" target="_blank" rel="noopener&nbsp;noreferrer">https://sanghole.tistory.com/13</a> 에서 한번 정리를 한 적이 있지만.퍼징 프로젝트를 하고 다시 한번 정리를 하고 싶어 미션을 선택하게 되었다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">Fuzzing.</h3>
<p data-ke-size="size16">일단 퍼징이란?</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">퍼징은 프로그램에 정상/비정상/랜덤/변형된 입력을 대량으로~ 아주 많이~ 넣어보면서 버그를 "자동"으로 찾는 테스트&nbsp; 기법이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그러니까 딸-깍 해서 대충(대충 아님) 이거 입력 다 넣어! 해서 어 크래시가 터졌네? 개꿀~ 하는 느낌.&nbsp;</p>
<p data-ke-size="size16">&nbsp;타겟을 예로 들면 이미지 파서, PDF 파서, 네트워크 서버, 커널 시스템 콜, REST API 등등. 진짜 여러 개가 가능하다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">또한 퍼징의 종류로도 아주 여러 개가 있다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h2 data-ke-size="size26">입력 생성 방식 기준.&nbsp;</h2>
<p data-ke-size="size16">일단 뭐 입력 생성 방식 기준으로는</p>
<h2 data-ke-size="size26">Mutation-based fuzzing&nbsp; - 기존 샘플 파일을 조금씩 변형 하는 것.&nbsp;</h2>
<p data-ke-size="size16">예시를 들면 AFL++, Honggfuzz 등이 있다.</p>
<p data-ke-size="size16">AFL++은 대표적인 퍼저로써 음.. .....</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1778247505700" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>if (input[0] == 'P') {
  if (input[1] == 'N') {
    if (input[2] == 'G') {
      crash();
    }
  }
}</code></pre>
<p data-ke-size="size16">뭐 이런 함수? 코드가 있다고 하면</p>
<p data-ke-size="size16">입력을 막 넣고 끝나는게 아니라, 이 입력이 프로그램 내부에서 새로운 경로를 열었는지를 본다.&nbsp;</p>
<p data-ke-size="size16">공식 문서도-&gt; AFL의 기본 흐름을 특수 컴파일로 instrumentaion을 넣고, 입력 corpus를 준비하고, 입력을 랜덤 변형하면서 target binary가 새로운 path를 처리했는지평가한다.&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<ul style="list-style-type: disc;" data-ke-list-type="disc">
<li data-end="67" data-start="0">Instrumentation: 프로그램 안에 &ldquo;어떤 코드 경로가 실행됐는지&rdquo; 기록하는 추적 코드를 심는 것</li>
<li data-end="109" data-start="68">Corpus: 퍼저가 변형에 사용할 초기 입력 파일들의 모음</li>
<li data-is-last-node="" data-end="164" data-start="110">Target binary: AFL++가 실제로 실행하면서 테스트하는 대상 프로그램 파일</li>
</ul>
<p data-ke-size="size16">같은 느낌.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">뭐 예시를 들어보면</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">Instrumentation</p>
<pre id="code_1778252357916" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>if (x &gt; 10) {
  foo();
} else {
  bar();
}</code></pre>
<p data-ke-size="size16">&nbsp; 여기서 foo랑 bar을 들어갈 때,</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1778252413528" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>record_edge("main -&gt; if");

if (x &gt; 10) {
  record_edge("if -&gt; foo");
  foo();
} else {
  record_edge("if -&gt; bar");
  bar();
}</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이렇게 record를 찍어놓는 것. 그러면 이제 정확히 어떤 코드에 어떻게 들어가면 어디로 들어가는지를 알 수 있따.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">AFL의 전체 흐름은</p>
<p data-ke-size="size16">1. 타깃 프로그램 선정</p>
<p data-ke-size="size16">2. AFL++ 컴파일러로 빌드</p>
<p data-ke-size="size16">3. seed corpus를 준비</p>
<p data-ke-size="size16">4. afl-cmin으로 corpus 정리.</p>
<p data-ke-size="size16">5. afl-tmin으로 seed 최소화</p>
<p data-ke-size="size16">6. afl-fuzz 실행</p>
<p data-ke-size="size16">7. crahses/hangs 분석</p>
<p data-ke-size="size16">8. 재현 및 디버</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">일단 뭐 1번은 어디에 퍼징을 할지 결정을 하는 거고..</p>
<p data-ke-size="size16">2번은 coverage를 추적하기 위해서 instrumentation을 넣는 것 이고 AFL++가 코드 경로를 볼 수 있따.&nbsp;</p>
<p data-ke-size="size16">3번은 처음에 이제 어떻게 시작할지 기본 입력을 제공한다..&nbsp;</p>
<p data-ke-size="size16">4번은 비슷한 coverage를 내는 중복 seed를 제거 함으로써 이제 퍼징 속도!! 업!!</p>
<p data-ke-size="size16">5번은 입력을 작게 작게 해서 불필요한 데이터를 제거한다. 근데 너무 줄이면 의미 구조가 삭제됨..</p>
<p data-ke-size="size16">6번ㅇ느 이제 실제로 퍼징을 한다..</p>
<p data-ke-size="size16">뭐 대충 요런 느낌?</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">Generation-based fuzzing.</h3>
<p data-ke-size="size16">Domato, RESTler 등등.. 이 있다. 이거는 문법/스펙을 기반으로 처음부터 입력을 생성.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이거는 뭐 기존 입력을 조금씩 변형하는 것은 아니고.. 파일 포맷, API 등등.. 그럴듯한 입력을 새로새로 만들어낸다~~</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">GPT가 만들어준 표를 기반..</p>
<p data-ke-size="size16">구분Mutation-based fuzzingGeneration-based fuzzing</p>
<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td>방식</td>
<td>기존 seed 입력을 바꿈</td>
<td>문법/스펙 기반으로 새 입력 생성</td>
</tr>
<tr>
<td>예시</td>
<td>AFL++, libFuzzer</td>
<td>Domato, RESTler, Echidna</td>
</tr>
<tr>
<td>장점</td>
<td>빠르고 범용적임</td>
<td>유효한 입력을 만들기 쉬움</td>
</tr>
<tr>
<td>단점</td>
<td>복잡한 문법을 맞추기 어려움</td>
<td>문법/스펙 작성이 필요함</td>
</tr>
<tr>
<td>어울리는 대상</td>
<td>파일 파서, CLI 프로그램, 라이브러리</td>
<td>브라우저 DOM, REST API, 스마트컨트랙트</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그래서 이게 왜 기존 seed 입력이랑 다르고,ㅡ 왜 필요한데?</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">예시를 들어보자..</p>
<p data-ke-size="size16">JSON 파서를 퍼징한다고 하면 원래 랜덤 입력은 대부분 ..</p>
<p data-ke-size="size16">진짜 랜덤으로 박아서 @@@%%%AAAA\x00\xff 뭐 이런 값을 넣어서 JSON 문법에 맞지 않아서 초반에 터질 수도 있다~..</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그래서 프로그램이 실제로 처리할만한 구조를 가진 입력을 만들어서 fit하게 터친다. 뭔가 이런 느낌?</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">뭐 장단점만 꼽고 넘어가면</p>
<div>
<div>
<div>
<div data-turn-start-message="true" data-message-model-slug="gpt-5-5-thinking" data-message-id="dddd7dc5-d622-421c-930f-81c6f8f99be9" data-message-author-role="assistant">
<div>
<div>
<p data-end="120" data-start="0" data-ke-size="size16"><b>장점</b><br />문법/스펙을 기반으로 입력을 만들기 때문에 JSON, API, HTML, 스마트컨트랙트처럼 구조가 복잡한 대상에 강하다.<br />무작위 입력보다 유효한 입력을 많이 생성해서 깊은 로직까지 도달하기 쉽다.</p>
<p data-is-only-node="" data-is-last-node="" data-end="220" data-start="122" data-ke-size="size16"><b>단점</b><br />좋은 문법, 스펙, property를 사람이 미리 정의해야 해서 준비 비용이 크다.<br />스펙에 없는 동작이나 예상 밖의 입력 변형은 잘 탐색하지 못할 수 있다.</p>
</div>
</div>
</div>
</div>
<div>&nbsp;</div>
<div>&nbsp;</div>
</div>
</div>
<h2 data-ke-size="size26">피드백 기준</h2>
<p data-ke-size="size16">종류설명대표 도구</p>
<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td>Black-box fuzzing</td>
<td>내부 코드/커버리지 없이 입력만 던짐</td>
<td>Radamsa, 일부 Jackalope 사용</td>
</tr>
<tr>
<td>Grey-box fuzzing</td>
<td>커버리지 같은 일부 피드백 사용</td>
<td>AFL++, libFuzzer, Honggfuzz</td>
</tr>
<tr>
<td>White-box fuzzing</td>
<td>symbolic execution, constraint solving 등 내부 분석 적극 사용</td>
<td>SAGE류, 일부 하이브리드 퍼저</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">뭐.. 각자를 사용하는 이유는..</p>
<p data-ke-size="size16">종류사용하는 이유</p>
<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td>Black-box fuzzing</td>
<td>소스코드가 없거나 내부 구조를 모를 때도 바로 테스트할 수 있기 때문</td>
</tr>
<tr>
<td>Grey-box fuzzing</td>
<td>커버리지 피드백을 활용해서 단순 랜덤보다 훨씬 효율적으로 버그를 찾을 수 있기 때문</td>
</tr>
<tr>
<td>White-box fuzzing</td>
<td>복잡한 조건문이나 깊은 실행 경로처럼 랜덤 입력으로는 도달하기 어려운 부분을 분석해서 뚫기 위해 사용</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">정도..만?</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">뭐.. 그래서? 어떤 퍼징 오픈소스?? 플랫폼?? 엔진이 있는데??</p>
<hr contenteditable="false" data-ke-type="horizontalRule" data-ke-style="style5" />
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">뭐.. 리눅스 쪽에는 syzkaller라는 오픈소스 퍼저가 있다.&nbsp;</p>
<h3 data-ke-size="size23">Syzkaller.</h3>
<p data-ke-size="size16">리눅스 커널/Os 커널을 대상으로 하는 대표적인 오픈소스 커널 퍼저.</p>
<p data-ke-size="size16">사람이 계속 개입하지 않아도 알아서 커버리지 피드백을 기반으로 커널 입력을 자동 생성 변형하는 퍼저이다. Linux라고 해도 Windows까지 지원 대상!</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">뭐 간단하게 설명을 해보자면</p>
<p data-ke-size="size16">리눅스 함수들을 보면</p>
<pre id="code_1778255605969" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>open()
read()
write()
ioctl()
mmap()
socket()
mount()
setsockopt()</code></pre>
<p data-ke-size="size16">이렇게 되어 있는데</p>
<pre id="code_1778255645869" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>open("/dev/...", ...)
ioctl(fd, ...)
mmap(...)
write(fd, ...)
close(fd)</code></pre>
<p data-ke-size="size16">이런 느낌으로 이제 여러 syscall들을 조합해서 자동 생성하는 것 이다.&nbsp;</p>
<p data-ke-size="size16">커널에서는&nbsp;</p>
<pre id="code_1778255679127" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>kernel panic
use-after-free
out-of-bounds access
deadlock
WARNING
KASAN report
general protection fault</code></pre>
<p data-ke-size="size16">이런 친구들의 버그?? 뭐.. 취약점?? crash들이 있는데. 이런 커널 버그를 찾는 자동 딸-깍 도구 이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td>Kernel fuzzer</td>
<td>일반 애플리케이션이 아니라 OS 커널을 대상으로 퍼징함</td>
</tr>
<tr>
<td>Coverage-guided</td>
<td>새로운 커널 코드 경로를 실행한 입력을 더 중요하게 저장하고 변형함</td>
</tr>
<tr>
<td>Unsupervised</td>
<td>사람이 매번 입력을 설계하지 않아도 자동으로 입력 생성, 실행, 저장, 재시도함</td>
</tr>
<tr>
<td>System call 기반</td>
<td>파일 하나를 변형하는 방식이 아니라 syscall sequence를 생성함</td>
</tr>
<tr>
<td>VM 기반 실행</td>
<td>커널이 crash 나도 호스트가 아니라 VM을 재시작하며 계속 퍼징 가능</td>
</tr>
<tr>
<td>Crash 자동 저장</td>
<td>발견한 crash를 로그, 리포트, 재현 입력 형태로 저장함</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">뭐.. 이런 특징들이 있다고 한다!</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">Jackalope.</h3>
<p data-ke-size="size16">windows 바이너리 퍼징.. 오픈소스 coverage-guided binary fuzeer이다.</p>
<p data-ke-size="size16">Google.에서 만든 ..</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-end="401" data-start="349" data-ke-size="size16">일반적인 AFL++는 소스코드가 있으면 컴파일 단계에서 instrumentation을 넣는다..</p>
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
<pre class="bash" data-ke-language="bash"><code>소스코드 &rarr; AFL++ 컴파일러로 빌드 &rarr; coverage 추적 &rarr; fuzzing</code></pre>
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
<p data-end="508" data-start="462" data-ke-size="size16">그런데 Windows 상용 프로그램이나 닫힌 소스 프로그램은 보통 소스코드가 없음!!!!!!!!</p>
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
<pre class="css"><code>프로그램.exe만 있음
소스코드 없음
다시 컴파일 불가</code></pre>
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
<p data-end="602" data-start="554" data-ke-size="size16">Jackalope는 이런 상황에서 실행 파일을 직접 관찰하면서 퍼징할 수 있게 해준다.</p>
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
<pre class="aspectj"><code>seed 입력 준비
&rarr; Jackalope가 입력 변형
&rarr; target.exe 실행
&rarr; TinyInst로 coverage 수집
&rarr; 새 경로 발견 시 corpus 저장
&rarr; crash 발생 시 crash 저장</code></pre>
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
<p data-end="810" data-start="731" data-ke-size="size16">즉, Jackalope는 소스코드 없이 Windows/macOS/Linux/Android 바이너리를 퍼징하기 위한 도구라고 보면 된다.</p>
<p data-end="810" data-start="731" data-ke-size="size16">&nbsp;</p>
<p data-end="810" data-start="731" data-ke-size="size16">근데 굳이 windows에서 바이너리 퍼징을 해야하나? 싶긴한데.</p>
<p data-end="810" data-start="731" data-ke-size="size16">&nbsp;</p>
<p data-end="810" data-start="731" data-ke-size="size16">windows환경에서는 .exe, .dll 형태의 닫힌소스 프로그램들이 많다.</p>
<p data-end="810" data-start="731" data-ke-size="size16">&nbsp;</p>
<p data-end="810" data-start="731" data-ke-size="size16">그래서 이런 프로그램은 소스코드를 구하기 어렵기 때문에 AFL++처럼 컴파일 기반 instumentation을 넣기 어렵돠.</p>
<p data-end="810" data-start="731" data-ke-size="size16">&nbsp;</p>
<p data-end="810" data-start="731" data-ke-size="size16">gpt가 만들어준 동작 흐름</p>
<pre id="code_1778256126883" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>┌────────────────────┐
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
└────────────────────┘</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이 친구는 seed corpus에서 입력 하나를 골라서 바이트 단위로 변형..</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">뭐 예를 들면 특정 바이트를 바꾸거나, 삭제, 삽입, 여러 입력을 섞는 식의 퍼징을 수행한다고 한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<hr contenteditable="false" data-ke-type="horizontalRule" data-ke-style="style5" />
<h3 data-ke-size="size23">계측.</h3>
<p data-ke-size="size16">일단 AFL 중심으로 계측을 설명해보자.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">AFL++는 소스코드가 있으면 래퍼 컴파일러로 프로그램을 다시 빌드하면서 분기 지점에 커버리지 추적 코드를 삽입한다.</p>
<p data-ke-size="size16">AFL++의 LLVM mode는 컴파일러 내부를이용한 compiler-level-instrumentaion을 사용한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">compiler-level-instrumentaion : 말 그대로 컴파일러가 코드를 기계어로 바꾸는 과정 중간에 계측 코드를 삽입하는 방식.</p>
<p data-ke-size="size16">예시)</p>
<pre id="code_1778429603410" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>if (x == 10) {
    crash();
}</code></pre>
<p data-ke-size="size16">원래 코드가 이렇게 되어 있으면.</p>
<pre id="code_1778429618356" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>trace_edge(id);   // 이 경로를 지났다는 기록

if (x == 10) {
    trace_edge(id2);
    crash();
}</code></pre>
<p data-ke-size="size16">&nbsp;이렇게 설정해 놓는다. 뭐 실제로는 저렇게 함수 느낌으로는 안 들어갈 수도 있고.. AFL++가 공유 메모리 bitmap에 이 경로를 실행했다!!가 삽입되는 구조.&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">자..</p>
<p data-ke-size="size16">AFL의 핵심 피드백에서는 어떤 코드 블록을 실행했는가가 아니라? 어느 블록에서 어느 블록으로 이동했는가를 본다.</p>
<p data-ke-size="size16">참 이게 무슨 말이냐 하면</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1778450914106" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>cur_location = &lt;COMPILE_TIME_RANDOM&gt;;
shared_mem[cur_location ^ prev_location]++;
prev_location = cur_location &gt;&gt; 1;</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이런 코드 블록들을 이용해서, edge coverage와 대략적인 branch hit count를 수집한다고 설명한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">cur_location =&gt; 현재 실행된 지점의 ID.</p>
<p data-ke-size="size16">prev_location은 직전에 실행된 지점의 ID</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그러면 cur_location ^ prev_location을 이용하면 직전 지점에서 현재 지점으로 이동한 경로를 활용하여 shared memory bitmap에 기록할 수 있다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">뭐 한국어로 풀어쓰면</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">B 블록을 실행했다! 이런게 아니라</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">A-&gt;B로 이동했다. OR C-&gt;B로 이동했다. 이렇게 해석을 할 수 있는 것.</p>
<p data-ke-size="size16">이렇게 해서 어느 블록에서 어느 블록으로 이동했는지를 확인할 수 있다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그럼 이거를 이제 왜 이야기를 했냐?</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">퍼징에서는 옳바른 방향으로, (크래시가 생길 것 같은 방향으로??, 뭔가 터질 것 같은 방향으로?) 무작위 값을 집어넣어야 한다.</p>
<p data-ke-size="size16">이게 이제 AFL 기준으로는 커버리지가 늘어나는 방향으로 퍼징을 해야하는데, 그러면 그거를 어떻게 계측을 해서 어떻게 퍼징을 해야하는지 이해해야 한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1778451286440" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>입력 A 실행
&rarr; 함수 f1 진입
&rarr; basic block 3 실행
&rarr; basic block 3에서 block 7로 이동
&rarr; 새로운 경로 발견</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">AFL 기준으로는 이렇게 어떤 함수로 진행했더니 더 높은 커버리지가 나오네?? 이런 느낌으로 중간중간&nbsp; 어떤 경로가 실행됐는지 관찰할 수 있도록 추적 코드를 심어 놓는 것을 의미한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그러면 AFL은 저렇게 블록 간의 이동을 통해, 그리고 LLVM을 활용한 컴파일러를 통해 계측을 하는데, 다른 퍼징은 어떻게 할까?</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">내 생각으로는 AFL은 뭔가 리눅스에서 사용하는 느낌이 강해서, window에서 주로 사용한다는 jackalope를 예시로 들어본다.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1778451483634" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>입력 샘플 선택
    &darr;
Mutator가 입력 변형
    &darr;
변형된 입력을 target binary에 전달
    &darr;
TinyInst가 지정된 모듈을 동적 계측
    &darr;
basic block / edge 실행 여부 수집
    &darr;
새로운 coverage면 corpus에 저장
    &darr;
그 입력을 다시 우선적으로 변형</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">여기서 TinyInst가 뭐냐면 target을 실행한 뒤, coverage를 수집해주는? 그런 친구이ㅏㄷ. 사용자가 지정한 모듈만 계측하고 나머지는 네이티브로 실행할 수 있는 lightweight dynamic instrumentation library이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">자 이제 또 무슨 소리냐면</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">전체를 다 보는 것이 아니라, 취약점을 찾고 싶은 핵심 모듈에만 추적 코드를 붙여서 coverage를 수집하는 방식이ㅏㄷ.</p>
<p data-ke-size="size16">여기서 Tinylnst는 단순히 실행을 했음에 초점을 두는 것이 아니라 basic block이나 edge 단위의 실행 정보를 수집할수 있다는 점!</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그래서 Tinylnst는 수집한 coverage를 바탕으로 새로운 코드 경로를 여는지 판단하고 그 해당 새로운 코드 경로의 basic block이나 edge에 도달한 입력들은 또 corpus에 저장하고~ 이후 그거를 활용해서 변형하고,. 이것에 반복.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">AFL처럼 coverage-guided이지만 AFL은 컴파일 시점에 계측을 삽입하지만 이 친구는 black-box를 기반으로 하여 실행 중에 계속 동적으로 계측한다는 점에서 차별점이 있다.</p>
<p data-ke-size="size16">&nbsp;</p></div>
