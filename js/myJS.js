/* ReqJ1 */
/* Initialisation scaffold */
const form = document.querySelector('form');

if (!form) {
  // No form on this page - exit quietly
  console.log('No form found; myJS.js exiting.');
  exit(0);
}

// proceed with other code below
function updatePreview() {
  const name = document.querySelector('#name').value;
  const studentid = document.querySelector('#student-id').value;
  const phone = document.querySelector('#phone').value;
  const email = document.querySelector('#email').value;
  const message = document.querySelector('#message').value;

  preview.innerHTML = `
    <h3>Contact Preview</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Student-id:</strong> ${studentid}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong> ${message}</p>
  `;
}

//check input validity
function checkValidityState(field) {

  // remove previous states
  field.classList.remove('valid', 'invalid');

  // check built-in HTML validity
  if (field.checkValidity()) {
    field.classList.add('valid');
  } else {
    field.classList.add('invalid');
  }
}

/* ReqJ4 */
/* ReqJ5 */
//validating form with JS instead of by the own form
function validateForm() {
  const errorBox = document.getElementById('error-box');

  // clear previous message and hide the box
  errorBox.textContent = '';
  errorBox.classList.remove('visible');

  // Native HTML validation runs automatically via required/type attributes
  const form = document.querySelector('form');
  if (!form.reportValidity()) {
    return false; // browser shows default tooltips
  }

  // Custom validation
  const customError = checkCustomRules();

  if (customError) {
    errorBox.textContent = customError;
    errorBox.classList.add('visible'); // show the box

    return false;
  }

  return true; // allow submission
}

/* ReqJ5 */
// ---- Custom cross-field validation
function checkCustomRules() {
  const referralSelected = document.querySelector('#referral').checked;
  const message = document.querySelector('#message').value.toLowerCase();

  // Rule: if "Referral" is selected, message must include "friend"
  if (referralSelected && !message.includes("friend")) {
    /* ReqJ6 */
    // Focus management: move cursor to the textarea
    document.querySelector('#message').focus();
    return 'If you select "Referral", please mention your friend in the message.';
  }

  return null; // no errors
}

/* ReqJ7 */
// Keyboard event: highlight submit button when Enter is pressed
function handleKeydown(event) {
  if (event.key === 'Enter') {
    document.getElementById('submit-btn').classList.add('highlight');
  }
}

/* ReqJ8 */
// Mouse events: highlight fields on hover
function handleMouseOver(element) {
  element.classList.add('highlight');
}

/* ReqJ8 */
function handleMouseOut(element) {
  element.classList.remove('highlight');
}
