var openTerms = document.getElementById('openTerms');
var closeTerms = document.getElementById('closeTerms');
var termsPopup = document.getElementById('termsPopup');

openTerms.addEventListener('click', function(e) {
  e.preventDefault();
  termsPopup.style.display = 'block';
});

closeTerms.addEventListener('click', function() {
  termsPopup.style.display = 'none';
});

window.addEventListener('click', function(e) {
  if (e.target == termsPopup) {
    termsPopup.style.display = 'none';
  }
});