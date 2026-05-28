---
layout: post
title: 프론티어_자료구조
date: 2026-05-26
desc: "자료구조 기본 정리 - 스택, 큐, 덱, 힙, 해시, 집합과 관련 문제 풀이"
keywords: "자료구조, 스택, 큐, 덱, 힙, 해시, 집합, 알고리즘, 프론티어"
categories: [TechnicalDocument]
tags: [자료구조, 프론티어, 알고리즘]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/49](https://sanghole.tistory.com/49)

<div>
<div data-scroll-from-top="" data-scroll-root="">
<div id="thread">
<div>
<div data-is-intersecting="true" data-turn-id-container="request-WEB:e3725c64-ddeb-4970-8c0f-1e53e0e1e90b-10">
<div>
<div data-message-model-slug="gpt-5-5-thinking" data-turn-start-message="true" data-message-id="9e89d077-12fd-41c5-b12c-59fdf751668a" data-message-author-role="assistant">
<p data-end="308" data-start="91" data-ke-size="size16">자료구조에 대한 기본적인 설명</p>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="960" data-origin-height="665"><span data-url="https://blog.kakaocdn.net/dna/xJW3c/dJMcacJ2nhA/AAAAAAAAAAAAAAAAAAAAAFJ_VH3lMZvCnbQuukdcNjgdmE44eszbsoDRf22hCpez/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yKiS8%2FC8EcPHFBhoP43RJ4ufGro%3D" data-phocus="https://blog.kakaocdn.net/dna/xJW3c/dJMcacJ2nhA/AAAAAAAAAAAAAAAAAAAAAFJ_VH3lMZvCnbQuukdcNjgdmE44eszbsoDRf22hCpez/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yKiS8%2FC8EcPHFBhoP43RJ4ufGro%3D"><img src="https://blog.kakaocdn.net/dna/xJW3c/dJMcacJ2nhA/AAAAAAAAAAAAAAAAAAAAAFJ_VH3lMZvCnbQuukdcNjgdmE44eszbsoDRf22hCpez/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yKiS8%2FC8EcPHFBhoP43RJ4ufGro%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FxJW3c%2FdJMcacJ2nhA%2FAAAAAAAAAAAAAAAAAAAAAFJ_VH3lMZvCnbQuukdcNjgdmE44eszbsoDRf22hCpez%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DyKiS8%252FC8EcPHFBhoP43RJ4ufGro%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="960" height="665" data-origin-width="960" data-origin-height="665"/></span></figure>

<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">단순 구조, 순차, 연결 리스트, 파일 구조를 제외하여 설명할 예정이다.</p>
<h2 data-end="324" data-start="310" data-section-id="1esl66l" data-ke-size="size26">1. 스택 Stack</h2>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1672" data-origin-height="941"><span data-url="https://blog.kakaocdn.net/dna/xcnRy/dJMcadIOq9S/AAAAAAAAAAAAAAAAAAAAAJgXQRI2qpMLyaYXissGrowS6f-tFifOzp0KcfMDDFth/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=lbij8Tcma1UL02RoGF7RYa6%2BF9U%3D" data-phocus="https://blog.kakaocdn.net/dna/xcnRy/dJMcadIOq9S/AAAAAAAAAAAAAAAAAAAAAJgXQRI2qpMLyaYXissGrowS6f-tFifOzp0KcfMDDFth/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=lbij8Tcma1UL02RoGF7RYa6%2BF9U%3D"><img src="https://blog.kakaocdn.net/dna/xcnRy/dJMcadIOq9S/AAAAAAAAAAAAAAAAAAAAAJgXQRI2qpMLyaYXissGrowS6f-tFifOzp0KcfMDDFth/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=lbij8Tcma1UL02RoGF7RYa6%2BF9U%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FxcnRy%2FdJMcadIOq9S%2FAAAAAAAAAAAAAAAAAAAAAJgXQRI2qpMLyaYXissGrowS6f-tFifOzp0KcfMDDFth%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Dlbij8Tcma1UL02RoGF7RYa6%252BF9U%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1672" height="941" data-origin-width="1672" data-origin-height="941"/></span></figure>

<p data-end="632" data-start="326" data-ke-size="size16">스택은 LIFO, Last In First Out 구조를 따르는 자료구조다. 즉, 마지막에 들어온 데이터가 가장 먼저 나간다.</p>
<p data-end="632" data-start="326" data-ke-size="size16">접시를 쌓아두고 위에서부터 꺼내는 모습을 생각하면 이해하기 쉽다!</p>
<p data-end="632" data-start="326" data-ke-size="size16">&nbsp;</p>
<p data-end="632" data-start="326" data-ke-size="size16">스택의 대표 연산은 데이터를 넣는 push, 가장 위의 데이터를 꺼내는 pop, 가장 위의 데이터를 확인하는 top 또는 peek이다.&nbsp;</p>
<p data-end="632" data-start="326" data-ke-size="size16">&nbsp;</p>
<p data-end="768" data-start="634" data-ke-size="size16">스택은 함수 호출 관리, 재귀 호출, 괄호 검사, DFS, 뒤로 가기, 실행 취소 기능 등에 자주 사용된다. 특히 DFS에서는 현재 경로를 따라 깊게 탐색하다가 더 이상 갈 곳이 없으면 이전 상태로 되돌아가야 하므로 스택 구조가 잘 맞는다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>&nbsp;</div>
</div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="stata"><code>stack = []

stack.append(10)
stack.append(20)
stack.append(30)

print(stack.pop())  # 30
print(stack.pop())  # 20</code></pre>
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
</div>
</div>
</div>
<h2 data-end="962" data-start="949" data-section-id="1t3omrc" data-ke-size="size26">2. 큐 Queue</h2>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1536" data-origin-height="1024"><span data-url="https://blog.kakaocdn.net/dna/V6ita/dJMcaayFzHg/AAAAAAAAAAAAAAAAAAAAANdbdN5vgqzeU9OrGdV528dG4pu_pf89ViVIn3wFaxE-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yW1eqNUgnvnxH3lakBuFFncFvRQ%3D" data-phocus="https://blog.kakaocdn.net/dna/V6ita/dJMcaayFzHg/AAAAAAAAAAAAAAAAAAAAANdbdN5vgqzeU9OrGdV528dG4pu_pf89ViVIn3wFaxE-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yW1eqNUgnvnxH3lakBuFFncFvRQ%3D"><img src="https://blog.kakaocdn.net/dna/V6ita/dJMcaayFzHg/AAAAAAAAAAAAAAAAAAAAANdbdN5vgqzeU9OrGdV528dG4pu_pf89ViVIn3wFaxE-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=yW1eqNUgnvnxH3lakBuFFncFvRQ%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FV6ita%2FdJMcaayFzHg%2FAAAAAAAAAAAAAAAAAAAAANdbdN5vgqzeU9OrGdV528dG4pu_pf89ViVIn3wFaxE-%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DyW1eqNUgnvnxH3lakBuFFncFvRQ%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1536" height="1024" data-origin-width="1536" data-origin-height="1024"/></span></figure>

<p data-end="1204" data-start="964" data-ke-size="size16">큐는 FIFO, First In First Out 구조를 따르는 자료구조다. 즉, 먼저 들어온 데이터가 먼저 나간다.</p>
<p data-end="1204" data-start="964" data-ke-size="size16">&nbsp;</p>
<p data-end="1204" data-start="964" data-ke-size="size16">줄을 서서 기다리는 상황을 생각하면 된다. 먼저 온 사람이 먼저 처리되고, 나중에 온 사람은 뒤에서 기다린다. Java의 Queue 문서도 FIFO 큐에서는 새 원소가 큐의 뒤쪽에 삽입되고, 앞쪽 원소가 제거 대상이 된다고 설명한다.</p>
<p data-end="1352" data-start="1206" data-ke-size="size16">큐의 대표 연산은 데이터를 넣는 enqueue, 데이터를 꺼내는 dequeue, 맨 앞 데이터를 확인하는 front 또는 peek이다. 큐는 BFS, 작업 대기열, 프린터 출력 대기열, 네트워크 패킷 처리, 운영체제 스케줄링 등에서 자주 사용된다.</p>
<p data-end="1352" data-start="1206" data-ke-size="size16">&nbsp;</p>
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
<pre class="routeros"><code>from collections import deque

queue = deque()

queue.append(10)
queue.append(20)
queue.append(30)

print(queue.popleft())  # 10
print(queue.popleft())  # 20</code></pre>
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
</div>
</div>
</div>
<h2 data-end="1777" data-start="1764" data-section-id="35sy5l" data-ke-size="size26">3. 덱 Deque</h2>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1536" data-origin-height="1024"><span data-url="https://blog.kakaocdn.net/dna/H9Vxx/dJMcabj3RKl/AAAAAAAAAAAAAAAAAAAAAEk0nClZCueEViQef5xSSt4hsUhV6tGUOtycfLlV5_84/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=oSoiabXzCjJo%2BoVkvvahLs7Dt34%3D" data-phocus="https://blog.kakaocdn.net/dna/H9Vxx/dJMcabj3RKl/AAAAAAAAAAAAAAAAAAAAAEk0nClZCueEViQef5xSSt4hsUhV6tGUOtycfLlV5_84/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=oSoiabXzCjJo%2BoVkvvahLs7Dt34%3D"><img src="https://blog.kakaocdn.net/dna/H9Vxx/dJMcabj3RKl/AAAAAAAAAAAAAAAAAAAAAEk0nClZCueEViQef5xSSt4hsUhV6tGUOtycfLlV5_84/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=oSoiabXzCjJo%2BoVkvvahLs7Dt34%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FH9Vxx%2FdJMcabj3RKl%2FAAAAAAAAAAAAAAAAAAAAAEk0nClZCueEViQef5xSSt4hsUhV6tGUOtycfLlV5_84%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DoSoiabXzCjJo%252BoVkvvahLs7Dt34%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1536" height="1024" data-origin-width="1536" data-origin-height="1024"/></span></figure>

<p data-end="2008" data-start="1779" data-ke-size="size16">덱은 Double-Ended Queue의 줄임말로, 양쪽 끝에서 삽입과 삭제가 모두 가능한 자료구조다. 일반 큐는 뒤에서 넣고 앞에서 빼는 구조지만, 덱은 앞에서도 넣고 뒤에서도 넣을 수 있으며, 앞에서도 빼고 뒤에서도 뺄 수 있다. Java의 Deque 문서도 덱을 양쪽 끝에서 삽입과 제거를 지원하는 선형 컬렉션이라고 설명한다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>&nbsp;</div>
</div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="gauss"><code>from collections import deque

dq = deque()

dq.append(10)       # 오른쪽 삽입
dq.appendleft(20)   # 왼쪽 삽입
dq.append(30)

print(dq)           # deque([20, 10, 30])

print(dq.popleft()) # 20
print(dq.pop())     # 30</code></pre>
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
</div>
</div>
</div>
<h2 data-end="2560" data-start="2548" data-section-id="19t85tm" data-ke-size="size26">4. 힙 Heap</h2>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1536" data-origin-height="1024"><span data-url="https://blog.kakaocdn.net/dna/c9wcWi/dJMcagli6DY/AAAAAAAAAAAAAAAAAAAAACG4Tb94lcvCoD2T9sxU6j85jQqLcPIEX_Nj8ZR2O6X5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=qHdD1kAHlafpzKy%2BpAPEhyvPSaw%3D" data-phocus="https://blog.kakaocdn.net/dna/c9wcWi/dJMcagli6DY/AAAAAAAAAAAAAAAAAAAAACG4Tb94lcvCoD2T9sxU6j85jQqLcPIEX_Nj8ZR2O6X5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=qHdD1kAHlafpzKy%2BpAPEhyvPSaw%3D"><img src="https://blog.kakaocdn.net/dna/c9wcWi/dJMcagli6DY/AAAAAAAAAAAAAAAAAAAAACG4Tb94lcvCoD2T9sxU6j85jQqLcPIEX_Nj8ZR2O6X5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=qHdD1kAHlafpzKy%2BpAPEhyvPSaw%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fc9wcWi%2FdJMcagli6DY%2FAAAAAAAAAAAAAAAAAAAAACG4Tb94lcvCoD2T9sxU6j85jQqLcPIEX_Nj8ZR2O6X5%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DqHdD1kAHlafpzKy%252BpAPEhyvPSaw%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1536" height="1024" data-origin-width="1536" data-origin-height="1024"/></span></figure>

<p data-end="2856" data-start="2562" data-ke-size="size16">힙은 최댓값 또는 최솟값을 빠르게 찾기 위한 자료구조다. 일반적으로 완전 이진 트리 형태로 설명되며, 부모와 자식 사이에 일정한 우선순위 관계를 유지한다. 최소 힙에서는 부모 노드의 값이 자식 노드의 값보다 작거나 같고, 최대 힙에서는 부모 노드의 값이 자식 노드의 값보다 크거나 같다.</p>
<p data-end="3071" data-start="2858" data-ke-size="size16">힙은 우선순위 큐를 구현할 때 많이 사용된다. 우선순위 큐는 먼저 들어온 순서가 아니라, 우선순위가 높은 데이터가 먼저 나오는 구조다. 예를 들어 응급실 환자 처리, 작업 스케줄링, 다익스트라 알고리즘, 최소 비용 문제 등에서 사용된다.&nbsp;</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>&nbsp;</div>
<div>&nbsp;</div>
</div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="angelscript"><code>import heapq

heap = []

heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)

