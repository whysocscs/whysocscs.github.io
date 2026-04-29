---
layout: post
title: "프론티어_리눅스 기반 시스템 탐색 및 데이터 분석 (Bandit 0–24)"
date: 2026-04-29 04:31:00
desc: "OverTheWire Bandit Level 0~24 풀이 모음"
keywords: "OverTheWire,Bandit,Wargame,CTF,Linux,보안"
categories: [CTF/Wargame]
tags: ["Wargame", "Bandit", "OverTheWire", "Linux"]
icon: fa-flag
---

> Source: [https://sanghole.tistory.com/34](https://sanghole.tistory.com/34)

<style>
.bw-radio{position:absolute;opacity:0;pointer-events:none;width:0;height:0}
.bw-wrap{position:relative;margin-top:1.5rem}
.bw-nav{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid oklch(0.28 0.04 225/0.45)}
.bw-btn{display:inline-block;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.06em;padding:5px 12px;border:1px solid oklch(0.28 0.04 225/0.45);border-radius:3px;color:oklch(0.65 0.025 215);cursor:pointer;transition:color .15s,border-color .15s,background .15s;user-select:none;background:transparent;white-space:nowrap}
.bw-btn:hover{border-color:oklch(0.76 0.11 190/0.6);color:oklch(0.76 0.11 190)}
.bw-panel{display:none;padding:.25rem 0;animation:bw-fade .2s ease}
@keyframes bw-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.bw-panel h3{font-style:italic;font-weight:300;font-size:1.35rem;margin-bottom:1.25rem;color:oklch(0.76 0.11 190);letter-spacing:-.02em;border-bottom:1px solid oklch(0.22 0.03 228/0.22);padding-bottom:.75rem}
.bw-panel p{margin-bottom:1rem;color:oklch(0.95 0.015 205);line-height:1.75}
.bw-panel code{background:oklch(0.12 0.04 220/0.5);color:oklch(0.76 0.11 190);padding:.12rem .4rem;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.85em;border-radius:2px}
.bw-cmd{background:#03080f;color:oklch(0.90 0.02 205);padding:1rem 1.25rem;margin:1rem 0;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.85rem;line-height:1.6;border:1px solid oklch(0.28 0.04 225/0.45);border-radius:4px;overflow-x:auto;white-space:pre}
.bw-ref{display:block;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.8rem;color:oklch(0.72 0.14 210);text-decoration:underline;text-underline-offset:3px;margin:.75rem 0;word-break:break-all}
.bw-tip{border-left:2px solid oklch(0.76 0.11 190/0.5);padding:.5rem 0 .5rem 1.1rem;margin:1rem 0;color:oklch(0.80 0.025 210);font-style:italic}
.bw-done{display:inline-block;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:oklch(0.65 0.10 150);border:1px solid oklch(0.65 0.10 150/0.4);padding:3px 10px;border-radius:999px;margin-bottom:1.25rem}
#bwl0:checked~.bw-p0{display:block}
#bwl1:checked~.bw-p1{display:block}
#bwl2:checked~.bw-p2{display:block}
#bwl3:checked~.bw-p3{display:block}
#bwl4:checked~.bw-p4{display:block}
#bwl5:checked~.bw-p5{display:block}
#bwl6:checked~.bw-p6{display:block}
#bwl7:checked~.bw-p7{display:block}
#bwl8:checked~.bw-p8{display:block}
#bwl9:checked~.bw-p9{display:block}
#bwl10:checked~.bw-p10{display:block}
#bwl11:checked~.bw-p11{display:block}
#bwl12:checked~.bw-p12{display:block}
#bwl13:checked~.bw-p13{display:block}
#bwl14:checked~.bw-p14{display:block}
#bwl15:checked~.bw-p15{display:block}
#bwl16:checked~.bw-p16{display:block}
#bwl17:checked~.bw-p17{display:block}
#bwl18:checked~.bw-p18{display:block}
#bwl19:checked~.bw-p19{display:block}
#bwl20:checked~.bw-p20{display:block}
#bwl21:checked~.bw-p21{display:block}
#bwl22:checked~.bw-p22{display:block}
#bwl23:checked~.bw-p23{display:block}
#bwl24:checked~.bw-p24{display:block}
#bwl0:checked~.bw-nav label[for=bwl0],#bwl1:checked~.bw-nav label[for=bwl1],#bwl2:checked~.bw-nav label[for=bwl2],#bwl3:checked~.bw-nav label[for=bwl3],#bwl4:checked~.bw-nav label[for=bwl4],#bwl5:checked~.bw-nav label[for=bwl5],#bwl6:checked~.bw-nav label[for=bwl6],#bwl7:checked~.bw-nav label[for=bwl7],#bwl8:checked~.bw-nav label[for=bwl8],#bwl9:checked~.bw-nav label[for=bwl9],#bwl10:checked~.bw-nav label[for=bwl10],#bwl11:checked~.bw-nav label[for=bwl11],#bwl12:checked~.bw-nav label[for=bwl12],#bwl13:checked~.bw-nav label[for=bwl13],#bwl14:checked~.bw-nav label[for=bwl14],#bwl15:checked~.bw-nav label[for=bwl15],#bwl16:checked~.bw-nav label[for=bwl16],#bwl17:checked~.bw-nav label[for=bwl17],#bwl18:checked~.bw-nav label[for=bwl18],#bwl19:checked~.bw-nav label[for=bwl19],#bwl20:checked~.bw-nav label[for=bwl20],#bwl21:checked~.bw-nav label[for=bwl21],#bwl22:checked~.bw-nav label[for=bwl22],#bwl23:checked~.bw-nav label[for=bwl23],#bwl24:checked~.bw-nav label[for=bwl24]{background:oklch(0.76 0.11 190/0.15);border-color:oklch(0.76 0.11 190/0.6);color:oklch(0.76 0.11 190)}
.bw-imgs{display:flex;flex-wrap:wrap;gap:8px;margin:1.25rem 0}
.bw-imgs img{max-width:100%;height:auto;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);background:oklch(0.04 0.01 230)}
</style>

<div class="bw-wrap">

<input type="radio" name="bwlv" id="bwl0"  class="bw-radio" checked>
<input type="radio" name="bwlv" id="bwl1"  class="bw-radio">
<input type="radio" name="bwlv" id="bwl2"  class="bw-radio">
<input type="radio" name="bwlv" id="bwl3"  class="bw-radio">
<input type="radio" name="bwlv" id="bwl4"  class="bw-radio">
<input type="radio" name="bwlv" id="bwl5"  class="bw-radio">
<input type="radio" name="bwlv" id="bwl6"  class="bw-radio">
<input type="radio" name="bwlv" id="bwl7"  class="bw-radio">
<input type="radio" name="bwlv" id="bwl8"  class="bw-radio">
<input type="radio" name="bwlv" id="bwl9"  class="bw-radio">
<input type="radio" name="bwlv" id="bwl10" class="bw-radio">
<input type="radio" name="bwlv" id="bwl11" class="bw-radio">
<input type="radio" name="bwlv" id="bwl12" class="bw-radio">
<input type="radio" name="bwlv" id="bwl13" class="bw-radio">
<input type="radio" name="bwlv" id="bwl14" class="bw-radio">
<input type="radio" name="bwlv" id="bwl15" class="bw-radio">
<input type="radio" name="bwlv" id="bwl16" class="bw-radio">
<input type="radio" name="bwlv" id="bwl17" class="bw-radio">
<input type="radio" name="bwlv" id="bwl18" class="bw-radio">
<input type="radio" name="bwlv" id="bwl19" class="bw-radio">
<input type="radio" name="bwlv" id="bwl20" class="bw-radio">
<input type="radio" name="bwlv" id="bwl21" class="bw-radio">
<input type="radio" name="bwlv" id="bwl22" class="bw-radio">
<input type="radio" name="bwlv" id="bwl23" class="bw-radio">
<input type="radio" name="bwlv" id="bwl24" class="bw-radio">

<nav class="bw-nav">
  <label for="bwl0"  class="bw-btn">Level 0</label>
  <label for="bwl1"  class="bw-btn">Level 1→2</label>
  <label for="bwl2"  class="bw-btn">Level 2→3</label>
  <label for="bwl3"  class="bw-btn">Level 3→4</label>
  <label for="bwl4"  class="bw-btn">Level 4→5</label>
  <label for="bwl5"  class="bw-btn">Level 5→6</label>
  <label for="bwl6"  class="bw-btn">Level 6→7</label>
  <label for="bwl7"  class="bw-btn">Level 7→8</label>
  <label for="bwl8"  class="bw-btn">Level 8→9</label>
  <label for="bwl9"  class="bw-btn">Level 9→10</label>
  <label for="bwl10" class="bw-btn">Level 10→11</label>
  <label for="bwl11" class="bw-btn">Level 11→12</label>
  <label for="bwl12" class="bw-btn">Level 12→13</label>
  <label for="bwl13" class="bw-btn">Level 13→14</label>
  <label for="bwl14" class="bw-btn">Level 14→15</label>
  <label for="bwl15" class="bw-btn">Level 15→16</label>
  <label for="bwl16" class="bw-btn">Level 16→17</label>
  <label for="bwl17" class="bw-btn">Level 17→18</label>
  <label for="bwl18" class="bw-btn">Level 18→19</label>
  <label for="bwl19" class="bw-btn">Level 19→20</label>
  <label for="bwl20" class="bw-btn">Level 20→21</label>
  <label for="bwl21" class="bw-btn">Level 21→22</label>
  <label for="bwl22" class="bw-btn">Level 22→23</label>
  <label for="bwl23" class="bw-btn">Level 23→24</label>
  <label for="bwl24" class="bw-btn">Level 24→25</label>
</nav>
<div class="bw-panel bw-p0">
  <span class="bw-done">solved</span>
  <h3>Level 0</h3>
  <div class="bw-cmd">해당 문제에서 쓴 리눅스 명령어:
ls : 디렉토리의 내용을 출력한다.
  -l : 상세 내용을 출력 
  -a : 숨긴 파일도 출력
 
cat : 파일을 읽어서 쉘에 출력할 때 사용한다</div>
  <img src="https://blog.kakaocdn.net/dna/cfn5eE/dJMcadBIJDJ/AAAAAAAAAAAAAAAAAAAAANtrzd_C7yBhjao_5ET0_tazkc3ciF-DzwirbZWyJRh9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=gvjtIUgqMGsr1cseTnoNjxpr8WQ%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>ls 검색 후, cat readme하면 바로 다음 문제가 나옴..!</p>
  <img src="https://blog.kakaocdn.net/dna/bRLnPb/dJMcahc8hxX/AAAAAAAAAAAAAAAAAAAAAMA75P7_lbbOWeB5hIbsodkeMey4kK3lYyvIsS-Ju8Z1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=8MD%2FdKAWPMK%2BfqKDG6%2FmpoERT4k%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
</div>

<div class="bw-panel bw-p1">
  <span class="bw-done">solved</span>
  <h3>Level 1 → 2</h3>
  <img src="https://blog.kakaocdn.net/dna/OqvZE/dJMcacpmThk/AAAAAAAAAAAAAAAAAAAAAGRVIHqG_7Z5OhAgqDh4aLVzM2b_3xIrL6Q8e_xKJil6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=DbhO799NwYVf0%2BrdO2ZzBoXT9i4%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>- &lt;-- 이거 하려고 뭐 cd 이런거 다 쳐보다가 약간 노가다로 이런거 저런거 다 해보다가 약간 운이 좋게?.. 풀게 됨...</p>
  <p>- 이걸로 파일을 실제로 만드는 것은 안 좋다고 했고, &lt; 이거나 ./ &lt;- 이런걸로 실제로 열수 있다고 한다.</p>
  <p>이유: cat - 으로 시작하게 되면 옵션값으로 들어가는 경우가 생긴다. 그래서 실제로 ./를 명시하면서 지금 있는 디렉토리인 것을 명시해줘야한다.</p>
  <img src="https://blog.kakaocdn.net/dna/vH3Ed/dJMcac3Wl7Q/AAAAAAAAAAAAAAAAAAAAACbukQiRNnHpAR5hzENJI-4G41t1cA9IaCx1yGB-J98g/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=Zw7dDVthG2mkKqLrXWmEfHyNyV4%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
</div>

<div class="bw-panel bw-p2">
  <span class="bw-done">solved</span>
  <h3>Level 2 → 3</h3>
  <img src="https://blog.kakaocdn.net/dna/bx5A83/dJMcaiC52GD/AAAAAAAAAAAAAAAAAAAAAObkpk5Zl-1ko-43LvwEF1RkYpmgk8RueCKylcD1Y2d9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=a%2FQMbCaWUUflQQWJ%2FH5D4S7liFk%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>이거는 그냥 spaces일 때 " " &lt;-- 이거를 사용한다고 알고 있어서 빠르게 풀었다.</p>
  <p>보통 ls 후, 중간 중간 띄어쓰기가 있는 파일 제목과 같은 경우에는 " "로 묶어줘야 하나의 파일 제목이라고 명시를 해줄 수 있다.</p>
  <p>그게 아니면 spaces, in, this filename을 각자 따로 따로 cat을 하게 된다.</p>
  <img src="https://blog.kakaocdn.net/dna/bMpbdY/dJMcaf0FcjS/AAAAAAAAAAAAAAAAAAAAAE97gp9MjP6h_JKD2zmxb4L90i4jwa7ihZkFP_88B95k/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=SwAOS%2B%2F0A3WCeWHagF6jiY8JcJo%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
</div>

<div class="bw-panel bw-p3">
  <span class="bw-done">solved</span>
  <h3>Level 3 → 4</h3>
  <img src="https://blog.kakaocdn.net/dna/b3jzbN/dJMcaayksrJ/AAAAAAAAAAAAAAAAAAAAAJ30CUYindi01aToY49BjTvYWjkPZZG-k_B7IhsY5Z2Z/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=XM8rspWCW6y%2FQnQuNmUAmMSSV3c%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>이것도.,..그냥 -al &lt;-- 이런거 치면 숨긴 파일 + 상세 파일 정보명이 뜬다고 알고 있어서 항상 ls만 안치고 ls -al 까지 치는 습관이 있어서 그렇게 했더니 풀린 문제.</p>
  <p>level 0에 간략하게 적어놨는데, 리눅스 명령어에서는</p>
  <p>&lt;명령어&gt; &lt;옵션&gt; 을 붙일 수 있다. ls와 같은 경우에는 -a, -l 등 여러 가지 옵션을 활용해서 기존 명령어보다 더 다양한 상황에서 활용할 수 있다.</p>
  <img src="https://blog.kakaocdn.net/dna/FWyHW/dJMcaaE6LLK/AAAAAAAAAAAAAAAAAAAAAA3fKD9VKIdeSgxkO0fUZvqiNxqM9pCQpKGF-uAQygHr/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=OGMKoOf0WknCnBLpb6wasplPJzY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
</div>

<div class="bw-panel bw-p4">
  <span class="bw-done">solved</span>
  <h3>Level 4 → 5</h3>
  <img src="https://blog.kakaocdn.net/dna/bMJHE6/dJMcai37EEZ/AAAAAAAAAAAAAAAAAAAAAJskBcoZxmwh72oqMU4ACe-KUSDdKtmk2IgRIkMZ0Dyi/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=fiv1TmFY%2Fq3cbwH6Dme1nGFo4wY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>지금은 무식하게 풀었다.</p>
  <p>지금 cat ./-file07에 있는 부분이 검은색으로 정답을 칠해놔서 안 보이지만, 하나씩 다 찍어보면서 이게 우리가 읽을 수 있는 값인지 아닌지를 체크했다.</p>
  <p>다른 정답들도 비교해봤을 때는 file이라는 명령어를 활용해서 이 친구의 file의 타입을 알 수 있다. 보통 그렇게 많이 푼 것 같다.</p>
  <img src="https://blog.kakaocdn.net/dna/ylhc2/dJMcageeVHa/AAAAAAAAAAAAAAAAAAAAAEh-_3-2Fx-uKpd0XBqwea7JI7v5xrOFDRYqQM-M-dsp/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=bWZ3wwo7sz5eODkfqcnqpL2jp0g%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
</div>

<div class="bw-panel bw-p5">
  <span class="bw-done">solved</span>
  <h3>Level 5 → 6</h3>
  <img src="https://blog.kakaocdn.net/dna/sFQn3/dJMcabDZxZg/AAAAAAAAAAAAAAAAAAAAAPW0Lzh26ittOTmv44koU-zjahTjm4c69AkxptxBxSuD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=hmOT%2B7hswDa0Xx8Fzq%2BLSD7KpCA%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>이거는 무식하게 못 풀듯???</p>
  <img src="https://blog.kakaocdn.net/dna/ckuSUr/dJMcahxr733/AAAAAAAAAAAAAAAAAAAAAOQb3k_264R6igmnAO3R18t5ysFZQLGBuVlL8Xs_u1sN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=%2Fa5yBn5pz43J8jSvfiQ3j5u6M3Y%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>find 함수를 쓰라는 것 같은데..</p>
  <p>https://coding-factory.tistory.com/804</p>
  <p>여기에 있는 거를 참고..했다.</p>
  <p>find . -size 1033c.</p>
  <p>풀어서 써보면, 현재 dir에 있는 파일 중에 size가 1033 bytes 를 찾아줘라. 이런 뜻이다. 다른 3개의 조건들이 있었지만 가장 간단한 조건 같아서 1033c를 적용하였다.</p>
  <div class="bw-cmd">find [옵션] [경로] [표현식]

[옵션]

-P : 심볼릭 링크 따라가지 않음. 자체 정보 사용
-L : 심볼릭 링크에 연결된 파일 정보 사용

[표현식]

-name : 지정된 문자열 패턴에 해당하는 파일 검색
-empty : 빈 dir, 크기 0 파일 검색.
-path : 지정된 문자열 패터에 해당하는 경로에서 검색.
-size : 파일 크기를 사용하여 파일 검색</div>
  <img src="https://blog.kakaocdn.net/dna/Qa2p3/dJMcajopkNB/AAAAAAAAAAAAAAAAAAAAAAP5n0_sINY84UAE8df247fBrwHJAA2UuXUnOv-sBvZH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=eV1R91xkUtkQot3FbZkEiV%2Fdfas%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
</div>

<div class="bw-panel bw-p6">
  <span class="bw-done">solved</span>
  <h3>Level 6 → 7</h3>
  <img src="https://blog.kakaocdn.net/dna/O46zR/dJMcabqtB2G/AAAAAAAAAAAAAAAAAAAAAEPvGKiQzLobHqJil2X4FfVtt3x3pO6QZsu_lY5fDQnD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=mJJ%2F9SFoxe787EC6hulSd8gQEcw%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>https://server-talk.tistory.com/20</p>
  <p>이거는 이거 찾아봤음..</p>
  <img src="https://blog.kakaocdn.net/dna/ugRlN/dJMcahRIMRA/AAAAAAAAAAAAAAAAAAAAAEPcPlmg1uIQdtIdtIO-GpZ4CLv_EyLKtW_eNsFafWn7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=fsugzgzl1h2dAPubESsPHreLius%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>뒤에 오류 아무것도 안 뜨는 거를 찾아서 cat을 해봤더니 풀렸음..</p>
  <p>find / -user bandit7 -group bandit6 -size 33c</p>
  <p>하나 씩 풀어서 설명해보자면</p>
  <p>루트 디렉토리 아래에서 user, 소유자는 bandit7인 파일 중에 -group bandit6 : 파일 그룹이 bandit6인 것만 찾아라.</p>
  <p>근데 또 그 중에서도 -size 33c : 파일 크기가 정확히 33바이트 인 것만 찾아라.</p>
  <p>딱 문제에 있는 조건을 다 find 안에 녹이면서 구현한 것 이다.</p>
  <img src="https://blog.kakaocdn.net/dna/txJvT/dJMcabYiGjr/AAAAAAAAAAAAAAAAAAAAAGTgGfhvK4eaV794QdairiiwNfYeikk3U2zNFRjKS_aR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=WRQBVmY8%2F4dBVmMt%2FZooo3ttccI%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
</div>

<div class="bw-panel bw-p7">
  <span class="bw-done">solved</span>
  <h3>Level 7 → 8</h3>
  <img src="https://blog.kakaocdn.net/dna/bUv3HB/dJMcagkYNb6/AAAAAAAAAAAAAAAAAAAAAPkUAxb-qUjDkXLpPmkrgTCbyX0YKwxONq5beMI4lEre/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=luBQJahFWNN7plqc6vPu7I0fUFQ%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>진짜 문제 제대로 안 읽고 풀다가 uniq, sort 등 이상한거 다 하고 다시 돌아와서 grep으로 써서 풀었다.....</p>
  <p>https://coding-factory.tistory.com/802</p>
  <p>이 번에는 해당 grep으로 배웠다. 해당 정답이 가려져있긴 한데,</p>
  <p>문제에서 millinoth으로 시작하는~ 이라고 했길래 리눅스 grep 명령어를 사용하면</p>
  <p>딱 그런 문자열로 시작하는 해당 줄만 뽑아올 수 있다.</p>
  <div class="bw-cmd">grep [옵션][패턴][파일명]</div>
  <p>여기서 사용한거는 grep millionth으로 실제millionth로 시작하는 줄을 다 가져오는 것 이다.</p>
</div>

<div class="bw-panel bw-p8">
  <span class="bw-done">solved</span>
  <h3>Level 8 → 9</h3>
  <p>이것도 내가 예전에 풀은 기억이 있어서..</p>
  <p>uniq는 중복되는 값들을 지워주는 건데, 하기에 앞서 sort를 시켜줘야한다.</p>
  <p>라고 생각해서</p>
  <img src="https://blog.kakaocdn.net/dna/btSg9N/dJMcagyvroJ/AAAAAAAAAAAAAAAAAAAAAGLG8MOqSxNDRuPhZAcndccj1OWfd3sc-XBFqZMsykM9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=E0TGdl7TbFi0fXEWGZr2od33LHw%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그냥 이렇게 마구잡이로 명령어 썻는데.. -c를 붙여서 몇 번이 나왔는지에 대해서도 뽑아줘야되었으며</p>
  <p>그리고 uniq로 하면 중복되는 값들을 지워주는게 아니라 약간 압축???그런거 하는 느낌</p>
  <img src="https://blog.kakaocdn.net/dna/sePbp/dJMcagZzGJd/AAAAAAAAAAAAAAAAAAAAAMuMHvu6U8wWkYMPlVUTiMAoZzNmV-QZaazVG46FOfQr/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=8GMdtbpwD4AMEGx%2B%2BrxurbfuAnw%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>추가적으로 설명하면</p>
  <p>먼저 data.txt를 sort 시키면 중첩되는 문자열들끼리 정렬을 할 수 있게된다.</p>
  <p>그 후 uniq -c를 활용하면 그런 중첩된 문자열 &amp; 줄들으 각각 갯수로 표현되며 중복된 값들은 한 번만 표시된다. 그 중 한 문자열에 대해서만 딱 한 줄이 존재한다고 했으니 -c 옵션을 활용하여 갯수를 확인해주면 풀리는 문제이다.</p>
</div>

<div class="bw-panel bw-p9">
  <span class="bw-done">solved</span>
  <h3>Level 9 → 10</h3>
  <img src="https://blog.kakaocdn.net/dna/cU4d2b/dJMcaaryMdF/AAAAAAAAAAAAAAAAAAAAALY0eEx2IeHffvKlZR2MwItm5YT2yP95BiZUVAbqp5vJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=c25wS6LzWff%2BRh%2B28ZpS%2BS6e0Ec%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>뻘짓 중.. 근데 이게 사람이 읽을 수 있는 문자열이 아닌 것 같은 느낌? ( 문제에서도..)</p>
  <p>그래서 그냥 cat 때리고 ====&lt;-- 이거 있는 것을 찾아봤음</p>
  <img src="https://blog.kakaocdn.net/dna/cvZYcW/dJMcahqGEOy/AAAAAAAAAAAAAAAAAAAAAHW_1gW-E9tsBrq0Hh1k1Y9_D_v-amkiy6f1853z-FkS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=95SGfn4Lw%2B8OLwsMw67iWGDkmWk%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>히히 그냥 무지성으로 풀어버리기... 그래도 이걸 어떻게 푸는지는 알아야할 것 같은 느낌?</p>
  <img src="https://blog.kakaocdn.net/dna/wUDOp/dJMcaaLRosp/AAAAAAAAAAAAAAAAAAAAAE8K9kL1Botag0kvsU3xKWw_XhGYzVQKZp26yF_CPZFc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=7ERwA6JcnOeeB7wv3tt0TJpRusI%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>찾아보니까 strings라고 그냥 파일 안에 포함된 문자열을 뽑아낼 수 있는 기능을 함.! 그래서 그걸 이용해서 grep을 사용하면 끝이다</p>
  <p>strings는 바이너리 파일에서 텍스트를 추출할 때 쓰는데, 이 명령어를 활용하면 바이너리 파일 안에 있는 읽을 수 있는 ASCII를 출력해준다.</p>
  <p>그래서 strings data.txt로 출력을 해주고 grep으로 해당 문자열을 가져온다.</p>
  <div class="bw-cmd">strings [옵션] [파일]

--
[옵션]

-f : 파일 이름을 같이 출력
-n : 문자열의 최소 길이를 정함</div>
</div>

<div class="bw-panel bw-p10">
  <span class="bw-done">solved</span>
  <h3>Level 10 → 11</h3>
  <p>https://happylie.tistory.com/8</p>
  <p>참고 자료!!</p>
  <img src="https://blog.kakaocdn.net/dna/bEIxhr/dJMcaakL0Yp/AAAAAAAAAAAAAAAAAAAAAGPb-HHf5az7Ej0gJjhPjJvOjqt1fxwC07-GawpUJeLr/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=lOHFtz44uNOE9QuVru9tYebfuGI%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>이건 해당 참고 자료를 보면 쉬움. 그냥 base64 디코딩만 하면 됨!! ( 문제만 잘 읽는 다면..)</p>
  <p>여담으로 암호화가 필요할 때 base64로 암호화할게요! 라고 하는건 아래와 같은 사진이랑 똑같다. Base64는 암호화가 아니라 인코딩, 디코딩 개념이다.</p>
  <p>인코딩: 데이터를 숨기는 것이 목적이 아니라, 바이너리 데이터나 특수 문자를 텍스트 형태로 전달하려고 바꾸는 것.</p>
  <img src="https://blog.kakaocdn.net/dna/wj66I/dJMcahK1Pzc/AAAAAAAAAAAAAAAAAAAAAHl6ltFFzbetCM83OG4nWA2637qr_ofZe03Y3QHoVlwC/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=%2FrU1hmdE0YBlaV%2Ftll%2Bo7pZpOnk%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <div class="bw-cmd">base64 [옵션][파일명]

--
[옵션]
-d : base64 디코드
-i : 알파벳 아닌 문자 무시
-w : 줄 바꿈</div>
</div>

<div class="bw-panel bw-p11">
  <span class="bw-done">solved</span>
  <h3>Level 11 → 12</h3>
  <img src="https://blog.kakaocdn.net/dna/sDUng/dJMcafzDBqY/AAAAAAAAAAAAAAAAAAAAAMF_2QG0B3ekgjbb8gpa0xSe7hPfU8PUcMaRZdbSzGDn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=duzAH%2Fpss8HCbqiUSGD4Ful%2BRRY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>문제를 이렇게 풀어도 되긴 하지만!!!</p>
  <p>https://zidarn87.tistory.com/137</p>
  <p>tr 명령어를 통해서..</p>
  <img src="https://blog.kakaocdn.net/dna/TsCqy/dJMcahRIOuc/AAAAAAAAAAAAAAAAAAAAAAlznBgE0-Jd7kBT2chJJ2ddMdA1pOsdL6SAJDEou0gJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=YCOrPbacitbJ8lCdVqsqRtv7WYg%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>13 옮기는 거를 일일히 노트에 써가면서 어떻게 옮길지 찾아봤다</p>
  <p>tr 'A-Za-z' 'N-ZA-Mn-za-m'은</p>
  <p>A B C D ... M N O ... Z a b c ... m n o ... z&amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr; &amp;darr;N O P Q ... Z A B ... M n o p ... z a b ... m</p>
  <p>이렇게 rot13을 직접 해주는걸 명시해줌으로써 문제가 풀리는 것!!</p>
</div>

<div class="bw-panel bw-p12">
  <span class="bw-done">solved</span>
  <h3>Level 12 → 13</h3>
  <p>옛날에 bandit을 하다가 딱 이 12번 문제를 풀다가 접었다. 그 때 당시에는 이해가 안가서 어떻게 푸는지.</p>
  <p>https://zidarn87.tistory.com/177</p>
  <img src="https://blog.kakaocdn.net/dna/cqnOcx/dJMcagyvvXn/AAAAAAAAAAAAAAAAAAAAACvrHS9--3aiMatz6Yqvks0mHerrtDL4k6vC2k6RYIgR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=fQ36IfchZrKT4pObSkwdsBbKYT0%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>일단 xxd를 하려고 했더니 뭐 할 수가 없다.. 이유는 우리에게 권한이 없기 때문에.,</p>
  <p>그래서 문제에 나와있듯이 tmp로 간다!!!!</p>
  <img src="https://blog.kakaocdn.net/dna/5Tawm/dJMcabKO9qB/AAAAAAAAAAAAAAAAAAAAAONYK_wGYgf95G2zq0niZ7U-fhVgFSzFSRCkvMfHye4F/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=Y%2B9RavqMl%2FzDDtkg8m0ipSsILUk%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그 후에 xxd -r 옵션을 활용하게 되는데 그 이유는? \</p>
  <p>=&gt; xxd -r은 헥스덤프 형태의 바이너리 파일을 다시 되돌리기 위해서!</p>
  <p>하지만 그렇게 해도, real.txt는 아직 이상한 값으로 채워져 있다.</p>
  <img src="https://blog.kakaocdn.net/dna/bK9P7s/dJMcabcUHjy/AAAAAAAAAAAAAAAAAAAAAD3wm88NDXuBw7ewGUVIZpPy5d9P-P9z1nsJX8lHA0M1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=rONxrpRIXO5qIrZS1%2FmaWkHoThc%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 file이라는 함수를 활용해서 이 친구가 지금 어떤 파일 특성? 파일 종류를 가지고 있는지 확인해보면 gzip이라고 되어있다. 그럼 이걸 풀어주면 됨</p>
  <img src="https://blog.kakaocdn.net/dna/9dvAj/dJMcad2QEhU/AAAAAAAAAAAAAAAAAAAAACBCnUuaDgE_QwVX0UsL9gWBvm9QTFjNVmUB9v7CoPY7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=hgZctl5RdKP5URgnSrqrFCp%2BhI0%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <img src="https://blog.kakaocdn.net/dna/wGR5x/dJMcafl7SbB/AAAAAAAAAAAAAAAAAAAAAP_8K6feO11jcI4_8c9WIWIDv72ajbBsc8TzTrfEjAvI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=h%2Fo1bKnIm7wA84boZ2oNW9nu2HY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>근데 문제는 그냥 풀려고 하면 오류나니까.. real.gz으로 이름을 바꿔주고 해야한다. 그리고 다시 cat 해봤더니 또 이상한 값이 떠서, 다시 bzip으로 파일명 바꾸고~~ 풀어줘야할 듯.</p>
  <img src="https://blog.kakaocdn.net/dna/ZSvzI/dJMcadhwQLk/AAAAAAAAAAAAAAAAAAAAABodAEqwAJ2hUl7Iqpg07VAlYs8O4tvRp1lrB_h7tdez/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=7fFtKjx09ZDQTP1cw3NtAnAjM1Q%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>또 mv로 파일명 바꾸고~ bzip2 -d 로 풀어주고~ cat 했는데~ 또 이상한 값~ 또 file~ 또 gzip? 한 번 다시!</p>
  <img src="https://blog.kakaocdn.net/dna/czJYV6/dJMcajoq0hM/AAAAAAAAAAAAAAAAAAAAAL9Zzt_xV3XQJTgClJ4IFnmy24Fp1tbx7WXyRpOOqgxo/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=p0KMyLHvftVpZcO6%2BQRGMvDLTTI%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>이번에는 data5.bin ~~ 이러길래 제대로 값이 나왔나? 싶었지만, tar archive. tar로 묶여져 있는 친구인 것 같다. 그래서 다시!</p>
  <img src="https://blog.kakaocdn.net/dna/MogiP/dJMcaduZQrr/AAAAAAAAAAAAAAAAAAAAAIrQOS6g42L-JBhhQev4ootZdLRvr-9busC4CCugZp5_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=cU96ub2MoaglI0Qlbem6xilH63g%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그 후 해당 과정을 무한 반복해서 얻은 password값. 중간에 ^C는 , 갑자기 렉걸려서 아무 입력도 안되길래 너무 무서워서 가만히 있다가 혹시나 ^C를 하면 풀리나? 싶었는데 그냥 저러고 한 1분 동안 멈춰있다가 튕기는 줄 알았다.. 그래도 다행</p>
  <p>명령어 모음</p>
  <div class="bw-cmd">xxd [옵션] [파일명]

--
[옵션]
-r : hexdump를 원래 바이너리 파일로 복원</div>
  <div class="bw-cmd">gzip [옵션] [파일명]

--
[옵션]
-d : gzip 압축 해제
==================================
bzip2 [옵션] [파일명]

--
[옵션]
-d : bzip2 압축 해제</div>
  <div class="bw-cmd">tar [옵션] [파일명]

[옵션]
-x : tar 파일 풀기
-v : 진행 과정 출력
-f : 사용할 tar 파일 지정</div>
</div>

<div class="bw-panel bw-p13">
  <span class="bw-done">solved</span>
  <h3>Level 13 → 14</h3>
  <img src="https://blog.kakaocdn.net/dna/RnMUd/dJMcaf0GRNX/AAAAAAAAAAAAAAAAAAAAALxgnjAquB4wIwg-RsrlH7CCONw_N13hOnaLEKRkI8Yd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=KejAA7fmkaevX9xZVPJ51aGetXQ%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>처음에 뻘짓하면서 아니 이렇게 하는거 아닌가?? 왜 안되지???하면서 문제를 다시 읽어보니까 저장하고 하라는 ...</p>
  <img src="https://blog.kakaocdn.net/dna/dGR4BY/dJMcaiwlu0s/AAAAAAAAAAAAAAAAAAAAAA5b2shknt6haTG-YMYmivjyPAf5S3Y3X6wY_394kq69/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=l2NIdQuz%2FjQuvkp9M4LoZ5tgmlI%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 실행하려고 하니까 chmod가 안 먹힌다. 찾아보니까 ./mnt는 윈도우에서 관할하는 파일이고, ~ &lt;- 홈 디렉으로 가서 wsl 내부 리눅스 파일로 가야지만 chmod가 먹힌다는 것을 알게됨..</p>
  <img src="https://blog.kakaocdn.net/dna/bwZLme/dJMcajoq06n/AAAAAAAAAAAAAAAAAAAAADyh4ozH33onVfNkhs4HVL7NkMtKUfaVjt-6ga1Mnbbw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=0IRPdjc3sZnMw0zNWP6H8a8Y4V4%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 실제로 ~ 여기로 옳기고 저렇게 ssh 를 치면 14로 이동!!</p>
  <p>&lt; -i 를 이용하면 나의 개인키로 접속을 수행할 수 있게 된다. .&gt;</p>
  <div class="bw-cmd">ssh [옵션] [계정]@[ip]

[옵션]
-p ( ) : ( )의 값으로 포트 지정
-i ( ) : ( )을 사용해서 ssh key 사용을 통한 접속.</div>
</div>

<div class="bw-panel bw-p14">
  <span class="bw-done">solved</span>
  <h3>Level 14 → 15</h3>
  <p>https://salguworld.tistory.com/entry/Linux-telnet-%EB%AA%85%EB%A0%B9%EC%96%B4%EB%A5%BC-%ED%86%B5%ED%95%9C-%ED%86%B5%EC%8B%A0-%ED%85%8C%EC%8A%A4%ED%8A%B8-1telnet-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%82%AC%EC%9A%A9%EB%B2%95</p>
  <p>그냥 telnet을 써서 localhost에 있는 ip를 딴 후, 접속하라는 것 같아서 위에 있는 링크를 보면서 telnet 명령어를 쳤더니</p>
  <img src="https://blog.kakaocdn.net/dna/bhkXww/dJMb99MVUrO/AAAAAAAAAAAAAAAAAAAAAKOmXvocmc3ZqmQn45lk8xT3YGw8e0Fy-smbknESabar/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=4KdKM%2FaXiAcc2%2FzBwHwGrVmk91I%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>out of range..</p>
  <p>그래서 같이 있는 명령어를 하나씩 검색했다.</p>
  <p>https://betwe.tistory.com/entry/Linux-%EB%A6%AC%EB%88%85%EC%8A%A4-nc-%EB%AA%85%EB%A0%B9%EC%96%B4%EC%97%90-%EB%8C%80%ED%95%9C-%EC%9E%90%EC%84%B8%ED%95%9C-%EC%84%A4%EB%AA%85-%EB%B0%8F-%EC%98%88%EC%8B%9C</p>
  <p>그래서 nc 명령어를 활용하면, 실제로 tcp/ip 통신을 통한 데이터 전송이 가능하다고 해서. 어 이거다 ! 싶었다.</p>
  <img src="https://blog.kakaocdn.net/dna/ch1QCC/dJMcafsRU2W/AAAAAAAAAAAAAAAAAAAAADZGzLvB_NJ0D2g2cNYzzsQ5AChgFLSirkHkuQidNVoS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=q%2F6CDnuDomTLiKcJmz%2Fepf4s3eQ%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 잊고 있던 bandit 14의 비밀번호를 cat으로 알아내고, nc 명령어를 통해서 해당 명령어를 보내면! 15의 정답을 얻을 수 있게 된다.</p>
  <p>telent은 원격 호스트의 특정 포트에 접속 후 텍스트 기반 통신</p>
  <p>nc는 특정 포트에 데이터를 보내고 받는 입출력 도구.</p>
  <p>여기서 내가 telnet으로 문제를 풀 수 있었지만 0을 하나 더 붙여서 nc로 문제를 풀었던 것.</p>
</div>

<div class="bw-panel bw-p15">
  <span class="bw-done">solved</span>
  <h3>Level 15 → 16</h3>
  <img src="https://blog.kakaocdn.net/dna/b71WJw/dJMcaipB0Jo/AAAAAAAAAAAAAAAAAAAAADF6XrhlKca6bU1am6VpcD_qTGMPsWggMqIfR-IygYcE/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=kXr3CXnQszDL9Eg1k%2FMB5%2B%2FoPZA%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>openssl 명령어가 추가되어있길래, 먼저 이거를 찾아보았더니 SSL/TLS와 관련된 일을 하는 명령어..</p>
  <img src="https://blog.kakaocdn.net/dna/nNLVg/dJMcajoq1rg/AAAAAAAAAAAAAAAAAAAAAN2hmcERXeM3Yeifb9rTYsXHDH9_DuxKPOUAG6KBRd_k/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=LDcbZJ7ltFBbFUXct3ieJbKevu4%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 간단하게 gpt에게 뭐하는 명령어냐고 물어보았다.</p>
  <img src="https://blog.kakaocdn.net/dna/OzwFh/dJMcadhwRXO/AAAAAAAAAAAAAAAAAAAAAGIzub3KIXXdqm-zLiBWlidlLcSw7EaSSTv72QQGJ0_k/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=SGa%2B4bcEFNU2lDT8QqFnUZS2olY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 SSL/TLS를 이용해서 암호화를 실제로 하라는건가?? 아니면 그냥 SSL/TLS의 기능이 있는 걸로 접속을 보라는건가?? 싶어서 일단 저렇게 해서 접속을 시도하니까 접속은..가능하네??</p>
  <img src="https://blog.kakaocdn.net/dna/ckfGgh/dJMcacpoCX5/AAAAAAAAAAAAAAAAAAAAAHtNl46Rc4i4P9dx1G-U7IzuyH1Lxomg0gBzdU5CzotF/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=v9mRWp6UPjDQ9HWoKGeKaJ7dd6g%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 정답을 넣으니까 해-결</p>
  <p>openssl s_clinet를 사용하면 자동적으로 ssl/tls 암호화가 되면서 통신이 되나보다. GPT에게 끝나고 물어보니까 오타 수정까지</p>
  <p>kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx</p>
  <img src="https://blog.kakaocdn.net/dna/cSrQxX/dJMcabqvkyZ/AAAAAAAAAAAAAAAAAAAAAKLlTsllWc5G38YgqTfrHJzqFfeVSJ5a9TJ1vPUb1FFP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=OSyz026Wz0iHS69xi2hiM848COo%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>일단 SSL/TLS을 간단 설명 하면 클라이언트 &lt;-&gt; 서버 사이의 통신을 암호화해주는 보안 계층이다.</p>
  <p>TCP 연결을 하면 보통 평문이지만 TLS/SSL을 활용하여 암호화 통신을 진행하려고 하는 것.</p>
  <p>openssl s_client -connect localhost:30001 그래서 해당 명령어를 통해서 TLS을 자동으로 암호화되어 통신.</p>
</div>

<div class="bw-panel bw-p16">
  <span class="bw-done">solved</span>
  <h3>Level 16 → 17</h3>
  <p>https://halinstudy.tistory.com/46</p>
  <p>일단 포트 스캔?? 그러면 nmap이지 않나? 싶어서 nmap을 검색해봄,.</p>
  <img src="https://blog.kakaocdn.net/dna/dCAyDS/dJMcabRxz2Q/AAAAAAAAAAAAAAAAAAAAAIlg3bO6GVPOwb7cOVZLM0Aj8Ge2FmwdqENozPGapwGD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=6JH3hRyWhWT6cQIKX3GuuYT0gSM%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그랬더니 이런 포트들이 나왔다. 음...근데 이걸로 뭐하지?</p>
  <p>https://foxydog.tistory.com/230#:~:text=%E2%91%A1%20nmap%20%ED%88%B4%EC%9D%84%20%EC%9D%B4%EC%9A%A9%ED%95%9C%20SSL/TLS%20%EC%A0%90%EA%B2%80.%20%E2%80%BB,%EC%84%9C%EB%B2%84%EA%B0%80%20%EC%9E%88%EB%8B%A4%EB%A9%B4%20nmap%20%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC%20%EC%A0%90%EA%B2%80%20%ED%88%B4%EC%9D%84%20%EC%9D%B4%EC%9A%A9%ED%95%A9%EB%8B%88%EB%8B%A4.</p>
  <p>그래서 SSL/TLS를 스캔해주는건 없나 싶어서 찾아봤더니 있는 것 같아서 돌렸음??!</p>
  <img src="https://blog.kakaocdn.net/dna/bJhf2z/dJMcahEcVkV/AAAAAAAAAAAAAAAAAAAAAAT-JaXrxXinsrZbV8e2C36EC-G7lGYK7MM6lRQ64l40/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=YAxIRe%2F3WmWPsV2f%2BAhj4bjhrek%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 2개가 나오길래.. 음? 하나라고 했는데?</p>
  <p>그래서 2개 다 해봤는데, 31790에서 아래와 같은 응답이 출력되었다. 엇 이거는 14인가 13에서 썻던 개인키??..</p>
  <img src="https://blog.kakaocdn.net/dna/byhjO4/dJMcaa6bYOo/AAAAAAAAAAAAAAAAAAAAAHfTT0ZR2GR_YyIjoT7iKDUrMY27VcfZZ519b7mnw5ox/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=7LVvMItapUJy%2FDc3hPUHr6wg%2B5o%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>후.. 성공!!</p>
  <p>정리해보면</p>
  <p>1. nmap으로 전체 포트 스캔</p>
  <p>2. 해당 포트 중에서 SSL/TLS 통신을 사용하는 포트를 찾음</p>
  <p>3. 그래서 해당 포트에 openssl s_clinet 활용하여 통신.</p>
  <p>4. 통신 후 답(Private Key)가 나오면 저장 후에 ssh -i를 활용하여 다음 단계로.</p>
</div>

<div class="bw-panel bw-p17">
  <span class="bw-done">solved</span>
  <h3>Level 17 → 18</h3>
  <p>https://blog.naver.com/ncloud24/221255978037</p>
  <p>diff 명령어가 추가되었길래 찾아보고, 문제에서는 한 줄의 명령어만이 바뀌었다고 하니까 diff가 해결책일 것 같다!!</p>
  <img src="https://blog.kakaocdn.net/dna/bkxbxt/dJMcaduZVTF/AAAAAAAAAAAAAAAAAAAAAK4hqZaWxV2KeEE5h28Eu0WZFCM5mtO-HPIpSZuDaO-2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=2Q3n9A7Qo6vBQQ7woEFsJz3AiLo%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>diff -d를 이용하면, 무슨 코드가 상세하게 바뀌었는지 확인할 수 있다!!!!</p>
  <p>x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO</p>
  <p>그래서 아래에 있는 diff 명령어를 파악 후 사용하면 쉽게 풀리는 문제이다.</p>
  <div class="bw-cmd">diff [옵션][파일1][파일2]
diff3 [옵션][파일1][파일2][파일3]

[옵션]
-c : 두 파일간의 차이점 출력
-d : 두 파일간의 차이점을 상세하게 출력
-r : 두 디렉토리간의 차이점 출력
-u : 두 파일의 변경되는 부분과 변경되는 부분의 근처의 내용도 출력.</div>
</div>

<div class="bw-panel bw-p18">
  <span class="bw-done">solved</span>
  <h3>Level 18 → 19</h3>
  <p>https://unix.stackexchange.com/questions/610894/added-exit-0-to-bashrc-and-cannot-login-to-server</p>
  <p>음.. 감이 안 잡혀서 이것 저것 해보면서 ssh에서 bashrc를 뭐 바로 수정할 수 있나? 그런거를 보고 있는데 일단 mv랑 rm -rf는 실패.</p>
  <p>ssh bandit18@bandit.labs.overthewire.org -p 2220 cat .bashrc 를 쳐보니까 exit 0&lt;-- 해당 코드가 실행되는 것은 확인했다.</p>
  <p>1. rm 못함. 2. mv도 실패. 3. cat은 가능.</p>
  <p>그럼 ls는??</p>
  <img src="https://blog.kakaocdn.net/dna/vbzsw/dJMcacQr9Oi/AAAAAAAAAAAAAAAAAAAAAC9BwzAR0cZleGRdZ76rlo5-q-6lMPBkcbI20Yd5zbEm/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=3xfR73P9%2FSd2DSV%2BnmPD9ZmEjvU%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>Readme가 있는 것을 확인.</p>
  <img src="https://blog.kakaocdn.net/dna/bKGjZJ/dJMcaf7sXWh/AAAAAAAAAAAAAAAAAAAAAH_MFXYvs1jRcojuSxvn_oB-G4SEQfRO7ac9dbt_bCYb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=nq%2BxOk0WJpvQHTYl1VOJNVlkcVA%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <img src="https://blog.kakaocdn.net/dna/Cio9J/dJMcaf7sXWj/AAAAAAAAAAAAAAAAAAAAAPc6hUBgwR0strGUJcDvzYd68PLcj5QHv7s4dEQhz1jg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=isLelx3AWgcM2EvKbpr49DV6%2BxU%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>cat readme 하니까 바로 나옴!!!!</p>
  <p>cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8</p>
  <p>근데 이게 왜 실행되는거지? Fith GPT....</p>
  <img src="https://blog.kakaocdn.net/dna/cgG5jX/dJMcah5jT9a/AAAAAAAAAAAAAAAAAAAAADADQJrbz_mhwH19xn2glr0gzTLmye3UtiYbdymx5VQu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=1KjGXKeH%2BmTEMDjonpZFd4ZafEY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>원래 ssh 자체가, host 뒤에 command를 붙여서 활용할 수 있다는 것..</p>
  <p>그러면 막을 수 있는거는?.. FoceCommand를 활용해서 config 파일을 수정을 통해 막을 수 있다구 하네용</p>
  <img src="https://blog.kakaocdn.net/dna/oW1sA/dJMcaiQDKjo/AAAAAAAAAAAAAAAAAAAAAOwRxS99Jo8LyjbdBMolbXsfLpNNw16sNLLhOfhbbMdY/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=%2BS1Md9VELR2%2B83eNyLza9OQLwl4%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
</div>

<div class="bw-panel bw-p19">
  <span class="bw-done">solved</span>
  <h3>Level 19 → 20</h3>
  <p>이게 제대로 된 풀이인지는 모르겠으나</p>
  <img src="https://blog.kakaocdn.net/dna/otjoK/dJMcabRxFgh/AAAAAAAAAAAAAAAAAAAAAF36ymVi0ROEt3OmRjdpgNtAVVwA-8eySAPNh2X_Y98I/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=rnL2IvOY4R2lSsvWbFCIWyVZZbk%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>일단 ls도 해보고, chmod도 해보고 cat도 해봤다.</p>
  <p>근데 문제에서 뭔가 이거 실행해서 해보셈!! 뭔가 이런 느낌이라서</p>
  <img src="https://blog.kakaocdn.net/dna/vT0sO/dJMcajaWySi/AAAAAAAAAAAAAAAAAAAAADz8uf5H7MGGuRL-ALW0CJIvfa9Khk3RXxhhNboeh9ip/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=wnYIj5LcF5RPYZ0dqR1fOGL5FWY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>어.. 이걸로 실행했더니 되네??</p>
  <img src="https://blog.kakaocdn.net/dna/cQLep2/dJMcagL7kmS/AAAAAAAAAAAAAAAAAAAAAGvShmu2dWqmzQeYEeOkk2hKUzBZDS-i6tJ5j0hV_Z0T/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=gMWGuJw%2BQWGoMjoRflUB4rBTRJ8%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 실제 실행을 통해서 값을 알아넴.</p>
  <p>그러면 왜 그런데? setuid가 뭐길래?</p>
  <p>setuid는 set user id의 약자로 한 파일이나 디랙토리를 사용할때는 그 파일의 소유자 권한으로 실행이 되는것을 말한다.</p>
  <img src="https://blog.kakaocdn.net/dna/bhQBsF/dJMcacJIIX5/AAAAAAAAAAAAAAAAAAAAACdaymn9eKgmmBgJyD9Fnk7IPG_7lENS6PpyDw-Rqh7t/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=LVmPmrr9Gx%2BvzBhKJR28GutLCWI%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>저렇게 X 표시가 되어있으면, 추가적인 권한이 있지 않아도 소유자의 권한인 rws 권한을 활용할 수 있따는 것. 그래서 내가 bandit20-do에 관한 권한이 있지 않아도 일단 소유자의 권한으로 실행을 할 수 있다는 것!!</p>
  <p>자 정리해보면</p>
  <p>1. ls -al을 활용해서 파일 소유자로 실행할 수 있는 setuid, 그룹명으로 실행할 수 있는 setgid등을 확인한다.</p>
  <p>2. setuid가 세팅된 파일이 있으면 bandit19가 실행해도 해당 파일이 실행되면서 내부 명령을 실행하면 bandit20 으로 실행 됨.</p>
</div>

<div class="bw-panel bw-p20">
  <span class="bw-done">solved</span>
  <h3>Level 20 → 21</h3>
  <p>https://sarc.io/index.php/forum/tips/1915-openssl-s-client-getaddrinfo-servname-not-supported-for-ai-socktype</p>
  <img src="https://blog.kakaocdn.net/dna/csGCkt/dJMcaiXoCZ9/AAAAAAAAAAAAAAAAAAAAAMiWs2IWeWGpGvsM6_fK6qyNTOk0sK_WnkNSH_lm-NCm/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=L2lMHpPBOvrh6rLkWmgsWp35Tds%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그전이랑 비슷한 문제인데 ssh, openssl을 활용한 문제인 것 같다.</p>
  <img src="https://blog.kakaocdn.net/dna/cpXtHv/dJMcab445jD/AAAAAAAAAAAAAAAAAAAAALmLYV934OycBJcUeSCkLcUxwpkrRUW1MHyqwxeVpcO8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=j6CyI7hKUrg5C5jyfNv5AwAFQn0%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>위에 있는 캡처본을 가져온 이유는 해당 오류가 생겨서 왜 오류가 있지? 싶어서 찾아봤다. 음.. 그렇게 해서</p>
  <img src="https://blog.kakaocdn.net/dna/cI4tbo/dJMcadogE00/AAAAAAAAAAAAAAAAAAAAADjy0rGCX37bEiV6Gvw2l6b9p_8GcMZTEyGGCZ3hQ1BZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=thRPO8USbm7UPFlr47aoEfNZQwo%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>해당 문제를 보게 되면 자체 네트워크 데몬에 연결해보라. 그러면 내가 서버랑 클라이언트를 둘 다 띄워야하는건가?? 싶어서</p>
  <img src="https://blog.kakaocdn.net/dna/b8Uwne/dJMcaib6cnb/AAAAAAAAAAAAAAAAAAAAAJVydZvDfEUHtIK_TncR9BpanzXYn6XXo-NLc28KE38Y/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=L2NideijG3v2fiaVwyDaO7eElto%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>nc -lp를 활용해서</p>
  <p>-l : 리스닝을 통해 nc를 서버로 동작시키고 연결을 대기</p>
  <p>-p: 연결을 위해 사용할 포트 번호를 지정.</p>
  <p>아무 포트( 지금 열리지 않은 포트)를 열어서 접속 시킨 후, 20단계를 위해서 사용한 키를 활용하면 저렇게 응답이 나오는 것을 확인할 수 있다.</p>
</div>

<div class="bw-panel bw-p21">
  <span class="bw-done">solved</span>
  <h3>Level 21 → 22</h3>
  <img src="https://blog.kakaocdn.net/dna/DPYIj/dJMcacpoIzb/AAAAAAAAAAAAAAAAAAAAAKfPbIfpx_9vm0uzl02CLnIbMcOrRb0oNPRKN9cArpyJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=T%2FTPtEO9Z%2BrVeszLIdAExGs32jA%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>약간 무지성으로 푼 것 같긴 한데, 이것 저것 파일들을 보다가</p>
  <p>crowntab 자체가</p>
  <img src="https://blog.kakaocdn.net/dna/czkbbD/dJMcaarAAQt/AAAAAAAAAAAAAAAAAAAAAOhwEwnyk7QuUHFXAkew-UZXk7OPcLoipRPc15xE9hRe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=%2FVzx5l%2BognQKDwgeewO81PK15dU%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>아래 사진처럼 매분 /usr/bin/cronjob_bandit22.sh &amp;&gt; /dev/null 을 실행하는 것 이다.</p>
  <img src="https://blog.kakaocdn.net/dna/pJUSZ/dJMcagL7kzD/AAAAAAAAAAAAAAAAAAAAAOhqZEQOP2Ld7NEgwAwOqO-F6wBcX4_83g6N-TWN8iuA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=ZieT0h8WWGlj6lhJP9gFLe53P5I%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그래서 /usr/bin/cronjob_nadit22.sh을 실제로 cat을 해봤더니, /etc/bandit_pass/bandit22에 대한 cat 응답 값을 /tmp/t~에 저장하고 있는 것을 확인. 그래서 해당 파일을 cat 했더니 실제로 답이 나왔다!!!!</p>
  <p>정리하자면</p>
  <p>1. cron이 주기적으로 실행하는 스크립트를 확인해야함.</p>
  <p>2. 그래서 /etc/cron.d 파일을 확인</p>
  <p>3. cron이 주기적으로 실행하는 스크립트에 /usr/bin/cronjob_bandit22.sh과 같은 파일의 연관성 확인.</p>
  <p>4. 그러면 실제로 /usr/bin/cronjob_bandit22.sh 해당 파일을 cat.</p>
  <p>5. /usr/bin/cronjob_bandit22.sh 파일에서 나온 것은 cat /etc/bandit_pass/bandit22 &gt; /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv 부분.</p>
  <p>6. 그러면 pasword를 해당 tmp에 저장한다는 거니까 해당 파일을 cat.</p>
  <p>7. 짜잔~답!</p>
</div>

<div class="bw-panel bw-p22">
  <span class="bw-done">solved</span>
  <h3>Level 22 → 23</h3>
  <img src="https://blog.kakaocdn.net/dna/mkrFh/dJMcacCWEnF/AAAAAAAAAAAAAAAAAAAAAMbsgk8VQMiSfYhkG2f2xdpni85rE_okKJljwv78kGpa/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=wsdKmjeSD8S1FF7uI635GtY%2BIwA%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <img src="https://blog.kakaocdn.net/dna/E95y0/dJMcaiC7RSX/AAAAAAAAAAAAAAAAAAAAAKE2IvIHUPgoV_LXfmBr6cnoj48Qt4GezAqmKUxkIZf6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=I%2Fu9SE4NcIr8s9VH27G1d0yL%2F88%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>와 처음에는 해당 쉘 스크립트의 위만 보고 echo "I am user bandit22"를 해쉬값으로 바꾼 저 값이 정답일 줄 알았는데, 뒤에 있는 값들을 더 보니까 해당 해쉬값을 이용해서 /tmp/ ( ) 이 괄호 안에 값을 넣는 거였음..</p>
  <img src="https://blog.kakaocdn.net/dna/kVSU4/dJMcabRxFyL/AAAAAAAAAAAAAAAAAAAAAOt3odaqNgtYaAmeRXHP01KTPOb-YYMEkzcT5yxOdstm/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=kkhjWl0%2Fu0Iu7i5UC5Kq8DxRo2M%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>!! 정답!!</p>
  <p>위와 흐름이 비슷하긴 한데, md5sum을 활용하여 해쉬값을 내가 직접 추론하는 과정이다.</p>
  <p>1. myname은 직접 whoami를 확인해서 bandit22이라는 것을 확인.</p>
  <p>2. mytarget에 값이 들어가는데, 그 값은 I am user bandit22를 해쉬처리 하고, 한 줄에서 공백 기준으로 맨 앞 단어만 뽑아오는 처리.</p>
  <p>3. 해당 해쉬값에 다가 다음 단계의 명령어를 집어넣었음.</p>
</div>

<div class="bw-panel bw-p23">
  <span class="bw-done">solved</span>
  <h3>Level 23 → 24</h3>
  <img src="https://blog.kakaocdn.net/dna/bKahs1/dJMcaaSFbSH/AAAAAAAAAAAAAAAAAAAAAC2RtqUkzoHBjVCoSRYCBY-R-GQyFaynGdfdNLJ3b_pS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=F%2FjMT8UhqIbC8myBD3lQKzRqyNY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>일단 이거 해석 해보면..</p>
  <p>/var/spool/bandit24/foo로 이동하고, *는 일반 파일/디렉토리 이름을 의미하고, .*는 숨김 파일까지 포함하려고 넣은 거라 모든 파파일들에 대해서 확인하는 것. 그리고 owner가 bandit23이면 실행하는 것?...??</p>
  <img src="https://blog.kakaocdn.net/dna/egLhIX/dJMcaaLTdOO/AAAAAAAAAAAAAAAAAAAAACPu-1-BJ4a55yGi6khvOSpgfblabIeMsSU7UIa0cl05/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=V9mG3U8yZf%2FT%2BdRk35ASHl40LOU%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>실제로 vim을 통해서 뭔가 저장하면, 권한에 관한 오류는 뜨지 않는다. 그러면 내가 뭘.. 해야하는거지?</p>
  <img src="https://blog.kakaocdn.net/dna/bpfymR/dJMcadIyyB5/AAAAAAAAAAAAAAAAAAAAACqdpfdcXUy-OsIuhPPvSN4DL3DRDwc8W5RRPXe0G3mf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=2ptlnzmsZsPNDMDZLYEDqpKVknY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>보통 이것처럼, /etc/bandit_pass에 bandit의 비밀번호가 있는 것을 알 수 있음.</p>
  <p>그래서 .sh 파일에 cat /etc/bandit_pass/bandit23 &gt; /tmp/test.txt로 하면, 저 .sh 커맨드가 알아서 해당 .sh를 실행해줌!</p>
  <img src="https://blog.kakaocdn.net/dna/b6MPFT/dJMcagL7kQX/AAAAAAAAAAAAAAAAAAAAAI8nL9n-MDWuJWUZ1k3LT-8rrIfm1Cz8Ytzg_vQ0bF7V/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=pXnxH8dYYqL890u4ALBvQdinSwY%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>짜란</p>
</div>

<div class="bw-panel bw-p24">
  <span class="bw-done">solved</span>
  <h3>Level 24 → 25</h3>
  <img src="https://blog.kakaocdn.net/dna/botNTG/dJMcaaZoMQE/AAAAAAAAAAAAAAAAAAAAACr_315jO91fa7UvPgE53f0aa8j1lEPSuix_raRS5ne4/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=rpIpy9P4MUhQZzCelaeH%2B%2FfYqaA%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <img src="https://blog.kakaocdn.net/dna/Oru9D/dJMcahK009f/AAAAAAAAAAAAAAAAAAAAAAj-qoe55xDbK3W6Zl0nlk5INvk5y5YMNCmE73OWaaTe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=J0HvYg4XXYVViOFAIa7SD%2Fuzrko%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>그냥 전사 공격하는 쉘을 만들고, 해당 쉘을 통해서 실제 공격을 하는 것.. 그래서 코드로 저렇게 정답셋을 만들고 이제 공격 시작!!!</p>
  <img src="https://blog.kakaocdn.net/dna/6dJEq/dJMcadBKxrf/AAAAAAAAAAAAAAAAAAAAAIvdtL3BoCqW-TaITeZcIeoCJGQ_zq3v6Aip_iA_Zg2i/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=HlxK3G5T1aY6s3RkWJGFxv412iU%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>히히 성공</p>
  <img src="https://blog.kakaocdn.net/dna/b7TwRk/dJMcafTXTWq/AAAAAAAAAAAAAAAAAAAAAM2xuq9WPWgP3kY_hoij6WcsUAlB0Xx7YImxGPp4V892/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=VWw%2FX4qpbS7v6Ye1rv97iGL0PEg%3D" loading="lazy" alt="" style="max-width:100%;border-radius:6px;border:1px solid oklch(0.28 0.04 225/0.45);margin:.75rem 0;display:block">
  <p>이렇게 응답 시작햇음!!</p>
  <p>정리를 하자면</p>
  <p>1. Bandit 24 → 25는 현재 비밀번호 + 4자리 PIN code를 localhost:30002에 보내야 하는 문제다.</p>
  <p>2. 그래서 4자리 PIN code를 1~9999까지 내가 다..하기에는 너무 그러니까 첫 번째 사진과 같이 PIN 번호 셋을 만들어줌</p>
  <p>3. cat을 활용해서 wjdeka(정답).txt의 출력값을 nc localhost 30002로 보내면서 문제 해결!</p>
  <p>후.. 이제 다 끝났ㅏ..</p>
</div>

</div>
