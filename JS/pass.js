
document.addEventListener("DOMContentLoaded", () => {
    const loadingEl = document.getElementById("loading");
    const errorMessageEl = document.getElementById("errorMessage");
    const errorTextEl = document.getElementById("errorText");
    const passContentEl = document.getElementById("passContent");

    const urlParams = new URLSearchParams(window.location.search);
    const visitorId = urlParams.get("visitorId");

    console.log("Extracted visitorId:", visitorId);

    if (visitorId) {
        fetchVisitorDetails(visitorId);
    } else {
        const storedVisitor = localStorage.getItem("currentVisitor");
        if (storedVisitor) {
            try {
                const visitorData = JSON.parse(storedVisitor);
                console.log("Loaded from localStorage fallback:", visitorData);
                renderVisitorPass(visitorData);
            } catch (err) {
                showError("Invalid stored visitor data.");
            }
        } else {
            showError("No Visitor ID provided in URL and no recent visitor found in local storage.");
        }
    }

    function fetchVisitorDetails(id) {
        const apiUrl = `http://localhost:3000/visitors?visitorId=${encodeURIComponent(id)}`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetch response from db.json:", data);
                if (Array.isArray(data) && data.length > 0) {
                    renderVisitorPass(data[0]);
                } else {
                    attemptLocalStorageFallback("Visitor ID not found in database.");
                }
            })
            .catch((error) => {
                console.warn("JSON server fetch failed, attempting local storage fallback:", error);
                attemptLocalStorageFallback("JSON server is offline or unreachable.");
            });
    }

    function renderVisitorPass(visitor) {
        document.getElementById("displayVisitorName").textContent = visitor.name || "N/A";
        document.getElementById("displayVisitorId").textContent = visitor.visitorId || "N/A";
        document.getElementById("displayMobile").textContent = visitor.mobile || "N/A";
        document.getElementById("displayEmail").textContent = visitor.email || "N/A";
        document.getElementById("displayPurpose").textContent = visitor.purpose || "N/A";
        document.getElementById("displayPerson").textContent = visitor.person || "N/A";
        document.getElementById("displayDate").textContent = visitor.date || "N/A";
        document.getElementById("displayTime").textContent = visitor.time || "N/A";
        document.getElementById("displayAddress").textContent = visitor.address || "N/A";

        if (visitor.status) {
            document.getElementById("statusBadge").textContent = visitor.status;
        }

        const qrData = encodeURIComponent(
            `Visitor Pass | ID: ${visitor.visitorId} | Name: ${visitor.name} | Purpose: ${visitor.purpose}`
        );
        document.getElementById("passQrCode").src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

        
        loadingEl.classList.add("hidden");
        errorMessageEl.classList.add("hidden");
        passContentEl.classList.remove("hidden");
    }

    
    function showError(message) {
        loadingEl.classList.add("hidden");
        passContentEl.classList.add("hidden");
        errorTextEl.textContent = message;
        errorMessageEl.classList.remove("hidden");
    }
});