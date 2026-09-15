---
layout: post
title: 프론티어_처분사례 기반 ISMS-P 보고서 작성
date: 2026-09-13
desc: "GS리테일 개인정보 유출 처분사례를 ISMS-P 관리체계 관점에서 분석 - Credential Stuffing 공격 흐름과 통제항목별 점검"
keywords: "ISMS-P, 개인정보보호, GS리테일, Credential Stuffing, 개인정보위원회, 접근통제, 침해사고대응, 프론티어"
categories: [TechnicalDocument]
tags: [ISMS-P, 프론티어, 개인정보보호]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/60](https://sanghole.tistory.com/60)

<h3 data-ke-size="size23">GS리테일 개인정보 유출 사고 뜯어보기</h3>
<p data-ke-size="size16">GS SHOP에 대한 공격은 2024년 6월 21일부터 2025년 2월 13일까지 이어졌다. GS25에 대해서도 2024년 12월 26일부터 2025년 1월 4일까지 공격이 발생했다. 공격자는 일부 계정의 로그인에 성공한 뒤 회원정보 수정 페이지에 접근했고,  GS SHOP에서는 1,581,025명이, GS25에서는 79,128명의 이름, 성별, 생년월일, 연락처, 주소, 이메일 등의 개인정보가 유출됐다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> 개인정보보보호위원회의 <span style="color: #303030; text-align: left;">개인정보위, ㈜지에스리테일 유출사고에 대해 과징금 128억 3,600만 원, 과태료 300만 원 부과 글을 읽어보면 2025년 1월 4일 GS25의 개인정보 유출을 이미 인지했다고 나와있다. 그런데 GS SHOP에서도 동일한 유형의 공격이 진행 중이라는 사실은 2월이 되어서야 추가로 파악했다. 심지어 개인정보위 조사에 따르면 GS25 공격에 사용된 IP 중 327개가 GS SHOP 공격에도 사용됐다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그러면 여기서 중요한 점은 공격을 완전히 막을 수 있었느냐 보다는 수많은 이상징후가 발생하고 있었는데 왜 탐지하지 못했고, 사고를 하나 발견한 뒤에도 왜 다른 서비스까지 확인하지 못했을까?</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">ISMS-P 관리체계가 정상적으로 동작했다면 어느 단계에서 사고를 발견하거나 피해를 줄일 수있었는지를 중심으로 살펴보려고 한다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">1. 사건 선정 이유</h3>
<p data-end="1850" data-ke-size="size16" data-start="1640">첫째, 상당히 최근에 개인정보위원회의 처분이 내려진 사건이다. 개인정보위는 2026년 8월 26일 제17회 전체회의에서 GS리테일에 대한 처분을 의결했고, 8월 31일 결과를 공개했다. 처분 내용은 과징금 128억 3,600만 원, 과태료 300만 원, 시정명령 및 처분 사실 공표 명령이다. <span data-content-reference-end="1793" data-content-reference-start="1771"></span></p>
<p data-end="2080" data-ke-size="size16" data-start="1852">둘째, 공격방법이 명확하다. 흔히 개인정보 유출 사건을 분석하려고 하면 공개된 기술정보가 너무 적어서 사고 흐름을 그리는 것부터 어렵다. 하지만 이번 사건은 개인정보위가 공격 유형을 Credential Stuffing이라고 명시했고, 대량 로그인 → 로그인 성공 → 회원정보 수정 페이지 접근 → 개인정보 유출이라는 흐름도 공개했다. <span data-content-reference-end="2008" data-content-reference-start="1986"></span></p>
<p data-end="2115" data-ke-size="size16" data-start="2082">셋째, 기술 문제와 관리체계 문제가 동시에 드러난 사건이다.</p>
<p data-end="2162" data-ke-size="size16" data-start="2117">단순히 방화벽 설정 하나가 잘못됐거나 취약점 하나를 패치하지 않은 사건이 아니다.</p>
<p data-end="2251" data-ke-size="size16" data-start="2164">이상 로그인 탐지, 접근통제, 사고 대응, 서비스 간 침해지표 공유, 개인정보보호 조직, CPO의 권한, 유출 통지까지 여러 통제가 연결되어 있다.</p>
<p data-end="2292" data-ke-size="size16" data-start="2253"> </p>
<h3 data-ke-size="size23">2. 사건 개요</h3>
<p data-ke-size="size16">개인정보위가 발표한 내용을 정리하면 다음과 같다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td>사업자</td>
<td>㈜GS리테일</td>
</tr>
<tr>
<td>대상 서비스</td>
<td>GS SHOP, GS25</td>
</tr>
<tr>
<td>공격기법</td>
<td>Credential Stuffing</td>
</tr>
<tr>
<td>GS SHOP 공격기간</td>
<td>2024.06.21 ~ 2025.02.13</td>
</tr>
<tr>
<td>GS25 공격기간</td>
<td>2024.12.26 ~ 2025.01.04</td>
</tr>
<tr>
<td>GS SHOP 유출 규모</td>
<td>1,581,025명</td>
</tr>
<tr>
<td>GS25 유출 규모</td>
<td>79,128명</td>
</tr>
<tr>
<td>유출 개인정보</td>
<td>이름, 성별, 생년월일, 연락처, 주소, 이메일 등</td>
</tr>
<tr>
<td>최초 사고 인지</td>
<td>2025.01.04, GS25</td>
</tr>
<tr>
<td>GS SHOP 공격 추가인지</td>
<td>2025년 2월</td>
</tr>
<tr>
<td>두 공격에서 중복 사용된 IP</td>
<td>327개</td>
</tr>
<tr>
<td>처분</td>
<td>과징금 128억 3,600만 원 + 과태료 300만 원</td>
</tr>
<tr>
<td>추가 조치</td>
<td>시정명령 + 처분 사실 공표</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">두 서비스의 숫자를 단순 합산하면 1,660,153명이다. 다만 개인정보위 공개자료에서 두 서비스 이용자 사이의 중복 여부까지 밝히지는 않았기 때문에 구체적인 수치는 GS SHOP 1,581,025명, GS25 79,128명이다. </p>
<p data-ke-size="size16">개인정보위는 공격자가 사전에 확보한 다수의 아이디 비밀번호를 무차별적으로 대입했다고 설명하고 있다. 즉, 다른 사이트의 유출정보, 계정 거래 데이터 등 공격자가 이미 확보한 계정정보를 이용했을 가능성은 있지만 공개자료만으로 최초 확보 경로를 특정할 수 없다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">3. Credential Stuffing은 어떤 공격인가?</h3>
<p data-ke-size="size16">GS를 공격했을 때 사용한 Credential Stugging은 이름만 보면 복잡해 보이지만 원리는 단순하다. 사람들은 여러 사이트에서 동일하거나 비슷한 비밀번호를 사용하는 경우가 많다. 어느 한 플랫폼에서 특정 이메일과 특정 비밀번호를 사용하면 다른 플랫폼에도 비슷한 것들이 있을 거라고 예측해서 공격하는 것 이다. 이때, 어느 한 플랫폼이 유출되었다고 한다면 다른 플랫폼도 동일하게 공격 받기 쉬워진다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그래도 다른 추가적인 숫자나 다른 비밀번호 정책때문에 잘 막힌다고 해도 100만 개의 계정정보를 가지고 시도했을 때 99%가 실패했을 때에도 1%만 성공해도 1만 개의 계정을 확보할 수 있다!!</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">개인정보위도 Credential Stuffing의 특징으로 로그인 시도 횟수와 로그인 실패율이 급격히 증가한다는 점을 설명하고 있다. 또한 개인정보위는 이 공격 유형과 관련하여 개인정보 보호법 제 29조의 안전조치의무 및 안전성 확보조치 기준의 접근통제가 주요 쟁점이 될 수 있다고 설명하고 있다.</p>
<ul data-end="255" data-ke-list-type="disc" data-start="10" style="list-style-type: disc;">
<li data-end="115" data-start="10">개인정보 보호법 제29조(안전조치의무)<br/>개인정보처리자는 개인정보가 분실·도난·유출·위조·변조·훼손되지 않도록 기술적·관리적·물리적 보호조치를 해야 한다는 규정이다.</li>
<li data-end="255" data-start="117">안전성 확보조치 기준의 ‘접근통제’<br/>개인정보처리시스템에 허가되지 않은 사람이 접근하지 못하도록 통제해야 한다는 내용이다. 예를 들어 IP 접근제한, 로그인 실패 횟수 제한, 비정상 접속 탐지, 접근권한 관리 등이 해당한다.</li>
</ul>
<p data-end="349" data-is-last-node="" data-is-only-node="" data-ke-size="size16" data-start="257">GS리테일 사건에 적용하면, 대량 로그인 시도와 높은 로그인 실패율 같은 이상징후를 제대로 탐지·차단하지 못한 부분이 접근통제 미흡과 연결된다고 볼 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">=&gt; 이런 부분에서 GS리테일 사건에서 탐지하지 못했다는 사실이 중요해진다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">4. 개인정보 처리 흐름을 그려보기</h3>
<p data-ke-size="size16">내부 시스템 구성도나 DB 구조는 공개되지 않았지만, 개인정보위가 확인한 서비스 수준의 흐름만 정리한다.</p>
<pre class="bash" data-ke-language="bash" data-ke-type="codeblock" id="code_1789300490374"><code>[정상 사용자 흐름]                              [공격자 흐름]

[GS SHOP / GS25 이용자]                      [공격자가 사전에 확보한
                                              다수의 ID / Password]
          ↓                                              ↓

        로그인                                   자동화된 대량 로그인

          ↓                                              ↓

  [정상 사용자 인증]                         ┌───────────┴───────────┐
                                            │                       │
          ↓                              로그인 실패              로그인 성공
                                             │                       │
[회원정보 수정 페이지]                        │                       ↓
                                             │              [회원정보 수정 페이지]
          ↓                                  │                       │
                                             │                       ↓
[본인 이름 / 연락처 / 주소 /                   │                 개인정보 접근
 생년월일 / 이메일 등                         │                       │
 정보 확인·수정]                              │                       ↓
                                             │                 개인정보 유출
                                             │
                                             ↓
                                        대량 실패 발생</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">공격 흐름과 정상 흐름을 비교한 것이다. 여기서 중요한 지점은 다량의 로그인 실패인 것 인데 충분한 탐지 및 차단 통제가 작동하지 않아서 일부 계정 로그인이 성공하고 공격이 장기간 지속되어서 GS25가 사고를 인식한 점이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">5. 개인정보위는 무엇을 문제 삼았는지</h3>
<p data-ke-size="size16">개인정보위에 따르면 GS25 공격에 사용된 IP 가운데, 327개가 GS SHOP 공격에서도 동일하게 사용됐다.</p>
<p data-end="5588" data-ke-size="size16" data-start="5429">2025년 1월 4일 GS25 사고를 발견했다면 일반적인 침해사고 대응 과정에서는 공격에 사용된 IP, User-Agent, 시간대, 계정 패턴, 요청 URL 등의 정보를 IOC(Indicator of Compromise) 또는 관련 침해지표로 만들어 다른 서비스에서도 확인해야 한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">하지만 실제로 GH SHOP의 동일 공격이 확인된 시점은 그보다 뒤였으며 개인정보위도 사고 당시 개인정보 전담조직 부재와 이원화된 보안 운영 등 개인정보보호 조직의 구성과 운영이 미흡했다고 지적했다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">또한 개인정보위의 판단을 네 가지로 정리해볼 수 있다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span style="color: #333333; text-align: start;">문제조사<span> </span></span></td>
<td>결과</td>
</tr>
<tr>
<td>이상접속 탐지·차단</td>
<td>동일 IP 대규모 로그인에 대한 탐지·차단 대책 미흡</td>
</tr>
<tr>
<td>모니터링</td>
<td>로그인 시도·실패 급증이라는 이상징후를 인지하지 못함</td>
</tr>
<tr>
<td>사고 대응</td>
<td>GS25 사고 인지 후에도 GS SHOP 동일 공격을 뒤늦게 확인</td>
</tr>
<tr>
<td>개인정보보호 거버넌스</td>
<td>전담조직 부재 및 이원화된 보안 운영</td>
</tr>
<tr>
<td>유출 통지</td>
<td>추가 확인된 1,599명에 대해 정당한 사유 없이 72시간을 지나 통지</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이러한 문제 때문에 개인정보위는 GS리테일에 과징금 128억 3,600만 원, 과태료 300만 원을 부과했고, 처분 사실 공표와 함께 구체적인 재발방지 대책을 마련하도록 시정명령했다. 특히 개인정보 보호 전담인력 배치와 CPO의 권한·책임 명확화 등 거버넌스 개선까지 요구했다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">6. 처분 근거를 법 관점에서 보면 어떨까?</h3>
<div>
<div>개인정보위는 GS리테일 사건에서 공통적인 문제로 </div>
<div> </div>
<blockquote data-ke-style="style2">개인정보처리 시스템에 대한 접근 통제 등 안전조치를 소홀히 하여 개인정보가 유출되었다</blockquote>
</div>
<p data-ke-size="size16">라고 밝혔다. 실제로 동일 IP에서 짧은 시간 동안 대규모 로그인 시도가 발생했고, 로그인 실패율이 급격히 증가했음에도 이를 제대로 탐지하거나 차단하지 못한 사실이 확인됐다. 이 문제는 크게 「개인정보 보호법」 제29조와 「개인정보의 안전성 확보조치 기준」 제6조에 연결된다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">6-1. 개인정보 보호법 제 29조 - 안전조치의무</h4>
<p data-ke-size="size16">GS리테일 처분 당시의 개인정보 보호법 제 29조는 개인정보 처리자가 개인정보의 분실과 도난 유출, 위조,변조 또는 훼손을 방지하기 위해 내부 관리계획 수립, 접속리고 보관 등 기술적, 관리적, 물리적, 안전조치를 해야 한다고 규정하고 있다. </p>
<p data-ke-size="size16"> </p>
<p data-end="1103" data-ke-size="size16" data-start="914">GS리테일 사건에서는 공격자가 Credential Stuffing 방식으로 대량 로그인을 시도했는데, 이 과정에서 로그인 시도와 로그인 실패가 급격하게 증가하는 이상징후가 발생했다. 그런데 이를 충분히 탐지하거나 차단하지 못하면서 개인정보 유출이 장기간 이어졌다.</p>
<p data-end="1103" data-ke-size="size16" data-start="914"> </p>
<h4 data-ke-size="size20" style="color: #000000; text-align: start;">6-2. 개인정보의 안전성 확보조치 기준, 제 6조 - 접근통제</h4>
<p data-end="1479" data-ke-size="size16" data-start="1367">제29조가 전체적인 안전조치를 해야 한다는 상위 법률이라면, 구체적으로 어떤 보호조치를 해야 하는지는 개인정보위 고시인「개인정보의 안전성 확보조치 기준」에서 더 상세하게 규정한다. 그중 이번 사건과 가장 직접적으로 연결되는 것이 제6조 접근통제다.</p>
<p data-end="1580" data-ke-size="size16" data-start="1524">제6조 제1항은 정보통신망을 통한 불법적인 접근과 침해사고를 막기 위해 다음과 같은 조치를 요구한다.</p>
<ul data-end="1681" data-ke-list-type="disc" data-start="1582" style="list-style-type: disc;">
<li data-end="1626" data-start="1582">IP 주소 등을 이용하여 개인정보처리시스템에 대한 비인가 접근을 제한</li>
<li data-end="1681" data-start="1627">개인정보처리시스템에 접속한 IP 주소 등을 분석하여 개인정보 유출 시도를 탐지하고 대응</li>
</ul>
<p data-end="1804" data-ke-size="size16" data-start="1683">즉 단순히 방화벽을 설치하는 것에서 끝나는 게 아니라, 접속 IP와 접근 패턴을 실제로 분석해서 유출 시도를 발견하고 대응해야 한다는 것이다. <span data-content-reference-end="1770" data-content-reference-start="1728"></span>GS리테일 사건과 연결하면 이 부분이 상당히 명확하다. 개인정보위 역시 GS 리테일이 동일 IP에서 발생한 대규모 로그인 시도를 탐지 및 차단할 대책을 마련하지 않았으며 로그인 실패가 급증하는 이상징후도 인지하지 못했다고 밝혔다.</p>
<p data-end="1804" data-ke-size="size16" data-start="1683"> </p>
<h4 data-end="1804" data-ke-size="size20" data-start="1683">6-3. 유출 사실을 발견한 이후는 개인정보 보호법 제 34조</h4>
<p data-end="2459" data-ke-size="size16" data-start="2381">사고 예방과 관련된 것이 제29조라면, 이미 개인정보 유출이 발생한 뒤 어떻게 대응해야 하는지는 개인정보 보호법 제34조와 연결된다. 제34조는 개인정보처리자가 개인정보 유출 사실을 알게 되면 정보주체에게 지체 없이 유출 사실을 알려야 한다고 규정한다. 통지해야 하는 내용에는 유출된 개인정보 항목, 유출 시점과 경위, 피해를 최소화하기 위한 방법, 사업자의 대응조치 및 피해구제 절차 등이 포함된다.</p>
<p data-end="2459" data-ke-size="size16" data-start="2381"> </p>
<p data-end="2459" data-ke-size="size16" data-start="2381">마지막으로 개인정보위는 조사 과정에서 새롭게 확인된 1,599명에 대한 유출 통지가 정당한 사유 없이 72시간을 넘긴 사실도 확인했다. 개인정보 유출 신고제도는 일정 요건에 해당할 경우 유출 사실을 인지한 뒤 72시간 이내 신고하도록 규정하고 있으며, 개인정보위도 이번 처분에서 72시간 내 신속한 신고와 통지를 다시 강조했다.</p>
<p data-end="2459" data-ke-size="size16" data-start="2381"> </p>
<h3 data-end="2459" data-ke-size="size23" data-start="2381">7. ISMS-P 관점에서 확인해보면..</h3>
<p data-ke-size="size16">공개된 처분 사실을 ISMS-P 인증기준에 대응시켜 분석한 것이다. ISMS-P 관리체계 수립, 운영, 보호대책, 개인정보 처리 단계 등으로 구성되며 현재 공식 인증기준에는 접근통제, 인증과 권한관리, 로그 관리, 사고 예방 대응 등의 영역이 포함돼 있다.</p>
<p data-ke-size="size16"> </p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td style="width: 37.5581%;">ISMS-P 항목</td>
<td style="width: 62.3256%;">사건과의 연결</td>
</tr>
<tr>
<td style="width: 37.5581%;">2.5.3 사용자 인증</td>
<td style="width: 62.3256%;">대량 로그인·불법 로그인 시도에 대한 통제</td>
</tr>
<tr>
<td style="width: 37.5581%;">2.11.3 이상행위 분석 및 모니터링</td>
<td style="width: 62.3256%;">로그인 실패율 및 동일 IP 대량접속 탐지 실패</td>
</tr>
<tr>
<td style="width: 37.5581%;">2.11.1 사고 예방 및 대응체계 구축</td>
<td style="width: 62.3256%;">GS25 사고정보가 GS SHOP 등으로 충분히 공유되지 못함</td>
</tr>
<tr>
<td style="width: 37.5581%;">2.11.5 사고 대응 및 복구</td>
<td style="width: 62.3256%;">사고 인지 후 추가 피해 확인 및 통지·대응 미흡</td>
</tr>
<tr>
<td style="width: 37.5581%;">1.1.3 조직 구성</td>
<td style="width: 62.3256%;">개인정보 전담조직 부재 및 보안운영 이원화</td>
</tr>
<tr>
<td style="width: 37.5581%;">1.1.2 최고책임자의 지정</td>
<td style="width: 62.3256%;">CPO 권한·책임 및 개인정보보호 거버넌스</td>
</tr>
<tr>
<td style="width: 37.5581%;">2.9.4 로그 및 접속기록 관리</td>
<td style="width: 62.3256%;">공격분석을 위한 인증·접속로그 확보</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">7-1. ISMS-P 2.5.3 - 사용자 인증</h4>
<p data-ke-size="size16">ISMS-P 2.5.3은 정보시스템과 개인정보에 접근할 때 안전한 인증절차를 적용하고, 로그인 횟수 제한이나 불법 로그인 시도 경고 등 비인가자 접근 통제 방안을 마련하도록 요구한다. 이번 사건과 가장 직접적으로 맞닿아 있는 항목 중 하나이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">서비스가 봐야할 맥락들은 한 ip가 몇 개의 다른 계정을 시도하고 있는지, 5분동안 실패율이 얼마나 증가했는지 등을 봐야한 다는 것이다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">7-2. ISMS-P 2.11.3 - 이상행위 분석 및 모니터링</h4>
<p data-ke-size="size16">ISMS-P 2.11.3은 침해시도나 개인정보 유출 시도를 신속하게 탐지할 수 있도록 정보시스템, 응용프로그램, 네트워크, 보안시스템의 트래픽과 이벤트 로그 등을 수집 및 분석하고 이상행위를 판단할 기준과 임계치를 정의할 것을 요구한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">GS리테일 사건에서도 이러한 신호들이 존재했기 때문에, 적절한 탐지와 차단으로 이어지지 않고 로그를 확인했으며 해당 로그들이 의미 있는 보안 이벤트로 만들었냐까지 연결했는지는 중요한 사안이다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">7-3. 2.9.4와 2.11.3의 차이</h4>
<p data-ke-size="size16">2.9.4는 로그가 존재하는가? 필요한 로그를 기록하는가? 안전하게 보관하는가? 이면</p>
<p data-ke-size="size16">2.11.3은 그 로그를 분석하는가? 무엇을 이상행위라고 볼 것인가? 이상징후가 발생하면 누가 대응하는가? 이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그래서 ISMS-P에서도 사용자 접속기로그, 인증 성공과 실패 로그 등이 주요 로그 유형으로 다뤄진다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">7-4. ISMS-P 2.11.1 - 사고 예방 및 대응체계</h4>
<p data-ke-size="size16">GS25에서 개인정보 유출을 확인한 순간부터는 상황이 달라진다. 이 시점부터는 단순한 보안 이벤트가 아니라 실제 침해사고다.  ISMS-P 2.11.1은 침해사고 발생 시 탐지, 대응, 분석 뿐 아니라 관련 정보를 공유할 수 있는 체계와 절차를 마련하도록 요구한다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">개인적인 견해가 들어간다면, 327개의 IP가 중요한 지점인 것 같다. GS25 사고를 확인하고 IOC를 추출한 뒤에 IP와 행동들을 분석할 것 같은데, 해당 IP들에 대해서 공격이 들어온 것들을 다른 시스템으로도 돌려서 확인해봤을 것 같다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">7-5. ISMS-P 1.1.3 - 조직 구성</h4>
<p data-ke-size="size16">이러한 공격들을 그저 WAF에서 차단 잘 했으면 되는 거 아닌가? 라고 생각하기에는 개인정보 저담조직의 부재, 이원화된 보안 운영등을 언급했다. 그리고 재발방지 조치로 개인정보보호 전담인력 배치와 CPO의 권한, 책임 명확화를 요구했다. ISMS-P 1.1.3 역시 CISO와 CPO 업무를 지원할 전문 실무조직과 전사적 정보보호, 개인정보호 활동을 위한 조직 체계를 요구한다. 결국 보안에서는 기술만큼 누가 무엇을 책임지고 움직이는지도 중요하다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">7-6. ISMS-P 2.11.5 - 사고 대응 및 복구</h4>
<p data-ke-size="size16">2.11.5는 침해사고나 개인정보 유출을 인지하면 정의된 절차에 따라 신속히 대응하고, 법적 통지 신고 의무를 준수하며 사고 종료 후 원인을 분석해 재발방지 대책을 대응체계에 반영하도록 요구한다.  GS리테일은 최초 통지 이후 추가로 확인된 유출 대상자 1,599명에 대해 정당한 사유 없이 72시간이 지나서 통지한 것으로 조사됐다. </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">8. 재발 방지 대책 세워보기</h3>
<p data-ke-size="size16">일단 정책 부분에서는 Credential Stuffing 방어정책이 필요할 것 같다.</p>
<p data-ke-size="size16">해당 정책에서는 아래와 같은 정책들이 필요하며 단지 기준을 딱 딱 나눠놓은 것들이 아닌, IP, Account, Device등을 조합한 위험 기반 탐지가 더 현실적이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">비정상 로그인 패턴 정의<br/>Credential Stuffing 탐지 기준<br/>자동화 공격 차단 기준<br/>계정별 로그인 실패 제한<br/>IP·Device 기반 Rate Limiting<br/>위험 로그인에 대한 추가인증<br/>차단 예외 승인절차<br/>보안 이벤트 보고체계</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">해당 탐지 룰을 2가지 정도 예시를 들어보면 </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">5분 실패율이 평시 대비 3배 이상 상승 -&gt; SOC High Alert.</p>
<p data-ke-size="size16">로그인 직후 개인정보 페이지 반복 조회 -&gt; 추가 탐지 및 세션 검증 등이 될 것 같다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">또한 개인정보 화면에 추가 방어선을 만들 필요가 있어보인다. 회원정보 수정에 개인정보가 집중적으로 노출되는 화면들은 별도의 보안경계를 둬야할 필요가 있어보인다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">EX)</p>
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
<div>
<div id="code-block-viewer">
<div>
<pre class="angelscript"><code>010-12**-56**
hong***@example.com
충남 천안시 ******</code></pre>
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
</div>
<p data-end="14668" data-ke-size="size16" data-start="14620">처럼 필요 이상의 개인정보가 그대로 노출되지 않도록 마스킹하는 방법을 고려할 수 있다.</p>
<p data-end="14668" data-ke-size="size16" data-start="14620"> </p>
<p data-end="14668" data-ke-size="size16" data-start="14620"> </p>
<p data-end="14668" data-ke-size="size16" data-start="14620">구체적으로 내부 상황이 어떻게 돌아가는지, SIEM이나 모니터링이 어떻게 운영되는지는 모르겠지만, GS 내에 있는 서비들이 별개의 서비스라고 생각하지 않고 통합하여 운행하는 중앙 구조형 보안 관리도 필요해보인다.</p>
<p data-end="14668" data-ke-size="size16" data-start="14620"> </p>
<h4 data-end="14668" data-ke-size="size20" data-start="14620">ISMS-P..를 공부하면서 배운 것들</h4>
<p data-ke-size="size16">ISMP-P가 구체적으로 뭔지 구체적으로 몰랐고, 통제항목들을 보며 조금은 추상적으로 느꼈지만, 실제 사고 사례들을 보면서 분석해보니 명확하게 이해할 수 있었다. 또한 ISMS-P에서 중요한 것은 인증서 자체가 아니라 정책이 잘 수행하고 있으며, 절차가 있는지, 또 실제로 수행하는지, 수행했다는 기록이 남아있는 지 등의 반복 과정이 있는것이라고 느꼈다.</p>
<p data-ke-size="size16"> </p>
