// In the name of Allah.
const mainList = document.getElementById('main-list');
const txtSearch = document.getElementById('text-search');
const btnAddTimer = document.getElementById('btn-add-timer');
const NewTimer = document.getElementById('new-timer');
const txtNewTimerName = document.getElementById('text-new-timer-name');
const errorCard = document.getElementById('error-card');
// Use a timer class. Each timer will instanciate from that class.


// TODO: add search. ===> ADDED.
// TODO: add local storage. ===> ADDED.
// TODO: add delete-timer button.  ===> ADDED.
// TODO: add a new timer after ENTER is pressed. ===> ADDED.
// TODO: add an error card when user wants to add a new timer but the input field is empty. ===> ADDED.

class Timer {
    constructor(id, isCountingUp, time, name, dateOn) {
        // isCountingUp shows the state of timer. 
        // if the timer isCountingUp, then you should set dateOn to current moment, so you can calculate the time
        // after the browser was restarted.
        // change the local storage only when state changes (isCountingUp changes); in other words, 
        // only change the local storage when one of pause or resume buttons is pressed.
        // when resume button is pressed, save the dateOn and isCountingUp,
        // when pause button is pressed, save the time, and set isCountingUp to false.
        // when page opens, check for values in local storage and if isCountingUp is set to true, 
        // calculate the time.
        this.id = id;
        this.isCountingUp = isCountingUp;
        this.time = time;
        this.name = name;
        this.interval;
        this.dateOn = dateOn;

        if (isCountingUp === true) {
            let a = ((new Date() - dateOn));
            let elapsedTimeInMilliSeconds = (new Date() - dateOn);
            let elapsedTimeInSeconds = (elapsedTimeInMilliSeconds / 1000).toFixed(2);
            this.time = this.time + parseFloat(elapsedTimeInSeconds);
            this.dateOn = new Date();
            this.toLocalStorage();
        }

    }
    paintUI() {
        const newStopWatch = document.createElement('div');
        newStopWatch.classList = 'container bg-light';
        newStopWatch.id = `stopwatch${this.id}`;
        newStopWatch.innerHTML = `
        <div id=" buttons">
            <button class="circle-button" id="btn-pause${this.id}">
            <i class="fa fa-pause" style="font-size: 2rem"></i>
            </button>
            <button class="circle-button" id="btn-resume${this.id}">
            <i class="fa fa-play" style="font-size: 2rem"></i>
            </button>
            <button class="circle-button" id="btn-delete${this.id}">
            <i class="fa fa-trash" style="font-size: 2rem; color: red;"></i>
            </button>

        </div>
        <div id="timer-and-name">
            <h1 id="text-time${this.id}">
                ${Timer.convertTimeToDisplayableString(this.time)}
            </h1>

            <h1 class="text-name">
               ${this.name}
            </h1>

        </div>
        `;

        mainList.insertBefore(newStopWatch, NewTimer);
        const btnResume = document.getElementById(`btn-resume${this.id}`);
        const btnPause = document.getElementById(`btn-pause${this.id}`);
        const btnDelete = document.getElementById(`btn-delete${this.id}`);
        const txtTime = document.getElementById(`text-time${this.id}`);

        if (this.isCountingUp) {

            this.interval = setInterval(() => {
                this.time += 0.01;

                txtTime.textContent = Timer.convertTimeToDisplayableString(this.time);
            }, 10);
        }
        btnResume.addEventListener('click', () => {

            if (this.isCountingUp === false) { // to avoid double triggering the timer.
                this.interval = setInterval(() => {
                    this.time += 0.01;
                    txtTime.textContent = Timer.convertTimeToDisplayableString(this.time);
                }, 10);
                this.isCountingUp = true;
                this.dateOn = new Date();
                this.toLocalStorage(); // saving the state in local storage.
            }
        });
        btnPause.addEventListener('click', () => {
            this.isCountingUp = false;
            clearInterval(this.interval);
            this.toLocalStorage(); // saving the state in local storage.
        });
        btnDelete.addEventListener('click', () =>
            this.deleteFromLocalStorage()
        );
    }

