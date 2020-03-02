//grab UI elements

const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal'),
    alertMessage = document.getElementById('alertMessage');



//Search meals and fetch from API
function searchMeal(e) {
    e.preventDefault();

    //clear single meal
    single_mealEl.innerHTML = "";

    //get search keyword
    const term = search.value;

    //Check for Empty
    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
              
                resultHeading.innerHTML = `<h2>Search results for '${term}': </h2>`

                if(data.meals === null){
                    resultHeading.innerHTML = `There are no search results for '${term}'. Please choose another item.`
                } else {
                    mealsEl.innerHTML = data.meals
                    .map(
                        meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                        `
                    )
                    .join('');
                }
            });
            //clear search text
            search.value = '';
    } else {
        const noSearchTerm = '<p>Please enter a Search Term<p>'
        alertMessage.innerHTML = noSearchTerm;

        setTimeout (function() {
         
            alertMessage.innerHTML = "";
         }, 3000);
    }
}

//fetch meal by ID
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDom(meal);
        })
}

//fetch random meal from API
function getRandomMeal() {
    //Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => { 
            
            const meal = data.meals[0];

            addMealToDom(meal);
            
        })

}

//add meal to DOM
function addMealToDom(meal){
    const ingredients = [];

    for(let i = 1; i <= 02; i++){
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredients${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMealThumb}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
            </div>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </div>
    `;

}



//Instantiate Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info')
        } else {
            return false;
        }
    })

    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
})