alert = document.querySelector('.alert');

if (alert !== null) {
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, {});
});