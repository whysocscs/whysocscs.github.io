---
layout: post
title: 프론티어_IDS/IPS에 대해서
date: 2026-05-13
desc: "IDS/IPS 개념, 동작 흐름, 탐지 방식, 유형, 대표 도구(Snort/Suricata/Zeek) 정리"
keywords: "IDS, IPS, NIDS, NIPS, HIDS, Snort, Suricata, Zeek, 침입탐지, 침입방지, 네트워크보안, 프론티어"
categories: [TechnicalDocument]
tags: [프론티어, IDS, IPS, 네트워크보안]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/42](https://sanghole.tistory.com/42)

<h2 data-ke-size="size26">IDS/IPS</h2>
<p data-ke-size="size16">일단 IDS/IPS에 대해서 정리해야한다.</p>
<p data-ke-size="size16">처음에는 IDS랑 IPS가 둘 다 침입을 탐지하는 장비 아닌가? 라고 생각할 수 있는데, 둘은 비슷하면서도 차이가 꽤 크다.</p>
<p data-ke-size="size16">가장 간단하게 말하면</p>
<p data-ke-size="size16">IDS는 탐지하고 알려주는 시스템<br />IPS는 탐지하고 막는 시스템</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그럼 왜 IDS/IPS가 필요하지?&nbsp; 방화벽이 있으면 되는 거 아닌가? 라고 생각할 수 있다. 근데 방화벽은 기본적으로 IP, 포트, 프로토콜, 정책을 기준으로 트래픽을 허용하거나 차단한다. 예를 들어 80번 포트, 443번 포트는 웹 서비스를 위해 열어둬야 한다. 근데 공격자는 바로 그 허용된 통로를 통해 SQL Injection, RCE, WebShell 업로드, 취약점 공격 같은 걸 시도한다.</p>
<p data-ke-size="size16">즉 방화벽은 문을 열어줄지 말지를 보는 느낌이고, IDS/IPS는 문을 통과하는 사람이 이상한 행동을 하는지 보는 느낌이다.</p>
<p data-ke-size="size16">NIST에서도 IDPS를 침입 탐지 및 방지 시스템으로 설명하면서, 조직이 IDS와 IPS 기술을 이해하고 설계, 구현, 운영, 유지관리할 수 있도록 가이드를 제공한다고 한다. 그리고 IDPS 유형을 network-based, wireless, network behavior analysis, host-based로 나누어서 설명한다.</p>
<h2 data-ke-size="size26">IDS란?</h2>
<p data-ke-size="size16">IDS는 Intrusion Detection System이다.&nbsp; 말 그대로 침입 탐지 시스템이다.</p>
<p data-ke-size="size16">IDS는 네트워크 트래픽이나 시스템 로그, 파일 변경, 프로세스 실행, 인증 이벤트 같은 것들을 보면서 이상한 행위가 있는지 확인한다. IBM에서는 IDS를 네트워크 트래픽과 디바이스에서 알려진 악성 활동, 의심스러운 활동, 보안 정책 위반을 모니터링하는 네트워크 보안 도구라고 설명한다.</p>
<p data-ke-size="size16">여기서 중요한 점은 IDS는 기본적으로 막는 장비가 아니라 알려주는 장비라는 것이다.</p>
<p data-ke-size="size16">예를 들어 공격자가 웹 서버에 SQL Injection 요청을 보냈다고 해보자.</p>
<p data-ke-size="size16">IDS는 해당 요청 안에 SQL Injection 패턴이 있는지 확인한다. 만약 의심스러운 패턴이 보이면 알림을 발생시킨다. 이 알림은 보안 관리자에게 갈 수도 있고, SIEM 같은 중앙 보안 시스템으로 전달될 수도 있다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">IBM도 IDS 알림이 SIEM과 같은 중앙 집중식 보안 도구로 전달되어 다른 데이터와 함께 분석될 수 있다고 설명한다.</p>
<h4 data-ke-size="size20">IDS 실사례</h4>
<p data-ke-size="size16"><a href="https://www.etnews.com/20210528000161" target="_blank" rel="noopener noreferrer">https://www.etnews.com/20210528000161</a></p>
<p data-ke-size="size16">IDS는 실제 보안관제에서 공격 징후를 빠르게 발견하고 다른 보안 장비와 연계하는 용도로 사용된다. 예를 들어 전자정부 보안관제 사례에서는 내외부 위협 데이터를 빅데이터로 통합한 뒤 IDS, IPS, 방화벽과 연계해 자동 대응하는 구조를 사용했고 이를 통해 대량의 보안 위협을 빠르게 분석하고 대응 시간을 줄였다고 설명된다. 즉 IDS는 직접 막는 장비라기보다는 네트워크에서 발생하는 의심스러운 트래픽이나 침입 징후를 탐지해서 관제 시스템에 넘기고 이후 IPS나 방화벽 같은 장비와 함께 대응하도록 만드는 감시 센서처럼 활용된다.</p>
<h2 data-ke-size="size26">IPS란?</h2>
<p data-ke-size="size16">IPS는 Intrusion Prevention System이다.</p>
<p data-ke-size="size16">침입 방지 시스템이다.&nbsp;IPS는 IDS처럼 공격을 탐지하는 것에서 끝나지 않고, 탐지한 공격을 직접 차단한다. Fortinet에서는 IPS가 악성 트래픽을 식별하고 해당 트래픽이 네트워크에 유입되는 것을 사전에 차단할 수 있도록 도와준다고 설명한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">또한 IPS는 보통 인라인으로 배치되어 트래픽을 검사하고 탐지 시 접근 차단, 호스트 격리, 외부 웹사이트 접근 차단 같은 조치를 수행할 수 있다고 한다.</p>
<p data-ke-size="size16">여기서 인라인이라는 말이 중요하다.</p>
<p data-ke-size="size16">인라인은 트래픽이 실제로 IPS를 통과한다는 뜻이다.</p>
<pre id="code_1778614319237" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>사용자
→ 방화벽
→ IPS
→ 내부 서버</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이런 식으로 트래픽 경로 중간에 IPS가 들어간다.</p>
<p data-ke-size="size16">그래서 IPS는 악성 트래픽을 발견하면 바로 버릴 수 있다. 패킷 드롭, 연결 리셋, 출발지 차단, 세션 종료 같은 행동을 할 수 있다. Palo Alto도 IPS는 위협을 적극적으로 차단하고, IDS는 잠재적 보안 침해를 모니터링하고 경고한다는 점에서 차이가 있다고 설명한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h4 data-ke-size="size20">IPS 실사례</h4>
<p data-ke-size="size16"><a href="https://www.datanet.co.kr/news/articleView.html?idxno=22031" target="_blank" rel="noopener noreferrer">https://www.datanet.co.kr/news/articleView.html?idxno=22031</a></p>
<p data-ke-size="size16">&nbsp;IPS는 실제로 네트워크가 자주 공격받는 환경에서 악성 트래픽을 직접 차단하는 방식으로 사용됐다. 위 링크에 첨부된 기사에서는 숭실대 전산원이 바이러스, 웜, 트로이목마 공격으로 인한 트래픽 부하 때문에 하루에도 2~3번씩 네트워크 다운을 겪었고, 이런 문제를 줄이기 위해 IPS를 도입한 사례가 나온다. 즉 IPS는 단순히 공격을 알려주는 장비가 아니라, 네트워크 중간에서 유해 트래픽을 탐지하고 차단해서 서비스 장애를 줄이는 용도로 활용된 것이다</p>
<h2 data-ke-size="size26">구체적인 IDS와 IPS 차이</h2>
<p data-ke-size="size16">그럼 둘의 차이는 뭐냐?&nbsp; 둘 다 탐지는 한다.&nbsp; 근데 탐지 이후에 하는 행동이 다르다.</p>
<div>
<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td>이름</td>
<td>Intrusion Detection System</td>
<td>Intrusion Prevention System</td>
</tr>
<tr>
<td>역할</td>
<td>공격 탐지 및 알림</td>
<td>공격 탐지 및 차단</td>
</tr>
<tr>
<td>배치</td>
<td>보통 트래픽 복사본 분석</td>
<td>보통 트래픽 경로 중간에 배치</td>
</tr>
<tr>
<td>대응</td>
<td>로그 생성, 알림 발생</td>
<td>패킷 드롭, 연결 차단, 세션 종료</td>
</tr>
<tr>
<td>장점</td>
<td>서비스 영향이 적음</td>
<td>실시간 차단 가능</td>
</tr>
<tr>
<td>단점</td>
<td>직접 막지는 못함</td>
<td>오탐 시 정상 트래픽도 막을 수 있음</td>
</tr>
</tbody>
</table>
</div>
<p data-ke-size="size16">결국 IDS는 탐지 중심이고 IPS는 방어 중심이다.</p>
<p data-ke-size="size16">Palo Alto도 방화벽, IDS, IPS 차이를 설명하면서 방화벽은 보안 규칙에 따라 트래픽을 필터링하고, IDS는 잠재적 보안 침해를 모니터링하고 경고하며, IPS는 위협을 적극적으로 차단한다고 설명한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">개념들을 다 알았으니 장/단점에 대해서 확인해보자.</p>
<h2 data-ke-size="size26">장단점</h2>
<h3 data-ke-size="size23">IDS 장점</h3>
<ol style="list-style-type: decimal;" data-ke-list-type="decimal">
<li>IDS는 실제 서비스 트래픽을 건드리지 않는 장점이 있다.&nbsp;그래서 오탐이 발생해도 정상 트래픽을 직접 차단하지 않는다.</li>
<li>IDS는 로그를 많이 남긴다. 이 로그는 사고 분석, 포렌식, 위협 헌팅, 보안 정책 개선에 활용할 수 있다.
<ul style="list-style-type: circle;" data-ke-list-type="circle">
<li>예를 들어 IDS가 특정 서버로 들어온 SQL Injection 시도를 탐지했다면, 이후에 해당 서버 로그를 같이 확인하면서 실제 침해가 있었는지 분석할 수 있다.</li>
</ul>
</li>
<li>IDS는 가시성 확보에 강하다.</li>
</ol>
<h3 data-ke-size="size23">IDS 단점</h3>
<ol style="list-style-type: decimal;" data-ke-list-type="decimal">
<li>공격을 탐지해도 보안 담당자가 대응하기 전까지 공격이 계속될 수 있다. 그리고 알림이 너무 많이 발생할 수 있다.</li>
<li>암호화된 트래픽은 보기 어렵다. HTTPS나 SSH처럼 암호화된 통신은 내부 내용을 확인하기 어렵기 때문에, 메타데이터나 다른 보안 장비와 연동해서 분석해야 한다.</li>
</ol>
<h3 data-ke-size="size23">IPS 장점</h3>
<ol style="list-style-type: decimal;" data-ke-list-type="decimal">
<li>실시간 차단이다. 공격이 들어오면 바로 막을 수 있다.
<ul style="list-style-type: circle;" data-ke-list-type="circle">
<li>예를 들어 웹 서버에 취약점 공격 요청이 들어왔을 때, IPS가 해당 패킷을 드롭하면 서버까지 공격이 도달하지 않는다.</li>
</ul>
</li>
<li>취약점은 공개되었는데, 운영 중인 서버라 바로 패치하기 어렵다. 그러면 IPS 룰을 먼저 적용해서 해당 취약점 공격 패턴을 차단할 수 있다.</li>
</ol>
<h3 data-ke-size="size23">IPS 단점</h3>
<ol style="list-style-type: decimal;" data-ke-list-type="decimal">
<li>오탐이 발생하면 정상 트래픽을 실제로 막아버릴 수 있기 때문이다.
<ul style="list-style-type: circle;" data-ke-list-type="circle">
<li>IDS는 오탐이 나도 알림만 많이 뜨는 정도인데, IPS는 서비스 장애로 이어질 수 있다.</li>
</ul>
</li>
<li>IPS는 인라인으로 배치되기 때문에 성능도 중요하다. 모든 트래픽이 IPS를 지나가므로 처리량, 지연시간, 장애 시 우회 방식도 고려해야 한다.</li>
</ol>
<p data-ke-size="size16">&nbsp;</p>
<h2 data-ke-size="size26">IDS/IPS 동작 흐름</h2>
<p data-ke-size="size16">일단 IDS/IPS는 그냥 패킷 하나 보고 공격이다 아니다 이렇게 단순하게 끝나는 게 아니다.</p>
<p data-ke-size="size16">대략적인 흐름은 이렇다.</p>
<pre id="code_1778614366135" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>트래픽 수집
→ 패킷 재조립
→ 세션 분석
→ 프로토콜 분석
→ 탐지 룰 적용
→ 이상행위 판단
→ IDS는 알림
→ IPS는 차단

이런 느낌이다.</code></pre>
<h3 data-ke-size="size23">1. 트래픽 수집</h3>
<p data-ke-size="size16">먼저 트래픽을 수집해야 한다.</p>
<p data-ke-size="size16">IDS는 보통 SPAN 포트나 TAP 장비를 통해 트래픽 복사본을 받아서 분석한다. 그래서 실제 서비스 트래픽에는 직접 영향을 주지 않는다. 이게 IDS의 장점이다.</p>
<p data-ke-size="size16">반면 IPS는 트래픽이 지나가는 길목에 배치된다. 그래서 직접 막을 수 있다. 근데 그만큼 성능이나 오탐 문제가 중요해진다.</p>
<p data-ke-size="size16">이유는 =&gt; IPS가 잘못 판단하면 정상 사용자 요청도 막을 수 있기 때문이다.</p>
<h3 data-ke-size="size23">2. 패킷 재조립</h3>
<p data-ke-size="size16">공격자는 탐지를 피하려고 악성 데이터를 여러 패킷으로 쪼개서 보낼 수 있다.</p>
<p data-ke-size="size16">그럼 IDS/IPS가 패킷 하나하나만 보면 공격을 놓칠 수 있다.&nbsp;그래서 IDS/IPS는 여러 패킷을 다시 조립해서 하나의 세션이나 요청으로 복원한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">예를 들어 HTTP 요청이 여러 TCP 패킷에 나눠져 들어오면, 이를 다시 하나의 HTTP 요청처럼 보고 분석해야 한다.</p>
<h3 data-ke-size="size23">3. 프로토콜 분석</h3>
<p data-ke-size="size16">그 다음에는 프로토콜을 분석한다.</p>
<p data-ke-size="size16">HTTP면 HTTP 메서드, URI, 헤더, 바디를 본다. DNS면 질의 도메인, 응답 IP, 레코드 타입을 본다. SMB, FTP, TLS 같은 프로토콜도 각각의 구조를 보고 이상한 부분이 있는지 판단한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h4 data-ke-size="size20">4. 탐지 방식 적용</h4>
<p data-ke-size="size16">이제 여기서 탐지 방식을 적용한다.</p>
<p data-ke-size="size16">대표적으로는</p>
<p data-ke-size="size16">&nbsp;</p>
<ul style="list-style-type: disc;" data-ke-list-type="disc">
<li>시그니처 기반 탐지</li>
<li>이상행위 기반 탐지</li>
<li>상태 기반 프로토콜 분석</li>
<li>평판 기반 탐지</li>
<li>정책 기반 탐지</li>
</ul>
<h2 data-ke-size="size26">탐지 방식</h2>
<h3 data-ke-size="size23">시그니처 기반 탐지</h3>
<p data-ke-size="size16">시그니처 기반 탐지는 이미 알려진 공격 패턴을 기준으로 탐지하는 방식이다.</p>
<p data-ke-size="size16">예를 들어 특정 악성코드 패턴, SQL Injection 문자열, 취약점 공격 페이로드, 악성 User-Agent, C2 통신 패턴 같은 것들이 시그니처가 될 수 있다.</p>
<p data-ke-size="size16">이 방식은 이미 알려진 공격에는 강하다. 그 이유는 공격 패턴이 명확하면 그 패턴을 룰로 만들어서 탐지하면 되기 때문이다.</p>
<p data-ke-size="size16">하지만 단점도 있다.&nbsp;새로운 공격이나 변형된 공격에는 약하다.</p>
<p data-ke-size="size16">아직 시그니처가 없으면 탐지를 못할 수 있다. 그래서 시그니처 기반 IDS/IPS는 룰 업데이트가 중요하다.</p>
<h3 data-ke-size="size23">이상행위 기반 탐지</h3>
<p data-ke-size="size16">이상행위 기반 탐지는 정상 상태를 먼저 학습하고, 그 정상 상태에서 벗어나는 행동을 탐지하는 방식이다.</p>
<p data-ke-size="size16">예를 들어 평소에는 내부 PC가 DNS 요청을 하루에 100번 정도만 하는데 갑자기 수만 번 요청을 보낸다.</p>
<p data-ke-size="size16">그럼 평소와는 다르게 행동하는 내부 PC의 상태에 대해서 이상하다고 탐지를 하는 것이다.&nbsp;</p>
<p data-ke-size="size16">또는 평소에는 접근하지 않던 서버에 새벽 시간에 갑자기 접속한다.</p>
<p data-ke-size="size16">이것도 이상하다.</p>
<p data-ke-size="size16">이상행위 기반 탐지는 알려지지 않은 공격을 잡는 데 도움이 될 수 있다. 근데 오탐이 많을 수 있다. 그 이유는 평소와 다른 행동이라고 해서 무조건 공격은 아니기 때문이다.</p>
<p data-ke-size="size16">예를 들어 관리자가 야간 작업을 하면서 평소와 다른 서버에 접근할 수 있다. 이건 정상 업무인데 IDS 입장에서는 이상행위처럼 보일 수 있다.</p>
<h4 data-ke-size="size20">상태 기반 프로토콜 분석</h4>
<p data-ke-size="size16">상태 기반 프로토콜 분석은 프로토콜이 정상적으로 동작하는 흐름을 기준으로 이상한 점을 찾는 방식이다.</p>
<p data-ke-size="size16">예를 들어 TCP 연결은 SYN, SYN-ACK, ACK 흐름이 있다. HTTP도 요청과 응답 흐름이 있다. FTP도 인증 전과 인증 후에 가능한 명령이 다르다.</p>
<p data-ke-size="size16">이런 정상 흐름에서 벗어나면 이상하다고 판단할 수 있다. 단순 문자열 탐지보다 더 깊게 볼 수 있지만, 상태를 계속 추적해야 하므로 리소스를 더 많이 쓴다.</p>
<h4 data-ke-size="size20">평판 기반 탐지</h4>
<p data-ke-size="size16">평판 기반 탐지는 악성 IP, 악성 도메인, C2 서버, 피싱 도메인 같은 위협 인텔리전스를 기반으로 탐지하는 방식이다.</p>
<p data-ke-size="size16">예를 들어 내부 서버가 이미 악성으로 알려진 도메인에 접속하면 IDS/IPS가 이를 탐지할 수 있다.</p>
<p data-ke-size="size16">이 방식은 Threat Intelligence와 같이 쓰면 효과가 좋다. 근데 문제점은 악성 인프라가 계속 바뀌기 때문에 최신 정보가 중요하다.</p>
<h4 data-ke-size="size20">정책 기반 탐지</h4>
<p data-ke-size="size16">정책 기반 탐지는 조직의 보안 정책을 기준으로 탐지하는 방식이다.</p>
<p data-ke-size="size16">예를 들어 회사 내부망에서 P2P 사용 금지, 외부 SSH 접속 금지, 특정 서버에서 외부 인터넷 직접 접근 금지 같은 정책이 있을 수 있다.</p>
<p data-ke-size="size16">이런 정책을 어기면 공격이 아니더라도 보안 이벤트로 탐지할 수 있다.</p>
<h2 data-ke-size="size26">IDS/IPS 유형</h2>
<p data-ke-size="size16">NIST는 IDPS 기술을 크게 network-based, wireless, network behavior analysis, host-based 유형으로 나눈다.</p>
<h3 data-ke-size="size23">NIDS와 NIPS</h3>
<p data-ke-size="size16">NIDS는 Network-based Intrusion Detection System이다.&nbsp;네트워크 구간에 배치해서 트래픽을 감시한다.</p>
<p data-ke-size="size16">예를 들어 인터넷 경계, 방화벽 뒤, DMZ, 서버팜 앞, 내부망 구간 사이에 둘 수 있다.&nbsp;</p>
<p data-ke-size="size16">NIPS는 Network-based Intrusion Prevention System이다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1280" data-origin-height="720"><span data-url="https://blog.kakaocdn.net/dna/cbBy5R/dJMcab5fgqD/AAAAAAAAAAAAAAAAAAAAAG7Lmd3lDaz5Xfp_qgiJMn2hPUmheHsBIjPrdG5CJaBL/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=Wy7H3YXPnd381l%2BDLUHYRmkhbnI%3D" data-phocus="https://blog.kakaocdn.net/dna/cbBy5R/dJMcab5fgqD/AAAAAAAAAAAAAAAAAAAAAG7Lmd3lDaz5Xfp_qgiJMn2hPUmheHsBIjPrdG5CJaBL/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=Wy7H3YXPnd381l%2BDLUHYRmkhbnI%3D"><img src="https://blog.kakaocdn.net/dna/cbBy5R/dJMcab5fgqD/AAAAAAAAAAAAAAAAAAAAAG7Lmd3lDaz5Xfp_qgiJMn2hPUmheHsBIjPrdG5CJaBL/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=Wy7H3YXPnd381l%2BDLUHYRmkhbnI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcbBy5R%2FdJMcab5fgqD%2FAAAAAAAAAAAAAAAAAAAAAG7Lmd3lDaz5Xfp_qgiJMn2hPUmheHsBIjPrdG5CJaBL%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DWy7H3YXPnd381l%252BDLUHYRmkhbnI%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1280" height="720" data-origin-width="1280" data-origin-height="720"/></span></figure>
</p>
<p data-ke-size="size16">NIDS처럼 네트워크 트래픽을 분석하지만, 인라인으로 배치되어 공격을 직접 차단할 수 있다.</p>
<p data-ke-size="size16">정리하면&nbsp; NIDS는 네트워크를 보고 알려주는 것이고 NIPS는 네트워크를 보고 막는 것이다.&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">사진처럼 인라인으로 들어가냐 안 들어가는지에 대한 차이점이다.&nbsp;</p>
<h3 data-ke-size="size23">HIDS</h3>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1024" data-origin-height="768"><span data-url="https://blog.kakaocdn.net/dna/baR4nI/dJMcabEbh5r/AAAAAAAAAAAAAAAAAAAAACGr-RGuljh29KXw4IQnZtT8k3acpyLpPhatPOK3o7dQ/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=1mWIb9hliPe3YZj93gxV0je72VQ%3D" data-phocus="https://blog.kakaocdn.net/dna/baR4nI/dJMcabEbh5r/AAAAAAAAAAAAAAAAAAAAACGr-RGuljh29KXw4IQnZtT8k3acpyLpPhatPOK3o7dQ/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=1mWIb9hliPe3YZj93gxV0je72VQ%3D"><img src="https://blog.kakaocdn.net/dna/baR4nI/dJMcabEbh5r/AAAAAAAAAAAAAAAAAAAAACGr-RGuljh29KXw4IQnZtT8k3acpyLpPhatPOK3o7dQ/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=1mWIb9hliPe3YZj93gxV0je72VQ%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbaR4nI%2FdJMcabEbh5r%2FAAAAAAAAAAAAAAAAAAAAACGr-RGuljh29KXw4IQnZtT8k3acpyLpPhatPOK3o7dQ%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D1mWIb9hliPe3YZj93gxV0je72VQ%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1024" height="768" data-origin-width="1024" data-origin-height="768"/></span></figure>
</p>
<p data-ke-size="size16">HIDS는 Host-based Intrusion Detection System이다.</p>
<p data-ke-size="size16">서버나 PC 같은 개별 호스트에 설치되어 로그, 파일 변경, 계정 변경, 프로세스 실행, 네트워크 연결 등을 감시한다.</p>
<p data-ke-size="size16">예를 들어 공격자가 웹쉘을 업로드하거나, 시스템 파일을 수정하거나, 로그를 삭제하면 HIDS가 탐지할 수 있다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">NIDS와의 차이점은 내부 로그를 보냐, 외부에서 들어오는 로그들을 보냐의 차이점이다.&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<h2 data-ke-size="size26">그러면 방화벽과 IDS/IPS의 차이점은 무엇일까?</h2>
<p data-ke-size="size16">방화벽도 막고, IPS도 막는다. 그럼 어떤 것이 다를까?</p>
<p data-ke-size="size16">방화벽은 주로 정책 기반 접근제어를 한다.</p>
<p data-ke-size="size16">예를 들어</p>
<pre id="code_1778614876845" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>이 IP는 허용
이 포트는 차단
이 프로토콜은 허용
이 대역은 차단</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">반면 IDS/IPS는 트래픽 내용과 행위를 본다. 방화벽보다 세부적인 컨트롤도 가능하며 행위 중심이라는 것에 차이점이 있다.&nbsp;</p>
<pre id="code_1778614888405" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>예를 들어 443 포트는 허용되어 있어도, 그 안에 취약점 공격 페이로드가 들어있으면
IPS가 탐지하고 차단할 수 있다.

Palo Alto도 방화벽은 보안 규칙에 따라 트래픽을 필터링하고, IDS는 잠재적인 
보안 침해를 모니터링하고 경고하며, IPS는 위협을 적극적으로 차단한다고 설명한다.</code></pre>
<h2 data-ke-size="size26">대표 도구</h2>
<h3 data-ke-size="size23">Snort</h3>
<p data-ke-size="size16"><a href="https://www.snort.org/" target="_blank" rel="noopener noreferrer">https://www.snort.org/</a></p>
<p data-ke-size="size16">Snort는 대표적인 오픈소스 IDS/IPS 도구이다. Snort 공식 FAQ에서는 Snort를 IP 네트워크에서 실시간 트래픽 분석과 패킷 로깅을 수행할 수 있는 오픈소스 네트워크 침입 방지 시스템이라고 설명한다. 또한 프로토콜 분석, 콘텐츠 검색, 매칭을 통해 다양한 공격과 probe를 탐지할 수 있다고 한다.</p>
<p data-ke-size="size16">Snort의 장점은 룰 기반 탐지에 강하다는 것이다.&nbsp;그래서 특정 공격 패턴을 룰로 작성해서 탐지하는 방식으로 많이 사용된다.</p>
<h3 data-ke-size="size23">Suricata</h3>
<p data-ke-size="size16"><a href="https://suricata.io/" target="_blank" rel="noopener noreferrer">https://suricata.io/</a></p>
<p data-ke-size="size16">Suricata도 대표적인 오픈소스 네트워크 위협 탐지 엔진이다.&nbsp;Suricata 공식 사이트에서는 Suricata를 고성능 오픈소스 네트워크 분석 및 위협 탐지 소프트웨어라고 설명한다. 또한 Suricata 엔진은 실시간 IDS, 인라인 IPS, NSM, 오프라인 PCAP 처리 기능을 지원한다고 설명한다.</p>
<p data-ke-size="size16">Suricata는 Snort와 비슷하게 룰 기반 탐지를 지원하면서도 고성능 처리를 목표로 많이 사용된다.</p>
<h3 data-ke-size="size23">Zeek</h3>
<p data-ke-size="size16"><a href="https://zeek.org/" target="_blank" rel="noopener noreferrer">https://zeek.org/</a></p>
<p data-ke-size="size16">Zeek는 위에 2개와는 살짝 다른 성격을 가지고 있다.&nbsp;Zeek는 Snort나 Suricata처럼 단순히 룰 매칭 중심으로만 보는 도구라기보다는, 네트워크 트래픽을 분석해서 풍부한 로그를 남기는 네트워크 보안 모니터링 도구에 가깝다.</p>
<p data-ke-size="size16">그래서 Zeek는 위협 헌팅이나 사고 분석에 좋다.</p>
<p data-ke-size="size16">&nbsp;</p>
