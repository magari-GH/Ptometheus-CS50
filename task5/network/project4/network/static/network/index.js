document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('#user-page').addEventListener('click', () => user_page_display());
  document.querySelector('#all-posts').addEventListener('click', () => all_posts_display());
  document.querySelector('#following').addEventListener('click', () => following_display());
  all_posts_display();
    
    
    document.querySelector('form').onsubmit = () => {
    const publicationUrl = '/compose';
    const body = document.querySelector('#compose-body').value;
    const bodyObject = { body };

    fetch(publicationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(bodyObject)
      })

    .then(response => response.json())
    .then(result => {
      console.log(result);
    })

    .catch(error => {
      console.log(error);
    });

    return false;
  };


});

function user_page_display() {
    document.querySelector('#user-page-view').style.display = 'block';
    document.querySelector('#all-posts-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'none';   
};

function all_posts_display() {
    document.querySelector('#user-page-view').style.display = 'none';
    document.querySelector('#all-posts-view').style.display = 'block';
    document.querySelector('#following-view').style.display = 'none';   
};

function following_display() {
    document.querySelector('#user-page-view').style.display = 'none';
    document.querySelector('#all-posts-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'block';   
};