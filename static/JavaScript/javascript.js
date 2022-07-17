//Backjack

let blackjack_Game = {
    "you": {"score_span": "#your_result", "div": "#your_box", "score": 0},
    "dealer": {"score_span": "#dealer_result", "div": "#dealer_box", "score": 0},
    "cards": ["2","3","4","5","6","7","8","9","10","A","Q","K","J"],
    "card_Map": {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"A":[1,11],"Q":10,"K":10,"J":10},
    "wins":0,
    "losses":0,
    "draws":0,
    "you_player": false,
    "is_stand": false,
    "turns_over": false, 
}

const YOU = blackjack_Game["you"];
const DEALER = blackjack_Game["dealer"];
const hit_sound = new Audio("static/Sounds/swish.m4a");
const win_sound = new Audio("static/Sounds/cash.mp3");
const lost_sound = new Audio("static/Sounds/aww.mp3");

document.querySelector("#button_hit").addEventListener("click", blackjackHit);
document.querySelector("#button_deal").addEventListener("click", blackjack_deal);
document.querySelector("#button_stand").addEventListener("click", dealerlogic);
document.querySelector("#button_stand").classList.add('disabled');
document.querySelector("#button_deal").classList.add('disabled');

function blackjackHit(){
    document.querySelector("#button_stand").classList.remove('disabled');
    if (blackjack_Game["is_stand"]==false){
        choice = randomcard();
        showcard(YOU, choice);
        updateScore(choice,YOU);
        blackjack_Game["you_played"] = true;

        if (YOU["score"] > 21) {
 
            blackjack_Game["turns_over"]=true;
            document.querySelector("#button_deal").classList.remove('disabled');
            document.querySelector("#button_hit").classList.add('disabled');
            document.querySelector("#button_stand").classList.add('disabled');
            showresult(computeWinner());
        }
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerlogic(){
    if (blackjack_Game["you_played"] == true){
        document.querySelector("#button_stand").classList.add('disabled');
        blackjack_Game["is_stand"]=true;
        document.querySelector("#button_hit").classList.add('disabled');

        while ( (DEALER["score"] < 16) && (blackjack_Game["turns_over"] == false)){
            choice = randomcard();
            showcard(DEALER, choice);
            updateScore(choice,DEALER);
            await sleep(700);
           }
    
        blackjack_Game["turns_over"]=true;
        document.querySelector("#button_deal").classList.remove('disabled');

        showresult(computeWinner());
        
    }

}

//generated a random card
function randomcard(){
    return blackjack_Game["cards"][Math.floor(Math.random() * 13)];
}

//deal button: resets title,images and score
function blackjack_deal() {
    if (blackjack_Game["turns_over"]==true){
        let yourImages = document.querySelector(YOU["div"]).querySelectorAll("img");
        let dealerImages = document.querySelector(DEALER["div"]).querySelectorAll("img");
        for (let i=0 ; i < yourImages.length; i++){
            yourImages[i].remove();
        }
        for (let i=0 ; i < dealerImages.length; i++){
            dealerImages[i].remove();
        }
        
        YOU["score"] =0;
        DEALER["score"]=0;
        document.querySelector(YOU["score_span"]).textContent=YOU["score"];
        document.querySelector(DEALER["score_span"]).textContent=DEALER["score"];
        document.querySelector(YOU["score_span"]).style.color="white";
        document.querySelector(DEALER["score_span"]).style.color="white";
        document.querySelector("#backjack_result").textContent="Let's play!";
        document.querySelector("#backjack_result").style.color="black";
    
        blackjack_Game["turns_over"]=false;
        blackjack_Game["is_stand"]=false;
        blackjack_Game["you_played"] = false;
        document.querySelector("#button_stand").classList.add('disabled');
        document.querySelector("#button_deal").classList.add('disabled');
        document.querySelector("#button_hit").classList.remove('disabled');
    }

}

//new card appears
function showcard(activePlayer, card){
    if (activePlayer["score"] < 21 ){
        let cardImage=document.createElement("img");
        cardImage.src = "static/Images/"+card+".png";
        document.querySelector(activePlayer["div"]).appendChild(cardImage);
        hit_sound.play();
    }
}

// updates the scores depending on card drawn, together with scores
function updateScore(card, activePlayer){

    if(activePlayer["score"] < 21 ){
        if (card=="A"){
            if (activePlayer["score"] + blackjack_Game["card_Map"][card][1] <= 21){
                activePlayer["score"] += blackjack_Game["card_Map"][card][1];
            } else {
                activePlayer["score"] += blackjack_Game["card_Map"][card][0];
            }
        } else {
            activePlayer["score"] += blackjack_Game["card_Map"][card];
        }
    
        document.querySelector(activePlayer["score_span"]).textContent=activePlayer["score"];
    }
    let current_text = document.querySelector(activePlayer["score_span"]).textContent;

    if (activePlayer["score"] > 21 && (current_text.includes("BUST"))==false){
        document.querySelector(activePlayer["score_span"]).appendChild(document.createTextNode(' BUST!'));
        document.querySelector(activePlayer["score_span"]).style.color="red";
        
    }
}


// determines winner
function computeWinner() {
    let winner;

    if (YOU["score"]>21){
        winner = DEALER;
        blackjack_Game["losses"]++;
    } else if (DEALER["score"]>21){
        winner = YOU;
        blackjack_Game["wins"]++;
    } else if (YOU["score"] > DEALER["score"]){
        winner = YOU;
        blackjack_Game["wins"]++;
    } else if (YOU["score"] < DEALER["score"]){
        winner = DEALER;
        blackjack_Game["losses"]++;
    } else if (YOU["score"] == DEALER["score"]){
        blackjack_Game["draws"]++;
    } 
    return winner;
}

//shows who the winner is
function showresult(winner){
    let message, message_color;
    if (winner==YOU){
        message = "YOU WON!";
        message_color = "green";
        document.querySelector("#wins").textContent=blackjack_Game["wins"];
        win_sound.play();
    } else if (winner==DEALER){
        document.querySelector("#losses").textContent=blackjack_Game["losses"];
        message = "YOU LOST!";
        message_color = "red";
        lost_sound.play();
    } else {
        message = "YOU TIED!";
        message_color = "black";  
        document.querySelector("#draws").textContent=blackjack_Game["draws"];
    }
    document.querySelector("#backjack_result").style.color=message_color;
    document.querySelector("#backjack_result").textContent=message;
}