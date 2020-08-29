const menu = document.querySelector('.header .menu');
const toggle = document.querySelector('.header .button');
const open = document.querySelector('.fa-bars');
const close = document.querySelector('.fa-times');

const onClickToggle = () => {
  let menuDisplay = menu.style.display;

  menu.style.display = menuDisplay === 'none' || menuDisplay === '' ? 'flex' : 'none';
  open.classList.toggle('ds-no');
  close.classList.toggle('ds-no');  
};

(() => {
  toggle.addEventListener('click', onClickToggle);
})();
