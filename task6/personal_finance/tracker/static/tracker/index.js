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
    document.querySelector('#edit_form_transaction').style.display = 'none';
    document.querySelector('#delete_form_transaction').style.display = 'none';
    document.querySelector('#form_category').style.display = 'none';
    document.querySelector('#edit_form_category').style.display = 'none';
    document.querySelector('#delete_form_category').style.display = 'none';


    get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag='all');
    document.querySelector('#transaction_container_home').innerHTML = '';
    // document.querySelector('#transaction_account_value').innerHTML = '';
    get_account();
    get_transaction_info();
    chart_income_and_expense();
};

document.querySelector('#add_transaction_button').addEventListener('click', () => add_transaction());
document.querySelector('#edit_transaction_button').addEventListener('click', () => edit_transaction_display());
document.querySelector('#delete_transaction_button').addEventListener('click', () => delete_transaction_display());
document.querySelector('#add_category_button').addEventListener('click', () => add_category());
document.querySelector('#edit_category_button').addEventListener('click', () => edit_category_display());
document.querySelector('#delete_category_button').addEventListener('click', () => delete_category_display());

function get_transaction_info() {
    // document.querySelector('#transaction_account_value').innerHTML = '';
    fetch(`/get_transaction_info`)
    .then(response => response.json())
    .then(data => {
        console.log(data)

        const monthly_income = data.monthly_income.amount__sum == null ?  "0.00" : data.monthly_income.amount__sum.toFixed(2);
        const monthly_expense = data.monthly_expense.amount__sum == null ?  "0.00" : data.monthly_expense.amount__sum.toFixed(2);
        const previous_monthly_income = data.previous_monthly_income.amount__sum == null ?  "0.00" : data.previous_monthly_income.amount__sum;
        const previous_monthly_expense = data.previous_monthly_expense.amount__sum == null ?  "0.00" : data.previous_monthly_expense.amount__sum;
        const yearly_income = data.yearly_income.amount__sum == null ?  "0.00" : data.yearly_income.amount__sum.toFixed(2);
        const yearly_expense = data.yearly_expense.amount__sum == null ?  "0.00" : data.yearly_expense.amount__sum.toFixed(2);
        const month_number = data.month_number
        const total_income = data.total_income.amount__sum
        const total_expense = data.total_expense.amount__sum
        let avarage_income = 0.00
        let avarage_expense = 0.00
        if (month_number != null) {
            if (total_income != null) {avarage_income = total_income/month_number}
            if (total_expense != null) {avarage_expense = total_expense/month_number}  
        }

        document.querySelector('#monthly_income_home').innerHTML = `${monthly_income} EUR`;
        document.querySelector('#monthly_income_incomes').innerHTML = `${monthly_income} EUR`;
        document.querySelector('#monthly_expense_home').innerHTML = `${monthly_expense} EUR`;
        document.querySelector('#monthly_expense_expenses').innerHTML = `${monthly_expense} EUR`;

        document.querySelector('#previous_monthly_income_incomes').innerHTML = `${previous_monthly_income} EUR`;
        document.querySelector('#previous_monthly_expense_expenses').innerHTML = `${previous_monthly_expense} EUR`;
       
        document.querySelector('#yearly_income_incomes').innerHTML = `${yearly_income} EUR`;
        document.querySelector('#yearly_expense_expenses').innerHTML = `${yearly_expense} EUR`;

        document.querySelector('#avarage_income_incomes').innerHTML = `${avarage_income.toFixed(2)} EUR`;
        document.querySelector('#avarage_expense_expenses').innerHTML = `${avarage_expense.toFixed(2)} EUR`;

    })  
}

function add_transaction () {
    document.querySelector('#form_transaction').style.display = 'block';
    document.querySelector('#edit_form_transaction').style.display = 'none';
    document.querySelector('#delete_form_transaction').style.display = 'none';
    document.querySelector('#form_category').style.display = 'none';
    document.querySelector('#edit_form_category').style.display = 'none';
    document.querySelector('#delete_form_category').style.display = 'none';
    get_category(type="all");
};

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
        .then(result => {console.log(result);
        })
        .catch(error => {console.log(error)})
        chart_income_and_expense();
        get_account();
        get_transaction_info();
        // get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag='all')
        return false
        
};

