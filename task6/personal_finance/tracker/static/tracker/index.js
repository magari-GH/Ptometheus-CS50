document.addEventListener('DOMContentLoaded', () => {

    home_display();
    document.querySelector('#home_button').addEventListener('click', () => home_display());
    document.querySelector('#history_button').addEventListener('click', () => history_display());
    document.querySelector('#setting_button').addEventListener('click', () => setting_display());
    document.querySelector('#accounts_button').addEventListener('click', () => accounts_display());
    document.querySelector('#incomes_button').addEventListener('click', () => incomes_display());
    document.querySelector('#expenses_button').addEventListener('click', () => expenses_display());
})

function home_display() {
    
    document.querySelector('#home').style.display = 'block';
    document.querySelector('#history').style.display = 'none';
    document.querySelector('#accounts').style.display = 'none';
    document.querySelector('#incomes').style.display = 'none';
    document.querySelector('#expenses').style.display = 'none';
    document.querySelector('#setting').style.display = 'none';
    document.querySelector('#form_transaction').style.display = 'none';
    document.querySelector('#add_transaction_button').addEventListener('click', () => add_transaction());
    get_transactions_history(tag = 'all');
    document.querySelector('#transaction_container_home').innerHTML = '';
    document.querySelector('#transaction_account_value').innerHTML = '';
    get_account();
    get_transaction_info();

};

function get_transaction_info() {
    fetch(`/get_transaction_info`)
    .then(response => response.json())
    .then(data => {
        console.log(data.monthly_income);
        console.log(data.monthly_expense);
        console.log(data.previous_monthly_income);
        console.log(data.previous_monthly_expense);
        console.log(data.yearly_income);
        console.log(data.yearly_expense);
        console.log(data.avarage_income);
        console.log(data.avarage_expense);

        const monthly_income = data.monthly_income.amount__sum;
        const monthly_expense = data.monthly_expense.amount__sum;
        const previous_monthly_income = data.previous_monthly_income.amount__sum;
        const previous_monthly_expense = data.previous_monthly_expense.amount__sum;
        const yearly_income = data.yearly_income.amount__sum;
        const yearly_expense = data.yearly_expense.amount__sum;
        const avarage_income = data.avarage_income;
        const avarage_expense = data.avarage_expense

        document.querySelector('#monthly_income_home').innerHTML = `${monthly_income} EUR`;
        document.querySelector('#monthly_income_incomes').innerHTML = `${monthly_income} EUR`;
        document.querySelector('#monthly_expense_home').innerHTML = `${monthly_expense} EUR`;
        document.querySelector('#monthly_expense_expenses').innerHTML = `${monthly_expense} EUR`;

        document.querySelector('#previous_monthly_income_incomes').innerHTML = `${previous_monthly_income} EUR`;
        document.querySelector('#previous_monthly_expense_expenses').innerHTML = `${previous_monthly_expense} EUR`;
       
        document.querySelector('#yearly_income_incomes').innerHTML = `${yearly_income} EUR`;
        document.querySelector('#yearly_expense_expenses').innerHTML = `${yearly_expense} EUR`;

        document.querySelector('#avarage_income_incomes').innerHTML = `${avarage_income} EUR`;
        document.querySelector('#avarage_expense_expenses').innerHTML = `${avarage_expense} EUR`;

    })  
}

function add_transaction () {
    document.querySelector('#form_transaction').style.display = 'block';
};

document.querySelector('#transaction_save_end_exit').onclick = () => {
    create_transaction();
    document.querySelector('#transaction_type_value').value = "";
    document.querySelector('#transaction_category_value').value = "";
    document.querySelector('#transaction_title_value').value = "";
    document.querySelector('#transaction_amount_value').value = "";
    document.querySelector('#transaction_currency_value').value = "";
    document.querySelector('#transaction_account_value').value = "";
    document.querySelector('#transaction_account_value').value  = "";
    document.querySelector('#form_transaction').style.display = 'none';
    return false
};

document.querySelector('#transaction_save_end_add').addEventListener('click', () => {
    create_transaction();
    document.querySelector('#transaction_type_value').value = "";
    document.querySelector('#transaction_category_value').value = "";
    document.querySelector('#transaction_title_value').value = "";
    document.querySelector('#transaction_amount_value').value = "";
    document.querySelector('#transaction_currency_value').value = "";
    document.querySelector('#transaction_account_value').value = "";
    document.querySelector('#transaction_account_value').value  = "";
    return false
});

function create_transaction() {
    fetch('/create_transaction', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            type: document.querySelector('#transaction_type_value').value,
            category: document.querySelector('#transaction_category_value').value,
            title: document.querySelector('#transaction_title_value').value,
            amount: document.querySelector('#transaction_amount_value').value,
            currency: document.querySelector('#transaction_currency_value').value,
            account: document.querySelector('#transaction_account_value').value,
            // date: document.querySelector('input[type="datetime-local"]').value,
            date: document.querySelector('#transaction_date_value').value,
        })
    })
        .then(response => response.json())
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)})
        return false
};


