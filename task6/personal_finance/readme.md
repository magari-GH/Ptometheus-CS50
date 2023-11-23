# Personal Finance Tracker

## Table of Contents
- [Introduction](#introduction) 
- [Features](#features) 
- [Installation](#installation) 
- [Usage](#usage) 
- [Technologies Used](#technologies-used) 
- [Screenshots](#screenshots) 
- [Contributing](#contributing) 
- [License](#license)
- [UML diagrams](#uml-diagrams)
- [Difference and complexity]( #difference-and-complexity )

## Introduction
Welcome to Personal Finance Tracker, a web application designed to help users manage their finances efficiently. This application allows users to track income, and expenses, and visualize financial data using charts and graphs.

## Features

-  **User Authentication**: Register an account and log in to manage your personal finances securely. 
- **User-friendly Interface**: A clean and intuitive design to simplify financial tracking. 
- **Dashboard Overview**: Get an instant overview of your financial status, including current balance, income, and expenses.
- **Transaction Management**: Add financial account, transactions with details like date, amount, and category. 
- **Data Visualization**: Visualize your financial data using charts and graphs for better insights. 
- **Search and Filter**: Easily find specific transactions using search functionality and filters. 

## Future Features
-  **Transaction Management**: Edit, and delete financial transactions with details like date, amount, and category.
-  **Budget Tracking**: Set budgets for different expense categories and receive alerts when approaching or exceeding limits.
-  **User Profile**: Personalize your account settings and preferences.
-  **Data Export**: Export your financial data for backup or analysis in various formats, such as CSV.

## Prerequisites
- [Python](https://www.python.org/) installed
- [Django](https://www.djangoproject.com/) installed (`pip install django`)

## Installation

1. Clone the repository: 
```
https://github.com/magari-GH/prometheus-CS50/tree/6028ef193bf162447f1c23fafb9bc944c4dafb33/task6/personal_finance
```
2. Navigate to the project directory:
```cd personal_finance```

3. Run the application:
```python manage.py runserver```
4. Access the application at `http://localhost:8000` in your web browser.

## Usage
1.  Register for an account or log in if you already have one.
2.  Explore the dashboard for an overview of your financial data.
3.  Manage your accounts by adding, editing, or deleting entries.
4.  Add your category by adding one.
5.  Add income and expense transactions as needed.
6.  Visualize your financial data using charts and graphs.
7.  Customize your user profile settings.
8.  Export financial data for backup or external analysis.

## Technologies Used
-   **Backend**: Django (Python)
-   **Frontend**: JavaScript, HTML, CSS, [Bootstrap (Framework)](https://getbootstrap.com/)
-   **Database**: SQLite
-   **Charting Library**: [Chart.js](https://www.chartjs.org/)
-   **Other Dependencies**: (List any additional libraries or tools)

## Screenshots
Include some screenshots or GIFs demonstrating the key features of your application.
## Contributing

If you would like to contribute to this project, please follow these guidelines:

-   Fork the repository
-   Create a new branch (`git checkout -b feature/NewBranch`)
-   Commit your changes (`git commit -am 'Add some comment'`)
-   Push to the branch (`git push origin feature/NewBranch`)
-   Create a new Pull Request

## License

This project is licensed under the [MIT License]???

## UML diagrams

UML Component diagram of the project Personal Finance Tracker

![UML Component diagram of project Personal Finance Tracker.] (https://github.com/magari-GH/prometheus-CS50/blob/main/task6/personal_finance/Component%20diagram%20PFT%2023.11.23.svg)

## Difference and complexity 
The Personal Finance Tracker is a web application built to help users manage and track their personal finances effortlessly. It provides a user-friendly interface for recording income, and expenses and gaining insights into financial trends. 
The project uses Django (Python) for the backend side of the application and JavaScript for the client side. Additionally, the application uses Bootstrap (Framework) to represent frontend components and Chart.js for data visualization. The interface is adaptive and supports the correct representation on mobile devices. The project allows register an account and log in to the application. A user can manage a money account to store information about the money flow and add income and expense finance transactions. Also, the user can create their transaction category. The dynamic dashboards represent the main information about the user finance state, especially: total balance, account balances, monthly income and expenses, and average, and annual value. Financial data is visualized using charts and graphs for better insights. This project is different from previous CS50 projects and satisfies the distinctiveness and complexity requirements.
The Personal finance tracker contains the standard set of Django project files and several additional ones. The file ```models.py``` contains the models that are a source of information about data. The model contains the fields and behaviours of stored data. The file includes the models ```User, Account, Category, and Transaction```. Every model includes the ```__str__()``` method, for displaying the Objects on the Django admin site and the ```serialize()``` method for model serialization.
The file ```admin.py``` contains classes ```ModelAdmin``` that are representations of the models' ``` User, Account, Category, and Transaction``` on the admin interface and also method ``` register()``` for registration of the classes of the models.
The ```urls.py``` contains URL patterns that are a mapping between URL path expressions to each view function.
The file ```views.py``` includes a set of view functions that are functions that take a web request and return a web response. 

The directory ```templates\tracker``` contains files ```register.html, login.html, index.html, layout.html```.
The directory ```static\tracker``` contains files ```index.js``` and ```styles.css```.

