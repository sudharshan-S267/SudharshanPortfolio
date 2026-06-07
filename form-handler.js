// ==================== FORM HANDLER ==================== //

// Character counter for message textarea
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');

if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength > 1000) {
            charCount.style.color = 'var(--accent-danger)';
        } else {
            charCount.style.color = 'var(--primary-color)';
        }
    });
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQs
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Open clicked FAQ if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Form Validation
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

// Validation patterns
const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\+\-\(\)]+$/,
    name: /^[a-zA-Z\s]{2,50}$/
};

// Validation functions
function validateField(field, pattern, errorElement, errorMessage) {
    const value = field.value.trim();
    
    if (!value) {
        showError(field, errorElement, 'This field is required');
        return false;
    }
    
    if (pattern && !pattern.test(value)) {
        showError(field, errorElement, errorMessage);
        return false;
    }
    
    hideError(field, errorElement);
    return true;
}

function showError(field, errorElement, message) {
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function hideError(field, errorElement) {
    field.classList.remove('error');
    errorElement.classList.remove('show');
}

// Real-time validation
document.getElementById('firstName')?.addEventListener('blur', function() {
    validateField(
        this,
        patterns.name,
        document.getElementById('firstNameError'),
        'Please enter a valid first name (2-50 characters, letters only)'
    );
});

document.getElementById('lastName')?.addEventListener('blur', function() {
    validateField(
        this,
        patterns.name,
        document.getElementById('lastNameError'),
        'Please enter a valid last name (2-50 characters, letters only)'
    );
});

document.getElementById('email')?.addEventListener('blur', function() {
    validateField(
        this,
        patterns.email,
        document.getElementById('emailError'),
        'Please enter a valid email address'
    );
});

document.getElementById('phone')?.addEventListener('blur', function() {
    const value = this.value.trim();
    if (value) { // Phone is optional, only validate if provided
        validateField(
            this,
            patterns.phone,
            document.getElementById('phoneError'),
            'Please enter a valid phone number'
        );
    }
});

document.getElementById('subject')?.addEventListener('change', function() {
    validateField(
        this,
        null,
        document.getElementById('subjectError'),
        ''
    );
});

document.getElementById('message')?.addEventListener('blur', function() {
    const value = this.value.trim();
    const errorElement = document.getElementById('messageError');
    
    if (!value) {
        showError(this, errorElement, 'Please enter your message');
    } else if (value.length < 10) {
        showError(this, errorElement, 'Message must be at least 10 characters long');
    } else if (value.length > 1000) {
        showError(this, errorElement, 'Message must not exceed 1000 characters');
    } else {
        hideError(this, errorElement);
    }
});

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form fields
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        const honeypot = document.getElementById('website'); // Spam protection
        
        // Validate all fields
        let isValid = true;
        
        isValid = validateField(
            firstName,
            patterns.name,
            document.getElementById('firstNameError'),
            'Please enter a valid first name'
        ) && isValid;
        
        isValid = validateField(
            lastName,
            patterns.name,
            document.getElementById('lastNameError'),
            'Please enter a valid last name'
        ) && isValid;
        
        isValid = validateField(
            email,
            patterns.email,
            document.getElementById('emailError'),
            'Please enter a valid email address'
        ) && isValid;
        
        isValid = validateField(
            subject,
            null,
            document.getElementById('subjectError'),
            'Please select a subject'
        ) && isValid;
        
        const messageValue = message.value.trim();
        if (!messageValue || messageValue.length < 10) {
            showError(
                message,
                document.getElementById('messageError'),
                'Please enter a message (min 10 characters)'
            );
            isValid = false;
        }
        
        // Check honeypot (if filled, it's a bot)
        if (honeypot.value) {
            console.log('Bot detected');
            return;
        }
        
        if (!isValid) {
            showMessage('error', 'Please fix the errors above and try again.');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Prepare form data
        const formData = new FormData(this);
        
        try {
            // Submit to backend
            const response = await fetch('backend/submit-form.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('success', result.message || 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
                contactForm.reset();
                charCount.textContent = '0';
            } else {
                showMessage('error', result.message || 'Oops! Something went wrong. Please try again or contact me directly.');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'Network error. Please check your connection and try again.');
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Show message function
function showMessage(type, text) {
    formMessage.className = 'form-message ' + type;
    formMessage.textContent = text;
    formMessage.style.display = 'flex';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}