document.addEventListener('DOMContentLoaded', () => {

    page = 1;
    transactions_per_page = 5;

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
    document.querySelector('#form_category').style.display = 'none';

    document.querySelector('#add_transaction_button').addEventListener('click', () => add_transaction());
    document.querySelector('#add_category_button').addEventListener('click', () => add_category());

    get_transactions_history(tag = 'all');

    document.querySelector('#transaction_container_home').innerHTML = '';
    document.querySelector('#transaction_account_value').innerHTML = '';
    get_account();
    get_transaction_info();

};

function get_transaction_info() {
    document.querySelector('#transaction_account_value').innerHTML = '';
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
    document.querySelector('#form_category').style.display = 'none';
    get_category(type="all");
};

function add_category() {
    document.querySelector('#form_category').style.display = 'block';
    document.querySelector('#form_transaction').style.display = 'none';
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

document.querySelector('#category_save_end_exit').onclick = () => {
    create_category();
    document.querySelector('#category_title_value').value = "";
    document.querySelector('#category_type_value').value = "";
    document.querySelector('#category_color_value').value = "#000000";
    document.querySelector('#form_category').style.display = 'none';
    return false
};

document.querySelector('#category_save_end_add').addEventListener('click', () => {
    create_category();
    document.querySelector('#category_title_value').value = "";
    document.querySelector('#category_type_value').value = "";
    document.querySelector('#category_color_value').value = "#000000";
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
        // call function for reload the history of transactions
        get_transactions_history(tag = 'all');
        get_account();
        get_transaction_info();
        return false
        
};

function create_category() {
    fetch('/create_category', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: document.querySelector('#category_title_value').value,
            type: document.querySelector('#category_type_value').value,
            color: document.querySelector('#category_color_value').value,
        })
    })
        .then(response => response.json())
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)})
        // call function for reload the history of transactions

        // create function to refresh list of category
        return false
        
};
document.querySelector('#transaction_type_value').addEventListener('change', () => {
    const selected_type = document.querySelector('#transaction_type_value').value;
    get_category(type=`${selected_type}`);
})