    toLocalStorage() {

        let timers = new Array();
        if (JSON.parse(localStorage.getItem('timers')) === null) {
            timers = [];
        }
        else {
            timers = JSON.parse(localStorage.getItem('timers'));
        }
        if (timers === null) timers = [];

        let contains = false;
        let t = this;

        for (let i = 0; i < timers.length; i++) {
            if (timers[i].id == t.id) {
                contains = true;
                timers.splice(i, 1, t);
            }
        }
        /////// This is wrong: because in the splice method you must not use timer.id, because when deleted, id 
        ///////// is not equal to index anymore.
        // timers.forEach(function (timer) {
        //     if (timer.id == t.id) {
        //         contains = true;
        //         timers.splice(timer.id, 1, t);
        //     }
        // });
        if (!contains) {
            timers.push(this);
        }
        localStorage.setItem('timers', JSON.stringify(timers));

    }

    deleteFromLocalStorage() { //deletes this timer from LocalStorage and re-paints the UI via clearUI and getFromLocalStorage.
        let timers = new Array();

        timers = JSON.parse(localStorage.getItem('timers'));

        // if (timers === null) timers = [];
        let t = this;
        for (let i = 0; i < timers.length; i++) {

            if (timers[i].id === t.id) {
                timers.splice(i, 1);
                break;
            }
        }

        localStorage.setItem('timers', JSON.stringify(timers));


        Timer.clearUI();
        Timer.getFromLocalStorage();



    }



    static getFromLocalStorage() {
        let timers = [];
        if (JSON.parse(localStorage.getItem('timers')) === null) {
            timers = [];
        }
        else {
            timers = JSON.parse(localStorage.getItem('timers'));

        }
        timers.forEach(function (timer) {
            let t = new Timer(timer.id, timer.isCountingUp, timer.time, timer.name, new Date(timer.dateOn));
            if (txtSearch.value === '') {
                t.paintUI();
            } else {
                if (timer.name.toLowerCase().includes(txtSearch.value.toLowerCase())) {
                    // deleting an element while
                    // also searching.
                    t.paintUI();
                }
            }


        });
    }

    static SearchFromLocalStorage(searchedText) { // searchs a text from the local storage and paints the ui again.
        let timers = [];
        if (JSON.parse(localStorage.getItem('timers')) === null) {
            timers = [];
        }
        else {
            timers = JSON.parse(localStorage.getItem('timers'));

        }
        timers.forEach(function (timer) {
            if (timer.name.toLowerCase().includes(searchedText.toLowerCase())) {
                let t = new Timer(timer.id, timer.isCountingUp, timer.time, timer.name, new Date(timer.dateOn));
                t.paintUI();
            }
        });
    }


    static convertTimeToDisplayableString(time) { //time is in seconds. and must have 2 floating numbers.
        let minutes = parseInt(parseInt(time) / 60);
        let seconds = parseInt(time) % 60;


        let hundredthSeconds = ((time - parseInt(time)).toFixed(2)).replace(/^0+/, '');
        if (hundredthSeconds == 1.0 || hundredthSeconds == 0.0) {
            hundredthSeconds = '.00'
        } // to add a leading zero before another zero (and avoid a bug)!

        seconds += (hundredthSeconds);
        return `${minutes}:${seconds}`;
    }

    static clearUI() { // clears ALL stopwatchs from the UI.
        let allStopWatchs = document.querySelectorAll('.container');
        allStopWatchs.forEach(container => { container.innerHTML = ''; container.classList = ''; });

    }
}

btnAddTimer.addEventListener('click', function () {
    const stopwatchs = document.querySelectorAll('.container');
    let newId = stopwatchs.length;
    if (txtNewTimerName.value !== '') {
        let t = new Timer(newId, false, 0.0, txtNewTimerName.value, new Date());
        txtNewTimerName.value = '';
        t.toLocalStorage();
        t.paintUI();
    } else {
        errorCard.classList = '';
        setTimeout(function () { errorCard.classList.add('hidden'); }, 5000);

    }
});
txtNewTimerName.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        const stopwatchs = document.querySelectorAll('.container');
        let newId = stopwatchs.length;
        if (txtNewTimerName.value !== '') {
            let t = new Timer(newId, false, 0.0, txtNewTimerName.value, new Date());
            txtNewTimerName.value = '';
            t.toLocalStorage();
            t.paintUI();
        } else {
            errorCard.classList = '';
            setTimeout(function () { errorCard.classList.add('hidden'); }, 5000);

        }
    }
});


txtSearch.addEventListener('keyup', function () {
    Timer.clearUI();
    if (txtSearch.value === '') {

        Timer.getFromLocalStorage();
    }
    else {
        Timer.SearchFromLocalStorage(txtSearch.value.toString());
    }
});

// var a = (new Date() - new Date(2022, 1, 1, 1, 1, 1) / 1000).toFixed(2);
// alert(a);
Timer.getFromLocalStorage();
