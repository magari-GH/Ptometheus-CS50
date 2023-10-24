document.addEventListener('DOMContentLoaded', () => {

  const base_page = 1;
  const current_user = document.querySelector('#compose-user').value;
  console.log(current_user);
  document.querySelector('#user-page').addEventListener('click', () => user_page_display(`${current_user}`, page=base_page, current_user));
  document.querySelector('#all-posts').addEventListener('click', () => all_posts_display(username = 'all', page=base_page, current_user));
  document.querySelector('#following').addEventListener('click', () => following_display(`${current_user}`, page=base_page));
  all_posts_display('all', base_page, current_user);

  
})

function user_page_display(username, page, current_user) {
  document.querySelector('#user-page-view').style.display = 'block';
  document.querySelector('#all-posts-view').style.display = 'none';
  document.querySelector('#following-view').style.display = 'none';
  document.querySelector('#user-page-view-posts').innerHTML = "";
  document.querySelector('#title_username').innerHTML = `Page of user ${username}`;


  check_follow(username);
  get_follows_following(username);
  get_publication_of_user2(username, page, current_user);
 

  document.querySelector('#follow_form').onsubmit = () => {
    add_remove_follow(username);
    return false
  }

  function check_follow(username) {
    // function for check existing the follow
    const follower = document.querySelector('#follow_form_follower').value
    const submit_follow = document.querySelector('#submit_follow')

    if (username === follower) {
      submit_follow.style.display = 'none'
    }
    else { submit_follow.style.display = 'block' }

    fetch(`/follow`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: `${username}`
      })
    })
      .then(response => response.json())
      .then(result => { console.log(result) 
      if (result.follow_exist == 1) {
        submit_follow.value = 'Unfollow'
      }
      else {
        submit_follow.value = 'Follow'
      }
      })
      .catch(error => { console.log(error) })
  }

  function add_remove_follow(username) {
    fetch(`/follow`, {
      // function for adding/removing a follow
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: `${username}`
      })
    })
      .then(response => response.json())
      .then(result => { console.log(result) 
      if (result.message == 'The follow is created successfully') {
        submit_follow.value = 'Unfollow'
      }
      else {
        submit_follow.value = 'Follow'
      }
      })
      .catch(error => { console.log(error) })
  }

  function get_follows_following(username) {
    // function for getting number of follows/following
    fetch(`/represent`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: username
      })
    })
      .then(response => response.json())
      .then(result => {
        console.log(result)
        document.querySelector('#number_follows').innerHTML = `Follows: ${result.number_follows}`
        document.querySelector('#number_following').innerHTML = `Following: ${result.number_following}`
      })
  }

  document.querySelector('#user_page_next').addEventListener('click', () => {load_next_user(username, returned_page_user)})

  function load_next_user(username, returned_page_user) {
    document.querySelector('#user-page-view-posts').innerHTML = '';
    get_publication_of_user2(username=username, page=returned_page_user+1);
  }

  document.querySelector('#user_page_previous').addEventListener('click', () => {load_previous_user(username, returned_page_user)})

  function load_previous_user(username, returned_page_user) {
    document.querySelector('#user-page-view-posts').innerHTML = '';
    get_publication_of_user2(username=username, page=returned_page_user-1);
  }

  function get_publication_of_user2(username, page, current_user) {
    // function for getting publication
    console.log(current_user);
    fetch(`/${username}?page=${page}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.publications, data.meta);

        returned_page_user = data.meta.returned_page;
        total_pages = data.meta.total_pages;

        document.querySelector('#user_page_previous').disabled = false;
        if (returned_page_user == 1) {
          document.querySelector('#user_page_previous').disabled = true;
        }
      
        document.querySelector('#user_page_next').disabled = false;
        if (returned_page_user == data.meta.total_pages) {
          document.querySelector('#user_page_next').disabled = true;
        }
      
        document.querySelector('#user_page_page').innerHTML = returned_page_user;

       data.publications.forEach(publication => {
          const element = document.createElement('div');
          element.setAttribute('class', 'card-body text-dark bg-light mb-3 rounded-top');

          element.style.border = '1px solid';
          element.style.padding = "5px";
          element.style.marginBottom = "10px";

          const publication_id = publication.id
          const publication_user = `<strong> ${publication.user} </strong> <hr>`;
          let publication_body = `${publication.body} <hr>`;
          const publication_timestamp = `<small> ${publication.timestamp} </small> <br>`;

          element.innerHTML = `${publication_user} ${publication_body} ${publication_timestamp}`;
          document.querySelector('#user-page-view-posts').append(element);

          function edit_publication() {
            //function for eding the publication
            form_compose = document.createElement('textarea');
            form_compose.setAttribute('class', 'form-control');
            form_compose.innerHTML = publication_body;
            element.appendChild(form_compose);
            const button_save = document.createElement('button');
            button_save.setAttribute('id', 'batton_save');
            button_save.setAttribute('class', 'btn btn-primary mt-2');
            button_save.innerHTML = 'Save';
            element.appendChild(button_save);

            element.querySelector('#batton_save').addEventListener('click', () => {
              save_publication();
            })

            function save_publication() {
              // function for saving edited publication on database
              fetch(`/compose`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                body: form_compose.value,
                publication_id: `${publication_id}`
              })
            })
            .then(response => response.json())
            .then(result => {
              console.log(result)
            })
            .catch(error => { console.log(error) })

            element.removeChild(form_compose);
            element.removeChild(button_save);

            publication_body = form_compose.value;
            element.innerHTML = `${publication_user} ${publication_body} ${publication_timestamp}`;
            element.appendChild(button_edit);
            element.appendChild(button_like);
            return false;

            }

          }

          const button_edit = document.createElement('button');
          if (publication.user == current_user) {
            button_edit.setAttribute('class', 'btn btn-secondary m-3');
            button_edit.innerHTML = 'Edit';
            button_edit.setAttribute('id', 'button_edit');
            element.appendChild(button_edit);

            element.querySelector('#button_edit').addEventListener('click', () => {
              edit_publication();
            })
          }

          const button_like = document.createElement('button');
          button_like.setAttribute('class', 'btn btn-secondary');
          button_like.setAttribute('class', 'button_like');
          element.appendChild(button_like);

          count_like()

          function count_like() {
            fetch(`/like`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                body: publication_id
              })
            })
            .then(response => response.json())
            .then(result => {
              console.log(result)
              like_text = `Like: ${result.number_likes}`
              button_like.innerHTML = like_text
              if (result.like_exists == 1) {
                button_like.setAttribute('class', 'btn btn-primary');
              }
              else { button_like.setAttribute('class', 'btn btn-secondary')}
            })
          }

          element.querySelector('strong').addEventListener('click', () => {
            user_page_display(username=publication.user, page=1);
          })

          element.querySelector('.button_like').addEventListener('click', () => {
            add_remove_like();
          })

          function add_remove_like() {
            fetch(`/like`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                body: `${publication.id}`
              })
            })
            .then(response => response.json())
            .then(result => {
              console.log(result)
              like_text = `Like: ${result.number_likes}`
              button_like.innerHTML = like_text
              if (result.message == 'Like is created succesfully') {
                button_like.setAttribute('class', 'btn btn-primary')
              }
              else {
                button_like.setAttribute('class', 'btn btn-secondary')
              }
            })
            .catch(error => { console.log(error) })
            return false;
          }

        })

      })
      .catch(error => {
        console.log(error);
      })
  }
}



function all_posts_display(username, page, current_user) {
  document.querySelector('#user-page-view').style.display = 'none';
  document.querySelector('#all-posts-view').style.display = 'block';
  document.querySelector('#following-view').style.display = 'none';
  document.querySelector('#all_element_view').innerHTML = "";
  get_publication_of_user1(username, page, current_user);


  document.querySelector('#compose-form').onsubmit = () => {compose_publication();
    return false;
  }
  
    
  function compose_publication() {
  // function for composing publication
    fetch('/compose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({
        body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {console.log(result)})
    .catch(error => {console.log(error)})
    document.querySelector('#compose-body').value = "";
  }
  
  document.querySelector('#next').addEventListener('click', () => {load_next(returned_page)})

  function load_next(returned_page) {
    // function for loading next page
    document.querySelector('#all_element_view').innerHTML = '';
    get_publication_of_user1(username='all', page=returned_page+1, current_user)
  }

  document.querySelector('#previous').addEventListener('click', () => {load_previous(returned_page)})

  function load_previous(returned_page) {
    // function for loading previous page
    document.querySelector('#all_element_view').innerHTML = '';
    get_publication_of_user1(username='all', page=returned_page-1, current_user)
  }


  function get_publication_of_user1(username, page, current_user) {
    // function for getting publication
    console.log(current_user);
    fetch(`/${username}?page=${page}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.publications, data.meta);

        // block to disable buttons if thre isn't next page
        returned_page = data.meta.returned_page;
        total_pages = data.meta.total_pages;

        document.querySelector('#previous').disabled = false;
        if (returned_page == 1) {
          document.querySelector('#previous').disabled = true;
        }
      
        document.querySelector('#next').disabled = false;
        if (returned_page == data.meta.total_pages) {
          document.querySelector('#next').disabled = true;
        }
      
        document.querySelector('#page').innerHTML = returned_page;

        
       data.publications.forEach(publication => {
        //function for displaying all publication from promise
          const element = document.createElement('div');
          element.setAttribute('class', 'card-body text-dark bg-light mb-3 rounded-top');

          element.style.border = '1px solid';
          element.style.padding = "5px";
          element.style.marginBottom = "10px";

          const publication_id = publication.id
          const publication_user = `<strong> ${publication.user} </strong> <hr>`;
          let publication_body = `${publication.body} <hr>`;
          const publication_timestamp = `<small> ${publication.timestamp} </small> <br>`;

          element.innerHTML = `${publication_user} ${publication_body} ${publication_timestamp}` ;
          document.querySelector('#all_element_view').append(element);

          function edit_publication() {
            //function for eding the publication
            form_compose = document.createElement('textarea');
            form_compose.setAttribute('class', 'form-control');
            form_compose.innerHTML = publication_body;
            element.appendChild(form_compose);
            const button_save = document.createElement('button');
            button_save.setAttribute('id', 'batton_save');
            button_save.setAttribute('class', 'btn btn-primary mt-2');
            button_save.innerHTML = 'Save';
            element.appendChild(button_save);

            
            element.querySelector('#batton_save').addEventListener('click', () => {
              save_publication();
            })

            function save_publication() {
              // function for saving edited publication on database
              fetch(`/compose`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                body: form_compose.value,
                publication_id: `${publication_id}`
              })
            })
            .then(response => response.json())
            .then(result => {
              console.log(result)
            })
            .catch(error => { console.log(error) })

            element.removeChild(form_compose);
            element.removeChild(button_save);

            publication_body = form_compose.value;
            element.innerHTML = `${publication_user} ${publication_body} ${publication_timestamp}`;
            element.appendChild(button_edit);
            element.appendChild(button_like);
            return false;

            }

          }

          const button_edit = document.createElement('button');
          if (publication.user == current_user) {
            button_edit.setAttribute('class', 'btn btn-secondary m-3');
            button_edit.innerHTML = 'Edit';
            button_edit.setAttribute('id', 'button_edit');
            element.appendChild(button_edit);

            element.querySelector('#button_edit').addEventListener('click', () => {
              edit_publication();
            })
          }

          const button_like = document.createElement('button');
          button_like.setAttribute('class', 'btn btn-secondary');
          button_like.setAttribute('class', 'button_like');
          element.appendChild(button_like);

          count_like()

          function count_like() {
            // function for counting the likes of publication
            fetch(`/like`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                body: publication_id
              })
            })
            .then(response => response.json())
            .then(result => {
              console.log(result)
              like_text = `Like: ${result.number_likes}`
              button_like.innerHTML = like_text
              if (result.like_exists == 1) {
                button_like.setAttribute('class', 'btn btn-primary');
              }
              else { button_like.setAttribute('class', 'btn btn-secondary'); }
            })
          }

          element.querySelector('strong').addEventListener('click', () => {
            user_page_display(username=publication.user, page=1);
          })

          element.querySelector('.button_like').addEventListener('click', () => {
            add_remove_like();
          })

          function add_remove_like() {
            // function for adding/removing the like by user
            alert(`${publication_id}`);
            fetch(`/like`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                body: `${publication.id}`
              })
            })
            .then(response => response.json())
            .then(result => {
              console.log(result)
              like_text = `Like: ${result.number_likes}`
              button_like.innerHTML = like_text
              if (result.message == 'Like is created succesfully') {
                button_like.setAttribute('class', 'btn btn-primary')
              }
              else {
                button_like.setAttribute('class', 'btn btn-secondary')
              }
            })
            .catch(error => { console.log(error) })
            return false;
          }

        })

    })
      .catch(error => {
        console.log(error);
      })
  }
}



