---
layout: post
title: 클로즈드 소스 분석해보기
date: 2026-10-14
desc: "Obsidian Desktop AppImage/ASAR를 추출해 JavaScript bundle을 정적 분석하고, Vault CSS로 Community Plugin trust prompt를 가리는 UI redress를 CDP로 재현한 뒤 벤더에 제보한 기록"
keywords: "Obsidian, AppImage, ASAR, Electron, UI Redress, Community Plugin, trust prompt, CDP, 정적 분석, 동적 분석, 취약점 제보, 프론티어"
categories: [BugBounty]
tags: [프론티어, Obsidian, 리버싱, 취약점분석]
icon: fa-shield
---
> Source: [https://sanghole.tistory.com/73](https://sanghole.tistory.com/73)

<p data-ke-size="size16">이 글은 수정 버전인 Obsidian 1.14.4가 공개된 뒤 작성했다..!</p>
<p data-ke-size="size16"> </p>
<table data-ke-align="alignLeft" style="height: 237px;">
<thead>
<tr style="height: 23px;">
<th style="height: 23px;">항목</th>
<th style="height: 23px;">결과</th>
</tr>
</thead>
<tbody>
<tr style="height: 16px;">
<td style="height: 16px;">Target</td>
<td style="height: 16px;">Obsidian Desktop Linux x64 AppImage</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">취약 버전</td>
<td style="height: 22px;">1.13.7 stable</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">수정 확인 버전</td>
<td style="height: 22px;">1.14.4 public</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">분석 방식</td>
<td style="height: 22px;">AppImage/ASAR 추출, JavaScript bundle 정적 분석, CDP 동적 검증</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">발견한 문제</td>
<td style="height: 22px;">Vault CSS를 이용한 Community Plugin trust prompt UI redress</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">필요한 사용자 동작</td>
<td style="height: 22px;">Crafted Vault 열기 + Obsidian 화면 안에서 클릭 1회</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">확인한 영향</td>
<td style="height: 22px;">Plugin 신뢰 승인과 desktop Node.js code 실행</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">안전한 PoC</td>
<td style="height: 22px;">임시 directory에 JSON marker 생성</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">제보 결과</td>
<td style="height: 22px;">Obsidian이 수정했고 1.14.4 공개본에서 재검증 완료</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">CVE/금전 보상</td>
<td style="height: 22px;">없음</td>
</tr>
</tbody>
</table>
<h2 data-ke-size="size26">1. 소스 코드 없이 분석해보기</h2>
<p data-ke-size="size16">이번 미션의 목표는 소스 코드가 공개되어 있지 않은 프로그램을 분석하고, 실제 취약점을 발견해 벤더에 제보하는 것이었다. 처음에는 타겟을 어떻게 잡아야 할지 감도 안 잡혀서 Codex와 함께 먼저 타겟 선정 기준부터 정리했다.</p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>공식 binary는 직접 확보할 수 있지만 원본 소스 코드는 공개되어 있지 않아야 한다.</li>
<li>별도의 물리 장비 없이 전체 공격 흐름을 검증할 수 있어야 한다.</li>
<li>공격자가 제어할 수 있는 입력이 명확해야 한다.</li>
<li>권한이나 신뢰가 바뀌는 보안 경계가 존재해야 한다.</li>
<li>정적 분석과 동적 재현을 모두 할 수 있어야 한다.</li>
<li>문제가 발견되면 실제로 제보할 수 있는 연락 창구가 있어야 한다.</li>
</ol>
<p data-ke-size="size16">4번 기준은 단순 크래시보다는 조금 더 좋은 취약점을 찾고 싶어서 넣었다. </p>
<h3 data-ke-size="size23">1.1 Obsidian을 선택한 이유</h3>
<p data-ke-size="size16">Obsidian은 프론티어 활동에서 접해본 적이 있었고, 여러 후보 중에서 내가 가장 익숙하게 사용해본 프로그램이었다. 그리고 다음과 같은 특징이 있었다.</p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>Obsidian의 핵심 application은 폐쇄 소스다.</li>
<li>공식 Linux AppImage를 직접 내려받을 수 있다.</li>
<li>Electron application이라 실행 code가 ASAR와 JavaScript bundle 형태로 배포된다.</li>
<li>별도 장비 없이 disposable profile에서 모든 실험을 끝낼 수 있다.</li>
<li>다른 사람이 만든 Vault를 여는 기능이 있어 공격자 입력이 명확하다.</li>
</ol>
<h3 data-ke-size="size23">1.2 AppImage가 있다고 open source인 것은 아니다</h3>
<h4 data-ke-size="size20">오픈 소스와 클로드즈 소스의 구체적인 차이점이 무엇일까?</h4>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">오픈 소스의 특징</p>
<p data-ke-size="size16">1. 소프트웨어의 소스 코드가 공개되어 누누가 확인할 수 있는 소프트웨어이다.</p>
<p data-ke-size="size16">2. 라이선스 조건에 따라 소스 코드를 자유롭게 사용, 수정 및 재배포할 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">클로즈드 소스의 특징</p>
<p data-ke-size="size16">1. 소프트웨어의 소스 코드가 일반 사용자에게 공개되지 않는 소프트웨어이다.</p>
<p data-ke-size="size16">2. 소스 코드의 열람, 수정 및 재배포가 개발사나 저작권자의 허가에 따라 제한된다.</p>
<h4 data-ke-size="size20"><br/>그러면 클로즈드 소스는 어떻게 분석해야 할까?</h4>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">클로즈드 소스라고 해서 바이너리를 분석하는 행위가 항상 불법인 것은 아니다. 반대로 보안 연구가 목적이라는 이유만으로 모든 분석이 자동으로 허용되는 것도 아니다.<br/><br/>분석을 시작하기 전에는 다음 항목을 확인해야 한다.<br/><br/>1. 공식 경로에서 정상적으로 받은 프로그램인가?<br/>2. 사용약관에서 역공학과 보안 연구를 허용하는가?<br/>3. 별도의 보안 제보 정책이나 Bug Bounty 범위가 있는가?<br/>4. 내 컴퓨터와 내 계정, 내가 만든 데이터만 사용하는가?<br/>5. 다른 사용자의 데이터나 운영 서버에 접근하지 않는가?<br/>6. 서비스 장애나 실제 피해 없이 최소한의 PoC로 검증할 수 있는가?<br/>7. 발견한 내용을 공개하기 전에 개발사에 먼저 제보할 수 있는가?<br/><br/>이번 분석에서는 공식 Obsidian AppImage를 사용했다. 무조건! 다른 사용자의 계정이나 데이터에는 접근하지 않았으며, 실제 명령 실행이나 정보 유출 대신 JSON marker 파일 하나를 만드는 방식으로 Plugin 실행 여부만 확인했다. 발견한 문제도 공개하기 전에 Obsidian에 먼저 전달했다.<br/><br/>다만 이러한 절차가 분석에 대한 법적 허가를 자동으로 만들어 주는 것은 아니다. 국내 저작권법의 프로그램 코드 역분석 예외도 주로 상호운용성 확보에 필요한 범위로 제한되어 있다. 또한 제품의 이용약관은 법률과 별도로 역공학을 제한할 수 있으므로 반드시 확인해야 한다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">AppImage를 추출할 수 있고 내부 JavaScript를 읽을 수 있다고 해서 Obsidian이 open source인 것은 아니다. Open source는 단순히 실행 파일을 열어볼 수 있다는 의미가 아니라, 저작권자가 정한 license 아래 원본 source code와 수정·배포 권리를 제공하는 개발 방식이다.</p>
<p data-ke-size="size16">이번에 확인한 것은 원본 repository가 아니라 사용자에게 전달된 production artifact였다. 변수 이름과 module 구조가 축약된 상태였고 주석, TypeScript type, build 전 source tree는 포함되지 않았다.</p>
<h2 data-ke-size="size26">2. 분석 환경 구성과 AppImage 구조 확인</h2>
<h3 data-ke-size="size23">2.1 먼저 용어부터 정리하기</h3>
<p data-ke-size="size16">분석 과정에서는 AppImage, Electron, ASAR 같은 단어가 계속 등장한다. 처음에는 ASAR와 ASLR도 비슷해 보여서 헷갈렸는데, 역할은 완전히 다르다.</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>용어</th>
<th>의미</th>
</tr>
</thead>
<tbody>
<tr>
<td>Electron</td>
<td>Chromium 화면과 Node.js 기능을 합쳐 desktop application을 만드는 framework</td>
</tr>
<tr>
<td>AppImage</td>
<td>Linux application과 실행에 필요한 파일을 하나로 묶은 배포 파일</td>
</tr>
<tr>
<td>ASAR</td>
<td>Electron이 JavaScript, HTML, image 등을 하나로 묶을 때 사용하는 archive 형식</td>
</tr>
<tr>
<td>ASLR</td>
<td>실행할 때 memory address를 무작위화하는 보안 기법</td>
</tr>
<tr>
<td>Renderer</td>
<td>실제 Obsidian 화면과 DOM을 그리는 Chromium 쪽 실행 영역</td>
</tr>
<tr>
<td>Main process</td>
<td>Window 생성과 Electron 권한 기능을 담당하는 Node.js 쪽 영역</td>
</tr>
<tr>
<td>Vault</td>
<td>Obsidian이 note와 설정을 보관하는 directory</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">쉽게 말하면 AppImage라는 큰 상자 안에 Electron 실행 파일과 runtime이 있고, 그 안에 다시 ASAR라는 작은 상자로 application code가 들어 있는 구조다.</p>
<pre class="stylus"><code>AppImage
└── squashfs-root/
    ├── Electron/Chromium runtime
    └── resources/
        ├── app.asar
        └── obsidian.asar
</code></pre>
<h3 data-ke-size="size23">2.2 분석한 정확한 파일 기록하기</h3>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="135" data-origin-width="868"><span data-phocus="https://blog.kakaocdn.net/dna/bOPDZH/dJMcacZhGbX/AAAAAAAAAAAAAAAAAAAAADEezSSDHPHm82D74JOvh8OV-cidR8qy0-ePohvBw8uG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=eMnL%2F0ugmZYMN1FXRZ5mkBKpev0%3D" data-url="https://blog.kakaocdn.net/dna/bOPDZH/dJMcacZhGbX/AAAAAAAAAAAAAAAAAAAAADEezSSDHPHm82D74JOvh8OV-cidR8qy0-ePohvBw8uG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=eMnL%2F0ugmZYMN1FXRZ5mkBKpev0%3D"><img data-origin-height="135" data-origin-width="868" height="135" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bOPDZH/dJMcacZhGbX/AAAAAAAAAAAAAAAAAAAAADEezSSDHPHm82D74JOvh8OV-cidR8qy0-ePohvBw8uG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=eMnL%2F0ugmZYMN1FXRZ5mkBKpev0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbOPDZH%2FdJMcacZhGbX%2FAAAAAAAAAAAAAAAAAAAAADEezSSDHPHm82D74JOvh8OV-cidR8qy0-ePohvBw8uG%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DeMnL%252F0ugmZYMN1FXRZ5mkBKpev0%253D" width="868"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<pre class="bash" data-ke-language="bash" data-ke-type="codeblock" id="code_1792077841804"><code>curl -fL --retry 3 \
  -o target/Obsidian-1.13.7.AppImage \
  https://github.com/obsidianmd/obsidian-releases/releases/download/v1.13.7/Obsidian-1.13.7.AppImage</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">분석할 만한 폴더를 만들고 분석 대상을 확인한다. 분석 대상은 공식 Obsidian Desktop 1.13.7 Linux x64 AppImage였다.</p>
<pre class="yaml"><code>Product: Obsidian Desktop
Version: 1.13.7 stable
Package: Linux x64 AppImage
Electron: 43.3.0
Chromium: 150.0.7871.212
AppImage SHA-256: e0d8e0a611624de8c9c7dcd8a9e648279fb0a0d552faa1312b7e4f3a5fa72663
</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Obsidian은 원본 source code를 공개하지 않는다. 하지만 사용자의 컴퓨터에서 실행되려면 실행에 필요한 code 자체는 배포 파일 안에 들어 있어야 한다. 그래서 이번에는 공개된 source repository를 보는 것이 아니라, 공식 배포 파일에서 어떤 code를 복원할 수 있는지부터 확인했다.</p>
<h3 data-ke-size="size23">2.3 AppImage 추출하기</h3>
<p data-ke-size="size16">먼저 다운로드한 파일이 실제 AppImage인지 확인했다.</p>
<pre class="angelscript"><code>file target/Obsidian-1.13.7.AppImage
sha256sum target/Obsidian-1.13.7.AppImage
</code></pre>
<p data-ke-size="size16">확인한 SHA-256은 다음과 같다.</p>
<pre class="llvm"><code>e0d8e0a611624de8c9c7dcd8a9e648279fb0a0d552faa1312b7e4f3a5fa72663
</code></pre>
<p data-ke-size="size16">그다음 AppImage가 기본으로 제공하는 <code>--appimage-extract</code> option으로 내부 filesystem을 추출했다.</p>
<pre class="angelscript"><code>chmod +x target/Obsidian-1.13.7.AppImage

mkdir -p extracted/appimage-1.13.7
cd extracted/appimage-1.13.7
../../target/Obsidian-1.13.7.AppImage --appimage-extract
</code></pre>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="681" data-origin-width="883"><span data-phocus="https://blog.kakaocdn.net/dna/yYo5g/dJMcablYjYb/AAAAAAAAAAAAAAAAAAAAAEpwyAAqqA8taYsaSmMxYSFoSBDAbcPxE8tN09nJvjd0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=21v3zZLMebq1TKtlgeBi63xnAAM%3D" data-url="https://blog.kakaocdn.net/dna/yYo5g/dJMcablYjYb/AAAAAAAAAAAAAAAAAAAAAEpwyAAqqA8taYsaSmMxYSFoSBDAbcPxE8tN09nJvjd0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=21v3zZLMebq1TKtlgeBi63xnAAM%3D"><img data-origin-height="681" data-origin-width="883" height="681" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/yYo5g/dJMcablYjYb/AAAAAAAAAAAAAAAAAAAAAEpwyAAqqA8taYsaSmMxYSFoSBDAbcPxE8tN09nJvjd0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=21v3zZLMebq1TKtlgeBi63xnAAM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FyYo5g%2FdJMcablYjYb%2FAAAAAAAAAAAAAAAAAAAAAEpwyAAqqA8taYsaSmMxYSFoSBDAbcPxE8tN09nJvjd0%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D21v3zZLMebq1TKtlgeBi63xnAAM%253D" width="883"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">명령을 실행하면 <code>squashfs-root</code>라는 directory가 생성된다.</p>
<pre class="stylus"><code>squashfs-root/
├── AppRun
├── obsidian
├── obsidian-cli
├── chrome-sandbox
├── chrome_crashpad_handler
├── locales/
├── resources/
├── resources.pak
├── snapshot_blob.bin
├── v8_context_snapshot.bin
├── libEGL.so
├── libGLESv2.so
├── libffmpeg.so
└── libvulkan.so.1
</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="212" data-origin-width="867"><span data-phocus="https://blog.kakaocdn.net/dna/lXddZ/dJMcad4Zfgq/AAAAAAAAAAAAAAAAAAAAABH-EIgdyX5cBsUNl7TIT_KwLli6lekEEn-GU5WFRSxd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=lCTgDHEGtpmXt3vjkeIKmflIza4%3D" data-url="https://blog.kakaocdn.net/dna/lXddZ/dJMcad4Zfgq/AAAAAAAAAAAAAAAAAAAAABH-EIgdyX5cBsUNl7TIT_KwLli6lekEEn-GU5WFRSxd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=lCTgDHEGtpmXt3vjkeIKmflIza4%3D"><img data-origin-height="212" data-origin-width="867" height="212" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/lXddZ/dJMcad4Zfgq/AAAAAAAAAAAAAAAAAAAAABH-EIgdyX5cBsUNl7TIT_KwLli6lekEEn-GU5WFRSxd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=lCTgDHEGtpmXt3vjkeIKmflIza4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FlXddZ%2FdJMcad4Zfgq%2FAAAAAAAAAAAAAAAAAAAAABH-EIgdyX5cBsUNl7TIT_KwLli6lekEEn-GU5WFRSxd%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DlCTgDHEGtpmXt3vjkeIKmflIza4%253D" width="867"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">처음에는 파일이 생각보다 많이 나온다. 그런데 여기 있는 파일을 전부 같은 중요도로 볼 필요는 없다. <code>libEGL.so</code>, <code>libGLESv2.so</code>, <code>libvulkan.so.1</code>은 화면을 그리기 위한 graphics library이고, <code>libffmpeg.so</code>는 media 처리를 위한 library다. <code>locales</code>와 여러 <code>.pak</code> 파일은 Chromium에서 사용하는 언어 및 UI resource다.</p>
<p data-ke-size="size16">즉, 이런 파일들은 Obsidian에만 있는 기능이라기보다 Electron application을 실행하기 위해 같이 들어간 runtime에 가깝다.</p>
<p data-ke-size="size16">내가 찾으려는 것은 Chromium 자체의 취약점이 아니라 Obsidian이 Vault와 Plugin, 사용자 입력을 어떻게 처리하는지에 대한 부분이다. 그래서 범용 runtime 파일과 Obsidian 고유 파일을 먼저 나누었다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제 디렉토리 안에는 아래와 같은 파일과 디렉토리가 존재한다. </p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>파일 또는 directory</th>
<th>역할과 첫 판단</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>AppRun</code></td>
<td>AppImage 시작 shell script. 환경변수를 설정하고 Obsidian 실행</td>
</tr>
<tr>
<td><code>obsidian</code></td>
<td>Electron/Chromium 기반 native 실행 파일</td>
</tr>
<tr>
<td><code>obsidian-cli</code></td>
<td>Obsidian의 command-line 기능을 제공하는 helper</td>
</tr>
<tr>
<td><code>chrome-sandbox</code></td>
<td>Chromium renderer process의 sandbox helper</td>
</tr>
<tr>
<td><code>chrome_crashpad_handler</code></td>
<td>Electron/Chromium crash 정보 수집과 처리</td>
</tr>
<tr>
<td><code>md.obsidian.Obsidian.desktop</code></td>
<td>Linux menu, icon, custom URL scheme 등록 정보</td>
</tr>
<tr>
<td><code>resources/</code></td>
<td>Obsidian 고유 application code와 resource</td>
</tr>
<tr>
<td><code>locales/</code></td>
<td>Chromium 다국어 문자열</td>
</tr>
<tr>
<td><code>chrome_100_percent.pak</code></td>
<td>기본 DPI용 Chromium UI resource</td>
</tr>
<tr>
<td><code>chrome_200_percent.pak</code></td>
<td>고해상도 DPI용 Chromium UI resource</td>
</tr>
<tr>
<td><code>resources.pak</code></td>
<td>Chromium 공통 UI resource 묶음</td>
</tr>
<tr>
<td><code>icudtl.dat</code></td>
<td>Unicode, locale, 날짜 처리를 위한 ICU data</td>
</tr>
<tr>
<td><code>snapshot_blob.bin</code></td>
<td>V8 JavaScript engine 초기 snapshot</td>
</tr>
<tr>
<td><code>v8_context_snapshot.bin</code></td>
<td>미리 초기화된 V8 execution context</td>
</tr>
<tr>
<td><code>libEGL.so</code>, <code>libGLESv2.so</code></td>
<td>Electron 화면 rendering library</td>
</tr>
<tr>
<td><code>libffmpeg.so</code></td>
<td>Audio와 video decoding library</td>
</tr>
<tr>
<td><code>libvulkan.so.1</code>, <code>libvk_swiftshader.so</code></td>
<td>Vulkan과 software rendering library</td>
</tr>
<tr>
<td><code>usr/</code></td>
<td>Icon과 Linux desktop integration resource</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">2.4 제일 먼저 AppRun을 본 이유</h3>
<p data-ke-size="size16">파일이 많을 때는 일단 실행이 어디서 시작되는지부터 확인하는 것이 좋다고 생각했다. 그래야 어떤 파일이 실제 application이고, 어떤 파일이 옆에서 도와주는 resource인지 구분할 수 있기 때문이다.</p>
<pre class="lsl"><code>cd extracted/appimage-1.13.7/squashfs-root
sed -n '1,220p' AppRun
</code></pre>
<p data-ke-size="size16"><code>AppRun</code>은 binary가 아니라 Bash script였다.</p>
<pre class="ini"><code>BIN="$APPDIR/obsidian"
</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="430" data-origin-width="1540"><span data-phocus="https://blog.kakaocdn.net/dna/b4YDbA/dJMcafIHCiq/AAAAAAAAAAAAAAAAAAAAAIP2ULSQxDbgH2qzNWwmb40IBq2PgSkR6ghiu52gu4rt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=5Zot73UaY5gyrqMkFt8NihkoW7c%3D" data-url="https://blog.kakaocdn.net/dna/b4YDbA/dJMcafIHCiq/AAAAAAAAAAAAAAAAAAAAAIP2ULSQxDbgH2qzNWwmb40IBq2PgSkR6ghiu52gu4rt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=5Zot73UaY5gyrqMkFt8NihkoW7c%3D"><img data-origin-height="430" data-origin-width="1540" height="430" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/b4YDbA/dJMcafIHCiq/AAAAAAAAAAAAAAAAAAAAAIP2ULSQxDbgH2qzNWwmb40IBq2PgSkR6ghiu52gu4rt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=5Zot73UaY5gyrqMkFt8NihkoW7c%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb4YDbA%2FdJMcafIHCiq%2FAAAAAAAAAAAAAAAAAAAAAIP2ULSQxDbgH2qzNWwmb40IBq2PgSkR6ghiu52gu4rt%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D5Zot73UaY5gyrqMkFt8NihkoW7c%253D" width="1540"/></span></figure>
</p>
<p data-ke-size="size16">Script에서는 현재 AppImage directory를 찾고, <code>PATH</code>, <code>LD_LIBRARY_PATH</code>, <code>XDG_DATA_DIRS</code> 같은 환경변수를 내부 경로로 설정한 뒤 마지막에 <code>obsidian</code> binary를 실행했다.</p>
<p data-ke-size="size16">즉 실행 흐름은 대략 다음과 같았다.</p>
<pre class="properties"><code>AppImage 실행
    ↓
AppRun
    ↓
AppImage 내부 library path 설정
    ↓
obsidian ELF 실행
</code></pre>
<p data-ke-size="size16">Desktop entry도 같이 확인했다.</p>
<pre class="stylus"><code>sed -n '1,100p' md.obsidian.Obsidian.desktop
</code></pre>
<pre class="ini"><code>Exec=AppRun --no-sandbox %U
X-AppImage-Version=1.13.7
MimeType=x-scheme-handler/obsidian;
</code></pre>
<p data-ke-size="size16">여기서 <code>--no-sandbox</code>와 <code>obsidian:</code> URL scheme이 보였다. 일단 이후에 BrowserWindow가 어떤 권한으로 만들어지고, 외부 입력이 어떤 renderer에 들어가는지 확인해야 했다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Apprun을 분석하면서 아래와 같은 두 가지 정보를 얻었다.</p>
<p data-ke-size="size16"> </p>
<pre class="angelscript"><code>1. 실제 실행 파일은 obsidian ELF다.
2. Obsidian은 custom URL scheme과 Electron sandbox 경계를 추가로 확인할 필요가 있다.
</code></pre>
<h3 data-ke-size="size23">2.5 그러면 obsidian ELF를 Ghidra로 보면 되는 거 아닌가?</h3>
<p data-ke-size="size16">실제 실행 파일을 찾았으니 바로 Ghidra에 넣는 방법도 생각할 수 있기에, 실제 파일 형식들을 확인했다. </p>
<pre class="properties"><code>file obsidian
du -h obsidian
</code></pre>
<p data-ke-size="size16">결과는 다음과 같았다.</p>
<pre class="angelscript"><code>ELF 64-bit LSB pie executable, x86-64, dynamically linked, stripped
약 211MB
</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="430" data-origin-width="1540"><span data-phocus="https://blog.kakaocdn.net/dna/cjuSeP/dJMcacyi6IT/AAAAAAAAAAAAAAAAAAAAAPOrEbfWli_LRiE3JM-W5TX4c4AEJTPHZln5nvGeqgUZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=LqTt4LungnGMzVv9B3XYfCs%2BK68%3D" data-url="https://blog.kakaocdn.net/dna/cjuSeP/dJMcacyi6IT/AAAAAAAAAAAAAAAAAAAAAPOrEbfWli_LRiE3JM-W5TX4c4AEJTPHZln5nvGeqgUZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=LqTt4LungnGMzVv9B3XYfCs%2BK68%3D"><img data-origin-height="430" data-origin-width="1540" height="430" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cjuSeP/dJMcacyi6IT/AAAAAAAAAAAAAAAAAAAAAPOrEbfWli_LRiE3JM-W5TX4c4AEJTPHZln5nvGeqgUZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=LqTt4LungnGMzVv9B3XYfCs%2BK68%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcjuSeP%2FdJMcacyi6IT%2FAAAAAAAAAAAAAAAAAAAAAPOrEbfWli_LRiE3JM-W5TX4c4AEJTPHZln5nvGeqgUZ%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DLqTt4LungnGMzVv9B3XYfCs%252BK68%253D" width="1540"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">여기서 PIE는 실행할 때, ASLR의 적용을 받을 수 있도록 만들어진 바이너리라는 의미이고 Stripped는 함수명이나 debugging symbol이 대부분 제거됐다는 의미이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">근데 211MB짜리 해당 ELF에는 우리가 보고 싶은 Obsidian Code만이 들어가있는 것은 아니다. V8, Electron runtime이 같이 포함되어 있기 때문에 내가 보고 싶었던 Valut가 application 기능으로 전달되는 과정을 기드라를 활용하여 복원하기에는 쉽지 않다. </p>
<p data-ke-size="size16">그래서 일단은 application JavaSrcipt를 확인하고, 해당 JavaSript가 native module이나 IPC로 내려가는 지점이 나오면 그때 다시 ELF 돌아오는 생각을 하고 넘아갔다 .</p>
<h3 data-ke-size="size23">2.6 ASAR가 뭐지?</h3>
<p data-ke-size="size16"><code>resources</code> directory를 확인하니 다음 파일이 있었다.</p>
<pre class="vim"><code>ls -lh resources/
</code></pre>
<p data-ke-size="size16"> </p>
<pre class="stata"><code>app.asar
app.asar.unpacked/
obsidian.asar
icon.png
</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="192" data-origin-width="882"><span data-phocus="https://blog.kakaocdn.net/dna/bA10MC/dJMcackJjHG/AAAAAAAAAAAAAAAAAAAAAKC8fpauUZH2thLbPm69PCRGJzFzI07rOIFy6VZardTS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=QWbG9BKCFiAFRSmxW3FxW9YNcT8%3D" data-url="https://blog.kakaocdn.net/dna/bA10MC/dJMcackJjHG/AAAAAAAAAAAAAAAAAAAAAKC8fpauUZH2thLbPm69PCRGJzFzI07rOIFy6VZardTS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=QWbG9BKCFiAFRSmxW3FxW9YNcT8%3D"><img data-origin-height="192" data-origin-width="882" height="192" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bA10MC/dJMcackJjHG/AAAAAAAAAAAAAAAAAAAAAKC8fpauUZH2thLbPm69PCRGJzFzI07rOIFy6VZardTS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=QWbG9BKCFiAFRSmxW3FxW9YNcT8%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbA10MC%2FdJMcackJjHG%2FAAAAAAAAAAAAAAAAAAAAAKC8fpauUZH2thLbPm69PCRGJzFzI07rOIFy6VZardTS%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DQWbG9BKCFiAFRSmxW3FxW9YNcT8%253D" width="882"/></span></figure>
</p>
<p data-ke-size="size16">여기서 ASAR는 ASLR과 이름이 비슷하지만 완전히 다른 것이다.</p>
<pre class="avrasm"><code>ASLR: 실행할 때 memory address를 무작위화하는 보안 기법
ASAR: Electron application의 JavaScript와 resource를 묶는 archive 형식
</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">AppImage가 Linux에서 application 전체를 배포하기 위한 바깥쪽 container라면, ASAR는 Electron application code를 묶어 놓은 안쪽 archive라고 생각할 수 있다.</p>
<p data-ke-size="size16"> </p>
<pre class="stylus"><code>AppImage
└── squashfs-root
    ├── Electron/Chromium runtime
    └── resources
        ├── app.asar
        └── obsidian.asar
</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그래서 두 asar의 파일을 비교해보면 </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="460" data-origin-width="1540"><span data-phocus="https://blog.kakaocdn.net/dna/Vjq6P/dJMcaf9tEsB/AAAAAAAAAAAAAAAAAAAAAK-ti3pI679-5_4XJwVmnChLmMXN0w1oJtbNWhj_W77E/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=cXaefqpccu2Mds2qmjC09IcAfiU%3D" data-url="https://blog.kakaocdn.net/dna/Vjq6P/dJMcaf9tEsB/AAAAAAAAAAAAAAAAAAAAAK-ti3pI679-5_4XJwVmnChLmMXN0w1oJtbNWhj_W77E/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=cXaefqpccu2Mds2qmjC09IcAfiU%3D"><img data-origin-height="460" data-origin-width="1540" height="460" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/Vjq6P/dJMcaf9tEsB/AAAAAAAAAAAAAAAAAAAAAK-ti3pI679-5_4XJwVmnChLmMXN0w1oJtbNWhj_W77E/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=cXaefqpccu2Mds2qmjC09IcAfiU%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FVjq6P%2FdJMcaf9tEsB%2FAAAAAAAAAAAAAAAAAAAAAK-ti3pI679-5_4XJwVmnChLmMXN0w1oJtbNWhj_W77E%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DcXaefqpccu2Mds2qmjC09IcAfiU%253D" width="1540"/></span></figure>
</p>
<p data-ke-size="size16">크기만 보면 <code>app.asar</code>는 실행을 연결하는 작은 bootstrap이고, <code>obsidian.asar</code>에는 실제 제품 기능이 들어 있을 가능성이 높아 보였다. 하지만 파일 크기만으로 역할을 확정하면 안 되니까 두 archive의 목록과 <code>package.json</code>을 직접 비교하기로 했다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">2.7 ASAR 내부 확인하기</h3>
<p data-ke-size="size16">ASAR를 일반 압축 프로그램으로 억지로 열기보다는 Electron에서 제공하는 <code>@electron/asar</code>를 사용했다. 나중에 같은 version으로 다시 분석할 수 있게 global 설치가 아니라 현재 project 안에 설치했다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">사용 명령어: </p>
<pre class="bash" data-ke-language="bash"><code>cd /mnt/c/Users/user/obsidian-from-scratch

mkdir -p tools/node
cd tools/node
npm init -y
npm install --save-exact @electron/asar@3.2.18
npm install --save-dev --save-exact prettier@3.6.2
cd ../..</code></pre>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="970" data-origin-width="1540"><span data-phocus="https://blog.kakaocdn.net/dna/87Cm4/dJMcad4Zfmw/AAAAAAAAAAAAAAAAAAAAADsLlaLi_Pq_AfEhYBhOqQkwwtUH5G_uwQN1NxKWHJeT/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Q%2Bif5y%2FlCPmSBkSAA38%2FsmTWnds%3D" data-url="https://blog.kakaocdn.net/dna/87Cm4/dJMcad4Zfmw/AAAAAAAAAAAAAAAAAAAAADsLlaLi_Pq_AfEhYBhOqQkwwtUH5G_uwQN1NxKWHJeT/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Q%2Bif5y%2FlCPmSBkSAA38%2FsmTWnds%3D"><img data-origin-height="970" data-origin-width="1540" height="970" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/87Cm4/dJMcad4Zfmw/AAAAAAAAAAAAAAAAAAAAADsLlaLi_Pq_AfEhYBhOqQkwwtUH5G_uwQN1NxKWHJeT/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Q%2Bif5y%2FlCPmSBkSAA38%2FsmTWnds%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F87Cm4%2FdJMcad4Zfmw%2FAAAAAAAAAAAAAAAAAAAAADsLlaLi_Pq_AfEhYBhOqQkwwtUH5G_uwQN1NxKWHJeT%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DQ%252Bif5y%252FlCPmSBkSAA38%252FsmTWnds%253D" width="1540"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 바로 추출하지 않고 어떤 파일이 들어 있는지 목록부터 확인했다.</p>
<pre class="crmsh"><code>./tools/node/node_modules/.bin/asar list \
  extracted/appimage-1.13.7/squashfs-root/resources/app.asar

./tools/node/node_modules/.bin/asar list \
  extracted/appimage-1.13.7/squashfs-root/resources/obsidian.asar
</code></pre>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="972" data-origin-width="1540"><span data-phocus="https://blog.kakaocdn.net/dna/c1MW3K/dJMcacrGble/AAAAAAAAAAAAAAAAAAAAAG3Lijmu-_PKjjWyQhHzk5H4hHwH08qiLp8tFpA1EEyL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=SOUaA33Xo1Aia0gfuQwljU%2BJ3m0%3D" data-url="https://blog.kakaocdn.net/dna/c1MW3K/dJMcacrGble/AAAAAAAAAAAAAAAAAAAAAG3Lijmu-_PKjjWyQhHzk5H4hHwH08qiLp8tFpA1EEyL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=SOUaA33Xo1Aia0gfuQwljU%2BJ3m0%3D"><img data-origin-height="972" data-origin-width="1540" height="972" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/c1MW3K/dJMcacrGble/AAAAAAAAAAAAAAAAAAAAAG3Lijmu-_PKjjWyQhHzk5H4hHwH08qiLp8tFpA1EEyL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=SOUaA33Xo1Aia0gfuQwljU%2BJ3m0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fc1MW3K%2FdJMcacrGble%2FAAAAAAAAAAAAAAAAAAAAAG3Lijmu-_PKjjWyQhHzk5H4hHwH08qiLp8tFpA1EEyL%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DSOUaA33Xo1Aia0gfuQwljU%252BJ3m0%253D" width="1540"/></span></figure>
</p>
<p data-ke-size="size16">그다음 두 archive를 서로 다른 directory에 추출했다.</p>
<pre class="angelscript"><code>mkdir -p extracted/asar-1.13.7

./tools/node/node_modules/.bin/asar extract \
  extracted/appimage-1.13.7/squashfs-root/resources/app.asar \
  extracted/asar-1.13.7/app-bootstrap

./tools/node/node_modules/.bin/asar extract \
  extracted/appimage-1.13.7/squashfs-root/resources/obsidian.asar \
  extracted/asar-1.13.7/app-1.13.7
</code></pre>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="189" data-origin-width="1509"><span data-phocus="https://blog.kakaocdn.net/dna/cKz9l2/dJMcabF313B/AAAAAAAAAAAAAAAAAAAAAAaQ9RHkQao7pYvUtxjgVDAax5JEWKNYs3g12sSplZx6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=OFuCj52K7%2FYUx2ahdXK0iIDUsD0%3D" data-url="https://blog.kakaocdn.net/dna/cKz9l2/dJMcabF313B/AAAAAAAAAAAAAAAAAAAAAAaQ9RHkQao7pYvUtxjgVDAax5JEWKNYs3g12sSplZx6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=OFuCj52K7%2FYUx2ahdXK0iIDUsD0%3D"><img data-filename="blob" data-origin-height="189" data-origin-width="1509" height="189" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cKz9l2/dJMcabF313B/AAAAAAAAAAAAAAAAAAAAAAaQ9RHkQao7pYvUtxjgVDAax5JEWKNYs3g12sSplZx6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=OFuCj52K7%2FYUx2ahdXK0iIDUsD0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcKz9l2%2FdJMcabF313B%2FAAAAAAAAAAAAAAAAAAAAAAaQ9RHkQao7pYvUtxjgVDAax5JEWKNYs3g12sSplZx6%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DOFuCj52K7%252FYUx2ahdXK0iIDUsD0%253D" width="1509"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">먼저 <code>package.json</code>부터 확인했다.</p>
<pre class="angelscript"><code>python3 -m json.tool extracted/asar-1.13.7/app-bootstrap/package.json
python3 -m json.tool extracted/asar-1.13.7/app-1.13.7/package.json
</code></pre>
<p data-ke-size="size16"><code>app.asar</code>의 package 정보에서 핵심 값은 다음과 같았다.</p>
<pre class="json"><code>{
  "name": "obsidian",
  "version": "1.13.7",
  "license": "UNLICENSED",
  "private": true,
  "main": "main.js"
}
</code></pre>
<p data-ke-size="size16">반면 <code>obsidian.asar</code>는 다음과 같았다.</p>
<pre class="json"><code>{
  "name": "obsidian-dev",
  "version": "1.13.7",
  "license": "UNLICENSED",
  "private": true,
  "main": "index.js"
}
</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">  여기에는 <code>main</code>이 <code>index.js</code>라고 적혀 있었지만 추출된 package의 top-level에는 <code>index.js</code>가 없었다. 실제 실행 경로를 다시 확인해보니 bootstrap의 <code>loadApp()</code>이 <code>package.json</code>의 <code>main</code> 값을 사용하는 것이 아니라 <code>obsidian.asar/main.js</code>를 직접 <code>require()</code>하고 있었다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">-&gt; 조금 더 풀어서 생각해보면, </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Node.js에서는 보통 Package.json이라는 설정 파일이 있고 </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">{ <br/>  "name": "obsidian-dev", <br/>  "version": "1.13.7", <br/>  "main": "index.js" <br/>}</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">보통 이런 형식으로 적는 다고 하면, 진입점으로 사용할 파일이 injex.js라는 뜻이구나 라고 생각을 할 수 있는데 실제로 보면 Obsidian은 inex.js가 없었다는 것이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그러면 어떻게 정상 실행이 되는 것 일까.. ?  이 때 보는 것이 bootstrap이다.  </p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span><span>app.asar</span></span></td>
<td><span><span>Obsidian을 </span><span>시작하는 </span><span>부트스트랩(로더)</span></span></td>
</tr>
<tr>
<td><span><span>obsidian.asar</span></span></td>
<td><span><span>실제 </span><span>Obsidian의 </span><span>기능과 </span><span>코드</span></span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Obsidian은 실제 프로그램을 곧바로 실행하는 구조가 아닌, 작은 부트스트랩이 먼저 실행되고 거기서 실제 프로그램을 불러오는 구조이다. </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="730" data-origin-width="1540"><span data-phocus="https://blog.kakaocdn.net/dna/dkwkZv/dJMcaik16lb/AAAAAAAAAAAAAAAAAAAAAFHsIgTZ4QqHiSSxjp094HHTQQV6-qeNE0mlRQyHftrV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=QMZvNG8ibRiFzPkutnIHq7oe6tE%3D" data-url="https://blog.kakaocdn.net/dna/dkwkZv/dJMcaik16lb/AAAAAAAAAAAAAAAAAAAAAFHsIgTZ4QqHiSSxjp094HHTQQV6-qeNE0mlRQyHftrV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=QMZvNG8ibRiFzPkutnIHq7oe6tE%3D"><img data-origin-height="730" data-origin-width="1540" height="730" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/dkwkZv/dJMcaik16lb/AAAAAAAAAAAAAAAAAAAAAFHsIgTZ4QqHiSSxjp094HHTQQV6-qeNE0mlRQyHftrV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=QMZvNG8ibRiFzPkutnIHq7oe6tE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdkwkZv%2FdJMcaik16lb%2FAAAAAAAAAAAAAAAAAAAAAFHsIgTZ4QqHiSSxjp094HHTQQV6-qeNE0mlRQyHftrV%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DQMZvNG8ibRiFzPkutnIHq7oe6tE%253D" width="1540"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">2.8 두 ASAR는 구체적으로 무슨 역할을 할까?</h3>
<p data-ke-size="size16"><code>app.asar</code>의 <code>main.js</code>는 약 13KB였다. 내용을 읽어보면 Obsidian update package를 검증하고, 최종적으로 <code>obsidian.asar/main.js</code>를 <code>require()</code>하여 실행하는 bootstrap 역할을 했다.</p>
<pre class="javascript"><code>function loadApp(asarPath) {
  let main = path.join(asarPath, "main.js");
  let fn = require(main);
  fn(asarPath, updateEvents);
}
</code></pre>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="393" data-origin-width="1524"><span data-phocus="https://blog.kakaocdn.net/dna/bS3p80/dJMcafonRGW/AAAAAAAAAAAAAAAAAAAAAKwkLUXUJM6bJeb9Z0YDXtp0RBGgOsy4FKgGkrmqDAG_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=G2XRaBby01wx6Z%2BFFM4UU4glkM0%3D" data-url="https://blog.kakaocdn.net/dna/bS3p80/dJMcafonRGW/AAAAAAAAAAAAAAAAAAAAAKwkLUXUJM6bJeb9Z0YDXtp0RBGgOsy4FKgGkrmqDAG_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=G2XRaBby01wx6Z%2BFFM4UU4glkM0%3D"><img data-filename="blob" data-origin-height="393" data-origin-width="1524" height="393" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bS3p80/dJMcafonRGW/AAAAAAAAAAAAAAAAAAAAAKwkLUXUJM6bJeb9Z0YDXtp0RBGgOsy4FKgGkrmqDAG_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=G2XRaBby01wx6Z%2BFFM4UU4glkM0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbS3p80%2FdJMcafonRGW%2FAAAAAAAAAAAAAAAAAAAAAKwkLUXUJM6bJeb9Z0YDXtp0RBGgOsy4FKgGkrmqDAG_%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DG2XRaBby01wx6Z%252BFFM4UU4glkM0%253D" width="1524"/></span></figure>
</p>
<p data-ke-size="size16">반면 <code>obsidian.asar</code>에는 다음과 같은 파일이 들어 있었다.</p>
<pre class="css"><code>main.js       약 200KB
app.js        약 3.9MB
app.css       약 637KB
index.html
starter.js
worker.js
i18n.js
</code></pre>
<p data-ke-size="size16">여기서 역할을 다음과 같이 나눌 수 있었다.</p>
<pre class="stata"><code>app.asar/main.js
    ↓
update와 실제 package loading을 담당하는 bootstrap

obsidian.asar/main.js
    ↓
Electron main process, BrowserWindow, protocol, IPC 처리

obsidian.asar/app.js
    ↓
Vault, editor, workspace, Plugin, 화면 UI를 포함한 renderer application
</code></pre>
<p data-ke-size="size16">이제 분석 대상이 조금 줄어들었다!!!.. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">처음부터 211MB ELF 전체를 보는 대신, 약 200KB의 <code>main.js</code>에서 Electron의 권한 경계를 먼저 확인하고, 이후 약 3.9MB의 <code>app.js</code>에서 공격자가 전달할 수 있는 Vault가 어떻게 처리되는지를 확인하면 된다.</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">2.9 그렇다면 왜? main.js부터 보는가?</h3>
<p data-ke-size="size16"><code>app.js</code>가 더 크고 실제 기능도 많지만 먼저 <code>main.js</code>를 보기로 했다. Electron의 main process는 창을 만들고, file이나 network에 접근하고, renderer의 요청을 받아주는 권한이 높은 영역이기 때문이다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">먼저 확인해야 하는 것들은 아래와 같음. </p>
<pre class="yaml"><code>1. Renderer에 Node.js 권한이 있는가?
2. contextIsolation과 sandbox는 어떻게 설정되어 있는가?
3. obsidian: 또는 app: protocol은 어떤 검증을 거치는가?
4. Renderer가 main process에 보낼 수 있는 IPC에는 무엇이 있는가?
5. 외부 URL과 새 창은 어떤 조건에서 허용되는가?
</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이 질문에 대한 답을 알아야 <code>app.js</code>에서 script injection이나 잘못된 URL 처리를 찾았을 때 실제 영향이 어디까지 이어지는지 판단할 수 있다.</p>
<p data-ke-size="size16">예를 들어 renderer가 완전히 sandbox되어 있다면 JavaScript가 실행돼도 바로 local file 접근으로 이어지지는 않는다. 반대로 Node.js 권한이 있거나 검증이 약한 IPC가 있다면 같은 JavaScript 실행이라도 desktop application 권한으로 이어질 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그래서 분석 순서를 다음과 같이 잡았다.</p>
<pre class="ada"><code>AppRun으로 실행 흐름 확인
    ↓
app.asar에서 package loading 과정 확인
    ↓
obsidian.asar/main.js에서 Electron 보안 경계 확인
    ↓
obsidian.asar/app.js에서 Vault 입력 처리 확인
    ↓
의심되는 source와 sink가 연결되면 clean profile에서 동적 검증
    ↓
JavaScript만으로 설명되지 않는 부분이 나오면 native ELF 분석
</code></pre>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">3. 3.9MB짜리 bundle에서 어디부터 봐야 할까?</h2>
<p data-ke-size="size16">이제 <code>obsidian.asar/app.js</code>를 열어보면 되는데, 문제가 하나 있었다. 압축이 풀린 JavaScript라고 해서 바로 읽기 좋은 source code가 되는 것은 아니었다.</p>
<p data-ke-size="size16">배포용 bundle은 변수 이름이 짧아져 있었고 여러 module이 하나로 합쳐져 있었다. 줄바꿈도 거의 없어서 editor로 열어도 한 줄이 몇 MB씩 이어졌다. 이런 파일을 첫 줄부터 끝까지 읽는 것은 분석이라기보다 버티기에 가까웠다.</p>
<p data-ke-size="size16">그래서 원본 파일은 그대로 보존하고 복사본만 Prettier로 정리했다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Prettier는, 복잡하게 작성된 코드를 사람이 읽기 좋게 정리해 주는 도구!. </p>
<p data-ke-size="size16">-&gt; Obsidian은 JavaSrcpit 배포 과정에서 크기를 줄이기 위해서 압축되어 있기 때문에 </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">요런 것들을 </p>
<p data-ke-size="size16">function a(b){if(b){console.log("Hello")}else{console.log("Bye")}}</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이렇게 보기 쉽게 바꿔준다</p>
<p data-ke-size="size16">function a(b) { <br/>  if (b) { <br/>    console.log("Hello"); <br/>  } else { <br/>    console.log("Bye"); <br/>  } <br/>}</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<pre class="angelscript"><code>mkdir -p analysis

npx --yes prettier@3.6.2 \
  extracted/asar-1.13.7/app-1.13.7/app.js \
  &gt; analysis/app.pretty.js

npx --yes prettier@3.6.2 \
  extracted/asar-1.13.7/app-1.13.7/main.js \
  &gt; analysis/main.pretty.js
</code></pre>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="202" data-origin-width="1445"><span data-phocus="https://blog.kakaocdn.net/dna/bPbbA8/dJMcagHCkKg/AAAAAAAAAAAAAAAAAAAAANx2vdSe3V6gp3w17ws4emBY8A_X4R3WMKvCMEesEqnw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=J%2FJbd7iX7nKpHlJAy75gFIM1nk0%3D" data-url="https://blog.kakaocdn.net/dna/bPbbA8/dJMcagHCkKg/AAAAAAAAAAAAAAAAAAAAANx2vdSe3V6gp3w17ws4emBY8A_X4R3WMKvCMEesEqnw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=J%2FJbd7iX7nKpHlJAy75gFIM1nk0%3D"><img data-filename="blob" data-origin-height="202" data-origin-width="1445" height="202" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bPbbA8/dJMcagHCkKg/AAAAAAAAAAAAAAAAAAAAANx2vdSe3V6gp3w17ws4emBY8A_X4R3WMKvCMEesEqnw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=J%2FJbd7iX7nKpHlJAy75gFIM1nk0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbPbbA8%2FdJMcagHCkKg%2FAAAAAAAAAAAAAAAAAAAAANx2vdSe3V6gp3w17ws4emBY8A_X4R3WMKvCMEesEqnw%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DJ%252FJbd7iX7nKpHlJAy75gFIM1nk0%253D" width="1445"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">3.1 일단 공격자가 넣을 수 있는 것부터 정리했다</h3>
<p data-ke-size="size16">큰 bundle에서 무작정 <code>eval</code>, <code>exec</code>, <code>require</code>만 검색하면 결과가 너무 많이 나온기 때문에 code보다 먼저 Obsidian의 입력 구조를 생각해봤다. 처음에는 Vault를 Markdown 파일이 모여 있는 directory 정도로만 생각했다. 하지만 실제 Vault에는 <code>.obsidian</code>이라는 설정 directory도 함께 들어간다.</p>
<pre class="stylus"><code>example-vault/
├── README.md
└── .obsidian/
    ├── app.json
    ├── appearance.json
    ├── workspace.json
    ├── community-plugins.json
    ├── snippets/
    └── plugins/
</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">공격자가 ZIP으로 Vault 전체를 전달한다고 가정하면 Markdown만 제어하는 것이 아니었다. 숨김 directory까지 포함한 여러 설정 파일을 같이 전달할 수 있었다.</p>
<table data-ke-align="alignLeft" style="height: 155px;">
<thead>
<tr style="height: 23px;">
<th style="height: 23px;">입력</th>
<th style="height: 23px;">공격자가 Vault에 포함 가능</th>
<th style="height: 23px;">Obsidian에서 하는 일</th>
<th style="height: 23px;">처음 예상한 위험</th>
</tr>
</thead>
<tbody>
<tr style="height: 22px;">
<td style="height: 22px;"><code>*.md</code></td>
<td style="height: 22px;">가능</td>
<td style="height: 22px;">note 본문 표시</td>
<td style="height: 22px;">HTML/URL 처리</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>appearance.json</code></td>
<td style="height: 22px;">가능</td>
<td style="height: 22px;">theme과 CSS snippet 설정</td>
<td style="height: 22px;">화면 style 변경</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>workspace.json</code></td>
<td style="height: 22px;">가능</td>
<td style="height: 22px;">tab과 Web Viewer 상태 복원</td>
<td style="height: 22px;">시작 시 URL load</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>snippets/*.css</code></td>
<td style="height: 22px;">가능</td>
<td style="height: 22px;">Vault UI에 CSS 적용</td>
<td style="height: 22px;">UI redress</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>community-plugins.json</code></td>
<td style="height: 22px;">가능</td>
<td style="height: 22px;">활성 Plugin ID 목록</td>
<td style="height: 22px;">Plugin 실행 시도</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>plugins/*/main.js</code></td>
<td style="height: 22px;">가능</td>
<td style="height: 22px;">Community Plugin code</td>
<td style="height: 22px;">desktop 권한 code 실행</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">여기서 중요한 것은 파일을 포함할 수 있다는 것만이 아니라 각 파일이 사용자가 Vault를 신뢰하기 전과 후 중 언제 처리되는 가이다. </p>
<h3 data-ke-size="size23">3.2 Community Plugin은 왜 중요한가?</h3>
<p data-ke-size="size16">Community Plugin은 일반 web page script와 권한이 다르다. Obsidian의 Plugin은 desktop application 안에서 실행되며 Node.js module을 사용할 수 있다. 따라서 Plugin code가 실행되면 local file 접근이나 network 요청 같은 동작까지 가능하다.</p>
<p data-ke-size="size16">물론 처음 보는 Vault에 Plugin이 들어 있다고 바로 실행되지는 않는다. Obsidian은 다음과 같은 trust prompt를 표시한다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="446" data-origin-width="570"><span data-phocus="https://blog.kakaocdn.net/dna/FNeCG/dJMcajjY9tB/AAAAAAAAAAAAAAAAAAAAAKgxmWsLPW86Dm2rBhyEJYwHnTbDW3ODLLK5Lj5o_W70/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=WVaZhp8BrfvRYkx0lMBqWpO71mA%3D" data-url="https://blog.kakaocdn.net/dna/FNeCG/dJMcajjY9tB/AAAAAAAAAAAAAAAAAAAAAKgxmWsLPW86Dm2rBhyEJYwHnTbDW3ODLLK5Lj5o_W70/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=WVaZhp8BrfvRYkx0lMBqWpO71mA%3D"><img data-origin-height="446" data-origin-width="570" height="446" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/FNeCG/dJMcajjY9tB/AAAAAAAAAAAAAAAAAAAAAKgxmWsLPW86Dm2rBhyEJYwHnTbDW3ODLLK5Lj5o_W70/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=WVaZhp8BrfvRYkx0lMBqWpO71mA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FFNeCG%2FdJMcajjY9tB%2FAAAAAAAAAAAAAAAAAAAAAKgxmWsLPW86Dm2rBhyEJYwHnTbDW3ODLLK5Lj5o_W70%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DWVaZhp8BrfvRYkx0lMBqWpO71mA%253D" width="570"/></span></figure>
</p>
<p data-ke-size="size16">정상적인 보안 흐름은 다음과 같아야 한다.</p>
<pre class="routeros"><code>외부에서 받은 Vault 열기
        ↓
Community Plugin 실행은 일단 차단
        ↓
신뢰 여부와 위험을 사용자에게 표시
        ↓
사용자가 명시적으로 승인
        ↓
그 뒤에 Plugin code 실행
</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이러한 프롬프트는 단순한 안내창이 아니고 Secuirty Boundary이기 때문에 이것과 관련된 조사를 조금 더 해보기로 했다.</p>
<p data-ke-size="size16">Vailt 안의 다른 설정과 Presentation resource도 신뢰 결정 전까지 같이 막힐까? 에 대한 생각도 (AI와 함께) 생각하게 되었다. </p>
<h3 data-ke-size="size23">3.3 문자열을 검색어로 사용한 이유</h3>
<p data-ke-size="size16">일단 우리가 Prettier로 JavaSrcipt를 읽기 좋게 했으니,, app.preety.js가 약 22만 6천 줄을 우리가 다 볼 수 없으니까, </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Obsidian은 플러그인을 어떻게 활성화할까?</p>
<p data-ke-size="size16">사용자가 플러그인을 신뢰한다고 결정한 정보는 어디에 저장할까?</p>
<p data-ke-size="size16">Vailt의 CSS 파일은 어떻게 적용될까?</p>
<p data-ke-size="size16">Electron의 강력한 기능을 호출하는 코드는 어디에 있을까?</p>
<p data-ke-size="size16">등의 의문점들을 해결할 수 있어야 한다.</p>
<p data-ke-size="size16"> </p>
<pre class="bash" data-ke-language="bash" data-ke-type="codeblock" id="code_1792824743035"><code>rg -n -m 5 'setEnable|enable-plugin-' analysis/app.pretty.js</code></pre>
<p data-ke-size="size16"> rg를 활용하여 파일 안에 특정 문자열을 검색하여 setEnable( <span>무언가를 </span><span>활성화하거나 </span><span>비활성화하는 </span><span>코드의 </span><span>후보</span> )과 enable-plugin-( <span>플러그인 </span><span>활성화 </span><span>또는 </span><span>신뢰 </span><span>상태와 </span><span>관련된 </span><span>저장 </span><span>키의 </span><span>후보</span> )등을 확인한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그리고 Electron 기능을 검색하여서 </p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>loadURL : 웹 페이지나 URL을 불러오는 기능</li>
<li>setWindowOpenHandler : 새 창을 여는 요청을 처리하는 기능</li>
<li>ExecuteJavaSript: 웹 콘텐츠에서 JavaSrcipt를 실행하는 기능</li>
</ul>
<p data-ke-size="size16"> </p>
<pre class="bash" data-ke-language="bash" data-ke-type="codeblock" id="code_1792824799191"><code>rg -n -m 8 \
  'loadURL|setWindowOpenHandler|executeJavaScript' \
  analysis/main.pretty.js</code></pre>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="313" data-origin-width="1351"><span data-phocus="https://blog.kakaocdn.net/dna/czWvdj/dJMcadRq2ml/AAAAAAAAAAAAAAAAAAAAACM34q8soNmEDWjD6Z0J69jx_EnBRkyohqnSlhDuxBBu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Bkb42RO%2Bs3vnvNUsf8Blt%2FcgGX4%3D" data-url="https://blog.kakaocdn.net/dna/czWvdj/dJMcadRq2ml/AAAAAAAAAAAAAAAAAAAAACM34q8soNmEDWjD6Z0J69jx_EnBRkyohqnSlhDuxBBu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Bkb42RO%2Bs3vnvNUsf8Blt%2FcgGX4%3D"><img data-filename="blob" data-origin-height="313" data-origin-width="1351" height="313" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/czWvdj/dJMcadRq2ml/AAAAAAAAAAAAAAAAAAAAACM34q8soNmEDWjD6Z0J69jx_EnBRkyohqnSlhDuxBBu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Bkb42RO%2Bs3vnvNUsf8Blt%2FcgGX4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FczWvdj%2FdJMcadRq2ml%2FAAAAAAAAAAAAAAAAAAAAACM34q8soNmEDWjD6Z0J69jx_EnBRkyohqnSlhDuxBBu%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DBkb42RO%252Bs3vnvNUsf8Blt%252FcgGX4%253D" width="1351"/></span></figure>
</p>
<p data-ke-size="size16"> 일단은 중요하다고 생각하는 검색어를 고르고, 해당 검색어를 검색했다. 추가적으로 검색어를 고른 이유는 아래와 같음.</p>
<table data-ke-align="alignLeft" style="height: 199px;">
<thead>
<tr style="height: 23px;">
<th style="height: 23px;">검색</th>
<th style="height: 23px;">확인하려던 질문</th>
</tr>
</thead>
<tbody>
<tr style="height: 22px;">
<td style="height: 22px;"><code>enabledCssSnippets</code></td>
<td style="height: 22px;">Vault가 지정한 CSS를 어디에서 읽는가?</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>community-plugins</code></td>
<td style="height: 22px;">Vault가 포함한 Plugin 목록을 언제 읽는가?</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;">trust prompt 문구</td>
<td style="height: 22px;">보안 경고창을 어떤 code가 만드는가?</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>setEnable</code></td>
<td style="height: 22px;">승인 button 뒤에 어떤 상태 변경이 연결되는가?</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>enable-plugin-</code></td>
<td style="height: 22px;">실제 trust 값은 어디에 저장되는가?</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>loadURL</code></td>
<td style="height: 22px;">Vault의 URL이 별도 WebContents로 전달되는가?</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>setWindowOpenHandler</code></td>
<td style="height: 22px;">popup과 외부 창을 어떻게 제한하는가?</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px;"><code>executeJavaScript</code></td>
<td style="height: 22px;">web content와 높은 권한 code가 이어지는가?</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 후에.,.</p>
<pre class="bash" data-ke-language="bash" data-ke-type="codeblock" id="code_1792824922023"><code>rg -n -m 3 'enabledCssSnippets' analysis/app.pretty.js</code></pre>
<p data-ke-size="size16">Obsidian에서 활성화된 CSS 스니펫 목록과 관련된 설정 이름을 확인하고</p>
<p data-ke-size="size16"> </p>
<pre class="bash" data-ke-language="bash" data-ke-type="codeblock" id="code_1792824942809"><code>rg -n -m 3 'community-plugins' analysis/app.pretty.js</code></pre>
<p data-ke-size="size16">커뮤니티 플러그인과 관련된 코드의 위치를 한번 또 찾아보고</p>
<p data-ke-size="size16"> </p>
<pre class="bash" data-ke-language="bash" data-ke-type="codeblock" id="code_1792824961567"><code>rg -n -m 3 \
  'mod-trust-folder|enable-plugin-' \
  analysis/app.pretty.js</code></pre>
<p data-ke-size="size16">신뢰 관련 UI 또는 상태 저장과 연결될 가능성이 있는 문자열을 검색한다 .</p>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="254" data-origin-width="1179"><span data-phocus="https://blog.kakaocdn.net/dna/bPPY54/dJMcafonRU1/AAAAAAAAAAAAAAAAAAAAAI_vVhHODVoS6V3WK7KDHR4RFvtQGj26W_ZRIwbm0dZn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=DSUlKFikC0WMcOTXb%2Fz4faSs%2Br8%3D" data-url="https://blog.kakaocdn.net/dna/bPPY54/dJMcafonRU1/AAAAAAAAAAAAAAAAAAAAAI_vVhHODVoS6V3WK7KDHR4RFvtQGj26W_ZRIwbm0dZn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=DSUlKFikC0WMcOTXb%2Fz4faSs%2Br8%3D"><img data-filename="blob" data-origin-height="254" data-origin-width="1179" height="254" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bPPY54/dJMcafonRU1/AAAAAAAAAAAAAAAAAAAAAI_vVhHODVoS6V3WK7KDHR4RFvtQGj26W_ZRIwbm0dZn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=DSUlKFikC0WMcOTXb%2Fz4faSs%2Br8%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbPPY54%2FdJMcafonRU1%2FAAAAAAAAAAAAAAAAAAAAAI_vVhHODVoS6V3WK7KDHR4RFvtQGj26W_ZRIwbm0dZn%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DDSUlKFikC0WMcOTXb%252Fz4faSs%252Br8%253D" width="1179"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일치한 줄 앞뒤를 넓혀 읽고, method가 속한 object와 caller를 따라갔다. 이 방법으로 3.9MB 전체를 순서대로 읽는 대신, 공격자 입력과 보안 경계에 관계된 함수부터 작은 조각으로 나눌 수 있었다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">여기까지는 우리가 이제 어디를 봐야하는지를 찾아보기 위해서 한 것이고, 이제부터 분석시작</p>
<h2 data-ke-size="size26">4. 정적 분석으로 startup 순서 복원하기</h2>
<h3 data-ke-size="size23">4.1 CSS snippet은 어디에 적용될까?</h3>
<p data-ke-size="size16"><code>enabledCssSnippets</code> 주변 을 따라가니 CSS manager가 다음 작업을 하고 있었다.</p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>Vault의 appearance 설정에서 활성 snippet 이름을 읽는다.</li>
<li><code>.obsidian/snippets</code> 아래의 CSS 파일을 읽는다.</li>
<li>활성화된 각 snippet을 <code>&lt;style&gt;</code> element로 만든다.</li>
<li>CSS text를 <code>textContent</code>에 넣어 renderer document에 추가한다.</li>
</ol>
<p data-ke-size="size16">읽기 쉽게 다시 쓴 pseudocode는 다음과 같다.</p>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="553" data-origin-width="982"><span data-phocus="https://blog.kakaocdn.net/dna/V1PDH/dJMcabTGFgl/AAAAAAAAAAAAAAAAAAAAAChG7-waH5BrYYy10lpLjwF4Y2lrKLv-_GgcnaTglfi1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=8AuYqbDhXpJkx0diiUYlnuIG4qU%3D" data-url="https://blog.kakaocdn.net/dna/V1PDH/dJMcabTGFgl/AAAAAAAAAAAAAAAAAAAAAChG7-waH5BrYYy10lpLjwF4Y2lrKLv-_GgcnaTglfi1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=8AuYqbDhXpJkx0diiUYlnuIG4qU%3D"><img data-filename="blob" data-origin-height="553" data-origin-width="982" height="553" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/V1PDH/dJMcabTGFgl/AAAAAAAAAAAAAAAAAAAAAChG7-waH5BrYYy10lpLjwF4Y2lrKLv-_GgcnaTglfi1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=8AuYqbDhXpJkx0diiUYlnuIG4qU%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FV1PDH%2FdJMcabTGFgl%2FAAAAAAAAAAAAAAAAAAAAAChG7-waH5BrYYy10lpLjwF4Y2lrKLv-_GgcnaTglfi1%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D8AuYqbDhXpJkx0diiUYlnuIG4qU%253D" width="982"/></span></figure>
</p>
<p data-ke-size="size16"> 가장 신경 쓰인 부분은 CSS가 note preview만 꾸미는 별도의 iframe에 들어가는 것이 아니었다는 점이다. Obsidian의 main renderer document에 <code>&lt;style&gt;</code>로 들어갔다.</p>
<p data-ke-size="size16">같은 document에 modal과 toolbar, setting 화면이 있다면 Vault CSS도 이 UI를 선택할 수 있다. 하지만 아직 실제 trust prompt보다 먼저 적용되는지는 확인되지 않았다.</p>
<p data-ke-size="size16">이 단계에서 확인된 것과 확인되지 않은 것을 분리했다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이번 분석에서 주목한 부분은 Obsidian의 CSS 스니펫이 적용되는 범위이다. CSS 스니펫이 별도의 독립된 iframe이 아닌 Obsidian의 메인 화면에 적용되는 경로를 확인하여서 사용자가 작성한 CSS 노트 내용뿐만 아니라 같은 문서에 존재하는 설정창이나 보안 경고창의 디자인에도 영향을 줄 가능성이 있다는 의미이다. 특히 커뮤니티 플러그인 실행 여부를 결정하는 신뢰 확인창까지 CSS의 영향을 받는다면 보안상 문제가 발생할 수 있다. </p>
<p data-ke-size="size16">-&gt; 일단 추가적인 확인이 필요함.. </p>
<pre class="erlang"><code>확인됨:
  Vault CSS가 main renderer document의 style element로 들어간다.

아직 미확인:
  처음 보는 Vault의 cold start에서 trust prompt보다 CSS가 먼저 적용된다.
  CSS가 trust modal의 실제 selector와 geometry를 바꿀 수 있다.
</code></pre>
<h3 data-ke-size="size23">4.2 Trust 값은 Vault 안에 저장되는 게 아니였다..?</h3>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="831" data-origin-width="1006"><span data-phocus="https://blog.kakaocdn.net/dna/l7Msc/dJMcadDLcH4/AAAAAAAAAAAAAAAAAAAAADaPlh8im1tpUNKfORI2yshxGZtF1QP_tVWYIKfHowtB/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=7tFIXGMENJS4hZqNX94S2teYx4A%3D" data-url="https://blog.kakaocdn.net/dna/l7Msc/dJMcadDLcH4/AAAAAAAAAAAAAAAAAAAAADaPlh8im1tpUNKfORI2yshxGZtF1QP_tVWYIKfHowtB/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=7tFIXGMENJS4hZqNX94S2teYx4A%3D"><img data-origin-height="831" data-origin-width="1006" height="831" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/l7Msc/dJMcadDLcH4/AAAAAAAAAAAAAAAAAAAAADaPlh8im1tpUNKfORI2yshxGZtF1QP_tVWYIKfHowtB/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=7tFIXGMENJS4hZqNX94S2teYx4A%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fl7Msc%2FdJMcadDLcH4%2FAAAAAAAAAAAAAAAAAAAAADaPlh8im1tpUNKfORI2yshxGZtF1QP_tVWYIKfHowtB%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D7tFIXGMENJS4hZqNX94S2teYx4A%253D" width="1006"/></span></figure>
</p>
<p data-ke-size="size16">다음에는 Plugin manager와 <code>enable-plugin-</code> 문자열을 따라갔다. 처음 의심한 것은 공격자가 Vault 설정 파일에 trust 값을 미리 <code>true</code>로 넣을 수 있는지였다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="255" data-origin-width="799"><span data-phocus="https://blog.kakaocdn.net/dna/cL9Z94/dJMcafWcwTB/AAAAAAAAAAAAAAAAAAAAADgSZetDadSkQzAsDXTWo2vTgGu0aqwUWJgsGQCov5Y5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=N%2FW3fELf7JOpL7naktD1S%2BsQnzU%3D" data-url="https://blog.kakaocdn.net/dna/cL9Z94/dJMcafWcwTB/AAAAAAAAAAAAAAAAAAAAADgSZetDadSkQzAsDXTWo2vTgGu0aqwUWJgsGQCov5Y5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=N%2FW3fELf7JOpL7naktD1S%2BsQnzU%3D"><img data-origin-height="255" data-origin-width="799" height="255" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cL9Z94/dJMcafWcwTB/AAAAAAAAAAAAAAAAAAAAADgSZetDadSkQzAsDXTWo2vTgGu0aqwUWJgsGQCov5Y5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=N%2FW3fELf7JOpL7naktD1S%2BsQnzU%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcL9Z94%2FdJMcafWcwTB%2FAAAAAAAAAAAAAAAAAAAAADgSZetDadSkQzAsDXTWo2vTgGu0aqwUWJgsGQCov5Y5%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DN%252FW3fELf7JOpL7naktD1S%252BsQnzU%253D" width="799"/></span></figure>
</p>
<p data-ke-size="size16">하지만 trust 값은 <code>.obsidian/*.json</code>에 저장되지 않았다. Application profile의 Chromium localStorage에 Vault별 key로 저장되고 있었다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="127" data-origin-width="1032"><span data-phocus="https://blog.kakaocdn.net/dna/bjXlH9/dJMcai6fO3U/AAAAAAAAAAAAAAAAAAAAAOeWniJN8_8VlBKgyeGicdindnehEAOXSMxwRfJDesIu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Ld1NrLgVatGckeKZbXSoCe4EBuw%3D" data-url="https://blog.kakaocdn.net/dna/bjXlH9/dJMcai6fO3U/AAAAAAAAAAAAAAAAAAAAAOeWniJN8_8VlBKgyeGicdindnehEAOXSMxwRfJDesIu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Ld1NrLgVatGckeKZbXSoCe4EBuw%3D"><img data-origin-height="127" data-origin-width="1032" height="127" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bjXlH9/dJMcai6fO3U/AAAAAAAAAAAAAAAAAAAAAOeWniJN8_8VlBKgyeGicdindnehEAOXSMxwRfJDesIu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Ld1NrLgVatGckeKZbXSoCe4EBuw%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbjXlH9%2FdJMcai6fO3U%2FAAAAAAAAAAAAAAAAAAAAAOeWniJN8_8VlBKgyeGicdindnehEAOXSMxwRfJDesIu%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DLd1NrLgVatGckeKZbXSoCe4EBuw%253D" width="1032"/></span></figure>
</p>
<pre class="jboss-cli"><code>Vault 내부, 공격자가 전달 가능:
  .obsidian/appearance.json
  .obsidian/community-plugins.json
  .obsidian/plugins/...

Application profile, Vault 밖에 존재:
  localStorage["enable-plugin-&lt;appId&gt;"]
</code></pre>
<p data-ke-size="size16"> 즉 crafted Vault만으로 이 값을 직접 <code>true</code>로 만드는 단순한 공격은 되지 않고 해당 부분은 정상적으로 분리되어 있었다.</p>
<p data-ke-size="size16">그 대신 trust 값이 없을 때 생성되는 modal code를 읽어보면.. </p>
<pre class="less"><code>if (vaultHasCommunityPlugins &amp;&amp; trustValueIsMissing) {
  showTrustDialog({
    safeAction: "Browse vault in Restricted Mode",
    positiveAction: "Trust author and enable plugins",
    onPositiveAction() {
      pluginManager.setEnable(true);
    },
  });
}
</code></pre>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="863" data-origin-width="1027"><span data-phocus="https://blog.kakaocdn.net/dna/bpXiFS/dJMcajjZamV/AAAAAAAAAAAAAAAAAAAAAP1jc4BRpEfyjQ_5NzkXCpA8Mw-BEae39wUvc4ic12Mq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ZBtGifw2Oe%2F7WQdhndDnh2wFXAk%3D" data-url="https://blog.kakaocdn.net/dna/bpXiFS/dJMcajjZamV/AAAAAAAAAAAAAAAAAAAAAP1jc4BRpEfyjQ_5NzkXCpA8Mw-BEae39wUvc4ic12Mq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ZBtGifw2Oe%2F7WQdhndDnh2wFXAk%3D"><img data-filename="blob" data-origin-height="863" data-origin-width="1027" height="863" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bpXiFS/dJMcajjZamV/AAAAAAAAAAAAAAAAAAAAAP1jc4BRpEfyjQ_5NzkXCpA8Mw-BEae39wUvc4ic12Mq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=ZBtGifw2Oe%2F7WQdhndDnh2wFXAk%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbpXiFS%2FdJMcajjZamV%2FAAAAAAAAAAAAAAAAAAAAAP1jc4BRpEfyjQ_5NzkXCpA8Mw-BEae39wUvc4ic12Mq%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DZBtGifw2Oe%252F7WQdhndDnh2wFXAk%253D" width="1027"/></span></figure>
</p>
<p data-ke-size="size16"> Positive button callback은 Plugin manager의 <code>setEnable(true)</code>로 직접 이어졌다. 그리고 trust modal은 operating system의 native dialog가 아니라 renderer DOM에 생성되는 일반 modal이었다.</p>
<p data-ke-size="size16">여기서 두 가지 사실이 연결되기 시작했다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 Trust prompt의 승인 버튼이 실제로 어떤 동작을 하는지 정의를 해보면</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">1. 사용자가 Trust Author and Enable Plugins 버튼을 누르면 해당 버튼에 연결된 Click callback이 실행되고</p>
<p data-ke-size="size16">2. 그 안에서 Plugin Maganger의 setEnable(true)가 호출된다.</p>
<p data-ke-size="size16">   이 함수는 현재 Vault의 trust 값을 applicaiton profile의 Local Stroage에 enable-plugin-&lt;appId&gt; = "ture"형태로 저장한 뒤, community-plugins.json에 등록된 Plugin의 JavaSrcipt를 load한다.  </p>
<p data-ke-size="size16">-&gt; 여기서 중요한 것은 Trust Proimpt가 Windows의 관리자 권한 요청창처럼 운영체제가 별도로 만드는 것이 아니라, Electron renderer안에 일반 HTML DOM element로 생성되어 있는 것.</p>
<p data-ke-size="size16">3. 그러면 Vault에서 가져온 CSS Snippet도 이와 동일한 renderer document에 적용된다는 것. </p>
<p data-ke-size="size16">4. 그러면!!! 공격자가 제공한 CSS 는 trust modal의 문구와 안전한 버튼을 숨기거나, Plugin 실행을 승인하는  positive button의 위치와 크기 투명도까지 변경할 수 있음.</p>
<p data-ke-size="size16">5. 실제로 Positive button을 투명하게 만든 뒤 화면 전체를 덮도록 배치하면!.. 실제 create new note 같은 일반 기능을 클릭했다고 생각하지만 실제 Click은 보이지 않는 승인 버튼에 전달된다.</p>
<p data-ke-size="size16">6. 그 결과 setEnable(true)가 실행되고 trust 값이 저장되면서 Vault에 포함된 Community Plugin이 load된다. 결국 핵심 문제는 승인 기능 자체가 아니라, 공격자가 제어하는 Vault CSS와 Plugin 실행 여부를 결정하는 보안 UI가 같은 DOM에 존재했다는 것이다.</p>
<p data-ke-size="size16"> </p>
<pre class="coffeescript"><code>Vault CSS가 들어가는 곳: main renderer document
Trust prompt가 만들어지는 곳: 같은 main renderer document
</code></pre>
<h3 data-ke-size="size23">4.3 두 기능의 startup 순서를 비교했다</h3>
<p data-ke-size="size16">각 함수가 파일의 어느 줄에 있는지만으로 실행 순서를 알 수는 없기 때문에 두 manager를 호출하는 startup code까지 올라갔다.</p>
<p data-ke-size="size16"> </p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>Bundle 위치</th>
<th>확인한 동작</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>app.pretty.js:64982-64988</code></td>
<td><code>enabledCssSnippets</code> 설정 읽기</td>
</tr>
<tr>
<td><code>app.pretty.js:65144-65189</code></td>
<td>snippet text를 읽고 <code>&lt;style&gt;</code> 삽입</td>
</tr>
<tr>
<td><code>app.pretty.js:223899</code></td>
<td>startup에서 <code>customCss.load()</code> 호출</td>
</tr>
<tr>
<td><code>app.pretty.js:224220-224223</code></td>
<td>그 뒤 Community Plugin 초기화</td>
</tr>
<tr>
<td><code>app.pretty.js:168829-168835</code></td>
<td>trust key가 없을 때 modal 열기</td>
</tr>
<tr>
<td><code>app.pretty.js:169535-169576</code></td>
<td>positive button과 <code>setEnable(true)</code> 연결</td>
</tr>
<tr>
<td><code>app.pretty.js:168687-168770</code></td>
<td>승인된 Plugin의 JavaScript load</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이를 동작 순서로 정리하면 다음과 같았다.</p>
<pre class="routeros"><code>Vault configuration 읽기
        ↓
appearance.json의 enabled CSS snippet 확인
        ↓
Vault CSS를 main renderer document에 삽입
        ↓
Community Plugin manager 초기화
        ↓
저장된 trust 값이 없으면 renderer DOM에 prompt 표시
        ↓
Positive button이 눌리면 trust 저장 후 Plugin load
</code></pre>
<p data-ke-size="size16"> 이 순서가 실제 runtime에서도 맞다면, 사용자가 Vault를 신뢰할지 결정하기 전에 그 Vault가 제공한 CSS가 보안 UI를 꾸밀 수 있었다.</p>
<h3 data-ke-size="size23">4.4 공격 가설 만들기..</h3>
<p data-ke-size="size16">처음부터 완성된 clickjacking payload를 만든 것은 아니다. 일단 다음 가설을 문장으로 만들었다.</p>
<pre class="armasm"><code>만약 신뢰되지 않은 Vault의 CSS가 Plugin trust prompt보다 먼저 적용되고,
두 요소가 같은 DOM에 존재한다면,
공격자는 경고 문구와 안전한 선택을 숨긴 뒤
승인 button의 위치와 hit area를 바꿀 수 있다.
</code></pre>
<p data-ke-size="size16">성공 조건도 미리 정했다.</p>
<pre class="erlang"><code>클릭 전:
  trust 값은 null이어야 한다.
  Plugin은 load되지 않아야 한다.
  Vault CSS는 이미 적용되어 있어야 한다.
  trust modal은 같은 document에 존재해야 한다.

클릭 후:
  실제 pointer input 하나로 trust가 true가 되어야 한다.
  Vault에 포함된 Plugin이 load되어야 한다.
  사용자가 보던 일반 기능은 실행되지 않아야 한다.
</code></pre>
<p data-ke-size="size16">정적 분석만으로 여기까지의 가설이 실제로 성립한다고 말할 수는 없었다. 실행 순서, CSS selector, browser hit testing은 application을 직접 실행해서 측정해야 했다.</p>
<h2 data-ke-size="size26">5. 그 전에 확인하고 제외한 가설들</h2>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span> 처음에는 Markdown이나 Web Viewer를 이용한 Script injection 가능성을 확인했지만 아래와 같이 실패한 부분들이 많았다.</span></p>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span>Markdown HTML event</span></td>
<td><span>차단됨</span></td>
<td><span>Sanitizer가 event attribute 제거</span></td>
</tr>
<tr>
<td><span>SVG, MathML, iframe</span></td>
<td><span>실행되지 않음</span></td>
<td><span>실행 가능한 element와 attribute가 남지 않음</span></td>
</tr>
<tr>
<td><span>javascript:, data: URL</span></td>
<td><span>제한된 context에서만 동작</span></td>
<td><span>Node.js 권한으로 연결되지 않음</span></td>
</tr>
<tr>
<td><span>Canvas, Mermaid</span></td>
<td><span>차단됨</span></td>
<td><span>URL 검사와 Sanitizer 적용</span></td>
</tr>
<tr>
<td><span>HTML file embed</span></td>
<td><span>Guest에서 실행</span></td>
<td><span>require와 process 사용 불가</span></td>
</tr>
<tr>
<td><span>Web Viewer clipboard</span></td>
<td><span>재현 불안정</span></td>
<td><span>Focus 조건 때문에 공격 chain 구성 실패</span></td>
</tr>
<tr>
<td><span>app:// path 처리</span></td>
<td><span>일부 file read 가능성 확인</span></td>
<td><span>공격자가 필요한 file을 생성할 방법이 없음</span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">6. 안전한 PoC Vault를 단계별로 만들기</h2>
<h3 data-ke-size="size23">6.1 처음부터 간단하게</h3>
<p data-ke-size="size16">먼저 benign CSS marker만 사용했다. Trust modal에 outline을 표시하고 custom property 하나를 넣었다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 처음에는 trust pormpt를 숨기거나 투명하게 하지는 않고, 사용자가 Valut를 신뢰하기 전에도 Vault 내부의 CSS가 Trust Prompt에 적용되는지를 확인하기로 !</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그리고 실험하기 위한 dir를 따로 두고, Community Plugin이 필요하기 때문에 테스트용 Plugin을 등록.</p>
<p data-ke-size="size16">그 이후에 </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="199" data-origin-width="1016"><span data-phocus="https://blog.kakaocdn.net/dna/vPXOL/dJMcaaUKy0p/AAAAAAAAAAAAAAAAAAAAAG6tXY1faIAD7RmxmrupXv9gOFFE_cXvGudQtvXd7QNA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=gBGpE16bSx3hqgvig5%2F%2FzER5r8Q%3D" data-url="https://blog.kakaocdn.net/dna/vPXOL/dJMcaaUKy0p/AAAAAAAAAAAAAAAAAAAAAG6tXY1faIAD7RmxmrupXv9gOFFE_cXvGudQtvXd7QNA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=gBGpE16bSx3hqgvig5%2F%2FzER5r8Q%3D"><img data-origin-height="199" data-origin-width="1016" height="199" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/vPXOL/dJMcaaUKy0p/AAAAAAAAAAAAAAAAAAAAAG6tXY1faIAD7RmxmrupXv9gOFFE_cXvGudQtvXd7QNA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=gBGpE16bSx3hqgvig5%2F%2FzER5r8Q%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FvPXOL%2FdJMcaaUKy0p%2FAAAAAAAAAAAAAAAAAAAAAG6tXY1faIAD7RmxmrupXv9gOFFE_cXvGudQtvXd7QNA%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DgBGpE16bSx3hqgvig5%252F%252FzER5r8Q%253D" width="1016"/></span></figure>
</p>
<pre class="css"><code>/* 첫 단계에서는 modal을 숨기지 않는다. */
.mod-trust-folder {
  --research-css-active: yes;
  outline: 4px solid magenta;
}
</code></pre>
<p data-ke-size="size16"><code>appearance.json</code>에서는 이 snippet을 활성화했다.</p>
<pre class="json"><code>{
  "enabledCssSnippets": ["research-trust"]
}
</code></pre>
<p data-ke-size="size16">이 단계에서 확인할 질문은 하나였다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Trust가 아직 null인데도 --research-css-active가 trust modal의 computed style에서 보이는가? </p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">6.2 실제 DOM을 보고 selector와 geometry를 확인했다</h3>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">6.1에서 만든 Vault를 Obsidian 1.13.7의 clean profile로 열었다. Trust prompt 주변에 분홍색 outline이 나타났지만, 이 화면만으로는 CSS가 정확히 어떤 element에 적용됐는지 알 수 없었다. 그래서 DevTools를 열고 trust prompt의 DOM을 직접 확인했다.</p>
<pre class="javascript" data-ke-language="javascript" data-ke-type="codeblock" id="code_1792829118809"><code>const modal = document.querySelector(".mod-trust-folder");
const buttons = [...modal.querySelectorAll("button")];

({
  trust: localStorage.getItem(
    `enable-plugin-${app.appId}`
  ),

  cssActive: getComputedStyle(modal)
    .getPropertyValue("--research-css-active")
    .trim(),

  modalRect: modal.getBoundingClientRect().toJSON(),

  buttons: buttons.map((button) =&gt; ({
    text: button.innerText,
    rect: button.getBoundingClientRect().toJSON(),
    opacity: getComputedStyle(button).opacity,
    pointerEvents: getComputedStyle(button).pointerEvents,
  })),
})</code></pre>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="109" data-origin-width="724"><span data-phocus="https://blog.kakaocdn.net/dna/bGkxp1/dJMcaiyDEPz/AAAAAAAAAAAAAAAAAAAAAHWdJAL5gWA9tUMui8JRGdldKiiRAPhwZa_9GVCODGrC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=PPwTH%2FhT%2BCvtmujoOAuL%2FI3pWoI%3D" data-url="https://blog.kakaocdn.net/dna/bGkxp1/dJMcaiyDEPz/AAAAAAAAAAAAAAAAAAAAAHWdJAL5gWA9tUMui8JRGdldKiiRAPhwZa_9GVCODGrC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=PPwTH%2FhT%2BCvtmujoOAuL%2FI3pWoI%3D"><img data-origin-height="109" data-origin-width="724" height="109" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bGkxp1/dJMcaiyDEPz/AAAAAAAAAAAAAAAAAAAAAHWdJAL5gWA9tUMui8JRGdldKiiRAPhwZa_9GVCODGrC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=PPwTH%2FhT%2BCvtmujoOAuL%2FI3pWoI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbGkxp1%2FdJMcaiyDEPz%2FAAAAAAAAAAAAAAAAAAAAAHWdJAL5gWA9tUMui8JRGdldKiiRAPhwZa_9GVCODGrC%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DPPwTH%252FhT%252BCvtmujoOAuL%252FI3pWoI%253D" width="724"/></span></figure>
</p>
<p data-ke-size="size16"><br/>결과에서 trust 값은 아직 null이었지만 cssActive는 "yes"이며 이는 사용자가 Vault의 Plugin 실행을 승인하기 전에 Vault에서 가져온 CSS가 이미 trust prompt에 적용됐다는 의미다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Trust Prompt는 operating system의 native dialog가 아닌 .mod-trust-folder class를 가진 일반 DOM Element이기 때문에 내부에 있는 Browse vault in Restricted Mode와 Trust author and enable plugins 버튼도 HTML button으로 들어가 있는 것이다. </p>
<p data-ke-size="size16"><br/>따라서 Vault CSS가 .mod-trust-folder와 내부 button을 선택할 수 있다면, 경고창의 표시 상태뿐 아니라 버튼의 크기와 위치, 투명도와 pointer event 처리까지 바꿀 가능성이 있다는 것을 확인</p>
<h3 data-ke-size="size23">6.3 PoC Vault의 구조</h3>
<p data-ke-size="size16">최종 실험용 Vault는 다음과 같이 구성했다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="268" data-origin-width="876"><span data-alt="실험을 위한 setup" data-phocus="https://blog.kakaocdn.net/dna/G6tPE/dJMcahfq7TM/AAAAAAAAAAAAAAAAAAAAAIWQX_GLsPDmZS_l1jMzk-npLygbYM41zbQxh5-5IRhR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=y60%2B1ZsIX8bS6IwtPOmhh0q%2FHUI%3D" data-url="https://blog.kakaocdn.net/dna/G6tPE/dJMcahfq7TM/AAAAAAAAAAAAAAAAAAAAAIWQX_GLsPDmZS_l1jMzk-npLygbYM41zbQxh5-5IRhR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=y60%2B1ZsIX8bS6IwtPOmhh0q%2FHUI%3D"><img data-origin-height="268" data-origin-width="876" height="268" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/G6tPE/dJMcahfq7TM/AAAAAAAAAAAAAAAAAAAAAIWQX_GLsPDmZS_l1jMzk-npLygbYM41zbQxh5-5IRhR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=y60%2B1ZsIX8bS6IwtPOmhh0q%2FHUI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FG6tPE%2FdJMcahfq7TM%2FAAAAAAAAAAAAAAAAAAAAAIWQX_GLsPDmZS_l1jMzk-npLygbYM41zbQxh5-5IRhR%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dy60%252B1ZsIX8bS6IwtPOmhh0q%252FHUI%253D" width="876"/></span><figcaption>실험을 위한 setup</figcaption>
</figure>
</p>
<pre class="stylus"><code>css-trust-chain-vault/
├── README.md
├── REPRODUCTION.md
└── .obsidian/
    ├── app.json
    ├── appearance.json
    ├── community-plugins.json
    ├── snippets/
    │   └── trust-ui-redress.css
    └── plugins/
        └── mission39-css-chain-marker/
            ├── manifest.json
            └── main.js
</code></pre>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">6.4 Shell 대신 JSON marker만 기록</h3>
<p data-ke-size="size16">실제 command를 실행하거나 개인 file을 읽을 필요는 없기 때문에 공격자가 넣은 Plugin이 Node.js 권한으로 실행됐다는 사실만 증명하면 된다. 그래서 Plugin은 <code>fs</code>, <code>os</code>, <code>path</code> module을 사용해 임시 directory에 JSON 하나만 작성!</p>
<pre class="javascript"><code>const { Plugin } = require("obsidian");
const fs = require("fs");
const os = require("os");
const path = require("path");

module.exports = class ResearchMarker extends Plugin {
  onload() {
    const markerPath = path.join(
      os.tmpdir(),
      "obsidian-css-trust-chain-marker.json",
    );

    fs.writeFileSync(
      markerPath,
      JSON.stringify(
        {
          loaded: true,
          pluginId: this.manifest.id,
          pid: process.pid,
          timestamp: new Date().toISOString(),
          markerPath,
        },
        null,
        2,
      ) + "\n",
    );
  }
};
</code></pre>
<p data-ke-size="size16">Marker가 생기면 다음 사실을 확인할 수 있다.</p>
<pre class="crmsh"><code>1. Vault에 포함된 Plugin JavaScript가 실제로 load됐다.
2. Plugin 안에서 Node.js require()가 동작했다.
3. Obsidian process 권한으로 local filesystem write가 실행됐다.
</code></pre>
<h2 data-ke-size="size26">7. 동적 분석 환경을 분리하기</h2>
<h3 data-ke-size="size23">7.1 Clean Profile 사용하기</h3>
<p data-ke-size="size16">평소 쓰던 Obsidian에는 이전에 열었던 Vault 정보와 trust 값이 남아 있고, 기존에 이미 신뢰한 Vault를 PoC로 열면 prompt가 나타나지 않는 것이 당연하므로 실험이 무의미해지기 때문에 깨끗한 Profile이 필요하다 </p>
<p data-ke-size="size16">그래서 <code>HOME</code>, XDG directory, Electron user-data와 임시 directory까지 별도로 만든다</p>
<pre class="routeros"><code>ROOT=/mnt/c/Users/user/obsidian-from-scratch
RUN=/home/user/obsidian-lab/run-vulnerable-01

mkdir -p \
  "$RUN/home" \
  "$RUN/profile" \
  "$RUN/xdg/config" \
  "$RUN/xdg/cache" \
  "$RUN/xdg/data" \
  "$RUN/xdg/state" \
  "$RUN/xdg/runtime" \
  "$RUN/tmp" \
  "$RUN/evidence"

chmod 700 "$RUN/xdg/runtime" "$RUN/tmp"
</code></pre>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="354" data-origin-width="1501"><span data-phocus="https://blog.kakaocdn.net/dna/XyQdh/dJMcacFe5G4/AAAAAAAAAAAAAAAAAAAAAFRhmsN32-1Euf3cFIGfAihZ7DS5x467HwkAtmyyqvOy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=veOiL5oWBW5wOodTpP%2BRTPEA0D0%3D" data-url="https://blog.kakaocdn.net/dna/XyQdh/dJMcacFe5G4/AAAAAAAAAAAAAAAAAAAAAFRhmsN32-1Euf3cFIGfAihZ7DS5x467HwkAtmyyqvOy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=veOiL5oWBW5wOodTpP%2BRTPEA0D0%3D"><img data-filename="blob" data-origin-height="354" data-origin-width="1501" height="354" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/XyQdh/dJMcacFe5G4/AAAAAAAAAAAAAAAAAAAAAFRhmsN32-1Euf3cFIGfAihZ7DS5x467HwkAtmyyqvOy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=veOiL5oWBW5wOodTpP%2BRTPEA0D0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FXyQdh%2FdJMcacFe5G4%2FAAAAAAAAAAAAAAAAAAAAAFRhmsN32-1Euf3cFIGfAihZ7DS5x467HwkAtmyyqvOy%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DveOiL5oWBW5wOodTpP%252BRTPEA0D0%253D" width="1501"/></span></figure>
</p>
<h3 data-ke-size="size23">7.2 Obsidian 1.13.7 실행</h3>
<p data-ke-size="size16">다음처럼 모든 상태 directory를 실험 directory로 지정하고 remote debugging은 외부에 노출되지 않도록 로컬에서만 실행</p>
<pre class="routeros"><code>env \
  HOME="$RUN/home" \
  XDG_CONFIG_HOME="$RUN/xdg/config" \
  XDG_CACHE_HOME="$RUN/xdg/cache" \
  XDG_DATA_HOME="$RUN/xdg/data" \
  XDG_STATE_HOME="$RUN/xdg/state" \
  XDG_RUNTIME_DIR="$RUN/xdg/runtime" \
  TMPDIR="$RUN/tmp" \
  "$ROOT/extracted/appimage-1.13.7/squashfs-root/AppRun" \
    --no-sandbox \
    --user-data-dir="$RUN/profile" \
    --remote-debugging-address=127.0.0.1 \
    --remote-debugging-port=9222 \
    --disable-gpu \
    &gt; "$RUN/evidence/obsidian.log" 2&gt;&amp;1 &amp;

OBSIDIAN_PID=$!
</code></pre>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="972" data-origin-width="1540"><span data-phocus="https://blog.kakaocdn.net/dna/bd6sJd/dJMcacrGd7L/AAAAAAAAAAAAAAAAAAAAAFTx7jLgcxwnVXTo2Lmvl3C-5flGmpSBK2kNrFE_BWpl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=wO%2BbKjsDdNNWYU%2FOm%2FsZBeYGKg4%3D" data-url="https://blog.kakaocdn.net/dna/bd6sJd/dJMcacrGd7L/AAAAAAAAAAAAAAAAAAAAAFTx7jLgcxwnVXTo2Lmvl3C-5flGmpSBK2kNrFE_BWpl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=wO%2BbKjsDdNNWYU%2FOm%2FsZBeYGKg4%3D"><img data-origin-height="972" data-origin-width="1540" height="972" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bd6sJd/dJMcacrGd7L/AAAAAAAAAAAAAAAAAAAAAFTx7jLgcxwnVXTo2Lmvl3C-5flGmpSBK2kNrFE_BWpl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=wO%2BbKjsDdNNWYU%2FOm%2FsZBeYGKg4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbd6sJd%2FdJMcacrGd7L%2FAAAAAAAAAAAAAAAAAAAAAFTx7jLgcxwnVXTo2Lmvl3C-5flGmpSBK2kNrFE_BWpl%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DwO%252BbKjsDdNNWYU%252FOm%252FsZBeYGKg4%253D" width="1540"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">7.3 굳이 button.click()을 실행하지 않는 이유?</h3>
<p data-ke-size="size16">Console에서 <code>button.click()</code>을 실행하면 공격은 쉽게 성공하지만 browser가 실제 mouse 위치를 계산해 만든 입력이 아니라 script가 직접 만든 synthetic click이기 때문에 ..</p>
<p data-ke-size="size16">Clickjacking에서 증명해야 하는 것은 사용자가 화면에서 일반 기능을 누를 때 browser hit testing 결과가 보이지 않는 승인 button으로 향한다는 점이라서, 다음과 같은 조건을 내세운다!</p>
<pre class="arduino"><code>DOM .click() 사용 안 함
viewport를 1024x800으로 고정
클릭 전 elementFromPoint() 결과 저장
CDP Input.dispatchMouseEvent로 mousePressed/mouseReleased 전송
취약 버전과 수정 버전에 같은 좌표 사용
</code></pre>
<h2 data-ke-size="size26">8. Obsidian 1.13.7에서 실제 재현하기</h2>
<h3 data-ke-size="size23">8.1 클릭 전 상태</h3>
<p data-ke-size="size16">Clean profile에서 crafted Vault를 처음 열었을 때 사용자 화면에는 평범한 empty Vault가 보인다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="800" data-origin-width="1024"><span data-phocus="https://blog.kakaocdn.net/dna/pmuQd/dJMb99VQJPh/AAAAAAAAAAAAAAAAAAAAAKVT9xTVqU8SBhDCrtB-4wLs2s4W0GKukENzRMicdA0I/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Klp2ov1OmcVUQ%2BKzSwrt6eKErlM%3D" data-url="https://blog.kakaocdn.net/dna/pmuQd/dJMb99VQJPh/AAAAAAAAAAAAAAAAAAAAAKVT9xTVqU8SBhDCrtB-4wLs2s4W0GKukENzRMicdA0I/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Klp2ov1OmcVUQ%2BKzSwrt6eKErlM%3D"><img data-origin-height="800" data-origin-width="1024" height="800" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/pmuQd/dJMb99VQJPh/AAAAAAAAAAAAAAAAAAAAAKVT9xTVqU8SBhDCrtB-4wLs2s4W0GKukENzRMicdA0I/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Klp2ov1OmcVUQ%2BKzSwrt6eKErlM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FpmuQd%2FdJMb99VQJPh%2FAAAAAAAAAAAAAAAAAAAAAKVT9xTVqU8SBhDCrtB-4wLs2s4W0GKukENzRMicdA0I%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DKlp2ov1OmcVUQ%252BKzSwrt6eKErlM%253D" width="1024"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">하지만 DOM과 application state를 측정하면 다음과 같음!</p>
<pre class="json"><code>{
  "appId": "cssfinaltest",
  "trust": null,
  "loadedPlugins": [],
  "cssActive": "yes",
  "trustModal": {
    "width": "0px",
    "background": "rgba(0, 0, 0, 0)"
  },
  "backdropOpacity": "0",
  "positiveButton": {
    "text": "Trust author and enable plugins",
    "rect": {
      "x": 0,
      "y": 0,
      "width": 1024,
      "height": 800
    },
    "opacity": "0"
  },
  "centerHitTarget": "Trust author and enable plugins",
  "viewport": {
    "width": 1024,
    "height": 800
  },
  "markerExists": false
}
</code></pre>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="574" data-origin-width="1238"><span data-phocus="https://blog.kakaocdn.net/dna/cMCokn/dJMcafonTZo/AAAAAAAAAAAAAAAAAAAAAM9OF0W7YqEvxEqLt4blLZX8t36rPnyEO6_tNo9vY7W3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=BLj%2FX%2FBhYnXyCZZMpbmPDszT2M0%3D" data-url="https://blog.kakaocdn.net/dna/cMCokn/dJMcafonTZo/AAAAAAAAAAAAAAAAAAAAAM9OF0W7YqEvxEqLt4blLZX8t36rPnyEO6_tNo9vY7W3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=BLj%2FX%2FBhYnXyCZZMpbmPDszT2M0%3D"><img data-filename="blob" data-origin-height="574" data-origin-width="1238" height="574" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cMCokn/dJMcafonTZo/AAAAAAAAAAAAAAAAAAAAAM9OF0W7YqEvxEqLt4blLZX8t36rPnyEO6_tNo9vY7W3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=BLj%2FX%2FBhYnXyCZZMpbmPDszT2M0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcMCokn%2FdJMcafonTZo%2FAAAAAAAAAAAAAAAAAAAAAM9OF0W7YqEvxEqLt4blLZX8t36rPnyEO6_tNo9vY7W3%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DBLj%252FX%252FBhYnXyCZZMpbmPDszT2M0%253D" width="1238"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">각 값의 의미는?</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>관찰값</th>
<th>해석</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>trust: null</code></td>
<td>사용자는 아직 Vault를 승인하지 않았다.</td>
</tr>
<tr>
<td><code>loadedPlugins: []</code></td>
<td>Plugin code는 아직 실행되지 않았다.</td>
</tr>
<tr>
<td><code>cssActive: yes</code></td>
<td>그런데 Vault CSS는 이미 적용됐다.</td>
</tr>
<tr>
<td><code>backdropOpacity: 0</code></td>
<td>경고창 배경은 완전히 투명해졌다.</td>
</tr>
<tr>
<td>button <code>1024x800</code></td>
<td>Positive button이 viewport 전체를 덮었다.</td>
</tr>
<tr>
<td><code>centerHitTarget</code></td>
<td>화면 중앙의 실제 click 대상은 승인 button이었다.</td>
</tr>
<tr>
<td><code>markerExists: false</code></td>
<td>클릭 전에는 marker가 없어 단계가 분리됐다.</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">즉 화면상으로는 <code>Create new note</code>가 보이지만, 같은 좌표에서 pointer event를 받는 element는 <code>Trust author and enable plugins</code>였다.</p>
<h3 data-ke-size="size23">8.2 실제 mouse event 한 번 전송</h3>
<p data-ke-size="size16">취약 버전의 화면에서 <code>Create new note</code>가 보이는 <code>(660, 394)</code> 좌표를 사용하여서 event를 전송해본다면?</p>
<pre class="json"><code>{
  "id": 1,
  "method": "Input.dispatchMouseEvent",
  "params": {
    "type": "mousePressed",
    "x": 660,
    "y": 394,
    "button": "left",
    "clickCount": 1
  }
}
</code></pre>
<p data-ke-size="size16">그다음 같은 좌표에 <code>type</code>만 <code>mouseReleased</code>로 바꿔 전송했다.</p>
<pre class="routeros"><code>사용자에게 보이는 대상: Create new note
elementFromPoint의 대상: Trust author and enable plugins
입력 방식: CDP를 통한 mousePressed + mouseReleased
입력 횟수: 1회
</code></pre>
<h3 data-ke-size="size23">8.3 클릭 후 상태</h3>
<p data-ke-size="size16">클릭 직후 저장한 결과는 다음과 같았다.</p>
<pre class="json"><code>{
  "trust": "true",
  "enabledPlugins": [
    "mission39-css-chain-marker"
  ],
  "loadedPlugins": [
    "mission39-css-chain-marker"
  ],
  "trustModalCount": 0,
  "activeLeafType": "empty",
  "marker": {
    "loaded": true,
    "pluginId": "mission39-css-chain-marker",
    "pid": 2984524,
    "markerPath": "/tmp/obsidian-css-trust-chain-marker.json",
    "timestamp": "2026-09-22T16:14:02.709Z"
  }
}
</code></pre>
<p><figure class="imageblock alignCenter" data-filename="blob" data-ke-mobilestyle="widthOrigin" data-origin-height="483" data-origin-width="1235"><span data-phocus="https://blog.kakaocdn.net/dna/k4PjA/dJMcajxwY5J/AAAAAAAAAAAAAAAAAAAAAHKMpQkYko0a62V5sw2_mKNMu8w9kp7wQdjSKgYlt_Px/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=WLzQQetgLxNeN26ThJkKAPKd4FE%3D" data-url="https://blog.kakaocdn.net/dna/k4PjA/dJMcajxwY5J/AAAAAAAAAAAAAAAAAAAAAHKMpQkYko0a62V5sw2_mKNMu8w9kp7wQdjSKgYlt_Px/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=WLzQQetgLxNeN26ThJkKAPKd4FE%3D"><img data-filename="blob" data-origin-height="483" data-origin-width="1235" height="483" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/k4PjA/dJMcajxwY5J/AAAAAAAAAAAAAAAAAAAAAHKMpQkYko0a62V5sw2_mKNMu8w9kp7wQdjSKgYlt_Px/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=WLzQQetgLxNeN26ThJkKAPKd4FE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fk4PjA%2FdJMcajxwY5J%2FAAAAAAAAAAAAAAAAAAAAAHKMpQkYko0a62V5sw2_mKNMu8w9kp7wQdjSKgYlt_Px%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DWLzQQetgLxNeN26ThJkKAPKd4FE%253D" width="1235"/></span></figure>
</p>
<p data-ke-size="size16">trust가 문자열 "true"로 저장됐고 marker Plugin이 load됐지만 activeLeafType은 여전히 empty이다.</p>
<p data-ke-size="size16">사용자가 보고 있던 Create new note 기능 자체가 사용되었지 않았다!</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="800" data-origin-width="1024"><span data-phocus="https://blog.kakaocdn.net/dna/bH2wcX/dJMcaggmKOj/AAAAAAAAAAAAAAAAAAAAAD7JGCQJuNleZKv3C4uRWVwzC00UxNdyPxMXX_V-enQt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=4viz3afY%2FdYJ4Nv5s26SmwXf7Qg%3D" data-url="https://blog.kakaocdn.net/dna/bH2wcX/dJMcaggmKOj/AAAAAAAAAAAAAAAAAAAAAD7JGCQJuNleZKv3C4uRWVwzC00UxNdyPxMXX_V-enQt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=4viz3afY%2FdYJ4Nv5s26SmwXf7Qg%3D"><img data-origin-height="800" data-origin-width="1024" height="800" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bH2wcX/dJMcaggmKOj/AAAAAAAAAAAAAAAAAAAAAD7JGCQJuNleZKv3C4uRWVwzC00UxNdyPxMXX_V-enQt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=4viz3afY%2FdYJ4Nv5s26SmwXf7Qg%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbH2wcX%2FdJMcaggmKOj%2FAAAAAAAAAAAAAAAAAAAAAD7JGCQJuNleZKv3C4uRWVwzC00UxNdyPxMXX_V-enQt%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D4viz3afY%252FdYJ4Nv5s26SmwXf7Qg%253D" width="1024"/></span></figure>
</p>
<p data-ke-size="size16">화면상으로 큰 변화가 없어서 사용자는 자신이 Plugin 실행을 승인했다는 사실을 알아차리기 어려웠다.</p>
<h3 data-ke-size="size23">8.4 재실행 후에도 유지되는가?</h3>
<p data-ke-size="size16">한 번의 click으로 끝나는지, 다음 실행에도 영향을 주는지도 확인했다. Obsidian을 정상 종료하고 같은 profile과 Vault로 다시 실행했다.</p>
<p data-ke-size="size16">두 번째 실행에서는 다음 결과가 나왔다.</p>
<pre class="yaml"><code>trust prompt: 다시 나타나지 않음
stored trust: true 유지
Plugin: startup 과정에서 자동 load
marker PID: 새 process PID로 변경
marker timestamp: 두 번째 실행 시각으로 갱신
</code></pre>
<p data-ke-size="size16">이는 첫 click으로 만들어진 trust 결정이 profile에 저장됐고, 같은 Vault를 다시 열면 추가 경고 없이 Plugin이 자동 실행된다는 뜻이었다.</p>
<h2 data-ke-size="size26">9. Root Cause를 한 문장으로 정리하기</h2>
<blockquote data-ke-style="style1">
<p data-ke-size="size16">신뢰되지 않은 Vault의 presentation resource가 그 Vault를 신뢰할지 결정하는 security UI보다 먼저, 같은 DOM에 적용됐다.</p>
</blockquote>
<p data-ke-size="size16">공격 chain 전체를 이어보면 다음과 같이 표현할 수 있다.</p>
<pre class="routeros"><code>공격자가 crafted Vault 전달
        ↓
피해자가 Vault를 처음 열기
        ↓
appearance.json이 CSS snippet을 활성화
        ↓
CSS가 trust prompt보다 먼저 main renderer에 적용
        ↓
경고와 Restricted Mode 선택은 보이지 않게 됨
        ↓
투명한 positive trust button이 viewport를 덮음
        ↓
사용자가 일반 기능을 누른다고 생각하고 한 번 click
        ↓
trust 값이 true로 저장됨
        ↓
Vault에 포함된 Community Plugin load
        ↓
Obsidian process 권한으로 Node.js code 실행
</code></pre>
<h2 data-ke-size="size26">11. 벤더에게 어떻게 제보했는가?</h2>
<p data-ke-size="size16">2026년 9월 24일 Obsidian Support에 private report를 보냈다. 메인 report에는 다음 자료를 포함했다.</p>
<pre class="mipsasm"><code>정확한 제품 version과 package SHA-256
Clean profile에서의 재현 단계
클릭 전후 application state JSON
클릭 전후 screenshot
DOM .click()이 아니라 실제 mouse input을 사용한 근거
Shell 대신 JSON marker만 만드는 Plugin
정적 분석으로 확인한 startup 순서와 bundle line
Root Cause와 수정 권장안
확인하지 않은 영향과 공격 조건
</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">수정 방향으로는 다음 내용을 제안했었다.</p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>Trust 결정 전에는 Vault가 제공한 theme과 CSS snippet을 load하지 않는다.</li>
<li>Trust prompt를 Vault CSS가 접근할 수 없는 native dialog나 별도 WebContents에 둔다.</li>
<li>첫 실행은 built-in stylesheet만 사용한다.</li>
<li>Restricted Mode를 선택했다면 Vault presentation resource도 계속 제한한다.</li>
<li>투명도, geometry, stacking과 hit target을 검사하는 regression test를 추가한다.</li>
</ol>
<p data-ke-size="size16">진행 과정은 다음과 같았다.</p>
<table data-ke-align="alignLeft">
<thead>
<tr>
<th>날짜</th>
<th>진행 내용</th>
</tr>
</thead>
<tbody>
<tr>
<td>2026-09-22</td>
<td>1.13.7 package 추출과 bundle 분석 시작</td>
</tr>
<tr>
<td>2026-09-22</td>
<td>실패 후보 정리 후 CSS/Trust 순서 가설 수립</td>
</tr>
<tr>
<td>2026-09-23</td>
<td>Clean profile에서 실제 mouse click과 Node.js marker 재현</td>
</tr>
<tr>
<td>2026-09-24</td>
<td>Obsidian Support에 private report 전송</td>
</tr>
<tr>
<td>2026-09-24~25</td>
<td>벤더가 evidence를 확인하고 수정 진행 회신</td>
</tr>
<tr>
<td>2026-10-05</td>
<td>Obsidian Desktop 1.14.4 공개</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">12. Codex와 LLM은 분석에서 어디에 사용했는가?</h2>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">LLM에게 그냥 "해줘"를 하지는 않도록 노력은 했지만 쉽지는 않았다. 막히는 부분이 있으면 해당 부분을 돌파하는 역할으로 많이 활용하였고, 내가 이해가 안 가거나 취약한 부분을 못 찾겠거나 그럴 때마다 사용했던 것 같다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