document.querySelector('#transaction_edit_select').addEventListener('change', () => {
    const selected_edit_transaction = document.querySelector('#transaction_edit_select').value;
    get_transaction_detail(transaction=`${selected_edit_transaction}`);
})

document.querySelector('#transaction_delete_select').addEventListener('change', () => {
    const selected_delete_transaction = document.querySelector('#transaction_delete_select').value;
    get_transaction_detail(transaction=`${selected_delete_transaction}`);
})

function get_transaction_detail(transaction) {



    if (transaction == "Select transaction") {

        document.querySelector("#transaction_edit_type").value = "Transaction";
        document.querySelector("#transaction_edit_category").value = "Category";
        document.querySelector("#transaction_edit_title").value = "";
        document.querySelector("#transaction_edit_amount").value = "";
        document.querySelector("#transaction_edit_currency").value = "Currency";
        document.querySelector("#transaction_edit_account").value = "Select account";
        document.querySelector("#transaction_edit_date").value = "";

        document.querySelector("#transaction_delete_type").value = "Transaction";
        document.querySelector("#transaction_delete_category").value = "Category";
        document.querySelector("#transaction_delete_title").value = "";
        document.querySelector("#transaction_delete_amount").value = "";
        document.querySelector("#transaction_delete_currency").value = "Currency";
        document.querySelector("#transaction_delete_account").value = "Select account";
        document.querySelector("#transaction_delete_date").value = "";
    }

    fetch(`/get_transaction_detail?selected_transaction=${transaction}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.transaction);
            console.log(transaction);

            const transaction_id = data.transaction.id;
            const transaction_user = data.transaction.user;
            const transaction_title = data.transaction.title;
            const transaction_type = data.transaction.type;
            const transaction_category = data.transaction.category;
            const transaction_amount = data.transaction.amount;
            const transaction_currency = data.transaction.currency;
            const transaction_account = data.transaction.account;
            const transaction_date = data.transaction.date;

            document.querySelector("#transaction_edit_type").value = transaction_type;
            document.querySelector("#transaction_edit_category").value = transaction_category;
            document.querySelector("#transaction_edit_title").value = transaction_title;
            document.querySelector("#transaction_edit_amount").value = transaction_amount;
            document.querySelector("#transaction_edit_currency").value = transaction_currency;
            document.querySelector("#transaction_edit_account").value = transaction_account;
            document.querySelector("#transaction_edit_date").value = transaction_date;
    
            document.querySelector("#transaction_delete_type").value = transaction_type;
            document.querySelector("#transaction_delete_category").value = transaction_category;
            document.querySelector("#transaction_delete_title").value = transaction_title;
            document.querySelector("#transaction_delete_amount").value = transaction_amount;
            document.querySelector("#transaction_delete_currency").value = transaction_currency;
            document.querySelector("#transaction_delete_account").value = transaction_account;
            document.querySelector("#transaction_delete_date").value = transaction_date;

        })
        .catch(error => {console.log(error)})
        return false
};

document.querySelector('#transaction_edit_save').addEventListener('click', () => {
    edit_transaction();
});

function edit_transaction() {
    fetch('/edit_transaction', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            selected_transaction: document.querySelector('#transaction_edit_select').value,
            type: document.querySelector('#transaction_edit_type').value,
            category: document.querySelector('#transaction_edit_category').value,
            title: document.querySelector('#transaction_edit_title').value,
            amount: document.querySelector('#transaction_edit_amount').value,
            currency: document.querySelector('#transaction_edit_currency').value,
            account: document.querySelector('#transaction_edit_account').value,
            date: document.querySelector('#transaction_edit_date').value,
        })
    })
        .then(response => response.json())
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)})

        document.querySelector('#edit_form_transaction').style.display = 'none'
        get_transactions_history(page=1, transactions_per_page=transactions_per_page, tag='all')
        // get_transaction_info();
        // get_account();
        return false
};

document.querySelector('#transaction_delete_save').addEventListener('click', () => {
    delete_transaction();

});

function delete_transaction() {
    fetch('/delete_transaction', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            selected_transaction: document.querySelector('#transaction_delete_select').value,
        })
    })
        .then(response => response.json())
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)})

        document.querySelector('#delete_form_transaction').style.display = 'none';
        get_transactions_history(page=1, transactions_per_page=transactions_per_page, tag='all')
        // get_transaction_info()
        // get_account()
        return false
};

function edit_transaction_display () {
    document.querySelector('#form_transaction').style.display = 'none';
    document.querySelector('#edit_form_transaction').style.display = 'block';
    document.querySelector('#delete_form_transaction').style.display = 'none';
    document.querySelector('#form_category').style.display = 'none';
    document.querySelector('#edit_form_category').style.display = 'none';
    document.querySelector('#delete_form_category').style.display = 'none';
    get_category(type="all");
    document.querySelector("#transaction_edit_select").value = "Select transaction";
    document.querySelector("#transaction_edit_type").value = "Transaction";
    document.querySelector("#transaction_edit_category").value = "Category";
    document.querySelector("#transaction_edit_title").value = "";
    document.querySelector("#transaction_edit_amount").value = "";
    document.querySelector("#transaction_edit_currency").value = "Currency";
    document.querySelector("#transaction_edit_account").value = "Select account";
    document.querySelector("#transaction_edit_date").value = "";

    document.querySelector("#transaction_delete_select").value = "Select transaction";
    document.querySelector("#transaction_delete_type").value = "Transaction";
    document.querySelector("#transaction_delete_category").value = "Category";
    document.querySelector("#transaction_delete_title").value = "";
    document.querySelector("#transaction_delete_amount").value = "";
    document.querySelector("#transaction_delete_currency").value = "Currency";
    document.querySelector("#transaction_delete_account").value = "Select account";
    document.querySelector("#transaction_delete_date").value = "";

};

function delete_transaction_display () {
    
    document.querySelector('#form_transaction').style.display = 'none';
    document.querySelector('#edit_form_transaction').style.display = 'none';
    document.querySelector('#delete_form_transaction').style.display = 'block';
    document.querySelector('#form_category').style.display = 'none';
    document.querySelector('#edit_form_category').style.display = 'none';
    document.querySelector('#delete_form_category').style.display = 'none';
    get_category(type="all");
    document.querySelector("#transaction_edit_select").value = "Select transaction";
    document.querySelector("#transaction_edit_type").value = "Transaction";
    document.querySelector("#transaction_edit_category").value = "Category";
    document.querySelector("#transaction_edit_title").value = "";
    document.querySelector("#transaction_edit_amount").value = "";
    document.querySelector("#transaction_edit_currency").value = "Currency";
    document.querySelector("#transaction_edit_account").value = "Select account";
    document.querySelector("#transaction_edit_date").value = "";

    document.querySelector("#transaction_delete_select").value = "Select transaction";
    document.querySelector("#transaction_delete_type").value = "Transaction";
    document.querySelector("#transaction_delete_category").value = "Category";
    document.querySelector("#transaction_delete_title").value = "";
    document.querySelector("#transaction_delete_amount").value = "";
    document.querySelector("#transaction_delete_currency").value = "Currency";
    document.querySelector("#transaction_delete_account").value = "Select account";
    document.querySelector("#transaction_delete_date").value = "";
};

function get_category_detail(category){
    if (category == "Select category") {

        document.querySelector("#category_edit_title").value = "";
        document.querySelector("#category_edit_type").value = "Choose Type";
        document.querySelector("#category_edit_color").value = "";

        document.querySelector("#category_delete_title").value = "";
        document.querySelector("#category_delete_type").value = "Choose Type";
        document.querySelector("#category_delete_color").value = "";
    }

    fetch(`/get_category_detail?selected_category=${category}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.category);
            console.log(category);

            const category_id = data.category.id;
            const category_user = data.category.user;
            const category_title = data.category.title;
            const category_type = data.category.type;
            const category_color = data.category.color;

            document.querySelector("#category_edit_title").value = category_title;
            document.querySelector("#category_edit_type").value = category_type;
            document.querySelector("#category_edit_color").value = category_color;

            document.querySelector("#category_delete_title").value = category_title;
            document.querySelector("#category_delete_type").value = category_type;
            document.querySelector("#category_delete_color").value = category_color;


        })
        .catch(error => {console.log(error)})
        return false
}

