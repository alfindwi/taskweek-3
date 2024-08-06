function ajax(url){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("get", url, true);

        xhr.onerror = () => {
            reject ("Network Error!")
        }

        xhr.onload = () => {
            resolve(JSON.parse(xhr.responseText))
        }

        xhr.send();
    })
}



async function allTestimonial(){
    try {
        const testimonials = await ajax(
            "https://api.npoint.io/34ab2ab3b919bfc6e453"
        )
        const testimonialHTML = testimonials.map(testimonial => {
            return `
            <div class="testimoni-card">
                <img src="${testimonial.image}" alt="">
                <p>"${testimonial.content}"</p>
                <h5>- ${testimonial.author}</h5>
                <div class="star">
                    <p>${testimonial.rating}</p>
                    <i class="fa-solid fa-star fa-sm" id="star-rating"></i>
                </div>
            </div>`
        })
        
        document.getElementById("testimonials").innerHTML = testimonialHTML.join(" ");
    } catch (error) {
        alert (error)
    }
}

async function filterTestimonial(rating){
    try {
        const testimonials = await ajax(
            "https://api.npoint.io/34ab2ab3b919bfc6e453"
        )
        const filterTestimonialByRating = testimonials.filter((testimonial) => {
            return testimonial.rating == rating 
        })
    
        const testimonialHTML = filterTestimonialByRating.map((testimonial) => {
            return `
           <div class="testimoni-card">
                <img src="${testimonial.image}" alt="">
                <p>"${testimonial.content}"</p>
                <h5>- ${testimonial.author}</h5>
                <div class="star">
                    <p>${testimonial.rating}</p>
                    <i class="fa-solid fa-star fa-sm" id="star-rating"></i>
                </div>
            </div>`
        })
        
        document.getElementById("testimonials").innerHTML = testimonialHTML.join(" ");
    } catch (error) {
        alert (error)
    }
}

allTestimonial()
