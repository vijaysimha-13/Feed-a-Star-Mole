function getSadInterval(){
    return Date.now() + 1000;
}

function getGoneInterval(){
    return Date.now() + (Math.floor(Math.random() * 18000) + 2000);
}


function getHungryInterval() {
    return Date.now() + (Math.floor(Math.random() * 3000) + 2000);
}


function getKingStatus() {
    return Math.random() > 0.9;
}


let points = 0;
score = document.querySelector('.score');

wormContainer = document.querySelector('.worm-container');

function moleNumber(num) {
  return {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById(`hole-${num}`)
  };
}

const moles = [];
for (let i = 0; i < 10; i++) {
  moles[i] = moleNumber(i);
}

function statusUpdate(mole) {
    switch(mole.status) {
        case 'fed':
        case 'sad':
            mole.status = 'leaving';
            mole.next = getSadInterval();
            if (mole.king) {
                mole.node.children[0].src = 'mole-game/king-mole-leaving.png';
            } else {
                mole.node.children[0].src = 'mole-game/mole-leaving.png';
            }
            break;
        case 'leaving':
            mole.status = 'gone';
            mole.next = getGoneInterval();
            mole.node.children[0].classList.add('gone');
            break;
        case 'hungry':
            mole.status = 'sad';
            mole.next = getSadInterval();
            mole.node.children[0].classList.remove('hungry');
            if (mole.king) {
                mole.node.children[0].src = 'mole-game/king-mole-sad.png';
            } else {
                mole.node.children[0].src = 'mole-game/mole-sad.png';
            }
            break;
        case 'gone':
            mole.status = 'hungry';
            mole.king = getKingStatus();
            mole.next = getHungryInterval();
            mole.node.children[0].classList.add('hungry');
            mole.node.children[0].classList.remove('gone');
            if (mole.king) {
                mole.node.children[0].src = 'mole-game/king-mole-hungry.png';
            } else {
                mole.node.children[0].src = 'mole-game/mole-hungry.png';
            }
            
            break;
    }
}

function feed(event) {
    if (event.target.tagName !== 'IMG' || !event.target.classList.contains('hungry')) {
        return;
    }

    const mole = moles[parseInt(event.target.dataset.index)]

    mole.status = 'fed';
    mole.next = getSadInterval();
    mole.node.children[0].classList.remove('hungry');
    

    if (mole.king) {
        points += 2;
        mole.node.children[0].src = 'mole-game/king-mole-fed.png';
    } else {
        points += 1;
        mole.node.children[0].src = 'mole-game/mole-fed.png';
    }

    if (points >= 10) {
        document.querySelector('.background').classList.add('gone');
        
        document.querySelector('.game-over').classList.remove('gone');
    }

    wormContainer.style.width = `${points * 10}%`;
} 

  
  let runAgainAt = Date.now() + 500;

  function nextFrame() {
    const now = Date.now();
    if (now >= runAgainAt) {
        for (let i = 0; i < moles.length; i++) {
            if (moles[i].next <= now) {
                statusUpdate(moles[i]);
            }
        }
        runAgainAt = runAgainAt + 500;
    }
    requestAnimationFrame(nextFrame);
  }

requestAnimationFrame(nextFrame);

document.querySelector('.background').addEventListener('click', feed);
