#include <Arduino.h> // Include the Arduino library

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  if (Serial.available() > 0)
  {
    char inChar = Serial.read(); // Correct the function name to "read" (lowercase 'r')
    if (inChar == '1')
    {
      digitalWrite(13, HIGH);
    }
    else if (inChar == '0')
    {
      digitalWrite(13, LOW);
    }
  }
}
