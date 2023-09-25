document.addEventListener('DOMContentLoaded', function () {
  
  // send message
  document.querySelector('form').onsubmit = () => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
      .then(response => response.json())
      .then(result => {
        // Вивести результат в консоль
        console.log(result);
        load_mailbox('sent');
      });
      return false;
      
  };
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('index');
});

function compose_email(element_sender, element_subgect, element_timestamp, element_body) {

  // Show compose view and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  
  document.querySelector('#compose-subject').value = element_subgect.includes('Re:') ? element_subgect : `Re: ${element_subgect}`;
  document.querySelector('#compose-recipients').value = `${element_sender}`;
  document.querySelector('#compose-body').value = `On ${element_timestamp} ${element_sender} wrote:\n"${element_body}"\n`;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show messages
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      
      console.log(emails);
      
      emails.forEach(email => {
        const element = document.createElement('div');
        element.setAttribute('class', 'div_message');
        element.style.border = "1px solid";
        element.style.padding = "5px";
        element.style.backgroundColor = email.read ? "lightgray" : "white";
        const id = email.id;
        const sender = email.sender;
        const recipients = email.recipients; 
        const subject = email.subject;
        const body = email.body;
        const timestamp = email.timestamp;
        const read = email.read;
        const archived = email.archived;
        const btext = email.archived ? "from archive" : "to archive";
        element.innerHTML = ` ${id} ${sender} ${recipients} ${subject} ${body} ${timestamp} ${read} ${archived} <button class='archive'> ${btext} </button>`;
        
        // buttom to archive
        element.querySelector('.archive').addEventListener('click', event => {
          const some = event.target
          if (some.className === 'archive') {
            fetch(`/emails/${id}`, {
              method: 'PUT',
              body: JSON.stringify({
                archived: email.archived ? false : true
              })
            })
          }
          event.stopImmediatePropagation() 
          load_mailbox(`inbox`)
        });

        
        element.addEventListener('click', (event) => {

          // function for mark as readed
          fetch(`/emails/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              read: true
            })
          })
        
        
        document.querySelector('#email-view').style.display = 'block';
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#email-view').innerHTML = ' ';

          // function for current email representation
          fetch(`/emails/${id}`)
            .then(response => response.json())
            .then(email => {
              
              console.log(email);
              
              const element_sender = document.createElement('div');
              element_sender.innerHTML = `<b>From: </b> ${email.sender}`;
              const element_recipients = document.createElement('div');
              element_recipients.innerHTML = `<b>To: </b> ${email.recipients}`
              const element_subgect = document.createElement('div');
              element_subgect.innerHTML = `<b>Subject: </b> ${email.subject}`;
              const element_timestamp = document.createElement('div');
              element_timestamp.innerHTML = `<b>Timestamp: </b>: ${email.timestamp} <hr>`;
              const element_body = document.createElement('div');
              element_body.innerHTML = email.body;
              const button_reply = document.createElement('button');
              button_reply.textContent = 'Reply';
              button_reply.setAttribute('class', 'button_reply');
              document.querySelector('#email-view').append(element_sender, element_recipients, element_subgect, element_timestamp, element_body, button_reply);
              event.stopPropagation()

              button_reply.addEventListener('click', (event) => {
              compose_email(email.sender, email.subject, email.timestamp, email.body);
                // element.querySelector('.button_reply').addEventListener('click', compose_email(email.sender, email.subject, email.timestamp, email.body));
                // element.querySelector('.button_reply').onclick = compose_email(email.sender, email.subject, email.timestamp, email.body);
                // button_reply.onclick.target = compose_email(email.sender, email.subject, email.timestamp, email.body);
              });
            });
            
          });
          
        document.querySelector('#emails-view').append(element);
      });

    });


  };