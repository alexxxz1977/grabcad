var ContestGenerator  = function() {

    var round = 0;

    function getRandomArg(from, to) {
        return parseInt(Math.random() * (to - from + 1) + from)
    }

    function isInt(n) {
        return n % 1 === 0;
    }

    function getRandomAction() {
        var rnd =  parseInt(Math.random() * 4),
            action = "";

        switch (rnd) {
            case 0: action = "+"; break;
            case 1: action = "-"; break;
            case 2: action = "*"; break;
            case 3: action = "/"; break;
        }

        return action;
    }

    function generateRealResult(args, action) {
        var result = 0;
        switch (action) {
            case "+": result = args[0] + args[1]; break;
            case "-": result = args[0] - args[1]; break;
            case "*": result = args[0] * args[1]; break;
            case "/": result = args[0] / args[1]; break;
        }

        if(!isInt(result)) {
            result = parseFloat(result.toFixed(2));
        }

        return result;
    }

    function generateShowResult(realResult) {
        if(Math.random() * 2 >= 1) {
            return realResult;
        } else {
            var plus = Math.random() * 2 >= 1,
                fakeNumber = parseInt(Math.random() * 2 + 1);

            //if(realResult - fakeNumber < 0) plus = true;

            return realResult + (plus ? fakeNumber : - fakeNumber);
        }
    }

    function generateContest() {
        var contest = {
            round: round++,
            args: {
                0: getRandomArg(1, 10),
                1: getRandomArg(1, 10)
            },
            action: getRandomAction()
        };

        contest.realResult = generateRealResult(contest.args, contest.action);
        contest.showResult = generateShowResult(contest.realResult);

        return contest;
    }


    return {
        generateContest: generateContest
    }

};




module.exports = ContestGenerator;