$(document).ready(function() {

  //Array of Characters
  //Variables declared with the let keyword can have Block Scope.
  let characters = {
    'Spiderman': {
      name: 'Spiderman',
      health: 150,
      attack: 8,
      imageUrl: "https://www.bleedingcool.com/wp-content/uploads/2018/06/Marvels-Spider-Man-E3-2018-3-350x350.jpg?x70969",
      enemyAttackBack: 15
    }, 
    'Iron man': {
      name: 'Iron Man',
      health: 150,
      attack: 7,
      imageUrl: "http://inn.spb.ru/images/300/DSC100375478.jpg",
      enemyAttackBack: 15
    }, 
    'Captian America': {
      name: 'Captian America',
      health: 150,
      attack: 8,
      imageUrl: "https://dumielauxepices.net/sites/default/files/styles/225x120/public/captain-america-clipart-giant-880598-2683358.jpg?itok=P_eGJfmY",
      enemyAttackBack: 20
    }, 
    'Black Panther': {
      name: 'Black Panther',
      health: 150,
      attack: 7,
      imageUrl: "https://ironheadstudio.com/wp-content/uploads/2015/04/Black-Panther-Movie-Discussion-Story-Characters-350x350.jpg",
      enemyAttackBack: 20
    }
  };
    
  var selectedCharacter;
  var Defender;
  var fighters = [];
  var Counter = 1;
  var killCount = 0;
    
    
  var renderOne = function(character, renderArea, makeChar) {
    //Character class
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    //Character Name
    var charName = $("<div class='character-name'>").text(character.name);
    //Character Image 
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
    //Character Health
    var charHealth = $("<div class='character-health'>").text(character.health);

    //Computer grabs Character Class, Name, Image, and Health
    charDiv.append(charName).append(charImage).append(charHealth);
    $(renderArea).append(charDiv);

    if (makeChar == 'enemy') {
      $(charDiv).addClass('enemy');
    } 
    else if (makeChar == 'defender') {
      Defender = character;
      $(charDiv).addClass('target-enemy');
    }
  };
    
  // Create function for DOMS
  var renderMessage = function(message) {
    var gameMesageSet = $("#gameMessage");
    var newMessage = $("<div>").text(message);
    gameMesageSet.append(newMessage);

    if (message == 'clearMessage') {
      gameMesageSet.text('');
    }
  };
    
  var renderCharacters = function(charObj, areaRender) {
    //Show characters
    if (areaRender == '#characters-section') {
      $(areaRender).empty();
      for (var key in charObj) {
        if (charObj.hasOwnProperty(key)) {
          renderOne(charObj[key], areaRender, '');
        }
      }
    }

    //Character Selected
    if (areaRender == '#selected-character') {
      $('#selected-character').prepend("Hero");       
      renderOne(charObj, areaRender, '');
      $('#attack-button').css('visibility', 'visible');
    }
    //Character to Fight
    if (areaRender == '#available-to-attack-section') {
        $('#available-to-attack-section').prepend("Choose Who You Fighting");      
      for (var i = 0; i < charObj.length; i++) {
        renderOne(charObj[i], areaRender, 'enemy');
      }
      
      //Selected enemy to fight
      $(document).on('click', '.enemy', function() {
        //select an combatant to fight
        name = ($(this).data('name'));

        if ($('#defender').children().length === 0) {
          renderCharacters(name, '#defender');
          $(this).hide();
          renderMessage("clearMessage");
        }
      });
    }

    //Show Enemy
    if (areaRender == '#defender') {
      $(areaRender).empty();
      for (var i = 0; i < fighters.length; i++) {
        //Add Enemy to Area
        if (fighters[i].name == charObj) {
          $('#defender').append("Your Enemy to Fight")
          renderOne(fighters[i], areaRender, 'defender');
        }
      }
    }
    
    //Select another Enemy
    if (areaRender == 'playerDamage') {
      $('#defender').empty();
      $('#defender').append("Your Enemy to Fight")
      renderOne(charObj, '#defender', 'defender');
    }
    
    //Character when Attacked
    if (areaRender == 'enemyDamage') {
      $('#selected-character').empty();
      renderOne(charObj, '#selected-character', '');
    }

    //Defeated Enemy
    if (areaRender == 'enemyDefeated') {
      $('#defender').empty();
      var gameStateMessage = "You have defated " + charObj.name + ", fight next enemy.";
      renderMessage(gameStateMessage);
    }
  };

  //Choose who to use
  renderCharacters(characters, '#characters-section');
  $(document).on('click', '.character', function() {
    name = $(this).data('name');
    //No player selected
    if (!selectedCharacter) {
      selectedCharacter = characters[name];
      for (var key in characters) {
        if (key != name) {
          fighters.push(characters[key]);
        }
      }
      $("#characters-section").hide();
      renderCharacters(selectedCharacter, '#selected-character');
      //Choose who to Fight Against
      renderCharacters(fighters, '#available-to-attack-section');
    }
  });
  
  // Create functions to enable actions between objects.
  $("#attack-button").on("click", function() {
    //If enemy has been choosen
    if ($('#defender').children().length !== 0) {
      //Attack
      var attackMessage = "You attacked " + Defender.name + " for " + (selectedCharacter.attack * Counter) + " damage.";
      renderMessage("clearMessage");
      //combat
      Defender.health = Defender.health - (selectedCharacter.attack * Counter);

      //If Win
      if (Defender.health > 0) {
        //If there is Enemies still to Fight
        renderCharacters(Defender, 'playerDamage');
        //Enemy Attack back
        var counterAttackMessage = Defender.name + " attacked you back for " + Defender.enemyAttackBack + " damage.";
        renderMessage(attackMessage);
        renderMessage(counterAttackMessage);

        selectedCharacter.health = selectedCharacter.health - Defender.enemyAttackBack;
        renderCharacters(selectedCharacter, 'enemyDamage');
        if (selectedCharacter.health <= 0) {
          renderMessage("clearMessage");
          restartGame("You Died, GAME OVER!!!");
          $("#attack-button").unbind("click");
        }
       else {
         renderCharacters(Defender, 'enemyDefeated');
         killCount++;
         if (killCount >= 3) {
           renderMessage("clearMessage");
           restartGame("You Saved Earth!!!!");
          }
        }
      }
      Counter++;
    } 
    
    //If theres no Enemys to Fight Against
    else {
      renderMessage("clearMessage");
      renderMessage("No enemy here.");
    }
  });
    
  //Restarts the game
  var restartGame = function(inputEndGame) {
    //Reload a Page
    var restart = $('<button class="btn">Restart</button>').click(function() {
      location.reload();
    });
    var gameState = $("<div>").text(inputEndGame);
    $("#gameMessage").append(gameState);
    $("#gameMessage").append(restart);
  }; 
});