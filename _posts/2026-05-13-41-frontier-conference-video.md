---
layout: post
title: 프론티어_해외 컨퍼런스 영상 분석
date: 2026-05-13
desc: "음성 복제 피싱 공격 사례 분석 및 AI 시대 해커적 사고 방법론"
keywords: "음성복제, 딥보이스, 음성클로닝, 피싱, AI 보안, 해커적 사고, 프론티어"
categories: [Paper-Conference]
tags: [프론티어, AI 보안, 음성보안]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/41](https://sanghole.tistory.com/41)

<p data-ke-size="size16">그전에 공모전에서 엣지디바이스 기반 딥보이스 솔루션에 대한 아이디어를 냈었는데 아쉽게 떨어져서 그것과 관련있는 영상을 분석해보려고 한다.</p>
<p data-ke-size="size16"><a href="https://www.youtube.com/watch?v=JPCKg_3XLP8&amp;t=31s" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=JPCKg_3XLP8&amp;t=31s</a></p>
<h2 data-ke-size="size26">연구의 배경</h2>
<p data-ke-size="size16">현재 여러 은행에서는 음성 인증을 계정에 로그인하기 위한 인증 수단으로 많이들 사용을 하게 된다. 하지만 음성 복제를 통해 쉽게 인증을 대체할 수 있고, 은행을 속일 수 있따.</p>
<p data-ke-size="size16">또한 요즘에 나오는 피싱과 관련된 수법에서는 자녀가 도움을 요청하며 주변 지인들의 목소리들을 클로닝해서 당사자에게 전화를 한 후 익숙한 목소리로 다급하게 살려달라고, 돈을 주면 풀려난다고 이야기한다.&nbsp; 이러한 음성 클로닝 자체가 5분정도만 있으면 금방 시도할 수 있다고 한다..</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이러한 문제점들 때문에 음성 복제 공격에 대한 보안에 틀이 잡혀야 하며, 연구를 지속해야한 다고 말한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h2 data-ke-size="size26">연구 진행.</h2>
<p data-ke-size="size16">실제로 대학의 교수님들 여러 명의 목소리를 복제하여서 악의적인 메세지를 만들면서 교수님 소개-&gt; 수업 등록 업데이트를 위해 학생의 ID 번호를 요구하였다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">해당 실험에 셋업에서는 실제로 교수님의 음성을 사용한 적도 있고, AI 클로닝을 한 적도 있다. 또한&nbsp;</p>
<p data-ke-size="size16">1. 교수님은 이미 학생 ID 번호를 알고 있다는 것.</p>
<p data-ke-size="size16">2. 교수님의 번호가 아니라 이상한 번호로 전화가 왔다는 것.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그래서 응답을 보낸 학생들을 4가지의 분류로 나누었다.</p>
<p data-ke-size="size16">1. 응답 없음</p>
<p data-ke-size="size16">2. 실제로 신고를 한 사람</p>
<p data-ke-size="size16">3. 자신의 ID 응답을 제출한 사람.</p>
<p data-ke-size="size16">4. 정말로 교수님이 맞는지 확인한 사람.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그래도 여기서 얻은 것은 알 수 없는 전화번호에서 온 것은 신뢰하지 않는 연구 결과도 얻게 되었다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">또한 음성 파일 뿐만 아니라 문자를 이용해서도 요청을 했었는데, 문자 메세지에 대한 응답은 엄청 많았다. 하지만 음성 합성의 경우 응답률이 낮은 것을 확인할 수 있었다. 교수님의 실제 녹음본/AI 클로닝의 응답률 차이는 거의 미묘했다. 하지만 그 작은 응답률에서 AI 클로닝과 실제 녹음본의 진위 차이를 느낄 수는 없었다고 한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">오히려 음성 복제본이 실제 사람보다 더 자연스럽게 들렸다고 하여, 피싱이 아닌 실제 교수님의 녹음본을 신고한 사례도 있다고 한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">이러한 실험을 통해서..</h3>
<p data-ke-size="size16">사람들은 보안에 관심이 없으면 사실 이러한 음성 복제 기술들이 실제로 공격에 사용된 다는 것을 모르고 있을 것 이다. 그래서 이러한 음성 인식 기술에 대한 보안에 대해서 소개를 해야한다고 하며 마무리지었다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">뭔가 짧은 것 같아서 하나 더</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><a href="https://www.youtube.com/watch?v=sXFaZgE8fC0" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=sXFaZgE8fC0</a></p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">AI의 발전 속도에 맞춰 해커처럼 사고하며, 시스템의 허점을 파악하고 창의적으로 활용하는 능력이 중요해졌다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">Ai 시대, 해커처럼 사고하기.</h3>
<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td>해커적 사고</td>
<td>의미</td>
</tr>
<tr>
<td>시스템을 그대로 믿지 않음</td>
<td>주어진 구조를 의심하고 뜯어봄</td>
</tr>
<tr>
<td>의도된 사용법에 갇히지 않음</td>
<td>만든 사람이 예상하지 못한 방식으로 사용함</td>
</tr>
<tr>
<td>빈틈을 찾음</td>
<td>기술, 사회, 사고방식 속의 허점을 발견함</td>
</tr>
<tr>
<td>실험함</td>
<td>직접 써보고, 부수고, 바꿔보며 이해함</td>
</tr>
<tr>
<td>경계를 테스트함</td>
<td>어디까지 가능한지, 어디서 실패하는지 확인함</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">AI 시대가 인터넷이 등장했을 때보다 더 큰 변화일 수 있다고 본다. 그래서 단순히 AI를 어떻게 써야 하는가가 아니라, AI가 바꾸는 세상에서 인간은 어떻게 생각해야 하는가를 이야기하려고 한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">.AI는 단순한 도구가 아니라 거대한 메타 시스템이다.</h3>
<p data-ke-size="size16">AI가 실제로 생각하는지, 생각하는 것 처럼 보이는지는 중요하지 않다. 중요한 건 AI가 이미 인간의 사고, 핻오, 현실 인식에 영향을 주고 있다는 것 이다.&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">기존의 사고 방식인 원인-결과 중심의 사고, 선형적 사고는 복잡한 상호작용을 단순하게 보고 변화가 단계적으로 일어난다고 착각한다. 하지만 AI 시대의 변화는 선형적으로 오지 않는다. 여러 기술과 분야, 사용자 행동, 사회적 변화가 동시에 엮이면서 예측하기 어려운 결과를 만들어낸다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그래서 이러한 지점때문에 여기서 발표자는 우리가 다르게 생각하며 해커적 사고를 가져야한다고 한다.</p>
<p data-ke-size="size16">해커는 설명서만 읽고 끝나는 것이 아니라 직접 실행하고 경계를 건드리고, 예상 밖의 결과를 확인하면서 시스템을 이해하는 것이다.</p>
<h3 data-ke-size="size23">&nbsp; &nbsp;구체적인 해커적 사고란?.</h3>
<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td>해커적 사고</td>
<td>발표에서의 의미</td>
</tr>
<tr>
<td>시스템 전체 보기</td>
<td>부품만 보는 것이 아니라 전체 구조를 봄</td>
</tr>
<tr>
<td>구멍 보기</td>
<td>시스템 안의 빈틈, 모순, 취약점을 찾음</td>
</tr>
<tr>
<td>의도 밖 사용</td>
<td>설계자가 예상하지 못한 방식으로 사용함</td>
</tr>
<tr>
<td>경계 테스트</td>
<td>제한, 규칙, 금지선이 어디인지 확인함</td>
</tr>
<tr>
<td>반복 실험</td>
<td>한 번에 답을 찾기보다 계속 수정하고 실험함</td>
</tr>
<tr>
<td>문서화</td>
<td>발견한 것을 재현 가능하게 남김</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">해커는 시스템이 무엇을 하도록 설계되었는지가 아니라, 무엇을 하게 만들 수 있는지를 보는 사람이다. AI 시대에서도 AI는 도구이면서, 인터페이스이고, 사고 확장 장치이고, 공격 표면이자 방어 도구가 된다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">Claude 사례 : AI를 해커처럼 활용하는 6가지 방식.</h3>
<p data-ke-size="size16">Claude에게 발표 주제를 던지자 claude는 몇 초만에 해커적 사고와 AI 활용을 연결하는 여섯 가지 범주를 제시했다.</p>
<table style="border-collapse: collapse; width: 100%; height: 154px;" border="1" data-ke-align="alignLeft">
<tbody>
<tr style="height: 22px;">
<td style="height: 22px;">Claude가 제시한 범주</td>
<td style="height: 22px;">의미</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">Think in systems and exploits</td>
<td style="height: 22px;">AI를 하나의 시스템으로 보고, 구조와 취약점을 함께 파악하기</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">Reverse engineering</td>
<td style="height: 22px;">AI가 왜 이런 답을 내는지 역으로 분석하기</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">Iterative problem solving</td>
<td style="height: 22px;">프롬프트를 한 번에 끝내지 않고 반복적으로 개선하기</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">Tool stacking and chaining</td>
<td style="height: 22px;">여러 도구와 AI를 연결해서 더 복잡한 작업을 수행하기</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">Boundary testing</td>
<td style="height: 22px;">AI가 어디까지 가능한지, 어떤 조건에서 실패하는지 실험하기</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">Documentation and reproducibility</td>
<td style="height: 22px;">발견한 방법을 기록하고 재현 가능하게 만들기</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">여기서 AI를 다룰 때 해당 답변을 그대로 믿는 것이 아니라 왜 이러한 답이 나왔는지, 답변을 분석하고 다시 프롬프트를 조정하거나 내가 원하는 답변이 나오지 않으면 실패 조건을 기록하고 다른 방식으로 실험하는 방법도 소개를 해주었다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">결론..</h3>
<p data-ke-size="size16">계속해서 해커처럼 생각하라는 말을 반복한다. AI 시대에는 정답이 정해져 있지 않고, AI가 어디까지 발전하고 어떤 직업을 바꾸고, 보안 공격이 어떻게 진화할지, 인간의 사고 방식이 어떻게 변할지는 완전히 예측하기 어렵기 때문에 aI 시대에 인간이 주도권을 유지하려면 해커처럼 생각하여 직접 실험하고, 경계를 테스트하고, AI를 무시하지도 말고 맹신하지도 말 것을 각인시켜준다.</p>
<p data-ke-size="size16">&nbsp;</p>
