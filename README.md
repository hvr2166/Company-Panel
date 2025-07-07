# Company Panel

A full-featured admin dashboard built with Node.js, SQL, and custom UI components.

**Features
- Stock transfer with validation
- Ledger reports (purchases, sales, expenses)
- Dashboard with charts and summaries
- Authentication and permissions

**Tech Stack
- Node.js
- Express.js
- MySQL
- EJS / HTML / CSS / JavaScript


**Export the sql file in the database knows as "stocks"
** also change your username and password for your sql in db.js file 
** if you delete the present data from the table NOTE -: 1.DON'T DELETE ADMIN ROLE FROM THE DATABASE IN USER TABLE 
                                                         2.DON'T DELETE ANYTHING FROM THE PERMISSION TABLE ALSO 

**How to Run
bash
git clone https://github.com/hvr2166/Company-Panel.git
cd Company-Panel
npm install
npm start

** FOR GETTING IN THE SITE 
EMAIL - admin@gmail.com
PASS = password

well see this is the whole break down of the site 
1. There is a admin login page there is no use of nodemailer basically the site open on the basis of the roles given to the user ( For ex-: if there is a sales employee then he only gets the permission for the sales menu not another menus ) .
2. Then there are multiple menus for working of the say a stock maintaning organistaion / firm
3. As it start with Dashboard (with all the summary of the pages ) and follows with User page ( manageable by anyone who has the right )  , User permission , Attributes and many more pages are present
4. well it does all the operations that needed to be done like we all know CRUD , CREATING SUMMARY REPORTS , PRINTING INVOICE OF THE COMPANY , GENRATING SAMPLE EXCEL FILES AND TAKING DATA FROM EXCEL FILES BY IMPORTING THEM AND FOR USER REQUIRMENT EXPORTING THEM TOO .
5. Also there is also data for testing  in the database right now you can clean all the tables .
6. And on working only you will be able to understand the all pages inter-relation .



                                                            THANKS FOR CHECKING IF YOU FEEL LIKE ASKING ANYTHING CREATE AN ISSUE AND I WILL GET BACK TO YOU 
