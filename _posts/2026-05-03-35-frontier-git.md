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

## git 명령어 모음

원래는 그림 하나 하나 옮겨가면서 정리를 하려고 했는데 그건 너무 양이 많아질 것 같아서

정리 정도만

```
git commit
```

"현재 브랜치" 위에 새로운 커밋을 만든다.

git commit -m "커밋 메시지"

=> 커밋 메시지를 바로 적어서 커밋.

git commit -amend

=> 가장 최근 커밋을 수정한다. 커밋 메시지나 커밋 내용을 다시 고칠 때 사용

```
git branch [브랜치명]
```

현재 커밋 위치에 새 브랜치를 만든다.

git branch -f [브랜치명][커밋/브런치]

-> 특정 브랜치가 가리키는 위치를 강제로 옮김.

```
git checkout [브랜치명]
```

해당 브랜치로 이동한다.

여기서 문제는 여러 가지 checkout의 활용본이 나오는데..

git checkout HEAD^

현재 커밋의 부모 커밋으로 이동

git checkout HEAD^^

현재 커밋에서 부모의 부모 커밋으로 이동.

git cehckout [브랜치명]~[n]

해당 브랜치 기준으로 n칸 위의 조상 커밋으로 이동한다.

  EX) git checkout main~3 -> main 브랜치가 가리키는 커밋에서 3칸 위로 이동하기.

```
git merge [브랜치명]
```

현재 브랜치에 다른 브랜치의 내용을 합친다.

[https://git-scm.com/book/ko/v2/Git-브랜치-브랜치와-Merge-의-기초](https://git-scm.com/book/ko/v2/Git-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EB%B8%8C%EB%9E%9C%EC%B9%98%EC%99%80-Merge-%EC%9D%98-%EA%B8%B0%EC%B4%88)

실제 개발과정에서 겪을 만한 예제를 하나 살펴보자. 브랜치와 Merge는 보통 이런 식으로 진행한다.

1. 웹사이트가 있고 뭔가 작업을 진행하고 있다.
2. 새로운 이슈를 처리할 새 Branch를 하나 생성한다.
3. 새로 만든 Branch에서 작업을 진행한다.

이때 중요한 문제가 생겨서 그것을 해결하는 Hotfix를 먼저 만들어야 한다. 그러면 아래와 같이 할 수 있다.

1. 새로운 이슈를 처리하기 이전의 운영(Production) 브랜치로 이동한다.
2. Hotfix 브랜치를 새로 하나 생성한다.
3. 수정한 Hotfix 테스트를 마치고 운영 브랜치로 Merge 한다.
4. 다시 작업하던 브랜치로 옮겨가서 하던 일 진행한다.

git merge에 대해서 검색하니까 실제로 git에서 올린 문서가 있어서 확인해보았다.

조금 더 자세하게 해보자면..

git merge --continue

-> 충돌을 해결한 뒤 merge를 계속 진행

git merge --abort

->merge 충돌 났을 때 취소하기

git merge --no-ff bugFix

-> merge commit 남기면서 합치기

EX) git branch bugWork main~^2~

1. main에서 한 칸 위로 이동

2. 그 커밋의 두 번째 부모로 이동

3. 다시 한 칸 위로 이동한 위치에 bugWork 브랜치를 만들기.

```
git rebase[브랜치명]
```

현재 브랜치의 베이스를 해당 브랜치의 최신 커밋 뒤로 옮기는 작업.

git rebase [기준브랜치][옮길브랜치]

옮길브랜치를 기준브랜치 위로 rebase한다.

<https://brunch.co.kr/@anonymdevoo/7>

정확한 merge와 rebase의 차이점을 알아보기 위해서 더 찾아보았다.

좋은 예시를 들어주신 것 같아서..

처음은 merge이고 2번째는 rebase이다.

위 그림은 merge 방식이라 bts-image 브랜치의 변경사항을 master에 합치면서 새로운 merge commit(B123456) 이 생긴다.