function add_category() {
    document.querySelector('#form_transaction').style.display = 'none';
    document.querySelector('#edit_form_transaction').style.display = 'none';
    document.querySelector('#delete_form_transaction').style.display = 'none';
    document.querySelector('#form_category').style.display = 'block';
    document.querySelector('#edit_form_category').style.display = 'none';
    document.querySelector('#delete_form_category').style.display = 'none';
};

function edit_category_display() {
    document.querySelector('#form_transaction').style.display = 'none';
    document.querySelector('#edit_form_transaction').style.display = 'none';
    document.querySelector('#delete_form_transaction').style.display = 'none';
    document.querySelector('#form_category').style.display = 'none';
    document.querySelector('#edit_form_category').style.display = 'block';
    document.querySelector('#delete_form_category').style.display = 'none';
    get_category(type="all")
    document.querySelector('#category_edit_select').value = "";
    document.querySelector('#category_edit_title').value = "";
    document.querySelector('#category_edit_type').value = "Choose Type";
    document.querySelector('#category_edit_color').value = "#000000";

};

function delete_category_display() {
    document.querySelector('#form_transaction').style.display = 'none';
    document.querySelector('#edit_form_transaction').style.display = 'none';
    document.querySelector('#delete_form_transaction').style.display = 'none';
    document.querySelector('#form_category').style.display = 'none';
    document.querySelector('#edit_form_category').style.display = 'none';
    document.querySelector('#delete_form_category').style.display = 'block';
    get_category(type="all")
    document.querySelector('#category_delete_select').value = "";
    document.querySelector('#category_delete_title').value = "";
    document.querySelector('#category_delete_type').value = "Choose Type";
    document.querySelector('#category_delete_color').value = "#000000";
};

