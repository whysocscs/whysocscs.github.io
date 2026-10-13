---
layout: post
title: 금융권 시나리오
date: 2026-10-14
desc: "2026년 금융권 연쇄 침해사고를 바탕으로 신용대출 비교 서비스의 공개 자산을 ASM 관점에서 조사하고 BOLA 중심의 모의침투 시나리오와 대응 방안을 정리"
keywords: "모의침투, 금융보안, ASM, Attack Surface Management, BOLA, 객체 수준 인가, 공격 벡터, 침해사고, 신용대출 비교, 프론티어"
categories: [TechnicalDocument]
tags: [프론티어, 모의침투, 금융보안, ASM]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/72](https://sanghole.tistory.com/72)

<h2 data-ke-size="size26">1. 대상 회사 선정 및 기본 정보 조사</h2>
<h3 data-ke-size="size23">1.1 시나리오 선정 배경</h3>
<p data-ke-size="size16">2026년 금융권 연쇄 침해사고에서 공격 대상은 반드시 핵심 금융거래시스템에 국한되지 않았다. 신한은행에서는 대출모집인용 모바일 조회 서비스, KB국민은행에서는 직원용 모바일 업무지원시스템, 하나은행에서는 영업지원시스템(ODS)이 문제의 접점으로 보도되었다.</p>
<p data-ke-size="size16">또한 엔키화이트햇의 『2026 금융권 연쇄 침해사고 분석과 대응방안』 10쪽에서는 하나의 조회 서비스에서 확보한 고객 식별정보를 다른 간편조회 서비스에 연계하여 추가 정보를 획득하는 공격 유형을 분석한 것을 확인하였다.</p>
<p data-ke-size="size16">그래서 이번 모의침투 시나리오는 대출조회 서비스 인증, 인가 문제, 직원용 업무지원 시스템 공격 문제, 영업지원 시스템 침해 문제에 집중하였다.</p>
<p data-ke-size="size16">카카오뱅크를 고른 것은 아직 피해 사고가 없는 타겟을 정한 것 이다.</p>
<h3 data-ke-size="size23">1.2 신용대출 비교 서비스를 선정한 이유</h3>
<p data-ke-size="size16">앞서 살펴본 2026년 금융권 연쇄 침해사고에서는 핵심 금융거래시스템뿐 아니라 대출모집인용 조회 서비스, 직원용 업무지원시스템, 영업지원시스템과 같은 주변 업무 시스템이 공격 대상이 되었다.</p>
<p data-ke-size="size16">특히 신한은행 사고에서는 대출모집인용 모바일 홈페이지의 본인확인 절차를 우회하여 고객정보에 접근하고, 한 조회 기능에서 확보한 고객 식별정보를 다른 조회 기능에 활용해 추가 정보를 획득한 것으로 보도되었다.</p>
<p data-ke-size="size16">이러한 사고를 바탕으로, 카카오뱅크는 비슷한 기능이 없는지 확인했다.</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th><b>신용대출 비교하기</b></th>
<th>신한은행 대출조회 서비스 인증·인가 문제</th>
<th>여러 금융사의 대출 한도·금리 조회 과정에서 고객별 정보 접근권한과 제휴기관 간 정보 제공 범위를 분석할 수 있음</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>신용대출 갈아타기</b></td>
<td>대출정보 조회 및 업무 기능 간 권한 검증</td>
<td>기존 대출의 잔액·금리·상환 가능 여부를 조회하고 대출 변경을 신청하는 과정의 접근권한을 검토할 수 있음</td>
</tr>
<tr>
<td><b>주택담보대출 비교하기</b></td>
<td>금융정보 조회 및 외부 금융기관 연계</td>
<td>소득, 부채, 담보 관련 정보를 이용한 금융기관별 한도·금리 비교 과정의 접근통제를 분석할 수 있음</td>
</tr>
<tr>
<td><b>내 신용정보</b></td>
<td>고객 식별정보를 활용한 개인정보 조회</td>
<td>신용점수, 카드 이용금액, 남은 대출원금 등 고객별 금융정보의 열람권한을 검토할 수 있음</td>
</tr>
<tr>
<td><b>대출 관련 상담·위탁 업무</b></td>
<td>국민은행·하나은행의 업무지원시스템 침해</td>
<td>상담 담당자의 고객정보 접근 범위와 외부 수탁업체의 업무별 권한 관리를 분석할 수 있음</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이러한 후보들 중 신용대출 비교하기를 분석 대상으로 선정하였는데, 이유는 세 가지 정도..?</p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>실제 금융권 침해사고와 유사한 정보조회 기능을 제공한다</li>
<li>여러 금융기관이 참여한느 서비스이므로 정보 접근 경계를 분석할 수 있다.</li>
<li>실제 시스템을 공격하지 않고도 취약점 가설을 도출할 수 있다.
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>조금 더 설명을 해보자면, 공식 상품 안내를 통해 고객별 대출조건 조회 기능이 존재한다는 사실은 확인할 수 있다. 이를 조금 더 시나리오에 맞게 가공하면 정상 이용자는 자신의 조회 결과만 확인할 수 있어야 한다는 접근통제 요구사항을 설정할 수 있다. 그러면.. 가상의 대출조회 시스템에서 로그인 여부만 검증하고 조회 결과와 요청자의 소유권 관계를 확인하지 않는다면, 다른 고객의 금융조건이 노출될 수 있다는 시나리오를 구성할 수 있다.</li>
</ul>
</li>
</ol>
<h2 data-ke-size="size26">2. 홈페이지 및 공개 자산 조사</h2>
<h3 data-ke-size="size23">2.1 공개적으로 확인한 서비스</h3>
<p data-ke-size="size16">공개적으로 확인한 서비스를 확인하기 위해서 실제 페이지에 들어가서 어떤 서비스들이 있는지 확인했으며(<a href="https://www.kakaobank.com/view/service">https://www.kakaobank.com/view/service</a>)</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="755" data-origin-width="926"><span data-phocus="https://blog.kakaocdn.net/dna/814g2/dJMcabst9iU/AAAAAAAAAAAAAAAAAAAAANqpWxcOyhCUuasiYhlJLY0TtxTe77t2jAE1qIUH_mVV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=uOtknIkaZmdqoQygOHjE96c%2Fm%2BY%3D" data-url="https://blog.kakaocdn.net/dna/814g2/dJMcabst9iU/AAAAAAAAAAAAAAAAAAAAANqpWxcOyhCUuasiYhlJLY0TtxTe77t2jAE1qIUH_mVV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=uOtknIkaZmdqoQygOHjE96c%2Fm%2BY%3D"><img data-origin-height="755" data-origin-width="926" height="755" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/814g2/dJMcabst9iU/AAAAAAAAAAAAAAAAAAAAANqpWxcOyhCUuasiYhlJLY0TtxTe77t2jAE1qIUH_mVV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=uOtknIkaZmdqoQygOHjE96c%2Fm%2BY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F814g2%2FdJMcabst9iU%2FAAAAAAAAAAAAAAAAAAAAANqpWxcOyhCUuasiYhlJLY0TtxTe77t2jAE1qIUH_mVV%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DuOtknIkaZmdqoQygOHjE96c%252Fm%252BY%253D" width="926"/></span></figure>
</p>
<p data-ke-size="size16">실제로 시나리오로 골랐던 신용대출 비교하기가 있는 것을 확인한다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="440" data-origin-width="880"><span data-phocus="https://blog.kakaocdn.net/dna/cfM0xO/dJMcaa8k11p/AAAAAAAAAAAAAAAAAAAAADaIGb1EqHwSxDVGSKyDWSZQUib7Yweg5ujp1KZ3DW5m/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=fqAu3VauRlDbmVp3lX1az1XSqzE%3D" data-url="https://blog.kakaocdn.net/dna/cfM0xO/dJMcaa8k11p/AAAAAAAAAAAAAAAAAAAAADaIGb1EqHwSxDVGSKyDWSZQUib7Yweg5ujp1KZ3DW5m/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=fqAu3VauRlDbmVp3lX1az1XSqzE%3D"><img data-origin-height="440" data-origin-width="880" height="440" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cfM0xO/dJMcaa8k11p/AAAAAAAAAAAAAAAAAAAAADaIGb1EqHwSxDVGSKyDWSZQUib7Yweg5ujp1KZ3DW5m/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=fqAu3VauRlDbmVp3lX1az1XSqzE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcfM0xO%2FdJMcaa8k11p%2FAAAAAAAAAAAAAAAAAAAAADaIGb1EqHwSxDVGSKyDWSZQUib7Yweg5ujp1KZ3DW5m%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DfqAu3VauRlDbmVp3lX1az1XSqzE%253D" width="880"/></span></figure>
</p>
<h4 data-ke-size="size20">2.2.1 공식 페이지에서 확인한 서비스 기능</h4>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>서비스명</th>
<th>신용대출 비교하기</th>
</tr>
</thead>
<tbody>
<tr>
<td>서비스 제공자</td>
<td>카카오뱅크</td>
</tr>
<tr>
<td>서비스 종류</td>
<td>금융상품판매대리·중개 서비스</td>
</tr>
<tr>
<td>비교 대상</td>
<td>카카오뱅크 및 제휴사의 신용대출·정책금융상품</td>
</tr>
<tr>
<td>제공 결과</td>
<td>금융기관별 가심사 대출 한도·금리</td>
</tr>
<tr>
<td>조회 방식</td>
<td>여러 금융사의 대출조건을 한 번에 비교</td>
</tr>
<tr>
<td>서류 제출</td>
<td>비교 과정에서 복잡한 서류 제출 없이 이용할 수 있다고 안내</td>
</tr>
<tr>
<td>신용정보 조회</td>
<td>여러 금융사를 비교하더라도 신용정보 조회는 한 번 수행한다고 안내</td>
</tr>
<tr>
<td>금융기관 제공 제외 항목</td>
<td>대출 심사 시 휴대전화번호와 주소</td>
</tr>
<tr>
<td>대출 심사 주체</td>
<td>해당 제휴 금융회사</td>
</tr>
<tr>
<td>대출계약 체결 주체</td>
<td>이용자와 해당 제휴 금융회사</td>
</tr>
</tbody>
</table>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="146" data-origin-width="720"><span data-phocus="https://blog.kakaocdn.net/dna/deytBy/dJMcabeNH2e/AAAAAAAAAAAAAAAAAAAAADmk2tPhZO1iIQ1a-dVxLC5j4Q9pFf9X8x-grrSwIydq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=%2F3sJRAab3b8SCgt2OjKu0SyOJs0%3D" data-url="https://blog.kakaocdn.net/dna/deytBy/dJMcabeNH2e/AAAAAAAAAAAAAAAAAAAAADmk2tPhZO1iIQ1a-dVxLC5j4Q9pFf9X8x-grrSwIydq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=%2F3sJRAab3b8SCgt2OjKu0SyOJs0%3D"><img data-origin-height="146" data-origin-width="720" height="146" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/deytBy/dJMcabeNH2e/AAAAAAAAAAAAAAAAAAAAADmk2tPhZO1iIQ1a-dVxLC5j4Q9pFf9X8x-grrSwIydq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=%2F3sJRAab3b8SCgt2OjKu0SyOJs0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdeytBy%2FdJMcabeNH2e%2FAAAAAAAAAAAAAAAAAAAAADmk2tPhZO1iIQ1a-dVxLC5j4Q9pFf9X8x-grrSwIydq%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D%252F3sJRAab3b8SCgt2OjKu0SyOJs0%253D" width="720"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">해당 페이지에서 제휴 금융사가 이용자의 심사정보 또는 입력정보를 바탕으로 가심사한 결과를 제공한다고 명시되어 있다. 이 서비스 자체는 조회한 한도와 금리는 확정적인 대출 조건이 아니며 실제 대출 신청 시 확인되는 소득, 재직정보, 금융사의 심사 기준 등에 따라 달라질 수 있다는 것.</p>
<h4 data-ke-size="size20">2.2.2 운영시간 및 조회 결과 유효기간</h4>
<p data-ke-size="size16">공식 자료에서 나오는 자주 묻는 질문에서 정확한 시간 정보를 확인할 수 있다. 시나리오에서 만약 가상 서비스에서 조회 결과가 만료된 이후에도 접근 간으한지 확인하는 유효 기간 관련 접근통제 요구사항도 도출할 수 있다(예시)</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="145" data-origin-width="640"><span data-phocus="https://blog.kakaocdn.net/dna/bejLqI/dJMcaiyuFVs/AAAAAAAAAAAAAAAAAAAAADQDkhml28KCxVKwt4AFpqOSZ2eIVq4XjgkeI5uQyYED/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=B%2BeL3JsFxnH3SRD7Z3aWXWkAkuU%3D" data-url="https://blog.kakaocdn.net/dna/bejLqI/dJMcaiyuFVs/AAAAAAAAAAAAAAAAAAAAADQDkhml28KCxVKwt4AFpqOSZ2eIVq4XjgkeI5uQyYED/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=B%2BeL3JsFxnH3SRD7Z3aWXWkAkuU%3D"><img data-origin-height="145" data-origin-width="640" height="145" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bejLqI/dJMcaiyuFVs/AAAAAAAAAAAAAAAAAAAAADQDkhml28KCxVKwt4AFpqOSZ2eIVq4XjgkeI5uQyYED/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=B%2BeL3JsFxnH3SRD7Z3aWXWkAkuU%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbejLqI%2FdJMcaiyuFVs%2FAAAAAAAAAAAAAAAAAAAAADQDkhml28KCxVKwt4AFpqOSZ2eIVq4XjgkeI5uQyYED%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DB%252BeL3JsFxnH3SRD7Z3aWXWkAkuU%253D" width="640"/></span></figure>
</p>
<h4 data-ke-size="size20">2.2.3 입점 제휴사 전체 현황</h4>
<p data-ke-size="size16">72개의 제휴사이며 아래와 같이 구분할 수 있다.</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>은행 (10)</th>
<th>카카오뱅크, iM뱅크, 하나은행, 케이뱅크, SC제일은행, 부산은행, 전북은행, 제주은행, 광주은행, 경남은행</th>
</tr>
</thead>
<tbody>
<tr>
<td>저축은행 (31)</td>
<td>애큐온, BNK, DB, 다올, 동원제일, 고려, 한화, 하나, IBK, 진주, JT친애, JT, KB, 키움, 키움예스, 모아, NH, OK, OSB, 페퍼, SBI, 스마트, 상상인플러스, 세람, 신한, 상상인, 한국투자, 웰컴, 우리금융, 융창, 예가람저축은행</td>
</tr>
<tr>
<td>캐피탈 (12)</td>
<td>우리금융, BNK, iM, 현대, 한국, 하나, KB, 롯데, NH농협, OK, 한국투자, JB우리캐피탈</td>
</tr>
<tr>
<td>카드 (6)</td>
<td>BC카드, 현대카드, 하나카드, KB국민카드, 신한카드, 우리카드</td>
</tr>
<tr>
<td>기타 업체 (6)</td>
<td>비플러스, 에잇퍼센트, 어니스트AI(어니스트펀드), 머니무브, 피에프씨테크놀로지스, 윙크스톤</td>
</tr>
<tr>
<td>보험 (7)</td>
<td>푸본현대생명, 한화생명, 흥국화재, 흥국생명, 교보생명, 삼성화재, 삼성생명</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">앞서 이야기했던 금융권 연쇄 침해사고와의 연결을 한 다면, 하나은행, 부산은행, 예가람저축은행, 웰컴저축은행, 현대 캐피탈 등이 있다.</p>
<h4 data-ke-size="size20">2.2.4 개인정보와 신용정보 처리 관계</h4>
<p data-ke-size="size16">이용자는, 카카오뱅크 대출비교 서비스에게 제휴상품 비교와 중개, 가심사 결과를 제공해달라고 하며 제휴 금융회사는 심사정보와 입력정보를 바탕으로 가심사, 대출상품을 제공한다. 그 후 이용자에게 한도와 금리 비교 결과를 제공한다.</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>항목</th>
<th>확인 결과</th>
</tr>
</thead>
<tbody>
<tr>
<td>신용정보 조회</td>
<td>여러 금융사를 비교할 때 한 번 수행한다고 안내</td>
</tr>
<tr>
<td>심사정보·입력정보</td>
<td>금융회사의 가심사 결과 산정에 활용</td>
</tr>
<tr>
<td>휴대전화번호</td>
<td>대출 심사 시 제휴 금융사에 제공하지 않는다고 명시</td>
</tr>
<tr>
<td>주소</td>
<td>대출 심사 시 제휴 금융사에 제공하지 않는다고 명시</td>
</tr>
<tr>
<td>대출 한도·금리</td>
<td>제휴사가 산정한 가심사 결과</td>
</tr>
<tr>
<td>이용자가 제공한 개인(신용)정보</td>
<td>제휴 금융회사가 보유·관리한다고 안내</td>
</tr>
<tr>
<td>계약 관련 정보</td>
<td>실제 계약과 관련된 자료는 제휴사에 요청하도록 안내</td>
</tr>
</tbody>
</table>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="554" data-origin-width="556"><span data-phocus="https://blog.kakaocdn.net/dna/bY6BUR/dJMcagUUdqy/AAAAAAAAAAAAAAAAAAAAAIxbHy9j-u9YKRCqIaA7cuTTYHwtb3WStJrjf7qntnb2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=MofKx7JMcu2iDWJA43bTatKhuo8%3D" data-url="https://blog.kakaocdn.net/dna/bY6BUR/dJMcagUUdqy/AAAAAAAAAAAAAAAAAAAAAIxbHy9j-u9YKRCqIaA7cuTTYHwtb3WStJrjf7qntnb2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=MofKx7JMcu2iDWJA43bTatKhuo8%3D"><img data-origin-height="554" data-origin-width="556" height="339" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bY6BUR/dJMcagUUdqy/AAAAAAAAAAAAAAAAAAAAAIxbHy9j-u9YKRCqIaA7cuTTYHwtb3WStJrjf7qntnb2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=MofKx7JMcu2iDWJA43bTatKhuo8%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbY6BUR%2FdJMcagUUdqy%2FAAAAAAAAAAAAAAAAAAAAAIxbHy9j-u9YKRCqIaA7cuTTYHwtb3WStJrjf7qntnb2%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DMofKx7JMcu2iDWJA43bTatKhuo8%253D" width="340"/></span></figure>
</p>
<p data-ke-size="size16">일단은 휴대폰번호와 주소를 금융사에 제공하지 않는다고 하니, 시나리오에서 설명하는 범위는 대출 심사 시 제휴 금융사로의 제공이다. 하지만.. 금융회사 내부의 모든 개인정보 처리에서 이 항목들을 사용하지 않는다고는 할 수 없다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">2.2.5 기타 안내사항에서 확인한 서비스 책임과 제약</h4>
<p data-ke-size="size16">페이지 하단의 유의사항을 확인했는데, 여기에는 비교적 중요한 설명이 많이 있다.</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>확인 내용</th>
<th>공식 안내의 의미</th>
</tr>
</thead>
<tbody>
<tr>
<td>비교 결과의 성격</td>
<td>금융회사가 가심사한 결과이며 실제 계약조건과 다를 수 있음</td>
</tr>
<tr>
<td>비교 대상 범위</td>
<td>제휴계약이 체결된 일부 금융상품으로 제한</td>
</tr>
<tr>
<td>최적 상품 보장 여부</td>
<td>모든 금융사의 상품을 비교하거나 최적 상품을 보장하지 않음</td>
</tr>
<tr>
<td>본심사와 대출 실행</td>
<td>제휴 금융회사의 책임</td>
</tr>
<tr>
<td>계약 전 절차</td>
<td>제휴사 약관 동의 및 본인확인 등 해당 제휴사가 요청하는 절차 필요</td>
</tr>
<tr>
<td>이용자 수수료</td>
<td>카카오뱅크는 대출계약·실행을 이유로 이용자에게 금전적 대가를 받지 않음</td>
</tr>
<tr>
<td>제휴사 수수료</td>
<td>업무위탁계약에 따라 제휴사로부터 수수료를 받을 수 있음</td>
</tr>
<tr>
<td>대출 원리금 수취</td>
<td>카카오뱅크는 제휴 금융사를 대신해 대출원금과 이자를 수취하지 않음</td>
</tr>
<tr>
<td>자료열람 요구</td>
<td>관련 요건에 따라 요구할 수 있으며 원칙적으로 6영업일 이내 제공, 법정 제한·거절 사유 존재</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">또한 신용정보 관련 유의사항에서 다음 차이를 명시하고 있다.</p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>비교를 위한 신용정보 조회 자체는 신용점수에 영향을 주지 않는다</li>
<li>실제 대출 신청 시 조회 이력이 신용정보회사에 제공될 수 있으며, 금융기관의 대출 심사에 영향을 줄 수 있다.</li>
<li>대출 실행 이부 부채 및 신용상태에 따라 신용점수가 하락할 수 있다고 안내한다.</li>
</ul>
<h4 data-ke-size="size20">2.2.6 연결된 다른 공개 서비스</h4>
<p data-ke-size="size16"> </p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>연결 서비스</th>
<th>연결 목적</th>
<th>조사 시 주의점</th>
</tr>
</thead>
<tbody>
<tr>
<td>비상금대출</td>
<td>카카오뱅크 자체 대출상품 조회</td>
<td>신용대출 비교 서비스와 구분</td>
</tr>
<tr>
<td>마이너스통장대출</td>
<td>자체 대출상품 조회</td>
<td>별도 상품·신청 조건 적용</td>
</tr>
<tr>
<td>신용대출</td>
<td>자체 신용대출상품 안내</td>
<td>제휴 비교 결과와 별도</td>
</tr>
<tr>
<td>신용대출 갈아타기</td>
<td>기존 대출의 대환 관련 서비스</td>
<td>신청·상환 업무를 비교 기능과 혼동하지 않음</td>
</tr>
<tr>
<td>내 신용정보</td>
<td>신용정보 조회와 관련된 서비스</td>
<td>대출비교와의 실제 내부 데이터 연계는 미확인</td>
</tr>
</tbody>
</table>
<h4 data-ke-size="size20"> </h4>
<h4 data-ke-size="size20">2.2.7 ASM 관점에서 확인되지 않는 부분</h4>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>서비스 기능 및 제휴사</th>
<th>공식 페이지에서 확인</th>
</tr>
</thead>
<tbody>
<tr>
<td>고객·카카오뱅크·제휴사의 업무 관계</td>
<td>공식 안내사항에서 확인</td>
</tr>
<tr>
<td>신용정보 조회 횟수에 대한 안내</td>
<td>확인</td>
</tr>
<tr>
<td>조회 결과의 유효기간</td>
<td>확인</td>
</tr>
<tr>
<td>실제 로그인·본인확인 절차</td>
<td>미확인</td>
</tr>
<tr>
<td>앱에서 실제로 입력하는 정보 항목 전체</td>
<td>미확인</td>
</tr>
<tr>
<td>개인정보 제3자 제공 동의서의 정확한 항목별 내용</td>
<td>미확인</td>
</tr>
<tr>
<td>실제 API 엔드포인트·요청 파라미터</td>
<td>미확인</td>
</tr>
<tr>
<td>결과 식별값·인증 토큰의 구조</td>
<td>미확인</td>
</tr>
<tr>
<td>서버 측 객체 소유권 검증</td>
<td>미확인</td>
</tr>
<tr>
<td>제휴사별 통신 방식 및 연동 시스템</td>
<td>미확인</td>
</tr>
<tr>
<td>침입탐지, API 요청 제한, WAF 정책</td>
<td>미확인</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">시나리오이기 때문에 최대한 확인한 부분에서 작성할 예정이며 미확인된 부분에서는 예측을 하여 시나리오를 작성할 예정이다.</p>
<p data-ke-size="size16">2.2, 즉 해당 타겟을 분석하는 양이 많은데 그 이유는 시나리오를 작성하기 위해서는 해당 타겟에 대한 분석을 해야 실제로 어떤 서비스를 운영하고 있고, 어떻게 운영하는지를 알아야 좋은 시나리오가 나온다고 생각했기 때문이다.</p>
<h2 data-ke-size="size26">3. 예상 공격 벡터 도출</h2>
<h3 data-ke-size="size23">3.1 공격 표면 분석</h3>
<p data-ke-size="size16">앞서 카카오뱅크 신용대출 비교하기의 공개 자산과 서비스 기능을 조사하였다. 해당 서비스는 이용자가 여러 금융회사의 대출조건을 비교할 수 있도록 하며, 금융기관이 이용자의 심사정보 또는 입력정보를 바탕으로 가심사한 한도와 금리 정보를 제공한다.</p>
<p data-ke-size="size16"> </p>
<blockquote data-ke-style="style2">
<p data-ke-size="size16">금융권 연쇄 침해사고에서 확인된 주요 특징 중 하나는 이러한 금융정보 조회 기능이 공격 접점으로 활용되었다는 점이다.</p>
</blockquote>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">신한은행 침해사고의 경우 대출모집인용 조회 서비스에서 본인확인 절차가 우회되었으며, 엔키화이트햇 보고서에서는 하나의 조회 기능에서 확보한 고객 식별정보를 다른 조회 기능에 활용하여 추가 정보를 획득하는 유형을 분석하였다.따라서 이번 시나리오에서는 카카오뱅크 신용대출 비교 서비스에서 발생할 수 있는 접근통제 문제를 중심으로 공격 벡터를 도출하였다.</p>
<p data-ke-size="size16">우선 공개된 서비스 기능을 기준으로 보호가 필요한 대상을 정리하면..</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>보호 대상</th>
<th>공식 자료에서 확인한 기능</th>
<th>보안 관점의 검토 사항</th>
</tr>
</thead>
<tbody>
<tr>
<td>이용자별 대출비교 결과</td>
<td>고객별 대출 한도와 금리 제공</td>
<td>다른 이용자의 결과에 대한 접근 제한</td>
</tr>
<tr>
<td>신용정보 조회 기능</td>
<td>여러 금융사를 비교할 때 신용정보 조회 한 번 수행</td>
<td>조회 주체와 정보 처리 동의의 적절성</td>
</tr>
<tr>
<td>금융기관별 가심사 결과</td>
<td>제휴 금융회사가 가심사 결과 산정</td>
<td>금융기관 및 고객별 정보 구분</td>
</tr>
<tr>
<td>결과 유효기간</td>
<td>조회 당일 23시 30분까지 유효</td>
<td>만료된 결과의 업무상 재사용 제한</td>
</tr>
<tr>
<td>제휴기관 정보 처리</td>
<td>여러 금융기관의 대출조건 비교</td>
<td>제공 목적과 기관별 정보 범위 제한</td>
</tr>
<tr>
<td>관련 금융조회 기능</td>
<td>신용대출 갈아타기, 내 신용정보 등 별도 서비스 존재</td>
<td>서로 다른 기능의 접근권한을 독립적으로 검증할 필요성</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이 가운데 가장 중요하게 본 것은 <b>대출비교 결과와 이용자 사이의 접근권한 관계</b>이다. 대출비교 결과는 이용자의 심사정보 또는 입력정보를 바탕으로 산정되는 금융조건이므로, 정상적인 이용자는 본인에게 제공된 결과만 조회할 수 있어야 한다.</p>
<p data-ke-size="size16">이러한 요구사항을 바탕으로 예상 공격 벡터를 도출하였다.</p>
<h3 data-ke-size="size23">3.2 공격자 및 분석 대상 설정</h3>
<p data-ke-size="size16">지금 시나리오는 정상적인 이용자 계정을 보유한 외부 사용자가, 본인에게 허용된 조회 기능을 넘어 다른 이용자의 금융정보에 접근할 수 있는 상황을 가정한다.</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>구분</th>
<th>가상 시나리오 설정</th>
</tr>
</thead>
<tbody>
<tr>
<td>공격자</td>
<td>정상 계정을 보유한 외부 이용자 A</td>
</tr>
<tr>
<td>피해 대상</td>
<td>다른 이용자 B</td>
</tr>
<tr>
<td>분석 서비스</td>
<td>신용대출 비교하기</td>
</tr>
<tr>
<td>초기 권한</td>
<td>이용자 A 본인의 금융조건 조회</td>
</tr>
<tr>
<td>보호 대상</td>
<td>이용자별 대출 한도·금리 비교 결과</td>
</tr>
<tr>
<td>예상 취약점</td>
<td>조회 결과와 요청자 사이의 소유권 검증 누락</td>
</tr>
<tr>
<td>공격 목표</td>
<td>권한이 없는 이용자 B의 대출비교 결과 열람</td>
</tr>
<tr>
<td>추가 확대 조건</td>
<td>다른 조회 기능에서도 독립적인 권한 검증이 실패하는 경우</td>
</tr>
</tbody>
</table>
<h3 data-ke-size="size23">3.3 예상 공격 벡터 1 — 객체 수준 인가 실패(BOLA)</h3>
<p data-ke-size="size16">첫 번째이자 핵심적인 공격 벡터는 Broken Object Level Authorization이다. OWASP API Security Top 10 2023에서는 객체 수준의 접근권한을 검증하지 않아 다른 이용자의 데이터에 접근할 수 있는 문제를 API1:2023 Broken Object Level Authorization으로 분류하고 있다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="112" data-origin-width="913"><span data-phocus="https://blog.kakaocdn.net/dna/mIFyt/dJMcaggewCN/AAAAAAAAAAAAAAAAAAAAAEZj-mIthT-pSmerq5cI5rXpT3mvhGNgQaVUPJbtmsnh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=vP4LPyUkAoXpKUHLvhcat%2FXREqk%3D" data-url="https://blog.kakaocdn.net/dna/mIFyt/dJMcaggewCN/AAAAAAAAAAAAAAAAAAAAAEZj-mIthT-pSmerq5cI5rXpT3mvhGNgQaVUPJbtmsnh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=vP4LPyUkAoXpKUHLvhcat%2FXREqk%3D"><img data-origin-height="112" data-origin-width="913" height="112" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/mIFyt/dJMcaggewCN/AAAAAAAAAAAAAAAAAAAAAEZj-mIthT-pSmerq5cI5rXpT3mvhGNgQaVUPJbtmsnh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=vP4LPyUkAoXpKUHLvhcat%2FXREqk%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FmIFyt%2FdJMcaggewCN%2FAAAAAAAAAAAAAAAAAAAAAEZj-mIthT-pSmerq5cI5rXpT3mvhGNgQaVUPJbtmsnh%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DvP4LPyUkAoXpKUHLvhcat%252FXREqk%253D" width="913"/></span></figure>
</p>
<p data-ke-size="size16">일반적으로 객체란 API가 처리하는 특정 데이터 단위를 의미한다. 이번 가상 모델에서는 이용자별 대출비교 결과 하나를 객체로 정의하였다.</p>
<p data-ke-size="size16">자 이제 예시를 하나 들어보자</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>이용자 데이터</th>
<th>데이터 객체</th>
<th>정상적인 접근권한</th>
</tr>
</thead>
<tbody>
<tr>
<td>A</td>
<td>A의 대출비교 결과</td>
<td>접근 가능</td>
</tr>
<tr>
<td>A</td>
<td>B의 대출비교 결과</td>
<td>접근 불가</td>
</tr>
<tr>
<td>B</td>
<td>A의 대출비교 결과</td>
<td>접근 불가</td>
</tr>
<tr>
<td>B</td>
<td>B의 대출비교 결과</td>
<td>접근 가능</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">정상적인 시스템이라면 이용자 A가 자신의 대출비교 결과를 조회할 때 해당 요청을 허용하지만, 이용자 B의 결과에 접근하려는 경우 서버에서 요청을 거부해야 한다.</p>
<blockquote data-ke-style="style2">
<p data-ke-size="size16">그러나 가상의 대출조회 시스템에서 다음과 같은 문제가 존재한다고 가정해 보았다.</p>
</blockquote>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">서버가 이용자의 로그인 상태만 확인하고, 요청한 대출비교 결과가 실제로 해당 이용자에게 속하는 데이터인지 검증하지 않는 경우이다. 이러한 조건이 성립하면 정상적으로 인증된 이용자라도 다른 이용자의 금융정보에 접근할 가능성이 발생한다.</p>
<p data-ke-size="size16">다만 현재 공개자료에서는 실제 카카오뱅크의 대출비교 결과가 어떤 식별값을 사용하며, 외부 요청에서 조회 대상을 지정할 수 있는지 확인되지 않았기 때문에. 이번 분석에서는 가상의 결과 조회 기능이 외부에서 지정된 결과 객체를 처리할 수 있다는 조건을 추가로 가정한다..</p>
<p data-ke-size="size16">실제로 카카오뱅크 API에서 동일한 동작이 가능하다는 의미는 아니다!!!</p>
<h3 data-ke-size="size23">3.4 예상 공격 벡터 2 — 조회 기능 간 권한 검증 실패</h3>
<p data-ke-size="size16">두 번째 공격 벡터는 서로 다른 금융정보 조회 기능 사이에서 접근권한 검증이 충분하지 않은 경우이다. 엔키화이트햇의 금융권 침해사고 분석 보고서에서는 하나의 정보조회 기능에서 확보한 고객 식별정보를 다른 간편조회 기능에 활용하여 추가 정보를 획득하는 공격 유형을 설명하였다.</p>
<p data-ke-size="size16">이는 단일 기능의 취약점뿐 아니라 <b>기능 간 연결 관계에서의 접근권한 검증</b>도 중요하다는 것을 보여주며 실제로 카카오뱅크 공식 홈페이지에서도 신용대출 비교하기 외에 신용대출 갈아타기, 내 신용정보 등 서로 다른 금융정보 관련 서비스를 확인할 수 있다.</p>
<p data-ke-size="size16">하지만 실제로 동일한 DB, API 등을 사용하는지는 공개되어 있지 않기 때문에 조건부 상황을 두고 검토한다.</p>
<p data-ke-size="size16"> </p>
<blockquote data-ke-style="style2">
<p data-ke-size="size16">가상의 금융조회 시스템에서 한 기능의 조회 결과를 다른 기능에서 참조할 수 있고, 두 번째 기능에서도 별도의 접근권한 검증이 누락된다면 정보 노출 범위가 확대될 수 있다.</p>
</blockquote>
<h3 data-ke-size="size23"> </h3>
<h3 data-ke-size="size23">3.5 예상 공격 벡터 3 — 과도한 정보 반환</h3>
<p data-ke-size="size16">세 번째 공격 벡터는 필요한 범위를 초과하는 정보가 응답에 포함되는 경우이다. OWASP는 이러한 문제를 API3:2023 Broken Object Property Level Authorization과 관련된 취약 유형으로 분류한다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="86" data-origin-width="904"><span data-phocus="https://blog.kakaocdn.net/dna/HgFHh/dJMcadqitmf/AAAAAAAAAAAAAAAAAAAAAGVcXnJp5Xmfb4dWT77SnZl-8USvZyG3rKUq_S37H74L/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=1Mt%2BkN2sejRVJW%2BioZHeo6kYWWc%3D" data-url="https://blog.kakaocdn.net/dna/HgFHh/dJMcadqitmf/AAAAAAAAAAAAAAAAAAAAAGVcXnJp5Xmfb4dWT77SnZl-8USvZyG3rKUq_S37H74L/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=1Mt%2BkN2sejRVJW%2BioZHeo6kYWWc%3D"><img data-origin-height="86" data-origin-width="904" height="86" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/HgFHh/dJMcadqitmf/AAAAAAAAAAAAAAAAAAAAAGVcXnJp5Xmfb4dWT77SnZl-8USvZyG3rKUq_S37H74L/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=1Mt%2BkN2sejRVJW%2BioZHeo6kYWWc%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FHgFHh%2FdJMcadqitmf%2FAAAAAAAAAAAAAAAAAAAAAGVcXnJp5Xmfb4dWT77SnZl-8USvZyG3rKUq_S37H74L%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D1Mt%252BkN2sejRVJW%252BioZHeo6kYWWc%253D" width="904"/></span></figure>
</p>
<p data-ke-size="size16">객체 수준 인가 -&gt; 어떤 데이터 객체에 접근할 수 있는가</p>
<p data-ke-size="size16">객체 속성 수준 인가 -&gt; 허용된 객체에서 어떤 정보 항목까지 볼 수 있는가를 판단</p>
<p data-ke-size="size16">이해를 위한 예시</p>
<p data-ke-size="size16">예를 들어 가상의 대출비교 서비스에서 이용자에게 제공해야 하는 정보가 금융기관명, 대출 한도, 금리라고 가정할때 조회 결과에 내부 관리용 정보나 해당 화면에서 제공할 필요가 없는 개인정보까지 포함된다면 불필요한 정보 노출 위험이 발생할 수 있다.</p>
<p data-ke-size="size16">아 물론,, 카카오뱅크 공식 홈페이지는 대출 심사 시 휴대전화번호와 주소를 제휴 금융회사에 제공하지 않는다고 설명했으니까 과도한 정보 반환 문제는 <b>실제 응답 항목이 공개되지 않았기 때문에 추가적인 조건부로만..</b></p>
<h3 data-ke-size="size23"> </h3>
<h3 data-ke-size="size23">3.7 최종 공격 벡터 선정</h3>
<p data-ke-size="size16">지금까지 검토한 공격 벡터를 정리하면 다음과 같다.</p>
<p data-ke-size="size16">구분예상 공격 벡터발생 조건시나리오 적용</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>구분</th>
<th>예상 공격 벡터</th>
<th>조건 시나리오</th>
</tr>
</thead>
<tbody>
<tr>
<td>V1</td>
<td>객체 수준 인가 실패</td>
<td>조회 대상 결과와 이용자 간 권한 검증 누락</td>
</tr>
<tr>
<td>V2</td>
<td>기능 간 권한 검증 실패</td>
<td>서로 다른 조회 기능의 독립적인 권한 검증 누락</td>
</tr>
<tr>
<td>V3</td>
<td>과도한 정보 반환</td>
<td>업무상 불필요한 데이터 속성 반환</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">처음 생각했던 시나리오는 V1이기도 하고, 개인정보 유출에 대한 시나리오를 작성하고 싶기에, V1을 메인 공격 벡터로 선정하였다</p>
<h1>4. 예상 취약점 및 공격 시나리오 작성</h1>
<h2 data-ke-size="size26">4.1 시나리오 개요</h2>
<p data-ke-size="size16">3번에서 최종 공격 벡터로 선정한 V1, 즉 객체 수준 인가 실패(BOLA)를 바탕으로 시나리오를 작성하였다. 제목은 다음과 같다.</p>
<blockquote data-ke-style="style2">카카오뱅크 신용대출 비교 서비스에서 객체 수준 인가 검증 실패를 가정한 고객별 대출조건 정보 노출 시나리오</blockquote>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이번 시나리오에서 공격자 A는 정상적인 이용자 계정을 가지고 있으며, 본인에게 허용된 대출비교 기능을 이용할 수 있다. 하지만 가상의 조회 시스템에서 결과의 소유권을 확인하지 않는 문제가 발생한다면, 다른 이용자 B의 대출비교 결과까지 열람할 수 있는 상황을 가정하였다.</p>
<p data-ke-size="size16">실제 카카오뱅크 시스템에서 이런 취약점이 확인되었다는 뜻은 아니다. 공개자료에서 확인한 서비스 기능을 바탕으로, 접근통제가 실패했을 때 어떤 문제가 발생할 수 있는지 살펴보는 것이다.</p>
<h2 data-ke-size="size26">4.2 정상적인 서비스 이용 흐름</h2>
<p data-ke-size="size16">우선 신용대출 비교하기를 정상적으로 이용하는 과정을 간단히 정리하면 아래와 같다.</p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>이용자가 신용대출 비교하기 서비스를 선택한다.</li>
<li>이용자의 심사정보 또는 입력정보를 바탕으로 제휴 금융회사가 가심사를 진행한다.</li>
<li>금융회사별 대출 한도와 금리 등이 비교 결과로 제공되며, 이용자는 자신의 결과를 확인한다.</li>
<li>실제 대출을 신청한다면 해당 제휴 금융회사의 본심사 및 계약 절차를 별도로 진행한다.</li>
</ol>
<p data-ke-size="size16">이 과정에서 이번 시나리오가 주목하는 부분은 3번, 대출비교 결과를 열람하는 단계이다. 정상 이용자는 본인의 결과를 확인할 수 있어야 하지만, 다른 사람의 결과는 조회할 수 없어야 한다.</p>
<h2 data-ke-size="size26">4.3 가상 시스템 설정</h2>
<p data-ke-size="size16">이번 시나리오에서는 공격자 A의 대출비교 결과를 R(A), 다른 이용자 B의 결과를 R(B)로 표시하였다. 그리고 가상의 조회 기능이 각 결과를 참조값으로 구분하며, 외부 요청에서 조회 대상을 지정할 수 있다고 가정하였다.</p>
<h2 data-ke-size="size26">4.4 공격 시나리오</h2>
<p data-ke-size="size18"><b>STEP 1. 정상적인 대출비교 결과 조회</b></p>
<p data-ke-size="size16">공격자 A는 공식 홈페이지에서 신용대출 비교 서비스가 어떤 기능을 제공하는지 확인한 뒤, 본인의 정상 계정으로 서비스를 이용한다. 그리고 자신의 대출비교 결과 R(A)를 확인한다.</p>
<p data-ke-size="size16">이 단계까지는 일반 이용자와 다를 것이 없다. 공격자는 계정을 탈취하거나 인증 절차를 우회한 것이 아니라, 처음부터 본인에게 허용된 권한을 가지고 시작한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b>STEP 2. 다른 이용자의 결과를 참조하는 상황</b></p>
<p data-ke-size="size16">이제 가상의 조회 시스템에서 A가 본인의 결과가 아닌 R(B)를 조회 대상으로 지정할 수 있다고 가정해 보았다.</p>
<p data-ke-size="size16">예를 들어 이용자별 결과가 서로 다른 참조값으로 관리되고, 조회 기능이 외부 요청에서 받은 참조값을 처리하는 구조라면 A가 B의 결과를 요청하는 상황을 만들 수 있다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b>STEP 3. 객체 수준 인가 검증 실패</b></p>
<p data-ke-size="size16">여기서 서버가 확인해야 하는 것은 두 가지이다. 요청한 사람이 정상적으로 인증되었는지, 그리고 요청한 결과가 그 사람에게 허용된 데이터인지 확인해야 한다.</p>
<p data-ke-size="size16">그런데 가상의 시스템이 첫 번째 조건인 로그인 상태만 확인하고, 두 번째 조건인 결과의 소유권은 확인하지 않는다고 가정해 보자. 이 경우 A는 정상적으로 로그인했다는 이유로 R(B)에 대한 조회 요청까지 통과할 수 있다.</p>
<p data-ke-size="size16">3번에서 설명한 BOLA가 바로 이 지점에서 발생하는 것이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b>STEP 4. 이용자 B의 대출비교 결과 노출</b></p>
<p data-ke-size="size16">앞선 인가 검증이 실패하면 서버는 A에게 이용자 B의 대출비교 결과를 반환할 수 있다. </p>
<p data-ke-size="size16">여기서 중요한 부분은 공격자가 금융거래를 변경하지 않았다는 점이다. 단순히 조회 결과를 열람하는 기능에서도 다른 이용자의 금융조건이 노출된다면 기밀성 문제가 발생한다.</p>
<p data-ke-size="size16">반면 주민등록번호나 휴대전화번호까지 함께 노출된다고 설정하지는 않았다. 실제 결과 응답에 그러한 정보가 포함되는지는 공개자료로 확인하지 못했기 때문이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b>STEP 5. 다른 금융정보 조회 기능으로 확대되는 경우</b></p>
<p data-ke-size="size16">여기서 끝나지 않고 다른 금융정보 조회 기능에서도 문제가 발생할 수 있을까?</p>
<p data-ke-size="size16">카카오뱅크에는 신용대출 갈아타기, 내 신용정보와 같은 별도의 서비스가 존재한다. 만약 가상의 시스템에서 앞서 확보한 결과나 고객 관련 정보를 다른 조회 기능에서도 참조할 수 있고, 그 기능에서도 독립적인 인가 검증이 누락된다면 추가 정보 노출로 이어질 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b>STEP 6. 반복 조회와 탐지 지연</b></p>
<p data-ke-size="size16">객체별 인가 검증에 문제가 있는 상태에서 여러 이용자의 결과를 계속 참조할 수 있다면, 단건 정보 노출이 여러 건으로 확대될 가능성도 있다.</p>
<p data-ke-size="size16">여기에 비정상적인 조회를 탐지하거나 차단하는 통제까지 제대로 작동하지 않는다면 문제를 인지하는 시점이 늦어질 수 있다. 이번 시나리오는 정상 계정을 가진 A가 권한 없이 B의 비교 결과를 열람하는 것이 핵심이며, 이후의 정보 확대는 별도의 조건이 충족되어야만 성립한다..</p>
<h2 data-ke-size="size26">5. 예상 영향 범위 및 대응 방안</h2>
<h3 data-ke-size="size23">5.1 예상 영향 범위</h3>
<p data-ke-size="size16">앞선 시나리오가 성립한다면 가장 직접적인 피해는 고객별 대출비교 결과가 권한 없는 다른 이용자에게 제공되는 것이다. 특히 대출 한도와 금리는 고객의 금융조건에 해당하므로, 본인이 아닌 사람에게 결과가 전달되는 상황을 중요하게 보았다.</p>
<p data-ke-size="size16">이를 CIA 관점에서 정리하면 다음과 같다.</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th style="width: 143px;">보안 요소</th>
<th style="width: 517px;">예상 영향</th>
<th style="width: 135px;">판단</th>
</tr>
</thead>
<tbody>
<tr>
<td style="width: 143px;">기밀성</td>
<td style="width: 517px;">다른 이용자의 대출 한도·금리 등 비교 결과가 노출될 수 있음</td>
<td style="width: 135px;">핵심 위험</td>
</tr>
<tr>
<td style="width: 143px;">무결성</td>
<td style="width: 517px;">이번 시나리오에는 대출조건 수정이나 금융거래 변경이 포함되지 않음</td>
<td style="width: 135px;">직접적인 영향 없음</td>
</tr>
<tr>
<td style="width: 143px;">가용성</td>
<td style="width: 517px;">반복 조회가 시스템 자원에 영향을 줄 수는 있지만 실제 처리 용량은 확인되지 않음</td>
<td style="width: 135px;">판단 어려움</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">5.2 피해 범위가 확대되는 경우</h3>
<p data-ke-size="size16">최초의 B의 대출비교 결과가 노출되고 나서 불필요한 개인정보나 내부 관리정보까지 포함된다면 노출되는 정보 항목이 늘어날 수 있다. 다른 조회 기능에서도 별도의 인가 검증이 실패한다면 금융정보의 종류가 확대될 수 있다.  </p>
<h3 data-ke-size="size23">5.3 예방 대책</h3>
<p data-ke-size="size16">앞서 도출한 공격 벡터를 기준으로 어떤 부분을 우선적으로 보완해야 할지 정리해 보았다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b>① 서버 측 객체 수준 인가 검증</b></p>
<p data-ke-size="size16">가장 먼저 필요한 것은 결과 조회가 발생할 때마다 요청자와 조회 결과 사이의 접근권한을 서버에서 확인하는 것이다. A가 로그인에 성공했더라도 R(B)에 접근할 수 있는 것은 아니기 때문이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b>② 금융정보 조회 기능별 권한 검증</b></p>
<p data-ke-size="size16">신용대출 비교 결과를 다른 기능에서 사용하거나 관련 금융정보를 연계하는 구조가 존재한다면, 각 기능에서 접근권한을 다시 확인해야 한다. 한 기능에서 본인확인이 끝났다는 이유만으로 다른 기능의 고객정보까지 열람할 수 있도록 해서는 안 된다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b>③ 필요한 정보만 제공하고 제휴기관별 범위 구분</b></p>
<p data-ke-size="size16">대출비교 화면에서 필요한 항목이 금융기관명, 한도, 금리라면 해당 업무와 관계없는 내부 정보가 함께 반환되지 않도록 제한해야 한다. 객체에 접근할 수 있는지뿐 아니라 그 안의 어떤 항목까지 제공할 수 있는지도 검토해야 한다는 뜻이다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">5.4 침해사고가 발생했을 때의 대응</h4>
<p data-ke-size="size16">만약 가상의 서비스에서 실제로 다른 이용자의 대출비교 결과가 노출된 사실을 확인했다면, 다음과 같은 순서로 대응할 수 있을 것이다.</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>단계</th>
<th>대응 내용</th>
</tr>
</thead>
<tbody>
<tr>
<td>1. 사고 식별</td>
<td>어떤 조회 기능에서 비인가 접근이 발생했는지 확인</td>
</tr>
<tr>
<td>2. 추가 노출 차단</td>
<td>문제가 확인된 경로를 제한하고 비인가 결과 반환 방지</td>
</tr>
<tr>
<td>3. 증거 보존</td>
<td>인증·인가·정보조회 로그 등 분석에 필요한 자료 보존</td>
</tr>
<tr>
<td>4. 원인 및 영향 분석</td>
<td>소유권 검증 누락 여부와 노출된 항목·대상·기간 확인</td>
</tr>
<tr>
<td>5. 개선 및 재검증</td>
<td>접근통제 수정 후 같은 문제가 다른 조회 기능에도 있는지 점검</td>
</tr>
<tr>
<td>6. 후속 조치</td>
<td>탐지 규칙을 개선하고 필요한 신고·통지 의무 검토</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
