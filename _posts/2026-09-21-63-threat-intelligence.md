---
layout: post
title: Threat Intelligence
date: 2026-09-21
desc: "Kimsuky와 Konni는 같은 조직일까 - 공개 보고서 기반으로 명명 시점, BabyShark/KONNI 악성코드, ESRC가 제시한 공통점 추적"
keywords: "Threat Intelligence, Kimsuky, Konni, BabyShark, APT, ESRC, Unit 42, Cisco Talos, Huntress, ASEC, 위협 인텔리전스, 프론티어"
categories: [TechnicalDocument]
tags: [Threat Intelligence, APT, 프론티어]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/63](https://sanghole.tistory.com/63)

<h2 data-ke-size="size26">Kimsuky와 Konni는 같은 조직일까?</h2>
<p data-ke-size="size16">이번 과제에서는 Huntress와 ASEC 보고서에 등장하는 공격자를 조사했다. 자료 A의 공격자는 P, 자료 B의 공격자는 Q로 두고, 각각의 이름이 처음 공개된 자료부터 찾아봤다. 그다음에는 두 집단을 함께 다룬 보고서를 읽으며 어떤 근거로 서로 연결하는지 정리했다.</p>
<p data-ke-size="size16">악성코드 샘플을 직접 분석하지는 않았다. 공개된 분석 보고서를 참고했고, 자료에서 확인한 내용과 내 생각을 나누어 적었다.</p>
<h2 data-ke-size="size26">1. 자료 A와 B의 공격자는 누구인가</h2>
<h3 data-ke-size="size23">자료 A: BabyShark와 Kimsuky</h3>
<p data-ke-size="size16">자료 A는 Huntress의 <a href="https://www.huntress.com/blog/targeted-apt-activity-babyshark-is-out-for-blood">Targeted APT Activity: BABYSHARK Is Out for Blood</a>이며 보고서는 2022년 3월 1일에 공개됐고, 피해 환경에서 발견한 가장 이른 스크립트 흔적은 2021년 3월 9일에 발견되었다. </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="468" data-origin-width="1470"><span data-alt="https://www.huntress.com/blog/targeted-apt-activity-babyshark-is-out-for-blood 출처" data-phocus="https://blog.kakaocdn.net/dna/bbnMH2/dJMb99OAoP4/AAAAAAAAAAAAAAAAAAAAANfSLTGfLCkoQg5-DtQMoguzpQdk_TzOctUM8V90w3ZF/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=sSFF7X%2FhjoEPmGMXb2lbpHVx4nA%3D" data-url="https://blog.kakaocdn.net/dna/bbnMH2/dJMb99OAoP4/AAAAAAAAAAAAAAAAAAAAANfSLTGfLCkoQg5-DtQMoguzpQdk_TzOctUM8V90w3ZF/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=sSFF7X%2FhjoEPmGMXb2lbpHVx4nA%3D"><img data-origin-height="468" data-origin-width="1470" height="468" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bbnMH2/dJMb99OAoP4/AAAAAAAAAAAAAAAAAAAAANfSLTGfLCkoQg5-DtQMoguzpQdk_TzOctUM8V90w3ZF/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1790780399&amp;allow_ip=&amp;allow_referer=&amp;signature=sSFF7X%2FhjoEPmGMXb2lbpHVx4nA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbbnMH2%2FdJMb99OAoP4%2FAAAAAAAAAAAAAAAAAAAAANfSLTGfLCkoQg5-DtQMoguzpQdk_TzOctUM8V90w3ZF%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DsSFF7X%252FhjoEPmGMXb2lbpHVx4nA%253D" width="1470"/></span><figcaption>https://www.huntress.com/blog/targeted-apt-activity-babyshark-is-out-for-blood 출처</figcaption>
</figure>
</p>
<p data-ke-size="size16">공격자는 VOA 기자를 사칭해 피해자와 이메일을 주고받다가 암호가 걸린 악성 Word 문서를 보냈다. 그 후 Huntress는 조사 과정에서 GoogleUpdater라는 예약 작업과 qwert.vbs 스크립트 등을 발견했다. Google Drive를 이용해 추가 스크립트를 전달한 흔적도 있었다. </p>
<p data-ke-size="size16">다른 문서들을 읽고 나서, <span style="color: #333333; text-align: start;">Huntress가 원문에서 공격자를 Kimsuky라고 직접 부르지는 않았기 때문에 </span>P를 Kimsuky라고 적기에는 걸리는 부분이 있었다. 그러다 연결점을 찾은 것은 AhnLab의 <a href="https://asec.ahnlab.com/wp-content/uploads/2023/09/ATIP_2023_Jul_Threat-Trend-Report-on-Kimsuky-Group.pdf">2023년 7월 Kimsuky 위협 동향 보고서</a>이다. 이 보고서는 BabyShark를 Kimsuky가 사용하는 악성코드 유형으로 다루며 내용을 요약하자면 Kimsuky가 한 종류의 악성코드만 쓰는 것이 아니라 여러 유형의 도구를 사용한다고 보고 있고, 대표적으로 네 가지를 분류해서 추적하고 있다.</p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>FlowerPower : PowerShell 기반 키로거</li>
<li>RandomQuery : Js, VBS, PowerShell 등을 사용하는 정보 탈취형 악성코드</li>
<li>AppleSeed : 백도어</li>
<li>BabyShark : HTA와 VBS를 주로 사용하는 정보 탈취형 악성코드</li>
</ul>
<p data-ke-size="size16">Huntress에 있는 보고서에서 발견한 악성코드는 BABYSHARK이다. 그래서 이거 Kimsuky와 관련한 악성코드를 사용했으니, 살짝 의심을 했다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">자료 B: Konni</h3>
<p data-ke-size="size16">자료 B는 ASEC이 2023년 12월 6일 공개한 <a href="https://asec.ahnlab.com/ko/59625/">개인정보 유출 관련 내용으로 위장한 피싱 메일 유포 (Konni)</a>다. 이쪽은 본문에서 Konni 공격 그룹을 직접 언급하므로 Q를 Konni로 잡았다. </p>
<p data-ke-size="size16">공격자는 개인정보 유출 자료처럼 보이는 악성 EXE 파일을 유포해서, 파일을 실행하면 정상 문서를 보여주는 동안 JSE와 PowerShell 스크립트가 생성되고, 예약 작업을 통해 후속 동작이 이루어지는 방식이었다.</p>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">2. 이름을 처음 붙인 보고서</h2>
<h3 data-ke-size="size23">Kimsuky</h3>
<p data-ke-size="size16">Kimsuky라는 이름의 출발점으로 찾은 자료는 Kaspersky의 <a href="https://securelist.com/the-kimsuky-operation-a-north-korean-apt/57915/">The Kimsuky Operation: A North Korean APT?</a>다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이 보고서는 한국의 싱크탱크 등을 겨냥한 첩보 활동을 분석하며 공격 대상으로 세종연구소, 한국국방연구원, 통일부 등이 언급된다. 악성코드에는 HWP 문서 탈취와 키로깅 기능이 있었고, 변조한 TeamViewer를 이용한 원격 제어도 설명되어 있다.</p>
<p data-ke-size="size16">이름과 관련된 단서는 공격에 사용된 이메일 계정에서 나온다. 원문에는 계정 등록명으로 kimsukyang과 Kim asdfa가 등장하지만 Kaspersky도 이 등록명이 실제 공격자의 이름인지는 확신하지 않았다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">여기서 확인할 수 있는 것은 2013년에 Kimsuky라는 이름으로 이 활동이 공개됐다는 점이다. </p>
<h3 data-ke-size="size23">Konni</h3>
<p data-ke-size="size16">KONNI라는 이름은 Cisco Talos의 <a href="https://blog.talosintelligence.com/konni-malware-under-radar-for-years/">KONNI: A Malware Under The Radar For Years</a>에서 찾았다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">예상과 달랐던 부분은 처음 이름이 붙은 대상이었다. Talos는 자신들이 이 악성코드를 KONNI라고 명명했다고 적었다. 지금은 Konni 그룹이라는 표현도 쓰지만, 처음에는 악성코드 이름이었다.</p>
<p data-ke-size="size16">보고서는 2014년, 2016년, 2017년에 있었던 캠페인을 분석해서 정보 수집 기능부터 파일 전송, 화면 캡처, 명령 실행 등을 지원하는 원격 제어 도구로 발전한 과정이 담았다. 이름이 공개된 해는 2017년이지만, Talos가 확인한 활동은 2014년까지 거슬러 올라간다. 이 내용은 <a href="https://blog.talosintelligence.com/konni-malware-under-radar-for-years/">Talos의 최초 보고서</a>를 참고했다.</p>
<p data-ke-size="size16">악성코드 이름이 그룹 이름으로 쓰이게 된 배경은 Unit 42의 <a href="https://unit42.paloaltonetworks.com/the-fractured-statue-campaign-u-s-government-targeted-in-spear-phishing-attacks/">The Fractured Statue Campaign</a>에 설명되어 있다. KONNI RAT을 사용하지 않아도 공격 기법과 절차가 강하게 겹치는 사례들이 발견되면서, 일부 연구자들이 그 배후까지 Konni라고 부르기 시작했다는 것이다. Unit 42도 이런 이유로 Konni Group이라는 표현을 사용한다고 밝혔다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">BabyShark는..?</h3>
<p data-ke-size="size16">자료 A에 나오는 BabyShark는 그룹명과 혼동하지 않도록 따로 찾아봤려고 했다.</p>
<p data-ke-size="size16">Palo Alto Networks Unit 42는 2019년 2월 22일 보고서에서 새로운 VBScript 기반 악성코드를 BabyShark라고 명명하며 당시 확인한 가장 이른 샘플은 2018년 11월의 것이었다.</p>
<p data-ke-size="size16">악성코드는 시스템 정보를 수집해 전송하고, 지속성을 유지하면서 추가 명령을 기다리는 기능을 갖고 있었다. </p>
<p data-ke-size="size16">Kimsuky, KONNI, BabyShark는 이렇게 이름이 공개된 시점도, 처음 가리킨 대상도 다 다르다.</p>
<h2 data-ke-size="size26">3. 두 집단 사이에서 겹치는 흔적</h2>
<p data-ke-size="size16">두 집단의 관계를 직접 다룬 자료는 ESRC가 2019년 6월 20일 공개한 <a href="https://www.estsecurity.com/enterprise/security-center/notice/view/434">APT 캠페인 Konni &amp; Kimsuky 조직의 공통점 발견</a>이다. ESRC는 파일, 코드, 인프라 등을 비교하고 두 활동 사이에 연관성이 있을 가능성이 높다고 판단했다.</p>
<p data-ke-size="size16">ESRC가 비교한 내용 중 파일과 코드, 접속 기록을 표로 정리하면 아래와 같다!</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>비교한 부분</th>
<th>ESRC가 보고한 공통점</th>
</tr>
</thead>
<tbody>
<tr>
<td>파일과 설정</td>
<td>ChromSrch.dat 파일명과 암호화 압축파일의 설정 암호가 일치했다.</td>
</tr>
<tr>
<td>코드</td>
<td>insrchmdl 식별자와 디코딩 루틴이 일치했다.</td>
</tr>
<tr>
<td>원격 제어 도구</td>
<td>커스텀 TeamViewer의 기능과 Gongstrong 문자열이 겹쳤다.</td>
</tr>
<tr>
<td>접속 흔적</td>
<td>Konni 관련 메일 헤더와 Kimsuky 관련 거래소 로그인 이력에서 같은 IP가 나타났다.</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">파일명 하나만 같았다면 우연이거나 흔한 이름일 수 있다고 생각할 수 있지만 설정 암호와 코드의 특정 부분까지 일치했다는 점에서, 서로 관련 없는 도구가 따로 만들어졌다고 보기보다는 같은 코드나 도구를 공유했을 가능성을 먼저 생각하게 됐다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">IP 부분은 조금 더 주의해서 읽었다. ESRC가 제시한 202.168.155[.]156은 본문에서 Konni 메일의 X-EN-OrigIP와 Kimsuky 관련 거래소 로그인 이력에 등장한다!. 그래서 이 ip 주소가 메일에 남은 주소인지, 공격자가 접속할 때 쓴 주소인지, 악성코드가 명령을 받는 서버 주소인지에 따라 해석이 달라지기 때문에 같은 IP가 나왔다는 점을 의심할 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">공격 주제도 일부 겹쳤다. ESRC는 북한 관련 정치·사회적 주제와 암호화폐 관련 활동을 함께 다루는데  이런 공통점보다는 코드와 설정이 일치한 부분에 더 비중을 뒀다. 공격 대상이나 미끼 주제만 비슷한 경우보다 두 활동의 관계를 구체적으로 살펴볼 수 있기 때문이다. </p>
<h2 data-ke-size="size26">4. 내가 내린 결론</h2>
<p data-ke-size="size16">나는 Kimsuky와 Konni가 아무 관계도 없는 집단이라고 보기는 어렵다고 생각한다. ESRC가 제시한 설정 암호, 코드, 커스텀 도구, IP 기록의 공통점은 적어도 일부 활동에서 도구나 운영 자원을 공유했을 가능성을 보여준다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그렇다고 해서 두 집단이 동일한 집단이다! 라고 명명하기에는 확실한 물증이 없다. </p>
<p data-ke-size="size16">현재로서는 두 집단의 일부 활동이 연결되어 있고, 도구나 인프라를 공유했거나 업체별 분류 범위가 겹쳐 있을 가능성이 있다는 정도로 정리하는 것이 맞다고 본다..</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">같은 운영팀인지, 다른 팀이 같은 도구를 쓰는 것인지, 상위 조직을 공유하는 것인지는 아직 남는 질문이다. </p>
<h2 data-ke-size="size26">6. 조사하면서 알게 된 점</h2>
<p data-ke-size="size16">Konni가 원래 악성코드 이름이었다는 것을 이번에 알게 됐다. 자료 B에서는 그룹 이름으로 사용되기 때문에 처음부터 조직을 부르던 이름일 거라고 생각하기 쉬웠다. Talos와 Unit 42 보고서를 같이 보면서 그 사이에 이름의 쓰임이 바뀌었다는 것을 알게 됐다.</p>
<p data-ke-size="size16">보고서를 요약할 때도 주의할 부분이 있었다. 자료 A는 Kimsuky를 직접 지목하지 않았고, 자료 B는 최종 행위를 확인하지 못했다고 적었다. 이 부분을 빼고 요약하면 원문에서 확인한 것보다 더 많은 사실이 밝혀진 것처럼 보일 수 있다.</p>
<p data-ke-size="size16">같은 도구를 썼다는 것과 같은 사람이 공격했다는 것도 구분하게 됐다. 코드나 IP가 겹치면 연결을 의심할 수는 있지만, 실제로 어느 조직이 운영했는지까지 알아내려면 다른 근거가 더 필요하다.</p>
<p data-ke-size="size16"> </p>