아래 그림은 rebase 방식이라 bts-image의 시작점을 master 최신 커밋 뒤로 옮겨서, 커밋 히스토리가 한 줄처럼 깔끔하게 이어진다.

merge방식은 기록 보존에는 좋지만, 히스토리가 복잡해질 수도 있다.

rebase는 히스토리는 깔끔하지만 이미 공유한 커밋에는 조심해서 써야한다.

보통 히스토리를 남기기 좋아하는 개발자(?) 특성상 merge 방식을 쓴다고 알고있다.

추가적인 rebase 활용법

```
git rebase -i [기준커밋]
```

기준 커밋 이후의 커밋들을 편집할 수 있따.

EX)

git rebase -i HEAD~3

->최근 3개 커밋을 대상으로 rebase.

git rebase -i main

-> main 이후에 쌓인 현재 브랜치의 커밋들을 편집한다.

```
git revert [커밋]
```

특정 커밋의 변경분을 되돌리는 새 커밋을 만든다.

```
git cherry-pick [커밋]
```

특정 커밋 하나만 현재 브랜치 위로 복사해서 가져온다.

EX)

git cherry-pick C2

-> C2 커밋의 변경사항만 현재 브랜치에 가져온다.

git cherry-pick C2 C4 C7

-> 여러 커밋을 순서대로 현재 브랜치에 가져온다.

```
git tag [태그명] [커밋]
```

특정 커밋에 태그를 붙일 수 있다.

+ 같이 쓰면 git tag v1 C2 /  git checkout v1

이런 식?

```
git describe [커밋/브랜치/태그]
```

EX)

git describe HEAD

-> 현재 위치를 태그 기준으로 설정.

git descrive main

-> main 브랜치가 가리키는 커밋을 태그 기준으로 설명

~~내 기준에서는 어려워서 답을 조금..봤다~~

```
git clone
```

원격 저장소 복제

```
git fetch
```

원격 저장소의 변경사항을 가져오지만! 내 현재 브랜치에는 합치지 아니한다..

```
git pull --rebase
```

원격 변경사항을 가져온 뒤, 내 커밋을 그 위에 rebase한다.

```
git push
```

내 로컬 커밋을 원격 저장소에 올린다.

문제 3개 정도만 풀고 내는 걸로

왼쪽의 상태를 오른쪽 처럼 바꾸면 되는 것이다.

```
git push origin main
```

일단 로컬의main 브랜치가 가리키는 커밋을 원격 저장소 origin의 main 브랜치로

```
git push origin foo
```

 그 후에는 로컬의 foo 브랜치가 가리키는 커밋을 원격 저장소 origin의 foo 브랜치로

그럼 해결!!

일단 먼저

```
git rebase -i HEAD~2 --solution-ordering C3,C2
```

최근 2개 커밋 C2, C3을 대상으로 rebase를 실행하여 커밋 순서를 C3 → C2로 바꾼다.\
그래서 amend할 대상인 C2를 가장 위, 즉 HEAD 위치로 올린다.

그 후 git commit --amend를 통해 현재 HEAD가 가르키는 C2'를 C2''가 되도록 추가적인 커밋을 해준다.

C2와 같은 커밋이 아니라 수정된 커밋인 C2''를 goal에서 원했기 때문...

```
git rebase -i HEAD~2 --solution-ordering C2'',C3'
```

다시 최근 2개 커밋을 대상으로 rebase를 실행하여서 커밋 순서를 C2'' → C3'로 다시 정리한다.\
수정된 newImage 커밋 위에 caption 커밋이 오도록 만든다.

이제 마지막!!

main 브랜치를 caption 브랜치 위로 rebase한다. 현재 구조에서는 fast-forward처럼 main이 caption 위치로 이동한다.\
결과적으로 main과 caption이 같은 커밋을 가리키게 된다.
