const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const searchInput = document.getElementById('search-input');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const downloadBtn = document.getElementById('download-btn'); // Added for download

let currentIndex = 0;
let activeImages = Array.from(galleryItems);

// Helper function to apply both search and category filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const filterValue = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const imgElement = item.querySelector('img');
        const altText = imgElement ? imgElement.alt.toLowerCase() : '';
        
        const matchesCategory = (filterValue === 'all' || category === filterValue);
        const matchesSearch = altText.includes(searchTerm);

        if (matchesCategory && matchesSearch) {
            item.classList.remove('hide');
        } else {
            item.classList.add('hide');
        }
    });

    // Update active images array for lightbox navigation
    activeImages = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
}

// 1. Filter Functionality (Category wise)
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
    });
});

// 2. Search Functionality (Live Typing wise)
if (searchInput) {
    searchInput.addEventListener('input', () => {
        applyFilters();
    });
}

// Helper to update Lightbox image and download link
function updateLightboxImage(imgElement) {
    if (imgElement) {
        lightboxImg.src = imgElement.src;
        if (downloadBtn) {
            downloadBtn.href = imgElement.src;
        }
    }
}

// 3. Lightbox Open
galleryItems.forEach((item) => {
    const img = item.querySelector('img');
    
    item.addEventListener('click', () => {
        activeImages = Array.from(galleryItems).filter(i => !i.classList.contains('hide'));
        currentIndex = activeImages.indexOf(item);
        
        if (currentIndex !== -1 && img) {
            updateLightboxImage(img);
            lightbox.classList.add('active');
        }
    });
});

// 4. Lightbox Close
function closeLightbox() {
    lightbox.classList.remove('active');
}

if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

// 5. Next / Previous Navigation
function showNextImage() {
    if (activeImages.length === 0) return;
    currentIndex = (currentIndex + 1) % activeImages.length;
    const targetImg = activeImages[currentIndex].querySelector('img');
    updateLightboxImage(targetImg);
}

function showPrevImage() {
    if (activeImages.length === 0) return;
    currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
    const targetImg = activeImages[currentIndex].querySelector('img');
    updateLightboxImage(targetImg);
}

if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
});