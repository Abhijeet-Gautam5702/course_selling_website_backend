# Backend for a Course Selling Website  
This is a simple backend created for a course selling website (or any e-commerce website for that matter) built using Node, Express and MongoDB. The backend provides endpoints (or routes) to Admin and User panels.
- Admins can sign-in and create courses. 
- Users can sign-in, view courses and purchase courses.   

This can serve as the starter code for any web application with similar structure and use cases. Some real world examples are:
- Amazon (for listing, selling and buying products)
- Udemy or Coursera 

## Routes  
### Admin Routes
1. **POST** "/admin/signup"
    - Description: Creates a new admin account.
    - Input Body: JSON object => {username: "admin username", password: "any password"}
    - Response: JSON object => 
        - If admin doesn't exist: {message: "Admin Created Successfully"}
        - If admin exists: {message: "Admin Already Exists. Sign In Please"}

2. **POST** "/admin/signin"
    - Description: Checks for the desired admin account and signs in.
    - Input Body: JSON object => {username: "admin username", password: "any password"}
    - Response: JSON object => 
        - If admin exists: {token: "token created by JWT"}
        - If admin doesn't exist: {message: "Admin Account not found in the database. Please Sign Up."}

3. **POST** "/admin/courses"
    - Description: Creates a new course if the user is signed in.
    - Input Header: String => Authorization: "JWT recieved when admin had signed in"
    - Input Body: JSON object => { title: 'course title', description: 'course description', price: 100, imageLink: 'link to the thumbnail' }
    - Response: JSON object => {message: "Course created successfully", courseId: "Course-ID"}

4. **GET** "/admin/courses"
    - Description: Lists all courses of the current signed-in Admin.
    - Input Header: String => Authorization: "JWT recieved when admin had signed in"
    - Response: JSON object => {admin: "Admin Username", courses: List of Courses with their details}

### User Routes
1. **POST** "/user/signup"
    - Description: Creates a new user account.
    - Input Body: JSON object => {username: "user username", password: "any password"}
    - Response: JSON object => 
        - If user doesn't exist: {message: "User Created Successfully"}
        - If user exists: {message: "User Already Exists. Sign In Please"}

2. **POST** "/user/signin"
    - Description: Checks for the desired user account and signs in.
    - Input Body: JSON object => {username: "user username", password: "any password"}
    - Response: JSON object => 
        - If user exists: {token: "token created by JWT"}
        - If user doesn't exist: {message: "User Account not found in the database. Please Sign Up."}

3. **GET** "/user/courses"
    - Description: Lists all the available course to the client.
    - Input Header: String => Authorization: "JWT recieved when user had signed in"
    - Response: JSON object => {courses: Array containing all the courses with details}

4. **POST** "/user/courses/:courseId"
    - Description: Purchases the specified course and adds it to user's account.
    - Input Header: String => Authorization: "JWT recieved when admin had signed in"
    - Response: JSON object => 
        - If course exists: {message: "Course purchased successfully", courseId: "Course-ID"}
        - If course doesn't exist: {message: "Course not found"}

5. **GET** "/user/purchasedCourses"
    - Description: Lists all courses purchased by the current signed-in User.
    - Input Header: String => Authorization: "JWT recieved when user had signed in"
    - Response: JSON object => {"Purchased Courses" : Array containing all the courses with details}

## Installation and Testing   

- Ensure that you have Node installed in your machine locally (if not, [install from here](https://nodejs.org/en)) by running the following command   
```bash
  node
```   
- Clone the repository by running the following command   
```bash
  git clone https://github.com/Abhijeet-Gautam5702/course_selling_website_backend.git
```   
- Install the dependencies   
```bash
  npm install
```   
- Create your own MongoDB instance from the [official website](https://www.mongodb.com/).
- Get the connection string or the database URL and use it in `index.js` file in `db` folder.
- Visit [Postman](https://web.postman.co/) or any other API-testing tool to test the endpoints.   

## Dependencies
- [NodeJS](https://nodejs.org/en)
- [ExpressJS](https://expressjs.com/)
- [JWT (JSON Web Tokens)](https://www.npmjs.com/package/jsonwebtoken)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

