function notifyResize(){
    var body = document.body,
    html = document.documentElement;

    var height = {
        "max": Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
        "body.scrollHeight": body.scrollHeight, 
        "body.offsetHeight": body.offsetHeight, 
        "html.clientHeight": html.clientHeight, 
        "html.scrollHeight": html.scrollHeight, 
        "html.offsetHeight": html.offsetHeight
    };
    
    parent.postMessage(height, "https://www.leaguelineup.com");
}
// create an Observer instance
const resizeObserver = new ResizeObserver( entries => {
    setTimeout(notifyResize(), 0);
});

// start observing a DOM node
if($.inFrame()){
    resizeObserver.observe(document.body);
    notifyResize();
}
