---
layout: post
title: 프론티어_AFL 코드 분석
date: 2026-05-26
desc: "AFL(American Fuzzy Lop) 소스코드 분석 - afl-showmap, main함수, fuzz_one, coverage 수집, trimming"
keywords: "AFL, fuzzing, 퍼징, 코드분석, afl-showmap, coverage, 프론티어"
categories: [TechnicalDocument]
tags: [AFL, 퍼징, 프론티어, 코드분석]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/50](https://sanghole.tistory.com/50)

<p data-ke-size="size16">AFL 코드 분석을 위해서 해당 사이트에서 실제로 AFL 코드를 clone받아 하나씩 뜯어본다.</p>
<p data-ke-size="size16"><a href="https://github.com/google/AFL/issues" target="_blank" rel="noopener&nbsp;noreferrer">https://github.com/google/AFL/</a></p>
<figure id="og_1779759438333" contenteditable="false" data-ke-type="opengraph" data-ke-align="alignCenter" data-og-type="object" data-og-title="GitHub - google/AFL: american fuzzy lop - a security-oriented fuzzer" data-og-description="american fuzzy lop - a security-oriented fuzzer. Contribute to google/AFL development by creating an account on GitHub." data-og-host="github.com" data-og-source-url="https://github.com/google/AFL/issues" data-og-url="https://github.com/google/AFL" data-og-image="https://blog.kakaocdn.net/dna/BsSn8/dJMb9iINefQ/AAAAAAAAAAAAAAAAAAAAAPLGFFRdhtt3Xi7yLRlT2r_5wAm330weO0aImLHgcFC1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=xPBNUb4vx9hn%2BymEKopFd7ZW5TU%3D"><a href="https://github.com/google/AFL/issues" target="_blank" rel="noopener" data-source-url="https://github.com/google/AFL/issues">
<div class="og-image" style="background-image: url('https://blog.kakaocdn.net/dna/BsSn8/dJMb9iINefQ/AAAAAAAAAAAAAAAAAAAAAPLGFFRdhtt3Xi7yLRlT2r_5wAm330weO0aImLHgcFC1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=xPBNUb4vx9hn%2BymEKopFd7ZW5TU%3D');">&nbsp;</div>
<div class="og-text">
<p class="og-title" data-ke-size="size16">GitHub - google/AFL: american fuzzy lop - a security-oriented fuzzer</p>
<p class="og-desc" data-ke-size="size16">american fuzzy lop - a security-oriented fuzzer. Contribute to google/AFL development by creating an account on GitHub.</p>
<p class="og-host" data-ke-size="size16">github.com</p>
</div>
</a></figure>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="547" data-origin-height="151"><span data-url="https://blog.kakaocdn.net/dna/ca86lB/dJMcagFGgnO/AAAAAAAAAAAAAAAAAAAAAKvAbRrXjuzYNqfOGnECD_AiLpVN4MQiylgr5FALaDNz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=arxuBp7%2FAvhN9iqcEBi%2Fvi4DFW4%3D" data-phocus="https://blog.kakaocdn.net/dna/ca86lB/dJMcagFGgnO/AAAAAAAAAAAAAAAAAAAAAKvAbRrXjuzYNqfOGnECD_AiLpVN4MQiylgr5FALaDNz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=arxuBp7%2FAvhN9iqcEBi%2Fvi4DFW4%3D"><img src="https://blog.kakaocdn.net/dna/ca86lB/dJMcagFGgnO/AAAAAAAAAAAAAAAAAAAAAKvAbRrXjuzYNqfOGnECD_AiLpVN4MQiylgr5FALaDNz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=arxuBp7%2FAvhN9iqcEBi%2Fvi4DFW4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fca86lB%2FdJMcagFGgnO%2FAAAAAAAAAAAAAAAAAAAAAKvAbRrXjuzYNqfOGnECD_AiLpVN4MQiylgr5FALaDNz%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DarxuBp7%252FAvhN9iqcEBi%252Fvi4DFW4%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="547" height="151" data-origin-width="547" data-origin-height="151"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">일단 make를 해준 뒤 실제로 작동하는지 확인을 해준다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그 후 AFL을 실행하면서 하나씩 어떻게 돌아가는지 확인을 하고 싶어서 gpt에게 간단한 코드를 짜달라고 한다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="832" data-origin-height="658"><span data-url="https://blog.kakaocdn.net/dna/lpAcI/dJMcadviMxH/AAAAAAAAAAAAAAAAAAAAAMNWMYx_tUgABN4kKXN_MtJ2tLR5pwvovKGYMtGbuyas/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=btAXqsvxCNnUy%2BeeJaAEnaC3HGk%3D" data-phocus="https://blog.kakaocdn.net/dna/lpAcI/dJMcadviMxH/AAAAAAAAAAAAAAAAAAAAAMNWMYx_tUgABN4kKXN_MtJ2tLR5pwvovKGYMtGbuyas/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=btAXqsvxCNnUy%2BeeJaAEnaC3HGk%3D"><img src="https://blog.kakaocdn.net/dna/lpAcI/dJMcadviMxH/AAAAAAAAAAAAAAAAAAAAAMNWMYx_tUgABN4kKXN_MtJ2tLR5pwvovKGYMtGbuyas/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=btAXqsvxCNnUy%2BeeJaAEnaC3HGk%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FlpAcI%2FdJMcadviMxH%2FAAAAAAAAAAAAAAAAAAAAAMNWMYx_tUgABN4kKXN_MtJ2tLR5pwvovKGYMtGbuyas%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DbtAXqsvxCNnUy%252BeeJaAEnaC3HGk%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="832" height="658" data-origin-width="832" data-origin-height="658"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="803" data-origin-height="132"><span data-url="https://blog.kakaocdn.net/dna/cmGlwA/dJMcacwutkN/AAAAAAAAAAAAAAAAAAAAAPM-7vgLLZogzCsdPQCLbpAeTylrlyVHZyGibX8ZQf94/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=a2QXJFAeTzCLAaAleuC3t2L7toI%3D" data-phocus="https://blog.kakaocdn.net/dna/cmGlwA/dJMcacwutkN/AAAAAAAAAAAAAAAAAAAAAPM-7vgLLZogzCsdPQCLbpAeTylrlyVHZyGibX8ZQf94/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=a2QXJFAeTzCLAaAleuC3t2L7toI%3D"><img src="https://blog.kakaocdn.net/dna/cmGlwA/dJMcacwutkN/AAAAAAAAAAAAAAAAAAAAAPM-7vgLLZogzCsdPQCLbpAeTylrlyVHZyGibX8ZQf94/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=a2QXJFAeTzCLAaAleuC3t2L7toI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcmGlwA%2FdJMcacwutkN%2FAAAAAAAAAAAAAAAAAAAAAPM-7vgLLZogzCsdPQCLbpAeTylrlyVHZyGibX8ZQf94%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Da2QXJFAeTzCLAaAleuC3t2L7toI%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="803" height="132" data-origin-width="803" data-origin-height="132"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">AFL instrumentation을 넣기 위해서는 ./afl-gcc를 활용해야한다. instrumentation을 넣는 이유는 커버리지 퍼징을 지향하는 afl에서 커버리지 측정을 하기 위해서 넣는 것 이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="883" data-origin-height="659"><span data-url="https://blog.kakaocdn.net/dna/SK219/dJMcahYPOSZ/AAAAAAAAAAAAAAAAAAAAAI-m_1QQWKsbOfPo__rKsOFJD9Yqe4KwpWuHrnFU_6Ew/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=SomC8DceIwSlj8XRvHEy8p%2FPXBM%3D" data-phocus="https://blog.kakaocdn.net/dna/SK219/dJMcahYPOSZ/AAAAAAAAAAAAAAAAAAAAAI-m_1QQWKsbOfPo__rKsOFJD9Yqe4KwpWuHrnFU_6Ew/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=SomC8DceIwSlj8XRvHEy8p%2FPXBM%3D"><img src="https://blog.kakaocdn.net/dna/SK219/dJMcahYPOSZ/AAAAAAAAAAAAAAAAAAAAAI-m_1QQWKsbOfPo__rKsOFJD9Yqe4KwpWuHrnFU_6Ew/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=SomC8DceIwSlj8XRvHEy8p%2FPXBM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FSK219%2FdJMcahYPOSZ%2FAAAAAAAAAAAAAAAAAAAAAI-m_1QQWKsbOfPo__rKsOFJD9Yqe4KwpWuHrnFU_6Ew%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DSomC8DceIwSlj8XRvHEy8p%252FPXBM%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="883" height="659" data-origin-width="883" data-origin-height="659"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그 후 코드 흐름상 더 깊은 코드로 들어가기 위해서는 AFL이라는 문자열을 한 글자씩 다 맞아야 더 깊은 곳으로 들어갈 수 있다.</p>
<p data-ke-size="size16">그러면 실제로 seed를 A, AF, AFL로 설정을 해놓으면 점점 더 깊은 Captured가 뜨는 것을 확인할 수 있다.</p>
<h3 data-end="789" data-start="770" data-ke-size="size23"><span>./afl-showmap</span></h3>
<p data-ke-size="size16">여기서 사용한 명령어는 afl-showmap인데 AFL 도구 중 하나이다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="jboss-cli"><code>./afl-showmap</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div>&nbsp;</div>
<div>해당 도구의 역할은 target 프로그램을 한 번 실행하고 그때 찍힌 coverage map을 보여주거나 파일로 저장한다. 이걸 사용한 이유은지금은 퍼징을 오래 돌리는 것이 아니라 어떤 seed값에 따라서 어떻게 coverage가 증가하는지를 확인하고 싶어서 사용했다. 단 하나의 seed를 가지고 target coverage를 확인할 수 있는 명령어이다.</div>
<div>&nbsp;</div>
<div>&nbsp;</div>
<div><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="675" data-origin-height="398"><span data-url="https://blog.kakaocdn.net/dna/GUeNx/dJMcahYPPoJ/AAAAAAAAAAAAAAAAAAAAAI7435tx91LRfrcEWW3pyM1e5Lg4GL_Dt9KVk1J5stI2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=80ZiR1P4eX6JvXRhSir5PVTaIWs%3D" data-phocus="https://blog.kakaocdn.net/dna/GUeNx/dJMcahYPPoJ/AAAAAAAAAAAAAAAAAAAAAI7435tx91LRfrcEWW3pyM1e5Lg4GL_Dt9KVk1J5stI2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=80ZiR1P4eX6JvXRhSir5PVTaIWs%3D"><img src="https://blog.kakaocdn.net/dna/GUeNx/dJMcahYPPoJ/AAAAAAAAAAAAAAAAAAAAAI7435tx91LRfrcEWW3pyM1e5Lg4GL_Dt9KVk1J5stI2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=80ZiR1P4eX6JvXRhSir5PVTaIWs%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FGUeNx%2FdJMcahYPPoJ%2FAAAAAAAAAAAAAAAAAAAAAI7435tx91LRfrcEWW3pyM1e5Lg4GL_Dt9KVk1J5stI2%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D80ZiR1P4eX6JvXRhSir5PVTaIWs%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="675" height="398" data-origin-width="675" data-origin-height="398"/></span></figure>

<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">실제로 나온 MAP을 보면 a, af, afl 이렇게 증가할 수록 한 줄씩 커버리지가 추가되는 것을 확인할 수 있다. 그리고 값을 자세하게 보면 점점 값이 커지는 것도 확인할 수 있다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">실제로 coverage가 증가하는 건지, 어떤 seed를 넣었을 때 실제로 coverage가 증가하는 건지를 확인할 수 있었다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그러면 실제로 어떤 코드가 afl에 있을까?. 일단 큰 코드 구조들부터 확인해본다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h2 data-ke-size="size26">코드 구조</h2>
<pre id="code_1779773275977" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  ./afl-fuzz -i in -o out -- ./target</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">위에 있는 코드를 활용하여서 명령어를 입력하면 main함수로 들어간다.</p>
<p data-ke-size="size16">항상 코드의 첫 시작점은 main함수이다.&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="806" data-origin-height="463"><span data-url="https://blog.kakaocdn.net/dna/cMYHuF/dJMcahq2Szv/AAAAAAAAAAAAAAAAAAAAAHgVBa-uvK9rpkLOmX-MM4cde27A7F8PwFkLsn7XuOPP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=qozZVlkMhIeu8OD0sp26XGghgF0%3D" data-phocus="https://blog.kakaocdn.net/dna/cMYHuF/dJMcahq2Szv/AAAAAAAAAAAAAAAAAAAAAHgVBa-uvK9rpkLOmX-MM4cde27A7F8PwFkLsn7XuOPP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=qozZVlkMhIeu8OD0sp26XGghgF0%3D"><img src="https://blog.kakaocdn.net/dna/cMYHuF/dJMcahq2Szv/AAAAAAAAAAAAAAAAAAAAAHgVBa-uvK9rpkLOmX-MM4cde27A7F8PwFkLsn7XuOPP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=qozZVlkMhIeu8OD0sp26XGghgF0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcMYHuF%2FdJMcahq2Szv%2FAAAAAAAAAAAAAAAAAAAAAHgVBa-uvK9rpkLOmX-MM4cde27A7F8PwFkLsn7XuOPP%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DqozZVlkMhIeu8OD0sp26XGghgF0%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="806" height="463" data-origin-width="806" data-origin-height="463"/></span></figure>

<p data-ke-size="size16">&nbsp;</p>
</div>
</div>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">처음에는 argc를 확인하며 제대로 된 인자값들이 들어오는지 확인한 뒤에&nbsp;</p>
<pre id="code_1779773326927" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  argv[0] = ./afl-fuzz
  argv[1] = -i
  argv[2] = in
  argv[3] = -o
  argv[4] = out
  argv[5] = --
  argv[6] = ./target</code></pre>
<p data-ke-size="size16">이런 느낌으로 파싱이 된다.</p>
<p data-ke-size="size16">그 후 난수 설정을 하여 입력 변이, 스케줄링을 하고 각자 argv를 이용하여 AFL 옵션을 파싱한다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="838" data-origin-height="439"><span data-url="https://blog.kakaocdn.net/dna/c0ucmP/dJMcaffH3Wn/AAAAAAAAAAAAAAAAAAAAAIJUGEXfyUGwBZdtsSg2pbPGXLN9Ktwb6T7h9L6xWJxi/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=RkjI1VJHp%2F4x19R%2BnbfN9FddPqE%3D" data-phocus="https://blog.kakaocdn.net/dna/c0ucmP/dJMcaffH3Wn/AAAAAAAAAAAAAAAAAAAAAIJUGEXfyUGwBZdtsSg2pbPGXLN9Ktwb6T7h9L6xWJxi/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=RkjI1VJHp%2F4x19R%2BnbfN9FddPqE%3D"><img src="https://blog.kakaocdn.net/dna/c0ucmP/dJMcaffH3Wn/AAAAAAAAAAAAAAAAAAAAAIJUGEXfyUGwBZdtsSg2pbPGXLN9Ktwb6T7h9L6xWJxi/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=RkjI1VJHp%2F4x19R%2BnbfN9FddPqE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fc0ucmP%2FdJMcaffH3Wn%2FAAAAAAAAAAAAAAAAAAAAAIJUGEXfyUGwBZdtsSg2pbPGXLN9Ktwb6T7h9L6xWJxi%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DRkjI1VJHp%252F4x19R%252BnbfN9FddPqE%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="838" height="439" data-origin-width="838" data-origin-height="439"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">실제로 i, o가 없으면 코드 실행이 안 되도록 막아놓은 모습이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1779773984180" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  setup_signal_handlers(); 			
  check_asan_opts();        		
  fix_up_sync();					
  save_cmdline(argc, argv);
  fix_up_banner(argv[optind]);
  check_if_tty();
  get_core_count();
  bind_to_free_cpu();
  check_crash_handling();
  check_cpu_governor();
  setup_post();
  setup_shm();
  init_count_class16();
  setup_dirs_fds();
  read_testcases();
  load_auto();
  pivot_inputs();
  load_extras(extras_dir);
  find_timeout();
  detect_file_args(argv + optind + 1);
  setup_stdio_file();
  check_binary(argv[optind]);
  perform_dry_run(use_argv);</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그 후, 이런 함수들을 초기화 &amp; call하면서 fuzzing을 하는 기초를 준비한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">분류를 조금 해보자면</p>
<p data-ke-size="size16">&nbsp;</p>
<h4 data-ke-size="size20">1. 종료/환경 안전 장치</h4>
<pre id="code_1779774200054" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  setup_signal_handlers();          -&gt; Ctrl+C 등 시그널 처리 등록
  check_asan_opts();                -&gt; ASAN/MSAN 환경 확인
  check_crash_handling();           -&gt; crash 감지 방해 요소 확인
  check_cpu_governor();             -&gt; CPU 성능 모드 확인</code></pre>
<h4 data-ke-size="size20">&nbsp;</h4>
<p data-ke-size="size16">&nbsp;</p>
<h4 data-ke-size="size20">2. 병렬 fuzzing / 실행 정보 정리</h4>
<pre id="code_1779774247259" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  fix_up_sync();                    -&gt; 병렬 fuzzing sync 설정 정리
  save_cmdline(argc, argv);         -&gt; 실행 명령어 저장
  fix_up_banner(argv[optind]);      -&gt; 화면에 보여줄 이름 설정
  check_if_tty();                   -&gt; UI 출력 방식 결정</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<h4 data-ke-size="size20">3. CPU/ 성능 관련 초기화</h4>
<pre id="code_1779774268704" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  get_core_count();                 -&gt; CPU 코어 수와 사용량 확인
  bind_to_free_cpu();               -&gt; 비어 있는 CPU에 AFL 고정</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<h4 data-ke-size="size20">4. Coverage 수집 준비</h4>
<pre id="code_1779774289326" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  setup_shm();                      -&gt; shared memory coverage bitmap 생성
  init_count_class16();             -&gt; coverage count bucket 변환 테이블 초기화</code></pre>
<h4 data-ke-size="size20">5. 입력/출력&nbsp;</h4>
<pre id="code_1779774443768" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  setup_dirs_fds();                 -&gt; out 디렉터리 구조 생성
  read_testcases();                 -&gt; in 디렉터리 seed 읽기
  load_auto();                      -&gt; 자동 dictionary 로드
  pivot_inputs();                   -&gt; seed를 AFL queue 형식으로 정리
  load_extras(extras_dir);          -&gt; 사용자 dictionary 로드</code></pre>
<h4 data-ke-size="size20">6. 타겟 실행 방식 준비</h4>
<pre id="code_1779774486931" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  find_timeout();                   -&gt; 실행 timeout 결정
  detect_file_args(argv + optind + 1); -&gt; @@ 방식인지 확인
  setup_stdio_file();               -&gt; stdin 방식 입력 파일 준비
  check_binary(argv[optind]);       -&gt; 타겟 바이너리 검사</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이렇게 준비가 다 되면 실제로 fuzzing을 하는 단계로 접어든다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="787" data-origin-height="430"><span data-url="https://blog.kakaocdn.net/dna/F3TnD/dJMb997AkZ1/AAAAAAAAAAAAAAAAAAAAAPVTq2W5QnAuN9CQd8Gm2Rz5rqFpTXX2XY_QCuOk5gK9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=BIQxrFnHGLEHzFclbnUnsevl%2B20%3D" data-phocus="https://blog.kakaocdn.net/dna/F3TnD/dJMb997AkZ1/AAAAAAAAAAAAAAAAAAAAAPVTq2W5QnAuN9CQd8Gm2Rz5rqFpTXX2XY_QCuOk5gK9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=BIQxrFnHGLEHzFclbnUnsevl%2B20%3D"><img src="https://blog.kakaocdn.net/dna/F3TnD/dJMb997AkZ1/AAAAAAAAAAAAAAAAAAAAAPVTq2W5QnAuN9CQd8Gm2Rz5rqFpTXX2XY_QCuOk5gK9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=BIQxrFnHGLEHzFclbnUnsevl%2B20%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FF3TnD%2FdJMb997AkZ1%2FAAAAAAAAAAAAAAAAAAAAAPVTq2W5QnAuN9CQd8Gm2Rz5rqFpTXX2XY_QCuOk5gK9%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DBIQxrFnHGLEHzFclbnUnsevl%252B20%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="787" height="430" data-origin-width="787" data-origin-height="430"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">fuzzing은 이런 식으로 흘러간다.&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">queue에&nbsp;있는&nbsp;입력&nbsp;하나를&nbsp;고른다<br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;그&nbsp;입력을&nbsp;변이한다<br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;타겟을&nbsp;실행한다<br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;새로운&nbsp;coverage가&nbsp;나오면&nbsp;queue에&nbsp;추가한다<br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;다음&nbsp;queue&nbsp;입력으로&nbsp;넘어간다<br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;무한&nbsp;반복</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">call_queue를 사용하여서 AFL이 퍼징을 할 때 발견하는 입력들을 queue에 쌓아놓는다. 그 중에서도 현재까지 찾은 coverage를 기준으로 그나마 쓸만한 입력들을 골라서 사용한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="519" data-origin-height="418"><span data-url="https://blog.kakaocdn.net/dna/bRGIXH/dJMcah5EFcX/AAAAAAAAAAAAAAAAAAAAAJOI05fs8M70s7EsIp6MWhrPVuCMjehqaQrwexstnafW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=LY1fdNF4n%2BsqZgpfEft2rmsIrz0%3D" data-phocus="https://blog.kakaocdn.net/dna/bRGIXH/dJMcah5EFcX/AAAAAAAAAAAAAAAAAAAAAJOI05fs8M70s7EsIp6MWhrPVuCMjehqaQrwexstnafW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=LY1fdNF4n%2BsqZgpfEft2rmsIrz0%3D"><img src="https://blog.kakaocdn.net/dna/bRGIXH/dJMcah5EFcX/AAAAAAAAAAAAAAAAAAAAAJOI05fs8M70s7EsIp6MWhrPVuCMjehqaQrwexstnafW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=LY1fdNF4n%2BsqZgpfEft2rmsIrz0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbRGIXH%2FdJMcah5EFcX%2FAAAAAAAAAAAAAAAAAAAAAJOI05fs8M70s7EsIp6MWhrPVuCMjehqaQrwexstnafW%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DLY1fdNF4n%252BsqZgpfEft2rmsIrz0%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="519" height="418" data-origin-width="519" data-origin-height="418"/></span></figure>
</p>
<p data-ke-size="size16">그 후에 skipped_fuzz를 이용해서 실제 fuzzing을 시도하는 것 이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">사실 fuzzing을 하는 과정이 제일 중요하니 실제로 fuzzing을 하는 코드로 들어가보자.</p>
<p data-ke-size="size16">fuzz_one은 내부에서 변이 입력을 만들고 해당 입력으로 ./target을 여러 번 실행하게 된다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">초기에 변수 설정을 끝내고 나서</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="983" data-origin-height="639"><span data-url="https://blog.kakaocdn.net/dna/nFgfc/dJMcaf7LQ2J/AAAAAAAAAAAAAAAAAAAAAIXU_FzE9Z2K1pjbfHiK3ZQccLUKYTsRoE7aWW_XwYgM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ym1JcAyvEG9Efi27PU%2B5hR%2BPYTY%3D" data-phocus="https://blog.kakaocdn.net/dna/nFgfc/dJMcaf7LQ2J/AAAAAAAAAAAAAAAAAAAAAIXU_FzE9Z2K1pjbfHiK3ZQccLUKYTsRoE7aWW_XwYgM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ym1JcAyvEG9Efi27PU%2B5hR%2BPYTY%3D"><img src="https://blog.kakaocdn.net/dna/nFgfc/dJMcaf7LQ2J/AAAAAAAAAAAAAAAAAAAAAIXU_FzE9Z2K1pjbfHiK3ZQccLUKYTsRoE7aWW_XwYgM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ym1JcAyvEG9Efi27PU%2B5hR%2BPYTY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FnFgfc%2FdJMcaf7LQ2J%2FAAAAAAAAAAAAAAAAAAAAAIXU_FzE9Z2K1pjbfHiK3ZQccLUKYTsRoE7aWW_XwYgM%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Dym1JcAyvEG9Efi27PU%252B5hR%252BPYTY%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="983" height="639" data-origin-width="983" data-origin-height="639"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">현재 queue entry를 fuzzing을 할지 말지를 결정하는 부분이다. 사실 queue를 사용하여 발견한 모든 변수에 대해서 fuzzing을 하게 된면 시간이 낭비된다. 그래서 AFL은 3개의 특징을 가진 표시를 가진다.</p>
<p data-ke-size="size16">1. favored</p>
<p data-ke-size="size16">2. was_fuzzed</p>
<p data-ke-size="size16">3. pending_favored.</p>
<p data-ke-size="size16">favored는 coverage 관점에서 가장 우선순위가 높은 입력이고 was_fuzzed는 이미 fuzzing을 한번 해본 입력이다. pending_favored는 아직 fuzzing을 하지 않고, favored 입력만 남아놓은 상태이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">예시를 들어보자.</p>
<p data-ke-size="size16">#0 "x"&nbsp; &nbsp; &nbsp;already fuzzed&nbsp;</p>
<p data-ke-size="size16">#1 "A"&nbsp; &nbsp; &nbsp;favored, not fuzzed</p>
<p data-ke-size="size16">#2 "AF"&nbsp; &nbsp;favored, not fuzzed&nbsp;&nbsp;</p>
<p data-ke-size="size16">#3 "AAAA"&nbsp; non-favored.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이렇게 되면 우선순위는 favored가 붙어있고, fuzzing을 하지 않은 1, 2번을 먼저 fuzzing을 시도한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="780" data-origin-height="157"><span data-url="https://blog.kakaocdn.net/dna/UHw1I/dJMcaglj1Ku/AAAAAAAAAAAAAAAAAAAAAK_Ddnup2AsCIb_yDsoss2y5IonHH7cMhRIVbIDWE4M7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=VB7yhoXtesCMRxKRIYGF28K92tY%3D" data-phocus="https://blog.kakaocdn.net/dna/UHw1I/dJMcaglj1Ku/AAAAAAAAAAAAAAAAAAAAAK_Ddnup2AsCIb_yDsoss2y5IonHH7cMhRIVbIDWE4M7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=VB7yhoXtesCMRxKRIYGF28K92tY%3D"><img src="https://blog.kakaocdn.net/dna/UHw1I/dJMcaglj1Ku/AAAAAAAAAAAAAAAAAAAAAK_Ddnup2AsCIb_yDsoss2y5IonHH7cMhRIVbIDWE4M7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=VB7yhoXtesCMRxKRIYGF28K92tY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FUHw1I%2FdJMcaglj1Ku%2FAAAAAAAAAAAAAAAAAAAAAK_Ddnup2AsCIb_yDsoss2y5IonHH7cMhRIVbIDWE4M7%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DVB7yhoXtesCMRxKRIYGF28K92tY%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="780" height="157" data-origin-width="780" data-origin-height="157"/></span></figure>
</p>
<p data-ke-size="size16">그 후 로그 출력을 시도하고</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="897" data-origin-height="470"><span data-url="https://blog.kakaocdn.net/dna/bWZEHb/dJMcacQK0uG/AAAAAAAAAAAAAAAAAAAAACOMayj_nI2gXccqLP1LHzWRl63xKart1Qbc6qkR1vDB/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=Exb%2FeQqu1xcyedpkUBQPpeufi0A%3D" data-phocus="https://blog.kakaocdn.net/dna/bWZEHb/dJMcacQK0uG/AAAAAAAAAAAAAAAAAAAAACOMayj_nI2gXccqLP1LHzWRl63xKart1Qbc6qkR1vDB/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=Exb%2FeQqu1xcyedpkUBQPpeufi0A%3D"><img src="https://blog.kakaocdn.net/dna/bWZEHb/dJMcacQK0uG/AAAAAAAAAAAAAAAAAAAAACOMayj_nI2gXccqLP1LHzWRl63xKart1Qbc6qkR1vDB/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=Exb%2FeQqu1xcyedpkUBQPpeufi0A%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbWZEHb%2FdJMcacQK0uG%2FAAAAAAAAAAAAAAAAAAAAACOMayj_nI2gXccqLP1LHzWRl63xKart1Qbc6qkR1vDB%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DExb%252FeQqu1xcyedpkUBQPpeufi0A%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="897" height="470" data-origin-width="897" data-origin-height="470"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">quere_car-&gt;frame으로 현재 fuzzing을 할 입력 파일 경로를 확인하여서 queue파일을 읽으며 favored가 붙은 변이 대상을 가져온다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그 후 ck_alloc_nozero를 사용하면서&nbsp;</p>
<p data-ke-size="size16">in_buff에는 원본 queue 입력을</p>
<p data-ke-size="size16">out_buf에는 변이해서 타겟에 넣을 입력을 집어넣는다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">예를 들어보자면 in_buf가 "x"이면 "A","AF" 이런걸 만들 수 있다.</p>
<p data-ke-size="size16">근데 여기서 왜 x시작인데 "A"가 나오지?.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">"x"를 하나의 문자로 모는 것이 아니라 ASCII로 보는 것 이다.</p>
<p data-ke-size="size16">x = 0x78 = 0111 1000</p>
<p data-ke-size="size16">A = 0x41 = 0100 0001</p>
<p data-ke-size="size16">이렇듯, 시작 기준 값에서 byte, bit를 바꿔가면서 mutation을 시도하는 것 이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="813" data-origin-height="623"><span data-url="https://blog.kakaocdn.net/dna/lgj25/dJMcaipVtyh/AAAAAAAAAAAAAAAAAAAAADfM9C69H05aYjXjeT5RbBmTX8HscNElCwtPKFYVS3PM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=HTpu0hJPjU4FN%2BbsSswJJ%2BfcRCg%3D" data-phocus="https://blog.kakaocdn.net/dna/lgj25/dJMcaipVtyh/AAAAAAAAAAAAAAAAAAAAADfM9C69H05aYjXjeT5RbBmTX8HscNElCwtPKFYVS3PM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=HTpu0hJPjU4FN%2BbsSswJJ%2BfcRCg%3D"><img src="https://blog.kakaocdn.net/dna/lgj25/dJMcaipVtyh/AAAAAAAAAAAAAAAAAAAAADfM9C69H05aYjXjeT5RbBmTX8HscNElCwtPKFYVS3PM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=HTpu0hJPjU4FN%2BbsSswJJ%2BfcRCg%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Flgj25%2FdJMcaipVtyh%2FAAAAAAAAAAAAAAAAAAAAADfM9C69H05aYjXjeT5RbBmTX8HscNElCwtPKFYVS3PM%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DHTpu0hJPjU4FN%252BbsSswJJ%252BfcRCg%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="813" height="623" data-origin-width="813" data-origin-height="623"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그 후 subseq_tmouts =0;</p>
<p data-ke-size="size16">cur_depth = quere_cur -&gt; depth;</p>
<p data-ke-size="size16">를 하여서 연속 timeout 횟수를 관리, 그리고 현재 depth를 확인한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">seed "x" 일 때 depth 1</p>
<p data-ke-size="size16">"x" -&gt; "A" depth 2</p>
<p data-ke-size="size16">"A" -&gt; "AF" depth 3.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이렇게 얼마나 depth가 깊어지는지를 확인한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="585" data-origin-height="612"><span data-url="https://blog.kakaocdn.net/dna/bELbgI/dJMcabj4NYQ/AAAAAAAAAAAAAAAAAAAAAOEZVdm8YZLIis5uFfDby5d9dBcYT374LMSWfLaNJlV_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=UpbbjK6I%2FriJ%2BbVDE0M78B1qBWY%3D" data-phocus="https://blog.kakaocdn.net/dna/bELbgI/dJMcabj4NYQ/AAAAAAAAAAAAAAAAAAAAAOEZVdm8YZLIis5uFfDby5d9dBcYT374LMSWfLaNJlV_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=UpbbjK6I%2FriJ%2BbVDE0M78B1qBWY%3D"><img src="https://blog.kakaocdn.net/dna/bELbgI/dJMcabj4NYQ/AAAAAAAAAAAAAAAAAAAAAOEZVdm8YZLIis5uFfDby5d9dBcYT374LMSWfLaNJlV_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=UpbbjK6I%2FriJ%2BbVDE0M78B1qBWY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbELbgI%2FdJMcabj4NYQ%2FAAAAAAAAAAAAAAAAAAAAAOEZVdm8YZLIis5uFfDby5d9dBcYT374LMSWfLaNJlV_%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DUpbbjK6I%252FriJ%252BbVDE0M78B1qBWY%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="585" height="612" data-origin-width="585" data-origin-height="612"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이 후 trimming이라는 작업을 수행해준다.</p>
<p data-ke-size="size16">이 과정은 예시로 드는 것이 이해하기 좋을 것 같다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">queue 입력이&nbsp; &nbsp;"AAAAAAAFLBBBBB" 이런 형식이라고 할 때, 우리가 필요한 입력은 AFL 딱 3글자이다.</p>
<p data-ke-size="size16">그러면 AFL은 일부 byte를 지워보면서도 coverage가 유지되는지를 확인하다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;"AAAAAAAFLBBBBB"</p>
<p data-ke-size="size16">&nbsp;"AAAAAAAFLBBBB"</p>
<p data-ke-size="size16">&nbsp;"AAAAAAAFLBBB"</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그러면 coverage가 유지되면서 더 짧은 입력으로 바꿀 수 있게된다. -&gt; 더 짧은 입력으로 줄이면 fuzzing이 더 효율적으로 돌아갈 수 있다.&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="854" data-origin-height="388"><span data-url="https://blog.kakaocdn.net/dna/ngl3Q/dJMcadB3oDo/AAAAAAAAAAAAAAAAAAAAAHviD1kEOkIuAORplbsD1ptd0FINn1OI94bxH0ElFCLZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=YYj8%2BvZ8GF9JUmFCcW2PzV4dH00%3D" data-phocus="https://blog.kakaocdn.net/dna/ngl3Q/dJMcadB3oDo/AAAAAAAAAAAAAAAAAAAAAHviD1kEOkIuAORplbsD1ptd0FINn1OI94bxH0ElFCLZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=YYj8%2BvZ8GF9JUmFCcW2PzV4dH00%3D"><img src="https://blog.kakaocdn.net/dna/ngl3Q/dJMcadB3oDo/AAAAAAAAAAAAAAAAAAAAAHviD1kEOkIuAORplbsD1ptd0FINn1OI94bxH0ElFCLZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=YYj8%2BvZ8GF9JUmFCcW2PzV4dH00%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fngl3Q%2FdJMcadB3oDo%2FAAAAAAAAAAAAAAAAAAAAAHviD1kEOkIuAORplbsD1ptd0FINn1OI94bxH0ElFCLZ%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DYYj8%252BvZ8GF9JUmFCcW2PzV4dH00%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="854" height="388" data-origin-width="854" data-origin-height="388"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">orig_perf = perf_score를 활용하여서 quere 입력을 "얼마나 많이" fuzzing할지 점수를 매긴다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">EX)</p>
<p data-ke-size="size16">실행 속도가 빠른가?</p>
<p data-ke-size="size16">새로운 coverage를 잘 만드냐?</p>
<p data-ke-size="size16">입력 크기가 작냐?</p>
<p data-ke-size="size16">아직 많이 fuzzing을 하지 않았냐?</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이런 식으로 점수를 많이 매기면서 더 높은 점수를 가진 변수에게 더 많이 돌 기회를 준다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이 후 AFL에 2가지 mutation 방법이 나오는데</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp; 1. deterministic stage <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;bitflip,&nbsp;byteflip,&nbsp;arithmetic처럼&nbsp;체계적으로&nbsp;하나씩&nbsp;바꿔보는&nbsp;단계 <br /><br />&nbsp; 2. havoc stage <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;랜덤하게&nbsp;여러&nbsp;변이를&nbsp;섞어서&nbsp;때려보는&nbsp;단계</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이다. 만약 사용자가 -d 옵션을 주면 1번은 생략한다. 또한 이미 체계적인 입력을 통해서 한 번 시도한 입력은 하지 않는다.</p>
<p data-ke-size="size16">그 후 doing_det=1까지 오면 deterministic fuzzing을 하겠다는 의미이다. 보통은 2번을 선택하며 1번을 하기 위해서는 여러 가지 조건이 필요한 것 같다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="450" data-origin-height="283"><span data-url="https://blog.kakaocdn.net/dna/yjUqC/dJMcadB3oNq/AAAAAAAAAAAAAAAAAAAAAOZjvnWsJVVREKLpkb4VhHgyHZ0zqxD4vEcuBJx3iZQt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=8l0SNE6u41sHjm%2FXlToZG7Ffvsw%3D" data-phocus="https://blog.kakaocdn.net/dna/yjUqC/dJMcadB3oNq/AAAAAAAAAAAAAAAAAAAAAOZjvnWsJVVREKLpkb4VhHgyHZ0zqxD4vEcuBJx3iZQt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=8l0SNE6u41sHjm%2FXlToZG7Ffvsw%3D"><img src="https://blog.kakaocdn.net/dna/yjUqC/dJMcadB3oNq/AAAAAAAAAAAAAAAAAAAAAOZjvnWsJVVREKLpkb4VhHgyHZ0zqxD4vEcuBJx3iZQt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=8l0SNE6u41sHjm%2FXlToZG7Ffvsw%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FyjUqC%2FdJMcadB3oNq%2FAAAAAAAAAAAAAAAAAAAAAOZjvnWsJVVREKLpkb4VhHgyHZ0zqxD4vEcuBJx3iZQt%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D8l0SNE6u41sHjm%252FXlToZG7Ffvsw%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="450" height="283" data-origin-width="450" data-origin-height="283"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">deterministice fuzzing을 시작하고 첫 단계는 1비트씩 하나씩 뒤집어보는 것이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">예를 들어 입력이 "X"이고 길이가 1바이트일 때</p>
<p data-ke-size="size16">x = 0111_1000</p>
<p data-ke-size="size16">-&gt; 1111_1000</p>
<p data-ke-size="size16">-&gt; 0011_1000</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이렇게 한 비트씩 하나하나 뒤집어보는 것 이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="713" data-origin-height="256"><span data-url="https://blog.kakaocdn.net/dna/c3cLiL/dJMcaarUUUE/AAAAAAAAAAAAAAAAAAAAABbmMVQQJyM_w4KC4pATRv74PH-9CTMb_-5Qj4KXOdqq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=rSvWGglsLRh9gqvI92d30eGrfwA%3D" data-phocus="https://blog.kakaocdn.net/dna/c3cLiL/dJMcaarUUUE/AAAAAAAAAAAAAAAAAAAAABbmMVQQJyM_w4KC4pATRv74PH-9CTMb_-5Qj4KXOdqq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=rSvWGglsLRh9gqvI92d30eGrfwA%3D"><img src="https://blog.kakaocdn.net/dna/c3cLiL/dJMcaarUUUE/AAAAAAAAAAAAAAAAAAAAABbmMVQQJyM_w4KC4pATRv74PH-9CTMb_-5Qj4KXOdqq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=rSvWGglsLRh9gqvI92d30eGrfwA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fc3cLiL%2FdJMcaarUUUE%2FAAAAAAAAAAAAAAAAAAAAABbmMVQQJyM_w4KC4pATRv74PH-9CTMb_-5Qj4KXOdqq%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DrSvWGglsLRh9gqvI92d30eGrfwA%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="713" height="256" data-origin-width="713" data-origin-height="256"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">해당 bit를 하나씩 바꿔보면서 발견한 새로운 hit들을 저장한다. 만약 new_hit_cnt가 더 높으면 stage_finds에 기록된다.</p>
<p data-ke-size="size16">&nbsp;&nbsp;bitflip&nbsp;1/1&nbsp;-&gt;&nbsp;bit&nbsp;1개씩&nbsp;바꿈 <br />&nbsp;&nbsp;bitflip&nbsp;2/1&nbsp;-&gt;&nbsp;bit&nbsp;2개씩&nbsp;바꿈 <br />&nbsp;&nbsp;bitflip&nbsp;4/1&nbsp;-&gt;&nbsp;bit&nbsp;4개씩&nbsp;바꿈</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그 다음으로는 이렇게 bit를 바꾸는 갯수를 조금씩 달리하여서도 fuzzing을 시도한다. 이렇게 fuzzing을 준비하면서도 고려할 점이 있다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">AFL에서는 effecrtor map이라는 것을 만드는데, &nbsp;왜&nbsp;AFL은&nbsp;effector&nbsp;map이라는&nbsp;걸&nbsp;만들까? <br />입력의 어떤 byte는 바꿔도 coverage에 영향이 없을 때가 있다.&nbsp;<br /><br />&nbsp;&nbsp;예를&nbsp;들어&nbsp;입력이&nbsp;이런&nbsp;식이라고&nbsp;해보자. <br />AFLxxxxxxxxxxxxxxxx <br />타겟 코드가 앞 3바이트만 본다면:<br />&nbsp;&nbsp;if&nbsp;(buf[0]&nbsp;==&nbsp;'A') <br />&nbsp;&nbsp;if&nbsp;(buf[1]&nbsp;==&nbsp;'F') <br />&nbsp;&nbsp;if&nbsp;(buf[2]&nbsp;==&nbsp;'L') <br />뒤의 xxxxxxxx들은 아무리 바꿔도 실행 경로가 안 바뀔 수 있다.. 그러면 AFL 입장에서는 뒤쪽 byte들을 열심히 바꾸는 게 낭비가 되는 것 이다..</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그래서 effector map은 byte가 바뀔 때 coverage가 달라지냐 안 달라지냐를 명시해주는 것 이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이제 아래와 같이 계속 fuzzing을 한 뒤에 arithmetic mutation이 시작된다.</p>
<p data-ke-size="size16"><br />&nbsp;&nbsp;bitflip&nbsp;1/1&nbsp;&nbsp;&nbsp;-&gt;&nbsp;1비트씩 <br />&nbsp;&nbsp;bitflip&nbsp;2/1&nbsp;&nbsp;&nbsp;-&gt;&nbsp;2비트씩 <br />&nbsp;&nbsp;bitflip&nbsp;4/1&nbsp;&nbsp;&nbsp;-&gt;&nbsp;4비트씩 <br />&nbsp;&nbsp;bitflip&nbsp;8/8&nbsp;&nbsp;&nbsp;-&gt;&nbsp;1바이트씩 <br />&nbsp;&nbsp;bitflip&nbsp;16/8&nbsp;&nbsp;-&gt;&nbsp;2바이트씩 <br />&nbsp;&nbsp;bitflip&nbsp;32/8&nbsp;&nbsp;-&gt;&nbsp;4바이트씩</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">arithemitc mutation은 'A'가 65일 때, 64, 66, 63 등등 이런 값들을 넣는 것 이다.</p>
<p data-ke-size="size16">arithemtic mutation 다음으로는&nbsp;</p>
<p data-ke-size="size16">0, 1, 1, 127, 128 등등 다양한 경계값이 있는 수들을 더하거나 빼는 mutation을 수행한다.</p>
<p data-ke-size="size16">요약하면</p>
<p data-ke-size="size16">&nbsp;&nbsp;INTERESTING&nbsp;VALUES <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;AFL이&nbsp;미리&nbsp;알고&nbsp;있는&nbsp;경계값들을&nbsp;넣어본다 <br /><br />&nbsp;&nbsp;interest&nbsp;8/8 <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;1바이트&nbsp;경계값&nbsp;삽입 <br /><br />&nbsp;&nbsp;interest&nbsp;16/8 <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;2바이트&nbsp;경계값&nbsp;삽입 <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;little/big&nbsp;endian&nbsp;둘&nbsp;다&nbsp;시도 <br /><br />&nbsp;&nbsp;interest&nbsp;32/8 <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;4바이트&nbsp;경계값&nbsp;삽입 <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;little/big&nbsp;endian&nbsp;둘&nbsp;다&nbsp;시도</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이렇다. 남은 fuzzing들도 요약해보면</p>
<p data-ke-size="size16">&nbsp;1.&nbsp;dictionary&nbsp;overwrite <br />&nbsp;&nbsp;2.&nbsp;dictionary&nbsp;insert <br />&nbsp;&nbsp;3.&nbsp;havoc <br />&nbsp;&nbsp;4.&nbsp;splice <br />으로 나눌 수 있으며<br /><br />&nbsp; 1. dictionary overwrite <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;입력의&nbsp;기존&nbsp;byte&nbsp;구간을&nbsp;dictionary&nbsp;token으로&nbsp;덮어쓴다 <br />예: <br />&nbsp;&nbsp;&nbsp;&nbsp;입력:&nbsp;&nbsp;"xxxx" <br />&nbsp;&nbsp;&nbsp;&nbsp;토큰:&nbsp;&nbsp;"AFL" <br /><br />&nbsp;&nbsp;&nbsp;&nbsp;결과:&nbsp;&nbsp;"AFLx" <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"xAFL"&nbsp;<br />&nbsp; 2. dictionary insert <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 입력의 기존 내용을 밀어내고 dictionary token을 삽입한다.<br />&nbsp;&nbsp;예: <br />&nbsp;&nbsp;&nbsp;&nbsp;입력:&nbsp;&nbsp;"xxxx" <br />&nbsp;&nbsp;&nbsp;&nbsp;토큰:&nbsp;&nbsp;"AFL" <br /><br />&nbsp;&nbsp;&nbsp;&nbsp;결과:&nbsp;&nbsp;"AFLxxxx" <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"xAFLxxx" <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"xxAFLxx" <br /><br />&nbsp; 3. havoc <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;여러&nbsp;mutation을&nbsp;랜덤하게&nbsp;섞어서&nbsp;수행한다 <br />예: <br />&nbsp;&nbsp;&nbsp;&nbsp;bit&nbsp;flip <br />&nbsp;&nbsp;&nbsp;&nbsp;byte&nbsp;set <br />&nbsp;&nbsp;&nbsp;&nbsp;arithmetic <br />&nbsp;&nbsp;&nbsp;&nbsp;interesting&nbsp;value&nbsp;삽입 <br />&nbsp;&nbsp;&nbsp;&nbsp;dictionary&nbsp;token&nbsp;삽입/덮어쓰기 <br />&nbsp;&nbsp;&nbsp;&nbsp;byte&nbsp;삭제 <br />&nbsp;&nbsp;&nbsp;&nbsp;byte&nbsp;복제 <br />&nbsp;&nbsp;&nbsp;&nbsp;byte&nbsp;overwrite <br /><br />&nbsp;&nbsp;이런&nbsp;것들을&nbsp;랜덤으로&nbsp;여러&nbsp;개&nbsp;쌓아서&nbsp;한&nbsp;번에&nbsp;적용한다. <br /><br />&nbsp; 4. splice <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;서로&nbsp;다른&nbsp;queue&nbsp;입력&nbsp;두&nbsp;개를&nbsp;섞은&nbsp;뒤&nbsp;havoc을&nbsp;수행한다 <br /><br />&nbsp;&nbsp;예: <br />&nbsp;&nbsp;&nbsp;&nbsp;입력&nbsp;1:&nbsp;"AAAAxxxx" <br />&nbsp;&nbsp;&nbsp;&nbsp;입력&nbsp;2:&nbsp;"BBBByyyy" <br /><br />&nbsp;&nbsp;&nbsp;&nbsp;splice&nbsp;결과: <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"AAAByyyy" <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"BBBBxxxx" <br />이렇게 두 입력을 섞고, &nbsp; &nbsp; 그&nbsp;결과물에&nbsp;다시&nbsp;havoc&nbsp;mutation을&nbsp;수행한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">전체적으로 확인을 해보면 fuzzing은.</p>
<p data-ke-size="size16">&nbsp; fuzz_one() <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;bitflip&nbsp;계열 <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;arithmetic&nbsp;계열 <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;interesting&nbsp;values&nbsp;계열 <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;dictionary&nbsp;계열 <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;havoc <br />&nbsp;&nbsp;&nbsp;&nbsp;-&gt;&nbsp;splice&nbsp;+&nbsp;havoc</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">fuzz_one이 끝나면 다시 while문으로 돌아가서 다시 다음 loop을 돌게 된다. 진짜 간략하게 요약하면</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;queue&nbsp;전체를&nbsp;한&nbsp;바퀴&nbsp;돌고 <br />&nbsp;&nbsp;-&gt;&nbsp;다시&nbsp;처음부터&nbsp;돌고 <br />&nbsp;&nbsp;-&gt;&nbsp;새로&nbsp;발견된&nbsp;입력도&nbsp;queue에&nbsp;추가하면서 <br />&nbsp;&nbsp;-&gt;&nbsp;계속&nbsp;반복</p>
<p data-ke-size="size16">이 행동을 반복하는 것 이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">여기까지 한 코드 분석은 AFL 전체 흐름과 Mutation이 어떻게 이루어지는지에 대한 설명이다. 세세하게</p>
<p data-ke-size="size16">1. Instrumentation 코드는 어떻게 이루어지는지</p>
<p data-ke-size="size16">2. Coverage bitmap 동작 원리는 무엇인지</p>
<p data-ke-size="size16">3. Fork Server에 대해서</p>
<p data-ke-size="size16">를 이어서 설명하겠다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">Instrumentation.</h3>
<p data-ke-size="size16">코드는 아래와 같이 시작한다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="702" data-origin-height="423"><span data-url="https://blog.kakaocdn.net/dna/kKUN8/dJMcaf7M0gk/AAAAAAAAAAAAAAAAAAAAAEh7QXm8Ik2UtWkU7VZcLf0aWOsjsmoptY70bwKmGlYq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ZnnVdd%2BUPiQWSHetnXUCTgurmoY%3D" data-phocus="https://blog.kakaocdn.net/dna/kKUN8/dJMcaf7M0gk/AAAAAAAAAAAAAAAAAAAAAEh7QXm8Ik2UtWkU7VZcLf0aWOsjsmoptY70bwKmGlYq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ZnnVdd%2BUPiQWSHetnXUCTgurmoY%3D"><img src="https://blog.kakaocdn.net/dna/kKUN8/dJMcaf7M0gk/AAAAAAAAAAAAAAAAAAAAAEh7QXm8Ik2UtWkU7VZcLf0aWOsjsmoptY70bwKmGlYq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ZnnVdd%2BUPiQWSHetnXUCTgurmoY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FkKUN8%2FdJMcaf7M0gk%2FAAAAAAAAAAAAAAAAAAAAAEh7QXm8Ik2UtWkU7VZcLf0aWOsjsmoptY70bwKmGlYq%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DZnnVdd%252BUPiQWSHetnXUCTgurmoY%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="702" height="423" data-origin-width="702" data-origin-height="423"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">내용이 길어져서, 간단하게만 설명을 하자면</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;AFL instrumentation은 ./afl-gcc를 통해서 들어간다. 흐름은 afl-gcc -&gt; gcc -&gt; afl-as 이런 식이다. afl-as.c의 add_instrumentation() 함수가 assembly 코드를 한 줄씩 읽는다. </p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그 중 .text section, 함수 label, branch label, 조건 분기 같은 위치를 찾는다. 그리고 해당 위치에 afl-as.h에 정의된 trampoline 코드를 삽입한다. </p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이 trampoline은 실행될 때 __afl_maybe_log를 호출한다. __afl_maybe_log는 현재 위치인 cur_loc와 이전 위치인 prev_loc를 XOR한다. 그 결과값을 coverage bitmap의 index로 사용한다. 그리고 trace_bits[cur_loc ^ prev_loc]++ 이런 식으로 해당 경로가 실행됐다는 것을 기록한다. 결국 AFL은 이 bitmap을 보고 새로운 coverage가 나왔는지 판단하는 것이다.&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">예시를 들어보자면</p>
<pre id="code_1779927556141" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  if (buf[0] == 'A') {
    if (buf[1] == 'F') {
      if (buf[2] == 'L') {
        printf("Captured\n");
      }
    }</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">또 이런 코드를 가져와서, 이 코드를 ./afl-gcc target.c -o target으로 컴파일한다고 하면 컴파일 중간에 asembly가 만들어지고 해당 assembly를 다시 afl-as라는 코드가 읽는다. 그리고 if 문으로 인해 생기는 branch 위치마다 AFL trampoline 코드가 삽입된다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그래서 target이 실행되면서 buf[0] =='A' 분기를지나가면 bitmap의 위치가 증가하게 되고, 또 F, L을 지나면 계속 위치가 증가하는 것 이다. 이렇게 증가한 bits들을 보면서 새롱누 경로로 들어갔구나 하는 것을 알게 된다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;그러면 여기서 나오는 bitmap은 무엇일까?.</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">Bitmap</h3>
<p data-ke-size="size16">Coverage bitmap 동작 원리는 trace_bits라는 64KB짜리 배열을 기준으로 보면 된다.&nbsp; AFL은&nbsp;target을&nbsp;실행하기&nbsp;전에&nbsp;shared&nbsp;memory를&nbsp;하나&nbsp;만든다. <br />-&gt; 이 shared memory가 바로 coverage bitmap이고, AFL 코드에서는 trace_bits라는 이름으로 사용된다. </p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">크기는 config.h:328에 정의되어 있다.</p>
<pre id="code_1779927850423" class="python" data-ke-language="python" data-ke-type="codeblock"><code>  #define MAP_SIZE_POW2 16
  #define MAP_SIZE      (1 &lt;&lt; MAP_SIZE_POW2)</code></pre>
<p data-ke-size="size16"><br />-&gt; 즉, 2^16 = 65536 byte 크기의 bitmap이다.&nbsp; AFL은 afl-fuzz.c의 setup_shm()에서 이 shared memory를 만든다. <br />그 후 __AFL_SHM_ID 환경변수로 target에게 shared memory id를 넘긴다. target 안에 삽입된 instrumentation 코드는 실행될 때 이 shared memory에 붙는다. <br />그리고 특정 분기나 함수 위치를 지나갈 때마다 다음과 같은 방식으로 값을 증가시킨다. (예시를 생각하면 편할 것 같다)&nbsp;</p>
<pre id="code_1779927925270" class="python" data-ke-language="python" data-ke-type="codeblock"><code>trace_bits[cur_loc ^ prev_loc]++;</code></pre>
<p data-ke-size="size16">해당 코드에서 cur_loc는 현재 실행 위치를 의미하고, prev_loc는 바로 이전에 실행된 위치를 의미한다. 둘을 XOR하면 &ldquo;이전 위치에서 현재 위치로 이동한 edge&rdquo;를 표현할 수 있다. <br />즉 AFL은 단순히 어떤 줄이 실행됐는지가 아니라, 어떤 경로로 이동했는지를 기록한다. target 실행이 끝나면 AFL은 이 trace_bits를 확인한다. <br />기존에 본 적 없는 bitmap 위치가 켜졌다면 새로운 coverage라고 판단한다. 그러면 해당 입력은 의미 있는 입력으로 보고 queue에 저장한다.</p>
<p data-ke-size="size16">&nbsp;</p>
<h3 data-ke-size="size23">Fork Server.</h3>
<p data-ke-size="size16">퍼징을 돌리기 위해서는 입력을 넣는 곳, 입력이 넣어지는 곳이 필요하다. 해당 부분들을 컴퓨터를 두 개로 돌리기 보다는 컴퓨터 하나로 fork해서 돌리는 편이 좋기에, Fork를 다루는 곳도 추가로 알아보겠다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">Fork Server는 AFL이 target을 매번 처음부터 실행하지 않기 위해 사용하는 구조이다.&nbsp; 일반적으로 target을 실행할 때마다 execve()를 하면 프로그램 로딩, 동적 링킹, 초기화 과정이 계속 반복된다. 이렇게 계속 반복을 하게 되면, 퍼징은 target을 수천 번, 수만 번 실행해야 하기 때문에 이 비용이 꽤 커진다. </p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">그래서 AFL은 target을 한 번만 실행해서 어느 정도 초기화된 상태로 멈춰놓는다.멈춰놓은 것을 활용하여&nbsp;새로운 입력을 테스트해야 할 때마다 그 멈춰 있는 process를 fork()해서 child process를 만든다. </p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">이렇게 하면 매번 execve()로 바이너리를 새로 로딩하지 않아도 된다. 흐름을 보면 먼저 afl-fuzz가 pipe를 만들고 target을 한 번 실행한다. target&nbsp;안에는&nbsp;instrumentation과&nbsp;함께&nbsp;fork&nbsp;server&nbsp;코드도&nbsp;삽입되어&nbsp;있다. </p>
<p><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="931" data-origin-height="645"><span data-url="https://blog.kakaocdn.net/dna/veqxw/dJMcaccbR4K/AAAAAAAAAAAAAAAAAAAAAMUJYFee_5T9AI_MVseXXLPGdTBVVra0DAK3s5UwXQEC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=lMztX59knzRd%2Bm5jeUBoSQJAsnY%3D" data-phocus="https://blog.kakaocdn.net/dna/veqxw/dJMcaccbR4K/AAAAAAAAAAAAAAAAAAAAAMUJYFee_5T9AI_MVseXXLPGdTBVVra0DAK3s5UwXQEC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=lMztX59knzRd%2Bm5jeUBoSQJAsnY%3D"><img src="https://blog.kakaocdn.net/dna/veqxw/dJMcaccbR4K/AAAAAAAAAAAAAAAAAAAAAMUJYFee_5T9AI_MVseXXLPGdTBVVra0DAK3s5UwXQEC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=lMztX59knzRd%2Bm5jeUBoSQJAsnY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fveqxw%2FdJMcaccbR4K%2FAAAAAAAAAAAAAAAAAAAAAMUJYFee_5T9AI_MVseXXLPGdTBVVra0DAK3s5UwXQEC%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DlMztX59knzRd%252Bm5jeUBoSQJAsnY%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="446" height="309" data-origin-width="931" data-origin-height="645"/></span></figure>
</p>
<p data-ke-size="size16">실제로 forkserver를 초기화하는 코드의 화면이다.&nbsp; init_forkserver() 함수는 AFL이 target을 매번 execve()로 새로 실행하지 않기 위해 fork server를 준비하는 부분이다. 실제로 코드 흐름상은 아래와 같이 흘러간다.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">1. 먼저 pipe()를 이용해서 AFL과 target이 서로 통신할 수 있는 통로를 만든다. <br />2. 그 후 fork()를 호출해서 fork server 역할을 할 process를 하나 만든다. <br />3. child process 쪽에서는 target 실행 환경을 설정한다. <br />4. stdout, stderr를 /dev/null로 돌리고, stdin은 AFL이 만든 입력 파일을 바라보게 설정한다. <br />5. 그리고 control pipe와 status pipe를 target 안에서 사용할 고정 fd에 연결한다. <br />6. 여기서 사용하는 fd가 FORKSRV_FD와 FORKSRV_FD + 1이다. <br />7. 그 다음 execv()를 통해 실제 target binary를 실행한다. <br />8. target은 실행되면서 AFL이 삽입해둔 instrumentation 코드에 도달한다. <br />9. 이때 target 내부의 fork server 코드가 실행되고, AFL에게 4바이트 handshake를 보낸다. <br />10. 부모 process인 afl-fuzz는 이 handshake를 기다린다. <br />11. 정상적으로 4바이트를 받으면 fork server 초기화가 성공한 것이다. <br />12. 이후부터 AFL은 target을 새로 execve()하지 않는다. <br />13. 대신 pipe를 통해 fork server에게 이번 입력으로 한 번 실행해줘라고 보낸다.<br />14. fork server는 요청을 받을 때마다 fork()로 child를 만들고, 그 child가 실제 입력을 처리한다. <br />15. child 실행이 끝나면 fork server는 종료 상태를 AFL에게 다시 전달한다. <br />16. AFL은 그 결과와 coverage bitmap을 보고 crash인지, timeout인지, 새로운 coverage인지 판단한다. </p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">짧게 요약하면 pipe를 만들고, 해당 pipe에서 target에 고정할 fd를 딱&nbsp; 연결 시킨 뒤에 해당 타겟을 실행시킨다. 이제 성공을 하면 부모 process는 target을 다시 실행시키지 않고 값만 바꿔서 계속 퍼징을 시도하는 것 이다.</p></div>
            <!-- System - START -->

<!-- System - END -->

                    <div class="
