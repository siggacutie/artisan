# Payment Notification & SMS Listener Setup

## What it does
Listens for PhonePe/Bank notifications or SMS on your Android phone.
When a payment arrives, it calls our API to auto-credit the user's wallet.

---

## Option A — Tasker + AutoNotification (Best for App Notifications)
1. Install **Tasker** and **AutoNotification** from Play Store.
2. Create a Profile in Tasker: **Event** -> **Plugin** -> **AutoNotification** -> **Intercept**.
3. Configuration:
   - **App**: PhonePe (or your bank app)
   - **Notification Title**: `received` (or similar keyword)
4. Create a Task for this profile:
   - **HTTP Request**:
     - **Method**: POST
     - **URL**: `https://artisanstore.xyz/api/payments/confirm`
     - **Headers**: 
        `Content-Type: application/json`
        `x-listener-secret: artisan-listener-secret-2026`
     - **Body**: 
       ```json
       {
         "utrNumber": "%antitle",
         "amountVerified": "%antext"
       }
       ```
    *(Note: You must use Tasker's "Variable Search Replace" with regex `\b([0-9]{12})\b` to extract the UTR from %antitle or %antext first!)*

---

## Option B — Tasker (Best for SMS)
1. Create a Profile: **Event** -> **Phone** -> **Received Text**.
2. Configuration:
   - **Sender**: (Leave blank or specify bank numbers like `V-PHNPAY`, `AX-BANK`, etc.)
   - **Content**: `*received*` or `*credited*`
3. Create a Task:
   - **Variable Search Replace**:
     - **Variable**: `%SMSRB` (SMS Body)
     - **Search**: `\b([0-9]{12})\b` (Matches 12-digit UTR)
     - **Store Matches In**: `%utr_match`
   - **Variable Search Replace**:
     - **Variable**: `%SMSRB`
     - **Search**: `Rs\.?\s*([0-9,]+)` (Matches Amount)
     - **Store Matches In**: `%amount_match`
   - **HTTP Request**:
     - **Method**: POST
     - **URL**: `https://artisanstore.xyz/api/payments/confirm`
     - **Headers**: 
        `Content-Type: application/json`
        `x-listener-secret: artisan-listener-secret-2026`
     - **Body**: 
       ```json
       {
         "utrNumber": "%utr_match1",
         "amountVerified": "%amount_match1"
       }
       ```

---

## Option C — Python Script (Runs on Termux)
Install **Termux** and **Termux:API** on the phone.
```bash
pkg install python
pip install requests
```

Create `listener.py`:
```python
import subprocess, requests, re, time, json

SECRET = "artisan-listener-secret-2026"
URL = "https://artisanstore.xyz/api/payments/confirm"

def check_notifications():
    # Requires Termux:API app and 'pkg install termux-api'
    result = subprocess.run(['termux-notification-list'], capture_output=True, text=True)
    notifications = json.loads(result.stdout)
    
    for n in notifications:
        if n['packageName'] == 'com.phonepe.app':
            # Extract UTR and Amount using regex
            text = n['content']
            utr = re.search(r'\b([0-9]{12})\b', text)
            amt = re.search(r'Rs\.?\s*([0-9]+)', text)
            
            if utr:
                print(f"Detected payment: UTR {utr.group(1)} for Rs {amt.group(1) if amt else '?'}")
                requests.post(URL, headers={"x-listener-secret": SECRET}, json={
                    "utrNumber": utr.group(1),
                    "amountVerified": amt.group(1) if amt else None
                })

while True:
    check_notifications()
    time.sleep(10)
```

---

## Option D — Manual Approval (Fallback)
Admin goes to `/admin/payments`, reviews `UTR_SUBMITTED` records, and clicks **Confirm Payment**.
This works even if your phone is offline.
