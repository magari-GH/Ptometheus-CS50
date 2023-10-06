document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('#user-page').addEventListener('click', () => user_page_display());
  document.querySelector('#all-posts').addEventListener('click', () => all_posts_display('all'));
  document.querySelector('#following').addEventListener('click', () => following_display('following'));
  all_posts_display('all');
    
    
    document.querySelector('form').onsubmit = () => {
    // const publicationUrl = '/compose';
    // const body = document.querySelector('#compose-body').value;
    // const bodyObject = { body };

    fetch('/compose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        // body: JSON.stringify( { body } )
        body: JSON.stringify( {
          body: document.querySelector('#compose-body').value
         } )
      })

    .then(response => response.json())
    .then(result => {
      console.log(result);
    })

    .catch(error => {
      console.log(error);
    });
    document.querySelector('#compose-body').value = ""; 
    return false;
  };


});

function user_page_display(tab) {
    document.querySelector('#user-page-view').style.display = 'block';
    document.querySelector('#all-posts-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#user-page-view').innerHTML = ""; 

    
    fetch(`/${tab}`)
    .then(response => response.json())
    .then(publications => {
      console.log(publications);

      publications.forEach(publication => {
        const element = document.createElement('div');
        element.setAttribute('class', 'div_publication');
        element.style.border = '1px solid';
        element.style.padding = "5px";
        element.style.marginBottom = "10px";

          const publication_user = `<strong> ${publication.user} </strong> <hr>`;          
          const publication_body = `${publication.body} <hr>`;
          const publication_timestamp = `<small> ${publication.timestamp} </small> <br>`;
          const publication_like = `Likes:${publication.like}`;

        element.innerHTML = `${publication_user} ${publication_body} ${publication_timestamp} ${publication_like}`;
        document.querySelector('#user-page-view').append(element);

      });

    })
    .catch(error => {
      console.log(error);
    });
    
};

function all_posts_display(tab) {
    document.querySelector('#user-page-view').style.display = 'none';
    document.querySelector('#all-posts-view').style.display = 'block';
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#all_element_view').innerHTML = "";

    
    fetch(`/${tab}`)
      .then(response => response.json())
      .then(publications => {
        console.log(publications);

        publications.forEach(publication => {
          const element = document.createElement('div');
          element.setAttribute('class', 'div_publication');
          element.style.border = '1px solid';
          element.style.padding = "5px";
          element.style.marginBottom = "10px";

            const publication_user = `<strong> ${publication.user} </strong> <hr>`;          
            const publication_body = `${publication.body} <hr>`;
            const publication_timestamp = `<small> ${publication.timestamp} </small> <br>`;
            const publication_like = `Likes:${publication.like}`;

          element.innerHTML = `${publication_user} ${publication_body} ${publication_timestamp} ${publication_like}`;
          document.querySelector('#all_element_view').append(element);

          element.querySelector('strong').addEventListener('click', () => {
            user_page_display(publication.user);
            // user_page_display('user5');s
          })

        });

      })
      .catch(error => {
        console.log(error);
      });


};

function following_display() {
    document.querySelector('#user-page-view').style.display = 'none';
    document.querySelector('#all-posts-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'block';   
};

