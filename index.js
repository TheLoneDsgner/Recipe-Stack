//category html element 
const arrowLeft = document.getElementById("chip-btn-left")
const arrowRight = document.getElementById("chip-btn-right")

const chipsWrapper = document.getElementById("chip-wrapper")
const tagChip = document.querySelectorAll(".chip")
const categoryChip = document.getElementById("chip")


//category chip state functionality
function removeActive(){
    tagChip.forEach((chip)=>{
        chip.classList.remove("active")
    })
}

tagChip.forEach((chip)=>{
    chip.addEventListener("click", ()=>{
        removeActive()
        chip.classList.add("active")
    })
})

// scroll button
function scrollButtons(){
    if(chipsWrapper.scrollLeft >= 2){
        arrowLeft.style.display = "flex"
    }else{
        arrowLeft.style.display = "none"
    }

    let maxScrollValue = chipsWrapper.scrollWidth - chipsWrapper.clientWidth - 2
    
    if(chipsWrapper.scrollLeft >= maxScrollValue){
        arrowRight.style.display = "none"
    }else{
        arrowRight.style.display = "flex"
    }
}

arrowRight.addEventListener("click", ()=>{
    chipsWrapper.scrollLeft += 200;

    scrollButtons()    
})

arrowLeft.addEventListener("click", ()=>{
    chipsWrapper.scrollLeft -= 200;

    scrollButtons()    
})

// chips scroll while dragging
chipsWrapper.addEventListener("scroll", scrollButtons)

// drag functionality
let dragging = false

function dragScroll(e){
    if(!dragging) return

    chipsWrapper.classList.add("dragging")
    chipsWrapper.scrollLeft -= e.movementX
}

chipsWrapper.addEventListener("mousedown", ()=>{
    dragging = true
})

chipsWrapper.addEventListener("mousemove", dragScroll)

document.addEventListener("mouseup", ()=>{
    dragging = false
    chipsWrapper.classList.remove("dragging")
})


//Get modal elements
// const modalOverlay = document.getElementById("modal")
// const openOverlay = document.querySelector(".btn-secondary")
// const closeOverlay = document.getElementById("closeModal")


// openOverlay.addEventListener("click", ()=>{
//         modalOverlay.style.display = "flex"
// })
    
// closeOverlay.addEventListener("click", ()=>{
//     modalOverlay.style.display = "none"
// })

// modalOverlay.addEventListener("click", (event)=>{
//     if(event.target === modalOverlay){
//         modalOverlay.style.display = "none"
//     }
// })

let API = `https://www.themealdb.com/api/json/v1/1/search.php?s=`


// Fetch meal
async function fetchMeal() {
    try{
        let response = await fetch(API)
        let mealData = await response.json()

        console.log(mealData)
        displayRandomMeals(mealData.meals)
        // displayChips(mealData)  

    }catch(error){
        console.error('Error fetching meals:', error)
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    fetchMeal();
});



// display random meal
function displayRandomMeals(meals){

    const cardsWrapper = document.getElementById('recipeCardsWrapper')

    cardsWrapper.innerHTML = "";

    // Shuffle meals to get random 12
    const randomMeals = meals.sort(() => 0.5 - Math.random()).slice(0, 12);

    randomMeals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('recipe-card');
        mealCard.innerHTML = `
            <div class="img-card-wrapper">
            <img class="meal-image" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            
            <div class="card-text-wrapper">
                <div class="caption-and-title">
                    <p class="card-caption">${meal.strCategory}</p>
                    <h3 class="card-title">${meal.strMeal}</h3> 
                </div>
                       
                <button class="btn-secondary" data-meal-id="${meal.idMeal}">Get Recipe</button>
                
            </div>
        `;
        
            // Add event listener to the button after it's added to the DOM
            const recipeButton = mealCard.querySelector('.btn-secondary');
            recipeButton.addEventListener('click', function() {
            getRecipe(meal.idMeal);
        });

        cardsWrapper.appendChild(mealCard);

    })
}


// Function to fetch recipe details
function getRecipe(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals && data.meals.length > 0) {
                displayRecipeModal(data.meals[0]);
            }
        })
        .catch(error => console.error('Error fetching recipe:', error));
}


