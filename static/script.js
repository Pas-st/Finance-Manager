let data = [];
let editId = null;

async function loadData() {
    const res = await fetch("/api/data");
    data = await res.json();
    updateDashboard();
    renderTable();
}

function saveData() {
    fetch("/api/data", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

function showDashboard() {
    switchPage("dashboard");
}

function showTransactions() {
    switchPage("transactions");
}

function switchPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function updateDashboard() {
    let einnahmen = 0;
    let ausgaben = 0;

    data.forEach(e => {
        if (e.type === "Einnahme") einnahmen += Number(e.amount);
        else ausgaben += Number(e.amount);
    });

    document.getElementById("summary").innerHTML =
        `Einnahmen: ${einnahmen} €<br>
         Ausgaben: ${ausgaben} €<br>
         Saldo: ${einnahmen - ausgaben} €`;
}

function renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    let filtered = [...data];
    const filter = document.getElementById("filter").value;
    const sort = document.getElementById("sort").value;

    if (filter !== "Alle") {
        filtered = filtered.filter(e => e.type === filter);
    }

    filtered.sort((a,b)=>{
        const da = a.date.split(".").reverse().join("");
        const db = b.date.split(".").reverse().join("");
        return sort === "asc" ? da.localeCompare(db) : db.localeCompare(da);
    });

    filtered.forEach(e=>{
        tbody.innerHTML += `
        <tr>
            <td>${e.date}</td>
            <td>${e.amount}</td>
            <td>${e.type}</td>
            <td>${e.description}</td>
            <td>
                <button onclick="editEntry(${e.__id})">✏️</button>
                <button onclick="deleteEntry(${e.__id})">🗑</button>
            </td>
        </tr>`;
    });
}

function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    editId = null;
}

function saveEntry() {
    const entry = {
        date: date.value,
        amount: amount.value,
        type: type.value,
        description: description.value,
        __id: editId || Date.now()
    };

    if (editId) {
        data = data.map(e => e.__id === editId ? entry : e);
    } else {
        data.push(entry);
    }

    saveData();
    closePopup();
    updateDashboard();
    renderTable();
}

function editEntry(id) {
    const e = data.find(x=>x.__id === id);
    date.value = e.date;
    amount.value = e.amount;
    type.value = e.type;
    description.value = e.description;
    editId = id;
    openPopup();
}

function deleteEntry(id) {
    data = data.filter(e=>e.__id !== id);
    saveData();
    updateDashboard();
    renderTable();
}

loadData();