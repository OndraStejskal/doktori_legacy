# Kardio
## Kontakty
- Ing. Zdeňka Fingrova PhD. : +420 608 308 559, zdenka.fingrova@vfn.cz, zdenka.fingrova@eehealth.cz
- Ing. Bárta (Boston) : +420 727 891 037 
- Ing Michal Zeman (Medtronic): michal.zeman@medtronic.com

## MDSP creds (ID + secret)
- vdtcz-strakonice-1.0.0
- hj0Zo2oSBlafoeZsZZEGXIlAou440D3jkzhuLTtbhaJ

---

## BIOTRONIK
### Endpointy
- https://api.biotronik-homemonitoring.com/rest/api/exports/
### Konverze certifikátu
- OpenSSL> pkcs12 -in 'D:\980540699-cert.p12'-out cert.pem -nokeys
- OpenSSL> pkcs12 -in 'D:\980540699-cert.p12'-out private.key -nocerts -nodes
### Postman
- Authorization: BASIC - client, client secret
- Settings -> Certificates
    - Host: api.biotronik-homemonitoring.com
    - CRT file: cert.pem
    - KEY file: private.key
- URL: https://api.biotronik-homemonitoring.com/rest/api/exports/
### Údaje
- URL: https://www.biotronik-homemonitoring.com/hmsc_guiWeb/user/site/SignIn.jsf
- HMSC user group: demo.cz
- HMSC user: test
- HMSC psw: zkouska
### Klient 2
- Client ID: 2121750051
- Client secret: IoS4QtzO
- Certificate: 2121750051-cert.p12
- Certificate password: KC1fYypqYRFLjqkjLsWnABg2
### Klient 3 - GDPR
- Client ID: 1666367865
- Client secret: ???
- Certificate: 1666367865-cert.p12
- Certificate password: JROPZE5r8pu8Fh2qQP2Dmo0T
### Klient 4 - real data
- Client ID: 980540699
- Client secret: gsIgUnEm
- Certificate: 980540699-cert.p12
- Certificate password: FEQqpKu5gcVOXCPgukRwFSAa

---

## MEDTRONIC
### Mainspring server
- 37.46.209.148
- adam.hrouda / Dalskabat2020

### Mirth
- admin / Dalskabat2020

### Mainspring External account 1
- Account Name: TACR2020
- Authorization Code: GRANT2020 
### Mainspring External account 2
- Account Name: TACR2021
- Authorization Code: Test2021 

---

## BOSTON