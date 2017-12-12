'use strict';

const path = require('path');
const fs = require('fs');

const base_path = path.resolve(__dirname, '../');

let moduls = ['web', 'acceptor', 'mq', 'storage'];



moduls.forEach(item => {
    let root_path = base_path + '/badjs-' + item; 
    let old_json = require(root_path + '/project.json');
    let example_json = require(root_path + '/project.example.json');


    let target_json = copy(old_json, example_json);
    

    fs.writeFile( root_path + '/project.json', JSON.stringify( target_json, null, 2 ), 'utf8' , () => {

    });
})


function copy(origin, target) {
    
    for (let i in origin ) {
        if (typeof origin[i] === 'object') {
            copy(origin[i], target[i]);
        } else {
            target[i] = origin[i];
        }
    }

    return target;

}