function history_display() {
    document.querySelector('#home').style.display = 'none';
    document.querySelector('#history').style.display = 'block';
    document.querySelector('#accounts').style.display = 'none';
    document.querySelector('#incomes').style.display = 'none';
    document.querySelector('#expenses').style.display = 'none';
    document.querySelector('#setting').style.display = 'none';
    get_transactions_history(tag = 'all');
    document.querySelector('#transaction_container_history').innerHTML ='';
};


function get_transactions_history(tag) {
    fetch(`/get_transactions_history?page=1&per_page=10&filter=${tag}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.transactions);
            console.log(data.pagination);
        data.transactions.forEach(transaction => {
            const transaction_unit_home = document.createElement('p');
            const transaction_unit_history = document.createElement('p');
            const transaction_unit_incomes = document.createElement('p');
            const transaction_unit_expenses = document.createElement('p');
            const transaction_id = transaction.id;
            const transaction_user = transaction.user;
            const transaction_type = transaction.type == 'Income' ? `${transaction.type.fontcolor('green')}` :  `${transaction.type.fontcolor('red')}`;
            // const transaction_category = transaction.category == 'Housing' ? `${transaction.category.fontcolor('green')}` :  `${transaction.category.fontcolor('red')}`;
            var transaction_category;
            if (transaction.category=='Housing') {transaction_category = transaction.category.fontcolor('Aqua')}
            else if (transaction.category=='Food') {transaction_category = transaction.category.fontcolor('Aquamarine')}
            else if (transaction.category=='Fun') {transaction_category = transaction.category.fontcolor('Blue')}
            else if (transaction.category=='Child expenses') {transaction_category = transaction.category.fontcolor('BlueViolet')}
            else if (transaction.category=='Insurance') {transaction_category = transaction.category.fontcolor('Brown')}
            else if (transaction.category=='Healthcare') {transaction_category = transaction.category.fontcolor('CadetBlue')}
            else if (transaction.category=='Utilities') {transaction_category = transaction.category.fontcolor('Chartreuse')}
            else if (transaction.category=='Personal Care') {transaction_category = transaction.category.fontcolor('Chocolate')}
            else if (transaction.category=='Taxes') {transaction_category = transaction.category.fontcolor('Coral')}
            else if (transaction.category=='Transportation') {transaction_category = transaction.category.fontcolor('CornflowerBlue')}
            else if (transaction.category=='Gifts') {transaction_category = transaction.category.fontcolor('Crimson')}
            else if (transaction.category=='Education') {transaction_category = transaction.category.fontcolor('Cyan')}
            else if (transaction.category=='Income') {transaction_category = transaction.category.fontcolor('DarkGoldenRod')}
            else if (transaction.category=='Giving') {transaction_category = transaction.category.fontcolor('DarkGreen')}
            else if (transaction.category=='Home Supplies') {transaction_category = transaction.category.fontcolor('DarkOliveGreen')}
            else if (transaction.category=='Consumer Debt') {transaction_category = transaction.category.fontcolor('DarkRed')}
            else if (transaction.category=='Clothing') {transaction_category = transaction.category.fontcolor('DarkOrange')}
            else if (transaction.category=='Savings') {transaction_category = transaction.category.fontcolor('DeepPink')}
            else if (transaction.category=='Miscellaneous') {transaction_category = transaction.category.fontcolor('Fuchsia')}
            else if (transaction.category=='Pets') {transaction_category = transaction.category.fontcolor('GreenYellow')}
            else if (transaction.category=='Services') {transaction_category = transaction.category.fontcolor('IndianRed')}
            else if (transaction.category=='Memberships') {transaction_category = transaction.category.fontcolor('Maroon')}

           

            const transaction_title = transaction.title;
            const transaction_amount = transaction.amount;
            const transaction_currency = transaction.currency;
            const transaction_account = transaction.account;
            const transaction_date = transaction.date;

            transaction_unit_home.innerHTML = `${transaction_type}  Category: ${transaction_category}  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency} ${transaction_date}`;
            transaction_unit_history.innerHTML = `${transaction_type}  Category: ${transaction_category}  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency} ${transaction_date}`;
            transaction_unit_incomes.innerHTML = `${transaction_type}  Category: ${transaction_category}  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency} ${transaction_date}`;
            transaction_unit_expenses.innerHTML = `${transaction_type}  Category: ${transaction_category}  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency} ${transaction_date}`;
            document.querySelector('#transaction_container_home').append(transaction_unit_home);
            document.querySelector('#transaction_container_history').append(transaction_unit_history);
            document.querySelector('#transaction_container_incomes').append(transaction_unit_incomes);
            document.querySelector('#transaction_container_expenses').append(transaction_unit_expenses);
        })
        })
        .catch(error => {console.log(error)})
        return false
};


function accounts_display() {
    document.querySelector('#home').style.display = 'none';
    document.querySelector('#history').style.display = 'none';
    document.querySelector('#accounts').style.display = 'block';
    document.querySelector('#incomes').style.display = 'none';
    document.querySelector('#expenses').style.display = 'none';
    document.querySelector('#setting').style.display = 'none';
    document.querySelector('#form_account').style.display = 'none';
    document.querySelector('#account_container').innerHTML = '';
    document.querySelector('#add_account_button').addEventListener('click', () => add_account());
    get_account();
    
};

function add_account() {
    document.querySelector('#form_account').style.display = 'block';
};

document.querySelector('#account_save_end_exit').onclick = (event) => {
    create_account();
    document.querySelector('#form_account').style.display = 'none';
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
};

document.querySelector('#account_save_end_add').onclick = (event) => {
    create_account();
    document.querySelector('#account_title_value').value = '';
    document.querySelector('#account_amount_value').value = '';
    document.querySelector('#account_currency_value').value = '';
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
};


function create_account() {
    fetch('/create_account', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: document.querySelector('#account_title_value').value,
            amount: document.querySelector('#account_amount_value').value,
            currency: document.querySelector('#account_currency_value').value,
        })
    })
        .then(response => response.json())
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)})
        return false
};


function get_account() {
    fetch(`/get_account`)
        .then(response => response.json())
        .then(data => {
            console.log(data.accounts);
            console.log(data.sum_total);
            console.log(data.curennsies);

            const sum_total = data.sum_total.amount__sum;

            const card_first = document.createElement('div');
            card_first.setAttribute('class', 'col-sm-3 p-3');
            const card = document.createElement('div');
            card.setAttribute('class', 'card')
            
            const card_body = document.createElement('div');
            card_body.setAttribute('class', 'card-body');

            const card_title = document.createElement('h5');
            card_title.setAttribute('class', 'card-title');
            card_title.innerText = "Balance:";

            const card_text = document.createElement('p');
            card_text.setAttribute('class', 'card-text');
            card_text.innerText = `${sum_total} EUR`;

            card_body.appendChild(card_title);
            card_body.appendChild(card_text);
            card.appendChild(card_body);
            card_first.appendChild(card);

            document.querySelector('#account_container').append(card_first);
            document.querySelector('#balance_home').innerText = `${sum_total} EUR`;

        data.accounts.forEach(account => {

            const account_id = account.id;
            const account_user = account.user;
            const account_title = account.title;
            const account_amount = account.amount;
            const account_currency = account.currency;

            const card_first = document.createElement('div');
            card_first.setAttribute('class', 'col-sm-3 p-3');
            const card = document.createElement('div');
            card.setAttribute('class', 'card')
            
            const card_body = document.createElement('div');
            card_body.setAttribute('class', 'card-body');

            const card_title = document.createElement('h5');
            card_title.setAttribute('class', 'card-title');
            card_title.innerText = `${account_title}`;

            const card_text = document.createElement('p');
            card_text.setAttribute('class', 'card-text');
            card_text.innerText = `${account_amount}  ${account_currency}`;

            card_body.appendChild(card_title);
            card_body.appendChild(card_text);
            card.appendChild(card_body);
            card_first.appendChild(card);

            document.querySelector('#account_container').append(card_first);

            const account_option = document.createElement('option');
            account_option.innerHTML = `${account_title}`;
            document.querySelector('#transaction_account_value').append(account_option);

        })
        })
        .catch(error => {console.log(error)})
        return false
};

function setting_display() {
    document.querySelector('#home').style.display = 'none';
    document.querySelector('#history').style.display = 'none';
    document.querySelector('#accounts').style.display = 'none';
    document.querySelector('#incomes').style.display = 'none';
    document.querySelector('#expenses').style.display = 'none';
    document.querySelector('#setting').style.display = 'block';
};

function incomes_display() {
    document.querySelector('#home').style.display = 'none';
    document.querySelector('#history').style.display = 'none';
    document.querySelector('#accounts').style.display = 'none';
    document.querySelector('#incomes').style.display = 'block';
    document.querySelector('#expenses').style.display = 'none';
    document.querySelector('#setting').style.display = 'none';
    document.querySelector('#transaction_container_incomes').innerHTML = '';
    get_transactions_history(tag='income');
    chart_income();
};



function expenses_display() {
    document.querySelector('#home').style.display = 'none';
    document.querySelector('#history').style.display = 'none';
    document.querySelector('#accounts').style.display = 'none';
    document.querySelector('#incomes').style.display = 'none';
    document.querySelector('#expenses').style.display = 'block';
    document.querySelector('#setting').style.display = 'none';
    document.querySelector('#transaction_container_expenses').innerHTML = '';
    get_transactions_history(tag='expense');
    chart_expense();
};