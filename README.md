# WEBINAR SECURE CODING

## Development
```
npm run dev
```

## Production 
```
npm run build && npm start 
```
## Prisma Migration (DEVELOPMENT)

``` 
npx prisma migrate dev
```

OWASP TOP 10 

A01:2021 - Broken Access Control  
A02:2021 - Cryptographic Failures  
A03:2021 - Injection  
A04:2021 - Insecure Design *(New)*  
A05:2021 - Security Misconfiguration  
A06:2021 - Vulnerable and Outdated Components  
A07:2021 - Identification and Authentication Failures  
A08:2021 - Software and Data Integrity Failures *(New)*  
A09:2021 - Security Logging and Monitoring Failures *  
A10:2021 - Server-Side Request Forgery (SSRF) * *(New)*  




# Kegiatan 1 - Secure Coding Pada Authentikasi

1. Buat dua akun email dan password, contoh:
→ dani@widyasecurity.com - password: <diisi> (password generator)
→ fatah@widyasecurity.com - password: <diisi> (password generator)
2. Pengenalan best practice authentication: 
→ Hashed password
→ Encryption key / Kunci enkripsi
→ use well-maintained authentication library (Open Source: Next Auth and Enterprise grade: clerk, Auth0, Firebase Authentication)
3. Jangan percaya input user
→ gunakan validasi pada setiap masukan user
→ gunakan validator dengan library yang well-maintained (zod)

# Kegiatan 2 - Contoh Kerentanan Sederhana

TODO 1 - SQL INJECTION
Unsafe query:  http://localhost:3000/api/note/1%20--
TODO 2 - BROKEN ACCESS CONTROL
Bad filter: http://localhost:3000/api/note/1
TODO 3 - FIXING VALIDATION
adding library zod to the database

# Kegiatan 3 - Application Security Testing

Contoh tools VA: 
- VA Scanner: Zap Proxy, Burp Suite, Nessus, 
- Chrome Extension: Retirejs 
- All in one: Snyk 
- Code Review: SonarQube, Coderabbit

list kegiatan: 
TODO 1 - Install Zap (Open Source VA Scanner)
TODO 2 - Automatic Scan
TODO 3 - Mencoba betulkan


