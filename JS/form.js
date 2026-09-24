// console.log("form.js is connected");

let visitors = [];

document.querySelector("#visitorForm").addEventListener("submit", (event) => {

    event.preventDefault();

    let visitor = {

        visitorId: "VIS" + Date.now(),

        name: document.getElementById("name").value,
        mobile: document.getElementById("mobile").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        purpose: document.getElementById("purpose").value,
        person: document.getElementById("person").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,

        status: "Active"
    };

    console.log("Visitor:", visitor);

    fetch("http://localhost:3000/visitors", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(visitor)

    })

    .then((response) => {

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        return response.json();

    })

    .then((data) => {

        console.log("Saved in db.json:", data);

        visitors.push(data);

       
        localStorage.setItem(
            "currentVisitor",
            JSON.stringify(data)
        );

     
        window.location.href = "pass.html";

    })

    .catch((error) => {

        console.log("Error:", error);

        alert("Registration failed. Check JSON Server.");

    });

});

