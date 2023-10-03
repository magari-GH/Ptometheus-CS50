document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#user-page').addEventListener('click', () => user_page_display());
    document.querySelector('#all-posts').addEventListener('click', () => all_posts_display());
    document.querySelector('#following').addEventListener('click', () => following_display());
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