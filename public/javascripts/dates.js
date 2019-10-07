window.onload = function (e) {
  let times = [...document.querySelectorAll('.time')]

  times.forEach(time => {
    time.innerText = moment(time.innerText).format("DD.MM.YYYY")
  })
}






