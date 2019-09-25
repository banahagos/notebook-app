
let chipData

// Initialize the chip/tag
document.addEventListener('DOMContentLoaded', function () {
  const chipEl = document.getElementById('chips');
  chip = M.Chips.init(chipEl);

  // Get an array of chip/tag objects
  chipData = chip.chipsData
  console.log(chipData) // check the data that's returned

  // Prefill tags (iterate through handlebar, add to chips/tags array, hide handlebar)
  const prefillTags = [...document.getElementsByClassName('chip-prefill')]

  prefillTags.forEach(element => {
    chip.addChip({
      tag: element.innerText,
    })
    element.style.visibility = "hidden"
  })
})

// Create an hidden input field 
let parentNode = document.getElementById("input-field")
let hiddenInput = document.createElement('input')
hiddenInput.setAttribute('type', 'hidden')
hiddenInput.setAttribute('name', 'tags')
hiddenInput.setAttribute('id', 'chipData')
parentNode.appendChild(hiddenInput)


// Add tags to the hidden input field
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






