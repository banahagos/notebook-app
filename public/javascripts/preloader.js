// Preloader for text detection 
document.addEventListener('DOMContentLoaded', function (e) {
  const preloader = document.querySelector('.progress')
  const submitBtn = document.querySelector('.submit-upload')
  const imgBtn = document.querySelector('.btn-img')
  const errMsg = document.querySelector('.error-message')
  imgBtn.addEventListener('click', function (e) {
    errMsg.style.visibility = "hidden"
  })

  submitBtn.addEventListener('click', function (e) {
    errMsg.style.visibility = "hidden"

  })

  submitBtn.addEventListener('click', function (e) {
    preloader.style.visibility = "visible"

  })
})