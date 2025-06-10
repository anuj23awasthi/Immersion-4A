const addBtn = document.getElementById('addBtn');
const progressBar = document.getElementById('progressBar');

let progress = 0; // current progress value

addBtn.addEventListener('click', () => {
  if (progress < 100) {
    progress += 10; // increase by 10% on each click
    if (progress > 100) progress = 100;
    progressBar.style.width = progress + '%';
  }
});
