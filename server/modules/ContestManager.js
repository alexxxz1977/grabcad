var contestGenerator = require('./ContestGenerator')();

var ContestManager = function (duration, socket) {
    const MAX_USER_COUNT = 10;
    const BETWEEN_CONTEST_DURATION = 5;

    var io = socket ? socket : null,
        currentContest = null,
        allClients = [];

    function newContest() {
        console.log("once");
        currentContest = contestGenerator.generateContest();
        io.emit("new_contest", generateShowContest());
    }

    function generateShowContest() {
        return {
            round: currentContest.round,
            args: currentContest.args,
            action: currentContest.action,
            result: currentContest.showResult
        };
    }

    function incrementScores(socket) {
        socket.emit("scores", ++socket.scores);
    }

    function decrementScores(socket) {
        socket.emit("scores", --socket.scores);
    }

    function endContest() {
        currentContest = null;
        io.emit("end_contest");
        startTimer(BETWEEN_CONTEST_DURATION, newContest);
    }

    function updateUserCount() {
        io.emit("users_count", allClients.length);
    }

    function full(socket) {
        socket.emit('full');
        socket.disconnect();
    }

    function updateTimer(seconds) {
        io.emit('update_timer', seconds);
    }

    function correctAnswerHandler(socket) {
        if (!currentContest.winner) {
            currentContest.winner = true;
            incrementScores(socket);
            return true;
        }

        return false;
    }

    function incorrectAnswerHandler(socket) {
        decrementScores(socket);
        return false;
    }

    function sendCurrentContest(socket) {
        if(currentContest) socket.emit('new_contest', generateShowContest());
        return false;
    }

    function startTimer(duration, callback) {
        var secondsPassed = 0;
        updateTimer(duration);
        var eachSecond = setInterval(function() {
            secondsPassed++;
            updateTimer(duration - secondsPassed);
            if(secondsPassed == duration) {
                clearInterval(eachSecond);
                callback();
            }
        }, 1000);
    }

    function listenAnswers(socket) {
        socket.on('answer', function (answer) {
            if (currentContest) {
                socket.answeredRound = currentContest.round;
                var isAnswerCorrect = (answer == (currentContest.showResult == currentContest.realResult));
                var win = isAnswerCorrect ?
                    correctAnswerHandler(socket) :
                    incorrectAnswerHandler(socket);

                socket.emit("game_result", {
                    win: win
                });

                if(win) {
                    endContest();
                    return;
                }

                var isAllAnswer = true;
                allClients.forEach(function(v) {
                   if(v.answeredRound != currentContest.round) {
                       isAllAnswer = false;
                   }
                });
                if(isAllAnswer) endContest();

                ;
            }


        });
    }

    function start(socket) {
        if (socket) io = socket;
        console.log("START");
        startTimer(BETWEEN_CONTEST_DURATION, newContest);

        io.on('connection', function (socket) {
            if (allClients.length >= MAX_USER_COUNT) {
                full(socket);
                return;
            }

            socket.scores = 0;
            allClients.push(socket);
            updateUserCount();
            if(currentContest)
                sendCurrentContest(socket);
            listenAnswers(socket);

            socket.on('disconnect', function () {
                var index = allClients.indexOf(socket);
                allClients.splice(index, 1);
                updateUserCount();
				
				var isAllAnswer = true;
				console.log(allClients);
                allClients.forEach(function(v) {
                    if(v.answeredRound != currentContest.round) {
                        isAllAnswer = false;
                    }
                });
                if(isAllAnswer) endContest();
            });

        });


    }

    function stop() {
       // clearInterval(contestInterval);
    }

    return {
        start: start,
        stop: stop
    }

};


module.exports = ContestManager;