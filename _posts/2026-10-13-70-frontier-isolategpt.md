---
layout: post
title: 중심 논문 분석하기( 정리본 )
date: 2026-10-13
desc: "IsolateGPT(NDSS 2025) 정리본 - 실행 격리 아키텍처의 연구 배경, 선행 연구 계보, 실험 설계와 MAS 확장 실험 결과"
keywords: "IsolateGPT, NDSS 2025, 실행 격리, Execution Isolation, LLM Agent, Prompt Injection, InjecAgent, Multi-Agent System, MAS, 논문, 프론티어, AI 보안"
categories: [Paper-Conference]
tags: [논문, 프론티어, AI 보안]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/70](https://sanghole.tistory.com/70)

<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">IsolateGPT</h2>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span><span>논문명:</span></span> <span><span>IsolateGPT: </span><span>An </span><span>Execution </span><span>Isolation </span><span>Architecture </span><span>for </span><span>LLM-Based </span><span>Agentic </span><span>Systems</span></span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span><span>학회:</span></span> <span>NDSS </span><span>2025</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span><span>저자:</span></span> <span>Yuhao </span><span>Wu, </span><span>Franziska </span><span>Roesner, </span><span>Tadayoshi </span><span>Kohno, </span><span>Ning </span><span>Zhang, </span><span>Umar </span><span>Iqbal</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<h3 data-ke-size="size23" style="color: #333333; text-align: start;">IsolateGPT의 연구 배경 및 핵심 문제</h3>
<p data-ke-size="size16" style="color: #333333; text-align: start;">기존 문제점인 LLM의 행동 범위가 넓혀져 tool에 대한 악성 프롬프트 인젝션에 대한 문제점을 깔고가며, 논문에서는 이 문제를 단순히 LLM이 악성 프롬프트를 제대로 식별하지 못하는 문제로만 보지 않는다. 신뢰할 수 없는 앱과 시스템이 충분히 격리되지 않고 자연어를 통해 접근 권환과 실행 흐름이 결정되는 구조적 문제로 접근한다.</p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<p data-ke-size="size16" style="color: #333333; text-align: start;">핵심 연구 질문은 다음과 같다.</p>
<blockquote data-ke-style="style1"><span style="font-family: 'Noto Serif KR';"> <span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">LLM이 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">악성 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">명령을 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">완벽하게 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">탐지하지 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">못하더라도, </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">각 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">애플리케이션의 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">실행 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">환경을 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">격리하고 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">앱 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">간 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">접근을 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">통제하여 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">공격이 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">다른 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">애플리케이션이나 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">시스템으로 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">확산되는 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">것을 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">방지할 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">수 </span><span style="font-family: 'Noto Serif KR'; color: #666666; text-align: center;">있는가?</span> </span></blockquote>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">선행 연구 분석</h3>
<h3 data-ke-size="size23"><span>선행 연구 분석</span></h3>
<h4 data-ke-size="size20"><span>Prompt Injection 및 LLM Agent 보안 연구</span></h4>
<p data-ke-size="size16"><span>기존 연구에서는 LLM이 외부 콘텐츠에 포함된 악성 명령을 정상적인 지시로 해석하는 Prompt Injection 문제를 다루었다.</span></p>
<p data-ke-size="size16"><span>특히 LLM Agent가 등장하면서 LLM은 단순히 사용자의 질문에 텍스트로 응답하는 역할을 넘어 이메일 확인, 웹사이트 검색, 금융 거래, 스마트홈 제어 등 외부 도구를 활용해 실제 행동을 수행할 수 있게 되었다. 그러나 이러한 기능 확장은 외부 도구가 반환하는 데이터가 Agent의 후속 행동에 영향을 미칠 수 있다는 새로운 보안 문제를 발생시켰다.</span></p>
<p data-ke-size="size16"><span>대표적인 연구인 </span><b><span>INJECAGENT</span></b><span>는 외부 도구 응답에 삽입된 악성 명령이 Agent의 의사결정을 조작하여 사용자가 의도하지 않은 도구 호출이나 민감정보 유출로 이어질 수 있음을 정량적으로 평가하였다.</span></p>
<p data-ke-size="size16"><span>이를 위해 17개의 사용자 도구와 62개의 공격 도구를 조합하여 1,054개의 공격 테스트 케이스를 구성하고, ASR-Valid 등의 지표를 통해 도구 통합형 LLM Agent의 Indirect Prompt Injection(IPI) 취약성을 분석하였다.</span></p>
<p data-ke-size="size16"><span>하지만 INJECAGENT는 악성 외부 콘텐츠가 Agent의 행동을 조작할 수 있다는 사실을 검증하는 데 초점을 맞추었으며, 공격이 발생했을 때 그 영향이 다른 애플리케이션이나 시스템 자원으로 확산되는 것을 제한하기 위한 구조적 방어 방안은 제시하지 않았다.</span></p>
<p data-ke-size="size16"><b><span>이러한 점에서 단순히 LLM이 악성 명령을 탐지하거나 거부하도록 하는 것을 넘어, 공격이 성공하더라도 피해 범위를 제한할 수 있는 시스템 수준의 보안 구조가 필요하다는 문제를 생각해 볼 수 있다.</span></b></p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20"><span>다중 Agent 환경에서의 공격 전파 문제</span></h4>
<p data-ke-size="size16"><span>한편 이러한 외부 콘텐츠 기반의 보안 위협은 여러 Agent가 상호작용하는 환경에서도 확인할 수 있다. </span><span>INJECAGENT가 외부 도구 응답에 의해 개별 LLM Agent의 행동이 조작되는 문제를 분석했다면, </span><b><span>Agent Smith</span></b><span>는 악성 콘텐츠의 영향이 여러 Agent 사이에서 확산될 수 있다는 위험성을 다른 관점에서 연구하였다.</span></p>
<p data-ke-size="size16"><span>Agent Smith는 하나의 MLLM Agent에 주입된 적대적 이미지가 메모리에 저장되고 Agent 간 상호작용을 통해 다른 Agent에게 전달되는 Infectious Jailbreak 공격을 제시하였다.</span></p>
<p data-ke-size="size16"><span>연구진은 최대 100만 개의 MLLM Agent를 대상으로 한 시뮬레이션을 통해, 최초 공격 대상에 주입된 악성 이미지가 추가적인 공격자의 개입 없이 다른 Agent로 빠르게 확산될 수 있음을 보여주었다.</span></p>
<p data-ke-size="size16"><span>이는 신뢰할 수 없는 외부 콘텐츠의 영향이 최초 공격 대상에만 머무르지 않고, 여러 Agent가 정보를 공유하는 과정에서 다른 구성 요소의 안전성에도 영향을 미칠 수 있음을 보여준다.</span></p>
<p data-ke-size="size16"><span>하지만 Agent Smith는 공격의 전파 메커니즘과 확산을 억제하기 위한 이론적 조건을 분석하는 데 초점을 맞추었으며, 실제 시스템에서 공격 확산을 차단하는 구체적인 방어 아키텍처는 제시하지 않았다.</span></p>
<p data-ke-size="size16"><span>물론 Agent Smith의 전염성 Jailbreak와 INJECAGENT의 IPI는 서로 다른 공격 모델을 다룬지만 <b>두 </b></span><b><span>연구는 신뢰할 수 없는 외부 콘텐츠가 Agent의 행동에 영향을 미칠 수 있으며, 상호작용 구조에 따라 그 영향 범위가 확대될 수 있다는 공통적인 보안 문제를 보여준다.</span></b></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23" style="color: #000000; text-align: start;"><span>기존 </span><span>LLM </span><span>애플리케이션 </span><span>실행 </span><span>구조</span></h3>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>기존 </span><span>ChatGPT </span><span>플러그인 </span><span>등의 </span><span>LLM </span><span>애플리케이션에서는 </span><span>하나의 </span><span>LLM이 </span><span>여러 </span><span>앱의 </span><span>기능 </span><span>설명과 </span><span>실행 </span><span>결과를 </span><span>공유된 </span><span>문맥에서 </span><span>처리하는 </span><span>구조를 </span><span>사용했다. </span><span>이러한 </span><span>방식은 </span><span>여러 </span><span>애플리케이션을 </span><span>연결하여 </span><span>복잡한 </span><span>사용자 </span><span>작업을 </span><span>수행할 </span><span>수 </span><span>있다는 </span><span>장점이 </span><span>있었다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>그러나 </span><span>서로 </span><span>다른 </span><span>앱이 </span><span>공유된 </span><span>실행 </span><span>문맥을 </span><span>이용하기 </span><span>때문에 </span><span>한 </span><span>앱의 </span><span>악성 </span><span>명령이 </span><span>다른 </span><span>앱의 </span><span>행동을 </span><span>변경하거나, </span><span>원래 </span><span>접근할 </span><span>수 </span><span>없어야 </span><span>하는 </span><span>데이터에 </span><span>접근할 </span><span>가능성이 </span><span>존재했다.</span></p>
<blockquote data-ke-style="style2" style="color: #666666; text-align: left;">애플리케이션 간 신뢰 경계(Trust Boundary)가 충분히 분리되어 있지 않다는 점이 핵심 문제라고 지적!</blockquote>
<h3 data-ke-size="size23" style="color: #000000; text-align: start;"><span>기존 </span><span>운영체제 </span><span>및 </span><span>브라우저의 </span><span>실행 </span><span>격리 </span><span>연구</span></h3>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>기존 </span><span>컴퓨팅 </span><span>시스템에서도 </span><span>신뢰할 </span><span>수 </span><span>없는 </span><span>애플리케이션 </span><span>사이의 </span><span>보안 </span><span>문제가 </span><span>존재했으며, </span><span>이를 </span><span>해결하기 </span><span>위해 </span><span>다양한 </span><span>격리 </span><span>기법이 </span><span>발전했다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>대표적으로 </span><span>Chrome의 </span><span>Site </span><span>Isolation은 </span><span>웹사이트의 </span><span>실행 </span><span>프로세스를 </span><span>분리하여 </span><span>서로 </span><span>다른 </span><span>사이트 </span><span>사이의 </span><span>접근을 </span><span>제한하는 </span><span>방식을 </span><span>사용했다. </span><span>또한 </span><span>모바일 </span><span>운영체제에서는 </span><span>애플리케이션별 </span><span>실행 </span><span>공간과 </span><span>권한 </span><span>관리 </span><span>방식을 </span><span>적용하였다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>그러나 </span><span>이러한 </span><span>기술을 </span><span>LLM </span><span>Agent에 </span><span>그대로 </span><span>적용하기는 </span><span>어려웠다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>LLM </span><span>기반 </span><span>시스템은 </span><span>명확하게 </span><span>정의된 </span><span>API뿐 </span><span>아니라 </span><span>자연어를 </span><span>이용하여 </span><span>앱의 </span><span>기능과 </span><span>상호작용을 </span><span>결정하며, </span><span>작업을 </span><span>수행하는 </span><span>과정에서 </span><span>다른 </span><span>앱의 </span><span>데이터와 </span><span>과거 </span><span>대화 </span><span>문맥을 </span><span>필요로 </span><span>하기 </span><span>때문이다.</span></p>
<blockquote data-ke-style="style2" style="color: #666666; text-align: left;"> 각 앱을 단순히 격리하는 것뿐만 아니라 격리된 상태에서도 필요한 데이터를 안전하게 공유하고 앱 간 협업을 유지할 수 있는 구조가 필요했다.</blockquote>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26" style="color: #000000; text-align: start;"><span>제안 </span><span>방법 </span><span>및 </span><span>시스템 </span><span>아키텍처</span></h2>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>이 </span><span>논문에서는 </span><span><span>Hub-and-Spoke </span><span>Architecture</span></span><span>를 </span><span>제안한다. </span><span>기본적으로 </span><span>각 </span><span>애플리케이션이 </span><span>별도의 </span><span>실행 </span><span>환경에서 </span><span>동작하도록 </span><span>만들고, </span><span>서로 </span><span>다른 </span><span>앱이나 </span><span>시스템과의 </span><span>상호작용은 </span><span>신뢰할 </span><span>수 </span><span>있는 </span><span>중앙 </span><span>구성 </span><span>요소를 </span><span>통해서만 </span><span>이루어지도록 </span><span>설계한다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="380" data-origin-width="333"><span data-phocus="https://blog.kakaocdn.net/dna/kH3jw/dJMcahGcvvL/AAAAAAAAAAAAAAAAAAAAACkTEhvaGqbPMwnW0jYqEiBVov57WloWS7N8wM9A4GaM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=GO2fNapIhMtAui8uAVvBBoKRoGI%3D" data-url="https://blog.kakaocdn.net/dna/kH3jw/dJMcahGcvvL/AAAAAAAAAAAAAAAAAAAAACkTEhvaGqbPMwnW0jYqEiBVov57WloWS7N8wM9A4GaM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=GO2fNapIhMtAui8uAVvBBoKRoGI%3D"><img data-origin-height="380" data-origin-width="333" height="380" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/kH3jw/dJMcahGcvvL/AAAAAAAAAAAAAAAAAAAAACkTEhvaGqbPMwnW0jYqEiBVov57WloWS7N8wM9A4GaM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=GO2fNapIhMtAui8uAVvBBoKRoGI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FkH3jw%2FdJMcahGcvvL%2FAAAAAAAAAAAAAAAAAAAAACkTEhvaGqbPMwnW0jYqEiBVov57WloWS7N8wM9A4GaM%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DGO2fNapIhMtAui8uAVvBBoKRoGI%253D" width="333"/></span></figure>
</p>
<p data-ke-size="size18" style="color: #333333; text-align: start;"><span> </span><span>Hub </span><span>— </span><span>중앙 </span><span>관리 </span><span>구성 </span><span>요소</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>Hub는 </span><span>사용자의 </span><span>요청을 </span><span>수신하고 </span><span>어떤 </span><span>애플리케이션을 </span><span>사용할지 </span><span>결정하며, </span><span>앱 </span><span>간 </span><span>상호작용을 </span><span>관리하는 </span><span>신뢰할 </span><span>수 </span><span>있는 </span><span>구성 </span><span>요소이다. </span><span>Hub는 </span><span>크게 </span><span>세 </span><span>가지 </span><span>요소로 </span><span>구성된다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>Hub Operator: LLM에 의존하지 않는 모듈로, 앱 호출 및 메시지 전달 흐름을 관리한다.</li>
<li>Hub Planner : 사용자 요청을 분석하여 필요한 애플리케이션과 작업 계획을 결정한다.</li>
<li>Hub Memory : 사용자가 시스템의 대화 기록 및 필요한 문맥 정보를 관리한다.</li>
</ol>
<p data-ke-size="size18" style="color: #333333; text-align: start;"><span>Spoke </span><span>— </span><span>앱별 </span><span>독립 </span><span>실행 </span><span>환경</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>각 </span><span>애플리케이션은 </span><span>별도의 </span><span>Spoke에서 </span><span>실행되며, </span><span>Spoke마다 </span><span>독립적인 </span><span>LLM </span><span>인스턴스와 </span><span>메모리를 </span><span>사용한다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>기존 </span><span>시스템이 </span><span>하나의 </span><span>LLM </span><span>문맥에서 </span><span>여러 </span><span>앱을 </span><span>처리했다면, </span><span>IsolateGPT는 </span><span>앱별 </span><span>실행 </span><span>환경을 </span><span>분리하여 </span><span>악성 </span><span>지시가 </span><span>다른 </span><span>앱의 </span><span>문맥에 </span><span>직접 </span><span>영향을 </span><span>미치지 </span><span>못하도록 </span><span>한다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>예를 </span><span>들어 </span><span>이메일 </span><span>앱이 </span><span>악성 </span><span>이메일을 </span><span>처리하는 </span><span>과정에서 </span><span>영향을 </span><span>받더라도, </span><span>해당 </span><span>앱이 </span><span>클라우드 </span><span>드라이브의 </span><span>데이터까지 </span><span>자유롭게 </span><span>조회할 </span><span>수는 </span><span>없다. </span><span>즉, </span><span>한 </span><span>앱에서 </span><span>발생한 </span><span>보안 </span><span>문제가 </span><span>다른 </span><span>앱으로 </span><span>확산되는 </span><span>범위를 </span><span>제한한다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<p data-ke-size="size18" style="color: #333333; text-align: start;"><span> </span><span>ISC </span><span>— </span><span>앱 </span><span>간 </span><span>안전한 </span><span>통신 </span><span>프로토콜</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>애플리케이션을 </span><span>격리하면 </span><span>보안성은 </span><span>높아지지만 </span><span>앱 </span><span>간 </span><span>협업이 </span><span>어려워질 </span><span>수 </span><span>있다. </span><span>이를 </span><span>해결하기 </span><span>위해 </span><span>논문에서는 </span><span><span>Inter-Spoke </span><span>Communication(ISC)</span></span> <span>프로토콜을 </span><span>제안한다. </span><span>ISC는 </span><span>앱들이 </span><span>직접 </span><span>통신하지 </span><span>않고 </span><span>Hub를 </span><span>통해 </span><span>정해진 </span><span>형식의 </span><span>메시지를 </span><span>주고받도록 </span><span>한다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>또한 </span><span>메시지의 </span><span>형식을 </span><span>검증하고, </span><span>필요한 </span><span>경우 </span><span>사용자에게 </span><span>앱 </span><span>간 </span><span>데이터 </span><span>공유나 </span><span>접근에 </span><span>대한 </span><span>권한을 </span><span>요청한다.</span><span>이를 </span><span>통해 </span><span>앱 </span><span>간 </span><span>협업 </span><span>기능을 </span><span>유지하면서도 </span><span>신뢰할 </span><span>수 </span><span>없는 </span><span>명령이 </span><span>다른 </span><span>앱으로 </span><span>전달되는 </span><span>것을 </span><span>제한한다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<h2 data-ke-size="size26" style="color: #333333; text-align: start;">해당 논문의 실험 설계와, 선행 연구들의 실험 설계 계보</h2>
<h4 data-ke-size="size20"><span>1. INJECAGENT — Agent의 행동 조작 가능성을 평가하기 위한 실험</span></h4>
<p data-ke-size="size16"><span>INJECAGENT의 핵심 연구 질문은 외부 도구의 응답에 포함된 악성 명령이 LLM Agent의 후속 행동을 실제로 조작할 수 있는가였다. </span><span>이를 확인하기 위해 연구진은 정상 사용자 요청에 사용되는 17개의 도구와 공격에 활용되는 62개의 도구를 조합하여 1,054개의 테스트 케이스를 구성하였다.</span></p>
<p data-ke-size="size16"><span>실험에서는 먼저 Agent가 정상적인 사용자 요청에 따라 외부 도구를 호출하도록 하고, 해당 도구의 응답에 공격자의 악성 명령을 삽입하였다. 이후 Agent가 해당 명령을 따르면서 의도하지 않은 도구 호출이나 민감정보 추출 및 전송을 시도하는지 평가하였다.</span></p>
<p data-ke-size="size16"><span>또한 기본 공격 조건(Base Setting)과 강화 공격 조건(Enhanced Setting)을 구분하고, ReAct 기반 Agent와 Fine-tuned Agent를 포함한 30개 Agent를 평가하였다. 공격 성공 여부는 ASR 및 유효한 응답만을 대상으로 하는 ASR-valid를 통해 정량화하였다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>INJECAGENT의 실험 설계와 결과에서 가장 중요한 것은 </span><b><span>외부 콘텐츠가 Agent의 의사결정에 영향을 미치는 정도를 동일한 조건에서 비교하는 것</span></b><span>이었다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>실제로 ReAct 기반 GPT-4는 기본 조건에서 23.6%, 강화 조건에서 47.0%의 ASR-valid를 기록하여 도구 활용 능력이 높은 모델에서도 IPI 공격이 성공할 수 있음을 보여주었다. </span><span></span><span>그러나 해당 실험은 Agent가 악성 명령을 따르는지 평가하는 데 중점을 두었으므로, 공격에 의해 조작된 Agent의 행동이 다른 애플리케이션이나 시스템 자원에 미치는 영향을 실행 격리 구조가 얼마나 제한할 수 있는지는 평가하지 않았다.</span></p>
<h3 data-ke-size="size23"><span>2. Agent Smith — 공격의 전파 속도와 범위를 분석하기 위한 실험</span></h3>
<p data-ke-size="size16"><span>Agent Smith는 INJECAGENT와 다른 관점에서 보안 문제를 분석하였다. </span><span>기존의 Jailbreak 연구에서는 주로 개별 모델이 악성 입력에 의해 안전 정책을 위반하는지 평가하였다. 반면 Agent Smith는 하나의 Agent에 주입된 적대적 이미지가 여러 Agent 사이의 상호작용을 통해 확산될 수 있는지 확인하고자 하였다.</span></p>
<p data-ke-size="size16"><span>이를 위해 연구진은 MLLM, 이미지 검색 모듈(RAG), 텍스트 대화 기록(Text Histories), 이미지 메모리(Image Album)로 구성된 Agent들이 무작위로 짝을 이루어 대화하는 Randomized Pairwise Chat 환경을 구축하였다.</span></p>
<p data-ke-size="size16"><span>실험에서는 적대적 이미지를 Agent의 메모리에 삽입한 후, Agent 간 대화와 메모리 갱신 과정을 통해 이미지가 전달되고 다른 Agent에서도 유해한 응답이 생성되는지 관찰하였다.</span></p>
<p data-ke-size="size16"><span>연구진은 기본적으로 256개의 Agent를 활용하고, 최대 약 100만 개의 Agent까지 시뮬레이션 규모를 확장하였다. 또한 기존의 비전염성 공격 방식과 비교하면서 누적 감염률(Cumulative Infection Ratio), 현재 감염률(Current Infection Ratio), 특정 감염률에 도달하기까지 필요한 대화 라운드를 측정하였다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>특히 악성 이미지가 단순히 전달되었다는 사실과 Agent가 실제로 Jailbreak되었다는 사실을 구분하여 평가하였다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>즉, Agent Smith의 실험에서 중요한 것은 </span><span>개별 Agent의 공격 성공률뿐 아니라, Agent 간 상호작용이 공격의 전달 경로가 되어 전체 시스템에 미치는 영향이 얼마나 빠르게 확대되는지 확인하는 것</span><span>이었다. </span><span>실험에서는 특정 조건에서 전염성 Jailbreak가 기존의 순차적인 공격보다 빠르게 확산됨을 확인하였지만 해당 연구는 공격 확산 현상을 분석하고 전파 억제를 위한 이론적 조건을 제시하는 데 초점을 맞추었으며, 실제 애플리케이션 시스템에 적용하는 구체적인 실행 격리 아키텍처를 검증하지는 않았다.</span></p>
<h3 data-ke-size="size23"><span>3. IsolateGPT — 실행 격리의 방어 효과와 실용성을 검증하기 위한 실험</span></h3>
<p data-ke-size="size16"><span>앞선 두 연구가 외부 콘텐츠에 의한 행동</span></p>
<p data-ke-size="size16"><span>=조작과 다중 Agent 환경의 공격 전파 가능성을 각각 분석하였다면, IsolateGPT는 관련 보안 위협을 시스템 수준에서 어떻게 제한할 수 있는지에 주목하였다. </span><span>IsolateGPT는 특히 신뢰할 수 없는 애플리케이션 사이의 실행 격리와 접근 통제를 주요 연구 대상으로 설정하였다.</span></p>
<p data-ke-size="size16"><span>IsolateGPT의 실험에서는 </span><span>실행 격리가 실제 보안성을 향상시키는지, 격리 이후에도 기존 애플리케이션의 기능을 유지할 수 있는지, 그리고 이를 위해 어느 정도의 성능 비용이 발생하는지</span><span>를 함께 확인하고자 하였다.</span></p>
<p data-ke-size="size16"><span>이를 위해 연구진은 동일한 기능을 제공하는 두 가지 시스템을 비교하였다.</span></p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li><b><span>VanillaGPT:</span></b><span> 별도의 앱 실행 격리가 없는 기존 LLM 애플리케이션 시스템</span></li>
<li><b><span>IsolateGPT:</span></b><span> Hub-and-Spoke 아키텍처를 기반으로 앱별 실행 격리와 접근 통제를 적용한 시스템</span></li>
</ul>
<p data-ke-size="size16"><span>두 시스템 모두 GPT-4 API를 사용하여, 실행 격리 구조의 유무에 따른 차이를 비교할 수 있도록 하였다.</span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">주요 실험 결과</h3>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="305" data-origin-width="366"><span data-phocus="https://blog.kakaocdn.net/dna/xGedn/dJMb99OQEp1/AAAAAAAAAAAAAAAAAAAAAGmSGuQF04w-Jjel-xULdtwxWcEocQWF-SKqZqzhEhnd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=qMaJnMJKNOF0PQ2FIon9o3VDVHY%3D" data-url="https://blog.kakaocdn.net/dna/xGedn/dJMb99OQEp1/AAAAAAAAAAAAAAAAAAAAAGmSGuQF04w-Jjel-xULdtwxWcEocQWF-SKqZqzhEhnd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=qMaJnMJKNOF0PQ2FIon9o3VDVHY%3D"><img data-origin-height="305" data-origin-width="366" height="305" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/xGedn/dJMb99OQEp1/AAAAAAAAAAAAAAAAAAAAAGmSGuQF04w-Jjel-xULdtwxWcEocQWF-SKqZqzhEhnd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=qMaJnMJKNOF0PQ2FIon9o3VDVHY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FxGedn%2FdJMb99OQEp1%2FAAAAAAAAAAAAAAAAAAAAAGmSGuQF04w-Jjel-xULdtwxWcEocQWF-SKqZqzhEhnd%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DqMaJnMJKNOF0PQ2FIon9o3VDVHY%253D" width="366"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>격리되지 </span><span>않은 </span><span>VanillaGPT에서는 </span><span>전체 </span><span>공격의 </span><span>평균 </span><span>20.2%가 </span><span>성공하였다.</span><span>반면 </span><span>IsolateGPT에서는 </span><span>공격에 </span><span>따른 </span><span>추가 </span><span>접근이 </span><span>필요한 </span><span>상황에서 </span><span>권한 </span><span>요청이 </span><span>발생하였으며, </span><span>발생한 </span><span>권한 </span><span>요청에는 </span><span>모두 </span><span>경고가 </span><span>포함되었다.</span><span>다만 </span><span>IsolateGPT의 </span><span>실제 </span><span>방어 </span><span>성공은 </span><span>사용자가 </span><span>악성 </span><span>접근 </span><span>요청을 </span><span>거부하는지에 </span><span>영향을 </span><span>받는다.</span></p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="222" data-origin-width="354"><span data-phocus="https://blog.kakaocdn.net/dna/NvQaf/dJMcab0s2Dc/AAAAAAAAAAAAAAAAAAAAAHOHCtyWJo2aBqhAynC3zc-gLdO3J-nykqczUWz8V7rI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=dzwpEsNrPQ%2F1Q3r8vBo9P8M4SVA%3D" data-url="https://blog.kakaocdn.net/dna/NvQaf/dJMcab0s2Dc/AAAAAAAAAAAAAAAAAAAAAHOHCtyWJo2aBqhAynC3zc-gLdO3J-nykqczUWz8V7rI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=dzwpEsNrPQ%2F1Q3r8vBo9P8M4SVA%3D"><img data-origin-height="222" data-origin-width="354" height="222" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/NvQaf/dJMcab0s2Dc/AAAAAAAAAAAAAAAAAAAAAHOHCtyWJo2aBqhAynC3zc-gLdO3J-nykqczUWz8V7rI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=dzwpEsNrPQ%2F1Q3r8vBo9P8M4SVA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FNvQaf%2FdJMcab0s2Dc%2FAAAAAAAAAAAAAAAAAAAAAHOHCtyWJo2aBqhAynC3zc-gLdO3J-nykqczUWz8V7rI%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DdzwpEsNrPQ%252F1Q3r8vBo9P8M4SVA%253D" width="354"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"><span>LangChain </span><span>벤치마크를 </span><span>이용한 </span><span>기능 </span><span>평가에서 </span><span>단일 </span><span>앱과 </span><span>여러 </span><span>앱 </span><span>사용 </span><span>시나리오 </span><span>모두 </span><span>기존 </span><span>시스템과 </span><span>동일한 </span><span>정확도를 </span><span>보였다. </span><span>앱 </span><span>간 </span><span>협업이 </span><span>필요한 </span><span>작업에서도 </span><span>최종 </span><span>결과 </span><span>정확도가 </span><span>두 </span><span>시스템 </span><span>모두 </span><span>0.95로 </span><span>나타났다. </span><span>이는 </span><span>실행 </span><span>격리가 </span><span>반드시 </span><span>앱 </span><span>간 </span><span>협업 </span><span>기능의 </span><span>감소로 </span><span>이어지는 </span><span>것은 </span><span>아니라는 </span><span>점을 </span><span>보여준다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="234" data-origin-width="358"><span data-phocus="https://blog.kakaocdn.net/dna/C99Cm/dJMcahTCPMN/AAAAAAAAAAAAAAAAAAAAAGjdB2Qxx-1qzjrVqKZCyWxYOouP6Z8VJzepHkVW5x4_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=bBrdzy5kxHmIwizOFy8Yp6lpIqg%3D" data-url="https://blog.kakaocdn.net/dna/C99Cm/dJMcahTCPMN/AAAAAAAAAAAAAAAAAAAAAGjdB2Qxx-1qzjrVqKZCyWxYOouP6Z8VJzepHkVW5x4_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=bBrdzy5kxHmIwizOFy8Yp6lpIqg%3D"><img data-origin-height="234" data-origin-width="358" height="234" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/C99Cm/dJMcahTCPMN/AAAAAAAAAAAAAAAAAAAAAGjdB2Qxx-1qzjrVqKZCyWxYOouP6Z8VJzepHkVW5x4_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=bBrdzy5kxHmIwizOFy8Yp6lpIqg%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FC99Cm%2FdJMcahTCPMN%2FAAAAAAAAAAAAAAAAAAAAAGjdB2Qxx-1qzjrVqKZCyWxYOouP6Z8VJzepHkVW5x4_%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DbBrdzy5kxHmIwizOFy8Yp6lpIqg%253D" width="358"/></span></figure>
</p>
<p data-ke-size="size16">전체 테스트 질의의 약 75.73%에서 IsolateGPT의 실행시간 오버헤드는 VanillaGPT 대비 30% 미만이었다. 그러나 여러 앱을 사용하거나 앱 간 협업이 필요한 상황에서는 Hub와 Spoke의 추가 계획 수립 및 메모리 처리로 인해 실행 시간이 증가했다. 또한 일부 질의를 대상으로 분석한 API 사용 비용은 기존 시스템 대비 약 1.85배였다. 따라서 <span style="color: #333333; text-align: start;"><span>보안 </span><span>격리를 </span><span>통해 </span><span>위험을 </span><span>줄이고 </span><span>기능을 </span><span>유지할 </span><span>수 </span><span>있지만, </span><span>실행시간 </span><span>및 </span><span>비용 </span><span>증가가 </span><span>발생한다는 </span><span>점</span></span>을 확인하였다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26" style="color: #000000; text-align: start;"><span>본 </span><span>논문의 </span><span>연구적 </span><span>기여</span></h2>
<div style="color: #333333; text-align: start;">
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span><span>시스템 </span><span>수준의 </span><span>실행 </span><span>격리 </span><span>아키텍처 </span><span>제안</span></span></span></td>
<td><span><span>기존의 </span><span>악성 </span><span>프롬프트 </span><span>탐지 </span><span>중심 </span><span>접근에서 </span><span>나아가, </span><span>신뢰할 </span><span>수 </span><span>없는 </span><span>앱을 </span><span>독립된 </span><span>실행 </span><span>환경에 </span><span>배치하여 </span><span>공격의 </span><span>영향 </span><span>범위를 </span><span>제한하는 </span><span>구조적 </span><span>방어 </span><span>방식을 </span><span>제안함.</span></span></td>
</tr>
<tr>
<td><span><span><span> </span><span>Hub-and-Spoke </span><span>구조 </span><span>설계</span></span></span></td>
<td><span><span>각 </span><span>앱에 </span><span>독립적인 </span><span>LLM과 </span><span>메모리를 </span><span>할당하고 </span><span>신뢰할 </span><span>수 </span><span>있는 </span><span>Hub가 </span><span>앱 </span><span>실행과 </span><span>데이터 </span><span>접근을 </span><span>관리하도록 </span><span>하여, </span><span>앱 </span><span>사이의 </span><span>무분별한 </span><span>접근을 </span><span>제한함.</span></span></td>
</tr>
<tr>
<td><span><span><span>안전한 </span><span>앱 </span><span>간 </span><span>협업 </span><span>방식 </span><span>제안</span></span></span></td>
<td><span><span>ISC </span><span>프로토콜을 </span><span>통해 </span><span>앱 </span><span>간 </span><span>통신을 </span><span>Hub를 </span><span>경유하도록 </span><span>만들고, </span><span>메시지 </span><span>형식 </span><span>검증과 </span><span>사용자 </span><span>권한 </span><span>관리를 </span><span>적용하여 </span><span>격리 </span><span>환경에서도 </span><span>필요한 </span><span>협업을 </span><span>수행하도록 </span><span>함.</span></span></td>
</tr>
<tr>
<td><span><span><span>방어 </span><span>효과와 </span><span>실용성 </span><span>검증</span></span></span></td>
<td><span><span>INJECAGENT를 </span><span>확장한 </span><span>1,598개 </span><span>공격 </span><span>사례와 </span><span>LangChain </span><span>벤치마크를 </span><span>이용하여 </span><span>실행 </span><span>격리의 </span><span>보안 </span><span>효과, </span><span>기능 </span><span>유지 </span><span>여부, </span><span>성능 </span><span>및 </span><span>비용 </span><span>오버헤드를 </span><span>평가함.</span></span></td>
</tr>
</tbody>
</table>
</div>
<h3 data-ke-size="size23" data-pm-slice="1 1 []"> </h3>
<h3 data-ke-size="size23" data-pm-slice="1 1 []"><span>본 논문의 한계점과 후속 연구로의 확장</span></h3>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>IsolateGPT는 각 애플리케이션의 실행 환경을 격리하여 앱 간 공격의 영향이 확산되는 것을 제한하고자 하였다. 그러나 개별 애플리케이션 내부에서 발생하는 Prompt Injection이나 악성 행동 자체를 방지하는 것은 연구 범위에 포함하지 않았다. 또한 중앙 Hub와 시스템 LLM이 신뢰할 수 있는 구성 요소라는 가정을 전제로 하며, 앱 간 데이터 공유 및 접근 통제 과정에서 사용자 권한 승인에 의존한다. 따라서 사용자가 악성 접근 요청을 잘못 승인하는 경우에는 보안성을 완전히 보장하기 어렵다는 한계가 존재한다.</span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>내가 생각하고, 실제로 알아봤던 후속 연구의 확장은 두 가지이다.</span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<h3 data-ke-size="size23" data-pm-slice="1 1 []"><span>IsolateGPT의 독립된 환경의 문제점.</span></h3>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>IsolateGPT는 애플리케이션을 독립된 환경에서 실행하지만, 중앙 Hub의 Planner는 애플리케이션의 기능 설명을 참고하여 작업 계획을 수립하고, 실행 과정에서는 애플리케이션의 출력이 Execution Manager LLM에 전달되는 구조를 사용한다. </span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>이러한 구조를 사용하여  ACE 연구진은 </span><span>Planner Manipulation, Execution Flow Disruption, Execution Manager Hijack이라는 세 가지 공격을 실제 IsolateGPT에 수행하였다. 이를 통해 앱의 실행 환경이 분리되어 있더라도 악성 앱의 설명이나 출력이 시스템의 작업 계획과 실행 흐름에 영향을 미칠 수 있다는 한계를 확인하였다.</span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>여기서 더 나아가 ACE는 실행 격리에서 작업 계획의 생성과 실행을 분리하는 </span><span>Abstract-Concrete-Execute 아키텍처를 제안하였다. 신뢰할 수 있는 사용자 요청을 기반으로 추상 계획을 생성하고, 구체적인 앱을 연결한 뒤 정보 흐름 정책을 검증하여 실행하도록 설계하였다. </span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<p data-ke-size="size18"><span>ACE의 실험 결과</span></p>
<p data-ke-size="size18"> </p>
<p data-ke-size="size16"><span>ACE 연구진은 앞서 IsolateGPT에서 성공했던 Planner Manipulation, Execution Flow Disruption, Execution Manager Hijack 공격을 ACE 환경에 동일하게 적용하여 방어 효과를 검증하였다. 그 결과 </span><span>ACE는 세 가지 공격을 모두 차단하였다.</span><span> 이는 작업 계획을 신뢰할 수 있는 정보로부터 미리 생성하고, 실행 과정에서 악성 앱의 출력을 제어 명령이 아닌 정해진 형식의 데이터로만 처리하도록 설계했기 때문이다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>또한 INJECAGENT의 1,054개 공격 테스트 케이스를 활용하여 Prompt Injection에 대한 방어 성능을 평가하였다. 실험 결과 ACE는 사용한 LLM 구성과 관계없이 모든 테스트 케이스에서 </span><span>100%의 보안 점수</span><span>를 기록하였다. 여기서 보안 점수는 공격자가 의도한 앱이 실행되지 않은 비율을 의미한다. 추가로 Agent Security Bench(ASB)의 2,000회 실험에서는 공격자 앱 호출이 3회 발생했지만, 연구진은 이를 악성 지시에 따른 호출이 아닌 정상적인 작업 수행을 위한 앱 선택으로 분석하였다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>보안성뿐 아니라 정상적인 작업 수행 능력도 평가하였다. LangChain의 Tool Usage 벤치마크에서 GPT-4.1을 사용했을 때, 단일 도구 작업 95%, 다중 도구 작업 80%, 관계형 데이터 처리 작업 85.7%의 최종 정확도를 기록하였다. 다만 추상 계획 생성과 구체적인 앱 매칭 과정에서 추가적인 LLM 호출이 필요하므로 실행시간과 API 비용이 발생한다는 점도 확인하였다.</span><span></span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">IsolateGPT의 다양한 MAS에 대한 실험</h3>
<p data-ke-size="size16">지금은 많은 MAS에 대한 구조가 있는데, IsolateGPT에 대한 실험을 했을 때는 이렇게 많은 MAS에 대한 구조가 있지 않았다. 그래서 현재 시점에서 봤을 때는 다양한 MAS 환경에서의 <span>다양한 Agent의 역할과 통신 구조를 가진 MAS에서도 유사한 보안 효과가 나타나는지는 별도의 검증이 필요하다. 특히 복잡한 협업 환경에서는 구성 요소의 실행 격리뿐 아니라 Agent 간 메시지 전달 방식과 상호작용 구조가 전체 시스템의 보안성에 영향을 미칠 수 있다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>이러한 평가 범위의 확장이라는 관점에서 ACIArena(Toward Unified Evaluation for Agent Cascading Injection)를 연결해 볼 수 있다. ACIArena는 6개의 MAS 구현과 1,356개의 테스트 케이스를 통해 외부 입력, Agent 프로필, Agent 간 메시지 등 다양한 공격 표면에서 발생하는 Agent Cascading Injection(ACI)을 체계적으로 평가하였다.</span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<h4 data-ke-size="size20"><span>ACIArena의 실험 결과</span></h4>
<p data-ke-size="size16"><span>ACIArena 연구진은 GPT-4o, GPT-4o-mini, Qwen2.5-7B-Instruct를 활용하여 다양한 MAS 환경에서 공격 성공률(ASR), 공격 상황에서의 정상 작업 수행 능력(UA), 공격 전파 취약성(PVI)을 평가하였다.</span></p>
<p data-ke-size="size16"><span>실험 결과 </span><span>MAS의 보안성은 단순히 Agent의 수나 통신 구조의 복잡성에 따라 결정되지 않는다는 점</span><span>을 확인하였다. 동일한 통신 구조에서도 Agent의 역할과 구성에 따라 공격 성공률이 크게 달라졌으며, 복잡한 상호작용 구조를 가진 시스템에서도 악성 명령이 여러 Agent를 거쳐 전파되는 문제가 발생하였다.</span></p>
<p data-ke-size="size16"><span>특히 GPT-4o-mini 기반 코드 생성 실험에서 MetaGPT와 LLM Debate는 Hijacking 공격 성공률이 각각 100%에 도달하였다. 또한 CAMEL은 일부 공격에서 낮은 공격 성공률을 기록하였지만, 정상적인 작업 수행 능력 역시 낮게 나타났다.  </span></p>
<p data-ke-size="size16"><span>또한 </span><span>연구진은 기존 방어 기법인 BERT 기반 탐지, Delimiter, Sandwich, AGrail, G-Safeguard도 비교하였다. 실험에서는 일부 방어 기법이 특정 공격을 제한하는 데 효과적이었지만, 다른 공격에서는 공격 성공률이 증가하거나 정상 작업 수행 능력이 크게 감소하는 문제가 확인되었다.</span></p>
<p data-ke-size="size16"><span>이에 ACIArena 연구진은 각 Agent의 작업 수행에 필요한 핵심 정보만 문맥에 유지하도록 하는 ACI-Sentinel을 제안하였다. 코드 생성 환경의 MetaGPT에서는 Hijacking 공격 성공률이 기존 79.44%에서 0%로 감소하였고, Exfiltration 공격 성공률도 60.44%에서 9.78%로 감소하였다. 다만 모든 공격을 완전히 차단한 것은 아니며, 정보 축소 과정에서 정상 작업에 필요한 문맥까지 제거될 수 있다는 한계도 존재한다.</span></p>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26" style="color: #000000; text-align: start;">연구에 대한 생각</h2>
<p data-ke-size="size16" style="color: #333333; text-align: start;">사실 저렇게 Agent 팀을 직접 물려서 사용하는 경우를 주변에서는 잘.... 본 적 없는 것 같다. LLM Agent의 활용이 빠르게 확대되고 있고 묻고 답하는 것을 넘어서 gmail 등의 다양한 외부 도구를 활용하면서 편하긴 하지만 그만큼 보안 취약점이 늘어나고 있는 것 같고, 이런 Agent 팀에 대한 연구에 대해서 Codex 나 Claude code와 같은 실제 코딩 Agent에 대한 연구도 빠르게 늘어날 필요가 있어 보인다.</p>
<p data-ke-size="size16" style="color: #333333; text-align: start;"> </p>
<p data-ke-size="size16" style="color: #333333; text-align: start;">하지만 코딩 AGent와 같은 경우에 빠르게 발전해나가며 언제 업데이트가 될 줄 모르고, 언제 새기능이 추가 될지 모르기에 "보안"이라는 항목을 완벽하게 충족시키긴 어려울 것 같다. </p>
