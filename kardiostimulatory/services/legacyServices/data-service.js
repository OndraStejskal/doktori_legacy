let events = [
    {
        id: 1,
        patientId: 2,
        priority: "CRITICAL",
        title: "Událost číslo 1 s kritickou prioritou",
        description: "Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. Ut enim ad minim veniam."
    },
    {
        id: 2,
        patientId: 3,
        priority: "LOW",
        title: "Událost číslo 2 s nízkou prioritou",
        description: "Nullam rhoncus aliquam metus. Lorem ipsum dolor sit amet."
    },
    {
        id: 3,
        patientId: 1,
        priority: "LOW",
        title: "Událost číslo 3 s nízkou prioritou",
        description: "Pellentesque sapien. Etiam commodo dui eget wisi. Vestibulum fermentum tortor id mi."
    },
    {
        id: 4,
        patientId: 2,
        priority: "HIGH",
        title: "Událost číslo 4 s vysokou prioritou",
        description: "Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis."
    },
    {
        id: 5,
        patientId: 2,
        priority: "MEDIUM",
        title: "Událost číslo 5 se střední prioritou",
        description: "Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. Ut enim ad minim veniam."
    },
    {
        id: 6,
        patientId: 1,
        priority: "CRITICAL",
        title: "Událost číslo 6 s kritickou prioritou",
        description: "Fusce tellus odio, dapibus id fermentum quis, suscipit id erat."
    },
    {
        id: 7,
        patientId: 3,
        priority: "MEDIUM",
        title: "Událost číslo 7 se střední prioritou",
        description: "Nullam rhoncus aliquam metus. Lorem ipsum dolor sit amet."
    },
    {
        id: 8,
        patientId: 4,
        priority: "LOW",
        title: "Událost číslo 8 s nízkou prioritou",
        description: "Pellentesque sapien. Etiam commodo dui eget wisi."
    }
];

let patients = [
    {
        id: 1,
        name: "Jan Testovaný",
        address: "Praha, Testovací ulice 5"
    },
    {
        id: 2,
        name: "Tereza Testovaná",
        address: "Brno, Testovací ulice 13"
    },
    {
        id: 3,
        name: "Oldřich Testovaný",
        address: "Písek, Testovací ulice 8"
    },
    {
        id: 4,
        name: "Ignác Testovaný",
        address: "Ostrava, Testovací ulice 2"
    },
];


function getAllEvents () {    
    return events;
}

function getAllPatients () {    
    return patients;
}

function getPatient(patId) { 
    let patient = patients.find(pat => pat.id == patId);
    let patientEvents = events.filter(ev => ev.patientId == patId)
    patient.events = patientEvents;

    return patient;
}

function getEvent(evId) { 
    let event = events.find(ev => ev.id == evId);
    return event;
}

module.exports = {
    getAllEvents, getPatient, getEvent, getAllPatients
};