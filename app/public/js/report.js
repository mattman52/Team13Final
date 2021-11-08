
const SomeApp = {
  data() {
    return {
      referees: [],
      refForm: {},
      refereeReport: [],
      currentReferee: null
      }
  },
  computed: {},
  methods: {
      fetchReferees() {
          fetch('/api/report/')
          .then( response => response.json() )
          .then( (responseJson) => {
              console.log(responseJson);
              this.referees = responseJson;
          })
          .catch( (err) => {
              console.error(err);
          })
      },
      getReportRef(evt) {   
        
        console.log("Updating!", this.refForm);

        fetch('api/report/refereeReport.php', {
            method:'POST',
            body: JSON.stringify(this.refForm),
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          })
          .then( response => response.json() )
          .then( json => {
            console.log("Returned from post:", json);
            // TODO: test a result was returned!
            this.refereeReport = json;
            
            this.resetOfferForm();
          });
      },
      resetOfferForm() {
        this.refForm = {};
      }
  },
  created() {
      this.fetchReferees();
  }

}

Vue.createApp(SomeApp).mount('#reportApp');

// code from: https://www.codexworld.com/export-html-table-data-to-csv-using-javascript/ // 

function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  // CSV file
  csvFile = new Blob([csv], {type: "text/csv"});

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // Create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Hide download link
  downloadLink.style.display = "none";

  // Add the link to DOM
  document.body.appendChild(downloadLink);

  // Click download link
  downloadLink.click();
}

function exportTableToCSV(filename) {
  var csv = [];
  var rows = document.querySelectorAll("table tr");
  
  for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");
      
      for (var j = 0; j < cols.length; j++) 
          row.push(cols[j].innerText);
      
      csv.push(row.join(","));        
  }

  // Download CSV file
  downloadCSV(csv.join("\n"), filename);
}