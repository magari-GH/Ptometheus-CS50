# Personal Finance Tracker


## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Future Features](#future-features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Application Architecture](#application-architecture)
- [Project structure](#project-structure)
- [Difference and complexity]( #difference-and-complexity)


## Introduction


Personal Finance Tracker is a powerful web application designed to assist users in efficiently managing their finances. It offers a user-friendly interface for tracking income and expenses while providing insightful visualizations through charts and graphs.


## Features


- **User Authentication**: Securely manage personal finances by registering an account and logging in.
- **User-friendly Interface**: Intuitive design simplifying financial tracking.
- **Dashboard Overview**: Instant insights into financial status, including current balance, income, and expenses.
- **Transaction Management**: Add financial accounts and transactions with details like date, amount, and category.
- **Data Visualization**: Visualize your financial data using charts and graphs for better insights.
- **Transaction Filtering**: Easily filter transactions by type and category.
- **Dynamic Interface**: Dynamically updating user interface elements using asynchronous JavaScript.
- **Adaptive Interface**: The user interface is adopted across various devices.


## Future Features


-  **Transaction Management**: Edit and delete financial transactions with details like date, amount, and category.
-  **Budget Tracking**: Set budgets for different expense categories and receive alerts when approaching or exceeding limits.
-  **User Profile**: Personalize your account settings and preferences.
-  **Data Export**: Export your financial data for backup or analysis in various formats, such as CSV.


## Prerequisites


- [Python](https://www.python.org/) 3.12.0 or newer
- [Django](https://www.djangoproject.com/) 4.2 or newer


## Installation


1. **Clone the repository**:


2. **Navigate to the project directory**:
    ```sh
    cd personal_finance
    ```
3. **Make data migrations**:
    ```sh
    python manage.py makemigrations
    python manage.py migrate
    ```
4. **Run the application**:
    ```sh
    python manage.py runserver
    ```
5. **Access the application** at `http://localhost:8000` in your web browser.


## Technologies Used


-   **Backend**: Django (Python)
-   **Frontend**: JavaScript, HTML, CSS, [Bootstrap (Framework)](https://getbootstrap.com/)
-   **Database**: SQLite
-   **Charting Library**: [Chart.js](https://www.chartjs.org/)


## License


This project is licensed under the MIT License


## Application Architecture


![UML Component diagram of project Personal Finance Tracker.](https://github.com/magari-GH/prometheus-CS50/blob/main/task6/personal_finance/diagrams/component_diagram_PFT.svg?raw=true)


## Project structure


![Tree table file structure of the project Personal Finance Tracker](https://github.com/magari-GH/prometheus-CS50/blob/main/task6/personal_finance/diagrams/tree_table_wireframe_PFT.svg?raw=true)


## Difference and complexity
Personal Finance Tracker is my final project for the "CS50 Web Programming with Python and JavaScript" course, showcasing advanced skills and a strong application structure. This chapter outlines the standout features, emphasizing what makes this project different and more advanced than previous ones.


### User-Friendly Design
Unlike earlier projects, the Personal Finance Tracker has a user-friendly design. Navigating financial information is now more straightforward, making it easier for users to manage their money. The design aims to simplify things and create a positive user experience.
### Live Dashboard Updates
The dashboard provides real-time insights into your money matters. It instantly shows your current balance, income, and expenses. This  feature sets the project apart, making it more dynamic and user-friendly
### Device-Adaptive Interface
The Personal Finance Tracker doesn't limit itself to a single device. Its interface is adaptive, ensuring a seamless user experience across various devices. Whether accessed from a computer, tablet, or smartphone, users can manage their finances with ease.
### Better Transaction Management
This project allows users not only to add transactions but also to create, modify and delete financial accounts and create custom categories. This gives more control over financial data, making the application more interactive.


### Real-Time Updates
The utilization of asynchronous mechanisms brings a new level of interaction. Changes to transactions and accounts are immediately visible to users.


### Financial Data Representation with Chart.js
The project leverages Chart.js for visually representing financial data. Charts provide users with a clearer understanding of their financial status. This integration enhances the project's analytical capabilities.


The Personal Finance Tracker is a result of improved skills, technological enhancements, and a focus on user needs.  

