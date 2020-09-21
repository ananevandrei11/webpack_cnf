let bodyClick = document.body;
bodyClick.addEventListener('click', (event) => {
  let target = event.target;
  if (target.tagName != "IMG") return;
  alert('IT IS IAMGE');
})