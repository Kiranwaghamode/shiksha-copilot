const mobileInput = document.querySelector('#mobile');
const pinInput = document.querySelector('#pin');
const togglePinButton = document.querySelector('.toggle-pin');
const registrationForm = document.querySelector('#registration-form');
const formMessage = document.querySelector('#form-message');

const numericInputs = [mobileInput, pinInput];

numericInputs.forEach((input) => {
	input.addEventListener('input', () => {
		input.value = input.value.replace(/\D/g, '');
		input.setCustomValidity('');
	});
});

togglePinButton.addEventListener('click', () => {
	const isVisible = pinInput.type === 'text';
	pinInput.type = isVisible ? 'password' : 'text';
	togglePinButton.textContent = isVisible ? 'Show' : 'Hide';
	togglePinButton.setAttribute('aria-label', isVisible ? 'Show PIN' : 'Hide PIN');
	togglePinButton.setAttribute('aria-pressed', String(!isVisible));
});

registrationForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const mobileIsValid = /^[0-9]{10}$/.test(mobileInput.value);
	const pinIsValid = /^[0-9]{4,6}$/.test(pinInput.value);

	if (!mobileIsValid || !pinIsValid) {
		if (!mobileIsValid) {
			mobileInput.setCustomValidity('Enter a valid 10-digit mobile number.');
			mobileInput.reportValidity();
		} else {
			pinInput.setCustomValidity('Enter a PIN with 4 to 6 digits.');
			pinInput.reportValidity();
		}
		formMessage.textContent = '';
		return;
	}

	formMessage.textContent = 'Details received. You can continue to your session.';
});
