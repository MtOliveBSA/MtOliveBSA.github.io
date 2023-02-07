if(typeof roContainer === "undefined")
    roContainer = document.body;

function notifyResize(){
    var body = document.body,
    html = document.documentElement;

    var height = {
        "max": Math.max( roContainer.scrollHeight, roContainer.offsetHeight, body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
        "roContainer.scrollHeight": roContainer.scrollHeight, 
        "roContainer.offsetHeight": roContainer.offsetHeight, 
        "body.scrollHeight": body.scrollHeight, 
        "body.offsetHeight": body.offsetHeight, 
        "html.clientHeight": html.clientHeight, 
        "html.scrollHeight": html.scrollHeight, 
        "html.offsetHeight": html.offsetHeight
    };

    if(document.referrer == "https://www.leaguelineup.com/" || document.referrer == "https://mtolivebsa.github.io/newsletters/index.html?ref=llu")
        parent.postMessage(height, "https://www.leaguelineup.com/");
    else if(document.referrer == "https://mtolivebsa.github.io/newsletters/index.html?ref=ssu"){
        parent.postMessage(height, "https://mobasa.sportssignup.com/");
        parent.postMessage(height, "http://mobasa.sportssignup.com/");
    } else if(document.referrer == "https://mobasa.sportssignup.com/" || document.referrer == "http://mobasa.sportssignup.com/"){
        parent.postMessage(height, "https://mobasa.sportssignup.com/");
        parent.postMessage(height, "http://mobasa.sportssignup.com/");
    } else if(document.referrer == "https://mtolivebsa.github.io/newsletters/index.html?ref=se"){
        parent.postMessage(height, "https://mtolivebsa.sportsengine-prelive.com/");
        parent.postMessage(height, "http://mtolivebsa.sportsengine-prelive.com/");
        parent.postMessage(height, "https://mtolivebsa.sportngin.com/");
        parent.postMessage(height, "http://mtolivebsa.sportngin.com/");
    } else if(document.referrer == "https://mtolivebsa.sportsengine-prelive.com/" || document.referrer == "https://mtolivebsa.sportngin.com/"){
        parent.postMessage(height, "https://mtolivebsa.sportsengine-prelive.com/");
        parent.postMessage(height, "https://mtolivebsa.sportngin.com/");
    }
}
// create an Observer instance
const resizeObserver = new ResizeObserver( entries => {
    setTimeout(notifyResize(), 0);
});

// start observing a DOM node
if($.inFrame()){
    resizeObserver.observe(roContainer);
    notifyResize();
}
