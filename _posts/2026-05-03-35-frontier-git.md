---
layout: post
title: "프론티어_git"
date: 2026-05-03 00:21:00
desc: "git 명령어 모음"
keywords: "프론티어_git,Development,git"
categories: [Development]
tags: ["git"]
icon: fa-terminal
---

> Source: [https://sanghole.tistory.com/35](https://sanghole.tistory.com/35)

<p data-ke-size="size16">&nbsp;</p>
<h2 data-ke-size="size26">git 명령어 모음</h2>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="904" data-origin-height="822"><span><img src="https://blog.kakaocdn.net/dna/VskRR/dJMcafGrGhx/AAAAAAAAAAAAAAAAAAAAAOuWzPFzjGcKZBGgaN4ijcZOetcNZfT6YazrsKK-nVfc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=MSMZZt1Jq0llEMI6id4hNZPqSso%3D" loading="lazy" width="904" height="822" data-origin-width="904" data-origin-height="822"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">원래는 그림 하나 하나 옮겨가면서 정리를 하려고 했는데 그건 너무 양이 많아질 것 같아서</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">정리 정도만</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777472751909" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git commit</code></pre>
<p data-ke-size="size16">"현재 브랜치" 위에 새로운 커밋을 만든다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git commit -m "커밋 메시지"&nbsp;</p>
<p data-ke-size="size16">=&gt; 커밋 메시지를 바로 적어서 커밋.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git commit -amend&nbsp; &nbsp;&nbsp;</p>
<p data-ke-size="size16">=&gt; 가장 최근 커밋을 수정한다. 커밋 메시지나 커밋 내용을 다시 고칠 때 사용</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777473129533" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git branch [브랜치명]</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">현재 커밋 위치에 새 브랜치를 만든다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git branch -f [브랜치명][커밋/브런치]</p>
<p data-ke-size="size16">-&gt; 특정 브랜치가 가리키는 위치를 강제로 옮김.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777473182633" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git checkout [브랜치명]</code></pre>
<p data-ke-size="size16">해당 브랜치로 이동한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">여기서 문제는 여러 가지 checkout의 활용본이 나오는데..</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git checkout HEAD^</p>
<p data-ke-size="size16">현재 커밋의 부모 커밋으로 이동</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git checkout HEAD^^</p>
<p data-ke-size="size16">현재 커밋에서 부모의 부모 커밋으로 이동.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git cehckout [브랜치명]~[n]</p>
<p data-ke-size="size16">해당 브랜치 기준으로 n칸 위의 조상 커밋으로 이동한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp; EX) git checkout main~3 -&gt; main 브랜치가 가리키는 커밋에서 3칸 위로 이동하기.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777473351938" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git merge [브랜치명]</code></pre>
<p data-ke-size="size16">현재 브랜치에 다른 브랜치의 내용을 합친다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><a href="https://git-scm.com/book/ko/v2/Git-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EB%B8%8C%EB%9E%9C%EC%B9%98%EC%99%80-Merge-%EC%9D%98-%EA%B8%B0%EC%B4%88" target="_blank" rel="noopener noreferrer">https://git-scm.com/book/ko/v2/Git-브랜치-브랜치와-Merge-의-기초</a></p>
<p data-ke-size="size16">&nbsp;</p>
<div style="background-color: #333333; color: #b3b1b1; text-align: start;">&nbsp;</div>
<div style="background-color: #333333; color: #b3b1b1; text-align: start;">
<p data-ke-size="size16">실제 개발과정에서 겪을 만한 예제를 하나 살펴보자. 브랜치와 Merge는 보통 이런 식으로 진행한다.</p>
</div>
<div style="background-color: #333333; color: #b3b1b1; text-align: start;">
<ol style="list-style-type: decimal;" data-ke-list-type="decimal">
<li>웹사이트가 있고 뭔가 작업을 진행하고 있다.</li>
<li>새로운 이슈를 처리할 새 Branch를 하나 생성한다.</li>
<li>새로 만든 Branch에서 작업을 진행한다.</li>
</ol>
</div>
<div style="background-color: #333333; color: #b3b1b1; text-align: start;">
<p data-ke-size="size16">이때 중요한 문제가 생겨서 그것을 해결하는 Hotfix를 먼저 만들어야 한다. 그러면 아래와 같이 할 수 있다.</p>
</div>
<div style="background-color: #333333; color: #b3b1b1; text-align: start;">
<ol style="list-style-type: decimal;" data-ke-list-type="decimal">
<li>새로운 이슈를 처리하기 이전의 운영(Production) 브랜치로 이동한다.</li>
<li>Hotfix 브랜치를 새로 하나 생성한다.</li>
<li>수정한 Hotfix 테스트를 마치고 운영 브랜치로 Merge 한다.</li>
<li>다시 작업하던 브랜치로 옮겨가서 하던 일 진행한다.</li>
</ol>
</div>
<p data-ke-size="size16">git merge에 대해서 검색하니까 실제로 git에서 올린 문서가 있어서 확인해보았다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">조금 더 자세하게 해보자면..</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git merge --continue&nbsp;</p>
<p data-ke-size="size16">-&gt; 충돌을 해결한 뒤 merge를 계속 진행</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git merge --abort&nbsp;</p>
<p data-ke-size="size16">-&gt;merge 충돌 났을 때 취소하기</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git merge --no-ff bugFix</p>
<p data-ke-size="size16">-&gt; merge commit 남기면서 합치기</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">EX) git branch bugWork main~^2~</p>
<p data-ke-size="size16">1. main에서 한 칸 위로 이동</p>
<p data-ke-size="size16">2. 그 커밋의 두 번째 부모로 이동</p>
<p data-ke-size="size16">3. 다시 한 칸 위로 이동한 위치에 bugWork 브랜치를 만들기.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777732900586" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git rebase[브랜치명]</code></pre>
<p data-ke-size="size16">현재 브랜치의 베이스를 해당 브랜치의 최신 커밋 뒤로 옮기는 작업.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git rebase [기준브랜치][옮길브랜치]</p>
<p data-ke-size="size16">옮길브랜치를 기준브랜치 위로 rebase한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><a href="https://brunch.co.kr/@anonymdevoo/7" target="_blank" rel="noopener noreferrer">https://brunch.co.kr/@anonymdevoo/7</a></p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">정확한 merge와 rebase의 차이점을 알아보기 위해서 더 찾아보았다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="695" data-origin-height="236"><span><img src="https://blog.kakaocdn.net/dna/JcQg7/dJMcagk3qwh/AAAAAAAAAAAAAAAAAAAAAHwFWzdAK484o2zM5XxE4oI6lQclJc7SOPrXy8f47w8Y/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ogHxAbQZH2YCVU49uV%2BVU1AHuVo%3D" loading="lazy" width="695" height="236" data-origin-width="695" data-origin-height="236"/></span></figure>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="701" data-origin-height="201"><span><img src="https://blog.kakaocdn.net/dna/cJZxBH/dJMcac30WXD/AAAAAAAAAAAAAAAAAAAAAAUyytjkYJ3mSblnibW0wBeXQCzD0iNuUmhG_IUGYnSf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=AZqdvOlLlinwPO32vMSXBOvlJY8%3D" loading="lazy" width="701" height="201" data-origin-width="701" data-origin-height="201"/></span></figure>
</p>
<p data-ke-size="size16">좋은 예시를 들어주신 것 같아서..</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">처음은 merge이고 2번째는 rebase이다.&nbsp;</p>
<p data-ke-size="size16">위 그림은 merge 방식이라 bts-image 브랜치의 변경사항을 master에 합치면서 새로운 merge commit(B123456) 이 생긴다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">아래 그림은 rebase 방식이라 bts-image의 시작점을 master 최신 커밋 뒤로 옮겨서, 커밋 히스토리가 한 줄처럼 깔끔하게 이어진다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">merge방식은 기록 보존에는 좋지만, 히스토리가 복잡해질 수도 있다.</p>
<p data-ke-size="size16">rebase는 히스토리는 깔끔하지만 이미 공유한 커밋에는 조심해서 써야한다.</p>
<p data-ke-size="size16">보통 히스토리를 남기기 좋아하는 개발자(?) 특성상 merge 방식을 쓴다고 알고있다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">추가적인 rebase 활용법</p>
<p data-ke-size="size16">&nbsp;</p>
<pre class="bash" data-ke-language="bash"><code>git rebase -i [기준커밋]</code></pre>
<p data-ke-size="size16">기준 커밋 이후의 커밋들을 편집할 수 있따.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">EX)</p>
<p data-ke-size="size16">git rebase -i HEAD~3</p>
<p data-ke-size="size16">-&gt;최근 3개 커밋을 대상으로 rebase.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git rebase -i main</p>
<p data-ke-size="size16">-&gt; main 이후에 쌓인 현재 브랜치의 커밋들을 편집한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777733254224" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git revert [커밋]</code></pre>
<p data-ke-size="size16">특정 커밋의 변경분을 되돌리는 새 커밋을 만든다.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777733280276" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git cherry-pick [커밋]</code></pre>
<p data-ke-size="size16">특정 커밋 하나만 현재 브랜치 위로 복사해서 가져온다.</p>
<p data-ke-size="size16">EX)</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git cherry-pick C2</p>
<p data-ke-size="size16">-&gt; C2 커밋의 변경사항만 현재 브랜치에 가져온다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git cherry-pick C2 C4 C7</p>
<p data-ke-size="size16">-&gt; 여러 커밋을 순서대로 현재 브랜치에 가져온다.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777733678558" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git tag [태그명] [커밋]</code></pre>
<p data-ke-size="size16">특정 커밋에 태그를 붙일 수 있다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">+ 같이 쓰면 git tag v1 C2 /&nbsp; git checkout v1</p>
<p data-ke-size="size16">이런 식?</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777733720348" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git describe [커밋/브랜치/태그]</code></pre>
<p data-ke-size="size16">EX)</p>
<p data-ke-size="size16">git describe HEAD</p>
<p data-ke-size="size16">-&gt; 현재 위치를 태그 기준으로 설정.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">git descrive main</p>
<p data-ke-size="size16">-&gt; main 브랜치가 가리키는 커밋을 태그 기준으로 설명</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="897" data-origin-height="401"><span><img src="https://blog.kakaocdn.net/dna/5AQJr/dJMcadIBqsm/AAAAAAAAAAAAAAAAAAAAAHK4mP5htD88iZnnrr4G2SugnTwkmKqlbgmUJ7gHT-im/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=9dgzC%2FxSdSeLd4xE4aSvCt3JQHo%3D" loading="lazy" width="897" height="401" data-origin-width="897" data-origin-height="401"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><s>내 기준에서는 어려워서 답을 조금..봤다</s></p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777733944193" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git clone</code></pre>
<p data-ke-size="size16">원격 저장소 복제</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777733954940" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git fetch</code></pre>
<p data-ke-size="size16">원격 저장소의 변경사항을 가져오지만! 내 현재 브랜치에는 합치지 아니한다..</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777733979384" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git pull --rebase</code></pre>
<p data-ke-size="size16">원격 변경사항을 가져온 뒤, 내 커밋을 그 위에 rebase한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777734004337" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git push</code></pre>
<p data-ke-size="size16">내 로컬 커밋을 원격 저장소에 올린다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">문제 3개 정도만 풀고 내는 걸로</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imagegridblock">
  <div class="image-container"><span data-origin-width="693" data-origin-height="332"><img src="https://blog.kakaocdn.net/dna/cthHb0/dJMcadhzOUt/AAAAAAAAAAAAAAAAAAAAAG4w6rxLWPRbB-KOYDrEHWreOdJp6049nzUKkzgsg8lN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=T55sIPrz4%2F4%2FSJIvc68CrRCkrQc%3D" loading="lazy" width="693" height="332"/></span><span data-origin-width="390" data-origin-height="648"><img src="https://blog.kakaocdn.net/dna/op3bw/dJMcaad6nrK/AAAAAAAAAAAAAAAAAAAAAGQ9b05qwIzDvQZwoQs6OJ0K5MrIplRdSzVD1naItPYS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=%2F7%2BhYyvoIZ6Kjiy2bwi0q6WmE2I%3D" loading="lazy" width="390" height="648"/></span></div>
</figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">왼쪽의 상태를 오른쪽 처럼 바꾸면 되는 것이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre class="maxima"><code>git push origin main</code></pre>
<p data-ke-size="size16">일단 로컬의main 브랜치가 가리키는 커밋을 원격 저장소 origin의 main 브랜치로</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="629" data-origin-height="347"><span><img src="https://blog.kakaocdn.net/dna/cRXASN/dJMcahYzEn7/AAAAAAAAAAAAAAAAAAAAAFVddaSF2rmXecuPxfmn-G7ZxXODQ-Bajr5r8Dcr20az/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=U%2BdOxwLYwg6mMWV5tExYApjzaI8%3D" loading="lazy" width="629" height="347" data-origin-width="629" data-origin-height="347"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<pre class="maxima"><code>git push origin foo</code></pre>
<p style="color: #333333; text-align: start;" data-ke-size="size16">&nbsp;그 후에는 로컬의 foo 브랜치가 가리키는 커밋을 원격 저장소 origin의 foo 브랜치로</p>
<p data-ke-size="size16">그럼 해결!!</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="787" data-origin-height="723"><span><img src="https://blog.kakaocdn.net/dna/eCKuJq/dJMcacCZvU3/AAAAAAAAAAAAAAAAAAAAAI_8y9hk3wv5GQTIYNkI9ilJVzphjYdkd__btqW63FGK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=pIdsqEgZYz6c5X%2BvBw1zJVs5V0g%3D" loading="lazy" width="787" height="723" data-origin-width="787" data-origin-height="723"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">일단 먼저</p>
<pre class="bash" data-ke-language="bash"><code>git rebase -i HEAD~2 --solution-ordering C3,C2</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>최근 2개 커밋 C2, C3을 대상으로 rebase를 실행하여 </span><span>커밋 순서를 C3 &rarr; C2로 바꾼다.</span><br /><span>그래서 amend할 대상인 C2를 가장 위, 즉 HEAD 위치로 올린다.</span></p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="638" data-origin-height="419"><span><img src="https://blog.kakaocdn.net/dna/DFG4A/dJMcag6rAAs/AAAAAAAAAAAAAAAAAAAAAOUy8vf8lsvyL265Okm8ljrf0MAnFVlc9avxeH_V7Oxw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=Y4yn5dv2IYJV4hGmSzaUj0k0o9U%3D" loading="lazy" width="638" height="419" data-origin-width="638" data-origin-height="419"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그 후 git commit --amend를 통해 현재 HEAD가 가르키는 C2'를 C2''가 되도록 추가적인 커밋을 해준다.</p>
<p data-ke-size="size16">C2와 같은 커밋이 아니라 수정된 커밋인 C2''를 goal에서 원했기 때문...</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="492" data-origin-height="421"><span><img src="https://blog.kakaocdn.net/dna/blr9XY/dJMcafNgCqw/AAAAAAAAAAAAAAAAAAAAAAlVTehSVsHbFWpu6gg3KFZS46d7GAOhqin3uxahVGFQ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=SFG5K8Yl9w3%2FvamZffTpYsTwvbY%3D" loading="lazy" width="492" height="421" data-origin-width="492" data-origin-height="421"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1777735185089" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>git rebase -i HEAD~2 --solution-ordering C2'',C3'</code></pre>
<p data-ke-size="size16"><span>다시 최근 2개 커밋을 대상으로 rebase를 실행하여서 </span><span>커밋 순서를 C2'' &rarr; C3'로 다시 정리한다.</span><br /><span>수정된 newImage 커밋 위에 caption 커밋이 오도록 만든다.</span></p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이제 마지막!!</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="531" data-origin-height="476"><span><img src="https://blog.kakaocdn.net/dna/nZYuo/dJMcafGtIJy/AAAAAAAAAAAAAAAAAAAAADMPkhG1X9BkyJnblRMhJ4xPri8gWfd9zz29YFgRgoiH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ruc0nUcDbdqnRgZSnK8d3cs8TYQ%3D" loading="lazy" width="531" height="476" data-origin-width="531" data-origin-height="476"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>main 브랜치를 caption 브랜치 위로 rebase한다. </span><span>현재 구조에서는 fast-forward처럼 main이 caption 위치로 이동한다.</span><br /><span>결과적으로 main과 caption이 같은 커밋을 가리키게 된다.</span></p>
