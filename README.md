# jewelery-co-upwork

## Description
Application built for a client so that they can generate jewelery appraisals for their clients.

## How to get started
Create an account using the codename "github" on the sign up page. You can then log in with this account and try out creating jewelery or watch appraisals. You can then mail yourself the generated appraisal document. 

## How to run the code yourself
You should create a .env file with the following MongoDB credentials: DB_HOST, DB_USER, DB_TABLE, and DB_PASS. The file must also include SIGNUP_PASS (currently "github" as noted above). You should also include EMAIL_USER and EMAIL_PASS which must be a "less-secure apps" enabled gmail account to work with the current code (though the nodemailer code in the controllers is fairly easy to edit if you'd like to use another type of email account).
