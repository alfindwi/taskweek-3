// var myName = "alvin";
// console.log(myName);
// myName = "wadani"
// console.log(myName);

// let myAge = 18;
// console.log(myAge);
// myAge = 17;
// console.log(myAge);

// const myHome = "jakarta"
// console.log(myHome)
// myHome = "bali"
// console.log(myHome)

function getData() {
    let name = document.getElementById("nameInput").value;
    let email = document.getElementById("emailInput").value;
    let phone = document.getElementById("phoneInput").value;
    let position = document.getElementById("position").value;
    let address = document.getElementById("address").value;

    if (name === "") {
        alert("Tolong diisikan Nama kamu");
        return false;
    } else if (email === "") {
        alert("Tolong diisikan Email kamu");
        return false;
    } else if (phone === "") {
        alert("Tolong diisikan Nomor Telpon kamu");
        return false;
    } else if (position === "") {
        alert("Tolong diisikan Posisinya");
        return false;
    } else if (address === "") {
        alert("Tolong diisikan Alamatnya");
        return false;
    }

    let mailtoLink = `mailto:alfindwi190@gmail.com?subject=Hi%20Bang&body=Nama:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}%0ATelepon:%20${encodeURIComponent(phone)}%0APosisi:%20${encodeURIComponent(position)}%0AAlamat:%20${encodeURIComponent(address)}`;
    window.location.href = mailtoLink;

    document.getElementById("myForm").reset();
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

// testimonial

