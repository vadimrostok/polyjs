var paths = [
    'specs/views/back/controls',
    'specs/views/common/notification',
    'specs/views/album/album'
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