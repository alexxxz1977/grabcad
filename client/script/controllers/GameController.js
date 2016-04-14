angular.module('app')
    .controller('GameController', ['$scope', 'ServerApi', '$timeout', function($scope, ServerApi, $timeout) {
        $scope.contests = [];
        $scope.usersCount = 0;
        $scope.userScores = 0;
        $scope.timeToNextContest = null;

        ServerApi.onNewContest(function(contest) {
            $timeout(function() {
                $scope.timeToNextContest = null;
                $scope.contests.push({
                    round: contest.round,
                    expression: contest.args[0] + " " +
                    contest.action + " " +
                    contest.args[1] + " = " +
                    contest.result,
                    answer: null,
                    result: null
                });
            });
        });

        $scope.sendAnswer = function(answer) {
            $scope.contests[$scope.contests.length - 1].answer = answer;
            ServerApi.sendAnswer(answer);
        };

        ServerApi.onUserCountUpdated(function(count) {
            $timeout(function() {
                $scope.usersCount = count;
            });
        });

        ServerApi.onFull(function() {
            $timeout(function() {
                $scope.full = true;
            });
        });

        ServerApi.onScoresUpdated(function(scores) {
            $timeout(function() {
                $scope.userScores = scores;
            });
        });

        ServerApi.onGameResult(function(response) {
            $timeout(function() {
                var contest = $scope.contests[$scope.contests.length - 1];
                contest.result = response.win ? "OK" : "FAILED";
            });
        });

        ServerApi.onContestEnds(function() {
            $timeout(function() {
                var contest = $scope.contests[$scope.contests.length - 1];
                if(!contest) return;
                if(contest.answer == null) {
                    contest.answer = 'MISSED';
                    contest.result = 'FAILED';
                }
            });
        });

        ServerApi.onTimerUpdate(function(seconds) {
            $timeout(function() {
                $scope.timeToNextContest = seconds;
            });
        });
    }]);