
# ELAS

ELAS stands for Enhanced Level Authentication System. ELAS will work based on First Level
Protection Password (FLPP) and Second Level Protection Password (SLPP).

Normal password will act as FLPP. End User need to give password and four characters based 
secret key at the time of new account creation. This secret key will be used while entering 
OTP along with it. Secret key and OTP together will act as SLPP.


This is idea based full stack application project (prototype) which is built on top of 
MEAN stack. This application covers core concept of ELAS. Still more features can be 
developed with this application. Contributions are welcome!

** Password should follow strong password standards. Secret key should contain
one uppercase, one lowercase and two special characters.**


## Demo

    1. Clone this repository.
    2. run cd elas.
    3. Create .env file in root level of folder (elas/.env) that should contain environment 
       variables which is provided in environment variables section.
    4. run npm install.
    5. run ng build.
    6. run node server.



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT=<PORT NUMBER>`

`DATABASE_URL=<Mongo DB connection string>`

`MIN_SALT=1`

`LOW_SALT=2`

`INT_SALT=5`

`HIGH_SALT=8`

`MAX_SALT=10`

Check BASE_URL in environment/environment.ts file.

## API Reference

#### Creation of new account

```http
  POST /signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Request Body` | `Object` | Should contain username, password, secret key. |

#### {
    "username": "<username>",
    "password": "<password>",
    "key": "<key>"
}

Returns user data payload as response.

#### Account login

```http
  POST /login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Request Body`      | `Object` | Should contain username and password. |

#### {
    "username": "<username>",
    "password": "<password>"
}
#### Account authentication

```http
  POST /auth
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Request Body`      | `Object` | Should contain secret key and otp. |

#### {
    "key": "<key>",
    "otp": "<otp>"
}
#### New OTP generation

```http
  PUT /reAuth
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Request Body`      | `Object` | Should contain username. |

#### {
    "username": "<username>"
}

## FAQ

#### Is ELAS more secure than the current authentication system?

Yes, Even though an anonymous person performing brute force attack for breaching the password,
If the password is breached, Anonymous person will use the breached password which is acting as
FLPP. After that, OTP will be generated and will be received by valid End User. Then, End
User can be aware of anonymous actions which is happening with the account and can be prevented 
from the account take over by changing the password and secret key immediately before that
anonymous person trying to make brute force attack on secret key.

#### Is ELAS is secure than complex OTP based system?
Absolutely Yes! Because, Any person can say instead of implementing the ELAS we can make OTPs
more complex in the existing system itself. But, there is one possible vulnerability in this
way. i.e., what if the End User's device having a back door access for that anonymous person.
Even though, complex OTPs introduced, having a back door access will be easy for that
anonymous person to steal complex OTP which will be received by the End User.

ELAS having secret key which will be associated with the End User account will prevent this
kinda vulnerabilities and will make End User account more secure.

#### How the account can be recovered or password/secret key can be changed?
End User will receive link and complex OTP in separate mails. Using the link, End User need to
enter the complex OTP to recover the account or to change the password/secret key.



## Authors

- [@dev-kishore](https://www.github.com/dev-kishore)

