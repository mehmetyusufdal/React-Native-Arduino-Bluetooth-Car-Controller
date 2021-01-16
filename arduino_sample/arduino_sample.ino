#define enA 2 // left pwm
#define in1 26 // left backward
#define in2 28 // left forward
#define enB 3 // rigt pwm
#define in3 24 // right backward
#define in4 22 // right forward

#define ledVcc 34
#define buzzerGnd 38

#define buzzer 40 // buzzer vcc

int led[3] = {36, 32, 30}; // led pins (RGB)

char command = '0';

bool ledState[3] = {true, true, true}; // for setting led's color
int ledType = 0; // for setting led's stat (0: off, 1: blink, 2: constant color
bool blinkState = true;
bool buzzerState = false;

unsigned long lastTime = 0;

void setup() {
  pinMode(enA, OUTPUT);
  pinMode(enB, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(in3, OUTPUT);
  pinMode(in4, OUTPUT);

  pinMode(buzzerGnd, OUTPUT);
  pinMode(buzzer, OUTPUT);

  digitalWrite(buzzerGnd, LOW); // set pin to buzzer gnd
  digitalWrite(buzzer, LOW); // turn off buzzer

  pinMode(ledVcc, OUTPUT);
  for (int i = 0; i < 3; i++) pinMode(led[i], OUTPUT); // set led pins to output

  digitalWrite(ledVcc, HIGH);
  for (int i = 0; i < 3; i++) digitalWrite(led[i], HIGH); // turn off led

  Serial.begin(9600);
}

void loop() {
  command = '0';

  while (Serial.available() > 0) {
    command = Serial.read();
  }

  if (command == 'A') { // buzzer on
    digitalWrite(buzzer, HIGH);
  }
  else if (command == 'a') {
    digitalWrite(buzzer, LOW); // buzzer off
  }
  else if (command == 'b') { // turn on/off led's red
    ledType = 2;
    ledState[0] = !ledState[0];
    for (int i = 0; i < 3; i++) {
      digitalWrite(led[i], ledState[i]);
    }
  }
  else if (command == 'c') { // turn on/off led's green
    ledType = 2;
    ledState[1] = !ledState[1];
    for (int i = 0; i < 3; i++) {
      digitalWrite(led[i], ledState[i]);
    }
  }
  else if (command == 'd') { // turn on/off led's blue
    ledType = 2;
    ledState[2] = !ledState[2];
    for (int i = 0; i < 3; i++) {
      digitalWrite(led[i], ledState[i]);
    }
  }
  else if (command == 'e') { // change led's stat to blink or off
    if (ledType == 1) ledType = 0;
    else ledType = 1;
  }
  else if (command == '8') { // forward
    digitalWrite(enA, HIGH);
    digitalWrite(enB, HIGH);
    digitalWrite(in1, LOW);
    digitalWrite(in2, HIGH);
    digitalWrite(in3, LOW);
    digitalWrite(in4, HIGH);

    Serial.println("Forward");
  }
  else if (command == '2') { // backward
    digitalWrite(enA, HIGH);
    digitalWrite(enB, HIGH);
    digitalWrite(in1, HIGH);
    digitalWrite(in2, LOW);
    digitalWrite(in3, HIGH);
    digitalWrite(in4, LOW);

    Serial.println("Backward");
  }
  else if (command == '7' || command == '4') { // forward & left
    digitalWrite(enA, LOW);
    digitalWrite(enB, HIGH);
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    digitalWrite(in3, LOW);
    digitalWrite(in4, HIGH);

    Serial.println("Forward & Left");
  }
  else if (command == '9' || command == '6') { // forward & right
    digitalWrite(enA, HIGH);
    digitalWrite(enB, LOW);
    digitalWrite(in1, LOW);
    digitalWrite(in2, HIGH);
    digitalWrite(in3, LOW);
    digitalWrite(in4, LOW);

    Serial.println("Forward & Right");
  }
  else if (command == '1') { // backward & left
    digitalWrite(enA, LOW);
    digitalWrite(enB, HIGH);
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    digitalWrite(in3, HIGH);
    digitalWrite(in4, LOW);

    Serial.println("Backward & Left");
  }
  else if (command == '3') { // backward & right
    digitalWrite(enA, HIGH);
    digitalWrite(enB, LOW);
    digitalWrite(in1, HIGH);
    digitalWrite(in2, LOW);
    digitalWrite(in3, LOW);
    digitalWrite(in4, LOW);

    Serial.println("Backward & Right");
  }
  else if (command == '5') { // stop
    digitalWrite(enA, LOW);
    digitalWrite(enB, LOW);
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    digitalWrite(in3, LOW);
    digitalWrite(in4, LOW);

    Serial.println("Stop");
  }

  if (ledType == 1) { // blink mode on
    for (int i = 0; i < 3; i++) {  //
      ledState[i] = true;          // reset defined color settings
    }                              //

    if (millis() - lastTime > 500) { // change the color of the led after 500ms
      lastTime = millis();
      blinkState = ! blinkState;

      if (blinkState) {
        digitalWrite(led[0], LOW);
        digitalWrite(led[1], HIGH);
        digitalWrite(led[2], HIGH);
      }
      else {
        digitalWrite(led[0], HIGH);
        digitalWrite(led[1], HIGH);
        digitalWrite(led[2], LOW);
      }
    }
  }
  else if (ledType == 0) { // turn off led
    digitalWrite(led[0], HIGH);
    digitalWrite(led[1], HIGH);
    digitalWrite(led[2], HIGH);
  }
}
