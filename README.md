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

# Demo 1 - A01:2021 - Broken Access Control  

Kerusakan kontrol akses adalah masalah saat aplikasi tidak bisa mengatur dengan baik apa yang boleh dan tidak boleh dilakukan oleh pengguna yang sudah masuk. Misalnya: user A bisa melihat data user B.

# Demo 2 - A02:2021 - Cryptographic Failures

Kekurangan enkripsi adalah masalah saat aplikasi tidak menggunakan enkripsi yang aman untuk data sensitif. Misalnya: password yang disimpan di database tidak dienkripsi.





