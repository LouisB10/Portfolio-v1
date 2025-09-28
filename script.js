// script.js
// CONFIGURATION EMAILJS - Utilise les variables de config.js
const EMAILJS_SERVICE_ID = window.EMAILJS_CONFIG.SERVICE_ID;
const EMAILJS_TEMPLATE_ID = window.EMAILJS_CONFIG.TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = window.EMAILJS_CONFIG.PUBLIC_KEY;

// Initialiser EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

document.addEventListener("DOMContentLoaded", function() {
  // DEEZER ALBUM ROTATION
  initDeezerRotation();

  // BUTTON BACK TO TOP
  const backToTopBtn = document.getElementById("backToTopBtn");

  if (!backToTopBtn) {
    console.warn("Bouton back to top non trouvé");
    return;
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  window.scrollToTop = scrollToTop;

  window.addEventListener("scroll", function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn.addEventListener("click", scrollToTop);

  // GESTION DU FORMULAIRE
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    // Validation en temps réel
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearError(input));
    });

    // Soumission du formulaire
    form.addEventListener('submit', handleFormSubmit);
  }

  // FONCTIONS DE VALIDATION
  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    let isValid = true;
    let errorMessage = '';

    // Validation spécifique par champ
    switch (fieldName) {
      case 'name':
        if (value.length < 2) {
          errorMessage = 'Le nom doit contenir au moins 2 caractères';
          isValid = false;
        } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          errorMessage = 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets';
          isValid = false;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMessage = 'Veuillez entrer une adresse email valide';
          isValid = false;
        }
        break;

      case 'subject':
        if (value.length < 5) {
          errorMessage = 'Le sujet doit contenir au moins 5 caractères';
          isValid = false;
        }
        break;

      case 'message':
        if (value.length < 10) {
          errorMessage = 'Le message doit contenir au moins 10 caractères';
          isValid = false;
        } else if (value.length > 1000) {
          errorMessage = 'Le message ne peut pas dépasser 1000 caractères';
          isValid = false;
        }
        break;
    }

    // Afficher ou masquer l'erreur
    if (!isValid) {
      showError(field, errorElement, errorMessage);
    } else {
      clearError(field, errorElement);
    }

    return isValid;
  }

  function showError(field, errorElement, message) {
    field.classList.add('error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  function clearError(field, errorElement) {
    field.classList.remove('error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  function validateForm() {
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  // GESTION DE LA SOUMISSION
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Validation complète du formulaire
    if (!validateForm()) {
      showFormStatus('Veuillez corriger les erreurs avant d\'envoyer', 'error');
      return;
    }

    // Désactiver le bouton et afficher le loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';
    showFormStatus('', '');

    try {
      // Préparer les données
      const formData = {
        from_name: document.getElementById('name').value.trim(),
        from_email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim(),
        to_name: 'Louis Bousquet'
      };

      // console.log('Envoi des données:', formData); // Debug - commenté
      // console.log('Réponse EmailJS:', response); // Debug - commenté

      // Envoyer l'email via EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formData
      );

      if (response.status === 200) {
        showFormStatus('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
        form.reset();
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }

    } catch (error) {
      console.error('Erreur EmailJS:', error);
      showFormStatus(`Erreur lors de l'envoi du message: ${error.message}`, 'error');
    } finally {
      // Réactiver le bouton
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer';
    }
  }

  function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = message ? 'block' : 'none';
  }
});

// FONCTION POUR FAIRE TOURNER LES ALBUMS DEEZER AUTOMATIQUEMENT
function initDeezerRotation() {
  // Liste des 3 albums
  const albums = [
    { id: '417419737', title: '23 - Jolagreen23' }, // Album déjà présent
    { id: '517170832', title: 'RECHERCHE&DESTRUCTION - Jolagreen23' },
    { id: '654365611', title: '+99XP - Jolagreen23' }
  ];

  let currentAlbumIndex = 0;
  const widget = document.querySelector('iframe[src*="widget.deezer.com"]');

  if (!widget) {
    console.warn('Widget Deezer non trouvé');
    return;
  }

  // Fonction pour changer d'album
  function changeAlbum(index) {
    currentAlbumIndex = index;
    const album = albums[currentAlbumIndex];
    
    // Mettre à jour l'iframe
    widget.src = `https://widget.deezer.com/widget/dark/album/${album.id}`;
    
    console.log(`Album changé: ${album.title}`);
  }

  // Rotation automatique toutes les 7.5 secondes
  setInterval(() => {
    const nextIndex = (currentAlbumIndex + 1) % albums.length;
    changeAlbum(nextIndex);
  }, 7500);

  // Initialiser avec le premier album
  changeAlbum(0);
}