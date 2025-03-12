var openAcount = document.getElementById('openAcount');
var closeAcount = document.getElementById('closeAcount');
var acountPopup = document.getElementById('acountPopup');

openAcount.addEventListener('click', function(e) {
  e.preventDefault();
  acountPopup.style.display = 'block';
});

closeAcount.addEventListener('click', function() {
    acountPopup.style.display = 'none';
});

window.addEventListener('click', function(e) {
  if (e.target == termsPopup) {
    acountPopup.style.display = 'none';
  }
});