print(heapq.heappop(heap))  # 1
print(heapq.heappop(heap))  # 3</code></pre>
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
</div>
</div>
</div>
<h2 data-end="3573" data-start="3540" data-section-id="w6y72b" data-ke-size="size26">5. 해시 Hash / 해시 테이블 Hash Table</h2>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1536" data-origin-height="1024"><span data-url="https://blog.kakaocdn.net/dna/nNuPh/dJMcadhQLEe/AAAAAAAAAAAAAAAAAAAAACUaYJmQclatotXBdzUl_g8cPWubUB2Hgkv11dpGjFr9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=2tfip%2Bi8tGUIWMiF%2B1iStYUyd70%3D" data-phocus="https://blog.kakaocdn.net/dna/nNuPh/dJMcadhQLEe/AAAAAAAAAAAAAAAAAAAAACUaYJmQclatotXBdzUl_g8cPWubUB2Hgkv11dpGjFr9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=2tfip%2Bi8tGUIWMiF%2B1iStYUyd70%3D"><img src="https://blog.kakaocdn.net/dna/nNuPh/dJMcadhQLEe/AAAAAAAAAAAAAAAAAAAAACUaYJmQclatotXBdzUl_g8cPWubUB2Hgkv11dpGjFr9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=2tfip%2Bi8tGUIWMiF%2B1iStYUyd70%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FnNuPh%2FdJMcadhQLEe%2FAAAAAAAAAAAAAAAAAAAAACUaYJmQclatotXBdzUl_g8cPWubUB2Hgkv11dpGjFr9%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D2tfip%252Bi8tGUIWMiF%252B1iStYUyd70%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1536" height="1024" data-origin-width="1536" data-origin-height="1024"/></span></figure>

