/**
 * AppsMiners ATtiny85 Cold Wallet USB Hardware Key
 * 
 * Flashing Instructions:
 * 1. Open Arduino IDE.
 * 2. Go to File -> Preferences -> Additional Boards Manager URLs and add:
 *    http://drazzy.com/package_drazzy.com_index.json
 *    (or http://digistump.com/package_digistump_index.json)
 * 3. Go to Tools -> Board -> Board Manager and install "Digistump AVR Boards".
 * 4. Select Board: "Digispark (Default - 16.5mhz)".
 * 5. Compile and hit Upload. When prompted, insert the ATtiny85 into the USB port.
 */

#include "DigiKeyboard.h"

// Unique cryptographic hardware signature key for AppsMiners
const char* walletKey = "AppsMiners-ATTINY85-ColdWallet-KEY-7f8a9c2b4d6e";

// LED indicator pins
const int LED_MODEL_A = 0; // Model A built-in LED
const int LED_MODEL_B = 1; // Model B built-in LED

void setup() {
  pinMode(LED_MODEL_A, OUTPUT);
  pinMode(LED_MODEL_B, OUTPUT);
}

void loop() {
  // Wait 2 seconds for USB HID keyboard drivers to initialize on host
  DigiKeyboard.delay(2000);
  
  // Blink LEDs twice to indicate connection & initialization
  for (int i = 0; i < 2; i++) {
    digitalWrite(LED_MODEL_A, HIGH);
    digitalWrite(LED_MODEL_B, HIGH);
    DigiKeyboard.delay(150);
    digitalWrite(LED_MODEL_A, LOW);
    digitalWrite(LED_MODEL_B, LOW);
    DigiKeyboard.delay(150);
  }
  
  // Focus text field and type the hardware authorization signature key
  DigiKeyboard.print(walletKey);
  
  // Press Enter key to submit the signature for verification
  DigiKeyboard.sendKeyStroke(KEY_ENTER);
  
  // Hold LEDs on solid to indicate successful key typing
  digitalWrite(LED_MODEL_A, HIGH);
  digitalWrite(LED_MODEL_B, HIGH);
  
  // Enter sleep mode to prevent typing repeatedly
  while (true) {
    DigiKeyboard.delay(1000);
  }
}
