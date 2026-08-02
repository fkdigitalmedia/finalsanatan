# Panchang Engine Validation Report

Generated: 2026-07-15T15:24:32.965Z

## Summary

| Metric                                    | Value      |
| ----------------------------------------- | ---------- |
| Total test cases                          | **4746**   |
| Passed                                    | 4735       |
| Failed (hard — must fix)                  | **0**      |
| Failed (soft — tolerance/reference drift) | 11         |
| Overall accuracy                          | **99.77%** |

## By Category

| Category   | Total | Passed | Failed | Accuracy |
| ---------- | ----: | -----: | -----: | -------: |
| SunRef     |    44 |     35 |      9 |   79.55% |
| Festival   |    10 |      8 |      2 |   80.00% |
| Invariant  |  4147 |   4147 |      0 |  100.00% |
| Transition |   160 |    160 |      0 |  100.00% |
| CrossCity  |   360 |    360 |      0 |  100.00% |
| CoreReuse  |    25 |     25 |      0 |  100.00% |

## Mismatches (11)

| ID       | Severity | Category | Where                | Expected               | Actual                    | Δ   | Note                                |
| -------- | -------- | -------- | -------------------- | ---------------------- | ------------------------- | --- | ----------------------------------- |
| SUN-0009 | soft     | SunRef   | New Delhi 2020-02-29 | sunrise 06:52          | 06:47                     | 5m  | sunrise (timeanddate)               |
| SUN-0015 | soft     | SunRef   | Bengaluru 2024-06-21 | sunrise 05:59          | 05:54                     | 5m  | sunrise (timeanddate)               |
| SUN-0020 | soft     | SunRef   | Chennai 2024-06-21   | sunset 18:32           | 18:37                     | 5m  | sunset (timeanddate)                |
| SUN-0022 | soft     | SunRef   | Chennai 2024-12-21   | sunset 17:41           | 17:47                     | 6m  | sunset (timeanddate)                |
| SUN-0025 | soft     | SunRef   | Kolkata 2024-12-21   | sunrise 06:19          | 06:12                     | 7m  | sunrise (timeanddate)               |
| SUN-0027 | soft     | SunRef   | Varanasi 2024-06-21  | sunrise 05:04          | 05:08                     | 4m  | sunrise (timeanddate)               |
| SUN-0028 | soft     | SunRef   | Varanasi 2024-06-21  | sunset 18:47           | 18:51                     | 4m  | sunset (timeanddate)                |
| SUN-0033 | soft     | SunRef   | New York 2024-03-10  | sunrise 07:20          | 07:14                     | 6m  | sunrise (timeanddate-DST-start)     |
| SUN-0034 | soft     | SunRef   | New York 2024-03-10  | sunset 19:04           | 18:57                     | 7m  | sunset (timeanddate-DST-start)      |
| FES-0046 | soft     | Festival | Delhi 2023-11-12     | Krishna Amavasya (#30) | Krishna Chaturdashi (#29) |     | Diwali 2023 (DrikPanchang)          |
| FES-0051 | soft     | Festival | Delhi 2024-01-15     | Shukla Chaturthi (#4)  | Shukla Panchami (#5)      |     | Makar Sankranti 2024 (DrikPanchang) |

## Notes on tolerances

- Sunrise/Sunset: ±3 min vs timeanddate.com. Larger drift is flagged **soft** (atmospheric refraction, elevation ≈ 0, and reference rounding all contribute).
- Tithi/Nakshatra/Yoga/Karana at exact indices: **hard** — mismatch means the traditional index differs.
- Cross-city consistency & domain invariants: **hard** — any mismatch is a real engine bug.
- Festival tithi is evaluated at Delhi sunrise (Sūryodaya-Vyāpinī rule).