<p data-end="3713" data-start="3575" data-ke-size="size16">해시는 임의의 데이터를 고정된 범위의 값으로 변환하는 방식이다. 자료구조 관점에서는 보통 해시 테이블을 의미하는 경우가 많다. 해시 테이블은 키를 해시 함수에 넣어 배열의 인덱스처럼 사용하고, 이를 통해 데이터를 빠르게 저장하거나 조회한다.</p>
<p data-end="4082" data-start="3715" data-ke-size="size16">대표적인 예시는 Python의 dict, Java의 HashMap, C++의 unordered_map이다.&nbsp;</p>
<p data-end="4361" data-start="4084" data-ke-size="size16">다만 해시 테이블이 항상 O(1)인 것은 아니다. 해시 충돌이 많이 발생하거나, 테이블이 너무 꽉 차거나, 해시 함수가 좋지 않으면 성능이 저하될 수 있다. 그래서 해시 테이블은 보통 load factor, rehashing, collision resolution 같은 개념과 함께 이해해야 한다. Java HashMap 문서도 capacity, load factor, rehashing이 성능에 영향을 준다고 설명한다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>&nbsp;</div>
</div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="bash"><code>student = {}

student["name"] = "Kim"
student["score"] = 95

print(student["name"])   # Kim
print(student["score"])  # 95</code></pre>
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
</div>
</div>
</div>
<h2 data-end="4565" data-start="4553" data-section-id="1cm3w4n" data-ke-size="size26">6. 집합 Set</h2>
<p data-end="4785" data-start="4567" data-ke-size="size16">집합은 중복을 허용하지 않는 자료구조다. 수학의 집합처럼 원소의 존재 여부가 중요하고, 같은 값은 한 번만 저장된다. Python 공식 문서는 set을 중복되지 않는 hashable 객체들의 순서 없는 컬렉션이라고 설명하며, 멤버십 테스트, 중복 제거, 합집합&middot;교집합&middot;차집합 같은 연산에 사용된다고 설명한다.</p>
<p data-end="5047" data-start="4787" data-ke-size="size16">집합은 내부적으로 해시 기반으로 구현되는 경우가 많다. 예를 들어 Java의 HashSet은 Set 인터페이스를 구현하며, 내부적으로 해시 테이블, 실제로는 HashMap 인스턴스에 의해 뒷받침된다고 설명한다. 또한 해시 함수가 원소를 적절히 분산한다는 가정하에 add, remove, contains, size 같은 기본 연산이 상수 시간 성능을 제공한다고 설명한다.</p>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>
<div>&nbsp;</div>
</div>
<div>
<div>
<div>
<div id="code-block-viewer">
<div>
<pre class="routeros"><code>s = set()

