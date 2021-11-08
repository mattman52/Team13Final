const SomeApp = {
    data() {
      return {
        games: [],
        selectedGame: null,
        referees: [],
        refereeForm: {},
        pushing: {},
        options: [],
        selectedRef: null
      }
    },
    computed: {},
    methods: {
        prettyData(d) {
            return dayjs(d)
            .format('D MMM YYYY')
        },
        selectGame(g) {
            if (g == this.selectedGame) {
                return;
            }
            this.selectedGame= g;
            this.referees = [];
            this.fetchRefereeData(this.selectedGame);
        },
        fetchGameData() {
            fetch('/api/game/')
            .then( response => response.json() )
            .then( (responseJson) => {
                this.games = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })
        },
        fetchRefereeData(g) {
            fetch('/api/assignedTo/?game=' + g.gameId)
            .then( response => response.json() )
            .then( (responseJson) => {
                this.referees = responseJson.Inner;
                this.options = responseJson.Outer;
            })
            .catch( (err) => {
                console.error(err);
            })
            .catch( (error) => {
                console.error(error);
            });
        },
        postReferee(evt) {
            if (this.selectedRef === null) {
                this.postNewReferees(evt);
            } else {
                this.postEditReferees(evt);
            }
          },
        postNewReferees(evt) {
          this.refereeForm.gameId = this.selectedGame.gameId;       

          fetch('api/assignedTo/create.php', {
              method:'POST',
              body: JSON.stringify(this.refereeForm),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then( response => response.json() )
            .then( json => {
              // TODO: test a result was returned!
              this.referees = json.Inner;
              this.options = json.Outer;
              
              // reset the form
              this.refereeForm = {};
              this.pushing = {};
              this.fetchGameData();
            });
        },
        postEditReferees(evt) {
            this.refereeForm.gameId = this.selectedGame.gameId;           
            fetch('api/assignedTo/update.php', {
                method:'POST',
                body: JSON.stringify(this.refereeForm),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                // TODO: test a result was returned!
                this.referees = json.Inner;
                this.options = json.Outer;
                
                this.resetRefereeForm();
              });
          },
          postDeleteRef(r) {
            if (!confirm("Are you sure you want to delete the referee: "+r.lName+"?")) {
                return;
            }
            fetch('api/assignedTo/delete.php', {
                method:'POST',
                body: JSON.stringify(r),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                // TODO: test a result was returned!
                this.referees = json.Inner;
                this.options = json.Outer;
                
                this.resetRefereeForm();
              });
          },
          selectRef(r) {
            this.selectedRef = r;
            this.refereeForm = Object.assign({}, this.selectedRef);
          },
          resetRefereeForm() {
            this.selectedRef = null;
            this.refereeForm = {};
            this.fetchGameData();
          }
    },
    created() {
        this.fetchGameData();
    }
  
  }
  
  Vue.createApp(SomeApp).mount('#reportApp');
  