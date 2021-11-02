const paginate=document.getElementById('paginate');
const $restaurantsContainer=$('#restaurants-container');
paginate.addEventListener('click', function (e) {
    e.preventDefault();
    fetch(this.href)
    .then(response => response.json())
    .then(data => {
        for(const restaurants of data.docs) {
            let template = generateRestaurant(restaurants);
            $restaurantsContainer.append(template);
        }
        let {nextPage}=data;
        this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
        restaurants.features.push(...data.docs);
        map.getSource('restaurants').setData(restaurants);
    })
    .catch(err => console.log("ERORR",err));

})

function generateRestaurant(restaurant) {
   let template = `<div class="card border-0 mb-2" >
   <div class="row">
       <div class="col-md-4">
           <img class="img-fluid" alt="" src="${restaurant.images[0].url}">
       </div>
       <div class="col-md-8">
           <div class="card-body">
               <h5 class="card-title">${ restaurant.title }</h5>
               <p class="card-text">${ restaurant.description }</p>
               <p class="card-text">
                   <small class="text-muted">${ restaurant.location }</small>
               </p>
               <a class="btn btn-outline-success" href="/restaurants/${ restaurant._id}"> View ${ restaurant.title}</a>
           </div>
       </div>
   </div>
</div>`;
return template;
}
