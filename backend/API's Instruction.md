**API's Instruction:**

how to start backend server:

1. cd backend
2. "pip install -r requirements.txt" to install dependencies 
3. python manage.py makemigrations
4. python manage.py migrate

After this run this command to start the server:
Python manage.py runserver

1. http://localhost:8000/auth/csrf/:

   make this request in the start of react app and store the csrf token in any state or local storage you will need these token for next every request:
   sample request:
   `fetch("http://localhost:8000/auth/csrf/", {`

     `method: "GET",`

     `credentials: "include", // Include cookies for CSRF`

     `headers: {`

      `"Content-Type": "application/json",`

     `},`

    `})`

     `.then((res) => res.json())`

     `.then((data) => console.log(data))`

     `.catch((err) => console.error("Fetch error:", err));`

   2. http://localhost:8000/auth/register:
      make post request and send data in this format:
      {

      ​	"name" : "username",

      ​	"email": "example@gmail.com",
      ​	"password": "userpassword"

      }
      make sure to include **CSRF** token in the **headers of every request**

      in response you will get response like that:
      `{`

        `"id": 2,`

        `"email": "msoban@gmail.com",`

        `"name": "soban",`

        `"tokens": {`

      ​    `"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0MjIwOTIyMCwiaWF0IjoxNzQxNjA0NDIwLCJqdGkiOiJmNzEwY2JmZGU4NmU0ZGI0ODVkM2ZlODI3ODkwZDk0ZSIsInVzZXJfaWQiOjJ9.sa8WJUR5S5lgfS2oBrJplxodg0JoQ2O8xbIxeKXXPow",`

      ​    `"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxNjkwODIwLCJpYXQiOjE3NDE2MDQ0MjAsImp0aSI6IjQxYTM0NDg0Y2JjMjRhYmY5MmQ3ZDIzNDdlN2MyNWZjIiwidXNlcl9pZCI6Mn0.1_TrlQxgBxPDk7txS_WQojZqvnP1-q99szhXOpg6VNo"`

        `}`

      `}`

      **Make sure to store refresh and access token as well as you will need access token for authorized endpoints**



3. http://localhost:8000/auth/login:
   post request format:

   {

   ​	"name" : "username",

   ​	"email": "example@gmail.com",
   ​	"password": "userpassword"

   }

   response will be same like register response

4. http://localhost:8000/auth/logout:
   post request:
   send access token in the headers like this:

   `fetch("http://localhost:8000/auth/logout", {`

     `method: "POST",`

     `credentials: "include",`

     `headers: {`

      `"Content-Type": "application/json",`
   `"X-CSRF-Token": <csrf_token>,`

   `"Authorization": 'Bearer <access_token>'`  

     `},`

    `})`

   and in the body send **refresh token**

   it will logout the user
