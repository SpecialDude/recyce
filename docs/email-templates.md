# Recyce Email Templates for Supabase

Copy these templates into your Supabase Dashboard:
**Authentication → Email Templates**

---

## 1. Confirm Signup Email

**Subject:** `Welcome to Recyce - Verify Your Email 🌿`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align: center;">
              <img src="https://your-domain.com/recyce-logo.png" alt="Recyce" width="140" style="margin-bottom: 24px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #212529;">Welcome to Recyce! 🌿</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #495057; text-align: center;">
                Thanks for joining! Click the button below to verify your email and start selling your electronics for instant cash.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" 
                       style="display: inline-block; background: linear-gradient(135deg, #1ab35d 0%, #159549 100%); 
                              color: #ffffff; padding: 14px 32px; border-radius: 10px; 
                              text-decoration: none; font-weight: 600; font-size: 16px;
                              box-shadow: 0 4px 12px rgba(26, 179, 93, 0.3);">
                      Verify My Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #f1f3f5; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #adb5bd;">
                If you didn't create this account, you can safely ignore this email.
              </p>
              <p style="margin: 0; font-size: 12px; color: #ced4da;">
                © 2026 Recyce - Electronic Recycling Made Easy
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Reset Password Email

**Subject:** `Reset Your Recyce Password`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align: center;">
              <img src="https://your-domain.com/recyce-logo.png" alt="Recyce" width="140" style="margin-bottom: 24px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #212529;">Reset Your Password</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #495057; text-align: center;">
                We received a request to reset your password. Click the button below to create a new one.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" 
                       style="display: inline-block; background: linear-gradient(135deg, #1ab35d 0%, #159549 100%); 
                              color: #ffffff; padding: 14px 32px; border-radius: 10px; 
                              text-decoration: none; font-weight: 600; font-size: 16px;
                              box-shadow: 0 4px 12px rgba(26, 179, 93, 0.3);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #6c757d; text-align: center;">
                This link expires in 24 hours.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #f1f3f5; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #adb5bd;">
                If you didn't request this, you can safely ignore this email.
              </p>
              <p style="margin: 0; font-size: 12px; color: #ced4da;">
                © 2026 Recyce - Electronic Recycling Made Easy
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Magic Link Email

**Subject:** `Your Recyce Login Link`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding: 40px 40px 24px; text-align: center;">
              <img src="https://your-domain.com/recyce-logo.png" alt="Recyce" width="140" style="margin-bottom: 24px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #212529;">Sign In to Recyce</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 32px; text-align: center;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #495057;">
                Click the button below to sign in to your account.
              </p>
              <a href="{{ .ConfirmationURL }}" 
                 style="display: inline-block; background: linear-gradient(135deg, #1ab35d 0%, #159549 100%); 
                        color: #ffffff; padding: 14px 32px; border-radius: 10px; 
                        text-decoration: none; font-weight: 600; font-size: 16px;">
                Sign In
              </a>
              <p style="margin: 24px 0 0; font-size: 14px; color: #6c757d;">
                This link expires in 1 hour.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #f1f3f5; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #ced4da;">
                © 2026 Recyce - Electronic Recycling Made Easy
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Setup Instructions

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project → **Authentication** → **Email Templates**
3. For each template type, paste the HTML into the body field
4. Replace `https://your-domain.com/recyce-logo.png` with your actual logo URL
5. Click **Save**
