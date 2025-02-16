#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 21  // SDA
#define RST_PIN 22

const char* WIFI_SSID = "GUEST-N";
const char* WIFI_PASSWORD = "user@2025";

const char* SUPABASE_URL = "https://hiiltijkrzpnqiyvlzpj.supabase.co/rest/v1/";
const char* SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpaWx0aWprcnpwbnFpeXZsenBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MDU2OTYsImV4cCI6MjA1NTI4MTY5Nn0.QGrAgMbMwKzhz2ReF1BGwkMTHTKzMVKOfVO3n1Q78nA";

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
    Serial.begin(115200);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");

    SPI.begin();
    mfrc522.PCD_Init();
}

void sendToSupabase(String rfid_uid) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String url = String(SUPABASE_URL) + "booking";  // Table to insert data

        http.begin(url.c_str());
        http.addHeader("Content-Type", "application/json");
        http.addHeader("apikey", SUPABASE_API_KEY);
        http.addHeader("Authorization", "Bearer " + String(SUPABASE_API_KEY));

        // JSON Data (Modify according to your database schema)
        String jsonPayload = "{ \"rfid_uid\": \"" + rfid_uid + "\", \"timestamp\": \"now()\" }";

        int httpResponseCode = http.POST(jsonPayload);
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println("Data Sent: " + response);
        } else {
            Serial.println("Error Sending Data: " + String(httpResponseCode));
        }
        http.end();
    } else {
        Serial.println("WiFi Disconnected!");
    }
}

void loop() {
    if (!mfrc522.PICC_IsNewCardPresent()) {
        return;
    }
    if (!mfrc522.PICC_ReadCardSerial()) {
        return;
    }

    String rfid_uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
        rfid_uid += String(mfrc522.uid.uidByte[i], HEX);
    }
    Serial.println("Card Scanned: " + rfid_uid);

    sendToSupabase(rfid_uid);
    delay(3000);
}
