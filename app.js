const root = document.documentElement;

const fretboard = document.querySelector(".fretboard");
const selectedInstrumentSelector = document.querySelector('#instrument-selector');
const accidentalSelector = document.querySelector(".accidental-selector");
const numberOfFretsSelector = document.querySelector("#number-of-frets");
const showAllNotesSelector = document.querySelector('#show-all-notes');
const showMultipleNotesSelector = document.querySelector('#show-multiple-notes');
const noteNameSection = document.querySelector('note-name-section');
let numberOfFrets = 20;

let allNotes;
let showMultipleNotes = false;
const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPositions = [12, 24];

const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];



const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass(4-strings)': [7, 2, 9, 4],
    'Bass(5-strings)': [7, 2, 9, 4, 11],
    'Ukulele': [9, 4, 0, 7]

};
const instrumentFretboardHeights = {
    'Guitar': 300,
    'Bass(4-strings)': 275,
    'Bass(5-strings)': 275,
    'Ukulele': 250

};

let selectedInstrument = 'Guitar';
let instrumentFretboardHeight = 300;
let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
let accidentals = 'flats';
const app = {
    init() {
        this.setupFretboard();
        this.setupSelectedInstrumentSelector();
        this.setupEventListeners();
    },
    setupFretboard() {
        fretboard.innerHTML = '';
        // Add strings to fretboard
        root.style.setProperty('--fretboard-height', instrumentFretboardHeight);
        root.style.setProperty('--number-of-strings', numberOfStrings);
        for (let i = 0; i < numberOfStrings; i++) {
            let string = tools.createElement("div");
            string.classList.add("string");
            fretboard.appendChild(string);

            //Create Frets
            for (let fret = 0; fret <= numberOfFrets; fret++) {
                let noteFret = tools.createElement("div");
                noteFret.classList.add("note-fret");


                let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]), accidentals);
                noteFret.setAttribute('data-note', noteName);
                //Add Single Fretmarks
                if (i == 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
                    noteFret.classList.add('single-fretmark');
                }
                if (i == 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
                    let doubleFretMark = tools.createElement('div');
                    doubleFretMark.classList.add('double-fretmark');
                    noteFret.appendChild(doubleFretMark);

                }
                string.appendChild(noteFret);
            }
        }
        allNotes = document.querySelectorAll('.note-fret');//toggle multiple notes
    },
    //This function gives us the note name when hovered around a fret
    generateNoteNames(noteIndex, accidentals) {
        noteIndex = noteIndex % 12;
        let noteName;
        if (accidentals === 'flats') {
            noteName = notesFlat[noteIndex];
        }
        else if (accidentals === 'sharps') {
            noteName = notesSharp[noteIndex];
        }
        return noteName;
    },
    setupSelectedInstrumentSelector() {
        for (instrument in instrumentTuningPresets) {
            let instrumentOption = tools.createElement('option', instrument);
            selectedInstrumentSelector.appendChild(instrumentOption);
        }
    },
    setupNoteName() {
        let noteNames;
        if (accidentals === 'flats') {
            noteNames = notesFlat;
        } else {
            noteNames = notesSharp;
        }
        noteNames.forEach()
    },
    showNoteDots(event) {
        if (event.target.classList.contains('note-fret')) {
            if (showMultipleNotes) {
                app.toggleMultipleNotes(event.target.dataset.note, 1);
            } else {
                event.target.style.setProperty('--noteDotOpacity', 1);
            }

        }
    },
    hideNoteDots(event) {
        if (showMultipleNotes) {
            app.toggleMultipleNotes(event.target.dataset.note, 0);
        }
        else {
            event.target.style.setProperty('--noteDotOpacity', 0);
        }
    },
    setupEventListeners() { //Adding event listener to show the note when hovered over a fret
        fretboard.addEventListener('mouseover', this.showNoteDots);

        //event listener to remove the note name on the hovered fret after the mouse is done with hovering
        fretboard.addEventListener('mouseout', this.hideNoteDots);

        //the user can convert the fretboard to different instruments made available in the dropdown menu
        selectedInstrumentSelector.addEventListener('change', (event) => {
            selectedInstrument = event.target.value;
            numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
            instrumentFretboardHeight = instrumentFretboardHeights[selectedInstrument];

            this.setupFretboard();
        });

        //to change note view style to sharps or flats
        accidentalSelector.addEventListener('click', (event) => {
            if (event.target.classList.contains('acc-select')) {
                accidentals = event.target.value;
                this.setupFretboard();
            }
            else { return; }
        });
        //to change number of frets
        numberOfFretsSelector.addEventListener('change', () => {
            numberOfFrets = numberOfFretsSelector.value;
            this.setupFretboard();
        });

        showAllNotesSelector.addEventListener('change', () => {
            if (showAllNotesSelector.checked) {
                root.style.setProperty('--noteDotOpacity', 1);
                fretboard.removeEventListener('mouseover', this.showNoteDots);
                fretboard.removeEventListener('mouseout', this.hideNoteDots);
                this.setupFretboard();
            } else {
                root.style.setProperty('--noteDotOpacity', 0);
                fretboard.addEventListener('mouseover', this.showNoteDots);
                fretboard.addEventListener('mouseout', this.hideNoteDots);
                this.setupFretboard();
            }
        });
        showMultipleNotesSelector.addEventListener('change', () => {
            showMultipleNotes = !showMultipleNotes;

        });
    },
    //to show all the notes of a particular note all across the fretboard.
    toggleMultipleNotes(noteName, opacity) {

        for (let i = 0; i < allNotes.length; i++) {
            if (allNotes[i].dataset.note === noteName)//every note fret has a data attribute called 'data-note' which tells us the
            {                                     //name of that particular note on a fret
                allNotes[i].style.setProperty('--noteDotOpacity', opacity);
            }
        }
    }

};
const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    },
};
app.init();
