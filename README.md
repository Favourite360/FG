# FG Onyenwe Transport & Logistics — website

Plain HTML, CSS and JavaScript. No React, no npm, no build step, no server.

**To view it: double-click `index.html`.** It opens in your browser and works.

---

## The files

```
index.html                  homepage
about.html
services.html
terminals.html
booking.html
contact.html
faq.html
help-center.html
deliver-easily.html
fg-west-africa-coach.html
prohibited-items.html
privacy-policy.html
terms-and-conditions.html

css/styles.css              all the styling — one file
js/main.js                  all the interactive behaviour — one file
assets/                     29 images
fg-transport-logo.svg
robots.txt
sitemap.xml
```

That's the whole site. 13 pages, one stylesheet, one script.

---

## Editing text

1. Right-click the page file → Open with → Notepad, VS Code, or any editor
2. Find the words you want to change
3. Change them, save
4. Double-click the file to see the result

The text sits between tags like `<h2 ...>Some heading</h2>`. Edit what's between
the `>` and the `<`. Leave the tags alone.

## Editing images

Replace the file inside `assets/`, keeping the same filename — the page picks it
up automatically. Keep new images under about 200KB.

---

## ⚠️ The one thing to watch

**The menu and footer are repeated in all 13 pages.** That's the cost of having
no build step. Change a phone number in the footer and you have to change it in
all 13 files.

Do it in one go with find-and-replace across files:

- **VS Code** (free): File → Open Folder → this folder. Press `Ctrl+Shift+H`.
  Type the old text, type the new text, click **Replace All**.
- **Notepad++** (free): Search → Find in Files → Directory = this folder.

Editing them one at a time is how the site ended up with five different versions
of the company name. Use find-and-replace.

---

## Uploading to Hostinger

There is a ready-made **`fgtransport-upload.zip`** in the folder above this
one. It contains everything, already arranged the way the server expects.

1. Hostinger **hPanel → Files → File Manager**
2. Open **`public_html`**
3. Delete what's in there (the old site). Keep a copy first if you want one —
   select all, right-click, Compress, download the zip.
4. **Upload** `fgtransport-upload.zip`
5. Right-click it → **Extract** → into the current folder
6. Delete the zip afterwards
7. Visit fgtransport.ng

If the old site still shows, hold **Ctrl** and press **F5** — your browser is
showing you a saved copy.

### About the folder named `assets`

You do not need to rename it to `images`. Hostinger places no requirements on
what subfolders are called — `/images` is just a common convention, not a rule.
Renaming it would mean editing about sixty references across the site, with
nothing gained.

### No `.htaccess`

The site does not use one. Everything works from plain files: a request for
`/about.html` gets `about.html`.

One consequence worth knowing. The previous React site served pages at
`/about`, `/services`, `/terminals` — no `.html` on the end, and those are the
addresses Google has indexed. Anyone arriving on one of those links now lands
on the 404 page instead of the page they wanted. It sorts itself out as Google
re-crawls and picks up the new addresses from `sitemap.xml`, which typically
takes a few weeks.

If you ever want those old links working again, there's an `htaccess.txt` in
the `optional-extras` folder. Upload it to `public_html`, rename it to
`.htaccess`, and it handles that plus https, compression and image caching.

---

## The contact & quote forms

Both forms send through **FormSubmit**, a free service that forwards website
submissions to an email address. The page never navigates away and nothing
opens in a new tab — the button says "Sending…", then a status message appears
under the form. Enquiries arrive at **info@fgonyenwe.com**.

There is no PHP, no password and nothing to configure on the server.

### Turning it on — one click, once

FormSubmit needs to know you actually own the address before it will forward
anything. You prove that by submitting the form once:

1. Upload the site
2. Go to the live Contact page and send yourself a test message
3. FormSubmit emails **info@fgonyenwe.com** an activation link — click it
4. That's it. That message and every one after it now arrives in the inbox

The very first submission is held until you click the link. After that they
come straight through.

### Recommended: hide the email address

Once activated, FormSubmit will give you a random-string address like
`https://formsubmit.co/ajax/a1b2c3d4e5f6...` that works exactly the same way.

Open `js/main.js`, find this line near the forms section, and paste it in:

```js
var FORM_ENDPOINT = 'https://formsubmit.co/ajax/info@fgonyenwe.com';
```

Worth doing. As it stands the company address sits in the page source where
address-harvesting bots can read it and add it to spam lists.

### Things worth knowing

**A third party handles your enquiries.** Customer names, phone numbers and
cargo details pass through FormSubmit's servers before reaching you. That's the
trade for not running any mail code yourself. If that ever becomes a concern,
the self-hosted alternative is still written and sitting in the
`unused-php-mail` folder next to this one — it sends through your own Zoho
mailbox and no one else sees the data.

**Forms need the live site.** The browser blocks the request when the page is
opened straight from disk, so testing means uploading first. Every other part
of the site previews fine locally.

**Check spam on the first test.** Activation mail from a new service often
lands there.

**If sending fails**, the visitor is asked to email info@fgonyenwe.com
directly, so an enquiry is never silently lost.

---

## What the JavaScript does

All in `js/main.js`, in clearly labelled sections:

| Section | What it does |
|---|---|
| `mobileMenu` | Opens/closes the menu on phones |
| `accordions` | Expands FAQ and prohibited-items questions |
| `fleetRotator` | Rotates the FG Fleet panel every 5 seconds |
| `terminalSearch` | Filters terminals as you type |
| `dialogs` | The "Get a Quote" pop-up |
| `contactForm` | Sends the contact form to info@fgonyenwe.com |
| `contactSuccess` | Shows the thank-you message afterwards |
| `hashScroll` | Smooth scrolling to sections |

Terminal and fleet details are plain lists at the very top of the file — easy to
add to.

**All the words are in the HTML, not the JavaScript.** So the site still reads
correctly, and Google still indexes it, even if the script fails.

---

## What was verified

- All 13 pages open and display correctly
- Every link and image reference resolves
- **451 of 451** text strings from your original site are present, word for word
- The JavaScript passes a syntax check
- Styling classes matched against the original build

**Not yet tested:** clicking every interactive feature in a browser. Open the
site and try the menu, the FAQ questions, the terminal search and the quote
pop-up, and tell me anything that misbehaves.

---

## Still on the list

See `FINDINGS.md` in the folder above for the full issue list. Already fixed:
the DFDS consent text, brand-name consistency, the 36MB→2.4MB image reduction,
and a broken `/faqs` footer link. Still open: copy and grammar fixes, four
hot-linked stock photos, and the design notes.