document.querySelector('#transaction_save_end_exit').onclick = () => {
    create_transaction();
    chart_income_and_expense();
    document.querySelector('#transaction_type_value').value = "";
    document.querySelector('#transaction_category_value').value = "";
    document.querySelector('#transaction_title_value').value = "";
    document.querySelector('#transaction_amount_value').value = "";
    document.querySelector('#transaction_currency_value').value = "";
    document.querySelector('#transaction_account_value').value = "";
    document.querySelector('#transaction_account_value').value  = "";
    document.querySelector('#form_transaction').style.display = 'none';
    get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag='all')
    return false
};

document.querySelector('#transaction_save_end_add').addEventListener('click', () => {
    create_transaction();
    chart_income_and_expense();
    document.querySelector('#transaction_type_value').value = "";
    document.querySelector('#transaction_category_value').value = "";
    document.querySelector('#transaction_title_value').value = "";
    document.querySelector('#transaction_amount_value').value = "";
    document.querySelector('#transaction_currency_value').value = "";
    document.querySelector('#transaction_account_value').value = "";
    document.querySelector('#transaction_account_value').value  = "";
    create_transaction(tag = 'all');
    location.reload()
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

document.querySelector('#category_edit_select').addEventListener('change', () => {
    const selected_edit_category = document.querySelector('#category_edit_select').value;
    get_category_detail(category=`${selected_edit_category}`);
})

document.querySelector('#category_delete_select').addEventListener('change', () => {
    const selected_delete_category = document.querySelector('#category_delete_select').value;
    get_category_detail(category=`${selected_delete_category}`);
})

document.querySelector('#category_edit_save').addEventListener('click', () => {
    edit_category()
});

function edit_category() {
    fetch('/edit_category', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            selected_category: document.querySelector('#category_edit_select').value,
            title: document.querySelector('#category_edit_title').value,
            type: document.querySelector('#category_edit_type').value,
            color: document.querySelector('#category_edit_color').value,
        })
    })
        .then(response => response.json())
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)})
        document.querySelector('#edit_form_category').style.display = 'none';
        get_category()
        return false
};

document.querySelector('#category_delete_save').addEventListener('click', () => {
    delete_category()
});

