//- JavaScript source code

//- validate_doc_update.js ~~
//
//  Currently, this function disallows any document updates to the database.
//
//                                                      ~~ (c) SRW, 02 Dec 2011

function (newDoc, savedDoc, userCtx) {
    'use strict';

    throw {
        forbidden: 'Quanascope is not allowed to save data in CouchDB.'
    };

}

//- vim:set syntax=javascript:
