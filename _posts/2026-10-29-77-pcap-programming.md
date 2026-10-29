---
layout: post
title: pcap 프로그래밍
date: 2026-10-29
desc: "pcap 파일 구조(Global Header, Packet Record Header)를 뜯어보고 Python으로 Ethernet/IPv4/TCP/UDP/ICMP 헤더를 파싱해 프로토콜별 통계를 낸 뒤, AMOS Stealer 트래픽을 IOC와 비교 분석"
keywords: "pcap, pcap 프로그래밍, 패킷 분석, Global Header, Packet Record Header, Ethernet, IPv4, TCP, UDP, ICMP, Wireshark, Python, AMOS Stealer, IOC, DNS, 네트워크보안"
categories: [TechnicalDocument]
tags: [패킷분석, pcap, 네트워크보안, 악성코드분석]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/77](https://sanghole.tistory.com/77)

<p data-ke-size="size16"><a href="https://www.malware-traffic-analysis.net/2026/10/02/index.html" rel="noopener noreferrer" target="_blank">https://www.malware-traffic-analysis.net/2026/10/02/index.html</a></p>
<figure contenteditable="false" data-ke-align="alignCenter" data-ke-type="opengraph" data-og-description='2026-10-02 (FRIDAY): ATOMIC MACOS (AMOS) STEALER INFECTION FROM MALICIOUS AD IMPERSONATING CLAUDE CODE NOTICE: Zip files are password-protected.  Of note, this site has a new password scheme.  For the password, see the "about" page of this website. ASSOC' data-og-host="www.malware-traffic-analysis.net" data-og-image="" data-og-source-url="https://www.malware-traffic-analysis.net/2026/10/02/index.html" data-og-title="Malware-Traffic-Analysis.net - 2026-10-02: Atomic macOS (AMOS) Stealer infection from malicious ad impersonating Claude Code" data-og-type="website" data-og-url="https://www.malware-traffic-analysis.net/2026/10/02/index.html" id="og_1793250634090"><a data-source-url="https://www.malware-traffic-analysis.net/2026/10/02/index.html" href="https://www.malware-traffic-analysis.net/2026/10/02/index.html" rel="noopener" target="_blank">
<div class="og-image" style="background-image: url();"> </div>
<div class="og-text">
<p class="og-title" data-ke-size="size16">Malware-Traffic-Analysis.net - 2026-10-02: Atomic macOS (AMOS) Stealer infection from malicious ad impersonating Claude Code</p>
<p class="og-desc" data-ke-size="size16">2026-10-02 (FRIDAY): ATOMIC MACOS (AMOS) STEALER INFECTION FROM MALICIOUS AD IMPERSONATING CLAUDE CODE NOTICE: Zip files are password-protected.  Of note, this site has a new password scheme.  For the password, see the "about" page of this website. ASSOC</p>
<p class="og-host" data-ke-size="size16">www.malware-traffic-analysis.net</p>
</div>
</a></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">분석할 Pcap파일은 위에 있느 사이트에 있는 pcap파일이다.</p>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">pcap파일?</h2>
<p data-ke-size="size16">pcap파일은 네트워크에서 캡처한 패킷과 그 패킷의 시간, 길이 등의 정보를 저장하기 위한 바이러니 파일 형식이다.</p>
<p data-ke-size="size16">네트워크에서 발생하는 통신에는 IP 주소, 포트 번호, 프로토콜, 실제 전송 데이터 등이 포함된다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">PCAP파일을 통해 알 수 있는 것</p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>어떤 IP들과 통신을 했는가?</li>
<li>어떤 프로토콜이 사용되었는가?</li>
<li>어떤 포트로 연결이 발생했는가?</li>
</ol>
<p data-ke-size="size16">등등이 있다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">pcap Global Header 구조</h3>
<p data-ke-size="size16">Pcap파일은 단순히 패킷만 나열한 파일이 아니며 파일을 해석하기 위해서 메타데이터와 개별 패킷 데이터가 함께 저장된다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="485" data-origin-width="412"><span data-phocus="https://blog.kakaocdn.net/dna/cE0Zmt/dJMcag1G1Bt/AAAAAAAAAAAAAAAAAAAAAIPFck6U_5fKrvT8_UQ8sEBOIa4MIlbWhTnQXcOJXf1u/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=VmfnCGmrrWWhqylttafY0teAhhc%3D" data-url="https://blog.kakaocdn.net/dna/cE0Zmt/dJMcag1G1Bt/AAAAAAAAAAAAAAAAAAAAAIPFck6U_5fKrvT8_UQ8sEBOIa4MIlbWhTnQXcOJXf1u/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=VmfnCGmrrWWhqylttafY0teAhhc%3D"><img data-origin-height="485" data-origin-width="412" height="485" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cE0Zmt/dJMcag1G1Bt/AAAAAAAAAAAAAAAAAAAAAIPFck6U_5fKrvT8_UQ8sEBOIa4MIlbWhTnQXcOJXf1u/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=VmfnCGmrrWWhqylttafY0teAhhc%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcE0Zmt%2FdJMcag1G1Bt%2FAAAAAAAAAAAAAAAAAAAAAIPFck6U_5fKrvT8_UQ8sEBOIa4MIlbWhTnQXcOJXf1u%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DVmfnCGmrrWWhqylttafY0teAhhc%253D" width="412"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Pcap파일은 위 사진과 같이 세 가지 요소로 구성되는데,</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>Global </span><span>Header</span></span></td>
<td><span><span>24 </span><span>bytes</span></span></td>
<td><span><span>PCAP </span><span>파일의 </span><span>기본 </span><span>형식과 </span><span>캡처 </span><span>정보</span></span></td>
</tr>
<tr>
<td><span><span>Packet </span><span>Record </span><span>Header</span></span></td>
<td><span><span>16 </span><span>bytes</span></span></td>
<td><span><span>개별 </span><span>패킷의 </span><span>시간 </span><span>및 </span><span>길이 </span><span>정보</span></span></td>
</tr>
<tr>
<td><span><span>Packet </span><span>Data</span></span></td>
<td><span><span>가변 </span><span>길이</span></span></td>
<td><span><span>실제 </span><span>캡처된 </span><span>네트워크 </span><span>패킷</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Global Header는 파일 시작 부분에 한 번만 저장되고 나머지 record Header와 Packet Data가 반복된다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">Global Header의 세부 필드.</h4>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="354" data-origin-width="664"><span data-phocus="https://blog.kakaocdn.net/dna/bMLAGA/dJMcagHF4NQ/AAAAAAAAAAAAAAAAAAAAADpRsSg9E4uwed2c-9wJHNWqlqjy9NXPxtVsV8kbpwRg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=1rYvc52SoNLAc7Zy%2F0AHtVSq2Lo%3D" data-url="https://blog.kakaocdn.net/dna/bMLAGA/dJMcagHF4NQ/AAAAAAAAAAAAAAAAAAAAADpRsSg9E4uwed2c-9wJHNWqlqjy9NXPxtVsV8kbpwRg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=1rYvc52SoNLAc7Zy%2F0AHtVSq2Lo%3D"><img data-origin-height="354" data-origin-width="664" height="354" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bMLAGA/dJMcagHF4NQ/AAAAAAAAAAAAAAAAAAAAADpRsSg9E4uwed2c-9wJHNWqlqjy9NXPxtVsV8kbpwRg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=1rYvc52SoNLAc7Zy%2F0AHtVSq2Lo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbMLAGA%2FdJMcagHF4NQ%2FAAAAAAAAAAAAAAAAAAAAADpRsSg9E4uwed2c-9wJHNWqlqjy9NXPxtVsV8kbpwRg%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D1rYvc52SoNLAc7Zy%252F0AHtVSq2Lo%253D" width="664"/></span></figure>
</p>
<div>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>0~3</span></span></td>
<td><span><span>4B</span></span></td>
<td><span><span>Magic </span><span>Number</span></span></td>
<td><span><span>파일 </span><span>형식, </span><span>바이트 </span><span>순서, </span><span>시간 </span><span>정밀도</span></span></td>
</tr>
<tr>
<td><span><span>4~5</span></span></td>
<td><span><span>2B</span></span></td>
<td><span><span>Major </span><span>Version</span></span></td>
<td><span><span>주 </span><span>버전</span></span></td>
</tr>
<tr>
<td><span><span>6~7</span></span></td>
<td><span><span>2B</span></span></td>
<td><span><span>Minor </span><span>Version</span></span></td>
<td><span><span>부 </span><span>버전</span></span></td>
</tr>
<tr>
<td><span><span>8~11</span></span></td>
<td><span><span>4B</span></span></td>
<td><span><span>Reserved1</span></span></td>
<td><span><span>예약 </span><span>필드</span></span></td>
</tr>
<tr>
<td><span><span>12~15</span></span></td>
<td><span><span>4B</span></span></td>
<td><span><span>Reserved2</span></span></td>
<td><span><span>예약 </span><span>필드</span></span></td>
</tr>
<tr>
<td><span><span>16~19</span></span></td>
<td><span><span>4B</span></span></td>
<td><span><span>SnapLen</span></span></td>
<td><span><span>패킷당 </span><span>최대 </span><span>캡처 </span><span>길이</span></span></td>
</tr>
<tr>
<td><span><span>20~23</span></span></td>
<td><span><span>4B</span></span></td>
<td><span><span>LinkType </span><span>및 </span><span>추가 </span><span>정보</span></span></td>
<td><span><span>링크 </span><span>계층 </span><span>유형</span></span></td>
</tr>
</tbody>
</table>
</div>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">Packet Record Header 구조</h4>
<p data-ke-size="size16"><span>Global </span><span>Header </span><span>다음에는 </span><span>실제 </span><span>캡처된 </span><span>패킷에 </span><span>대한 </span><span>정보가 </span><span>반복적으로 </span><span>등장한다. 반복적으로 등장하는</span><span> </span><span>패킷 </span><span>앞에는 </span><span>16바이트 </span><span>크기의 </span><span>Packet </span><span>Record </span><span>Header가 </span><span>존재한다.</span></p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>0~3</span></span></td>
<td><span><span>4B</span></span></td>
<td><span><span>Timestamp </span><span>Seconds</span></span></td>
<td><span><span>패킷 </span><span>캡처 </span><span>시각(초)</span></span></td>
</tr>
<tr>
<td><span><span>4~7</span></span></td>
<td><span><span>4B</span></span></td>
<td><span><span>Timestamp </span><span>Fraction</span></span></td>
<td><span><span>마이크로초 </span><span>또는 </span><span>나노초</span></span></td>
</tr>
<tr>
<td><span><span>8~11</span></span></td>
<td><span><span>4B</span></span></td>
<td><span><span>Captured </span><span>Length</span></span></td>
<td><span><span>실제 </span><span>파일에 </span><span>저장한 </span><span>패킷의 </span><span>길이</span></span></td>
</tr>
<tr>
<td><span><span>12~15</span></span></td>
<td><span><span>4B</span></span></td>
<td><span><span>Original </span><span>Length</span></span></td>
<td><span><span>캡처 </span><span>전 </span><span>원본 </span><span>패킷의 </span><span>길이</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">실제로 pcap파일 분석해보기</h4>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793251904698"><code>with open("sample.pcap", "rb") as f:
    header = f.read(24)

print("Global Header:", header.hex(" "))
print("Magic Number:", header[:4].hex(" "))</code></pre>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="147" data-origin-width="1153"><span data-phocus="https://blog.kakaocdn.net/dna/b92PiM/dJMcad42NqA/AAAAAAAAAAAAAAAAAAAAAMMWNy9r-Sls3V9Lr5mJmM_VhnWJ-cd7oSiGii-N0OMn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9QkDWkkb5qOH46rc%2Fr96skG8Oxk%3D" data-url="https://blog.kakaocdn.net/dna/b92PiM/dJMcad42NqA/AAAAAAAAAAAAAAAAAAAAAMMWNy9r-Sls3V9Lr5mJmM_VhnWJ-cd7oSiGii-N0OMn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9QkDWkkb5qOH46rc%2Fr96skG8Oxk%3D"><img data-origin-height="147" data-origin-width="1153" height="147" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/b92PiM/dJMcad42NqA/AAAAAAAAAAAAAAAAAAAAAMMWNy9r-Sls3V9Lr5mJmM_VhnWJ-cd7oSiGii-N0OMn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9QkDWkkb5qOH46rc%2Fr96skG8Oxk%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb92PiM%2FdJMcad42NqA%2FAAAAAAAAAAAAAAAAAAAAAMMWNy9r-Sls3V9Lr5mJmM_VhnWJ-cd7oSiGii-N0OMn%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D9QkDWkkb5qOH46rc%252Fr96skG8Oxk%253D" width="1153"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제로 파일 헤더를 분석해보면</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td>필드</td>
<td>실제 바이트</td>
<td>해석 결과</td>
</tr>
<tr>
<td><span><span>Magic </span><span>Number</span></span></td>
<td><span><span>d4 </span><span>c3 </span><span>b2 </span><span>a1</span></span></td>
<td><span><span>Little-endian, </span><span>Microsecond</span></span></td>
</tr>
<tr>
<td><span><span>Major </span><span>Version</span></span></td>
<td><span><span>02 </span><span>00</span></span></td>
<td><span><span>2</span></span></td>
</tr>
<tr>
<td><span><span>Minor </span><span>Version</span></span></td>
<td><span><span>04 </span><span>00</span></span></td>
<td><span><span>4</span></span></td>
</tr>
<tr>
<td><span><span>Reserved1</span></span></td>
<td><span><span>00 </span><span>00 </span><span>00 </span><span>00</span></span></td>
<td><span><span>0</span></span></td>
</tr>
<tr>
<td><span><span>Reserved2</span></span></td>
<td><span><span>00 </span><span>00 </span><span>00 </span><span>00</span></span></td>
<td><span><span>0</span></span></td>
</tr>
<tr>
<td><span><span>SnapLen</span></span></td>
<td><span><span>ff </span><span>ff </span><span>00 </span><span>00</span></span></td>
<td><span><span>65,535 </span><span>bytes</span></span></td>
</tr>
<tr>
<td><span><span>LinkType</span></span></td>
<td><span><span>01 </span><span>00 </span><span>00 </span><span>00</span></span></td>
<td><span><span>Ethernet </span><span>(1)</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Magic Number : d4 c3 b2 a1은</p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>Classic PCAP 형식</li>
<li>Little-endian 바이트 순서</li>
<li>Microsecond(마이크로초) 단위 타임스탬프</li>
</ul>
<p data-ke-size="size16">를 뜻한다.  Version은 2.4를 나타낸다.</p>
<h3 data-ke-size="size23">WireShark 통계</h3>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="633" data-origin-width="942"><span data-phocus="https://blog.kakaocdn.net/dna/bRHi2j/dJMcaik5OJQ/AAAAAAAAAAAAAAAAAAAAAOtq6wHh7D778eg4snn_QXhnhC_R02Sp1awibm74TvTe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=RaX%2FTv%2FPavHYswlgymmp080w6YQ%3D" data-url="https://blog.kakaocdn.net/dna/bRHi2j/dJMcaik5OJQ/AAAAAAAAAAAAAAAAAAAAAOtq6wHh7D778eg4snn_QXhnhC_R02Sp1awibm74TvTe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=RaX%2FTv%2FPavHYswlgymmp080w6YQ%3D"><img data-origin-height="633" data-origin-width="942" height="633" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bRHi2j/dJMcaik5OJQ/AAAAAAAAAAAAAAAAAAAAAOtq6wHh7D778eg4snn_QXhnhC_R02Sp1awibm74TvTe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=RaX%2FTv%2FPavHYswlgymmp080w6YQ%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbRHi2j%2FdJMcaik5OJQ%2FAAAAAAAAAAAAAAAAAAAAAOtq6wHh7D778eg4snn_QXhnhC_R02Sp1awibm74TvTe%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DRaX%252FTv%252FPavHYswlgymmp080w6YQ%253D" width="942"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">주요 프로토콜 아래 표와 같다. </p>
<div>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>TCP</span></span></td>
<td><span><span>21,801</span></span></td>
<td><span><span>78.2%</span></span></td>
<td><span><span>3.0%</span></span></td>
</tr>
<tr>
<td><span><span>UDP</span></span></td>
<td><span><span>6,073</span></span></td>
<td><span><span>21.8%</span></span></td>
<td><span><span>0.2%</span></span></td>
</tr>
<tr>
<td><span><span>TLS</span></span></td>
<td><span><span>5,427</span></span></td>
<td><span><span>19.5%</span></span></td>
<td><span><span>57.2%</span></span></td>
</tr>
<tr>
<td><span><span>QUIC</span></span></td>
<td><span><span>4,824</span></span></td>
<td><span><span>17.3%</span></span></td>
<td><span><span>18.3%</span></span></td>
</tr>
<tr>
<td><span><span>DNS</span></span></td>
<td><span><span>1,188</span></span></td>
<td><span><span>4.3%</span></span></td>
<td><span><span>0.4%</span></span></td>
</tr>
<tr>
<td><span><span>HTTP</span></span></td>
<td><span><span>35</span></span></td>
<td><span><span>0.1%</span></span></td>
<td><span><span>0.0%</span></span></td>
</tr>
</tbody>
</table>
</div>
<p data-ke-size="size16">전체 27,893개의 패킷이 캡처되었고 TCP 통신이 패킷 수 기준 78.2%를 차지한다. TLS와 QUIC을 통해서 암호화 통신이 비중을 차지한다. 여기서는 아직 악성 서버 주소나 탈취 여부들은 확인할 수 없다..! </p>
<h3 data-ke-size="size23">Py를 이용한 pcap 파일 읽기</h3>
<p data-ke-size="size16">Python PCAP 분석 라이브러리를 비교하면 Python 에서 PCAP을 분석할 때 대표적으로 사용하는 라이브러리는 Scapy, dpkt, struct가 있다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>Scapy</span></span></td>
<td><span><span>패킷 </span><span>분석·생성·조작에 </span><span>다양한 </span><span>기능 </span><span>제공</span></span></td>
<td><span><span>네트워크 </span><span>패킷 </span><span>분석 </span><span>및 </span><span>보안 </span><span>테스트</span></span></td>
</tr>
<tr>
<td><span><span>dpkt</span></span></td>
<td><span><span>바이너리 </span><span>패킷 </span><span>데이터를 </span><span>프로토콜 </span><span>구조로 </span><span>파싱</span></span></td>
<td><span><span>PCAP </span><span>파일 </span><span>분석기 </span><span>구현</span></span></td>
</tr>
<tr>
<td><span><span>struct</span></span></td>
<td><span><span>바이너리 </span><span>데이터를 </span><span>지정한 </span><span>자료형으로 </span><span>변환하는 </span><span>표준 </span><span>라이브러리</span></span></td>
<td><span><span>패킷 </span><span>헤더의 </span><span>바이트 </span><span>직접 </span><span>해석</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Scapy는 PCAP파일을 읽고 패킷 헤더를 자동으로 해석해서 상세 정보를 출력할 수 있다.</p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793253333525"><code>from scapy.all import rdpcap

packets = rdpcap("2026-10-02-AMOS-Stealer-traffic.pcap")

packets[0].show()</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="821" data-origin-width="1095"><span data-phocus="https://blog.kakaocdn.net/dna/cRuhW7/dJMcabl1YQ6/AAAAAAAAAAAAAAAAAAAAAHKwm7tUCj8FFXkNVRIjoETKl1K5pOzCgwtoWdEPLHbl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=1Fn04kCHxl0d03AGmOcVqFCs6II%3D" data-url="https://blog.kakaocdn.net/dna/cRuhW7/dJMcabl1YQ6/AAAAAAAAAAAAAAAAAAAAAHKwm7tUCj8FFXkNVRIjoETKl1K5pOzCgwtoWdEPLHbl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=1Fn04kCHxl0d03AGmOcVqFCs6II%3D"><img data-origin-height="821" data-origin-width="1095" height="821" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cRuhW7/dJMcabl1YQ6/AAAAAAAAAAAAAAAAAAAAAHKwm7tUCj8FFXkNVRIjoETKl1K5pOzCgwtoWdEPLHbl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=1Fn04kCHxl0d03AGmOcVqFCs6II%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcRuhW7%2FdJMcabl1YQ6%2FAAAAAAAAAAAAAAAAAAAAAHKwm7tUCj8FFXkNVRIjoETKl1K5pOzCgwtoWdEPLHbl%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D1Fn04kCHxl0d03AGmOcVqFCs6II%253D" width="1095"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">dpkt는 PCAP 파일을 읽은 뒤 Etherent, IP 등의 프로톸 객체에 직접 접근하는 방식으로 자세하게 필드를 추출할 수 있다.</p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793253468045"><code>import dpkt

with open("sample.pcap", "rb") as f:
    pcap = dpkt.pcap.Reader(f)

    for timestamp, buf in pcap:
        eth = dpkt.ethernet.Ethernet(buf)
        print(eth.src, eth.dst)
        break</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="117" data-origin-width="806"><span data-phocus="https://blog.kakaocdn.net/dna/yDAWw/dJMcabzoq52/AAAAAAAAAAAAAAAAAAAAAG_yG4dBEIEG68plrzwz22EhNLugMHHL34z35ZCKpSnR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ikf8upZ6J8Nx1U0B1jxyNS3eAv8%3D" data-url="https://blog.kakaocdn.net/dna/yDAWw/dJMcabzoq52/AAAAAAAAAAAAAAAAAAAAAG_yG4dBEIEG68plrzwz22EhNLugMHHL34z35ZCKpSnR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ikf8upZ6J8Nx1U0B1jxyNS3eAv8%3D"><img data-origin-height="117" data-origin-width="806" height="117" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/yDAWw/dJMcabzoq52/AAAAAAAAAAAAAAAAAAAAAG_yG4dBEIEG68plrzwz22EhNLugMHHL34z35ZCKpSnR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ikf8upZ6J8Nx1U0B1jxyNS3eAv8%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FyDAWw%2FdJMcabzoq52%2FAAAAAAAAAAAAAAAAAAAAAG_yG4dBEIEG68plrzwz22EhNLugMHHL34z35ZCKpSnR%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dikf8upZ6J8Nx1U0B1jxyNS3eAv8%253D" width="806"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 이번 실습에서는 여러 가지 헤더를 분석하고 각 필드의 의미를 이해해야 하니, dpkt로 패킷을 읽고 각 프로토콜 필드를 직접 추출하는 방식으로 구현할 예정이다.!</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">간단하게 pcap파일 읽어보기</h4>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793253664727"><code>import dpkt

pcap_file = "2026-10-02-AMOS-Stealer-traffic.pcap"

with open(pcap_file, "rb") as f:
    pcap = dpkt.pcap.Reader(f)

    for timestamp, buf in pcap:
        print("Timestamp:", timestamp)
        print("Packet Length:", len(buf))
        print("Raw Packet:", buf[:16].hex(" "))

        break</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="139" data-origin-width="795"><span data-phocus="https://blog.kakaocdn.net/dna/rzoMV/dJMcahs2EeG/AAAAAAAAAAAAAAAAAAAAAGFX-ZZRcGvYqmG7U3LAX3hMWxW5hFL5vpse0de30vjK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=gTHEAUYfL31dO1jF9JYjnr6oMZk%3D" data-url="https://blog.kakaocdn.net/dna/rzoMV/dJMcahs2EeG/AAAAAAAAAAAAAAAAAAAAAGFX-ZZRcGvYqmG7U3LAX3hMWxW5hFL5vpse0de30vjK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=gTHEAUYfL31dO1jF9JYjnr6oMZk%3D"><img data-origin-height="139" data-origin-width="795" height="139" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/rzoMV/dJMcahs2EeG/AAAAAAAAAAAAAAAAAAAAAGFX-ZZRcGvYqmG7U3LAX3hMWxW5hFL5vpse0de30vjK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=gTHEAUYfL31dO1jF9JYjnr6oMZk%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FrzoMV%2FdJMcahs2EeG%2FAAAAAAAAAAAAAAAAAAAAAGFX-ZZRcGvYqmG7U3LAX3hMWxW5hFL5vpse0de30vjK%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DgTHEAUYfL31dO1jF9JYjnr6oMZk%253D" width="795"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">바이너리 파일이기 때문에 with open에서는 r + b를 추가하여 바이너리로 읽은 후, pcap의 변수 안에 dpkt.pcap.Reader(f)를 통해 Global Header와 Packet Record Header를 내부적으로 처리하여 각 패킷의 데이터를 가져올 수 있게 한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 후 for timestamp, buf in pcap을 통해 해당 PCAP 파일에 저장된 패킷을 하나씩 읽어 패킷에 대한 두 가지 값을 반환한다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>timestamp</span></span></td>
<td><span><span>패킷 </span><span>캡처 </span><span>시각을 </span><span>나타내는 </span><span>Unix </span><span>타임스탬프</span></span></td>
</tr>
<tr>
<td><span><span>buf</span></span></td>
<td><span><span>캡처된 </span><span>패킷의 </span><span>원본 </span><span>바이너리 </span><span>데이터</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 전체 패킷에 처음 15개만 순차적으로 읽어보기</p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793253839677"><code>import dpkt
from datetime import datetime, timezone

pcap_file = "2026-10-02-AMOS-Stealer-traffic.pcap"

packet_count = 0

with open(pcap_file, "rb") as f:
    pcap = dpkt.pcap.Reader(f)

    for timestamp, buf in pcap:
        packet_count += 1

        packet_time = datetime.fromtimestamp(
            timestamp,
            tz=timezone.utc
        )
        if packet_count &lt;= 5:
            print(f"Packet #{packet_count}")
            print(f"Time: {packet_time}")
            print(f"Length: {len(buf)} bytes")
            print("-" * 30)

print(f"Total Packets: {packet_count}")</code></pre>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="948" data-origin-width="963"><span data-phocus="https://blog.kakaocdn.net/dna/cE6Rc9/dJMcahs2EyM/AAAAAAAAAAAAAAAAAAAAAE4X6uNX-zNo-M2jpX3Bhpq0U0PciG4o0eTjXBLBTtli/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=AJnOzRAblrjvlIMr%2Fytla0nh4Zs%3D" data-url="https://blog.kakaocdn.net/dna/cE6Rc9/dJMcahs2EyM/AAAAAAAAAAAAAAAAAAAAAE4X6uNX-zNo-M2jpX3Bhpq0U0PciG4o0eTjXBLBTtli/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=AJnOzRAblrjvlIMr%2Fytla0nh4Zs%3D"><img data-origin-height="948" data-origin-width="963" height="948" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cE6Rc9/dJMcahs2EyM/AAAAAAAAAAAAAAAAAAAAAE4X6uNX-zNo-M2jpX3Bhpq0U0PciG4o0eTjXBLBTtli/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=AJnOzRAblrjvlIMr%2Fytla0nh4Zs%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcE6Rc9%2FdJMcahs2EyM%2FAAAAAAAAAAAAAAAAAAAAAE4X6uNX-zNo-M2jpX3Bhpq0U0PciG4o0eTjXBLBTtli%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DAJnOzRAblrjvlIMr%252Fytla0nh4Zs%253D" width="963"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">자세한 네트워크 패킷 헤더 분석.</h2>
<p data-ke-size="size16">일단 Ethernet부터..</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">Ethernet 헤더 분석</h3>
<p data-ke-size="size16">Ethernet은 네트워크 데이터링크 계층에서 사용하는 통신 기술이다. Ehternet 프레임에는 출발지와 목적지의 MAC 주소가 포함되어 있으며, EtherType을 통해 내부에 포함된 상위 프로토콜을 구분할 수 있다!</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">조금 더 자세하게 설명을 해보자면, Ethernet은 같은 링크 내에서 데이터를 전달하기 위해 사용된다. 여기서 중요한 점은 MAC 주소와 IP주소 역할이 다르다는 것!.</p>
<p data-ke-size="size16">보통 MAC주소는 현재 링크에서 프레임을 어느 장치로 전달할지 결정하는 것 이고, IP주소는 네트워크를 넘어 최종적으로 어느 호스트에 전달할지 결정하는 것 이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일반적으로 Ethernet 헤더는 14바이트로 구성된다</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="720" data-origin-width="1280"><span data-phocus="https://blog.kakaocdn.net/dna/olcJi/dJMcabF7zja/AAAAAAAAAAAAAAAAAAAAAO2LKhH4-h9YPCSfBD03Ho6rP1-v1TRgQrOEP9Sr1Uhh/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ikNN34OX3fw%2FLn5YBSX9TJkIVz4%3D" data-url="https://blog.kakaocdn.net/dna/olcJi/dJMcabF7zja/AAAAAAAAAAAAAAAAAAAAAO2LKhH4-h9YPCSfBD03Ho6rP1-v1TRgQrOEP9Sr1Uhh/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ikNN34OX3fw%2FLn5YBSX9TJkIVz4%3D"><img data-origin-height="720" data-origin-width="1280" height="321" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/olcJi/dJMcabF7zja/AAAAAAAAAAAAAAAAAAAAAO2LKhH4-h9YPCSfBD03Ho6rP1-v1TRgQrOEP9Sr1Uhh/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ikNN34OX3fw%2FLn5YBSX9TJkIVz4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FolcJi%2FdJMcabF7zja%2FAAAAAAAAAAAAAAAAAAAAAO2LKhH4-h9YPCSfBD03Ho6rP1-v1TRgQrOEP9Sr1Uhh%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DikNN34OX3fw%252FLn5YBSX9TJkIVz4%253D" width="570"/></span></figure>
</p>
<div>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>Destination </span><span>MAC</span></span></td>
<td><span><span>6B</span></span></td>
<td><span><span>프레임의 </span><span>목적지 </span><span>MAC </span><span>주소</span></span></td>
</tr>
<tr>
<td><span><span>Source </span><span>MAC</span></span></td>
<td><span><span>6B</span></span></td>
<td><span><span>프레임의 </span><span>출발지 </span><span>MAC </span><span>주소</span></span></td>
</tr>
<tr>
<td><span><span>EtherType</span></span></td>
<td><span><span>2B</span></span></td>
<td><span><span>프레임에 </span><span>포함된 </span><span>상위 </span><span>프로토콜</span></span></td>
</tr>
</tbody>
</table>
</div>
<p data-ke-size="size16"><span>대표적인 </span><span>EtherType </span><span>값은 </span><span>다음과 </span><span>같다.</span></p>
<p data-ke-size="size16"><span>0x0800 : IPv4</span></p>
<p data-ke-size="size16"><span>0x0806 : ARP</span></p>
<p data-ke-size="size16"><span>0x86DD : IPv6.</span></p>
<p data-ke-size="size16">-&gt; EtherType은 Eth 헤더 다음에 어떤 프로토콜이 존재하는지 알려주는 필드이기 때문에 중요하게 사용될 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제로 Py 코드로 구현을 해보자면</p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793254450849"><code>from scapy.all import rdpcap, Ether
from datetime import datetime
import sys

pcap_file = sys.argv[1]

packets = rdpcap(pcap_file)

for packet in packets:

    if Ether in packet:

        eth = packet[Ether]

        print("=== Ethernet Header ===")
        print("Timestamp:", datetime.fromtimestamp(float(packet.time)))
        print("Destination MAC:", eth.dst)
        print("Source MAC:", eth.src)
        print("EtherType:", f"0x{eth.type:04x}")

        break</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="157" data-origin-width="1122"><span data-phocus="https://blog.kakaocdn.net/dna/cP5oup/dJMcadqu25T/AAAAAAAAAAAAAAAAAAAAAKdXndyelUhwMAYWZVxbI4SzC_yriHXTu2xBggY2dSr_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=U9ccK8wvI%2BS36FDyNloh%2F35lVZs%3D" data-url="https://blog.kakaocdn.net/dna/cP5oup/dJMcadqu25T/AAAAAAAAAAAAAAAAAAAAAKdXndyelUhwMAYWZVxbI4SzC_yriHXTu2xBggY2dSr_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=U9ccK8wvI%2BS36FDyNloh%2F35lVZs%3D"><img data-origin-height="157" data-origin-width="1122" height="157" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cP5oup/dJMcadqu25T/AAAAAAAAAAAAAAAAAAAAAKdXndyelUhwMAYWZVxbI4SzC_yriHXTu2xBggY2dSr_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=U9ccK8wvI%2BS36FDyNloh%2F35lVZs%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcP5oup%2FdJMcadqu25T%2FAAAAAAAAAAAAAAAAAAAAAKdXndyelUhwMAYWZVxbI4SzC_yriHXTu2xBggY2dSr_%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DU9ccK8wvI%252BS36FDyNloh%252F35lVZs%253D" width="1122"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="104" data-origin-width="678"><span data-phocus="https://blog.kakaocdn.net/dna/KTi4F/dJMcaa1BxWR/AAAAAAAAAAAAAAAAAAAAANS8Z5JG12UZj2vSEAFMUaSBH3kZYiazauEV_UvOh1jg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=OMHJXaI3gdqI5P%2Bo0BSHZaTWVoQ%3D" data-url="https://blog.kakaocdn.net/dna/KTi4F/dJMcaa1BxWR/AAAAAAAAAAAAAAAAAAAAANS8Z5JG12UZj2vSEAFMUaSBH3kZYiazauEV_UvOh1jg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=OMHJXaI3gdqI5P%2Bo0BSHZaTWVoQ%3D"><img data-origin-height="104" data-origin-width="678" height="104" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/KTi4F/dJMcaa1BxWR/AAAAAAAAAAAAAAAAAAAAANS8Z5JG12UZj2vSEAFMUaSBH3kZYiazauEV_UvOh1jg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=OMHJXaI3gdqI5P%2Bo0BSHZaTWVoQ%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FKTi4F%2FdJMcaa1BxWR%2FAAAAAAAAAAAAAAAAAAAAANS8Z5JG12UZj2vSEAFMUaSBH3kZYiazauEV_UvOh1jg%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DOMHJXaI3gdqI5P%252Bo0BSHZaTWVoQ%253D" width="678"/></span></figure>
</p>
<p data-ke-size="size16">실제로 해당 TimeStamp와 맞는 pcap파일을 확인 했을 때 Destination과 Source가 정확한 것을 확인할 수 있다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">IPv4만 분석</h4>
<p data-ke-size="size16">IPv4는 네트워크에서 출발지와 목적지의 IP 주소를 식별하고 패킷을 전달하는데 사용되는 프로토콜이다. IPv4 헤더는 최소 20바이트이고 옵션이 포함되면 최대 60바이트까지 증가할 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">ip헤더는 아래와 같다</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="262" data-origin-width="309"><span data-phocus="https://blog.kakaocdn.net/dna/wMZvr/dJMcadw5Sk8/AAAAAAAAAAAAAAAAAAAAAE44CvF6nUvrdRWhdPOOXrDQoHe5mNdBfD4_Qurr9GLF/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=78m1NyGWEeR81YgUWgFg8Y8FpXg%3D" data-url="https://blog.kakaocdn.net/dna/wMZvr/dJMcadw5Sk8/AAAAAAAAAAAAAAAAAAAAAE44CvF6nUvrdRWhdPOOXrDQoHe5mNdBfD4_Qurr9GLF/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=78m1NyGWEeR81YgUWgFg8Y8FpXg%3D"><img data-origin-height="262" data-origin-width="309" height="262" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/wMZvr/dJMcadw5Sk8/AAAAAAAAAAAAAAAAAAAAAE44CvF6nUvrdRWhdPOOXrDQoHe5mNdBfD4_Qurr9GLF/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=78m1NyGWEeR81YgUWgFg8Y8FpXg%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FwMZvr%2FdJMcadw5Sk8%2FAAAAAAAAAAAAAAAAAAAAAE44CvF6nUvrdRWhdPOOXrDQoHe5mNdBfD4_Qurr9GLF%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D78m1NyGWEeR81YgUWgFg8Y8FpXg%253D" width="309"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">여기서 Protocol 필드에서 IPv4 헤더 다음에 어떤 프로토콜이 존재하는지 알려주며</p>
<p data-ke-size="size16">1 = ICMP</p>
<p data-ke-size="size16">6 = TCP</p>
<p data-ke-size="size16">17 = UDP를 의미한다</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">또한 Fragment Offset은 네트워크의 MTU보다 큰 패킷을 여러 조각으로 나누어 전달할 수 있다. 이럴 때 사용하는 필드가</p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>Identification, Flags, Fragment Offset이다</span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li data-pm-slice="1 1 []">Identification : 같은 원본 패킷에서 나온 조각을 재조립할 때 사용</li>
<li data-pm-slice="1 1 []">Don't Fragment : 패킷을 단편화 X</li>
<li data-pm-slice="1 1 []">More Fragment : 뒤에 추가적인 조각 O</li>
<li data-pm-slice="1 1 []">Fragment Offset : 원본 데이터에서 해당 조각이 위치하는 지점</li>
</ul>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793254826437"><code>from scapy.all import rdpcap, IP
import sys

pcap_file = sys.argv[1]

packets = rdpcap(pcap_file)

for packet in packets:
    if IP in packet:

        ip = packet[IP]

        print("=== IPv4 Header ===")
        print("Version:", ip.version)
        print("Header Length:", ip.ihl * 4, "bytes")
        print("Total Length:", ip.len, "bytes")
        print("Source IP:", ip.src)
        print("Destination IP:", ip.dst)
        print("TTL:", ip.ttl)
        print("Protocol Number:", ip.proto)

        break</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="199" data-origin-width="1152"><span data-phocus="https://blog.kakaocdn.net/dna/batei0/dJMcaf9w7c8/AAAAAAAAAAAAAAAAAAAAAMO2d6OGfoRn_NB7WTBx0goaIuZ91exctB-6w83O2nCt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=wCpqVqg%2Fe%2BfQTtJO39ayukd4QXo%3D" data-url="https://blog.kakaocdn.net/dna/batei0/dJMcaf9w7c8/AAAAAAAAAAAAAAAAAAAAAMO2d6OGfoRn_NB7WTBx0goaIuZ91exctB-6w83O2nCt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=wCpqVqg%2Fe%2BfQTtJO39ayukd4QXo%3D"><img data-origin-height="199" data-origin-width="1152" height="199" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/batei0/dJMcaf9w7c8/AAAAAAAAAAAAAAAAAAAAAMO2d6OGfoRn_NB7WTBx0goaIuZ91exctB-6w83O2nCt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=wCpqVqg%2Fe%2BfQTtJO39ayukd4QXo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbatei0%2FdJMcaf9w7c8%2FAAAAAAAAAAAAAAAAAAAAAMO2d6OGfoRn_NB7WTBx0goaIuZ91exctB-6w83O2nCt%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DwCpqVqg%252Fe%252BfQTtJO39ayukd4QXo%253D" width="1152"/></span></figure>
</p>
<div>
<div><span>코드를 한 번 설명해보자면, </span></div>
<div>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>packet[IP]</span></span></td>
<td><span><span>IPv4 </span><span>헤더 </span><span>추출</span></span></td>
</tr>
<tr>
<td><span><span>ip.version</span></span></td>
<td><span><span>IP </span><span>버전</span></span></td>
</tr>
<tr>
<td><span><span>ip.ihl </span><span>* </span><span>4</span></span></td>
<td><span><span>실제 </span><span>헤더 </span><span>길이를 </span><span>바이트 </span><span>단위로 </span><span>계산</span></span></td>
</tr>
<tr>
<td><span><span>ip.len</span></span></td>
<td><span><span>IP </span><span>헤더와 </span><span>IP </span><span>페이로드를 </span><span>포함한 </span><span>전체 </span><span>길이</span></span></td>
</tr>
<tr>
<td><span><span>ip.src</span></span></td>
<td><span><span>출발지 </span><span>IP </span><span>주소</span></span></td>
</tr>
<tr>
<td><span><span>ip.dst</span></span></td>
<td><span><span>목적지 </span><span>IP </span><span>주소</span></span></td>
</tr>
<tr>
<td><span><span>ip.ttl</span></span></td>
<td><span><span>TTL </span><span>값</span></span></td>
</tr>
<tr>
<td><span><span>ip.proto</span></span></td>
<td><span><span>상위 </span><span>프로토콜 </span><span>번호</span></span></td>
</tr>
</tbody>
</table>
</div>
</div>
<p data-ke-size="size16">이렇게 나온다.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">TCP 헤더 분석</h4>
<p data-ke-size="size16">TCP는 연결 지향형 전송 계층 프로토콜이며 통신하기 전에 연결을 설정하고, 시퀸스 번호와 확인 응답 번호 등을 이용하여 데이터가 안정적으로 전달되도록 지원한다.</p>
<p data-ke-size="size16">TCP 헤더는 최소 20바이트이며 아래와 같이 구성된다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="426" data-origin-width="889"><span data-phocus="https://blog.kakaocdn.net/dna/3esgZ/dJMcag8vLQB/AAAAAAAAAAAAAAAAAAAAAKh1m8-L-CsETFa9dJ1Y3lf1_J-vFkQPmU0YLXTzxfMW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=TlDzHx2vuZ1hlwglH9c6ycPPAXM%3D" data-url="https://blog.kakaocdn.net/dna/3esgZ/dJMcag8vLQB/AAAAAAAAAAAAAAAAAAAAAKh1m8-L-CsETFa9dJ1Y3lf1_J-vFkQPmU0YLXTzxfMW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=TlDzHx2vuZ1hlwglH9c6ycPPAXM%3D"><img data-origin-height="426" data-origin-width="889" height="426" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/3esgZ/dJMcag8vLQB/AAAAAAAAAAAAAAAAAAAAAKh1m8-L-CsETFa9dJ1Y3lf1_J-vFkQPmU0YLXTzxfMW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=TlDzHx2vuZ1hlwglH9c6ycPPAXM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F3esgZ%2FdJMcag8vLQB%2FAAAAAAAAAAAAAAAAAAAAAKh1m8-L-CsETFa9dJ1Y3lf1_J-vFkQPmU0YLXTzxfMW%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DTlDzHx2vuZ1hlwglH9c6ycPPAXM%253D" width="889"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">여기서 TCP Flags를 살짝 집고 넘어가자면, </p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td>Flag</td>
<td><span><span>의미</span></span></td>
</tr>
<tr>
<td><span><span>SYN </span><span>(S)</span></span></td>
<td><span><span>연결 </span><span>요청</span></span></td>
</tr>
<tr>
<td><span><span>ACK </span><span>(A)</span></span></td>
<td><span><span>확인 </span><span>응답</span></span></td>
</tr>
<tr>
<td><span><span>FIN </span><span>(F)</span></span></td>
<td><span><span>정상적인 </span><span>연결 </span><span>종료</span></span></td>
</tr>
<tr>
<td><span><span>RST </span><span>(R)</span></span></td>
<td><span><span>연결 </span><span>재설정</span></span></td>
</tr>
<tr>
<td><span><span>PSH </span><span>(P)</span></span></td>
<td><span><span>데이터의 </span><span>신속한 </span><span>상위 </span><span>계층 </span><span>전달 </span><span>요청</span></span></td>
</tr>
<tr>
<td><span><span>URG </span><span>(U)</span></span></td>
<td><span><span>긴급 </span><span>포인터 </span><span>유효</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">보안적으로 봤을 때 SYN 패킷만 반복되거나 RST 응답이 비정상적으로 많이 발생한다면 추가로 조사할 필요가 있다. 그래서 플래그를 통한 분석을 시도할 수도 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793255096141"><code>from scapy.all import rdpcap, IP, TCP
import sys

pcap_file = sys.argv[1]

packets = rdpcap(pcap_file)

for packet in packets:
    if IP in packet and packet[IP].proto == 6 and TCP in packet:

        ip = packet[IP] 
        tcp = packet[TCP]  // scapy로 해석한 패킷의 TCP 계층에 접근하는 코드

        print("=== TCP Header ===")
        print("Source IP:", ip.src)
        print("Destination IP:", ip.dst)
        print("Source Port:", tcp.sport)   //scapy로 해석한 패킷의 TCP 계층에 접근하는 코드
        print("Destination Port:", tcp.dport)
        print("Sequence Number:", tcp.seq)
        print("Acknowledgment Number:", tcp.ack)
        print("TCP Header Length:", tcp.dataofs * 4, "bytes")
        print("TCP Flags:", str(tcp.flags)) // tcp의 제어 플래그를 확인할 수 있음. 
        print("Window Size:", tcp.window)

        break</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="236" data-origin-width="1120"><span data-phocus="https://blog.kakaocdn.net/dna/Lg9dK/dJMcaiZutrg/AAAAAAAAAAAAAAAAAAAAAEwpyP9iL04D8zGGw2ml8bij8eByAj55ampohX7iyUTj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=v36jgq9OI4h7NsVKWxvZsp6Iwhs%3D" data-url="https://blog.kakaocdn.net/dna/Lg9dK/dJMcaiZutrg/AAAAAAAAAAAAAAAAAAAAAEwpyP9iL04D8zGGw2ml8bij8eByAj55ampohX7iyUTj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=v36jgq9OI4h7NsVKWxvZsp6Iwhs%3D"><img data-origin-height="236" data-origin-width="1120" height="236" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/Lg9dK/dJMcaiZutrg/AAAAAAAAAAAAAAAAAAAAAEwpyP9iL04D8zGGw2ml8bij8eByAj55ampohX7iyUTj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=v36jgq9OI4h7NsVKWxvZsp6Iwhs%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FLg9dK%2FdJMcaiZutrg%2FAAAAAAAAAAAAAAAAAAAAAEwpyP9iL04D8zGGw2ml8bij8eByAj55ampohX7iyUTj%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dv36jgq9OI4h7NsVKWxvZsp6Iwhs%253D" width="1120"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">udp 헤더 분석</h3>
<p data-ke-size="size16"><span>UDP(User </span><span>Datagram </span><span>Protocol)는 </span><span>비연결형 </span><span>전송 </span><span>계층 </span><span>프로토콜이다. </span><span>TCP와 </span><span>달리 </span><span>별도의 </span><span>연결 </span><span>설정 </span><span>과정이 </span><span>없으며, </span><span>전송 </span><span>계층에서 </span><span>데이터의 </span><span>도착이나 </span><span>순서를 </span><span>보장하지 </span><span>않는다. </span><span>UDP는 </span><span>DNS, </span><span>실시간 </span><span>스트리밍, </span><span>QUIC </span><span>등의 </span><span>통신에서 </span><span>사용된다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제 코드를 통해 봐보자면</p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793255295243"><code>from scapy.all import rdpcap, IP, UDP
import sys

pcap_file = sys.argv[1]

packets = rdpcap(pcap_file)

for packet in packets:

    if IP in packet and packet[IP].proto == 17 and UDP in packet:

        ip = packet[IP]
        udp = packet[UDP]

        print("=== UDP Header ===")
        print("Source IP:", ip.src)
        print("Destination IP:", ip.dst)
        print("Source Port:", udp.sport)
        print("Destination Port:", udp.dport)
        print("UDP Length:", udp.len, "bytes")
        print("UDP Checksum:", hex(udp.chksum))

        break</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="184" data-origin-width="1128"><span data-phocus="https://blog.kakaocdn.net/dna/oMGKA/dJMcaierYxG/AAAAAAAAAAAAAAAAAAAAAI_qe0veR_44On4bpzVHB2cOIVpnm_GG0Q6Es6w_LStD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=3aCRMUoHJlNjkHR4PVN1Pd%2Bjnw0%3D" data-url="https://blog.kakaocdn.net/dna/oMGKA/dJMcaierYxG/AAAAAAAAAAAAAAAAAAAAAI_qe0veR_44On4bpzVHB2cOIVpnm_GG0Q6Es6w_LStD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=3aCRMUoHJlNjkHR4PVN1Pd%2Bjnw0%3D"><img data-origin-height="184" data-origin-width="1128" height="184" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/oMGKA/dJMcaierYxG/AAAAAAAAAAAAAAAAAAAAAI_qe0veR_44On4bpzVHB2cOIVpnm_GG0Q6Es6w_LStD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=3aCRMUoHJlNjkHR4PVN1Pd%2Bjnw0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FoMGKA%2FdJMcaierYxG%2FAAAAAAAAAAAAAAAAAAAAAI_qe0veR_44On4bpzVHB2cOIVpnm_GG0Q6Es6w_LStD%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D3aCRMUoHJlNjkHR4PVN1Pd%252Bjnw0%253D" width="1128"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">ICMP.</h4>
<p data-ke-size="size16">ICMP는 IP 네트워크에서 오류 상황과 제어 정보를 전달하기 위해 사용되는 프로토콜이며 대표적으로는 Ping 명령어에서 사용하는 Echo Request와 Echo Reply가 있다. 특이한 성질은 TCP/UDP와 다르게 출발지 포트와 목적지 포트 번호가 없다는 것 이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">-&gt; 그러면 어떻게 구별?.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">type과 Code를 이용하여 메시지를 구분하게 되는데, 아래와 같이 구분할 수 있다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 51.7442%;">
<tbody>
<tr>
<td style="width: 11.5116%;"><span style="color: #333333; text-align: start;">ICMP<span> </span></span></td>
<td style="width: 11.9767%;">Type</td>
<td style="width: 28.1395%;">Code 의미</td>
</tr>
<tr>
<td style="width: 11.5116%;"><span><span>0</span></span></td>
<td style="width: 11.9767%;"><span><span>0</span></span></td>
<td style="width: 28.1395%;"><span><span>Echo </span><span>Reply</span></span></td>
</tr>
<tr>
<td style="width: 11.5116%;"><span><span>3</span></span></td>
<td style="width: 11.9767%;"><span><span>0</span></span></td>
<td style="width: 28.1395%;"><span><span>Network </span><span>Unreachable</span></span></td>
</tr>
<tr>
<td style="width: 11.5116%;"><span><span>3</span></span></td>
<td style="width: 11.9767%;"><span><span>1</span></span></td>
<td style="width: 28.1395%;"><span><span>Host </span><span>Unreachable</span></span></td>
</tr>
<tr>
<td style="width: 11.5116%;"><span><span>3</span></span></td>
<td style="width: 11.9767%;"><span><span>3</span></span></td>
<td style="width: 28.1395%;"><span><span>Port </span><span>Unreachable</span></span></td>
</tr>
<tr>
<td style="width: 11.5116%;"><span><span>8</span></span></td>
<td style="width: 11.9767%;"><span><span>0</span></span></td>
<td style="width: 28.1395%;"><span><span>Echo </span><span>Request</span></span></td>
</tr>
<tr>
<td style="width: 11.5116%;"><span><span>11</span></span></td>
<td style="width: 11.9767%;"><span><span>0</span></span></td>
<td style="width: 28.1395%;"><span><span>TTL </span><span>Exceeded </span><span>in </span><span>Transit</span></span></td>
</tr>
</tbody>
</table>
<figure data-ke-mobilestyle="widthOrigin" data-ke-style="alignCenter" data-ke-type="image">
<figcaption style="display: none;"></figcaption>
</figure>
<p data-ke-size="size16"> </p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793255499999"><code>from scapy.all import rdpcap, IP, ICMP
import sys

pcap_file = sys.argv[1]

packets = rdpcap(pcap_file)

for packet in packets:

    if IP in packet and packet[IP].proto == 1 and ICMP in packet:

        ip = packet[IP]
        icmp = packet[ICMP]

        print("=== ICMP Header ===")
        print("Source IP:", ip.src)
        print("Destination IP:", ip.dst)
        print("ICMP Type:", icmp.type)
        print("ICMP Code:", icmp.code)
        print("ICMP Checksum:", hex(icmp.chksum))

        break</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="163" data-origin-width="1110"><span data-phocus="https://blog.kakaocdn.net/dna/cBjgBZ/dJMcafhBmPv/AAAAAAAAAAAAAAAAAAAAALs96ol9j6HQy_EVOUnZt7AilWYE02zMco6oAZuZaXT1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=3aYAjhLmlwe41A5g7B8ZxYJ9VxM%3D" data-url="https://blog.kakaocdn.net/dna/cBjgBZ/dJMcafhBmPv/AAAAAAAAAAAAAAAAAAAAALs96ol9j6HQy_EVOUnZt7AilWYE02zMco6oAZuZaXT1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=3aYAjhLmlwe41A5g7B8ZxYJ9VxM%3D"><img data-origin-height="163" data-origin-width="1110" height="163" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cBjgBZ/dJMcafhBmPv/AAAAAAAAAAAAAAAAAAAAALs96ol9j6HQy_EVOUnZt7AilWYE02zMco6oAZuZaXT1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=3aYAjhLmlwe41A5g7B8ZxYJ9VxM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcBjgBZ%2FdJMcafhBmPv%2FAAAAAAAAAAAAAAAAAAAAALs96ol9j6HQy_EVOUnZt7AilWYE02zMco6oAZuZaXT1%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D3aYAjhLmlwe41A5g7B8ZxYJ9VxM%253D" width="1110"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">패킷 정보 출력 &amp; 프로토콜별 통계</h3>
<h4 data-ke-size="size20">패킷 통계 분석</h4>
<p data-ke-size="size16">일단 그 전까지는 각각 헤더를 분석해서 각 필드의 값을 출력했으니, 모든 패킷에 대한 통계 데이터값을 먼저 확인해보려고 한다.</p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>전체 패킷 수 및 이더넷, IP 패킷 수</li>
<li>TCP, UDP, ICMP 프로토콜별 패킷 수와 비율</li>
<li>출발지 IP, 목적지 IP통계</li>
<li>TCP, UDP 목적지 포트별 패킷 수</li>
</ol>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="483" data-origin-width="1703"><span data-phocus="https://blog.kakaocdn.net/dna/QGXAM/dJMcadjRZTp/AAAAAAAAAAAAAAAAAAAAAPlyEh8mBxf0y9XPvLvABJ7ds07Hd00m-Pwtpos-3a7x/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=L809ilbmorfAZiC%2BZUHutexFfhY%3D" data-url="https://blog.kakaocdn.net/dna/QGXAM/dJMcadjRZTp/AAAAAAAAAAAAAAAAAAAAAPlyEh8mBxf0y9XPvLvABJ7ds07Hd00m-Pwtpos-3a7x/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=L809ilbmorfAZiC%2BZUHutexFfhY%3D"><img data-origin-height="483" data-origin-width="1703" height="483" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/QGXAM/dJMcadjRZTp/AAAAAAAAAAAAAAAAAAAAAPlyEh8mBxf0y9XPvLvABJ7ds07Hd00m-Pwtpos-3a7x/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=L809ilbmorfAZiC%2BZUHutexFfhY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FQGXAM%2FdJMcadjRZTp%2FAAAAAAAAAAAAAAAAAAAAAPlyEh8mBxf0y9XPvLvABJ7ds07Hd00m-Pwtpos-3a7x%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DL809ilbmorfAZiC%252BZUHutexFfhY%253D" width="1703"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">=== Packet Statistics === <br/>Total packets   : 27893 <br/>Ethernet frames : 27893 <br/>IPv4 packets    : 27893 <br/>TCP        :  21801 (78.16%) <br/>UDP        :   6073 (21.77%) <br/>ICMP       :     19 (0.07%) <br/>OTHER_IP   :      0 (0.00%) <br/>NON_IPV4 : 0</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제로 패킷 분석을 분석해보면, 이렇게 분석 결과가 나오고 </p>
<p data-ke-size="size16">Top 5 source IPs: <br/>[('10.10.2.178', 9650), <br/>('152.42.143.45', 1657),<br/> ('157.240.24.13', 1562), <br/>('151.101.180.159', 1531), </p>
<p data-ke-size="size16">('143.204.133.165', 1230)] <br/><br/>Top 5 destination IPs: <br/>[('10.10.2.178', 18243), </p>
<p data-ke-size="size16">('152.42.143.45', 2838), <br/>('10.10.2.1', 608), <br/>('151.101.180.159', 573), <br/>('23.194.74.187', 356)] <br/><br/>Top 10 destination ports: <br/>[(('TCP', 443), 5004), <br/>(('TCP', 80), 2942), <br/>(('TCP', 49170), 1607),<br/> (('UDP', 56435), 1562), <br/>(('TCP', 54132), 1531), <br/>(('TCP', 54158), 1230), <br/>(('TCP', 54099), 1084), <br/>(('UDP', 443), 1073), <br/>(('TCP', 54177), 1043), <br/>(('TCP', 49156), 896)]</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">IP와 Ports에 대해서 TOP 10, 5를 찾아보면 이렇게 찾을 수 있다.</p>
<h3 data-ke-size="size23">AMOS Stealer 네트워크 트래픽 분석.</h3>
<h4 data-ke-size="size20">6.1 AMOS Stealer 공격 개요</h4>
<p data-ke-size="size16">AMOS는 macOS 환경을 대상으로 정보를 탈취하는 악성코드 계열이며 설명에 따르면 Claude Code를 사칭한 악성 광고와 가짜 설치 페이지를 사용하여 사용자가 정상적인 설치 과정이라고 믿도록 유도한 뒤, 터미널에서 명령어를 실행하게 하는 ClickFix 방식이 활용되었다.</p>
<p data-ke-size="size16"><br/>공격 흐름</p>
<p data-ke-size="size16"> </p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>악성 광고 및 가짜 설치 페이지</li>
<li>사용자의 설치 명령 실행 유도</li>
<li>AMOS Stealer 감염</li>
<li>외부 인프라와 네트워크 통신</li>
</ol>
<p data-ke-size="size16">일단 주요 통신 IP 및 포트를 분석해야 하는데, 보통 악성코드 감염 이후에는 외부 서버와 통신이 발생할 수 있기 때문에 네트워크 포렌식에서는 감염이 의심되는 호스트는 어떤 IP가 있고 해당 호스트가 통신한 외부 IP는 무엇이였는지 등을 살펴봐야 한다.</p>
<p data-ke-size="size16"> 그렇기에 먼저 알려져있는 10.10.2.178을 기준으로 외부 통신 상대를 집계하고 해당 송수신 패킷 수와 IP 길이 합계를 확인하였다. 이후 DNS 질의와 TCP 연결 시도를 추출하여 동일한 외부 IP 또는 도메인을 통신이 반복되는지 조사하였다!.</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">주요 외부 IP, 포트, 송수신 패킷 수</h4>
<p data-ke-size="size16">(간단한 해석은 주석으로 대체)</p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793257723762"><code>from scapy.all import PcapReader, IP, TCP, UDP
from collections import Counter, defaultdict
from ipaddress import ip_address

FILE = "2026-10-02-AMOS-Stealer-traffic.pcap" // 분석할 패킷 캡처 파일
HOST = "10.10.2.178"  // 감염 의심 내부 PC의 IP주소

peers = defaultdict(Counter)
ports = Counter()

with PcapReader(FILE) as packets:
    for p in packets:
        if IP not in p:
            continue

        ip = p[IP]
        if HOST not in (ip.src, ip.dst):
            continue

        outgoing = ip.src == HOST
        peer = ip.dst if outgoing else ip.src

        if not ip_address(peer).is_global:
            continue

        peers[peer]["OUT" if outgoing else "IN"] += 1  // 외부 IP별 송수신 패킷 수를 계산

        layer = ip.payload
        if outgoing and ip.frag == 0 and isinstance(layer, (TCP, UDP)):
            proto = "TCP" if isinstance(layer, TCP) else "UDP"
            ports[(proto, layer.dport)] += 1

print("=== 주요 외부 IP ===")
for peer, count in sorted(
    peers.items(),
    key=lambda x: sum(x[1].values()),
    reverse=True
)[:10]:
    print(peer, "송신:", count["OUT"], "수신:", count["IN"])

print("\n=== 대표 목적지 포트 ===")
for port, count in ports.most_common(10):
    print(port, ":", count)</code></pre>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="373" data-origin-width="373"><span data-phocus="https://blog.kakaocdn.net/dna/uYCjU/dJMcairKFhm/AAAAAAAAAAAAAAAAAAAAADDAwS9lvDqUqn8tCdFBnH5AhkRaCUPw2t_S0Yfen9kc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=oOS30CbAIsnjdaZaF6hVcapbBeE%3D" data-url="https://blog.kakaocdn.net/dna/uYCjU/dJMcairKFhm/AAAAAAAAAAAAAAAAAAAAADDAwS9lvDqUqn8tCdFBnH5AhkRaCUPw2t_S0Yfen9kc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=oOS30CbAIsnjdaZaF6hVcapbBeE%3D"><img data-origin-height="373" data-origin-width="373" height="373" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/uYCjU/dJMcairKFhm/AAAAAAAAAAAAAAAAAAAAADDAwS9lvDqUqn8tCdFBnH5AhkRaCUPw2t_S0Yfen9kc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=oOS30CbAIsnjdaZaF6hVcapbBeE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FuYCjU%2FdJMcairKFhm%2FAAAAAAAAAAAAAAAAAAAAADDAwS9lvDqUqn8tCdFBnH5AhkRaCUPw2t_S0Yfen9kc%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DoOS30CbAIsnjdaZaF6hVcapbBeE%253D" width="373"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">DNS 조회 도메인 및 응답 IP 분석</h4>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793257755052"><code>from scapy.all import PcapReader, IP, UDP, DNS, DNSQR
from collections import Counter, defaultdict

FILE = "2026-10-02-AMOS-Stealer-traffic.pcap"
HOST = "10.10.2.178"

queries = Counter()
answers = defaultdict(set)

with PcapReader(FILE) as packets:
    for p in packets:
        if IP not in p:
            continue

        ip = p[IP]
        udp = ip.payload

        if ip.frag != 0 or not isinstance(udp, UDP):
            continue
        if DNS not in udp or DNSQR not in udp:
            continue

        dns = udp[DNS]
        domain = dns[DNSQR].qname.decode(
            errors="replace"
        ).rstrip(".").lower()

        if dns.qr == 0 and ip.src == HOST:
            queries[domain] += 1

        elif dns.qr == 1 and ip.dst == HOST:
            for rr in dns.an:
                if rr.type == 1:
                    answers[domain].add(str(rr.rdata))

print("=== DNS 조회 TOP 15 ===")

for domain, count in queries.most_common(15):
    print(domain, "| 조회:", count)
    print(" 응답 IP:", ", ".join(sorted(answers[domain])) or "없음")</code></pre>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="595" data-origin-width="1053"><span data-phocus="https://blog.kakaocdn.net/dna/lttyV/dJMcafu4gG3/AAAAAAAAAAAAAAAAAAAAAKA8JnZfaR1FilEZpfeJbcVEbxHbv320RRfYkihfGYot/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=zYx4raqLjR3qXfZ0m7Q9%2B244hw0%3D" data-url="https://blog.kakaocdn.net/dna/lttyV/dJMcafu4gG3/AAAAAAAAAAAAAAAAAAAAAKA8JnZfaR1FilEZpfeJbcVEbxHbv320RRfYkihfGYot/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=zYx4raqLjR3qXfZ0m7Q9%2B244hw0%3D"><img data-origin-height="595" data-origin-width="1053" height="595" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/lttyV/dJMcafu4gG3/AAAAAAAAAAAAAAAAAAAAAKA8JnZfaR1FilEZpfeJbcVEbxHbv320RRfYkihfGYot/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=zYx4raqLjR3qXfZ0m7Q9%2B244hw0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FlttyV%2FdJMcafu4gG3%2FAAAAAAAAAAAAAAAAAAAAAKA8JnZfaR1FilEZpfeJbcVEbxHbv320RRfYkihfGYot%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DzYx4raqLjR3qXfZ0m7Q9%252B244hw0%253D" width="1053"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">실제 IOC 목록으로 비교하기.</h4>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제 IOC 지표들을 확인해보면 claude-desk-code.com과 관련이 있다. 일단 해당 IoC를 활용하여 검사하기</p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793258319418"><code>from scapy.all import PcapReader, IP, DNS, DNSQR

FILE = "2026-10-02-AMOS-Stealer-traffic.pcap"

with open("ioc.txt", encoding="utf-8") as f:
    iocs = {
        line.strip().lower().rstrip(".")
        for line in f
        if line.strip() and not line.startswith("#")
    }

count = 0

with PcapReader(FILE) as packets:
    for frame, p in enumerate(packets, start=1):
        if IP not in p:
            continue

        ip = p[IP]
        found = []

        # IP 주소 비교
        for address in (ip.src, ip.dst):
            if address.lower() in iocs:
                found.append("IP: " + address)

        # DNS 도메인 비교
        if DNS in p and DNSQR in p and p[DNS].qr == 0:
            domain = p[DNSQR].qname.decode(
                errors="replace"
            ).lower().rstrip(".")

            if domain in iocs:
                found.append("DNS: " + domain)

        if found:
            count += 1
            print(f"Frame #{frame}: {', '.join(found)}")

print("\n일치한 패킷 수:", count)</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">ioc.txt에 claude-desk-code.com&lt;--를 넣어놓고 실제 위 코드를 실행하면</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="119" data-origin-width="747"><span data-phocus="https://blog.kakaocdn.net/dna/bz2meR/dJMcaiZuwoV/AAAAAAAAAAAAAAAAAAAAAMZlmOCff_YRR31f4VPxWLwzd1MVUdFpMDlJP0HfQK9T/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=cKyAuH%2F99hWfyF4pFXB9i4eH5DM%3D" data-url="https://blog.kakaocdn.net/dna/bz2meR/dJMcaiZuwoV/AAAAAAAAAAAAAAAAAAAAAMZlmOCff_YRR31f4VPxWLwzd1MVUdFpMDlJP0HfQK9T/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=cKyAuH%2F99hWfyF4pFXB9i4eH5DM%3D"><img data-origin-height="119" data-origin-width="747" height="119" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bz2meR/dJMcaiZuwoV/AAAAAAAAAAAAAAAAAAAAAMZlmOCff_YRR31f4VPxWLwzd1MVUdFpMDlJP0HfQK9T/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=cKyAuH%2F99hWfyF4pFXB9i4eH5DM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbz2meR%2FdJMcaiZuwoV%2FAAAAAAAAAAAAAAAAAAAAAMZlmOCff_YRR31f4VPxWLwzd1MVUdFpMDlJP0HfQK9T%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DcKyAuH%252F99hWfyF4pFXB9i4eH5DM%253D" width="747"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이렇게 나오게 된다. 그러면 실제로 wireshark에서 확인을 하게 되면?</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="346" data-origin-width="1379"><span data-phocus="https://blog.kakaocdn.net/dna/UbDSB/dJMcaiyHyOJ/AAAAAAAAAAAAAAAAAAAAALAT_iZX_SIgjrTUqDzxeywYWUUGIMJsPXsqELyp1AuL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=W25CP5yg2w9NASpkPvJPCHe0Gmw%3D" data-url="https://blog.kakaocdn.net/dna/UbDSB/dJMcaiyHyOJ/AAAAAAAAAAAAAAAAAAAAALAT_iZX_SIgjrTUqDzxeywYWUUGIMJsPXsqELyp1AuL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=W25CP5yg2w9NASpkPvJPCHe0Gmw%3D"><img data-origin-height="346" data-origin-width="1379" height="346" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/UbDSB/dJMcaiyHyOJ/AAAAAAAAAAAAAAAAAAAAALAT_iZX_SIgjrTUqDzxeywYWUUGIMJsPXsqELyp1AuL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=W25CP5yg2w9NASpkPvJPCHe0Gmw%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FUbDSB%2FdJMcaiyHyOJ%2FAAAAAAAAAAAAAAAAAAAAALAT_iZX_SIgjrTUqDzxeywYWUUGIMJsPXsqELyp1AuL%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DW25CP5yg2w9NASpkPvJPCHe0Gmw%253D" width="1379"/></span></figure>
</p>
<table border="1" data-ke-align="alignLeft" data-pm-slice="3 3 []" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span>도메인</span></td>
<td><span>claude-desk-code.com</span></td>
</tr>
<tr>
<td><span>출발지 IP</span></td>
<td><span>10.10.2.178</span></td>
</tr>
<tr>
<td><span>목적지 DNS 서버</span></td>
<td><span>10.10.2.1</span></td>
</tr>
<tr>
<td><span>Frame Number</span></td>
<td><span>37, 38</span></td>
</tr>
<tr>
<td><span>질의 유형</span></td>
<td><span>HTTPS, A</span></td>
</tr>
<tr>
<td><span>일치한 패킷 수</span></td>
<td><span>2개</span></td>
</tr>
<tr>
<td><span>발생 시각 (KST)</span></td>
<td><span><span>2026년 10월 2일 22시 25분경</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>데이터셋의 IOC 자료에서는 해당 도메인을 Claude Code를 사칭한 가짜 다운로드 페이지로 기록하고 있다. </span><span>따라서 해당 DNS 질의는 분석 대상 호스트에서 공격 인프라와 관련된 도메인이 조회되었음을 보여준다.</span></p>
<p data-ke-size="size16"><span>또한 DNS 질의 발생 시각을 UTC로 변환하면 2026년 10월 2일 22시 25분경으로, IOC 자료에 기록된 악성 광고 출현 시각과 일치하는 시간대임을 확인하였다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
