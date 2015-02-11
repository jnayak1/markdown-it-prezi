// Process @[youtube](youtubeVideoID)

'use strict';

function video_embed(md) {
  function video_return(state, silent) {
    var code,
        serviceEnd,
        serviceStart,
        pos,
        res,
        videoID = '',
        tokens,
        start,
        oldPos = state.pos,
        max = state.posMax;

    if (state.src.charCodeAt(state.pos) !== 0x40/* @ */) { return false; }
    if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) { return false; }

    serviceStart = state.pos + 2;
    serviceEnd = md.helpers.parseLinkLabel(state, state.pos + 1, false);

    // parser failed to find ']', so it's not a valid link
    if (serviceEnd < 0) { return false; }

    pos = serviceEnd + 1;
    if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {

      //
      // Inline link
      //

      // [service](  <videoID>  "title"  )
      //    ^^ skipping these spaces
      pos++;
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (code !== 0x20 && code !== 0x0A) { break; }
      }
      if (pos >= max) { return false; }

      // [service](  <videoID>  "title"  )
      //      ^^^^^^ parsing link destination
      start = pos;
      res = md.helpers.parseLinkDestination(state.src, pos, state.posMax);
      if (res.ok && state.md.inline.validateLink(res.str)) {
        videoID = res.str;
        pos = res.pos;
      } else {
        videoID = '';
      }

      // [link](  <videoID>  "title"  )
      //        ^^ skipping these spaces
      start = pos;
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (code !== 0x20 && code !== 0x0A) { break; }
      }


      if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
        state.pos = oldPos;
        return false;
      }
      pos++;

    }
    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
        state.pos = serviceStart;
        state.posMax = serviceEnd;
        state.service = state.src.slice(serviceStart, serviceEnd);
      var newState = new state.md.inline.State(
        state.service,
        state.md,
        state.env,
        tokens = []
      );
      newState.md.inline.tokenize(newState);

      state.push({
          type: 'video',
          videoID: videoID,
          tokens: tokens,
          service: state.service,
          level: state.level
      });
    }

    state.pos = pos;
    state.posMax = max;
    return true;
  }
    return video_return;
}

function tokenize_youtube(videoID) {
    var embedStart = '<iframe id="ytplayer" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/';
    var embedEnd = '" frameborder="0"/>';
    return  embedStart + videoID + embedEnd;
}

function tokenize_video(md) {
    function tokenize_return(tokens, idx, options, env, self) {
        var videoID = md.utils.escapeHtml(tokens[idx].videoID);
        var service = md.utils.escapeHtml(tokens[idx].service);
        if (service.toLowerCase() === 'youtube'){
            return tokenize_youtube(videoID);
        }

    }

    return tokenize_return;
}

function video_plugin(md) {
    md.renderer.rules.video = tokenize_video(md);
    md.inline.ruler.before('emphasis', 'video', video_embed(md));
}

module.exports = video_plugin;
