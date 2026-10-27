---
layout: post
title: 도커 쿠버네티스
date: 2026-10-14
desc: "컨테이너와 Docker 기본 개념부터 Container Orchestration의 필요성, Kubernetes의 Pod/Deployment/Service/Namespace/ConfigMap 구조와 kubectl 실습까지 정리"
keywords: "Docker, Kubernetes, 쿠버네티스, 컨테이너, Container, Dockerfile, Container Orchestration, Pod, Deployment, Service, Namespace, ConfigMap, Secret, kubectl, 프론티어"
categories: [TechnicalDocument]
tags: [프론티어, Docker, Kubernetes, 컨테이너]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/71](https://sanghole.tistory.com/71)

<h3 data-ke-size="size23"><span>1. </span><span>컨테이너(Container)란?</span></h3>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="327" data-origin-width="263"><span data-phocus="https://blog.kakaocdn.net/dna/1FSLP/dJMcaaAqAlx/AAAAAAAAAAAAAAAAAAAAAFoHl4YM9JVsILxle4b9MO2iylm1PdUHGKArX39kYPcF/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=t1CBaoMGd7ML6TOua%2B8SsApUaA4%3D" data-url="https://blog.kakaocdn.net/dna/1FSLP/dJMcaaAqAlx/AAAAAAAAAAAAAAAAAAAAAFoHl4YM9JVsILxle4b9MO2iylm1PdUHGKArX39kYPcF/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=t1CBaoMGd7ML6TOua%2B8SsApUaA4%3D"><img data-origin-height="327" data-origin-width="263" height="327" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/1FSLP/dJMcaaAqAlx/AAAAAAAAAAAAAAAAAAAAAFoHl4YM9JVsILxle4b9MO2iylm1PdUHGKArX39kYPcF/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=t1CBaoMGd7ML6TOua%2B8SsApUaA4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F1FSLP%2FdJMcaaAqAlx%2FAAAAAAAAAAAAAAAAAAAAAFoHl4YM9JVsILxle4b9MO2iylm1PdUHGKArX39kYPcF%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dt1CBaoMGd7ML6TOua%252B8SsApUaA4%253D" width="263"/></span></figure>
</p>
<p data-ke-size="size16">도커와 컨테이너의 개념은 왜 나오게 되었을까? 위에 있는 사진은 localhost에 대한 글이긴 하지만, " 내 컴퓨터에서는 잘 실행되던 애플리케이션인데! 너 컴퓨터로 가니까 실행이 안되잖아!!!" 라는 상황이 많았다. 보통 개발자는 개발 환경에서 애플리케이션을 개발하고 테스트한 후, 운여팀인 Ops팀에게 전달하여 실제 서비스 환경에 배포한다고 하는데 이 때 개발 환경과 운영 환경이 항상 동일한 것은 아니다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">개발자가 배포 가이드를 제공하더라도 운영 팀이 직접 환경을 구성하는 과정에서 설정이 누락되거나서로 다른 버전의 의존성이 설치될 수 있기 때문에 애플리케이션 코드뿐만 아니라 애플리케이션이 실행되는 환경도 일관되게 관리할 필요가 있다. </p>
<p data-ke-size="size16">이러한 문제를 해결하는 방법 중 하나가 바로 컨테이너 기술이다. </p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">그래서 컨테이너가 구체적으로 뭐지?</h4>
<p data-ke-size="size16">컨테이너란 애플리케이션을 실행하는 데 필요한 코드, 라이브러리, 런타임 등의 환경을 격리하여 실행할 수 있도록 하는 기술이다. 컨테이너는 호스트 운영체제의 커널을 공유하면서도, 각각 독립된 프로세스 및 파일 시스템, 네트워크 환경 등을 가진 것처럼 동작한다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">컨테이너를 사용할 때의 장점은 </p>
<p data-ke-size="size16">1. 일관된 실행 환경</p>
<p data-ke-size="size16">2. 격리된 환경</p>
<p data-ke-size="size16">3. 효율적인 리소스 사용</p>
<p data-ke-size="size16">4. 배포 및 확장의 용이성</p>
<p data-ke-size="size16">이 있다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이 컨테이너를 이해할 때 중요한 개념이 있는데, Image와 Container의 차이이다. </p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li>Iamge : 애플리케이션 실행에 필요한 파일과 설정을 포함하는 읽기 전용 템플릿</li>
<li>Container : 이미지를 기반으로 생성되어 실행되는 격리된 환경</li>
</ul>
<p data-ke-size="size16">쉽게 말하면 Image는 컨테이너를 생성하기 위한 설계도이며 해당 설계도를 통해 만들어진 실제 인스턴스를 Container라고 부르는 것 이다.</p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="479" data-origin-width="1168"><span data-phocus="https://blog.kakaocdn.net/dna/b4i7Gh/dJMcahGcBLq/AAAAAAAAAAAAAAAAAAAAAN733JYj16dbshjcAA7wJ0aF7V2Buom76qdBg_XmmFa0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=77xWukQpzfpOEwdnZikccsUdat4%3D" data-url="https://blog.kakaocdn.net/dna/b4i7Gh/dJMcahGcBLq/AAAAAAAAAAAAAAAAAAAAAN733JYj16dbshjcAA7wJ0aF7V2Buom76qdBg_XmmFa0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=77xWukQpzfpOEwdnZikccsUdat4%3D"><img data-origin-height="479" data-origin-width="1168" height="203" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/b4i7Gh/dJMcahGcBLq/AAAAAAAAAAAAAAAAAAAAAN733JYj16dbshjcAA7wJ0aF7V2Buom76qdBg_XmmFa0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=77xWukQpzfpOEwdnZikccsUdat4%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb4i7Gh%2FdJMcahGcBLq%2FAAAAAAAAAAAAAAAAAAAAAN733JYj16dbshjcAA7wJ0aF7V2Buom76qdBg_XmmFa0%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D77xWukQpzfpOEwdnZikccsUdat4%253D" width="495"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20">그냥 가상 머신, VMware쓰면 되는거 아니에요?</h4>
<p data-ke-size="size16">두 기술은 다 격리된 환경에서 애플리케이션을 실행할 수 있다는 공통점이 있지만 가상화 하는 대상과 구조에서의 차이가 존재한다.</p>
<p data-ke-size="size16">가상 머신(virtual Machine)은 Hypervisor를  이용하여 물리적인 하드웨어 자원을 가상화하는 방식이다. 각 VM은 독립적인 Guest OS를 가지며, 해당 운영체제 위에서 애플리케이션을 실행한다.</p>
<p data-ke-size="size16">-&gt; 서로 다른 운영체제를 실행할 수 있고 강한 격리 환경을 제공한다는 장점이 있지만 VM마다의 별도의 OS가 필요해 많은 리소스가 사용된다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">하지만 Container는 운영체제 수준에서 프로세스를 격리하는 방식이라 별도의 Guest OS를 실행하지 않고, 호스트 OS의 커널을 공유한다. 그래서 가볍고 빠르며 하나의 호스트에서 여러 컨테이너를 효율적으로 운영할 수 있다. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18">Container의 단점?</p>
<p data-ke-size="size18"> </p>
<ol data-ke-list-type="decimal" style="list-style-type: decimal;">
<li>컨테이너 내부에서 커널 취약점이 악용되거나 격리 경계를 우회하는 공격이 발생하면 호스트 시스템이나 다른 컨테이너에도 영향을 줄 수 있다. VM과 동일한 수준의 격리를 보장하긴 힘들다.</li>
<li>컨테이너는 호스트 OS의 커널을 공유하므로 서로 다른 종류의 커널을 독립적으로 실행할 수 없다.</li>
</ol>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23"><span>2. </span><span>Docker란?</span></h3>
<p data-ke-size="size16">앞서 컨테이너는 애플리케이션을 격리된 환경에서 실행할 수 있도록 하는 기술이라고 했는데 이러한 컨테이너는 어떻게 만들고 관리할까? </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">이때 사용하는 대표적인 플랫폼이 바로 Docker이다. <span>Docker는 컨테이너 기반의 애플리케이션을 개발, 배포 및 실행할 수 있도록 지원하는 오픈소스 플랫폼이다.</span></p>
<h4 data-ke-size="size20"><span>Docker를 왜 사용할까?</span></h4>
<p data-ke-size="size16">뭐 Docker가 없어도 커널 기능을 이용하면 컨테이너 환경을 구성할 수 있지만.. 개발자가 이거를 일일히 구성하고 배포까지 하기에는 너무 번거롭다. Docker는 이러한 과정을 간편하게 수행할 수 있도록 해준다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>개발자는 애플리케이션의 실행 환경을 </span><span>Dockerfile</span><span>이라는 파일에 정의하고, 이를 기반으로 </span><span>Docker Image</span><span>를 생성한다. 생성된 이미지는 다른 개발자나 운영 팀에 전달할 수 있으며, Docker가 설치되어 있고 이미지와 호환되는 환경이라면 동일한 이미지를 기반으로 컨테이너를 실행할 수 있다.</span></p>
<p data-ke-size="size16" data-pm-slice="1 1 []"> </p>
<h4 data-ke-size="size20" data-pm-slice="1 1 []"><span>Docker Image와 Dockerfile에 대해서</span></h4>
<p data-ke-size="size16"><span>Docker Image는 애플리케이션 실행에 필요한 코드, 라이브러리, 런타임, 설정 등을 포함하고 있으며 여러 개의 Layer로 구성된다. 앞서 설명했듯이 Image 자체가 실행 중인 애플리케이션은 아니다. </span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>Dockerfile은 Docker Image를 생성하기 위한 명령어와 설정을 작성해 놓은 파일이다. 개발자는 Dockerfile에 어떤 기본 이미지를 사용할 것인지, 어떤 파일을 포함할 것인지, 필요한 프로그램은 어떻게 설치하고 애플리케이션은 어떻게 실행할 것인지 등을 정의한다.</span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23">이제 지금까지 설명했던 것들을 하나의 예시로 들어보자</h3>
<p data-ke-size="size16">짱짱 개발자 : Nginx 웹 서버를 만들고, 운영 팀에 넘겨보자!</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16" data-pm-slice="1 1 []"><span>개발자가 Nginx를 이용하여 간단한 웹 페이지를 만들었다고 가정해 보자.</span></p>
<p data-ke-size="size16"><span>이제 해당 웹 페이지를 운영 팀(Ops)에 전달하여 실제 서버에 배포하려고 한다.</span></p>
<p data-ke-size="size16"><span>Docker를 사용한다면 어떤 과정을 거치게 될까?</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18" data-pm-slice="1 1 []"><b><span>1. Dockerfile 작성</span></b></p>
<p data-ke-size="size16"><span>먼저 프로젝트 디렉터리에 Dockerfile과 index.html 파일을 생성한다.</span></p>
<pre class="axapta"><code>nginx-demo/
├── Dockerfile
└── index.html</code></pre>
<p data-ke-size="size16"><span>index.html에는 간단한 HTML 코드를 작성한다.</span></p>
<pre class="html xml" data-ke-language="html"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;body&gt;
    &lt;h1&gt;Hello Docker!&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p data-ke-size="size16"><span>그다음 Dockerfile을 아래와 같이 작성한다.</span></p>
<pre class="pgsql"><code>FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80</code></pre>
<p data-ke-size="size16"><span>각 명령어의 의미는 다음과 같다.</span></p>
<ul data-ke-list-type="disc" data-spread="false" style="list-style-type: disc;">
<li><span>FROM</span><span> : 이미지를 생성할 때 사용할 기본 이미지를 지정한다.</span></li>
<li><span>COPY</span><span> : 호스트의 빌드 컨텍스트에 있는 파일을 이미지 내부로 복사한다.</span></li>
<li><span>EXPOSE</span><span> : 컨테이너에서 사용할 포트를 명시한다.</span></li>
</ul>
<p data-ke-size="size16"><span>여기서 </span><span>nginx:alpine</span><span>은 Alpine Linux 기반의 공식 Nginx 이미지이다.. </span><span>그리고 </span><span>COPY</span><span> 명령어를 이용하여 우리가 작성한 HTML 파일을 Nginx의 기본 웹 페이지 경로에 복사한다. </span><span>이제 Dockerfile 작성이 완료되었다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>그런데 Dockerfile을 작성했다고 해서 웹 서버가 실행되는 것은 아니기 때문에,, 아직 많은 과정이 남았다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b><span>2. Docker Image 생성</span></b></p>
<p data-ke-size="size16"><span>앞서 Dockerfile은 이미지를 만드는 방법을 정의한 파일이라고 했다. </span><span>그렇다면 작성한 Dockerfile을 실제 Image로 만들어 보자.</span></p>
<pre class="angelscript"><code>docker build -t my-nginx:1.0 .</code></pre>
<ul data-ke-list-type="disc" data-spread="false" style="list-style-type: disc;">
<li><span>docker build</span><span> : Dockerfile을 기반으로 이미지를 생성한다.</span></li>
<li><span>-t</span><span> : 생성할 이미지의 이름과 태그를 지정한다.</span></li>
<li><span>my-nginx:1.0</span><span> : 이미지 이름은 my-nginx, 태그는 1.0이다.</span></li>
<li><span>.</span><span> : 현재 디렉터리를 빌드 컨텍스트로 지정한다.</span></li>
</ul>
<p data-ke-size="size16"><span>이 명령어를 실행하면 Docker는 Dockerfile에 작성된 명령어를 바탕으로 이미지를 생성한다. </span><span>생성된 이미지는 다음 명령어로 확인할 수 있다.</span></p>
<pre class="ebnf"><code>docker images</code></pre>
<p data-ke-size="size16"><span>이제 </span><span>my-nginx:1.0</span><span>이라는 Image가 만들어졌다고 가정하고 넘어가보자.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b><span>3. Container 생성 및 실행</span></b></p>
<p data-ke-size="size18"> </p>
<p data-ke-size="size16"><span>이미지를 생성했으니 실제 웹 서버를 실행해 보자.</span></p>
<pre class="angelscript"><code>docker run -d --name nginx-dev -p 8080:80 my-nginx:1.0</code></pre>
<ul data-ke-list-type="disc" data-spread="false" style="list-style-type: disc;">
<li><span>docker run</span><span> : 이미지를 기반으로 컨테이너를 생성하고 실행한다.</span></li>
<li><span>-d</span><span> : 백그라운드에서 컨테이너를 실행한다.</span></li>
<li><span>--name nginx-dev</span><span> : 컨테이너 이름을 nginx-dev로 지정한다.</span></li>
<li><span>-p 8080:80</span><span> : 호스트의 8080 포트를 컨테이너의 80 포트에 연결한다.</span></li>
<li><span>my-nginx:1.0</span><span> : 실행할 이미지이다.</span></li>
</ul>
<p data-ke-size="size16"><span>컨테이너가 정상적으로 실행되었는지 확인해 보려면 docker 명령어를 사용하면 된다.</span></p>
<pre class="ebnf"><code>docker ps</code></pre>
<p data-ke-size="size16"><span>해당 명령어는 현재 실행 중인 컨테이너의 목록을 보여준다. </span><span>이제 브라우저에서 </span><span>http://localhost:8080</span><span>으로 접속하면 우리가 작성했던 Hello Docker! 페이지를 확인할 수 있다. </span><span>즉, Dockerfile을 통해 생성한 Image를 기반으로 실제 Container가 실행된 것이다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b><span>4. 운영 팀에게 Image 전달하기</span></b></p>
<p data-ke-size="size16"><span>그런데 문제가 하나 있다. </span><span>지금 생성한 Docker Image는 개발자의 로컬 환경에만 존재한다. </span><span>그렇다면 운영 팀은 이 이미지를 어떻게 가져갈 수 있을까?</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>여기서 </span><b><span>Docker Hub</span></b><span>가 등장한다.</span></p>
<p data-ke-size="size16"><span>Docker Hub는 Docker Image를 저장하고 공유할 수 있는 원격 이미지 저장소(Registry) 서비스이다. </span><span>개발자는 자신이 만든 이미지를 Docker Hub에 업로드하고, 운영 팀은 해당 이미지를 다운로드하여 사용할 수 있다. </span><span>먼저 Docker Hub에 로그인한다.</span></p>
<pre class="ebnf"><code>docker login</code></pre>
<p data-ke-size="size16"><span>그리고 이미지를 Docker Hub에 업로드할 수 있도록 태그를 지정한다.</span></p>
<pre class="crmsh"><code>docker tag my-nginx:1.0 your-dockerhub-id/nginx-demo:1.0</code></pre>
<p data-ke-size="size16"><span>여기서 </span><span>your-dockerhub-id</span><span>는 실제 Docker Hub 사용자 이름으로 변경해야 한다. </span><span>이제 Docker Hub에 </span><span>nginx-demo</span><span> 저장소를 생성한 후 이미지를 업로드한다.</span></p>
<pre class="maxima"><code>docker push your-dockerhub-id/nginx-demo:1.0</code></pre>
<p data-ke-size="size16"><span>docker push</span><span>는 로컬에 존재하는 이미지를 원격 Registry에 업로드하는 명령어이다. </span><span>이렇게 하면 개발자가 만든 Image가 Docker Hub에 저장된다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b><span>5. Ops 팀 : 이제 우리가 배포해 보자!</span></b></p>
<p data-ke-size="size16"><span>이제 운영 팀이 등장할 차례이다. </span><span>운영 팀은 개발자가 작성한 Dockerfile을 다시 빌드하거나, Nginx를 직접 설치하고 설정할 필요가 없다. </span><span>Docker가 설치된 운영 서버에서 개발자가 업로드한 이미지를 다운로드하면 된다.</span></p>
<pre class="angelscript"><code>docker pull your-dockerhub-id/nginx-demo:1.0</code></pre>
<p data-ke-size="size16"><span>docker pull</span><span>은 원격 Registry에서 이미지를 다운로드하는 명령어이다. </span><span>다운로드가 완료되었다면 운영 서버에서 이미지를 실행해 보자.</span></p>
<pre class="livescript"><code>docker run -d \
  --name nginx-prod \
  -p 8080:80 \
  --restart unless-stopped \
  your-dockerhub-id/nginx-demo:1.0</code></pre>
<p data-ke-size="size16"><span>여기서 </span><span>--restart unless-stopped</span><span>는 컨테이너가 비정상적으로 종료되거나 Docker 데몬이 재시작되는 등의 상황에서 컨테이너를 자동으로 다시 시작하도록 설정하는 옵션이다. </span><span>실행 상태는 다음 명령어로 확인할 수 있다.</span></p>
<pre class="properties"><code>docker ps
docker logs nginx-prod</code></pre>
<p data-ke-size="size16"><span>그리고 운영 서버에서 </span><span>curl http://localhost:8080</span><span>을 실행하면 웹 페이지의 응답을 확인할 수 있다. </span><span>결국 운영 팀은 개발자가 만든 이미지를 다운로드하고 실행하는 것만으로 웹 서버를 배포할 수 있게 된 것이다!!</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b><span>6. 그럼 애플리케이션이 수정되면?</span></b></p>
<p data-ke-size="size16"><span>이번에는 개발자가 웹 페이지의 내용을 수정했다고 가정해 보자. </span><span>개발자는 수정된 파일을 기반으로 새로운 이미지를 생성한다.</span></p>
<pre class="maxima"><code>docker build -t your-dockerhub-id/nginx-demo:1.1 .
docker push your-dockerhub-id/nginx-demo:1.1</code></pre>
<p data-ke-size="size16"><span>기존 이미지의 태그는 </span><span>1.0</span><span>이었지만, 수정된 이미지에는 </span><span>1.1</span><span>이라는 새로운 태그를 부여했다. </span><span>운영 팀에서는 새로운 이미지를 다운로드한다.</span></p>
<pre class="angelscript"><code>docker pull your-dockerhub-id/nginx-demo:1.1</code></pre>
<p data-ke-size="size16"><span>기존 컨테이너를 중지하고 삭제한 후, 새로운 이미지로 컨테이너를 실행한다.</span></p>
<pre class="properties"><code>docker stop nginx-prod
docker rm nginx-prod

docker run -d \
  --name nginx-prod \
  -p 8080:80 \
  --restart unless-stopped \
  your-dockerhub-id/nginx-demo:1.1</code></pre>
<p data-ke-size="size16"><span>이렇게 하면 운영 팀은 애플리케이션의 실행 환경을 직접 재설정하지 않고도 새로운 버전을 배포할 수 있다. </span></p>
<div>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
</div>
<p data-ke-size="size16"><span>결과적으로 Docker를 이용하면 개발자는 애플리케이션과 실행 환경을 Image로 패키징하고, 운영 팀은 동일한 Image를 이용하여 애플리케이션을 실행할 수 있다. </span><span>이것이 Docker가 개발과 운영 과정에서 유용하게 사용되는 이유 중 하나이다.</span><span></span></p>
<h2 data-ke-size="size26"><b><span>그런데 여기서 또 다른 문제가 발생한다.</span></b></h2>
<p data-ke-size="size16"><span>지금은 컨테이너가 하나뿐이라 쉽게 관리할 수 있었다. </span><span>하지만 실제 서비스에서 수십, 수백 개의 컨테이너를 사용한다면 어떻게 될까? </span><span>특정 서버에 장애가 발생하거나, 사용자가 증가하여 컨테이너를 추가로 실행해야 한다면?</span></p>
<p data-ke-size="size16"><span>이러한 컨테이너들을 일일이 관리하는 것은 상당히 번거로울 것이다. </span><span>이 문제를 해결하기 위해 등장한 개념이 바로 </span><span>Container Orchestration</span><span>이다.</span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23"><span>5. Container Orchestration이란?</span></h3>
<p data-ke-size="size16"><span>앞서 Docker를 이용하여 개발자가 만든 애플리케이션을 운영 팀에 전달하고, 컨테이너로 실행하는 과정을 살펴봤다. </span><span>그런데 실제 서비스에서도 이렇게 간단하게 관리할 수 있을까?</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>실제 애플리케이션은 데이터베이스(DB), 메시징 서비스 등 여러 컨테이너에 의존할 수 있으며, 사용자가 증가하면 더 많은 컨테이너가 필요할 수도 있다. </span><span>만약 컨테이너가 수십, 수백 개라면 이를 일일이 실행하고 관리하는 것은 상당히 번거로울 것이다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>여기서 몇 가지 문제가 발생한다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><b><span>1. 여러 컨테이너의 관리 :</span></b><span>여러 컨테이너를 실행할 때는 컨테이너 간 네트워크 연결, 배포, 상태 확인 등을 관리해야 한다.</span></p>
<p data-ke-size="size16"><b><span>2. 장애 대응: </span></b><span>특정 서버(Node)에 장애가 발생하면 해당 서버에서 실행 중이던 컨테이너도 중단될 수 있다.</span></p>
<p data-ke-size="size16"><b><span>3. Scale Up / Scale Down : </span></b><span>사용자가 급격하게 증가하면 처리할 수 있는 요청량을 늘려야 하고, 반대로 사용자가 감소하면 불필요한 리소스 사용을 줄여야 한다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>이를 위해 컨테이너의 수를 늘리거나 줄이는 작업이 필요하다. 정확히는 컨테이너 복제본 수를 늘리는 것을 </span><b><span>Scale Out</span></b><span>, 줄이는 것을 </span><b><span>Scale In</span></b><span>이라고 한다. </span><span>그렇다면 이러한 작업들을 매번 사람이 직접 해야 할까?!?</span></p>
<h4 data-ke-size="size20"><span>Container Orchestration의 등장</span></h4>
<p data-ke-size="size16"><span>이러한 문제를 해결하기 위해 등장한 개념이 </span><span>Container Orchestration</span><span>이다. </span><span>Container Orchestration은 여러 컨테이너의 배포, 확장, 네트워크 연결, 장애 복구 등을 자동화하여 관리하는 것을 의미한다. </span><span>대표적으로 다음과 같은 기능을 제공한다.</span></p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li><b><span>자동 배포</span></b><span> : 적절한 서버에 컨테이너를 배치하고 실행</span></li>
<li><b><span>자동 복구(Self-Healing)</span></b><span> : 컨테이너에 문제가 발생하면 재시작하거나 재생성</span></li>
<li><b><span>확장(Scaling)</span></b><span> : 필요에 따라 컨테이너 수를 늘리거나 줄임</span></li>
<li><b><span>로드 밸런싱(Load Balancing)</span></b><span> : 여러 컨테이너로 트래픽을 분산</span></li>
</ul>
<p data-ke-size="size16"><span>이러한 Container Orchestration을 수행하는 대표적인 도구가 바로 </span><b><span>Kubernetes</span></b><span>이다.</span></p>
<h4 data-ke-size="size20"><span>Kubernetes가 필요한 이유</span></h4>
<p data-ke-size="size16"><span>Kubernetes는 여러 서버를 하나의 Cluster로 구성하고, 그 안에서 컨테이너 기반 애플리케이션을 관리할 수 있도록 지원한다. </span><span>예를 들어 개발자가 애플리케이션의 컨테이너를 3개 실행하도록 설정하면, Kubernetes는 해당 상태를 유지하도록 관리한다. </span><span>컨테이너에 장애가 발생하더라도 새로운 컨테이너를 생성하여 원하는 개수를 유지하도록 시도한다.</span></p>
<p data-ke-size="size16"><span>또한 특정 Node에 장애가 발생하면, 다른 정상 Node에 여유 리소스가 있다는 등의 조건에서 중단된 워크로드를 다시 실행할 수 있다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>정리하자면 Docker가 애플리케이션을 컨테이너로 패키징하고 실행하는 데 초점을 맞춘다면, Kubernetes는 </span><span>여러 컨테이너를 안정적으로 배포하고 운영하는 데 초점을 맞춘 기술</span><span>이라고 볼 수 있다.</span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23"><span>6. Kubernetes란?</span></h3>
<p data-ke-size="size16"><span>앞서 여러 컨테이너를 자동으로 배포하고 관리하는 과정을 Container Orchestration이라고 설명했다. </span><span>이러한 기능을 제공하는 대표적인 오픈소스 플랫폼이 바로 Kubernetes(K8s)이다. </span><span>Kubernetes는 컨테이너 기반 애플리케이션의 배포, 확장, 장애 복구 등을 자동화하여 관리할 수 있도록 지원한다.</span></p>
<h4 data-ke-size="size20"><span>Kubernetes는 어떻게 컨테이너를 관리할까?</span></h4>
<p data-ke-size="size16"><span>먼저 Kubernetes의 구조를 살펴보자. </span><span>Kubernetes는 여러 대의 서버를 하나의 </span><span>Cluster</span><span>로 구성하여 관리한다. </span><span>Cluster는 크게 Control Plane과 Worker Node로 이루어진다.</span></p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li><b><span>Control Plane</span></b><span> : 클러스터의 전체 상태를 관리하고, 애플리케이션이 원하는 상태를 유지하도록 조정한다.</span></li>
<li><b><span>Worker Node</span></b><span> : 실제 애플리케이션의 컨테이너가 실행되는 서버이다.</span></li>
</ul>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="400" data-origin-width="800"><span data-phocus="https://blog.kakaocdn.net/dna/ycAFe/dJMcafV3MAA/AAAAAAAAAAAAAAAAAAAAADwheKkrT8lLx-e5GvD9DF3IjdEqlmCPhA7KCt91k9Tr/img.webp?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=IdEZoW4XjHYeV3UR5BTc223sfqI%3D" data-url="https://blog.kakaocdn.net/dna/ycAFe/dJMcafV3MAA/AAAAAAAAAAAAAAAAAAAAADwheKkrT8lLx-e5GvD9DF3IjdEqlmCPhA7KCt91k9Tr/img.webp?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=IdEZoW4XjHYeV3UR5BTc223sfqI%3D"><img data-origin-height="400" data-origin-width="800" height="400" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/ycAFe/dJMcafV3MAA/AAAAAAAAAAAAAAAAAAAAADwheKkrT8lLx-e5GvD9DF3IjdEqlmCPhA7KCt91k9Tr/img.webp?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=IdEZoW4XjHYeV3UR5BTc223sfqI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FycAFe%2FdJMcafV3MAA%2FAAAAAAAAAAAAAAAAAAAAADwheKkrT8lLx-e5GvD9DF3IjdEqlmCPhA7KCt91k9Tr%2Fimg.webp%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DIdEZoW4XjHYeV3UR5BTc223sfqI%253D" width="800"/></span></figure>
</p>
<p data-ke-size="size16"><span>예를 들어 특정 Worker Node에 장애가 발생했다고 가정해 보자. </span><span>Control Plane은 Node의 상태를 감지하고, Deployment와 같은 리소스를 통해 관리되는 Pod를 다른 정상 Node에 다시 생성하도록 조정할 수 있다. </span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>여기서 Kubernetes는 컨테이너를 직접 관리하기보다 </span><span>Pod라는 단위를 중심으로 애플리케이션을 관리한다. </span><span>그렇다면 Pod는 무엇일까?</span></p>
<div> </div>
<h4 data-ke-size="size20"><span>6.1 Pod란?</span></h4>
<p data-ke-size="size16"><span>Pod는 Kubernetes에서 생성하고 관리할 수 있는 </span><span>가장 작은 배포 단위</span><span>이다. </span><span>Docker에서는 Container를 직접 생성하고 실행했다면, Kubernetes에서는 하나 이상의 Container를 Pod 안에 배치하여 실행한다.</span></p>
<p data-ke-size="size16"><span>하나의 Pod에는 일반적으로 하나의 Container가 포함되지만, 필요에 따라 여러 Container가 포함될 수도 있다. </span><span>같은 Pod에 속한 Container들은 네트워크와 스토리지 리소스를 공유할 수 있으며, 동일한 Node에서 함께 실행된다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size18"><b><span>Pod가 장애로 사라지면 어떻게 될까?</span></b></p>
<p data-ke-size="size16"><span>Pod만 단독으로 생성한 경우, 해당 Pod가 삭제되거나 Node 장애로 인해 사라지더라도 동일한 Pod가 자동으로 새로 생성되는 것은 아니다. </span><span>그렇다면 원하는 개수의 Pod를 지속적으로 유지하려면 어떻게 해야 할까?</span></p>
<h4 data-ke-size="size20"><span>6.2 Deployment란?</span></h4>
<p data-ke-size="size16"><span>이때 사용하는 리소스가 </span><b><span>Deployment</span></b><span>이다. </span><span>Deployment는 애플리케이션의 Pod를 원하는 개수만큼 유지하고, 업데이트와 롤백 등을 관리하는 Kubernetes 리소스이다. </span></p>
<p data-ke-size="size16"> </p>
<h4 data-ke-size="size20"><span>6.3 Service란?</span></h4>
<p data-ke-size="size16"><span>그렇다면 Deployment를 이용하여 Pod를 여러 개 생성했을 때, 사용자는 어떤 Pod에 접속해야 할까? </span><span>각 Pod는 고유한 IP 주소를 가지지만, Pod가 삭제되고 다시 생성되면 IP 주소가 변경될 수 있다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>따라서 특정 Pod의 IP 주소에 직접 접근하는 방식은 안정적이지 않다. </span><span>이 문제를 해결하기 위해 사용하는 것이 </span><span>Service</span><span>이다.</span></p>
<p data-ke-size="size16"><span>Service는 여러 Pod에 접근할 수 있도록 안정적인 네트워크 주소를 제공하는 Kubernetes 리소스이다. </span><span>Service는 Label Selector를 이용하여 연결할 Pod를 선택하고, 해당 Pod들로 트래픽을 전달할 수 있다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>Service의 대표적인 종류는 다음과 같다.</span></p>
<ul data-ke-list-type="disc" style="list-style-type: disc;">
<li><b><span>ClusterIP</span></b><span> : 클러스터 내부에서 접근할 수 있도록 하는 기본 Service 유형</span></li>
<li><b><span>NodePort</span></b><span> : Node의 IP와 지정된 포트를 통해 접근할 수 있도록 하는 유형</span></li>
<li><b><span>LoadBalancer</span></b><span> : 외부 로드 밸런서를 이용하여 서비스를 노출하는 유형</span></li>
</ul>
<h4 data-ke-size="size20"><span>6.4 Namespace란?</span></h4>
<p data-ke-size="size16"><span>실제 운영 환경에서는 하나의 Kubernetes Cluster를 여러 팀이나 프로젝트가 함께 사용할 수 있다. </span><span>그렇다면 서로 다른 프로젝트의 리소스들을 어떻게 구분할 수 있을까?</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>이때 사용하는 것이 </span><b><span>Namespace</span></b><span>이다.</span></p>
<p data-ke-size="size16"><span>Namespace는 하나의 Cluster 안에서 리소스를 논리적으로 구분하기 위한 기능이다. </span><span>예를 들어 개발 환경과 운영 환경을 각각 </span><span>dev</span><span>, </span><span>prod</span><span>라는 Namespace로 구분할 수 있다.</span></p>
<pre class="angelscript"><code>kubectl create namespace dev
kubectl create namespace prod</code></pre>
<p data-ke-size="size16"><span>그리고 특정 Namespace에 Pod를 생성하려면 다음과 같이 작성한다.</span></p>
<pre class="coq"><code>kubectl apply -f pod.yaml -n dev</code></pre>
<p data-ke-size="size16"><span>조회할 때도 Namespace를 지정할 수 있다.</span></p>
<pre class="q"><code>kubectl get pods -n dev</code></pre>
<p data-ke-size="size16"><span>Namespace를 사용하면 서로 다른 팀이나 프로젝트의 리소스를 구분하여 관리하기 편리하다. </span><span>단, Namespace 자체가 완전한 보안 격리를 제공하는 것은 아니다. 접근 권한이나 네트워크 통제는 RBAC, NetworkPolicy 등의 추가 설정이 필요하다.</span></p>
<h3 data-ke-size="size23"><span>6.5 ConfigMap과 Secret이란?</span></h3>
<p data-ke-size="size16"><b><span>ConfigMap</span></b></p>
<p data-ke-size="size16"><span>ConfigMap은 애플리케이션에서 사용하는 일반적인 설정 정보를 Key-Value 형태로 저장하는 리소스이다. </span><span>예를 들어 환경 정보를 다음과 같이 정의할 수 있다.</span></p>
<pre class="dts"><code>apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  DB_HOST: "database-service"</code></pre>
<p data-ke-size="size16"><span>이 설정은 Pod에서 환경 변수나 파일 형태로 사용할 수 있다.</span></p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><b><span>Secret</span></b></p>
<p data-ke-size="size16"><span>Secret은 비밀번호, 토큰, 인증서 등의 민감한 정보를 관리하기 위한 Kubernetes 리소스이다. </span><span>ConfigMap과 비슷하게 Key-Value 형태로 데이터를 저장하지만, 민감 정보 관리에 특화되어 있다.</span></p>
<p data-ke-size="size16"> </p>
<h3 data-ke-size="size23"><span>7. kubectl 기본 명령어 및 실습</span></h3>
<p data-ke-size="size16"><span>이제 지금까지 배운 개념들을 이용하여 Nginx 애플리케이션을 Kubernetes에 배포해 보자. </span><span>실습을 위해서는 Kubernetes Cluster가 구성되어 있고 </span><span>kubectl</span><span>로 접근할 수 있어야 한다.</span></p>
<h4 data-ke-size="size20"><span>7.1 kubectl 기본 명령어</span></h4>
<table border="1" data-ke-align="alignLeft" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td><span>kubectl get pods</span></td>
<td><span>Pod 목록 조회</span></td>
</tr>
<tr>
<td><span>kubectl get nodes</span></td>
<td><span>Node 목록 조회</span></td>
</tr>
<tr>
<td><span>kubectl get deployments</span></td>
<td><span>Deployment 목록 조회</span></td>
</tr>
<tr>
<td><span>kubectl get services</span></td>
<td><span>Service 목록 조회</span></td>
</tr>
<tr>
<td><span>kubectl describe pod [이름]</span></td>
<td><span>Pod의 상세 정보 확인</span></td>
</tr>
<tr>
<td><span>kubectl logs [이름]</span></td>
<td><span>Pod의 로그 확인</span></td>
</tr>
<tr>
<td><span>kubectl apply -f [파일]</span></td>
<td><span>YAML 파일의 리소스 생성 및 변경</span></td>
</tr>
<tr>
<td><span>kubectl delete -f [파일]</span></td>
<td><span>YAML 파일에 정의된 리소스 삭제</span></td>
</tr>
<tr>
<td><span>kubectl scale deployment</span></td>
<td><span>Deployment의 Pod 개수 조정</span></td>
</tr>
<tr>
<td><span>kubectl get pods -A</span></td>
<td><span>모든 Namespace의 Pod 조회</span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16"><span>Docker에서 </span><span>docker ps</span><span>로 컨테이너를 조회했다면, Kubernetes에서는 </span><span>kubectl get pods</span><span>로 Pod를 조회한다고 생각하면 된다.</span></p>
<h4 data-ke-size="size20"><span>7.2 Nginx 애플리케이션 배포하기</span></h4>
<p data-ke-size="size16"><span>앞에서 Docker를 이용해 Nginx 컨테이너를 실행했었다. </span><span>이번에는 Kubernetes를 이용하여 Nginx Pod를 2개 실행하고 Service로 연결해 보자. </span><span>먼저 Namespace를 생성한다.</span></p>
<pre class="n1ql"><code>kubectl create namespace nginx-demo</code></pre>
<p data-ke-size="size16"><span>그리고 Deployment를 정의하는 </span><span>deployment.yaml</span><span> 파일을 작성한다.</span></p>
<p data-ke-size="size16"> </p>
<pre class="yaml"><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: nginx-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:alpine
          ports:
            - containerPort: 80</code></pre>
<p data-ke-size="size16"><span>앞의 Docker 실습에서 직접 만든 이미지를 Docker Hub에 업로드했다면 </span><span>image</span><span> 항목을 해당 이미지 이름으로 변경하여 사용할 수도 있다. </span><span>파일을 작성했다면 다음 명령어를 실행한다.</span></p>
<pre class="coq"><code>kubectl apply -f deployment.yaml</code></pre>
<p data-ke-size="size16"><span>이제 Pod가 생성되었는지 확인해 보자.</span></p>
<pre class="maxima"><code>kubectl get pods -n nginx-demo</code></pre>
<p data-ke-size="size16"><span>설정한 </span><span>replicas: 2</span><span>에 따라 Nginx Pod가 2개 생성되는 것을 확인할 수 있다. </span><span>다음으로 </span><span>service.yaml</span><span> 파일을 작성한다.</span></p>
<pre class="yaml"><code>apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: nginx-demo
spec:
  type: ClusterIP
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80</code></pre>
<p data-ke-size="size16"><span>Service를 생성한다.</span></p>
<pre class="coq"><code>kubectl apply -f service.yaml</code></pre>
<p data-ke-size="size16"><span>생성한 Service는 다음 명령어로 확인할 수 있다.</span></p>
<pre class="armasm"><code>kubectl get svc -n nginx-demo</code></pre>
<p data-ke-size="size16"><span>현재 Service는 ClusterIP 타입이므로 기본적으로 클러스터 내부에서만 접근할 수 있다. </span><span>로컬 환경에서 접속해 보려면 다음 명령어를 실행한다.</span></p>
<pre class="angelscript"><code>kubectl port-forward svc/nginx-service 8080:80 -n nginx-demo</code></pre>
<p data-ke-size="size16"><span>명령어를 실행한 터미널을 유지한 상태에서 브라우저로 </span><span>http://localhost:8080</span><span>에 접속하면 Nginx 기본 페이지를 확인할 수 있다.</span></p>
<h4 data-ke-size="size20"><span>7.3 Pod 개수 늘리기</span></h4>
<p data-ke-size="size16"><span>이번에는 사용자가 증가했다고 가정해 보자.</span></p>
<p data-ke-size="size16"><span>기존 2개의 Pod를 4개로 늘리고 싶다면 다음과 같이 실행한다.</span></p>
<pre class="maxima"><code>kubectl scale deployment nginx --replicas=4 -n nginx-demo</code></pre>
<p data-ke-size="size16"><span>그리고 Pod를 다시 조회한다.</span></p>
<pre class="maxima"><code>kubectl get pods -n nginx-demo</code></pre>
<p data-ke-size="size16"><span>새로운 Pod가 생성되면서 총 4개의 Pod를 유지하도록 조정하는 것을 확인할 수 있다. </span><span>이 과정에서 사용자가 직접 </span><span>docker run</span><span>을 네 번 실행할 필요는 없다. </span><span>Kubernetes가 설정한 원하는 상태에 맞춰 Pod의 개수를 관리하기 때문이다. </span><span>다만 지금 수행한 것은 수동 확장이며, CPU 사용률 등의 지표에 따라 자동으로 확장하려면 HPA(Horizontal Pod Autoscaler)와 같은 기능을 추가로 구성해야 한다.</span></p>
<p data-ke-size="size16"> </p>
<div data-ke-type="moreLess" data-text-less="닫기" data-text-more="더보기"><a class="btn-toggle-moreless">더보기</a>
<div class="moreless-content">
<p data-ke-size="size16"><a href="https://learn.kodekloud.com/learn/courses/crash-course-kubernetes-for-absolute-beginners/" rel="noopener noreferrer" target="_blank">https://learn.kodekloud.com/learn/courses/crash-course-kubernetes-for-absolute-beginners/</a></p>
<figure contenteditable="false" data-ke-align="alignCenter" data-ke-type="opengraph" data-og-description="" data-og-host="learn.kodekloud.com" data-og-image="" data-og-source-url="https://learn.kodekloud.com/learn/courses/crash-course-kubernetes-for-absolute-beginners/" data-og-title="KodeKloud" data-og-type="website" data-og-url="https://learn.kodekloud.com/learn/courses/crash-course-kubernetes-for-absolute-beginners/" id="og_1791811117616"><a data-source-url="https://learn.kodekloud.com/learn/courses/crash-course-kubernetes-for-absolute-beginners/" href="https://learn.kodekloud.com/learn/courses/crash-course-kubernetes-for-absolute-beginners/" rel="noopener" target="_blank">
<div class="og-image" style="background-image: url();"> </div>
<div class="og-text">
<p class="og-title" data-ke-size="size16">KodeKloud</p>
<p class="og-desc" data-ke-size="size16"> </p>
<p class="og-host" data-ke-size="size16">learn.kodekloud.com</p>
</div>
</a></figure>
<p data-ke-size="size16"><br/>1번 LAB</p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="800" data-origin-width="890"><span data-phocus="https://blog.kakaocdn.net/dna/NJLlw/dJMcaiytI18/AAAAAAAAAAAAAAAAAAAAADVzkRHyRDK7FIe998NUwmNv0Lnm7AmZIXdHqk3a01q8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=LxPn4QiPQOSh4AmN6ppnGFjuESI%3D" data-url="https://blog.kakaocdn.net/dna/NJLlw/dJMcaiytI18/AAAAAAAAAAAAAAAAAAAAADVzkRHyRDK7FIe998NUwmNv0Lnm7AmZIXdHqk3a01q8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=LxPn4QiPQOSh4AmN6ppnGFjuESI%3D"><img data-origin-height="800" data-origin-width="890" height="800" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/NJLlw/dJMcaiytI18/AAAAAAAAAAAAAAAAAAAAADVzkRHyRDK7FIe998NUwmNv0Lnm7AmZIXdHqk3a01q8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=LxPn4QiPQOSh4AmN6ppnGFjuESI%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FNJLlw%2FdJMcaiytI18%2FAAAAAAAAAAAAAAAAAAAAADVzkRHyRDK7FIe998NUwmNv0Lnm7AmZIXdHqk3a01q8%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DLxPn4QiPQOSh4AmN6ppnGFjuESI%253D" width="890"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">처음은 그냥 bubectl get nodes를 입력해서 nodes의 갯수를 확인하는 문제</p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="692" data-origin-width="847"><span data-phocus="https://blog.kakaocdn.net/dna/dDTwZr/dJMcah7qK8D/AAAAAAAAAAAAAAAAAAAAAANyx1txar_cAdr-PxGoLTXBBhPW0wGU1fqQC6yE4ziZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=s6y%2FlEyCoszAW6PCLtxJEdQ%2B6Yg%3D" data-url="https://blog.kakaocdn.net/dna/dDTwZr/dJMcah7qK8D/AAAAAAAAAAAAAAAAAAAAAANyx1txar_cAdr-PxGoLTXBBhPW0wGU1fqQC6yE4ziZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=s6y%2FlEyCoszAW6PCLtxJEdQ%2B6Yg%3D"><img data-origin-height="692" data-origin-width="847" height="692" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/dDTwZr/dJMcah7qK8D/AAAAAAAAAAAAAAAAAAAAAANyx1txar_cAdr-PxGoLTXBBhPW0wGU1fqQC6yE4ziZ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=s6y%2FlEyCoszAW6PCLtxJEdQ%2B6Yg%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdDTwZr%2FdJMcah7qK8D%2FAAAAAAAAAAAAAAAAAAAAAANyx1txar_cAdr-PxGoLTXBBhPW0wGU1fqQC6yE4ziZ%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Ds6y%252FlEyCoszAW6PCLtxJEdQ%252B6Yg%253D" width="847"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">두 번째는 버전 확인</p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="755" data-origin-width="877"><span data-phocus="https://blog.kakaocdn.net/dna/dASQ4W/dJMcagHsPUu/AAAAAAAAAAAAAAAAAAAAAKX1ySIWytgBfA_-cYktr3xJDPY2ONz8vZFYhgYXZJyL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=cb7%2FC2gkaKUTgdK0DVAEmatHGTc%3D" data-url="https://blog.kakaocdn.net/dna/dASQ4W/dJMcagHsPUu/AAAAAAAAAAAAAAAAAAAAAKX1ySIWytgBfA_-cYktr3xJDPY2ONz8vZFYhgYXZJyL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=cb7%2FC2gkaKUTgdK0DVAEmatHGTc%3D"><img data-origin-height="755" data-origin-width="877" height="755" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/dASQ4W/dJMcagHsPUu/AAAAAAAAAAAAAAAAAAAAAKX1ySIWytgBfA_-cYktr3xJDPY2ONz8vZFYhgYXZJyL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=cb7%2FC2gkaKUTgdK0DVAEmatHGTc%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdASQ4W%2FdJMcagHsPUu%2FAAAAAAAAAAAAAAAAAAAAAKX1ySIWytgBfA_-cYktr3xJDPY2ONz8vZFYhgYXZJyL%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dcb7%252FC2gkaKUTgdK0DVAEmatHGTc%253D" width="877"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">3번째 문제는, 알려준 명령어를 입력해서 찾으면 끝.</p>
<p data-ke-size="size16">Kubernetess Control Plane의 URL 주소를 찾으면 되기 때문에 오른쪽 터미널에 나온 주소를 선택하면 된다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="750" data-origin-width="882"><span data-phocus="https://blog.kakaocdn.net/dna/tYu5O/dJMcaa1oyyo/AAAAAAAAAAAAAAAAAAAAAK3yfdaqOPF8aM5m3zI2oLHlNBvHyyzrofziOd889MpR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=wwnH3DYP8%2BOaGm7uInpNUVSXQQM%3D" data-url="https://blog.kakaocdn.net/dna/tYu5O/dJMcaa1oyyo/AAAAAAAAAAAAAAAAAAAAAK3yfdaqOPF8aM5m3zI2oLHlNBvHyyzrofziOd889MpR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=wwnH3DYP8%2BOaGm7uInpNUVSXQQM%3D"><img data-origin-height="750" data-origin-width="882" height="750" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/tYu5O/dJMcaa1oyyo/AAAAAAAAAAAAAAAAAAAAAK3yfdaqOPF8aM5m3zI2oLHlNBvHyyzrofziOd889MpR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=wwnH3DYP8%2BOaGm7uInpNUVSXQQM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FtYu5O%2FdJMcaa1oyyo%2FAAAAAAAAAAAAAAAAAAAAAK3yfdaqOPF8aM5m3zI2oLHlNBvHyyzrofziOd889MpR%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DwwnH3DYP8%252BOaGm7uInpNUVSXQQM%253D" width="882"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16"><span>kubectl </span><span>run </span><span>nginx-pod </span><span>--image=nginx</span> <span>명령어로 </span><span>nginx </span><span>이미지를 </span><span>사용하는 </span><span>Pod를 </span><span>생성했다.</span><span> </span><span>kubectl </span><span>get </span><span>pods</span><span>로 </span><span>확인한 </span><span>결과, </span><span>READY </span><span>1/1</span><span>, </span><span>STATUS </span><span>Running</span><span>이므로 </span><span>Pod가 </span><span>정상 </span><span>실행 </span><span>중이다.</span></p>
<p data-ke-size="size16"> </p>
</div>
</div>
<p data-ke-size="size16"> </p>
<h2 data-ke-size="size26">Pods.</h2>
<p data-ke-size="size16">Pod는 애플리케이션의 단일 instance이며, 가장 작은 object이다. 부하를 분산하기 위해서 새로운 pod를 아예 새롭게만든다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">예시를 들어서 WEb Application 인스턴스 두 개가 실행되고 있을 때, mode의 용량이 부족해지면 어떻게 되나</p>
<p data-ke-size="size16">-&gt; 클러스터의 새로운 node에 추가로 pod로 배포. Cluister의 물리적 용량을 확장하기 위해서 새로운 node를 cluster에 추가하게 된다</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Scale up을 하려면 새로운 pod를 생성하면 된다. 애플리케이션을 scale 하기 위해서 기존 pod에 컨테이너를 추가하지 않는다. sacle down을 하기 위해서는 pod를 삭제하지 않는다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">pod는 보통 container와 일대일 관계이다. -&gt; 그러면 하나의 pod에 단 하나의 container만 두도록 제한??</p>
<p data-ke-size="size16">-&gt; 그건 또 아니다., 여러 개의 Container를 포함할 수 있다. 보통 같은 종류의 Container를 여러 두지 안흔다.</p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">Pod를 배포하는 방법은, Jubectl run 커맨드에 있다. 사실 이 커맨드는 pod를 생성해서 Docker Container를 배포하는 것.</p>
<p data-ke-size="size16">자동으로 Pod를 생성하고 NGINX Docker image의 인스턴스를 배포한다. -&gt; 그러면 image는 어디서 가져옴?. </p>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">image 파라미터를 사용해 image 이름을 지정해야 한다.</p>
<p data-ke-size="size16"> -&gt; NGINX image인 애플리케이션 image는 docker hub repository에서 다운로드됩니다. -&gt; Docker Hub는image들이 저장되어 있는 public respository이다.</p>
<p data-ke-size="size16"> </p>
<div data-ke-type="moreLess" data-text-less="닫기" data-text-more="더보기"><a class="btn-toggle-moreless">더보기</a>
<div class="moreless-content">
<p data-ke-size="size16">두 번째 Labs.</p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="520" data-origin-width="1103"><span data-phocus="https://blog.kakaocdn.net/dna/bgbzhf/dJMcagUTjAC/AAAAAAAAAAAAAAAAAAAAAGgyP6A81A_JigxzWx_hxO3ZkJyEiQDkn3pP_wJ3lh2N/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=na7iEsuvUpE%2Be7FlLF5pZzwxYxM%3D" data-url="https://blog.kakaocdn.net/dna/bgbzhf/dJMcagUTjAC/AAAAAAAAAAAAAAAAAAAAAGgyP6A81A_JigxzWx_hxO3ZkJyEiQDkn3pP_wJ3lh2N/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=na7iEsuvUpE%2Be7FlLF5pZzwxYxM%3D"><img data-origin-height="520" data-origin-width="1103" height="520" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bgbzhf/dJMcagUTjAC/AAAAAAAAAAAAAAAAAAAAAGgyP6A81A_JigxzWx_hxO3ZkJyEiQDkn3pP_wJ3lh2N/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=na7iEsuvUpE%2Be7FlLF5pZzwxYxM%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbgbzhf%2FdJMcagUTjAC%2FAAAAAAAAAAAAAAAAAAAAAGgyP6A81A_JigxzWx_hxO3ZkJyEiQDkn3pP_wJ3lh2N%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dna7iEsuvUpE%252Be7FlLF5pZzwxYxM%253D" width="1103"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">kubectl gets pods로 갯수 확인하기</p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="712" data-origin-width="1146"><span data-phocus="https://blog.kakaocdn.net/dna/Vyzjh/dJMcaikSAf9/AAAAAAAAAAAAAAAAAAAAAI_Bg-ZyJWMp9J0h4x9dHBzO_qMC15fbZ1caZRAd_Wbt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Op2ZVbIgM0VWITXHoDVW9vChQkA%3D" data-url="https://blog.kakaocdn.net/dna/Vyzjh/dJMcaikSAf9/AAAAAAAAAAAAAAAAAAAAAI_Bg-ZyJWMp9J0h4x9dHBzO_qMC15fbZ1caZRAd_Wbt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Op2ZVbIgM0VWITXHoDVW9vChQkA%3D"><img data-origin-height="712" data-origin-width="1146" height="712" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/Vyzjh/dJMcaikSAf9/AAAAAAAAAAAAAAAAAAAAAI_Bg-ZyJWMp9J0h4x9dHBzO_qMC15fbZ1caZRAd_Wbt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=Op2ZVbIgM0VWITXHoDVW9vChQkA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FVyzjh%2FdJMcaikSAf9%2FAAAAAAAAAAAAAAAAAAAAAI_Bg-ZyJWMp9J0h4x9dHBzO_qMC15fbZ1caZRAd_Wbt%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DOp2ZVbIgM0VWITXHoDVW9vChQkA%253D" width="1146"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">kubectl run nginx --image=nginx로, image pod 만들기</p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="709" data-origin-width="1056"><span data-phocus="https://blog.kakaocdn.net/dna/cywlpq/dJMb99OPTe7/AAAAAAAAAAAAAAAAAAAAADiebNU958MTCg5o0eF4jkRQNXwcVRVR_bg0OPumZO4L/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=l4pmKs8idpqZwnlQjvsqq%2BEWam8%3D" data-url="https://blog.kakaocdn.net/dna/cywlpq/dJMb99OPTe7/AAAAAAAAAAAAAAAAAAAAADiebNU958MTCg5o0eF4jkRQNXwcVRVR_bg0OPumZO4L/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=l4pmKs8idpqZwnlQjvsqq%2BEWam8%3D"><img data-origin-height="709" data-origin-width="1056" height="709" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/cywlpq/dJMb99OPTe7/AAAAAAAAAAAAAAAAAAAAADiebNU958MTCg5o0eF4jkRQNXwcVRVR_bg0OPumZO4L/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=l4pmKs8idpqZwnlQjvsqq%2BEWam8%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fcywlpq%2FdJMb99OPTe7%2FAAAAAAAAAAAAAAAAAAAAADiebNU958MTCg5o0eF4jkRQNXwcVRVR_bg0OPumZO4L%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dl4pmKs8idpqZwnlQjvsqq%252BEWam8%253D" width="1056"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">kubectl get pods로 갯수 확인하기</p>
<p data-ke-size="size16"> </p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="702" data-origin-width="1311"><span data-phocus="https://blog.kakaocdn.net/dna/GNBPx/dJMcafBFcCL/AAAAAAAAAAAAAAAAAAAAAHSHrqHMJk3aFMbBUVhWAvkhbQWD7HD9untExuUvZgxa/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=A81iibP6luhXi7wAakFR5gWNlIE%3D" data-url="https://blog.kakaocdn.net/dna/GNBPx/dJMcafBFcCL/AAAAAAAAAAAAAAAAAAAAAHSHrqHMJk3aFMbBUVhWAvkhbQWD7HD9untExuUvZgxa/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=A81iibP6luhXi7wAakFR5gWNlIE%3D"><img data-origin-height="702" data-origin-width="1311" height="702" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/GNBPx/dJMcafBFcCL/AAAAAAAAAAAAAAAAAAAAAHSHrqHMJk3aFMbBUVhWAvkhbQWD7HD9untExuUvZgxa/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=A81iibP6luhXi7wAakFR5gWNlIE%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FGNBPx%2FdJMcafBFcCL%2FAAAAAAAAAAAAAAAAAAAAAHSHrqHMJk3aFMbBUVhWAvkhbQWD7HD9untExuUvZgxa%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DA81iibP6luhXi7wAakFR5gWNlIE%253D" width="1311"/></span></figure>
<p data-ke-size="size16">kubectl get pods -o wide로 placed on되어 있는 위치 확인하기</p>
</div>
</div>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">YAML파일은 데이터를 표현하는데 사용되며, 설정 데이터를 의미한다. Key와 Value는 클론으로 구분하며. colone 뒤에 반드시 공백이 있어야한다.</p>
<p data-ke-size="size16">YAML파일로 Pod를 생성하는 방법...</p>
<p data-ke-size="size16"> </p>
<div data-ke-type="moreLess" data-text-less="닫기" data-text-more="더보기"><a class="btn-toggle-moreless">더보기</a>
<div class="moreless-content">
<p data-ke-size="size16">Lab3</p>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="551" data-origin-width="1186"><span data-phocus="https://blog.kakaocdn.net/dna/7IvZO/dJMcacdPkfq/AAAAAAAAAAAAAAAAAAAAAHNTQVJkxBUsqYQoTuvDTOAbSFd3s1iul04iuRM8CKk1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=NnOKgK4RrfvBjcvv%2BDBVuPzX6xA%3D" data-url="https://blog.kakaocdn.net/dna/7IvZO/dJMcacdPkfq/AAAAAAAAAAAAAAAAAAAAAHNTQVJkxBUsqYQoTuvDTOAbSFd3s1iul04iuRM8CKk1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=NnOKgK4RrfvBjcvv%2BDBVuPzX6xA%3D"><img data-origin-height="551" data-origin-width="1186" height="551" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/7IvZO/dJMcacdPkfq/AAAAAAAAAAAAAAAAAAAAAHNTQVJkxBUsqYQoTuvDTOAbSFd3s1iul04iuRM8CKk1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=NnOKgK4RrfvBjcvv%2BDBVuPzX6xA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F7IvZO%2FdJMcacdPkfq%2FAAAAAAAAAAAAAAAAAAAAAHNTQVJkxBUsqYQoTuvDTOAbSFd3s1iul04iuRM8CKk1%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DNnOKgK4RrfvBjcvv%252BDBVuPzX6xA%253D" width="1186"/></span></figure>
<p data-ke-size="size16"> </p>
<p data-ke-size="size16">그 이후로는 다 vim 열어서 간단하게 바꾸는 것..</p>
</div>
</div>
<p data-ke-size="size16"> </p>
<p><figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="876" data-origin-width="1561"><span data-phocus="https://blog.kakaocdn.net/dna/zMR6D/dJMcaiSLxU7/AAAAAAAAAAAAAAAAAAAAAOaxi97Ggnm0ncIAAu2Khm0xMNmvM5-t21v61_MXQh85/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=vgcGEmsw8q%2FQ0XuepNw3zEBUyxo%3D" data-url="https://blog.kakaocdn.net/dna/zMR6D/dJMcaiSLxU7/AAAAAAAAAAAAAAAAAAAAAOaxi97Ggnm0ncIAAu2Khm0xMNmvM5-t21v61_MXQh85/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=vgcGEmsw8q%2FQ0XuepNw3zEBUyxo%3D"><img data-origin-height="876" data-origin-width="1561" height="876" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/zMR6D/dJMcaiSLxU7/AAAAAAAAAAAAAAAAAAAAAOaxi97Ggnm0ncIAAu2Khm0xMNmvM5-t21v61_MXQh85/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=vgcGEmsw8q%2FQ0XuepNw3zEBUyxo%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FzMR6D%2FdJMcaiSLxU7%2FAAAAAAAAAAAAAAAAAAAAAOaxi97Ggnm0ncIAAu2Khm0xMNmvM5-t21v61_MXQh85%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DvgcGEmsw8q%252FQ0XuepNw3zEBUyxo%253D" width="1561"/></span></figure>
<figure class="imageblock alignCenter" data-ke-mobilestyle="widthOrigin" data-origin-height="859" data-origin-width="1604"><span data-phocus="https://blog.kakaocdn.net/dna/bfqG6A/dJMcaaf7wJm/AAAAAAAAAAAAAAAAAAAAAAGBc-RozmIxpcCmnfXeQ2R-O8aO_f0fYiwnQf9i-jcj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rIE%2BfHrKrl1wtMnmf33k6jmPpDA%3D" data-url="https://blog.kakaocdn.net/dna/bfqG6A/dJMcaaf7wJm/AAAAAAAAAAAAAAAAAAAAAAGBc-RozmIxpcCmnfXeQ2R-O8aO_f0fYiwnQf9i-jcj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rIE%2BfHrKrl1wtMnmf33k6jmPpDA%3D"><img data-origin-height="859" data-origin-width="1604" height="859" loading="lazy" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" src="https://blog.kakaocdn.net/dna/bfqG6A/dJMcaaf7wJm/AAAAAAAAAAAAAAAAAAAAAAGBc-RozmIxpcCmnfXeQ2R-O8aO_f0fYiwnQf9i-jcj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1793458799&amp;allow_ip=&amp;allow_referer=&amp;signature=rIE%2BfHrKrl1wtMnmf33k6jmPpDA%3D" srcset="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbfqG6A%2FdJMcaaf7wJm%2FAAAAAAAAAAAAAAAAAAAAAAGBc-RozmIxpcCmnfXeQ2R-O8aO_f0fYiwnQf9i-jcj%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DrIE%252BfHrKrl1wtMnmf33k6jmPpDA%253D" width="1604"/></span></figure>
</p>
<p data-ke-size="size16"> </p>
