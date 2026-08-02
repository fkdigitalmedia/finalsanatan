# Notification System Architecture

## Overview

The Notification System manages automated email delivery, Web Push notifications, and SMS messages across user lifecycle events (registration, purchase receipts, daily horoscope alerts).

---

## 1. Notification Architecture

```mermaid
graph TD
    Trigger[Event Trigger / Queue] --> Engine[Notification Engine]
    Engine --> Channel{Channel Type}
    Channel -- Email --> ReactEmail[React Email Component + SMTP]
    Channel -- Web Push --> PushService[Web Push VAPID Provider]
    Channel -- SMS --> SMSService[SMS Gateway]
    ReactEmail --> Sent[Log Delivery Status]
    PushService --> Sent
    SMSService --> Sent
```

---

## 2. Notification Templates

- Built using React Email (`@react-email/components`).
- Configurable in `notification_templates` database table.
