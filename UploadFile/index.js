document
  .getElementById("uploadBtn")
  .addEventListener("click", async function () {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const loading = document.querySelector(".loading");
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.innerHTML = ""; // Clear previous errors

    if (!file) {
      errorMessage.innerHTML = "Please select a file first.";
      return;
    }

    loading.style.display = "block"; // Show loading spinner

    try {
      const fileContent = await readFile(file);

      if (file.name.endsWith(".csv")) {
        parseCSV(fileContent);
      } else if (file.name.endsWith(".json")) {
        parseJSON(fileContent);
      } else if (file.name.endsWith(".xlsx")) {
        parseExcel(fileContent);
      } else {
        throw new Error(
          "Unsupported file format. Please upload CSV, JSON, or XLSX."
        );
      }
    } catch (error) {
      errorMessage.innerHTML = error.message;
    } finally {
      loading.style.display = "none"; // Hide loading spinner
    }
  });

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      resolve(event.target.result);
    };

    reader.onerror = function () {
      reject("Error reading file");
    };

    if (file.name.endsWith(".xlsx")) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

function parseCSV(content) {
  const rows = content.split("\n").map((row) => row.split(","));
  displayData(rows);
}

function parseJSON(content) {
  const data = JSON.parse(content);
  const rows = data.map((item) => Object.values(item));
  const headers = Object.keys(data[0]);
  displayData(rows, headers);
}

function parseExcel(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0]; // Get the first sheet
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert sheet to JSON
  displayData(jsonData);
}

function displayData(rows, headers = null) {
  const tableBody = document.getElementById("tableBody");
  const tableHeader = document.getElementById("tableHeader");

  // Clear existing table content
  tableBody.innerHTML = "";
  tableHeader.innerHTML = "";

  // If headers are provided (for JSON), display them
  if (headers) {
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      tableHeader.appendChild(th);
    });
  }

  // Loop through rows and add them to the table
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}
