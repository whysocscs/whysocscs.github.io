---
layout: post
title: "Critical Gemini CLI Flaw Enabled Host Code Execution, Supply Chain Attacks"
date: 2026-05-07 02:13:29
desc: "Critical Gemini CLI Flaw Enabled Host Code Execution, Supply Chain Attacks"
keywords: "Critical Gemini CLI Flaw Enabled Host Code Execution, Supply Chain Attacks,Development,프론티어,보안,Gemini CLI,Google,RCE"
categories: [Development]
tags: ["프론티어", "보안", "Gemini CLI", "Google", "RCE"]
icon: fa-terminal
---
> Source: [https://sanghole.tistory.com/37](https://sanghole.tistory.com/37)

# Critical Gemini CLI Flaw Enabled Host Code Execution, Supply Chain Attacks

<https://www.securityweek.com/critical-gemini-cli-flaw-enabled-host-code-execution-supply-chain-attacks/>

[Critical Gemini CLI Flaw Enabled Host Code Execution, Supply Chain Attacks

A critical remote code execution and supply chain vulnerability was recently discovered by researchers in Gemini CLI.

www.securityweek.com](https://www.securityweek.com/critical-gemini-cli-flaw-enabled-host-code-execution-supply-chain-attacks/)

이번에는 codex가 아니라 Gemini CLI 버전.

Gemini CLI가 CI/CD같은 자동 실행 환경에서 작업 폴더를 무한 신뢰하면서 PR이나 repo안에 심우던 악성 .gemini 설정이 로드 --> 샌드박스 켜지기 -> host에서 명령어가 실행될 수 있었던 취약점이다. 심지어 이걸로 RCE도 가능함.

더보기

RCE

공격자가 네트워크를 통해 원격에서 대상 시스템(서버, PC 등)의 제어권을 탈취하여 악성 코드를 실행하는 치명적인 보안 취약점입니다. 입력값 검증 미흡, 안전하지 않은 역직렬화, 버퍼 오버플로우 등이 원인이며, 시스템 제어, 데이터 유출, 랜섬웨어 감염을 유발할 수 있습니다.

근데 뭐 설명이 거의 똑같아서 시나리오를 기반으로 설명을 해본다고 한다면..

다시금 나타난 룰루랄라 개발팀..

GitHub Actions를 활용 -> Github CLI를 계속 쓰면서 PR리뷰, 이슈 분석, 코드 설명, 자동 수정 같은 걸 딸-깍 중

공격자가 외부 contributor처럼 PR을 날리는데, 해당 PR에는 Gemini CLI가 읽을 수 있는 악성 .gemini/ 설정 파일이나 환경 설정이 같이 들어 있다..

이제 여기서 문제!

Gemini CLi가 CI/headless 환경에서 현재 workspace는 믿을 만하네~~ 라고 생각하는 것.

그래서 agent 설정으로 그걸 받아들이고 해당 host runner에서 명령 실행까지 한다는 것 이다.

그래서 host runner에서 명령 실행까지 이어질 수 있다. ->

https://novee.security/blog/google-gemini-cli-rce-vulnerability-cvss-10-critical-security-advisory/

여기서 보면 prompt injection도 아니고 모델 판단도 아니라, AI가 추론하기 전에 발생하는 infrastructure-level execution 문제라라고 한다

전체적인 흐름->

공격자 PR 제출\
→ PR 안에 악성 .gemini 설정 포함\
→ GitHub Actions에서 Gemini CLI 자동 실행\
→ Gemini CLI가 workspace를 자동 신뢰\
→ 악성 설정 로드\
→ sandbox 초기화 전 host에서 명령 실행\
→ CI secret, token, source code 접근 가능\
→ supply chain attack으로 확장 가능

그래서 패치는??

Google은 headless mode, 즉 모든 권한을 주는 모드에서 더 이상 workspace를 자동 신뢰하지 않도록 바꿨고 설정 파일을 읽기 전에 명시적인 trust 결정이 필요하도록 수정했다.

공식 패치 버전은 -> advisory 기준 @google/gemini-cli 0.39.1, 0.40.0-preview.3, run-gemini-cli 0.1.22

흠. 까보니까 별거 없네

그냥 진짜 AI 딸-깍을 해놓으니까 공격자들이 이것 저것 하기 시작했다..
