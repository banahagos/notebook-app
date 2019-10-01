
let chipData
/* Start - Materialize documentation  */

// Initialize the chip/tag
document.addEventListener('DOMContentLoaded', function () {
  const chipEl = document.getElementById('chips');
  chip = M.Chips.init(chipEl);

  // Get an array of chip/tag objects
  if (chip) {
    chipData = chip.chipsData
    console.log(chipData) // check the data that's returned
  }


  // Prefill tags (iterate through handlebar, add values to chips/tags array, hide input field)
  const prefillTags = [...document.getElementsByClassName('chip-prefill')]

  prefillTags.forEach(element => {
    chip.addChip({
      tag: element.innerText,
    })
    element.style.visibility = "hidden"
  })
})

/* End - Materialize documentation */


// Create an hidden input field (Create & Edit page)
let parentNode = document.getElementById("inputField")
let hiddenInput = document.createElement('input')
hiddenInput.setAttribute('type', 'hidden')
hiddenInput.setAttribute('name', 'tags')
hiddenInput.setAttribute('id', 'chipData')
if (parentNode) {
  parentNode.appendChild(hiddenInput)
}



// Add all entered tags to the hidden input field (Create & Edit page)
const updateNoteButton = document.querySelector(".submit-update")
if (updateNoteButton) {
  updateNoteButton.addEventListener("mouseover", function (e) {
    hiddenInput.value = chipData.map(c => c.tag)

  })
}

const createNoteButton = document.querySelector(".submit-new-note")
if (createNoteButton) {
  createNoteButton.addEventListener("mouseover", function (e) {
    hiddenInput.value = chipData.map(c => c.tag)
  })
}


const submitUploadButton = document.querySelector(".submit-upload")
if (submitUploadButton) {
  submitUploadButton.addEventListener("mouseover", function (e) {
    hiddenInput.value = chipData.map(c => c.tag)
  })
}

// Click on tags to see search result for this tag
const clickTag = [...document.querySelectorAll('.click-tag')]
clickTag.forEach(tag => {
  tag.addEventListener("click", function (e) {
    const searchField = document.querySelector('.search')
    searchField.style.visibility = "hidden"
    searchField.value = tag.innerText
    document.querySelector(".search-home").submit();
    searchField.value = ""
  })
})






