// Fetch and display GitHub data
async function loadGitHubData() {
    try {
        const response = await fetch('/api/github');
        const data = await response.json();

        if (data.error) {
            console.error('Error fetching GitHub data:', data.error);
            return;
        }

        // Update profile information
        const { user, repos } = data;

        // Set profile avatar
        const avatar = document.getElementById('profile-avatar');
        if (avatar && user.avatar_url) {
            avatar.src = user.avatar_url;
        }

        // Set stats
        const reposCount = document.getElementById('repos-count');
        const followersCount = document.getElementById('followers-count');

        if (reposCount) reposCount.textContent = user.public_repos || 0;
        if (followersCount) followersCount.textContent = user.followers || 0;

        // Display projects
        displayProjects(repos);

    } catch (error) {
        console.error('Failed to load GitHub data:', error);
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '<div class="loading">Failed to load projects. Please try again later.</div>';
        }
    }
}

// Display project cards
function displayProjects(repos) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    // Filter out forks and sort by stars
    const featuredRepos = repos
        .filter(repo => !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 12);

    if (featuredRepos.length === 0) {
        projectsGrid.innerHTML = '<div class="loading">No projects found.</div>';
        return;
    }

    projectsGrid.innerHTML = featuredRepos.map((repo, index) => `
        <div class="project-card" style="animation-delay: ${index * 0.1}s">
            <div class="project-header">
                <h3 class="project-title">${repo.name}</h3>
                ${repo.language ? `<span class="project-language">${repo.language}</span>` : ''}
            </div>
            <p class="project-description">
                ${repo.description || 'No description available'}
            </p>
            <div class="project-stats">
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🔀 ${repo.forks_count}</span>
                ${repo.language ? `<span>💻 ${repo.language}</span>` : ''}
            </div>
            <a href="${repo.html_url}" target="_blank" class="project-link">
                View on GitHub →
            </a>
        </div>
    `).join('');
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Active nav link on scroll
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Navbar background on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });
}

// Add parallax effect to hero background
function initParallax() {
    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadGitHubData();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavLink();
    initNavbarScroll();
    initParallax();

    console.log('🚀 Portfolio loaded successfully!');
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
