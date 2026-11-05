# HandGesture-LED-Control

<회로도>

<img width="1280" height="902" alt="image" src="https://github.com/user-attachments/assets/00068a52-c724-4cd3-bdcd-8f1ecc4fecc4" />

<아두이노 코드>  
[`Handgesture.ino`](./Handgesture.ino)

<p5.js 코드>

[`sketch.js`](./sketch.js)

<데모>

[손동작 LED 밝기 조절 영상 보기](hand_gesture_demo_compressed.mp4)

<고충>

이번 프로젝트를 진행하면서 손동작을 인식하고 아두이노와 연결하는 과정에서 여러 어려움을 겪었다.
처음에는 p5.js에서 카메라가 정상적으로 작동했지만, ml5.js 라이브러리가 제대로 불러와지지 않아 손을 인식하지 못했다.
이후 라이브러리를 추가하여 손 인식 문제를 해결했지만, 손가락 움직임에 따라 슬라이더 값이 제대로 변하지 않는 문제가 발생했다.
또한 p5.js에서 아두이노로 데이터를 전송하는 과정에서 LED의 밝기가 원하는 대로 조절되지 않아 어려움을 겪었다.
문제를 해결하기 위해 코드를 여러 번 수정하고, 손 인식과 시리얼 통신 기능을 각각 테스트하며 오류의 원인을 찾아보았다.
이 과정을 통해 단순히 코드를 작성하는 것뿐만 아니라 오류를 분석하고 단계적으로 해결하는 과정이 중요하다는 것을 깨달았다.
