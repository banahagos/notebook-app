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

// logout-profile-settings-box
const profileImg = document.querySelector('.profile-img')
const settingsAndLogout = document.querySelector('.logout-profile-settings-box')
profileImg.addEventListener('click', function (e) {
  settingsAndLogout.style.visibility = "visible";
})



// Floating button
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.fixed-action-btn-card');
  var instances = M.FloatingActionButton.init(elems, {
    toolbarEnabled: true
  });
});






