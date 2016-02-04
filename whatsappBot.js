window.hangman = {
  //could use localStorage, web sql, etc for persistent storage
  wordList : ['part', 'adventurous', 'wonderful', 'general', 'wall', 'prose', 'ambitious', 'bright', 'alluring', 'number', 'test', 'interest', 'ray', 'cynical', 'offer', 'squeeze', 'sink', 'smooth', 'adorable', 'notebook', 'gullible', 'sweet', 'hunt', 'comparison', 'flippant', 'spark', 'guarded', 'food', 'cure', 'dirt', 'zany', 'weigh', 'wet', 'delightful', 'yellow', 'foamy', 'file', 'untidy', 'jail', 'ethereal', 'zip', 'used', 'useless', 'head', 'fairies', 'pipe', 'purpose', 'strap', 'hallowed', 'nine'],
  currentWord : '',
  guesses : [],
  players : [],
  numRemaining : 9,
  currentDashes : '',
  makeDashes : function () {
    var outString = '';
    for (var i = 0; i < this.currentWord.length; i ++) {
      outString += '-';
    }
    return outString;
  },
  tryGuess : function (a) {
    var index = this.currentWord.indexOf(a);
    var successful = false;
    var dashArray = this.currentDashes.split('');
    while (index != -1) {
      dashArray[index] = a;
      this.currentWord = this.currentWord.replace(a,'-');
      index = this.currentWord.indexOf(a);
      successful = true;
    }
    this.currentDashes = dashArray.join('');
    return successful;
  },
  newGame : function () {
    this.currentWord = this.wordList[Math.floor(Math.random()*this.wordList.length)];
    this.guesses = [];
    this.players = [];
    this.numRemaining = 9;
    this.currentDashes = this.makeDashes();
  },
  init : function() {
    this.currentWord = this.wordList[Math.floor(Math.random()*this.wordList.length)];
    this.currentDashes = this.makeDashes();
  },
  whatsappInteractions : function (e) {
    //e is the interface to whatsapp. More info on it soon.
    //Or use the browser developer tools to get insight into it.
    if (e.from === 'xxxxxxxxxxxx-xxxxxxxxxx@g.us' && !e.isSentByMe) {
    //if (true) {
    if (e.body.match(/^!h+/)) {
      var cmd = e.body.split(' ')[1];
      switch (cmd) {
        case 'help' :
            var helpMsg = 'send "!h status" for current status of game.';
            helpMsg += '\nsend "!h a" to guess letter a for current word.';
            e.chat.sendMessage(helpMsg);
            break;
          case 'status' :
            var msg = 'current word is: ' + hangman.currentDashes;
            msg += '\nletters guessed: ' + hangman.guesses.toString();
            msg += '\nnumber of remaining guesses are: ' + hangman.numRemaining;
            msg += '\ncorrect guesses by: ';
            for (var i = 0; i < hangman.players.length; i++) {
              msg += '\n' + hangman.players[i];
            }
            e.chat.sendMessage(msg);
            break;
          default :
            var msg = '';
            if (typeof cmd !== 'undefined' && cmd.length == 1) {
              if(hangman.guesses.indexOf(cmd) == -1) {
                hangman.guesses.push(cmd);
                if (hangman.tryGuess(cmd)) {
                  if (hangman.players.indexOf(e.displayName()) == -1)
                    hangman.players.push(e.displayName());
                  msg = 'correct! ' + hangman.currentDashes;
                }else{
                  msg = 'incorrect.';
                  hangman.numRemaining--;
                }
                msg += '\ntries remaining: ' + hangman.numRemaining;
                if (hangman.numRemaining == 0 || hangman.currentDashes.indexOf('-') == -1) {
                  hangman.newGame();
                  msg += '\n\nNew word: ' + hangman.currentDashes;
                  msg += '\ntries remaining: ' + hangman.numRemaining;
                }
              }else{
                msg = 'This letter was already guessed. Try another.';
              }
            }else{
              msg = 'invalid input.'
              msg += '\nsend "!h help" for list of commands';
            }
            e.chat.sendMessage(msg);
       }
    }
    }
  }
};
hangman.init();
//will work with only the chats you already have in your whatsapp chats pane.
for (var i = 0; i < Store.Chat.models.length; i++) {
  Store.Chat.models[i].listenTo(Store.Chat.models[i].msgs, 'add', hangman.whatsappInteractions );
}
