---
layout: post
title: 프론티어_CodeQL실습
date: 2026-05-13
desc: "PyTorch issue #182277 기반 CodeQL 실습: PyLong_AsSsize_t 호출 후 PyErr_Occurred 확인 누락 패턴 탐지"
keywords: "CodeQL, PyTorch, PyLong_AsSsize_t, PyErr_Occurred, C++, SAST, 취약점탐지, 실습, 프론티어"
categories: [TechnicalDocument]
tags: [프론티어, CodeQL, PyTorch, C++, 취약점탐지]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/44](https://sanghole.tistory.com/44)

<p data-ke-size="size16">그전에 프로젝트를 해보려다가 setup을 claude한테 시켰는데, 해당 claude가 제보할 issue가 있다며 나한테 준 보고서를 토대로 한번 CodeQL 실습을 진행해보려고 한다.</p>
<p data-ke-size="size16"><a href="https://github.com/pytorch/pytorch/issues/182277" target="_blank" rel="noopener noreferrer">https://github.com/pytorch/pytorch/issues/182277</a></p>
<p data-ke-size="size16">실제로 issue사항으로 올라갔다 ㅎㅎ.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">해당 issue에서 잡아야할 포인트</p>
<pre id="code_1778619218517" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>torch.cuda.memory.caching_allocator_alloc(2**63)
    ↓
PyLong_AsSsize_t(size_o) 호출
    ↓
2**63은 PY_SSIZE_T_MAX를 넘음
    ↓
PyLong_AsSsize_t가 -1을 반환하고 OverflowError를 set
    ↓
그런데 PyErr_Occurred() 확인 없이 다음 로직 진행
    ↓
SystemError 발생</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">원래 2**63 - 1은 CUDA OOM이 나지만, 2**63은 SystemError가 발생하는 것을 확인하였다. </p>
<p data-ke-size="size16">그래서 원인 후보로 PyLong_AsSsize_t()를 OverflowError로 set하면 즉시 PyErr_Occurred()로 확인하지 않은 흐름이 언급되어 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그래서 CodeQL를 이용해서 PyTorch Python C API 예외 처리 누락 패턴을 분석해보겠다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="787" data-origin-height="97"><span data-url="https://blog.kakaocdn.net/dna/7cPYi/dJMb99TTcJx/AAAAAAAAAAAAAAAAAAAAAFWIWFfFkmfkNJFhS0lpDXd7oFW4s6iZK9u4SMo0V2y1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=sWaCmiPKNwi3zIn2DImC8hi06KU%3D" data-phocus="https://blog.kakaocdn.net/dna/7cPYi/dJMb99TTcJx/AAAAAAAAAAAAAAAAAAAAAFWIWFfFkmfkNJFhS0lpDXd7oFW4s6iZK9u4SMo0V2y1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=sWaCmiPKNwi3zIn2DImC8hi06KU%3D"><img src="https://blog.kakaocdn.net/dna/7cPYi/dJMb99TTcJx/AAAAAAAAAAAAAAAAAAAAAFWIWFfFkmfkNJFhS0lpDXd7oFW4s6iZK9u4SMo0V2y1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=sWaCmiPKNwi3zIn2DImC8hi06KU%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F7cPYi%2FdJMb99TTcJx%2FAAAAAAAAAAAAAAAAAAAAAFWIWFfFkmfkNJFhS0lpDXd7oFW4s6iZK9u4SMo0V2y1%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DsWaCmiPKNwi3zIn2DImC8hi06KU%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="787" height="97" data-origin-width="787" data-origin-height="97"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">일단 src와 queries에 대한 디렉토리를 먼저 설정한다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="666" data-origin-height="350"><span data-url="https://blog.kakaocdn.net/dna/bjVQ24/dJMcahxDYRN/AAAAAAAAAAAAAAAAAAAAAIJFNy2m6mC8dT6ZYHP5-6V9Qbw3Yovdy6b8py2zaX5s/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=li5Mxpip3DnjNo4hpqqW6AhTV64%3D" data-phocus="https://blog.kakaocdn.net/dna/bjVQ24/dJMcahxDYRN/AAAAAAAAAAAAAAAAAAAAAIJFNy2m6mC8dT6ZYHP5-6V9Qbw3Yovdy6b8py2zaX5s/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=li5Mxpip3DnjNo4hpqqW6AhTV64%3D"><img src="https://blog.kakaocdn.net/dna/bjVQ24/dJMcahxDYRN/AAAAAAAAAAAAAAAAAAAAAIJFNy2m6mC8dT6ZYHP5-6V9Qbw3Yovdy6b8py2zaX5s/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=li5Mxpip3DnjNo4hpqqW6AhTV64%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbjVQ24%2FdJMcahxDYRN%2FAAAAAAAAAAAAAAAAAAAAAIJFNy2m6mC8dT6ZYHP5-6V9Qbw3Yovdy6b8py2zaX5s%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Dli5Mxpip3DnjNo4hpqqW6AhTV64%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="666" height="350" data-origin-width="666" data-origin-height="350"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 후에 PyTorch에 보고한 issue와 비슷하게 setup을 한 bad.cpp를 만든다</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">auto size = PyLong_AsSize_t(size_o);</p>
<p data-ke-size="size16">이 부분에서 overflow가 발생하면 -1을 반환하면서 Python excetion을 set할 수 있다. 하지만 바로 아래에 있는 PyErr_Occurred()를 확인하지 않고 size < 0만 검사한다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그래서 CodeQL로 찾고 싶은 패턴은 </p>
<p data-ke-size="size16">PyLong_AsSize_t를 호출 한뒤, PyErr_Occurred 확인이 없음 -> 반환값 사용</p>
<p data-ke-size="size16">에 관한 것을 찾고 싶은 것 이다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">추후 비교 분석을 위해서 정상 패턴 예제도 작성한다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="605" data-origin-height="423"><span data-url="https://blog.kakaocdn.net/dna/bGSb9P/dJMcagyHoc5/AAAAAAAAAAAAAAAAAAAAABFOIc2ksBn3avxMMFAYmiOnzTj1wtKtWrWhIkBVQdLy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yrAqgKEi3TaxQRc0CyCKa%2BxILQQ%3D" data-phocus="https://blog.kakaocdn.net/dna/bGSb9P/dJMcagyHoc5/AAAAAAAAAAAAAAAAAAAAABFOIc2ksBn3avxMMFAYmiOnzTj1wtKtWrWhIkBVQdLy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yrAqgKEi3TaxQRc0CyCKa%2BxILQQ%3D"><img src="https://blog.kakaocdn.net/dna/bGSb9P/dJMcagyHoc5/AAAAAAAAAAAAAAAAAAAAABFOIc2ksBn3avxMMFAYmiOnzTj1wtKtWrWhIkBVQdLy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yrAqgKEi3TaxQRc0CyCKa%2BxILQQ%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbGSb9P%2FdJMcagyHoc5%2FAAAAAAAAAAAAAAAAAAAAABFOIc2ksBn3avxMMFAYmiOnzTj1wtKtWrWhIkBVQdLy%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DyrAqgKEi3TaxQRc0CyCKa%252BxILQQ%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="605" height="423" data-origin-width="605" data-origin-height="423"></img></span></figure>
</p>
<p data-ke-size="size16">제대로 size == -1과 PyErr_Occuerred를 예외처리로 넣은 모습이다.</p>
<p data-ke-size="size16">실제로 issue를 등록하고 pr을 봤을 때 이런 형식으로 처리를 하였다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이제 CodeQL DB를 생성해본다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="1314" data-origin-height="78"><span data-url="https://blog.kakaocdn.net/dna/m74zb/dJMcacXnxrT/AAAAAAAAAAAAAAAAAAAAAJlW4rgttHqEirwyzETvgrBT7EWOSOYFg1r9lThA1eGz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=60GVBJbyYiFi2YZPgcLlMT4RUdg%3D" data-phocus="https://blog.kakaocdn.net/dna/m74zb/dJMcacXnxrT/AAAAAAAAAAAAAAAAAAAAAJlW4rgttHqEirwyzETvgrBT7EWOSOYFg1r9lThA1eGz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=60GVBJbyYiFi2YZPgcLlMT4RUdg%3D"><img src="https://blog.kakaocdn.net/dna/m74zb/dJMcacXnxrT/AAAAAAAAAAAAAAAAAAAAAJlW4rgttHqEirwyzETvgrBT7EWOSOYFg1r9lThA1eGz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=60GVBJbyYiFi2YZPgcLlMT4RUdg%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fm74zb%2FdJMcacXnxrT%2FAAAAAAAAAAAAAAAAAAAAAJlW4rgttHqEirwyzETvgrBT7EWOSOYFg1r9lThA1eGz%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D60GVBJbyYiFi2YZPgcLlMT4RUdg%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1314" height="78" data-origin-width="1314" data-origin-height="78"></img></span></figure>
</p>
<p data-ke-size="size16">하기 전에 codeQL 설치하기</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="1441" data-origin-height="492"><span data-url="https://blog.kakaocdn.net/dna/dmjoWF/dJMcafs2aEQ/AAAAAAAAAAAAAAAAAAAAAPjZB-gUnUx5C0yj1_jBhstZqgURtb9fcRayXmb9fD2s/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=tLi06YvpKehUuE5BB%2Bm5UucHGJk%3D" data-phocus="https://blog.kakaocdn.net/dna/dmjoWF/dJMcafs2aEQ/AAAAAAAAAAAAAAAAAAAAAPjZB-gUnUx5C0yj1_jBhstZqgURtb9fcRayXmb9fD2s/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=tLi06YvpKehUuE5BB%2Bm5UucHGJk%3D"><img src="https://blog.kakaocdn.net/dna/dmjoWF/dJMcafs2aEQ/AAAAAAAAAAAAAAAAAAAAAPjZB-gUnUx5C0yj1_jBhstZqgURtb9fcRayXmb9fD2s/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=tLi06YvpKehUuE5BB%2Bm5UucHGJk%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdmjoWF%2FdJMcafs2aEQ%2FAAAAAAAAAAAAAAAAAAAAAPjZB-gUnUx5C0yj1_jBhstZqgURtb9fcRayXmb9fD2s%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DtLi06YvpKehUuE5BB%252Bm5UucHGJk%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1441" height="492" data-origin-width="1441" data-origin-height="492"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제 codeql을 설치하고 입력하면 정상적으로 뜬다!</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="550" data-origin-height="41"><span data-url="https://blog.kakaocdn.net/dna/9GFLz/dJMcahRUiur/AAAAAAAAAAAAAAAAAAAAAFjMCNY_cW6MwMyLg5H7Ws4lyyRFVsdW6Wn515DAPQJR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=mXNomaHR%2FOv4shy9fSbBT7AmhhY%3D" data-phocus="https://blog.kakaocdn.net/dna/9GFLz/dJMcahRUiur/AAAAAAAAAAAAAAAAAAAAAFjMCNY_cW6MwMyLg5H7Ws4lyyRFVsdW6Wn515DAPQJR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=mXNomaHR%2FOv4shy9fSbBT7AmhhY%3D"><img src="https://blog.kakaocdn.net/dna/9GFLz/dJMcahRUiur/AAAAAAAAAAAAAAAAAAAAAFjMCNY_cW6MwMyLg5H7Ws4lyyRFVsdW6Wn515DAPQJR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=mXNomaHR%2FOv4shy9fSbBT7AmhhY%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F9GFLz%2FdJMcahRUiur%2FAAAAAAAAAAAAAAAAAAAAAFjMCNY_cW6MwMyLg5H7Ws4lyyRFVsdW6Wn515DAPQJR%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DmXNomaHR%252FOv4shy9fSbBT7AmhhY%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="550" height="41" data-origin-width="550" data-origin-height="41"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">CodeQl을 설치했으니 일단 컴파일을 진행한다.</p>
<p data-ke-size="size16">-> 컴파일을 하는 이유 CodeQl이 C/C++ 코드를 제대로 분석하려면 빌드 과정을 알아야한다. </p>
<p data-ke-size="size16">JavaScript나 Python은 그냥 파일을 읽으면 어느 정도 분석이 가능하지만, C/C++은 다르다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">예를 들어 #include 경로, 매크로 정의, 컴파일 옵션 등 여러 가지가 컴파일 과정에서 결정되기 때문에 실행 파일로 만드는 것이 아니라, 오브젝트 파일까지만 딱 만들어서 CodeQL이 분석할 수 있는 C++ 코드인지를 확인 및 검증하는 단계인 것 이다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="633" data-origin-height="62"><span data-url="https://blog.kakaocdn.net/dna/bhF1MT/dJMcadIFz6p/AAAAAAAAAAAAAAAAAAAAAOwHIYPFWWVKcnghFk7E_9dpgALcfR0-3tTRMtCEHU2U/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=wjFkd00bt4%2F41X2XqG4XByD86Gs%3D" data-phocus="https://blog.kakaocdn.net/dna/bhF1MT/dJMcadIFz6p/AAAAAAAAAAAAAAAAAAAAAOwHIYPFWWVKcnghFk7E_9dpgALcfR0-3tTRMtCEHU2U/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=wjFkd00bt4%2F41X2XqG4XByD86Gs%3D"><img src="https://blog.kakaocdn.net/dna/bhF1MT/dJMcadIFz6p/AAAAAAAAAAAAAAAAAAAAAOwHIYPFWWVKcnghFk7E_9dpgALcfR0-3tTRMtCEHU2U/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=wjFkd00bt4%2F41X2XqG4XByD86Gs%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbhF1MT%2FdJMcadIFz6p%2FAAAAAAAAAAAAAAAAAAAAAOwHIYPFWWVKcnghFk7E_9dpgALcfR0-3tTRMtCEHU2U%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DwjFkd00bt4%252F41X2XqG4XByD86Gs%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="633" height="62" data-origin-width="633" data-origin-height="62"></img></span></figure>
</p>
<p data-ke-size="size16">실제로 bad.o와 good.o가 생성된 모습이다.</p>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="1716" data-origin-height="38"><span data-url="https://blog.kakaocdn.net/dna/b4aAox/dJMb997qPIe/AAAAAAAAAAAAAAAAAAAAAArAcYGc6oB5CoQpShiFX0ys6W0Qox94WlqNIdHzsK6X/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=hNsBLLIEsEXYWbWe3PHvX8IyU5s%3D" data-phocus="https://blog.kakaocdn.net/dna/b4aAox/dJMb997qPIe/AAAAAAAAAAAAAAAAAAAAAArAcYGc6oB5CoQpShiFX0ys6W0Qox94WlqNIdHzsK6X/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=hNsBLLIEsEXYWbWe3PHvX8IyU5s%3D"><img src="https://blog.kakaocdn.net/dna/b4aAox/dJMb997qPIe/AAAAAAAAAAAAAAAAAAAAAArAcYGc6oB5CoQpShiFX0ys6W0Qox94WlqNIdHzsK6X/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=hNsBLLIEsEXYWbWe3PHvX8IyU5s%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb4aAox%2FdJMb997qPIe%2FAAAAAAAAAAAAAAAAAAAAAArAcYGc6oB5CoQpShiFX0ys6W0Qox94WlqNIdHzsK6X%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DhNsBLLIEsEXYWbWe3PHvX8IyU5s%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1716" height="38" data-origin-width="1716" data-origin-height="38"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<pre id="code_1778620590429" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>codeql database create codeql-db \
  --language=cpp \
  --command='g++ $(python3-config --includes) -c src/bad.cpp -o bad.o && g++ $(python3-config --includes) -c src/good.cpp -o good.o'</code></pre>
<p data-ke-size="size16">실제 코드는 이렇게 구성을 한다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">코드 해석 -> </p>
<pre id="code_1778620719881" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>codeql database create codeql-db</code></pre>
<p data-ke-size="size16">CodeQL 데이터베이스를 생성한다는 뜻이다.</p>
<p data-ke-size="size16">codeql-db는 생성될 DB 폴더 이름이고, 이 명령어만 실행하면 codeql-db 라는 폴더가 생길 것 이다.</p>
<p data-ke-size="size16"> </p>
<pre id="code_1778620753939" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>--language=cpp</code></pre>
<p data-end="546" data-start="519" data-ke-size="size16">분석 대상 언어를 C/C++로 지정하는 옵션이다.</p>
<p data-end="611" data-start="548" data-ke-size="size16">CodeQL은 언어별로 데이터베이스 생성 방식이 다르기 때문에 C++ 코드를 분석하려면 cpp를 지정해야 한다.</p>
<p data-end="611" data-start="548" data-ke-size="size16"> </p>
<pre id="code_1778620778179" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>  --command='g++ $(python3-config --includes) -c src/bad.cpp -o bad.o && g++ $(python3-config --includes) -c src/good.cpp -o good.o'</code></pre>
<p data-end="690" data-start="647" data-ke-size="size16">CodeQL이 데이터베이스를 만들 때 실행할 빌드 명령어를 지정하는 옵션이다.</p>
<p data-end="771" data-start="692" data-ke-size="size16">C/C++은 JavaScript나 Python처럼 그냥 파일만 읽는 방식이 아니라, 실제 컴파일 과정에서 나오는 정보를 기반으로 분석해야 하기 때문에 지정을 해주는 것 이다.</p>
<p data-end="771" data-start="692" data-ke-size="size16"> </p>
<p data-end="771" data-start="692" data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="1717" data-origin-height="191"><span data-url="https://blog.kakaocdn.net/dna/K9Kst/dJMcafmitpR/AAAAAAAAAAAAAAAAAAAAAD3MJYmNaNOaKvQuqecOK0GK-pL4McONhRClFH8oDFt8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=fWV4F5tw%2B%2BoR9ONlOHySKOB6imE%3D" data-phocus="https://blog.kakaocdn.net/dna/K9Kst/dJMcafmitpR/AAAAAAAAAAAAAAAAAAAAAD3MJYmNaNOaKvQuqecOK0GK-pL4McONhRClFH8oDFt8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=fWV4F5tw%2B%2BoR9ONlOHySKOB6imE%3D"><img src="https://blog.kakaocdn.net/dna/K9Kst/dJMcafmitpR/AAAAAAAAAAAAAAAAAAAAAD3MJYmNaNOaKvQuqecOK0GK-pL4McONhRClFH8oDFt8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=fWV4F5tw%2B%2BoR9ONlOHySKOB6imE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FK9Kst%2FdJMcafmitpR%2FAAAAAAAAAAAAAAAAAAAAAD3MJYmNaNOaKvQuqecOK0GK-pL4McONhRClFH8oDFt8%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DfWV4F5tw%252B%252BoR9ONlOHySKOB6imE%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1717" height="191" data-origin-width="1717" data-origin-height="191"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">했더니 오류가 나서 잠시 issue 처리</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="742" data-origin-height="106"><span data-url="https://blog.kakaocdn.net/dna/cgPM0I/dJMcaiJ1JVy/AAAAAAAAAAAAAAAAAAAAAA-t4IQQEOxSUC1-3HaKHBMShm32LED5Gtwb2MLz-mrQ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=NgrGIrfLracvjeZQyEEs2lkcobc%3D" data-phocus="https://blog.kakaocdn.net/dna/cgPM0I/dJMcaiJ1JVy/AAAAAAAAAAAAAAAAAAAAAA-t4IQQEOxSUC1-3HaKHBMShm32LED5Gtwb2MLz-mrQ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=NgrGIrfLracvjeZQyEEs2lkcobc%3D"><img src="https://blog.kakaocdn.net/dna/cgPM0I/dJMcaiJ1JVy/AAAAAAAAAAAAAAAAAAAAAA-t4IQQEOxSUC1-3HaKHBMShm32LED5Gtwb2MLz-mrQ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=NgrGIrfLracvjeZQyEEs2lkcobc%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcgPM0I%2FdJMcaiJ1JVy%2FAAAAAAAAAAAAAAAAAAAAAA-t4IQQEOxSUC1-3HaKHBMShm32LED5Gtwb2MLz-mrQ%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DNgrGIrfLracvjeZQyEEs2lkcobc%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="742" height="106" data-origin-width="742" data-origin-height="106"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">여러 명령이 필요하면 --command를 여러 번 지정하고, 커스텀 빌드 스크립트를 짜서 넣는 것이 좋다고 되어 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">해결 방법</p>
<p data-ke-size="size16">1. --command 여러 개 지정하기</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="1728" data-origin-height="345"><span data-url="https://blog.kakaocdn.net/dna/bWQZkz/dJMcaiQNO4w/AAAAAAAAAAAAAAAAAAAAABvc7dJxqdXyOzhCaNQmtn-uaacCIi_lrQBs9zZ6KERK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=GyQNePA5yk8e%2BtyHYGdpK2WNd70%3D" data-phocus="https://blog.kakaocdn.net/dna/bWQZkz/dJMcaiQNO4w/AAAAAAAAAAAAAAAAAAAAABvc7dJxqdXyOzhCaNQmtn-uaacCIi_lrQBs9zZ6KERK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=GyQNePA5yk8e%2BtyHYGdpK2WNd70%3D"><img src="https://blog.kakaocdn.net/dna/bWQZkz/dJMcaiQNO4w/AAAAAAAAAAAAAAAAAAAAABvc7dJxqdXyOzhCaNQmtn-uaacCIi_lrQBs9zZ6KERK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=GyQNePA5yk8e%2BtyHYGdpK2WNd70%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbWQZkz%2FdJMcaiQNO4w%2FAAAAAAAAAAAAAAAAAAAAABvc7dJxqdXyOzhCaNQmtn-uaacCIi_lrQBs9zZ6KERK%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DGyQNePA5yk8e%252BtyHYGdpK2WNd70%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1728" height="345" data-origin-width="1728" data-origin-height="345"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">2. build.sh 활용하기</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="896" data-origin-height="290"><span data-url="https://blog.kakaocdn.net/dna/cqw5RP/dJMcafmitB7/AAAAAAAAAAAAAAAAAAAAABzbUpU5AUMl3Rxe5u08Q62mVtEVPabvqWtqbs0GeQSi/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ZtUtA3G10JSEvRSe3YzlG5MbJj4%3D" data-phocus="https://blog.kakaocdn.net/dna/cqw5RP/dJMcafmitB7/AAAAAAAAAAAAAAAAAAAAABzbUpU5AUMl3Rxe5u08Q62mVtEVPabvqWtqbs0GeQSi/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ZtUtA3G10JSEvRSe3YzlG5MbJj4%3D"><img src="https://blog.kakaocdn.net/dna/cqw5RP/dJMcafmitB7/AAAAAAAAAAAAAAAAAAAAABzbUpU5AUMl3Rxe5u08Q62mVtEVPabvqWtqbs0GeQSi/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=ZtUtA3G10JSEvRSe3YzlG5MbJj4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fcqw5RP%2FdJMcafmitB7%2FAAAAAAAAAAAAAAAAAAAAABzbUpU5AUMl3Rxe5u08Q62mVtEVPabvqWtqbs0GeQSi%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DZtUtA3G10JSEvRSe3YzlG5MbJj4%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="896" height="290" data-origin-width="896" data-origin-height="290"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">2개 모두 뭐로 해도 상관 없다!</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이제 처음 만든 쿼리 dir에 실제 쿼리를 만들어본다,.</p>
<pre id="code_1778621385980" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>/**
 * @name Find PyLong_AsSsize_t calls
 * @description Finds calls to PyLong_AsSsize_t in C/C++ Python extension code.
 * @kind problem
 * @problem.severity warning
 * @id cpp/python-api/find-pylong-as-ssize-t
 */

import cpp

from FunctionCall call
where call.getTarget().getName() = "PyLong_AsSsize_t"
select call, "PyLong_AsSsize_t 호출이 발견되었습니다. 반환 직후 PyErr_Occurred 확인 여부를 검토해야 합니다."</code></pre>
<p data-ke-size="size16">로 작성을 하였는데 자세한 코드 설명은 아래와 같다.</p>
<p data-ke-size="size16"> </p>
<pre id="code_1778621405109" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>/**
 * @name Find PyLong_AsSsize_t calls
 * @description Finds calls to PyLong_AsSsize_t in C/C++ Python extension code.
 * @kind problem
 * @problem.severity warning
 * @id cpp/python-api/find-pylong-as-ssize-t
 */</code></pre>
<p data-ke-size="size16">이것은 C/C++ 코드 안에서 특정 패턴을 찾아내는 분석 규칙이다.</p>
<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td>@name</td>
<td>쿼리 이름</td>
</tr>
<tr>
<td>@description</td>
<td>쿼리가 무엇을 찾는지 설명</td>
</tr>
<tr>
<td>@kind problem</td>
<td>문제점을 찾는 쿼리라는 의미</td>
</tr>
<tr>
<td>@problem.severity warning</td>
<td>심각도는 warning</td>
</tr>
<tr>
<td>@id</td>
<td>쿼리 고유 ID</td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">매핑을 해보자면 해당 정보들을 찾는 것 이다.</p>
<p data-ke-size="size16"> </p>
<pre id="code_1778621452520" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>import cpp

from FunctionCall call
where call.getTarget().getName() = "PyLong_AsSsize_t"
select call, "PyLong_AsSsize_t 호출이 발견되었습니다. 반환 직후 PyErr_Occurred 확인 여부를 검토해야 합니다."</code></pre>
<p data-ke-size="size16">import cpp는 CodeQL 라이브러리를 불러오는 부분이고,</p>
<p data-ke-size="size16">from FunctionCall call은 C/C++ 코드 안에 있는 함수 호출들을 대상으로 보겠다는 것 이다.</p>
<p data-ke-size="size16">where call.~ 이 구분은 pyLong_AsSize_t인 호출 대상을 찾는 다는 것 이다.</p>
<p data-ke-size="size16">만약에 해당 call이 찾아지면 " " <- 여기 안에 있는 문자열을 출력할 수 있도록 setup 해놓는다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<pre id="code_1778621661520" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>codeql query run queries/find.ql --database=codeql-db</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">위에 있는 ql파일을 find.ql로 만들고 나서 해당 명령어를 실행한다.</p>
<div><span style="letter-spacing: 0px;"> codeql-db 데이터베이스를 대상으로 queries/find.ql에 작성한 CodeQL 쿼리를 실행하는 명령어이다. </span><span style="letter-spacing: 0px;">즉, 앞에서 만든 C++ 분석 DB 안에서 PyLong_AsSsize_t 호출 같은 패턴을 찾아 결과로 출력하는 단계인 것 이다.</span></div>
<div> </div>
<div><span style="letter-spacing: 0px;"></span><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="1134" data-origin-height="267"><span data-url="https://blog.kakaocdn.net/dna/o1jD9/dJMcah5utkm/AAAAAAAAAAAAAAAAAAAAADi1poZ-uhBfThRQP6m_cssJ9IRgJUG2CKAdUxzmYmjg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=UGHU%2F5HhaS9N82nYqRUu7gX1%2Br0%3D" data-phocus="https://blog.kakaocdn.net/dna/o1jD9/dJMcah5utkm/AAAAAAAAAAAAAAAAAAAAADi1poZ-uhBfThRQP6m_cssJ9IRgJUG2CKAdUxzmYmjg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=UGHU%2F5HhaS9N82nYqRUu7gX1%2Br0%3D"><img src="https://blog.kakaocdn.net/dna/o1jD9/dJMcah5utkm/AAAAAAAAAAAAAAAAAAAAADi1poZ-uhBfThRQP6m_cssJ9IRgJUG2CKAdUxzmYmjg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=UGHU%2F5HhaS9N82nYqRUu7gX1%2Br0%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fo1jD9%2FdJMcah5utkm%2FAAAAAAAAAAAAAAAAAAAAADi1poZ-uhBfThRQP6m_cssJ9IRgJUG2CKAdUxzmYmjg%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DUGHU%252F5HhaS9N82nYqRUu7gX1%252Br0%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1134" height="267" data-origin-width="1134" data-origin-height="267"></img></span></figure>
</div>
<p data-ke-size="size16">실제로 call이 뜬 것을 확인할 수 있다. 결과 로그들을 조금 더 상세하게 분석해보자.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">왜 call이 2번이나 확인되었을까?</p>
<p data-ke-size="size16">이유는 bad.cpp와 good.cpp안에 auto size = PyLong_AsSsize_t(size_o);가 있기 때문에. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">지금 실행한 것은 PyLong_asSize_t 호출이 있는지를 보는 것 이기 때문에 이런 결과가 나오는 것이 맞다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그러면 내가 올린 issue를 분석하기 위한 .ql을 다시 작성해본다.</p>
<p data-ke-size="size16"> </p>
<pre id="code_1778621866516" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>/**
 * @name Missing PyErr_Occurred check after PyLong_AsSsize_t
 * @description Detects PyLong_AsSsize_t calls that are not followed by a nearby PyErr_Occurred check.
 * @kind problem
 * @problem.severity warning
 * @id cpp/python-api/missing-pyerr-occurred-after-pylong-as-ssize-t
 */

import cpp

predicate nearbyPyErrOccurredCheck(FunctionCall conv) {
  exists(FunctionCall err |
    err.getEnclosingFunction() = conv.getEnclosingFunction() and
    err.getTarget().getName() = "PyErr_Occurred" and
    err.getLocation().getStartLine() > conv.getLocation().getStartLine() and
    err.getLocation().getStartLine() <= conv.getLocation().getStartLine() + 5
  )
}

from FunctionCall conv
where conv.getTarget().getName() = "PyLong_AsSsize_t"
  and not nearbyPyErrOccurredCheck(conv)
select conv,
  "PyLong_AsSsize_t 호출 이후 가까운 위치에 PyErr_Occurred 확인이 없습니다. overflow 시 pending Python exception이 남을 수 있습니다."</code></pre>
<p data-ke-size="size16"> </p>
<p data-end="119" data-start="0" data-ke-size="size16">그전이랑 달라진 부분만 설명해보자면, 단순히 PyLong_AsSsize_t 호출을 찾는 것에서 끝나는 게 아니라, 호출 이후 5줄 이내에 PyErr_Occurred() 확인이 있는지까지 검사하도록 바뀌었다.</p>
<div>
<div>
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
<pre class="isbl"><code>predicate nearbyPyErrOccurredCheck(FunctionCall conv)</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div> </div>
</div>
</div>
</div>
<p data-end="303" data-start="186" data-ke-size="size16">이 부분이 새로 추가된 검사 로직이다.<br></br>같은 함수 내부에서 PyLong_AsSsize_t 호출보다 뒤에 있고, 5줄 이내에 PyErr_Occurred()가 호출되면 정상 확인 코드가 있다고 판단한다.</p>
<p data-end="403" data-start="305" data-ke-size="size16">이유는? -> PyLong_AsSsize_t는 실패 시 -1을 반환할 수 있는데, -1은 정상 값일 수도 있어서 반환값만으로는 오류 여부를 구분하기 어렵기 때문이다.</p>
<p data-end="428" data-start="405" data-ke-size="size16">그래서 이번 쿼리는 아래 조건을 추가했다.</p>
<div>
<div>
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
<pre class="isbl"><code>and not nearbyPyErrOccurredCheck(conv)</code></pre>
<p data-ke-size="size16"> </p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<p data-end="552" data-start="480" data-ke-size="size16">그래서 PyLong_AsSsize_t를 호출했는데 근처에 PyErr_Occurred() 확인이 없는 코드만 경고로 출력한다.</p>
<p data-is-only-node="" data-is-last-node="" data-end="623" data-start="554" data-ke-size="size16">정리하면 이전 쿼리는 진짜 호출을 하는지 확인한 것 이고 이번 쿼리는 실제로 오류 확인이 빠진 위험한 패턴을 찾는 쿼리로 발전한 것이다.</p>
<p data-is-only-node="" data-is-last-node="" data-end="623" data-start="554" data-ke-size="size16"> </p>
<p data-is-only-node="" data-is-last-node="" data-end="623" data-start="554" data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="1471" data-origin-height="246"><span data-url="https://blog.kakaocdn.net/dna/cuRyUp/dJMcahEmCzA/AAAAAAAAAAAAAAAAAAAAACEZWt85_1Fe9-wfaG0y8VXcWVgEdCzYTrcQgAGivxK6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=j%2FKhFKXgW1qG5pi%2BJ35KMDiSZeU%3D" data-phocus="https://blog.kakaocdn.net/dna/cuRyUp/dJMcahEmCzA/AAAAAAAAAAAAAAAAAAAAACEZWt85_1Fe9-wfaG0y8VXcWVgEdCzYTrcQgAGivxK6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=j%2FKhFKXgW1qG5pi%2BJ35KMDiSZeU%3D"><img src="https://blog.kakaocdn.net/dna/cuRyUp/dJMcahEmCzA/AAAAAAAAAAAAAAAAAAAAACEZWt85_1Fe9-wfaG0y8VXcWVgEdCzYTrcQgAGivxK6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=j%2FKhFKXgW1qG5pi%2BJ35KMDiSZeU%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcuRyUp%2FdJMcahEmCzA%2FAAAAAAAAAAAAAAAAAAAAACEZWt85_1Fe9-wfaG0y8VXcWVgEdCzYTrcQgAGivxK6%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Dj%252FKhFKXgW1qG5pi%252BJ35KMDiSZeU%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1471" height="246" data-origin-width="1471" data-origin-height="246"></img></span></figure>
</p>
<p data-ke-size="size16">실제로 그전과 다르게 하나만 나오는 것을 확인할 수 있다. <br></br><br></br></p>
<p data-ke-size="size16">근데 어디 파일인지가 안나와서 </p>
<pre id="code_1778622210718" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>conv.getFile().getRelativePath()</code></pre>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">라는 코드를 추가하여서 다시 돌려보면</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-width="1579" data-origin-height="268"><span data-url="https://blog.kakaocdn.net/dna/HFwNX/dJMcacXnxWx/AAAAAAAAAAAAAAAAAAAAACa2WXUZPQYC3u9vBk4WpMS0mWGyN4XsTKH7bF46o_2P/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=I1YhaUKO%2B3bxuLyDl9eIjaM9aVg%3D" data-phocus="https://blog.kakaocdn.net/dna/HFwNX/dJMcacXnxWx/AAAAAAAAAAAAAAAAAAAAACa2WXUZPQYC3u9vBk4WpMS0mWGyN4XsTKH7bF46o_2P/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=I1YhaUKO%2B3bxuLyDl9eIjaM9aVg%3D"><img src="https://blog.kakaocdn.net/dna/HFwNX/dJMcacXnxWx/AAAAAAAAAAAAAAAAAAAAACa2WXUZPQYC3u9vBk4WpMS0mWGyN4XsTKH7bF46o_2P/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=I1YhaUKO%2B3bxuLyDl9eIjaM9aVg%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FHFwNX%2FdJMcacXnxWx%2FAAAAAAAAAAAAAAAAAAAAACa2WXUZPQYC3u9vBk4WpMS0mWGyN4XsTKH7bF46o_2P%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DI1YhaUKO%252B3bxuLyDl9eIjaM9aVg%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1579" height="268" data-origin-width="1579" data-origin-height="268"></img></span></figure>
</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">실제로 bad.cpp에서 확인되는 것을 볼 수 있다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">정리-></p>
<p data-end="146" data-start="0" data-ke-size="size16">PyTorch 이슈 #182277의 핵심 패턴인 PyLong_AsSsize_t 호출 이후 PyErr_Occurred() 확인 누락을 CodeQL 실습 주제로 잡고, bad.cpp와 good.cpp 예제를 만들어 CodeQL DB를 구축 후 실습.</p>
<p data-end="256" data-start="148" data-ke-size="size16">이후 PyLong_AsSsize_t 호출을 찾는 1차 쿼리를 실행했고, 두 파일 모두 해당 함수를 호출하므로 bad.cpp, good.cpp가 둘 다 탐지되는 것이 정상임을 확인했다.</p>
<p data-is-only-node="" data-is-last-node="" data-end="339" data-start="258" data-ke-size="size16">다음 단계로 PyErr_Occurred() 체크가 없는 경우만 필터링하는 2차 쿼리를 작성해서 bad.cpp만 탐지되도록 만든 후 실제 성공하였다.</p>
<p data-is-only-node="" data-is-last-node="" data-end="339" data-start="258" data-ke-size="size16"> </p>
<p data-is-only-node="" data-is-last-node="" data-end="339" data-start="258" data-ke-size="size16">codeQL 명령어 정리</p>
<pre id="code_1778622544654" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code># CodeQL 데이터베이스 생성
codeql database create <DB_이름> --language=<언어> --command='<빌드_명령어>'
  
#예시: C/C++ 프로젝트를 build.sh로 빌드하면서 DB 생성
codeql database create codeql-db --language=cpp --command='./build.sh'
  
# CodeQL 쿼리 실행
codeql query run <쿼리파일.ql> --database=<DB_이름>
  
# 예시: find.ql 실행
codeql query run queries/find.ql --database=codeql-db</code></pre>
<p data-ke-size="size16"> </p>
