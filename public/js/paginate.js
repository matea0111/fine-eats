const paginate = document.getElementById('paginate');
const $restaurantsContainer = $('#restaurants-container');
paginate.addEventListener('click', function (e) {
    console.log(this);
    e.preventDefault();
    fetch(this.href)
        .then(response => response.json())
        .then(data => {
            for (const restaurants of data.docs) {
                console.log(restaurants);
                let template = generateRestaurant(restaurants);
                $restaurantsContainer.append(template);
            }
            let { nextPage } = data;
            //restaurants.features.push(...data.docs);
            //map.getSource('restaurants').setData(restaurants);
            if (nextPage) {
                this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
            } else {
                console.log('njofra');
                // No more pages to load, remove the View More button
                this.remove();
            }
        })
        .catch(err => console.log("ERORR", err));
})

function generateRestaurant(restaurant) {
   let open = '';
   if (restaurant.isOpen) {
    open = '<span class="btn btn-success disabled" >Open</span>';
  } else {
    open='<span class="btn btn-danger disabled">Closed</span>';
  }  
   let template = `<div class="card border-0 mb-2">
   <div class="row">
       <div class="col-md-5">
           <img class="img-fluid" alt="picture" src="${restaurant.images[0].url}">
       </div>
       <div class="col-md-7">
           <div class="card-body">
               <h5 class="card-title">${ restaurant.title }</h5>
               <p class="card-text">${ restaurant.description }</p>
               <p class="card-text">` + 
                  open + 
                  `<small class="text-muted "> Working hours: ${ restaurant.openingTime } - ${ restaurant.closingTime } </small>
               </p>
               <p class="card-text">
                   <small class="text-muted">${ restaurant.location }</small>
               </p>
               <p class="card-text">
                   <small class="text-muted">Average rating: ${ restaurant.averageRating.toFixed(2) }</small>
               </p>
               <a class="btn btn-outline-success" href="/restaurants/${ restaurant._id}"> View ${ restaurant.title}</a>
           </div>
       </div>
   </div>
</div>`;
return template;
}
