---
layout: post
title: Kubernetes Goat
date: 2026-10-27
desc: "쿠버네티스 보안 실습 환경 Kubernetes Goat 구축과 시나리오 진행 - Build Code, cache-store, docker-bench-security, System-Monitor"
keywords: "Kubernetes Goat, 쿠버네티스, Kubernetes, 컨테이너보안, Container Escape, RBAC, docker-bench-security, cache-store, System Monitor, Wargame"
categories: [CTF-Wargame]
tags: [Kubernetes, Wargame, 컨테이너보안]
icon: fa-flag
---
> Source: [https://sanghole.tistory.com/75](https://sanghole.tistory.com/75)

<h3 data-ke-size="size23">Kubernetes Goat</h3>
<p data-ke-size="size16">Kubernetes Goat는 쿠버네티스 보안 취약점을 직접 공격해 보고, 왜 발생했는지 분석하고 어떻게 방어할지 학습하는 실습용 환경이다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">가지고 있는 시나리오는 대략 이렇다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>Sensitive </span><span>Secrets</span></span></td>
<td><span><span>코드나 </span><span>컨테이너에 </span><span>노출된 </span><span>비밀키 </span><span>발견</span></span></td>
<td><span><span>Secret </span><span>관리, </span><span>민감정보 </span><span>보호</span></span></td>
</tr>
<tr>
<td><span><span>RBAC </span><span>Misconfiguration</span></span></td>
<td><span><span>과도한 </span><span>권한을 </span><span>이용한 </span><span>비밀정보 </span><span>접근</span></span></td>
<td><span><span>최소 </span><span>권한 </span><span>원칙</span></span></td>
</tr>
<tr>
<td><span><span>Container </span><span>Escape</span></span></td>
<td><span><span>권한이 </span><span>높은 </span><span>컨테이너에서 </span><span>호스트 </span><span>영역 </span><span>접근</span></span></td>
<td><span><span>컨테이너 </span><span>격리와 </span><span>권한 </span><span>제한</span></span></td>
</tr>
<tr>
<td><span><span>NodePort </span><span>Exposure</span></span></td>
<td><span><span>외부에 </span><span>노출된 </span><span>내부 </span><span>서비스 </span><span>접근 </span><span>확인</span></span></td>
<td><span><span>서비스 </span><span>노출과 </span><span>방화벽 </span><span>설정</span></span></td>
</tr>
<tr>
<td><span><span>Namespace </span><span>Bypass</span></span></td>
<td><span><span>다른 </span><span>Namespace의 </span><span>리소스에 </span><span>접근 </span><span>가능 </span><span>여부 </span><span>확인</span></span></td>
<td><span><span>네트워크 </span><span>격리</span></span></td>
</tr>
<tr>
<td><span><span>Security </span><span>Auditing</span></span></td>
<td><span><span>취약한 </span><span>설정이나 </span><span>비정상 </span><span>동작 </span><span>탐지</span></span></td>
<td><span><span>Kubernetes </span><span>보안 </span><span>감사</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">추가적으로 방어만 수행하는 것이 아니라 방어 설정까지 연습할 수 있다. </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="145" data-origin-width="906"><span data-phocus="https://blog.kakaocdn.net/dna/cS62zN/dJMcaa1zl3t/AAAAAAAAAAAAAAAAAAAAAARVVDDKAhFT6c1HxAQGqi-yssRPkYwjX0jZjtM5TfF8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=x9KRix%2FteDp8NTTV4xkhX5%2F%2FTbg%3D" data-url="https://blog.kakaocdn.net/dna/cS62zN/dJMcaa1zl3t/AAAAAAAAAAAAAAAAAAAAAARVVDDKAhFT6c1HxAQGqi-yssRPkYwjX0jZjtM5TfF8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=x9KRix%2FteDp8NTTV4xkhX5%2F%2FTbg%3D"><img data-origin-height="145" data-origin-width="906" height="145" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cS62zN/dJMcaa1zl3t/AAAAAAAAAAAAAAAAAAAAAARVVDDKAhFT6c1HxAQGqi-yssRPkYwjX0jZjtM5TfF8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=x9KRix%2FteDp8NTTV4xkhX5%2F%2FTbg%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcS62zN%2FdJMcaa1zl3t%2FAAAAAAAAAAAAAAAAAAAAAARVVDDKAhFT6c1HxAQGqi-yssRPkYwjX0jZjtM5TfF8%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dx9KRix%252FteDp8NTTV4xkhX5%252F%252FTbg%253D" width="906"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">클론 후, 실제로 해당 시나리오들을 보면 많은 시나리오들이 첨부되어 있는 것을 확인할 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Build-code      -   소스코드에 노출된 민감정보 찾기</p>
<p data-ke-size="size16">cache-store    - Namespace 간 접근 문제 분석</p>
<p data-ke-size="size16">docker-bench-security  - Docker 보안 설정 점검 </p>
<p data-ke-size="size16"><span>system-monitor            -  Container Escape 실습</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">위 시나리오 4개를 하기 위해서, 아래 처럼 설정을 해주고</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="483" data-origin-width="907"><span data-phocus="https://blog.kakaocdn.net/dna/T6Xz1/dJMcagU4afz/AAAAAAAAAAAAAAAAAAAAAFl_0Aqp4M6dy8jZxPCukZRkFo75y-qn48uCIetoOoQ_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=XOyHHv8SKI1fVongksU%2BtL%2Bl2WM%3D" data-url="https://blog.kakaocdn.net/dna/T6Xz1/dJMcagU4afz/AAAAAAAAAAAAAAAAAAAAAFl_0Aqp4M6dy8jZxPCukZRkFo75y-qn48uCIetoOoQ_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=XOyHHv8SKI1fVongksU%2BtL%2Bl2WM%3D"><img data-origin-height="483" data-origin-width="907" height="483" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/T6Xz1/dJMcagU4afz/AAAAAAAAAAAAAAAAAAAAAFl_0Aqp4M6dy8jZxPCukZRkFo75y-qn48uCIetoOoQ_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=XOyHHv8SKI1fVongksU%2BtL%2Bl2WM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FT6Xz1%2FdJMcagU4afz%2FAAAAAAAAAAAAAAAAAAAAAFl_0Aqp4M6dy8jZxPCukZRkFo75y-qn48uCIetoOoQ_%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DXOyHHv8SKI1fVongksU%252BtL%252Bl2WM%253D" width="907"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">1. Build Code</h3>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="728" data-origin-width="959"><span data-phocus="https://blog.kakaocdn.net/dna/blvn7w/dJMcahM5Xqo/AAAAAAAAAAAAAAAAAAAAABBa0CHE2ZunbzWafFOKN-SOITVcH9D0oDokbNUIF_9G/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=P4NcJcxj2QE5ndy23O%2BOjxA5DP8%3D" data-url="https://blog.kakaocdn.net/dna/blvn7w/dJMcahM5Xqo/AAAAAAAAAAAAAAAAAAAAABBa0CHE2ZunbzWafFOKN-SOITVcH9D0oDokbNUIF_9G/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=P4NcJcxj2QE5ndy23O%2BOjxA5DP8%3D"><img data-origin-height="728" data-origin-width="959" height="728" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/blvn7w/dJMcahM5Xqo/AAAAAAAAAAAAAAAAAAAAABBa0CHE2ZunbzWafFOKN-SOITVcH9D0oDokbNUIF_9G/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=P4NcJcxj2QE5ndy23O%2BOjxA5DP8%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fblvn7w%2FdJMcahM5Xqo%2FAAAAAAAAAAAAAAAAAAAAABBa0CHE2ZunbzWafFOKN-SOITVcH9D0oDokbNUIF_9G%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DP4NcJcxj2QE5ndy23O%252BOjxA5DP8%253D" width="959"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이 문제는 개발자가 소스코드에 비밀번호나 API 키를 남겨놓았고, 이를 공격자가 알아낼 수 있는 문제이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이 시나리오를 통해 얻는 것들은</p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>웹 애플리케이션 진입점의 보안 설정 오류를 테스트하는 방법</li>
<li>애플리케이션 패키징 및 컨테이너 구성 시 발생하는 일반적인 실수 또는 잘못된 설정</li>
<li>버전 관리 시스템의 코드베이스에서 민감한 키 및 정보 탐지</li>
<li>오픈소스 도구를 활용한 시크릿 식별 및 탐지</li>
</ol>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">해당 사이트에 들어가서, /.git/config를 입력하게 되면 이렇게 git 설정의 config 기록들이 나오는 것을 확인할 수 있다. 이러면 애플리케이션 배포 과정에서 .git 디렉터리를 외부에 노출하는 것 이다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="285" data-origin-width="641"><span data-phocus="https://blog.kakaocdn.net/dna/capgKd/dJMcadRsurI/AAAAAAAAAAAAAAAAAAAAABM_nsuGq_Nc6dwMk2jIm1vWifHKPJ02whDmZtKqwV0H/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=eeBytHnKtSPD0TkteKkRGRrtEaM%3D" data-url="https://blog.kakaocdn.net/dna/capgKd/dJMcadRsurI/AAAAAAAAAAAAAAAAAAAAABM_nsuGq_Nc6dwMk2jIm1vWifHKPJ02whDmZtKqwV0H/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=eeBytHnKtSPD0TkteKkRGRrtEaM%3D"><img data-origin-height="285" data-origin-width="641" height="285" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/capgKd/dJMcadRsurI/AAAAAAAAAAAAAAAAAAAAABM_nsuGq_Nc6dwMk2jIm1vWifHKPJ02whDmZtKqwV0H/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=eeBytHnKtSPD0TkteKkRGRrtEaM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcapgKd%2FdJMcadRsurI%2FAAAAAAAAAAAAAAAAAAAAABM_nsuGq_Nc6dwMk2jIm1vWifHKPJ02whDmZtKqwV0H%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DeeBytHnKtSPD0TkteKkRGRrtEaM%253D" width="641"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">git dumper를 활용하여서 .git 디렉토리를 다운로드하여 Git 저장소의 소스 코드와 커밋 이력을 복원하는 도구이다. 해당 git Dumper를 활용하면 문제 설명에서 소스코드에 비밀번호나 API 키를 남겨놓았따고 하니 그것을 확인할 수 있을 것 같다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="501" data-origin-width="941"><span data-phocus="https://blog.kakaocdn.net/dna/bn0WoR/dJMcahM5XOG/AAAAAAAAAAAAAAAAAAAAAEjmwAxi2GX7eMMWoiqIS7UKzXeUAU4znARW3hlEFVV6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=u8QdkfLT7m8AraXsp3do9XCrGPs%3D" data-url="https://blog.kakaocdn.net/dna/bn0WoR/dJMcahM5XOG/AAAAAAAAAAAAAAAAAAAAAEjmwAxi2GX7eMMWoiqIS7UKzXeUAU4znARW3hlEFVV6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=u8QdkfLT7m8AraXsp3do9XCrGPs%3D"><img data-origin-height="501" data-origin-width="941" height="501" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bn0WoR/dJMcahM5XOG/AAAAAAAAAAAAAAAAAAAAAEjmwAxi2GX7eMMWoiqIS7UKzXeUAU4znARW3hlEFVV6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=u8QdkfLT7m8AraXsp3do9XCrGPs%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbn0WoR%2FdJMcahM5XOG%2FAAAAAAAAAAAAAAAAAAAAAEjmwAxi2GX7eMMWoiqIS7UKzXeUAU4znARW3hlEFVV6%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Du8QdkfLT7m8AraXsp3do9XCrGPs%253D" width="941"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="213" data-origin-width="809"><span data-phocus="https://blog.kakaocdn.net/dna/mc3AK/dJMcadjPK3t/AAAAAAAAAAAAAAAAAAAAACZjf9lmjDU1WDhz_u7Xtt6zpg_2aqju4HNp-IEvNOh5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rm9noHAGJ4nJySZPu%2B1iUEErKjo%3D" data-url="https://blog.kakaocdn.net/dna/mc3AK/dJMcadjPK3t/AAAAAAAAAAAAAAAAAAAAACZjf9lmjDU1WDhz_u7Xtt6zpg_2aqju4HNp-IEvNOh5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rm9noHAGJ4nJySZPu%2B1iUEErKjo%3D"><img data-origin-height="213" data-origin-width="809" height="213" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/mc3AK/dJMcadjPK3t/AAAAAAAAAAAAAAAAAAAAACZjf9lmjDU1WDhz_u7Xtt6zpg_2aqju4HNp-IEvNOh5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rm9noHAGJ4nJySZPu%2B1iUEErKjo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fmc3AK%2FdJMcadjPK3t%2FAAAAAAAAAAAAAAAAAAAAACZjf9lmjDU1WDhz_u7Xtt6zpg_2aqju4HNp-IEvNOh5%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Drm9noHAGJ4nJySZPu%252B1iUEErKjo%253D" width="809"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">git-dumper를 활용하면 이런 결과들을 얻을 수 있는데, 보통 개발자들은 API 키들을 .env에 넣어놓으니까  env파일이 포함된 커밋 내용들을 확인해본다</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="87" data-origin-width="938"><span data-phocus="https://blog.kakaocdn.net/dna/bnsmkJ/dJMcadKHM8R/AAAAAAAAAAAAAAAAAAAAAJYeH7vHS1FAOb1TZqJkFYN8d_a1UYmhqAQ5vtX_CYhG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=VUz06SLRi9Bm9kww4doR%2BK7VLlI%3D" data-url="https://blog.kakaocdn.net/dna/bnsmkJ/dJMcadKHM8R/AAAAAAAAAAAAAAAAAAAAAJYeH7vHS1FAOb1TZqJkFYN8d_a1UYmhqAQ5vtX_CYhG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=VUz06SLRi9Bm9kww4doR%2BK7VLlI%3D"><img data-origin-height="87" data-origin-width="938" height="87" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bnsmkJ/dJMcadKHM8R/AAAAAAAAAAAAAAAAAAAAAJYeH7vHS1FAOb1TZqJkFYN8d_a1UYmhqAQ5vtX_CYhG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=VUz06SLRi9Bm9kww4doR%2BK7VLlI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbnsmkJ%2FdJMcadKHM8R%2FAAAAAAAAAAAAAAAAAAAAAJYeH7vHS1FAOb1TZqJkFYN8d_a1UYmhqAQ5vtX_CYhG%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DVUz06SLRi9Bm9kww4doR%252BK7VLlI%253D" width="938"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 후로 git show 명령어를 통해서 해당 커밋에서 .env 파일이 어떻게 변경되었는지를 보여주면 </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="387" data-origin-width="939"><span data-phocus="https://blog.kakaocdn.net/dna/QH7pv/dJMcaiZsoh9/AAAAAAAAAAAAAAAAAAAAACstkdJxip24ogbWOH7uaXrTuTnHbhSb3IK6OBS7Q9PY/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=uzkRN52A1s3AVv6HgXeq%2FtbckVk%3D" data-url="https://blog.kakaocdn.net/dna/QH7pv/dJMcaiZsoh9/AAAAAAAAAAAAAAAAAAAAACstkdJxip24ogbWOH7uaXrTuTnHbhSb3IK6OBS7Q9PY/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=uzkRN52A1s3AVv6HgXeq%2FtbckVk%3D"><img data-origin-height="387" data-origin-width="939" height="387" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/QH7pv/dJMcaiZsoh9/AAAAAAAAAAAAAAAAAAAAACstkdJxip24ogbWOH7uaXrTuTnHbhSb3IK6OBS7Q9PY/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=uzkRN52A1s3AVv6HgXeq%2FtbckVk%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FQH7pv%2FdJMcaiZsoh9%2FAAAAAAAAAAAAAAAAAAAAACstkdJxip24ogbWOH7uaXrTuTnHbhSb3IK6OBS7Q9PY%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DuzkRN52A1s3AVv6HgXeq%252FtbckVk%253D" width="939"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">바로 키들과 관련된 정보가 추가된 것을 확인할 수 있다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>Git </span><span>정보 </span><span>노출</span></span></td>
<td><span><span>.git/config</span> <span>접근 </span><span>성공</span></span></td>
<td><span><span>웹서버가 </span><span>Git </span><span>내부 </span><span>파일을 </span><span>공개함</span></span></td>
</tr>
<tr>
<td><span><span>저장소 </span><span>복구</span></span></td>
<td><span><span>Git </span><span>Dumper </span><span>사용</span></span></td>
<td><span><span>외부에서 </span><span>Git </span><span>기록을 </span><span>복구할 </span><span>수 </span><span>있음</span></span></td>
</tr>
<tr>
<td><span><span>커밋 </span><span>분석</span></span></td>
<td><span><span>d7c173a</span> <span>발견</span></span></td>
<td><span><span>환경변수가 </span><span>과거 </span><span>Git </span><span>기록에 </span><span>포함됨</span></span></td>
</tr>
<tr>
<td><span><span>민감정보 </span><span>확인</span></span></td>
<td><span><span>.env</span> <span>내용 </span><span>확인</span></span></td>
<td><span><span>AWS </span><span>접근 </span><span>키와 </span><span>실습 </span><span>플래그 </span><span>노출</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">STEP을 확인해보면 이렇다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">간단하게 방지 방법을 생각해보면</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 문제는, 웹서버에서 .git/config에 접근할 수 있었고 Git 과거 커밋의 .env 파일에 AWS 인증정보가 저장되어 있는 것 이다.</p>
<p data-ke-size="size16">웹서버의 .git 접근 차단을 해도 좋고 .dockerignore 설정을 하여서 .git .env 등의 불필요한 파일이 Docker 이미지 빌드 시 불필요한 파일이 포함되지 않도록 할 수 있다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">2. cache-store </h3>
<p data-ke-size="size16"><span>Kubernetes의 </span><span>Namespace는 </span><span>리소스를 </span><span>논리적으로 </span><span>구분하는 </span><span>기능이다. </span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>예를 </span><span>들어 </span><span>다음과 </span><span>같이 </span><span>서로 </span><span>다른 </span><span>Namespace가 </span><span>있다고 </span><span>가정해보면 서로 다른 Namespace에 있으니 자동으로 네트워크가 차단될 것 같지만 실제로는 k8s가 기본적으로 Namespace가 다르다는 이유만으로 Pod 간 통신을 차단하지는 않는다. </span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>그래서 default Namespace의 공격자 Pod에서 secure-middleware Namespace의 Redis 서버에 접근하여 flag를 찾는 문제이다.</span></p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="190" data-origin-width="914"><span data-phocus="https://blog.kakaocdn.net/dna/mvM0N/dJMcagtXv4r/AAAAAAAAAAAAAAAAAAAAABjc1M1besnsogd08XFhmeSwQp5J4V5Hnq36YjLQoDma/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=a78TdnhkeIkVoPHZ6IC%2FtA0ba04%3D" data-url="https://blog.kakaocdn.net/dna/mvM0N/dJMcagtXv4r/AAAAAAAAAAAAAAAAAAAAABjc1M1besnsogd08XFhmeSwQp5J4V5Hnq36YjLQoDma/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=a78TdnhkeIkVoPHZ6IC%2FtA0ba04%3D"><img data-origin-height="190" data-origin-width="914" height="190" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/mvM0N/dJMcagtXv4r/AAAAAAAAAAAAAAAAAAAAABjc1M1besnsogd08XFhmeSwQp5J4V5Hnq36YjLQoDma/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=a78TdnhkeIkVoPHZ6IC%2FtA0ba04%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FmvM0N%2FdJMcagtXv4r%2FAAAAAAAAAAAAAAAAAAAAABjc1M1besnsogd08XFhmeSwQp5J4V5Hnq36YjLQoDma%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Da78TdnhkeIkVoPHZ6IC%252FtA0ba04%253D" width="914"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">해당 Pod를 실행한 후, Redis 서비스까지 확인한 후</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="125" data-origin-width="945"><span data-phocus="https://blog.kakaocdn.net/dna/k1dq4/dJMcac59NGy/AAAAAAAAAAAAAAAAAAAAAH3uUG7rOLZ1VV9ptslB3KFVKKoHnE3TaqS_4LtYbP3Q/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=m94sIcBey62%2F0x4R%2FItBveyvAWU%3D" data-url="https://blog.kakaocdn.net/dna/k1dq4/dJMcac59NGy/AAAAAAAAAAAAAAAAAAAAAH3uUG7rOLZ1VV9ptslB3KFVKKoHnE3TaqS_4LtYbP3Q/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=m94sIcBey62%2F0x4R%2FItBveyvAWU%3D"><img data-origin-height="125" data-origin-width="945" height="125" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/k1dq4/dJMcac59NGy/AAAAAAAAAAAAAAAAAAAAAH3uUG7rOLZ1VV9ptslB3KFVKKoHnE3TaqS_4LtYbP3Q/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=m94sIcBey62%2F0x4R%2FItBveyvAWU%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fk1dq4%2FdJMcac59NGy%2FAAAAAAAAAAAAAAAAAAAAAH3uUG7rOLZ1VV9ptslB3KFVKKoHnE3TaqS_4LtYbP3Q%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dm94sIcBey62%252F0x4R%252FItBveyvAWU%253D" width="945"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">default Namespace에 Pod를 생성한 후, 컨테이너 내부의 셸을 실행한다. 여기서 실행하는 명령어는 이제 공격자 컨테이너 내부에서 실행되는 것들이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">우리가 하는 것은 공격자 Pod에서 Redis서버에 접근하는 것이니, 일단 네트워크 설정부터 확인해본다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="386" data-origin-width="742"><span data-phocus="https://blog.kakaocdn.net/dna/bP7ivo/dJMcaa8vhq2/AAAAAAAAAAAAAAAAAAAAAH8iw_J2wfcU4KvpM5D1vQ_CWZVqcogC9fsjI1VflTN8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9UoZU%2B9A4cCpfGb6mRNO%2F%2F%2FXYBo%3D" data-url="https://blog.kakaocdn.net/dna/bP7ivo/dJMcaa8vhq2/AAAAAAAAAAAAAAAAAAAAAH8iw_J2wfcU4KvpM5D1vQ_CWZVqcogC9fsjI1VflTN8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9UoZU%2B9A4cCpfGb6mRNO%2F%2F%2FXYBo%3D"><img data-origin-height="386" data-origin-width="742" height="386" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bP7ivo/dJMcaa8vhq2/AAAAAAAAAAAAAAAAAAAAAH8iw_J2wfcU4KvpM5D1vQ_CWZVqcogC9fsjI1VflTN8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9UoZU%2B9A4cCpfGb6mRNO%2F%2F%2FXYBo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbP7ivo%2FdJMcaa8vhq2%2FAAAAAAAAAAAAAAAAAAAAAH8iw_J2wfcU4KvpM5D1vQ_CWZVqcogC9fsjI1VflTN8%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D9UoZU%252B9A4cCpfGb6mRNO%252F%252F%252FXYBo%253D" width="742"/></span></figure>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="110" data-origin-width="1495"><span data-phocus="https://blog.kakaocdn.net/dna/r9dim/dJMcafopnv1/AAAAAAAAAAAAAAAAAAAAAKpZtBJYBfuWU5k5Mg5J2Yrn3KkRnAETJP8ydAHScrQd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=DusK4yVe5EahmOO94BC1QQr%2BDW0%3D" data-url="https://blog.kakaocdn.net/dna/r9dim/dJMcafopnv1/AAAAAAAAAAAAAAAAAAAAAKpZtBJYBfuWU5k5Mg5J2Yrn3KkRnAETJP8ydAHScrQd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=DusK4yVe5EahmOO94BC1QQr%2BDW0%3D"><img data-origin-height="110" data-origin-width="1495" height="110" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/r9dim/dJMcafopnv1/AAAAAAAAAAAAAAAAAAAAAKpZtBJYBfuWU5k5Mg5J2Yrn3KkRnAETJP8ydAHScrQd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=DusK4yVe5EahmOO94BC1QQr%2BDW0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fr9dim%2FdJMcafopnv1%2FAAAAAAAAAAAAAAAAAAAAAKpZtBJYBfuWU5k5Mg5J2Yrn3KkRnAETJP8ydAHScrQd%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DDusK4yVe5EahmOO94BC1QQr%252BDW0%253D" width="1495"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">hacker-container인 10.244.0.7과 eth0의 ip가 똑같은 것을 확인하면 네트워크 인터페이스가 실제로 Kubernetes 공격자 Pod의 인터페이스라는 것을 확인할 수 있다. 이러면 이제 Redis 서비스에 접속할 수 있다는 힌트를 얻게 되어</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="92" data-origin-width="601"><span data-phocus="https://blog.kakaocdn.net/dna/bdly9S/dJMcagm8Y4c/AAAAAAAAAAAAAAAAAAAAAHrE8FCZgNN9VqjDgHQm_gfq7e0HPqgx607DvyP-q4ba/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=KJTBMM%2BkEEkp87H0p5NNOhRRcF0%3D" data-url="https://blog.kakaocdn.net/dna/bdly9S/dJMcagm8Y4c/AAAAAAAAAAAAAAAAAAAAAHrE8FCZgNN9VqjDgHQm_gfq7e0HPqgx607DvyP-q4ba/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=KJTBMM%2BkEEkp87H0p5NNOhRRcF0%3D"><img data-origin-height="92" data-origin-width="601" height="92" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bdly9S/dJMcagm8Y4c/AAAAAAAAAAAAAAAAAAAAAHrE8FCZgNN9VqjDgHQm_gfq7e0HPqgx607DvyP-q4ba/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=KJTBMM%2BkEEkp87H0p5NNOhRRcF0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbdly9S%2FdJMcagm8Y4c%2FAAAAAAAAAAAAAAAAAAAAAHrE8FCZgNN9VqjDgHQm_gfq7e0HPqgx607DvyP-q4ba%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DKJTBMM%252BkEEkp87H0p5NNOhRRcF0%253D" width="601"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">접속을 완료했으며</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="214" data-origin-width="612"><span data-phocus="https://blog.kakaocdn.net/dna/KfdGs/dJMcafopnzC/AAAAAAAAAAAAAAAAAAAAAE0swHIZ02YHISn4KbqUIovAviroGJazRGOxyiKv5Adt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=nis24zLH64dI7prlM%2BFhOjm4Qd4%3D" data-url="https://blog.kakaocdn.net/dna/KfdGs/dJMcafopnzC/AAAAAAAAAAAAAAAAAAAAAE0swHIZ02YHISn4KbqUIovAviroGJazRGOxyiKv5Adt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=nis24zLH64dI7prlM%2BFhOjm4Qd4%3D"><img data-origin-height="214" data-origin-width="612" height="214" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/KfdGs/dJMcafopnzC/AAAAAAAAAAAAAAAAAAAAAE0swHIZ02YHISn4KbqUIovAviroGJazRGOxyiKv5Adt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=nis24zLH64dI7prlM%2BFhOjm4Qd4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FKfdGs%2FdJMcafopnzC%2FAAAAAAAAAAAAAAAAAAAAAE0swHIZ02YHISn4KbqUIovAviroGJazRGOxyiKv5Adt%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dnis24zLH64dI7prlM%252BFhOjm4Qd4%253D" width="612"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">접속 후에, KEYS 명령어를 통해 key 확인 후 FLAG를 얻어내면 끝!.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">대응 방안은 <span style="letter-spacing: 0px;">Kubernetes의 </span><span style="letter-spacing: 0px;">Namespace는 </span><span style="letter-spacing: 0px;">기본적으로 </span><span style="letter-spacing: 0px;">네트워크 </span><span style="letter-spacing: 0px;">통신을 </span><span style="letter-spacing: 0px;">차단하지 </span><span style="letter-spacing: 0px;">않으므로, </span><span style="letter-spacing: 0px;">NetworkPolicy를 설정하여 다른 Namespace의 Pod가 Redis에 접근하지 못하도록 제한</span><span style="letter-spacing: 0px;">할 </span><span style="letter-spacing: 0px;">수 </span><span style="letter-spacing: 0px;">있다. </span><span style="letter-spacing: 0px;">또한 </span><span style="letter-spacing: 0px;">Redis에 </span><span style="letter-spacing: 0px;">비밀번호 </span><span style="letter-spacing: 0px;">인증을 </span><span style="letter-spacing: 0px;">적용하고, </span><span style="letter-spacing: 0px;">민감한 </span><span style="letter-spacing: 0px;">정보는 </span><span style="letter-spacing: 0px;">Kubernetes </span><span style="letter-spacing: 0px;">Secret </span><span style="letter-spacing: 0px;">등으로 </span><span style="letter-spacing: 0px;">관리하여 </span><span style="letter-spacing: 0px;">비인가 </span><span style="letter-spacing: 0px;">접근으로 </span><span style="letter-spacing: 0px;">인한 </span><span style="letter-spacing: 0px;">정보 </span><span style="letter-spacing: 0px;">유출을 </span><span style="letter-spacing: 0px;">방지할 </span><span style="letter-spacing: 0px;">수 </span><span style="letter-spacing: 0px;">있다.</span></p>
<div>
<div> </div>
<div> </div>
</div>
<h3 data-ke-size="size23">3. docker-bench-security </h3>
<p data-ke-size="size16">이번 시나리오는 Docker Bench for Security를 실행해서 CIS 보안 권고사항ㅇ르 기준으로 점검 결과를 얻는 것 이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Docker Bench for Security는 Docker 환경이 보안 권고사항을 얼마나 잘 지키고 있는지 점건하는 도구이다.</p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td>검사 영역</td>
<td>검사 내용</td>
</tr>
<tr>
<td><span><span>호스트 </span><span>설정</span></span></td>
<td><span><span>Docker </span><span>호스트의 </span><span>보안 </span><span>설정</span></span></td>
</tr>
<tr>
<td><span><span>Docker </span><span>데몬 </span><span>설정</span></span></td>
<td><span><span>Docker </span><span>서비스의 </span><span>보안 </span><span>옵션</span></span></td>
</tr>
<tr>
<td><span><span>이미지 </span><span>및 </span><span>빌드</span></span></td>
<td><span><span>컨테이너 </span><span>이미지의 </span><span>보안 </span><span>설정</span></span></td>
</tr>
<tr>
<td><span><span>컨테이너 </span><span>실행</span></span></td>
<td><span><span>컨테이너의 </span><span>권한 </span><span>및 </span><span>실행 </span><span>옵션</span></span></td>
</tr>
<tr>
<td><span><span>Docker </span><span>보안 </span><span>운영</span></span></td>
<td><span><span>로깅, </span><span>접근 </span><span>제어 </span><span>등</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">지금은 DaemonSet이 정의되어 있는데 Daemonset은 Kubernetes 노드에 검사 Pod를 배치하는 리소스이며 노드마다 보안 점구 도구를 실행할 때 유용하다!</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">공식 파일에는 </p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>Privileged: True 컨테이너에 높은 권한 부여</li>
<li>hostPID : Ture 호스트의 프로세스 정보 공유</li>
<li>hostNetwork : True 호스트 네트워크 사용</li>
<li>hostPath : 호스트 파일과 소켓을 컨테이너에 마운트</li>
</ul>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<p data-ke-size="size16" data-pm-slice="1 1 []">일단 목표를 살펴보면</p>
<p data-ke-size="size16" data-pm-slice="1 1 []">1. Docker Bench for Security를 실행</p>
<p data-ke-size="size16" data-pm-slice="1 1 []">2. Docker 보안 설정을 점검</p>
<p data-ke-size="size16" data-pm-slice="1 1 []">3. Pass, Warn, INFO 결과를 확인</p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="103" data-origin-width="767"><span data-phocus="https://blog.kakaocdn.net/dna/bsmbmt/dJMb999nMEc/AAAAAAAAAAAAAAAAAAAAANymAYtgHyQct_OFEQToUu05rvT8Oi0Mpd5g0VXy1YXz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=J8ll2h3V2IotG4df%2BUH7TarXQbM%3D" data-url="https://blog.kakaocdn.net/dna/bsmbmt/dJMb999nMEc/AAAAAAAAAAAAAAAAAAAAANymAYtgHyQct_OFEQToUu05rvT8Oi0Mpd5g0VXy1YXz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=J8ll2h3V2IotG4df%2BUH7TarXQbM%3D"><img data-origin-height="103" data-origin-width="767" height="103" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bsmbmt/dJMb999nMEc/AAAAAAAAAAAAAAAAAAAAANymAYtgHyQct_OFEQToUu05rvT8Oi0Mpd5g0VXy1YXz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=J8ll2h3V2IotG4df%2BUH7TarXQbM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbsmbmt%2FdJMb999nMEc%2FAAAAAAAAAAAAAAAAAAAAANymAYtgHyQct_OFEQToUu05rvT8Oi0Mpd5g0VXy1YXz%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DJ8ll2h3V2IotG4df%252BUH7TarXQbM%253D" width="767"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그러기 위해서는 일단 서비스를 띄워주고,</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="372" data-origin-width="941"><span data-phocus="https://blog.kakaocdn.net/dna/ZRPvf/dJMcafWd9sN/AAAAAAAAAAAAAAAAAAAAADO42N0AiJTHdKPXzF6XnKD3rHJvrIu-EB4Lyl4-qE-j/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Ayy%2BxlnuDGXMYdEmj9A8oTWhawI%3D" data-url="https://blog.kakaocdn.net/dna/ZRPvf/dJMcafWd9sN/AAAAAAAAAAAAAAAAAAAAADO42N0AiJTHdKPXzF6XnKD3rHJvrIu-EB4Lyl4-qE-j/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Ayy%2BxlnuDGXMYdEmj9A8oTWhawI%3D"><img data-origin-height="372" data-origin-width="941" height="372" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/ZRPvf/dJMcafWd9sN/AAAAAAAAAAAAAAAAAAAAADO42N0AiJTHdKPXzF6XnKD3rHJvrIu-EB4Lyl4-qE-j/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Ayy%2BxlnuDGXMYdEmj9A8oTWhawI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FZRPvf%2FdJMcafWd9sN%2FAAAAAAAAAAAAAAAAAAAAADO42N0AiJTHdKPXzF6XnKD3rHJvrIu-EB4Lyl4-qE-j%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DAyy%252BxlnuDGXMYdEmj9A8oTWhawI%253D" width="941"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 후, 미리 다운받았던 docker-bench-secuirty를 실행한다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="569" data-origin-width="941"><span data-phocus="https://blog.kakaocdn.net/dna/boLgfE/dJMcaa8vlKj/AAAAAAAAAAAAAAAAAAAAAKBh3kVJaDozBZZSAIYbYuYhw44SbnO6aw1UZhE0t2B3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Bcb2AhKY2N6DL3n18%2B28uC1ktgk%3D" data-url="https://blog.kakaocdn.net/dna/boLgfE/dJMcaa8vlKj/AAAAAAAAAAAAAAAAAAAAAKBh3kVJaDozBZZSAIYbYuYhw44SbnO6aw1UZhE0t2B3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Bcb2AhKY2N6DL3n18%2B28uC1ktgk%3D"><img data-origin-height="569" data-origin-width="941" height="569" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/boLgfE/dJMcaa8vlKj/AAAAAAAAAAAAAAAAAAAAAKBh3kVJaDozBZZSAIYbYuYhw44SbnO6aw1UZhE0t2B3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Bcb2AhKY2N6DL3n18%2B28uC1ktgk%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FboLgfE%2FdJMcaa8vlKj%2FAAAAAAAAAAAAAAAAAAAAAKBh3kVJaDozBZZSAIYbYuYhw44SbnO6aw1UZhE0t2B3%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DBcb2AhKY2N6DL3n18%252B28uC1ktgk%253D" width="941"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Score는 0이지만, 실제로 점검을 해야한다? 싶은 것들도 몇 있었다. Docker Bench 점수는 100점 만점이 아니라 다음 방식으로 계산되는데, </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">PASS +1</p>
<p data-ke-size="size16">WARN -1</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이때 지금 보는 Score 0라는 뜻 자체가 +1 -1 =0 처럼, WARN이 있는데 PASS도 있어서 0점이 뜰 수 있다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="156" data-origin-width="929"><span data-phocus="https://blog.kakaocdn.net/dna/bpLjmg/dJMcairIHwL/AAAAAAAAAAAAAAAAAAAAAAp1PUC5xnNdCaW8IYlWemoZo1XImeoZNUCg3lgWOpY0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=H0CElmKcaIbD%2FNZ%2F5ItnyJmfRQo%3D" data-url="https://blog.kakaocdn.net/dna/bpLjmg/dJMcairIHwL/AAAAAAAAAAAAAAAAAAAAAAp1PUC5xnNdCaW8IYlWemoZo1XImeoZNUCg3lgWOpY0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=H0CElmKcaIbD%2FNZ%2F5ItnyJmfRQo%3D"><img data-origin-height="156" data-origin-width="929" height="156" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bpLjmg/dJMcairIHwL/AAAAAAAAAAAAAAAAAAAAAAp1PUC5xnNdCaW8IYlWemoZo1XImeoZNUCg3lgWOpY0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=H0CElmKcaIbD%2FNZ%2F5ItnyJmfRQo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbpLjmg%2FdJMcairIHwL%2FAAAAAAAAAAAAAAAAAAAAAAp1PUC5xnNdCaW8IYlWemoZo1XImeoZNUCg3lgWOpY0%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DH0CElmKcaIbD%252FNZ%252F5ItnyJmfRQo%253D" width="929"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 중 하나의 예시를 들어서 5.5를 확인해보면, Privileged 컨테이너 실행이 가능하다고 나와있다. 요번 실습에서 Privileged 에 대한 이야기가 많이 나오는데 간략하게 설명하자면 </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">원래는 Docker 컨테이너에서 기본적으로 호스트 시스템에 접근할 수 있는 권한이 제한되어있는데, --privileged 모드를 활용하면 컨테이너에 광범위한 시스템 권한이 부여된다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">4. System-Monitor</h3>
<p data-ke-size="size16">K8s에 부여된 과도한 권한을 이용해 PoD가 실행되는 노드의 파일시스템에 접근할 수 있는지 확인하는 실습이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">핵심 설정</p>
<p data-ke-size="size16">1. privileged: true  - 컨테이너에 매우 높은 권한부여 </p>
<p data-ke-size="size16">2. hostPID: true    -호스트의 프로세스 네임스페이스 공유</p>
<p data-ke-size="size16">3. hostPath: /       - 노드의 루트 파일시스템을 컨테이너에 마운트</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="278" data-origin-width="858"><span data-phocus="https://blog.kakaocdn.net/dna/mATkg/dJMcafhzkok/AAAAAAAAAAAAAAAAAAAAAPC_D8W_8IzvtuJ1uySlQPJfCDwK5BbIbRCzR1x3N1AI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=YSy6adM8RHw4JEpVIyjf5tpevQQ%3D" data-url="https://blog.kakaocdn.net/dna/mATkg/dJMcafhzkok/AAAAAAAAAAAAAAAAAAAAAPC_D8W_8IzvtuJ1uySlQPJfCDwK5BbIbRCzR1x3N1AI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=YSy6adM8RHw4JEpVIyjf5tpevQQ%3D"><img data-origin-height="278" data-origin-width="858" height="278" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/mATkg/dJMcafhzkok/AAAAAAAAAAAAAAAAAAAAAPC_D8W_8IzvtuJ1uySlQPJfCDwK5BbIbRCzR1x3N1AI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=YSy6adM8RHw4JEpVIyjf5tpevQQ%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FmATkg%2FdJMcafhzkok%2FAAAAAAAAAAAAAAAAAAAAAPC_D8W_8IzvtuJ1uySlQPJfCDwK5BbIbRCzR1x3N1AI%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DYSy6adM8RHw4JEpVIyjf5tpevQQ%253D" width="858"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 먼저 로컬로 열고</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="196" data-origin-width="613"><span data-phocus="https://blog.kakaocdn.net/dna/b3soiw/dJMcafopw5t/AAAAAAAAAAAAAAAAAAAAABB6fO-wMFkWAG9bVbI0oOPE13XcV8qOe-MOHaOUdsHf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=vzRxlDAb6JusQjKlV3YwlDSZz68%3D" data-url="https://blog.kakaocdn.net/dna/b3soiw/dJMcafopw5t/AAAAAAAAAAAAAAAAAAAAABB6fO-wMFkWAG9bVbI0oOPE13XcV8qOe-MOHaOUdsHf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=vzRxlDAb6JusQjKlV3YwlDSZz68%3D"><img data-origin-height="196" data-origin-width="613" height="196" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/b3soiw/dJMcafopw5t/AAAAAAAAAAAAAAAAAAAAABB6fO-wMFkWAG9bVbI0oOPE13XcV8qOe-MOHaOUdsHf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=vzRxlDAb6JusQjKlV3YwlDSZz68%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb3soiw%2FdJMcafopw5t%2FAAAAAAAAAAAAAAAAAAAAABB6fO-wMFkWAG9bVbI0oOPE13XcV8qOe-MOHaOUdsHf%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DvzRxlDAb6JusQjKlV3YwlDSZz68%253D" width="613"/></span></figure>
</p>
<p data-ke-size="size16">들어가면 바로 root인 상태이다. 뭐.. ls와 mount 결과값들을 확인해보면</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="416" data-origin-width="949"><span data-phocus="https://blog.kakaocdn.net/dna/clXqvc/dJMcaaOalay/AAAAAAAAAAAAAAAAAAAAALIk0X7j2fNZbxVOHPmtMqFMF4liJEPZnb0f4dSCs2P6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=w6p0xO9nDegLdhHvRqGxgOlMch4%3D" data-url="https://blog.kakaocdn.net/dna/clXqvc/dJMcaaOalay/AAAAAAAAAAAAAAAAAAAAALIk0X7j2fNZbxVOHPmtMqFMF4liJEPZnb0f4dSCs2P6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=w6p0xO9nDegLdhHvRqGxgOlMch4%3D"><img data-origin-height="416" data-origin-width="949" height="416" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/clXqvc/dJMcaaOalay/AAAAAAAAAAAAAAAAAAAAALIk0X7j2fNZbxVOHPmtMqFMF4liJEPZnb0f4dSCs2P6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=w6p0xO9nDegLdhHvRqGxgOlMch4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FclXqvc%2FdJMcaaOalay%2FAAAAAAAAAAAAAAAAAAAAALIk0X7j2fNZbxVOHPmtMqFMF4liJEPZnb0f4dSCs2P6%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dw6p0xO9nDegLdhHvRqGxgOlMch4%253D" width="949"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">호스트 파일시스템에서 </p>
<p data-ke-size="size16">overlay on /host-system type overlay..가 이렇게 나오는데,</p>
<p data-ke-size="size16">컨테이너의 /host-system이라는 별도 경로에도 파일시스템이 마운트되어 있다는 것을 확인할 수 있다. 또한 해당 부분에 rw 권한을 주면서 읽기와 쓰기가 모두 가능한 형태로 마운트되어 있다는 것을 확인할 수 있다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="215" data-origin-width="572"><span data-phocus="https://blog.kakaocdn.net/dna/dbQ77v/dJMcafWef0e/AAAAAAAAAAAAAAAAAAAAAIT1iojTufeyo_QhJbvOBS9Q0kIcklVoOzE8qLiqFls9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Zo%2BnKowOlkTX%2FTgICAZjG99k%2FIA%3D" data-url="https://blog.kakaocdn.net/dna/dbQ77v/dJMcafWef0e/AAAAAAAAAAAAAAAAAAAAAIT1iojTufeyo_QhJbvOBS9Q0kIcklVoOzE8qLiqFls9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Zo%2BnKowOlkTX%2FTgICAZjG99k%2FIA%3D"><img data-origin-height="215" data-origin-width="572" height="215" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/dbQ77v/dJMcafWef0e/AAAAAAAAAAAAAAAAAAAAAIT1iojTufeyo_QhJbvOBS9Q0kIcklVoOzE8qLiqFls9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Zo%2BnKowOlkTX%2FTgICAZjG99k%2FIA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdbQ77v%2FdJMcafWef0e%2FAAAAAAAAAAAAAAAAAAAAAIT1iojTufeyo_QhJbvOBS9Q0kIcklVoOzE8qLiqFls9%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DZo%252BnKowOlkTX%252FTgICAZjG99k%252FIA%253D" width="572"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그렇게 ls를 입력했을 때, 여러 파일들이 나오는 것을 확인할 수 있는데 etc, var, usr, bin 등을 보면 Kubernetes 노드의 파일시스템에 접근할 수 있다고확인한 것 이다!.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="803" data-origin-width="1007"><span data-phocus="https://blog.kakaocdn.net/dna/dw2oxw/dJMcaaUMcqV/AAAAAAAAAAAAAAAAAAAAABQ3XP705F1NEAkrsCJP2s7aSbVWXFifZGQcOisL9vhh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rDdPgAjHi3Q9hy4Z7VSU%2F3OiSsQ%3D" data-url="https://blog.kakaocdn.net/dna/dw2oxw/dJMcaaUMcqV/AAAAAAAAAAAAAAAAAAAAABQ3XP705F1NEAkrsCJP2s7aSbVWXFifZGQcOisL9vhh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rDdPgAjHi3Q9hy4Z7VSU%2F3OiSsQ%3D"><img data-origin-height="803" data-origin-width="1007" height="803" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/dw2oxw/dJMcaaUMcqV/AAAAAAAAAAAAAAAAAAAAABQ3XP705F1NEAkrsCJP2s7aSbVWXFifZGQcOisL9vhh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rDdPgAjHi3Q9hy4Z7VSU%2F3OiSsQ%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fdw2oxw%2FdJMcaaUMcqV%2FAAAAAAAAAAAAAAAAAAAAABQ3XP705F1NEAkrsCJP2s7aSbVWXFifZGQcOisL9vhh%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DrDdPgAjHi3Q9hy4Z7VSU%252F3OiSsQ%253D" width="1007"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">우리가 앞에서 /host-system을 통해 노드 파일 시스템에 접근할 수 있다는 것을 확인했기 때문에 노드 파일시스템을 기준으로 명령어를 실행하고 해당 노드에서 관리하는 Kubernetes Pod 목록까지 조회를 해보려고 한다.</p>
<p data-ke-size="size16"> </p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793074719260"><code>chroot /host-system bash</code></pre>
<p data-ke-size="size16"> 이런 명령어를 활용하면 프로세스가 사용하는 루트 디렉터리를 변경하는 명령어이며 원래 컨테이너에서는 / &lt;-- 이것에 이제 컨테이너의 루트 디렉토리라고 하면, 저 명령어를 수행했을 때 루트 디렉토리는 Bubernetes 노드의 루트 파일시스템으로 바뀌게 되는 것이다.</p>
<p data-ke-size="size16"> </p>
<pre class="cpp" data-ke-language="cpp" data-ke-type="codeblock" id="code_1793074799264"><code>crictl pods</code></pre>
<p data-ke-size="size16"> Kubernetes의 컨테이너 런타임을 조사하고 관리할 때 사용하는 명령어인데,컨테이너 런타임이 관리하는 Pod Sandbox목록을 조회한다. 실제로 여러 컨테이너가 있는 것을 확인했다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="204" data-origin-width="731"><span data-phocus="https://blog.kakaocdn.net/dna/cvfrs5/dJMcacZpXc4/AAAAAAAAAAAAAAAAAAAAAATAE4QdoITYZ-z8IdlradSyGOYHySZE2bT-3wBfuyBf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9b5CNtlgHpWcUSQZqWsuBAU7k2Y%3D" data-url="https://blog.kakaocdn.net/dna/cvfrs5/dJMcacZpXc4/AAAAAAAAAAAAAAAAAAAAAATAE4QdoITYZ-z8IdlradSyGOYHySZE2bT-3wBfuyBf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9b5CNtlgHpWcUSQZqWsuBAU7k2Y%3D"><img data-origin-height="204" data-origin-width="731" height="204" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cvfrs5/dJMcacZpXc4/AAAAAAAAAAAAAAAAAAAAAATAE4QdoITYZ-z8IdlradSyGOYHySZE2bT-3wBfuyBf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9b5CNtlgHpWcUSQZqWsuBAU7k2Y%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fcvfrs5%2FdJMcacZpXc4%2FAAAAAAAAAAAAAAAAAAAAAATAE4QdoITYZ-z8IdlradSyGOYHySZE2bT-3wBfuyBf%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D9b5CNtlgHpWcUSQZqWsuBAU7k2Y%253D" width="731"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">또한 k8s와 관련된 설정 파일들을 확인해보면, admin.conf라는 것을 볼 수 있다. 해당 conf파일은 k8s 클러스터 관리자가 API 서버에 인증할 때 사용할 수 있는 kubeconfig 파일이다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">1. Kubernetes API 서버 주소</p>
<p data-ke-size="size16">2. 클러스터 인증서 정보</p>
<p data-ke-size="size16">3. 클러스터 접근에 필요한 인증 정보</p>
<p data-ke-size="size16">-&gt; 이러한 정보들을 확인할 수 있는데, 이러면 공격자가 이 파일을 확보했을 때 클러스터 관리자 권한으로 k8s aPI에 접근할 위험이 있다는 것 이다. </p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="511" data-origin-width="1228"><span data-phocus="https://blog.kakaocdn.net/dna/coYUqp/dJMb99VSnHT/AAAAAAAAAAAAAAAAAAAAAC8JlKlhpN7QRGZPyk0eyOgI3qUShv1fs25wSigpNiY4/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9Ct%2BjsiKDLDBUMP2pb3WE2oMHp0%3D" data-url="https://blog.kakaocdn.net/dna/coYUqp/dJMb99VSnHT/AAAAAAAAAAAAAAAAAAAAAC8JlKlhpN7QRGZPyk0eyOgI3qUShv1fs25wSigpNiY4/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9Ct%2BjsiKDLDBUMP2pb3WE2oMHp0%3D"><img data-origin-height="511" data-origin-width="1228" height="511" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/coYUqp/dJMb99VSnHT/AAAAAAAAAAAAAAAAAAAAAC8JlKlhpN7QRGZPyk0eyOgI3qUShv1fs25wSigpNiY4/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=9Ct%2BjsiKDLDBUMP2pb3WE2oMHp0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcoYUqp%2FdJMb99VSnHT%2FAAAAAAAAAAAAAAAAAAAAAC8JlKlhpN7QRGZPyk0eyOgI3qUShv1fs25wSigpNiY4%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D9Ct%252BjsiKDLDBUMP2pb3WE2oMHp0%253D" width="1228"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 후 클러스터 관리자 권한으로 k8s API에 접근할 수 있으니, 해당 정보들을활용하여  우리의 목표인 K8s에 부여된 과도한 권한을 이용해 PoD가 실행되는 노드의 파일시스템에 접근할 수 있는지 확인할 수 있다.</p>
<p data-ke-size="size16"> </p>
