---
layout: post
title: 프론티어_EDR 환경을 직접 구축 후 실습
date: 2026-09-07
desc: "Elastic Container Project로 EDR 환경 구축 - Elastic Stack 구성요소, Elastic Defend/Agent 등록, Atomic Red Team T1082 탐지 확인"
keywords: "EDR, Elastic Stack, Elasticsearch, Kibana, Elastic Agent, Elastic Defend, Atomic Red Team, T1082, 엔드포인트보안, 프론티어"
categories: [TechnicalDocument]
tags: [EDR, Elastic, 프론티어, 엔드포인트보안]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/55](https://sanghole.tistory.com/55)

<p data-ke-size="size16">수행 과정: <span style="background-color: oklab(0.219511 0.00211037 -0.00744569); color: oklab(0.952693 0.000792831 -0.00253612); text-align: start;"> 1) Elastic EDR 구축 2) Elastic Defend 추가 3) Elastic Agent 설치 및 등록 4) 실행을 통한 edr 탐지 확인 및 분석</span></p>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">모르는 개념들</h2>
<p data-ke-size="size16" style="color: #333333; text-align: start;">RESTful은 REST 아키텍처의 원칙과 규칙을 성실하게 따르고 지켜서 만든 웹 서비스나 API를 부르는 용어이다. </p>
<p data-ke-size="size16" style="color: #333333; text-align: start;">REST는 자원을 이름으로 구분하여 상태를 주고받는 네트워크 소프트웨어 아키텍처 스타일이다.</p>
<h3 data-ke-size="size23">일단 Elastic Stack. 이란?</h3>
<p data-ke-size="size16">Elastic Stack은 여러 개의 서로 다른 구성 요소로 이루어져 있으며, 각 구성 요소는 다양한 사용 사례에서 활용할 수 있는 고유한 기능을 제공한다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">Elasticsearch</h4>
<p data-ke-size="size16" style="color: #000000; text-align: start;">Elasticsearch는 분산형 RESTful 검색 및 분석 엔진이다. Elastic Stack의 핵심 구성 요소로서 데이터를 중앙에 저장하며, 매우 빠른 검색 성능, 정교하게 조정할 수 있는 검색 관련성과 손쉽게 확장 가능한 강력한 분석 기능을 제공한다.</p>
<p data-ke-size="size16" style="color: #000000; text-align: start;"> </p>
<h3 data-ke-size="size23" style="color: #000000; text-align: start;">Kibana</h3>
<p data-ke-size="size16">Kibana는 Elasticsearch에 저장된 데이터를 시각화하고, 관리할 수 있도록 해주는 사용자 인터페이스</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">Elastic Agent</h4>
<p data-ke-size="size16">Elastic Agent는 엔드포인트에서 데이터를 수집하거나, 위협 인텔리전스 피드와 같은 서드파티 데이터 소스의 데이터를 Elastic Stack으로 전달하는 역할을 수행할 수 있는 모듈형 에이전트이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">예시)</p>
<p data-ke-size="size16">여러 컴퓨터나 외부 시스템에서 보안, 운영 데이터를 모아서 Elastic Stack으로 보내주는 수집기.</p>
<p data-ke-size="size16">직원 PC나 리눅스 서버, 웹 서버, 클라우드 서버 등에서 나오는 데이터들을 받아서 Elasticsearch로 전달할 수 있다는 것이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">Elastic Container Project.</h2>
<p data-ke-size="size16">Elastic Stack은 모듈형 구조로 되어 있기 때문에 매우 다양한 사용 사례에 유연하게 적용할 수 있다. 하지만 이러한 유연성은 실제 구현 과정의 복잡성을 높일 수 있다.</p>
<p data-ke-size="size16">=&gt; Docker Compose를 사용하여 비프로덕션 환경에서 완전하게 동작하는 Elastic Stack을 구축할 수 있도록 만든 오픈소스 프로젝트이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그래서 Elastic Container Project에는 다음 세 가지 주요 구성 요소가 포함되어 있다.</p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>Elasticsearch</li>
<li>Kibana</li>
<li>Elastic Agent</li>
</ul>
<p data-ke-size="size16">그 후, <a href="https://www.elastic.co/security-labs/blog/the-elastic-container-project" rel="noopener noreferrer" target="_blank">https://www.elastic.co/security-labs/blog/the-elastic-container-project</a></p>
<figure contenteditable="false" data-ke-align="alignCenter" data-ke-type="opengraph" data-og-description="The Elastic Container Project provides a single shell script that will allow you to stand up and manage an entire Elastic Stack using Docker. This open source project enables rapid deployment for test..." data-og-host="www.elastic.co" data-og-image="https://blog.kakaocdn.net/dna/b7uMdm/dJMb9gxEFd6/AAAAAAAAAAAAAAAAAAAAANOfebpe9bQBlewKO0zdm-eAqfflaZtBS-m9X8jTQHkE/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=8O40QVu1F02YDnohOjRSenScIKw%3D" data-og-source-url="https://www.elastic.co/security-labs/blog/the-elastic-container-project" data-og-title="The Elastic Container Project for Security Research" data-og-type="website" data-og-url="https://www.elastic.co/security-labs/blog/the-elastic-container-project" id="og_1788716641515"><a data-source-url="https://www.elastic.co/security-labs/blog/the-elastic-container-project" href="https://www.elastic.co/security-labs/blog/the-elastic-container-project" rel="noopener" target="_blank">
<div class="og-image" style="background-image: url('https://blog.kakaocdn.net/dna/b7uMdm/dJMb9gxEFd6/AAAAAAAAAAAAAAAAAAAAANOfebpe9bQBlewKO0zdm-eAqfflaZtBS-m9X8jTQHkE/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=8O40QVu1F02YDnohOjRSenScIKw%3D');"> </div>
<div class="og-text">
<p class="og-title" data-ke-size="size16">The Elastic Container Project for Security Research</p>
<p class="og-desc" data-ke-size="size16">The Elastic Container Project provides a single shell script that will allow you to stand up and manage an entire Elastic Stack using Docker. This open source project enables rapid deployment for test...</p>
<p class="og-host" data-ke-size="size16">www.elastic.co</p>
</div>
</a></figure>
<p data-ke-size="size16">여기에 있는 과정들을 통해 실제 clone 및 환경 설정을 그대로 따라했다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="231" data-origin-width="829"><span data-phocus="https://blog.kakaocdn.net/dna/b3sjh1/dJMcadJ3Z33/AAAAAAAAAAAAAAAAAAAAABCCNpNv91wHo-Y7iZyduPfuj-lbb3TpKISRbM-kPkLn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=2TWol9mtcFAzcxWarsjQ0ivxbRA%3D" data-url="https://blog.kakaocdn.net/dna/b3sjh1/dJMcadJ3Z33/AAAAAAAAAAAAAAAAAAAAABCCNpNv91wHo-Y7iZyduPfuj-lbb3TpKISRbM-kPkLn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=2TWol9mtcFAzcxWarsjQ0ivxbRA%3D"><img data-origin-height="231" data-origin-width="829" height="231" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/b3sjh1/dJMcadJ3Z33/AAAAAAAAAAAAAAAAAAAAABCCNpNv91wHo-Y7iZyduPfuj-lbb3TpKISRbM-kPkLn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=2TWol9mtcFAzcxWarsjQ0ivxbRA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb3sjh1%2FdJMcadJ3Z33%2FAAAAAAAAAAAAAAAAAAAAABCCNpNv91wHo-Y7iZyduPfuj-lbb3TpKISRbM-kPkLn%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3D2TWol9mtcFAzcxWarsjQ0ivxbRA%253D" width="829"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">.env 파일에서 계정과 비밀번호 등의 환경변수를 설정한 뒤 Docker Compose 기반 스크립트를 실행하면, Elasticsearch, Kibana, Elastic Agent 등의 구성요소가 각각 컨테이너로 구동된다. 이후 브라우저에서 https://localhost:5601로 접속하면 Kibana의 웹 UI를 확인할 수 있다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="917" data-origin-width="1590"><span data-alt="실제 홈페이지 모습" data-phocus="https://blog.kakaocdn.net/dna/ecOqso/dJMcaiLnst4/AAAAAAAAAAAAAAAAAAAAAPK7yEZVtPzD-0ikvwABEo5koZ4Tgt5DokDZG4MKmGu6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=w53RHx%2FedMARkCD8pWHFdD2orVo%3D" data-url="https://blog.kakaocdn.net/dna/ecOqso/dJMcaiLnst4/AAAAAAAAAAAAAAAAAAAAAPK7yEZVtPzD-0ikvwABEo5koZ4Tgt5DokDZG4MKmGu6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=w53RHx%2FedMARkCD8pWHFdD2orVo%3D"><img data-origin-height="917" data-origin-width="1590" height="343" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/ecOqso/dJMcaiLnst4/AAAAAAAAAAAAAAAAAAAAAPK7yEZVtPzD-0ikvwABEo5koZ4Tgt5DokDZG4MKmGu6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=w53RHx%2FedMARkCD8pWHFdD2orVo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FecOqso%2FdJMcaiLnst4%2FAAAAAAAAAAAAAAAAAAAAAPK7yEZVtPzD-0ikvwABEo5koZ4Tgt5DokDZG4MKmGu6%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3Dw53RHx%252FedMARkCD8pWHFdD2orVo%253D" width="595"/></span><figcaption>실제 홈페이지 모습</figcaption>
</figure>
</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="508" data-origin-width="852"><span data-phocus="https://blog.kakaocdn.net/dna/0n3Mi/dJMb9915ofg/AAAAAAAAAAAAAAAAAAAAAGzP6_uuU0BdJCuDaxxJCOX-lTMI7FyteVnbZgQG8fRO/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=1L7Ox0NyM1S7wW4DOU4ETF9C7XE%3D" data-url="https://blog.kakaocdn.net/dna/0n3Mi/dJMb9915ofg/AAAAAAAAAAAAAAAAAAAAAGzP6_uuU0BdJCuDaxxJCOX-lTMI7FyteVnbZgQG8fRO/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=1L7Ox0NyM1S7wW4DOU4ETF9C7XE%3D"><img data-origin-height="508" data-origin-width="852" height="508" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/0n3Mi/dJMb9915ofg/AAAAAAAAAAAAAAAAAAAAAGzP6_uuU0BdJCuDaxxJCOX-lTMI7FyteVnbZgQG8fRO/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=1L7Ox0NyM1S7wW4DOU4ETF9C7XE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F0n3Mi%2FdJMb9915ofg%2FAAAAAAAAAAAAAAAAAAAAAGzP6_uuU0BdJCuDaxxJCOX-lTMI7FyteVnbZgQG8fRO%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3D1L7Ox0NyM1S7wW4DOU4ETF9C7XE%253D" width="852"/></span></figure>
</p>
<p data-ke-size="size16">페이지에 들어가서 왼쪽 버튼을 누르면 이렇게 메뉴가 쭉 뜬다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18">1. Analytics</p>
<p data-ke-size="size16"> </p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li data-end="263" data-start="153">Discover: 수집된 원본 로그/이벤트를 검색하는 곳</li>
<li data-end="315" data-start="264">Dashboards: 여러 시각화와 통계를 하나의 대시보드로 묶어 보는 곳</li>
<li data-end="362" data-start="316">Maps: IP나 위치 정보가 있는 데이터를 지도 기반으로 시각화</li>
<li data-end="413" data-start="363">Machine Learning: 이상 징후나 비정상 패턴을 탐지하는 기능</li>
<li data-end="468" data-start="414">Visualize Library: 차트나 그래프 같은 시각화 객체를 만들고 관리</li>
</ul>
<p data-end="613" data-ke-size="size18" data-start="594">2. Elasticsearch</p>
<p data-end="665" data-ke-size="size16" data-start="615">여기는 Elastic Stack의 데이터 저장·검색 엔진 자체와 관련된 기능입니다.</p>
<ul data-end="825" data-ke-list-type="disc" data-start="667" style="list-style-type: disc;">
<li data-end="705" data-start="667">Overview: Elasticsearch 관련 전체 개요</li>
<li data-end="755" data-start="706">Elasticsearch: Elasticsearch 데이터 및 검색 관련 기능</li>
<li data-end="793" data-start="756">Vector Search: 벡터 임베딩 기반 유사도 검색</li>
<li data-end="825" data-start="794">Semantic Search: 의미 기반 검색</li>
</ul>
<p data-ke-size="size16"> </p>
<p data-end="957" data-ke-size="size18" data-start="938">3. Observability</p>
<p data-end="1008" data-ke-size="size16" data-start="959">여기는 시스템이나 애플리케이션이 정상적으로 동작하고 있는지를 관찰하는 영역입니다.</p>
<div>
<div>
<div>
<div>
<div> </div>
</div>
</div>
</div>
</div>
<ul data-end="1486" data-ke-list-type="disc" data-start="1180" style="list-style-type: disc;">
<li data-end="1215" data-start="1180">Overview: 전체 Observability 현황</li>
<li data-end="1242" data-start="1216">Alerts: 운영 상태에 따른 알림</li>
<li data-end="1281" data-start="1243">SLOs: Service Level Objective 관리</li>
<li data-end="1306" data-start="1282">Cases: 장애/문제 대응 기록</li>
<li data-end="1331" data-start="1307">Logs: 시스템 및 서비스 로그</li>
<li data-end="1376" data-start="1332">Infrastructure: CPU, 메모리, 서버 등의 인프라 상태</li>
<li data-end="1410" data-start="1377">Applications: 애플리케이션 성능/APM</li>
<li data-end="1444" data-start="1411">Synthetics: 서비스 가용성을 자동 테스트</li>
<li data-end="1486" data-start="1445">User Experience: 실제 사용자 관점의 웹 성능 분석</li>
</ul>
<p data-ke-size="size16"> </p>
<p data-end="1536" data-ke-size="size18" data-start="1523">4. Security</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Elastic Security, 즉 SIEM/EDR 기능을 사용하는 곳입니다.</p>
<p data-end="1607" data-ke-size="size16" data-start="1564"> </p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Rules : Detection Rule을 관리한다.</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Alerts : EDR 실습에서 어떤 컴퓨터에서 발생했고, 어떤 사용자였는지 등등을 분석할 수 있게 해주는 페이지</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Attack Discovery : 여러 Alert와 이벤트의 관계를 분석해서 공격 활동을 이해하는 데 사용하는 기능.</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Findings : 취약한 설정이나 보안 상태 등의 보안 Findings를 보는 영역.</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Casese : 보안 사고를 하나의 사건으로 관리한다.</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Timelines : 같은 이벤트를 시간 순서로 모아서 조사할 수 있다.</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Intelligence : Threat Intelligence 영역이며, 악성 IP나 악성 Domain 등과 같은 정보를 다룬다.</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Explore : 보안 데이터를 다양한 관점에서 탐색하는 기능</p>
<p data-end="1607" data-ke-size="size16" data-start="1564"> </p>
<p data-end="1607" data-ke-size="size18" data-start="1564">5. Management</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Elasitc Stack을 실제로 구성하고 관리하는 영역.</p>
<p data-end="1607" data-ke-size="size16" data-start="1564"> </p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Dev Tools : Elasticsearch API를 직접 실행할 수 있는 개발자용 콘솔</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Integrations : Elastic Agent에 무슨 기능을 추가할지 선택하는 곳</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Fleet : Elastic Agent 중앙관리 화면</p>
<p data-end="1607" data-ke-size="size16" data-start="1564">Qsquery : 엔드포인트에 SQL 비슷한 쿼리를 날려 시스템 정보를 조사할 수 있다</p>
<p data-end="1607" data-ke-size="size16" data-start="1564"> </p>
<p data-end="1607" data-ke-size="size16" data-start="1564"> </p>
<p data-end="1607" data-ke-size="size16" data-start="1564">EDR 실습을 하기 위해서는 Agent Elasitc Defend를 먼저 Agent Policy에 넣고 해당 Policy로 Agent를 등록하는 순서가 더 깔끔하니, 일단 Agent Policy를 만든다.</p>
<p data-end="1607" data-ke-size="size16" data-start="1564"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">간단한 설명</p>
<p data-ke-size="size16"> </p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li data-end="1693" data-start="1666">Create agent policy 클릭</li>
<li data-end="1735" data-start="1694">생성 후 Integrations → Elastic Defend</li>
<li data-end="1784" data-start="1736">방금 만든 Windows-EDR-Policy에 Elastic Defend 추가</li>
</ol>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="833" data-origin-width="489"><span data-phocus="https://blog.kakaocdn.net/dna/o2JwV/dJMcaafDYoL/AAAAAAAAAAAAAAAAAAAAAKPH8e2aKDHal5xau0XudLvsisrdoQpT2j0NshqzP3EJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=zs5g5zHYoch%2B4wxN8lm23MJRx4I%3D" data-url="https://blog.kakaocdn.net/dna/o2JwV/dJMcaafDYoL/AAAAAAAAAAAAAAAAAAAAAKPH8e2aKDHal5xau0XudLvsisrdoQpT2j0NshqzP3EJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=zs5g5zHYoch%2B4wxN8lm23MJRx4I%3D"><img data-origin-height="833" data-origin-width="489" height="833" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/o2JwV/dJMcaafDYoL/AAAAAAAAAAAAAAAAAAAAAKPH8e2aKDHal5xau0XudLvsisrdoQpT2j0NshqzP3EJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=zs5g5zHYoch%2B4wxN8lm23MJRx4I%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fo2JwV%2FdJMcaafDYoL%2FAAAAAAAAAAAAAAAAAAAAAKPH8e2aKDHal5xau0XudLvsisrdoQpT2j0NshqzP3EJ%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3Dzs5g5zHYoch%252B4wxN8lm23MJRx4I%253D" width="489"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그러면 이렇게 선택을 하는 창이 뜨는데</p>
<p data-ke-size="size16"> </p>
<h4 data-end="34" data-ke-size="size20" data-start="0"><span>1. Select enrollment token</span></h4>
<p data-end="109" data-ke-size="size16" data-start="36">이건 새로 설치할 Elastic Agent를 어떤 Agent Policy에 등록할지 식별하는 인증 토큰을 고르는 단계입니다. 현재는 Endpoint Policy가 선택되었기 때문에, Agent는 자동으로 Endpoint Policy에 소속된다.</p>
<p data-end="109" data-ke-size="size16" data-start="36"> </p>
<h3 data-end="394" data-ke-size="size23" data-start="349"><span>2. Install Elastic Agent on your host</span></h3>
<p data-end="441" data-ke-size="size16" data-start="396">이건 실제로 감시할 PC에 Elastic Agent를 설치하는 단계입니다.</p>
<p data-end="486" data-ke-size="size16" data-start="443">예를 들어 Windows를 선택하면 Kibana가 설치 명령어를 만들어줍니다. 여기서 주는 명령을 감시 대상 Windows의 관리자 PowerShell에서 실행하면:</p>
<p data-end="486" data-ke-size="size16" data-start="443"> </p>
<p data-end="486" data-ke-size="size16" data-start="443">Elastic Agent 설치 <br/>        ↓ <br/>Fleet Server에 등록 <br/>        ↓ <br/>1번의 Enrollment Token 확인 <br/>        ↓ <br/>Endpoint Policy 적용 <br/>        ↓ <br/>Elastic Defend 동작</p>
<p data-end="535" data-ke-size="size16" data-start="488"> </p>
<div>
<div data-conversation-screenshot-content="">
<div>
<div data-message-author-role="assistant" data-message-id="edb8b04a-96f0-48d9-94b7-f9e6966b4b09" data-message-model-slug="gpt-5-6-thinking">
<div>
<div>
<p data-end="887" data-is-last-node="" data-is-only-node="" data-ke-size="size16" data-start="800">따라서 1번 = 어떤 Policy에 등록할지 정하는 단계, 2번 = 실제 PC에 Agent를 설치하고 그 Policy에 등록하는 단계</p>
<p data-end="887" data-is-last-node="" data-is-only-node="" data-ke-size="size16" data-start="800"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="499" data-origin-width="950"><span data-phocus="https://blog.kakaocdn.net/dna/Iwxi4/dJMcacxHRWW/AAAAAAAAAAAAAAAAAAAAAOuKGeWKWBmwW0wmYyK4QpFjngjmIYpJnuWBAdqwlyBl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=UBcXqtMVJ2dStYBfiS5Ztyh7bpo%3D" data-url="https://blog.kakaocdn.net/dna/Iwxi4/dJMcacxHRWW/AAAAAAAAAAAAAAAAAAAAAOuKGeWKWBmwW0wmYyK4QpFjngjmIYpJnuWBAdqwlyBl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=UBcXqtMVJ2dStYBfiS5Ztyh7bpo%3D"><img data-origin-height="499" data-origin-width="950" height="499" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/Iwxi4/dJMcacxHRWW/AAAAAAAAAAAAAAAAAAAAAOuKGeWKWBmwW0wmYyK4QpFjngjmIYpJnuWBAdqwlyBl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=UBcXqtMVJ2dStYBfiS5Ztyh7bpo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FIwxi4%2FdJMcacxHRWW%2FAAAAAAAAAAAAAAAAAAAAAOuKGeWKWBmwW0wmYyK4QpFjngjmIYpJnuWBAdqwlyBl%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DUBcXqtMVJ2dStYBfiS5Ztyh7bpo%253D" width="950"/></span></figure>
</div>
</div>
</div>
</div>
</div>
<div data-conversation-screenshot-content=""> </div>
<div data-conversation-screenshot-content="">실제로 설치가 끝나면 이렇게 성공했다고 뜨고, </div>
<div data-conversation-screenshot-content=""> </div>
<div data-conversation-screenshot-content=""><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="106" data-origin-width="981"><span data-phocus="https://blog.kakaocdn.net/dna/cpLM95/dJMcajpVw6V/AAAAAAAAAAAAAAAAAAAAADRp1OsuNsiRSFHWiPgnjfneI6pUvT548dAjCeLNAifW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=6VxtvdPd%2FuA6kuSKsGhMvQhNfkI%3D" data-url="https://blog.kakaocdn.net/dna/cpLM95/dJMcajpVw6V/AAAAAAAAAAAAAAAAAAAAADRp1OsuNsiRSFHWiPgnjfneI6pUvT548dAjCeLNAifW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=6VxtvdPd%2FuA6kuSKsGhMvQhNfkI%3D"><img data-origin-height="106" data-origin-width="981" height="106" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cpLM95/dJMcajpVw6V/AAAAAAAAAAAAAAAAAAAAADRp1OsuNsiRSFHWiPgnjfneI6pUvT548dAjCeLNAifW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=6VxtvdPd%2FuA6kuSKsGhMvQhNfkI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcpLM95%2FdJMcajpVw6V%2FAAAAAAAAAAAAAAAAAAAAADRp1OsuNsiRSFHWiPgnjfneI6pUvT548dAjCeLNAifW%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3D6VxtvdPd%252FuA6kuSKsGhMvQhNfkI%253D" width="981"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Fleet -&gt; Agent 칸에 들어가면 내가 넣은 Endpoint Policy가 성공적으로 들어간 것을 확인할 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이러면 이제 실제로 로그가 뜨는 것만 확인하면 되는데, 그전에 배웠던 아토믹 레드팀으로 진행해볼 예정.</p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="629" data-origin-width="953"><span data-phocus="https://blog.kakaocdn.net/dna/bSncM3/dJMb9915oyZ/AAAAAAAAAAAAAAAAAAAAAKDrH3qzdIUDlNqJQSusYYzQcRPJYkNG4sZNHYJexez-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=jeCLVvFrnR35SzuetgNSPWVI78w%3D" data-url="https://blog.kakaocdn.net/dna/bSncM3/dJMb9915oyZ/AAAAAAAAAAAAAAAAAAAAAKDrH3qzdIUDlNqJQSusYYzQcRPJYkNG4sZNHYJexez-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=jeCLVvFrnR35SzuetgNSPWVI78w%3D"><img data-origin-height="629" data-origin-width="953" height="629" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bSncM3/dJMb9915oyZ/AAAAAAAAAAAAAAAAAAAAAKDrH3qzdIUDlNqJQSusYYzQcRPJYkNG4sZNHYJexez-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=jeCLVvFrnR35SzuetgNSPWVI78w%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbSncM3%2FdJMb9915oyZ%2FAAAAAAAAAAAAAAAAAAAAAKDrH3qzdIUDlNqJQSusYYzQcRPJYkNG4sZNHYJexez-%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DjeCLVvFrnR35SzuetgNSPWVI78w%253D" width="953"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 간단한걸로 해보기 위해서 내가 아는선에 있는 아토믹 레드팀 명령어를 확인하기 위해서 먼저 ShowDetail을 하였다.</p>
<p data-ke-size="size16">T1082는 보통 해당 PC가 어떤 OS/하드웨어/환경인지 조사하는 행동을 재현하는 테스트이다. </p>
<p data-ke-size="size16"> </p>
<table border="1" data-end="3788" data-ke-align="alignLeft" data-start="534" style="border-collapse: collapse; width: 100%;">
<tbody data-end="3788" data-start="589">
<tr data-end="717" data-start="589">
<td data-col-size="sm" data-end="603" data-start="589" style="width: 11.1628%;"><b>T1082-1</b></td>
<td data-col-size="sm" data-end="633" data-start="603" style="width: 15.814%;">Invoke-AtomicTest T1082-1</td>
<td data-col-size="md" data-end="669" data-start="633" style="width: 29.186%;">systeminfo, Disk 관련 Registry 조회</td>
<td data-col-size="md" data-end="717" data-start="669" style="width: 43.7209%;">Windows 버전, 패치, 메모리, 시스템 제조사 등 전반적인 PC 정보 수집</td>
</tr>
<tr data-end="788" data-start="718">
<td data-col-size="sm" data-end="732" data-start="718" style="width: 11.1628%;"><b>T1082-7</b></td>
<td data-col-size="sm" data-end="762" data-start="732" style="width: 15.814%;">Invoke-AtomicTest T1082-7</td>
<td data-col-size="md" data-end="775" data-start="762" style="width: 29.186%;">hostname</td>
<td data-col-size="md" data-end="788" data-start="775" style="width: 43.7209%;">컴퓨터 이름 확인</td>
</tr>
<tr data-end="915" data-start="789">
<td data-col-size="sm" data-end="803" data-start="789" style="width: 11.1628%;"><b>T1082-9</b></td>
<td data-col-size="sm" data-end="833" data-start="803" style="width: 15.814%;">Invoke-AtomicTest T1082-9</td>
<td data-col-size="md" data-end="879" data-start="833" style="width: 29.186%;">reg query ...\Cryptography /v MachineGuid</td>
<td data-col-size="md" data-end="915" data-start="879" style="width: 43.7209%;">Windows 설치마다 존재하는 MachineGuid 확인</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">7번을 수행해보기 위해서 아래와 같이 rule을 찾아서 추가해주고</p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="263" data-origin-width="1681"><span data-phocus="https://blog.kakaocdn.net/dna/BvOqy/dJMcacRTLAM/AAAAAAAAAAAAAAAAAAAAAKW-GhM0kQdNmzqgbEpU5Pg8a4_4Uv0xVvKB-rnJUy3n/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=LC7U%2Bc8UEu4rUt%2F5jOM2CbUb9nc%3D" data-url="https://blog.kakaocdn.net/dna/BvOqy/dJMcacRTLAM/AAAAAAAAAAAAAAAAAAAAAKW-GhM0kQdNmzqgbEpU5Pg8a4_4Uv0xVvKB-rnJUy3n/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=LC7U%2Bc8UEu4rUt%2F5jOM2CbUb9nc%3D"><img data-origin-height="263" data-origin-width="1681" height="263" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/BvOqy/dJMcacRTLAM/AAAAAAAAAAAAAAAAAAAAAKW-GhM0kQdNmzqgbEpU5Pg8a4_4Uv0xVvKB-rnJUy3n/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=LC7U%2Bc8UEu4rUt%2F5jOM2CbUb9nc%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FBvOqy%2FdJMcacRTLAM%2FAAAAAAAAAAAAAAAAAAAAAKW-GhM0kQdNmzqgbEpU5Pg8a4_4Uv0xVvKB-rnJUy3n%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DLC7U%252Bc8UEu4rUt%252F5jOM2CbUb9nc%253D" width="1681"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제로 아래처럼 명령어를 입력했을 때, 알람이 뜨는 것을 확인할 수 있었다.</p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="268" data-origin-width="948"><span data-phocus="https://blog.kakaocdn.net/dna/xMcTS/dJMcahTb4La/AAAAAAAAAAAAAAAAAAAAALQvrQNm8WzieshycQBuVcHdi1X5MPx-upKOWqpzIoei/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=Nj7DSqV%2B5aTOhW7pA3JXYCs3f%2FI%3D" data-url="https://blog.kakaocdn.net/dna/xMcTS/dJMcahTb4La/AAAAAAAAAAAAAAAAAAAAALQvrQNm8WzieshycQBuVcHdi1X5MPx-upKOWqpzIoei/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=Nj7DSqV%2B5aTOhW7pA3JXYCs3f%2FI%3D"><img data-origin-height="268" data-origin-width="948" height="268" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/xMcTS/dJMcahTb4La/AAAAAAAAAAAAAAAAAAAAALQvrQNm8WzieshycQBuVcHdi1X5MPx-upKOWqpzIoei/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=Nj7DSqV%2B5aTOhW7pA3JXYCs3f%2FI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FxMcTS%2FdJMcahTb4La%2FAAAAAAAAAAAAAAAAAAAAALQvrQNm8WzieshycQBuVcHdi1X5MPx-upKOWqpzIoei%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DNj7DSqV%252B5aTOhW7pA3JXYCs3f%252FI%253D" width="948"/></span></figure>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="156" data-origin-width="1183"><span data-phocus="https://blog.kakaocdn.net/dna/HCer8/dJMcadwsTb7/AAAAAAAAAAAAAAAAAAAAAHfiPCe25Ybp34h2tHm-F8r6JIYWa3gRWQqSlGl0JbKy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=4x8C%2F8VzcuKPzc05T53K9Nhz%2Fkw%3D" data-url="https://blog.kakaocdn.net/dna/HCer8/dJMcadwsTb7/AAAAAAAAAAAAAAAAAAAAAHfiPCe25Ybp34h2tHm-F8r6JIYWa3gRWQqSlGl0JbKy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=4x8C%2F8VzcuKPzc05T53K9Nhz%2Fkw%3D"><img data-origin-height="156" data-origin-width="1183" height="156" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/HCer8/dJMcadwsTb7/AAAAAAAAAAAAAAAAAAAAAHfiPCe25Ybp34h2tHm-F8r6JIYWa3gRWQqSlGl0JbKy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=4x8C%2F8VzcuKPzc05T53K9Nhz%2Fkw%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FHCer8%2FdJMcadwsTb7%2FAAAAAAAAAAAAAAAAAAAAAHfiPCe25Ybp34h2tHm-F8r6JIYWa3gRWQqSlGl0JbKy%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3D4x8C%252F8VzcuKPzc05T53K9Nhz%252Fkw%253D" width="1183"/></span></figure>
</div>
</div>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
