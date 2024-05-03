// intro page
document.addEventListener('DOMContentLoaded', function() {
    const enterButton = document.getElementById('enter-button');
    const introPage = document.getElementById('intro-page');
    const loadingScreen = document.getElementById('loading-screen');

    // Function to handle keydown event (32 = space bar, 13 = enter/return)
    function handleKeyDown(event) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            enterButton.click(); 
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    enterButton.addEventListener('click', function() {
        const buttonPositionX = enterButton.offsetLeft + enterButton.offsetWidth / 2;
        const buttonPositionY = enterButton.offsetTop + enterButton.offsetHeight / 2;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const transformOriginX = (buttonPositionX / windowWidth) * 100 + '%';
        const transformOriginY = (buttonPositionY / windowHeight) * 100 + '%';

        introPage.style.transformOrigin = transformOriginX + ' ' + transformOriginY;

        introPage.classList.add('zoom-effect'); 

        // Hide enter button while zooming in screen
        setTimeout(function() {
            enterButton.style.opacity = 0; 
        }, 100);  

        // Transition into loading screen from intro screen
        setTimeout(function() {
            introPage.style.display = 'none'; 
            loadingScreen.style.display = 'block';  
        }, 1000);  

        // Start fading out the loading
        setTimeout(function() {
            loadingScreen.classList.add('fade-out');
        }, 3000); 

        // Delay before redirecting to a new HTML page
        setTimeout(function() {
            window.location.href = 'home.html'; 
        }, 4000);
    });
});



// home page
document.addEventListener('DOMContentLoaded', function() {
    showSlides(slideIndex);
    startAutoSlide();
});

// Found slide idea on w3 school: https://www.w3schools.com/howto/howto_js_slideshow.asp
let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
    resetAutoSlide();
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

function startAutoSlide() {
    slideInterval = setInterval(function() {
        plusSlides(1);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}




