UPDATE public.legal_pages SET
  body_md = $md$## Get in touch

Kisi bhi sawaal, feedback, bug report, ya business inquiry ke liye humein ek hi jagah likhein:

**support@sanatantools.com**

Hum aam taur par **2 business days** ke andar jawab dete hain. Neeche diya form bhi use kar sakte hain — wo bhi issi inbox me aata hai.

## Before you write

Thoda time bachane ke liye:

- Kundli / Panchang / Muhurat ka issue ho to page ka **URL, apni city, aur birth details** (jitna share karna comfortable ho) zaroor mention karein.
- Bug report me **browser, device, aur screenshot** helpful hote hain.
- Account ya payment ka sawaal ho to registered **email address** likhein (password kabhi mat bhejein).$md$,
  version = version + 1,
  last_updated_at = now()
WHERE slug = 'contact';