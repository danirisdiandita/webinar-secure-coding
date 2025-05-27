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




# Kegiatan 1: 

1. Buat dua akun email dan password, contoh: 

- user 1: 
email: dani@widyasecurity.com - password: <diisi> (password generator)

- user 2: 
email: fatah@widyasecurity.com - password: <diisi> (password generator)


2. Best Practices

| Praktik                                      | Deskripsi                                                                 | Related OWASP Top 10 Risk                                       |
|---------------------------------------------|---------------------------------------------------------------------------|------------------------------------------------------------------|
| Gunakan hashing password yang aman          | Gunakan bcrypt, Argon2, atau PBKDF2 untuk menyimpan password              | A07:2021 - Kegagalan Identifikasi dan Otentikasi                 |
| Terapkan kebijakan password yang kuat       | Panjang minimal, kompleksitas, dan tolak password yang pernah bocor      | A07:2021 - Kegagalan Identifikasi dan Otentikasi                 |
| Batasi percobaan login dan kunci akun       | Cegah brute-force dan serangan credential stuffing                        | A07:2021 - Kegagalan Identifikasi dan Otentikasi                 |
| Selalu gunakan HTTPS                        | Enkripsi seluruh lalu lintas untuk mencegah sniffing dan serangan MITM    | A02:2021 - Kegagalan Kriptografi                                 |
| Aktifkan Otentikasi Multi-Faktor (MFA)      | Tambahkan lapisan keamanan tambahan                                       | A07:2021 - Kegagalan Identifikasi dan Otentikasi                 |
| Amankan cookie sesi                         | Gunakan flag HttpOnly, Secure, dan SameSite                              | A05:2021 - Kesalahan Konfigurasi Keamanan                        |
| Regenerasi token sesi                       | Cegah serangan session fixation saat login/logout                        | A07:2021 - Kegagalan Identifikasi dan Otentikasi                 |
| Hindari enumerasi pengguna                  | Gunakan pesan error umum untuk login/reset                               | A01:2021 - Kontrol Akses yang Rusak                              |
| Gunakan token reset yang kedaluwarsa dan satu kali pakai | Cegah penggunaan ulang dan pencurian token reset password      | A07:2021 - Kegagalan Identifikasi dan Otentikasi                 |
| Tampilkan pesan error umum                  | Jangan beri tahu kredensial mana yang salah                              | A07:2021 - Kegagalan Identifikasi dan Otentikasi                 |
| Log dan pantau aktivitas otentikasi         | Deteksi dan tanggapi aktivitas mencurigakan                              | A09:2021 - Kegagalan Logging dan Monitoring Keamanan             |
| Perbarui library otentikasi                 | Cegah kerentanan yang diketahui pada dependensi                          | A06:2021 - Komponen Rentan dan Usang                             |



# Demo 1 - A01:2021 - Broken Access Control  

Kerusakan kontrol akses adalah masalah saat aplikasi tidak bisa mengatur dengan baik apa yang boleh dan tidak boleh dilakukan oleh pengguna yang sudah masuk. Misalnya: user A bisa melihat data user B.


TODO: 
- [ ] Buat dua akun user Fatah dan Dani dengan email fatah@example.com dan dani@example.com dengan password 12345678 
- [ ] Login sebagai user Fatah dan buat satu note 
- [ ] Login sebagai user Dani dan lihat note user Fatah 
- [ ] Login sebagai user Fatah dan lihat note user Dani 
- [ ] Lakukan secure coding dengan memperbaiki security bug yang ada 


# Demo 2 - A02:2021 - Cryptographic Failures

Kekurangan enkripsi adalah masalah saat aplikasi tidak menggunakan enkripsi yang aman untuk data sensitif. Misalnya: password yang disimpan di database tidak dienkripsi.





