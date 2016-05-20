// Process @[prezi](preziID)

'use strict';


function prezi_parser(url){
    var regExp = /^https:\/\/prezi.com\/(.+?)\//;
    var match = url.match(regExp);
    if (match){
        return match[1];
    } else{
        return url;
    }
}

function prezi_embed(md) {
    function prezi_return(state, silent) {
        var code,
            serviceEnd,
            serviceStart,
            pos,
            res,
            preziID = '',
            tokens,
            token,
            start,
            oldPos = state.pos,
            max = state.posMax;

        // When we add more services, (youtube) might be (youtube|vimeo|vine), for example
        var EMBED_REGEX = /@\[(prezi)\]\([\s]*(.*?)[\s]*[\)]/im;


        if (state.src.charCodeAt(state.pos) !== 0x40/* @ */) {
            return false;
        }
        if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) {
            return false;
        }

        var match = EMBED_REGEX.exec(state.src);

        if(!match){
            return false;
        }

        if (match.length < 3){
            return false;
        }


        var service = match[1];
        var preziID = match[2];
        if(service.toLowerCase() == 'prezi') {
            preziID = prezi_parser(preziID);
        }

        // If the preziID field is empty, regex currently make it the close parenthesis.
        if (preziID === ')') {
            preziID = '';
        }

        serviceStart = state.pos + 2;
        serviceEnd = md.helpers.parseLinkLabel(state, state.pos + 1, false);

        //
        // We found the end of the link, and know for a fact it's a valid link;
        // so all that's left to do is to call tokenizer.
        //
        if (!silent) {
            state.pos = serviceStart;
            state.posMax = serviceEnd;
            state.service = state.src.slice(serviceStart, serviceEnd);
            var newState = new state.md.inline.State(
                service,
                state.md,
                state.env,
                tokens = []
            );
            newState.md.inline.tokenize(newState);

            token = state.push('prezi', '');
            token.preziID = preziID;
            token.service = service;
            token.level = state.level;
        }

        state.pos = state.pos + state.src.indexOf(')');
        state.posMax = state.tokens.length;
        return true;
    }
    return prezi_return;
}

function tokenize_return_wrapper(md) {
    function tokenize_return(tokens, idx, options, env, self) {
        var preziID = md.utils.escapeHtml(tokens[idx].preziID);
        var service = md.utils.escapeHtml(tokens[idx].service);
        if (preziID === '') {
            return '';
        }

       if (service.toLowerCase() === 'prezi'){
            var embedStart = '<div class="embed-responsive embed-responsive-16by9"><iframe id="iframe_container" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="https://prezi.com/embed/';
            var embedEnd = '/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5N1lQVHkxSHFxazZ0UUNCRHloSXZROHh3PT0&amp;landing_sign=1kD6c0N6aYpMUS0wxnQjxzSqZlEB8qNFdxtdjYhwSuI"></iframe></div>';
            return embedStart + preziID + embedEnd;
        } else {
            return('');
        }
    }
    return tokenize_return;
}

module.exports = function prezi_plugin(md) {
    md.renderer.rules.prezi = tokenize_return_wrapper(md);
    md.inline.ruler.before('emphasis', 'prezi', prezi_embed(md));
}