// Function to display recipe details in modal
function displayRecipeModal(meal) {

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-container');
    
    let ingredientsList = '';
    let measurementsList = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientsList += `<li>${meal[`strIngredient${i}`]}</li>`;
            measurementsList += `<li>${meal[`strMeasure${i}`] || 'To taste'}</li>`;
        }
    }

    
    modalContent.innerHTML = `
        <div class="modal-content-wrapper" id="modal-content-wrapper">
        <div class="modal-header">
        <div class="recipe-label-name">
            <p>RECIPE:</p>
            <h3>${meal.strMeal} </h3>            
        </div>
            <div class="close-icon" id="closeModal" onclick="closeModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_3838_14688)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9996 14.1216L17.3026 19.4246C17.584 19.706 17.9657 19.8641 18.3636 19.8641C18.7616 19.8641 19.1432 19.706 19.4246 19.4246C19.706 19.1432 19.8641 18.7616 19.8641 18.3636C19.8641 17.9657 19.706 17.584 19.4246 17.3026L14.1196 11.9996L19.4236 6.69662C19.5629 6.55729 19.6733 6.39189 19.7487 6.20987C19.824 6.02785 19.8628 5.83277 19.8627 5.63577C19.8627 5.43877 19.8238 5.24371 19.7484 5.06172C19.673 4.87974 19.5624 4.71439 19.4231 4.57512C19.2838 4.43586 19.1184 4.3254 18.9364 4.25005C18.7543 4.1747 18.5592 4.13595 18.3623 4.13599C18.1653 4.13604 17.9702 4.17489 17.7882 4.25032C17.6062 4.32575 17.4409 4.43629 17.3016 4.57562L11.9996 9.87862L6.6966 4.57562C6.5583 4.43229 6.39284 4.31794 6.20987 4.23924C6.0269 4.16055 5.83009 4.11907 5.63092 4.11725C5.43176 4.11543 5.23422 4.15329 5.04984 4.22862C4.86546 4.30395 4.69793 4.41526 4.55703 4.55603C4.41612 4.6968 4.30466 4.86422 4.22916 5.04853C4.15365 5.23284 4.1156 5.43034 4.11724 5.62951C4.11887 5.82868 4.16016 6.02553 4.23869 6.20857C4.31721 6.39161 4.43141 6.55718 4.5746 6.69562L9.8796 11.9996L4.5756 17.3036C4.43241 17.4421 4.31821 17.6076 4.23969 17.7907C4.16116 17.9737 4.11987 18.1706 4.11824 18.3697C4.1166 18.5689 4.15465 18.7664 4.23016 18.9507C4.30566 19.135 4.41712 19.3024 4.55803 19.4432C4.69893 19.584 4.86646 19.6953 5.05084 19.7706C5.23522 19.846 5.43276 19.8838 5.63192 19.882C5.83109 19.8802 6.0279 19.8387 6.21087 19.76C6.39384 19.6813 6.5593 19.567 6.6976 19.4236L11.9996 14.1216Z" fill="black"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_3838_14688">
                            <rect width="24" height="24" fill="white"/>
                            </clipPath>
                            </defs>
                            </svg>                            
            </div>
        </div>            

        <div class="indredient-and-measure-container">
            <div class="ingredient">
                <label>Ingredients</label>
                <ul>${ingredientsList}</ul>
            </div>
            
            <div class="measure">
                <label>Measurements</label>
                <ul>${measurementsList}</ul>
            </div>
            
        </div>

        <div class="instruction-container">
            <label>Instructions</label>
            <p>${meal.strInstructions}</p>
        </div>

        </div>

    `;

    // Event listener to close button
    const closeOverlay = document.getElementById('closeModal');
    closeOverlay.addEventListener('click', closeModal);

    const closeOverlayTarget = document.getElementById('modal');
    closeOverlayTarget.addEventListener("click", (event)=>{
    if(event.target === modal){
        closeModal()
    }
})    
    modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}


// Function to search meals by user input
function searchMeals(query) {
    fetch(API)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                const filteredMeals = data.meals.filter(meal => 
                    meal.strMeal.toLowerCase().includes(query.toLowerCase())
                );
                displayRandomMeals(filteredMeals);
            }
        })
        .catch(error => console.error('Error searching meals:', error));
}

// Event Listeners
document.getElementById('search-input').addEventListener('input', (e) => {
    searchMeals(e.target.value);
});




// Function to filter meals by category
function filterByCategory(category) {
    fetch(API)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                const filteredMeals = data.meals.filter(meal => meal.strCategory === category);
                console.log(filteredMeals)
                displayRandomMeals(filteredMeals);
            }
        })
        .catch(error => console.error('Error filtering meals:', error));
}

document.getElementById('chip-wrapper').addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault(); // Prevent the page from jumping
        const category = e.target.getAttribute('data-category');
        filterByCategory(category);
    }
});