function get_category(type) {
    const options = document.querySelectorAll('.transaction_category_select')
    options.forEach(option  => {
        option.remove()})

    fetch(`/get_category?type=${type}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.categories);

        data.categories.forEach(category => {

            const category_id = category.id;
            const category_user = category.user;
            const category_title = category.title;
            const category_type = category.type;
            const category_color = category.color;

            const category_option = document.createElement('option');
            category_option.innerHTML = `${category_title}`;
            category_option.style.color = `${category_color}`;
            category_option.setAttribute('class', 'transaction_category_select')
            document.querySelector('#transaction_category_value').append(category_option);

        })
        })
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



document.querySelector('#next').addEventListener('click', () => {load_next(returned_page)})

function load_next(returned_page) {
  // function for loading next page
  document.querySelector('#transaction_container_history').innerHTML = '';
  get_transactions_history(page=returned_page+1)
}

document.querySelector('#previous').addEventListener('click', () => {load_previous(returned_page)})

function load_previous(returned_page) {
  // function for loading previous page
  document.querySelector('#transaction_container_history').innerHTML = '';
  get_transactions_history(page=returned_page-1)
}



function get_transactions_history(tag) {
    document.querySelector('#transaction_container_home').innerHTML = '';
    document.querySelector('#transaction_container_history').innerHTML = '';
    document.querySelector('#transaction_container_incomes').innerHTML = '';
    document.querySelector('#transaction_container_expenses').innerHTML = '';


    fetch(`/get_transactions_history?page=${page}&per_page=${transactions_per_page}&filter=${tag}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.transactions);
            console.log(data.pagination);

            returned_page = data.pagination.returned_page;
            toal_pages = data.pagination.total_pages;
            const total_tranactions = data.pagination.total_transations;

            
        if (total_tranactions < transactions_per_page ) {
            document.querySelector('#previous').style.display = 'none';
            document.querySelector('#next').style.display = 'none';
            document.querySelector('#page').style.display = 'none';
          }
  
          document.querySelector('#previous').disabled = false;
          if (returned_page == 1) {
            document.querySelector('#previous').disabled = true;
          }
        
          document.querySelector('#next').disabled = false;
          if (returned_page == data.pagination.total_pages) {
            document.querySelector('#next').disabled = true;
          }
        
          document.querySelector('#page').innerHTML = returned_page;


        data.transactions.forEach(transaction => {
            const transaction_unit_home = document.createElement('p');
            const transaction_unit_history = document.createElement('p');
            const transaction_unit_incomes = document.createElement('p');
            const transaction_unit_expenses = document.createElement('p');
            const transaction_id = transaction.id;
            const transaction_user = transaction.user;
            const transaction_type = transaction.type == 'Income' ? `${transaction.type.fontcolor('green')}` :  `${transaction.type.fontcolor('red')}`;
            const transaction_category = transaction.category.fontcolor(`${transaction.color}`);
            // const transaction_category = `<strong> ${transaction.category}</strong>`;
            const transaction_title = transaction.title;
            const transaction_amount = transaction.amount;
            const transaction_currency = transaction.currency;
            const transaction_account = transaction.account;
            const transaction_date = transaction.date;
            // transaction_unit_home.innerHTML = `${transaction_type}  Category: ${transaction_category}  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency} ${transaction_date}`;

            transaction_unit_home.innerHTML = `<b> ${transaction_type} </b>  Category: <strong> ${transaction_category} </strong>  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency} ${transaction_date}`;
            transaction_unit_history.innerHTML = `<b> ${transaction_type} </b>  Category: <strong> ${transaction_category} </strong>  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency} ${transaction_date}`;
            transaction_unit_incomes.innerHTML = `<b> ${transaction_type} </b> Category: <strong> ${transaction_category} </strong>  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency} ${transaction_date}`;
            transaction_unit_expenses.innerHTML = `<b> ${transaction_type} </b> Category: <strong> ${transaction_category} </strong>  Title: ${transaction_title}  ${transaction_amount}  ${transaction_currency} ${transaction_date}`;
            
            document.querySelector('#transaction_container_home').append(transaction_unit_home);
            document.querySelector('#transaction_container_history').append(transaction_unit_history);
            document.querySelector('#transaction_container_incomes').append(transaction_unit_incomes);      
            document.querySelector('#transaction_container_expenses').append(transaction_unit_expenses);

            transaction_unit_home.querySelector('strong').addEventListener('click', () => {
                get_transactions_history(tag=`${transaction.category}`)
            })

            transaction_unit_history.querySelector('strong').addEventListener('click', () => {
                get_transactions_history(tag=`${transaction.category}`)
            })

            transaction_unit_incomes.querySelector('strong').addEventListener('click', () => {
                get_transactions_history(tag=`${transaction.category}`)
            })

            transaction_unit_expenses.querySelector('strong').addEventListener('click', () => {
                get_transactions_history(tag=`${transaction.category}`)
            })

            transaction_unit_home.querySelector('b').addEventListener('click', () => {
                get_transactions_history(tag=`${transaction.type}`)
            })

            transaction_unit_history.querySelector('b').addEventListener('click', () => {
                get_transactions_history(tag=`${transaction.type}`)
            })

            // transaction_unit_incomes.querySelector('b').addEventListener('click', () => {
            //     get_transactions_history(tag=`${transaction.type}`)
            // })

            // transaction_unit_expenses.querySelector('b').addEventListener('click', () => {
            //     get_transactions_history(tag=`${transaction.type}`)
            // })

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
    chart_account();
    
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
    document.querySelector('#account_container').innerHTML = '';
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
        get_account();
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
    get_transactions_history(tag='Income');

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
    get_transactions_history(tag='Expense');

    chart_expense();
};