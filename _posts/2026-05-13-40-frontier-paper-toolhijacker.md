---
layout: post
title: 프론티어_논문 분석 정리본
date: 2026-05-13
desc: "LLM Agent의 Tool Selection 공격 ToolHijacker 상세 분석 (NDSS 2026 Prompt Injection)"
keywords: "LLM, agent, tool selection, prompt injection, ToolHijacker, NDSS 2026, AI security, 프롬프트 인젝션"
categories: [Paper-Conference]
tags: [논문, 프론티어, AI 보안]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/40](https://sanghole.tistory.com/40)

<h2 data-end="450" data-start="437" data-section-id="1rmecoe" data-ke-size="size26">논문 리뷰 핵심 요약</h2>
<h3 data-end="466" data-start="452" data-section-id="v85qtn" data-ke-size="size23">논문 제목 및 학회명</h3>
<p data-end="543" data-start="468" data-ke-size="size16">Prompt Injection Attack to Tool Selection in LLM Agents / NDSS 2026</p>
<p data-end="908" data-start="545" data-ke-size="size16">이 논문은 LLM Agent가 외부 tool을 선택하는 과정 자체가 prompt injection의 공격 표면이 될 수 있다는 점을 다룬다. 일반적인 LLM Agent는 사용자의 요청을 받은 뒤, 관련 tool document를 먼저 검색하고, 그중에서 LLM이 최종 tool을 선택한다. 즉 tool selection은 크게 retrieval 단계와 selection 단계로 나뉜다. ToolHijacker는 이 두 단계를 모두 공격하여, 사용자가 정상적인 요청을 했더라도 Agent가 정상 tool이 아니라 공격자가 만든 악성 tool을 선택하게 만드는 공격이다.</p>
<h3 data-end="922" data-start="910" data-section-id="bqk7ih" data-ke-size="size23">논문을 고른 이유</h3>
<p data-end="1075" data-start="924" data-ke-size="size16">최근 LLM Agent는 단순히 답변을 생성하는 수준을 넘어, 외부 도구를 호출하고 실제 작업을 수행하는 방향으로 발전하고 있다. 이때 Agent에게 많은 권한과 자율성이 주어지면 단순한 답변 오류가 아니라 실제 도구 실행 결과까지 공격자에게 유리하게 조작될 수 있다.</p>
<p data-end="1252" data-start="1077" data-ke-size="size16">기존 prompt injection 연구는 주로 LLM의 응답 생성이나 tool calling 단계에 집중했다. 하지만 이 논문은 그보다 앞단인 tool selection 과정 자체를 공격 대상으로 본다. 이 부분이 흥미로웠다. LLM에 대한 보안과 관려해서는 주로 프롬프트 인젝션만 알고 있었는데 tool을 가지고, tool과 관련된 공격을 시도하는 연구 background 자체가 좋은 것 같았다.</p>
<h3 data-end="1262" data-start="1254" data-section-id="10a43fw" data-ke-size="size23">문제 정의</h3>
<p data-end="1294" data-start="1264" data-ke-size="size16">LLM Agent의 일반적인 동작 흐름은 다음과 같다.</p>
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
<pre class="routeros"><code>사용자 요청
&rarr; 관련 tool document 검색
&rarr; LLM이 최종 tool 선택
&rarr; tool 호출</code></pre>
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
<p data-end="1668" data-start="1366" data-ke-size="size16">여기서 중요한 부분은 tool selection이 단순히 LLM이 바로 고르는 과정이 아니라는 점이다. 먼저 retriever가 tool library에서 관련 있어 보이는 top-k tool document를 가져오고, 그 이후 LLM이 그 후보들 중 최종 tool을 선택한다. 따라서 공격자가 악성 tool document를 tool library에 삽입할 수 있다면, Agent는 정상 요청을 받았더라도 악성 tool을 관련 있는 tool로 판단하고 선택할 수 있다.</p>
<p data-end="2004" data-start="1670" data-ke-size="size16">기존 공격 방식들은 이 구조를 완전히 다루지 못했다. Naive, Context Ignore 같은 수동 prompt injection은 주로 LLM이 악성 지시를 따르게 만드는 데 초점이 있고, JudgeDeceiver는 selection 단계에 더 가깝다. PoisonedRAG는 retrieval을 고려하지만, 목표가 tool selection 조작보다는 RAG 답변 생성을 오염시키는 데 있다. 그래서 이 논문은 <b>r</b>etrieval과 selection을 동시에 겨냥하는 tool selection 전용 공격을 제안한다.</p>
<h3 data-end="2016" data-start="2006" data-section-id="1djmz58" data-ke-size="size23">핵심 아이디어</h3>
<p data-end="2145" data-start="2018" data-ke-size="size16">논문에서 제안하는 공격은 ToolHijacker이다. 핵심은 악성 tool document를 만들어 tool library에 삽입하고, Agent가 특정 target task에서 해당 tool을 선택하도록 만드는 것이다.</p>
<p data-end="2177" data-start="2147" data-ke-size="size16">악성 tool document는 다음과 같이 구성된다.</p>
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
<pre class="routeros"><code>dt = {dt_name, dt_des}

dt_name = 악성 tool 이름
dt_des  = 악성 tool 설명

dt_des = R &oplus; S</code></pre>
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
<p data-end="2302" data-start="2274" data-ke-size="size16">여기서 R과 S는 각각 다른 목적을 가진다.</p>
<div>
<div>구성 요소목적
<table style="border-collapse: collapse; width: 100%;" border="1" data-end="2427" data-start="2304" data-ke-align="alignLeft">
<tbody data-end="2427" data-start="2329">
<tr data-end="2380" data-start="2329">
<td data-col-size="sm" data-end="2333" data-start="2329">R</td>
<td data-col-size="md" data-end="2380" data-start="2333">retrieval 단계에서 악성 tool이 top-k 후보군 안에 들어가게 함</td>
</tr>
<tr data-end="2427" data-start="2381">
<td data-col-size="sm" data-end="2385" data-start="2381">S</td>
<td data-col-size="md" data-end="2427" data-start="2385">selection 단계에서 LLM이 악성 tool을 최종 선택하게 함</td>
</tr>
</tbody>
</table>
</div>
</div>
<p data-end="2740" data-start="2429" data-ke-size="size16">이 구조가 중요한 이유는 tool selection이 2단계 구조이기 때문이다. 악성 tool이 retrieval top-k 안에 들어가지 못하면 LLM에게 전달되지 않으므로 selection 기회 자체가 없다. 반대로 top-k 안에 들어가더라도 LLM이 정상 tool을 선택하면 공격은 실패한다. 그래서 ToolHijacker는 tool description을 R과 S로 나누고, 각각 retrieval objective와 selection objective에 맞춰 최적화한다.</p>
<h3 data-end="2757" data-start="2742" data-section-id="eed7hv" data-ke-size="size23">방법론 / 시스템 설명</h3>
<h4 data-end="2783" data-start="2759" data-section-id="ipszz1" data-ke-size="size20">1. Tool selection 구조</h4>
<p data-end="2819" data-start="2785" data-ke-size="size16">논문은 tool selection을 세 가지 요소로 정의한다.</p>
<div>
<div>구성 요소역할
<table style="border-collapse: collapse; width: 100%;" border="1" data-end="3030" data-start="2821" data-ke-align="alignLeft">
<tbody data-end="3030" data-start="2846">
<tr data-end="2933" data-start="2846">
<td data-col-size="sm" data-end="2861" data-start="2846">Tool library</td>
<td data-col-size="md" data-end="2933" data-start="2861">tool name, tool description, API specification을 포함한 tool document 집합</td>
</tr>
<tr data-end="2994" data-start="2934">
<td data-col-size="sm" data-end="2946" data-start="2934">Retriever</td>
<td data-col-size="md" data-end="2994" data-start="2946">사용자 요청과 tool document의 유사도를 계산해 top-k 후보를 검색</td>
</tr>
<tr data-end="3030" data-start="2995">
<td data-col-size="sm" data-end="3001" data-start="2995">LLM</td>
<td data-col-size="md" data-end="3030" data-start="3001">검색된 top-k 후보 중 최종 tool 선택</td>
</tr>
</tbody>
</table>
</div>
</div>
<p data-end="3308" data-start="3032" data-ke-size="size16">Retrieval 단계에서는 사용자의 task description q와 각 tool document d를 embedding vector로 변환한다. 이후 cosine similarity나 dot product 같은 similarity function을 사용해 관련도가 높은 tool document를 top-k로 가져온다. 그다음 selection 단계에서 LLM이 이 후보군을 보고 실제 사용할 tool을 선택한다.</p>
<h4 data-end="3346" data-start="3310" data-section-id="by5zt2" data-ke-size="size20">2. Threat model: no-box scenario</h4>
<p data-end="3588" data-start="3348" data-ke-size="size16">ToolHijacker는 no-box scenario를 가정한다. 여기서 공격자는 target LLM, target retriever, 실제 tool library, top-k 설정, 실제 task description에 접근할 수 없다. 심지어 target retriever나 target LLM에 직접 질의해서 결과를 확인하는 것도 불가능하다고 본다. black-box와 같은 경우에는 그래도 target LLM에게 질의를 통해서 결과를 얻을 수 있지만, no-box는 그런 환경 조차 못한다는 가정이다.</p>
<p data-end="3876" data-start="3590" data-ke-size="size16">대신 공격자는 target task가 어떤 종류의 작업인지 정도는 알고 있고, 공개된 tool 개발 가이드라인이나 문서 템플릿을 활용할 수 있다. 또한 Hugging Face Hub, Apify, PulseMCP 같은 third-party tool hub에 악성 tool을 등록할 수 있다고 가정한다. 즉 현실적으로 공개 tool platform에 악성 tool document를 올리고, Agent가 이를 가져다 쓰는 상황을 모델링한 것이다.</p>
<h4 data-end="3901" data-start="3878" data-section-id="12y4pup" data-ke-size="size20">3. Shadow framework</h4>
<p data-end="3985" data-start="3903" data-ke-size="size16">no-box 환경에서는 target system을 직접 볼 수 없으므로, ToolHijacker는 공격자가 직접 만든 shadow 환경을 사용한다.</p>
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
<pre class="routeros"><code>shadow task descriptions Q&prime;
shadow tool documents D&prime;
shadow retriever
shadow LLM
shadow tool library</code></pre>
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
<p data-end="4285" data-start="4101" data-ke-size="size16">공격자는 이 shadow framework에서 악성 tool document가 얼마나 자주 선택되는지 평가하고, 그 결과를 기반으로 tool description을 반복적으로 최적화한다. 목표는 shadow 환경에서 잘 동작하는 악성 tool document를 만들고, 이것이 실제 target 환경에서도 전이되도록 하는 것이다.</p>
<h4 data-end="4299" data-start="4287" data-section-id="8u81v9" data-ke-size="size20">4. 공격 목표</h4>
<p data-end="4390" data-start="4301" data-ke-size="size16">공격자의 목표는 단순히 악성 문장을 LLM에게 보여주는 것이 아니다. 사용자가 정상적인 질문을 했을 때도 Agent가 악성 tool을 선택하도록 만드는 것이다.</p>
<p data-end="4446" data-start="4392" data-ke-size="size16">이를 위해 각 shadow task description q&prime;i에 대해 다음 과정을 반복한다.</p>
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
<pre class="routeros"><code>1. shadow tool library D&prime;에 악성 tool document dt를 추가
2. retriever가 top-k tool document를 검색
3. shadow LLM E&prime;가 최종 tool 선택
4. dt를 선택하면 성공으로 계산
5. 전체 shadow task description에서 성공률을 최대화</code></pre>
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
<p data-end="4864" data-start="4640" data-ke-size="size16">하지만 tool document는 자연어 텍스트이기 때문에 직접 최적화하기 어렵다. 자연어는 이산적인 token sequence이고, LLM의 선택 결과도 단순한 연속 함수처럼 미분하기 어렵다. 그래서 논문은 이 문제를 한 번에 풀지 않고, retrieval objective와 selection objective로 나누어 해결한다.</p>
<h3 data-end="4891" data-start="4866" data-section-id="j0m2c2" data-ke-size="size23">R 최적화: retrieval 단계 공격</h3>
<p data-end="5047" data-start="4893" data-ke-size="size16">R의 목적은 악성 tool document가 retriever에 의해 top-k 후보군 안에 들어가도록 만드는 것이다. 쉽게 말하면, 사용자가 target task와 관련된 다양한 표현을 사용하더라도 악성 tool 설명이 그 요청과 의미적으로 가깝게 보이게 만드는 것이다.</p>
<p data-end="5047" data-start="4893" data-ke-size="size16">&nbsp;</p>
<p data-end="5047" data-start="4893" data-ke-size="size16">R 최적화를 수행하는 이유는 악성 tool document가 selection 단계에 도달하기 위해서는 먼저 retrieval 단계에서 top-k 후보군 안에 포함되어야 하기 때문이다. 아무리 selection을 유도하는 문장이 잘 설계되어 있더라도 retriever가 해당 tool을 후보로 가져오지 않으면 LLM은 그 tool을 선택할 기회조차 얻지 못한다.</p>
<p data-end="5047" data-start="4893" data-ke-size="size16">&nbsp;</p>
<p data-end="5047" data-start="4893" data-ke-size="size16">따라서 R은 사용자 요청과 악성 tool document 사이의 의미적 유사도를 높여, 악성 tool이 검색 단계에서 안정적으로 노출되도록 만드는 역할을 한다.</p>
<h4 data-end="5069" data-start="5049" data-section-id="1jr05rh" data-ke-size="size20">Gradient-Free 방식</h4>
<p data-end="5350" data-start="5071" data-ke-size="size16">Gradient-Free 방식은 model gradient 없이 LLM을 이용해 자연스러운 tool description을 생성한다. 공격자 LLM에게 shadow task descriptions를 주고, 이 요청들을 포괄할 수 있는 tool functionality description을 만들게 한다. 이렇게 생성된 R은 특정 질문 하나에만 맞춘 문장이 아니라, target task와 의미적으로 넓게 연결되는 설명이 된다.</p>
<h4 data-end="5373" data-start="5352" data-section-id="1v33aso" data-ke-size="size20">Gradient-Based 방식</h4>
<p data-end="5684" data-start="5375" data-ke-size="size16">Gradient-Based 방식은 shadow retriever의 gradient 정보를 사용한다. 목표는 R과 shadow task description들의 평균 similarity score를 최대화하는 것이다.</p>
<p data-end="5684" data-start="5375" data-ke-size="size16">&nbsp;</p>
<p data-end="5684" data-start="5375" data-ke-size="size16">즉 retriever가 R을 target task와 관련 있는 tool description으로 판단하게 만드는 방향으로 token-level 최적화를 수행한다. 논문에서는 HotFlip을 사용해 token 단위 adversarial text 최적화를 수행한다.</p>
<p data-end="5910" data-start="5686" data-ke-size="size16">이 방식이 target retriever에서도 통할 수 있다고 보는 이유는, 서로 다른 retriever라도 의미적으로 유사한 패턴을 학습하는 경우가 많기 때문이다. 따라서 shadow retriever에서 target task와 가깝게 보이도록 만든 R이 실제 target retriever에서도 어느 정도 전이될 수 있다.</p>
<h3 data-end="5937" data-start="5912" data-section-id="2voghh" data-ke-size="size23">S 최적화: selection 단계 공격</h3>
<p data-end="6045" data-start="5939" data-ke-size="size16">S의 목적은 top-k 후보군 안에 들어간 악성 tool을 LLM이 최종 선택하게 만드는 것이다. 여기서도 Gradient-Free와 Gradient-Based 두 가지 방식이 사용된다.</p>
<h4 data-end="6067" data-start="6047" data-section-id="1jr05rh" data-ke-size="size20">Gradient-Free 방식</h4>
<p data-end="6255" data-start="6069" data-ke-size="size16">Gradient-Free 방식은 tree-of-attack 방식에서 영감을 받는다. 하나의 초기 S를 만든 뒤, attacker LLM이 여러 변형 문장을 생성한다. 이후 각 후보 S를 악성 tool document에 붙여 shadow LLM에게 실제 tool selection을 시켜보고 가장 성공률이 높은 후보만 남긴다.</p>
<p data-end="6268" data-start="6257" data-ke-size="size16">흐름은 다음과 같다.</p>
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
<pre class="routeros"><code>1. 초기 S0 준비
2. attacker LLM이 S 후보 여러 개 생성
3. 각 S를 악성 tool document에 삽입
4. shadow LLM이 tool selection 수행
5. 악성 tool을 선택한 횟수를 FLAG로 계산
6. 성공률이 높은 후보만 pruning
7. 남은 후보와 feedback을 기반으로 다시 변형
8. 반복 후 최적화된 S 선택</code></pre>
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
<p data-end="6628" data-start="6488" data-ke-size="size16">즉 Gradient-Free 방식은 LLM을 이용해 자연스러운 공격 문장을 만들고 shadow LLM의 선택 결과를 피드백으로 사용해 점점 더 잘 먹히는 문장을 남기는 방식이다.</p>
<h4 data-end="6651" data-start="6630" data-section-id="1v33aso" data-ke-size="size20">Gradient-Based 방식</h4>
<p data-end="6788" data-start="6653" data-ke-size="size16">Gradient-Based 방식은 shadow LLM의 gradient 정보를 사용해 S를 token sequence로 직접 최적화한다. 목표는 LLM이 최종 출력에서 악성 tool name인 dt_name을 선택하도록 만드는 것이다.</p>
<p data-end="6812" data-start="6790" data-ke-size="size16">논문에서는 세 가지 loss를 사용한다.</p>
<div>
<p data-ke-size="size16">&nbsp;</p>
<table style="border-collapse: collapse; width: 100%;" border="1" data-end="7012" data-start="6814" data-ke-align="alignLeft">
<tbody data-end="7012" data-start="6838">
<tr data-end="6902" data-start="6838">
<td data-col-size="sm" data-end="6855" data-start="6838">Alignment Loss</td>
<td data-col-size="md" data-end="6902" data-start="6855">LLM이 target output, 즉 악성 tool 선택 결과를 출력하게 함</td>
</tr>
<tr data-end="6954" data-start="6903">
<td data-col-size="sm" data-end="6922" data-start="6903">Consistency Loss</td>
<td data-col-size="md" data-end="6954" data-start="6922">특히 악성 tool name 자체를 출력하도록 강화</td>
</tr>
<tr data-end="7012" data-start="6955">
<td data-col-size="sm" data-end="6973" data-start="6955">Perplexity Loss</td>
<td data-col-size="md" data-end="7012" data-start="6973">공격 문장이 너무 부자연스럽지 않도록 readability 유지</td>
</tr>
</tbody>
</table>
</div>
<p data-end="7188" data-start="7014" data-ke-size="size16">Perplexity Loss가 들어가는 이유는 공격 문장이 너무 이상하면 PPL 기반 탐지에 걸릴 수 있기 때문이다. 따라서 공격 문장은 LLM을 속일 수 있어야 하면서도, 겉보기에는 정상적인 tool description처럼 보여야 한다.</p>
<p data-end="7479" data-start="7190" data-ke-size="size16">또한 논문은 position-adaptive optimization과 step-wise optimization도 사용한다. Position-adaptive optimization은 악성 tool document가 top-k 후보군 내 어느 위치에 놓이더라도 잘 선택되도록 하는 방식이고, step-wise optimization은 모든 task-retrieval pair를 한 번에 최적화하지 않고 점진적으로 추가해 최적화를 안정화하는 방식이다.</p>
<h2 data-end="7489" data-start="7481" data-section-id="o02jhk" data-ke-size="size26">실험 설정</h2>
<h4 data-end="7499" data-start="7491" data-section-id="hu6lh5" data-ke-size="size20">데이터셋</h4>
<p data-end="7524" data-start="7501" data-ke-size="size16">논문은 두 개의 dataset을 사용한다.</p>
<div>
<p data-ke-size="size16">&nbsp;</p>
<table style="border-collapse: collapse; width: 100%;" border="1" data-end="7806" data-start="7526" data-ke-align="alignLeft">
<tbody data-end="7806" data-start="7550">
<tr data-end="7665" data-start="7550">
<td style="width: 11.7442%;" data-col-size="sm" data-end="7561" data-start="7550">MetaTool</td>
<td style="width: 88.1395%;" data-col-size="lg" data-end="7665" data-start="7561">LLM의 tool usage 능력을 평가하는 benchmark. 21,127개 instance와 OpenAI Plugins 기반 199개 benign tool document 포함</td>
</tr>
<tr data-end="7806" data-start="7666">
<td style="width: 11.7442%;" data-col-size="sm" data-end="7678" data-start="7666">ToolBench</td>
<td style="width: 88.1395%;" data-col-size="lg" data-end="7806" data-start="7678">open-source LLM의 tool-use 능력 향상을 위한 benchmark. RapidAPI 기반 tool document를 사용하며, 중복과 빈 설명 제거 후 9,650개 benign tool document 사용</td>
</tr>
</tbody>
</table>
</div>
<p data-end="7990" data-start="7808" data-ke-size="size16">각 dataset마다 10개의 target task를 만들고, 각 target task마다 100개의 target task description을 생성한다. 따라서 dataset별로 총 1,000개의 target task description을 사용한다.</p>
<h4 data-end="8006" data-start="7992" data-section-id="jl0vqy" data-ke-size="size20">Target LLM</h4>
<p data-end="8037" data-start="8008" data-ke-size="size16">실험에서는 총 8개의 target LLM을 사용한다.</p>
<div>
<p data-ke-size="size16">&nbsp;</p>
<table style="border-collapse: collapse; width: 100%; height: 42px;" border="1" data-end="8232" data-start="8039" data-ke-align="alignLeft">
<tbody>
<tr style="height: 16px;" data-end="8232" data-start="8162">
<td style="height: 16px;" data-col-size="sm" data-end="8178" data-start="8162">Closed-source</td>
<td style="height: 16px;" data-col-size="md" data-end="8232" data-start="8178">Claude-3-Haiku, Claude-3.5-Sonnet, GPT-3.5, GPT-4o</td>
</tr>
<tr style="height: 16px;" data-end="8161" data-start="8061">
<td style="height: 16px;" data-col-size="sm" data-end="8075" data-start="8061">Open-source</td>
<td style="height: 16px;" data-col-size="md" data-end="8161" data-start="8075">Llama-2-7B-chat, Llama-3-8B-Instruct, Llama-3-70B-Instruct, Llama-3.3-70B-Instruct</td>
</tr>
</tbody>
</table>
</div>
<h4 data-end="8254" data-start="8234" data-section-id="g9rrjf" data-ke-size="size20">Target retriever</h4>
<p data-end="8284" data-start="8256" data-ke-size="size16">실험에서는 총 4개의 retriever를 사용한다.</p>
<div>
<p data-ke-size="size16">&nbsp;</p>
<table style="border-collapse: collapse; width: 100%;" border="1" data-end="8534" data-start="8286" data-ke-align="alignLeft">
<tbody data-end="8534" data-start="8315">
<tr data-end="8380" data-start="8315">
<td style="width: 24.186%;" data-col-size="sm" data-end="8340" data-start="8315">text-embedding-ada-002</td>
<td style="width: 75.6977%;" data-col-size="sm" data-end="8380" data-start="8340">OpenAI closed-source embedding model</td>
</tr>
<tr data-end="8419" data-start="8381">
<td style="width: 24.186%;" data-col-size="sm" data-end="8394" data-start="8381">Contriever</td>
<td style="width: 75.6977%;" data-col-size="sm" data-end="8419" data-start="8394">open-source retriever</td>
</tr>
<tr data-end="8473" data-start="8420">
<td style="width: 24.186%;" data-col-size="sm" data-end="8436" data-start="8420">Contriever-ms</td>
<td style="width: 75.6977%;" data-col-size="sm" data-end="8473" data-start="8436">MS MARCO로 fine-tuning된 Contriever</td>
</tr>
<tr data-end="8534" data-start="8474">
<td style="width: 24.186%;" data-col-size="sm" data-end="8493" data-start="8474">Sentence-BERT-tb</td>
<td style="width: 75.6977%;" data-col-size="sm" data-end="8534" data-start="8493">ToolBench로 fine-tuning된 Sentence-BERT</td>
</tr>
</tbody>
</table>
</div>
<p data-end="8679" data-start="8536" data-ke-size="size16">이 설정은 ToolHijacker가 특정 LLM이나 특정 retriever에서만 되는 공격인지 아니면 여러 model과 retriever 조합에서도 전이되는지를 확인하기 위한 것이다.</p>
<h4 data-end="8700" data-start="8681" data-section-id="1gibxwr" data-ke-size="size20">Attack settings</h4>
<p data-end="8860" data-start="8702" data-ke-size="size16">각 target task마다 공격자는 5개의 shadow task description을 사용한다. 또한 shadow retrieval tool set에는 4개의 shadow tool document를 넣고, 여기에 악성 tool document를 추가해 총 5개의 후보를 구성한다.</p>
<div>
<table style="border-collapse: collapse; width: 100%;" border="1" data-end="9113" data-start="8862" data-ke-align="alignLeft">
<tbody data-end="9113" data-start="8887">
<tr data-end="8951" data-start="8887">
<td data-col-size="sm" data-end="8903" data-start="8887">Gradient-Free</td>
<td data-col-size="md" data-end="8951" data-start="8903">attacker LLM과 shadow LLM 모두 Llama-3.3-70B 사용</td>
</tr>
<tr data-end="9028" data-start="8952">
<td data-col-size="sm" data-end="8969" data-start="8952">Gradient-Based</td>
<td data-col-size="md" data-end="9028" data-start="8969">shadow retriever는 Contriever, shadow LLM은 Llama-3-8B 사용</td>
</tr>
<tr data-end="9082" data-start="9029">
<td data-col-size="sm" data-end="9044" data-start="9029">Optimization</td>
<td data-col-size="md" data-end="9082" data-start="9044">R은 3 iterations, S는 400 iterations</td>
</tr>
<tr data-end="9113" data-start="9083">
<td data-col-size="sm" data-end="9089" data-start="9083">초기화</td>
<td data-col-size="md" data-end="9113" data-start="9089">R과 S 모두 자연어 문장으로 초기화</td>
</tr>
</tbody>
</table>
</div>
<p data-end="9250" data-start="9115" data-ke-size="size16">R과 S를 자연어 문장으로 초기화하는 이유는 최종 결과물이 실제 tool library에 올라갈 수 있는 정상적인 tool description처럼 보여야 하기 때문이다.</p>
<h4 data-end="9260" data-start="9252" data-section-id="qfz6i8" data-ke-size="size20">평가 지표</h4>
<p data-end="9280" data-start="9262" data-ke-size="size16">논문은 네 가지 지표를 사용한다.</p>
<div>
<table style="border-collapse: collapse; width: 100%;" border="1" data-end="9481" data-start="9282" data-ke-align="alignLeft">
<tbody data-end="9481" data-start="9304">
<tr data-end="9341" data-start="9304">
<td data-col-size="sm" data-end="9310" data-start="9304">ACC</td>
<td data-col-size="md" data-end="9341" data-start="9310">공격이 없을 때 정상 tool을 잘 선택하는 비율</td>
</tr>
<tr data-end="9376" data-start="9342">
<td data-col-size="sm" data-end="9348" data-start="9342">ASR</td>
<td data-col-size="md" data-end="9376" data-start="9348">공격 후 악성 tool을 최종 선택하는 비율</td>
</tr>
<tr data-end="9430" data-start="9377">
<td data-col-size="sm" data-end="9382" data-start="9377">HR</td>
<td data-col-size="md" data-end="9430" data-start="9382">공격이 없을 때 정상 tool이 retrieval top-k 안에 들어가는 비율</td>
</tr>
<tr data-end="9481" data-start="9431">
<td data-col-size="sm" data-end="9437" data-start="9431">AHR</td>
<td data-col-size="md" data-end="9481" data-start="9437">공격 후 악성 tool이 retrieval top-k 안에 들어가는 비율</td>
</tr>
</tbody>
</table>
</div>
<p data-end="9689" data-start="9483" data-ke-size="size16">여기서 ASR은 최종 공격 성공률이고, AHR은 retrieval 단계 공격이 성공했는지를 보여준다. ToolHijacker는 retrieval과 selection을 모두 공격한다고 주장하기 때문에, ASR만 높으면 부족하고 AHR도 함께 높아야 한다. 논문은 기본적으로 k = 5를 사용한다.</p>
<h2 data-end="9703" data-start="9691" data-section-id="icts91" data-ke-size="size26">평가 및 결과 해석</h2>
<h3 data-end="9730" data-start="9705" data-section-id="ococpp" data-ke-size="size23">1. 여러 LLM 비교</h3>
<p data-end="9792" data-start="9732" data-ke-size="size16">ToolHijacker는 8개 target LLM과 2개 dataset에서 전반적으로 높은 ASR을 보였다.</p>
<div><br />
<p data-ke-size="size16">&nbsp;</p>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="700" data-origin-height="180"><span data-url="https://blog.kakaocdn.net/dna/bifHNh/dJMcahxDUKc/AAAAAAAAAAAAAAAAAAAAAC8EMVzXhg1VL9AevGcjmvA1PPXHayB0Pni69uB5IIp6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=1InDFF0%2BlQcq8NlEbXVH7kv66A8%3D" data-phocus="https://blog.kakaocdn.net/dna/bifHNh/dJMcahxDUKc/AAAAAAAAAAAAAAAAAAAAAC8EMVzXhg1VL9AevGcjmvA1PPXHayB0Pni69uB5IIp6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=1InDFF0%2BlQcq8NlEbXVH7kv66A8%3D"><img src="https://blog.kakaocdn.net/dna/bifHNh/dJMcahxDUKc/AAAAAAAAAAAAAAAAAAAAAC8EMVzXhg1VL9AevGcjmvA1PPXHayB0Pni69uB5IIp6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=1InDFF0%2BlQcq8NlEbXVH7kv66A8%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbifHNh%2FdJMcahxDUKc%2FAAAAAAAAAAAAAAAAAAAAAC8EMVzXhg1VL9AevGcjmvA1PPXHayB0Pni69uB5IIp6%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D1InDFF0%252BlQcq8NlEbXVH7kv66A8%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="828" height="213" data-origin-width="700" data-origin-height="180"/></span></figure>
</div>
<p data-end="10786" data-start="10557" data-ke-size="size16">GPT-4o 기준으로 보면, Gradient-Free는 MetaTool에서 96.7%, ToolBench에서 88.2% ASR을 보였다. Gradient-Based도 MetaTool에서 92.2%, ToolBench에서 83.9% ASR을 보였다. 즉 shadow LLM과 target LLM이 달라도 공격이 잘 전이된다는 점이 핵심이다.</p>
<p data-end="11177" data-start="10788" data-ke-size="size16">또 하나 흥미로운 점은 Gradient-Free와 Gradient-Based가 모델 종류에 따라 장단점이 다르게 나타난다는 것이다. 논문에서는 Gradient-Free가 closed-source model에서 더 좋은 경향을 보였고, Gradient-Based는 open-source model에서 더 강한 경향을 보였다고 해석한다. 예를 들어 GPT-4o MetaTool에서는 Gradient-Free가 Gradient-Based보다 4.5% 높았고, Claude-3.5-Sonnet ToolBench에서는 8.4% 높았다. 반대로 Llama-3-8B ToolBench에서는 Gradient-Based가 16% 더 높았다.</p>
<h3 data-end="11211" data-start="11179" data-section-id="1ingmyu" data-ke-size="size23">2. Retrieval 단계</h3>
<p data-end="11301" data-start="11213" data-ke-size="size16">ToolHijacker는 최종 선택만 잘 되는 것이 아니라, retrieval 단계에서도 악성 tool document가 안정적으로 top-k 안에 들어갔다.</p>
<div>
<div><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="758" data-origin-height="255"><span data-url="https://blog.kakaocdn.net/dna/Sq9dY/dJMcad20Gho/AAAAAAAAAAAAAAAAAAAAAAUZc8GkXFo1pFU3QanzfbJ2shV-g6lqDwZCgSD06PzC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=8aVKTMfkbqZeSE22kK3oxNOaqJg%3D" data-phocus="https://blog.kakaocdn.net/dna/Sq9dY/dJMcad20Gho/AAAAAAAAAAAAAAAAAAAAAAUZc8GkXFo1pFU3QanzfbJ2shV-g6lqDwZCgSD06PzC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=8aVKTMfkbqZeSE22kK3oxNOaqJg%3D"><img src="https://blog.kakaocdn.net/dna/Sq9dY/dJMcad20Gho/AAAAAAAAAAAAAAAAAAAAAAUZc8GkXFo1pFU3QanzfbJ2shV-g6lqDwZCgSD06PzC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=8aVKTMfkbqZeSE22kK3oxNOaqJg%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FSq9dY%2FdJMcad20Gho%2FAAAAAAAAAAAAAAAAAAAAAAUZc8GkXFo1pFU3QanzfbJ2shV-g6lqDwZCgSD06PzC%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D8aVKTMfkbqZeSE22kK3oxNOaqJg%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="758" height="255" data-origin-width="758" data-origin-height="255"/></span></figure>
</div>
</div>
<p data-end="11690" data-start="11465" data-ke-size="size16">이 결과는 R 최적화가 실제로 동작한다는 것을 보여준다. 즉 악성 tool이 LLM에게 선택되기 전에, 먼저 retriever 단계에서 후보군 안에 안정적으로 들어가는 것이다. ToolBench는 tool library가 9,650개로 훨씬 크기 때문에 MetaTool보다 AHR이 조금 낮지만, 그래도 96% 이상을 유지한다.</p>
<h3 data-end="11720" data-start="11692" data-section-id="vy1or9" data-ke-size="size23">3. 기존 baseline 비교</h3>
<p data-end="11788" data-start="11722" data-ke-size="size16">논문은 GPT-4o 기준으로 ToolHijacker를 기존 prompt injection baseline들과 비교했다.</p>
<div>
<div>DatasetNaiveEscape CharactersContext IgnoreFake CompletionCombined AttackJudgeDeceiverPoisonedRAGGradient-FreeGradient-Based
<table style="border-collapse: collapse; width: 100%;" border="1" data-end="12164" data-start="11790" data-ke-align="alignLeft">
<tbody data-end="12164" data-start="11997">
<tr data-end="12078" data-start="11997">
<td data-col-size="sm" data-end="12008" data-start="11997">MetaTool</td>
<td data-end="12015" data-start="12008" data-col-size="sm">6.0%</td>
<td data-end="12023" data-start="12015" data-col-size="sm">28.2%</td>
<td data-end="12030" data-start="12023" data-col-size="sm">1.2%</td>
<td data-end="12038" data-start="12030" data-col-size="sm">14.5%</td>
<td data-end="12045" data-start="12038" data-col-size="sm">9.7%</td>
<td data-end="12053" data-start="12045" data-col-size="sm">30.2%</td>
<td data-end="12061" data-start="12053" data-col-size="sm">39.3%</td>
<td data-end="12069" data-start="12061" data-col-size="sm">96.7%</td>
<td data-end="12078" data-start="12069" data-col-size="sm">92.2%</td>
</tr>
<tr data-end="12164" data-start="12079">
<td data-col-size="sm" data-end="12091" data-start="12079">ToolBench</td>
<td data-end="12099" data-start="12091" data-col-size="sm">24.8%</td>
<td data-end="12107" data-start="12099" data-col-size="sm">24.6%</td>
<td data-end="12115" data-start="12107" data-col-size="sm">11.3%</td>
<td data-end="12123" data-start="12115" data-col-size="sm">23.0%</td>
<td data-end="12131" data-start="12123" data-col-size="sm">11.7%</td>
<td data-end="12139" data-start="12131" data-col-size="sm">26.4%</td>
<td data-end="12147" data-start="12139" data-col-size="sm">58.3%</td>
<td data-end="12155" data-start="12147" data-col-size="sm">88.2%</td>
<td data-end="12164" data-start="12155" data-col-size="sm">83.9%</td>
</tr>
</tbody>
</table>
</div>
</div>
<p data-end="12429" data-start="12166" data-ke-size="size16">가장 강한 baseline은 PoisonedRAG였지만, MetaTool에서 39.3%, ToolBench에서 58.3%에 그쳤다. 반면 ToolHijacker는 MetaTool에서 96.7% / 92.2%, ToolBench에서 88.2% / 83.9%를 기록했다. 이는 기존 prompt injection 방식이 tool selection의 2단계 구조를 제대로 반영하지 못한다는 점을 보여준다.</p>
<h3 data-end="12466" data-start="12431" data-section-id="19605ra" data-ke-size="size23">4. Target retriever가 달라지면?</h3>
<p data-end="12500" data-start="12468" data-ke-size="size16">논문은 retriever를 바꿔가며 공격 성능을 확인했다.</p>
<div><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="435" data-origin-height="191"><span data-url="https://blog.kakaocdn.net/dna/TSw3s/dJMcadonU0E/AAAAAAAAAAAAAAAAAAAAAB0Xha_hXn-z7kA11cu-L1kZYb_riKuGGWeHqcW6wetl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=GAWicIujE8bMVzd9QMKGqBHA9eo%3D" data-phocus="https://blog.kakaocdn.net/dna/TSw3s/dJMcadonU0E/AAAAAAAAAAAAAAAAAAAAAB0Xha_hXn-z7kA11cu-L1kZYb_riKuGGWeHqcW6wetl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=GAWicIujE8bMVzd9QMKGqBHA9eo%3D"><img src="https://blog.kakaocdn.net/dna/TSw3s/dJMcadonU0E/AAAAAAAAAAAAAAAAAAAAAB0Xha_hXn-z7kA11cu-L1kZYb_riKuGGWeHqcW6wetl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=GAWicIujE8bMVzd9QMKGqBHA9eo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FTSw3s%2FdJMcadonU0E%2FAAAAAAAAAAAAAAAAAAAAAB0Xha_hXn-z7kA11cu-L1kZYb_riKuGGWeHqcW6wetl%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DGAWicIujE8bMVzd9QMKGqBHA9eo%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="435" height="191" data-origin-width="435" data-origin-height="191"/></span></figure>
</div>
<p data-end="13148" data-start="12854" data-ke-size="size16">Gradient-Free는 모든 retriever에서 100% AHR, 99% ASR을 보였다. Gradient-Based도 모든 retriever에서 100% AHR을 보였고, open-source retriever에서는 100% ASR을 달성했다.</p>
<p data-end="13148" data-start="12854" data-ke-size="size16">text-embedding-ada-002에서는 ASR이 95%로 조금 낮았는데, 이는 악성 tool이 검색되더라도 순위가 낮아지면 최종 selection에서 선택될 가능성이 줄어들기 때문이라고 해석된다.</p>
<h3 data-end="13164" data-start="13150" data-section-id="yemhi7" data-ke-size="size23">5. R과 S의 영향</h3>
<p data-end="13204" data-start="13166" data-ke-size="size16">논문은 R &oplus; S, R only, S only를 비교했다.</p>
<div><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="437" data-origin-height="141"><span data-url="https://blog.kakaocdn.net/dna/m6YcJ/dJMcafmiohn/AAAAAAAAAAAAAAAAAAAAAO8xQVrxwkDAWRFRPxI6KH-hdD7JCqN9GPCy00A8mZfG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=X0XzgyVpoWqJFPMWhnwExDOfA2A%3D" data-phocus="https://blog.kakaocdn.net/dna/m6YcJ/dJMcafmiohn/AAAAAAAAAAAAAAAAAAAAAO8xQVrxwkDAWRFRPxI6KH-hdD7JCqN9GPCy00A8mZfG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=X0XzgyVpoWqJFPMWhnwExDOfA2A%3D"><img src="https://blog.kakaocdn.net/dna/m6YcJ/dJMcafmiohn/AAAAAAAAAAAAAAAAAAAAAO8xQVrxwkDAWRFRPxI6KH-hdD7JCqN9GPCy00A8mZfG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=X0XzgyVpoWqJFPMWhnwExDOfA2A%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fm6YcJ%2FdJMcafmiohn%2FAAAAAAAAAAAAAAAAAAAAAO8xQVrxwkDAWRFRPxI6KH-hdD7JCqN9GPCy00A8mZfG%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DX0XzgyVpoWqJFPMWhnwExDOfA2A%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="437" height="141" data-origin-width="437" data-origin-height="141"/></span></figure>
<br />
<p data-ke-size="size16">&nbsp;</p>
</div>
<p data-end="13754" data-start="13441" data-ke-size="size16">이 결과가 가장 중요하다고 볼 수 있다. R only는 AHR이 100%여도 ASR이 거의 0~5%밖에 나오지 않는다. 즉 악성 tool이 후보군에 들어가도 LLM이 선택하지 않으면 공격은 실패한다. 반대로 S only는 selection을 유도하는 정보가 있어도 retrieval 단계에서 후보군에 제대로 들어가지 못하거나, 들어가더라도 전체 공격 성공률이 낮다.</p>
<p data-end="13754" data-start="13441" data-ke-size="size16">결국 ToolHijacker가 강한 이유는 R과 S를 분리해서 각각 최적화하고, 마지막에 결합하기 때문이다.</p>
<h3 data-end="13776" data-start="13756" data-section-id="hg4h62" data-ke-size="size23">6. Shadow LLM의 영향</h3>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="863" data-origin-height="256"><span data-url="https://blog.kakaocdn.net/dna/cdKvGO/dJMcajoAIhQ/AAAAAAAAAAAAAAAAAAAAAGlRK8v59n1wnEBp9Qo4Fo9SN-SzphCYFiZH7kZf60lf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=g4AfK3bUDEheHxHV44dAG7ciq14%3D" data-phocus="https://blog.kakaocdn.net/dna/cdKvGO/dJMcajoAIhQ/AAAAAAAAAAAAAAAAAAAAAGlRK8v59n1wnEBp9Qo4Fo9SN-SzphCYFiZH7kZf60lf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=g4AfK3bUDEheHxHV44dAG7ciq14%3D"><img src="https://blog.kakaocdn.net/dna/cdKvGO/dJMcajoAIhQ/AAAAAAAAAAAAAAAAAAAAAGlRK8v59n1wnEBp9Qo4Fo9SN-SzphCYFiZH7kZf60lf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=g4AfK3bUDEheHxHV44dAG7ciq14%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcdKvGO%2FdJMcajoAIhQ%2FAAAAAAAAAAAAAAAAAAAAAGlRK8v59n1wnEBp9Qo4Fo9SN-SzphCYFiZH7kZf60lf%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Dg4AfK3bUDEheHxHV44dAG7ciq14%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="863" height="256" data-origin-width="863" data-origin-height="256"/></span></figure>
</p>
<p data-end="13811" data-start="13778" data-ke-size="size16">논문은 shadow LLM을 바꿔가며 공격 성능도 확인했다.</p>
<p data-end="13948" data-start="13813" data-ke-size="size16">Gradient-Free에서는 8개의 LLM을 shadow LLM으로 사용했고, Gradient-Based에서는 Llama-2-7B와 Llama-3-8B를 비교했다. 결과적으로 더 강한 shadow LLM을 사용할수록 평균 ASR이 올라갔다.</p>
<p data-end="14332" data-start="13950" data-ke-size="size16">Gradient-Free에서 Claude-3.5-Sonnet을 shadow LLM으로 사용했을 때 평균 ASR은 99.50%였다. Llama-2-7B를 shadow LLM으로 사용했을 때도 평균 ASR은 95.13%로 높았다. 즉 Gradient-Free는 shadow LLM이 바뀌어도 비교적 안정적이었다. 반면 Gradient-Based는 Llama-2-7B를 shadow LLM으로 썼을 때 평균 ASR이 81.38%였고, Llama-3-8B를 사용했을 때 96.50%로 크게 올라갔다. 이는 Gradient-Based가 특정 shadow LLM의 gradient 정보에 더 의존하기 때문으로 볼 수 있다.</p>
<h3 data-end="14361" data-start="14334" data-section-id="w0cuht" data-ke-size="size23">7. Similarity metric의 영향</h3>
<p data-end="14425" data-start="14363" data-ke-size="size16">Retrieval 단계에서 cosine similarity를 쓰는지, dot product를 쓰는지도 비교했다.</p>
<div><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="391" data-origin-height="149"><span data-url="https://blog.kakaocdn.net/dna/bnXWpJ/dJMb990HpO5/AAAAAAAAAAAAAAAAAAAAAIxmXZigwJMb0d8OnjEnklmAl-WLTmGOv2nOfNDyq8dt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=%2BfwowPBbhRM7Nebx3Z9yVfKPaRU%3D" data-phocus="https://blog.kakaocdn.net/dna/bnXWpJ/dJMb990HpO5/AAAAAAAAAAAAAAAAAAAAAIxmXZigwJMb0d8OnjEnklmAl-WLTmGOv2nOfNDyq8dt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=%2BfwowPBbhRM7Nebx3Z9yVfKPaRU%3D"><img src="https://blog.kakaocdn.net/dna/bnXWpJ/dJMb990HpO5/AAAAAAAAAAAAAAAAAAAAAIxmXZigwJMb0d8OnjEnklmAl-WLTmGOv2nOfNDyq8dt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=%2BfwowPBbhRM7Nebx3Z9yVfKPaRU%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbnXWpJ%2FdJMb990HpO5%2FAAAAAAAAAAAAAAAAAAAAAIxmXZigwJMb0d8OnjEnklmAl-WLTmGOv2nOfNDyq8dt%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D%252BfwowPBbhRM7Nebx3Z9yVfKPaRU%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="391" height="149" data-origin-width="391" data-origin-height="149"/></span></figure>

<p data-ke-size="size16">&nbsp;</p>
</div>
<p data-end="14834" data-start="14616" data-ke-size="size16">결과적으로 similarity metric이 달라져도 AHR은 모두 100%였다. Dot product에서는 Gradient-Based ASR이 2% 정도 더 높게 나왔지만, 전체적으로는 큰 차이가 없었다. 이는 R 최적화가 특정 similarity function 하나에만 과하게 의존하지 않는다는 것을 보여준다.</p>
<h3 data-end="14865" data-start="14836" data-section-id="1bvzjm0" data-ke-size="size23">8. 악성 tool document 개수의 영향</h3>
<p data-end="14975" data-start="14867" data-ke-size="size16">논문은 악성 tool document를 하나만 넣는 경우와 두 개 넣는 경우도 비교했다. 여기서는 shadow tool document가 부족한 상황을 보기 위해 작은 k&prime; 설정을 사용했다.</p>
<p data-end="14989" data-start="14977" data-ke-size="size16">두 가지 설정이 있다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="698" data-origin-height="393"><span data-url="https://blog.kakaocdn.net/dna/cuMRgV/dJMcahdksg2/AAAAAAAAAAAAAAAAAAAAAKEEAVugWBpRNe51VlWUOIiG875n3JIaLS9tO7JC4uz-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yb4t0wLnApFhUloiOyD09E7IMuA%3D" data-phocus="https://blog.kakaocdn.net/dna/cuMRgV/dJMcahdksg2/AAAAAAAAAAAAAAAAAAAAAKEEAVugWBpRNe51VlWUOIiG875n3JIaLS9tO7JC4uz-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yb4t0wLnApFhUloiOyD09E7IMuA%3D"><img src="https://blog.kakaocdn.net/dna/cuMRgV/dJMcahdksg2/AAAAAAAAAAAAAAAAAAAAAKEEAVugWBpRNe51VlWUOIiG875n3JIaLS9tO7JC4uz-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yb4t0wLnApFhUloiOyD09E7IMuA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcuMRgV%2FdJMcahdksg2%2FAAAAAAAAAAAAAAAAAAAAAKEEAVugWBpRNe51VlWUOIiG875n3JIaLS9tO7JC4uz-%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Dyb4t0wLnApFhUloiOyD09E7IMuA%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="698" height="393" data-origin-width="698" data-origin-height="393"/></span></figure>
</p>
<p data-end="15338" data-start="15124" data-ke-size="size16">결과적으로 악성 tool document 수가 늘어나면 공격 성능이 더 좋아졌다. 특히 k = 5에서 악성 tool을 2개 넣으면 Gradient-Free와 Gradient-Based 모두 ASR이 24% 증가했다. Unified 설정에서는 k가 커질수록 ASR과 AHR이 거의 100%에 가깝게 유지되었다.</p>
<h2 data-end="15361" data-start="15340" data-section-id="intayw" data-ke-size="size26">9. 방어 평가: 예방 기반 방어</h2>
<p data-end="15399" data-start="15363" data-ke-size="size16">논문은 예방 기반 방어로 StruQ와 SecAlign을 평가했다.</p>
<div><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="407" data-origin-height="288"><span data-url="https://blog.kakaocdn.net/dna/eCcpvQ/dJMb997qLJw/AAAAAAAAAAAAAAAAAAAAAM4Dx1TuyQ81bLyYL1cs_eDIjhZ52-O79PQvubW5mOWN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=PVkRvQ3oL%2F%2B0ztWLXxPDWwAQV%2BA%3D" data-phocus="https://blog.kakaocdn.net/dna/eCcpvQ/dJMb997qLJw/AAAAAAAAAAAAAAAAAAAAAM4Dx1TuyQ81bLyYL1cs_eDIjhZ52-O79PQvubW5mOWN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=PVkRvQ3oL%2F%2B0ztWLXxPDWwAQV%2BA%3D"><img src="https://blog.kakaocdn.net/dna/eCcpvQ/dJMb997qLJw/AAAAAAAAAAAAAAAAAAAAAM4Dx1TuyQ81bLyYL1cs_eDIjhZ52-O79PQvubW5mOWN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=PVkRvQ3oL%2F%2B0ztWLXxPDWwAQV%2BA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FeCcpvQ%2FdJMb997qLJw%2FAAAAAAAAAAAAAAAAAAAAAM4Dx1TuyQ81bLyYL1cs_eDIjhZ52-O79PQvubW5mOWN%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DPVkRvQ3oL%252F%252B0ztWLXxPDWwAQV%252BA%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="407" height="288" data-origin-width="407" data-origin-height="288"/></span></figure>

<p data-ke-size="size16">&nbsp;</p>
</div>
<p data-end="16192" data-start="15866" data-ke-size="size16">StruQ는 instruction과 data를 분리해 data 안의 명령을 무시하도록 만드는 방식이고, SecAlign은 prompt injection이 포함된 입력에서도 안전한 응답을 선호하도록 fine-tuning하는 방식이다. 하지만 ToolHijacker는 이 방어들을 대부분 우회했다. 특히 StruQ 환경에서도 Gradient-Free 공격은 MetaTool에서 99.6% ASR을 보였다. SecAlign은 StruQ보다 조금 더 낮은 ASR을 보였지만 여전히 84.6~97.5% 수준으로 높았다.</p>
<p data-end="16336" data-start="16194" data-ke-size="size16">이 결과는 ToolHijacker의 악성 tool document가 노골적인 공격 명령처럼 보이지 않고 target task와 의미적으로 연결된 tool description 형태를 유지하기 때문에 기존 예방 기반 방어가 충분하지 않다는 것을 보여준다.</p>
<h3 data-end="16360" data-start="16338" data-section-id="vv17nl" data-ke-size="size23">10. 방어 평가: 탐지 기반 방어</h3>
<p data-end="16428" data-start="16362" data-ke-size="size16">탐지 기반 방어로는 Known-answer detection, DataSentinel, PPL, PPL-W를 평가했다.</p>
<div><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="462" data-origin-height="185"><span data-url="https://blog.kakaocdn.net/dna/3wsQw/dJMcafNn8Do/AAAAAAAAAAAAAAAAAAAAAI_8JjyRFuUT_vY7AH1WNJyCarVPRm-yf5DVvuFPYHWL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=jltd0LAmIUFRgcgfbUoVAOeC%2Bq4%3D" data-phocus="https://blog.kakaocdn.net/dna/3wsQw/dJMcafNn8Do/AAAAAAAAAAAAAAAAAAAAAI_8JjyRFuUT_vY7AH1WNJyCarVPRm-yf5DVvuFPYHWL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=jltd0LAmIUFRgcgfbUoVAOeC%2Bq4%3D"><img src="https://blog.kakaocdn.net/dna/3wsQw/dJMcafNn8Do/AAAAAAAAAAAAAAAAAAAAAI_8JjyRFuUT_vY7AH1WNJyCarVPRm-yf5DVvuFPYHWL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=jltd0LAmIUFRgcgfbUoVAOeC%2Bq4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F3wsQw%2FdJMcafNn8Do%2FAAAAAAAAAAAAAAAAAAAAAI_8JjyRFuUT_vY7AH1WNJyCarVPRm-yf5DVvuFPYHWL%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Djltd0LAmIUFRgcgfbUoVAOeC%252Bq4%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="462" height="185" data-origin-width="462" data-origin-height="185"/></span></figure>

<p data-ke-size="size16">&nbsp;</p>
</div>
<p data-end="16842" data-start="16672" data-ke-size="size16">탐지 결과도 전반적으로 좋지 않았다. Known-answer detection과 DataSentinel은 대부분의 악성 tool document를 놓쳤고, PPL과 PPL-W도 Gradient-Free 공격에는 거의 대응하지 못했다.</p>
<h2 data-end="17490" data-start="17484" data-section-id="1hdeqz1" data-ke-size="size26">한계점</h2>
<p data-end="17638" data-start="17492" data-ke-size="size16">이 논문은 controlled environment에서 실험을 진행했다. 따라서 실제 공개 tool platform이나 실제 production Agent 환경에서의 배포, 검수, ranking, 권한 승인, 사용자 승인 절차까지 모두 반영했다고 보기는 어렵다.</p>
<p data-end="17940" data-start="17640" data-ke-size="size16">또한 공격 초점은 주로 tool selection에 있다. 실제 Agent에서는 tool selection 이후 tool calling이 이어진다. 즉 악성 tool을 선택하게 만드는 것에서 끝나는 것이 아니라, 실제 tool call 인자 조작, 권한 남용, 결과 변조까지 이어지는 end-to-end 공격은 후속 연구로 남아 있다. 논문도 향후 연구로 tool selection과 tool calling을 함께 공격하는 방향과 새로운 방어 전략 개발을 언급한다.</p>
<p data-end="18158" data-start="17942" data-ke-size="size16">그리고 악성 tool document를 여러 개 삽입하면 성능이 올라가지만, 실제 환경에서는 여러 악성 tool을 올리는 행위 자체가 platform moderation이나 review process에서 탐지될 가능성도 있다. 따라서 실제 공격 가능성을 보려면 tool hub의 검수 구조, Agent의 tool approval 방식, permission model까지 함께 봐야 한다.</p>
<h2 data-end="18181" data-start="18160" data-section-id="uldj0y" data-ke-size="size26">내가 궁금했던 점 / 비판적 관점 / 느낀점.</h2>
<p data-start="18741" data-end="18922" data-ke-size="size16"><br />이 논문을 통해 Agent 보안에서 중요한 공격 지점이 LLM의 답변 생성만이 아니라는 점을 알 수 있었다. Agent는 외부 도구를 검색하고 선택하고 호출한다. 따라서 공격자는 LLM의 최종 응답뿐만 아니라 그 전에 있는 tool document, retrieval 결과, selection 기준까지 조작할 수 있다.</p>
<p data-start="18924" data-end="19124" data-ke-size="size16">특히 tool document는 겉보기에는 단순한 설명문이지만 Agent 입장에서는 tool을 선택하는 근거가 된다. 이 설명문이 조작되면 Agent의 행동 경로 자체가 바뀔 수 있다. 앞으로 MCP, plugin, agent framework처럼 외부 tool을 연결하는 구조가 많아질수록, tool selection 단계의 보안은 더 중요해질 것 같다.</p>
<p data-start="18924" data-end="19124" data-ke-size="size16">&nbsp;</p>
<p data-end="18730" data-start="18577" data-ke-size="size16">내가 논문을 읽기 전에 궁금했던 점은 기존에 있는 프롬프트 인젝션, 간접 프롬프트 인젝션과 어떤 차이점이 있는지가 궁금했는데 해당 부분은 잘 풀린 것 같다. 비판적 관점으로는 tool document를 정교하게 짜고, 또 악성 tool을 선택을 하게 만들어야 한다는 것. 이렇게 2중 구조로 되어있는 것 자체가 실제 공격에서는 힘들 것 같다.&nbsp;</p>
<p data-end="18730" data-start="18577" data-ke-size="size16">&nbsp;</p>
<p data-end="18730" data-start="18577" data-ke-size="size16">또한 최신 모델과 같은 경우에는 보안 관점에서 더욱더 높은 체계를 구축하였다. 실제로 gpt, claude와 같은 경우 조금이라도 보안적인 질문을 던진다면 바로 막을텐데 지금 있는 이 논문의 공격 방식도 통할까? 의문이 든다.</p>
<h2 data-end="19137" data-start="19126" data-section-id="na0ic0" data-ke-size="size26">앞으로 해볼 것</h2>
<p data-end="19172" data-start="19139" data-ke-size="size16">이 논문을 바탕으로 다음과 같은 내용을 더 확인해보고 싶다.</p>
<ol style="list-style-type: decimal;" data-end="19671" data-start="19174" data-ke-list-type="decimal">
<li data-end="19226" data-start="19174" data-section-id="1dtrtp2">최신 frontier model에서도 ToolHijacker가 동일하게 통하는지 확인</li>
<li data-end="19294" data-start="19227" data-section-id="gzv1zc">Agent의 plan mode, auto mode, approve mode에 따라 공격 성공률이 달라지는지 비교</li>
<li data-end="19356" data-start="19295" data-section-id="jhdibk">MCP server나 plugin 환경에서 tool description 조작이 실제로 가능한지 확인</li>
<li data-end="19441" data-start="19357" data-section-id="1dng4n9">tool document 검증, allowlist, permission 분리 같은 harness engineering으로 방어가 가능한지 실험</li>
<li data-end="19508" data-start="19442" data-section-id="10vqmuf">tool selection뿐 아니라 tool calling까지 이어지는 end-to-end 공격 시나리오 재현</li>
<li data-end="19585" data-start="19509" data-section-id="i6lp5i">StruQ, SecAlign, DataSentinel 같은 기존 방어가 왜 tool selection 공격에는 약한지 추가 분석</li>
<li data-end="19671" data-start="19586" data-section-id="hjp3h">benign tool document와 malicious tool document를 구분할 수 있는 새로운 detection feature 탐색</li>
</ol>
<p data-end="19809" data-start="19673" data-ke-size="size16">최종적으로 이 논문은 단순히 prompt injection 공격을 하나 더 제안한 논문이라기보다는 LLM Agent가 외부 tool을 신뢰하고 선택하는 구조 자체가 새로운 공격 표면이 될 수 있다는 점을 보여준 논문이라고 볼 수 있다.</p>