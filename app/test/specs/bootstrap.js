var paths = [
    'specs/models/album',
    'specs/models/picture'
];
define(paths, 
    function() {
        for(var i; i < arguments.length; i++) {
            //arguments
            console.log('argument: ' + i);
            console.log('path: ' + paths[i]);
            console.log(arguments[i]);
        }
    }
);