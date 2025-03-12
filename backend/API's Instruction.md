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



**Forums API's**

create, update, delete, get, filter forums

2. http://localhost:8000/api/categories or 'api/tags':

   will return the list of available tags or categories
   only admin can add tags or categories through admin panel
   for admin panel visit http://localhost:8000/admin
   email: soban@gmail.com
   password: 1234

​	make sure to run `python mange.py makemigrations` and **python manage.py migrate**



​	also you can create new admin by running:
​	`cd backend`

​	`python manage.py createsuperuser`

1. http://localhost:8000/api/forums:
   on `GET` request it will return list of all the forums and next or previous pages with following detail:
   also you can get set page_size and current page like : **api/forums/?page=1&page_size=5**
   
   `{`
   
     `"count": 5,`
   
     `"next": "http://localhost:8000/api/forums/?page=3&page_size=2",`
   
     `"previous": "http://localhost:8000/api/forums/?page_size=2",`
   
     `"results": [`
   
   ​    `{`
   
   ​      `"id": 3,`
   
   ​      `"name": "Science Discussion",`
   
   ​      `"category_detail": **null**,`
   
   ​      `"tags_detail": [],`
   
   ​      `"description": "A forum for discussing Science topics.",`
   
   ​      `"created_by": {`
   
   ​        `"id": 2,`
   
   ​        `"email": "msoban@gmail.com",`
   
   ​        `"name": "soban"`
   
   ​      `},`
   
   ​      `"is_locked": **false**,`
   
   ​      `"is_deleted": **false**,`
   
   ​      `"created_at": "2025-03-11T14:35:19.388171Z",`
   
   ​      `"updated_at": "2025-03-11T14:35:19.388171Z"`
   
   ​    `},`
   
   ​    `{`
   
   ​      `"id": 4,`
   
   ​      `"name": "Science Discussion",`
   
   ​      `"category_detail": **null**,`
   
   ​      `"tags_detail": [],`
   
   ​      `"description": "A forum for discussing Science topics.",`
   
   ​      `"created_by": {`
   
   ​        `"id": 2,`
   
   ​        `"email": "msoban@gmail.com",`
   
   ​        `"name": "soban"`
   
   ​      `},`
   
   ​      `"is_locked": **false**,`
   
   ​      `"is_deleted": **false**,`
   
   ​      `"created_at": "2025-03-11T14:36:27.427288Z",`
   
   ​      `"updated_at": "2025-03-11T14:36:27.427288Z"`
   
   ​    `}`
   
     `]`
   
   `}`


   on **POST** request it will create forum for current authenticated user input format:
   `{`

    `"name": "Science Discussion",`
    
    `"category": 3,` #category_id
    
    `"tags": [1],`# list of tags_id
    
    `"description": "A forum for discussing Science topics.",`
    
    `"is_locked": **false**`

   `}`

   

   for **put/patch** request use forum id after **api/forums/<forum_id>** to update any forum

   to GET single forum use **api/forums/<forum_id>**

   to **DELETE** use **api/forums/<forum_id>**



**GET result by Filter**

you can use filter to get forums such as by passing category_id, user_id, tags_id (tags_id can be multiple or single)

use something like this for example to get forums of specific user: **api/forums/?user_id=2 **you can apply any filter or multiple for example: **api/forums/?category_id=2&tags_id=1&user_id=2**



# ForumMembership api's

1. endpoint **/api/forum-memberships**

​	on **GET** request it will return the list of objects containing user and forum of forums which users `joined:`

`[`

  `{`

​    `"id": 1,`

​    `"user": {`

​      `"id": 3,`

​      `"email": "hello@gmail.com",`

​      `"name": "hello"`

​    `},`

​    `"joined_at": "2025-03-12T17:42:26.088743Z",`

​    `"forum": 1`

  `},`

  `{`

​    `"id": 2,`

​    `"user": {`

​      `"id": 3,`

​      `"email": "hello@gmail.com",`

​      `"name": "hello"`

​    `},`

​    `"joined_at": "2025-03-12T17:43:50.758244Z",`

​    `"forum": 2`

  `}`

`]`

​	you can apply filter like this:
​	**api/forum-membership/?user_id=2 and /?forum_id=3**



2. on **POST** request user can joined any forum by passing forum id in body:

​		`{`

​			`"forum" = "4"`

​		`}`  



3. `DELETE /api/forum-memberships/{id}/` → Remove a user from a forum

# Messages api's

endpoint **/api/messages/**

 1. On **GET** request you will get list of all messages:

    `[`

      `{`

    ​    `"id": 2,`

    ​    `"content": "@soban This is a test message",`

    ​    `"created_at": "2025-03-12T18:13:40.442029Z",`

    ​    `"updated_at": "2025-03-12T18:13:40.442029Z",`

    ​    `"forum": 1,`

    ​    `"user": 3,`

    ​    `"parent": **null**`

      `},`

      `{`

    ​    `"id": 1,`

    ​    `"content": "This is a test message",`

    ​    `"created_at": "2025-03-12T17:55:42.201742Z",`

    ​    `"updated_at": "2025-03-12T17:55:42.201742Z",`

    ​    `"forum": 2,`

    ​    `"user": 3,`

    ​    `"parent": **null**`

      `}`

    `]`



​	similarly, you can apply filter to get only messages of specific forum or user:
​	**api/messages/?user_id=2 and /?forum_id=3**

2. On **POST** request you can comment on a specific forum:
   pass data like this if you just simply commenting on forum

   **Note**: keep parent null

   `// {`

   `//   "forum": 1,`

   `//   "content": "@soban This is a test message",`

   `//   "parent": null`

   `// }`

​	if you are replying to some person messages **set parent to message_id you are replying to**

​	`// {`

`//   "forum": 1,`

`//   "content": "@soban This is a test message",`

``//   "parent": 10`

`// }`

	3. Similarly, you can make **PUT/Patch and Delete** request



**NOTE**: User can mention any one by writing @username in the message content 



# MessageMentions api's

enpoint **/api/message-mentions/**

Only **GET** request to get the list where authenticated user is mentioned(can apply filter by message_id):
`[`

  `{`

​    `"id": 1,`

​    `"message": 2,`

​    `"mentioned_user": 2`

  `}`

`]`



