$(function(){
    // Parsing
    var qnums = {};
    var colors = ["#E91E63", "#1976D2", "#FBC02D", "#616161"];
    var cnum = 0;
    $("p").each(function(){
        var node = this;
        var html = node.innerHTML;
        // Quoting paragraph
        html = html.replace(/^\[\[([^:]+):(.+)\]\]$/, function(match, id, text){
            id = id.replace(/[^A-z]/, "").toUpperCase();
            qnums[id] = qnums[id] || {"ref": 0, "def": 0, "col": colors[cnum++]};
            node.setAttribute("class", "scit-quoting");
            node.setAttribute("data-qtarget", id+"_"+qnums[id].def);
            node.setAttribute("data-color", qnums[id].col);
            ++qnums[id].def;
            return text;
        });
        // Quoted spans, recursive
        //// Note about algorithm used here for recursive regex:
        //// While we have replacements to make
        ////// Replace [[ with [temp[ unless we've hit the bottom of the nesting
        ////// Otherwise, replace with formatted span tag
        //// Replace all [temp[ with [[ to return to the top of the stack and try again
        // This takes a few passes, but for what I have in mind, it suffices without
        // undue complexity.
        var dirty = true;
        while (dirty){
            var bottom = false;
            while (!bottom){
                bottom = true;
                html = html.replace(/\[\[([^|]+)\|([^\]]+)\]\]/, function(match, text, ids){
                    if (text.match(/\[\[/)){
                        bottom = false;
                        return '[temp['+text+'|'+ids+']]';
                    } else {
                        ids = ids.split(",");
                        var open = "";
                        var close = "";
                        for (var i in ids){
                            var id = ids[i];
                            qnums[id] = qnums[id] || {"ref": 0, "def": 0, "col": colors[cnum++]};
                            open += '<span class="scit-quoted" id="'+id+"_"+qnums[id].ref+'">&nbsp;';
                            close += '&nbsp;</span>';
                            ++qnums[id].ref;
                        }
                        return open+text+close;
                    }
                });
            }
            dirty = false;
            html = html.replace(/\[temp\[/g, "[[");
            if (html.match(/\[\[([^|]+)\|([^\]]+)\]\]/)){
                dirty = true;
            }
        }
        node.innerHTML = html;
    });

    // Handling
    var startTime = (new Date).getTime();
    $(".scit-quoting").each(function(){
        var node = this;
        var qid = node.getAttribute("data-qtarget");
        var qtarget = document.getElementById(qid);
        var color = node.getAttribute("data-color");
        var isOpen = false;
        node.style.borderColor = color;
        // gr = 1.61803398875, the golden ratio
        // gr = bigchunk / littlechunk
        // gr = whole / bigchunk
        // whole = innerheight
        // bigchunk = innerheight / gr
        // littlechunk = innerheight - bigchunk
        var littlechunk = innerHeight - (innerHeight/1.61803398875);
        var offset = 80; // TODO: don't hardcode this
        window.addEventListener("scroll", function(){
            if (!isOpen &&                                             // not already opened
              (new Date).getTime() - startTime >= 3000 &&              // not too soon to be realistic
              qtarget.getBoundingClientRect().top <= innerHeight/5 &&  // not high enough on screen
              qtarget.getBoundingClientRect().top != 0){               // not hidden from view
                node.style.display = "block";
                node.style.height = "auto";
                var height = $(node).height();
                node.style.height = "";
                $(node).animate({"height": height+"px", "padding": "1em"}, {
                    "duration": "slow",
                    "complete": function(){node.style.height = "auto"}
                });
                qtarget.style.borderColor = color;
                isOpen = true;
            }
        });
    });
});