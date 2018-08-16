// *******************************************************************
// The top of this file does not need to be changed for the exercise.
// Read through it though, as it contains some interesting JavaScript
// code that can be a useful reference in future.
// *******************************************************************

// A prototype for a Tag object.  The object is very simple, containing
// just one property for the text value of the tag.
function Tag(text) {
  this.text = text;
}

// Defining the toString method means we can control how a Tag is logged
// in the console
Tag.prototype.toString = function () {
  return this.text;
};

// The TagList object contains the methods that will dynamically render
// the tags on the page.
function TagList(tags) {
  this.allTags = tags;
}

// renderAllTags iterates over all tags contained within the TagList and
// renders them on the page by calling renderTag.
TagList.prototype.renderAllTags = function () {
  console.log('Rendering ' + this.allTags);
  for (let i = 0; i < this.allTags.length; i++) {
    this.renderTag(this.allTags[i].text);
  }
};

// renderTag creates the DOM nodes for a tag, and adds this to the bottom
// of the tags unordered list (<ul>).
TagList.prototype.renderTag = function (tagText) {
  let textNode = document.createTextNode(tagText);

  let icon = document.createElement('i');
  icon.className = 'remove-tag';

  let anchor = document.createElement('a');
  anchor.href = '#';
  anchor.className = 'selected';
  anchor.addEventListener('click', e => e.preventDefault());
  anchor.appendChild(textNode);
  anchor.appendChild(icon);

  let listItem = document.createElement('li');
  listItem.appendChild(anchor);
  listItem.addEventListener('click', this.removeTag.bind(this));

  let tagsList = document.getElementById('tags');
  tagsList.appendChild(listItem);
};

// removeTagFromArray finds the Tag object in the array of tags
// and then removes it.  This is used in conjunction with removing
// the element that renders the tag for consistency in UI and data.
TagList.prototype.removeTagFromArray = function (tagText) {
  let indexOfTagToRemove = this.allTags.findIndex(function (item) {
    return item.text.indexOf(tagText) > -1;
  });

  this.allTags.splice(indexOfTagToRemove, 1);
}

// **************************************
// No changes are needed above this line
// **************************************

// removeTag removes the entire tag that was clicked.  It needs to update
// the tags that are stored in local storage, but this has not yet been
// implemented.
TagList.prototype.removeTag = function (e) {
  e.preventDefault();
  // e is the event that happened, e.currentTarget is the element that
  // the event was bound to.
  let tag = e.currentTarget;

  // removes the tag element from the list of tags then removes
  // the corresponding Tag object from the array of tags.
  tag.parentNode.removeChild(tag);
  this.removeTagFromArray(tag.textContent)
  console.log(tag.textContent + ' tag was removed.');

  // Task 3: Store the array of Tags in local storage using the key
  //         'savedTags' as a JSON string.
  localStorage.setItem('savedTags', JSON.stringify(this.allTags));
};

document.getElementById('resetTags').addEventListener('click', function (e) {
  console.log('Reset Tags button was clicked.');
  document.getElementById('tags').innerHTML = '';

  // Task 5: Remove any stored tags from local storage and also reload
  //         the tags via AJAX.
});


// Task 1: define a function that will retrieve the data contained in the
// tags.json file.  Log the response body to the console.
const getRemoteTags = function () {
  let request = new XMLHttpRequest();
  request.open('GET', './tags.json');

  request.onload = function () {
    console.log(request.responseText);

    let tags = JSON.parse(request.responseText);

    let tagList = new TagList(tags.tags);
    tagList.renderAllTags();
  };
  request.send();
};

if (localStorage.getItem('savedTags')) {
  let tagsAsJson = localStorage.getItem('savedTags');
  let tags JSON.parse(tagsAsJson);
} else {
  getRemoteTags();
}
// Task 2: parse the response body from tasks 2 and use these objects to
// render the tags on the page instead of the staticTags.


// Task 4: Retrieve the value stored with the key 'savedTags'.  If there
//         is a value, parse the value as JSON and use these tags.  If
//         there is no value, use the Tags loaded via AJAX as before.


const staticTags = [new Tag('Nature')];