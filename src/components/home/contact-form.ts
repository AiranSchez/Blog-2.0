const WEB3FORMS_API_URL = 'https://api.web3forms.com/submit';
const STATUS_AUTO_HIDE_MS = 5000;

interface Translations {
  sending: string;
  success: string;
  error: string;
}

interface StatusClasses {
  success: string;
  error: string;
}

export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const submitButton = document.getElementById('submit-button') as HTMLButtonElement | null;
  const formStatus = document.getElementById('form-status') as HTMLDivElement | null;

  if (!form || !submitButton || !formStatus) return;

  // Read server-side data from dataset
  const translations: Translations = {
    sending: form.dataset.sending ?? '',
    success: form.dataset.success ?? '',
    error: form.dataset.error ?? '',
  };

  const statusClasses: StatusClasses = {
    success: form.dataset.classSuccess ?? '',
    error: form.dataset.classError ?? '',
  };

  const controller = new AbortController();
  const { signal } = controller;

  // Cleanup on Astro View Transitions
  document.addEventListener('astro:before-swap', () => controller.abort(), { once: true });

  // Initialize handlers
  setupFormSubmitHandler(form, submitButton, formStatus, translations, statusClasses, signal);
  setupBeforeUnloadGuard(form, signal);
}

// ===== FORM SUBMISSION =====
function setupFormSubmitHandler(
  form: HTMLFormElement,
  submitButton: HTMLButtonElement,
  formStatus: HTMLDivElement,
  translations: Translations,
  statusClasses: StatusClasses,
  signal: AbortSignal
): void {
  form.addEventListener('submit', handleFormSubmit, { signal });

  async function handleFormSubmit(e: Event) {
    e.preventDefault();
    const originalText = submitButton.textContent || '';

    // Show loading state
    setButtonLoading(submitButton, true, translations.sending, originalText);
    formStatus.classList.add('hidden');

    try {
      const formData = new FormData(form);
      const response = await fetch(WEB3FORMS_API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showStatus(formStatus, translations.success, statusClasses.success);
        form.reset();
        resetCharCount();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      showStatus(formStatus, translations.error, statusClasses.error);
      console.error('Form submission error:', error);
    } finally {
      setButtonLoading(submitButton, false, translations.sending, originalText);
      autoHideStatus(formStatus);
    }
  }
}

// ===== BEFOREUNLOAD GUARD =====
function setupBeforeUnloadGuard(form: HTMLFormElement, signal: AbortSignal): void {
  let formChanged = false;
  const formInputs = form.querySelectorAll('input:not([type="hidden"]), textarea');

  formInputs.forEach((input) => {
    input.addEventListener(
      'input',
      () => {
        formChanged = true;
      },
      { signal }
    );
  });

  form.addEventListener(
    'submit',
    () => {
      formChanged = false;
    },
    { signal }
  );

  window.addEventListener(
    'beforeunload',
    (e) => {
      if (formChanged) {
        e.preventDefault();
        e.returnValue = '';
      }
    },
    { signal }
  );
}

// ===== UTILITIES =====
function setButtonLoading(
  button: HTMLButtonElement,
  isLoading: boolean,
  loadingText: string,
  originalText: string
): void {
  button.disabled = isLoading;
  if (isLoading) {
    button.setAttribute('aria-busy', 'true');
    button.textContent = loadingText;
  } else {
    button.removeAttribute('aria-busy');
    button.textContent = originalText;
  }
}

function showStatus(element: HTMLDivElement, message: string, className: string): void {
  element.textContent = message;
  element.className = className;
  element.classList.remove('hidden');
}

function resetCharCount(): void {
  const charCountEl = document.querySelector('[id^="char-count-"]');
  if (charCountEl) {
    charCountEl.textContent = '0';
  }
}

function autoHideStatus(element: HTMLDivElement): void {
  setTimeout(() => {
    element.classList.add('hidden');
  }, STATUS_AUTO_HIDE_MS);
}