s.add(10)
s.add(20)
s.add(10)

print(s)        # {10, 20}
print(10 in s)  # True
print(30 in s)  # False</code></pre>
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
</div>
</div>
</div>
<p data-end="5300" data-start="5180" data-ke-size="size16">집합은 중복 제거, 방문 여부 체크, 빠른 존재 확인, 공통 원소 찾기, 차집합 계산 등에 자주 사용된다. 정리하면, 집합은 중복 없이 원소를 저장하고, 특정 값이 존재하는지 빠르게 확인해야 할 때 사용한다.</p>
</div>
</div>
<div>&nbsp;</div>
</div>
</div>
<div id="thread-bottom-container">
<div>&nbsp;</div>
<div id="thread-bottom">
<div>&nbsp;</div>
<div>
<div data-composer-surface="true">
<div>
<div>
<div id="prompt-textarea" contenteditable="true" data-virtualkeyboard="true"><a href="https://loj.kr/problems/88" target="_blank" rel="noopener&nbsp;noreferrer">https://loj.kr/problems/88</a></div>
</div>
</div>
<div>
<div>&nbsp;</div>
<div>문제 설명:</div>
<div><figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1318" data-origin-height="272"><span data-url="https://blog.kakaocdn.net/dna/ciCjaQ/dJMcaarUn8s/AAAAAAAAAAAAAAAAAAAAAA6WQ8rwj06LwJ2dPy-syhWqPAat4RgKGz_weqj2tTpn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=2QKNj6kPXK2u8n8V%2FQSZCzqNOvQ%3D" data-phocus="https://blog.kakaocdn.net/dna/ciCjaQ/dJMcaarUn8s/AAAAAAAAAAAAAAAAAAAAAA6WQ8rwj06LwJ2dPy-syhWqPAat4RgKGz_weqj2tTpn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=2QKNj6kPXK2u8n8V%2FQSZCzqNOvQ%3D"><img src="https://blog.kakaocdn.net/dna/ciCjaQ/dJMcaarUn8s/AAAAAAAAAAAAAAAAAAAAAA6WQ8rwj06LwJ2dPy-syhWqPAat4RgKGz_weqj2tTpn/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=2QKNj6kPXK2u8n8V%2FQSZCzqNOvQ%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FciCjaQ%2FdJMcaarUn8s%2FAAAAAAAAAAAAAAAAAAAAAA6WQ8rwj06LwJ2dPy-syhWqPAat4RgKGz_weqj2tTpn%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D2QKNj6kPXK2u8n8V%252FQSZCzqNOvQ%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1318" height="272" data-origin-width="1318" data-origin-height="272"/></span></figure>
</div>
<div>
<div>
<div>
<div>&nbsp;</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div>
<div>첫 번째 입력에는 n * m 배열의 크기를 선언하고, 나머지 입력에서 항상 같은 값이 있을 때만 출력을 띄우고 하나라도 달라져 있는 값이 달라지면 ?? &lt;- 이렇게 출력한다.&nbsp;</div>
<div>&nbsp;</div>
<div>
<pre id="code_1779724719005" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>N, M = map(int, input().split())

