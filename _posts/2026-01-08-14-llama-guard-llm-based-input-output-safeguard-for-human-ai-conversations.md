---
layout: post
title: "Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations"
date: 2026-01-08 16:31:00
desc: "Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations"
keywords: "Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations,Paper-Conference,AI 보안,security for ai"
categories: [Paper-Conference]
tags: ["AI 보안", "security for ai"]
icon: fa-book
---
> Source: [https://sanghole.tistory.com/14](https://sanghole.tistory.com/14)

# 개인적인 요약

기존에 있는 정책 보안 대한 API들은 인간과 LLM이 생성해주는 프롬프트와 대답 쌍을 구별하지 못하고, API가 블랙 박스로 활용되어 사용자들이 직접 정책을 추가할 수 없었다. 그래서 LLM에 특화된 Llama Guard라는 LLM을 생성하였다.

Llama Guard는 아래 4가지의 지침을 활용하여서 safe Guard 목적을 달성한다.

> 1. safe/unsafe에 대한 지침 세트를 입력으로 받는다.
> 2. 사용자 메시지와 에이전트 메시지를 분류한다.
> 3. 사용자/에이전트의 메시지를 차쳬로 대화에 포함한다.
> 4. safe/unsafe를 출력하며 unsafe면 위반된 분류 체계의 범주들이 나열된다.

각기 다른 정책에 대한 표준 점수가 없으니, 본 논문은 3가지의 방법을 활용하였다.

> 1.대부분의 API는 카테고리별 확률 점수를 생성하기에, 본 논문도 카테고리의 예측 점수를 확인한다.\
> 2.다중 클래스 분류 설정에서 메트릭을 얻기 위해, 카테고리에서 하나를 제외하고 나머지는 다 음성으로 간주한다.\
> 3.위의 방법과 비슷하지만, benign을 제외하고는 drop하고, benign은 음성으로 처리한다.

사용한 Benchmarks는 2개로 ToxicChat과 OpenAI Moderation Evaluation Dateset이다.\
사용한 API는 4가지로

OpenAI Moderation API(11가지 콘턴체 안전 범주를 위반하는지 판단),\
Perspective API( 온라인 플랫픔에서 유해&공격적인 콘텐츠를 제거하도록 설계),\
Azure AI Content Safety API(다중 레이블 분류기),\
GPT-4

점수는 AUPRC점수를 주로 확인하였다. 대체로 Llama Guard가 준수한 성능을 뽑았으며, 해당 모델이 학습한 dataset을 활용해도 점수차는 0.09라는 점수차로 거의 준수한 성능을 내었다.

기존 Llama 2 - 7b model도 ToxicChat이라는 데이터셋을 활용하면 좋은 성능이 나왔지만, Llama Guard는 ToxicChat을 20%만 활용하여서 Fine-tunning을 시도해도 basemodel이 100%를 학습했을 때의 성능이 나왔다.

한계점으로는

1. 기본 지식은 훈련 데이터에 의해 제한되었으며, 훈련 데이터를 넘어서는 지식과 관련될 때는 잘못된 판단을 내릴 수 있다.
2. 대부분의 데이터들이 영어이기 때문에 다른 언어에서는 성능 비교를 못해봤다.
3. Fine-tuning 때문에 비윤리적이거나, 안전하지 않다고 간주될 수 있는 결과를 생성 가능하고 프롬프트 injection에 취약할 수 있다.

# 추후 연구 동향

### Llama-Guard의 현재 연항

현재 github에는 Llama-guard를 출시 후, 버전이 3개가 더 나왔으며 Prompt-Guard도 나왔다.

Llama Guard 3는 Llama 3.1 아키텍처를 기반으로 성능과 효율성의 균형을 맞추는데 주력한다. 1B 모델의 도입으로 경량화를 시도하였다.

Llama Guard 3 Vision도 출시하였는데 이미지 내의 유해성을 판단하는 능력을 갖춘 모델이다. (깊게는 알아보지 못했다)

2025, 4월에 공개된 Llama Guard 4는 12B 파라미터 규모로 Llama 4 Scout 아키텍처에서 파생되었다. MoE 구조를 안정성 분류라는 특수 목적에 맞춰 Dense 아키텍처로 Pruning을 시도하였다.

### 한국에서는 이런 연구가 없나?

1. Samsung.IBM의 Granite-3.3-2B-Instruct 모델을 기반으로 한다.
   1. 한국어 안전성 밴치마크에서 Llama Guard 4나 Quen3Guard보다 F1 score 0.90을 기록하며 한국어 특화 guard를 입증하였다.
   2. SGuard-v1: Safety Guardrail for Large Language Models
2. 카카오카카오 자체 LLM인 Kanana를 기반으로 하여 한국어의 언어적 특성에 최적화.
   1. <https://huggingface.co/collections/kakaocorp/kanana-safeguard>
   2. Kanana Safeguard.

# 논문 파트별 요약

## abstarct

Llama Guard는 LLM 기반 입력- 출력 보호 모델이다.

언어 모델로서 다중 클래스 분류를 수행하고, 이진 결정 점수를 생성한다. 제로샷 또는 퓨샷 프롬프팅을 용이하게 하는 등 모델의 기능을 향상시켰다.

## 1. Introduction.

1. 지난 몇 년간 AI 에이전트의 기능에 도약이 있었다.
2. 생성형 AI 기반 제품이 모델 자체의 모든 입력과 출력을 완화하는 보호 장치를 권장했다.
3. 원래 있던 기능들을 사용하려고 했으나, 입/출력 장치로 적용될 때 부족함이 있다.
   1. 문제점1 : 사용자가 제기하는 안전 위험과 AI 에이전트가 제기하는 안전 위험을 구별하는 도구 X
      - 문제인 이유: 사용자가 학술적 호기심으로 물어보는 정보와 도움을 차단할 수 있다.
      - 사용자의 프롬프트와, 에이전트의 대답을 구별하지 못 하는 것이 문제이다.
   2. 문제점 2: 각 도구는 고정된 taxonomies만 시행하므로,새로운 정책에 맞게 조정이 불가능함.
   3. 문제점 3: 각 도구는 API 접근만 제공한다. 파인튜닝을 통해 특정 사례에 맞게 설정하는 것은 불가능.
   4. 기존 도구는 작은 크기의 기존 트랜스포머 모델을 사용한다.
4. 본 연구의 기여
   1. 에이전트와의 상호 작용과 관련된 안전 위험 분류 체계 소개
   2. Llama Guard를 소개한다.모델 입력을 사전에 정의할 수 있다.
   3. 적용 가능한 분류 체계를 입력으로 포함, 분류를 위해 지시 작업을 사용한다.
   4. 인간 프롬프트와 AI 모델을 분류하기 위해 분리시킨다.
   5. 모델 가중치를 공개적으로 릴리스하여 유로 API에 의존하지 않고 모델을 자유롭게 사용하고, 또한 Llma Guard를추가적으로 실험, 파인튜닝

## 2. Safety Risk Taxonomy

1. A taxonomy of risks that are of interest : 관심 대상이 되는 위험에 대한 분류 체계
2. Risk Guidelines : 분류 체계의 각 위험 범주에 대해 장려되는 출력 & 금지되는 출력 사이의 경계선을 결정해주는 지침.

위 2가지의 조건을 만족하는 classifiers에 의존한다.

### 2-1. 안전 위험분류 체계.

고려되는 위험 범주를 기반으로 샘플 분류 체계를 만들었다.

1. 폭력 및 혐오
2. 성적 컨텐츠
3. 총기 및 불법 무기
4. 규제 또는 통제 물질
5. 자살 및 자해
6. 범죄 계획

## 3. Llama Guard 구축

### 3-1. Instruction-following Tasks

Instruction following을 활용한 zero-shot perfomer. 사용자 지시문 뒤에 목표 응답이 이어지는 시퀸스에 대해 언어 모델링 목적함수를 적용. 입-출력 세이프가딩 과제를 위해 4가지 핵심 구성 요소 식별

1. A set of Guideline (문제점 2, 3에 대한 해결책)→ 파인튜닝 없이도 새로운 정책을 적용한 제로샷, 퓨샷 Llama Guard 프롬프트에서도 성공.
2. safe/unsafe에 대한 지침 세트를 입력으로 받는다. 이 세트로 파인튜닝을 시도.
3. The Type of Classification. (문제점 1에 대한 해결책)
4. 사용자 메시지와 에이전트 메시지를 분류해야하는지 여부를 나타냄.
5. The conversation.
6. 사용자와 에이전트가 차례로 참여하는 대화를 포함.
7. The output format이진 분류와 다중 레이블 분류를 모두 지원하며, 분류기의 점수는 첫 번째 토큰의 확률값으로부터 확인할 수 있다.
8. safe와 Unsafe를 출력. 만약 Unsafe면 위반된 분류 체계의 범주들이 나열.

### 3-2. Zero-shot and few-shot promting

1. Zeor-shot 프롬프팅은 추론 시 대상 도메인의 카테고리 이름 + 카테고리 설명을 프롬프트에 사용하는 것을 포함한다.
2. Few-shot 프롬프팅은 Zero-shot과 유사하지만 추가로 프롬프트애 각 카테고리에 대한 2~4개의 예제를 포함한다. 이러한 예제는 학습하지 않고 시도되어 진다.

### 3.3. Data Collection. (데이터 만들기)

1. 무해성에 대한 인간 선호도 데이터셋 활용
2. Anthropic(Ganguli et al., 2022)에서 공개한 무해성에 대한 인간 선호도 데이터셋을 활용하였다.
3. 단일 턴 프롬프트 추출
4. 해당 데이터셋에서 각 샘플의 첫 번째 인간 프롬프트만을 선택하고 이에 대응되는 어시스턴트의 응답과 이후 모든 대화 턴을 제거하여 초기 단일 턴 프롬프트 데이터셋을 구성하였다.
5. 응답 생성
6. 내부 Llama 체크포인트 중 하나를 사용하여 추출된 각 프롬프트에 대해 요청을 수행하는 협력적 응답과 정책에 따라 요청을 거부하는 거부응답이 혼합된 결과를 생성하였다.
7. 전문 레드팀을 통한 주석
   - Prompt-category
   - Response-category
   - Prompt-label (safe 또는 unsafe)
   - Response-label (safe 또는 unsafe)
   - 주석 과정에서 입력 또는 출력 형식이 부적절한 예제는 제거하는 데이터 정제 과정을 함께 수행하였다.
8. 생성된 프롬프트–응답 쌍에 대해 2장에서 정의한 분류 체계를 기준으로 내부 전문 레드팀이 주석을 수행하였다. 각 샘플은 다음 네 가지 레이블로 주석되었다.
9. 학습 및 평가용 데이터 분할
10. 최종 데이터셋을 무작위로 분할하여, 전체 데이터의 75%를 파인튜닝용으로, 나머지 25%를 평가용으로 사용하였다.

### 3.4 Model & Training Details.

모델 학습 방법

- Llama2-7b 모델 활용. 배포 비용을 낮춘 가장 작은 모델
- 8개의 A100 80GB GPU, 배치 크기 2, 시퀸스 길이 4096,
- model parallelism of 1, 학습률 2 \* 10^(-6)을 활용.
- 500스텝 동안 학습, 학습 데이터셋에 대한 1 epoch에 해당한다.

데이터 증강 방법으로는 지정한 카테고리 안에서만 안정성 평가를 진행해야기 때문에, 2가지 증강 기법을 사용한다.

1. 위반되지 않은 무작위 카테고리에 대해서 랜덤하게 drop한다.
2. 위반된 모든 카테고리를 삭제하고, 모두 safe로 변경한다.

## 4. Experiments

- 표준화된 정책이 없어서 서로 다른 모델이 각자의 정책을 학습한 문제점이 있다.
- 데이터셋 자체도 모델이 정의한 정책에 맞는 데이터셋으로 학습했기 때문에 모델 비교에도 어려움이 있다.

위의 2가지 문제점을 보완하기 위해 2가지 방법으로 평가한다.

1. 자체 데이터셋에서의 In-domain performance을 절대 성능으로 측정.
2. 제로샷, 퓨샷 프롬프팅을 활용해서 다른 taxonomies에 대한 적응성 측정.

### 4.1 Evaluation Methodology in On- and Off-policy Settings.

On policy: 같은 정책(내부 테스트셋)

Off policy: 외부 데이터셋과 같은 다른 정책

- 서로 다른 정책을 가진 여러 데이터셋을 가진 다양한 방법을 평가 하는 데 관심이 있으므로, 각기 다른 설정에서 평가할 방법을 찾아야 한다.

먼저 markov et al. (2023)은 가능한 분류 체계를 정렬하려고 시도 하였지만 부분적인 정렬만 가능했다.

범주에 대한 매핑 실패 & 불분명한 매핑으로 주관성을 유발할 수 있으며 완벽하게 정렬해도 기준이 다를 수 있다.

그래서 본 논문에서는 3가지의 기법을 활용한다.

1. Overall binary classification for APIs that provide per-category output.$$\
   \hat{y}*i = \max*{c \in {c\_1, c\_2, \ldots, c\_n}} \left(\hat{y}\_{c,i}\right),\
   $$
   - Ŷᵢ 는 i번째예시에 대한 예측 점수
   - C1, c2.. 는 클래스
   - ŷ\_{c,i}는 i번째 예시에 대한 C1, C2.. 에 대한 양성 카테고리의 예측 점수.ŷ\_{c,i}는 카테고리별로 어떤 점수가 있고, 그 중에서 max값을 뽑아서 해당 카테고리를 알려주는 점수. 그래서 max를 사용한다
   - 여기서 Ŷᵢ 는 카테고리에 상관없이 unsafe, safe에 대한 점수
2. 대부분의 API는 카테고리별 확률 점수를 생성한다. 그래서 본 논문은 classifier에서 나온 점수를 기반으로 이진 분류의 확률을 다음과 같이 계산한다.
3. Per-category binary classification via 1-vs-all→ 해당 이유는 모델 입력을 동적으로 변경하여 분류 작업을 맞춤 설정할 수 있어서
   1. 카테고리 $c\_k$ 에 대해서 예측 작업 $t\_k$를 실행한다.
      1. 작업 $t\_k$에 대해 $c\_k$만 양성으로 간주한다. 나머지는 다 음성으로 간주
      2. 작업 $t\_k$에 대한 분류기는 프롬프트를 통해 샘플이 $c\_k$를 위반하는 경우에만 안전하지 않다고 예측한다.
      3. 작업 $t\_k$에 대한 이진 분류 점수는 $c\_k$의 점수로 사용된다.
4. 해당 방법은 다중 클래스 분류 설정에서 카테고리별 메트릭을 얻기 위한 접근 방식. on and off-policy settings에 대해서 이 접근 방식을 사용한다.
5. Per-category binary classification via 1-vs-benign.위 방법과 유사하지만 $c\_j\ne k$ 에 대해서, 나머지를 다 음성 처리를 하는 것이 아닌 그냥 고려 대상에서 제외한다. 즉, benign가 라벨인 친구만 음성으로 두고 나머지 라벨은 다 버린다.
6. 해당 방법은 어려운 음성 샘플들을 잠재적으로 제거할 수 있다. off-policy로 평가될 때 사용하는 모든 기준선 Api에 대해 이 접근 방식을 따른다.

- 잘 이해를 하지 못해서 드는 예시.2번 방법긍정: 폭력(C1)인 샘플, 부정: 안전한 문장, C2, C3 .3번 방법그러면 이 문장은 폭력인가, 아니면 안전한 문장인가만 판단한다. 이러면 비교 대상을 안전한 것만으로 제한을 하는 것 이니까 다른 C2, C3의 간섭을 받지 않기 때문에 더 좋은 결과를 뽑을 수 있다고 논문에서 명시했던 것 이다.
- 긍정: 폭력(C1) / 부정: 안전한 문장 /. 제외: C2, C3
- 즉, C1만 맞다. 나머지 전부는 아니다. 라고 판단한다.
- 이 문장은 폭력인가, 아니면 폭력이 아닌가?.
- C1, C2, C3가 각각 폭력, 혐오, 성적 콘텐츠일 때

### 4.2 Public Benchmarks.

1. ToxicChatBased Label은 Zampieri et al. (2019)의 바람직하지 않은 콘텐츠에 대한 정의를 기반으로 한다.
2. 10k개의 사용자-AI간의 샘플로 구성된 밴치마크이다
3. OpenAI Moderation Evaluation Dataset.
4. 1680개의 프롬프트 예시를 포함한다. 라벨은 프롬프트가 위험한지 아닌지에 대한 이진 flag이다.

### 4.3 Baselines & Evaluation Metrics.

- 4.3.1 Probalilty Score-Based Baselines.
  - OpenAI Moderation API.
  - 11가지의 콘텐츠 안전 범주를 위반하는지 여부를 평가하기 위해 미세 조정된 GPT 기반의 다중 레이블 분류기이다. 11가지의 범주에 대한 확률 점수, 범주별 이진 레이블, 전반적인 이진 레이블을 반환한다.
  - Perspective API머신러닝 모델을 사용하여 주어진 콘텐츠를 분석 & 유해하다고 인식될 가능성을 나타내는 확률 점수를 공개한다.
  - 온라인 플랫폼 및 유해하고 공격적인 콘텐츠를 제거하도록 설계.
- 4.3.2 Other Baselines.
  - Azure AI Content Safety API
  - 다중 레이블 분류기로 4가지 안전 범주 중 하나를 식별한다, 0~6점(6점이 가장 심각한 위반)
  - GPT-4
  - 제로샷 프롬프팅을 활용해 검열을 시도할 수 있다.
- 4.3.3 AUPRC를 평가 지표로 활용한다.

### 4.4 Overall Results.

다양한 벤치마크에서 Llama Guard와 확률 점수 기반 베이스라인 API간의 비교를 포함하여 나온 점수를 보여준다.

1. 자체 테스트 세트에서의 높은 잠재력을 보여준다
2. 별도의 훈련 없이 타사의 테스트셋에서도 준수한 성능을 보여준다.

프롬프트/대답에 대한 것. 데이터셋 내 각 카테고리별 성능 분석표.

### 4.5 Studying the Adaptability of the Model

- 4.5.1 Adaptability via Prompting.OpenAI 테스트 세트에 대한 설명. Few-Shot까지 했을 때 더 좋은 성능이 나오도록 유도하였다

```
카테고리별 성능

1-vs-all 분류 방식에 더해 정책 불일치가 존재했기 댸문에, 이진 분류 때의 성능보다는 낮게 나온다. 

unsafe로 분류했을 때, 잘못된 category로 분류하면 패널티를 줬기 때문에 성능이 더 낮게 나옴.
```

- 4.5.2 Adaptability via Fine-tuning.
- 정책에 더 빠르게 적응하는 것을 확인할 수 있다. Llama Guard는 20%만 사용하여도 100%를 다 학습한 Llama2-7b와 유사한 성능을 달성할 수 있다.
- 다른 데이터셋을 활용해서 Fine-tuning을 시도하면 성능이 더 잘 나오는지 확인하기 위해 10, 20 , 50, 100%를 사용해본다.

## 5. Related Work.

### Zero-shopt and few-shot inference using LLMs.

새로운 정책에 맞게 조정하기 위해, 대상 데이터셋에서 보지 못한 범주에 대한 제로샷, 퓨샷을 수행한다.

새로운 정책에 적응하기 위해서이다.

---

### Moderation of human-generated content.

대규모 네트워크의 content moderation 분야와 관련이 있다. 하지만 인간이 생성한 content와 LLM 생성 contenct는 차이점이 존재한다.

1. 텍스트의 스타일과 길이가 다르다
2. 인간의 잠재적 유해 유형은 일반적으로 혐오 발언에 국한된다. LLM은 더 넓은 범위의 잠재적 유해를 다룬다
3. LLM 생성 콘텐츠를 보호하는 것은 프롬프트와 응답 쌍을 다루는 것을 포함한다.

---

### Guarding LLM-generated content.

LLM 기반 대화 시스템을 안전하게 만들기 위해서는 모델 응답을 확인해야 한다. 공격적인 콘텐츠에 부적적하게 응답을 할 수 있기 때문에, 이런 환경을 조사하고 시스템의 출시 결정을 내리기 위한 프레임워크를 제안한다. Dinan et al.(2021)

---
