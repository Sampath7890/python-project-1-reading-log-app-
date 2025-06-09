// Global state
let currentUser = null;
let books = [];
let activeTab = 'dashboard';
let searchTerm = '';
let filterStatus = 'all';
let isLogin = true;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadBooksData();
    initializeEventListeners();
    checkAuthState();
});

// Event Listeners
function initializeEventListeners() {
    // Auth form listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('toggle-auth').addEventListener('click', toggleAuthMode);
    
    // Book form listeners
    document.getElementById('book-form').addEventListener('submit', handleAddBook);
    document.getElementById('edit-book-form').addEventListener('submit', handleEditBook);
    
    // Search and filter listeners
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('mobile-search-input').addEventListener('input', handleSearch);
    document.getElementById('filter-status').addEventListener('change', handleFilter);
    
    // Navigation listeners
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setActiveTab(this.dataset.tab);
        });
    });
    
    // Modal listeners
    document.getElementById('edit-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Clear previous errors
    clearErrors('login');
    
    // Validate
    if (!validateLogin(username, password)) {
        return;
    }
    
    // Show loading
    setButtonLoading(e.target.querySelector('button[type="submit"]'), true);
    
    // Simulate API call
    setTimeout(() => {
        // In a real app, this would validate against a backend
        const user = {
            id: Date.now().toString(),
            username: username
        };
        
        currentUser = user;
        saveUserData();
        showApp();
        setButtonLoading(e.target.querySelector('button[type="submit"]'), false);
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Clear previous errors
    clearErrors('register');
    
    // Validate
    if (!validateRegister(username, email, password, confirmPassword)) {
        return;
    }
    
    // Show loading
    setButtonLoading(e.target.querySelector('button[type="submit"]'), true);
    
    // Simulate API call
    setTimeout(() => {
        const user = {
            id: Date.now().toString(),
            username: username,
            email: email
        };
        
        currentUser = user;
        saveUserData();
        showApp();
        setButtonLoading(e.target.querySelector('button[type="submit"]'), false);
    }, 1000);
}

function validateLogin(username, password) {
    let isValid = true;
    
    if (!username.trim()) {
        showError('login-username-error', 'Username is required');
        isValid = false;
    }
    
    if (!password) {
        showError('login-password-error', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('login-password-error', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateRegister(username, email, password, confirmPassword) {
    let isValid = true;
    
    if (!username.trim()) {
        showError('register-username-error', 'Username is required');
        isValid = false;
    }
    
    if (!email.trim()) {
        showError('register-email-error', 'Email is required');
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        showError('register-email-error', 'Email is invalid');
        isValid = false;
    }
    
    if (!password) {
        showError('register-password-error', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('register-password-error', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showError('register-confirm-password-error', 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

function toggleAuthMode() {
    isLogin = !isLogin;
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const toggleBtn = document.getElementById('toggle-auth');
    
    if (isLogin) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        authTitle.textContent = 'Welcome Back!';
        authSubtitle.textContent = 'Sign in to access your reading journey';
        toggleBtn.textContent = "Don't have an account? Sign up";
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Start tracking your reading journey today';
        toggleBtn.textContent = 'Already have an account? Sign in';
    }
    
    // Clear forms and errors
    loginForm.reset();
    registerForm.reset();
    clearErrors('login');
    clearErrors('register');
}

function logout() {
    currentUser = null;
    books = [];
    localStorage.removeItem('user');
    localStorage.removeItem('books');
    showAuth();
}

// App State Functions
function checkAuthState() {
    if (currentUser) {
        showApp();
    } else {
        showAuth();
    }
}

function showAuth() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('app-container').classList.add('hidden');
}

function showApp() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    
    // Update user display
    document.getElementById('username-display').textContent = currentUser.username;
    document.getElementById('mobile-username').textContent = currentUser.username;
    
    // Load dashboard
    setActiveTab('dashboard');
    renderDashboard();
}

// Navigation Functions
function setActiveTab(tab) {
    activeTab = tab;
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show active tab
    document.getElementById(`${tab}-tab`).classList.remove('hidden');
    
    // Update navigation
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide search based on tab
    const searchContainer = document.getElementById('search-container');
    const mobileSearch = document.getElementById('mobile-search');
    
    if (tab === 'books') {
        searchContainer.classList.remove('hidden');
        mobileSearch.classList.remove('hidden');
    } else {
        searchContainer.classList.add('hidden');
        mobileSearch.classList.add('hidden');
    }
    
    // Render content based on tab
    switch (tab) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'books':
            renderBooks();
            break;
        case 'add':
            // Form is already in HTML
            break;
    }
    
    // Close mobile menu
    document.getElementById('mobile-menu').classList.add('hidden');
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

// Book Management Functions
function handleAddBook(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        totalPages: parseInt(formData.get('totalPages')),
        pagesRead: parseInt(formData.get('pagesRead')),
        status: formData.get('status'),
        notes: formData.get('notes') || ''
    };
    
    // Clear previous errors
    clearErrors('book');
    
    // Validate
    if (!validateBook(bookData)) {
        return;
    }
    
    // Show loading
    setButtonLoading(e.target.querySelector('button[type="submit"]'), true);
    
    // Simulate API call
    setTimeout(() => {
        const newBook = {
            ...bookData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        
        // If status is completed, set pages read to total pages
        if (newBook.status === 'Completed') {
            newBook.pagesRead = newBook.totalPages;
            newBook.finishDate = new Date().toISOString();
        }
        
        books.push(newBook);
        saveBooksData();
        
        // Reset form
        e.target.reset();
        
        // Go to books tab
        setActiveTab('books');
        
        setButtonLoading(e.target.querySelector('button[type="submit"]'), false);
    }, 500);
}

function validateBook(bookData) {
    let isValid = true;
    
    if (!bookData.title.trim()) {
        showError('book-title-error', 'Title is required');
        isValid = false;
    }
    
    if (!bookData.author.trim()) {
        showError('book-author-error', 'Author is required');
        isValid = false;
    }
    
    if (bookData.totalPages <= 0) {
        showError('book-total-pages-error', 'Total pages must be greater than 0');
        isValid = false;
    }
    
    if (bookData.pagesRead < 0) {
        showError('book-pages-read-error', 'Pages read cannot be negative');
        isValid = false;
    }
    
    if (bookData.pagesRead > bookData.totalPages) {
        showError('book-pages-read-error', 'Pages read cannot exceed total pages');
        isValid = false;
    }
    
    return isValid;
}

function editBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Populate modal
    document.getElementById('edit-book-id').value = book.id;
    document.getElementById('edit-pages-read').value = book.pagesRead;
    document.getElementById('edit-pages-read').max = book.totalPages;
    document.getElementById('edit-status').value = book.status;
    
    // Show modal
    document.getElementById('edit-modal').classList.remove('hidden');
}

function handleEditBook(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookId = formData.get('bookId') || document.getElementById('edit-book-id').value;
    const pagesRead = parseInt(formData.get('pagesRead'));
    const status = formData.get('status');
    
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;
    
    // Update book
    books[bookIndex] = {
        ...books[bookIndex],
        pagesRead: status === 'Completed' ? books[bookIndex].totalPages : pagesRead,
        status: status,
        finishDate: status === 'Completed' && !books[bookIndex].finishDate ? new Date().toISOString() : books[bookIndex].finishDate
    };
    
    saveBooksData();
    closeEditModal();
    
    // Re-render current view
    if (activeTab === 'dashboard') {
        renderDashboard();
    } else if (activeTab === 'books') {
        renderBooks();
    }
}

function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        books = books.filter(b => b.id !== bookId);
        saveBooksData();
        
        // Re-render current view
        if (activeTab === 'dashboard') {
            renderDashboard();
        } else if (activeTab === 'books') {
            renderBooks();
        }
    }
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

// Search and Filter Functions
function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase();
    
    // Sync search inputs
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    
    if (e.target === searchInput) {
        mobileSearchInput.value = e.target.value;
    } else {
        searchInput.value = e.target.value;
    }
    
    if (activeTab === 'books') {
        renderBooks();
    }
}

function handleFilter(e) {
    filterStatus = e.target.value;
    if (activeTab === 'books') {
        renderBooks();
    }
}

function getFilteredBooks() {
    return books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                             book.author.toLowerCase().includes(searchTerm);
        const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
        return matchesSearch && matchesFilter;
    });
}

// Render Functions
function renderDashboard() {
    renderBookStats();
    renderReadingProgress();
    renderRecentBooks();
}

function renderBookStats() {
    const completedBooks = books.filter(book => book.status === 'Completed');
    const readingBooks = books.filter(book => book.status === 'Reading');
    const toReadBooks = books.filter(book => book.status === 'To Read');
    const totalPagesRead = books.reduce((sum, book) => sum + book.pagesRead, 0);
    
    const stats = [
        {
            name: 'Total Books',
            value: books.length,
            icon: 'fas fa-book',
            color: 'indigo'
        },
        {
            name: 'Currently Reading',
            value: readingBooks.length,
            icon: 'fas fa-book-open',
            color: 'blue'
        },
        {
            name: 'Completed',
            value: completedBooks.length,
            icon: 'fas fa-check-circle',
            color: 'green'
        },
        {
            name: 'To Read',
            value: toReadBooks.length,
            icon: 'fas fa-clock',
            color: 'amber'
        },
        {
            name: 'Pages Read',
            value: totalPagesRead,
            icon: 'fas fa-book',
            color: 'purple'
        }
    ];
    
    const statsContainer = document.getElementById('book-stats');
    statsContainer.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-icon ${stat.color}">
                <i class="${stat.icon}"></i>
            </div>
            <div class="stat-name">${stat.name}</div>
            <div class="stat-value">${stat.value}</div>
        </div>
    `).join('');
}

function renderReadingProgress() {
    const readingBooks = books.filter(book => book.status === 'Reading');
    const container = document.getElementById('reading-books');
    
    if (readingBooks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>You're not currently reading any books.</p>
            </div>
        `;
        return;
    }
    
    // Sort by progress percentage
    const sortedBooks = readingBooks.sort((a, b) => {
        const progressA = a.totalPages > 0 ? (a.pagesRead / a.totalPages) : 0;
        const progressB = b.totalPages > 0 ? (b.pagesRead / b.totalPages) : 0;
        return progressB - progressA;
    });
    
    container.innerHTML = sortedBooks.map(book => {
        const progress = book.totalPages > 0 ? Math.min(Math.round((book.pagesRead / book.totalPages) * 100), 100) : 0;
        
        return `
            <div class="reading-book">
                <div class="reading-book-header">
                    <span class="reading-book-title">${escapeHtml(book.title)}</span>
                    <span class="reading-book-progress">${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="progress-pages">${book.pagesRead} of ${book.totalPages} pages</div>
            </div>
        `;
    }).join('');
}

function renderRecentBooks() {
    const recentBooks = [...books]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
    
    const container = document.getElementById('recent-books-list');
    
    if (recentBooks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>You haven't added any books yet.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentBooks.map(book => `
        <div class="recent-book">
            <div class="recent-book-title">${escapeHtml(book.title)}</div>
            <div class="recent-book-author">by ${escapeHtml(book.author)}</div>
            <div class="recent-book-date">
                <i class="fas fa-calendar"></i>
                <span>Added ${formatDate(book.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

function renderBooks() {
    const filteredBooks = getFilteredBooks();
    const container = document.getElementById('books-grid');
    const noBooks = document.getElementById('no-books');
    
    if (filteredBooks.length === 0) {
        container.classList.add('hidden');
        noBooks.classList.remove('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    noBooks.classList.add('hidden');
    
    container.innerHTML = filteredBooks.map(book => {
        const progress = book.totalPages > 0 ? Math.min(Math.round((book.pagesRead / book.totalPages) * 100), 100) : 0;
        const statusClass = book.status.toLowerCase().replace(' ', '-');
        const statusIcon = getStatusIcon(book.status);
        
        return `
            <div class="book-card">
                <div class="book-card-content">
                    <div class="book-card-header">
                        <div class="book-info">
                            <h3>${escapeHtml(book.title)}</h3>
                            <p>by ${escapeHtml(book.author)}</p>
                        </div>
                        <span class="status-badge ${statusClass}">
                            <i class="${statusIcon}"></i>
                            ${book.status}
                        </span>
                    </div>
                    
                    <div class="book-progress">
                        <div class="progress-header">
                            <span>Progress: ${progress}%</span>
                            <span>${book.pagesRead} / ${book.totalPages} pages</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${progress === 100 ? 'completed' : ''}" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    
                    <div class="book-actions">
                        <button onclick="editBook('${book.id}')" class="btn btn-outline btn-sm">
                            <i class="fas fa-edit"></i>
                            Update
                        </button>
                        <button onclick="deleteBook('${book.id}')" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Utility Functions
function getStatusIcon(status) {
    switch (status) {
        case 'Reading':
            return 'fas fa-book-open';
        case 'Completed':
            return 'fas fa-check-circle';
        case 'Abandoned':
            return 'fas fa-times-circle';
        case 'To Read':
            return 'fas fa-clock';
        default:
            return 'fas fa-book';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors(prefix) {
    document.querySelectorAll(`[id^="${prefix}"][id$="-error"]`).forEach(element => {
        element.textContent = '';
    });
}

function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Data Persistence Functions
function saveUserData() {
    localStorage.setItem('user', JSON.stringify(currentUser));
}

function loadUserData() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

function saveBooksData() {
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooksData() {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
        books = JSON.parse(savedBooks);
    }
}