function following_display(username, page) {
  document.querySelector('#user-page-view').style.display = 'none';
  document.querySelector('#all-posts-view').style.display = 'none';
  document.querySelector('#following-view').style.display = 'block';
  document.querySelector('#filtred_element_view').innerHTML = "";
  get_publication_of_user3(username, page)

  document.querySelector('#following_page_next').addEventListener('click', () => {load_next_following(username, following_returned_page)})

  function load_next_following(username, following_returned_page) {
    document.querySelector('#filtred_element_view').innerHTML = '';
    get_publication_of_user3(username=username, page=following_returned_page+1);
  }

  document.querySelector('#following_page_previous').addEventListener('click', () => {load_previous_following(username, following_returned_page)})

  function load_previous_following(username, following_returned_page) {
    document.querySelector('#filtred_element_view').innerHTML = '';
    get_publication_of_user3(username=username, page=following_returned_page-1);
  }

  function get_publication_of_user3(username, page) {
    // function for getting publication of following users

    fetch(`/following?page=${page}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.publications, data.meta);

        following_returned_page = data.meta.returned_page;
        total_pages = data.meta.total_pages;

        document.querySelector('#following_page_previous').disabled = false;
        if (following_returned_page == 1) {
          document.querySelector('#following_page_previous').disabled = true;
        }
      
        document.querySelector('#following_page_next').disabled = false;
        if (following_returned_page == data.meta.total_pages) {
          document.querySelector('#following_page_next').disabled = true;
        }
      
        document.querySelector('#following_page_page').innerHTML = following_returned_page;

        data.publications.forEach(publication => {
          const element = document.createElement('div');
          element.setAttribute('class', 'card-body text-dark bg-light mb-3 rounded-top');

          element.style.border = '1px solid';
          element.style.padding = "5px";
          element.style.marginBottom = "10px";

          const publication_id = publication.id
          const publication_user = `<strong> ${publication.user} </strong> <hr>`;
          const publication_body = `${publication.body} <hr>`;
          const publication_timestamp = `<small> ${publication.timestamp} </small> <br>`;

          element.innerHTML = `${publication_user} ${publication_body} ${publication_timestamp}`;
          document.querySelector('#filtred_element_view').append(element);

          if (publication.user == username) {
            const button_edit = document.createElement('button');
            button_edit.setAttribute('class', 'btn btn-secondary');
            button_edit.setAttribute('class', 'button_edit');
            button_edit.innerHTML = 'Edit';
            element.appendChild(button_edit);
          }

          const button_like = document.createElement('button');
          button_like.setAttribute('class', 'btn btn-secondary')
          button_like.setAttribute('class', 'button_like');
          element.appendChild(button_like)

          count_like()

          function count_like() {
            // function for counting likes by publication
            fetch(`/like`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                body: publication_id
              })
            })
            .then(response => response.json())
            .then(result => {
              console.log(result)
              like_text = `Like: ${result.number_likes}`
              button_like.innerHTML = like_text
              if (result.like_exists == 1) {
                button_like.setAttribute('class', 'btn btn-primary')
              }
              else { button_like.setAttribute('class', 'btn btn-secondary') }
            })
          }

          element.querySelector('strong').addEventListener('click', () => {
            user_page_display(username=publication.user, page=1);
          })

          element.querySelector('.button_like').addEventListener('click', () => {
            add_remove_like();
          })

          function add_remove_like() {
            // function for adding/removing likes
            fetch(`/like`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                body: `${publication.id}`
              })
            })
            .then(response => response.json())
            .then(result => {
              console.log(result)
              like_text = `Like: ${result.number_likes}`
              button_like.innerHTML = like_text
              if (result.message == 'Like is created succesfully') {
                button_like.setAttribute('class', 'btn btn-primary')
              }
              else {
                button_like.setAttribute('class', 'btn btn-secondary')
              }
            })
            .catch(error => { console.log(error) })
            return false;
          }

        })

      })
      .catch(error => {
        console.log(error);
      })
  }

}

