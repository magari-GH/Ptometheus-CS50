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
    get_transactions_history();
    document.querySelector('#transaction_container_home').innerHTML = '';
};

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
            date: document.querySelector('#transaction_account_value').value,
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
    get_transactions_history();
    document.querySelector('#transaction_container_history').innerHTML ='';
};

function get_transactions_history() {
    fetch(`/get_transactions_history?page=1&per_page=3`)
        .then(response => response.json())
        .then(data => {
            console.log(data.transactions);
            console.log(data.pagination);
        data.transactions.forEach(transaction => {
            const transaction_unit_home = document.createElement('p');
            const transaction_unit_history = document.createElement('p');
            const transaction_id = transaction.id;
            const transaction_user = transaction.user;
            const transaction_type = transaction.type == 'Income' ? `${transaction.type.fontcolor('green')}` :  `${transaction.type.fontcolor('red')}`;
            const transaction_category = transaction.category;
            const transaction_title = transaction.title;
            const transaction_amount = transaction.amount;
            const transaction_currency = transaction.currency;
            const transaction_date = transaction.date;

            transaction_unit_home.innerHTML = `${transaction_type}  Category: ${transaction_category}  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency}  ${transaction_date}`;
            transaction_unit_history.innerHTML = `${transaction_type}  Category: ${transaction_category}  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency}  ${transaction_date}`;
            document.querySelector('#transaction_container_home').append(transaction_unit_home);
            document.querySelector('#transaction_container_history').append(transaction_unit_history);
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
            // card_title.innerText = `${account_title}`;

            const card_text = document.createElement('p');
            card_text.setAttribute('class', 'card-text');
            card_text.innerText = `${sum_total}`;

            card_body.appendChild(card_title);
            card_body.appendChild(card_text);
            card.appendChild(card_body);
            card_first.appendChild(card);

            document.querySelector('#account_container').append(card_first);

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
};

function expenses_display() {
    document.querySelector('#home').style.display = 'none';
    document.querySelector('#history').style.display = 'none';
    document.querySelector('#accounts').style.display = 'none';
    document.querySelector('#incomes').style.display = 'none';
    document.querySelector('#expenses').style.display = 'block';
    document.querySelector('#setting').style.display = 'none';
};