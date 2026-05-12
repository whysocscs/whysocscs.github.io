---
layout: post
title: 프론티어_CodeQL.
date: 2026-05-13
desc: "CodeQL 개념, 분석 원리(Extractor/Database), QL 언어 구조, 보안 분석 모델(Source/Sink/Data Flow/Taint Tracking) 정리"
keywords: "CodeQL, QL, SAST, 정적분석, Source, Sink, DataFlow, TaintTracking, GitHub, 보안분석, 프론티어"
categories: [TechnicalDocument]
tags: [프론티어, CodeQL, SAST, 정적분석]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/43](https://sanghole.tistory.com/43)

<h2 data-end="967" data-start="950" data-section-id="1gkkb06" data-ke-size="size26">1. CodeQL이란?</h2>
<p data-ke-size="size16"><a href="https://codeql.github.com/" target="_blank" rel="noopener noreferrer">https://codeql.github.com/</a></p>
<p data-end="1118" data-start="969" data-ke-size="size16">CodeQL은 GitHub에서 제공하는 정적 애플리케이션 보안 테스트 도구이다.</p>
<p data-end="1118" data-start="969" data-ke-size="size16">일반적인 정적 분석 도구가 미리 정의된 규칙을 기반으로 위험 패턴을 탐지하는 것과 달리, CodeQL은 소스코드를 데이터베이스로 변환한 뒤 사용자가 직접 질의를 작성하여 분석할 수 있다. </p>
<p data-end="1297" data-start="1120" data-ke-size="size16">CodeQL의 핵심 개념은 코드를 데이터처럼 질의한다는 것이다.</p>
<p data-end="1297" data-start="1120" data-ke-size="size16"> </p>
<p data-end="1297" data-start="1120" data-ke-size="size16">일반적으로 개발자는 소스코드를 파일 단위로 읽으면서 함수 호출 관계, 변수 흐름, 외부 입력값의 처리 과정을 수동으로 추적한다. 반면 CodeQL은 이러한 코드 구조를 데이터베이스 형태로 저장하고, QL 질의를 통해 특정 보안 패턴을 자동으로 탐색한다.</p>
<p data-end="1336" data-start="1299" data-ke-size="size16">예를 들어 다음과 같은 질문을 CodeQL 쿼리로 표현할 수 있다.</p>
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
<pre class="bash" data-ke-language="bash"><code>사용자 입력값이 SQL 쿼리에 직접 전달되는가
HTTP 요청 파라미터가 OS 명령 실행 함수로 전달되는가
검증되지 않은 파일 경로가 파일 읽기 함수에 사용되는가
eval 함수가 외부 입력값을 인자로 받아 실행되는가
암호학적으로 안전하지 않은 난수 생성 함수가 사용되는가</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="1568" data-start="1502" data-ke-size="size16"> </p>
<h2 data-end="1593" data-start="1575" data-section-id="1yewcnh" data-ke-size="size26">2. CodeQL 분석 원리</h2>
<h3 data-end="1611" data-start="1595" data-section-id="1tnf40v" data-ke-size="size23">2.1 전체 분석 구조</h3>
<p data-end="1638" data-start="1613" data-ke-size="size16">CodeQL의 전체 분석 과정은 다음과 같다.</p>
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
<pre class="bash" data-ke-language="bash"><code>분석 대상 소스코드
        ↓
언어별 Extractor 실행
        ↓
TRAP 파일 생성
        ↓
CodeQL Database 생성
        ↓
QL Query 실행
        ↓
분석 결과 생성
        ↓
SARIF 또는 Code Scanning Alert 출력</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="1988" data-start="1824" data-ke-size="size16">CodeQL은 소스코드를 직접 분석 결과로 변환하지 않는다. 이게 살짝 키포인트인 것 같다. 직접 분석 결과를 하지 않는 것이.</p>
<p data-end="1988" data-start="1824" data-ke-size="size16"> </p>
<p data-end="1988" data-start="1824" data-ke-size="size16">먼저 언어별 Extractor를 사용하여 코드의 구조를 추출한다. Extractor는 함수, 변수, 클래스, 호출식, 표현식, 파일 정보, 타입 정보 등을 분석 가능한 형태로 변환한다. 이 정보는 CodeQL 데이터베이스로 저장된다.</p>
<p data-end="2104" data-start="1990" data-ke-size="size16">이후 QL 쿼리는 생성된 데이터베이스를 대상으로 실행된다. 따라서 CodeQL에서 분석한다는 것은 소스코드를 직접 검색하는 것이 아니라, 소스코드에서 추출된 데이터베이스를 질의하는 과정이라고 볼 수 있다.</p>
<p data-end="2104" data-start="1990" data-ke-size="size16">이제 상세 분석을 시작해보겠다.</p>
<h3 data-end="2123" data-start="2106" data-section-id="1my1kyh" data-ke-size="size23">2.2 Extractor</h3>
<p data-end="2235" data-start="2125" data-ke-size="size16">Extractor는 CodeQL 분석의 첫 번째 핵심 구성 요소이다. Extractor는 분석 대상 언어의 문법과 구조를 이해하고, 소스코드를 CodeQL이 처리할 수 있는 중간 표현으로 변환한다.</p>
<p data-end="2281" data-start="2237" data-ke-size="size16">예를 들어 JavaScript 코드에서 다음과 같은 요소가 존재한다고 가정한다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div> </div>
</div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="bash" data-ke-language="bash"><code>const { exec } = require('child_process')

app.get('/ping', (req, res) => {
  const host = req.query.host
  exec(`ping -c 1 ${host}`)
})</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="2494" data-start="2439" data-ke-size="size16">Extractor는 이 코드를 단순 텍스트로 보지 않는다. 대신 다음과 같은 의미 단위로 해석한다.</p>
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
<pre class="coffeescript"><code>require 호출
모듈 import
함수 호출 표현식
콜백 함수
변수 선언
객체 속성 접근
템플릿 문자열
exec 함수 호출</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="2683" data-start="2580" data-ke-size="size16">이러한 구조 정보가 CodeQL 데이터베이스에 저장되기 때문에, 이후 쿼리에서는 단순히 문자열 exec를 찾는 것이 아니라 함수 호출 표현식 중 이름이 exec인 지점을 찾을 수 있다.</p>
<h3 data-end="2708" data-start="2685" data-section-id="y75vml" data-ke-size="size23">2.3 CodeQL Database</h3>
<p data-end="2798" data-start="2710" data-ke-size="size16">CodeQL Database는 분석 대상 소스코드의 구조 정보를 저장한 데이터베이스이다. 데이터베이스 안에는 소스코드에서 추출한 다양한 관계 정보가 포함된다.</p>
<p data-end="2822" data-start="2800" data-ke-size="size16">대표적으로 다음과 같은 정보가 저장된다.</p>
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
<pre class=""><code>파일 정보
함수 선언 정보
변수 선언 정보
클래스 정보
표현식 정보
함수 호출 관계
타입 정보
제어 흐름 정보
데이터 흐름 정보
소스 위치 정보</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="3083" data-start="2918" data-ke-size="size16">CodeQL의 중요한 특징은 이 데이터베이스를 재사용할 수 있다는 점이다. 한 번 데이터베이스를 생성하면 여러 QL 쿼리를 반복적으로 실행할 수 있다. 따라서 대규모 프로젝트를 분석할 때 매번 소스코드를 새로 파싱할 필요 없이, 생성된 데이터베이스를 대상으로 다양한 보안 쿼리를 수행할 수 있다.</p>
<h2 data-end="3104" data-start="3090" data-section-id="1cn0ia" data-ke-size="size26">3. QL 언어 구조</h2>
<h3 data-end="3122" data-start="3106" data-section-id="cbtg44" data-ke-size="size23">3.1 QL 언어 개요</h3>
<p data-end="3236" data-start="3124" data-ke-size="size16">QL은 CodeQL 데이터베이스를 질의하기 위한 언어이다. SQL이 일반적인 관계형 데이터베이스를 질의하기 위한 언어라면, QL은 소스코드에서 추출된 데이터베이스를 질의하기 위한 언어라고 볼 수 있다.</p>
<p data-end="3236" data-start="3124" data-ke-size="size16"> </p>
<p data-end="3236" data-start="3124" data-ke-size="size16">QL의 특징:</p>
<ul style="list-style-type: disc;" data-ke-list-type="disc">
<li data-end="3236" data-start="3124">논리 기반 질의 언어</li>
<li data-end="3236" data-start="3124">프로그램 요소를 객체처럼 다룬다</li>
<li data-end="3236" data-start="3124">클래스와 predicate를 정의</li>
<li data-end="3236" data-start="3124">언어별 CodeQl 라이브러리를 import하여 사용한다</li>
<li data-end="3236" data-start="3124">함수 호출, 변수, 표현식, 파일 등을 직접 질의할 수 있다.</li>
</ul>
<div>
<div> </div>
</div>
<h3 data-end="3458" data-start="3439" data-section-id="705ytz" data-ke-size="size23">3.2 기본 QL 쿼리 구조</h3>
<p data-end="3481" data-start="3460" data-ke-size="size16">QL 쿼리의 기본 구조는 다음과 같다.</p>
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
<pre class="pgsql"><code>import javascript

from CallExpr call
where call.getCalleeName() = "eval"
select call, "eval 함수 호출이 발견되었습니다."</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="3642" data-start="3604" data-ke-size="size16">위 쿼리는 JavaScript 코드에서 eval 함수 호출을 찾는다.</p>
<p data-end="3661" data-start="3644" data-ke-size="size16">각 구문의 의미는 다음과 같다.</p>
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
<pre class="pgsql"><code>import javascript
JavaScript 분석에 필요한 CodeQL 라이브러리를 불러온다.

from CallExpr call
함수 호출 표현식을 대상으로 분석한다.

where call.getCalleeName() = "eval"
호출 대상 함수 이름이 eval인 경우만 필터링한다.

select call, "eval 함수 호출이 발견되었습니다."
조건을 만족하는 위치와 메시지를 결과로 출력한다.</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="3975" data-start="3907" data-ke-size="size16">이 구조만 보면 SQL과 유사하지만, QL은 일반적인 테이블이 아니라 프로그램 구조를 대상으로 한다는 점에서 차이가 있다.</p>
<h2 data-end="4004" data-start="3982" data-section-id="1aqt9yb" data-ke-size="size26">4. CodeQL의 보안 분석 모델</h2>
<p data-ke-size="size16">보통 CodeQl을 이용해서 보안 취약점을 확인할 때는 4가지를 본다고 한다. <span>공격자가 입력한 값이 </span><span>프로그램 내부에서 이동하다가</span><br></br><span>위험한 함수에 도달하는가를 확인하기 위해서이다. </span></p>
<h3 data-end="4020" data-start="4006" data-section-id="1fn9w41" data-ke-size="size23">4.1 Source</h3>
<p data-end="4116" data-start="4022" data-ke-size="size16">Source는 외부에서 유입되는 신뢰할 수 없는 입력 지점을 의미한다. 보안 분석에서 source는 공격자가 제어할 수 있는 데이터가 처음 프로그램에 들어오는 위치이다.</p>
<p data-end="4138" data-start="4118" data-ke-size="size16">대표적인 source는 다음과 같다.</p>
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
<pre class="routeros"><code>HTTP request parameter
HTTP request body
HTTP header
Cookie
Command line argument
Environment variable
Uploaded file name
User controlled JSON field</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="4352" data-start="4302" data-ke-size="size16">JavaScript Express 서버에서는 다음과 같은 값이 source가 될 수 있다.</p>
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
<pre class="css"><code>req.query.host
req.body.username
req.params.id
req.headers['user-agent']</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<h3 data-end="4458" data-start="4446" data-section-id="1p18n8w" data-ke-size="size23">4.2 Sink</h3>
<p data-end="4538" data-start="4460" data-ke-size="size16">Sink는 보안적으로 민감한 연산이 수행되는 지점이다. Source에서 유입된 값이 검증 없이 sink에 도달하면 취약점이 발생할 수 있다.</p>
<p data-end="4558" data-start="4540" data-ke-size="size16">대표적인 sink는 다음과 같다.</p>
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
<pre class="properties"><code>SQL query 실행 함수
OS command 실행 함수
파일 읽기 및 쓰기 함수
eval 계열 함수
HTML rendering 함수
URL redirect 함수
역직렬화 함수
암호화 관련 함수</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="4732" data-start="4683" data-ke-size="size16">JavaScript에서 Command Injection과 관련된 sink는 다음과 같다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div> </div>
</div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="css"><code>child_process.exec()
child_process.execSync()
child_process.spawn()
child_process.spawnSync()</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<h3 data-end="4864" data-start="4847" data-section-id="b5b32k" data-ke-size="size23">4.3 Data Flow</h3>
<p data-end="4974" data-start="4866" data-ke-size="size16">Data Flow는 데이터가 프로그램 내부에서 이동하는 과정을 의미한다. CodeQL은 변수 대입, 함수 인자 전달, 반환값 전달, 객체 속성 접근 등을 기반으로 데이터 흐름을 추적할 수 있다.</p>
<p data-end="5021" data-start="4976" data-ke-size="size16">예를 들어 다음 코드는 사용자 입력값이 exec 함수까지 이동하는 흐름을 가진다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div> </div>
</div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="stylus"><code>const host = req.query.host
const command = `ping -c 1 ${host}`
exec(command)</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="5144" data-start="5120" data-ke-size="size16">데이터 흐름은 다음과 같이 정리할 수 있다.</p>
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
<pre class="stylus"><code>req.query.host
    ↓
host
    ↓
command
    ↓
exec(command)</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="5335" data-start="5219" data-ke-size="size16">이 흐름에서 req.query.host는 source이고, exec(command)는 sink이다. 중간에 입력 검증이나 escape 처리가 없다면 Command Injection 취약점으로 이어질 수 있다.</p>
<h3 data-end="5359" data-start="5337" data-section-id="1d67c1s" data-ke-size="size23">4.4 Taint Tracking</h3>
<p data-end="5512" data-start="5361" data-ke-size="size16">Taint Tracking은 오염된 데이터의 전파를 추적하는 분석 방식이다. 일반적인 Data Flow는 값이 동일하게 전달되는 흐름을 중심으로 분석한다. 반면 Taint Tracking은 값이 일부 변형되더라도 공격자의 영향이 남아 있다면 계속 오염된 값으로 간주한다.</p>
<p data-end="5569" data-start="5514" data-ke-size="size16">예를 들어 다음과 같은 코드에서 사용자 입력값은 문자열 결합을 거쳐 command 변수에 포함된다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div> </div>
</div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="stylus"><code>const host = req.query.host
const command = "ping -c 1 " + host
exec(command)</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="5777" data-start="5668" data-ke-size="size16">host 값 자체가 그대로 exec로 전달되는 것은 아니지만, command 문자열에 포함되어 최종 명령어 실행에 영향을 준다. 따라서 보안 분석에서는 command도 오염된 값으로 볼 수 있다.</p>
<p data-end="5815" data-start="5779" data-ke-size="size16">Taint Tracking은 다음과 같은 취약점 탐지에 적합하다.</p>
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
<pre class="routeros"><code>Command Injection
SQL Injection
Path Traversal
Cross Site Scripting
Server Side Template Injection
Unsafe Deserialization
Open Redirect</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="15425" data-start="15347" data-ke-size="size16"> </p>
