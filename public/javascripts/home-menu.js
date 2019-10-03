// Menu - Notes
document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.fixed-action-btn');
  let instances = M.FloatingActionButton.init(elems, {
    direction: 'left'
  });

  // Delete button
  if (document.querySelector('.btn-delete')) {
    document.querySelector('.btn-delete').addEventListener('click', function (e) {
      document.querySelector(".delete-form").submit();
    })
  }

})






