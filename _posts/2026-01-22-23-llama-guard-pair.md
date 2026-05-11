---
layout: post
title: "Llama Guard, PAIR"
date: 2026-01-22 16:07:00
desc: "Llama Guard, PAIR"
keywords: "Llama Guard, PAIR,Paper-Conference,AI 보안,security for ai"
categories: [Paper-Conference]
tags: ["AI 보안", "security for ai"]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/23](https://sanghole.tistory.com/23)

Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations\
\
Jailbreaking Black Box Large Language Models in Twenty Queries\
위 2가지의 논문을 활용하여서 대학원에서 세미나? 랩미팅?을 진행하였다. 일단 세미나라고 하셨다.\
\

논문을 읽은 기간은 대략 1주일, 발표 준비 기간까지 포함하면 약 2주일 정도로 진행했다. 혼자선 하는건 아니고 팀끼리 진행했으며 내가 주로 읽은 논문은 Llama Guard, 블루쪽의 논문을 진행하였다. 블루쪽 논문은 내가 노션에 정리한 것을 Tistory에 그대로 올린 것이 있어서 내용은 스킵하겠다

PAIR도 논문을 1~2번 읽어보았는데 멀티턴을 고려해 AI에게 프롬프트 인젝션 기반 공격을 자동화해서 LLM이 공격 프롬프트를 생성해주고, 실패하면 다시 개선해서 또 공격을 시도해주는 알고리즘으로 돌아간다.

PAIR 논문에 더해서, PAIR와 관련한 코드 분석도 진행하였다.

<https://github.com/patrickrchao/JailbreakingLLMs>

[GitHub - patrickrchao/JailbreakingLLMs

Contribute to patrickrchao/JailbreakingLLMs development by creating an account on GitHub.

github.com](https://github.com/patrickrchao/JailbreakingLLMs)

코드 분석을 진행했을 때는 상세하게 분석을 진행한 것은 아니고 PAIR에서 알고리즘이 어떻게 구현이 되어있는지에 대해서를 상세하게 분석했다.

두 논문들을 많이 봤지만 비중은 블루쪽 논문이라 블루 논문에 대한 질문을 많이 들었고, 대답했다. 그리고 PAIR 논문에 관해서도 하나의 질문을 들었다. 대학원 랩미팅은 처음이었지만 그렇게 엄청 무거운 분위기도 아니고, 가벼운 분위기도 아니였다.

딱 긴장해서 집중해서 대답만 하는 느낌?. 긴장을 조금 많이 해서 버벅이면서 발표를 할 때도 많았지만 재밌는 경험이었다.

---

이 글을 쓰게 된 이유는 랩미팅 후에 논문을 어떻게 봐야할지에 대해서 생각이 나서..

일단 나는 논문을 마치 교과서처럼 그냥 믿고 따르면서 읽었는데 굳이 그럴 필요는 없다는 거. 그리고 비판적으로 봐야한다는 것.

PAIR 논문에서도 CPU, GPU 사용량에 대해서 진짜 저렇게 한 거 맞나? 저거 실험을 어떻게 했길래 저런 표가 나왔지? 이런 생각으로 논문을 봐야했으며 약간 해당 지표를 사용했을 때, 자기 논문에 유리한 지표를 뽑기 위해서 그런 행동을 하지는 않았는지.

지표를 뽑을 때 사용하는 도구나 방법을 조금 더 분석을 진행을 해야겠다.

등등 너무 교과서처럼만 논문을 보는 것이 아니라 조금 더 비판적으로 논문을 볼 것 같다. <- 이런 생각을 하는 이유는 질문이 보통 왜 저런 지표를 사용했냐? 약간 이런 식의 질문이였ㄸㅏ

대표 사진은 Gemini에게 맡김..