paper = []

for i in range(N):
    line = input().split()
    paper.append(line)

result = []

for j in range(M):
    check = set()

    for i in range(N):
        check.add(paper[i][j])

    if len(check) == 1:
        for x in check:
            result.append(x)
    else:
        result.append("??")

for i in range(M):
    print(result[i], end=" ")</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">n, m을 사용해서 얼마 정도의 크기에 넣을 것 인지 확인을 하고.</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">line이라는 변수를 사용하여서 실제로 그 값들을 넣는다.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1779725153039" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>paper = [
    ["AB", "CD", "EF", "GH"],
    ["AB", "CD", "EG", "GH"],
    ["AB", "CD", "EH", "GH"]
]</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p style="color: #333333; text-align: start;" data-ke-size="size16">그 후 set이라는 python에서 주는 자료구조를 활용하여서 for문을 활용해서 check.add를 해준다.&nbsp;</p>
<p style="color: #333333; text-align: start;" data-ke-size="size16">&nbsp;</p>
<p style="color: #333333; text-align: start;" data-ke-size="size16">그러면&nbsp;</p>
<p style="color: #333333; text-align: start;" data-ke-size="size16">paper에 있는 값들을 비교하면서 AB, AB, AB가 같으면 하나만 check으로 들어가고 값이 다르면 check에 EF, EG, EH이렇게 들어간다. 그러면 자료구조 특성상 모두 다 같은 값이 들어가면 len이 1, 그것이 아니라면 len이 1보다 크게 된다. 이것을통해서 문제를 풀었다.</p>
<p style="color: #333333; text-align: start;" data-ke-size="size16">&nbsp;</p>
<p style="color: #333333; text-align: start;" data-ke-size="size16">&nbsp;&nbsp;</p>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1298" data-origin-height="729"><span data-url="https://blog.kakaocdn.net/dna/d7d7ds/dJMcahxPiTO/AAAAAAAAAAAAAAAAAAAAAPXqwEAmCFW0-tHYgk_aJY-U75ap8s2cSJMv1QhwdeBA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=2v9Q76maXPDoYBg9XtSCdzSSKcE%3D" data-phocus="https://blog.kakaocdn.net/dna/d7d7ds/dJMcahxPiTO/AAAAAAAAAAAAAAAAAAAAAPXqwEAmCFW0-tHYgk_aJY-U75ap8s2cSJMv1QhwdeBA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=2v9Q76maXPDoYBg9XtSCdzSSKcE%3D"><img src="https://blog.kakaocdn.net/dna/d7d7ds/dJMcahxPiTO/AAAAAAAAAAAAAAAAAAAAAPXqwEAmCFW0-tHYgk_aJY-U75ap8s2cSJMv1QhwdeBA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=2v9Q76maXPDoYBg9XtSCdzSSKcE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fd7d7ds%2FdJMcahxPiTO%2FAAAAAAAAAAAAAAAAAAAAAPXqwEAmCFW0-tHYgk_aJY-U75ap8s2cSJMv1QhwdeBA%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D2v9Q76maXPDoYBg9XtSCdzSSKcE%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1298" height="729" data-origin-width="1298" data-origin-height="729"/></span></figure>

