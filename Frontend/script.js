// This is the fixed address of the Spring Boot controller. There is no URL field on the page.
const API_BASE_URL = "http://localhost:8080/api/students";

const idInput = document.getElementById("studentId");
const nameInput = document.getElementById("studentName");
const emailInput = document.getElementById("studentEmail");
const message = document.getElementById("message");
const tableBody = document.getElementById("studentTableBody");
const studentCount = document.getElementById("studentCount");

// fetch sends an HTTP request. This helper reads a JSON response when the API sends one.
async function readResponse(response) {
    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            // Some controllers return plain text instead of JSON. Keep it as text.
            data = text;
        }
    }

    // fetch only rejects for network problems. Check response.ok for 4xx/5xx API errors.
    if (!response.ok) {
        const detail = typeof data === "string" ? data : data?.message;
        throw new Error(detail || `Request failed (status ${response.status}).`);
    }

    return data;
}

function showMessage(text, type = "") {
    message.textContent = text;
    message.className = `message ${type}`;
}

function getId() {
    const id = idInput.value.trim();
    if (!id) throw new Error("Enter an ID first.");
    return id;
}

function getStudentData() {
    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!id || !name || !email) {
        throw new Error("Enter ID, name, and email.");
    }

    return {
        id: Number(id),
        name: name,
        email: email
    };
}

function fillForm(student) {
    idInput.value = student.id ?? "";
    nameInput.value = student.name ?? "";
    emailInput.value = student.email ?? "";
}

function renderStudents(students) {
    tableBody.innerHTML = "";
    studentCount.textContent = `${students.length} student${students.length === 1 ? "" : "s"}`;

    if (students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="empty">No students found.</td></tr>';
        return;
    }

    // textContent is used so student names/emails are displayed as text, not page markup.
    students.forEach((student) => {
        const row = document.createElement("tr");
        [student.id, student.name, student.email].forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

document.getElementById("createButton").addEventListener("click", async () => {
    try {
        const student = getStudentData();
        // JSON.stringify changes the JavaScript object into JSON text for the Spring Boot API.
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
        const createdStudent = await readResponse(response);
        if (createdStudent && typeof createdStudent === "object") fillForm(createdStudent);
        showMessage("Student created successfully.", "success");
    } catch (error) {
        showMessage(error.message || "Could not create the student.", "error");
    }
});

document.getElementById("getByIdButton").addEventListener("click", async () => {
    try {
        const id = getId();
        const response = await fetch(`${API_BASE_URL}/get/${encodeURIComponent(id)}`);
        const student = await readResponse(response);
        fillForm(student);
        renderStudents([student]);
        showMessage("Student loaded.", "success");
    } catch (error) {
        showMessage(error.message || "Could not find that student.", "error");
    }
});

document.getElementById("getAllButton").addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/getAll`);
        const students = await readResponse(response);
        renderStudents(Array.isArray(students) ? students : []);
        showMessage("Student list loaded.", "success");
    } catch (error) {
        showMessage(error.message || "Could not load students.", "error");
    }
});

document.getElementById("updateButton").addEventListener("click", async () => {
    try {
        const id = getId();
        const student = getStudentData();
        const response = await fetch(`${API_BASE_URL}/update/${encodeURIComponent(id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
        const updatedStudent = await readResponse(response);
        if (updatedStudent && typeof updatedStudent === "object") fillForm(updatedStudent);
        showMessage("Student updated successfully.", "success");
    } catch (error) {
        showMessage(error.message || "Could not update the student.", "error");
    }
});

document.getElementById("deleteButton").addEventListener("click", async () => {
    try {
        const id = getId();
        const response = await fetch(`${API_BASE_URL}/delete/${encodeURIComponent(id)}`, {
            method: "DELETE"
        });
        await readResponse(response);
        idInput.value = "";
        nameInput.value = "";
        emailInput.value = "";
        showMessage("Student deleted successfully.", "success");
    } catch (error) {
        showMessage(error.message || "Could not delete the student.", "error");
    }
});
