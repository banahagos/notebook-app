
let chipData

// Collecting all tags from the database
const allTags = [...document.querySelectorAll('.all-tags')]
let data = {}
let dataObjt = allTags.map(t => {
  data[t.innerHTML] = null
})

// Initialize the chip/tag
document.addEventListener('DOMContentLoaded', function () {
  let chipEl = document.getElementById('chip');
  let chipElement = M.Chips.init(chipEl,
    {
      placeholder: 'Enter tags',
      secondaryPlaceholder: '+ Add more tags',
      autocompleteOptions: {
        data: data,
        limit: Infinity,
        minlength: 1
      }
    });

  // Get an array of chip/tag objects
  if (chipElement) {
    chipData = chipElement.chipsData
    console.log(chipData) // check the data that's returned
  }


  // Prefill tags (iterate through handlebar, add values to chips/tags array, hide input field)
  const prefillTags = [...document.getElementsByClassName('chip-prefill')]

  prefillTags.forEach(element => {
    chipElement.addChip({
      tag: element.innerText,
    })
    element.style.visibility = "hidden"
  })
})

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






