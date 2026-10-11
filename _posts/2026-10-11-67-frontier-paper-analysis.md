---
layout: post
title: 논문 분석
date: 2026-10-11
desc: "IsolateGPT(NDSS 2025)를 중심으로 선행 연구 InjecAgent·Agent Smith와 후속 연구 ACE·ACIArena까지 LLM Agent 보안 연구 흐름 분석"
keywords: "IsolateGPT, InjecAgent, Agent Smith, ACE, ACIArena, LLM Agent, Prompt Injection, Indirect Prompt Injection, Multi-Agent System, 실행 격리, NDSS 2025, 논문, 프론티어, AI 보안"
categories: [Paper-Conference]
tags: [논문, 프론티어, AI 보안]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/67](https://sanghole.tistory.com/67)

<p data-ke-size="size16"> </p>
<p data-ke-size="size16">중심 논문 하나, 해당 중심 논문에 대한 선행 연구 2개, 중심 논문에 대한 추후 논문 2개를 골라서 분석하기 위해 중심 논문은 IsolateGPT이다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">중심 논문 요약</h3>
<p data-ke-size="size16">IsolagetGPT는 NDSS 2025에 나온 논문으로 신뢰할 수 없는 외부 앱이 다른 앱이나 시스템의 데이터에 함부로 접근하지 못하도록 앱별 실행 환경을 격리하고 앱 간 상호작용을 통제하는 보안 아키텍처를 제안한다. 이로써 악성 입력을 LLM이 완벽하게 거부하지 못하더라도 시스템의 실행 격리로 피해 범위를 제한할 수 있다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">논문 선정 이유 및 분석 방향</h4>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>IsolateGPT를 중심 논문으로 선정하여, </span><span>LLM Agent에서 발생하는 보안 위협이 어떻게 발견되었고, 이를 해결하기 위한 방어 기술이 어떤 방향으로 발전해 왔는지</span><span> 분석하고자 한다.</span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<p data-ke-size="size16"><span>먼저 선행 연구인 InjecAgent와 Agent Smith를 통해 외부 데이터에 포함된 악성 명령이 Agent의 행동을 조작하거나, 여러 Agent 사이에서 전파될 수 있다는 문제를 살펴본다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>이후 이러한 보안 위협을 시스템 수준에서 해결하려는 IsolateGPT의 핵심 아이디어와 실행 격리 아키텍처를 분석하고, 기존 연구의 한계를 어떻게 보완했는지 확인한다.</span></p>
<p data-ke-size="size16"><span>마지막으로 후속 연구인 ACE와 연관 연구인 ACIArena를 살펴본다. ACE를 통해 IsolateGPT의 실행 격리 구조에도 남아 있는 보안 취약점과 개선 방안을 분석하고, ACIArena를 통해 연구 범위를 Multi-Agent System(MAS)으로 확장하여 에이전트 간 협업 과정에서 발생하는 연쇄적 공격과 보안 평가 문제를 살펴보고자 한다.</span></p>
<p data-ke-size="size16"><span>이를 바탕으로 </span><span>LLM Agent 보안 연구가 개별 Agent의 취약성 분석에서 시스템 수준의 실행 격리와 MAS의 상호작용 보안으로 어떻게 확장되고 있는지</span><span> 연구 흐름을 정리하고, 향후 필요한 보안 기술과 연구 방향을 고찰하고자 한다.</span></p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">5장의 논문을 하나의 페이지로 요약하기 위해서는</h4>
<p data-ke-size="size16">요약을 하기 위한 틀이 명확해야 한다. 일단 선행 연구에 대해서는 기존 연구에서는 원래 어떤 것들을 연구 했고, 그리고 해당 연구에서 부족한 점이 뭔지 파악하고 선행 연구에서는 해당 문제점을 어떻게 해쳐나갔으며 어떤 한계점을 가졌는지 본다</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">중심 논문에서는 해당 한계점들을 고쳤거나, 선행 연구들의 연구들을 어떻게 이어나갔으며 선행 연구와 마찬가지로 어떤 문제점을 어떻게 해결했고 어떻게 한계점이 있는지 파악한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">후속 연구 2편도 마찬가지로 중심 논문에서 어떻게 발전했고 등을 파악한다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">선행 연구 2편</h3>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>선행 연구에서는 LLM Agent와 Multi-Agent System에서 어떤 보안 문제가 제기되었는지 살펴본다.</span></p>
<p data-ke-size="size16"><span>특히 기존 연구가 다루지 못했던 문제를 각 논문이 어떻게 보완했으며, 어떤 한계가 남았는지 분석한다. 이를 통해 중심 논문인 IsolateGPT가 등장하게 된 배경과 필요성을 파악하고자 한다.</span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23"><span>InjecAgent (ACL Findings 2024)</span></h3>
<p data-ke-size="size16"><span><span>논문명:</span></span> <span><span>INJECAGENT: </span><span>Benchmarking </span><span>Indirect </span><span>Prompt </span><span>Injections </span><span>in </span><span>Tool-Integrated </span><span>Large </span><span>Language </span><span>Model </span><span>Agents</span></span> <span>(2024)</span></p>
<p data-ke-size="size16"><span><span>저자:</span></span> <span>Qiusi </span><span>Zhan, </span><span>Zhixiang </span><span>Liang, </span><span>Zifan </span><span>Ying, </span><span>Daniel </span><span>Kang</span></p>
<p data-ke-size="size16"><span>논문 원문 : <a href="https://arxiv.org/pdf/2403.02691" rel="noopener noreferrer" target="_blank">https://arxiv.org/pdf/2403.02691</a></span></p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">1. 연구 배경 및 핵심 문제</h4>
<p data-ke-size="size16">기존 LLM은 주로 사용자가 입력한 질문에 텍스트로 응답하는 역할을 수행했다. 그러나 LLM Agent가 등장하면서 이메일 확인, 웹사이트 검색, 금융 거래, 스마트홈 제어 등 외부 도구를 활용해 실제 행동을 수행할 수 있게 되었다. 그러나 이러한 기능들은 LLM의 활용 범위를 확장하면서 새로운 보안 문제를 발생시켰다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">외부 도구가 반환한 데이터에 악의적인 명령이 포함되어 있을 때, LLM AGent가 이를 단순한 데이터가 아니라 실행해야 하는 명령으로 해석할 수 있다는 것!</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">논문에서는 이를 간접 프롬프트 인젝션인 IPI라고 소개하며 예시를 들면 사용자가 의료 서비스에서 의사에 대한 리뷰를 조회하도록 요청하면 공격자가 리뷰 내용에 예약을 지시하는 문구를 삽입하여 실제 AI가 동의 없이 예약을 한다는 것 이다.</p>
<h4 data-ke-size="size20">2. 선행 연구 분석</h4>
<p data-ke-size="size16">기존 연구에서는 어떤 부분들을 다뤘다고 했을까?</p>
<p data-ke-size="size16">기존 LLM은 텍스트 생성과 추론에는 강점을 보이지만 외부 시스템과 직접 상호작용하거나 복잡한 작업을 수행하는 능력에는 한계가 있었다. 이를 해결하기 위해 LLM에 외부 도구를 연결하고 상황에 맞는 도구를 선택하여 실행하도록 하는 연구가 진행되었었는데 예시는 다음과 같다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">LLM Agent 및 도구 사용 연</h4>
<p data-ke-size="size16"> </p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>
<div>
<div>
<p data-ke-size="size16"><span><span>ReAct </span><span>(Yao </span><span>et </span><span>al., </span><span>2022):</span></span> <span>추론(Reasoning)과 </span><span>행동(Acting)을 </span><span>번갈아 </span><span>수행하는 </span><span>구조를 </span><span>제안하여 </span><span>LLM이 </span><span>도구를 </span><span>활용해 </span><span>문제를 </span><span>해결하도록 </span><span>했다.</span></p>
</div>
</div>
</li>
<li>
<div>
<div>
<p data-ke-size="size16"><span><span>Toolformer, </span><span>Gorilla, </span><span>ToolLLM </span><span>(2023):</span></span> <span>도구 </span><span>호출 </span><span>사례를 </span><span>학습시켜 </span><span>LLM이 </span><span>API를 </span><span>선택하고 </span><span>필요한 </span><span>매개변수를 </span><span>생성하도록 </span><span>했다.</span></p>
</div>
</div>
</li>
<li><span><span>ToolEmu </span><span>(Ruan </span><span>et </span><span>al., </span><span>2023):</span></span> <span>실제 </span><span>도구 </span><span>환경을 </span><span>매번 </span><span>구축하는 </span><span>비용을 </span><span>줄이기 </span><span>위해 </span><span>LLM으로 </span><span>도구 </span><span>실행을 </span><span>모사하고, </span><span>에이전트의 </span><span>잠재적인 </span><span>위험 </span><span>행동을 </span><span>평가했다</span></li>
</ul>
<p data-ke-size="size16">이러한 연구들은 LLM의 도구 활용 능력을 확대하고 도구 사용 과정의 위험을 분석할 수 있는 기반을 마련했다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">보통 기능을 추가하면 공격의 표면이 확장되기 마련..</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">해당 연구들을 가져오면서 말한 한계점들은 도구 활용 능력이 향상되면서 외부 도구가 반환하는 콘텐츠를 신뢰할 수 있는지는 별개의 문제인 것 이다. </p>
<p data-ke-size="size16"> </p>
<blockquote data-ke-style="style2">본 연구에서는 단순한 도구 활용 능력이나 일반적인 위험 행동 평가를 넘어, 악성 외부 콘텐츠가 실제 도구 호출을 유발하는지에 대한 평가가 필요했다고 말한다.</blockquote>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">PI 공격 연구</h4>
<p data-ke-size="size16">기존 연구에서는 공격자가 LLM에 직접 접근하지 않더라도 웹페이지나 문서 등 외부 데이터에 악성 지시를 삽입하여 모델을 조작할 수 있음을 보여주며, IPI의 애플리케이션 동작 변조 등의 위험도 밝혀진다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">IPI의 위험성과 실제 공격 가능성은 입증되었지만</p>
<blockquote data-ke-style="style2">여러 종류의 도구를 사용하는 LLM Agent에서 공격이 얼마나 자주 성공하는지 비교할 수 있는 체계적인 평가가 부족하다고 한다.</blockquote>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">IPI 벤치마크 연구</h4>
<p data-ke-size="size16">IPI의 공격 사례가 여럿 알려졌지만 서로 다른 LLM의 취약성을 동일한 조건에서 비교할 수 있는 표준화된 평가 체계가 부족했다. 그전 논문에서 BIPIA라는 해결 방법을 제시했지만, 주로 제한된 유형의 LLM 기반 애플리케이션과 텍스트 처리 시나리오를 다룬다. 또한 공격 목표 역시 피싱이나 악성코드 배포를 비롯한 텍스트 기반 결과에 초점을 두고 있다.</p>
<p data-ke-size="size16"> </p>
<blockquote data-ke-style="style2">도구를 사용하는 Agent가 악성 지시를 받아 금전 이체, 기기 제어 등의 행동을 실제로 선택하는지까지 포괄적으로 평가하기에는 부족하다고 한다.</blockquote>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">Prompt Injection 방어 연구</h4>
<p data-ke-size="size16">PI에 대한 방어 연구가 진행되면서 Black-box 방어와 White-box 방어가 만들어졌지만, 주 로 명령과 데이터를 결합해 LLM에 입력하는 비교적 단순한 환경을 중심으로 평가되었다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">-&gt; 기존 방어 기법이 복잡한 도구 사용 환경에서도 효과적으로 작동하는지에 대해서는 충분한 검증이 이루어지지 않는다고 한다..</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">공격 모델 및 평가 과정</h3>
<p data-ke-size="size16">먼저 정상 사용자 요청을 보낸 후, AI Agent가 사용자 도구 실행을 요청하면 악성 지시가 포함된 도구 응답을 Agent에게 전달한다. 그 후 Agent의 후속 행동을 평가한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">구체적인 벤치마크 데이터셋 구성은 ToolEmu 연구에 정의된 36개의 툴킷의 330개 도구를 기반으로 공격자가 조작할 수 있는 외부 콘텐츠를 반환하는 도구들을 선정했다. Gpt-4를 활용해 사용자 시나리오와 공격 지시를 생성했으며, 실제 도구 호출에 필요한 매개변수와 응답 형식은 연구진이 수동으로 검토하고 수정했다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">17개의 사용자 시나리오와, 62개의 공격 시나리오, 1054개의 전체 테스트 케이스를 사용했으며 Direct Hram과 Data Stealing이라는 공격 목표를 가졌으며 Base Setting, Enhanced Setting이라는 두 가지 공격 조건을 구성하였다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Base Setting : 외부 콘텐츠에 악성 명령만 삽입한 조건</p>
<p data-ke-size="size16">Enganced Setting : 기존 지시를 무시하도록 유도하는 추가 프롬프트와 악성 명령을 조합한 조건.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">실험 설계 및 주요 결과</h3>
<p data-ke-size="size16">평가 방법은 총 30개 LLM Agnet를 대상으로 두 가지 도구 사용 방식을 비교하였다.</p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>Prompted Agent : 프롬프트에 추론 및 도구 사용 절차를 제공하여 도구를 호출하는 방식</li>
<li>Fine-Tuned Agent : 도구 호출을 위한 학습이 적용된 모델을 사용하는 방식</li>
</ul>
<p data-ke-size="size16">공격 성공률은 ASR로 측정했으며 올바른 형식으로 생성된 경우만 ASR-Valid를 주요 지표로 사용한다. </p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">주요 실험 결과</h4>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="516" data-origin-width="632"><span data-alt="Table3 Attack success rates (ASR-valid, %)" data-phocus="https://blog.kakaocdn.net/dna/2Juhh/dJMcaiLN5ny/AAAAAAAAAAAAAAAAAAAAACg-k6eHsydBHUvK818zc5NCmrArKFfTxcXccZxRsxo8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ndk7L8BG3jxdzasym52%2Bw4tsvlE%3D" data-url="https://blog.kakaocdn.net/dna/2Juhh/dJMcaiLN5ny/AAAAAAAAAAAAAAAAAAAAACg-k6eHsydBHUvK818zc5NCmrArKFfTxcXccZxRsxo8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ndk7L8BG3jxdzasym52%2Bw4tsvlE%3D"><img data-origin-height="516" data-origin-width="632" height="516" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/2Juhh/dJMcaiLN5ny/AAAAAAAAAAAAAAAAAAAAACg-k6eHsydBHUvK818zc5NCmrArKFfTxcXccZxRsxo8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ndk7L8BG3jxdzasym52%2Bw4tsvlE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F2Juhh%2FdJMcaiLN5ny%2FAAAAAAAAAAAAAAAAAAAAACg-k6eHsydBHUvK818zc5NCmrArKFfTxcXccZxRsxo8%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dndk7L8BG3jxdzasym52%252Bw4tsvlE%253D" width="632"/></span><figcaption>Table3 Attack success rates (ASR-valid, %)</figcaption>
</figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">결과로는</p>
<p data-ke-size="size16">1. 도구 사용 능력이 높은 LLM도 IPI에 취약하다</p>
<p data-ke-size="size16">   -&gt; ReAct 기반 GPT-4의 공격 성공률은 23.6-&gt; 47.0%(강화 조건)</p>
<p data-ke-size="size16">2. 공격 지시를 강화하면 성공률이 대체로 증가한다.</p>
<p data-ke-size="size16">    -&gt; Claude-2는 예외적으로 감소했지만, 많음 모델에서 강화 조건의 공격 성공률이 기본 조건보다 증가한다.</p>
<p data-ke-size="size16">3. Fine-Tuned Agnet가 ReAct 기반 Agent보다 높은 저항성을 보였다.</p>
<p data-ke-size="size16">    -&gt; GPT-4의 경우 기본 조건에서 ReAct 기반 Agnet는 23.6%의 공격 성공률을 보였지만, 도구 사용에 맞춰 학습된 GPT-4                  Agent는 6.6%였다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="426" data-origin-width="879"><span data-phocus="https://blog.kakaocdn.net/dna/bML52U/dJMcafPkcGK/AAAAAAAAAAAAAAAAAAAAADE4Fk0udN7f8jiJiHZJo3XsSzdpgjLKArjX5qaQwyqw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=41HMT%2F5CHz9g66s47QR%2B5%2B5czKw%3D" data-url="https://blog.kakaocdn.net/dna/bML52U/dJMcafPkcGK/AAAAAAAAAAAAAAAAAAAAADE4Fk0udN7f8jiJiHZJo3XsSzdpgjLKArjX5qaQwyqw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=41HMT%2F5CHz9g66s47QR%2B5%2B5czKw%3D"><img data-origin-height="426" data-origin-width="879" height="426" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bML52U/dJMcafPkcGK/AAAAAAAAAAAAAAAAAAAAADE4Fk0udN7f8jiJiHZJo3XsSzdpgjLKArjX5qaQwyqw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=41HMT%2F5CHz9g66s47QR%2B5%2B5czKw%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbML52U%2FdJMcafPkcGK%2FAAAAAAAAAAAAAAAAAAAAADE4Fk0udN7f8jiJiHZJo3XsSzdpgjLKArjX5qaQwyqw%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D41HMT%252F5CHz9g66s47QR%252B5%252B5czKw%253D" width="879"/></span></figure>
</p>
<p data-ke-size="size16">여기서 추가로 추가 분석 결과를 보면 자유롭게 텍스트를 작성할 수 있는 영역은 캘린더 이벤트 이름과 같이 내용이 제한적인 영역보다 공격 성공률이 높았다고 확인했다. </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">본 논문의 연구적 기여</h3>
<p data-ke-size="size16">선행 연구의 한계와 연결하면 이 논문의 기여는 다음과 같이 정리할 수 있다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span> 선행 연구의 한계 </span></span></td>
<td><span><span> INJECAGENT의 기여 </span></span></td>
</tr>
<tr>
<td><span><span>LLM </span><span>도구 </span><span>활용 </span><span>연구에서 </span><span>IPI </span><span>공격 </span><span>평가가 </span><span>부족</span></span></td>
<td><span><span>외부 </span><span>도구 </span><span>응답으로부터 </span><span>발생하는 </span><span>악성 </span><span>도구 </span><span>호출을 </span><span>평가 </span><span>대상으로 </span><span>정의</span></span></td>
</tr>
<tr>
<td><span><span>기존 </span><span>IPI </span><span>벤치마크의 </span><span>시나리오가 </span><span>제한적</span></span></td>
<td><span><span>금융, </span><span>개인정보, </span><span>스마트홈 </span><span>등 </span><span>다양한 </span><span>도구 </span><span>활용 </span><span>환경 </span><span>포함</span></span></td>
</tr>
<tr>
<td><span><span>공격 </span><span>성공 </span><span>여부의 </span><span>정량 </span><span>비교 </span><span>부족</span></span></td>
<td><span><span>1,054개 </span><span>테스트 </span><span>케이스와 </span><span>ASR-valid </span><span>기반 </span><span>비교</span></span></td>
</tr>
<tr>
<td><span><span>모델과 </span><span>공격 </span><span>조건에 </span><span>따른 </span><span>취약성 </span><span>차이에 </span><span>관한 </span><span>분석 </span><span>부족</span></span></td>
<td><span><span>30개 </span><span>Agent </span><span>및 </span><span>기본·강화 </span><span>공격 </span><span>조건 </span><span>비교, </span><span>콘텐츠 </span><span>자유도 </span><span>분석</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">한계점</h3>
<p data-ke-size="size16">공격 프롬프트의 다양성이 부족했고 외부 콘텐츠의 현실성이 제한되어 악성 지시가 정상적인 문서나 리뷰 내용과 자연스럽게 혼합된 상황을 충분히 반영하지 못한다. 그리고 복잡한 Agent 환경이 반영되지 못하여 최대 2단계 공격에 집중하여 장기적인 작업 및 복잡한 도구 실행 흐름을 평가하지 못한다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그리고 Fine-Tuned Agent의 평가가 제한되어 일반화하기 어려우며 실제 운영 환경과의 차이가 있다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23" data-pm-slice="1 1 []"><span> 중심 논문 IsolateGPT와의 연결성</span></h3>
<p data-ke-size="size16"><span>INJECAGENT는 외부 도구의 응답에 포함된 악성 지시가 LLM Agent의 유해한 도구 실행과 데이터 유출을 유도할 수 있음을 정량적으로 평가하였다. </span></p>
<p data-ke-size="size16"><span>실제로 중심 논문에서는 INJECAGENT의 </span><span>1,054개 공격 사례에 시스템 데이터 탈취 시나리오 544개를 추가하여 총 1,598개 사례로 방어 성능을 평가</span><span>하였다.</span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">두 번째 선행 연구</h3>
<p data-ke-size="size16">논문명 : Agent Smith: A Single Image Can Jailbreak One Million Multimodal LLM Agents Exponentially Fast</p>
<p data-ke-size="size16">논문 URL : <a href="https://arxiv.org/pdf/2402.08567" rel="noopener noreferrer" target="_blank">https://arxiv.org/pdf/2402.08567</a></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">1. 연구 배경 및 핵심 문제</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>기존의 </span><span>LLM </span><span>탈옥 </span><span>연구는 </span><span>주로 </span><span>공격자가 </span><span>하나의 </span><span>모델에 </span><span>적대적 </span><span>프롬프트나 </span><span>이미지를 </span><span>입력하여 </span><span>모델의 </span><span>안전 </span><span>정책을 </span><span>우회하는 </span><span>문제에 </span><span>초점을 </span><span>맞췄다.</span></p>
<p data-ke-size="size16"><span>그러나 </span><span>멀티모달 </span><span>대규모 </span><span>언어모델(Multimodal </span><span>Large </span><span>Language </span><span>Model, </span><span>MLLM)을 </span><span>활용한 </span><span>에이전트는 </span><span>텍스트뿐 </span><span>아니라 </span><span>이미지도 </span><span>처리할 </span><span>수 </span><span>있으며, </span><span>이전 </span><span>대화와 </span><span>이미지 </span><span>정보를 </span><span>메모리에 </span><span>저장하고 </span><span>다른 </span><span>에이전트와 </span><span>공유할 </span><span>수 </span><span>있다.</span></p>
<p data-ke-size="size16"><span>특히 </span><span>여러 </span><span>에이전트가 </span><span>협업하는 </span><span>환경에서는 </span><span>하나의 </span><span>에이전트가 </span><span>처리한 </span><span>정보가 </span><span>다른 </span><span>에이전트의 </span><span>입력으로 </span><span>전달되는 </span><span>과정이 </span><span>반복된다. </span></p>
<h4 data-ke-size="size20">논문은 이러한 문제점들을 활용해 </h4>
<blockquote data-ke-style="style2">공격자가 하나의 에이전트에만 악성 이미지를 주입하더라도, 그 이미지가 다른 에이전트의 메모리로 전달되어 전체 다중 에이전트 시스템에 영향을 줄 수 있는가?</blockquote>
<p data-ke-size="size16">라는 문제점을 품으며 한 에이전트의 침해가 다수의 에이전트로 확산될 가능성에 초점을 맞춘다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">2. 선행 연구 분석</h3>
<h4 data-ke-size="size20">LLM기반 MAS</h4>
<p data-ke-size="size16">여기서 준비한 논문은 아래와 같음</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%; height: 142px;">
<tbody>
<tr style="height: 16px;">
<td style="height: 16px; width: 35%;">선행연구</td>
<td style="height: 16px; width: 64.8837%;">주요 내용</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px; width: 35%;"><span><span>Generative </span><span>Agents </span><span>(Park </span><span>et </span><span>al., </span><span>2023)</span></span></td>
<td style="height: 22px; width: 64.8837%;"><span><span>여러 </span><span>에이전트의 </span><span>상호작용을 </span><span>통해 </span><span>정보가 </span><span>확산되는 </span><span>현상을 </span><span>보여줌</span></span></td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px; width: 35%;"><span><span>ChatDev </span><span>(Qian </span><span>et </span><span>al., </span><span>2023)</span></span></td>
<td style="height: 22px; width: 64.8837%;"><span><span>역할별 </span><span>에이전트가 </span><span>대화하며 </span><span>소프트웨어 </span><span>개발 </span><span>과정을 </span><span>수행</span></span></td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px; width: 35%;"><span><span>CAMEL </span><span>(Li </span><span>et </span><span>al., </span><span>2023)</span></span></td>
<td style="height: 22px; width: 64.8837%;"><span><span>역할 </span><span>기반 </span><span>에이전트의 </span><span>협력과 </span><span>의사소통 </span><span>구조 </span><span>제안</span></span></td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px; width: 35%;"><span><span>AutoGen </span><span>(Wu </span><span>et </span><span>al., </span><span>2023)</span></span></td>
<td style="height: 22px; width: 64.8837%;"><span><span>에이전트 </span><span>간 </span><span>대화와 </span><span>도구 </span><span>사용을 </span><span>통한 </span><span>작업 </span><span>자동화</span></span></td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px; width: 35%;"><span><span>MetaGPT </span><span>(Hong </span><span>et </span><span>al., </span><span>2023)</span></span></td>
<td style="height: 22px; width: 64.8837%;"><span><span>소프트웨어 </span><span>개발 </span><span>역할을 </span><span>분담하는 </span><span>다중 </span><span>에이전트 </span><span>프레임워크</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">이러한 연구들을 통해서 다중 에이전트 즉 MAS에서 협업 구조가 성능 향상뿐 아니라 공격 전파 경로로도 작용할 수 있다는 점을 주목한다</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">LLM및 MLLM 탈옥 공격 연구</h4>
<p data-ke-size="size16">적대적 텍스트 프롬프트를 이용한 공격을 다룬 연구들과 이미지와 같은 비텍스트 입력을 활용하여 멀티모델 모델을 공격하는 연구도 진행된 것을 확인했으며, 단일 모델에 대한 탈옥 공격이 가능하다는 것을 식별하였다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">-&gt;</p>
<blockquote data-ke-style="style2">공격자가 모든 에이전트를 개별적으로 공격하지 않아도, 침해된 에이전트가 다른 에이전트를 감염시키도록 만들 수 있는가?</blockquote>
<p data-ke-size="size16">를 보며 이를 기존 탈옥 공격을 넘는 전염성 탈옥이라는 개념을 제안한다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">그래서 한계는?</h4>
<p data-ke-size="size16">앞의 선행연구와 비교하면 연구진이 주목한 공백은</p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>
<div>
<div>
<p data-ke-size="size16"><span>개별 </span><span>모델의 </span><span>탈옥 </span><span>성공 </span><span>여부와 </span><span>다중 </span><span>에이전트 </span><span>전체의 </span><span>공격 </span><span>전파는 </span><span>서로 </span><span>다른 </span><span>문제다.</span></p>
</div>
</div>
</li>
<li>
<div>
<div>
<p data-ke-size="size16"><span>기존 </span><span>협업 </span><span>연구는 </span><span>에이전트 </span><span>간 </span><span>정보 </span><span>공유를 </span><span>다루지만 </span><span>악성 </span><span>데이터의 </span><span>연쇄 </span><span>확산은 </span><span>충분히 </span><span>분석하지 </span><span>않았다.</span></p>
</div>
</div>
</li>
<li>
<div>
<div>
<p data-ke-size="size16"><span>악성 </span><span>이미지가 </span><span>전달되는 </span><span>것과 </span><span>수신 </span><span>에이전트가 </span><span>실제 </span><span>유해 </span><span>응답을 </span><span>생성하는 </span><span>것은 </span><span>구분할 </span><span>필요가 </span><span>있다</span></p>
</div>
</div>
</li>
</ul>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">공격 모델 및 평가 과정</h3>
<p data-ke-size="size16">일단 공격은 MAS를 기준으로 하기때문에.. MAS 부터 구성한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그래서 에이전트가 무작위로 짝을 이루어 대화하는 <span><span>Randomized </span><span>Pairwise </span><span>Chat</span></span> <span>환경을 </span><span>구성했다.</span></p>
<p data-ke-size="size16"><span>구성 요소로는 MLLM, RAG, Text Histories, Image Album이 있다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">해당 에이전트의 정상 상호작용은 아래 사진과 같다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="289" data-origin-width="348"><span data-phocus="https://blog.kakaocdn.net/dna/O2oT7/dJMcaiZg3Kh/AAAAAAAAAAAAAAAAAAAAAJm89xh78Fnxph2KoVcoXO8PoRtm39l05i6t2AM5e5Lu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=iuX6hiYqVUuhxs3iFoPU%2Bd%2Fo5FY%3D" data-url="https://blog.kakaocdn.net/dna/O2oT7/dJMcaiZg3Kh/AAAAAAAAAAAAAAAAAAAAAJm89xh78Fnxph2KoVcoXO8PoRtm39l05i6t2AM5e5Lu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=iuX6hiYqVUuhxs3iFoPU%2Bd%2Fo5FY%3D"><img data-origin-height="289" data-origin-width="348" height="289" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/O2oT7/dJMcaiZg3Kh/AAAAAAAAAAAAAAAAAAAAAJm89xh78Fnxph2KoVcoXO8PoRtm39l05i6t2AM5e5Lu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=iuX6hiYqVUuhxs3iFoPU%2Bd%2Fo5FY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FO2oT7%2FdJMcaiZg3Kh%2FAAAAAAAAAAAAAAAAAAAAAJm89xh78Fnxph2KoVcoXO8PoRtm39l05i6t2AM5e5Lu%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DiuX6hiYqVUuhxs3iFoPU%252Bd%252Fo5FY%253D" width="348"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이제 Infectious Jailbreak 공격 과정을 살펴보면 공격자는 하나의 이미지에 적대적 교란을 적용하여 전염성 이미지를 생성한다. 해당 이미지는 아래 세 가지 조건을 만족하도록 설계된다.</p>
<p data-ke-size="size16">1. 검색 유도</p>
<p data-ke-size="size16">2. 유해 질문 유도</p>
<p data-ke-size="size16">3. 유해 응답 유도</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">이미지 전달과 실제 유해 행동의 구분</h4>
<p data-ke-size="size16">연구진은 이미지가 전달됐다는 사실만으로 에이전트가 유해 행동을 했다고 판단하지 않는다. 전염 과정을 다음 세 확률로 모델링하기 때문</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span><span data-math-display="false" data-math-source="\alpha">a</span></span></span></td>
<td><span><span>공격 </span><span>이미지를 </span><span>보유한 </span><span>에이전트가 </span><span>유해 </span><span>행동을 </span><span>보일 </span><span>확률</span></span></td>
</tr>
<tr>
<td><span><span><span data-math-display="false" data-math-source="\beta">b</span></span></span></td>
<td><span><span>감염된 </span><span>질문자가 </span><span>정상 </span><span>응답자에게 </span><span>공격 </span><span>이미지를 </span><span>전파할 </span><span>확률</span></span></td>
</tr>
<tr>
<td>r</td>
<td><span><span>감염된 </span><span>에이전트가 </span><span>공격 </span><span>이미지를 </span><span>메모리에서 </span><span>잃어 </span><span>회복할 </span><span>확률</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이것들을 활용하면 이미지 보유와 유해 행동을 서로 다른 상태로 구분할 수 있으며, 악성 이미지가 다른 에이전트에게 전달되어도 수신 에이전트가 반드시 유해한 응답을 생성했다고 판단하지 않는다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">실험 설계 및 주요 결과</h3>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>기본 </span><span>MLLM</span></span></td>
<td><span><span>LLaVA-1.5 </span><span>7B</span></span></td>
</tr>
<tr>
<td><span><span>추가 </span><span>MLLM</span></span></td>
<td><span><span>LLaVA-1.5 </span><span>13B, </span><span>InstructBLIP </span><span>7B</span></span></td>
</tr>
<tr>
<td><span><span>이미지 </span><span>검색</span></span></td>
<td><span><span>CLIP </span><span>ViT-L/224</span></span></td>
</tr>
<tr>
<td><span><span>이미지 </span><span>데이터</span></span></td>
<td><span><span>ArtBench</span></span></td>
</tr>
<tr>
<td><span><span>유해 </span><span>목표 </span><span>데이터</span></span></td>
<td><span><span>AdvBench</span></span></td>
</tr>
<tr>
<td><span><span>기본 </span><span>다중 </span><span>에이전트 </span><span>규모</span></span></td>
<td><span><span>256개</span></span></td>
</tr>
<tr>
<td><span><span>최대 </span><span>시뮬레이션 </span><span>규모</span></span></td>
<td><span><span>1,000,000개</span></span></td>
</tr>
<tr>
<td><span><span>기본 </span><span>대화 </span><span>이력 </span><span>크기</span></span></td>
<td><span><span>3</span></span></td>
</tr>
<tr>
<td><span><span>기본 </span><span>이미지 </span><span>앨범 </span><span>크기</span></span></td>
<td><span><span>10</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">AdbBench의 574개 유해 문자열을 대상으로 기본 모델의 안전성 동작을 사전 확인한 뒤, 이미 유해 응답이 쉽게 생성되는 목표를 제외하여 공격 목표를 구성했다. 또한 서로 다른 유해 목표 5개에 대해 반복적으로 평가하고 결과의 평균과 표준편차를 보고한다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">비교 공격 방식</h4>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>Visual </span><span>Prompt </span><span>Injection </span><span>(VP)</span></span></td>
<td><span><span>이미지에 </span><span>유해 </span><span>지시를 </span><span>포함해 </span><span>모델을 </span><span>조작</span></span></td>
</tr>
<tr>
<td><span><span>Textual </span><span>Prompt </span><span>Injection </span><span>(TP)</span></span></td>
<td><span><span>텍스트 </span><span>지시를 </span><span>통해 </span><span>유해 </span><span>콘텐츠 </span><span>생성·전파 </span><span>유도</span></span></td>
</tr>
<tr>
<td><span><span>Sequential </span><span>Jailbreak</span></span></td>
<td><span><span>공격자가 </span><span>에이전트를 </span><span>순차적으로 </span><span>공격</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">기존의 Sequential 방식은 전체 에이전트를 공격하려면 대상 수에 비례하는 공격 과정이 필요한데 해당 논문에서는 전염성 공격은 성공적으로 확산되는 조건에서 감염에 필요한 대화 라운드가 에이전트 수의 로그에 비례하도록 증가한다고 분석했다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">평가 지표</h4>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>Cumulative </span><span>Infection </span><span>Ratio</span></span></td>
<td><span><span>현재 </span><span>라운드까지 </span><span>한 </span><span>번이라도 </span><span>유해 </span><span>목표 </span><span>출력을 </span><span>생성한 </span><span>에이전트 </span><span>비율</span></span></td>
</tr>
<tr>
<td><span><span>Current </span><span>Infection </span><span>Ratio</span></span></td>
<td><span><span>현재 </span><span>라운드에서 </span><span>유해 </span><span>목표 </span><span>출력을 </span><span>생성한 </span><span>에이전트 </span><span>비율</span></span></td>
</tr>
<tr>
<td><span><span>Infection </span><span>Ratio </span><span>at </span><span>Round </span><span>t</span></span></td>
<td><span><span>특정 </span><span>라운드에서의 </span><span>누적 </span><span>또는 </span><span>현재 </span><span>감염 </span><span>비율</span></span></td>
</tr>
<tr>
<td><span><span>Rounds </span><span>to </span><span>Threshold</span></span></td>
<td><span><span>감염 </span><span>비율이 </span><span>특정 </span><span>임계값에 </span><span>처음 </span><span>도달한 </span><span>라운드</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>감염 </span><span>성공 </span><span>여부는 </span><span>실험에서 </span><span>미리 </span><span>설정한 </span><span>유해 </span><span>질문·응답과 </span><span><span>정확하게 </span><span>일치하는지</span></span><span>를 </span><span>기준으로 </span><span>판정한다. </span><span>따라서 </span><span>의미가 </span><span>유사하지만 </span><span>문자열이 </span><span>다른 </span><span>유해 </span><span>출력은 </span><span>성공 </span><span>집계에서 </span><span>제외될 </span><span>수 </span><span>있다. </span><span><span><span></span></span></span></p>
<div>
<div> </div>
<div> </div>
</div>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="279" data-origin-width="670"><span data-alt="주요 결과 1. 기존 비전염성 공격보다 빠른 확산" data-phocus="https://blog.kakaocdn.net/dna/cvQzW6/dJMcackyUVa/AAAAAAAAAAAAAAAAAAAAAKX7Ns9loQx53F18eglQJOyE1TUxTlRINdcWDuk6LFet/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ODrLeRwvUP%2FJ7c%2B0MUIf1wWWHyw%3D" data-url="https://blog.kakaocdn.net/dna/cvQzW6/dJMcackyUVa/AAAAAAAAAAAAAAAAAAAAAKX7Ns9loQx53F18eglQJOyE1TUxTlRINdcWDuk6LFet/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ODrLeRwvUP%2FJ7c%2B0MUIf1wWWHyw%3D"><img data-origin-height="279" data-origin-width="670" height="279" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cvQzW6/dJMcackyUVa/AAAAAAAAAAAAAAAAAAAAAKX7Ns9loQx53F18eglQJOyE1TUxTlRINdcWDuk6LFet/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ODrLeRwvUP%2FJ7c%2B0MUIf1wWWHyw%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcvQzW6%2FdJMcackyUVa%2FAAAAAAAAAAAAAAAAAAAAAKX7Ns9loQx53F18eglQJOyE1TUxTlRINdcWDuk6LFet%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DODrLeRwvUP%252FJ7c%252B0MUIf1wWWHyw%253D" width="670"/></span><figcaption>주요 결과 1. 기존 비전염성 공격보다 빠른 확산</figcaption>
</figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Figure 3에서는 256개 에이전트 환경에서 공격 방식을 비교하여 Sequential Jailbreak는 시간이 지남에 따라 감염된 에이전트 수가 증가하지만 증가 속도는 상대적으로 느린 것을 확인할 수 있으며 Agent Smith의 전염성 공격은 에이전트 간 대화와 메모리 갱신을 활용하여 빠르게 확산된 것을 확인할 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">여기서 확인해야할 것은 기존 공격보다 성공률이 높다!! 이런 것이 아니라 초기에 감염된 에이전트가 다른 에이전트를 감염시키면서 공격이 스스로 확산될 수 있다는 점이다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="546" data-origin-width="758"><span data-phocus="https://blog.kakaocdn.net/dna/brcKnC/dJMcahzsxb4/AAAAAAAAAAAAAAAAAAAAABoJK3WsIPkCqLdAT91pLh7pGodJcZjWpjoYrlWYo9Ii/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=oon8tN45fKtZuvj%2FyXAmVBsr8TU%3D" data-url="https://blog.kakaocdn.net/dna/brcKnC/dJMcahzsxb4/AAAAAAAAAAAAAAAAAAAAABoJK3WsIPkCqLdAT91pLh7pGodJcZjWpjoYrlWYo9Ii/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=oon8tN45fKtZuvj%2FyXAmVBsr8TU%3D"><img data-origin-height="546" data-origin-width="758" height="546" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/brcKnC/dJMcahzsxb4/AAAAAAAAAAAAAAAAAAAAABoJK3WsIPkCqLdAT91pLh7pGodJcZjWpjoYrlWYo9Ii/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=oon8tN45fKtZuvj%2FyXAmVBsr8TU%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbrcKnC%2FdJMcahzsxb4%2FAAAAAAAAAAAAAAAAAAAAABoJK3WsIPkCqLdAT91pLh7pGodJcZjWpjoYrlWYo9Ii%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Doon8tN45fKtZuvj%252FyXAmVBsr8TU%253D" width="758"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>Table 1과 Figure 4는 공격 조건에 따른 Infectious Jailbreak의 전파 성능과 실패 원인을 분석한 결과이다.</span><span> Table 1에서는 에이전트 간 대화의 다양성이 높아질수록 공격 전파 속도가 다소 감소했지만, Border Attack의 경계 폭이 6인 경우 16라운드 누적 감염률이 낮은 다양성에서 93.75%, 높은 다양성에서 88.98%로 나타났으며, 24라운드에는 두 환경 모두 약 99%에 도달하였다. </span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>반면 Figure 4에서는 공격 이미지의 변조 범위를 줄였을 때 공격 전파가 느려지거나 중단되는 사례가 관찰되었다. 특히 악성 이미지 자체는 다른 에이전트에게 전달되더라도, 이를 통해 유해한 응답을 생성할 확률이 낮아지면 실제 감염 확산이 제한되었다. </span><span>이를 통해 공격의 확산은 단순히 악성 이미지가 전달되는 것뿐 아니라, 각 에이전트가 해당 이미지에 의해 지속적으로 Jailbreak되는지에 따라 결정된다는 점을 확인할 수 있다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>지표가 너무 많기에 중요하다고 생각한 부분만 정리하였다.</span></p>
<h3 data-ke-size="size23"><span>연구적 </span><span>기여 </span></h3>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span><span>전염성 </span><span>Jailbreak </span><span>개념 </span><span>제안</span></span></span></td>
<td><span><span>기존 </span><span>연구가 </span><span>개별 </span><span>LLM의 </span><span>탈옥 </span><span>공격에 </span><span>집중한 </span><span>것과 </span><span>달리, </span><span>하나의 </span><span>Agent에서 </span><span>시작한 </span><span>공격이 </span><span>Agent </span><span>간 </span><span>상호작용을 </span><span>통해 </span><span>다른 </span><span>Agent로 </span><span>자동 </span><span>전파되는 </span><span><span>Infectious </span><span>Jailbreak</span></span><span>라는 </span><span>공격 </span><span>패러다임을 </span><span>제안함.</span></span></td>
</tr>
<tr>
<td><span><span><span> </span><span>이미지 </span><span>기반 </span><span>자동 </span><span>전파 </span><span>공격 </span><span>설계</span></span></span></td>
<td><span><span>악성 </span><span>이미지가 </span><span>Agent의 </span><span>메모리에 </span><span>저장되고, </span><span>이후 </span><span>이미지 </span><span>검색(RAG)과 </span><span>Agent </span><span>간 </span><span>대화를 </span><span>통해 </span><span>다른 </span><span>Agent에게 </span><span>전달되도록 </span><span>설계함. </span><span>이를 </span><span>위해 </span><span>이미지 </span><span>검색을 </span><span>유도하는 </span><span>목적함수와 </span><span>유해한 </span><span>질문·응답을 </span><span>생성하는 </span><span>목적함수를 </span><span>결합함.</span></span></td>
</tr>
<tr>
<td><span><span><span> </span><span>공격 </span><span>확산의 </span><span>수학적 </span><span>모델링</span></span></span></td>
<td><span><span>감염 </span><span>확률과 </span><span>회복 </span><span>확률을 </span><span>이용해 </span><span>공격의 </span><span>확산 </span><span>과정을 </span><span>모델링하고, </span><span>조건이 </span><span>충족되면 </span><span>Agent </span><span>수가 </span><span>증가하더라도 </span><span>약 </span><span><span data-math-display="false" data-math-source="O(\log N)">\(O(\log N)\)</span></span><span>회의 </span><span>대화 </span><span>라운드로 </span><span>공격이 </span><span>확산될 </span><span>수 </span><span>있음을 </span><span>보임. </span><span>또한 </span><span>확산을 </span><span>억제하기 </span><span>위한 </span><span>이론적 </span><span>조건을 </span><span>도출함.</span></span></td>
</tr>
<tr>
<td><span><span><span> </span><span>대규모 </span><span>및 </span><span>이종 </span><span>Agent </span><span>환경에서 </span><span>공격 </span><span>가능성 </span><span>검증</span></span></span></td>
<td><span><span>최대 </span><span>약 </span><span>100만 </span><span>개 </span><span>Agent </span><span>규모의 </span><span>시뮬레이션을 </span><span>수행하고, </span><span>LLaVA-1.5와 </span><span>InstructBLIP을 </span><span>혼합한 </span><span>이종 </span><span>Agent </span><span>환경에서도 </span><span>공격이 </span><span>확산될 </span><span>수 </span><span>있음을 </span><span>실험적으로 </span><span>확인함. </span><span>유해한 </span><span>함수 </span><span>호출 </span><span>형식의 </span><span>출력을 </span><span>유도하는 </span><span>사례도 </span><span>제시함.</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">한계점</h3>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>실험이 무작위 Pairwise Chat 기반의 시뮬레이션 환경에 집중되어 실제 Multi-Agent 시스템의 복잡한 협업 구조와 다양한 통신 및 도구 실행 과정을 충분히 반영하지 못한다. 또한 LLaVA-1.5와 InstructBLIP 등 제한된 모델을 대상으로 평가하였으며, 공격 이미지 생성에 모델 내부의 기울기 정보가 필요하여 Black-box 환경에서의 공격 가능성을 일반화하기 어렵다.</span></p>
<p data-ke-size="size16"><span>그리고 공격 성공 여부를 주로 유해한 문자열이나 함수 호출 형식의 출력 생성으로 평가하여, 실제 운영 환경에서 악성 도구 실행으로 인한 피해가 발생하는지 충분히 검증하지 못하였다. 특히 100만 Agent 규모의 실험에서는 1,024개 Agent에 공격 이미지를 초기 주입하였다는 제한이 있으며, 공격 확산을 억제하기 위한 이론적 조건은 제시했지만 실질적인 방어 기법의 구현 및 검증이 부족하다는 한계가 있다.</span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">연결점</h3>
<p data-ke-size="size16"><span>앞선 INJECAGENT와 Agent Smith 연구를 통해 LLM Agent의 보안 위협이 단일 Agent의 악성 명령 실행뿐 아니라 Agent 간 상호작용을 통한 공격 전파로까지 확장될 수 있음을 확인하였다. </span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>그러나 두 연구는 주로 공격의 가능성과 취약성을 분석하는 데 집중하였으며, 이러한 위협을 실제 시스템 구조에서 어떻게 차단할 것인지에 대한 구체적인 방어 방안은 충분히 제시하지 못하였다. </span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>특히 LLM Agent가 외부 데이터와 다른 애플리케이션을 신뢰 경계 없이 처리하는 구조에서는 악성 명령이 다른 구성 요소에 영향을 주거나 민감한 데이터에 접근할 위험이 존재한다. 따라서 개별 악성 프롬프트를 탐지하거나 거부하는 방식에서 나아가, 신뢰할 수 없는 구성 요소의 실행 환경을 분리하고 상호작용을 통제하는 시스템 수준의 보안 설계가 필요하다. 이러한 관점에서 IsolateGPT는 애플리케이션별 실행 격리와 접근 통제를 통해 공격의 영향 범위를 제한하는 보안 아키텍처를 제안한다.</span></p>
<div>
<h2 data-ke-size="size26"><span> </span><span>중심 </span><span>논문 </span><span>— </span><span>IsolateGPT</span></h2>
<p data-ke-size="size16"><span><span>논문명:</span></span> <span><span>IsolateGPT: </span><span>An </span><span>Execution </span><span>Isolation </span><span>Architecture </span><span>for </span><span>LLM-Based </span><span>Agentic </span><span>Systems</span></span></p>
<p data-ke-size="size16"><span><span>학회:</span></span> <span>NDSS </span><span>2025</span></p>
<p data-ke-size="size16"><span><span>저자:</span></span> <span>Yuhao </span><span>Wu, </span><span>Franziska </span><span>Roesner, </span><span>Tadayoshi </span><span>Kohno, </span><span>Ning </span><span>Zhang, </span><span>Umar </span><span>Iqbal</span><span></span></p>
<h3 data-ke-size="size23"><span> </span><span>연구 </span><span>배경 </span><span>및 </span><span>핵심 </span><span>문제</span></h3>
<p data-ke-size="size16">기존 문제점인 LLM의 활동 범위가 넓혀져 tool에 대한 악성 프롬프트 인젝션에 대한 문제점을 깔고가면서 <span>논문에서는 </span><span>이 </span><span>문제를 </span><span>단순히 </span><span>LLM이 </span><span>악성 </span><span>프롬프트를 </span><span>제대로 </span><span>식별하지 </span><span>못하는 </span><span>문제로만 </span><span>보지 </span><span>않는다. </span><span><span>신뢰할 </span><span>수 </span><span>없는 </span><span>앱과 </span><span>시스템이 </span><span>충분히 </span><span>격리되지 </span><span>않고, </span><span>자연어를 </span><span>통해 </span><span>접근 </span><span>권한과 </span><span>실행 </span><span>흐름이 </span><span>결정되는 </span><span>구조적 </span><span>문제</span></span><span>로 </span><span>접근한다.</span></p>
<p data-ke-size="size16"><span>따라서 </span><span>핵심 </span><span>연구 </span><span>질문은 </span><span>다음과 </span><span>같다.</span></p>
<blockquote data-ke-style="style1">
<p data-ke-size="size16"><span>LLM이 </span><span>악성 </span><span>명령을 </span><span>완벽하게 </span><span>탐지하지 </span><span>못하더라도, </span><span>각 </span><span>애플리케이션의 </span><span>실행 </span><span>환경을 </span><span>격리하고 </span><span>앱 </span><span>간 </span><span>접근을 </span><span>통제하여 </span><span>공격이 </span><span>다른 </span><span>애플리케이션이나 </span><span>시스템으로 </span><span>확산되는 </span><span>것을 </span><span>방지할 </span><span>수 </span><span>있는가?</span></p>
</blockquote>
<div>
<div> </div>
<div>
<div> </div>
</div>
</div>
<h2 data-ke-size="size26"><span>선행 </span><span>연구 </span><span>분석</span></h2>
<h3 data-ke-size="size23"><span>Prompt </span><span>Injection </span><span>및 </span><span>LLM </span><span>Agent </span><span>보안 </span><span>연구</span></h3>
<p data-ke-size="size16"><span>기존 </span><span>연구에서는 </span><span>LLM이 </span><span>외부 </span><span>콘텐츠에 </span><span>포함된 </span><span>악성 </span><span>명령을 </span><span>정상적인 </span><span>지시로 </span><span>해석하는 </span><span>Prompt </span><span>Injection </span><span>문제를 </span><span>연구하였다.</span></p>
<p data-ke-size="size16"><span>특히 </span><span>INJECAGENT는 </span><span>외부 </span><span>도구 </span><span>응답에 </span><span>삽입된 </span><span>악성 </span><span>명령이 </span><span>다른 </span><span>도구의 </span><span>실행이나 </span><span>데이터 </span><span>유출을 </span><span>유도할 </span><span>수 </span><span>있음을 </span><span>정량적으로 </span><span>평가하였다.</span></p>
<p data-ke-size="size16"><span>이러한 </span><span>연구를 </span><span>통해 </span><span>LLM </span><span>Agent의 </span><span>취약성이 </span><span>확인되었으며, </span><span>이를 </span><span>해결하기 </span><span>위해 </span><span>악성 </span><span>프롬프트 </span><span>탐지, </span><span>명령과 </span><span>데이터의 </span><span>구분, </span><span>모델의 </span><span>안전성 </span><span>강화 </span><span>등의 </span><span>방어 </span><span>방식이 </span><span>연구되었다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span><span>하지만 </span><span>이러한 </span><span>접근에는 </span><span>한계가 </span><span>존재한다!!!.</span></span></p>
<p data-ke-size="size16"><span>LLM이 </span><span>자연어 </span><span>명령의 </span><span>의미를 </span><span>완벽하게 </span><span>구분하는 </span><span>것은 </span><span>어렵기 </span><span>때문에, </span><span>악성 </span><span>지시를 </span><span>모두 </span><span>탐지하거나 </span><span>거부하는 </span><span>방식만으로는 </span><span>시스템의 </span><span>안전성을 </span><span>보장하기 </span><span>어렵다. </span><span>또한 </span><span>악성 </span><span>명령이 </span><span>한 </span><span>번 </span><span>실행되었을 </span><span>때 </span><span>다른 </span><span>애플리케이션이나 </span><span>시스템 </span><span>데이터에 </span><span>영향을 </span><span>미치는 </span><span>구조적인 </span><span>문제는 </span><span>여전히 </span><span>남아 </span><span>있었다.</span></p>
<h3 data-ke-size="size23"><span>기존 </span><span>LLM </span><span>애플리케이션 </span><span>실행 </span><span>구조</span></h3>
<p data-ke-size="size16"><span>기존 </span><span>ChatGPT </span><span>플러그인 </span><span>등의 </span><span>LLM </span><span>애플리케이션에서는 </span><span>하나의 </span><span>LLM이 </span><span>여러 </span><span>앱의 </span><span>기능 </span><span>설명과 </span><span>실행 </span><span>결과를 </span><span>공유된 </span><span>문맥에서 </span><span>처리하는 </span><span>구조를 </span><span>사용했다. </span><span>이러한 </span><span>방식은 </span><span>여러 </span><span>애플리케이션을 </span><span>연결하여 </span><span>복잡한 </span><span>사용자 </span><span>작업을 </span><span>수행할 </span><span>수 </span><span>있다는 </span><span>장점이 </span><span>있었다.</span></p>
<p data-ke-size="size16"><span>그러나 </span><span>서로 </span><span>다른 </span><span>앱이 </span><span>공유된 </span><span>실행 </span><span>문맥을 </span><span>이용하기 </span><span>때문에 </span><span>한 </span><span>앱의 </span><span>악성 </span><span>명령이 </span><span>다른 </span><span>앱의 </span><span>행동을 </span><span>변경하거나, </span><span>원래 </span><span>접근할 </span><span>수 </span><span>없어야 </span><span>하는 </span><span>데이터에 </span><span>접근할 </span><span>가능성이 </span><span>존재했다.</span></p>
<blockquote data-ke-style="style2">애플리케이션 간 신뢰 경계(Trust Boundary)가 충분히 분리되어 있지 않다는 점이 핵심 문제라고 지적!</blockquote>
<h3 data-ke-size="size23"><span>기존 </span><span>운영체제 </span><span>및 </span><span>브라우저의 </span><span>실행 </span><span>격리 </span><span>연구</span></h3>
<p data-ke-size="size16"><span>기존 </span><span>컴퓨팅 </span><span>시스템에서도 </span><span>신뢰할 </span><span>수 </span><span>없는 </span><span>애플리케이션 </span><span>사이의 </span><span>보안 </span><span>문제가 </span><span>존재했으며, </span><span>이를 </span><span>해결하기 </span><span>위해 </span><span>다양한 </span><span>격리 </span><span>기법이 </span><span>발전했다.</span></p>
<p data-ke-size="size16"><span>대표적으로 </span><span>Chrome의 </span><span>Site </span><span>Isolation은 </span><span>웹사이트의 </span><span>실행 </span><span>프로세스를 </span><span>분리하여 </span><span>서로 </span><span>다른 </span><span>사이트 </span><span>사이의 </span><span>접근을 </span><span>제한하는 </span><span>방식을 </span><span>사용했다. </span><span>또한 </span><span>모바일 </span><span>운영체제에서는 </span><span>애플리케이션별 </span><span>실행 </span><span>공간과 </span><span>권한 </span><span>관리 </span><span>방식을 </span><span>적용하였다.</span></p>
<p data-ke-size="size16"><span>그러나 </span><span>이러한 </span><span>기술을 </span><span>LLM </span><span>Agent에 </span><span>그대로 </span><span>적용하기는 </span><span>어려웠다.</span></p>
<p data-ke-size="size16"><span>LLM </span><span>기반 </span><span>시스템은 </span><span>명확하게 </span><span>정의된 </span><span>API뿐 </span><span>아니라 </span><span>자연어를 </span><span>이용하여 </span><span>앱의 </span><span>기능과 </span><span>상호작용을 </span><span>결정하며, </span><span>작업을 </span><span>수행하는 </span><span>과정에서 </span><span>다른 </span><span>앱의 </span><span>데이터와 </span><span>과거 </span><span>대화 </span><span>문맥을 </span><span>필요로 </span><span>하기 </span><span>때문이다.</span></p>
<blockquote data-ke-style="style2"> 각 앱을 단순히 격리하는 것뿐만 아니라 격리된 상태에서도 필요한 데이터를 안전하게 공유하고 앱 간 협업을 유지할 수 있는 구조가 필요했다.</blockquote>
<div>
<div>
<div> </div>
</div>
<div>
<div> </div>
</div>
</div>
<h2 data-ke-size="size26"><span>2.3 </span><span>제안 </span><span>방법 </span><span>및 </span><span>시스템 </span><span>아키텍처</span></h2>
<p data-ke-size="size16"><span>이 </span><span>논문에서는 </span><span><span>Hub-and-Spoke </span><span>Architecture</span></span><span>를 </span><span>제안한다. </span><span>기본적으로 </span><span>각 </span><span>애플리케이션이 </span><span>별도의 </span><span>실행 </span><span>환경에서 </span><span>동작하도록 </span><span>만들고, </span><span>서로 </span><span>다른 </span><span>앱이나 </span><span>시스템과의 </span><span>상호작용은 </span><span>신뢰할 </span><span>수 </span><span>있는 </span><span>중앙 </span><span>구성 </span><span>요소를 </span><span>통해서만 </span><span>이루어지도록 </span><span>설계한다.</span></p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="396" data-origin-width="353"><span data-phocus="https://blog.kakaocdn.net/dna/YTalq/dJMcacx8J1p/AAAAAAAAAAAAAAAAAAAAAEQmb7sJH2qGWV6KgNDjWxD_iwQQOQMHj7kfyRmNNtOE/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=kHYJwWohpy34%2BPacuOA%2FFtMu0tc%3D" data-url="https://blog.kakaocdn.net/dna/YTalq/dJMcacx8J1p/AAAAAAAAAAAAAAAAAAAAAEQmb7sJH2qGWV6KgNDjWxD_iwQQOQMHj7kfyRmNNtOE/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=kHYJwWohpy34%2BPacuOA%2FFtMu0tc%3D"><img data-origin-height="396" data-origin-width="353" height="396" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/YTalq/dJMcacx8J1p/AAAAAAAAAAAAAAAAAAAAAEQmb7sJH2qGWV6KgNDjWxD_iwQQOQMHj7kfyRmNNtOE/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=kHYJwWohpy34%2BPacuOA%2FFtMu0tc%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FYTalq%2FdJMcacx8J1p%2FAAAAAAAAAAAAAAAAAAAAAEQmb7sJH2qGWV6KgNDjWxD_iwQQOQMHj7kfyRmNNtOE%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DkHYJwWohpy34%252BPacuOA%252FFtMu0tc%253D" width="353"/></span></figure>
<div>
<div>
<div>
<div>
<div>
<div> </div>
</div>
</div>
</div>
</div>
</div>
<span><span></span></span>
<p data-ke-size="size18"><span> </span><span>Hub </span><span>— </span><span>중앙 </span><span>관리 </span><span>구성 </span><span>요소</span></p>
<p data-ke-size="size16"><span>Hub는 </span><span>사용자의 </span><span>요청을 </span><span>수신하고 </span><span>어떤 </span><span>애플리케이션을 </span><span>사용할지 </span><span>결정하며, </span><span>앱 </span><span>간 </span><span>상호작용을 </span><span>관리하는 </span><span>신뢰할 </span><span>수 </span><span>있는 </span><span>구성 </span><span>요소이다. </span><span>Hub는 </span><span>크게 </span><span>세 </span><span>가지 </span><span>요소로 </span><span>구성된다.</span></p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>
<div>
<p data-ke-size="size16"><span><span>Hub </span><span>Operator:</span></span> <span>LLM에 </span><span>의존하지 </span><span>않는 </span><span>모듈로, </span><span>앱 </span><span>호출 </span><span>및 </span><span>메시지 </span><span>전달 </span><span>흐름을 </span><span>관리한다.</span></p>
</div>
</li>
<li>
<div>
<div>
<p data-ke-size="size16"><span><span>Hub </span><span>Planner:</span></span> <span>사용자 </span><span>요청을 </span><span>분석하여 </span><span>필요한 </span><span>애플리케이션과 </span><span>작업 </span><span>계획을 </span><span>결정한다.</span></p>
</div>
</div>
</li>
<li>
<div>
<div>
<p data-ke-size="size16"><span><span>Hub </span><span>Memory:</span></span> <span>사용자와 </span><span>시스템의 </span><span>대화 </span><span>기록 </span><span>및 </span><span>필요한 </span><span>문맥 </span><span>정보를 </span><span>관리한다.</span></p>
</div>
</div>
</li>
</ol>
<p data-ke-size="size18"><span>Spoke </span><span>— </span><span>앱별 </span><span>독립 </span><span>실행 </span><span>환경</span></p>
<p data-ke-size="size16"><span>각 </span><span>애플리케이션은 </span><span>별도의 </span><span>Spoke에서 </span><span>실행되며, </span><span>Spoke마다 </span><span>독립적인 </span><span>LLM </span><span>인스턴스와 </span><span>메모리를 </span><span>사용한다.</span></p>
<p data-ke-size="size16"><span>기존 </span><span>시스템이 </span><span>하나의 </span><span>LLM </span><span>문맥에서 </span><span>여러 </span><span>앱을 </span><span>처리했다면, </span><span>IsolateGPT는 </span><span>앱별 </span><span>실행 </span><span>환경을 </span><span>분리하여 </span><span>악성 </span><span>지시가 </span><span>다른 </span><span>앱의 </span><span>문맥에 </span><span>직접 </span><span>영향을 </span><span>미치지 </span><span>못하도록 </span><span>한다.</span></p>
<p data-ke-size="size16"><span>예를 </span><span>들어 </span><span>이메일 </span><span>앱이 </span><span>악성 </span><span>이메일을 </span><span>처리하는 </span><span>과정에서 </span><span>영향을 </span><span>받더라도, </span><span>해당 </span><span>앱이 </span><span>클라우드 </span><span>드라이브의 </span><span>데이터까지 </span><span>자유롭게 </span><span>조회할 </span><span>수는 </span><span>없다. </span><span>즉, </span><span>한 </span><span>앱에서 </span><span>발생한 </span><span>보안 </span><span>문제가 </span><span>다른 </span><span>앱으로 </span><span>확산되는 </span><span>범위를 </span><span>제한한다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><span> </span><span>ISC </span><span>— </span><span>앱 </span><span>간 </span><span>안전한 </span><span>통신 </span><span>프로토콜</span></p>
<p data-ke-size="size16"><span>애플리케이션을 </span><span>격리하면 </span><span>보안성은 </span><span>높아지지만 </span><span>앱 </span><span>간 </span><span>협업이 </span><span>어려워질 </span><span>수 </span><span>있다. </span><span>이를 </span><span>해결하기 </span><span>위해 </span><span>논문에서는 </span><span><span>Inter-Spoke </span><span>Communication(ISC)</span></span> <span>프로토콜을 </span><span>제안한다. </span><span>ISC는 </span><span>앱들이 </span><span>직접 </span><span>통신하지 </span><span>않고 </span><span>Hub를 </span><span>통해 </span><span>정해진 </span><span>형식의 </span><span>메시지를 </span><span>주고받도록 </span><span>한다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>또한 </span><span>메시지의 </span><span>형식을 </span><span>검증하고, </span><span>필요한 </span><span>경우 </span><span>사용자에게 </span><span>앱 </span><span>간 </span><span>데이터 </span><span>공유나 </span><span>접근에 </span><span>대한 </span><span>권한을 </span><span>요청한다.</span><span>이를 </span><span>통해 </span><span>앱 </span><span>간 </span><span>협업 </span><span>기능을 </span><span>유지하면서도 </span><span>신뢰할 </span><span>수 </span><span>없는 </span><span>명령이 </span><span>다른 </span><span>앱으로 </span><span>전달되는 </span><span>것을 </span><span>제한한다.</span></p>
<h2 data-ke-size="size26"><span>4 </span><span>실험 </span><span>설계 </span><span>및 </span><span>주요 </span><span>결과</span></h2>
<h3 data-ke-size="size23"><span>실험 </span><span>설계</span></h3>
<p data-ke-size="size16"><span>연구진은 </span><span>동일한 </span><span>기능을 </span><span>제공하는 </span><span>두 </span><span>가지 </span><span>시스템을 </span><span>비교하였다.</span></p>
<div><br/>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>VanillaGPT</span></span></td>
<td><span><span>별도의 </span><span>실행 </span><span>격리가 </span><span>없는 </span><span>기존 </span><span>LLM </span><span>애플리케이션 </span><span>구조</span></span></td>
</tr>
<tr>
<td><span><span>IsolateGPT</span></span></td>
<td><span><span>Hub-and-Spoke </span><span>기반 </span><span>실행 </span><span>격리와 </span><span>접근 </span><span>통제 </span><span>적용</span></span></td>
</tr>
</tbody>
</table>
</div>
<p data-ke-size="size16"><span>두 </span><span>시스템 </span><span>모두 </span><span>GPT-4 </span><span>API를 </span><span>사용했다.</span></p>
<p data-ke-size="size16"><span>보안성 </span><span>평가에서는 </span><span>기존 </span><span>INJECAGENT의 </span><span>1,054개 </span><span>테스트 </span><span>케이스에 </span><span>시스템 </span><span>데이터 </span><span>탈취 </span><span>공격 </span><span>544개를 </span><span>추가하여 </span><span>총 </span><span>1,598개의 </span><span>공격 </span><span>사례를 </span><span>구성하였다.</span></p>
<div>
<div>
<div> </div>
</div>
</div>
<h3 data-ke-size="size23"><span>주요 </span><span>실험 </span><span>결과</span></h3>
<div>
<div>
<div> </div>
<div><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="283" data-origin-width="349"><span data-phocus="https://blog.kakaocdn.net/dna/ta2v2/dJMcafhnbOw/AAAAAAAAAAAAAAAAAAAAAIEhe4AAdAUzVw3LqTI4Y_VMToSOHM24kY565sglrQrt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=eXFDpQRIiykhS00QMzViRScoZG0%3D" data-url="https://blog.kakaocdn.net/dna/ta2v2/dJMcafhnbOw/AAAAAAAAAAAAAAAAAAAAAIEhe4AAdAUzVw3LqTI4Y_VMToSOHM24kY565sglrQrt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=eXFDpQRIiykhS00QMzViRScoZG0%3D"><img data-origin-height="283" data-origin-width="349" height="283" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/ta2v2/dJMcafhnbOw/AAAAAAAAAAAAAAAAAAAAAIEhe4AAdAUzVw3LqTI4Y_VMToSOHM24kY565sglrQrt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=eXFDpQRIiykhS00QMzViRScoZG0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fta2v2%2FdJMcafhnbOw%2FAAAAAAAAAAAAAAAAAAAAAIEhe4AAdAUzVw3LqTI4Y_VMToSOHM24kY565sglrQrt%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DeXFDpQRIiykhS00QMzViRScoZG0%253D" width="349"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>격리되지 </span><span>않은 </span><span>VanillaGPT에서는 </span><span>전체 </span><span>공격의 </span><span>평균 </span><span>20.2%가 </span><span>성공하였다.</span><span>반면 </span><span>IsolateGPT에서는 </span><span>공격에 </span><span>따른 </span><span>추가 </span><span>접근이 </span><span>필요한 </span><span>상황에서 </span><span>권한 </span><span>요청이 </span><span>발생하였으며, </span><span>발생한 </span><span>권한 </span><span>요청에는 </span><span>모두 </span><span>경고가 </span><span>포함되었다.</span><span>다만 </span><span>IsolateGPT의 </span><span>실제 </span><span>방어 </span><span>성공은 </span><span>사용자가 </span><span>악성 </span><span>접근 </span><span>요청을 </span><span>거부하는지에 </span><span>영향을 </span><span>받는다.</span></p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="240" data-origin-width="372"><span data-phocus="https://blog.kakaocdn.net/dna/bbk9JT/dJMcafV1Fxf/AAAAAAAAAAAAAAAAAAAAABZR7ZuxJgxVpScRX0Kv66Fw1KBNdDHPdZveOVPdMD2S/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=zKZaHgzfK7xFcc4ZWHODeylwhMM%3D" data-url="https://blog.kakaocdn.net/dna/bbk9JT/dJMcafV1Fxf/AAAAAAAAAAAAAAAAAAAAABZR7ZuxJgxVpScRX0Kv66Fw1KBNdDHPdZveOVPdMD2S/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=zKZaHgzfK7xFcc4ZWHODeylwhMM%3D"><img data-origin-height="240" data-origin-width="372" height="240" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bbk9JT/dJMcafV1Fxf/AAAAAAAAAAAAAAAAAAAAABZR7ZuxJgxVpScRX0Kv66Fw1KBNdDHPdZveOVPdMD2S/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=zKZaHgzfK7xFcc4ZWHODeylwhMM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbbk9JT%2FdJMcafV1Fxf%2FAAAAAAAAAAAAAAAAAAAAABZR7ZuxJgxVpScRX0Kv66Fw1KBNdDHPdZveOVPdMD2S%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DzKZaHgzfK7xFcc4ZWHODeylwhMM%253D" width="372"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>LangChain </span><span>벤치마크를 </span><span>이용한 </span><span>기능 </span><span>평가에서 </span><span>단일 </span><span>앱과 </span><span>여러 </span><span>앱 </span><span>사용 </span><span>시나리오 </span><span>모두 </span><span>기존 </span><span>시스템과 </span><span>동일한 </span><span>정확도를 </span><span>보였다. </span><span>앱 </span><span>간 </span><span>협업이 </span><span>필요한 </span><span>작업에서도 </span><span>최종 </span><span>결과 </span><span>정확도가 </span><span>두 </span><span>시스템 </span><span>모두 </span><span>0.95로 </span><span>나타났다. </span><span>이는 </span><span>실행 </span><span>격리가 </span><span>반드시 </span><span>앱 </span><span>간 </span><span>협업 </span><span>기능의 </span><span>감소로 </span><span>이어지는 </span><span>것은 </span><span>아니라는 </span><span>점을 </span><span>보여준다.</span></p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="227" data-origin-width="359"><span data-phocus="https://blog.kakaocdn.net/dna/kLuyL/dJMcadKvIH3/AAAAAAAAAAAAAAAAAAAAAFMdKi6d5DOtrjyE_lNF7cjhFM6SIe71zGX93NTSzIs2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=bN8PRRk8s23h3zGxF%2B%2BjSsOOGyE%3D" data-url="https://blog.kakaocdn.net/dna/kLuyL/dJMcadKvIH3/AAAAAAAAAAAAAAAAAAAAAFMdKi6d5DOtrjyE_lNF7cjhFM6SIe71zGX93NTSzIs2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=bN8PRRk8s23h3zGxF%2B%2BjSsOOGyE%3D"><img data-origin-height="227" data-origin-width="359" height="227" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/kLuyL/dJMcadKvIH3/AAAAAAAAAAAAAAAAAAAAAFMdKi6d5DOtrjyE_lNF7cjhFM6SIe71zGX93NTSzIs2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=bN8PRRk8s23h3zGxF%2B%2BjSsOOGyE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FkLuyL%2FdJMcadKvIH3%2FAAAAAAAAAAAAAAAAAAAAAFMdKi6d5DOtrjyE_lNF7cjhFM6SIe71zGX93NTSzIs2%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DbN8PRRk8s23h3zGxF%252B%252BjSsOOGyE%253D" width="359"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>전체 </span><span>테스트 </span><span>질의의 </span><span>약 </span><span>75.73%에서 </span><span>IsolateGPT의 </span><span>실행시간 </span><span>오버헤드는 </span><span>VanillaGPT </span><span>대비 </span><span>30% </span><span>미만이었다. </span><span>그러나 </span><span>여러 </span><span>앱을 </span><span>사용하거나 </span><span>앱 </span><span>간 </span><span>협업이 </span><span>필요한 </span><span>상황에서는 </span><span>Hub와 </span><span>Spoke의 </span><span>추가 </span><span>계획 </span><span>수립 </span><span>및 </span><span>메모리 </span><span>처리로 </span><span>인해 </span><span>실행 </span><span>시간이 </span><span>증가했다. </span><span>또한 </span><span>일부 </span><span>질의를 </span><span>대상으로 </span><span>분석한 </span><span>API </span><span>사용 </span><span>비용은 </span><span>기존 </span><span>시스템 </span><span>대비 </span><span>약 </span><span>1.85배였다. </span><span>따라서 </span><span><span>보안 </span><span>격리를 </span><span>통해 </span><span>위험을 </span><span>줄이고 </span><span>기능을 </span><span>유지할 </span><span>수 </span><span>있지만, </span><span>실행시간 </span><span>및 </span><span>비용 </span><span>증가가 </span><span>발생한다는 </span><span>점</span></span><span>을 </span><span>확인하였다. </span><span><span></span></span></p>
<div>
<div>
<div> </div>
</div>
<div>
<div> </div>
</div>
</div>
</div>
</div>
</div>
<h2 data-ke-size="size26"><span>본 </span><span>논문의 </span><span>연구적 </span><span>기여</span></h2>
<div>
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
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26"><span>본 </span><span>논문의 </span><span>한계점</span></h2>
<p data-ke-size="size16"><span>앞에서 </span><span>Agent </span><span>Smith의 </span><span>한계점을 </span><span>작성했던 </span><span>것과 </span><span>동일하게 </span><span>두 </span><span>문단으로 </span><span>정리하면 </span><span>다음과 </span><span>같다.</span></p>
<div>
<div>
<div>
<div>
<p data-ke-size="size16"><span>IsolateGPT는 각 애플리케이션의 실행 환경을 격리하여 앱 간 공격 전파를 제한하지만, 개별 애플리케이션 내부에서 발생하는 Prompt Injection이나 악성 행동까지 방지하지는 못한다. 또한 중앙 Hub와 시스템 LLM이 신뢰할 수 있고 침해되지 않았다는 가정을 전제로 하며, 앱 간 데이터 공유 및 접근 통제 과정에서 사용자 권한 승인에 의존한다. 따라서 사용자가 악성 요청을 잘못 승인하거나 신뢰할 수 있는 구성 요소의 판단이 잘못되는 상황에서는 보안성을 완전히 보장하기 어렵다.</span></p>
<p data-ke-size="size16"><span>그리고 실험이 주로 GPT-4 기반의 시뮬레이션 환경과 제한된 벤치마크를 대상으로 수행되어 다양한 LLM 및 실제 운영 환경에서의 보안 효과를 일반화하기 어렵다. 특히 복잡한 다중 애플리케이션 협업과 동적인 실행 환경을 충분히 반영하지 못하였으며, 앱별 독립적인 LLM 실행과 Hub를 통한 통신 과정에서 추가적인 실행시간 및 비용이 발생한다. 또한 권한 관리 모델이 제한적인 시나리오를 대상으로 설계되어 있어, 복잡한 앱 간 정보 흐름과 실행 계획의 안전성을 더욱 정교하게 검증할 필요가 있다는 한계가 있다.</span></p>
</div>
</div>
</div>
</div>
<p data-ke-size="size16"><span>여기서 </span><span><span>앱 </span><span>내부 </span><span>공격이 </span><span>방어 </span><span>범위 </span><span>밖이라는 </span><span>점은 </span><span>논문 </span><span>Section </span><span>III-D에서 </span><span>명시한 </span><span>한계</span></span><span>이며, </span><span>실험 </span><span>환경 </span><span>및 </span><span>권한 </span><span>모델의 </span><span>제한도 </span><span>원문에서 </span><span>확인된다. </span><span>반면 </span><span>실행 </span><span>계획의 </span><span>안전성 </span><span>검증을 </span><span>강화해야 </span><span>한다는 </span><span>부분은 </span><span>후속 </span><span>연구 </span><span>ACE와 </span><span>연결하기 </span><span>위한 </span><span>추가적인 </span><span>분석이다. </span><span><span></span></span></p>
<div>
<div>
<div> </div>
</div>
<div>
<div> </div>
</div>
</div>
<div>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26"><span>후속 연구 2편</span></h2>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23"><span>1. 연구 배경 및 핵심 문제</span></h3>
<p data-ke-size="size16"><span><span>논문명:</span></span> <span><span>ACE: </span><span>A </span><span>Security </span><span>Architecture </span><span>for </span><span>LLM-Integrated </span><span>App </span><span>Systems</span></span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>기존 IsolateGPT는 애플리케이션별 실행 환경을 격리하고 앱 간 상호작용을 중앙 Hub에서 관리하여 악성 앱의 영향이 다른 앱으로 확산되는 것을 제한하였다. </span><span>그러나 실행 환경이 격리되어 있더라도 </span><span>악성 앱의 설명이나 실행 결과가 중앙 LLM의 작업 계획과 실행 흐름을 조작할 수 있다는 문제</span><span>가 남아 있었다.</span></p>
<p data-ke-size="size16"><span>특히 IsolateGPT는 작업 계획을 생성할 때 앱 설명을 참고하고, 실행 과정에서는 앱의 출력을 중앙 Execution Manager LLM에 전달한다. 따라서 악성 앱이 이러한 정보를 조작하면 실행 격리가 존재하더라도 다른 정상 앱의 실행을 방해하거나 결과를 변조할 수 있다.</span></p>
<p data-ke-size="size16"><span>ACE는 이러한 문제를 해결하기 위해 단순한 앱 실행 격리를 넘어, </span><span>작업 계획의 무결성과 실행 과정의 무결성을 함께 보장하는 것</span><span>을 연구 목표로 설정하였다.</span></p>
<h3 data-ke-size="size23"><span>2. 선행 연구 분석 및 한계</span></h3>
<p data-ke-size="size16"><span>기존 LLM Agent 보안 연구에서는 Prompt Injection 방어를 위해 명령과 데이터의 구분, 정보 흐름 통제, 앱별 실행 격리 등을 연구하였다.</span></p>
<p data-ke-size="size16"><span>대표적으로 f-Secure는 신뢰할 수 있는 정보와 신뢰할 수 없는 정보를 분리하여 악성 데이터가 계획 단계에 영향을 주지 못하도록 하였으며, IsolateGPT는 Hub-and-Spoke 구조를 통해 앱 간 실행 환경을 격리하였다.</span></p>
<p data-ke-size="size16"><span>하지만 두 연구 모두 </span><span>앱의 설명과 스키마를 신뢰할 수 있다는 가정</span><span>에 의존하는 문제가 있었다. 또한 IsolateGPT는 실행 과정에서 악성 앱의 출력을 중앙 LLM의 문맥에 전달하기 때문에 공격자가 후속 실행 흐름에 영향을 줄 수 있었다. </span><span>ACE 연구진은 실제 IsolateGPT를 대상으로 다음 세 가지 공격을 수행하여 이러한 한계를 확인하였다.</span></p>
<br/>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><b><span>Planner Manipulation</span></b></td>
<td><span>악성 앱이 자신의 설명에 명령을 삽입하여 정상 앱이 작업 계획에서 제외되도록 유도</span></td>
</tr>
<tr>
<td><b><span>Execution Flow Disruption</span></b></td>
<td><span>악성 앱의 출력을 통해 Execution Manager가 정상 작업을 중단하도록 유도</span></td>
</tr>
<tr>
<td><b><span>Execution Manager Hijack</span></b></td>
<td><span>악성 앱의 출력으로 중앙 Execution Manager를 조작하여 다른 정상 앱의 결과까지 변조</span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23"><span>3. 제안 방법 및 시스템 아키텍처</span></h3>
<p data-ke-size="size16"><span>ACE는 이러한 문제를 해결하기 위해 </span><span>Abstract-Concrete-Execute 아키텍처</span><span>를 제안하였다.</span></p>
<p data-ke-size="size16"><span>기존 IsolateGPT에서는 계획과 실행이 반복적으로 이루어졌지만, ACE는 작업 계획을 실행 전에 생성하고 검증한 뒤 정해진 계획에 따라 실행하도록 구조를 변경하였다.</span></p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="254" data-origin-width="758"><span data-phocus="https://blog.kakaocdn.net/dna/bqhfL5/dJMcab659eL/AAAAAAAAAAAAAAAAAAAAAPUfc44Zkjrva35LjW2M3JuPv3NdYVR0j0J66iC-7o09/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=On1siqLb%2BpR67ER9yOz%2F6JXN510%3D" data-url="https://blog.kakaocdn.net/dna/bqhfL5/dJMcab659eL/AAAAAAAAAAAAAAAAAAAAAPUfc44Zkjrva35LjW2M3JuPv3NdYVR0j0J66iC-7o09/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=On1siqLb%2BpR67ER9yOz%2F6JXN510%3D"><img data-origin-height="254" data-origin-width="758" height="254" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bqhfL5/dJMcab659eL/AAAAAAAAAAAAAAAAAAAAAPUfc44Zkjrva35LjW2M3JuPv3NdYVR0j0J66iC-7o09/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=On1siqLb%2BpR67ER9yOz%2F6JXN510%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbqhfL5%2FdJMcab659eL%2FAAAAAAAAAAAAAAAAAAAAAPUfc44Zkjrva35LjW2M3JuPv3NdYVR0j0J66iC-7o09%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DOn1siqLb%252BpR67ER9yOz%252F6JXN510%253D" width="758"/></span></figure>
<p data-ke-size="size18"><span> Abstract Planning — 추상 계획 생성</span></p>
<p data-ke-size="size18"> </p>
<p data-ke-size="size16"><span>신뢰할 수 있는 사용자 요청만을 이용하여 추상적인 작업 계획을 생성한다. </span><span>이때 실제 설치된 앱의 설명이나 출력은 참조하지 않으므로, 악성 앱이 자신의 설명을 조작하더라도 최초 작업 계획에 영향을 주기 어렵다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><span> Concrete Planning — 실제 앱 연결 및 검증</span></p>
<p data-ke-size="size18"> </p>
<p data-ke-size="size16"><span>추상 계획에 정의된 기능을 실제 설치된 애플리케이션과 연결하여 구체적인 실행 계획을 생성한다. </span><span>각 추상 기능과 실제 앱의 적합성을 독립적으로 판단하여 악성 앱이 다른 정상 앱의 선택을 방해하지 못하도록 한다. </span><span>또한 정적 분석과 정보 흐름 통제를 통해 민감한 데이터가 권한이 없는 앱으로 전달되는 실행 계획을 사전에 차단한다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><span> Execute — 격리된 환경에서 계획 실행</span></p>
<p data-ke-size="size18"> </p>
<p data-ke-size="size16"><span>검증된 실행 계획에 따라 각 앱을 독립적인 실행 환경에서 동작시킨다. </span><span>실행 과정에서는 최소 권한 원칙을 적용하며, 앱의 출력이 LLM의 실행 흐름을 임의로 변경하지 못하도록 제한한다. </span><span>이를 통해 ACE는 단순히 앱을 격리하는 것을 넘어 </span><span>신뢰할 수 있는 계획을 먼저 생성하고, 보안 정책을 검증한 뒤, 그 계획대로 실행하는 구조</span><span>를 구현하였다.</span></p>
<h3 data-ke-size="size23"><span>4. 실험 설계 및 주요 결과</span></h3>
<p data-ke-size="size16">ACE 연구진은 기존 IsolateGPT의 보안 한계를 검증하기 위해 IsolateGPT에서 발견한 세 가지 공격인 <span>Planner Manipulation, Execution Flow Disruption, Execution Manager Hijack을 ACE에 적용하여 방어 성능을 비교하였다. </span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>이에 실험 결과 IsolateGPT에서 성공했던 세 가지 공격은 ACE 환경에서 모두 실패하였다. 이를 통해 실행 격리 구조에서 발생했던 작업 계획 조작과 흐름 변조 문제를 ACE의 새로운 아키텍처가 방어할 수 있음을 확인.</span><span></span></p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="361" data-origin-width="355"><span data-phocus="https://blog.kakaocdn.net/dna/csyf7Y/dJMcagtLPcg/AAAAAAAAAAAAAAAAAAAAAPpRBfnGRhrGzpYLNak-RXpQDcwQ2ZfDXWtn1QgY9XJo/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=%2FmTlYvU%2F72ijflzzuZCFE3gG9X4%3D" data-url="https://blog.kakaocdn.net/dna/csyf7Y/dJMcagtLPcg/AAAAAAAAAAAAAAAAAAAAAPpRBfnGRhrGzpYLNak-RXpQDcwQ2ZfDXWtn1QgY9XJo/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=%2FmTlYvU%2F72ijflzzuZCFE3gG9X4%3D"><img data-origin-height="361" data-origin-width="355" height="361" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/csyf7Y/dJMcagtLPcg/AAAAAAAAAAAAAAAAAAAAAPpRBfnGRhrGzpYLNak-RXpQDcwQ2ZfDXWtn1QgY9XJo/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=%2FmTlYvU%2F72ijflzzuZCFE3gG9X4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fcsyf7Y%2FdJMcagtLPcg%2FAAAAAAAAAAAAAAAAAAAAAPpRBfnGRhrGzpYLNak-RXpQDcwQ2ZfDXWtn1QgY9XJo%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D%252FmTlYvU%252F72ijflzzuZCFE3gG9X4%253D" width="355"/></span></figure>
<p data-ke-size="size16"> </p>
</div>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">추가적으로 IsloateGPT에서도 보안성 평가에 활용했던 INJECAGENT 벤치마크를 이용하여 기존 PI 공격에 대한 방어 성능을 검증</p>
<p data-ke-size="size16">-&gt; 모든 테스트 케이스에서 공격자가 의도한 앱 실행을 모두 차단하여 100%의 보안 점수를 기록</p>
<p data-ke-size="size16"> </p>
<div>
<div>
<div> 결과적으로 ACE는 IsoateGPT에서 성공한 공격을 방어하는 동시에 기존 IPI 벤치마크에서도 높은 보안 성능을 보였다.</div>
</div>
</div>
</div>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">후속 연구 2</h3>
<p data-ke-size="size16"><span><span>논문명:</span></span> <span><span>ACIArena: </span><span>Toward </span><span>Unified </span><span>Evaluation </span><span>for </span><span>Agent </span><span>Cascading </span><span>Injection</span></span></p>
<h3 data-ke-size="size23"><span>1. 연구 배경 및 핵심 문제</span></h3>
<p data-ke-size="size16"><span>기존 IsolateGPT와 ACE는 LLM 기반 애플리케이션 시스템에서 발생하는 악성 명령 실행과 데이터 유출을 방지하기 위해 실행 환경의 격리, 작업 계획 검증 및 정보 흐름 통제 등의 보안 구조를 제안하였다. </span><span>그러나 Multi-Agent System(MAS)에서는 여러 Agent가 서로 정보를 교환하고 협업하므로, 하나의 Agent가 악성 명령에 영향을 받으면 해당 명령이 다른 Agent에게 전달되어 연쇄적인 보안 문제로 확산될 수 있다.</span></p>
<p data-ke-size="size16"><span>이러한 공격을 Agent Cascading Injection(ACI)이라고 하며, 기존 연구에서는 특정 Agent나 단순한 통신 구조를 대상으로 공격을 평가하는 경우가 많았다. </span><span>ACIArena는 이러한 문제에 주목하여 </span><span>다양한 Multi-Agent 시스템에서 악성 명령이 전파되는 과정과 보안 취약성을 일관된 조건에서 평가하는 것</span><span>을 연구 목표로 설정하였다.</span></p>
<h3 data-ke-size="size23"><span>2. 선행 연구 분석 및 한계</span></h3>
<p data-ke-size="size16"><span>기존 INJECAGENT와 Agent Security Bench 등의 연구에서는 LLM Agent에 대한 Prompt Injection 공격을 정량적으로 평가하였다.  </span><span>또한 Agent Smith와 같은 연구에서는 하나의 Agent에 삽입된 악성 콘텐츠가 다른 Agent에게 전달되어 전체 시스템으로 공격이 확산될 수 있음을 확인하였다.</span></p>
<p data-ke-size="size16"><span>그러나 기존 연구는 특정 공격 방식이나 제한된 Multi-Agent 구조를 대상으로 실험하였기 때문에, 서로 다른 협업 구조에서 발생하는 보안 취약성을 동일한 기준으로 비교하기 어려웠다.</span></p>
<p data-ke-size="size16"><span>특히 공격이 삽입되는 위치와 공격 목표가 제한적이었으며, 기존 방어 기법이 복잡한 Multi-Agent 환경에서도 효과적으로 작동하는지에 대한 검증이 부족하였다.</span></p>
<p data-ke-size="size16"><span>따라서 </span><span>Agent 간 상호작용 구조와 역할, 공격 전파 경로를 함께 고려할 수 있는 통합적인 보안 평가 환경</span><span>이 필요하였다.</span></p>
<h3 data-ke-size="size23"><span>3. 제안 방법 및 평가 프레임워크</span></h3>
<p data-ke-size="size16"><span>ACIArena는 이러한 문제를 해결하기 위해 </span><span>Multi-Agent System의 Agent Cascading Injection 취약성을 통합적으로 평가하는 벤치마크 프레임워크</span><span>를 제안하였다. </span><span>먼저 공격이 발생하는 위치를 세 가지로 구분하였다.</span></p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><b><span>Adversarial Input</span></b></td>
<td><span>Agent의 입력이나 메모리, 도구 설명 등에 악성 명령 삽입</span></td>
</tr>
<tr>
<td><b><span>Malicious Agent</span></b></td>
<td><span>Agent의 역할 및 프로필을 조작하여 악성 행동 유도</span></td>
</tr>
<tr>
<td><b><span>Message Poison</span></b></td>
<td><span>Agent 사이에서 교환되는 메시지를 악성 내용으로 변조</span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"><span>또한 공격 목표를 정상 명령을 벗어나게 하는 Hijacking, 작업 수행을 방해하는 Disruption, 민감한 정보를 유출하는 Exfiltration으로 구분하였다. </span><span>이를 기반으로 </span><span>총 28개의 공격 방식과 1,356개의 테스트 케이스</span><span>를 구성하였다.</span></p>
<p data-ke-size="size16"><span>평가 대상에는 AutoGen, CAMEL, MetaGPT, AgentVerse, Self Consistency, LLM Debate 등 6개의 Multi-Agent 구현을 포함하였다. </span><span>추가적으로 공격 성공률(ASR)뿐 아니라 정상 작업 수행 능력(BU), 공격 상황에서의 작업 수행 능력(UA), 악성 명령의 전파 취약성을 나타내는 PVI를 이용하여 시스템의 보안성을 분석하였다.</span></p>
<h3 data-ke-size="size23"><span>4. 실험 설계 및 주요 결과</span></h3>
<p data-ke-size="size16"><span>연구진은 GPT-4o, GPT-4o-mini, Qwen2.5-7B-Instruct를 활용하여 다양한 Multi-Agent 구조에서 ACI 공격의 성공률과 전파 양상을 비교하였다. </span><span>실험 결과, </span><span>Agent의 통신 구조가 복잡하다고 해서 반드시 보안성이 높아지는 것은 아니라는 점</span><span>을 확인하였다. 동일한 통신 구조에서도 Agent의 역할 설정에 따라 공격 성공률이 크게 달라졌으며, 동일한 역할 구성에서도 통신 방식에 따라 취약성이 달라졌다.</span></p>
<p data-ke-size="size16"><span>특히 코드 생성 작업에서는 여러 Multi-Agent 시스템의 공격 성공률이 높게 나타났다. 예를 들어 GPT-4o-mini 기반 LLM Debate의 코드 생성 환경에서는 Hijacking 공격 성공률이 100%에 도달하였다. 이는 Agent 간 협업 과정에서 악성 지시가 최종 결과에 직접적인 영향을 줄 수 있음을 보여준다.</span></p>
<p data-ke-size="size16"><span>추가적으로 기존 방어 기법인 BERT Detector, Delimiter, Sandwich, AGrail, G-Safeguard의 효과를 비교하였다. 일부 방어 기법은 공격 성공률을 낮추었지만 정상 작업 수행 능력도 감소시켰으며, 특정 상황에서는 오히려 공격을 강화하는 현상이 관찰되었다.</span></p>
<p data-ke-size="size16"><span>이에 연구진은 작업에 필요한 정보만 Agent의 문맥에 남기는 </span><span>ACI-SENTINEL</span><span> 방어 방식을 추가로 제안하였다. 실험에서 AutoGen의 코드 생성 환경에 대한 Exfiltration 공격 성공률은 54.00%에서 0.22%로 감소하였다.</span></p>
<p data-ke-size="size16"><span>결과적으로 ACIArena는 </span><span>개별 Agent의 취약성이나 앱 실행 격리를 넘어, Multi-Agent의 역할과 통신 구조에 따른 공격 전파 및 방어 효과를 종합적으로 평가하는 연구</span><span>로 보안 연구 범위를 확장하였다.</span></p>
