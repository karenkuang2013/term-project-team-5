let database = function (db) {

  this.createGame = (gameId) => {
    return db.one("insert into games(game_id, game_date, card_id_discarded, is_available) values($1, $2, $3, $4) returning game_id ",
    [gameId, new Date(), 1, true])
    .then((data) => {
      console.log('gameId= '+data.game_id+' inserted to Games table')
      return data
    })
    .catch(function(err) {
      console.log(err)
    })
  }


  this.createGamePlayer = (gameId, playerId) => {
    return db.none("INSERT INTO gameplayers(game_id, player_id) VALUES ($1, $2);", [gameId, playerId])
    .then(() => {
      console.log('playerId= '+playerId+' and gameId= '+gameId+' inserted to Players table')
    })
    .catch((err) => {
      console.log(err)
    })
  }

  this.getGamePlayer = (gameId) => {
    return db.any("Select player_id from gameplayers where game_id = $1", [gameId])
    .then( (result) => {
      return result
    })
    .catch(function(err) {
      console.log(err)
    })
  }
  
   this.checkPlayerExists = (request, response) =>{   
    return db.one("select * from players where username like $1 and passwrd like $2 ", [request.body.username, request.body.password])
    .then((data) => {
        return data
    })
    .catch(function (error) {
      response.render('login', {errormsg: true} );
    });
   }
   
   this.registerNewUser = (request, response) => {
       return db.none("INSERT INTO players(first_name,last_name,e_mail,username,passwrd) VALUES($1, $2, $3, $4, $5)",   [request.body.firstname, request.body.lastname, request.body.email, request.body.username, request.body.password])
    .then(function () {
      response.redirect('/login');
    })
    .catch(function (error) {
      console.log(error);
    });
   }

  this.getAvailableGames = () => {
    return db.any("Select game_id from games where is_available = true ")
    .then ( (result) => {
      let listGameIds = []

      result.forEach( (value) => {
        listGameIds.push(value.game_id)
      })

      return listGameIds
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  this.updateAvailableGames = (gameId) => {
    return db.none("update games set is_available = false where game_id = $1", [gameId])
    .then (() => {
      console.log('Removed game ' + gameId + ' from available games');
    })
    .catch(function(err) {
      console.log(err)
    })
  }

}

module.exports = database;

/*
exports.resetDB = function() {
db.none("delete from players")
.then(function() {
console.log('Players table cleared')
})
.catch(function(err) {
console.log(err)
})

db.none("delete from games")
.then(function() {
console.log('Games table cleared')
})
.catch(function(err) {
console.log(err)
})

db.none("delete from gameplayers")
.then(function() {
console.log('Gameplayers table cleared')
})
.catch(function(err) {
console.log(err)
})

}

exports.createGame = function(gameId) {
db.none("insert into games(game_id, game_date, card_id_discarded) values($1, $2, $3)", [gameId, new Date(), 1])
.then(function() {
console.log('gameId= '+gameId+' inserted to Games table')
})
.catch(function(err) {
console.log(err)
})
}
//All values are hardcoded. Change after integration
exports.createPlayer = function(playerId) {
db.none("INSERT INTO players(player_id, first_name, last_name, e_mail, username, passwrd)"+
"values($1, $2, $3, $4, $5, $6)", [playerId, 'abc', 'xyz', 'abc@xyz.com', playerId, 'abc789'])
.then(function() {
console.log('playerId= '+playerId+' inserted to Players table')
})
.catch(function(err) {
console.log(err)
})
}

exports.createGamePlayer = function(gameId, playerId) {
db.none("INSERT INTO gameplayers(game_id, player_id) VALUES ($1, $2);", [gameId, playerId])
.then(function() {
console.log('playerId= '+playerId+' inserted to Players table')
})
.catch(function(err) {
console.log(err)
})
}
*/
