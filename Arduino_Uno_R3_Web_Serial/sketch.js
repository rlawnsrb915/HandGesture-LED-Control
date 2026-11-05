let handPose, video, slider;
let hands = [];
let connections = [];

let sliderValue = 50;
let isSliderDragging = false;

// 아두이노 시리얼 통신
let port;
let writer;
let connectBtn;
let lastPwmVal = -1;
let sending = false;

function preload() {
  handPose = ml5.handPose({ flipped: true });
}

function setup() {
  createCanvas(640, 480);

  // 아두이노 연결 버튼
  connectBtn = createButton('아두이노 연결');
  connectBtn.position(10, 500);
  connectBtn.mousePressed(connectSerial);

  // 밝기 조절 슬라이더
  slider = createSlider(0, 100, 50, 1);
  slider.position(10, 20);
  slider.style('writing-mode', 'vertical-rl');
  slider.style('height', '440px');
  slider.style('width', '20px');
  slider.style('transform', 'rotate(180deg)');

  // 슬라이더 직접 조작 감지
  slider.elt.addEventListener('pointerdown', () => {
    isSliderDragging = true;
  });

  window.addEventListener('pointerup', () => {
    isSliderDragging = false;
  });

  slider.input(updateSliderValue);

  // 카메라
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // 손 인식 시작
  handPose.detectStart(video, gotHands);
  connections = handPose.getConnections();
}

function draw() {
  image(video, 0, 0, width, height);

  drawSkeletons(hands);
  drawKeyPoints(hands);

  // 손이 인식되면 밝기 조절
  if (hands.length > 0) {
    drawConnectedLine(hands);

    // 마우스로 슬라이더를 조작하지 않을 때만
    if (!isSliderDragging) {
      let target = getNormalizedDistance(hands);

      // 부드러운 밝기 변화
      sliderValue = lerp(sliderValue, target, 0.1);

      slider.value(round(sliderValue));
    }
  }

  // LED 밝기 표시
  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(24);
  text("LED 밝기: " + round(sliderValue) + "%", 70, 40);

  // 아두이노에 PWM 값 전송
  sendPwmToArduino(sliderValue);
}

// 아두이노 연결
async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const encoder = new TextEncoderStream();
    encoder.readable.pipeTo(port.writable);

    writer = encoder.writable.getWriter();

    connectBtn.html('아두이노 연결됨');
    lastPwmVal = -1;

  } catch (e) {
    console.error("연결 실패:", e);
  }
}

// 아두이노로 밝기 전송
async function sendPwmToArduino(val) {
  if (!writer || sending) return;

  let pwmVal = floor(map(val, 0, 100, 0, 255));
  pwmVal = constrain(pwmVal, 0, 255);

  if (pwmVal === lastPwmVal) return;

  sending = true;

  try {
    await writer.write(`PWM:${pwmVal}\n`);
    lastPwmVal = pwmVal;

  } catch (e) {
    console.error("전송 오류:", e);
  } finally {
    sending = false;
  }
}

// 손 인식 결과
function gotHands(results) {
  hands = results;
}

// 손가락 관절 표시
function drawKeyPoints(hs) {
  for (let hand of hs) {
    for (let p of hand.keypoints) {
      fill(255, 0, 0);
      noStroke();
      circle(p.x, p.y, 8);
    }
  }
}

// 손 뼈대 표시
function drawSkeletons(hs) {
  for (let hand of hs) {
    stroke(0, 255, 0);
    strokeWeight(2);

    for (let [a, b] of connections) {
      let p1 = hand.keypoints[a];
      let p2 = hand.keypoints[b];

      if (p1 && p2) {
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
  }
}

// 엄지와 검지 사이 선 표시
function drawConnectedLine(hs) {
  let ks = hs[0].keypoints;

  let a = ks[4]; // 엄지 끝
  let b = ks[8]; // 검지 끝

  stroke(255, 140, 0);
  strokeWeight(4);
  line(a.x, a.y, b.x, b.y);

  noFill();
  circle(a.x, a.y, 20);
  circle(b.x, b.y, 20);
}

// 손가락 거리로 밝기 계산
function getNormalizedDistance(hs) {
  let ks = hs[0].keypoints;

  let a = ks[4]; // 엄지 끝
  let b = ks[8]; // 검지 끝
  let c = ks[0]; // 손목
  let d = ks[9]; // 중지 시작점

  let fingerDistance = dist(a.x, a.y, b.x, b.y);
  let palmDistance = dist(c.x, c.y, d.x, d.y);

  if (palmDistance <= 0) return sliderValue;

  let brightness =
    100 * (fingerDistance / palmDistance) - 15;

  return constrain(brightness, 0, 100);
}

// 슬라이더 직접 조작
function updateSliderValue() {
  sliderValue = Number(slider.value());
}
