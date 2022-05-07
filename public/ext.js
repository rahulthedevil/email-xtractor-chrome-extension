let emails = {};

const showNumber = () => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(["emailData"], (data) => {
        emails = data.emailData;
        let countOfEmail = 0;
        if (emails) {
            countOfEmail = Object.keys(emails).length;
        }
        if (countOfEmail === 0) {
            document.getElementById("clearData").remove();
            document.getElementById("downloadCSV").remove();
        }
        document.querySelector(".foundNumbers").textContent = countOfEmail;
    });
}

document.getElementById("downloadCSV").onclick = (() => {
    //create CSV file data in an array
    var csvFileData = [];

    Object.keys(emails).forEach(d => {
        if (emails[d].email && emails[d].origin) {
            csvFileData.push([emails[d].email, emails[d].origin]);
        }
    });

    //define the heading for each row of the data
    var csv = 'Email,Website\n';

    //merge the data with CSV
    csvFileData.forEach(function (row) {
        csv += row.join(',');
        csv += "\n";
    });

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "email_" + new Date().getTime() + '.csv';
    hiddenElement.click();
});

document.getElementById("clearData").onclick = (() => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to clear data?")) {
        // eslint-disable-next-line no-undef
        chrome.storage.local.remove(["emailData"]);
        emails = {};
        showNumber();
    }
});

showNumber();