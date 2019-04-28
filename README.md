Google Authenticator Cinnamon Applet
---

This applet is meant to collect Google Authenticator Codes based on a provided secret.
Upon click it adds such code to the clipboard, ready to be pasted.

## Install

Clone the content of this repo in `~/.local/share/cinnamon/applets/google-authenticator@shikaan`.

> *Please note*
> The directory name _must_ be `google-authenticator@shikaan` else it won't work.

## Activate

Right click on a Cinnamon panel and select "Add applets to panel"

![Menu](https://i.ibb.co/LvGyk9M/Untitled.png)

And then activate Google Authenticator applet.

![Window](https://i.ibb.co/g48bqB2/screenshot-2.png)

## How to use it

1. **Get Google Authenticator secret from the QR code.**

   When you read the QR code, you get something like

   ```
    otpauth://totp/XXX:XXX?secret=YYY&issuer=XXX&period=30
   ```

   you need to copy the YYY part

2. **Paste it in Google Authenticator applet settings**

3. _(optional)_ **Remove and re-add the applet** 

## ToDo 

- Get secret from QR code image rather then getting it from settings

## Known issues

- Upon first run Cinnamon crashes, but after that it is fine.