<hr contenteditable="false" data-ke-type="horizontalRule" data-ke-style="style5" />
<p data-ke-size="size16"><a href="https://loj.kr/problems/138" target="_blank" rel="noopener&nbsp;noreferrer">https://loj.kr/problems/138</a></p>
<figure id="og_1779728487678" contenteditable="false" data-ke-type="opengraph" data-ke-align="alignCenter" data-og-type="article" data-og-title="#138 중첩 캡슐 해제 | 리수 온라인 저지" data-og-description="정답 1회 / 제출 3회. 올바른 괄호열로 주어지는 중첩 캡슐 구조에서, 가장 바깥 캡슐이 이미 열린 상태일 때 모든 캡슐을 여는 최소 시간을 구하는 문제이다." data-og-host="loj.kr" data-og-source-url="https://loj.kr/problems/138" data-og-url="https://loj.kr/problems/138" data-og-image="https://blog.kakaocdn.net/dna/AcK6h/dJMb8YXRWQj/AAAAAAAAAAAAAAAAAAAAAMJLitTEq86jsyNTQFAmDDBnqgs4495LYMvn7RMqwvW8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=7YGjAFASWcTr%2FjPAipJK8r0Dz9o%3D"><a href="https://loj.kr/problems/138" target="_blank" rel="noopener" data-source-url="https://loj.kr/problems/138">
<div class="og-image" style="background-image: url('https://blog.kakaocdn.net/dna/AcK6h/dJMb8YXRWQj/AAAAAAAAAAAAAAAAAAAAAMJLitTEq86jsyNTQFAmDDBnqgs4495LYMvn7RMqwvW8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=7YGjAFASWcTr%2FjPAipJK8r0Dz9o%3D');">&nbsp;</div>
<div class="og-text">
<p class="og-title" data-ke-size="size16">#138 중첩 캡슐 해제 | 리수 온라인 저지</p>
<p class="og-desc" data-ke-size="size16">정답 1회 / 제출 3회. 올바른 괄호열로 주어지는 중첩 캡슐 구조에서, 가장 바깥 캡슐이 이미 열린 상태일 때 모든 캡슐을 여는 최소 시간을 구하는 문제이다.</p>
<p class="og-host" data-ke-size="size16">loj.kr</p>
</div>
</a></figure>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">해당 문제는 stack 구조를 이해하려고 문제를 선택했다. 해당 문제는</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">1. 첫 번째 입력에서는 N을 입력받아서 캡슐의 개수를 확인한다.</p>
<p data-end="148" data-start="71" data-ke-size="size16">2. 그 다음 입력되는 괄호 문자열을 보고, (가 나오면 새로운 캡슐이 시작된 것으로 보고 )가 나오면 하나의 캡슐이 끝난 것으로 본다.</p>
<p data-is-only-node="" data-is-last-node="" data-end="237" data-start="150" data-ke-size="size16">3. 각 캡슐 안에 있는 내부 캡슐들을 어떤 순서로 열어야 전체 시간이 가장 적게 걸리는지 계산해서, 모든 캡슐을 여는 데 필요한 최소 시간을 출력하는 문제이다.</p>
<p data-ke-size="size16">&nbsp;</p>
<pre id="code_1779728494787" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>N = int(input())
S = input().strip()

