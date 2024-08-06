let blog = [];

function addBlog(event) {
    event.preventDefault();

    let projectName = document.getElementById('projectInput').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    let technologies = Array.from(document.querySelectorAll('.checkbox-grid input:checked')).map(cb => cb.value);
    let description = document.getElementById('descInput').value;
    let images = document.getElementById('inputimage').files;

    if (projectName === "") {
        alert("Nama Project Harus di Isi");
        return;
    } else if (startDate === "") {
        alert("Start Date Harus di Isi");
        return;
    } else if (endDate === "") {
        alert("End Date Harus di Isi");
        return;
    } else if (technologies.length === 0) {
        alert("Technologies Harus di Isi");
        return;
    } else if (description === "") {
        alert("Description Harus di Isi");
        return;
    } else if (images.length === 0) {
        alert("Images blm di isi");
        return;
    }

    images = URL.createObjectURL(images[0]);
    console.log(images);

    let duration = calculateDuration(startDate, endDate);

    let group = {
        projectName,
        startDate,
        endDate,
        description,
        technologies,
        images,
        duration,
        postAt: new Date()
    };

    blog.push(group);
    console.log(blog);

    renderProject();
    document.getElementById("form").reset();
}



function calculateDuration(start, end) {
    let startDate = new Date(start);
    let endDate = new Date(end);
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    if (endDate.getDate() < startDate.getDate()) {
        months -= 1;
    } else if (months <= 0) {
        let days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        return { months: 0, days: days <= 0 ? 0 : days };
    }
    return { months: months, days: 0 };
}

function getDistanceTime(time){
    let postTime = time
    let currentTime = new Date();
    let distanceTime = currentTime - postTime;

    let ms = 1000;
    let secInHour = 3600;
    let secInMinute = 60;
    let hourInDay = 24;

    let distanceTimeInSec = Math.floor(distanceTime / ms);
    let distanceTimeInMinute = Math.floor(distanceTime / (ms * secInMinute));
    let distanceTimeInHour = Math.floor(distanceTime / (ms * secInHour));
    let distanceTimeInDay = Math.floor(distanceTime / (ms * secInHour * hourInDay));

    if (distanceTimeInDay > 0) {
        return `${distanceTimeInDay} days ago`;
    } else if (distanceTimeInHour > 0) {
        return `${distanceTimeInHour} hours ago`;
    } else if (distanceTimeInMinute > 0) {
        return `${distanceTimeInMinute} minutes ago`;
    } else {
        return `${distanceTimeInSec} seconds ago`;
    }

}

function updateTimes() {
    document.querySelectorAll('.time').forEach(element => {
        let postTime = new Date(element.getAttribute('data-post-time'));
        let timeText = getDistanceTime(postTime);
        element.textContent = timeText;
    });
}

function renderProject() {
    document.getElementById("new-page").innerHTML = "";

    for (let i = 0; i < blog.length; i++) {
        let duration = "";

        if (blog[i].duration.months > 0) {
            duration = `${blog[i].duration.months} bulan`;
        } 
        if (blog[i].duration.days > 0) {
            duration += `${blog[i].duration.days} hari`;
        }

    let time = getDistanceTime(blog[i].postAt)

        document.getElementById("new-page").innerHTML += `
         <div class="card">
            <a href="project.html?id=${i}" target="_blank">
                <img src="${blog[i].images}" alt="">
            </a>
            <h3>${blog[i].projectName}</h3>
            <p>Durasi: ${duration}</p>
            <p>
                ${blog[i].description}
            </p>
            <div class="image-card">
                <img src="./assets/img/ps.png" alt="">
                <img src="./assets/img/andro.png" alt="">
                <img src="./assets/img/js.png" alt="">
            </div>
            <div class="button-card">
                <button class="edit-card">Edit</button>
                <button class="edit-card">Delete</button>
            </div>
            <p class="time" id="time">${time}</p>
        </div>`;
    }

}

function clickHamburger() {
    let element = document.getElementById("hamburger-menu");
    element.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".hamburger-menu a");
    links.forEach(link => {
        link.addEventListener("click", () => {
            document.getElementById("hamburger-menu").classList.remove("show");
        });
    });
});


