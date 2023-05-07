const imeiData = [
    {
        "success": true,
        "query": 352933100520747,
        "data": {
          "tac": 35293310,
          "serial": 52074,
          "controlNumber": 7,
          "valid": true,
          "device_id": 9896,
          "device_image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-4-r1.jpg",
          "device_spec": {
            "sim_slots": "1",
            "os": "Android 10.0",
            "os_family": "Android",
            "aliases": [
              "G020M",
              "G020I",
              "GA01188-US",
              "GA01187-US",
              "GA01189-US",
              "GA01191-US"
            ],
            "bluetooth": [
              "5.0",
              "A2DP",
              "LE",
              "aptX HD"
            ],
            "usb": [
              "3.1",
              "Type-C 1.0 reversible connector"
            ],
            "wlan": [
              "Wi-Fi 802.11 a/b/g/n/ac",
              "dual-band",
              "Wi-Fi Direct",
              "DLNA",
              "hotspot"
            ],
            "nfc": true,
            "speed": [
              "HSPA 42.2/5.76 Mbps",
              "LTE-A (5CA) Cat18 1200/150 Mbps"
            ],
            "nettech": [
              "GSM",
              "CDMA",
              "HSPA",
              "EVDO",
              "LTE"
            ]
          },
          "name": "Pixel 4",
          "brand": "Google",
          "model": "G020N",
          "models": [
            "G020N"
          ],
          "manufacturer": "Google Inc",
          "type": "Smartphone",
          "frequency": [
            "LTE FDD BAND 1",
            "LTE FDD BAND 2",
            "LTE FDD BAND 3",
            "LTE FDD BAND 4",
            "LTE FDD BAND 5",
            "LTE FDD BAND 7",
            "LTE FDD BAND 8",
            "LTE FDD BAND 12",
            "LTE FDD BAND 13",
            "LTE FDD BAND 17",
            "LTE FDD BAND 18",
            "LTE FDD BAND 19",
            "LTE FDD BAND 20",
            "LTE FDD BAND 21",
            "LTE FDD BAND 25",
            "LTE FDD BAND 26",
            "LTE FDD BAND 28",
            "LTE FDD Band 66",
            "LTE TDD BAND 38",
            "LTE TDD BAND 40",
            "LTE TDD BAND 41",
            "LTE TDD BAND 42",
            "GSM850 (GSM800)",
            "GSM 900",
            "GSM 1800",
            "GSM 1900",
            "WCDMA FDD Band 1",
            "WCDMA FDD Band 2",
            "WCDMA FDD Band 4",
            "WCDMA FDD Band 5",
            "WCDMA FDD Band 6",
            "WCDMA FDD Band 8"
          ],
          "blacklist": {
            "status": false
          }
        }
      },
      {
        "success": true,
        "query": 864934040840626,
        "data": {
            "tac": 86493404,
            "serial": 84062,
            "controlNumber": 6,
            "valid": true,
            "device_id": null,
            "device_image": null,
            "device_spec": {
                "sim_slots": "2",
                "os": null,
                "os_family": "",
                "aliases": [],
                "bluetooth": null,
                "usb": null,
                "wlan": null,
                "nfc": null,
                "speed": null,
                "nettech": null
            },
            "name": "FortuneShip FP789L-T",
            "brand": "FortuneShip",
            "model": "FP789L-T",
            "models": [
                "FP789L-T"
            ],
            "manufacturer": "Guizhou Fortuneship Technology Co Ltd",
            "type": "Smartphone",
            "frequency": [
                "LTE FDD BAND 1",
                "LTE FDD BAND 3",
                "LTE FDD BAND 7",
                "LTE FDD BAND 8",
                "LTE FDD BAND 20",
                "GSM850 (GSM800)",
                "GSM 900",
                "GSM 1800",
                "GSM 1900",
                "WCDMA FDD Band 1",
                "WCDMA FDD Band 8"
            ],
            "blacklist": {
                "status": false
            }
        }
    }
]
export function queryIMEI(searchedIMEI: number){
    return imeiData.find(imei => imei.query === searchedIMEI) ? imeiData.find(imei => imei.query === searchedIMEI) : null
}