const mobileInput = document.querySelector('#mobile');
const pinInput = document.querySelector('#pin');
const togglePinButton = document.querySelector('.toggle-pin');
const registrationForm = document.querySelector('#registration-form');
const formMessage = document.querySelector('#form-message');

const showMessage = (message, type = 'error') => {
	formMessage.textContent = message;
	formMessage.className = `form-message ${type}`;
	formMessage.setAttribute('role', type === 'error' ? 'alert' : 'status');
	formMessage.hidden = false;
};

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

registrationForm.addEventListener('submit', async(event) => {
	event.preventDefault();
	const mobileIsValid = /^[0-9]{10}$/.test(mobileInput.value);
	const pinIsValid = /^[0-9]{4,6}$/.test(pinInput.value);

	if (!mobileIsValid || !pinIsValid) {
		showMessage('Please enter a valid 10-digit mobile number and a 4 to 6-digit PIN.');
		registrationForm.reportValidity();
		return;
	}

	const mobile = mobileInput.value;
	const pin = pinInput.value;

	showMessage('Submitting...', 'loading');

	try {
		const response = await fetch('https://shiksha-copilot-vajr.onrender.com/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				mobile,
				pin
			})
		});

		const data = await response.json();

		console.log('Status:', response.status);
		console.log('Response:', data);

		if (response.ok && data.success) {
			showMessage(
				'Your account was activated successfully.',
				'success'
			);

			registrationForm.reset();
		} else {
			showMessage(
				data.message || 'We could not activate your account. Please try again.'
			);
		}

	} catch (error) {
		console.error('Fetch error:', error);

		showMessage(
			'We could not connect to the activation service. Please check your connection and try again.'
		);
	}
});





