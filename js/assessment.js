document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('assessment-form');
  if (!form) return;

  const steps = Array.from(document.querySelectorAll('.form-step'));
  const progressBar = document.getElementById('form-progress');
  const prevButton = document.getElementById('prev-step');
  const nextButton = document.getElementById('next-step');
  let currentStep = 0;

  function updateStep() {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
    });
    if (progressBar) {
      progressBar.style.setProperty('--progress', `${((currentStep + 1) / steps.length) * 100}%`);
    }
    if (prevButton) {
      prevButton.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    }
    if (nextButton) {
      nextButton.textContent = currentStep === steps.length - 1 ? 'Submit' : 'Next';
    }
  }

  function goNext() {
    if (currentStep < steps.length - 1) {
      currentStep += 1;
      updateStep();
    } else {
      window.location.href = 'results.html';
    }
  }

  function goPrev() {
    if (currentStep > 0) {
      currentStep -= 1;
      updateStep();
    }
  }

  if (nextButton) {
    nextButton.addEventListener('click', goNext);
  }

  if (prevButton) {
    prevButton.addEventListener('click', goPrev);
  }

  updateStep();
});
