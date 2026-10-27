---
layout: post
title: WebAssembly.
date: 2026-10-28
desc: "WebAssembly 실행 구조와 JavaScript API, Imports/Exports, WAT 문법과 스택 기반 동작, Linear Memory, 그리고 직접 컴파일해 연동하고 WABT로 역변환까지"
keywords: "WebAssembly, WASM, WAT, WebAssembly Text Format, Module, Instance, instantiateStreaming, Imports, Exports, Linear Memory, Memory Page, WABT, DevTools, 프론티어"
categories: [TechnicalDocument]
tags: [프론티어, WebAssembly, WASM]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/76](https://sanghole.tistory.com/76)

<h3 data-ke-size="size23">WebAssembl가 무엇일까?</h3>
<p data-ke-size="size16">Wasm, WebAssembly는 브라우저 등에서 실행할 수 있도록 설계된 바이너리 명령어 형식이다.</p>
<p data-ke-size="size16">JavaSript처럼 웹 페이지의 직접 작성하기 위한 언어보다는 C나 C++, Rust같은 언어를 컴파일해서 Wasm으로 만드는 컴파일 타깃으로 주로 사용된다.  그렇다고 해서 JavaSript를 대체하기 위해서 만들어진 것은 아니고 함께 사용하도록 설계되었다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이벤트 처리 같은 웹 애플리케이션의 전반적인 로직을 담당하고, 계산량이 많은 작업이나 기존 네이티브 코드를 활용해야 하는 부분을 WebAssembly가 담당하는 형태로 사용할 수 있다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">그러면 WASM은 어떻게 실행될까?</h4>
<p data-ke-size="size16">WebAssembly의 기본 실행 단위는 Module이며 현재 WASM 공식 명세도 Module을 배포, 로딩, 컴파일의 단위로 정의한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일반적으로 C, C++, Rust와 같은 언어로 작성한 프로그램을 컴파일하면 .wasm 확장자를 가진 WebAssembly 바이너리 파일을 만들 수 있다. 브라우저는 이 .wam파일을 가져온 뒤 컴파일하고, 실제로 실행할 수 있는 Instance를 생성한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">전체적인 흐름!</p>
<pre class="python" data-ke-language="python" data-ke-type="codeblock" id="code_1790173427456"><code>app.wasm  
   ↓ 
Compile 
   ↓ 
WebAssembly.Module 
   ↓
Instantiate 
   ↓ 
WebAssembly.Instance 
   ↓ 
함수 실행</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이 흐름에서 확인해야할 점은 WebAssembly.module과 WebAssembly.Instance이다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">WebAssembly.module</h4>
<p data-ke-size="size16">WebAssmbly Module은 실제로 파일에 저장될 때 WebAssembly Binary Format으로 인코딩된다. 브라우저/JS 엔진이 .wasm 바이너리를 검증하고 컴파일해 놓은 결과물이다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">만약에 예시로 C++이나 Rust로 작성한 코드를 컴파일해서 app.wasm 파일을 만들었다고 가정을 하면 해당 파일에는 명령어뿐만 아니라 여러 가지 정보가 포함될 수 있다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>Types</span></span></td>
<td><span><span>함수 </span><span>매개변수 </span><span>및 </span><span>반환값 </span><span>등의 </span><span>타입 </span><span>정보</span></span></td>
</tr>
<tr>
<td><span><span>Functions</span></span></td>
<td><span><span>함수 </span><span>선언과 </span><span>명령어</span></span></td>
</tr>
<tr>
<td><span><span>Imports</span></span></td>
<td><span><span>외부에서 </span><span>제공받아야 </span><span>할 </span><span>함수, </span><span>메모리 </span><span>등</span></span></td>
</tr>
<tr>
<td><span><span>Exports</span></span></td>
<td><span><span>외부에 </span><span>공개할 </span><span>함수, </span><span>메모리 </span><span>등</span></span></td>
</tr>
<tr>
<td><span><span>Memories</span></span></td>
<td><span><span>사용할 </span><span>선형 </span><span>메모리의 </span><span>정의</span></span></td>
</tr>
<tr>
<td><span><span>Tables</span></span></td>
<td><span><span>함수 </span><span>참조 </span><span>등을 </span><span>저장할 </span><span>테이블 </span><span>정의</span></span></td>
</tr>
<tr>
<td><span><span>Globals</span></span></td>
<td><span><span>전역 </span><span>변수의 </span><span>타입 </span><span>및 </span><span>초기화 </span><span>정보</span></span></td>
</tr>
<tr>
<td><span><span>Data </span><span>/ </span><span>Element</span></span></td>
<td><span><span>메모리와 </span><span>테이블의 </span><span>초기화 </span><span>데이터</span></span></td>
</tr>
<tr>
<td><span><span>Start</span></span></td>
<td><span><span>인스턴스 </span><span>생성 </span><span>시 </span><span>실행할 </span><span>초기화 </span><span>함수 </span><span>지정</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이렇게 Module은 프로그램을 구성하는 정의와 초기화 정보를 포함하고 있다. 이런 Module은 메모리나 전역 변수의 정의를 포함할 수는 있지만 각각의 실행에서 변경되는 메모리 내용이나 전역 변수의 현재 값을 직접 보유하지는 않는다.</p>
<p data-ke-size="size16"> </p>
<pre class="python" data-ke-language="python" data-ke-type="codeblock" id="code_1793087322837"><code>(global $counter (mut i32) (i32.const 0))</code></pre>
<p data-ke-size="size16"> Module에 이처럼 전역 변수를 정의했다고 했을 때</p>
<p data-ke-size="size16">1. counter라는 변경 가능한 32비트 정수 변수를 사용한다.</p>
<p data-ke-size="size16">2. 새 Instace를 만들 때 초기값은 0이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Module은 변수의 정의와 초기값을 알고 있을 뿐, 함수가 실행되면서 counter가 얼마만큼 저장했다고는 보관하지 않는다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">WebAssembly.Instance?</h4>
<p data-ke-size="size16">컴파일된 Module을 바탕으로 생성된 상태를 가진 실행 가능한 객체이다. </p>
<p data-ke-size="size16">-&gt; 코드가 실제로 동작할 수 있도록 런타임 요소를 연결한 결과라고 볼 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Instance를 생성하는 과정에서 일반적으로 다음과 같은 작업이 수행!.</p>
<p data-ke-size="size16">1. Import 연결 : Module에서 요구한 외부 함수나 메모리 등을 연결한다.</p>
<p data-ke-size="size16">2. 런타임 객체 준비 : Module에서 정의한 메모리, 테이블, 전역 변수 등을 생성한다.</p>
<p data-ke-size="size16">3. 초기화 : 전역 변수의 초기값을 설정하고 필요한 데이터로 메모리와 테이블을 초기화</p>
<p data-ke-size="size16">4. Start 함수 실행 : Module에서 Start 함수가 정의돼 있으면 자동으로 호출한다.</p>
<p data-ke-size="size16">5. Export 제공 : 외부에서 호출할 수 있는 함수나 접근 가능한 객체를 제공한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> 그렇다면 하나의 Module에서 여러 Instance를 생성할 수 있을까?</p>
<p data-ke-size="size16">-&gt; 그렇다!. 같은 Module에서 생성한 Insatnce들이라도 MOdule 내부에 정의된 가변 상태는 일반적으로 각각 독립적으로 생성!.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">WebAssembly, JavaScript API</h3>
<p data-ke-size="size16">이제 JavaScript가WebAssembly를 어떤 API로 실행하는지 알아야 한다. 보통 WebAssembly를 다루기 위한 JavaSrcipt API는 브라우저에서 WebAssembly 객체를 통해 제공된다. </p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">WebAssembly.compile()</h4>
<p data-ke-size="size16">Wasm 바이너리를 컴파일하고 Module을 반환한다.</p>
<div>
<div>
<pre class="javascript"><code>const response = await fetch("app.wasm");
const bytes = await response.arrayBuffer();

const module = await WebAssembly.compile(bytes);</code></pre>
</div>
</div>
<p data-ke-size="size16">이 함수는 컴파일까지만 수행합니다. 실행하려면 별도로 Instance를 생성해야 한다.</p>
<h4 data-ke-size="size20">WebAssembly.instantiate()</h4>
<p data-ke-size="size16">WebAssembly를 인스턴스화할 때 사용하는 API이며 바이너리 데이터를 전달하면 컴파일과 인스턴스화가 모두 이루어진다</p>
<div>
<div>
<pre class="smali"><code>const response = await fetch("app.wasm");
const bytes = await response.arrayBuffer();

const { module, instance } =
  await WebAssembly.instantiate(bytes);</code></pre>
</div>
</div>
<p data-ke-size="size16">주의할 점은, instantiate()에 두 가지 형태가 존재해서</p>
<div>
<div>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span>Wasm 바이너리 데이터</span></td>
<td><span>{ module, instance }</span></td>
</tr>
<tr>
<td><span>이미 컴파일된 Module</span></td>
<td><span>instance</span></td>
</tr>
</tbody>
</table>
</div>
</div>
<p data-ke-size="size16"> 다음과 같은 코드도 가능하다. </p>
<div>
<div>
<pre class="routeros"><code>const module = await WebAssembly.compile(bytes);
const instance = await WebAssembly.instantiate(module);</code></pre>
</div>
</div>
<h4 data-ke-size="size20">WebAssembly.instantiateStreaming()</h4>
<p data-ke-size="size16">브라우저에서 Wasm 파일을 로딩할 때 많이 사용하는 API이다.</p>
<div>
<div>
<pre class="routeros"><code>const { module, instance } =
  await WebAssembly.instantiateStreaming(
    fetch("app.wasm")
  );</code></pre>
</div>
</div>
<p data-ke-size="size16">이 API는 네트워크로 전달되는 Wasm 응답을 스트리밍 방식으로 컴파일하고 인스턴스화할 수 있다. 파일 전체를 ArrayBuffer로 변환하는 단계를 거치지 않아도 된다. 하지만 서버가 .wasm 파일을 올바른 MIME 타입인 application/wasm으로 제공해야 한다</p>
<div>
<div> </div>
</div>
<h4 data-ke-size="size20"> </h4>
<h4 data-ke-size="size20">세 가지 API의 차이</h4>
<div>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span>compile()</span></td>
<td><span>컴파일</span></td>
</tr>
<tr>
<td><span>instantiate()</span></td>
<td><span>입력 형태에 따라 인스턴스화 또는 컴파일+인스턴스화</span></td>
</tr>
<tr>
<td><span>instantiateStreaming()</span></td>
<td><span>스트리밍 컴파일+인스턴스화</span></td>
</tr>
</tbody>
</table>
</div>
<h3 data-ke-size="size23">WebAssembly의 Imports와 Exports</h3>
<p data-ke-size="size16">WebAssembly는 JavaScript와 독립적인 형태로 실행되는 코드이지만, 실제 웹 애플리케이션에서는 JavaSrcipt와 협력을 해야한다. 이때 Imports와 Exports가 두 실행 환경을 연결하는 인터페이스 역할을 한다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">Export란?</h4>
<p data-ke-size="size16">Export는 WebAssembly 내부에 정의된 함수나 메모리 등을 외부에서 사용할 수 있도록 공개하는 것 이다. 예시를 들어서 WebAssembly에 두 숫자를 더하는 함수가 있다고 가정해보면</p>
<div>
<div>
<pre class="clojure"><code>(module
  (func (export "add")
    (param $a i32)
    (param $b i32)
    (result i32)

    local.get $a
    local.get $b
    i32.add
  )
)</code></pre>
</div>
</div>
<p data-ke-size="size16">위 코드는 WAT이라는 WebAssembly의 텍스트 표현이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">핵심은 export "add" 인데, add라는 이름으로 함수를 외부에 공개한다는 의미이다. 그러면 JavaScript에서 다음과 같이 호출 할 수 있다.</p>
<pre class="angelscript"><code>const result = instance.exports.add(5, 7);

console.log(result); // 12</code></pre>
<h4 data-ke-size="size20">Import?</h4>
<p data-ke-size="size16">Imports는 WebAssembly가 외부 환경에 정의된 기능을 사용하기 위한 선언이다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">예시를 들면</p>
<pre class="clojure"><code>(import "env" "log"
  (func $log (param i32))
)</code></pre>
<p data-ke-size="size16">이 코드는 env라는 네임스페이스에 있는 log 함수를 외부에서 제공받겠다는 의미이다. 이때 javascript에서는 다음과 같이 실제 함수를 전달한다.</p>
<pre class="coffeescript"><code>const importObject = {
  env: {
    log: (value) =&gt; {
      console.log("Wasm 출력:", value);
    }
  }
};</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그리고 Instance를 생성할 때 함께 전달하는 것은</p>
<pre class="routeros"><code>const { instance } =
  await WebAssembly.instantiateStreaming(
    fetch("app.wasm"),
    importObject
  );</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이제 WASM 내부에서 %log를 호출하면 연결된 JavaSrcipt 함수가 실행된다. </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">WAT( WebAssembly Text Format)?</h3>
<p data-ke-size="size16">WebAssembly는 기본적으로 사람이 직접 읽기 어려운 바이너리 형식으로 배포한다. 이 때 사람이 읽을 수 있는 텍스트 형식으로 표현한 것이 WAT이다.</p>
<h4 data-ke-size="size20">WAT의 기본 구조</h4>
<p data-ke-size="size16">다음은 두 숫자를 더하는 간단한 WAT 코드를 예시로 들면</p>
<div>
<div>
<pre class="clojure"><code>(module
  (func (export "add")
    (param $a i32)
    (param $b i32)
    (result i32)

    local.get $a
    local.get $b
    i32.add
  )
)</code></pre>
</div>
</div>
<p data-ke-size="size16">(module)은 WebAssembly 모듈을 정의하며 함수, 메모리, import, export 등 모듈을 구성하는 요소들이 내부에 들어간다</p>
<p data-ke-size="size16">(func) 은 함수를 정의한다! </p>
<p data-ke-size="size16">(param)은 함수의 매개변수를 정의하며 지금은 a, b에 32비트 정수를 전달받겠다는 의미로 사용했다</p>
<p data-ke-size="size16">(result)는 함수의 반환값 타입을 정의한다.</p>
<h3 data-ke-size="size23"> 스택 기반 동작.</h3>
<p data-ke-size="size16">WebAssembly의 실행 의미는 스택 머신 모델을 기반으로 정의한다. 방금 예시를 들었던 것을 확인해보면</p>
<div>
<div>
<pre class="livecodeserver"><code>local.get $a
local.get $b
i32.add</code></pre>
</div>
</div>
<p data-ke-size="size16">a와 b의 입력을 받고 둘을 합하게 되는데,</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">1          -         local.get $a ( 값은 10으로 설정)</p>
<p data-ke-size="size16">2          -         local.get $b ( 값은 20으로 설정)</p>
<p data-ke-size="size16">3          -         i32.add </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이렇게 실행되면 결과값 30이 반환되는데 i32.add 자체가 스택의 최상단 값 두 개를 사용하기 때문에, 연산 명령어마다 변수를 직접 지정하지 않아도 된다.  </p>
<h3 data-ke-size="size23">자주 사용하는 WAT</h3>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span>i32.const</span></td>
<td><span>32비트 정수 상수를 스택에 넣음</span></td>
</tr>
<tr>
<td><span>i32.add</span></td>
<td><span>덧셈</span></td>
</tr>
<tr>
<td><span>i32.sub</span></td>
<td><span>뺄셈</span></td>
</tr>
<tr>
<td><span>i32.mul</span></td>
<td><span>곱셈</span></td>
</tr>
<tr>
<td><span>i32.div_s</span></td>
<td><span>부호 있는 정수 나눗셈</span></td>
</tr>
<tr>
<td><span>local.get</span></td>
<td><span>지역 변수 읽기</span></td>
</tr>
<tr>
<td><span>local.set</span></td>
<td><span>지역 변수 저장</span></td>
</tr>
<tr>
<td><span>call</span></td>
<td><span>함수 호출</span></td>
</tr>
<tr>
<td><span>block</span></td>
<td><span>제어 흐름 블록</span></td>
</tr>
<tr>
<td><span>loop</span></td>
<td><span>반복 블록</span></td>
</tr>
<tr>
<td><span>br</span></td>
<td><span>지정된 레이블로 분기</span></td>
</tr>
<tr>
<td><span>br_if</span></td>
<td><span>조건부 분기</span></td>
</tr>
<tr>
<td><span>i32.load</span></td>
<td><span>메모리에서 32비트 값 읽기</span></td>
</tr>
<tr>
<td><span>i32.store</span></td>
<td><span>메모리에 32비트 값 저장</span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">WebAssembly Memory</h3>
<p data-ke-size="size16">WebAssembly의 Memory는 WASM 프로그램이 사용하는 데이터를 저장하는 메모리 공간이다. 이 메모리 공간을 제대로 이해하려면 JavaScript와 Wasm이 배열 등의 데이터를 어떻게 주고받는지 알아야 한다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20"> Linear Memory.</h4>
<p data-ke-size="size16">WebAssembly는 기본적인 데이터 저장 공간으로 선형 메모리를 제공한다. 이 선형 메모리는 바이트들이 연속된 주소 공간에 배치된 구조이다. </p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="228" data-origin-width="700"><span data-alt="예시 사진" data-phocus="https://blog.kakaocdn.net/dna/c4sr7Y/dJMcadYmY0S/AAAAAAAAAAAAAAAAAAAAAC2fJnI4wGn-RvgdSTLuGVoS1FXua04XyqUbv3EG9SJl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rdtNvrMwcoobAA1ARXlDcquiAWE%3D" data-url="https://blog.kakaocdn.net/dna/c4sr7Y/dJMcadYmY0S/AAAAAAAAAAAAAAAAAAAAAC2fJnI4wGn-RvgdSTLuGVoS1FXua04XyqUbv3EG9SJl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rdtNvrMwcoobAA1ARXlDcquiAWE%3D"><img data-origin-height="228" data-origin-width="700" height="228" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/c4sr7Y/dJMcadYmY0S/AAAAAAAAAAAAAAAAAAAAAC2fJnI4wGn-RvgdSTLuGVoS1FXua04XyqUbv3EG9SJl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rdtNvrMwcoobAA1ARXlDcquiAWE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fc4sr7Y%2FdJMcadYmY0S%2FAAAAAAAAAAAAAAAAAAAAAC2fJnI4wGn-RvgdSTLuGVoS1FXua04XyqUbv3EG9SJl%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DrdtNvrMwcoobAA1ARXlDcquiAWE%253D" width="700"/></span><figcaption>예시 사진</figcaption>
</figure>
</p>
<p data-ke-size="size16">메모리의 각 주소는 바이트 단위로, 리틀 엔디언 방식으로 메모리 접근을 할 수 있다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">Memory Page</h4>
<p data-ke-size="size16">WebAssmbly의 일반적인 선형 메모리는 페이지 단위로크기를 지정한다. WAT 코드로 예시를 들면</p>
<pre class="clojure"><code>(memory 1)</code></pre>
<p data-ke-size="size16">초기 메모리 크기를 1페이지로 선언한다는 것 </p>
<pre class="python" data-ke-language="python"><code>(memory 1 10)</code></pre>
<p data-ke-size="size16">초기 크기는 1페이지, 최대 크기는 10페이지라는 의미</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">코드를 실행하면서, 페이지를 확장할 수도 있다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">간단하게 하고, WebAssembly의 한계</h3>
<p data-ke-size="size16"><span>1. 항상 JavaScript보다 빠르지 않음</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>2. DOM에 직접 접근하기 어려움</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>3. 데이터 교환 비용</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>4. 디버깅이 상대적으로 복잡함</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>5. 컴파일 및 초기 로딩 비용</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">실제로 프로그램 만들어보기</h3>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="520" data-origin-width="976"><span data-phocus="https://blog.kakaocdn.net/dna/6sRjj/dJMcadYm9B8/AAAAAAAAAAAAAAAAAAAAAPLzD3eSGyB_igNjAx8SwHCIrEVYBLVXyxlOVPcUNRDy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=TtcEMNlWKM78du93xBl%2Fa0MCTuM%3D" data-url="https://blog.kakaocdn.net/dna/6sRjj/dJMcadYm9B8/AAAAAAAAAAAAAAAAAAAAAPLzD3eSGyB_igNjAx8SwHCIrEVYBLVXyxlOVPcUNRDy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=TtcEMNlWKM78du93xBl%2Fa0MCTuM%3D"><img data-origin-height="520" data-origin-width="976" height="520" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/6sRjj/dJMcadYm9B8/AAAAAAAAAAAAAAAAAAAAAPLzD3eSGyB_igNjAx8SwHCIrEVYBLVXyxlOVPcUNRDy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=TtcEMNlWKM78du93xBl%2Fa0MCTuM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F6sRjj%2FdJMcadYm9B8%2FAAAAAAAAAAAAAAAAAAAAAPLzD3eSGyB_igNjAx8SwHCIrEVYBLVXyxlOVPcUNRDy%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DTtcEMNlWKM78du93xBl%252Fa0MCTuM%253D" width="976"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">요즘 QR로 신청하는 사이트들이 많은데, PC에서는 QR코드 인식을 하는 것이 번거로워서 한 번 프로그램을 만들어보고 싶었는데 이번 기회에..</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="203" data-origin-width="778"><span data-phocus="https://blog.kakaocdn.net/dna/UCXxg/dJMcabF59gQ/AAAAAAAAAAAAAAAAAAAAALNU8FajtT38xOi8f0tYS4TGnd8ztpbSmbvm5Jb4T2_E/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Ri1%2B0AMkKvNai972KlPWHWgRhCo%3D" data-url="https://blog.kakaocdn.net/dna/UCXxg/dJMcabF59gQ/AAAAAAAAAAAAAAAAAAAAALNU8FajtT38xOi8f0tYS4TGnd8ztpbSmbvm5Jb4T2_E/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Ri1%2B0AMkKvNai972KlPWHWgRhCo%3D"><img data-origin-height="203" data-origin-width="778" height="203" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/UCXxg/dJMcabF59gQ/AAAAAAAAAAAAAAAAAAAAALNU8FajtT38xOi8f0tYS4TGnd8ztpbSmbvm5Jb4T2_E/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Ri1%2B0AMkKvNai972KlPWHWgRhCo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FUCXxg%2FdJMcabF59gQ%2FAAAAAAAAAAAAAAAAAAAAALNU8FajtT38xOi8f0tYS4TGnd8ztpbSmbvm5Jb4T2_E%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DRi1%252B0AMkKvNai972KlPWHWgRhCo%253D" width="778"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 QR 코드를 읽을 수 있는 패키지 중, zxing-wasm 기능을 활용할 것 이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 프론트는 대충 만들고, main.js에 적어놓은 주요 코드를 살펴보면</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="217" data-origin-width="377"><span data-phocus="https://blog.kakaocdn.net/dna/vuXuO/dJMcaaABsla/AAAAAAAAAAAAAAAAAAAAAOCuXY-o6pf3lzP62JNXCt1qxL2NxL3yD4a_pAo9kbOq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=gOE1%2BGFPEIYrrEQbJHqJwx3c%2B0w%3D" data-url="https://blog.kakaocdn.net/dna/vuXuO/dJMcaaABsla/AAAAAAAAAAAAAAAAAAAAAOCuXY-o6pf3lzP62JNXCt1qxL2NxL3yD4a_pAo9kbOq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=gOE1%2BGFPEIYrrEQbJHqJwx3c%2B0w%3D"><img data-origin-height="217" data-origin-width="377" height="217" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/vuXuO/dJMcaaABsla/AAAAAAAAAAAAAAAAAAAAAOCuXY-o6pf3lzP62JNXCt1qxL2NxL3yD4a_pAo9kbOq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=gOE1%2BGFPEIYrrEQbJHqJwx3c%2B0w%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FvuXuO%2FdJMcaaABsla%2FAAAAAAAAAAAAAAAAAAAAAOCuXY-o6pf3lzP62JNXCt1qxL2NxL3yD4a_pAo9kbOq%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DgOE1%252BGFPEIYrrEQbJHqJwx3c%252B0w%253D" width="377"/></span></figure>
</p>
<p data-ke-size="size16">이 코드는 처음 설치한 zxing-wasm 파일을 어디에서 가져올지 설정하는 코드이고, 첫 번째 QR 분석을 요청할 때, 필요에 따라 로딩이 된다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="319" data-origin-width="449"><span data-phocus="https://blog.kakaocdn.net/dna/cSrV5o/dJMcaf9vIav/AAAAAAAAAAAAAAAAAAAAAHf6TDJZ0vFuFUrpLjmKu9O83HTMZ3-MwZTkkoi4arjV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=pEoZNYrtmi6pGjYZIWKW75XP5qY%3D" data-url="https://blog.kakaocdn.net/dna/cSrV5o/dJMcaf9vIav/AAAAAAAAAAAAAAAAAAAAAHf6TDJZ0vFuFUrpLjmKu9O83HTMZ3-MwZTkkoi4arjV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=pEoZNYrtmi6pGjYZIWKW75XP5qY%3D"><img data-origin-height="319" data-origin-width="449" height="319" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cSrV5o/dJMcaf9vIav/AAAAAAAAAAAAAAAAAAAAAHf6TDJZ0vFuFUrpLjmKu9O83HTMZ3-MwZTkkoi4arjV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=pEoZNYrtmi6pGjYZIWKW75XP5qY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcSrV5o%2FdJMcaf9vIav%2FAAAAAAAAAAAAAAAAAAAAAHf6TDJZ0vFuFUrpLjmKu9O83HTMZ3-MwZTkkoi4arjV%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DpEoZNYrtmi6pGjYZIWKW75XP5qY%253D" width="449"/></span></figure>
</p>
<p data-ke-size="size16">imageInput.addEvnetListener("change", async () =&gt; { 은 사용자가 이미지를 선택하면 내부 코드가 시작되는 것이고, 그 밑에 imageInput.files[0]을 통해 선택한 이미지 파일을 가져온다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 이후 qr 코드 해독을 하는데, Wasm 기반 QR 디코더(readBarcodes)를 활용하여 QR 코드만 탐색 하여 해당 작업이 끝날 때 까지 await한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 이후 값이 있으면, 해당 값을 내보내고 값이 없으면 QR 코드를 찾지 못했다고 내뱉는다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="176" data-origin-width="712"><span data-phocus="https://blog.kakaocdn.net/dna/cF6MEM/dJMcaf9vIDu/AAAAAAAAAAAAAAAAAAAAAK-E-ewtzrfz7BoLLlDMKOz5a6qBtmJt88J-E0ELdirH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=F6Rcr3G%2F3qcUAtVzS7WBwWRAXI8%3D" data-url="https://blog.kakaocdn.net/dna/cF6MEM/dJMcaf9vIDu/AAAAAAAAAAAAAAAAAAAAAK-E-ewtzrfz7BoLLlDMKOz5a6qBtmJt88J-E0ELdirH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=F6Rcr3G%2F3qcUAtVzS7WBwWRAXI8%3D"><img data-origin-height="176" data-origin-width="712" height="176" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cF6MEM/dJMcaf9vIDu/AAAAAAAAAAAAAAAAAAAAAK-E-ewtzrfz7BoLLlDMKOz5a6qBtmJt88J-E0ELdirH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=F6Rcr3G%2F3qcUAtVzS7WBwWRAXI8%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcF6MEM%2FdJMcaf9vIDu%2FAAAAAAAAAAAAAAAAAAAAAK-E-ewtzrfz7BoLLlDMKOz5a6qBtmJt88J-E0ELdirH%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DF6Rcr3G%252F3qcUAtVzS7WBwWRAXI8%253D" width="712"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제로 QR코드를 던지면 이렇게 링크를 던져주는 것을 확인했다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">WAT</h3>
<p data-ke-size="size16">실제로 WAT를 사용하는 간단한 예시도 들어보겠다. <span>WAT를 사용하여 간단한 짝수/홀수 판별 프로그램을 구현한다. </span><span></span><span></span></p>
<p data-ke-size="size16"><span>과정은.. </span></p>
<p data-ke-size="size16"><b><span>WAT 코드 작성 → WABT로 컴파일 → Wasm 파일 생성 → JavaScript에서 실행</span></b></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><span>WAT 코드 작성</span></p>
<p data-ke-size="size16"><span>먼저 </span><span>even.wat</span><span> 파일을 생성하고, 정수를 입력받아 짝수와 홀수를 판별하는 함수를 작성하고 </span><span>짝수/홀수 판별은 입력받은 정수를 2로 나눈 나머지가 0인지 확인하는 방식으로 구현했다. </span></p>
<p data-ke-size="size16"><span>주요 WAT 명령어는 다음과 같다.</span></p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="519" data-origin-width="456"><span data-phocus="https://blog.kakaocdn.net/dna/RJhqx/dJMcagU4VRJ/AAAAAAAAAAAAAAAAAAAAALKdRAsNyFYf6QcEUIQ6VjibfB4gD7mya_igp6Qxvo2C/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=d6wq1qnrvOVo4AIGan8Y7kmMDFY%3D" data-url="https://blog.kakaocdn.net/dna/RJhqx/dJMcagU4VRJ/AAAAAAAAAAAAAAAAAAAAALKdRAsNyFYf6QcEUIQ6VjibfB4gD7mya_igp6Qxvo2C/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=d6wq1qnrvOVo4AIGan8Y7kmMDFY%3D"><img data-origin-height="519" data-origin-width="456" height="519" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/RJhqx/dJMcagU4VRJ/AAAAAAAAAAAAAAAAAAAAALKdRAsNyFYf6QcEUIQ6VjibfB4gD7mya_igp6Qxvo2C/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=d6wq1qnrvOVo4AIGan8Y7kmMDFY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FRJhqx%2FdJMcagU4VRJ%2FAAAAAAAAAAAAAAAAAAAAALKdRAsNyFYf6QcEUIQ6VjibfB4gD7mya_igp6Qxvo2C%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dd6wq1qnrvOVo4AIGan8Y7kmMDFY%253D" width="456"/></span></figure>
</p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li><span>local.get</span><span>: 함수의 매개변수 값을 가져온다.</span></li>
<li><span>i32.const</span><span>: 정수 상수를 스택에 넣는다.</span></li>
<li><span>i32.rem_s</span><span>: 두 정수의 나머지를 계산한다.</span></li>
<li><span>i32.eqz</span><span>: 계산 결과가 0인지 확인한다.</span></li>
<li><span>i32.store8</span><span>: 판별 결과를 WebAssembly 메모리에 저장한다.</span></li>
<li><span>i32.load8_u</span><span>: 저장된 결과를 메모리에서 읽는다.</span></li>
</ul>
<p data-ke-size="size16"><span>판별 결과는 짝수일 경우 </span><span>1</span><span>, 홀수일 경우 </span><span>0</span><span>으로 표현하였다. </span><span>또한 JavaScript와 연동하기 위해 다음 요소를 정의하였다.</span></p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li><b><span>Import:</span></b><span> JavaScript에서 제공하는 </span><span>log</span><span> 함수</span></li>
<li><b><span>Export:</span></b><span> 짝수/홀수 판별 함수 </span><span>checkEven</span></li>
<li><b><span>Memory:</span></b><span> 판별 결과를 저장하고 JavaScript와 공유할 선형 메모리</span></li>
</ul>
<p data-ke-size="size18"><span>WABT를 이용한 Wasm 컴파일</span></p>
<p data-ke-size="size18"> </p>
<p data-ke-size="size16"><span>작성한 WAT 코드는 브라우저에서 직접 실행할 수 없기 때문에, 바이너리 형식인 </span><span>.wasm</span><span> 파일로 변환해야 한다. </span><span>이를 위해 WebAssembly Binary Toolkit(WABT)의 </span><span>wat2wasm</span><span> 도구를 사용하였다. </span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><b><span>컴파일 명령어</span></b></p>
<p data-ke-size="size16"><span>wat2wasm even.wat -o even.wasm</span></p>
<p data-ke-size="size16"><span>여기서 각 인자의 의미는 다음과 같다.</span></p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span>wat2wasm</span></td>
<td><span>WAT를 Wasm 바이너리로 변환하는 도구</span></td>
</tr>
<tr>
<td><span>even.wat</span></td>
<td><span>직접 작성한 WAT 소스 파일</span></td>
</tr>
<tr>
<td><span>-o</span></td>
<td><span>출력 파일을 지정하는 옵션</span></td>
</tr>
<tr>
<td><span>even.wasm</span></td>
<td><span>컴파일을 통해 생성할 Wasm 파일</span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"><span>컴파일 명령어를 실행하면 WAT 소스 코드를 바이너리 형식으로 변환하여 </span><span>even.wasm</span><span> 파일을 생성한다.</span></p>
<h4 data-ke-size="size20"><span>4. 컴파일 결과</span></h4>
<p data-ke-size="size16"><span>컴파일 후 프로젝트는 다음과 같은 구조를 갖는다.</span></p>
<pre class="stylus"><code>wasm-color/
├── index.html
├── main.js
├── even.wat
└── even.wasm</code></pre>
<h4 data-ke-size="size20"><span>5. JavaScript와 WebAssembly 연동</span></h4>
<p data-ke-size="size18">Import</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="141" data-origin-width="482"><span data-phocus="https://blog.kakaocdn.net/dna/cuAjSi/dJMcafu2OcK/AAAAAAAAAAAAAAAAAAAAACQOjXrCcpbTZPhia7_7g5ZsCAX0xXFjsHyKVN5aRSij/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Sgo16dT2ATJYvYBianDgcb5b%2B88%3D" data-url="https://blog.kakaocdn.net/dna/cuAjSi/dJMcafu2OcK/AAAAAAAAAAAAAAAAAAAAACQOjXrCcpbTZPhia7_7g5ZsCAX0xXFjsHyKVN5aRSij/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Sgo16dT2ATJYvYBianDgcb5b%2B88%3D"><img data-origin-height="141" data-origin-width="482" height="141" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cuAjSi/dJMcafu2OcK/AAAAAAAAAAAAAAAAAAAAACQOjXrCcpbTZPhia7_7g5ZsCAX0xXFjsHyKVN5aRSij/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Sgo16dT2ATJYvYBianDgcb5b%2B88%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcuAjSi%2FdJMcafu2OcK%2FAAAAAAAAAAAAAAAAAAAAACQOjXrCcpbTZPhia7_7g5ZsCAX0xXFjsHyKVN5aRSij%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DSgo16dT2ATJYvYBianDgcb5b%252B88%253D" width="482"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">해당 부분에는 log 함수를 정의하는 코드가 들어가있는데, 굳이 imports 안에 들어가 있다. 해당 이유는 WAT 코드와 연결하기 위해서이며 </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="61" data-origin-width="476"><span data-phocus="https://blog.kakaocdn.net/dna/p1A8l/dJMcahmfNm5/AAAAAAAAAAAAAAAAAAAAANtWe_riB6X9dV0uE7IfWylwSxeyuk6SahpInxcatlcP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=3lYcu4lQlqzPuw36Fb7BYuTnQPI%3D" data-url="https://blog.kakaocdn.net/dna/p1A8l/dJMcahmfNm5/AAAAAAAAAAAAAAAAAAAAANtWe_riB6X9dV0uE7IfWylwSxeyuk6SahpInxcatlcP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=3lYcu4lQlqzPuw36Fb7BYuTnQPI%3D"><img data-origin-height="61" data-origin-width="476" height="61" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/p1A8l/dJMcahmfNm5/AAAAAAAAAAAAAAAAAAAAANtWe_riB6X9dV0uE7IfWylwSxeyuk6SahpInxcatlcP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=3lYcu4lQlqzPuw36Fb7BYuTnQPI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fp1A8l%2FdJMcahmfNm5%2FAAAAAAAAAAAAAAAAAAAAANtWe_riB6X9dV0uE7IfWylwSxeyuk6SahpInxcatlcP%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D3lYcu4lQlqzPuw36Fb7BYuTnQPI%253D" width="476"/></span></figure>
</p>
<p data-ke-size="size16">Wasm 외부에서 env.log라는 함수를 가져와서 사용하는 것 이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">예를 들어서 Wasm이 1을 전달하면 브라우저 콘솔에 Wasm에서 전달한 결과 : 1 과 같이 출력된다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18">Wasm 파일 불러오기</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="175" data-origin-width="528"><span data-phocus="https://blog.kakaocdn.net/dna/mvUBE/dJMcagtYhtS/AAAAAAAAAAAAAAAAAAAAAJtwFeVF6s76H7Ph8lQiHcFSArhmKZJm3PB9nynsGS7S/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=juqOhY2M8%2FqPPqNGRGI2bhhlGPw%3D" data-url="https://blog.kakaocdn.net/dna/mvUBE/dJMcagtYhtS/AAAAAAAAAAAAAAAAAAAAAJtwFeVF6s76H7Ph8lQiHcFSArhmKZJm3PB9nynsGS7S/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=juqOhY2M8%2FqPPqNGRGI2bhhlGPw%3D"><img data-origin-height="175" data-origin-width="528" height="175" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/mvUBE/dJMcagtYhtS/AAAAAAAAAAAAAAAAAAAAAJtwFeVF6s76H7Ph8lQiHcFSArhmKZJm3PB9nynsGS7S/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=juqOhY2M8%2FqPPqNGRGI2bhhlGPw%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FmvUBE%2FdJMcagtYhtS%2FAAAAAAAAAAAAAAAAAAAAAJtwFeVF6s76H7Ph8lQiHcFSArhmKZJm3PB9nynsGS7S%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DjuqOhY2M8%252FqPPqNGRGI2bhhlGPw%253D" width="528"/></span></figure>
</p>
<p data-ke-size="size18"> </p>
<p data-ke-size="size16">fetch()는 서버에 even.wasm 파일을 요청하는 코드이며 현재 .js에서 .wasm파일을 불러오는 것 이다. 그 이후에 arrayBuffer()를 통해서 불러온 Wasm 파일을 바이너리 데이터 형태로 읽는다</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="90" data-origin-width="452"><span data-phocus="https://blog.kakaocdn.net/dna/c80lah/dJMcaatPHMF/AAAAAAAAAAAAAAAAAAAAAP4xgs7t5j0a2wqENtlsjV5tZvEzpKwuUInpW81wjQq3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=nYcDVDqtWmf3AFrQZcxH3la3VEA%3D" data-url="https://blog.kakaocdn.net/dna/c80lah/dJMcaatPHMF/AAAAAAAAAAAAAAAAAAAAAP4xgs7t5j0a2wqENtlsjV5tZvEzpKwuUInpW81wjQq3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=nYcDVDqtWmf3AFrQZcxH3la3VEA%3D"><img data-origin-height="90" data-origin-width="452" height="90" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/c80lah/dJMcaatPHMF/AAAAAAAAAAAAAAAAAAAAAP4xgs7t5j0a2wqENtlsjV5tZvEzpKwuUInpW81wjQq3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=nYcDVDqtWmf3AFrQZcxH3la3VEA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fc80lah%2FdJMcaatPHMF%2FAAAAAAAAAAAAAAAAAAAAAP4xgs7t5j0a2wqENtlsjV5tZvEzpKwuUInpW81wjQq3%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DnYcDVDqtWmf3AFrQZcxH3la3VEA%253D" width="452"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이제 여기서 직접적으로 WebAssembly.instantiate()가 .wasm 바이너리를 컴파일하고 실행 가능한 인스턴스를 생성한다. 그 이후에 bytes, imports를 이용해서 두 개의 인자를 전달하는데 </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">bytes : 컴파일된 Wasm 바이너리 데이터</p>
<p data-ke-size="size16">imports : Wasm에서 사용할 JavaScript 함수</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이렇게 하면 진짜 even.wasm 파일을 실행할 수 있도록 준비하고, Wasm에서 사용할 Js 함수도 함께 연결하는 것 이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">정리(다른 코드 설명 포함)</h4>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>JavaScript에서는 </span><span>fetch()</span><span>를 이용하여 컴파일된 </span><span>even.wasm</span><span> 파일을 불러오고, </span><span>WebAssembly.instantiate()</span><span>를 통해 모듈을 인스턴스화한다</span></p>
<p data-ke-size="size16"><span>이 과정에서 Import 객체를 전달하여 Wasm이 JavaScript의 </span><span>log</span><span> 함수를 호출할 수 있도록 연결한다</span></p>
<p data-ke-size="size16"><span>이후 </span><span>instance.exports</span><span>를 통해 Wasm에서 공개한 </span><span>checkEven</span><span> 함수와 </span><span>memory</span><span> 객체에 접근하고 </span><span>사용자가 숫자를 입력하고 판별 버튼을 누르면 JavaScript에서 </span><span>checkEven(number)</span><span>를 호출한다. 실제 짝수/홀수 계산은 WAT로 구현한 WebAssembly 함수에서 수행된다.</span></p>
<p data-ke-size="size16"><span>Wasm은 계산 결과를 선형 메모리의 0번 주소에 저장하며, JavaScript는 </span><span>Uint8Array(memory.buffer)</span><span>를 이용해 해당 값을 읽는다.</span></p>
<p data-ke-size="size16"><span>마지막으로 메모리 값이 1이면 짝수, 0이면 홀수로 판단하여 HTML 화면에 출력한다.</span></p>
<p data-ke-size="size16"><span>이를 통해 JavaScript와 WebAssembly가 Imports, Exports, Memory를 활용하여 서로 연동되는 과정을 확인할 수 있었다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>-&gt; 코드에 대한 정리는 이 정도이고, 실제로 DevTools로 확인해보기.</span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">DevTools</h3>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="275" data-origin-width="458"><span data-phocus="https://blog.kakaocdn.net/dna/Qfqtg/dJMcadRtfvj/AAAAAAAAAAAAAAAAAAAAABVuEv_435U8ugGaOzaRZGNbzj6iwU3dHsR7llhaNo0h/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rRbjTs4XgefouX9lTDJi1NnzSs4%3D" data-url="https://blog.kakaocdn.net/dna/Qfqtg/dJMcadRtfvj/AAAAAAAAAAAAAAAAAAAAABVuEv_435U8ugGaOzaRZGNbzj6iwU3dHsR7llhaNo0h/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rRbjTs4XgefouX9lTDJi1NnzSs4%3D"><img data-origin-height="275" data-origin-width="458" height="275" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/Qfqtg/dJMcadRtfvj/AAAAAAAAAAAAAAAAAAAAABVuEv_435U8ugGaOzaRZGNbzj6iwU3dHsR7llhaNo0h/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rRbjTs4XgefouX9lTDJi1NnzSs4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FQfqtg%2FdJMcadRtfvj%2FAAAAAAAAAAAAAAAAAAAAABVuEv_435U8ugGaOzaRZGNbzj6iwU3dHsR7llhaNo0h%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DrRbjTs4XgefouX9lTDJi1NnzSs4%253D" width="458"/></span></figure>
</p>
<p data-ke-size="size16">위 화면은 실제로 WebAssembly를 이용하여서 짝/홀 판별기를 만든 화면이</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="609" data-origin-width="1031"><span data-phocus="https://blog.kakaocdn.net/dna/1y3DE/dJMcabsEMr8/AAAAAAAAAAAAAAAAAAAAAPS4vweAl9DZwwyifcU3QZKH5mIHKQ3ZchAI0_Fr_-z8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=pc3WIDa%2BkCZoCQuLf8Fqd5Ts4wo%3D" data-url="https://blog.kakaocdn.net/dna/1y3DE/dJMcabsEMr8/AAAAAAAAAAAAAAAAAAAAAPS4vweAl9DZwwyifcU3QZKH5mIHKQ3ZchAI0_Fr_-z8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=pc3WIDa%2BkCZoCQuLf8Fqd5Ts4wo%3D"><img data-origin-height="609" data-origin-width="1031" height="609" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/1y3DE/dJMcabsEMr8/AAAAAAAAAAAAAAAAAAAAAPS4vweAl9DZwwyifcU3QZKH5mIHKQ3ZchAI0_Fr_-z8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=pc3WIDa%2BkCZoCQuLf8Fqd5Ts4wo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F1y3DE%2FdJMcabsEMr8%2FAAAAAAAAAAAAAAAAAAAAAPS4vweAl9DZwwyifcU3QZKH5mIHKQ3ZchAI0_Fr_-z8%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dpc3WIDa%252BkCZoCQuLf8Fqd5Ts4wo%253D" width="1031"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Chrome DevTools의 Network 탭을 이용하여서 실제로 WebAssmbly 파일이 브라우저에서 어떻게 로딩되었는지 확인하며 Headers 탭을 살펴보면 <span>http://localhost:8000/even.wasm</span><span> 주소로 GET 요청이 발생한 것을 확인할 수 있다. </span></p>
<p data-ke-size="size16"><span>-&gt; JavaScript에서 작성한 fetch("./even.wasm") 코드가 실행되면서 로컬 HTTP 서버에 Wasm 파일을 요청했다는 의미이다.</span></p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="227" data-origin-width="425"><span data-phocus="https://blog.kakaocdn.net/dna/HZMhp/dJMcag1FJ2y/AAAAAAAAAAAAAAAAAAAAAP-iisv9VueB--Snt6ZODuTukyRIJolYFIyezGMn923O/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=JRO5L%2FcztrdOvlT%2FSbCygJHQP6E%3D" data-url="https://blog.kakaocdn.net/dna/HZMhp/dJMcag1FJ2y/AAAAAAAAAAAAAAAAAAAAAP-iisv9VueB--Snt6ZODuTukyRIJolYFIyezGMn923O/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=JRO5L%2FcztrdOvlT%2FSbCygJHQP6E%3D"><img data-origin-height="227" data-origin-width="425" height="227" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/HZMhp/dJMcag1FJ2y/AAAAAAAAAAAAAAAAAAAAAP-iisv9VueB--Snt6ZODuTukyRIJolYFIyezGMn923O/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=JRO5L%2FcztrdOvlT%2FSbCygJHQP6E%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FHZMhp%2FdJMcag1FJ2y%2FAAAAAAAAAAAAAAAAAAAAAP-iisv9VueB--Snt6ZODuTukyRIJolYFIyezGMn923O%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DJRO5L%252FcztrdOvlT%252FSbCygJHQP6E%253D" width="425"/></span></figure>
</p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>DevTools의 Console에서는 </span><span>WebAssembly.Module.imports()</span><span>와 </span><span>WebAssembly.Module.exports()</span><span>를 이용하여 WebAssembly 모듈의 Import 및 Export 정보를 확인하였다. </span><span>먼저 Imports에는 </span><span>env.log</span><span> 함수가 존재하며, 해당 요소의 종류가 </span><span>function</span><span>으로 표시된다.</span></p>
<p data-ke-size="size16"><span>=&gt; WAT 코드에서 선언한 </span><span>env.log</span><span> 함수를 JavaScript에서 제공하고 있으며, Wasm이 해당 함수를 호출할 수 있음을 나타낸다.</span></p>
<p data-ke-size="size16"><span>반면 Exports에서는 </span><span>memory</span><span>와 </span><span>checkEven</span><span>이라는 두 가지 요소가 확인된다.</span></p>
<ul data-ke-list-type="disc" data-spread="false" style="list-style-type: disc;">
<li><span>memory</span><span>: JavaScript에서 접근할 수 있도록 공개한 WebAssembly 선형 메모리</span></li>
<li><span>checkEven</span><span>: JavaScript에서 호출할 수 있도록 공개한 짝수/홀수 판별 함수</span></li>
</ul>
<p data-ke-size="size16"><span>이러한 결과를 통해 WAT에서 선언한 Imports와 Exports가 컴파일된 Wasm 모듈에도 포함되어 있다는 것을 확인할 수 있었다.</span></p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="147" data-origin-width="784"><span data-phocus="https://blog.kakaocdn.net/dna/bOePWA/dJMcafhzWF6/AAAAAAAAAAAAAAAAAAAAALo4UK234fuvzarEJYrk26wr750AhLWi24L8ckpbYc-X/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=SbGHtSRbK0bK%2BAyKnjhZhFIV8a4%3D" data-url="https://blog.kakaocdn.net/dna/bOePWA/dJMcafhzWF6/AAAAAAAAAAAAAAAAAAAAALo4UK234fuvzarEJYrk26wr750AhLWi24L8ckpbYc-X/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=SbGHtSRbK0bK%2BAyKnjhZhFIV8a4%3D"><img data-origin-height="147" data-origin-width="784" height="147" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bOePWA/dJMcafhzWF6/AAAAAAAAAAAAAAAAAAAAALo4UK234fuvzarEJYrk26wr750AhLWi24L8ckpbYc-X/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=SbGHtSRbK0bK%2BAyKnjhZhFIV8a4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbOePWA%2FdJMcafhzWF6%2FAAAAAAAAAAAAAAAAAAAAALo4UK234fuvzarEJYrk26wr750AhLWi24L8ckpbYc-X%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DSbGHtSRbK0bK%252BAyKnjhZhFIV8a4%253D" width="784"/></span></figure>
</p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>이번에는 WebAssembly의 선형 메모리와 JavaScript 함수 호출 결과를 확인하였다. </span><span>DevTools Console에서 </span><span>new Uint8Array(window.wasmDebug.memory.buffer)[0]</span><span>을 실행하여 Wasm 메모리의 0번 주소에 저장된 값을 읽었다.</span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<p data-ke-size="size16"><span>확인 시점의 메모리 값은 </span><span>0</span><span>으로 나타났다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>이번 프로그램에서는 짝수일 경우 1, 홀수일 경우 0을 저장하도록 구현하였으므로, 해당 값은 홀수 판별 결과를 의미한다.</span></p>
<p data-ke-size="size16">Console에 1과 0이 뜨는데, 해당 결과는 WAT 코드에서 Import한 JS의 log 함수를 호출하면서 출력되며 Wasm 내부에서 수행한 짝/홀 판별 결과가 제대로 Js 함수로 전달되고 있다는 것을 확인할 수 있다. </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">WABT</h3>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="425" data-origin-width="1418"><span data-phocus="https://blog.kakaocdn.net/dna/qdKhQ/dJMcaaUMKAW/AAAAAAAAAAAAAAAAAAAAANukj73SL0Mqjy4zKj_KOaqOnHS1_wP3a2lk-26Djd9Z/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=iYwJ1zQrqjOX%2FDdl5XOVpQ53qn4%3D" data-url="https://blog.kakaocdn.net/dna/qdKhQ/dJMcaaUMKAW/AAAAAAAAAAAAAAAAAAAAANukj73SL0Mqjy4zKj_KOaqOnHS1_wP3a2lk-26Djd9Z/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=iYwJ1zQrqjOX%2FDdl5XOVpQ53qn4%3D"><img data-origin-height="425" data-origin-width="1418" height="425" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/qdKhQ/dJMcaaUMKAW/AAAAAAAAAAAAAAAAAAAAANukj73SL0Mqjy4zKj_KOaqOnHS1_wP3a2lk-26Djd9Z/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=iYwJ1zQrqjOX%2FDdl5XOVpQ53qn4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FqdKhQ%2FdJMcaaUMKAW%2FAAAAAAAAAAAAAAAAAAAAANukj73SL0Mqjy4zKj_KOaqOnHS1_wP3a2lk-26Djd9Z%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DiYwJ1zQrqjOX%252FDdl5XOVpQ53qn4%253D" width="1418"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Wasm 바이너리 분석 도구를 통해서 해당 모듈의 상세 구조를 출력하도록 하면 위와 같은 결과가 출력된다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="294" data-origin-width="353"><span data-alt="Wasm 바이너리 분석 도구를 통한 결과" data-phocus="https://blog.kakaocdn.net/dna/nTyz7/dJMcaiZs7Qg/AAAAAAAAAAAAAAAAAAAAAGF3LylisvoGQ2iEq0cqOE6zLdGpOhXN4-YxqmHKS_fD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=%2FKOiQTlmIJ%2BWdEw2m5o6YWoXUok%3D" data-url="https://blog.kakaocdn.net/dna/nTyz7/dJMcaiZs7Qg/AAAAAAAAAAAAAAAAAAAAAGF3LylisvoGQ2iEq0cqOE6zLdGpOhXN4-YxqmHKS_fD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=%2FKOiQTlmIJ%2BWdEw2m5o6YWoXUok%3D"><img data-origin-height="294" data-origin-width="353" height="294" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/nTyz7/dJMcaiZs7Qg/AAAAAAAAAAAAAAAAAAAAAGF3LylisvoGQ2iEq0cqOE6zLdGpOhXN4-YxqmHKS_fD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=%2FKOiQTlmIJ%2BWdEw2m5o6YWoXUok%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FnTyz7%2FdJMcaiZs7Qg%2FAAAAAAAAAAAAAAAAAAAAAGF3LylisvoGQ2iEq0cqOE6zLdGpOhXN4-YxqmHKS_fD%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D%252FKOiQTlmIJ%252BWdEw2m5o6YWoXUok%253D" width="353"/></span><figcaption>Wasm 바이너리 분석 도구를 통한 결과</figcaption>
</figure>
</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="458" data-origin-width="411"><span data-alt="실제 코드와 매치" data-phocus="https://blog.kakaocdn.net/dna/zLqWZ/dJMb99VSS4l/AAAAAAAAAAAAAAAAAAAAAGhqrtv0dOiSNoi6UNk6F1HADjmLlA4F9q56ClAK3x6R/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=dwZ5c%2FSRm3IJ1i7NXa3L%2FtKm54s%3D" data-url="https://blog.kakaocdn.net/dna/zLqWZ/dJMb99VSS4l/AAAAAAAAAAAAAAAAAAAAAGhqrtv0dOiSNoi6UNk6F1HADjmLlA4F9q56ClAK3x6R/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=dwZ5c%2FSRm3IJ1i7NXa3L%2FtKm54s%3D"><img data-origin-height="458" data-origin-width="411" height="458" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/zLqWZ/dJMb99VSS4l/AAAAAAAAAAAAAAAAAAAAAGhqrtv0dOiSNoi6UNk6F1HADjmLlA4F9q56ClAK3x6R/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=dwZ5c%2FSRm3IJ1i7NXa3L%2FtKm54s%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FzLqWZ%2FdJMb99VSS4l%2FAAAAAAAAAAAAAAAAAAAAAGhqrtv0dOiSNoi6UNk6F1HADjmLlA4F9q56ClAK3x6R%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DdwZ5c%252FSRm3IJ1i7NXa3L%252FtKm54s%253D" width="411"/></span><figcaption>실제 코드와 매치</figcaption>
</figure>
</p>
<p data-ke-size="size18">type[1] : 함수 타입이 1개 정의되어 있음.</p>
<p data-ke-size="size16">      - type[0] : 첫 번째 함수 타입</p>
<p data-ke-size="size16">(i32) : 32비트 정수를 매개변수로 받음</p>
<p data-ke-size="size16">nil : 반환값이 없음.</p>
<p data-ke-size="size16">-&gt; Wasm 모듈에서는 정수 하나를 입력받고 값을 직접 반환하지 않는 함수 타입을 사용한다는 의미</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18">Import[1]: (사진상 빨간색 박스)</p>
<p data-ke-size="size16">func[0]: 함수 인덱스 0번<br/>sig=0 :0번 함수 타입 사용<br/>env.log : JavaScript에서 가져오는 함수</p>
<p data-ke-size="size16">-&gt; Js의 log 함수를 Wasm 내부에서 사용할 수 있도록 Import했다는 뜻</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><span>Function[1] </span><span>— </span><span>Wasm 내부 함수 (사진상 주황색 박스)</span></p>
<p data-ke-size="size16">Function[1]: Wasm 모듈 내부에 정의된 함수가 1개 있음<br/>func[1]: 함수 인덱스 1번<br/>checkEven: 함수 이름</p>
<p data-ke-size="size16">-&gt; WAT로 직접 작성한 짝/홀 판별 함수를 표시 </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><span>Memory[1] </span><span>— </span><span>Wasm </span><span>메모리 </span><span>구조(사진상 연두색 박스)</span></p>
<p data-ke-size="size16">Memory[1] : 메모리 객체가 1개 있음<br/>memory[0] : 첫 번째 메모리<br/>initial=1 : 초기 메모리 크기가 1페이지</p>
<p data-ke-size="size16">-&gt; Wasm 모듈은 초기 크기가 1페이지, 즉 64KiB인 선형 메모리 하나를 사용한다는 것을 확인 </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><span>Export[2] </span><span>— </span><span>JavaScript에 </span><span>공개한 </span><span>요소 (Js 코드에서 가져옴)</span></p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span> Export </span></span></td>
<td><span><span> 종류</span></span></td>
<td><span><span>역할 </span></span></td>
</tr>
<tr>
<td><span><span>memory</span></span></td>
<td><span><span>Memory</span></span></td>
<td><span><span>JavaScript에서 </span><span>Wasm </span><span>메모리에 </span><span>접근</span></span></td>
</tr>
<tr>
<td><span><span>checkEven</span></span></td>
<td><span><span>Function</span></span></td>
<td><span><span>JavaScript에서 </span><span>짝수/홀수 </span><span>판별 </span><span>함수 </span><span>호출</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">-&gt; WAT에서 Export한 요소가 실제 Wasm 바이너리에 포함되어 있고, JS에서도 접근할 수 있다는 것을 확인</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><span>Code[1] </span><span>— </span><span>실제 </span><span>Wasm </span><span>함수 </span><span>코드</span></p>
<p data-ke-size="size16">Code[1]: Wasm 내부에 구현된 함수 코드가 1개 있음<br/>func[1]: checkEven 함수<br/>size=20: 해당 함수 본문의 바이너리 크기가 20바이트</p>
<p data-ke-size="size16">-&gt; WAT로 작성한 CheckEven 함수의 명령어가 Wasm 바이너리로 변환되어 저장되었다는 의미.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">역변환도?..</h4>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="576" data-origin-width="1144"><span data-phocus="https://blog.kakaocdn.net/dna/c1DQ8B/dJMcad41tx5/AAAAAAAAAAAAAAAAAAAAAMmxSVEo5mv85DG80tbxamf9Npwp-BXUWjTdt5sYIVfo/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=OjkpOlPFxeV5iC0mWalQWcNZYYA%3D" data-url="https://blog.kakaocdn.net/dna/c1DQ8B/dJMcad41tx5/AAAAAAAAAAAAAAAAAAAAAMmxSVEo5mv85DG80tbxamf9Npwp-BXUWjTdt5sYIVfo/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=OjkpOlPFxeV5iC0mWalQWcNZYYA%3D"><img data-origin-height="576" data-origin-width="1144" height="576" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/c1DQ8B/dJMcad41tx5/AAAAAAAAAAAAAAAAAAAAAMmxSVEo5mv85DG80tbxamf9Npwp-BXUWjTdt5sYIVfo/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=OjkpOlPFxeV5iC0mWalQWcNZYYA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fc1DQ8B%2FdJMcad41tx5%2FAAAAAAAAAAAAAAAAAAAAAMmxSVEo5mv85DG80tbxamf9Npwp-BXUWjTdt5sYIVfo%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DOjkpOlPFxeV5iC0mWalQWcNZYYA%253D" width="1144"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">왼쪽은 우리가 원래 만들어놓은 코드이고, 오른쪽은 한 번 모듈의 상세 구조를 확인한 다음 다시 WAT로 변환한 모습이다.</p>
<p data-ke-size="size16"><span>비교 </span><span>결과, </span><span>다음과 </span><span>같은 </span><span>차이가 </span><span>있었다.</span></p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>
<div>
<div>
<p data-ke-size="size16"><span>local.get </span><span>$n</span> <span>→ </span><span>local.get </span><span>0</span></p>
</div>
</div>
</li>
<li>
<div>
<div>
<p data-ke-size="size16"><span>call </span><span>$log</span> <span>→ </span><span>call </span><span>0</span></p>
</div>
</div>
</li>
<li>
<div>
<div>
<p data-ke-size="size16"><span>함수 </span><span>타입과 </span><span>Export </span><span>정보가 </span><span>별도로 </span><span>표시됨</span></p>
</div>
</div>
</li>
</ul>
<p data-ke-size="size16"><span>하지만 </span><span><span>i32.rem_s</span><span>, </span><span>i32.eqz</span><span>, </span><span>i32.store8</span><span>, </span><span>i32.load8_u</span> <span>등 </span><span>핵심 </span><span>명령어는 </span><span>동일하게 </span><span>유지되었다. </span></span><span>따라서 </span><span>WAT를 </span><span>Wasm </span><span>바이너리로 </span><span>컴파일한 </span><span>후 </span><span>다시 </span><span>역변환하더라도 </span><span><span>프로그램의 </span><span>핵심 </span><span>연산과 </span><span>동작 </span><span>구조가 </span><span>유지된다는 </span><span>것</span></span><span>을 </span><span>확인할 </span><span>수 </span><span>있었다.</span></p>
