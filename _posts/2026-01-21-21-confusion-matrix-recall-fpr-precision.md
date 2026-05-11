---
layout: post
title: "Confusion Matrix로 Recall, FPR, Precision 공부하기"
date: 2026-01-21 13:58:00
desc: "Confusion Matrix로 Recall, FPR, Precision 공부하기"
keywords: "Confusion Matrix로 Recall, FPR, Precision 공부하기,TechnicalDocument,AI 보안,AI Background"
categories: [TechnicalDocument]
tags: ["AI 보안", "AI Background"]
icon: fa-file-text-o
---
> Source: [https://sanghole.tistory.com/21](https://sanghole.tistory.com/21)

AI와 관련된 보안 논문을 계속 읽다 보니까 여러 가지 지표가 나왔으며, 해당 지표를 확인할 때마다 FPR의 개념과 그래프 등등을 확인할 때 계속 개념을 헷갈리길래.. 정확하게 확인하고 넘어가기 위해 적는 AI\_Background

<https://developers.google.com/machine-learning/crash-course/classification/thresholding?hl=ko>

[임곗값 및 혼동 행렬  |  Machine Learning  |  Google for Developers

분류 임곗값을 설정하여 로지스틱 회귀 모델을 이진 분류 모델로 변환하는 방법과 혼동 행렬을 사용하여 참양성 (TP), 참음성 (TN), 거짓양성 (FP), 거짓음성 (FN)의 네 가지 예측 유형을 평가하는 방

developers.google.com](https://developers.google.com/machine-learning/crash-course/classification/thresholding?hl=ko)

일단 developers.google.com에 있는 자료들을 최대한 활용하면서 정리를 진행해 볼 예정이다.

먼저 Confusion Matrix를 보면 TP, FP, FN, TN이 존재한다.

(X)P는 맞은 확률을 이야기하며, (X)N은 틀렸을 경우를 이야기한다.

그러면 TP는 positive라고 예측했을 때 맞았을 확률

FP는 positive 라고 예측했을 때 틀렸을 확률

TN은 negative라고 생각했을 때 맞았을 확률

FN은 negative라고 생각했을 때 틀렸을 확률이다.

이때 주목해봐야 할 점은 데이터가 어떻게 구성이 되어있냐에 따라서 각각의 비율이 달라진 다는 점이다.

동일하게 Threshold를 0.5로 두었을 때,

그림은 순서대로

1. Positive와 negative가 잘 구분되어 있는 경우

2. negative의 점수가 더 높은 예시

3. positive의 예시가 더 적은 경우

같은 임계값으로 설정해도 데이터셋의 불균형이 일어나면 Confusion Matrix를 사용했음에도 TP, FN 등 값의 변동차가 큰 것을 확인할 수 있다. 그럼 이것이 왜 문제일까?

---

보통 TP,FP,FN,TN을 활용해서 Accuracy나 Recall, Precision 등을 주로 사용한다. 일단 먼저 이 개념들을 소개하고 왜 문제일까에 대해서 이야기..

### Accuracy

정확성은 말 그대로 전체 확률 중에서 모델이 정답을 맞춘 확률을 구하고 싶은 것이다.

Confusion Matrix의 네 가지 결과를 모두 통합하므로 두 클래스에 균형 잡힌 데이터 세트를 고려할 때, 모델 품질을 측정할 수 있다.

만약에 이때, negative 한 것이 1%고 나머지가 Positive 할 때, 모든 Negative를 다 틀리게 잡았고 Positive는 다 맞게 잡았으면 정확도 점수가 99% 뜨는 기이한 현상을 볼 수도 있다.

### Recall

참양성률, TPR, 양성으로 올바르게 분류된 모든 실제 양성의 비율. 재현율.

수식을 보게 되면 분모는 Positive에서 맞을 확률과 negative 중에 틀렸을 확률, 분자는 Positive에서 맞았을 확률이다.

FN 자체가 원래는 Positive인데 잘못 예측을 한 경우다.

그러면 전체적인 Positive에서 정답으로 맞춘 Positive는 몇 개냐?를 보는 것.

### FPR

Recall은 얼마나 Positive을 잘 잡냐였다면, FPR은 얼마나 이 친구가 Positive를 못 잡냐를 확인하는 것이다.

분모가 FP, TN인 경우면 Positive가 아닌 데, Positive를 했을 때와 Negative에 대한 정답을 맞혔을 때.

그리고 분자는 FP.. 분모를 해석해 보면 Negative에 대한 모든 값들이 들어가 있고, 그 와중에 FP. 즉 잘못 탐지한 게 얼마나 되냐? 이런 형식인 것 같다.

### Precision

위의 2개는 얼마나 양성을 잘 잡냐를 판단했지만 Precision은 오탐이 얼마나 없냐, 진짜 양성을 잘 잡은 것이 맞냐?를 판단한다.

TP+FP의 경우면, Positive로 판단한 모든 경우의 수 중에서 진짜 양성은 얼마니? 를 판단한다.

---

그러면 위에 있는 dataset을 가지고 왜 데이터 불균형이 일어나면 안 좋은지를 분석해 보자

먼저 1번 기준, 데이터 불균형 문제가 없을 때는 성능이 준수하게 나오는 것을 확인할 수 있다.

2번째 사진을 보면 같인 Threshold를 도입했음에도 Precision의 경우만 점수를 조금 방어했지 Recall의 경우는 많이 떨어진 것을 확인할 수 있다.

근데 진짜 데이터가 불균형이 일어나면

이 Confusion matrix처럼 Recall은 1.00이 나오지만 Precision은 0.11로 엄청 낮은 점수가 나오는 것을 확인할 수 있다.

만약 데이터셋이 어떤지 모른 상태로 이 점수만 보고 역추적을 해보자면

Recall은 TP+FN이 분모, TP가 분 자인경우다. 이때에는 FN이 0이기 때문에 무조건 1.00이 나올 수 밖에 없다.

Precision은 TP+FP가 분모, TP가 분자인 경우인데 이 때 FP가 47로 높기 때문에 낮은 점수가 나오는 것이다.

해당 데이터셋의 임계값을 조정하고 다시 Matrix를 보면

Accuracy는 매우 높게 나오지만, 양성의 경우가 너무 적기 때문에 TP, FP, FN의 개수가 동일하여 Precision과 Recall의 점수가 0.5로 고정되어 있는 모습을 확인할 수 있다.

이렇게 데이터셋을 조금씩 조작해 보면서 하니까 이해는 갔다. 그리고 논문에서 활용한 지표들을 다 믿을 필요는 없다고 생각한다. 물론 논문을 내기 위해서 지표가 더 잘 나오는 것은 사실이지만 자기한테 유리한 지표들을 채택하면 비교 모델군과의 차별점을 가져가는 것처럼 보일 수 있을 것 같다.