function delete_category() {
    fetch('/delete_category', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            selected_category: document.querySelector('#category_delete_select').value,
        })
    })
        .then(response => response.json())
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)})
        document.querySelector('#delete_form_category').style.display = 'none';
        get_category()
        return false
};

document.querySelector('#transaction_type_value').addEventListener('change', () => {
    const selected_type = document.querySelector('#transaction_type_value').value;
    get_category(type=`${selected_type}`);
})

function get_category(type) {
    const options = document.querySelectorAll('.transaction_category_select')
    options.forEach(option  => {
        option.remove()
    })

    const options_edit_category = document.querySelectorAll('.category_option_edit_class')
    options_edit_category.forEach(option  => {
        option.remove()
    })

    const options_delete_category = document.querySelectorAll('.category_option_delete_class')
    options_delete_category.forEach(option  => {
        option.remove()
    })

    const options_edit_transaction = document.querySelectorAll('.category_option_transaction_edit_class')
    options_edit_transaction.forEach(option  => {
        option.remove()
    })

    const options_delete_transaction = document.querySelectorAll('.category_option_transaction_delete_class')
    options_delete_transaction.forEach(option  => {
        option.remove()
    })


    fetch(`/get_category?type=${type}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.categories);

        data.categories.forEach(category => {

            const category_id = category.id;
            const category_user = category.user;
            const category_title = category.title;
            const transaction_edit_title_option = category.title;
            const transaction_delete_title_option = category.title;
            const category_edit_title_option = category.title;
            const category_delete_title_option = category.title;
            const category_type = category.type;
            const category_color = category.color;
            const category_edit_color = category.color;
            const category_delete_color = category.color; 

            const category_option = document.createElement('option');
            category_option.innerHTML = `${category_title}`;
            category_option.style.color = `${category_color}`;
            category_option.setAttribute('class', 'transaction_category_select')
            document.querySelector('#transaction_category_value').append(category_option);

            const category_option_transaction_edit = document.createElement('option');
            category_option_transaction_edit.innerHTML = `${transaction_edit_title_option}`;
            category_option_transaction_edit.style.color = `${category_color}`;
            category_option_transaction_edit.setAttribute('class', 'category_option_transaction_edit_class')
            document.querySelector('#transaction_edit_category').append(category_option_transaction_edit);

            const category_option_transaction_delete = document.createElement('option');
            category_option_transaction_delete.innerHTML = `${transaction_delete_title_option}`;
            category_option_transaction_delete.style.color = `${category_color}`;
            category_option_transaction_delete.setAttribute('class', 'category_option_transaction_delete_class')
            document.querySelector('#transaction_delete_category').append(category_option_transaction_delete);

            const category_option_edit = document.createElement('option');
            category_option_edit.innerHTML = `${category_edit_title_option}`;
            category_option_edit.style.color = `${category_edit_color}`;
            category_option_edit.setAttribute('class', 'category_option_edit_class')
            document.querySelector('#category_edit_select').append(category_option_edit);

            const category_option_delete = document.createElement('option');
            category_option_delete.innerHTML = `${category_delete_title_option}`;
            category_option_delete.style.color = `${category_delete_color}`;
            category_option_delete.setAttribute('class', 'category_option_delete_class')
            document.querySelector('#category_delete_select').append(category_option_delete);

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
    get_transactions_history(page=1, transactions_per_page=transactions_per_page, tag='all');
    document.querySelector('#transaction_container_history').innerHTML ='';
};

document.querySelector('#next').addEventListener('click', () => {load_next(returned_page)})

function load_next(returned_page) {
  // function for loading next page
  document.querySelector('#transaction_container_history').innerHTML = '';
  get_transactions_history(page=returned_page+1, transactions_per_page=transactions_per_page, tag='all')
}

document.querySelector('#previous').addEventListener('click', () => {load_previous(returned_page)})

function load_previous(returned_page) {
  // function for loading previous page
  document.querySelector('#transaction_container_history').innerHTML = '';
  get_transactions_history(page=returned_page-1, transactions_per_page=transactions_per_page, tag='all')
}

function get_transactions_history(page, transactions_per_page, tag) {

    const options_transaction_edit = document.querySelectorAll('.transaction_option_edit_class')
    options_transaction_edit.forEach(option_transaction => {
        option_transaction.remove()
    });

    const options_transaction_delete = document.querySelectorAll('.transaction_option_delete_class')
    options_transaction_delete.forEach(option_transaction => {
        option_transaction.remove()
    });

    fetch(`/get_transactions_history?page=${page}&per_page=${transactions_per_page}&filter=${tag}`)
        .then(response => response.json())
        .then(data => {

            document.querySelector('#transaction_container_home').innerHTML = '';
            document.querySelector('#transaction_container_history').innerHTML = '';
            document.querySelector('#transaction_container_incomes').innerHTML = '';
            document.querySelector('#transaction_container_expenses').innerHTML = '';

            console.log(data.transactions);
            console.log(data.pagination);

            returned_page = data.pagination.returned_page;
            total_pages = data.pagination.total_page;
            // console.log(data.pagination.total_tranactions);
            let total_transations = data.pagination.total_transations;
            

        // if (total_transations <= transactions_per_page) {
        //     document.querySelector('#previous').style.display = 'none';
        //     document.querySelector('#next').style.display = 'none';
        //     document.querySelector('#page').style.display = 'none';
        //   }
  
          document.querySelector('#previous').disabled = false;
          if (returned_page == 1) {
            document.querySelector('#previous').disabled = true;
          }
        
          document.querySelector('#next').disabled = false;
          if (returned_page == total_pages) {
            document.querySelector('#next').disabled = true;
          }
        
          document.querySelector('#page').innerHTML = returned_page;
        if (data.transactions == 0) {
            const empty_message = "You don't have any transaction yet. Create own category and add a transaction."
            document.querySelector('#transaction_container_home').innerHTML = empty_message;
            document.querySelector('#transaction_container_history').innerHTML = empty_message;
            document.querySelector('#transaction_container_incomes').innerHTML = empty_message;
            document.querySelector('#transaction_container_expenses').innerHTML = empty_message;
        }


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
            const transaction_edit_title_option = transaction.title;
            const transaction_delete_title_option = transaction.title;

            const transaction_amount = transaction.amount;
            const transaction_currency = transaction.currency;
            const transaction_account = transaction.account.title;
            const transaction_date = transaction.date;

            const transaction_option_edit = document.createElement('option');
            transaction_option_edit.innerHTML = `${transaction_edit_title_option}`;
            transaction_option_edit.setAttribute('class', 'transaction_option_edit_class')
            document.querySelector('#transaction_edit_select').append(transaction_option_edit);

            const transaction_option_delete = document.createElement('option');
            transaction_option_delete.innerHTML = `${transaction_delete_title_option}`;
            transaction_option_delete.setAttribute('class', 'transaction_option_delete_class')
            document.querySelector('#transaction_delete_select').append(transaction_option_delete);


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
                get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag=`${transaction.category}`)
            })

            transaction_unit_history.querySelector('strong').addEventListener('click', () => {
                get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag=`${transaction.category}`)
            })

            transaction_unit_incomes.querySelector('strong').addEventListener('click', () => {
                get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag=`${transaction.category}`)
            })

            transaction_unit_expenses.querySelector('strong').addEventListener('click', () => {
                get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag=`${transaction.category}`)
            })

            transaction_unit_home.querySelector('b').addEventListener('click', () => {
                get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag=`${transaction.type}`)
            })

            transaction_unit_history.querySelector('b').addEventListener('click', () => {
                get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag=`${transaction.type}`)
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
        get_transaction_info();
        get_account();
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
    document.querySelector('#edit_form_account').style.display = 'none';
    document.querySelector('#delete_form_account').style.display = 'none';

    document.querySelector('#account_container').innerHTML = '';
    
    get_account();
    chart_account();
};

document.querySelector('#add_account_button').addEventListener('click', () => add_account());
document.querySelector('#edit_account_button').addEventListener('click', () => edit_account_display());
document.querySelector('#delete_account_button').addEventListener('click', () => delete_account_display());

function add_account() {
    document.querySelector('#form_account').style.display = 'block';
    document.querySelector('#edit_form_account').style.display = 'none';
    document.querySelector('#delete_form_account').style.display = 'none';
};

function edit_account_display() {
    document.querySelector('#form_account').style.display = 'none';
    document.querySelector('#edit_form_account').style.display = 'block';
    document.querySelector('#delete_form_account').style.display = 'none';
    get_account()
    
    document.querySelector('#account_edit_value').value =""
    document.querySelector('#edit_account_title_value').value =""
    document.querySelector('#edit_account_amount_value').value=""
    document.querySelector('#edit_account_currency_value').value="Currency"

};

function delete_account_display() {
    document.querySelector('#form_account').style.display = 'none';
    document.querySelector('#edit_form_account').style.display = 'none';
    document.querySelector('#delete_form_account').style.display = 'block';
    get_account()
    document.querySelector('#account_delete_value').value=""
    document.querySelector('#delete_account_title_value').value =""
    document.querySelector('#delete_account_amount_value').value=""
    document.querySelector('#delete_account_currency_value').value="Currency"
};

document.querySelector('#account_save_end_exit').onclick = (event) => {
    create_account();
    document.querySelector('#form_account').style.display = 'none';
    get_account();
    chart_account();
    // event.stopPropagation();
    // event.preventDefault();
    // event.stopImmediatePropagation();
    return false;
};

document.querySelector('#account_save_end_add').onclick = (event) => {
    create_account();
    get_account();
    chart_account();
    document.querySelector('#account_title_value').value = '';
    document.querySelector('#account_amount_value').value = '';
    document.querySelector('#account_currency_value').value = '';
    // event.stopPropagation();
    // event.preventDefault();
    // event.stopImmediatePropagation();
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
        document.querySelector('#account_title_value').value = '';
        document.querySelector('#account_amount_value').value = '';
        document.querySelector('#account_currency_value').value = '';
        chart_account();
        get_account();
        return false
        
};

function get_account() {

    
    fetch(`/get_account`)
        .then(response => response.json())
        .then(data => {

            const options_account = document.querySelectorAll('.transaction_account_select')
            options_account.forEach(option_account => {
                option_account.remove()
            });
            
        
            const options_account_edit = document.querySelectorAll('.account_select_edit')
            options_account_edit.forEach(option_account_edit => {
                option_account_edit.remove()
            });
        
            const options_account_delete = document.querySelectorAll('.account_select_delete')
            options_account_delete.forEach(option_account_delete => {
                option_account_delete.remove()
            });

            const options_transaction_edit = document.querySelectorAll('.account_option_transaction_edit_class')
            options_transaction_edit.forEach(option_transaction_edit => {
                option_transaction_edit.remove()
            });
        
            const options_transaction_delete = document.querySelectorAll('.account_option_transaction_delete_class')
            options_transaction_delete.forEach(option_transaction_delete => {
                option_transaction_delete.remove()
            });

            document.querySelector('#account_container').innerHTML = ""
            console.log(data.accounts);
            console.log(data.sum_total);
            console.log(data.curennsies);

            const sum_total = data.sum_total.amount__sum == null ? "0.00" : data.sum_total.amount__sum.toFixed(2);
            

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
            let title_account = account.title;
            let title_account_transaction_edit = account.title;
            let title_account_transaction_delete = account.title;
            let edit_title_account = account.title;
            let delete_title_account = account.title;
            const account_amount = account.amount.toFixed(2);
            const account_currency = account.currency;

            const card_first = document.createElement('div');
            card_first.setAttribute('class', 'col-sm-3 p-3');
            const card = document.createElement('div');
            card.setAttribute('class', 'card')
            
            const card_body = document.createElement('div');
            card_body.setAttribute('class', 'card-body');

            const card_title = document.createElement('h5');
            card_title.setAttribute('class', 'card-title');
            card_title.innerText = `${title_account}`;

            const card_text = document.createElement('p');
            card_text.setAttribute('class', 'card-text');
            card_text.innerText = `${account_amount}  ${account_currency}`;

            card_body.appendChild(card_title);
            card_body.appendChild(card_text);
            card.appendChild(card_body);
            card_first.appendChild(card);

            document.querySelector('#account_container').append(card_first);


            const account_option = document.createElement('option');
            account_option.innerHTML = `${title_account}`;
            account_option.setAttribute('class', 'transaction_account_select')
            document.querySelector('#transaction_account_value').append(account_option);

            const account_option_transaction_edit = document.createElement('option');
            account_option_transaction_edit.innerHTML = `${title_account_transaction_edit}`;
            account_option_transaction_edit.setAttribute('class', 'account_option_transaction_edit_class')
            document.querySelector('#transaction_edit_account').append(account_option_transaction_edit);

            const account_option_transaction_delete = document.createElement('option');
            account_option_transaction_delete.innerHTML = `${title_account_transaction_delete}`;
            account_option_transaction_delete.setAttribute('class', 'account_option_transaction_delete_class')
            document.querySelector('#transaction_delete_account').append(account_option_transaction_delete);
            

            const account_option_edit = document.createElement('option');
            account_option_edit.innerHTML = `${edit_title_account}`;
            account_option_edit.setAttribute('class', 'account_select_edit')
            document.querySelector('#account_edit_value').append(account_option_edit);


            const account_option_delete = document.createElement('option');
            account_option_delete.innerHTML = `${delete_title_account}`;
            account_option_delete.setAttribute('class', 'account_select_delete')
            document.querySelector('#account_delete_value').append(account_option_delete);

        })
        })
        .catch(error => {console.log(error)})
        return false
};

document.querySelector('#account_edit_value').addEventListener('change', () => {
    const selected_edit_account = document.querySelector('#account_edit_value').value;
    get_account_detail(account=`${selected_edit_account}`);
})

document.querySelector('#account_delete_value').addEventListener('change', () => {
    const selected_delete_account = document.querySelector('#account_delete_value').value;
    get_account_detail(account=`${selected_delete_account}`);
})

function get_account_detail(account){
    if (account == "Select account") {

        document.querySelector("#edit_account_title_value").value = "";
        document.querySelector("#edit_account_amount_value").value = "";
        document.querySelector("#edit_account_currency_value").value = "Currency";

        document.querySelector("#delete_account_title_value").value = "";
        document.querySelector("#delete_account_amount_value").value = "";
        document.querySelector("#delete_account_currency_value").value = "Currency";
    }

    fetch(`/get_account_detail?selected_account=${account}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.account);
            console.log(account);

            const account_id = data.account.id;
            const account_user = data.account.user;
            const account_title = data.account.title;
            const account_amount = data.account.amount;
            const account_currency = data.account.currency;

            document.querySelector("#edit_account_title_value").value = account_title;
            document.querySelector("#edit_account_amount_value").value = account_amount;
            document.querySelector("#edit_account_currency_value").value = account_currency;

            document.querySelector("#delete_account_title_value").value = account_title;
            document.querySelector("#delete_account_amount_value").value = account_amount;
            document.querySelector("#delete_account_currency_value").value = account_currency;


        })
        .catch(error => {console.log(error)})
        return false
}

document.querySelector('#account_edit_end_save').addEventListener('click', () => {
    edit_account();
    get_account();
    chart_account();
})

function edit_account() {
    fetch('/edit_account', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            selected_account: document.querySelector('#account_edit_value').value,
            title: document.querySelector('#edit_account_title_value').value,
            amount: document.querySelector('#edit_account_amount_value').value,
            currency: document.querySelector('#edit_account_currency_value').value,
        })
    })
        .then(response => response.json())
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)})
        document.querySelector('#edit_form_account').style.display = 'none';
        get_account()
        return false
};

document.querySelector('#account_delete').addEventListener('click', () => {
    delete_account();
    get_account();
    chart_account();
})

function delete_account() {
    fetch('/delete_account', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            selected_account: document.querySelector('#account_delete_value').value,
        })
    })
        .then(response => response.json())
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)})
        document.querySelector('#delete_form_account').style.display = 'none';
        get_account()
        chart_account();
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
    get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag='Income')
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
    get_transactions_history(page=page, transactions_per_page=transactions_per_page, tag='Expense')

    chart_expense();
};