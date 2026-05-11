---
layout: post
title: "패킷 분석(CIC DateSet)"
date: 2025-11-20 18:27:00
desc: "패킷 분석(CIC DateSet)"
keywords: "패킷 분석(CIC DateSet),Etc,카테고리 없음"
categories: [Etc]
tags: ["카테고리 없음"]
icon: fa-sticky-note-o
---
> Source: [https://sanghole.tistory.com/5](https://sanghole.tistory.com/5)

CIC Dateset을 이용하여서 Modbus의 특징에 대해서 공부해봤다. 아마 BoB 프로젝트를 시작하고 논문을 쓴 뒤 바로 시작한 일.

일단 Modbus 패킷에 대한 특징을 먼저 알려주고, 9가지 공격에 대해서 조금씩 설명한뒤, 각각의 9개의 분류 코드를 어떻게 만들었는지에 대해서 설명하겠다. 코드는 한 페이지에 다 작성하면 너무 많아지니까 따로 따로 작성할 예정이다.

### modbus

우리가 확인한 바로는 산업용 프로토콜은 HMI-PLC-기계가 거의 한 회사로 되어 있어서 서로는 개별의 프로토콜을 사용하지만 SCADA나 다른 장비들과는 흔히 사용하는 Modbus를 사용한다고 조사하였다.

그래서 우리는 범용적으로 사용하는 modbus로 타겟을 잡았다. 일단 모드버스의 특징부터!

#### 특징

1. 마스터-슬레이브 구조를 가진다.

    무조건 마스터만 요청을 할 수 있다. slave는 response만 날리는 장치들인 것 이다. 보통 마스터는 HMI가 담당한다.

2. 아래와 같은 구조의 modbus 요청과 응답을 보내고 받는다.

tcp를 제외하고, modbus 데이터 부분만 불러온 wireshark 캡쳐본이다.

75 3d : TID, 트랜잭션 식별자.

00 00 : PID, 프로토콜 식별자 ( modbus인 경우에는 이 값은 항상 0)

00 06: Length: 길이 필드이며, 이 필드 이후에 따라오는 데이터의 총 바이트 수를 나타낸다.

01 : UID

01: Fucntio code는 해당 modbus 패킷 데이터가 어떤 명령을 수행하는지에 대한 내용이다.

00 0e: Reference Number랑, 00 01: bit Count는 묶어서 해석하는 것이 편하다.

Reference Number에 해당하는 레지스터 주소값부터  bit Count만큼의 레지스터 정보를 불러오겠다.

위에 있는 wireshark 캡처본을 생각하면 14레지스터값 부터 1개의 값을 불러오는 것 이다.

3. modbus tcp인 경우에, modbus 요청을 받고 나서 502포트를 사용하여서 ACK 응답을 보낸다. 이 점을 유의해서 코드를 작성해야한다. 만약 그냥 502에 대한 파싱 로직을 구현해놓으면 modbus만 걸러내는 코드를 만들 때, 이러한 ACK도 같이 파싱될 수 있다.

4. 실제로 산업 현장을 가서 네트워크 패킷을 따온 것은 아니지만, 내가 확인했던 3개의 테스트배드에서는 READ만 진행하는 폴링을수행하거나, READ후 16번을 활용해서 write all coils를 사용한다. OT의 경우에는 이러한 프로토콜의 규칙과 패턴이 있다.
