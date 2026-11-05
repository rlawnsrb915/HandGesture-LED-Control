
const int LED_PIN = 10;

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(20);

  pinMode(LED_PIN, OUTPUT);
  analogWrite(LED_PIN, 0);
}

void loop() {
  if (Serial.available() > 0) {

    String line = Serial.readStringUntil('\n');
    line.trim();

    // PWM 명령어인지 확인
    if (line.startsWith("PWM:")) {

      // PWM: 뒤 숫자 추출
      String value = line.substring(4);

      int brightness = value.toInt();

      // 0~255 범위 제한
      brightness = constrain(brightness, 0, 255);

      // LED 밝기 조절
      analogWrite(LED_PIN, brightness);
    }
  }
}
