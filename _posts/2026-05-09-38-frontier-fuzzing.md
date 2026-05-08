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
<p data-ke-size="size16">&nbsp;</p></div>
