
const SomeApp = {
    data() {
      return {
        selected: null,
        content: [],
        form: {},
        selectedContent: null
      }
    },
    computed: {},
    methods: {
        selection(s) {
            if (s == this.selected) {
                return;
            }
            this.selected = s;
            this.selectedContent = null;
            this.form = {};
        },
        fetchInfoData() {
            fetch('/api/assignor/')
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.content = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })
            .catch( (error) => {
                console.error(error);
            });
        },
        postForm(evt) {
          if (this.selectedContent === null) {
              this.postNew(evt);
          } else {
              this.postEdit(evt);
          }
        },
        postNew(evt) { 
          this.form.type = this.selected;
          console.log("Creating!", this.form);
  
          fetch('api/assignor/create.php', {
              method:'POST',
              body: JSON.stringify(this.form),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then( response => response.json() )
            .then( json => {
              console.log("Returned from post:", json);
              // TODO: test a result was returned!
              this.content = json;
              
              this.resetForm();
            })
            .catch( err => {
              alert("Something went horribly wrong!");
            });
        },
        postEdit(evt) {          
          this.form.type = this.selected;
          console.log("Updating!", this.form);
  
          fetch('api/assignor/updateGame.php', {
              method:'POST',
              body: JSON.stringify(this.form),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then( response => response.json() )
            .then( json => {
              console.log("Returned from post:", json);
              // TODO: test a result was returned!
              this.content = json;
              this.resetForm();
            });
        },
        postDelete(g) {
          g.type = this.selected;
          console.log("Updating!", g);
          if(this.selected == 'G'){
            if (!confirm("Are you sure you want to delete: "+g.field+"? This will delete all referees assigned to the game and the game data.")) {
                return;
            }
          }else{
            if (!confirm("Are you sure you want to delete: "+g.fName+" "+g.lName+"? This will delete all assignments for this referee.")) {
              return;
            }
          }
          fetch('api/assignor/deleteGame.php', {
              method:'POST',
              body: JSON.stringify(g),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then( response => response.json() )
            .then( json => {
              console.log("Returned from post:", json);
              // TODO: test a result was returned!
              this.content = json;
              this.resetForm();
            });
        },
        select(o) {
          this.selectedContent = o;
          this.form = Object.assign({}, this.selectedContent);
        },
        resetForm() {
          this.selectedContent = null;
          this.form = {};
        }
    },
    created() {
        this.fetchInfoData();
    }
  
  }
  
  Vue.createApp(SomeApp).mount('#assignmentApp');
  