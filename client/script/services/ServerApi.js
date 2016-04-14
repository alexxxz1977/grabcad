angular.module('app')
    .factory('ServerApi', [function() {
        var socket = io('http://localhost:9000');

        function onNewContest(callback) {
            socket.on('new_contest', function(res) {
                callback(res);
            })
        }

        function onContestEnds(callback) {
            socket.on('end_contest', callback)
        }

        function onGameResult(callback) {
            socket.on('game_result', callback)
        }

        function onScoresUpdated(callback) {
            socket.on('scores', callback)
        }

        function onUserCountUpdated(callback) {
            socket.on('users_count', callback)
        }

        function sendAnswer(answer) {
            socket.emit('answer', answer);
        }

        function onFull(callback) {
            socket.on('full', callback)
        }

        function onTimerUpdate(callback) {
            socket.on('update_timer', callback)
        }

        return {
            onNewContest: onNewContest,
            onContestEnds: onContestEnds,
            onGameResult: onGameResult,
            sendAnswer: sendAnswer,
            onFull: onFull,
            onUserCountUpdated: onUserCountUpdated,
            onTimerUpdate: onTimerUpdate,
            onScoresUpdated: onScoresUpdated
        }
    }]);