stack = []
answer = 0

for ch in S:
    if ch == '(':
        stack.append([])
    else:
        child = stack.pop()

        child.sort(reverse=True)

        time = 0

        for i in range(len(child)):
            temp = child[i] + i * 2 + 1

            if temp &gt; time:
                time = temp

        if len(stack) == 0:
            answer = time
        else:
            stack[-1].append(time)

print(answer)</code></pre>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>N을 사용해서 괄호 문자열이 얼마 정도의 크기인지 확인을 하고, </span><span>S라는 변수를 사용하여서 실제 괄호 문자열을 입력받는다.</span><br /><br /><span>그 후 stack이라는 리스트를 사용해서 캡슐 구조를 저장한다.</span><br /><br /><span>문자열을 왼쪽부터 하나씩 확인하면서 여는 괄호 '('가 나오면 새로운 캡슐이 시작된 것이기 때문에 stack에 빈 리스트를 넣어준다.</span><br /><span>이런 식으로 새로운 캡슐 공간을 만들어주는 것이다.</span><br /><br /><span>그 다음 닫는 괄호 ')'가 나오면, 지금 보고 있던 캡슐 하나가 끝났다는 뜻이므로 stack에서 pop을 사용해서 꺼낸다.</span></p>
<p data-ke-size="size16">-&gt; 여기까지가 if else문을 나눈 이유!</p>
<p data-ke-size="size16"><br /><span>그 후, 꺼낸 값은 그 캡슐 안에 들어있던 자식 캡슐들의 시간이 된다. (이해가 잘 가지 않아서)</span><span>예를 들어 어떤 캡슐 안에 자식 캡슐들이 3개 있고, 각각 걸리는 시간이 4, 2, 1이라고 하면</span><br /><br /></p>
<pre id="code_1779729206740" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>child = [4, 2, 1]</code></pre>
<p data-ke-size="size16"><br /><span>이런 식으로 저장되어 있다.</span><br /><br /><span>그 후 child.sort(reverse=True)를 사용해서 오래 걸리는 캡슐부터 먼저 열도록 정렬해준다.</span><br /><span>-&gt; 그 이유는 오래 걸리는 캡슐을 먼저 열어야 전체 시간이 줄어들기 때문이다.</span><br /><br /><span>그 다음 for문을 사용해서 각각의 자식 캡슐을 여는 데 걸리는 시간을 계산한다.</span></p>
<pre id="code_1779729495816" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>temp = child[i] + i * 2 + 1</code></pre>
<p data-ke-size="size16"><br /><span>여기서 child[i]는 그 자식 캡슐 내부를 전부 여는 데 걸리는 시간이고, i * 2 + 1은 그 자식 캡슐까지 이동해서 여는 데 걸리는 시간이다. </span><span>이 값들 중에서 가장 큰 값이 현재 캡슐을 전부 여는 데 필요한 시간이 된다. </span><span>계산이 끝난 후에 아직 stack에 부모 캡슐이 남아있으면, 방금 계산한 시간을 부모 캡슐의 리스트에 넣어준다.</span></p>
<pre id="code_1779729521708" class="bash" data-ke-language="bash" data-ke-type="codeblock"><code>stack[-1].append(time)</code></pre>
<p data-ke-size="size16"><br /><span>만약 stack이 비어있다면, 지금 계산한 캡슐이 가장 바깥쪽 캡슐이라는 뜻이므로 answer에 저장한다. </span><span>마지막으로 answer를 출력하면 전체 캡슐을 여는 데 걸리는 최소 시간이 나온다.</span><br /><br /><span>결과적으로, 이 문제는 괄호를 하나씩 보면서 stack에 캡슐 구조를 저장하고, 닫는 괄호가 나올 때마다 해당 캡슐의 시간을 계산하는 방식으로 풀었다.</span></p>
<figure class="imageblock alignCenter" data-ke-mobileStyle="widthOrigin" data-origin-width="1354" data-origin-height="740"><span data-url="https://blog.kakaocdn.net/dna/evqADG/dJMcaicsMBw/AAAAAAAAAAAAAAAAAAAAADolqv_HYDspge1NSDzNMkfx32_9O0a1LP3M6G8HNn-_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=OBgwXLuq%2FOavTsN2AaGI%2F%2FEuBmA%3D" data-phocus="https://blog.kakaocdn.net/dna/evqADG/dJMcaicsMBw/AAAAAAAAAAAAAAAAAAAAADolqv_HYDspge1NSDzNMkfx32_9O0a1LP3M6G8HNn-_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=OBgwXLuq%2FOavTsN2AaGI%2F%2FEuBmA%3D"><img src="https://blog.kakaocdn.net/dna/evqADG/dJMcaicsMBw/AAAAAAAAAAAAAAAAAAAAADolqv_HYDspge1NSDzNMkfx32_9O0a1LP3M6G8HNn-_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=OBgwXLuq%2FOavTsN2AaGI%2F%2FEuBmA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FevqADG%2FdJMcaicsMBw%2FAAAAAAAAAAAAAAAAAAAAADolqv_HYDspge1NSDzNMkfx32_9O0a1LP3M6G8HNn-_%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DOBgwXLuq%252FOavTsN2AaGI%252F%252FEuBmA%253D" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="1354" height="740" data-origin-width="1354" data-origin-height="740"/></span></figure>
</div>
            <!-- System - START -->

<!-- System - END -->

                    <div class="
